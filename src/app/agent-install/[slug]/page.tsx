import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, ExternalLink, Play, TerminalSquare } from "lucide-react"
import { NavBar } from "@/components/NavBar"
import { agentGuideBySlug, agentInstallGuides, defaultAgentPostInstallSetup } from "@/data/agent-install-guides"
import { ApiTabs } from "./ApiTabs"
import styles from "@/components/learning/SupportPage.module.css"

type PageProps = {
  params: { slug: string }
}

export function generateStaticParams() {
  return agentInstallGuides.map((guide) => ({ slug: guide.slug }))
}

export function generateMetadata({ params }: PageProps): Metadata {
  const guide = agentGuideBySlug.get(params.slug)
  if (!guide) return { title: "Agent 安装教程不存在 - 小白AI" }

  return {
    title: `${guide.title} - 小白AI Agent 安装教程`,
    description: `${guide.name} 小白安装教程：${guide.tagline}，包含启动方式、常见报错和模型 API 接入方式。`,
    keywords: [guide.name, `${guide.name}安装`, `${guide.name}教程`, "Agent安装", "DeepSeek API", "Kimi API"],
    alternates: { canonical: `/agent-install/${guide.slug}` },
    openGraph: {
      title: `${guide.name} 安装教程 | 小白AI`,
      description: guide.tagline,
      url: `/agent-install/${guide.slug}`,
      images: [{ url: "/xiaobai-mascot-cutout.png", alt: `${guide.name}安装教程` }],
    },
  }
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word", border: "1px solid #dfe7ee", background: "#f7fbfd", borderRadius: 12, padding: 16, color: "#17202a", fontSize: 13, lineHeight: 1.85, fontFamily: "'JetBrains Mono', monospace" }}>
      {code}
    </pre>
  )
}

function ClaudeCodeRoadmapVisual() {
  const stages = [
    { title: "安装底座", text: "Node.js、Git、VS Code、Claude Code。先看到版本号。" },
    { title: "接模型", text: "官方 Claude、DeepSeek、MiniMax、CC Switch 或 Router。先用一句中文测通。" },
    { title: "只读项目", text: "让它读目录、列计划、说明风险，不改文件。" },
    { title: "小改动", text: "限定范围、看 diff、跑 typecheck / test / build。" },
    { title: "加能力", text: "CLAUDE.md、hooks、skills、插件、MCP、子智能体。" },
    { title: "做 MVP", text: "需求、页面、API、验收、README、复盘。" },
  ]

  return (
    <section className={styles.panel}>
      <div className={styles.panelHead}>
        <div>
          <h2 className={styles.panelTitle}>Claude Code 可视学习路线</h2>
          <p className={styles.panelDesc}>从上往下走。不要跳到最后直接做大 App，先把每一层跑通，再进入下一层。</p>
        </div>
      </div>
      <div className={styles.agentRoadmap}>
        <div className={styles.agentRoadmapCanvas}>
          <svg viewBox="0 0 980 520" className={styles.agentRoadmapLines} aria-label="Claude Code 从安装到 MVP 的路线图">
            <defs>
              <marker id="agent-roadmap-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#256d85" />
              </marker>
            </defs>
            <path d="M490 66 V454" stroke="#256d85" strokeWidth="4" strokeLinecap="round" markerEnd="url(#agent-roadmap-arrow)" />
            <path d="M490 136 H292 M490 214 H688 M490 292 H292 M490 370 H688" stroke="#91c0ce" strokeWidth="2" strokeDasharray="8 8" />
          </svg>
          {stages.map((stage, index) => {
            const left = index % 2 === 0 ? 90 : 590
            const top = 28 + index * 76
            return (
              <div key={stage.title} className={styles.agentRoadmapNode} style={{ left, top }}>
                <span>{index + 1}</span>
                <strong>{stage.title}</strong>
                <p>{stage.text}</p>
              </div>
            )
          })}
          <div className={styles.agentRoadmapCore}>
            <strong>新手主线</strong>
            <span>能启动 {"->"} 能接模型 {"->"} 能读项目 {"->"} 能小改 {"->"} 能验收 {"->"} 能复用</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function AgentInstallDetailPage({ params }: PageProps) {
  const guide = agentGuideBySlug.get(params.slug)
  if (!guide) notFound()
  const postInstallSetup = guide.postInstallSetup || defaultAgentPostInstallSetup
  const otherGuides = agentInstallGuides.filter((item) => item.slug !== guide.slug).slice(0, 4)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: guide.title,
    description: guide.summary,
    inLanguage: "zh-CN",
    step: guide.installSteps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.title,
      text: step.body,
    })),
  }

  return (
    <div className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <NavBar />
      <main className={styles.main}>
        <Link href="/agent-install" className={styles.ghostButton} style={{ marginBottom: 16 }}>
          <ArrowLeft size={14} /> 返回 Agent 安装
        </Link>

        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>{guide.category}</p>
            <h1 className={styles.title}>{guide.title}</h1>
            <p className={styles.subtitle}>{guide.summary}</p>
            <div className={styles.pillRow} style={{ marginTop: 18 }}>
              <span className={styles.tag}>{guide.minutes}</span>
              <span className={styles.tag}>{guide.difficulty}</span>
              {guide.bestFor.map((item) => <span key={item} className={styles.tag}>{item}</span>)}
            </div>
            <div className={styles.actions}>
              <a href="#api" className={styles.primaryButton}>先选模型</a>
              <a href="#install" className={styles.secondaryButton}>安装启动</a>
              {guide.officialUrl && (
                <a href={guide.officialUrl} target="_blank" rel="noreferrer" className={styles.secondaryButton}>
                  官方文档 <ExternalLink size={13} />
                </a>
              )}
            </div>
          </div>
          <aside className={styles.heroAside}>
            <h2 className={styles.asideTitle}>开始前准备</h2>
            <ol className={styles.steps}>
              {guide.requirements.map((item, index) => (
                <li key={item}><b>{index + 1}</b><span>{item}</span></li>
              ))}
            </ol>
          </aside>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <h2 className={styles.panelTitle}>先按 3 步跑通</h2>
              <p className={styles.panelDesc}>不要一次看完整页。先确认模型、安装本体、启动验证，能回一句话就算第一阶段完成。</p>
            </div>
          </div>
          <div className={styles.grid}>
            {[
              ["1. 选模型", "云端 API 就准备 Key，本地模型就先启动 LM Studio / Ollama 服务。"],
              ["2. 安装本体", "复制安装命令或打开官方安装包，看到版本号或应用能打开。"],
              ["3. 启动验证", "发一句测试问题，能正常回复，再回到学习任务里实操。"],
            ].map(([title, desc]) => (
              <div key={title} className={styles.card}>
                <h3 className={styles.cardTitle}>{title}</h3>
                <p className={styles.cardText}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <ApiTabs guide={guide} />

        {guide.slug === "claude-code" && <ClaudeCodeRoadmapVisual />}

        <section id="install" className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <h2 className={styles.panelTitle}>安装教程</h2>
              <p className={styles.panelDesc}>按顺序做。遇到命令行报错，先看下方常见问题，不要反复重装。</p>
            </div>
            <TerminalSquare size={24} color="#256d85" />
          </div>
          <div className={styles.sectionDivider}>
            {guide.installSteps.map((step, index) => (
              <div key={step.title} className={styles.details}>
                <h3 className={styles.cardTitle} style={{ fontSize: 18 }}>{index + 1}. {step.title}</h3>
                <p className={styles.panelDesc}>{step.body}</p>
                {step.command && <CodeBlock code={step.command} />}
              </div>
            ))}
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <h2 className={styles.panelTitle}>安装好以后怎么启动</h2>
              <p className={styles.panelDesc}>启动命令和打开方式单独放，避免和安装步骤混在一起。</p>
            </div>
            <Play size={24} color="#256d85" />
          </div>
          <div className={styles.grid}>
            {guide.startCommands.map((step) => (
              <div key={step.title} className={styles.card}>
                <h3 className={styles.cardTitle}>{step.title}</h3>
                <p className={styles.cardText}>{step.body}</p>
                {step.command && <CodeBlock code={step.command} />}
              </div>
            ))}
          </div>
        </section>

        <section className={styles.panel}>
          <h2 className={styles.panelTitle}>跑通验收标准</h2>
          <div className={styles.grid} style={{ marginTop: 16 }}>
            {[
              "能打开工具，或在终端看到版本号。",
              "能输入一句测试问题，并得到一次正常回复。",
              "知道它是 Agent、桌面助手、模型客户端里的哪一种。",
            ].map((item) => (
              <p key={item} className={styles.cardText} style={{ display: "grid", gridTemplateColumns: "20px 1fr", gap: 8, margin: 0 }}>
                <CheckCircle2 size={16} color="#2f7d4d" style={{ marginTop: 4 }} />
                <span>{item}</span>
              </p>
            ))}
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <h2 className={styles.panelTitle}>装好以后做一个 MVP</h2>
              <p className={styles.panelDesc}>安装不是终点。工具能启动以后，马上用一个小任务验证它能不能帮你交付结果。</p>
            </div>
          </div>
          <div className={styles.pathGrid}>
            {[
              { title: "验证安装", text: "先完成一次正常回复、一次文件/项目读取或一次命令验证。", href: "/missions/agent-skill-first-install" },
              { title: "改一个小功能", text: "工程 Agent 跑通后，用真实项目做一个很小的页面或逻辑修改。", href: "/missions/codex-small-feature" },
              { title: "接知识库 Bot", text: "桌面助理或平台工具跑通后，做一个可演示的知识库问答。", href: "/missions/dify-knowledge-base-bot" },
              { title: "回学习路线", text: "MVP 做完以后，继续进入 Agent、自动化或一人公司项目分支。", href: "/learn/subjects/agent-coding" },
            ].map((item, index) => (
              <Link key={item.title} href={item.href} className={styles.pathCard}>
                <span className={styles.pathNumber}>{index + 1}</span>
                <strong className={styles.pathTitle}>{item.title}</strong>
                <p className={styles.pathText}>{item.text}</p>
                <span className={styles.pathAction}>进入 <ArrowRight size={13} /></span>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.panel}>
          <h2 className={styles.panelTitle}>第一次让它说什么</h2>
          <p className={styles.panelDesc}>这些不是装饰文案，是用来确认工具真的能工作的第一组测试。</p>
          <div className={styles.sectionDivider} style={{ marginTop: 16 }}>
            {guide.firstPrompts.map((prompt) => <CodeBlock key={prompt} code={prompt} />)}
          </div>
        </section>

        <section className={styles.panel}>
          <h2 className={styles.panelTitle}>装好后，把它训练成你的 Agent</h2>
          <p className={styles.panelDesc}>模型接好只是有大脑，还要给它岗位、人设、记忆结构、权限边界和验收标准。</p>
          <div className={styles.sectionDivider} style={{ marginTop: 16 }}>
            {postInstallSetup.map((section) => (
              <details key={section.title} className={styles.details}>
                <summary>{section.title}</summary>
                <p className={styles.panelDesc}>{section.why}</p>
                <div className={styles.sectionDivider}>
                  {section.steps.map((step) => (
                    <p key={step} className={styles.cardText} style={{ display: "grid", gridTemplateColumns: "20px 1fr", gap: 8, margin: 0 }}>
                      <CheckCircle2 size={15} color="#2f7d4d" style={{ marginTop: 4 }} />
                      <span>{step}</span>
                    </p>
                  ))}
                </div>
                {section.template && <CodeBlock code={section.template} />}
                {section.checks && section.checks.length > 0 && (
                  <div className={styles.pillRow}>
                    {section.checks.map((check) => <span key={check} className={styles.tag}>{check}</span>)}
                  </div>
                )}
              </details>
            ))}
          </div>
        </section>

        {guide.ecosystemApps && guide.ecosystemApps.length > 0 && (
          <section className={styles.panel}>
            <h2 className={styles.panelTitle}>生态桌面端</h2>
            <div className={styles.grid} style={{ marginTop: 16 }}>
              {guide.ecosystemApps.map((app) => {
                const content = (
                  <>
                    <span className={styles.tag}>{app.type}</span>
                    <h3 className={styles.cardTitle}>{app.name}</h3>
                    <p className={styles.cardText}>{app.description}</p>
                  </>
                )
                return app.href ? <Link key={app.name} href={app.href} className={styles.card}>{content}</Link> : <div key={app.name} className={styles.card}>{content}</div>
              })}
            </div>
          </section>
        )}

        {guide.skillPacks && guide.skillPacks.length > 0 && (
          <section className={styles.panel}>
            <h2 className={styles.panelTitle}>可选 Skills</h2>
            <p className={styles.panelDesc}>先把 Agent 本体跑通，再按真实场景加能力。</p>
            <div className={styles.grid} style={{ marginTop: 16 }}>
              {guide.skillPacks.map((skill) => (
                <div key={skill.name} className={styles.card}>
                  <h3 className={styles.cardTitle}>{skill.name}</h3>
                  <p className={styles.cardText}>{skill.when}</p>
                  <p className={styles.cardText}>{skill.install}</p>
                  {skill.command && <CodeBlock code={skill.command} />}
                </div>
              ))}
            </div>
          </section>
        )}

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <h2 className={styles.panelTitle}>常见问题</h2>
              <p className={styles.panelDesc}>先看症状，再对照解决，不要把模型问题、网络问题和本体安装问题混在一起。</p>
            </div>
            <AlertTriangle size={24} color="#b7791f" />
          </div>
          <div className={styles.grid}>
            {guide.commonIssues.map((issue) => (
              <div key={issue.title} className={styles.card}>
                <h3 className={styles.cardTitle}>{issue.title}</h3>
                <p className={styles.cardText}>{issue.solution}</p>
                {issue.command && <CodeBlock code={issue.command} />}
              </div>
            ))}
          </div>
        </section>

        <section className={styles.panel}>
          <h2 className={styles.panelTitle}>其他 Agent 安装</h2>
          <div className={styles.actions}>
            {otherGuides.map((item) => (
              <Link key={item.slug} href={`/agent-install/${item.slug}`} className={styles.secondaryButton}>{item.name}</Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
