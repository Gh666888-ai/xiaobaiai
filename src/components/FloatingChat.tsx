"use client"

import { useEffect, useRef, useState } from "react"
import type { PointerEvent as ReactPointerEvent } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowUp, Loader2, LogIn, MessageCircle, Minus, UserRound, X } from "lucide-react"
import { useAuth } from "@/lib/AuthContext"
import { readAppAuth } from "@/lib/app-auth"
import { XiaobaiMascot } from "@/components/XiaobaiMascot"
import { missions } from "@/data/missions"
import {
  currentStepLabel,
  emptyMissionProgress,
  getStoredMission,
  MISSION_PROGRESS_KEY,
  readMissionProgress,
  type MissionProgressState,
} from "@/lib/mission-progress"

type Message = {
  role: "user" | "assistant"
  content: string
}

type LauncherMood = "welcome" | "thinking" | "recommend"
type ChatMode = "ai" | "fallback" | "site" | ""
type FloatAnchor = {
  right: number
  bottom: number
}

const START_INDUSTRY_PROMPT_KEY = "xiaobaiai:start-industry-prompt:v1"
const START_INDUSTRY_PROMPT =
  "你已经登录了。先告诉我两个信息：\n1. 你从事什么行业或岗位？\n2. 你最想用 AI 做成什么事？\n\n我会按你的行业推荐该学的 AI 工具，并把路线拆成能一步步完成的任务。"
const FLOAT_AGENT_ANCHOR_KEY = "xiaobaiai:floating-agent-anchor:v1"
const DEFAULT_FLOAT_ANCHOR: FloatAnchor = { right: 22, bottom: 22 }

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

export function FloatingChat() {
  const pathname = usePathname()
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
  const [missionProgress, setMissionProgress] = useState<MissionProgressState>(() => emptyMissionProgress())
  const [hasSavedMissionProgress, setHasSavedMissionProgress] = useState(false)
  const [floatAnchor, setFloatAnchor] = useState<FloatAnchor>(DEFAULT_FLOAT_ANCHOR)
  const [dragging, setDragging] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const launcherRef = useRef<HTMLButtonElement>(null)
  const patrolIndexRef = useRef(0)
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
  const hideOnFocusedFlow =
    pathname === "/missions" ||
    pathname?.startsWith("/missions/") ||
    pathname === "/learn" ||
    pathname?.startsWith("/learn/")

  useEffect(() => {
    const openChat = () => {
      setOpen(true)
      setMinimized(false)
      setHasSavedMissionProgress(Boolean(window.localStorage.getItem(MISSION_PROGRESS_KEY)))
      setMissionProgress(readMissionProgress())
    }
    window.addEventListener("xiaobai:open-chat", openChat)
    return () => window.removeEventListener("xiaobai:open-chat", openChat)
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
    if (open && !minimized) bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, sending, open, minimized])

  useEffect(() => {
    if (open && !minimized) return
    const moods: LauncherMood[] = ["welcome", "thinking", "recommend"]
    let index = 0
    const timer = window.setInterval(() => {
      index = (index + 1) % moods.length
      setLauncherMood(moods[index])
    }, 2600)
    return () => window.clearInterval(timer)
  }, [open, minimized])

  useEffect(() => {
    if ((open && !minimized) || dragging) return
    if (window.localStorage.getItem(FLOAT_AGENT_ANCHOR_KEY)) return

    const timer = window.setInterval(() => {
      const points = getPatrolAnchors(getLauncherSize(launcherRef.current))
      patrolIndexRef.current = (patrolIndexRef.current + 1) % points.length
      setFloatAnchor(clampFloatAnchor(points[patrolIndexRef.current], getLauncherSize(launcherRef.current)))
    }, 8500)
    return () => window.clearInterval(timer)
  }, [dragging, minimized, open])

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
          content: "想让小白按你的行业推荐该学哪些 AI 工具、先做哪些任务，需要先注册登录。登录后我会记住你的行业、目标和进度，不会每次都从头问。",
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
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply || "我刚才没拿到有效回复，你可以换个问法再试一次。" }])
      setSpeaking(true)
      window.setTimeout(() => setSpeaking(false), 1800)
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "请求失败了。你可以稍后再试，或者先去工具选择器完成推荐。" }])
    } finally {
      setSending(false)
    }
  }

  if (hideOnFullChat || hideOnFocusedFlow) return null

  const activeMission = missions.find((mission) => mission.id === missionProgress.activeMissionId) || missions[0]
  const activeProgress = getStoredMission(missionProgress, activeMission.id)
  const stepIndex = Math.min(activeProgress.currentStep || 0, activeMission.steps.length - 1)
  const doneSteps = activeMission.steps.filter((_, index) => activeProgress.completedSteps[index]).length
  const nextStep = activeProgress.completed ? "任务完成了，下一步发复盘拿 XP" : currentStepLabel(activeMission.id, stepIndex)
  const hasProgress = hasSavedMissionProgress && (doneSteps > 0 || activeProgress.currentStep > 0 || missionProgress.activeMissionId !== missions[0].id)
  const reminderTitle = hasProgress ? "小白继续提醒" : "按行业定制"
  const reminderText = hasProgress
    ? `上次任务：${activeMission.shortTitle}。接下来：${nextStep}。`
    : user
      ? "先说你的行业和想做成的事，我会给你一条能实际执行的学习路线。"
      : "注册登录后告诉小白你的行业，我会推荐你该学的 AI 工具和任务路线。"
  const reminderAction = hasProgress ? "继续" : user ? "告诉小白" : "登录"
  const reminderHref = hasProgress ? `/missions/${activeMission.id}` : user ? "/chat" : `/login?redirect=${encodeURIComponent(pathname || "/start")}`
  const launcherSubtitle = hasProgress
    ? `巡到任务 ${doneSteps}/${activeMission.steps.length}`
    : user
      ? launcherMood === "thinking"
        ? "我巡一下任务"
        : launcherMood === "recommend"
          ? "点我说行业目标"
          : "这步做了吗"
      : launcherMood === "recommend"
        ? "注册后定制"
        : "点我先问问"

  return (
    <div className={`xiaobai-float ${dragging ? "is-dragging" : ""}`} style={{ right: floatAnchor.right, bottom: floatAnchor.bottom }}>
      {open && !minimized && (
        <section className="xiaobai-panel" aria-label="小白AI浮动问答">
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
              {!loading && !user && (
                <div className="xiaobai-login-note">
                  <XiaobaiMascot size={36} mood="welcome" />
                  <div>
                    <p>小白速答已待命</p>
                    <span>注册登录后，小白会根据你的行业和想做的方向，推荐需要学习的 AI 工具、任务路线和下一步。</span>
                  </div>
                  <Link href={`/login?redirect=${encodeURIComponent(pathname || "/")}`}>
                    <LogIn size={13} />
                    登录
                  </Link>
                </div>
              )}
              <div className="xiaobai-continue-card">
                <XiaobaiMascot size={34} mood="recommend" />
                <div>
                  <p>{reminderTitle}</p>
                  <span>{reminderText}</span>
                </div>
                {hasProgress || !user ? (
                  <Link href={reminderHref}>{reminderAction}</Link>
                ) : (
                  <button type="button" onClick={() => inputRef.current?.focus()}>{reminderAction}</button>
                )}
              </div>
                {messages.length <= 1 && (
                  <div className="xiaobai-empty">
                    <XiaobaiMascot size={38} mood="recommend" />
                    <div>
                      <p>我可以按行业给你带路</p>
                      <span>告诉小白你做什么行业，我会推荐该学哪些 AI 工具，以及从第 1 个任务到后续进阶怎么走。</span>
                    </div>
                  </div>
                )}

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
                      <div className="xiaobai-bubble">{message.content}</div>
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
        className={`xiaobai-launcher ${open && !minimized ? "is-open" : ""}`}
        onPointerDown={handleLauncherPointerDown}
        onPointerMove={handleLauncherPointerMove}
        onPointerUp={finishLauncherDrag}
        onPointerCancel={finishLauncherDrag}
        onClick={openFloatingChat}
        aria-label="拖动或点击小白AI"
      >
        <XiaobaiMascot size={66} mood={open ? "happy" : launcherMood} />
        <span>
          <strong>小白AI巡视中</strong>
          <small>{launcherSubtitle}</small>
        </span>
        <MessageCircle size={17} />
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
        .xiaobai-panel {
          width: min(420px, calc(100vw - 28px));
          height: min(680px, calc(100vh - 110px));
          margin-bottom: 12px;
          border: 1px solid #2a1f10;
          border-radius: 18px;
          background: rgba(5,5,5,0.96);
          box-shadow: 0 28px 110px rgba(0,0,0,0.72), 0 0 0 1px rgba(201,168,76,0.08);
          backdrop-filter: blur(18px);
          overflow: hidden;
          display: flex;
          flex-direction: column;
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
        .xiaobai-login-state {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 30px;
        }
        .xiaobai-login-state h2 {
          color: #fff;
          font-size: 20px;
          font-weight: 950;
          margin: 18px 0 8px;
        }
        .xiaobai-login-state p {
          color: #aaa;
          font-size: 13px;
          line-height: 1.8;
          margin: 0 0 18px;
        }
        .xiaobai-login-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #111;
          background: #e8c96a;
          border: 1px solid #e8c96a;
          border-radius: 10px;
          padding: 10px 15px;
          font-size: 13px;
          font-weight: 950;
          text-decoration: none;
        }
        .xiaobai-login-note {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 10px;
          border: 1px solid #2a1f10;
          border-radius: 12px;
          background: rgba(201,168,76,0.04);
          padding: 10px;
        }
        .xiaobai-continue-card {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 10px;
          border: 1px solid rgba(201,168,76,0.34);
          border-radius: 12px;
          background: rgba(201,168,76,0.06);
          padding: 10px;
        }
        .xiaobai-continue-card p {
          margin: 0 0 3px;
          color: #fff;
          font-size: 12px;
          font-weight: 950;
        }
        .xiaobai-continue-card span {
          color: #cdbb80;
          font-size: 11px;
          line-height: 1.55;
        }
        .xiaobai-continue-card a {
          display: inline-flex;
          align-items: center;
          color: #111;
          background: #e8c96a;
          border-radius: 8px;
          padding: 7px 9px;
          font-size: 11px;
          font-weight: 950;
          text-decoration: none;
        }
        .xiaobai-continue-card button {
          border: 0;
          display: inline-flex;
          align-items: center;
          color: #111;
          background: #e8c96a;
          border-radius: 8px;
          padding: 7px 9px;
          font-size: 11px;
          font-weight: 950;
          font-family: inherit;
          cursor: pointer;
          white-space: nowrap;
        }
        .xiaobai-login-note p {
          margin: 0 0 3px;
          color: #fff;
          font-size: 12px;
          font-weight: 950;
        }
        .xiaobai-login-note span {
          color: #999;
          font-size: 11px;
          line-height: 1.55;
        }
        .xiaobai-login-note a {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: #111;
          background: #e8c96a;
          border-radius: 8px;
          padding: 7px 9px;
          font-size: 11px;
          font-weight: 950;
          text-decoration: none;
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
        .xiaobai-empty {
          display: flex;
          align-items: center;
          gap: 11px;
          border: 1px solid #2a1f10;
          border-radius: 12px;
          background: rgba(201,168,76,0.045);
          padding: 12px;
        }
        .xiaobai-empty p {
          margin: 0 0 3px;
          color: #fff;
          font-size: 13px;
          font-weight: 950;
        }
        .xiaobai-empty span {
          color: #999;
          font-size: 12px;
          line-height: 1.6;
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
          min-width: 204px;
          border: 1px solid #7a6230;
          border-radius: 17px;
          background: rgba(0,0,0,0.86);
          box-shadow: 0 18px 60px rgba(0,0,0,0.65);
          color: #fff;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 14px;
          cursor: grab;
          backdrop-filter: blur(14px);
          user-select: none;
          margin-left: auto;
          touch-action: none;
        }
        .xiaobai-float.is-dragging .xiaobai-launcher {
          cursor: grabbing;
        }
        .xiaobai-launcher.is-open {
          border-color: #2a2a2a;
        }
        .xiaobai-launcher span {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          line-height: 1.25;
          flex: 1;
        }
        .xiaobai-launcher strong {
          font-size: 13px;
          font-weight: 950;
        }
        .xiaobai-launcher small {
          color: #c9a84c;
          font-size: 11px;
        }
        @keyframes xiaobaiSpin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 640px) {
          .xiaobai-float {
            max-width: calc(100vw - 24px);
          }
          .xiaobai-panel {
            width: 100%;
            height: min(620px, calc(100vh - 86px));
          }
          .xiaobai-launcher {
            margin-left: auto;
            min-width: 186px;
          }
        }
      `}</style>
    </div>
  )
}

function getLauncherSize(element: HTMLElement | null) {
  if (!element) return { width: 204, height: 90 }
  const rect = element.getBoundingClientRect()
  return { width: rect.width, height: rect.height }
}

function clampFloatAnchor(anchor: FloatAnchor, size = { width: 204, height: 90 }): FloatAnchor {
  if (typeof window === "undefined") return anchor
  const margin = window.innerWidth <= 640 ? 12 : 18
  const maxRight = Math.max(margin, window.innerWidth - size.width - margin)
  const maxBottom = Math.max(margin, window.innerHeight - size.height - margin)
  return {
    right: Math.min(Math.max(anchor.right, margin), maxRight),
    bottom: Math.min(Math.max(anchor.bottom, margin), maxBottom),
  }
}

function getPatrolAnchors(size = { width: 204, height: 90 }): FloatAnchor[] {
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
