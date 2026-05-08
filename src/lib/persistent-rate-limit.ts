import { createHash } from "node:crypto"
import { createServerSupabase, hasSupabaseServiceConfig } from "@/lib/server-auth"

type RateLimitHit = {
  allowed: boolean
  remaining: number
  resetAt: number
  source: "supabase" | "memory"
}

type HitRateLimitInput = {
  scope: string
  key: string
  limit: number
  windowKey: string
  resetAt: Date
}

const fallbackBuckets = new Map<string, { count: number; resetAt: number }>()

export function hashRateLimitKey(value: string) {
  return createHash("sha256")
    .update(`${process.env.RATE_LIMIT_HASH_SALT || process.env.WORKFLOW_CRON_SECRET || "xiaobai"}.${value}`)
    .digest("hex")
}

function memoryHit(input: HitRateLimitInput): RateLimitHit {
  const id = `${input.scope}:${input.key}:${input.windowKey}`
  const now = Date.now()
  const current = fallbackBuckets.get(id)
  const bucket = current && current.resetAt > now ? current : { count: 0, resetAt: input.resetAt.getTime() }
  bucket.count += 1
  fallbackBuckets.set(id, bucket)
  return {
    allowed: bucket.count <= input.limit,
    remaining: Math.max(0, input.limit - bucket.count),
    resetAt: bucket.resetAt,
    source: "memory",
  }
}

export async function hitPersistentRateLimit(input: HitRateLimitInput): Promise<RateLimitHit> {
  if (!hasSupabaseServiceConfig()) return memoryHit(input)

  try {
    const supabase = createServerSupabase()
    const { data, error } = await supabase.rpc("hit_rate_limit", {
      p_scope: input.scope,
      p_identity_key: input.key,
      p_window_key: input.windowKey,
      p_reset_at: input.resetAt.toISOString(),
    })
    if (error) throw error

    const row = Array.isArray(data) ? data[0] : data
    const nextCount = Number(row?.count || 1)
    const resetAt = new Date(row?.reset_at || input.resetAt).getTime()

    return {
      allowed: nextCount <= input.limit,
      remaining: Math.max(0, input.limit - nextCount),
      resetAt,
      source: "supabase",
    }
  } catch (error: any) {
    console.error("[rate-limit:fallback]", { scope: input.scope, message: error?.message, code: error?.code })
    return memoryHit(input)
  }
}
