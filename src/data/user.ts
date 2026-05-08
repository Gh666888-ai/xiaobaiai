// 用户系统 · 小白AI · Supabase

import { supabase } from "@/lib/supabase"

export interface User {
  email: string
  name: string
  xp: number
  joinedAt: string
  userId: string
}

export type LevelReward = {
  title: string
  vanity: string
}

const levelNames = [
  "初入AI门",
  "点火学员",
  "青铜提问者",
  "白银试炼者",
  "黄金提示师",
  "铂金执行官",
  "钻石任务家",
  "星耀创作者",
  "王者办公官",
  "荣耀流程师",
  "无双指挥官",
  "传说共创者",
  "星环领航员",
  "曜石架构师",
  "皇冠导师",
  "小白AI合伙人",
  "AI宇宙领主",
  "超神任务王",
  "天启Agent主",
  "小白AI共创神",
]

function minXPForLevel(level: number) {
  if (level <= 0) return 0
  if (level <= 10) return level * 60
  if (level <= 15) return 600 + (level - 10) * 120
  if (level <= 19) return 1200 + (level - 15) * 220
  return 2080 + (level - 19) * 400
}

function badgeForLevel(level: number) {
  if (level >= 19) return "xiaobai-diamond"
  if (level >= 17) return "diamond"
  if (level >= 15) return "crown"
  if (level >= 12) return "gem"
  if (level >= 8) return "core"
  if (level >= 4) return "wing"
  if (level >= 1) return "spark"
  return "seed"
}

function colorForLevel(level: number) {
  if (level >= 19) return { color: "#7ee7ff", accent: "#ffffff" }
  if (level >= 17) return { color: "#b692ff", accent: "#f4e8ff" }
  if (level >= 15) return { color: "#ffd86b", accent: "#fff6c7" }
  if (level >= 12) return { color: "#26d7c6", accent: "#d8fff7" }
  if (level >= 8) return { color: "#c9a84c", accent: "#fff0a8" }
  if (level >= 4) return { color: "#9fb2c8", accent: "#f0f7ff" }
  if (level >= 1) return { color: "#d08a42", accent: "#ffd19a" }
  return { color: "#8f8f8f", accent: "#cfcfcf" }
}

function descForLevel(level: number) {
  if (level === 0) return "刚开始探索 AI，先完成第一个小步骤。"
  if (level <= 3) return "正在建立 AI 使用手感，重点是敢问、敢试、敢改。"
  if (level <= 7) return "已经能跟着小白完成基础任务，开始拿到真实产出。"
  if (level <= 11) return "能把 AI 用进办公、内容和资料整理。"
  if (level <= 14) return "开始沉淀提示词、复盘和可复用流程。"
  if (level <= 17) return "能搭建知识库、自动化和多步任务。"
  if (level <= 18) return "能指挥 Agent 完成项目级交付。"
  return "小白AI核心共创身份，代表一起建设 AI 时代入口。"
}

function rewardForLevel(level: number): LevelReward {
  if (level >= 19) return { title: "共创神名牌", vanity: "专属共创神名牌、终极头像框、社区置顶身份、内测优先席位" }
  if (level >= 18) return { title: "天启Agent主装饰", vanity: "动态主页光效、Agent 指挥官名牌、评论区高亮边框" }
  if (level >= 17) return { title: "超神任务王边框", vanity: "钻石动态边框、任务王称号、复盘卡片高级装饰" }
  if (level >= 15) return { title: "皇冠导师身份", vanity: "皇冠名牌、导师标识、社区评论金色描边" }
  if (level >= 12) return { title: "曜石个性装饰", vanity: "曜石头像框、主页身份条、任务复盘卡片装饰" }
  if (level >= 8) return { title: "金色发光名牌", vanity: "金色等级名牌、评论区等级展示、个人主页进度条发光" }
  if (level >= 4) return { title: "银翼头像框", vanity: "银色头像框、基础身份牌、社区昵称旁等级标识" }
  if (level >= 1) return { title: "新手点火牌", vanity: "点火徽章、任务完成动效、成长页基础展示" }
  return { title: "基础身份", vanity: "完成第一个任务后解锁名牌和头像框" }
}

// 更密的等级梯子：前期每完成一个完整任务基本都能升级或接近升级。
export const LEVELS = Array.from({ length: 20 }, (_, level) => {
  const palette = colorForLevel(level)
  const reward = rewardForLevel(level)
  return {
    level,
    name: levelNames[level] || `成长等级 ${level}`,
    minXP: minXPForLevel(level),
    badge: badgeForLevel(level),
    color: palette.color,
    accent: palette.accent,
    desc: descForLevel(level),
    reward,
  }
})

export function getUserLevel(xp: number) {
  for (let i = LEVELS.length - 1; i >= 0; i--) if (xp >= LEVELS[i].minXP) return LEVELS[i]
  return LEVELS[0]
}

export function getNextLevel(xp: number) {
  const next = LEVELS.find((level) => level.minXP > xp)
  return next ? { level: next, need: next.minXP - xp } : null
}

// 注册
export async function signUp(email: string, password: string, name: string): Promise<User | null> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
    if (error) throw error

    const userId = data.user?.id
    if (!userId) return null

    await supabase.from("profiles").upsert({
      id: userId,
      name,
      email,
      xp: 0,
      joined_at: new Date().toISOString().slice(0, 10),
    }, { onConflict: "id" })

    return { userId, email, name, xp: 0, joinedAt: new Date().toISOString().slice(0, 10) }
  } catch (error: any) {
    throw new Error(error.message || "注册失败")
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

    return {
      userId,
      email,
      name: profile?.name || "",
      xp: profile?.xp || 0,
      joinedAt: profile?.joined_at || "",
    }
  } catch (error: any) {
    throw new Error(error.message || "登录失败")
  }
}

// 获取当前用户
export async function getCurrentUser(): Promise<User | null> {
  const { data } = await supabase.auth.getSession()
  if (!data.session) return null
  const { data: profile } = await supabase.from("profiles").select("*")
    .eq("id", data.session.user.id).single()
  return {
    userId: data.session.user.id,
    email: data.session.user.email || "",
    name: profile?.name || data.session.user.user_metadata?.name || data.session.user.email?.split("@")[0] || "",
    xp: profile?.xp || 0,
    joinedAt: profile?.joined_at || "",
  }
}

export async function logout() {
  await supabase.auth.signOut()
}

export async function addXP(amount: number) {
  const { data } = await supabase.auth.getSession()
  if (!data.session) return
  const { data: profile } = await supabase.from("profiles").select("xp").eq("id", data.session.user.id).single()
  if (!profile) return
  const newXP = profile.xp + amount
  await supabase.from("profiles").update({ xp: newXP }).eq("id", data.session.user.id)
  const oldLevel = getUserLevel(profile.xp)
  const newLevel = getUserLevel(newXP)
  if (newLevel.level > oldLevel.level) alert(`升级：LV.${oldLevel.level} -> LV.${newLevel.level} ${newLevel.name}`)
}

export const XP_RULES = {
  read_article: 5,
  submit_content: 10,
  submission_approved: 50,
  daily_login: 3,
}
