import { NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/server-auth"

type ChatMessage = {
  role: "system" | "user" | "assistant"
  content: string
}

const systemPrompt = `你是 Xiaobai Nexus 手机端里的小白 AI 助手。
用户正在用自己的模型 API 进行普通问答，不是在让电脑端 Agent 执行任务。
回答要求：
1. 用简体中文，直接、清楚、可执行。
2. 遇到需要电脑端执行、文件操作、热点/网络设置、发布、删除、付款、发消息等动作时，只能说明需要切换到 Xiaobai Nexus 模式并等待确认，不能假装已经执行。
3. 不要自称底层模型名称；你是 Xiaobai Nexus 的问答入口。
4. 如果用户问模型配置问题，优先帮他检查 Base URL、API Key、模型名、OpenAI Compatible 格式和网络错误。`

const providerHostAllowList = [
  "api.deepseek.com",
  "api.moonshot.cn",
  "api.minimax.io",
  "api.openai.com",
  "openrouter.ai",
  "dashscope.aliyuncs.com",
]

const defaultBaseUrl = (process.env.MOBILE_CHAT_DEFAULT_BASE_URL || process.env.AI_CHAT_BASE_URL || process.env.OPENAI_BASE_URL || "https://api.deepseek.com").replace(/\/+$/, "")
const defaultApiKey = process.env.MOBILE_CHAT_DEFAULT_API_KEY || process.env.AI_CHAT_API_KEY || process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY || ""
const defaultModel = process.env.MOBILE_CHAT_DEFAULT_MODEL || process.env.AI_CHAT_MODEL || process.env.DEEPSEEK_MODEL || "deepseek-v4-flash"
const chatModelAssetTypes = ["chat_model", "agent_model", "model_config"]

function jsonError(error: string, status = 400) {
  return NextResponse.json({ error }, { status })
}

function normalizeBaseUrl(value: unknown) {
  const raw = String(value || "").trim().replace(/\/+$/, "")
  if (!raw) return ""
  return raw.endsWith("/v1") ? raw : `${raw}/v1`
}

function safeString(value: unknown, limit: number) {
  return String(value || "").trim().slice(0, limit)
}

function isAllowedBaseUrl(value: string) {
  try {
    const url = new URL(value)
    if (url.protocol !== "https:") return false
    return providerHostAllowList.some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`))
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const content = safeString(body?.content, 6000)
  const modelConfig = body?.modelConfig && typeof body.modelConfig === "object" ? body.modelConfig : null
  const desktopConfig = modelConfig?.useDesktopModel ? await desktopChatModelFromAgent(req) : null
  const baseUrl = normalizeBaseUrl(modelConfig?.baseUrl || desktopConfig?.baseUrl || defaultBaseUrl)
  const apiKey = safeString(modelConfig?.apiKey || desktopConfig?.apiKey || defaultApiKey, 300)
  const model = safeString(modelConfig?.model || desktopConfig?.model || defaultModel, 120)
  const providerLabel = safeString(modelConfig?.providerLabel || desktopConfig?.providerLabel || "DeepSeek 默认", 80)

  if (!content) return jsonError("缺少聊天内容。")
  if (!baseUrl || !apiKey || !model) return jsonError("小白默认 DeepSeek 问答入口还没有配置服务端 API Key；你也可以在手机端填写自己的 Base URL、API Key 和模型名。", 503)
  if (!isAllowedBaseUrl(baseUrl)) return jsonError("当前 Base URL 暂未开放代理调用。请使用 DeepSeek、Kimi、MiniMax、OpenAI、OpenRouter 或通义千问的官方 HTTPS API 地址。")

  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content },
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
      signal: AbortSignal.timeout(30000),
    })

    if (!response.ok) {
      const detail = await response.text()
      console.error("[mobile-chat]", {
        status: response.status,
        providerLabel,
        model,
        detail: detail.slice(0, 500),
      })
      return jsonError(`模型接口返回 ${response.status}：${detail.slice(0, 240) || response.statusText}`, 502)
    }

    const data = await response.json()
    const answer = data?.choices?.[0]?.message?.content || ""
    return NextResponse.json({
      answer: answer || "模型已响应，但没有返回文本内容。",
      provider: providerLabel,
      model,
    })
  } catch (error: any) {
    return jsonError(`模型请求失败：${error?.message || "request failed"}`, 502)
  }
}

async function desktopChatModelFromAgent(req: NextRequest) {
  const auth = await requireUser(req)
  if (!auth.ok) return null
  const { data, error } = await auth.adminSupabase
    .from("agent_remote_assets")
    .select("asset_type,payload,updated_at")
    .eq("user_id", auth.user.id)
    .in("asset_type", chatModelAssetTypes)
    .order("updated_at", { ascending: false })
    .limit(20)
  if (error) return null

  const candidates = (data || [])
    .map((item: any) => normalizeDesktopChatModel(item?.payload, item?.asset_type))
    .filter(Boolean) as any[]
  return candidates.find((item) => item.preferred)
    || candidates.find((item) => item.costTier === "free" || item.costTier === "low")
    || candidates[0]
    || null
}

function normalizeDesktopChatModel(payload: any, assetType = "") {
  const source = payload && typeof payload === "object" ? payload : {}
  const selected = source.chatModel || source.defaultChatModel || source.lowCostModel || source.selected || source
  const baseUrl = safeString(selected.baseUrl || selected.base_url || source.baseUrl || source.base_url, 240)
  const apiKey = safeString(selected.apiKey || selected.api_key || source.apiKey || source.api_key, 300)
  const model = safeString(selected.model || selected.modelName || selected.observed_model || selected.name, 120)
  if (!baseUrl || !apiKey || !model) return null
  return {
    source: "desktop-agent",
    assetType,
    baseUrl,
    apiKey,
    model,
    providerLabel: safeString(selected.providerLabel || selected.label || source.providerLabel || source.title || "电脑端模型", 80),
    preferred: Boolean(selected.preferred || selected.default || source.preferred || source.defaultChatModel),
    costTier: safeString(selected.costTier || selected.cost_tier || source.costTier || source.cost_tier || "low", 24),
  }
}
