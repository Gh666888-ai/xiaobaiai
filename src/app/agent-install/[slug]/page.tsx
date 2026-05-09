import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { AlertTriangle, ArrowLeft, BrainCircuit, CheckCircle2, ExternalLink, KeyRound, Play, TerminalSquare } from "lucide-react"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"
import { agentGuideBySlug, agentInstallGuides, defaultAgentPostInstallSetup } from "@/data/agent-install-guides"

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

function apiAnchor(apiName: string) {
  if (/MiniMax/i.test(apiName)) return "api-minimax"
  if (/DeepSeek|Claude Code 接入/i.test(apiName)) return "api-deepseek"
  if (/Kimi/i.test(apiName)) return "api-kimi"
  if (/OpenAI/i.test(apiName) || /Codex 官方/i.test(apiName)) return "api-openai"
  if (/本地|Local|LM Studio/i.test(apiName)) return "api-local"
  if (/账号登录/i.test(apiName)) return "api-login"
  return `api-${apiName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
}

function apiButtonLabel(apiName: string) {
  if (/MiniMax/i.test(apiName)) return "MiniMax"
  if (/DeepSeek|Claude Code 接入/i.test(apiName)) return "DeepSeek"
  if (/Kimi/i.test(apiName)) return "Kimi"
  if (/OpenAI/i.test(apiName) || /Codex 官方/i.test(apiName)) return "OpenAI"
  if (/本地|Local|LM Studio/i.test(apiName)) return "本地模型"
  if (/账号登录/i.test(apiName)) return "官方账号"
  return apiName.replace(/^接入\s*/, "")
}

function buildApiSetupSteps(apiName: string) {
  if (/账号登录/i.test(apiName)) {
    return [
      "打开这个桌面应用。",
      "选择官方账号登录，不要找 API Key 输入框。",
      "登录成功后，先发一句“你好”，能正常回复就算跑通。",
      "如果你要用 DeepSeek / Kimi / MiniMax API，换支持自定义 Provider 的工具，比如 Cherry Studio、Chatbox、Cline 或 OpenClaw。",
    ]
  }

  if (/本地|Local|LM Studio/i.test(apiName)) {
    return [
      "先打开 LM Studio 或 Ollama，下载一个电脑能跑得动的模型。",
      "在 LM Studio 里点击 Local Server；Ollama 就先确认模型已经 run 起来。",
      "回到 Agent 或桌面客户端，Provider 选 OpenAI Compatible / Custom。",
      "按下面字段填写 Base URL、API Key、Model。",
      "保存后发一句“你好，请用一句话介绍你自己”，能回复就算接通。",
    ]
  }

  if (/Claude Code 接入/i.test(apiName)) {
    return [
      "先去 DeepSeek 平台拿 API Key。",
      "Windows 复制 PowerShell 配置；Mac / Linux / WSL 复制 export 配置。",
      "把 sk-你的DeepSeek_API_Key 换成自己的 Key。",
      "复制整段到终端回车，最后一行 claude 会直接启动。",
      "启动后问一句“请告诉我当前项目是什么”，能回答就算接通。",
    ]
  }

  return [
    "打开 Agent 或桌面客户端的 Settings / Models / API 设置。",
    "Provider 选择 OpenAI Compatible / Custom；如果是官方 OpenAI，就选 OpenAI。",
    "按下面字段填写 Base URL、API Key、Model。",
    "点击 Save / Enable / Test。",
    "新建一次对话，发“你好，请用一句话介绍你自己”，能回复就算接通。",
  ]
}

function ApiConnectionsSection({ guide }: { guide: NonNullable<ReturnType<typeof agentGuideBySlug.get>> }) {
  const uniqueApiButtons = guide.apiConnections.filter((api, index, list) => (
    list.findIndex((item) => apiButtonLabel(item.name) === apiButtonLabel(api.name)) === index
  ))

  return (
    <section id="api" style={{ marginBottom: 42 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <KeyRound size={18} style={{ color: "#e8c96a" }} />
        <h2 style={{ color: "#fff", fontSize: 25, fontWeight: 950 }}>先选模型 API 或本地模型</h2>
      </div>
      <p style={{ color: "#aaa", fontSize: 14, lineHeight: 1.85, marginBottom: 16 }}>
        Agent 本体只是执行工具，模型才是“大脑”。日常对话可以先用 MiniMax 会员，便宜省事；真正让 Agent 执行代码、资料、自动化任务时，再按需求换 DeepSeek/Kimi/OpenAI 这类云端 API，或者用 LM Studio / Ollama 部署本地模型。
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 10, marginBottom: 16 }} className="agent-run-grid">
        <div style={{ border: "1px solid rgba(232,201,106,0.22)", background: "rgba(201,168,76,0.055)", borderRadius: 10, padding: "14px 16px" }}>
          <p style={{ color: "#e8c96a", fontSize: 13, fontWeight: 950, marginBottom: 6 }}>模型 = Agent 的大脑</p>
          <p style={{ color: "#cfcfcf", fontSize: 12, lineHeight: 1.7 }}>负责理解、推理、写内容、决定下一步怎么做。</p>
        </div>
        <div style={{ border: "1px solid rgba(82,148,139,0.28)", background: "rgba(82,148,139,0.055)", borderRadius: 10, padding: "14px 16px" }}>
          <p style={{ color: "#9ee5d9", fontSize: 13, fontWeight: 950, marginBottom: 6 }}>Agent = 模型的手脚</p>
          <p style={{ color: "#cfcfcf", fontSize: 12, lineHeight: 1.7 }}>负责打开工具、读文件、改代码、跑命令、执行任务。</p>
        </div>
      </div>
      <p style={{ color: "#b9d8d2", fontSize: 13, lineHeight: 1.75, marginBottom: 16 }}>
        小白AI会持续记录各个模型 API 的能力评分和价格变化。正式接入前，先看 <Link href="/models" style={{ color: "#e8c96a", fontWeight: 950 }}>模型排行和价格快照</Link>，不要只凭一篇旧教程决定。
      </p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {uniqueApiButtons.map((api) => (
          <a key={api.name} href={`#${apiAnchor(api.name)}`} style={{ textDecoration: "none", border: "1px solid rgba(232,201,106,0.24)", background: "rgba(201,168,76,0.08)", color: "#f0d77a", borderRadius: 999, padding: "10px 13px", fontSize: 13, fontWeight: 950 }}>
            {apiButtonLabel(api.name)}
          </a>
        ))}
      </div>
      <div style={{ display: "grid", gap: 14 }}>
        {guide.apiConnections.map((api, index) => {
          const setupSteps = buildApiSetupSteps(api.name)
          return (
            <details key={api.name} id={apiAnchor(api.name)} open={index === 0} style={{ border: "1px solid #1a1a1a", background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "0 18px 0" }}>
              <summary style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, cursor: "pointer", listStyle: "none", padding: "18px 2px", color: "#fff", fontSize: 18, fontWeight: 950 }}>
                <span>{apiButtonLabel(api.name)} 配置</span>
                <span className="tag tag-gold" style={{ color: "#e8c96a", fontSize: 11, fontWeight: 950 }}>{api.badge}</span>
              </summary>
              <div style={{ borderTop: "1px solid #202020", padding: "18px 0 22px" }}>
                <h3 style={{ color: "#fff", fontSize: 20, fontWeight: 950, marginBottom: 10 }}>{api.name}</h3>
                <p style={{ color: "#bbb", fontSize: 13, lineHeight: 1.8, marginBottom: 14 }}>{api.description}</p>

                <div style={{ border: "1px solid rgba(82,148,139,0.24)", background: "rgba(82,148,139,0.04)", borderRadius: 10, padding: "15px 16px", marginBottom: 14 }}>
                  <p style={{ color: "#9ee5d9", fontSize: 13, fontWeight: 950, marginBottom: 9 }}>小白照着做</p>
                  <div style={{ display: "grid", gap: 7 }}>
                    {setupSteps.map((step, stepIndex) => (
                      <p key={step} style={{ color: "#cfe6e1", fontSize: 13, lineHeight: 1.75, display: "grid", gridTemplateColumns: "24px 1fr", gap: 8 }}>
                        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 20, height: 20, borderRadius: 999, background: "rgba(82,148,139,0.15)", color: "#9ee5d9", fontSize: 11, fontWeight: 950, marginTop: 2 }}>{stepIndex + 1}</span>
                        <span>{step}</span>
                      </p>
                    ))}
                  </div>
                </div>

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
            </details>
          )
        })}
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
              <a href="#model-choice" className="btn-primary" style={{ textDecoration: "none" }}>先选模型</a>
              <a href="#install" className="btn-outline" style={{ textDecoration: "none" }}>再安装启动</a>
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

        <section style={{ border: "1px solid rgba(201,168,76,0.24)", background: "linear-gradient(135deg,rgba(201,168,76,0.075),rgba(255,255,255,0.026))", borderRadius: 12, padding: "20px 22px", marginBottom: 30 }}>
          <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.2em", color: "#7a6230", textTransform: "uppercase", fontWeight: 950, marginBottom: 8 }}>Xiaobai Quick Run</p>
          <h2 style={{ color: "#fff", fontSize: 23, fontWeight: 950, lineHeight: 1.35, marginBottom: 14 }}>别一次看完整页，先按这 3 步跑通</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 10 }} className="agent-run-grid">
            {[
              { title: "1. 先选模型", desc: "云端 API 就准备 Key；本地模型就先启动 LM Studio / Ollama 服务。" },
              { title: "2. 再安装", desc: "复制安装区命令。看到版本号或应用能打开，说明本体装好了。" },
              { title: "3. 启动验证", desc: "带着模型配置启动，能问一句并正常回复，才算真的跑通。" },
            ].map((item) => (
              <div key={item.title} style={{ border: "1px solid rgba(255,255,255,0.09)", background: "rgba(0,0,0,0.22)", borderRadius: 10, padding: "15px 16px", minHeight: 118 }}>
                <h3 style={{ color: "#fff", fontSize: 17, fontWeight: 950, lineHeight: 1.35, marginBottom: 8 }}>{item.title}</h3>
                <p style={{ color: "#aaa", fontSize: 13, lineHeight: 1.75 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="model-choice" style={{ border: "1px solid rgba(82,148,139,0.28)", background: "rgba(82,148,139,0.052)", borderRadius: 12, padding: "22px 24px", marginBottom: 30 }}>
          <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", gap: 14, flexWrap: "wrap", marginBottom: 12 }}>
            <h2 style={{ color: "#fff", fontSize: 23, fontWeight: 950, lineHeight: 1.35, margin: 0 }}>安装前先决定：用哪一个模型大脑</h2>
            <span style={{ color: "#e8c96a", fontSize: 13, fontWeight: 950, border: "1px solid rgba(232,201,106,0.24)", borderRadius: 999, padding: "7px 10px", background: "rgba(201,168,76,0.06)" }}>模型是大脑，Agent 是手脚</span>
          </div>
          <p style={{ color: "#b9d8d2", fontSize: 14, lineHeight: 1.8, marginBottom: 14 }}>
            刚开始别追最贵模型。先用便宜、稳定、能跑通的方案，等你真的开始做项目、跑 Agent、处理长文档，再换更强模型。
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 10 }} className="agent-run-grid">
            {[
              { title: "日常对话", desc: "可以先选 MiniMax，开会员成本低。先聊天、写文案、问问题，后期再按任务换模型。" },
              { title: "Agent 干活", desc: "需要工具执行、写代码、跑流程时，再去 DeepSeek、Kimi 或 OpenAI 拿 API Key。" },
              { title: "本地模型", desc: "适合隐私资料或想离线用。先用 LM Studio / Ollama 下载模型并开启本地服务。" },
              { title: "官方账号", desc: "ChatGPT Desktop、Claude Desktop 这类应用用官方账号登录，不能直接填 DeepSeek Key。" },
            ].map((item) => (
              <div key={item.title} style={{ border: "1px solid rgba(255,255,255,0.09)", background: "rgba(0,0,0,0.24)", borderRadius: 10, padding: "16px 17px", minHeight: 132 }}>
                <h3 style={{ color: "#fff", fontSize: 17, fontWeight: 950, lineHeight: 1.35, marginBottom: 8 }}>{item.title}</h3>
                <p style={{ color: "#b9d8d2", fontSize: 13, lineHeight: 1.75 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <ApiConnectionsSection guide={guide} />

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

        <section style={{ border: "1px solid rgba(61,165,99,0.28)", background: "rgba(61,165,99,0.06)", borderRadius: 12, padding: "20px 22px", marginBottom: 42 }}>
          <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 950, marginBottom: 12 }}>跑通验收标准</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 10 }} className="agent-run-grid">
            {[
              "你能打开这个工具，或者在终端看到版本号。",
              "你能输入一句测试问题，并得到一次正常回复。",
              "你知道这个工具是 Agent / 桌面助理 / 模型客户端里的哪一种。",
            ].map((item) => (
              <p key={item} style={{ color: "#d7f0df", fontSize: 14, lineHeight: 1.75, display: "grid", gridTemplateColumns: "20px 1fr", gap: 8 }}>
                <CheckCircle2 size={15} style={{ color: "#3DA563", marginTop: 4 }} />
                <span>{item}</span>
              </p>
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

        <section style={{ marginBottom: 42 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <BrainCircuit size={18} style={{ color: "#e8c96a" }} />
            <h2 style={{ color: "#fff", fontSize: 25, fontWeight: 950 }}>装好和接好模型后，怎么把它训练成你的 Agent</h2>
          </div>
          <p style={{ color: "#aaa", fontSize: 14, lineHeight: 1.85, marginBottom: 16 }}>
            这一步很重要。模型接好只是“有大脑”，还要给它人设、记忆结构、权限边界、验收标准和复盘方式。下面每一段都可以直接复制给 Agent。
          </p>
          <div style={{ display: "grid", gap: 14 }}>
            {postInstallSetup.map((section) => (
              <div key={section.title} style={{ border: "1px solid #1f1f1f", background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "22px 24px" }}>
                <h3 style={{ color: "#fff", fontSize: 20, fontWeight: 950, lineHeight: 1.35, marginBottom: 8 }}>{section.title}</h3>
                <p style={{ color: "#bbb", fontSize: 13, lineHeight: 1.8, marginBottom: 14 }}>{section.why}</p>
                <div style={{ display: "grid", gap: 7, marginBottom: section.template ? 14 : 0 }}>
                  {section.steps.map((step) => (
                    <p key={step} style={{ color: "#d8d8d8", fontSize: 13, lineHeight: 1.75, display: "grid", gridTemplateColumns: "18px 1fr", gap: 8 }}>
                      <CheckCircle2 size={14} style={{ color: "#3DA563", marginTop: 4 }} />
                      <span>{step}</span>
                    </p>
                  ))}
                </div>
                {section.template && (
                  <div style={{ marginBottom: section.checks?.length ? 14 : 0 }}>
                    <p style={{ color: "#e8c96a", fontSize: 13, fontWeight: 950, marginBottom: 8 }}>复制给 Agent</p>
                    <CodeBlock code={section.template} />
                  </div>
                )}
                {section.checks && section.checks.length > 0 && (
                  <div style={{ borderTop: "1px solid #202020", paddingTop: 12, display: "grid", gap: 6 }}>
                    <p style={{ color: "#e8c96a", fontSize: 12, fontWeight: 950 }}>这一步是否完成，看这几条</p>
                    {section.checks.map((check) => (
                      <p key={check} style={{ color: "#aaa", fontSize: 12, lineHeight: 1.7 }}>- {check}</p>
                    ))}
                  </div>
                )}
              </div>
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
          .agent-run-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
