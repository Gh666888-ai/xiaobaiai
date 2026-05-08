#!/usr/bin/env node

const fs = require("fs/promises")
const path = require("path")

const API_KEY = process.env.OPENAI_API_KEY
const MODEL = process.env.XIAOBAI_IMAGE_MODEL || "gpt-image-1.5"
const SIZE = process.env.XIAOBAI_IMAGE_SIZE || "1024x1536"
const QUALITY = process.env.XIAOBAI_IMAGE_QUALITY || "medium"
const REFERENCE_IMAGE = process.env.XIAOBAI_REFERENCE_IMAGE || "public/xiaobai-mascot-cutout.png"
const OUT_DIR = process.env.XIAOBAI_MASCOT_OUT_DIR || "public/mascot/generated"

const actions = [
  {
    id: "idle",
    prompt:
      "Edit the reference mascot into a clean transparent PNG sprite. Keep the exact same Xiaobai AI mascot identity: white chubby cat-like robot, blue eyes, small pink nose, soft smile, blue arrow mark on the chest, cute rounded body. Full body, centered, generous padding, no background, no shadow, no text, no watermark. Pose: idle breathing, friendly neutral face, ears and tail slightly lively.",
  },
  {
    id: "talk",
    prompt:
      "Edit the reference mascot into a clean transparent PNG sprite. Keep the exact same Xiaobai AI mascot identity: white chubby cat-like robot, blue eyes, small pink nose, soft smile, blue arrow mark on the chest, cute rounded body. Full body, centered, generous padding, no background, no shadow, no text, no watermark. Pose: speaking and explaining to a beginner, mouth slightly open, one small paw gesturing, warm helpful expression.",
  },
  {
    id: "sleep",
    prompt:
      "Edit the reference mascot into a clean transparent PNG sprite. Keep the exact same Xiaobai AI mascot identity: white chubby cat-like robot, blue eyes, small pink nose, blue arrow mark on the chest, cute rounded body. Full body, centered, generous padding, no background, no shadow, no text, no watermark. Pose: sleepy dozing, eyes closed, relaxed face, body gently leaning, tail resting.",
  },
  {
    id: "peek",
    prompt:
      "Edit the reference mascot into a clean transparent PNG sprite. Keep the exact same Xiaobai AI mascot identity: white chubby cat-like robot, blue eyes, small pink nose, blue arrow mark on the chest, cute rounded body. Full body, centered, generous padding, no background, no shadow, no text, no watermark. Pose: secretly peeking at the user with playful curious eyes, slight side lean, clever but cute expression.",
  },
  {
    id: "patrol",
    prompt:
      "Edit the reference mascot into a clean transparent PNG sprite. Keep the exact same Xiaobai AI mascot identity: white chubby cat-like robot, blue eyes, small pink nose, blue arrow mark on the chest, cute rounded body. Full body, centered, generous padding, no background, no shadow, no text, no watermark. Pose: patrolling task status, small walking step, focused friendly expression, one paw raised as if checking progress.",
  },
  {
    id: "serious",
    prompt:
      "Edit the reference mascot into a clean transparent PNG sprite. Keep the exact same Xiaobai AI mascot identity: white chubby cat-like robot, blue eyes, small pink nose, blue arrow mark on the chest, cute rounded body. Full body, centered, generous padding, no background, no shadow, no text, no watermark. Pose: serious and determined, hands preparing a quick ninja hand seal, still cute, not scary.",
  },
  {
    id: "burrow",
    prompt:
      "Edit the reference mascot into a clean transparent PNG sprite. Keep the exact same Xiaobai AI mascot identity: white chubby cat-like robot, blue eyes, small pink nose, blue arrow mark on the chest, cute rounded body. Full body, centered, generous padding, no background, no shadow, no text, no watermark. Pose: cute bagua burrow teleport action, determined face, paws in a fast hand seal, simple golden energy ring around the body, no background.",
  },
  {
    id: "complete",
    prompt:
      "Edit the reference mascot into a clean transparent PNG sprite. Keep the exact same Xiaobai AI mascot identity: white chubby cat-like robot, blue eyes, small pink nose, blue arrow mark on the chest, cute rounded body. Full body, centered, generous padding, no background, no shadow, no text, no watermark. Pose: task completed celebration, happy face, one paw raised in a small victory gesture.",
  },
]

function die(message) {
  console.error(message)
  process.exit(1)
}

async function ensureReference() {
  try {
    await fs.access(REFERENCE_IMAGE)
  } catch {
    die(`Missing reference image: ${REFERENCE_IMAGE}`)
  }
}

async function createImageEdit(action) {
  const imageBytes = await fs.readFile(REFERENCE_IMAGE)
  const imageBlob = new Blob([imageBytes], { type: "image/png" })
  const form = new FormData()
  form.append("model", MODEL)
  form.append("image[]", imageBlob, path.basename(REFERENCE_IMAGE))
  form.append("prompt", action.prompt)
  form.append("size", SIZE)
  form.append("quality", QUALITY)
  form.append("background", "transparent")
  form.append("output_format", "png")

  const res = await fetch("https://api.openai.com/v1/images/edits", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
    body: form,
  })

  const text = await res.text()
  let json
  try {
    json = JSON.parse(text)
  } catch {
    throw new Error(`OpenAI API returned non-JSON response (${res.status}): ${text.slice(0, 500)}`)
  }

  if (!res.ok) {
    const message = json?.error?.message || text
    throw new Error(`OpenAI API error (${res.status}) for ${action.id}: ${message}`)
  }

  const b64 = json?.data?.[0]?.b64_json
  if (!b64) throw new Error(`OpenAI API returned no image data for ${action.id}`)
  return Buffer.from(b64, "base64")
}

async function main() {
  if (!API_KEY) {
    die("OPENAI_API_KEY is not set. Set it in your local shell environment, then run: npm run generate:mascot")
  }

  await ensureReference()
  await fs.mkdir(OUT_DIR, { recursive: true })

  const manifest = {
    generatedAt: new Date().toISOString(),
    model: MODEL,
    size: SIZE,
    quality: QUALITY,
    reference: REFERENCE_IMAGE,
    assets: {},
  }

  for (const action of actions) {
    console.log(`[xiaobai-mascot] generating ${action.id}...`)
    const png = await createImageEdit(action)
    const file = path.join(OUT_DIR, `xiaobai-${action.id}.png`)
    await fs.writeFile(file, png)
    manifest.assets[action.id] = `/${file.replace(/\\/g, "/").replace(/^public\//, "")}`
    console.log(`[xiaobai-mascot] wrote ${file}`)
  }

  const manifestFile = path.join(OUT_DIR, "manifest.json")
  await fs.writeFile(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`)
  console.log(`[xiaobai-mascot] wrote ${manifestFile}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
