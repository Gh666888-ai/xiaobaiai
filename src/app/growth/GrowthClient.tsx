"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CalendarCheck, CheckCircle2, Compass, Flame, Medal, Rocket, Sparkles, Target, Trophy, TrendingUp } from "lucide-react"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"
import { LevelBadge } from "@/components/LevelBadge"
import { XiaobaiMascot } from "@/components/XiaobaiMascot"
import { stages } from "@/data/learning-path"
import { progressId, readLearningProgress } from "@/lib/learning-progress"
import { useAuth } from "@/lib/AuthContext"
import { readAppAuth } from "@/lib/app-auth"
import { LEVELS } from "@/data/user"
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
  rank: number | null
  needXP: number
}

const GROWTH_KEY = "xiaobaiai:growth:v1"

const missions = GROWTH_MISSIONS

const levelBenefits = [
  "解锁成长档案，记录每日任务和在线经验。",
  "社区昵称显示星火等级，评论更容易被看见。",
  "学习路径进度展示更完整，推荐更贴近新手。",
  "社区身份升级，发帖和评论显示金核徽章。",
  "Agent和工作流内容优先推荐，适合进阶用户。",
  "星环身份展示，后续优先开放高级模板。",
  "皇冠身份展示，社区高阶玩家标识。",
  "小白AI共创者身份，参与内测和共创展示。",
]

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

function levelName(xp: number) {
  if (xp >= 1200) return { name: "Agent 实战者", next: 1600 }
  if (xp >= 700) return { name: "工作流搭建者", next: 1200 }
  if (xp >= 360) return { name: "AI 工具熟手", next: 700 }
  if (xp >= 120) return { name: "提示词练习生", next: 360 }
  return { name: "AI 新手", next: 120 }
}

function levelBadge(xp: number) {
  if (xp >= 1200) return { title: "实战徽章", subtitle: "已经能独立搭 Agent", color: "#e8c96a", mood: "complete" as const }
  if (xp >= 700) return { title: "工作流徽章", subtitle: "能把工具串成流程", color: "#3DA563", mood: "recommend" as const }
  if (xp >= 360) return { title: "工具熟手徽章", subtitle: "能判断工具适不适合", color: "#e8c96a", mood: "happy" as const }
  if (xp >= 120) return { title: "练习生徽章", subtitle: "开始稳定练提示词", color: "#c9a84c", mood: "thinking" as const }
  return { title: "新手徽章", subtitle: "从第一步开始发光", color: "#c9a84c", mood: "welcome" as const }
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
  const [registeredUsers, setRegisteredUsers] = useState<number | null>(null)
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
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.registeredUsers === "number") setRegisteredUsers(data.registeredUsers)
      })
      .catch(() => undefined)
  }, [])

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
  const level = levelName(state.xp)
  const badge = levelBadge(state.xp)
  const levelPercent = Math.min(100, Math.round((state.xp / level.next) * 100))
  const currentDailyXP = viewerHint?.dailyXP || 0
  const topDailyXP = dailyLeaders[0]?.xp || 68
  const needToTop = Math.max(0, topDailyXP - currentDailyXP + 1)
  const welcomeMission = missions.find((mission) => mission.id === "welcome")
  const welcomeDone = !!welcomeMission && !!state.doneMissions[missionDoneKey(welcomeMission, today)]
  const starterSteps = [
    {
      title: "领新手礼包",
      desc: "先拿 50XP，今天就有机会进入榜单前排。",
      xp: 50,
      done: welcomeDone || state.xp >= 50,
      href: "/growth",
      action: user ? "领取礼包" : "注册领取",
      onClick: () => user ? finishMission("welcome") : requireLogin(),
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
      setNotice(awarded > 0 ? `领取成功，${awarded} XP 已进入你的账号等级。` : "这个奖励已经领过啦，换个任务继续升级。")
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
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, border: "1px solid #2a1f10", borderRadius: 14, background: "rgba(201,168,76,0.055)", padding: "10px 13px" }}>
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
              <p style={{ color: "#fff", fontSize: 15, fontWeight: 950 }}>{user ? `${currentDailyXP} XP` : "注册后从 50XP 起步"}</p>
              <p style={{ color: needToTop <= 0 ? "#3DA563" : "#d6c28a", fontSize: 11, lineHeight: 1.65, marginTop: 4 }}>
                {!user ? "领完礼包就能冲前排" : needToTop <= 0 ? "你今天已经有机会冲第一" : `再拿 ${needToTop} XP 可冲今日第 1`}
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
                  <button type="button" onClick={step.onClick} disabled={!!user && (step.done || claiming === "welcome")} className={step.done ? "btn-outline" : "btn-primary"} style={{ marginTop: 12, justifyContent: "center", fontSize: 12 }}>
                    {!user ? step.action : claiming === "welcome" ? "写入中..." : step.done ? "已完成" : step.action}
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
            { icon: <Trophy size={18} />, label: "等级", value: level.name },
            { icon: <Sparkles size={18} />, label: "经验值", value: `${state.xp} XP` },
            { icon: <Flame size={18} />, label: "连续打卡", value: `${state.streak} 天` },
            { icon: <CheckCircle2 size={18} />, label: registeredUsers === null ? "今日任务" : "注册用户", value: registeredUsers === null ? `${doneCount}/${missions.length}` : `${registeredUsers} 人` },
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
            <p style={{ color: "#fff", fontSize: 14, fontWeight: 950 }}>等级进度</p>
            <p style={{ fontFamily: "'JetBrains Mono',monospace", color: "#e8c96a", fontSize: 12, fontWeight: 900 }}>{state.xp}/{level.next}</p>
          </div>
          <div style={{ height: 9, background: "#111", border: "1px solid #242424", borderRadius: 999, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${levelPercent}%`, background: "linear-gradient(90deg,#7a6230,#e8c96a)", transition: "width 0.3s" }} />
          </div>
        </section>

        <section style={{ border: "1px solid #1a1a1a", borderRadius: 12, background: "rgba(255,255,255,0.03)", padding: 20, marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Medal size={18} style={{ color: "#e8c96a" }} />
              <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 950 }}>成长榜</h2>
            </div>
            <Link href="/community/new" style={{ color: "#e8c96a", textDecoration: "none", fontSize: 12, fontWeight: 950 }}>发帖 +10XP 冲榜</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="max-sm:grid-cols-1">
            <div style={{ border: "1px solid #242424", borderRadius: 10, background: "rgba(0,0,0,0.24)", padding: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
                <Trophy size={15} style={{ color: "#e8c96a" }} />
                <p style={{ color: "#fff", fontSize: 14, fontWeight: 950 }}>今日经验榜</p>
              </div>
              {user && viewerHint && (
                <p style={{ color: viewerHint.needXP <= 0 ? "#3DA563" : "#d6c28a", fontSize: 12, lineHeight: 1.7, marginBottom: 10 }}>
                  {viewerHint.needXP <= 0 ? `你今天已拿 ${viewerHint.dailyXP} XP，正在榜内。` : `你今天已拿 ${viewerHint.dailyXP} XP，再拿 ${viewerHint.needXP} XP 就能冲进今日榜。`}
                </p>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(dailyLeaders.length ? dailyLeaders.slice(0, 6) : [{ rank: 1, name: "今天等你上榜", xp: 0, totalXP: state.xp }]).map((item) => (
                  <div key={`${item.rank}-${item.name}`} style={{ display: "grid", gridTemplateColumns: "34px 1fr auto", gap: 10, alignItems: "center", minHeight: 40 }}>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", color: rankColor(item.rank), fontSize: 13, fontWeight: 950 }}>#{item.rank}</span>
                    <LevelBadge compact name={item.name} xp={Number(item.totalXP || item.xp || 0)} />
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", color: "#e8c96a", fontSize: 11, fontWeight: 900 }}>+{item.xp} XP</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ border: "1px solid #2a1f10", borderRadius: 10, background: "rgba(201,168,76,0.045)", padding: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
                <TrendingUp size={15} style={{ color: "#3DA563" }} />
                <p style={{ color: "#fff", fontSize: 14, fontWeight: 950 }}>近 7 天活跃榜</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(weeklyLeaders.length ? weeklyLeaders.slice(0, 6) : [{ rank: 1, name: "今天第一个冲榜的人", xp: 0, totalXP: 0 }]).map((item) => (
                  <div key={`${item.rank}-${item.name}`} style={{ display: "grid", gridTemplateColumns: "34px 1fr auto", gap: 10, alignItems: "center", minHeight: 40 }}>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", color: rankColor(item.rank), fontSize: 13, fontWeight: 950 }}>#{item.rank}</span>
                    <LevelBadge compact name={item.name} xp={Number(item.totalXP || item.xp || 0)} />
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", color: "#3DA563", fontSize: 11, fontWeight: 900 }}>+{item.xp} XP</span>
                  </div>
                ))}
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
                      <button onClick={() => finishMission(mission.id)} disabled={!!user && (done || claiming === mission.id)} className={done ? "btn-outline" : "btn-primary"} style={{ fontSize: 11, padding: "6px 13px" }}>
                        {!user ? "登录领取" : claiming === mission.id ? "写入中..." : done ? "已领取" : "领取经验"}
                      </button>
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
          <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 950, marginBottom: 14 }}>升级有什么好处</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
            {LEVELS.map((item, index) => (
              <div key={item.level} style={{ border: `1px solid ${state.xp >= item.minXP ? item.color : "#242424"}`, borderRadius: 10, background: state.xp >= item.minXP ? `${item.color}12` : "rgba(0,0,0,0.24)", padding: "14px 15px" }}>
                <p style={{ color: state.xp >= item.minXP ? item.accent : "#aaa", fontSize: 13, fontWeight: 950, marginBottom: 6 }}>LV.{item.level} {item.name}</p>
                <p style={{ color: "#bbb", fontSize: 12, lineHeight: 1.75, marginBottom: 8 }}>{levelBenefits[index]}</p>
                <p style={{ fontFamily: "'JetBrains Mono',monospace", color: "#777", fontSize: 10 }}>{item.minXP} XP 解锁</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
