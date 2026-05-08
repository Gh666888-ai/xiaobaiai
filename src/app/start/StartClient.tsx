"use client"

import { useEffect, useMemo, useState } from "react"
import type { CSSProperties } from "react"
import Link from "next/link"
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clipboard,
  Image as ImageIcon,
  MessageCircle,
  Shuffle,
  SkipForward,
  Upload,
} from "lucide-react"
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

const starterChoices = [
  { label: "不知道，从最简单开始", desc: "先做一个能看的 6 页 PPT 初稿。", goal: "做PPT" },
  { label: "我手里有资料", desc: "让 AI 读资料，列摘要和下一步。", goal: "办公" },
  { label: "我想做内容", desc: "先写一条能发的草稿。", goal: "写文章" },
]

const moreGoals = [
  { label: "做动漫样片", desc: "60 秒剧情、分镜和角色提示词。", goal: "动漫漫剧" },
  { label: "写故事样章", desc: "设定、大纲、正文和审稿。", goal: "网文故事" },
  { label: "给 AI 加技能", desc: "找 Skill，先做安全检查。", goal: "找Skill" },
  { label: "本地跑模型", desc: "Ollama / LM Studio 首次跑通。", goal: "本地模型" },
  { label: "行业配 Skill", desc: "给一个行业场景选 3 个能力。", goal: "行业技能" },
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

  function chooseGoal(goal: string) {
    chooseMission(missionFromGoalParam(goal) || missions[0].id)
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
    <div style={{ background: "#050505", minHeight: "100vh", fontFamily: "'Noto Sans SC', sans-serif", position: "relative" }}>
      <NavBar />
      <main style={mainStyle}>
        <section style={focusCardStyle}>
          <p style={eyebrowStyle}>小白入口</p>
          <h1 style={heroTitleStyle}>{selectedProgress.completed ? "这条做完了，发个复盘" : "先做这一个小结果"}</h1>
          <p style={heroCopyStyle}>不用先选工具，也不用先看一堆教程。现在只看下面这一句，照着做完再回来点确认。</p>

          <div style={currentTaskStyle}>
            <p style={microLabelStyle}>推荐任务</p>
            <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 950, lineHeight: 1.35, marginBottom: 12 }}>{selected.shortTitle}</h2>
            <div style={stepBoxStyle}>
              <p style={{ color: "#e8c96a", fontSize: 12, fontWeight: 950, marginBottom: 7 }}>现在只做</p>
              <p style={{ color: "#fff", fontSize: 17, lineHeight: 1.85, fontWeight: 950 }}>
                {selectedProgress.completed ? "复制复盘模板，把这次结果发出去。" : currentStep.action}
              </p>
            </div>
            <p style={{ color: "#cdbb80", fontSize: 13, lineHeight: 1.7, marginTop: 12 }}>
              做完你应该有：{selectedProgress.completed ? selected.recapTemplate.split("\n")[0] : currentStep.deliverable}
            </p>
          </div>

          <div style={heroActionRowStyle}>
            {selectedProgress.completed ? (
              <button type="button" onClick={() => copyText("recap", selected.recapTemplate)} className="btn-primary" style={primaryActionStyle}>
                {copied === "recap" ? <Check size={16} /> : <MessageCircle size={16} />} {copied === "recap" ? "已复制" : "复制复盘"}
              </button>
            ) : (
              <a href="#proof-check" className="btn-primary" style={primaryActionStyle}>
                做完了，去确认 <ArrowRight size={16} />
              </a>
            )}
            <button type="button" onClick={switchRandomMission} className="btn-outline" style={secondaryActionStyle}>
              <Shuffle size={14} /> 换一个
            </button>
          </div>
        </section>

        {!selectedProgress.completed && (
          <details id="prompt" style={detailsStyle}>
            <summary style={summaryStyle}>不知道怎么让 AI 做，展开复制提示词</summary>
            <div style={{ marginTop: 12 }}>
              <button type="button" onClick={() => copyText("prompt", currentStep.prompt)} style={miniButtonStyle}>
                {copied === "prompt" ? <Check size={13} /> : <Clipboard size={13} />} {copied === "prompt" ? "已复制" : "复制提示词"}
              </button>
              <p style={{ color: "#bbb", fontSize: 12, lineHeight: 1.8, whiteSpace: "pre-line", marginTop: 10 }}>{currentStep.prompt}</p>
            </div>
          </details>
        )}

        {!selectedProgress.completed && (
          <section id="proof-check" style={proofCardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "start", marginBottom: 12 }}>
              <div>
                <p style={{ color: "#fff", fontSize: 17, fontWeight: 950, marginBottom: 6 }}>做完后这样确认</p>
                <p style={{ color: "#9fcfaf", fontSize: 12, lineHeight: 1.65 }}>{proofRequirement.label}</p>
              </div>
              <span style={{ color: proofReady ? "#3DA563" : "#888", fontSize: 11, fontWeight: 950, whiteSpace: "nowrap" }}>{proofReady ? "可以完成" : "还没完成"}</span>
            </div>
            <div style={{ display: "grid", gap: 8, marginBottom: proofRequirement.minLength > 0 ? 12 : 0 }}>
              {proofRequirement.proofItems.map((item, index) => (
                <label key={item} style={checkItemStyle}>
                  <input
                    type="checkbox"
                    checked={!!proofChecks[index]}
                    onChange={() => setProofChecks((prev) => {
                      const next = [...prev]
                      next[index] = !next[index]
                      return next
                    })}
                    style={{ width: 16, height: 16, marginTop: 2, accentColor: "#3DA563" }}
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
                style={textareaStyle}
              />
            )}
            {proofRequirement.screenshotRequired && (
              <div style={{ marginTop: 10, border: "1px solid #28412e", background: "rgba(0,0,0,0.24)", borderRadius: 10, padding: "10px 11px" }}>
                <p style={{ color: "#d7f4df", fontSize: 12, fontWeight: 950, marginBottom: 6, display: "flex", alignItems: "center", gap: 7 }}>
                  <ImageIcon size={14} /> 截图证明
                </p>
                <p style={{ color: "#9fcfaf", fontSize: 12, lineHeight: 1.6, marginBottom: 9 }}>{proofRequirement.screenshotHint || "上传一张能看出完成结果的截图。"}</p>
                <label style={uploadLabelStyle}>
                  <Upload size={14} /> {screenshotName ? "更换截图" : "上传截图"}
                  <input type="file" accept="image/*" onChange={(event) => handleScreenshot(event.target.files?.[0])} style={{ display: "none" }} />
                </label>
                {screenshotName && <p style={{ color: "#8fd6a0", fontSize: 11, marginTop: 8 }}>已保存截图：{screenshotName}</p>}
                {screenshotError && <p style={{ color: "#ff9b9b", fontSize: 11, marginTop: 8 }}>{screenshotError}</p>}
              </div>
            )}
            <button type="button" onClick={finishCurrentStep} disabled={!proofReady} className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 14, opacity: proofReady ? 1 : 0.48, cursor: proofReady ? "pointer" : "not-allowed" }}>
              完成这一步 <CheckCircle2 size={14} />
            </button>
          </section>
        )}

        {selectedProgress.completed && (
          <section style={proofCardStyle}>
            <p style={{ color: "#fff", fontSize: 17, fontWeight: 950, marginBottom: 8 }}>最后一步：把经验留下来</p>
            <p style={{ color: "#aaa", fontSize: 13, lineHeight: 1.8, marginBottom: 14 }}>复盘不是炫耀，是给下次的自己省时间。复制模板，简单写几句就行。</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button type="button" onClick={() => copyText("recap", selected.recapTemplate)} className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                {copied === "recap" ? <Check size={14} /> : <MessageCircle size={14} />} 复制复盘
              </button>
              <Link href="/community/new" className="btn-outline" style={{ textDecoration: "none" }}>去发复盘</Link>
            </div>
          </section>
        )}

        <details style={detailsStyle}>
          <summary style={summaryStyle}>不是这个？换个方向</summary>
          <div style={choiceGridStyle}>
            {[...starterChoices, ...moreGoals].map((item) => {
              const active = missionFromGoalParam(item.goal) === selected.id
              return (
                <button key={item.label} type="button" onClick={() => chooseGoal(item.goal)} style={choiceButtonStyle(active)}>
                  <span style={{ color: active ? "#e8c96a" : "#fff", fontSize: 13, fontWeight: 950, lineHeight: 1.4 }}>{item.label}</span>
                  <span style={{ color: "#999", fontSize: 12, lineHeight: 1.55, marginTop: 5 }}>{item.desc}</span>
                </button>
              )
            })}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
            <button type="button" onClick={switchRandomMission} className="btn-outline" style={smallActionStyle}>
              <Shuffle size={14} /> 随机换一个
            </button>
            <button type="button" onClick={skipCurrentDirection} className="btn-outline" style={smallActionStyle}>
              <SkipForward size={14} /> 跳过这个方向
            </button>
          </div>
        </details>

        <details style={detailsStyle}>
          <summary style={summaryStyle}>想自己挑完整任务库</summary>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 8, marginTop: 12 }}>
            {missions.map((mission) => (
              <button key={mission.id} type="button" onClick={() => chooseMission(mission.id)} style={compactChoiceStyle}>
                <span style={{ color: "#fff", fontSize: 12, fontWeight: 950 }}>{mission.shortTitle}</span>
                <span style={{ color: "#888", fontSize: 11, lineHeight: 1.5 }}>{mission.minutes} · {mission.difficulty}</span>
              </button>
            ))}
          </div>
          <Link href={`/missions/${selected.id}`} className="btn-outline" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, marginTop: 12 }}>
            打开当前任务详情 <ArrowRight size={14} />
          </Link>
        </details>

        <style>{`
          @media (max-width: 720px) {
            .btn-primary,
            .btn-outline {
              width: 100%;
              justify-content: center;
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

function choiceButtonStyle(active: boolean): CSSProperties {
  return {
    textAlign: "left",
    border: active ? "1px solid #8c7333" : "1px solid #202020",
    background: active ? "rgba(201,168,76,0.075)" : "rgba(255,255,255,0.025)",
    borderRadius: 10,
    padding: "15px 14px",
    minHeight: 96,
    display: "flex",
    flexDirection: "column",
    cursor: "pointer",
  }
}

const mainStyle: CSSProperties = {
  maxWidth: 780,
  margin: "0 auto",
  padding: "52px clamp(16px,5vw,44px) 96px",
}

const focusCardStyle: CSSProperties = {
  border: "1px solid #2a1f10",
  background: "rgba(12,12,12,0.97)",
  borderRadius: 12,
  padding: "30px clamp(18px,5vw,38px)",
  marginBottom: 12,
}

const eyebrowStyle: CSSProperties = {
  fontFamily: "'JetBrains Mono',monospace",
  fontSize: 10,
  letterSpacing: "0.22em",
  color: "#7a6230",
  textTransform: "uppercase",
  marginBottom: 8,
  fontWeight: 950,
}

const heroTitleStyle: CSSProperties = {
  color: "#fff",
  fontSize: "clamp(34px,7vw,58px)",
  fontWeight: 950,
  lineHeight: 1.08,
  marginBottom: 12,
}

const heroCopyStyle: CSSProperties = {
  color: "#cfcfcf",
  fontSize: 16,
  lineHeight: 1.85,
  maxWidth: 620,
  marginBottom: 22,
}

const currentTaskStyle: CSSProperties = {
  border: "1px solid #302711",
  background: "rgba(201,168,76,0.055)",
  borderRadius: 10,
  padding: "17px 18px",
}

const microLabelStyle: CSSProperties = {
  color: "#e8c96a",
  fontSize: 12,
  fontWeight: 950,
  marginBottom: 6,
}

const stepBoxStyle: CSSProperties = {
  border: "1px solid #242424",
  background: "rgba(0,0,0,0.22)",
  borderRadius: 10,
  padding: "14px 15px",
}

const heroActionRowStyle: CSSProperties = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  marginTop: 18,
}

const primaryActionStyle: CSSProperties = {
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  minHeight: 50,
  padding: "0 20px",
}

const secondaryActionStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  minHeight: 50,
}

const smallActionStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  minHeight: 40,
}

const compactChoiceStyle: CSSProperties = {
  textAlign: "left",
  border: "1px solid #202020",
  background: "rgba(255,255,255,0.025)",
  borderRadius: 9,
  padding: "11px 12px",
  minHeight: 70,
  display: "grid",
  gap: 5,
  cursor: "pointer",
}

const detailsStyle: CSSProperties = {
  border: "1px solid #1f1f1f",
  background: "rgba(12,12,12,0.9)",
  borderRadius: 10,
  padding: "13px 14px",
  marginTop: 12,
}

const summaryStyle: CSSProperties = {
  color: "#e8c96a",
  fontSize: 13,
  fontWeight: 950,
  cursor: "pointer",
}

const proofCardStyle: CSSProperties = {
  border: "1px solid #29351f",
  background: "rgba(61,165,99,0.06)",
  borderRadius: 12,
  padding: "17px clamp(14px,4vw,18px)",
  marginTop: 12,
}

const checkItemStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "20px 1fr",
  gap: 9,
  alignItems: "start",
  color: "#cfcfcf",
  fontSize: 13,
  lineHeight: 1.6,
  cursor: "pointer",
}

const choiceGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
  gap: 8,
  marginTop: 12,
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

const textareaStyle: CSSProperties = {
  width: "100%",
  resize: "vertical",
  border: "1px solid #28412e",
  background: "rgba(0,0,0,0.32)",
  color: "#e9f6ed",
  borderRadius: 10,
  padding: "10px 11px",
  fontSize: 12,
  lineHeight: 1.65,
  outline: "none",
}

const uploadLabelStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  border: "1px solid #3b5f43",
  background: "rgba(61,165,99,0.09)",
  color: "#d7f4df",
  borderRadius: 8,
  padding: "8px 10px",
  fontSize: 12,
  fontWeight: 900,
  cursor: "pointer",
}
