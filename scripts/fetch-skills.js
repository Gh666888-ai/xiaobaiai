const https = require("https")
const fs = require("fs")
const path = require("path")
const crypto = require("crypto")

const appDir = path.join(__dirname, "..")
const outputPath = path.join(appDir, "public", "fetched-skills.json")
const envPath = path.join(appDir, ".env.local")

loadEnv(envPath)

const githubQueries = [
  { name: "GitHub Agent Skill", q: "agent skill mcp created:>2026-01-01", platform: "通用", sourceWeight: 8 },
  { name: "GitHub MCP Server", q: "mcp server agent created:>2026-01-01", platform: "通用", sourceWeight: 8 },
  { name: "GitHub OpenClaw Skill", q: "openclaw skill created:>2026-01-01", platform: "OpenClaw", sourceWeight: 9 },
  { name: "GitHub Claude Code Skill", q: "claude code skill created:>2026-01-01", platform: "通用", sourceWeight: 7 },
]

const pageSources = [
  { name: "ClawHub Skills", url: "https://clawhub.ai/skills", platform: "OpenClaw", sourceWeight: 9 },
  { name: "Dify Blog", url: "https://dify.ai/blog", platform: "Dify", sourceWeight: 6 },
  { name: "n8n Blog", url: "https://blog.n8n.io", platform: "n8n", sourceWeight: 6 },
]

const industryRules = [
  { name: "电商店铺", keywords: ["shop", "product", "ecommerce", "小红书", "content", "review", "browser", "customer", "客服", "商品", "竞品"] },
  { name: "教育培训", keywords: ["course", "education", "teacher", "student", "ppt", "summary", "quiz", "知识库", "课程"] },
  { name: "自媒体短视频", keywords: ["video", "image", "prompt", "script", "content", "youtube", "bilibili", "小红书", "抖音"] },
  { name: "企业办公", keywords: ["meeting", "notion", "slack", "feishu", "report", "email", "calendar", "document", "周报", "会议"] },
  { name: "开发产品", keywords: ["github", "code", "deploy", "api", "database", "test", "review", "shell", "terminal"] },
]

const fallbackItems = [
  {
    name: "skill-vetter",
    source: "小白安全基线",
    url: "https://clawhub.ai/skills",
    description: "安装任何 Agent Skill 前先做安全检查，适合放在所有行业 Skill 推荐的第一位。",
    platform: "OpenClaw",
  },
  {
    name: "Agent Browser",
    source: "小白必装能力",
    url: "https://clawhub.ai/skills",
    description: "让 Agent 能打开网页、点击、截图和读取页面，适合电商、内容、运营、研究。",
    platform: "OpenClaw",
  },
  {
    name: "tavily-search",
    source: "小白必装能力",
    url: "https://clawhub.ai/skills",
    description: "给 Agent 增加联网搜索和来源引用能力，适合做资料核查和行业研究。",
    platform: "OpenClaw",
  },
]

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) return
  const text = fs.readFileSync(filePath, "utf8")
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue
    const index = trimmed.indexOf("=")
    const key = trimmed.slice(0, index).trim()
    const value = trimmed.slice(index + 1).trim().replace(/^['"]|['"]$/g, "")
    if (key && !process.env[key]) process.env[key] = value
  }
}

function requestText(url, timeout = 12000, headers = {}) {
  return new Promise((resolve) => {
    let settled = false
    const done = (value = "") => {
      if (settled) return
      settled = true
      resolve(value)
    }

    let req
    try {
      req = https.get(url, {
        headers: {
          "User-Agent": "XiaobaiAI-SkillScout/1.0",
          "Accept": "text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8",
          ...headers,
        },
        timeout,
      }, (res) => {
        if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location) {
          const nextUrl = new URL(res.headers.location, url).toString()
          res.resume()
          requestText(nextUrl, timeout, headers).then(done)
          return
        }
        let data = ""
        res.setEncoding("utf8")
        res.on("data", (chunk) => {
          data += chunk
          if (data.length > 900000) {
            done(data)
            req.destroy()
          }
        })
        res.on("end", () => done(data))
        res.on("aborted", () => done(data))
        res.on("error", () => done(data))
      })
    } catch {
      done("")
      return
    }

    req.on("error", () => done(""))
    req.on("timeout", () => {
      done("")
      req.destroy()
    })
  })
}

function stripHTML(input = "") {
  return decodeHTML(String(input)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim())
}

function decodeHTML(input = "") {
  return String(input)
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(Number(num)))
}

function hash(input) {
  return crypto.createHash("sha1").update(input).digest("hex").slice(0, 12)
}

function absoluteUrl(base, href = "") {
  if (!href || href.startsWith("#") || href.startsWith("javascript:")) return ""
  try {
    return new URL(href, base).toString()
  } catch {
    return ""
  }
}

function includesAny(text, keywords) {
  const lowered = text.toLowerCase()
  return keywords.some((keyword) => lowered.includes(keyword.toLowerCase()))
}

function hasTemplateNoise(text = "") {
  return /\$\{|%7B|%7D|{{|}}|undefined|null/i.test(String(text))
}

function isGenericLinkTitle(title = "") {
  const text = String(title).trim().replace(/\s+/g, " ").replace(/[>›»]+$/g, "").trim().toLowerCase()
  if (!text || text.length < 4) return true
  return [
    "skills",
    "publish skill",
    "show more",
    "learn more",
    "read more",
    "explore workflows",
    "explore 800+ workflow templates",
    "customer support",
    "lead generation",
    "automated data sync",
  ].includes(text)
}

function isLikelySkillOrWorkflow({ title = "", href = "", sourceName = "" }) {
  const text = `${title} ${href} ${sourceName}`
  if (hasTemplateNoise(text) || isGenericLinkTitle(title)) return false
  if (/\/workflows\/?$/.test(href) || /\/skills\/?$/.test(href)) return false
  if (/github\.com\/[^/]+\/[^/#?]+/.test(href)) return true
  if (/\/workflows\/\d+[-/]/.test(href)) return /agent|mcp|ai|openai|workflow|automation|scrape|summarize|bot|chat/i.test(text)
  return /skill|agent|mcp|workflow|automation|plugin|插件|技能|智能体|工作流/i.test(text)
}

function inferCategory(text) {
  if (/security|audit|permission|安全|审计|权限|隐私/i.test(text)) return "安全隐私"
  if (/github|code|deploy|api|database|test|开发|代码|部署/i.test(text)) return "开发工具"
  if (/browser|search|workflow|automation|mcp|自动化|搜索|浏览器/i.test(text)) return "自动化"
  if (/content|video|image|prompt|script|文案|视频|图片|提示词/i.test(text)) return "内容创作"
  if (/meeting|report|email|notion|office|会议|周报|办公/i.test(text)) return "办公效率"
  if (/knowledge|rag|客服|知识库|企业/i.test(text)) return "企业应用"
  return "自动化"
}

function recommendedFor(text) {
  return industryRules
    .filter((rule) => includesAny(text, rule.keywords))
    .map((rule) => rule.name)
}

function scoreCandidate(item) {
  const text = `${item.name} ${item.description || ""} ${item.url || ""}`
  const safety = /vetter|security|audit|permission|safe|安全|审计|权限/i.test(text) ? 18 : 8
  const agentFit = /agent|skill|mcp|tool|workflow|browser|search|openclaw|claude|codex|智能体|技能|工作流/i.test(text) ? 28 : 8
  const beginnerFit = /template|example|starter|no-code|one-click|guide|教程|模板|零代码|一键/i.test(text) ? 16 : 10
  const workflowFit = Math.min(24, recommendedFor(text).length * 6 + (/browser|search|github|notion|feishu|slack|dify|n8n/i.test(text) ? 8 : 0))
  const stars = Number(item.stars || 0)
  const sourceFit = Math.min(14, (item.sourceWeight || 6) + Math.round(Math.log10(stars + 1) * 2))
  const total = Math.max(0, Math.min(100, safety + agentFit + beginnerFit + workflowFit + sourceFit))

  return {
    score: total,
    scoreBreakdown: {
      safety,
      agentFit,
      beginnerFit,
      workflowFit,
      sourceFit,
    },
  }
}

function normalizeItem(raw) {
  const text = `${raw.name || ""} ${raw.description || ""} ${raw.url || ""}`
  const fit = recommendedFor(text)
  const scored = scoreCandidate(raw)
  return {
    id: hash(`${raw.name}-${raw.url}`),
    name: raw.name,
    source: raw.source,
    url: raw.url,
    platform: raw.platform || "通用",
    category: raw.category || inferCategory(text),
    description: (raw.description || "发现一个可能适合 Agent 扩展的新能力，需要站长人工确认后再推荐给新手。").slice(0, 220),
    score: scored.score,
    scoreBreakdown: scored.scoreBreakdown,
    recommendedFor: fit.length ? fit : ["企业办公"],
    reason: buildReason(raw, fit, scored.score),
    safetyNote: /vetter|security|audit|安全|审计/i.test(text)
      ? "偏安全检查能力，可以优先作为安装前置步骤。"
      : "未人工复核前，只进入候选池；推荐安装前先用 skill-vetter 或人工看源码。",
    stars: Number(raw.stars || 0),
    updatedAt: raw.updatedAt || raw.pushedAt || "",
    discoveredAt: new Date().toISOString(),
  }
}

function buildReason(item, fit, score) {
  const users = fit.length ? fit.slice(0, 2).join("、") : "新手工作流"
  if (score >= 80) return `和 ${users} 匹配度高，适合进入小白推荐池前列。`
  if (score >= 65) return `有明确 Agent/Skill 价值，适合加入候选池等待人工复核。`
  return "信息还不够完整，先低分收录，避免直接推荐给新手。"
}

async function fetchGithubCandidates() {
  const candidates = []
  for (const source of githubQueries) {
    const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(source.q)}&sort=updated&order=desc&per_page=8`
    const body = await requestText(url, 12000, { Accept: "application/vnd.github+json" })
    if (!body) continue
    try {
      const data = JSON.parse(body)
      for (const repo of data.items || []) {
        candidates.push({
          name: repo.full_name || repo.name,
          source: source.name,
          url: repo.html_url,
          description: repo.description || "",
          platform: source.platform,
          sourceWeight: source.sourceWeight,
          stars: repo.stargazers_count || 0,
          updatedAt: repo.updated_at,
          pushedAt: repo.pushed_at,
        })
      }
    } catch {
      continue
    }
  }
  return candidates
}

async function fetchPageCandidates() {
  const candidates = []
  for (const source of pageSources) {
    const html = await requestText(source.url)
    if (!html) continue
    const seen = new Set()
    const linkRegex = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi
    let match
    while ((match = linkRegex.exec(html)) !== null && candidates.length < 80) {
      const href = absoluteUrl(source.url, match[1])
      const title = stripHTML(match[2]).replace(/Learn more|Read more|查看|更多|详情/gi, "").trim()
      if (!href || !title || title.length < 4 || title.length > 90) continue
      if (!isLikelySkillOrWorkflow({ title, href, sourceName: source.name })) continue
      const key = `${source.name}-${title.toLowerCase()}`
      if (seen.has(key)) continue
      seen.add(key)
      candidates.push({
        name: title,
        source: source.name,
        url: href,
        description: `${source.name} 页面发现的 Skill/Agent 能力候选。`,
        platform: source.platform,
        sourceWeight: source.sourceWeight,
      })
    }
  }
  return candidates
}

function mergeWithPrevious(items) {
  if (!fs.existsSync(outputPath)) return items
  try {
    const previous = JSON.parse(fs.readFileSync(outputPath, "utf8"))
    const oldItems = Array.isArray(previous.items)
      ? previous.items.filter((item) => isLikelySkillOrWorkflow({ title: item.name, href: item.url, sourceName: item.source }))
      : []
    const map = new Map()
    for (const item of oldItems) map.set(item.id || hash(`${item.name}-${item.url}`), item)
    for (const item of items) map.set(item.id, { ...map.get(item.id), ...item, discoveredAt: map.get(item.id)?.discoveredAt || item.discoveredAt })
    return Array.from(map.values())
  } catch {
    return items
  }
}

async function main() {
  const fetched = [
    ...(await fetchGithubCandidates()),
    ...(await fetchPageCandidates()),
  ]

  const rawItems = fetched.length ? fetched : fallbackItems
  const unique = new Map()
  for (const raw of rawItems) {
    if (!raw.name || !raw.url) continue
    const item = normalizeItem(raw)
    unique.set(item.id, item)
  }

  const items = mergeWithPrevious(Array.from(unique.values()))
    .sort((a, b) => b.score - a.score)
    .slice(0, 80)

  const payload = {
    lastRunAt: new Date().toISOString(),
    sourcesChecked: githubQueries.length + pageSources.length,
    candidates: fetched.length,
    items,
    note: fetched.length
      ? "自动发现结果已写入。高分项仍建议人工复核后再做站内强推荐。"
      : "本次网络抓取没有拿到结果，已保留小白安全基线候选，脚本下次会继续抓取。",
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8")
  console.log(`[xiaobai-skill-scout] candidates=${fetched.length} wrote=${items.length} -> ${outputPath}`)
}

main().catch((error) => {
  console.error("[xiaobai-skill-scout] failed", error)
  process.exitCode = 1
})
