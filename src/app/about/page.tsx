import type { Metadata } from "next"
import AboutClient from "./AboutClient"

export const metadata: Metadata = {
  title: "关于小白AI",
  description: "小白AI是面向零基础用户的一站式 AI 学习与导航平台，帮助普通人找到适合自己的 AI 工具、学习路径和 Agent 实战方法。",
  alternates: { canonical: "/about" },
}

export default function AboutPage() {
  return <AboutClient />
}
