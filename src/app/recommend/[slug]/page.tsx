import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"
import { ToolLogo } from "@/components/ToolLogo"
import { getRecommendationPage, recommendationPages } from "@/data/recommendations"
import { tools } from "@/data/tools"
import { getToolMeta, getToolTrustTags, toolPath } from "@/data/tool-meta"

export function generateStaticParams() {
  return recommendationPages.map((page) => ({ slug: page.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const page = getRecommendationPage(params.slug)
  if (!page) return {}
  return {
    title: `${page.title} - 小白AI任务推荐`,
    description: `${page.description} 小白AI整理了推荐工具、国内可用性、第一步怎么做、检查清单和实战复盘模板。`,
    keywords: [page.title, "AI工具推荐", "AI任务导航", "AI新手", "小白AI", ...page.tools.map((item) => item.id)],
    alternates: { canonical: `/recommend/${page.slug}` },
    openGraph: {
      title: `${page.title} | 小白AI`,
      description: page.description,
      url: `/recommend/${page.slug}`,
      images: [{ url: "/xiaobai-mascot-cutout.png", alt: "小白AI任务推荐" }],
    },
  }
}

export default function RecommendationDetailPage({ params }: { params: { slug: string } }) {
  const page = getRecommendationPage(params.slug)
  if (!page) notFound()

  const recommendedTools = page.tools.map((item) => {
    const tool = tools.find((candidate) => candidate.id === item.id)
    return tool ? { ...item, tool, meta: getToolMeta(tool), tags: getToolTrustTags(tool).slice(0, 3) } : null
  }).filter((item): item is NonNullable<typeof item> => Boolean(item))

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: page.title,
    description: page.description,
    url: `https://www.xiaobaiai.cn/recommend/${page.slug}`,
    itemListElement: recommendedTools.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.tool.name,
      url: `https://www.xiaobaiai.cn${toolPath(item.tool)}`,
      description: item.reason,
    })),
  }

  return (
    <div style={{ background: "#000", minHeight: "100vh", fontFamily: "'Noto Sans SC', sans-serif", position: "relative", overflow: "hidden" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MathRain />
      <NavBar />
      <main style={{ maxWidth: 1060, margin: "0 auto", padding: "62px clamp(16px,5vw,60px) 104px", position: "relative", zIndex: 10, background: "rgba(0,0,0,0.9)" }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
          <Link href="/choose-tool" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#c9a84c", textDecoration: "none" }}>← AI 工具选择器</Link>
          <Link href="/start" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#aaa", textDecoration: "none" }}>← 从 0 到 1 起步</Link>
        </div>

        <section style={{ marginBottom: 34 }}>
          <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.34em", color: "#7a6230", textTransform: "uppercase", marginBottom: 12, fontWeight: 950 }}>Task Recommendation</p>
          <h1 style={{ color: "#fff", fontSize: 42, fontWeight: 950, lineHeight: 1.2, marginBottom: 14 }}>{page.title}</h1>
          <p style={{ color: "#ccc", fontSize: 16, lineHeight: 1.9, maxWidth: 820, marginBottom: 18 }}>{page.description}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="max-sm:grid-cols-1">
            <InfoBlock title="适合谁" text={page.audience} />
            <InfoBlock title="第一步怎么做" text={page.firstStep} />
          </div>
        </section>

        <section style={{ marginBottom: 38 }}>
          <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 950, marginBottom: 14 }}>推荐工具组合</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,240px),1fr))", gap: 12 }}>
            {recommendedTools.map((item, index) => (
              <Link key={item.tool.id} href={toolPath(item.tool)} style={{ border: "1px solid #1a1a1a", background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 18, textDecoration: "none", minHeight: 252, display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <ToolLogo name={item.tool.name} url={item.tool.url} logo={item.tool.logo} size={42} radius={10} />
                  <div>
                    <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#c9a84c", fontWeight: 950 }}>#{index + 1} · {item.role}</p>
                    <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 950, lineHeight: 1.35 }}>{item.tool.name}</h3>
                  </div>
                </div>
                <p style={{ color: "#bbb", fontSize: 13, lineHeight: 1.75 }}>{item.reason}</p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: "auto" }}>
                  {item.tags.map((tag) => (
                    <span key={tag.label} style={{ border: "1px solid #242424", borderRadius: 999, padding: "5px 8px", color: tag.tone === "good" ? "#9fd18b" : tag.tone === "warn" ? "#D9A441" : "#aaa", fontSize: 11, fontWeight: 900 }}>{tag.label}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "stretch" }} className="max-sm:grid-cols-1">
          <div style={{ border: "1px solid #2a1f10", background: "rgba(201,168,76,0.055)", borderRadius: 12, padding: "20px 22px" }}>
            <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 950, marginBottom: 12 }}>完成前检查</h2>
            <div style={{ display: "grid", gap: 9 }}>
              {page.checklist.map((item) => (
                <p key={item} style={{ color: "#ddd", fontSize: 13, lineHeight: 1.65, borderLeft: "2px solid #7a6230", paddingLeft: 12 }}>{item}</p>
              ))}
            </div>
          </div>
          <div style={{ border: "1px solid #242424", background: "rgba(255,255,255,0.026)", borderRadius: 12, padding: "20px 22px" }}>
            <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 950, marginBottom: 12 }}>做完以后发复盘</h2>
            <p style={{ color: "#bbb", fontSize: 13, lineHeight: 1.8, marginBottom: 14 }}>{page.casePrompt}</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link href={page.missionHref} className="btn-primary" style={{ textDecoration: "none" }}>开始这个任务</Link>
              <Link href="/community/new" className="btn-outline" style={{ textDecoration: "none" }}>发实战复盘</Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

function InfoBlock({ title, text }: { title: string; text: string }) {
  return (
    <div style={{ border: "1px solid #242424", background: "rgba(255,255,255,0.026)", borderRadius: 12, padding: "17px 18px" }}>
      <p style={{ color: "#888", fontSize: 11, fontWeight: 950, marginBottom: 7 }}>{title}</p>
      <p style={{ color: "#ddd", fontSize: 14, lineHeight: 1.8 }}>{text}</p>
    </div>
  )
}
