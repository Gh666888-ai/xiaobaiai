import type { MetadataRoute } from "next"
import { news } from "@/data/news"
import { posts } from "@/data/community"
import { stages } from "@/data/learning-path"
import { categories, tools } from "@/data/tools"
import { categoryPath, toolPath } from "@/data/tool-meta"
import { recommendationPages } from "@/data/recommendations"

const siteUrl = "https://www.xiaobaiai.cn"
const lastModified = new Date()

function url(path: string) {
  return new URL(path, siteUrl).toString()
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: url("/"), lastModified, changeFrequency: "daily", priority: 1 },
    { url: url("/tools"), lastModified, changeFrequency: "daily", priority: 0.95 },
    { url: url("/start"), lastModified, changeFrequency: "weekly", priority: 0.93 },
    { url: url("/choose-tool"), lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: url("/ai-tools"), lastModified, changeFrequency: "weekly", priority: 0.94 },
    { url: url("/tutorials"), lastModified, changeFrequency: "weekly", priority: 0.93 },
    { url: url("/cases"), lastModified, changeFrequency: "weekly", priority: 0.91 },
    { url: url("/free-ai-tools"), lastModified, changeFrequency: "weekly", priority: 0.92 },
    { url: url("/chatgpt"), lastModified, changeFrequency: "weekly", priority: 0.92 },
    { url: url("/deepseek"), lastModified, changeFrequency: "weekly", priority: 0.92 },
    { url: url("/claude-code-deepseek"), lastModified, changeFrequency: "weekly", priority: 0.92 },
    { url: url("/claude-code-proxy"), lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: url("/codex"), lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: url("/dify"), lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: url("/topics/dify"), lastModified, changeFrequency: "weekly", priority: 0.88 },
    { url: url("/topics/claude-code-deepseek"), lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: url("/cursor"), lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: url("/agent"), lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: url("/ai-coding"), lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: url("/ai-image-tools"), lastModified, changeFrequency: "weekly", priority: 0.88 },
    { url: url("/ai-writing-tools"), lastModified, changeFrequency: "weekly", priority: 0.88 },
    { url: url("/ai-video-tools"), lastModified, changeFrequency: "weekly", priority: 0.88 },
    { url: url("/ai-office-tools"), lastModified, changeFrequency: "weekly", priority: 0.88 },
    { url: url("/ai-ppt-tools"), lastModified, changeFrequency: "weekly", priority: 0.88 },
    { url: url("/deepseek-api-key"), lastModified, changeFrequency: "weekly", priority: 0.86 },
    { url: url("/dify-knowledge-base"), lastModified, changeFrequency: "weekly", priority: 0.86 },
    { url: url("/gamma-ppt"), lastModified, changeFrequency: "weekly", priority: 0.86 },
    { url: url("/jimeng-prompts"), lastModified, changeFrequency: "weekly", priority: 0.86 },
    { url: url("/news"), lastModified, changeFrequency: "daily", priority: 0.9 },
    { url: url("/learn"), lastModified, changeFrequency: "weekly", priority: 0.88 },
    { url: url("/community"), lastModified, changeFrequency: "daily", priority: 0.86 },
    { url: url("/models"), lastModified, changeFrequency: "weekly", priority: 0.82 },
    { url: url("/skills"), lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: url("/chat"), lastModified, changeFrequency: "weekly", priority: 0.78 },
    { url: url("/workflows"), lastModified, changeFrequency: "weekly", priority: 0.76 },
    { url: url("/growth"), lastModified, changeFrequency: "weekly", priority: 0.72 },
    { url: url("/search"), lastModified, changeFrequency: "weekly", priority: 0.7 },
    { url: url("/about"), lastModified, changeFrequency: "monthly", priority: 0.62 },
  ]

  const categoryRoutes = categories.map((category) => ({
    url: url(categoryPath(category.key)),
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.84,
  }))

  const toolRoutes = tools.map((tool) => ({
    url: url(toolPath(tool)),
    lastModified: tool.addedAt ? new Date(tool.addedAt) : lastModified,
    changeFrequency: "monthly" as const,
    priority: tool.featured ? 0.82 : 0.72,
  }))

  const newsRoutes = news.map((item) => ({
    url: url(`/news/${encodeURIComponent(item.id)}`),
    lastModified: item.publishedAt ? new Date(item.publishedAt) : lastModified,
    changeFrequency: "monthly" as const,
    priority: item.importance >= 8 ? 0.8 : 0.68,
  }))

  const learnRoutes = stages.map((stage) => ({
    url: url(`/learn/${stage.id}`),
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.78,
  }))

  const recommendationRoutes = recommendationPages.map((page) => ({
    url: url(`/recommend/${encodeURIComponent(page.slug)}`),
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.82,
  }))

  const communityRoutes = posts.map((post) => ({
    url: url(`/community/${encodeURIComponent(post.id)}`),
    lastModified: post.publishedAt ? new Date(post.publishedAt) : lastModified,
    changeFrequency: "monthly" as const,
    priority: post.pinned ? 0.78 : 0.68,
  }))

  return [...staticRoutes, ...categoryRoutes, ...toolRoutes, ...newsRoutes, ...learnRoutes, ...recommendationRoutes, ...communityRoutes]
}
