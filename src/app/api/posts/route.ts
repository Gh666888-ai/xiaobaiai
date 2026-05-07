import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { requireUser } from "@/lib/server-auth"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
)

const MAX_LEVEL_EMAILS = new Set(["15171192200@163.com", "109020070@qq.com", "771239559@qq.com"])
const MAX_LEVEL_XP = 100000
const ADMIN_EMAILS = new Set(["15171192200@163.com"])

function normalizeXP(email?: string | null, xp?: number | null) {
  return MAX_LEVEL_EMAILS.has(String(email || "").toLowerCase()) ? MAX_LEVEL_XP : Number(xp || 0)
}

function dayKey(now = new Date()) {
  return new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString().slice(0, 10)
}

async function recordGrowthEvent(userId: string, eventKey: string, reason: string, amount: number) {
  const { error } = await supabase.from("growth_events").insert({
    user_id: userId,
    event_key: eventKey,
    reason,
    amount,
    day_key: dayKey(),
  })
  if (error && String(error.code || "") !== "23505") {
    console.error("[posts:growth-event]", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    })
  }
}

async function requireAdmin(req: NextRequest) {
  const auth = await requireUser(req)
  if (!auth.ok) return auth
  if (!ADMIN_EMAILS.has(String(auth.user.email || "").toLowerCase())) {
    return { ok: false as const, error: "没有审核权限", status: 403 }
  }
  return auth
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
  const body = await req.json()
  const { title, content, category, tags, author_name } = body
  if (!title || !content) return NextResponse.json({ error: "Missing fields" }, { status: 400 })
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
  const { data: insertedPost, error } = await supabase.from("community_posts").insert({
    title,
    content,
    category: category || "经验分享",
    tags: tags || [],
    author_name: profile?.name || author_name || "匿名用户",
    author_email: profile?.email || null,
    author_xp: normalizeXP(profile?.email, profile?.xp),
    status: "pending",
    pinned: false,
    featured: false,
    published_at: new Date().toISOString().slice(0, 10),
  }).select("id").single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  let awarded = 0
  if (userId && !MAX_LEVEL_EMAILS.has(String(profile?.email || "").toLowerCase())) {
    await supabase
      .from("profiles")
      .update({ xp: Number(profile?.xp || 0) + 10 })
      .eq("id", userId)
    await recordGrowthEvent(userId, `post:${insertedPost?.id || Date.now()}`, "post", 10)
    awarded = 10
  }
  return NextResponse.json({ success: true, awarded })
}

export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin(req)
  if (!admin.ok) return NextResponse.json({ error: admin.error }, { status: admin.status })
  const { id, status, pinned, featured, editor_note } = await req.json()
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
  const update: Record<string, unknown> = {}
  if (status) update.status = status
  if (typeof pinned === "boolean") update.pinned = pinned
  if (typeof featured === "boolean") update.featured = featured
  if (typeof editor_note === "string") update.editor_note = editor_note
  if (Object.keys(update).length === 0) return NextResponse.json({ error: "No updates" }, { status: 400 })

  const { error } = await supabase.from("community_posts").update(update).eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
