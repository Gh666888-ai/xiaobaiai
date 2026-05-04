// 用户系统 · 小白AI · Supabase

import { supabase } from "@/lib/supabase"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export interface User {
  phone: string
  name: string
  xp: number
  joinedAt: string
  userId: string
}

// ====== 等级系统 ======
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

// ====== Supabase Auth ======

// 发送验证码（演示阶段：Supabase 不支持中国手机，用邮箱替代，或继续弹窗模拟）
export async function sendSMSCode(phone: string): Promise<string> {
  // 真实短信接入需要阿里云/腾讯云短信服务
  // 现阶段用演示模式
  const code = String(Math.floor(100000 + Math.random() * 900000))
  alert(`📱 演示模式\n验证码：${code}\n\n上线后替换为阿里云短信`) // 临时
  return code
}

// 注册或登录
export async function loginWithPhone(phone: string, name: string): Promise<User | null> {
  // 用 phone 作为邮箱的一部分做 Supabase 认证（Supabase 免费版不支持国际短信）
  const email = `user_${phone}@xiaobaiai.local`
  const password = `xiaobai_${phone}`

  try {
    // 先尝试登录
    const { data: loginData, error } = await supabase.auth.signInWithPassword({ email, password })
    let userId = loginData.user?.id

    // 不存在就注册
    if (error || !userId) {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password })
      if (signUpError) throw signUpError
      userId = signUpData.user?.id
    }

    if (!userId) return null

    // 检查 profiles 表是否有记录
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", userId).single()

    if (!profile) {
      // 新建 profile
      await supabase.from("profiles").insert({
        id: userId,
        phone,
        name,
        xp: 0,
        joined_at: new Date().toISOString().slice(0, 10),
      })
    }

    return { userId, phone, name, xp: profile?.xp || 0, joinedAt: profile?.joined_at || "" }
  } catch (err) {
    console.error("登录失败", err)
    return null
  }
}

// 获取当前用户
export async function getCurrentUser(): Promise<User | null> {
  const { data } = await supabase.auth.getSession()
  if (!data.session) return null
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.session.user.id).single()
  if (!profile) return null
  return { userId: profile.id, phone: profile.phone, name: profile.name, xp: profile.xp, joinedAt: profile.joined_at }
}

// 退出
export async function logout() {
  await supabase.auth.signOut()
}

// 加经验
export async function addXP(amount: number) {
  const { data } = await supabase.auth.getSession()
  if (!data.session) return
  const { data: profile } = await supabase.from("profiles").select("xp").eq("id", data.session.user.id).single()
  if (!profile) return
  const newXP = profile.xp + amount
  await supabase.from("profiles").update({ xp: newXP }).eq("id", data.session.user.id)
  const oldLevel = getUserLevel(profile.xp)
  const newLevel = getUserLevel(newXP)
  if (newLevel.level > oldLevel.level) {
    alert(`🎉 升级了！${oldLevel.badge} → ${newLevel.badge}\n你现在是「${newLevel.name}」`)
  }
}

export const XP_RULES = {
  read_article: 5,
  submit_content: 10,
  submission_approved: 50,
  daily_login: 3,
}
