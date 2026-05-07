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
]
