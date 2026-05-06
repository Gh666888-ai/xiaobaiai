export function brandLogoFromName(name: string) {
  const slugMap: Record<string, string> = {
    chatgpt: "openai",
    codex: "openai",
    claude: "anthropic",
    "github-copilot": "githubcopilot",
    cursor: "cursor",
    notion: "notion",
    figma: "figma",
    canva: "canva",
    zapier: "zapier",
    n8n: "n8n",
    huggingface: "huggingface",
    github: "github",
    microsoft: "microsoft",
    google: "google",
    gemini: "googlegemini",
    slack: "slack",
    discord: "discord",
    openai: "openai",
    vercel: "vercel",
    replit: "replit",
    grammarly: "grammarly",
    perplexity: "perplexity",
    midjourney: "midjourney",
  }

  const text = name.toLowerCase()
  const key = Object.keys(slugMap).find((item) => text.includes(item))
  return key ? `https://cdn.simpleicons.org/${slugMap[key]}` : ""
}

export function brandInitial(name: string) {
  const trimmed = String(name || "AI").trim()
  const first = trimmed.match(/[A-Za-z0-9]/)?.[0] || trimmed[0] || "AI"
  return first.toUpperCase()
}

export function brandGradient(name: string) {
  const palettes = [
    ["#24c7db", "#2f6bff"],
    ["#e8c96a", "#b87916"],
    ["#7ee7d7", "#1d8f7d"],
    ["#b692ff", "#5d35d6"],
    ["#ff9f7e", "#dc4d6d"],
    ["#7cc7ff", "#1f6feb"],
    ["#d7f76f", "#3da563"],
    ["#f5f7ff", "#8b9bb5"],
  ]
  let hash = 0
  for (let i = 0; i < name.length; i += 1) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  const [a, b] = palettes[Math.abs(hash) % palettes.length]
  return `linear-gradient(145deg, ${a}, ${b})`
}

export function domainIcon(url: string) {
  try {
    const host = new URL(url).hostname
    return `https://www.google.com/s2/favicons?domain=${host}&sz=128`
  } catch {
    return ""
  }
}

export function sourceLogo(source: string) {
  if (/openai/i.test(source)) return "https://cdn.simpleicons.org/openai"
  if (/anthropic|claude/i.test(source)) return "https://cdn.simpleicons.org/anthropic"
  if (/deepseek/i.test(source)) return "https://www.google.com/s2/favicons?domain=deepseek.com&sz=128"
  if (/dify/i.test(source)) return "https://www.google.com/s2/favicons?domain=dify.ai&sz=128"
  if (/n8n/i.test(source)) return "https://cdn.simpleicons.org/n8n"
  if (/github/i.test(source)) return "https://cdn.simpleicons.org/github"
  if (/coze|扣子/i.test(source)) return "https://www.google.com/s2/favicons?domain=coze.cn&sz=128"
  if (/阿里|通义/i.test(source)) return "https://www.google.com/s2/favicons?domain=aliyun.com&sz=128"
  return ""
}

export function screenshotImage(url: string) {
  if (!/^https?:\/\//i.test(url || "")) return ""
  return `https://image.thum.io/get/width/900/crop/600/${encodeURIComponent(url)}`
}

export function communityImage(input: string) {
  const text = input.toLowerCase()
  if (/n8n|工作流|自动化|早报|周报/.test(text)) return screenshotImage("https://n8n.io")
  if (/dify|知识库|客服/.test(text)) return screenshotImage("https://dify.ai")
  if (/coze|扣子|微信/.test(text)) return screenshotImage("https://www.coze.cn")
  if (/openclaw|qclaw|github|agent/.test(text)) return screenshotImage("https://github.com")
  if (/claude|code/.test(text)) return screenshotImage("https://claude.ai")
  if (/deepseek|模型/.test(text)) return screenshotImage("https://www.deepseek.com")
  if (/飞书|表格|办公/.test(text)) return screenshotImage("https://www.feishu.cn")
  return ""
}
