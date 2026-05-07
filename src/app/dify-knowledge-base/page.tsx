import type { Metadata } from "next"
import { SeoTopicPage } from "@/components/SeoTopicPage"

export const metadata: Metadata = {
  title: "Dify知识库怎么搭建 - Dify RAG、文档上传、召回设置和答非所问解决",
  description:
    "小白AI整理 Dify 知识库搭建教程，覆盖文档清洗、分段、Top K、相似度阈值、RAG提示词、DeepSeek接入、知识库答非所问和AI客服上线流程。",
  keywords: ["Dify知识库", "Dify RAG", "Dify教程", "Dify答非所问", "Dify AI客服", "Dify接入DeepSeek", "知识库问答"],
  alternates: { canonical: "/dify-knowledge-base" },
  openGraph: {
    title: "Dify知识库怎么搭建 | 小白AI",
    description: "Dify RAG、文档上传、召回设置和答非所问解决方法。",
    url: "/dify-knowledge-base",
    images: [{ url: "/xiaobai-mascot-cutout.png", alt: "小白AI Dify知识库教程" }],
  },
}

export default function DifyKnowledgeBaseTopicPage() {
  return (
    <SeoTopicPage
      eyebrow="Dify Knowledge Base"
      title="Dify知识库怎么搭建：RAG、文档上传、召回设置和答非所问解决"
      description="Dify 知识库不是把 PDF 上传完就结束。真正影响效果的是资料质量、分段方式、检索参数、提示词边界和测试问题。这个教程帮你从第一个公司资料问答助手开始，搭出能用的知识库。"
      primaryHref="/tools/Agent%E5%B9%B3%E5%8F%B0/dify"
      primaryLabel="查看Dify工具详情"
      toolRefs={[
        { id: "dify", note: "Dify 适合零代码搭建知识库问答、AI客服、内部资料助手和工作流应用。" },
        { id: "deepseek", note: "DeepSeek 可作为 Dify 的高性价比中文模型，适合客服和知识库问答。" },
        { id: "kimi", note: "Kimi 适合先清洗、总结和重写长文档，再导入 Dify 知识库。" },
        { id: "coze", note: "Coze 更偏 Bot 发布和插件生态，适合轻量智能体和多渠道入口。" },
        { id: "n8n-ai-agent", note: "n8n 可以把 Dify 问答结果接入表格、企业微信、飞书和审批流程。" },
      ]}
      sections={[
        {
          title: "先清洗文档",
          body: "知识库效果差，很多时候不是模型问题，是资料本身太乱。",
          bullets: ["删除页眉页脚、目录乱码、重复声明和无关附件。", "把扫描版 PDF 先 OCR，再检查错字和表格残留。", "一份文档只保留一个主题，避免大杂烩。"],
        },
        {
          title: "召回参数怎么调",
          body: "Top K、相似度阈值和分段长度决定模型能看到什么资料。",
          bullets: ["回答漏信息：适当提高 Top K 或优化分段。", "答非所问：提高相似度阈值，减少无关片段。", "长答案不准：让提示词要求引用资料，不知道就说不知道。"],
        },
        {
          title: "上线前怎么测试",
          body: "不要只问一两个简单问题就上线。",
          bullets: ["准备 20 个真实用户问题，覆盖价格、流程、限制和异常。", "加入找不到答案的问题，测试它会不会乱编。", "把错误答案整理回来，继续清洗资料和调参数。"],
        },
      ]}
      faq={[
        { question: "Dify知识库答非所问怎么办？", answer: "先检查文档分段和召回片段。如果召回内容本身不相关，调 Top K、相似度阈值和分段；如果召回正确但回答乱编，优化提示词边界。" },
        { question: "Dify知识库适合上传什么资料？", answer: "适合上传 FAQ、产品手册、售后政策、课程资料、公司制度和流程文档。越结构化、越干净，效果越好。" },
        { question: "Dify可以接DeepSeek吗？", answer: "可以。一般通过 OpenAI Compatible 或自定义供应商配置 DeepSeek API Key、base_url 和模型名。" },
      ]}
      related={[
        { href: "/dify", label: "Dify完整教程" },
        { href: "/deepseek-api-key", label: "DeepSeek API Key申请" },
        { href: "/ai-office-tools", label: "AI办公工具推荐" },
        { href: "/workflows", label: "AI工作流自动化" },
      ]}
    />
  )
}
