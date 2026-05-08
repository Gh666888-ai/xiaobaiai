import { NextRequest, NextResponse } from "next/server"
import { createHash } from "crypto"
import { createClient } from "@supabase/supabase-js"
import { requireUser } from "@/lib/server-auth"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
)

const MAX_LEVEL_EMAILS = new Set(["15171192200@163.com", "109020070@qq.com", "771239559@qq.com"])
const MAX_LEVEL_XP = 100000
const ADMIN_EMAILS = new Set(["15171192200@163.com"])
const POST_APPROVED_XP = 10
const QUESTION_POST_APPROVED_XP = 12
const POST_HOURLY_LIMIT = 3
const POST_DAILY_LIMIT = 10
const IP_HOURLY_LIMIT = 5
const LINK_PATTERN = /(https?:\/\/|www\.|\.com\b|\.cn\b|\.net\b|\.org\b|\.top\b|\.xyz\b|\.vip\b)/i
const HARD_BLOCK_RULES = [
  { pattern: /博彩|赌博|棋牌|赌球|下注|彩票|老虎机/i, reason: "gambling" },
  { pattern: /裸聊|约炮|援交|色情|黄色|成人片|成人视频/i, reason: "adult" },
  { pattern: /代\s*(办|开)\s*(发票|证明)|假\s*(证|发票)|兼职刷单/i, reason: "illegal_service" },
  { pattern: /贷款|网贷|套现|信用卡提额|刷流水/i, reason: "financial_spam" },
]
const REVIEW_RULES = [
  { pattern: LINK_PATTERN, reason: "contains_link" },
  { pattern: /加\s*(微|vx|微信)|私\s*聊|联系我|看主页/i, reason: "contact_request" },
  { pattern: /二维码|邀请码|开户链接|返佣|代理/i, reason: "external_invite" },
  { pattern: /日赚|月入|躺赚|副业|在家赚钱/i, reason: "income_claim" },
]

function normalizeXP(email?: string | null, xp?: number | null) {
  return MAX_LEVEL_EMAILS.has(String(email || "").toLowerCase()) ? MAX_LEVEL_XP : Number(xp || 0)
}

function dayKey(now = new Date()) {
  return new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString().slice(0, 10)
}

function cleanText(value: unknown, maxLength = 8000) {
  return String(value || "").trim().replace(/\n{4,}/g, "\n\n\n").slice(0, maxLength)
}

function cleanTags(value: unknown) {
  if (!Array.isArray(value)) return []
  return value.map((tag) => String(tag || "").trim()).filter(Boolean).slice(0, 8)
}

function getClientIp(req: NextRequest) {
  return (req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "").split(",")[0].trim()
}

function hashIp(ip: string) {
  if (!ip) return ""
  return createHash("sha256").update(`${process.env.POST_RATE_LIMIT_SALT || "xiaobai-post"}:${ip}`).digest("hex").slice(0, 24)
}

function autoModeratePost(title: string, content: string, tags: string[]) {
  const text = `${title}\n${content}\n${tags.join(" ")}`.replace(/\s+/g, "")
  const hardRule = HARD_BLOCK_RULES.find((rule) => rule.pattern.test(text))
  if (hardRule) return { status: "rejected", reason: hardRule.reason }
  if (title.length < 6) return { status: "pending", reason: "title_too_short" }
  if (content.length < 80) return { status: "pending", reason: "content_too_short" }
  const reviewRule = REVIEW_RULES.find((rule) => rule.pattern.test(text))
  if (reviewRule) return { status: "pending", reason: reviewRule.reason }
  return { status: "pending", reason: "manual_review_required" }
}

function getMissingColumnName(error: any) {
  const text = `${error?.message || ""}\n${error?.details || ""}\n${error?.hint || ""}`
  const match = text.match(/'([^']+)'\s+column/i) || text.match(/column\s+"?([a-zA-Z0-9_]+)"?\s+does not exist/i)
  return match?.[1] || ""
}

async function insertCommunityPost(payload: Record<string, unknown>) {
  const nextPayload = { ...payload }
  const removedColumns: string[] = []

  for (let attempt = 0; attempt < 12; attempt += 1) {
    const { data, error } = await supabase
      .from("community_posts")
      .insert(nextPayload)
      .select("id")
      .single()

    if (!error) return { data, error: null, removedColumns }

    const missingColumn = getMissingColumnName(error)
    if (!missingColumn || !(missingColumn in nextPayload)) {
      return { data: null, error, removedColumns }
    }

    delete nextPayload[missingColumn]
    removedColumns.push(missingColumn)
    console.warn("[posts:community-schema-fallback]", {
      missingColumn,
      removedColumns,
      message: error.message,
    })
  }

  return {
    data: null,
    error: { message: "community_posts 表结构缺失字段过多，请先执行 Supabase 社区表补丁。" },
    removedColumns,
  }
}

async function recordGrowthEvent(userId: string, eventKey: string, reason: string, amount: number) {
  const { error } = await supabase.from("growth_events").insert({
    user_id: userId,
    event_key: eventKey,
    reason,
    amount,
    day_key: dayKey(),
  })
  if (error && String(error.code || "") === "23505") return false
  if (error) {
    console.error("[posts:growth-event]", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    })
    return false
  }
  return true
}

async function requireAdmin(req: NextRequest) {
  const auth = await requireUser(req)
  if (!auth.ok) return auth
  if (!ADMIN_EMAILS.has(String(auth.user.email || "").toLowerCase())) {
    return { ok: false as const, error: "没有审核权限", status: 403 }
  }
  return auth
}

async function enforcePostRateLimit(userId: string, ipHash: string) {
  const now = Date.now()
  const hourAgo = new Date(now - 60 * 60 * 1000).toISOString()
  const dayAgo = new Date(now - 24 * 60 * 60 * 1000).toISOString()

  if (userId) {
    const { count: hourlyCount, error: hourlyError } = await supabase
      .from("community_posts")
      .select("id", { count: "exact", head: true })
      .eq("author_id", userId)
      .gte("created_at", hourAgo)
    if (hourlyError) throw hourlyError
    if (Number(hourlyCount || 0) >= POST_HOURLY_LIMIT) return "发帖太频繁了，请一小时后再提交。"

    const { count: dailyCount, error: dailyError } = await supabase
      .from("community_posts")
      .select("id", { count: "exact", head: true })
      .eq("author_id", userId)
      .gte("created_at", dayAgo)
    if (dailyError) throw dailyError
    if (Number(dailyCount || 0) >= POST_DAILY_LIMIT) return "今天提交的帖子已经很多了，明天再继续沉淀复盘。"
  }

  if (ipHash) {
    const { count: ipCount, error: ipError } = await supabase
      .from("community_posts")
      .select("id", { count: "exact", head: true })
      .eq("author_ip_hash", ipHash)
      .gte("created_at", hourAgo)
    if (ipError && String(ipError.code || "") !== "42703") throw ipError
    if (!ipError && Number(ipCount || 0) >= IP_HOURLY_LIMIT) return "当前网络提交太频繁了，请稍后再试。"
  }

  return ""
}

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status") || "approved"
  if (status !== "approved") {
    const admin = await requireAdmin(req)
    if (!admin.ok) return NextResponse.json({ error: admin.error }, { status: admin.status })
  }
  const { data, error } = await supabase
    .from("community_posts")
    .select("*")
    .eq("status", status)
    .order("pinned", { ascending: false })
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(50)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  const posts = data || []
  const emails = Array.from(new Set(posts.map((post: any) => post.author_name).filter((name: any) => typeof name === "string" && name.includes("@"))))
  if (emails.length === 0) return NextResponse.json(posts)

  const { data: profiles } = await supabase
    .from("profiles")
    .select("email,name,xp")
    .in("email", emails)

  const profileByEmail = new Map((profiles || []).map((profile: any) => [String(profile.email).toLowerCase(), profile]))
  return NextResponse.json(posts.map((post: any) => {
    const profile = typeof post.author_name === "string" ? profileByEmail.get(post.author_name.toLowerCase()) : null
    return profile ? { ...post, author_name: profile.name || post.author_name, author_xp: normalizeXP(profile.email, profile.xp) } : post
  }))
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const title = cleanText(body?.title, 120)
  const content = cleanText(body?.content, 12000)
  const category = cleanText(body?.category, 40) || "经验分享"
  const tags = cleanTags(body?.tags)
  const authorName = cleanText(body?.author_name, 40)
  const missionId = cleanText(body?.mission_id || body?.missionId, 80) || null
  const toolIds = cleanTags(body?.tool_ids || body?.toolIds)

  if (!title || !content) return NextResponse.json({ error: "请填写标题和正文。" }, { status: 400 })
  if (title.length < 4) return NextResponse.json({ error: "标题至少 4 个字。" }, { status: 400 })
  if (content.length < 20) return NextResponse.json({ error: "正文至少 20 个字，写清楚场景和做法才容易通过审核。" }, { status: 400 })

  let profile: any = null
  let userId = ""
  const authHeader = req.headers.get("authorization") || ""
  const token = authHeader.toLowerCase().startsWith("bearer ") ? authHeader.slice(7) : ""
  if (token) {
    const { data } = await supabase.auth.getUser(token)
    if (data.user?.id) {
      userId = data.user.id
      const { data: profileData } = await supabase.from("profiles").select("name,email,xp").eq("id", data.user.id).single()
      profile = profileData
    }
  }

  const ipHash = hashIp(getClientIp(req))
  try {
    const rateLimitMessage = await enforcePostRateLimit(userId, ipHash)
    if (rateLimitMessage) return NextResponse.json({ error: rateLimitMessage }, { status: 429 })
  } catch (error: any) {
    console.error("[posts:rate-limit:soft-fail]", {
      code: error?.code,
      message: error?.message,
      details: error?.details,
      hint: error?.hint,
    })
    // Rate-limit queries depend on optional schema / permissions in production.
    // If that check fails, keep the post flow usable and rely on moderation.
  }

  const moderation = autoModeratePost(title, content, tags)
  const { data: insertedPost, error, removedColumns } = await insertCommunityPost({
    author_id: userId || null,
    title,
    content,
    category,
    tags,
    author_name: profile?.name || authorName || "匿名用户",
    author_email: profile?.email || null,
    author_xp: normalizeXP(profile?.email, profile?.xp),
    status: moderation.status,
    moderation_reason: moderation.reason,
    pinned: false,
    featured: false,
    published_at: null,
    mission_id: missionId,
    tool_ids: toolIds,
    source: userId ? "user" : "anonymous",
    author_ip_hash: ipHash || null,
  })
  if (error) {
    const missingColumn = getMissingColumnName(error)
    const message = missingColumn
      ? `社区表缺少 ${missingColumn} 字段。请先在 Supabase SQL Editor 执行项目里的社区表补丁，然后重新提交。`
      : error.message
    return NextResponse.json({ error: message }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    id: insertedPost?.id,
    status: moderation.status,
    moderation_reason: moderation.reason,
    awarded: 0,
    reward_pending: Boolean(userId && moderation.status === "pending"),
    degraded_schema: removedColumns.length > 0,
    removed_columns: removedColumns,
  })
}

export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin(req)
  if (!admin.ok) return NextResponse.json({ error: admin.error }, { status: admin.status })
  const { id, status, pinned, featured, editor_note, reject_reason } = await req.json()
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
  if (status && !["pending", "approved", "rejected"].includes(status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 })

  const { data: current, error: readError } = await supabase
    .from("community_posts")
    .select("id,author_id,author_email,author_xp,status,category")
    .eq("id", id)
    .maybeSingle()
  if (readError) return NextResponse.json({ error: readError.message }, { status: 500 })
  if (!current) return NextResponse.json({ error: "帖子不存在" }, { status: 404 })

  const update: Record<string, unknown> = {}
  if (status) update.status = status
  if (typeof pinned === "boolean") update.pinned = pinned
  if (typeof featured === "boolean") update.featured = featured
  if (typeof editor_note === "string") update.editor_note = editor_note
  if (typeof reject_reason === "string") update.reject_reason = reject_reason
  if (status === "approved" && current.status !== "approved") {
    update.published_at = new Date().toISOString().slice(0, 10)
    update.reviewed_at = new Date().toISOString()
    update.reviewed_by = admin.user.id
    update.moderation_reason = "approved_by_admin"
  }
  if (status === "rejected") {
    update.reviewed_at = new Date().toISOString()
    update.reviewed_by = admin.user.id
    update.moderation_reason = "rejected_by_admin"
  }
  if (Object.keys(update).length === 0) return NextResponse.json({ error: "No updates" }, { status: 400 })

  const { error } = await supabase.from("community_posts").update(update).eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  let awarded = 0
  if (status === "approved" && current.status !== "approved" && current.author_id) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("xp,email")
      .eq("id", current.author_id)
      .maybeSingle()
    if (MAX_LEVEL_EMAILS.has(String(profile?.email || current.author_email || "").toLowerCase())) {
      return NextResponse.json({ success: true, awarded: 0 })
    }
    const isQuestionPost = String((current as any).category || "").includes("问题")
    const postXP = isQuestionPost ? QUESTION_POST_APPROVED_XP : POST_APPROVED_XP
    const eventInserted = await recordGrowthEvent(current.author_id, `community-post-approved:${id}`, isQuestionPost ? "question-post-approved" : "post-approved", postXP)
    if (eventInserted) {
      const nextXP = Number(profile?.xp ?? current.author_xp ?? 0) + postXP
      await supabase.from("profiles").update({ xp: nextXP }).eq("id", current.author_id)
      await supabase.from("community_posts").update({ author_xp: normalizeXP(profile?.email || current.author_email, nextXP) }).eq("id", id)
      awarded = postXP
    }
  }

  return NextResponse.json({ success: true, awarded })
}
