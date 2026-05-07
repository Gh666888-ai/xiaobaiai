import { NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/server-auth"

const ADMIN_EMAILS = new Set(["15171192200@163.com"])

async function requireAdmin(req: NextRequest) {
  const auth = await requireUser(req)
  if (!auth.ok) return auth
  if (!ADMIN_EMAILS.has(String(auth.user.email || "").toLowerCase())) {
    return { ok: false as const, error: "没有评论审核权限", status: 403 }
  }
  return auth
}

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req)
  if (!admin.ok) return NextResponse.json({ error: admin.error }, { status: admin.status })
  const status = req.nextUrl.searchParams.get("status") || "pending"
  const { data, error } = await admin.adminSupabase
    .from("community_comments")
    .select("id,post_id,author_name,author_email,author_xp,content,status,moderation_reason,created_at")
    .eq("status", status)
    .order("created_at", { ascending: false })
    .limit(80)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data || [])
}

export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin(req)
  if (!admin.ok) return NextResponse.json({ error: admin.error }, { status: admin.status })
  const { id, status } = await req.json().catch(() => ({}))
  if (!id || !["approved", "hidden"].includes(status)) {
    return NextResponse.json({ error: "参数错误" }, { status: 400 })
  }

  const { data: current, error: readError } = await admin.adminSupabase
    .from("community_comments")
    .select("post_id,status")
    .eq("id", id)
    .maybeSingle()
  if (readError) return NextResponse.json({ error: readError.message }, { status: 500 })
  if (!current) return NextResponse.json({ error: "评论不存在" }, { status: 404 })

  const { error } = await admin.adminSupabase
    .from("community_comments")
    .update({ status, moderation_reason: status === "approved" ? "approved_by_admin" : "hidden_by_admin" })
    .eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (status === "approved" && current.status !== "approved") {
    const { data: post } = await admin.adminSupabase
      .from("community_posts")
      .select("comments_count")
      .eq("id", current.post_id)
      .maybeSingle()
    if (post) {
      await admin.adminSupabase
        .from("community_posts")
        .update({ comments_count: Number(post.comments_count || 0) + 1 })
        .eq("id", current.post_id)
    }
  }

  return NextResponse.json({ success: true })
}
