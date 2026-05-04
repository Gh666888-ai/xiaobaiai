// 用户系统 · 小白AI

const STORAGE_KEY = "xiaobaiai_user"

export interface User {
  phone: string     // 手机号（唯一标识）
  name: string      // 昵称（展示用）
  xp: number
  joinedAt: string
}

// ====== 等级系统（6级） ======
export const LEVELS = [
  { level: 0, name: "游客",      minXP: 0,     badge: "🆕",   color: "#999",    desc: "刚开始探索AI世界" },
  { level: 1, name: "铜星",      minXP: 100,   badge: "⭐",   color: "#CD7F32", desc: "铜色小星星" },
  { level: 2, name: "银星",      minXP: 300,   badge: "🌟",   color: "#C0C0C0", desc: "银色大星星" },
  { level: 3, name: "金星",      minXP: 1000,  badge: "✨",   color: "#FFD700", desc: "金色小星星" },
  { level: 4, name: "太阳",      minXP: 3000,  badge: "☀️",   color: "#CD7F32", desc: "铜色太阳" },
  { level: 5, name: "皇冠",      minXP: 10000, badge: "👑",   color: "#CD7F32", desc: "铜色皇冠" },
  { level: 6, name: "至尊皇冠",  minXP: 30000, badge: "🌈👑", color: "#FFD700", desc: "五彩金色皇冠" },
]

export function getUserLevel(xp: number) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) return LEVELS[i]
  }
  return LEVELS[0]
}

export function getNextLevel(xp: number) {
  const current = getUserLevel(xp)
  const next = LEVELS.find(l => l.minXP > xp)
  return next ? { level: next, need: next.minXP - xp } : null
}

// ====== 用户存储（localStorage MVP） ======
export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try { return JSON.parse(raw) } catch { return null }
}

export function saveUser(user: User) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

export function login(phone: string, name: string): User {
  const phoneTrimmed = phone.trim()
  const nameTrimmed = name.trim()
  if (!phoneTrimmed) throw new Error("手机号不能为空")
  if (!/^1[3-9]\d{9}$/.test(phoneTrimmed)) throw new Error("请输入正确的11位手机号")
  if (!nameTrimmed) throw new Error("昵称不能为空")
  // 按手机号查老用户
  const raw = localStorage.getItem(`xiaobaiai_user_${phoneTrimmed}`)
  let user: User
  if (raw) {
    user = JSON.parse(raw)
    user.name = nameTrimmed // 允许改名
  } else {
    user = { phone: phoneTrimmed, name: nameTrimmed, xp: 0, joinedAt: new Date().toISOString().slice(0, 10) }
  }
  saveUser(user)
  localStorage.setItem(`xiaobaiai_user_${phoneTrimmed}`, JSON.stringify(user))
  return user
}

export function logout() {
  if (typeof window === "undefined") return
  localStorage.removeItem(STORAGE_KEY)
}

// ====== 经验值 ======
export function addXP(amount: number) {
  const user = getCurrentUser()
  if (!user) return
  user.xp += amount
  const oldLevel = getUserLevel(user.xp - amount)
  const newLevel = getUserLevel(user.xp)
  saveUser(user)
  localStorage.setItem(`xiaobaiai_user_${user.phone}`, JSON.stringify(user))
  // 升级提示
  if (newLevel.level > oldLevel.level) {
    alert(`🎉 升级了！${oldLevel.badge} → ${newLevel.badge}\n你现在是「${newLevel.name}」${newLevel.desc}`)
  }
  return user
}

// ====== XP 获取规则 ======
export const XP_RULES = {
  read_article: 5,        // 浏览一篇资讯
  submit_content: 10,     // 提交工具或资讯
  submission_approved: 50, // 投稿通过审核
  daily_login: 3,         // 每日登录
}
