import { recommendSkillsForGoal } from "@/data/skill-recommendations"
import { tools, type Tool, type ToolCategory } from "@/data/tools"

export type ToolRecommendation = {
  tool: Tool
  role: string
  reason: string
  score: number
}

export type ToolRecommendationPlan = {
  title: string
  shortTitle: string
  goal: string
  workflow: string[]
  tools: ToolRecommendation[]
  skills: ReturnType<typeof recommendSkillsForGoal>["recommendations"]
  primaryCategory: ToolCategory
}

type ToolTrack = {
  id: string
  shortTitle: string
  keywords: string[]
  workflow: string[]
  primaryCategory: ToolCategory
  toolIds: string[]
  roles: Record<string, string>
  reasons: Record<string, string>
}

const toolTracks: ToolTrack[] = [
  {
    id: "ecommerce-store",
    shortTitle: "电商店铺",
    keywords: ["电商", "店铺", "淘宝", "抖店", "拼多多", "商品", "客服", "售后", "私域", "带货"],
    workflow: ["商品资料", "种草内容", "产品图", "客服知识库", "每日复盘"],
    primaryCategory: "AI营销",
    toolIds: ["kimi", "deepseek", "jimeng", "photoroom", "dify", "coze", "n8n-ai-agent", "metaso"],
    roles: {
      kimi: "整理资料",
      deepseek: "打磨卖点",
      jimeng: "生成图片",
      photoroom: "产品图处理",
      dify: "客服知识库",
      coze: "渠道 Bot",
      "n8n-ai-agent": "每日复盘",
      metaso: "查竞品资料",
    },
    reasons: {
      kimi: "先把商品参数、评价、售后问题整理清楚，后面生成内容才不乱。",
      deepseek: "适合把卖点改成用户听得懂的话，也能检查夸大表达。",
      jimeng: "中文提示词友好，适合先做封面图、场景图和种草配图。",
      photoroom: "适合电商产品图去背景、换场景，见效快。",
      dify: "把 FAQ、退换货、发货说明做成能测试的客服知识库。",
      coze: "适合把客服或导购 Bot 发布到常用渠道。",
      "n8n-ai-agent": "适合把订单、评价、内容发布状态做成固定提醒。",
      metaso: "适合查竞品、平台规则和用户搜索问题。",
    },
  },
  {
    id: "education-training",
    shortTitle: "教育培训",
    keywords: ["教育", "培训", "老师", "讲师", "课程", "课件", "教培", "题目", "学生", "知识付费"],
    workflow: ["课程资料", "课件初稿", "练习题", "答疑知识库", "学员提醒"],
    primaryCategory: "AI学习",
    toolIds: ["kimi", "deepseek", "gamma", "qianwen-ppt", "dify", "coze", "feishu-ai", "slides-ai"],
    roles: {
      kimi: "整理课程资料",
      deepseek: "生成讲解逻辑",
      gamma: "生成课件",
      "qianwen-ppt": "中文 PPT",
      dify: "课程答疑",
      coze: "学员 Bot",
      "feishu-ai": "团队协作",
      "slides-ai": "Google Slides",
    },
    reasons: {
      kimi: "适合长资料、讲义、录音转写后的知识点整理。",
      deepseek: "适合把知识点改成教学步骤和练习题。",
      gamma: "先快速做一版能讲的 PPT，不要从空白页开始。",
      "qianwen-ppt": "中文模板和在线编辑更适合国内课件场景。",
      dify: "把课程资料做成答疑知识库，先测试 10 个问题。",
      coze: "适合做课程助手、社群答疑和轻量 Bot。",
      "feishu-ai": "适合团队一起整理课程文档和会议记录。",
      "slides-ai": "如果用 Google Slides，可以快速把大纲变页面。",
    },
  },
  {
    id: "creator-media",
    shortTitle: "内容创作",
    keywords: ["自媒体", "短视频", "小红书", "抖音", "公众号", "视频号", "账号", "IP", "动漫", "漫剧", "脚本"],
    workflow: ["账号定位", "选题文案", "图片/视频素材", "剪辑发布", "数据复盘"],
    primaryCategory: "AI视频",
    toolIds: ["deepseek", "kimi", "jimeng", "jianying-ai", "kling", "pixai", "canva-ai", "metaso"],
    roles: {
      deepseek: "选题文案",
      kimi: "资料整理",
      jimeng: "图片/视频素材",
      "jianying-ai": "剪辑发布",
      kling: "视频生成",
      pixai: "动漫角色",
      "canva-ai": "封面设计",
      metaso: "查热点",
    },
    reasons: {
      deepseek: "适合把真实经历改成标题、正文和脚本结构。",
      kimi: "适合整理资料和复盘已有内容，不让选题飘。",
      jimeng: "适合中文创作，做封面、角色图、短视频素材都快。",
      "jianying-ai": "新手做短视频最容易落地，模板和剪辑链路完整。",
      kling: "适合做高质量图生视频或短片镜头。",
      pixai: "适合动漫、二次元、角色一致性的入门尝试。",
      "canva-ai": "适合做封面、海报和账号视觉模板。",
      metaso: "适合查选题、热点和竞品内容。",
    },
  },
  {
    id: "local-service",
    shortTitle: "本地生活",
    keywords: ["餐饮", "美业", "健身", "摄影", "维修", "家政", "民宿", "本地生活", "门店", "到店", "复购"],
    workflow: ["门店资料", "套餐文案", "海报图片", "咨询问答", "回访提醒"],
    primaryCategory: "AI营销",
    toolIds: ["deepseek", "kimi", "jimeng", "canva-ai", "coze", "dify", "yuanbao", "n8n-ai-agent"],
    roles: {
      deepseek: "套餐文案",
      kimi: "资料整理",
      jimeng: "海报图片",
      "canva-ai": "模板设计",
      coze: "咨询 Bot",
      dify: "问答知识库",
      yuanbao: "微信生态",
      "n8n-ai-agent": "回访提醒",
    },
    reasons: {
      deepseek: "适合把服务、价格、案例改成用户愿意看的文案。",
      kimi: "适合整理门店资料、评价、套餐和常见问题。",
      jimeng: "适合生成海报、朋友圈配图和活动视觉。",
      "canva-ai": "模板多，适合不会设计的门店先做一版能发的图。",
      coze: "适合做咨询、预约、活动说明 Bot。",
      dify: "适合把价格、地址、服务边界做成问答知识库。",
      yuanbao: "微信用户更容易上手，适合日常问答和内容辅助。",
      "n8n-ai-agent": "适合做老客户回访、复购提醒和每日检查。",
    },
  },
  {
    id: "enterprise-office",
    shortTitle: "企业办公",
    keywords: ["企业", "办公", "行政", "人事", "运营", "销售", "项目", "团队", "SOP", "周报", "会议"],
    workflow: ["文档分析", "会议纪要", "汇报 PPT", "知识库", "周报自动化"],
    primaryCategory: "AI办公",
    toolIds: ["kimi", "deepseek", "microsoft-copilot", "feishu-ai", "gamma", "dify", "n8n-ai-agent", "notion-ai"],
    roles: {
      kimi: "文档分析",
      deepseek: "逻辑检查",
      "microsoft-copilot": "Office 办公",
      "feishu-ai": "团队文档",
      gamma: "汇报 PPT",
      dify: "内部知识库",
      "n8n-ai-agent": "周报自动化",
      "notion-ai": "知识沉淀",
    },
    reasons: {
      kimi: "适合会议记录、制度、合同、长文档的快速整理。",
      deepseek: "适合检查方案逻辑、提炼风险和行动清单。",
      "microsoft-copilot": "如果公司用 Office，它和 Word、Excel、PPT 贴得最近。",
      "feishu-ai": "适合飞书团队直接在文档、表格、会议中使用。",
      gamma: "适合把整理好的大纲快速变成汇报初稿。",
      dify: "适合把 SOP、FAQ、制度做成内部问答助手。",
      "n8n-ai-agent": "适合把提醒、日报、周报、消息通知串起来。",
      "notion-ai": "适合做项目笔记、知识库和团队资料沉淀。",
    },
  },
  {
    id: "developer-builder",
    shortTitle: "开发产品",
    keywords: ["开发", "程序员", "代码", "产品", "独立开发", "站长", "网站", "SaaS", "小程序", "工程", "api"],
    workflow: ["读项目", "查资料", "改代码", "测试验证", "部署上线"],
    primaryCategory: "AI编程",
    toolIds: ["codex", "claude-code", "cursor", "github-copilot", "deepseek-v4-api", "openclaw", "ollama", "v0"],
    roles: {
      codex: "工程 Agent",
      "claude-code": "终端 Agent",
      cursor: "AI 编辑器",
      "github-copilot": "IDE 辅助",
      "deepseek-v4-api": "模型后端",
      openclaw: "Agent 技能生态",
      ollama: "本地模型",
      v0: "前端生成",
    },
    reasons: {
      codex: "适合真实项目里读写文件、跑命令、改功能和验证结果。",
      "claude-code": "适合终端工作流和复杂代码理解。",
      cursor: "适合在编辑器里小步改代码，新手更容易看到改动。",
      "github-copilot": "适合稳定补全、生成测试和 IDE 内辅助。",
      "deepseek-v4-api": "它是模型 API 后端，不是 Agent，适合接到工程工具里降成本。",
      openclaw: "适合给 Agent 加技能，后面把固定工作交给它。",
      ollama: "适合隐私、本地模型和离线尝试。",
      v0: "适合快速生成前端界面初稿。",
    },
  },
]

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/g, "")
}

function pickTrack(goal: string) {
  const text = normalize(goal)
  const matched = toolTracks
    .map((track) => ({
      track,
      score: track.keywords.reduce((total, keyword) => total + (text.includes(normalize(keyword)) ? normalize(keyword).length : 0), 0),
    }))
    .sort((a, b) => b.score - a.score)[0]

  return matched?.score ? matched.track : toolTracks[4]
}

function scoreTool(tool: Tool, track: ToolTrack, goal: string) {
  const text = normalize([tool.name, tool.description, tool.category, ...tool.tags].join(" "))
  const goalText = normalize(goal)
  const direct = track.toolIds.includes(tool.id) ? 40 : 0
  const category = tool.category === track.primaryCategory ? 18 : 0
  const workflow = track.workflow.some((item) => text.includes(normalize(item))) ? 12 : 0
  const keyword = track.keywords.some((item) => text.includes(normalize(item)) || goalText.includes(normalize(item))) ? 10 : 0
  const easy = tool.stage <= 1 ? 12 : tool.stage <= 3 ? 9 : 5
  const featured = tool.featured ? 8 : 0
  const rank = Math.min(10, Math.max(0, Math.round(tool.rank / 10)))
  return Math.min(100, direct + category + workflow + keyword + easy + featured + rank)
}

export function recommendToolsForGoal(goal: string, limit = 6): ToolRecommendationPlan {
  const track = pickTrack(goal)
  const scored = tools
    .map((tool) => ({
      tool,
      role: track.roles[tool.id] || (tool.category === track.primaryCategory ? track.workflow[0] : "辅助工具"),
      reason: track.reasons[tool.id] || `和「${track.shortTitle}」的 ${track.workflow.slice(0, 3).join("、")} 流程有关，可以作为备选。`,
      score: scoreTool(tool, track, goal),
    }))
    .filter((item) => item.score >= 45)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)

  return {
    title: `${track.shortTitle}工具组合`,
    shortTitle: track.shortTitle,
    goal,
    workflow: track.workflow,
    tools: scored,
    skills: recommendSkillsForGoal(goal, 3).recommendations,
    primaryCategory: track.primaryCategory,
  }
}
