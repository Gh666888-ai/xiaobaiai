import type { Metadata } from "next"
import { SeoTopicPage } from "@/components/SeoTopicPage"

export const metadata: Metadata = {
  title: "AI写作工具推荐 - AI文案、公众号、小红书、论文润色和SEO写作工具",
  description:
    "小白AI整理AI写作工具推荐，覆盖 Kimi、ChatGPT、DeepSeek、Notion AI、Jasper、Copy.ai、Writesonic 等AI文案工具，适合文章、公众号、小红书、SEO和论文润色。",
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
      title="AI写作工具推荐：AI文案、公众号、小红书、论文润色和SEO写作工具"
      description="AI写作的关键不是让模型一次写完，而是把选题、提纲、初稿、润色、标题和发布格式拆开处理。这个专题按内容场景推荐工具，帮你把 AI 变成稳定的写作流程。"
      primaryHref="/tools/AI%E5%86%99%E4%BD%9C"
      primaryLabel="查看AI写作工具"
      toolRefs={[
        { id: "kimi", note: "Kimi 适合长文档总结、资料整理、提纲生成和中文内容润色。" },
        { id: "chatgpt", note: "ChatGPT 适合创意发散、风格改写、内容结构化和多轮打磨。" },
        { id: "deepseek", note: "DeepSeek 适合中文问答、逻辑梳理、低成本批量生成和代码类内容。" },
        { id: "notion-ai", note: "Notion AI 适合在笔记和知识库里做总结、改写、会议纪要和团队协作。" },
        { id: "jasper", note: "Jasper 更偏营销写作，适合品牌声音、广告文案和海外内容团队。" },
        { id: "copyai", note: "Copy.ai 适合广告语、销售邮件、产品描述和营销模板化内容。" },
        { id: "writesonic", note: "Writesonic 适合博客、SEO文章、落地页和电商内容批量生产。" },
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
          bullets: ["长文档和资料总结：Kimi、ChatGPT。", "营销文案和广告：Jasper、Copy.ai、Writesonic。", "日常中文草稿：DeepSeek、豆包、通义千问。"],
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
