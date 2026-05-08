"use client"

import { useEffect, useMemo, useState } from "react"
import type { CSSProperties } from "react"
import Link from "next/link"
import { ArrowRight, Check, CheckCircle2, Clipboard, Image as ImageIcon, MessageCircle, Shuffle, SkipForward, Trophy, Upload } from "lucide-react"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"
import { missions } from "@/data/missions"
import {
  getMissionStepProofRequirement,
  getStoredMission,
  isMissionStepProofReady,
  markMissionStepDone,
  readMissionProgress,
  selectMission,
  writeMissionProgress,
  type MissionProgressState,
} from "@/lib/mission-progress"

const principles = [
  "先问想做成什么事，再找工具。",
  "完整项目太大，就先做其中一个环节。",
  "第一个环节必须能交付、能检查、能复用。",
  "做完再发复盘，让经验变成自己的资产。",
]

const quickGoals = [
  { label: "不知道做什么", desc: "默认做 6 页 PPT 初稿", goal: "做PPT" },
  { label: "我要做 PPT", desc: "适合汇报、作业、方案", goal: "做PPT" },
  { label: "我要整理资料", desc: "适合合同、文章、会议记录", goal: "办公" },
  { label: "我要写内容", desc: "适合小红书、公众号、产品文案", goal: "写文章" },
  { label: "我要做动漫", desc: "适合漫剧、分镜、短视频样片", goal: "动漫漫剧" },
  { label: "我要写故事", desc: "适合网文、小说、剧本样章", goal: "网文故事" },
  { label: "我要给 AI 加技能", desc: "适合找 Skill、插件、MCP 能力", goal: "找Skill" },
]

const goalMissionMap: { keywords: string[]; missionId: string }[] = [
  { keywords: ["动漫", "漫剧", "短剧", "短视频剧情", "分镜", "角色一致", "AI视频", "AI 视频"], missionId: "ai-comic-video-first-episode" },
  { keywords: ["网文", "小说", "故事", "剧本", "写作", "样章"], missionId: "ai-webnovel-first-chapter" },
  { keywords: ["本地", "本地模型", "部署", "Ollama", "LM Studio", "隐私"], missionId: "local-model-first-run" },
  { keywords: ["行业技能", "行业Skill", "行业 Skill", "技能包", "自动化技能"], missionId: "industry-skill-stack-plan" },
  { keywords: ["写文章", "文章", "小红书", "内容", "做视频", "视频", "做图片", "图片", "封面"], missionId: "xiaohongshu-ai-content-loop" },
  { keywords: ["ppt", "PPT", "做PPT", "做 PPT", "演示", "幻灯片", "汇报"], missionId: "ai-ppt-first-deck" },
  { keywords: ["办公", "文档", "资料", "总结", "分析"], missionId: "kimi-k26-long-doc" },
  { keywords: ["编程", "代码", "开发", "小功能"], missionId: "codex-small-feature" },
  { keywords: ["claude", "Claude", "deepseek", "DeepSeek", "工程"], missionId: "claude-code-deepseek-project" },
  { keywords: ["agent", "Agent", "知识库", "客服", "店铺", "公司"], missionId: "dify-knowledge-base-bot" },
  { keywords: ["skill", "Skill", "技能", "插件", "MCP", "找Skill", "加技能"], missionId: "agent-skill-first-install" },
  { keywords: ["自动化", "n8n", "日报", "提醒"], missionId: "n8n-ai-news-automation" },
]

const missionDirections: Record<string, string> = {
  "ai-ppt-first-deck": "office",
  "kimi-k26-long-doc": "office",
  "xiaohongshu-ai-content-loop": "content",
  "ai-comic-video-first-episode": "content",
  "ai-webnovel-first-chapter": "content",
  "dify-knowledge-base-bot": "agent-app",
  "n8n-ai-news-automation": "automation",
  "agent-skill-first-install": "agent-skill",
  "industry-skill-stack-plan": "agent-skill",
  "local-model-first-run": "local-model",
  "codex-small-feature": "engineering",
  "claude-code-deepseek-project": "engineering",
}

function missionFromGoalParam(goal: string | null) {
  if (!goal) return null
  const decoded = goal.trim()
  return goalMissionMap.find((item) => item.keywords.some((keyword) => decoded.includes(keyword)))?.missionId || null
}

function pickRandomMissionId(pool: typeof missions, fallbackId: string) {
  if (pool.length === 0) return fallbackId
  return pool[Math.floor(Math.random() * pool.length)].id
}

function missionDirection(id: string) {
  return missionDirections[id] || "other"
}

export function StartClient() {
  const [progress, setProgress] = useState<MissionProgressState>(() => ({ activeMissionId: missions[0].id, missions: {} }))
  const [selectedId, setSelectedId] = useState(missions[0].id)
  const [copied, setCopied] = useState<"prompt" | "recap" | null>(null)
  const [proofText, setProofText] = useState("")
  const [proofChecks, setProofChecks] = useState<boolean[]>([])
  const [screenshotName, setScreenshotName] = useState("")
  const [screenshotDataUrl, setScreenshotDataUrl] = useState("")
  const [screenshotError, setScreenshotError] = useState("")

  useEffect(() => {
    const saved = readMissionProgress()
    const goalId = missionFromGoalParam(new URLSearchParams(window.location.search).get("goal"))
    const activeId = goalId && missions.some((mission) => mission.id === goalId)
      ? goalId
      : missions.some((mission) => mission.id === saved.activeMissionId)
        ? saved.activeMissionId
        : missions[0].id
    const next = goalId ? selectMission(saved, activeId) : saved
    setProgress(next)
    setSelectedId(activeId)
  }, [])

  const selected = useMemo(() => missions.find((mission) => mission.id === selectedId) ?? missions[0], [selectedId])
  const selectedProgress = getStoredMission(progress, selected.id)
  const currentStepIndex = Math.min(selectedProgress.currentStep || 0, selected.steps.length - 1)
  const currentStep = selected.steps[currentStepIndex]
  const doneSteps = selected.steps.filter((_, index) => selectedProgress.completedSteps[index]).length
  const proofRequirement = getMissionStepProofRequirement(currentStep, currentStepIndex, selected.steps.length)
  const savedProof = selectedProgress.stepProofs?.[currentStepIndex]
  const currentProof = {
    method: proofRequirement.method,
    text: proofText.trim(),
    checked: proofChecks,
    screenshotName,
    screenshotDataUrl,
    updatedAt: new Date().toISOString(),
  }
  const proofReady = isMissionStepProofReady(proofRequirement, currentProof)
  const selectedGoal = quickGoals.find((item) => missionFromGoalParam(item.goal) === selected.id)?.label || "当前任务"

  useEffect(() => {
    setProofText(savedProof?.text || "")
    setProofChecks(savedProof?.checked || [])
    setScreenshotName(savedProof?.screenshotName || "")
    setScreenshotDataUrl(savedProof?.screenshotDataUrl || "")
    setScreenshotError("")
  }, [selected.id, currentStepIndex, savedProof])

  function persist(next: MissionProgressState) {
    setProgress(next)
    writeMissionProgress(next)
  }

  function chooseMission(id: string) {
    setSelectedId(id)
    persist(selectMission(progress, id))
  }

  function switchRandomMission() {
    const nextId = pickRandomMissionId(missions.filter((mission) => mission.id !== selected.id), missions[0].id)
    chooseMission(nextId)
  }

  function skipCurrentDirection() {
    const currentDirection = missionDirection(selected.id)
    const nextId = pickRandomMissionId(
      missions.filter((mission) => mission.id !== selected.id && missionDirection(mission.id) !== currentDirection),
      missions.find((mission) => mission.id !== selected.id)?.id || missions[0].id,
    )
    chooseMission(nextId)
  }

  function finishCurrentStep() {
    if (!proofReady) return
    persist(markMissionStepDone(progress, selected.id, currentStepIndex, selected.steps.length, currentProof))
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

  return (
    <div style={{ background: "#000", minHeight: "100vh", fontFamily: "'Noto Sans SC', sans-serif", position: "relative", overflow: "hidden" }}>
      <MathRain />
      <NavBar />
      <main style={{ maxWidth: 1120, margin: "0 auto", padding: "64px clamp(16px,5vw,60px) 104px", position: "relative", zIndex: 10, background: "rgba(0,0,0,0.9)" }}>
        <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.34em", color: "#7a6230", textTransform: "uppercase", marginBottom: 12, fontWeight: 900 }}>Today 0-1 Step</p>
        <h1 style={{ fontSize: 42, color: "#fff", fontWeight: 950, lineHeight: 1.22, marginBottom: 14 }}>别想太多，先点一个能做成的目标</h1>
        <p style={{ fontSize: 16, color: "#ccc", lineHeight: 1.9, maxWidth: 880, marginBottom: 18 }}>
          第一次来不用理解 AI 生态，也不用先选工具。选下面一个目标，小白会直接给你当前这一步、复制用的提示词和完成判定。
        </p>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 10, marginBottom: 18 }} className="start-goal-grid">
          {quickGoals.map((item) => {
            const targetId = missionFromGoalParam(item.goal) || missions[0].id
            const active = targetId === selected.id
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => chooseMission(targetId)}
                style={{
                  textAlign: "left",
                  border: active ? "1px solid #8c7333" : "1px solid #1f1f1f",
                  background: active ? "rgba(201,168,76,0.08)" : "rgba(255,255,255,0.026)",
                  borderRadius: 10,
                  padding: "14px 13px",
                  minHeight: 104,
                  cursor: "pointer",
                }}
              >
                <span style={{ display: "block", color: active ? "#e8c96a" : "#fff", fontSize: 14, fontWeight: 950, lineHeight: 1.35, marginBottom: 6 }}>{item.label}</span>
                <span style={{ display: "block", color: "#999", fontSize: 12, lineHeight: 1.6 }}>{item.desc}</span>
              </button>
            )
          })}
        </section>

        <section style={{ border: "1px solid #2a1f10", background: "rgba(201,168,76,0.055)", borderRadius: 12, padding: "18px 20px", marginBottom: 18, display: "grid", gridTemplateColumns: "1fr auto", gap: 14, alignItems: "center" }} className="max-sm:grid-cols-1">
          <div>
            <p style={{ color: "#e8c96a", fontSize: 13, fontWeight: 950, marginBottom: 6 }}>推荐你现在做这个</p>
            <p style={{ color: "#ddd", fontSize: 14, lineHeight: 1.8 }}>
              你选的是：<b>{selectedGoal}</b>。当前任务：<b>{selected.shortTitle}</b>。现在只做：<b>{selectedProgress.completed ? "发复盘，把经验沉淀下来" : currentStep.title}</b>。
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "flex-end", flexWrap: "wrap" }}>
            <button type="button" onClick={switchRandomMission} className="btn-outline" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <Shuffle size={14} /> 随机换一个
            </button>
            <button type="button" onClick={skipCurrentDirection} className="btn-outline" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <SkipForward size={14} /> 跳过这个方向
            </button>
            <a href="#start-current-step" className="btn-primary" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
              开始这一步 <ArrowRight size={14} />
            </a>
          </div>
        </section>

        <section style={{ border: "1px solid #181818", background: "rgba(255,255,255,0.024)", borderRadius: 10, padding: "10px 12px", marginBottom: 14, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ color: "#cdbb80", fontSize: 12, fontWeight: 950, marginRight: 2 }}>做事路径</span>
          {principles.map((item, index) => (
            <span key={item} style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#aaa", border: "1px solid #222", background: "rgba(0,0,0,0.22)", borderRadius: 999, padding: "6px 9px", fontSize: 11, fontWeight: 850 }}>
              <span style={{ color: "#e8c96a", fontFamily: "'JetBrains Mono',monospace", fontSize: 10 }}>0{index + 1}</span>
              {item}
            </span>
          ))}
        </section>

        <details style={{ border: "1px solid #1a1a1a", background: "rgba(255,255,255,0.024)", borderRadius: 10, padding: "13px 14px", marginBottom: 18 }}>
          <summary style={{ color: "#e8c96a", fontSize: 13, fontWeight: 950, cursor: "pointer" }}>想自己挑任务？展开全部方向</summary>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 8, marginTop: 12 }} className="start-mission-list">
            {missions.map((mission) => {
              const active = mission.id === selected.id
              const missionProgress = getStoredMission(progress, mission.id)
              const missionDoneSteps = mission.steps.filter((_, index) => missionProgress.completedSteps[index]).length
              return (
                <button
                  key={mission.id}
                  type="button"
                  onClick={() => chooseMission(mission.id)}
                  style={{
                    textAlign: "left",
                    border: active ? "1px solid #8c7333" : "1px solid #1a1a1a",
                    background: active ? "rgba(201,168,76,0.08)" : "rgba(255,255,255,0.026)",
                    borderRadius: 10,
                    padding: "11px 12px",
                    minHeight: 78,
                    cursor: "pointer",
                  }}
                >
                  <h3 style={{ color: "#fff", fontSize: 13, fontWeight: 950, lineHeight: 1.45, marginBottom: 5 }}>{mission.shortTitle}</h3>
                  <p style={{ color: active ? "#cfcfcf" : "#8f8f8f", fontSize: 11, lineHeight: 1.55, marginBottom: 8, display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{mission.tagline}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8, borderTop: "1px solid #202020", paddingTop: 8 }}>
                    <span style={{ color: "#cdbb80", fontSize: 11, fontWeight: 900 }}>{missionDoneSteps}/{mission.steps.length} 步</span>
                    <span style={{ color: "#777", fontSize: 11, fontWeight: 900 }}>{mission.minutes}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </details>

        <section style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 300px", gap: 18, alignItems: "start", marginBottom: 44 }} className="start-workspace">
          <aside id="start-current-step" style={{ border: "1px solid #2a1f10", background: "linear-gradient(180deg,rgba(201,168,76,0.08),rgba(255,255,255,0.025))", borderRadius: 12, padding: "22px 24px", minHeight: 520 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
              <div>
                <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.18em", color: "#7a6230", fontWeight: 950, marginBottom: 6 }}>NEXT ACTION</p>
                <h2 style={{ color: "#fff", fontSize: 23, fontWeight: 950, lineHeight: 1.35 }}>{selected.shortTitle}</h2>
              </div>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#e8c96a", fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 950 }}>
                <Trophy size={15} /> +{selected.xp}XP
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 8, marginBottom: 16 }} className="max-sm:grid-cols-1">
              <Info label="阶段" value={selected.stage} />
              <Info label="难度" value={selected.difficulty} />
              <Info label="进度" value={`${doneSteps}/${selected.steps.length}`} />
            </div>

            <div style={{ border: "1px solid #242424", borderRadius: 10, padding: "15px 16px", background: "rgba(0,0,0,0.28)", marginBottom: 14 }}>
              <p style={{ color: "#888", fontSize: 11, fontWeight: 950, marginBottom: 7 }}>现在只做这一件事</p>
              <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 950, lineHeight: 1.5, marginBottom: 7 }}>{selectedProgress.completed ? "发一篇复盘，沉淀你的做法" : currentStep.title}</h3>
              <p style={{ color: "#bbb", fontSize: 13, lineHeight: 1.75, marginBottom: 10 }}>{selectedProgress.completed ? "这条任务已经跑完，下一步最值钱的是把踩坑和成果写出来。" : currentStep.action}</p>
              <p style={{ color: "#cdbb80", fontSize: 12, lineHeight: 1.65 }}>交付物：{selectedProgress.completed ? selected.recapTemplate.split("\n")[0] : currentStep.deliverable}</p>
            </div>

            <div style={{ border: "1px solid #242424", borderRadius: 10, padding: "14px 15px", background: "rgba(0,0,0,0.28)", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 9 }}>
                <p style={{ color: "#fff", fontSize: 13, fontWeight: 950 }}>复制当前步骤提示词</p>
                <button type="button" onClick={() => copyText("prompt", currentStep.prompt)} style={miniButtonStyle}>
                  {copied === "prompt" ? <Check size={13} /> : <Clipboard size={13} />} {copied === "prompt" ? "已复制" : "复制"}
                </button>
              </div>
              <p style={{ color: "#bbb", fontSize: 12, lineHeight: 1.8, whiteSpace: "pre-line" }}>{currentStep.prompt}</p>
            </div>

            <div style={{ border: "1px solid #29351f", borderRadius: 10, padding: "14px 15px", background: "rgba(61,165,99,0.06)", marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "start", marginBottom: 10 }}>
                <div>
                  <p style={{ color: "#fff", fontSize: 13, fontWeight: 950, marginBottom: 5 }}>完成判定</p>
                  <p style={{ color: "#9fcfaf", fontSize: 12, lineHeight: 1.65 }}>{proofRequirement.label}</p>
                </div>
                <span style={{ color: proofReady ? "#3DA563" : "#888", fontSize: 11, fontWeight: 950, whiteSpace: "nowrap" }}>{proofReady ? "可完成" : "待证明"}</span>
              </div>
              <div style={{ display: "grid", gap: 7, marginBottom: proofRequirement.minLength > 0 ? 10 : 0 }}>
                {proofRequirement.proofItems.map((item, index) => (
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
              {proofRequirement.minLength > 0 && (
                <textarea
                  value={proofText}
                  onChange={(event) => setProofText(event.target.value)}
                  placeholder={proofRequirement.placeholder || "粘贴一句结果、文件名、链接或你生成出来的关键内容。"}
                  rows={3}
                  style={{ width: "100%", resize: "vertical", border: "1px solid #28412e", background: "rgba(0,0,0,0.32)", color: "#e9f6ed", borderRadius: 10, padding: "10px 11px", fontSize: 12, lineHeight: 1.65, outline: "none" }}
                />
              )}
              {proofRequirement.screenshotRequired && (
                <div style={{ marginTop: 10, border: "1px solid #28412e", background: "rgba(0,0,0,0.24)", borderRadius: 10, padding: "10px 11px" }}>
                  <p style={{ color: "#d7f4df", fontSize: 12, fontWeight: 950, marginBottom: 6, display: "flex", alignItems: "center", gap: 7 }}>
                    <ImageIcon size={14} /> 截图证明
                  </p>
                  <p style={{ color: "#9fcfaf", fontSize: 12, lineHeight: 1.6, marginBottom: 9 }}>{proofRequirement.screenshotHint || "上传一张能看出完成结果的截图。"}</p>
                  <label style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid #3b5f43", background: "rgba(61,165,99,0.09)", color: "#d7f4df", borderRadius: 8, padding: "8px 10px", fontSize: 12, fontWeight: 900, cursor: "pointer" }}>
                    <Upload size={14} /> {screenshotName ? "更换截图" : "上传截图"}
                    <input type="file" accept="image/*" onChange={(event) => handleScreenshot(event.target.files?.[0])} style={{ display: "none" }} />
                  </label>
                  {screenshotName && <p style={{ color: "#8fd6a0", fontSize: 11, marginTop: 8 }}>已保存截图：{screenshotName}</p>}
                  {screenshotError && <p style={{ color: "#ff9b9b", fontSize: 11, marginTop: 8 }}>{screenshotError}</p>}
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button type="button" onClick={finishCurrentStep} disabled={!proofReady} className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 8, opacity: proofReady ? 1 : 0.48, cursor: proofReady ? "pointer" : "not-allowed" }}>
                完成这一步 <CheckCircle2 size={14} />
              </button>
              <button type="button" onClick={switchRandomMission} className="btn-outline" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <Shuffle size={14} /> 换任务
              </button>
              <button type="button" onClick={skipCurrentDirection} className="btn-outline" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <SkipForward size={14} /> 跳过方向
              </button>
              <Link href={`/missions/${selected.id}`} className="btn-outline" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
                打开任务详情 <ArrowRight size={14} />
              </Link>
              <button type="button" onClick={() => copyText("recap", selected.recapTemplate)} className="btn-outline" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                {copied === "recap" ? <Check size={14} /> : <MessageCircle size={14} />} 复制复盘
              </button>
            </div>
          </aside>

          <div style={{ display: "grid", gap: 14 }}>
            <section style={{ border: "1px solid #1a1a1a", background: "rgba(255,255,255,0.026)", borderRadius: 12, padding: "18px 20px" }}>
              <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 950, marginBottom: 8 }}>这一关为什么要做</h2>
              <p style={{ color: "#bbb", fontSize: 13, lineHeight: 1.85, marginBottom: 12 }}>{selected.whyNow}</p>
              <p style={{ color: "#cdbb80", fontSize: 12, lineHeight: 1.75 }}>最终产出：{selected.outcome}</p>
            </section>
            <section style={{ border: "1px solid #1a1a1a", background: "rgba(255,255,255,0.026)", borderRadius: 12, padding: "18px 20px" }}>
              <TaskBlock title="准备材料" items={selected.materials} />
            </section>
            <section style={{ border: "1px solid #2a1f10", background: "rgba(201,168,76,0.04)", borderRadius: 12, padding: "18px 20px" }}>
              <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 950, marginBottom: 8 }}>第一个任务之后不会没事做</h2>
              <p style={{ color: "#bbb", fontSize: 13, lineHeight: 1.85, marginBottom: 12 }}>
                完成第一步后，继续做需求单、生成初稿、检查事实、改掉空话、导出复盘；完整通关后会进入长文档分析、内容流水线、知识库 Bot、自动化和工程 Agent。学习主线会按产物解锁下一段。
              </p>
              <Link href="/learn" className="btn-outline" style={{ textDecoration: "none", display: "inline-flex" }}>查看深度学习主线</Link>
            </section>
          </div>
        </section>

        <section style={{ border: "1px solid #2a1f10", background: "rgba(201,168,76,0.04)", borderRadius: 12, padding: "24px 26px" }}>
          <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 950, marginBottom: 10 }}>做完第一个环节以后</h2>
          <p style={{ color: "#ccc", fontSize: 14, lineHeight: 1.9, marginBottom: 16 }}>
            回到学习路径补对应能力：不会提问就补 L1，不会搭流程就补 L3，不懂 API 和模型名就补 L4，想让 AI 改代码就补 L5。学习不是目的，推进你想做成的事才是目的。
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href="/missions" className="btn-primary" style={{ textDecoration: "none" }}>查看全部实战任务</Link>
            <Link href="/learn" className="btn-outline" style={{ textDecoration: "none" }}>回到学习主线</Link>
            <Link href="/community/new" className="btn-outline" style={{ textDecoration: "none" }}>发我的0-1复盘</Link>
          </div>
        </section>

        <style>{`
          .start-mission-list::-webkit-scrollbar {
            width: 6px;
          }
          .start-mission-list::-webkit-scrollbar-thumb {
            background: #2a2a2a;
            border-radius: 999px;
          }
          .start-mission-list::-webkit-scrollbar-track {
            background: rgba(255,255,255,0.03);
          }
          @media (max-width: 980px) {
            .start-workspace,
            .start-goal-grid {
              grid-template-columns: 1fr !important;
            }
          }
          @media (max-width: 640px) {
            .max-sm\\:grid-cols-1 {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
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

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ border: "1px solid #242424", borderRadius: 8, padding: "10px 12px", background: "rgba(0,0,0,0.22)" }}>
      <p style={{ color: "#777", fontSize: 11, fontWeight: 900, marginBottom: 4 }}>{label}</p>
      <p style={{ color: "#ddd", fontSize: 12, fontWeight: 900, lineHeight: 1.45 }}>{value}</p>
    </div>
  )
}

function TaskBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p style={{ color: "#888", fontSize: 11, fontWeight: 950, marginBottom: 7 }}>{title}</p>
      <div style={{ display: "grid", gap: 7 }}>
        {items.map((item) => (
          <div key={item} style={{ display: "grid", gridTemplateColumns: "18px 1fr", gap: 8, alignItems: "start" }}>
            <span style={{ width: 18, height: 18, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", background: "rgba(201,168,76,0.1)", color: "#e8c96a", marginTop: 1 }}>
              <Check size={11} />
            </span>
            <span style={{ color: "#ddd", fontSize: 12, lineHeight: 1.65 }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
