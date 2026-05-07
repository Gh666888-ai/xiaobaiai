import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "问小白AI - 站内 AI 助手",
  description: "在小白AI网站内直接提问，让小白AI帮你选工具、拆需求、规划学习路线、理解模型价格和搭建 AI 工作流。",
  alternates: { canonical: "/chat" },
}

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return children
}
