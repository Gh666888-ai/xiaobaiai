"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, Bot, CheckCircle2, Clipboard, Database, FileText, GitBranch, History, Loader2, Play, Plus, Save, Send, Settings2, ShieldCheck, Sparkles, Trash2, Workflow } from "lucide-react"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"
import { ContentVisual } from "@/components/ContentVisual"
import { useAuth } from "@/lib/AuthContext"
import { readAppAuth } from "@/lib/app-auth"
import { getUserLevel } from "@/data/user"
import { buildWorkflowPlan, workflowStepLibrary, workflowTemplates, WorkflowStep, WorkflowStepType, WorkflowTemplate } from "@/data/workflows"

type FlowStep = WorkflowStep

type SavedWorkflow = {
  id: string
  template_id?: string
  name: string
  goal: string
  steps: FlowStep[]
  config?: Record<string, string>
  schedule?: string
  enabled?: boolean
  last_run_at?: string
  last_status?: string
  updated_at?: string
}

type WorkflowRun = {
  id: string
  workflow_name: string
  status: string
  message: string
  started_at: string
}

const typeMeta: Record<WorkflowStepType, { label: string; icon: any; color: string }> = {
  trigger: { label: "触发", icon: Play, color: "#e8c96a" },
  collect: { label: "采集", icon: Database, color: "#64b5f6" },
  ai: { label: "AI", icon: Bot, color: "#7ee7d7" },
  action: { label: "动作", icon: Workflow, color: "#5fe0a3" },
  review: { label: "审核", icon: ShieldCheck, color: "#f1c15f" },
  output: { label: "输出", icon: FileText, color: "#ff9a76" },
}

const draftKey = "xiaobaiai:workflow-draft:v1"
const advancedTemplateIds = new Set(["customer-service", "content-pipeline"])

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function cloneStep(step: FlowStep): FlowStep {
  return { ...step, id: makeId() }
}

function authHeaders(): Record<string, string> {
  const token = readAppAuth()?.session?.access_token
  return token ? { Authorization: `Bearer ${token}` } : {}
}

function timeLabel(value?: string) {
  if (!value) return "还没有运行"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return `${date.toLocaleDateString("zh-CN")} ${date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}`
}

export default function WorkflowsClient() {
  const { user } = useAuth()
  const [templateParam, setTemplateParam] = useState("")
  const [selected, setSelected] = useState<WorkflowTemplate>(workflowTemplates[0])
  const [workflowId, setWorkflowId] = useState("")
  const [name, setName] = useState(workflowTemplates[0].name)
  const [goal, setGoal] = useState(workflowTemplates[0].goal)
  const [steps, setSteps] = useState<FlowStep[]>(workflowTemplates[0].steps.map(cloneStep))
  const [config, setConfig] = useState<Record<string, string>>({ schedule: workflowTemplates[0].defaultSchedule })
  const [savedWorkflows, setSavedWorkflows] = useState<SavedWorkflow[]>([])
  const [runs, setRuns] = useState<WorkflowRun[]>([])
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [running, setRunning] = useState(false)
  const [runMessage, setRunMessage] = useState("")
  const [loadingCloud, setLoadingCloud] = useState(false)

  const plan = useMemo(() => buildWorkflowPlan(name, goal, steps), [name, goal, steps])
  const userLevel = getUserLevel(Number(user?.xp || 0))
  const selectedIsAdvanced = advancedTemplateIds.has(selected.id)
  const selectedUnlocked = !selectedIsAdvanced || userLevel.level >= 4

  const applyTemplate = (template: WorkflowTemplate) => {
    setSelected(template)
    setWorkflowId("")
    setName(template.name)
    setGoal(template.goal)
    setSteps(template.steps.map(cloneStep))
    setConfig({ schedule: template.defaultSchedule })
    setCopied(false)
    setSaved(false)
    setRunMessage("")
  }

  const applySavedWorkflow = (workflow: SavedWorkflow) => {
    const template = workflowTemplates.find((item) => item.id === workflow.template_id) || selected
    setSelected(template)
    setWorkflowId(workflow.id)
    setName(workflow.name)
    setGoal(workflow.goal)
    setSteps((workflow.steps || template.steps).map(cloneStep))
    setConfig({ schedule: workflow.schedule || template.defaultSchedule, ...(workflow.config || {}) })
    setSaved(false)
    setRunMessage("")
  }

  const loadCloud = useCallback(async () => {
    if (!user?.userId) return
    setLoadingCloud(true)
    try {
      const headers = authHeaders()
      const [workflowRes, runRes] = await Promise.all([
        fetch("/api/workflows", { headers }),
        fetch("/api/workflows/runs", { headers }),
      ])
      const workflowData = await workflowRes.json().catch(() => ({}))
      const runData = await runRes.json().catch(() => ({}))
      setSavedWorkflows(Array.isArray(workflowData.workflows) ? workflowData.workflows : [])
      setRuns(Array.isArray(runData.runs) ? runData.runs : [])
    } finally {
      setLoadingCloud(false)
    }
  }, [user?.userId])

  useEffect(() => {
    setTemplateParam(new URLSearchParams(window.location.search).get("template") || "")
    const rawDraft = window.localStorage.getItem(draftKey)
    if (!rawDraft) return
    try {
      const draft = JSON.parse(rawDraft) as { name?: string; goal?: string; steps?: FlowStep[]; config?: Record<string, string> }
      if (draft.name) setName(draft.name)
      if (draft.goal) setGoal(draft.goal)
      if (draft.config) setConfig(draft.config)
      if (Array.isArray(draft.steps) && draft.steps.length > 0) setSteps(draft.steps.map((step) => ({ ...step, id: makeId() })))
    } catch {
      window.localStorage.removeItem(draftKey)
    }
  }, [])

  useEffect(() => {
    if (!templateParam || selected.id === templateParam) return
    const template = workflowTemplates.find((item) => item.id === templateParam)
    if (template) applyTemplate(template)
  }, [templateParam, selected.id])

  useEffect(() => {
    loadCloud()
  }, [loadCloud])

  const addStep = (step: FlowStep) => setSteps((current) => [...current, cloneStep(step)])
  const updateStep = (id: string, patch: Partial<FlowStep>) => setSteps((current) => current.map((step) => (step.id === id ? { ...step, ...patch } : step)))
  const removeStep = (id: string) => setSteps((current) => current.filter((step) => step.id !== id))

  const copyPlan = async () => {
    await navigator.clipboard.writeText(plan).catch(() => undefined)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  const saveDraft = async () => {
    if (!user) {
      window.localStorage.setItem(draftKey, JSON.stringify({ name, goal, steps, config }))
      setSaved(true)
      window.setTimeout(() => setSaved(false), 1600)
      return ""
    }
    setSaving(true)
    try {
      const res = await fetch("/api/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ id: workflowId || undefined, templateId: selected.id, name, goal, steps, config, schedule: config.schedule || selected.defaultSchedule, enabled: false }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "保存失败")
      setWorkflowId(data.workflow.id)
      setSaved(true)
      await loadCloud()
      window.setTimeout(() => setSaved(false), 1600)
      return data.workflow.id as string
    } catch (error: any) {
      setRunMessage(error?.message || "保存失败，请稍后再试。")
      return ""
    } finally {
      setSaving(false)
    }
  }

  const runOnce = async () => {
    if (!user) {
      setRunMessage("请先登录，再运行云端工作流。")
      return
    }
    let id = workflowId
    if (!id) {
      id = await saveDraft()
    }
    if (!id) {
      setRunMessage("请先保存工作流，再运行。")
      return
    }
    setRunning(true)
    setRunMessage("")
    try {
      const res = await fetch(`/api/workflows/${id}/run`, { method: "POST", headers: authHeaders() })
      const data = await res.json()
      setRunMessage(data.message || "已运行一次。")
      await loadCloud()
    } catch {
      setRunMessage("运行失败，请检查 Webhook 地址或稍后再试。")
    } finally {
      setRunning(false)
    }
  }

  const guideInputs = [...selected.guide.inputs, ...selected.guide.outputs]

  return (
    <div style={{ background: "#000", minHeight: "100vh", fontFamily: "'Noto Sans SC', sans-serif", position: "relative", overflow: "hidden" }}>
      <MathRain />
      <NavBar />
      <main style={{ maxWidth: 1220, margin: "0 auto", padding: "58px 60px 100px", position: "relative", zIndex: 10, background: "rgba(0,0,0,0.88)" }} className="workflows-page max-sm:px-4">
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 360px", gap: 22, alignItems: "end", marginBottom: 26 }} className="workflow-hero max-sm:grid-cols-1">
          <div>
            <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.36em", color: "#16c4d8", textTransform: "uppercase", marginBottom: 10, fontWeight: 900 }}>Workflow Builder</p>
            <h1 style={{ fontSize: 38, fontWeight: 950, color: "#fff", letterSpacing: "0.02em", marginBottom: 10 }}>AI 工作流搭建器</h1>
            <p style={{ fontSize: 15, color: "#cfcfcf", lineHeight: 1.9, maxWidth: 760 }}>用小白能看懂的方式，把一个想法拆成触发、采集、AI处理、动作、审核和输出。登录后保存到云端，换手机也能继续编辑，并可通过 n8n、Dify、飞书多维表和企业微信 Webhook 运行。</p>
          </div>
          <ContentVisual compact title="AI 自动化流程" label="WORKFLOW" meta="Trigger -> AI -> Action" kind="agent" />
        </div>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 10, marginBottom: 18 }} className="workflow-template-grid max-sm:grid-cols-1">
          {workflowTemplates.map((template) => {
            const active = selected.id === template.id
            const isAdvanced = advancedTemplateIds.has(template.id)
            const unlocked = !isAdvanced || userLevel.level >= 4
            return (
              <button key={template.id} onClick={() => applyTemplate(template)} style={{ textAlign: "left", border: `1px solid ${active ? "#16c4d8" : isAdvanced ? "rgba(201,168,76,0.45)" : "#202020"}`, borderRadius: 10, background: active ? "rgba(22,196,216,0.08)" : isAdvanced ? "rgba(201,168,76,0.045)" : "rgba(255,255,255,0.03)", padding: 15, cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 7 }}>
                  <p style={{ color: active ? "#7ee7f0" : "#fff", fontSize: 15, fontWeight: 950 }}>{template.name}</p>
                  {isAdvanced && <span style={{ color: unlocked ? "#7ee7f0" : "#e8c96a", border: `1px solid ${unlocked ? "rgba(126,231,255,0.5)" : "rgba(201,168,76,0.45)"}`, borderRadius: 999, padding: "2px 7px", fontSize: 10, fontWeight: 950, whiteSpace: "nowrap" }}>{unlocked ? "已解锁" : "高级模板"}</span>}
                </div>
                <p style={{ color: "#999", fontSize: 12, lineHeight: 1.65 }}>{template.scene} · {template.difficulty} · {template.time}</p>
              </button>
            )
          })}
        </section>
        {selectedIsAdvanced && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "center", border: `1px solid ${selectedUnlocked ? "rgba(126,231,255,0.4)" : "rgba(201,168,76,0.42)"}`, borderRadius: 12, background: selectedUnlocked ? "rgba(126,231,255,0.045)" : "rgba(201,168,76,0.055)", padding: "13px 15px", marginBottom: 18 }} className="max-sm:grid-cols-1">
            <p style={{ color: "#d8d8d8", fontSize: 13, lineHeight: 1.7 }}>
              {selectedUnlocked ? `你的身份已满足要求，高级工作流模板已解锁，适合保存到云端反复改。` : "这是高级模板。现在可以预览和学习，点亮更高阶铭牌后会显示已解锁状态，并优先推荐给高等级用户。"}
            </p>
            {!selectedUnlocked && <Link href="/growth" className="btn-outline" style={{ textDecoration: "none", whiteSpace: "nowrap" }}>去升级</Link>}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "250px minmax(0,1fr) 350px", gap: 16 }} className="workflow-layout max-sm:grid-cols-1">
          <aside style={{ display: "flex", flexDirection: "column", gap: 12 }} className="workflow-sidebar">
            <section style={{ border: "1px solid #1a1a1a", borderRadius: 12, background: "rgba(255,255,255,0.03)", padding: 16 }} className="workflow-cloud-panel">
              <h2 style={{ color: "#fff", fontSize: 15, fontWeight: 950, marginBottom: 12 }}>我的云端库</h2>
              {!user && <p style={{ color: "#999", fontSize: 12, lineHeight: 1.7 }}>登录后可以把工作流保存到账号，手机和电脑同步。</p>}
              {user && loadingCloud && <p style={{ color: "#888", fontSize: 12 }}>正在读取...</p>}
              {user && !loadingCloud && savedWorkflows.length === 0 && <p style={{ color: "#999", fontSize: 12, lineHeight: 1.7 }}>还没有云端工作流，保存当前流程后会出现在这里。</p>}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }} className="workflow-cloud-list">
                {savedWorkflows.map((workflow) => (
                  <button key={workflow.id} onClick={() => applySavedWorkflow(workflow)} style={{ textAlign: "left", border: `1px solid ${workflow.id === workflowId ? "#16c4d8" : "#232323"}`, borderRadius: 8, background: workflow.id === workflowId ? "rgba(22,196,216,0.08)" : "rgba(0,0,0,0.22)", padding: 10, cursor: "pointer" }} className="workflow-cloud-item">
                    <span style={{ display: "block", color: "#eee", fontSize: 12, fontWeight: 900 }}>{workflow.name}</span>
                    <span style={{ display: "block", color: "#777", fontSize: 10, marginTop: 4 }}>{timeLabel(workflow.last_run_at)} · {workflow.last_status || "draft"}</span>
                  </button>
                ))}
              </div>
            </section>

            <section style={{ border: "1px solid #1a1a1a", borderRadius: 12, background: "rgba(255,255,255,0.03)", padding: 16 }} className="workflow-step-library">
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <Plus size={16} style={{ color: "#16c4d8" }} />
                <h2 style={{ color: "#fff", fontSize: 15, fontWeight: 950 }}>添加步骤</h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {workflowStepLibrary.map((step) => {
                  const Icon = typeMeta[step.type].icon
                  return (
                    <button key={step.id} onClick={() => addStep(step)} style={{ display: "grid", gridTemplateColumns: "24px 1fr", gap: 9, textAlign: "left", border: "1px solid #232323", borderRadius: 8, background: "rgba(0,0,0,0.22)", padding: 10, cursor: "pointer" }} className="workflow-step-option">
                      <Icon size={16} style={{ color: typeMeta[step.type].color, marginTop: 2 }} />
                      <span>
                        <span style={{ display: "block", color: "#ddd", fontSize: 12, fontWeight: 900 }}>{step.title}</span>
                        <span style={{ display: "block", color: "#777", fontSize: 11, lineHeight: 1.55, marginTop: 2 }}>{step.tool}</span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </section>

          </aside>

          <section style={{ border: "1px solid #1a1a1a", borderRadius: 12, background: "rgba(255,255,255,0.03)", padding: 18 }} className="workflow-editor-panel">
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10, marginBottom: 16 }}>
              <input value={name} onChange={(event) => setName(event.target.value)} className="form-input" placeholder="工作流名称" />
              <textarea value={goal} onChange={(event) => setGoal(event.target.value)} className="form-input" rows={3} placeholder="这个工作流要解决什么问题？" />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <GitBranch size={17} style={{ color: "#16c4d8" }} />
              <h2 style={{ color: "#fff", fontSize: 17, fontWeight: 950 }}>流程编排</h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
              {steps.map((step, index) => {
                const meta = typeMeta[step.type]
                const Icon = meta.icon
                return (
                  <div key={step.id} style={{ border: "1px solid #242424", borderRadius: 10, background: "rgba(0,0,0,0.24)", padding: 14 }} className="workflow-step-card">
                    <div style={{ display: "grid", gridTemplateColumns: "34px 1fr auto", gap: 10, alignItems: "start" }} className="workflow-step-card-grid">
                      <div style={{ width: 34, height: 34, borderRadius: 9, border: `1px solid ${meta.color}`, background: `${meta.color}18`, display: "flex", alignItems: "center", justifyContent: "center", color: meta.color, fontWeight: 950 }}>
                        <Icon size={17} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: meta.color, fontWeight: 900 }}>STEP {index + 1} · {meta.label}</span>
                          {index < steps.length - 1 && <ArrowRight size={13} style={{ color: "#555" }} />}
                        </div>
                        <input value={step.title} onChange={(event) => updateStep(step.id, { title: event.target.value })} className="form-input" style={{ marginBottom: 8 }} />
                        <textarea value={step.detail} onChange={(event) => updateStep(step.id, { detail: event.target.value })} className="form-input" rows={2} style={{ marginBottom: 8 }} />
                        <input value={step.tool} onChange={(event) => updateStep(step.id, { tool: event.target.value })} className="form-input" placeholder="推荐工具" />
                      </div>
                      <button onClick={() => removeStep(step.id)} aria-label="删除步骤" style={{ width: 34, height: 34, borderRadius: 9, border: "1px solid #2a2a2a", background: "rgba(255,255,255,0.03)", color: "#888", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            <section style={{ border: "1px solid #17343a", borderRadius: 12, padding: 16, background: "rgba(22,196,216,0.045)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <Settings2 size={17} style={{ color: "#7ee7f0" }} />
                <h2 style={{ color: "#fff", fontSize: 16, fontWeight: 950 }}>小白一键配置向导</h2>
              </div>
              <p style={{ color: "#aaa", fontSize: 12, lineHeight: 1.75, marginBottom: 12 }}>按模板填写账号、来源和推送地址，小白AI 会生成可执行配置。Webhook 支持 n8n、Dify Workflow、飞书机器人、企业微信机器人。</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }} className="workflow-guide-grid max-sm:grid-cols-1">
                <input className="form-input" value={config.schedule || ""} onChange={(event) => setConfig((prev) => ({ ...prev, schedule: event.target.value }))} placeholder={selected.defaultSchedule} />
                {guideInputs.map((input) => (
                  <input key={input.key} className="form-input" value={config[input.key] || ""} onChange={(event) => setConfig((prev) => ({ ...prev, [input.key]: event.target.value }))} placeholder={`${input.label}：${input.placeholder}`} />
                ))}
              </div>
              <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                {selected.guide.accounts.map((account) => <span key={account} style={{ border: "1px solid #1d3d43", background: "rgba(0,0,0,0.18)", color: "#8eeaf2", borderRadius: 999, padding: "4px 9px", fontSize: 11 }}>{account}</span>)}
              </div>
            </section>
          </section>

          <aside style={{ border: "1px solid #17343a", borderRadius: 12, background: "rgba(22,196,216,0.045)", padding: 18, alignSelf: "start" }} className="workflow-output-panel">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Sparkles size={17} style={{ color: "#7ee7f0" }} />
              <h2 style={{ color: "#fff", fontSize: 17, fontWeight: 950 }}>执行方案</h2>
            </div>
            <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", color: "#ddd", fontSize: 12, lineHeight: 1.75, fontFamily: "'Noto Sans SC', sans-serif", background: "rgba(0,0,0,0.28)", border: "1px solid #1f1f1f", borderRadius: 10, padding: 13, maxHeight: 360, overflow: "auto" }}>{plan}</pre>
            <button onClick={copyPlan} className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 12 }}>
              {copied ? <CheckCircle2 size={15} /> : <Clipboard size={15} />}
              {copied ? "已复制" : "复制方案"}
            </button>
            <button onClick={saveDraft} className="btn-outline" disabled={saving} style={{ width: "100%", justifyContent: "center", marginTop: 10 }}>
              {saving ? <Loader2 size={15} className="spin" /> : saved ? <CheckCircle2 size={15} /> : <Save size={15} />}
              {user ? (saved ? "已保存到云端" : "保存到云端库") : (saved ? "已保存本机草稿" : "保存本机草稿")}
            </button>
            <button onClick={runOnce} className="btn-primary" disabled={running || !user} style={{ width: "100%", justifyContent: "center", marginTop: 10 }}>
              {running ? <Loader2 size={15} className="spin" /> : <Send size={15} />}
              运行一次
            </button>
            {!user && <p style={{ color: "#999", fontSize: 12, lineHeight: 1.7, marginTop: 10 }}>运行和云端同步需要登录。本机草稿仍可保存。</p>}
            {runMessage && <p style={{ color: runMessage.includes("失败") ? "#ff9a76" : "#8eeaf2", fontSize: 12, lineHeight: 1.7, marginTop: 10 }}>{runMessage}</p>}

            <div style={{ marginTop: 16, border: "1px solid #202020", borderRadius: 10, padding: 13, background: "rgba(0,0,0,0.2)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <History size={15} style={{ color: "#7ee7f0" }} />
                <p style={{ color: "#fff", fontSize: 13, fontWeight: 950 }}>运行记录</p>
              </div>
              {runs.length === 0 ? (
                <p style={{ color: "#aaa", fontSize: 12, lineHeight: 1.75 }}>还没有运行记录。运行一次后，会看到类似“今天 08:00 资讯早报已生成”。</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {runs.slice(0, 8).map((run) => (
                    <div key={run.id} style={{ border: "1px solid #242424", borderRadius: 8, padding: 9, background: "rgba(255,255,255,0.025)" }}>
                      <p style={{ color: "#ddd", fontSize: 12, fontWeight: 850 }}>{timeLabel(run.started_at)} {run.workflow_name}</p>
                      <p style={{ color: run.status === "success" ? "#8eeaf2" : "#ff9a76", fontSize: 11, marginTop: 3 }}>{run.message}</p>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
                <Link href="/community/new" className="btn-outline" style={{ textDecoration: "none", padding: "7px 12px" }}>发到社区</Link>
                <Link href="/learn/4" className="btn-outline" style={{ textDecoration: "none", padding: "7px 12px" }}>学习自动化</Link>
              </div>
            </div>
          </aside>
        </div>

        <style>{`
          @media (max-width: 760px) {
            .workflows-page {
              padding: 28px 12px 112px !important;
              background: rgba(0,0,0,0.94) !important;
            }
            .workflow-hero {
              display: block !important;
              margin-bottom: 18px !important;
            }
            .workflow-hero h1 {
              font-size: 27px !important;
              line-height: 1.18 !important;
              margin-bottom: 10px !important;
            }
            .workflow-hero p:not(:first-child) {
              font-size: 13px !important;
              line-height: 1.75 !important;
            }
            .workflow-hero > div:last-child {
              display: none !important;
            }
            .workflow-template-grid {
              display: flex !important;
              grid-template-columns: none !important;
              gap: 10px !important;
              overflow-x: auto !important;
              padding: 2px 0 12px !important;
              margin-bottom: 14px !important;
              scroll-snap-type: x proximity;
            }
            .workflow-template-grid > button {
              flex: 0 0 76%;
              min-width: 236px;
              scroll-snap-align: start;
              padding: 13px !important;
            }
            .workflow-layout {
              display: flex !important;
              flex-direction: column !important;
              gap: 12px !important;
            }
            .workflow-sidebar {
              display: flex !important;
              flex-direction: column !important;
              gap: 12px !important;
            }
            .workflow-cloud-panel,
            .workflow-step-library,
            .workflow-editor-panel,
            .workflow-output-panel {
              border-radius: 10px !important;
              padding: 14px !important;
            }
            .workflow-cloud-panel {
              order: 1;
              border-color: #17343a !important;
              background: rgba(22,196,216,0.05) !important;
            }
            .workflow-step-library {
              order: 2;
            }
            .workflow-cloud-list {
              display: flex !important;
              flex-direction: row !important;
              overflow-x: auto !important;
              gap: 8px !important;
              padding-bottom: 4px;
            }
            .workflow-cloud-item {
              flex: 0 0 76%;
              min-width: 230px;
            }
            .workflow-step-library > div:last-child {
              display: grid !important;
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
              gap: 8px !important;
            }
            .workflow-step-option {
              display: flex !important;
              flex-direction: column !important;
              gap: 7px !important;
              min-height: 92px !important;
            }
            .workflow-editor-panel {
              order: 2;
            }
            .workflow-output-panel {
              order: 3;
            }
            .workflow-step-card {
              padding: 12px !important;
            }
            .workflow-step-card-grid {
              display: grid !important;
              grid-template-columns: 30px minmax(0, 1fr) 36px !important;
              gap: 8px !important;
            }
            .workflow-step-card-grid > div:first-child {
              width: 30px !important;
              height: 30px !important;
            }
            .workflow-guide-grid {
              display: grid !important;
              grid-template-columns: 1fr !important;
            }
            .workflow-output-panel pre {
              max-height: 220px !important;
              font-size: 12px !important;
            }
            .workflow-output-panel .btn-primary,
            .workflow-output-panel .btn-outline {
              width: 100% !important;
              justify-content: center !important;
              min-height: 46px !important;
              border-radius: 9px !important;
            }
            .workflows-page input,
            .workflows-page textarea {
              font-size: 15px !important;
              border-radius: 8px !important;
            }
          }
        `}</style>
      </main>
    </div>
  )
}
