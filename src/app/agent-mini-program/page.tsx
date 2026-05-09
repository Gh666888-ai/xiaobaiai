import type { Metadata } from "next"
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"

export const metadata: Metadata = {
  title: "用Agent做微信小程序教程 - 从需求、指挥AI写代码到提交审核上线",
  description:
    "小白AI整理用 Agent 做微信小程序的完整实战教程：怎么写需求、怎么指挥 Claude Code/Codex/OpenClaw 写代码、怎么检查、怎么用微信开发者工具上传、提交审核和发布上线。",
  keywords: ["Agent做小程序", "AI写小程序", "微信小程序上线", "Claude Code小程序", "Codex小程序", "小程序提交审核", "微信开发者工具上传"],
  alternates: { canonical: "/agent-mini-program" },
  openGraph: {
    title: "用Agent做微信小程序教程 | 小白AI",
    description: "从需求、指挥 Agent 写代码、真机验收到微信小程序提交审核上线。",
    url: "/agent-mini-program",
    images: [{ url: "/xiaobai-mascot-cutout.png", alt: "小白AI Agent做小程序教程" }],
  },
}

const workflowSteps = [
  {
    title: "1. 先写一页需求，不要直接让 Agent 开写",
    desc: "Agent 最怕需求虚。先把小程序给谁用、第一版只做哪几个功能、哪些不能碰写清楚。",
    prompt: `我要做一个微信小程序，请先帮我把需求整理成第一版开发说明，不要写代码。

小程序名称：
目标用户：
用户进来第一件事：
第一版必须有的页面：
1.
2.
3.

第一版不做的功能：
1.
2.

必须注意：
- 不要编造政策、价格、承诺。
- 涉及用户隐私、手机号、位置、照片、家庭信息时，要先提醒我。
- 先输出页面结构、数据结构、上线风险，不要直接改文件。`,
  },
  {
    title: "2. 让 Agent 先读项目，列计划和文件清单",
    desc: "如果已经有代码，不要让 Agent 盲改。先让它读目录、识别技术栈、列出要动哪些文件。",
    prompt: `请先阅读这个小程序项目，不要修改任何文件。

请输出：
1. 这个项目是什么技术栈。
2. 主要目录分别做什么。
3. 当前能运行到哪一步。
4. 要实现第一版功能，需要修改哪些文件。
5. 你建议先做哪一个最小功能。

没有把握的地方标注“需要我确认”。`,
  },
  {
    title: "3. 每次只派一个小任务给 Agent",
    desc: "不要说“把整个小程序做完”。正确做法是一次只让它做一个页面、一个按钮、一个表单或一个接口。",
    prompt: `现在只做一个小任务：完成「这里写功能名」。

范围限制：
- 只允许修改这些文件：
1.
2.

交付要求：
1. 页面能打开。
2. 按钮能点击。
3. 表单有空值提示。
4. 失败时给用户一句能看懂的话。

改之前先列计划。改完告诉我改了哪些文件、怎么测试、还有哪些没验证。`,
  },
  {
    title: "4. 让 Agent 自己先检查一遍",
    desc: "代码写完不算完。要让 Agent 按清单自查，再让人打开微信开发者工具验收。",
    prompt: `请按下面清单自查这次改动：

1. 有没有改到我没授权的文件。
2. 页面是否有空状态、加载状态、失败状态。
3. 表单是否做了必填校验。
4. 小程序端是否有明显报错。
5. 涉及隐私、位置、照片、手机号的地方是否有提示。
6. 需要我在微信开发者工具里手动检查什么。

请只输出检查结果，不要继续改代码。`,
  },
  {
    title: "5. 真机验收后再让 Agent 修问题",
    desc: "微信开发者工具能跑，不代表手机上能用。真机预览后，把报错和截图给 Agent，它再修。",
    prompt: `我在微信开发者工具或手机预览里遇到这个问题：

现象：
截图/报错：
我刚才点了哪里：
期望结果：

请先判断问题属于哪一类：路径错误、接口错误、权限错误、样式错误、云开发错误、审核风险。
先给修复计划，不要直接大范围重构。`,
  },
]

const launchSteps = [
  {
    title: "开发者工具里上传代码",
    detail: "打开微信开发者工具，确认 AppID 正确，点击右上角上传，填写版本号和备注。",
  },
  {
    title: "公众平台设为体验版",
    detail: "进入微信公众平台，打开版本管理，把开发版本设为体验版，先让自己和测试人员扫码体验。",
  },
  {
    title: "配置服务器域名",
    detail: "如果小程序请求自己的后端，需要在开发管理里配置 request 合法域名，并确保是 https。",
  },
  {
    title: "提交审核",
    detail: "体验版没问题后，在版本管理里提交审核。类目、隐私说明、页面内容要和实际功能一致。",
  },
  {
    title: "审核通过后发布",
    detail: "审核通过后再发布。首次发布建议全量前再检查一次登录、表单、支付、客服、隐私弹窗。",
  },
]

const commonPitfalls = [
  { title: "一上来就让 Agent 做完整小程序", desc: "会导致功能堆太多、页面跑不通。要拆成页面、表单、接口、验收四类小任务。" },
  { title: "没有真机测试", desc: "模拟器能打开，不代表手机权限、网络请求、登录态都正常。" },
  { title: "域名没配置", desc: "手机预览请求接口失败，常见原因是没有在微信公众平台配置合法域名。" },
  { title: "隐私和类目不一致", desc: "收集手机号、位置、照片、家庭信息时，要提前处理隐私说明和使用场景。" },
  { title: "没有版本记录", desc: "每个小功能完成后都提交一次 Git。Agent 改坏时，才能知道哪里坏了。" },
]

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "用 Agent 做微信小程序：从需求到上线",
  description: "教新手如何指挥 Agent 写微信小程序代码，并用微信开发者工具上传、提交审核、发布上线。",
  inLanguage: "zh-CN",
  step: [...workflowSteps, ...launchSteps].map((step, index) => ({
    "@type": "HowToStep",
    position: index + 1,
    name: step.title,
    text: "desc" in step ? step.desc : step.detail,
  })),
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word", border: "1px solid #272727", background: "rgba(0,0,0,0.58)", borderRadius: 10, padding: 16, color: "#f4f4f4", fontSize: 13, lineHeight: 1.85, fontFamily: "'JetBrains Mono', monospace" }}>
      {code}
    </pre>
  )
}

export default function AgentMiniProgramPage() {
  return (
    <div className="xb-workbench" style={{ background: "#000", minHeight: "100vh", fontFamily: "'Noto Sans SC', sans-serif", position: "relative", overflow: "hidden" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MathRain />
      <NavBar />
      <main className="xb-workbench-main" style={{ maxWidth: 1080, margin: "0 auto", padding: "58px clamp(16px,5vw,56px) 104px", position: "relative", zIndex: 10, background: "rgba(0,0,0,0.92)" }}>
        <h1 style={{ color: "#fff", fontSize: 42, fontWeight: 950, lineHeight: 1.18, marginBottom: 14 }}>实战：指挥 Agent 做微信小程序并上线</h1>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 34 }}>
          <a href="#workflow" className="btn-primary" style={{ textDecoration: "none" }}>开始第一步</a>
          <a href="#launch" className="btn-outline" style={{ textDecoration: "none" }}>直接看上线</a>
          <Link href="/agent-install" className="btn-outline" style={{ textDecoration: "none" }}>先装 Agent</Link>
        </div>

        <section id="workflow" style={{ marginBottom: 42 }}>
          <h2 style={{ color: "#fff", fontSize: 25, fontWeight: 950, marginBottom: 14 }}>照做流程</h2>
          <div style={{ display: "grid", gap: 14 }}>
            {workflowSteps.map((step, index) => (
              <details key={step.title} open={index === 0} style={{ border: "1px solid #1f1f1f", background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "0 20px" }}>
                <summary style={{ cursor: "pointer", listStyle: "none", padding: "18px 0", color: "#fff", fontSize: 18, fontWeight: 950 }}>{step.title}</summary>
                <div style={{ borderTop: "1px solid #202020", padding: "16px 0 20px" }}>
                  <p style={{ color: "#bbb", fontSize: 13, lineHeight: 1.8, marginBottom: 12 }}>{step.desc}</p>
                  <p style={{ color: "#e8c96a", fontSize: 13, fontWeight: 950, marginBottom: 8 }}>复制给 Agent</p>
                  <CodeBlock code={step.prompt} />
                </div>
              </details>
            ))}
          </div>
        </section>

        <section id="launch" style={{ marginBottom: 42 }}>
          <h2 style={{ color: "#fff", fontSize: 25, fontWeight: 950, marginBottom: 14 }}>最后怎么上线</h2>
          <div style={{ display: "grid", gap: 10 }}>
            {launchSteps.map((step, index) => (
              <div key={step.title} style={{ display: "grid", gridTemplateColumns: "34px 1fr", gap: 12, border: "1px solid #2a1f10", background: "rgba(201,168,76,0.045)", borderRadius: 12, padding: "17px 18px" }}>
                <span style={{ display: "inline-flex", width: 30, height: 30, alignItems: "center", justifyContent: "center", borderRadius: 999, background: "rgba(201,168,76,0.12)", color: "#e8c96a", fontSize: 12, fontWeight: 950 }}>{index + 1}</span>
                <span>
                  <strong style={{ display: "block", color: "#fff", fontSize: 16, fontWeight: 950, marginBottom: 6 }}>{step.title}</strong>
                  <span style={{ display: "block", color: "#bbb", fontSize: 13, lineHeight: 1.8 }}>{step.detail}</span>
                </span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
            <a href="https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html" target="_blank" rel="noreferrer" className="btn-outline" style={{ textDecoration: "none" }}>
              微信开发者工具 <ExternalLink size={13} />
            </a>
            <a href="https://mp.weixin.qq.com/" target="_blank" rel="noreferrer" className="btn-outline" style={{ textDecoration: "none" }}>
              微信公众平台 <ExternalLink size={13} />
            </a>
            <a href="https://developers.weixin.qq.com/miniprogram/introduction/" target="_blank" rel="noreferrer" className="btn-outline" style={{ textDecoration: "none" }}>
              小程序官方文档 <ExternalLink size={13} />
            </a>
          </div>
        </section>

        <section style={{ marginBottom: 42 }}>
          <h2 style={{ color: "#fff", fontSize: 25, fontWeight: 950, marginBottom: 14 }}>最容易踩的坑</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,260px),1fr))", gap: 12 }}>
            {commonPitfalls.map((item) => (
              <div key={item.title} style={{ border: "1px solid #3a211b", background: "rgba(180,60,40,0.07)", borderRadius: 12, padding: "17px 18px" }}>
                <h3 style={{ color: "#ffb199", fontSize: 16, fontWeight: 950, lineHeight: 1.4, marginBottom: 8 }}>{item.title}</h3>
                <p style={{ color: "#d8c8bd", fontSize: 13, lineHeight: 1.8 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ border: "1px solid #2a1f10", background: "rgba(201,168,76,0.04)", borderRadius: 12, padding: "22px 24px" }}>
          <h2 style={{ color: "#fff", fontSize: 21, fontWeight: 950, marginBottom: 10 }}>下一步怎么练</h2>
          <p style={{ color: "#ccc", fontSize: 14, lineHeight: 1.9, marginBottom: 16 }}>
            先做一个只有 2 到 3 个页面的小程序，不要第一版就做支付、会员、复杂后台。等第一版能上线，再让 Agent 帮你做第二轮迭代。
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href="/agent-install" className="btn-primary" style={{ textDecoration: "none" }}>安装 Agent</Link>
            <Link href="/models" className="btn-outline" style={{ textDecoration: "none" }}>选择模型大脑</Link>
            <Link href="/ai-coding" className="btn-outline" style={{ textDecoration: "none" }}>看 AI 编程工具</Link>
            <Link href="/community/new" className="btn-outline" style={{ textDecoration: "none" }}>发帖复盘</Link>
          </div>
        </section>
      </main>
      <style>{`
        @media (max-width: 760px) {
          .mini-program-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
