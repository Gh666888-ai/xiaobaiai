import { createHmac } from "node:crypto"
import { lookup } from "node:dns/promises"
import { isIP } from "node:net"

type WebhookResult = {
  ok?: boolean
  skipped?: boolean
  blocked?: boolean
  status?: number
  reason?: string
  text?: string
}

function allowedHosts() {
  return (process.env.WORKFLOW_WEBHOOK_ALLOWED_HOSTS || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
}

function isPrivateIp(address: string) {
  const version = isIP(address)
  if (!version) return false

  if (version === 6) {
    const lower = address.toLowerCase()
    return lower === "::1" || lower.startsWith("fc") || lower.startsWith("fd") || lower.startsWith("fe80:")
  }

  const parts = address.split(".").map((part) => Number(part))
  const [a, b] = parts
  return (
    a === 10 ||
    a === 127 ||
    a === 0 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168)
  )
}

async function validateWebhookUrl(rawUrl: string) {
  if (!rawUrl) return { ok: false, skipped: true, reason: "empty url" }

  let parsed: URL
  try {
    parsed = new URL(rawUrl)
  } catch {
    return { ok: false, reason: "invalid url" }
  }

  if (parsed.username || parsed.password) return { ok: false, reason: "url credentials are not allowed" }
  if (parsed.protocol !== "https:") return { ok: false, reason: "webhook url must use https" }

  const hostname = parsed.hostname.toLowerCase()
  if (["localhost", "localhost.localdomain"].includes(hostname)) return { ok: false, reason: "localhost is not allowed" }
  if (isPrivateIp(hostname)) return { ok: false, reason: "private ip is not allowed" }

  const allowlist = allowedHosts()
  if (allowlist.length > 0 && !allowlist.some((allowed) => hostname === allowed || hostname.endsWith(`.${allowed}`))) {
    return { ok: false, reason: "host is not in WORKFLOW_WEBHOOK_ALLOWED_HOSTS" }
  }

  const addresses = await lookup(hostname, { all: true }).catch(() => [])
  if (addresses.some((item) => isPrivateIp(item.address))) return { ok: false, reason: "resolved private ip is not allowed" }

  return { ok: true, url: parsed.toString() }
}

function signingHeaders(workflowId: string, body: string): Record<string, string> {
  const secret = process.env.WORKFLOW_WEBHOOK_SIGNING_SECRET || process.env.WORKFLOW_CRON_SECRET || ""
  const timestamp = Math.floor(Date.now() / 1000).toString()
  if (!secret) return { "x-xiaobai-workflow-id": workflowId, "x-xiaobai-workflow-timestamp": timestamp }

  const signature = createHmac("sha256", secret).update(`${timestamp}.${body}`).digest("hex")
  return {
    "x-xiaobai-workflow-id": workflowId,
    "x-xiaobai-workflow-timestamp": timestamp,
    "x-xiaobai-workflow-signature": `sha256=${signature}`,
  }
}

export async function postWorkflowWebhook(url: string, payload: unknown, workflowId = ""): Promise<WebhookResult> {
  const validation = await validateWebhookUrl(url)
  if (validation.skipped) return { skipped: true, reason: validation.reason }
  if (!validation.ok || !validation.url) return { ok: false, blocked: true, status: 0, reason: validation.reason || "blocked webhook url" }

  const body = JSON.stringify(payload)
  const res = await fetch(validation.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...signingHeaders(workflowId, body),
    },
    body,
    signal: AbortSignal.timeout(12000),
  })

  const text = await res.text().catch(() => "")
  return { ok: res.ok, status: res.status, text: text.slice(0, 500) }
}
