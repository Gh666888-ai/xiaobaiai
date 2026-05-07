import type { Metadata } from "next"
import { SeoTopicPage } from "@/components/SeoTopicPage"

export const metadata: Metadata = {
  title: "DeepSeek怎么用 - DeepSeek教程、API接入、免费使用和替代工具",
  description: "小白AI整理 DeepSeek 怎么用、DeepSeek API 怎么接入、适合写代码吗、免费情况、常见替代品和新手学习路径，适合零基础用户快速上手 DeepSeek。",
  keywords: ["DeepSeek怎么用", "DeepSeek教程", "DeepSeek API", "DeepSeek免费", "DeepSeek写代码", "DeepSeek替代品"],
  alternates: { canonical: "/deepseek" },
  openGraph: {
    title: "DeepSeek怎么用 | 小白AI",
    description: "DeepSeek 教程、API 接入、免费使用、写代码和替代工具整理。",
    url: "/deepseek",
    images: [{ url: "/xiaobai-mascot-cutout.png", alt: "小白AI DeepSeek教程" }],
  },
}

export default function DeepSeekTopicPage() {
  return (
    <SeoTopicPage
      eyebrow="DeepSeek Guide"
      title="DeepSeek怎么用：免费使用、API接入、写代码和替代工具"
      description="DeepSeek 是目前中文用户最容易上手的大模型之一，适合日常问答、代码生成、推理分析、资料总结和低成本 API 接入。这个专题把 DeepSeek 新手最关心的问题放在一起。"
      primaryHref="/tools/%E5%AF%B9%E8%AF%9DAI/deepseek"
      primaryLabel="查看 DeepSeek 工具详情"
      toolRefs={[
        { id: "deepseek", note: "DeepSeek 网页版适合直接聊天、写代码、做推理分析；API 价格低，适合接入应用和工作流。" },
        { id: "kimi", note: "Kimi 更适合长文档、PDF、合同、论文和资料包分析，可作为 DeepSeek 的中文长文本补充。" },
        { id: "chatgpt", note: "ChatGPT 综合能力强，适合复杂 Agent、多模态和国际工具生态。" },
        { id: "tongyi", note: "通义千问适合国内用户、阿里云生态和中文办公场景。" },
        { id: "dify", note: "Dify 可把 DeepSeek 接入知识库问答、AI客服和可视化工作流。" },
      ]}
      sections={[
        {
          title: "DeepSeek适合做什么",
          body: "DeepSeek 适合低成本、高频率的中文 AI 任务，尤其是代码、推理、资料分析和 API 接入。",
          bullets: ["日常问答、写作、翻译、总结和改写。", "代码生成、Bug分析、SQL解释和脚本辅助。", "接入 Dify、Chatbox、Cherry Studio 或自己的应用。"],
        },
        {
          title: "新手怎么开始",
          body: "先从网页版体验，不要一上来就接 API。确认回答风格和任务效果后，再考虑接入工具。",
          bullets: ["打开 DeepSeek 网页版，先用真实小任务测试。", "保存常用提示词，例如写周报、改代码、总结文档。", "需要自动化时，再学习 API Key 和模型配置。"],
        },
        {
          title: "什么时候不用DeepSeek",
          body: "DeepSeek 性价比高，但不是所有任务都最优。",
          bullets: ["超长文档阅读可以优先 Kimi。", "多模态和复杂 Agent 可以比较 ChatGPT。", "正式业务输出仍需要人工审核事实和风险。"],
        },
      ]}
      faq={[
        { question: "DeepSeek免费吗？", answer: "DeepSeek 网页版适合免费体验，API 通常按量计费但成本较低。具体额度和价格建议以官方页面为准。" },
        { question: "DeepSeek适合写代码吗？", answer: "适合。它可以生成代码、解释报错、辅助 SQL 和脚本编写，但上线前必须人工审查并用 Git 保留版本。" },
        { question: "DeepSeek API怎么接入？", answer: "一般流程是注册开发者账号、创建 API Key、在 Dify/Chatbox/Cherry Studio 或代码里填写 base_url 和模型名，再用小任务测试。" },
      ]}
      related={[
        { href: "/tools/%E5%AF%B9%E8%AF%9DAI/deepseek", label: "DeepSeek工具详情" },
        { href: "/news?category=教程资源", label: "DeepSeek相关教程" },
        { href: "/learn/1", label: "AI工具入门" },
        { href: "/agent", label: "Agent教程" },
      ]}
    />
  )
}
