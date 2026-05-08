"use client"

import { useEffect, useMemo, useState } from "react"
import type { CSSProperties } from "react"
import Link from "next/link"
import { ArrowRight, Check, CheckCircle2, Clipboard, Flag, MessageCircle, Route, Sparkles, Trophy } from "lucide-react"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"
import { missions } from "@/data/missions"
import {
  currentStepLabel,
  getStoredMission,
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

const goalMissionMap: { keywords: string[]; missionId: string }[] = [
  { keywords: ["写文章", "文章", "小红书", "内容", "做视频", "视频", "做图片", "图片", "封面"], missionId: "xiaohongshu-ai-content-loop" },
  { keywords: ["ppt", "PPT", "做PPT", "做 PPT", "演示", "幻灯片", "汇报"], missionId: "ai-ppt-first-deck" },
  { keywords: ["办公", "文档", "资料", "总结", "分析"], missionId: "kimi-k26-long-doc" },
  { keywords: ["编程", "代码", "开发", "小功能"], missionId: "codex-small-feature" },
  { keywords: ["claude", "Claude", "deepseek", "DeepSeek", "工程"], missionId: "claude-code-deepseek-project" },
  { keywords: ["agent", "Agent", "知识库", "客服", "店铺", "公司"], missionId: "dify-knowledge-base-bot" },
  { keywords: ["自动化", "n8n", "日报", "提醒"], missionId: "n8n-ai-news-automation" },
]

function missionFromGoalParam(goal: string | null) {
  if (!goal) return null
  const decoded = goal.trim()
  return goalMissionMap.find((item) => item.keywords.some((keyword) => decoded.includes(keyword)))?.missionId || null
}

export function StartClient() {
  const [progress, setProgress] = useState<MissionProgressState>(() => ({ activeMissionId: missions[0].id, missions: {} }))
  const [selectedId, setSelectedId] = useState(missions[0].id)
  const [copied, setCopied] = useState<"prompt" | "recap" | null>(null)

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
  const activeMission = missions.find((mission) => mission.id === progress.activeMissionId) ?? selected
  const activeProgress = getStoredMission(progress, activeMission.id)
  const activeStep = currentStepLabel(activeMission.id, Math.min(activeProgress.currentStep || 0, activeMission.steps.length - 1))
  const doneSteps = selected.steps.filter((_, index) => selectedProgress.completedSteps[index]).length

  function persist(next: MissionProgressState) {
    setProgress(next)
    writeMissionProgress(next)
  }

  function chooseMission(id: string) {
    setSelectedId(id)
    persist(selectMission(progress, id))
  }

  function finishCurrentStep() {
    persist(markMissionStepDone(progress, selected.id, currentStepIndex, selected.steps.length))
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

  return (
    <div style={{ background: "#000", minHeight: "100vh", fontFamily: "'Noto Sans SC', sans-serif", position: "relative", overflow: "hidden" }}>
      <MathRain />
      <NavBar />
      <main style={{ maxWidth: 1120, margin: "0 auto", padding: "64px clamp(16px,5vw,60px) 104px", position: "relative", zIndex: 10, background: "rgba(0,0,0,0.9)" }}>
        <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.34em", color: "#7a6230", textTransform: "uppercase", marginBottom: 12, fontWeight: 900 }}>Start From 0 To 1</p>
        <h1 style={{ fontSize: 42, color: "#fff", fontWeight: 950, lineHeight: 1.22, marginBottom: 14 }}>你现在最想用 AI 做成什么事？</h1>
        <p style={{ fontSize: 16, color: "#ccc", lineHeight: 1.9, maxWidth: 880, marginBottom: 24 }}>
          不要从“选哪个工具”开始。先说你想做成什么事。就算现在的工具还不能帮你做完整件事，我们也可以先做好其中一个环节，这就是从 0 到 1 的开始。
        </p>

        <section style={{ border: "1px solid #2a1f10", background: "rgba(201,168,76,0.055)", borderRadius: 12, padding: "18px 20px", marginBottom: 30, display: "grid", gridTemplateColumns: "1fr auto", gap: 14, alignItems: "center" }} className="max-sm:grid-cols-1">
          <div>
            <p style={{ color: "#e8c96a", fontSize: 13, fontWeight: 950, marginBottom: 6 }}>小白记得你上次做到这里</p>
            <p style={{ color: "#ddd", fontSize: 14, lineHeight: 1.8 }}>
              当前任务：<b>{activeMission.shortTitle}</b>。下一步建议：<b>{activeProgress.completed ? "发复盘，把经验沉淀下来" : activeStep}</b>。
            </p>
          </div>
          <Link href={`/missions/${activeMission.id}`} className="btn-primary" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
            继续上次任务 <ArrowRight size={14} />
          </Link>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,190px),1fr))", gap: 12, marginBottom: 38 }}>
          {principles.map((item, index) => (
            <div key={item} style={{ border: "1px solid #1a1a1a", background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "18px 20px" }}>
              <div style={{ color: "#e8c96a", marginBottom: 10 }}>{index === 0 ? <Flag size={18} /> : index === 1 ? <Route size={18} /> : index === 2 ? <CheckCircle2 size={18} /> : <Sparkles size={18} />}</div>
              <p style={{ color: "#ddd", fontSize: 13, lineHeight: 1.8, fontWeight: 850 }}>{item}</p>
            </div>
          ))}
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,320px),1fr))", gap: 18, alignItems: "start", marginBottom: 44 }}>
          <div>
            <div style={{ marginBottom: 16 }}>
              <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 950, marginBottom: 7 }}>选一个你真正想推进的方向</h2>
              <p style={{ color: "#aaa", fontSize: 14, lineHeight: 1.8 }}>任务不会按工具堆砌，而是按“今天能交付什么”来组织。</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,240px),1fr))", gap: 10 }}>
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
                      padding: "17px 18px",
                      minHeight: 214,
                      cursor: "pointer",
                    }}
                  >
                    <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 950, lineHeight: 1.45, marginBottom: 8 }}>{mission.title}</h3>
                    <p style={{ color: "#bbb", fontSize: 12, lineHeight: 1.7, marginBottom: 10 }}>{mission.tagline}</p>
                    <p style={{ color: "#888", fontSize: 11, lineHeight: 1.65, marginBottom: 9 }}>{mission.audience}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8, borderTop: "1px solid #242424", paddingTop: 10 }}>
                      <span style={{ color: "#cdbb80", fontSize: 11, fontWeight: 900 }}>{missionDoneSteps}/{mission.steps.length} 步</span>
                      <span style={{ color: "#777", fontSize: 11, fontWeight: 900 }}>{mission.minutes}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <aside style={{ border: "1px solid #2a1f10", background: "linear-gradient(180deg,rgba(201,168,76,0.08),rgba(255,255,255,0.025))", borderRadius: 12, padding: "22px 24px", position: "sticky", top: 18 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
              <div>
                <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.18em", color: "#7a6230", fontWeight: 950, marginBottom: 6 }}>TODAY 0-1 QUEST</p>
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
              <p style={{ color: "#888", fontSize: 11, fontWeight: 950, marginBottom: 7 }}>小白建议你现在做</p>
              <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 950, lineHeight: 1.5, marginBottom: 7 }}>{selectedProgress.completed ? "发一篇复盘，沉淀你的做法" : currentStep.title}</h3>
              <p style={{ color: "#bbb", fontSize: 13, lineHeight: 1.75, marginBottom: 10 }}>{selectedProgress.completed ? "这条任务已经跑完，下一步最值钱的是把踩坑和成果写出来。" : currentStep.desc}</p>
              <p style={{ color: "#cdbb80", fontSize: 12, lineHeight: 1.65 }}>交付物：{selectedProgress.completed ? selected.recapTemplate.split("\n")[0] : currentStep.deliverable}</p>
            </div>

            <TaskBlock title="准备材料" items={selected.materials} />

            <div style={{ border: "1px solid #242424", borderRadius: 10, padding: "14px 15px", background: "rgba(0,0,0,0.28)", marginTop: 14, marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 9 }}>
                <p style={{ color: "#fff", fontSize: 13, fontWeight: 950 }}>复制当前步骤提示词</p>
                <button type="button" onClick={() => copyText("prompt", currentStep.prompt)} style={miniButtonStyle}>
                  {copied === "prompt" ? <Check size={13} /> : <Clipboard size={13} />} {copied === "prompt" ? "已复制" : "复制"}
                </button>
              </div>
              <p style={{ color: "#bbb", fontSize: 12, lineHeight: 1.8 }}>{currentStep.prompt}</p>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button type="button" onClick={finishCurrentStep} className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                完成这一步 <CheckCircle2 size={14} />
              </button>
              <Link href={`/missions/${selected.id}`} className="btn-outline" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
                打开任务详情 <ArrowRight size={14} />
              </Link>
              <button type="button" onClick={() => copyText("recap", selected.recapTemplate)} className="btn-outline" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                {copied === "recap" ? <Check size={14} /> : <MessageCircle size={14} />} 复制复盘
              </button>
            </div>
          </aside>
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
