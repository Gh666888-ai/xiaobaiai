import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Bot, BriefcaseBusiness, CheckCircle2, Code2, FileText, Home, Palette, Rocket, Sparkles } from "lucide-react"
import { NavBar } from "@/components/NavBar"
import { news } from "@/data/news"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata: Metadata = {
  title: "实战案例 - 小白AI从下载安装到项目交付的可照做案例",
  description:
    "小白AI实战案例页，把教程资讯整理成能照着做的项目路线，覆盖Agent安装、模型API接入、小程序上线、知识库客服、自动化、AI漫剧、办公接单和在家创业。",
  keywords: ["小白AI实战案例", "AI实战教程", "Agent实战", "小程序上线教程", "AI副业案例", "AI教程实操", "AI在家创业"],
  alternates: { canonical: "/member-cases" },
  openGraph: {
    title: "实战案例 | 小白AI",
    description: "不是看资讯，而是照着做出一个能交付的 AI 项目结果。",
    url: "/member-cases",
    images: [{ url: "/xiaobai-mascot-cutout.png", alt: "小白AI 实战案例" }],
  },
}

const featuredCases = [
  {
    icon: Code2,
    title: "指挥 Agent 做一个微信小程序并上线",
    audience: "适合想做应用、工具、客户项目的人",
    outcome: "一个能提交审核的小程序版本",
    steps: ["写清楚小程序要解决什么问题", "让 Agent 拆页面、写代码、修报错", "真机预览、提交审核、发布"],
    href: "/agent-mini-program",
    tone: "cyan",
  },
  {
    icon: Bot,
    title: "安装 Claude Code 并接入国内模型 API",
    audience: "适合想让 Agent 改项目、写代码的人",
    outcome: "一个能启动、能读项目、能改小功能的工程 Agent",
    steps: ["先选模型大脑，比如 Minimax 或 DeepSeek", "安装 Node.js 和 Claude Code", "配置 API、启动、跑一次真实任务"],
    href: "/agent-install/claude-code",
    tone: "gold",
  },
  {
    icon: BriefcaseBusiness,
    title: "搭一个企业知识库客服",
    audience: "适合企业、门店、团队做资料问答",
    outcome: "一个能按资料回答问题的客服 Bot",
    steps: ["整理 FAQ 和产品资料", "上传到 Dify 或同类平台", "设置边界、测试问题、接人工"],
    href: "/dify-knowledge-base",
    tone: "green",
  },
  {
    icon: Palette,
    title: "做一集 AI 漫剧样片方案",
    audience: "适合在家做内容、账号、短剧方向的人",
    outcome: "角色、分镜、画面提示词和配音清单",
    steps: ["先确定题材和主角", "用模板生成分镜和画面提示词", "检查风格统一，再进入制作工具"],
    href: "/missions/ai-comic-video-first-episode",
    tone: "purple",
  },
]

const quickPaths = [
  { icon: Home, label: "个人在家创业", desc: "先做样稿、样片、作品集，不一上来谈赚钱。", href: "/start" },
  { icon: BriefcaseBusiness, label: "企业流程提效", desc: "先做知识库、日报、SOP、客服和资料整理。", href: "/missions/dify-knowledge-base-bot" },
  { icon: Bot, label: "训练自己的 Agent", desc: "安装 Agent、配模型、设人设、设记忆和验收标准。", href: "/agent-install" },
  { icon: Rocket, label: "做真实项目交付", desc: "让 Agent 写代码、跑检查、上线，再沉淀复盘。", href: "/agent-mini-program" },
]

const tutorialGroups = [
  {
    title: "Agent 安装和模型接入",
    desc: "先解决能不能启动、模型怎么选、API 怎么填、报错怎么修。",
    match: /Claude Code|Codex|DeepSeek|中转站|Ollama|Agent到底|OpenClaw|Chatbox|API|模型/i,
  },
  {
    title: "应用、小程序和代码项目",
    desc: "从需求、指挥 Agent 写代码、检查、预览到上线。",
    match: /代码|编程|小程序|Claude|Codex|ClawX|应用|上线|网站/i,
  },
  {
    title: "知识库客服和企业流程",
    desc: "把 FAQ、资料、客服和自动化流程沉淀下来。",
    match: /Dify|客服|知识库|Coze|n8n|自动化|飞书|微信|流程/i,
  },
  {
    title: "个人在家和内容副业",
    desc: "先做可展示的作品、文案、样片、账号内容和复盘。",
    match: /AI绘画|商用|Prompt|个人|写作|知识管理|内容|视频|文案|漫剧|小红书/i,
  },
]

const tutorialItems = news
  .filter((item) => item.category === "教程资源")
  .sort((a, b) => b.importance - a.importance)

function pickGroupItems(match: RegExp) {
  return tutorialItems.filter((item) => match.test(`${item.title} ${item.summary} ${item.content || ""}`)).slice(0, 5)
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "小白AI实战案例",
  description: "把教程资讯整理成能照着做的 AI 实战案例。",
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
    <div className="casePage">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <NavBar />
      <main className="caseMain">
        <section className="caseHero">
          <div className="caseHeroText">
            <p className="caseEyebrow">实战案例</p>
            <h1>看完不是收藏，是照着做出一个结果</h1>
            <p>
              这里放的不是普通新闻，也不是工具目录。每个案例都按“小白能不能跟着完成”来整理：先明确目标，再选工具，再一步一步做出能验收的东西。
            </p>
          </div>
          <div className="caseHeroPanel">
            <span><CheckCircle2 size={16} /> 有明确产出</span>
            <span><CheckCircle2 size={16} /> 有工具入口</span>
            <span><CheckCircle2 size={16} /> 有踩坑处理</span>
            <span><CheckCircle2 size={16} /> 后续会沉淀成会员定制路线</span>
          </div>
        </section>

        <section className="quickPathGrid" aria-label="实战方向">
          {quickPaths.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.label} href={item.href} className="quickPathCard">
                <Icon size={20} />
                <strong>{item.label}</strong>
                <span>{item.desc}</span>
              </Link>
            )
          })}
        </section>

        <section className="sectionBlock" id="featured">
          <div className="sectionHead">
            <p>先看这四个</p>
            <h2>能代表小白AI价值的实战路线</h2>
          </div>
          <div className="featuredGrid">
            {featuredCases.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.href} href={item.href} className={`featuredCase tone-${item.tone}`}>
                  <div className="featuredTop">
                    <span className="caseIcon"><Icon size={22} /></span>
                    <span className="caseOutcome">{item.outcome}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.audience}</p>
                  <ol>
                    {item.steps.map((step) => <li key={step}>{step}</li>)}
                  </ol>
                  <span className="caseLink">打开案例 <ArrowRight size={14} /></span>
                </Link>
              )
            })}
          </div>
        </section>

        <section className="sectionBlock">
          <div className="sectionHead">
            <p>教程沉淀区</p>
            <h2>把资讯里的教程搬成可落地案例</h2>
          </div>
          <div className="tutorialGroupList">
            {tutorialGroups.map((group) => {
              const items = pickGroupItems(group.match)
              return (
                <section key={group.title} className="tutorialGroup">
                  <div className="tutorialGroupHead">
                    <h3>{group.title}</h3>
                    <p>{group.desc}</p>
                  </div>
                  {items.length ? (
                    <div className="tutorialLinks">
                      {items.map((item) => (
                        <Link key={item.id} href={`/news/${item.id}`} className="tutorialLink">
                          <FileText size={15} />
                          <span>{item.title}</span>
                          <ArrowRight size={14} />
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="emptyGroup">这组还在整理，后面会补成可照做的案例。</p>
                  )}
                </section>
              )
            })}
          </div>
        </section>

        <section className="caseBottom">
          <div>
            <p className="caseEyebrow">下一步</p>
            <h2>现在先不收会员费，先把案例做厚</h2>
            <p>后面收费的不是“看几篇文章”，而是按职业和目标给用户定制工具、Agent、Skill、任务路线和验收标准。现在先把这些能力在页面上铺出来。</p>
          </div>
          <Link href="/community/new" className="bottomButton">提交你的实战案例 <Sparkles size={16} /></Link>
        </section>
      </main>
      <style>{`
        .casePage {
          min-height: 100vh;
          background: linear-gradient(180deg,#07100f 0%,#0b0d0c 46%,#070707 100%);
          color: #f8f3e6;
          font-family: 'Noto Sans SC', sans-serif;
        }
        .caseMain {
          width: min(1120px, calc(100% - 32px));
          margin: 0 auto;
          padding: 40px 0 90px;
        }
        .caseHero {
          min-height: 360px;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 330px;
          gap: 24px;
          align-items: center;
          border: 1px solid rgba(233,215,165,0.13);
          background: rgba(244,240,226,0.04);
          border-radius: 18px;
          padding: clamp(24px,4vw,42px);
          box-shadow: 0 24px 70px rgba(0,0,0,0.28);
        }
        .caseEyebrow {
          color: #d8bf76;
          font-size: 15px;
          font-weight: 950;
          margin: 0 0 10px;
        }
        .caseHero h1 {
          color: #f8f3e6;
          font-size: clamp(34px,6vw,58px);
          font-weight: 950;
          line-height: 1.12;
          margin: 0;
          letter-spacing: 0;
        }
        .caseHeroText > p:last-child {
          color: #c8c8bd;
          font-size: 17px;
          font-weight: 850;
          line-height: 1.8;
          margin: 16px 0 0;
          max-width: 720px;
        }
        .caseHeroPanel {
          display: grid;
          gap: 10px;
        }
        .caseHeroPanel span {
          min-height: 48px;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid rgba(216,191,118,0.18);
          background: rgba(0,0,0,0.22);
          border-radius: 13px;
          padding: 12px 14px;
          color: #fff4c9;
          font-size: 15px;
          font-weight: 900;
        }
        .caseHeroPanel svg {
          color: #d8bf76;
          flex-shrink: 0;
        }
        .quickPathGrid {
          display: grid;
          grid-template-columns: repeat(4,minmax(0,1fr));
          gap: 10px;
          margin: 18px 0 34px;
        }
        .quickPathCard {
          min-height: 132px;
          border: 1px solid rgba(216,191,118,0.16);
          background: rgba(0,0,0,0.2);
          border-radius: 14px;
          padding: 18px;
          color: #aaa59a;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          gap: 9px;
        }
        .quickPathCard svg {
          color: #d8bf76;
        }
        .quickPathCard strong {
          color: #fff4c9;
          font-size: 19px;
          font-weight: 950;
          line-height: 1.35;
        }
        .quickPathCard span {
          color: #aaa59a;
          font-size: 14px;
          font-weight: 850;
          line-height: 1.65;
        }
        .sectionBlock {
          border-top: 1px solid rgba(255,255,255,0.08);
          padding-top: 26px;
          margin-top: 26px;
        }
        .sectionHead {
          margin-bottom: 16px;
        }
        .sectionHead p {
          color: #d8bf76;
          font-size: 14px;
          font-weight: 950;
          margin: 0 0 7px;
        }
        .sectionHead h2 {
          color: #f8f3e6;
          font-size: clamp(26px,3.6vw,38px);
          font-weight: 950;
          line-height: 1.2;
          margin: 0;
          letter-spacing: 0;
        }
        .featuredGrid {
          display: grid;
          grid-template-columns: repeat(2,minmax(0,1fr));
          gap: 14px;
        }
        .featuredCase {
          --tone: #d8bf76;
          min-height: 315px;
          border: 1px solid color-mix(in srgb, var(--tone) 32%, transparent);
          background: linear-gradient(135deg, color-mix(in srgb, var(--tone) 10%, transparent), rgba(0,0,0,0.28));
          border-radius: 16px;
          padding: 22px;
          color: #c8c8bd;
          text-decoration: none;
          display: flex;
          flex-direction: column;
        }
        .tone-cyan { --tone: #62d9df; }
        .tone-gold { --tone: #d8bf76; }
        .tone-green { --tone: #76d89c; }
        .tone-purple { --tone: #b692ff; }
        .featuredTop {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: center;
          margin-bottom: 15px;
        }
        .caseIcon {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #07100f;
          background: var(--tone);
          box-shadow: 0 0 24px color-mix(in srgb, var(--tone) 35%, transparent);
          flex-shrink: 0;
        }
        .caseOutcome {
          color: var(--tone);
          font-size: 12px;
          font-weight: 950;
          line-height: 1.45;
          text-align: right;
        }
        .featuredCase h3 {
          color: #fff;
          font-size: 24px;
          font-weight: 950;
          line-height: 1.32;
          margin: 0 0 9px;
          letter-spacing: 0;
        }
        .featuredCase p {
          color: #aaa59a;
          font-size: 15px;
          font-weight: 850;
          line-height: 1.7;
          margin: 0 0 14px;
        }
        .featuredCase ol {
          margin: 0 0 18px;
          padding-left: 20px;
          color: #d8d2bf;
          font-size: 15px;
          font-weight: 850;
          line-height: 1.8;
        }
        .caseLink {
          margin-top: auto;
          color: var(--tone);
          font-size: 14px;
          font-weight: 950;
          display: inline-flex;
          align-items: center;
          gap: 7px;
        }
        .tutorialGroupList {
          display: grid;
          gap: 12px;
        }
        .tutorialGroup {
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(0,0,0,0.2);
          border-radius: 15px;
          padding: 18px;
        }
        .tutorialGroupHead {
          margin-bottom: 12px;
        }
        .tutorialGroup h3 {
          color: #fff4c9;
          font-size: 21px;
          font-weight: 950;
          margin: 0 0 7px;
        }
        .tutorialGroup p {
          color: #aaa59a;
          font-size: 14px;
          font-weight: 850;
          line-height: 1.65;
          margin: 0;
        }
        .tutorialLinks {
          display: grid;
          grid-template-columns: repeat(auto-fit,minmax(min(100%,260px),1fr));
          gap: 9px;
        }
        .tutorialLink {
          min-height: 54px;
          display: grid;
          grid-template-columns: auto minmax(0,1fr) auto;
          gap: 9px;
          align-items: center;
          border: 1px solid rgba(216,191,118,0.13);
          background: rgba(244,240,226,0.035);
          border-radius: 11px;
          padding: 12px 13px;
          color: #d8d2bf;
          text-decoration: none;
          font-size: 14px;
          font-weight: 900;
          line-height: 1.45;
        }
        .tutorialLink span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .tutorialLink svg {
          color: #d8bf76;
          flex-shrink: 0;
        }
        .emptyGroup {
          color: #7d7a70 !important;
          font-size: 14px !important;
        }
        .caseBottom {
          margin-top: 34px;
          border: 1px solid rgba(216,191,118,0.16);
          background: rgba(244,240,226,0.04);
          border-radius: 18px;
          padding: 24px;
          display: grid;
          grid-template-columns: minmax(0,1fr) auto;
          gap: 18px;
          align-items: center;
        }
        .caseBottom h2 {
          color: #f8f3e6;
          font-size: 26px;
          font-weight: 950;
          margin: 0 0 9px;
        }
        .caseBottom p:not(.caseEyebrow) {
          color: #c8c8bd;
          font-size: 15px;
          font-weight: 850;
          line-height: 1.75;
          margin: 0;
        }
        .bottomButton {
          min-height: 46px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-radius: 12px;
          padding: 12px 16px;
          color: #07100f;
          background: #d8bf76;
          text-decoration: none;
          font-size: 15px;
          font-weight: 950;
          white-space: nowrap;
        }
        @media (max-width: 900px) {
          .caseHero,
          .caseBottom {
            grid-template-columns: 1fr;
          }
          .quickPathGrid,
          .featuredGrid {
            grid-template-columns: repeat(2,minmax(0,1fr));
          }
        }
        @media (max-width: 560px) {
          .caseMain {
            width: min(100% - 24px, 1120px);
            padding-top: 24px;
          }
          .caseHero {
            padding: 22px 18px;
            min-height: 0;
          }
          .quickPathGrid,
          .featuredGrid {
            grid-template-columns: 1fr;
          }
          .featuredCase {
            min-height: 0;
          }
          .caseOutcome {
            text-align: left;
          }
          .featuredTop {
            align-items: flex-start;
            flex-direction: column;
          }
          .bottomButton {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}
