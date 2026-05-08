#!/usr/bin/env node

const crypto = require("crypto")
const fs = require("fs/promises")
const path = require("path")
const { spawnSync } = require("child_process")

const ACCESS_KEY = process.env.LIBLIB_ACCESS_KEY || process.env.XIAOBAI_LIBLIB_ACCESS_KEY
const SECRET_KEY = process.env.LIBLIB_SECRET_KEY || process.env.XIAOBAI_LIBLIB_SECRET_KEY
const BASE_URL = process.env.LIBLIB_BASE_URL || "https://openapi.liblibai.cloud"
const REFERENCE_IMAGE = process.env.XIAOBAI_REFERENCE_IMAGE || "public/xiaobai-mascot-cutout.png"
const OUT_DIR = process.env.XIAOBAI_MASCOT_OUT_DIR || "public/mascot/generated"
const SOURCE_OUT_DIR = process.env.XIAOBAI_MASCOT_SOURCE_OUT_DIR || path.join(OUT_DIR, "source")
const TEMPLATE_UUID = process.env.LIBLIB_TEMPLATE_UUID || "9c7d531dc75f476aa833b3d452b8f7ad"
const CHECKPOINT_ID = process.env.LIBLIB_CHECKPOINT_ID || "0ea388c7eb854be3ba3c6f65aac6bfd3"
const WIDTH = Number(process.env.XIAOBAI_IMAGE_WIDTH || 768)
const HEIGHT = Number(process.env.XIAOBAI_IMAGE_HEIGHT || 1024)
const STEPS = Number(process.env.LIBLIB_STEPS || 24)
const CFG_SCALE = Number(process.env.LIBLIB_CFG_SCALE || 7)
const DENOISING_STRENGTH = Number(process.env.LIBLIB_DENOISING_STRENGTH || 0.56)
const POLL_INTERVAL_MS = Number(process.env.LIBLIB_POLL_INTERVAL_MS || 3000)
const TIMEOUT_MS = Number(process.env.LIBLIB_TIMEOUT_MS || 10 * 60 * 1000)
const REMOVE_GREENSCREEN = process.env.XIAOBAI_REMOVE_GREENSCREEN !== "0"

const actions = [
  {
    id: "idle",
    prompt:
      "same Xiaobai AI mascot as reference, white chubby cat robot, blue eyes, small pink nose, blue arrow mark on chest, cute rounded body, full body centered, idle breathing pose, friendly neutral face, ears and tail slightly lively, pure solid chroma key green background #00ff00, no shadow, no text, no watermark",
  },
  {
    id: "talk",
    prompt:
      "same Xiaobai AI mascot as reference, white chubby cat robot, blue eyes, small pink nose, blue arrow mark on chest, cute rounded body, full body centered, speaking and explaining to a beginner, mouth slightly open, one paw gesturing, warm helpful expression, pure solid chroma key green background #00ff00, no shadow, no text, no watermark",
  },
  {
    id: "sleep",
    prompt:
      "same Xiaobai AI mascot as reference, white chubby cat robot, blue eyes, small pink nose, blue arrow mark on chest, cute rounded body, full body centered, sleepy dozing, eyes closed, relaxed face, body gently leaning, tail resting, pure solid chroma key green background #00ff00, no shadow, no text, no watermark",
  },
  {
    id: "peek",
    prompt:
      "same Xiaobai AI mascot as reference, white chubby cat robot, blue eyes, small pink nose, blue arrow mark on chest, cute rounded body, full body centered, secretly peeking at the user with playful curious eyes, slight side lean, clever but cute expression, pure solid chroma key green background #00ff00, no shadow, no text, no watermark",
  },
  {
    id: "patrol",
    prompt:
      "same Xiaobai AI mascot as reference, white chubby cat robot, blue eyes, small pink nose, blue arrow mark on chest, cute rounded body, full body centered, patrolling task status, small walking step, focused friendly expression, one paw raised as if checking progress, pure solid chroma key green background #00ff00, no shadow, no text, no watermark",
  },
  {
    id: "serious",
    prompt:
      "same Xiaobai AI mascot as reference, white chubby cat robot, blue eyes, small pink nose, blue arrow mark on chest, cute rounded body, full body centered, serious and determined, paws preparing a quick ninja hand seal, cute not scary, pure solid chroma key green background #00ff00, no shadow, no text, no watermark",
  },
  {
    id: "burrow",
    prompt:
      "same Xiaobai AI mascot as reference, white chubby cat robot, blue eyes, small pink nose, blue arrow mark on chest, cute rounded body, full body centered, cute bagua burrow teleport action, determined face, paws in fast hand seal, simple golden energy ring around body, pure solid chroma key green background #00ff00, no shadow, no text, no watermark",
  },
  {
    id: "complete",
    prompt:
      "same Xiaobai AI mascot as reference, white chubby cat robot, blue eyes, small pink nose, blue arrow mark on chest, cute rounded body, full body centered, task completed celebration, happy face, one paw raised in a small victory gesture, pure solid chroma key green background #00ff00, no shadow, no text, no watermark",
  },
]

function die(message) {
  console.error(message)
  process.exit(1)
}

function randomString(length = 16) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  const bytes = crypto.randomBytes(length)
  return Array.from(bytes, (byte) => chars[byte % chars.length]).join("")
}

function signedEndpoint(endpoint) {
  const timestamp = Date.now()
  const nonce = randomString(16)
  const raw = `${endpoint}&${timestamp}&${nonce}`
  const signature = crypto
    .createHmac("sha1", SECRET_KEY)
    .update(raw)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
  const query = new URLSearchParams({
    AccessKey: ACCESS_KEY,
    Signature: signature,
    Timestamp: String(timestamp),
    SignatureNonce: nonce,
  })
  return `${BASE_URL}${endpoint}?${query.toString()}`
}

async function request(endpoint, options = {}) {
  const res = await fetch(signedEndpoint(endpoint), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "xiaobaiai-mascot-generator",
      ...(options.headers || {}),
    },
  })
  const text = await res.text()
  let json
  try {
    json = JSON.parse(text)
  } catch {
    throw new Error(`Liblib returned non-JSON (${res.status}): ${text.slice(0, 500)}`)
  }
  if (!res.ok || json.code !== 0) {
    throw new Error(`Liblib API error (${res.status}/${json.code}): ${json.msg || text}`)
  }
  return json.data
}

async function signFile(filename) {
  const extension = filename.includes(".") ? filename.split(".").pop() : "png"
  const name = filename.replace(/\.[^.]+$/, "")
  return request("/api/generate/upload/signature", {
    method: "POST",
    body: JSON.stringify({ name, extension }),
  })
}

async function uploadFile(filePath) {
  const filename = path.basename(filePath)
  const bytes = await fs.readFile(filePath)
  const signData = await signFile(filename)
  const form = new FormData()
  form.append("x-oss-signature", signData.xossSignature)
  form.append("x-oss-date", signData.xossDate)
  form.append("x-oss-signature-version", signData.xossSignatureVersion)
  form.append("policy", signData.policy)
  form.append("key", signData.key)
  form.append("x-oss-credential", signData.xossCredential)
  form.append("x-oss-expires", String(signData.xossExpires))
  form.append("file", new Blob([new Uint8Array(bytes)], { type: "image/png" }), filename)

  const res = await fetch(signData.postUrl, { method: "POST", body: form })
  if (!res.ok) throw new Error(`Liblib upload failed (${res.status}): ${await res.text()}`)
  return new URL(signData.key, signData.postUrl).toString()
}

async function submitImg2Img(sourceImage, action) {
  const payload = {
    templateUuid: TEMPLATE_UUID,
    generateParams: {
      checkPointId: CHECKPOINT_ID,
      prompt: action.prompt,
      negativePrompt:
        "bad quality, low quality, blurry, deformed, extra limbs, missing limbs, mutated hands, text, watermark, logo, complicated background, gradient background, checkerboard background, gray background, shadow on background",
      clipSkip: 2,
      sampler: 15,
      steps: STEPS,
      cfgScale: CFG_SCALE,
      randnSource: 0,
      seed: -1,
      imgCount: 1,
      restoreFaces: 0,
      sourceImage,
      resizeMode: 1,
      resizedWidth: WIDTH,
      resizedHeight: HEIGHT,
      mode: 0,
      denoisingStrength: DENOISING_STRENGTH,
      additionalNetwork: [],
      controlNet: [],
    },
  }
  const data = await request("/api/generate/webui/img2img", {
    method: "POST",
    body: JSON.stringify(payload),
  })
  if (!data?.generateUuid) throw new Error(`Liblib submit returned no generateUuid for ${action.id}`)
  return data.generateUuid
}

async function waitResult(generateUuid) {
  const start = Date.now()
  while (Date.now() - start < TIMEOUT_MS) {
    const data = await request("/api/generate/webui/status", {
      method: "POST",
      body: JSON.stringify({ generateUuid }),
    })
    if ([5, 6, 7].includes(data.generateStatus)) return data
    console.log(`[xiaobai-liblib] ${generateUuid} status=${data.generateStatus} ${data.percentCompleted || 0}%`)
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS))
  }
  throw new Error(`Liblib task timed out: ${generateUuid}`)
}

async function download(url, file) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Download failed (${res.status}) ${url}`)
  const bytes = Buffer.from(await res.arrayBuffer())
  await fs.writeFile(file, bytes)
}

function removeGreenScreen(sourceFile, outFile) {
  const helper = path.join(
    process.env.CODEX_HOME || path.join(process.env.USERPROFILE || process.env.HOME || "", ".codex"),
    "skills",
    ".system",
    "imagegen",
    "scripts",
    "remove_chroma_key.py",
  )
  const args = [
    helper,
    "--input",
    sourceFile,
    "--out",
    outFile,
    "--key",
    "#00ff00",
    "--soft-matte",
    "--transparent-threshold",
    "34",
    "--opaque-threshold",
    "220",
    "--despill",
    "--edge-contract",
    "1",
  ]
  const result = spawnSync(process.env.PYTHON || "python", args, { stdio: "inherit" })
  return result.status === 0
}

async function main() {
  if (!ACCESS_KEY || !SECRET_KEY) {
    die("LIBLIB_ACCESS_KEY and LIBLIB_SECRET_KEY are not set. Set them in your shell, then run: npm run generate:mascot")
  }
  try {
    await fs.access(REFERENCE_IMAGE)
  } catch {
    die(`Missing reference image: ${REFERENCE_IMAGE}`)
  }

  await fs.mkdir(OUT_DIR, { recursive: true })
  await fs.mkdir(SOURCE_OUT_DIR, { recursive: true })

  console.log(`[xiaobai-liblib] uploading reference ${REFERENCE_IMAGE}...`)
  const sourceImage = await uploadFile(REFERENCE_IMAGE)
  console.log(`[xiaobai-liblib] reference uploaded`)

  const manifest = {
    generatedAt: new Date().toISOString(),
    provider: "liblib",
    templateUuid: TEMPLATE_UUID,
    checkPointId: CHECKPOINT_ID,
    reference: REFERENCE_IMAGE,
    sourceImage,
    assets: {},
    sources: {},
  }

  for (const action of actions) {
    console.log(`[xiaobai-liblib] submitting ${action.id}...`)
    const generateUuid = await submitImg2Img(sourceImage, action)
    const result = await waitResult(generateUuid)
    if (result.generateStatus !== 5) {
      throw new Error(`Liblib generation failed for ${action.id}: ${result.generateMsg || result.generateStatus}`)
    }
    const imageUrl = result.images?.[0]?.imageUrl
    if (!imageUrl) throw new Error(`No image URL returned for ${action.id}`)

    const sourceFile = path.join(SOURCE_OUT_DIR, `xiaobai-${action.id}-green.png`)
    const outFile = path.join(OUT_DIR, `xiaobai-${action.id}.png`)
    await download(imageUrl, sourceFile)
    manifest.sources[action.id] = `/${sourceFile.replace(/\\/g, "/").replace(/^public\//, "")}`

    if (REMOVE_GREENSCREEN) {
      const ok = removeGreenScreen(sourceFile, outFile)
      if (ok) {
        manifest.assets[action.id] = `/${outFile.replace(/\\/g, "/").replace(/^public\//, "")}`
      } else {
        console.warn(`[xiaobai-liblib] green-screen removal failed for ${action.id}; keeping source image only`)
        manifest.assets[action.id] = manifest.sources[action.id]
      }
    } else {
      manifest.assets[action.id] = manifest.sources[action.id]
    }

    console.log(`[xiaobai-liblib] ${action.id} done -> ${manifest.assets[action.id]}`)
  }

  const manifestFile = path.join(OUT_DIR, "manifest.json")
  await fs.writeFile(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`)
  console.log(`[xiaobai-liblib] wrote ${manifestFile}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
