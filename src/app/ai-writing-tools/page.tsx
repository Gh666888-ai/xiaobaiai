import type { Metadata } from "next"
import { SeoTopicPage } from "@/components/SeoTopicPage"

export const metadata: Metadata = {
  title: "AI写作工具推荐 - ChatGPT、DeepSeek、Kimi、豆包、Claude和Gemini",
  description:
    "小白AI整理2026主流AI写作工具推荐，覆盖 ChatGPT、DeepSeek、Kimi、豆包、Claude、Gemini、元宝、Notion AI、Jasper、Copy.ai、Writesonic 等AI文案和内容工具。",
  keywords: ["AI写作工具", "AI文案工具", "AI写文章", "小红书AI文案", "公众号AI写作", "AI论文润色", "AI SEO写作"],
  alternates: { canonical: "/ai-writing-tools" },
  openGraph: {
    title: "AI写作工具推荐 | 小白AI",
    description: "AI文案、公众号、小红书、论文润色和SEO写作工具整理。",
    url: "/ai-writing-tools",
    images: [{ url: "/xiaobai-mascot-cutout.png", alt: "小白AI AI写作工具推荐" }],
  },
}

export default function AiWritingToolsTopicPage() {
  return (
    <SeoTopicPage
      eyebrow="AI Writing Tools"
      title="AI写作工具推荐：ChatGPT、DeepSeek、Kimi、豆包、Claude和Gemini"
      description="AI写作的关键不是让模型一次写完，而是把选题、提纲、初稿、润色、标题和发布格式拆开处理。这个专题按内容场景推荐工具，帮你把 AI 变成稳定的写作流程。"
      primaryHref="/tools/AI%E5%86%99%E4%BD%9C"
      primaryLabel="查看AI写作工具"
      toolRefs={[
        { id: "chatgpt", note: "ChatGPT 适合创意发散、风格改写、内容结构化和多轮打磨。" },
        { id: "deepseek", note: "DeepSeek 适合中文逻辑梳理、低成本批量草稿、代码类内容和长问答。" },
        { id: "kimi", note: "Kimi 适合长文档总结、资料整理、提纲生成和中文内容润色。" },
        { id: "doubao", note: "豆包适合大众内容创作、短文案、口播脚本、语音输入和国内多端使用。" },
        { id: "claude", note: "Claude 适合长文、深度改稿、语气控制、英文写作和复杂材料整理。" },
        { id: "gemini", note: "Gemini 适合多模态素材理解、Google生态资料整理和长上下文写作。" },
        { id: "yuanbao", note: "元宝适合微信生态用户做中文问答、文档处理、公众号和日常内容草稿。" },
        { id: "notion-ai", note: "Notion AI 适合在笔记和知识库里做总结、改写、会议纪要和团队协作。" },
        { id: "jasper", note: "Jasper、Copy.ai、Writesonic 更偏营销团队、SEO、落地页和品牌声音管理。" },
      ]}
      sections={[
        {
          title: "AI写作不要一键到底",
          body: "质量稳定的写作流程通常分为多步。",
          bullets: ["先让AI给选题和角度，再人工定方向。", "先产提纲，再写初稿，不要直接要完整文章。", "最后单独做标题、摘要、金句和发布格式。"],
        },
        {
          title: "不同内容怎么选工具",
          body: "写作工具的差别在场景，不是只看模型强弱。",
          bullets: ["日常中文草稿：DeepSeek、豆包、元宝、通义千问。", "长文档和资料总结：Kimi、Claude、Gemini、ChatGPT。", "创意写作和改稿：ChatGPT、Claude。", "营销文案和SEO：Jasper、Copy.ai、Writesonic。"],
        },
        {
          title: "降低AI味",
          body: "很多AI文案的问题是太顺、太泛、太像模板。",
          bullets: ["加入真实经历、数据、案例和限制条件。", "要求它写得更具体，不要堆形容词。", "发布前人工删掉空话和重复句。"],
        },
      ]}
      faq={[
        { question: "AI写作工具能直接写公众号吗？", answer: "可以写初稿，但最好拆成选题、提纲、正文、标题和排版建议几步。公众号文章尤其需要真实案例和人工观点。" },
        { question: "小红书AI文案怎么写？", answer: "先给产品、人群、场景、痛点和真实体验，再让AI生成多个标题和正文版本。最后人工调整口吻，避免过度营销。" },
        { question: "AI写作会不会重复或侵权？", answer: "有风险。重要内容要查重、核事实，不要让AI仿写具体作者风格，也不要直接复制未确认来源的内容。" },
      ]}
      related={[
        { href: "/tools/AI%E5%86%99%E4%BD%9C/notion-ai", label: "Notion AI工具详情" },
        { href: "/chatgpt", label: "ChatGPT写作方法" },
        { href: "/deepseek", label: "DeepSeek怎么用" },
        { href: "/ai-office-tools", label: "AI办公工具推荐" },
      ]}
    />
  )
}
