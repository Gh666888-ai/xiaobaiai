import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase, hasSupabaseConfig, requireUser } from "@/lib/server-auth"
import { getSeedCommunityComments } from "@/data/community-comments"

const MAX_LEVEL_EMAILS = new Set(["15171192200@163.com", "109020070@qq.com", "771239559@qq.com"])
const MAX_LEVEL_XP = 100000
const COMMENT_COOLDOWN_MS = 30_000
const LINK_PATTERN = /(https?:\/\/|www\.|\.com\b|\.cn\b|\.net\b|\.org\b|\.top\b|\.xyz\b|\.vip\b)/i
const HARD_BLOCK_RULES = [
  { pattern: /博彩|赌博|棋牌|赌球|下注|彩票|老虎机/i, reason: "gambling" },
  { pattern: /裸聊|约炮|援交|色情|黄色|成人片|成人视频/i, reason: "adult" },
  { pattern: /办\s*(证|卡)|假\s*(证|发票)|代\s*开\s*发票/i, reason: "illegal_service" },
  { pattern: /贷款|网贷|套现|信用卡提额|刷流水/i, reason: "financial_spam" },
  { pattern: /返\s*利|刷\s*(粉|赞|单|量)|代\s*(刷|开|办)|薅羊毛群/i, reason: "spam_service" },
]
const REVIEW_RULES = [
  { pattern: LINK_PATTERN, reason: "contains_link" },
  { pattern: /加\s*(微|v|vx|微信)|私\s*聊|联系我|看主页/i, reason: "contact_request" },
  { pattern: /群|二维码|邀请码|邀请码|开户链接/i, reason: "external_invite" },
  { pattern: /招聘|兼职|副业|日结|在家赚钱/i, reason: "job_or_income_claim" },
]

function normalizeXP(email?: string | null, xp?: number | null) {
  return MAX_LEVEL_EMAILS.has(String(email || "").toLowerCase()) ? MAX_LEVEL_XP : Number(xp || 0)
}

function cleanContent(value: unknown) {
  return String(value || "").trim().replace(/\n{4,}/g, "\n\n\n")
}

function autoModerateComment(content: string) {
  const normalized = content.replace(/\s+/g, "")
  const hardRule = HARD_BLOCK_RULES.find(rule => rule.pattern.test(normalized))
  if (hardRule) return { status: "hidden", reason: hardRule.reason }
  const reviewRule = REVIEW_RULES.find(rule => rule.pattern.test(normalized))
  if (reviewRule) return { status: "pending", reason: reviewRule.reason }
  return { status: "approved", reason: "auto_approved" }
}

export async function GET(req: NextRequest) {
  const postId = req.nextUrl.searchParams.get("postId")
  if (!postId) return NextResponse.json({ error: "缺少帖子 ID" }, { status: 400 })
  const seedComments = getSeedCommunityComments(postId)
  if (!hasSupabaseConfig()) return NextResponse.json(seedComments)

  const supabase = createServerSupabase()
  const { data, error } = await supabase
    .from("community_comments")
    .select("id,post_id,author_name,author_xp,content,created_at")
    .eq("post_id", postId)
    .eq("status", "approved")
    .order("created_at", { ascending: true })
    .limit(100)

  if (error) {
    console.error("[comments:list]", error)
    return NextResponse.json(seedComments)
  }
  return NextResponse.json([...seedComments, ...(data || [])])
}

export async function POST(req: NextRequest) {
  const auth = await requireUser(req)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const body = await req.json().catch(() => null)
  const postId = String(body?.postId || "").trim()
  const content = cleanContent(body?.content)
  if (!postId) return NextResponse.json({ error: "缺少帖子 ID" }, { status: 400 })
  if (content.length < 2) return NextResponse.json({ error: "评论至少写 2 个字，小白才好接话。" }, { status: 400 })
  if (content.length > 800) return NextResponse.json({ error: "评论最多 800 字，长文建议单独发帖。" }, { status: 400 })
  const moderation = autoModerateComment(content)

  const { data: latestComment } = await auth.adminSupabase
    .from("community_comments")
    .select("created_at")
    .eq("author_id", auth.user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()
  if (latestComment?.created_at && Date.now() - new Date(latestComment.created_at).getTime() < COMMENT_COOLDOWN_MS) {
    return NextResponse.json({ error: "评论太快啦，30 秒后再发，小白怕你被误判成广告机。" }, { status: 429 })
  }

  const { data: adminProfile } = await auth.adminSupabase
    .from("profiles")
    .select("name,email,xp")
    .eq("id", auth.user.id)
    .maybeSingle()
  const { data: userProfile } = adminProfile ? { data: null } : await auth.supabase
    .from("profiles")
    .select("name,email,xp")
    .eq("id", auth.user.id)
    .maybeSingle()

  const profile = adminProfile || userProfile
  const email = profile?.email || auth.user.email || null
  const authorName = profile?.name || email?.split("@")[0] || "小白用户"
  const insertPayload = {
    post_id: postId,
    author_id: auth.user.id,
    author_name: authorName,
    author_email: email,
    author_xp: normalizeXP(email, profile?.xp),
    content,
    status: moderation.status,
    moderation_reason: moderation.reason,
  }

  let result = await auth.adminSupabase
    .from("community_comments")
    .insert(insertPayload)
    .select("id,post_id,author_name,author_xp,content,status,moderation_reason,created_at")
    .single()

  if (result.error) {
    result = await auth.supabase
      .from("community_comments")
      .insert(insertPayload)
      .select("id,post_id,author_name,author_xp,content,status,moderation_reason,created_at")
      .single()
  }

  if (result.error) {
    console.error("[comments:create]", result.error)
    const message = result.error.message.includes("community_comments")
      ? "评论表还没建好，请先在 Supabase 执行最新版 supabase.sql。"
      : result.error.message
    return NextResponse.json({ error: message }, { status: 500 })
  }

  if (moderation.status === "approved") {
    const { data: post } = await auth.adminSupabase
      .from("community_posts")
      .select("comments_count")
      .eq("id", postId)
      .maybeSingle()
    if (post) {
      await auth.adminSupabase
        .from("community_posts")
        .update({ comments_count: Number(post.comments_count || 0) + 1 })
        .eq("id", postId)
    }
    if (!MAX_LEVEL_EMAILS.has(String(email || "").toLowerCase())) {
      await auth.adminSupabase
        .from("profiles")
        .update({ xp: Number(profile?.xp || 0) + 3 })
        .eq("id", auth.user.id)
    }
  }

  return NextResponse.json(result.data)
}
