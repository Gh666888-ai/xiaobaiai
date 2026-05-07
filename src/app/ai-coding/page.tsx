import type { Metadata } from "next"
import { SeoTopicPage } from "@/components/SeoTopicPage"

export const metadata: Metadata = {
  title: "AI编程工具推荐 - Codex、Claude Code、Cursor、Windsurf、Copilot和Lovable",
  description: "小白AI整理 2026 主流 AI 编程工具推荐，对比 OpenAI Codex、Claude Code、Cursor、Windsurf、GitHub Copilot、Lovable、v0、Bolt、Replit Agent 和 DeepSeek，帮助开发者选择AI编辑器、终端Agent和应用生成工具。",
  keywords: ["AI编程工具推荐", "AI写代码", "Codex", "Claude Code", "Cursor", "Windsurf", "GitHub Copilot", "Lovable", "AI编程Agent", "DeepSeek写代码"],
  alternates: { canonical: "/ai-coding" },
  openGraph: {
    title: "AI编程工具推荐 | 小白AI",
    description: "Codex、Claude Code、Cursor、Windsurf、Copilot、Lovable 和 DeepSeek 怎么选。",
    url: "/ai-coding",
    images: [{ url: "/xiaobai-mascot-cutout.png", alt: "小白AI AI编程工具推荐" }],
  },
}

export default function AiCodingTopicPage() {
  return (
    <SeoTopicPage
      eyebrow="AI Coding"
      title="AI编程工具推荐：Codex、Claude Code、Cursor、Windsurf、Copilot怎么选"
      description="AI 编程工具现在分为代码补全、AI 编辑器、终端 Agent、云端应用生成和模型助手。这个专题帮你按真实开发场景选择工具，避免一上来就被一堆名字绕晕。"
      primaryHref="/tools/AI%E7%BC%96%E7%A8%8B"
      primaryLabel="查看AI编程工具排行"
      toolRefs={[
        { id: "codex", note: "适合工程任务、跨文件修改、命令执行和调试，偏 AI 编程 Agent。" },
        { id: "claude-code", note: "适合终端工作流和代码库理解，命令行开发者会更喜欢。" },
        { id: "cursor", note: "适合想要 AI 编辑器体验的开发者，项目级对话和代码修改都方便。" },
        { id: "windsurf", note: "适合喜欢 AI IDE 和 Agent 模式的开发者，是 Cursor 的主要竞争者之一。" },
        { id: "github-copilot", note: "适合稳定代码补全、生成测试、解释代码和团队 IDE 集成。" },
        { id: "lovable", note: "适合非程序员或产品经理用自然语言生成 SaaS/MVP 原型。" },
        { id: "v0", note: "适合生成 React/Tailwind 前端界面和组件，配合 Next.js 项目很顺手。" },
        { id: "deepseek", note: "适合低成本代码解释、脚本生成、SQL 分析和推理辅助。" },
      ]}
      sections={[
        {
          title: "按场景选择",
          body: "工具不是越强越好，关键是和你的开发习惯匹配。",
          bullets: ["想在编辑器里边写边问：Cursor 或 Windsurf。", "想让 AI 接工程任务：Codex 或 Claude Code。", "只需要稳定补全：GitHub Copilot。", "想从一句话生成应用原型：Lovable、Bolt、Replit Agent。", "想生成前端页面：v0。"],
        },
        {
          title: "AI写代码的安全规则",
          body: "AI 能提高速度，但不能替代工程判断。项目越重要，越要小步使用。",
          bullets: ["每次只让 AI 改一个小需求。", "指定文件范围，禁止无关重构。", "改完读 diff，必要时补测试。"],
        },
        {
          title: "新手路线",
          body: "如果你刚开始用 AI 编程，不要同时装一堆工具。先跑通一个，再补另一个能力。",
          bullets: ["第一步：用 Cursor、Windsurf 或 Copilot 做日常辅助。", "第二步：用 DeepSeek 解释报错和生成小脚本。", "第三步：用 Codex/Claude Code 处理多文件任务。", "第四步：用 Lovable/v0/Bolt 做原型，再回到代码里精修。"],
        },
      ]}
      faq={[
        { question: "AI编程工具会替代程序员吗？", answer: "短期更像放大器。它能加速代码生成、解释和调试，但架构判断、需求理解、上线风险仍需要人负责。" },
        { question: "Cursor和Codex怎么选？", answer: "Cursor 更像 AI 编辑器，适合日常开发；Codex 更像任务型 Agent，适合让 AI 围绕工程目标读写文件和执行命令。" },
        { question: "AI写代码最怕什么？", answer: "最怕无边界大改。建议先提交 Git、指定文件范围、小步修改、读 diff，再决定是否合并。" },
      ]}
      related={[
        { href: "/tools/AI%E7%BC%96%E7%A8%8B", label: "AI编程工具分类" },
        { href: "/codex", label: "Codex国内使用指南" },
        { href: "/tools/AI%E7%BC%96%E7%A8%8B/cursor", label: "Cursor工具详情" },
        { href: "/community", label: "AI编程社区讨论" },
      ]}
    />
  )
}
