import { tools } from "@/data/tools"
import { models } from "@/data/models"
import { skills } from "@/data/skills"
import { news } from "@/data/news"
import { stages } from "@/data/learning-path"
import { toolPath } from "@/data/tool-meta"
import { missions } from "@/data/missions"
import { agentInstallGuides } from "@/data/agent-install-guides"

export type SearchKind = "工具" | "模型" | "教程" | "任务" | "资讯" | "工作流" | "技能"

export type SearchResult = {
  id: string
  kind: SearchKind
  title: string
  description: string
  href: string
  meta: string
  score: number
}

function scoreText(q: string, fields: string[]) {
  const query = q.trim().toLowerCase()
  if (!query) return 0
  return fields.reduce((score, field, index) => {
    const text = String(field || "").toLowerCase()
    if (!text) return score
    if (text === query) return score + 80 - index * 8
    if (text.includes(query)) return score + 40 - index * 5
    return query.split(/\s+/).reduce((s, word) => (word && text.includes(word) ? s + 10 : s), score)
  }, 0)
}

const workflowResultsSeed = [
  {
    id: "daily-news",
    title: "AI 资讯早报工作流",
    description: "每天自动抓取 AI 资讯，筛选重点，生成早报并推送给团队或社区。",
    meta: "内容运营 · 入门 · 定时触发",
    keywords: "工作流 自动化 AI资讯 早报 抓取 推送 内容运营",
  },
  {
    id: "customer-service",
    title: "智能客服草稿工作流",
    description: "用户提交问题后自动检索资料，用小白AI或 DeepSeek 生成回复草稿，人工确认后再发送。",
    meta: "客服私域 · 进阶 · 人工审核",
    keywords: "工作流 客服 自动回复 私域 表单 知识库 DeepSeek",
  },
  {
    id: "weekly-report",
    title: "自动周报工作流",
    description: "汇总本周任务、表格数据和沟通记录，自动生成结构清晰的周报。",
    meta: "办公提效 · 入门 · 报告生成",
    keywords: "工作流 周报 自动化 办公 表格 数据 报告",
  },
  {
    id: "content-pipeline",
    title: "内容矩阵发布工作流",
    description: "一个选题生成多平台内容草稿，经过人工审核后发布到公众号、小红书或短视频平台。",
    meta: "自媒体 · 进阶 · 内容矩阵",
    keywords: "工作流 内容矩阵 自媒体 小红书 公众号 短视频 发布",
  },
]

const seoTutorialResultsSeed = [
  {
    id: "tutorials",
    title: "AI教程大全",
    description: "零基础学AI、AI工具教程、DeepSeek、Dify、Gamma、即梦、AI办公和Agent教程集合。",
    href: "/tutorials",
    meta: "教程聚合 · 零基础 · AI工具",
    keywords: "AI教程 AI教程大全 AI工具教程 零基础学AI AI小白教程 DeepSeek Dify Gamma 即梦 Agent",
  },
  {
    id: "member-cases",
    title: "会员实战案例",
    description: "把资讯教程整理成能照着做的实战案例，覆盖Agent、小程序、知识库、自动化、办公和内容副业。",
    href: "/member-cases",
    meta: "会员案例 · 实战教程 · 项目训练",
    keywords: "会员实战案例 AI实战教程 Agent实战 小程序上线 AI副业案例 教程实操",
  },
  {
    id: "agent-mini-program",
    title: "用Agent做微信小程序并上线",
    description: "从需求、指挥Agent写代码、真机验收到微信开发者工具上传、提交审核和发布。",
    href: "/agent-mini-program",
    meta: "Agent教程 · 小程序 · 上线",
    keywords: "Agent做小程序 AI写小程序 微信小程序上线 Claude Code小程序 Codex小程序 小程序提交审核",
  },
  {
    id: "free-ai-tools",
    title: "免费AI工具推荐",
    description: "免费ChatGPT替代、AI绘图、AI写作、AI办公和Agent工具整理。",
    href: "/free-ai-tools",
    meta: "工具教程 · 免费 · 新手",
    keywords: "免费AI工具 免费ChatGPT替代 免费AI绘图 免费AI写作 免费AI办公 AI工具免费版",
  },
  {
    id: "ai-tools",
    title: "AI工具大全",
    description: "对话AI、AI绘图、AI编程、AI办公、AI视频和Agent工具推荐。",
    href: "/ai-tools",
    meta: "工具导航 · 分类 · 推荐",
    keywords: "AI工具大全 AI工具导航 AI工具推荐 ChatGPT DeepSeek Kimi Midjourney Cursor Dify",
  },
  {
    id: "deepseek-api-key",
    title: "DeepSeek API Key怎么申请",
    description: "DeepSeek API注册、模型选择、Dify/Codex接入和401、402、timeout常见报错。",
    href: "/deepseek-api-key",
    meta: "API教程 · DeepSeek · 接入",
    keywords: "DeepSeek API Key DeepSeek API申请 DeepSeek API教程 DeepSeek V4 API Dify接入DeepSeek",
  },
  {
    id: "deepseek",
    title: "DeepSeek怎么用",
    description: "DeepSeek聊天、联网搜索、推理、写作、代码和国产模型选择入门。",
    href: "/deepseek",
    meta: "模型教程 · DeepSeek · 新手",
    keywords: "DeepSeek怎么用 DeepSeek教程 DeepSeek聊天 DeepSeek推理 DeepSeek写代码 DeepSeek联网搜索",
  },
  {
    id: "claude-code-deepseek",
    title: "Claude Code接入DeepSeek教程",
    description: "用 DeepSeek V4 作为 Claude Code、Codex、OpenClaw 等 Agent 的模型后端。",
    href: "/claude-code-deepseek",
    meta: "编程教程 · DeepSeek · Agent",
    keywords: "Claude Code DeepSeek DeepSeek V4 Claude Code接入 DeepSeek 编程 Agent 模型后端",
  },
  {
    id: "dify-knowledge-base",
    title: "Dify知识库怎么搭建",
    description: "Dify RAG、文档上传、召回设置、DeepSeek接入和知识库答非所问解决。",
    href: "/dify-knowledge-base",
    meta: "Agent教程 · Dify · RAG",
    keywords: "Dify知识库 Dify RAG Dify教程 知识库问答 Dify AI客服 Dify答非所问",
  },
  {
    id: "gamma-ppt",
    title: "Gamma怎么做PPT",
    description: "Gamma AI PPT生成、中文提示词、导出和正式汇报修改教程。",
    href: "/gamma-ppt",
    meta: "办公教程 · Gamma · PPT",
    keywords: "Gamma怎么做PPT Gamma教程 AI做PPT AI PPT生成 Gamma中文提示词 Gamma导出PPT",
  },
  {
    id: "jimeng-prompts",
    title: "即梦AI绘图提示词怎么写",
    description: "即梦文生图、图生图、海报头像、电商主图和短视频素材提示词教程。",
    href: "/jimeng-prompts",
    meta: "绘图教程 · 即梦 · 提示词",
    keywords: "即梦AI提示词 即梦AI绘图 即梦文生图 即梦图生图 AI绘图提示词 即梦AI教程",
  },
  {
    id: "ai-image-tools",
    title: "AI绘图工具推荐",
    description: "AI画图软件、Midjourney、即梦、DALL·E、通义万相和提示词入门。",
    href: "/ai-image-tools",
    meta: "工具教程 · AI绘图",
    keywords: "AI绘图工具 AI画图软件 AI绘画工具 Midjourney教程 即梦AI教程 AI生成图片",
  },
  {
    id: "ai-writing-tools",
    title: "AI写作工具推荐",
    description: "AI文案、公众号、小红书、论文润色和SEO写作工具整理。",
    href: "/ai-writing-tools",
    meta: "工具教程 · AI写作",
    keywords: "AI写作工具 AI文案工具 AI写文章 小红书AI文案 公众号AI写作 AI论文润色",
  },
  {
    id: "ai-video-tools",
    title: "AI视频工具推荐",
    description: "AI视频生成、文生视频、图生视频、可灵、即梦和Runway整理。",
    href: "/ai-video-tools",
    meta: "工具教程 · AI视频",
    keywords: "AI视频工具 AI视频生成 文生视频 图生视频 可灵AI教程 即梦视频 Runway教程",
  },
  {
    id: "ai-office-tools",
    title: "AI办公工具推荐",
    description: "AI做PPT、文档总结、会议纪要、表格分析和自动化办公整理。",
    href: "/ai-office-tools",
    meta: "工具教程 · AI办公",
    keywords: "AI办公工具 AI做PPT AI会议纪要 AI文档总结 AI表格分析 自动化办公",
  },
  {
    id: "ai-ppt-tools",
    title: "AI PPT工具推荐",
    description: "AI做PPT、Gamma、Canva、PPT Master和汇报生成教程。",
    href: "/ai-ppt-tools",
    meta: "工具教程 · AI PPT",
    keywords: "AI PPT工具 AI做PPT AI生成PPT Gamma教程 Canva AI PPT PPT Master",
  },
]

export function searchSite(query: string, limit = 40): SearchResult[] {
  const q = query.trim()
  if (!q) return []

  const toolResults = tools.map((tool) => ({
    id: `tool-${tool.id}`,
    kind: "工具" as const,
    title: tool.name,
    description: tool.description,
    href: toolPath(tool),
    meta: `${tool.category} · ${tool.pricing} · 阶段 ${tool.stage}`,
    score: scoreText(q, [tool.name, tool.description, tool.category, tool.tags.join(" ")]) + (tool.featured ? 8 : 0),
  }))

  const modelResults = models.map((model) => ({
    id: `model-${model.id}`,
    kind: "模型" as const,
    title: model.name,
    description: model.description,
    href: `/models?search=${encodeURIComponent(model.name)}`,
    meta: `${model.provider} · ${model.type} · ${model.pricing}`,
    score: scoreText(q, [model.name, model.provider, model.description, model.tags.join(" "), model.useCase]) + (20 - model.rank),
  }))

  const skillResults = skills.map((skill) => ({
    id: `skill-${skill.id}`,
    kind: "技能" as const,
    title: skill.name,
    description: skill.description,
    href: `/skills?search=${encodeURIComponent(skill.name)}`,
    meta: `${skill.platform} · ${skill.difficulty} · ${skill.downloads}`,
    score: scoreText(q, [skill.name, skill.description, skill.category, skill.platform, skill.tags.join(" ")]),
  }))

  const tutorialResults = stages.flatMap((stage) =>
    stage.sections.map((section, index) => ({
      id: `learn-${stage.id}-${index}`,
      kind: "教程" as const,
      title: section.title,
      description: section.content.slice(0, 180),
      href: `/learn/${stage.id}`,
      meta: `${stage.title} · ${stage.timeEstimate}`,
      score: scoreText(q, [section.title, section.content, section.tips || "", stage.title, stage.subtitle]) + 6,
    })),
  )

  const agentInstallResults = agentInstallGuides.map((guide) => ({
    id: `agent-install-${guide.slug}`,
    kind: "教程" as const,
    title: `${guide.name} 安装和设置教程`,
    description: `${guide.tagline} 包含准备条件、安装步骤、启动验证、模型/API 接入和常见报错。`,
    href: `/agent-install/${guide.slug}`,
    meta: `${guide.category} · ${guide.minutes} · ${guide.difficulty}`,
    score: scoreText(q, [
      guide.name,
      guide.title,
      guide.category,
      guide.tagline,
      guide.summary,
      guide.bestFor.join(" "),
      guide.requirements.join(" "),
      guide.installSteps.map((step) => `${step.title} ${step.body}`).join(" "),
      guide.startCommands.map((step) => `${step.title} ${step.body}`).join(" "),
      guide.commonIssues.map((issue) => `${issue.title} ${issue.solution}`).join(" "),
      guide.apiConnections.map((api) => `${api.name} ${api.description} ${api.fields.map((field) => `${field.label} ${field.value}`).join(" ")}`).join(" "),
    ]) + 20,
  }))

  const seoTutorialResults = seoTutorialResultsSeed.map((item) => ({
    id: `seo-${item.id}`,
    kind: "教程" as const,
    title: item.title,
    description: item.description,
    href: item.href,
    meta: item.meta,
    score: scoreText(q, [item.title, item.description, item.meta, item.keywords]) + 18,
  }))

  const missionResults = missions.map((mission) => ({
    id: `mission-${mission.id}`,
    kind: "任务" as const,
    title: mission.title,
    description: mission.tagline,
    href: `/missions/${mission.id}`,
    meta: `${mission.stage} · ${mission.minutes} · +${mission.xp}XP`,
    score: scoreText(q, [
      mission.title,
      mission.shortTitle,
      mission.tagline,
      mission.outcome,
      mission.tags.join(" "),
      mission.toolIds.join(" "),
      mission.steps.map((step) => `${step.title} ${step.desc} ${step.prompt}`).join(" "),
    ]) + 16,
  }))

  const newsResults = news.map((item) => ({
    id: `news-${item.id}`,
    kind: "资讯" as const,
    title: item.title,
    description: item.summary,
    href: `/news/${item.id}`,
    meta: `${item.category} · ${item.publishedAt} · ${item.source}`,
    score: scoreText(q, [item.title, item.summary, item.category, item.source, item.content || ""]) + item.importance,
  }))

  const workflowResults = workflowResultsSeed.map((workflow) => ({
    id: `workflow-${workflow.id}`,
    kind: "工作流" as const,
    title: workflow.title,
    description: workflow.description,
    href: `/workflows?template=${workflow.id}`,
    meta: workflow.meta,
    score: scoreText(q, [workflow.title, workflow.description, workflow.meta, workflow.keywords]) + 12,
  }))

  return [...toolResults, ...modelResults, ...seoTutorialResults, ...agentInstallResults, ...tutorialResults, ...missionResults, ...newsResults, ...workflowResults, ...skillResults]
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}
