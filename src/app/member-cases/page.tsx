import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Bot, BriefcaseBusiness, Code2, FileText, Palette, Sparkles } from "lucide-react"
import { NavBar } from "@/components/NavBar"
import { news } from "@/data/news"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata: Metadata = {
  title: "会员实战案例 - 小白AI用户项目落地复盘和上线战报",
  description:
    "小白AI会员实战案例页，展示用户如何用 AI 工具、Agent、模型 API 和工作流把真实项目做出来、跑通、上线，并沉淀过程、截图、踩坑和复盘。",
  keywords: ["小白AI实战案例", "AI项目复盘", "Agent项目上线", "小程序上线案例", "AI副业案例", "AI工具落地", "AI在家创业案例"],
  alternates: { canonical: "/member-cases" },
  openGraph: {
    title: "会员实战案例 | 小白AI",
    description: "看别人怎样把 AI 项目从想法、工具、过程、踩坑一路做到上线结果。",
    url: "/member-cases",
    images: [{ url: "/xiaobai-mascot-cutout.png", alt: "小白AI 实战案例" }],
  },
}

const caseReports = [
  {
    icon: Code2,
    title: "家庭提醒小程序从 0 做到体验版",
    maker: "个人开发者 / 在家做项目",
    outcome: "做出 3 个页面、登录、提醒列表，并上传微信体验版",
    tools: "Codex、微信开发者工具、Supabase",
    shipped: "体验版已上传，完成真机预览",
    steps: ["先写一页需求，让 Agent 拆页面和数据表", "每次只让 Agent 改一个小功能，跑通再继续", "上传体验版后把域名、登录、空状态逐项检查"],
    lesson: "不要一开始做支付和会员，先让一个真实流程能在手机上跑起来。",
    href: "/agent-mini-program",
    tone: "cyan",
  },
  {
    icon: Bot,
    title: "用 Claude Code 接国内模型修好站内页面",
    maker: "网站站长 / 小团队",
    outcome: "Agent 能读项目、改组件、跑构建，并修复一个真实页面问题",
    tools: "Claude Code、MiniMax/DeepSeek API、Node.js",
    shipped: "代码合并后构建通过，服务器完成重启",
    steps: ["先把模型 API 配好，确认 Agent 能启动", "让 Agent 先读文件和报计划，不直接大改", "改完跑 typecheck、lint、build，再上线验证"],
    lesson: "Agent 不是一句话许愿机，要让它先读项目、拆任务、跑检查。",
    href: "/agent-install/claude-code",
    tone: "gold",
  },
  {
    icon: BriefcaseBusiness,
    title: "门店 FAQ 做成可用的知识库客服",
    maker: "实体门店 / 客服负责人",
    outcome: "把价格、服务范围、售后规则做成可问答 Bot",
    tools: "Dify、飞书文档、企业微信",
    shipped: "内部试用，客服可复制答案给客户",
    steps: ["先整理 50 条真实高频问题", "上传资料后设置不能乱承诺的回答边界", "用客户原话测试，答不准的补资料再训练"],
    lesson: "知识库不是上传越多越好，先覆盖每天真的会被问到的问题。",
    href: "/dify-knowledge-base",
    tone: "green",
  },
  {
    icon: Palette,
    title: "AI 漫剧账号做出第一集样片包",
    maker: "内容副业 / 短剧方向",
    outcome: "完成角色设定、12 个分镜、画面提示词和配音脚本",
    tools: "即梦、剪映、通用提示词模板",
    shipped: "样片包已整理，可进入正式制作",
    steps: ["先固定主角外观和世界观", "每个镜头单独写画面，不用一句话生成全片", "统一风格后再配音和剪辑"],
    lesson: "AI 漫剧的关键不是炫技，是角色一致、镜头可控、能持续更新。",
    href: "/missions/ai-comic-video-first-episode",
    tone: "purple",
  },
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
  name: "小白AI会员实战案例",
  description: "展示用户把 AI 项目从想法做到上线结果的实战复盘。",
  url: "https://www.xiaobaiai.cn/member-cases",
  inLanguage: "zh-CN",
  mainEntity: {
    "@type": "ItemList",
    itemListElement: [...caseReports, ...tutorialItems.slice(0, 12)].map((item: any, index) => ({
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
        <section className="caseHero" id="featured">
          <div className="sectionHead">
            <p>会员实战案例</p>
            <h1>看别人怎么把项目做完、跑通、上线</h1>
          </div>
          <div className="featuredGrid">
            {caseReports.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.href} href={item.href} className={`featuredCase tone-${item.tone}`}>
                  <div className="featuredTop">
                    <span className="caseIcon"><Icon size={22} /></span>
                    <span className="caseOutcome">{item.shipped}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.maker}</p>
                  <div className="caseResult">
                    <strong>结果</strong>
                    <span>{item.outcome}</span>
                  </div>
                  <div className="caseResult">
                    <strong>工具</strong>
                    <span>{item.tools}</span>
                  </div>
                  <ol>
                    {item.steps.map((step) => <li key={step}>{step}</li>)}
                  </ol>
                  <span className="caseLesson">{item.lesson}</span>
                  <span className="caseLink">查看完整复盘 <ArrowRight size={14} /></span>
                </Link>
              )
            })}
          </div>
        </section>

        <section className="sectionBlock">
          <div className="sectionHead">
            <p>补充资料</p>
            <h2>案例里提到的工具和教程</h2>
            <span>这里不是让用户重新接任务，而是把案例中用过的安装、配置、上线资料放在一起，方便照着复盘。</span>
          </div>
          <div className="tutorialGroupList">
            {tutorialGroups.map((group) => {
              const items = pickGroupItems(group.match)
              return (
                <section key={group.title} className="tutorialGroup">
                  <div className="tutorialGroupHead">
                    <h3>{group.title}</h3>
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
                    <p className="emptyGroup">这组还在整理，后面会补充到案例资料里。</p>
                  )}
                </section>
              )
            })}
          </div>
        </section>

        <section className="caseBottom">
          <div>
            <p className="caseEyebrow">投稿</p>
            <h2>提交你跑通的成功案例</h2>
            <p>这里收的是已经做完的项目复盘，不是接任务。发上线地址、截图、工具、过程、踩坑和结果，验证可行后进入案例库。</p>
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
          min-height: 0;
          display: block;
          align-items: center;
          padding: 0;
          margin-bottom: 22px;
        }
        .caseEyebrow {
          color: #d8bf76;
          font-size: 15px;
          font-weight: 950;
          margin: 0 0 10px;
        }
        .caseHero h1,
        .sectionHead h1 {
          color: #f8f3e6;
          font-size: clamp(32px,5vw,50px);
          font-weight: 950;
          line-height: 1.12;
          margin: 0;
          letter-spacing: 0;
        }
        .sectionBlock {
          border-top: 1px solid rgba(255,255,255,0.08);
          padding-top: 20px;
          margin-top: 20px;
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
        .sectionHead span {
          display: block;
          color: #aaa59a;
          font-size: 16px;
          font-weight: 850;
          line-height: 1.7;
          margin-top: 9px;
          max-width: 720px;
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
          min-height: 278px;
          border: 1px solid color-mix(in srgb, var(--tone) 32%, transparent);
          background: linear-gradient(135deg, color-mix(in srgb, var(--tone) 10%, transparent), rgba(0,0,0,0.28));
          border-radius: 16px;
          padding: 20px;
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
          font-size: 22px;
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
        .caseResult {
          display: grid;
          grid-template-columns: 44px minmax(0,1fr);
          gap: 10px;
          align-items: start;
          border: 1px solid color-mix(in srgb, var(--tone) 18%, transparent);
          background: rgba(255,255,255,0.035);
          border-radius: 12px;
          padding: 10px 12px;
          margin-bottom: 9px;
        }
        .caseResult strong {
          color: var(--tone);
          font-size: 15px;
          font-weight: 950;
          white-space: nowrap;
        }
        .caseResult span {
          color: #efe7d0;
          font-size: 15px;
          font-weight: 850;
          line-height: 1.55;
        }
        .featuredCase ol {
          margin: 6px 0 14px;
          padding-left: 20px;
          color: #d8d2bf;
          font-size: 15px;
          font-weight: 850;
          line-height: 1.8;
        }
        .caseLesson {
          display: block;
          border-left: 3px solid var(--tone);
          color: #fff4c9;
          background: rgba(0,0,0,0.18);
          border-radius: 10px;
          padding: 10px 12px;
          margin: 0 0 15px;
          font-size: 15px;
          font-weight: 900;
          line-height: 1.6;
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
