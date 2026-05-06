import type { Metadata } from "next"
import LearnClient from "./LearnClient"

export const metadata: Metadata = {
  title: "AI 学习路径",
  description: "从零基础认识 AI，到使用工具、安装 Agent、部署模型和搭建自动化工作流的分阶段学习路径。",
  alternates: { canonical: "/learn" },
}

export default function LearnPage() {
  return <LearnClient />
}
