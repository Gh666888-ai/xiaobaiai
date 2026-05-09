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
  promptRules?: string[]
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
    tagline: "先做出一个能看的 6 页初稿，再学会用验收标准判断它能不能汇报。",
    audience: "适合要做工作汇报、课程作业、方案介绍、产品介绍的人；已经会用 AI 生成 PPT 的用户，重点练“别只一句话生成，要能验收”。",
    outcome: "完成一份可验收的 6 页 PPT 初稿：页面结构、事实边界、演讲备注和可复用提示词。",
    whyNow: "很多人已经能在 AI 工具里一句话生成 PPT，所以小白AI不把“生成”包装成复杂工作流。这里先让新手两步看到结果，再用简单标准判断能不能拿去改稿。",
    minutes: "8-18 分钟",
    stage: "L2 完成任务",
    xp: 65,
    badge: "AI PPT 入门徽章",
    difficulty: "新手",
    toolIds: ["gamma", "canva-ai", "ppt-master", "kimi"],
    tags: ["PPT", "Gamma", "办公", "汇报"],
    materials: ["一个 PPT 主题", "可粘贴的资料或大纲", "听众是谁"],
    steps: [
      {
        title: "打开 PPT 工具，写清楚给谁看",
        desc: "先别研究工具排名。新手打开 Gamma；已经有 WPS AI、Canva、PowerPoint Copilot 或其他 AI PPT 工具的人，直接用自己的。",
        action: "打开你准备使用的 PPT/AI 工具，进入生成或编辑页面；心里先想一句：这份 PPT 要给谁看、想让对方明白什么。",
        deliverable: "一个可生成或编辑 PPT 的工具页面，以及一句明确的汇报目标。",
        toolAction: {
          label: "打开 Gamma",
          href: "https://gamma.app",
          setupText: "没有账号：打开 Gamma，用邮箱或第三方账号登录。",
          readyText: "已经有自己的 AI/PPT 工具：直接进入生成或编辑页面，后续按同一套验收标准检查。",
        },
        clickPath: ["打开 Gamma", "登录账号", "点击 Create new", "选择 Generate / Paste in text"],
        checklist: ["能正常打开工具", "能进入创建或编辑页面", "想清楚听众和汇报目标", "知道备用工具是 Canva / PPT Master / WPS AI"],
        validation: ["页面里有输入主题、粘贴大纲或编辑幻灯片的位置", "你写下了这份 PPT 要给谁看、要达成什么结果"],
        prompt: "这一步不需要复制提示词。先把工具打开，确认可以进入创建演示稿页面；如果你已经有自己的 AI 工具，就写下听众和汇报目标后继续。",
        troubleTips: [
          { problem: "Gamma 打不开或注册不了", fix: "先换 Canva、PPT Master、WPS AI，或者用 Kimi/DeepSeek 生成大纲后手动放进 PPT。" },
          { problem: "不知道选哪个工具", fix: "第一次只选 Gamma。做出初稿比选到完美工具更重要。" },
        ],
      },
      {
        title: "复制小白模板，直接生成 6 页初稿",
        desc: "这一步不要再拆成整理资料、生成、检查、导出四个任务。先把小白模板复制进去，让工具立刻生成 6 页大纲或封面，再按几个标准确认能不能继续改。",
        action: "复制下面的小白模板，粘贴到 PPT 工具或 Kimi/DeepSeek 里；先看到 6 页大纲、封面或初稿，再回来确认。",
        deliverable: "一份能打开的 6 页 PPT 大纲、封面或初稿。",
        toolAction: {
          label: "打开 Gamma 生成",
          href: "https://gamma.app",
          setupText: "如果 Gamma 不顺手，就用 Canva、WPS AI、PPT Master，或者先用 Kimi/DeepSeek 生成 6 页大纲。",
          readyText: "已经有自己的 AI PPT 工具：直接把下面模板粘贴进去生成，不用换工具。",
        },
        clickPath: ["Create new", "Generate", "粘贴小白模板", "选择中文", "点击生成"],
        checklist: ["页数控制在 6 页左右", "先生成初稿，不急着调样式", "资料里没有的数据不要让 AI 乱编"],
        validation: ["已经看到 6 页大纲、封面或初稿", "至少包含标题页、背景、问题、方案、计划、总结", "每页标题和要点能看懂"],
        promptRules: ["一句话任务不够稳，要写清楚主题、听众、页数和输出格式", "资料里没有的数据必须标注“待补数据”，不要让 AI 编造", "先得到初稿，再改标题、数据和视觉"],
        prompt:
          "请帮我生成一份中文 6 页 PPT 初稿。\n\n我的主题：【写你的 PPT 主题】\n给谁看：【写听众，例如老板/客户/老师/同事】\n我想让对方明白：【写一句目标】\n已有资料：【粘贴你的资料；没有资料就写暂无】\n\n要求：\n- 页数：6 页\n- 每页标题要让人一眼看懂\n- 每页 3-5 个要点\n- 每页给出图表/配图建议\n- 每页给出演讲备注\n- 资料里没有的数据写“待补数据”，不要编造\n\n页面结构：\n第1页：封面，写清主题和核心结论\n第2页：背景，为什么现在要讲这个问题\n第3页：现状/问题，列出 3 个关键点\n第4页：方案，给出 3 个可执行建议\n第5页：计划，按时间顺序列下一步\n第6页：总结，给出结论和行动项",
        fixPrompt:
          "这版 PPT 太空泛了。请重写：每页标题更具体，每页最多 3 个核心要点，删除口号，补充例子；没有资料支持的地方标注“待补数据”。",
        troubleTips: [
          { problem: "工具没有直接生成 PPT，只生成了大纲", fix: "也算完成这一步。先确认大纲能看懂，后面再换 Gamma、Canva 或 WPS AI 生成页面。" },
          { problem: "生成结果全是空话", fix: "复制补救提示词，让 AI 删除口号、改成具体场景和行动项。" },
        ],
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
    id: "ai-website-first-page",
    title: "用 AI 做出第一个网站页面",
    shortTitle: "AI 网站首屏",
    tagline: "这不是公司官网项目，也不是工程工作流。先用 AI 生成一个能打开的页面，让新手立刻看到结果。",
    audience: "适合想做个人介绍、门店介绍、产品页、课程页、活动页，但还不会写代码的人。",
    outcome: "得到一个能预览打开的网站首屏：标题、介绍、按钮、服务/卖点和联系入口都在页面上。",
    whyNow: "很多平台一句话就能生成网页，小白AI要做的是让新手知道复制什么需求、怎么看结果能不能用，而不是把一个页面包装成复杂工作流。",
    minutes: "8-15 分钟",
    stage: "L2 完成任务",
    xp: 55,
    badge: "AI 建站首屏徽章",
    difficulty: "新手",
    toolIds: ["lovable", "bolt", "v0", "replit-agent"],
    tags: ["网站", "AI建站", "Lovable", "Bolt", "页面"],
    materials: ["你要做什么网站", "给谁看", "希望页面上出现的联系方式或按钮"],
    steps: [
      {
        title: "打开可生成网页的工具",
        desc: "新手优先用 Lovable、Bolt.new、v0 或 Replit Agent。已经有其他 AI 建站平台也可以直接用。",
        action: "打开一个能用文字生成网页的工具，进入可以输入需求的位置。看到输入框以后回来点确认。",
        deliverable: "一个能输入网站需求的 AI 建站页面。",
        toolAction: {
          label: "打开 Lovable",
          href: "https://lovable.dev",
          setupText: "如果打不开 Lovable，就换 Bolt.new、v0.dev、Replit Agent 或你已经会用的建站 AI。",
          readyText: "只要页面里有输入需求的位置，就可以继续，不用纠结平台是不是最强。",
        },
        clickPath: ["打开 Lovable / Bolt / v0", "登录账号", "找到输入框", "准备粘贴需求"],
        checklist: ["页面能打开", "能看到输入框", "知道这个页面要给谁看"],
        validation: ["工具页面里有输入需求的位置", "你知道要做个人页、产品页、门店页还是活动页"],
        prompt: "这一步不需要复制提示词。先打开一个 AI 建站工具，走到能输入需求的位置。",
        troubleTips: [
          { problem: "Lovable 打不开", fix: "换 Bolt.new、v0.dev 或 Replit Agent。先生成页面比选平台更重要。" },
          { problem: "平台要求英文", fix: "可以直接用中文需求，大多数工具能理解；不行就让 DeepSeek 先帮你翻译成英文。" },
        ],
      },
      {
        title: "复制小白写好的网站需求",
        desc: "不要说“帮我做个网站”这种空话。复制模板，改几个括号里的内容，先让工具生成一个能打开的页面。",
        action: "复制下面的小白网站需求，粘贴到工具里点击生成；看到页面预览后回来确认。",
        deliverable: "一个能打开、能看到首屏内容的网站页面。",
        toolAction: {
          label: "打开 Bolt.new",
          href: "https://bolt.new",
          setupText: "如果你刚才已经打开别的工具，就继续用刚才那个，不必换。",
          readyText: "生成后先点 Preview / 预览，确认页面能打开。",
        },
        clickPath: ["粘贴小白需求", "点击 Generate / Send", "等待生成", "点击 Preview / 预览"],
        checklist: ["页面有标题", "页面有按钮", "页面能预览打开", "内容和你的行业有关"],
        validation: ["你能看到一个完整首屏", "页面里有标题、介绍、按钮和 3 个卖点/服务", "按钮或联系方式位置能看懂"],
        promptRules: ["写清楚行业、用户、页面目的和按钮文案", "先做一个页面，不要一开始要求会员系统、支付、后台", "生成后先看页面能不能打开，再谈改细节"],
        prompt:
          "请帮我生成一个单页网站首屏。\n\n网站类型：【个人介绍 / 门店介绍 / 产品介绍 / 课程介绍 / 活动页，选一个】\n行业或业务：【写你的行业或业务】\n目标用户：【谁会来看这个页面】\n页面目标：【想让用户咨询 / 加微信 / 购买 / 报名 / 了解产品】\n页面风格：【简洁专业 / 科技感 / 温暖亲切 / 高端商务，选一个】\n按钮文案：【例如：立即咨询 / 查看案例 / 预约体验】\n联系方式：【可以先写：微信/电话/邮箱占位】\n\n要求：\n- 先生成一个能打开的单页页面\n- 首屏必须有大标题、简短介绍、主按钮、3 个卖点或服务\n- 不要做登录、支付、会员、后台\n- 文案用中文\n- 页面适配手机和电脑",
        fixPrompt:
          "这个页面太空泛了。请按我的行业重新改：标题更具体，卖点不要写套话，每个卖点都说明用户能得到什么，按钮文案明确一点。",
        troubleTips: [
          { problem: "生成失败或一直转圈", fix: "换 Bolt.new / v0 / Replit Agent，再粘贴同一段需求。" },
          { problem: "页面能打开但很丑", fix: "先算完成。下一步再让 AI 按行业风格改视觉，不要卡在第一版。" },
        ],
      },
    ],
    recapTemplate:
      "我用 AI 做出了第一个网站页面。\n\n使用工具：\n网站类型：\n行业/业务：\n目标用户：\n生成结果：\n哪里能用：\n哪里还要改：\n下次我要怎么写需求：",
    resources: [
      { label: "AI 编程工具推荐", href: "/ai-coding" },
      { label: "Lovable 工具详情", href: "/tools/AI%E7%BC%96%E7%A8%8B/lovable" },
      { label: "发布建站复盘", href: "/community/new" },
    ],
  },
  {
    id: "ai-click-game-first-run",
    title: "用 AI 做一个点击得分小游戏",
    shortTitle: "点击得分小游戏",
    tagline: "先做出能点、能加分、能重新开始的最小游戏。它是结果任务，不是公司级工作流。",
    audience: "适合想体验 AI 做小游戏、互动页面、活动页玩法，但还不会写代码的人。",
    outcome: "得到一个能打开的点击得分小游戏：按钮能点，分数会变，有倒计时或重新开始按钮。",
    whyNow: "小游戏很适合让新手理解 AI 编程的即时反馈：一句模板生成画面，点一下就知道有没有成功。",
    minutes: "8-15 分钟",
    stage: "L2 完成任务",
    xp: 55,
    badge: "AI 小游戏首跑徽章",
    difficulty: "新手",
    toolIds: ["replit-agent", "bolt", "v0", "lovable"],
    tags: ["小游戏", "AI编程", "Replit", "Bolt", "互动"],
    materials: ["浏览器", "一个 AI 编程或建站工具账号"],
    steps: [
      {
        title: "打开能预览网页的工具",
        desc: "新手优先用 Replit Agent 或 Bolt.new，因为它们能直接预览网页。已经会用 v0、Lovable 也可以。",
        action: "打开 Replit Agent、Bolt.new 或其他能生成网页的 AI 工具，进入输入需求的位置。",
        deliverable: "一个能输入小游戏需求、并能预览运行的工具页面。",
        toolAction: {
          label: "打开 Replit Agent",
          href: "https://replit.com/ai",
          setupText: "如果 Replit 不顺手，就换 Bolt.new。关键是生成后能点 Preview 看到游戏画面。",
          readyText: "看到输入框、项目创建按钮或预览入口，就可以继续。",
        },
        clickPath: ["打开 Replit / Bolt", "登录账号", "找到输入框", "准备粘贴需求"],
        checklist: ["工具能打开", "能看到输入框", "生成后可以预览"],
        validation: ["页面里有输入需求的位置", "你能找到 Preview / 预览 / Run 入口"],
        prompt: "这一步不需要复制提示词。先打开一个能生成并预览网页的 AI 工具。",
        troubleTips: [
          { problem: "不知道选哪个", fix: "第一次就用 Bolt.new 或 Replit Agent。目标是看到游戏画面。" },
          { problem: "平台让你创建项目", fix: "项目名随便写 click-game 或 xiaobai-game 即可。" },
        ],
      },
      {
        title: "复制提示词，生成能点的游戏",
        desc: "不要一开始做复杂游戏。先做点击按钮加分，确认按钮真的能点、分数真的会变。",
        action: "复制下面提示词，粘贴到工具里点击生成；看到游戏画面并点一下按钮后回来确认。",
        deliverable: "一个能点击得分、能重新开始的网页小游戏。",
        toolAction: {
          label: "打开 Bolt.new",
          href: "https://bolt.new",
          setupText: "如果你刚才已经打开 Replit，就继续用 Replit，不必换。",
          readyText: "生成后点 Preview / Run，先测试按钮能不能点。",
        },
        clickPath: ["粘贴小白提示词", "点击 Generate / Send", "等待生成", "点击 Preview / Run", "点击游戏按钮"],
        checklist: ["能看到游戏标题", "点击按钮分数会增加", "有重新开始按钮", "手机和电脑都能看"],
        validation: ["游戏画面已经出现", "点击按钮后分数会变化", "重新开始按钮能把分数清零或重新计时"],
        promptRules: ["第一版小游戏只要一个核心动作：点击加分", "先要求 HTML/CSS/JS 单页，方便预览", "生成后先测试按钮，不要先改美术"],
        prompt:
          "请帮我做一个网页小游戏：点击得分。\n\n要求：\n- 做成一个单页网页，可以直接预览运行\n- 页面标题：小白点击挑战\n- 有一个大按钮，用户每点击一次分数 +1\n- 有 30 秒倒计时\n- 倒计时结束后显示最终分数\n- 有“重新开始”按钮，可以清零分数并重新计时\n- 画面要简洁、有科技感，手机和电脑都能正常显示\n- 如果可以，请用 HTML、CSS、JavaScript 写在一个页面里\n\n先保证按钮能点、分数能变、重新开始能用。",
        fixPrompt:
          "现在只修功能，不改复杂样式。请检查点击按钮、分数增加、倒计时、重新开始这 4 个功能，哪里坏了就修哪里。",
        troubleTips: [
          { problem: "只生成代码，没有游戏画面", fix: "点 Preview / Run；如果工具没有预览，就换 Bolt.new 或 Replit Agent 粘贴同一段提示词。" },
          { problem: "按钮点了没反应", fix: "复制补救提示词，让 AI 只修点击加分和重新开始功能。" },
        ],
      },
    ],
    recapTemplate:
      "我用 AI 做了一个点击得分小游戏。\n\n使用工具：\n生成提示词：\n游戏能不能打开：\n按钮能不能点：\n分数和倒计时是否正常：\n哪里还要改：\n下次我要做什么互动：",
    resources: [
      { label: "Replit Agent 工具详情", href: "/tools/AI%E7%BC%96%E7%A8%8B/replit-agent" },
      { label: "Bolt.new 工具详情", href: "/tools/AI%E7%BC%96%E7%A8%8B/bolt" },
      { label: "发布小游戏复盘", href: "/community/new" },
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
    id: "agent-skill-first-install",
    title: "给你的 AI Agent 找到第一个 Skill",
    shortTitle: "Agent Skill 入门",
    tagline: "不是收藏一堆 Skill 网站，而是从一个真实能力出发，学会搜索、筛选、安全判断和小样例验证。",
    audience: "适合已经知道 AI 能聊天、想让 AI 多做一件事的人；比如读网页、读 PDF、查资料、操作浏览器、整理表格或辅助写代码。",
    outcome: "完成一份 Skill 选择卡：目标能力、候选 Skill、来源网站、安全检查、是否安装/收藏、一次最小验证结果和复盘。",
    whyNow: "Skill 是给 Agent 加能力的插件/能力包。很多新手看到 Skill 市场会只收藏网站，却不知道怎么判断能不能用、安不安全、是不是适合自己的 Agent。这个任务把“找 Skill”变成可检查的操作流程。",
    minutes: "30-50 分钟",
    stage: "L3 给 AI 加能力",
    xp: 70,
    badge: "Skill 入门徽章",
    difficulty: "进阶",
    toolIds: ["qclaw", "openclaw", "aionui"],
    tags: ["Skill", "Agent", "OpenClaw", "插件", "安全检查"],
    materials: ["一个你想让 AI 多出来的能力", "一个 Agent 或准备使用的 Agent", "能打开的 Skill 市场网站", "一个最小测试样例"],
    steps: [
      {
        title: "先写清楚你想让 AI 多会什么",
        desc: "不要从网站开始逛。先写目标能力：读网页、总结视频、读 PDF、浏览器操作、查资料、处理表格、代码审查，只选一个。",
        action: "写一句话：我想让 AI 帮我完成什么动作、输入是什么、输出要长什么样。",
        deliverable: "一句明确的 Skill 搜索目标。",
        checklist: ["只选一个能力", "写清输入材料", "写清输出结果", "不要把模型、Agent 和 Skill 混在一起"],
        validation: ["能说清 Agent 是执行者，Skill 是给 Agent 加的能力", "目标不是“找好用 Skill”，而是一个具体动作"],
        prompt:
          "请帮我把下面的想法整理成一个 Skill 搜索目标。\n\n我的想法：\n【例如：我想让 AI 能总结网页 / 读 PDF / 帮我做小红书运营 / 查资料】\n\n请输出：\n1. 我真正需要的能力\n2. 输入材料是什么\n3. 输出结果是什么\n4. 应该搜索的 3 个关键词\n5. 不适合搜索的模糊词",
        fixPrompt: "这个目标太泛了。请压缩成一个 30 分钟内能验证的小动作，只保留一个输入和一个输出。",
      },
      {
        title: "去 3 类 Skill 网站找候选项",
        desc: "小白优先看中文精选和官方市场，不要一上来进大市场乱装。先找 2-3 个候选 Skill。",
        action: "按顺序打开 SkillHub / 虾评Skill / ClawHub 或 SkillsMP，搜索上一步关键词，记录 2-3 个候选。",
        deliverable: "2-3 个候选 Skill 名称、链接和一句用途说明。",
        toolAction: {
          label: "打开虾评Skill",
          href: "https://xiaping.coze.com/",
          setupText: "中文用户先看精选评测站，能减少搜索成本。",
          readyText: "如果你已经知道 Skill 名称，再去 ClawHub 或 SkillsMP 查原始来源和安装说明。",
        },
        clickPath: ["打开 SkillHub / 虾评Skill / ClawHub", "输入关键词", "看简介和适用 Agent", "复制候选链接", "不要立刻安装"],
        checklist: ["至少记录 2 个候选", "看清支持 OpenClaw / Claude Code / Codex / 其他 Agent", "看清是否需要 API Key", "看清是否有使用示例"],
        validation: ["候选 Skill 能对应你的目标能力", "不是只因为下载量高就选", "来源网站和作者信息能找到"],
        prompt:
          "请帮我对比这些候选 Skill。\n\n我的目标能力：\n【粘贴上一步目标】\n\n候选 Skill：\n1. 名称/链接/简介：\n2. 名称/链接/简介：\n3. 名称/链接/简介：\n\n请按表格输出：适合程度、支持的 Agent、需要的权限、是否需要 API Key、最大风险、推荐顺序。",
      },
      {
        title: "做安全检查，不急着安装",
        desc: "Skill 可能会操作文件、浏览器、账号和网络。小白第一次只做安全筛选，危险权限先收藏不安装。",
        action: "检查作者、更新时间、安装说明、权限范围、是否要求你运行奇怪命令、是否要账号密码或密钥。",
        deliverable: "一张安全检查表：可试用 / 只收藏 / 暂不碰。",
        checklist: ["不安装来源不明的 Skill", "不运行看不懂的脚本", "不把账号密码交给 Skill", "不让 Skill 直接碰钱包、支付、SSH、浏览器密码"],
        validation: ["能说出这个 Skill 需要哪些权限", "能判断是否只在测试环境里试", "知道敏感账号和密钥不能直接给"],
        prompt:
          "请帮我做 Skill 安全检查。\n\nSkill 名称/链接：\n【粘贴】\n\n安装说明或 README 摘要：\n【粘贴】\n\n请判断：\n1. 它会访问哪些文件、账号、网络或浏览器权限\n2. 有没有要求运行陌生命令\n3. 有没有 API Key 或登录风险\n4. 新手是否适合直接安装\n5. 建议：可试用 / 只收藏 / 暂不碰",
        fixPrompt: "请用更保守的标准重新判断。如果涉及钱包、浏览器密码、SSH、支付、客户数据或自动发布，对新手一律标为暂不碰。",
        troubleTips: [
          { problem: "安装说明全英文看不懂", fix: "先复制 README 给 Kimi/DeepSeek 翻译，让它解释权限和风险，不要直接复制命令。" },
          { problem: "Skill 要求填 API Key", fix: "先确认是不是官方服务商，测试时使用低权限 Key，不要用主账号密钥。" },
        ],
      },
      {
        title: "用最小样例验证它有没有用",
        desc: "第一次不追求完整安装。如果已经有安全环境，可以安装测试；没有就先用文档和示例做模拟验证。",
        action: "准备一个无敏感信息的小样例，比如一个公开网页、一段测试 PDF 文本或一份假数据，让 Skill 或 Agent 跑一次。",
        deliverable: "一次最小验证记录：输入、输出、是否达到目标、失败原因。",
        checklist: ["样例不含隐私", "只验证一个动作", "输出能人工检查", "失败时记录卡在哪一步"],
        validation: ["有一条真实输入", "有一条输出结果或失败截图描述", "知道这个 Skill 下次是否值得继续"],
        prompt:
          "请帮我设计一个最小验证样例，用来测试这个 Skill 是否真的有用。\n\n我的目标能力：\n【粘贴】\nSkill 名称：\n【粘贴】\n\n要求：\n- 不使用隐私资料\n- 10 分钟内能测试\n- 输出结果能人工判断好坏\n- 给出通过/失败标准",
        fixPrompt: "这个验证太复杂。请缩小到一个公开网页、一段测试文本或一份假数据，保证 10 分钟内能完成。",
      },
      {
        title: "整理成自己的 Skill 选择卡",
        desc: "最后不要只留下链接。把目标、候选、风险、验证结果和下次动作写成复盘，后面才能复用。",
        action: "复制复盘模板，把这次找 Skill 的过程写清楚；如果没安装成功，也算完成，因为你学会了筛选和避坑。",
        deliverable: "一张 Skill 选择卡和一条复盘。",
        checklist: ["写清目标能力", "写清候选 Skill", "写清为什么选/不选", "写清安全风险", "写清验证结果"],
        validation: ["下次换一个 Skill 也能照着筛选", "别人看复盘能知道该不该用这个 Skill"],
        prompt:
          "请把我这次找 Skill 的过程整理成一张选择卡。\n\n结构：\n目标能力：\n候选 Skill：\n最终选择：\n来源网站：\n支持的 Agent：\n需要的权限：\n安全判断：\n最小验证输入：\n最小验证结果：\n下次继续做什么：",
      },
    ],
    recapTemplate:
      "我给 AI Agent 找了一个 Skill。\n\n目标能力：\n候选 Skill：\n来源网站：\n支持的 Agent：\n为什么选它：\n安全检查：\n是否安装/收藏：\n最小验证样例：\n结果：\n下次还想找什么能力：",
    resources: [
      { label: "虾评Skill 精选评测", href: "https://xiaping.coze.com/" },
      { label: "ClawHub 官方说明", href: "https://docs.openclaw.ai/tools/clawhub" },
      { label: "SkillsMP 市场说明", href: "https://skillsmp.com/about" },
      { label: "OpenClaw 工具详情", href: "/tools/Agent%E5%B9%B3%E5%8F%B0/openclaw" },
    ],
  },
  {
    id: "ai-comic-video-first-episode",
    title: "用 AI 做一集 60 秒漫剧样片",
    shortTitle: "AI 漫剧样片",
    tagline: "从题材、短剧本、角色设定、分镜、配音和剪辑清单开始，先做一集能检查的 60 秒样片方案。",
    audience: "适合想做动漫、漫剧、短视频剧情号、IP 内容或课程演示的人；第一次不追求全自动成片，先跑通样片流程。",
    outcome: "完成一集 60 秒漫剧样片方案：题材定位、8 镜头分镜、角色提示词、场景提示词、配音台词、剪辑检查表。",
    whyNow: "AI 漫剧制作很容易被讲成一键全自动，但真正能落地的是先把剧本、分镜、角色一致性和人工检查跑通。第一集只做 60 秒，能检查、能复用、能继续扩展。",
    minutes: "45-80 分钟",
    stage: "L4 内容自动化",
    xp: 75,
    badge: "AI 漫剧入门徽章",
    difficulty: "进阶",
    toolIds: ["kimi", "jimeng", "suno"],
    tags: ["AI漫剧", "动漫", "分镜", "即梦", "配音"],
    materials: ["一个题材", "一个主角设定", "60 秒剧情目标", "画风参考"],
    steps: [
      {
        title: "先打开 AI 漫剧要用的工具",
        desc: "第一步只做工具准备。不要先写剧本，也不要先研究一堆教程。先把能生成文字、画面和声音的工具打开。",
        action: "先打开 Kimi 或 DeepSeek，再打开即梦，最后准备 Suno 或剪映的配音/音乐入口。打开后回来点确认。",
        deliverable: "你已经打开了至少一个写剧情工具和一个画面生成工具。",
        toolAction: {
          label: "打开 Kimi",
          href: "https://kimi.moonshot.cn",
          setupText: "没有 Kimi：可以用 DeepSeek、豆包、通义千问。只要能复制提示词并生成文字就行。",
          readyText: "已经打开过工具：不用重复准备，直接点确认进入下一步。",
        },
        clickPath: ["打开 Kimi/DeepSeek", "打开即梦", "能看到输入框", "回来点确认"],
        checklist: ["文字工具已打开", "即梦或其他绘图工具已打开", "知道后面要复制模板进去生成"],
        validation: ["能进入 AI 对话输入框", "能进入即梦或备用绘图工具"],
        prompt: "这一步不需要复制提示词。先把工具打开，确认能输入文字和生成画面即可。",
        troubleTips: [
          { problem: "即梦打不开", fix: "先用豆包图片、通义万相、可灵或其他绘图工具替代。学习任务重点是跑通流程，不是绑定某一个工具。" },
          { problem: "Suno 不会用", fix: "这一步先不用管 Suno。后面只需要先生成配音台词和音乐需求，真正成片任务再要求音频结果。" },
        ],
      },
      {
        title: "用小白模板生成 60 秒剧情",
        desc: "现在才开始写。先用小白写好的通用模板生成一段短剧情，不要一上来做 12 分钟长剧。",
        action: "复制小白写好的通用提示词，粘贴到 Kimi 或 DeepSeek，点击生成。",
        deliverable: "一段 150 字以内的 60 秒剧情梗概。",
        checklist: ["已经复制模板", "已经点击生成", "剧情不是长篇世界观"],
        validation: ["梗概能在 60 秒内讲完", "包含主角、目标、冲突和结尾"],
        prompt:
          "【小白写好的 AI 漫剧通用提示词】\n\n请把我的想法改成一集 60 秒 AI 漫剧剧情。\n\n题材：\n【写题材，比如逆袭、古风、校园、职场、萌宠】\n\n主角：\n【写一个主角，不要写一群人】\n\n目标观众：\n【写给谁看，比如宝妈、学生、打工人、二次元用户】\n\n要求：\n1. 150 字以内\n2. 只有一个主角\n3. 只有一个核心冲突\n4. 必须有结尾或反转\n5. 适合拆成 8 个镜头\n6. 不要写成长篇世界观\n\n请输出：\n- 剧情标题\n- 60 秒剧情梗概\n- 主角目标\n- 核心冲突\n- 结尾/反转",
        promptRules: [
          "主角越少越好，第一次只写一个主角。",
          "剧情越短越好，60 秒只需要一个冲突。",
          "不要写世界观大设定，先写能拍出来的一小段。",
          "提示词里要写清楚观众是谁，否则 AI 会写得很泛。",
        ],
        fixPrompt: "这个剧情太大了。请压缩成 60 秒短视频，只保留一个场景、一个冲突和一个结尾。",
      },
      {
        title: "拆成 8 个分镜",
        desc: "漫剧能不能做出来，关键不是文案，而是每个镜头画什么、谁说什么、停留几秒。",
        action: "把剧情拆成 8 个镜头，每个镜头包含画面、人物动作、台词、时长。",
        deliverable: "一张 8 镜头分镜表。",
        checklist: ["每个镜头只有一个动作", "每个镜头有时长", "台词不超过两句", "能看出起承转合"],
        validation: ["分镜表有 8 行", "每行有画面、动作、台词、时长"],
        prompt:
          "【小白写好的 AI 漫剧分镜模板】\n\n请把下面 60 秒剧情拆成 8 个漫剧分镜。\n\n输出表格字段：\n镜头编号、时长、画面、人物动作、台词/旁白、画面生成提示词。\n\n要求：\n1. 每个镜头只发生一个动作\n2. 每个镜头 5-8 秒\n3. 台词不要超过两句\n4. 画面描述要具体到人物、动作、场景、镜头距离\n5. 画面生成提示词要能直接复制到即梦\n\n剧情：\n【粘贴上一步生成的剧情】",
        promptRules: [
          "分镜不是剧情大纲，要写清楚每一秒画面里看见什么。",
          "每个镜头只保留一个动作，避免 AI 画面混乱。",
          "提示词要包含人物、场景、动作、风格、镜头距离。",
        ],
        fixPrompt: "这些分镜太像文字大纲。请改成镜头语言：每行只描述一个画面和一个动作。",
      },
      {
        title: "锁定角色和场景提示词",
        desc: "AI 漫剧最容易翻车的是角色不一致。先写角色固定描述和场景固定描述。",
        action: "为主角写固定外貌、服装、表情风格和画风提示词；再写 2 个场景提示词。",
        deliverable: "角色一致性提示词和 2 个场景提示词。",
        checklist: ["角色外貌固定", "服装固定", "画风固定", "场景不超过 2 个"],
        validation: ["提示词能复用到每个镜头", "没有每一镜都换角色外貌"],
        prompt:
          "【小白写好的角色一致性提示词模板】\n\n请帮我写 AI 漫剧角色一致性提示词。\n\n主角设定：\n【粘贴主角设定】\n\n画风：\n【例如国风漫画 / 校园漫画 / 赛博朋克 / 治愈系动画】\n\n输出：\n1. 主角固定提示词\n2. 负面提示词\n3. 场景 A 提示词\n4. 场景 B 提示词\n5. 每个镜头都要保留的关键词\n\n要求：\n- 主角外貌、发型、服装、年龄感要固定\n- 场景不要超过 2 个\n- 不要每一镜都换衣服或换脸\n- 画风关键词要重复使用",
        promptRules: [
          "角色一致性的核心是固定外貌、服装、发型和画风。",
          "场景越少越稳定，第一次只用 1-2 个场景。",
          "每个镜头都要重复主角固定关键词。",
          "负面提示词用于减少多手指、脸崩、服装变化、风格漂移。",
        ],
      },
      {
        title: "生成台词、配音和剪辑清单",
        desc: "引导任务先不要求你交成片。先把台词、旁白、音效和剪辑节奏写清楚，后面高阶成片任务再验证视频结果。",
        action: "复制模板，让 AI 把 8 个分镜整理成台词、字幕、音效和剪辑清单。",
        deliverable: "一份配音台词表、字幕表、音效建议和剪辑清单。",
        checklist: ["台词口语化", "每个镜头有字幕", "有音效或背景音乐建议", "有剪辑节奏"],
        validation: ["台词能直接拿去配音", "剪辑清单能交给剪映继续做"],
        prompt:
          "【小白写好的配音剪辑模板】\n\n请根据 8 镜头分镜，生成配音和剪辑清单。\n\n输出字段：\n镜头编号、旁白/台词、字幕、音效、背景音乐建议、剪辑备注。\n\n要求：\n1. 台词口语化，像短视频能直接念出来\n2. 每个镜头字幕不超过 18 个字\n3. 音效要简单，例如脚步声、转场声、风声、心跳声\n4. 背景音乐只写风格，不要写具体侵权歌曲\n5. 剪辑备注要写清楚停留几秒、是否转场、是否推近镜头\n\n分镜：\n【粘贴上一步的 8 镜头分镜表】",
        promptRules: [
          "台词要短，字幕要短，短视频用户没有耐心看长句。",
          "音乐只写风格，不要写具体版权歌曲。",
          "剪辑备注要服务画面节奏，不要写一堆玄学形容词。",
        ],
        fixPrompt: "这份清单太像文字说明。请改成剪映能照着做的执行清单：每个镜头写时长、字幕、音效、转场和画面动作。",
      },
      {
        title: "整理样片资料和下一步",
        desc: "最后只整理资料，不上传证明。以后如果用户单独接取高阶成片任务，再要求截图或成片验证。",
        action: "复制复盘模板，整理题材、剧情、分镜、角色提示词、剪辑清单和下一步。",
        deliverable: "一篇 AI 漫剧样片复盘。",
        checklist: ["有剧情梗概", "有 8 镜头分镜", "有角色提示词", "有剪辑清单", "有失败点"],
        validation: ["别人能照着你的复盘做出同类样片", "你知道下一集要优化什么"],
        prompt:
          "【小白写好的 AI 漫剧复盘模板】\n\n请把我的 AI 漫剧样片资料整理成复盘。\n\n结构：\n题材：\n目标观众：\n剧情梗概：\n8 镜头分镜：\n角色固定提示词：\n场景提示词：\n配音/剪辑清单：\n最容易翻车的点：\n下一集怎么优化：\n如果要做成真正成片，下一步需要准备什么：",
        promptRules: [
          "复盘不是证明材料，是给下次复用的流程资产。",
          "要记录最容易翻车的点，例如角色不一致、镜头太复杂、台词太长。",
          "高阶成片任务才需要截图、成片链接或人工审核。",
        ],
      },
    ],
    recapTemplate:
      "我用 AI 做了一集 60 秒漫剧样片方案。\n\n题材：\n目标观众：\n剧情梗概：\n8 镜头分镜：\n角色固定提示词：\n场景提示词：\n配音/剪辑清单：\n最容易翻车的点：\n下一集计划：",
    resources: [
      { label: "即梦提示词教程", href: "/jimeng-prompts" },
      { label: "AI 视频工具推荐", href: "/ai-video-tools" },
      { label: "发布样片复盘", href: "/community/new" },
    ],
  },
  {
    id: "ai-webnovel-first-chapter",
    title: "用 AI 做一章网文/故事样章",
    shortTitle: "AI 网文样章",
    tagline: "从世界观、人物小传、章节大纲到 1500 字样章和审稿清单，先做一章能继续写的故事。",
    audience: "适合想写网文、短篇故事、剧情脚本、游戏设定或 IP 世界观的人。第一次不追求日更万字，先做一章可审稿样章。",
    outcome: "完成一章 1500 字样章：世界观简表、主角小传、章节目标、正文初稿、AI 审稿意见和改稿计划。",
    whyNow: "AI 写作最容易变成套路文。真正可落地的流程是你定核心创意，AI 辅助大纲和初稿，再用审稿清单检查人物、节奏和伏笔。",
    minutes: "45-75 分钟",
    stage: "L4 内容创作",
    xp: 70,
    badge: "AI 故事创作徽章",
    difficulty: "进阶",
    toolIds: ["kimi", "deepseek"],
    tags: ["AI写作", "网文", "故事", "剧本", "审稿"],
    materials: ["一个题材", "主角设定", "故事风格", "本章想达成的剧情目标"],
    steps: [
      {
        title: "定题材和主角，不让 AI 乱编",
        desc: "先写清你自己的核心创意，AI 只负责补结构，不替你决定风格。",
        action: "整理题材、主角、目标读者、故事爽点和禁忌套路。",
        deliverable: "一张故事设定卡。",
        checklist: ["题材明确", "主角有目标", "知道读者是谁", "写清不想要的套路"],
        validation: ["设定卡不超过 300 字", "主角目标和冲突能看懂"],
        prompt:
          "请帮我整理一张故事设定卡。\n\n题材：\n主角：\n目标读者：\n我想要的爽点/情绪：\n不想要的套路：\n\n要求：输出世界观、主角目标、核心冲突、第一章目标。",
      },
      {
        title: "生成第一章大纲",
        desc: "第一章只做一件事：让读者知道主角是谁、遇到什么问题、为什么要继续看。",
        action: "让 AI 生成第一章 5 段式大纲，每段有剧情功能。",
        deliverable: "第一章 5 段式大纲。",
        checklist: ["开头有钩子", "中段有冲突", "结尾有悬念", "不是设定说明书"],
        validation: ["大纲包含开头、推进、冲突、转折、结尾悬念"],
        prompt:
          "请根据故事设定卡，写第一章 5 段式大纲。\n\n要求：\n1. 开头 300 字内有钩子\n2. 每段说明剧情功能\n3. 不要大段解释世界观\n4. 结尾留下一个悬念\n\n设定卡：\n【粘贴】",
        fixPrompt: "这个大纲太像设定说明。请改成事件推进，每段都必须发生一个动作或冲突。",
      },
      {
        title: "写 1500 字样章",
        desc: "先写一章短样，不要一口气写十章。样章能检查风格和节奏。",
        action: "让 AI 按大纲写 1500 字正文，要求口语、动作、对话和节奏。",
        deliverable: "一章 1200-1800 字正文初稿。",
        checklist: ["有对话", "有动作", "少解释设定", "结尾有继续看的理由"],
        validation: ["正文超过 1000 字", "读者能看懂主角遇到的问题"],
        prompt:
          "请根据下面大纲写第一章正文，约 1500 字。\n\n要求：\n- 少解释，多用动作和对话推进\n- 开头 300 字内给出钩子\n- 不要写成总结\n- 结尾留下悬念\n\n大纲：\n【粘贴】",
      },
      {
        title: "用 AI 审稿，不只润色",
        desc: "审稿要看人物是否立住、节奏是否拖、有没有套路和前后矛盾。",
        action: "让 AI 按审稿清单检查样章，并输出改稿建议。",
        deliverable: "一份审稿意见和改稿清单。",
        checklist: ["检查人物目标", "检查节奏", "检查套路", "检查结尾悬念"],
        validation: ["审稿意见不是只说好", "至少有 3 条可执行修改建议"],
        prompt:
          "请作为网文编辑审稿这章样章。\n\n请输出：\n1. 最大问题\n2. 主角是否立住\n3. 节奏哪里拖\n4. 哪些句子套路化\n5. 结尾是否有继续看的动力\n6. 3 条具体改稿建议\n\n正文：\n【粘贴】",
      },
      {
        title: "整理创作复盘",
        desc: "保存设定、提示词、样章和审稿意见，下次才能继续写第二章。",
        action: "复制复盘模板，整理这次创作流程。",
        deliverable: "一篇 AI 写作样章复盘。",
        checklist: ["有设定卡", "有大纲", "有样章", "有审稿意见", "有下一章方向"],
        validation: ["下次能继续写第二章", "别人能看懂你的创作流程"],
        prompt:
          "请把这次 AI 写作流程整理成复盘。\n\n结构：\n题材：\n主角：\n第一章目标：\n最有用的提示词：\n样章哪里能用：\n审稿发现的问题：\n下一章要写什么：",
      },
    ],
    recapTemplate:
      "我用 AI 做了一章故事样章。\n\n题材：\n主角：\n第一章目标：\n大纲：\n样章结果：\n审稿意见：\n最有用的提示词：\n下一章方向：",
    resources: [
      { label: "AI 写作工具推荐", href: "/ai-writing-tools" },
      { label: "Kimi 工具详情", href: "/tools/%E5%AF%B9%E8%AF%9DAI/kimi" },
      { label: "发布写作复盘", href: "/community/new" },
    ],
  },
  {
    id: "local-model-first-run",
    title: "在本地跑通第一个 AI 模型",
    shortTitle: "本地模型首跑",
    tagline: "不先研究一堆参数，先用 Ollama 或 LM Studio 跑通一个小模型，留下能复现的安装、测试和适用场景记录。",
    audience: "适合担心隐私、想省 API 费用、想理解本地部署但害怕命令行的新手。",
    outcome: "完成一次本地模型首跑：选择工具、下载模型、完成中文问答、记录电脑配置、判断适合做什么任务。",
    whyNow: "学习资料里的本地部署如果只停在概念，新手会不知道自己电脑到底能不能跑。这个任务把它压成一次可检查的首跑：能打开、能问答、知道速度和局限。",
    minutes: "35-70 分钟",
    stage: "L4 模型与本地部署",
    xp: 70,
    badge: "本地模型首跑徽章",
    difficulty: "进阶",
    toolIds: ["ollama", "lm-studio"],
    tags: ["本地部署", "Ollama", "LM Studio", "模型", "隐私"],
    materials: ["一台 Windows/Mac 电脑", "至少 8GB 内存", "5GB 以上可用磁盘空间", "一个想测试的中文问题"],
    steps: [
      {
        title: "选择首跑工具，不纠结模型榜单",
        desc: "会命令行就选 Ollama，不想碰命令行就选 LM Studio。第一天只求跑通，不追求最强模型。",
        action: "根据自己的习惯选择 Ollama 或 LM Studio，并写下为什么选它。",
        deliverable: "一个工具选择记录：Ollama 或 LM Studio，以及选择原因。",
        checklist: ["知道自己选哪个工具", "知道是否需要命令行", "确认磁盘空间够用"],
        validation: ["已经打开官网下载页或安装页", "能说清楚为什么选这个工具"],
        prompt:
          "请根据我的电脑情况，帮我选择本地跑模型的工具。\n\n我的电脑：\n内存：\n显卡：\n是否愿意用命令行：\n主要用途：\n\n请只在 Ollama 和 LM Studio 中选一个，并说明第一天应该跑哪个小模型。",
        fixPrompt: "不要给我一堆高级方案。请只给一个最稳的新手首跑选择，并说明下一步点哪里或输入什么。",
      },
      {
        title: "安装并下载一个小模型",
        desc: "先用小模型验证流程，别一开始下载几十 GB 的大模型。",
        action: "安装工具，并下载 Qwen 7B/8B 级别或工具推荐的小模型。",
        deliverable: "模型已下载完成，工具里能看到模型名称。",
        checklist: ["安装完成", "模型开始下载", "模型下载完成", "知道模型文件比较大"],
        validation: ["工具里能看到已下载模型", "没有下载到一半就退出"],
        prompt:
          "我正在安装本地 AI 模型工具。请帮我检查下一步是否正确。\n\n工具：Ollama / LM Studio\n当前界面或命令输出：\n【粘贴】\n\n请告诉我：现在是不是已经安装成功，下一步该下载哪个小模型。",
      },
      {
        title: "完成第一次中文问答",
        desc: "首跑成功的标准很简单：模型能回答中文问题，并且你能感受到速度。",
        action: "向本地模型提一个中文问题，再让它总结一段你自己的文字。",
        deliverable: "一段本地模型中文回答和速度体感记录。",
        checklist: ["模型能回复中文", "回答不是乱码", "记录了大概速度", "保存了一句回答"],
        validation: ["有一段模型回答", "能判断速度是否能接受"],
        prompt:
          "请用中文回答：你现在是运行在我本地电脑上的模型。请用 5 句话说明本地模型适合做什么、不适合做什么。",
      },
      {
        title: "判断适用场景和边界",
        desc: "本地模型不一定比云端强，但它适合隐私资料、离线草稿和高频低风险任务。",
        action: "把测试结果整理成适用/不适用清单。",
        deliverable: "一份本地模型适用场景清单。",
        checklist: ["写出 3 个适合场景", "写出 3 个不适合场景", "知道什么时候切云端 API"],
        validation: ["清单结合了自己的电脑速度", "没有把本地模型神化成万能方案"],
        prompt:
          "请根据我的本地模型测试结果，整理适用边界。\n\n模型名称：\n速度体感：\n回答质量：\n我主要想做的事：\n\n输出：适合做的 3 件事、不适合做的 3 件事、什么时候应该换云端模型。",
      },
      {
        title: "整理本地部署复盘",
        desc: "留下安装路径、模型名、首跑问题和失败点，下次换电脑或帮别人装才不会重来。",
        action: "复制复盘模板，记录首跑过程。",
        deliverable: "一篇本地模型首跑复盘。",
        checklist: ["有工具名称", "有模型名称", "有首跑问题", "有速度体感", "有踩坑记录"],
        validation: ["别人能照着复盘跑通同类流程", "你知道下一步是换模型还是接 UI"],
        prompt:
          "请把我的本地模型首跑过程整理成复盘。\n\n结构：\n电脑配置：\n使用工具：\n模型名称：\n安装是否顺利：\n第一次测试问题：\n回答效果：\n速度体感：\n踩坑：\n适合继续做什么：",
      },
    ],
    recapTemplate:
      "我在本地跑通了第一个 AI 模型。\n\n电脑配置：\n使用工具：\n模型名称：\n安装过程：\n第一次测试问题：\n回答效果：\n速度体感：\n适合场景：\n不适合场景：\n下一步：",
    resources: [
      { label: "Ollama 工具详情", href: "/tools/%E6%A8%A1%E5%9E%8B%E5%B9%B3%E5%8F%B0/ollama" },
      { label: "LM Studio 工具详情", href: "/tools/%E5%AF%B9%E8%AF%9DAI/lm-studio" },
      { label: "发布本地部署复盘", href: "/community/new" },
    ],
  },
  {
    id: "industry-skill-stack-plan",
    title: "给一个行业场景配 3 个 AI Skill",
    shortTitle: "行业 Skill 配置",
    tagline: "把教程里的行业技能清单变成自己的行动方案：选一个行业，配 3 个必装 Skill，写清安装顺序、安全检查和验证任务。",
    audience: "适合已经听过 Agent/Skill，但不知道自己行业到底该装什么、先测什么的人。",
    outcome: "完成一份行业 Skill 配置方案：行业场景、目标流程、3 个 Skill、安装顺序、安全检查、最小验证任务。",
    whyNow: "很多 Skill 清单看起来很热闹，但新手真正需要的是先选 3 个能解决自己问题的能力，并且知道怎么验证它没有乱跑、没有泄露数据。",
    minutes: "30-55 分钟",
    stage: "L5 Agent 技能实战",
    xp: 65,
    badge: "行业 Skill 规划徽章",
    difficulty: "进阶",
    toolIds: ["openclaw", "qclaw", "dify", "n8n"],
    tags: ["Skill", "Agent", "行业方案", "自动化", "安全检查"],
    materials: ["一个行业或岗位", "一个重复性工作", "一个希望自动化的结果", "可公开测试的样例数据"],
    steps: [
      {
        title: "选一个真实行业场景",
        desc: "不要说提高效率，直接说每天重复做什么、结果要发给谁、错了会怎样。",
        action: "写下行业、岗位、重复任务、目标结果和风险等级。",
        deliverable: "一张行业场景卡。",
        checklist: ["行业明确", "重复任务明确", "结果明确", "风险等级明确"],
        validation: ["场景不是泛泛的 AI 提效", "知道出错后果是否严重"],
        prompt:
          "请帮我把行业需求整理成一张场景卡。\n\n行业/岗位：\n每天重复做的事：\n希望 AI 帮我交付的结果：\n出错后果：低/中/高\n可用于测试的公开样例：\n\n请输出：目标流程、适合全自动还是半自动、第一周只测什么。",
      },
      {
        title: "从清单里只选 3 个 Skill",
        desc: "Skill 不是越多越好。先选搜索/读取、整理/分析、发送/输出这 3 类中的最小组合。",
        action: "为场景选择 3 个 Skill，并写清每个 Skill 负责哪一步。",
        deliverable: "3 个 Skill 的候选清单和职责说明。",
        checklist: ["最多 3 个 Skill", "每个 Skill 有职责", "包含输入和输出", "没有一口气全装"],
        validation: ["3 个 Skill 能串成一个小流程", "没有选择与场景无关的能力"],
        prompt:
          "请根据我的场景，只选择 3 个 AI Skill。\n\n场景卡：\n【粘贴】\n\n要求：\n- 最多 3 个\n- 说明每个 Skill 负责输入、处理还是输出\n- 给出安装顺序\n- 说明为什么暂时不装其他 Skill",
        fixPrompt: "你给太多了。请缩减到 3 个以内，并优先选择能跑通第一周验证的能力。",
      },
      {
        title: "做安全检查和权限边界",
        desc: "任何会读文件、发消息、操作网页的 Skill 都要先看权限。测试时用公开样例，不用真实客户数据。",
        action: "列出每个 Skill 需要的权限、敏感风险和测试边界。",
        deliverable: "一份 Skill 安全检查表。",
        checklist: ["知道会读什么数据", "知道会写到哪里", "测试数据已脱敏", "高风险动作需要人工确认"],
        validation: ["没有把客户隐私直接交给未知 Skill", "明确哪些动作必须人工确认"],
        prompt:
          "请帮我检查这 3 个 Skill 的安全边界。\n\nSkill 清单：\n【粘贴】\n\n输出表格：Skill、需要权限、可能风险、测试时禁止做什么、必须人工确认的动作。",
      },
      {
        title: "设计最小验证任务",
        desc: "不要马上上生产。先用 1 条公开样例跑一次，验证输入、处理和输出是否连得上。",
        action: "为这 3 个 Skill 写一个 10 分钟内能完成的验证任务。",
        deliverable: "一个最小验证任务和通过标准。",
        checklist: ["只用一条样例", "10 分钟内能跑", "有通过标准", "有失败处理"],
        validation: ["验证任务能证明 Skill 有用", "失败时知道该删哪个 Skill 或换哪个步骤"],
        prompt:
          "请为这 3 个 Skill 设计一个最小验证任务。\n\n要求：\n- 10 分钟内完成\n- 使用公开/脱敏样例\n- 有输入、执行、输出、通过标准\n- 失败时给出排查顺序\n\nSkill 清单：\n【粘贴】",
      },
      {
        title: "整理行业 Skill 复盘",
        desc: "最后把方案发成复盘，让别人知道这个行业先装什么、别碰什么、怎么测。",
        action: "复制复盘模板，记录行业、Skill、权限和验证结果。",
        deliverable: "一篇行业 Skill 配置复盘。",
        checklist: ["有行业场景", "有 3 个 Skill", "有权限边界", "有验证任务", "有下一步"],
        validation: ["别人能照着你这套方案试一次", "知道是否继续安装更多 Skill"],
        prompt:
          "请把我的行业 Skill 配置整理成复盘。\n\n结构：\n行业/岗位：\n要解决的重复任务：\n选择的 3 个 Skill：\n安装顺序：\n权限和安全边界：\n最小验证任务：\n结果：\n下一步是否继续扩展：",
      },
    ],
    recapTemplate:
      "我给一个行业场景配了 3 个 AI Skill。\n\n行业/岗位：\n重复任务：\n目标结果：\n选择的 Skill：\n安装顺序：\n权限边界：\n最小验证任务：\n验证结果：\n下一步：",
    resources: [
      { label: "Skill 入门任务", href: "/missions/agent-skill-first-install" },
      { label: "OpenClaw 工具详情", href: "/tools/Agent%E5%B9%B3%E5%8F%B0/openclaw" },
      { label: "发布 Skill 复盘", href: "/community/new" },
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
