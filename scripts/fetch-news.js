const https = require("https")
const fs = require("fs")
const path = require("path")
const crypto = require("crypto")

const appDir = path.join(__dirname, "..")
const outputPath = path.join(appDir, "public", "fetched-news.json")
const envPath = path.join(appDir, ".env.local")
const today = new Date().toISOString().slice(0, 10)

loadEnv(envPath)

const sources = [
  { name: "机器之心", host: "www.jiqizhixin.com", path: "/", imp: 8, cat: "行业动态" },
  { name: "量子位", host: "www.qbitai.com", path: "/", imp: 8, cat: "行业动态" },
  { name: "36氪 AI", host: "36kr.com", path: "/information/AI", imp: 7, cat: "行业动态" },
  { name: "InfoQ AI", host: "www.infoq.cn", path: "/topic/AI", imp: 7, cat: "行业动态" },
  { name: "雷峰网 AI", host: "www.leiphone.com", path: "/category/ai", imp: 7, cat: "行业动态" },
  { name: "钛媒体", host: "www.tmtpost.com", path: "/", imp: 6, cat: "行业动态" },
  { name: "CSDN AI", host: "www.csdn.net", path: "/nav/ai", imp: 6, cat: "教程资源" },
  { name: "Dify Blog", host: "dify.ai", path: "/blog", imp: 7, cat: "教程资源" },
  { name: "n8n Blog", host: "blog.n8n.io", path: "/", imp: 6, cat: "教程资源" },
  { name: "GitHub Trending", host: "github.com", path: "/trending?since=daily", imp: 6, cat: "开源项目" },
  { name: "Hugging Face Papers", host: "huggingface.co", path: "/papers", imp: 8, cat: "开源项目" },
]

const aiKeywords = [
  "AI", "AIGC", "Agent", "智能体", "大模型", "模型", "DeepSeek", "OpenAI", "Claude", "Gemini",
  "机器人", "多模态", "推理", "生成式", "Dify", "n8n", "工作流", "自动化", "算力", "开源",
  "Copilot", "Cursor", "RAG", "知识库", "语音", "视频生成", "图像生成",
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

function requestText(url, timeout = 10000) {
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
          "User-Agent": "Mozilla/5.0 XiaobaiAI-NewsBot/1.0",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
        timeout,
      }, (res) => {
        if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location) {
          const nextUrl = new URL(res.headers.location, url).toString()
          res.resume()
          requestText(nextUrl, timeout).then(done)
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

function absoluteUrl(host, href = "") {
  if (!href || href.startsWith("#") || href.startsWith("javascript:")) return ""
  try {
    return new URL(href, `https://${host}`).toString()
  } catch {
    return ""
  }
}

function hash(input) {
  return crypto.createHash("sha1").update(input).digest("hex").slice(0, 12)
}

function hasAIKeyword(text) {
  return aiKeywords.some((kw) => text.toLowerCase().includes(kw.toLowerCase()))
}

function inferCategory(title, fallback) {
  if (/教程|指南|入门|实战|部署|安装|配置|怎么|如何|搭建|工作流|Dify|n8n|RAG|知识库/i.test(title)) return "教程资源"
  if (/发布|推出|上线|升级|更新|开源|版本|模型|API/i.test(title)) return "产品发布"
  if (/监管|政策|合规|安全|风险|版权|隐私|治理/i.test(title)) return "政策监管"
  if (/GitHub|开源|论文|Paper|Hugging|Llama|Qwen|GLM|DeepSeek/i.test(title)) return "开源项目"
  if (/对比|评测|排行|价格|趋势|报告|解读|为什么/i.test(title)) return "深度解读"
  return fallback || "行业动态"
}

function extractMetaDescription(html) {
  const patterns = [
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i,
    /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["'][^>]*>/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["'][^>]*>/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["'][^>]*>/i,
  ]
  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match?.[1]) return stripHTML(match[1]).slice(0, 240)
  }
  return ""
}

function extractImage(html, url) {
  const patterns = [
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["'][^>]*>/i,
    /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["'][^>]*>/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["'][^>]*>/i,
  ]
  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match?.[1]) {
      try {
        return new URL(decodeHTML(match[1]), url).toString()
      } catch {
        return ""
      }
    }
  }
  return ""
}

function extractCandidates(html, source) {
  const candidates = []
  const seen = new Set()
  const linkRegex = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi
  let match
  while ((match = linkRegex.exec(html)) !== null) {
    const href = absoluteUrl(source.host, match[1])
    const title = stripHTML(match[2])
      .replace(/阅读全文|查看详情|更多|Read more/gi, "")
      .trim()
    if (!href || !title || title.length < 8 || title.length > 120) continue
    if (!/[\u4e00-\u9fa5A-Za-z]/.test(title)) continue
    if (!hasAIKeyword(`${title} ${href}`)) continue
    const key = title.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    candidates.push({
      title,
      url: href,
      source: source.name,
      category: inferCategory(title, source.cat),
      importance: source.imp + (/DeepSeek|OpenAI|Claude|Agent|智能体|工作流|开源|模型/i.test(title) ? 1 : 0),
    })
    if (candidates.length >= 8) break
  }
  return candidates
}

function sourceLogo(source) {
  if (/GitHub/i.test(source)) return "https://cdn.simpleicons.org/github"
  if (/Hugging/i.test(source)) return "https://cdn.simpleicons.org/huggingface"
  if (/Dify/i.test(source)) return "https://www.google.com/s2/favicons?domain=dify.ai&sz=128"
  if (/n8n/i.test(source)) return "https://cdn.simpleicons.org/n8n"
  if (/CSDN/i.test(source)) return "https://www.google.com/s2/favicons?domain=csdn.net&sz=128"
  if (/InfoQ/i.test(source)) return "https://www.google.com/s2/favicons?domain=infoq.cn&sz=128"
  return ""
}

function buildTemplateArticle(item, pageDescription) {
  const title = item.title
  const category = item.category
  const base = pageDescription || item.summary || title
  const isTutorial = category === "教程资源"
  const isProduct = category === "产品发布"
  const isOpenSource = category === "开源项目"

  if (isTutorial) {
    return `## 小白编辑部解读
${base}

## 这篇内容适合谁
适合想把「${title}」真正落地的人。你不需要一开始就懂所有技术名词，先按一个小目标跑通，再逐步扩大范围。

## 建议准备
1. 准备一个明确任务，比如客服问答、资讯早报、资料总结、表格分析或个人知识库。
2. 准备常用邮箱、手机号和一个单独记录配置的位置。
3. 如果涉及 API Key，先设置预算和额度，密钥不要发到公开聊天、截图或代码仓库里。

## 小白执行路线
第一步，先读官方入口和账号要求，确认是否有免费额度、地区限制、模型限制和插件要求。

第二步，用最小任务跑通一次。知识库类工具先上传 1 个文档，自动化类工具先串 2 个节点，编程类工具先修一个很小的问题。

第三步，检查输出。重点看事实、数字、链接、权限、隐私和是否误删内容。

第四步，保存模板。把能复用的提示词、工作流、节点配置和检查清单保存下来，下次只改变量。

## 常见踩坑
- 第一次目标太大，导致配置复杂、失败也不知道错在哪里。
- 只看演示视频，不用自己的真实任务测试。
- 不看价格和额度，正式使用后才发现成本超出预期。
- 让 Agent 直接操作重要文件，但没有提前备份。

## 小白AI建议
先把它当成一个可复制的小实验。连续三次能稳定完成，再把它放进你的日常工作流。`
  }

  if (isProduct || isOpenSource) {
    return `## 小白编辑部解读
${base}

## 发生了什么
这条资讯的核心是「${title}」。它反映出 AI 产品正在继续向更低门槛、更强自动化、更贴近真实业务的方向演进。

## 为什么值得关注
对普通用户来说，真正重要的不是参数多大，而是它能不能减少配置成本、提高稳定性、支持中文场景，并且在出错时容易回退。

## 可以怎么用
- 写作和总结：把长文档、会议记录、网页内容整理成清单。
- 办公提效：生成周报、PPT 大纲、邮件回复和表格分析。
- 学习辅助：让 AI 按你的水平解释概念，再给练习题。
- 工作流自动化：把固定流程交给工具执行，但关键步骤保留人工确认。

## 需要注意
产品发布初期功能可能灰度开放，价格、额度、模型名称和可用地区也可能调整。正式用于业务前，建议用一两个真实案例测试稳定性。

## 小白AI判断
如果它能直接用、中文体验好、有免费或低成本入口，并且失败后容易回退，就值得新手尝试。`
  }

  return `## 小白编辑部解读
${base}

## 重点拆解
这条资讯值得关注，是因为它和 AI 工具的普及、成本、可用性或行业落地有关。对新手来说，最重要的是判断它是否会影响你现在能做的事。

## 你可以怎么行动
1. 先判断它是否与你当前任务有关。
2. 如果有关，找一个小任务试用，不要直接迁移整个流程。
3. 记录成本、输出质量和失败情况。
4. 连续三次稳定完成后，再考虑长期使用。

## 适合关注的人
- 想用 AI 提高工作效率的人。
- 想给公司或项目搭建 AI 工作流的人。
- 想判断新工具是否值得投入时间的人。
- 正在学习 AI，但不想被概念淹没的人。

## 小白AI建议
把 AI 当成需要调试的助手，而不是一次性买来的万能工具。越具体的场景，越容易获得稳定收益。`
}

function buildSummary(item, pageDescription) {
  const text = pageDescription || item.title
  if (text.length <= 110) return text
  return `${text.slice(0, 108)}...`
}

async function callAIEditor(item, pageDescription) {
  const apiKey = process.env.AI_CHAT_API_KEY || process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY || ""
  if (!apiKey) return null

  const baseURL = (process.env.AI_CHAT_BASE_URL || "https://api.deepseek.com").replace(/\/$/, "")
  const model = process.env.AI_CHAT_MODEL || "deepseek-v4-flash"
  const endpoint = `${baseURL}/v1/chat/completions`
  const prompt = `你是“小白AI资讯编辑部”。请基于标题和来源信息，写一篇站内可读的中文解读文章，不要复制原文，不要编造具体数据。

要求：
1. 输出严格 JSON，字段为 summary 和 content。
2. summary 80-130 字，适合资讯列表。
3. content 使用 Markdown，包含：小白编辑部解读、为什么重要、怎么用、风险提醒、小白AI建议。
4. 语言给完全不懂技术的小白也能看懂。
5. 如果信息不足，就明确写“需要以官方页面为准”，不要假装知道细节。

标题：${item.title}
来源：${item.source}
分类：${item.category}
来源摘要：${pageDescription || "无"}
来源链接：${item.url}`

  const body = JSON.stringify({
    model,
    messages: [
      { role: "system", content: "你是小白AI网站的资讯编辑，擅长把 AI 新闻改写成站内原创解读。" },
      { role: "user", content: prompt },
    ],
    temperature: 0.4,
    max_tokens: 1600,
  })

  return new Promise((resolve) => {
    const req = https.request(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "Content-Length": Buffer.byteLength(body),
      },
      timeout: 25000,
    }, (res) => {
      let data = ""
      res.setEncoding("utf8")
      res.on("data", (chunk) => data += chunk)
      res.on("end", () => {
        try {
          const json = JSON.parse(data)
          const content = json.choices?.[0]?.message?.content || ""
          const cleaned = content.replace(/^```json\s*/i, "").replace(/```$/i, "").trim()
          const parsed = JSON.parse(cleaned)
          if (parsed?.summary && parsed?.content) resolve(parsed)
          else resolve(null)
        } catch {
          resolve(null)
        }
      })
    })
    req.on("error", () => resolve(null))
    req.on("timeout", () => {
      req.destroy()
      resolve(null)
    })
    req.write(body)
    req.end()
  })
}

function readExisting() {
  try {
    const raw = fs.readFileSync(outputPath, "utf8")
    const data = JSON.parse(raw)
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

function normalizeItem(item) {
  const id = `auto-${hash(`${item.source}:${item.title}`)}`
  return {
    id,
    title: item.title,
    summary: item.summary,
    content: item.content,
    url: item.url,
    source: item.source,
    category: item.category,
    publishedAt: item.publishedAt || today,
    importance: Math.min(10, Math.max(5, Number(item.importance || 6))),
    isAutoGenerated: true,
    image: item.image || "",
    editor: "小白AI资讯编辑部",
    updatedAt: new Date().toISOString(),
  }
}

async function enrichCandidate(candidate) {
  const html = await requestText(candidate.url, 12000)
  const pageDescription = extractMetaDescription(html)
  const image = extractImage(html, candidate.url) || sourceLogo(candidate.source)
  const aiDraft = await callAIEditor(candidate, pageDescription)
  const summary = aiDraft?.summary || buildSummary(candidate, pageDescription)
  const content = aiDraft?.content || buildTemplateArticle({ ...candidate, summary }, pageDescription)
  return normalizeItem({
    ...candidate,
    summary,
    content,
    image,
    publishedAt: today,
  })
}

async function main() {
  console.log(`[xiaobai-news-editor] ${new Date().toLocaleString()} start`)

  const candidates = []
  for (const source of sources) {
    try {
      const url = `https://${source.host}${source.path}`
      const html = await requestText(url)
      if (!html || html.length < 120) {
        console.log(`  miss ${source.name}`)
        continue
      }
      const items = extractCandidates(html, source)
      candidates.push(...items)
      console.log(`  ${source.name} +${items.length}`)
    } catch (error) {
      console.log(`  failed source ${source.name} ${error.message}`)
    }
    await new Promise((resolve) => setTimeout(resolve, 900))
  }

  const unique = []
  const seen = new Set()
  for (const item of candidates.sort((a, b) => b.importance - a.importance)) {
    const key = item.title.replace(/\s+/g, "").toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    unique.push(item)
    if (unique.length >= 18) break
  }

  console.log(`[xiaobai-news-editor] candidates ${candidates.length}, unique ${unique.length}`)

  if (unique.length === 0) {
    console.log("[xiaobai-news-editor] no fresh candidates, keep existing file")
    return
  }

  const fresh = []
  for (const item of unique) {
    try {
      const enriched = await enrichCandidate(item)
      fresh.push(enriched)
      console.log(`  edited ${enriched.title.slice(0, 36)}`)
    } catch (error) {
      console.log(`  failed ${item.title.slice(0, 28)} ${error.message}`)
    }
    await new Promise((resolve) => setTimeout(resolve, 600))
  }

  if (fresh.length === 0) {
    console.log("[xiaobai-news-editor] no enriched candidates, keep existing file")
    return
  }

  const existing = readExisting()
  const merged = []
  const mergedKeys = new Set()
  for (const item of [...fresh, ...existing]) {
    const key = `${item.source}:${item.title}`.toLowerCase()
    if (mergedKeys.has(key)) continue
    mergedKeys.add(key)
    merged.push(item)
    if (merged.length >= 120) break
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, JSON.stringify(merged, null, 2), "utf8")
  console.log(`[xiaobai-news-editor] wrote ${fresh.length} fresh, ${merged.length} total -> ${outputPath}`)
}

main().catch((error) => {
  console.error("[xiaobai-news-editor] fatal", error)
  process.exitCode = 1
})
