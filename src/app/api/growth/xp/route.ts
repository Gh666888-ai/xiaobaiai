import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

export async function POST(req: NextRequest) {
  if (!supabaseUrl || !supabaseKey) return jsonError("服务器成长配置缺失。", 500)

  const authHeader = req.headers.get("authorization") || ""
  const token = authHeader.toLowerCase().startsWith("bearer ") ? authHeader.slice(7) : ""
  if (!token) return jsonError("请先登录后再领取经验。", 401)

  const body = await req.json().catch(() => null)
  const amount = Number(body?.amount || 0)
  if (!Number.isFinite(amount) || amount <= 0 || amount > 100) return jsonError("经验值不合法。")

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, signal: init?.signal ?? AbortSignal.timeout(12000) }),
    },
  })

  const { data: userData, error: userError } = await supabase.auth.getUser(token)
  if (userError || !userData.user) return jsonError("登录已过期，请重新登录。", 401)

  const { data: profile, error: readError } = await supabase
    .from("profiles")
    .select("name,email,xp")
    .eq("id", userData.user.id)
    .maybeSingle()

  let currentXP = Number(profile?.xp || 0)
  if (readError || !profile) {
    const { error: createError } = await supabase.from("profiles").upsert({
      id: userData.user.id,
      email: userData.user.email || "",
      name: userData.user.user_metadata?.name || userData.user.email?.split("@")[0] || "用户",
      xp: 0,
      joined_at: new Date().toISOString().slice(0, 10),
    }, { onConflict: "id" })
    if (createError) return jsonError("成长档案初始化失败，请稍后再试。", 500)
    currentXP = 0
  }

  const xp = currentXP + amount
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ xp })
    .eq("id", userData.user.id)
  if (updateError) return jsonError("经验写入失败，请稍后再试。", 500)

  return NextResponse.json({ xp })
}
