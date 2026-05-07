import type { Metadata } from "next"
import LearnClient from "./LearnClient"

export const metadata: Metadata = {
  title: "AI学习路径 - 零基础AI教程、Agent教程和工作流自动化入门",
  description: "小白AI学习路径从零基础认识 AI 开始，带你学习 AI工具使用、Prompt、Agent安装、本地模型部署和工作流自动化，适合新手系统学习 AI。",
  keywords: ["AI学习路径", "AI教程", "零基础学AI", "Agent教程", "Prompt教程", "AI工作流", "小白学AI"],
  alternates: { canonical: "/learn" },
  openGraph: {
    title: "AI学习路径 | 小白AI",
    description: "从零基础认识 AI，到使用工具、安装 Agent、部署模型和搭建自动化工作流。",
    url: "/learn",
    images: [{ url: "/xiaobai-mascot-cutout.png", alt: "小白AI 学习路径" }],
  },
}

export default function LearnPage() {
  return <LearnClient />
}
