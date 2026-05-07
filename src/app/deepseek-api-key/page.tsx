import type { Metadata } from "next"
import { SeoTopicPage } from "@/components/SeoTopicPage"

export const metadata: Metadata = {
  title: "DeepSeek API Key怎么申请 - DeepSeek API注册、模型选择和常见报错",
  description:
    "小白AI整理 DeepSeek API Key 申请教程，讲清楚开发者平台注册、API Key 创建、deepseek-v4-flash/pro 模型选择、余额计费、Dify/Codex 接入和 401、402、timeout 常见报错。",
  keywords: ["DeepSeek API Key", "DeepSeek API申请", "DeepSeek API教程", "DeepSeek V4 API", "DeepSeek模型选择", "Dify接入DeepSeek"],
  alternates: { canonical: "/deepseek-api-key" },
  openGraph: {
    title: "DeepSeek API Key怎么申请 | 小白AI",
    description: "DeepSeek API注册、模型选择、Dify/Codex接入和常见报错整理。",
    url: "/deepseek-api-key",
    images: [{ url: "/xiaobai-mascot-cutout.png", alt: "小白AI DeepSeek API Key教程" }],
  },
}

export default function DeepSeekApiKeyTopicPage() {
  return (
    <SeoTopicPage
      eyebrow="DeepSeek API"
      title="DeepSeek API Key怎么申请：注册、模型选择、接入工具和常见报错"
      description="很多人不是不会用 DeepSeek，而是卡在 API Key、模型名、余额和接入地址。这个教程按小白视角讲清楚：去哪里申请、复制什么配置、怎么接 Dify/Codex/n8n，以及遇到 401、402、timeout 怎么排查。"
      primaryHref="/tools/%E5%AF%B9%E8%AF%9DAI/deepseek"
      primaryLabel="查看DeepSeek工具详情"
      toolRefs={[
        { id: "deepseek", note: "DeepSeek 是国内新手最容易起步的高性价比模型，适合中文问答、推理、代码和 API 接入。" },
        { id: "dify", note: "Dify 可以把 DeepSeek 接入知识库、AI客服和工作流，是验证 API Key 的常见场景。" },
        { id: "codex", note: "Codex 类编程 Agent 可以用 DeepSeek 作为低成本模型后端，适合代码解释和工程任务。" },
        { id: "n8n-ai-agent", note: "n8n AI 适合把 DeepSeek 结果接入飞书、企业微信、表格和邮件自动化。" },
        { id: "siliconflow", note: "硅基流动适合调用多种开源模型，可作为国内模型 API 平台补充。" },
      ]}
      sections={[
        {
          title: "申请前准备什么",
          body: "API Key 等同于付费密钥，先把账号、安全和余额准备好。",
          bullets: ["准备手机号或邮箱注册 DeepSeek 开发者平台。", "创建 Key 后立刻保存，通常只完整显示一次。", "不要把 Key 发到公开仓库、群聊、截图或陌生网页。"],
        },
        {
          title: "模型怎么选",
          body: "不要一开始就用最贵模型。先按任务难度选。",
          bullets: ["日常问答、客服、写文案：优先 deepseek-v4-flash。", "复杂推理、代码修复、Agent 多步任务：再切 deepseek-v4-pro。", "旧教程里的 deepseek-chat / reasoner 要注意官方策略变化。"],
        },
        {
          title: "常见报错",
          body: "大多数问题不是代码坏了，而是 Key、余额、模型名或网络。",
          bullets: ["401：Key 错了、复制少字符或前后有空格。", "402：余额不足或计费没开通。", "timeout：网络或服务暂时不稳定，先重试，再换环境排查。"],
        },
      ]}
      faq={[
        { question: "DeepSeek API Key在哪里申请？", answer: "通常在 DeepSeek 开发者平台的 API Keys / 密钥管理里创建。创建后要立刻保存，不要公开泄露。" },
        { question: "DeepSeek API接Dify怎么填？", answer: "一般选择 OpenAI Compatible 或自定义模型供应商，填写 base_url、API Key 和模型名。具体字段以 Dify 当前版本界面为准。" },
        { question: "DeepSeek API为什么返回401？", answer: "最常见原因是 Key 粘贴错误、复制少字符、前后有空格，或把别的平台 Key 填到了 DeepSeek 配置里。" },
      ]}
      related={[
        { href: "/deepseek", label: "DeepSeek怎么用" },
        { href: "/dify", label: "Dify教程" },
        { href: "/codex", label: "Codex国内使用" },
        { href: "/ai-coding", label: "AI编程工具推荐" },
      ]}
    />
  )
}
