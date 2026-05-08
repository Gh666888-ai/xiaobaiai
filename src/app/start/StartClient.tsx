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
  const activeMission = getStoredMission(state, state.activeMissionId || initialMission.id)
  const missionTimes = Object.values(state.missions || {}).map((mission) => new Date(mission.updatedAt || 0).getTime())
  return Math.max(new Date(activeMission.updatedAt || 0).getTime(), ...missionTimes, 0)
}

function newerProgress(local: MissionProgressState, remote: MissionProgressState) {
  return progressUpdatedAt(remote) > progressUpdatedAt(local) ? remote : local
}

function normalizeProgress(state?: Partial<MissionProgressState> | null): MissionProgressState {
  const activeMissionId = missions.some((mission) => mission.id === state?.activeMissionId)
    ? String(state?.activeMissionId)
    : initialMission.id
  return {
    activeMissionId,
    missions: state?.missions && typeof state.missions === "object" ? state.missions : {},
  }
}

export function StartClient() {
  const { user, loading } = useAuth()
  const [progress, setProgress] = useState<MissionProgressState>(starterProgress)
  const [copied, setCopied] = useState(false)
  const [syncState, setSyncState] = useState("本机已记录")

  const selected = missions.find((mission) => mission.id === progress.activeMissionId) || initialMission
  const selectedProgress = getStoredMission(progress, selected.id)
  const currentStepIndex = Math.min(selectedProgress.currentStep || 0, selected.steps.length - 1)
  const currentStep = selected.steps[currentStepIndex]
  const doneSteps = selected.steps.filter((_, index) => selectedProgress.completedSteps[index]).length
  const totalSteps = selected.steps.length
  const completed = selectedProgress.completed
  const percent = Math.round((doneSteps / totalSteps) * 100)
  const stepLabel = completed ? "已完成" : `第 ${currentStepIndex + 1} 步 / 共 ${totalSteps} 步`

  useEffect(() => {
    const saved = normalizeProgress(readMissionProgress())
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
          const next = newerProgress(local, normalizeProgress(data.progress))
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

  function openGoalRouter() {
    window.dispatchEvent(new CustomEvent("xiaobai:open-goal-router"))
  }

  return (
    <div style={{ background: "linear-gradient(180deg,#07100f 0%,#0b0d0c 46%,#070707 100%)", minHeight: "100vh", fontFamily: "'Noto Sans SC', sans-serif", position: "relative" }}>
      <NavBar />
      <main style={mainStyle}>
        <section style={panelStyle}>
          <div style={topRowStyle}>
            <div>
              <p style={eyebrowStyle}>开始</p>
              <h1 style={titleStyle}>{completed ? "这个任务做完了" : currentStep.title}</h1>
              <p style={missionTitleStyle}>{selected.shortTitle} · {selected.stage}</p>
            </div>
            <span style={statusPillStyle}>{stepLabel}</span>
          </div>

          <div style={progressTrackStyle}>
            <span style={{ ...progressBarStyle, width: `${completed ? 100 : percent}%` }} />
          </div>

          <div style={taskBoxStyle}>
            <p style={smallLabelStyle}>现在只做这件事</p>
            <p style={taskTextStyle}>{completed ? "点小白，说一句行业和目标，它会直接打开下一条任务模板。" : currentStep.action}</p>
          </div>

          {!completed && (
            <p style={deliverableStyle}>做到这一步，你应该有：{currentStep.deliverable}</p>
          )}

          <div style={actionRowStyle}>
            {completed ? (
              <button type="button" onClick={openGoalRouter} style={buttonStyle}>
                让小白打开任务模板 <MessageCircle size={16} />
              </button>
            ) : (
              <button type="button" onClick={confirmCurrentStep} style={buttonStyle}>
                我做完了，确认 <CheckCircle2 size={16} />
              </button>
            )}
            <button type="button" onClick={copyPrompt} style={outlineButtonStyle}>
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
          <p style={{ color: "#f7f1df", fontSize: 21, fontWeight: 950, marginBottom: 8 }}>想换成你的行业任务？</p>
          <p style={{ color: "#c8c8bd", fontSize: 16, lineHeight: 1.8, marginBottom: 16 }}>
            告诉小白一句行业和目标，它会直接跳到对应的固定任务模板，并记住你做到哪一步。
          </p>
          <button type="button" onClick={openGoalRouter} style={agentButtonStyle}>
            直接分配任务 <ArrowRight size={14} />
          </button>
        </section>
      </main>
    </div>
  )
}

const mainStyle: CSSProperties = {
  maxWidth: 780,
  margin: "0 auto",
  minHeight: "calc(100vh - 76px)",
  padding: "38px clamp(16px,5vw,42px) 76px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
}

const panelStyle: CSSProperties = {
  border: "1px solid rgba(233,215,165,0.16)",
  background: "linear-gradient(180deg,rgba(22,27,24,0.96),rgba(13,16,15,0.98))",
  borderRadius: 18,
  padding: "34px clamp(22px,5vw,44px)",
  boxShadow: "0 24px 70px rgba(0,0,0,0.36)",
}

const topRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "start",
  gap: 14,
  marginBottom: 18,
}

const eyebrowStyle: CSSProperties = {
  color: "#d8bf76",
  fontSize: 15,
  fontWeight: 950,
  marginBottom: 10,
}

const titleStyle: CSSProperties = {
  color: "#f8f3e6",
  fontSize: "clamp(36px,6.8vw,60px)",
  fontWeight: 950,
  lineHeight: 1.12,
  margin: 0,
}

const missionTitleStyle: CSSProperties = {
  color: "#cfc4a3",
  fontSize: 16,
  fontWeight: 900,
  lineHeight: 1.65,
  marginTop: 12,
}

const statusPillStyle: CSSProperties = {
  border: "1px solid rgba(216,191,118,0.28)",
  background: "rgba(216,191,118,0.1)",
  color: "#ead68f",
  borderRadius: 999,
  padding: "9px 13px",
  fontSize: 15,
  fontWeight: 950,
  whiteSpace: "nowrap",
}

const progressTrackStyle: CSSProperties = {
  height: 9,
  borderRadius: 999,
  background: "rgba(255,255,255,0.08)",
  overflow: "hidden",
  marginBottom: 22,
}

const progressBarStyle: CSSProperties = {
  display: "block",
  height: "100%",
  borderRadius: 999,
  background: "linear-gradient(90deg,#5d876f,#d8bf76)",
  transition: "width 0.35s ease",
}

const taskBoxStyle: CSSProperties = {
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(244,240,226,0.055)",
  borderRadius: 14,
  padding: "22px 24px",
}

const smallLabelStyle: CSSProperties = {
  color: "#d8bf76",
  fontSize: 16,
  fontWeight: 950,
  marginBottom: 10,
}

const taskTextStyle: CSSProperties = {
  color: "#f7f1df",
  fontSize: 22,
  lineHeight: 1.85,
  fontWeight: 900,
  margin: 0,
}

const deliverableStyle: CSSProperties = {
  color: "#d6caa8",
  fontSize: 17,
  lineHeight: 1.85,
  marginTop: 15,
}

const actionRowStyle: CSSProperties = {
  display: "flex",
  gap: 12,
  flexWrap: "wrap",
  marginTop: 24,
}

const buttonStyle: CSSProperties = {
  border: "1px solid rgba(216,191,118,0.42)",
  background: "linear-gradient(180deg,rgba(216,191,118,0.22),rgba(151,126,58,0.16))",
  color: "#fff4c9",
  borderRadius: 12,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 9,
  minHeight: 56,
  padding: "0 24px",
  fontFamily: "'Noto Sans SC', sans-serif",
  fontSize: 17,
  fontWeight: 950,
  letterSpacing: 0,
  cursor: "pointer",
  boxShadow: "0 12px 26px rgba(0,0,0,0.22)",
}

const outlineButtonStyle: CSSProperties = {
  border: "1px solid rgba(255,255,255,0.13)",
  background: "rgba(255,255,255,0.045)",
  color: "#e6e2d8",
  borderRadius: 12,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 9,
  minHeight: 56,
  padding: "0 22px",
  fontFamily: "'Noto Sans SC', sans-serif",
  fontSize: 17,
  fontWeight: 900,
  letterSpacing: 0,
  cursor: "pointer",
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
  color: "#9c9c94",
  fontSize: 15,
  lineHeight: 1.7,
}

const resetButtonStyle: CSSProperties = {
  border: 0,
  background: "transparent",
  color: "#aaa59a",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  fontSize: 15,
  cursor: "pointer",
}

const agentHintStyle: CSSProperties = {
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(19,24,22,0.82)",
  borderRadius: 16,
  padding: "22px 24px",
  marginTop: 14,
}

const agentButtonStyle: CSSProperties = {
  ...outlineButtonStyle,
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
}
