import type { Metadata } from "next"
import CommunityClient from "./CommunityClient"

export const metadata: Metadata = {
  title: "AI社区 - Agent实战经验、AI工具踩坑和新手求助",
  description: "小白AI社区分享 Agent 实战经验、AI工具踩坑记录、AI自动化案例、Dify/Coze/Cursor/DeepSeek 使用问题和新手求助，沉淀普通人可复用的 AI 使用经验。",
  keywords: ["AI社区", "Agent实战", "AI工具踩坑", "AI自动化", "Dify教程", "Coze教程", "Cursor问题", "DeepSeek使用"],
  alternates: { canonical: "/community" },
  openGraph: {
    title: "AI社区 | 小白AI",
    description: "Agent 实战、踩坑记录、AI 自动化经验和新手求助社区。",
    url: "/community",
    images: [{ url: "/xiaobai-mascot-cutout.png", width: 1071, height: 1468, alt: "小白AI 社区" }],
  },
}

export default function CommunityPage() {
  return <CommunityClient />
}
