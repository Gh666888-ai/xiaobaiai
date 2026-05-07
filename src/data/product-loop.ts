import { missions, type Mission } from "@/data/missions"
import type { Post } from "@/data/community"

const goalMissionIds: Record<string, string[]> = {
  写作: ["xiaohongshu-ai-content-loop", "kimi-k26-long-doc"],
  编程: ["codex-small-feature", "claude-code-deepseek-project"],
  做图: ["xiaohongshu-ai-content-loop"],
  客服: ["dify-knowledge-base-bot"],
  自动化: ["n8n-ai-news-automation", "dify-knowledge-base-bot"],
  办公: ["kimi-k26-long-doc", "n8n-ai-news-automation"],
  学习: ["kimi-k26-long-doc", "claude-code-deepseek-project"],
  视频: ["xiaohongshu-ai-content-loop"],
}

const scenarioMissionIds: Record<string, string[]> = {
  office: ["kimi-k26-long-doc", "n8n-ai-news-automation"],
  creator: ["xiaohongshu-ai-content-loop"],
  image: ["xiaohongshu-ai-content-loop"],
  dify: ["dify-knowledge-base-bot"],
  coding: ["codex-small-feature", "claude-code-deepseek-project"],
  agent: ["n8n-ai-news-automation", "claude-code-deepseek-project"],
  data: ["kimi-k26-long-doc", "n8n-ai-news-automation"],
  security: ["codex-small-feature", "dify-knowledge-base-bot"],
  newbie: ["kimi-k26-long-doc", "xiaohongshu-ai-content-loop"],
}

const missionCaseHints: Record<string, { postIds: string[]; keywords: string[] }> = {
  "claude-code-deepseek-project": {
    postIds: ["post-13", "post-14", "post-15"],
    keywords: ["Claude Code", "DeepSeek", "OpenClaw", "Hermes", "编程"],
  },
  "codex-small-feature": {
    postIds: ["post-15"],
    keywords: ["Codex", "Claude Code", "编程", "代码", "项目"],
  },
  "kimi-k26-long-doc": {
    postIds: ["post-9", "post-10"],
    keywords: ["Kimi", "长文", "文档", "表格", "办公"],
  },
  "dify-knowledge-base-bot": {
    postIds: ["post-16", "post-41"],
    keywords: ["Dify", "知识库", "RAG", "客服"],
  },
  "n8n-ai-news-automation": {
    postIds: ["post-2", "post-17"],
    keywords: ["n8n", "早报", "工作流", "自动化", "资讯"],
  },
  "xiaohongshu-ai-content-loop": {
    postIds: ["post-5"],
    keywords: ["小红书", "内容", "公众号", "写作", "绘图", "视频"],
  },
}

function pickMissions(ids: string[]) {
  return ids.map((id) => missions.find((mission) => mission.id === id)).filter(Boolean) as Mission[]
}

export function getMissionsForGoal(goal: string) {
  return pickMissions(goalMissionIds[goal] || ["kimi-k26-long-doc", "xiaohongshu-ai-content-loop"])
}

export function getMissionsForScenario(scenario: string) {
  return pickMissions(scenarioMissionIds[scenario] || ["kimi-k26-long-doc"])
}

export function getCasePostsForMission(missionId: string, posts: Post[]) {
  const hints = missionCaseHints[missionId]
  if (!hints) return []
  const byId = posts.filter((post) => hints.postIds.includes(post.id))
  const byKeyword = posts.filter((post) => {
    const haystack = `${post.title} ${post.content} ${post.tags.join(" ")}`
    return hints.keywords.some((keyword) => haystack.includes(keyword))
  })
  const merged = [...byId, ...byKeyword]
  return Array.from(new Map(merged.map((post) => [post.id, post])).values())
    .sort((a, b) => Number(b.pinned || false) - Number(a.pinned || false) || b.likes - a.likes)
}
