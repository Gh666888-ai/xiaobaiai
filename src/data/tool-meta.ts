import { Tool, tools } from "@/data/tools"

export type ToolMeta = {
  magicNetwork: "不需要" | "建议准备" | "通常需要"
  chineseSupport: "优秀" | "良好" | "一般"
  difficulty: "新手友好" | "需要练习" | "进阶使用"
  newbieScore: number
  bestFor: string[]
  quickStart: string[]
  caution: string
}

const domesticKeywords = [
  "通义", "豆包", "文心", "讯飞", "Kimi", "DeepSeek", "即梦", "可灵", "剪映",
  "腾讯", "阿里", "百度", "字节", "月之暗面", "秘塔", "火山", "硅基流动",
]

const usuallyNeedsNetwork = [
  "chat.openai.com", "openai.com", "claude.ai", "anthropic.com", "gemini.google.com",
  "google.com", "midjourney.com", "poe.com", "character.ai", "runwayml.com",
  "github.com", "vercel", "cursor.sh", "notion.so",
]

export function isDomesticTool(tool: Tool) {
  return domesticKeywords.some((kw) =>
    tool.name.includes(kw) || tool.description.includes(kw) || tool.tags.some((tag) => tag.includes(kw)),
  )
}

export function toolPath(tool: Tool) {
  return `/tools/${encodeURIComponent(tool.category)}/${encodeURIComponent(tool.id)}`
}

export function categoryPath(category: string) {
  return `/tools/${encodeURIComponent(category)}`
}

export function getToolAlternatives(tool: Tool, limit = 4) {
  return tools
    .filter((item) => item.category === tool.category && item.id !== tool.id)
    .sort((a, b) => Number(b.featured) - Number(a.featured) || b.rank - a.rank || a.stage - b.stage)
    .slice(0, limit)
}

export function getToolMeta(tool: Tool): ToolMeta {
  const url = tool.url.toLowerCase()
  const domestic = isDomesticTool(tool)
  const magicNetwork = domestic
    ? "不需要"
    : usuallyNeedsNetwork.some((host) => url.includes(host))
      ? "通常需要"
      : "建议准备"

  const chineseSupport = domestic
    ? "优秀"
    : tool.tags.some((tag) => tag.includes("中文")) || tool.description.includes("中文")
      ? "良好"
      : "一般"

  const difficulty = tool.stage <= 1 ? "新手友好" : tool.stage <= 3 ? "需要练习" : "进阶使用"
  const newbieScore = Math.max(
    60,
    Math.min(98, 100 - tool.stage * 8 + (tool.pricing === "免费" ? 8 : 0) + (domestic ? 8 : 0) + (tool.featured ? 6 : 0)),
  )

  const quickStart = [
    `先用 ${tool.name} 完成一个 10 分钟的小任务，不要一上来做复杂项目。`,
    `复制一个真实需求给它，例如：总结文档、生成草稿、改写文案或分析数据。`,
    `把输出结果人工检查一遍，再决定是否纳入你的日常工作流。`,
  ]

  return {
    magicNetwork,
    chineseSupport,
    difficulty,
    newbieScore,
    bestFor: [
      tool.description,
      `${tool.category} 场景下的${tool.stage <= 1 ? "入门体验" : tool.stage <= 3 ? "日常提效" : "深度工作流"}`,
      tool.tags.slice(0, 3).join(" / "),
    ].filter(Boolean),
    quickStart,
    caution:
      magicNetwork === "通常需要"
        ? "海外服务可能存在网络、支付或账号限制，正式使用前建议准备备用方案。"
        : "正式处理重要资料前，先确认隐私、版权和输出准确性。",
  }
}
