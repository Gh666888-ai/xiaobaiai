import type { Metadata } from "next"
import SkillsClient from "./SkillsClient"

export const metadata: Metadata = {
  title: "Agent 技能库",
  description: "收录可直接安装和复用的 Agent 技能，支持按分类、平台、难度和关键词筛选，帮助新手快速搭建自动化工作流。",
  alternates: { canonical: "/skills" },
}

export default function SkillsPage() {
  return <SkillsClient />
}
