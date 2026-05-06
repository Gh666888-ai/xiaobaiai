export type WorkflowStepType = "trigger" | "collect" | "ai" | "action" | "review" | "output"

export type WorkflowStep = {
  id: string
  type: WorkflowStepType
  title: string
  detail: string
  tool: string
}

export type WorkflowTemplate = {
  id: string
  name: string
  scene: string
  goal: string
  difficulty: string
  time: string
  defaultSchedule: string
  guide: {
    accounts: string[]
    inputs: { key: string; label: string; placeholder: string; required?: boolean }[]
    outputs: { key: string; label: string; placeholder: string }[]
    tips: string[]
  }
  steps: WorkflowStep[]
}

export const workflowStepLibrary: WorkflowStep[] = [
  { id: "trigger-time", type: "trigger", title: "定时触发", detail: "每天、每周或每月自动运行一次。", tool: "Cron / 小白AI 定时器 / n8n" },
  { id: "trigger-form", type: "trigger", title: "表单触发", detail: "用户提交需求后自动进入流程。", tool: "飞书表单 / 网站表单" },
  { id: "collect-web", type: "collect", title: "抓取网页信息", detail: "读取指定网站、RSS、热榜或公开资料。", tool: "Browser / Tavily / RSS" },
  { id: "collect-file", type: "collect", title: "读取文件资料", detail: "读取 PDF、Word、Excel 或知识库。", tool: "Dify 知识库 / Kimi" },
  { id: "ai-summary", type: "ai", title: "AI 摘要与分类", detail: "把长内容压缩成要点，并按主题分类。", tool: "DeepSeek / Kimi / 通义千问" },
  { id: "ai-draft", type: "ai", title: "AI 生成草稿", detail: "生成回复、文章、日报、脚本或方案初稿。", tool: "小白AI / DeepSeek" },
  { id: "action-sheet", type: "action", title: "写入表格", detail: "把结构化结果写入表格、数据库或多维表。", tool: "飞书多维表格 / Excel" },
  { id: "action-send", type: "action", title: "发送通知", detail: "把结果推送到微信、飞书、邮箱或站内消息。", tool: "企业微信 / 飞书 / 邮箱" },
  { id: "review-human", type: "review", title: "人工确认", detail: "对外发送、扣费、删除文件前必须人工确认。", tool: "人工审核节点" },
  { id: "output-report", type: "output", title: "生成报告", detail: "输出 Markdown、PDF、日报、看板或任务清单。", tool: "小白AI / Gamma / 飞书文档" },
]

const s = workflowStepLibrary

export const workflowTemplates: WorkflowTemplate[] = [
  {
    id: "daily-news",
    name: "AI 资讯早报",
    scene: "内容运营",
    goal: "每天自动抓取 AI 资讯，筛选重点并生成早报。",
    difficulty: "入门",
    time: "30 分钟搭好",
    defaultSchedule: "每天 08:00",
    guide: {
      accounts: ["DeepSeek API Key", "企业微信机器人 Webhook 或飞书机器人 Webhook", "可选：n8n Webhook", "可选：Dify Workflow API Key"],
      inputs: [
        { key: "sources", label: "资讯来源", placeholder: "例如：OpenAI Blog、DeepSeek News、机器之心、36氪 AI", required: true },
        { key: "keywords", label: "关注关键词", placeholder: "例如：Agent、DeepSeek、Claude Code、工作流", required: true },
      ],
      outputs: [
        { key: "webhookUrl", label: "推送 Webhook", placeholder: "企业微信/飞书/n8n 的 Webhook URL" },
      ],
      tips: ["先人工审核 3 天，确认摘要质量稳定后再开启自动推送。", "不要把 API Key 写进公开帖子或前端代码。"],
    },
    steps: [s[0], s[2], s[4], s[9], s[7]],
  },
  {
    id: "customer-service",
    name: "智能客服草稿",
    scene: "客服/私域",
    goal: "收到用户问题后，自动检索资料并生成回复草稿。",
    difficulty: "进阶",
    time: "1 小时搭好",
    defaultSchedule: "表单提交后",
    guide: {
      accounts: ["DeepSeek API Key", "Dify 知识库或 Kimi 长文档", "飞书表单或网站表单", "企业微信/飞书通知 Webhook"],
      inputs: [
        { key: "faqUrl", label: "知识库地址", placeholder: "FAQ 文档、售后政策或产品说明链接", required: true },
        { key: "tone", label: "回复语气", placeholder: "例如：耐心、简洁、像真人客服", required: true },
      ],
      outputs: [
        { key: "webhookUrl", label: "审核通知 Webhook", placeholder: "把草稿发给人工审核的 Webhook URL" },
      ],
      tips: ["客服类工作流必须保留人工审核。", "涉及退款、投诉、隐私数据时不要全自动发送。"],
    },
    steps: [s[1], s[3], s[5], s[8], s[7]],
  },
  {
    id: "weekly-report",
    name: "自动周报",
    scene: "办公提效",
    goal: "汇总本周数据、任务和沟通记录，生成周报。",
    difficulty: "入门",
    time: "40 分钟搭好",
    defaultSchedule: "每周五 18:00",
    guide: {
      accounts: ["DeepSeek API Key", "飞书多维表格或 Excel 在线表", "可选：企业微信群机器人"],
      inputs: [
        { key: "dataUrl", label: "数据表地址", placeholder: "任务表、销售表、项目进度表链接", required: true },
        { key: "reportAudience", label: "汇报对象", placeholder: "例如：老板、团队、客户", required: true },
      ],
      outputs: [
        { key: "webhookUrl", label: "周报推送 Webhook", placeholder: "飞书/企业微信/邮箱 Webhook URL" },
      ],
      tips: ["周报建议先输出草稿，再由你确认。", "敏感业务数据不要发送到不可信的第三方自动化平台。"],
    },
    steps: [s[0], s[6], s[4], s[9], s[8]],
  },
  {
    id: "content-pipeline",
    name: "内容矩阵发布",
    scene: "自媒体",
    goal: "一个选题生成多平台内容草稿，再人工审核发布。",
    difficulty: "进阶",
    time: "1-2 小时",
    defaultSchedule: "每天 09:30",
    guide: {
      accounts: ["DeepSeek API Key", "飞书文档或 Notion", "可选：Dify Workflow", "可选：n8n Webhook"],
      inputs: [
        { key: "topic", label: "选题来源", placeholder: "热榜、RSS、人工选题表或产品更新记录", required: true },
        { key: "platforms", label: "发布平台", placeholder: "公众号、小红书、知乎、视频号", required: true },
      ],
      outputs: [
        { key: "webhookUrl", label: "草稿接收 Webhook", placeholder: "把多平台草稿发送到飞书/企业微信/n8n" },
      ],
      tips: ["不同平台语气不同，建议为每个平台设置单独提示词。", "最终发布前一定人工审核，避免事实错误和违规表达。"],
    },
    steps: [s[1], s[5], s[9], s[8], s[7]],
  },
]

export function buildWorkflowPlan(name: string, goal: string, steps: WorkflowStep[]) {
  return [
    `# ${name || "我的 AI 工作流"}`,
    "",
    `目标：${goal || "把重复任务拆成可执行的自动化流程。"}`,
    "",
    "## 流程步骤",
    ...steps.map((step, index) => `${index + 1}. 【${step.type}】${step.title}\n   - 说明：${step.detail}\n   - 推荐工具：${step.tool}`),
    "",
    "## 上线前检查",
    "- 是否明确触发条件，避免误触发。",
    "- 是否设置人工审核点，特别是对外发送、扣费、删除文件和客户沟通。",
    "- 是否准备失败重试和异常通知。",
    "- 是否把 API Key、客户隐私和业务数据放在安全位置。",
    "",
    "## 小白AI建议",
    "先让流程半自动跑 3 天，确认结果稳定后，再逐步减少人工审核。",
  ].join("\n")
}
