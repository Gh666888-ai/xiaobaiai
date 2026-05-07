import Link from "next/link"

const seoTopics = [
  { href: "/deepseek-api-key", label: "DeepSeek API Key申请", terms: ["DeepSeek API", "API Key", "deepseek-v4", "DeepSeek V4"] },
  { href: "/dify-knowledge-base", label: "Dify知识库搭建", terms: ["Dify知识库", "Dify RAG", "RAG", "知识库问答", "AI客服"] },
  { href: "/gamma-ppt", label: "Gamma做PPT教程", terms: ["Gamma", "AI PPT", "AI做PPT", "PPT生成"] },
  { href: "/jimeng-prompts", label: "即梦AI提示词", terms: ["即梦", "即梦AI", "AI绘图提示词", "文生图", "图生图"] },
  { href: "/free-ai-tools", label: "免费AI工具推荐", terms: ["免费AI工具", "免费", "免费版", "免费额度"] },
  { href: "/ai-image-tools", label: "AI绘图工具推荐", terms: ["AI绘图", "AI绘画", "Midjourney", "DALL", "Stable Diffusion", "通义万相"] },
  { href: "/ai-writing-tools", label: "AI写作工具推荐", terms: ["AI写作", "AI文案", "小红书", "公众号", "论文润色", "SEO写作"] },
  { href: "/ai-video-tools", label: "AI视频工具推荐", terms: ["AI视频", "文生视频", "图生视频", "可灵", "Runway", "短视频"] },
  { href: "/ai-office-tools", label: "AI办公工具推荐", terms: ["AI办公", "会议纪要", "文档总结", "表格分析", "自动化办公"] },
  { href: "/ai-ppt-tools", label: "AI PPT工具推荐", terms: ["AI PPT", "AI做PPT", "Gamma", "Canva", "PPT Master"] },
  { href: "/chatgpt", label: "ChatGPT怎么用", terms: ["ChatGPT", "GPT", "OpenAI"] },
  { href: "/deepseek", label: "DeepSeek怎么用", terms: ["DeepSeek"] },
  { href: "/dify", label: "Dify教程", terms: ["Dify"] },
  { href: "/cursor", label: "Cursor怎么用", terms: ["Cursor"] },
  { href: "/ai-coding", label: "AI编程工具推荐", terms: ["AI编程", "Codex", "Cursor", "Claude Code", "Copilot"] },
  { href: "/agent", label: "Agent教程", terms: ["Agent", "智能体", "工作流"] },
  { href: "/ai-tools", label: "AI工具大全", terms: ["AI工具", "工具导航"] },
]

function scoreTopic(text: string, topic: (typeof seoTopics)[number]) {
  const lower = text.toLowerCase()
  return topic.terms.reduce((score, term) => score + (lower.includes(term.toLowerCase()) ? 1 : 0), 0)
}

export function SeoRelatedLinks({
  text,
  title = "继续学习",
  limit = 6,
  excludeHref,
}: {
  text: string
  title?: string
  limit?: number
  excludeHref?: string
}) {
  const ranked = seoTopics
    .filter((topic) => topic.href !== excludeHref)
    .map((topic, index) => ({ ...topic, index, score: scoreTopic(text, topic) }))
    .filter((topic) => topic.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)

  if (!ranked.length) return null

  return (
    <section style={{ marginTop: 24, border: "1px solid #1f1f1f", background: "rgba(255,255,255,0.02)", borderRadius: 10, padding: "18px 20px" }}>
      <h2 style={{ fontSize: 15, color: "#fff", fontWeight: 900, marginBottom: 12 }}>{title}</h2>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {ranked.map((topic) => (
          <Link
            key={topic.href}
            href={topic.href}
            style={{ fontSize: 12, color: "#e8c96a", textDecoration: "none", border: "1px solid rgba(122,98,48,0.7)", background: "rgba(201,168,76,0.05)", borderRadius: 999, padding: "7px 11px", fontWeight: 800 }}
          >
            {topic.label}
          </Link>
        ))}
      </div>
    </section>
  )
}
