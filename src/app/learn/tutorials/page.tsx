import type { Metadata } from "next"
import { TutorialLibrary } from "@/components/learning/LearningSystem"

export const metadata: Metadata = {
  title: "小白AI教程目录 - 只看教程",
  description: "小白AI教程目录：按大科目和小科目查看教程，不混任务，适合只想先学习 AI 方法和操作步骤的人。",
  alternates: { canonical: "/learn/tutorials" },
}

export default function TutorialsPage() {
  return <TutorialLibrary />
}
