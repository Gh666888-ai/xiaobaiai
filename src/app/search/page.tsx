import type { Metadata } from "next"
import Link from "next/link"
import { NavBar } from "@/components/NavBar"
import { MathRain } from "@/components/MathRain"
import { searchSite } from "@/lib/search"

export const metadata: Metadata = {
  title: "站内搜索",
  description: "一站式搜索小白AI的工具、模型、技能、教程和资讯内容。",
  alternates: { canonical: "/search" },
}

const quickQueries = ["完全不会 AI", "写作工具", "AI 编程", "模型价格", "Agent 教程", "PPT"]
const groupNames = ["工具", "模型", "技能", "教程", "资讯"]

export default function SearchPage({ searchParams }: { searchParams?: { q?: string } }) {
  const q = searchParams?.q?.trim() || ""
  const results = searchSite(q, 80)
  const groups = groupNames.map((kind) => ({
    kind,
    results: results.filter((item) => item.kind === kind),
  }))

  return (
    <div style={{ background: "#000", minHeight: "100vh", fontFamily: "'Noto Sans SC', sans-serif", position: "relative", overflow: "hidden" }}>
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
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 34 }}>
            {quickQueries.map((item) => (
              <Link key={item} href={`/search?q=${encodeURIComponent(item)}`} className="btn-outline" style={{ textDecoration: "none" }}>{item}</Link>
            ))}
          </div>
        )}

        {q && <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#aaa", marginBottom: 24 }}>{results.length} results for "{q}"</p>}

        {q && results.length === 0 && (
          <div style={{ border: "1px solid #1a1a1a", background: "rgba(255,255,255,0.02)", padding: 40, textAlign: "center", color: "#aaa" }}>
            没找到结果。可以试试“AI 写作”“Agent”“模型价格”这类更短的关键词。
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
      </main>
    </div>
  )
}
