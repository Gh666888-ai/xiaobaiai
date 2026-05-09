import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Search, ShieldCheck } from "lucide-react"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"
import { LiveEvaluationNotice } from "@/components/LiveEvaluationNotice"
import { agentInstallGuides } from "@/data/agent-install-guides"

const agentDesktopCategories = new Set(["Agent 桌面应用"])
const desktopCategories = new Set(["桌面 AI 助理", "桌面知识库 Agent", "本地模型桌面应用"])
const agentDesktopGuides = agentInstallGuides.filter((guide) => agentDesktopCategories.has(guide.category))
const desktopGuides = agentInstallGuides.filter((guide) => desktopCategories.has(guide.category))
const engineeringGuides = agentInstallGuides.filter((guide) => !desktopCategories.has(guide.category) && !agentDesktopCategories.has(guide.category))
const firstChoiceSlugs = ["openclaw", "clawx", "cherry-studio", "cline"]
const firstChoiceGuides = firstChoiceSlugs
  .map((slug) => agentInstallGuides.find((guide) => guide.slug === slug))
  .filter((guide): guide is (typeof agentInstallGuides)[number] => Boolean(guide))

function CompactGuideList({ guides, accent = "#e8c96a" }: { guides: typeof agentInstallGuides; accent?: string }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,220px),1fr))", gap: 8, paddingTop: 14 }}>
      {guides.map((guide) => (
        <Link key={guide.slug} href={`/agent-install/${guide.slug}`} style={{ minHeight: 54, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, textDecoration: "none", border: "1px solid #202020", background: "rgba(0,0,0,0.22)", borderRadius: 9, padding: "10px 12px" }}>
          <span style={{ minWidth: 0 }}>
            <span style={{ display: "block", color: "#fff", fontSize: 13, fontWeight: 950, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{guide.name}</span>
            <span style={{ display: "block", color: "#888", fontSize: 11, fontWeight: 850, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{guide.category} · {guide.minutes}</span>
          </span>
          <ArrowRight size={14} style={{ color: accent, flexShrink: 0 }} />
        </Link>
      ))}
    </div>
  )
}

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
    <div className="xb-workbench" style={{ background: "#000", minHeight: "100vh", fontFamily: "'Noto Sans SC', sans-serif", position: "relative", overflow: "hidden" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MathRain />
      <NavBar />
      <main className="xb-workbench-main" style={{ maxWidth: 1120, margin: "0 auto", padding: "64px clamp(16px,5vw,60px) 104px", position: "relative", zIndex: 10, background: "rgba(0,0,0,0.91)" }}>
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

        <LiveEvaluationNotice scope="agents" />

        <section style={{ border: "1px solid #2a1f10", background: "rgba(201,168,76,0.045)", borderRadius: 12, padding: "22px 24px", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 14, flexWrap: "wrap", marginBottom: 16 }}>
            <div>
              <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 950, lineHeight: 1.35, marginBottom: 7 }}>不知道选哪个，先从这 4 个开始</h2>
              <p style={{ color: "#aaa", fontSize: 13, lineHeight: 1.8 }}>一个工程 Agent、一个 OpenClaw 桌面壳、一个桌面 AI 客户端、一个 VS Code Agent 插件。先跑通其中一个，再看全部列表。</p>
            </div>
            <span style={{ color: "#e8c96a", fontSize: 12, fontWeight: 950, display: "inline-flex", alignItems: "center", gap: 7 }}>
              <ShieldCheck size={14} /> Key 不写进仓库
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,230px),1fr))", gap: 10 }}>
            {firstChoiceGuides.map((guide) => (
              <Link key={guide.slug} href={`/agent-install/${guide.slug}`} style={{ textDecoration: "none", border: "1px solid #2b2618", background: "rgba(0,0,0,0.26)", borderRadius: 10, padding: "16px 17px", minHeight: 172, display: "flex", flexDirection: "column" }}>
                <span style={{ color: guide.category === "Agent 桌面应用" ? "#8fd8cc" : "#e8c96a", fontSize: 11, fontWeight: 950, marginBottom: 8 }}>{guide.category}</span>
                <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 950, lineHeight: 1.35, marginBottom: 8 }}>{guide.name}</h3>
                <p style={{ color: "#aaa", fontSize: 12, lineHeight: 1.65, flex: 1 }}>{guide.tagline}</p>
                <span style={{ color: "#e8c96a", fontSize: 12, fontWeight: 950, marginTop: 12, display: "inline-flex", alignItems: "center", gap: 7 }}>
                  直接看教程 <ArrowRight size={13} />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <details style={{ border: "1px solid #1f1f1f", background: "rgba(255,255,255,0.025)", borderRadius: 12, padding: "16px 18px", marginBottom: 16 }}>
          <summary style={{ color: "#e8c96a", fontSize: 14, fontWeight: 950, cursor: "pointer" }}>展开工程 Agent 本体</summary>
          <CompactGuideList guides={engineeringGuides} />
        </details>

        <details style={{ border: "1px solid rgba(82,148,139,0.24)", background: "rgba(82,148,139,0.028)", borderRadius: 12, padding: "16px 18px", marginBottom: 16 }}>
          <summary style={{ color: "#8fd8cc", fontSize: 14, fontWeight: 950, cursor: "pointer" }}>展开 Agent 桌面端应用</summary>
          <CompactGuideList guides={agentDesktopGuides} accent="#8fd8cc" />
        </details>

        <details style={{ border: "1px solid rgba(82,148,139,0.24)", background: "rgba(82,148,139,0.028)", borderRadius: 12, padding: "16px 18px", marginBottom: 20 }}>
          <summary style={{ color: "#8fd8cc", fontSize: 14, fontWeight: 950, cursor: "pointer" }}>展开桌面版 AI 助理应用</summary>
          <CompactGuideList guides={desktopGuides} accent="#8fd8cc" />
        </details>

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
