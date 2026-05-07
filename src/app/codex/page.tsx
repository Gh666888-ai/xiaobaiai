import type { Metadata } from "next"
import { SeoTopicPage } from "@/components/SeoTopicPage"

export const metadata: Metadata = {
  title: "Codex国内使用指南 - OpenAI Codex安装、配置、编程Agent和替代工具",
  description: "小白AI整理 OpenAI Codex 国内使用、安装配置、适合场景、和 Cursor、Claude Code、GitHub Copilot 的区别，帮助开发者用 AI Agent 改代码、调试和管理项目。",
  keywords: ["Codex国内使用", "OpenAI Codex", "Codex安装", "AI编程Agent", "Claude Code替代", "Cursor对比"],
  alternates: { canonical: "/codex" },
  openGraph: {
    title: "Codex国内使用指南 | 小白AI",
    description: "OpenAI Codex 安装、配置、AI 编程 Agent 和替代工具整理。",
    url: "/codex",
    images: [{ url: "/xiaobai-mascot-cutout.png", alt: "小白AI Codex教程" }],
  },
}

export default function CodexTopicPage() {
  return (
    <SeoTopicPage
      eyebrow="Codex Guide"
      title="Codex国内使用指南：安装配置、AI编程Agent和替代工具"
      description="OpenAI Codex 更像一个能读写项目、执行命令和协助调试的 AI 编程 Agent。这个专题帮助开发者理解 Codex 适合什么项目、怎么安全使用，以及和 Cursor、Claude Code、GitHub Copilot 的区别。"
      primaryHref="/tools/AI%E7%BC%96%E7%A8%8B/codex"
      primaryLabel="查看 Codex 工具详情"
      toolRefs={[
        { id: "codex", note: "Codex 适合真实项目里的文件修改、命令执行、调试和代码审查。" },
        { id: "claude-code", note: "Claude Code 是终端 AI 编程助手，适合命令行重度用户。" },
        { id: "cursor", note: "Cursor 是 AI 编辑器，适合在 IDE 里做项目级对话和代码修改。" },
        { id: "github-copilot", note: "GitHub Copilot 稳定补全和 IDE 集成强，适合团队日常开发。" },
        { id: "deepseek", note: "DeepSeek 可作为高性价比代码解释、脚本生成和推理模型补充。" },
      ]}
      sections={[
        {
          title: "Codex适合做什么",
          body: "Codex 的优势不是简单补全，而是围绕一个工程任务读代码、改文件、跑命令、看错误并继续修。",
          bullets: ["修 Bug、改 Next.js 页面、补 API、整理代码。", "解释陌生项目结构、生成迁移计划和代码审查建议。", "配合 Git 小步提交，降低 AI 改坏项目的风险。"],
        },
        {
          title: "国内使用要注意什么",
          body: "国内使用 Codex 时，账号、模型服务、网络和 API Key 管理都要提前准备。",
          bullets: ["不要把 API Key 写进公开代码仓库。", "重要项目先提交 Git，再让 Codex 修改。", "复杂任务拆小，避免一次性让 AI 大范围重构。"],
        },
        {
          title: "和Cursor怎么选",
          body: "Cursor 更像编辑器，Codex 更像任务型工程 Agent。两者可以配合，而不是二选一。",
          bullets: ["日常编辑和对话：Cursor 更顺手。", "跨文件任务、命令执行、调试：Codex 更像助手。", "团队开发仍要保留代码审查和测试流程。"],
        },
      ]}
      faq={[
        { question: "Codex适合新手吗？", answer: "如果是完全零代码新手，建议先从 Cursor 或通义灵码开始；如果已经会 Git 和基本命令行，Codex 会更有价值。" },
        { question: "Codex会不会改坏项目？", answer: "任何 AI 编程工具都可能改错。使用前先提交 Git、限定文件范围、让它先说计划，改完读 diff，是最基本的安全动作。" },
        { question: "Codex有哪些替代品？", answer: "常见替代品包括 Claude Code、Cursor、Cline、GitHub Copilot、Aider、通义灵码和 DeepSeek 代码模型。" },
      ]}
      related={[
        { href: "/tools/AI%E7%BC%96%E7%A8%8B/codex", label: "Codex工具详情" },
        { href: "/tools/AI%E7%BC%96%E7%A8%8B/claude-code", label: "Claude Code详情" },
        { href: "/tools/AI%E7%BC%96%E7%A8%8B/cursor", label: "Cursor详情" },
        { href: "/ai-coding", label: "AI编程工具推荐" },
      ]}
    />
  )
}
