import type { Metadata } from "next"
import LearnClient from "./LearnClient"

export const metadata: Metadata = {
  title: "AI学习路径 - 从零基础到Agent、AI编程和工作流自动化",
  description: "小白AI学习路径把 AI 学习从低级到高级贯通起来：认识 AI、会用工具、完成任务、搭建 Agent、连接 API、AI 编程、工作流自动化和行业实战复盘。",
  keywords: ["AI学习路径", "AI教程", "零基础学AI", "Agent教程", "AI编程学习", "AI工作流", "Claude Code教程", "小白学AI"],
  alternates: { canonical: "/learn" },
  openGraph: {
    title: "AI学习路径 | 小白AI",
    description: "从零基础认识 AI，到工具使用、真实任务、Agent、API、AI 编程和自动化工作流。",
    url: "/learn",
    images: [{ url: "/xiaobai-mascot-cutout.png", alt: "小白AI 学习路径" }],
  },
}

export default function LearnPage() {
  return <LearnClient />
}
