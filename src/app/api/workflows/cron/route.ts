import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase, hasSupabaseConfig } from "@/lib/server-auth"
import { buildWorkflowPlan } from "@/data/workflows"

function dueBySchedule(schedule = "", now = new Date()) {
  const text = schedule.trim()
  const hourMinute = text.match(/(\d{1,2})[:：](\d{2})/)
  if (!hourMinute) return false
  const hour = Number(hourMinute[1])
  const minute = Number(hourMinute[2])
  if (now.getHours() !== hour || now.getMinutes() !== minute) return false
  if (text.includes("每周五")) return now.getDay() === 5
  if (text.includes("每周")) return true
  return text.includes("每天")
}

async function postWebhook(url: string, payload: unknown) {
  if (!url || !/^https?:\/\//i.test(url)) return { skipped: true }
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(12000),
  })
  return { ok: res.ok, status: res.status, text: await res.text().catch(() => "") }
}

export async function POST(req: NextRequest) {
  if (!hasSupabaseConfig()) return NextResponse.json({ error: "Supabase 配置缺失。" }, { status: 500 })
  const secret = process.env.WORKFLOW_CRON_SECRET || ""
  if (secret && req.headers.get("x-cron-secret") !== secret) {
    return NextResponse.json({ error: "Cron secret 不正确。" }, { status: 401 })
  }

  const supabase = createServerSupabase()
  const now = new Date()
  const { data: workflows, error } = await supabase
    .from("ai_workflows")
    .select("*")
    .eq("enabled", true)
    .limit(100)

  if (error) return NextResponse.json({ error: "读取工作流失败。" }, { status: 500 })

  const due = (workflows || []).filter((workflow: any) => dueBySchedule(workflow.schedule, now))
  const results = []

  for (const workflow of due) {
    const config = workflow.config || {}
    const output = buildWorkflowPlan(workflow.name, workflow.goal, Array.isArray(workflow.steps) ? workflow.steps : [])
    let status = "success"
    let message = `${workflow.name} 已生成。`
    let webhookResult: any = { skipped: true }
    try {
      webhookResult = await postWebhook(config.webhookUrl || config.feishuWebhook || config.wecomWebhook || config.n8nWebhook, {
        source: "xiaobaiai.cn",
        workflowId: workflow.id,
        workflowName: workflow.name,
        output,
        ranAt: now.toISOString(),
      })
      if (webhookResult.ok === false) {
        status = "failed"
        message = `Webhook 返回 ${webhookResult.status}。`
      }
    } catch (error: any) {
      status = "failed"
      message = error?.message || "Webhook 调用失败。"
    }

    await supabase.from("workflow_runs").insert({
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
    await supabase.from("ai_workflows").update({ last_run_at: now.toISOString(), last_status: status }).eq("id", workflow.id)
    results.push({ id: workflow.id, name: workflow.name, status })
  }

  return NextResponse.json({ checked: workflows?.length || 0, ran: results.length, results })
}
