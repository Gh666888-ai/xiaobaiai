export type MissionStep = {
  title: string
  desc: string
  deliverable: string
  prompt: string
}

export type Mission = {
  id: string
  title: string
  shortTitle: string
  tagline: string
  audience: string
  outcome: string
  whyNow: string
  minutes: string
  stage: string
  xp: number
  badge: string
  difficulty: "新手" | "进阶" | "工程"
  toolIds: string[]
  tags: string[]
  materials: string[]
  steps: MissionStep[]
  recapTemplate: string
  resources: { label: string; href: string }[]
}

export const missions: Mission[] = [
  {
    id: "claude-code-deepseek-project",
    title: "用 Claude Code 接 DeepSeek V4 改一个真实项目",
    shortTitle: "Claude Code + DeepSeek V4",
    tagline: "把国产模型接到工程 Agent 里，先完成一个小 diff。",
    audience: "适合已经有一个项目、想体验 AI 改代码的人。",
    outcome: "跑通配置、让 Agent 阅读项目、改 1 个小功能，并用 build/test 验证。",
    whyNow: "Claude Code / Codex 代表工程 Agent，DeepSeek V4 是高性价比模型后端。这个任务能帮用户理解“Agent 是工具，模型是后端”。",
    minutes: "45-70 分钟",
    stage: "L5 AI 编程与自动化",
    xp: 80,
    badge: "工程 Agent 入门徽章",
    difficulty: "工程",
    toolIds: ["claude-code-agent", "deepseek-v4-api", "codex-agent"],
    tags: ["Agent编程", "DeepSeek V4", "Claude Code", "真实项目"],
    materials: ["一个能本地运行的项目", "DeepSeek API Key", "build/test 命令", "一个很小的体验问题"],
    steps: [
      {
        title: "确认模型和工具边界",
        desc: "先写清楚：Claude Code 是执行工具，DeepSeek V4 是模型后端。不要把模型当成 Agent。",
        deliverable: "一段任务说明：我要让 Claude Code 使用 DeepSeek V4 后端，先读项目，不直接大改。",
        prompt: "你是谨慎的工程 Agent。请先确认当前项目结构和可运行命令，只输出你会读哪些文件、如何验证，不要立刻修改代码。",
      },
      {
        title: "配置 DeepSeek V4 接入",
        desc: "按官方或服务商面板配置 base_url、key 和模型名。先用小命令确认能通。",
        deliverable: "一份已脱敏配置记录：base_url、模型名、测试是否成功。",
        prompt: "请根据我提供的配置和报错，判断 DeepSeek V4 接入失败的原因。重点检查 base_url、token、模型名、网络和环境变量优先级。",
      },
      {
        title: "只让 Agent 读项目并列计划",
        desc: "第一次不要允许它全项目乱改。先让它列出涉及文件和最小改动方案。",
        deliverable: "一个 1-2 个文件范围内的改动计划。",
        prompt: "请阅读这个需求和相关文件，提出一个最小改动方案。限制：最多修改 2 个文件；不要重构；完成后必须说明验证命令。",
      },
      {
        title: "落地一个小 diff 并验证",
        desc: "执行改动后看 git diff，跑 build/test。失败就让 Agent 只修失败点。",
        deliverable: "git diff 摘要 + build/test 结果。",
        prompt: "请基于当前 build/test 报错，只修复与这次改动直接相关的问题。不要扩大改动范围。修完后说明改了什么、为什么改、如何验证。",
      },
      {
        title: "发复盘沉淀经验",
        desc: "把模型名、报错、改动范围和验证结果写成社区复盘，后面的人可以照着避坑。",
        deliverable: "一篇社区复盘：配置、坑点、diff、验证结果、下一步。",
        prompt: "请把我的操作过程整理成一篇社区复盘，结构包括：目标、工具组合、配置方式、踩坑、最终改动、验证结果、给新手的提醒。",
      },
    ],
    recapTemplate:
      "我用 Claude Code 接 DeepSeek V4 改了一个真实项目。\n\n目标：\n工具组合：Claude Code 是 Agent，DeepSeek V4 是模型后端。\n配置记录：\n改动范围：\n验证命令：\n踩坑：\n下一步：",
    resources: [
      { label: "Claude Code 接 DeepSeek V4 教程", href: "/claude-code-deepseek" },
      { label: "模型平台里的 DeepSeek V4 API", href: "/tools/%E6%A8%A1%E5%9E%8B%E5%B9%B3%E5%8F%B0/deepseek-v4-api" },
      { label: "AI 编程工具推荐", href: "/ai-coding" },
    ],
  },
  {
    id: "codex-small-feature",
    title: "用 Codex 完成一个网页小功能",
    shortTitle: "Codex 小功能",
    tagline: "从一个小需求开始，让工程 Agent 交付可验证结果。",
    audience: "适合有项目、想让 AI 帮忙开发功能但怕它乱改的人。",
    outcome: "完成一个小功能、保留清晰 diff、跑通构建。",
    whyNow: "Codex 的优势是读写项目、跑命令和持续迭代。我们的任务要训练用户给出边界和验收标准。",
    minutes: "35-60 分钟",
    stage: "L5 AI 编程与自动化",
    xp: 75,
    badge: "Codex 实战徽章",
    difficulty: "工程",
    toolIds: ["codex-agent", "github-copilot", "cursor"],
    tags: ["Codex", "AI编程", "小功能", "Build验证"],
    materials: ["一个本地项目", "一个明确的小需求", "能运行的 build/test 命令"],
    steps: [
      {
        title: "把需求压缩到一个小功能",
        desc: "不要说“优化整个网站”。只说一个页面、一个组件、一个交互。",
        deliverable: "一句需求 + 三条验收标准。",
        prompt: "请把我的需求压缩成一个最小可交付功能，并列出 3 条验收标准。不要扩展无关功能。",
      },
      {
        title: "让 Codex 先读后改",
        desc: "先让它找相关文件和风险，再允许动手。",
        deliverable: "相关文件清单和改动计划。",
        prompt: "请先阅读与这个需求相关的文件，输出改动计划。限制：不超过 2 个模块，不改无关样式，不新增依赖，先不要写代码。",
      },
      {
        title: "实现并看 diff",
        desc: "完成后检查 diff 是否只碰了约定范围。",
        deliverable: "关键 diff 摘要。",
        prompt: "请按计划实现这个小功能。完成后总结改了哪些文件、每个文件为什么改、是否触及了无关逻辑。",
      },
      {
        title: "跑验证命令",
        desc: "build/test 是任务完成的证据，不是可选项。",
        deliverable: "build/test 输出摘要。",
        prompt: "请根据当前项目给出验证命令，并解释如果失败应该优先排查哪里。只修与本次功能相关的问题。",
      },
    ],
    recapTemplate:
      "我用 Codex 完成了一个网页小功能。\n\n需求：\n验收标准：\n改动文件：\n验证命令：\n结果：\n下次我会怎么给 Codex 写任务：",
    resources: [
      { label: "Codex 国内使用指南", href: "/codex" },
      { label: "AI 编程工具推荐", href: "/ai-coding" },
      { label: "发布工程复盘", href: "/community/new" },
    ],
  },
  {
    id: "kimi-k26-long-doc",
    title: "用 Kimi K2.6 分析一份长文档并生成行动清单",
    shortTitle: "Kimi 长文档",
    tagline: "不要只让 AI 总结，要让它提取决策、风险和下一步。",
    audience: "适合有合同、论文、课程资料、产品文档或长聊天记录的人。",
    outcome: "得到一份摘要、风险清单、行动清单和可复用提示词。",
    whyNow: "Kimi K2.6 适合长文本和多模态输入，这类任务最容易让普通用户马上感到 AI 有用。",
    minutes: "30-50 分钟",
    stage: "L2 完成任务",
    xp: 60,
    badge: "长文分析徽章",
    difficulty: "新手",
    toolIds: ["kimi", "kimi-code", "deepseek"],
    tags: ["Kimi K2.6", "长文档", "行动清单", "资料分析"],
    materials: ["一份长文档或资料包", "你关心的 3 个问题", "最终要做什么决策"],
    steps: [
      {
        title: "先定义阅读目的",
        desc: "同一份文档，为写摘要、做决策、找风险，问法完全不同。",
        deliverable: "3 个你真正关心的问题。",
        prompt: "我会提供一份长文档。请先根据我的目标，帮我整理 3-5 个最值得追问的问题，不要直接总结。",
      },
      {
        title: "提取结构化摘要",
        desc: "让 AI 输出事实、观点、数字、风险，不要混在一段话里。",
        deliverable: "结构化摘要表。",
        prompt: "请只基于文档内容输出表格：核心事实、关键数字、重要观点、风险点、需要人工确认的地方。资料里没有的内容写“未提供”。",
      },
      {
        title: "生成行动清单",
        desc: "从“我读懂了”走到“我下一步做什么”。",
        deliverable: "按优先级排序的行动清单。",
        prompt: "请基于上面的摘要，生成行动清单。每一项包含：行动、原因、所需材料、负责人类型、截止建议、风险。",
      },
      {
        title: "复盘提示词",
        desc: "把这次有效的问法保存下来，下次可以复用。",
        deliverable: "一套自己的长文档分析 Prompt。",
        prompt: "请把这次分析流程整理成一个可复用 Prompt 模板，保留变量占位符，例如【文档类型】【我的目标】【需要输出的格式】。",
      },
    ],
    recapTemplate:
      "我用 Kimi K2.6 分析了一份长文档。\n\n文档类型：\n我的目标：\n最有用的输出：\n发现的风险：\n行动清单：\n可复用 Prompt：",
    resources: [
      { label: "Kimi 工具详情", href: "/tools/%E5%AF%B9%E8%AF%9DAI/kimi" },
      { label: "DeepSeek 对比参考", href: "/deepseek" },
      { label: "学习 L2 完成任务", href: "/learn/2" },
    ],
  },
  {
    id: "dify-knowledge-base-bot",
    title: "用 Dify 搭一个客服知识库",
    shortTitle: "Dify 知识库",
    tagline: "先做好切分和测试问题，再谈上线客服 Bot。",
    audience: "适合有产品说明、售后政策、课程资料或内部制度的人。",
    outcome: "完成 10 条问答资料、导入知识库、测试 5 个真实问题。",
    whyNow: "知识库不是把文档扔进去就完事。切分、召回测试和转人工边界才是可复用经验。",
    minutes: "45-75 分钟",
    stage: "L3 搭建 Agent",
    xp: 70,
    badge: "RAG 入门徽章",
    difficulty: "进阶",
    toolIds: ["dify", "coze", "fastgpt"],
    tags: ["Dify", "RAG", "客服", "知识库"],
    materials: ["一份产品/售后/课程资料", "10 个真实用户问题", "Dify 账号"],
    steps: [
      {
        title: "把资料拆成问答块",
        desc: "一段只放一条规则，标题尽量写成用户会问的问题。",
        deliverable: "10 条问题 -> 标准回答 -> 来源。",
        prompt: "请把这份资料整理成 10 条知识库问答。每条包含：用户问题、标准回答、资料来源、不能确定时的转人工话术。不要编造资料里没有的信息。",
      },
      {
        title: "导入 Dify 知识库",
        desc: "先少量导入，确认切分和召回效果。",
        deliverable: "一个小型知识库和导入记录。",
        prompt: "请根据我的资料结构，建议 Dify 知识库切分方式、Top K、是否需要标题增强，以及测试时应该关注哪些问题。",
      },
      {
        title: "测试 5 个真实问题",
        desc: "不要只测标准问法，要测模糊问法、边界问题和无法回答的问题。",
        deliverable: "5 条测试记录：问题、回答、是否通过、原因。",
        prompt: "请帮我设计 5 个测试问题，覆盖标准问题、模糊说法、边界场景、资料缺失和需要转人工的情况。",
      },
      {
        title: "写上线边界",
        desc: "客服 Bot 最重要的不是会聊天，是不乱承诺。",
        deliverable: "一段上线前提示词和转人工规则。",
        prompt: "请写一段客服 Bot 系统提示词，要求必须引用知识库内容，不确定时说明需要人工确认，不能承诺退款、赔偿、价格和法律结论。",
      },
    ],
    recapTemplate:
      "我用 Dify 搭了一个客服知识库。\n\n资料来源：\n切分方式：\n测试问题：\n通过/失败案例：\n转人工边界：\n下一步优化：",
    resources: [
      { label: "Dify 教程", href: "/dify" },
      { label: "Dify 知识库搭建教程", href: "/dify-knowledge-base" },
      { label: "Agent 教程", href: "/agent" },
    ],
  },
  {
    id: "n8n-ai-news-automation",
    title: "用 n8n 做一个每日 AI 资讯自动化",
    shortTitle: "n8n 资讯自动化",
    tagline: "先把触发、来源、摘要、审核和发送串起来。",
    audience: "适合想做资讯号、社群日报、行业监控或内部简报的人。",
    outcome: "完成一个半自动资讯流程：抓取来源、AI 摘要、人工确认、发送。",
    whyNow: "自动化是护城河内容的来源。我们自己也能用类似流程产出可复盘的资讯和案例。",
    minutes: "50-90 分钟",
    stage: "L3 搭建 Agent / L5 自动化",
    xp: 75,
    badge: "自动化入门徽章",
    difficulty: "进阶",
    toolIds: ["n8n-ai-agent", "deepseek-v4-api", "dify"],
    tags: ["n8n", "自动化", "AI资讯", "工作流"],
    materials: ["3 个资讯来源", "一个接收渠道", "DeepSeek/Kimi API 或可手工摘要"],
    steps: [
      {
        title: "定义资讯范围",
        desc: "不要抓全网。先定义 3 个可靠来源和 3 个筛选条件。",
        deliverable: "来源清单和筛选规则。",
        prompt: "请帮我设计一个 AI 资讯日报的筛选规则。输入是多个新闻标题和摘要，输出只保留对普通 AI 用户有价值的内容，并说明保留原因。",
      },
      {
        title: "画出流程",
        desc: "触发、抓取、过滤、摘要、人工确认、发送，一个节点一个职责。",
        deliverable: "6 步流程图或表格。",
        prompt: "请把我的资讯自动化拆成 6 个节点：触发、抓取、过滤、AI 摘要、人工确认、发送。每个节点写输入、输出和失败处理。",
      },
      {
        title: "先做半自动版本",
        desc: "先允许人工复制来源，不急着全自动抓取，跑通闭环更重要。",
        deliverable: "一条能跑通的日报样例。",
        prompt: "请把以下资讯整理成日报。每条包含：标题、发生了什么、对普通用户有什么影响、应该关注什么、来源链接。",
      },
      {
        title: "加人工审核点",
        desc: "资讯容易错，发送前必须人工确认事实和标题。",
        deliverable: "审核清单。",
        prompt: "请为 AI 资讯日报生成审核清单，重点检查：是否夸大、是否过期、是否缺来源、是否把猜测当事实、标题是否误导。",
      },
    ],
    recapTemplate:
      "我用 n8n/AI 做了一个资讯自动化流程。\n\n资讯来源：\n流程节点：\nAI 摘要方式：\n人工审核点：\n第一条日报：\n下一步：",
    resources: [
      { label: "工作流自动化", href: "/workflows" },
      { label: "n8n 工具详情", href: "/tools/Agent%E5%B9%B3%E5%8F%B0/n8n-ai-agent" },
      { label: "AI 资讯页", href: "/news" },
    ],
  },
  {
    id: "xiaohongshu-ai-content-loop",
    title: "做一条小红书 AI 内容流水线",
    shortTitle: "内容流水线",
    tagline: "从选题、文案、配图到发布检查，先跑通一条内容。",
    audience: "适合想做内容账号、产品宣传、个人 IP 或课程笔记的人。",
    outcome: "完成一条可发布内容：选题、标题、正文、配图提示词、检查清单。",
    whyNow: "内容场景最容易吸引新手，但也最容易变成空泛模板。我们要让用户产出真实细节和可复用流程。",
    minutes: "35-60 分钟",
    stage: "L2 完成任务",
    xp: 60,
    badge: "内容生产徽章",
    difficulty: "新手",
    toolIds: ["deepseek", "kimi", "jimeng", "canva-ai"],
    tags: ["小红书", "内容创作", "AI绘图", "选题"],
    materials: ["一个真实经历或产品", "目标读者", "发布平台"],
    steps: [
      {
        title: "先做真实选题",
        desc: "不要让 AI 编热点。用你的真实经历、问题或产品做选题。",
        deliverable: "3 个选题和目标读者。",
        prompt: "请基于我的真实经历/产品，生成 3 个小红书选题。每个选题包含：目标读者、痛点、标题、为什么值得看。不要编造我没有提供的经历。",
      },
      {
        title: "写出正文草稿",
        desc: "结构可以 AI 帮忙，细节必须来自你。",
        deliverable: "一篇 500-800 字正文。",
        prompt: "请根据这个选题写一篇小红书正文草稿。要求：开头有真实痛点，中间有步骤，结尾有可执行建议。不要过度营销，不要空话。",
      },
      {
        title: "生成配图提示词",
        desc: "一篇内容先配 1-3 张图，不要直接做复杂视频。",
        deliverable: "3 条配图 Prompt。",
        prompt: "请为这篇小红书内容生成 3 张配图提示词。每张图说明：画面主体、构图、风格、文字元素、避免出现的内容。",
      },
      {
        title: "发布前检查",
        desc: "检查是否夸大、是否像广告、是否缺真实细节。",
        deliverable: "发布检查清单。",
        prompt: "请检查这篇内容是否有夸大、空话、广告感、事实风险和平台不友好表达，并给出修改建议。",
      },
    ],
    recapTemplate:
      "我用 AI 跑通了一条小红书内容流水线。\n\n选题：\n目标读者：\n用到工具：\n正文结构：\n配图 Prompt：\n发布前改了什么：\n下一条内容计划：",
    resources: [
      { label: "AI 写作工具推荐", href: "/ai-writing-tools" },
      { label: "AI 绘图工具推荐", href: "/ai-image-tools" },
      { label: "社区发布复盘", href: "/community/new" },
    ],
  },
]

export function getMission(id: string) {
  return missions.find((mission) => mission.id === id)
}
