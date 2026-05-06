import type { Metadata } from "next"
import GrowthClient from "./GrowthClient"

export const metadata: Metadata = {
  title: "AI 成长舱 - 小白AI",
  description: "每日 AI 学习任务、连续打卡、经验值和下一步推荐，让新手有节奏地从零学会 AI。",
}

export default function GrowthPage() {
  return <GrowthClient />
}
