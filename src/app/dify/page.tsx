import type { Metadata } from "next"
import { SeoTopicPage } from "@/components/SeoTopicPage"

export const metadata: Metadata = {
  title: "Dify教程 - Dify知识库、AI客服、工作流和DeepSeek接入指南",
  description: "小白AI整理 Dify 教程，包含 Dify 怎么搭建 AI 客服、知识库答非所问怎么办、RAG 设置、工作流入门、DeepSeek 接入和 Coze/n8n 替代工具。",
  keywords: ["Dify教程", "Dify知识库", "Dify AI客服", "Dify工作流", "Dify DeepSeek", "RAG教程", "Dify答非所问"],
  alternates: { canonical: "/dify" },
  openGraph: {
    title: "Dify教程 | 小白AI",
    description: "Dify 知识库、AI客服、工作流和 DeepSeek 接入指南。",
    url: "/dify",
    images: [{ url: "/xiaobai-mascot-cutout.png", alt: "小白AI Dify教程" }],
  },
}

export default function DifyTopicPage() {
  return (
    <SeoTopicPage
      eyebrow="Dify Guide"
      title="Dify教程：知识库、AI客服、工作流和DeepSeek接入"
      description="Dify 是零代码搭建 AI 应用、知识库问答和工作流的常用平台。这个专题帮新手从第一个文档助手开始，逐步理解 RAG、提示词边界、模型接入和发布流程。"
      primaryHref="/tools/Agent%E5%B9%B3%E5%8F%B0/dify"
      primaryLabel="查看 Dify 工具详情"
      toolRefs={[
        { id: "dify", note: "Dify 适合搭建知识库问答、AI客服、聊天助手和可视化工作流。" },
        { id: "deepseek", note: "DeepSeek 可作为 Dify 的高性价比模型底座，适合中文客服和知识库场景。" },
        { id: "coze", note: "Coze 更偏智能体和渠道发布，适合快速做 Bot。" },
        { id: "n8n-ai-agent", note: "n8n 更偏自动化连接器，适合把 Dify 结果接入飞书、表格、邮件。" },
        { id: "kimi", note: "Kimi 可作为长文档处理补充，适合先清理和总结知识库资料。" },
      ]}
      sections={[
        {
          title: "Dify适合做什么",
          body: "Dify 最适合把已有资料变成可问答、可发布、可集成的 AI 应用。",
          bullets: ["AI客服：上传 FAQ、价格表、售后政策。", "知识库问答：让员工或用户直接问文档内容。", "工作流：把检索、模型、条件分支和外部 API 串起来。"],
        },
        {
          title: "知识库答非所问怎么办",
          body: "Dify 的效果很大程度取决于文档质量和检索配置。",
          bullets: ["先清理 PDF 页眉页脚、乱码、表格残留和重复内容。", "调整分段长度、Top K、混合检索和相似度阈值。", "提示词里写清楚：找不到就说找不到，不要编。"],
        },
        {
          title: "新手搭建顺序",
          body: "不要一开始就做复杂工作流，先跑通一个能回答文档问题的聊天助手。",
          bullets: ["创建聊天助手，配置基础提示词。", "上传 5-20 份高质量文档做知识库。", "测试 20 个真实问题，再决定是否发布。"],
        },
      ]}
      faq={[
        { question: "Dify适合零代码用户吗？", answer: "适合。Dify 的优势是可视化操作，适合不写代码的人先搭建文档助手、AI客服和简单工作流。" },
        { question: "Dify可以接DeepSeek吗？", answer: "可以。通常在模型供应商里配置 DeepSeek API Key、base_url 和模型名，再在应用里选择对应模型。" },
        { question: "Dify和Coze怎么选？", answer: "偏知识库、RAG、工作流和可控部署选 Dify；偏智能体体验、插件和渠道发布选 Coze。" },
      ]}
      related={[
        { href: "/tools/Agent%E5%B9%B3%E5%8F%B0/dify", label: "Dify工具详情" },
        { href: "/agent", label: "Agent教程" },
        { href: "/deepseek", label: "DeepSeek接入" },
        { href: "/community", label: "Dify社区求助" },
      ]}
    />
  )
}
