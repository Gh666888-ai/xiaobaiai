import { tools } from "@/data/tools"
import { models } from "@/data/models"
import { skills } from "@/data/skills"
import { news } from "@/data/news"
import { stages } from "@/data/learning-path"
import { toolPath } from "@/data/tool-meta"

export type SearchKind = "工具" | "模型" | "技能" | "教程" | "资讯" | "工作流"

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

  return [...toolResults, ...modelResults, ...skillResults, ...tutorialResults, ...newsResults, ...workflowResults]
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}
