import Link from "next/link"

const keywordLinks = [
  { terms: ["Claude Code"], href: `/tools/${encodeURIComponent("AI编程")}/claude-code` },
  { terms: ["GitHub Copilot", "Copilot"], href: `/tools/${encodeURIComponent("AI编程")}/github-copilot` },
  { terms: ["OpenAI Codex", "Codex"], href: `/tools/${encodeURIComponent("AI编程")}/codex` },
  { terms: ["Stable Diffusion"], href: `/tools/${encodeURIComponent("AI绘图")}/stable-diffusion` },
  { terms: ["Midjourney"], href: `/tools/${encodeURIComponent("AI绘图")}/midjourney` },
  { terms: ["DeepSeek"], href: `/tools/${encodeURIComponent("对话AI")}/deepseek` },
  { terms: ["ChatGPT"], href: `/tools/${encodeURIComponent("对话AI")}/chatgpt` },
  { terms: ["Claude"], href: `/tools/${encodeURIComponent("对话AI")}/claude` },
  { terms: ["Kimi"], href: `/tools/${encodeURIComponent("对话AI")}/kimi` },
  { terms: ["通义千问"], href: `/tools/${encodeURIComponent("对话AI")}/tongyi` },
  { terms: ["豆包"], href: `/tools/${encodeURIComponent("对话AI")}/doubao` },
  { terms: ["文心一言"], href: `/tools/${encodeURIComponent("对话AI")}/ernie` },
  { terms: ["Cursor"], href: `/tools/${encodeURIComponent("AI编程")}/cursor` },
  { terms: ["Dify"], href: `/tools/${encodeURIComponent("Agent平台")}/dify` },
  { terms: ["Coze"], href: `/tools/${encodeURIComponent("Agent平台")}/coze` },
  { terms: ["n8n"], href: `/tools/${encodeURIComponent("Agent平台")}/n8n-ai-agent` },
  { terms: ["Ollama"], href: `/tools/${encodeURIComponent("模型平台")}/ollama` },
  { terms: ["Gamma"], href: `/tools/${encodeURIComponent("AI办公")}/gamma` },
  { terms: ["Sora"], href: `/tools/${encodeURIComponent("AI视频")}/sora` },
  { terms: ["可灵"], href: `/tools/${encodeURIComponent("AI视频")}/kling` },
  { terms: ["即梦"], href: `/tools/${encodeURIComponent("AI绘图")}/jimeng` },
  { terms: ["Agent"], href: "/learn/2" },
  { terms: ["Prompt"], href: "/learn/1" },
]

const termToLink = new Map<string, string>()
for (const item of keywordLinks) {
  for (const term of item.terms) termToLink.set(term.toLowerCase(), item.href)
}

const keywordPattern = new RegExp(
  `(${keywordLinks.flatMap((item) => item.terms).sort((a, b) => b.length - a.length).map(escapeRegex).join("|")})`,
  "gi",
)

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

export function SeoKeywordLinks({ text, maxLinks = 8 }: { text: string; maxLinks?: number }) {
  if (!text) return null

  const used = new Set<string>()
  let count = 0

  return (
    <>
      {text.split(keywordPattern).map((part, index) => {
        const key = part.toLowerCase()
        const href = termToLink.get(key)
        if (!href || used.has(key) || count >= maxLinks) return <span key={`${part}-${index}`}>{part}</span>
        used.add(key)
        count += 1
        return (
          <Link
            key={`${part}-${index}`}
            href={href}
            style={{ color: "#e8c96a", textDecoration: "none", borderBottom: "1px solid rgba(232,201,106,0.35)" }}
          >
            {part}
          </Link>
        )
      })}
    </>
  )
}
