export function brandLogoFromName(name: string) {
  return simpleIconFromName(name) || ""
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
  return domainIconSources(url)[0] || ""
}

export function domainIconSources(url: string) {
  try {
    const host = new URL(url).hostname
    const cleanHost = host.replace(/^www\./, "")
    return [
      simpleIconFromName(cleanHost),
      `https://favicon.im/${cleanHost}?larger=true`,
      `https://icons.duckduckgo.com/ip3/${cleanHost}.ico`,
      `https://www.google.com/s2/favicons?domain=${cleanHost}&sz=128`,
    ].filter(Boolean)
  } catch {
    return []
  }
}

export function sourceLogo(source: string) {
  return sourceLogoSources(source)[0] || ""
}

export function sourceLogoSources(source: string) {
  const site = sourceSite(source)
  return [
    simpleIconFromName(source),
    site ? domainIconSources(site) : [],
  ].flat().filter(Boolean)
}

export function sourceSite(source: string) {
  if (/openai/i.test(source)) return "https://openai.com"
  if (/anthropic|claude/i.test(source)) return "https://www.anthropic.com"
  if (/deepseek|深度求索/i.test(source)) return "https://www.deepseek.com"
  if (/dify/i.test(source)) return "https://dify.ai"
  if (/n8n/i.test(source)) return "https://n8n.io"
  if (/github/i.test(source)) return "https://github.com"
  if (/coze|扣子/i.test(source)) return "https://www.coze.cn"
  if (/阿里|通义|阿里云/i.test(source)) return "https://www.aliyun.com"
  if (/google|gemini/i.test(source)) return "https://blog.google"
  if (/meta|llama/i.test(source)) return "https://ai.meta.com"
  if (/微软|microsoft|copilot/i.test(source)) return "https://www.microsoft.com"
  if (/网易/i.test(source)) return "https://www.163.com"
  if (/中关村|zol/i.test(source)) return "https://www.zol.com.cn"
  if (/火山|字节|即梦/i.test(source)) return "https://www.volcengine.com"
  if (/智谱|glm/i.test(source)) return "https://www.bigmodel.cn"
  if (/ollama/i.test(source)) return "https://ollama.com"
  if (/suno/i.test(source)) return "https://suno.com"
  if (/science/i.test(source)) return "https://www.science.org"
  return ""
}

export function screenshotImage(url: string) {
  return screenshotImageSources(url)[0] || ""
}

export function screenshotImageSources(url: string) {
  if (!/^https?:\/\//i.test(url || "")) return []
  const encoded = encodeURIComponent(url)
  return [
    `https://s.wordpress.com/mshots/v1/${encoded}?w=900`,
    `https://image.thum.io/get/width/900/crop/600/${url}`,
    `https://image.thum.io/get/width/900/crop/600/${encoded}`,
  ]
}

export function toolLogoSources(name: string, url: string, logo?: string) {
  return [
    logo,
    simpleIconFromName(name),
    ...domainIconSources(url),
  ].filter(Boolean)
}

function simpleIconFromName(name: string) {
  const entries: Array<[RegExp, string]> = [
    [/chatgpt|openai|dall|sora|codex/i, "openai"],
    [/claude|anthropic|mcp/i, "anthropic"],
    [/github copilot|github-copilot/i, "githubcopilot"],
    [/github/i, "github"],
    [/gemini|google/i, "googlegemini"],
    [/kimi|moonshot|月之暗面/i, "moonshot"],
    [/deepseek|深度求索/i, "deepseek"],
    [/通义|阿里|aliyun|dashscope|qwen|modelscope|魔搭/i, "alibabacloud"],
    [/豆包|火山|字节|volcengine|marscode/i, "bytedance"],
    [/百度|文心|ernie|aistudio/i, "baidu"],
    [/讯飞|xinghuo|xfyun/i, "iflytek"],
    [/midjourney/i, "midjourney"],
    [/stability|stable diffusion|clipdrop/i, "stabilityai"],
    [/runway/i, "runway"],
    [/pika/i, "pika"],
    [/capcut|剪映/i, "capcut"],
    [/heygen/i, "heygen"],
    [/canva/i, "canva"],
    [/figma/i, "figma"],
    [/notion/i, "notion"],
    [/gamma/i, "gamma"],
    [/feishu|飞书|lark/i, "lark"],
    [/microsoft|copilot|power bi|powerbi|office/i, "microsoft"],
    [/zapier/i, "zapier"],
    [/make/i, "make"],
    [/n8n/i, "n8n"],
    [/dify/i, "dify"],
    [/hugging\s?face|huggingface/i, "huggingface"],
    [/ollama/i, "ollama"],
    [/cursor/i, "cursor"],
    [/windsurf|codeium/i, "codeium"],
    [/vercel|v0/i, "vercel"],
    [/replit/i, "replit"],
    [/sourcegraph|cody/i, "sourcegraph"],
    [/tabnine/i, "tabnine"],
    [/warp/i, "warp"],
    [/langchain|langgraph/i, "langchain"],
    [/perplexity/i, "perplexity"],
    [/grammarly/i, "grammarly"],
    [/quillbot/i, "quillbot"],
    [/jasper/i, "jasper"],
    [/copy\.ai|copy-ai/i, "copyai"],
    [/writesonic/i, "writesonic"],
    [/suno/i, "suno"],
    [/elevenlabs|11labs/i, "elevenlabs"],
    [/descript/i, "descript"],
    [/otter/i, "otter"],
    [/fireflies/i, "firefliesai"],
    [/coursera/i, "coursera"],
    [/udacity/i, "udacity"],
    [/datacamp/i, "datacamp"],
    [/brilliant/i, "brilliant"],
    [/deeplearning\.ai/i, "deeplearningdotai"],
    [/julius/i, "julius"],
    [/tableau/i, "tableau"],
    [/dataiku/i, "dataiku"],
    [/runpod/i, "runpod"],
    [/modal/i, "modal"],
    [/slack/i, "slack"],
    [/discord/i, "discord"],
  ]
  const found = entries.find(([pattern]) => pattern.test(name))
  return found ? `https://cdn.simpleicons.org/${found[1]}` : ""
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
