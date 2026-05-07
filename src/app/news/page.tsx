import type { Metadata } from "next"
import NewsClient from "./NewsClient"

export const metadata: Metadata = {
  title: "AI资讯 - AI新闻、产品发布、开源项目和AI教程资源",
  description: "小白AI资讯聚合 AI 行业动态、AI新闻、产品发布、教程资源、开源项目和政策监管内容，帮助新手快速了解 ChatGPT、DeepSeek、Agent 和 AI 工具趋势。",
  keywords: ["AI资讯", "AI新闻", "AI教程", "AI产品发布", "DeepSeek资讯", "ChatGPT资讯", "Agent资讯", "开源AI项目"],
  alternates: { canonical: "/news" },
  openGraph: {
    title: "AI资讯 | 小白AI",
    description: "每日 AI 行业动态、产品发布、开源项目、Agent趋势和教程资源。",
    url: "/news",
    images: [{ url: "/xiaobai-mascot-cutout.png", width: 1071, height: 1468, alt: "小白AI 资讯" }],
  },
}

export default function NewsPage() {
  return <NewsClient />
}
