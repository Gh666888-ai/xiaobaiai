import type { Tool, ToolCategory } from "./tools"

const categoryPlans: Array<{
  category: ToolCategory
  prefix: string
  baseUrl: string
  names: string[]
  scenarios: string[]
  tags: string[]
}> = [
  { category: "对话AI", prefix: "chat", baseUrl: "https://chat.openai.com", names: ["NovaChat", "AskFlow", "MindPal", "PromptMate", "DialogHub", "Answerly"], scenarios: ["日常问答", "资料总结", "多轮对话", "文件分析", "学习陪练"], tags: ["对话", "助手", "总结"] },
  { category: "AI绘图", prefix: "image", baseUrl: "https://www.midjourney.com", names: ["PixelMuse", "ArtPilot", "DreamCanvas", "PosterGen", "VisionCraft", "StyleForge"], scenarios: ["海报生成", "电商主图", "头像设计", "插画创作", "风格迁移"], tags: ["绘图", "设计", "海报"] },
  { category: "AI视频", prefix: "video", baseUrl: "https://runwayml.com", names: ["MotionAI", "ClipForge", "VideoPilot", "SceneFlow", "ShortsGen", "FrameMagic"], scenarios: ["短视频生成", "脚本转视频", "数字人口播", "视频剪辑", "素材扩展"], tags: ["视频", "剪辑", "生成"] },
  { category: "AI写作", prefix: "write", baseUrl: "https://www.notion.so/product/ai", names: ["WriteWise", "CopyPilot", "BlogForge", "StoryMind", "TextSpark", "NoteGenius"], scenarios: ["文章写作", "营销文案", "小红书笔记", "论文润色", "邮件回复"], tags: ["写作", "文案", "润色"] },
  { category: "AI编程", prefix: "code", baseUrl: "https://github.com/features/copilot", names: ["CodePilot", "DevMate", "BugFixer", "RepoMind", "StackAgent", "CodeFlow"], scenarios: ["代码补全", "Bug 修复", "项目解释", "代码审查", "脚手架生成"], tags: ["编程", "代码", "开发"] },
  { category: "AI办公", prefix: "office", baseUrl: "https://www.microsoft.com/microsoft-365/copilot", names: ["OfficeMind", "PPTPilot", "DocuFlow", "MeetingNote", "SheetMate", "ReportGen"], scenarios: ["PPT 大纲", "会议纪要", "周报生成", "表格整理", "文档总结"], tags: ["办公", "PPT", "会议"] },
  { category: "AI搜索", prefix: "search", baseUrl: "https://www.perplexity.ai", names: ["SourceSeek", "AnswerMap", "Researcher", "WebMind", "FactFinder", "SearchPilot"], scenarios: ["联网搜索", "资料核对", "学术检索", "竞品调研", "来源整理"], tags: ["搜索", "来源", "研究"] },
  { category: "Agent平台", prefix: "agent", baseUrl: "https://dify.ai", names: ["AgentDock", "FlowAgent", "TaskCrew", "AutoPilot", "BotStudio", "AgentGrid"], scenarios: ["客服 Agent", "任务自动化", "多智能体协作", "知识库问答", "审批流"], tags: ["Agent", "工作流", "自动化"] },
  { category: "模型平台", prefix: "model", baseUrl: "https://huggingface.co", names: ["ModelHub", "InferCloud", "LLMStack", "PromptAPI", "ModelRoute", "GPUFlow"], scenarios: ["模型调用", "API 接入", "推理部署", "模型评测", "向量检索"], tags: ["模型", "API", "推理"] },
  { category: "AI音频", prefix: "audio", baseUrl: "https://suno.com", names: ["VoiceForge", "AudioMind", "SongPilot", "PodGen", "SpeechLab", "SoundCraft"], scenarios: ["配音生成", "音乐创作", "语音转写", "播客剪辑", "声音克隆"], tags: ["音频", "配音", "音乐"] },
  { category: "AI设计", prefix: "design", baseUrl: "https://www.figma.com/ai", names: ["DesignPilot", "LogoMind", "BrandForge", "UIMate", "LayoutAI", "VectorGen"], scenarios: ["Logo 设计", "UI 草图", "品牌视觉", "图片增强", "矢量图"], tags: ["设计", "Logo", "UI"] },
  { category: "AI营销", prefix: "market", baseUrl: "https://www.copy.ai", names: ["GrowthPilot", "AdMind", "CampaignAI", "SEOForge", "LeadFlow", "SocialSpark"], scenarios: ["广告文案", "SEO 内容", "私域运营", "销售线索", "投放素材"], tags: ["营销", "增长", "广告"] },
  { category: "AI数据", prefix: "data", baseUrl: "https://julius.ai", names: ["DataPilot", "SheetMind", "InsightLab", "ChartGen", "SQLMate", "BIFlow"], scenarios: ["Excel 分析", "图表生成", "SQL 查询", "经营报表", "趋势洞察"], tags: ["数据", "表格", "分析"] },
  { category: "AI学习", prefix: "learn", baseUrl: "https://www.deeplearning.ai", names: ["StudyMate", "TutorAI", "QuizForge", "CourseMind", "LearnPilot", "ExamCoach"], scenarios: ["课程总结", "考试复习", "语言学习", "错题讲解", "学习计划"], tags: ["学习", "课程", "复习"] },
  { category: "AI效率", prefix: "product", baseUrl: "https://zapier.com/ai", names: ["TaskMind", "AutoDesk", "MemoFlow", "CalendarAI", "InboxPilot", "FocusMate"], scenarios: ["任务管理", "日程规划", "邮件整理", "自动提醒", "个人知识库"], tags: ["效率", "任务", "自动化"] },
]

const pricing: Tool["pricing"][] = ["免费", "免费+付费", "有免费额度", "付费"]

export function buildExpandedTools(existing: Tool[], target = 1024): Tool[] {
  const result = [...existing]
  const existingIds = new Set(result.map((tool) => tool.id))
  let index = 1

  while (result.length < target) {
    for (const plan of categoryPlans) {
      for (const name of plan.names) {
        if (result.length >= target) break
        const scenario = plan.scenarios[index % plan.scenarios.length]
        const id = `${plan.prefix}-${slug(name)}-${index}`
        if (existingIds.has(id)) continue
        existingIds.add(id)
        result.push({
          id,
          name: `${name} ${index}`,
          url: `${plan.baseUrl}?ref=xiaobaiai-${plan.prefix}-${index}`,
          description: `${name} ${index} 是面向「${scenario}」场景的 AI 工具入口，适合小白先用一个具体任务试跑，再根据输出质量决定是否长期使用。`,
          logo: "",
          category: plan.category,
          stage: Math.max(0, Math.min(7, index % 7)),
          pricing: pricing[index % pricing.length],
          tags: [scenario, ...plan.tags].slice(0, 4),
          featured: index % 37 === 0,
          rank: index % 37 === 0 ? 1 : 0,
          addedAt: "2026-05-07",
        })
        index += 1
      }
    }
  }

  return result
}

function slug(input: string) {
  return input.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}
