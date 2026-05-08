export type IndustrySeriesStep = {
  phase: string
  title: string
  desc: string
  deliverable: string
  missionId: string
}

export type IndustrySeries = {
  id: string
  title: string
  shortTitle: string
  audience: string
  promise: string
  keywords: string[]
  firstMissionId: string
  steps: IndustrySeriesStep[]
}

export const industrySeries: IndustrySeries[] = [
  {
    id: "ecommerce-store",
    title: "电商 / 店铺 AI 经营任务线",
    shortTitle: "电商店铺",
    audience: "适合淘宝、抖店、拼多多、小红书店铺、私域卖货和本地门店线上化。",
    promise: "从商品资料整理、种草内容、客服知识库、每日复盘到自动提醒，先把店铺里最重复的环节交给 AI。",
    keywords: ["电商", "店铺", "淘宝", "抖店", "拼多多", "商品", "客服", "售后", "私域", "门店", "带货"],
    firstMissionId: "kimi-k26-long-doc",
    steps: [
      {
        phase: "第 1 关",
        title: "整理商品资料和卖点",
        desc: "把商品参数、评价、竞品和常见问题整理成可复用资料。",
        deliverable: "商品卖点表、用户痛点表、禁用夸张话术清单。",
        missionId: "kimi-k26-long-doc",
      },
      {
        phase: "第 2 关",
        title: "生成一条可发布种草内容",
        desc: "把真实卖点改成小红书、短视频或详情页能用的文案。",
        deliverable: "标题、正文、封面提示词和发布前检查清单。",
        missionId: "xiaohongshu-ai-content-loop",
      },
      {
        phase: "第 3 关",
        title: "搭一个店铺客服知识库",
        desc: "把退换货、发货、尺码、售后边界做成问答库。",
        deliverable: "一个能回答 20 个常见问题的客服 Bot。",
        missionId: "dify-knowledge-base-bot",
      },
      {
        phase: "第 4 关",
        title: "做每日经营复盘提醒",
        desc: "每天提醒查看订单、评价、咨询和内容发布状态。",
        deliverable: "一条每日店铺复盘自动化流程。",
        missionId: "n8n-ai-news-automation",
      },
      {
        phase: "第 5 关",
        title: "给店铺配置 3 个 AI Skill",
        desc: "只选商品分析、内容生成、客服回复这 3 类能力。",
        deliverable: "店铺 Skill 配置方案和安全边界表。",
        missionId: "industry-skill-stack-plan",
      },
    ],
  },
  {
    id: "education-training",
    title: "教育 / 培训 AI 课程任务线",
    shortTitle: "教育培训",
    audience: "适合老师、培训机构、知识付费、讲师、教培运营和课程助理。",
    promise: "从资料整理、课件、题目、答疑知识库到课程运营复盘，形成一套能持续出课的 AI 流程。",
    keywords: ["教育", "培训", "老师", "讲师", "课程", "课件", "教培", "题目", "学生", "知识付费"],
    firstMissionId: "kimi-k26-long-doc",
    steps: [
      {
        phase: "第 1 关",
        title: "整理课程资料",
        desc: "把教材、讲义、录音转写或课程大纲整理成结构化知识点。",
        deliverable: "课程知识点表、重点难点、学生常见问题。",
        missionId: "kimi-k26-long-doc",
      },
      {
        phase: "第 2 关",
        title: "做一份 6 页试听课 PPT",
        desc: "先做一节能讲出来的小课，不追求完整课程。",
        deliverable: "试听课 PPT 初稿、讲稿备注、互动问题。",
        missionId: "ai-ppt-first-deck",
      },
      {
        phase: "第 3 关",
        title: "生成练习题和讲解",
        desc: "按知识点生成选择题、简答题和错题讲解。",
        deliverable: "10 道练习题、答案、易错点说明。",
        missionId: "kimi-k26-long-doc",
      },
      {
        phase: "第 4 关",
        title: "搭一个课程答疑知识库",
        desc: "把课程资料和常见问题放进知识库，让学员先自助提问。",
        deliverable: "课程答疑 Bot 和人工转接边界。",
        missionId: "dify-knowledge-base-bot",
      },
      {
        phase: "第 5 关",
        title: "做课程更新和作业提醒",
        desc: "自动提醒发布新课、收作业、整理答疑日报。",
        deliverable: "课程运营自动化提醒流程。",
        missionId: "n8n-ai-news-automation",
      },
    ],
  },
  {
    id: "creator-media",
    title: "自媒体 / 短视频 AI 内容任务线",
    shortTitle: "自媒体短视频",
    audience: "适合小红书、抖音、公众号、视频号、IP 账号、动漫短剧和个人品牌。",
    promise: "从定位、选题、文案、视觉、短视频脚本到发布复盘，做出一条能重复生产的内容线。",
    keywords: ["自媒体", "短视频", "小红书", "抖音", "公众号", "视频号", "账号", "IP", "ip", "动漫", "漫剧"],
    firstMissionId: "xiaohongshu-ai-content-loop",
    steps: [
      {
        phase: "第 1 关",
        title: "整理账号定位和素材",
        desc: "先确定人设、读者、内容边界和真实素材。",
        deliverable: "账号定位卡和 10 个可做选题。",
        missionId: "xiaohongshu-ai-content-loop",
      },
      {
        phase: "第 2 关",
        title: "做一条可发布内容",
        desc: "完成标题、正文、封面提示词和发布检查。",
        deliverable: "一条可发布小红书/公众号内容。",
        missionId: "xiaohongshu-ai-content-loop",
      },
      {
        phase: "第 3 关",
        title: "做 60 秒动漫/短剧样片方案",
        desc: "把内容主题改成剧情、分镜和角色提示词。",
        deliverable: "60 秒剧情、分镜表、角色一致性提示词。",
        missionId: "ai-comic-video-first-episode",
      },
      {
        phase: "第 4 关",
        title: "写故事样章或系列脚本",
        desc: "把账号内容扩展成连续故事、网文或短剧系列。",
        deliverable: "设定、大纲、第一章/第一集样稿。",
        missionId: "ai-webnovel-first-chapter",
      },
      {
        phase: "第 5 关",
        title: "做内容发布复盘自动化",
        desc: "提醒发布、收集数据、整理下周选题。",
        deliverable: "内容复盘和选题更新流程。",
        missionId: "n8n-ai-news-automation",
      },
    ],
  },
  {
    id: "local-service",
    title: "餐饮 / 本地生活 AI 获客任务线",
    shortTitle: "本地生活",
    audience: "适合餐饮、美业、健身、摄影、维修、家政、民宿和线下门店。",
    promise: "从门店资料、套餐文案、海报内容、客户问答到复购提醒，先做最容易带来咨询的环节。",
    keywords: ["餐饮", "美业", "健身", "摄影", "维修", "家政", "民宿", "本地生活", "门店", "到店", "复购"],
    firstMissionId: "kimi-k26-long-doc",
    steps: [
      {
        phase: "第 1 关",
        title: "整理门店资料和套餐",
        desc: "把地址、价格、服务、案例、评价和禁忌说明整理清楚。",
        deliverable: "门店资料卡、套餐卖点、常见问题。",
        missionId: "kimi-k26-long-doc",
      },
      {
        phase: "第 2 关",
        title: "做一条本地种草内容",
        desc: "写一条能发小红书/朋友圈/抖音的内容。",
        deliverable: "标题、正文、图片/视频脚本和发布检查。",
        missionId: "xiaohongshu-ai-content-loop",
      },
      {
        phase: "第 3 关",
        title: "做一份服务介绍 PPT",
        desc: "给团购、招商、企业客户或合作伙伴看。",
        deliverable: "6 页服务介绍 PPT 初稿。",
        missionId: "ai-ppt-first-deck",
      },
      {
        phase: "第 4 关",
        title: "搭一个门店咨询 Bot",
        desc: "让用户先问营业时间、价格、预约和注意事项。",
        deliverable: "门店问答 Bot 和人工接待边界。",
        missionId: "dify-knowledge-base-bot",
      },
      {
        phase: "第 5 关",
        title: "做预约和复购提醒",
        desc: "自动提醒回访、评价收集和老客复购。",
        deliverable: "预约/复购提醒自动化流程。",
        missionId: "n8n-ai-news-automation",
      },
    ],
  },
  {
    id: "enterprise-office",
    title: "企业办公 / 运营 AI 提效任务线",
    shortTitle: "企业办公",
    audience: "适合行政、人事、运营、销售、项目经理、老板助理和中小团队。",
    promise: "从文档分析、汇报、SOP、知识库到周报自动化，减少重复整理和反复沟通。",
    keywords: ["企业", "办公", "行政", "人事", "运营", "销售", "项目", "团队", "SOP", "sop", "周报", "会议"],
    firstMissionId: "kimi-k26-long-doc",
    steps: [
      {
        phase: "第 1 关",
        title: "分析一份长文档或会议记录",
        desc: "把资料转成摘要、风险、行动清单。",
        deliverable: "结构化摘要和可执行行动清单。",
        missionId: "kimi-k26-long-doc",
      },
      {
        phase: "第 2 关",
        title: "做一份内部汇报 PPT",
        desc: "把行动清单改成能汇报的 6 页初稿。",
        deliverable: "汇报 PPT 初稿和演讲备注。",
        missionId: "ai-ppt-first-deck",
      },
      {
        phase: "第 3 关",
        title: "搭团队知识库",
        desc: "把制度、流程、FAQ 放进知识库。",
        deliverable: "团队知识库 Bot 和权限边界。",
        missionId: "dify-knowledge-base-bot",
      },
      {
        phase: "第 4 关",
        title: "做周报/日报自动化",
        desc: "自动整理提醒、待办和结果复盘。",
        deliverable: "一条可执行的周报自动化流程。",
        missionId: "n8n-ai-news-automation",
      },
      {
        phase: "第 5 关",
        title: "给部门配置 AI Skill",
        desc: "按读取、整理、发送三个动作配置最小能力组合。",
        deliverable: "部门 Skill 配置方案和安全清单。",
        missionId: "industry-skill-stack-plan",
      },
    ],
  },
  {
    id: "developer-builder",
    title: "开发者 / 独立产品 AI 工程任务线",
    shortTitle: "开发产品",
    audience: "适合程序员、独立开发者、产品经理、站长和想用 AI 做工具的人。",
    promise: "从小功能、模型接入、本地模型、自动化到 Agent 技能，形成一个能迭代真实项目的 AI 工程流程。",
    keywords: ["开发", "程序员", "代码", "产品", "独立开发", "站长", "网站", "SaaS", "saas", "小程序", "工程"],
    firstMissionId: "codex-small-feature",
    steps: [
      {
        phase: "第 1 关",
        title: "用 Codex 改一个小功能",
        desc: "先让工程 Agent 在真实项目里完成一个小 diff。",
        deliverable: "一个通过验证的小功能改动。",
        missionId: "codex-small-feature",
      },
      {
        phase: "第 2 关",
        title: "接入 DeepSeek V4 模型后端",
        desc: "分清 Agent 和模型，跑通一个可验证配置。",
        deliverable: "已脱敏配置记录和一次成功请求。",
        missionId: "claude-code-deepseek-project",
      },
      {
        phase: "第 3 关",
        title: "本地跑通一个模型",
        desc: "用本地模型做隐私或离线场景测试。",
        deliverable: "本地模型首跑记录和适用边界。",
        missionId: "local-model-first-run",
      },
      {
        phase: "第 4 关",
        title: "做项目自动化提醒",
        desc: "把日报、监控、内容抓取或待办提醒自动化。",
        deliverable: "一条项目自动化流程。",
        missionId: "n8n-ai-news-automation",
      },
      {
        phase: "第 5 关",
        title: "给项目配置 AI Skill",
        desc: "为项目选择读取、分析、提交或部署相关能力。",
        deliverable: "工程 Skill 配置方案和权限边界。",
        missionId: "industry-skill-stack-plan",
      },
    ],
  },
]

export function findIndustrySeries(input: string) {
  const text = input.toLowerCase()
  return industrySeries.find((series) => series.keywords.some((keyword) => text.includes(keyword.toLowerCase()))) || null
}

export function getIndustrySeries(id: string) {
  return industrySeries.find((series) => series.id === id) || null
}

