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
import { recommendSkillsForGoal } from "@/data/skill-recommendations"

type Message = {
  role: "user" | "assistant"
  content: string
  actionHref?: string
  actionLabel?: string
}

type ChatMode = "ai" | "fallback" | "site" | ""
type FloatAnchor = {
  right: number
  bottom: number
}

const START_INDUSTRY_PROMPT_KEY = "xiaobaiai:start-industry-prompt:v1"
const START_INDUSTRY_PROMPT =
  "你已经登录了。先告诉我你属于哪一种：个人在家，还是企业团队？再说你想做成什么事、每天有多少时间。我会给你对应的任务入口。"
const GOAL_ROUTER_PROMPT =
  "先选清楚：个人在家，还是企业团队。\n\n个人适合先做作品、接单样稿、内容账号、个人 Agent；企业适合先做客服知识库、SOP、会议纪要、销售支持、自动化流程。\n\n我收到后会给你一个任务入口，你点一下再进入，不会突然跳走。"
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
  "在家创业", "副业", "接单", "在家赚钱", "不出门",
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
    "在家",
    "创业",
    "副业",
    "接单",
    "赚钱",
    "不出门",
    "ai",
  ].some((keyword) => text.includes(keyword))
}

function missionKindLabel(missionId: string) {
  if (missionId === "n8n-ai-news-automation" || missionId === "dify-knowledge-base-bot") return "公司工作流"
  return "任务模板"
}

function classifyGoal(goal: string) {
  const text = goal.toLowerCase()
  const personalWords = ["个人", "在家", "创业", "副业", "接单", "不出门", "内容账号", "办公接单", "个人 agent"]
  const enterpriseWords = ["企业", "公司", "团队", "员工", "sop", "知识库客服", "办公提效", "自动化流程", "销售支持"]
  if (personalWords.some((word) => text.includes(word))) return "personal"
  if (enterpriseWords.some((word) => text.includes(word))) return "enterprise"
  return "general"
}

function getMissionById(missionId?: string) {
  return missionId ? missions.find((item) => item.id === missionId) : undefined
}

function buildSkillPlanReply(goal: string) {
  const audience = classifyGoal(goal)
  const plan = recommendSkillsForGoal(goal, 4)
  const directMission = recommendMissionFromGoal(goal)
  const planMission = missions.find((item) => item.id === plan.nextMissionId)
  const mission = directMission.id !== "industry-skill-stack-plan" ? directMission : planMission || directMission
  const topSkills = plan.recommendations.slice(0, 3)
  const skillLines = topSkills.map((item, index) => `${index + 1}. ${item.skill.name} ${item.score}分：${item.reason}`)
  if (audience === "personal") {
    return {
      mission,
      content: `我按「个人在家」给你排路线。个人先不要碰企业 SOP、周报系统这些，先做一个能展示的作品。\n\n先做的工作：选一个小方向 → 做第一个样稿/样片 → 写展示文案 → 发到社区复盘\n\n先用工具：DeepSeek/Kimi、即梦/剪映、WPS/Gamma、Canva。复杂 Skill 和自动化后面再装。\n\n第一步先点下面入口：${mission.shortTitle}`,
    }
  }
  const opening = audience === "enterprise"
      ? "我按「企业团队」给你排路线。企业先不要做个人接单作品，先做能复用、能检查、能交接的流程。"
      : `我按「${plan.track.shortTitle}」给你排了一条路线。`

  return {
    mission,
    content: `${opening}\n\n先做的工作：${plan.workflow.slice(0, 4).join(" → ")}\n\n先装 Skill：\n${skillLines.join("\n")}\n\n第一步先点下面入口：${mission.shortTitle}`,
  }
}

function buildPickedGoalReply(goal: string, missionId?: string, audience?: string, label?: string) {
  const mission = getMissionById(missionId) || recommendMissionFromGoal(goal)
  const isEnterprise = audience === "企业团队"
  const content = isEnterprise
    ? `我按「企业团队｜${label || mission.shortTitle}」给你排路线。\n\n企业适合先做：客服知识库、会议纪要、SOP、周报日报、销售话术、自动化通知。\n\n这类任务重点不是做作品，而是把资料、流程、权限边界和验收标准沉淀下来。\n\n第一步先点下面入口：${mission.shortTitle}`
    : `我按「个人在家｜${label || mission.shortTitle}」给你排路线。\n\n个人适合先做：图文内容、短视频样片、AI漫剧、办公样稿、电商文案、个人 Agent。\n\n这类任务先不谈收益，先做一个能展示、能发出去、能让别人看懂的作品。\n\n第一步先点下面入口：${mission.shortTitle}`

  return { mission, content }
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
  const [mode, setMode] = useState<ChatMode>("")
  const [remaining, setRemaining] = useState<number | null>(null)
  const [launcherHint, setLauncherHint] = useState("")
  const [missionProgress, setMissionProgress] = useState<MissionProgressState>(() => emptyMissionProgress())
  const [hasSavedMissionProgress, setHasSavedMissionProgress] = useState(false)
  const [floatAnchor, setFloatAnchor] = useState<FloatAnchor>(DEFAULT_FLOAT_ANCHOR)
  const [dragging, setDragging] = useState(false)
  const [mobileRevealed, setMobileRevealed] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const launcherRef = useRef<HTMLButtonElement>(null)
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
      setMobileRevealed(true)
      setOpen(true)
      setMinimized(false)
      setHasSavedMissionProgress(Boolean(window.localStorage.getItem(MISSION_PROGRESS_KEY)))
      setMissionProgress(readMissionProgress())
    }
    const openGoalRouter = (event?: Event) => {
      const goal = event instanceof CustomEvent && typeof event.detail?.goal === "string" ? event.detail.goal : ""
      const missionId = event instanceof CustomEvent && typeof event.detail?.missionId === "string" ? event.detail.missionId : ""
      const audience = event instanceof CustomEvent && typeof event.detail?.audience === "string" ? event.detail.audience : ""
      const label = event instanceof CustomEvent && typeof event.detail?.label === "string" ? event.detail.label : ""
      const customPrompt = event instanceof CustomEvent && typeof event.detail?.prompt === "string" ? event.detail.prompt : GOAL_ROUTER_PROMPT
      openChat()
      setInput("")
      if (goal) {
        const { mission, content } = buildPickedGoalReply(goal, missionId, audience, label)
        const nextProgress = selectMission(readMissionProgress(), mission.id)
        writeMissionProgress(nextProgress)
        setMissionProgress(nextProgress)
        setHasSavedMissionProgress(true)
        window.localStorage.setItem(ONBOARDING_PROFILE_KEY, goal.slice(0, 240))
        setMode("site")
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `${content}\n\n我已经给你放好入口了。你想开始时，自己点下面按钮进入任务。`,
            actionHref: `/missions/${mission.id}`,
            actionLabel: `打开「${mission.shortTitle}」`,
          },
        ])
        return
      }
      setMessages((prev) => (
        prev.some((message) => message.content === customPrompt)
          ? prev
          : [...prev, { role: "assistant", content: customPrompt }]
      ))
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
    if (loading || !user || (pathname !== "/learn" && pathname !== "/start")) return
    if (window.sessionStorage.getItem(START_INDUSTRY_PROMPT_KEY)) return

    window.sessionStorage.setItem(START_INDUSTRY_PROMPT_KEY, "1")
    setMobileRevealed(true)
    setOpen(true)
    setMinimized(false)
    setHasSavedMissionProgress(Boolean(window.localStorage.getItem(MISSION_PROGRESS_KEY)))
    setMissionProgress(readMissionProgress())
    setMessages((prev) => (
      prev.some((message) => message.content === START_INDUSTRY_PROMPT)
        ? prev
        : [...prev, { role: "assistant", content: START_INDUSTRY_PROMPT }]
    ))
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 240)
    return () => {
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
    }, 850)

    return () => window.clearTimeout(timer)
  }, [loading, pathname, user])

  useEffect(() => {
    if (open && !minimized) bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, sending, open, minimized])

  function handleLauncherPointerDown(event: ReactPointerEvent<HTMLButtonElement>) {
    if (typeof window !== "undefined" && window.innerWidth <= 640 && !mobileRevealed && !open) return
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
    if (typeof window !== "undefined" && window.innerWidth <= 640 && !mobileRevealed && !open) {
      setMobileRevealed(true)
      setLauncherHint("")
      return
    }
    setHasSavedMissionProgress(Boolean(window.localStorage.getItem(MISSION_PROGRESS_KEY)))
    setMissionProgress(readMissionProgress())
    setOpen(true)
    setMinimized(false)
    setMobileRevealed(true)
    setLauncherHint("")
  }

  async function assignMissionFromGoal(goal: string) {
    const { mission } = buildSkillPlanReply(goal)
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
      return
    }
    const nextMessages: Message[] = [...messages, { role: "user", content: value }]
    setMessages(nextMessages)
    setInput("")
    setSending(true)
    if (user && (looksLikeIndustryGoal(value) || looksLikeGoalShortcut(value))) {
      await assignMissionFromGoal(value)
      const { mission, content } = buildSkillPlanReply(value)
      const kindLabel = missionKindLabel(mission.id)
      setMode("site")
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `${content}\n\n我已经记住进度。你想开始时，自己点入口进入${kindLabel}。`,
          actionHref: `/missions/${mission.id}`,
          actionLabel: `打开「${mission.shortTitle}」`,
        },
      ])
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
  return (
    <div
      className={`xiaobai-float ${dragging ? "is-dragging" : ""} ${mobileRevealed || open ? "is-mobile-revealed" : "is-mobile-tucked"}`}
      style={{ right: floatAnchor.right, bottom: floatAnchor.bottom }}
    >
      {open && !minimized && (
        <section className="xiaobai-panel" style={panelPosition} aria-label="小白AI浮动问答">
          <header className="xiaobai-panel-head">
            <div className="xiaobai-head-left">
              <XiaobaiMascot size={48} mood="idle" />
              <div>
                <p className="xiaobai-title">小白AI助手</p>
                <p className="xiaobai-subtitle">{mode === "ai" ? "智能探索中" : mode === "site" ? "站内速答" : mode === "fallback" ? "灵感缓存模式" : user ? "当前页面陪跑" : "站内速答待命"}</p>
              </div>
            </div>
            <div className="xiaobai-head-actions">
              <button type="button" aria-label="最小化小白AI" onClick={() => setMinimized(true)} className="xiaobai-icon-btn">
                <Minus size={15} />
              </button>
              <button type="button" aria-label="关闭小白AI" onClick={() => { setOpen(false); setMobileRevealed(false) }} className="xiaobai-icon-btn">
                <X size={15} />
              </button>
            </div>
          </header>

          <>
            <div className="xiaobai-messages">
                {messages.map((message, index) => {
                  const isUser = message.role === "user"
                  return (
                    <div key={`${message.role}-${index}`} className={`xiaobai-message ${isUser ? "is-user" : ""}`}>
                      {isUser ? (
                        <span className="xiaobai-user-avatar">
                          <UserRound size={15} />
                        </span>
                      ) : (
                        <XiaobaiMascot size={30} mood="idle" />
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
                placeholder={user ? "比如：个人在家，每天3小时，会剪映，想做AI漫剧" : "注册后可按方向定制推荐"}
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
        className={`xiaobai-launcher ${open && !minimized ? "is-open" : ""} ${hasProgress ? "has-progress" : ""}`}
        onPointerDown={handleLauncherPointerDown}
        onPointerMove={handleLauncherPointerMove}
        onPointerUp={finishLauncherDrag}
        onPointerCancel={finishLauncherDrag}
        onClick={openFloatingChat}
        aria-label={hasProgress ? `拖动或点击小白AI，当前任务完成 ${doneSteps}/${activeMission.steps.length}` : "拖动或点击小白AI"}
      >
        <span className="xiaobai-wake-tab" aria-hidden="true">小白</span>
        {launcherHint && (!open || minimized) && (
          <span className="xiaobai-launcher-speech">
            {launcherHint}
          </span>
        )}
        <span className="xiaobai-body">
          <XiaobaiMascot size={86} mood="idle" />
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
      </button>

      <style suppressHydrationWarning>{`
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
        .xiaobai-wake-tab {
          display: none;
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
          transform-origin: 50% 92%;
        }
        .xiaobai-float.is-dragging .xiaobai-body {
          transform: scale(1.04) rotate(-2deg);
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
        }
        .xiaobai-status-dot.is-ready {
          background: #7ee7ff;
          box-shadow: 0 0 0 5px rgba(126,231,255,0.15), 0 0 20px rgba(126,231,255,0.75);
        }
        @keyframes xiaobaiSpin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 640px) {
          .xiaobai-float {
            max-width: calc(100vw - 24px);
            transition: right 0.24s ease, bottom 0.24s ease, transform 0.22s ease;
            right: 10px !important;
          }
          .xiaobai-float.is-mobile-tucked {
            transform: translateX(26px);
          }
          .xiaobai-float.is-mobile-revealed {
            transform: none;
          }
          .xiaobai-panel {
            width: min(420px, calc(100vw - 24px));
            height: min(620px, calc(100vh - 86px));
          }
          .xiaobai-launcher {
            margin-left: auto;
            width: 58px;
            height: 68px;
          }
          .xiaobai-wake-tab {
            position: absolute;
            left: -26px;
            top: 50%;
            z-index: 7;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 46px;
            height: 38px;
            transform: translateY(-50%);
            border: 1px solid rgba(201,168,76,0.34);
            border-right: 0;
            border-radius: 16px 0 0 16px;
            background: rgba(8,8,8,0.92);
            color: #f3e7ba;
            font-size: 11px;
            font-weight: 950;
            letter-spacing: 0;
            box-shadow: 0 10px 26px rgba(0,0,0,0.32);
            backdrop-filter: blur(10px);
          }
          .xiaobai-float.is-mobile-revealed .xiaobai-wake-tab,
          .xiaobai-float.is-mobile-revealed .xiaobai-launcher.is-open .xiaobai-wake-tab {
            display: none;
          }
          .xiaobai-float.is-mobile-tucked .xiaobai-body,
          .xiaobai-float.is-mobile-tucked .xiaobai-status-dot,
          .xiaobai-float.is-mobile-tucked .xiaobai-progress-dots,
          .xiaobai-float.is-mobile-tucked .xiaobai-launcher-speech {
            opacity: 0;
            pointer-events: none;
          }
          .xiaobai-body {
            scale: 0.58;
          }
          .xiaobai-launcher-speech {
            right: 48px;
            bottom: 46px;
            width: min(160px, calc(100vw - 96px));
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
