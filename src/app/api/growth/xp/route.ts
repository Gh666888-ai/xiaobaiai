import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { CHECK_IN_XP, DAILY_ONLINE_XP_CAP, GROWTH_MISSIONS, ONLINE_XP_PER_HEARTBEAT } from "@/data/growth"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || ""
const supabaseKey = supabaseServiceKey || supabaseAnonKey
const ONLINE_HEARTBEAT_MS = 5 * 60 * 1000
const missionById = new Map(GROWTH_MISSIONS.map((mission) => [mission.id, mission]))

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

function createSupabaseClient(key: string, token?: string) {
  return createClient(supabaseUrl, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      fetch: (input, init) => fetch(input, { ...init, signal: init?.signal ?? AbortSignal.timeout(12000) }),
    },
  })
}

function logSupabaseError(scope: string, error: any) {
  console.error(`[growth-xp:${scope}]`, {
    code: error?.code,
    message: error?.message,
    details: error?.details,
    hint: error?.hint,
  })
}

function dayKey(now = new Date()) {
  return new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString().slice(0, 10)
}

function tableSetupError(error: any) {
  return String(error?.code || "") === "42P01" || String(error?.message || "").includes("growth_events")
}

function resolveAward(body: any, now = new Date()) {
  const reason = String(body?.reason || "").trim()
  const today = dayKey(now)

  if (reason === "welcome") {
    return { ok: true as const, reason, eventKey: "welcome", dayKey: today, amount: 50 }
  }

  if (reason === "check-in") {
    return { ok: true as const, reason, eventKey: `check-in:${today}`, dayKey: today, amount: CHECK_IN_XP }
  }

  if (reason === "mission") {
    const missionId = String(body?.missionId || "").trim()
    const mission = missionById.get(missionId)
    if (!mission || mission.id === "welcome") return { ok: false as const, error: "任务类型不合法。" }
    const eventKey = mission.cadence === "once" ? `mission:${mission.id}` : `mission:${today}:${mission.id}`
    return { ok: true as const, reason: `mission:${mission.id}`, eventKey, dayKey: mission.cadence === "daily" ? today : "", amount: mission.xp }
  }

  if (reason === "online") {
    const slot = Math.floor(now.getTime() / ONLINE_HEARTBEAT_MS)
    return { ok: true as const, reason, eventKey: `online:${today}:${slot}`, dayKey: today, amount: ONLINE_XP_PER_HEARTBEAT }
  }

  return { ok: false as const, error: "经验来源不合法。" }
}

export async function POST(req: NextRequest) {
  if (!supabaseUrl || !supabaseKey) return jsonError("服务器成长配置缺失。", 500)

  const authHeader = req.headers.get("authorization") || ""
  const token = authHeader.toLowerCase().startsWith("bearer ") ? authHeader.slice(7) : ""
  if (!token) return jsonError("请先登录后再领取经验。", 401)

  const body = await req.json().catch(() => null)
  const award = resolveAward(body)
  if (!award.ok) return jsonError(award.error)

  const adminSupabase = createSupabaseClient(supabaseKey)
  const userSupabase = createSupabaseClient(supabaseAnonKey || supabaseKey, token)

  const { data: userData, error: userError } = await adminSupabase.auth.getUser(token)
  if (userError || !userData.user) return jsonError("登录已过期，请重新登录。", 401)

  const user = userData.user
  const { data: profile, error: readError } = await adminSupabase
    .from("profiles")
    .select("name,email,xp")
    .eq("id", user.id)
    .maybeSingle()

  let currentXP = Number(profile?.xp || 0)

  if (readError || !profile) {
    if (readError) logSupabaseError("read-profile", readError)

    const profilePayload = {
      id: user.id,
      email: user.email || "",
      name: user.user_metadata?.name || user.email?.split("@")[0] || "用户",
      xp: 0,
      joined_at: new Date().toISOString().slice(0, 10),
    }

    const { error: adminCreateError } = await adminSupabase
      .from("profiles")
      .upsert(profilePayload, { onConflict: "id" })

    if (adminCreateError) {
      logSupabaseError("admin-create-profile", adminCreateError)
      const { error: userCreateError } = await userSupabase.from("profiles").insert(profilePayload)
      if (userCreateError) {
        logSupabaseError("user-create-profile", userCreateError)
        return jsonError("成长档案初始化失败，请稍后再试。", 500)
      }
    }

    currentXP = 0
  }

  let amount = award.amount
  if (award.reason === "online") {
    const { data: onlineEvents, error: onlineError } = await adminSupabase
      .from("growth_events")
      .select("amount")
      .eq("user_id", user.id)
      .eq("reason", "online")
      .eq("day_key", award.dayKey)

    if (onlineError) {
      logSupabaseError("read-online-events", onlineError)
      return jsonError(tableSetupError(onlineError) ? "成长事件表还没建好，请先执行最新版 supabase.sql。" : "读取在线经验失败，请稍后再试。", 500)
    }

    const todayOnlineXP = (onlineEvents || []).reduce((sum: number, event: any) => sum + Number(event.amount || 0), 0)
    const remaining = Math.max(0, DAILY_ONLINE_XP_CAP - todayOnlineXP)
    if (remaining <= 0) {
      return NextResponse.json({ xp: currentXP, awarded: 0, capped: true, dailyOnlineXP: todayOnlineXP })
    }
    amount = Math.min(amount, remaining)
  }

  const { error: eventError } = await adminSupabase
    .from("growth_events")
    .insert({
      user_id: user.id,
      event_key: award.eventKey,
      reason: award.reason,
      amount,
      day_key: award.dayKey || null,
    })

  if (eventError) {
    if (String(eventError.code || "") === "23505") {
      return NextResponse.json({ xp: currentXP, awarded: 0, alreadyClaimed: true })
    }
    logSupabaseError("insert-event", eventError)
    return jsonError(tableSetupError(eventError) ? "成长事件表还没建好，请先执行最新版 supabase.sql。" : "经验记录写入失败，请稍后再试。", 500)
  }

  const xp = currentXP + amount
  const { error: adminUpdateError } = await adminSupabase
    .from("profiles")
    .update({ xp })
    .eq("id", user.id)

  if (adminUpdateError) {
    logSupabaseError("admin-update-xp", adminUpdateError)
    const { error: userUpdateError } = await userSupabase
      .from("profiles")
      .update({ xp })
      .eq("id", user.id)
    if (userUpdateError) {
      logSupabaseError("user-update-xp", userUpdateError)
      return jsonError("经验写入失败，请稍后再试。", 500)
    }
  }

  return NextResponse.json({ xp, awarded: amount, reason: award.reason })
}
