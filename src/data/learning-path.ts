// 学习路径数据 —— 从纯小白到 Agent 实战，含详细安装配置教程

export interface Stage {
  id: number
  title: string
  subtitle: string
  whoIsThisFor: string
  timeEstimate: string
  icon: string
  color: string
  sections: Section[]
}

export interface Section {
  title: string
  content: string
  tools: string[]
  tips?: string
}

export const stages: Stage[] = [
  // ===== Stage 0: 纯小白 =====
  {
    id: 0,
    title: "认识 AI",
    subtitle: "如果你完全没接触过AI，从这里开始",
    whoIsThisFor: "从没使用过任何AI工具，或者只听说过但不知道怎么用的人",
    timeEstimate: "约 30 分钟",
    icon: "◈",
    color: "#3DA563",
    sections: [
      {
        title: "AI 到底是什么？用人话讲",
        content:
          "AI（人工智能）就像是一个超级聪明的助手，你可以用日常语言跟它聊天、问问题、让它帮你做事。它读过了几乎整个互联网的内容，所以几乎什么都知道。\n\n但它不是万能的——它可能犯错，也可能编造信息。所以把它当成一个热心的实习生：很能干，但你需要检查它的工作。\n\n目前市面上最主流的AI助手包括：ChatGPT（OpenAI出品，全球用户最多）、Claude（Anthropic出品，写作和编程强）、Kimi（月之暗面，中文理解好）、DeepSeek（推理能力强，免费）、豆包（字节出品，易用）。你先不用纠结选哪个，后面都会介绍到。",
        tools: [],
        tips: "最简单的理解：AI = 一个读过很多书、可以跟你对话、帮你干活儿的电脑程序",
      },
      {
        title: "AI 能帮你做什么？",
        content:
          "写文案、做翻译、总结文档、回答专业问题、写代码、画图、做PPT、分析数据、规划旅行、陪你聊天——几乎任何跟文字、图片、信息处理有关的事情，AI 都能帮上忙。\n\n到了2026年，AI甚至可以帮你操作电脑、自动完成工作流程——这就是后面要学的「Agent」。\n\n但这一切的前提是：你要学会怎么跟AI「说话」。这就是第三阶段要学的 Prompt 工程。",
        tools: [],
        tips: "AI 不是要替代你，而是让你做事的效率翻倍。你负责判断和决策，AI 负责执行和辅助。",
      },
      {
        title: "新手第一站：选一个 AI 助手",
        content:
          "国内用户推荐从以下三个中选一个开始：\n\n🟢 Kimi（kimi.moonshot.cn）—— 完全免费，200万字长文本，中文顶级\n🟢 DeepSeek（chat.deepseek.com）—— 完全免费，推理强，可联网搜索\n🟢 通义千问（tongyi.aliyun.com）—— 阿里出品，多功能集成\n\n不需要纠结选哪个。建议：先打开 Kimi 或 DeepSeek，两个都试试，哪个用着顺手就用哪个。后面熟练了自然会换着用。\n\n注册都很简单：手机号或微信扫码，30秒搞定。",
        tools: ["kimi", "deepseek", "tongyi"],
        tips: "注册时不需要填太多个人信息，手机号或邮箱就行。所有推荐的入门工具都是免费的。",
      },
    ],
  },

  // ===== Stage 1: 初体验 =====
  {
    id: 1,
    title: "开始使用 AI",
    subtitle: "注册第一个AI账号，完成第一次对话",
    whoIsThisFor: "已经了解AI基本概念，准备动手试一试的人",
    timeEstimate: "约 1 小时",
    icon: "◉",
    color: "#3B82C4",
    sections: [
      {
        title: "注册 Kimi —— 完整图文指引",
        content:
          "第1步：打开浏览器，在地址栏输入 kimi.moonshot.cn ，回车\n第2步：页面右上角找到「登录 / 注册」按钮，点击\n第3步：选择「手机号登录」或「微信扫码」\n第4步：输入手机号 → 获取验证码 → 输入验证码 → 完成\n\n注册成功后会看到一个干净的对话框界面。左侧是历史对话列表，中间是输入框，右下角有个「+」按钮可以上传文件。\n\n📷 截图占位：Kimi首页注册入口\n📷 截图占位：登录后的对话界面",
        tools: ["kimi"],
        tips: "同样方法也可以注册 deepseek.com。如果手机收不到验证码，试试微信扫码。Kimi 和 DeepSeek 都是国产AI，不需要任何特殊网络环境。",
      },
      {
        title: "完成你的第一次 AI 对话",
        content:
          "在对话框里输入以下内容试试（复制粘贴即可）：\n\n「你好，我是AI新手，请用3句话告诉我你能帮我做什么」\n\nAI 会在几秒内回复你。然后试试这些进阶问题：\n\n① 「明天北京天气怎么样？我该穿什么衣服？」\n② 「帮我写一个请假的微信消息，理由是要去医院体检，语气正式但不生硬」\n③ 「推荐3部适合周末放松看的电影，要最近3年内的」\n④ 「用200字以内解释什么是ChatGPT」\n\n观察AI的回答——你会发现它对不同类型问题的回答风格、长度和结构都不一样。这是因为它会根据你的问题自动调整。",
        tools: ["kimi", "deepseek"],
        tips: "把AI想象成一个知识渊博但不太了解你具体情况的朋友。信息给得越具体，它回答得越好。",
      },
      {
        title: "上传文件让 AI 分析",
        content:
          "Kimi 支持上传文件（最多200万字，相当于三本《三体》的长度），支持 PDF、Word、PPT、Excel、TXT 等格式。\n\n操作步骤：\n① 在对话框右下角找到「📎」或「+」按钮，点击\n② 选择你电脑上的文件\n③ 上传完成后，在对话框输入你的需求，如「请用3个要点总结这个文档的核心内容」\n④ 按回车发送\n\n试试上传一份你工作中的文档——合同、报告、论文都可以——让AI帮你总结要点、找出问题、或者改写润色。这是 AI 在办公场景中最实用的功能。",
        tools: ["kimi"],
        tips: "长文档分析是 Kimi 的强项。如果有很长的合同或论文，扔给 Kimi 让它梳理。DeepSeek 也支持文件上传，但不支持这么大的文件量。",
      },
      {
        title: "用 AI 搜索代替传统搜索",
        content:
          "试试 Perplexity（perplexity.ai，国际）或秘塔AI搜索（metaso.cn，国内）。它们的用法跟普通 AI 聊天一样，但回答会附上信息来源链接。\n\n试试搜索：「2026年AI领域最重要的3个进展是什么？」\n\nAI 搜索会把多个来源的信息整合成一段带编号的回答，每个结论后面都有来源链接可以点进去核实。这比传统搜索引擎逐条点开看高效得多。\n\n秘塔还支持「学术」模式，适合查论文、做研究。",
        tools: ["perplexity", "metaso"],
        tips: "AI搜索适合需要综合多个信息源的开放式问题。如果是查具体数据或事实，记得让它给出引用来源。",
      },
    ],
  },

  // ===== Stage 2: 日常提效 =====
  {
    id: 2,
    title: "AI 日常提效",
    subtitle: "把AI融入工作和生活，效率翻倍",
    whoIsThisFor: "已经会用AI聊天，但还没把它当成日常工具的人",
    timeEstimate: "约 2 小时（分散在日常中使用）",
    icon: "◆",
    color: "#E8833A",
    sections: [
      {
        title: "用 AI 写文案和文档",
        content:
          "核心技巧：不要只说「帮我写个周报」，而要告诉它完整信息。\n\n正确示例：「我本周做了A、B、C三件事，下周计划做D和E，遇到了F这个问题，请帮我写成200字以内的周报，语气正式但不呆板。」\n\n常见应用场景：\n• 周报/月报：给AI列出本周完成的事情，让它润色成型\n• 邮件：告诉AI收件人是谁、要说什么事，它会帮你调整语气\n• 会议纪要：把会议录音转文字，丢给AI让它提炼要点和行动项\n• 方案大纲：告诉AI你的目标，让它先出大纲，确认后再逐段展开",
        tools: ["kimi", "chatgpt", "claude"],
        tips: "写长文时，先让AI列大纲，确认大纲后再逐段展开。这比你一次让它写完效果好得多。",
      },
      {
        title: "用 AI 做 PPT —— Gamma 完整教程",
        content:
          "Gamma（gamma.app）是目前最好的AI PPT生成工具。\n\n操作步骤：\n① 打开 gamma.app，点击右上角「Sign up free」注册（支持Google账号或邮箱）\n② 登录后点击「Create new」→「Generate」\n③ 在输入框里用中文描述你要做的PPT主题，比如「2026年AI行业趋势分析报告，10页」\n④ 点击「Generate outline」先看大纲，确认后点「Continue」\n⑤ Gamma 会自动生成一套完整的PPT，包含配图和排版\n⑥ 可以在线编辑修改，也可以导出为 PDF 或 PPTX 格式\n\n💰 免费版每月有 400 积分，可以做大约 4-5 套PPT。付费版 $8/月。",
        tools: ["gamma"],
        tips: "用 Gamma 时先选好配色和风格（有几十种模板可选），AI生成后你只需要微调内容和顺序。10分钟能搞定以前1小时的活儿。",
      },
      {
        title: "用 AI 画图 —— 即梦 + Midjourney 入门",
        content:
          "即梦（字节出品，jimeng.jianying.com）是最容易上手的AI绘图工具：\n① 打开 jimeng.jianying.com，用抖音/头条账号登录\n② 在输入框输入你想画的画面，如「一只戴着墨镜的橘猫坐在咖啡馆窗边，阳光从窗户照进来，温馨氛围」\n③ 选择画面比例（横版16:9 / 方版1:1 / 竖版9:16）\n④ 点击生成，等待约10秒\n⑤ 每天有免费额度，够画几十张\n\n进阶：Midjourney（midjourney.com）是国际AI绘画天花板，需要通过 Discord 使用，付费$10/月起。\n\nAI绘图公式：主体 + 动作/姿势 + 场景/环境 + 风格 + 光线 + 构图\n好的例子：「一个穿白大褂的女医生，站在明亮的实验室里，手里拿着试管，俯视角度，写实摄影风格，柔和的自然光」",
        tools: ["jimeng", "midjourney"],
        tips: "AI绘图的关键是描述得越具体越好。初学者可以从小红书搜「AI绘画提示词」找灵感，直接复制别人的好提示词做起点。",
      },
    ],
  },

  // ===== Stage 3: Prompt 进阶 =====
  {
    id: 3,
    title: "Prompt 进阶",
    subtitle: "学会跟AI高效沟通，让它输出你真正想要的结果",
    whoIsThisFor: "会用AI但感觉AI经常答非所问、输出质量不稳定的人",
    timeEstimate: "约 2 小时",
    icon: "◇",
    color: "#C8944A",
    sections: [
      {
        title: "Prompt 核心公式：角色 + 任务 + 背景 + 格式 + 示例",
        content:
          "Prompt（提示词）就是你跟AI说的话。Prompt工程就是学会用更有效的方式提问。\n\n万能公式的五个要素：\n\n① 角色设定：告诉AI它现在是谁\n「你是一名资深产品经理」「你是一位有10年经验的营养师」\n\n② 任务描述：具体要做什么\n「请帮我分析这款App的用户留存问题」「请设计一份一周减脂食谱」\n\n③ 背景信息：提供上下文\n「我们的目标用户是25-35岁的职场人，月活50万，最近3个月留存率下降了15%」\n\n④ 输出格式：想要的格式\n「请用300字以内的要点形式输出」「请用表格展示」「用Markdown格式」\n\n⑤ 示例参考：给AI一个范本\n「参考这个风格来写：[粘贴一个你喜欢的例子]」\n\n完整示例：「你是一名资深产品经理。请帮我分析这款App的用户留存问题。我们的目标用户是25-35岁的职场人，月活50万，最近3个月留存率下降了15%。请用300字以内的要点形式输出，每条要点附一个可执行的改进建议。」",
        tools: ["kimi", "chatgpt", "deepseek"],
        tips: "Prompt 不需要很复杂。大部分时候「说清楚你要什么、给足上下文」就比模糊提问好10倍。",
      },
      {
        title: "五个万能 Prompt 模板（收藏备用）",
        content:
          "模板1（总结类）：\n「请用3个要点总结以下内容的核心观点，每个要点不超过50字。内容如下：[粘贴内容]」\n\n模板2（改写类）：\n「请将以下文字改写成更适合在小红书发布的风格，活泼有网感但不轻浮，适当加入emoji。原文：[粘贴文字]」\n\n模板3（分析类）：\n「请从优点、缺点、风险三个角度分析以下方案，最后给出你的改进建议。方案如下：[粘贴方案]」\n\n模板4（翻译类）：\n「请将以下中文翻译成商务英语，保持专业但不生硬，避免中式英语。」\n\n模板5（创意类）：\n「请为[产品名]写5个广告语，每个不超过15字。目标受众是年轻人，风格要酷、有记忆点。参考竞品风格：[粘贴竞品文案]」",
        tools: [],
        tips: "这五个模板覆盖了80%的日常使用场景。存到备忘录里，需要时改改就能用。",
      },
      {
        title: "AI 的幻觉问题：为什么它会胡说八道？怎么避免？",
        content:
          "AI有时会编造信息，这叫「幻觉」——比如捏造不存在的论文、编造错误的数据。原因是它本质上是预测「下一个最可能的词」，而不是在理解事实。\n\n四个应对方法：\n① 对事实性问题，要求AI给出引用来源。加上这句话：「请给出信息来源的链接」\n② 涉及数字、日期、人名时，自己多核实一遍\n③ 用AI搜索工具（Perplexity / 秘塔）替代纯对话AI来查事实，因为它们自带来源引用\n④ 如果AI的回答让你觉得「这也太好了吧不太可能」，大概率是它编的\n\n记住：AI是你的助手，不是你老板。它说的每一句话，你都有权利质疑和核实。",
        tools: ["perplexity", "metaso"],
        tips: "一个简单判断：如果AI回答了一个非常具体的数据（如「2025年中国AI市场规模为586亿元」），但没有给出来源，大概率是编的。",
      },
    ],
  },

  // ===== Stage 4: 工具达人 =====
  {
    id: 4,
    title: "AI 工具达人",
    subtitle: "搭建自己的AI工作台，学会安装和配置AI编程工具",
    whoIsThisFor: "已经熟练使用AI对话工具，想安装桌面级AI工具并配置模型的人",
    timeEstimate: "约 3-4 小时",
    icon: "⊕",
    color: "#1B5E3B",
    sections: [
      {
        title: "Claude Code 安装教程（Windows / Mac 完整指南）",
        content:
          "Claude Code 是 Anthropic 出品的终端AI编程助手。它可以直接在命令行中帮你写代码、改文件、操作Git、运行命令。\n\n📋 前提条件：\n• Claude Pro 付费账号（$20/月，在 claude.ai 注册并升级）\n• 电脑能正常访问网络\n\n🔧 Windows 安装步骤：\n① 按键盘 Win+R，输入 powershell，回车打开 PowerShell\n② 复制粘贴以下命令，回车执行：\n  irm https://claude.ai/install.ps1 | iex\n③ 等待下载和安装完成（约1-2分钟）\n④ 安装完成后，在 PowerShell 输入：claude\n⑤ 首次运行会弹出浏览器，要求登录 Anthropic 账号授权——点击「Allow」\n⑥ 授权完成回到终端，看到欢迎信息即表示安装成功\n\n🍎 Mac 安装步骤：\n① 打开「终端」App（在 Launchpad 搜索 Terminal）\n② 复制粘贴以下命令，回车：\n  curl -fsSL https://claude.ai/install.sh | bash\n③ 后续步骤同 Windows ④-⑥\n\n⚙️ 首次配置（重要！）：\n安装完成后，在你的项目文件夹里创建一个 CLAUDE.md 文件，写入你想让 Claude Code 遵守的规则。这个文件就像给AI的「员工手册」。",
        tools: ["claude-code"],
        tips: "安装后如果提示 'command not found'，关掉终端重新打开一次就行了。这是环境变量没刷新的常见问题。",
      },
      {
        title: "Claude Code 安装常见问题排查",
        content:
          "❌ 问题1：安装时卡住不动\n→ 检查网络是否正常，试试能否访问 claude.ai。如果公司网络有限制，换手机热点试试。\n\n❌ 问题2：提示「command not found: claude」\n→ Windows：关掉 PowerShell 重新打开\n→ Mac：执行 source ~/.zshrc 然后重试\n→ 如果还不行，试试重启电脑\n\n❌ 问题3：认证授权失败\n→ 确认你的 Claude 账号是 Pro 版（免费版不能用 Claude Code）\n→ 在 claude.ai 登录确认账号状态\n→ 重新执行 claude 命令触发重新认证\n\n❌ 问题4：SSL / 网络连接错误\n→ Windows：执行 [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12\n→ 确保系统时间是正确的\n\n❌ 问题5：提示 API key 相关错误\n→ 检查 ~/.claude.json 文件是否存在且包含有效的认证信息\n→ 尝试 claude logout 然后 claude login 重新登录",
        tools: ["claude-code"],
        tips: "90%的安装问题都是网络或账号问题。遇到报错先别慌，把错误信息复制给 ChatGPT 或 Kimi，让它帮你诊断。这是AI时代解决问题的高效方法。",
      },
      {
        title: "Claude Code 连接和切换 AI 模型",
        content:
          "Claude Code 默认使用 Claude 4 Sonnet 模型。你可以根据需要切换模型：\n\n📌 查看当前配置：\n在终端输入：claude config list\n\n📌 切换模型：\nclaude config set model claude-4-opus    ← 最强模型，适合复杂任务\nclaude config set model claude-4-sonnet  ← 默认，性价比高\nclaude config set model claude-4-haiku   ← 最快，适合简单任务\n\n📌 设置最大预算（控制花费）：\nclaude config set maxBudget 10   ← 单次对话最多花$10\n\n📌 开启/关闭自动确认（安全设置）：\nclaude config set autoConfirm false  ← 推荐：每次操作前需要你确认\n\n📌 常用命令速查：\nclaude                    ← 启动Claude Code交互模式\nclaude \"帮我写一个排序函数\"  ← 单次命令模式\nclaude --resume           ← 继续上次对话\nclaude /help              ← 查看所有可用命令\nclaude commit             ← 让Claude帮你写Git提交信息\nclaude doctor             ← 自诊断，排查配置问题",
        tools: ["claude-code"],
        tips: "建议从 claude-4-sonnet 开始用，日常够用且速度快。遇到特别复杂的问题再切到 opus。haiku 适合做代码补全这类简单高频操作。",
      },
      {
        title: "Cursor 安装和模型配置",
        content:
          "Cursor 是基于 VS Code 的AI编程编辑器，适合不熟悉命令行的用户。\n\n📥 下载安装：\n① 打开 cursor.sh，自动检测你的系统\n② 点击下载按钮（Windows选.exe，Mac选.dmg）\n③ 下载完成后双击安装文件，一路点「下一步」即可\n④ 安装完成后打开 Cursor\n\n⚙️ 初始配置：\n① 首次打开会问你要不要导入 VS Code 设置——选「Skip」即可\n② 在右侧边栏找到 AI 对话面板（Chat）\n③ 用 Ctrl+K（Mac: Cmd+K）打开内联编辑模式\n④ 用 Ctrl+L（Mac: Cmd+L）打开侧边AI聊天\n\n🔑 模型配置（免费额度用完后）：\n① 点击右上角齿轮图标 → Settings → Models\n② 可以添加自己的 API Key（OpenAI / Anthropic / 其他）\n③ 也可以直接订阅 Cursor Pro（$20/月，包含所有模型额度）\n\n💡 快速上手：\n打开一个文件，选中一段代码，按 Ctrl+K，输入「用中文解释这段代码在做什么」，回车。AI 就会在编辑器中直接给你解释。",
        tools: ["cursor"],
        tips: "Cursor免费版每月有2000次AI请求的额度，入门够用了。按Ctrl+K是最高频的快捷键，记住它。",
      },
      {
        title: "接入 AI 模型 API —— 获取和配置 API Key",
        content:
          "当你使用 Claude Code、Cursor、Dify 等工具时，可能需要自己的 API Key。以下是主流模型的获取方式：\n\n🔑 DeepSeek API Key（免费额度多，推荐入门）：\n① 打开 platform.deepseek.com\n② 注册账号 → 进入控制台 → 点击「API Keys」\n③ 创建新 Key，复制保存（只显示一次！）\n④ 新用户送500万token免费额度\n\n🔑 OpenAI API Key：\n① 打开 platform.openai.com → 注册\n② 进入 API Keys 页面 → Create new secret key\n③ 需要绑定信用卡，按用量付费\n\n🔑 Anthropic（Claude）API Key：\n① 打开 console.anthropic.com → 注册\n② 进入 API Keys → Create Key\n③ 同样需要绑定支付方式\n\n🔑 通义千问 API Key（阿里云，国内友好）：\n① 打开 dashscope.aliyun.com → 用阿里云账号登录\n② 进入 API Key 管理 → 创建 Key\n③ 有免费额度\n\n💡 省钱技巧：日常开发测试用 DeepSeek API（最便宜），上线再用 GPT/Claude。DeepSeek的价格大约是GPT的1/10。",
        tools: ["deepseek", "chatgpt", "claude"],
        tips: "API Key = 你的数字密码，绝对不要上传到 GitHub 或发给别人！建议用环境变量（.env文件）存储，不要写在代码里。",
      },
    ],
  },

  // ===== Stage 5: Agent 入门 =====
  {
    id: 5,
    title: "Agent 入门",
    subtitle: "搭建你的第一个AI智能体，让它自动完成工作任务",
    whoIsThisFor: "想从「使用AI」升级到「让AI自动工作」的人，零代码",
    timeEstimate: "约 4 小时（分2-3天完成）",
    icon: "⊗",
    color: "#D94841",
    sections: [
      {
        title: "Agent 是什么？跟普通 AI 有什么区别？",
        content:
          "普通AI是你问它答。Agent（智能体）是AI加上「手脚」——它能自己执行操作。\n\n🌰 举个例子：\n• 普通AI：你问「今天有什么AI新闻？」，它回答\n• Agent：你设置好规则，它每天早上自动抓取新闻、分类总结、发到你微信——你什么都不用做\n\nAgent = AI大脑（理解任务）+ 工具调用（操作电脑/网络）+ 自动执行（定时/条件触发）\n\n最简单的类比：普通AI是「你问路，它告诉你方向」。Agent是「你告诉它目的地，它自己开车带你到」。",
        tools: [],
        tips: "2026年是Agent元年。Dify、Coze、OpenClaw等工具让零基础用户也能搭建Agent。你不需要会编程。",
      },
      {
        title: "用 Dify 搭建第一个 Agent（完整图文教程）",
        content:
          "Dify（dify.ai）是目前最适合新手的零代码Agent平台。\n\n📋 注册和初始设置：\n① 打开 cloud.dify.ai → 点击「Get Started」→ 用邮箱或Google账号注册\n② 首次登录会让你选择语言，选「简体中文」\n③ 进入主界面后，左侧是导航栏：工作室 / 知识库 / 工具 / 插件\n\n🤖 创建第一个Agent——知识问答助手：\n① 点击「工作室」→「创建应用」→ 选择「聊天助手」\n② 给Agent命名，如「我的文档助手」\n③ 进入编排页面，你会看到：\n  • 左侧：提示词编辑区（给Agent写人设和规则）\n  • 中间：变量和上下文设置\n  • 右侧：预览和测试区\n\n📝 写提示词（复制这段试试）：\n-----------\n你是一个专业的知识问答助手。你会基于我提供的文档来回答问题。\n规则：\n1. 如果文档中有相关内容，请引用原文\n2. 如果文档中没有相关内容，诚实地说「文档中没有涉及这个问题」\n3. 回答要简洁，不超过300字\n4. 语气亲切但不啰嗦\n-----------\n\n📚 添加知识库：\n① 左侧导航点「知识库」→「创建知识库」\n② 上传你的文档（PDF/Word/TXT都可以）\n③ Dify会自动把文档切片、向量化（约1-2分钟）\n④ 回到Agent设置页面，在「上下文」里勾选你刚创建的知识库\n\n✅ 测试和发布：\n① 在右侧测试区输入问题，看Agent回答是否正确\n② 满意后点击右上角「发布」\n③ Dify会生成一个链接，你可以分享给别人使用\n\n🎉 恭喜！你刚刚搭建了人生第一个AI Agent。",
        tools: ["dify"],
        tips: "第一个Agent不要追求完美。先用默认设置跑通整个流程，后面再慢慢优化提示词和知识库。Dify免费版支持10个应用和50MB知识库，入门完全够用。",
      },
      {
        title: "Dify 常见问题排查",
        content:
          "❌ 问题1：Agent回答跟知识库内容不相关\n→ 检查知识库设置中的「检索策略」，改成「混合检索」\n→ 调整 Top K 值（默认3，可以改成5让检索更多文档片段）\n→ 在提示词里加一句：「如果知识库中没有相关信息，请回答'我目前的知识库中没有相关内容'」\n\n❌ 问题2：上传的文档无法被正确检索\n→ 确认文档格式是 PDF/Word/TXT/Markdown 之一\n→ 如果文档是扫描版PDF（图片），需要先用 OCR 转文字\n→ 大文档（50MB+）上传可能超时，拆成小文件上传\n\n❌ 问题3：提示「模型调用失败」\n→ 检查是否配置了模型提供商（设置 → 模型提供商）\n→ Dify 免费版自带模型额度。如果用完了，需要绑定自己的 API Key\n→ DeepSeek API Key 最便宜，推荐绑定\n\n❌ 问题4：Agent响应很慢\n→ 切换一个更快的模型（如 DeepSeek 代替 GPT-4）\n→ 检查知识库是否过大，适当精简\n→ 在提示词里去掉不必要的描述，精简上下文",
        tools: ["dify"],
        tips: "Dify 的文档和社区很活跃。遇到问题先去 docs.dify.ai 搜，大概率有人遇到过同样的问题。",
      },
      {
        title: "用 Coze（扣子）做一个能发微信的 Agent",
        content:
          "Coze（coze.cn，字节出品）的独特优势：可以把Agent发布到微信、飞书、抖音。\n\n📋 注册和创建：\n① 打开 coze.cn → 用手机号或抖音账号登录\n② 点击「创建Bot」→ 填写名称和描述\n③ 进入Bot编排界面\n\n🤖 做一个「产品FAQ客服」Agent：\n① 在「人设与回复逻辑」里写：\n「你是XX产品的智能客服。你的职责是回答用户关于产品的常见问题。请保持友好、专业、简洁。如果遇到你不知道的问题，请引导用户联系人工客服。」\n② 在「知识库」里上传产品FAQ文档\n③ 配置「开场白」：用户第一次聊天时自动发送的欢迎消息\n④ 在「插件」里可以添加天气、新闻、图片生成等能力\n\n📱 发布到微信（关键步骤）：\n① 点击右上角「发布」\n② 选择「微信」作为发布渠道\n③ 按提示扫码授权（需要微信服务号或企业微信）\n④ 发布成功后，会得到一个二维码，别人扫了就能跟你的Agent聊天\n\n💡 也可以发布到飞书、抖音、Discord等平台。每个平台的发布流程类似。",
        tools: ["coze"],
        tips: "Coze的「人设与回复逻辑」部分决定了Agent的性格。花10-15分钟好好写，多用「请」「谢谢」也能让Agent更友好。发布到微信需要在微信开放平台注册应用，略复杂，可以先用「预览」功能在Coze内部测试。",
      },
      {
        title: "实战：用 Dify 做一个自动日报生成器",
        content:
          "现在动手做一个真正能自动运行的 Agent。\n\n目标：每天早上8点自动抓取指定网站的AI新闻，生成摘要，发到你的飞书。\n\n🛠 完整步骤：\n\n① 在 Dify 中点击「工作室」→「创建应用」→ 这次选「工作流」\n\n② 添加第一个节点：「定时触发」\n  • 拖拽「开始」节点到画布\n  • 类型选「定时」→ 设置每天 8:00\n\n③ 添加第二个节点：「HTTP 请求」\n  • 拖拽「HTTP请求」节点\n  • URL 填入你要抓取的新闻网站 RSS 地址\n  • 例如 OpenAI Blog RSS: https://openai.com/blog/rss.xml\n  • 方法选 GET\n\n④ 添加第三个节点：「LLM」\n  • 拖拽「LLM」节点\n  • 连接上一个节点的输出\n  • Prompt：「请将以下新闻内容总结为300字以内，列出3-5个要点。内容：{{上一步的输出}}」\n\n⑤ 添加第四个节点：「飞书发送」\n  • 拖拽「飞书群机器人」节点（需要先在飞书创建机器人并获取 Webhook URL）\n  • 将LLM的输出填入消息内容\n\n⑥ 保存 → 点击「发布」\n\n🎉 你已经有了一个每天早上自动推送AI新闻的Agent！",
        tools: ["dify"],
        tips: "这个案例掌握了Agent最核心的四步：定时触发 → 数据采集 → AI处理 → 结果分发。改改数据源和Prompt就能做很多事情——股票分析、天气提醒、竞品监控等等，都是一个模式。",
      },
      {
        title: "Coze 插件市场实战：用现成插件 5 分钟搭一个 Agent",
        content:
          "Coze 的插件市场有大量预置能力，不用自己写代码。\n\n实战：搭一个「天气+新闻」早间播报Agent\n\n① 创建Bot → 名称「早安播报」\n② 在「插件」面板搜索并添加：\n  • 「天气预报」- 自动获取指定城市天气\n  • 「每日新闻」- 抓取当日热点新闻\n  • 「百度搜索」- 补充搜索能力\n③ 在人设里写：\n  「每天早上7点，自动查询北京天气，获取5条AI领域新闻，组合成一条早安消息发送给用户。格式：先报天气（温度+天气状况+穿衣建议），再报新闻（每条一句话摘要+链接），最后加一句正能量问候。」\n④ 「触发器」设置 → 每天 07:00\n⑤ 发布到飞书/微信 → 测试\n\n💡 Coze 插件广场还有：PDF解析、图片识别、语音合成、邮件发送、短信通知、数据库查询……几乎覆盖所有常见需求。\n\n进阶玩法：把多个Bot串联——先用一个Bot分析用户问题，再根据问题类型路由到不同专业Bot处理。",
        tools: ["coze"],
        tips: "Coze 的插件市场是新手最应该利用的资源。遇到想做的功能，先搜插件广场——大概率已经有现成的了。",
      },
      {
        title: "Dify 知识库优化：让 Agent 真正读懂你的文档",
        content:
          "知识库是Agent的「记忆」。配不好，Agent就会胡说八道。以下是经过实战验证的优化方案：\n\n📋 文档预处理（上传前必做）：\n① 格式清洗：去掉页眉页脚、水印、多余空格和换行\n② 结构化：给文档加清晰的大小标题层级（Agent通过标题理解文档结构）\n③ 分割长文档：超过50页的PDF拆成多个小文件上传\n④ 删除扫描件：扫描版PDF是图片，AI读不了——需要先用OCR转文字\n\n⚙️ Dify 知识库设置（按这个配）：\n• 索引模式：选择「高质量」模式（不是「经济」模式）\n• 分段设置：自定义分段 → 最大长度 500 字符 → 重叠长度 50 字符\n• 检索策略：混合检索（关键词+语义同时搜，召回率最高）\n• Top K：设置为 5（检索最相关的5个文档片段）\n• 分数阈值：0.5（低于此分数的结果不返回）\n\n🧪 测试方法：\n进入Agent预览 → 问一个你确定文档里有的问题 → 看Agent回答是否引用了正确段落 → 如果没有，检查上面设置\n\n📊 进阶：多知识库策略\n• 产品FAQ → 知识库A（客服Agent用）\n• 技术文档 → 知识库B（技术支持Agent用）\n• 内部规章制度 → 知识库C（HR Agent用）\n不同Agent绑定不同知识库，互不干扰。",
        tools: ["dify"],
        tips: "知识库质量决定了Agent回答的下限。花30分钟做好预处理和参数调优，比花3小时写提示词更有效。",
      },
    ],
  },

  // ===== Stage 6: Agent 进阶 =====
  {
    id: 6,
    title: "Agent 进阶",
    subtitle: "OpenClaw 安装、多Agent协作、复杂工作流编排",
    whoIsThisFor: "已经搭建过1-2个Agent，想掌握更强大工具的人",
    timeEstimate: "约 6-8 小时",
    icon: "⊿",
    color: "#3B82C4",
    sections: [
      {
        title: "OpenClaw（龙虾）是什么？为什么这么火？",
        content:
          "OpenClaw（俗称「龙虾」，因为图标是红色龙虾钳）是 2026 年 GitHub 上仅次于 React 的第二大开源项目（24万+星）。\n\n它跟 Dify/Coze 的区别：\n• Dify/Coze：在网页上搭Agent，Agent在云端运行\n• OpenClaw：Agent在你的电脑上运行，可以直接操作你的电脑——开浏览器、读写文件、运行程序、发消息\n\n它能做什么：\n• 🖥 自动操作浏览器（填表、抓数据、自动下单）\n• 📱 对接12+通讯平台（微信/飞书/QQ/Discord/WhatsApp/Telegram）\n• 🧩 13000+社区技能包（相当于Agent的「App Store」）\n• 🔗 接入多种AI模型（Claude/GPT/DeepSeek/Kimi/Gemini）\n• 🧠 持久记忆系统（关掉重开还记得之前聊了什么）\n\n适合谁：已经用过 Dify/Coze，想深入了解Agent底层原理，或者需要Agent直接操作本地电脑的进阶用户。",
        tools: ["openclaw"],
        tips: "OpenClaw 学习曲线比 Dify 陡，但能力天花板也高得多。建议先把Dify玩熟，再来碰OpenClaw。",
      },
      {
        title: "第一步：免费获取 DeepSeek API Key（不用花钱）",
        content:
          "在装 OpenClaw 之前，先搞定模型 API Key。我们选 DeepSeek——完全免费额度送500万token，够用很久。\n\n📋 获取步骤：\n\n① 打开浏览器，访问 platform.deepseek.com\n② 点击右上角「登录」→ 用手机号或微信注册\n③ 登录后进控制台，左侧菜单找到「API Keys」\n④ 点击「创建 API Key」→ 起个名字（如「openclaw」）→ 点确定\n⑤ ⚠️ 立刻复制 Key！只显示一次！关闭后就看不到了\n    Key 格式类似：sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\n⑥ 把 Key 存到一个安全的地方（记事本就行，但不要发到网上）\n\n💰 免费额度：新用户送 500 万 token\n• deepseek-chat：约 1元/百万token（免费额度够用很久）\n• 相比 OpenAI（约 15元/百万token），便宜 15 倍\n\n📌 备用方案：如果 DeepSeek 注册不了，也可以用：\n• 通义千问（dashscope.aliyun.com）：有免费额度\n• 硅基流动（siliconflow.cn）：聚合平台，新用户送额度\n\n现在你有一个免费的 API Key 了，接下来装 OpenClaw。",
        tools: ["deepseek"],
        tips: "API Key 就是你的数字钱包密码。绝对不要发到 GitHub、微信群、或截图到网上。建议复制到记事本保存。",
      },
      {
        title: "第二步：安装 OpenClaw（完整命令行教程）",
        content:
          "⚠️ 先确认电脑上有 Node.js。按 Win+R 输入 powershell 回车，输入 node -v 回车。如果显示 v18.x 或 v22.x 就行。没有的话先去 nodejs.org 下载安装（选 LTS 版本，一路点下一步即可）。\n\n🔧 Windows 安装步骤（每一步都精确说明）：\n\n① 按 Win+R → 输入 powershell → 回车\n② 输入以下命令，回车：\n    npm install -g openclaw\n③ 等待 2-3 分钟，看到类似下面的输出就成功了：\n    + openclaw@2026.4.25\n    added 234 packages in 2m\n④ 接下来是最关键的初始化：输入以下命令，回车\n    openclaw init\n⑤ 你会看到一系列配置问题，逐个回答如下：\n\n  Q1: Select your default AI provider:\n  → 选 deepseek（用方向键移动，回车确认）\n\n  Q2: Enter your DeepSeek API key:\n  → 粘贴 sk-xxxxxxxxxxxxx\n\n  Q3: Select default model:\n  → 选 deepseek-chat（日常够用）\n\n  Q4: Enable web search? (y/n)\n  → 选 y（让Agent能上网搜索）\n\n  Q5: Enable file system access? (y/n)\n  → 选 y（读写电脑文件）\n\n  Q6: Set up messaging platforms? (y/n)\n  → 选 n（先跳过，后面再加）\n\n  Q7: Enable skill marketplace? (y/n)\n  → 选 y（社区技能包）\n\n  ✅ Configuration saved!\n\n⑥ 启动 OpenClaw：\n    openclaw start\n    看到 🦞 OpenClaw is running 就成功了\n\n⑦ 测试一下：打开另一个终端，输入\n    openclaw chat \"你好，介绍一下你自己\"\n    → Agent 应该会用 DeepSeek 回复你\n\n🍎 Mac/Linux 用户：\n  终端输入 npm install -g openclaw，其他步骤完全一样。\n  如果提示权限不足，前面加 sudo：sudo npm install -g openclaw",
        tools: ["openclaw"],
        tips: "安装中如果报错 'npm not found'，说明没装 Node.js。去 nodejs.org 下载 LTS 版本。如果报 'permission denied'（Mac/Linux），在命令前面加 sudo。",
      },
      {
        title: "第三步：多模型配置 + 免费模型接入",
        content:
          "OpenClaw 支持同时接入多个模型，不同任务自动选不同模型。配置文件在：\n\n📍 Windows：C:\\Users\\你的用户名\\.openclaw\\config.yaml\n📍 Mac/Linux：~/.openclaw/config.yaml\n\n🆓 完全免费的模型组合方案：\n\n打开 config.yaml，把下面内容覆盖进去：\n---\nmodels:\n  default: deepseek-chat\n  providers:\n    deepseek:\n      api_key: sk-你的key\n      base_url: https://api.deepseek.com\n      models: [deepseek-chat, deepseek-reasoner]\n    qwen:\n      api_key: sk-你的key\n      base_url: https://dashscope.aliyuncs.com/compatible-mode/v1\n      models: [qwen-plus, qwen-max]\n    siliconflow:\n      api_key: sk-你的key\n      base_url: https://api.siliconflow.cn/v1\n      models: [deepseek-ai/DeepSeek-V3]\n---\n\n📌 各模型获取地址（全部免费）：\n• DeepSeek → platform.deepseek.com → API Keys → 创建\n• 通义千问 → dashscope.aliyun.com → 管理中心 → API-KEY管理\n• 硅基流动 → siliconflow.cn → 控制台 → API密钥\n\n🔄 配置完重启 OpenClaw 生效：\n  Ctrl+C 停掉 → openclaw start 重启\n\n🧪 测试每个模型是否连通：\n  openclaw test deepseek-chat\n  → ✅ Model 'deepseek-chat' test passed\n  openclaw test qwen-plus\n  → ✅ Model 'qwen-plus' test passed\n\n🎯 设置不同任务用不同模型（在 config.yaml 里加）：\n  routing:\n    - when: \"task contains '写代码' or task contains '编程'\"\n      use: deepseek-reasoner\n    - when: \"task contains '翻译' or task contains '闲聊'\"\n      use: qwen-plus\n    - default: deepseek-chat",
        tools: ["openclaw"],
        tips: "日常使用 deepseek-chat 就够了，完全免费。遇到复杂推理问题（解数学题、分析代码）再临时切到 deepseek-reasoner。通义千问的免费额度也不少，可以作为备用。",
      },
      {
        title: "第四步：实战 —— 全自动 AI 新闻早报机器人",
        content:
          "做一个真正全自动的工作流：每天早上 8 点自动抓 AI 新闻 → AI 总结 → 发到你微信。全程无人值守。\n\n🛠 完整配置（复制粘贴即可，改 API Key 就行）：\n\n① 创建技能文件（在终端执行）：\n  openclaw skill create ai-news-digest\n  → 会在技能目录生成一个 ai-news-digest.yaml\n\n② 用记事本打开这个文件，写入以下内容：\n\n-----------\nname: ai-news-digest\ndescription: 每天早上自动抓取AI新闻并推送到微信\nschedule: \"0 8 * * *\"    # 每天早上8点执行\n\nsteps:\n  # 步骤1：抓取新闻源\n  - id: fetch_news\n    action: web_fetch\n    urls:\n      - https://openai.com/blog/rss.xml\n      - https://www.anthropic.com/blog/rss.xml\n      - https://blog.google/technology/ai/rss/\n    extract: \"提取最近24小时内发布的所有AI相关文章标题和链接\"\n\n  # 步骤2：AI 整理摘要\n  - id: summarize\n    action: llm\n    model: deepseek-chat\n    depends_on: fetch_news\n    prompt: |\n      你是一个专业的AI新闻编辑。以下是今早从各大AI公司博客抓取的最新内容。\n      请完成以下任务：\n      1. 选出最重要的5条新闻\n      2. 每条用2句话概括核心内容\n      3. 给每条新闻打标签（产品发布/技术突破/行业动态/开源项目）\n      4. 最后用一句话总结今日AI圈的整体趋势\n      \n      输出格式：\n      🌅 【AI早报】2026年X月X日\n      ━━━━━━━━━━━━━\n      🔥 必读\n      1. [标题]\n         一句话总结\n         🏷 标签\n         🔗 [链接]\n      ...（共5条）\n      ━━━━━━━━━━━━━\n      📊 今日趋势：一句话总结\n\n  # 步骤3：推送到微信\n  - id: send_wechat\n    action: messaging\n    platform: wechat\n    depends_on: summarize\n    target: \"你的微信昵称\"    # 改成你自己的微信名\n    message: \"{{summarize.output}}\"\n\n  # 步骤4：保存到日志\n  - id: save_log\n    action: file_write\n    depends_on: summarize\n    path: \"./logs/ai-news-{{date}}.md\"\n    content: \"{{summarize.output}}\"\n-----------\n\n③ 激活技能：\n  openclaw skill enable ai-news-digest\n  → ✅ Skill 'ai-news-digest' is now active\n\n④ 手动试运行一次（不等明天8点）：\n  openclaw skill run ai-news-digest\n  → 几分钟后你应该在微信收到一条AI早报\n\n🎉 如果收到消息，恭喜——你有了第一个全自动Agent工作流！\n从此每天早上8点自动给你推送AI新闻，不用管它。\n\n💡 改造思路（学会了就可以举一反三）：\n• 把新闻源换成股票API → 自动理财早报\n• 加入天气API → 自动出行提醒\n• 把微信换成飞书/邮件 → 发给团队\n• 加入筛选逻辑 → 只推送你关心的特定话题\n\n核心公式：定时触发 → 抓取数据 → AI处理 → 推送结果。换数据源和提示词就能做无数事情。",
        tools: ["openclaw"],
        tips: "第④步手动试运行一定要做！如果微信收不到消息，检查：①微信插件是否已安装（openclaw plugin install wechat）②是否已扫码登录 ③target 的微信昵称是否写对（不是微信号，是你在微信里的名字）。",
      },
      {
        title: "实战二：全自动邮件处理流水线",
        content:
          "用 OpenClaw + n8n 搭建邮件自动处理系统。收到邮件 → AI分类 → 自动回复/归档/通知。\n\n🛠 n8n 工作流步骤（在 n8n 网页界面拖拽配置）：\n\n① 触发器：Email Trigger (IMAP)\n  • 选择「On new email」\n  • 配置你的邮箱（Gmail/QQ邮箱/企业微信邮箱都行）\n  • 每5分钟检查一次新邮件\n\n② 分类节点：AI Classifier\n  • 连接DeepSeek API\n  • Prompt：「将以下邮件分类为以下类别之一：客户咨询、内部通知、垃圾邮件、账单/发票、其他。只回复分类名称。」\n  • 输入：{{邮件主题 + 正文前200字}}\n\n③ 条件分支（根据分类走不同流程）：\n\n  📌 客户咨询 → 自动回复模板 + 飞书提醒\n    • AI生成回复草稿：「你是XX公司的客服。请根据以下客户邮件，写一个友好专业的回复。先确认收到，再说明会尽快处理，最后给出预计回复时间。」\n    • 自动回复存入「待审核」文件夹\n    • 飞书通知：「新客户咨询：{{发件人}} - {{主题}}」\n  \n  📌 内部通知 → 提取关键信息 → 飞书汇总\n    • AI提取：「提取此邮件的：截止日期、负责人、需要我做什么」\n    • 飞书机器人发送到指定群\n  \n  📌 垃圾邮件 → 自动归档到垃圾箱\n  \n  📌 账单/发票 → AI提取金额+日期 → 记入飞书多维表格\n  \n  📌 其他 → 标记为未读，等待人工处理\n\n④ 每周汇总：\n  • 周日晚上10点自动生成邮件周报\n  • 「本周收到X封邮件，自动处理Y封，Z封待处理。客户咨询平均回复时间：A小时」\n  • 发到你的飞书\n\n📋 这个工作流配置完以后，你只需要每隔几天检查一下「待审核」和「未读」两个文件夹就行。80%的邮件被自动处理了。",
        tools: ["n8n", "openclaw"],
        tips: "邮件自动化最怕的是「自动发送错误回复」。务必设置人工审核环节——AI生成的回复先存在「待审核」文件夹，你看一眼再发。不要全自动发送。",
      },
      {
        title: "Hermes Agent 安装教程（一条命令搞定）",
        content:
          "Hermes 是 Nous Research 开源的 Agent 框架（GitHub 4.7万星），特点是「自我进化」——它能从你让它执行的任务中自动学习，生成可复用的技能。\n\n📋 前置要求：\n• Node.js 22+（node -v 检查）\n• Git\n• 至少一个模型 API Key（DeepSeek 免费，推荐）\n\n🔧 一键安装（所有平台通用）：\n\n打开终端，复制粘贴这一条命令：\n  curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash\n\n安装过程约 2-3 分钟，会自动检测你的系统并配置环境。\n\n⚙️ 初始化配置（跟着向导走）：\n  hermes setup\n\n配置向导会依次问你：\n① 选择默认模型 → 输入 custom → 选 DeepSeek（免费）\n② API Base URL → 输入 https://api.deepseek.com\n③ API Key → 粘贴你的 sk-xxxxxxxx\n④ 默认模型名 → 输入 deepseek-chat\n⑤ 工具权限 → 选 basic（文件读写+命令执行+网络访问）\n⑥ 消息平台 → 先选 skip（后面再加微信/飞书）\n\n✅ 配置完成后检验：\n  hermes --version   → 看到版本号表示安装成功\n  hermes doctor       → 诊断配置，显示「All checks passed」即可\n\n🚀 启动：\n  hermes              → 进入交互模式\n  hermes dashboard    → 打开 Web 管理面板（浏览器访问 localhost:8642）",
        tools: ["hermes"],
        tips: "Hermes 的安装脚本会自动处理所有依赖。如果报错'command not found'，关掉终端重新打开就好了。国内用户如果下载慢，可以用镜像：curl -fsSL https://res1.hermesagent.org.cn/install.sh | bash",
      },
      {
        title: "Hermes 必学 Skill：自动生成技能 + 全自动工作流",
        content:
          "Hermes 的核心优势是「自我学习闭环」——你让它做一件事，它做完后自动把这次经验变成可复用的技能。下次同类任务直接调用技能，无需重复配置。\n\n📌 必学 Skill 1：自动创建技能\n对 Hermes 说：「帮我每天早上8点检查公司竞品官网，抓取新品发布信息，整理成邮件发给我」\nHermes 会：①理解任务 → ②执行一次 → ③自动生成一个叫「竞品监控」的技能 → ④下次你可以直接说「执行竞品监控」\n查看已生成的技能：hermes skills list\n\n📌 必学 Skill 2：定时任务\n  hermes schedule \"每天早上8点\" \"执行竞品监控\"\n  hermes schedule list    → 查看所有定时任务\n  hermes schedule remove 3 → 删除第3个定时任务\n\n📌 必学 Skill 3：多步工作流\n对 Hermes 说一个复杂任务，它会自动拆解：\n「分析这个Excel销售数据 → 找出下降最多的产品 → 写一份改进建议 → 发邮件给销售总监」\nHermes 会逐步执行，每步都向你确认，最后生成完整报告。\n\n📌 必学 Skill 4：Web Dashboard\n  hermes dashboard\n浏览器打开 localhost:8642 → 可视化查看所有对话历史、技能、定时任务、日志。比命令行直观得多。\n\n📌 必学 Skill 5：消息网关（让 Hermes 接入微信/飞书）\n  hermes gateway setup   → 选择平台 → 扫码登录\n配置后你可以在微信里直接 @Hermes 发指令，它自动执行并回复。\n\n🔄 全自动工作流实战：日报机器人\n对 Hermes 说：「请帮我创建一个全自动日报工作流：\n1. 每天早上 8:30 自动执行\n2. 从我的飞书日历提取今天日程\n3. 从 Gmail 提取未回复的重要邮件\n4. 从昨天的聊天记录提取待办事项\n5. 整理成一条消息发到我微信\n6. 把这个工作流保存为技能'每日早报'」\n\nHermes 会逐步确认每个步骤，配置完成后每天早上自动运行。你什么都不用做，到点微信就会收到日报。",
        tools: ["hermes"],
        tips: "Hermes 最强大的地方是「自我进化」——用的越多越聪明。每完成一个任务都自动生成技能，一个月后你就有几十个专属技能，效率碾压手动操作。",
      },
      {
        title: "Agent 搭建常见报错速查手册",
        content:
          "整理了 10 个最高频的报错和解决方案，建议收藏。\n\n❌ 报错1：「Invalid API Key」\n→ 检查 Key 是否复制完整（前后没空格）→ DeepSeek 的 Key 格式是 sk-开头 → 去控制台重新生成\n\n❌ 报错2：「Rate limit exceeded」\n→ 调用太频繁，等几秒再试 → 免费API有每分钟/每天限制 → 升级付费或用多个Key轮换\n\n❌ 报错3：「Context length exceeded」\n→ 内容超过了模型最大长度 → 缩短提示词 → 减少知识库检索数量 → 换更长上下文模型\n\n❌ 报错4：「知识库检索不到内容」\n→ 检查文档是否上传成功 → 检索策略改成「混合检索」→ 调低分数阈值到0.3 → 增大 Top K 到8\n\n❌ 报错5：「Agent 回答中途截断」\n→ 模型输出有最大token限制 → 提示词里加「输出控制在XX字以内」→ 调大「最大输出token」\n\n❌ 报错6：「Webhook/飞书收不到消息」\n→ 检查 Webhook URL 是否正确 → 飞书机器人需先添加到群 → 确认工作流已发布\n\n❌ 报错7：「定时触发器不执行」\n→ 确认工作流已「发布」不是草稿 → 免费版可能有±5分钟延迟 → 检查时区设置\n\n❌ 报错8：「OpenClaw command not found」\n→ 确认安装成功 → 关掉终端重新打开 → Win检查环境变量 → Mac执行 source ~/.zshrc\n\n❌ 报错9：「OpenClaw 连接微信失败」\n→ 确认安装微信插件 → 用手机App扫码不是截图 → 尝试企业微信\n\n❌ 报错10：「Node.js 版本不兼容」\n→ node -v 检查，需要 ≥ 18 → 去 nodejs.org 下载 LTS → 安装后重启终端",
        tools: ["dify", "coze", "openclaw", "hermes"],
        tips: "遇到报错先别慌。把完整报错信息复制给 ChatGPT 或 Kimi，让它帮你分析——AI时代最快解决问题的方式就是用AI帮你debug。\n\nHermes 特有报错：「hermes: command not found」→ 关掉终端重新打开。「安装脚本下载失败」→ 用国内镜像 res1.hermesagent.org.cn。「API 调用失败」→ hermes doctor 诊断配置。「消息平台登录失败」→ 确认用手机App扫码，不是电脑截图。",
      },
    ],
  },

  // ===== Stage 7: Agent 实战 =====
  {
    id: 7,
    title: "Agent 实战",
    subtitle: "在真实业务场景中落地Agent工作流",
    whoIsThisFor: "已经掌握Agent搭建技能，想在业务中真正落地的人",
    timeEstimate: "持续迭代",
    icon: "★",
    color: "#C8944A",
    sections: [
      {
        title: "实战场景一：智能客服系统",
        content:
          "整合 Dify/Coze + 企业微信/飞书，搭建客服Agent。\n\n📋 步骤拆解：\n① 整理FAQ：把过去3个月最常被问的50个问题整理成文档\n② 在Dify创建知识库，上传FAQ文档\n③ 写Agent提示词，强调「不知道就说不知道，不要编答案」\n④ 配置人机协作：简单问题自动回，复杂问题转人工\n⑤ 发布到企业微信/飞书\n\n📊 上线后持续优化：\n• 每周分析Agent没回答好的问题（Dify有日志功能）\n• 把新问题加入知识库\n• 调整Prompt让回复更精准\n\n💰 成本估算：用DeepSeek API的话，处理1000次客服对话大约花0.5元。",
        tools: ["dify", "coze"],
        tips: "客服Agent不要追求一上线就完美。让它先在真实对话中跑一周，收集没回答好的问题，针对性补知识库。",
      },
      {
        title: "实战场景二：AI 内容工厂",
        content:
          "搭建自动化内容生产流水线：一个人 + 一个Agent团队 = 一个内容团队的产出。\n\n🏭 流水线设计：\n① 热点监控Agent：定时抓取行业热搜和竞品动态\n② 选题决策Agent：基于热点+你的内容策略，推荐当日选题\n③ 内容生成Agent：按平台风格生成内容（公众号深度/小红书种草/知乎专业）\n④ 配图生成Agent：用AI绘图生成配图\n⑤ 质量检查Agent：检查事实准确性、语言流畅度、平台适配度\n⑥ 定时发布Agent：在预定的时间自动发布\n\n🛠 技术方案：Dify工作流 + 即梦API（配图）+ 各平台API（发布）\n\n⚠️ 关键提醒：全自动内容发布有风险。建议设置「人工审核」节点——生成内容后先发给你确认，你再点发布。",
        tools: ["dify", "n8n", "coze"],
        tips: "内容Agent的难点是质量把控。必须设置「质量检查Agent」作为守门员——不合格的内容打回重写，不要直接发。",
      },
      {
        title: "实战场景三：个人效率工作流",
        content:
          "用 Agent 接管你每天重复性的信息处理工作。\n\n🌅 早晨 8:00 自动推送今日摘要：\n• 从日历提取今日日程\n• 从邮件提取未回复的重要邮件\n• 从微信提取未读的重要消息\n• 汇总成一条消息推送到你手机\n\n📰 上午 9:00 行业资讯速递：\n• 抓取你关注的行业网站\n• AI筛选与你的业务相关的内容\n• 生成300字摘要推送到飞书\n\n📝 会后自动生成纪要：\n• 会议录音 → 飞书妙记/AI转录 → 提取要点和行动项 → 发到相关群\n\n📊 周五自动周报：\n• 汇总本周的日历、邮件、Git提交\n• AI生成周报初稿\n• 发给你审核修改后提交\n\n🛠 建议从最痛的一个场景开始，做好一个再加下一个。不要一次性铺开。",
        tools: ["dify", "n8n"],
        tips: "个人效率Agent的核心原则：只做流程固定、不需要频繁人工判断的事。从「每周五汇总Git提交生成周报」这种确定性高的场景开始。",
      },
      {
        title: "进阶指南：傻瓜式安装 OpenClaw 和 Hermes",
        content:
          "如果你想要比 QClaw 更自由、更强的功能，可以试试源头的 OpenClaw 和 Hermes。现在网上已经有「一键部署包」，完全不需要懂命令行。\n\n🦞 OpenClaw 傻瓜式安装（5分钟，零代码）：\n① 关闭杀毒软件（360/电脑管家/Windows Defender 都关掉）\n② 下载一键部署包 → 用 WinRAR 解压到英文路径（如 D:\\OpenClaw）\n③ 双击「OpenClaw Windows 一键启动.exe」\n④ 等待 3-5 分钟自动安装完成\n⑤ 看到「Gateway 在线」即成功\n\n⚠️ 注意：路径必须纯英文（D:\\OpenClaw 可以，D:\\软件\\OpenClaw 不行），安装过程中不要关闭窗口。\n\n📥 下载渠道：openclaw.ikidi.top 或 github.com/736773174/openclaw-setup-cn\n\n🔮 Hermes 傻瓜式安装（WSL2 + 一条命令）：\n① Win 键 → 输入 powershell → 右键「以管理员身份运行」\n② 输入 wsl --install → 重启电脑\n③ 开始菜单打开 Ubuntu → 设置用户名密码\n④ 输入：curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash\n⑤ 等待 3-5 分钟 → source ~/.bashrc → hermes doctor 验证\n\n💡 更省事的方法：直接在 QClaw 里说「帮我安装 OpenClaw」或「帮我安装 Hermes」，它会自动帮你下载、配置、启动。你只需要看着就行。\n\n🎯 装好之后跟 QClaw 的区别：你可以自由切换任何 AI 模型（不限于内置的几个），可以自己写技能、改底层配置，真正拥有完全的控制权。",
        tools: ["openclaw", "hermes", "qclaw"],
        tips: "OpenClaw 和 Hermes 的区别：OpenClaw 生态更大（13000+技能），Hermes 更聪明（能自我进化、自动生成技能）。两个都装不冲突，可以同时运行。",
      },
      {
        title: "进阶应用：用 Agent 搭建全自动工作流实例",
        content:
          "以下是可以直接复制的全自动工作流，在 QClaw/OpenClaw/Hermes 中都能运行：\n\n📊 工作流1：全自动竞品监控\n「每天早上8点，打开百度搜索[产品名]，抓取前10条结果；打开36氪搜索[行业关键词]，抓取最新5篇文章；汇总所有信息生成竞品日报，发到我微信。」\n\n📧 工作流2：邮件智能管家\n「检查我的邮箱，将邮件分类为：需回复/待跟进/通知/垃圾。需回复的邮件用AI生成回复草稿存到草稿箱。每天早上9点和下午5点各执行一次。」\n\n📝 工作流3：会议纪要机器人\n「监听飞书/腾讯会议的录音，会议结束后自动转文字，提取讨论要点、决议事项、待办任务，按负责人分类，发到相关群。」\n\n💰 工作流4：自动记账分析\n「监控我的微信/支付宝账单截图，自动识别金额、类别、商家，记入Excel。每周日生成消费分析报告：总支出的饼图、各分类趋势、省钱建议。」\n\n🎨 工作流5：内容工厂\n「每天早上从微博热搜和百度指数抓Top10话题 → AI筛选跟[你的领域]相关的3个 → 自动生成公众号文章+小红书笔记+知乎回答三个版本 → 存到待发布文件夹等你审核。」\n\n🔗 工作流6：跨平台数据同步\n「当我在飞书多维表格新增一行数据时 → 自动同步到Notion数据库 → 同时在企业微信通知相关人员 → 更新Google日历。」",
        tools: ["qclaw", "openclaw", "hermes", "n8n"],
        tips: "这些工作流的核心公式都是：定时触发 → 数据采集 → AI处理 → 结果分发。改改数据源和提示词就能变成你的专属自动化流程。先从最需要的一个开始，做好再加下一个。",
      },
      {
        title: "30天巩固计划 + 持续学习",
        content:
          "🔁 30天巩固计划：\n• 第1周：回顾阶段1-3，确保日常AI使用足够熟练\n• 第2周：安装 QClaw，练习阶段5的 Agent 搭建\n• 第3周：尝试上面6个全自动工作流中的1-2个，真正跑起来\n• 第4周：如果想更进一步，让 QClaw 帮你装 OpenClaw 或 Hermes\n\n📚 持续学习资源：\n• 关注 小白AI 的新闻板块——Agent 自动维护最新资讯\n• 加入「通往AGI之路」（waytoagi.com）中文AI社区\n• 关注 Hugging Face 的热门模型和 Demo\n• 每月尝试一个新AI工具，保持手感\n\n⚠️ AI学习的最大陷阱是「永远在学、从不用」。每个新概念学完后，立刻用最小成本做一个东西出来。完成比完美重要100倍。",
        tools: ["waytoagi", "huggingface", "qclaw"],
        tips: "你已经比99%的人更懂AI了。下一步不是学更多，而是用更多——把你学到的用在真实的工作和生活中。",
      },
    ],
  },
]

export function getStageLabel(stage: number): string {
  const labels: Record<number, string> = {
    0: "纯小白",
    1: "初体验",
    2: "日常提效",
    3: "Prompt进阶",
    4: "工具达人",
    5: "Agent入门",
    6: "Agent进阶",
    7: "Agent实战",
  }
  return labels[stage] || ""
}
