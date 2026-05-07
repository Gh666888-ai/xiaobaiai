import type { Metadata } from "next"
import Link from "next/link"
import { AlertTriangle, ArrowRight, BookOpen, CheckCircle2, Layers, MessageCircle, Route, Wrench } from "lucide-react"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"
import { posts } from "@/data/community"
import { inferPostScenarios } from "@/lib/content-taxonomy"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata: Metadata = {
  title: "Dify专题 - Dify教程、知识库搭建、DeepSeek接入和客服Bot实战",
  description: "小白AI Dify专题整理 Dify 新手路线、知识库搭建、DeepSeek接入、聊天助手和工作流区别、召回不准排查、客服Bot上线测试和社区案例。",
  keywords: ["Dify教程", "Dify知识库", "Dify接DeepSeek", "Dify客服Bot", "Dify工作流", "RAG教程"],
  alternates: { canonical: "/topics/dify" },
  openGraph: {
    title: "Dify专题 | 小白AI",
    description: "从 Dify 新手路线到知识库、DeepSeek 接入、客服 Bot 和实战排查。",
    url: "/topics/dify",
    images: [{ url: "/xiaobai-mascot-cutout.png", alt: "小白AI Dify专题" }],
  },
}

const routeSteps = [
  { title: "先理解 Dify 能做什么", href: "/dify", desc: "适合做聊天助手、知识库问答、客服 Bot 和工作流。" },
  { title: "搭一个最小可用知识库", href: "/dify-knowledge-base", desc: "先用少量文档跑通上传、切分、召回和回答。" },
  { title: "接入 DeepSeek 降低成本", href: "/deepseek-api-key", desc: "申请 API Key，再把低成本模型接到 Dify 应用里。" },
  { title: "用真实问题做上线测试", href: "/community/post-49", desc: "准备刁钻问题，避免 Bot 乱承诺、乱编答案。" },
]

const faq = [
  { q: "Dify 聊天助手和工作流有什么区别？", a: "聊天助手适合简单问答和客服入口；工作流适合多步骤任务，比如先分类、再检索、再生成、最后通知人工。" },
  { q: "知识库答非所问先查哪里？", a: "先查文档切分和标题，再看 Top K、召回阈值和提示词边界。很多问题不是模型差，而是召回内容太粗。" },
  { q: "Dify 免费版够不够用？", a: "新手验证一个客服 Bot 或文档助手通常够用。等真实问题量、知识库规模和调用成本起来后，再考虑升级。" },
  { q: "客服 Bot 能不能直接自动回复客户？", a: "常见 FAQ 可以自动回复；价格、退款、交付、合同等高风险内容，建议只生成草稿或转人工确认。" },
]

const difyPosts = posts
  .filter((post) => inferPostScenarios(post).includes("dify"))
  .sort((a, b) => Number(b.likes || 0) - Number(a.likes || 0))
  .slice(0, 8)

function excerpt(text: string) {
  return text.replace(/\s+/g, " ").slice(0, 112)
}

export default function DifyTopicPage() {
  return (
    <div style={{ background: "#000", minHeight: "100vh", fontFamily: "'Noto Sans SC', sans-serif", position: "relative", overflow: "hidden" }}>
      <MathRain />
      <NavBar />
      <main style={{ maxWidth: 1120, margin: "0 auto", padding: "64px 60px 104px", position: "relative", zIndex: 10, background: "rgba(0,0,0,0.9)" }} className="max-sm:px-4">
        <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.35em", color: "#7a6230", textTransform: "uppercase", marginBottom: 12, fontWeight: 900 }}>Topic / Dify</p>
        <h1 style={{ fontSize: 42, color: "#fff", fontWeight: 950, lineHeight: 1.22, marginBottom: 14 }}>Dify 新手专题</h1>
        <p style={{ fontSize: 16, color: "#ccc", lineHeight: 1.9, maxWidth: 860, marginBottom: 24 }}>
          如果你想用 AI 做知识库、客服 Bot 或工作流，从这里开始。这个专题把教程、排查清单和社区案例串成一条路线，不用在一堆帖子里自己翻。
        </p>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 12, marginBottom: 38 }} className="max-sm:grid-cols-1">
          {[
            { icon: <BookOpen size={18} />, label: "教程入口", value: "2 篇" },
            { icon: <Layers size={18} />, label: "社区案例", value: `${difyPosts.length} 篇` },
            { icon: <AlertTriangle size={18} />, label: "重点排查", value: "召回/切分" },
            { icon: <MessageCircle size={18} />, label: "适合场景", value: "客服 Bot" },
          ].map((item) => (
            <div key={item.label} style={{ border: "1px solid #1a1a1a", background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "18px 20px" }}>
              <div style={{ color: "#e8c96a", marginBottom: 10 }}>{item.icon}</div>
              <p style={{ color: "#888", fontSize: 11, marginBottom: 5 }}>{item.label}</p>
              <p style={{ color: "#fff", fontSize: 17, fontWeight: 950 }}>{item.value}</p>
            </div>
          ))}
        </section>

        <section style={{ border: "1px solid #2a1f10", background: "rgba(201,168,76,0.045)", borderRadius: 12, padding: 22, marginBottom: 42 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Route size={18} style={{ color: "#e8c96a" }} />
            <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 950 }}>Dify 新手路线</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 12 }}>
            {routeSteps.map((step, index) => (
              <Link key={step.href} href={step.href} style={{ textDecoration: "none", border: "1px solid #242424", background: "rgba(0,0,0,0.24)", borderRadius: 10, padding: "16px 18px", display: "block" }}>
                <span style={{ display: "inline-flex", width: 26, height: 26, alignItems: "center", justifyContent: "center", borderRadius: 999, background: "rgba(201,168,76,0.1)", color: "#e8c96a", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 950, marginBottom: 12 }}>{index + 1}</span>
                <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 950, lineHeight: 1.45, marginBottom: 7 }}>{step.title}</h3>
                <p style={{ color: "#bbb", fontSize: 13, lineHeight: 1.75 }}>{step.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 42 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "flex-end", flexWrap: "wrap", marginBottom: 16 }}>
            <div>
              <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 950, marginBottom: 7 }}>相关实战案例</h2>
              <p style={{ color: "#aaa", fontSize: 14, lineHeight: 1.8 }}>优先看真实问题和踩坑复盘，能更快知道 Dify 该怎么落地。</p>
            </div>
            <Link href="/community?scene=dify" className="btn-outline" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
              更多 Dify 讨论 <ArrowRight size={14} />
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: 12 }}>
            {difyPosts.map((post) => (
              <Link key={post.id} href={`/community/${post.id}`} style={{ display: "block", textDecoration: "none", border: "1px solid #1a1a1a", background: "rgba(255,255,255,0.026)", borderRadius: 10, padding: "18px 20px", minHeight: 190 }}>
                <span style={{ border: "1px solid #7a6230", color: "#e8c96a", borderRadius: 999, padding: "2px 8px", fontSize: 10, fontWeight: 900 }}>{post.category}</span>
                <h3 style={{ color: "#fff", fontSize: 17, fontWeight: 950, lineHeight: 1.45, margin: "11px 0 8px" }}>{post.title}</h3>
                <p style={{ color: "#bdbdbd", fontSize: 13, lineHeight: 1.8 }}>{excerpt(post.content)}...</p>
              </Link>
            ))}
          </div>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 42 }} className="max-sm:grid-cols-1">
          <div style={{ border: "1px solid #1a1a1a", background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <Wrench size={18} style={{ color: "#e8c96a" }} />
              <h2 style={{ color: "#fff", fontSize: 21, fontWeight: 950 }}>排查清单</h2>
            </div>
            {[
              "文档是否按问题/政策颗粒度切分，而不是整页整章切分。",
              "段落标题是否像用户真实提问，而不是内部文件标题。",
              "Top K、召回阈值、混合检索是否按真实问题测试过。",
              "提示词是否要求引用原文，不确定时转人工确认。",
              "上线前是否跑过错别字、组合问题、边界政策问题。",
            ].map((item) => (
              <p key={item} style={{ display: "flex", gap: 8, color: "#bbb", fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
                <CheckCircle2 size={14} style={{ color: "#3DA563", marginTop: 4, flexShrink: 0 }} /> {item}
              </p>
            ))}
          </div>

          <div style={{ border: "1px solid #2a1f10", background: "rgba(201,168,76,0.04)", borderRadius: 12, padding: 22 }}>
            <h2 style={{ color: "#fff", fontSize: 21, fontWeight: 950, marginBottom: 14 }}>常见问题</h2>
            {faq.map((item) => (
              <div key={item.q} style={{ borderTop: "1px solid #242424", paddingTop: 12, marginTop: 12 }}>
                <h3 style={{ color: "#e8c96a", fontSize: 14, fontWeight: 950, marginBottom: 6 }}>{item.q}</h3>
                <p style={{ color: "#bbb", fontSize: 13, lineHeight: 1.8 }}>{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ border: "1px solid #2a1f10", background: "rgba(201,168,76,0.04)", borderRadius: 12, padding: "24px 26px" }}>
          <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 950, marginBottom: 10 }}>卡住了就发出来</h2>
          <p style={{ color: "#ccc", fontSize: 14, lineHeight: 1.9, marginBottom: 16 }}>
            Dify 问题最好带上：应用类型、模型、检索方式、Top K、文档格式、一个真实问题和 Bot 的错误回答。信息越完整，社区越容易帮你定位。
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href="/community/new" className="btn-primary" style={{ textDecoration: "none" }}>发 Dify 求助帖</Link>
            <Link href="/cases" className="btn-outline" style={{ textDecoration: "none" }}>看更多案例</Link>
            <Link href="/tutorials" className="btn-outline" style={{ textDecoration: "none" }}>回教程大全</Link>
          </div>
        </section>
      </main>
    </div>
  )
}
