// 用户投稿审核系统 · 小白AI

export interface ToolSubmission {
  id: string
  type: "tool"
  name: string
  url: string
  description: string
  category: string
  submittedAt: string

  // 审核状态
  status: "pending" | "auto_rejected" | "approved" | "rejected_by_admin"
  autoRejectReason?: string   // 初审自动拒绝原因
  adminNote?: string           // 管理员备注

  // AI 打分 (我来打)
  score?: {
    relevance: number    // 相关性 1-10（跟AI有关吗）
    quality: number      // 质量 1-10（描述清楚吗）
    usefulness: number   // 实用度 1-10（对小白有用吗）
    comment: string      // 打分评语
  }
}

export interface NewsSubmission {
  id: string
  type: "news"
  title: string
  url: string
  summary: string
  category: string
  submittedAt: string

  status: "pending" | "auto_rejected" | "approved" | "rejected_by_admin"
  autoRejectReason?: string
  adminNote?: string

  score?: {
    relevance: number
    quality: number
    usefulness: number
    comment: string
  }
}

export type Submission = ToolSubmission | NewsSubmission

// ====== 初审自动过滤规则 ======
const forbiddenWords = ["垃圾", "傻逼", "骗子", "诈骗", "赌博", "色情", "翻墙", "VPN推荐"]
const aiKeywords = ["AI", "人工智能", "机器学习", "深度学习", "大模型", "LLM", "GPT", "Claude",
  "Agent", "智能体", "Prompt", "提示词", "ChatGPT", "DeepSeek", "Kimi", "通义", "豆包",
  "Midjourney", "Stable Diffusion", "DALL", "Sora", "Dify", "Coze", "OpenClaw",
  "Copilot", "Cursor", "模型", "生成", "训练", "算法", "神经网络", "NLP", "CV"]

// 初审：自动检查
export function autoReview(submission: Submission): Submission {
  const reasons: string[] = []

  // 检查1：有没有违规词
  if (submission.type === "tool") {
    const text = (submission.name + submission.description).toLowerCase()
    for (const word of forbiddenWords) {
      if (text.includes(word)) {
        reasons.push(`包含违规词：「${word}」`)
        break
      }
    }
  }
  if (submission.type === "news") {
    const text = (submission.title + submission.summary).toLowerCase()
    for (const word of forbiddenWords) {
      if (text.includes(word)) {
        reasons.push(`包含违规词：「${word}」`)
        break
      }
    }
  }

  // 检查2：跟AI有关吗
  let isAiRelated = false
  if (submission.type === "tool") {
    const text = (submission.name + submission.description + submission.category).toLowerCase()
    isAiRelated = aiKeywords.some(kw => text.includes(kw.toLowerCase()))
  }
  if (submission.type === "news") {
    const text = (submission.title + submission.summary + submission.category).toLowerCase()
    isAiRelated = aiKeywords.some(kw => text.includes(kw.toLowerCase()))
  }
  if (!isAiRelated) {
    reasons.push("内容与 AI 无关，请提交 AI 相关的工具或资讯")
  }

  if (reasons.length > 0) {
    return { ...submission, status: "auto_rejected", autoRejectReason: reasons.join("；") }
  }

  return { ...submission, status: "pending" }
}

// ====== 本地存储（MVP 用 localStorage） ======
const STORAGE_KEY = "xiaobaiai_submissions"

export function loadSubmissions(): Submission[] {
  if (typeof window === "undefined") return []
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try { return JSON.parse(raw) } catch { return [] }
}

export function saveSubmissions(subs: Submission[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(subs))
}

export function addSubmission(sub: Submission) {
  const subs = loadSubmissions()
  const reviewed = autoReview(sub)
  subs.push(reviewed)
  saveSubmissions(subs)
  return reviewed
}

export function updateSubmission(id: string, updates: Partial<Submission>) {
  const subs = loadSubmissions()
  const idx = subs.findIndex(s => s.id === id)
  if (idx >= 0) {
    subs[idx] = { ...subs[idx], ...updates }
    saveSubmissions(subs)
  }
  return subs[idx]
}
