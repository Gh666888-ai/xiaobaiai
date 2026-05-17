export type AgentInstallStep = {
  title: string
  body: string
  command?: string
}

export type AgentPostInstallSection = {
  title: string
  why: string
  steps: string[]
  template?: string
  checks?: string[]
}

export type AgentApiConnection = {
  name: string
  badge: string
  description: string
  fields: Array<{ label: string; value: string }>
  windowsCommand?: string
  macCommand?: string
  notes: string[]
}

export type AgentInstallGuide = {
  slug: string
  name: string
  title: string
  category: string
  minutes: string
  difficulty: string
  tagline: string
  summary: string
  bestFor: string[]
  requirements: string[]
  installSteps: AgentInstallStep[]
  startCommands: AgentInstallStep[]
  firstPrompts: string[]
  commonIssues: Array<{ title: string; solution: string; command?: string }>
  apiConnections: AgentApiConnection[]
  postInstallSetup?: AgentPostInstallSection[]
  ecosystemApps?: Array<{ name: string; type: string; description: string; href?: string }>
  skillPacks?: Array<{ name: string; when: string; install: string; command?: string }>
  interfaceImage?: { src: string; alt: string; caption: string }
  officialUrl?: string
}

export const defaultAgentPostInstallSetup: AgentPostInstallSection[] = [
  {
    title: "1. 先设定人设：让它知道自己是谁、帮谁做事",
    why: "Agent 装好以后不能只让它自由发挥。人设不是装可爱，而是明确岗位、行业、语气、边界和遇到不确定时怎么问你。",
    steps: [
      "告诉它你的行业、岗位、主要客户和最常做的 3 类工作。",
      "告诉它输出要短、要能执行、不要一次讲太多。",
      "告诉它不确定就先问，不要替你编事实、价格、政策和承诺。",
      "工程 Agent 还要加一句：改文件前先列计划和涉及文件。",
    ],
    template: `请从现在开始作为我的个人 AI 工作助理。

我的行业/岗位：这里写你的行业和岗位
我最想交给你的工作：
1. 这里写第一类重复工作
2. 这里写第二类重复工作
3. 这里写第三类重复工作

你的工作方式：
1. 先问清目标、材料、交付格式和截止时间。
2. 每次只给我下一步，不要一次甩太多内容。
3. 不确定的信息要标注“需要确认”，不能编造。
4. 涉及钱、合同、隐私、客户承诺、删除文件、发送消息前，必须先问我。
5. 做完后给我一个验收清单，让我知道结果能不能用。

你的说话方式：
用中文，简单直接，像带新手做事一样。`,
    checks: ["它能说出你的行业和主要工作。", "它会先问问题，而不是直接乱给方案。", "它知道哪些事情必须先问你确认。"],
  },
  {
    title: "2. 建记忆结构：不要只记聊天，要记可复用的工作方法",
    why: "真正有用的 Agent 不是每次重新聊，而是能记住你的行业资料、固定流程、常用模板、踩坑记录和下一步。",
    steps: [
      "先建 7 个记忆格子，不要把所有东西塞成一段话。",
      "隐私、密码、API Key、客户手机号、身份证、合同原文不要写进长期记忆。",
      "每完成一次任务，让 Agent 把成功步骤、失败原因和下次做法写进对应格子。",
      "工程项目可以把这些写进 AGENTS.md、CLAUDE.md、项目说明或 Agent 的 Memory 区。",
    ],
    template: `请按下面结构建立我的长期记忆，不要记录密码、API Key、客户隐私和付款信息。

【用户画像】
- 我是谁：
- 行业/岗位：
- 我的目标：
- 我不懂的地方：

【业务资料】
- 产品/服务：
- 客户是谁：
- 常见问题：
- 禁止承诺：

【固定工作流】
- 工作流名称：
- 触发条件：
- 输入材料：
- 执行步骤：
- 输出格式：
- 验收标准：

【常用提示词】
- 场景：
- 提示词：
- 什么时候用：

【工具和 Skill】
- 已安装工具：
- 已安装 Skill：
- 能做什么：
- 权限边界：

【踩坑记录】
- 问题：
- 原因：
- 解决方法：
- 下次避免：

【下一步】
- 当前任务：
- 做到哪一步：
- 下次继续做什么：`,
    checks: ["记忆是分区的，不是一大坨文字。", "没有保存 API Key、密码和客户隐私。", "每个固定工作流都有输入、步骤、输出和验收标准。"],
  },
  {
    title: "3. 设工作边界：哪些能自动做，哪些必须等你确认",
    why: "Agent 越强越要设边界。新手最怕的不是不会用，而是它替你乱删文件、乱发消息、乱承诺客户。",
    steps: [
      "把任务分成低风险、中风险、高风险三类。",
      "低风险可以让它直接草拟，比如总结、改写、生成草稿。",
      "中风险必须先给计划，比如改代码、改表格、批量处理文件。",
      "高风险必须停下来问你，比如付款、发客户、删库、发公开内容、提交代码。",
    ],
    template: `请遵守我的权限边界：

【可以直接做】
- 总结资料
- 生成草稿
- 整理清单
- 给出方案
- 写提示词

【先列计划，等我确认再做】
- 修改文件
- 批量处理资料
- 改代码
- 调用外部工具
- 安装 Skill 或插件

【必须停止并问我】
- 删除文件或数据
- 发送邮件、微信、飞书、短信
- 对客户做承诺
- 涉及付款、合同、发票、隐私
- 提交代码、发布上线、改生产配置`,
    checks: ["它知道哪些任务不能直接执行。", "它会在高风险动作前停下来问你。", "它能把工作拆成低风险小步。"],
  },
  {
    title: "4. 设验收标准：让它每次交付都能被检查",
    why: "没有验收标准，Agent 做得再多也像聊天。小白要知道什么叫完成，什么叫还不能用。",
    steps: [
      "每个任务开始前，先让它写清楚最终交付物是什么。",
      "让它给 3 到 5 条验收标准。",
      "做完后让它自己按验收标准检查一遍。",
      "如果是工程 Agent，还要告诉你运行了什么命令、结果是什么、哪些没验证。",
    ],
    template: `开始任务前，请先输出：

1. 本次任务目标：
2. 需要我提供的材料：
3. 最终交付物：
4. 3-5 条验收标准：
5. 你不能做或不确定的地方：

做完以后，请按下面格式回复：

【完成了什么】
【怎么验收】
【我需要检查哪里】
【还有哪些风险】
【下一步建议】`,
    checks: ["任务开始前有交付物和验收标准。", "任务结束后有检查清单。", "它会说明没验证的地方，而不是假装都完成。"],
  },
  {
    title: "5. 训练它复盘：每次任务后沉淀成你的专属工作流",
    why: "训练 Agent 的关键不是一次成功，而是把成功过程变成下次可复用的流程。这样它才会越来越像你的工作助手。",
    steps: [
      "每次做完一个任务，让它总结本次输入、步骤、输出、错误和改进。",
      "把复盘写进记忆结构的【固定工作流】和【踩坑记录】。",
      "下一次类似任务，先让它读取这条工作流再开始。",
      "如果这个流程稳定了，再考虑装 Skill 或接自动化。",
    ],
    template: `请把这次任务复盘成可复用工作流：

【工作流名称】

【适合什么时候用】

【需要准备什么】

【步骤】
1.
2.
3.

【输出格式】

【验收标准】

【这次踩坑】

【下次直接怎么做】

请把它写入长期记忆的【固定工作流】和【踩坑记录】里。`,
    checks: ["同类任务下次不需要重新教。", "有清晰步骤和验收标准。", "踩坑记录能提醒它下次避免。"],
  },
]

const deepseekOpenAiFields = [
  { label: "Provider", value: "OpenAI Compatible / Custom" },
  { label: "Base URL", value: "https://api.deepseek.com" },
  { label: "API Key", value: "sk-你的DeepSeek_API_Key" },
  { label: "保存后怎么测", value: "新建对话，发送：你好，用一句话介绍你自己" },
  { label: "先跑通模型", value: "deepseek-v4-flash" },
  { label: "更强模型", value: "deepseek-v4-pro" },
  { label: "长上下文", value: "deepseek-v4-pro[1m]" },
]

const kimiOpenAiFields = [
  { label: "Provider", value: "OpenAI Compatible / Custom" },
  { label: "Base URL", value: "https://api.moonshot.cn/v1" },
  { label: "API Key", value: "你的 Kimi / Moonshot API Key" },
  { label: "模型", value: "kimi-k2.6" },
  { label: "保存后怎么测", value: "新建对话，发送：请总结一句今天要做什么" },
]

const openAiFields = [
  { label: "Provider", value: "OpenAI" },
  { label: "API Key", value: "你的 OpenAI API Key" },
  { label: "模型", value: "按工具模型列表选择当前可用模型" },
  { label: "保存后怎么测", value: "点击 Test，或新建对话问一句你好" },
]

const minimaxOpenAiFields = [
  { label: "Provider", value: "OpenAI Compatible / Custom" },
  { label: "Base URL", value: "https://api.minimax.io/v1" },
  { label: "API Key", value: "你的 MiniMax API Key" },
  { label: "日常对话先选", value: "MiniMax-M2.7" },
  { label: "更快版本", value: "MiniMax-M2.7-highspeed" },
  { label: "保存后怎么测", value: "新建对话，发送：你好，帮我写一句短文案" },
]

const minimaxOpenAiConnection: AgentApiConnection = {
  name: "接入 MiniMax",
  badge: "日常对话低成本",
  description: "如果用户只是聊天、写文案、问问题，可以先用 MiniMax 会员或 MiniMax API。支持 OpenAI Compatible 的工具，按下面这组填写。",
  fields: minimaxOpenAiFields,
  notes: [
    "MiniMax 更适合作为新手日常对话和轻量工作入口；复杂 Agent、长代码任务、企业资料任务后期再按需求换模型。",
    "MiniMax 官方兼容 OpenAI API，Base URL 使用 https://api.minimax.io/v1。",
    "价格和套餐变化很快，正式开会员或接 API 前先看本站模型排行和价格快照，再复核官方价格页。",
  ],
}

const deepseekOpenAiConnection: AgentApiConnection = {
  name: "接入 DeepSeek V4",
  badge: "国内优先",
  description: "大多数支持 OpenAI Compatible 的 Agent，都可以按这一组填写。小白先用 flash 跑通，再换 pro。",
  fields: deepseekOpenAiFields,
  notes: [
    "如果工具要求 Base URL 以 /v1 结尾，把地址改成 https://api.deepseek.com/v1。",
    "如果出现 404 或 model not found，先把模型改成 deepseek-v4-flash。",
    "DeepSeek V4 是模型 API 后端，不是 Agent。它放在这里给 Agent 调用。",
  ],
}

const kimiConnection: AgentApiConnection = {
  name: "接入 Kimi K2.6",
  badge: "长文档",
  description: "适合长文档、资料分析和多模态任务。支持 OpenAI Compatible 的工具一般直接填下面这组。",
  fields: kimiOpenAiFields,
  notes: [
    "如果工具里有模型列表，找不到 kimi-k2.6 时先确认账号是否已开通该模型。",
    "Kimi 是模型 API 后端，不是工程 Agent。",
  ],
}

const openAiConnection: AgentApiConnection = {
  name: "接入 OpenAI",
  badge: "官方",
  description: "如果你有 OpenAI API Key，优先按工具内置 OpenAI Provider 填。不要把 DeepSeek Key 填到 OpenAI 官方 Provider 里。",
  fields: openAiFields,
  notes: [
    "OpenAI 官方 Provider 通常只填 API Key，不需要改 Base URL。",
    "如果你使用的是中转或 OpenAI Compatible 服务，选择 Custom / OpenAI Compatible，而不是官方 OpenAI。",
  ],
}

const xiaobaiDoubaoTtsConnection: AgentApiConnection = {
  name: "豆包 TTS 语音合成",
  badge: "推荐语音输出",
  description: "用于让小白开口说话。推荐先用火山引擎的豆包语音合成 2.0，新版控制台优先使用 API Key，不要把普通模型 Key、网站会员账号或阿里云 AccessKey 填到这里。",
  fields: [
    { label: "去哪里申请", value: "火山引擎控制台 / 火山方舟 / 豆包语音合成大模型" },
    { label: "控制台入口", value: "https://console.volcengine.com/ark" },
    { label: "业务模块", value: "语音合成大模型 / 豆包语音合成 2.0" },
    { label: "要创建什么", value: "API Key；旧版控制台可能还需要 App ID 和 Access Token" },
    { label: "填到小白哪里", value: "语音设置 -> TTS 服务商选择 doubao，填写 doubaoKey；旧版再填 doubaoAppId / doubaoAccessKey" },
    { label: "常用资源 ID", value: "seed-tts-2.0" },
  ],
  notes: [
    "小白当前豆包 TTS 请求使用 openspeech.bytedance.com 的语音合成接口，优先走 X-Api-Key。",
    "如果你已经拿到 App ID 和 Access Token，也可以用旧版字段，但新用户优先申请新版 API Key。",
    "TTS 只负责把文字变成声音；它不是 LLM 大脑，也不负责语音识别。",
  ],
}

const xiaobaiAliyunAsrConnection: AgentApiConnection = {
  name: "阿里云百炼 ASR 语音识别",
  badge: "推荐语音输入",
  description: "用于把你说的话转成文字。小白当前首选阿里云百炼 Paraformer 实时语音识别，需要的是百炼 / DashScope API Key，格式通常是 sk- 开头。",
  fields: [
    { label: "去哪里申请", value: "阿里云百炼 Model Studio 控制台" },
    { label: "控制台入口", value: "https://bailian.console.aliyun.com/" },
    { label: "业务模块", value: "API Key 管理；语音识别使用 Paraformer 实时识别能力" },
    { label: "要创建什么", value: "百炼 API Key / DashScope API Key，通常以 sk- 开头" },
    { label: "不要填什么", value: "不要填阿里云 AccessKey ID、AccessKey Secret、Workspace ID 或模型名" },
    { label: "填到小白哪里", value: "语音设置 -> ASR 服务商选择 aliyun，填写 aliyunApiKey" },
  ],
  notes: [
    "阿里云百炼文档说明，使用模型或应用前需要先获取 API Key 作为鉴权凭证。",
    "百炼 API Key 所属业务空间会影响可调用的模型和应用，普通用户先选默认业务空间即可。",
    "ASR 只负责听懂你说的话；语音输出仍然要配置 TTS。",
  ],
}

const xiaobaiMinimaxConnection: AgentApiConnection = {
  name: "MiniMax LLM / 备用 TTS",
  badge: "轻量对话",
  description: "MiniMax 可以作为小白的日常对话模型，也可以给 MiniMax TTS 复用密钥。适合先低成本跑通聊天和语音回复。",
  fields: [
    { label: "去哪里申请", value: "MiniMax 开放平台" },
    { label: "控制台入口", value: "https://platform.minimax.io/" },
    { label: "业务模块", value: "API Keys -> Create new secret key" },
    { label: "Base URL", value: "https://api.minimax.io/v1" },
    { label: "API Key", value: "MiniMax API Key" },
    { label: "填到小白哪里", value: "模型设置填写 MiniMax；TTS 选择 MiniMax 时可复用同一个 Key" },
  ],
  notes: [
    "MiniMax 官方文档把 API Key 分为按量付费 API Key 和 Token Plan Key，新用户优先用 API Keys 里创建的 secret key。",
    "如果只是聊天、写文案、轻量任务，可以先用 MiniMax 跑通；复杂工程任务再接 DeepSeek、OpenAI 或其它模型。",
  ],
}

const xiaobaiOpenAiConnection: AgentApiConnection = {
  name: "OpenAI LLM / TTS",
  badge: "国际通用",
  description: "如果你有 OpenAI API Key，可以作为小白的模型大脑，也可以作为 OpenAI TTS 的语音输出服务。",
  fields: [
    { label: "去哪里申请", value: "OpenAI Platform" },
    { label: "控制台入口", value: "https://platform.openai.com/api-keys" },
    { label: "业务模块", value: "API keys / Project keys" },
    { label: "要创建什么", value: "OpenAI API Key" },
    { label: "模型接口", value: "模型设置里选择 OpenAI，填写 openai api key" },
    { label: "TTS 接口", value: "语音设置 -> TTS 选择 openai，填写 openaiTtsKey" },
  ],
  notes: [
    "OpenAI 官方文档要求 API Key 用 Bearer 鉴权，并提醒不要把 Key 暴露在前端、公开仓库或日志里。",
    "国内网络环境可能影响访问；如果连不上，先确认网络和账户计费状态。",
  ],
}

const noCustomApiConnection = (product: string): AgentApiConnection => ({
  name: `${product} 账号登录`,
  badge: "不填第三方 Key",
  description: `${product} 桌面版是官方账号型应用，不是通用 API 客户端。下载安装到电脑后，用官方账号登录即可。`,
  fields: [
    { label: "登录方式", value: "官方账号登录" },
    { label: "DeepSeek / Kimi Key", value: "不能直接填到官方桌面版里" },
    { label: "适合新手", value: "截图、文件、日常问答、写作、语音" },
    { label: "保存后怎么测", value: "登录后直接发一句：你好" },
  ],
  notes: [
    "不要从网盘、群文件、陌生 GitHub 下载所谓破解版桌面端。",
    "如果你要接 DeepSeek、Kimi 等 API，选 Cherry Studio、Chatbox、Cline、OpenClaw 这类支持自定义 Provider 的工具。",
  ],
})

const localOpenAiServerConnection: AgentApiConnection = {
  name: "本地 OpenAI Compatible 服务",
  badge: "本地模型",
  description: "LM Studio 这类本地模型软件可以在电脑上开一个 OpenAI 兼容接口，给其他工具调用。",
  fields: [
    { label: "Base URL", value: "http://localhost:1234/v1" },
    { label: "API Key", value: "随便填一个，例如 lm-studio" },
    { label: "Model", value: "选择你在 LM Studio 里加载的模型" },
    { label: "保存后怎么测", value: "先确认 LM Studio Local Server 是绿色运行状态" },
  ],
  notes: [
    "先在 LM Studio 里下载并加载模型，再开启 Local Server。",
    "电脑内存小就选 7B / 8B 量化模型，别一上来下载超大模型。",
    "本地模型慢是正常现象，第一次加载可能要等一会儿。",
  ],
}

const anthropicDeepseekConnection: AgentApiConnection = {
  name: "Claude Code 接入 DeepSeek V4",
  badge: "Anthropic Compatible",
  description: "Claude Code 这条路线使用 Anthropic 兼容变量。Windows 复制 PowerShell 版，Mac/Linux/WSL 复制 export 版。",
  fields: [
    { label: "Base URL", value: "https://api.deepseek.com/anthropic" },
    { label: "Auth Token", value: "sk-你的DeepSeek_API_Key" },
    { label: "主模型", value: "deepseek-v4-pro[1m]" },
    { label: "快模型", value: "deepseek-v4-flash" },
    { label: "保存后怎么测", value: "复制命令启动 claude，问它能不能读取当前目录" },
  ],
  windowsCommand: `$env:ANTHROPIC_BASE_URL="https://api.deepseek.com/anthropic"
$env:ANTHROPIC_AUTH_TOKEN="sk-你的DeepSeek_API_Key"
$env:ANTHROPIC_MODEL="deepseek-v4-pro[1m]"
$env:ANTHROPIC_DEFAULT_OPUS_MODEL="deepseek-v4-pro[1m]"
$env:ANTHROPIC_DEFAULT_SONNET_MODEL="deepseek-v4-pro[1m]"
$env:ANTHROPIC_DEFAULT_HAIKU_MODEL="deepseek-v4-flash"
$env:CLAUDE_CODE_SUBAGENT_MODEL="deepseek-v4-flash"
claude`,
  macCommand: `export ANTHROPIC_BASE_URL=https://api.deepseek.com/anthropic
export ANTHROPIC_AUTH_TOKEN=sk-你的DeepSeek_API_Key
export ANTHROPIC_MODEL=deepseek-v4-pro[1m]
export ANTHROPIC_DEFAULT_OPUS_MODEL=deepseek-v4-pro[1m]
export ANTHROPIC_DEFAULT_SONNET_MODEL=deepseek-v4-pro[1m]
export ANTHROPIC_DEFAULT_HAIKU_MODEL=deepseek-v4-flash
export CLAUDE_CODE_SUBAGENT_MODEL=deepseek-v4-flash
claude`,
  notes: [
    "Windows 不要复制 export；Mac、Linux、WSL 不要复制 $env:。",
    "如果模型名不支持 deepseek-v4-pro[1m]，先改成 deepseek-v4-pro；还不行就用 deepseek-v4-flash。",
    "如果提示 Unable to connect to Anthropic services，说明软件启动了，但默认服务连不上，先检查这组变量。",
    "Claude Desktop 的开发者模式是给 MCP 工具和桌面扩展用的，不是把 DeepSeek Key 填进官方 Claude 聊天。",
  ],
}

const codexOpenAiConnection: AgentApiConnection = {
  name: "Codex 官方 OpenAI 接入",
  badge: "官方",
  description: "Codex 是 OpenAI 的工程 Agent。最稳方式是先用 OpenAI API Key 跑通。",
  fields: openAiFields,
  windowsCommand: `$env:OPENAI_API_KEY="你的OpenAI_API_Key"
codex`,
  macCommand: `export OPENAI_API_KEY=你的OpenAI_API_Key
codex`,
  notes: [
    "第一次使用先在一个 Git 项目里打开，方便看 diff 和回退。",
    "如果你没有 OpenAI API Key，就先用支持 DeepSeek 的 OpenClaw、Cline 或 Claude Code 兼容路线。",
  ],
}

const codexCompatibleConnection: AgentApiConnection = {
  name: "Codex 接 OpenAI Compatible",
  badge: "看版本",
  description: "只有当你当前 Codex 版本或服务商明确支持自定义 base_url 时，才这样填。否则不要硬套。",
  fields: deepseekOpenAiFields,
  windowsCommand: `$env:OPENAI_BASE_URL="https://api.deepseek.com"
$env:OPENAI_API_KEY="sk-你的DeepSeek_API_Key"
codex`,
  macCommand: `export OPENAI_BASE_URL=https://api.deepseek.com
export OPENAI_API_KEY=sk-你的DeepSeek_API_Key
codex`,
  notes: [
    "如果完全不生效，说明当前 Codex 路线不支持这个配置，换 OpenClaw 或 Cline 更直接。",
    "不要把 DeepSeek Key 发给陌生中转站；能用官方 API 就先用官方 API。",
  ],
}

export const agentInstallGuides: AgentInstallGuide[] = [
  {
    slug: "xiaobai-nexus",
    name: "Xiaobai Nexus",
    title: "Xiaobai Nexus 小白桌面 Agent 安装和会员登录",
    category: "小白官方 Agent 桌面应用",
    minutes: "3-8 分钟",
    difficulty: "小白官方",
    tagline: "小白自己的语音全程交互桌面 Agent 中枢。你可以直接说话下任务，让小白听懂、操作电脑、调度本地 Agent，并用语音回复结果。",
    summary: "Xiaobai Nexus 是小白AI的官方桌面端，核心卖点不是普通聊天，也不是只加一个语音输入按钮，而是把“说话下任务、听懂意图、调用桌面能力、执行后语音回复”做成完整闭环。先在小白AI网站注册/登录会员，再下载 Windows 安装包；桌面端启动后必须用同一个网站会员账号登录，不能游客绕过。",
    bestFor: [
      "想直接对电脑说话，让小白听懂任务、操作桌面、全程语音回复结果的人。",
      "需要小白统一调用 Codex、Claude Code、OpenClaw、桌面应用和记忆库的用户。",
      "准备体验公开桌面 Agent 里非常少见的语音全程交互、真人数字人前端和半自动自我进化流水线的内部会员。",
    ],
    requirements: [
      "Windows 10/11 电脑。",
      "小白AI网站会员账号。",
      "可用的模型 API、ASR 语音识别和 TTS 语音合成配置，首次启动后在设置里填写。",
    ],
    installSteps: [
      { title: "登录小白AI网站会员", body: "先在 xiaobaiai.cn 登录或注册会员。桌面端会使用同一套会员账号，不提供游客模式。" },
      { title: "下载安装包", body: "点击按钮下载当前 Windows 安装包。", command: "/downloads/xiaobai-agent/Xiaobai-Setup-2.1.135.exe" },
      { title: "安装并启动", body: "运行安装包，安装完成后从桌面或开始菜单打开 Xiaobai Nexus。" },
      { title: "用网站会员账号登录桌面端", body: "输入小白AI网站的会员邮箱和密码。登录成功后才会进入主界面，聊天、记忆、设置和桌面能力才会解锁。" },
      { title: "准备小白需要的 API", body: "首次使用前至少准备一套模型 API；如果要语音操作电脑，再准备 ASR 语音识别和 TTS 语音合成。ASR 负责听懂你说的话，模型负责判断任务和调用工具，TTS 负责把结果说出来。下方 API 区已经写清楚每个 Key 去哪个平台、哪个业务模块申请。" },
    ],
    startCommands: [
      { title: "图形界面启动", body: "从 Windows 桌面快捷方式或开始菜单打开 Xiaobai Nexus。" },
      { title: "下载页", body: "如果要在另一台电脑安装，直接打开下载页。", command: "/download" },
    ],
    firstPrompts: [
      "小白，检查我的模型、语音识别、TTS 和桌面控制是否配置完整。",
      "小白，打开语音模式，我用说话的方式让你帮我操作电脑。",
      "小白，把你现在能调用的 Agent、模型和桌面能力列成一张表。",
      "小白，开启自我进化，先只生成更新提案，不要直接改核心代码。",
    ],
    commonIssues: [
      { title: "登录失败", solution: "确认使用的是小白AI网站会员邮箱和密码；如果网站也不能登录，先在网站重置或重新注册会员。" },
      { title: "登录后模型不能回复", solution: "会员登录只负责使用权限；模型 API、语音识别和 TTS 仍需要在桌面端设置里单独配置。" },
      { title: "不知道 API 去哪里申请", solution: "看本页“先选模型 API 或本地模型”区域：豆包 TTS 去火山方舟，阿里云 ASR 去阿里云百炼，MiniMax 去 MiniMax 开放平台，OpenAI 去 OpenAI Platform。" },
      { title: "另一台电脑下载慢", solution: "优先使用 /download 页面里的 Windows 安装包链接；如果浏览器缓存旧页面，强制刷新后再下载。" },
      { title: "Windows 提示未知发布者或不常下载", solution: "浏览器下载栏里点“保留 / 显示更多 / 仍要保留”；打开安装包时如果出现 SmartScreen 蓝色窗口，点“更多信息 / 仍要运行”；如果文件被锁定，右键安装包进入“属性”，在“常规”里勾选“解除锁定”后再安装。" },
    ],
    apiConnections: [xiaobaiDoubaoTtsConnection, xiaobaiAliyunAsrConnection, deepseekOpenAiConnection, xiaobaiMinimaxConnection, xiaobaiOpenAiConnection],
    interfaceImage: {
      src: "/xiaobai-nexus-interface-annotated.svg",
      alt: "Xiaobai Nexus 界面功能标注图",
      caption: "主界面包含语音入口、消息处理器、运行状态、更新诊断、Agent 调度、自我进化和对话输入；底层背景默认是银河系宇宙，也可以替换成自己的照片。",
    },
    postInstallSetup: [
      {
        title: "1. 先完成会员登录",
        why: "Xiaobai Nexus 是小白AI会员桌面端。会员登录是进入主界面和调用本地能力的第一道门。",
        steps: [
          "用小白AI网站会员账号登录桌面端。",
          "登录成功后再配置模型、语音和 TTS。",
          "退出登录后，桌面端应回到登录页，不能继续使用聊天和设置接口。",
        ],
        checks: ["未登录访问主界面会回到登录页。", "未登录直接调用本地消息接口会返回 401。", "登录账号和网站会员账号一致。"],
      },
      ...defaultAgentPostInstallSetup,
    ],
    officialUrl: "/download",
  },
  {
    slug: "claude-code",
    name: "Claude Code",
    title: "Claude Code 从安装到项目 MVP 终极路线",
    category: "工程 Agent",
    minutes: "8-15 分钟",
    difficulty: "新手可跟",
    tagline: "先装 Node.js 和 Claude Code，再接 DeepSeek V4、MiniMax 或官方 Claude，最后用 hooks、skills、插件和子智能体做一个可验收项目。",
    summary: "这是 Claude Code 的完整学习路线：先跑通安装和模型，再学会只读项目、限定权限、看 diff、跑验证，最后再进入 hooks、skills、插件、子智能体和自动化。官网桌面端开发者模式放在 Claude Desktop 教程里，不混在这里讲。",
    bestFor: ["真实代码项目", "修复报错", "改网页功能", "理解陌生项目"],
    requirements: ["Node.js 18+", "Windows 建议 PowerShell 或 WSL", "一个可用模型账号或 API Key", "最好在 Git 项目里使用"],
    officialUrl: "https://docs.anthropic.com/en/docs/claude-code/getting-started",
    installSteps: [
      {
        title: "先检查 Node.js",
        body: "打开终端。Windows 打开 PowerShell，Mac 打开 Terminal。复制下面两行，能看到版本号再继续。",
        command: `node -v
npm -v`,
      },
      {
        title: "Windows 直接安装",
        body: "PowerShell 里复制这一段。这里用 npm.cmd，是为了避开 npm.ps1 被系统策略拦住的问题。",
        command: `npm.cmd install -g @anthropic-ai/claude-code --registry=https://registry.npmmirror.com
claude --version`,
      },
      {
        title: "Mac / Linux / WSL 安装",
        body: "复制下面这一段。官方提醒不要用 sudo npm install -g，容易产生权限问题。",
        command: `npm install -g @anthropic-ai/claude-code
claude --version`,
      },
      {
        title: "启动",
        body: "看到版本号以后，复制下面这一行启动。",
        command: "claude",
      },
    ],
    startCommands: [
      {
        title: "只是打开试试",
        body: "第一次打开后，先让它解释能力，不要马上改文件。",
        command: "claude",
      },
      {
        title: "接好 DeepSeek 后再启动",
        body: "Windows 用户在同一个 PowerShell 窗口里先复制下面几行，最后一行 claude 会直接启动。不要在命令前面加空格。",
        command: `$env:ANTHROPIC_BASE_URL="https://api.deepseek.com/anthropic"
$env:ANTHROPIC_AUTH_TOKEN="sk-你的DeepSeek_API_Key"
$env:ANTHROPIC_MODEL="deepseek-v4-pro[1m]"
claude`,
      },
      {
        title: "在项目里使用",
        body: "先进入你的项目文件夹，再启动 Claude Code。",
        command: `cd 你的项目文件夹路径
claude`,
      },
    ],
    firstPrompts: [
      "请先告诉我你能做什么，不要修改我的文件。",
      "请先阅读这个项目，不要改文件，告诉我它是什么技术栈、主要目录和下一步建议。",
      "只改我指定的文件，改之前先列计划，改完告诉我修改了哪里。",
    ],
    commonIssues: [
      {
        title: "npm.ps1 被禁止运行",
        solution: "这是 PowerShell 安全策略，不是 Node.js 坏了。优先把 npm 改成 npm.cmd。",
        command: "Set-ExecutionPolicy -Scope CurrentUser RemoteSigned",
      },
      {
        title: "看到 changed packages 后 npx 又报红",
        solution: "说明 Claude Code 已经装好了。不要再用 npx，直接验证 claude 命令。",
        command: "claude --version",
      },
      {
        title: "Unable to connect to Anthropic services",
        solution: "软件启动成功了，但默认服务连不上。国内用户先按下面 DeepSeek Anthropic Compatible 配置。",
      },
      {
        title: "打开 Claude Desktop 开发者模式后还是不能填 DeepSeek Key",
        solution: "这是正常情况。Claude Desktop 和 Claude Code 是两个教程。桌面端开发者模式主要配置 MCP 工具和扩展；要让工程 Agent 接 DeepSeek，就用本页的 Anthropic Compatible 环境变量命令。",
      },
    ],
    postInstallSetup: [
      {
        title: "1. 先做只读体检：别一上来让它改项目",
        why: "Claude Code 装好以后，第一件事不是写 App，而是确认它能看懂你的项目，又不会乱动文件。新手先把读项目、列计划、等确认这三件事练熟。",
        steps: [
          "进入一个 Git 项目目录后再启动 claude，不要在桌面空文件夹里乱试。",
          "第一句话要求它只读项目，不要修改文件。",
          "让它输出技术栈、启动命令、主要目录、风险点和最小可改任务。",
          "如果它要执行命令，先让它解释命令作用，再决定是否允许。",
        ],
        template: `请先只读这个项目，不要修改任何文件，也不要执行会改变文件的命令。

请按下面格式回答：
1. 这个项目是什么技术栈
2. 主要目录分别做什么
3. 本地启动命令可能是什么
4. 现在最适合新手修改的一个小功能
5. 修改前需要我确认什么`,
        checks: ["它没有改文件。", "它能说清项目结构。", "它给出的下一步很小，可以回滚。"],
      },
      {
        title: "2. 接第三方模型：先跑通，再谈强不强",
        why: "很多国内用户不是不会用 Claude Code，而是卡在官方服务、API Key、模型名和 base_url。模型接入要先用最小测试跑通，再逐步换更强模型。",
        steps: [
          "先选一种路线：官方 Claude、DeepSeek Anthropic Compatible、MiniMax，或 CC Switch / Claude Code Router。",
          "Windows PowerShell 用 $env:，Mac / Linux / WSL 用 export，不要混着复制。",
          "先用便宜或快速模型问一句中文测试，能回复再换长上下文或强推理模型。",
          "出现 401、model not found、timeout 时，先检查 Key、模型名、base_url 和余额，不要反复重装 Claude Code。",
        ],
        template: `我现在要给 Claude Code 接第三方模型。

我的系统：Windows / Mac / WSL
我用的模型服务商：DeepSeek / MiniMax / Kimi / 其他
我的 Base URL：这里填
我的模型名：这里填

请你只帮我检查配置项，不要让我把 API Key 发给你。`,
        checks: ["API Key 没发给别人。", "测试问题能正常回复。", "知道当前窗口环境变量关闭后会失效。"],
      },
      {
        title: "3. 学会权限和 diff：让 Agent 真改，但别失控",
        why: "Claude Code 真正有价值，是能读文件、改文件、跑命令。风险也在这里。新手必须先学会限定范围、看 diff、跑验证。",
        steps: [
          "每次只给一个小任务，例如改一个按钮文案、修一个报错、补一个表单校验。",
          "任务开始前要求它列计划和涉及文件。",
          "修改后先看 diff，再允许继续做下一步。",
          "让它运行项目已有检查命令，并明确哪些没验证。",
        ],
        template: `我要让你改一个小功能。

目标：这里写清楚
允许修改的文件：这里写文件或目录
不要修改：这里写不能动的页面、配置、数据库或样式

请先列计划和会涉及的文件，等我确认后再改。
改完后请总结 diff、验证命令和剩余风险。`,
        checks: ["修改范围没有扩大。", "能看到 diff 摘要。", "有验证命令和结果。"],
      },
      {
        title: "4. 再学 hooks、skills、插件和子智能体",
        why: "这些不是炫技功能，而是把 Claude Code 从一次性聊天变成可复用工作系统。顺序很重要：先会小改动，再加规则和能力。",
        steps: [
          "CLAUDE.md / AGENTS.md：写项目说明、运行命令、禁止事项和交付标准。",
          "Hooks：把硬性检查放进去，例如完成前提醒跑 typecheck、测试或安全检查。",
          "Skills：把常用工作方法沉淀成可复用步骤，例如 UI 审计、教程改写、接口排错。",
          "Plugins / MCP：连接浏览器、GitHub、Figma、数据库、飞书等外部工具，但先从只读权限开始。",
          "Subagents：把研究、测试、UI、文案等任务拆给不同角色，避免一个 Agent 什么都做。",
        ],
        template: `请帮我为这个项目设计 Claude Code 协作规则。

需要包含：
1. CLAUDE.md 应该写哪些项目规则
2. 哪些检查适合做成 hook
3. 哪些重复任务适合做成 skill
4. 哪些工具可以通过 MCP 或插件接入
5. 哪些任务适合拆给 subagent

要求：先给方案，不要直接创建文件。`,
        checks: ["规则能解释为什么要加。", "工具权限默认保守。", "每个子智能体有清楚边界。"],
      },
      {
        title: "5. 最后做项目 MVP：从需求到上线检查",
        why: "看完教程不等于会用。真正合格的 Claude Code 教程，最后要让新手做出一个小项目，并知道怎么验收。",
        steps: [
          "先选小项目：AI 文案生成器、资料摘要页、报价计算器、客服 FAQ Bot 或个人作品页。",
          "让 Claude Code 先写需求、页面结构、数据结构和验收标准。",
          "分两到三轮实现，不要一次让它做完所有功能。",
          "每轮都看 diff、跑检查、用浏览器打开看页面。",
          "最后整理 README、环境变量说明、常见错误和下一步优化。",
        ],
        template: `我们做一个最小可用 AI 网页 App。

项目名称：
目标用户：
核心功能：
必须有的页面：
不做的功能：
验收标准：

请先输出 MVP 计划、文件改动范围和分阶段任务。不要马上写代码。`,
        checks: ["MVP 功能很小但完整。", "页面能打开。", "有 README、环境变量和验证记录。"],
      },
    ],
    ecosystemApps: [
      { name: "CC Switch", type: "模型切换", description: "适合用图形界面管理第三方模型和 Claude Code 模型切换。先确认来源可靠，再填 API Key。" },
      { name: "Claude Code Router", type: "模型路由", description: "适合需要多模型路由、预算控制或团队统一配置的人。新手先理解 base_url、model、key 三件事。" },
      { name: "MCP 工具连接", type: "工具扩展", description: "把浏览器、数据库、GitHub、飞书等能力接给 Agent。先用只读权限，确认日志和边界。" },
    ],
    skillPacks: [
      { name: "Frontend Design / UI 审计", when: "做网页页面、视觉系统、组件整理时使用。", install: "在 Claude Code 插件/skills 管理里搜索前端设计相关 skill，先项目级安装。" },
      { name: "Superpowers / 需求拆解", when: "做完整项目 MVP 前，用来脑暴、拆计划、复盘和 review。", install: "从可用插件列表安装到当前项目或个人目录，先看它会创建哪些文件。" },
      { name: "项目专属 Skill", when: "当你反复做同一类任务，例如资讯更新、教程改写、UI QA。", install: "让 Claude Code 先写 skill 草案和使用边界，确认后再放进项目规则。" },
    ],
    apiConnections: [minimaxOpenAiConnection, anthropicDeepseekConnection, openAiConnection],
  },
  {
    slug: "codex",
    name: "OpenAI Codex",
    title: "OpenAI Codex 一分钟直接跑通能用",
    category: "工程 Agent",
    minutes: "5-12 分钟",
    difficulty: "新手可跟",
    tagline: "Codex 是终端里的 OpenAI 编程 Agent，适合在 Git 项目中完成小功能和修复。",
    summary: "Codex 能读本地项目、提出修改、运行命令。新手先用默认确认模式，不要一开始开全自动。",
    bestFor: ["网页小功能", "代码解释", "修 bug", "写测试"],
    requirements: ["Node.js 18+", "OpenAI API Key 或可用登录方式", "一个 Git 项目目录"],
    officialUrl: "https://help.openai.com/en/articles/11096431-openai-codex-ci-getting-started",
    installSteps: [
      {
        title: "检查 Node.js",
        body: "打开终端，先确认 node 和 npm 能用。",
        command: `node -v
npm -v`,
      },
      {
        title: "安装 Codex",
        body: "复制下面这一段。国内 npm 慢时可以先设置镜像。",
        command: `npm install -g @openai/codex
codex --version`,
      },
      {
        title: "Windows npm 慢时",
        body: "PowerShell 可以用 npm.cmd 和镜像源。",
        command: `npm.cmd install -g @openai/codex --registry=https://registry.npmmirror.com
codex --version`,
      },
    ],
    startCommands: [
      {
        title: "进入项目再启动",
        body: "不要在桌面空目录里乱开。先进项目文件夹，再启动。",
        command: `cd 你的项目文件夹路径
codex`,
      },
      {
        title: "先用保守模式",
        body: "第一次让它只读项目、列计划，不要直接全自动。",
        command: "codex",
      },
    ],
    firstPrompts: [
      "请先阅读这个项目，不要改文件，只告诉我技术栈、主要目录和启动方式。",
      "我要改一个很小的功能，请先列计划和会涉及的文件，等我确认后再改。",
      "改完以后请运行项目已有的检查命令，并总结失败原因。",
    ],
    commonIssues: [
      {
        title: "codex 不是内部或外部命令",
        solution: "关闭终端重新打开。还不行就检查 npm 全局目录是否在 PATH。",
      },
      {
        title: "没有 OpenAI API Key",
        solution: "Codex 官方路线优先用 OpenAI。没有 OpenAI Key 时，不要硬填 DeepSeek Key 到官方 Provider，先换 OpenClaw / Cline / Claude Code 兼容路线。",
      },
      {
        title: "一上来要执行命令",
        solution: "新手选择需要确认的模式。看懂命令是做什么的，再允许执行。",
      },
    ],
    apiConnections: [codexOpenAiConnection, codexCompatibleConnection, minimaxOpenAiConnection],
  },
  {
    slug: "openclaw",
    name: "OpenClaw",
    title: "OpenClaw 一分钟直接跑通能用",
    category: "工程 Agent",
    minutes: "10-20 分钟",
    difficulty: "适合国内新手",
    tagline: "国内用户想接 DeepSeek V4，OpenClaw 是更直接的工程 Agent 路线之一。",
    summary: "OpenClaw 适合用国内模型 API 做代码和任务执行。Windows 用户优先用 WSL2，成功率更高。",
    bestFor: ["国内模型 API", "项目任务", "长期运行", "服务器部署"],
    requirements: ["Node.js 20+ 或官方安装脚本", "Windows 建议 WSL2", "DeepSeek API Key", "Git 项目目录"],
    officialUrl: "https://openclawdoc.com/docs/getting-started/installation/",
    installSteps: [
      {
        title: "Windows 先开 WSL2",
        body: "右键开始菜单，打开管理员 PowerShell，复制下面命令。重启后打开 Ubuntu。",
        command: "wsl --install",
      },
      {
        title: "Mac / Linux / WSL 安装",
        body: "在终端复制下面这一行。脚本会下载 OpenClaw 并安装依赖。",
        command: "curl -fsSL https://openclaw.ai/install.sh | bash",
      },
      {
        title: "Windows PowerShell 安装脚本",
        body: "如果官方文档要求在 PowerShell 执行，可以复制这一行。",
        command: "iwr -useb https://openclaw.ai/install.ps1 | iex",
      },
      {
        title: "初始化",
        body: "安装完成后按提示初始化。如果看到模型配置，就先填 DeepSeek V4 的 OpenAI Compatible。",
        command: "openclaw onboard",
      },
    ],
    startCommands: [
      {
        title: "启动 OpenClaw",
        body: "复制下面这一行启动。如果终端提示本地地址，就复制到浏览器打开。",
        command: "openclaw",
      },
      {
        title: "第一次测试",
        body: "让它先确认模型能回答。",
        command: "你好，请用中文告诉我你现在可以帮我做什么。",
      },
    ],
    firstPrompts: [
      "请先读取当前项目，不要修改文件，只告诉我项目结构和启动方式。",
      "帮我完成一个最小改动，先列计划，等我确认。",
      "如果需要执行命令，请先解释命令作用。",
    ],
    commonIssues: [
      {
        title: "openclaw: command not found",
        solution: "关闭终端重新打开，或让 shell 重新加载配置。",
        command: "source ~/.bashrc",
      },
      {
        title: "npm 下载很慢",
        solution: "先把 npm 源换成国内镜像，再重新安装。",
        command: "npm config set registry https://registry.npmmirror.com",
      },
      {
        title: "浏览器打不开 localhost",
        solution: "确认 OpenClaw 还在终端运行，并使用终端里真实提示的端口。",
      },
    ],
    ecosystemApps: [
      {
        name: "Claw Desktop",
        type: "官方/生态桌面控制台",
        description: "连接你的 OpenClaw gateway，用桌面端查看会话、审批高风险操作、看 diff、恢复运行。适合已经把 OpenClaw 跑在本机、服务器或 Mac mini 上的人。",
        href: "/agent-install/claw-desktop",
      },
      {
        name: "ClawX",
        type: "第三方开源图形界面",
        description: "给 OpenClaw 做图形化界面，把命令行里的 agent 编排、定时任务和渠道配置变成桌面操作。适合不想天天敲命令的小白。",
        href: "/agent-install/clawx",
      },
    ],
    skillPacks: [
      {
        name: "浏览器 / Web Research Skill",
        when: "让 OpenClaw 查资料、盯网页、做竞品监控时必装。",
        install: "在 OpenClaw 的 Skills / Marketplace 里搜索 browser、web research、monitoring 这类关键词，优先装官方或高下载量版本。",
      },
      {
        name: "文件 / Git / Diff Skill",
        when: "让 OpenClaw 改项目、看代码、生成交付物时必装。",
        install: "确认它能读取项目、展示 diff、提交前让你审批。不要给它默认删除文件权限。",
      },
      {
        name: "消息通知 Skill",
        when: "要把任务结果推送到 Slack、Discord、Telegram、企业微信或飞书时再装。",
        install: "先让 OpenClaw 本体跑通，再接消息渠道；不要一开始把网关、模型和消息平台三个问题混在一起排查。",
      },
      {
        name: "ClawX Skill",
        when: "如果你用 ClawX 做身份验证、状态检查或可信展示，可以加这个 skill。",
        install: "通过 Playbooks 安装 ClawX skill。",
        command: "npx playbooks add skill openclaw/skills --skill clawx",
      },
    ],
    apiConnections: [minimaxOpenAiConnection, deepseekOpenAiConnection, kimiConnection, openAiConnection],
  },
  {
    slug: "hermes",
    name: "Hermes Agent",
    title: "Hermes Agent 一分钟直接跑通能用",
    category: "自学习 Agent",
    minutes: "10-25 分钟",
    difficulty: "进阶一点",
    tagline: "Hermes 更适合长期任务、技能系统和带记忆的 Agent，Windows 用户走 WSL2。",
    summary: "Hermes 的 Windows 安装方式不是原生 PowerShell 安装，而是在 Windows 系统里开启 WSL2，再在 Ubuntu 终端中运行官方安装命令。小白先确认官网/官方文档来源，再按当前文档安装，不要运行陌生脚本。",
    bestFor: ["长期任务", "Skills 技能", "自学习 Agent", "消息入口"],
    requirements: ["Windows 10/11 需要 WSL2 Ubuntu", "Mac / Linux 可直接终端安装", "准备 Git，安装器会处理 Python、Node.js 等依赖", "DeepSeek 或 OpenAI Compatible API Key"],
    officialUrl: "https://hermes-agent.app/en/docs",
    installSteps: [
      {
        title: "Windows 系统安装方式：先装 WSL2",
        body: "Hermes 官方不支持原生 Windows 直接安装。Windows 用户的正确方式，是先在 Windows 里安装 WSL2 Ubuntu，然后在 Ubuntu 终端里安装 Hermes。",
        command: "wsl --install",
      },
      {
        title: "重启后打开 Ubuntu",
        body: "如果上一步提示重启电脑，就先重启。重启后从开始菜单打开 Ubuntu，第一次会让你设置用户名和密码。密码输入时屏幕不显示，这是正常的。",
      },
      {
        title: "Ubuntu 里先确认 Git",
        body: "Hermes 官方安装器唯一需要你提前准备的是 Git。打开 Ubuntu 后复制下面这行，能看到版本号就继续。",
        command: "git --version",
      },
      {
        title: "Windows WSL2 / Mac / Linux 一行安装",
        body: "确认你打开的是官方 Hermes 文档后，再复制官方安装脚本。这个脚本会处理 Python、Node.js、依赖和 PATH。Windows 用户要在 Ubuntu 里复制，不是在 PowerShell 里复制。",
        command: "curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash",
      },
      {
        title: "安装完刷新终端",
        body: "安装结束后复制下面这行，让当前 Ubuntu 终端识别 hermes 命令。Mac 如果用 zsh，就把 .bashrc 改成 .zshrc。",
        command: "source ~/.bashrc",
      },
      {
        title: "验证命令",
        body: "安装完成后关闭终端重开，再复制下面命令。",
        command: "hermes doctor",
      },
      {
        title: "Windows 另一种方式：Docker Desktop",
        body: "如果你熟悉 Docker，也可以用 Docker Desktop，并开启 WSL2 backend。小白优先走上面的 WSL2 Ubuntu 直装，少一个排错层。",
      },
    ],
    startCommands: [
      {
        title: "先配置模型",
        body: "先把模型 Provider 和 API Key 配好，再启动 Agent。",
        command: "hermes setup",
      },
      {
        title: "启动 Hermes",
        body: "配置完成后，先在终端里跑通对话，不要一上来接微信或飞书。",
        command: "hermes",
      },
      {
        title: "如果有 Dashboard",
        body: "当前版本如果支持 dashboard，再打开网页界面。",
        command: "hermes dashboard",
      },
    ],
    firstPrompts: [
      "请先用中文介绍你能做什么，先不要执行任何外部操作。",
      "我想让你长期帮我处理一个任务，请先问我目标、输入材料和交付格式。",
      "先在终端里回答成功，再考虑接飞书或企业微信。",
    ],
    commonIssues: [
      {
        title: "hermes command not found",
        solution: "关闭 Ubuntu 终端重开。还不行就执行 source ~/.bashrc，再运行 hermes doctor。",
        command: "source ~/.bashrc",
      },
      {
        title: "在 Windows PowerShell 里复制 curl 命令失败",
        solution: "这个命令要在 WSL2 Ubuntu 终端里执行，不是在原生 PowerShell 里执行。先从开始菜单打开 Ubuntu。",
      },
      {
        title: "脚本来源不确定",
        solution: "停下来。只按官网、官方 GitHub 或官方文档的安装命令执行。",
      },
      {
        title: "消息平台收不到回复",
        solution: "先确认 Hermes 本体能在终端回答，再排查飞书/企业微信网关。",
      },
    ],
    apiConnections: [minimaxOpenAiConnection, deepseekOpenAiConnection, kimiConnection, openAiConnection],
  },
  {
    slug: "cursor-agent",
    name: "Cursor Agent",
    title: "Cursor Agent 一分钟直接跑通能用",
    category: "产品方官方 Agent 桌面应用",
    minutes: "5-10 分钟",
    difficulty: "最像普通软件",
    tagline: "不想先学终端的小白，可以先用 Cursor 打开项目，再用 Agent 改小功能。",
    summary: "Cursor 是桌面编辑器，Agent 能读项目、改代码。它不是模型，模型 Key 在设置里配置。",
    bestFor: ["不会终端的新手", "网页小功能", "边看代码边改", "轻量项目"],
    requirements: ["下载安装 Cursor", "一个项目文件夹", "Cursor 账号", "可选：OpenAI/Anthropic/Gemini API Key"],
    officialUrl: "https://docs.cursor.com/advanced/api-keys",
    installSteps: [
      {
        title: "下载 Cursor",
        body: "打开 cursor.com，下载你电脑对应版本，像普通软件一样安装。",
      },
      {
        title: "打开项目文件夹",
        body: "打开 Cursor，点击 Open Folder，选择你的项目文件夹。",
      },
      {
        title: "打开 Agent",
        body: "在 Cursor 里打开 Chat/Agent 面板，先让它读项目，不要直接大改。",
      },
    ],
    startCommands: [
      {
        title: "第一次让它读项目",
        body: "复制到 Cursor Agent 对话框。",
        command: "请先阅读这个项目，不要改文件，告诉我项目结构、启动方式和你建议我先改哪里。",
      },
    ],
    firstPrompts: [
      "只改我指定的页面，不要重构全项目。",
      "改之前先列出会碰到哪些文件，等我确认。",
      "改完请告诉我怎么启动、怎么检查。",
    ],
    commonIssues: [
      {
        title: "API Key 填了但部分功能还是走内置模型",
        solution: "Cursor 官方说明：自定义 API Key 主要用于标准聊天模型，补全等特殊能力可能仍使用 Cursor 内置模型。",
      },
      {
        title: "Agent 改太多文件",
        solution: "提示词里明确只允许改哪些文件，并要求先列计划。",
      },
      {
        title: "DeepSeek Key 不知道填哪里",
        solution: "Cursor 官方设置主要支持 OpenAI、Anthropic、Google、Azure、Bedrock 等。DeepSeek 这类自定义 base_url 要看当前版本是否开放对应入口。",
      },
    ],
    apiConnections: [minimaxOpenAiConnection, openAiConnection, kimiConnection, deepseekOpenAiConnection],
  },
  {
    slug: "cline",
    name: "Cline",
    title: "Cline 一分钟直接跑通能用",
    category: "VS Code Agent 插件",
    minutes: "8-15 分钟",
    difficulty: "新手可跟",
    tagline: "如果你已经用 VS Code，Cline 是接 DeepSeek / Kimi 这类 API 很直接的 Agent 插件。",
    summary: "Cline 在 VS Code 里运行，可以接多种模型 Provider。适合小白先体验“AI 读项目、改文件、跑命令”的完整过程。",
    bestFor: ["VS Code 用户", "DeepSeek API", "Kimi API", "一步步确认改代码"],
    requirements: ["VS Code", "Cline 扩展", "DeepSeek/Kimi/OpenAI API Key", "一个项目文件夹"],
    installSteps: [
      {
        title: "安装 VS Code",
        body: "打开 code.visualstudio.com，下载并安装 VS Code。",
      },
      {
        title: "安装 Cline 扩展",
        body: "打开 VS Code 左侧 Extensions，搜索 Cline，点击 Install。",
      },
      {
        title: "打开项目并配置模型",
        body: "打开项目文件夹，打开 Cline 面板，选择 OpenAI Compatible，然后按下面 API 区域填写。",
      },
    ],
    startCommands: [
      {
        title: "第一次测试",
        body: "复制到 Cline 输入框，先看它是否能读项目。",
        command: "请先读取当前项目，不要改文件，只告诉我项目结构和启动方式。",
      },
      {
        title: "开始一个小任务",
        body: "确认模型能回答后，再给一个很小的目标。",
        command: "请只修改首页标题文案，改之前先告诉我你会改哪个文件。",
      },
    ],
    firstPrompts: [
      "执行命令前先解释作用，等我确认。",
      "不要删除文件，不要改配置文件，除非我明确同意。",
      "每次只做一个小目标，改完给我检查方式。",
    ],
    commonIssues: [
      {
        title: "OpenAI Compatible 后还是报错",
        solution: "检查 Base URL 是否符合当前工具要求。有的工具要 https://api.deepseek.com，有的工具要 https://api.deepseek.com/v1。",
      },
      {
        title: "模型一直无响应",
        solution: "先去模型平台官网确认 API Key、余额、模型名。工具里先用 flash 跑通。",
      },
      {
        title: "Cline 要执行危险命令",
        solution: "拒绝执行，并让它解释命令作用。新手不要允许删除、部署、支付相关命令。",
      },
    ],
    apiConnections: [minimaxOpenAiConnection, deepseekOpenAiConnection, kimiConnection, openAiConnection],
  },
]

const agentDesktopAppGuides: AgentInstallGuide[] = [
  {
    slug: "codex-app",
    name: "Codex App",
    title: "Codex 产品方官方桌面端安装和设置教程",
    category: "产品方官方 Agent 桌面应用",
    minutes: "5-12 分钟",
    difficulty: "官方桌面端",
    tagline: "OpenAI Codex 官方桌面端，用来在本机管理工程 Agent、查看 diff、跑命令和恢复长任务。",
    summary: "Codex App 是 OpenAI 官方 Agent 桌面应用，不是第三方壳，也不是普通聊天客户端。它适合把本地项目交给 Codex 处理：先读项目、列计划、改小范围文件、运行验证，再把结果交给你确认。",
    bestFor: ["官方 Agent", "本地项目", "长任务", "代码修改"],
    requirements: ["Windows 或 macOS", "ChatGPT / OpenAI 账号", "一个本地项目文件夹", "建议已安装 Git 和 Node.js"],
    officialUrl: "https://openai.com/academy/codex-how-to-start",
    installSteps: [
      { title: "打开官方入口", body: "访问 OpenAI Academy 的 Codex 入门页，按页面提示下载 Codex desktop app 并使用 ChatGPT 账号登录。只从 OpenAI / ChatGPT 官方入口下载安装，不要从网盘、群文件或陌生站点下载所谓 Codex 桌面端。" },
      { title: "下载并安装桌面端", body: "按页面提示下载 Windows 或 macOS 安装包。像普通软件一样安装，第一次打开后用 ChatGPT / OpenAI 账号登录。" },
      { title: "选择本地项目", body: "打开 Codex App 后选择一个本地项目文件夹。第一次不要选含有客户隐私、密钥或生产数据的项目。" },
      { title: "确认权限边界", body: "开始任务前先检查 Codex 能读写哪些目录、命令是否需要审批、是否会访问网络。新手先保持审批打开。" },
    ],
    startCommands: [
      { title: "第一次只读项目", body: "在 Codex App 里打开项目后，先发一个只读请求。", command: "请先阅读这个项目，不要修改文件，告诉我项目结构、启动方式、验证命令和你建议我先做的最小任务。" },
      { title: "第一次小改动", body: "确认它能理解项目后，只给一个很小的修改范围。", command: "请只修改首页一个文案。改之前先列出会改哪些文件，改完告诉我如何验证。" },
    ],
    firstPrompts: [
      "请先列计划，不要直接改文件。",
      "只允许修改我指定的文件，其他文件不要碰。",
      "涉及删除、提交、推送、部署、安装依赖或读取密钥时，必须先问我。",
    ],
    commonIssues: [
      { title: "找不到 Codex 桌面端下载入口", solution: "先从 OpenAI Academy 的 Codex 入门页或 ChatGPT 官方 Codex 入口进入，不要搜索下载站。入口可能随账号、地区、套餐逐步开放。" },
      { title: "和 Codex CLI 搞混", solution: "Codex App 是官方桌面端；OpenAI Codex 是工程 Agent；Codex CLI 是命令行使用方式。桌面端不等于第三方客户端。" },
      { title: "想填 DeepSeek 或 Kimi Key", solution: "官方 Codex 路线优先使用 OpenAI / ChatGPT 账号和官方能力。要接 DeepSeek / Kimi，优先看 OpenClaw、Cline、Cherry Studio 或 Claude Code 兼容路线。" },
      { title: "Agent 想执行高风险命令", solution: "先拒绝，让它解释命令作用和影响范围。删除文件、提交推送、部署生产、安装未知包之前都要人工确认。" },
    ],
    apiConnections: [noCustomApiConnection("Codex App"), openAiConnection],
  },
  {
    slug: "claw-desktop",
    name: "Claw Desktop",
    title: "Claw Desktop 一分钟直接跑通能用",
    category: "第三方 Agent 桌面应用",
    minutes: "5-10 分钟",
    difficulty: "OpenClaw 配套",
    tagline: "OpenClaw 的桌面控制台，用来查看运行、审批操作、看 diff 和恢复会话。",
    summary: "Claw Desktop 不是模型，也不是新的 Agent 本体。它是 OpenClaw 的桌面控制层：你的 Agent 仍然运行在本机、服务器或网关上，Claw Desktop 负责把会话、审批、产物和健康状态展示出来。",
    bestFor: ["OpenClaw 控制台", "审批操作", "查看 diff", "恢复会话"],
    requirements: ["macOS 12+ 或 Windows 10 64-bit+", "已经有 OpenClaw gateway / instance", "Host URL", "OpenClaw API Key"],
    officialUrl: "https://claw.so/download/",
    installSteps: [
      { title: "先把 OpenClaw 跑起来", body: "Claw Desktop 是控制台，不是 Agent 本体。先确认 OpenClaw 已经能在本机、VPS 或 Mac mini 上运行。" },
      { title: "下载桌面端", body: "访问 claw.so/download，Mac 选择 Apple Silicon 或 Intel；Windows 选择 Windows x64。Linux 页面如果显示 Coming Soon，就不要找非官方包。" },
      { title: "安装并打开", body: "Windows 如果 SmartScreen 提示，先确认来源是 claw.so，再点 More info → Run anyway。Mac 直接拖到 Applications。" },
      { title: "连接 OpenClaw", body: "打开 Claw Desktop，输入你的 OpenClaw Host URL，再粘贴 API Key，然后开始查看 runs、artifacts、diff 和审批队列。" },
    ],
    startCommands: [
      { title: "连接信息怎么填", body: "Host URL 填你的 OpenClaw 运行地址；API Key 填 OpenClaw 给你的访问密钥。不要把模型 API Key 填到这里。" },
      { title: "第一次检查", body: "打开后先看 sessions / approvals / artifacts 是否能同步，确认成功后再让 OpenClaw 跑长期任务。" },
    ],
    firstPrompts: [
      "请只显示这次运行涉及的文件 diff 和验证结果。",
      "高风险命令必须进入审批队列，不要自动执行。",
      "请帮我恢复上一次 Slack 里开始的 run_id。",
    ],
    commonIssues: [
      { title: "填了 DeepSeek Key 但连不上", solution: "这里不能填 DeepSeek Key。Claw Desktop 要的是 OpenClaw API Key；DeepSeek Key 应该填在 OpenClaw 模型 Provider 里。" },
      { title: "看不到会话", solution: "确认 OpenClaw gateway 正在运行，并且 Host URL 是浏览器能访问的地址。" },
      { title: "Windows 安装被拦截", solution: "先确认下载来源是 claw.so，再按系统提示继续。不要运行群文件里的安装包。" },
    ],
    apiConnections: [noCustomApiConnection("Claw Desktop"), minimaxOpenAiConnection, deepseekOpenAiConnection],
  },
  {
    slug: "clawx",
    name: "ClawX",
    title: "ClawX 一分钟直接跑通能用",
    category: "第三方 Agent 桌面应用",
    minutes: "8-15 分钟",
    difficulty: "OpenClaw 图形界面",
    tagline: "第三方开源 OpenClaw 图形界面，把命令行 Agent 编排变成桌面操作。",
    summary: "ClawX 是 OpenClaw 生态里的第三方开源桌面界面。它适合不想一直敲命令的用户，用可视化方式管理 agent、定时任务、渠道和自动研究流程。安装前要看清项目来源和版本。",
    bestFor: ["OpenClaw GUI", "定时任务", "研究助理", "少敲命令"],
    requirements: ["Windows / macOS / Linux 视发布包而定", "已安装或准备安装 OpenClaw", "DeepSeek / Kimi / OpenAI Compatible API Key", "只从官方项目页或 GitHub release 下载"],
    officialUrl: "https://github.com/ValueCell-ai/ClawX",
    installSteps: [
      { title: "确认项目来源", body: "打开 GitHub 的 ValueCell-ai/ClawX 或项目官方站。不要从来路不明的下载站拿安装包。" },
      { title: "下载安装包", body: "进入 Releases，按你的系统选择 Windows、macOS 或 Linux 包。如果当前 release 没有你的系统版本，就不要硬找第三方包。" },
      { title: "连接 OpenClaw", body: "打开 ClawX 后，按向导填写 OpenClaw 本体地址、模型 Provider 和 API Key。" },
      { title: "先建一个测试任务", body: "不要一上来接所有渠道。先建一个只在本机运行的测试任务，确认能启动、能停止、能看到日志。" },
    ],
    startCommands: [
      { title: "第一次测试", body: "新建一个简单研究任务，不要填隐私资料。", command: "每天早上 9 点检查我指定的 3 个公开网页，输出 5 条变化摘要。" },
      { title: "再接消息渠道", body: "确认本地任务能跑以后，再接 Telegram、Slack、飞书或企业微信。" },
    ],
    firstPrompts: [
      "请先创建一个只读网页监控任务，不要访问我的本地文件。",
      "请把每次运行结果保存成摘要，并保留来源链接。",
      "如果任务失败，请告诉我失败阶段：模型、网页、渠道还是定时器。",
    ],
    commonIssues: [
      { title: "ClawX 和 OpenClaw 是不是一个东西", solution: "不是。OpenClaw 是 Agent 运行本体；ClawX 是第三方图形界面/桌面壳，用来管理和操作 OpenClaw。" },
      { title: "启动后找不到 Agent", solution: "先确认 OpenClaw 本体已经运行，再在 ClawX 里填写正确的 Host URL、API Key 或本地地址。" },
      { title: "消息渠道收不到结果", solution: "先确认本地任务能成功运行，再排查 Slack、Telegram、飞书等渠道配置。" },
    ],
    skillPacks: [
      {
        name: "ClawX Skill",
        when: "需要做 ClawX 身份验证、状态展示、可信层级展示时安装。",
        install: "通过 Playbooks 安装。",
        command: "npx playbooks add skill openclaw/skills --skill clawx",
      },
      {
        name: "Web Monitoring Skill",
        when: "ClawX 用来盯网页、新闻、竞品、资料源时安装。",
        install: "在 OpenClaw / ClawX 的 skills 市场里搜索 web monitoring 或 research。",
      },
      {
        name: "Messaging Skill",
        when: "需要把结果推送到 Slack、Telegram、飞书、企业微信时安装。",
        install: "先完成本地测试，再接消息渠道，避免同时排查多个问题。",
      },
    ],
    apiConnections: [minimaxOpenAiConnection, deepseekOpenAiConnection, kimiConnection, openAiConnection],
  },
  {
    slug: "windsurf",
    name: "Windsurf",
    title: "Windsurf 一分钟直接跑通能用",
    category: "产品方官方 Agent 桌面应用",
    minutes: "5-10 分钟",
    difficulty: "新手可跟",
    tagline: "Windsurf 是带 Cascade Agent 的 AI IDE，下载安装到电脑后直接打开项目使用。",
    summary: "Windsurf 是桌面端 AI 编程 IDE。它的 Cascade 能理解代码库、编辑多文件、运行命令，还能通过 MCP 和浏览器上下文扩展能力。新手先让它读项目，再让它改一个小功能。",
    bestFor: ["AI IDE", "Cascade Agent", "网页项目", "多文件修改"],
    requirements: ["Windows / macOS / Linux", "Windsurf 账号", "一个项目文件夹", "建议先准备 Git"],
    officialUrl: "https://windsurf.com/download",
    installSteps: [
      { title: "打开官方下载页", body: "访问 windsurf.com/download，选择 Windsurf Editor，不要先装插件版。新手直接用完整桌面 IDE。" },
      { title: "选择系统版本", body: "Windows 下载安装包；Mac 下载对应芯片版本；Linux 按官方页面选择 AppImage、deb 或 rpm。" },
      { title: "安装并登录", body: "像普通软件一样安装。第一次打开后登录账号，可以选择导入 VS Code / Cursor 配置。" },
      { title: "打开项目", body: "点击 Open Folder，选择你的项目文件夹。先让 Cascade 读取项目，不要马上大改。" },
    ],
    startCommands: [
      { title: "第一次测试", body: "把这句话复制到 Cascade。", command: "请先阅读这个项目，不要修改文件，告诉我项目结构、启动方式和你建议我先检查哪里。" },
      { title: "开始小任务", body: "确认它能读项目后，再给一个很小的目标。", command: "请只修改首页一个文案，改之前先告诉我会改哪个文件。" },
    ],
    firstPrompts: [
      "请先列计划，不要直接改文件。",
      "只允许修改我指定的文件，其他文件不要碰。",
      "如果要运行命令，请先解释命令作用，等我确认。",
    ],
    commonIssues: [
      { title: "不知道下载 Editor 还是插件", solution: "新手选 Windsurf Editor。插件适合已经长期用 JetBrains 或 VS Code 的人。" },
      { title: "Cascade 改动太多", solution: "提示词里明确只改一个文件或一个小功能，要求它先列计划。" },
      { title: "账号或额度不够", solution: "先在官方账号里确认 plan 和 credits。不要把 API Key 发给不明中转站。" },
    ],
    apiConnections: [minimaxOpenAiConnection, openAiConnection, deepseekOpenAiConnection, kimiConnection],
  },
  {
    slug: "kiro",
    name: "Kiro",
    title: "Kiro 一分钟直接跑通能用",
    category: "产品方官方 Agent 桌面应用",
    minutes: "5-12 分钟",
    difficulty: "适合做规范项目",
    tagline: "Kiro 是 Agentic IDE，强调规格驱动开发、Agent Hooks 和从需求到代码的闭环。",
    summary: "Kiro 是桌面 AI IDE，也提供 CLI。它适合把自然语言需求拆成 requirements、design、tasks，再让 Agent 按任务逐步实现。小白用它时不要跳过规格步骤。",
    bestFor: ["规格驱动", "Agent Hooks", "大型需求", "VS Code 迁移"],
    requirements: ["macOS / Windows 10/11 64-bit / Linux", "Kiro 登录账号", "一个项目文件夹", "Windows ARM 当前不支持"],
    officialUrl: "https://kiro.dev/docs/getting-started/installation/",
    installSteps: [
      { title: "打开官方下载页", body: "访问 kiro.dev，进入 Downloads 或 Installation 页面，按系统下载安装包。" },
      { title: "确认系统要求", body: "Windows 需要 10/11 64 位；macOS 支持 Intel 和 Apple silicon；Linux 需要 glibc 2.39 或更高。" },
      { title: "安装并首次启动", body: "打开安装包，按提示安装。第一次启动会要求登录，并可导入 VS Code 设置和扩展。" },
      { title: "允许 Shell 集成", body: "首次引导里如果提示 shell integration，可以按需允许，这样 Agent 才能代表你执行命令。" },
    ],
    startCommands: [
      { title: "打开项目", body: "在 Kiro 里打开你的项目文件夹，先让它生成规格，不要直接写代码。", command: "请根据这个项目，先把我要做的功能拆成 requirements、design 和 tasks，不要修改文件。" },
      { title: "执行一个任务", body: "等它拆好 tasks 后，只让它执行第一步。", command: "只执行第 1 个任务，改之前先告诉我会修改哪些文件。" },
    ],
    firstPrompts: [
      "请先写需求和验收标准，不要直接改代码。",
      "请把这个目标拆成最小可执行任务，每次只做一步。",
      "改完请告诉我怎么验证，不要只说完成了。",
    ],
    commonIssues: [
      { title: "Windows ARM 装不了", solution: "Kiro 官方 Windows 要求 10/11 64-bit，ARM 当前不支持。换 x64 电脑或用其他工具。" },
      { title: "Linux 打不开", solution: "检查发行版 glibc 版本。官方要求 glibc 2.39+，老 Ubuntu 版本可能不行。" },
      { title: "一上来想直接生成完整项目", solution: "Kiro 的强项是先规格后实现。先让它拆 requirements / design / tasks。" },
    ],
    apiConnections: [noCustomApiConnection("Kiro"), minimaxOpenAiConnection, openAiConnection],
  },
  {
    slug: "trae",
    name: "TRAE IDE",
    title: "TRAE IDE 一分钟直接跑通能用",
    category: "产品方官方 Agent 桌面应用",
    minutes: "5-10 分钟",
    difficulty: "国内新手友好",
    tagline: "TRAE 是桌面 AI IDE，适合想用中文界面和可视化 Agent 工作流的新手。",
    summary: "TRAE IDE 是 AI 编程桌面应用，支持 Windows、macOS 和 Linux 包。它更像一个带 Agent 的编程工作台，不是单纯聊天工具。下载时一定用 TRAE 官方站。",
    bestFor: ["中文界面", "AI IDE", "新手编程", "项目上下文"],
    requirements: ["Windows 10/11 或 macOS 12.0+", "Linux 可选 deb / rpm", "TRAE 账号", "建议 8GB 内存以上"],
    officialUrl: "https://www.trae.cn/ide/download",
    installSteps: [
      { title: "打开官方下载页", body: "访问 trae.cn/ide/download。不要使用陌生下载站或带币、投资字样的网站。" },
      { title: "选择 TRAE IDE", body: "新手选 TRAE IDE。TRAE SOLO 是另一条产品线，Windows 版本如果显示即将推出，就先不要找非官方包。" },
      { title: "按系统安装", body: "Windows 下载 x64；Mac 下载 Apple Silicon dmg；Linux 可选 deb 或 rpm。" },
      { title: "首次启动", body: "打开 TRAE，选择语言、主题，按需导入已有编辑器设置，再登录账号。" },
    ],
    startCommands: [
      { title: "打开项目", body: "在 TRAE 里打开项目文件夹，先让它理解项目。", command: "请先阅读当前项目，不要修改文件，用中文告诉我项目结构和启动方式。" },
      { title: "开始小任务", body: "第一次只给一个小目标。", command: "请只改一个按钮文案，改之前先列出会修改的文件。" },
    ],
    firstPrompts: [
      "请用中文一步一步带我做，不要一次给太多内容。",
      "请先解释你准备怎么改，再等我确认。",
      "请不要读取或上传我的隐私文件。",
    ],
    commonIssues: [
      { title: "下载页面很多版本看不懂", solution: "新手选 TRAE IDE，不要选不确定的 SOLO 测试包。Windows 选 x64。" },
      { title: "安全软件拦截", solution: "先确认下载地址是 trae.cn 官方，再按系统提示处理。不要运行来路不明安装包。" },
      { title: "担心隐私", solution: "先用无隐私的小项目测试。公司代码、客户资料、API Key 不要随便交给任何新工具。" },
    ],
    apiConnections: [noCustomApiConnection("TRAE IDE"), minimaxOpenAiConnection, openAiConnection],
  },
  {
    slug: "qoder",
    name: "Qoder",
    title: "Qoder 一分钟直接跑通能用",
    category: "产品方官方 Agent 桌面应用",
    minutes: "5-12 分钟",
    difficulty: "适合真实项目",
    tagline: "Qoder 是 Agentic Coding Platform，有 AI-Native IDE、CLI 和 JetBrains 插件。",
    summary: "Qoder 适合真实软件开发场景，强调代码库理解、Agentic Chat、Experts、Quest、Repo Wiki 和 MCP。新手先安装 IDE 桌面版，再打开项目测试 Ask / Agent 模式。",
    bestFor: ["Agentic Chat", "Repo Wiki", "Quest", "JetBrains 插件"],
    requirements: ["Windows / macOS / Linux", "Qoder 账号", "一个真实项目", "需要网络登录和模型服务"],
    officialUrl: "https://docs.qoder.com/",
    installSteps: [
      { title: "打开官方入口", body: "访问 qoder.com 或 docs.qoder.com，从 Downloads 进入下载。不要优先用第三方下载页。" },
      { title: "安装 Qoder IDE", body: "按你的系统下载安装包。Qoder 也有 CLI 和 JetBrains Plugin，新手先装 IDE 桌面版。" },
      { title: "登录账号", body: "第一次启动后登录 Qoder 账号，再打开项目文件夹。" },
      { title: "先生成 Repo Wiki", body: "如果项目较大，先让它分析项目并生成 Repo Wiki，帮助 Agent 理解代码结构。" },
    ],
    startCommands: [
      { title: "第一次测试", body: "打开项目后先问结构，不要直接改。", command: "请先分析这个项目，不要改文件，告诉我主要目录、技术栈和启动方式。" },
      { title: "让 Agent 做小任务", body: "确认理解项目后，再给它一个小任务。", command: "请只实现一个小功能，先列计划和涉及文件，等我确认后再改。" },
    ],
    firstPrompts: [
      "请先建立项目理解，不要直接修改。",
      "请用 Ask 模式解释问题，用 Agent 模式执行我确认过的小任务。",
      "请把隐含的项目知识整理成 Repo Wiki。",
    ],
    commonIssues: [
      { title: "不知道 IDE、CLI、插件选哪个", solution: "新手先选 Qoder IDE。会终端再用 CLI，长期用 JetBrains 再装插件。" },
      { title: "项目太大分析慢", solution: "先让它只分析一个目录，或先生成 Repo Wiki，不要一次让它改全项目。" },
      { title: "模型和套餐限制", solution: "先看账号当前 plan、credits、可用模型。别把它当成本地免费模型。" },
    ],
    apiConnections: [noCustomApiConnection("Qoder"), minimaxOpenAiConnection, openAiConnection],
  },
]

const additionalEngineeringAgentGuides: AgentInstallGuide[] = [
  {
    slug: "github-copilot-agent",
    name: "GitHub Copilot Agent",
    title: "GitHub Copilot Agent 安装和使用入口教程",
    category: "产品方官方 Agent 插件",
    minutes: "8-15 分钟",
    difficulty: "适合 GitHub 用户",
    tagline: "GitHub 官方 Copilot Agent 能在 GitHub、VS Code 和 IDE 里帮你改代码、开 PR、做后台任务。",
    summary: "GitHub Copilot 现在不只是补全工具，还包括 IDE 里的 Agent mode 和 GitHub 上的 Copilot cloud agent。小白要分清：IDE Agent mode 是本地协作，cloud agent 是在 GitHub Actions 环境里后台工作并生成分支或 PR。",
    bestFor: ["GitHub 项目", "VS Code", "PR 工作流", "团队协作"],
    requirements: ["GitHub 账号", "Copilot 可用套餐", "VS Code / JetBrains / GitHub.com", "仓库已启用相应权限"],
    officialUrl: "https://docs.github.com/en/copilot/concepts/about-copilot-coding-agent",
    installSteps: [
      { title: "确认 Copilot 权限", body: "先确认你的账号或组织已经开通 Copilot，并允许使用 coding agent / cloud agent。团队仓库还需要管理员策略允许。" },
      { title: "安装 IDE 插件", body: "VS Code 用户安装 GitHub Copilot 和 GitHub Copilot Chat 扩展；JetBrains 用户在插件市场安装 GitHub Copilot。" },
      { title: "分清两种 Agent", body: "IDE Agent mode 会在你本地编辑器里改文件；Copilot cloud agent 会在 GitHub 后台环境里创建分支和 PR。" },
      { title: "先用测试 issue", body: "第一次不要交给它生产任务。新建一个小 issue，例如改 README、补一个测试或修一个小文案。" },
    ],
    startCommands: [
      { title: "IDE 里第一次测试", body: "打开 Copilot Chat，选择 Agent mode，再发一个只读请求。", command: "请先阅读当前项目，不要修改文件，告诉我项目结构、启动方式和建议的最小修改任务。" },
      { title: "GitHub 后台任务", body: "在 GitHub issue 或 Agents 面板里描述一个很小的任务，让它生成分支或 PR，然后人工 review。" },
    ],
    firstPrompts: [
      "请先给计划和涉及文件，不要直接大改。",
      "请只处理这个 issue，不要顺手重构其他代码。",
      "PR 里请写清楚改了什么、怎么验证、还有什么没做。",
    ],
    commonIssues: [
      { title: "Agent mode 和 cloud agent 搞混", solution: "Agent mode 在 IDE 本地改；cloud agent 在 GitHub 后台改并开 PR。新手先用 IDE 模式熟悉，再用 cloud agent 跑小 issue。" },
      { title: "看不到 Copilot Agent", solution: "检查账号套餐、组织策略、仓库权限和 VS Code 扩展版本。" },
      { title: "PR 改动太大", solution: "把 issue 写小，只给一个明确验收标准，并要求 Copilot 先开 draft PR 供 review。" },
    ],
    apiConnections: [noCustomApiConnection("GitHub Copilot Agent")],
  },
  {
    slug: "gemini-cli",
    name: "Gemini CLI",
    title: "Gemini CLI 安装和安全启动教程",
    category: "工程 Agent",
    minutes: "8-15 分钟",
    difficulty: "需要 Node.js",
    tagline: "Google 官方开源终端 Agent，把 Gemini 接到本地命令行里读项目、改代码和跑命令。",
    summary: "Gemini CLI 是 Google Gemini 的命令行 Agent。它适合会一点终端的用户，用 Google 账号或 Gemini API 把模型能力接进本地项目。最近冒充 Gemini CLI 的假包和假网站不少，安装时一定认准官方包名和官方仓库。",
    bestFor: ["Google 账号", "终端 Agent", "代码分析", "多模态"],
    requirements: ["Node.js 20+", "npm", "Google 账号或 Gemini API Key", "一个测试项目"],
    officialUrl: "https://github.com/google-gemini/gemini-cli/blob/main/docs/get-started/index.md",
    installSteps: [
      { title: "确认官方包名", body: "官方 npm 包是 @google/gemini-cli。不要安装 gemini-cli、gemini/cli 或陌生网站给的一键脚本。" },
      { title: "安装 Gemini CLI", body: "复制官方 npm 安装命令到终端。Windows 用 PowerShell，macOS/Linux 用 Terminal。", command: "npm install -g @google/gemini-cli" },
      { title: "启动并登录", body: "安装后在项目目录运行 gemini，按提示使用 Google 账号或 API Key 认证。", command: "gemini" },
      { title: "先只读项目", body: "第一次只让它读取和解释项目，不要允许它直接执行大范围命令。" },
    ],
    startCommands: [
      { title: "验证版本", body: "如果系统识别命令，说明安装入口已经打通。", command: "gemini --version" },
      { title: "第一次项目测试", body: "在项目目录运行 gemini 后输入：", command: "请先阅读这个项目，不要修改文件，告诉我项目结构、启动命令和你建议的第一个小任务。" },
    ],
    firstPrompts: [
      "执行命令前先解释作用。",
      "只允许读取当前项目，不要访问其他目录。",
      "改文件前先列计划和文件清单。",
    ],
    commonIssues: [
      { title: "装错假包", solution: "停下来卸载可疑包，只从 Google 官方 GitHub 或 npm 的 @google/gemini-cli 安装。" },
      { title: "gemini command not found", solution: "确认 npm 全局目录在 PATH 里，或关闭终端重开后再试。" },
      { title: "认证失败", solution: "先用 Google 账号登录方式跑通；企业环境再看 Google Cloud / Vertex AI 权限。" },
    ],
    apiConnections: [noCustomApiConnection("Gemini CLI")],
  },
  {
    slug: "qwen-code",
    name: "Qwen Code",
    title: "Qwen Code 安装和通义千问账号启动教程",
    category: "工程 Agent",
    minutes: "8-15 分钟",
    difficulty: "国内友好",
    tagline: "Qwen 官方命令行工程 Agent，适合想用通义千问/Qwen Coder 跑项目任务的人。",
    summary: "Qwen Code 是 Qwen 团队面向开发者的命令行 AI workflow 工具，适合读代码、自动化任务和项目协作。它基于 Gemini CLI 思路适配 Qwen Coder，新手先用官方 OAuth 或官方 API 路线，不要随便装第三方改包。",
    bestFor: ["Qwen Coder", "国内账号", "终端 Agent", "代码理解"],
    requirements: ["Node.js", "npm", "Qwen / 通义千问账号或 API Key", "一个本地项目"],
    officialUrl: "https://qwenlm.github.io/qwen-code-docs/en/deployment/",
    installSteps: [
      { title: "安装官方包", body: "按 Qwen Code 官方文档安装 npm 包。", command: "npm install -g @qwen-code/qwen-code@latest" },
      { title: "启动 Qwen Code", body: "安装后在项目目录运行 qwen，按提示选择 Qwen OAuth 或 OpenAI Compatible 配置。", command: "qwen" },
      { title: "先用账号登录", body: "新手优先走 Qwen OAuth。需要团队统一 Key 时，再配置 OpenAI Compatible。" },
      { title: "先只读项目", body: "第一次让它读项目、解释结构，不要马上让它改大功能。" },
    ],
    startCommands: [
      { title: "检查命令", body: "确认 qwen 命令能启动。", command: "qwen --version" },
      { title: "第一次测试", body: "进入项目后输入：", command: "请先阅读当前项目，不要改文件，告诉我项目结构、技术栈和启动方式。" },
    ],
    firstPrompts: [
      "请先问清目标和验收标准。",
      "只改我指定的文件。",
      "所有命令先解释，再等我确认。",
    ],
    commonIssues: [
      { title: "npm 安装失败", solution: "先检查 Node.js 和 npm 版本，再考虑切换国内 npm 镜像。" },
      { title: "模型额度或限流", solution: "先用短任务测试，长任务会产生多次调用，可能消耗更多额度。" },
      { title: "和 Qwen 模型搞混", solution: "Qwen 是模型家族；Qwen Code 是命令行 Agent 工具。" },
    ],
    apiConnections: [noCustomApiConnection("Qwen Code"), openAiConnection],
  },
  {
    slug: "aider",
    name: "Aider",
    title: "Aider 终端 AI 结对编程安装教程",
    category: "工程 Agent",
    minutes: "10-20 分钟",
    difficulty: "需要 Python/Git",
    tagline: "开源终端结对编程 Agent，擅长在现有 Git 项目里改代码、看 diff 和提交小步变更。",
    summary: "Aider 是终端里的 AI pair programming 工具，可以读取代码库、按聊天请求修改文件，并和 Git diff 结合。它不是桌面 App，新手适合在一个小 Git 项目里先跑通。",
    bestFor: ["开源工具", "终端改代码", "Git diff", "多模型"],
    requirements: ["Python", "Git", "一个 Git 项目", "OpenAI / Anthropic / DeepSeek / 本地模型接口"],
    officialUrl: "https://aider.chat/",
    installSteps: [
      { title: "确认 Python 和 Git", body: "先确认 Python 和 Git 可用。", command: "python --version\ngit --version" },
      { title: "安装 Aider", body: "按官方文档安装 Aider。Windows 如果 pip 权限报错，可以先使用用户目录安装。", command: "python -m pip install aider-install" },
      { title: "进入 Git 项目", body: "Aider 最适合在 Git 项目里工作。先用一个可丢弃的小项目测试。" },
      { title: "配置模型 Key", body: "按你使用的模型设置环境变量或配置文件。新手先用一个 OpenAI Compatible Provider 跑通。" },
    ],
    startCommands: [
      { title: "启动 Aider", body: "在项目目录启动。", command: "aider" },
      { title: "第一次测试", body: "先让它只解释项目。", command: "请先阅读项目，不要改文件，告诉我主要目录和启动方式。" },
    ],
    firstPrompts: [
      "请先只读项目，不要修改。",
      "每次只改一个小目标。",
      "改完请告诉我 git diff 里最需要检查的地方。",
    ],
    commonIssues: [
      { title: "pip 安装失败", solution: "先升级 pip，或用 Python 官方安装包重新安装。公司电脑可能需要管理员权限。" },
      { title: "没有 Git 仓库", solution: "先 git init 或换到已有 Git 项目。没有版本控制时不要让 Agent 改文件。" },
      { title: "模型 Key 不生效", solution: "检查环境变量名、base_url 和模型名。先用短对话确认 API 可用。" },
    ],
    apiConnections: [deepseekOpenAiConnection, kimiConnection, openAiConnection, localOpenAiServerConnection],
  },
  {
    slug: "continue-dev",
    name: "Continue",
    title: "Continue IDE Agent 插件安装和模型配置教程",
    category: "IDE Agent 插件",
    minutes: "10-20 分钟",
    difficulty: "适合可配置用户",
    tagline: "开源 VS Code / JetBrains AI 编程插件，可接云端模型、本地 Ollama、团队共享配置和 Agent 模式。",
    summary: "Continue 是开源 AI 编程助手，支持 Chat、Edit、Autocomplete、Agent 等工作流。它适合想掌控模型、上下文和配置的团队或进阶小白；第一次不要一上来写复杂 YAML，先用默认配置跑通。",
    bestFor: ["开源插件", "VS Code", "JetBrains", "本地模型"],
    requirements: ["VS Code 或 JetBrains IDE", "Continue 扩展/插件", "模型 API Key 或 Ollama", "一个项目文件夹"],
    officialUrl: "https://docs.continue.dev/how-to-use-continue",
    installSteps: [
      { title: "安装 IDE 插件", body: "VS Code 在扩展市场搜索 Continue；JetBrains 在插件市场搜索 Continue。" },
      { title: "选择模型", body: "新手先配置一个云端 OpenAI Compatible 模型，或者用本机 Ollama / LM Studio。" },
      { title: "测试 Chat", body: "先普通聊天问项目结构，再进入 Agent 模式。" },
      { title: "再配置团队规则", body: "跑通后再写团队共享配置、上下文 Provider 和 MCP，不要第一步就做复杂配置。" },
    ],
    startCommands: [
      { title: "第一次测试", body: "在 Continue 面板输入：", command: "请先阅读当前项目，不要修改文件，告诉我项目结构、启动方式和验证命令。" },
      { title: "Agent 模式小任务", body: "切到 Agent 后只给一个小目标。", command: "请只补一条 README 说明，改之前先列出计划。" },
    ],
    firstPrompts: [
      "先用 Chat 解释，再用 Agent 执行。",
      "只允许读取当前项目。",
      "如果模型不确定，请明确说不确定。",
    ],
    commonIssues: [
      { title: "配置太复杂", solution: "先用内置引导跑通一个模型，再慢慢加 YAML、规则和上下文 Provider。" },
      { title: "本地模型很慢", solution: "先用小模型或云端 API 测试，确认 Continue 工作流没问题。" },
      { title: "JetBrains 和 VS Code 体验不同", solution: "先选你每天真正用的 IDE，不要两个同时排错。" },
    ],
    apiConnections: [deepseekOpenAiConnection, kimiConnection, openAiConnection, localOpenAiServerConnection],
  },
  {
    slug: "augment-code",
    name: "Augment Code",
    title: "Augment Code IDE 插件安装教程",
    category: "产品方官方 Agent 插件",
    minutes: "8-15 分钟",
    difficulty: "适合大项目",
    tagline: "面向真实代码库的 AI 编程助手，支持 VS Code、JetBrains、CLI 和 Agent 工作流。",
    summary: "Augment Code 适合较大的工程项目，强调代码库上下文理解。它不是通用桌面聊天客户端，而是 IDE / CLI 里的工程工具。新手先装 VS Code 或 JetBrains 插件，别一开始就接公司核心仓库。",
    bestFor: ["大代码库", "VS Code", "JetBrains", "工程团队"],
    requirements: ["Augment 账号", "VS Code / JetBrains / CLI", "一个测试项目", "网络可访问 Augment 服务"],
    officialUrl: "https://www.augmentcode.com/install",
    installSteps: [
      { title: "选择客户端", body: "打开 Augment 官方安装页，选择 VS Code、JetBrains、Intent 或 CLI。小白优先 VS Code 插件。" },
      { title: "安装插件并登录", body: "从官方入口跳转到对应扩展市场安装，然后登录 Augment 账号。" },
      { title: "打开测试项目", body: "第一次用小项目测试上下文理解和代码修改。" },
      { title: "再接团队仓库", body: "确认隐私、权限和组织策略后，再用于公司项目。" },
    ],
    startCommands: [
      { title: "第一次只读", body: "在 Augment 面板输入：", command: "请先阅读这个项目，不要改文件，告诉我主要模块、启动方式和风险点。" },
      { title: "第一次小任务", body: "再给一个清晰的小范围任务。", command: "请只修改一个测试或一段 README，改前先列计划。" },
    ],
    firstPrompts: [
      "请先解释你理解的项目结构。",
      "只处理我指定的模块。",
      "输出必须包含验证方式。",
    ],
    commonIssues: [
      { title: "不知道选 VS Code 还是 JetBrains", solution: "选你日常打开项目的 IDE。不要为了工具换工作流。" },
      { title: "扫描大仓库很慢", solution: "先限定目录，或先问它某个模块，不要一开始全仓库任务。" },
      { title: "公司代码合规问题", solution: "先查团队政策和数据边界，再接真实仓库。" },
    ],
    apiConnections: [noCustomApiConnection("Augment Code")],
  },
  {
    slug: "jetbrains-junie",
    name: "JetBrains Junie",
    title: "JetBrains Junie 安装和启动教程",
    category: "产品方官方 Agent 插件",
    minutes: "8-15 分钟",
    difficulty: "JetBrains 用户优先",
    tagline: "JetBrains 官方 coding agent，适合 IntelliJ IDEA、PyCharm、WebStorm 等 JetBrains IDE 用户。",
    summary: "Junie 是 JetBrains 的 coding agent。它集成在 JetBrains IDE 的 AI Chat / 插件体系里，适合已经用 IntelliJ、PyCharm、WebStorm、Android Studio 的用户。新手不要把它和 Claude Desktop、ChatGPT Desktop 混成一类。",
    bestFor: ["JetBrains IDE", "Java/Kotlin", "Python", "团队代码"],
    requirements: ["JetBrains IDE", "JetBrains 账号", "AI / Junie 可用权限", "一个测试项目"],
    officialUrl: "https://junie.jetbrains.com/docs/junie-ide-plugin.html",
    installSteps: [
      { title: "更新 JetBrains IDE", body: "先更新到支持 JetBrains AI / Junie 的 IDE 版本。" },
      { title: "打开 AI Chat", body: "在 IDE 里打开 AI Chat，按官方推荐从 Agent 选择里启用 Junie。" },
      { title: "必要时安装插件", body: "如果 IDE 里没有入口，再从 JetBrains Marketplace 安装 Junie 插件。" },
      { title: "先用小项目测试", body: "第一次只让它解释项目或改一个小测试。" },
    ],
    startCommands: [
      { title: "第一次只读", body: "在 JetBrains AI Chat 里输入：", command: "请先阅读当前项目，不要修改文件，告诉我项目结构、运行方式和测试入口。" },
      { title: "第一次小改", body: "再让它处理一个小任务。", command: "请只补一个简单测试，改之前先说明会改哪些文件。" },
    ],
    firstPrompts: [
      "请先使用 explain / plan，不要直接实现。",
      "只改当前模块。",
      "改完请告诉我运行哪个测试。",
    ],
    commonIssues: [
      { title: "找不到 Junie", solution: "检查 IDE 版本、JetBrains AI 权限和 Marketplace 插件可用性。" },
      { title: "和 JetBrains AI Assistant 搞混", solution: "AI Assistant 更偏问答/补全；Junie 是 coding agent，用来执行更完整的任务。" },
      { title: "项目太大", solution: "先限定模块或文件夹，避免一次交给它整个 monorepo。" },
    ],
    apiConnections: [noCustomApiConnection("JetBrains Junie")],
  },
  {
    slug: "devin",
    name: "Devin",
    title: "Devin 云端工程 Agent 和终端入口教程",
    category: "云端工程 Agent",
    minutes: "10-20 分钟",
    difficulty: "团队/付费优先",
    tagline: "Cognition 的 AI software engineer，可在云端处理工程任务，也提供 Devin for Terminal。",
    summary: "Devin 是云端工程 Agent，适合团队把明确的 issue、bug、内部工具任务交给 Agent 处理。它不是本地桌面 App。新手如果只是想先体验本机 Agent，优先 Codex App、Claude Code、Cline 或 OpenClaw。",
    bestFor: ["云端 Agent", "团队 backlog", "Jira/Linear", "长任务"],
    requirements: ["Devin 账号或团队权限", "已连接代码仓库", "清晰 issue", "可选：Devin for Terminal"],
    officialUrl: "https://docs.devin.ai/",
    installSteps: [
      { title: "确认账号权限", body: "Devin 偏团队和付费场景。先确认你有 Devin 工作区和仓库权限。" },
      { title: "连接仓库", body: "按 Devin 文档接入 GitHub、Linear、Jira 等工作流，先用测试仓库。" },
      { title: "可选安装 Devin for Terminal", body: "需要本地终端入口时，再按官方文档安装 Devin CLI。", command: "curl -fsSL https://cli.devin.ai/install.sh | bash" },
      { title: "先派一个小 issue", body: "不要一开始让它重构系统。先给文档、小 bug、小工具这类任务。" },
    ],
    startCommands: [
      { title: "第一次任务", body: "在 Devin Web 或 Terminal 里输入：", command: "请先阅读这个 issue 和仓库，不要直接改代码，先给我实现计划、风险点和验收标准。" },
      { title: "转长任务", body: "本地快速探索后，可以把明确任务交给云端 Devin 长跑。" },
    ],
    firstPrompts: [
      "请先给计划，不要直接提交。",
      "请每一步保留日志和验证结果。",
      "PR 必须说明风险和未验证项。",
    ],
    commonIssues: [
      { title: "把 Devin 当本地 IDE", solution: "Devin 主要是云端工程 Agent，不是桌面编辑器。要本地改代码，用 Codex App、Claude Code、Cursor、Cline。" },
      { title: "任务描述太大", solution: "拆成 1-3 小时能完成的 issue，并写清验收标准。" },
      { title: "权限风险", solution: "先用测试仓库，确认仓库、CI、密钥和生产权限边界。" },
    ],
    apiConnections: [noCustomApiConnection("Devin")],
  },
]

const desktopAssistantGuides: AgentInstallGuide[] = [
  {
    slug: "chatgpt-desktop",
    name: "ChatGPT Desktop",
    title: "ChatGPT 桌面版一分钟直接跑通能用",
    category: "产品方官方桌面 AI 助理",
    minutes: "3-8 分钟",
    difficulty: "最适合小白",
    tagline: "像普通软件一样安装，登录后可以截图、上传文件、写作和问答。",
    summary: "ChatGPT 桌面版是 OpenAI 官方桌面应用，适合日常问答、写作、截图解释、文件分析。它不是通用 API 客户端，不能把 DeepSeek Key 直接填进去。",
    bestFor: ["截图问答", "文件分析", "写作润色", "日常助理"],
    requirements: ["Windows 或 macOS", "OpenAI / ChatGPT 账号", "从 OpenAI 官方下载"],
    officialUrl: "https://openai.com/chatgpt/download/",
    installSteps: [
      { title: "打开官方下载页", body: "浏览器访问 openai.com/chatgpt/download，不要从群文件或陌生网站下载。" },
      { title: "选择电脑版本", body: "Windows 点 Windows 下载；Mac 点 macOS 下载。Mac 需要注意系统和芯片要求。" },
      { title: "安装并登录", body: "双击安装包，一路按提示安装。打开 ChatGPT 后登录你的账号。" },
    ],
    startCommands: [
      { title: "打开方式", body: "从开始菜单或应用程序里打开 ChatGPT。Windows 常用 Alt + Space 快捷呼出，Mac 常用 Option + Space。" },
      { title: "第一次测试", body: "先让它解释一张截图或整理一段文字，不要一上来上传隐私文件。", command: "请把这段内容整理成 5 条待办事项，语言简单一点。" },
    ],
    firstPrompts: [
      "请根据我上传的截图，告诉我这是什么问题，以及下一步点哪里。",
      "请把这份文档总结成老板能看懂的 5 条结论。",
      "我完全不懂 AI，请一步一步问我想做什么，再帮我拆任务。",
    ],
    commonIssues: [
      { title: "找不到官方下载入口", solution: "直接访问 openai.com/chatgpt/download，不要搜索下载站。" },
      { title: "打不开或登录失败", solution: "先确认账号、网络和公司设备策略。有些公司电脑会限制安装或登录。" },
      { title: "想接 DeepSeek API", solution: "ChatGPT 官方桌面版不能直接填 DeepSeek Key。要接 DeepSeek 用 Cherry Studio、Chatbox、Cline 或 OpenClaw。" },
    ],
    apiConnections: [noCustomApiConnection("ChatGPT")],
  },
  {
    slug: "claude-desktop",
    name: "Claude Desktop",
    title: "Claude Desktop 官方桌面端开发者模式和扩展 API 教程",
    category: "产品方官方桌面 AI 助理",
    minutes: "3-8 分钟",
    difficulty: "新手可跟",
    tagline: "Claude 官方桌面版，适合写作、长文档、截图、MCP 工具和桌面扩展。",
    summary: "这是官网桌面端教程，重点讲 Settings 里的 Extensions / Developer、MCP 工具和扩展 API 配置。它和 Claude Code 不一样：Claude Code 是终端工程 Agent，模型 API 接入走另一个终端环境变量教程。",
    bestFor: ["长文档", "写作", "截图", "桌面扩展"],
    requirements: ["Windows 10+ 或 macOS 11+", "Claude 账号", "从 Claude 官方下载"],
    officialUrl: "https://www.claude.com/download",
    installSteps: [
      { title: "打开官方下载页", body: "浏览器访问 claude.com/download，选择 Windows 或 macOS。" },
      { title: "安装", body: "下载完成后双击安装包。Windows 从开始菜单打开，Mac 从 Applications 打开。" },
      { title: "登录账号", body: "打开 Claude Desktop，登录你的 Claude 账号。第一次先试普通问答。" },
      { title: "打开开发者模式", body: "点击左上角或头像旁边的 Settings，找到 Developer 或 Extensions，打开开发者相关入口。这个入口用来接 MCP 工具和桌面扩展，不是更换聊天模型的大脑。" },
    ],
    startCommands: [
      { title: "打开方式", body: "从开始菜单或应用程序里打开 Claude，不需要终端命令。" },
      { title: "配置 MCP 或扩展 API", body: "开发者模式打开后，按页面提示进入 MCP / Extensions 配置。这里可以让 Claude Desktop 调用本地工具、文件工具或你信任的扩展服务。新手先只装官方或可信工具，不要把 API Key 发给陌生配置包。" },
      { title: "第一次测试", body: "先上传一小段文字测试，不要直接上传合同、客户资料、API Key。", command: "请把这段资料整理成清晰的会议纪要。" },
    ],
    firstPrompts: [
      "请先用中文一步一步问我想完成什么工作。",
      "请把这份材料整理成摘要、风险点、下一步行动。",
      "如果我上传截图，请告诉我哪里需要点击，不要只讲概念。",
    ],
    commonIssues: [
      { title: "和 Claude Code 搞混", solution: "Claude Desktop 是桌面助理；Claude Code 是终端编程 Agent。要改项目代码，看 Claude Code 教程。" },
      { title: "登录或访问失败", solution: "先确认账号、地区、网络和公司设备策略。" },
      { title: "想把 DeepSeek 当聊天模型接进去", solution: "Claude Desktop 官方版不直接填 DeepSeek Key。开发者模式也不是模型 Provider 设置。桌面端这一页只讲 MCP 和扩展 API；要接模型大脑，看 Claude Code 终端环境变量教程，或用 Cherry Studio / Chatbox / Cline。" },
    ],
    apiConnections: [noCustomApiConnection("Claude Desktop")],
  },
  {
    slug: "cherry-studio",
    name: "Cherry Studio",
    title: "Cherry Studio 一分钟直接跑通能用",
    category: "第三方桌面 AI 客户端",
    minutes: "5-10 分钟",
    difficulty: "国内新手友好",
    tagline: "一个桌面 AI 客户端，可以接 DeepSeek、Kimi、OpenAI 等多个模型 API。",
    summary: "Cherry Studio 适合新手把多个模型 API 放到一个桌面软件里用。它不是模型，也不是工程 Agent，更像桌面 AI 工作台。",
    bestFor: ["DeepSeek API", "Kimi API", "多模型切换", "日常聊天"],
    requirements: ["Windows / Mac / Linux", "DeepSeek 或 Kimi API Key", "从 Cherry Studio 官方文档或 GitHub 下载"],
    officialUrl: "https://docs.cherry-ai.com/docs/en-us/cherry-studio/download",
    installSteps: [
      { title: "打开下载页", body: "访问 Cherry Studio 官方下载文档，按你的系统选择安装包。Windows 7 不支持。" },
      { title: "安装软件", body: "Windows 选 Setup 安装版；Mac 选对应芯片版本；Linux 选 AppImage 或官方推荐方式。" },
      { title: "进入设置", body: "打开 Cherry Studio，进入模型/Provider 设置，先添加 DeepSeek 或 Kimi。" },
    ],
    startCommands: [
      { title: "第一次测试", body: "配置好 API 后，新建对话，先让它简单回答。", command: "你好，请用中文回答：你现在可以帮我做什么？" },
      { title: "建议任务", body: "先做低风险任务，例如总结资料、写文案、改提示词。" },
    ],
    firstPrompts: [
      "请把这份资料总结成 5 条结论。",
      "请帮我写一个适合小红书的标题和正文草稿。",
      "请先问我行业和目标，再推荐我该用哪个模型。",
    ],
    commonIssues: [
      { title: "API Key 填了没反应", solution: "先检查 Base URL、模型名、余额。DeepSeek 先用 deepseek-v4-flash 跑通。" },
      { title: "Windows 安装被拦截", solution: "确认安装包来自官方或 GitHub release，再按系统提示允许。" },
      { title: "模型太多不知道选哪个", solution: "日常任务用 DeepSeek V4 Flash；复杂任务再换 Pro；长文档用 Kimi。" },
    ],
    apiConnections: [minimaxOpenAiConnection, deepseekOpenAiConnection, kimiConnection, openAiConnection],
  },
  {
    slug: "chatbox",
    name: "Chatbox",
    title: "Chatbox 一分钟直接跑通能用",
    category: "第三方桌面 AI 客户端",
    minutes: "5-10 分钟",
    difficulty: "新手可跟",
    tagline: "桌面 AI 客户端，适合把 OpenAI、Claude、Gemini、Ollama 和本地模型集中到一个窗口。",
    summary: "Chatbox 是桌面 AI 客户端，不是模型。它适合用同一个界面管理多个模型 Provider，数据主要在本地设备里使用。",
    bestFor: ["桌面聊天", "多 Provider", "Ollama", "本地数据"],
    requirements: ["Windows 10+ / macOS 11+ / Linux", "模型 API Key 或本地 Ollama", "从官网或 GitHub release 下载"],
    officialUrl: "https://github.com/chatboxai/chatbox",
    installSteps: [
      { title: "打开官方下载入口", body: "访问 chatboxai.app 或 GitHub chatboxai/chatbox releases，按系统下载安装包。" },
      { title: "安装并打开", body: "Windows 选 Setup.exe；Mac 按 Intel 或 Apple Silicon 选择；Linux 可用 AppImage。" },
      { title: "配置模型 Provider", body: "进入 Settings / Model Provider，选择 OpenAI Compatible 或对应官方 Provider。" },
    ],
    startCommands: [
      { title: "第一次测试", body: "配置 API 后新建对话，先测试中文回答。", command: "你好，请用中文回答我现在已经配置成功了吗？" },
      { title: "接本地 Ollama", body: "如果你用 Ollama，本地接口通常填 http://localhost:11434/v1。" },
    ],
    firstPrompts: [
      "请把下面这段内容改成更适合客户看的版本。",
      "请帮我比较 DeepSeek、Kimi、OpenAI 哪个更适合这个任务。",
      "请按步骤告诉我下一步怎么操作，不要一次讲太多。",
    ],
    commonIssues: [
      { title: "不知道下载哪个版本", solution: "Windows 选 Setup.exe；Mac 看芯片是 Intel 还是 Apple Silicon；Linux 选 AppImage。" },
      { title: "OpenAI Compatible 报错", solution: "DeepSeek Base URL 先试 https://api.deepseek.com；如果工具要求 /v1，再改成 https://api.deepseek.com/v1。" },
      { title: "Ollama 连接不上", solution: "先确认 Ollama 已经运行，并且模型能在本地命令行回答。" },
    ],
    apiConnections: [minimaxOpenAiConnection, deepseekOpenAiConnection, kimiConnection, openAiConnection, localOpenAiServerConnection],
  },
  {
    slug: "anythingllm",
    name: "AnythingLLM",
    title: "AnythingLLM 桌面版一分钟直接跑通能用",
    category: "桌面知识库 Agent",
    minutes: "8-15 分钟",
    difficulty: "新手可跟",
    tagline: "适合把 PDF、Word、表格、网页资料做成本地知识库，还能使用内置 Agent 技能。",
    summary: "AnythingLLM 是桌面/自部署 AI 应用，重点是文档知识库、私有资料问答和 Agent 技能。它不是单纯聊天框，适合企业资料和个人知识库。",
    bestFor: ["本地知识库", "文档问答", "私有资料", "Agent 技能"],
    requirements: ["Windows / Mac / Linux", "可选本地模型或云端 API Key", "准备 1-3 个测试文档"],
    officialUrl: "https://anythingllm.com/",
    installSteps: [
      { title: "打开官方下载页", body: "访问 anythingllm.com，点击 Download for desktop，按系统下载安装。" },
      { title: "选择模型", body: "第一次打开时可以选内置本地模型，也可以配置 OpenAI、DeepSeek、Kimi 等 API。" },
      { title: "创建 Workspace", body: "创建一个工作区，上传一份 PDF 或 Word 文档，先测试知识库问答。" },
    ],
    startCommands: [
      { title: "第一次测试", body: "上传一个不含隐私的测试文档，然后问：", command: "请根据我上传的文档，总结 5 条最重要的信息。" },
      { title: "开启 Agent 前", body: "先让普通知识库问答稳定，再开启 Agent 技能，不要一开始就给它太多工具权限。" },
    ],
    firstPrompts: [
      "请只根据我上传的文档回答，不知道就说不知道。",
      "请列出答案来自文档里的哪些部分。",
      "请把这个知识库整理成客户常见问题 FAQ。",
    ],
    commonIssues: [
      { title: "上传文档后答非所问", solution: "先检查文档是否可复制文字；扫描版 PDF 要先 OCR。" },
      { title: "本地模型太慢", solution: "电脑配置不高就先用 DeepSeek API 或 Kimi API，不要硬跑大模型。" },
      { title: "Agent 权限太大", solution: "只给它必要技能，涉及文件写入、浏览器、邮箱前先确认。" },
    ],
    apiConnections: [minimaxOpenAiConnection, deepseekOpenAiConnection, kimiConnection, openAiConnection, localOpenAiServerConnection],
  },
  {
    slug: "lm-studio",
    name: "LM Studio",
    title: "LM Studio 一分钟直接跑通能用",
    category: "本地模型桌面应用",
    minutes: "8-20 分钟",
    difficulty: "看电脑配置",
    tagline: "在自己电脑上下载和运行本地模型，还能开 OpenAI 兼容本地接口。",
    summary: "LM Studio 是本地模型桌面应用，适合不想把资料发到云端、想离线体验 Qwen、Llama、Gemma、DeepSeek 蒸馏模型的新手。",
    bestFor: ["本地模型", "离线聊天", "隐私资料", "本地 API"],
    requirements: ["Windows / Mac / Linux", "建议 16GB 内存起步", "硬盘空间足够下载模型", "网络能下载模型文件"],
    officialUrl: "https://lmstudio.ai/docs/app",
    installSteps: [
      { title: "下载安装", body: "访问 LM Studio 官方下载页，按系统下载安装。Windows、macOS、Linux 都有桌面版。" },
      { title: "下载小模型", body: "第一次不要选超大模型。8GB/16GB 内存先选 7B 或 8B 的 Q4 量化模型。" },
      { title: "开始聊天", body: "模型下载完成后加载模型，进入 Chat 页面测试中文回答。" },
    ],
    startCommands: [
      { title: "第一次测试", body: "在 Chat 输入框里复制这句话。", command: "请用中文回答：你是本地模型吗？请告诉我你的能力边界。" },
      { title: "开启本地 API", body: "进入 Local Server，启动 OpenAI Compatible Server，再给其他工具调用。" },
    ],
    firstPrompts: [
      "请总结这段文字，但不要编造没有出现的信息。",
      "请告诉我这个问题你不确定的地方。",
      "请用简单中文解释这个概念。",
    ],
    commonIssues: [
      { title: "模型下载很慢", solution: "模型文件很大，先下载小模型测试。不要一次排队下载多个大模型。" },
      { title: "电脑很卡", solution: "模型太大。换 7B/8B Q4 量化模型，或减少上下文长度。" },
      { title: "其他工具连不上本地接口", solution: "确认 LM Studio Local Server 已启动，Base URL 使用 http://localhost:1234/v1。" },
    ],
    apiConnections: [localOpenAiServerConnection],
  },
  {
    slug: "jan",
    name: "Jan",
    title: "Jan 本地 AI 桌面版安装教程",
    category: "本地模型桌面应用",
    minutes: "8-15 分钟",
    difficulty: "新手友好",
    tagline: "开源本地 AI 桌面应用，可以在电脑上运行本地模型，也能连接云端模型。",
    summary: "Jan 是开源桌面 AI 应用，适合想在本机跑模型、减少隐私顾虑的新手。它不是工程 Agent，主要用于本地聊天、模型下载和云端 Provider 连接。",
    bestFor: ["本地模型", "离线聊天", "隐私", "开源桌面端"],
    requirements: ["Windows / macOS / Linux", "足够内存和硬盘", "第一次下载模型需要网络", "可选云端 API Key"],
    officialUrl: "https://www.jan.ai/download",
    installSteps: [
      { title: "打开官方下载页", body: "访问 jan.ai/download，按系统选择 Windows、macOS 或 Linux 包。" },
      { title: "安装并打开 Jan", body: "像普通软件一样安装。第一次打开后先不要导入隐私资料。" },
      { title: "选择小模型", body: "电脑配置一般时先选小模型，不要直接下载超大模型。" },
      { title: "开始本地聊天", body: "模型下载后新建对话，先测试中文回答。" },
    ],
    startCommands: [
      { title: "第一次测试", body: "在 Jan 对话框输入：", command: "请用中文回答：你现在是在本机运行的模型吗？有哪些能力边界？" },
      { title: "再接云端模型", body: "如果本地模型不够强，再配置 OpenAI Compatible 或其他云端 Provider。" },
    ],
    firstPrompts: [
      "请只总结我提供的文字，不要编造。",
      "请告诉我哪些内容你不确定。",
      "请用小白能懂的话解释。",
    ],
    commonIssues: [
      { title: "模型下载太慢", solution: "先下载小模型测试。大模型文件很大，网络和硬盘都会影响。" },
      { title: "电脑发热或卡顿", solution: "换更小的量化模型，或关闭其他占用资源的软件。" },
      { title: "以为完全等于 ChatGPT", solution: "本地小模型能力有限，复杂推理和长文档可能不如云端强模型。" },
    ],
    apiConnections: [localOpenAiServerConnection, openAiConnection, deepseekOpenAiConnection],
  },
  {
    slug: "msty",
    name: "Msty Studio",
    title: "Msty Studio 桌面 AI 客户端安装教程",
    category: "第三方桌面 AI 客户端",
    minutes: "8-15 分钟",
    difficulty: "适合多模型用户",
    tagline: "隐私优先的桌面 AI 客户端，可以连接本地模型和云端模型，适合多模型对比。",
    summary: "Msty Studio 是桌面/网页 AI 工作台，适合把本地模型和在线模型放在一个界面里比较使用。它不是工程 Agent 本体，适合日常问答、资料处理和多模型测试。",
    bestFor: ["多模型对比", "本地模型", "桌面工作台", "隐私优先"],
    requirements: ["Windows / macOS / Linux 视下载页提供", "Msty Studio Desktop", "可选 Ollama 或云端 API Key", "一个测试任务"],
    officialUrl: "https://msty.ai/studio/download",
    installSteps: [
      { title: "打开下载页", body: "访问 msty.ai/studio/download，选择 Msty Studio Desktop。" },
      { title: "安装桌面版", body: "按系统安装。第一次先使用默认引导，不要马上接很多 Provider。" },
      { title: "添加模型", body: "可以连接本地 Ollama，也可以配置 OpenAI Compatible、OpenAI、Anthropic 等云端模型。" },
      { title: "做一次多模型测试", body: "同一个问题让两个模型回答，比较速度、质量和成本。" },
    ],
    startCommands: [
      { title: "第一次测试", body: "新建对话输入：", command: "请用中文回答：我应该用本地模型还是云端模型？请按隐私、速度、质量三点比较。" },
      { title: "本地模型", body: "如果接 Ollama，先确认 Ollama 已启动。" },
    ],
    firstPrompts: [
      "请用表格比较两个模型的回答差异。",
      "请告诉我哪一版更适合新手直接使用。",
      "请不要保存或外发我的隐私信息。",
    ],
    commonIssues: [
      { title: "本地模型连接不上", solution: "先确认 Ollama / LM Studio 服务已经启动，再检查 Base URL。" },
      { title: "云端模型报错", solution: "检查 API Key、模型名、余额和地区访问。" },
      { title: "不知道和 Cherry Studio 区别", solution: "都属于第三方桌面客户端。Cherry Studio 国内用户资料多；Msty 更偏隐私和多模型工作台体验。" },
    ],
    apiConnections: [localOpenAiServerConnection, openAiConnection, deepseekOpenAiConnection, kimiConnection],
  },
  {
    slug: "gpt4all",
    name: "GPT4All",
    title: "GPT4All 本地模型桌面版安装教程",
    category: "本地模型桌面应用",
    minutes: "8-20 分钟",
    difficulty: "适合本地隐私",
    tagline: "Nomic AI 的本地 LLM 桌面应用，可下载模型、本地聊天和使用 LocalDocs。",
    summary: "GPT4All Desktop 适合想把模型下载到本机、离线聊天、用 LocalDocs 做本地资料问答的新手。它不是编程 Agent，也不是云端模型服务。",
    bestFor: ["离线 AI", "LocalDocs", "本地隐私", "CPU/GPU 本地运行"],
    requirements: ["Windows / macOS / Linux", "建议 16GB 内存", "硬盘空间", "测试文档"],
    officialUrl: "https://docs.gpt4all.io/gpt4all_desktop/quickstart.html",
    installSteps: [
      { title: "打开官方 Quickstart", body: "从 GPT4All 官方文档进入桌面版下载，不要从第三方下载站拿安装包。" },
      { title: "安装桌面应用", body: "按系统安装 Windows、Mac 或 Linux 版本。" },
      { title: "添加模型", body: "点击 Add Model 下载一个推荐的小模型，第一次不要选太大。" },
      { title: "测试 LocalDocs", body: "上传一份不含隐私的文档，测试本地资料问答。" },
    ],
    startCommands: [
      { title: "第一次聊天", body: "下载模型并 Load 后输入：", command: "请用中文总结这段文字，并说明哪些信息来自原文。" },
      { title: "LocalDocs 测试", body: "上传一份测试文档后问：", command: "请只根据这份文档回答，不知道就说不知道。" },
    ],
    firstPrompts: [
      "请只根据本地文档回答。",
      "请标出不确定的地方。",
      "请用简单中文解释。",
    ],
    commonIssues: [
      { title: "下载模型后打不开", solution: "确认模型文件完整、硬盘空间足够，并尝试更小模型。" },
      { title: "回答质量不稳定", solution: "本地小模型能力有限，复杂任务可换云端 API 或更大模型。" },
      { title: "扫描版 PDF 读不准", solution: "先 OCR，再导入 LocalDocs。" },
    ],
    apiConnections: [localOpenAiServerConnection],
  },
  {
    slug: "lobehub-desktop",
    name: "LobeHub Desktop",
    title: "LobeHub / LobeChat 桌面版安装教程",
    category: "第三方桌面 AI 客户端",
    minutes: "8-15 分钟",
    difficulty: "适合多 Agent 助手",
    tagline: "LobeChat 的桌面体验，适合管理多助手、多模型、MCP 插件和本地文件能力。",
    summary: "LobeHub / LobeChat 更像设计精致的多助手 AI 工作台。桌面版适合想统一管理云端模型、本地能力、插件和助手市场的人。它不是工程 Agent 本体，但可以作为个人 AI 助手入口。",
    bestFor: ["多助手", "MCP 插件", "桌面客户端", "本地文件"],
    requirements: ["Windows / macOS 视 release 提供", "模型 API Key", "可选自部署 LobeChat", "只从官方 GitHub release 下载"],
    officialUrl: "https://github.com/lobehub/lobe-chat/releases",
    installSteps: [
      { title: "确认下载来源", body: "从 lobehub/lobe-chat 官方 GitHub releases 下载桌面版，不要用不明安装包。" },
      { title: "安装桌面端", body: "按你的系统选择安装包。若某系统仍是 beta 或未开放，就先用网页版/自部署版。" },
      { title: "配置模型 Provider", body: "添加 OpenAI Compatible、OpenAI、Claude、Gemini、DeepSeek 或 Kimi 等 Provider。" },
      { title: "先建一个助手", body: "创建一个简单助手，例如资料总结助手，先测试基本问答。" },
    ],
    startCommands: [
      { title: "第一次测试", body: "在新助手里输入：", command: "请把下面这段资料整理成 5 条结论和 3 个下一步行动。" },
      { title: "再接 MCP", body: "普通聊天稳定后，再接 MCP 或本地文件能力。" },
    ],
    firstPrompts: [
      "请先问我使用场景，再推荐模型。",
      "请把输出整理成可复制模板。",
      "涉及本地文件时先问我确认。",
    ],
    commonIssues: [
      { title: "桌面版仍在 beta", solution: "看官方 release 说明。没有稳定包时先用网页版或自部署。" },
      { title: "Provider 配置失败", solution: "检查 Base URL、模型名、Key 和余额。" },
      { title: "插件太多不知道装哪个", solution: "先不装插件。等固定任务跑通后，再按需要装 MCP。" },
    ],
    apiConnections: [openAiConnection, deepseekOpenAiConnection, kimiConnection, localOpenAiServerConnection],
  },
  {
    slug: "ollama",
    name: "Ollama",
    title: "Ollama 本地模型运行器安装教程",
    category: "本地模型桌面应用",
    minutes: "8-15 分钟",
    difficulty: "本地模型基础",
    tagline: "本地模型运行器，可下载 Qwen、Llama、Gemma、DeepSeek 蒸馏模型，并提供本地 API。",
    summary: "Ollama 是本地模型运行基础设施。它不等于桌面聊天客户端，但 Windows/macOS 安装后会在后台运行，很多桌面客户端、IDE 插件和 Agent 都可以连接它的本地接口。",
    bestFor: ["本地模型", "Ollama API", "隐私", "给其他工具供模型"],
    requirements: ["Windows / macOS / Linux", "建议 16GB 内存起步", "硬盘空间", "一个小模型"],
    officialUrl: "https://ollama.com/download",
    installSteps: [
      { title: "打开官方下载页", body: "访问 ollama.com/download，按系统下载安装。" },
      { title: "安装并启动", body: "Windows/macOS 安装后通常会在后台运行；Linux 按官方命令安装。" },
      { title: "下载一个小模型", body: "第一次先拉小模型测试，不要直接拉超大模型。", command: "ollama pull qwen3:4b" },
      { title: "给其他工具使用", body: "Ollama 默认本地接口通常是 http://localhost:11434，部分工具使用 OpenAI Compatible 时需要额外适配。" },
    ],
    startCommands: [
      { title: "命令行测试", body: "确认模型能回答。", command: "ollama run qwen3:4b" },
      { title: "检查服务", body: "浏览器或工具里连接本地服务。", command: "http://localhost:11434" },
    ],
    firstPrompts: [
      "请用中文回答：你是本地模型吗？",
      "请总结这段文字，不要编造。",
      "请告诉我你的能力限制。",
    ],
    commonIssues: [
      { title: "ollama command not found", solution: "关闭终端重开，或确认安装路径加入 PATH。" },
      { title: "模型太慢", solution: "换更小模型，或减少上下文长度。" },
      { title: "客户端连不上", solution: "确认 Ollama 后台服务正在运行，地址通常是 http://localhost:11434。" },
    ],
    apiConnections: [localOpenAiServerConnection],
  },
]

agentInstallGuides.push(...additionalEngineeringAgentGuides, ...agentDesktopAppGuides, ...desktopAssistantGuides)

export const agentGuideBySlug = new Map(agentInstallGuides.map((guide) => [guide.slug, guide]))
