"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowUp, Loader2, LogIn, MessageCircle, Minus, UserRound, X } from "lucide-react"
import { useAuth } from "@/lib/AuthContext"
import { readAppAuth } from "@/lib/app-auth"
import { XiaobaiMascot } from "@/components/XiaobaiMascot"

type Message = {
  role: "user" | "assistant"
  content: string
}

type LauncherMood = "welcome" | "thinking" | "recommend"
type ChatMode = "ai" | "fallback" | "site" | ""

const starters = [
  "我完全不会 AI，今天应该从哪里开始？",
  "帮我选一个适合我的 AI 工具",
  "这个页面我应该先看哪里？",
]

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
      content: "你好，我是小白AI助手。你可以直接告诉我你想做什么，我会帮你拆步骤、选工具、找学习路线。",
    },
  ])
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [mode, setMode] = useState<ChatMode>("")
  const [remaining, setRemaining] = useState<number | null>(null)
  const [launcherMood, setLauncherMood] = useState<LauncherMood>("welcome")
  const bottomRef = useRef<HTMLDivElement>(null)

  const hideOnFullChat = pathname === "/chat"

  useEffect(() => {
    const openChat = () => {
      setOpen(true)
      setMinimized(false)
    }
    window.addEventListener("xiaobai:open-chat", openChat)
    return () => window.removeEventListener("xiaobai:open-chat", openChat)
  }, [])

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
          content: "这个问题需要调用真实 AI 能力。为了保护 API 成本，请先登录；如果你问的是站内页面、工具、学习路径、模型排行、社区等问题，我可以直接免费回答。",
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

  if (hideOnFullChat) return null

  return (
    <div className="xiaobai-float">
      {open && !minimized && (
        <section className="xiaobai-panel" aria-label="小白AI浮动问答">
          <header className="xiaobai-panel-head">
            <div className="xiaobai-head-left">
              <XiaobaiMascot size={48} mood={sending ? "thinking" : user ? "happy" : "welcome"} />
              <div>
                <p className="xiaobai-title">小白AI助手</p>
                <p className="xiaobai-subtitle">{mode === "ai" ? "AI 已接入" : mode === "site" ? "站内免费回答" : mode === "fallback" ? "本地兜底模式" : user ? "当前页面陪跑" : "站内问题可免费问"}</p>
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
                    <p>站内问题可免费问</p>
                    <span>问工具、学习、模型、资讯、社区、登录等站内问题不消耗 API；开放问题需要登录。</span>
                  </div>
                  <Link href={`/login?redirect=${encodeURIComponent(pathname || "/")}`}>
                    <LogIn size={13} />
                    登录
                  </Link>
                </div>
              )}
                {messages.length <= 1 && (
                  <div className="xiaobai-empty">
                    <XiaobaiMascot size={38} mood="recommend" />
                    <div>
                      <p>不知道怎么问也没关系</p>
                      <span>直接说“我想用 AI 做什么”，我会帮你拆成可执行步骤。</span>
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

            <div className="xiaobai-starters">
              {starters.map((starter) => (
                <button type="button" key={starter} onClick={() => send(starter)} disabled={sending || (!user && !isSiteQuestion(starter))}>
                  {starter}
                </button>
              ))}
            </div>

            {remaining !== null && <p className="xiaobai-quota">今日剩余免费提问：{remaining} 次</p>}

            <div className="xiaobai-input-row">
              <textarea
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
                placeholder={user ? "直接问：我想用 AI 做……" : "可免费问站内问题，开放问题需登录"}
              />
              <button type="button" onClick={() => send()} disabled={sending || !input.trim() || loading} aria-label="发送给小白AI">
                <ArrowUp size={18} />
              </button>
            </div>
          </>
        </section>
      )}

      <button
        type="button"
        className={`xiaobai-launcher ${open && !minimized ? "is-open" : ""}`}
        onClick={() => {
          setOpen(true)
          setMinimized(false)
        }}
        aria-label="问小白AI"
      >
        <XiaobaiMascot size={66} mood={open ? "happy" : launcherMood} />
        <span>
          <strong>问小白AI</strong>
          <small>{launcherMood === "thinking" ? "正在思考路线" : launcherMood === "recommend" ? "帮你选工具" : "当前页面陪跑"}</small>
        </span>
        <MessageCircle size={17} />
      </button>

      <style>{`
        .xiaobai-float {
          position: fixed;
          right: 22px;
          bottom: 22px;
          z-index: 120;
          font-family: 'Noto Sans SC', sans-serif;
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
        .xiaobai-starters {
          display: flex;
          gap: 6px;
          padding: 0 14px 10px;
          overflow-x: auto;
        }
        .xiaobai-starters button {
          flex: 0 0 auto;
          border: 1px solid #242424;
          border-radius: 999px;
          background: rgba(255,255,255,0.035);
          color: #cfcfcf;
          font-size: 11px;
          font-weight: 800;
          padding: 7px 10px;
          cursor: pointer;
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
        .xiaobai-input-row button:disabled,
        .xiaobai-starters button:disabled {
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
          cursor: pointer;
          backdrop-filter: blur(14px);
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
            right: 12px;
            bottom: 12px;
            left: 12px;
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
