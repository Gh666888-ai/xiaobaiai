import { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export function hasSupabaseConfig() {
  return Boolean(supabaseUrl && supabaseKey)
}

export function createServerSupabase() {
  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, signal: init?.signal ?? AbortSignal.timeout(12000) }),
    },
  })
}

type RequireUserResult =
  | { ok: false; error: string; status: number }
  | { ok: true; supabase: ReturnType<typeof createServerSupabase>; user: { id: string; email?: string }; token: string }

export function bearerToken(req: NextRequest) {
  const authHeader = req.headers.get("authorization") || ""
  return authHeader.toLowerCase().startsWith("bearer ") ? authHeader.slice(7) : ""
}

export async function requireUser(req: NextRequest): Promise<RequireUserResult> {
  if (!hasSupabaseConfig()) return { ok: false, error: "服务器 Supabase 配置缺失。", status: 500 }
  const token = bearerToken(req)
  if (!token) return { ok: false, error: "请先登录。", status: 401 }

  const supabase = createServerSupabase()
  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data.user) return { ok: false, error: "登录已过期，请重新登录。", status: 401 }
  return { ok: true, supabase, user: { id: data.user.id, email: data.user.email }, token }
}
