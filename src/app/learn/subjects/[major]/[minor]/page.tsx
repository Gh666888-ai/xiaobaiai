import type { Metadata } from "next"
import { MinorSubjectView, NotFoundLearningSubject } from "@/components/learning/LearningSystem"
import { getMajorSubject, getMinorSubject, learningCatalog } from "@/data/learning-catalog"

export async function generateStaticParams() {
  return learningCatalog.flatMap((major) => major.subjects.map((minor) => ({ major: major.id, minor: minor.id })))
}

export function generateMetadata({ params }: { params: { major: string; minor: string } }): Metadata {
  const major = getMajorSubject(params.major)
  const minor = getMinorSubject(params.major, params.minor)
  if (!major || !minor) return { title: "学习小科目未找到" }
  return {
    title: `${minor.title} - ${major.title}`,
    description: `${minor.description} 目标：${minor.goal}`,
    alternates: { canonical: `/learn/subjects/${major.id}/${minor.id}` },
  }
}

export default function MinorSubjectPage({ params }: { params: { major: string; minor: string } }) {
  const major = getMajorSubject(params.major)
  const minor = getMinorSubject(params.major, params.minor)
  if (!major || !minor) return <NotFoundLearningSubject />
  return <MinorSubjectView major={major} subject={minor} />
}
