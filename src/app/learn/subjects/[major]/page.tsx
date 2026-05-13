import type { Metadata } from "next"
import { MajorSubjectView, NotFoundLearningSubject } from "@/components/learning/LearningSystem"
import { getMajorSubject, learningCatalog } from "@/data/learning-catalog"

export async function generateStaticParams() {
  return learningCatalog.map((major) => ({ major: major.id }))
}

export function generateMetadata({ params }: { params: { major: string } }): Metadata {
  const major = getMajorSubject(params.major)
  if (!major) return { title: "学习科目未找到 | 小白AI" }
  return {
    title: `${major.title} - 小白AI学习地图`,
    description: `${major.subtitle} 目标：${major.goal}`,
    alternates: { canonical: `/learn/subjects/${major.id}` },
  }
}

export default function MajorSubjectPage({ params }: { params: { major: string } }) {
  const major = getMajorSubject(params.major)
  if (!major) return <NotFoundLearningSubject />
  return <MajorSubjectView major={major} />
}
