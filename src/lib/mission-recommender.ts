import { missions } from "@/data/missions"
import type { Mission } from "@/data/missions"

type MissionRule = {
  id: string
  keywords: string[]
}

const missionRules: MissionRule[] = [
  {
    id: "ai-comic-video-first-episode",
    keywords: ["动漫", "漫画", "漫剧", "短剧", "视频", "分镜", "配音", "剪映", "动画", "角色", "剧情", "ai剧"],
  },
  {
    id: "xiaohongshu-ai-content-loop",
    keywords: ["自媒体", "内容", "小红书", "抖音", "短视频", "种草", "文案", "账号", "博主", "探店", "矩阵"],
  },
  {
    id: "dify-knowledge-base-bot",
    keywords: ["客服", "售后", "知识库", "问答", "客户", "私域", "企业微信", "faq", "咨询", "话术"],
  },
  {
    id: "ai-click-game-first-run",
    keywords: ["小游戏", "游戏", "点击得分", "互动", "h5小游戏", "网页游戏", "活动游戏", "抽奖游戏"],
  },
  {
    id: "ai-website-first-page",
    keywords: ["做网站", "建网站", "网站", "网页", "落地页", "官网", "主页", "个人页", "产品页", "门店页", "活动页"],
  },
  {
    id: "ai-ppt-first-deck",
    keywords: ["ppt", "汇报", "方案", "课件", "演示", "路演", "产品介绍", "工作报告", "述职", "提案"],
  },
  {
    id: "kimi-k26-long-doc",
    keywords: ["文档", "合同", "论文", "资料", "会议", "纪要", "总结", "报告", "长文", "pdf", "word"],
  },
  {
    id: "n8n-ai-news-automation",
    keywords: ["自动化", "日报", "通知", "定时", "流程", "工作流", "抓取", "同步", "提醒", "n8n"],
  },
  {
    id: "industry-skill-stack-plan",
    keywords: ["skill", "技能", "openclaw", "hermes", "插件", "agent", "智能体", "工具组合", "行业方案"],
  },
  {
    id: "codex-small-feature",
    keywords: ["codex", "编程", "代码", "开发", "项目", "功能", "bug", "程序", "改代码", "真实项目"],
  },
  {
    id: "claude-code-deepseek-project",
    keywords: ["claude code", "deepseek v4", "api", "模型接口", "模型后端", "工程agent"],
  },
  {
    id: "local-model-first-run",
    keywords: ["本地模型", "本地部署", "ollama", "lm studio", "离线", "显卡", "本地跑"],
  },
  {
    id: "ai-webnovel-first-chapter",
    keywords: ["小说", "网文", "故事", "剧本", "爽文", "人物设定", "章节"],
  },
]

function normalizeGoal(value: string) {
  return value.toLowerCase().replace(/\s+/g, "")
}

export function recommendMissionFromGoal(goal: string): Mission {
  const text = normalizeGoal(goal)
  let best = { id: "industry-skill-stack-plan", score: 0 }

  for (const rule of missionRules) {
    const score = rule.keywords.reduce((total, keyword) => {
      const normalizedKeyword = normalizeGoal(keyword)
      return total + (text.includes(normalizedKeyword) ? Math.max(1, normalizedKeyword.length) : 0)
    }, 0)
    if (score > best.score) best = { id: rule.id, score }
  }

  return missions.find((mission) => mission.id === best.id) || missions[0]
}
