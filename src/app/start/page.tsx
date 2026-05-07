import type { Metadata } from "next"
import { StartClient } from "./StartClient"

export const metadata: Metadata = {
  title: "AI从0到1起步 - 今日任务单与AI实战启动器",
  description:
    "小白AI从0到1起步页，帮助新手从“我最想做成什么事”出发，生成今日0-1任务单：明确目标、完成一个环节、复制提示词、交付作品并发布复盘。",
  keywords: ["AI从0到1", "AI实战起步", "AI项目起步", "AI学习目标", "AI任务单", "AI应用落地", "AI新手第一步"],
  alternates: { canonical: "/start" },
  openGraph: {
    title: "AI从0到1起步 | 小白AI",
    description: "不要先选工具，先说你想做成什么事，再生成今天能完成的第一个环节。",
    url: "/start",
    images: [{ url: "/xiaobai-mascot-cutout.png", alt: "小白AI 从0到1起步" }],
  },
}

export default function StartPage() {
  return <StartClient />
}
