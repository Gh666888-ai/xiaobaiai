"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowUp, Compass, Loader2, LogIn, Sparkles, UserRound } from "lucide-react"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"
import { XiaobaiMascot } from "@/components/XiaobaiMascot"
import { useAuth } from "@/lib/AuthContext"
import { readAppAuth } from "@/lib/app-auth"

type Message = {
  role: "user" | "assistant"
  content: string
}

const starters = [
  "我完全不会 AI，今天应该从哪里开始？",
  "帮我选一个适合写公众号的 AI 工具",
  "我的电脑 16GB 内存，适合本地部署什么模型？",
  "我想做一个自动客服，应该用 Dify 还是 Coze？",
]

export default function ChatPage() {
  const { user, loading } = useAuth()
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "你好呀，我是小白AI助手。选工具、拆需求、学 AI、模型价格、本地部署、Agent 自动化都可以问。你说目标，我把路线铺开。",
    },
  ])
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const [mode, setMode] = useState<"ai" | "fallback" | "">("")
  const [remaining, setRemaining] = useState<number | null>(null)
  const [speaking, setSpeaking] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, sending])

  async function send(text = input) {
    const value = text.trim()
    if (!value || sending || !user) return
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
      if (!res.ok && data.loginRequired) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply || "需要登录后继续使用小白AI助手。" }])
        return
      }
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply || "我刚才没拿到有效回复，你可以换个问法再试一次。" }])
      setSpeaking(true)
      window.setTimeout(() => setSpeaking(false), 1800)
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "请求失败了。你可以稍后再试，或者先去工具选择器 /choose-tool 完成推荐。" }])
    } finally {
      setSending(false)
    }
  }

  return (
    <div style={{ background: "#000", minHeight: "100vh", color: "#ccc", fontFamily: "'Noto Sans SC', sans-serif", position: "relative", overflow: "hidden" }}>
      <MathRain />
      <NavBar />
      <main style={{ maxWidth: 1020, margin: "0 auto", padding: "46px 40px 90px", position: "relative", zIndex: 10 }} className="max-sm:px-4">
        <section style={{ border: "1px solid #1a1a1a", borderRadius: 16, background: "rgba(0,0,0,0.88)", overflow: "hidden", minHeight: "calc(100vh - 160px)", display: "grid", gridTemplateColumns: "280px 1fr" }} className="max-sm:grid-cols-1">
          <aside style={{ borderRight: "1px solid #1a1a1a", padding: 20, background: "rgba(255,255,255,0.025)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <XiaobaiMascot size={38} mood={sending ? "thinking" : user ? "happy" : "welcome"} />
              <div>
                <h1 style={{ color: "#fff", fontSize: 17, fontWeight: 950 }}>小白AI助手</h1>
                <p style={{ color: mode === "ai" ? "#3DA563" : "#777", fontSize: 11, marginTop: 2 }}>{mode === "ai" ? "智能探索中" : mode === "fallback" ? "灵感缓存模式" : user ? "站内陪跑" : "登录后开启"}</p>
              </div>
            </div>

            <p style={{ color: "#999", fontSize: 12, lineHeight: 1.8, marginBottom: 16 }}>问问题时尽量说清楚目标、材料和想要的结果，我会优先给你能照着做的步骤。</p>
            {remaining !== null && (
              <p style={{ color: "#d6c28a", fontSize: 11, lineHeight: 1.6, marginBottom: 12, border: "1px solid #2a1f10", background: "rgba(201,168,76,0.05)", borderRadius: 8, padding: "8px 10px" }}>智能探索模式：今日剩余 {remaining} 次</p>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              {starters.map((item) => (
                <button key={item} onClick={() => send(item)} disabled={!user || loading} style={{ textAlign: "left", border: "1px solid #242424", background: "rgba(0,0,0,0.25)", borderRadius: 8, padding: "10px 11px", color: user ? "#ddd" : "#777", fontSize: 12, lineHeight: 1.55, cursor: user ? "pointer" : "default" }}>
                  {item}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Link href="/choose-tool" style={{ color: "#c9a84c", textDecoration: "none", fontSize: 12, fontWeight: 900, display: "inline-flex", gap: 7, alignItems: "center" }}><Compass size={14} /> 工具选择器</Link>
              <Link href="/growth" style={{ color: "#c9a84c", textDecoration: "none", fontSize: 12, fontWeight: 900, display: "inline-flex", gap: 7, alignItems: "center" }}><Sparkles size={14} /> AI 成长舱</Link>
            </div>
          </aside>

          <section style={{ display: "flex", flexDirection: "column", minHeight: 640 }}>
            {!loading && !user ? (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 28 }}>
                <div style={{ maxWidth: 520, textAlign: "center", border: "1px solid #2a1f10", borderRadius: 16, background: "rgba(201,168,76,0.045)", padding: "34px 30px" }}>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
                    <XiaobaiMascot size={82} mood="welcome" />
                  </div>
                  <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 950, marginBottom: 10 }}>登录后使用小白AI助手</h2>
                  <p style={{ color: "#cfcfcf", fontSize: 14, lineHeight: 1.9, marginBottom: 22 }}>登录后开启小白AI智能探索模式，可以继续追问复杂需求、方案拆解和自动化流程。小白会把答案尽量拆成能照着做的步骤。</p>
                  <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                    <Link href="/login?redirect=/chat" className="btn-primary" style={{ textDecoration: "none" }}><LogIn size={15} /> 登录 / 注册</Link>
                    <Link href="/choose-tool" className="btn-outline" style={{ textDecoration: "none" }}>先用工具选择器</Link>
                    <Link href="/learn" className="btn-outline" style={{ textDecoration: "none" }}>小白爱学习</Link>
                  </div>
                </div>
              </div>
            ) : (
            <>
            <div style={{ flex: 1, overflowY: "auto", padding: 22, display: "flex", flexDirection: "column", gap: 16 }}>
              {messages.length <= 1 && (
                <div style={{ border: "1px solid #2a1f10", borderRadius: 12, background: "rgba(201,168,76,0.04)", padding: 16, display: "flex", gap: 12, alignItems: "center" }}>
                  <XiaobaiMascot size={44} mood="recommend" />
                  <div>
                    <p style={{ color: "#fff", fontSize: 14, fontWeight: 950 }}>不知道问什么也没关系</p>
                    <p style={{ color: "#aaa", fontSize: 12, lineHeight: 1.7, marginTop: 3 }}>你可以直接说“我想用 AI 做什么”，小白AI会帮你拆步骤、选工具、给学习路线。</p>
                  </div>
                </div>
              )}
              {messages.map((message, index) => {
                const isUser = message.role === "user"
                const isLastAssistant = !isUser && index === messages.length - 1
                return (
                  <div key={index} style={{ display: "flex", gap: 10, alignItems: "flex-start", flexDirection: isUser ? "row-reverse" : "row" }}>
                    {isUser ? (
                      <div style={{ width: 30, height: 30, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(201,168,76,0.12)", border: "1px solid #7a6230", flexShrink: 0 }}>
                        <UserRound size={15} style={{ color: "#e8c96a" }} />
                      </div>
                    ) : (
                      <XiaobaiMascot size={30} mood={isLastAssistant && speaking ? "talking" : "idle"} />
                    )}
                    <div style={{ maxWidth: "78%", border: `1px solid ${isUser ? "rgba(201,168,76,0.25)" : "#1a1a1a"}`, background: isUser ? "rgba(201,168,76,0.1)" : "rgba(255,255,255,0.04)", borderRadius: 12, padding: "12px 14px", color: "#e8e8e8", fontSize: 14, lineHeight: 1.8, whiteSpace: "pre-line", wordBreak: "break-word" }}>
                      {message.content}
                    </div>
                  </div>
                )
              })}
              {sending && (
                <div style={{ display: "flex", alignItems: "center", gap: 9, color: "#888", fontSize: 13 }}>
                  <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> 小白AI 正在整理答案...
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div style={{ borderTop: "1px solid #1a1a1a", padding: 14, background: "#080808" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      send()
                    }
                  }}
                  placeholder="直接问：我想用 AI 做……现在有……希望得到……"
                  disabled={loading || !user}
                  rows={2}
                  style={{ flex: 1, resize: "none", background: "rgba(255,255,255,0.04)", border: "1px solid #222", borderRadius: 12, padding: "12px 14px", fontSize: 14, color: "#fff", outline: "none", lineHeight: 1.6, opacity: loading || !user ? 0.55 : 1 }}
                />
                <button onClick={() => send()} disabled={sending || !input.trim() || loading || !user} style={{ width: 44, height: 44, borderRadius: 12, border: "1px solid #7a6230", background: "rgba(201,168,76,0.14)", color: "#e8c96a", display: "flex", alignItems: "center", justifyContent: "center", cursor: sending ? "default" : "pointer" }}>
                  <ArrowUp size={18} />
                </button>
              </div>
            </div>
            </>
            )}
          </section>
        </section>
      </main>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
