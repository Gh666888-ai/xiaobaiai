// @ts-nocheck
"use client"

import { useRef, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowRight, BookOpen, CheckCircle2, Flag, MessageCircle, Route, Search, Sparkles } from "lucide-react"
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
  { label: "写文章", href: "/start?goal=写文章", desc: "生成一篇可修改草稿", meta: "10 分钟 · 免费可做" },
  { label: "做 PPT", href: "/start?goal=做PPT", desc: "把材料变成 6 页汇报", meta: "15 分钟 · 适合零基础" },
  { label: "做视频", href: "/start?goal=做视频", desc: "生成脚本和分镜", meta: "20 分钟 · 短视频起步" },
  { label: "做图片", href: "/start?goal=做图片", desc: "做一张封面/海报", meta: "10 分钟 · 中文提示词" },
  { label: "学编程", href: "/start?goal=学编程", desc: "让 AI 改一个小功能", meta: "30 分钟 · 真实项目" },
  { label: "搭 Agent", href: "/start?goal=搭Agent", desc: "做一个知识库问答", meta: "45 分钟 · 可上线测试" },
  { label: "做自动化", href: "/start?goal=做自动化", desc: "做一个每日自动简报", meta: "45 分钟 · 半自动先跑通" },
  { label: "店铺用 AI", href: "/start?goal=店铺用AI", desc: "做一套营销/客服素材", meta: "30 分钟 · 门店可用" },
]

const loopSteps = [
  { icon: <Flag size={18} />, title: "选目标", desc: "先说想做成什么，不先纠结工具名。" },
  { icon: <Route size={18} />, title: "做任务", desc: "从一个今天能完成的小环节开始。" },
  { icon: <Sparkles size={18} />, title: "拿奖励", desc: "完成任务、学习和复盘都能积累 XP。" },
  { icon: <MessageCircle size={18} />, title: "发复盘", desc: "把步骤、提示词和坑点沉淀成案例。" },
  { icon: <CheckCircle2 size={18} />, title: "下一阶段", desc: "小白记住进度，提醒你接着往前走。" },
]

const weeklyItems = [
  { tag: "本周更新", title: "Claude Code 接 DeepSeek V4", desc: "工程 Agent + 国产模型后端，先完成一个小 diff。", href: "/claude-code-deepseek" },
  { tag: "小公司可用", title: "小公司 Agent 工具怎么选", desc: "Dify、Coze、n8n 从客服和自动化开始。", href: "/recommend/ai-agent-tools-for-small-business" },
  { tag: "编程 Agent", title: "AI 编程 Agent 工具组合", desc: "Codex、Claude Code、Cursor 放到真实项目里比较。", href: "/recommend/ai-coding-agent-tools" },
  { tag: "免费优先", title: "小红书 AI 内容流水线", desc: "选题、正文、配图、发布检查，先跑通一条内容。", href: "/recommend/ai-tools-for-xiaohongshu" },
]

const trustSignals = [
  { value: "1000+", label: "AI 工具线索" },
  { value: "800+", label: "可访问工具页" },
  { value: "100+", label: "资讯/教程沉淀" },
  { value: "2026.05", label: "持续更新" },
]

const starterPaths = [
  { title: "完全新手", desc: "先做一个 10 分钟任务，再补学习路线。", href: "/start" },
  { title: "有明确工具", desc: "直接搜 Dify、DeepSeek、PPT、AI 绘图等关键词。", href: "/search" },
  { title: "想做项目", desc: "从任务库开始，做完后发复盘进入案例库。", href: "/missions" },
]

const popularGroups = [
  {
    title: "新手入门",
    links: [
      { label: "开始", href: "/start" },
      { label: "学习路径", href: "/learn" },
      { label: "工具选择器", href: "/choose-tool" },
      { label: "免费AI工具", href: "/free-ai-tools" },
    ],
  },
  {
    title: "找工具",
    links: [
      { label: "AI工具大全", href: "/ai-tools" },
      { label: "模型排行", href: "/models" },
      { label: "ChatGPT怎么用", href: "/chatgpt" },
      { label: "DeepSeek怎么用", href: "/deepseek" },
    ],
  },
  {
    title: "做项目",
    links: [
      { label: "任务库", href: "/missions" },
      { label: "案例库", href: "/cases" },
      { label: "工作流", href: "/workflows" },
      { label: "社区复盘", href: "/community" },
    ],
  },
]

export default function HomePage() {
  const router = useRouter()
  const { user } = useAuth()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [registeredUsers, setRegisteredUsers] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  function goSearch(e?: React.KeyboardEvent) {
    if (e && e.key !== "Enter") return
    if (!searchQuery.trim()) return
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
  }

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

      <section style={{ position: "relative", minHeight: "94vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: "92px 24px 58px" }}>
        <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0 }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 120, background: "radial-gradient(ellipse 80% 100% at 50% 100%, rgba(201,168,76,0.12) 0%, transparent 70%)", zIndex: 1 }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent 0%, #7a6230 20%, #c9a84c 50%, #7a6230 80%, transparent 100%)", opacity: 0.4, zIndex: 1 }} />

        <div style={{ position: "relative", zIndex: 10, textAlign: "center", width: "min(100%, 980px)" }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.42em", color: "#7a6230", textTransform: "uppercase", marginBottom: 26, opacity: 0, animation: "fadeUp 0.8s ease forwards 0.25s" }}>Task-first AI Growth</p>
          <h1 style={{ fontSize: "clamp(58px, 10vw, 118px)", fontWeight: 950, lineHeight: 1, letterSpacing: "0.04em", color: "#fff", textShadow: "0 0 80px rgba(201,168,76,0.15), 0 0 160px rgba(201,168,76,0.05)", marginBottom: 26, opacity: 0, animation: "fadeUp 0.8s ease forwards 0.42s" }}>小白AI</h1>
          <div style={{ width: 0, height: 1, background: "linear-gradient(90deg, transparent, #c9a84c, transparent)", margin: "0 auto 28px", animation: "expandWidth 1s ease forwards 0.72s" }} />
          <p style={{ fontSize: "clamp(18px, 2.6vw, 28px)", fontWeight: 950, lineHeight: 1.55, color: "#fff", margin: "0 auto 10px", opacity: 0, animation: "fadeUp 0.8s ease forwards 0.9s" }}>中文新手用 AI 做成第一件事</p>
          <p style={{ fontSize: "clamp(13px, 1.5vw, 15px)", fontWeight: 400, lineHeight: 1.9, color: "rgba(255,255,255,0.54)", maxWidth: 680, margin: "0 auto 30px", opacity: 0, animation: "fadeUp 0.8s ease forwards 1.05s" }}>
            不知道用哪个 AI？先告诉小白你想做什么，今天就完成一个可交付任务。选目标、做任务、拿奖励、发复盘，小白陪你从 0 到 1。
          </p>

          <div style={{ maxWidth: 620, margin: "0 auto 18px", opacity: 0, animation: "fadeUp 0.8s ease forwards 1.16s", position: "relative", zIndex: 30 }}>
            <div style={{ display: "flex", alignItems: "center", background: "rgba(8,8,8,0.94)", border: "1px solid #2a2a2a", borderRadius: 10 }}>
              <Search size={15} style={{ marginLeft: 14, color: "#777", flexShrink: 0 }} />
              <input
                type="text"
                placeholder="搜工具、教程、模型、案例，例如：Dify、PPT、DeepSeek、AI绘图"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onKeyDown={goSearch}
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", padding: "12px 14px", fontSize: 13, fontWeight: 600, color: "#fff", fontFamily: "'Noto Sans SC', sans-serif", minWidth: 0 }}
              />
              <button type="button" onClick={() => goSearch()} disabled={!searchQuery.trim()} style={{ marginRight: 6, height: 34, padding: "0 14px", borderRadius: 8, border: "1px solid #7a6230", background: "rgba(201,168,76,0.12)", color: "#e8c96a", fontSize: 12, fontWeight: 950, cursor: searchQuery.trim() ? "pointer" : "default", opacity: searchQuery.trim() ? 1 : 0.45 }}>搜索</button>
            </div>
          </div>

          <div style={{ maxWidth: 900, margin: "0 auto", opacity: 0, animation: "fadeUp 0.8s ease forwards 1.25s" }}>
            <p style={{ fontSize: 12, color: "#cdbb80", fontWeight: 950, marginBottom: 10, letterSpacing: "0.08em" }}>你现在最想完成什么？</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 9 }} className="home-task-grid">
              {taskEntrances.map((item) => (
                <Link key={item.href} href={item.href} style={{ textAlign: "left", textDecoration: "none", border: "1px solid rgba(201,168,76,0.3)", background: "rgba(7,7,7,0.84)", borderRadius: 10, padding: "12px 13px", minHeight: 88, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <span style={{ display: "block", color: "#fff", fontSize: 14, fontWeight: 950, marginBottom: 5 }}>{item.label}</span>
                  <span style={{ display: "block", color: "#bdbdbd", fontSize: 12, lineHeight: 1.45, marginBottom: 6 }}>{item.desc}</span>
                  <span style={{ display: "inline-flex", width: "fit-content", color: "#cdbb80", border: "1px solid rgba(201,168,76,0.24)", borderRadius: 999, padding: "3px 7px", fontSize: 10, fontWeight: 900 }}>{item.meta}</span>
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

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 8, maxWidth: 760, margin: "15px auto 0", opacity: 0, animation: "fadeUp 0.8s ease forwards 1.58s" }} className="home-trust-grid">
            {trustSignals.map((item) => (
              <div key={item.label} style={{ border: "1px solid #1d1d1d", background: "rgba(0,0,0,0.35)", borderRadius: 9, padding: "10px 12px" }}>
                <p style={{ color: "#e8c96a", fontSize: 16, fontWeight: 950, fontFamily: "'JetBrains Mono',monospace", marginBottom: 3 }}>{item.value}</p>
                <p style={{ color: "#888", fontSize: 11, fontWeight: 800 }}>{item.label}</p>
              </div>
            ))}
          </div>
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
                <span style={{ width: "fit-content", border: "1px solid rgba(201,168,76,0.28)", borderRadius: 999, color: "#cdbb80", fontSize: 10, fontWeight: 950, padding: "4px 8px", marginBottom: 10 }}>{item.tag}</span>
                <h3 style={{ color: "#fff", fontSize: 15, fontWeight: 950, lineHeight: 1.45, marginBottom: 9 }}>{item.title}</h3>
                <p style={{ color: "#999", fontSize: 12, lineHeight: 1.7, flex: 1 }}>{item.desc}</p>
                <span style={{ color: "#c9a84c", fontSize: 12, fontWeight: 900, marginTop: 12, display: "inline-flex", alignItems: "center", gap: 5 }}>
                  打开 <ArrowRight size={13} />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section style={{ maxWidth: 1120, margin: "0 auto", padding: "34px clamp(16px,5vw,60px)" }}>
          <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.3em", color: "#7a6230", textTransform: "uppercase", marginBottom: 10, fontWeight: 950 }}>Three Paths</p>
          <h2 style={{ color: "#fff", fontSize: 26, fontWeight: 950, marginBottom: 16 }}>新手最常走的 3 条路</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 10 }} className="home-path-grid">
            {starterPaths.map((item) => (
              <Link key={item.href} href={item.href} style={{ textDecoration: "none", border: "1px solid #1a1a1a", borderRadius: 10, background: "rgba(255,255,255,0.026)", padding: "18px 18px", minHeight: 136 }}>
                <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 950, marginBottom: 8 }}>{item.title}</h3>
                <p style={{ color: "#aaa", fontSize: 13, lineHeight: 1.7, marginBottom: 12 }}>{item.desc}</p>
                <span style={{ color: "#c9a84c", fontSize: 12, fontWeight: 900, display: "inline-flex", alignItems: "center", gap: 5 }}>进入 <ArrowRight size={13} /></span>
              </Link>
            ))}
          </div>
        </section>

        <section style={{ maxWidth: 1120, margin: "0 auto", padding: "36px clamp(16px,5vw,60px) 92px" }}>
          <div style={{ borderTop: "1px solid #171717", paddingTop: 28 }}>
            <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 950, marginBottom: 14 }}>常用入口</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 14 }} className="home-link-groups">
              {popularGroups.map((group) => (
                <div key={group.title} style={{ border: "1px solid #181818", borderRadius: 10, background: "rgba(255,255,255,0.018)", padding: "16px 16px" }}>
                  <h3 style={{ color: "#fff", fontSize: 14, fontWeight: 950, marginBottom: 11 }}>{group.title}</h3>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {group.links.map((item) => (
                      <Link key={item.href} href={item.href} style={{ fontSize: 12, color: "#aaa", textDecoration: "none", border: "1px solid #202020", background: "rgba(255,255,255,0.025)", borderRadius: 999, padding: "7px 10px" }}>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
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
          .home-week-grid,
          .home-trust-grid {
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
          .home-path-grid,
          .home-link-groups {
            grid-template-columns: 1fr !important;
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
