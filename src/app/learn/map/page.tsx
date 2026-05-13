import type { Metadata } from "next"
import { LearningMap } from "@/components/learning/LearningSystem"

export const metadata: Metadata = {
  title: "小白AI完整学习路线图",
  description: "小白AI完整学习路线图：从AI入门、办公提效、内容创作，到Agent、自动化工作流和企业知识库。",
  alternates: { canonical: "/learn/map" },
}

export default function LearnMapPage() {
  return <LearningMap />
}
