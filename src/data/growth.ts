export const CHECK_IN_XP = 15
export const ONLINE_XP_PER_HEARTBEAT = 2
export const DAILY_ONLINE_XP_CAP = 60
export const LEARNING_STAGE_XP = 80

export type GrowthMission = {
  id: string
  title: string
  desc: string
  xp: number
  href: string
  cadence: "once" | "daily"
}

export const GROWTH_MISSIONS: GrowthMission[] = [
  {
    id: "welcome",
    title: "领取新手启动礼包",
    desc: "注册登录后先领一份启动 XP，立刻点亮成长舱和右上角等级进度。",
    xp: 50,
    href: "/growth",
    cadence: "once",
  },
  {
    id: "ask-ai",
    title: "问 AI 一个真实问题",
    desc: "不要问泛泛的问题，直接拿今天的工作、学习或生活需求试一次。",
    xp: 20,
    href: "/search?q=我想让 AI 帮我分析一个需求",
    cadence: "daily",
  },
  {
    id: "choose-tool",
    title: "完成一次工具选择",
    desc: "用 AI 工具选择器选出今天最适合你的工具。",
    xp: 30,
    href: "/choose-tool",
    cadence: "daily",
  },
  {
    id: "learn-section",
    title: "学完一个章节",
    desc: "进入学习路径，标记任意一个章节为已学完。",
    xp: 40,
    href: "/learn",
    cadence: "daily",
  },
  {
    id: "read-community",
    title: "读一篇社区经验",
    desc: "看一篇真实案例，把能复用的一步记下来。",
    xp: 25,
    href: "/community",
    cadence: "daily",
  },
  {
    id: "claude-code-deepseek-project",
    title: "完成 Claude Code + DeepSeek V4 实战任务",
    desc: "跑通模型后端接入，让工程 Agent 完成一个小 diff 并发复盘。",
    xp: 80,
    href: "/missions/claude-code-deepseek-project",
    cadence: "once",
  },
  {
    id: "codex-small-feature",
    title: "完成 Codex 小功能实战任务",
    desc: "让 Codex 在真实项目里完成一个小功能，并用 build/test 验证。",
    xp: 75,
    href: "/missions/codex-small-feature",
    cadence: "once",
  },
  {
    id: "kimi-k26-long-doc",
    title: "完成 Kimi K2.6 长文档分析任务",
    desc: "把一份长文档整理成摘要、风险和行动清单。",
    xp: 60,
    href: "/missions/kimi-k26-long-doc",
    cadence: "once",
  },
  {
    id: "dify-knowledge-base-bot",
    title: "完成 Dify 知识库客服任务",
    desc: "整理资料、导入知识库并测试真实问题。",
    xp: 70,
    href: "/missions/dify-knowledge-base-bot",
    cadence: "once",
  },
  {
    id: "n8n-ai-news-automation",
    title: "完成 n8n AI 资讯自动化任务",
    desc: "跑通半自动资讯流程，包含摘要、审核和发送节点。",
    xp: 75,
    href: "/missions/n8n-ai-news-automation",
    cadence: "once",
  },
  {
    id: "xiaohongshu-ai-content-loop",
    title: "完成小红书 AI 内容流水线任务",
    desc: "完成选题、正文、配图提示词和发布检查清单。",
    xp: 60,
    href: "/missions/xiaohongshu-ai-content-loop",
    cadence: "once",
  },
]
