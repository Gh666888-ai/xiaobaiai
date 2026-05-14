export type LearningLevel = "beginner" | "practice" | "advanced"

export type TutorialItem = {
  id: string
  title: string
  kind: "concept" | "tool" | "practice" | "case" | "check"
  minutes: number
  deliverable: string
  href: string
}

export type MinorSubject = {
  id: string
  title: string
  description: string
  goal: string
  level: LearningLevel
  minutes: number
  prerequisites: string[]
  tutorials: TutorialItem[]
  missions: string[]
}

export type MajorSubject = {
  id: string
  title: string
  subtitle: string
  audience: string
  goal: string
  color: string
  accent: string
  order: number
  subjects: MinorSubject[]
}

export const tutorialKindLabels: Record<TutorialItem["kind"], string> = {
  concept: "概念",
  tool: "工具",
  practice: "练习",
  case: "案例",
  check: "验收",
}

export const levelLabels: Record<LearningLevel, string> = {
  beginner: "入门",
  practice: "实战",
  advanced: "进阶",
}

export const learningCatalog: MajorSubject[] = [
  {
    id: "ai-basics",
    title: "AI 入门基础",
    subtitle: "先搞懂 AI、模型、Agent、工具和工作流分别是什么。",
    audience: "完全新手，不知道从哪里开始的人",
    goal: "1 小时内完成第一个可检查的 AI 输出。",
    color: "#256D85",
    accent: "#E8F3FA",
    order: 1,
    subjects: [
      {
        id: "first-ai-result",
        title: "第一个 AI 成果",
        description: "不先背术语，先用 AI 做出一个能看见、能检查的小结果。",
        goal: "完成一份 6 页 PPT 初稿或一份资料摘要。",
        level: "beginner",
        minutes: 45,
        prerequisites: [],
        tutorials: [
          { id: "what-ai-can-do", title: "AI 能帮你做什么", kind: "concept", minutes: 8, deliverable: "写下 3 个你自己的 AI 用途", href: "/learn/0" },
          { id: "first-prompt", title: "第一次向 AI 提问", kind: "practice", minutes: 12, deliverable: "一条有背景、有目标的问题", href: "/learn/0" },
          { id: "output-check", title: "判断 AI 输出能不能用", kind: "check", minutes: 15, deliverable: "3 条验收标准", href: "/learn/1" },
        ],
        missions: ["ai-ppt-first-deck", "kimi-k26-long-doc"],
      },
      {
        id: "prompt-basics",
        title: "提示词基础",
        description: "学会给背景、给格式、给限制，并让 AI 自检。",
        goal: "写出一条能复用的工作提示词。",
        level: "beginner",
        minutes: 60,
        prerequisites: ["first-ai-result"],
        tutorials: [
          { id: "prompt-context", title: "给 AI 足够背景", kind: "concept", minutes: 12, deliverable: "一段清楚背景", href: "/learn/1" },
          { id: "prompt-format", title: "指定输出格式", kind: "practice", minutes: 15, deliverable: "表格/清单/步骤格式", href: "/learn/1" },
          { id: "prompt-repair", title: "结果差时怎么补救", kind: "check", minutes: 15, deliverable: "一条补救提示词", href: "/missions/ai-ppt-first-deck" },
        ],
        missions: ["ai-ppt-first-deck", "xiaohongshu-ai-content-loop"],
      },
      {
        id: "daily-ai-use",
        title: "AI 日常使用训练",
        description: "不先追工具名，先学会每天用 AI 解决真实小事：问清楚、给材料、要格式、查错误、修结果、存模板。",
        goal: "完成 5 个日常 AI 小任务，并沉淀一套自己能重复使用的提问模板。",
        level: "beginner",
        minutes: 90,
        prerequisites: ["first-ai-result", "prompt-basics"],
        tutorials: [
          { id: "daily-task-list", title: "列出今天能交给 AI 的 5 件小事", kind: "practice", minutes: 15, deliverable: "5 个真实小任务清单", href: "/missions/ai-daily-use-bootcamp" },
          { id: "give-materials", title: "给 AI 材料，而不是让它瞎猜", kind: "practice", minutes: 20, deliverable: "一份材料和背景包", href: "/missions/ai-daily-use-bootcamp" },
          { id: "format-result", title: "要求输出表格、清单或步骤", kind: "tool", minutes: 15, deliverable: "一个结构化结果", href: "/missions/ai-daily-use-bootcamp" },
          { id: "check-and-repair", title: "检查事实、语气和可执行性", kind: "check", minutes: 20, deliverable: "修改前后对比", href: "/missions/ai-daily-use-bootcamp" },
          { id: "save-template", title: "保存自己的常用提问模板", kind: "case", minutes: 20, deliverable: "3 条个人常用模板", href: "/missions/ai-daily-use-bootcamp" },
        ],
        missions: ["ai-daily-use-bootcamp", "ai-context-engineering-pack", "kimi-k26-long-doc"],
      },
      {
        id: "ai-writing-rewrite-training",
        title: "AI 写作和改稿训练",
        description: "从消息、通知、邮件、朋友圈/小红书文案到汇报段落，学会给读者、目的、语气、长度和禁区，让 AI 写完还能改好。",
        goal: "完成 3 类真实文字任务，并沉淀一套自己的写作改稿模板。",
        level: "beginner",
        minutes: 80,
        prerequisites: ["daily-ai-use", "prompt-basics"],
        tutorials: [
          { id: "writing-brief", title: "先写清楚给谁看、想让对方做什么", kind: "practice", minutes: 15, deliverable: "写作任务卡", href: "/missions/ai-writing-rewrite-drill" },
          { id: "first-draft", title: "让 AI 先出一版能改的草稿", kind: "tool", minutes: 15, deliverable: "第一版草稿", href: "/missions/ai-writing-rewrite-drill" },
          { id: "tone-versions", title: "改成简洁、正式、温和三种语气", kind: "practice", minutes: 20, deliverable: "三版对比稿", href: "/missions/ai-writing-rewrite-drill" },
          { id: "reader-check", title: "检查读者是否看得懂、愿意行动", kind: "check", minutes: 15, deliverable: "改稿检查表", href: "/missions/ai-writing-rewrite-drill" },
          { id: "writing-template", title: "保存自己的写作改稿模板", kind: "case", minutes: 15, deliverable: "3 条写作模板", href: "/missions/ai-writing-rewrite-drill" },
        ],
        missions: ["ai-writing-rewrite-drill", "ai-daily-use-bootcamp", "xiaohongshu-ai-content-loop"],
      },
      {
        id: "ai-reading-material-training",
        title: "AI 读资料训练",
        description: "把文章、截图、聊天记录、说明书、合同片段或课程资料交给 AI，学会抽事实、找风险、列行动和标出不确定。",
        goal: "读完一份真实材料，得到事实表、风险表、问题表和行动清单。",
        level: "beginner",
        minutes: 85,
        prerequisites: ["daily-ai-use", "prompt-basics"],
        tutorials: [
          { id: "reading-purpose", title: "先说明为什么读这份资料", kind: "practice", minutes: 12, deliverable: "阅读目标", href: "/missions/ai-reading-material-drill" },
          { id: "material-cleanup", title: "把资料整理成 AI 能读懂的输入", kind: "tool", minutes: 18, deliverable: "资料输入包", href: "/missions/ai-reading-material-drill" },
          { id: "facts-risks", title: "抽事实、风险和待确认问题", kind: "practice", minutes: 25, deliverable: "事实/风险/问题表", href: "/missions/ai-reading-material-drill" },
          { id: "action-list", title: "把资料变成下一步行动", kind: "check", minutes: 15, deliverable: "行动清单", href: "/missions/ai-reading-material-drill" },
          { id: "reading-template", title: "保存读资料模板", kind: "case", minutes: 15, deliverable: "读资料提示词模板", href: "/missions/ai-reading-material-drill" },
        ],
        missions: ["ai-reading-material-drill", "kimi-k26-long-doc", "ai-search-research-brief"],
      },
      {
        id: "ai-decision-helper-training",
        title: "AI 辅助决策训练",
        description: "让 AI 帮你把选择题拆清楚：目标、选项、限制、评价标准、风险、最小试错。AI 负责整理思路，人负责拍板。",
        goal: "完成一次小决策分析，并得到可执行的下一步验证动作。",
        level: "beginner",
        minutes: 75,
        prerequisites: ["daily-ai-use", "ai-reading-material-training"],
        tutorials: [
          { id: "decision-question", title: "把纠结的问题写成一个决策题", kind: "practice", minutes: 12, deliverable: "决策题", href: "/missions/ai-decision-helper-drill" },
          { id: "criteria-table", title: "列出选项、限制和评价标准", kind: "tool", minutes: 18, deliverable: "决策对比表", href: "/missions/ai-decision-helper-drill" },
          { id: "risk-check", title: "检查风险、代价和不可逆部分", kind: "check", minutes: 18, deliverable: "风险清单", href: "/missions/ai-decision-helper-drill" },
          { id: "small-test", title: "设计一个低成本试错动作", kind: "practice", minutes: 15, deliverable: "24 小时验证动作", href: "/missions/ai-decision-helper-drill" },
          { id: "decision-recap", title: "保存个人决策模板", kind: "case", minutes: 12, deliverable: "决策复盘模板", href: "/missions/ai-decision-helper-drill" },
        ],
        missions: ["ai-decision-helper-drill", "ai-daily-use-bootcamp", "ai-reading-material-drill"],
      },
      {
        id: "ai-table-data-cleanup",
        title: "AI 表格和数据整理训练",
        description: "把账单、名单、订单、客户记录、课程打卡、家庭开支这类乱资料交给 AI，整理成表格、分类、异常和下一步。",
        goal: "完成一份真实数据整理，得到可复制表格、异常清单和下一步处理建议。",
        level: "beginner",
        minutes: 85,
        prerequisites: ["daily-ai-use", "ai-reading-material-training"],
        tutorials: [
          { id: "data-scope", title: "说明这份数据要解决什么问题", kind: "practice", minutes: 12, deliverable: "数据整理目标", href: "/missions/ai-table-data-cleanup-drill" },
          { id: "paste-data", title: "把乱资料整理成 AI 能处理的输入", kind: "tool", minutes: 18, deliverable: "原始数据包", href: "/missions/ai-table-data-cleanup-drill" },
          { id: "make-table", title: "输出标准表格和分类字段", kind: "practice", minutes: 20, deliverable: "结构化表格", href: "/missions/ai-table-data-cleanup-drill" },
          { id: "find-abnormal", title: "找重复、缺失、异常和待确认", kind: "check", minutes: 20, deliverable: "异常检查表", href: "/missions/ai-table-data-cleanup-drill" },
          { id: "data-template", title: "保存自己的数据整理模板", kind: "case", minutes: 15, deliverable: "表格整理模板", href: "/missions/ai-table-data-cleanup-drill" },
        ],
        missions: ["ai-table-data-cleanup-drill", "ai-reading-material-drill", "kimi-k26-long-doc"],
      },
      {
        id: "ai-life-management",
        title: "AI 生活管理训练",
        description: "把家庭安排、旅行计划、亲子学习、健康习惯、个人财务和日程拆成 AI 能辅助的小任务，让生活少一点混乱。",
        goal: "做出一张 7 天生活管理卡，包含任务、材料、提醒、检查和复盘。",
        level: "beginner",
        minutes: 80,
        prerequisites: ["daily-ai-use", "ai-decision-helper-training"],
        tutorials: [
          { id: "life-area", title: "选一个最混乱的生活场景", kind: "practice", minutes: 12, deliverable: "生活场景卡", href: "/missions/ai-life-management-drill" },
          { id: "life-materials", title: "整理时间、预算、家人需求和限制", kind: "tool", minutes: 18, deliverable: "生活材料包", href: "/missions/ai-life-management-drill" },
          { id: "seven-day-card", title: "生成 7 天可执行安排", kind: "practice", minutes: 20, deliverable: "7 天行动卡", href: "/missions/ai-life-management-drill" },
          { id: "family-check", title: "检查是否现实、是否影响家人", kind: "check", minutes: 15, deliverable: "生活可行性检查", href: "/missions/ai-life-management-drill" },
          { id: "life-review", title: "保存生活管理复盘模板", kind: "case", minutes: 15, deliverable: "每日复盘模板", href: "/missions/ai-life-management-drill" },
        ],
        missions: ["ai-life-management-drill", "ai-decision-helper-drill", "ai-daily-use-bootcamp"],
      },
      {
        id: "ai-learning-coach",
        title: "AI 学习陪练训练",
        description: "让 AI 帮你学一个知识点：先讲懂，再出题，再讲错题，再做复习表，而不是只问一个概念。",
        goal: "学完一个小知识点，得到讲解、练习题、错题解释和 3 天复习表。",
        level: "beginner",
        minutes: 90,
        prerequisites: ["daily-ai-use", "ai-reading-material-training"],
        tutorials: [
          { id: "learning-goal", title: "把学习目标缩小到一个知识点", kind: "practice", minutes: 12, deliverable: "学习目标卡", href: "/missions/ai-learning-coach-drill" },
          { id: "simple-explain", title: "让 AI 用例子讲懂第一遍", kind: "tool", minutes: 18, deliverable: "通俗讲解", href: "/missions/ai-learning-coach-drill" },
          { id: "quiz-me", title: "让 AI 出题检查你是不是真懂", kind: "practice", minutes: 20, deliverable: "练习题和答案", href: "/missions/ai-learning-coach-drill" },
          { id: "wrong-answer", title: "把错题讲到你能复述", kind: "check", minutes: 20, deliverable: "错题解释", href: "/missions/ai-learning-coach-drill" },
          { id: "review-plan", title: "生成 3 天复习表", kind: "case", minutes: 20, deliverable: "复习计划", href: "/missions/ai-learning-coach-drill" },
        ],
        missions: ["ai-learning-coach-drill", "ai-reading-material-drill", "ai-daily-use-bootcamp"],
      },
      {
        id: "ai-map",
        title: "AI 生态地图",
        description: "分清模型、Agent、平台、工具和自动化，不再被名词绕晕。",
        goal: "能判断一个工具到底属于哪类，适合做什么。",
        level: "beginner",
        minutes: 50,
        prerequisites: [],
        tutorials: [
          { id: "model-agent-tool", title: "模型、Agent、工具的区别", kind: "concept", minutes: 18, deliverable: "一张分类笔记", href: "/models" },
          { id: "platform-workflow", title: "平台和工作流是什么", kind: "concept", minutes: 15, deliverable: "知道 Dify、n8n 分别解决什么", href: "/learn/4" },
          { id: "choose-first-tool", title: "新手先选哪个工具", kind: "check", minutes: 12, deliverable: "一条工具选择理由", href: "/choose-tool" },
        ],
        missions: ["ai-ppt-first-deck", "dify-knowledge-base-bot"],
      },
    ],
  },
  {
    id: "office-productivity",
    title: "办公提效",
    subtitle: "把 PPT、长文档、会议纪要、表格整理变成可交付结果。",
    audience: "职场人、学生、行政、运营、汇报场景用户",
    goal: "完成一个能拿去修改或汇报的办公成果。",
    color: "#1F8A70",
    accent: "#EAF7F1",
    order: 2,
    subjects: [
      {
        id: "ppt-report",
        title: "PPT 与汇报",
        description: "从主题、听众、结构到演讲备注，先做可检查的初稿。",
        goal: "完成 6 页 PPT 初稿，并知道哪些页要补数据。",
        level: "practice",
        minutes: 75,
        prerequisites: ["first-ai-result"],
        tutorials: [
          { id: "ppt-brief", title: "写清楚汇报目标", kind: "practice", minutes: 12, deliverable: "汇报目标句", href: "/missions/ai-ppt-first-deck" },
          { id: "ppt-outline", title: "生成 6 页结构", kind: "tool", minutes: 20, deliverable: "PPT 大纲", href: "/missions/ai-ppt-first-deck" },
          { id: "ppt-review", title: "验收 PPT 初稿", kind: "check", minutes: 15, deliverable: "修改清单", href: "/missions/ai-ppt-first-deck" },
        ],
        missions: ["ai-ppt-first-deck"],
      },
      {
        id: "long-doc",
        title: "长文档分析",
        description: "让 AI 读资料，输出事实、风险、待确认问题和行动清单。",
        goal: "得到一份结构化摘要和下一步行动。",
        level: "practice",
        minutes: 60,
        prerequisites: ["prompt-basics"],
        tutorials: [
          { id: "doc-upload", title: "上传并说明任务", kind: "tool", minutes: 10, deliverable: "上传成功的资料", href: "/missions/kimi-k26-long-doc" },
          { id: "doc-facts", title: "抽事实和风险", kind: "practice", minutes: 20, deliverable: "事实/风险清单", href: "/missions/kimi-k26-long-doc" },
          { id: "doc-action", title: "整理行动清单", kind: "check", minutes: 15, deliverable: "可执行下一步", href: "/missions/kimi-k26-long-doc" },
        ],
        missions: ["kimi-k26-long-doc"],
      },
      {
        id: "meeting-docs",
        title: "会议与日常文档",
        description: "把会议记录、周报、邮件、简历和方案草稿做成稳定模板。",
        goal: "沉淀一个可复用的日常办公模板。",
        level: "practice",
        minutes: 70,
        prerequisites: ["prompt-basics"],
        tutorials: [
          { id: "meeting-summary", title: "会议纪要结构", kind: "practice", minutes: 18, deliverable: "会议纪要模板", href: "/tools" },
          { id: "weekly-report", title: "周报和日报", kind: "practice", minutes: 18, deliverable: "周报草稿", href: "/workflows" },
          { id: "email-rewrite", title: "邮件和沟通话术", kind: "case", minutes: 12, deliverable: "一封可发送邮件", href: "/learn/1" },
        ],
        missions: ["n8n-ai-news-automation"],
      },
    ],
  },
  {
    id: "content-creation",
    title: "内容创作",
    subtitle: "从选题、脚本、图文、分镜到发布前检查。",
    audience: "自媒体、短视频、图文、小说和漫画创作者",
    goal: "完成一个能发布或继续打磨的内容样稿。",
    color: "#8B5CF6",
    accent: "#F3ECFF",
    order: 3,
    subjects: [
      {
        id: "xiaohongshu",
        title: "图文内容流水线",
        description: "先做选题、正文、配图提示词和发布前检查。",
        goal: "完成一条小红书图文草稿。",
        level: "practice",
        minutes: 75,
        prerequisites: ["prompt-basics"],
        tutorials: [
          { id: "topic-angle", title: "选题和角度", kind: "practice", minutes: 15, deliverable: "3 个选题角度", href: "/missions/xiaohongshu-ai-content-loop" },
          { id: "post-draft", title: "正文草稿", kind: "tool", minutes: 20, deliverable: "图文正文", href: "/missions/xiaohongshu-ai-content-loop" },
          { id: "publish-check", title: "发布前检查", kind: "check", minutes: 15, deliverable: "修改清单", href: "/missions/xiaohongshu-ai-content-loop" },
        ],
        missions: ["xiaohongshu-ai-content-loop"],
      },
      {
        id: "comic-video",
        title: "漫画与短视频分镜",
        description: "先跑通 60 秒样片或一章样稿，再扩展成系列。",
        goal: "完成分镜、角色、台词或样章审稿。",
        level: "practice",
        minutes: 90,
        prerequisites: ["first-ai-result"],
        tutorials: [
          { id: "story-brief", title: "故事简报", kind: "concept", minutes: 15, deliverable: "故事一句话", href: "/missions/ai-comic-video-first-episode" },
          { id: "shot-list", title: "分镜清单", kind: "practice", minutes: 25, deliverable: "8-12 个镜头", href: "/missions/ai-comic-video-first-episode" },
          { id: "visual-prompt", title: "镜头级提示词", kind: "tool", minutes: 25, deliverable: "角色、场景和分段视频提示词", href: "/missions/ai-comic-video-first-episode" },
        ],
        missions: ["ai-comic-video-first-episode"],
      },
      {
        id: "novel-writing",
        title: "网文与长内容",
        description: "用 AI 辅助设定、大纲、章节、伏笔和改稿，不让内容散掉。",
        goal: "得到一套能继续连载的设定和章节计划。",
        level: "advanced",
        minutes: 120,
        prerequisites: ["prompt-basics"],
        tutorials: [
          { id: "novel-bible", title: "项目圣经", kind: "practice", minutes: 30, deliverable: "题材、人设、爽点", href: "/community" },
          { id: "chapter-outline", title: "章节细纲", kind: "practice", minutes: 30, deliverable: "下一批章节细纲", href: "/community" },
          { id: "batch-review", title: "批次检查", kind: "check", minutes: 20, deliverable: "节奏和伏笔检查", href: "/community" },
        ],
        missions: ["xiaohongshu-ai-content-loop"],
      },
    ],
  },
  {
    id: "agent-coding",
    title: "AI 编程与 Agent",
    subtitle: "从安装 Agent 到让它读项目、改小功能、跑验证。",
    audience: "想让 AI 真正操作项目和电脑的人",
    goal: "让 Agent 完成一个小改动，并能验收结果。",
    color: "#334155",
    accent: "#EEF2F6",
    order: 4,
    subjects: [
      {
        id: "agent-concepts",
        title: "认识 Agent",
        description: "分清聊天模型、编程 Agent、桌面 Agent、平台型 Agent。",
        goal: "知道 Codex、Claude Code、OpenClaw、Dify、n8n 分别适合什么。",
        level: "beginner",
        minutes: 50,
        prerequisites: ["ai-map"],
        tutorials: [
          { id: "agent-vs-model", title: "Agent 和模型的区别", kind: "concept", minutes: 15, deliverable: "一张分类卡", href: "/models" },
          { id: "agent-boundary", title: "Agent 的权限边界", kind: "check", minutes: 15, deliverable: "禁止事项清单", href: "/agent" },
          { id: "agent-first-task", title: "第一个 Agent 小任务", kind: "practice", minutes: 20, deliverable: "小任务描述", href: "/missions/codex-small-feature" },
        ],
        missions: ["codex-small-feature"],
      },
      {
        id: "install-agent",
        title: "安装 Agent 工具",
        description: "安装 OpenClaw、Codex、Claude Code 或 Cline，先跑通一个小样例。",
        goal: "Agent 能读文件、跑命令或返回结果。",
        level: "practice",
        minutes: 90,
        prerequisites: ["agent-concepts"],
        tutorials: [
          { id: "install-openclaw", title: "安装 OpenClaw", kind: "tool", minutes: 25, deliverable: "本地 Agent 可用", href: "/agent-install" },
          { id: "install-codex", title: "安装 Codex / Claude Code", kind: "tool", minutes: 25, deliverable: "能打开项目", href: "/agent-install" },
          { id: "agent-sanity", title: "安装后验证", kind: "check", minutes: 15, deliverable: "验证命令结果", href: "/missions/agent-skill-first-install" },
        ],
        missions: ["agent-skill-first-install"],
      },
      {
        id: "small-code-change",
        title: "让 Agent 改一个小功能",
        description: "限定文件、看 diff、跑检查，别让 Agent 一次改太多。",
        goal: "完成一个小 diff，并知道如何验证。",
        level: "advanced",
        minutes: 90,
        prerequisites: ["install-agent"],
        tutorials: [
          { id: "scope-task", title: "限定修改范围", kind: "check", minutes: 15, deliverable: "任务边界", href: "/missions/codex-small-feature" },
          { id: "read-diff", title: "看懂 diff", kind: "practice", minutes: 20, deliverable: "风险点清单", href: "/missions/codex-small-feature" },
          { id: "verify-change", title: "跑验证", kind: "check", minutes: 20, deliverable: "构建/测试结果", href: "/missions/codex-small-feature" },
        ],
        missions: ["codex-small-feature"],
      },
    ],
  },
  {
    id: "automation",
    title: "自动化工作流",
    subtitle: "用 n8n、Webhook、定时任务和消息通知串起重复工作。",
    audience: "想让 AI 定时跑流程、汇总资料、发通知的人",
    goal: "跑通一个带触发、处理、通知、日志的流程。",
    color: "#D97706",
    accent: "#FFF7E6",
    order: 5,
    subjects: [
      {
        id: "n8n-basics",
        title: "n8n 基础",
        description: "先分清触发器、节点、输入输出和失败重试。",
        goal: "搭一个能手动运行的三步流程。",
        level: "practice",
        minutes: 70,
        prerequisites: ["prompt-basics"],
        tutorials: [
          { id: "workflow-shape", title: "工作流长什么样", kind: "concept", minutes: 12, deliverable: "三步流程图", href: "/workflows" },
          { id: "first-n8n-flow", title: "第一个 n8n 流程", kind: "tool", minutes: 30, deliverable: "可运行流程", href: "/missions/n8n-ai-news-automation" },
          { id: "workflow-log", title: "记录日志和失败", kind: "check", minutes: 15, deliverable: "失败处理规则", href: "/workflows" },
        ],
        missions: ["n8n-ai-news-automation"],
      },
      {
        id: "daily-report",
        title: "日报与信息流",
        description: "定时抓取、AI 摘要、人工确认、飞书/微信通知。",
        goal: "完成一个资讯或日报通知流。",
        level: "practice",
        minutes: 90,
        prerequisites: ["n8n-basics"],
        tutorials: [
          { id: "source-list", title: "选择信息源", kind: "practice", minutes: 15, deliverable: "信息源清单", href: "/missions/n8n-ai-news-automation" },
          { id: "summary-node", title: "AI 摘要节点", kind: "tool", minutes: 25, deliverable: "摘要结果", href: "/missions/n8n-ai-news-automation" },
          { id: "send-notice", title: "发送通知", kind: "check", minutes: 20, deliverable: "通知记录", href: "/workflows" },
        ],
        missions: ["n8n-ai-news-automation"],
      },
      {
        id: "human-review",
        title: "人工确认边界",
        description: "区分哪些步骤可以自动，哪些步骤必须人工确认。",
        goal: "给流程加上风险停顿点。",
        level: "advanced",
        minutes: 60,
        prerequisites: ["n8n-basics"],
        tutorials: [
          { id: "risk-points", title: "找风险点", kind: "check", minutes: 15, deliverable: "风险清单", href: "/workflows" },
          { id: "approval-step", title: "人工审批步骤", kind: "practice", minutes: 20, deliverable: "确认节点", href: "/workflows" },
          { id: "handoff", title: "转人工说明", kind: "case", minutes: 15, deliverable: "转人工话术", href: "/workflows" },
        ],
        missions: ["n8n-ai-news-automation"],
      },
    ],
  },
  {
    id: "business-ai",
    title: "企业知识库与客服",
    subtitle: "从 FAQ、知识库、客服 Bot 到 SOP 自动化。",
    audience: "公司团队、门店、客服、销售和运营负责人",
    goal: "做出一个可测试的知识库 Bot 或流程助手。",
    color: "#0F766E",
    accent: "#E7F7F4",
    order: 6,
    subjects: [
      {
        id: "faq-bot",
        title: "FAQ 客服 Bot",
        description: "先整理 FAQ，再接知识库，最后用刁钻问题测试。",
        goal: "得到一个能回答 10 个问题的客服 Bot。",
        level: "practice",
        minutes: 100,
        prerequisites: ["long-doc"],
        tutorials: [
          { id: "faq-source", title: "整理 FAQ 来源", kind: "practice", minutes: 20, deliverable: "FAQ 表格", href: "/missions/dify-knowledge-base-bot" },
          { id: "dify-kb", title: "接入 Dify 知识库", kind: "tool", minutes: 35, deliverable: "知识库应用", href: "/missions/dify-knowledge-base-bot" },
          { id: "bot-test", title: "测试问题集", kind: "check", minutes: 25, deliverable: "10 个测试问题", href: "/missions/dify-knowledge-base-bot" },
        ],
        missions: ["dify-knowledge-base-bot"],
      },
      {
        id: "sop-agent",
        title: "SOP 与团队流程",
        description: "把重复工作拆成输入、动作、输出和人工确认点。",
        goal: "沉淀一份团队可交接的 SOP。",
        level: "advanced",
        minutes: 100,
        prerequisites: ["human-review"],
        tutorials: [
          { id: "sop-map", title: "拆 SOP 三列", kind: "practice", minutes: 25, deliverable: "输入/动作/输出表", href: "/agent" },
          { id: "review-point", title: "设人工确认点", kind: "check", minutes: 20, deliverable: "确认点清单", href: "/workflows" },
          { id: "team-handoff", title: "团队交接模板", kind: "case", minutes: 20, deliverable: "交接说明", href: "/community/new" },
        ],
        missions: ["dify-knowledge-base-bot", "n8n-ai-news-automation"],
      },
    ],
  },
]

learningCatalog.find((major) => major.id === "ai-basics")?.subjects.push(
  {
    id: "current-ai-workbench",
    title: "2026 AI 工作台",
    description: "把 ChatGPT Projects、Tasks、Canvas、Deep Research、agent mode 和文件连接器放到一个清晰用法里。",
    goal: "知道什么时候用聊天、什么时候用项目、什么时候让 AI 做研究或执行任务。",
    level: "beginner",
    minutes: 80,
    prerequisites: ["first-ai-result"],
    tutorials: [
      { id: "chatgpt-projects", title: "用 Projects 管一组资料和目标", kind: "tool", minutes: 18, deliverable: "一个个人或团队项目空间", href: "/learn/0" },
      { id: "deep-research", title: "用 Deep Research 做资料初筛", kind: "practice", minutes: 25, deliverable: "一份带来源的研究提纲", href: "/missions/kimi-k26-long-doc" },
      { id: "task-canvas-agent", title: "区分 Tasks、Canvas 和 agent mode", kind: "check", minutes: 20, deliverable: "一张场景选择表", href: "/choose-tool" },
    ],
    missions: ["kimi-k26-long-doc", "industry-skill-stack-plan"],
  },
  {
    id: "learning-method",
    title: "AI 学习方法",
    description: "不靠收藏教程堆数量，而是用目标、样稿、验收、复盘来学。",
    goal: "为自己写出一条 7 天学习路线，并能判断下一步该学什么。",
    level: "beginner",
    minutes: 60,
    prerequisites: ["first-ai-result"],
    tutorials: [
      { id: "goal-to-roadmap", title: "把目标拆成学习路线", kind: "practice", minutes: 18, deliverable: "7 天学习计划", href: "/missions/industry-skill-stack-plan" },
      { id: "sample-first", title: "先做样稿再补知识", kind: "case", minutes: 15, deliverable: "一个可展示样稿", href: "/missions/ai-ppt-first-deck" },
      { id: "review-loop", title: "复盘错误并更新下一课", kind: "check", minutes: 15, deliverable: "错误和修正清单", href: "/learn/map" },
    ],
    missions: ["industry-skill-stack-plan", "ai-ppt-first-deck"],
  },
)

learningCatalog.find((major) => major.id === "ai-basics")?.subjects.push(
  {
    id: "ai-capability-map",
    title: "AI 能力全景图",
    description: "把万象 AI 实验室的能力分类转成小白能看懂的地图：对话、写作、绘画、视频、声音、办公、设计、Coding、智能体、提示词、大模型、通用硬技能、数字人和项目孵化。",
    goal: "知道自己现在该学哪一类能力，不再被一堆工具名带着跑。",
    level: "beginner",
    minutes: 70,
    prerequisites: ["first-ai-result"],
    tutorials: [
      { id: "capability-layers", title: "15 类 AI 能力分别解决什么问题", kind: "concept", minutes: 20, deliverable: "AI 能力分类表", href: "/missions/ai-capability-map-plan" },
      { id: "capability-route", title: "个人、团队、创作者分别先学哪条线", kind: "check", minutes: 20, deliverable: "个人学习优先级", href: "/missions/ai-capability-map-plan" },
      { id: "capability-project", title: "把能力分类变成一个项目", kind: "practice", minutes: 25, deliverable: "一个 14 天项目路线", href: "/missions/ai-capability-map-plan" },
    ],
    missions: ["ai-capability-map-plan", "ai-ppt-first-deck", "industry-skill-stack-plan"],
  },
)

learningCatalog.find((major) => major.id === "ai-basics")?.subjects.push(
  {
    id: "prompt-context-engineering",
    title: "提示词与上下文工程",
    description: "把 AIGC 创意猎人、WaytoAGI、JourneyASI 反复强调的提示工程和上下文工程，转成普通人能复用的材料包、约束、角色、验收和修复流程。",
    goal: "做出一套自己的上下文材料包，让 AI 在写方案、做研究、写代码、做客服或做内容时少乱编、少跑偏。",
    level: "practice",
    minutes: 120,
    prerequisites: ["prompt-basics", "ai-map"],
    tutorials: [
      { id: "context-package", title: "整理任务上下文材料包", kind: "practice", minutes: 25, deliverable: "目标、背景、资料、限制、输出格式", href: "/missions/ai-context-engineering-pack" },
      { id: "role-boundary", title: "设置角色、边界和禁止事项", kind: "check", minutes: 20, deliverable: "AI 不能乱做的清单", href: "/missions/ai-context-engineering-pack" },
      { id: "rubric-output", title: "给 AI 一张验收评分表", kind: "practice", minutes: 25, deliverable: "输出评分 Rubric", href: "/missions/ai-context-engineering-pack" },
      { id: "repair-loop", title: "结果跑偏后的二次修复", kind: "case", minutes: 25, deliverable: "修复提示词和前后对比", href: "/missions/ai-context-engineering-pack" },
    ],
    missions: ["ai-context-engineering-pack", "ai-source-to-course-update", "ai-ppt-first-deck"],
  },
  {
    id: "ai-search-research",
    title: "AI 搜索与研究判断",
    description: "把 AI 搜索、Deep Research、研报、论文、产品库和资讯源，变成一套能查证来源、对比观点、形成行动建议的研究方法。",
    goal: "完成一份带来源、带风险、带行动建议的 AI 研究简报，而不是只拿一段 AI 摘要。",
    level: "advanced",
    minutes: 125,
    prerequisites: ["prompt-context-engineering", "ai-source-digestion"],
    tutorials: [
      { id: "research-question", title: "把问题问成可研究问题", kind: "practice", minutes: 20, deliverable: "研究问题和边界", href: "/missions/ai-search-research-brief" },
      { id: "source-triangulation", title: "用多来源交叉验证", kind: "check", minutes: 30, deliverable: "来源对比表", href: "/missions/ai-search-research-brief" },
      { id: "claim-evidence-risk", title: "区分观点、证据和风险", kind: "practice", minutes: 30, deliverable: "观点证据风险表", href: "/missions/ai-search-research-brief" },
      { id: "action-brief", title: "写成能行动的研究简报", kind: "case", minutes: 25, deliverable: "一页行动简报", href: "/missions/ai-search-research-brief" },
    ],
    missions: ["ai-search-research-brief", "ai-frontier-radar-weekly", "ai-source-to-course-update"],
  },
  {
    id: "ai-frontier-radar",
    title: "AI 前沿雷达",
    description: "把 JourneyASI 里的最新动态、研究报告、产品数据、法规、比赛、证书和资源库，变成普通人也能用的前沿判断方法。",
    goal: "每周能判断一个 AI 新方向值不值得学、试、做项目或暂时忽略。",
    level: "advanced",
    minutes: 120,
    prerequisites: ["ai-capability-map"],
    tutorials: [
      { id: "frontier-source-list", title: "建立可信信息源清单", kind: "practice", minutes: 25, deliverable: "研究报告、资讯、产品数据、法规来源表", href: "/missions/ai-frontier-radar-weekly" },
      { id: "trend-evaluation", title: "用 5 个问题判断一个新方向", kind: "check", minutes: 25, deliverable: "趋势判断表", href: "/missions/ai-frontier-radar-weekly" },
      { id: "competition-portfolio", title: "把比赛、证书和作品集连起来", kind: "case", minutes: 25, deliverable: "学习证明和作品集路线", href: "/missions/ai-frontier-radar-weekly" },
      { id: "law-risk-note", title: "看懂 AI 法规和风险边界", kind: "check", minutes: 25, deliverable: "法规和安全提醒卡", href: "/missions/ai-frontier-radar-weekly" },
    ],
    missions: ["ai-frontier-radar-weekly", "ai-capability-map-plan", "n8n-ai-news-automation"],
  },
  {
    id: "ai-source-digestion",
    title: "AI 知识源正文拆解",
    description: "把飞书知识库、AI 资讯、产品库、论文、研报、视频和案例正文读懂，抽出方法、流程、坑点和可落地任务，再纳入小白AI学习系统。",
    goal: "拿到一篇或一个知识库链接后，能产出一张知识点拆解表、一条学习分支建议和一个 MVP 任务草案。",
    level: "advanced",
    minutes: 130,
    prerequisites: ["ai-frontier-radar"],
    tutorials: [
      { id: "source-read-body", title: "先读正文，不只看目录", kind: "practice", minutes: 25, deliverable: "正文知识点摘录表", href: "/missions/ai-source-to-course-update" },
      { id: "source-classify", title: "把知识点分成概念、流程、工具、案例和风险", kind: "check", minutes: 25, deliverable: "五类知识点分类表", href: "/missions/ai-source-to-course-update" },
      { id: "source-map-course", title: "映射到小白AI大科目和小科目", kind: "practice", minutes: 30, deliverable: "学习系统归类建议", href: "/missions/ai-source-to-course-update" },
      { id: "source-mvp-task", title: "把正文方法变成 MVP 任务", kind: "case", minutes: 30, deliverable: "教程和任务草案", href: "/missions/ai-source-to-course-update" },
      { id: "source-verify-update", title: "检查是否有抄目录、假深度和重复内容", kind: "check", minutes: 20, deliverable: "更新前验收清单", href: "/missions/ai-source-to-course-update" },
    ],
    missions: ["ai-source-to-course-update", "ai-frontier-radar-weekly", "ai-knowledge-qa-mvp"],
  },
  {
    id: "embodied-spatial-ai-primer",
    title: "具身智能与空间计算",
    description: "把 AIGC 创意猎人和 WaytoAGI 里的具身智能、AI 硬件、空间计算、VR 和世界模型，转成普通人能理解的前沿机会判断。",
    goal: "能判断一个机器人、AI 硬件或空间计算方向现在适合学习、观察、体验还是做项目。",
    level: "advanced",
    minutes: 110,
    prerequisites: ["ai-frontier-radar"],
    tutorials: [
      { id: "embodied-ai-map", title: "分清具身智能、AI 硬件和世界模型", kind: "concept", minutes: 25, deliverable: "前沿概念对照表", href: "/missions/embodied-ai-opportunity-map" },
      { id: "spatial-use-case", title: "找到空间计算和 VR 的真实场景", kind: "practice", minutes: 25, deliverable: "3 个可体验场景", href: "/missions/embodied-ai-opportunity-map" },
      { id: "hardware-opportunity", title: "判断硬件方向是否适合自己", kind: "check", minutes: 25, deliverable: "学习/体验/观察决策表", href: "/missions/embodied-ai-opportunity-map" },
      { id: "future-risk-note", title: "写清成本、安全和落地边界", kind: "check", minutes: 20, deliverable: "风险边界卡", href: "/missions/embodied-ai-opportunity-map" },
    ],
    missions: ["embodied-ai-opportunity-map", "ai-frontier-radar-weekly"],
  },
)

learningCatalog.find((major) => major.id === "office-productivity")?.subjects.push(
  {
    id: "spreadsheet-data",
    title: "表格与数据整理",
    description: "把杂乱数据、名单、流水、问卷和销售记录整理成能分析、能汇报的表。",
    goal: "完成一次数据清洗、分类、摘要和图表建议。",
    level: "practice",
    minutes: 90,
    prerequisites: ["prompt-basics"],
    tutorials: [
      { id: "data-clean-brief", title: "说明数据字段和目标", kind: "practice", minutes: 15, deliverable: "数据处理说明", href: "/learn/1" },
      { id: "table-classify", title: "分类、去重和补字段", kind: "tool", minutes: 25, deliverable: "清洗后的表格", href: "/tools" },
      { id: "chart-insight", title: "让 AI 提图表和结论", kind: "check", minutes: 20, deliverable: "3 条可汇报结论", href: "/missions/ai-ppt-first-deck" },
    ],
    missions: ["ai-ppt-first-deck", "kimi-k26-long-doc"],
  },
  {
    id: "personal-knowledge-base",
    title: "个人资料库",
    description: "把常用资料、简历、作品、客户问题、学习笔记整理成可反复调用的资料库。",
    goal: "搭出一个个人知识资料夹，并写出调用规则。",
    level: "practice",
    minutes: 85,
    prerequisites: ["long-doc"],
    tutorials: [
      { id: "kb-folder", title: "整理资料文件夹", kind: "practice", minutes: 20, deliverable: "资料分类目录", href: "/missions/kimi-k26-long-doc" },
      { id: "kb-summary", title: "给每类资料写摘要", kind: "practice", minutes: 25, deliverable: "资料摘要卡", href: "/learn/1" },
      { id: "kb-reuse", title: "把资料用于简历、方案和报价", kind: "case", minutes: 25, deliverable: "一个复用样稿", href: "/missions/industry-skill-stack-plan" },
    ],
    missions: ["kimi-k26-long-doc", "industry-skill-stack-plan"],
  },
)

learningCatalog.find((major) => major.id === "office-productivity")?.subjects.push(
  {
    id: "general-ai-hard-skills",
    title: "AI 通用硬技能",
    description: "补齐每个 AI 学习者都需要的底层操作：文件整理、截图标注、表格清洗、资料检索、隐私脱敏、版本记录和发布复盘。",
    goal: "形成一套不会被工具变化淘汰的 AI 基础操作能力。",
    level: "beginner",
    minutes: 95,
    prerequisites: ["learning-method"],
    tutorials: [
      { id: "file-input-output", title: "整理输入文件和输出版本", kind: "practice", minutes: 20, deliverable: "文件命名和版本规则", href: "/missions/ai-capability-map-plan" },
      { id: "screenshot-evidence", title: "截图、标注和证据留存", kind: "practice", minutes: 20, deliverable: "一份截图证据包", href: "/missions/ai-capability-map-plan" },
      { id: "privacy-redaction", title: "隐私脱敏和发布边界", kind: "check", minutes: 20, deliverable: "脱敏检查表", href: "/missions/ai-capability-map-plan" },
      { id: "publish-recap", title: "每次输出都沉淀复盘", kind: "case", minutes: 20, deliverable: "复盘模板", href: "/community/new" },
    ],
    missions: ["ai-capability-map-plan", "kimi-k26-long-doc", "n8n-ai-news-automation"],
  },
)

learningCatalog.find((major) => major.id === "content-creation")?.subjects.push(
  {
    id: "image-video-tools",
    title: "图像与视频工具链",
    description: "从文案、参考图、分镜、生成图、剪辑到发布检查，建立稳定的小作品流程。",
    goal: "完成一套能复用的图像或短视频生成流程。",
    level: "practice",
    minutes: 110,
    prerequisites: ["comic-video"],
    tutorials: [
      { id: "reference-board", title: "建立参考图和风格板", kind: "practice", minutes: 20, deliverable: "风格参考板", href: "/missions/ai-comic-video-first-episode" },
      { id: "image-prompt-system", title: "写角色和场景提示词", kind: "tool", minutes: 25, deliverable: "角色/场景提示词", href: "/missions/ai-comic-video-first-episode" },
      { id: "video-publish-check", title: "发布前检查一致性", kind: "check", minutes: 20, deliverable: "一致性检查表", href: "/missions/ai-comic-video-first-episode" },
    ],
    missions: ["ai-comic-video-first-episode"],
  },
  {
    id: "solo-content-business",
    title: "个人内容变现准备",
    description: "面向个人在家、副业、接单，把作品、报价、交付边界和复盘流程准备好。",
    goal: "做出一个能展示、能报价、能继续迭代的个人作品包。",
    level: "advanced",
    minutes: 180,
    prerequisites: ["xiaohongshu"],
    tutorials: [
      { id: "portfolio-package", title: "作品包和案例页", kind: "case", minutes: 30, deliverable: "作品包结构", href: "/community" },
      { id: "offer-scope", title: "报价和交付边界", kind: "practice", minutes: 25, deliverable: "服务说明草稿", href: "/missions/industry-skill-stack-plan" },
      { id: "client-review-loop", title: "客户反馈和二次修改", kind: "check", minutes: 25, deliverable: "修改记录模板", href: "/learn/map" },
    ],
    missions: ["industry-skill-stack-plan", "xiaohongshu-ai-content-loop"],
  },
)

learningCatalog.find((major) => major.id === "content-creation")?.subjects.push(
  {
    id: "ai-design-brand-assets",
    title: "AI 设计与品牌物料",
    description: "把 AI 设计能力从绘图里拆出来：海报、封面、课程页、产品图、活动视觉、品牌模板和多尺寸发布物料。",
    goal: "做出一套能用于个人品牌、课程、社群活动或产品展示的设计物料包。",
    level: "practice",
    minutes: 120,
    prerequisites: ["image-video-tools"],
    tutorials: [
      { id: "brand-visual-kit", title: "确定品牌视觉基准", kind: "practice", minutes: 25, deliverable: "色彩、字体、风格参考板", href: "/missions/ai-design-brand-kit" },
      { id: "poster-cover-set", title: "做封面、海报和活动图", kind: "tool", minutes: 35, deliverable: "3 张关键视觉物料", href: "/missions/ai-design-brand-kit" },
      { id: "multi-size-export", title: "一套内容适配多平台尺寸", kind: "practice", minutes: 25, deliverable: "多尺寸导出清单", href: "/missions/ai-design-brand-kit" },
      { id: "design-review", title: "检查可读性、版权和一致性", kind: "check", minutes: 20, deliverable: "发布前设计检查表", href: "/missions/ai-design-brand-kit" },
    ],
    missions: ["ai-design-brand-kit", "ai-article-skill-publish", "comfyui-visual-asset-mvp"],
  },
  {
    id: "ai-music-3d-world-model",
    title: "AI 音乐、3D 与世界模型",
    description: "把 WaytoAGI 和 AIGC 创意猎人里的 AI 音乐、AI 三维、AI 世界模型方向，拆成内容创作者能先做出来的声音、空间和概念样片。",
    goal: "完成一个 30 秒声音/3D/空间概念 Demo，并知道它适合短视频、课程、游戏原型还是品牌展示。",
    level: "practice",
    minutes: 135,
    prerequisites: ["image-video-tools"],
    tutorials: [
      { id: "music-brief", title: "确定音乐和声音用途", kind: "practice", minutes: 25, deliverable: "BGM、音效或主题曲需求卡", href: "/missions/ai-music-3d-demo" },
      { id: "three-d-scene", title: "做一个 3D 或空间概念场景", kind: "tool", minutes: 35, deliverable: "场景描述、参考图和镜头走位", href: "/missions/ai-music-3d-demo" },
      { id: "world-model-story", title: "把世界模型变成可讲的故事", kind: "case", minutes: 30, deliverable: "30 秒概念样片脚本", href: "/missions/ai-music-3d-demo" },
      { id: "audio-visual-check", title: "检查版权、节奏和发布渠道", kind: "check", minutes: 25, deliverable: "发布检查表", href: "/missions/ai-music-3d-demo" },
    ],
    missions: ["ai-music-3d-demo", "ai-comic-video-first-episode", "ai-design-brand-kit"],
  },
)

learningCatalog.find((major) => major.id === "content-creation")?.subjects.push(
  {
    id: "digital-human-voice-design",
    title: "数字人与声音设计",
    description: "把万象 AI 实验室里的声音、数字人、设计、视频能力，拆成普通人能做的头像、口播、配音、封面和短视频展示。",
    goal: "完成一个能用于课程、产品介绍、知识分享或社群活动的数字人/声音展示 MVP。",
    level: "practice",
    minutes: 140,
    prerequisites: ["image-video-tools", "article-skill-publishing"],
    tutorials: [
      { id: "digital-human-scenario", title: "先选数字人应用场景", kind: "practice", minutes: 25, deliverable: "课程口播、产品介绍、活动预告或客服讲解脚本", href: "/missions/ai-digital-human-demo" },
      { id: "voice-script", title: "写配音脚本和口播节奏", kind: "practice", minutes: 30, deliverable: "60 秒口播脚本和停顿标记", href: "/missions/ai-digital-human-demo" },
      { id: "avatar-visual", title: "准备头像、封面和背景视觉", kind: "tool", minutes: 30, deliverable: "头像参考、封面图、背景板", href: "/missions/ai-digital-human-demo" },
      { id: "digital-human-check", title: "检查口型、版权和可信边界", kind: "check", minutes: 25, deliverable: "发布前检查表", href: "/missions/ai-digital-human-demo" },
    ],
    missions: ["ai-digital-human-demo", "comfyui-visual-asset-mvp", "ai-article-skill-publish"],
  },
)

learningCatalog.find((major) => major.id === "content-creation")?.subjects.push(
  {
    id: "comfyui-visual-asset-mvp",
    title: "ComfyUI 视觉资产 MVP",
    description: "把 Work-Fisher 知识库里的 ComfyUI、开源模型、图像质感、角色场景资产和短剧分镜方向，拆成小白能跑的本地视觉资产流程。",
    goal: "做出一套角色、场景、封面、分镜或短剧素材包，并知道显存、模型、工作流和发布检查怎么处理。",
    level: "advanced",
    minutes: 180,
    prerequisites: ["image-video-tools"],
    tutorials: [
      { id: "comfyui-first-run", title: "30 分钟跑通 ComfyUI 第一次出图", kind: "tool", minutes: 35, deliverable: "一张可保存的本地生成图", href: "/missions/comfyui-visual-asset-mvp" },
      { id: "visual-model-choice", title: "选择图像、视频、修图或口型同步模型", kind: "check", minutes: 25, deliverable: "模型用途和硬件要求表", href: "/missions/comfyui-visual-asset-mvp" },
      { id: "character-scene-pack", title: "做角色和场景资产包", kind: "practice", minutes: 40, deliverable: "角色卡、场景卡、风格参考板", href: "/missions/comfyui-visual-asset-mvp" },
      { id: "short-drama-board", title: "从小说到短剧分镜", kind: "case", minutes: 35, deliverable: "8 镜头短剧分镜和提示词", href: "/missions/comfyui-visual-asset-mvp" },
    ],
    missions: ["comfyui-visual-asset-mvp", "ai-comic-video-first-episode", "ai-article-skill-publish"],
  },
  {
    id: "article-skill-publishing",
    title: "图文发布 Skill 工作流",
    description: "把公众号、知识库、案例复盘这类图文内容拆成分析、写稿、配图、排版、预览和发布检查，不再手动到处复制。",
    goal: "做出一条可复用的图文发布流程：从素材到预览，再到复盘。",
    level: "advanced",
    minutes: 130,
    prerequisites: ["xiaohongshu", "image-video-tools"],
    tutorials: [
      { id: "article-source-brief", title: "从一个素材包提炼文章结构", kind: "practice", minutes: 25, deliverable: "标题、读者、观点、证据清单", href: "/missions/ai-article-skill-publish" },
      { id: "article-image-plan", title: "让 AI 生成配图和截图需求", kind: "tool", minutes: 30, deliverable: "封面、段落图、示意图清单", href: "/missions/ai-article-skill-publish" },
      { id: "article-layout-preview", title: "排版预览和发布前检查", kind: "check", minutes: 30, deliverable: "预览截图、错别字、版权和 CTA 检查表", href: "/missions/ai-article-skill-publish" },
    ],
    missions: ["ai-article-skill-publish", "xiaohongshu-ai-content-loop"],
  },
  {
    id: "seedance-video-continuation",
    title: "AI 视频续写与多模态参考",
    description: "围绕 Seedance、即梦、Veo、Sora 这类视频工具，训练参考图、角色一致、镜头续写和发布检查。",
    goal: "完成一套 30-60 秒视频样片方案，并知道怎么保持角色和风格一致。",
    level: "advanced",
    minutes: 140,
    prerequisites: ["hot-ai-video-workflow"],
    tutorials: [
      { id: "video-reference-system", title: "准备参考图和角色设定", kind: "practice", minutes: 30, deliverable: "角色卡、场景卡、风格参考板", href: "/missions/ai-comic-video-first-episode" },
      { id: "video-shot-continuation", title: "镜头续写和动作衔接", kind: "tool", minutes: 35, deliverable: "5 个连续镜头提示词", href: "/missions/ai-comic-video-first-episode" },
      { id: "video-quality-repair", title: "画面崩坏时怎么修", kind: "check", minutes: 25, deliverable: "一致性、节奏、版权三类修复清单", href: "/missions/ai-comic-video-first-episode" },
    ],
    missions: ["ai-comic-video-first-episode", "ai-article-skill-publish"],
  },
)

learningCatalog.find((major) => major.id === "agent-coding")?.subjects.push(
  {
    id: "claude-code-codex-workflow",
    title: "Claude Code / Codex 项目协作",
    description: "从安装、第三方模型、权限、diff、hooks、skills、插件、子智能体到项目 MVP，建立一套能复用的工程 Agent 工作法。",
    goal: "完成一次可回滚的小功能修改，并把项目规则、验收和下一步任务留下来。",
    level: "advanced",
    minutes: 180,
    prerequisites: ["small-code-change"],
    tutorials: [
      { id: "claude-install-model", title: "安装并接入第三方模型", kind: "tool", minutes: 30, deliverable: "能启动并中文回复", href: "/agent-install/claude-code" },
      { id: "agent-brief", title: "给 Agent 写清楚任务边界", kind: "practice", minutes: 20, deliverable: "任务说明", href: "/missions/codex-small-feature" },
      { id: "agent-memory-hooks", title: "理解 CLAUDE.md、权限和 hooks", kind: "concept", minutes: 30, deliverable: "项目协作规则", href: "/agent-install/claude-code" },
      { id: "skills-plugins-subagents", title: "Skills、插件和子智能体", kind: "tool", minutes: 35, deliverable: "能力分工表", href: "/agent-install/claude-code" },
      { id: "agent-review", title: "复核 diff、测试和提交说明", kind: "check", minutes: 25, deliverable: "验证和风险清单", href: "/missions/codex-small-feature" },
    ],
    missions: ["codex-small-feature", "claude-code-deepseek-project"],
  },
  {
    id: "claude-code-mvp",
    title: "Claude Code 做一个 AI 网页 MVP",
    description: "把长视频里常见的最终项目拆成小白能跟的流程：需求、页面、模型接入、验证、复盘，而不是只看 AI 自动写代码。",
    goal: "做出一个可打开、可测试、有环境变量说明的 AI 小网页。",
    level: "advanced",
    minutes: 210,
    prerequisites: ["claude-code-codex-workflow"],
    tutorials: [
      { id: "mvp-brief", title: "写 MVP 需求和不做清单", kind: "practice", minutes: 25, deliverable: "一页需求说明", href: "/agent-install/claude-code" },
      { id: "mvp-build", title: "分阶段让 Agent 实现", kind: "practice", minutes: 60, deliverable: "可运行页面", href: "/missions/claude-code-deepseek-project" },
      { id: "mvp-api", title: "接入 DeepSeek / MiniMax API", kind: "tool", minutes: 35, deliverable: "环境变量配置", href: "/agent-install/claude-code" },
      { id: "mvp-verify", title: "浏览器验收和错误修复", kind: "check", minutes: 35, deliverable: "测试记录", href: "/missions/codex-small-feature" },
      { id: "mvp-readme", title: "沉淀 README 和项目规则", kind: "case", minutes: 25, deliverable: "README / CLAUDE.md 草稿", href: "/agent-install/claude-code" },
    ],
    missions: ["claude-code-deepseek-project", "codex-small-feature"],
  },
  {
    id: "agent-builder-sdk",
    title: "Agent Builder 与 SDK",
    description: "理解工具调用、handoff、guardrails、trace 和会话状态，给以后企业 Agent 打基础。",
    goal: "能画出一个有工具、有边界、有人工确认的 Agent 流程图。",
    level: "advanced",
    minutes: 130,
    prerequisites: ["agent-concepts"],
    tutorials: [
      { id: "tool-calling", title: "工具调用和权限边界", kind: "concept", minutes: 25, deliverable: "工具权限表", href: "/agent" },
      { id: "handoff-guardrails", title: "handoff、guardrails 和人工确认", kind: "check", minutes: 30, deliverable: "风险控制图", href: "/workflows" },
      { id: "trace-session", title: "会话状态和运行追踪", kind: "practice", minutes: 25, deliverable: "运行日志说明", href: "/missions/dify-knowledge-base-bot" },
    ],
    missions: ["dify-knowledge-base-bot", "n8n-ai-news-automation"],
  },
)

learningCatalog.find((major) => major.id === "automation")?.subjects.push(
  {
    id: "zapier-make-ai-actions",
    title: "Zapier / Make / AI Actions",
    description: "不用一开始写代码，先把表单、表格、邮件、CRM 和 AI 摘要串起来。",
    goal: "设计一个个人或团队都能看懂的自动化动作链。",
    level: "practice",
    minutes: 95,
    prerequisites: ["n8n-basics"],
    tutorials: [
      { id: "trigger-action-map", title: "触发器和动作表", kind: "concept", minutes: 18, deliverable: "触发/动作清单", href: "/workflows" },
      { id: "ai-action-draft", title: "AI 摘要、分类和回复草稿", kind: "practice", minutes: 25, deliverable: "AI 动作节点设计", href: "/missions/n8n-ai-news-automation" },
      { id: "automation-cost-risk", title: "成本、权限和误发风险", kind: "check", minutes: 20, deliverable: "上线检查表", href: "/workflows" },
    ],
    missions: ["n8n-ai-news-automation", "industry-skill-stack-plan"],
  },
)

learningCatalog.find((major) => major.id === "business-ai")?.subjects.push(
  {
    id: "team-ai-governance",
    title: "团队 AI 使用规范",
    description: "企业不是每个人随便试工具，而是要定义资料权限、可用场景、禁用场景和验收标准。",
    goal: "形成一页团队 AI 使用规范和上线检查表。",
    level: "advanced",
    minutes: 100,
    prerequisites: ["sop-agent"],
    tutorials: [
      { id: "team-use-policy", title: "允许和禁止的 AI 场景", kind: "check", minutes: 25, deliverable: "AI 使用边界", href: "/missions/industry-skill-stack-plan" },
      { id: "data-permission", title: "资料权限和脱敏规则", kind: "practice", minutes: 25, deliverable: "资料分级表", href: "/missions/dify-knowledge-base-bot" },
      { id: "acceptance-rubric", title: "团队验收标准", kind: "check", minutes: 20, deliverable: "验收评分表", href: "/workflows" },
    ],
    missions: ["industry-skill-stack-plan", "dify-knowledge-base-bot"],
  },
  {
    id: "sales-service-agent",
    title: "销售与服务 Agent",
    description: "把客户问题、产品资料、话术、跟进提醒和转人工边界合成一个团队助手。",
    goal: "设计一个可测试的销售/客服 Agent 原型。",
    level: "advanced",
    minutes: 120,
    prerequisites: ["faq-bot"],
    tutorials: [
      { id: "sales-source", title: "整理客户问题和产品资料", kind: "practice", minutes: 25, deliverable: "资料来源表", href: "/missions/dify-knowledge-base-bot" },
      { id: "service-script", title: "话术、跟进和转人工", kind: "case", minutes: 30, deliverable: "服务流程脚本", href: "/missions/dify-knowledge-base-bot" },
      { id: "agent-eval", title: "用测试问题评估 Agent", kind: "check", minutes: 25, deliverable: "测试问题和评分", href: "/missions/dify-knowledge-base-bot" },
    ],
    missions: ["dify-knowledge-base-bot", "n8n-ai-news-automation"],
  },
)

function industrySubject(
  id: string,
  title: string,
  description: string,
  goal: string,
  firstDeliverable: string,
  secondDeliverable: string,
  thirdDeliverable: string,
  missions: string[] = ["industry-skill-stack-plan", "dify-knowledge-base-bot", "n8n-ai-news-automation"],
): MinorSubject {
  return {
    id,
    title,
    description,
    goal,
    level: "advanced",
    minutes: 120,
    prerequisites: ["current-ai-workbench", "sop-agent"],
    tutorials: [
      {
        id: `${id}-diagnosis`,
        title: `${title}：业务链路诊断`,
        kind: "practice",
        minutes: 30,
        deliverable: `${firstDeliverable}：列出获客、咨询、交付、复购、管理五个环节的卡点`,
        href: "",
      },
      {
        id: `${id}-data`,
        title: `${title}：资料和知识库整理`,
        kind: "case",
        minutes: 35,
        deliverable: `${title}常见问题、服务资料、案例素材、SOP 和禁用表达清单`,
        href: "",
      },
      {
        id: `${id}-workflow`,
        title: `${title}：AI 提效流程设计`,
        kind: "practice",
        minutes: 40,
        deliverable: `${secondDeliverable}：明确谁输入、AI 处理什么、人工复核什么、结果发给谁`,
        href: "",
      },
      {
        id: `${id}-customer`,
        title: `${title}：客户沟通和交付模板`,
        kind: "tool",
        minutes: 35,
        deliverable: "获客文案、咨询话术、交付说明、复购提醒和异常处理模板",
        href: "",
      },
      {
        id: `${id}-growth`,
        title: `${title}：变现或赋能动作`,
        kind: "check",
        minutes: 40,
        deliverable: `${thirdDeliverable}：选 1 个能本周落地的提效、获客、复购或交付动作`,
        href: "",
      },
    ],
    missions,
  }
}

learningCatalog.push({
  id: "industry-playbooks",
  title: "行业 AI 落地",
  subtitle: "面向具体行业，把 AI 用到获客、客服、内容、交付、管理和复购里。",
  audience: "企业老板、团队负责人、门店经营者、自由职业者和准备做行业解决方案的人",
  goal: "至少掌握 20 个行业的 AI 提效、赋能和变现落地方式。",
  color: "#B45309",
  accent: "#FFF3D6",
  order: 7,
  subjects: [
    industrySubject(
      "restaurant-store",
      "餐饮与门店",
      "菜单设计、团购文案、私域复购、差评处理、员工 SOP 和门店日报。",
      "做出一套门店 AI 提效方案，能用于内容获客、员工培训和复购提醒。",
      "门店经营问题清单",
      "菜单/团购/私域内容流程",
      "复购提醒和差评处理模板",
      ["xiaohongshu-ai-content-loop", "n8n-ai-news-automation"],
    ),
    industrySubject(
      "local-service",
      "本地生活服务",
      "家政、维修、搬家、摄影、婚庆等服务行业的获客、报价和交付标准化。",
      "把服务说明、报价、客户沟通和售后复盘做成标准流程。",
      "服务项目和客群表",
      "报价与沟通话术流程",
      "售后复盘和转介绍动作",
      ["industry-skill-stack-plan", "xiaohongshu-ai-content-loop"],
    ),
    industrySubject(
      "ecommerce",
      "电商运营",
      "选品、标题、详情页、客服问答、评价分析、直播脚本和活动复盘。",
      "搭建从商品资料到内容、客服、复盘的电商 AI 工作流。",
      "商品资料和用户痛点表",
      "标题/详情页/客服知识库",
      "活动复盘和下次优化清单",
    ),
    industrySubject(
      "cross-border-ecommerce",
      "跨境电商",
      "多语言 Listing、竞品调研、客服邮件、平台规则摘要和广告素材迭代。",
      "做出一套跨境商品上架和客服提效流程。",
      "目标市场和竞品摘要",
      "多语言 Listing 与客服邮件库",
      "广告素材测试计划",
      ["kimi-k26-long-doc", "dify-knowledge-base-bot"],
    ),
    industrySubject(
      "education-training",
      "教育培训",
      "课程大纲、讲义、作业、测评、家长沟通和学习进度跟踪。",
      "把一门课拆成可交付、可测评、可复购的 AI 教学系统。",
      "课程对象和能力目标表",
      "讲义/作业/测评流程",
      "学习报告和续班沟通模板",
      ["ai-ppt-first-deck", "industry-skill-stack-plan"],
    ),
    industrySubject(
      "knowledge-commerce",
      "知识付费与课程",
      "选题、课程脚本、直播转课、社群答疑、作业点评和转化页。",
      "完成一个从内容种草到课程转化的小闭环。",
      "课程卖点和用户问题清单",
      "直播/短视频/社群内容流程",
      "转化页和答疑模板",
      ["xiaohongshu-ai-content-loop", "ai-ppt-first-deck"],
    ),
    industrySubject(
      "real-estate",
      "房产中介",
      "房源卖点、客户画像、带看话术、政策资料摘要和跟进提醒。",
      "把房源资料转成获客内容、带看脚本和客户跟进系统。",
      "房源和客户需求表",
      "房源文案与带看话术",
      "跟进提醒和成交复盘",
    ),
    industrySubject(
      "property-community",
      "物业与社区",
      "通知公告、报修分类、业主问答、巡检记录和服务满意度分析。",
      "做一个物业服务知识库和报修分流流程。",
      "常见问题和报修类型表",
      "业主问答知识库",
      "巡检日报和满意度复盘",
    ),
    industrySubject(
      "manufacturing",
      "制造工厂",
      "生产 SOP、质检记录、设备巡检、异常报告、培训资料和订单跟踪。",
      "把一条重复流程改造成可培训、可追踪、可复盘的 AI 辅助流程。",
      "工序和异常问题清单",
      "SOP/质检/巡检知识库",
      "异常报告和改善建议模板",
      ["kimi-k26-long-doc", "n8n-ai-news-automation"],
    ),
    industrySubject(
      "wholesale-retail",
      "批发与零售",
      "商品陈列、库存提醒、导购话术、会员运营、促销内容和销售复盘。",
      "搭建门店或批发业务的导购、库存和会员运营 AI 流程。",
      "商品和会员分层表",
      "导购话术和促销内容流程",
      "库存预警和销售复盘模板",
    ),
    industrySubject(
      "beauty-medical-aesthetic",
      "美业与医美",
      "项目介绍、客户咨询、术前术后提醒、案例内容和合规边界。",
      "把咨询、案例内容和客户跟进做成谨慎可控的服务流程。",
      "服务项目和禁用表达清单",
      "咨询话术和案例内容流程",
      "回访提醒和风险确认表",
      ["xiaohongshu-ai-content-loop", "dify-knowledge-base-bot"],
    ),
    industrySubject(
      "fitness-wellness",
      "健身与康养",
      "课程计划、会员跟进、饮食运动记录、私教内容和复购提醒。",
      "做出会员分层、课程推荐和复购跟进流程。",
      "会员目标和训练记录表",
      "课程建议和沟通话术",
      "复购提醒和进度报告模板",
    ),
    industrySubject(
      "auto-sales-service",
      "汽车销售与维修",
      "车型资料、客户咨询、维修记录、保养提醒、短视频内容和报价说明。",
      "搭建汽车销售或维修门店的客户问答与复购提醒流程。",
      "车型/服务/客户问题表",
      "销售问答和维修说明知识库",
      "保养提醒和客户回访模板",
    ),
    industrySubject(
      "logistics-warehouse",
      "物流与仓储",
      "订单异常、路线说明、仓库 SOP、客户通知和数据日报。",
      "把异常处理、客户通知和日报变成半自动流程。",
      "异常类型和处理规则表",
      "通知话术和 SOP 知识库",
      "日报摘要和风险预警模板",
      ["n8n-ai-news-automation", "dify-knowledge-base-bot"],
    ),
    industrySubject(
      "hotel-tourism",
      "酒店与旅游",
      "行程规划、客房问答、点评回复、活动推荐、前台 SOP 和复购营销。",
      "做出酒店/旅游业务的问答、推荐和点评运营流程。",
      "客户场景和常见问题表",
      "行程/房型/活动推荐流程",
      "点评回复和复购内容模板",
      ["xiaohongshu-ai-content-loop", "dify-knowledge-base-bot"],
    ),
    industrySubject(
      "legal-service",
      "法律与合规服务",
      "合同初筛、资料清单、客户问答、案例整理和风险提示，强调人工复核。",
      "做一个只做辅助整理、不替代专业判断的法律服务 AI 流程。",
      "资料清单和风险边界",
      "合同要点和客户问答整理",
      "人工复核和风险提示模板",
      ["kimi-k26-long-doc", "industry-skill-stack-plan"],
    ),
    industrySubject(
      "finance-accounting",
      "财税与会计",
      "票据资料、报销说明、政策摘要、客户提醒和经营数据解读。",
      "把财税资料整理、客户沟通和经营摘要做成可复核流程。",
      "资料类型和问题清单",
      "政策摘要和客户提醒流程",
      "经营摘要和人工复核表",
      ["kimi-k26-long-doc", "n8n-ai-news-automation"],
    ),
    industrySubject(
      "hr-recruiting",
      "人力资源与招聘",
      "岗位 JD、简历筛选、面试题、候选人沟通、入职培训和员工问答。",
      "搭建招聘和员工服务的 AI 辅助流程。",
      "岗位画像和筛选标准",
      "JD/面试题/沟通话术",
      "入职问答和培训材料",
      ["dify-knowledge-base-bot", "industry-skill-stack-plan"],
    ),
    industrySubject(
      "construction-decoration",
      "建筑装修工程",
      "方案说明、材料清单、施工节点、客户沟通、验收清单和变更记录。",
      "把项目沟通和施工验收做成可追踪的 AI 项目助手。",
      "项目阶段和资料清单",
      "方案说明和施工 SOP",
      "验收清单和变更记录模板",
    ),
    industrySubject(
      "agriculture-food",
      "农业与农产品",
      "农产品卖点、产地故事、种植记录、渠道内容、客户问答和溯源说明。",
      "把农产品资料转成内容获客、渠道销售和客户信任材料。",
      "产品卖点和产地资料表",
      "内容种草和渠道沟通流程",
      "溯源说明和复购提醒模板",
      ["xiaohongshu-ai-content-loop", "industry-skill-stack-plan"],
    ),
    industrySubject(
      "healthcare-service",
      "医疗健康服务",
      "健康科普、预约问答、随访提醒、资料整理和风险边界，必须保留人工确认。",
      "做一个合规谨慎的健康服务问答和随访辅助流程。",
      "服务边界和禁用表达清单",
      "预约问答和科普内容流程",
      "随访提醒和人工确认表",
      ["dify-knowledge-base-bot", "n8n-ai-news-automation"],
    ),
    industrySubject(
      "b2b-sales",
      "B2B 销售与外贸",
      "客户调研、邮件开发、产品资料、会议纪要、跟进提醒和方案草稿。",
      "把 B2B 获客、跟进和方案交付做成销售助手流程。",
      "客户画像和线索清单",
      "开发信/方案/会议纪要流程",
      "跟进提醒和成交复盘模板",
      ["kimi-k26-long-doc", "n8n-ai-news-automation"],
    ),
  ],
})

function personalSubject(
  id: string,
  title: string,
  description: string,
  goal: string,
  firstDeliverable: string,
  secondDeliverable: string,
  thirdDeliverable: string,
  missions: string[] = ["industry-skill-stack-plan", "xiaohongshu-ai-content-loop", "ai-ppt-first-deck"],
): MinorSubject {
  return {
    id,
    title,
    description,
    goal,
    level: "practice",
    minutes: 100,
    prerequisites: ["current-ai-workbench", "learning-method"],
    tutorials: [
      {
        id: `${id}-life-goal`,
        title: "个人目标和现状整理",
        kind: "practice",
        minutes: 25,
        deliverable: firstDeliverable,
        href: "/missions/industry-skill-stack-plan",
      },
      {
        id: `${id}-ai-system`,
        title: "AI 个人工作系统",
        kind: "case",
        minutes: 30,
        deliverable: secondDeliverable,
        href: "/learn/map",
      },
      {
        id: `${id}-visible-change`,
        title: "让生活发生变化的交付物",
        kind: "check",
        minutes: 25,
        deliverable: thirdDeliverable,
        href: "/missions/xiaohongshu-ai-content-loop",
      },
    ],
    missions,
  }
}

learningCatalog.push({
  id: "personal-growth",
  title: "个人成长与一人公司",
  subtitle: "面向个人生活、副业、职业成长和一人公司，把 AI 变成每天能用的能力。",
  audience: "个人在家、自由职业者、创作者、副业接单者、职场人、学生、家庭管理者",
  goal: "让个人看到学习 AI 后能省时间、赚到钱、改善工作和生活质量。",
  color: "#7C3AED",
  accent: "#F4EEFF",
  order: 8,
  subjects: [
    personalSubject(
      "one-person-company",
      "一人公司",
      "一个人完成定位、产品、内容、销售、交付、客服和复盘，不再被琐事拖垮。",
      "搭建一套一人公司的 AI 运营台，让个人能持续产出和交付。",
      "个人能力、资源和产品方向表",
      "内容、销售、交付、客服四件套流程",
      "7 天一人公司执行清单",
      ["industry-skill-stack-plan", "xiaohongshu-ai-content-loop", "n8n-ai-news-automation"],
    ),
    personalSubject(
      "freelance-service",
      "自由职业接单",
      "把技能包装成服务，准备作品、报价、沟通、交付和复购流程。",
      "完成一个可展示、可报价、可交付的个人服务包。",
      "技能和目标客户清单",
      "作品包、报价单和沟通话术",
      "交付验收和复购模板",
      ["industry-skill-stack-plan", "ai-ppt-first-deck"],
    ),
    personalSubject(
      "creator-studio",
      "个人创作者工作室",
      "选题、脚本、图文、短视频、直播、社群和复盘变成稳定内容流水线。",
      "建立每周稳定发布的 AI 内容生产流程。",
      "账号定位和选题池",
      "脚本、封面、发布检查流程",
      "内容复盘和下周选题表",
      ["xiaohongshu-ai-content-loop", "ai-comic-video-first-episode"],
    ),
    personalSubject(
      "home-side-business",
      "居家副业",
      "适合在家做的资料整理、内容制作、课程助教、设计文案和自动化小服务。",
      "找到一个低成本可尝试的居家副业方向，并做出第一份样稿。",
      "时间、设备、技能和风险清单",
      "副业方向筛选和样稿流程",
      "第一周验证和复盘表",
      ["industry-skill-stack-plan", "xiaohongshu-ai-content-loop"],
    ),
    personalSubject(
      "career-upgrade",
      "职场升职加薪",
      "用 AI 提升汇报、方案、会议、数据、沟通和个人影响力。",
      "做出一套能直接用于当前工作的提效工具包。",
      "当前岗位高频任务清单",
      "汇报、方案、会议、数据模板",
      "月度成果和晋升材料",
      ["ai-ppt-first-deck", "kimi-k26-long-doc"],
    ),
    personalSubject(
      "student-learning",
      "学生学习与考试",
      "用 AI 做知识框架、错题分析、阅读摘要、论文资料和项目作品。",
      "让学习从刷资料变成有路线、有反馈、有作品。",
      "课程目标和薄弱点清单",
      "知识地图、错题和复习计划",
      "阶段复盘和作品展示页",
      ["kimi-k26-long-doc", "ai-ppt-first-deck"],
    ),
    personalSubject(
      "family-life-manager",
      "家庭生活管理",
      "用 AI 管理家庭预算、日程、旅行、老人孩子资料、购物和重要提醒。",
      "让家庭杂事从临时想起变成有记录、有提醒、有分工。",
      "家庭事项和资料清单",
      "预算、日程、购物、提醒流程",
      "每周家庭生活复盘表",
      ["n8n-ai-news-automation", "industry-skill-stack-plan"],
    ),
    personalSubject(
      "parent-child-education",
      "亲子教育",
      "根据孩子年龄、兴趣和薄弱点，生成故事、练习、陪伴计划和沟通话术。",
      "做出一份更轻松、更有耐心的亲子陪伴计划。",
      "孩子兴趣和学习状态表",
      "故事、练习和陪伴活动流程",
      "一周亲子反馈和调整表",
      ["kimi-k26-long-doc", "industry-skill-stack-plan"],
    ),
    personalSubject(
      "personal-finance",
      "个人财务整理",
      "整理收入、支出、债务、预算、消费习惯和目标，不做投资承诺，只做记录和决策辅助。",
      "建立能改善生活质量的个人财务看板。",
      "收入支出和目标清单",
      "预算分类和消费复盘流程",
      "下月预算和提醒模板",
      ["kimi-k26-long-doc", "n8n-ai-news-automation"],
    ),
    personalSubject(
      "health-habit",
      "健康习惯管理",
      "管理运动、饮食、睡眠、体检资料和习惯打卡，保留专业医疗边界。",
      "建立一套能坚持的健康习惯记录和提醒系统。",
      "健康目标和限制清单",
      "运动饮食睡眠记录流程",
      "每周习惯复盘和调整表",
      ["industry-skill-stack-plan", "n8n-ai-news-automation"],
    ),
    personalSubject(
      "travel-life-design",
      "旅行与生活规划",
      "让 AI 帮你做预算、路线、攻略、避坑、行李清单和家庭协同。",
      "完成一次更省心、更省钱、更适合自己的旅行计划。",
      "旅行目标、预算和约束表",
      "路线、住宿、交通和避坑流程",
      "行李清单和备用方案",
      ["kimi-k26-long-doc", "ai-ppt-first-deck"],
    ),
    personalSubject(
      "personal-agent",
      "个人 Agent 管家",
      "把固定任务交给自己的 Agent：资料整理、提醒、周报、内容、学习和复盘。",
      "训练一个只做小事但每天能帮忙的个人 Agent。",
      "个人重复任务清单",
      "Agent 技能、边界和提醒流程",
      "一周运行记录和优化清单",
      ["agent-skill-first-install", "codex-small-feature", "n8n-ai-news-automation"],
    ),
  ],
})

const personalGrowth = learningCatalog.find((major) => major.id === "personal-growth")
personalGrowth?.subjects.push(
  {
    id: "api-proxy-side-business",
    title: "API 中转站与多模型接入",
    description: "把 API Key、中转站、模型路由、用量限制和成本记录讲清楚，适合个人在家做自动化、小工具、知识库和一人公司服务。",
    goal: "跑通一个可控成本的多模型工作台，并知道哪些信息不能外泄。",
    level: "practice",
    minutes: 110,
    prerequisites: ["one-person-company", "personal-agent"],
    tutorials: [
      { id: "api-proxy-basics", title: "API Key、中转站和模型路由是什么", kind: "concept", minutes: 25, deliverable: "一张多模型接入图", href: "/news/agent-hot-api-proxy-2026" },
      { id: "api-proxy-first-workbench", title: "用 Chatbox / Cherry Studio 跑通第一个多模型工作台", kind: "tool", minutes: 35, deliverable: "可用的个人 AI 工作台", href: "/news/agent-hot-api-proxy-2026" },
      { id: "api-proxy-cost-safety", title: "成本、限额和密钥安全检查", kind: "check", minutes: 25, deliverable: "用量预算和安全清单", href: "/news/agent-hot-api-proxy-2026" },
    ],
    missions: ["agent-skill-first-install", "n8n-ai-news-automation", "industry-skill-stack-plan"],
  },
)

personalGrowth?.subjects.push(
  {
    id: "opc-super-individual",
    title: "OPC 超级个体系统",
    description: "把飞书知识库里的超级个体思路落到小白能执行的 OPC：一个人也要有定位、产品、内容、交付、复盘和节奏。",
    goal: "7 天内做出一套能展示、能报价、能继续迭代的一人公司最小运营系统。",
    level: "advanced",
    minutes: 160,
    prerequisites: ["one-person-company", "solo-content-business"],
    tutorials: [
      { id: "opc-positioning", title: "确定一个可变现的小定位", kind: "practice", minutes: 30, deliverable: "目标用户、痛点、服务结果三列表", href: "/missions/opc-seven-day-pipeline" },
      { id: "opc-offer", title: "把能力包装成一个服务包", kind: "case", minutes: 35, deliverable: "服务说明、交付边界、报价区间", href: "/missions/opc-seven-day-pipeline" },
      { id: "opc-content-system", title: "一人一支队伍的内容系统", kind: "practice", minutes: 30, deliverable: "7 天选题、脚本、发布和复盘表", href: "/missions/ai-article-skill-publish" },
      { id: "opc-delivery-review", title: "交付和复盘不靠临时发挥", kind: "check", minutes: 25, deliverable: "交付验收表和客户反馈模板", href: "/missions/opc-seven-day-pipeline" },
    ],
    missions: ["opc-seven-day-pipeline", "ai-article-skill-publish", "industry-skill-stack-plan"],
  },
  {
    id: "pipeline-income-system",
    title: "管道收入与复购系统",
    description: "不把变现讲成玄学，而是拆成线索、信任、体验、交付、复购和转介绍，先做最小闭环。",
    goal: "设计一个个人或小团队能跑 14 天的管道收入试验。",
    level: "advanced",
    minutes: 140,
    prerequisites: ["opc-super-individual"],
    tutorials: [
      { id: "pipeline-lead-magnet", title: "设计一个低成本获客入口", kind: "practice", minutes: 25, deliverable: "免费资料、体验服务或诊断表", href: "/missions/opc-seven-day-pipeline" },
      { id: "pipeline-trust-content", title: "用内容建立信任链路", kind: "practice", minutes: 30, deliverable: "3 条信任内容和 1 个案例页结构", href: "/missions/ai-article-skill-publish" },
      { id: "pipeline-delivery", title: "交付后怎么让客户复购", kind: "case", minutes: 30, deliverable: "复购提醒、升级服务和转介绍话术", href: "/missions/opc-seven-day-pipeline" },
      { id: "pipeline-metric", title: "用数字判断要不要继续", kind: "check", minutes: 25, deliverable: "线索、咨询、成交、复购四个指标表", href: "/missions/opc-seven-day-pipeline" },
    ],
    missions: ["opc-seven-day-pipeline", "xiaohongshu-ai-content-loop", "n8n-ai-news-automation"],
  },
  {
    id: "ai-self-management-system",
    title: "AI 高效自我管理",
    description: "把目标、时间、任务、资料、复盘和提醒放进一个个人系统，让 AI 每天帮你减少混乱。",
    goal: "做出一套每天 15 分钟能维护的个人 AI 管理台。",
    level: "practice",
    minutes: 110,
    prerequisites: ["learning-method", "personal-agent"],
    tutorials: [
      { id: "self-goal-board", title: "目标不是愿望，要变成看板", kind: "practice", minutes: 25, deliverable: "本周目标、限制和可见结果", href: "/missions/opc-seven-day-pipeline" },
      { id: "self-daily-review", title: "每日复盘让 AI 帮你找偏差", kind: "check", minutes: 20, deliverable: "每日复盘模板", href: "/missions/n8n-ai-news-automation" },
      { id: "self-reminder-flow", title: "把提醒和资料整理自动化", kind: "tool", minutes: 30, deliverable: "提醒、资料、任务三类工作流", href: "/workflows" },
    ],
    missions: ["opc-seven-day-pipeline", "n8n-ai-news-automation"],
  },
)

personalGrowth?.subjects.push(
  {
    id: "workday-ai-boost",
    title: "职场一天 AI 提效",
    description: "把上班一天拆成资料阅读、沟通写作、会议整理、表格处理和下班复盘，先让 AI 帮你省出 1 小时。",
    goal: "完成一张职场一天 AI 提效卡，能直接用于明天上班。",
    level: "beginner",
    minutes: 90,
    prerequisites: ["ai-writing-rewrite-training", "ai-reading-material-training", "ai-table-data-cleanup"],
    tutorials: [
      { id: "workday-map", title: "画出今天最耗时间的 5 个工作环节", kind: "practice", minutes: 15, deliverable: "工作耗时清单", href: "/missions/workday-ai-boost-plan" },
      { id: "workday-writing", title: "把沟通、邮件、汇报交给 AI 打草稿", kind: "practice", minutes: 20, deliverable: "3 条工作沟通模板", href: "/missions/workday-ai-boost-plan" },
      { id: "workday-reading", title: "让 AI 读资料并输出行动清单", kind: "tool", minutes: 20, deliverable: "资料行动表", href: "/missions/workday-ai-boost-plan" },
      { id: "workday-data", title: "整理表格和待确认事项", kind: "check", minutes: 20, deliverable: "待确认清单", href: "/missions/workday-ai-boost-plan" },
      { id: "workday-review", title: "下班前用 AI 做 5 分钟复盘", kind: "case", minutes: 15, deliverable: "明日优先级", href: "/missions/workday-ai-boost-plan" },
    ],
    missions: ["workday-ai-boost-plan", "ai-writing-rewrite-drill", "ai-table-data-cleanup-drill"],
  },
  {
    id: "student-ai-study-upgrade",
    title: "学生 AI 学习提升",
    description: "把预习、听课资料、错题、背诵、作文和复习计划组合成 AI 学习陪练流程。",
    goal: "做出一份 3 天学习提升计划，包含讲解、练习、错题和复习。",
    level: "beginner",
    minutes: 90,
    prerequisites: ["ai-learning-coach", "ai-reading-material-training"],
    tutorials: [
      { id: "study-goal", title: "选一个最近最想补的知识点", kind: "practice", minutes: 12, deliverable: "学习目标卡", href: "/missions/student-ai-study-upgrade-plan" },
      { id: "study-material", title: "把课本、笔记或错题交给 AI", kind: "tool", minutes: 18, deliverable: "学习资料包", href: "/missions/student-ai-study-upgrade-plan" },
      { id: "study-explain", title: "让 AI 用例子讲懂并出题", kind: "practice", minutes: 25, deliverable: "讲解和练习题", href: "/missions/student-ai-study-upgrade-plan" },
      { id: "study-wrong", title: "把错题讲到能复述", kind: "check", minutes: 20, deliverable: "错题复述", href: "/missions/student-ai-study-upgrade-plan" },
      { id: "study-review", title: "生成 3 天复习表", kind: "case", minutes: 15, deliverable: "复习计划", href: "/missions/student-ai-study-upgrade-plan" },
    ],
    missions: ["student-ai-study-upgrade-plan", "ai-learning-coach-drill", "ai-reading-material-drill"],
  },
  {
    id: "family-ai-household",
    title: "家庭 AI 管理",
    description: "把家庭日程、孩子学习、旅行计划、开支整理、购物清单和家务安排做成可执行生活系统。",
    goal: "做出一张家庭 7 天协作卡，让 AI 帮家庭少一点混乱。",
    level: "beginner",
    minutes: 90,
    prerequisites: ["ai-life-management", "ai-decision-helper-training", "ai-table-data-cleanup"],
    tutorials: [
      { id: "family-scene", title: "选一个家庭最乱的场景", kind: "practice", minutes: 12, deliverable: "家庭场景卡", href: "/missions/family-ai-household-plan" },
      { id: "family-needs", title: "整理家人需求、时间和预算", kind: "tool", minutes: 18, deliverable: "家庭材料包", href: "/missions/family-ai-household-plan" },
      { id: "family-week", title: "生成 7 天家庭行动卡", kind: "practice", minutes: 25, deliverable: "家庭行动卡", href: "/missions/family-ai-household-plan" },
      { id: "family-check", title: "检查是否现实、是否影响家人", kind: "check", minutes: 20, deliverable: "协作检查表", href: "/missions/family-ai-household-plan" },
      { id: "family-review", title: "保存家庭复盘模板", kind: "case", minutes: 15, deliverable: "家庭复盘模板", href: "/missions/family-ai-household-plan" },
    ],
    missions: ["family-ai-household-plan", "ai-life-management-drill", "ai-table-data-cleanup-drill"],
  },
  {
    id: "side-income-content-sprint",
    title: "副业内容输出",
    description: "把个人经历、技能、产品或服务变成 7 天内容输出计划，先做可发布样稿和复盘表。",
    goal: "完成 7 天副业内容计划：选题、草稿、配图需求、发布检查和复盘。",
    level: "practice",
    minutes: 110,
    prerequisites: ["ai-writing-rewrite-training", "home-side-business", "xiaohongshu"],
    tutorials: [
      { id: "side-topic", title: "选一个能吸引目标人群的副业选题", kind: "practice", minutes: 20, deliverable: "7 个选题", href: "/missions/side-income-content-sprint" },
      { id: "side-story", title: "把经历和案例变成内容素材", kind: "practice", minutes: 20, deliverable: "素材卡", href: "/missions/side-income-content-sprint" },
      { id: "side-draft", title: "写出第一条可发布内容", kind: "tool", minutes: 25, deliverable: "内容草稿", href: "/missions/side-income-content-sprint" },
      { id: "side-check", title: "检查标题、事实、转化和风险", kind: "check", minutes: 20, deliverable: "发布检查表", href: "/missions/side-income-content-sprint" },
      { id: "side-review", title: "记录数据并决定下一条", kind: "case", minutes: 15, deliverable: "内容复盘表", href: "/missions/side-income-content-sprint" },
    ],
    missions: ["side-income-content-sprint", "xiaohongshu-ai-content-loop", "ai-writing-rewrite-drill"],
  },
  {
    id: "one-person-company-starter",
    title: "一人公司起步",
    description: "把定位、服务包、报价、内容、客户沟通和交付验收压成 7 天起步计划。",
    goal: "做出一套能展示、能报价、能交付的一人公司起步包。",
    level: "practice",
    minutes: 120,
    prerequisites: ["one-person-company", "ai-decision-helper-training", "ai-writing-rewrite-training"],
    tutorials: [
      { id: "starter-position", title: "确定一个小而清楚的服务定位", kind: "practice", minutes: 20, deliverable: "定位三列表", href: "/missions/one-person-company-starter-plan" },
      { id: "starter-offer", title: "包装一个能报价的服务包", kind: "practice", minutes: 25, deliverable: "服务说明", href: "/missions/one-person-company-starter-plan" },
      { id: "starter-content", title: "写一条信任内容和咨询话术", kind: "tool", minutes: 25, deliverable: "内容和话术", href: "/missions/one-person-company-starter-plan" },
      { id: "starter-delivery", title: "设计交付验收和边界", kind: "check", minutes: 25, deliverable: "交付验收表", href: "/missions/one-person-company-starter-plan" },
      { id: "starter-week", title: "排出 7 天起步动作", kind: "case", minutes: 20, deliverable: "7 天起步计划", href: "/missions/one-person-company-starter-plan" },
    ],
    missions: ["one-person-company-starter-plan", "opc-seven-day-pipeline", "ai-writing-rewrite-drill"],
  },
)

learningCatalog.find((major) => major.id === "agent-coding")?.subjects.push(
  {
    id: "mcp-agent-tools",
    title: "MCP 与工具连接",
    description: "MCP 已经成为 Agent 连接文件、浏览器、数据库、GitHub、飞书和业务系统的热门标准。先学会它解决什么，再决定要不要安装。",
    goal: "能画出一个 Agent 通过 MCP 调用工具的流程，并知道权限边界。",
    level: "advanced",
    minutes: 100,
    prerequisites: ["agent-concepts", "install-agent"],
    tutorials: [
      { id: "mcp-why-hot", title: "为什么 MCP 最近这么火", kind: "concept", minutes: 20, deliverable: "MCP 用途说明卡", href: "/news/mcp-agent-tools-2026" },
      { id: "mcp-first-server", title: "给 Agent 接一个安全的工具服务", kind: "tool", minutes: 35, deliverable: "一个只读工具连接方案", href: "/agent-install" },
      { id: "mcp-permission-review", title: "MCP 权限、注入和审计边界", kind: "check", minutes: 25, deliverable: "工具权限白名单", href: "/news/mcp-agent-tools-2026" },
    ],
    missions: ["agent-skill-first-install", "codex-small-feature"],
  },
)

learningCatalog.find((major) => major.id === "agent-coding")?.subjects.push(
  {
    id: "managed-agents-sessionstore",
    title: "Managed Agents 与 SessionStore",
    description: "把一个大 Agent 拆成主控 Agent 和多个子 Agent：主控负责任务拆解、调度和最终验收，子 Agent 各自用隔离上下文完成研究、审查、测试或资料整理，再把结论交回主控。SessionStore 用来保存计划、子任务、文件、失败原因和下一步，让长任务能继续、能追踪、能复盘。",
    goal: "画出一张多 Agent 协作架构图，并做出一份子 Agent 工作契约和 SessionStore 状态表。",
    level: "advanced",
    minutes: 135,
    prerequisites: ["agent-concepts", "install-agent", "mcp-agent-tools"],
    tutorials: [
      { id: "managed-agents-why", title: "为什么要把一个大任务拆成多个 Agent", kind: "concept", minutes: 22, deliverable: "适合拆分和不适合拆分的任务清单", href: "/tools/Agent平台/claude-managed-agents" },
      { id: "lead-worker-contract", title: "主 Agent 和子 Agent 怎么分工", kind: "practice", minutes: 28, deliverable: "主控/研究/审查/执行四类 Agent 职责表", href: "/skills" },
      { id: "sessionstore-state-table", title: "SessionStore 到底要记什么", kind: "practice", minutes: 30, deliverable: "任务状态、文件、结论、失败原因和下一步表格", href: "/learn/subjects/agent-coding/managed-agents-sessionstore" },
      { id: "shared-filesystem-rules", title: "共享文件区怎么避免互相覆盖", kind: "check", minutes: 25, deliverable: "共享目录命名、写入范围和合并规则", href: "/skills" },
      { id: "human-review-gate", title: "哪些步骤必须留给人验收", kind: "check", minutes: 20, deliverable: "人工确认点和失败回滚清单", href: "/missions/codex-small-feature" },
    ],
    missions: ["agent-skill-first-install", "codex-small-feature", "industry-skill-stack-plan"],
  },
)

learningCatalog.find((major) => major.id === "automation")?.subjects.push(
  {
    id: "agent-gateway-routing",
    title: "AI 网关与 MCP 网关",
    description: "当一个人或团队开始同时用多个模型、多个 Agent 和多个工具时，需要统一路由、限额、日志和权限。",
    goal: "设计一张最小 AI 网关方案图，知道模型调用和工具调用分别怎么管。",
    level: "advanced",
    minutes: 95,
    prerequisites: ["n8n-basics", "human-review"],
    tutorials: [
      { id: "gateway-map", title: "API 网关、AI 网关、MCP 网关分别管什么", kind: "concept", minutes: 25, deliverable: "三层网关对比表", href: "/news/mcp-agent-tools-2026" },
      { id: "model-budget-routing", title: "按任务路由模型和预算", kind: "practice", minutes: 30, deliverable: "模型预算表", href: "/tools" },
      { id: "tool-call-log", title: "记录 Agent 工具调用日志", kind: "check", minutes: 20, deliverable: "工具调用审计清单", href: "/workflows" },
    ],
    missions: ["n8n-ai-news-automation", "industry-skill-stack-plan"],
  },
)

learningCatalog.find((major) => major.id === "content-creation")?.subjects.push(
  {
    id: "hot-ai-video-workflow",
    title: "AI 视频与多模态内容",
    description: "AI 视频、图像编辑、配音、PPT 和脚本正在合成一条内容生产线，适合个人创作者、一人公司和团队培训内容。",
    goal: "完成一个 30-60 秒样片或一套可展示的多模态内容包。",
    level: "practice",
    minutes: 120,
    prerequisites: ["xiaohongshu", "comic-video"],
    tutorials: [
      { id: "video-topic-brief", title: "选题、脚本和分镜先行", kind: "practice", minutes: 25, deliverable: "视频脚本和镜头表", href: "/missions/ai-comic-video-first-episode" },
      { id: "video-tool-chain", title: "Sora、Veo、即梦、可灵怎么分工", kind: "tool", minutes: 30, deliverable: "工具选择表", href: "/tools/AI视频" },
      { id: "video-publish-check", title: "发布前检查版权、画面和转化目标", kind: "check", minutes: 25, deliverable: "发布检查清单", href: "/news/hot-ai-video-2026" },
    ],
    missions: ["ai-comic-video-first-episode", "xiaohongshu-ai-content-loop"],
  },
)

learningCatalog.find((major) => major.id === "business-ai")?.subjects.push(
  {
    id: "searchable-knowledge-qa",
    title: "可问答知识库 MVP",
    description: "把 AIGC 创意猎人和 WaytoAGI 正文里的经验落成小白自己的方法：知识库不是资料堆，而是可搜索、可追溯、可持续更新的学习和服务基础设施。",
    goal: "把一批文档、教程、案例或 FAQ 做成一个能回答问题、能追溯来源、能继续更新的知识问答 MVP。",
    level: "advanced",
    minutes: 150,
    prerequisites: ["faq-bot", "team-ai-governance"],
    tutorials: [
      { id: "qa-source-scope", title: "确定知识库用途和资料边界", kind: "practice", minutes: 30, deliverable: "资料范围和不回答边界", href: "/missions/ai-knowledge-qa-mvp" },
      { id: "qa-content-clean", title: "清洗文档、教程、案例和 FAQ", kind: "practice", minutes: 35, deliverable: "可检索资料包", href: "/missions/ai-knowledge-qa-mvp" },
      { id: "qa-test-questions", title: "用真实问题测试问答质量", kind: "check", minutes: 30, deliverable: "20 个测试问题和评分表", href: "/missions/ai-knowledge-qa-mvp" },
      { id: "qa-update-loop", title: "设计持续更新和人工修正机制", kind: "case", minutes: 25, deliverable: "更新流程和人工确认点", href: "/missions/ai-knowledge-qa-mvp" },
    ],
    missions: ["ai-knowledge-qa-mvp", "dify-knowledge-base-bot", "ai-product-data-review"],
  },
  {
    id: "ai-product-data-analysis",
    title: "AI 产品数据分析",
    description: "把 JourneyASI 的 AI 产品数据分析思路落到企业和个人项目：看访问、转化、留存、成本、用户反馈和功能优先级。",
    goal: "用一张表判断一个 AI 产品、工具页、课程页或活动页下一步该优化哪里。",
    level: "advanced",
    minutes: 120,
    prerequisites: ["spreadsheet-data", "team-ai-governance"],
    tutorials: [
      { id: "product-metric-map", title: "确定产品数据指标", kind: "practice", minutes: 25, deliverable: "访问、转化、留存、成本、反馈指标表", href: "/missions/ai-product-data-review" },
      { id: "feedback-classify", title: "把用户反馈分类成可行动问题", kind: "practice", minutes: 25, deliverable: "反馈分类和优先级", href: "/missions/ai-product-data-review" },
      { id: "experiment-plan", title: "设计一轮小实验", kind: "case", minutes: 30, deliverable: "A/B 或单变量优化计划", href: "/missions/ai-product-data-review" },
      { id: "data-review-report", title: "写成老板能看懂的复盘", kind: "check", minutes: 25, deliverable: "产品数据复盘报告", href: "/missions/ai-product-data-review" },
    ],
    missions: ["ai-product-data-review", "kimi-k26-long-doc", "ai-ppt-first-deck"],
  },
)

learningCatalog.find((major) => major.id === "business-ai")?.subjects.push(
  {
    id: "ai-colearning-incubator",
    title: "AI 领导力与共学孵化",
    description: "吸收 WaytoAGI 的社区业务说明和万象 AI 实验室的共学结构：用晚间共学、以赛代练、组队共创、助教讲师和案例沉淀，把资料变成作品。",
    goal: "设计一个 14 天 AI 共学营或企业训练营：有主题、日历、任务、比赛机制、助教、复盘和项目展示。",
    level: "advanced",
    minutes: 170,
    prerequisites: ["team-ai-governance", "sop-agent"],
    tutorials: [
      { id: "incubator-position", title: "确定共学营主题和人群", kind: "practice", minutes: 25, deliverable: "主题、人群、目标成果三列表", href: "/missions/ai-colearning-incubator" },
      { id: "incubator-calendar", title: "安排活动日历和任务节奏", kind: "practice", minutes: 35, deliverable: "14 天直播、作业、答疑、复盘日历", href: "/missions/ai-colearning-incubator" },
      { id: "incubator-competition", title: "加入以赛代练和组队机制", kind: "case", minutes: 30, deliverable: "比赛题目、组队规则和作品标准", href: "/missions/ai-community-competition-sprint" },
      { id: "incubator-roles", title: "设置助教、讲师、志愿者和项目展示", kind: "case", minutes: 30, deliverable: "社群角色和协作规则", href: "/missions/ai-colearning-incubator" },
      { id: "incubator-review", title: "用项目成果验收共学质量", kind: "check", minutes: 25, deliverable: "项目展示和复盘评分表", href: "/missions/ai-community-competition-sprint" },
    ],
    missions: ["ai-colearning-incubator", "ai-community-competition-sprint", "industry-skill-stack-plan", "dify-knowledge-base-bot"],
  },
  {
    id: "ai-community-business-service",
    title: "AI 社区增长与企业服务",
    description: "把 WaytoAGI 社区业务说明里的知识库、共学活动、创作者孵化、厂商首发、线下活动和企业服务，转成小白AI可执行的增长与商业化方法。",
    goal: "设计一套 AI 社区或企业服务包：内容资产、共学活动、案例沉淀、合作厂商、企业交付和复盘指标都清楚。",
    level: "advanced",
    minutes: 180,
    prerequisites: ["ai-colearning-incubator", "ai-product-data-analysis"],
    tutorials: [
      { id: "community-asset-map", title: "盘点知识库、案例和创作者资产", kind: "practice", minutes: 30, deliverable: "社区资产地图", href: "/missions/ai-community-business-service-pack" },
      { id: "event-growth-loop", title: "设计共学、比赛、直播和线下活动增长闭环", kind: "case", minutes: 35, deliverable: "活动增长飞轮", href: "/missions/ai-community-business-service-pack" },
      { id: "vendor-launch-plan", title: "把厂商首发和产品体验变成合作方案", kind: "practice", minutes: 30, deliverable: "厂商合作和首发策划表", href: "/missions/ai-community-business-service-pack" },
      { id: "enterprise-service-offer", title: "包装企业培训和知识库智能体服务", kind: "case", minutes: 35, deliverable: "企业服务包和报价边界", href: "/missions/ai-community-business-service-pack" },
      { id: "growth-metric-review", title: "用数据复盘社区和服务质量", kind: "check", minutes: 25, deliverable: "增长和交付复盘表", href: "/missions/ai-community-business-service-pack" },
    ],
    missions: ["ai-community-business-service-pack", "ai-colearning-incubator", "ai-product-data-review", "ai-knowledge-qa-mvp"],
  },
)

learningCatalog.find((major) => major.id === "business-ai")?.subjects.push(
  {
    id: "enterprise-agent-pilot",
    title: "企业 Agent 试点",
    description: "企业现在最热的不只是模型，而是把 Agent 放进客服、销售、研发、财务和运营流程里，并保留人工验收。",
    goal: "选出一个两周能验收的企业 Agent MVP。",
    level: "advanced",
    minutes: 120,
    prerequisites: ["faq-bot", "sales-service-agent"],
    tutorials: [
      { id: "agent-pilot-scope", title: "选择一个能验收的流程", kind: "practice", minutes: 30, deliverable: "试点范围说明", href: "/learn/subjects/industry-playbooks" },
      { id: "agent-data-tools", title: "准备数据、工具和人工确认点", kind: "tool", minutes: 35, deliverable: "数据和工具清单", href: "/tools" },
      { id: "agent-roi-review", title: "用省时、准确率和交付质量验收", kind: "check", minutes: 30, deliverable: "企业 Agent 验收表", href: "/member-cases" },
    ],
    missions: ["dify-knowledge-base-bot", "industry-skill-stack-plan", "n8n-ai-news-automation"],
  },
)

export function getMajorSubject(id: string) {
  return learningCatalog.find((subject) => subject.id === id)
}

export function getMinorSubject(majorId: string, minorId: string) {
  const major = getMajorSubject(majorId)
  return major?.subjects.find((subject) => subject.id === minorId)
}

export function getAllMinorSubjects() {
  return learningCatalog.flatMap((major) => major.subjects.map((subject) => ({ major, subject })))
}

export function getTutorial(majorId: string, minorId: string, tutorialId: string) {
  const major = getMajorSubject(majorId)
  const subject = major?.subjects.find((item) => item.id === minorId)
  const tutorial = subject?.tutorials.find((item) => item.id === tutorialId)
  return major && subject && tutorial ? { major, subject, tutorial } : undefined
}

export function getAllTutorials() {
  return learningCatalog.flatMap((major) => (
    major.subjects.flatMap((subject) => (
      subject.tutorials.map((tutorial) => ({ major, subject, tutorial }))
    ))
  ))
}

export function countTutorials(major: MajorSubject) {
  return major.subjects.reduce((sum, subject) => sum + subject.tutorials.length, 0)
}

export function countMissions(major: MajorSubject) {
  return new Set(major.subjects.flatMap((subject) => subject.missions)).size
}
