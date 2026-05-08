export type RecommendationPage = {
  slug: string
  title: string
  description: string
  audience: string
  firstStep: string
  tools: {
    id: string
    reason: string
    role: string
  }[]
  checklist: string[]
  missionHref: string
  casePrompt: string
}

export const recommendationPages: RecommendationPage[] = [
  {
    slug: "ai-ppt-tools-for-beginners",
    title: "新手做 PPT 该用哪些 AI 工具",
    description: "适合没有设计基础、需要把资料快速整理成汇报结构、讲义或课程大纲的新手。",
    audience: "学生、职场汇报、课程讲师、小团队方案撰写者。",
    firstStep: "先用 Kimi 或 DeepSeek 把材料整理成 6 页大纲，再用 Gamma 生成第一版 PPT，最后人工改标题和结论页。",
    tools: [
      { id: "kimi", role: "资料整理", reason: "适合上传长文档、提取重点、生成汇报逻辑。" },
      { id: "deepseek", role: "观点打磨", reason: "适合补充推理、生成讲稿、检查逻辑漏洞。" },
      { id: "gamma", role: "PPT 生成", reason: "适合把大纲快速变成可演示页面。" },
      { id: "canva-ai", role: "视觉润色", reason: "适合用模板补齐封面、图表和配色。" },
    ],
    checklist: ["材料是否已经去掉无关信息", "每页是否只有一个结论", "AI 生成的数字和案例是否人工核对", "是否导出后检查字体和版式"],
    missionHref: "/start?goal=做PPT",
    casePrompt: "我用 AI 做了一份 PPT：材料类型、工具组合、页数结构、人工修改点、最终效果。",
  },
  {
    slug: "free-ai-writing-tools-cn",
    title: "中文新手免费 AI 写作工具推荐",
    description: "适合写公众号、小红书、朋友圈文案、课程笔记和日常总结，先用免费工具跑通内容流程。",
    audience: "自媒体新手、门店老板、学生、运营、知识博主。",
    firstStep: "先准备一个真实经历或产品卖点，让 DeepSeek 生成结构，让 Kimi 改成长文，再用火山写作做平台化润色。",
    tools: [
      { id: "deepseek", role: "结构生成", reason: "免费、中文推理强，适合先搭文章骨架。" },
      { id: "kimi", role: "长文改写", reason: "适合处理长资料、整理语气和段落。" },
      { id: "huoshan", role: "平台润色", reason: "中文内容平台表达更顺手，适合小红书和公众号。" },
      { id: "xiezuocat", role: "错别字检查", reason: "适合润色、纠错和改语气。" },
    ],
    checklist: ["内容里是否有真实细节", "标题是否夸大", "是否保留人工观点", "发布前是否检查事实和敏感表述"],
    missionHref: "/start?goal=写文章",
    casePrompt: "我用 AI 写了一篇内容：主题、目标读者、提示词、修改前后对比、发布效果。",
  },
  {
    slug: "ai-tools-for-xiaohongshu",
    title: "小红书新手 AI 内容工具组合",
    description: "用最少工具完成选题、正文、封面图和发布检查，先跑通一条内容，而不是堆一堆软件。",
    audience: "小红书新号、个人 IP、店铺种草、课程笔记和产品宣传。",
    firstStep: "用 DeepSeek 做选题和正文，用即梦生成封面图，用剪映 AI 做短视频版本，最后让 Kimi 做发布前检查。",
    tools: [
      { id: "deepseek", role: "选题正文", reason: "适合从真实经历中提炼痛点、标题和正文结构。" },
      { id: "jimeng", role: "封面配图", reason: "中文提示词理解好，国内新手上手快。" },
      { id: "jianying-ai", role: "短视频版本", reason: "模板多，适合把图文内容改成视频。" },
      { id: "kimi", role: "发布检查", reason: "适合检查空话、夸大和结构问题。" },
    ],
    checklist: ["选题是否来自真实经历", "图片是否和正文一致", "是否避免医疗/金融等高风险承诺", "是否记录可复用提示词"],
    missionHref: "/missions/xiaohongshu-ai-content-loop",
    casePrompt: "我跑通了一条小红书 AI 内容流水线：选题、正文、配图 Prompt、发布前检查、下一条计划。",
  },
  {
    slug: "ai-agent-tools-for-small-business",
    title: "小公司和门店 AI Agent 工具怎么选",
    description: "从客服知识库、资料助手和自动化提醒开始，不追求一步到位，先让一个环节稳定省时间。",
    audience: "餐饮店、电商店铺、课程团队、本地服务商、小型创业团队。",
    firstStep: "先用 Dify 或 Coze 做一个 10 条 FAQ 的客服 Bot，再用 n8n 把日报、表格或提醒串起来。",
    tools: [
      { id: "dify", role: "知识库客服", reason: "适合把售后政策、产品资料和 FAQ 变成可测试 Bot。" },
      { id: "coze", role: "渠道 Bot", reason: "适合做智能体并发布到社群或网页渠道。" },
      { id: "n8n-ai-agent", role: "自动化流程", reason: "适合连接表格、邮件、通知和 AI 摘要。" },
      { id: "deepseek-v4-api", role: "模型后端", reason: "适合作为高性价比 API 后端，供 Agent 平台调用。" },
    ],
    checklist: ["是否准备了真实 FAQ", "是否设置不能乱承诺的边界", "是否有人工审核点", "是否记录失败问题并继续改知识库"],
    missionHref: "/missions/dify-knowledge-base-bot",
    casePrompt: "我给店铺/公司做了一个 AI 助手：业务场景、资料来源、工具组合、测试问题、上线边界。",
  },
  {
    slug: "ai-coding-agent-tools",
    title: "AI 编程 Agent 工具怎么选",
    description: "把 Codex、Claude Code、Cursor 等工具放在真实项目里比较：谁适合改代码，谁适合解释，谁适合新手起步。",
    audience: "独立开发者、网站站长、想学习 AI 编程的新手和小团队。",
    firstStep: "先选一个很小的项目需求，让 Codex 或 Claude Code 只读相关文件、列计划、改 1 个小功能，再跑 build/test。",
    tools: [
      { id: "codex", role: "工程 Agent", reason: "适合读写项目、执行命令、调试和形成可验证 diff。" },
      { id: "claude-code", role: "CLI 编程", reason: "适合终端工作流和复杂代码理解。" },
      { id: "cursor", role: "AI 编辑器", reason: "适合在编辑器里理解项目并做小步修改。" },
      { id: "deepseek", role: "代码模型", reason: "适合推理、代码解释和低成本 API 方案。" },
    ],
    checklist: ["是否先提交 Git", "是否限制改动文件范围", "是否要求先列计划", "是否跑了 build/test 并记录结果"],
    missionHref: "/start?goal=学编程",
    casePrompt: "我用 AI Agent 改了一个项目：需求、工具、涉及文件、验证命令、踩坑和下次提示词。",
  },
]

export function getRecommendationPage(slug: string) {
  return recommendationPages.find((page) => page.slug === slug)
}
