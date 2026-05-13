import { redirect } from "next/navigation"

const legacyStageTargets: Record<string, string> = {
  "0": "/learn/subjects/ai-basics",
  "1": "/learn/subjects/office-productivity",
  "2": "/learn/subjects/agent-coding",
  "3": "/learn/subjects/content-creation",
  "4": "/learn/subjects/automation",
}

export default function LegacyLearnStagePage({ params }: { params: { id: string } }) {
  redirect(legacyStageTargets[params.id] || "/learn")
}
