import type { Metadata } from "next"
import NewsClient from "./NewsClient"

export const metadata: Metadata = {
  title: "AI 资讯",
  description: "聚合 AI 行业动态、产品发布、教程资源、开源项目和政策监管资讯，按重要性与时间排序。",
  alternates: { canonical: "/news" },
}

export default function NewsPage() {
  return <NewsClient />
}
