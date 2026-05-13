import type { Metadata } from "next"
import CommunityClient from "./CommunityClient"

export const metadata: Metadata = {
  title: "AI复盘库 - 问题求助、踩坑修复和实战案例沉淀",
  description: "小白AI复盘库沉淀 Agent 实战复盘、AI工具踩坑修复、AI自动化案例、Dify/Coze/Cursor/DeepSeek 使用问题和可复用解决方案，不做普通帖子流。",
  keywords: ["AI复盘库", "AI问题求助", "AI工具踩坑", "Agent实战复盘", "AI自动化案例", "Dify问题", "Cursor问题", "DeepSeek使用"],
  alternates: { canonical: "/community" },
  openGraph: {
    title: "AI复盘库 | 小白AI",
    description: "复盘、问题、踩坑修复和实战案例沉淀，不做普通帖子流。",
    url: "/community",
    images: [{ url: "/xiaobai-mascot-cutout.png", width: 1071, height: 1468, alt: "小白AI 复盘库" }],
  },
}

export default function CommunityPage() {
  return <CommunityClient />
}
