import type { Metadata } from "next"
import Link from "next/link"
import { AlertTriangle, CheckCircle2, Code2, KeyRound, Route, ShieldCheck, TerminalSquare, Zap } from "lucide-react"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"

export const metadata: Metadata = {
  title: "Claude Code接入DeepSeek V4教程 - Windows/Mac配置、模型选择和报错排查",
  description:
    "小白AI整理 Claude Code 接入 DeepSeek V4 的完整教程，包含官方 DeepSeek Anthropic 兼容接口、Windows PowerShell、Mac/Linux 环境变量、V4-Pro 和 V4-Flash 模型选择、常见 401/model not found 报错排查。",
  keywords: ["Claude Code接入DeepSeek V4", "Claude Code DeepSeek", "DeepSeek V4教程", "Claude Code国内使用", "ANTHROPIC_BASE_URL", "deepseek-v4-pro"],
  alternates: { canonical: "/claude-code-deepseek" },
  openGraph: {
    title: "Claude Code接入DeepSeek V4教程 | 小白AI",
    description: "Windows/Mac 配置、官方接口、模型选择、报错排查和安全建议。",
    url: "/claude-code-deepseek",
    images: [{ url: "/xiaobai-mascot-cutout.png", alt: "Claude Code 接入 DeepSeek V4 教程" }],
  },
}

const macConfig = `export ANTHROPIC_BASE_URL=https://api.deepseek.com/anthropic
export ANTHROPIC_AUTH_TOKEN=<你的 DeepSeek API Key>
export ANTHROPIC_MODEL=deepseek-v4-pro[1m]
export ANTHROPIC_DEFAULT_OPUS_MODEL=deepseek-v4-pro[1m]
export ANTHROPIC_DEFAULT_SONNET_MODEL=deepseek-v4-pro[1m]
export ANTHROPIC_DEFAULT_HAIKU_MODEL=deepseek-v4-flash
export CLAUDE_CODE_SUBAGENT_MODEL=deepseek-v4-flash
export CLAUDE_CODE_EFFORT_LEVEL=max
claude`

const windowsConfig = `$env:ANTHROPIC_BASE_URL="https://api.deepseek.com/anthropic"
$env:ANTHROPIC_AUTH_TOKEN="<你的 DeepSeek API Key>"
$env:ANTHROPIC_MODEL="deepseek-v4-pro[1m]"
$env:ANTHROPIC_DEFAULT_OPUS_MODEL="deepseek-v4-pro[1m]"
$env:ANTHROPIC_DEFAULT_SONNET_MODEL="deepseek-v4-pro[1m]"
$env:ANTHROPIC_DEFAULT_HAIKU_MODEL="deepseek-v4-flash"
$env:CLAUDE_CODE_SUBAGENT_MODEL="deepseek-v4-flash"
$env:CLAUDE_CODE_EFFORT_LEVEL="max"
claude`

const steps = [
  { title: "安装 Claude Code", desc: "先确认本机 Node.js 版本和 claude 命令能正常运行，不要一开始就怀疑模型接口。" },
  { title: "申请 DeepSeek API Key", desc: "进入 DeepSeek 开发者平台创建 Key，保存后不要公开发送，不要写进仓库。" },
  { title: "配置 Anthropic 兼容接口", desc: "Claude Code 读取的是 ANTHROPIC_BASE_URL 和 ANTHROPIC_AUTH_TOKEN 这一组变量。" },
  { title: "从小项目开始测试", desc: "先让它读 README、总结目录、列计划，再允许它改 1 到 2 个文件。" },
]

const errors = [
  { title: "401 Unauthorized", desc: "Key 写错、复制少字符、前后有空格，或把其他平台 Key 填到了 ANTHROPIC_AUTH_TOKEN。" },
  { title: "model not found", desc: "模型名不匹配。先按官方或服务商面板写 deepseek-v4-pro[1m]、deepseek-v4-pro、deepseek-v4-flash 之一测试。" },
  { title: "请求超时", desc: "先缩小任务范围，再看网络和服务状态。大仓库第一次全量分析很容易慢。" },
  { title: "改动范围太大", desc: "任务提示词里明确只改哪些文件、哪些目录不碰、改完必须解释 diff。" },
]

const faq = [
  { q: "Claude Code 接 DeepSeek V4 是官方支持吗？", a: "DeepSeek 提供 Anthropic 兼容接口，并在官方文档里给出 Claude Code 集成方式。实际模型名和参数以 DeepSeek 当前文档与控制台为准。" },
  { q: "为什么不用 OPENAI_API_KEY？", a: "Claude Code 这条接入方式走 Anthropic 兼容变量，核心是 ANTHROPIC_BASE_URL 和 ANTHROPIC_AUTH_TOKEN。把 OpenAI 兼容变量照搬过来，经常会 401 或完全不生效。" },
  { q: "V4-Pro 和 V4-Flash 怎么分工？", a: "复杂读仓库、架构设计、跨文件修复优先 V4-Pro；简单搜索、子代理、小改动可以让 V4-Flash 控成本。" },
]

function CodeBlock({ code }: { code: string }) {
  return (
    <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word", border: "1px solid #242424", background: "rgba(0,0,0,0.55)", borderRadius: 10, padding: 16, color: "#e7e7e7", fontSize: 12, lineHeight: 1.75, fontFamily: "'JetBrains Mono', monospace" }}>
      {code}
    </pre>
  )
}

export default function ClaudeCodeDeepSeekPage() {
  return (
    <div style={{ background: "#000", minHeight: "100vh", fontFamily: "'Noto Sans SC', sans-serif", position: "relative", overflow: "hidden" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "Claude Code接入DeepSeek V4教程",
            description: "使用 DeepSeek Anthropic 兼容接口配置 Claude Code。",
            inLanguage: "zh-CN",
            step: steps.map((step, index) => ({ "@type": "HowToStep", position: index + 1, name: step.title, text: step.desc })),
          }),
        }}
      />
      <MathRain />
      <NavBar />
      <main style={{ maxWidth: 1080, margin: "0 auto", padding: "64px 60px 104px", position: "relative", zIndex: 10, background: "rgba(0,0,0,0.92)" }} className="max-sm:px-4">
        <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.32em", color: "#7a6230", textTransform: "uppercase", marginBottom: 12, fontWeight: 900 }}>Claude Code / DeepSeek V4</p>
        <h1 style={{ fontSize: 42, color: "#fff", fontWeight: 950, lineHeight: 1.22, marginBottom: 14 }}>Claude Code接入DeepSeek V4教程</h1>
        <p style={{ fontSize: 16, color: "#ccc", lineHeight: 1.9, maxWidth: 860, marginBottom: 24 }}>
          这是一篇给新手直接照着跑的配置教程：先用 DeepSeek 官方 Anthropic 兼容接口把 Claude Code 跑起来，再处理模型选择、报错排查和真实项目里的安全边界。
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 38 }}>
          <Link href="/topics/claude-code-deepseek" className="btn-primary" style={{ textDecoration: "none" }}>进入完整专题</Link>
          <Link href="/claude-code-proxy" className="btn-outline" style={{ textDecoration: "none" }}>看国内中转站教程</Link>
          <Link href="/community/post-51" className="btn-outline" style={{ textDecoration: "none" }}>看社区配置案例</Link>
        </div>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 12, marginBottom: 38 }} className="max-sm:grid-cols-1">
          {[
            { icon: <TerminalSquare size={18} />, label: "配置变量", value: "ANTHROPIC_*" },
            { icon: <Code2 size={18} />, label: "主模型", value: "V4-Pro" },
            { icon: <Zap size={18} />, label: "子代理", value: "V4-Flash" },
            { icon: <ShieldCheck size={18} />, label: "安全重点", value: "Key / Git" },
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
            <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 950 }}>4 步跑通</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            {steps.map((step, index) => (
              <div key={step.title} style={{ border: "1px solid #242424", background: "rgba(0,0,0,0.24)", borderRadius: 10, padding: "16px 18px" }}>
                <span style={{ display: "inline-flex", width: 26, height: 26, alignItems: "center", justifyContent: "center", borderRadius: 999, background: "rgba(201,168,76,0.1)", color: "#e8c96a", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 950, marginBottom: 12 }}>{index + 1}</span>
                <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 950, lineHeight: 1.45, marginBottom: 7 }}>{step.title}</h3>
                <p style={{ color: "#bbb", fontSize: 13, lineHeight: 1.75 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 42 }} className="max-sm:grid-cols-1">
          <div style={{ border: "1px solid #1a1a1a", background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <TerminalSquare size={18} style={{ color: "#e8c96a" }} />
              <h2 style={{ color: "#fff", fontSize: 21, fontWeight: 950 }}>Mac / Linux</h2>
            </div>
            <CodeBlock code={macConfig} />
          </div>
          <div style={{ border: "1px solid #1a1a1a", background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <TerminalSquare size={18} style={{ color: "#e8c96a" }} />
              <h2 style={{ color: "#fff", fontSize: 21, fontWeight: 950 }}>Windows PowerShell</h2>
            </div>
            <CodeBlock code={windowsConfig} />
          </div>
        </section>

        <section style={{ marginBottom: 42 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <AlertTriangle size={18} style={{ color: "#e8c96a" }} />
            <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 950 }}>常见报错</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 12 }}>
            {errors.map((item) => (
              <div key={item.title} style={{ border: "1px solid #1a1a1a", background: "rgba(255,255,255,0.026)", borderRadius: 10, padding: "18px 20px" }}>
                <h3 style={{ color: "#e8c96a", fontSize: 15, fontWeight: 950, marginBottom: 8 }}>{item.title}</h3>
                <p style={{ color: "#bbb", fontSize: 13, lineHeight: 1.8 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 42 }} className="max-sm:grid-cols-1">
          <div style={{ border: "1px solid #2a1f10", background: "rgba(201,168,76,0.04)", borderRadius: 12, padding: 22 }}>
            <h2 style={{ color: "#fff", fontSize: 21, fontWeight: 950, marginBottom: 14 }}>真实项目怎么用</h2>
            {[
              "先让 Claude Code 读项目，不要马上改。",
              "让它输出计划和涉及文件，再确认是否合理。",
              "每次只给一个小目标，改完看 git diff。",
              "线上项目先跑 build/test，再部署。",
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
          <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 950, marginBottom: 10 }}>下一步</h2>
          <p style={{ color: "#ccc", fontSize: 14, lineHeight: 1.9, marginBottom: 16 }}>
            如果官方接口能跑通，再考虑国内中转站；如果官方接口都跑不通，先别换平台，优先排查 Key、base_url、模型名和 Claude Code 版本。
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href="/claude-code-proxy" className="btn-primary" style={{ textDecoration: "none" }}>看中转站教程</Link>
            <Link href="/community/post-52" className="btn-outline" style={{ textDecoration: "none" }}>看报错排查案例</Link>
            <Link href="/ai-coding" className="btn-outline" style={{ textDecoration: "none" }}>AI编程工具推荐</Link>
          </div>
        </section>
      </main>
    </div>
  )
}
