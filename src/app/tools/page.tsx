import type { Metadata } from "next"
import Link from "next/link"
import { tools, categories } from "@/data/tools"
import { categoryPath } from "@/data/tool-meta"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"
import { CategoryIcon } from "@/components/CategoryIcon"
import { Search } from "lucide-react"

export const metadata: Metadata = {
  title: "AI工具导航大全 - ChatGPT、DeepSeek、AI绘图、AI编程工具分类推荐",
  description: "小白AI工具导航大全精选数百个真实主流 AI 工具，按对话AI、AI绘图、AI视频、AI写作、AI编程、AI办公、AI搜索、Agent平台和模型平台分类推荐，适合新手快速找到能用的 AI 工具。",
  keywords: ["AI工具导航", "AI工具大全", "AI工具推荐", "ChatGPT", "DeepSeek", "AI绘图工具", "AI编程工具", "Agent平台"],
  alternates: { canonical: "/tools" },
  openGraph: {
    title: "AI工具导航大全 | 小白AI",
    description: "按场景浏览真实主流 AI 工具，先选分类，再看详情、免费情况、中文支持和新手推荐。",
    url: "/tools",
    images: [{ url: "/xiaobai-mascot-cutout.png", width: 1071, height: 1468, alt: "小白AI 工具导航" }],
  },
}

const categoryIntro: Record<string, string> = {
  对话AI: "日常问答、写作、翻译、文件分析和个人助手，新手最该先试。",
  AI绘图: "生成海报、头像、插画、电商图和概念设计，适合创意内容生产。",
  AI视频: "文生视频、图生视频、数字人、口播和短视频自动化。",
  AI写作: "文章、营销文案、论文辅助、SEO 内容和社媒笔记。",
  AI编程: "代码补全、项目生成、Bug 修复、代码审查和编程 Agent。",
  AI办公: "文档、PPT、表格、会议纪要、合同审查和知识库问答。",
  AI搜索: "联网搜索、研究报告、学术检索和带来源的答案整理。",
  Agent平台: "编程执行 Agent、模型后端、开源 Agent、自动客服、工作流和多 Agent 协作。",
  模型平台: "API 接入、本地模型、模型托管、推理服务和模型社区。",
  AI音频: "配音、语音识别、音乐生成、音频增强和声音克隆。",
  AI设计: "Logo、UI、图片增强、矢量图、商品图和设计辅助。",
  AI营销: "广告文案、投放素材、私域运营、销售自动化和增长分析。",
  AI数据: "表格分析、BI 报告、SQL、数据清洗和趋势解释。",
  AI学习: "语言学习、考试训练、论文辅助、课程总结和个人教练。",
  AI效率: "任务管理、自动化、日程、邮件、个人知识库和效率插件。",
}

export default function ToolsPage() {
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "AI工具导航大全",
    description: "按场景分类整理 ChatGPT、DeepSeek、AI绘图、AI编程、AI办公、Agent平台和模型平台等 AI 工具。",
    url: "https://www.xiaobaiai.cn/tools",
    inLanguage: "zh-CN",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: categories.map((cat, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: cat.label,
        url: `https://www.xiaobaiai.cn${categoryPath(cat.key)}`,
      })),
    },
  }

  return (
    <div style={{ background: "#000", minHeight: "100vh", fontFamily: "'Noto Sans SC', sans-serif", position: "relative", overflow: "hidden" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <MathRain />
      <NavBar />
      <main style={{ maxWidth: 1120, margin: "0 auto", padding: "60px 60px 100px", position: "relative", zIndex: 10, background: "rgba(0,0,0,0.86)" }} className="max-sm:px-4">
        <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.4em", color: "#7a6230", textTransform: "uppercase", marginBottom: 10, fontWeight: 700 }}>Directory</p>
        <h1 style={{ fontSize: 36, fontWeight: 900, color: "#fff", letterSpacing: "0.02em", marginBottom: 8 }}>AI工具导航大全</h1>
        <p style={{ fontSize: 15, color: "#ccc", marginBottom: 18, lineHeight: 1.8 }}>先按你要做的事选分类，再看适合新手的工具。这里保留工具入口，但不让工具名盖过任务本身。</p>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 36 }}>
          <Link href="/search?q=帮我选一个 AI 工具" className="btn-primary" style={{ textDecoration: "none" }}>帮我选工具</Link>
          <form action="/search" style={{ display: "flex", alignItems: "center", flex: "1 1 320px", maxWidth: 520, minWidth: 260, height: 44, border: "1px solid rgba(201,168,76,0.28)", background: "rgba(10,10,10,0.86)", borderRadius: 10, boxShadow: "0 14px 34px rgba(0,0,0,0.22)" }}>
            <Search size={16} style={{ marginLeft: 14, color: "#c9a84c", flexShrink: 0 }} />
            <input
              name="q"
              type="search"
              placeholder="直接搜索工具：Claude Code、AI PPT、绘图、Dify"
              style={{ flex: 1, minWidth: 0, border: "none", outline: "none", background: "transparent", color: "#fff", padding: "0 12px", fontSize: 14, fontWeight: 800, fontFamily: "'Noto Sans SC', sans-serif" }}
            />
            <button type="submit" style={{ height: 34, marginRight: 5, padding: "0 14px", border: "1px solid #7a6230", borderRadius: 8, background: "rgba(201,168,76,0.14)", color: "#e8c96a", fontSize: 12, fontWeight: 950, cursor: "pointer" }}>搜索</button>
          </form>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
          {categories.map((cat) => {
            const items = tools.filter((tool) => tool.category === cat.key)
            const featured = items.filter((tool) => tool.featured).slice(0, 2)
            return (
              <Link key={cat.key} href={categoryPath(cat.key)} className="card-cat" style={{ display: "block", textDecoration: "none", background: "rgba(255,255,255,0.03)", border: "1px solid #1a1a1a", borderRadius: 12, padding: "20px 22px", minHeight: 172 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <CategoryIcon category={cat.key} size={22} />
                  <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: 18, color: "#fff", fontWeight: 900 }}>{cat.label}</h2>
                    <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#999", marginTop: 2, fontWeight: 800 }}>{items.length} tools</p>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: "#bbb", lineHeight: 1.7, minHeight: 44, marginBottom: 14 }}>{categoryIntro[cat.key] || "精选 AI 工具分类，适合按场景逐步探索。"}</p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", borderTop: "1px solid #1f1f1f", paddingTop: 12 }}>
                  {featured.map((tool) => <span key={tool.id} className="tag tag-gray" style={{ fontSize: 12, color: "#999", fontWeight: 850 }}>{tool.name}</span>)}
                  {featured.length === 0 && <span className="tag tag-gray" style={{ fontSize: 12, color: "#999", fontWeight: 850 }}>进入查看</span>}
                </div>
              </Link>
            )
          })}
        </div>
      </main>
      <style>{`.card-cat:hover{background:rgba(201,168,76,0.06)!important;border-color:#7a6230!important}`}</style>
    </div>
  )
}
