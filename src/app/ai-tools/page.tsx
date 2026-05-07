import type { Metadata } from "next"
import { SeoTopicPage } from "@/components/SeoTopicPage"

export const metadata: Metadata = {
  title: "AI工具大全 - AI工具导航、AI绘图、AI编程、AI办公和Agent工具推荐",
  description: "小白AI整理 AI 工具大全，覆盖 ChatGPT、DeepSeek、Kimi、Midjourney、Dify、Coze、Codex、Cursor、Gamma 等对话AI、AI绘图、AI编程、AI办公和 Agent 工具。",
  keywords: ["AI工具大全", "AI工具导航", "AI工具推荐", "免费AI工具", "AI绘图工具", "AI编程工具", "AI办公工具", "Agent工具"],
  alternates: { canonical: "/ai-tools" },
  openGraph: {
    title: "AI工具大全 | 小白AI",
    description: "AI工具导航、AI绘图、AI编程、AI办公和Agent工具推荐。",
    url: "/ai-tools",
    images: [{ url: "/xiaobai-mascot-cutout.png", alt: "小白AI AI工具大全" }],
  },
}

export default function AiToolsTopicPage() {
  return (
    <SeoTopicPage
      eyebrow="AI Tools"
      title="AI工具大全：对话AI、AI绘图、AI编程、AI办公和Agent工具推荐"
      description="AI 工具太多时，新手最容易卡在“不知道选哪个”。这个专题把常见 AI 工具按场景拆开：聊天问答、绘图视频、写代码、做 PPT、搭 Agent 和自动化。"
      primaryHref="/tools"
      primaryLabel="进入AI工具导航"
      toolRefs={[
        { id: "chatgpt", note: "通用 AI 助手，适合写作、总结、多模态和复杂任务。" },
        { id: "deepseek", note: "高性价比中文模型，适合推理、代码、API 和日常问答。" },
        { id: "kimi", note: "长文本和中文文档分析强，适合 PDF、论文、合同和资料整理。" },
        { id: "midjourney", note: "高质量 AI 绘图工具，适合海报、插画、角色和概念图。" },
        { id: "jimeng", note: "国内易上手的 AI 图像/视频创作工具，中文提示词友好。" },
        { id: "codex", note: "AI 编程 Agent，适合工程任务、代码修改和调试。" },
        { id: "cursor", note: "AI 编辑器，适合项目级对话和代码生成。" },
        { id: "dify", note: "零代码 AI 应用平台，适合知识库、客服和工作流。" },
        { id: "gamma", note: "AI PPT 和文档生成工具，适合汇报、课程和方案。" },
      ]}
      sections={[
        {
          title: "新手先选哪类工具",
          body: "如果你完全没用过 AI，不要一口气注册几十个工具。先按最常用的任务选择。",
          bullets: ["聊天问答：ChatGPT、DeepSeek、Kimi。", "文件总结：Kimi、ChatGPT、Claude。", "写代码：Cursor、Codex、GitHub Copilot。"],
        },
        {
          title: "免费工具怎么选",
          body: "免费不是唯一标准，要看中文支持、稳定性、任务适配和输出质量。",
          bullets: ["日常中文问答优先 DeepSeek、Kimi、豆包、通义千问。", "长文档优先 Kimi。", "专业绘图和视频可能需要付费额度。"],
        },
        {
          title: "别只收藏工具",
          body: "真正产生价值的是把工具用在固定工作流里。",
          bullets: ["写作：选题、提纲、初稿、润色、发布。", "客服：知识库、草稿、人工确认、复盘。", "开发：需求拆解、代码修改、测试、部署。"],
        },
      ]}
      faq={[
        { question: "AI工具大全里最适合新手的是哪些？", answer: "对话类建议从 DeepSeek、Kimi、ChatGPT 开始；办公类可以试 Gamma；编程类可以试 Cursor；知识库和客服可以试 Dify。" },
        { question: "免费AI工具够用吗？", answer: "日常问答、写作、学习和简单办公通常够用。商业设计、视频生成、大量 API 和复杂 Agent 任务可能需要付费。" },
        { question: "AI工具太多怎么选？", answer: "先按任务选，不按热度选。明确你是要写文案、做图、写代码、做客服还是自动化，再进入对应分类。" },
      ]}
      related={[
        { href: "/tools", label: "AI工具导航" },
        { href: "/choose-tool", label: "AI工具选择器" },
        { href: "/deepseek", label: "DeepSeek怎么用" },
        { href: "/ai-coding", label: "AI编程工具推荐" },
      ]}
    />
  )
}
