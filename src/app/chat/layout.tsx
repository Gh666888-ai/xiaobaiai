import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "问小白AI - 站内 AI 助手",
  description: "在小白AI网站内直接提问，让小白AI帮你选工具、拆需求、规划学习路线、理解模型价格和搭建 AI 工作流。",
  alternates: { canonical: "/chat" },
  openGraph: {
    title: "问小白AI - 站内 AI 助手",
    description: "让小白AI帮你选工具、拆需求、规划学习路线和搭建 AI 工作流。",
    url: "/chat",
    images: [{ url: "/xiaobai-mascot-cutout.png", width: 1071, height: 1468, alt: "问小白AI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "问小白AI - 站内 AI 助手",
    description: "站内直接提问，帮 AI 新手更快找到工具和下一步。",
    images: ["/xiaobai-mascot-cutout.png"],
  },
}

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return children
}
