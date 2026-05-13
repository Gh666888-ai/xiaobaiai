const https = require("https")
const fs = require("fs")
const path = require("path")

const appDir = path.join(__dirname, "..")
const newsPath = path.join(appDir, "public", "fetched-news.json")
const coverDir = path.join(appDir, "public", "news-covers")
const envPath = path.join(appDir, ".env.local")

loadEnv(envPath)

const apiKey = process.env.NEWS_IMAGE_API_KEY || process.env.OPENAI_API_KEY || ""
const model = process.env.NEWS_IMAGE_MODEL || "gpt-image-1"
const size = process.env.NEWS_IMAGE_SIZE || "1024x1024"
const quality = process.env.NEWS_IMAGE_QUALITY || "low"
const maxCovers = Number(process.env.NEWS_IMAGE_MAX || process.argv[2] || 8)

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

function isLikelyLogoImage(url = "") {
  return /favicon|logo|icon|avatar|simpleicons|google\.com\/s2\/favicons|cdn\.simpleicons\.org/i.test(String(url))
}

function readNews() {
  const data = JSON.parse(fs.readFileSync(newsPath, "utf8"))
  return Array.isArray(data) ? data : []
}

function coverPublicPath(item) {
  return `/news-covers/${item.id}.png`
}

function coverFilePath(item) {
  return path.join(coverDir, `${item.id}.png`)
}

function needsCover(item) {
  if (!item?.id || !item?.title) return false
  if (item.image && !isLikelyLogoImage(item.image) && fs.existsSync(path.join(appDir, "public", item.image.replace(/^\//, "")))) return false
  if (item.image && !isLikelyLogoImage(item.image) && /^https?:\/\//i.test(item.image)) return false
  return !fs.existsSync(coverFilePath(item))
}

function buildPrompt(item) {
  return [
    "Create a high-quality editorial cover image for a Chinese AI news article.",
    "Use a clean white or light background, vivid but professional colors, and a real-world technology/newsroom feeling.",
    "Do not include readable text, logos, brand marks, UI screenshots, watermarks, or fake website pages.",
    "The image should visually explain the topic, not pretend to be a real source photo.",
    `Article title: ${item.title}`,
    `Category: ${item.category || "AI news"}`,
    `Source: ${item.source || "unknown"}`,
    `Summary: ${item.summary || ""}`,
  ].join("\n")
}

function generateImage(prompt) {
  const body = JSON.stringify({
    model,
    prompt,
    size,
    quality,
    background: "opaque",
  })

  return new Promise((resolve, reject) => {
    const req = https.request("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "Content-Length": Buffer.byteLength(body),
      },
      timeout: 120000,
    }, (res) => {
      let data = ""
      res.setEncoding("utf8")
      res.on("data", (chunk) => data += chunk)
      res.on("end", () => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          reject(new Error(`OpenAI image API ${res.statusCode}: ${data.slice(0, 500)}`))
          return
        }
        try {
          const parsed = JSON.parse(data)
          const b64 = parsed.data?.[0]?.b64_json
          if (!b64) {
            reject(new Error("OpenAI image API returned no b64_json image"))
            return
          }
          resolve(Buffer.from(b64, "base64"))
        } catch (error) {
          reject(error)
        }
      })
      res.on("error", reject)
    })

    req.on("error", reject)
    req.on("timeout", () => {
      req.destroy(new Error("OpenAI image API timeout"))
    })
    req.write(body)
    req.end()
  })
}

async function main() {
  if (!apiKey) {
    console.log("[xiaobai-news-covers] skip: set NEWS_IMAGE_API_KEY or OPENAI_API_KEY first")
    return
  }

  const news = readNews()
  const targets = news.filter(needsCover).slice(0, maxCovers)
  if (!targets.length) {
    console.log("[xiaobai-news-covers] no missing covers")
    return
  }

  fs.mkdirSync(coverDir, { recursive: true })
  console.log(`[xiaobai-news-covers] generating ${targets.length} covers with ${model}`)

  for (const [index, item] of targets.entries()) {
    console.log(`  ${index + 1}/${targets.length} ${item.id} ${item.title.slice(0, 36)}`)
    const buffer = await generateImage(buildPrompt(item))
    fs.writeFileSync(coverFilePath(item), buffer)
    item.image = coverPublicPath(item)
    item.imageType = "xiaobai_ai_generated_cover"
    item.imagePrompt = buildPrompt(item)
    item.updatedAt = new Date().toISOString()
  }

  fs.writeFileSync(newsPath, JSON.stringify(news, null, 2) + "\n", "utf8")
  console.log(`[xiaobai-news-covers] wrote ${newsPath}`)
}

main().catch((error) => {
  console.error("[xiaobai-news-covers] fatal", error)
  process.exitCode = 1
})
