import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Bot, KeyRound, Search, ShieldCheck, TerminalSquare } from "lucide-react"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"
import { agentInstallGuides } from "@/data/agent-install-guides"

const desktopCategories = new Set(["桌面 AI 助理", "桌面知识库 Agent", "本地模型桌面应用"])
const desktopGuides = agentInstallGuides.filter((guide) => desktopCategories.has(guide.category))
const engineeringGuides = agentInstallGuides.filter((guide) => !desktopCategories.has(guide.category))

export const metadata: Metadata = {
  title: "主流Agent和桌面AI助理安装 - Claude Code、Codex、OpenClaw、ChatGPT Desktop、Cherry Studio教程",
  description: "小白AI整理主流工程 Agent 和桌面 AI 助理安装教程：Claude Code、OpenAI Codex、OpenClaw、Hermes、Cursor Agent、Cline、ChatGPT Desktop、Claude Desktop、Cherry Studio、Chatbox、AnythingLLM、LM Studio，一分钟直接跑通能用，并接入 DeepSeek V4、Kimi、OpenAI 等模型 API。",
  keywords: ["主流Agent安装", "桌面AI助理", "Claude Code安装", "Codex安装", "OpenClaw安装", "ChatGPT Desktop", "Cherry Studio", "DeepSeek V4 API接入"],
  alternates: { canonical: "/agent-install" },
  openGraph: {
    title: "主流Agent和桌面AI助理安装 | 小白AI",
    description: "每个 Agent / 桌面助理一个入口：先安装跑通，再接入 DeepSeek V4、Kimi、OpenAI 等模型 API。",
    url: "/agent-install",
    images: [{ url: "/xiaobai-mascot-cutout.png", alt: "小白AI 主流Agent安装" }],
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "主流Agent和桌面AI助理安装",
  description: "Claude Code、Codex、OpenClaw、Hermes、Cursor Agent、Cline、ChatGPT Desktop、Claude Desktop、Cherry Studio、Chatbox、AnythingLLM、LM Studio 安装和模型 API 接入教程。",
  url: "https://www.xiaobaiai.cn/agent-install",
  inLanguage: "zh-CN",
  mainEntity: {
    "@type": "ItemList",
    itemListElement: agentInstallGuides.map((guide, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: guide.name,
      url: `https://www.xiaobaiai.cn/agent-install/${guide.slug}`,
    })),
  },
}

export default function AgentInstallPage() {
  return (
    <div style={{ background: "#000", minHeight: "100vh", fontFamily: "'Noto Sans SC', sans-serif", position: "relative", overflow: "hidden" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MathRain />
      <NavBar />
      <main style={{ maxWidth: 1120, margin: "0 auto", padding: "64px clamp(16px,5vw,60px) 104px", position: "relative", zIndex: 10, background: "rgba(0,0,0,0.91)" }}>
        <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.34em", color: "#7a6230", textTransform: "uppercase", marginBottom: 12, fontWeight: 950 }}>Agent Install</p>
        <h1 style={{ color: "#fff", fontSize: 42, fontWeight: 950, lineHeight: 1.2, marginBottom: 14 }}>主流Agent和桌面AI助理安装：先跑通，再接模型 API</h1>
        <p style={{ color: "#ccc", fontSize: 16, lineHeight: 1.9, maxWidth: 880, marginBottom: 22 }}>
          这里不把模型当 Agent。Claude Code、Codex、OpenClaw、Hermes、Cursor、Cline 是能执行任务的 Agent；ChatGPT Desktop、Claude Desktop、Cherry Studio、Chatbox、AnythingLLM、LM Studio 是桌面 AI 助理或模型客户端；DeepSeek V4、Kimi、OpenAI 是它们下面要接的模型 API。
        </p>

        <form action="/search" style={{ display: "flex", alignItems: "center", maxWidth: 720, minHeight: 46, border: "1px solid rgba(201,168,76,0.28)", background: "rgba(8,8,8,0.92)", borderRadius: 10, marginBottom: 28 }}>
          <Search size={16} style={{ marginLeft: 14, color: "#c9a84c", flexShrink: 0 }} />
          <input
            name="q"
            type="search"
            placeholder="搜索：Claude Code、Cherry Studio、Chatbox、LM Studio"
            style={{ flex: 1, minWidth: 0, border: 0, outline: 0, background: "transparent", color: "#fff", padding: "0 12px", fontSize: 14, fontWeight: 800, fontFamily: "'Noto Sans SC', sans-serif" }}
          />
          <button type="submit" style={{ marginRight: 6, height: 34, padding: "0 14px", border: "1px solid #7a6230", borderRadius: 8, background: "rgba(201,168,76,0.13)", color: "#e8c96a", fontSize: 12, fontWeight: 950, cursor: "pointer" }}>搜索</button>
        </form>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,260px),1fr))", gap: 12, marginBottom: 34 }}>
          {[
            { icon: <TerminalSquare size={18} />, title: "先安装", desc: "每个教程先让小白复制最少命令，看到版本号或能回答再继续。" },
            { icon: <KeyRound size={18} />, title: "再接 API", desc: "教程底部统一放 DeepSeek、Kimi、OpenAI 等模型接口填法。" },
            { icon: <ShieldCheck size={18} />, title: "不乱填 Key", desc: "API Key 等同支付密钥，不发群、不写仓库、不交给陌生中转站。" },
          ].map((item) => (
            <div key={item.title} style={{ border: "1px solid #1a1a1a", background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "18px 20px" }}>
              <div style={{ color: "#e8c96a", marginBottom: 10 }}>{item.icon}</div>
              <h2 style={{ color: "#fff", fontSize: 17, fontWeight: 950, marginBottom: 8 }}>{item.title}</h2>
              <p style={{ color: "#bbb", fontSize: 13, lineHeight: 1.75 }}>{item.desc}</p>
            </div>
          ))}
        </section>

        <section style={{ marginBottom: 42 }}>
          <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
            <div>
              <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 950, lineHeight: 1.35, marginBottom: 8 }}>选择你要安装的 Agent 或桌面助理</h2>
              <p style={{ color: "#aaa", fontSize: 14, lineHeight: 1.8 }}>每个按钮点进去就是小白安装教程，能接 API 的教程下面会放接口配置；官方账号型桌面版会直接说明不能乱填第三方 Key。</p>
            </div>
            <Link href="/tutorials" className="btn-outline" style={{ textDecoration: "none" }}>全部教程</Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))", gap: 14 }}>
            {engineeringGuides.map((guide) => (
              <Link key={guide.slug} href={`/agent-install/${guide.slug}`} style={{ textDecoration: "none", border: "1px solid #2a1f10", background: "rgba(201,168,76,0.052)", borderRadius: 10, padding: "20px 22px", minHeight: 244, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 14 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "#e8c96a", fontSize: 12, fontWeight: 950 }}>
                    <Bot size={15} /> {guide.category}
                  </span>
                  <span style={{ color: "#999", fontSize: 11, fontWeight: 900 }}>{guide.minutes}</span>
                </div>
                <h3 style={{ color: "#fff", fontSize: 21, fontWeight: 950, lineHeight: 1.35, marginBottom: 9 }}>{guide.name}</h3>
                <p style={{ color: "#cfcfcf", fontSize: 13, lineHeight: 1.8, marginBottom: 12 }}>{guide.tagline}</p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                  {guide.bestFor.slice(0, 3).map((item) => (
                    <span key={item} className="tag tag-gold" style={{ fontSize: 11, color: "#e8c96a", fontWeight: 900 }}>{item}</span>
                  ))}
                </div>
                <span style={{ marginTop: "auto", color: "#e8c96a", fontSize: 13, fontWeight: 950, display: "inline-flex", alignItems: "center", gap: 8 }}>
                  查看安装教程 <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 42 }}>
          <div style={{ marginBottom: 16 }}>
            <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 950, lineHeight: 1.35, marginBottom: 8 }}>桌面版 AI 助理应用</h2>
            <p style={{ color: "#aaa", fontSize: 14, lineHeight: 1.8 }}>
              不想先碰终端，就先从这些桌面软件开始。能接 API 的会教你填 DeepSeek、Kimi、OpenAI；官方账号型应用会明确告诉你不能填第三方 Key。
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))", gap: 14 }}>
            {desktopGuides.map((guide) => (
              <Link key={guide.slug} href={`/agent-install/${guide.slug}`} style={{ textDecoration: "none", border: "1px solid rgba(82,148,139,0.28)", background: "rgba(82,148,139,0.055)", borderRadius: 10, padding: "20px 22px", minHeight: 244, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 14 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "#8fd8cc", fontSize: 12, fontWeight: 950 }}>
                    <Bot size={15} /> {guide.category}
                  </span>
                  <span style={{ color: "#999", fontSize: 11, fontWeight: 900 }}>{guide.minutes}</span>
                </div>
                <h3 style={{ color: "#fff", fontSize: 21, fontWeight: 950, lineHeight: 1.35, marginBottom: 9 }}>{guide.name}</h3>
                <p style={{ color: "#cfcfcf", fontSize: 13, lineHeight: 1.8, marginBottom: 12 }}>{guide.tagline}</p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                  {guide.bestFor.slice(0, 3).map((item) => (
                    <span key={item} className="tag" style={{ borderColor: "rgba(82,148,139,0.38)", color: "#9ee5d9", fontSize: 11, fontWeight: 900 }}>{item}</span>
                  ))}
                </div>
                <span style={{ marginTop: "auto", color: "#8fd8cc", fontSize: 13, fontWeight: 950, display: "inline-flex", alignItems: "center", gap: 8 }}>
                  查看安装教程 <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section style={{ border: "1px solid #2a1f10", background: "rgba(201,168,76,0.04)", borderRadius: 12, padding: "24px 26px" }}>
          <h2 style={{ color: "#fff", fontSize: 21, fontWeight: 950, marginBottom: 10 }}>小白怎么选第一款？</h2>
          <p style={{ color: "#ccc", fontSize: 14, lineHeight: 1.9, marginBottom: 16 }}>
            完全不会终端，先选 ChatGPT Desktop、Claude Desktop、Cherry Studio 或 Chatbox；想接 DeepSeek V4 做代码任务，先选 OpenClaw 或 Cline；已经能用终端和 Git，再选 Claude Code 或 Codex。
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href="/agent-install/openclaw" className="btn-primary" style={{ textDecoration: "none" }}>国内新手先跑 OpenClaw</Link>
            <Link href="/agent-install/claude-code" className="btn-outline" style={{ textDecoration: "none" }}>Claude Code 教程</Link>
            <Link href="/agent-install/cline" className="btn-outline" style={{ textDecoration: "none" }}>Cline 教程</Link>
          </div>
        </section>
      </main>
    </div>
  )
}
