import type { Metadata } from "next"
import Link from "next/link"
import { AlertTriangle, CheckCircle2, KeyRound, ListChecks, ShieldCheck, TerminalSquare } from "lucide-react"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"

export const metadata: Metadata = {
  title: "Claude Code中转站教程 - 国内使用、base_url配置、DeepSeek V4接入和风险判断",
  description:
    "小白AI整理 Claude Code 国内中转站使用教程，讲清楚 Anthropic 兼容接口、base_url 怎么填、为什么 OpenAI 兼容不等于 Claude Code 可用、DeepSeek V4 模型名、额度限制、调用日志和 API Key 安全。",
  keywords: ["Claude Code中转站", "Claude Code国内使用", "Claude Code API中转", "Claude Code base_url", "DeepSeek V4中转站", "Anthropic兼容接口"],
  alternates: { canonical: "/claude-code-proxy" },
  openGraph: {
    title: "Claude Code中转站教程 | 小白AI",
    description: "国内中转站选择、base_url 配置、DeepSeek V4 接入和安全风险判断。",
    url: "/claude-code-proxy",
    images: [{ url: "/xiaobai-mascot-cutout.png", alt: "Claude Code 中转站教程" }],
  },
}

const proxyConfig = `export ANTHROPIC_BASE_URL=https://你的中转站域名/anthropic
export ANTHROPIC_AUTH_TOKEN=<中转站给你的 Key>
export ANTHROPIC_MODEL=<中转站支持的模型名>
claude`

const windowsProxyConfig = `$env:ANTHROPIC_BASE_URL="https://你的中转站域名/anthropic"
$env:ANTHROPIC_AUTH_TOKEN="<中转站给你的 Key>"
$env:ANTHROPIC_MODEL="<中转站支持的模型名>"
claude`

const checks = [
  { title: "是否支持 Anthropic 兼容接口", desc: "Claude Code 不是普通 OpenAI Chat Completions 客户端，只写 OpenAI 兼容不够。" },
  { title: "是否明确支持 Claude Code", desc: "最好看文档里有没有 Claude Code、Anthropic Messages、/anthropic 这类说明。" },
  { title: "模型名是否清楚", desc: "中转站可能把 deepseek-v4-pro 改成别名，模型名不清楚最容易 model not found。" },
  { title: "是否有调用日志", desc: "没有日志，401、限流、模型名错误、余额扣费都很难排查。" },
  { title: "是否能设置额度上限", desc: "Claude Code 跑项目比普通聊天消耗快，新平台先小额测试，务必设限额。" },
  { title: "是否适合公司代码", desc: "公司项目、客户代码、未公开产品不要随便走陌生第三方中转。" },
]

const mistakes = [
  "把 OpenAI 兼容 base_url 直接填给 ANTHROPIC_BASE_URL。",
  "拿官方 DeepSeek Key 去请求中转站地址，或者拿中转站 Key 去请求官方地址。",
  "只测聊天，不测 Claude Code 的读文件、列计划、工具调用场景。",
  "不设限额就让 Claude Code 扫大仓库。",
]

function CodeBlock({ code }: { code: string }) {
  return (
    <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word", border: "1px solid #242424", background: "rgba(0,0,0,0.55)", borderRadius: 10, padding: 16, color: "#e7e7e7", fontSize: 12, lineHeight: 1.75, fontFamily: "'JetBrains Mono', monospace" }}>
      {code}
    </pre>
  )
}

export default function ClaudeCodeProxyPage() {
  return (
    <div style={{ background: "#000", minHeight: "100vh", fontFamily: "'Noto Sans SC', sans-serif", position: "relative", overflow: "hidden" }}>
      <MathRain />
      <NavBar />
      <main style={{ maxWidth: 1080, margin: "0 auto", padding: "64px 60px 104px", position: "relative", zIndex: 10, background: "rgba(0,0,0,0.92)" }} className="max-sm:px-4">
        <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.32em", color: "#7a6230", textTransform: "uppercase", marginBottom: 12, fontWeight: 900 }}>Claude Code / Proxy</p>
        <h1 style={{ fontSize: 42, color: "#fff", fontWeight: 950, lineHeight: 1.22, marginBottom: 14 }}>Claude Code中转站教程：国内使用、base_url配置和风险判断</h1>
        <p style={{ fontSize: 16, color: "#ccc", lineHeight: 1.9, maxWidth: 860, marginBottom: 24 }}>
          国内中转站可以解决网络、支付和团队统一账单问题，但 Claude Code 对接口兼容性要求更高。这个页面不推荐具体站点，而是教你判断一个中转站能不能稳定接 DeepSeek V4 跑 Claude Code。
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 38 }}>
          <Link href="/claude-code-deepseek" className="btn-primary" style={{ textDecoration: "none" }}>先看官方接入</Link>
          <Link href="/topics/claude-code-deepseek" className="btn-outline" style={{ textDecoration: "none" }}>进入完整专题</Link>
          <Link href="/community/post-54" className="btn-outline" style={{ textDecoration: "none" }}>看中转站案例</Link>
        </div>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 12, marginBottom: 38 }} className="max-sm:grid-cols-1">
          {[
            { icon: <TerminalSquare size={18} />, label: "核心变量", value: "ANTHROPIC_BASE_URL" },
            { icon: <KeyRound size={18} />, label: "关键检查", value: "Key 不混用" },
            { icon: <ShieldCheck size={18} />, label: "风险边界", value: "代码 / 账单" },
          ].map((item) => (
            <div key={item.label} style={{ border: "1px solid #1a1a1a", background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "18px 20px" }}>
              <div style={{ color: "#e8c96a", marginBottom: 10 }}>{item.icon}</div>
              <p style={{ color: "#888", fontSize: 11, marginBottom: 5 }}>{item.label}</p>
              <p style={{ color: "#fff", fontSize: 17, fontWeight: 950 }}>{item.value}</p>
            </div>
          ))}
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 42 }} className="max-sm:grid-cols-1">
          <div style={{ border: "1px solid #1a1a1a", background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <TerminalSquare size={18} style={{ color: "#e8c96a" }} />
              <h2 style={{ color: "#fff", fontSize: 21, fontWeight: 950 }}>Mac / Linux 中转配置</h2>
            </div>
            <CodeBlock code={proxyConfig} />
          </div>
          <div style={{ border: "1px solid #1a1a1a", background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <TerminalSquare size={18} style={{ color: "#e8c96a" }} />
              <h2 style={{ color: "#fff", fontSize: 21, fontWeight: 950 }}>Windows PowerShell 中转配置</h2>
            </div>
            <CodeBlock code={windowsProxyConfig} />
          </div>
        </section>

        <section style={{ marginBottom: 42 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <ListChecks size={18} style={{ color: "#e8c96a" }} />
            <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 950 }}>选择中转站前看 6 件事</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
            {checks.map((item) => (
              <div key={item.title} style={{ border: "1px solid #1a1a1a", background: "rgba(255,255,255,0.026)", borderRadius: 10, padding: "18px 20px" }}>
                <h3 style={{ color: "#e8c96a", fontSize: 15, fontWeight: 950, marginBottom: 8 }}>{item.title}</h3>
                <p style={{ color: "#bbb", fontSize: 13, lineHeight: 1.8 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 42 }} className="max-sm:grid-cols-1">
          <div style={{ border: "1px solid #2a1f10", background: "rgba(201,168,76,0.04)", borderRadius: 12, padding: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <AlertTriangle size={18} style={{ color: "#e8c96a" }} />
              <h2 style={{ color: "#fff", fontSize: 21, fontWeight: 950 }}>最常见的坑</h2>
            </div>
            {mistakes.map((item) => (
              <p key={item} style={{ display: "flex", gap: 8, color: "#bbb", fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
                <AlertTriangle size={14} style={{ color: "#c9a84c", marginTop: 4, flexShrink: 0 }} /> {item}
              </p>
            ))}
          </div>
          <div style={{ border: "1px solid #2a1f10", background: "rgba(201,168,76,0.04)", borderRadius: 12, padding: 22 }}>
            <h2 style={{ color: "#fff", fontSize: 21, fontWeight: 950, marginBottom: 14 }}>正确测试顺序</h2>
            {[
              "先用最小命令打开 Claude Code。",
              "让它只读一个小目录并总结结构。",
              "让它列计划，不允许改文件。",
              "最后给一个小改动，看 diff 和扣费记录。",
            ].map((item) => (
              <p key={item} style={{ display: "flex", gap: 8, color: "#bbb", fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
                <CheckCircle2 size={14} style={{ color: "#3DA563", marginTop: 4, flexShrink: 0 }} /> {item}
              </p>
            ))}
          </div>
        </section>

        <section style={{ border: "1px solid #2a1f10", background: "rgba(201,168,76,0.04)", borderRadius: 12, padding: "24px 26px" }}>
          <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 950, marginBottom: 10 }}>一句话结论</h2>
          <p style={{ color: "#ccc", fontSize: 14, lineHeight: 1.9, marginBottom: 16 }}>
            个人小项目可以小额测试中转站；公司代码、客户项目、未公开产品，优先官方 API 或公司认可的服务。便宜和方便重要，但不能拿 API Key、代码和账单安全去换。
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href="/community/post-55" className="btn-primary" style={{ textDecoration: "none" }}>看不能改代码的排查</Link>
            <Link href="/community/post-54" className="btn-outline" style={{ textDecoration: "none" }}>看中转站选择清单</Link>
            <Link href="/deepseek-api-key" className="btn-outline" style={{ textDecoration: "none" }}>DeepSeek API Key教程</Link>
          </div>
        </section>
      </main>
    </div>
  )
}
