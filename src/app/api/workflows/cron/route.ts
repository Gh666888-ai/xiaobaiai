import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase, hasSupabaseServiceConfig } from "@/lib/server-auth"
import { buildWorkflowPlan } from "@/data/workflows"
import { isWorkflowDue, nextWorkflowRunAt } from "@/lib/workflow-schedule"
import { postWorkflowWebhook } from "@/lib/workflow-webhook"

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

function logCronError(scope: string, error: any) {
  console.error(`[workflow-cron:${scope}]`, {
    code: error?.code,
    message: error?.message,
    details: error?.details,
    hint: error?.hint,
  })
}

export async function POST(req: NextRequest) {
  try {
    if (!hasSupabaseServiceConfig()) {
      return jsonError("工作流定时任务缺少 SUPABASE_SERVICE_KEY。", 500)
    }

    const secret = process.env.WORKFLOW_CRON_SECRET || ""
    if (!secret) {
      return jsonError("工作流定时任务缺少 WORKFLOW_CRON_SECRET。", 500)
    }
    if (req.headers.get("x-cron-secret") !== secret) {
      return jsonError("Cron secret 不正确。", 401)
    }

    const supabase = createServerSupabase()
    const now = new Date()
    const { data: workflows, error } = await supabase
      .from("ai_workflows")
      .select("*")
      .eq("enabled", true)
      .limit(100)

    if (error) {
      logCronError("list-workflows", error)
      return jsonError("读取工作流失败。", 500)
    }

    const due = (workflows || []).filter((workflow: any) => isWorkflowDue(workflow, now))
    const results = []

    for (const workflow of due) {
      const config = workflow.config || {}
      const output = buildWorkflowPlan(workflow.name, workflow.goal, Array.isArray(workflow.steps) ? workflow.steps : [])
      let status = "success"
      let message = `${workflow.name} 已生成。`
      let webhookResult: any = { skipped: true }
      try {
        webhookResult = await postWorkflowWebhook(config.webhookUrl || config.feishuWebhook || config.wecomWebhook || config.n8nWebhook, {
          source: "xiaobaiai.cn",
          workflowId: workflow.id,
          workflowName: workflow.name,
          output,
          ranAt: now.toISOString(),
        }, workflow.id)
        if (webhookResult.ok === false) {
          status = "failed"
          message = webhookResult.blocked ? `Webhook 被安全策略拦截：${webhookResult.reason || "地址不安全"}。` : `Webhook 返回 ${webhookResult.status}。`
        }
      } catch (error: any) {
        status = "failed"
        message = error?.message || "Webhook 调用失败。"
      }

      const { error: insertError } = await supabase.from("workflow_runs").insert({
        user_id: workflow.user_id,
        workflow_id: workflow.id,
        workflow_name: workflow.name,
        status,
        message,
        output,
        started_at: now.toISOString(),
        finished_at: new Date().toISOString(),
        meta: { webhookResult, cron: true },
      })
      if (insertError) {
        logCronError("insert-run", insertError)
        status = "failed"
      }

      const { error: updateError } = await supabase
        .from("ai_workflows")
        .update({
          last_run_at: now.toISOString(),
          last_status: status,
          next_run_at: nextWorkflowRunAt(workflow.schedule, now)?.toISOString() || null,
        })
        .eq("id", workflow.id)
      if (updateError) logCronError("update-workflow", updateError)

      results.push({ id: workflow.id, name: workflow.name, status })
    }

    return NextResponse.json({ checked: workflows?.length || 0, ran: results.length, results })
  } catch (error: any) {
    logCronError("unhandled", error)
    return jsonError("工作流定时任务执行失败。", 500)
  }
}
