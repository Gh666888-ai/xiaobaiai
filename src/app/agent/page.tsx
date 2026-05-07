import type { Metadata } from "next"
import { SeoTopicPage } from "@/components/SeoTopicPage"

export const metadata: Metadata = {
  title: "Agent教程 - AI Agent是什么、怎么搭建、Dify/Coze/n8n工具推荐",
  description: "小白AI整理 Agent 教程，解释 AI Agent 是什么、普通AI聊天和Agent的区别、零代码搭建客服和自动化工作流的方法，以及 Dify、Coze、n8n、OpenAI Codex 等工具推荐。",
  keywords: ["Agent教程", "AI Agent", "Agent是什么", "Dify教程", "Coze教程", "n8n AI", "AI工作流", "智能体搭建"],
  alternates: { canonical: "/agent" },
  openGraph: {
    title: "Agent教程 | 小白AI",
    description: "AI Agent 是什么、怎么搭建、Dify/Coze/n8n 工具推荐。",
    url: "/agent",
    images: [{ url: "/xiaobai-mascot-cutout.png", alt: "小白AI Agent教程" }],
  },
}

export default function AgentTopicPage() {
  return (
    <SeoTopicPage
      eyebrow="Agent Guide"
      title="Agent教程：AI Agent是什么、怎么搭建、用什么工具"
      description="Agent 可以理解为会调用工具、能按步骤完成任务的 AI 助手。这个专题从零解释 Agent 是什么，适合做哪些自动化任务，以及新手应该从 Dify、Coze、n8n 还是 Codex 开始。"
      primaryHref="/learn/2"
      primaryLabel="从Agent学习路径开始"
      toolRefs={[
        { id: "dify", note: "Dify 适合零代码搭建知识库问答、AI客服和可视化工作流。" },
        { id: "coze", note: "Coze 适合创建智能体并发布到网页、飞书、微信生态等渠道。" },
        { id: "n8n-ai-agent", note: "n8n 适合把邮件、表格、飞书、网页和 AI 串成自动化流程。" },
        { id: "codex", note: "Codex 是面向编程项目的 AI Agent，适合读写代码和调试。" },
        { id: "deepseek", note: "DeepSeek 可作为 Agent 的低成本模型底座，适合中文任务和代码推理。" },
      ]}
      sections={[
        {
          title: "Agent是什么",
          body: "普通 AI 是你问它答；Agent 是你交代目标，它按步骤调用工具完成任务。",
          bullets: ["AI大脑：理解任务和规划步骤。", "工具调用：搜索、读文件、查数据库、发消息。", "记忆和流程：把多步任务串起来并可重复执行。"],
        },
        {
          title: "新手先做什么Agent",
          body: "不要一上来做全自动公司大脑，先做低风险、高频率的小任务。",
          bullets: ["资料问答助手：把 FAQ、文档、教程放进知识库。", "日报/早报助手：定时抓信息、总结、推送。", "客服草稿助手：先生成回复，人确认后再发送。"],
        },
        {
          title: "Agent安全边界",
          body: "Agent 能力越强，越需要边界。涉及钱、合同、客户承诺和删除文件的动作都要谨慎。",
          bullets: ["重要操作先人工确认。", "API Key 设置限额，不要明文提交。", "让 Agent 留日志，方便排查错误。"],
        },
      ]}
      faq={[
        { question: "AI Agent和ChatGPT有什么区别？", answer: "ChatGPT 更偏对话和回答，Agent 更强调目标、工具调用和多步骤执行。可以把 Agent 理解为带工具箱的 AI 助手。" },
        { question: "新手用Dify还是Coze？", answer: "做知识库问答和工作流优先 Dify；想快速发布智能体到渠道优先 Coze。两个都适合零代码入门。" },
        { question: "Agent可以全自动吗？", answer: "可以，但不建议一开始就全自动。先做半自动，人确认关键步骤，跑稳后再逐步放开。" },
      ]}
      related={[
        { href: "/learn/2", label: "安装主流Agent" },
        { href: "/workflows", label: "工作流自动化" },
        { href: "/tools/Agent%E5%B9%B3%E5%8F%B0", label: "Agent平台工具" },
        { href: "/community", label: "Agent实战社区" },
      ]}
    />
  )
}
