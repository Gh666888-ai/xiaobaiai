export type MissionToolAction = {
  label: string
  href: string
  readyText: string
  setupText: string
}

export type MissionTroubleTip = {
  problem: string
  fix: string
}

export type MissionStep = {
  title: string
  desc: string
  action: string
  deliverable: string
  prompt: string
  proof?: {
    method: "self-check" | "artifact" | "recap"
    label: string
    placeholder?: string
    minLength?: number
    requiredChecks?: number
  }
  toolAction?: MissionToolAction
  clickPath?: string[]
  checklist?: string[]
  validation?: string[]
  fixPrompt?: string
  troubleTips?: MissionTroubleTip[]
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
    id: "ai-ppt-first-deck",
    title: "用 AI 做一份 6 页 PPT 初稿",
    shortTitle: "AI PPT 初稿",
    tagline: "不是一句话生成就结束，而是把资料约束、听众目标、事实检查、改稿标准和复盘模板跑通。",
    audience: "适合要做工作汇报、课程作业、方案介绍、产品介绍的人；已经会用 AI 生成 PPT 的用户，重点练“验收、改稿和复用”。",
    outcome: "完成一份可验收的 6 页 PPT 初稿：需求单、页面结构、事实核查、改稿记录、演讲备注、导出文件和可复用复盘。",
    whyNow: "很多人已经能在 AI 工具里一句话生成 PPT，但真正有价值的是把生成结果改到能汇报：资料不乱编、标题是结论句、每页有证据和行动项、下次能复用同一套流程。",
    minutes: "25-45 分钟",
    stage: "L2 完成任务",
    xp: 65,
    badge: "AI PPT 入门徽章",
    difficulty: "新手",
    toolIds: ["gamma", "canva-ai", "ppt-master", "kimi"],
    tags: ["PPT", "Gamma", "办公", "汇报"],
    materials: ["一个 PPT 主题", "可粘贴的资料或大纲", "听众是谁", "希望生成 6-8 页还是更多页"],
    steps: [
      {
        title: "确认你的 PPT 工具和验收口径",
        desc: "新手先打开 Gamma；已经装过 WPS AI、Canva、PowerPoint Copilot 或其他 AI 工具的人，不用换工具，重点确认后面能导出、能改稿、能检查事实。",
        action: "打开你准备使用的 PPT/AI 工具，进入生成或编辑页面；同时写下一句话：这份 PPT 最后要给谁看、要让对方做什么决定。",
        deliverable: "一个可生成或编辑 PPT 的工具页面，以及一句明确的汇报目标。",
        toolAction: {
          label: "打开 Gamma",
          href: "https://gamma.app",
          setupText: "没有账号：打开 Gamma，用邮箱或第三方账号登录。",
          readyText: "已经有自己的 AI/PPT 工具：直接进入生成或编辑页面，后续按同一套验收标准检查。",
        },
        clickPath: ["打开 Gamma", "登录账号", "点击 Create new", "选择 Generate / Paste in text"],
        checklist: ["能正常打开工具", "能进入创建或编辑页面", "写清楚听众和汇报目标", "知道备用工具是 Canva / PPT Master / WPS AI"],
        validation: ["页面里有输入主题、粘贴大纲或编辑幻灯片的位置", "你写下了这份 PPT 要给谁看、要达成什么结果"],
        prompt: "这一步不需要复制提示词。先把工具打开，确认可以进入创建演示稿页面；如果你已经有自己的 AI 工具，就写下听众和汇报目标后继续。",
        troubleTips: [
          { problem: "Gamma 打不开或注册不了", fix: "先换 Canva、PPT Master、WPS AI，或者用 Kimi/DeepSeek 生成大纲后手动放进 PPT。" },
          { problem: "不知道选哪个工具", fix: "第一次只选 Gamma。做出初稿比选到完美工具更重要。" },
        ],
      },
      {
        title: "把资料整理成 PPT 需求",
        desc: "会用 AI 的人也不要只发一句“帮我做 PPT”。先把主题、听众、目标、页数、资料边界和不能编造的信息整理成需求单。",
        action: "把资料复制到任意 AI 工具里，让它先整理成一份 PPT 需求单；如果你已经生成过 PPT，也要反向补一份需求单。",
        deliverable: "一份可复制给 PPT 工具、也可用来验收成稿的需求单。",
        toolAction: {
          label: "打开 Kimi 整理资料",
          href: "https://kimi.moonshot.cn",
          setupText: "没有 Kimi：也可以用 DeepSeek、豆包、通义千问整理资料。",
          readyText: "已经有 PPT 初稿：不要跳过，反向整理一份需求单，用来检查初稿是否跑偏。",
        },
        clickPath: ["打开 Kimi / DeepSeek", "粘贴资料", "复制下面提示词", "让 AI 输出 PPT 需求单"],
        checklist: ["写清楚 PPT 主题", "写清楚给谁看", "写清楚想让对方做什么决定", "标出必须出现的数据或案例"],
        validation: ["需求单里有主题、听众、目标、页数、风格、必备内容和不可编造边界", "没有敏感信息或已做脱敏"],
        prompt:
          "请把下面资料整理成一份适合生成 PPT 的需求单。\n\n输出格式：\n1. PPT主题：\n2. 听众是谁：\n3. 汇报目标：\n4. 建议页数：6页\n5. 必须包含的信息：\n6. 每页建议标题：\n7. 风格要求：简洁、正式、适合汇报\n8. 不能编造的内容：资料里没有的数据请写“未提供”。\n\n资料如下：\n【粘贴你的资料】",
        fixPrompt:
          "这份需求单太散了。请重新整理成可以直接复制给 Gamma 的版本：主题明确、页数固定为 6 页、每页有标题和要点，不要加入资料里没有的事实。",
      },
      {
        title: "复制提示词生成 6 页初稿",
        desc: "生成不难，难的是让初稿结构可检查。把需求单粘贴到工具里，要求每页有标题、要点、证据位置和演讲备注。",
        action: "回到 PPT 工具，把下面提示词和需求单一起粘贴进去；如果你已经一句话生成过，重新用这份结构要求生成或改写一次。",
        deliverable: "一份带有结论标题、证据位置和演讲备注的 6 页 PPT 初稿。",
        toolAction: {
          label: "回到 Gamma 生成",
          href: "https://gamma.app",
          setupText: "进入 Create new / Generate，把提示词粘贴进去。",
          readyText: "如果你用 Canva/WPS，也在“AI 生成演示文稿”入口粘贴同一段需求。",
        },
        clickPath: ["Create new", "Generate", "粘贴提示词和需求单", "选择中文", "选择 6 页", "点击生成"],
        checklist: ["页数控制在 6-8 页", "选择中文输出", "每页保留证据/数据位置", "先生成初稿，不急着调样式"],
        validation: ["生成结果至少有标题页、背景、问题、方案、计划、总结", "每页有结论标题、3-5 个要点和演讲备注"],
        prompt:
          "请根据下面需求生成一份中文 PPT 初稿。\n\n要求：\n- 页数：6 页\n- 风格：简洁、正式、适合汇报\n- 每页只讲一个重点\n- 每页标题必须是结论句，不要写空泛标题\n- 每页包含：页面标题、3-5个要点、证据/数据位置、图表/配图建议、演讲备注\n- 不要编造资料里没有的数据，没有资料支持就写“待补数据”\n\n页面结构：\n第1页：标题页，一句话说明核心结论\n第2页：背景，为什么要讲这个问题\n第3页：现状/问题，列出3个关键问题\n第4页：方案，给出3个可执行建议\n第5页：计划，按时间顺序列出下一步\n第6页：总结，给出结论和行动项\n\n我的需求单：\n【粘贴上一步生成的需求单】",
        fixPrompt:
          "这版 PPT 太空泛了。请重写：每页标题改成结论句，删除套话，每页最多 3 个核心要点，补充具体例子或标注“这里需要人工补数据”。",
      },
      {
        title: "检查并修改空泛内容",
        desc: "这一步是给已经会 AI 的用户准备的深水区：AI 生成只是 30%，逐页验收和改稿才决定能不能真的拿去汇报。",
        action: "逐页检查标题、事实、数据、案例、行动项和听众适配；发现空泛内容就复制补救提示词继续修改。",
        deliverable: "一份经过事实检查、空话删除和听众适配的 PPT 修改版。",
        checklist: ["每页标题是不是结论句", "有没有真实数据或案例", "有没有明显 AI 套话", "每页要点是否少于 5 条", "听众能不能一眼看懂下一步"],
        validation: ["没有“赋能、升级、打造闭环”等空泛堆词", "重要结论都有数据、案例或人工备注", "不确定的内容已标注待确认"],
        prompt:
          "请帮我检查这份 PPT 初稿是否能用于真实汇报。\n\n请按页输出：\n1. 这一页最大的问题\n2. 哪些话太空泛\n3. 应该补什么数据或案例\n4. 更适合的页面标题\n5. 修改后的页面文案\n\nPPT内容如下：\n【粘贴PPT文本】",
        fixPrompt:
          "请把这页改得更像真人汇报：少用口号，多用具体场景、数字、例子和行动项。没有资料支持的结论不要强行写。",
      },
      {
        title: "导出文件并发复盘",
        desc: "最后把结果导出成 PPTX 或 PDF，再把你的提示词和踩坑记录下来，下次能直接复用。",
        action: "在工具右上角找 Export / Share，导出 PPTX 或 PDF；然后复制复盘模板记录本次流程。",
        deliverable: "一个可继续编辑的 PPT/PDF 文件和一篇任务复盘。",
        clickPath: ["点击 Share / Export", "选择 PowerPoint / PDF", "保存文件", "回到小白AI复制复盘模板"],
        checklist: ["已导出文件", "已补上姓名、日期、Logo", "已保存最有用的提示词", "已记录哪里需要人工修改"],
        validation: ["文件能打开", "关键页能继续编辑", "复盘里有工具、资料、提示词和修改点"],
        prompt:
          "请把我这次 AI 做 PPT 的过程整理成复盘。\n\n结构：\n主题：\n使用工具：\n原始资料类型：\n最有用的提示词：\n生成结果哪里能用：\n哪里必须人工修改：\n下次我会怎么做得更快：",
      },
    ],
    recapTemplate:
      "我用 AI 做了一份 PPT 初稿。\n\n主题：\n使用工具：\n原始资料类型：\n最有用的提示词：\n生成结果哪里能用：\n哪里必须人工修改：\n导出格式：\n下次我会怎么改进：",
    resources: [
      { label: "AI PPT工具推荐", href: "/ai-ppt-tools" },
      { label: "Gamma怎么做PPT", href: "/gamma-ppt" },
      { label: "发布任务复盘", href: "/community/new" },
    ],
  },
  {
    id: "kimi-k26-long-doc",
    title: "用 Kimi 分析一份长文档并生成行动清单",
    shortTitle: "Kimi 长文档",
    tagline: "从上传资料、明确问题、提取摘要到生成行动清单，跑通一次文档分析。",
    audience: "适合有合同、论文、课程资料、产品文档、会议记录或长聊天记录的人。",
    outcome: "得到一份结构化摘要、风险清单、行动清单和可复用 Prompt。",
    whyNow: "长文档分析是普通用户最容易马上用起来的 AI 场景，但必须先明确阅读目的，否则只会得到一段泛泛总结。",
    minutes: "25-45 分钟",
    stage: "L2 完成任务",
    xp: 60,
    badge: "长文档分析徽章",
    difficulty: "新手",
    toolIds: ["kimi", "deepseek"],
    tags: ["Kimi", "长文档", "资料分析", "行动清单"],
    materials: ["一份 PDF/Word/网页资料", "你关心的 3 个问题", "最终要做什么决策"],
    steps: [
      {
        title: "打开 Kimi 并上传资料",
        desc: "先把资料放进能读长文档的工具里。敏感资料要先脱敏。",
        action: "打开 Kimi，把 PDF、Word 或文字资料上传/粘贴进去。",
        deliverable: "资料已经出现在 AI 对话窗口里。",
        toolAction: {
          label: "打开 Kimi",
          href: "https://kimi.moonshot.cn",
          setupText: "没有 Kimi：也可以用 DeepSeek、通义千问、豆包等支持文件分析的工具。",
          readyText: "已经上传过资料：直接进入下一步。",
        },
        clickPath: ["打开 Kimi", "点击上传文件或粘贴文字", "等待文件读取完成", "确认文件名显示在对话里"],
        checklist: ["资料已脱敏", "文件能正常读取", "知道这次分析要解决什么问题"],
        validation: ["AI 能识别文件标题或内容", "没有把身份证、手机号、客户隐私等敏感信息直接上传"],
        prompt: "我会上传一份资料。请先确认你能读取资料，并用一句话说明这份资料大概是什么。不要开始总结。",
        troubleTips: [
          { problem: "文件太大上传失败", fix: "先拆成几段，或只粘贴目录、摘要和关键章节。" },
          { problem: "资料有敏感信息", fix: "先删除姓名、电话、合同金额、客户名称等信息再上传。" },
        ],
      },
      {
        title: "先定义阅读目的",
        desc: "同一份文档，为写摘要、做决策、找风险，问法完全不同。",
        action: "复制提示词，让 AI 先帮你整理 3-5 个值得追问的问题。",
        deliverable: "3 个你真正关心的问题。",
        checklist: ["写清楚你要做摘要、决策还是找风险", "问题不要太泛", "问题要能指导下一步动作"],
        validation: ["每个问题都和你的真实场景有关", "不是只问“总结一下”"],
        prompt:
          "请根据这份资料和我的目标，帮我整理 3-5 个最值得追问的问题。\n\n我的目标是：【写你的目标，例如做汇报/做决策/找风险/写行动计划】\n\n要求：不要直接总结，先告诉我应该问哪些问题，为什么这些问题重要。",
        fixPrompt: "这些问题太泛了。请改成能指导行动的问题，每个问题都要说明它会影响什么决策。",
      },
      {
        title: "提取结构化摘要",
        desc: "让 AI 输出事实、观点、数字、风险，不要混在一段话里。",
        action: "把你选中的问题复制进去，让 AI 按表格提取摘要。",
        deliverable: "一张结构化摘要表。",
        checklist: ["要求只基于资料", "要求标出未提供信息", "要求分开事实和观点"],
        validation: ["表格里有事实、关键数字、观点、风险、待确认项", "没有明显编造"],
        prompt:
          "请只基于资料内容输出结构化表格。\n\n表格字段：\n- 核心事实\n- 关键数字\n- 重要观点\n- 风险点\n- 对我的影响\n- 需要人工确认的地方\n\n资料里没有的内容写“未提供”，不要编造。",
        fixPrompt: "请重新输出，必须区分“资料事实”和“你的推断”。资料没有的数据不要补。",
      },
      {
        title: "生成行动清单",
        desc: "从“我读懂了”走到“我下一步做什么”。",
        action: "让 AI 把摘要转成可执行行动，每条行动都要有原因和截止建议。",
        deliverable: "按优先级排序的行动清单。",
        checklist: ["每条行动有负责人类型", "每条行动有原因", "每条行动有截止建议", "高风险项排在前面"],
        validation: ["行动不是空话", "下一步可以直接分配给人或自己执行"],
        prompt:
          "请基于上面的结构化摘要生成行动清单。\n\n每一项包含：\n1. 行动\n2. 为什么要做\n3. 需要什么材料\n4. 负责人类型\n5. 优先级\n6. 截止建议\n7. 风险提醒",
        fixPrompt: "这份行动清单还不够具体。请把每条行动改成今天或本周能执行的一句话，并补上负责人和截止时间。",
      },
      {
        title: "保存可复用 Prompt",
        desc: "把这次有效的问法保存下来，下次可以直接套用。",
        action: "复制复盘提示词，让 AI 整理成你自己的长文档分析模板。",
        deliverable: "一套自己的长文档分析 Prompt。",
        checklist: ["保留变量占位符", "记录适合什么资料", "记录不适合什么资料"],
        validation: ["下次换一份资料也能复用", "模板里有风险和人工确认要求"],
        prompt:
          "请把这次分析流程整理成一个可复用 Prompt 模板。\n\n要求：\n- 保留变量占位符，例如【文档类型】【我的目标】【输出格式】\n- 包含“不编造资料里没有的信息”\n- 包含“需要人工确认的地方”\n- 输出步骤清晰，方便下次复制使用。",
      },
    ],
    recapTemplate:
      "我用 AI 分析了一份长文档。\n\n文档类型：\n我的目标：\n上传/粘贴方式：\n最有用的问题：\n最有用的输出：\n发现的风险：\n行动清单：\n可复用 Prompt：",
    resources: [
      { label: "Kimi 工具详情", href: "/tools/%E5%AF%B9%E8%AF%9DAI/kimi" },
      { label: "DeepSeek 对比参考", href: "/deepseek" },
      { label: "学习 L2 完成任务", href: "/learn/2" },
    ],
  },
  {
    id: "xiaohongshu-ai-content-loop",
    title: "做一条小红书 AI 内容流水线",
    shortTitle: "内容流水线",
    tagline: "从选题、正文、配图到发布检查，按步骤做出一条可发布内容。",
    audience: "适合想做内容账号、产品宣传、个人 IP、课程笔记或店铺种草内容的人。",
    outcome: "完成一条可发布内容：选题、标题、正文、配图提示词和发布前检查清单。",
    whyNow: "内容场景容易吸引新手，也最容易变成空泛模板。流程必须逼用户加入真实经历、产品细节和人工检查。",
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
        title: "打开写作工具并输入真实素材",
        desc: "不要让 AI 凭空编热点。先把你的经历、产品、读者和目的说清楚。",
        action: "打开 DeepSeek、Kimi 或豆包，把你的真实素材粘贴进去。",
        deliverable: "一段真实素材说明。",
        toolAction: {
          label: "打开 DeepSeek",
          href: "https://chat.deepseek.com",
          setupText: "没有 DeepSeek：用 Kimi、豆包、通义千问也可以。",
          readyText: "已经有写作工具：直接粘贴素材。",
        },
        clickPath: ["打开 AI 对话工具", "新建对话", "粘贴真实素材", "说明目标读者"],
        checklist: ["素材来自真实经历或产品", "写清楚目标读者", "写清楚想让读者做什么"],
        validation: ["素材不是只有一句“帮我写爆款”", "包含场景、问题、对象和限制"],
        prompt:
          "我想做一条小红书内容。请先帮我整理素材，不要直接写正文。\n\n我的真实素材：\n【写你的经历/产品/观点】\n目标读者：\n发布目的：\n不能夸大的地方：\n\n请输出：适合的内容角度、读者痛点、可以展开的真实细节。",
        fixPrompt: "这些角度太像营销号。请改成更真实、更具体、更像普通人经验分享的选题。",
      },
      {
        title: "生成 3 个选题并选一个",
        desc: "先选题，再写正文。选题要具体到一个人群、一个问题、一个结果。",
        action: "复制提示词生成 3 个选题，从中选一个最真实的。",
        deliverable: "3 个选题和 1 个最终选题。",
        checklist: ["标题不夸大", "读者一眼知道能得到什么", "和你的真实素材相关"],
        validation: ["选题不是泛泛的“AI工具推荐”", "选题能引出你的具体经验"],
        prompt:
          "请基于我的真实素材生成 3 个小红书选题。\n\n每个选题包含：\n1. 标题\n2. 目标读者\n3. 读者痛点\n4. 为什么值得看\n5. 可以写哪些真实细节\n\n要求：不要夸大收益，不要编造经历，不要像硬广。",
        fixPrompt: "请把标题改得更具体：减少感叹号和夸张词，突出一个真实问题和一个可执行结果。",
      },
      {
        title: "写正文草稿",
        desc: "结构可以 AI 帮忙，细节必须来自你。先写 500-800 字，不追求一次完美。",
        action: "把最终选题复制进去，让 AI 生成正文草稿。",
        deliverable: "一篇 500-800 字正文草稿。",
        checklist: ["开头有真实痛点", "中间有步骤", "结尾有建议", "没有夸大承诺"],
        validation: ["读起来不像广告", "有你的真实细节", "每段都能删改"],
        prompt:
          "请根据这个选题写一篇 500-800 字小红书正文草稿。\n\n要求：\n- 开头用真实痛点，不要喊口号\n- 中间写清楚步骤\n- 加入我提供的真实细节\n- 结尾给可执行建议\n- 不要过度营销，不要夸大效果\n\n选题：\n【粘贴最终选题】",
        fixPrompt: "这篇太像广告了。请降低营销感，增加真实细节、踩坑和普通人的表达。",
      },
      {
        title: "生成配图提示词",
        desc: "一篇内容先配 1-3 张图，不要一上来做复杂视频。",
        action: "打开即梦或 Canva，复制配图提示词生成封面/配图。",
        deliverable: "3 条配图 Prompt 和至少 1 张配图。",
        toolAction: {
          label: "打开即梦",
          href: "https://jimeng.jianying.com",
          setupText: "没有即梦：用 Canva、豆包图片或通义万相也可以。",
          readyText: "已有配图工具：直接复制提示词生成。",
        },
        clickPath: ["打开图片工具", "选择文生图", "粘贴提示词", "选择 3:4 或 4:5", "生成并保存"],
        checklist: ["封面能看清主题", "不要放过多文字", "图片和正文一致"],
        validation: ["至少生成 1 张可用配图", "没有侵权人物、品牌或敏感内容"],
        prompt:
          "请为这篇小红书内容生成 3 条配图提示词。\n\n每条包含：\n- 画面主体\n- 场景\n- 构图\n- 风格\n- 可放的短文字\n- 避免出现的内容\n\n正文：\n【粘贴正文】",
        fixPrompt: "这些图太空泛。请让画面更具体，突出一个真实使用场景，减少抽象科技感。",
      },
      {
        title: "发布前检查并复盘",
        desc: "最后检查是否夸大、是否像广告、是否缺真实细节，再保存流程。",
        action: "复制检查提示词，让 AI 帮你做发布前审稿。",
        deliverable: "发布检查清单和复盘。",
        checklist: ["没有夸大收益", "没有编造事实", "没有敏感/违规表达", "标题和正文一致", "保存了可复用提示词"],
        validation: ["修改后更像真实经验", "可以复制到发布平台草稿箱"],
        prompt:
          "请检查这篇内容是否有夸大、空话、广告感、事实风险和平台不友好表达，并给出修改建议。\n\n请输出：\n1. 最大风险\n2. 需要删除的句子\n3. 建议补充的真实细节\n4. 修改后的标题\n5. 发布前检查清单",
      },
    ],
    recapTemplate:
      "我用 AI 跑通了一条小红书内容流水线。\n\n选题：\n目标读者：\n用到工具：\n正文结构：\n配图 Prompt：\n发布前改了什么：\n踩坑：\n下一条内容计划：",
    resources: [
      { label: "AI 写作工具推荐", href: "/ai-writing-tools" },
      { label: "AI 绘图工具推荐", href: "/ai-image-tools" },
      { label: "社区发布复盘", href: "/community/new" },
    ],
  },
  {
    id: "dify-knowledge-base-bot",
    title: "用 Dify 搭一个客服知识库",
    shortTitle: "Dify 知识库",
    tagline: "从准备资料、创建知识库、上传文档到测试问题，做出一个能回答基础问题的 Bot。",
    audience: "适合有产品说明、售后政策、课程资料、内部制度或店铺常见问答的人。",
    outcome: "完成 10 条问答资料、一个小型知识库、5 条测试记录和上线边界提示词。",
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
        title: "打开 Dify 并创建知识库",
        desc: "先创建一个很小的知识库，不要一开始导入全部资料。",
        action: "打开 Dify，进入 Knowledge / 知识库，创建一个测试知识库。",
        deliverable: "一个空的测试知识库。",
        toolAction: {
          label: "打开 Dify",
          href: "https://dify.ai",
          setupText: "没有 Dify：注册账号，或用 Coze/FastGPT 做同类流程。",
          readyText: "已经有 Dify：直接进入知识库页面。",
        },
        clickPath: ["打开 Dify", "进入 Knowledge", "Create Knowledge", "命名为“测试客服知识库”"],
        checklist: ["能进入 Dify 工作台", "创建的是测试知识库", "不要先导入全部资料"],
        validation: ["知识库列表里能看到新建知识库", "名称能区分测试和正式环境"],
        prompt: "这一步不需要复制提示词。先打开 Dify 并创建一个测试知识库。",
      },
      {
        title: "把资料拆成问答块",
        desc: "一段只放一条规则，标题尽量写成用户会问的问题。",
        action: "把产品说明或售后资料交给 AI，整理成 10 条问答块。",
        deliverable: "10 条问题 -> 标准回答 -> 来源。",
        checklist: ["每条只回答一个问题", "写清楚资料来源", "不能确定时有转人工话术"],
        validation: ["问答能直接给用户看", "没有资料外承诺"],
        prompt:
          "请把这份资料整理成 10 条知识库问答。\n\n每条包含：\n- 用户问题\n- 标准回答\n- 资料来源\n- 不确定时的转人工话术\n\n要求：不编造资料里没有的信息，不承诺退款、赔偿、价格和法律结论。",
        fixPrompt: "这些问答太长了。请改成更适合知识库召回的短问答，每条只回答一个问题。",
      },
      {
        title: "导入 Dify 知识库",
        desc: "先少量导入，确认切分和召回效果。",
        action: "把整理好的问答保存为文档或直接粘贴到 Dify 知识库。",
        deliverable: "一个小型知识库和导入记录。",
        clickPath: ["进入知识库", "点击 Add document", "上传/粘贴问答资料", "选择自动切分", "等待索引完成"],
        checklist: ["只导入 10 条测试问答", "记录切分设置", "索引完成后再测试"],
        validation: ["文档状态显示可用", "知识库里能看到切分片段"],
        prompt:
          "请根据我的问答资料，建议 Dify 知识库切分方式、Top K、是否需要标题增强，以及测试时应关注哪些问题。",
        fixPrompt: "如果召回不准，请建议我如何重写标题、缩短问答块、调整 Top K 和补充同义问法。",
      },
      {
        title: "测试 5 个真实问题",
        desc: "不要只测标准问法，要测模糊问法、边界问题和无法回答的问题。",
        action: "创建聊天应用并绑定知识库，连续测试 5 个真实问题。",
        deliverable: "5 条测试记录：问题、回答、是否通过、原因。",
        clickPath: ["创建 Chat App", "绑定知识库", "输入测试问题", "记录回答", "标记通过/失败"],
        checklist: ["至少 2 个标准问题", "至少 2 个模糊问题", "至少 1 个资料里没有的问题"],
        validation: ["知道哪些问题答得准", "知道哪些问题必须转人工"],
        prompt:
          "请帮我设计 5 个测试问题，覆盖标准问题、模糊说法、边界场景、资料缺失和需要转人工的情况。",
        fixPrompt: "请根据这些失败回答，判断是资料缺失、切分问题、提示词问题还是模型乱答，并给出修改建议。",
      },
      {
        title: "写上线边界并复盘",
        desc: "客服 Bot 最重要的不是会聊天，是不乱承诺。",
        action: "复制系统提示词，限制 Bot 只能基于知识库回答，不确定就转人工。",
        deliverable: "一段上线前提示词和转人工规则。",
        checklist: ["不能承诺退款赔偿", "不能编造资料", "不确定就转人工", "保存测试记录"],
        validation: ["Bot 知道边界", "复盘里有失败案例和下一步优化点"],
        prompt:
          "请写一段客服 Bot 系统提示词。\n\n要求：\n- 必须基于知识库内容回答\n- 不确定时说明需要人工确认\n- 不能承诺退款、赔偿、价格、合同和法律结论\n- 对资料里没有的问题，给出转人工话术",
      },
    ],
    recapTemplate:
      "我用 Dify 搭了一个客服知识库。\n\n资料来源：\n问答数量：\n切分方式：\n测试问题：\n通过/失败案例：\n转人工边界：\n下一步优化：",
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
    tagline: "从来源、触发、摘要、人工审核到发送，先跑通一个半自动日报流程。",
    audience: "适合想做资讯号、社群日报、行业监控或内部简报的人。",
    outcome: "完成一个半自动资讯流程：抓取来源、AI 摘要、人工确认、发送。",
    whyNow: "自动化是内容护城河的来源。第一次不追求全自动，先让流程能稳定跑通。",
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
        title: "打开 n8n 并创建工作流",
        desc: "先创建一个空工作流，第一次只做半自动版本。",
        action: "打开 n8n，新建 Workflow，命名为“AI 资讯日报测试”。",
        deliverable: "一个空的 n8n 工作流。",
        toolAction: {
          label: "打开 n8n",
          href: "https://n8n.io",
          setupText: "没有 n8n：可以先用云端试用，也可以用手工复制来源跑半自动流程。",
          readyText: "已经有 n8n：直接新建工作流。",
        },
        clickPath: ["打开 n8n", "New Workflow", "命名", "保存"],
        checklist: ["能进入编辑器", "知道接收渠道是飞书/微信/邮箱/文档之一", "不追求第一天全自动"],
        validation: ["工作流已保存", "页面里能添加节点"],
        prompt: "这一步不需要提示词。先创建一个空工作流，准备添加来源、摘要和发送节点。",
      },
      {
        title: "定义资讯范围",
        desc: "不要抓全网。先定义 3 个可靠来源和 3 个筛选条件。",
        action: "列出来源链接和筛选规则，再让 AI 帮你判断是否过宽。",
        deliverable: "来源清单和筛选规则。",
        checklist: ["只有 3 个来源", "每个来源稳定可访问", "筛选规则能判断是否值得发"],
        validation: ["不会每天产生几十条垃圾信息", "筛选标准对新手用户有意义"],
        prompt:
          "请帮我设计一个 AI 资讯日报的筛选规则。\n\n输入是多个新闻标题和摘要。输出只保留对普通 AI 用户有价值的内容，并说明保留原因。\n\n我的来源：\n1. 【来源1】\n2. 【来源2】\n3. 【来源3】\n\n筛选目标：避免低质量、重复、标题党内容。",
        fixPrompt: "这些筛选条件太宽了。请压缩成 3 条明确规则，能直接判断保留或丢弃。",
      },
      {
        title: "画出流程节点",
        desc: "触发、抓取、过滤、摘要、人工确认、发送，一个节点一个职责。",
        action: "先画 6 步流程，再在 n8n 里逐个加节点。",
        deliverable: "6 步流程图或表格。",
        clickPath: ["添加 Manual Trigger", "添加来源节点或手工输入节点", "添加 AI 摘要节点", "添加人工确认节点", "添加发送节点"],
        checklist: ["每个节点只做一件事", "保留人工审核点", "失败时知道停在哪一步"],
        validation: ["流程图能从左到右读懂", "没有一上来做复杂分支"],
        prompt:
          "请把我的 AI 资讯日报流程画成 6 步表格。\n\n字段：步骤、输入、处理动作、输出、使用工具、失败时怎么处理。\n\n要求：必须包含人工审核点，不要直接全自动发布。",
        fixPrompt: "这个流程太复杂了。请压缩成能今天跑通的半自动版本，只保留来源、摘要、审核、发送。",
      },
      {
        title: "先做半自动日报样例",
        desc: "先允许人工复制来源，不急着全自动抓取，跑通闭环更重要。",
        action: "手工复制 3 条资讯，调用 AI 摘要，生成一条日报样例。",
        deliverable: "一条能跑通的日报样例。",
        checklist: ["至少 3 条来源", "每条有摘要和价值判断", "有“新手该做什么”建议"],
        validation: ["日报能直接发给自己或团队看", "不是标题搬运"],
        prompt:
          "请把下面 AI 资讯整理成日报。\n\n每条输出：\n1. 发生了什么\n2. 对 AI 新手有什么影响\n3. 是否值得立刻关注\n4. 可以做什么 0-1 小任务\n\n资讯：\n【粘贴3条资讯】",
        fixPrompt: "这份日报像新闻搬运。请增加“对新手有什么用”和“今天可以做什么任务”。",
      },
      {
        title: "加人工审核并复盘",
        desc: "资讯容易错，发送前必须人工确认事实和标题。",
        action: "加一个人工确认步骤，确认后再发到接收渠道。",
        deliverable: "审核清单和一次发送记录。",
        clickPath: ["摘要后暂停", "人工检查标题和事实", "确认后发送", "记录失败点"],
        checklist: ["事实来源可追溯", "标题不夸大", "没有未经确认的结论", "发送渠道可用"],
        validation: ["自己能收到日报", "知道下次要自动化哪一段"],
        prompt:
          "请帮我检查这份 AI 日报是否有事实风险、标题党、过度解读和新手不友好的表达。请输出修改建议和最终可发送版本。",
      },
    ],
    recapTemplate:
      "我用 n8n 跑通了一个 AI 资讯日报流程。\n\n来源：\n触发方式：\n摘要提示词：\n人工审核点：\n发送渠道：\n第一次结果：\n失败/卡住的地方：\n下一步自动化计划：",
    resources: [
      { label: "工作流自动化", href: "/workflows" },
      { label: "n8n 工具详情", href: "/tools/Agent%E5%B9%B3%E5%8F%B0/n8n-ai-agent" },
      { label: "AI 资讯页", href: "/news" },
    ],
  },
  {
    id: "codex-small-feature",
    title: "用 Codex 完成一个网页小功能",
    shortTitle: "Codex 小功能",
    tagline: "从一个小需求开始，让工程 Agent 读项目、改代码、跑验证，交付可检查结果。",
    audience: "适合有项目、想让 AI 帮忙开发功能但怕它乱改的人。",
    outcome: "完成一个小功能、保留清晰 diff、跑通 build/test，并知道如何验收。",
    whyNow: "工程 Agent 的价值是读写项目、跑命令和持续迭代。新手必须学会给边界、看 diff、跑验证。",
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
        title: "打开项目和 Codex",
        desc: "先在正确的项目目录里启动 Codex，不要让它在未知目录里乱读。",
        action: "打开项目根目录，确认 git 状态，再启动 Codex 或同类工程 Agent。",
        deliverable: "Codex 已经位于正确项目目录。",
        toolAction: {
          label: "查看 Codex 指南",
          href: "/codex",
          setupText: "没有 Codex：可以先用 Cursor Agent 或 Claude Code 做同类流程。",
          readyText: "已经在项目里：确认当前目录和 git 状态后继续。",
        },
        clickPath: ["打开项目目录", "查看当前分支", "确认没有无关改动", "启动 Codex"],
        checklist: ["项目能本地运行", "知道 build/test 命令", "需求足够小"],
        validation: ["Codex 能看到项目文件", "你知道要改哪个页面或功能"],
        prompt: "请先确认当前项目结构和可运行命令。只输出你会读取哪些文件、如何验证，不要立刻修改代码。",
      },
      {
        title: "把需求压缩到一个小功能",
        desc: "不要说“优化整个网站”。只说一个页面、一个组件、一个交互。",
        action: "复制提示词，让 Codex 帮你把需求压缩成最小可交付任务。",
        deliverable: "一句需求 + 三条验收标准。",
        checklist: ["只改一个功能", "最多涉及少量文件", "验收标准能手动检查"],
        validation: ["需求不是泛泛优化", "完成后能截图或运行验证"],
        prompt:
          "请把我的需求压缩成一个最小可交付功能，并列出 3 条验收标准。\n\n限制：\n- 不要扩展无关功能\n- 不要重构\n- 不要新增依赖，除非必须\n- 完成后要说明如何验证\n\n我的需求：\n【写你的需求】",
        fixPrompt: "这个范围还是太大。请继续压缩到最多修改 2 个文件、30-60 分钟能完成的小功能。",
      },
      {
        title: "让 Codex 先读后改",
        desc: "先让它找相关文件和风险，再允许动手。",
        action: "让 Codex 输出相关文件清单和改动计划，你确认后再继续。",
        deliverable: "相关文件清单和改动计划。",
        checklist: ["先读文件", "先列计划", "确认风险", "不马上写代码"],
        validation: ["计划里有文件路径", "计划没有碰无关模块"],
        prompt:
          "请先阅读与这个需求相关的文件，输出改动计划。\n\n限制：\n- 最多涉及 2 个模块\n- 不改无关样式\n- 不新增依赖\n- 先不要写代码\n\n请输出：相关文件、改动点、风险、验证命令。",
        fixPrompt: "这个计划范围太大。请缩小到最少文件，并说明哪些需求先不做。",
      },
      {
        title: "实现并跑验证",
        desc: "完成后检查 diff 是否只碰了约定范围，然后跑 build/test。",
        action: "允许 Codex 实现，再要求它总结 diff 和验证结果。",
        deliverable: "关键 diff 摘要 + build/test 输出。",
        checklist: ["看 git diff", "跑 typecheck/build/test", "失败只修相关问题"],
        validation: ["验证命令通过或失败原因清楚", "diff 没有无关改动"],
        prompt:
          "请按计划实现这个小功能。完成后总结：\n1. 改了哪些文件\n2. 每个文件为什么改\n3. 如何验证\n4. 是否触及无关逻辑\n\n如果验证失败，只修与本次功能直接相关的问题。",
        fixPrompt: "验证失败了。请只根据当前报错修复与本次改动直接相关的问题，不要扩大改动范围。",
      },
      {
        title: "整理复盘",
        desc: "把需求、改动范围、验证命令和踩坑记录下来，下次更会给 Agent 派任务。",
        action: "复制复盘提示词，让 AI 整理成社区复盘。",
        deliverable: "一篇工程任务复盘。",
        checklist: ["记录需求", "记录改动文件", "记录验证命令", "记录踩坑"],
        validation: ["别人能照着理解这次改了什么", "下次能复用任务写法"],
        prompt:
          "请把这次 Codex 工程任务整理成复盘。\n\n结构：\n目标：\n验收标准：\n改动文件：\n验证命令：\n失败/修复记录：\n我下次会怎么给 Codex 写任务：",
      },
    ],
    recapTemplate:
      "我用 Codex 完成了一个网页小功能。\n\n需求：\n验收标准：\n改动文件：\n验证命令：\n结果：\n踩坑：\n下次我会怎么给 Codex 写任务：",
    resources: [
      { label: "Codex 国内使用指南", href: "/codex" },
      { label: "AI 编程工具推荐", href: "/ai-coding" },
      { label: "发布工程复盘", href: "/community/new" },
    ],
  },
  {
    id: "claude-code-deepseek-project",
    title: "用 Claude Code 接 DeepSeek V4 改一个真实项目",
    shortTitle: "Claude Code + DeepSeek V4",
    tagline: "把国产模型接到工程 Agent 里，先完成一个小 diff。",
    audience: "适合已经有一个项目、想体验 AI 改代码和国产模型后端的人。",
    outcome: "跑通配置、让 Agent 阅读项目、改 1 个小功能，并用 build/test 验证。",
    whyNow: "Claude Code / Codex 代表工程 Agent，DeepSeek V4 是模型后端。这个任务能让用户理解 Agent 是工具，模型是后端。",
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
        action: "打开配置说明，确认你要配置的是模型后端，不是更换整个 Agent 工具。",
        deliverable: "一段任务说明：我要让 Claude Code 使用 DeepSeek V4 后端，先读项目，不直接大改。",
        toolAction: {
          label: "查看教程",
          href: "/claude-code-deepseek",
          setupText: "没有 Claude Code：可先用 Codex 完成同类工程任务。",
          readyText: "已经有 Claude Code：继续检查模型配置。",
        },
        checklist: ["知道 Agent 和模型的区别", "知道 base_url、key、model name 是什么", "不会把 API Key 发到公开页面"],
        validation: ["能说清楚 Claude Code 做执行，DeepSeek V4 做模型后端"],
        prompt:
          "你是谨慎的工程 Agent。请先确认当前项目结构和可运行命令，只输出你会读哪些文件、如何验证，不要立刻修改代码。",
      },
      {
        title: "配置 DeepSeek V4 接入",
        desc: "按官方或服务商面板配置 base_url、key 和模型名。先用小命令确认能通。",
        action: "在 Claude Code 配置里填入 base_url、API Key、模型名，并做一次最小测试。",
        deliverable: "一份已脱敏配置记录：base_url、模型名、测试是否成功。",
        clickPath: ["打开配置面板/配置文件", "填写 base_url", "填写 API Key", "填写模型名", "运行一次测试"],
        checklist: ["API Key 已脱敏保存", "模型名准确", "网络能访问服务商", "测试请求成功"],
        validation: ["能得到一次正常回复", "失败时知道是 key、base_url、模型名还是网络问题"],
        prompt:
          "请根据我提供的配置和报错，判断 DeepSeek V4 接入失败的原因。重点检查 base_url、token、模型名、网络和环境变量优先级。",
        fixPrompt: "请把排查步骤缩小到 5 项：base_url、API Key、模型名、网络、环境变量覆盖。每项告诉我怎么看是否正确。",
      },
      {
        title: "只让 Agent 读项目并列计划",
        desc: "第一次不要允许它全项目乱改。先让它列出涉及文件和最小改动方案。",
        action: "给 Agent 一个小需求，让它先读文件并输出计划。",
        deliverable: "一个 1-2 个文件范围内的改动计划。",
        checklist: ["需求足够小", "先列计划", "最多改 2 个文件", "验证方式清楚"],
        validation: ["计划能看出文件范围和风险", "没有全项目重构"],
        prompt:
          "请阅读这个需求和相关文件，提出一个最小改动方案。\n\n限制：最多修改 2 个文件；不要重构；完成后必须说明验证命令。\n\n需求：\n【写一个很小的需求】",
        fixPrompt: "这个计划太大。请缩小到一个页面或一个组件，并说明哪些内容暂时不做。",
      },
      {
        title: "落地一个小 diff 并验证",
        desc: "执行改动后看 git diff，跑 build/test。失败就让 Agent 只修失败点。",
        action: "允许 Agent 实现改动，然后检查 diff 和验证结果。",
        deliverable: "git diff 摘要 + build/test 结果。",
        checklist: ["查看 diff", "运行验证命令", "只修相关失败", "记录最终结果"],
        validation: ["build/test 通过或失败原因清楚", "diff 没有无关文件"],
        prompt:
          "请基于当前 build/test 报错，只修复与这次改动直接相关的问题。不要扩大改动范围。修完后说明改了什么、为什么改、如何验证。",
        fixPrompt: "验证仍失败。请先解释失败原因，再给出最小修复方案，不要直接大改。",
      },
      {
        title: "发复盘沉淀经验",
        desc: "把模型名、报错、改动范围和验证结果写成社区复盘，后面的人可以照着避坑。",
        action: "复制复盘提示词，把配置、坑点、diff 和验证结果写清楚。",
        deliverable: "一篇社区复盘：配置、坑点、diff、验证结果、下一步。",
        checklist: ["隐藏 API Key", "写清模型名", "写清验证命令", "写清失败点"],
        validation: ["别人能照着避坑", "没有泄露密钥或公司代码"],
        prompt:
          "请把我的操作过程整理成一篇社区复盘，结构包括：目标、工具组合、配置方式、踩坑、最终改动、验证结果、给新手的提醒。",
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
]

export function getMission(id: string) {
  return missions.find((mission) => mission.id === id)
}
