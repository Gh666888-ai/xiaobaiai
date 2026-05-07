"use client"

import { useEffect, useState } from "react"
import type { CSSProperties, ReactNode } from "react"
import Link from "next/link"
import { ArrowRight, Check, CheckCircle2, Clipboard, MessageCircle, Sparkles, Trophy } from "lucide-react"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"
import type { Mission } from "@/data/missions"
import { posts } from "@/data/community"
import { getCasePostsForMission } from "@/data/product-loop"
import { tools } from "@/data/tools"
import { toolPath } from "@/data/tool-meta"
import { useAuth } from "@/lib/AuthContext"
import { readAppAuth } from "@/lib/app-auth"
import {
  getStoredMission,
  markMissionStepDone,
  readMissionProgress,
  selectMission,
  writeMissionProgress,
  type MissionProgressState,
} from "@/lib/mission-progress"

export function MissionDetailClient({ mission }: { mission: Mission }) {
  const { user, refresh } = useAuth()
  const [progress, setProgress] = useState<MissionProgressState>(() => ({ activeMissionId: mission.id, missions: {} }))
  const [copied, setCopied] = useState<"prompt" | "recap" | null>(null)
  const [claiming, setClaiming] = useState(false)
  const [notice, setNotice] = useState("")

  useEffect(() => {
    const saved = selectMission(readMissionProgress(), mission.id)
    setProgress(saved)
    writeMissionProgress(saved)
  }, [mission.id])

  const current = getStoredMission(progress, mission.id)
  const currentStepIndex = Math.min(current.currentStep || 0, mission.steps.length - 1)
  const doneSteps = mission.steps.filter((_, index) => current.completedSteps[index]).length
  const percent = Math.round((doneSteps / mission.steps.length) * 100)
  const relatedTools = mission.toolIds.map((id) => tools.find((tool) => tool.id === id)).filter(Boolean)
  const relatedCases = getCasePostsForMission(mission.id, posts).slice(0, 3)

  function persist(next: MissionProgressState) {
    setProgress(next)
    writeMissionProgress(next)
  }

  function markDone(index: number) {
    persist(markMissionStepDone(progress, mission.id, index, mission.steps.length))
  }

  async function copyText(kind: "prompt" | "recap", text: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(kind)
      window.setTimeout(() => setCopied(null), 1600)
    } catch {
      setCopied(null)
    }
  }

  async function claimMissionXP() {
    setNotice("")
    if (!user) {
      setNotice("请先登录，再领取任务完成奖励。")
      return
    }
    const token = readAppAuth()?.session?.access_token
    if (!token) {
      setNotice("登录状态已过期，请重新登录后领取。")
      return
    }
    setClaiming(true)
    try {
      const res = await fetch("/api/growth/xp", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reason: "mission", missionId: mission.id }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || "领取失败，请稍后再试。")
      await refresh().catch(() => undefined)
      setNotice(Number(data.awarded || 0) > 0 ? `已领取 ${data.awarded} XP，任务经验进入你的成长档案。` : "这条任务奖励已经领取过啦。")
    } catch (error: any) {
      setNotice(error?.message || "领取失败，请稍后再试。")
    } finally {
      setClaiming(false)
    }
  }

  return (
    <div style={{ background: "#000", minHeight: "100vh", fontFamily: "'Noto Sans SC', sans-serif", position: "relative", overflow: "hidden" }}>
      <MathRain />
      <NavBar />
      <main style={{ maxWidth: 1080, margin: "0 auto", padding: "64px clamp(16px,5vw,60px) 104px", position: "relative", zIndex: 10, background: "rgba(0,0,0,0.9)" }}>
        <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.34em", color: "#7a6230", textTransform: "uppercase", marginBottom: 12, fontWeight: 900 }}>Mission</p>
        <h1 style={{ fontSize: 40, color: "#fff", fontWeight: 950, lineHeight: 1.22, marginBottom: 14 }}>{mission.title}</h1>
        <p style={{ fontSize: 16, color: "#ccc", lineHeight: 1.9, maxWidth: 860, marginBottom: 22 }}>{mission.tagline}</p>

        <section style={{ border: "1px solid #2a1f10", background: "rgba(201,168,76,0.055)", borderRadius: 12, padding: "18px 20px", marginBottom: 30 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 14, alignItems: "center" }} className="max-sm:grid-cols-1">
            <div>
              <p style={{ color: "#e8c96a", fontSize: 13, fontWeight: 950, marginBottom: 6 }}>小白提醒</p>
              <p style={{ color: "#ddd", fontSize: 14, lineHeight: 1.8 }}>
                你已经完成 <b>{doneSteps}/{mission.steps.length}</b> 步。{current.completed ? "这条任务已经完成，接下来最重要的是发复盘。" : `下一步建议做：${mission.steps[currentStepIndex].title}`}
              </p>
            </div>
            <div style={{ minWidth: 180 }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#aaa", fontSize: 11, fontWeight: 900, marginBottom: 7 }}>
                <span>进度</span><span>{percent}%</span>
              </div>
              <div style={{ height: 8, background: "#151515", borderRadius: 999, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${percent}%`, background: "#c9a84c" }} />
              </div>
            </div>
          </div>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "1fr 0.72fr", gap: 16, alignItems: "start", marginBottom: 34 }} className="max-sm:grid-cols-1">
          <div style={{ display: "grid", gap: 12 }}>
            {mission.steps.map((step, index) => {
              const done = !!current.completedSteps[index]
              const active = index === currentStepIndex && !current.completed
              return (
                <div key={step.title} style={{ border: active ? "1px solid #7a6230" : "1px solid #1a1a1a", background: active ? "rgba(201,168,76,0.06)" : "rgba(255,255,255,0.026)", borderRadius: 12, padding: "20px 22px" }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "start", marginBottom: 10 }}>
                    <span style={{ width: 30, height: 30, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: done ? "rgba(61,165,99,0.15)" : "rgba(201,168,76,0.12)", color: done ? "#3DA563" : "#e8c96a", fontWeight: 950 }}>
                      {done ? <Check size={16} /> : index + 1}
                    </span>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <h2 style={{ color: "#fff", fontSize: 19, fontWeight: 950, lineHeight: 1.4, marginBottom: 7 }}>{step.title}</h2>
                      <p style={{ color: "#bbb", fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>{step.desc}</p>
                      <p style={{ color: "#cdbb80", fontSize: 12, lineHeight: 1.7, marginBottom: 12 }}>交付物：{step.deliverable}</p>
                      <div style={{ border: "1px solid #242424", background: "rgba(0,0,0,0.26)", borderRadius: 10, padding: "13px 14px", marginBottom: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", marginBottom: 8 }}>
                          <p style={{ color: "#fff", fontSize: 12, fontWeight: 950 }}>给小白AI的提示词</p>
                          <button type="button" onClick={() => copyText("prompt", step.prompt)} style={miniButtonStyle}>
                            {copied === "prompt" ? <Check size={13} /> : <Clipboard size={13} />} {copied === "prompt" ? "已复制" : "复制"}
                          </button>
                        </div>
                        <p style={{ color: "#bbb", fontSize: 12, lineHeight: 1.8 }}>{step.prompt}</p>
                      </div>
                      <button type="button" onClick={() => markDone(index)} className={done ? "btn-outline" : "btn-primary"} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                        {done ? "已完成，重新标记" : "我完成了这一步"} <CheckCircle2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <aside style={{ display: "grid", gap: 12, position: "sticky", top: 18 }}>
            <InfoCard title="任务奖励" body={`${mission.badge} · +${mission.xp}XP`} icon={<Trophy size={17} />} />
            <InfoCard title="适合谁" body={mission.audience} icon={<Sparkles size={17} />} />
            <InfoCard title="最终产出" body={mission.outcome} icon={<CheckCircle2 size={17} />} />

            <div style={{ border: "1px solid #1a1a1a", background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "18px 20px" }}>
              <h2 style={{ color: "#fff", fontSize: 16, fontWeight: 950, marginBottom: 12 }}>需要工具</h2>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {relatedTools.map((tool) => (
                  <Link key={tool!.id} href={toolPath(tool!)} className="tag tag-gray" style={{ textDecoration: "none", fontSize: 10 }}>{tool!.name}</Link>
                ))}
              </div>
            </div>

            <div style={{ border: "1px solid #1a1a1a", background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "18px 20px" }}>
              <h2 style={{ color: "#fff", fontSize: 16, fontWeight: 950, marginBottom: 12 }}>材料清单</h2>
              <div style={{ display: "grid", gap: 8 }}>
                {mission.materials.map((item) => <p key={item} style={{ color: "#bbb", fontSize: 12, lineHeight: 1.65 }}>- {item}</p>)}
              </div>
            </div>

            <div style={{ border: "1px solid #2a1f10", background: "rgba(201,168,76,0.04)", borderRadius: 12, padding: "18px 20px" }}>
              <h2 style={{ color: "#fff", fontSize: 16, fontWeight: 950, marginBottom: 10 }}>复盘模板</h2>
              <p style={{ color: "#bbb", fontSize: 12, lineHeight: 1.75, whiteSpace: "pre-line", marginBottom: 12 }}>{mission.recapTemplate}</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button type="button" onClick={() => copyText("recap", mission.recapTemplate)} className="btn-outline" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  {copied === "recap" ? <Check size={14} /> : <Clipboard size={14} />} 复制模板
                </button>
                <Link href="/community/new" className="btn-primary" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
                  发复盘 <MessageCircle size={14} />
                </Link>
              </div>
              <div style={{ borderTop: "1px solid #242424", marginTop: 14, paddingTop: 14 }}>
                <button type="button" onClick={claimMissionXP} disabled={!current.completed || claiming} className={current.completed ? "btn-primary" : "btn-outline"} style={{ width: "100%" }}>
                  {claiming ? "领取中..." : current.completed ? `领取 ${mission.xp}XP 完成奖励` : "完成所有步骤后领取奖励"}
                </button>
                {notice && <p style={{ color: notice.includes("已领取") ? "#3DA563" : "#cdbb80", fontSize: 12, lineHeight: 1.7, marginTop: 9 }}>{notice}</p>}
              </div>
            </div>
          </aside>
        </section>

        {relatedCases.length > 0 && (
          <section style={{ border: "1px solid #1a1a1a", background: "rgba(255,255,255,0.026)", borderRadius: 12, padding: "22px 24px", marginBottom: 16 }}>
            <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 950, marginBottom: 12 }}>先看别人怎么做</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 10 }} className="max-sm:grid-cols-1">
              {relatedCases.map((post) => (
                <Link key={post.id} href={`/community/${post.id}`} style={{ border: "1px solid #242424", borderRadius: 10, background: "rgba(0,0,0,0.24)", padding: "15px 16px", textDecoration: "none", minHeight: 132 }}>
                  <p style={{ color: "#c9a84c", fontSize: 10, fontWeight: 900, marginBottom: 7 }}>{post.category}</p>
                  <h3 style={{ color: "#fff", fontSize: 14, lineHeight: 1.5, fontWeight: 950, marginBottom: 8 }}>{post.title}</h3>
                  <p style={{ color: "#888", fontSize: 11 }}>{post.author} · {post.likes} 赞</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section style={{ border: "1px solid #2a1f10", background: "rgba(201,168,76,0.04)", borderRadius: 12, padding: "22px 24px" }}>
          <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 950, marginBottom: 12 }}>继续看</h2>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {mission.resources.map((resource) => <Link key={resource.href} href={resource.href} className="btn-outline" style={{ textDecoration: "none" }}>{resource.label}</Link>)}
            <Link href="/missions" className="btn-primary" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>换一个任务 <ArrowRight size={14} /></Link>
          </div>
        </section>
      </main>
    </div>
  )
}

const miniButtonStyle: CSSProperties = {
  border: "1px solid #3a321d",
  background: "rgba(201,168,76,0.08)",
  color: "#e8c96a",
  borderRadius: 8,
  padding: "7px 10px",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  cursor: "pointer",
  fontSize: 12,
  fontWeight: 900,
}

function InfoCard({ title, body, icon }: { title: string; body: string; icon: ReactNode }) {
  return (
    <div style={{ border: "1px solid #1a1a1a", background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "18px 20px" }}>
      <div style={{ color: "#e8c96a", marginBottom: 9 }}>{icon}</div>
      <h2 style={{ color: "#fff", fontSize: 15, fontWeight: 950, marginBottom: 7 }}>{title}</h2>
      <p style={{ color: "#bbb", fontSize: 12, lineHeight: 1.75 }}>{body}</p>
    </div>
  )
}
