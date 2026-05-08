"use client"

import { useEffect, useMemo, useState } from "react"
import type { CSSProperties } from "react"
import { ArrowRight, CheckCircle2, Clipboard, MessageCircle, RotateCcw } from "lucide-react"
import { NavBar } from "@/components/NavBar"
import { useAuth } from "@/lib/AuthContext"
import { readAppAuth } from "@/lib/app-auth"
import { missions } from "@/data/missions"
import {
  getStoredMission,
  markMissionStepDone,
  readMissionProgress,
  selectMission,
  writeMissionProgress,
  type MissionProgressState,
} from "@/lib/mission-progress"

const initialMission = missions[0]

function starterProgress(): MissionProgressState {
  return { activeMissionId: initialMission.id, missions: {} }
}

function progressUpdatedAt(state: MissionProgressState) {
  const mission = getStoredMission(state, initialMission.id)
  return new Date(mission.updatedAt || 0).getTime()
}

function newerProgress(local: MissionProgressState, remote: MissionProgressState) {
  return progressUpdatedAt(remote) > progressUpdatedAt(local) ? remote : local
}

export function StartClient() {
  const { user, loading } = useAuth()
  const [progress, setProgress] = useState<MissionProgressState>(starterProgress)
  const [copied, setCopied] = useState(false)
  const [syncState, setSyncState] = useState("本机已记录")

  const selected = initialMission
  const selectedProgress = getStoredMission(progress, selected.id)
  const currentStepIndex = Math.min(selectedProgress.currentStep || 0, selected.steps.length - 1)
  const currentStep = selected.steps[currentStepIndex]
  const doneSteps = selected.steps.filter((_, index) => selectedProgress.completedSteps[index]).length
  const totalSteps = selected.steps.length
  const completed = selectedProgress.completed
  const percent = Math.round((doneSteps / totalSteps) * 100)
  const stepLabel = completed ? "已完成" : `第 ${currentStepIndex + 1} 步 / 共 ${totalSteps} 步`

  useEffect(() => {
    const saved = selectMission(readMissionProgress(), initialMission.id)
    setProgress(saved)
  }, [])

  useEffect(() => {
    if (loading || !user) return
    let cancelled = false

    async function loadAccountProgress() {
      const token = readAppAuth()?.session?.access_token
      if (!token) return
      try {
        const res = await fetch("/api/mission-progress", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok || !data?.progress) {
          setSyncState("本机已记录，登录进度待同步")
          return
        }
        if (cancelled) return
        setProgress((local) => {
          const next = newerProgress(local, selectMission(data.progress, initialMission.id))
          writeMissionProgress(next)
          return next
        })
        setSyncState("账号进度已同步")
      } catch {
        setSyncState("本机已记录，账号同步稍后重试")
      }
    }

    loadAccountProgress()
    return () => {
      cancelled = true
    }
  }, [loading, user])

  const quickPrompt = useMemo(() => {
    if (completed) return selected.recapTemplate
    return currentStep.prompt || currentStep.action
  }, [completed, currentStep, selected.recapTemplate])

  function persistLocal(next: MissionProgressState) {
    setProgress(next)
    writeMissionProgress(next)
    setSyncState(user ? "本机已记录，正在同步账号..." : "本机已记录")
  }

  async function syncAccount(next: MissionProgressState) {
    const token = readAppAuth()?.session?.access_token
    if (!user || !token) return
    try {
      const res = await fetch("/api/mission-progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ progress: next }),
      })
      setSyncState(res.ok ? "账号进度已同步" : "本机已记录，账号同步稍后重试")
    } catch {
      setSyncState("本机已记录，账号同步稍后重试")
    }
  }

  function confirmCurrentStep() {
    if (completed) return
    const proof = {
      method: "self-check" as const,
      text: `用户在 /start 点击确认完成：${currentStep.title}`,
      checked: [true],
      updatedAt: new Date().toISOString(),
    }
    const next = markMissionStepDone(progress, selected.id, currentStepIndex, selected.steps.length, proof)
    persistLocal(next)
    syncAccount(next)
  }

  function restartMission() {
    const next = selectMission({
      activeMissionId: selected.id,
      missions: {
        ...progress.missions,
        [selected.id]: {
          currentStep: 0,
          completedSteps: [],
          completed: false,
          updatedAt: new Date().toISOString(),
        },
      },
    }, selected.id)
    persistLocal(next)
    syncAccount(next)
  }

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(quickPrompt)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1400)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div style={{ background: "#050505", minHeight: "100vh", fontFamily: "'Noto Sans SC', sans-serif", position: "relative" }}>
      <NavBar />
      <main style={mainStyle}>
        <section style={panelStyle}>
          <div style={topRowStyle}>
            <div>
              <p style={eyebrowStyle}>开始</p>
              <h1 style={titleStyle}>{completed ? "这个任务做完了" : currentStep.title}</h1>
            </div>
            <span style={statusPillStyle}>{stepLabel}</span>
          </div>

          <div style={progressTrackStyle}>
            <span style={{ ...progressBarStyle, width: `${completed ? 100 : percent}%` }} />
          </div>

          <div style={taskBoxStyle}>
            <p style={smallLabelStyle}>现在只做这件事</p>
            <p style={taskTextStyle}>{completed ? "点右下角小白，说你的行业和目标，让它给你换成下一条路线。" : currentStep.action}</p>
          </div>

          {!completed && (
            <p style={deliverableStyle}>做到这一步，你应该有：{currentStep.deliverable}</p>
          )}

          <div style={actionRowStyle}>
            {completed ? (
              <button type="button" onClick={() => window.dispatchEvent(new Event("xiaobai:open-chat"))} className="btn-primary" style={buttonStyle}>
                让小白定制下一步 <MessageCircle size={16} />
              </button>
            ) : (
              <button type="button" onClick={confirmCurrentStep} className="btn-primary" style={buttonStyle}>
                我做完了，确认 <CheckCircle2 size={16} />
              </button>
            )}
            <button type="button" onClick={copyPrompt} className="btn-outline" style={outlineButtonStyle}>
              {copied ? "已复制" : "复制小白提示词"} <Clipboard size={14} />
            </button>
          </div>

          <div style={footerRowStyle}>
            <p style={syncTextStyle}>{user ? syncState : "登录后会同步到账号；现在先保存在本机"}</p>
            {(doneSteps > 0 || completed) && (
              <button type="button" onClick={restartMission} style={resetButtonStyle}>
                <RotateCcw size={13} /> 重新开始
              </button>
            )}
          </div>
        </section>

        <section style={agentHintStyle}>
          <p style={{ color: "#fff", fontSize: 17, fontWeight: 950, marginBottom: 7 }}>想换成你的行业任务？</p>
          <p style={{ color: "#aaa", fontSize: 13, lineHeight: 1.75, marginBottom: 14 }}>
            点右下角小白，告诉它你做什么行业、想用 AI 做成什么。它会给你换成对应的学习工具和任务路线。
          </p>
          <button type="button" onClick={() => window.dispatchEvent(new Event("xiaobai:open-chat"))} className="btn-outline" style={agentButtonStyle}>
            叫小白来定制 <ArrowRight size={14} />
          </button>
        </section>
      </main>
    </div>
  )
}

const mainStyle: CSSProperties = {
  maxWidth: 700,
  margin: "0 auto",
  minHeight: "calc(100vh - 76px)",
  padding: "36px clamp(16px,5vw,40px) 72px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
}

const panelStyle: CSSProperties = {
  border: "1px solid #2a1f10",
  background: "rgba(10,10,10,0.97)",
  borderRadius: 12,
  padding: "26px clamp(18px,5vw,34px)",
}

const topRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "start",
  gap: 14,
  marginBottom: 18,
}

const eyebrowStyle: CSSProperties = {
  color: "#e8c96a",
  fontSize: 12,
  fontWeight: 950,
  marginBottom: 9,
}

const titleStyle: CSSProperties = {
  color: "#fff",
  fontSize: "clamp(32px,7vw,58px)",
  fontWeight: 950,
  lineHeight: 1.08,
  margin: 0,
}

const statusPillStyle: CSSProperties = {
  border: "1px solid #3a321d",
  background: "rgba(201,168,76,0.08)",
  color: "#e8c96a",
  borderRadius: 999,
  padding: "7px 10px",
  fontSize: 12,
  fontWeight: 950,
  whiteSpace: "nowrap",
}

const progressTrackStyle: CSSProperties = {
  height: 7,
  borderRadius: 999,
  background: "#171717",
  overflow: "hidden",
  marginBottom: 18,
}

const progressBarStyle: CSSProperties = {
  display: "block",
  height: "100%",
  borderRadius: 999,
  background: "linear-gradient(90deg,#7a6230,#e8c96a)",
  transition: "width 0.35s ease",
}

const taskBoxStyle: CSSProperties = {
  border: "1px solid #242424",
  background: "rgba(255,255,255,0.035)",
  borderRadius: 10,
  padding: "16px 17px",
}

const smallLabelStyle: CSSProperties = {
  color: "#e8c96a",
  fontSize: 12,
  fontWeight: 950,
  marginBottom: 8,
}

const taskTextStyle: CSSProperties = {
  color: "#fff",
  fontSize: 18,
  lineHeight: 1.85,
  fontWeight: 900,
  margin: 0,
}

const deliverableStyle: CSSProperties = {
  color: "#cdbb80",
  fontSize: 13,
  lineHeight: 1.75,
  marginTop: 12,
}

const actionRowStyle: CSSProperties = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  marginTop: 20,
}

const buttonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  minHeight: 48,
  padding: "0 20px",
}

const outlineButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  minHeight: 48,
}

const footerRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  marginTop: 16,
  flexWrap: "wrap",
}

const syncTextStyle: CSSProperties = {
  color: "#777",
  fontSize: 12,
  lineHeight: 1.6,
}

const resetButtonStyle: CSSProperties = {
  border: 0,
  background: "transparent",
  color: "#8a8a8a",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  fontSize: 12,
  cursor: "pointer",
}

const agentHintStyle: CSSProperties = {
  border: "1px solid #1f1f1f",
  background: "rgba(12,12,12,0.9)",
  borderRadius: 12,
  padding: "18px 20px",
  marginTop: 12,
}

const agentButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
}
