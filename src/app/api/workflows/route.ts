import { NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/server-auth"

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

function logSupabaseError(scope: string, error: any) {
  console.error(`[workflows:${scope}]`, {
    code: error?.code,
    message: error?.message,
    details: error?.details,
    hint: error?.hint,
  })
}

export async function GET(req: NextRequest) {
  const auth = await requireUser(req)
  if (!auth.ok) return jsonError(auth.error, auth.status)

  const { data, error } = await auth.supabase
    .from("ai_workflows")
    .select("*")
    .eq("user_id", auth.user.id)
    .order("updated_at", { ascending: false })

  if (error) {
    logSupabaseError("list", error)
    return jsonError("读取工作流库失败，请稍后再试。", 500)
  }
  return NextResponse.json({ workflows: data || [] })
}

export async function POST(req: NextRequest) {
  const auth = await requireUser(req)
  if (!auth.ok) return jsonError(auth.error, auth.status)

  const body = await req.json().catch(() => null)
  const name = String(body?.name || "").trim()
  const goal = String(body?.goal || "").trim()
  const templateId = String(body?.templateId || body?.template_id || "").trim()
  const steps = Array.isArray(body?.steps) ? body.steps : []
  const config = body?.config && typeof body.config === "object" ? body.config : {}
  const schedule = String(body?.schedule || "").trim()
  const enabled = Boolean(body?.enabled)

  if (!name) return jsonError("请填写工作流名称。")
  if (!steps.length) return jsonError("至少需要一个工作流步骤。")

  const payload = {
    id: body?.id || undefined,
    user_id: auth.user.id,
    template_id: templateId,
    name,
    goal,
    steps,
    config,
    schedule,
    enabled,
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await auth.supabase
    .from("ai_workflows")
    .upsert(payload, { onConflict: "id" })
    .select("*")
    .single()

  if (error) {
    logSupabaseError("save", error)
    return jsonError(`保存工作流失败：${error.message || "请稍后再试。"}`, 500)
  }
  return NextResponse.json({ workflow: data })
}

