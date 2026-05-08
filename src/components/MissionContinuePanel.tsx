"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, BookOpen, CheckCircle2, Compass, MessageCircle, Route, Sparkles } from "lucide-react"
import { missions, type Mission } from "@/data/missions"
import type { Post } from "@/data/community"
import { getCasePostsForMission } from "@/data/product-loop"
import {
  currentStepLabel,
  emptyMissionProgress,
  getStoredMission,
  readMissionProgress,
  type MissionProgressState,
} from "@/lib/mission-progress"

type MissionContinuePanelProps = {
  compact?: boolean
  title?: string
  casePosts?: Post[]
}

function countDone(mission: Mission, state: MissionProgressState) {
  const stored = getStoredMission(state, mission.id)
  return mission.steps.filter((_, index) => stored.completedSteps[index]).length
}

function pickNextMissions(active: Mission, state: MissionProgressState) {
  const scored = missions
    .filter((mission) => mission.id !== active.id)
    .map((mission) => {
      const done = countDone(mission, state)
      const tagScore = mission.tags.filter((tag) => active.tags.includes(tag)).length * 3
      const toolScore = mission.toolIds.filter((id) => active.toolIds.includes(id)).length * 4
      const unfinishedScore = done === 0 ? 6 : mission.steps.length - done
      const stageScore = mission.stage === active.stage ? 2 : 0
      return { mission, score: tagScore + toolScore + unfinishedScore + stageScore }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)

  return scored.map((item) => item.mission)
}

export function MissionContinuePanel({ compact = false, title = "小白记得你上次做到哪", casePosts = [] }: MissionContinuePanelProps) {
  const [progress, setProgress] = useState<MissionProgressState>(() => emptyMissionProgress())

  useEffect(() => {
    setProgress(readMissionProgress())
  }, [])

  const activeMission = useMemo(() => {
    return missions.find((mission) => mission.id === progress.activeMissionId) || missions[0]
  }, [progress.activeMissionId])

  const activeProgress = getStoredMission(progress, activeMission.id)
  const currentStepIndex = Math.min(activeProgress.currentStep || 0, activeMission.steps.length - 1)
  const doneSteps = countDone(activeMission, progress)
  const percent = Math.round((doneSteps / activeMission.steps.length) * 100)
  const nextStep = activeProgress.completed ? "任务已完成，建议发复盘沉淀经验" : currentStepLabel(activeMission.id, currentStepIndex)
  const relatedCases = casePosts.length > 0 ? getCasePostsForMission(activeMission.id, casePosts).slice(0, compact ? 1 : 2) : []
  const nextMissions = pickNextMissions(activeMission, progress)

  return (
    <section style={{ border: "1px solid #2a1f10", background: "linear-gradient(135deg, rgba(201,168,76,0.075), rgba(255,255,255,0.025))", borderRadius: 12, padding: compact ? "16px 18px" : "22px 24px", marginBottom: compact ? 18 : 30 }}>
      <div style={{ display: "grid", gridTemplateColumns: compact ? "1fr" : "1.1fr 0.9fr", gap: 18, alignItems: "start" }} className="max-sm:grid-cols-1">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Sparkles size={17} style={{ color: "#e8c96a" }} />
            <h2 style={{ color: "#fff", fontSize: compact ? 16 : 20, fontWeight: 950 }}>{title}</h2>
          </div>
          <p style={{ color: "#d8d8d8", fontSize: 14, lineHeight: 1.8, marginBottom: 13 }}>
            当前任务：<b>{activeMission.shortTitle}</b>。下一步：<b>{nextStep}</b>。
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ flex: 1, height: 8, background: "#151515", borderRadius: 999, overflow: "hidden" }}>
              <span style={{ display: "block", height: "100%", width: `${percent}%`, background: "#c9a84c" }} />
            </div>
            <span style={{ color: "#cdbb80", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 950 }}>{doneSteps}/{activeMission.steps.length}</span>
          </div>
          <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
            <Link href={`/missions/${activeMission.id}`} className="btn-primary" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
              继续任务 <ArrowRight size={14} />
            </Link>
            <Link href="/start" className="btn-outline" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
              重新选目标 <Compass size={14} />
            </Link>
            <Link href="/community/new" className="btn-outline" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
              发复盘 <MessageCircle size={14} />
            </Link>
          </div>
        </div>

        {!compact && (
          <div style={{ display: "grid", gap: 10 }}>
            {relatedCases.length > 0 && (
              <div style={{ border: "1px solid #242424", borderRadius: 10, background: "rgba(0,0,0,0.24)", padding: "14px 15px" }}>
                <p style={{ color: "#e8c96a", fontSize: 12, fontWeight: 950, display: "flex", alignItems: "center", gap: 7, marginBottom: 9 }}>
                  <BookOpen size={14} /> 相关案例
                </p>
                <div style={{ display: "grid", gap: 8 }}>
                  {relatedCases.map((post) => (
                    <Link key={post.id} href={`/community/${post.id}`} style={{ color: "#ddd", fontSize: 12, lineHeight: 1.55, textDecoration: "none" }}>
                      {post.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            <div style={{ border: "1px solid #242424", borderRadius: 10, background: "rgba(0,0,0,0.24)", padding: "14px 15px" }}>
              <p style={{ color: "#e8c96a", fontSize: 12, fontWeight: 950, display: "flex", alignItems: "center", gap: 7, marginBottom: 9 }}>
                <Route size={14} /> 做完后建议
              </p>
              <div style={{ display: "grid", gap: 8 }}>
                {nextMissions.map((mission) => (
                  <Link key={mission.id} href={`/missions/${mission.id}`} style={{ color: "#ddd", fontSize: 12, lineHeight: 1.55, textDecoration: "none", display: "flex", alignItems: "center", gap: 7 }}>
                    <CheckCircle2 size={13} style={{ color: "#3DA563", flexShrink: 0 }} /> {mission.shortTitle}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
