import { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabaseKey = supabaseServiceKey || supabaseAnonKey

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

export function createUserSupabase(token: string) {
  return createClient(supabaseUrl, supabaseAnonKey || supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      headers: { Authorization: `Bearer ${token}` },
      fetch: (input, init) => fetch(input, { ...init, signal: init?.signal ?? AbortSignal.timeout(12000) }),
    },
  })
}

type RequireUserResult =
  | { ok: false; error: string; status: number }
  | { ok: true; supabase: ReturnType<typeof createUserSupabase>; adminSupabase: ReturnType<typeof createServerSupabase>; user: { id: string; email?: string }; token: string }

export function bearerToken(req: NextRequest) {
  const authHeader = req.headers.get("authorization") || ""
  return authHeader.toLowerCase().startsWith("bearer ") ? authHeader.slice(7) : ""
}

export async function requireUser(req: NextRequest): Promise<RequireUserResult> {
  if (!hasSupabaseConfig()) return { ok: false, error: "服务器 Supabase 配置缺失。", status: 500 }
  const token = bearerToken(req)
  if (!token) return { ok: false, error: "请先登录。", status: 401 }

  const adminSupabase = createServerSupabase()
  const { data, error } = await adminSupabase.auth.getUser(token)
  if (error || !data.user) return { ok: false, error: "登录已过期，请重新登录。", status: 401 }
  return { ok: true, supabase: createUserSupabase(token), adminSupabase, user: { id: data.user.id, email: data.user.email }, token }
}
