import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

function publicGrowthUsers(realCount: number) {
  const startDay = Math.floor(new Date("2026-05-08T00:00:00+08:00").getTime() / 86400000)
  const today = Math.floor((Date.now() + 8 * 60 * 60 * 1000) / 86400000)
  const days = Math.max(0, today - startDay)
  const publicCount = 386 + days * 128
  return Math.max(realCount, publicCount)
}

export async function GET() {
  if (!supabaseUrl || (!supabaseServiceKey && !supabaseAnonKey)) {
    return NextResponse.json({ registeredUsers: null, error: "Supabase not configured" }, { status: 500 })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, signal: init?.signal ?? AbortSignal.timeout(12000) }),
    },
  })

  const { count, error } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })

  if (error) {
    return NextResponse.json({ registeredUsers: null, error: error.message }, { status: 500 })
  }

  const registeredUsers = count || 0
  return NextResponse.json({ registeredUsers, publicRegisteredUsers: publicGrowthUsers(registeredUsers) })
}
