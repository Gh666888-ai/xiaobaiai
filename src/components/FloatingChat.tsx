"use client"

import { useEffect, useRef, useState } from "react"
import type { PointerEvent as ReactPointerEvent } from "react"
import { usePathname, useRouter } from "next/navigation"
import { ArrowUp, ExternalLink, Loader2, Minus, UserRound, X } from "lucide-react"
import { useAuth } from "@/lib/AuthContext"
import { readAppAuth } from "@/lib/app-auth"
import { XiaobaiMascot } from "@/components/XiaobaiMascot"
import { missions } from "@/data/missions"
import {
  emptyMissionProgress,
  getStoredMission,
  MISSION_PROGRESS_KEY,
  readMissionProgress,
  selectMission,
  type MissionProgressState,
  writeMissionProgress,
} from "@/lib/mission-progress"
import { recommendMissionFromGoal } from "@/lib/mission-recommender"

type Message = {
  role: "user" | "assistant"
  content: string
  actionHref?: string
  actionLabel?: string
}

type LauncherMood = "welcome" | "thinking" | "recommend" | "sleeping" | "peeking"
type ChatMode = "ai" | "fallback" | "site" | ""
type FloatAnchor = {
  right: number
  bottom: number
}

const START_INDUSTRY_PROMPT_KEY = "xiaobaiai:start-industry-prompt:v1"
const START_INDUSTRY_PROMPT =
  "你已经登录了。先告诉我两件事：你做什么行业或岗位？最想用 AI 做成什么？我会给你排学习计划，从第 1 步带你做。"
const GOAL_ROUTER_PROMPT =
  "直接说一句：你做什么行业 + 想用 AI 做成什么。\n\n比如：我做电商，想用 AI 做客服和短视频。\n\n我收到后会给你一个任务入口，你点一下再进入，不会突然跳走。"
const HOME_AGENT_PROMPT_KEY = "xiaobaiai:home-agent-prompt:v1"
const HOME_GUEST_PROMPT =
  "先登录，然后我来制定接下来的一切。登录后我会先问你的行业和目标。"
const HOME_USER_PROMPT =
  "欢迎回来。告诉我你做什么行业、想用 AI 做成什么事，我来给你排下一步。"
const ONBOARDING_PROFILE_KEY = "xiaobaiai:onboarding-profile:v1"
const FLOAT_AGENT_ANCHOR_KEY = "xiaobaiai:floating-agent-anchor:v1"
const DEFAULT_FLOAT_ANCHOR: FloatAnchor = { right: 22, bottom: 22 }
const SHORT_GOAL_KEYWORDS = [
  "ai漫剧", "漫剧", "动漫", "动画", "漫画", "分镜", "短剧", "视频",
  "ppt", "资料", "文档", "合同", "客服", "知识库", "自动化", "日报",
  "网文", "小说", "编程", "网站", "网页", "小游戏", "游戏", "本地模型", "openclaw", "claude code",
]

function looksLikeGoalShortcut(message: string) {
  const text = message.toLowerCase().replace(/\s+/g, "")
  return SHORT_GOAL_KEYWORDS.some((keyword) => text.includes(keyword.toLowerCase().replace(/\s+/g, "")))
}

function compactAssistantReply(reply: string) {
  const cleaned = reply
    .replace(/```[\s\S]*?```/g, "")
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.replace(/^#{1,6}\s*/, "").replace(/^[-*]\s*/, "").trim())
    .filter(Boolean)
    .join("\n")

  if (cleaned.length <= 180 && cleaned.split("\n").length <= 4) return cleaned

  const firstLines = cleaned.split("\n").slice(0, 4).join("\n")
  const shortText = firstLines.length > 180 ? `${firstLines.slice(0, 176)}...` : firstLines
  return `${shortText}\n\n我先不展开长教程。你要继续的话，直接说“下一步”。`
}

function isSiteQuestion(message: string) {
  const text = message.toLowerCase()
  return [
    "你是谁",
    "你叫什么",
    "叫什么",
    "你是什么",
    "你是deepseek",
    "你是 deepseek",
    "你们网站",
    "这个网站",
    "小白ai",
    "小白 ai",
    "站内",
    "页面",
    "导航",
    "功能",
    "怎么用",
    "在哪里",
    "入口",
    "工具",
    "选择器",
    "学习",
    "教程",
    "模型",
    "价格",
    "资讯",
    "新闻",
    "社区",
    "投稿",
    "成长",
    "打卡",
    "登录",
  ].some((keyword) => text.includes(keyword))
}

function looksLikeIndustryGoal(message: string) {
  const text = message.toLowerCase()
  return text.length >= 6 && [
    "行业",
    "我是",
    "我做",
    "想用",
    "想做",
    "我要",
    "公司",
    "门店",
    "客户",
    "电商",
    "教育",
    "自媒体",
    "餐饮",
    "客服",
    "编程",
    "设计",
    "运营",
    "销售",
    "ai",
  ].some((keyword) => text.includes(keyword))
}

function missionKindLabel(missionId: string) {
  if (missionId === "n8n-ai-news-automation" || missionId === "dify-knowledge-base-bot") return "公司工作流"
  return "任务模板"
}

export function FloatingChat() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading } = useAuth()
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "你好呀，我是小白AI助手。你只管说想做什么，我来拆步骤、挑工具、指路线，小白雷达开机。",
    },
  ])
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [mode, setMode] = useState<ChatMode>("")
  const [remaining, setRemaining] = useState<number | null>(null)
  const [launcherMood, setLauncherMood] = useState<LauncherMood>("welcome")
  const [launcherHint, setLauncherHint] = useState("")
  const [missionProgress, setMissionProgress] = useState<MissionProgressState>(() => emptyMissionProgress())
  const [hasSavedMissionProgress, setHasSavedMissionProgress] = useState(false)
  const [floatAnchor, setFloatAnchor] = useState<FloatAnchor>(DEFAULT_FLOAT_ANCHOR)
  const [dragging, setDragging] = useState(false)
  const [walking, setWalking] = useState(false)
  const [burrowing, setBurrowing] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const launcherRef = useRef<HTMLButtonElement>(null)
  const patrolIndexRef = useRef(0)
  const walkingTimerRef = useRef<number | null>(null)
  const burrowTimerRef = useRef<number | null>(null)
  const suppressClickRef = useRef(false)
  const dragRef = useRef<{
    offsetX: number
    offsetY: number
    width: number
    height: number
    startX: number
    startY: number
    moved: boolean
  } | null>(null)

  const hideOnFullChat = pathname === "/chat" || pathname === "/login"

  useEffect(() => {
    const openChat = () => {
      setOpen(true)
      setMinimized(false)
      setHasSavedMissionProgress(Boolean(window.localStorage.getItem(MISSION_PROGRESS_KEY)))
      setMissionProgress(readMissionProgress())
    }
    const openGoalRouter = () => {
      openChat()
      setInput("")
      setMessages((prev) => (
        prev.some((message) => message.content === GOAL_ROUTER_PROMPT)
          ? prev
          : [...prev, { role: "assistant", content: GOAL_ROUTER_PROMPT }]
      ))
      setSpeaking(true)
      window.setTimeout(() => setSpeaking(false), 1800)
      window.setTimeout(() => inputRef.current?.focus(), 180)
    }
    window.addEventListener("xiaobai:open-chat", openChat)
    window.addEventListener("xiaobai:open-goal-router", openGoalRouter)
    return () => {
      window.removeEventListener("xiaobai:open-chat", openChat)
      window.removeEventListener("xiaobai:open-goal-router", openGoalRouter)
    }
  }, [])

  useEffect(() => {
    const saved = window.localStorage.getItem(FLOAT_AGENT_ANCHOR_KEY)
    if (!saved) return
    try {
      const parsed = JSON.parse(saved) as Partial<FloatAnchor>
      if (typeof parsed.right === "number" && typeof parsed.bottom === "number") {
        setFloatAnchor(clampFloatAnchor({ right: parsed.right, bottom: parsed.bottom }))
      }
    } catch {
      window.localStorage.removeItem(FLOAT_AGENT_ANCHOR_KEY)
    }
  }, [])

  useEffect(() => {
    const keepInView = () => setFloatAnchor((anchor) => clampFloatAnchor(anchor, getLauncherSize(launcherRef.current)))
    window.addEventListener("resize", keepInView)
    return () => window.removeEventListener("resize", keepInView)
  }, [])

  useEffect(() => {
    setHasSavedMissionProgress(Boolean(window.localStorage.getItem(MISSION_PROGRESS_KEY)))
    setMissionProgress(readMissionProgress())
  }, [pathname, open])

  useEffect(() => {
    if (loading || !user || pathname !== "/start") return
    if (window.sessionStorage.getItem(START_INDUSTRY_PROMPT_KEY)) return

    window.sessionStorage.setItem(START_INDUSTRY_PROMPT_KEY, "1")
    setOpen(true)
    setMinimized(false)
    setHasSavedMissionProgress(Boolean(window.localStorage.getItem(MISSION_PROGRESS_KEY)))
    setMissionProgress(readMissionProgress())
    setMessages((prev) => (
      prev.some((message) => message.content === START_INDUSTRY_PROMPT)
        ? prev
        : [...prev, { role: "assistant", content: START_INDUSTRY_PROMPT }]
    ))
    setSpeaking(true)

    const speakingTimer = window.setTimeout(() => setSpeaking(false), 2200)
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 240)
    return () => {
      window.clearTimeout(speakingTimer)
      window.clearTimeout(focusTimer)
    }
  }, [loading, pathname, user])

  useEffect(() => {
    if (loading || pathname !== "/") return
    if (window.sessionStorage.getItem(HOME_AGENT_PROMPT_KEY)) return

    window.sessionStorage.setItem(HOME_AGENT_PROMPT_KEY, "1")
    const savedProfile = window.localStorage.getItem(ONBOARDING_PROFILE_KEY)
    const content = user
      ? savedProfile
        ? `我记得你上次说的方向：${savedProfile.slice(0, 80)}。\n\n如果方向没变，我可以继续带你做下一步；如果变了，直接告诉我新的行业和目标。`
        : HOME_USER_PROMPT
      : HOME_GUEST_PROMPT

    const timer = window.setTimeout(() => {
      setMessages((prev) => {
        if (prev.some((message) => message.content === content)) return prev
        if (prev.length === 1 && prev[0].role === "assistant") return [{ role: "assistant", content }]
        return [...prev, { role: "assistant", content }]
      })
      setLauncherHint(content.replace(/\n+/g, " ").slice(0, 44))
      setSpeaking(true)
      window.setTimeout(() => setSpeaking(false), 2200)
    }, 850)

    return () => window.clearTimeout(timer)
  }, [loading, pathname, user])

  useEffect(() => {
    if (open && !minimized) bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, sending, open, minimized])

  useEffect(() => {
    if (open && !minimized) return
    const moods: LauncherMood[] = ["welcome", "peeking", "thinking", "sleeping", "welcome", "recommend"]
    let index = 0
    const timer = window.setInterval(() => {
      index = (index + 1) % moods.length
      setLauncherMood(moods[index])
    }, 4200)
    return () => window.clearInterval(timer)
  }, [open, minimized])

  useEffect(() => {
    if ((open && !minimized) || dragging) return
    if (window.localStorage.getItem(FLOAT_AGENT_ANCHOR_KEY)) return

    const timer = window.setInterval(() => {
      const points = getPatrolAnchors(getLauncherSize(launcherRef.current))
      patrolIndexRef.current = (patrolIndexRef.current + 1) % points.length
      const nextPoint = clampFloatAnchor(points[patrolIndexRef.current], getLauncherSize(launcherRef.current))
      const shouldBurrow = patrolIndexRef.current === 1 || patrolIndexRef.current === 3
      if (shouldBurrow) {
        startBurrow(nextPoint)
      } else {
        startWalking()
        setFloatAnchor(nextPoint)
      }
    }, 9200)
    return () => window.clearInterval(timer)
  }, [dragging, minimized, open])

  useEffect(() => () => {
    if (walkingTimerRef.current) window.clearTimeout(walkingTimerRef.current)
    if (burrowTimerRef.current) window.clearTimeout(burrowTimerRef.current)
  }, [])

  function startWalking(duration = 1150) {
    setWalking(true)
    if (walkingTimerRef.current) window.clearTimeout(walkingTimerRef.current)
    walkingTimerRef.current = window.setTimeout(() => {
      setWalking(false)
      walkingTimerRef.current = null
    }, duration)
  }

  function startBurrow(nextPoint: FloatAnchor) {
    setWalking(false)
    setBurrowing(true)
    setLauncherMood("thinking")
    if (burrowTimerRef.current) window.clearTimeout(burrowTimerRef.current)
    window.setTimeout(() => setFloatAnchor(nextPoint), 260)
    burrowTimerRef.current = window.setTimeout(() => {
      setBurrowing(false)
      burrowTimerRef.current = null
      setLauncherMood("peeking")
    }, 1280)
  }

  function handleLauncherPointerDown(event: ReactPointerEvent<HTMLButtonElement>) {
    if (event.button !== 0) return
    const rect = event.currentTarget.getBoundingClientRect()
    dragRef.current = {
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      width: rect.width,
      height: rect.height,
      startX: event.clientX,
      startY: event.clientY,
      moved: false,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function handleLauncherPointerMove(event: ReactPointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current
    if (!drag) return
    const movedEnough = Math.abs(event.clientX - drag.startX) + Math.abs(event.clientY - drag.startY) > 6
    if (movedEnough) {
      drag.moved = true
      suppressClickRef.current = true
      setDragging(true)
      setWalking(false)
      setBurrowing(false)
    }
    if (!drag.moved) return

    const left = event.clientX - drag.offsetX
    const top = event.clientY - drag.offsetY
    const next = {
      right: window.innerWidth - left - drag.width,
      bottom: window.innerHeight - top - drag.height,
    }
    setFloatAnchor(clampFloatAnchor(next, { width: drag.width, height: drag.height }))
  }

  function finishLauncherDrag(event: ReactPointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current
    if (!drag) return
    if (drag.moved) {
      const next = clampFloatAnchor(floatAnchor, { width: drag.width, height: drag.height })
      setFloatAnchor(next)
      window.localStorage.setItem(FLOAT_AGENT_ANCHOR_KEY, JSON.stringify(next))
    }
    dragRef.current = null
    setDragging(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  function openFloatingChat() {
    if (suppressClickRef.current) {
      suppressClickRef.current = false
      return
    }
    setHasSavedMissionProgress(Boolean(window.localStorage.getItem(MISSION_PROGRESS_KEY)))
    setMissionProgress(readMissionProgress())
    setOpen(true)
    setMinimized(false)
    setLauncherHint("")
  }

  async function assignMissionFromGoal(goal: string) {
    const mission = recommendMissionFromGoal(goal)
    const nextProgress = selectMission(readMissionProgress(), mission.id)
    writeMissionProgress(nextProgress)
    setMissionProgress(nextProgress)
    setHasSavedMissionProgress(true)
    window.localStorage.setItem(ONBOARDING_PROFILE_KEY, goal.slice(0, 240))

    const token = readAppAuth()?.session?.access_token
    if (user && token) {
      fetch("/api/mission-progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ progress: nextProgress }),
      }).catch(() => undefined)
    }

    return mission
  }

  async function send(text = input) {
    const value = text.trim()
    if (!value || sending) return
    if (!user && !isSiteQuestion(value)) {
      setOpen(true)
      setMinimized(false)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "这个要先登录。点页面右上角登录/注册，回来告诉我行业和目标，我会记住进度，并给你安排下一步。",
        },
      ])
      setSpeaking(true)
      window.setTimeout(() => setSpeaking(false), 1800)
      return
    }
    const nextMessages: Message[] = [...messages, { role: "user", content: value }]
    setMessages(nextMessages)
    setInput("")
    setSending(true)
    setSpeaking(false)
    if (user && (looksLikeIndustryGoal(value) || looksLikeGoalShortcut(value))) {
      const mission = await assignMissionFromGoal(value)
      const kindLabel = missionKindLabel(mission.id)
      setMode("site")
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `收到，我给你匹配到「${mission.shortTitle}」${kindLabel}。\n\n第一步只做这个：${mission.steps[0]?.action || "先打开任务页开始。"}\n\n我已经记住这个进度。任务地址：/missions/${mission.id}\n\n你想开始时，点下面入口进入任务页。`,
          actionHref: `/missions/${mission.id}`,
          actionLabel: `打开「${mission.shortTitle}」`,
        },
      ])
      setSpeaking(true)
      window.setTimeout(() => setSpeaking(false), 1800)
      setSending(false)
      return
    }
    try {
      const token = readAppAuth()?.session?.access_token
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          message: value,
          messages: nextMessages.slice(-8).map((item) => ({ role: item.role, content: item.content })),
        }),
      })
      const data = await res.json()
      setMode(data.mode || "")
      setRemaining(typeof data.remaining === "number" ? data.remaining : null)
      setMessages((prev) => [...prev, { role: "assistant", content: compactAssistantReply(data.reply || "我刚才没拿到有效回复，你可以换个问法再试一次。") }])
      setSpeaking(true)
      window.setTimeout(() => setSpeaking(false), 1800)
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "请求失败了。你可以稍后再试，或者先去工具选择器完成推荐。" }])
    } finally {
      setSending(false)
    }
  }

  if (hideOnFullChat) return null

  const activeMission = missions.find((mission) => mission.id === missionProgress.activeMissionId) || missions[0]
  const activeProgress = getStoredMission(missionProgress, activeMission.id)
  const doneSteps = activeMission.steps.filter((_, index) => activeProgress.completedSteps[index]).length
  const hasProgress = hasSavedMissionProgress && (doneSteps > 0 || activeProgress.currentStep > 0 || missionProgress.activeMissionId !== missions[0].id)
  const progressDots = hasProgress ? activeMission.steps.slice(0, 6) : []
  const launcherSize = getLauncherSize(launcherRef.current)
  const panelPosition = getPanelPosition(floatAnchor, launcherSize)
  const liveMood: LauncherMood = walking || dragging || burrowing ? "thinking" : open ? "welcome" : launcherMood

  return (
    <div className={`xiaobai-float ${dragging ? "is-dragging" : ""} ${burrowing ? "is-burrowing" : ""}`} style={{ right: floatAnchor.right, bottom: floatAnchor.bottom }}>
      {open && !minimized && (
        <section className="xiaobai-panel" style={panelPosition} aria-label="小白AI浮动问答">
          <header className="xiaobai-panel-head">
            <div className="xiaobai-head-left">
              <XiaobaiMascot size={48} mood={sending ? "thinking" : user ? "happy" : "welcome"} />
              <div>
                <p className="xiaobai-title">小白AI助手</p>
                <p className="xiaobai-subtitle">{mode === "ai" ? "智能探索中" : mode === "site" ? "站内速答" : mode === "fallback" ? "灵感缓存模式" : user ? "当前页面陪跑" : "站内速答待命"}</p>
              </div>
            </div>
            <div className="xiaobai-head-actions">
              <button type="button" aria-label="最小化小白AI" onClick={() => setMinimized(true)} className="xiaobai-icon-btn">
                <Minus size={15} />
              </button>
              <button type="button" aria-label="关闭小白AI" onClick={() => setOpen(false)} className="xiaobai-icon-btn">
                <X size={15} />
              </button>
            </div>
          </header>

          <>
            <div className="xiaobai-messages">
                {messages.map((message, index) => {
                  const isUser = message.role === "user"
                  const isLastAssistant = !isUser && index === messages.length - 1
                  return (
                    <div key={`${message.role}-${index}`} className={`xiaobai-message ${isUser ? "is-user" : ""}`}>
                      {isUser ? (
                        <span className="xiaobai-user-avatar">
                          <UserRound size={15} />
                        </span>
                      ) : (
                        <XiaobaiMascot size={30} mood={isLastAssistant && speaking ? "talking" : "idle"} />
                      )}
                      <div className="xiaobai-bubble">
                        <span>{message.content}</span>
                        {message.actionHref && (
                          <button type="button" className="xiaobai-action-link" onClick={() => router.push(message.actionHref || "/missions")}>
                            {message.actionLabel || "打开任务"}
                            <ExternalLink size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}

                {sending && (
                  <div className="xiaobai-loading">
                    <Loader2 size={15} />
                    小白AI 正在整理答案...
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

            {remaining !== null && <p className="xiaobai-quota">智能探索模式：今日剩余 {remaining} 次</p>}

            <div className="xiaobai-input-row">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault()
                    send()
                  }
                }}
                disabled={loading}
                rows={2}
                placeholder={user ? "说你的行业：比如电商，想用 AI 做客服和短视频" : "注册后可按行业定制推荐"}
              />
              <button type="button" onClick={() => send()} disabled={sending || !input.trim() || loading} aria-label="发送给小白AI">
                <ArrowUp size={18} />
              </button>
            </div>
          </>
        </section>
      )}

      <button
        ref={launcherRef}
        type="button"
        className={`xiaobai-launcher ${open && !minimized ? "is-open" : ""} ${hasProgress ? "has-progress" : ""} ${walking ? "is-walking" : ""} ${burrowing ? "is-burrowing" : ""} is-${liveMood}`}
        onPointerDown={handleLauncherPointerDown}
        onPointerMove={handleLauncherPointerMove}
        onPointerUp={finishLauncherDrag}
        onPointerCancel={finishLauncherDrag}
        onClick={openFloatingChat}
        aria-label={hasProgress ? `拖动或点击小白AI，当前任务完成 ${doneSteps}/${activeMission.steps.length}` : "拖动或点击小白AI"}
      >
        {launcherHint && (!open || minimized) && (
          <span className="xiaobai-launcher-speech">
            {launcherHint}
          </span>
        )}
        <span className="xiaobai-scan-ring" />
        <span className="xiaobai-scan-ring is-second" />
        <span className="xiaobai-bagua" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
        <span className="xiaobai-burrow-flash" aria-hidden="true" />
        <span className="xiaobai-peek-curtain" aria-hidden="true" />
        <span className="xiaobai-orbit" aria-hidden="true">
          <i />
        </span>
        <span className="xiaobai-body">
          <XiaobaiMascot size={86} mood={open ? "happy" : liveMood} />
        </span>
        <span className="xiaobai-hand-seals" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
        </span>
        <span className="xiaobai-footsteps" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        {hasProgress ? (
          <span className="xiaobai-progress-dots" aria-hidden="true">
            {progressDots.map((_, index) => (
              <i key={index} className={index < doneSteps ? "is-done" : ""} />
            ))}
          </span>
        ) : (
          <span className={`xiaobai-status-dot ${user ? "is-ready" : ""}`} aria-hidden="true" />
        )}
        <span className="xiaobai-shadow" aria-hidden="true" />
      </button>

      <style>{`
        .xiaobai-float {
          position: fixed;
          z-index: 120;
          font-family: 'Noto Sans SC', sans-serif;
          transition: right 0.7s ease, bottom 0.7s ease;
          touch-action: none;
        }
        .xiaobai-float.is-dragging {
          transition: none;
        }
        .xiaobai-float.is-burrowing {
          transition: right 0.36s cubic-bezier(.16,1,.3,1), bottom 0.36s cubic-bezier(.16,1,.3,1);
        }
        .xiaobai-panel {
          position: fixed;
          width: min(420px, calc(100vw - 28px));
          height: min(680px, calc(100vh - 110px));
          border: 1px solid #2a1f10;
          border-radius: 18px;
          background: rgba(5,5,5,0.96);
          box-shadow: 0 28px 110px rgba(0,0,0,0.72), 0 0 0 1px rgba(201,168,76,0.08);
          backdrop-filter: blur(18px);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          z-index: 130;
        }
        .xiaobai-panel-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 14px 14px 12px;
          border-bottom: 1px solid #1a1a1a;
          background: rgba(201,168,76,0.045);
        }
        .xiaobai-head-left {
          display: flex;
          align-items: center;
          gap: 11px;
        }
        .xiaobai-title {
          color: #fff;
          font-size: 15px;
          font-weight: 950;
          margin: 0;
        }
        .xiaobai-subtitle {
          color: #9a9a9a;
          font-size: 11px;
          margin: 2px 0 0;
        }
        .xiaobai-head-actions {
          display: flex;
          gap: 6px;
        }
        .xiaobai-icon-btn {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          border: 1px solid #2a2a2a;
          background: rgba(255,255,255,0.035);
          color: #bbb;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .xiaobai-messages {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .xiaobai-message {
          display: flex;
          gap: 9px;
          align-items: flex-start;
        }
        .xiaobai-message.is-user {
          flex-direction: row-reverse;
        }
        .xiaobai-user-avatar {
          width: 30px;
          height: 30px;
          border-radius: 9px;
          border: 1px solid #7a6230;
          background: rgba(201,168,76,0.12);
          color: #e8c96a;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .xiaobai-bubble {
          max-width: 78%;
          border: 1px solid #1a1a1a;
          border-radius: 12px;
          background: rgba(255,255,255,0.045);
          color: #e8e8e8;
          font-size: 13px;
          line-height: 1.75;
          padding: 10px 12px;
          white-space: pre-line;
          word-break: break-word;
        }
        .xiaobai-action-link {
          width: 100%;
          margin-top: 9px;
          border: 1px solid rgba(232,201,106,0.36);
          border-radius: 10px;
          background: rgba(232,201,106,0.12);
          color: #f3d978;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 10px;
          font-family: inherit;
          font-size: 12px;
          font-weight: 950;
          cursor: pointer;
        }
        .xiaobai-message.is-user .xiaobai-bubble {
          border-color: rgba(201,168,76,0.25);
          background: rgba(201,168,76,0.1);
        }
        .xiaobai-loading {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #888;
          font-size: 12px;
        }
        .xiaobai-loading svg {
          animation: xiaobaiSpin 1s linear infinite;
        }
        .xiaobai-quota {
          margin: 0 14px 9px;
          color: #d6c28a;
          font-size: 11px;
        }
        .xiaobai-input-row {
          display: flex;
          align-items: flex-end;
          gap: 9px;
          border-top: 1px solid #1a1a1a;
          background: #080808;
          padding: 12px;
        }
        .xiaobai-input-row textarea {
          flex: 1;
          resize: none;
          min-height: 44px;
          max-height: 120px;
          border: 1px solid #242424;
          border-radius: 12px;
          outline: none;
          background: rgba(255,255,255,0.045);
          color: #fff;
          font-size: 13px;
          line-height: 1.55;
          padding: 10px 12px;
          font-family: inherit;
        }
        .xiaobai-input-row button {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          border: 1px solid #7a6230;
          background: rgba(201,168,76,0.14);
          color: #e8c96a;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .xiaobai-input-row button:disabled {
          opacity: 0.45;
          cursor: default;
        }
        .xiaobai-launcher {
          width: 112px;
          height: 124px;
          border: 0;
          border-radius: 999px;
          background: transparent;
          color: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          cursor: grab;
          user-select: none;
          margin-left: auto;
          touch-action: none;
          position: relative;
          overflow: visible;
          filter: drop-shadow(0 20px 28px rgba(0,0,0,0.55));
        }
        .xiaobai-float.is-dragging .xiaobai-launcher {
          cursor: grabbing;
        }
        .xiaobai-launcher.is-open {
          filter: drop-shadow(0 22px 34px rgba(201,168,76,0.22));
        }
        .xiaobai-launcher-speech {
          position: absolute;
          right: 88px;
          bottom: 70px;
          z-index: 8;
          width: min(220px, calc(100vw - 150px));
          border: 1px solid rgba(201,168,76,0.34);
          border-radius: 14px 14px 4px 14px;
          background: rgba(5,5,5,0.92);
          color: #f3e7ba;
          box-shadow: 0 16px 38px rgba(0,0,0,0.44), 0 0 28px rgba(126,231,255,0.08);
          backdrop-filter: blur(12px);
          padding: 10px 12px;
          font-size: 12px;
          font-weight: 850;
          line-height: 1.55;
          text-align: left;
          pointer-events: none;
          animation: xiaobaiSpeechFloat 3.6s ease-in-out infinite;
        }
        .xiaobai-launcher-speech::after {
          content: "";
          position: absolute;
          right: -7px;
          bottom: 13px;
          width: 12px;
          height: 12px;
          border-right: 1px solid rgba(201,168,76,0.34);
          border-bottom: 1px solid rgba(201,168,76,0.34);
          background: rgba(5,5,5,0.92);
          transform: rotate(-45deg);
        }
        .xiaobai-body {
          position: relative;
          z-index: 4;
          display: inline-flex;
          animation: xiaobaiFloatBody 3.4s ease-in-out infinite;
          transform-origin: 50% 92%;
        }
        .xiaobai-float.is-dragging .xiaobai-body {
          animation: none;
          transform: scale(1.04) rotate(-2deg);
        }
        .xiaobai-launcher.is-walking .xiaobai-body {
          animation: xiaobaiWalkBody 0.46s ease-in-out infinite;
        }
        .xiaobai-launcher.is-burrowing .xiaobai-body {
          animation: xiaobaiBurrowBody 1.24s cubic-bezier(.16,1,.3,1) both;
        }
        .xiaobai-launcher.is-sleeping .xiaobai-body {
          animation: xiaobaiDozeBody 3.2s ease-in-out infinite;
        }
        .xiaobai-launcher.is-peeking .xiaobai-body {
          animation: xiaobaiSneakPeek 2.8s ease-in-out infinite;
        }
        .xiaobai-scan-ring {
          position: absolute;
          z-index: 1;
          width: 88px;
          height: 88px;
          border: 1px solid rgba(126,231,255,0.34);
          border-radius: 50%;
          opacity: 0;
          animation: xiaobaiScan 3.2s ease-out infinite;
        }
        .xiaobai-scan-ring.is-second {
          border-color: rgba(232,201,106,0.3);
          animation-delay: 1.45s;
        }
        .xiaobai-launcher.is-burrowing .xiaobai-scan-ring {
          opacity: 0;
          animation-play-state: paused;
        }
        .xiaobai-bagua {
          position: absolute;
          z-index: 2;
          left: 50%;
          bottom: 4px;
          width: 92px;
          height: 92px;
          border-radius: 50%;
          border: 1px solid rgba(232,201,106,0.48);
          transform: translateX(-50%) scale(0.42) rotate(0deg);
          opacity: 0;
          box-shadow: inset 0 0 24px rgba(232,201,106,0.08), 0 0 34px rgba(126,231,255,0.16);
          pointer-events: none;
        }
        .xiaobai-bagua::before,
        .xiaobai-bagua::after {
          content: "";
          position: absolute;
          inset: 13px;
          border-radius: 50%;
          border: 1px dashed rgba(126,231,255,0.42);
        }
        .xiaobai-bagua::after {
          inset: 30px;
          border-style: solid;
          border-color: rgba(232,201,106,0.42);
        }
        .xiaobai-bagua i {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 40px;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(232,201,106,0.9), transparent);
          transform-origin: 0 50%;
        }
        .xiaobai-bagua i:nth-child(1) { transform: rotate(0deg) translateX(-50%); }
        .xiaobai-bagua i:nth-child(2) { transform: rotate(45deg) translateX(-50%); }
        .xiaobai-bagua i:nth-child(3) { transform: rotate(90deg) translateX(-50%); }
        .xiaobai-bagua i:nth-child(4) { transform: rotate(135deg) translateX(-50%); }
        .xiaobai-launcher.is-burrowing .xiaobai-bagua {
          animation: xiaobaiBagua 1.24s ease-in-out both;
        }
        .xiaobai-burrow-flash {
          position: absolute;
          z-index: 3;
          left: 50%;
          bottom: 24px;
          width: 15px;
          height: 106px;
          border-radius: 999px;
          background: linear-gradient(180deg, transparent, rgba(126,231,255,0.9), rgba(232,201,106,0.78), transparent);
          filter: blur(2px);
          transform: translateX(-50%) scaleY(0.25);
          opacity: 0;
          pointer-events: none;
        }
        .xiaobai-launcher.is-burrowing .xiaobai-burrow-flash {
          animation: xiaobaiBurrowFlash 1.24s ease-in-out both;
        }
        .xiaobai-hand-seals {
          position: absolute;
          z-index: 6;
          left: 50%;
          bottom: 34px;
          width: 58px;
          height: 38px;
          transform: translateX(-50%);
          opacity: 0;
          pointer-events: none;
          filter: drop-shadow(0 0 10px rgba(232,201,106,0.52));
        }
        .xiaobai-hand-seals i {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 25px;
          height: 9px;
          border-radius: 999px 999px 7px 7px;
          background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(178,245,255,0.9));
          border: 1px solid rgba(126,231,255,0.76);
          box-shadow: inset 0 -2px 4px rgba(0,0,0,0.12);
          transform-origin: 50% 50%;
        }
        .xiaobai-hand-seals i:nth-child(1) { transform: translate(-96%, -52%) rotate(31deg); }
        .xiaobai-hand-seals i:nth-child(2) { transform: translate(-8%, -52%) rotate(-31deg); }
        .xiaobai-hand-seals i:nth-child(3) { width: 20px; transform: translate(-72%, -5%) rotate(-18deg); }
        .xiaobai-hand-seals i:nth-child(4) { width: 20px; transform: translate(-28%, -5%) rotate(18deg); }
        .xiaobai-hand-seals i:nth-child(5) { width: 16px; transform: translate(-86%, 38%) rotate(18deg); opacity: 0.86; }
        .xiaobai-hand-seals i:nth-child(6) { width: 16px; transform: translate(-16%, 38%) rotate(-18deg); opacity: 0.86; }
        .xiaobai-launcher.is-burrowing .xiaobai-hand-seals {
          opacity: 1;
          animation: xiaobaiSealBurst 0.18s steps(2, end) 0s 5, xiaobaiSealVanish 1.24s ease-in-out both;
        }
        .xiaobai-launcher.is-burrowing .xiaobai-hand-seals::before,
        .xiaobai-launcher.is-burrowing .xiaobai-hand-seals::after {
          content: "";
          position: absolute;
          inset: -8px;
          border-radius: 50%;
          border: 1px solid rgba(232,201,106,0.34);
          transform: scale(0.68);
          opacity: 0;
          animation: xiaobaiSealRing 0.32s ease-out 3;
        }
        .xiaobai-launcher.is-burrowing .xiaobai-hand-seals::after {
          animation-delay: 0.08s;
          border-color: rgba(126,231,255,0.38);
        }
        .xiaobai-launcher.is-sleeping .xiaobai-scan-ring,
        .xiaobai-launcher.is-sleeping .xiaobai-orbit,
        .xiaobai-launcher.is-peeking .xiaobai-orbit,
        .xiaobai-launcher.is-burrowing .xiaobai-orbit {
          opacity: 0;
          animation-play-state: paused;
        }
        .xiaobai-peek-curtain {
          position: absolute;
          z-index: 3;
          right: -8px;
          top: 14px;
          width: 30px;
          height: 82px;
          border-radius: 16px 0 0 16px;
          background: linear-gradient(90deg, rgba(5,5,5,0.92), rgba(5,5,5,0.35), transparent);
          border-left: 1px solid rgba(126,231,255,0.2);
          opacity: 0;
          transform: translateX(18px);
          pointer-events: none;
        }
        .xiaobai-launcher.is-peeking .xiaobai-peek-curtain {
          opacity: 1;
          animation: xiaobaiCurtainPeek 2.8s ease-in-out infinite;
        }
        .xiaobai-orbit {
          position: absolute;
          z-index: 2;
          width: 104px;
          height: 104px;
          border-radius: 50%;
          animation: xiaobaiOrbit 4.8s linear infinite;
        }
        .xiaobai-orbit i {
          position: absolute;
          top: 8px;
          left: 50%;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #7ee7ff;
          box-shadow: 0 0 16px rgba(126,231,255,0.9);
        }
        .xiaobai-progress-dots {
          position: absolute;
          z-index: 5;
          bottom: 17px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 4px;
          padding: 4px 6px;
          border-radius: 999px;
          background: rgba(0,0,0,0.5);
          box-shadow: 0 0 18px rgba(0,0,0,0.36);
        }
        .xiaobai-progress-dots i {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(255,255,255,0.28);
        }
        .xiaobai-progress-dots i.is-done {
          background: #e8c96a;
          box-shadow: 0 0 10px rgba(232,201,106,0.85);
        }
        .xiaobai-status-dot {
          position: absolute;
          z-index: 5;
          right: 22px;
          top: 22px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #e8c96a;
          box-shadow: 0 0 0 5px rgba(232,201,106,0.14), 0 0 20px rgba(232,201,106,0.7);
          animation: xiaobaiBlink 1.8s ease-in-out infinite;
        }
        .xiaobai-status-dot.is-ready {
          background: #7ee7ff;
          box-shadow: 0 0 0 5px rgba(126,231,255,0.15), 0 0 20px rgba(126,231,255,0.75);
        }
        .xiaobai-shadow {
          position: absolute;
          z-index: 0;
          left: 50%;
          bottom: 9px;
          width: 72px;
          height: 14px;
          transform: translateX(-50%);
          border-radius: 50%;
          background: radial-gradient(ellipse, rgba(126,231,255,0.22), rgba(201,168,76,0.08) 48%, transparent 72%);
          animation: xiaobaiShadow 3.4s ease-in-out infinite;
        }
        .xiaobai-launcher.is-walking .xiaobai-shadow {
          animation: xiaobaiWalkShadow 0.46s ease-in-out infinite;
        }
        .xiaobai-launcher.is-burrowing .xiaobai-shadow {
          animation: xiaobaiBurrowShadow 1.24s ease-in-out both;
        }
        .xiaobai-footsteps {
          position: absolute;
          z-index: 3;
          left: 50%;
          bottom: 15px;
          width: 88px;
          height: 30px;
          transform: translateX(-50%);
          pointer-events: none;
          opacity: 0;
        }
        .xiaobai-launcher.is-walking .xiaobai-footsteps {
          opacity: 1;
        }
        .xiaobai-footsteps i {
          position: absolute;
          bottom: 5px;
          width: 9px;
          height: 4px;
          border-radius: 50%;
          background: rgba(126,231,255,0.48);
          box-shadow: 0 0 14px rgba(126,231,255,0.56);
          opacity: 0;
          animation: xiaobaiStepMark 0.92s ease-out infinite;
        }
        .xiaobai-footsteps i:nth-child(1) {
          left: 24px;
          transform: rotate(-12deg);
        }
        .xiaobai-footsteps i:nth-child(2) {
          left: 43px;
          animation-delay: 0.22s;
          transform: rotate(12deg);
        }
        .xiaobai-footsteps i:nth-child(3) {
          left: 60px;
          animation-delay: 0.44s;
          transform: rotate(-10deg);
        }
        @keyframes xiaobaiSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes xiaobaiFloatBody {
          0%, 100% { transform: translateY(0) rotate(-1deg); }
          45% { transform: translateY(-9px) rotate(2deg); }
          70% { transform: translateY(-4px) rotate(-2deg); }
        }
        @keyframes xiaobaiWalkBody {
          0%, 100% { transform: translate(-4px, -1px) rotate(-5deg) scaleX(0.98); }
          25% { transform: translate(0, -9px) rotate(0deg) scaleX(1.02); }
          50% { transform: translate(4px, -1px) rotate(5deg) scaleX(0.98); }
          75% { transform: translate(0, -8px) rotate(0deg) scaleX(1.02); }
        }
        @keyframes xiaobaiBurrowBody {
          0% { transform: translateY(0) scale(1) rotate(-1deg); opacity: 1; filter: blur(0); }
          22% { transform: translateY(28px) scale(0.42) rotate(-18deg); opacity: 0.25; filter: blur(1px); }
          36% { transform: translateY(34px) scale(0.18) rotate(-28deg); opacity: 0; filter: blur(3px); }
          58% { transform: translateY(-34px) scale(0.18) rotate(22deg); opacity: 0; filter: blur(3px); }
          78% { transform: translateY(-9px) scale(1.16) rotate(8deg); opacity: 1; filter: blur(0); }
          100% { transform: translateY(0) scale(1) rotate(-1deg); opacity: 1; filter: blur(0); }
        }
        @keyframes xiaobaiBagua {
          0% { transform: translateX(-50%) scale(0.26) rotate(0deg); opacity: 0; }
          18% { transform: translateX(-50%) scale(1.04) rotate(90deg); opacity: 0.95; }
          52% { transform: translateX(-50%) scale(0.72) rotate(270deg); opacity: 0.72; }
          78% { transform: translateX(-50%) scale(1.16) rotate(430deg); opacity: 0.9; }
          100% { transform: translateX(-50%) scale(1.45) rotate(560deg); opacity: 0; }
        }
        @keyframes xiaobaiBurrowFlash {
          0%, 18% { transform: translateX(-50%) scaleY(0.1); opacity: 0; }
          32% { transform: translateX(-50%) scaleY(1); opacity: 0.88; }
          55% { transform: translateX(-50%) scaleY(0.35); opacity: 0.12; }
          70% { transform: translateX(-50%) scaleY(1.14); opacity: 0.95; }
          100% { transform: translateX(-50%) scaleY(0.2); opacity: 0; }
        }
        @keyframes xiaobaiSealBurst {
          0% { transform: translateX(-50%) scale(0.92) rotate(-8deg); }
          50% { transform: translateX(-50%) scale(1.08) rotate(8deg); }
          100% { transform: translateX(-50%) scale(0.98) rotate(-4deg); }
        }
        @keyframes xiaobaiSealVanish {
          0%, 58% { opacity: 1; }
          78% { opacity: 0.65; transform: translateX(-50%) translateY(4px) scale(0.72); }
          100% { opacity: 0; transform: translateX(-50%) translateY(16px) scale(0.2); }
        }
        @keyframes xiaobaiSealRing {
          0% { transform: scale(0.5) rotate(0deg); opacity: 0; }
          28% { opacity: 1; }
          100% { transform: scale(1.24) rotate(80deg); opacity: 0; }
        }
        @keyframes xiaobaiBurrowShadow {
          0% { transform: translateX(-50%) scale(1); opacity: 0.74; }
          28% { transform: translateX(-50%) scale(0.18); opacity: 0.1; }
          58% { transform: translateX(-50%) scale(0.24); opacity: 0.12; }
          82% { transform: translateX(-50%) scale(1.3); opacity: 0.52; }
          100% { transform: translateX(-50%) scale(1); opacity: 0.74; }
        }
        @keyframes xiaobaiDozeBody {
          0%, 100% { transform: translate(2px, 3px) rotate(-7deg) scale(0.98); }
          45% { transform: translate(4px, 6px) rotate(-9deg) scale(0.95); }
        }
        @keyframes xiaobaiSneakPeek {
          0%, 100% { transform: translateX(0) rotate(-1deg); }
          34% { transform: translateX(-8px) rotate(-5deg); }
          62% { transform: translateX(6px) rotate(4deg); }
        }
        @keyframes xiaobaiCurtainPeek {
          0%, 100% { transform: translateX(22px); opacity: 0; }
          24%, 72% { transform: translateX(0); opacity: 1; }
        }
        @keyframes xiaobaiScan {
          0% { transform: scale(0.54); opacity: 0; }
          18% { opacity: 0.75; }
          100% { transform: scale(1.35); opacity: 0; }
        }
        @keyframes xiaobaiOrbit {
          to { transform: rotate(360deg); }
        }
        @keyframes xiaobaiBlink {
          0%, 100% { transform: scale(1); opacity: 0.86; }
          50% { transform: scale(1.35); opacity: 1; }
        }
        @keyframes xiaobaiSpeechFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes xiaobaiShadow {
          0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.74; }
          45% { transform: translateX(-50%) scale(0.72); opacity: 0.42; }
        }
        @keyframes xiaobaiWalkShadow {
          0%, 100% { transform: translateX(-50%) scale(0.96); opacity: 0.56; }
          50% { transform: translateX(-50%) scale(0.7); opacity: 0.32; }
        }
        @keyframes xiaobaiStepMark {
          0% { transform: translateY(0) scale(0.6); opacity: 0; }
          20% { opacity: 0.78; }
          100% { transform: translateY(8px) scale(1.35); opacity: 0; }
        }
        @media (max-width: 640px) {
          .xiaobai-float {
            max-width: calc(100vw - 24px);
          }
          .xiaobai-panel {
            width: min(420px, calc(100vw - 24px));
            height: min(620px, calc(100vh - 86px));
          }
          .xiaobai-launcher {
            margin-left: auto;
            width: 98px;
            height: 112px;
          }
          .xiaobai-launcher-speech {
            right: 76px;
            bottom: 64px;
            width: min(190px, calc(100vw - 132px));
            font-size: 11px;
          }
        }
      `}</style>
    </div>
  )
}

function getLauncherSize(element: HTMLElement | null) {
  if (!element) return { width: 112, height: 124 }
  const rect = element.getBoundingClientRect()
  return { width: rect.width, height: rect.height }
}

function getPanelPosition(anchor: FloatAnchor, launcherSize = { width: 112, height: 124 }) {
  if (typeof window === "undefined") return { right: 14, bottom: 150 }
  const margin = 14
  const panelWidth = Math.min(420, window.innerWidth - margin * 2)
  const launcherLeft = window.innerWidth - anchor.right - launcherSize.width
  const launcherCenter = launcherLeft + launcherSize.width / 2
  const left = Math.min(
    Math.max(launcherCenter - panelWidth / 2, margin),
    Math.max(margin, window.innerWidth - panelWidth - margin),
  )
  const preferredBottom = anchor.bottom + launcherSize.height + 12
  const panelHeight = Math.min(680, window.innerHeight - 110)
  const bottom = Math.min(
    Math.max(preferredBottom, margin),
    Math.max(margin, window.innerHeight - panelHeight - margin),
  )
  return { left, bottom }
}

function clampFloatAnchor(anchor: FloatAnchor, size = { width: 112, height: 124 }): FloatAnchor {
  if (typeof window === "undefined") return anchor
  const margin = window.innerWidth <= 640 ? 12 : 18
  const maxRight = Math.max(margin, window.innerWidth - size.width - margin)
  const maxBottom = Math.max(margin, window.innerHeight - size.height - margin)
  return {
    right: Math.min(Math.max(anchor.right, margin), maxRight),
    bottom: Math.min(Math.max(anchor.bottom, margin), maxBottom),
  }
}

function getPatrolAnchors(size = { width: 112, height: 124 }): FloatAnchor[] {
  if (typeof window === "undefined") return [DEFAULT_FLOAT_ANCHOR]
  const margin = window.innerWidth <= 640 ? 12 : 22
  const midBottom = Math.max(margin, Math.min(window.innerHeight - size.height - margin, Math.round(window.innerHeight * 0.34)))
  return [
    { right: margin, bottom: margin },
    { right: margin, bottom: midBottom },
    { right: Math.max(margin, Math.round(window.innerWidth * 0.18)), bottom: margin },
    { right: margin, bottom: margin },
  ]
}
