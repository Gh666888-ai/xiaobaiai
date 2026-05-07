import { NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/server-auth"
import { buildWorkflowPlan } from "@/data/workflows"
import { postWorkflowWebhook } from "@/lib/workflow-webhook"

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

function logSupabaseError(scope: string, error: any) {
  console.error(`[workflow-run:${scope}]`, {
    code: error?.code,
    message: error?.message,
    details: error?.details,
    hint: error?.hint,
  })
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireUser(req)
  if (!auth.ok) return jsonError(auth.error, auth.status)

  const { data: workflow, error } = await auth.supabase
    .from("ai_workflows")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", auth.user.id)
    .single()

  if (error || !workflow) {
    if (error) logSupabaseError("find", error)
    return jsonError("没有找到这个工作流。", 404)
  }

  const config = workflow.config || {}
  const steps = Array.isArray(workflow.steps) ? workflow.steps : []
  const output = buildWorkflowPlan(workflow.name, workflow.goal, steps)
  const startedAt = new Date()

  let status = "success"
  let message = `${workflow.name} 已生成执行方案。`
  let webhookResult: any = { skipped: true }

  try {
    webhookResult = await postWorkflowWebhook(config.webhookUrl || config.feishuWebhook || config.wecomWebhook || config.n8nWebhook, {
      source: "xiaobaiai.cn",
      workflowId: workflow.id,
      workflowName: workflow.name,
      goal: workflow.goal,
      output,
      ranAt: startedAt.toISOString(),
    }, workflow.id)
    if (webhookResult.ok === false) {
      status = "failed"
      message = webhookResult.blocked ? `Webhook 被安全策略拦截：${webhookResult.reason || "地址不安全"}。` : `Webhook 返回 ${webhookResult.status}，请检查地址或权限。`
    }
  } catch (runError: any) {
    status = "failed"
    message = runError?.message || "Webhook 调用失败。"
  }

  const { data: run, error: runError } = await auth.supabase
    .from("workflow_runs")
    .insert({
      user_id: auth.user.id,
      workflow_id: workflow.id,
      workflow_name: workflow.name,
      status,
      message,
      output,
      started_at: startedAt.toISOString(),
      finished_at: new Date().toISOString(),
      meta: { webhookResult },
    })
    .select("*")
    .single()

  if (runError) logSupabaseError("insert-run", runError)

  const { error: updateError } = await auth.supabase
    .from("ai_workflows")
    .update({ last_run_at: startedAt.toISOString(), last_status: status })
    .eq("id", workflow.id)
    .eq("user_id", auth.user.id)

  if (updateError) logSupabaseError("update-workflow", updateError)

  return NextResponse.json({ status, message, output, run })
}

