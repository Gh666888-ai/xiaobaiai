const http = require("http")
const fs = require("fs")
const path = require("path")

const appDir = path.join(__dirname, "..")
const newsPath = path.join(appDir, "public", "fetched-news.json")
const coverDir = path.join(appDir, "public", "news-covers")
const envPath = path.join(appDir, ".env.local")

loadEnv(envPath)

const baseUrl = (process.env.NEWS_LOCAL_IMAGE_URL || "http://127.0.0.1:7860").replace(/\/$/, "")
const maxCovers = Number(process.env.NEWS_LOCAL_IMAGE_MAX || process.argv[2] || 6)
const width = Number(process.env.NEWS_LOCAL_IMAGE_WIDTH || 1024)
const height = Number(process.env.NEWS_LOCAL_IMAGE_HEIGHT || 576)
const steps = Number(process.env.NEWS_LOCAL_IMAGE_STEPS || 24)
const cfgScale = Number(process.env.NEWS_LOCAL_IMAGE_CFG || 6)
const sampler = process.env.NEWS_LOCAL_IMAGE_SAMPLER || "DPM++ 2M Karras"
const checkpoint = process.env.NEWS_LOCAL_IMAGE_CHECKPOINT || ""

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

function localPublicFileExists(publicPath = "") {
  if (!publicPath.startsWith("/")) return false
  return fs.existsSync(path.join(appDir, "public", publicPath.replace(/^\//, "")))
}

function needsCover(item) {
  if (!item?.id || !item?.title) return false
  if (fs.existsSync(coverFilePath(item))) return false
  if (item.image && !isLikelyLogoImage(item.image) && /^https?:\/\//i.test(item.image)) return false
  if (item.image && !isLikelyLogoImage(item.image) && localPublicFileExists(item.image)) return false
  return true
}

function postJson(url, payload, timeout = 180000) {
  const body = JSON.stringify(payload)
  const parsed = new URL(url)
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: parsed.hostname,
      port: parsed.port || 80,
      path: `${parsed.pathname}${parsed.search}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
      },
      timeout,
    }, (res) => {
      let data = ""
      res.setEncoding("utf8")
      res.on("data", (chunk) => data += chunk)
      res.on("end", () => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          reject(new Error(`local image server ${res.statusCode}: ${data.slice(0, 500)}`))
          return
        }
        try {
          resolve(JSON.parse(data))
        } catch (error) {
          reject(error)
        }
      })
      res.on("error", reject)
    })

    req.on("error", reject)
    req.on("timeout", () => {
      req.destroy(new Error("local image server timeout"))
    })
    req.write(body)
    req.end()
  })
}

function getJson(url, timeout = 12000) {
  const parsed = new URL(url)
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: parsed.hostname,
      port: parsed.port || 80,
      path: `${parsed.pathname}${parsed.search}`,
      method: "GET",
      timeout,
    }, (res) => {
      let data = ""
      res.setEncoding("utf8")
      res.on("data", (chunk) => data += chunk)
      res.on("end", () => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          reject(new Error(`local image server ${res.statusCode}: ${data.slice(0, 500)}`))
          return
        }
        try {
          resolve(JSON.parse(data))
        } catch (error) {
          reject(error)
        }
      })
      res.on("error", reject)
    })

    req.on("error", reject)
    req.on("timeout", () => {
      req.destroy(new Error("local image server timeout"))
    })
    req.end()
  })
}

function buildPrompt(item) {
  return [
    "premium editorial cover, Chinese AI news, clean white background, vivid professional colors",
    "realistic technology newsroom scene, modern AI product atmosphere, high quality, sharp details",
    "no readable text, no letters, no logo, no watermark, no website screenshot, no fake UI",
    "safe commercial visual, suitable for a beginner AI learning website",
    `topic: ${item.title}`,
    `category: ${item.category || "AI news"}`,
    `summary: ${item.summary || ""}`,
  ].join(", ")
}

function buildNegativePrompt() {
  return [
    "text, letters, words, logo, watermark, signature, brand mark, blurry",
    "low quality, distorted screen, fake browser, bad anatomy, extra fingers",
    "dark unreadable image, noisy background, cropped subject, nsfw",
  ].join(", ")
}

async function setCheckpointIfNeeded() {
  if (!checkpoint) return
  await postJson(`${baseUrl}/sdapi/v1/options`, { sd_model_checkpoint: checkpoint }, 60000)
}

async function generateWithSdWebui(item) {
  const payload = {
    prompt: buildPrompt(item),
    negative_prompt: buildNegativePrompt(),
    sampler_name: sampler,
    steps,
    cfg_scale: cfgScale,
    width,
    height,
    batch_size: 1,
    n_iter: 1,
    seed: -1,
    restore_faces: false,
    tiling: false,
    save_images: false,
  }
  const result = await postJson(`${baseUrl}/sdapi/v1/txt2img`, payload)
  const image = result.images?.[0]
  if (!image) throw new Error("local image server returned no image")
  return Buffer.from(String(image).replace(/^data:image\/\w+;base64,/, ""), "base64")
}

async function main() {
  try {
    await getJson(`${baseUrl}/sdapi/v1/sd-models`)
  } catch (error) {
    console.error(`[xiaobai-local-news-covers] cannot reach ${baseUrl}`)
    console.error("Start Stable Diffusion WebUI / Forge with API enabled first, for example: webui-user.bat --api")
    console.error(error.message)
    process.exitCode = 1
    return
  }

  await setCheckpointIfNeeded()

  const news = readNews()
  const targets = news.filter(needsCover).slice(0, maxCovers)
  if (!targets.length) {
    console.log("[xiaobai-local-news-covers] no missing covers")
    return
  }

  fs.mkdirSync(coverDir, { recursive: true })
  console.log(`[xiaobai-local-news-covers] generating ${targets.length} covers from ${baseUrl}`)

  for (const [index, item] of targets.entries()) {
    console.log(`  ${index + 1}/${targets.length} ${item.id} ${item.title.slice(0, 36)}`)
    const buffer = await generateWithSdWebui(item)
    fs.writeFileSync(coverFilePath(item), buffer)
    item.image = coverPublicPath(item)
    item.imageType = "xiaobai_local_gpu_generated_cover"
    item.imagePrompt = buildPrompt(item)
    item.updatedAt = new Date().toISOString()
  }

  fs.writeFileSync(newsPath, JSON.stringify(news, null, 2) + "\n", "utf8")
  console.log(`[xiaobai-local-news-covers] wrote ${newsPath}`)
}

main().catch((error) => {
  console.error("[xiaobai-local-news-covers] fatal", error)
  process.exitCode = 1
})
