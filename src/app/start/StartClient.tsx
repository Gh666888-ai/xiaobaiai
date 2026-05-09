"use client"

import { useEffect, useMemo, useState } from "react"
import type { CSSProperties } from "react"
import Link from "next/link"
import { ArrowRight, CheckCircle2, Clipboard, ListChecks, RotateCcw } from "lucide-react"
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
const goalOptions = [
  {
    label: "在家创业接单",
    desc: "不先谈赚钱，先做一个能展示的作品。",
    prompt: "我想在家创业接单，不想出门。请先问我会什么、每天有多少时间、愿不愿意露脸、有没有预算，然后给我一个最容易开始的任务入口。",
  },
  {
    label: "提高工作效率",
    desc: "把日报、PPT、表格、资料整理交给 AI。",
    prompt: "我想用 AI 提高现在工作的效率。请先问我的岗位和最重复的工作，然后给我一个任务入口。",
  },
  {
    label: "做内容账号",
    desc: "图文、短视频、AI漫剧先做一个样片。",
    prompt: "我想用 AI 做内容账号。请先问我想做图文、短视频还是 AI 漫剧，然后给我一个任务入口。",
  },
  {
    label: "训练个人Agent",
    desc: "安装工具后设人设、记忆和验收标准。",
    prompt: "我想训练一个个人 Agent 帮我做固定工作。请先问我的行业、工具基础和想交给 Agent 的工作，然后给我一个任务入口。",
  },
]

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

  function openGoalOption(prompt: string) {
    window.dispatchEvent(new CustomEvent("xiaobai:open-goal-router", { detail: { prompt } }))
  }

  return (
    <div style={{ background: "linear-gradient(180deg,#07100f 0%,#0b0d0c 46%,#070707 100%)", minHeight: "100vh", fontFamily: "'Noto Sans SC', sans-serif", position: "relative" }}>
      <NavBar />
      <main style={mainStyle}>
        <section style={goalPanelStyle}>
          <p style={eyebrowStyle}>先选方向</p>
          <h1 style={goalTitleStyle}>你想用 AI 做什么？</h1>
          <p style={goalDescStyle}>在家创业只是其中一个方向。你先点一个，小白会在右下角继续问你情况，再给任务入口。</p>
          <div style={goalGridStyle}>
            {goalOptions.map((option) => (
              <button key={option.label} type="button" onClick={() => openGoalOption(option.prompt)} style={goalOptionStyle}>
                <span style={goalOptionTitleStyle}>{option.label}</span>
                <span style={goalOptionDescStyle}>{option.desc}</span>
              </button>
            ))}
          </div>
        </section>

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
            <p style={taskTextStyle}>{completed ? "这个任务已经完成。你可以从下面的任务模板列表里，自己选下一条继续做。" : currentStep.action}</p>
          </div>

          {!completed && (
            <p style={deliverableStyle}>做到这一步，你应该有：{currentStep.deliverable}</p>
          )}

          <div style={actionRowStyle}>
            {completed ? (
              <MissionTemplateDropdown currentMissionId={selected.id} />
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
          <p style={{ color: "#f7f1df", fontSize: 21, fontWeight: 950, marginBottom: 8 }}>想换一个方向？</p>
          <p style={{ color: "#c8c8bd", fontSize: 16, lineHeight: 1.8, marginBottom: 16 }}>
            不用让小白自动跳转。先从任务模板列表里选一个方向，进入后它会记住你做到哪一步。
          </p>
          <MissionTemplateDropdown currentMissionId={selected.id} compact />
        </section>
      </main>
    </div>
  )
}

function MissionTemplateDropdown({ currentMissionId, compact = false }: { currentMissionId: string; compact?: boolean }) {
  const visibleMissions = missions.slice(0, compact ? 8 : 10)

  return (
    <details style={templateDropdownStyle}>
      <summary style={compact ? templateSummaryCompactStyle : templateSummaryStyle}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
          <ListChecks size={compact ? 15 : 17} />
          选择任务模板
        </span>
        <ArrowRight size={compact ? 13 : 15} />
      </summary>
      <div style={templateMenuStyle}>
        {visibleMissions.map((mission) => {
          const isCurrent = mission.id === currentMissionId
          return (
            <Link
              key={mission.id}
              href={`/missions/${mission.id}`}
              style={{
                ...templateItemStyle,
                borderColor: isCurrent ? "rgba(216,191,118,0.38)" : "rgba(255,255,255,0.09)",
                background: isCurrent ? "rgba(216,191,118,0.1)" : "rgba(255,255,255,0.035)",
              }}
            >
              <span style={{ color: "#f7f1df", fontSize: 15, fontWeight: 950, lineHeight: 1.45 }}>{mission.shortTitle}</span>
              <span style={{ color: "#aaa49a", fontSize: 13, lineHeight: 1.55 }}>{mission.difficulty} · {mission.minutes}</span>
            </Link>
          )
        })}
        <Link href="/missions" style={templateAllLinkStyle}>
          查看全部任务模板 <ArrowRight size={13} />
        </Link>
      </div>
    </details>
  )
}

const mainStyle: CSSProperties = {
  maxWidth: 860,
  margin: "0 auto",
  minHeight: "calc(100vh - 76px)",
  padding: "38px clamp(16px,5vw,42px) 76px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
}

const goalPanelStyle: CSSProperties = {
  border: "1px solid rgba(233,215,165,0.13)",
  background: "rgba(244,240,226,0.04)",
  borderRadius: 18,
  padding: "24px clamp(20px,4vw,32px)",
  marginBottom: 18,
}

const goalTitleStyle: CSSProperties = {
  color: "#f8f3e6",
  fontSize: "clamp(28px,5vw,42px)",
  fontWeight: 950,
  lineHeight: 1.2,
  margin: 0,
}

const goalDescStyle: CSSProperties = {
  color: "#c8c8bd",
  fontSize: 16,
  lineHeight: 1.8,
  margin: "10px 0 18px",
}

const goalGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,180px),1fr))",
  gap: 10,
}

const goalOptionStyle: CSSProperties = {
  minHeight: 104,
  border: "1px solid rgba(216,191,118,0.18)",
  background: "rgba(0,0,0,0.22)",
  borderRadius: 13,
  padding: "16px 17px",
  textAlign: "left",
  fontFamily: "'Noto Sans SC', sans-serif",
  cursor: "pointer",
}

const goalOptionTitleStyle: CSSProperties = {
  display: "block",
  color: "#fff4c9",
  fontSize: 18,
  fontWeight: 950,
  lineHeight: 1.35,
  marginBottom: 8,
}

const goalOptionDescStyle: CSSProperties = {
  display: "block",
  color: "#aaa59a",
  fontSize: 13,
  fontWeight: 800,
  lineHeight: 1.65,
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

const templateDropdownStyle: CSSProperties = {
  position: "relative",
  minWidth: 250,
}

const templateSummaryStyle: CSSProperties = {
  ...buttonStyle,
  listStyle: "none",
  userSelect: "none",
  justifyContent: "space-between",
}

const templateSummaryCompactStyle: CSSProperties = {
  ...outlineButtonStyle,
  listStyle: "none",
  userSelect: "none",
  justifyContent: "space-between",
  minWidth: 230,
}

const templateMenuStyle: CSSProperties = {
  position: "absolute",
  left: 0,
  top: "calc(100% + 10px)",
  zIndex: 20,
  width: "min(420px, calc(100vw - 36px))",
  maxHeight: 430,
  overflowY: "auto",
  border: "1px solid rgba(233,215,165,0.16)",
  background: "rgba(12,15,14,0.98)",
  borderRadius: 14,
  padding: 10,
  boxShadow: "0 24px 70px rgba(0,0,0,0.46)",
}

const templateItemStyle: CSSProperties = {
  display: "grid",
  gap: 4,
  border: "1px solid rgba(255,255,255,0.09)",
  borderRadius: 10,
  padding: "13px 14px",
  textDecoration: "none",
  marginBottom: 8,
}

const templateAllLinkStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 7,
  color: "#d8bf76",
  fontSize: 14,
  fontWeight: 950,
  textDecoration: "none",
  padding: "8px 4px 2px",
}
