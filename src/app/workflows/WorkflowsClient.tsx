"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, Bot, CheckCircle2, Clipboard, Database, FileText, GitBranch, Play, Plus, Save, ShieldCheck, Sparkles, Trash2, Workflow } from "lucide-react"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"
import { ContentVisual } from "@/components/ContentVisual"

type StepType = "trigger" | "collect" | "ai" | "action" | "review" | "output"

type FlowStep = {
  id: string
  type: StepType
  title: string
  detail: string
  tool: string
}

type Template = {
  id: string
  name: string
  scene: string
  goal: string
  difficulty: string
  time: string
  steps: FlowStep[]
}

const typeMeta: Record<StepType, { label: string; icon: any; color: string }> = {
  trigger: { label: "触发", icon: Play, color: "#e8c96a" },
  collect: { label: "采集", icon: Database, color: "#64b5f6" },
  ai: { label: "AI", icon: Bot, color: "#7ee7d7" },
  action: { label: "动作", icon: Workflow, color: "#5fe0a3" },
  review: { label: "审核", icon: ShieldCheck, color: "#f1c15f" },
  output: { label: "输出", icon: FileText, color: "#ff9a76" },
}

const stepLibrary: FlowStep[] = [
  { id: "trigger-time", type: "trigger", title: "定时触发", detail: "每天、每周或每月自动运行一次。", tool: "Cron / QClaw / n8n" },
  { id: "trigger-form", type: "trigger", title: "表单触发", detail: "用户提交需求后自动进入流程。", tool: "飞书表单 / 网站表单" },
  { id: "collect-web", type: "collect", title: "抓取网页信息", detail: "读取指定网站、RSS、热榜或公开资料。", tool: "Browser / Tavily / RSS" },
  { id: "collect-file", type: "collect", title: "读取文件资料", detail: "读取 PDF、Word、Excel 或知识库。", tool: "Dify 知识库 / Kimi" },
  { id: "ai-summary", type: "ai", title: "AI 摘要与分类", detail: "把长内容压缩成要点，并按主题分类。", tool: "DeepSeek / Kimi / 通义千问" },
  { id: "ai-draft", type: "ai", title: "AI 生成草稿", detail: "生成回复、文章、日报、脚本或方案初稿。", tool: "小白AI / DeepSeek" },
  { id: "action-sheet", type: "action", title: "写入表格", detail: "把结构化结果写入表格、数据库或多维表。", tool: "飞书多维表格 / Excel" },
  { id: "action-send", type: "action", title: "发送通知", detail: "把结果推送到微信、飞书、邮箱或站内消息。", tool: "企业微信 / 飞书 / 邮箱" },
  { id: "review-human", type: "review", title: "人工确认", detail: "对外发送、扣费、删除文件前必须人工确认。", tool: "人工审核节点" },
  { id: "output-report", type: "output", title: "生成报告", detail: "输出 Markdown、PDF、日报、看板或任务清单。", tool: "小白AI / Gamma / 飞书文档" },
]

const templates: Template[] = [
  {
    id: "daily-news",
    name: "AI 资讯早报",
    scene: "内容运营",
    goal: "每天自动抓取 AI 资讯，筛选重点并生成早报。",
    difficulty: "入门",
    time: "30 分钟搭好",
    steps: [
      stepLibrary[0],
      stepLibrary[2],
      stepLibrary[4],
      stepLibrary[9],
      stepLibrary[7],
    ],
  },
  {
    id: "customer-service",
    name: "智能客服草稿",
    scene: "客服/私域",
    goal: "收到用户问题后，自动检索资料并生成回复草稿。",
    difficulty: "进阶",
    time: "1 小时搭好",
    steps: [
      stepLibrary[1],
      stepLibrary[3],
      stepLibrary[5],
      stepLibrary[8],
      stepLibrary[7],
    ],
  },
  {
    id: "weekly-report",
    name: "自动周报",
    scene: "办公提效",
    goal: "汇总本周数据、任务和沟通记录，生成周报。",
    difficulty: "入门",
    time: "40 分钟搭好",
    steps: [
      stepLibrary[0],
      stepLibrary[6],
      stepLibrary[4],
      stepLibrary[9],
      stepLibrary[8],
    ],
  },
  {
    id: "content-pipeline",
    name: "内容矩阵发布",
    scene: "自媒体",
    goal: "一个选题生成多平台内容草稿，再人工审核发布。",
    difficulty: "进阶",
    time: "1-2 小时",
    steps: [
      stepLibrary[1],
      stepLibrary[5],
      stepLibrary[9],
      stepLibrary[8],
      stepLibrary[7],
    ],
  },
]

const draftKey = "xiaobaiai:workflow-draft:v1"

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function cloneStep(step: FlowStep): FlowStep {
  return { ...step, id: makeId() }
}

function buildPlan(name: string, goal: string, steps: FlowStep[]) {
  return [
    `# ${name || "我的 AI 工作流"}`,
    "",
    `目标：${goal || "把重复任务拆成可执行的自动化流程。"}`,
    "",
    "## 流程步骤",
    ...steps.map((step, index) => `${index + 1}. 【${typeMeta[step.type].label}】${step.title}\n   - 说明：${step.detail}\n   - 推荐工具：${step.tool}`),
    "",
    "## 上线前检查",
    "- 是否明确触发条件，避免误触发。",
    "- 是否设置人工审核点，特别是对外发送、扣费、删除文件和客户沟通。",
    "- 是否准备失败重试和异常通知。",
    "- 是否把 API Key、客户隐私和业务数据放在安全位置。",
    "",
    "## 小白AI建议",
    "先让流程半自动跑 3 天，确认结果稳定后，再逐步减少人工审核。",
  ].join("\n")
}

export default function WorkflowsClient() {
  const [templateParam, setTemplateParam] = useState("")
  const [selected, setSelected] = useState<Template>(templates[0])
  const [name, setName] = useState(templates[0].name)
  const [goal, setGoal] = useState(templates[0].goal)
  const [steps, setSteps] = useState<FlowStep[]>(templates[0].steps.map(cloneStep))
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)

  const plan = useMemo(() => buildPlan(name, goal, steps), [name, goal, steps])

  const applyTemplate = (template: Template) => {
    setSelected(template)
    setName(template.name)
    setGoal(template.goal)
    setSteps(template.steps.map(cloneStep))
    setCopied(false)
    setSaved(false)
  }

  useEffect(() => {
    setTemplateParam(new URLSearchParams(window.location.search).get("template") || "")
    const rawDraft = window.localStorage.getItem(draftKey)
    if (!rawDraft) return
    try {
      const draft = JSON.parse(rawDraft) as { name?: string; goal?: string; steps?: FlowStep[] }
      if (draft.name) setName(draft.name)
      if (draft.goal) setGoal(draft.goal)
      if (Array.isArray(draft.steps) && draft.steps.length > 0) {
        setSteps(draft.steps.map((step) => ({ ...step, id: makeId() })))
      }
    } catch {
      window.localStorage.removeItem(draftKey)
    }
  }, [])

  useEffect(() => {
    if (!templateParam || selected.id === templateParam) return
    const template = templates.find((item) => item.id === templateParam)
    if (template) applyTemplate(template)
  }, [templateParam, selected.id])

  const addStep = (step: FlowStep) => {
    setSteps((current) => [...current, cloneStep(step)])
  }

  const updateStep = (id: string, patch: Partial<FlowStep>) => {
    setSteps((current) => current.map((step) => (step.id === id ? { ...step, ...patch } : step)))
  }

  const removeStep = (id: string) => {
    setSteps((current) => current.filter((step) => step.id !== id))
  }

  const copyPlan = async () => {
    await navigator.clipboard.writeText(plan).catch(() => undefined)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  const saveDraft = () => {
    window.localStorage.setItem(draftKey, JSON.stringify({ name, goal, steps }))
    setSaved(true)
    window.setTimeout(() => setSaved(false), 1600)
  }

  return (
    <div style={{ background: "#000", minHeight: "100vh", fontFamily: "'Noto Sans SC', sans-serif", position: "relative", overflow: "hidden" }}>
      <MathRain />
      <NavBar />
      <main style={{ maxWidth: 1180, margin: "0 auto", padding: "58px 60px 100px", position: "relative", zIndex: 10, background: "rgba(0,0,0,0.88)" }} className="max-sm:px-4">
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 360px", gap: 22, alignItems: "end", marginBottom: 26 }} className="max-sm:grid-cols-1">
          <div>
            <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.36em", color: "#7a6230", textTransform: "uppercase", marginBottom: 10, fontWeight: 900 }}>Workflow Builder</p>
            <h1 style={{ fontSize: 38, fontWeight: 950, color: "#fff", letterSpacing: "0.02em", marginBottom: 10 }}>AI 工作流搭建器</h1>
            <p style={{ fontSize: 15, color: "#cfcfcf", lineHeight: 1.9, maxWidth: 720 }}>用小白能看懂的方式，把一个想法拆成触发、采集、AI处理、动作、审核和输出。先生成可执行方案，再逐步接入真实自动化工具。</p>
          </div>
          <ContentVisual compact title="AI 自动化流程" label="WORKFLOW" meta="Trigger -> AI -> Action" kind="agent" />
        </div>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 10, marginBottom: 18 }} className="max-sm:grid-cols-1">
          {templates.map((template) => {
            const active = selected.id === template.id
            return (
              <button key={template.id} onClick={() => applyTemplate(template)} style={{ textAlign: "left", border: `1px solid ${active ? "#7a6230" : "#202020"}`, borderRadius: 10, background: active ? "rgba(201,168,76,0.08)" : "rgba(255,255,255,0.03)", padding: 15, cursor: "pointer" }}>
                <p style={{ color: active ? "#e8c96a" : "#fff", fontSize: 15, fontWeight: 950, marginBottom: 7 }}>{template.name}</p>
                <p style={{ color: "#999", fontSize: 12, lineHeight: 1.65 }}>{template.scene} · {template.difficulty} · {template.time}</p>
              </button>
            )
          })}
        </section>

        <div style={{ display: "grid", gridTemplateColumns: "260px minmax(0,1fr) 330px", gap: 16 }} className="max-sm:grid-cols-1">
          <aside style={{ border: "1px solid #1a1a1a", borderRadius: 12, background: "rgba(255,255,255,0.03)", padding: 16, alignSelf: "start" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Plus size={16} style={{ color: "#e8c96a" }} />
              <h2 style={{ color: "#fff", fontSize: 15, fontWeight: 950 }}>添加步骤</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {stepLibrary.map((step) => {
                const Icon = typeMeta[step.type].icon
                return (
                  <button key={step.id} onClick={() => addStep(step)} style={{ display: "grid", gridTemplateColumns: "24px 1fr", gap: 9, textAlign: "left", border: "1px solid #232323", borderRadius: 8, background: "rgba(0,0,0,0.22)", padding: 10, cursor: "pointer" }}>
                    <Icon size={16} style={{ color: typeMeta[step.type].color, marginTop: 2 }} />
                    <span>
                      <span style={{ display: "block", color: "#ddd", fontSize: 12, fontWeight: 900 }}>{step.title}</span>
                      <span style={{ display: "block", color: "#777", fontSize: 11, lineHeight: 1.55, marginTop: 2 }}>{step.tool}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          </aside>

          <section style={{ border: "1px solid #1a1a1a", borderRadius: 12, background: "rgba(255,255,255,0.03)", padding: 18 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10, marginBottom: 16 }}>
              <input value={name} onChange={(event) => setName(event.target.value)} className="form-input" placeholder="工作流名称" />
              <textarea value={goal} onChange={(event) => setGoal(event.target.value)} className="form-input" rows={3} placeholder="这个工作流要解决什么问题？" />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <GitBranch size={17} style={{ color: "#e8c96a" }} />
              <h2 style={{ color: "#fff", fontSize: 17, fontWeight: 950 }}>流程编排</h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {steps.map((step, index) => {
                const meta = typeMeta[step.type]
                const Icon = meta.icon
                return (
                  <div key={step.id} style={{ border: "1px solid #242424", borderRadius: 10, background: "rgba(0,0,0,0.24)", padding: 14 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "34px 1fr auto", gap: 10, alignItems: "start" }}>
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
          </section>

          <aside style={{ border: "1px solid #2a1f10", borderRadius: 12, background: "rgba(201,168,76,0.045)", padding: 18, alignSelf: "start" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Sparkles size={17} style={{ color: "#e8c96a" }} />
              <h2 style={{ color: "#fff", fontSize: 17, fontWeight: 950 }}>执行方案</h2>
            </div>
            <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", color: "#ddd", fontSize: 12, lineHeight: 1.75, fontFamily: "'Noto Sans SC', sans-serif", background: "rgba(0,0,0,0.28)", border: "1px solid #1f1f1f", borderRadius: 10, padding: 13, maxHeight: 520, overflow: "auto" }}>{plan}</pre>
            <button onClick={copyPlan} className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 12 }}>
              {copied ? <CheckCircle2 size={15} /> : <Clipboard size={15} />}
              {copied ? "已复制" : "复制方案"}
            </button>
            <button onClick={saveDraft} className="btn-outline" style={{ width: "100%", justifyContent: "center", marginTop: 10 }}>
              {saved ? <CheckCircle2 size={15} /> : <Save size={15} />}
              {saved ? "已保存草稿" : "保存草稿"}
            </button>
            <div style={{ marginTop: 14, border: "1px solid #202020", borderRadius: 10, padding: 13, background: "rgba(0,0,0,0.2)" }}>
              <p style={{ color: "#fff", fontSize: 13, fontWeight: 950, marginBottom: 7 }}>下一步</p>
              <p style={{ color: "#aaa", fontSize: 12, lineHeight: 1.75 }}>把方案复制给右下角小白AI，或发到社区让大家帮你检查。后续版本会加入保存工作流、真实执行和定时运行。</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
                <Link href="/community/new" className="btn-outline" style={{ textDecoration: "none", padding: "7px 12px" }}>发到社区</Link>
                <Link href="/learn/4" className="btn-outline" style={{ textDecoration: "none", padding: "7px 12px" }}>学习自动化</Link>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
