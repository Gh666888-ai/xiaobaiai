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

const installCommands = {
  mac: `node -v
npm -v
npm install -g @anthropic-ai/claude-code
claude --version`,
  mirror: `npm.cmd install -g @anthropic-ai/claude-code --registry=https://registry.npmmirror.com
claude --version`,
  powershellPolicy: `npm.cmd install -g @anthropic-ai/claude-code --registry=https://registry.npmmirror.com`,
  powershellFix: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`,
  verify: `claude --version`,
  locateClaude: `where.exe claude`,
  start: `claude`,
  startInProject: `cd 你的项目文件夹路径
claude`,
  theme: `看到 Choose the text style that looks best with your terminal
直接按回车

以后想改主题：
/theme`,
  firstPrompt: `请先告诉我你能做什么，不要修改我的文件。`,
  projectPrompt: `请先阅读这个项目，不要改文件，告诉我它是什么技术栈、主要目录和下一步建议。`,
  deepseekQuickStart: `$env:ANTHROPIC_BASE_URL="https://api.deepseek.com/anthropic"
$env:ANTHROPIC_AUTH_TOKEN="sk-你的DeepSeek_API_Key"
$env:ANTHROPIC_MODEL="deepseek-v4-flash"
claude`,
}

const beginnerInstall = [
  {
    title: "下载 Node.js LTS",
    desc: "打开 nodejs.org，下载 LTS 版本。Windows 用户双击安装包，一路 Next；Mac 用户下载 macOS 安装包后照提示安装。Claude Code 需要 Node.js 18+。",
  },
  {
    title: "打开终端",
    desc: "Windows 打开 PowerShell；Mac 打开 Terminal。先输入 node -v 和 npm -v，能看到版本号，说明 Node 和 npm 已经装好。",
  },
  {
    title: "安装 Claude Code",
    desc: "Windows PowerShell 用户优先用 npm.cmd 安装，避免 npm.ps1 被系统策略拦住。安装完成后输入 claude --version 验证。",
  },
  {
    title: "启动 Claude Code",
    desc: "验证成功后输入 claude 启动。第一次先让它说明能力，不要马上让它改文件；在真实项目里用时，先 cd 到项目文件夹再启动。",
  },
]

const steps = [
  { title: "先装好 Node.js 和 Claude Code", desc: "先确认本机 node、npm、claude 三个命令都能正常运行，不要一开始就怀疑模型接口。" },
  { title: "先启动一次 Claude Code", desc: "安装后输入 claude 启动；第一次只问它能做什么，不要马上让它改文件。" },
  { title: "申请 DeepSeek API Key", desc: "进入 DeepSeek 开发者平台创建 Key，保存后不要公开发送，不要写进仓库。" },
  { title: "配置 Anthropic 兼容接口", desc: "Claude Code 读取的是 ANTHROPIC_BASE_URL 和 ANTHROPIC_AUTH_TOKEN 这一组变量。" },
  { title: "从小项目开始测试", desc: "先让它读 README、总结目录、列计划，再允许它改 1 到 2 个文件。" },
]

const errors = [
  { title: "npm.ps1 被禁止运行", desc: "这是 Windows PowerShell 的执行策略拦住了 npm 脚本，不是 Node 或 Claude Code 坏了。先把命令里的 npm 改成 npm.cmd；如果还不行，再执行 Set-ExecutionPolicy -Scope CurrentUser RemoteSigned，确认输入 Y。" },
  { title: "npx.ps1 被禁止运行", desc: "如果 npm.cmd install 后看到 changed packages，说明已经安装成功。不要再用 npx @anthropic-ai/claude-code --version，直接用 claude --version 验证；如果找不到 claude，关闭 PowerShell 重新打开。" },
  { title: "Unable to connect to Anthropic services", desc: "这说明 Claude Code 已经启动成功，但默认连接 Anthropic 官方服务失败。国内用户先配置 DeepSeek 的 Anthropic 兼容接口，再重新执行 claude。" },
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

        <section style={{ border: "1px solid #2a1f10", background: "rgba(201,168,76,0.045)", borderRadius: 12, padding: 22, marginBottom: 42 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <TerminalSquare size={18} style={{ color: "#e8c96a" }} />
            <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 950 }}>小白先把软件下载好</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 12, marginBottom: 14 }}>
            {beginnerInstall.map((item, index) => (
              <div key={item.title} style={{ border: "1px solid #242424", background: "rgba(0,0,0,0.24)", borderRadius: 10, padding: "16px 18px" }}>
                <span style={{ display: "inline-flex", width: 26, height: 26, alignItems: "center", justifyContent: "center", borderRadius: 999, background: "rgba(201,168,76,0.1)", color: "#e8c96a", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 950, marginBottom: 12 }}>{index + 1}</span>
                <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 950, lineHeight: 1.45, marginBottom: 7 }}>{item.title}</h3>
                <p style={{ color: "#bbb", fontSize: 13, lineHeight: 1.75 }}>{item.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="max-sm:grid-cols-1">
            <div>
              <p style={{ color: "#e8c96a", fontSize: 13, fontWeight: 950, marginBottom: 8 }}>官方安装命令</p>
              <CodeBlock code={installCommands.mac} />
            </div>
            <div>
              <p style={{ color: "#e8c96a", fontSize: 13, fontWeight: 950, marginBottom: 8 }}>国内 npm 慢时用镜像</p>
              <p style={{ color: "#bbb", fontSize: 13, lineHeight: 1.8, marginBottom: 10 }}>
                Windows PowerShell 用户直接复制下面这一段，粘贴后按回车。
              </p>
              <CodeBlock code={installCommands.mirror} />
            </div>
          </div>
          <div style={{ border: "1px solid #4a251f", background: "rgba(180,60,40,0.08)", borderRadius: 10, padding: "14px 16px", marginTop: 14 }}>
            <p style={{ color: "#ffb199", fontSize: 13, fontWeight: 950, marginBottom: 7 }}>如果出现红字：npm.ps1 被禁止运行</p>
            <p style={{ color: "#d8c8bd", fontSize: 13, lineHeight: 1.8, marginBottom: 10 }}>
              这说明 PowerShell 安全策略拦住了 npm 脚本，不是 Node.js 没装好，也不是 Claude Code 包坏了。先不要乱改环境变量，复制下面这行重新安装。
            </p>
            <CodeBlock code={installCommands.powershellPolicy} />
            <p style={{ color: "#bfa795", fontSize: 12, lineHeight: 1.75, margin: "10px 0 8px" }}>
              如果还是报同样错误，再复制下面这行，出现确认时输入 Y，然后重新执行上面的安装命令。
            </p>
            <CodeBlock code={installCommands.powershellFix} />
          </div>
          <div style={{ border: "1px solid #2a1f10", background: "rgba(201,168,76,0.045)", borderRadius: 10, padding: "14px 16px", marginTop: 14 }}>
            <p style={{ color: "#e8c96a", fontSize: 13, fontWeight: 950, marginBottom: 7 }}>如果看到 changed packages 后，npx 又报红</p>
            <p style={{ color: "#d8c8bd", fontSize: 13, lineHeight: 1.8, marginBottom: 10 }}>
              changed packages 表示 Claude Code 已经装好了。后面 npx 报红，是 PowerShell 拦住了 npx.ps1。这里不要再用 npx，直接复制下面这行验证。
            </p>
            <CodeBlock code={installCommands.verify} />
            <p style={{ color: "#bfa795", fontSize: 12, lineHeight: 1.75, margin: "10px 0 8px" }}>
              如果提示找不到 claude，关闭 PowerShell 重新打开再试；还不行再用下面这行查看安装位置。
            </p>
            <CodeBlock code={installCommands.locateClaude} />
          </div>
          <p style={{ color: "#9f8d57", fontSize: 12, lineHeight: 1.8, marginTop: 12 }}>
            如果 node -v 没有版本号，先别继续配置 DeepSeek，说明 Node.js 没装好或终端没有识别到环境变量。
          </p>
        </section>

        <section style={{ border: "1px solid #4a251f", background: "rgba(180,60,40,0.08)", borderRadius: 12, padding: 22, marginBottom: 42 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <AlertTriangle size={18} style={{ color: "#ffb199" }} />
            <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 950 }}>启动后连不上 Anthropic 官方服务</h2>
          </div>
          <p style={{ color: "#d8c8bd", fontSize: 13, lineHeight: 1.85, marginBottom: 12 }}>
            如果看到 Unable to connect to Anthropic services 或 api.anthropic.com，这不是安装失败。它表示 Claude Code 已经打开了，但默认去连接 Anthropic 官方服务，当前网络、地区或账号环境连不上。
          </p>
          <p style={{ color: "#e8c96a", fontSize: 13, fontWeight: 950, marginBottom: 8 }}>国内新手先用 DeepSeek 跑通</p>
          <CodeBlock code={installCommands.deepseekQuickStart} />
          <p style={{ color: "#bfa795", fontSize: 12, lineHeight: 1.75, marginTop: 10 }}>
            把 sk-你的DeepSeek_API_Key 换成你自己的 DeepSeek Key。如果你要使用 Anthropic 官方 Claude，需要确认账号、地区和网络能正常访问官方服务。
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 16 }} className="max-sm:grid-cols-1">
            <div>
              <p style={{ color: "#e8c96a", fontSize: 13, fontWeight: 950, marginBottom: 8 }}>Windows PowerShell 完整版</p>
              <CodeBlock code={windowsConfig} />
            </div>
            <div>
              <p style={{ color: "#e8c96a", fontSize: 13, fontWeight: 950, marginBottom: 8 }}>Mac / Linux / WSL 完整版</p>
              <CodeBlock code={macConfig} />
            </div>
          </div>
        </section>

        <section style={{ border: "1px solid #2a1f10", background: "rgba(201,168,76,0.045)", borderRadius: 12, padding: 22, marginBottom: 42 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <TerminalSquare size={18} style={{ color: "#e8c96a" }} />
            <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 950 }}>安装好以后怎么启动</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="max-sm:grid-cols-1">
            <div>
              <p style={{ color: "#e8c96a", fontSize: 13, fontWeight: 950, marginBottom: 8 }}>只是先打开试试</p>
              <p style={{ color: "#bbb", fontSize: 13, lineHeight: 1.8, marginBottom: 10 }}>
                看到版本号以后，直接复制下面这行启动 Claude Code。
              </p>
              <CodeBlock code={installCommands.start} />
              <p style={{ color: "#bfa795", fontSize: 12, lineHeight: 1.75, margin: "10px 0 8px" }}>
                如果出现 Choose the text style that looks best with your terminal，这不是报错，是让你选终端主题。默认 Dark mode 可以直接用，按回车继续。
              </p>
              <CodeBlock code={installCommands.theme} />
              <p style={{ color: "#bfa795", fontSize: 12, lineHeight: 1.75, margin: "10px 0 8px" }}>
                第一次打开后，先复制这句话，不要马上让它改文件。
              </p>
              <CodeBlock code={installCommands.firstPrompt} />
            </div>
            <div>
              <p style={{ color: "#e8c96a", fontSize: 13, fontWeight: 950, marginBottom: 8 }}>在自己的项目里用</p>
              <p style={{ color: "#bbb", fontSize: 13, lineHeight: 1.8, marginBottom: 10 }}>
                先进入项目文件夹，再启动 Claude Code。路径可以从文件夹地址栏复制。
              </p>
              <CodeBlock code={installCommands.startInProject} />
              <p style={{ color: "#bfa795", fontSize: 12, lineHeight: 1.75, margin: "10px 0 8px" }}>
                进入后先让它读项目，不要直接修改。
              </p>
              <CodeBlock code={installCommands.projectPrompt} />
            </div>
          </div>
        </section>

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
            <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 950 }}>5 步跑通</h2>
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
