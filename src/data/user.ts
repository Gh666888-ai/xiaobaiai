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
  "初入山门",
  "点火小白",
  "青铜开悟者",
  "白银破局者",
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
  "小白AI共创伙伴",
  "AI项目实践者",
  "高级任务导师",
  "Agent实践导师",
  "小白AI共创导师",
]

function minXPForLevel(level: number) {
  if (level <= 0) return 0
  const early = [0, 60, 140, 260, 420, 620, 880, 1180]
  if (level < early.length) return early[level]
  if (level <= 12) return 1180 + (level - 7) * 260
  if (level <= 16) return 2480 + (level - 12) * 420
  if (level <= 19) return 4160 + (level - 16) * 680
  return 6200 + (level - 19) * 900
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
  if (level === 0) return "还在山门外，完成第一个小步骤就能点火。"
  if (level <= 3) return "新手觉醒期，先拿到第一个真实成果和第一件装饰。"
  if (level <= 7) return "开始连续通关，任务越多，名牌越亮。"
  if (level <= 11) return "已经能把 AI 用进办公、内容和资料整理，开始有可见身份。"
  if (level <= 14) return "复盘和流程开始沉淀，别人能看见你的方法。"
  if (level <= 17) return "能搭建知识库、自动化和多步任务，进入高阶玩家区。"
  if (level <= 18) return "能指挥 Agent 完成项目级交付，身份开始压场。"
  return "小白AI核心共创身份，代表长期完成任务、复盘和共建内容的高阶用户。"
}

function rewardForLevel(level: number): LevelReward {
  if (level >= 19) return {
    title: "小白AI共创导师身份",
    vanity: "专属共创导师名牌、共创头像框、优先参与内测和内容共建；具体权益以后续正式公告为准",
  }
  if (level >= 18) return { title: "Agent实践导师身份", vanity: "高阶身份名牌、Agent 实战标识、评论区高亮边框" }
  if (level >= 17) return { title: "高级任务导师边框", vanity: "高级头像框、任务导师称号、复盘卡片装饰" }
  if (level >= 15) return { title: "皇冠导师身份", vanity: "皇冠名牌、导师标识、社区评论金色描边" }
  if (level >= 12) return { title: "曜石个性装饰", vanity: "曜石头像框、主页身份条、任务复盘卡片装饰" }
  if (level >= 8) return { title: "金色发光名牌", vanity: "金色等级名牌、评论区等级展示、个人主页进度条发光" }
  if (level >= 7) return { title: "下一章：星耀名牌体验", vanity: "星耀名牌 7 天体验、评论区高亮试用、主页身份条预览" }
  if (level >= 6) return { title: "钻石边框体验", vanity: "钻石头像框 5 天体验、任务完成动效增强、昵称旁等级闪光" }
  if (level >= 5) return { title: "铂金执行官名牌", vanity: "铂金名牌 5 天体验、社区昵称旁身份牌、复盘卡片装饰试用" }
  if (level >= 4) return { title: "双体验加成", vanity: "钻石头像框体验延长 2 天，再加评论区高亮 2 天体验" }
  if (level >= 3) return { title: "钻石头像框体验", vanity: "发放钻石头像框 2 天体验，先让你在社区里亮起来" }
  if (level >= 2) return { title: "青铜开悟标识", vanity: "青铜身份牌 3 天体验，下一关解锁钻石头像框体验" }
  if (level >= 1) return { title: "新手点火牌", vanity: "点火徽章、任务完成动效、成长页基础展示；再做一件事就能冲 LV3" }
  return { title: "新手起步目标", vanity: "完成第一个任务后点亮成长记录，第一天目标是冲到 LV3 拿钻石头像框体验" }
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
