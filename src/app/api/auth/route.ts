import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

async function withTimeout<T>(promise: Promise<T>, ms = 15000) {
  let timer: ReturnType<typeof setTimeout>
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("timeout")), ms)
  })
  try {
    return await Promise.race([promise, timeout])
  } finally {
    clearTimeout(timer!)
  }
}

function normalizeAuthError(message = "") {
  const lower = message.toLowerCase()
  if (lower.includes("invalid login") || lower.includes("invalid credentials")) return "邮箱或密码错误。第一次使用请切换到注册。"
  if (lower.includes("already") || lower.includes("registered")) return "该邮箱已注册，请切换到登录。"
  if (lower.includes("timeout")) return "登录服务暂时响应较慢，请稍后再试。"
  if (lower.includes("email not confirmed")) return "邮箱还没有完成验证，请先查看邮箱验证邮件。"
  return message || "登录服务暂时不可用，请稍后再试。"
}

export async function POST(req: NextRequest) {
  if (!supabaseUrl || !supabaseKey) return jsonError("服务器登录配置缺失，请检查 Supabase 环境变量。", 500)

  const body = await req.json().catch(() => null)
  const mode = body?.mode === "register" ? "register" : "login"
  const email = String(body?.email || "").trim()
  const password = String(body?.password || "")
  const name = String(body?.name || "").trim()

  if (!email || !password) return jsonError("请填写邮箱和密码。")
  if (password.length < 6) return jsonError("密码至少 6 位。")
  if (mode === "register" && !name) return jsonError("注册时请填写昵称，方便社区展示。")

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, signal: init?.signal ?? AbortSignal.timeout(12000) }),
    },
  })

  try {
    if (mode === "register") {
      const { data: signUpData, error: signUpError } = await withTimeout(
        supabase.auth.signUp({
          email,
          password,
          options: { data: { name } },
        }),
      )
      if (signUpError) return jsonError(normalizeAuthError(signUpError.message))
      if (signUpData.user?.id) {
        await supabase.from("profiles").upsert({
          id: signUpData.user.id,
          name,
          email,
          xp: 0,
          joined_at: new Date().toISOString().slice(0, 10),
        }, { onConflict: "id" })
      }
    }

    const { data, error } = await withTimeout(supabase.auth.signInWithPassword({ email, password }))
    if (error) return jsonError(normalizeAuthError(error.message), 401)
    if (!data.session || !data.user) return jsonError("没有拿到登录会话，请稍后再试。", 502)

    return NextResponse.json({
      user: {
        id: data.user.id,
        email: data.user.email || email,
        name: data.user.user_metadata?.name || name || data.user.email?.split("@")[0] || "用户",
      },
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
        token_type: data.session.token_type,
      },
    })
  } catch (error: any) {
    return jsonError(normalizeAuthError(error?.message), error?.message === "timeout" ? 504 : 500)
  }
}

export async function GET(req: NextRequest) {
  if (!supabaseUrl || !supabaseKey) return jsonError("服务器登录配置缺失，请检查 Supabase 环境变量。", 500)

  const authHeader = req.headers.get("authorization") || ""
  const token = authHeader.toLowerCase().startsWith("bearer ") ? authHeader.slice(7) : ""
  if (!token) return jsonError("未登录。", 401)

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, signal: init?.signal ?? AbortSignal.timeout(12000) }),
    },
  })

  try {
    const { data, error } = await withTimeout(supabase.auth.getUser(token), 12000)
    if (error || !data.user) return jsonError("登录已过期，请重新登录。", 401)

    const { data: profile } = await supabase
      .from("profiles")
      .select("name,email,xp")
      .eq("id", data.user.id)
      .single()

    return NextResponse.json({
      user: {
        id: data.user.id,
        email: data.user.email || profile?.email || "",
        name: profile?.name || data.user.user_metadata?.name || data.user.email?.split("@")[0] || "用户",
        xp: Number(profile?.xp || 0),
      },
    })
  } catch (error: any) {
    return jsonError(normalizeAuthError(error?.message), error?.message === "timeout" ? 504 : 500)
  }
}
