import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, CheckCircle2, Flag, MessageCircle, Route, Sparkles } from "lucide-react"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"

export const metadata: Metadata = {
  title: "AI从0到1起步 - 先做成一个环节，而不是先选工具",
  description:
    "小白AI从0到1起步页，帮助新手从“我最想做成什么事”出发，把大目标拆成第一个可执行环节：写一篇内容、搭一个知识库、改一个页面、做一个自动化提醒、整理一份数据或做一个AI作品。",
  keywords: ["AI从0到1", "AI实战起步", "AI项目起步", "AI学习目标", "AI应用落地", "AI新手第一步"],
  alternates: { canonical: "/start" },
  openGraph: {
    title: "AI从0到1起步 | 小白AI",
    description: "不要先选工具，先说你想做成什么事，再做其中一个环节。",
    url: "/start",
    images: [{ url: "/xiaobai-mascot-cutout.png", alt: "小白AI 从0到1起步" }],
  },
}

const goals = [
  {
    title: "我想做一个能回答问题的知识库",
    wholeThing: "最终可能是一个客服 Bot、课程问答助手、售后政策助手或公司内部资料助手。",
    firstStep: "先不搭完整 Bot，只整理 10 条真实问题和对应资料来源。",
    output: "一张“问题 -> 答案来源 -> 不能回答时转人工”的小表。",
    href: "/topics/dify",
    action: "从知识库环节开始",
  },
  {
    title: "我想用 AI 做内容账号",
    wholeThing: "最终可能是小红书、公众号、短视频、教程站或行业资讯号。",
    firstStep: "先不追求日更，先让 AI 采访你 6 个问题，写出一篇真实经验稿。",
    output: "一篇 600-1000 字的真实经历文章，能发到社区或社媒。",
    href: "/community/post-43",
    action: "先写第一篇",
  },
  {
    title: "我想让 AI 帮我改网站或代码",
    wholeThing: "最终可能是一个工具站、导航站、工作台、自动化系统或个人产品。",
    firstStep: "先不让 AI 重构项目，只让它读一个页面并列出改动计划。",
    output: "一个小范围 diff：只改 1-2 个文件，并能通过 build。",
    href: "/claude-code-deepseek",
    action: "从一个小改动开始",
  },
  {
    title: "我想做自动化工作流",
    wholeThing: "最终可能是自动日报、新闻抓取、价格监控、邮件草稿或飞书通知。",
    firstStep: "先不做全自动，只把人工流程写成 5 个步骤。",
    output: "一张“触发 -> 获取信息 -> AI处理 -> 人工确认 -> 发送”的流程表。",
    href: "/workflows",
    action: "先拆一个流程",
  },
  {
    title: "我想用 AI 提高办公效率",
    wholeThing: "最终可能是周报、会议纪要、合同摘要、Excel 分析或 PPT 初稿。",
    firstStep: "先选一个今天真的要交付的文件，让 AI 只做整理，不让它乱编。",
    output: "一份可检查的周报/纪要/表格分析初稿。",
    href: "/community/post-39",
    action: "先做一个办公环节",
  },
  {
    title: "我想做 AI 绘图或短视频作品",
    wholeThing: "最终可能是头像、海报、壁纸、分镜、漫剧或短视频账号。",
    firstStep: "先不做完整视频，只写一个角色设定或 5 个镜头。",
    output: "一组稳定的角色提示词，或一个 5 镜头短视频脚本。",
    href: "/community/post-36",
    action: "先做一个镜头",
  },
]

const principles = [
  "先问想做成什么事，再找工具。",
  "完整项目太大，就先做其中一个环节。",
  "第一个环节必须能交付、能检查、能复用。",
  "做完再回到学习路径补基础，而不是一直停在学习。",
]

export default function StartPage() {
  return (
    <div style={{ background: "#000", minHeight: "100vh", fontFamily: "'Noto Sans SC', sans-serif", position: "relative", overflow: "hidden" }}>
      <MathRain />
      <NavBar />
      <main style={{ maxWidth: 1120, margin: "0 auto", padding: "64px 60px 104px", position: "relative", zIndex: 10, background: "rgba(0,0,0,0.9)" }} className="max-sm:px-4">
        <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.34em", color: "#7a6230", textTransform: "uppercase", marginBottom: 12, fontWeight: 900 }}>Start From 0 To 1</p>
        <h1 style={{ fontSize: 42, color: "#fff", fontWeight: 950, lineHeight: 1.22, marginBottom: 14 }}>你现在最想用 AI 做成什么事？</h1>
        <p style={{ fontSize: 16, color: "#ccc", lineHeight: 1.9, maxWidth: 880, marginBottom: 24 }}>
          不要从“选哪个工具”开始。先说你想做成什么事。就算现在的工具还不能帮你做完整件事，我们也可以先做好其中一个环节，这就是从 0 到 1 的开始。
        </p>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 12, marginBottom: 38 }} className="max-sm:grid-cols-1">
          {principles.map((item, index) => (
            <div key={item} style={{ border: "1px solid #1a1a1a", background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "18px 20px" }}>
              <div style={{ color: "#e8c96a", marginBottom: 10 }}>{index === 0 ? <Flag size={18} /> : index === 1 ? <Route size={18} /> : index === 2 ? <CheckCircle2 size={18} /> : <Sparkles size={18} />}</div>
              <p style={{ color: "#ddd", fontSize: 13, lineHeight: 1.8, fontWeight: 850 }}>{item}</p>
            </div>
          ))}
        </section>

        <section style={{ marginBottom: 44 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 14, flexWrap: "wrap", marginBottom: 16 }}>
            <div>
              <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 950, marginBottom: 7 }}>选一个你真正想推进的方向</h2>
              <p style={{ color: "#aaa", fontSize: 14, lineHeight: 1.8 }}>每个方向都只给第一个环节，不要求你今天做完整个项目。</p>
            </div>
            <Link href="/community/new" className="btn-outline" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
              写下我的目标 <MessageCircle size={14} />
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 12 }}>
            {goals.map((goal) => (
              <Link key={goal.title} href={goal.href} style={{ display: "block", textDecoration: "none", border: "1px solid #1a1a1a", background: "rgba(255,255,255,0.026)", borderRadius: 10, padding: "20px 22px", minHeight: 292 }}>
                <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 950, lineHeight: 1.45, marginBottom: 10 }}>{goal.title}</h3>
                <p style={{ color: "#888", fontSize: 11, fontWeight: 900, marginBottom: 5 }}>完整目标</p>
                <p style={{ color: "#bbb", fontSize: 13, lineHeight: 1.75, marginBottom: 12 }}>{goal.wholeThing}</p>
                <p style={{ color: "#888", fontSize: 11, fontWeight: 900, marginBottom: 5 }}>先做一个环节</p>
                <p style={{ color: "#ddd", fontSize: 13, lineHeight: 1.75, marginBottom: 12 }}>{goal.firstStep}</p>
                <p style={{ color: "#cdbb80", fontSize: 12, lineHeight: 1.7, borderTop: "1px solid #242424", paddingTop: 10, marginBottom: 14 }}>0-1 交付物：{goal.output}</p>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "#e8c96a", fontSize: 12, fontWeight: 950 }}>
                  {goal.action} <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section style={{ border: "1px solid #2a1f10", background: "rgba(201,168,76,0.04)", borderRadius: 12, padding: "24px 26px" }}>
          <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 950, marginBottom: 10 }}>做完第一个环节以后</h2>
          <p style={{ color: "#ccc", fontSize: 14, lineHeight: 1.9, marginBottom: 16 }}>
            回到学习路径补对应能力：不会提问就补 L1，不会搭流程就补 L3，不懂 API 和模型名就补 L4，想让 AI 改代码就补 L5。学习不是目的，推进你想做成的事才是目的。
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href="/learn" className="btn-primary" style={{ textDecoration: "none" }}>回到学习主线</Link>
            <Link href="/cases" className="btn-outline" style={{ textDecoration: "none" }}>看别人怎么从0到1</Link>
            <Link href="/community/new" className="btn-outline" style={{ textDecoration: "none" }}>发我的0-1复盘</Link>
          </div>
        </section>
      </main>
    </div>
  )
}
