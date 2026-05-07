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
  const safeDomainFallback = shouldUseDomainLogo(name)
  return [
    logo,
    ...curatedLogoSources(name, url),
    simpleIconFromName(name),
    ...(safeDomainFallback ? domainIconSources(url) : []),
  ].filter(Boolean).filter((item, index, arr) => arr.indexOf(item) === index)
}

function shouldUseDomainLogo(name: string) {
  const text = name.toLowerCase()
  if (/\s\d+$/.test(text)) return false
  if (/novachat|askflow|mindpal|promptmate|dialoghub|answerly|pixelmuse|artpilot|dreamcanvas|postergen|visioncraft|styleforge|motionai|clipforge|videopilot|sceneflow|shortsgen|framemagic|writewise|copypilot|blogforge|storymind|textspark|notegenius|codepilot|devmate|bugfixer|repomind|stackagent|codeflow|officemind|pptpilot|docuflow|meetingnote|sheetmate|reportgen|sourceseek|answermap|researcher|webmind|factfinder|searchpilot|agentdock|flowagent|taskcrew|autopilot|botstudio|agentgrid|modelhub|infercloud|llmstack|promptapi|modelroute|gpuflow|voiceforge|audiomind|songpilot|podgen|speechlab|soundcraft|designpilot|logomind|brandforge|uimate|layoutai|vectorgen|growthpilot|admind|campaignai|seoforge|leadflow|socialspark|datapilot|sheetmind|insightlab|chartgen|sqlmate|biflow|studymate|tutorai|quizforge|coursemind|learnpilot|examcoach|taskmind|autodesk|memoflow|calendarai|inboxpilot|focusmate/.test(text)) return false
  return true
}

function googleFavicon(domain: string) {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
}

function curatedLogoSources(name: string, url: string) {
  const text = `${name} ${url}`.toLowerCase()
  const items: Array<[RegExp, string[]]> = [
    [/chatgpt|dall|sora|codex|openai/, ["https://cdn.simpleicons.org/openai", googleFavicon("openai.com")]],
    [/claude|anthropic/, ["https://cdn.simpleicons.org/anthropic", googleFavicon("anthropic.com"), googleFavicon("claude.ai")]],
    [/deepseek|深度求索/, ["https://cdn.simpleicons.org/deepseek", googleFavicon("deepseek.com"), googleFavicon("chat.deepseek.com")]],
    [/kimi|moonshot|月之暗面/, [googleFavicon("kimi.moonshot.cn"), googleFavicon("moonshot.cn")]],
    [/通义|tongyi|wanxiang|灵码|aliyun|qwen|modelscope|魔搭|阿里/, ["https://cdn.simpleicons.org/alibabacloud", googleFavicon("tongyi.aliyun.com"), googleFavicon("aliyun.com"), googleFavicon("modelscope.cn")]],
    [/豆包|doubao/, [googleFavicon("doubao.com")]],
    [/火山|volcengine|huoshan/, ["https://cdn.simpleicons.org/bytedance", googleFavicon("volcengine.com")]],
    [/即梦|jimeng|剪映|jianying|capcut/, ["https://cdn.simpleicons.org/capcut", googleFavicon("jimeng.jianying.com"), googleFavicon("jianying.com"), googleFavicon("capcut.com")]],
    [/文心|ernie|百度|yiyan|aistudio|wenxin/, ["https://cdn.simpleicons.org/baidu", googleFavicon("yiyan.baidu.com"), googleFavicon("baidu.com")]],
    [/讯飞|xinghuo|xfyun|ifly|听见|xunfei/, [googleFavicon("xfyun.cn"), googleFavicon("xinghuo.xfyun.cn"), googleFavicon("iflyrec.com")]],
    [/腾讯|hunyuan|qclaw/, [googleFavicon("tencent.com"), googleFavicon("hunyuan.tencent.com")]],
    [/gemini|google ai overview|google/, ["https://cdn.simpleicons.org/googlegemini", "https://cdn.simpleicons.org/google", googleFavicon("gemini.google.com"), googleFavicon("google.com")]],
    [/grok|xai/, ["https://cdn.simpleicons.org/x", googleFavicon("grok.com"), googleFavicon("x.ai")]],
    [/character\.ai|character-ai/, googleList("character.ai")],
    [/poe/, googleList("poe.com")],
    [/midjourney/, ["https://cdn.simpleicons.org/midjourney", googleFavicon("midjourney.com")]],
    [/stable diffusion|stability|clipdrop/, ["https://cdn.simpleicons.org/stabilityai", googleFavicon("stability.ai"), googleFavicon("clipdrop.co")]],
    [/leonardo/, googleList("leonardo.ai")],
    [/ideogram/, googleList("ideogram.ai")],
    [/seaart/, googleList("seaart.ai")],
    [/pixai/, googleList("pixai.art")],
    [/runway/, ["https://cdn.simpleicons.org/runway", googleFavicon("runwayml.com")]],
    [/可灵|kling|快手/, [googleFavicon("kling.kuaishou.com"), googleFavicon("kuaishou.com")]],
    [/pika/, ["https://cdn.simpleicons.org/pika", googleFavicon("pika.art")]],
    [/heygen/, ["https://cdn.simpleicons.org/heygen", googleFavicon("heygen.com")]],
    [/synthesia/, googleList("synthesia.io")],
    [/invideo/, googleList("invideo.io")],
    [/notion/, ["https://cdn.simpleicons.org/notion", googleFavicon("notion.so")]],
    [/秘塔|xiezuocat/, googleList("xiezuocat.com")],
    [/jasper/, ["https://cdn.simpleicons.org/jasper", googleFavicon("jasper.ai")]],
    [/copy\.ai|copyai|copy-ai/, ["https://cdn.simpleicons.org/copyai", googleFavicon("copy.ai")]],
    [/writesonic/, ["https://cdn.simpleicons.org/writesonic", googleFavicon("writesonic.com")]],
    [/jenni/, googleList("jenni.ai")],
    [/rytr/, googleList("rytr.me")],
    [/cursor/, ["https://cdn.simpleicons.org/cursor", googleFavicon("cursor.sh")]],
    [/github copilot|github-copilot/, ["https://cdn.simpleicons.org/githubcopilot", "https://cdn.simpleicons.org/github", googleFavicon("github.com")]],
    [/windsurf|codeium/, ["https://cdn.simpleicons.org/codeium", googleFavicon("codeium.com"), googleFavicon("windsurf.com")]],
    [/bolt/, googleList("bolt.new")],
    [/v0|vercel/, ["https://cdn.simpleicons.org/vercel", googleFavicon("v0.dev"), googleFavicon("vercel.com")]],
    [/lovable/, googleList("lovable.dev")],
    [/sourcegraph|cody/, ["https://cdn.simpleicons.org/sourcegraph", googleFavicon("sourcegraph.com")]],
    [/replit/, ["https://cdn.simpleicons.org/replit", googleFavicon("replit.com")]],
    [/tabnine/, ["https://cdn.simpleicons.org/tabnine", googleFavicon("tabnine.com")]],
    [/gamma/, ["https://cdn.simpleicons.org/gamma", googleFavicon("gamma.app")]],
    [/飞书|feishu|lark/, ["https://cdn.simpleicons.org/lark", googleFavicon("feishu.cn")]],
    [/beautiful/, googleList("beautiful.ai")],
    [/otter/, ["https://cdn.simpleicons.org/otter", googleFavicon("otter.ai")]],
    [/fireflies/, ["https://cdn.simpleicons.org/firefliesai", googleFavicon("fireflies.ai")]],
    [/aippt/, googleList("aippt.cn")],
    [/motion/, googleList("usemotion.com")],
    [/perplexity/, ["https://cdn.simpleicons.org/perplexity", googleFavicon("perplexity.ai")]],
    [/devv/, googleList("devv.ai")],
    [/天工|tiangong/, googleList("tiangong.cn")],
    [/dify/, ["https://cdn.simpleicons.org/dify", googleFavicon("dify.ai")]],
    [/openclaw|hermes|github\.com/, ["https://cdn.simpleicons.org/github", googleFavicon("github.com")]],
    [/coze|扣子/, [googleFavicon("coze.cn")]],
    [/n8n/, ["https://cdn.simpleicons.org/n8n", googleFavicon("n8n.io")]],
    [/flowise/, googleList("flowiseai.com")],
    [/make|integromat/, ["https://cdn.simpleicons.org/make", googleFavicon("make.com")]],
    [/hugging\s?face|huggingface/, ["https://cdn.simpleicons.org/huggingface", googleFavicon("huggingface.co")]],
    [/replicate/, ["https://cdn.simpleicons.org/replicate", googleFavicon("replicate.com")]],
    [/ollama/, ["https://cdn.simpleicons.org/ollama", googleFavicon("ollama.com")]],
    [/groq/, googleList("groq.com")],
    [/siliconflow|硅基流动/, googleList("siliconflow.cn")],
    [/openrouter/, googleList("openrouter.ai")],
    [/suno/, ["https://cdn.simpleicons.org/suno", googleFavicon("suno.com")]],
    [/udio/, googleList("udio.com")],
    [/elevenlabs/, ["https://cdn.simpleicons.org/elevenlabs", googleFavicon("elevenlabs.io")]],
    [/网易|notebynote|天音/, googleList("music.163.com")],
    [/aiva/, googleList("aiva.ai")],
    [/mubert/, googleList("mubert.com")],
    [/descript/, ["https://cdn.simpleicons.org/descript", googleFavicon("descript.com")]],
    [/canva/, ["https://cdn.simpleicons.org/canva", googleFavicon("canva.com")]],
    [/figma/, ["https://cdn.simpleicons.org/figma", googleFavicon("figma.com")]],
    [/galileo/, googleList("usegalileo.ai")],
    [/uizard/, googleList("uizard.io")],
    [/remove\.bg|removebg/, googleList("remove.bg")],
    [/稿定|gaoding/, googleList("gaoding.com")],
    [/adcreative/, googleList("adcreative.ai")],
    [/julius/, ["https://cdn.simpleicons.org/julius", googleFavicon("julius.ai")]],
    [/chatcsv/, googleList("chatcsv.co")],
    [/chatexcel/, googleList("chatexcel.com")],
    [/nanonets/, googleList("nanonets.com")],
    [/waytoagi/, googleList("waytoagi.com")],
    [/ai-bot/, googleList("ai-bot.cn")],
    [/fast\.ai/, googleList("fast.ai")],
    [/datawhale/, googleList("datawhale.club")],
    [/mem/, googleList("get.mem.ai")],
    [/taskade/, googleList("taskade.com")],
    [/sanebox/, googleList("sanebox.com")],
    [/monica/, googleList("monica.im")],
  ]
  return items.find(([pattern]) => pattern.test(text))?.[1] || []
}

function googleList(domain: string) {
  return [googleFavicon(domain)]
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
