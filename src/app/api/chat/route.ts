import { NextRequest, NextResponse } from "next/server"

type ChatMessage = {
  role: "system" | "user" | "assistant"
  content: string
}

const systemPrompt = `你是小白AI网站里的站内助手，名字叫“小白AI助手”。
你的目标是帮助中文新手快速理解 AI、选择工具、拆解需求、找到学习路径。
回答要求：
1. 用简体中文，语气清楚、耐心、直接。
2. 先给结论，再给步骤。
3. 面向不懂电脑的小白时要一步一步说。
4. 对医疗、法律、金融、投资和账号安全相关问题必须提醒用户做人工核验。
5. 不提供规避平台规则、绕过安全限制、盗号、隐私窃取、违法采集等内容。
6. 优先引导用户使用站内页面：/choose-tool 工具选择器，/learn 学习路径，/models 模型排行，/community 社区案例，/growth AI成长舱。`

function fallbackReply(message: string) {
  const text = message.toLowerCase()
  if (text.includes("工具") || text.includes("推荐") || text.includes("写作") || text.includes("编程") || text.includes("做图")) {
    return "我建议你先用站内的「AI 工具选择器」：/choose-tool。你只要回答用途、水平、预算和网络偏好，我会给你推荐工具和学习路径。\n\n如果你想先手动选：\n1. 写作/总结：Kimi、DeepSeek、豆包。\n2. 编程：Cursor、通义灵码、Claude Code 或 Cline + DeepSeek。\n3. 做图：即梦、通义万相、Stable Diffusion。\n4. 客服/知识库：Dify、Coze、FastGPT。\n5. 自动化：n8n、Dify、OpenClaw。"
  }
  if (text.includes("学习") || text.includes("不会") || text.includes("小白") || text.includes("入门")) {
    return "如果你完全不会 AI，建议按这个顺序走：\n\n1. 先去 /growth 打卡，建立每天 10 分钟的节奏。\n2. 再去 /learn/0，看「了解 AI 和 Agent」。\n3. 然后用 /choose-tool 选一个你今天能用上的工具。\n4. 最后去 /community 看别人真实踩坑和实战案例。\n\n小白阶段不要追求一次学完，先让 AI 帮你完成一个真实小任务。"
  }
  if (text.includes("模型") || text.includes("价格") || text.includes("deepseek") || text.includes("gpt")) {
    return "模型选择可以先看 /models。简单建议：\n\n1. 日常中文问答：DeepSeek、Kimi、通义千问。\n2. 复杂编程：Claude、GPT、Qwen Coder。\n3. 低成本批量处理：DeepSeek API。\n4. 隐私数据：优先本地模型，比如 Qwen、DeepSeek R1、GLM。\n\n模型价格变化很快，正式接入前一定要复核官方价格页。"
  }
  if (text.includes("部署") || text.includes("安装") || text.includes("本地")) {
    return "部署类问题建议先走 /learn 里的安装章节。通用顺序是：\n\n1. 判断电脑配置：内存、显卡、系统。\n2. 如果只是日常使用，先用云端 API，少折腾。\n3. 如果有隐私数据或高频使用，再考虑 Ollama/LM Studio 本地模型。\n4. Agent 工具先从 Dify、Coze、QClaw 入门，再进 OpenClaw/Hermes。\n\n你也可以把你的电脑配置发给我，我可以帮你选最省事的方案。"
  }
  return "可以，我先帮你拆成三步：\n\n1. 你想让 AI 帮你完成什么结果？比如写文章、做图、写代码、做客服、做自动化。\n2. 你现在有什么材料？比如文档、表格、网页、图片、业务规则。\n3. 你希望输出成什么？比如一篇文章、一个表格、一个流程、一个工具推荐。\n\n你可以直接按这个格式发给我：\n「我的目标是……我现在有……我希望得到……」"
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const userMessage = String(body.message || "").trim()
  const history = Array.isArray(body.messages) ? body.messages.slice(-8) : []

  if (!userMessage) return NextResponse.json({ error: "empty message" }, { status: 400 })

  const apiKey = process.env.AI_CHAT_API_KEY || process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY
  const baseUrl = (process.env.AI_CHAT_BASE_URL || process.env.OPENAI_BASE_URL || "https://api.deepseek.com").replace(/\/$/, "")
  const model = process.env.AI_CHAT_MODEL || process.env.DEEPSEEK_MODEL || "deepseek-chat"

  if (!apiKey) {
    return NextResponse.json({
      reply: fallbackReply(userMessage),
      mode: "fallback",
      hint: "服务器未配置 AI_CHAT_API_KEY/DEEPSEEK_API_KEY/OPENAI_API_KEY，当前使用本地兜底回复。",
    })
  }

  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    ...history
      .filter((item: any) => item && ["user", "assistant"].includes(item.role) && typeof item.content === "string")
      .map((item: any) => ({ role: item.role, content: item.content })),
    { role: "user", content: userMessage },
  ]

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.4,
        max_tokens: 1200,
      }),
    })

    if (!response.ok) {
      const detail = await response.text()
      return NextResponse.json({ reply: fallbackReply(userMessage), mode: "fallback", error: detail.slice(0, 500) })
    }

    const data = await response.json()
    const reply = data?.choices?.[0]?.message?.content || fallbackReply(userMessage)
    return NextResponse.json({ reply, mode: "ai", model })
  } catch (error: any) {
    return NextResponse.json({ reply: fallbackReply(userMessage), mode: "fallback", error: error?.message || "request failed" })
  }
}
