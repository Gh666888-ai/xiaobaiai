import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "隐私政策 - 小白AI",
  description: "小白AI 与小白 Agent 手机工作室的隐私政策，说明账号登录、语音输入、电脑端连接、任务同步和数据保护规则。",
  alternates: { canonical: "/privacy" },
}

const sections = [
  {
    title: "我们会收集哪些信息",
    body: [
      "账号信息：用于登录小白AI网站会员账号，并在手机端、网站端和电脑端之间识别同一个用户。",
      "任务与对话信息：用于让小白 Agent 完成你主动发起的问答、任务、同步和远程控制请求。",
      "设备连接状态：用于显示同账号电脑端小白 Agent 是否在线、是否可接收任务，以及任务执行进度。",
      "语音输入内容：当你主动点击语音按钮时，系统会把语音识别成文字后提交给小白处理。App 不会在后台持续录音。",
    ],
  },
  {
    title: "我们如何使用这些信息",
    body: [
      "用于完成登录、问答、任务下发、任务状态同步、电脑端连接、错误诊断和安全风控。",
      "用于改进小白 Agent 的任务完成质量，例如减少重复回复、提升同步速度、优化任务拆解和验收。",
      "不会把你的账号密码、验证码、API Key、私钥或支付信息写入长期记忆。",
    ],
  },
  {
    title: "权限说明",
    body: [
      "网络权限：用于连接小白AI网站服务、同步任务和获取电脑端状态。",
      "麦克风权限：仅在你点击语音输入时用于系统语音识别。",
      "小白 Agent 手机工作室不会申请通讯录、短信、位置、相册或后台录音权限。",
    ],
  },
  {
    title: "电脑端连接",
    body: [
      "手机端需要登录与你电脑端相同的小白AI网站账号，才能看到同账号设备状态并下发任务。",
      "涉及文件修改、发消息、删除、部署、付款、密钥输入等高风险操作时，电脑端小白 Agent 应保留人工确认。",
      "如果你退出登录或断开设备，同步和远程控制能力会停止。",
    ],
  },
  {
    title: "你的控制权",
    body: [
      "你可以在 App 内退出登录，停止当前手机端同步。",
      "你可以在电脑端停止小白 Agent，阻止手机继续远程下发任务。",
      "如需删除账号、任务历史或相关数据，可以通过小白AI网站公布的联系方式提交请求。",
    ],
  },
]

export default function PrivacyPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#f7fbff", color: "#102033", padding: "48px 20px" }}>
      <article style={{ maxWidth: 860, margin: "0 auto", background: "#fff", border: "1px solid #dbe8f5", borderRadius: 16, padding: "34px 28px", boxShadow: "0 20px 70px rgba(16,32,51,.08)" }}>
        <p style={{ margin: 0, color: "#1478c8", fontWeight: 800 }}>小白AI / Xiaobai Nexus</p>
        <h1 style={{ margin: "12px 0 10px", fontSize: 34, lineHeight: 1.2 }}>隐私政策</h1>
        <p style={{ margin: "0 0 28px", color: "#5c6f83", lineHeight: 1.8 }}>
          本政策适用于小白AI网站和小白 Agent 手机工作室。我们只围绕用户主动发起的登录、问答、任务同步和电脑端连接处理必要信息。
          更新日期：2026-05-20。
        </p>

        {sections.map((section) => (
          <section key={section.title} style={{ borderTop: "1px solid #e7eef7", paddingTop: 22, marginTop: 22 }}>
            <h2 style={{ margin: "0 0 12px", fontSize: 22 }}>{section.title}</h2>
            <ul style={{ margin: 0, paddingLeft: 20, color: "#44576b", lineHeight: 1.85 }}>
              {section.body.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </article>
    </main>
  )
}
