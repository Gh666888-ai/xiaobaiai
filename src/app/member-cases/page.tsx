import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Crown, FileText, LockKeyhole, Sparkles } from "lucide-react"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"
import { news } from "@/data/news"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata: Metadata = {
  title: "会员实战案例 - 小白AI教程实操库、Agent项目、小程序上线和AI副业案例",
  description:
    "小白AI会员实战案例页，把资讯里的教程资源整理成可落地案例，覆盖Agent安装、模型API接入、小程序开发上线、知识库客服、自动化、AI绘图、办公和内容创作。",
  keywords: ["会员实战案例", "AI实战教程", "Agent实战", "小程序上线教程", "AI副业案例", "AI教程实操", "小白AI会员"],
  alternates: { canonical: "/member-cases" },
  openGraph: {
    title: "会员实战案例 | 小白AI",
    description: "把资讯教程整理成能照着做的实战案例。",
    url: "/member-cases",
    images: [{ url: "/xiaobai-mascot-cutout.png", alt: "小白AI 会员实战案例" }],
  },
}

const featuredCases = [
  {
    title: "用 Agent 做微信小程序并上线",
    desc: "从一页需求开始，指挥 Agent 写代码、修报错、真机验收，最后用微信开发者工具上传、提交审核、发布。",
    href: "/agent-mini-program",
    tag: "项目实战",
    result: "一个可提交审核的小程序版本",
  },
  {
    title: "Claude Code 接 DeepSeek V4 改项目",
    desc: "先选模型大脑，再让 Claude Code 读项目、列计划、改指定文件、跑检查，把 Agent 当工程助手用。",
    href: "/agent-install/claude-code",
    tag: "Agent 编程",
    result: "一个真实项目的小功能修改",
  },
  {
    title: "Dify 知识库客服从资料到上线",
    desc: "整理 FAQ、上传资料、设置检索、写转人工边界，把教程变成一个可测试的客服助手。",
    href: "/dify-knowledge-base",
    tag: "企业案例",
    result: "一个能回答资料问题的客服 Bot",
  },
  {
    title: "AI 漫剧第一集样片",
    desc: "先打开工具，再用小白模板生成角色、分镜、画面和配音清单，不要求证据，先做第一个样片。",
    href: "/missions/ai-comic-video-first-episode",
    tag: "个人在家",
    result: "一个可展示的 AI 漫剧样片方案",
  },
]

const caseGroups = [
  {
    title: "Agent 安装和模型接入",
    desc: "先解决能不能启动、能不能接模型、能不能让 Agent 真正干活。",
    match: /Claude Code|Codex|DeepSeek|中转站|Ollama|Agent到底|OpenClaw|Chatbox/i,
  },
  {
    title: "应用、小程序和代码项目",
    desc: "从需求、指挥 Agent 写代码、检查、上线，把 AI 编程变成真实交付。",
    match: /代码|编程|小程序|Claude|Codex|ClawX|应用|上线/i,
  },
  {
    title: "知识库客服和企业流程",
    desc: "适合企业、门店、团队，把 FAQ、资料、客服和自动化流程沉淀下来。",
    match: /Dify|客服|知识库|Coze|n8n|自动化|飞书|微信/i,
  },
  {
    title: "个人在家和内容副业",
    desc: "适合先做作品、样稿、样片、文案和可展示案例，不先谈收益。",
    match: /AI绘画|商用|Prompt|个人|写作|知识管理|内容|视频|文案/i,
  },
]

const tutorialItems = news
  .filter((item) => item.category === "教程资源")
  .sort((a, b) => b.importance - a.importance)

function pickGroupItems(match: RegExp) {
  return tutorialItems.filter((item) => match.test(`${item.title} ${item.summary} ${item.content || ""}`)).slice(0, 6)
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "会员实战案例",
  description: "小白AI把资讯教程整理成可落地的会员实战案例。",
  url: "https://www.xiaobaiai.cn/member-cases",
  inLanguage: "zh-CN",
  mainEntity: {
    "@type": "ItemList",
    itemListElement: [...featuredCases, ...tutorialItems.slice(0, 12)].map((item: any, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.title,
      url: `https://www.xiaobaiai.cn${item.href || `/news/${item.id}`}`,
    })),
  },
}

export default function MemberCasesPage() {
  return (
    <div className="xb-workbench" style={{ background: "#000", minHeight: "100vh", fontFamily: "'Noto Sans SC', sans-serif", position: "relative", overflow: "hidden" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MathRain />
      <NavBar />
      <main className="xb-workbench-main" style={{ maxWidth: 1120, margin: "0 auto", padding: "64px clamp(16px,5vw,60px) 104px", position: "relative", zIndex: 10, background: "rgba(0,0,0,0.92)" }}>
        <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.32em", color: "#7a6230", textTransform: "uppercase", fontWeight: 950, marginBottom: 12 }}>Member Case Lab</p>
        <h1 style={{ color: "#fff", fontSize: 42, fontWeight: 950, lineHeight: 1.2, marginBottom: 14 }}>会员实战案例</h1>
        <p style={{ color: "#ccc", fontSize: 16, lineHeight: 1.9, maxWidth: 880, marginBottom: 22 }}>
          这里不是普通资讯列表。我们把教程、踩坑、项目过程整理成能照着做的实战案例：先看目标，再看工具，再照着步骤做出一个结果。
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 32 }}>
          <Link href="#featured" className="btn-primary" style={{ textDecoration: "none" }}>先看精选案例</Link>
          <Link href="#tutorial-cases" className="btn-outline" style={{ textDecoration: "none" }}>看教程搬运区</Link>
          <Link href="/community/new" className="btn-outline" style={{ textDecoration: "none" }}>提交你的案例</Link>
        </div>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 12, marginBottom: 34 }} className="member-case-grid">
          {[
            { icon: <Crown size={18} />, title: "先免费开放", desc: "现在先把会员内容形态铺好，后面再接会员权益。" },
            { icon: <Sparkles size={18} />, title: "只放能落地的", desc: "不是新闻标题，要能做出页面、样片、客服、工作流或上线版本。" },
            { icon: <LockKeyhole size={18} />, title: "后续可做定制", desc: "会员可以围绕行业、职业和目标定制案例与工作流。" },
          ].map((item) => (
            <div key={item.title} style={{ border: "1px solid #2a1f10", background: "rgba(201,168,76,0.045)", borderRadius: 10, padding: "18px 20px" }}>
              <div style={{ color: "#e8c96a", marginBottom: 10 }}>{item.icon}</div>
              <h2 style={{ color: "#fff", fontSize: 16, fontWeight: 950, marginBottom: 7 }}>{item.title}</h2>
              <p style={{ color: "#bbb", fontSize: 13, lineHeight: 1.75 }}>{item.desc}</p>
            </div>
          ))}
        </section>

        <section id="featured" style={{ marginBottom: 44 }}>
          <div style={{ marginBottom: 16 }}>
            <h2 style={{ color: "#fff", fontSize: 25, fontWeight: 950, marginBottom: 8 }}>精选实战路线</h2>
            <p style={{ color: "#aaa", fontSize: 14, lineHeight: 1.8 }}>这些是最适合拿来做会员训练营的案例：目标明确、过程可控、结果能验收。</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,250px),1fr))", gap: 12 }}>
            {featuredCases.map((item) => (
              <Link key={item.href} href={item.href} style={{ display: "block", textDecoration: "none", border: "1px solid #2a1f10", background: "rgba(201,168,76,0.05)", borderRadius: 12, padding: "18px 20px", minHeight: 218 }}>
                <span style={{ display: "inline-flex", border: "1px solid #7a6230", color: "#e8c96a", borderRadius: 999, padding: "2px 8px", fontSize: 10, fontWeight: 950, marginBottom: 10 }}>{item.tag}</span>
                <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 950, lineHeight: 1.4, marginBottom: 9 }}>{item.title}</h3>
                <p style={{ color: "#bbb", fontSize: 13, lineHeight: 1.75, marginBottom: 12 }}>{item.desc}</p>
                <p style={{ color: "#9ee5d9", fontSize: 12, lineHeight: 1.65, marginBottom: 12 }}>产出：{item.result}</p>
                <span style={{ color: "#e8c96a", fontSize: 12, fontWeight: 950, display: "inline-flex", alignItems: "center", gap: 7 }}>
                  打开案例 <ArrowRight size={13} />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section id="tutorial-cases" style={{ marginBottom: 44 }}>
          <div style={{ marginBottom: 16 }}>
            <h2 style={{ color: "#fff", fontSize: 25, fontWeight: 950, marginBottom: 8 }}>从资讯教程搬过来的实战入口</h2>
            <p style={{ color: "#aaa", fontSize: 14, lineHeight: 1.8 }}>原来散在资讯里的教程资源，先集中到这里。后面会继续把高质量内容改成更完整的会员案例。</p>
          </div>

          {caseGroups.map((group) => {
            const items = pickGroupItems(group.match)
            if (!items.length) return null
            return (
              <section key={group.title} style={{ marginBottom: 34 }}>
                <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 14, flexWrap: "wrap", marginBottom: 12 }}>
                  <div>
                    <h3 style={{ color: "#fff", fontSize: 21, fontWeight: 950, marginBottom: 6 }}>{group.title}</h3>
                    <p style={{ color: "#aaa", fontSize: 13, lineHeight: 1.75 }}>{group.desc}</p>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,260px),1fr))", gap: 12 }}>
                  {items.map((item) => (
                    <Link key={item.id} href={`/news/${item.id}`} style={{ display: "block", textDecoration: "none", border: "1px solid #1c1c1c", background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "17px 18px", minHeight: 184 }}>
                      <span style={{ color: "#888", fontSize: 11, fontWeight: 850, display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 9 }}>
                        <FileText size={12} /> {item.source}
                      </span>
                      <h4 style={{ color: "#fff", fontSize: 16, fontWeight: 950, lineHeight: 1.42, marginBottom: 8 }}>{item.title}</h4>
                      <p style={{ color: "#bdbdbd", fontSize: 13, lineHeight: 1.75 }}>{item.summary}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )
          })}
        </section>

        <section style={{ border: "1px solid #2a1f10", background: "rgba(201,168,76,0.04)", borderRadius: 12, padding: "24px 26px" }}>
          <h2 style={{ color: "#fff", fontSize: 21, fontWeight: 950, marginBottom: 10 }}>这个页面后面怎么变成会员内容？</h2>
          <p style={{ color: "#ccc", fontSize: 14, lineHeight: 1.9, marginBottom: 16 }}>
            现在先不收费，先把案例结构铺好：每个案例都要有目标、工具、步骤、验收、踩坑和下一步。等内容厚起来，再做会员专属定制、行业模板和一对一工作流。
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href="/agent-mini-program" className="btn-primary" style={{ textDecoration: "none" }}>看小程序实战</Link>
            <Link href="/tutorials" className="btn-outline" style={{ textDecoration: "none" }}>看教程大全</Link>
            <Link href="/cases" className="btn-outline" style={{ textDecoration: "none" }}>看社区案例库</Link>
            <Link href="/start" className="btn-outline" style={{ textDecoration: "none" }}>从开始页定制路线</Link>
          </div>
        </section>
      </main>
      <style>{`
        @media (max-width: 820px) {
          .member-case-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
