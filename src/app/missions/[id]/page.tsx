import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getMission, missions } from "@/data/missions"
import { MissionDetailClient } from "./MissionDetailClient"

type Props = { params: { id: string } }

export function generateStaticParams() {
  return missions.map((mission) => ({ id: mission.id }))
}

export function generateMetadata({ params }: Props): Metadata {
  const mission = getMission(params.id)
  if (!mission) return {}
  return {
    title: `${mission.title} - 小白AI实战任务`,
    description: mission.outcome,
    keywords: ["AI实战任务", ...mission.tags],
    alternates: { canonical: `/missions/${mission.id}` },
  }
}

export default function MissionDetailPage({ params }: Props) {
  const mission = getMission(params.id)
  if (!mission) notFound()
  return <MissionDetailClient mission={mission} />
}
