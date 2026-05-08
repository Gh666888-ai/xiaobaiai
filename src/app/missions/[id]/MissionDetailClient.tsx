"use client"

import { useEffect, useMemo, useState } from "react"
import type { CSSProperties, ReactNode } from "react"
import Link from "next/link"
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Clipboard,
  ExternalLink,
  Flag,
  Lock,
  MessageCircle,
  Sparkles,
  Trophy,
} from "lucide-react"
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
import { getNextLevel, getUserLevel } from "@/data/user"

const stepPraise = [
  "很好，这一步你已经真的动手了。",
  "稳住，已经不是在收藏教程，而是在推进结果。",
  "这一步很关键，做完后后面会轻很多。",
  "漂亮，离完整交付又近了一步。",
  "可以，这就是从 0 到 1 的感觉。",
  "做得对，先跑通再追求完美。",
]

function praiseFor(index: number) {
  return stepPraise[index % stepPraise.length]
}

export function MissionDetailClient({ mission }: { mission: Mission }) {
  const { user, refresh } = useAuth()
  const [progress, setProgress] = useState<MissionProgressState>(() => ({ activeMissionId: mission.id, missions: {} }))
  const [copied, setCopied] = useState<"prompt" | "fix" | "recap" | null>(null)
  const [claiming, setClaiming] = useState(false)
  const [notice, setNotice] = useState("")
  const [praise, setPraise] = useState("")

  useEffect(() => {
    const saved = selectMission(readMissionProgress(), mission.id)
    setProgress(saved)
    writeMissionProgress(saved)
  }, [mission.id])

  const current = getStoredMission(progress, mission.id)
  const currentStepIndex = Math.min(current.currentStep || 0, mission.steps.length - 1)
  const doneSteps = mission.steps.filter((_, index) => current.completedSteps[index]).length
  const percent = Math.round((doneSteps / mission.steps.length) * 100)
  const currentStep = mission.steps[currentStepIndex]
  const relatedTools = mission.toolIds.map((id) => tools.find((tool) => tool.id === id)).filter(Boolean)
  const relatedCases = getCasePostsForMission(mission.id, posts).slice(0, 3)
  const userLevel = getUserLevel(user?.xp || 0)
  const nextLevel = getNextLevel(user?.xp || 0)
  const nextAfterMission = user ? getUserLevel((user.xp || 0) + mission.xp) : null
  const willLevelUp = !!user && !!nextAfterMission && nextAfterMission.level > userLevel.level

  function persist(next: MissionProgressState) {
    setProgress(next)
    writeMissionProgress(next)
  }

  function markDone(index: number) {
    persist(markMissionStepDone(progress, mission.id, index, mission.steps.length))
    setPraise(praiseFor(index))
    window.setTimeout(() => setPraise(""), 4200)
  }

  async function copyText(kind: "prompt" | "fix" | "recap", text: string) {
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
      setNotice("请先登录，再领取完整任务奖励。")
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
      setNotice(
        Number(data.awarded || 0) > 0
          ? `完整任务完成，获得 ${data.awarded} XP。小白已经把这次成长记下来了。`
          : "这条任务奖励已经领取过啦。",
      )
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
      <main style={{ maxWidth: 1180, margin: "0 auto", padding: "58px clamp(16px,5vw,60px) 104px", position: "relative", zIndex: 10, background: "rgba(0,0,0,0.91)" }}>
        <section style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 20, alignItems: "end", marginBottom: 24 }} className="mission-head">
          <div>
            <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.28em", color: "#7a6230", textTransform: "uppercase", marginBottom: 12, fontWeight: 900 }}>Guided Mission</p>
            <h1 style={{ fontSize: "clamp(30px,4.8vw,46px)", color: "#fff", fontWeight: 950, lineHeight: 1.2, marginBottom: 12 }}>{mission.title}</h1>
            <p style={{ fontSize: 15, color: "#cfcfcf", lineHeight: 1.85, maxWidth: 850 }}>{mission.tagline}</p>
          </div>
          <div style={{ minWidth: 190, border: "1px solid #2a1f10", background: "rgba(201,168,76,0.06)", borderRadius: 12, padding: "14px 16px" }}>
            <p style={{ color: "#888", fontSize: 11, fontWeight: 950, marginBottom: 7 }}>完整任务奖励</p>
            <p style={{ color: "#e8c96a", fontSize: 22, fontWeight: 950, marginBottom: 6 }}>+{mission.xp} XP</p>
            <p style={{ color: willLevelUp ? "#3DA563" : "#aaa", fontSize: 12, lineHeight: 1.65 }}>
              {willLevelUp ? `完成后可升到 LV.${nextAfterMission?.level} ${nextAfterMission?.name}` : nextLevel ? `距离 LV.${nextLevel.level.level} 还差 ${nextLevel.need} XP` : "你已到达当前最高等级"}
            </p>
          </div>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "300px 1fr 280px", gap: 16, alignItems: "start" }} className="mission-shell">
          <aside style={{ border: "1px solid #1a1a1a", background: "rgba(255,255,255,0.028)", borderRadius: 12, padding: 16, position: "sticky", top: 74 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
              <div>
                <p style={{ color: "#fff", fontSize: 15, fontWeight: 950, marginBottom: 5 }}>任务导图</p>
                <p style={{ color: "#888", fontSize: 12 }}>{doneSteps}/{mission.steps.length} 步完成</p>
              </div>
              <span style={{ color: "#e8c96a", fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 950 }}>{percent}%</span>
            </div>
            <div style={{ height: 8, background: "#151515", borderRadius: 999, overflow: "hidden", marginBottom: 16 }}>
              <div style={{ height: "100%", width: `${percent}%`, background: "#c9a84c" }} />
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              {mission.steps.map((step, index) => {
                const done = !!current.completedSteps[index]
                const active = index === currentStepIndex && !current.completed
                return (
                  <div
                    key={step.title}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "28px 1fr",
                      gap: 10,
                      alignItems: "start",
                      border: active ? "1px solid #7a6230" : "1px solid #202020",
                      background: active ? "rgba(201,168,76,0.08)" : done ? "rgba(61,165,99,0.055)" : "rgba(0,0,0,0.2)",
                      borderRadius: 10,
                      padding: "11px 12px",
                    }}
                  >
                    <span style={{ width: 24, height: 24, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", background: done ? "rgba(61,165,99,0.16)" : active ? "rgba(201,168,76,0.16)" : "#121212", color: done ? "#3DA563" : active ? "#e8c96a" : "#666", fontSize: 12, fontWeight: 950 }}>
                      {done ? <Check size={13} /> : active ? index + 1 : <Lock size={11} />}
                    </span>
                    <div>
                      <p style={{ color: done || active ? "#fff" : "#999", fontSize: 12, fontWeight: 950, lineHeight: 1.45 }}>{step.title}</p>
                      {active && <p style={{ color: "#cdbb80", fontSize: 10, marginTop: 5, fontWeight: 900 }}>当前正在做</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          </aside>

          <section style={{ display: "grid", gap: 14 }}>
            {current.completed ? (
              <CompleteCard mission={mission} onCopy={() => copyText("recap", mission.recapTemplate)} copied={copied === "recap"} onClaim={claimMissionXP} claiming={claiming} notice={notice} />
            ) : (
              <StepCard
                mission={mission}
                stepIndex={currentStepIndex}
                copied={copied}
                onCopy={copyText}
                onDone={() => markDone(currentStepIndex)}
              />
            )}

            {praise && (
              <div style={{ border: "1px solid #2a1f10", background: "rgba(201,168,76,0.065)", borderRadius: 12, padding: "16px 18px", display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ color: "#e8c96a" }}><Sparkles size={18} /></span>
                <p style={{ color: "#fff", fontSize: 14, fontWeight: 900, lineHeight: 1.7 }}>小白：{praise}</p>
              </div>
            )}

            {relatedCases.length > 0 && (
              <section style={{ border: "1px solid #1a1a1a", background: "rgba(255,255,255,0.026)", borderRadius: 12, padding: "20px 22px" }}>
                <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 950, marginBottom: 12 }}>别人怎么做</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 10 }} className="case-grid">
                  {relatedCases.map((post) => (
                    <Link key={post.id} href={`/community/${post.id}`} style={{ border: "1px solid #242424", borderRadius: 10, background: "rgba(0,0,0,0.24)", padding: "14px 15px", textDecoration: "none", minHeight: 126 }}>
                      <p style={{ color: "#c9a84c", fontSize: 10, fontWeight: 900, marginBottom: 7 }}>{post.category}</p>
                      <h3 style={{ color: "#fff", fontSize: 13, lineHeight: 1.5, fontWeight: 950, marginBottom: 8 }}>{post.title}</h3>
                      <p style={{ color: "#888", fontSize: 11 }}>{post.author} · {post.likes} 赞</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </section>

          <aside style={{ display: "grid", gap: 12, position: "sticky", top: 74 }}>
            <InfoCard title="适合谁" body={mission.audience} icon={<Flag size={17} />} />
            <InfoCard title="最终产出" body={mission.outcome} icon={<CheckCircle2 size={17} />} />
            <div style={sideCardStyle}>
              <h2 style={sideTitleStyle}>需要工具</h2>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {relatedTools.map((tool) => (
                  <Link key={tool!.id} href={toolPath(tool!)} className="tag tag-gray" style={{ textDecoration: "none", fontSize: 10 }}>{tool!.name}</Link>
                ))}
              </div>
            </div>
            <div style={sideCardStyle}>
              <h2 style={sideTitleStyle}>材料清单</h2>
              <div style={{ display: "grid", gap: 8 }}>
                {mission.materials.map((item) => <CheckLine key={item}>{item}</CheckLine>)}
              </div>
            </div>
          </aside>
        </section>

        <style>{`
          @media (max-width: 1060px) {
            .mission-shell { grid-template-columns: 1fr !important; }
            .mission-shell aside { position: static !important; }
            .mission-head { grid-template-columns: 1fr !important; }
          }
          @media (max-width: 720px) {
            .step-action-row, .case-grid { grid-template-columns: 1fr !important; }
            .mission-step-top { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </main>
    </div>
  )
}

function StepCard({
  mission,
  stepIndex,
  copied,
  onCopy,
  onDone,
}: {
  mission: Mission
  stepIndex: number
  copied: "prompt" | "fix" | "recap" | null
  onCopy: (kind: "prompt" | "fix" | "recap", text: string) => void
  onDone: () => void
}) {
  const step = mission.steps[stepIndex]

  return (
    <article style={{ border: "1px solid #2a1f10", background: "linear-gradient(180deg,rgba(201,168,76,0.075),rgba(255,255,255,0.025))", borderRadius: 14, padding: "24px clamp(18px,3vw,30px)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 16, alignItems: "start", marginBottom: 18 }} className="mission-step-top">
        <div>
          <p style={{ color: "#e8c96a", fontSize: 12, fontWeight: 950, marginBottom: 8 }}>第 {stepIndex + 1} 步 / 共 {mission.steps.length} 步</p>
          <h2 style={{ color: "#fff", fontSize: "clamp(23px,3.5vw,32px)", fontWeight: 950, lineHeight: 1.25, marginBottom: 10 }}>{step.title}</h2>
          <p style={{ color: "#cfcfcf", fontSize: 14, lineHeight: 1.85 }}>{step.desc}</p>
        </div>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#e8c96a", fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 950 }}>
          <Trophy size={15} /> +{mission.xp}XP 完整任务
        </span>
      </div>

      <section style={{ border: "1px solid #242424", background: "rgba(0,0,0,0.28)", borderRadius: 12, padding: "18px 20px", marginBottom: 14 }}>
        <p style={{ color: "#888", fontSize: 11, fontWeight: 950, marginBottom: 7 }}>你现在只做这一件事</p>
        <p style={{ color: "#fff", fontSize: 17, fontWeight: 950, lineHeight: 1.65 }}>{step.action}</p>
      </section>

      {step.toolAction && (
        <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }} className="step-action-row">
          <a href={step.toolAction.href} target="_blank" rel="noreferrer" style={toolButtonStyle}>
            <ExternalLink size={15} /> {step.toolAction.label}
          </a>
          <div style={{ border: "1px solid #242424", borderRadius: 10, padding: "13px 14px", background: "rgba(0,0,0,0.22)" }}>
            <p style={{ color: "#cdbb80", fontSize: 12, fontWeight: 950, lineHeight: 1.6 }}>{step.toolAction.setupText}</p>
            <p style={{ color: "#aaa", fontSize: 12, lineHeight: 1.6, marginTop: 5 }}>{step.toolAction.readyText}</p>
          </div>
        </section>
      )}

      {step.clickPath && step.clickPath.length > 0 && (
        <section style={blockStyle}>
          <h3 style={blockTitleStyle}>点击路径</h3>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap", alignItems: "center" }}>
            {step.clickPath.map((item, index) => (
              <span key={`${item}-${index}`} style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
                <span style={{ color: "#ddd", border: "1px solid #2a2a2a", background: "rgba(255,255,255,0.035)", borderRadius: 999, padding: "7px 10px", fontSize: 12, fontWeight: 850 }}>{item}</span>
                {index < step.clickPath!.length - 1 && <ChevronRight size={13} color="#6f6f6f" />}
              </span>
            ))}
          </div>
        </section>
      )}

      <section style={blockStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", marginBottom: 10 }}>
          <h3 style={{ ...blockTitleStyle, marginBottom: 0 }}>复制给 AI / 工具的提示词</h3>
          <button type="button" onClick={() => onCopy("prompt", step.prompt)} style={miniButtonStyle}>
            {copied === "prompt" ? <Check size={13} /> : <Clipboard size={13} />} {copied === "prompt" ? "已复制" : "复制"}
          </button>
        </div>
        <p style={{ color: "#bbb", fontSize: 12, lineHeight: 1.85, whiteSpace: "pre-line" }}>{step.prompt}</p>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }} className="step-action-row">
        {step.checklist && step.checklist.length > 0 && (
          <div style={blockStyle}>
            <h3 style={blockTitleStyle}>做之前确认</h3>
            <div style={{ display: "grid", gap: 8 }}>{step.checklist.map((item) => <CheckLine key={item}>{item}</CheckLine>)}</div>
          </div>
        )}
        {step.validation && step.validation.length > 0 && (
          <div style={blockStyle}>
            <h3 style={blockTitleStyle}>做到这样才算完成</h3>
            <div style={{ display: "grid", gap: 8 }}>{step.validation.map((item) => <CheckLine key={item}>{item}</CheckLine>)}</div>
          </div>
        )}
      </section>

      {step.fixPrompt && (
        <section style={blockStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", marginBottom: 10 }}>
            <h3 style={{ ...blockTitleStyle, marginBottom: 0 }}>结果不好时这样补救</h3>
            <button type="button" onClick={() => onCopy("fix", step.fixPrompt!)} style={miniButtonStyle}>
              {copied === "fix" ? <Check size={13} /> : <Clipboard size={13} />} {copied === "fix" ? "已复制" : "复制"}
            </button>
          </div>
          <p style={{ color: "#bbb", fontSize: 12, lineHeight: 1.85 }}>{step.fixPrompt}</p>
        </section>
      )}

      {step.troubleTips && step.troubleTips.length > 0 && (
        <section style={blockStyle}>
          <h3 style={blockTitleStyle}>卡住了看这里</h3>
          <div style={{ display: "grid", gap: 9 }}>
            {step.troubleTips.map((tip) => (
              <div key={tip.problem} style={{ border: "1px solid #222", borderRadius: 9, padding: "11px 12px", background: "rgba(0,0,0,0.18)" }}>
                <p style={{ color: "#fff", fontSize: 12, fontWeight: 950, marginBottom: 4 }}>{tip.problem}</p>
                <p style={{ color: "#aaa", fontSize: 12, lineHeight: 1.65 }}>{tip.fix}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section style={{ border: "1px solid #2a1f10", background: "rgba(201,168,76,0.055)", borderRadius: 12, padding: "16px 18px", marginBottom: 16 }}>
        <p style={{ color: "#888", fontSize: 11, fontWeight: 950, marginBottom: 7 }}>这一步交付物</p>
        <p style={{ color: "#e8c96a", fontSize: 14, fontWeight: 950, lineHeight: 1.7 }}>{step.deliverable}</p>
      </section>

      <button type="button" onClick={onDone} className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12 }}>
        我完成了这一步，进入下一步 <ArrowRight size={14} />
      </button>
    </article>
  )
}

function CompleteCard({
  mission,
  copied,
  onCopy,
  onClaim,
  claiming,
  notice,
}: {
  mission: Mission
  copied: boolean
  onCopy: () => void
  onClaim: () => void
  claiming: boolean
  notice: string
}) {
  return (
    <article style={{ border: "1px solid #2f7d4d", background: "linear-gradient(180deg,rgba(61,165,99,0.13),rgba(255,255,255,0.026))", borderRadius: 14, padding: "26px clamp(18px,3vw,32px)" }}>
      <div style={{ color: "#3DA563", marginBottom: 12 }}><CheckCircle2 size={28} /></div>
      <h2 style={{ color: "#fff", fontSize: 32, fontWeight: 950, lineHeight: 1.25, marginBottom: 10 }}>完整事件完成了</h2>
      <p style={{ color: "#cfcfcf", fontSize: 15, lineHeight: 1.85, marginBottom: 18 }}>
        小白：这不是看完一篇教程，这是你真的做完了一件事。现在可以领取完整任务 XP，并把流程保存成复盘。
      </p>
      <div style={{ border: "1px solid #242424", background: "rgba(0,0,0,0.26)", borderRadius: 10, padding: "14px 15px", marginBottom: 16 }}>
        <p style={{ color: "#bbb", fontSize: 12, lineHeight: 1.75, whiteSpace: "pre-line" }}>{mission.recapTemplate}</p>
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button type="button" onClick={onClaim} disabled={claiming} className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          {claiming ? "领取中..." : `领取 ${mission.xp}XP 完整任务奖励`} <Trophy size={14} />
        </button>
        <button type="button" onClick={onCopy} className="btn-outline" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          {copied ? <Check size={14} /> : <Clipboard size={14} />} {copied ? "已复制复盘" : "复制复盘模板"}
        </button>
        <Link href="/community/new" className="btn-outline" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
          发复盘 <MessageCircle size={14} />
        </Link>
      </div>
      {notice && <p style={{ color: notice.includes("获得") ? "#3DA563" : "#cdbb80", fontSize: 13, lineHeight: 1.7, marginTop: 12 }}>{notice}</p>}
    </article>
  )
}

const blockStyle: CSSProperties = {
  border: "1px solid #242424",
  background: "rgba(0,0,0,0.24)",
  borderRadius: 12,
  padding: "16px 18px",
  marginBottom: 14,
}

const blockTitleStyle: CSSProperties = {
  color: "#fff",
  fontSize: 14,
  fontWeight: 950,
  marginBottom: 10,
}

const sideCardStyle: CSSProperties = {
  border: "1px solid #1a1a1a",
  background: "rgba(255,255,255,0.03)",
  borderRadius: 12,
  padding: "18px 20px",
}

const sideTitleStyle: CSSProperties = {
  color: "#fff",
  fontSize: 16,
  fontWeight: 950,
  marginBottom: 12,
}

const toolButtonStyle: CSSProperties = {
  border: "1px solid #7a6230",
  background: "rgba(201,168,76,0.12)",
  color: "#e8c96a",
  borderRadius: 10,
  padding: "14px 16px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  textDecoration: "none",
  fontSize: 13,
  fontWeight: 950,
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

function CheckLine({ children }: { children: ReactNode }) {
  return (
    <p style={{ display: "grid", gridTemplateColumns: "18px 1fr", gap: 8, alignItems: "start", color: "#bbb", fontSize: 12, lineHeight: 1.65 }}>
      <span style={{ width: 18, height: 18, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", background: "rgba(201,168,76,0.1)", color: "#e8c96a", marginTop: 1 }}>
        <Check size={11} />
      </span>
      <span>{children}</span>
    </p>
  )
}

function InfoCard({ title, body, icon }: { title: string; body: string; icon: ReactNode }) {
  return (
    <div style={sideCardStyle}>
      <div style={{ color: "#e8c96a", marginBottom: 9 }}>{icon}</div>
      <h2 style={{ color: "#fff", fontSize: 15, fontWeight: 950, marginBottom: 7 }}>{title}</h2>
      <p style={{ color: "#bbb", fontSize: 12, lineHeight: 1.75 }}>{body}</p>
    </div>
  )
}
