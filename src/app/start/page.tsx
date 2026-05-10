import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "AI从0到1起步 - 小白AI学习首页与任务启动器",
  description:
    "小白AI学习首页已经合并从0到1起步台，帮助新手从“我最想做成什么事”出发，进入今日任务、教程、验收和复盘。",
  keywords: ["AI从0到1", "AI实战起步", "AI项目起步", "AI学习目标", "AI任务单", "AI应用落地", "AI新手第一步"],
  alternates: { canonical: "/learn" },
  openGraph: {
    title: "AI从0到1起步 | 小白AI",
    description: "不要先选工具，先说你想做成什么事，再进入今天能完成的第一个环节。",
    url: "/learn",
    images: [{ url: "/xiaobai-mascot-cutout.png", alt: "小白AI 从0到1起步" }],
  },
}

export default function StartPage() {
  redirect("/learn#learn-start")
}
