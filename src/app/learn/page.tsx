import type { Metadata } from "next"
import { LearningHome } from "@/components/learning/LearningSystem"

export const metadata: Metadata = {
  title: "小白AI学习地图 - 大科目、小科目、教程和实战任务",
  description: "小白AI把AI学习拆成大科目、小科目、教程和实战任务：从AI入门、办公提效、内容创作，到Agent、自动化工作流和企业知识库。",
  keywords: ["小白AI学习地图", "AI学习路线", "AI教程", "Agent教程", "AI工作流", "AI实战任务"],
  alternates: { canonical: "/learn" },
  openGraph: {
    title: "小白AI学习地图",
    description: "先选大科目，再进小科目，最后完成教程和任务。",
    url: "/learn",
    images: [{ url: "/xiaobai-mascot-cutout.png", alt: "小白AI学习地图" }],
  },
}

export default function LearnPage() {
  return <LearningHome />
}
