import type { Metadata } from "next"
import ChooseToolClient from "./ChooseToolClient"

export const metadata: Metadata = {
  title: "AI 工具选择器 - 小白AI",
  description: "回答几个简单问题，自动推荐适合写作、编程、做图、客服、自动化等场景的 AI 工具和学习路径。",
}

export default function ChooseToolPage() {
  return <ChooseToolClient />
}
