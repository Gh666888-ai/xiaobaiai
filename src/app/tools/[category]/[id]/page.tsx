import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { categories, stageLabels, tools } from "@/data/tools"
import { categoryPath, getToolAlternatives, getToolMeta, toolPath } from "@/data/tool-meta"
import { brandLogoFromName, domainIcon } from "@/lib/visual-assets"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"

export async function generateStaticParams() {
  return tools.map((tool) => ({ category: tool.category, id: tool.id }))
}

function findTool(categoryParam: string, id: string) {
  const category = decodeURIComponent(categoryParam)
  return tools.find((tool) => tool.category === category && tool.id === id)
}

export function generateMetadata({ params }: { params: { category: string; id: string } }): Metadata {
  const tool = findTool(params.category, params.id)
  if (!tool) return {}
  return {
    title: `${tool.name} 工具详情`,
    description: `${tool.name} 适合阶段、免费情况、网络要求、中文支持、难度、新手推荐指数和替代品。`,
    alternates: { canonical: toolPath(tool) },
  }
}

export default function ToolDetailPage({ params }: { params: { category: string; id: string } }) {
  const tool = findTool(params.category, params.id)
  if (!tool) notFound()
  const category = categories.find((item) => item.key === tool.category)
  const meta = getToolMeta(tool)
  const logo = tool.logo || brandLogoFromName(tool.name) || domainIcon(tool.url)
  const alternatives = getToolAlternatives(tool)
  const compare = [
    ["适合阶段", stageLabels[tool.stage] || `阶段 ${tool.stage}`],
    ["是否免费", tool.pricing],
    ["是否需要魔法网络", meta.magicNetwork],
    ["中文支持", meta.chineseSupport],
    ["难度", meta.difficulty],
    ["新手推荐指数", `${meta.newbieScore}/100`],
  ]

  return (
    <div style={{ background: "#000", minHeight: "100vh", fontFamily: "'Noto Sans SC', sans-serif", position: "relative", overflow: "hidden" }}>
      <MathRain />
      <NavBar />
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "60px 60px 100px", position: "relative", zIndex: 10, background: "rgba(0,0,0,0.86)" }} className="max-sm:px-4">
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 26 }}>
          <Link href="/tools" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#aaa", textDecoration: "none" }}>← 工具分类</Link>
          <Link href={categoryPath(tool.category)} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#c9a84c", textDecoration: "none" }}>← {category?.label || tool.category}</Link>
        </div>

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, marginBottom: 28 }} className="max-sm:flex-col">
          <div>
            <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.35em", color: "#7a6230", textTransform: "uppercase", marginBottom: 10, fontWeight: 700 }}>{tool.category}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
              {logo && <img src={logo} alt={`${tool.name} logo`} style={{ width: 54, height: 54, borderRadius: 14, objectFit: "contain", background: "#fff", padding: 9, border: "1px solid #222" }} />}
              <h1 style={{ fontSize: 40, color: "#fff", fontWeight: 900 }}>{tool.name}</h1>
            </div>
            <p style={{ fontSize: 16, color: "#ccc", lineHeight: 1.9 }}>{tool.description}</p>
          </div>
          <a href={tool.url} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ textDecoration: "none", whiteSpace: "nowrap" }}>访问官网</a>
        </div>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10, marginBottom: 34 }}>
          {compare.map(([label, value]) => (
            <div key={label} style={{ border: "1px solid #1a1a1a", background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "16px 18px" }}>
              <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#777", marginBottom: 8 }}>{label}</p>
              <p style={{ fontSize: 15, color: "#fff", fontWeight: 800 }}>{value}</p>
            </div>
          ))}
        </section>

        <section style={{ marginBottom: 34 }}>
          <h2 style={{ fontSize: 18, color: "#fff", fontWeight: 900, marginBottom: 14 }}>适合做什么</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {meta.bestFor.map((item) => <p key={item} style={{ borderLeft: "2px solid #7a6230", paddingLeft: 14, color: "#ccc", lineHeight: 1.8, fontSize: 14 }}>{item}</p>)}
          </div>
        </section>

        <section style={{ marginBottom: 34 }}>
          <h2 style={{ fontSize: 18, color: "#fff", fontWeight: 900, marginBottom: 14 }}>新手 3 步开始</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
            {meta.quickStart.map((item, index) => (
              <div key={item} style={{ border: "1px solid #1a1a1a", background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 18 }}>
                <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#e8c96a", marginBottom: 8 }}>STEP {index + 1}</p>
                <p style={{ fontSize: 14, color: "#ccc", lineHeight: 1.7 }}>{item}</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 13, color: "#D9A441", marginTop: 14, lineHeight: 1.7 }}>{meta.caution}</p>
        </section>

        {alternatives.length > 0 && (
          <section>
            <h2 style={{ fontSize: 18, color: "#fff", fontWeight: 900, marginBottom: 14 }}>替代品</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
              {alternatives.map((item) => (
                <Link key={item.id} href={toolPath(item)} style={{ textDecoration: "none", border: "1px solid #1a1a1a", background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 16 }}>
                  <h3 style={{ fontSize: 15, color: "#fff", fontWeight: 800, marginBottom: 6 }}>{item.name}</h3>
                  <p style={{ fontSize: 12, color: "#999", lineHeight: 1.6 }}>{item.description.slice(0, 72)}...</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
