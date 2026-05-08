import { missions } from "@/data/missions"
import type { Mission, MissionStep } from "@/data/missions"

export const MISSION_PROGRESS_KEY = "xiaobaiai:mission-progress:v1"

export type StoredMissionProgress = {
  currentStep: number
  completedSteps: boolean[]
  stepProofs?: Record<number, MissionStepProof>
  completed: boolean
  updatedAt: string
}

export type MissionStepProof = {
  method: "self-check" | "artifact" | "recap"
  text: string
  checked: boolean[]
  screenshotName?: string
  screenshotDataUrl?: string
  updatedAt: string
}

export type MissionStepProofRequirement = {
  method: "self-check" | "artifact" | "recap"
  label: string
  placeholder?: string
  minLength: number
  requiredChecks: number
  proofItems: string[]
  screenshotRequired: boolean
  screenshotHint?: string
}

export type MissionProgressState = {
  activeMissionId: string
  missions: Record<string, StoredMissionProgress>
}

export function emptyMissionProgress(): MissionProgressState {
  return { activeMissionId: missions[0]?.id || "", missions: {} }
}

export function readMissionProgress(): MissionProgressState {
  if (typeof window === "undefined") return emptyMissionProgress()
  try {
    const raw = window.localStorage.getItem(MISSION_PROGRESS_KEY)
    if (!raw) return emptyMissionProgress()
    const parsed = JSON.parse(raw)
    return {
      activeMissionId: typeof parsed.activeMissionId === "string" ? parsed.activeMissionId : missions[0]?.id || "",
      missions: parsed.missions && typeof parsed.missions === "object" ? parsed.missions : {},
    }
  } catch {
    return emptyMissionProgress()
  }
}

export function writeMissionProgress(state: MissionProgressState) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(MISSION_PROGRESS_KEY, JSON.stringify(state))
}

export function defaultStoredMissionProgress(): StoredMissionProgress {
  return { currentStep: 0, completedSteps: [], completed: false, updatedAt: new Date().toISOString() }
}

export function getStoredMission(state: MissionProgressState, missionId: string): StoredMissionProgress {
  return state.missions[missionId] || defaultStoredMissionProgress()
}

export function currentStepLabel(missionId: string, stepIndex: number) {
  const mission = missions.find((item) => item.id === missionId)
  const step = mission?.steps[stepIndex]
  return step ? `第 ${stepIndex + 1} 步：${step.title}` : "准备开始第 1 步"
}

export function selectMission(state: MissionProgressState, missionId: string): MissionProgressState {
  const current = getStoredMission(state, missionId)
  return {
    activeMissionId: missionId,
    missions: {
      ...state.missions,
      [missionId]: { ...current, updatedAt: new Date().toISOString() },
    },
  }
}

export function getMissionStepProofRequirement(
  step: MissionStep,
  stepIndex: number,
  totalSteps: number,
): MissionStepProofRequirement {
  const fallback = {
    method: "self-check" as const,
    label: "这是小白引导型学习任务，只需要确认当前步骤已经完成。",
    placeholder: "",
    minLength: 0,
    requiredChecks: 0,
    screenshotRequired: false,
    screenshotHint: "",
  }

  const proof = step.proof || fallback
  const method = proof.method
  const proofItems = (step.validation && step.validation.length > 0 ? step.validation : step.checklist || []).slice(0, 3)
  const requiredChecks = proofItems.length > 0 ? Math.min(proof.requiredChecks ?? fallback.requiredChecks, proofItems.length) : 0
  const minLength = proof.minLength ?? (method === "self-check" ? 0 : method === "artifact" ? 10 : 20)
  const screenshotRequired = "screenshotRequired" in proof ? Boolean((proof as any).screenshotRequired) : fallback.screenshotRequired

  return {
    method,
    label: proof.label,
    placeholder: proof.placeholder,
    minLength,
    requiredChecks,
    proofItems,
    screenshotRequired,
    screenshotHint: (proof as any).screenshotHint || fallback.screenshotHint,
  }
}

export function isMissionStepProofReady(requirement: MissionStepProofRequirement, proof?: MissionStepProof) {
  if (!proof) return false
  const checkedCount = Array.isArray(proof.checked) ? proof.checked.filter(Boolean).length : 0
  const textLength = typeof proof.text === "string" ? proof.text.trim().length : 0
  const hasScreenshot = typeof proof.screenshotDataUrl === "string" && proof.screenshotDataUrl.startsWith("data:image/")
  return checkedCount >= requirement.requiredChecks && textLength >= requirement.minLength && (!requirement.screenshotRequired || hasScreenshot)
}

export function isMissionCompletionProofReady(mission: Mission, progress: StoredMissionProgress) {
  return mission.steps.every((step, index) =>
    isMissionStepProofReady(
      getMissionStepProofRequirement(step, index, mission.steps.length),
      progress.stepProofs?.[index],
    ),
  )
}

export function markMissionStepDone(
  state: MissionProgressState,
  missionId: string,
  stepIndex: number,
  totalSteps: number,
  proof?: MissionStepProof,
): MissionProgressState {
  const current = getStoredMission(state, missionId)
  const completedSteps = [...current.completedSteps]
  completedSteps[stepIndex] = true
  const stepProofs = proof
    ? { ...(current.stepProofs || {}), [stepIndex]: proof }
    : current.stepProofs
  const nextStep = Math.min(totalSteps - 1, completedSteps.findIndex((done, index) => index > stepIndex && !done))
  const fallbackStep = Math.min(stepIndex + 1, Math.max(0, totalSteps - 1))
  const currentStep = nextStep >= 0 ? nextStep : fallbackStep
  const completed = totalSteps > 0 && Array.from({ length: totalSteps }).every((_, index) => completedSteps[index])
  return {
    activeMissionId: missionId,
    missions: {
      ...state.missions,
      [missionId]: {
        completedSteps,
        stepProofs,
        currentStep: completed ? Math.max(0, totalSteps - 1) : currentStep,
        completed,
        updatedAt: new Date().toISOString(),
      },
    },
  }
}
