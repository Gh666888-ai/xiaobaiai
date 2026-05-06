import type { Metadata } from "next"
import ModelsClient from "./ModelsClient"

export const metadata: Metadata = {
  title: "AI 模型排行",
  description: "对比 API 云模型与本地部署模型，覆盖对话、编程、绘图、视频、音频和嵌入等主流 AI 模型场景。",
  alternates: { canonical: "/models" },
}

export default function ModelsPage() {
  return <ModelsClient />
}
