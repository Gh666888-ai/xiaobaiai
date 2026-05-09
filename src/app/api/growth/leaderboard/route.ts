import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { ONLINE_XP_PER_HEARTBEAT } from "@/data/growth"

export const dynamic = "force-dynamic"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabaseKey = supabaseServiceKey || supabaseAnonKey
const ONLINE_HEARTBEAT_MINUTES = 5

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
  userId?: string
}

const seededTaskUsers = [
  { name: "北城Prompt", baseCount: 9, totalXP: 1420 },
  { name: "阿白学AI", baseCount: 8, totalXP: 860 },
  { name: "小林工作流", baseCount: 7, totalXP: 1180 },
  { name: "晴天绘图课", baseCount: 6, totalXP: 730 },
  { name: "深夜自动化", baseCount: 5, totalXP: 980 },
  { name: "一页教程", baseCount: 4, totalXP: 540 },
  { name: "会问问题的人", baseCount: 3, totalXP: 420 },
  { name: "Agent练习生", baseCount: 2, totalXP: 360 },
]

const seededOnlineUsers = [
  { name: "今日陪跑王", baseMinutes: 95, totalXP: 320 },
  { name: "Prompt早鸟", baseMinutes: 80, totalXP: 560 },
  { name: "学习不断电", baseMinutes: 65, totalXP: 260 },
  { name: "新手巡航中", baseMinutes: 50, totalXP: 170 },
  { name: "刚开始认真学", baseMinutes: 35, totalXP: 120 },
  { name: "第一天在线", baseMinutes: 25, totalXP: 90 },
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

function seededTaskLeaderboard(seed: string, startRank = 1): LeaderboardItem[] {
  return seededTaskUsers
    .map((user, index) => ({
      rank: startRank + index,
      name: user.name,
      xp: user.baseCount + (seededOffset(seed, index) % 3),
      totalXP: user.totalXP + seededOffset(seed, index) * 4,
    }))
    .sort((a, b) => b.xp - a.xp)
    .map((item, index) => ({ ...item, rank: startRank + index }))
}

function seededOnlineLeaderboard(seed: string): LeaderboardItem[] {
  return seededOnlineUsers
    .map((user, index) => ({
      rank: index + 1,
      name: user.name,
      xp: user.baseMinutes + (seededOffset(seed, index) % 15),
      totalXP: user.totalXP + seededOffset(seed, index) * 2,
    }))
    .sort((a, b) => b.xp - a.xp)
    .map((item, index) => ({ ...item, rank: index + 1 }))
}

function rankLeaderboard(items: LeaderboardItem[], limit = 10) {
  return items
    .sort((a, b) => {
      if (b.xp !== a.xp) return b.xp - a.xp
      return b.totalXP - a.totalXP
    })
    .slice(0, limit)
    .map((item, index) => ({ ...item, rank: index + 1 }))
}

function publicLeaderboard(items: LeaderboardItem[]) {
  return items.map(({ userId, ...item }) => item)
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
      userId,
    }
  })
}

async function buildOnlineMinutesLeaderboard(
  supabase: ReturnType<typeof createSupabaseClient>,
  eventsQuery: any,
  scope: string,
) {
  const { data: events, error: eventsError } = await eventsQuery

  if (eventsError) {
    logLeaderboardError(scope, eventsError)
    return []
  }

  const minutesByUser = new Map<string, number>()
  for (const event of events || []) {
    const userId = String((event as any).user_id || "")
    if (!userId) continue
    const heartbeats = Number((event as any).amount || 0) / Math.max(1, ONLINE_XP_PER_HEARTBEAT)
    minutesByUser.set(userId, (minutesByUser.get(userId) || 0) + Math.round(heartbeats * ONLINE_HEARTBEAT_MINUTES))
  }

  return buildLeaderboardFromMap(supabase, minutesByUser, scope)
}

async function buildTaskCountLeaderboard(
  supabase: ReturnType<typeof createSupabaseClient>,
  eventsQuery: any,
  scope: string,
) {
  const { data: events, error: eventsError } = await eventsQuery

  if (eventsError) {
    logLeaderboardError(scope, eventsError)
    return []
  }

  const countByUser = new Map<string, number>()
  for (const event of events || []) {
    const userId = String((event as any).user_id || "")
    if (!userId) continue
    countByUser.set(userId, (countByUser.get(userId) || 0) + 1)
  }

  return buildLeaderboardFromMap(supabase, countByUser, scope)
}

async function buildLeaderboardFromMap(
  supabase: ReturnType<typeof createSupabaseClient>,
  scoreByUser: Map<string, number>,
  scope: string,
) {
  const userIds = Array.from(scoreByUser.entries())
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
      xp: scoreByUser.get(userId) || 0,
      totalXP: Number(profile?.xp || 0),
      userId,
    }
  })
}

function bearerToken(req: NextRequest) {
  const authHeader = req.headers.get("authorization") || ""
  return authHeader.toLowerCase().startsWith("bearer ") ? authHeader.slice(7) : ""
}

async function getViewerDailyXP(supabase: ReturnType<typeof createSupabaseClient>, req: NextRequest, today: string) {
  const token = bearerToken(req)
  if (!token) return null
  const { data: userData, error: userError } = await supabase.auth.getUser(token)
  if (userError || !userData.user?.id) return null

  const { data: events, error: eventsError } = await supabase
    .from("growth_events")
    .select("amount,reason")
    .eq("user_id", userData.user.id)
    .eq("day_key", today)

  if (eventsError) {
    logLeaderboardError("viewer-daily", eventsError)
    return null
  }

  const onlineXP = (events || [])
    .filter((event: any) => event.reason === "online")
    .reduce((sum: number, event: any) => sum + Number(event.amount || 0), 0)

  return {
    userId: userData.user.id,
    dailyXP: (events || []).reduce((sum: number, event: any) => sum + Number(event.amount || 0), 0),
    onlineMinutes: Math.round((onlineXP / Math.max(1, ONLINE_XP_PER_HEARTBEAT)) * ONLINE_HEARTBEAT_MINUTES),
  }
}

export async function GET(req: NextRequest) {
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ daily: [], weekly: [], error: "Supabase not configured" }, { status: 500 })
  }

  const supabase = createSupabaseClient()
  const today = dayKey()
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const realOnline = await buildOnlineMinutesLeaderboard(
    supabase,
    supabase
      .from("growth_events")
      .select("user_id,amount")
      .eq("reason", "online")
      .eq("day_key", today)
      .limit(1000),
    "online-events",
  )

  const onlineSeeds = seededOnlineLeaderboard(today)
  const daily = realOnline.length >= 6
    ? rankLeaderboard(realOnline, 6)
    : rankLeaderboard([...realOnline, ...onlineSeeds.slice(0, 6 - realOnline.length)], 6)

  const realTasks = await buildTaskCountLeaderboard(
    supabase,
    supabase
      .from("growth_events")
      .select("user_id,reason")
      .like("reason", "mission:%")
      .gte("awarded_at", since)
      .limit(2000),
    "task-events",
  )

  const taskSeeds = seededTaskLeaderboard(today)
  const weekly = realTasks.length >= 6
    ? rankLeaderboard(realTasks)
    : rankLeaderboard([...realTasks, ...taskSeeds.slice(0, 6 - realTasks.length)], 6)

  const viewer = await getViewerDailyXP(supabase, req, today)
  const viewerRank = viewer ? daily.find((item) => item.userId === viewer.userId)?.rank || null : null
  const threshold = daily.length >= 6 ? daily[daily.length - 1].xp : 1
  const viewerHint = viewer
    ? {
        dailyXP: viewer.dailyXP,
        onlineMinutes: viewer.onlineMinutes,
        rank: viewerRank,
        needXP: viewer.onlineMinutes > threshold ? 0 : Math.max(5, threshold - viewer.onlineMinutes + 5),
      }
    : null

  return NextResponse.json({ daily: publicLeaderboard(daily), weekly: publicLeaderboard(weekly), viewer: viewerHint })
}
