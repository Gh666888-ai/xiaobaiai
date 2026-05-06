import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { categories, tools } from "@/data/tools"
import { getToolMeta, toolPath } from "@/data/tool-meta"
import { ToolLogo } from "@/components/ToolLogo"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"
import { CategoryIcon } from "@/components/CategoryIcon"

export async function generateStaticParams() {
  return categories.map((cat) => ({ category: cat.key }))
}

export function generateMetadata({ params }: { params: { category: string } }): Metadata {
  const category = decodeURIComponent(params.category)
  const cat = categories.find((item) => item.key === category)
  if (!cat) return {}
  return {
    title: `${cat.label}工具`,
    description: `查看${cat.label}分类下的 AI 工具排行、免费情况、中文支持、难度、新手推荐指数和工具详情。`,
    alternates: { canonical: `/tools/${encodeURIComponent(category)}` },
  }
}

export default function ToolCategoryPage({ params }: { params: { category: string } }) {
  const category = decodeURIComponent(params.category)
  const cat = categories.find((item) => item.key === category)
  if (!cat) notFound()

  const items = tools
    .filter((tool) => tool.category === category)
    .sort((a, b) => Number(b.featured) - Number(a.featured) || b.rank - a.rank || a.stage - b.stage)

  return (
    <div style={{ background: "#000", minHeight: "100vh", fontFamily: "'Noto Sans SC', sans-serif", position: "relative", overflow: "hidden" }}>
      <MathRain />
      <NavBar />
      <main style={{ maxWidth: 1080, margin: "0 auto", padding: "60px 60px 100px", position: "relative", zIndex: 10, background: "rgba(0,0,0,0.86)" }} className="max-sm:px-4">
        <Link href="/tools" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#aaa", textDecoration: "none", marginBottom: 24, display: "inline-block" }}>← 返回分类</Link>
        <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.35em", color: "#7a6230", textTransform: "uppercase", marginBottom: 10, fontWeight: 700 }}>Category</p>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
          <CategoryIcon category={cat.key} size={24} />
          <h1 style={{ fontSize: 34, color: "#fff", fontWeight: 900 }}>{cat.label}</h1>
        </div>
        <p style={{ fontSize: 14, color: "#ccc", marginBottom: 28 }}>{items.length} 个工具。点击任意工具进入站内详情页，不会直接跳走。</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 10 }}>
          {items.map((tool, index) => {
            const meta = getToolMeta(tool)
            return (
              <Link key={tool.id} href={toolPath(tool)} style={{ display: "block", textDecoration: "none", border: "1px solid #1a1a1a", background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "20px 22px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: index < 3 ? "#e8c96a" : "#666", fontWeight: 900, width: 28 }}>#{index + 1}</span>
                  <ToolLogo name={tool.name} url={tool.url} logo={tool.logo} size={34} radius={9} />
                  <h2 style={{ fontSize: 17, color: "#fff", fontWeight: 900, flex: 1 }}>{tool.name}</h2>
                  {tool.featured && <span className="tag tag-gold" style={{ fontSize: 10 }}>推荐</span>}
                </div>
                <p style={{ fontSize: 13, color: "#bbb", lineHeight: 1.7, minHeight: 68 }}>{tool.description}</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginTop: 14 }}>
                  <span className="tag tag-gray">阶段 {tool.stage}</span>
                  <span className="tag tag-gray">{tool.pricing}</span>
                  <span className="tag tag-gray">网络：{meta.magicNetwork}</span>
                  <span className="tag tag-gray">中文：{meta.chineseSupport}</span>
                  <span className="tag tag-gray">难度：{meta.difficulty}</span>
                  <span className="tag tag-gold">推荐 {meta.newbieScore}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </main>
    </div>
  )
}
