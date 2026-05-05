import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: NextRequest) {
  try {
    const { title, content, category, tags, author_name } = await req.json()
    if (!title || !content) return NextResponse.json({ error: "Missing fields" }, { status: 400 })

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    )

    const { error } = await supabase.from("community_posts").insert({
      title, content, category, tags: tags || [],
      author_name, published_at: new Date().toISOString().slice(0, 10)
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
