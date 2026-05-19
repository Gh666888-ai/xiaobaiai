import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { bearerToken, createServerSupabase, hasSupabaseConfig, requireUser } from "@/lib/server-auth"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const assetResources = new Set(["projects", "images", "files", "apps", "skills", "memories"])
const assetTypeByResource: Record<string, string> = {
  projects: "project",
  images: "image",
  files: "file",
  apps: "app",
  skills: "skill",
  memories: "memory",
}
const chatModelAssetTypes = ["chat_model", "agent_model", "model_config"]
const agentOnlineWindowMs = 120000

function jsonError(error: string, status = 400) {
  return NextResponse.json({ error }, { status })
}

function freshAgentOnline(row: any) {
  const timestamp = Date.parse(row?.last_seen_at || row?.updated_at || "")
  if (!row?.online || !Number.isFinite(timestamp)) return false
  const age = Date.now() - timestamp
  return age >= 0 && age <= agentOnlineWindowMs
}

function limitFrom(req: NextRequest, fallback = 20) {
  const value = Number(new URL(req.url).searchParams.get("limit") || fallback)
  return Math.max(1, Math.min(100, Number.isFinite(value) ? value : fallback))
}

function setupResponse(resource: string) {
  const key = resource === "devices" ? "devices"
    : resource === "tasks" ? "tasks"
      : resource === "conversations" ? "messages"
        : resource === "delegations" ? "jobs"
          : resource
  return NextResponse.json({
    [key]: [],
    items: [],
    setupRequired: true,
    message: "远程中继表还没有部署。请在 Supabase 执行最新 supabase.sql 后，桌面端小白就能同步真实设备、任务和资产。",
  })
}

function isMissingTable(error: any) {
  return String(error?.code || "") === "42P01" || /does not exist|schema cache/i.test(String(error?.message || ""))
}

function safeText(value: unknown, limit: number) {
  return String(value || "").trim().slice(0, limit)
}

function createAuthSupabase() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, signal: init?.signal ?? AbortSignal.timeout(12000) }),
    },
  })
}

async function userFromQueryOrHeader(req: NextRequest) {
  if (!hasSupabaseConfig()) return { ok: false as const, error: "服务器 Supabase 配置缺失。", status: 500 }
  const token = bearerToken(req) || new URL(req.url).searchParams.get("token") || ""
  if (!token) return { ok: false as const, error: "请先登录。", status: 401 }
  const adminSupabase = createServerSupabase()
  const { data, error } = await adminSupabase.auth.getUser(token)
  if (error || !data.user) return { ok: false as const, error: "登录已过期，请重新登录。", status: 401 }
  return { ok: true as const, adminSupabase, user: { id: data.user.id, email: data.user.email }, token }
}

export async function GET(req: NextRequest, { params }: { params: { resource: string } }) {
  const resource = params.resource

  if (resource === "events") {
    const auth = await userFromQueryOrHeader(req)
    if (!auth.ok) return jsonError(auth.error, auth.status)
    const body = `event: ready\ndata: ${JSON.stringify({ type: "ready", at: new Date().toISOString() })}\n\n`
    return new Response(body, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    })
  }

  const auth = await requireUser(req)
  if (!auth.ok) return jsonError(auth.error, auth.status)
  const limit = limitFrom(req)

  if (resource === "devices") {
    const { data, error } = await auth.adminSupabase
      .from("agent_remote_devices")
      .select("id,device_key,device_name,online,last_seen_at,capabilities,snapshot,updated_at")
      .eq("user_id", auth.user.id)
      .order("last_seen_at", { ascending: false })
      .limit(limit)
    if (error) return isMissingTable(error) ? setupResponse(resource) : jsonError("设备同步读取失败。", 500)
    const devices = (data || []).map((device: any) => {
      const freshOnline = freshAgentOnline(device)
      return {
        ...device,
        rawOnline: Boolean(device.online),
        online: freshOnline,
        freshOnline,
        onlineWindowSeconds: Math.round(agentOnlineWindowMs / 1000),
      }
    })
    return NextResponse.json({ devices, items: devices })
  }

  if (resource === "tasks") {
    const { data, error } = await auth.adminSupabase
      .from("agent_remote_tasks")
      .select("id,device_id,channel,content,status,result,error,created_at,updated_at")
      .eq("user_id", auth.user.id)
      .order("created_at", { ascending: false })
      .limit(limit)
    if (error) return isMissingTable(error) ? setupResponse(resource) : jsonError("任务同步读取失败。", 500)
    return NextResponse.json({ tasks: data || [], items: data || [] })
  }

  if (resource === "conversations") {
    const { data, error } = await auth.adminSupabase
      .from("agent_remote_messages")
      .select("id,device_id,task_id,role,content,created_at")
      .eq("user_id", auth.user.id)
      .order("created_at", { ascending: false })
      .limit(limitFrom(req, 80))
    if (error) return isMissingTable(error) ? setupResponse(resource) : jsonError("会话同步读取失败。", 500)
    return NextResponse.json({ messages: (data || []).reverse(), items: (data || []).reverse() })
  }

  if (resource === "health") {
    const { count, error } = await auth.adminSupabase
      .from("agent_remote_devices")
      .select("id", { count: "exact", head: true })
      .eq("user_id", auth.user.id)
    if (error) return isMissingTable(error) ? NextResponse.json({ ok: true, counts: { devices: 0 }, setupRequired: true }) : jsonError("远程健康检查失败。", 500)
    return NextResponse.json({ ok: true, counts: { devices: count || 0 }, checkedAt: new Date().toISOString() })
  }

  if (resource === "chat-model") {
    const { data, error } = await auth.adminSupabase
      .from("agent_remote_assets")
      .select("id,asset_type,payload,updated_at")
      .eq("user_id", auth.user.id)
      .in("asset_type", chatModelAssetTypes)
      .order("updated_at", { ascending: false })
      .limit(20)
    if (error) return isMissingTable(error) ? NextResponse.json({ chatModel: null, items: [], setupRequired: true }) : jsonError("问答模型同步读取失败。", 500)
    const chatModel = pickDesktopChatModel(data || [])
    return NextResponse.json({ chatModel, model: chatModel, items: data || [] })
  }

  if (resource === "delegations") {
    const { data, error } = await auth.adminSupabase
      .from("agent_remote_assets")
      .select("id,asset_type,payload,updated_at")
      .eq("user_id", auth.user.id)
      .in("asset_type", ["agent_model", "delegation"])
      .order("updated_at", { ascending: false })
      .limit(limit)
    if (error) return isMissingTable(error) ? NextResponse.json({ jobs: [], models: [], items: [], setupRequired: true }) : jsonError("能力同步读取失败。", 500)
    const rows = data || []
    return NextResponse.json({
      jobs: rows.filter((item: any) => item.asset_type === "delegation").map(assetRow),
      models: rows.filter((item: any) => item.asset_type === "agent_model").map((item: any) => ({ ...item.payload, title: item.payload?.title, selected: item.payload || {} })),
      items: rows,
    })
  }

  if (resource === "approvals") {
    const { data, error } = await auth.adminSupabase
      .from("agent_remote_tasks")
      .select("id,content,status,result,error,created_at,updated_at")
      .eq("user_id", auth.user.id)
      .eq("channel", "MOBILE_APPROVAL")
      .order("created_at", { ascending: false })
      .limit(limit)
    if (error) return isMissingTable(error) ? setupResponse(resource) : jsonError("确认请求读取失败。", 500)
    return NextResponse.json({ approvals: data || [], items: data || [] })
  }

  if (assetResources.has(resource)) {
    const type = assetTypeByResource[resource] || resource.slice(0, -1)
    const { data, error } = await auth.adminSupabase
      .from("agent_remote_assets")
      .select("id,asset_type,payload,updated_at")
      .eq("user_id", auth.user.id)
      .eq("asset_type", type)
      .order("updated_at", { ascending: false })
      .limit(limit)
    if (error) return isMissingTable(error) ? setupResponse(resource) : jsonError("资产同步读取失败。", 500)
    const rows = (data || []).map(assetRow)
    return NextResponse.json({ [resource]: rows, items: rows })
  }

  return jsonError("未知远程资源。", 404)
}

export async function POST(req: NextRequest, { params }: { params: { resource: string } }) {
  const resource = params.resource
  const body = await req.json().catch(() => null)

  if (resource === "login") {
    if (!supabaseUrl || !supabaseAnonKey) return jsonError("服务器登录配置缺失。", 500)
    const account = safeText(body?.account || body?.email, 160)
    const password = String(body?.password || "")
    if (!account || !password) return jsonError("请填写账号和密码。")
    const { data, error } = await createAuthSupabase().auth.signInWithPassword({ email: account, password })
    if (error || !data.session || !data.user) return jsonError("账号或密码错误，请确认这是小白AI网站会员账号。", 401)
    return NextResponse.json({
      user: { id: data.user.id, email: data.user.email || account, name: data.user.user_metadata?.name || data.user.email?.split("@")[0] || "用户" },
      token: data.session.access_token,
      sessionToken: data.session.access_token,
      sessionId: data.session.refresh_token,
      expiresAt: data.session.expires_at,
    })
  }

  const auth = await requireUser(req)
  if (!auth.ok) return jsonError(auth.error, auth.status)

  if (resource === "tasks") {
    const payload = {
      user_id: auth.user.id,
      device_id: safeText(body?.deviceId, 120) || null,
      channel: safeText(body?.channel || "MOBILE_APP", 40),
      content: safeText(body?.content, 8000),
      status: "pending",
      model_preference: body?.modelPreference || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    if (!payload.content) return jsonError("任务内容不能为空。")
    const { data, error } = await auth.adminSupabase
      .from("agent_remote_tasks")
      .insert({
        user_id: payload.user_id,
        device_id: payload.device_id,
        channel: payload.channel,
        content: payload.content,
        status: payload.status,
        created_at: payload.created_at,
        updated_at: payload.updated_at,
      })
      .select("id,device_id,channel,content,status,created_at,updated_at")
      .single()
    if (error) return isMissingTable(error) ? jsonError("远程任务表还没有部署，请先执行最新 supabase.sql。", 503) : jsonError("任务下发失败。", 500)

    try {
      await auth.adminSupabase.from("agent_remote_messages").insert({
        user_id: auth.user.id,
        device_id: data.device_id || null,
        task_id: data.id,
        role: "user",
        content: payload.content,
        created_at: payload.created_at,
      })
    } catch {
      // Task delivery should not fail just because the conversation mirror is unavailable.
    }

    return NextResponse.json({ ok: true, task: data })
  }

  return jsonError("未知远程动作。", 404)
}

function assetRow(item: any) {
  const payload = item?.payload && typeof item.payload === "object" ? item.payload : {}
  return {
    id: item.id,
    type: item.asset_type,
    title: payload.title || payload.name || payload.filename || payload.appName || item.asset_type,
    subtitle: payload.subtitle || payload.summary || payload.description || "",
    status: payload.status || "",
    url: payload.url || "",
    payload,
    updated_at: item.updated_at,
  }
}

function pickDesktopChatModel(rows: any[]) {
  const candidates = rows
    .map((item) => {
      const payload = item?.payload && typeof item.payload === "object" ? item.payload : {}
      return normalizeDesktopChatModel(payload, item?.asset_type)
    })
    .filter(Boolean) as any[]
  return candidates.find((item) => item.preferred)
    || candidates.find((item) => item.costTier === "free" || item.costTier === "low")
    || candidates[0]
    || null
}

function normalizeDesktopChatModel(payload: any, assetType = "") {
  const selected = payload.chatModel || payload.defaultChatModel || payload.lowCostModel || payload.selected || payload
  const model = safeText(selected.model || selected.modelName || selected.observed_model || selected.name, 120)
  const provider = safeText(selected.provider || selected.providerId || payload.provider || payload.providerId, 60)
  const baseUrl = safeText(selected.baseUrl || selected.base_url || payload.baseUrl || payload.base_url, 240)
  const apiKey = safeText(selected.apiKey || selected.api_key || payload.apiKey || payload.api_key, 300)
  const providerLabel = safeText(selected.providerLabel || selected.label || payload.providerLabel || payload.title || "电脑端模型", 80)
  if (!baseUrl || !apiKey || !model) return null
  return {
    source: "desktop-agent",
    assetType,
    provider,
    providerLabel,
    baseUrl,
    apiKey,
    model,
    preferred: Boolean(selected.preferred || selected.default || payload.preferred || payload.defaultChatModel),
    costTier: safeText(selected.costTier || selected.cost_tier || payload.costTier || payload.cost_tier || "low", 24),
    updatedAt: payload.updatedAt || payload.updated_at || null,
  }
}
