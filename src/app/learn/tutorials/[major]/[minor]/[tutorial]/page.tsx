import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { NotFoundLearningSubject, TutorialDetailView } from "@/components/learning/LearningSystem"
import { getAllTutorials, getTutorial } from "@/data/learning-catalog"

export async function generateStaticParams() {
  return getAllTutorials().map(({ major, subject, tutorial }) => ({
    major: major.id,
    minor: subject.id,
    tutorial: tutorial.id,
  }))
}

export function generateMetadata({ params }: { params: { major: string; minor: string; tutorial: string } }): Metadata {
  const result = getTutorial(params.major, params.minor, params.tutorial)
  if (!result) {
    return {
      title: "没有找到这个教程",
      alternates: { canonical: `/learn/tutorials/${params.major}/${params.minor}/${params.tutorial}` },
    }
  }

  return {
    title: `${result.tutorial.title} - ${result.subject.title}教程`,
    description: `${result.subject.title}教程：${result.tutorial.title}。学完交付物：${result.tutorial.deliverable}`,
    alternates: { canonical: `/learn/tutorials/${params.major}/${params.minor}/${params.tutorial}` },
  }
}

export default function TutorialPage({ params }: { params: { major: string; minor: string; tutorial: string } }) {
  const result = getTutorial(params.major, params.minor, params.tutorial)
  if (!result) return <NotFoundLearningSubject />
  if (!result.major || !result.subject || !result.tutorial) notFound()
  return <TutorialDetailView major={result.major} subject={result.subject} tutorial={result.tutorial} />
}
