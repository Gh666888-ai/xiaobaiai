"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CalendarCheck, CheckCircle2, Compass, Flame, Medal, Rocket, Sparkles, Target, Trophy, TrendingUp } from "lucide-react"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"
import { LevelBadge, LevelIcon } from "@/components/LevelBadge"
import { XiaobaiMascot } from "@/components/XiaobaiMascot"
import { stages } from "@/data/learning-path"
import { progressId, readLearningProgress } from "@/lib/learning-progress"
import { useAuth } from "@/lib/AuthContext"
import { readAppAuth } from "@/lib/app-auth"
import { getNextLevel, getUserLevel, LEVELS, LEVEL_TRACKS } from "@/data/user"
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
  const isCoCreatorMode = Boolean(user?.coCreatorApproved)
  const currentLevel = getUserLevel(state.xp, "personal", levelAccess)
  const nextLevelInfo = getNextLevel(state.xp, "personal", levelAccess)
  const nextLevel = nextLevelInfo?.level || null
  const personalNeedsReview = Boolean(nextLevelInfo?.requiresReview)
  const teamLevel = getUserLevel(state.xp, "team", levelAccess)
  const teamNextLevelInfo = getNextLevel(state.xp, "team", levelAccess)
  const teamNextLevel = teamNextLevelInfo?.level || null
  const teamNeedsReview = Boolean(teamNextLevelInfo?.requiresReview)
  const levelGallery = useMemo(() => {
    const track = user?.coCreatorTrack === "team" ? "team" : "personal"
    return (LEVEL_TRACKS[track] || LEVEL_TRACKS.personal).map((level) => ({
      level,
      unlocked: isCoCreatorMode || currentLevel.level >= level.level,
    }))
  }, [currentLevel.level, isCoCreatorMode, user?.coCreatorTrack])
  const displayXP = nextLevel ? state.xp : LEVELS[LEVELS.length - 1]?.minXP || state.xp
  const badge = levelBadge(state.xp)
  const levelBaseXP = currentLevel.minXP
  const levelNextXP = nextLevel?.minXP || Math.max(currentLevel.minXP + 1, state.xp)
  const levelPercent = Math.min(100, Math.round(((state.xp - levelBaseXP) / Math.max(1, levelNextXP - levelBaseXP)) * 100))
  const currentDailyXP = viewerHint?.dailyXP || 0
  const currentOnlineMinutes = viewerHint?.onlineMinutes || 0
  const topDailyXP = dailyLeaders[0]?.xp || 68
  const needToTop = Math.max(0, topDailyXP - currentOnlineMinutes + 5)
  const welcomeMission = missions.find((mission) => mission.id === "welcome")
  const welcomeDone = !!welcomeMission && !!state.doneMissions[missionDoneKey(welcomeMission, today)]
  const starterSteps = [
    {
      title: "先选一个真实任务",
      desc: "不再登录就领经验。先选今天要做成什么，完整完成后再拿大额 XP。",
      xp: 0,
      done: welcomeDone || state.xp >= 50,
      href: "/growth",
      action: "去开始",
      onClick: () => router.push("/start"),
    },
    {
      title: "评论一条经验",
      desc: "补充用法、踩坑点或替代工具，低门槛拿到第一份贡献感。",
      xp: 3,
      done: currentDailyXP >= 53,
      href: "/community",
      action: "去评论",
    },
    {
      title: "发一篇模板帖",
      desc: "用发帖模板把真实经历整理出来，发帖成功 +10XP。",
      xp: 10,
      done: currentDailyXP >= 60,
      href: "/community/new",
      action: "去发帖",
    },
  ]

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
            <div style={{ display: "grid", gridTemplateColumns: "54px minmax(0, 150px)", alignItems: "center", gap: 10, border: `1px solid ${currentLevel.color}66`, borderRadius: 14, background: `${currentLevel.color}10`, padding: "9px 12px", minHeight: 84, width: 252, overflow: "visible" }}>
              <div style={{ width: 54, height: 64, display: "flex", alignItems: "center", justifyContent: "center", overflow: "visible" }}>
                <div style={{ transform: "scale(0.72)", transformOrigin: "center" }}>
                  <LevelIcon level={currentLevel.level} name={currentLevel.name} compact />
                </div>
              </div>
              <div style={{ minWidth: 0, display: "grid", gap: 2, justifyItems: "start" }}>
                <span style={{ color: currentLevel.accent, fontSize: 14, fontWeight: 950, lineHeight: 1.2 }}>{currentLevel.level >= 19 ? currentLevel.name : `LV.${currentLevel.level} ${currentLevel.name}`}</span>
                <div style={{ width: 116, height: 36, display: "flex", alignItems: "center", justifyContent: "center", overflow: "visible", marginTop: 1 }}>
                  <div style={{ transform: "scale(0.66)", transformOrigin: "center" }}>
                    <LevelBadge compact name={user?.name || "个人"} xp={state.xp} contributionPoints={contributionPoints} coCreatorApproved={user?.coCreatorApproved} />
                  </div>
                </div>
              </div>
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

        <section style={{ border: "1px solid #2a1f10", borderRadius: 12, background: "rgba(201,168,76,0.055)", padding: 20, marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 15 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                <Rocket size={17} style={{ color: "#e8c96a" }} />
                <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 950 }}>新手 3 步冲今日榜</h2>
              </div>
              <p style={{ color: "#d6c28a", fontSize: 12, lineHeight: 1.75 }}>
                今日榜每天清零，新用户不是追老玩家总分，而是拼今天的行动。
              </p>
            </div>
            <div style={{ border: "1px solid rgba(201,168,76,0.38)", borderRadius: 10, background: "rgba(0,0,0,0.22)", padding: "10px 12px", minWidth: 190 }}>
              <p style={{ color: "#aaa", fontSize: 11, marginBottom: 4 }}>今日进度</p>
              <p style={{ color: "#fff", fontSize: 15, fontWeight: 950 }}>{user ? `${currentDailyXP} XP` : "登录后记录真实完成"}</p>
              <p style={{ color: needToTop <= 0 ? "#3DA563" : "#d6c28a", fontSize: 11, lineHeight: 1.65, marginTop: 4 }}>
                {!user ? "经验来自任务、学习、发帖和评论" : needToTop <= 0 ? "你今天已经有机会冲第一" : `再拿 ${needToTop} XP 可冲今日第 1`}
              </p>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 10 }} className="max-sm:grid-cols-1">
            {starterSteps.map((step, index) => (
              <div key={step.title} style={{ border: `1px solid ${step.done ? "#2f7d4d" : "#242424"}`, borderRadius: 10, background: step.done ? "rgba(61,165,99,0.075)" : "rgba(0,0,0,0.24)", padding: 15, minHeight: 150, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", marginBottom: 9 }}>
                  <span style={{ width: 26, height: 26, borderRadius: 999, display: "inline-flex", alignItems: "center", justifyContent: "center", background: step.done ? "rgba(61,165,99,0.16)" : "rgba(201,168,76,0.1)", color: step.done ? "#3DA563" : "#e8c96a", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 950 }}>{step.done ? "✓" : index + 1}</span>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", color: "#e8c96a", fontSize: 11, fontWeight: 900, whiteSpace: "nowrap" }}>+{step.xp}XP</span>
                </div>
                <p style={{ color: "#fff", fontSize: 15, fontWeight: 950, marginBottom: 6 }}>{step.title}</p>
                <p style={{ color: "#aaa", fontSize: 12, lineHeight: 1.7, flex: 1 }}>{step.desc}</p>
                {index === 0 ? (
                  <button type="button" onClick={step.onClick} className="btn-primary" style={{ marginTop: 12, justifyContent: "center", fontSize: 12 }}>
                    {step.action}
                  </button>
                ) : (
                  <Link href={step.href} className="btn-outline" style={{ marginTop: 12, justifyContent: "center", fontSize: 12, textDecoration: "none" }}>{step.action}</Link>
                )}
              </div>
            ))}
          </div>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 10, marginBottom: 18 }} className="max-sm:grid-cols-2">
          {[
            { icon: <Trophy size={18} />, label: "等级", value: `LV.${currentLevel.level} ${currentLevel.name}` },
            { icon: <Sparkles size={18} />, label: isCoCreatorMode ? "共创贡献" : "成长积分", value: isCoCreatorMode ? `${contributionPoints} 贡献值` : nextLevel ? `${displayXP} XP` : "已达最高档" },
            { icon: <Flame size={18} />, label: "连续打卡", value: `${state.streak} 天` },
            { icon: <CheckCircle2 size={18} />, label: "今日任务", value: `${doneCount}/${missions.length}` },
          ].map((item) => (
            <div key={item.label} style={{ border: "1px solid #1a1a1a", borderRadius: 12, background: "rgba(255,255,255,0.03)", padding: 18 }}>
              <div style={{ color: "#e8c96a", marginBottom: 10 }}>{item.icon}</div>
              <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#777", marginBottom: 5 }}>{item.label}</p>
              <p style={{ color: "#fff", fontSize: 16, fontWeight: 950 }}>{item.value}</p>
            </div>
          ))}
        </section>

        <section style={{ border: "1px solid #2a1f10", borderRadius: 12, padding: 18, background: "rgba(201,168,76,0.05)", marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 10, alignItems: "center" }}>
            <p style={{ color: "#fff", fontSize: 14, fontWeight: 950 }}>下一步目标</p>
            <p style={{ fontFamily: "'JetBrains Mono',monospace", color: "#e8c96a", fontSize: 12, fontWeight: 900 }}>
              {nextLevel ? `${displayXP}/${nextLevel.minXP}` : "最高档"}
            </p>
          </div>
              <div style={{ height: 9, background: "#111", border: "1px solid #242424", borderRadius: 999, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${levelPercent}%`, background: "linear-gradient(90deg,#7a6230,#e8c96a)", transition: "width 0.3s" }} />
              </div>
              <p style={{ color: "#aaa", fontSize: 12, lineHeight: 1.7, marginTop: 10 }}>
                当前战利品：{currentLevel.reward.vanity}
                {nextLevel ? nextLevelInfo?.requiresContribution ? ` 下一步再做 ${nextLevelInfo.need} 贡献值，解锁 LV.${nextLevel.level} ${nextLevel.name}：${nextLevel.reward.title}。` : ` 下一步再拿 ${nextLevel.minXP - state.xp} XP，解锁 LV.${nextLevel.level} ${nextLevel.name}：${nextLevel.reward.title}。` : " 你已经点亮最高身份。"}
              </p>
        </section>

        <section style={{ border: "1px solid #1a1a1a", borderRadius: 12, background: "rgba(255,255,255,0.03)", padding: 20, marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Medal size={18} style={{ color: "#e8c96a" }} />
              <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 950 }}>成长榜</h2>
            </div>
            <Link href="/missions" style={{ color: "#e8c96a", textDecoration: "none", fontSize: 12, fontWeight: 950 }}>做任务冲榜</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="max-sm:grid-cols-1">
            <div style={{ border: "1px solid #242424", borderRadius: 10, background: "rgba(0,0,0,0.24)", padding: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
                <Trophy size={15} style={{ color: "#e8c96a" }} />
                <p style={{ color: "#fff", fontSize: 14, fontWeight: 950 }}>今日在线时长榜</p>
              </div>
              {user && viewerHint && (
                <p style={{ color: viewerHint.needXP <= 0 ? "#3DA563" : "#d6c28a", fontSize: 12, lineHeight: 1.7, marginBottom: 10 }}>
                  {viewerHint.needXP <= 0 ? `你今天在线 ${currentOnlineMinutes} 分钟，正在榜内。` : `你今天在线 ${currentOnlineMinutes} 分钟，再在线 ${viewerHint.needXP} 分钟就能冲进今日榜。`}
                </p>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(dailyLeaders.length ? dailyLeaders.slice(0, 6) : [{ rank: 1, name: "今天等你上榜", xp: 0, totalXP: state.xp }]).map((item) => {
                  const itemLevel = getUserLevel(Number(item.totalXP || 0), "personal")
                  return (
                  <div key={`${item.rank}-${item.name}`} style={{ display: "grid", gridTemplateColumns: "34px 38px 1fr auto", gap: 10, alignItems: "center", minHeight: 44 }}>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", color: rankColor(item.rank), fontSize: 13, fontWeight: 950 }}>#{item.rank}</span>
                    <div style={{ width: 34, height: 40, display: "flex", alignItems: "center", justifyContent: "center", overflow: "visible" }} title={`LV.${itemLevel.level} ${itemLevel.name}`}>
                      <div style={{ transform: "scale(0.42)", transformOrigin: "center" }}>
                        <LevelIcon level={itemLevel.level} name={itemLevel.name} compact />
                      </div>
                    </div>
                    <span style={{ color: "#fff", fontSize: 14, fontWeight: 950, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</span>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", color: "#e8c96a", fontSize: 11, fontWeight: 900 }}>{item.xp} 分钟</span>
                  </div>
                  )
                })}
              </div>
            </div>
            <div style={{ border: "1px solid #2a1f10", borderRadius: 10, background: "rgba(201,168,76,0.045)", padding: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
                <TrendingUp size={15} style={{ color: "#3DA563" }} />
                <p style={{ color: "#fff", fontSize: 14, fontWeight: 950 }}>近 7 天任务个数榜</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(weeklyLeaders.length ? weeklyLeaders.slice(0, 6) : [{ rank: 1, name: "今天第一个冲榜的人", xp: 0, totalXP: 0 }]).map((item) => {
                  const itemLevel = getUserLevel(Number(item.totalXP || 0), "personal")
                  return (
                  <div key={`${item.rank}-${item.name}`} style={{ display: "grid", gridTemplateColumns: "34px 38px 1fr auto", gap: 10, alignItems: "center", minHeight: 44 }}>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", color: rankColor(item.rank), fontSize: 13, fontWeight: 950 }}>#{item.rank}</span>
                    <div style={{ width: 34, height: 40, display: "flex", alignItems: "center", justifyContent: "center", overflow: "visible" }} title={`LV.${itemLevel.level} ${itemLevel.name}`}>
                      <div style={{ transform: "scale(0.42)", transformOrigin: "center" }}>
                        <LevelIcon level={itemLevel.level} name={itemLevel.name} compact />
                      </div>
                    </div>
                    <span style={{ color: "#fff", fontSize: 14, fontWeight: 950, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</span>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", color: "#3DA563", fontSize: 11, fontWeight: 900 }}>{item.xp} 个任务</span>
                  </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 16 }} className="max-sm:grid-cols-1">
          <section style={{ border: "1px solid #1a1a1a", borderRadius: 12, background: "rgba(255,255,255,0.03)", padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <Target size={17} style={{ color: "#e8c96a" }} />
              <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 950 }}>今日任务</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {missions.map((mission) => {
                const done = !!state.doneMissions[missionDoneKey(mission, today)]
                return (
                  <div key={mission.id} style={{ border: `1px solid ${done ? "#2f7d4d" : "#242424"}`, borderRadius: 10, background: done ? "rgba(61,165,99,0.07)" : "rgba(0,0,0,0.22)", padding: 15 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "flex-start" }}>
                      <div>
                        <p style={{ color: "#fff", fontSize: 15, fontWeight: 950 }}>{mission.title}</p>
                        <p style={{ color: "#aaa", fontSize: 12, lineHeight: 1.75, marginTop: 5 }}>{mission.desc}</p>
                      </div>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", color: "#e8c96a", fontSize: 11, fontWeight: 900, whiteSpace: "nowrap" }}>{mission.cadence === "once" ? "一次性 " : ""}+{mission.xp}XP</span>
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                      <Link href={mission.href} className="btn-outline" style={{ fontSize: 11, padding: "6px 13px", textDecoration: "none" }}>去完成</Link>
                      {mission.claimMode === "action" ? (
                        <Link href={mission.href} className={done ? "btn-outline" : "btn-primary"} style={{ fontSize: 11, padding: "6px 13px", textDecoration: "none" }}>
                          {done ? "已领取" : "完成后领取"}
                        </Link>
                      ) : (
                        <Link href={mission.href} className="btn-outline" style={{ fontSize: 11, padding: "6px 13px", textDecoration: "none" }}>
                          去完成动作
                        </Link>
                      )}
                      <p style={{ color: "#777", fontSize: 11, lineHeight: 1.65, width: "100%", marginTop: 4 }}>{mission.proofHint}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          <aside style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ border: "1px solid #1a1a1a", borderRadius: 12, background: "rgba(255,255,255,0.03)", padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <Compass size={17} style={{ color: "#e8c96a" }} />
                <h2 style={{ color: "#fff", fontSize: 17, fontWeight: 950 }}>下一步推荐</h2>
              </div>
              <p style={{ color: "#ddd", fontSize: 14, lineHeight: 1.8 }}>{suggestedStage.title}</p>
              <p style={{ color: "#888", fontSize: 12, lineHeight: 1.8, marginTop: 6 }}>{suggestedStage.subtitle}</p>
              <Link href={`/learn/${suggestedStage.id}`} className="btn-primary" style={{ textDecoration: "none", marginTop: 14, display: "inline-flex" }}>继续学习</Link>
            </div>

            <div style={{ border: "1px solid #2a1f10", borderRadius: 12, background: "rgba(201,168,76,0.045)", padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <Rocket size={17} style={{ color: "#e8c96a" }} />
                <h2 style={{ color: "#fff", fontSize: 17, fontWeight: 950 }}>站内路线</h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Link href="/choose-tool" style={{ color: "#c9a84c", textDecoration: "none", fontSize: 13, fontWeight: 900 }}>1. 先选工具</Link>
                <Link href="/learn" style={{ color: "#c9a84c", textDecoration: "none", fontSize: 13, fontWeight: 900 }}>2. 按章节学习</Link>
                <Link href="/community" style={{ color: "#c9a84c", textDecoration: "none", fontSize: 13, fontWeight: 900 }}>3. 看真实案例</Link>
                <Link href="/community/new" style={{ color: "#c9a84c", textDecoration: "none", fontSize: 13, fontWeight: 900 }}>4. 分享你的成果</Link>
              </div>
            </div>
          </aside>
        </div>

        <section style={{ marginTop: 18, border: "1px solid #1a1a1a", borderRadius: 12, background: "rgba(255,255,255,0.03)", padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-end", flexWrap: "wrap", marginBottom: 14 }}>
            <div>
              <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 950, marginBottom: 6 }}>等级档案</h2>
              <p style={{ color: "#aaa", fontSize: 12, lineHeight: 1.7 }}>个人和公司团队用两套称号。共创是最高档，不会在普通等级里乱出现。</p>
            </div>
            <LevelBadge compact name={user?.name || "个人"} xp={state.xp} contributionPoints={contributionPoints} coCreatorApproved={user?.coCreatorApproved} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }} className="max-sm:grid-cols-1">
            <div style={{ border: `1px solid ${currentLevel.color}`, borderRadius: 10, background: `${currentLevel.color}12`, padding: "14px 15px" }}>
              <p style={{ color: currentLevel.accent, fontSize: 13, fontWeight: 950, marginBottom: 6 }}>个人线 · LV.{currentLevel.level} {currentLevel.name}</p>
              <p style={{ color: currentLevel.accent, fontSize: 12, fontWeight: 950, lineHeight: 1.55, marginBottom: 5 }}>{currentLevel.reward.title}</p>
              <p style={{ color: "#aaa", fontSize: 12, lineHeight: 1.75, marginBottom: 8 }}>{currentLevel.reward.vanity}</p>
              <p style={{ color: "#8f8f8f", fontSize: 12, lineHeight: 1.7, marginBottom: 8 }}>{currentLevel.desc}</p>
              <p style={{ fontFamily: "'JetBrains Mono',monospace", color: "#777", fontSize: 10 }}>
                {nextLevel ? personalNeedsReview ? `共创门槛已到：申请审核后解锁 LV.${nextLevel.level} ${nextLevel.name}` : nextLevelInfo?.requiresContribution ? `下一档：LV.${nextLevel.level} ${nextLevel.name}，还差 ${nextLevelInfo.need} 贡献值` : `下一档：LV.${nextLevel.level} ${nextLevel.name}，还差 ${nextLevel.minXP - state.xp} XP` : "最高档：小白AI共创神"}
              </p>
            </div>
            <div style={{ border: `1px solid ${teamLevel.color}`, borderRadius: 10, background: `${teamLevel.color}12`, padding: "14px 15px" }}>
              <p style={{ color: teamLevel.accent, fontSize: 13, fontWeight: 950, marginBottom: 6 }}>公司/团队线 · LV.{teamLevel.level} {teamLevel.name}</p>
              <p style={{ color: teamLevel.accent, fontSize: 12, fontWeight: 950, lineHeight: 1.55, marginBottom: 5 }}>{teamLevel.reward.title}</p>
              <p style={{ color: "#aaa", fontSize: 12, lineHeight: 1.75, marginBottom: 8 }}>{teamLevel.reward.vanity}</p>
              <p style={{ color: "#8f8f8f", fontSize: 12, lineHeight: 1.7, marginBottom: 8 }}>{teamLevel.desc}</p>
              <p style={{ fontFamily: "'JetBrains Mono',monospace", color: "#777", fontSize: 10 }}>
                {teamNextLevel ? teamNeedsReview ? `共创门槛已到：申请审核后解锁 LV.${teamNextLevel.level} ${teamNextLevel.name}` : teamNextLevelInfo?.requiresContribution ? `下一档：LV.${teamNextLevel.level} ${teamNextLevel.name}，还差 ${teamNextLevelInfo.need} 贡献值` : `下一档：LV.${teamNextLevel.level} ${teamNextLevel.name}，还差 ${teamNextLevel.minXP - state.xp} XP` : "最高档：小白AI共创神队"}
              </p>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10, marginTop: 10 }} className="max-sm:grid-cols-1">
            {nextLevel ? (
              <div style={{ border: "1px solid #242424", borderRadius: 10, background: "rgba(0,0,0,0.24)", padding: "14px 15px" }}>
                <p style={{ color: "#aaa", fontSize: 13, fontWeight: 950, marginBottom: 6 }}>个人下一级 · LV.{nextLevel.level} {nextLevel.name}</p>
                <p style={{ color: "#bbb", fontSize: 12, fontWeight: 950, lineHeight: 1.55, marginBottom: 5 }}>{nextLevel.reward.title}</p>
                <p style={{ color: "#aaa", fontSize: 12, lineHeight: 1.75, marginBottom: 8 }}>{nextLevel.reward.vanity}</p>
                <p style={{ fontFamily: "'JetBrains Mono',monospace", color: personalNeedsReview || nextLevelInfo?.requiresContribution ? "#e8c96a" : "#777", fontSize: 10 }}>{personalNeedsReview ? "已达到 XP 门槛，需要人工审核真实案例和复盘质量" : nextLevelInfo?.requiresContribution ? `还差 ${nextLevelInfo.need} 贡献值，实战案例被验证后涨得最快` : `还差 ${nextLevel.minXP - state.xp} XP`}</p>
              </div>
            ) : (
              <div style={{ border: "1px solid #2a1f10", borderRadius: 10, background: "rgba(201,168,76,0.045)", padding: "14px 15px" }}>
                <p style={{ color: "#d6c28a", fontSize: 13, fontWeight: 950, marginBottom: 6 }}>下一步</p>
                <p style={{ color: "#fff", fontSize: 12, fontWeight: 950, lineHeight: 1.55, marginBottom: 5 }}>保持最高档</p>
                <p style={{ color: "#aaa", fontSize: 12, lineHeight: 1.75, marginBottom: 8 }}>继续完成任务、发布复盘和参与共建，保留高阶身份展示。</p>
                <p style={{ fontFamily: "'JetBrains Mono',monospace", color: "#777", fontSize: 10 }}>已达最高档</p>
              </div>
            )}
            {teamNextLevel ? (
              <div style={{ border: "1px solid #242424", borderRadius: 10, background: "rgba(0,0,0,0.24)", padding: "14px 15px" }}>
                <p style={{ color: "#aaa", fontSize: 13, fontWeight: 950, marginBottom: 6 }}>团队下一级 · LV.{teamNextLevel.level} {teamNextLevel.name}</p>
                <p style={{ color: "#bbb", fontSize: 12, fontWeight: 950, lineHeight: 1.55, marginBottom: 5 }}>{teamNextLevel.reward.title}</p>
                <p style={{ color: "#aaa", fontSize: 12, lineHeight: 1.75, marginBottom: 8 }}>{teamNextLevel.reward.vanity}</p>
                <p style={{ fontFamily: "'JetBrains Mono',monospace", color: teamNeedsReview || teamNextLevelInfo?.requiresContribution ? "#e8c96a" : "#777", fontSize: 10 }}>{teamNeedsReview ? "已达到 XP 门槛，需要人工审核团队案例和流程沉淀" : teamNextLevelInfo?.requiresContribution ? `还差 ${teamNextLevelInfo.need} 贡献值，团队案例被验证后涨得最快` : `还差 ${teamNextLevel.minXP - state.xp} XP`}</p>
              </div>
            ) : (
              <div style={{ border: "1px solid #2a1f10", borderRadius: 10, background: "rgba(201,168,76,0.045)", padding: "14px 15px" }}>
                <p style={{ color: "#d6c28a", fontSize: 13, fontWeight: 950, marginBottom: 6 }}>团队下一步</p>
                <p style={{ color: "#fff", fontSize: 12, fontWeight: 950, lineHeight: 1.55, marginBottom: 5 }}>保持最高档</p>
                <p style={{ color: "#aaa", fontSize: 12, lineHeight: 1.75, marginBottom: 8 }}>继续沉淀团队实战案例、流程模板和企业复盘。</p>
                <p style={{ fontFamily: "'JetBrains Mono',monospace", color: "#777", fontSize: 10 }}>已达最高档</p>
              </div>
            )}
          </div>
          <div style={{ marginTop: 14, border: "1px solid #2a1f10", borderRadius: 12, background: "rgba(0,0,0,0.25)", padding: "16px 14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
              <div>
                <p style={{ color: "#fff", fontSize: 15, fontWeight: 950, marginBottom: 4 }}>全等级名牌陈列</p>
                <p style={{ color: "#aaa", fontSize: 12, lineHeight: 1.7 }}>
                  {isCoCreatorMode ? "共创身份已开启，可以预览所有等级图标。" : "普通用户先看已解锁图标；共创审核通过后开放全等级预览。"}
                </p>
              </div>
              <span style={{ color: isCoCreatorMode ? "#7ee7ff" : "#d6c28a", border: `1px solid ${isCoCreatorMode ? "rgba(126,231,255,0.45)" : "rgba(201,168,76,0.35)"}`, borderRadius: 999, padding: "5px 10px", fontSize: 11, fontWeight: 950, background: "rgba(255,255,255,0.035)" }}>
                {isCoCreatorMode ? "共创可见全部" : `已解锁 LV.${currentLevel.level}`}
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px 12px" }} className="max-sm:grid-cols-1">
              {levelGallery.map(({ level, unlocked }) => (
                <div key={level.level} style={{ border: `1px solid ${unlocked ? `${level.color}66` : "#242424"}`, borderRadius: 10, background: unlocked ? `${level.color}10` : "rgba(255,255,255,0.02)", padding: "12px 10px", minHeight: level.level >= 15 ? 116 : level.level >= 10 ? 132 : level.level >= 7 ? 120 : 106, opacity: unlocked ? 1 : 0.48 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
                    <p style={{ color: level.accent, fontSize: 12, fontWeight: 950 }}>LV.{level.level} {level.name}</p>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", color: unlocked ? "#e8c96a" : "#777", fontSize: 10, fontWeight: 900 }}>{level.level >= 15 ? "共创" : `${level.minXP}XP`}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: level.level >= 15 ? 162 : 146, overflow: "visible" }}>
                    <LevelIcon level={level.level} name={level.name} locked={!unlocked} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
