// 用户系统 · 小白AI · Supabase

import { supabase } from "@/lib/supabase"

export interface User {
  email: string
  name: string
  xp: number
  joinedAt: string
  userId: string
  coCreatorApproved?: boolean
  coCreatorTrack?: LevelTrack
}

export type LevelReward = {
  title: string
  vanity: string
}

export type LevelTrack = "personal" | "team"
export type LevelAccess = {
  coCreatorApproved?: boolean
  contributionPoints?: number
}

const CO_CREATOR_START_LEVEL = 15
const HIGHEST_AUTO_LEVEL = CO_CREATOR_START_LEVEL - 1
const CO_CREATOR_CONTRIBUTION_THRESHOLDS = [0, 20, 60, 160, 360]

const levelNameTracks: Record<LevelTrack, string[]> = {
  personal: [
    "AI起步者",
    "见习创业者",
    "提示词练习生",
    "任务执行者",
    "内容变现手",
    "工具组合师",
    "个人工作流玩家",
    "副业项目主理人",
    "AI接单能手",
    "自动化操盘手",
    "个人品牌经营者",
    "独立项目负责人",
    "Agent训练师",
    "项目交付官",
    "AI创业实战家",
    "小白AI共创伙伴",
    "小白AI共创顾问",
    "小白AI共创导师",
    "小白AI共创合伙人",
    "小白AI共创神",
  ],
  team: [
    "团队AI观察员",
    "流程记录员",
    "岗位提效手",
    "团队协作员",
    "资料整理官",
    "流程优化师",
    "部门效率官",
    "团队之魂",
    "跨部门连接者",
    "业务自动化官",
    "知识库负责人",
    "团队Agent训练师",
    "AI项目经理",
    "公司流程架构师",
    "企业AI推进官",
    "小白AI共创团队",
    "小白AI共创顾问团",
    "小白AI共创导师团",
    "小白AI共创合伙团队",
    "小白AI共创神队",
  ],
}

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

function descForLevel(level: number, track: LevelTrack = "personal") {
  const isTeam = track === "team"
  if (level === 0) return isTeam ? "公司还没开始系统用 AI，先从一个岗位小流程跑通。" : "刚开始学 AI，先完成一个能看见结果的小任务。"
  if (level <= 3) return isTeam ? "团队试用期，先把资料、话术、会议纪要这类高频工作交给 AI 辅助。" : "个人起步期，先学会提需求、拿结果、改出第一份可用成果。"
  if (level <= 7) return isTeam ? "已经能把 AI 放进团队协作，开始沉淀可复用流程。" : "开始连续做任务，能用 AI 帮自己完成内容、办公和接单准备。"
  if (level <= 11) return isTeam ? "团队开始有自己的知识库、流程模板和岗位助手。" : "已经能把 AI 用进个人副业、内容生产和客户交付。"
  if (level <= 14) return isTeam ? "公司流程开始被 AI 改造，能管理多岗位、多工具协作。" : "能训练 Agent、搭工作流，把重复工作逐步交出去。"
  if (level <= 18) return isTeam ? "团队进入共创预备区，能把 AI 项目落到业务结果里。" : "个人进入共创预备区，能交付真实项目并复盘方法。"
  return isTeam ? "小白AI最高共创团队身份，代表长期完成项目、复盘和共建内容。" : "小白AI最高共创身份，代表长期完成任务、复盘和共建内容的高阶用户。"
}

function rewardForLevel(level: number, track: LevelTrack = "personal"): LevelReward {
  const isTeam = track === "team"
  if (level >= 19) return {
    title: isTeam ? "小白AI共创神队身份" : "小白AI共创神身份",
    vanity: isTeam ? "最高共创团队名牌、团队案例优先展示、优先参与企业实战共建；具体权益以后续正式公告为准" : "最高共创名牌、共创头像框、优先参与内测和内容共建；具体权益以后续正式公告为准",
  }
  if (level >= 18) return { title: isTeam ? "共创合伙团队名牌" : "共创合伙人名牌", vanity: isTeam ? "团队高阶身份、团队案例高亮、成员协作标识" : "高阶身份名牌、Agent 实战标识、评论区高亮边框" }
  if (level >= 17) return { title: isTeam ? "共创导师团边框" : "共创导师边框", vanity: isTeam ? "团队头像框、导师团称号、复盘卡片装饰" : "高级头像框、任务导师称号、复盘卡片装饰" }
  if (level >= 15) return { title: isTeam ? "共创团队身份" : "共创伙伴身份", vanity: isTeam ? "团队共创名牌、企业案例标识、社区评论金色描边；后续升级看贡献值，不再看 XP" : "共创名牌、导师标识、社区评论金色描边；后续升级看贡献值，不再看 XP" }
  if (level >= 13) return { title: isTeam ? "团队实战内容体验" : "付费实战内容体验", vanity: isTeam ? "解锁一次早期团队实战内容体验，先不收费，作为高阶成长奖励" : "解锁一次早期付费实战内容体验，先不收费，让你提前看到高阶交付课怎么做" }
  if (level >= 12) return { title: isTeam ? "企业AI推进装饰" : "Agent训练装饰", vanity: isTeam ? "团队主页身份条、流程复盘卡片装饰；下一档预告早期实战内容体验" : "曜石头像框、主页身份条、任务复盘卡片装饰；下一档预告早期付费内容体验" }
  if (level >= 8) return { title: isTeam ? "团队效率名牌" : "个人项目名牌", vanity: isTeam ? "团队等级名牌、评论区等级展示、团队进度条发光" : "金色等级名牌、评论区等级展示、个人主页进度条发光" }
  if (level >= 7) return { title: isTeam ? "团队之魂体验" : "项目主理人体验", vanity: "高亮名牌 7 天体验、评论区高亮试用、主页身份条预览" }
  if (level >= 6) return { title: isTeam ? "部门效率边框体验" : "工作流边框体验", vanity: "钻石头像框 5 天体验、任务完成动效增强、昵称旁等级闪光" }
  if (level >= 5) return { title: isTeam ? "流程优化师名牌" : "工具组合师名牌", vanity: "进阶名牌 5 天体验、社区昵称旁身份牌、复盘卡片装饰试用" }
  if (level >= 4) return { title: "双体验加成", vanity: "钻石头像框体验延长 2 天，再加评论区高亮 2 天体验" }
  if (level >= 3) return { title: isTeam ? "团队协作标识" : "任务执行标识", vanity: "发放钻石头像框 2 天体验，先让你在社区里亮起来" }
  if (level >= 2) return { title: isTeam ? "岗位提效标识" : "提示词练习标识", vanity: "基础身份牌 3 天体验，下一关解锁钻石头像框体验" }
  if (level >= 1) return { title: isTeam ? "流程记录牌" : "见习创业牌", vanity: "点火徽章、任务完成动效、成长页基础展示；再做一件事就能冲 LV3" }
  return { title: isTeam ? "团队起步目标" : "个人起步目标", vanity: "完成第一个任务后点亮成长记录，第一天目标是冲到 LV3 拿钻石头像框体验" }
}

function buildLevels(track: LevelTrack) {
  return Array.from({ length: 20 }, (_, level) => {
    const palette = colorForLevel(level)
    const reward = rewardForLevel(level, track)
    return {
      level,
      track,
      name: levelNameTracks[track][level] || `成长等级 ${level}`,
      minXP: minXPForLevel(level),
      badge: badgeForLevel(level),
      color: palette.color,
      accent: palette.accent,
      desc: descForLevel(level, track),
      reward,
    }
  })
}

export const LEVEL_TRACKS = {
  personal: buildLevels("personal"),
  team: buildLevels("team"),
}

// 默认导出个人等级，兼容现有页面；企业/团队场景用 getUserLevel(xp, "team")。
export const LEVELS = LEVEL_TRACKS.personal

function visibleLevels(track: LevelTrack, access: LevelAccess = {}) {
  const levels = LEVEL_TRACKS[track] || LEVEL_TRACKS.personal
  return access.coCreatorApproved ? levels : levels.filter((level) => level.level <= HIGHEST_AUTO_LEVEL)
}

function coCreatorLevelFromContribution(contributionPoints = 0) {
  let offset = 0
  for (let index = CO_CREATOR_CONTRIBUTION_THRESHOLDS.length - 1; index >= 0; index--) {
    if (contributionPoints >= CO_CREATOR_CONTRIBUTION_THRESHOLDS[index]) {
      offset = index
      break
    }
  }
  return CO_CREATOR_START_LEVEL + offset
}

export function getUserLevel(xp: number, track: LevelTrack = "personal", access: LevelAccess = {}) {
  if (access.coCreatorApproved && xp >= minXPForLevel(CO_CREATOR_START_LEVEL)) {
    const level = coCreatorLevelFromContribution(access.contributionPoints || 0)
    return LEVEL_TRACKS[track][level] || LEVEL_TRACKS[track][CO_CREATOR_START_LEVEL]
  }
  const levels = visibleLevels(track, access)
  for (let i = levels.length - 1; i >= 0; i--) if (xp >= levels[i].minXP) return levels[i]
  return levels[0]
}

export function getNextLevel(xp: number, track: LevelTrack = "personal", access: LevelAccess = {}) {
  if (!access.coCreatorApproved && xp >= minXPForLevel(CO_CREATOR_START_LEVEL)) {
    return { level: LEVEL_TRACKS[track][CO_CREATOR_START_LEVEL], need: 0, requiresReview: true }
  }
  if (access.coCreatorApproved && xp >= minXPForLevel(CO_CREATOR_START_LEVEL)) {
    const currentLevel = coCreatorLevelFromContribution(access.contributionPoints || 0)
    const nextLevel = currentLevel + 1
    if (nextLevel > 19) return null
    const nextIndex = Math.max(0, nextLevel - CO_CREATOR_START_LEVEL)
    const nextContribution = CO_CREATOR_CONTRIBUTION_THRESHOLDS[nextIndex] || 0
    return {
      level: LEVEL_TRACKS[track][nextLevel],
      need: Math.max(0, nextContribution - Number(access.contributionPoints || 0)),
      requiresContribution: true,
    }
  }
  const levels = visibleLevels(track, access)
  const next = levels.find((level) => level.minXP > xp)
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
