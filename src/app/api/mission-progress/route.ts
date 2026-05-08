import { NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/server-auth"

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

function safeProgress(value: unknown) {
  if (!value || typeof value !== "object") return null
  const progress = value as any
  if (typeof progress.activeMissionId !== "string") return null
  if (!progress.missions || typeof progress.missions !== "object") return null
  return {
    activeMissionId: progress.activeMissionId.slice(0, 120),
    missions: progress.missions,
  }
}

export async function GET(req: NextRequest) {
  const auth = await requireUser(req)
  if (!auth.ok) return jsonError(auth.error, auth.status)

  const { data, error } = await auth.supabase
    .from("user_mission_progress")
    .select("progress,updated_at")
    .eq("user_id", auth.user.id)
    .maybeSingle()

  if (error) {
    console.error("[mission-progress:get]", { code: error.code, message: error.message, details: error.details, hint: error.hint })
    return jsonError("任务进度读取失败，已先使用本机进度。", 500)
  }

  return NextResponse.json({ progress: data?.progress || null, updatedAt: data?.updated_at || null })
}

export async function POST(req: NextRequest) {
  const auth = await requireUser(req)
  if (!auth.ok) return jsonError(auth.error, auth.status)

  const body = await req.json().catch(() => null)
  const progress = safeProgress(body?.progress)
  if (!progress) return jsonError("任务进度格式不正确。")

  const now = new Date().toISOString()
  const { error } = await auth.supabase
    .from("user_mission_progress")
    .upsert({
      user_id: auth.user.id,
      progress,
      updated_at: now,
    }, { onConflict: "user_id" })

  if (error) {
    console.error("[mission-progress:save]", { code: error.code, message: error.message, details: error.details, hint: error.hint })
    return jsonError("任务进度同步失败，已先保存在本机。", 500)
  }

  return NextResponse.json({ ok: true, updatedAt: now })
}
