import Link from "next/link"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"
import { ToolLogo } from "@/components/ToolLogo"
import { tools } from "@/data/tools"
import { getToolMeta, toolPath } from "@/data/tool-meta"

export type SeoTopicToolRef = {
  id: string
  note: string
}

export type SeoTopicPageProps = {
  eyebrow: string
  title: string
  description: string
  primaryHref?: string
  primaryLabel?: string
  sections: { title: string; body: string; bullets: string[] }[]
  toolRefs: SeoTopicToolRef[]
  faq: { question: string; answer: string }[]
  related: { href: string; label: string }[]
}

function findTool(id: string) {
  return tools.find((tool) => tool.id === id)
}

export function SeoTopicPage({
  eyebrow,
  title,
  description,
  primaryHref = "/tools",
  primaryLabel = "查看工具导航",
  sections,
  toolRefs,
  faq,
  related,
}: SeoTopicPageProps) {
  const topicTools = toolRefs.map((ref) => ({ ref, tool: findTool(ref.id) })).filter((item) => item.tool)
  const topicJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    inLanguage: "zh-CN",
    author: {
      "@type": "Organization",
      name: "小白AI",
    },
    publisher: {
      "@type": "Organization",
      name: "小白AI",
      logo: {
        "@type": "ImageObject",
        url: "https://www.xiaobaiai.cn/xiaobai-icon-192.png?v=3",
      },
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: topicTools.map(({ tool }, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: tool!.name,
        url: `https://www.xiaobaiai.cn${toolPath(tool!)}`,
      })),
    },
  }
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }

  return (
    <div style={{ background: "#000", minHeight: "100vh", fontFamily: "'Noto Sans SC', sans-serif", position: "relative", overflow: "hidden" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(topicJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <MathRain />
      <NavBar />
      <main style={{ maxWidth: 1060, margin: "0 auto", padding: "64px 60px 104px", position: "relative", zIndex: 10, background: "rgba(0,0,0,0.88)" }} className="max-sm:px-4">
        <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.35em", color: "#7a6230", textTransform: "uppercase", marginBottom: 12, fontWeight: 900 }}>{eyebrow}</p>
        <h1 style={{ fontSize: 42, color: "#fff", fontWeight: 900, lineHeight: 1.22, marginBottom: 16 }}>{title}</h1>
        <p style={{ fontSize: 16, color: "#ccc", lineHeight: 1.9, maxWidth: 820, marginBottom: 24 }}>{description}</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 40 }}>
          <Link href={primaryHref} className="btn-primary" style={{ textDecoration: "none" }}>{primaryLabel}</Link>
          <Link href="/choose-tool" className="btn-outline" style={{ textDecoration: "none" }}>让小白帮我选工具</Link>
          <Link href="/learn" className="btn-outline" style={{ textDecoration: "none" }}>查看 AI 学习路径</Link>
        </div>

        <section style={{ marginBottom: 42 }}>
          <h2 style={{ fontSize: 22, color: "#fff", fontWeight: 900, marginBottom: 16 }}>推荐工具</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
            {topicTools.map(({ ref, tool }) => {
              const meta = getToolMeta(tool!)
              return (
                <Link key={tool!.id} href={toolPath(tool!)} style={{ display: "block", textDecoration: "none", border: "1px solid #1a1a1a", background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 18 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                    <ToolLogo name={tool!.name} url={tool!.url} logo={tool!.logo} size={36} radius={9} />
                    <div style={{ minWidth: 0 }}>
                      <h3 style={{ fontSize: 16, color: "#fff", fontWeight: 900 }}>{tool!.name}</h3>
                      <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#777" }}>{tool!.category} · {tool!.pricing}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: "#bbb", lineHeight: 1.75, marginBottom: 10 }}>{ref.note}</p>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <span className="tag tag-gray" style={{ fontSize: 10 }}>中文：{meta.chineseSupport}</span>
                    <span className="tag tag-gold" style={{ fontSize: 10 }}>推荐 {meta.newbieScore}</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12, marginBottom: 42 }}>
          {sections.map((section) => (
            <div key={section.title} style={{ border: "1px solid #1a1a1a", background: "rgba(255,255,255,0.025)", borderRadius: 10, padding: "22px 24px" }}>
              <h2 style={{ fontSize: 18, color: "#fff", fontWeight: 900, marginBottom: 10 }}>{section.title}</h2>
              <p style={{ fontSize: 14, color: "#bbb", lineHeight: 1.8, marginBottom: 14 }}>{section.body}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {section.bullets.map((item) => (
                  <p key={item} style={{ fontSize: 13, color: "#ddd", lineHeight: 1.7, borderLeft: "2px solid #7a6230", paddingLeft: 12 }}>{item}</p>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section style={{ marginBottom: 42 }}>
          <h2 style={{ fontSize: 22, color: "#fff", fontWeight: 900, marginBottom: 16 }}>常见问题</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {faq.map((item) => (
              <div key={item.question} style={{ border: "1px solid #1a1a1a", background: "rgba(255,255,255,0.025)", borderRadius: 10, padding: "18px 20px" }}>
                <h3 style={{ fontSize: 15, color: "#fff", fontWeight: 900, marginBottom: 8 }}>{item.question}</h3>
                <p style={{ fontSize: 14, color: "#bbb", lineHeight: 1.8 }}>{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 style={{ fontSize: 22, color: "#fff", fontWeight: 900, marginBottom: 16 }}>继续看</h2>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {related.map((item) => (
              <Link key={item.href} href={item.href} className="btn-outline" style={{ textDecoration: "none" }}>{item.label}</Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
