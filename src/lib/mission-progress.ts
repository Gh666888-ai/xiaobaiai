import { missions } from "@/data/missions"

export const MISSION_PROGRESS_KEY = "xiaobaiai:mission-progress:v1"

export type StoredMissionProgress = {
  currentStep: number
  completedSteps: boolean[]
  completed: boolean
  updatedAt: string
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
export function markMissionStepDone(state: MissionProgressState, missionId: string, stepIndex: number, totalSteps: number): MissionProgressState {
  const current = getStoredMission(state, missionId)
  const completedSteps = [...current.completedSteps]
  completedSteps[stepIndex] = true
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
        currentStep: completed ? Math.max(0, totalSteps - 1) : currentStep,
        completed,
        updatedAt: new Date().toISOString(),
      },
    },
  }
}
