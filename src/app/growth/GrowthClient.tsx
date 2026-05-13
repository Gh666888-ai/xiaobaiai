"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, CalendarCheck, Compass, Flame, Medal, Sparkles, Target, TrendingUp } from "lucide-react"
import { NavBar } from "@/components/NavBar"
import { LevelBadge } from "@/components/LevelBadge"
import { XiaobaiMascot } from "@/components/XiaobaiMascot"
import { stages } from "@/data/learning-path"
import { progressId, readLearningProgress } from "@/lib/learning-progress"
import { useAuth } from "@/lib/AuthContext"
import { readAppAuth } from "@/lib/app-auth"
import { getNextLevel, getUserLevel, LEVELS } from "@/data/user"
import { CHECK_IN_XP, GROWTH_MISSIONS } from "@/data/growth"
import styles from "@/components/learning/SupportPage.module.css"

type GrowthState = {
  xp: number
  streak: number
  lastCheckIn: string
  doneMissions: Record<string, boolean>
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
  if (xp >= 1200) return { title: "高阶身份已点亮", subtitle: "名牌、边框和主页装饰会更醒目", color: "#256d85", mood: "complete" as const }
  if (xp >= 700) return { title: "装饰权益已开启", subtitle: "社区里会比普通用户更容易被看见", color: "#2f7d4d", mood: "recommend" as const }
  if (xp >= 360) return { title: "第一阶段奖励已到手", subtitle: "继续通关，下一档装饰会叠加", color: "#256d85", mood: "happy" as const }
  if (xp >= 120) return { title: "快到第一档奖励", subtitle: "继续做任务，先拿头像框体验", color: "#256d85", mood: "thinking" as const }
  return { title: "新手开局", subtitle: "今天目标：完成一个真实小任务", color: "#256d85", mood: "welcome" as const }
}

function CardStat({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className={styles.card} style={{ minHeight: 118, padding: 16 }}>
      <div className={styles.cardTop}>
        <span style={{ color: "#256d85" }}>{icon}</span>
        <span className={styles.tag}>{label}</span>
      </div>
      <h3 className={styles.cardTitle}>{value}</h3>
    </div>
  )
}

export default function GrowthClient() {
  const router = useRouter()
  const { user, loading, refresh } = useAuth()
  const [state, setState] = useState<GrowthState>({ xp: 0, streak: 0, lastCheckIn: "", doneMissions: {} })
  const [learnDone, setLearnDone] = useState(0)
  const [claiming, setClaiming] = useState("")
  const [notice, setNotice] = useState("")

  useEffect(() => {
    const growth = readGrowth(user?.userId)
    setState({ ...growth, xp: typeof user?.xp === "number" ? user.xp : growth.xp })
    const progress = readLearningProgress()
    setLearnDone(Object.values(progress).filter(Boolean).length)
  }, [user?.userId, user?.xp])

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
  const visibleMissions = missions.slice(0, 3)

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
      setState({ ...next, xp: Number(result.xp || Number(user.xp || 0) + awarded) })
      writeGrowth(next, user.userId)
      setNotice(awarded > 0 ? `今日打卡成功，${CHECK_IN_XP} XP 已进入你的账号等级。` : "今天已经打过卡，明天再来继续。")
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "打卡失败，请稍后再试。")
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
      setState({ ...next, xp: Number(result.xp || Number(user.xp || 0) + awarded) })
      writeGrowth(next, user.userId)
      setNotice(awarded > 0 ? `通关奖励到账：${awarded} XP。` : "这个奖励已经领过，换个任务继续。")
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "领取失败，请稍后再试。")
    } finally {
      setClaiming("")
    }
  }

  return (
    <div className={styles.page}>
      <NavBar />
      <main className={styles.main}>
        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>Growth Deck</p>
            <h1 className={styles.title}>每天只推进一个真实动作</h1>
            <p className={styles.subtitle}>
              成长舱负责记录学习、打卡、任务和等级。它不再单独堆任务，而是把你带回学习路线和项目实操里，完成后再回到这里看进度。
            </p>
            <div className={styles.actions}>
              <button onClick={checkIn} disabled={!!user && (checkedToday || claiming === "check-in")} className={styles.primaryButton} style={{ cursor: user && checkedToday ? "default" : "pointer" }}>
                <CalendarCheck size={16} /> {!user ? "登录后打卡" : claiming === "check-in" ? "写入中..." : checkedToday ? "今日已打卡" : `今日打卡 +${CHECK_IN_XP}XP`}
              </button>
              <Link href="/learn" className={styles.secondaryButton}>进入学习路线</Link>
              <Link href="/community" className={styles.ghostButton}>看社区复盘</Link>
            </div>
          </div>
          <aside className={styles.heroAside}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <XiaobaiMascot size={54} mood={badge.mood} />
              <div>
                <h2 className={styles.asideTitle}>{badge.title}</h2>
                <p className={styles.asideText}>{badge.subtitle}</p>
              </div>
            </div>
            <LevelBadge compact name={user?.name || "个人"} xp={state.xp} contributionPoints={contributionPoints} coCreatorApproved={user?.coCreatorApproved} />
          </aside>
        </section>

        {!loading && !user && (
          <section className={styles.panel} style={{ borderColor: "#f0d7a4", background: "#fffaf0" }}>
            <div className={styles.panelHead}>
              <div>
                <h2 className={styles.panelTitle}>登录后才能领取经验</h2>
                <p className={styles.panelDesc}>你可以先浏览学习路线和任务；打卡、等级和个人进度需要绑定账号。</p>
              </div>
              <Link href="/login?redirect=/growth" className={styles.primaryButton}>去登录</Link>
            </div>
          </section>
        )}

        {notice && (
          <section className={styles.details} style={{ borderColor: notice.includes("失败") ? "#f0b4ad" : "#cde0e6", background: notice.includes("失败") ? "#fff5f3" : "#f7fbfd", color: notice.includes("失败") ? "#9f3028" : "#256d85", fontWeight: 900 }}>
            {notice}
          </section>
        )}

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <h2 className={styles.panelTitle}>当前状态</h2>
              <p className={styles.panelDesc}>先看今天是否有推进，再看下一档奖励还差多少。</p>
            </div>
            <span className={styles.tag}><Sparkles size={14} /> {currentLevel.name}</span>
          </div>
          <div className={styles.grid}>
            <CardStat label="经验" value={`${displayXP} XP`} icon={<Flame size={18} />} />
            <CardStat label="连击" value={`${state.streak} 天`} icon={<CalendarCheck size={18} />} />
            <CardStat label="今日任务" value={`${doneCount}/${missions.length}`} icon={<Target size={18} />} />
            <CardStat label="学习章节" value={`${learnDone} 个`} icon={<Compass size={18} />} />
          </div>
          <div style={{ marginTop: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 8, color: "#17202a", fontSize: 14, fontWeight: 900 }}>
              <span>下一档进度</span>
              <span>{nextLevel ? `${displayXP}/${nextLevel.minXP}` : "已到最高档"}</span>
            </div>
            <div style={{ height: 10, borderRadius: 999, background: "#e7eef4", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${levelPercent}%`, borderRadius: 999, background: "linear-gradient(90deg,#256d85,#72b7c8)", transition: "width 0.3s" }} />
            </div>
            <p className={styles.panelDesc} style={{ marginTop: 10 }}>
              {nextLevel ? nextLevelInfo?.requiresContribution ? `还需要 ${nextLevelInfo.need} 贡献值解锁 ${nextLevel.name}。` : `还差 ${nextLevel.minXP - state.xp} XP 解锁 ${nextLevel.name}。` : "你已经点亮最高身份。"}
            </p>
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <h2 className={styles.panelTitle}>今天只做这几件</h2>
              <p className={styles.panelDesc}>任务不和教程混在一起。这里显示奖励入口，真正操作会回到对应学习页、聊天页或任务页。</p>
            </div>
            <Link href="/learn" className={styles.ghostButton}>回到开始学习</Link>
          </div>
          <div className={styles.grid}>
            {visibleMissions.map((mission) => {
              const done = !!state.doneMissions[missionDoneKey(mission, today)]
              return (
                <div key={mission.id} className={styles.card}>
                  <div className={styles.cardTop}>
                    <span className={styles.tag}>{mission.cadence === "once" ? "一次性" : "每日"}</span>
                    <span className={styles.tag}>+{mission.xp} XP</span>
                  </div>
                  <h3 className={styles.cardTitle}>{mission.title}</h3>
                  <p className={styles.cardText}>{mission.desc}</p>
                  {mission.claimMode === "action" ? (
                    <button onClick={() => finishMission(mission.id)} disabled={done || claiming === mission.id} className={done ? styles.secondaryButton : styles.primaryButton} style={{ marginTop: 14, cursor: done ? "default" : "pointer" }}>
                      {done ? "已完成" : claiming === mission.id ? "领取中..." : "领取任务奖励"}
                    </button>
                  ) : (
                    <Link href={mission.href} className={done ? styles.secondaryButton : styles.primaryButton} style={{ marginTop: 14 }}>
                      {done ? "已完成" : "去完成"} <ArrowRight size={14} />
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
          <details className={styles.details} style={{ marginTop: 16, marginBottom: 0 }}>
            <summary>展开全部成长任务</summary>
            <div className={styles.grid} style={{ paddingTop: 16 }}>
              {missions.slice(3).map((mission) => (
                <Link key={mission.id} href={mission.href} className={styles.card} style={{ minHeight: 150 }}>
                  <div className={styles.cardTop}>
                    <span className={styles.tag}>{mission.cadence === "once" ? "项目任务" : "每日任务"}</span>
                    <span className={styles.tag}>+{mission.xp} XP</span>
                  </div>
                  <h3 className={styles.cardTitle}>{mission.title}</h3>
                  <p className={styles.cardText}>{mission.desc}</p>
                </Link>
              ))}
            </div>
          </details>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <h2 className={styles.panelTitle}>下一步路线</h2>
              <p className={styles.panelDesc}>成长舱只给你一个继续方向，完整树状路线仍在开始学习页。</p>
            </div>
            <Link href="/learn" className={styles.primaryButton}>查看路线图</Link>
          </div>
          <div className={styles.grid}>
            <div className={styles.card}>
              <div className={styles.cardTop}>
                <Compass size={20} color="#256d85" />
                <span className={styles.tag}>建议继续</span>
              </div>
              <h3 className={styles.cardTitle}>{suggestedStage.title}</h3>
              <p className={styles.cardText}>{suggestedStage.subtitle}</p>
              <Link href="/learn" className={styles.cardLink}>进入学习页 <ArrowRight size={13} /></Link>
            </div>
            <div className={styles.card}>
              <div className={styles.cardTop}>
                <Medal size={20} color="#256d85" />
                <span className={styles.tag}>个人等级</span>
              </div>
              <h3 className={styles.cardTitle}>{currentLevel.name}</h3>
              <p className={styles.cardText}>{currentLevel.reward.vanity}</p>
              <p className={styles.muted} style={{ marginTop: 12, fontSize: 13, fontWeight: 800 }}>
                {nextLevel ? personalNeedsReview ? `下一档 ${nextLevel.name} 需要审核。` : nextLevelInfo?.requiresContribution ? `下一档还差 ${nextLevelInfo.need} 贡献值。` : `下一档还差 ${nextLevel.minXP - state.xp} XP。` : "已达最高档。"}
              </p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardTop}>
                <TrendingUp size={20} color="#256d85" />
                <span className={styles.tag}>团队等级</span>
              </div>
              <h3 className={styles.cardTitle}>{teamLevel.name}</h3>
              <p className={styles.cardText}>{teamLevel.reward.vanity}</p>
              <p className={styles.muted} style={{ marginTop: 12, fontSize: 13, fontWeight: 800 }}>
                {teamNextLevel ? teamNeedsReview ? `下一档 ${teamNextLevel.name} 需要审核。` : teamNextLevelInfo?.requiresContribution ? `下一档还差 ${teamNextLevelInfo.need} 贡献值。` : `下一档还差 ${teamNextLevel.minXP - state.xp} XP。` : "已达最高档。"}
              </p>
            </div>
          </div>
        </section>

      </main>
    </div>
  )
}
