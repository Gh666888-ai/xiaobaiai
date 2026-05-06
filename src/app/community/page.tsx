import type { Metadata } from "next"
import CommunityClient from "./CommunityClient"

export const metadata: Metadata = {
  title: "AI 社区",
  description: "分享 Agent 实战经验、踩坑记录、AI 可行性分析和问题求助，沉淀普通人可复用的 AI 使用经验。",
  alternates: { canonical: "/community" },
}

export default function CommunityPage() {
  return <CommunityClient />
}
