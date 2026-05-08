// @ts-nocheck
"use client"

import { useRef, useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, BookOpen, CheckCircle2, Flag, MessageCircle, Route, Sparkles } from "lucide-react"
import { NavBar } from "@/components/NavBar"
import { useAuth } from "@/lib/AuthContext"
import { DAILY_ONLINE_XP_CAP } from "@/data/growth"

const SYMBOLS = [
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
  "Σ", "Δ", "Ω", "Ψ", "δ", "α", "β", "γ", "φ", "λ",
  "π", "∞", "±", "∂", "∫", "√", "≈", "≡", "∈", "⊕",
  "Θ", "Λ", "Φ", "Ξ", "Π", "Υ", "Ψ", "Ω",
  "+", "-", "×", "÷", "=", "≠", "<", ">", "≤", "≥",
  "∑", "∏", "∫", "∮", "∴", "∵", "⊥", "∥",
]

const taskEntrances = [
  { label: "写文章", href: "/start?goal=写文章", desc: "先产出一篇能发布的草稿" },
  { label: "做 PPT", href: "/start?goal=做PPT", desc: "把材料变成汇报结构" },
  { label: "做视频", href: "/start?goal=做视频", desc: "脚本、配图、发布检查" },
  { label: "做图片", href: "/start?goal=做图片", desc: "先生成一组可用封面" },
  { label: "学编程", href: "/start?goal=学编程", desc: "让 Agent 完成小功能" },
  { label: "搭 Agent", href: "/start?goal=搭Agent", desc: "先搭知识库或工作流" },
  { label: "做自动化", href: "/start?goal=做自动化", desc: "日报、提醒、审核流" },
  { label: "店铺用 AI", href: "/start?goal=店铺用AI", desc: "客服、营销、资料助手" },
]

const loopSteps = [
  { icon: <Flag size={18} />, title: "选目标", desc: "先说想做成什么，不先纠结工具名。" },
  { icon: <Route size={18} />, title: "做任务", desc: "从一个今天能完成的小环节开始。" },
  { icon: <Sparkles size={18} />, title: "拿奖励", desc: "完成任务、学习和复盘都能积累 XP。" },
  { icon: <MessageCircle size={18} />, title: "发复盘", desc: "把步骤、提示词和坑点沉淀成案例。" },
  { icon: <CheckCircle2 size={18} />, title: "下一阶段", desc: "小白记住进度，提醒你接着往前走。" },
]

const weeklyItems = [
  { title: "Claude Code 接 DeepSeek V4", desc: "工程 Agent + 国产模型后端，先完成一个小 diff。", href: "/claude-code-deepseek" },
  { title: "小公司 Agent 工具怎么选", desc: "Dify、Coze、n8n 从客服和自动化开始。", href: "/recommend/ai-agent-tools-for-small-business" },
  { title: "AI 编程 Agent 工具组合", desc: "Codex、Claude Code、Cursor 放到真实项目里比较。", href: "/recommend/ai-coding-agent-tools" },
  { title: "小红书 AI 内容流水线", desc: "选题、正文、配图、发布检查，先跑通一条内容。", href: "/recommend/ai-tools-for-xiaohongshu" },
]

const popularLinks = [
  { label: "AI工具大全", href: "/ai-tools" },
  { label: "工具选择器", href: "/choose-tool" },
  { label: "AI实战任务库", href: "/missions" },
  { label: "系统学习路线", href: "/learn" },
  { label: "模型排行", href: "/models" },
  { label: "AI实战案例", href: "/cases" },
  { label: "社区复盘", href: "/community" },
  { label: "工作流搭建器", href: "/workflows" },
  { label: "ChatGPT怎么用", href: "/chatgpt" },
  { label: "DeepSeek怎么用", href: "/deepseek" },
  { label: "Codex国内使用", href: "/codex" },
  { label: "Dify知识库", href: "/dify-knowledge-base" },
]

export default function HomePage() {
  const { user } = useAuth()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [registeredUsers, setRegisteredUsers] = useState<number | null>(null)

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.publicRegisteredUsers === "number") setRegisteredUsers(data.publicRegisteredUsers)
        else if (typeof data.registeredUsers === "number") setRegisteredUsers(data.registeredUsers)
      })
      .catch(() => undefined)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    let cols = Math.floor(window.innerWidth / 13)
    const drops: number[] = Array(cols).fill(0).map(() => Math.random() * -100)
    let paused = false

    function resize() {
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
    document.addEventListener("visibilitychange", () => { paused = document.hidden })
    const observer = new IntersectionObserver(([entry]) => { paused = !entry.isIntersecting }, { threshold: 0 })
    observer.observe(canvas)

    function draw() {
      if (paused) return
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
      observer.disconnect()
    }
  }, [])

  return (
    <div style={{ background: "#000", minHeight: "100vh", color: "#f0f0f0", fontFamily: "'Noto Sans SC', sans-serif", overflowX: "hidden" }}>
      <NavBar />

      <section style={{ position: "relative", minHeight: "92vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: "96px 24px 74px" }}>
        <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0 }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 120, background: "radial-gradient(ellipse 80% 100% at 50% 100%, rgba(201,168,76,0.12) 0%, transparent 70%)", zIndex: 1 }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent 0%, #7a6230 20%, #c9a84c 50%, #7a6230 80%, transparent 100%)", opacity: 0.4, zIndex: 1 }} />

        <div style={{ position: "relative", zIndex: 10, textAlign: "center", width: "min(100%, 980px)" }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.42em", color: "#7a6230", textTransform: "uppercase", marginBottom: 26, opacity: 0, animation: "fadeUp 0.8s ease forwards 0.25s" }}>Task-first AI Growth</p>
          <h1 style={{ fontSize: "clamp(58px, 10vw, 118px)", fontWeight: 950, lineHeight: 1, letterSpacing: "0.04em", color: "#fff", textShadow: "0 0 80px rgba(201,168,76,0.15), 0 0 160px rgba(201,168,76,0.05)", marginBottom: 26, opacity: 0, animation: "fadeUp 0.8s ease forwards 0.42s" }}>小白AI</h1>
          <div style={{ width: 0, height: 1, background: "linear-gradient(90deg, transparent, #c9a84c, transparent)", margin: "0 auto 28px", animation: "expandWidth 1s ease forwards 0.72s" }} />
          <p style={{ fontSize: "clamp(18px, 2.6vw, 28px)", fontWeight: 950, lineHeight: 1.55, color: "#fff", margin: "0 auto 10px", opacity: 0, animation: "fadeUp 0.8s ease forwards 0.9s" }}>中文新手用 AI 做成第一件事</p>
          <p style={{ fontSize: "clamp(13px, 1.5vw, 15px)", fontWeight: 400, lineHeight: 1.9, color: "rgba(255,255,255,0.54)", maxWidth: 680, margin: "0 auto 30px", opacity: 0, animation: "fadeUp 0.8s ease forwards 1.05s" }}>
            不从“哪个工具最强”开始，而是从“我今天想完成什么”开始。选目标、做任务、拿奖励、发复盘，小白陪你从 0 到 1。
          </p>

          <div style={{ maxWidth: 900, margin: "0 auto", opacity: 0, animation: "fadeUp 0.8s ease forwards 1.22s" }}>
            <p style={{ fontSize: 12, color: "#cdbb80", fontWeight: 950, marginBottom: 10, letterSpacing: "0.08em" }}>你现在最想完成什么？</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 9 }} className="home-task-grid">
              {taskEntrances.map((item) => (
                <Link key={item.href} href={item.href} style={{ textAlign: "left", textDecoration: "none", border: "1px solid rgba(201,168,76,0.3)", background: "rgba(7,7,7,0.84)", borderRadius: 10, padding: "13px 14px", minHeight: 74, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <span style={{ display: "block", color: "#fff", fontSize: 14, fontWeight: 950, marginBottom: 5 }}>{item.label}</span>
                  <span style={{ display: "block", color: "#929292", fontSize: 11, lineHeight: 1.5 }}>{item.desc}</span>
                </Link>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10, flexWrap: "wrap", marginTop: 18, opacity: 0, animation: "fadeUp 0.8s ease forwards 1.36s" }}>
            <Link href="/start" className="btn-primary" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
              开始第一个任务 <ArrowRight size={14} />
            </Link>
            <Link href="/learn" className="btn-outline" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
              看学习主线 <BookOpen size={14} />
            </Link>
            <button type="button" onClick={() => window.dispatchEvent(new Event("xiaobai:open-chat"))} className="btn-outline" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              直接问小白 <MessageCircle size={14} />
            </button>
          </div>

          <p style={{ marginTop: 14, color: "#9f8d57", fontSize: 12, lineHeight: 1.75, opacity: 0, animation: "fadeUp 0.8s ease forwards 1.5s" }}>
            {user ? `欢迎回来，${user.name} · ${user.xp} XP` : registeredUsers === null ? "完成第一个任务 +60XP，登录后小白会记住进度" : `已有 ${registeredUsers} 位用户加入成长系统`}
            <span style={{ color: "#6f6f6f" }}> · 在线每天最多 {DAILY_ONLINE_XP_CAP}XP</span>
          </p>
        </div>
      </section>

      <main style={{ position: "relative", zIndex: 5, background: "#000" }}>
        <section style={{ maxWidth: 1120, margin: "0 auto", padding: "76px clamp(16px,5vw,60px) 34px" }}>
          <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.3em", color: "#7a6230", textTransform: "uppercase", marginBottom: 10, fontWeight: 950 }}>Closed Loop</p>
          <div style={{ display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: 28, alignItems: "end", marginBottom: 22 }} className="home-two-col">
            <div>
              <h2 style={{ color: "#fff", fontSize: 32, fontWeight: 950, lineHeight: 1.25, marginBottom: 10 }}>从 0 到 1 的学习闭环</h2>
              <p style={{ color: "#aaa", fontSize: 14, lineHeight: 1.9 }}>首页不再把所有工具摊开给你看。小白AI只做一件事：把你的目标拆成今天能完成的一步，然后把这一步变成经验、案例和下一阶段。</p>
            </div>
            <Link href="/missions" className="btn-outline" style={{ justifySelf: "end", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
              查看任务库 <ArrowRight size={14} />
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,minmax(0,1fr))", gap: 10 }} className="home-loop-grid">
            {loopSteps.map((item, index) => (
              <div key={item.title} style={{ border: "1px solid #1a1a1a", background: "rgba(255,255,255,0.028)", borderRadius: 10, padding: "18px 18px", minHeight: 158 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 14 }}>
                  <span style={{ color: "#e8c96a", display: "inline-flex" }}>{item.icon}</span>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", color: "#4b4b4b", fontSize: 12, fontWeight: 950 }}>0{index + 1}</span>
                </div>
                <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 950, marginBottom: 8 }}>{item.title}</h3>
                <p style={{ color: "#999", fontSize: 12, lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ maxWidth: 1120, margin: "0 auto", padding: "44px clamp(16px,5vw,60px)" }}>
          <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 16, marginBottom: 18 }} className="home-section-head">
            <div>
              <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.3em", color: "#7a6230", textTransform: "uppercase", marginBottom: 10, fontWeight: 950 }}>This Week</p>
              <h2 style={{ color: "#fff", fontSize: 28, fontWeight: 950 }}>本周小白必看</h2>
            </div>
            <Link href="/news" style={{ color: "#c9a84c", fontSize: 13, fontWeight: 900, textDecoration: "none" }}>看 AI 资讯</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 10 }} className="home-week-grid">
            {weeklyItems.map((item) => (
              <Link key={item.href} href={item.href} style={{ textDecoration: "none", border: "1px solid #1a1a1a", background: "rgba(255,255,255,0.026)", borderRadius: 10, padding: "18px 18px", minHeight: 162, display: "flex", flexDirection: "column" }}>
                <h3 style={{ color: "#fff", fontSize: 15, fontWeight: 950, lineHeight: 1.45, marginBottom: 9 }}>{item.title}</h3>
                <p style={{ color: "#999", fontSize: 12, lineHeight: 1.7, flex: 1 }}>{item.desc}</p>
                <span style={{ color: "#c9a84c", fontSize: 12, fontWeight: 900, marginTop: 12, display: "inline-flex", alignItems: "center", gap: 5 }}>
                  打开 <ArrowRight size={13} />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section style={{ maxWidth: 1120, margin: "0 auto", padding: "36px clamp(16px,5vw,60px) 92px" }}>
          <div style={{ borderTop: "1px solid #171717", paddingTop: 28 }}>
            <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 950, marginBottom: 14 }}>常用入口</h2>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {popularLinks.map((item) => (
                <Link key={item.href} href={item.href} style={{ fontSize: 12, color: "#aaa", textDecoration: "none", border: "1px solid #202020", background: "rgba(255,255,255,0.025)", borderRadius: 999, padding: "8px 12px" }}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes expandWidth { to { width: 120px; } }
        @media (max-width: 900px) {
          .home-task-grid,
          .home-week-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
          .home-loop-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
          .home-two-col {
            grid-template-columns: 1fr !important;
          }
          .home-two-col a {
            justify-self: start !important;
          }
        }
        @media (max-width: 640px) {
          .home-task-grid,
          .home-week-grid,
          .home-loop-grid {
            grid-template-columns: 1fr !important;
          }
          .home-section-head {
            align-items: flex-start !important;
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}
