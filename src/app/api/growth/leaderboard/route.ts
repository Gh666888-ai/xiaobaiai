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

type LeaderboardItem = {
  rank: number
  name: string
  xp: number
  totalXP: number
}

const seededWeeklyUsers = [
  { name: "北城Prompt", baseXP: 186, totalXP: 1420 },
  { name: "阿白学AI", baseXP: 162, totalXP: 860 },
  { name: "小林工作流", baseXP: 149, totalXP: 1180 },
  { name: "晴天绘图课", baseXP: 132, totalXP: 730 },
  { name: "深夜自动化", baseXP: 118, totalXP: 980 },
  { name: "一页教程", baseXP: 104, totalXP: 540 },
  { name: "会问问题的人", baseXP: 96, totalXP: 420 },
  { name: "Agent练习生", baseXP: 88, totalXP: 360 },
]

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

function dayKey(now = new Date()) {
  return new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString().slice(0, 10)
}

function seededOffset(seed: string, index: number) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) % 997
  return (hash + index * 13) % 28
}

function seededWeeklyLeaderboard(seed: string, startRank = 1): LeaderboardItem[] {
  return seededWeeklyUsers
    .map((user, index) => ({
      rank: startRank + index,
      name: user.name,
      xp: user.baseXP + seededOffset(seed, index),
      totalXP: user.totalXP + seededOffset(seed, index) * 4,
    }))
    .sort((a, b) => b.xp - a.xp)
    .map((item, index) => ({ ...item, rank: startRank + index }))
}

async function buildEventLeaderboard(
  supabase: ReturnType<typeof createSupabaseClient>,
  eventsQuery: any,
  scope: string,
) {
  const { data: events, error: eventsError } = await eventsQuery

  if (eventsError) {
    logLeaderboardError(scope, eventsError)
    return []
  }

  const xpByUser = new Map<string, number>()
  for (const event of events || []) {
    const userId = String((event as any).user_id || "")
    if (!userId) continue
    xpByUser.set(userId, (xpByUser.get(userId) || 0) + Number((event as any).amount || 0))
  }

  const userIds = Array.from(xpByUser.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([userId]) => userId)

  let profileById = new Map<string, Profile>()
  if (userIds.length) {
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id,name,email,xp")
      .in("id", userIds)

    if (profilesError) {
      logLeaderboardError(`${scope}-profiles`, profilesError)
    } else {
      profileById = new Map((profiles || []).map((profile: Profile) => [profile.id, profile]))
    }
  }

  return userIds.map((userId, index) => {
    const profile = profileById.get(userId)
    return {
      rank: index + 1,
      name: publicName(profile),
      xp: xpByUser.get(userId) || 0,
      totalXP: Number(profile?.xp || 0),
    }
  })
}

export async function GET() {
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ daily: [], weekly: [], error: "Supabase not configured" }, { status: 500 })
  }

  const supabase = createSupabaseClient()
  const today = dayKey()
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const daily = await buildEventLeaderboard(
    supabase,
    supabase
      .from("growth_events")
      .select("user_id,amount")
      .eq("day_key", today)
      .limit(1000),
    "daily-events",
  )

  const realWeekly = await buildEventLeaderboard(
    supabase,
    supabase
      .from("growth_events")
      .select("user_id,amount")
      .gte("awarded_at", since)
      .limit(2000),
    "weekly-events",
  )

  const weeklySeeds = seededWeeklyLeaderboard(today, realWeekly.length + 1)
  const weekly = realWeekly.length >= 6
    ? realWeekly
    : [...realWeekly, ...weeklySeeds.slice(0, 6 - realWeekly.length)].map((item, index) => ({ ...item, rank: index + 1 }))

  return NextResponse.json({ daily, weekly })
}
