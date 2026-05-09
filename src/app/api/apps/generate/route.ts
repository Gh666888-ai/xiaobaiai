import { NextRequest, NextResponse } from "next/server"
import { generateAppHtml, type AppTemplateId } from "@/data/app-templates"

type AppGenerateBody = {
  templateId?: AppTemplateId
  appKind?: string
  demand?: string
  industry?: string
  goal?: string
  audience?: string
  style?: string
  contact?: string
}

const validTemplateIds: AppTemplateId[] = ["site-hero", "lead-form", "quote-calculator", "product-page", "click-game", "chat-app"]

function clean(value: unknown, fallback: string) {
  const text = String(value || "").trim()
  return text || fallback
}

function normalizeTemplateId(value: unknown): AppTemplateId {
  return validTemplateIds.includes(value as AppTemplateId) ? (value as AppTemplateId) : "site-hero"
}

function stripCodeFence(text: string) {
  return text
    .replace(/^```(?:html)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim()
}

function sanitizeGeneratedHtml(html: string) {
  const cleaned = stripCodeFence(html)
  if (!cleaned.toLowerCase().includes("<!doctype html") && !cleaned.toLowerCase().includes("<html")) return ""
  return cleaned
    .replace(/<script\b[^>]*\bsrc\s*=\s*["'][^"']*["'][^>]*>\s*<\/script>/gi, "")
    .replace(/<iframe\b[\s\S]*?<\/iframe>/gi, "")
}

function fallbackHtml(body: Required<AppGenerateBody>) {
  return generateAppHtml({
    templateId: body.templateId,
    industry: body.industry,
    goal: body.goal,
    audience: body.audience,
    style: body.style,
    contact: body.contact,
  })
}

function buildPrompt(body: Required<AppGenerateBody>) {
  return `你是“小白AI应用工坊”的桌面 APP 界面生成智能体。用户填写一张应用需求模板，你要直接生成一个可以在 iframe 里运行的完整 HTML 桌面 APP 原型。

用户需求：
${body.demand}

小白拆解：
- 应用类型：${body.templateId}
- 小白判断的真实应用类型：${body.appKind}
- 行业/业务：${body.industry}
- 目标用户：${body.audience}
- 目标：${body.goal}
- 风格：${body.style}
- 主按钮文案：${body.contact}

硬性要求：
1. 只输出完整 HTML，不要解释，不要 Markdown，不要代码围栏。
2. 必须包含 <!doctype html>、html、head、style、body。
3. 所有 CSS 和 JS 都写在同一个 HTML 里，不要引用外部 CDN、图片、字体、脚本。
4. 不能生成营销空页面，也不能把所有需求都套成“获客成交页”。必须生成用户真正要的“桌面 APP 界面”。用户要做聊天软件，就必须是聊天软件；用户要排班系统，就必须有排班表；用户要点餐系统，就必须有菜单、购物车、下单流程；用户要记账，就必须有账单列表、分类、统计和新增记录。
5. 第一屏要像一个已经打开的桌面软件：有左侧导航或顶部工具栏，有主工作区，有数据列表/看板/聊天区/表格/统计区，不允许做宣传页。
6. 至少做 4 个真实模块或页面，用左侧导航、顶部标签或桌面软件式菜单切换。
7. 至少有 2 个可交互动作，例如：发送消息、添加记录、切换标签、计算报价、添加购物车、完成任务、筛选列表。
8. 文案必须贴合用户需求，不要出现“这是用户决策前需要看到的信息”这种空话。
9. 视觉要像高质量桌面端 SaaS / 管理系统 / 工具应用原型，布局清晰，字体足够大，按钮和表格要像真实可用的软件。
10. 生成内容必须是安全的前端原型，不要请求外部接口，不要收集真实隐私。
11. 不要写“欢迎来到”“立即咨询”“联系我们”这类落地页话术，除非用户明确要获客页。重点展示应用可操作界面。

不同需求必须明显不同：
- 聊天社交：会话列表、聊天窗口、通讯录、发现、我的、发送消息。
- 餐饮点餐：菜品分类、菜单卡片、购物车、桌号、下单确认。
- 排班考勤：员工列表、周排班表、班次选择、请假/调班状态。
- 记账财务：新增收入/支出、分类账单、月度统计、预算进度。
- 库存进销存：商品库存、入库、出库、预警、供应商。
- CRM：客户列表、跟进记录、商机阶段、提醒、成交金额。
- 招聘：岗位、候选人、面试安排、评价、录用状态。
- 学习训练：课程、任务、练习、进度、复盘。
- 工单售后：提交工单、派单、处理进度、优先级、评价。
- 社区问答：帖子列表、评论、采纳/置顶、经验值。
- AI 助手：对话区、知识库、工具调用记录、任务结果。

如果用户需求是“微信一样的聊天软件”，必须包含：
- 左侧或首页会话列表
- 聊天窗口
- 输入框和发送按钮，发送后消息出现在聊天区
- 通讯录
- 发现
- 我的
- 移动端底部导航视觉

现在直接输出完整 HTML。`
}

export async function POST(req: NextRequest) {
  const raw = (await req.json()) as AppGenerateBody
  const body: Required<AppGenerateBody> = {
    templateId: normalizeTemplateId(raw.templateId),
    appKind: clean(raw.appKind, "按客户需求定制的业务应用"),
    demand: clean(raw.demand, raw.goal || "生成一个小白AI应用"),
    industry: clean(raw.industry, "通用业务"),
    goal: clean(raw.goal, raw.demand || "生成一个可用应用"),
    audience: clean(raw.audience, "目标用户"),
    style: clean(raw.style, "简洁科技"),
    contact: clean(raw.contact, "立即使用"),
  }

  const fallback = fallbackHtml(body)
  const apiKey = process.env.AI_APP_FACTORY_API_KEY || process.env.AI_CHAT_API_KEY || process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY
  const baseUrl = (process.env.AI_APP_FACTORY_BASE_URL || process.env.AI_CHAT_BASE_URL || process.env.OPENAI_BASE_URL || "https://api.deepseek.com").replace(/\/$/, "")
  const model = process.env.AI_APP_FACTORY_MODEL || process.env.AI_CHAT_MODEL || process.env.DEEPSEEK_MODEL || "deepseek-v4-flash"

  if (!apiKey) {
    return NextResponse.json({ html: fallback, mode: "fallback", hint: "AI_APP_FACTORY_API_KEY/AI_CHAT_API_KEY 未配置，当前使用本地兜底生成。" })
  }

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: "你是小白AI应用工坊的前端应用生成智能体，只输出完整 HTML。" },
          { role: "user", content: buildPrompt(body) },
        ],
        temperature: 0.25,
        max_tokens: 6500,
      }),
    })

    if (!response.ok) {
      const detail = await response.text()
      console.error("[apps:generate]", { status: response.status, model, detail: detail.slice(0, 500) })
      return NextResponse.json({ html: fallback, mode: "fallback", error: detail.slice(0, 500) })
    }

    const data = await response.json()
    const html = sanitizeGeneratedHtml(data?.choices?.[0]?.message?.content || "")
    if (!html) return NextResponse.json({ html: fallback, mode: "fallback", error: "empty_or_invalid_html" })
    return NextResponse.json({ html, mode: "ai", model })
  } catch (error: any) {
    return NextResponse.json({ html: fallback, mode: "fallback", error: error?.message || "request failed" })
  }
}
