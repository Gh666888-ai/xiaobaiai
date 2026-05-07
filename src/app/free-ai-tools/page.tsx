import type { Metadata } from "next"
import { SeoTopicPage } from "@/components/SeoTopicPage"

export const metadata: Metadata = {
  title: "免费AI工具推荐 - 免费ChatGPT替代、AI绘图、AI写作和AI办公工具",
  description:
    "小白AI整理免费AI工具推荐，覆盖免费ChatGPT替代、DeepSeek、Kimi、豆包、通义千问、即梦AI、Canva AI、Dify和开源AI工具，适合零基础用户低成本入门。",
  keywords: ["免费AI工具", "免费ChatGPT替代", "免费AI绘图", "免费AI写作", "免费AI办公", "免费AI工具推荐", "AI工具免费版"],
  alternates: { canonical: "/free-ai-tools" },
  openGraph: {
    title: "免费AI工具推荐 | 小白AI",
    description: "免费ChatGPT替代、AI绘图、AI写作、AI办公和Agent工具整理。",
    url: "/free-ai-tools",
    images: [{ url: "/xiaobai-mascot-cutout.png", alt: "小白AI 免费AI工具推荐" }],
  },
}

export default function FreeAiToolsTopicPage() {
  return (
    <SeoTopicPage
      eyebrow="Free AI Tools"
      title="免费AI工具推荐：免费ChatGPT替代、AI绘图、AI写作和AI办公工具"
      description="刚开始学 AI 不需要马上付费。先用免费版和免费额度跑通真实场景：聊天问答、文档总结、AI绘图、PPT草稿、知识库问答和自动化流程。这个专题帮你按任务挑免费AI工具，少踩注册和付费的坑。"
      primaryHref="/tools"
      primaryLabel="查看全部免费AI工具"
      toolRefs={[
        { id: "deepseek", note: "DeepSeek 适合中文问答、推理、代码解释和低成本 API，是很多新手的免费首选。" },
        { id: "kimi", note: "Kimi 适合长文档、PDF、资料总结和中文写作，免费额度对学习和办公很友好。" },
        { id: "doubao", note: "豆包界面简单，适合日常聊天、文案草稿、短视频脚本和手机端使用。" },
        { id: "tongyi", note: "通义千问覆盖对话、文档、绘图和办公场景，适合阿里云生态用户。" },
        { id: "jimeng", note: "即梦适合免费入门 AI 绘图和视频生成，中文提示词理解好，上手快。" },
        { id: "dify", note: "Dify 免费版适合搭建第一个知识库问答、客服助手和工作流原型。" },
      ]}
      sections={[
        {
          title: "先选免费，不等于只看免费",
          body: "免费AI工具适合学习和验证场景，但不要只按价格做决定。",
          bullets: ["先看能不能完成你的任务，再看免费额度够不够。", "涉及商业交付时，要确认版权、隐私和导出限制。", "稳定高频使用后，再考虑升级付费版或 API。"],
        },
        {
          title: "新手最实用组合",
          body: "不要注册一堆工具。先准备一个对话模型、一个长文档工具、一个绘图工具和一个办公工具。",
          bullets: ["日常问答：DeepSeek、豆包、通义千问。", "文档总结：Kimi、ChatGPT、通义千问。", "绘图和视频：即梦、通义万相、Canva AI。"],
        },
        {
          title: "免费工具的隐藏限制",
          body: "免费版通常会限制额度、速度、模型、导出格式或商用范围。",
          bullets: ["重要内容先本地备份，不要只存在工具里。", "上传隐私文件前先脱敏。", "商用前看清楚授权和水印规则。"],
        },
      ]}
      faq={[
        { question: "免费AI工具够用吗？", answer: "学习、日常问答、简单写作和轻办公通常够用。视频生成、专业绘图、高频 API、团队协作和商业交付往往需要付费额度。" },
        { question: "免费ChatGPT替代有哪些？", answer: "国内新手可以先试 DeepSeek、Kimi、豆包、通义千问。它们在中文问答、长文档、学习辅导和办公场景里很实用。" },
        { question: "免费工具会不会不稳定？", answer: "会有额度、排队和策略变化。重要工作建议准备两个替代工具，比如 DeepSeek + Kimi，或者即梦 + 通义万相。" },
      ]}
      related={[
        { href: "/ai-tools", label: "AI工具大全" },
        { href: "/chatgpt", label: "ChatGPT怎么用" },
        { href: "/deepseek", label: "DeepSeek怎么用" },
        { href: "/ai-office-tools", label: "AI办公工具推荐" },
      ]}
    />
  )
}
