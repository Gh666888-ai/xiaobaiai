import type { Metadata } from "next"
import { SeoTopicPage } from "@/components/SeoTopicPage"

export const metadata: Metadata = {
  title: "Gamma怎么做PPT - Gamma AI PPT生成、中文提示词、导出和修改教程",
  description:
    "小白AI整理 Gamma 做PPT教程，讲清楚如何用中文主题生成大纲、确认页面结构、导出 PDF/PPT、修改模板、搭配 Kimi/ChatGPT/DeepSeek 做汇报内容。",
  keywords: ["Gamma怎么做PPT", "Gamma教程", "AI做PPT", "AI PPT生成", "Gamma中文提示词", "Gamma导出PPT", "AI汇报PPT"],
  alternates: { canonical: "/gamma-ppt" },
  openGraph: {
    title: "Gamma怎么做PPT | 小白AI",
    description: "Gamma AI PPT生成、中文提示词、导出和修改教程。",
    url: "/gamma-ppt",
    images: [{ url: "/xiaobai-mascot-cutout.png", alt: "小白AI Gamma PPT教程" }],
  },
}

export default function GammaPptTopicPage() {
  return (
    <SeoTopicPage
      eyebrow="Gamma PPT"
      title="Gamma怎么做PPT：AI PPT生成、中文提示词、导出和修改教程"
      description="Gamma 适合快速从 0 生成 PPT 初稿，但要变成能汇报的版本，需要先写好主题、听众、页数和目标，再人工补充数据、案例和公司口径。这个教程帮你把 Gamma 用成高效的PPT起草工具。"
      primaryHref="/tools/AI%E5%8A%9E%E5%85%AC/gamma"
      primaryLabel="查看Gamma工具详情"
      toolRefs={[
        { id: "gamma", note: "Gamma 适合输入主题或大纲后快速生成 PPT、文档和网页式汇报。" },
        { id: "kimi", note: "Kimi 适合先阅读资料、提炼汇报大纲和整理页面内容。" },
        { id: "chatgpt", note: "ChatGPT 适合优化汇报逻辑、演讲稿、标题和图表说明。" },
        { id: "deepseek", note: "DeepSeek 适合低成本生成中文大纲、页面要点和答辩问题。" },
        { id: "canva-ai", note: "Canva AI 适合后续美化封面、海报化页面和视觉模板。" },
        { id: "ppt-master", note: "PPT Master 适合需要原生可编辑 PPTX 的用户作为补充选择。" },
      ]}
      sections={[
        {
          title: "第一步先生成大纲",
          body: "不要直接让 Gamma 一键生成最终版。",
          bullets: ["写清楚主题、听众、页数、汇报时长和目标。", "先确认大纲逻辑，再进入页面生成。", "缺少数据的页面先留占位，不要让AI乱编。"],
        },
        {
          title: "中文提示词模板",
          body: "Gamma 可以吃中文，但需求要写具体。",
          bullets: ["我要做一份面向老板的10页汇报PPT，主题是……", "每页包含标题、3个要点、图表建议和演讲备注。", "风格正式、简洁、适合商务汇报，不要夸张营销语言。"],
        },
        {
          title: "导出后怎么改",
          body: "AI PPT 的初稿价值在结构，正式版还要人工精修。",
          bullets: ["替换成真实数据、公司截图和案例。", "统一标题长度、字体层级和颜色。", "删掉空泛页面，每页只保留一个核心观点。"],
        },
      ]}
      faq={[
        { question: "Gamma可以用中文做PPT吗？", answer: "可以。用中文输入主题、大纲和风格要求即可。如果界面是英文，可以用浏览器翻译辅助操作。" },
        { question: "Gamma免费版够用吗？", answer: "学习和少量PPT草稿通常够用。高频生成、团队协作或更高级导出可能需要付费额度，以官方当前规则为准。" },
        { question: "Gamma生成的PPT能直接交吗？", answer: "不建议。它适合做初稿，正式交付前要补数据、案例、图表和人工判断。" },
      ]}
      related={[
        { href: "/ai-ppt-tools", label: "AI PPT工具推荐" },
        { href: "/ai-office-tools", label: "AI办公工具推荐" },
        { href: "/tools/AI%E5%8A%9E%E5%85%AC/gamma", label: "Gamma工具详情" },
        { href: "/learn/1", label: "AI工具入门教程" },
      ]}
    />
  )
}
