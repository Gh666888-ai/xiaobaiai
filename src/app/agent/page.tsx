import type { Metadata } from "next"
import { SeoTopicPage } from "@/components/SeoTopicPage"

export const metadata: Metadata = {
  title: "Agent教程 - AI Agent是什么、Manus、Dify、Coze、n8n和LangGraph怎么选",
  description: "小白AI整理 Agent 教程，解释 AI Agent 是什么、普通AI聊天和Agent的区别，以及 Manus、Dify、Coze、n8n、Zapier AI、LangGraph、OpenAI Agents SDK、Google ADK 等主流 Agent 工具怎么选。",
  keywords: ["Agent教程", "AI Agent", "Agent是什么", "Manus", "Dify教程", "Coze教程", "n8n AI", "LangGraph", "OpenAI Agents SDK", "智能体搭建"],
  alternates: { canonical: "/agent" },
  openGraph: {
    title: "Agent教程 | 小白AI",
    description: "AI Agent 是什么、怎么搭建、Manus、Dify、Coze、n8n、LangGraph 工具推荐。",
    url: "/agent",
    images: [{ url: "/xiaobai-mascot-cutout.png", alt: "小白AI Agent教程" }],
  },
}

export default function AgentTopicPage() {
  return (
    <SeoTopicPage
      eyebrow="Agent Guide"
      title="Agent教程：AI Agent是什么、Manus、Dify、Coze、n8n和LangGraph怎么选"
      description="Agent 可以理解为会调用工具、能按步骤完成任务的 AI 助手。这个专题从零解释 Agent 是什么，并按真实热度和使用场景区分：通用任务 Agent、零代码应用平台、自动化平台、开发者框架和编程 Agent。"
      primaryHref="/learn/2"
      primaryLabel="从Agent学习路径开始"
      toolRefs={[
        { id: "manus", note: "Manus 适合体验通用任务型 Agent：给目标，让 AI 拆步骤、查资料、做报告或完成一组任务。" },
        { id: "dify", note: "Dify 适合零代码搭建知识库问答、AI客服和可视化工作流。" },
        { id: "coze", note: "Coze 适合创建智能体并发布到网页、飞书、微信生态等渠道。" },
        { id: "n8n-ai-agent", note: "n8n 适合把邮件、表格、飞书、网页和 AI 串成自动化流程。" },
        { id: "zapier-ai", note: "Zapier AI 适合把海外 SaaS、CRM、表单、邮件和 AI 节点快速接起来。" },
        { id: "langgraph", note: "LangGraph 适合开发者构建复杂多步 Agent、状态机工作流和多 Agent 系统。" },
        { id: "openai-agents-sdk", note: "OpenAI Agents SDK 适合开发者用工具调用、沙箱和评估构建生产级 Agent。" },
        { id: "google-adk", note: "Google ADK 适合构建、调试和部署企业级多 Agent 系统。" },
        { id: "codex", note: "Codex 是面向编程项目的 AI Agent，适合读写代码、执行命令和调试。" },
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
          bullets: ["资料问答助手：Dify / Coze / FastGPT。", "日报和流程自动化：n8n / Zapier AI / Make。", "通用任务助手：Manus。", "复杂开发者 Agent：LangGraph / OpenAI Agents SDK / Google ADK。", "编程项目 Agent：Codex / Claude Code。"],
        },
        {
          title: "Agent安全边界",
          body: "Agent 能力越强，越需要边界。涉及钱、合同、客户承诺和删除文件的动作都要谨慎。",
          bullets: ["重要操作先人工确认。", "API Key 设置限额，不要明文提交。", "让 Agent 留日志，方便排查错误。"],
        },
      ]}
      faq={[
        { question: "AI Agent和ChatGPT有什么区别？", answer: "ChatGPT 更偏对话和回答，Agent 更强调目标、工具调用和多步骤执行。可以把 Agent 理解为带工具箱的 AI 助手。" },
        { question: "新手用Dify、Coze还是Manus？", answer: "想做自己的知识库、客服或工作流，优先 Dify/Coze；想体验通用任务型 Agent，试 Manus；想连接很多应用做自动化，试 n8n 或 Zapier AI；开发者做复杂 Agent 再看 LangGraph、OpenAI Agents SDK 和 Google ADK。" },
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
