"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowUp, Bot, Compass, Loader2, Sparkles, UserRound } from "lucide-react"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"

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
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "你好，我是小白AI助手。你可以直接问我：选工具、拆需求、学 AI、模型价格、本地部署、Agent 自动化。你说目标，我帮你拆成能执行的步骤。",
    },
  ])
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const [mode, setMode] = useState<"ai" | "fallback" | "">("")
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, sending])

  async function send(text = input) {
    const value = text.trim()
    if (!value || sending) return
    const nextMessages: Message[] = [...messages, { role: "user", content: value }]
    setMessages(nextMessages)
    setInput("")
    setSending(true)
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: value,
          messages: nextMessages.slice(-8).map((item) => ({ role: item.role, content: item.content })),
        }),
      })
      const data = await res.json()
      setMode(data.mode || "")
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply || "我刚才没拿到有效回复，你可以换个问法再试一次。" }])
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "请求失败了。你可以稍后再试，或者先去工具选择器 /choose-tool 完成推荐。" }])
    }
    setSending(false)
  }

  return (
    <div style={{ background: "#000", minHeight: "100vh", color: "#ccc", fontFamily: "'Noto Sans SC', sans-serif", position: "relative", overflow: "hidden" }}>
      <MathRain />
      <NavBar />
      <main style={{ maxWidth: 1020, margin: "0 auto", padding: "46px 40px 90px", position: "relative", zIndex: 10 }} className="max-sm:px-4">
        <section style={{ border: "1px solid #1a1a1a", borderRadius: 16, background: "rgba(0,0,0,0.88)", overflow: "hidden", minHeight: "calc(100vh - 160px)", display: "grid", gridTemplateColumns: "280px 1fr" }} className="max-sm:grid-cols-1">
          <aside style={{ borderRight: "1px solid #1a1a1a", padding: 20, background: "rgba(255,255,255,0.025)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(201,168,76,0.12)", border: "1px solid #7a6230", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Bot size={18} style={{ color: "#e8c96a" }} />
              </div>
              <div>
                <h1 style={{ color: "#fff", fontSize: 17, fontWeight: 950 }}>小白AI助手</h1>
                <p style={{ color: mode === "ai" ? "#3DA563" : "#777", fontSize: 11, marginTop: 2 }}>{mode === "ai" ? "AI 已接入" : mode === "fallback" ? "本地兜底模式" : "站内陪跑"}</p>
              </div>
            </div>

            <p style={{ color: "#999", fontSize: 12, lineHeight: 1.8, marginBottom: 16 }}>问问题时尽量说清楚目标、材料和想要的结果，我会优先给你能照着做的步骤。</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              {starters.map((item) => (
                <button key={item} onClick={() => send(item)} style={{ textAlign: "left", border: "1px solid #242424", background: "rgba(0,0,0,0.25)", borderRadius: 8, padding: "10px 11px", color: "#ddd", fontSize: 12, lineHeight: 1.55, cursor: "pointer" }}>
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
            <div style={{ flex: 1, overflowY: "auto", padding: 22, display: "flex", flexDirection: "column", gap: 16 }}>
              {messages.map((message, index) => {
                const isUser = message.role === "user"
                return (
                  <div key={index} style={{ display: "flex", gap: 10, alignItems: "flex-start", flexDirection: isUser ? "row-reverse" : "row" }}>
                    <div style={{ width: 30, height: 30, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", background: isUser ? "rgba(201,168,76,0.12)" : "rgba(255,255,255,0.05)", border: `1px solid ${isUser ? "#7a6230" : "#242424"}`, flexShrink: 0 }}>
                      {isUser ? <UserRound size={15} style={{ color: "#e8c96a" }} /> : <Bot size={15} style={{ color: "#c9a84c" }} />}
                    </div>
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
                  rows={2}
                  style={{ flex: 1, resize: "none", background: "rgba(255,255,255,0.04)", border: "1px solid #222", borderRadius: 12, padding: "12px 14px", fontSize: 14, color: "#fff", outline: "none", lineHeight: 1.6 }}
                />
                <button onClick={() => send()} disabled={sending || !input.trim()} style={{ width: 44, height: 44, borderRadius: 12, border: "1px solid #7a6230", background: "rgba(201,168,76,0.14)", color: "#e8c96a", display: "flex", alignItems: "center", justifyContent: "center", cursor: sending ? "default" : "pointer" }}>
                  <ArrowUp size={18} />
                </button>
              </div>
            </div>
          </section>
        </section>
      </main>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
