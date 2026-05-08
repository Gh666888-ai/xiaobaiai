export const LEARNING_PROGRESS_KEY = "xiaobaiai:learning-progress:v1"

export type LearningProgress = Record<string, boolean>

export const LEARNING_PROOF_KEY = "xiaobaiai:learning-proof:v1"

export type LearningSectionProof = {
  text: string
  checked: boolean[]
  screenshotName?: string
  screenshotDataUrl?: string
  updatedAt: string
}

export type LearningProofs = Record<string, LearningSectionProof>

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

export function readLearningProofs(): LearningProofs {
  if (typeof window === "undefined") return {}
  try {
    const raw = window.localStorage.getItem(LEARNING_PROOF_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function writeLearningProofs(proofs: LearningProofs) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(LEARNING_PROOF_KEY, JSON.stringify(proofs))
}

export function isLearningProofReady(proof: LearningSectionProof | undefined, minLength: number, requiredChecks: number, screenshotRequired = false) {
  if (!proof) return false
  const checkedCount = Array.isArray(proof.checked) ? proof.checked.filter(Boolean).length : 0
  const hasScreenshot = typeof proof.screenshotDataUrl === "string" && proof.screenshotDataUrl.startsWith("data:image/")
  return checkedCount >= requiredChecks && proof.text.trim().length >= minLength && (!screenshotRequired || hasScreenshot)
}
