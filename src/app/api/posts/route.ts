import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
)

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status") || "approved"
  const { data, error } = await supabase
    .from("community_posts")
    .select("*")
    .eq("status", status)
    .order("pinned", { ascending: false })
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(50)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data || [])
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { title, content, category, tags, author_name } = body
  if (!title || !content) return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  const { error } = await supabase.from("community_posts").insert({
    title,
    content,
    category: category || "经验分享",
    tags: tags || [],
    author_name: author_name || "匿名用户",
    status: "pending",
    pinned: false,
    featured: false,
    published_at: new Date().toISOString().slice(0, 10),
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function PATCH(req: NextRequest) {
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
