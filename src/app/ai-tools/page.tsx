import type { Metadata } from "next"
import { SeoTopicPage } from "@/components/SeoTopicPage"

export const metadata: Metadata = {
  title: "AI工具大全 - 2026主流AI工具导航、Agent、AI视频和AI编程推荐",
  description: "小白AI整理 2026 主流 AI 工具大全，覆盖 ChatGPT、DeepSeek、Kimi、豆包、Gemini、GPT Image、Nano Banana、Sora、Veo、可灵、Codex、Claude Code、Cursor、Dify、Coze、Manus、n8n 等工具。",
  keywords: ["AI工具大全", "AI工具导航", "AI工具推荐", "免费AI工具", "AI绘图工具", "AI编程工具", "AI办公工具", "Agent工具"],
  alternates: { canonical: "/ai-tools" },
  openGraph: {
    title: "AI工具大全 | 小白AI",
    description: "2026主流AI工具导航、AI绘图、AI视频、AI编程、AI办公和Agent工具推荐。",
    url: "/ai-tools",
    images: [{ url: "/xiaobai-mascot-cutout.png", alt: "小白AI AI工具大全" }],
  },
}

export default function AiToolsTopicPage() {
  return (
    <SeoTopicPage
      eyebrow="AI Tools"
      title="AI工具大全：2026主流AI工具、Agent、AI视频和AI编程推荐"
      description="AI 工具太多时，新手最容易卡在“不知道选哪个”。这个专题按当前主流使用场景拆开：对话助手、图像编辑、视频生成、AI编程、办公、Agent 和自动化。"
      primaryHref="/tools"
      primaryLabel="进入AI工具导航"
      toolRefs={[
        { id: "chatgpt", note: "通用 AI 助手，适合多模态问答、写作、图像生成、文件分析和复杂任务。" },
        { id: "deepseek", note: "中文推理、代码和 API 性价比高，适合日常问答、学习和开发接入。" },
        { id: "kimi", note: "长文本和中文文档分析强，适合 PDF、论文、合同和资料整理。" },
        { id: "doubao", note: "国内大众用户使用频率高，适合日常对话、内容创作、语音和多端使用。" },
        { id: "gemini", note: "Google 多模态助手，适合长上下文、图片理解、搜索和 Google 生态。" },
        { id: "gpt-image", note: "ChatGPT 内置图像生成与编辑，适合把文案、构图和改图放在同一对话里完成。" },
        { id: "nano-banana", note: "Gemini 热门图像编辑能力，适合参考图改图、角色一致性和商品图。" },
        { id: "sora", note: "OpenAI 视频生成工具，适合高质量短片、创意分镜和视频素材探索。" },
        { id: "veo", note: "Google 视频生成模型，适合真实感强、镜头语言更完整的视频场景。" },
        { id: "codex", note: "AI 编程 Agent，适合工程任务、代码修改、命令执行和调试。" },
        { id: "claude-code", note: "当前热门终端编程 Agent，适合代码库理解、重构和命令行工作流。" },
        { id: "dify", note: "零代码 AI 应用平台，适合知识库、客服、RAG 和工作流。" },
        { id: "manus", note: "通用任务型 Agent，适合体验“给目标，让 AI 拆步骤执行”的产品形态。" },
      ]}
      sections={[
        {
          title: "新手先选哪类工具",
          body: "如果你完全没用过 AI，不要一口气注册几十个工具。先按最常用的任务选择。",
          bullets: ["对话助手：ChatGPT、DeepSeek、Kimi、豆包、Gemini、元宝。", "图片生成/编辑：ChatGPT Image、Gemini Nano Banana、Midjourney、即梦、FLUX。", "视频生成：Sora、Veo、可灵、Seedance、Runway、海螺。", "写代码：Codex、Claude Code、Cursor、Windsurf、GitHub Copilot。"],
        },
        {
          title: "免费工具怎么选",
          body: "免费不是唯一标准，要看中文支持、稳定性、任务适配和输出质量。",
          bullets: ["日常中文问答优先 DeepSeek、Kimi、豆包、元宝、通义千问。", "长文档优先 Kimi、Gemini、Claude、ChatGPT。", "图像和视频优先看额度、版权、生成稳定性和国内访问便利。"],
        },
        {
          title: "别只收藏工具",
          body: "真正产生价值的是把工具用在固定工作流里。",
          bullets: ["写作：选题、提纲、初稿、润色、发布。", "客服：知识库、草稿、人工确认、复盘。", "开发：需求拆解、代码修改、测试、部署。"],
        },
      ]}
      faq={[
        { question: "AI工具大全里最适合新手的是哪些？", answer: "对话类先试 DeepSeek、Kimi、豆包、ChatGPT；图像先试 ChatGPT Image、Nano Banana、即梦；视频先试可灵、即梦、Runway；编程先试 Cursor、Codex 或 Claude Code；知识库和客服先试 Dify、Coze。" },
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
