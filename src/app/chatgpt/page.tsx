import type { Metadata } from "next"
import { SeoTopicPage } from "@/components/SeoTopicPage"

export const metadata: Metadata = {
  title: "ChatGPT怎么用 - ChatGPT国内使用、免费版、提示词和替代工具",
  description: "小白AI整理 ChatGPT 怎么用、国内使用注意事项、免费版和付费版区别、提示词技巧、文件分析、多模态能力，以及 DeepSeek、Kimi、Claude 等替代工具。",
  keywords: ["ChatGPT怎么用", "ChatGPT国内使用", "ChatGPT免费版", "ChatGPT提示词", "ChatGPT替代品", "AI聊天工具"],
  alternates: { canonical: "/chatgpt" },
  openGraph: {
    title: "ChatGPT怎么用 | 小白AI",
    description: "ChatGPT 国内使用、免费版、提示词技巧和替代工具整理。",
    url: "/chatgpt",
    images: [{ url: "/xiaobai-mascot-cutout.png", alt: "小白AI ChatGPT教程" }],
  },
}

export default function ChatGptTopicPage() {
  return (
    <SeoTopicPage
      eyebrow="ChatGPT Guide"
      title="ChatGPT怎么用：国内使用、免费版、提示词和替代工具"
      description="ChatGPT 是很多人第一次接触 AI 的入口，适合写作、翻译、总结、图片理解、文件分析和复杂任务规划。这个专题帮新手搞清楚 ChatGPT 怎么开始、怎么提问、什么时候该换 DeepSeek、Kimi 或 Claude。"
      primaryHref="/tools/%E5%AF%B9%E8%AF%9DAI/chatgpt"
      primaryLabel="查看 ChatGPT 工具详情"
      toolRefs={[
        { id: "chatgpt", note: "ChatGPT 综合能力强，适合对话、写作、多模态、文件分析和复杂 Agent 任务。" },
        { id: "deepseek", note: "DeepSeek 更适合低成本中文任务、代码解释、推理分析和 API 接入。" },
        { id: "kimi", note: "Kimi 更适合长文档、PDF、合同、论文和资料总结。" },
        { id: "claude", note: "Claude 适合长文写作、逻辑推理、代码理解和安全性要求高的任务。" },
        { id: "tongyi", note: "通义千问适合国内用户、中文办公和阿里云生态。" },
      ]}
      sections={[
        {
          title: "ChatGPT适合做什么",
          body: "ChatGPT 的优势是通用能力和生态丰富，新手可以先从日常任务开始。",
          bullets: ["写文案、改写、翻译、总结和头脑风暴。", "分析图片、文件、表格和长对话。", "规划复杂任务，例如学习路线、项目方案和工作流。"],
        },
        {
          title: "怎么提问更有效",
          body: "很多人觉得 ChatGPT 不好用，往往是因为问题太短、背景太少、格式不清楚。",
          bullets: ["说清楚背景：你是谁、要给谁看、用在哪里。", "说清楚结果：字数、格式、语气、结构。", "让它先提问或先列计划，再正式输出。"],
        },
        {
          title: "国内使用注意",
          body: "ChatGPT 通常涉及账号、网络、支付和隐私问题，正式使用前要准备备用方案。",
          bullets: ["重要资料不要直接上传，先脱敏。", "如果网络或账号不稳定，可用 DeepSeek、Kimi、通义千问作为替代。", "涉及事实、法律、医疗、财务的内容必须人工核对。"],
        },
      ]}
      faq={[
        { question: "ChatGPT免费版够用吗？", answer: "日常聊天、写作和简单总结通常够用。复杂多模态、文件分析、Agent 和高频使用可能需要付费能力，具体以官方策略为准。" },
        { question: "ChatGPT国内用不了怎么办？", answer: "可以先用 DeepSeek、Kimi、通义千问、豆包等国内可访问工具完成大部分中文任务，再根据需求决定是否准备 ChatGPT。" },
        { question: "ChatGPT和DeepSeek怎么选？", answer: "综合能力和国际生态优先 ChatGPT；低成本中文推理、代码解释和 API 性价比优先 DeepSeek。" },
      ]}
      related={[
        { href: "/tools/%E5%AF%B9%E8%AF%9DAI/chatgpt", label: "ChatGPT工具详情" },
        { href: "/deepseek", label: "DeepSeek怎么用" },
        { href: "/learn/1", label: "AI工具入门" },
        { href: "/ai-tools", label: "AI工具大全" },
      ]}
    />
  )
}
