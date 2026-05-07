import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase, hasSupabaseConfig, requireUser } from "@/lib/server-auth"
import { getSeedCommunityComments } from "@/data/community-comments"

const MAX_LEVEL_EMAILS = new Set(["15171192200@163.com", "109020070@qq.com"])
const MAX_LEVEL_XP = 100000

function normalizeXP(email?: string | null, xp?: number | null) {
  return MAX_LEVEL_EMAILS.has(String(email || "").toLowerCase()) ? MAX_LEVEL_XP : Number(xp || 0)
}

function cleanContent(value: unknown) {
  return String(value || "").trim().replace(/\n{4,}/g, "\n\n\n")
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
    status: "approved",
  }

  let result = await auth.adminSupabase
    .from("community_comments")
    .insert(insertPayload)
    .select("id,post_id,author_name,author_xp,content,created_at")
    .single()

  if (result.error) {
    result = await auth.supabase
      .from("community_comments")
      .insert(insertPayload)
      .select("id,post_id,author_name,author_xp,content,created_at")
      .single()
  }

  if (result.error) {
    console.error("[comments:create]", result.error)
    const message = result.error.message.includes("community_comments")
      ? "评论表还没建好，请先在 Supabase 执行最新版 supabase.sql。"
      : result.error.message
    return NextResponse.json({ error: message }, { status: 500 })
  }

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

  return NextResponse.json(result.data)
}
