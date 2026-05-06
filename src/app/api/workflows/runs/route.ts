import { NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/server-auth"

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

function logSupabaseError(scope: string, error: any) {
  console.error(`[workflow-runs:${scope}]`, {
    code: error?.code,
    message: error?.message,
    details: error?.details,
    hint: error?.hint,
  })
}

export async function GET(req: NextRequest) {
  const auth = await requireUser(req)
  if (!auth.ok) return jsonError(auth.error, auth.status)

  const { searchParams } = new URL(req.url)
  const workflowId = searchParams.get("workflowId")

  let query = auth.supabase
    .from("workflow_runs")
    .select("*")
    .eq("user_id", auth.user.id)
    .order("started_at", { ascending: false })
    .limit(30)

  if (workflowId) query = query.eq("workflow_id", workflowId)

  const { data, error } = await query
  if (error) {
    logSupabaseError("list", error)
    return jsonError("读取运行记录失败，请稍后再试。", 500)
  }
  return NextResponse.json({ runs: data || [] })
}

