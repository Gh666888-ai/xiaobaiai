"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { CheckCircle2, ChevronLeft, ChevronRight, Circle, Image as ImageIcon, Upload } from "lucide-react"
import { ContentVisual } from "@/components/ContentVisual"
import { MathRain } from "@/components/MathRain"
import { SeoKeywordLinks } from "@/components/SeoKeywordLinks"
import { SeoRelatedLinks } from "@/components/SeoRelatedLinks"
import { LEARNING_STAGE_XP } from "@/data/growth"
import { stages } from "@/data/learning-path"
import { tools } from "@/data/tools"
import { toolPath } from "@/data/tool-meta"
import { useAuth } from "@/lib/AuthContext"
import { readAppAuth } from "@/lib/app-auth"
import { getLearningSectionCheck } from "@/lib/learning-checks"
import {
  LearningProgress,
  LearningProofs,
  isLearningProofReady,
  progressId,
  readLearningProofs,
  readLearningProgress,
  writeLearningProofs,
  writeLearningProgress,
} from "@/lib/learning-progress"

function letter(name: string) {
  return /^[a-zA-Z]/.test(name) ? name[0].toUpperCase() : name[0]
}

function avColor(name: string) {
  const colors = ["#c9a84c", "#e8c96a", "#7a6230", "#5a8a5a"]
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

export default function StageDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, refresh } = useAuth()
  const stageId = Number(params.id)
  const foundStage = stages.find((stage) => stage.id === stageId)
  const stage = foundStage || stages[0]
  const stageTools = tools.filter((tool) => tool.stage === stageId).slice(0, 3)
  const [progress, setProgress] = useState<LearningProgress>({})
  const [proofs, setProofs] = useState<LearningProofs>({})
  const [activeIndex, setActiveIndex] = useState(0)
  const [proofText, setProofText] = useState("")
  const [proofChecks, setProofChecks] = useState<boolean[]>([])
  const [screenshotName, setScreenshotName] = useState("")
  const [screenshotDataUrl, setScreenshotDataUrl] = useState("")
  const [screenshotError, setScreenshotError] = useState("")
  const [stageRewardClaimed, setStageRewardClaimed] = useState(false)
  const [stageRewardBusy, setStageRewardBusy] = useState(false)
  const [stageRewardNotice, setStageRewardNotice] = useState("")

  useEffect(() => {
    setProgress(readLearningProgress())
    setProofs(readLearningProofs())
    setActiveIndex(0)
    setStageRewardNotice("")
  }, [stageId])

  useEffect(() => {
    if (typeof window === "undefined") return
    const key = `xiaobaiai:learn-stage-reward:v1:${user?.userId || "guest"}:${stageId}`
    setStageRewardClaimed(window.localStorage.getItem(key) === "1")
  }, [stageId, user?.userId])

  const activeSection = stage.sections[Math.min(activeIndex, stage.sections.length - 1)]
  const activeId = progressId(stageId, activeIndex)
  const activeDone = !!progress[activeId]
  const activeProof = proofs[activeId]
  const activeCheck = getLearningSectionCheck(stageId, activeSection)
  const proofReady = isLearningProofReady(
    { text: proofText.trim(), checked: proofChecks, screenshotName, screenshotDataUrl, updatedAt: new Date().toISOString() },
    activeCheck.minLength,
    activeCheck.requiredChecks,
    activeCheck.screenshotRequired,
  )
  const completedCount = stage.sections.filter((_, index) => progress[progressId(stageId, index)]).length
  const progressPercent = stage.sections.length ? Math.round((completedCount / stage.sections.length) * 100) : 0
  const stageCompleted = completedCount === stage.sections.length

  useEffect(() => {
    const saved = proofs[progressId(stageId, activeIndex)]
    setProofText(saved?.text || "")
    setProofChecks(saved?.checked || [])
    setScreenshotName(saved?.screenshotName || "")
    setScreenshotDataUrl(saved?.screenshotDataUrl || "")
    setScreenshotError("")
  }, [activeIndex, proofs, stageId])

  function saveSectionProof(sectionIndex: number, completed: boolean) {
    const id = progressId(stageId, sectionIndex)
    const nextProofs = {
      ...proofs,
      [id]: { text: proofText.trim(), checked: proofChecks, screenshotName, screenshotDataUrl, updatedAt: new Date().toISOString() },
    }
    const next = { ...progress, [id]: completed }
    if (!completed) delete next[id]
    setProofs(nextProofs)
    setProgress(next)
    writeLearningProofs(nextProofs)
    writeLearningProgress(next)
  }

  async function claimStageReward() {
    if (!stageCompleted || stageRewardBusy || stageRewardClaimed) return
    if (!user) {
      router.push(`/login?redirect=/learn/${stageId}`)
      return
    }
    const token = readAppAuth()?.session?.access_token
    if (!token) {
      router.push(`/login?redirect=/learn/${stageId}`)
      return
    }
    setStageRewardBusy(true)
    setStageRewardNotice("")
    try {
      const res = await fetch("/api/growth/xp", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reason: "learn-stage", stageId, proof: { sections: proofs } }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || "阶段奖励领取失败，请稍后再试。")
      const awarded = Number(data.awarded || 0)
      const key = `xiaobaiai:learn-stage-reward:v1:${user.userId}:${stageId}`
      window.localStorage.setItem(key, "1")
      setStageRewardClaimed(true)
      await refresh().catch(() => undefined)
      setStageRewardNotice(awarded > 0 ? `阶段通关成功，${awarded} XP 已进入账号等级。` : "这个阶段奖励已经领过了。")
    } catch (error: any) {
      setStageRewardNotice(error?.message || "阶段奖励领取失败，请稍后再试。")
    } finally {
      setStageRewardBusy(false)
    }
  }

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

  if (!foundStage) {
    return (
      <div style={{ background: "#000", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#aaa" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 48, marginBottom: 16 }}>404</p>
          <button onClick={() => router.push("/learn")} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#c9a84c", border: "1px solid #7a6230", padding: "8px 20px", background: "transparent", cursor: "pointer" }}>
            返回学习路径
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: "#000", minHeight: "100vh", fontFamily: "'Noto Sans SC', sans-serif", position: "relative", overflow: "hidden" }}>
      <MathRain />
      <nav style={{ position: "sticky", top: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 60px", background: "rgba(0,0,0,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid #1a1a1a" }} className="max-sm:px-6">
        <button onClick={() => router.push("/learn")} style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.2em", color: "#c9a84c", fontFamily: "'JetBrains Mono', monospace", background: "none", border: "none", cursor: "pointer" }}>返回学习路径</button>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#aaa", letterSpacing: "0.15em" }}>STAGE {String(stageId).padStart(2, "0")}</span>
      </nav>

      <main style={{ maxWidth: 980, margin: "0 auto", padding: "60px 60px", position: "relative", zIndex: 10, background: "rgba(0,0,0,0.88)" }} className="max-sm:px-6">
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 34 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, background: "rgba(201,168,76,0.12)", flexShrink: 0 }}>{stage.icon}</div>
          <div>
            <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: "0.2em", color: "#7a6230", marginBottom: 4 }}>STAGE {String(stageId).padStart(2, "0")}</p>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: "#fff" }}>{stage.title}</h1>
            <p style={{ fontSize: 14, color: "#c9a84c", marginTop: 4 }}>{stage.subtitle}</p>
          </div>
        </div>

        <section style={{ border: "1px solid #2a1f10", background: "rgba(201,168,76,0.05)", borderRadius: 12, padding: "16px 18px", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
            <p style={{ fontSize: 13, fontWeight: 900, color: "#fff" }}>本阶段进度</p>
            <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 900, color: "#e8c96a" }}>{completedCount}/{stage.sections.length} · {progressPercent}%</p>
          </div>
          <div style={{ height: 8, background: "#111", border: "1px solid #242424", borderRadius: 999, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progressPercent}%`, background: "linear-gradient(90deg,#7a6230,#e8c96a)", transition: "width 0.3s" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: 12, marginTop: 14 }} className="max-sm:grid-cols-1">
            <div>
              <p style={{ fontSize: 13, fontWeight: 900, color: stageCompleted ? "#e8c96a" : "#fff" }}>阶段通关奖励 · +{LEARNING_STAGE_XP}XP</p>
              <p style={{ fontSize: 12, color: "#aaa", lineHeight: 1.75, marginTop: 4 }}>
                {stageCompleted ? "本阶段章节已全部完成，可以领取一次性奖励。" : "每章都要留下操作证明，完成全部章节后解锁奖励。"}
              </p>
              {stageRewardNotice && <p style={{ fontSize: 12, color: stageRewardNotice.includes("失败") ? "#ff9b9b" : "#cdbb80", lineHeight: 1.7, marginTop: 6 }}>{stageRewardNotice}</p>}
            </div>
            <button onClick={claimStageReward} disabled={!stageCompleted || stageRewardBusy || stageRewardClaimed}
              style={{ border: `1px solid ${stageCompleted ? "#e8c96a" : "#333"}`, background: stageRewardClaimed ? "rgba(61,165,99,0.1)" : stageCompleted ? "#e8c96a" : "rgba(255,255,255,0.03)", color: stageRewardClaimed ? "#3DA563" : stageCompleted ? "#111" : "#666", borderRadius: 9, padding: "10px 13px", fontSize: 12, fontWeight: 950, cursor: stageCompleted && !stageRewardClaimed && !stageRewardBusy ? "pointer" : "default", whiteSpace: "nowrap" }}>
              {!stageCompleted ? "未解锁" : stageRewardClaimed ? "奖励已领取" : stageRewardBusy ? "写入中..." : user ? `领取 +${LEARNING_STAGE_XP}XP` : "登录领取奖励"}
            </button>
          </div>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "240px minmax(0,1fr)", gap: 16, marginBottom: 42 }} className="max-sm:grid-cols-1">
          <aside style={{ border: "1px solid #1a1a1a", background: "rgba(255,255,255,0.02)", borderRadius: 8, padding: 12, alignSelf: "start" }}>
            <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 900, color: "#777", letterSpacing: "0.14em", marginBottom: 10 }}>CHAPTERS</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {stage.sections.map((section, index) => {
                const done = !!progress[progressId(stageId, index)]
                const isActive = index === activeIndex
                return (
                  <button key={section.title} onClick={() => setActiveIndex(index)}
                    style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", textAlign: "left", border: `1px solid ${isActive ? "#7a6230" : "#202020"}`, background: isActive ? "rgba(201,168,76,0.08)" : "rgba(255,255,255,0.02)", borderRadius: 6, padding: "9px 10px", cursor: "pointer", color: isActive ? "#fff" : "#aaa", fontFamily: "'Noto Sans SC', sans-serif" }}>
                    <span style={{ width: 22, height: 22, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 900, color: done ? "#111" : "#c9a84c", border: "1px solid #7a6230", background: done ? "#e8c96a" : "transparent", flexShrink: 0 }}>{done ? "✓" : index + 1}</span>
                    <span style={{ fontSize: 12, fontWeight: 800, lineHeight: 1.35, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{section.title}</span>
                  </button>
                )
              })}
            </div>
          </aside>

          <article style={{ border: "1px solid #1a1a1a", background: activeDone ? "rgba(201,168,76,0.035)" : "rgba(255,255,255,0.02)", borderRadius: 8, overflow: "hidden" }}>
            <ContentVisual title={activeSection.title} label={`CHAPTER ${activeIndex + 1}`} meta={`${activeIndex + 1}/${stage.sections.length} · ${stage.timeEstimate}`} kind={stage.id === 4 ? "agent" : stage.id >= 2 ? "code" : "learn"} />
            <div style={{ padding: "28px 30px" }} className="max-sm:px-4">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
                <div>
                  <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 900, color: "#7a6230", letterSpacing: "0.14em", marginBottom: 6 }}>CHAPTER {activeIndex + 1}</p>
                  <h2 style={{ fontSize: 22, fontWeight: 900, color: "#fff", lineHeight: 1.35 }}>{activeSection.title}</h2>
                </div>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 900, color: activeDone ? "#e8c96a" : "#777" }}>{activeDone ? "DONE" : "LEARNING"}</span>
              </div>

              <p style={{ fontSize: 16, color: "#eee", lineHeight: 1.95, whiteSpace: "pre-line" }}><SeoKeywordLinks text={activeSection.content} maxLinks={10} /></p>
              {activeSection.tips && (
                <div style={{ marginTop: 18, padding: 16, background: "rgba(201,168,76,0.04)", border: "1px solid #2a1f10", borderRadius: 6 }}>
                  <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#e8c96a", letterSpacing: "0.1em", marginBottom: 6 }}>TIP</p>
                  <p style={{ fontSize: 15, color: "#eee", lineHeight: 1.75 }}><SeoKeywordLinks text={activeSection.tips} maxLinks={4} /></p>
                </div>
              )}

              <section style={{ marginTop: 18, padding: 16, background: "rgba(201,168,76,0.055)", border: "1px solid #2a1f10", borderRadius: 8 }}>
                <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 950, color: "#7a6230", letterSpacing: "0.14em", marginBottom: 7 }}>DO THIS NOW</p>
                <h3 style={{ fontSize: 17, fontWeight: 950, color: "#fff", lineHeight: 1.45, marginBottom: 8 }}>{activeCheck.simpleGoal}</h3>
                <p style={{ fontSize: 13, color: "#cdbb80", lineHeight: 1.75, marginBottom: 8 }}>先看示例：{activeCheck.demo}</p>
                <p style={{ fontSize: 13, color: "#ddd", lineHeight: 1.75 }}>现在操作：{activeCheck.action}</p>
                <Link href={activeCheck.nextHref} className="btn-outline" style={{ display: "inline-flex", textDecoration: "none", marginTop: 12, fontSize: 12 }}>{activeCheck.nextText}</Link>
              </section>

              <section style={{ marginTop: 12, padding: 16, background: "rgba(61,165,99,0.06)", border: "1px solid #29351f", borderRadius: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "start", marginBottom: 10, flexWrap: "wrap" }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 950, color: "#fff", marginBottom: 5 }}>完成判定</p>
                    <p style={{ fontSize: 12, color: "#9fcfaf", lineHeight: 1.65 }}>{activeCheck.proofLabel}</p>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 950, color: activeDone || proofReady ? "#3DA563" : "#888" }}>{activeDone ? "已完成" : proofReady ? "可以标记" : "待证明"}</span>
                </div>
                <div style={{ display: "grid", gap: 7, marginBottom: 10 }}>
                  {activeCheck.proofItems.map((item, index) => (
                    <label key={item} style={{ display: "grid", gridTemplateColumns: "18px 1fr", gap: 8, alignItems: "start", fontSize: 12, color: "#cfcfcf", lineHeight: 1.6, cursor: "pointer" }}>
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
                <textarea
                  value={proofText}
                  onChange={(event) => setProofText(event.target.value)}
                  placeholder={activeCheck.placeholder}
                  rows={3}
                  style={{ width: "100%", resize: "vertical", border: "1px solid #28412e", background: "rgba(0,0,0,0.32)", color: "#e9f6ed", borderRadius: 8, padding: "10px 11px", fontSize: 12, lineHeight: 1.65, outline: "none" }}
                />
                {activeCheck.screenshotRequired && (
                  <div style={{ marginTop: 10, border: "1px solid #28412e", background: "rgba(0,0,0,0.24)", borderRadius: 8, padding: "10px 11px" }}>
                    <p style={{ color: "#d7f4df", fontSize: 12, fontWeight: 950, marginBottom: 6, display: "flex", alignItems: "center", gap: 7 }}>
                      <ImageIcon size={14} /> 截图证明
                    </p>
                    <p style={{ color: "#9fcfaf", fontSize: 12, lineHeight: 1.6, marginBottom: 9 }}>{activeCheck.screenshotHint || "上传一张能看出完成结果的截图。"}</p>
                    <label style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid #3b5f43", background: "rgba(61,165,99,0.09)", color: "#d7f4df", borderRadius: 8, padding: "8px 10px", fontSize: 12, fontWeight: 900, cursor: "pointer" }}>
                      <Upload size={14} /> {screenshotName ? "更换截图" : "上传截图"}
                      <input type="file" accept="image/*" onChange={(event) => handleScreenshot(event.target.files?.[0])} style={{ display: "none" }} />
                    </label>
                    {screenshotName && <p style={{ color: "#8fd6a0", fontSize: 11, marginTop: 8 }}>已保存截图：{screenshotName}</p>}
                    {screenshotError && <p style={{ color: "#ff9b9b", fontSize: 11, marginTop: 8 }}>{screenshotError}</p>}
                  </div>
                )}
                {activeProof?.updatedAt && <p style={{ fontSize: 11, color: "#777", marginTop: 8 }}>上次保存：{new Date(activeProof.updatedAt).toLocaleString()}</p>}
              </section>

              <SeoRelatedLinks text={`${stage.title}\n${activeSection.title}\n${activeSection.content}\n${activeSection.tips || ""}`} title="相关教程" limit={5} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginTop: 24, flexWrap: "wrap" }}>
                <button onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))} disabled={activeIndex === 0}
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, border: "1px solid #333", background: "rgba(255,255,255,0.03)", color: activeIndex === 0 ? "#444" : "#bbb", borderRadius: 8, padding: "10px 12px", fontSize: 12, fontWeight: 900, cursor: activeIndex === 0 ? "not-allowed" : "pointer" }}>
                  <ChevronLeft size={15} /> 上一章
                </button>
                <button onClick={() => saveSectionProof(activeIndex, !activeDone)} disabled={!activeDone && !proofReady}
                  style={{ display: "inline-flex", alignItems: "center", gap: 7, whiteSpace: "nowrap", border: `1px solid ${activeDone || proofReady ? "#7a6230" : "#333"}`, background: activeDone ? "rgba(201,168,76,0.12)" : proofReady ? "rgba(61,165,99,0.1)" : "rgba(255,255,255,0.03)", color: activeDone ? "#e8c96a" : proofReady ? "#3DA563" : "#666", borderRadius: 8, padding: "10px 12px", fontSize: 12, fontWeight: 900, cursor: activeDone || proofReady ? "pointer" : "not-allowed" }}>
                  {activeDone ? <CheckCircle2 size={15} /> : <Circle size={15} />}
                  {activeDone ? "取消完成" : "证明够了，标记完成"}
                </button>
                <button onClick={() => setActiveIndex(Math.min(stage.sections.length - 1, activeIndex + 1))} disabled={activeIndex === stage.sections.length - 1}
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, border: "1px solid #333", background: "rgba(255,255,255,0.03)", color: activeIndex === stage.sections.length - 1 ? "#444" : "#bbb", borderRadius: 8, padding: "10px 12px", fontSize: 12, fontWeight: 900, cursor: activeIndex === stage.sections.length - 1 ? "not-allowed" : "pointer" }}>
                  下一章 <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </article>
        </section>

        {stageTools.length > 0 && (
          <section style={{ marginBottom: 42 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 16 }}>本阶段推荐工具</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {stageTools.map((tool) => (
                <Link key={tool.id} href={toolPath(tool)}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid #1a1a1a", textDecoration: "none", transition: "all 0.3s" }}>
                  <span style={{ width: 24, height: 24, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#fff", background: avColor(tool.name), fontFamily: "'JetBrains Mono',monospace" }}>{letter(tool.name)}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#ccc" }}>{tool.name}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section style={{ marginBottom: 42, background: "rgba(201,168,76,0.04)", border: "1px solid #2a1f10", borderRadius: 10, padding: "24px 28px" }}>
          <h3 style={{ fontSize: 16, fontWeight: 900, color: "#fff", marginBottom: 14 }}>学完这一阶段，你应该能做到</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              `用自己的话解释「${stage.title}」解决什么问题。`,
              "独立完成本页至少 1 个工具或流程的第一次使用。",
              "把一次 AI 输出结果人工检查并改成可交付版本。",
            ].map((item, index) => (
              <p key={item} style={{ fontSize: 14, color: "#ddd", lineHeight: 1.8 }}>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", color: "#e8c96a", fontWeight: 900, marginRight: 8 }}>CHECK {index + 1}</span>{item}
              </p>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 20 }}>
            <Link href="/start" className="btn-primary" style={{ textDecoration: "none" }}>从 0 到 1 开始做事</Link>
            <Link href="/cases" className="btn-outline" style={{ textDecoration: "none" }}>看真实案例</Link>
          </div>
        </section>

        {stageId < stages.length - 1 && (
          <button onClick={() => router.push(`/learn/${stageId + 1}`)}
            style={{ width: "100%", padding: 24, background: "rgba(255,255,255,0.02)", border: "1px solid #1a1a1a", cursor: "pointer", textAlign: "left", display: "block" }}>
            <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#aaa", letterSpacing: "0.15em", marginBottom: 4 }}>NEXT STAGE</p>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#c9a84c" }}>阶段 {stageId + 1}：{stages.find((item) => item.id === stageId + 1)?.title}</p>
          </button>
        )}
      </main>
    </div>
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
