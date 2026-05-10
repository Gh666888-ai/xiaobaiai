export type GoalOption = {
  group: "个人在家" | "企业团队"
  label: string
  desc: string
  missionId: string
  prompt: string
}

export const goalOptions: GoalOption[] = [
  {
    group: "个人在家",
    label: "在家创业接单",
    desc: "不先谈赚钱，先做一个能展示的作品。",
    missionId: "xiaohongshu-ai-content-loop",
    prompt: "我想在家创业接单，不想出门。请给我推荐一个最容易开始的任务入口。我的情况先按：每天有一点时间、电脑基础一般、还不确定是否露脸。",
  },
  {
    group: "个人在家",
    label: "做内容账号",
    desc: "图文、短视频、AI漫剧先做一个样片。",
    missionId: "ai-comic-video-first-episode",
    prompt: "我想用 AI 做内容账号。请给我推荐一个最容易开始的任务入口，先从图文、短视频或 AI 漫剧里选。",
  },
  {
    group: "个人在家",
    label: "办公接单",
    desc: "PPT、简历、会议纪要先做一个样稿。",
    missionId: "ai-ppt-first-deck",
    prompt: "我想在家做办公接单。请给我推荐一个最容易开始的任务入口，先从 PPT、简历、会议纪要或资料整理里选。",
  },
  {
    group: "个人在家",
    label: "训练个人Agent",
    desc: "安装工具后设人设、记忆和验收标准。",
    missionId: "agent-skill-first-install",
    prompt: "我想训练一个个人 Agent 帮我做固定工作。请给我推荐一个最容易开始的任务入口，先从安装 Agent、配置模型、人设记忆开始。",
  },
  {
    group: "企业团队",
    label: "企业知识库客服",
    desc: "先整理 FAQ，再搭可测试客服助手。",
    missionId: "dify-knowledge-base-bot",
    prompt: "我们是企业团队，想用 AI 做知识库客服。请给我推荐一个最容易开始的任务入口，先从 FAQ、产品资料和人工接管边界开始。",
  },
  {
    group: "企业团队",
    label: "企业办公提效",
    desc: "会议纪要、SOP、周报日报、资料整理。",
    missionId: "kimi-k26-long-doc",
    prompt: "我们是企业团队，想用 AI 做办公提效。请给我推荐一个最容易开始的任务入口，先从资料读取、会议纪要、SOP 或周报日报开始。",
  },
  {
    group: "企业团队",
    label: "企业营销内容",
    desc: "产品资料、活动文案、销售话术、案例复盘。",
    missionId: "industry-skill-stack-plan",
    prompt: "我们是企业团队，想用 AI 做营销内容和销售支持。请给我推荐一个最容易开始的任务入口，先从产品资料、活动文案和销售话术开始。",
  },
  {
    group: "企业团队",
    label: "企业自动化流程",
    desc: "定时日报、通知、数据同步和流程提醒。",
    missionId: "n8n-ai-news-automation",
    prompt: "我们是企业团队，想用 AI 做自动化流程。请给我推荐一个最容易开始的任务入口，先从定时日报、通知、数据同步或流程提醒开始。",
  },
]

export const diagnosisQuestions = [
  {
    label: "你现在最像哪一种？",
    options: ["完全新手", "个人接单/副业", "企业团队", "开发/站长"],
  },
  {
    label: "你手里有没有材料？",
    options: ["没有材料", "有文档/表格", "有产品资料", "有项目代码"],
  },
  {
    label: "今天想先交付什么？",
    options: ["PPT/文档", "内容样稿", "客服/知识库", "自动化/代码"],
  },
]

export function recommendByDiagnosis(answers: string[]) {
  const text = answers.join(" ")
  if (/项目代码|开发|站长|代码/.test(text)) return goalOptions.find((option) => option.missionId === "agent-skill-first-install") || goalOptions[3]
  if (/客服|知识库|企业团队|产品资料/.test(text)) return goalOptions.find((option) => option.missionId === "dify-knowledge-base-bot") || goalOptions[4]
  if (/自动化/.test(text)) return goalOptions.find((option) => option.missionId === "n8n-ai-news-automation") || goalOptions[7]
  if (/内容样稿|个人接单|副业/.test(text)) return goalOptions.find((option) => option.missionId === "xiaohongshu-ai-content-loop") || goalOptions[0]
  if (/文档|表格/.test(text)) return goalOptions.find((option) => option.missionId === "kimi-k26-long-doc") || goalOptions[5]
  return goalOptions.find((option) => option.missionId === "ai-ppt-first-deck") || goalOptions[2]
}
