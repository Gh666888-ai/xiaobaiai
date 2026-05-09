import { findIndustrySeries, industrySeries } from "@/data/industry-series"
import { skills, type Skill, type SkillCategory } from "@/data/skills"
import { recommendMissionFromGoal } from "@/lib/mission-recommender"

export type SkillScoreBreakdown = {
  industryFit: number
  workflowFit: number
  beginnerFit: number
  safetyFit: number
  popularityFit: number
}

export type SkillRecommendation = {
  skill: Skill
  score: number
  breakdown: SkillScoreBreakdown
  reason: string
  firstCheck: string
}

export type ProfessionSkillTrack = {
  id: string
  title: string
  shortTitle: string
  keywords: string[]
  workflow: string[]
  preferredNames: string[]
  preferredTags: string[]
  preferredCategories: SkillCategory[]
  preferredPlatforms: Skill["platform"][]
  nextMissionId: string
}

export type SkillRecommendationPlan = {
  track: ProfessionSkillTrack
  goal: string
  nextMissionId: string
  nextMissionTitle: string
  workflow: string[]
  recommendations: SkillRecommendation[]
}

export const professionSkillTracks: ProfessionSkillTrack[] = [
  {
    id: "ecommerce-store",
    title: "电商 / 店铺 AI 经营 Skill 组合",
    shortTitle: "电商店铺",
    keywords: ["电商", "店铺", "淘宝", "抖店", "拼多多", "商品", "客服", "售后", "私域", "带货"],
    workflow: ["商品资料", "种草内容", "客服知识库", "竞品监控", "每日复盘"],
    preferredNames: ["skill-vetter", "Agent Browser", "summarize", "AI文案生成器", "小红书笔记生成器", "竞品监控", "用户反馈分析", "Dify"],
    preferredTags: ["安全", "浏览器", "网页", "总结", "文案", "营销", "小红书", "竞品", "反馈", "客服", "知识库"],
    preferredCategories: ["安全隐私", "自动化", "内容创作", "数据分析", "企业应用"],
    preferredPlatforms: ["OpenClaw", "Dify", "Coze", "通用"],
    nextMissionId: "industry-skill-stack-plan",
  },
  {
    id: "education-training",
    title: "教育 / 培训 AI 课程 Skill 组合",
    shortTitle: "教育培训",
    keywords: ["教育", "培训", "老师", "讲师", "课程", "课件", "教培", "题目", "学生", "知识付费"],
    workflow: ["课程资料", "试讲 PPT", "练习题", "答疑知识库", "作业提醒"],
    preferredNames: ["skill-vetter", "summarize", "PPT自动生成", "AI英语口语陪练", "论文写作助手", "编程学习教练", "Dify"],
    preferredTags: ["安全", "总结", "摘要", "PPT", "课程", "题目", "学习", "知识库", "练习", "转录"],
    preferredCategories: ["安全隐私", "学习教育", "内容创作", "办公效率", "企业应用"],
    preferredPlatforms: ["OpenClaw", "Dify", "Coze", "通用"],
    nextMissionId: "industry-skill-stack-plan",
  },
  {
    id: "creator-media",
    title: "自媒体 / 短视频 AI 内容 Skill 组合",
    shortTitle: "内容创作",
    keywords: ["自媒体", "短视频", "小红书", "抖音", "公众号", "视频号", "账号", "IP", "动漫", "漫剧", "脚本"],
    workflow: ["账号定位", "选题", "文案脚本", "视觉提示词", "发布复盘"],
    preferredNames: ["skill-vetter", "Agent Browser", "summarize", "AI文案生成器", "视频脚本生成", "AI绘画提示词助手", "多平台排版助手", "小红书笔记生成器"],
    preferredTags: ["安全", "浏览器", "总结", "文案", "视频", "脚本", "分镜", "绘图", "提示词", "排版", "小红书", "抖音"],
    preferredCategories: ["安全隐私", "内容创作", "AI视频", "AI设计", "自动化"],
    preferredPlatforms: ["OpenClaw", "Dify", "Coze", "通用"],
    nextMissionId: "ai-comic-video-first-episode",
  },
  {
    id: "local-service",
    title: "餐饮 / 本地生活 AI 获客 Skill 组合",
    shortTitle: "本地生活",
    keywords: ["餐饮", "美业", "健身", "摄影", "维修", "家政", "民宿", "本地生活", "门店", "到店", "复购"],
    workflow: ["门店资料", "套餐文案", "海报素材", "咨询问答", "复购提醒"],
    preferredNames: ["skill-vetter", "AI文案生成器", "小红书笔记生成器", "AI绘画提示词助手", "微信自动回复", "飞书机器人", "定时任务调度器"],
    preferredTags: ["安全", "文案", "营销", "小红书", "绘图", "提示词", "微信", "回复", "提醒", "门店", "本地"],
    preferredCategories: ["安全隐私", "内容创作", "通讯社交", "自动化", "AI设计"],
    preferredPlatforms: ["OpenClaw", "Coze", "Dify", "通用"],
    nextMissionId: "industry-skill-stack-plan",
  },
  {
    id: "enterprise-office",
    title: "企业办公 / 运营提效 Skill 组合",
    shortTitle: "企业办公",
    keywords: ["企业", "办公", "行政", "人事", "运营", "销售", "项目", "团队", "SOP", "周报", "会议"],
    workflow: ["资料读取", "会议纪要", "SOP 知识库", "周报日报", "自动通知"],
    preferredNames: ["skill-vetter", "summarize", "会议纪要生成", "周报自动生成", "合同审查助手", "飞书机器人", "gog", "Notion知识同步"],
    preferredTags: ["安全", "总结", "会议", "纪要", "周报", "合同", "飞书", "通知", "SOP", "知识库", "Notion"],
    preferredCategories: ["安全隐私", "办公效率", "企业应用", "自动化", "通讯社交"],
    preferredPlatforms: ["OpenClaw", "Dify", "QClaw", "通用"],
    nextMissionId: "industry-skill-stack-plan",
  },
  {
    id: "developer-builder",
    title: "开发者 / 独立产品 AI 工程 Skill 组合",
    shortTitle: "开发产品",
    keywords: ["开发", "程序员", "代码", "产品", "独立开发", "站长", "网站", "SaaS", "小程序", "工程", "api"],
    workflow: ["读项目", "查资料", "改代码", "审查安全", "提交部署"],
    preferredNames: ["skill-vetter", "github", "Agent Browser", "tavily-search", "wacli", "代码审查助手", "API文档生成", "环境部署助手"],
    preferredTags: ["安全", "GitHub", "代码", "审查", "浏览器", "搜索", "联网", "CLI", "shell", "API", "部署"],
    preferredCategories: ["安全隐私", "开发工具", "自动化", "数据分析"],
    preferredPlatforms: ["OpenClaw", "QClaw", "通用"],
    nextMissionId: "agent-skill-first-install",
  },
]

function normalizeText(value: string) {
  return value.toLowerCase().replace(/\s+/g, "")
}

function parseDownloads(value: string) {
  const text = value.trim().toLowerCase()
  const number = Number.parseFloat(text)
  if (Number.isNaN(number)) return 0
  if (text.endsWith("k")) return number * 1000
  if (text.endsWith("m")) return number * 1000000
  return number
}

function clampScore(value: number, max: number) {
  return Math.max(0, Math.min(max, Math.round(value)))
}

function includesAny(haystack: string, needles: string[]) {
  return needles.some((needle) => haystack.includes(normalizeText(needle)))
}

function pickTrack(goal: string) {
  const text = normalizeText(goal)
  const byTrack = professionSkillTracks
    .map((track) => ({
      track,
      score: track.keywords.reduce((total, keyword) => total + (text.includes(normalizeText(keyword)) ? normalizeText(keyword).length : 0), 0),
    }))
    .sort((a, b) => b.score - a.score)[0]

  if (byTrack?.score > 0) return byTrack.track

  const series = findIndustrySeries(goal)
  if (series) return professionSkillTracks.find((track) => track.id === series.id) || professionSkillTracks[4]

  return professionSkillTracks[4]
}

export function scoreSkillForTrack(skill: Skill, track: ProfessionSkillTrack, goal = "") {
  const text = normalizeText([skill.name, skill.description, skill.platform, skill.category, ...skill.tags].join(" "))
  const goalText = normalizeText(goal)
  const nameHit = track.preferredNames.some((name) => normalizeText(skill.name).includes(normalizeText(name)) || normalizeText(name).includes(normalizeText(skill.name)))
  const tagHits = track.preferredTags.filter((tag) => text.includes(normalizeText(tag))).length
  const goalHits = goalText ? skill.tags.filter((tag) => goalText.includes(normalizeText(tag))).length : 0

  const industryFit = clampScore((nameHit ? 22 : 0) + tagHits * 5 + goalHits * 4, 40)
  const workflowFit = clampScore(
    (track.preferredCategories.includes(skill.category) ? 12 : 0) +
      (track.preferredPlatforms.includes(skill.platform) ? 8 : 0) +
      (includesAny(text, track.workflow) ? 5 : 0),
    25,
  )
  const beginnerFit = skill.difficulty === "简单" ? 15 : skill.difficulty === "中等" ? 10 : 5
  const safetyFit = /skill-vetter|安全|隐私|审计|权限|风险/.test(text) ? 10 : skill.difficulty === "进阶" ? 5 : 7
  const popularityFit = clampScore(Math.log10(parseDownloads(skill.downloads) + 10) * 2.1, 10)

  const breakdown = { industryFit, workflowFit, beginnerFit, safetyFit, popularityFit }
  const score = clampScore(Object.values(breakdown).reduce((sum, item) => sum + item, 0), 100)
  return { score, breakdown }
}

function recommendationReason(skill: Skill, track: ProfessionSkillTrack) {
  const text = `${skill.name} ${skill.tags.join(" ")}`
  if (/skill-vetter|安全|审计/.test(text)) return "先检查 Skill 是否安全，避免新手一上来就装错东西。"
  if (/Browser|浏览器|网页/.test(text)) return `适合跑「${track.workflow[0]}」和网页操作，能让 Agent 真的看页面、点页面。`
  if (/summarize|总结|摘要/.test(text)) return `适合把资料先读懂，后面做「${track.workflow.slice(1, 3).join("、")}」才不乱编。`
  if (/文案|小红书|视频|脚本|提示词|排版/.test(text)) return `适合做「${track.workflow.slice(1, 4).join("、")}」这种可交付内容。`
  if (/GitHub|代码|API|部署|CLI|shell/.test(text)) return "适合工程 Agent 读项目、改代码、查问题和留下可验证结果。"
  if (/会议|周报|通知|飞书|Notion|知识库|客服/.test(text)) return `适合把「${track.workflow.slice(2).join("、")}」变成固定流程。`
  return `和「${track.shortTitle}」的 ${track.workflow.slice(0, 3).join("、")} 流程匹配。`
}

function firstCheck(skill: Skill) {
  const text = `${skill.name} ${skill.tags.join(" ")}`
  if (/skill-vetter|安全|审计/.test(text)) return "先拿一个准备安装的 Skill 跑一次安全检查。"
  if (/Browser|浏览器/.test(text)) return "让 Agent 打开一个网页并截图，能完成才算跑通。"
  if (/summarize|总结|摘要/.test(text)) return "给它一篇网页或 PDF，能输出 5 条要点才算跑通。"
  if (/文案|小红书|视频|脚本|提示词/.test(text)) return "用自己的行业资料生成一版初稿，再改一轮。"
  if (/GitHub|代码|API|部署|CLI|shell/.test(text)) return "让它只读项目并列出文件结构，不先改代码。"
  return "用一个小样例跑通，再决定是否放进长期工作流。"
}

export function recommendSkillsForGoal(goal: string, limit = 5): SkillRecommendationPlan {
  const track = pickTrack(goal)
  const scored = skills
    .map((skill) => {
      const { score, breakdown } = scoreSkillForTrack(skill, track, goal)
      return {
        skill,
        score,
        breakdown,
        reason: recommendationReason(skill, track),
        firstCheck: firstCheck(skill),
      }
    })
    .filter((item) => item.score >= 42)
    .sort((a, b) => b.score - a.score)

  const safety = scored.find((item) => normalizeText(item.skill.name).includes("skill-vetter"))
  const rest = scored.filter((item) => item !== safety)
  const recommendations = (safety ? [safety, ...rest] : rest).slice(0, limit)
  const mission = recommendMissionFromGoal(goal || track.title)

  return {
    track,
    goal,
    nextMissionId: track.nextMissionId || mission.id,
    nextMissionTitle: mission.shortTitle,
    workflow: track.workflow,
    recommendations,
  }
}
