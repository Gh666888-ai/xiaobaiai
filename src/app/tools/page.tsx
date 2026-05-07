import type { Metadata } from "next"
import Link from "next/link"
import { tools, categories } from "@/data/tools"
import { categoryPath, isDomesticTool } from "@/data/tool-meta"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"
import { CategoryIcon } from "@/components/CategoryIcon"

export const metadata: Metadata = {
  title: "AI工具导航 - 分类入口",
  description: "按对话、绘图、视频、写作、编程、办公、搜索、Agent、模型平台等分类浏览 AI 工具，进入分类后查看具体工具和详情。",
  alternates: { canonical: "/tools" },
  openGraph: {
    title: "AI工具导航 | 小白AI",
    description: "按场景浏览 1000+ AI 工具，先选分类，再看详情和新手推荐。",
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
  Agent平台: "可视化搭建自动客服、工作流、任务助手和多 Agent 协作。",
  模型平台: "API 接入、本地模型、模型托管、推理服务和模型社区。",
  AI音频: "配音、语音识别、音乐生成、音频增强和声音克隆。",
  AI设计: "Logo、UI、图片增强、矢量图、商品图和设计辅助。",
  AI营销: "广告文案、投放素材、私域运营、销售自动化和增长分析。",
  AI数据: "表格分析、BI 报告、SQL、数据清洗和趋势解释。",
  AI学习: "语言学习、考试训练、论文辅助、课程总结和个人教练。",
  AI效率: "任务管理、自动化、日程、邮件、个人知识库和效率插件。",
}

export default function ToolsPage() {
  return (
    <div style={{ background: "#000", minHeight: "100vh", fontFamily: "'Noto Sans SC', sans-serif", position: "relative", overflow: "hidden" }}>
      <MathRain />
      <NavBar />
      <main style={{ maxWidth: 1120, margin: "0 auto", padding: "60px 60px 100px", position: "relative", zIndex: 10, background: "rgba(0,0,0,0.86)" }} className="max-sm:px-4">
        <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.4em", color: "#7a6230", textTransform: "uppercase", marginBottom: 10, fontWeight: 700 }}>Directory</p>
        <h1 style={{ fontSize: 36, fontWeight: 900, color: "#fff", letterSpacing: "0.02em", marginBottom: 8 }}>工具导航</h1>
        <p style={{ fontSize: 15, color: "#ccc", marginBottom: 18 }}>先选分类，再看该分类下的工具排行和详情。首页不再堆具体工具，路径更清楚。</p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 36 }}>
          <Link href="/search" className="btn-outline" style={{ textDecoration: "none" }}>搜索全部工具</Link>
          <Link href="/learn/1" className="btn-outline" style={{ textDecoration: "none" }}>我完全不会 AI</Link>
          <Link href="/search?q=帮我选一个 AI 工具" className="btn-primary" style={{ textDecoration: "none" }}>帮我选工具</Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
          {categories.map((cat) => {
            const items = tools.filter((tool) => tool.category === cat.key)
            const freeCount = items.filter((tool) => tool.pricing === "免费" || tool.pricing === "有免费额度").length
            const cnCount = items.filter(isDomesticTool).length
            const featured = items.filter((tool) => tool.featured).slice(0, 3)
            return (
              <Link key={cat.key} href={categoryPath(cat.key)} className="card-cat" style={{ display: "block", textDecoration: "none", background: "rgba(255,255,255,0.03)", border: "1px solid #1a1a1a", borderRadius: 12, padding: "22px 24px", minHeight: 220 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <CategoryIcon category={cat.key} size={22} />
                  <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: 18, color: "#fff", fontWeight: 900 }}>{cat.label}</h2>
                    <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#777", marginTop: 2 }}>{items.length} tools</p>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: "#bbb", lineHeight: 1.7, minHeight: 44 }}>{categoryIntro[cat.key] || "精选 AI 工具分类，适合按场景逐步探索。"}</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, margin: "18px 0" }}>
                  <div><p style={{ fontSize: 18, color: "#e8c96a", fontWeight: 900 }}>{freeCount}</p><p style={{ fontSize: 10, color: "#777" }}>免费/额度</p></div>
                  <div><p style={{ fontSize: 18, color: "#e8c96a", fontWeight: 900 }}>{cnCount}</p><p style={{ fontSize: 10, color: "#777" }}>中文友好</p></div>
                  <div><p style={{ fontSize: 18, color: "#e8c96a", fontWeight: 900 }}>{featured.length}</p><p style={{ fontSize: 10, color: "#777" }}>推荐</p></div>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {featured.map((tool) => <span key={tool.id} className="tag tag-gray" style={{ fontSize: 10 }}>{tool.name}</span>)}
                  {featured.length === 0 && <span className="tag tag-gray" style={{ fontSize: 10 }}>进入查看</span>}
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
