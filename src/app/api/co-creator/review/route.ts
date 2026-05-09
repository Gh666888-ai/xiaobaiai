import { NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/server-auth"

const ADMIN_EMAILS = new Set(["15171192200@163.com"])
const CO_CREATOR_MIN_XP = 2480

async function requireAdmin(req: NextRequest) {
  const auth = await requireUser(req)
  if (!auth.ok) return auth
  if (!ADMIN_EMAILS.has(String(auth.user.email || "").toLowerCase())) {
    return { ok: false as const, error: "没有共创审核权限", status: 403 }
  }
  return auth
}

function missingColumn(error: any) {
  const text = `${error?.message || ""}\n${error?.details || ""}\n${error?.hint || ""}`
  return /co_creator_/i.test(text) || /column/i.test(text)
}

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req)
  if (!admin.ok) return NextResponse.json({ error: admin.error }, { status: admin.status })

  const { data, error } = await admin.adminSupabase
    .from("profiles")
    .select("id,name,email,xp,created_at,co_creator_approved,co_creator_track,co_creator_reviewed_at,co_creator_note")
    .gte("xp", CO_CREATOR_MIN_XP)
    .eq("co_creator_approved", false)
    .order("xp", { ascending: false })
    .limit(80)

  if (error && missingColumn(error)) {
    return NextResponse.json({ error: "profiles 表缺少共创审核字段，请先执行 supabase.sql 里的 co_creator_* 字段补丁。", candidates: [] }, { status: 200 })
  }
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ candidates: data || [] })
}

export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin(req)
  if (!admin.ok) return NextResponse.json({ error: admin.error }, { status: admin.status })
  const body = await req.json().catch(() => ({}))
  const id = String(body?.id || "")
  const track = body?.track === "team" ? "team" : "personal"
  const approved = body?.approved !== false
  const note = String(body?.note || (approved ? "co-creator approved by admin" : "co-creator review reset")).slice(0, 300)

  if (!id) return NextResponse.json({ error: "缺少用户 ID" }, { status: 400 })

  const { error } = await admin.adminSupabase
    .from("profiles")
    .update({
      co_creator_approved: approved,
      co_creator_track: track,
      co_creator_reviewed_at: new Date().toISOString(),
      co_creator_note: note,
    })
    .eq("id", id)

  if (error && missingColumn(error)) {
    return NextResponse.json({ error: "profiles 表缺少共创审核字段，请先执行 supabase.sql 里的 co_creator_* 字段补丁。" }, { status: 500 })
  }
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
