import type { Metadata } from "next"
import { SeoTopicPage } from "@/components/SeoTopicPage"

export const metadata: Metadata = {
  title: "Agent教程 - Codex、Claude Code、DeepSeek、Hermes、Dify怎么选",
  description: "小白AI整理 Agent 教程，解释 AI Agent 是什么，并按执行能力区分 Codex、Claude Code、DeepSeek Agent API、Hermes、Kimi K2.6、Manus、Dify、Coze、n8n、LangGraph 等主流工具。",
  keywords: ["Agent教程", "AI Agent", "Codex", "Claude Code", "DeepSeek Agent", "Hermes Agent", "Kimi K2.6", "Dify教程", "LangGraph", "智能体搭建"],
  alternates: { canonical: "/agent" },
  openGraph: {
    title: "Agent教程 | 小白AI",
    description: "AI Agent 是什么、怎么搭建、Codex、Claude Code、DeepSeek、Hermes、Dify、n8n、LangGraph 工具推荐。",
    url: "/agent",
    images: [{ url: "/xiaobai-mascot-cutout.png", alt: "小白AI Agent教程" }],
  },
}

export default function AgentTopicPage() {
  return (
    <SeoTopicPage
      eyebrow="Agent Guide"
      title="Agent教程：Codex、Claude Code、DeepSeek、Hermes和Dify怎么选"
      description="Agent 可以理解为会调用工具、能按步骤完成任务的 AI 助手。这个专题按真实执行能力区分：编程执行 Agent、国产低成本模型后端、自进化开源 Agent、通用任务 Agent、零代码应用平台和自动化平台。"
      primaryHref="/learn/2"
      primaryLabel="从Agent学习路径开始"
      toolRefs={[
        { id: "codex-agent", note: "Codex 是当前最值得优先看的工程 Agent：读写仓库、跑命令、测代码、做长任务。" },
        { id: "claude-code-agent", note: "Claude Code 适合终端和 IDE 里的代码库理解、重构、Git 工作流和复杂项目协作。" },
        { id: "hermes", note: "Hermes 适合研究开源 Agent 的记忆、技能沉淀和跨平台消息网关。" },
        { id: "kimi-code", note: "Kimi K2.6 适合长程编码、多模态输入和 Claude Code/Roo/Cline 接入。" },
        { id: "manus", note: "Manus 适合体验通用任务型 Agent：给目标，让 AI 拆步骤、查资料、做报告或完成一组任务。" },
        { id: "dify", note: "Dify 适合零代码搭建知识库问答、AI客服和可视化工作流。" },
        { id: "coze", note: "Coze 适合创建智能体并发布到网页、飞书、微信生态等渠道。" },
        { id: "n8n-ai-agent", note: "n8n 适合把邮件、表格、飞书、网页和 AI 串成自动化流程。" },
        { id: "langgraph", note: "LangGraph 适合开发者构建复杂多步 Agent、状态机工作流和多 Agent 系统。" },
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
          bullets: ["想让 AI 真正改代码、跑命令、做工程任务：Codex / Claude Code。", "想研究可自进化开源 Agent：Hermes。", "想做资料问答助手：Dify / Coze / FastGPT。", "想做日报和流程自动化：n8n / Zapier AI / Make。", "想做复杂开发者 Agent 框架：LangGraph / OpenAI Agents SDK / Google ADK。", "DeepSeek V4 / Kimi K2.6 是模型后端，不是 Agent 产品本身；可以接到 Claude Code、OpenCode、Cline 里使用。"],
        },
        {
          title: "Agent安全边界",
          body: "Agent 能力越强，越需要边界。涉及钱、合同、客户承诺和删除文件的动作都要谨慎。",
          bullets: ["重要操作先人工确认。", "API Key 设置限额，不要明文提交。", "让 Agent 留日志，方便排查错误。"],
        },
      ]}
      faq={[
        { question: "AI Agent和ChatGPT有什么区别？", answer: "ChatGPT 更偏对话和回答，Agent 更强调目标、工具调用和多步骤执行。可以把 Agent 理解为带工具箱的 AI 助手。" },
        { question: "新手用Codex、Claude Code还是Dify？", answer: "如果目标是改代码和做工程任务，优先 Codex / Claude Code；如果目标是客服、知识库或业务流程，优先 Dify / Coze；如果想省 API 成本，可以把 DeepSeek V4 或 Kimi K2.6 接到 Coding Agent 上。" },
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
