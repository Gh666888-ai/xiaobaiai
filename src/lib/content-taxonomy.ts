export type ContentScenario =
  | "newbie"
  | "office"
  | "creator"
  | "image"
  | "dify"
  | "coding"
  | "workflow"
  | "data"
  | "security"

export const scenarioFilters: { key: "all" | ContentScenario; label: string; desc: string }[] = [
  { key: "all", label: "全部", desc: "所有内容" },
  { key: "newbie", label: "新手入门", desc: "第一周、基础概念、学习路线" },
  { key: "office", label: "办公提效", desc: "周报、PPT、会议纪要、表格" },
  { key: "creator", label: "内容创作", desc: "小红书、公众号、短视频、文案" },
  { key: "image", label: "AI绘图", desc: "即梦、头像、动漫、提示词" },
  { key: "dify", label: "Dify/知识库", desc: "Dify、RAG、客服 Bot、知识库" },
  { key: "coding", label: "AI编程", desc: "Cursor、Codex、SQL、代码协作" },
  { key: "workflow", label: "Agent工作流", desc: "Agent、n8n、自动化、飞书" },
  { key: "data", label: "数据分析", desc: "DeepSeek、CSV、BI、数据清洗" },
  { key: "security", label: "安全与隐私", desc: "脱敏、API Key、权限、限额" },
]

const scenarioKeywords: Record<ContentScenario, string[]> = {
  newbie: ["新手", "零基础", "入门", "第一周", "学习路径", "小白", "第一次"],
  office: ["办公", "周报", "日报", "会议纪要", "PPT", "Gamma", "Excel", "表格", "邮件", "简历"],
  creator: ["小红书", "公众号", "文案", "短视频", "脚本", "标题", "运营", "内容创作", "改稿"],
  image: ["AI动漫", "AI绘图", "绘图", "即梦", "头像", "壁纸", "Prompt", "提示词", "国风", "赛博", "分镜"],
  dify: ["Dify", "知识库", "RAG", "客服", "Bot", "Coze", "扣子", "召回", "切分"],
  coding: ["Cursor", "Codex", "AI编程", "编程", "Next.js", "代码", "SQL", "Cline", "Claude Code", "DeepSeek V4", "V4-Pro", "V4-Flash", "Anthropic", "ANTHROPIC_BASE_URL"],
  workflow: ["Agent", "工作流", "自动化", "n8n", "飞书", "QClaw", "OpenClaw", "Hermes", "定时"],
  data: ["数据", "数据分析", "CSV", "BI", "DeepSeek", "字段", "指标", "看板", "SQL"],
  security: ["安全", "隐私", "脱敏", "API Key", "限额", "权限", "人工确认", "风险"],
}

function textOf(post: any) {
  return [
    post?.title,
    post?.category,
    post?.author,
    ...(Array.isArray(post?.tags) ? post.tags : []),
  ].filter(Boolean).join(" ")
}

export function inferPostScenarios(post: any): ContentScenario[] {
  const text = textOf(post).toLowerCase()
  const matched = (Object.keys(scenarioKeywords) as ContentScenario[]).filter((key) =>
    scenarioKeywords[key].some((word) => text.includes(word.toLowerCase())),
  )
  return matched.length ? matched : ["workflow"]
}

export function primaryScenario(post: any): ContentScenario {
  return inferPostScenarios(post)[0]
}

export function scenarioLabel(key: ContentScenario) {
  return scenarioFilters.find((item) => item.key === key)?.label || "实战案例"
}
