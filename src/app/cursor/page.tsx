import type { Metadata } from "next"
import { SeoTopicPage } from "@/components/SeoTopicPage"

export const metadata: Metadata = {
  title: "Cursor怎么用 - Cursor教程、AI编程、Next.js项目和替代工具",
  description: "小白AI整理 Cursor 怎么用、AI 编程提示词、如何避免改坏样式、Next.js 项目使用方法，以及 Codex、Claude Code、GitHub Copilot 等替代工具。",
  keywords: ["Cursor怎么用", "Cursor教程", "Cursor Next.js", "Cursor提示词", "AI编程工具", "Cursor替代品", "Cursor改坏样式"],
  alternates: { canonical: "/cursor" },
  openGraph: {
    title: "Cursor怎么用 | 小白AI",
    description: "Cursor 教程、AI 编程提示词、Next.js 项目和替代工具整理。",
    url: "/cursor",
    images: [{ url: "/xiaobai-mascot-cutout.png", alt: "小白AI Cursor教程" }],
  },
}

export default function CursorTopicPage() {
  return (
    <SeoTopicPage
      eyebrow="Cursor Guide"
      title="Cursor怎么用：AI编程、Next.js项目和安全改代码方法"
      description="Cursor 是基于编辑器的 AI 编程工具，适合项目级问答、代码生成、重构建议和调试辅助。这个专题重点讲怎么让 Cursor 更稳，尤其是做 Next.js、React 和前端项目时如何避免乱改样式。"
      primaryHref="/tools/AI%E7%BC%96%E7%A8%8B/cursor"
      primaryLabel="查看 Cursor 工具详情"
      toolRefs={[
        { id: "cursor", note: "Cursor 适合在编辑器里理解代码库、生成代码、解释文件和做项目级对话。" },
        { id: "codex", note: "Codex 更适合任务型工程 Agent，能围绕目标读写文件和执行命令。" },
        { id: "claude-code", note: "Claude Code 更偏终端工作流，适合命令行开发者。" },
        { id: "github-copilot", note: "GitHub Copilot 适合稳定补全和 IDE 集成。" },
        { id: "deepseek", note: "DeepSeek 可辅助解释报错、写脚本、做代码推理和方案分析。" },
      ]}
      sections={[
        {
          title: "Cursor适合做什么",
          body: "Cursor 的优势是把 AI 对话放进编辑器，方便围绕项目上下文进行修改。",
          bullets: ["解释陌生代码、查找 bug、生成局部代码。", "改 Next.js、React、Python、后端接口等项目。", "根据选中文件生成测试、注释和重构建议。"],
        },
        {
          title: "怎么避免改坏样式",
          body: "Cursor 很勤快，但如果不给边界，可能会顺手动无关文件。",
          bullets: ["明确指定只改哪些文件。", "要求先列计划，不要直接改。", "每次只做一个小需求，改完读 diff。"],
        },
        {
          title: "推荐提示词习惯",
          body: "好的提示词不是夸 AI 专业，而是给边界、验收标准和禁止事项。",
          bullets: ["不要重构无关代码。", "保留现有 UI 风格和组件结构。", "输出修改说明和手动验证步骤。"],
        },
      ]}
      faq={[
        { question: "Cursor适合新手吗？", answer: "适合有一点代码基础的新手。完全零基础也能用，但更建议先从解释代码、局部修改和小项目开始。" },
        { question: "Cursor和Codex怎么选？", answer: "Cursor 更适合编辑器内日常开发，Codex 更适合让 AI 接一个工程任务并执行多步修改。" },
        { question: "Cursor改坏项目怎么办？", answer: "先用 Git 保留版本，改坏可以回滚。之后缩小文件范围、拆小任务，并要求 AI 先给计划。" },
      ]}
      related={[
        { href: "/tools/AI%E7%BC%96%E7%A8%8B/cursor", label: "Cursor工具详情" },
        { href: "/ai-coding", label: "AI编程工具推荐" },
        { href: "/codex", label: "Codex国内使用" },
        { href: "/community/post-19", label: "Cursor问题求助帖" },
      ]}
    />
  )
}
