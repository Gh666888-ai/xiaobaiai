import type { Metadata } from "next"
import Link from "next/link"
import { NavBar } from "@/components/NavBar"
import { MathRain } from "@/components/MathRain"
import { searchSite } from "@/lib/search"

export const metadata: Metadata = {
  title: "AI工具和AI教程站内搜索 - 搜索ChatGPT、DeepSeek、Dify、AI绘图和AI办公工具",
  description: "一站式搜索小白AI的AI工具、AI教程、模型、技能、资讯和工作流内容，也可以快速进入AI教程大全、免费AI工具、Dify知识库和DeepSeek API Key教程。",
  keywords: ["AI工具搜索", "AI教程搜索", "AI工具导航", "AI教程大全", "DeepSeek教程", "Dify教程", "AI绘图工具", "AI办公工具"],
  alternates: { canonical: "/search" },
}

const quickQueries = ["AI教程", "免费AI工具", "DeepSeek API Key", "Dify知识库", "Gamma做PPT", "即梦提示词", "AI绘图工具", "AI办公"]
const groupNames = ["工具", "模型", "技能", "教程", "资讯", "工作流"]

const featuredLinks = [
  { href: "/tutorials", title: "AI教程大全", desc: "零基础学AI、AI工具教程、DeepSeek、Dify、Gamma和即梦教程集合。" },
  { href: "/ai-tools", title: "AI工具大全", desc: "对话AI、AI绘图、AI编程、AI视频、AI办公和Agent工具分类推荐。" },
  { href: "/free-ai-tools", title: "免费AI工具推荐", desc: "免费ChatGPT替代、免费AI绘图、AI写作和AI办公工具整理。" },
  { href: "/choose-tool", title: "帮我选AI工具", desc: "不知道用哪个工具时，按任务场景快速筛选适合你的AI工具。" },
]

const tutorialLinks = [
  { href: "/deepseek-api-key", label: "DeepSeek API Key怎么申请" },
  { href: "/dify-knowledge-base", label: "Dify知识库怎么搭建" },
  { href: "/gamma-ppt", label: "Gamma怎么做PPT" },
  { href: "/jimeng-prompts", label: "即梦AI提示词怎么写" },
  { href: "/ai-image-tools", label: "AI绘图工具推荐" },
  { href: "/ai-writing-tools", label: "AI写作工具推荐" },
  { href: "/ai-video-tools", label: "AI视频工具推荐" },
  { href: "/ai-office-tools", label: "AI办公工具推荐" },
  { href: "/ai-ppt-tools", label: "AI PPT工具推荐" },
  { href: "/ai-coding", label: "AI编程工具推荐" },
  { href: "/agent", label: "Agent教程" },
  { href: "/chatgpt", label: "ChatGPT怎么用" },
  { href: "/deepseek", label: "DeepSeek怎么用" },
  { href: "/dify", label: "Dify教程" },
  { href: "/cursor", label: "Cursor怎么用" },
]

export default function SearchPage({ searchParams }: { searchParams?: { q?: string } }) {
  const q = searchParams?.q?.trim() || ""
  const results = searchSite(q, 80)
  const groups = groupNames.map((kind) => ({
    kind,
    results: results.filter((item) => item.kind === kind),
  }))
  const searchJsonLd = {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    name: q ? `小白AI站内搜索：${q}` : "小白AI站内搜索",
    url: q ? `https://www.xiaobaiai.cn/search?q=${encodeURIComponent(q)}` : "https://www.xiaobaiai.cn/search",
    inLanguage: "zh-CN",
    isPartOf: {
      "@type": "WebSite",
      name: "小白AI",
      url: "https://www.xiaobaiai.cn",
    },
  }

  return (
    <div style={{ background: "#000", minHeight: "100vh", fontFamily: "'Noto Sans SC', sans-serif", position: "relative", overflow: "hidden" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(searchJsonLd) }} />
      <MathRain />
      <NavBar />
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "60px 60px 100px", position: "relative", zIndex: 10, background: "rgba(0,0,0,0.86)" }} className="max-sm:px-4">
        <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.4em", color: "#7a6230", textTransform: "uppercase", marginBottom: 10, fontWeight: 700 }}>Search</p>
        <h1 style={{ fontSize: 36, fontWeight: 950, color: "#fff", marginBottom: 10 }}>站内搜索</h1>
        <p style={{ fontSize: 14, color: "#ccc", marginBottom: 28 }}>统一搜索工具、模型、技能、教程和资讯。也支持地址：/search?q=关键词。</p>

        <form action="/search" style={{ display: "flex", gap: 10, marginBottom: 18 }}>
          <input name="q" defaultValue={q} placeholder="搜工具、模型、技能、教程..." className="form-input" style={{ flex: 1, height: 46, fontSize: 15 }} autoFocus />
          <button className="btn-primary" style={{ justifyContent: "center", whiteSpace: "nowrap" }}>搜索</button>
        </form>

        {!q && (
          <>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 34 }}>
              {quickQueries.map((item) => (
                <Link key={item} href={`/search?q=${encodeURIComponent(item)}`} className="btn-outline" style={{ textDecoration: "none" }}>{item}</Link>
              ))}
            </div>

            <section style={{ marginBottom: 34 }}>
              <h2 style={{ fontSize: 20, color: "#fff", fontWeight: 900, marginBottom: 14 }}>热门入口</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
                {featuredLinks.map((item) => (
                  <Link key={item.href} href={item.href} style={{ display: "block", textDecoration: "none", border: "1px solid #2a1f10", background: "rgba(201,168,76,0.045)", borderRadius: 10, padding: "18px 20px" }}>
                    <h3 style={{ fontSize: 16, color: "#fff", fontWeight: 900, marginBottom: 8 }}>{item.title}</h3>
                    <p style={{ fontSize: 13, color: "#cfcfcf", lineHeight: 1.75 }}>{item.desc}</p>
                  </Link>
                ))}
              </div>
            </section>

            <section style={{ marginBottom: 38 }}>
              <h2 style={{ fontSize: 20, color: "#fff", fontWeight: 900, marginBottom: 14 }}>热门教程</h2>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {tutorialLinks.map((item) => (
                  <Link key={item.href} href={item.href} style={{ fontSize: 12, color: "#e8c96a", textDecoration: "none", border: "1px solid rgba(122,98,48,0.7)", background: "rgba(201,168,76,0.05)", borderRadius: 999, padding: "7px 11px", fontWeight: 800 }}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}

        {q && <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#aaa", marginBottom: 24 }}>{results.length} results for "{q}"</p>}

        {q && results.length === 0 && (
          <div style={{ border: "1px solid #1a1a1a", background: "rgba(255,255,255,0.02)", padding: 28, color: "#aaa", borderRadius: 10, marginBottom: 28 }}>
            <p style={{ fontSize: 16, color: "#fff", fontWeight: 900, marginBottom: 10 }}>没找到精确结果</p>
            <p style={{ fontSize: 13, lineHeight: 1.8, marginBottom: 16 }}>可以试试更短的关键词，或者直接进入下面这些高频教程入口。</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {tutorialLinks.slice(0, 10).map((item) => (
                <Link key={item.href} href={item.href} style={{ fontSize: 12, color: "#e8c96a", textDecoration: "none", border: "1px solid rgba(122,98,48,0.7)", background: "rgba(201,168,76,0.05)", borderRadius: 999, padding: "7px 11px", fontWeight: 800 }}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {groups.map((group) => group.results.length > 0 && (
            <section key={group.kind}>
              <h2 style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#e8c96a", marginBottom: 12, letterSpacing: "0.18em" }}>{group.kind}</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {group.results.map((item) => (
                  <Link key={item.id} href={item.href} style={{ display: "block", textDecoration: "none", border: "1px solid #1a1a1a", background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "18px 20px" }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                      <span className="tag tag-gold" style={{ fontSize: 10 }}>{item.kind}</span>
                      <h3 style={{ fontSize: 16, color: "#fff", fontWeight: 800 }}>{item.title}</h3>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#777" }}>{item.meta}</span>
                    </div>
                    <p style={{ fontSize: 13, color: "#bbb", lineHeight: 1.7 }}>{item.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        {q && results.length > 0 && (
          <section style={{ marginTop: 36, borderTop: "1px solid #1a1a1a", paddingTop: 24 }}>
            <h2 style={{ fontSize: 18, color: "#fff", fontWeight: 900, marginBottom: 14 }}>继续探索</h2>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {tutorialLinks.slice(0, 8).map((item) => (
                <Link key={item.href} href={item.href} style={{ fontSize: 12, color: "#e8c96a", textDecoration: "none", border: "1px solid rgba(122,98,48,0.7)", background: "rgba(201,168,76,0.05)", borderRadius: 999, padding: "7px 11px", fontWeight: 800 }}>
                  {item.label}
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
