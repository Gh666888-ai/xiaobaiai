import type { Metadata } from "next"
import Link from "next/link"
import { AlertTriangle, ArrowRight, CheckCircle2, Code2, KeyRound, Layers, Route, ShieldCheck, TerminalSquare, Zap } from "lucide-react"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"
import { posts } from "@/data/community"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata: Metadata = {
  title: "Claude Code接入DeepSeek V4教程 - API配置、国内中转站、报错排查和模型选择",
  description:
    "小白AI整理 Claude Code 接入 DeepSeek V4 / V4-Pro / V4-Flash 的实战教程，包含官方 Anthropic 兼容接口、Windows 和 Mac 环境变量、国内中转站判断、常见 401 和模型名报错、安全建议与社区案例。",
  keywords: ["Claude Code接入DeepSeek", "DeepSeek V4", "DeepSeek V4 Pro", "Claude Code国内使用", "Claude Code中转站", "Anthropic兼容接口", "AI编程"],
  alternates: { canonical: "/topics/claude-code-deepseek" },
  openGraph: {
    title: "Claude Code接入DeepSeek V4教程 | 小白AI",
    description: "官方 DeepSeek Anthropic 兼容接口、国内中转站、模型选择、报错排查和 AI 编程实战。",
    url: "/topics/claude-code-deepseek",
    images: [{ url: "/xiaobai-mascot-cutout.png", alt: "Claude Code 接入 DeepSeek V4 教程" }],
  },
}

const officialEnv = `export ANTHROPIC_BASE_URL=https://api.deepseek.com/anthropic
export ANTHROPIC_AUTH_TOKEN=<你的 DeepSeek API Key>
export ANTHROPIC_MODEL=deepseek-v4-pro[1m]
export ANTHROPIC_DEFAULT_OPUS_MODEL=deepseek-v4-pro[1m]
export ANTHROPIC_DEFAULT_SONNET_MODEL=deepseek-v4-pro[1m]
export ANTHROPIC_DEFAULT_HAIKU_MODEL=deepseek-v4-flash
export CLAUDE_CODE_SUBAGENT_MODEL=deepseek-v4-flash
export CLAUDE_CODE_EFFORT_LEVEL=max
claude`

const windowsEnv = `$env:ANTHROPIC_BASE_URL="https://api.deepseek.com/anthropic"
$env:ANTHROPIC_AUTH_TOKEN="<你的 DeepSeek API Key>"
$env:ANTHROPIC_MODEL="deepseek-v4-pro[1m]"
$env:ANTHROPIC_DEFAULT_OPUS_MODEL="deepseek-v4-pro[1m]"
$env:ANTHROPIC_DEFAULT_SONNET_MODEL="deepseek-v4-pro[1m]"
$env:ANTHROPIC_DEFAULT_HAIKU_MODEL="deepseek-v4-flash"
$env:CLAUDE_CODE_SUBAGENT_MODEL="deepseek-v4-flash"
$env:CLAUDE_CODE_EFFORT_LEVEL="max"
claude`

const relayEnv = `export ANTHROPIC_BASE_URL=https://你的中转站域名/anthropic
export ANTHROPIC_AUTH_TOKEN=<中转站给你的 Key>
export ANTHROPIC_MODEL=<中转站支持的模型名>
claude`

const quickChecks = [
  "先用官方 DeepSeek API 跑通一次，再决定要不要换国内中转站。",
  "中转站必须明确支持 Anthropic 兼容接口，不能只写 OpenAI 兼容接口。",
  "模型名以服务商当前面板为准，同一个站可能写 deepseek-v4-pro、deepseek-v4-pro[1m] 或自定义别名。",
  "API Key 不要写进仓库、截图、教程评论或聊天记录，尤其别放到 .env 被 git 提交。",
]

const errors = [
  { title: "401 Unauthorized", desc: "先看 Key 是 DeepSeek 官方 Key 还是中转站 Key，再看变量名是不是 ANTHROPIC_AUTH_TOKEN。很多人错把 OPENAI_API_KEY 复制过来。" },
  { title: "模型不存在", desc: "核对 ANTHROPIC_MODEL 和默认模型变量。V4-Pro、V4-Flash、deepseek-v4-pro[1m] 不是所有入口都用同一个写法。" },
  { title: "能启动但输出慢", desc: "先把子代理模型切到 V4-Flash，或者减少一次性改动范围。大仓库上来就全量重构，速度和费用都会不稳。" },
  { title: "中转站能聊但不能跑 Claude Code", desc: "说明它可能只兼容 OpenAI Chat Completions，不兼容 Anthropic Messages / Claude Code 所需的路由。" },
]

const relatedPosts = posts
  .filter((post) => post.title.includes("Claude Code") || post.title.includes("DeepSeek V4") || post.tags.some((tag) => ["Claude Code", "DeepSeek V4", "AI编程", "中转站"].includes(tag)))
  .sort((a, b) => Number(b.likes || 0) - Number(a.likes || 0))
  .slice(0, 8)

function excerpt(text: string) {
  return text.replace(/\s+/g, " ").slice(0, 118)
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word", border: "1px solid #242424", background: "rgba(0,0,0,0.55)", borderRadius: 10, padding: 16, color: "#e7e7e7", fontSize: 12, lineHeight: 1.75, fontFamily: "'JetBrains Mono', monospace" }}>
      {code}
    </pre>
  )
}

export default function ClaudeCodeDeepSeekTopicPage() {
  return (
    <div style={{ background: "#000", minHeight: "100vh", fontFamily: "'Noto Sans SC', sans-serif", position: "relative", overflow: "hidden" }}>
      <MathRain />
      <NavBar />
      <main style={{ maxWidth: 1120, margin: "0 auto", padding: "64px 60px 104px", position: "relative", zIndex: 10, background: "rgba(0,0,0,0.92)" }} className="max-sm:px-4">
        <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.32em", color: "#7a6230", textTransform: "uppercase", marginBottom: 12, fontWeight: 900 }}>Topic / Claude Code + DeepSeek</p>
        <h1 style={{ fontSize: 42, color: "#fff", fontWeight: 950, lineHeight: 1.22, marginBottom: 14 }}>Claude Code 接入 DeepSeek V4 实战专题</h1>
        <p style={{ fontSize: 16, color: "#ccc", lineHeight: 1.9, maxWidth: 880, marginBottom: 24 }}>
          现在最热的玩法不是单纯问聊天模型，而是把 Claude Code 这个终端编程界面接到 DeepSeek V4 / V4-Pro / V4-Flash 上。这个专题把官方接口、国内中转站、模型选择、报错排查和安全边界放在一起，适合想马上跑起来的人。
        </p>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 12, marginBottom: 38 }} className="max-sm:grid-cols-1">
          {[
            { icon: <TerminalSquare size={18} />, label: "核心入口", value: "Claude Code" },
            { icon: <Code2 size={18} />, label: "模型路线", value: "V4-Pro / Flash" },
            { icon: <Layers size={18} />, label: "接入方式", value: "官方 / 中转" },
            { icon: <ShieldCheck size={18} />, label: "重点风险", value: "Key 和费用" },
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
            <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 950 }}>建议路线</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 12 }}>
            {[
              { title: "先跑官方教程", desc: "用官方 Anthropic 兼容接口验证模型名、Key 和基础能力。", href: "/claude-code-deepseek" },
              { title: "再评估国内中转站", desc: "只在网络、充值或团队结算确实需要时使用，先小额测试。", href: "/claude-code-proxy" },
              { title: "补 DeepSeek API 基础", desc: "如果 Key、余额、模型名还没搞清楚，先回到 API Key 教程。", href: "/deepseek-api-key" },
              { title: "最后放进真实项目", desc: "从只读分析、小范围改动、明确边界开始，不要上来全仓重构。", href: "/community?scene=coding" },
            ].map((step, index) => (
              <Link key={step.href} href={step.href} style={{ textDecoration: "none", border: "1px solid #242424", background: "rgba(0,0,0,0.24)", borderRadius: 10, padding: "16px 18px", display: "block" }}>
                <span style={{ display: "inline-flex", width: 26, height: 26, alignItems: "center", justifyContent: "center", borderRadius: 999, background: "rgba(201,168,76,0.1)", color: "#e8c96a", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 950, marginBottom: 12 }}>{index + 1}</span>
                <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 950, lineHeight: 1.45, marginBottom: 7 }}>{step.title}</h3>
                <p style={{ color: "#bbb", fontSize: 13, lineHeight: 1.75 }}>{step.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 42 }} className="max-sm:grid-cols-1">
          <div style={{ border: "1px solid #1a1a1a", background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <TerminalSquare size={18} style={{ color: "#e8c96a" }} />
              <h2 style={{ color: "#fff", fontSize: 21, fontWeight: 950 }}>Mac / Linux 官方配置</h2>
            </div>
            <CodeBlock code={officialEnv} />
          </div>
          <div style={{ border: "1px solid #1a1a1a", background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <TerminalSquare size={18} style={{ color: "#e8c96a" }} />
              <h2 style={{ color: "#fff", fontSize: 21, fontWeight: 950 }}>Windows PowerShell 配置</h2>
            </div>
            <CodeBlock code={windowsEnv} />
          </div>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 42 }} className="max-sm:grid-cols-1">
          <div style={{ border: "1px solid #2a1f10", background: "rgba(201,168,76,0.04)", borderRadius: 12, padding: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <Zap size={18} style={{ color: "#e8c96a" }} />
              <h2 style={{ color: "#fff", fontSize: 21, fontWeight: 950 }}>V4-Pro 和 V4-Flash 怎么选</h2>
            </div>
            {[
              "复杂改造、跨文件理解、架构分析：优先 V4-Pro。",
              "子代理、快速搜索、简单修 bug：可以用 V4-Flash 控成本。",
              "第一次跑项目：先让它读代码和列计划，再允许编辑文件。",
              "大仓库：限制目录和文件范围，比盲目换更贵模型更有效。",
            ].map((item) => (
              <p key={item} style={{ display: "flex", gap: 8, color: "#bbb", fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
                <CheckCircle2 size={14} style={{ color: "#3DA563", marginTop: 4, flexShrink: 0 }} /> {item}
              </p>
            ))}
          </div>

          <div style={{ border: "1px solid #2a1f10", background: "rgba(201,168,76,0.04)", borderRadius: 12, padding: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <KeyRound size={18} style={{ color: "#e8c96a" }} />
              <h2 style={{ color: "#fff", fontSize: 21, fontWeight: 950 }}>国内中转站写法</h2>
            </div>
            <p style={{ color: "#bbb", fontSize: 13, lineHeight: 1.8, marginBottom: 12 }}>
              中转站本质是把 base url 和 token 换成第三方服务商给你的地址和 Key。重点不是复制命令，而是确认它是否支持 Claude Code 需要的 Anthropic 兼容路由。
            </p>
            <CodeBlock code={relayEnv} />
          </div>
        </section>

        <section style={{ marginBottom: 42 }}>
          <div style={{ marginBottom: 16 }}>
            <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 950, marginBottom: 7 }}>中转站选择清单</h2>
            <p style={{ color: "#aaa", fontSize: 14, lineHeight: 1.8 }}>国内中转站可以解决网络和支付问题，但不要只看价格。能否稳定跑 Claude Code、能否保护 Key、能否查日志，才是关键。</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 12 }}>
            {quickChecks.map((item) => (
              <div key={item} style={{ border: "1px solid #1a1a1a", background: "rgba(255,255,255,0.026)", borderRadius: 10, padding: "16px 18px" }}>
                <p style={{ display: "flex", gap: 8, color: "#cfcfcf", fontSize: 13, lineHeight: 1.8 }}>
                  <ShieldCheck size={15} style={{ color: "#e8c96a", marginTop: 4, flexShrink: 0 }} /> {item}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 42 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <AlertTriangle size={18} style={{ color: "#e8c96a" }} />
            <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 950 }}>常见报错排查</h2>
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

        <section style={{ marginBottom: 42 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "flex-end", flexWrap: "wrap", marginBottom: 16 }}>
            <div>
              <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 950, marginBottom: 7 }}>相关社区实战</h2>
              <p style={{ color: "#aaa", fontSize: 14, lineHeight: 1.8 }}>配置、报错、中转站和模型选择都拆成了独立帖子，方便搜索进来的用户直接落到对应问题。</p>
            </div>
            <Link href="/community?scene=coding" className="btn-outline" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
              更多 AI 编程案例 <ArrowRight size={14} />
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: 12 }}>
            {relatedPosts.map((post) => (
              <Link key={post.id} href={`/community/${post.id}`} style={{ display: "block", textDecoration: "none", border: "1px solid #1a1a1a", background: "rgba(255,255,255,0.026)", borderRadius: 10, padding: "18px 20px", minHeight: 190 }}>
                <span style={{ border: "1px solid #7a6230", color: "#e8c96a", borderRadius: 999, padding: "2px 8px", fontSize: 10, fontWeight: 900 }}>{post.category}</span>
                <h3 style={{ color: "#fff", fontSize: 17, fontWeight: 950, lineHeight: 1.45, margin: "11px 0 8px" }}>{post.title}</h3>
                <p style={{ color: "#bdbdbd", fontSize: 13, lineHeight: 1.8 }}>{excerpt(post.content)}...</p>
              </Link>
            ))}
          </div>
        </section>

        <section style={{ border: "1px solid #2a1f10", background: "rgba(201,168,76,0.04)", borderRadius: 12, padding: "24px 26px" }}>
          <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 950, marginBottom: 10 }}>真正适合新手的起步方式</h2>
          <p style={{ color: "#ccc", fontSize: 14, lineHeight: 1.9, marginBottom: 16 }}>
            先找一个不重要的小项目，让 Claude Code 做“读代码、列问题、给计划”三件事。等你确认它理解项目后，再允许它修改 1 到 2 个文件。AI 编程最怕的不是模型不够强，而是人一开始就把权限、范围和目标都放得太大。
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href="/community/post-51" className="btn-primary" style={{ textDecoration: "none" }}>看最小配置</Link>
            <Link href="/claude-code-deepseek" className="btn-outline" style={{ textDecoration: "none" }}>看完整教程</Link>
            <Link href="/claude-code-proxy" className="btn-outline" style={{ textDecoration: "none" }}>看中转站教程</Link>
            <Link href="/community/post-52" className="btn-outline" style={{ textDecoration: "none" }}>看报错排查</Link>
            <Link href="/community/post-54" className="btn-outline" style={{ textDecoration: "none" }}>看中转站判断</Link>
            <Link href="/ai-coding" className="btn-outline" style={{ textDecoration: "none" }}>回到 AI 编程工具</Link>
          </div>
        </section>
      </main>
    </div>
  )
}
