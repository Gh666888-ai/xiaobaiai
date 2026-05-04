// 贡献者等级系统 · 小白AI

export interface Contributor {
  name: string
  approvedCount: number
  joinedAt: string
}

const STORAGE_KEY = "xiaobaiai_contributors"

// ====== 等级定义 ======
export const LEVELS = [
  { level: 0, name: "游客",      min: 0,   badge: "",     color: "#999",   desc: "还没通过任何投稿" },
  { level: 1, name: "新星",      min: 1,   badge: "⭐",   color: "#CD7F32", desc: "铜色小星星 · 通过1-2个投稿" },
  { level: 2, name: "银星",      min: 3,   badge: "🌟",   color: "#C0C0C0", desc: "银色大星星 · 通过3-5个投稿" },
  { level: 3, name: "金星",      min: 6,   badge: "✨",   color: "#FFD700", desc: "金色小星星 · 通过6-10个投稿" },
  { level: 4, name: "太阳",      min: 11,  badge: "☀️",   color: "#CD7F32", desc: "铜色太阳 · 通过11-20个投稿" },
  { level: 5, name: "皇冠",      min: 21,  badge: "👑",   color: "#CD7F32", desc: "铜色皇冠 · 通过21-50个投稿" },
  { level: 6, name: "至尊皇冠",  min: 51,  badge: "🌈👑", color: "#FFD700", desc: "五彩金色皇冠 · 通过51+投稿" },
]

export function getLevel(count: number) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (count >= LEVELS[i].min) return LEVELS[i]
  }
  return LEVELS[0]
}

// ====== 本地存储 ======
export function loadContributors(): Contributor[] {
  if (typeof window === "undefined") return []
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try { return JSON.parse(raw) } catch { return [] }
}

function saveContributors(list: Contributor[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

// 审核通过时增加计数
export function addApprovedContribution(name: string) {
  const list = loadContributors()
  const found = list.find(c => c.name === name)
  if (found) {
    found.approvedCount++
  } else {
    list.push({ name, approvedCount: 1, joinedAt: new Date().toISOString().slice(0, 10) })
  }
  saveContributors(list)
  return found || list[list.length - 1]
}

// 获取贡献者信息
export function getContributor(name: string): Contributor | undefined {
  return loadContributors().find(c => c.name === name)
}
