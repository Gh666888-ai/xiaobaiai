export type AgentInstallStep = {
  title: string
  body: string
  command?: string
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
  officialUrl?: string
}

const deepseekOpenAiFields = [
  { label: "Provider", value: "OpenAI Compatible / Custom" },
  { label: "Base URL", value: "https://api.deepseek.com" },
  { label: "API Key", value: "sk-你的DeepSeek_API_Key" },
  { label: "先跑通模型", value: "deepseek-v4-flash" },
  { label: "更强模型", value: "deepseek-v4-pro" },
  { label: "长上下文", value: "deepseek-v4-pro[1m]" },
]

const kimiOpenAiFields = [
  { label: "Provider", value: "OpenAI Compatible / Custom" },
  { label: "Base URL", value: "https://api.moonshot.cn/v1" },
  { label: "API Key", value: "你的 Kimi / Moonshot API Key" },
  { label: "模型", value: "kimi-k2.6" },
]

const openAiFields = [
  { label: "Provider", value: "OpenAI" },
  { label: "API Key", value: "你的 OpenAI API Key" },
  { label: "模型", value: "按工具模型列表选择当前可用模型" },
]

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

const noCustomApiConnection = (product: string): AgentApiConnection => ({
  name: `${product} 账号登录`,
  badge: "不填第三方 Key",
  description: `${product} 桌面版是官方账号型应用，不是通用 API 客户端。下载安装到电脑后，用官方账号登录即可。`,
  fields: [
    { label: "登录方式", value: "官方账号登录" },
    { label: "DeepSeek / Kimi Key", value: "不能直接填到官方桌面版里" },
    { label: "适合新手", value: "截图、文件、日常问答、写作、语音" },
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
    slug: "claude-code",
    name: "Claude Code",
    title: "Claude Code 一分钟直接跑通能用",
    category: "工程 Agent",
    minutes: "8-15 分钟",
    difficulty: "新手可跟",
    tagline: "先装 Node.js，再装 Claude Code，最后接 DeepSeek V4 或官方 Claude。",
    summary: "适合让 AI 读项目、改代码、跑命令、解释报错。小白第一次使用时，不要让它直接改文件，先让它读项目并给计划。",
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
    ],
    apiConnections: [anthropicDeepseekConnection, openAiConnection],
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
    apiConnections: [codexOpenAiConnection, codexCompatibleConnection],
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
    apiConnections: [deepseekOpenAiConnection, kimiConnection, openAiConnection],
  },
  {
    slug: "hermes",
    name: "Hermes Agent",
    title: "Hermes Agent 一分钟直接跑通能用",
    category: "自学习 Agent",
    minutes: "10-25 分钟",
    difficulty: "进阶一点",
    tagline: "Hermes 更适合长期任务、技能系统和带记忆的 Agent。",
    summary: "Hermes 的版本和安装渠道变化较快。小白先确认官网/官方文档来源，再按当前文档安装，不要运行陌生脚本。",
    bestFor: ["长期任务", "Skills 技能", "自学习 Agent", "消息入口"],
    requirements: ["Mac / Linux 或 Windows WSL2", "Python 3.10+ 和 Node.js 18+", "DeepSeek 或 OpenAI Compatible API Key", "能看懂终端基础报错"],
    officialUrl: "https://hermes-agent.app/en/docs",
    installSteps: [
      {
        title: "Windows 先用 WSL2",
        body: "Hermes 这类 Agent 在 Linux 环境更稳。Windows 小白先装 WSL2。",
        command: "wsl --install",
      },
      {
        title: "Mac / Linux 一行安装",
        body: "确认你打开的是官方 Hermes 文档后，再复制官方安装脚本。这个脚本会处理 Python、Node.js、依赖和 PATH。",
        command: "curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash",
      },
      {
        title: "验证命令",
        body: "安装完成后关闭终端重开，再复制下面命令。",
        command: "hermes doctor",
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
        solution: "关闭终端重开。还不行就检查安装脚本是否把 hermes 加进 PATH。",
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
    apiConnections: [deepseekOpenAiConnection, kimiConnection, openAiConnection],
  },
  {
    slug: "cursor-agent",
    name: "Cursor Agent",
    title: "Cursor Agent 一分钟直接跑通能用",
    category: "桌面编程 Agent",
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
    apiConnections: [openAiConnection, kimiConnection, deepseekOpenAiConnection],
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
    apiConnections: [deepseekOpenAiConnection, kimiConnection, openAiConnection],
  },
]

const desktopAssistantGuides: AgentInstallGuide[] = [
  {
    slug: "chatgpt-desktop",
    name: "ChatGPT Desktop",
    title: "ChatGPT 桌面版一分钟直接跑通能用",
    category: "桌面 AI 助理",
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
    title: "Claude Desktop 一分钟直接跑通能用",
    category: "桌面 AI 助理",
    minutes: "3-8 分钟",
    difficulty: "新手可跟",
    tagline: "Claude 官方桌面版，适合写作、长文档、截图和桌面扩展。",
    summary: "Claude Desktop 是 Anthropic 官方桌面应用，适合日常助理和文档处理。它和 Claude Code 不一样：Claude Code 是终端工程 Agent，Claude Desktop 是桌面聊天助理。",
    bestFor: ["长文档", "写作", "截图", "桌面扩展"],
    requirements: ["Windows 10+ 或 macOS 11+", "Claude 账号", "从 Claude 官方下载"],
    officialUrl: "https://www.claude.com/download",
    installSteps: [
      { title: "打开官方下载页", body: "浏览器访问 claude.com/download，选择 Windows 或 macOS。" },
      { title: "安装", body: "下载完成后双击安装包。Windows 从开始菜单打开，Mac 从 Applications 打开。" },
      { title: "登录账号", body: "打开 Claude Desktop，登录你的 Claude 账号。第一次先试普通问答。" },
    ],
    startCommands: [
      { title: "打开方式", body: "从开始菜单或应用程序里打开 Claude，不需要终端命令。" },
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
      { title: "想接 DeepSeek API", solution: "Claude Desktop 官方版不直接填 DeepSeek Key。要接 DeepSeek 看 Claude Code 的 Anthropic Compatible，或用 Cherry Studio / Cline。" },
    ],
    apiConnections: [noCustomApiConnection("Claude Desktop")],
  },
  {
    slug: "cherry-studio",
    name: "Cherry Studio",
    title: "Cherry Studio 一分钟直接跑通能用",
    category: "桌面 AI 助理",
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
    apiConnections: [deepseekOpenAiConnection, kimiConnection, openAiConnection],
  },
  {
    slug: "chatbox",
    name: "Chatbox",
    title: "Chatbox 一分钟直接跑通能用",
    category: "桌面 AI 助理",
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
    apiConnections: [deepseekOpenAiConnection, kimiConnection, openAiConnection, localOpenAiServerConnection],
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
    apiConnections: [deepseekOpenAiConnection, kimiConnection, openAiConnection, localOpenAiServerConnection],
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
]

agentInstallGuides.push(...desktopAssistantGuides)

export const agentGuideBySlug = new Map(agentInstallGuides.map((guide) => [guide.slug, guide]))
