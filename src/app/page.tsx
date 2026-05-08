"use client"

import { useEffect, useRef } from "react"
import { Search } from "lucide-react"
import { NavBar } from "@/components/NavBar"
import { LevelBadge } from "@/components/LevelBadge"
import { useAuth } from "@/lib/AuthContext"

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

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    let cols = Math.floor(window.innerWidth / 13)
    const drops: number[] = []
    let paused = false

    function resize() {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      cols = Math.floor(canvas.width / 13)
      drops.length = cols
      for (let i = 0; i < cols; i++) {
        if (drops[i] === undefined) drops[i] = Math.random() * (canvas.height / 13)
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
      ctx.fillStyle = "rgba(0,0,0,0.052)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < drops.length; i++) {
        const char = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
        const x = i * 13
        const y = drops[i] * 13
        const depth = y / canvas.height
        const alpha = 0.16 + depth * 0.46
        const bright = Math.floor(depth * 150 + 76)
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

  return (
    <div style={{ background: "#000", minHeight: "100vh", color: "#f0f0f0", fontFamily: "'Noto Sans SC', sans-serif", overflowX: "hidden" }}>
      <NavBar />

      <section style={{ position: "relative", minHeight: "calc(100vh - 56px)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: "82px 24px 72px" }}>
        <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0 }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 120, background: "radial-gradient(ellipse 80% 100% at 50% 100%, rgba(201,168,76,0.12) 0%, transparent 70%)", zIndex: 1 }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent 0%, #7a6230 20%, #c9a84c 50%, #7a6230 80%, transparent 100%)", opacity: 0.4, zIndex: 1 }} />

        <div style={{ position: "relative", zIndex: 10, width: "min(100%, 920px)", textAlign: "center" }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.42em", color: "#7a6230", textTransform: "uppercase", marginBottom: 24, opacity: 0, animation: "fadeUp 0.8s ease forwards 0.2s" }}>XIAOBAI AGENT ONLINE</p>
          <h1 style={{ fontSize: "clamp(56px, 10vw, 118px)", fontWeight: 950, lineHeight: 1, letterSpacing: 0, color: "#fff", textShadow: "0 0 80px rgba(201,168,76,0.16), 0 0 160px rgba(201,168,76,0.06)", marginBottom: 24, opacity: 0, animation: "fadeUp 0.8s ease forwards 0.36s" }}>小白AI</h1>
          <div style={{ width: 0, height: 1, background: "linear-gradient(90deg, transparent, #c9a84c, transparent)", margin: "0 auto 26px", animation: "expandWidth 1s ease forwards 0.62s" }} />
          <p style={{ fontSize: "clamp(22px, 3.2vw, 38px)", fontWeight: 950, lineHeight: 1.45, color: "#fff", maxWidth: 820, margin: "0 auto 22px", opacity: 0, animation: "fadeUp 0.8s ease forwards 0.82s" }}>
            我们立志让所有不懂 AI 的人，1 小时内成熟利用 AI 完成工作
          </p>
          <p style={{ fontSize: 13, fontWeight: 850, lineHeight: 1.8, color: "#b9a463", maxWidth: 620, margin: "0 auto 20px", opacity: 0, animation: "fadeUp 0.8s ease forwards 0.96s" }}>
            AI时代来了，学会利用AI能让你领先百分之九十的人
          </p>

          {user ? (
            <div style={{ marginTop: 14, marginBottom: 22, color: "#8e7d4b", fontSize: 12, lineHeight: 1.75, opacity: 0, animation: "fadeUp 0.8s ease forwards 1.08s", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
              <span>欢迎回来</span>
              <LevelBadge name={user.name} xp={user.xp} compact />
            </div>
          ) : null}

          <form action="/search" style={{ display: "flex", alignItems: "center", background: "rgba(8,8,8,0.86)", border: "1px solid rgba(201,168,76,0.22)", borderRadius: 10, maxWidth: 620, margin: user ? "0 auto" : "24px auto 0", opacity: 0, animation: "fadeUp 0.8s ease forwards 1.32s" }}>
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
