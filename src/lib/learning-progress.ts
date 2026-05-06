export const LEARNING_PROGRESS_KEY = "xiaobaiai:learning-progress:v1"

export type LearningProgress = Record<string, boolean>

export function progressId(stageId: number, sectionIndex: number) {
  return `${stageId}:${sectionIndex}`
}

export function readLearningProgress(): LearningProgress {
  if (typeof window === "undefined") return {}
  try {
    const raw = window.localStorage.getItem(LEARNING_PROGRESS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function writeLearningProgress(progress: LearningProgress) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(LEARNING_PROGRESS_KEY, JSON.stringify(progress))
}
