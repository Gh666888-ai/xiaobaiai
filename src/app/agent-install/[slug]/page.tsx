import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { AlertTriangle, ArrowLeft, CheckCircle2, ExternalLink, KeyRound, Play, TerminalSquare } from "lucide-react"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"
import { agentGuideBySlug, agentInstallGuides } from "@/data/agent-install-guides"

type PageProps = {
  params: { slug: string }
}

export function generateStaticParams() {
  return agentInstallGuides.map((guide) => ({ slug: guide.slug }))
}

export function generateMetadata({ params }: PageProps): Metadata {
  const guide = agentGuideBySlug.get(params.slug)
  if (!guide) {
    return {
      title: "Agent安装教程不存在 - 小白AI",
    }
  }

  return {
    title: `${guide.title} - 小白AI主流Agent安装教程`,
    description: `${guide.name} 小白安装教程：${guide.tagline}，包含启动方式、常见报错和 DeepSeek V4、Kimi、OpenAI API 接入方式。`,
    keywords: [guide.name, `${guide.name}安装`, `${guide.name}教程`, "Agent安装", "DeepSeek V4 API", "Kimi API"],
    alternates: { canonical: `/agent-install/${guide.slug}` },
    openGraph: {
      title: `${guide.name}安装教程 | 小白AI`,
      description: guide.tagline,
      url: `/agent-install/${guide.slug}`,
      images: [{ url: "/xiaobai-mascot-cutout.png", alt: `${guide.name}安装教程` }],
    },
  }
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word", border: "1px solid #2a2a2a", background: "rgba(0,0,0,0.68)", borderRadius: 10, padding: 16, color: "#f4f4f4", fontSize: 13, lineHeight: 1.85, fontFamily: "'JetBrains Mono', monospace" }}>
      {code}
    </pre>
  )
}

export default function AgentInstallDetailPage({ params }: PageProps) {
  const guide = agentGuideBySlug.get(params.slug)
  if (!guide) notFound()

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
    <div style={{ background: "#000", minHeight: "100vh", fontFamily: "'Noto Sans SC', sans-serif", position: "relative", overflow: "hidden" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MathRain />
      <NavBar />
      <main style={{ maxWidth: 1120, margin: "0 auto", padding: "56px clamp(16px,5vw,60px) 104px", position: "relative", zIndex: 10, background: "rgba(0,0,0,0.92)" }}>
        <Link href="/agent-install" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#aaa", textDecoration: "none", fontSize: 13, fontWeight: 900, marginBottom: 22 }}>
          <ArrowLeft size={14} /> 返回主流Agent安装
        </Link>

        <section style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 280px", gap: 18, alignItems: "stretch", marginBottom: 34 }} className="agent-hero-grid">
          <div>
            <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.32em", color: "#7a6230", textTransform: "uppercase", marginBottom: 12, fontWeight: 950 }}>{guide.category}</p>
            <h1 style={{ color: "#fff", fontSize: 42, fontWeight: 950, lineHeight: 1.18, marginBottom: 14 }}>{guide.title}</h1>
            <p style={{ color: "#ccc", fontSize: 16, lineHeight: 1.9, maxWidth: 800, marginBottom: 18 }}>{guide.summary}</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
              <span className="tag tag-gold" style={{ fontSize: 12, color: "#e8c96a", fontWeight: 950 }}>{guide.minutes}</span>
              <span className="tag tag-gold" style={{ fontSize: 12, color: "#e8c96a", fontWeight: 950 }}>{guide.difficulty}</span>
              {guide.bestFor.map((item) => (
                <span key={item} className="tag tag-gray" style={{ fontSize: 12, color: "#aaa", fontWeight: 900 }}>{item}</span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a href="#install" className="btn-primary" style={{ textDecoration: "none" }}>开始安装</a>
              <a href="#api" className="btn-outline" style={{ textDecoration: "none" }}>看 API 接口</a>
              {guide.officialUrl && (
                <a href={guide.officialUrl} target="_blank" rel="noreferrer" className="btn-outline" style={{ textDecoration: "none" }}>
                  官方文档 <ExternalLink size={13} />
                </a>
              )}
            </div>
          </div>

          <aside style={{ border: "1px solid #2a1f10", background: "rgba(201,168,76,0.05)", borderRadius: 12, padding: "20px 22px" }}>
            <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 950, marginBottom: 12 }}>开始前准备</h2>
            <div style={{ display: "grid", gap: 10 }}>
              {guide.requirements.map((item) => (
                <p key={item} style={{ color: "#cfcfcf", fontSize: 13, lineHeight: 1.65, display: "grid", gridTemplateColumns: "18px 1fr", gap: 8 }}>
                  <CheckCircle2 size={14} style={{ color: "#3DA563", marginTop: 3 }} />
                  <span>{item}</span>
                </p>
              ))}
            </div>
          </aside>
        </section>

        <section id="install" style={{ marginBottom: 42 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <TerminalSquare size={18} style={{ color: "#e8c96a" }} />
            <h2 style={{ color: "#fff", fontSize: 25, fontWeight: 950 }}>安装教程</h2>
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            {guide.installSteps.map((step, index) => (
              <div key={step.title} style={{ border: "1px solid #1a1a1a", background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "20px 22px" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: step.command ? 14 : 0 }}>
                  <span style={{ display: "inline-flex", width: 28, height: 28, alignItems: "center", justifyContent: "center", borderRadius: 999, background: "rgba(201,168,76,0.1)", color: "#e8c96a", fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 950, flexShrink: 0 }}>{index + 1}</span>
                  <div>
                    <h3 style={{ color: "#fff", fontSize: 17, fontWeight: 950, lineHeight: 1.4, marginBottom: 7 }}>{step.title}</h3>
                    <p style={{ color: "#bbb", fontSize: 13, lineHeight: 1.8 }}>{step.body}</p>
                  </div>
                </div>
                {step.command && <CodeBlock code={step.command} />}
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 42 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Play size={18} style={{ color: "#e8c96a" }} />
            <h2 style={{ color: "#fff", fontSize: 25, fontWeight: 950 }}>安装好以后怎么启动</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))", gap: 12 }}>
            {guide.startCommands.map((step) => (
              <div key={step.title} style={{ border: "1px solid #2a1f10", background: "rgba(201,168,76,0.045)", borderRadius: 12, padding: "20px 22px" }}>
                <h3 style={{ color: "#fff", fontSize: 17, fontWeight: 950, marginBottom: 8 }}>{step.title}</h3>
                <p style={{ color: "#bbb", fontSize: 13, lineHeight: 1.8, marginBottom: 12 }}>{step.body}</p>
                {step.command && <CodeBlock code={step.command} />}
              </div>
            ))}
          </div>
        </section>

        <section style={{ border: "1px solid #2a1f10", background: "rgba(201,168,76,0.04)", borderRadius: 12, padding: "22px 24px", marginBottom: 42 }}>
          <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 950, marginBottom: 14 }}>第一次让它说什么</h2>
          <div style={{ display: "grid", gap: 10 }}>
            {guide.firstPrompts.map((prompt) => (
              <CodeBlock key={prompt} code={prompt} />
            ))}
          </div>
        </section>

        {guide.ecosystemApps && guide.ecosystemApps.length > 0 && (
          <section style={{ marginBottom: 42 }}>
            <h2 style={{ color: "#fff", fontSize: 25, fontWeight: 950, marginBottom: 14 }}>生态桌面端</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,270px),1fr))", gap: 12 }}>
              {guide.ecosystemApps.map((app) => {
                const inner = (
                  <>
                    <span className="tag" style={{ borderColor: "rgba(82,148,139,0.38)", color: "#9ee5d9", fontSize: 11, fontWeight: 950, marginBottom: 10 }}>{app.type}</span>
                    <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 950, lineHeight: 1.4, marginBottom: 8 }}>{app.name}</h3>
                    <p style={{ color: "#bbb", fontSize: 13, lineHeight: 1.8 }}>{app.description}</p>
                  </>
                )
                return app.href ? (
                  <Link key={app.name} href={app.href} style={{ textDecoration: "none", border: "1px solid rgba(82,148,139,0.28)", background: "rgba(82,148,139,0.045)", borderRadius: 12, padding: "18px 20px", display: "block" }}>
                    {inner}
                  </Link>
                ) : (
                  <div key={app.name} style={{ border: "1px solid rgba(82,148,139,0.28)", background: "rgba(82,148,139,0.045)", borderRadius: 12, padding: "18px 20px" }}>
                    {inner}
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {guide.skillPacks && guide.skillPacks.length > 0 && (
          <section style={{ marginBottom: 42 }}>
            <h2 style={{ color: "#fff", fontSize: 25, fontWeight: 950, marginBottom: 10 }}>必装 Skills</h2>
            <p style={{ color: "#aaa", fontSize: 13, lineHeight: 1.85, marginBottom: 16 }}>
              先把 Agent 本体跑通，再装 Skills。Skills 是能力插件，不是模型；涉及浏览器、文件、消息渠道的权限要一个一个打开。
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,270px),1fr))", gap: 12 }}>
              {guide.skillPacks.map((skill) => (
                <div key={skill.name} style={{ border: "1px solid #2a1f10", background: "rgba(201,168,76,0.04)", borderRadius: 12, padding: "18px 20px" }}>
                  <h3 style={{ color: "#fff", fontSize: 17, fontWeight: 950, lineHeight: 1.4, marginBottom: 8 }}>{skill.name}</h3>
                  <p style={{ color: "#bbb", fontSize: 13, lineHeight: 1.75, marginBottom: 9 }}>{skill.when}</p>
                  <p style={{ color: "#d6c28a", fontSize: 12, lineHeight: 1.75, marginBottom: skill.command ? 12 : 0 }}>{skill.install}</p>
                  {skill.command && <CodeBlock code={skill.command} />}
                </div>
              ))}
            </div>
          </section>
        )}

        <section id="api" style={{ marginBottom: 42 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <KeyRound size={18} style={{ color: "#e8c96a" }} />
            <h2 style={{ color: "#fff", fontSize: 25, fontWeight: 950 }}>模型 API 接口配置</h2>
          </div>
          <p style={{ color: "#aaa", fontSize: 13, lineHeight: 1.85, marginBottom: 16 }}>
            先把 Agent 安装跑通，再接模型。DeepSeek V4、Kimi、OpenAI 是模型 API，不是 Agent；它们负责给 Agent 提供大脑。
          </p>
          <div style={{ display: "grid", gap: 14 }}>
            {guide.apiConnections.map((api) => (
              <div key={api.name} style={{ border: "1px solid #1a1a1a", background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "22px 24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
                  <h3 style={{ color: "#fff", fontSize: 20, fontWeight: 950 }}>{api.name}</h3>
                  <span className="tag tag-gold" style={{ color: "#e8c96a", fontSize: 11, fontWeight: 950 }}>{api.badge}</span>
                </div>
                <p style={{ color: "#bbb", fontSize: 13, lineHeight: 1.8, marginBottom: 14 }}>{api.description}</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,220px),1fr))", gap: 8, marginBottom: api.windowsCommand || api.macCommand ? 14 : 12 }}>
                  {api.fields.map((field) => (
                    <div key={`${api.name}-${field.label}`} style={{ border: "1px solid #222", background: "rgba(0,0,0,0.24)", borderRadius: 9, padding: "11px 12px" }}>
                      <p style={{ color: "#888", fontSize: 11, fontWeight: 900, marginBottom: 5 }}>{field.label}</p>
                      <p style={{ color: "#f0d77a", fontSize: 13, fontWeight: 950, lineHeight: 1.45, wordBreak: "break-word" }}>{field.value}</p>
                    </div>
                  ))}
                </div>
                {(api.windowsCommand || api.macCommand) && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))", gap: 12, marginBottom: 12 }}>
                    {api.windowsCommand && (
                      <div>
                        <p style={{ color: "#e8c96a", fontSize: 13, fontWeight: 950, marginBottom: 8 }}>Windows PowerShell 复制</p>
                        <CodeBlock code={api.windowsCommand} />
                      </div>
                    )}
                    {api.macCommand && (
                      <div>
                        <p style={{ color: "#e8c96a", fontSize: 13, fontWeight: 950, marginBottom: 8 }}>Mac / Linux / WSL 复制</p>
                        <CodeBlock code={api.macCommand} />
                      </div>
                    )}
                  </div>
                )}
                <div style={{ display: "grid", gap: 7 }}>
                  {api.notes.map((note) => (
                    <p key={note} style={{ color: "#aaa", fontSize: 12, lineHeight: 1.7, display: "grid", gridTemplateColumns: "16px 1fr", gap: 7 }}>
                      <CheckCircle2 size={13} style={{ color: "#3DA563", marginTop: 4 }} />
                      <span>{note}</span>
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 42 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <AlertTriangle size={18} style={{ color: "#e8c96a" }} />
            <h2 style={{ color: "#fff", fontSize: 25, fontWeight: 950 }}>常见问题</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,270px),1fr))", gap: 12 }}>
            {guide.commonIssues.map((issue) => (
              <div key={issue.title} style={{ border: "1px solid #4a251f", background: "rgba(180,60,40,0.07)", borderRadius: 12, padding: "18px 20px" }}>
                <h3 style={{ color: "#ffb199", fontSize: 16, fontWeight: 950, lineHeight: 1.4, marginBottom: 8 }}>{issue.title}</h3>
                <p style={{ color: "#d8c8bd", fontSize: 13, lineHeight: 1.8, marginBottom: issue.command ? 12 : 0 }}>{issue.solution}</p>
                {issue.command && <CodeBlock code={issue.command} />}
              </div>
            ))}
          </div>
        </section>

        <section style={{ border: "1px solid #2a1f10", background: "rgba(201,168,76,0.04)", borderRadius: 12, padding: "22px 24px" }}>
          <h2 style={{ color: "#fff", fontSize: 21, fontWeight: 950, marginBottom: 14 }}>其他 Agent 安装</h2>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {otherGuides.map((item) => (
              <Link key={item.slug} href={`/agent-install/${item.slug}`} className="btn-outline" style={{ textDecoration: "none" }}>{item.name}</Link>
            ))}
          </div>
        </section>
      </main>
      <style>{`
        @media (max-width: 820px) {
          .agent-hero-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
