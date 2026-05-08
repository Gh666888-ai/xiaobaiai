import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { categories, stageLabels, tools } from "@/data/tools"
import { categoryPath, getToolAlternatives, getToolMeta, getToolTrustTags, toolPath } from "@/data/tool-meta"
import { ToolLogo } from "@/components/ToolLogo"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"

export async function generateStaticParams() {
  return tools.map((tool) => ({ category: tool.category, id: tool.id }))
}

function findTool(categoryParam: string, id: string) {
  const category = decodeURIComponent(categoryParam)
  return tools.find((tool) => tool.category === category && tool.id === id)
}

function getToolUseCases(tool: NonNullable<ReturnType<typeof findTool>>, meta: ReturnType<typeof getToolMeta>) {
  const generic = [
    `想找一个${tool.category}工具，但不确定从哪个开始的新手。`,
    `需要快速完成${meta.bestFor[1] || tool.category}，又希望先了解免费情况和中文支持的人。`,
    `想比较 ${tool.name} 和同类替代工具，再决定是否长期使用的用户。`,
  ]

  const byId: Record<string, string[]> = {
    chatgpt: [
      "想用 ChatGPT 写文案、总结文件、分析图片、处理复杂问题和搭建个人 AI 工作流的人。",
      "需要一个能力全面的通用 AI 助手，并愿意学习更清晰提示词的新手。",
      "想了解 ChatGPT 国内怎么用、免费版和付费版区别、以及 DeepSeek/Kimi 替代方案的人。",
    ],
    deepseek: [
      "想免费使用中文 AI、写代码、做推理分析、学习 DeepSeek API 的用户。",
      "预算有限，但希望获得高性价比大模型能力的个人和小团队。",
      "想比较 DeepSeek、ChatGPT、Kimi、通义千问和 Claude 的用户。",
    ],
    kimi: [
      "需要分析长 PDF、合同、论文、会议记录和整本文档的新手。",
      "想找中文理解好、上手简单、免费额度友好的 AI 聊天工具的人。",
      "经常做阅读总结、资料整理、长文改写和学习笔记的用户。",
    ],
    claude: [
      "重视长文写作、代码理解、逻辑推理和安全回答质量的进阶用户。",
      "需要处理复杂文档、产品方案、长上下文任务和编程辅助的人。",
      "想比较 Claude、ChatGPT、DeepSeek 和 Kimi 差异的用户。",
    ],
    codex: [
      "想在 Windows 桌面端使用 OpenAI Codex 读写代码、调试项目和处理真实工程任务的开发者。",
      "希望用 AI Agent 协助 Git、终端、文件修改和代码审查的人。",
      "正在比较 Codex、Claude Code、Cursor、Cline 和 GitHub Copilot 的用户。",
    ],
    "claude-code": [
      "想在终端里让 AI 直接读写项目文件、修 Bug、解释代码和生成提交的开发者。",
      "习惯命令行工作流，希望 AI 能理解整个代码库的人。",
      "正在寻找 Claude Code 安装教程、国内使用方案和替代工具的人。",
    ],
    cursor: [
      "想用 AI 编辑器改 Next.js、React、Python、后端项目的开发者。",
      "需要让 AI 理解整个代码库，而不是只做简单补全的人。",
      "担心 AI 改坏样式，想学习更稳的文件范围和提示词习惯的用户。",
    ],
    "github-copilot": [
      "已经在 VS Code、JetBrains 或 GitHub 生态里工作的开发者。",
      "想要稳定代码补全、解释代码、生成测试和代码审查辅助的人。",
      "正在比较 Copilot、Cursor、Codex、Claude Code 的团队。",
    ],
    dify: [
      "想零代码搭建 AI 客服、知识库问答、RAG 应用和工作流的新手。",
      "需要把企业文档、产品资料、FAQ 接入 AI 助手的小团队。",
      "正在排查 Dify 知识库答非所问、检索不到、工作流报错的人。",
    ],
    coze: [
      "想搭建智能体并发布到微信、飞书、网页等渠道的新手。",
      "需要做客服 Bot、社群资料助手、内部知识问答的人。",
      "想用零代码方式试验 Agent、插件和知识库的人。",
    ],
    "n8n-ai-agent": [
      "想把邮件、飞书、表格、网页、数据库和 AI 串成自动化流程的人。",
      "需要自托管、可视化、低成本自动化工作流的小团队。",
      "正在学习 AI 早报、日报、数据监控、消息通知自动化的用户。",
    ],
    midjourney: [
      "想生成高质量插画、海报、概念图、角色设定和商业视觉的人。",
      "愿意学习提示词、风格控制和图像迭代的创作者。",
      "正在比较 Midjourney、即梦、Stable Diffusion、DALL·E 的用户。",
    ],
    jimeng: [
      "想用中文提示词生成图片、视频、封面和短视频素材的新手。",
      "需要国内可访问、上手简单、有免费额度的 AI 创作工具的人。",
      "正在做小红书、公众号、短视频、电商图内容生产的用户。",
    ],
    gamma: [
      "想用 AI 快速生成 PPT、方案文档、课程讲义和汇报材料的人。",
      "不会设计排版，但需要一份看起来专业的演示稿的新手。",
      "正在比较 Gamma、Canva、Beautiful.ai、Tome 的用户。",
    ],
    ollama: [
      "想在本地电脑运行开源模型，保护隐私并降低 API 成本的人。",
      "需要学习 DeepSeek、Qwen、Llama 等模型本地部署的新手。",
      "有 16GB 以上内存或独立显卡，想尝试本地 AI 助手的用户。",
    ],
  }

  return byId[tool.id] || generic
}

function getToolFaqs(tool: NonNullable<ReturnType<typeof findTool>>, meta: ReturnType<typeof getToolMeta>) {
  const specific: Record<string, { question: string; answer: string }[]> = {
    chatgpt: [
      { question: "ChatGPT 怎么用？", answer: "新手可以先从聊天、写文案、总结文件和改写内容开始。把背景、目标、格式和限制说清楚，ChatGPT 的输出会稳定很多。" },
      { question: "ChatGPT 国内使用要注意什么？", answer: "ChatGPT 通常需要准备可访问的网络环境、账号和支付方案。重要资料不要直接上传，先确认隐私和合规要求。" },
      { question: "ChatGPT 有哪些替代工具？", answer: "常见替代品包括 DeepSeek、Kimi、Claude、通义千问和豆包。中文长文优先看 Kimi，性价比优先看 DeepSeek。" },
    ],
    deepseek: [
      { question: "DeepSeek 怎么用？", answer: "可以直接访问 DeepSeek 网页版聊天，也可以通过 API 接入到应用、Dify、Chatbox 或 Cherry Studio。新手先用网页版体验推理和写作。" },
      { question: "DeepSeek 免费吗？", answer: "DeepSeek 网页版通常适合免费体验，API 按量计费但价格较低。正式使用前建议查看官方价格和额度说明。" },
      { question: "DeepSeek 适合写代码吗？", answer: "DeepSeek 适合代码生成、解释、调试思路和数据分析。复杂工程任务仍建议人工审查，并配合 Git 做版本控制。" },
    ],
    kimi: [
      { question: "Kimi 怎么用？", answer: "Kimi 适合上传长文档、PDF、会议记录和资料包，让它总结重点、提取待办、改写成文章或生成学习笔记。" },
      { question: "Kimi 适合什么场景？", answer: "Kimi 的优势是中文理解和长文本处理，适合合同阅读、论文梳理、资料总结和内容改写。" },
      { question: "Kimi 和 DeepSeek 怎么选？", answer: "长文档阅读优先 Kimi，推理、代码和高性价比 API 优先 DeepSeek。日常使用可以两个都保留。" },
    ],
    codex: [
      { question: "OpenAI Codex 怎么用？", answer: "Codex 适合在真实项目里让 AI 阅读代码、修改文件、运行命令和解释错误。使用前建议先提交 Git，方便回滚。" },
      { question: "Codex 和 Cursor 有什么区别？", answer: "Cursor 更像 AI 编辑器，Codex 更偏工程 Agent，可以围绕任务读写文件、执行命令和协助调试。" },
      { question: "Codex 国内使用要注意什么？", answer: "需要准备账号、模型服务和稳定网络。涉及 API Key 的配置不要提交到公开仓库。" },
    ],
    "claude-code": [
      { question: "Claude Code 怎么安装？", answer: "Claude Code 通常通过 Node.js/npm 安装，安装前确认 Node.js 版本、终端环境和账号权限。国内用户还要注意网络和 API 配置。" },
      { question: "Claude Code 适合新手吗？", answer: "它更适合有一点命令行基础的开发者。纯新手可以先用 Cursor 或在线 IDE，再逐步学习终端工作流。" },
      { question: "Claude Code 有哪些替代品？", answer: "可替代工具包括 OpenAI Codex、Cursor、Cline、GitHub Copilot、Aider 和通义灵码。" },
    ],
    cursor: [
      { question: "Cursor 怎么用更稳？", answer: "让 Cursor 每次只改一个小需求，明确指定文件范围，要求先解释计划，再生成修改。改完一定读 diff。" },
      { question: "Cursor 会不会改坏项目？", answer: "如果不给边界，它可能顺手重构无关文件。建议结合 Git、小步提交和明确提示词使用。" },
      { question: "Cursor 和 GitHub Copilot 怎么选？", answer: "想要完整 AI 编辑器和项目级对话选 Cursor，只需要稳定补全和 IDE 集成可选 Copilot。" },
    ],
    dify: [
      { question: "Dify 怎么搭建 AI 客服？", answer: "先创建聊天助手，上传 FAQ、产品说明和售后政策到知识库，再设置提示词边界，最后测试常见问题。" },
      { question: "Dify 知识库答非所问怎么办？", answer: "优先检查文档质量、分段长度、检索策略、Top K 和提示词约束。扫描件 PDF 要先清理页眉页脚和表格残留。" },
      { question: "Dify 适合零代码用户吗？", answer: "适合。Dify 的优势是可视化应用、知识库和工作流，新手可以先从一个内部问答助手开始。" },
    ],
    coze: [
      { question: "Coze 怎么做智能体？", answer: "先明确智能体场景，例如客服、资料助手或社群问答，再配置人设、知识库、插件和发布渠道。" },
      { question: "Coze 适合发布到哪里？", answer: "Coze 常用于网页、飞书、微信生态和社群场景，适合把一个明确任务包装成可用 Bot。" },
      { question: "Coze 和 Dify 怎么选？", answer: "偏发布渠道和智能体体验选 Coze，偏知识库、工作流和可控部署选 Dify。" },
    ],
  }

  return specific[tool.id] || [
    { question: `${tool.name} 怎么用？`, answer: `先用 ${tool.name} 完成一个小任务，例如${meta.bestFor[0]}。确认输出质量后，再把它纳入日常工作流。` },
    { question: `${tool.name} 免费吗？`, answer: `${tool.name} 的当前标注为「${tool.pricing}」。实际价格、额度和地区限制可能变化，正式使用前建议以官网为准。` },
    { question: `${tool.name} 适合新手吗？`, answer: `小白AI给出的难度判断是「${meta.difficulty}」，新手推荐指数为 ${meta.newbieScore}/100。建议先从模板任务开始，不要一上来处理重要资料。` },
  ]
}

function getRelatedLinks(tool: NonNullable<ReturnType<typeof findTool>>) {
  return [
    { href: "/choose-tool", label: "不知道怎么选？用 AI 工具选择器" },
    { href: `/search?q=${encodeURIComponent(`${tool.name} 怎么用`)}`, label: `搜索「${tool.name} 怎么用」` },
    { href: tool.stage >= 4 ? "/learn/4" : `/learn/${Math.max(0, Math.min(4, tool.stage))}`, label: "查看对应学习阶段" },
    { href: "/news?category=教程资源", label: "查看 AI 教程资源" },
  ]
}

export function generateMetadata({ params }: { params: { category: string; id: string } }): Metadata {
  const tool = findTool(params.category, params.id)
  if (!tool) return {}
  const meta = getToolMeta(tool)
  const title = `${tool.name} 怎么用？${tool.category}工具教程、免费情况和替代品`
  const description = `${tool.name}：${tool.description} 小白AI整理了${tool.name}怎么用、适合谁、免费情况、中文支持、上手难度、新手推荐指数和替代工具。`
  return {
    title,
    description,
    keywords: [tool.name, `${tool.name}怎么用`, `${tool.name}教程`, `${tool.name}替代品`, tool.category, ...tool.tags, "AI工具", "AI工具导航", meta.difficulty],
    alternates: { canonical: toolPath(tool) },
    openGraph: {
      title,
      description,
      url: toolPath(tool),
      type: "article",
      siteName: "小白AI",
      images: tool.logo ? [{ url: tool.logo, alt: tool.name }] : [{ url: "/xiaobai-mascot-cutout.png", alt: "小白AI" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: tool.logo ? [tool.logo] : ["/xiaobai-mascot-cutout.png"],
    },
  }
}

export default function ToolDetailPage({ params }: { params: { category: string; id: string } }) {
  const tool = findTool(params.category, params.id)
  if (!tool) notFound()
  const category = categories.find((item) => item.key === tool.category)
  const meta = getToolMeta(tool)
  const trustTags = getToolTrustTags(tool)
  const alternatives = getToolAlternatives(tool)
  const useCases = getToolUseCases(tool, meta)
  const faqs = getToolFaqs(tool, meta)
  const relatedLinks = getRelatedLinks(tool)
  const toolJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    applicationCategory: tool.category,
    operatingSystem: "Web",
    description: tool.description,
    url: `https://www.xiaobaiai.cn${toolPath(tool)}`,
    sameAs: tool.url,
    image: tool.logo || "https://www.xiaobaiai.cn/xiaobai-mascot-cutout.png",
    offers: {
      "@type": "Offer",
      price: tool.pricing === "免费" ? "0" : undefined,
      priceCurrency: "CNY",
      availability: "https://schema.org/InStock",
    },
    isPartOf: {
      "@type": "WebSite",
      name: "小白AI",
      url: "https://www.xiaobaiai.cn",
    },
  }
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }
  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `${tool.name} 新手怎么用`,
    description: `小白AI整理的 ${tool.name} 新手上手步骤。`,
    step: meta.quickStart.map((item, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: `第 ${index + 1} 步`,
      text: item,
    })),
  }
  const compare = [
    ["适合阶段", stageLabels[tool.stage] || `阶段 ${tool.stage}`],
    ["是否免费", tool.pricing],
    ["是否需要魔法网络", meta.magicNetwork],
    ["中文支持", meta.chineseSupport],
    ["难度", meta.difficulty],
    ["新手推荐指数", `${meta.newbieScore}/100`],
  ]

  return (
    <div style={{ background: "#000", minHeight: "100vh", fontFamily: "'Noto Sans SC', sans-serif", position: "relative", overflow: "hidden" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <MathRain />
      <NavBar />
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "60px 60px 100px", position: "relative", zIndex: 10, background: "rgba(0,0,0,0.86)" }} className="max-sm:px-4">
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 26 }}>
          <Link href="/tools" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#aaa", textDecoration: "none" }}>← 工具分类</Link>
          <Link href={categoryPath(tool.category)} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#c9a84c", textDecoration: "none" }}>← {category?.label || tool.category}</Link>
        </div>

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, marginBottom: 28 }} className="max-sm:flex-col">
          <div>
            <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.35em", color: "#7a6230", textTransform: "uppercase", marginBottom: 10, fontWeight: 700 }}>{tool.category}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
              <ToolLogo name={tool.name} url={tool.url} logo={tool.logo} size={54} radius={14} />
              <h1 style={{ fontSize: 40, color: "#fff", fontWeight: 900 }}>{tool.name}</h1>
            </div>
            <p style={{ fontSize: 16, color: "#ccc", lineHeight: 1.9 }}>{tool.description}</p>
          </div>
          <a href={tool.url} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ textDecoration: "none", whiteSpace: "nowrap" }}>访问官网</a>
        </div>

        <section style={{ border: "1px solid rgba(201,168,76,0.34)", background: "linear-gradient(180deg,rgba(201,168,76,0.075),rgba(255,255,255,0.025))", borderRadius: 12, padding: "20px 22px", marginBottom: 28 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 14, alignItems: "start", marginBottom: 16 }} className="max-sm:grid-cols-1">
            <div>
              <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.22em", color: "#7a6230", textTransform: "uppercase", fontWeight: 950, marginBottom: 7 }}>Xiaobai Decision Card</p>
              <h2 style={{ fontSize: 20, color: "#fff", fontWeight: 950, marginBottom: 8 }}>小白判断卡：先看它能不能帮你完成第一步</h2>
              <p style={{ color: "#cfcfcf", fontSize: 14, lineHeight: 1.8 }}>不要只看工具名。先确认国内可用、免费情况、中文体验、上手难度和常见坑，再决定要不要投入时间。</p>
            </div>
            <div style={{ textAlign: "right" }} className="max-sm:text-left">
              <p style={{ color: "#e8c96a", fontSize: 28, fontWeight: 950, fontFamily: "'JetBrains Mono',monospace", lineHeight: 1 }}>{meta.newbieScore}</p>
              <p style={{ color: "#888", fontSize: 11, fontWeight: 900, marginTop: 4 }}>新手推荐指数</p>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 10, marginBottom: 16 }}>
            {trustTags.map((tag) => (
              <div key={tag.label} style={{ border: `1px solid ${tag.tone === "good" ? "rgba(82,145,82,0.42)" : tag.tone === "warn" ? "rgba(217,164,65,0.42)" : "#242424"}`, borderRadius: 10, background: tag.tone === "good" ? "rgba(82,145,82,0.08)" : tag.tone === "warn" ? "rgba(217,164,65,0.06)" : "rgba(0,0,0,0.22)", padding: "13px 14px" }}>
                <p style={{ color: tag.tone === "good" ? "#9fd18b" : tag.tone === "warn" ? "#D9A441" : "#ddd", fontSize: 13, fontWeight: 950, marginBottom: 6 }}>{tag.label}</p>
                <p style={{ color: "#aaa", fontSize: 12, lineHeight: 1.6 }}>{tag.detail}</p>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="max-sm:grid-cols-1">
            <div style={{ border: "1px solid #242424", borderRadius: 10, background: "rgba(0,0,0,0.24)", padding: "14px 15px" }}>
              <p style={{ color: "#fff", fontSize: 13, fontWeight: 950, marginBottom: 7 }}>第一次怎么开始</p>
              <p style={{ color: "#bbb", fontSize: 13, lineHeight: 1.75 }}>{meta.quickStart[0]}</p>
            </div>
            <div style={{ border: "1px solid #242424", borderRadius: 10, background: "rgba(0,0,0,0.24)", padding: "14px 15px" }}>
              <p style={{ color: "#fff", fontSize: 13, fontWeight: 950, marginBottom: 7 }}>常见坑</p>
              <p style={{ color: "#bbb", fontSize: 13, lineHeight: 1.75 }}>{meta.caution}</p>
            </div>
          </div>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10, marginBottom: 34 }}>
          {compare.map(([label, value]) => (
            <div key={label} style={{ border: "1px solid #1a1a1a", background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "16px 18px" }}>
              <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#777", marginBottom: 8 }}>{label}</p>
              <p style={{ fontSize: 15, color: "#fff", fontWeight: 800 }}>{value}</p>
            </div>
          ))}
        </section>

        <section style={{ marginBottom: 34 }}>
          <h2 style={{ fontSize: 18, color: "#fff", fontWeight: 900, marginBottom: 14 }}>适合做什么</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {meta.bestFor.map((item) => <p key={item} style={{ borderLeft: "2px solid #7a6230", paddingLeft: 14, color: "#ccc", lineHeight: 1.8, fontSize: 14 }}>{item}</p>)}
          </div>
        </section>

        <section style={{ marginBottom: 34 }}>
          <h2 style={{ fontSize: 18, color: "#fff", fontWeight: 900, marginBottom: 14 }}>{tool.name} 适合谁</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
            {useCases.map((item) => (
              <p key={item} style={{ border: "1px solid #1a1a1a", background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 16, color: "#ccc", lineHeight: 1.75, fontSize: 14 }}>{item}</p>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 34 }}>
          <h2 style={{ fontSize: 18, color: "#fff", fontWeight: 900, marginBottom: 14 }}>{tool.name} 怎么用：新手 3 步开始</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
            {meta.quickStart.map((item, index) => (
              <div key={item} style={{ border: "1px solid #1a1a1a", background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 18 }}>
                <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#e8c96a", marginBottom: 8 }}>STEP {index + 1}</p>
                <p style={{ fontSize: 14, color: "#ccc", lineHeight: 1.7 }}>{item}</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 13, color: "#D9A441", marginTop: 14, lineHeight: 1.7 }}>{meta.caution}</p>
        </section>

        <section style={{ marginBottom: 34 }}>
          <h2 style={{ fontSize: 18, color: "#fff", fontWeight: 900, marginBottom: 14 }}>{tool.name} 常见问题</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {faqs.map((item) => (
              <div key={item.question} style={{ border: "1px solid #1a1a1a", background: "rgba(255,255,255,0.025)", borderRadius: 10, padding: "18px 20px" }}>
                <h3 style={{ fontSize: 15, color: "#fff", fontWeight: 900, marginBottom: 8 }}>{item.question}</h3>
                <p style={{ fontSize: 14, color: "#bbb", lineHeight: 1.8 }}>{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 34 }}>
          <h2 style={{ fontSize: 18, color: "#fff", fontWeight: 900, marginBottom: 14 }}>继续学习</h2>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {relatedLinks.map((item) => (
              <Link key={item.href} href={item.href} className="btn-outline" style={{ textDecoration: "none", fontSize: 12 }}>{item.label}</Link>
            ))}
          </div>
        </section>

        {alternatives.length > 0 && (
          <section>
            <h2 style={{ fontSize: 18, color: "#fff", fontWeight: 900, marginBottom: 14 }}>替代品</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
              {alternatives.map((item) => (
                <Link key={item.id} href={toolPath(item)} style={{ textDecoration: "none", border: "1px solid #1a1a1a", background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 16 }}>
                  <h3 style={{ fontSize: 15, color: "#fff", fontWeight: 800, marginBottom: 6 }}>{item.name}</h3>
                  <p style={{ fontSize: 12, color: "#999", lineHeight: 1.6 }}>{item.description.slice(0, 72)}...</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
