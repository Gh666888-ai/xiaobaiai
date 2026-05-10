"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CalendarCheck, Compass, Flame, Medal, Sparkles, Target, Trophy, TrendingUp } from "lucide-react"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"
import { LevelBadge } from "@/components/LevelBadge"
import { XiaobaiMascot } from "@/components/XiaobaiMascot"
import { stages } from "@/data/learning-path"
import { progressId, readLearningProgress } from "@/lib/learning-progress"
import { useAuth } from "@/lib/AuthContext"
import { readAppAuth } from "@/lib/app-auth"
import { getNextLevel, getUserLevel, LEVELS } from "@/data/user"
import { CHECK_IN_XP, GROWTH_MISSIONS } from "@/data/growth"

type GrowthState = {
  xp: number
  streak: number
  lastCheckIn: string
  doneMissions: Record<string, boolean>
}

type LeaderboardUser = {
  rank: number
  name: string
  xp: number
  totalXP?: number
}

type ViewerLeaderboardHint = {
  dailyXP: number
  onlineMinutes?: number
  rank: number | null
  needXP: number
}

const GROWTH_KEY = "xiaobaiai:growth:v1"

const missions = GROWTH_MISSIONS

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

function storageKey(userId?: string) {
  return userId ? `${GROWTH_KEY}:${userId}` : `${GROWTH_KEY}:guest`
}

function readGrowth(userId?: string): GrowthState {
  if (typeof window === "undefined") return { xp: 0, streak: 0, lastCheckIn: "", doneMissions: {} }
  try {
    const raw = window.localStorage.getItem(storageKey(userId))
    return raw ? JSON.parse(raw) : { xp: 0, streak: 0, lastCheckIn: "", doneMissions: {} }
  } catch {
    return { xp: 0, streak: 0, lastCheckIn: "", doneMissions: {} }
  }
}

function writeGrowth(state: GrowthState, userId?: string) {
  window.localStorage.setItem(storageKey(userId), JSON.stringify(state))
}

function missionDoneKey(mission: { id: string; cadence?: string }, today: string) {
  return mission.cadence === "once" ? `once:${mission.id}` : `${today}:${mission.id}`
}

function levelBadge(xp: number) {
  if (xp >= 1200) return { title: "高阶身份已点亮", subtitle: "名牌、边框和主页装饰开始压场", color: "#e8c96a", mood: "complete" as const }
  if (xp >= 700) return { title: "装饰权益已开启", subtitle: "社区里会比普通用户更显眼", color: "#3DA563", mood: "recommend" as const }
  if (xp >= 360) return { title: "第一阶段奖励已到手", subtitle: "继续通关，下一档装饰会叠加", color: "#e8c96a", mood: "happy" as const }
  if (xp >= 120) return { title: "快到第一个奖励", subtitle: "冲到 LV3 先拿钻石头像框体验", color: "#c9a84c", mood: "thinking" as const }
  return { title: "新手开局", subtitle: "第一天目标：冲 LV3，拿钻石头像框体验", color: "#c9a84c", mood: "welcome" as const }
}

function rankColor(rank: number) {
  if (rank === 1) return "#ffd86b"
  if (rank === 2) return "#dce7f5"
  if (rank === 3) return "#d08a42"
  return "#777"
}

export default function GrowthClient() {
  const router = useRouter()
  const { user, loading, refresh } = useAuth()
  const [state, setState] = useState<GrowthState>({ xp: 0, streak: 0, lastCheckIn: "", doneMissions: {} })
  const [learnDone, setLearnDone] = useState(0)
  const [claiming, setClaiming] = useState("")
  const [notice, setNotice] = useState("")
  const [dailyLeaders, setDailyLeaders] = useState<LeaderboardUser[]>([])
  const [weeklyLeaders, setWeeklyLeaders] = useState<LeaderboardUser[]>([])
  const [viewerHint, setViewerHint] = useState<ViewerLeaderboardHint | null>(null)

  useEffect(() => {
    const growth = readGrowth(user?.userId)
    setState({ ...growth, xp: typeof user?.xp === "number" ? user.xp : growth.xp })
    const progress = readLearningProgress()
    setLearnDone(Object.values(progress).filter(Boolean).length)
  }, [user?.userId, user?.xp])

  useEffect(() => {
    const token = readAppAuth()?.session?.access_token
    fetch("/api/growth/leaderboard", {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.daily)) setDailyLeaders(data.daily)
        if (Array.isArray(data.weekly)) setWeeklyLeaders(data.weekly)
        setViewerHint(data.viewer || null)
      })
      .catch(() => undefined)
  }, [user?.xp])

  const today = todayKey()
  const checkedToday = state.lastCheckIn === today
  const doneCount = missions.filter((mission) => state.doneMissions[missionDoneKey(mission, today)]).length
  const contributionPoints = Number(user?.contributionPoints || 0)
  const levelAccess = { coCreatorApproved: Boolean(user?.coCreatorApproved), contributionPoints }
  const currentLevel = getUserLevel(state.xp, "personal", levelAccess)
  const nextLevelInfo = getNextLevel(state.xp, "personal", levelAccess)
  const nextLevel = nextLevelInfo?.level || null
  const personalNeedsReview = Boolean(nextLevelInfo?.requiresReview)
  const teamLevel = getUserLevel(state.xp, "team", levelAccess)
  const teamNextLevelInfo = getNextLevel(state.xp, "team", levelAccess)
  const teamNextLevel = teamNextLevelInfo?.level || null
  const teamNeedsReview = Boolean(teamNextLevelInfo?.requiresReview)
  const displayXP = nextLevel ? state.xp : LEVELS[LEVELS.length - 1]?.minXP || state.xp
  const badge = levelBadge(state.xp)
  const levelBaseXP = currentLevel.minXP
  const levelNextXP = nextLevel?.minXP || Math.max(currentLevel.minXP + 1, state.xp)
  const levelPercent = Math.min(100, Math.round(((state.xp - levelBaseXP) / Math.max(1, levelNextXP - levelBaseXP)) * 100))
  const visibleMissions = missions.slice(0, 2)
  const dailyTop = dailyLeaders[0] || { rank: 1, name: "今天等你上榜", xp: 0, totalXP: state.xp }
  const weeklyTop = weeklyLeaders[0] || { rank: 1, name: "今天第一个冲榜的人", xp: 0, totalXP: 0 }

  const suggestedStage = (() => {
    let best = stages[0]
    for (const stage of stages) {
      const completed = stage.sections.filter((_, index) => readLearningProgress()[progressId(stage.id, index)]).length
      if (completed < stage.sections.length) {
        best = stage
        break
      }
    }
    return best
  })()

  const requireLogin = () => {
    router.push("/login?redirect=/growth")
  }

  const awardXP = async (payload: Record<string, unknown>) => {
    if (!user) {
      requireLogin()
      return false
    }
    const token = readAppAuth()?.session?.access_token
    if (!token) {
      requireLogin()
      return false
    }
    const res = await fetch("/api/growth/xp", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.error || "经验写入失败，请稍后再试。")
    await refresh()
    return data
  }

  const checkIn = async () => {
    if (!user) return requireLogin()
    if (checkedToday || claiming) return
    setNotice("")
    setClaiming("check-in")
    try {
      const result = await awardXP({ reason: "check-in" })
      if (!result) return
      const current = readGrowth(user.userId)
      const awarded = Number(result.awarded || 0)
      const next = { ...current, xp: Number(result.xp || current.xp + awarded), streak: current.streak + (awarded > 0 ? 1 : 0), lastCheckIn: today }
      setState({ ...next, xp: Number(result.xp || user.xp + awarded) })
      writeGrowth(next, user.userId)
      setNotice(awarded > 0 ? `今日打卡成功，${CHECK_IN_XP} XP 已进入你的账号等级。` : "今天已经打过卡，明天再来继续连击。")
    } catch (error: any) {
      setNotice(error?.message || "打卡失败，请稍后再试。")
    } finally {
      setClaiming("")
    }
  }

  const finishMission = async (missionId: string) => {
    if (!user) return requireLogin()
    const mission = missions.find((item) => item.id === missionId)
    if (!mission) return
    if (mission.claimMode !== "action") {
      router.push(mission.href)
      return
    }
    const key = missionDoneKey(mission, today)
    if (state.doneMissions[key] || claiming) return
    setNotice("")
    setClaiming(missionId)
    try {
      const result = await awardXP(missionId === "welcome" ? { reason: "welcome" } : { reason: "mission", missionId })
      if (!result) return
      const current = readGrowth(user.userId)
      const awarded = Number(result.awarded || 0)
      const next = { ...current, xp: Number(result.xp || current.xp + awarded), doneMissions: { ...current.doneMissions, [key]: true } }
      setState({ ...next, xp: Number(result.xp || user.xp + awarded) })
      writeGrowth(next, user.userId)
      setNotice(awarded > 0 ? `通关奖励到账：${awarded} XP。进度条推进了，下一档装饰更近了。` : "这个奖励已经领过啦，换个任务继续冲下一档。")
    } catch (error: any) {
      setNotice(error?.message || "领取失败，请稍后再试。")
    } finally {
      setClaiming("")
    }
  }

  return (
    <div style={{ background: "#000", minHeight: "100vh", fontFamily: "'Noto Sans SC', sans-serif", position: "relative", overflow: "hidden" }}>
      <MathRain />
      <NavBar />

      <main style={{ maxWidth: 1120, margin: "0 auto", padding: "58px 60px 100px", position: "relative", zIndex: 10, background: "rgba(0,0,0,0.86)" }} className="max-sm:px-4">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 28, alignItems: "flex-end", marginBottom: 28, flexWrap: "wrap" }}>
          <div>
            <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.36em", color: "#7a6230", textTransform: "uppercase", marginBottom: 10, fontWeight: 800 }}>Growth Deck</p>
            <h1 style={{ fontSize: 38, fontWeight: 950, color: "#fff", letterSpacing: "0.02em", marginBottom: 10 }}>AI 成长舱</h1>
            <p style={{ fontSize: 15, color: "#cfcfcf", lineHeight: 1.9, maxWidth: 680 }}>每天给自己一个小任务，积累经验值、连续学习和下一步路线。登录后领取的经验会同步到账号等级和右上角徽章。</p>
          </div>
          <div style={{ display: "flex", alignItems: "stretch", gap: 12, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${currentLevel.color}66`, borderRadius: 14, background: `${currentLevel.color}10`, padding: "11px 13px", minHeight: 84, width: 262, overflow: "visible" }}>
              <LevelBadge compact name={user?.name || "个人"} xp={state.xp} contributionPoints={contributionPoints} coCreatorApproved={user?.coCreatorApproved} />
            </div>
            <div style={{ minHeight: 84, display: "flex", alignItems: "center", gap: 12, border: "1px solid #2a1f10", borderRadius: 14, background: "rgba(201,168,76,0.055)", padding: "10px 13px" }}>
              <XiaobaiMascot size={46} mood={badge.mood} />
              <div>
                <p style={{ color: badge.color, fontSize: 13, fontWeight: 950 }}>{badge.title}</p>
                <p style={{ color: "#aaa", fontSize: 11, marginTop: 3 }}>{badge.subtitle}</p>
              </div>
            </div>
            <button onClick={checkIn} disabled={!!user && (checkedToday || claiming === "check-in")} style={{ display: "inline-flex", alignItems: "center", gap: 8, color: user ? (checkedToday ? "#3DA563" : "#111") : "#e8c96a", background: user ? (checkedToday ? "rgba(61,165,99,0.1)" : "#e8c96a") : "rgba(201,168,76,0.08)", border: user ? (checkedToday ? "1px solid #2f7d4d" : "1px solid #e8c96a") : "1px solid #7a6230", borderRadius: 10, padding: "11px 16px", fontSize: 13, fontWeight: 950, cursor: user && checkedToday ? "default" : "pointer" }}>
              <CalendarCheck size={16} /> {!user ? "登录后打卡" : claiming === "check-in" ? "写入中..." : checkedToday ? "今日已打卡" : "今日打卡 +15XP"}
            </button>
          </div>
        </div>

        {!loading && !user && (
          <section style={{ border: "1px solid #7a6230", borderRadius: 12, background: "rgba(201,168,76,0.065)", padding: "16px 18px", marginBottom: 18, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
            <div>
              <p style={{ color: "#fff", fontSize: 15, fontWeight: 950, marginBottom: 4 }}>登录后才能领取经验</p>
              <p style={{ color: "#d6c28a", fontSize: 12, lineHeight: 1.7 }}>你可以先浏览任务和学习路线；领取 XP、连续打卡和等级徽章需要绑定到账号。</p>
            </div>
            <Link href="/login?redirect=/growth" className="btn-primary" style={{ textDecoration: "none" }}>去登录</Link>
          </section>
        )}

        {notice && (
          <section style={{ border: `1px solid ${notice.includes("失败") || notice.includes("没有找到") ? "#5a2222" : "#2a1f10"}`, borderRadius: 10, background: notice.includes("失败") || notice.includes("没有找到") ? "rgba(217,72,65,0.08)" : "rgba(201,168,76,0.045)", color: notice.includes("失败") || notice.includes("没有找到") ? "#ff9a8f" : "#e8c96a", padding: "10px 14px", marginBottom: 18, fontSize: 12, fontWeight: 800 }}>
            {notice}
          </section>
        )}

        <section style={{ display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 14, marginBottom: 14 }} className="max-sm:grid-cols-1">
          <div style={{ border: "1px solid #2a1f10", borderRadius: 12, background: "rgba(201,168,76,0.055)", padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", flexWrap: "wrap", marginBottom: 14 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                  <Sparkles size={17} style={{ color: "#e8c96a" }} />
                  <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 950 }}>当前身份</h2>
                </div>
                <p style={{ color: currentLevel.accent, fontSize: 13, fontWeight: 950 }}>LV.{currentLevel.level} {currentLevel.name}</p>
              </div>
              <span style={{ color: "#e8c96a", border: "1px solid rgba(201,168,76,0.36)", borderRadius: 999, padding: "6px 10px", fontSize: 11, fontWeight: 950, background: "rgba(0,0,0,0.2)" }}>
                {state.streak} 天连击
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 14, overflow: "visible" }}>
              <LevelBadge compact name={user?.name || "个人"} xp={state.xp} contributionPoints={contributionPoints} coCreatorApproved={user?.coCreatorApproved} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 9, alignItems: "center" }}>
              <p style={{ color: "#fff", fontSize: 14, fontWeight: 950 }}>下一档</p>
              <p style={{ fontFamily: "'JetBrains Mono',monospace", color: "#e8c96a", fontSize: 12, fontWeight: 900 }}>
                {nextLevel ? `${displayXP}/${nextLevel.minXP}` : "最高档"}
              </p>
            </div>
            <div style={{ height: 9, background: "#111", border: "1px solid #242424", borderRadius: 999, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${levelPercent}%`, background: "linear-gradient(90deg,#7a6230,#e8c96a)", transition: "width 0.3s" }} />
            </div>
            <p style={{ color: "#aaa", fontSize: 12, lineHeight: 1.7, marginTop: 10 }}>
              {nextLevel ? nextLevelInfo?.requiresContribution ? `再拿 ${nextLevelInfo.need} 贡献值，解锁 LV.${nextLevel.level} ${nextLevel.name}。` : `再拿 ${nextLevel.minXP - state.xp} XP，解锁 LV.${nextLevel.level} ${nextLevel.name}。` : "你已经点亮最高身份。"}
            </p>
          </div>

          <div style={{ border: "1px solid #1a1a1a", borderRadius: 12, background: "rgba(255,255,255,0.03)", padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Target size={17} style={{ color: "#e8c96a" }} />
                <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 950 }}>今天只做这两件</h2>
              </div>
              <Link href="/missions" style={{ color: "#e8c96a", textDecoration: "none", fontSize: 12, fontWeight: 950 }}>全部任务</Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {visibleMissions.map((mission) => {
                const done = !!state.doneMissions[missionDoneKey(mission, today)]
                return (
                  <div key={mission.id} style={{ border: `1px solid ${done ? "#2f7d4d" : "#242424"}`, borderRadius: 10, background: done ? "rgba(61,165,99,0.07)" : "rgba(0,0,0,0.22)", padding: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", marginBottom: 10 }}>
                      <div>
                        <p style={{ color: "#fff", fontSize: 15, fontWeight: 950 }}>{mission.title}</p>
                        <p style={{ color: "#aaa", fontSize: 12, lineHeight: 1.65, marginTop: 4 }}>{mission.desc}</p>
                      </div>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", color: "#e8c96a", fontSize: 11, fontWeight: 900, whiteSpace: "nowrap" }}>+{mission.xp}XP</span>
                    </div>
                    <Link href={mission.href} className={done ? "btn-outline" : "btn-primary"} style={{ fontSize: 11, padding: "7px 14px", textDecoration: "none", display: "inline-flex" }}>
                      {done ? "已完成" : "去做"}
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 12, marginBottom: 14 }} className="max-sm:grid-cols-1">
          <div style={{ border: "1px solid #1a1a1a", borderRadius: 12, background: "rgba(255,255,255,0.03)", padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Flame size={16} style={{ color: "#e8c96a" }} />
              <p style={{ color: "#fff", fontSize: 15, fontWeight: 950 }}>成长数据</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <p style={{ color: "#777", fontSize: 11, marginBottom: 4 }}>经验</p>
                <p style={{ color: "#fff", fontSize: 17, fontWeight: 950 }}>{displayXP} XP</p>
              </div>
              <div>
                <p style={{ color: "#777", fontSize: 11, marginBottom: 4 }}>今日任务</p>
                <p style={{ color: "#fff", fontSize: 17, fontWeight: 950 }}>{doneCount}/{missions.length}</p>
              </div>
            </div>
          </div>

          <div style={{ border: "1px solid #1a1a1a", borderRadius: 12, background: "rgba(255,255,255,0.03)", padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Medal size={16} style={{ color: "#e8c96a" }} />
                <p style={{ color: "#fff", fontSize: 15, fontWeight: 950 }}>榜单摘要</p>
              </div>
              <Link href="/missions" style={{ color: "#e8c96a", textDecoration: "none", fontSize: 11, fontWeight: 950 }}>冲榜</Link>
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              <div style={{ display: "grid", gridTemplateColumns: "22px minmax(0,1fr) auto", gap: 8, alignItems: "center" }}>
                <Trophy size={15} style={{ color: rankColor(dailyTop.rank) }} />
                <LevelBadge compact name={dailyTop.name} xp={Number(dailyTop.totalXP || 0)} />
                <span style={{ color: "#e8c96a", fontSize: 11, fontWeight: 950, whiteSpace: "nowrap" }}>{dailyTop.xp} 分钟</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "22px minmax(0,1fr) auto", gap: 8, alignItems: "center" }}>
                <TrendingUp size={15} style={{ color: "#3DA563" }} />
                <LevelBadge compact name={weeklyTop.name} xp={Number(weeklyTop.totalXP || 0)} />
                <span style={{ color: "#3DA563", fontSize: 11, fontWeight: 950, whiteSpace: "nowrap" }}>{weeklyTop.xp} 个</span>
              </div>
            </div>
          </div>

          <div style={{ border: "1px solid #2a1f10", borderRadius: 12, background: "rgba(201,168,76,0.045)", padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Compass size={16} style={{ color: "#e8c96a" }} />
              <p style={{ color: "#fff", fontSize: 15, fontWeight: 950 }}>下一步</p>
            </div>
            <p style={{ color: "#ddd", fontSize: 13, fontWeight: 900, lineHeight: 1.6 }}>{suggestedStage.title}</p>
            <p style={{ color: "#888", fontSize: 12, lineHeight: 1.65, marginTop: 5 }}>{suggestedStage.subtitle}</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
              <Link href={`/learn/${suggestedStage.id}`} className="btn-primary" style={{ textDecoration: "none", fontSize: 11, padding: "7px 13px" }}>继续学习</Link>
              <Link href="/community/new" className="btn-outline" style={{ textDecoration: "none", fontSize: 11, padding: "7px 13px" }}>发复盘</Link>
            </div>
          </div>
        </section>

        <section style={{ border: "1px solid #1a1a1a", borderRadius: 12, background: "rgba(255,255,255,0.03)", padding: 18 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 13 }}>
            <div>
              <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 950, marginBottom: 5 }}>等级档案</h2>
              <p style={{ color: "#aaa", fontSize: 12, lineHeight: 1.65 }}>只展示当前档和下一档，完整等级以后放到专门页面。</p>
            </div>
            <LevelBadge compact name={user?.name || "个人"} xp={state.xp} contributionPoints={contributionPoints} coCreatorApproved={user?.coCreatorApproved} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 10 }} className="max-sm:grid-cols-1">
            <div style={{ border: `1px solid ${currentLevel.color}66`, borderRadius: 10, background: `${currentLevel.color}10`, padding: "13px 14px" }}>
              <p style={{ color: currentLevel.accent, fontSize: 13, fontWeight: 950, marginBottom: 5 }}>个人线 · LV.{currentLevel.level} {currentLevel.name}</p>
              <p style={{ color: "#aaa", fontSize: 12, lineHeight: 1.7 }}>{currentLevel.reward.vanity}</p>
              <p style={{ fontFamily: "'JetBrains Mono',monospace", color: "#777", fontSize: 10, marginTop: 7 }}>
                {nextLevel ? personalNeedsReview ? `下一档需审核：LV.${nextLevel.level} ${nextLevel.name}` : nextLevelInfo?.requiresContribution ? `下一档还差 ${nextLevelInfo.need} 贡献值` : `下一档还差 ${nextLevel.minXP - state.xp} XP` : "已达最高档"}
              </p>
            </div>
            <div style={{ border: `1px solid ${teamLevel.color}66`, borderRadius: 10, background: `${teamLevel.color}10`, padding: "13px 14px" }}>
              <p style={{ color: teamLevel.accent, fontSize: 13, fontWeight: 950, marginBottom: 5 }}>团队线 · LV.{teamLevel.level} {teamLevel.name}</p>
              <p style={{ color: "#aaa", fontSize: 12, lineHeight: 1.7 }}>{teamLevel.reward.vanity}</p>
              <p style={{ fontFamily: "'JetBrains Mono',monospace", color: "#777", fontSize: 10, marginTop: 7 }}>
                {teamNextLevel ? teamNeedsReview ? `下一档需审核：LV.${teamNextLevel.level} ${teamNextLevel.name}` : teamNextLevelInfo?.requiresContribution ? `下一档还差 ${teamNextLevelInfo.need} 贡献值` : `下一档还差 ${teamNextLevel.minXP - state.xp} XP` : "已达最高档"}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
