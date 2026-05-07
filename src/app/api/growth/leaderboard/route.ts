import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const dynamic = "force-dynamic"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabaseKey = supabaseServiceKey || supabaseAnonKey

type Profile = {
  id: string
  name?: string | null
  email?: string | null
  xp?: number | null
}

function createSupabaseClient() {
  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, signal: init?.signal ?? AbortSignal.timeout(12000) }),
    },
  })
}

function publicName(profile?: Profile | null) {
  const rawName = String(profile?.name || "").trim()
  if (rawName && !rawName.includes("@")) return rawName.slice(0, 16)
  const email = String(profile?.email || "").trim()
  if (!email.includes("@")) return rawName || "小白用户"
  const [prefix] = email.split("@")
  if (prefix.length <= 4) return `${prefix}***`
  return `${prefix.slice(0, 3)}***${prefix.slice(-2)}`
}

function logLeaderboardError(scope: string, error: any) {
  console.error(`[growth-leaderboard:${scope}]`, {
    code: error?.code,
    message: error?.message,
    details: error?.details,
    hint: error?.hint,
  })
}

export async function GET() {
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ allTime: [], weekly: [], error: "Supabase not configured" }, { status: 500 })
  }

  const supabase = createSupabaseClient()

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id,name,email,xp")
    .order("xp", { ascending: false })
    .limit(20)

  if (profilesError) {
    logLeaderboardError("profiles", profilesError)
    return NextResponse.json({ allTime: [], weekly: [], error: "读取成长榜失败。" }, { status: 500 })
  }

  const allTime = (profiles || []).map((profile: Profile, index: number) => ({
    rank: index + 1,
    name: publicName(profile),
    xp: Number(profile.xp || 0),
  }))

  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const { data: events, error: eventsError } = await supabase
    .from("growth_events")
    .select("user_id,amount")
    .gte("awarded_at", since)
    .limit(2000)

  if (eventsError) {
    logLeaderboardError("weekly-events", eventsError)
    return NextResponse.json({ allTime, weekly: [] })
  }

  const weeklyByUser = new Map<string, number>()
  for (const event of events || []) {
    const userId = String((event as any).user_id || "")
    if (!userId) continue
    weeklyByUser.set(userId, (weeklyByUser.get(userId) || 0) + Number((event as any).amount || 0))
  }

  const weeklyIds = Array.from(weeklyByUser.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([userId]) => userId)

  let profileById = new Map<string, Profile>()
  if (weeklyIds.length) {
    const { data: weeklyProfiles, error: weeklyProfilesError } = await supabase
      .from("profiles")
      .select("id,name,email,xp")
      .in("id", weeklyIds)

    if (weeklyProfilesError) {
      logLeaderboardError("weekly-profiles", weeklyProfilesError)
    } else {
      profileById = new Map((weeklyProfiles || []).map((profile: Profile) => [profile.id, profile]))
    }
  }

  const weekly = weeklyIds.map((userId, index) => {
    const profile = profileById.get(userId)
    return {
      rank: index + 1,
      name: publicName(profile),
      xp: weeklyByUser.get(userId) || 0,
      totalXP: Number(profile?.xp || 0),
    }
  })

  return NextResponse.json({ allTime, weekly })
}
