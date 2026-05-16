import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Search, ShieldCheck } from "lucide-react"
import { NavBar } from "@/components/NavBar"
import { LiveEvaluationNotice } from "@/components/LiveEvaluationNotice"
import { agentInstallGuides } from "@/data/agent-install-guides"
import styles from "@/components/learning/SupportPage.module.css"

const agentDesktopCategories = new Set(["产品方官方 Agent 桌面应用", "第三方 Agent 桌面应用"])
const desktopCategories = new Set(["产品方官方桌面 AI 助理", "第三方桌面 AI 客户端", "桌面知识库 Agent", "本地模型桌面应用"])
const agentDesktopGuides = agentInstallGuides.filter((guide) => agentDesktopCategories.has(guide.category))
const desktopGuides = agentInstallGuides.filter((guide) => desktopCategories.has(guide.category))
const engineeringGuides = agentInstallGuides.filter((guide) => !desktopCategories.has(guide.category) && !agentDesktopCategories.has(guide.category))
const firstChoiceSlugs = ["openclaw", "codex-app", "cherry-studio", "cline"]
const firstChoiceGuides = firstChoiceSlugs
  .map((slug) => agentInstallGuides.find((guide) => guide.slug === slug))
  .filter((guide): guide is (typeof agentInstallGuides)[number] => Boolean(guide))

function CompactGuideList({ guides, accent = "#256d85" }: { guides: typeof agentInstallGuides; accent?: string }) {
  return (
    <div className={styles.grid} style={{ paddingTop: 14 }}>
      {guides.map((guide) => (
        <Link key={guide.slug} href={`/agent-install/${guide.slug}`} className={styles.card} style={{ minHeight: 92, padding: 14 }}>
          <span style={{ minWidth: 0 }}>
            <span style={{ display: "block", color: "#17202a", fontSize: 14, fontWeight: 900, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{guide.name}</span>
            <span style={{ display: "block", color: "#667586", fontSize: 12, fontWeight: 750, marginTop: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{guide.category} · {guide.minutes}</span>
          </span>
          <ArrowRight size={14} style={{ color: accent, flexShrink: 0 }} />
        </Link>
      ))}
    </div>
  )
}

export const metadata: Metadata = {
  title: "主流Agent和桌面AI助理安装 - Codex App、Claude Code、Copilot、Gemini CLI、Cherry Studio教程",
  description: "小白AI整理主流工程 Agent、AI IDE、桌面 AI 客户端和本地模型应用安装教程：Codex App、Claude Code、GitHub Copilot Agent、Gemini CLI、Qwen Code、OpenClaw、Cursor Agent、Cline、Continue、ChatGPT Desktop、Claude Desktop、Cherry Studio、Jan、Msty、LM Studio、Ollama，并区分产品方官方桌面端、第三方客户端、插件和模型 API。",
  keywords: ["主流Agent安装", "Codex App安装", "GitHub Copilot Agent", "Gemini CLI", "Qwen Code", "桌面AI助理", "Claude Code安装", "OpenClaw安装", "Cherry Studio", "DeepSeek V4 API接入"],
  alternates: { canonical: "/agent-install" },
  openGraph: {
    title: "主流Agent和桌面AI助理安装 | 小白AI",
    description: "每个 Agent / 桌面助理一个入口：先安装跑通，再接入 DeepSeek V4、Kimi、OpenAI 等模型 API。",
    url: "/agent-install",
    images: [{ url: "/xiaobai-mascot-cutout.png", alt: "小白AI 主流Agent安装" }],
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "主流Agent和桌面AI助理安装",
  description: "Codex App、Claude Code、Codex CLI、GitHub Copilot Agent、Gemini CLI、Qwen Code、OpenClaw、Hermes、Cursor Agent、Cline、Continue、ChatGPT Desktop、Claude Desktop、Cherry Studio、Jan、Msty、LM Studio、Ollama 安装和模型 API 接入教程。",
  url: "https://www.xiaobaiai.cn/agent-install",
  inLanguage: "zh-CN",
  mainEntity: {
    "@type": "ItemList",
    itemListElement: agentInstallGuides.map((guide, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: guide.name,
      url: `https://www.xiaobaiai.cn/agent-install/${guide.slug}`,
    })),
  },
}

export default function AgentInstallPage() {
  return (
    <div className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <NavBar />
      <main className={styles.main}>
        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>Agent Install</p>
            <h1 className={styles.title}>先装好一个 Agent，再让它真正干活</h1>
            <p className={styles.subtitle}>
              这里把 Agent、桌面助理、模型 API 分清楚。先选一个最适合你电脑和任务的入口，跑通启动、模型接入和第一个可验证动作。
            </p>
            <form action="/search" className={styles.searchForm}>
              <Search size={16} style={{ marginLeft: 14, color: "#256d85", flexShrink: 0 }} />
              <input name="q" type="search" placeholder="搜索：Codex App、Claude Code、Gemini CLI、Jan、Cherry Studio、Cline" />
              <button type="submit">搜索</button>
            </form>
          </div>
          <aside className={styles.heroAside}>
            <h2 className={styles.asideTitle}>新手安装顺序</h2>
            <ol className={styles.steps}>
              <li><b>1</b><span>先选一个入口，不要同时装一堆。</span></li>
              <li><b>2</b><span>确认模型、Key、权限和本机路径都能跑通。</span></li>
              <li><b>3</b><span>回到学习项目里，用 Agent 做一个真实小任务。</span></li>
            </ol>
          </aside>
        </section>

        <LiveEvaluationNotice scope="agents" />

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <h2 className={styles.panelTitle}>不知道选哪个，先从这 4 个开始</h2>
              <p className={styles.panelDesc}>一个工程 Agent、一个产品方官方桌面端、一个第三方桌面客户端、一个 VS Code Agent 插件。更多工具已放进下面的完整列表。</p>
            </div>
            <span className={styles.tag}><ShieldCheck size={14} /> Key 不写进仓库</span>
          </div>
          <div className={styles.grid}>
            {firstChoiceGuides.map((guide) => (
              <Link key={guide.slug} href={`/agent-install/${guide.slug}`} className={styles.card}>
                <span className={styles.tag}>{guide.category}</span>
                <h3 className={styles.cardTitle}>{guide.name}</h3>
                <p className={styles.cardText}>{guide.tagline}</p>
                <span className={styles.cardLink}>直接看教程 <ArrowRight size={13} /></span>
              </Link>
            ))}
          </div>
        </section>

        <details className={styles.details}>
          <summary>展开工程 Agent 本体</summary>
          <CompactGuideList guides={engineeringGuides} />
        </details>

        <details className={styles.details}>
          <summary>展开 Agent 桌面端应用</summary>
          <CompactGuideList guides={agentDesktopGuides} />
        </details>

        <details className={styles.details}>
          <summary>展开桌面版 AI 助理应用</summary>
          <CompactGuideList guides={desktopGuides} />
        </details>

        <section className={styles.panel}>
          <h2 className={styles.panelTitle}>小白怎么选第一款？</h2>
          <p className={styles.panelDesc}>
            只是日常对话和写东西，可以先用 ChatGPT Desktop 或 Claude Desktop；想用产品方官方工程 Agent 桌面端，先看 Codex App；想接 DeepSeek V4 做代码任务，先选 OpenClaw、Cline 或 Continue；想用第三方多模型桌面客户端，再选 Cherry Studio、Chatbox、Msty 或 LobeHub；想本地跑模型，再选 LM Studio、Jan、GPT4All 或 Ollama；已经能用终端和 Git，再选 Claude Code、Codex CLI、Gemini CLI 或 Qwen Code。
          </p>
          <div className={styles.actions}>
            <Link href="/agent-install/openclaw" className={styles.primaryButton}>国内新手先跑 OpenClaw</Link>
            <Link href="/agent-install/codex-app" className={styles.secondaryButton}>Codex App 教程</Link>
            <Link href="/agent-install/claude-code" className={styles.secondaryButton}>Claude Code 教程</Link>
            <Link href="/agent-install/cline" className={styles.secondaryButton}>Cline 教程</Link>
          </div>
        </section>
      </main>
    </div>
  )
}
