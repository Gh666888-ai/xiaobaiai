"use client"

import { useEffect, useRef, useState } from "react"
import { Search } from "lucide-react"
import { NavBar } from "@/components/NavBar"
import { useAuth } from "@/lib/AuthContext"
import { getNextLevel } from "@/data/user"

const SYMBOLS = [
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
  "Σ", "Δ", "Ω", "Ψ", "δ", "α", "β", "γ", "φ", "λ",
  "π", "∞", "±", "∂", "∫", "√", "≈", "≡", "∈", "⊕",
  "Θ", "Λ", "Φ", "Ξ", "Π", "Υ", "Ψ", "Ω",
  "+", "-", "×", "÷", "=", "≠", "<", ">", "≤", "≥",
  "∑", "∏", "∫", "∮", "∴", "∵", "⊥", "∥",
]

export default function HomePage() {
  const { user } = useAuth()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [pulseText, setPulseText] = useState("正在等待你登录")
  const homeXPLabel = user ? (getNextLevel(user.xp) ? `${user.xp} XP` : "已达最高档") : ""

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    let cols = Math.floor(window.innerWidth / 13)
    const drops: number[] = Array(cols).fill(0).map(() => Math.random() * -100)
    let paused = false

    function resize() {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      cols = Math.floor(canvas.width / 13)
      if (drops.length < cols) {
        drops.length = cols
        for (let i = 0; i < cols; i++) if (drops[i] === undefined) drops[i] = Math.random() * -100
      }
    }

    resize()
    window.addEventListener("resize", resize)
    const onVisibilityChange = () => { paused = document.hidden }
    document.addEventListener("visibilitychange", onVisibilityChange)
    const observer = new IntersectionObserver(([entry]) => { paused = !entry.isIntersecting }, { threshold: 0 })
    observer.observe(canvas)

    function draw() {
      if (paused || !ctx || !canvas) return
      ctx.fillStyle = "rgba(0,0,0,0.06)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < drops.length; i++) {
        const char = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
        const x = i * 13
        const y = drops[i] * 13
        const depth = y / canvas.height
        const alpha = 0.12 + depth * 0.5
        const bright = Math.floor(depth * 160 + 60)
        ctx.fillStyle = `rgba(${bright},${bright * 0.75},${bright * 0.3},${alpha})`
        ctx.font = "13px JetBrains Mono, monospace"
        ctx.fillText(char, x, y)
        if (y > canvas.height && Math.random() > 0.975) drops[i] = 0
        drops[i]++
      }
    }

    const interval = window.setInterval(draw, 50)
    draw()
    return () => {
      window.clearInterval(interval)
      window.removeEventListener("resize", resize)
      document.removeEventListener("visibilitychange", onVisibilityChange)
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    const lines = user
      ? ["读取你的任务状态", "准备询问行业目标", "生成下一步学习路线"]
      : ["正在等待你登录", "登录后记住你的行业", "小白会制定接下来的一切"]
    let index = 0
    setPulseText(lines[0])
    const timer = window.setInterval(() => {
      index = (index + 1) % lines.length
      setPulseText(lines[index])
    }, 2200)
    return () => window.clearInterval(timer)
  }, [user])

  return (
    <div style={{ background: "#000", minHeight: "100vh", color: "#f0f0f0", fontFamily: "'Noto Sans SC', sans-serif", overflowX: "hidden" }}>
      <NavBar />

      <section style={{ position: "relative", minHeight: "calc(100vh - 56px)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: "82px 24px 72px" }}>
        <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0 }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 48%, rgba(201,168,76,0.12), transparent 34%), linear-gradient(180deg, rgba(0,0,0,0.25), #000 86%)", zIndex: 1 }} />
        <div style={{ position: "absolute", left: "50%", top: "52%", width: "min(720px,86vw)", aspectRatio: "1", transform: "translate(-50%,-50%)", border: "1px solid rgba(201,168,76,0.18)", borderRadius: "50%", boxShadow: "0 0 90px rgba(201,168,76,0.1)", zIndex: 1 }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent 0%, #7a6230 20%, #c9a84c 50%, #7a6230 80%, transparent 100%)", opacity: 0.48, zIndex: 1 }} />

        <div style={{ position: "relative", zIndex: 10, width: "min(100%, 920px)", textAlign: "center" }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.42em", color: "#7a6230", textTransform: "uppercase", marginBottom: 24, opacity: 0, animation: "fadeUp 0.8s ease forwards 0.2s" }}>XIAOBAI AGENT ONLINE</p>
          <h1 style={{ fontSize: "clamp(56px, 10vw, 118px)", fontWeight: 950, lineHeight: 1, letterSpacing: 0, color: "#fff", textShadow: "0 0 80px rgba(201,168,76,0.16), 0 0 160px rgba(201,168,76,0.06)", marginBottom: 24, opacity: 0, animation: "fadeUp 0.8s ease forwards 0.36s" }}>小白AI</h1>
          <div style={{ width: 0, height: 1, background: "linear-gradient(90deg, transparent, #c9a84c, transparent)", margin: "0 auto 26px", animation: "expandWidth 1s ease forwards 0.62s" }} />
          <p style={{ fontSize: "clamp(20px, 3vw, 34px)", fontWeight: 950, lineHeight: 1.45, color: "#fff", margin: "0 auto 12px", opacity: 0, animation: "fadeUp 0.8s ease forwards 0.82s" }}>
            先登录，然后让小白制定接下来的一切
          </p>
          <p style={{ fontSize: "clamp(14px, 1.6vw, 16px)", lineHeight: 1.9, color: "rgba(255,255,255,0.58)", maxWidth: 660, margin: "0 auto 28px", opacity: 0, animation: "fadeUp 0.8s ease forwards 0.98s" }}>
            不再让新手先面对一堆工具和任务。你登录后，小白会先问行业和目标，再按你的方向给出 AI 工具、学习路线、实战任务和完成检查。
          </p>

          <div style={{ display: "inline-flex", alignItems: "center", gap: 9, border: "1px solid rgba(201,168,76,0.3)", background: "rgba(8,8,8,0.84)", borderRadius: 999, padding: "8px 13px", color: "#cdbb80", fontSize: 12, fontWeight: 900, marginBottom: 22, opacity: 0, animation: "fadeUp 0.8s ease forwards 1.08s" }}>
            <span style={{ width: 7, height: 7, borderRadius: 999, background: "#e8c96a", boxShadow: "0 0 18px rgba(232,201,106,0.8)" }} />
            {pulseText}
          </div>

          <section style={{ maxWidth: 680, margin: "0 auto", border: "1px solid rgba(201,168,76,0.18)", background: "rgba(6,6,6,0.66)", borderRadius: 12, padding: "22px clamp(16px,4vw,26px)", textAlign: "left", opacity: 0, animation: "fadeUp 0.8s ease forwards 1.18s" }}>
            <p style={{ color: "#e8c96a", fontSize: 12, fontWeight: 950, marginBottom: 10 }}>小白：</p>
            <p style={{ color: "#fff", fontSize: "clamp(17px,2.4vw,22px)", lineHeight: 1.75, fontWeight: 850, marginBottom: 12 }}>
              {user ? "我已经在右下角了。点我一下，告诉我你的行业和想做成的事，我来给你排下一步。" : "先跟我打个招呼也行。你还没登录时，我会先带你去注册；登录后，我会记住你的行业和任务进度。"}
            </p>
            <p style={{ color: "#9b9b9b", fontSize: 13, lineHeight: 1.8 }}>
              我不会让你先看一堆教程。你说目标，我问清楚，再把工具、教程和任务按顺序给你。
            </p>
          </section>

          <p style={{ marginTop: 14, color: "#8e7d4b", fontSize: 12, lineHeight: 1.75, opacity: 0, animation: "fadeUp 0.8s ease forwards 1.28s" }}>
            {user ? `欢迎回来，${user.name} · ${homeXPLabel}` : "注册后小白会记住你的行业、目标和任务进度"}
          </p>

          <form action="/search" style={{ display: "flex", alignItems: "center", background: "rgba(8,8,8,0.86)", border: "1px solid rgba(201,168,76,0.22)", borderRadius: 10, maxWidth: 620, margin: "24px auto 0", opacity: 0, animation: "fadeUp 0.8s ease forwards 1.32s" }}>
            <Search size={15} style={{ marginLeft: 14, color: "#777", flexShrink: 0 }} />
            <input
              name="q"
              type="search"
              placeholder="搜索教程、资讯、工具：Claude Code、AI PPT、Dify、绘图"
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", padding: "12px 14px", fontSize: 13, fontWeight: 600, color: "#fff", fontFamily: "'Noto Sans SC', sans-serif", minWidth: 0 }}
            />
            <button type="submit" style={{ marginRight: 6, height: 34, padding: "0 14px", borderRadius: 8, border: "1px solid #7a6230", background: "rgba(201,168,76,0.12)", color: "#e8c96a", fontSize: 12, fontWeight: 950, cursor: "pointer" }}>搜索</button>
          </form>

        </div>
      </section>

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes expandWidth { to { width: 120px; } }
      `}</style>
    </div>
  )
}
