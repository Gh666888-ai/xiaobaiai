import type { Metadata } from "next"
import { SeoTopicPage } from "@/components/SeoTopicPage"

export const metadata: Metadata = {
  title: "AI PPT工具推荐 - Gamma、Microsoft Copilot、Canva、ChatGPT和PPT Master",
  description:
    "小白AI整理AI PPT工具推荐，覆盖 Gamma、Microsoft 365 Copilot、Canva AI、ChatGPT、Kimi、DeepSeek、PPT Master，讲清楚AI做PPT的流程、提示词、导出和汇报修改方法。",
  keywords: ["AI PPT工具", "AI做PPT", "AI生成PPT", "Gamma教程", "Canva AI PPT", "PPT Master", "PPT自动生成"],
  alternates: { canonical: "/ai-ppt-tools" },
  openGraph: {
    title: "AI PPT工具推荐 | 小白AI",
    description: "AI做PPT、Gamma、Microsoft Copilot、Canva、ChatGPT和PPT Master教程。",
    url: "/ai-ppt-tools",
    images: [{ url: "/xiaobai-mascot-cutout.png", alt: "小白AI AI PPT工具推荐" }],
  },
}

export default function AiPptToolsTopicPage() {
  return (
    <SeoTopicPage
      eyebrow="AI PPT Tools"
      title="AI PPT工具推荐：Gamma、Microsoft Copilot、Canva、ChatGPT和PPT Master"
      description="AI做PPT最适合先生成结构和初稿，再由人补数据、案例和风格。这个专题帮你选工具、写提示词、整理大纲，并把 AI 生成的内容改成真正能汇报的版本。"
      primaryHref="/tools/AI%E5%8A%9E%E5%85%AC/gamma"
      primaryLabel="查看Gamma工具详情"
      toolRefs={[
        { id: "gamma", note: "Gamma 适合输入主题或大纲后快速生成演示文稿，是新手做 AI PPT 的常用选择。" },
        { id: "microsoft-copilot", note: "Microsoft 365 Copilot 适合在 PowerPoint、Word、Excel 和 Teams 资料里直接生成企业汇报。" },
        { id: "canva-ai", note: "Canva AI 适合模板化设计、视觉排版、封面和社媒风格的演示内容。" },
        { id: "ppt-master", note: "PPT Master 偏可编辑 PPTX 生成，适合想要原生 PowerPoint 文件的用户。" },
        { id: "chatgpt", note: "ChatGPT 适合把复杂主题拆成汇报结构、演讲稿和图表说明。" },
        { id: "kimi", note: "Kimi 适合先读资料、提炼大纲、总结报告和生成PPT内容框架。" },
        { id: "deepseek", note: "DeepSeek 适合低成本生成中文提纲、页面文案、汇报逻辑和问答准备。" },
      ]}
      sections={[
        {
          title: "AI做PPT正确流程",
          body: "不要一上来让工具直接生成最终版。",
          bullets: ["先把主题、听众、页数、汇报目标说清楚。", "先生成大纲，确认逻辑后再生成页面。", "最后人工补数据、截图、案例和公司视觉规范。"],
        },
        {
          title: "提示词模板",
          body: "给AI的信息越像真实需求，输出越像能用的PPT。",
          bullets: ["我要做一份给谁看的PPT，目标是什么。", "请生成几页，每页标题、要点、图表建议和演讲备注。", "风格要求：正式、简洁、适合老板/客户/课堂展示。"],
        },
        {
          title: "怎么改得像专业汇报",
          body: "AI生成的PPT常见问题是空泛、数据少、页面节奏平。",
          bullets: ["每页只保留一个核心观点。", "把空话换成数据、案例、截图或流程图。", "统一标题结构、字体层级、配色和图标风格。"],
        },
      ]}
      faq={[
        { question: "AI PPT工具哪个最好用？", answer: "新手优先试 Gamma，生成速度快、结构清楚。已经在微软办公生态里，就试 Microsoft 365 Copilot；需要设计模板用 Canva AI；需要原生可编辑 PPTX 可以试 PPT Master。" },
        { question: "AI生成的PPT能直接汇报吗？", answer: "不建议直接汇报。它适合做初稿，正式汇报前要补充真实数据、公司案例、图表和人工判断。" },
        { question: "AI做PPT提示词怎么写？", answer: "写清楚主题、听众、页数、目标、风格、必须包含的内容和输出格式。最好先要大纲，再生成页面文案。" },
      ]}
      related={[
        { href: "/tools/AI%E5%8A%9E%E5%85%AC/gamma", label: "Gamma工具详情" },
        { href: "/ai-office-tools", label: "AI办公工具推荐" },
        { href: "/ai-writing-tools", label: "AI写作工具推荐" },
        { href: "/learn/1", label: "AI工具入门教程" },
      ]}
    />
  )
}
