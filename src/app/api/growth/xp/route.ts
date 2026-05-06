import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || ""
const supabaseKey = supabaseServiceKey || supabaseAnonKey

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

export async function POST(req: NextRequest) {
  if (!supabaseUrl || !supabaseKey) return jsonError("服务器成长配置缺失。", 500)

  const authHeader = req.headers.get("authorization") || ""
  const token = authHeader.toLowerCase().startsWith("bearer ") ? authHeader.slice(7) : ""
  if (!token) return jsonError("请先登录后再领取经验。", 401)

  const body = await req.json().catch(() => null)
  const amount = Number(body?.amount || 0)
  if (!Number.isFinite(amount) || amount <= 0 || amount > 100) return jsonError("经验值不合法。")

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

  return NextResponse.json({ xp })
}
