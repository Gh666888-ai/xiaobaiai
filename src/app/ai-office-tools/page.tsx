import type { Metadata } from "next"
import { SeoTopicPage } from "@/components/SeoTopicPage"

export const metadata: Metadata = {
  title: "AI办公工具推荐 - AI做PPT、文档总结、会议纪要、表格分析和自动化办公",
  description:
    "小白AI整理AI办公工具推荐，覆盖 Gamma、Canva AI、Kimi、Notion AI、DeepSeek、Dify、n8n 和 AI表格工具，适合PPT、会议纪要、文档总结和自动化办公。",
  keywords: ["AI办公工具", "AI做PPT", "AI会议纪要", "AI文档总结", "AI表格分析", "AI办公效率", "自动化办公"],
  alternates: { canonical: "/ai-office-tools" },
  openGraph: {
    title: "AI办公工具推荐 | 小白AI",
    description: "AI做PPT、文档总结、会议纪要、表格分析和自动化办公整理。",
    url: "/ai-office-tools",
    images: [{ url: "/xiaobai-mascot-cutout.png", alt: "小白AI AI办公工具推荐" }],
  },
}

export default function AiOfficeToolsTopicPage() {
  return (
    <SeoTopicPage
      eyebrow="AI Office Tools"
      title="AI办公工具推荐：AI做PPT、文档总结、会议纪要、表格分析和自动化办公"
      description="AI办公最容易产生真实价值：少写重复文档、少整理会议记录、少手动做表格、少从零开始做PPT。这个专题按办公任务拆解工具，让你先从每天都用得上的场景开始。"
      primaryHref="/tools/AI%E5%8A%9E%E5%85%AC"
      primaryLabel="查看AI办公工具"
      toolRefs={[
        { id: "gamma", note: "Gamma 适合从主题或大纲生成 PPT、文档和汇报页面，适合快速出草稿。" },
        { id: "canva-ai", note: "Canva AI 适合做海报、演示、社媒图和模板化办公设计。" },
        { id: "kimi", note: "Kimi 适合长文档、PDF、会议资料和合同的总结提炼。" },
        { id: "deepseek", note: "DeepSeek 适合写周报、日报、流程说明、邮件回复和数据解释。" },
        { id: "notion-ai", note: "Notion AI 适合团队知识库、会议纪要、任务归档和文档协作。" },
        { id: "dify", note: "Dify 适合把公司资料做成知识库问答、AI客服或内部办公助手。" },
        { id: "n8n-ai-agent", note: "n8n AI 适合把表格、邮件、飞书、企业微信和 AI 串成自动化流程。" },
      ]}
      sections={[
        {
          title: "先从高频工作开始",
          body: "AI办公不是炫技，先找每天重复的事。",
          bullets: ["会议纪要：录音或文字记录转要点、行动项和负责人。", "文档总结：PDF、合同、方案、竞品资料快速提炼。", "PPT草稿：先让AI生成结构，再人工补数据和视觉。"],
        },
        {
          title: "办公自动化路线",
          body: "当单个工具跑通后，再考虑工作流自动化。",
          bullets: ["先用 DeepSeek 或 Kimi 把内容处理好。", "再用 Dify 做固定问答或文档助手。", "最后用 n8n 串飞书、企业微信、表格和邮件。"],
        },
        {
          title: "企业使用注意",
          body: "办公场景常常涉及客户、员工和公司资料。",
          bullets: ["上传前脱敏客户姓名、手机号、合同金额等敏感信息。", "重要结论要人工复核，尤其是财务、法务和人事内容。", "团队使用前统一账号、权限和资料存储规则。"],
        },
      ]}
      faq={[
        { question: "AI办公工具最先学哪个？", answer: "先学 Kimi 或 DeepSeek 做总结和写作，再学 Gamma 做PPT。如果有公司资料问答需求，再上 Dify。" },
        { question: "AI能做完整PPT吗？", answer: "可以生成初稿，但正式汇报还需要人工补充数据、案例、图表和公司口径。AI更适合把从0到1的结构搭起来。" },
        { question: "办公资料能直接上传AI吗？", answer: "不建议直接上传敏感资料。先脱敏，或使用企业版、私有化、本地模型等更可控方案。" },
      ]}
      related={[
        { href: "/ai-ppt-tools", label: "AI PPT工具推荐" },
        { href: "/ai-writing-tools", label: "AI写作工具推荐" },
        { href: "/dify", label: "Dify知识库教程" },
        { href: "/workflows", label: "AI工作流自动化" },
      ]}
    />
  )
}
