import type { Metadata } from "next"
import ChooseToolClient from "./ChooseToolClient"

export const metadata: Metadata = {
  title: "AI工具选择器 - 根据场景推荐 ChatGPT、DeepSeek、AI绘图和AI编程工具",
  description: "小白AI工具选择器会根据写作、编程、AI绘图、客服、办公、学习和自动化等场景，推荐适合新手使用的 AI 工具、模型和学习路径。",
  keywords: ["AI工具选择器", "AI工具推荐", "AI工具怎么选", "ChatGPT", "DeepSeek", "AI绘图工具", "AI编程工具", "Agent工具"],
  alternates: { canonical: "/choose-tool" },
  openGraph: {
    title: "AI工具选择器 | 小白AI",
    description: "回答几个简单问题，自动推荐适合你的 AI 工具、模型和学习路径。",
    url: "/choose-tool",
    images: [{ url: "/xiaobai-mascot-cutout.png", alt: "小白AI 工具选择器" }],
  },
}

export default function ChooseToolPage() {
  return <ChooseToolClient />
}
