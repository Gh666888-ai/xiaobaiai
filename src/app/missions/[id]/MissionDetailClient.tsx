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
  Image as ImageIcon,
  Lock,
  MessageCircle,
  Sparkles,
  Trophy,
  Upload,
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
  getMissionStepProofRequirement,
  markMissionStepDone,
  readMissionProgress,
  selectMission,
  writeMissionProgress,
  type MissionStepProof,
  type MissionProgressState,
} from "@/lib/mission-progress"
import { getNextLevel, getUserLevel } from "@/data/user"

const stepPraise = [
  "第一步已点亮，你已经不是围观教程的人了。",
  "这一关过了，后面开始出成果。",
  "进度推进成功，离完整交付又近了一格。",
  "做得漂亮，这一步会变成你的复盘资产。",
  "小关卡已通，继续往前就能拿完整任务奖励。",
  "节奏对了，先通关，再变强。",
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

  function markDone(index: number, proof?: MissionStepProof) {
    persist(markMissionStepDone(progress, mission.id, index, mission.steps.length, proof))
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
      const stepProofs = current.stepProofs || {}
      const finalProof = stepProofs[mission.steps.length - 1]
      const res = await fetch("/api/growth/xp", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          reason: "mission",
          missionId: mission.id,
          proof: {
            stepProofs,
            recap: finalProof?.text || "",
          },
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || "领取失败，请稍后再试。")
      await refresh().catch(() => undefined)
      setNotice(
        Number(data.awarded || 0) > 0
          ? `通关奖励到账：${data.awarded} XP。你的等级进度已经推进，下一件装饰正在路上。`
          : "这条通关奖励已经领取过啦，换个任务继续冲下一段。",
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
                savedProof={current.stepProofs?.[currentStepIndex]}
                onDone={(proof) => markDone(currentStepIndex, proof)}
              />
            )}

            {praise && (
              <div style={{ border: "1px solid #2a1f10", background: "rgba(201,168,76,0.065)", borderRadius: 12, padding: "16px 18px", display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ color: "#e8c96a" }}><Sparkles size={18} /></span>
                <p style={{ color: "#fff", fontSize: 14, fontWeight: 900, lineHeight: 1.7 }}>小白通关提示：{praise}</p>
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
  savedProof,
  onDone,
}: {
  mission: Mission
  stepIndex: number
  copied: "prompt" | "fix" | "recap" | null
  onCopy: (kind: "prompt" | "fix" | "recap", text: string) => void
  savedProof?: MissionStepProof
  onDone: (proof: MissionStepProof) => void
}) {
  const step = mission.steps[stepIndex]
  const proofRule = getMissionStepProofRequirement(step, stepIndex, mission.steps.length)
  const proofItems = proofRule.proofItems
  const [proofText, setProofText] = useState(savedProof?.text || "")
  const [proofChecks, setProofChecks] = useState<boolean[]>(savedProof?.checked || [])
  const [screenshotName, setScreenshotName] = useState(savedProof?.screenshotName || "")
  const [screenshotDataUrl, setScreenshotDataUrl] = useState(savedProof?.screenshotDataUrl || "")
  const [screenshotError, setScreenshotError] = useState("")
  const [guideStep, setGuideStep] = useState(0)
  const checkedCount = proofChecks.filter(Boolean).length
  const proofReady = checkedCount >= proofRule.requiredChecks
    && proofText.trim().length >= proofRule.minLength
    && (!proofRule.screenshotRequired || screenshotDataUrl.startsWith("data:image/"))
  const recommendedTools = mission.toolIds.map((id) => tools.find((tool) => tool.id === id)).filter(Boolean) as typeof tools
  const primaryTool = recommendedTools[0]
  const guidePhases = [
    { key: "tool", label: "准备工具", doneText: step.toolAction ? "工具已打开/下载完成" : "我知道这一步用哪个工具了" },
    ...(step.clickPath && step.clickPath.length > 0 ? [{ key: "path", label: "按路径操作", doneText: "我已按路径走到输入位置" }] : []),
    { key: "prompt", label: "复制提示词", doneText: "我已复制并提交给 AI" },
    { key: "check", label: "检查结果", doneText: "我已检查结果达标" },
    { key: "proof", label: "确认完成", doneText: "" },
  ]
  const currentGuideStep = Math.min(guideStep, guidePhases.length - 1)
  const currentPhase = guidePhases[currentGuideStep]
  const isProofPhase = currentPhase.key === "proof"

  useEffect(() => {
    setProofText(savedProof?.text || "")
    setProofChecks(savedProof?.checked || [])
    setScreenshotName(savedProof?.screenshotName || "")
    setScreenshotDataUrl(savedProof?.screenshotDataUrl || "")
    setScreenshotError("")
    setGuideStep(0)
  }, [mission.id, stepIndex, savedProof])

  async function handleScreenshot(file: File | undefined) {
    setScreenshotError("")
    if (!file) return
    if (!file.type.startsWith("image/")) {
      setScreenshotError("请上传图片格式的截图。")
      return
    }
    try {
      const dataUrl = await compressProofImage(file)
      setScreenshotDataUrl(dataUrl)
      setScreenshotName(file.name)
    } catch {
      setScreenshotError("截图读取失败，请换一张图片再试。")
    }
  }
  function nextGuideStep() {
    setGuideStep((value) => Math.min(value + 1, guidePhases.length - 1))
  }

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

      <section style={{ border: "1px solid #242424", background: "rgba(0,0,0,0.28)", borderRadius: 12, padding: "16px 18px", marginBottom: 12 }}>
        <p style={{ color: "#888", fontSize: 11, fontWeight: 950, marginBottom: 7 }}>先别想太多，现在只做这一件事</p>
        <p style={{ color: "#fff", fontSize: 17, fontWeight: 950, lineHeight: 1.65 }}>{step.action}</p>
      </section>

      <section style={guideShellStyle}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
          {guidePhases.map((phase, index) => (
            <span
              key={phase.key}
              style={{
                border: index === currentGuideStep ? "1px solid #7a6230" : "1px solid #252525",
                background: index < currentGuideStep ? "rgba(61,165,99,0.09)" : index === currentGuideStep ? "rgba(201,168,76,0.12)" : "rgba(255,255,255,0.025)",
                color: index <= currentGuideStep ? "#f0d985" : "#777",
                borderRadius: 999,
                padding: "7px 10px",
                fontSize: 11,
                fontWeight: 950,
              }}
            >
              {index + 1}. {phase.label}
            </span>
          ))}
        </div>
        <p style={{ color: "#e8c96a", fontSize: 12, fontWeight: 950, marginBottom: 7 }}>当前小步：{currentPhase.label}</p>

        {currentPhase.key === "tool" && (
          <div>
            <p style={{ color: "#fff", fontSize: 17, fontWeight: 950, lineHeight: 1.7, marginBottom: 12 }}>
              {step.toolAction
                ? `先点下面的「${step.toolAction.label}」。如果还没装或没注册，就先按提示完成。完成后回来点确认。`
                : primaryTool
                  ? `先打开「${primaryTool.name}」。如果打不开，再从备用工具里换一个。打开后回来点确认。`
                  : "先打开一个 AI 对话工具，比如 Kimi、DeepSeek 或豆包。打开后回来点确认。"}
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
              {step.toolAction && (
                <a href={step.toolAction.href} target="_blank" rel="noreferrer" style={toolChipButtonStyle}>
                  <ExternalLink size={13} /> 立即打开：{step.toolAction.label}
                </a>
              )}
              {recommendedTools.slice(0, 4).map((tool) => (
                <Link key={tool.id} href={toolPath(tool)} style={toolChipLinkStyle}>
                  {tool.name}
                </Link>
              ))}
              {recommendedTools.length === 0 && <span style={toolChipTextStyle}>Kimi / DeepSeek / 豆包</span>}
            </div>
            {step.toolAction && (
              <div style={quietTipStyle}>
                <p style={{ color: "#cdbb80", fontSize: 12, fontWeight: 950, lineHeight: 1.65 }}>{step.toolAction.setupText}</p>
                <p style={{ color: "#aaa", fontSize: 12, lineHeight: 1.65, marginTop: 5 }}>{step.toolAction.readyText}</p>
              </div>
            )}
          </div>
        )}

        {currentPhase.key === "path" && step.clickPath && (
          <div>
            <p style={{ color: "#fff", fontSize: 17, fontWeight: 950, lineHeight: 1.7, marginBottom: 12 }}>按下面顺序点，走到可以输入内容的位置。走到以后回来点确认。</p>
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap", alignItems: "center", marginBottom: 12 }}>
              {step.clickPath.map((item, index) => (
                <span key={`${item}-${index}`} style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
                  <span style={{ color: "#ddd", border: "1px solid #2a2a2a", background: "rgba(255,255,255,0.035)", borderRadius: 999, padding: "7px 10px", fontSize: 12, fontWeight: 850 }}>{item}</span>
                  {index < step.clickPath!.length - 1 && <ChevronRight size={13} color="#6f6f6f" />}
                </span>
              ))}
            </div>
          </div>
        )}

        {currentPhase.key === "prompt" && (
          <div>
            <p style={{ color: "#fff", fontSize: 17, fontWeight: 950, lineHeight: 1.7, marginBottom: 12 }}>复制下面这段，粘贴到刚才打开的 AI / 工具里。发出去以后回来点确认。</p>
            <section style={primaryBlockStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", marginBottom: 10 }}>
                <h3 style={{ ...blockTitleStyle, marginBottom: 0 }}>直接复制这一段</h3>
                <button type="button" onClick={() => onCopy("prompt", step.prompt)} style={miniButtonStyle}>
                  {copied === "prompt" ? <Check size={13} /> : <Clipboard size={13} />} {copied === "prompt" ? "已复制" : "复制"}
                </button>
              </div>
              <p style={{ color: "#bbb", fontSize: 12, lineHeight: 1.85, whiteSpace: "pre-line" }}>{step.prompt}</p>
            </section>
          </div>
        )}

        {currentPhase.key === "check" && (
          <div>
            <p style={{ color: "#fff", fontSize: 17, fontWeight: 950, lineHeight: 1.7, marginBottom: 12 }}>现在检查 AI 给你的结果。符合下面标准，再点确认。</p>
            {step.validation && step.validation.length > 0 && (
              <div style={primaryBlockStyle}>
                <h3 style={blockTitleStyle}>做到这样就可以继续</h3>
                <div style={{ display: "grid", gap: 8 }}>{step.validation.map((item) => <CheckLine key={item}>{item}</CheckLine>)}</div>
              </div>
            )}
            <section style={{ border: "1px solid #2a1f10", background: "rgba(201,168,76,0.055)", borderRadius: 12, padding: "16px 18px", marginBottom: 12 }}>
              <p style={{ color: "#888", fontSize: 11, fontWeight: 950, marginBottom: 7 }}>这一步交付物</p>
              <p style={{ color: "#e8c96a", fontSize: 14, fontWeight: 950, lineHeight: 1.7 }}>{step.deliverable}</p>
            </section>
            {step.fixPrompt && (
              <details style={detailsStyle}>
                <summary style={summaryStyle}>结果不好？点这里复制补救提示词</summary>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", marginBottom: 10 }}>
                  <h3 style={{ ...blockTitleStyle, marginBottom: 0 }}>补救提示词</h3>
                  <button type="button" onClick={() => onCopy("fix", step.fixPrompt!)} style={miniButtonStyle}>
                    {copied === "fix" ? <Check size={13} /> : <Clipboard size={13} />} {copied === "fix" ? "已复制" : "复制"}
                  </button>
                </div>
                <p style={{ color: "#bbb", fontSize: 12, lineHeight: 1.85 }}>{step.fixPrompt}</p>
              </details>
            )}
            {step.checklist && step.checklist.length > 0 && (
              <details style={detailsStyle}>
                <summary style={summaryStyle}>更多提醒</summary>
                <div style={{ display: "grid", gap: 8, marginTop: 10 }}>{step.checklist.map((item) => <CheckLine key={item}>{item}</CheckLine>)}</div>
              </details>
            )}
            {step.troubleTips && step.troubleTips.length > 0 && (
              <details style={detailsStyle}>
                <summary style={summaryStyle}>卡住了再看</summary>
                <div style={{ display: "grid", gap: 9 }}>
                  {step.troubleTips.map((tip) => (
                    <div key={tip.problem} style={{ border: "1px solid #222", borderRadius: 9, padding: "11px 12px", background: "rgba(0,0,0,0.18)" }}>
                      <p style={{ color: "#fff", fontSize: 12, fontWeight: 950, marginBottom: 4 }}>{tip.problem}</p>
                      <p style={{ color: "#aaa", fontSize: 12, lineHeight: 1.65 }}>{tip.fix}</p>
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>
        )}
      </section>
      {isProofPhase && (
        <section style={{ border: "1px solid #29351f", background: "rgba(61,165,99,0.065)", borderRadius: 12, padding: "16px 18px", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 10, flexWrap: "wrap" }}>
          <div>
            <p style={{ color: "#fff", fontSize: 14, fontWeight: 950, marginBottom: 5 }}>通关判定</p>
            <p style={{ color: "#9fcfaf", fontSize: 12, lineHeight: 1.65 }}>{proofRule.label}</p>
          </div>
          <span style={{ color: proofReady ? "#3DA563" : "#888", fontSize: 11, fontWeight: 950 }}>{proofReady ? "可以进入下一步" : "先留下完成证明"}</span>
        </div>
        {proofItems.length > 0 && (
          <div style={{ display: "grid", gap: 7, marginBottom: proofRule.minLength > 0 ? 12 : 0 }}>
            {proofItems.map((item, index) => (
              <label key={item} style={{ display: "grid", gridTemplateColumns: "18px 1fr", gap: 8, alignItems: "start", color: "#cfcfcf", fontSize: 12, lineHeight: 1.6, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={!!proofChecks[index]}
                  onChange={() => setProofChecks((prev) => {
                    const next = [...prev]
                    next[index] = !next[index]
                    return next
                  })}
                  style={{ width: 15, height: 15, marginTop: 2, accentColor: "#3DA563" }}
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        )}
        {proofRule.minLength > 0 && (
          <textarea
            value={proofText}
            onChange={(event) => setProofText(event.target.value)}
            placeholder={proofRule.placeholder || "粘贴一句结果、文件名、链接或你生成出来的关键内容。"}
            rows={3}
            style={{ width: "100%", resize: "vertical", border: "1px solid #28412e", background: "rgba(0,0,0,0.32)", color: "#e9f6ed", borderRadius: 10, padding: "11px 12px", fontSize: 12, lineHeight: 1.65, outline: "none" }}
          />
        )}
        {proofRule.screenshotRequired && (
          <div style={{ marginTop: 12, border: "1px solid #28412e", background: "rgba(0,0,0,0.24)", borderRadius: 10, padding: "12px 13px" }}>
            <p style={{ color: "#d7f4df", fontSize: 12, fontWeight: 950, marginBottom: 6, display: "flex", alignItems: "center", gap: 7 }}>
              <ImageIcon size={14} /> 截图证明
            </p>
            <p style={{ color: "#9fcfaf", fontSize: 12, lineHeight: 1.65, marginBottom: 10 }}>{proofRule.screenshotHint || "上传一张能看出完成结果的截图。"}</p>
            <label style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid #3b5f43", background: "rgba(61,165,99,0.09)", color: "#d7f4df", borderRadius: 8, padding: "8px 10px", fontSize: 12, fontWeight: 900, cursor: "pointer" }}>
              <Upload size={14} /> {screenshotName ? "更换截图" : "上传截图"}
              <input type="file" accept="image/*" onChange={(event) => handleScreenshot(event.target.files?.[0])} style={{ display: "none" }} />
            </label>
            {screenshotName && <p style={{ color: "#8fd6a0", fontSize: 11, marginTop: 8 }}>已保存截图：{screenshotName}</p>}
            {screenshotError && <p style={{ color: "#ff9b9b", fontSize: 11, marginTop: 8 }}>{screenshotError}</p>}
          </div>
        )}
        </section>
      )}

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        {currentGuideStep > 0 && (
          <button type="button" onClick={() => setGuideStep((value) => Math.max(0, value - 1))} className="btn-outline" style={{ fontSize: 12 }}>
            返回上一个小步
          </button>
        )}
        {isProofPhase ? (
          <button
            type="button"
            onClick={() => onDone({ method: proofRule.method, text: proofText.trim(), checked: proofChecks, screenshotName, screenshotDataUrl, updatedAt: new Date().toISOString() })}
            disabled={!proofReady}
            className="btn-primary"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, opacity: proofReady ? 1 : 0.48, cursor: proofReady ? "pointer" : "not-allowed" }}
          >
            我完成了这一步，进入下一步 <ArrowRight size={14} />
          </button>
        ) : (
          <button type="button" onClick={nextGuideStep} className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12 }}>
            {currentPhase.doneText} <ArrowRight size={14} />
          </button>
        )}
      </div>
    </article>
  )
}

function compressProofImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error("read failed"))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error("image failed"))
      img.onload = () => {
        const maxWidth = 1200
        const scale = Math.min(1, maxWidth / img.width)
        const canvas = document.createElement("canvas")
        canvas.width = Math.max(1, Math.round(img.width * scale))
        canvas.height = Math.max(1, Math.round(img.height * scale))
        const ctx = canvas.getContext("2d")
        if (!ctx) {
          reject(new Error("canvas failed"))
          return
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL("image/jpeg", 0.72))
      }
      img.src = String(reader.result || "")
    }
    reader.readAsDataURL(file)
  })
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
      <h2 style={{ color: "#fff", fontSize: 32, fontWeight: 950, lineHeight: 1.25, marginBottom: 10 }}>任务通关，战利品待领取</h2>
      <p style={{ color: "#cfcfcf", fontSize: 15, lineHeight: 1.85, marginBottom: 18 }}>
        小白：这不是看完一篇教程，这是你真的做完了一件事。领取 XP，推进等级；发一篇复盘，把这次通关变成别人能看见的战绩。
      </p>
      <div style={{ border: "1px solid #242424", background: "rgba(0,0,0,0.26)", borderRadius: 10, padding: "14px 15px", marginBottom: 16 }}>
        <p style={{ color: "#bbb", fontSize: 12, lineHeight: 1.75, whiteSpace: "pre-line" }}>{mission.recapTemplate}</p>
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button type="button" onClick={onClaim} disabled={claiming} className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          {claiming ? "领取中..." : `领取 ${mission.xp}XP 通关奖励`} <Trophy size={14} />
        </button>
        <button type="button" onClick={onCopy} className="btn-outline" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          {copied ? <Check size={14} /> : <Clipboard size={14} />} {copied ? "已复制复盘" : "复制复盘模板"}
        </button>
        <Link href="/community/new" className="btn-outline" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
          发复盘 <MessageCircle size={14} />
        </Link>
      </div>
      {notice && <p style={{ color: notice.includes("到账") ? "#3DA563" : "#cdbb80", fontSize: 13, lineHeight: 1.7, marginTop: 12 }}>{notice}</p>}
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

const primaryBlockStyle: CSSProperties = {
  border: "1px solid #302711",
  background: "rgba(201,168,76,0.045)",
  borderRadius: 12,
  padding: "15px 17px",
  marginBottom: 12,
}

const guideShellStyle: CSSProperties = {
  border: "1px solid rgba(201,168,76,0.34)",
  background: "rgba(201,168,76,0.055)",
  borderRadius: 12,
  padding: "16px 18px",
  marginBottom: 14,
}

const quietTipStyle: CSSProperties = {
  border: "1px solid #242424",
  borderRadius: 10,
  padding: "13px 14px",
  background: "rgba(0,0,0,0.22)",
}

const detailsStyle: CSSProperties = {
  border: "1px solid #202020",
  background: "rgba(0,0,0,0.18)",
  borderRadius: 12,
  padding: "13px 15px",
  marginBottom: 12,
}

const summaryStyle: CSSProperties = {
  color: "#cdbb80",
  fontSize: 13,
  fontWeight: 950,
  cursor: "pointer",
  listStyle: "none",
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

const toolChipButtonStyle: CSSProperties = {
  border: "1px solid #7a6230",
  background: "rgba(201,168,76,0.16)",
  color: "#f2dc91",
  borderRadius: 999,
  padding: "8px 11px",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  textDecoration: "none",
  fontSize: 12,
  fontWeight: 950,
}

const toolChipLinkStyle: CSSProperties = {
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(0,0,0,0.28)",
  color: "#ddd",
  borderRadius: 999,
  padding: "8px 11px",
  display: "inline-flex",
  alignItems: "center",
  textDecoration: "none",
  fontSize: 12,
  fontWeight: 900,
}

const toolChipTextStyle: CSSProperties = {
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(0,0,0,0.28)",
  color: "#ddd",
  borderRadius: 999,
  padding: "8px 11px",
  display: "inline-flex",
  alignItems: "center",
  fontSize: 12,
  fontWeight: 900,
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
