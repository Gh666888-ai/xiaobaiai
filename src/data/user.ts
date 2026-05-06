// 用户系统 · 小白AI · Supabase

import { supabase } from "@/lib/supabase"

export interface User {
  email: string
  name: string
  xp: number
  joinedAt: string
  userId: string
}

// 等级系统
export const LEVELS = [
  { level: 0, name: "初识者",    minXP: 0,     badge: "◇", color: "#8f8f8f", accent: "#cfcfcf", desc: "刚开始探索 AI 世界" },
  { level: 1, name: "星火学员",  minXP: 100,   badge: "✦", color: "#9f6b3b", accent: "#d6a36a", desc: "完成第一批 AI 小任务" },
  { level: 2, name: "银翼探索者", minXP: 300,   badge: "✧", color: "#9fb2c8", accent: "#e4edf8", desc: "能独立选择工具和学习路径" },
  { level: 3, name: "金核创造者", minXP: 1000,  badge: "✹", color: "#c9a84c", accent: "#fff0a8", desc: "能把 AI 用进真实工作流" },
  { level: 4, name: "曜石指挥官", minXP: 3000,  badge: "◆", color: "#7ad7c6", accent: "#d8fff7", desc: "开始指挥 Agent 完成多步任务" },
  { level: 5, name: "星环架构师", minXP: 10000, badge: "◈", color: "#b692ff", accent: "#efe4ff", desc: "能搭建稳定的 AI 系统和流程" },
  { level: 6, name: "小白AI共创者", minXP: 30000, badge: "✺", color: "#ffd86b", accent: "#ffffff", desc: "小白AI核心共创身份" },
]

export function getUserLevel(xp: number) {
  for (let i = LEVELS.length - 1; i >= 0; i--) if (xp >= LEVELS[i].minXP) return LEVELS[i]
  return LEVELS[0]
}

export function getNextLevel(xp: number) {
  const next = LEVELS.find(l => l.minXP > xp)
  return next ? { level: next, need: next.minXP - xp } : null
}

// 注册
export async function signUp(email: string, password: string, name: string): Promise<User | null> {
  try {
    const { data, error } = await supabase.auth.signUp({ email, password,
      options: { data: { name } }
    })
    if (error) throw error

    const userId = data.user?.id
    if (!userId) return null

    // 创建 profile
    await supabase.from("profiles").upsert({
      id: userId, name, email, xp: 0, joined_at: new Date().toISOString().slice(0, 10)
    }, { onConflict: "id" })

    return { userId, email, name, xp: 0, joinedAt: new Date().toISOString().slice(0, 10) }
  } catch (e: any) {
    throw new Error(e.message || "注册失败")
  }
}

// 登录
export async function signIn(email: string, password: string): Promise<User | null> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error

    const userId = data.user?.id
    if (!userId) return null

    const { data: profile } = await supabase.from("profiles").select("*").eq("id", userId).single()

    return { userId, email, name: profile?.name || "", xp: profile?.xp || 0,
      joinedAt: profile?.joined_at || "" }
  } catch (e: any) {
    throw new Error(e.message || "登录失败")
  }
}

// 获取当前用户
export async function getCurrentUser(): Promise<User | null> {
  const { data } = await supabase.auth.getSession()
  if (!data.session) return null
  const { data: profile } = await supabase.from("profiles").select("*")
    .eq("id", data.session.user.id).single()
  // profile 不存在时用 session 数据兜底
  return {
    userId: data.session.user.id,
    email: data.session.user.email || "",
    name: profile?.name || data.session.user.user_metadata?.name || data.session.user.email?.split("@")[0] || "",
    xp: profile?.xp || 0,
    joinedAt: profile?.joined_at || ""
  }
}

// 退出
export async function logout() { await supabase.auth.signOut() }

// 加经验
export async function addXP(amount: number) {
  const { data } = await supabase.auth.getSession()
  if (!data.session) return
  const { data: profile } = await supabase.from("profiles").select("xp").eq("id", data.session.user.id).single()
  if (!profile) return
  const newXP = profile.xp + amount
  await supabase.from("profiles").update({ xp: newXP }).eq("id", data.session.user.id)
  const oldLvl = getUserLevel(profile.xp); const newLvl = getUserLevel(newXP)
  if (newLvl.level > oldLvl.level) alert(`🎉 升级！${oldLvl.badge} → ${newLvl.badge}`)
}

export const XP_RULES = {
  read_article: 5, submit_content: 10, submission_approved: 50, daily_login: 3,
}
