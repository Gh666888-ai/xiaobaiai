import type { Metadata } from "next"
import Link from "next/link"
import { Search } from "lucide-react"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata: Metadata = {
  title: "AI教程大全 - 零基础学AI、主流AI工具、Agent、AI视频和AI编程教程",
  description:
    "小白AI整理AI教程大全，覆盖零基础学AI、ChatGPT、DeepSeek、Kimi、豆包、Gemini、ChatGPT Image、Nano Banana、Sora、Veo、可灵、Codex、Claude Code、Dify、Coze、Manus、n8n 等主流AI工具教程。",
  keywords: ["AI教程", "AI教程大全", "零基础学AI", "AI工具教程", "AI小白教程", "DeepSeek教程", "Agent教程", "AI视频教程", "AI编程教程"],
  alternates: { canonical: "/tutorials" },
  openGraph: {
    title: "AI教程大全 | 小白AI",
    description: "零基础学AI、主流AI工具、Agent、AI视频和AI编程教程集合。",
    url: "/tutorials",
    images: [{ url: "/xiaobai-mascot-cutout.png", alt: "小白AI AI教程大全" }],
  },
}

const quickStart = [
  { href: "/learn", title: "先看完整学习主线", desc: "从认识 AI、会用工具、完成任务，到 Agent、API、AI 编程和自动化实战。" },
  { href: "/learn/0", title: "完全零基础，从这里开始", desc: "适合第一次接触 AI 的用户，先搞清楚 AI 能做什么、不能做什么。" },
  { href: "/learn/1", title: "AI工具入门", desc: "从 ChatGPT、DeepSeek、Kimi、豆包、Gemini、元宝开始，学会提问、上传资料和验证结果。" },
  { href: "/start", title: "从0到1做成一个环节", desc: "不先选工具，先说你想做成什么事，再拆出今天能完成的第一个环节。" },
  { href: "/cases", title: "直接看实战案例", desc: "从办公、Dify、AI编程和内容创作案例里，找一个能照着做的场景。" },
]

const installFirst = [
  { href: "/claude-code-deepseek", label: "Claude Code 安装先看这里", note: "Windows npm.ps1 红字、Node.js、npm.cmd、版本号验证，一步一步复制。" },
  { href: "/news/news-62", label: "1分钟直接跑通能用", note: "不先讲 API Key 和模型名，先把电脑里的 Claude Code 装成功。" },
  { href: "/codex", label: "Codex 安装与配置", note: "桌面版、终端启动、API Key、中转站配置和常见卡住问题。" },
  { href: "/deepseek-api-key", label: "DeepSeek API Key 申请", note: "注册、创建密钥、充值额度、填到工具里的最短路径。" },
  { href: "/learn/2", label: "OpenClaw 接 DeepSeek V4", note: "WSL2、Ubuntu、初始化向导、OpenAI Compatible 填法和模型报错处理。" },
  { href: "/learn/2", label: "Hermes 接 DeepSeek V4", note: "先确认官方安装来源，再按 OpenAI/Anthropic Compatible 两种方式接入。" },
  { href: "/news/news-67", label: "Ollama 本地模型安装", note: "Windows/Mac 下载、打开命令提示符、复制 ollama run 命令和报错处理。" },
  { href: "/dify", label: "Dify 网页版入门", note: "不用装软件，先注册登录，再搭一个能回答文档问题的助手。" },
]

const topicGroups = [
  {
    title: "热门工具教程",
    desc: "先学现在用户最常用、最容易产生价值的主流工具。",
    links: [
      { href: "/chatgpt", label: "ChatGPT怎么用", note: "对话、写作、文件分析、图像生成和多模态任务" },
      { href: "/deepseek", label: "DeepSeek怎么用", note: "中文问答、推理、代码和低成本使用" },
      { href: "/ai-tools", label: "2026主流AI工具怎么选", note: "ChatGPT、DeepSeek、Kimi、豆包、Gemini、图像、视频、Agent和编程工具" },
      { href: "/deepseek-api-key", label: "DeepSeek API Key怎么申请", note: "注册、模型选择、接入和常见报错" },
      { href: "/claude-code-deepseek", label: "Claude Code接入DeepSeek V4", note: "官方接口、Windows/Mac 配置、模型选择和报错排查" },
      { href: "/claude-code-proxy", label: "Claude Code中转站教程", note: "国内使用、Anthropic兼容接口、base_url和安全判断" },
      { href: "/dify", label: "Dify教程", note: "知识库、AI客服、工作流和DeepSeek接入" },
      { href: "/topics/dify", label: "Dify专题路线", note: "从教程、知识库、排查清单到社区实战案例" },
      { href: "/dify-knowledge-base", label: "Dify知识库怎么搭建", note: "RAG、文档上传、召回设置和答非所问" },
      { href: "/cursor", label: "Cursor怎么用", note: "AI编程、Next.js项目和安全改代码方法" },
    ],
  },
  {
    title: "创作与办公教程",
    desc: "适合内容创作、短视频、PPT、文档和日常办公提效。",
    links: [
      { href: "/ai-image-tools", label: "AI绘图工具推荐", note: "ChatGPT Image、Nano Banana、Midjourney、即梦、FLUX和Firefly" },
      { href: "/jimeng-prompts", label: "即梦AI绘图提示词怎么写", note: "头像、海报、电商主图和短视频素材" },
      { href: "/ai-writing-tools", label: "AI写作工具推荐", note: "ChatGPT、DeepSeek、Kimi、豆包、Claude、Gemini和营销写作工具" },
      { href: "/ai-video-tools", label: "AI视频工具推荐", note: "Sora、Veo、可灵、Seedance、Runway、海螺和剪映" },
      { href: "/ai-office-tools", label: "AI办公工具推荐", note: "Microsoft 365 Copilot、ChatGPT、Kimi、Gamma、Dify、n8n和Zapier" },
      { href: "/gamma-ppt", label: "Gamma怎么做PPT", note: "AI PPT生成、中文提示词、导出和修改" },
      { href: "/ai-ppt-tools", label: "AI PPT工具推荐", note: "Gamma、Canva、PPT Master和汇报生成" },
    ],
  },
  {
    title: "进阶实战教程",
    desc: "从单个工具走向 Agent、自动化、编程和工作流。",
    links: [
      { href: "/agent", label: "Agent教程", note: "Manus、Dify、Coze、n8n、Zapier、LangGraph、OpenAI Agents SDK和Google ADK" },
      { href: "/ai-coding", label: "AI编程工具推荐", note: "Codex、Claude Code、Cursor、Windsurf、Copilot、Lovable、v0和Bolt" },
      { href: "/topics/claude-code-deepseek", label: "Claude Code + DeepSeek专题", note: "教程、国内中转站、社区案例和项目提示词模板" },
      { href: "/codex", label: "Codex国内使用指南", note: "Agent编程、项目修改和工程任务" },
      { href: "/workflows", label: "AI工作流自动化", note: "日报、客服、线索、内容和监控流程" },
      { href: "/models", label: "AI模型排行榜", note: "模型能力、成本、场景和替代方案" },
      { href: "/community", label: "社区实战问答", note: "真实问题、踩坑经验和技术求助" },
      { href: "/cases", label: "AI实战案例库", note: "按办公、Dify、AI编程、绘图和工作流整理案例" },
    ],
  },
]

const caseStudies = [
  { href: "/community/post-48", title: "AI 新手第一周学习安排表", tag: "零基础", desc: "从注册工具、上传文档、写周报、做 PPT 到尝试 Bot，一周跑完整个入门路径。" },
  { href: "/community/post-39", title: "用 AI 写周报的稳定流程", tag: "办公", desc: "先列事实，再分类，再润色，避免 AI 写出空话和不存在的成绩。" },
  { href: "/community/post-40", title: "Excel 交给 AI 前的清洗动作", tag: "表格", desc: "取消合并单元格、统一字段和单位，让 AI 分析更稳。" },
  { href: "/community/post-41", title: "Dify 知识库答非所问排查", tag: "Dify", desc: "从切分、标题、Top K 和引用规则入手，减少客服 Bot 乱答。" },
  { href: "/community/post-51", title: "Claude Code 接入 DeepSeek V4 最小配置", tag: "AI编程", desc: "用官方 Anthropic 兼容接口先跑通，再处理模型名、中转站和任务边界。" },
  { href: "/community/post-42", title: "Cursor 新手的改动边界", tag: "编程", desc: "指定文件范围、禁止无关重构、先列计划，让 AI 编程更可控。" },
  { href: "/community/post-47", title: "资料发给 AI 前如何脱敏", tag: "安全", desc: "客户、合同、报价、手机号和 API Key 的脱敏处理清单。" },
]

const tutorialJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "AI教程大全",
  description: "零基础学AI、主流AI工具、DeepSeek、Agent、AI视频、AI编程、AI办公和实战教程集合。",
  url: "https://www.xiaobaiai.cn/tutorials",
  inLanguage: "zh-CN",
  isPartOf: {
    "@type": "WebSite",
    name: "小白AI",
    url: "https://www.xiaobaiai.cn",
  },
  mainEntity: {
    "@type": "ItemList",
    itemListElement: [...installFirst, ...topicGroups.flatMap((group) => group.links)]
      .map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
        url: `https://www.xiaobaiai.cn${item.href}`,
      })),
  },
}

export default function TutorialsPage() {
  return (
    <div style={{ background: "#000", minHeight: "100vh", fontFamily: "'Noto Sans SC', sans-serif", position: "relative", overflow: "hidden" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(tutorialJsonLd) }} />
      <MathRain />
      <NavBar />
      <main style={{ maxWidth: 1120, margin: "0 auto", padding: "64px 60px 104px", position: "relative", zIndex: 10, background: "rgba(0,0,0,0.9)" }} className="max-sm:px-4">
        <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.35em", color: "#7a6230", textTransform: "uppercase", marginBottom: 12, fontWeight: 900 }}>AI Tutorials</p>
        <h1 style={{ fontSize: 42, color: "#fff", fontWeight: 900, lineHeight: 1.22, marginBottom: 16 }}>AI教程大全：零基础学AI、AI工具教程和实战指南</h1>
        <p style={{ fontSize: 16, color: "#ccc", lineHeight: 1.9, maxWidth: 840, marginBottom: 28 }}>
          这里把小白AI站内最适合新手的教程集中起来。先搜你要做的事，不懂安装、下载、打开终端，也从第一步开始看。
        </p>

        <form action="/search" style={{ display: "flex", alignItems: "center", background: "rgba(8,8,8,0.94)", border: "1px solid #2a2a2a", borderRadius: 10, maxWidth: 680, marginBottom: 24 }}>
          <Search size={15} style={{ marginLeft: 14, color: "#777", flexShrink: 0 }} />
          <input
            name="q"
            type="search"
            placeholder="搜索教程：Claude Code 安装、Node.js、Dify 知识库、AI PPT、视频生成"
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", padding: "13px 14px", fontSize: 13, fontWeight: 600, color: "#fff", fontFamily: "'Noto Sans SC', sans-serif", minWidth: 0 }}
          />
          <button type="submit" style={{ marginRight: 6, height: 36, padding: "0 15px", borderRadius: 8, border: "1px solid #7a6230", background: "rgba(201,168,76,0.12)", color: "#e8c96a", fontSize: 12, fontWeight: 950, cursor: "pointer" }}>搜索</button>
        </form>

        <section style={{ marginBottom: 36 }}>
          <div style={{ marginBottom: 14 }}>
            <h2 style={{ fontSize: 22, color: "#fff", fontWeight: 900, marginBottom: 8 }}>先把工具装好</h2>
            <p style={{ fontSize: 14, color: "#aaa", lineHeight: 1.8 }}>
              安装类教程放在前面。小白先跟着复制命令，看到版本号或登录成功，再进入后面的实战任务。
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
            {installFirst.map((item) => (
              <Link key={item.href} href={item.href} style={{ display: "block", textDecoration: "none", border: "1px solid #2a1f10", background: "rgba(201,168,76,0.055)", borderRadius: 10, padding: "18px 20px" }}>
                <h3 style={{ fontSize: 16, color: "#fff", fontWeight: 900, marginBottom: 8 }}>{item.label}</h3>
                <p style={{ fontSize: 13, color: "#cfcfcf", lineHeight: 1.75 }}>{item.note}</p>
              </Link>
            ))}
          </div>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12, marginBottom: 42 }}>
          {quickStart.map((item) => (
            <Link key={item.href} href={item.href} style={{ textDecoration: "none", border: "1px solid #2a1f10", background: "rgba(201,168,76,0.045)", borderRadius: 10, padding: "20px 22px", display: "block" }}>
              <h2 style={{ fontSize: 17, color: "#fff", fontWeight: 900, marginBottom: 8 }}>{item.title}</h2>
              <p style={{ fontSize: 13, color: "#cfcfcf", lineHeight: 1.8 }}>{item.desc}</p>
            </Link>
          ))}
        </section>

        {topicGroups.map((group) => (
          <section key={group.title} style={{ marginBottom: 44 }}>
            <div style={{ marginBottom: 16 }}>
              <h2 style={{ fontSize: 23, color: "#fff", fontWeight: 900, marginBottom: 8 }}>{group.title}</h2>
              <p style={{ fontSize: 14, color: "#aaa", lineHeight: 1.8 }}>{group.desc}</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
              {group.links.map((item) => (
                <Link key={item.href} href={item.href} style={{ display: "block", textDecoration: "none", border: "1px solid #1a1a1a", background: "rgba(255,255,255,0.025)", borderRadius: 10, padding: "18px 20px" }}>
                  <h3 style={{ fontSize: 16, color: "#fff", fontWeight: 900, marginBottom: 8 }}>{item.label}</h3>
                  <p style={{ fontSize: 13, color: "#bbb", lineHeight: 1.75 }}>{item.note}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}

        <section style={{ marginBottom: 44 }}>
          <div style={{ marginBottom: 16 }}>
            <h2 style={{ fontSize: 23, color: "#fff", fontWeight: 900, marginBottom: 8 }}>实战案例精选</h2>
            <p style={{ fontSize: 14, color: "#aaa", lineHeight: 1.8 }}>不想先看概念，可以直接从这些真实场景开始：照着做一遍，再回到学习路径补基础。</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
            {caseStudies.map((item) => (
              <Link key={item.href} href={item.href} style={{ display: "block", textDecoration: "none", border: "1px solid #1a1a1a", background: "rgba(255,255,255,0.025)", borderRadius: 10, padding: "18px 20px" }}>
                <span style={{ display: "inline-flex", border: "1px solid #7a6230", color: "#e8c96a", borderRadius: 999, padding: "2px 8px", fontSize: 10, fontWeight: 900, marginBottom: 10 }}>{item.tag}</span>
                <h3 style={{ fontSize: 16, color: "#fff", fontWeight: 900, marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: "#bbb", lineHeight: 1.75 }}>{item.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        <section style={{ border: "1px solid #2a1f10", background: "rgba(201,168,76,0.04)", borderRadius: 12, padding: "24px 26px" }}>
          <h2 style={{ fontSize: 20, color: "#fff", fontWeight: 900, marginBottom: 10 }}>不知道从哪篇开始？</h2>
          <p style={{ fontSize: 14, color: "#ccc", lineHeight: 1.9, marginBottom: 18 }}>
            如果你是第一次系统学习 AI，先走学习路径；如果你已经有具体想做成的事，直接从 0 到 1 拆出第一个可执行环节。
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href="/learn" className="btn-primary" style={{ textDecoration: "none" }}>进入学习路径</Link>
            <Link href="/start" className="btn-outline" style={{ textDecoration: "none" }}>从0到1开始</Link>
            <Link href="/cases" className="btn-outline" style={{ textDecoration: "none" }}>看实战案例库</Link>
            <Link href="/ai-tools" className="btn-outline" style={{ textDecoration: "none" }}>查看AI工具大全</Link>
          </div>
        </section>
      </main>
    </div>
  )
}
