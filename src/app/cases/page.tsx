import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, BookOpen, Layers, MessageCircle } from "lucide-react"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"
import { posts } from "@/data/community"
import { primaryScenario, scenarioFilters, scenarioLabel, type ContentScenario } from "@/lib/content-taxonomy"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata: Metadata = {
  title: "AI实战案例库 - 办公提效、Dify知识库、AI编程和内容创作案例",
  description: "小白AI实战案例库整理普通人能照着做的 AI 使用案例，覆盖办公提效、内容创作、AI绘图、Dify知识库、AI编程、Agent工作流和数据分析。",
  keywords: ["AI实战案例", "AI办公案例", "Dify案例", "AI编程案例", "AI工作流案例", "AI内容创作案例"],
  alternates: { canonical: "/cases" },
  openGraph: {
    title: "AI实战案例库 | 小白AI",
    description: "从真实场景出发，整理普通人能照着做的 AI 使用案例。",
    url: "/cases",
    images: [{ url: "/xiaobai-mascot-cutout.png", alt: "小白AI 实战案例库" }],
  },
}

const casePosts = posts
  .filter((post) => post.category !== "问题求助")
  .map((post) => ({ ...post, scenario: primaryScenario(post) }))

const featured = casePosts
  .filter((post) => ["office", "dify", "coding", "creator", "security", "newbie"].includes(post.scenario))
  .sort((a, b) => Number(b.likes || 0) - Number(a.likes || 0))
  .slice(0, 6)

const groups = scenarioFilters
  .filter((item): item is { key: ContentScenario; label: string; desc: string } => item.key !== "all")
  .map((scenario) => ({
    ...scenario,
    posts: casePosts
      .filter((post) => post.scenario === scenario.key)
      .sort((a, b) => Number(b.pinned || false) - Number(a.pinned || false) || Number(b.likes || 0) - Number(a.likes || 0))
      .slice(0, 6),
  }))
  .filter((group) => group.posts.length > 0)

function excerpt(text: string) {
  return text.replace(/\s+/g, " ").slice(0, 118)
}

function CaseCard({ post }: { post: any }) {
  return (
    <Link href={`/community/${post.id}`} style={{ display: "block", textDecoration: "none", border: "1px solid #1a1a1a", background: "rgba(255,255,255,0.026)", borderRadius: 10, padding: "18px 20px", minHeight: 206 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 10 }}>
        <span style={{ border: "1px solid #7a6230", color: "#e8c96a", borderRadius: 999, padding: "2px 8px", fontSize: 10, fontWeight: 900 }}>{scenarioLabel(post.scenario)}</span>
        <span style={{ color: "#777", fontSize: 11 }}>{post.category}</span>
      </div>
      <h3 style={{ color: "#fff", fontSize: 17, fontWeight: 950, lineHeight: 1.45, marginBottom: 9 }}>{post.title}</h3>
      <p style={{ color: "#bdbdbd", fontSize: 13, lineHeight: 1.8, marginBottom: 14 }}>{excerpt(post.content)}...</p>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", color: "#888", fontSize: 11 }}>
        <span>{post.author}</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
          <MessageCircle size={12} /> {post.comments || 0}
        </span>
      </div>
    </Link>
  )
}

export default function CasesPage() {
  return (
    <div style={{ background: "#000", minHeight: "100vh", fontFamily: "'Noto Sans SC', sans-serif", position: "relative", overflow: "hidden" }}>
      <MathRain />
      <NavBar />
      <main style={{ maxWidth: 1120, margin: "0 auto", padding: "64px 60px 104px", position: "relative", zIndex: 10, background: "rgba(0,0,0,0.9)" }} className="max-sm:px-4">
        <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.35em", color: "#7a6230", textTransform: "uppercase", marginBottom: 12, fontWeight: 900 }}>AI Case Library</p>
        <h1 style={{ fontSize: 42, color: "#fff", fontWeight: 950, lineHeight: 1.22, marginBottom: 14 }}>AI实战案例库</h1>
        <p style={{ fontSize: 16, color: "#ccc", lineHeight: 1.9, maxWidth: 860, marginBottom: 24 }}>
          这里不按发帖时间堆内容，而是把社区里的真实经验整理成场景货架：办公提效、内容创作、AI绘图、Dify知识库、AI编程、Agent工作流和数据分析。想照着做，先从案例开始。
        </p>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 12, marginBottom: 36 }} className="max-sm:grid-cols-1">
          {[
            { icon: <BookOpen size={18} />, title: "先看案例", desc: "从真实场景理解 AI 能帮你做什么。" },
            { icon: <Layers size={18} />, title: "再看教程", desc: "遇到不懂的工具，再回到教程补基础。" },
            { icon: <MessageCircle size={18} />, title: "最后去社区", desc: "照着做时卡住了，发帖求助或补充经验。" },
          ].map((item) => (
            <div key={item.title} style={{ border: "1px solid #2a1f10", background: "rgba(201,168,76,0.045)", borderRadius: 10, padding: "18px 20px" }}>
              <div style={{ color: "#e8c96a", marginBottom: 10 }}>{item.icon}</div>
              <h2 style={{ color: "#fff", fontSize: 16, fontWeight: 950, marginBottom: 7 }}>{item.title}</h2>
              <p style={{ color: "#bbb", fontSize: 13, lineHeight: 1.75 }}>{item.desc}</p>
            </div>
          ))}
        </section>

        <section style={{ marginBottom: 44 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "flex-end", flexWrap: "wrap", marginBottom: 16 }}>
            <div>
              <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 950, marginBottom: 7 }}>精选实战</h2>
              <p style={{ color: "#aaa", fontSize: 14, lineHeight: 1.8 }}>优先展示适合新手照着跑的内容，不追求大而全。</p>
            </div>
            <Link href="/community/new" className="btn-outline" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
              分享你的案例 <ArrowRight size={14} />
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: 12 }}>
            {featured.map((post) => <CaseCard key={post.id} post={post} />)}
          </div>
        </section>

        {groups.map((group) => (
          <section key={group.key} style={{ marginBottom: 44 }}>
            <div style={{ marginBottom: 16 }}>
              <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 950, marginBottom: 7 }}>{group.label}</h2>
              <p style={{ color: "#aaa", fontSize: 14, lineHeight: 1.8 }}>{group.desc}</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: 12 }}>
              {group.posts.map((post) => <CaseCard key={post.id} post={post} />)}
            </div>
          </section>
        ))}

        <section style={{ border: "1px solid #2a1f10", background: "rgba(201,168,76,0.04)", borderRadius: 12, padding: "24px 26px" }}>
          <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 950, marginBottom: 10 }}>案例库和社区有什么区别？</h2>
          <p style={{ color: "#ccc", fontSize: 14, lineHeight: 1.9, marginBottom: 16 }}>
            案例库负责整理精选内容，社区负责讨论、求助和发帖。以后新发的高质量帖子，会继续沉淀到案例库和专题页里。
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href="/tutorials" className="btn-primary" style={{ textDecoration: "none" }}>看教程大全</Link>
            <Link href="/community" className="btn-outline" style={{ textDecoration: "none" }}>去社区讨论</Link>
            <Link href="/topics/claude-code-deepseek" className="btn-outline" style={{ textDecoration: "none" }}>看 Claude Code 专题</Link>
            <Link href="/topics/dify" className="btn-outline" style={{ textDecoration: "none" }}>看 Dify 专题</Link>
          </div>
        </section>
      </main>
    </div>
  )
}
