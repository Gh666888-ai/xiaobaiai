import type { Metadata } from "next"
import type { ReactNode } from "react"
import { stages } from "@/data/learning-path"

function findStage(id: string) {
  return stages.find((stage) => String(stage.id) === id)
}

function text(value: string, length = 155) {
  return value.replace(/\s+/g, " ").trim().slice(0, length)
}

export async function generateStaticParams() {
  return stages.map((stage) => ({ id: String(stage.id) }))
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const stage = findStage(params.id)
  if (!stage) {
    return {
      title: "AI学习路径",
      alternates: { canonical: `/learn/${params.id}` },
    }
  }

  const title = `${stage.title} - AI学习路径`
  const description = `${stage.subtitle}。适合：${stage.whoIsThisFor}，预计学习时间：${stage.timeEstimate}。`
  const url = `/learn/${stage.id}`

  return {
    title,
    description,
    keywords: [stage.title, stage.subtitle, "AI学习路径", "AI教程", "Agent教程", "小白AI"],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      siteName: "小白AI",
      images: [{ url: "/xiaobai-mascot-cutout.png", alt: "小白AI" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/xiaobai-mascot-cutout.png"],
    },
  }
}

export default function LearnStageLayout({ children, params }: { children: ReactNode; params: { id: string } }) {
  const stage = findStage(params.id)
  const courseJsonLd = stage
    ? {
        "@context": "https://schema.org",
        "@type": "Course",
        name: stage.title,
        description: text(`${stage.subtitle}。${stage.whoIsThisFor}`, 300),
        url: `https://www.xiaobaiai.cn/learn/${stage.id}`,
        timeRequired: stage.timeEstimate,
        provider: {
          "@type": "Organization",
          name: "小白AI",
          sameAs: "https://www.xiaobaiai.cn",
        },
        hasCourseInstance: {
          "@type": "CourseInstance",
          courseMode: "online",
          courseWorkload: stage.timeEstimate,
        },
        hasPart: stage.sections.map((section, index) => ({
          "@type": "LearningResource",
          position: index + 1,
          name: section.title,
          description: text(section.content, 240),
        })),
      }
    : null

  return (
    <>
      {courseJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
        />
      )}
      {children}
    </>
  )
}
