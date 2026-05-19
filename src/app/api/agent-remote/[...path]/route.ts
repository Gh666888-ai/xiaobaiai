import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { createServerSupabase, requireUser } from "@/lib/server-auth"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

function parts(ctx: { params: { path?: string[] } }) {
  return ctx.params.path || []
}

function admin() {
  return createServerSupabase()
}

function publicAuthClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, signal: init?.signal ?? AbortSignal.timeout(12000) }),
    },
  })
}

function limitFrom(req: NextRequest, fallback = 20, max = 100) {
  const value = Number(new URL(req.url).searchParams.get("limit") || fallback)
  return Math.max(1, Math.min(max, Number.isFinite(value) ? value : fallback))
}

function normalizeDevice(body: any, userId: string) {
  const now = new Date().toISOString()
  const deviceName = String(body?.deviceName || body?.device_name || "我的电脑小白").trim().slice(0, 80)
  const deviceKey = String(body?.deviceKey || body?.device_key || "").trim().slice(0, 160)
  if (!deviceKey) throw new Error("deviceKey required")
  return {
    user_id: userId,
    device_key: deviceKey,
    device_name: deviceName,
    online: body?.online !== false,
    capabilities: body?.capabilities && typeof body.capabilities === "object" ? body.capabilities : {},
    snapshot: body?.snapshot && typeof body.snapshot === "object" ? body.snapshot : {},
    last_seen_at: now,
    updated_at: now,
  }
}

async function currentUser(req: NextRequest) {
  const auth = await requireUser(req)
  if (!auth.ok) return auth
  return auth
}

export async function POST(req: NextRequest, ctx: { params: { path?: string[] } }) {
  const path = parts(ctx)

  if (path[0] === "login") {
    if (!supabaseUrl || !supabaseAnonKey) return jsonError("Supabase auth is not configured.", 500)
    const body = await req.json().catch(() => null)
    const account = String(body?.account || body?.email || "").trim()
    const password = String(body?.password || "")
    if (!account || !password) return jsonError("请输入网站会员账号和密码。")

    const { data, error } = await publicAuthClient().auth.signInWithPassword({ email: account, password })
    if (error || !data.session || !data.user) return jsonError(error?.message || "登录失败。", 401)
    return NextResponse.json({
      token: data.session.access_token,
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
        token_type: data.session.token_type,
      },
      user: {
        id: data.user.id,
        email: data.user.email || account,
        name: data.user.user_metadata?.name || data.user.email?.split("@")[0] || "小白用户",
      },
    })
  }

  const auth = await currentUser(req)
  if (!auth.ok) return jsonError(auth.error, auth.status)
  const db = admin()
  const body = await req.json().catch(() => ({}))

  if (path[0] === "devices") {
    try {
      const payload = normalizeDevice(body, auth.user.id)
      const { data, error } = await db
        .from("agent_remote_devices")
        .upsert(payload, { onConflict: "user_id,device_key" })
        .select("*")
        .single()
      if (error) return jsonError(error.message, 500)
      return NextResponse.json({ device: data })
    } catch (error: any) {
      return jsonError(error?.message || "设备注册失败。")
    }
  }

  if (path[0] === "tasks" && path.length === 1) {
    const content = String(body?.content || "").trim()
    if (!content) return jsonError("content required")
    const deviceId = body?.deviceId || body?.device_id || null
    const now = new Date().toISOString()
    const { data, error } = await db
      .from("agent_remote_tasks")
      .insert({
        user_id: auth.user.id,
        device_id: deviceId || null,
        content,
        channel: String(body?.channel || "MOBILE_APP").slice(0, 40),
        status: "pending",
        created_at: now,
        updated_at: now,
      })
      .select("*")
      .single()
    if (error) return jsonError(error.message, 500)
    await db.from("agent_remote_messages").insert({
      user_id: auth.user.id,
      device_id: deviceId || null,
      task_id: data.id,
      role: "user",
      content,
      created_at: now,
    })
    return NextResponse.json({ task: data })
  }

  if (path[0] === "tasks" && path[1] === "pull") {
    const deviceKey = String(body?.deviceKey || body?.device_key || "").trim()
    if (!deviceKey) return jsonError("deviceKey required")
    const { data: device, error: deviceError } = await db
      .from("agent_remote_devices")
      .select("*")
      .eq("user_id", auth.user.id)
      .eq("device_key", deviceKey)
      .maybeSingle()
    if (deviceError) return jsonError(deviceError.message, 500)
    if (!device) return jsonError("device not registered", 404)

    const { data: tasks, error } = await db
      .from("agent_remote_tasks")
      .select("*")
      .eq("user_id", auth.user.id)
      .eq("status", "pending")
      .or(`device_id.is.null,device_id.eq.${device.id}`)
      .order("created_at", { ascending: true })
      .limit(Math.max(1, Math.min(10, Number(body?.limit || 3))))
    if (error) return jsonError(error.message, 500)
    const ids = (tasks || []).map((task: any) => task.id)
    if (ids.length) {
      await db
        .from("agent_remote_tasks")
        .update({ status: "running", device_id: device.id, claimed_at: new Date().toISOString(), updated_at: new Date().toISOString() })
        .in("id", ids)
    }
    await db.from("agent_remote_devices").update({ online: true, last_seen_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("id", device.id)
    return NextResponse.json({ tasks: tasks || [], device })
  }

  if (path[0] === "tasks" && path[2] === "result") {
    const taskId = path[1]
    const status = String(body?.status || "completed")
    const result = String(body?.result || body?.content || "")
    const errorMessage = body?.error ? String(body.error) : null
    const now = new Date().toISOString()
    const { data: task, error } = await db
      .from("agent_remote_tasks")
      .update({
        status,
        result,
        error: errorMessage,
        completed_at: /complete|success|failed|error/i.test(status) ? now : null,
        updated_at: now,
      })
      .eq("id", taskId)
      .eq("user_id", auth.user.id)
      .select("*")
      .single()
    if (error) return jsonError(error.message, 500)
    if (result || errorMessage) {
      await db.from("agent_remote_messages").insert({
        user_id: auth.user.id,
        device_id: task.device_id,
        task_id: task.id,
        role: errorMessage ? "system" : "assistant",
        content: errorMessage || result,
        created_at: now,
      })
    }
    return NextResponse.json({ task })
  }

  if (path[0] === "assets") {
    const deviceKey = String(body?.deviceKey || body?.device_key || "").trim()
    const assetType = String(body?.assetType || body?.asset_type || "").trim()
    if (!deviceKey || !assetType) return jsonError("deviceKey and assetType required")
    const { data: device } = await db
      .from("agent_remote_devices")
      .select("*")
      .eq("user_id", auth.user.id)
      .eq("device_key", deviceKey)
      .maybeSingle()
    if (!device) return jsonError("device not registered", 404)
    const { error } = await db.from("agent_remote_assets").upsert({
      user_id: auth.user.id,
      device_id: device.id,
      asset_type: assetType,
      payload: body?.payload && typeof body.payload === "object" ? body.payload : {},
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id,device_id,asset_type" })
    if (error) return jsonError(error.message, 500)
    return NextResponse.json({ ok: true })
  }

  return jsonError("not found", 404)
}

export async function GET(req: NextRequest, ctx: { params: { path?: string[] } }) {
  const auth = await currentUser(req)
  if (!auth.ok) return jsonError(auth.error, auth.status)
  const db = admin()
  const path = parts(ctx)
  const limit = limitFrom(req)

  if (path[0] === "devices") {
    const { data, error } = await db
      .from("agent_remote_devices")
      .select("*")
      .eq("user_id", auth.user.id)
      .order("last_seen_at", { ascending: false })
    if (error) return jsonError(error.message, 500)
    return NextResponse.json({ devices: data || [] })
  }

  if (path[0] === "tasks") {
    const { data, error } = await db
      .from("agent_remote_tasks")
      .select("*")
      .eq("user_id", auth.user.id)
      .order("created_at", { ascending: false })
      .limit(limit)
    if (error) return jsonError(error.message, 500)
    return NextResponse.json({ tasks: data || [] })
  }

  if (path[0] === "conversations") {
    const { data, error } = await db
      .from("agent_remote_messages")
      .select("*")
      .eq("user_id", auth.user.id)
      .order("created_at", { ascending: false })
      .limit(limit)
    if (error) return jsonError(error.message, 500)
    return NextResponse.json({ messages: (data || []).reverse() })
  }

  if (["memories", "skills", "delegations"].includes(path[0] || "")) {
    const assetType = path[0]
    const { data, error } = await db
      .from("agent_remote_assets")
      .select("*")
      .eq("user_id", auth.user.id)
      .eq("asset_type", assetType)
      .order("updated_at", { ascending: false })
      .limit(1)
    if (error) return jsonError(error.message, 500)
    const payload = data?.[0]?.payload || {}
    if (assetType === "memories") return NextResponse.json({ memories: payload.memories || payload.items || [] })
    if (assetType === "skills") return NextResponse.json({ skills: payload.skills || payload.items || [] })
    return NextResponse.json(payload)
  }

  if (path[0] === "events") {
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "connected", ts: new Date().toISOString() })}\n\n`))
        controller.close()
      },
    })
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  }

  return jsonError("not found", 404)
}
