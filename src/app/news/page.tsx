import type { Metadata } from "next"
import NewsClient from "./NewsClient"

export const metadata: Metadata = {
  title: "AI 资讯",
  description: "聚合 AI 行业动态、产品发布、教程资源、开源项目和政策监管资讯，按重要性与时间排序。",
  alternates: { canonical: "/news" },
  openGraph: {
    title: "AI 资讯 | 小白AI",
    description: "每日 AI 行业动态、产品发布、开源项目和教程资源。",
    url: "/news",
    images: [{ url: "/xiaobai-mascot-cutout.png", width: 1071, height: 1468, alt: "小白AI 资讯" }],
  },
}

export default function NewsPage() {
  return <NewsClient />
}
