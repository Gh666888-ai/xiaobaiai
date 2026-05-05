"use client"

import { useState, useEffect, useRef } from "react"

export default function ChatPage() {
  const [msgs, setMsgs] = useState<any[]>([])
  const [input, setInput] = useState("")
  const [name, setName] = useState("")
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // 轮询消息
  useEffect(() => {
    async function poll() {
      try {
        // 取用户消息和 Claude 回复
        const [uRes, cRes] = await Promise.all([
          fetch("/api/chat?role=user&after=" + Date.now()),
          fetch("/api/chat?role=claude&after=" + Date.now())
        ])
        const userMsgs = await uRes.json()
        const claudeMsgs = await cRes.json()
        const all = [...userMsgs, ...claudeMsgs].sort((a, b) => a.time - b.time)
        if (all.length > 0) setMsgs(prev => {
          const ids = new Set(prev.map(m => m.time))
          const newOnes = all.filter(m => !ids.has(m.time))
          return prev.length > 50 ? [...prev.slice(-30), ...newOnes] : [...prev, ...newOnes]
        })
      } catch {}
    }
    poll()
    const iv = setInterval(poll, 3000)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }) }, [msgs])

  async function send() {
    if (!input.trim() || sending) return
    setSending(true)
    try {
      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "user", message: input.trim(), name: name || "我" })
      })
      setInput("")
    } catch (e) {
      setInput("发送失败: " + String(e))
    }
    setSending(false)
  }

  return (
    <div style={{ background: "#000", minHeight: "100dvh", color: "#ccc", fontFamily: "'Noto Sans SC', sans-serif", display: "flex", flexDirection: "column" }}>
      {/* 顶栏 */}
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #1a1a1a", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 6px #4ade80" }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Claude 对话</span>
        <span style={{ fontSize: 9, color: "#555", marginLeft: "auto" }}>xiaobaiai.cn</span>
      </div>

      {/* 消息列表 */}
      <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
        {msgs.length === 0 && (
          <div style={{ textAlign: "center", color: "#444", marginTop: "40vh", fontSize: 13 }}>
            在下方输入消息，Claude 会在这里回复
          </div>
        )}
        {msgs.map((m, i) => (
          <div key={m.time + "-" + i} style={{
            display: "flex", flexDirection: "column",
            alignItems: m.role === "user" ? "flex-end" : "flex-start"
          }}>
            <span style={{ fontSize: 9, color: "#555", marginBottom: 4 }}>
              {m.role === "user" ? m.name || "我" : "Claude"}
            </span>
            <div style={{
              maxWidth: "85%", padding: "10px 14px", borderRadius: 12,
              background: m.role === "user" ? "rgba(201,168,76,0.12)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${m.role === "user" ? "rgba(201,168,76,0.2)" : "#1a1a1a"}`,
              fontSize: 14, lineHeight: 1.7, color: "#ddd", wordBreak: "break-word"
            }}>
              {m.message}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* 输入栏 */}
      <div style={{ padding: "10px 12px", borderTop: "1px solid #1a1a1a", background: "#0a0a0a" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="你的名字（可选）"
            style={{ fontSize: 11, background: "transparent", border: "none", color: "#666", outline: "none", width: 120 }}
          />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder="输入消息..."
            autoFocus
            style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid #222", borderRadius: 10, padding: "10px 14px", fontSize: 14, color: "#fff", outline: "none" }}
          />
          <button
            onClick={send}
            disabled={sending}
            style={{ padding: "10px 18px", background: "rgba(201,168,76,0.12)", border: "1px solid #7a6230", borderRadius: 10, color: "#c9a84c", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
          >
            {sending ? "..." : "发送"}
          </button>
        </div>
      </div>
    </div>
  )
}
