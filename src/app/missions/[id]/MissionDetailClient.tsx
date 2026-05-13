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
  Lock,
  MessageCircle,
  Sparkles,
  Trophy,
} from "lucide-react"
import { NavBar } from "@/components/NavBar"
import { missions, type Mission, type MissionStep } from "@/data/missions"
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

function buildMissionPlaybook(mission: Mission) {
  const firstStep = mission.steps[0]
  const finalStep = mission.steps[mission.steps.length - 1]
  const missionText = `${mission.id} ${mission.title} ${mission.tagline} ${mission.tags.join(" ")}`.toLowerCase()

  let scenario = "把这关当成一次真实交付，不是看完教程。先用自己的材料跑一遍，再决定要不要换工具或升级自动化。"
  let mvp = mission.outcome
  let validation = [
    "能看到一个明确交付物",
    "知道结果哪里能用、哪里要人工修改",
    "遇到失败时能用修复提示词再跑一版",
    "最后能写出复盘，下一次可以复用",
  ]
  let next = "做完以后先复盘，再进入下一关，不要只收藏工具。"

  if (mission.id === "industry-skill-stack-plan") {
    scenario = "把行业 Skill 配置当成一个业务能力方案。先选一个行业、一个岗位、一个重复流程，再配 3 个最小可用 Skill。"
    validation = ["行业和岗位明确", "3 个 Skill 各有职责", "权限和禁区写清楚", "能用脱敏样例完成一次验证"]
    next = "下一步用真实但脱敏的业务样例跑一次，再决定是否扩展更多 Skill。"
  } else if (mission.id === "agent-skill-first-install") {
    scenario = "把 Skill 安装当成一次最小能力验证。先装一个、测一个、记一个边界，不追求一次装满。"
    validation = ["知道 Skill 负责什么", "知道它需要什么权限", "能跑通一个测试动作", "知道哪些数据不能交给它"]
    next = "下一步把能用的 Skill 写进自己的 Agent 使用规则，再进入行业或项目任务。"
  } else if (/ppt|汇报|deck/.test(missionText)) {
    scenario = "把 AI PPT 当成一次真实汇报训练。先生成 6 页初稿，再检查事实、结构和演讲备注。"
    validation = ["6 页结构完整", "每页标题能看懂", "没有乱编关键数据", "演讲备注能帮助你讲出来"]
    next = "下一步把这套验收标准迁移到工作汇报、课程展示或客户方案。"
  } else if (/website|网页|建站|game|游戏/.test(missionText)) {
    scenario = "把 AI 建站或小游戏当成一个可预览 MVP。先让页面能打开、按钮能点、核心动作能完成。"
    validation = ["页面能预览打开", "核心按钮或互动能用", "手机和电脑都能看", "知道下一版改内容还是改视觉"]
    next = "下一步再补行业文案、视觉细节或真实业务入口。"
  } else if (/doc|文档|kimi|资料/.test(missionText)) {
    scenario = "把长文档任务当成一次资料整理训练。重点不是摘要变短，而是事实、风险、待确认问题和行动清单分开。"
    validation = ["事实有来源", "风险单独列出", "待确认问题清楚", "下一步行动能执行"]
    next = "下一步把这套结构放进知识库、汇报或团队 SOP。"
  } else if (/content|小红书|内容|novel|webnovel|小说|comic|video|视频/.test(missionText)) {
    scenario = "把内容任务当成一条可发布样稿。第一版要有受众、主题、正文或分镜、素材提示和发布前检查。"
    validation = ["目标用户明确", "内容有真实细节", "素材或画面提示能复用", "发布前检查事实和版权"]
    next = "下一步发布或模拟发布，记录数据，再做第二版。"
  } else if (/dify|knowledge|bot|客服|知识库/.test(missionText)) {
    scenario = "把知识库任务当成一个客服 Bot MVP。先用 10 条资料和 5 个测试问题验证召回与转人工边界。"
    validation = ["资料有来源", "能答基础问题", "不知道时不会乱编", "转人工边界写清楚"]
    next = "下一步接更多真实问答，做一轮错误记录和知识库修订。"
  } else if (/n8n|automation|自动化|workflow/.test(missionText)) {
    scenario = "把自动化任务当成一个半自动流程。先跑通样例，不直接接真实客户或自动发送。"
    validation = ["触发、处理、输出完整", "有人工确认", "失败有提醒", "日志能追踪"]
    next = "下一步用真实但脱敏的数据跑一周，再决定是否全自动。"
  } else if (/agent|skill|codex|claude|mcp|code|模型|api/.test(missionText)) {
    scenario = "把 Agent/模型任务当成一个小范围能力验证。先读、先计划、再执行，最后用 diff、日志或测试结果验收。"
    validation = ["权限边界清楚", "没有泄露密钥", "改动或调用范围可控", "有验证命令或测试记录"]
    next = "下一步把这次配置和边界写成自己的 Agent 使用规则。"
  } else if (/industry|行业|门店|电商|销售|服务/.test(missionText)) {
    scenario = "把行业任务当成一个业务流程 MVP。只选一个岗位、一个流程、一个交付物先测。"
    validation = ["能说明省时或增收点", "有真实业务材料", "有人工验收边界", "本周能执行一次"]
    next = "下一步把结果写成案例，再决定是否做成团队流程。"
  }

  return {
    scenario,
    mvp,
    materials: mission.materials.length ? mission.materials : ["一个真实场景", "一份真实材料", "一个验收标准"],
    validation,
    repair: firstStep?.fixPrompt || firstStep?.troubleTips?.[0]?.fix || "结果不稳定时，不要换工具。先补真实背景、输出格式和验收标准，再让 AI 重做一版。",
    recap: finalStep?.deliverable || mission.recapTemplate.split("\n")[0] || "一份任务复盘",
    next,
  }
}

function buildExecutionChecklist(mission: Mission, playbook: ReturnType<typeof buildMissionPlaybook>) {
  const firstMaterial = playbook.materials.slice(0, 2).join("、") || "一个真实场景和一份真实材料"
  const firstValidation = playbook.validation[0] || "能看到明确交付物"
  const hasFixPrompt = mission.steps.some((step) => Boolean(step.fixPrompt))

  return [
    {
      title: "准备材料",
      text: firstMaterial,
    },
    {
      title: "复制提示词",
      text: "先跑出第一版结果，不在工具选择上卡住。",
    },
    {
      title: "按标准验收",
      text: firstValidation,
    },
    {
      title: "二次修复",
      text: hasFixPrompt ? "结果不好时直接用修复提示词再跑一版。" : "补充背景、格式和验收标准后再生成。",
    },
    {
      title: "保存复盘",
      text: playbook.recap,
    },
  ]
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
  const relatedCases = getCasePostsForMission(mission.id, posts).slice(0, 3)
  const userLevel = getUserLevel(user?.xp || 0)
  const nextLevel = getNextLevel(user?.xp || 0)
  const nextAfterMission = user ? getUserLevel((user.xp || 0) + mission.xp) : null
  const willLevelUp = !!user && !!nextAfterMission && nextAfterMission.level > userLevel.level
  const missionIndex = missions.findIndex((item) => item.id === mission.id)
  const nextMission = missionIndex >= 0 ? missions[(missionIndex + 1) % missions.length] : missions.find((item) => item.id !== mission.id)
  const missionPlaybook = useMemo(() => buildMissionPlaybook(mission), [mission])
  const executionChecklist = useMemo(() => buildExecutionChecklist(mission, missionPlaybook), [mission, missionPlaybook])

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
          ? `通关奖励到账：${data.awarded} XP。下一段建议：${nextMission?.shortTitle || "换一个任务继续做"}.`
          : `这条通关奖励已经领取过啦。下一段建议：${nextMission?.shortTitle || "换一个任务继续做"}.`,
      )
    } catch (error: any) {
      setNotice(error?.message || "领取失败，请稍后再试。")
    } finally {
      setClaiming(false)
    }
  }

  return (
    <div className="xb-workbench" style={{ background: "linear-gradient(180deg,#f6f9fc 0%,#eef4f8 100%)", minHeight: "100vh", fontFamily: "'Noto Sans SC', sans-serif", position: "relative", overflow: "visible" }}>
      <NavBar />
      <main className="xb-workbench-main" style={{ maxWidth: 1180, margin: "0 auto", padding: "58px clamp(16px,5vw,60px) 104px", position: "relative", zIndex: 10, background: "transparent" }}>
        <section style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 20, alignItems: "end", marginBottom: 24 }} className="mission-head">
          <div>
            <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.28em", color: "#7a6230", textTransform: "uppercase", marginBottom: 12, fontWeight: 900 }}>Guided Mission</p>
            <h1 style={{ fontSize: "clamp(30px,4.8vw,46px)", color: "#fff", fontWeight: 950, lineHeight: 1.2, marginBottom: 12 }}>{mission.title}</h1>
            <p style={{ fontSize: 15, color: "#cfcfcf", lineHeight: 1.85, maxWidth: 850 }}>{mission.tagline}</p>
          </div>
          <div style={{ minWidth: 190, border: "1px solid #2a1f10", background: "rgba(201,168,76,0.06)", borderRadius: 12, padding: "14px 16px" }}>
            <p style={{ color: "#999", fontSize: 13, fontWeight: 950, marginBottom: 7 }}>完整任务奖励</p>
            <p style={{ color: "#e8c96a", fontSize: 22, fontWeight: 950, marginBottom: 6 }}>+{mission.xp} XP</p>
            <p style={{ color: willLevelUp ? "#3DA563" : "#bbb", fontSize: 13, lineHeight: 1.65 }}>
              {willLevelUp ? `完成后可升到 ${nextAfterMission?.name}` : nextLevel ? `距离下一档还差 ${nextLevel.need} XP` : "你已到达当前最高等级"}
            </p>
          </div>
        </section>

        <section className="mission-depth-intro" style={depthIntroStyle}>
          <div>
            <p style={{ color: "#e8c96a", fontSize: 13, fontWeight: 950, marginBottom: 7 }}>这不是复制提示词教程</p>
            <p style={{ color: "#f2f2f2", fontSize: 18, fontWeight: 950, lineHeight: 1.65, marginBottom: 7 }}>
              这一关要练的是：跑通结果、看懂好坏、会二次修改、留下可复用经验。
            </p>
            <p style={{ color: "#aaa", fontSize: 14, lineHeight: 1.75 }}>
              小白会一次只放出当前小步。引导型任务不用上传截图，高阶独立交付任务才需要证据。
            </p>
          </div>
          <div style={depthRailStyle}>
            {["跑通", "验收", "迭代", "复盘"].map((item) => (
              <span key={item} style={depthRailItemStyle}>{item}</span>
            ))}
          </div>
        </section>

        <MissionExecutionStrip mission={mission} checklist={executionChecklist} />

        <section className="mission-mvp-playbook" style={missionPlaybookStyle}>
          <div>
            <p style={{ color: "#e8c96a", fontSize: 12, fontWeight: 950, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 9 }}>MISSION MVP PLAYBOOK</p>
            <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 950, lineHeight: 1.3, marginBottom: 8 }}>这一关最终要做到什么程度</h2>
            <p style={{ color: "#cfcfcf", fontSize: 14, lineHeight: 1.85 }}>{missionPlaybook.scenario}</p>
          </div>
          <div className="mission-mvp-grid" style={missionPlaybookGridStyle}>
            <div style={missionPlaybookCardStyle}>
              <strong style={missionPlaybookCardTitleStyle}>先做出的 MVP</strong>
              <p style={missionPlaybookTextStyle}>{missionPlaybook.mvp}</p>
            </div>
            <div style={missionPlaybookCardStyle}>
              <strong style={missionPlaybookCardTitleStyle}>需要准备</strong>
              <ul style={missionPlaybookListStyle}>
                {missionPlaybook.materials.slice(0, 4).map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <div style={missionPlaybookCardStyle}>
              <strong style={missionPlaybookCardTitleStyle}>怎么验收</strong>
              <ul style={missionPlaybookListStyle}>
                {missionPlaybook.validation.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <div style={missionPlaybookCardStyle}>
              <strong style={missionPlaybookCardTitleStyle}>失败时先修什么</strong>
              <p style={missionPlaybookTextStyle}>{missionPlaybook.repair}</p>
            </div>
            <div style={missionPlaybookCardStyle}>
              <strong style={missionPlaybookCardTitleStyle}>最后沉淀什么</strong>
              <p style={missionPlaybookTextStyle}>{missionPlaybook.recap}</p>
            </div>
            <div style={missionPlaybookCardStyle}>
              <strong style={missionPlaybookCardTitleStyle}>下一步</strong>
              <p style={missionPlaybookTextStyle}>{missionPlaybook.next}</p>
            </div>
          </div>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 16, alignItems: "start" }} className="mission-shell">
          <aside style={{ border: "1px solid #1a1a1a", background: "rgba(255,255,255,0.028)", borderRadius: 12, padding: 16, position: "sticky", top: 74 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
              <div>
                <p style={{ color: "#fff", fontSize: 15, fontWeight: 950, marginBottom: 5 }}>任务导图</p>
                <p style={{ color: "#999", fontSize: 13 }}>{doneSteps}/{mission.steps.length} 步完成</p>
              </div>
              <span style={{ color: "#e8c96a", fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 950 }}>{percent}%</span>
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
                    <span style={{ width: 27, height: 27, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", background: done ? "rgba(61,165,99,0.16)" : active ? "rgba(201,168,76,0.16)" : "#121212", color: done ? "#3DA563" : active ? "#e8c96a" : "#666", fontSize: 13, fontWeight: 950 }}>
                      {done ? <Check size={13} /> : active ? index + 1 : <Lock size={11} />}
                    </span>
                    <div>
                      <p style={{ color: done || active ? "#fff" : "#aaa", fontSize: 14, fontWeight: 950, lineHeight: 1.5 }}>{step.title}</p>
                      {active && <p style={{ color: "#cdbb80", fontSize: 12, marginTop: 5, fontWeight: 900 }}>当前正在做</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          </aside>

          <section style={{ display: "grid", gap: 14 }}>
            {current.completed ? (
              <CompleteCard mission={mission} nextMission={nextMission} onCopy={() => copyText("recap", mission.recapTemplate)} copied={copied === "recap"} onClaim={claimMissionXP} claiming={claiming} notice={notice} />
            ) : (
              <StepCard
                mission={mission}
                stepIndex={currentStepIndex}
                copied={copied}
                onCopy={copyText}
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
                      <p style={{ color: "#999", fontSize: 12 }}>{post.author} · {post.likes} 赞</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </section>
        </section>

        <style dangerouslySetInnerHTML={{ __html: `
          .xb-workbench {
            background: radial-gradient(circle at top left, rgba(37,109,133,0.08), transparent 34%), linear-gradient(180deg,#f6f9fc 0%,#eef4f8 100%) !important;
            color: #17202a !important;
          }
          .xb-workbench-main {
            background: transparent !important;
          }
          .xb-workbench-main > section,
          .xb-workbench-main > section > aside,
          .xb-workbench-main article,
          .xb-workbench-main details,
          .xb-workbench-main .mission-mvp-playbook,
          .xb-workbench-main .mission-depth-intro {
            border-color: #dfe7ee !important;
            background: rgba(255,255,255,0.94) !important;
            box-shadow: 0 16px 46px rgba(15,23,42,0.06) !important;
          }
          .xb-workbench-main .mission-shell > aside,
          .xb-workbench-main .mission-shell > section > section,
          .xb-workbench-main .mission-shell > section > div,
          .xb-workbench-main .mission-step-top + section,
          .xb-workbench-main .mission-step-top + section + section {
            border-color: #dfe7ee !important;
            background: #fff !important;
          }
          .xb-workbench-main h1,
          .xb-workbench-main h2,
          .xb-workbench-main h3,
          .xb-workbench-main p,
          .xb-workbench-main span,
          .xb-workbench-main strong,
          .xb-workbench-main li,
          .xb-workbench-main summary {
            color: #17202a !important;
          }
          .xb-workbench-main p[style*="#cfcfcf"],
          .xb-workbench-main p[style*="#aaa"],
          .xb-workbench-main p[style*="#999"],
          .xb-workbench-main span[style*="#999"],
          .xb-workbench-main span[style*="#aaa"] {
            color: #667586 !important;
          }
          .xb-workbench-main p[style*="#e8c96a"],
          .xb-workbench-main span[style*="#e8c96a"],
          .xb-workbench-main strong[style*="#e8c96a"] {
            color: #256d85 !important;
          }
          .xb-workbench-main a {
            color: #256d85 !important;
          }
          .xb-workbench-main button,
          .xb-workbench-main a[style*="border"] {
            border-color: #cfd9e3 !important;
            background: #fff !important;
            color: #17202a !important;
          }
          .xb-workbench-main button[style*="#17202a"],
          .xb-workbench-main button[style*="#c9a84c"] {
            background: #17202a !important;
            color: #fff !important;
            border-color: #17202a !important;
          }
          .xb-workbench-main div[style*="height: 8"] {
            background: #dfe7ee !important;
          }
          .xb-workbench-main div[style*="height: 100%"] {
            background: #256d85 !important;
          }
          .xb-workbench-main .case-grid a {
            border-color: #dfe7ee !important;
            background: #f7fbfd !important;
          }
          .xb-workbench-main .mission-mvp-grid > div {
            border-color: #dfe7ee !important;
            background: #f7fbfd !important;
          }
          @media (max-width: 1060px) {
            .mission-shell { grid-template-columns: 1fr !important; }
            .mission-shell aside { position: static !important; }
            .mission-head { grid-template-columns: 1fr !important; }
            .mission-depth-intro { grid-template-columns: 1fr !important; }
            .mission-execution-summary { grid-template-columns: 1fr !important; }
            .mission-execution-grid { grid-template-columns: repeat(2, minmax(0,1fr)) !important; }
          }
          @media (max-width: 720px) {
            .step-action-row, .case-grid, .mission-mvp-grid, .mission-execution-grid { grid-template-columns: 1fr !important; }
            .mission-step-top { grid-template-columns: 1fr !important; }
          }
        ` }} />
      </main>
    </div>
  )
}

function MissionExecutionStrip({
  mission,
  checklist,
}: {
  mission: Mission
  checklist: ReturnType<typeof buildExecutionChecklist>
}) {
  return (
    <section className="mission-execution-strip" style={missionExecutionStripStyle}>
      <div className="mission-execution-summary" style={missionExecutionSummaryStyle}>
        <div>
          <p style={{ color: "#256d85", fontSize: 12, fontWeight: 950, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 8 }}>EXECUTION CHECKLIST</p>
          <h2 style={{ color: "#17202a", fontSize: 23, fontWeight: 950, lineHeight: 1.35, marginBottom: 8 }}>先照这个顺序做，不用自己猜下一步</h2>
          <p style={{ color: "#667586", fontSize: 14, lineHeight: 1.8 }}>这个任务的目标是拿到一个能保存、能复用、能继续改进的结果。每一步都先做小交付，再验收。</p>
        </div>
        <div style={missionOutcomeCardStyle}>
          <span style={{ color: "#667586", fontSize: 12, fontWeight: 950 }}>最终交付物</span>
          <strong style={{ color: "#17202a", fontSize: 15, lineHeight: 1.65 }}>{mission.outcome}</strong>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
            <span style={missionMetaPillStyle}>{mission.minutes}</span>
            <span style={missionMetaPillStyle}>{mission.difficulty}</span>
            <span style={missionMetaPillStyle}>{mission.steps.length} 步</span>
          </div>
        </div>
      </div>
      <div className="mission-execution-grid" style={missionExecutionGridStyle}>
        {checklist.map((item, index) => (
          <div key={item.title} style={missionExecutionItemStyle}>
            <span style={missionExecutionIndexStyle}>{index + 1}</span>
            <div>
              <strong style={{ color: "#17202a", fontSize: 15, fontWeight: 950, lineHeight: 1.45 }}>{item.title}</strong>
              <p style={{ color: "#667586", fontSize: 13, lineHeight: 1.7, marginTop: 5 }}>{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
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
  onDone: (proof: MissionStepProof) => void
}) {
  const step = mission.steps[stepIndex]
  const [guideStep, setGuideStep] = useState(0)
  const recommendedTools = mission.toolIds.map((id) => tools.find((tool) => tool.id === id)).filter(Boolean) as typeof tools
  const primaryTool = recommendedTools[0]
  const hasFixPrompt = Boolean(step.fixPrompt)
  const currentAction = stepIndex === 0
    ? "先把这个任务要用的 AI 工具打开或登录好。能看到输入框、创建按钮或工作台以后，回来点确认。"
    : step.action
  const guidePhases =
    stepIndex === 0
      ? [
          { key: "tool", label: "准备并打开工具", doneText: step.toolAction ? "工具能打开，继续" : "我已经打开可用工具" },
          { key: "inspect", label: "确认能继续操作", doneText: "入口找到了，继续" },
          { key: "done", label: "保存这一小步", doneText: "" },
        ]
      : [
          { key: "make", label: "复制提示词并生成", doneText: "我已经生成出结果" },
          { key: "inspect", label: "按标准验收", doneText: "我按标准看过了" },
          ...(hasFixPrompt ? [{ key: "improve", label: "结果不好先修复", doneText: "我知道怎么补救了" }] : []),
          { key: "recap", label: "保存复盘经验", doneText: "我记住这一步经验了" },
          { key: "done", label: "进入下一步", doneText: "" },
        ]
  const currentGuideStep = Math.min(guideStep, guidePhases.length - 1)
  const currentPhase = guidePhases[currentGuideStep]
  const isDonePhase = currentPhase.key === "done"

  useEffect(() => {
    setGuideStep(0)
  }, [mission.id, stepIndex])

  function nextGuideStep() {
    setGuideStep((value) => Math.min(value + 1, guidePhases.length - 1))
  }

  return (
    <article style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(14,14,14,0.92)", borderRadius: 14, padding: "28px clamp(20px,3vw,34px)", boxShadow: "0 18px 50px rgba(0,0,0,0.28)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 16, alignItems: "start", marginBottom: 18 }} className="mission-step-top">
        <div>
          <p style={{ color: "#e8c96a", fontSize: 14, fontWeight: 950, marginBottom: 8 }}>第 {stepIndex + 1} 步 / 共 {mission.steps.length} 步</p>
          <h2 style={{ color: "#fff", fontSize: "clamp(23px,3.5vw,32px)", fontWeight: 950, lineHeight: 1.25, marginBottom: 10 }}>{step.title}</h2>
          <p style={{ color: "#cfcfcf", fontSize: 14, lineHeight: 1.85 }}>{step.desc}</p>
        </div>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#e8c96a", fontFamily: "'Noto Sans SC',sans-serif", fontSize: 13, fontWeight: 950 }}>
          <Trophy size={15} /> +{mission.xp}XP 完整任务
        </span>
      </div>

      <section style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.045)", borderRadius: 12, padding: "18px 20px", marginBottom: 14 }}>
        <p style={{ color: "#9a9a9a", fontSize: 13, fontWeight: 900, marginBottom: 8 }}>先别想太多，现在只做这一件事</p>
        <p style={{ color: "#fff", fontSize: 18, fontWeight: 950, lineHeight: 1.7 }}>{currentAction}</p>
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
                padding: "8px 12px",
                fontSize: 13,
                fontWeight: 950,
              }}
            >
              {index + 1}. {phase.label}
            </span>
          ))}
        </div>
        <p style={{ color: "#e8c96a", fontSize: 14, fontWeight: 950, marginBottom: 9 }}>当前小步：{currentPhase.label}</p>

        {currentPhase.key === "tool" && (
          <div>
            <p style={{ color: "#fff", fontSize: 17, fontWeight: 950, lineHeight: 1.7, marginBottom: 12 }}>
              {step.toolAction
                ? `先点下面的「${step.toolAction.label}」。如果这个任务还会用到其他工具，也一起打开或登录好。完成后回来点确认。`
                : primaryTool
                  ? `先打开「${primaryTool.name}」。如果下面还有其他工具，也一起打开或登录好。打开后回来点确认。`
                  : "先打开一个 AI 对话工具，比如 Kimi、DeepSeek 或豆包。能看到输入框以后回来点确认。"}
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
                <p style={{ color: "#dfca88", fontSize: 14, fontWeight: 950, lineHeight: 1.7 }}>{step.toolAction.setupText}</p>
                <p style={{ color: "#c8c8c8", fontSize: 14, lineHeight: 1.7, marginTop: 6 }}>{step.toolAction.readyText}</p>
              </div>
            )}
            {step.clickPath && step.clickPath.length > 0 && (
              <div style={{ ...primaryBlockStyle, marginTop: 12 }}>
                <h3 style={blockTitleStyle}>小白点哪，你就点哪</h3>
                <div style={{ display: "flex", gap: 7, flexWrap: "wrap", alignItems: "center", marginBottom: 10 }}>
                  {step.clickPath.map((item, index) => (
                    <span key={`${item}-${index}`} style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
                      <span style={{ color: "#eee", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.055)", borderRadius: 999, padding: "9px 12px", fontSize: 14, fontWeight: 850 }}>{item}</span>
                      {index < step.clickPath!.length - 1 && <ChevronRight size={13} color="#6f6f6f" />}
                    </span>
                  ))}
                </div>
                <p style={{ color: "#c8c8c8", fontSize: 14, lineHeight: 1.7 }}>走到能输入、能创建或能上传的位置，就回来点确认。</p>
              </div>
            )}
            {step.validation && step.validation.length > 0 && (
              <details style={detailsStyle}>
                <summary style={summaryStyle}>不确定有没有打开对？点这里检查</summary>
                <div style={{ display: "grid", gap: 8, marginTop: 10 }}>{step.validation.map((item) => <CheckLine key={item}>{item}</CheckLine>)}</div>
              </details>
            )}
          </div>
        )}

        {currentPhase.key === "make" && (
          <div>
            <p style={{ color: "#fff", fontSize: 17, fontWeight: 950, lineHeight: 1.7, marginBottom: 12 }}>这是小白写好的模板。复制下面这段，粘贴到刚才打开的 AI / 工具里，直接点生成。先看到结果，不要在这里研究太久。</p>
            {step.clickPath && step.clickPath.length > 0 && (
              <div style={{ display: "flex", gap: 7, flexWrap: "wrap", alignItems: "center", marginBottom: 14 }}>
                {step.clickPath.map((item, index) => (
                  <span key={`${item}-${index}`} style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
                    <span style={{ color: "#eee", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.055)", borderRadius: 999, padding: "9px 12px", fontSize: 14, fontWeight: 850 }}>{item}</span>
                    {index < step.clickPath!.length - 1 && <ChevronRight size={13} color="#6f6f6f" />}
                  </span>
                ))}
              </div>
            )}
            <section style={primaryBlockStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", marginBottom: 10 }}>
                <h3 style={{ ...blockTitleStyle, marginBottom: 0 }}>直接复制这一段</h3>
                <button type="button" onClick={() => onCopy("prompt", step.prompt)} style={miniButtonStyle}>
                  {copied === "prompt" ? <Check size={13} /> : <Clipboard size={13} />} {copied === "prompt" ? "已复制" : "复制"}
                </button>
              </div>
              <p style={{ color: "#d7d7d7", fontSize: 15, lineHeight: 1.9, whiteSpace: "pre-line" }}>{step.prompt}</p>
            </section>
            <section style={{ border: "1px solid #2a1f10", background: "rgba(201,168,76,0.055)", borderRadius: 12, padding: "16px 18px", marginBottom: 12 }}>
              <p style={{ color: "#999", fontSize: 13, fontWeight: 950, marginBottom: 7 }}>这一步交付物</p>
              <p style={{ color: "#e8c96a", fontSize: 15, fontWeight: 950, lineHeight: 1.75 }}>{step.deliverable}</p>
            </section>
          </div>
        )}

        {currentPhase.key === "inspect" && (
          <InspectPhase step={step} stepIndex={stepIndex} />
        )}

        {currentPhase.key === "improve" && (
          <ImprovePhase step={step} copied={copied} onCopy={onCopy} />
        )}

        {currentPhase.key === "recap" && (
          <RecapPhase mission={mission} step={step} stepIndex={stepIndex} />
        )}
      </section>
      {isDonePhase && (
        <section style={{ border: "1px solid #29351f", background: "rgba(61,165,99,0.065)", borderRadius: 12, padding: "16px 18px", marginBottom: 16 }}>
          <p style={{ color: "#fff", fontSize: 16, fontWeight: 950, marginBottom: 6 }}>确认一下就进入下一步</p>
          <p style={{ color: "#b6dfc1", fontSize: 14, lineHeight: 1.75 }}>这是小白引导型学习任务，不需要上传截图，也不需要填证明。你确认自己已经完成当前小步，就继续往下走。</p>
        </section>
      )}

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        {currentGuideStep > 0 && (
          <button type="button" onClick={() => setGuideStep((value) => Math.max(0, value - 1))} style={missionSecondaryButtonStyle}>
            返回上一个小步
          </button>
        )}
        {isDonePhase ? (
          <button
            type="button"
            onClick={() => onDone({ method: "self-check", text: "", checked: [], updatedAt: new Date().toISOString() })}
            style={missionPrimaryButtonStyle}
          >
            我完成了这一步，进入下一步 <ArrowRight size={14} />
          </button>
        ) : (
          <button type="button" onClick={nextGuideStep} style={missionPrimaryButtonStyle}>
            {currentPhase.doneText} <ArrowRight size={14} />
          </button>
        )}
      </div>
    </article>
  )
}

function InspectPhase({ step, stepIndex }: { step: MissionStep; stepIndex: number }) {
  const checks = step.validation?.length ? step.validation : step.checklist || []
  const title = stepIndex === 0 ? "确认你找到了正确入口" : "别急着确认，先验收结果"
  const intro = stepIndex === 0
    ? "这一步不是学概念，是确认工具真的能继续往下做。只要下面几条能对上，就可以进入下一步。"
    : "AI 生成出来不代表能用。先按下面标准看一遍，知道哪里能用、哪里要改，这才算真正学会。"

  return (
    <div>
      <section style={primaryBlockStyle}>
        <h3 style={blockTitleStyle}>{title}</h3>
        <p style={{ color: "#cfcfcf", fontSize: 15, lineHeight: 1.85, marginBottom: 12 }}>{intro}</p>
        {checks.length > 0 ? (
          <div style={{ display: "grid", gap: 9 }}>{checks.map((item) => <CheckLine key={item}>{item}</CheckLine>)}</div>
        ) : (
          <CheckLine>你能清楚说出这一步做出了什么，以及下一步要把它用在哪里。</CheckLine>
        )}
      </section>
      {step.promptRules && step.promptRules.length > 0 && (
        <section style={learningBlockStyle}>
          <h3 style={blockTitleStyle}>这一段提示词真正教你的东西</h3>
          <div style={{ display: "grid", gap: 9 }}>{step.promptRules.map((item) => <CheckLine key={item}>{item}</CheckLine>)}</div>
        </section>
      )}
    </div>
  )
}

function ImprovePhase({
  step,
  copied,
  onCopy,
}: {
  step: MissionStep
  copied: "prompt" | "fix" | "recap" | null
  onCopy: (kind: "prompt" | "fix" | "recap", text: string) => void
}) {
  return (
    <div>
      <section style={primaryBlockStyle}>
        <h3 style={blockTitleStyle}>结果不好时，别重开，先二次修改</h3>
        <p style={{ color: "#cfcfcf", fontSize: 15, lineHeight: 1.85, marginBottom: 12 }}>
          小白真正要教你的不是“第一句提示词”，而是看到问题以后怎么让 AI 改到能交付。
        </p>
        {step.fixPrompt && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", marginBottom: 10 }}>
              <p style={{ color: "#e8c96a", fontSize: 14, fontWeight: 950 }}>复制这段去补救</p>
              <button type="button" onClick={() => onCopy("fix", step.fixPrompt!)} style={miniButtonStyle}>
                {copied === "fix" ? <Check size={13} /> : <Clipboard size={13} />} {copied === "fix" ? "已复制" : "复制"}
              </button>
            </div>
            <p style={{ color: "#d7d7d7", fontSize: 15, lineHeight: 1.9 }}>{step.fixPrompt}</p>
          </>
        )}
      </section>
      {step.troubleTips && step.troubleTips.length > 0 && (
        <section style={learningBlockStyle}>
          <h3 style={blockTitleStyle}>常见卡点怎么判断</h3>
          <div style={{ display: "grid", gap: 9 }}>
            {step.troubleTips.map((tip) => (
              <div key={tip.problem} style={{ border: "1px solid #222", borderRadius: 9, padding: "12px 13px", background: "rgba(0,0,0,0.18)" }}>
                <p style={{ color: "#fff", fontSize: 15, fontWeight: 950, marginBottom: 5 }}>{tip.problem}</p>
                <p style={{ color: "#cfcfcf", fontSize: 14, lineHeight: 1.75 }}>{tip.fix}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function RecapPhase({ mission, step, stepIndex }: { mission: Mission; step: MissionStep; stepIndex: number }) {
  const recapLines = stepIndex === 0
    ? ["我选了哪个工具", "打开过程哪里卡住过", "下次让小白先提醒我什么"]
    : ["这次生成结果哪里能直接用", "哪里必须人工修改", "下一次提示词要补哪一句"]

  return (
    <section style={primaryBlockStyle}>
      <h3 style={blockTitleStyle}>把这一小步变成你的经验</h3>
      <p style={{ color: "#cfcfcf", fontSize: 15, lineHeight: 1.85, marginBottom: 12 }}>
        真正的深度不是页面更长，而是你下次能少踩一次坑。确认前在心里过一遍这三句话：
      </p>
      <div style={{ display: "grid", gap: 9, marginBottom: 14 }}>
        {recapLines.map((item) => <CheckLine key={item}>{item}</CheckLine>)}
      </div>
      <section style={{ border: "1px solid #2a1f10", background: "rgba(201,168,76,0.055)", borderRadius: 12, padding: "14px 16px" }}>
        <p style={{ color: "#999", fontSize: 13, fontWeight: 950, marginBottom: 7 }}>完整通关后会让你复盘</p>
        <p style={{ color: "#e8c96a", fontSize: 15, fontWeight: 950, lineHeight: 1.75 }}>{mission.badge} · {step.deliverable}</p>
      </section>
    </section>
  )
}

function CompleteCard({
  mission,
  nextMission,
  copied,
  onCopy,
  onClaim,
  claiming,
  notice,
}: {
  mission: Mission
  nextMission?: Mission
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
        <p style={{ color: "#d7d7d7", fontSize: 15, lineHeight: 1.85, whiteSpace: "pre-line" }}>{mission.recapTemplate}</p>
      </div>
      {nextMission && (
        <section style={{ border: "1px solid rgba(201,168,76,0.34)", background: "rgba(201,168,76,0.07)", borderRadius: 12, padding: "16px 18px", marginBottom: 16 }}>
          <p style={{ color: "#cdbb80", fontSize: 13, fontWeight: 950, marginBottom: 7 }}>下一关钩子</p>
          <h3 style={{ color: "#fff", fontSize: 20, fontWeight: 950, lineHeight: 1.35, marginBottom: 7 }}>{nextMission.shortTitle}</h3>
          <p style={{ color: "#cfcfcf", fontSize: 14, lineHeight: 1.75, marginBottom: 12 }}>{nextMission.tagline}</p>
          <p style={{ color: "#e8c96a", fontSize: 14, lineHeight: 1.75, fontWeight: 900, marginBottom: 12 }}>
            小白不是让你再看一篇教程，而是换一个场景再交付一次：跑通、验收、迭代、复盘继续走。
          </p>
          <Link href={`/missions/${nextMission.id}`} style={{ ...missionSecondaryButtonStyle, textDecoration: "none" }}>
            进入下一段任务 <ArrowRight size={14} />
          </Link>
        </section>
      )}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button type="button" onClick={onClaim} disabled={claiming} style={missionPrimaryButtonStyle}>
          {claiming ? "领取中..." : `领取 ${mission.xp}XP 通关奖励`} <Trophy size={14} />
        </button>
        <button type="button" onClick={onCopy} style={missionSecondaryButtonStyle}>
          {copied ? <Check size={14} /> : <Clipboard size={14} />} {copied ? "已复制复盘" : "复制复盘模板"}
        </button>
        <Link href="/community/new" style={{ ...missionSecondaryButtonStyle, textDecoration: "none" }}>
          发复盘 <MessageCircle size={14} />
        </Link>
      </div>
      {notice && <p style={{ color: notice.includes("到账") ? "#3DA563" : "#cdbb80", fontSize: 13, lineHeight: 1.7, marginTop: 12 }}>{notice}</p>}
    </article>
  )
}

const primaryBlockStyle: CSSProperties = {
  border: "1px solid rgba(255,255,255,0.09)",
  background: "rgba(255,255,255,0.04)",
  borderRadius: 12,
  padding: "18px 20px",
  marginBottom: 14,
}

const missionExecutionStripStyle: CSSProperties = {
  display: "grid",
  gap: 16,
  border: "1px solid #dfe7ee",
  background: "rgba(255,255,255,0.96)",
  borderRadius: 14,
  padding: "20px",
  marginBottom: 18,
  boxShadow: "0 16px 46px rgba(15,23,42,0.06)",
}

const missionExecutionSummaryStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr minmax(260px, 360px)",
  gap: 16,
  alignItems: "stretch",
}

const missionOutcomeCardStyle: CSSProperties = {
  display: "grid",
  gap: 8,
  alignContent: "start",
  border: "1px solid #dfe7ee",
  background: "#f7fbfd",
  borderRadius: 12,
  padding: "15px 16px",
}

const missionMetaPillStyle: CSSProperties = {
  border: "1px solid #cfd9e3",
  background: "#fff",
  color: "#256d85",
  borderRadius: 999,
  padding: "7px 10px",
  fontSize: 12,
  fontWeight: 950,
}

const missionExecutionGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
  gap: 10,
}

const missionExecutionItemStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "30px 1fr",
  gap: 10,
  alignItems: "start",
  border: "1px solid #dfe7ee",
  background: "#f7fbfd",
  borderRadius: 12,
  padding: "14px",
  minHeight: 130,
}

const missionExecutionIndexStyle: CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: "50%",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#17202a",
  color: "#fff",
  fontSize: 13,
  fontWeight: 950,
}

const depthIntroStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr auto",
  gap: 16,
  alignItems: "center",
  border: "1px solid rgba(201,168,76,0.24)",
  background: "linear-gradient(135deg,rgba(201,168,76,0.08),rgba(255,255,255,0.026))",
  borderRadius: 14,
  padding: "18px 20px",
  marginBottom: 18,
}

const depthRailStyle: CSSProperties = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
  justifyContent: "flex-end",
  maxWidth: 360,
}

const depthRailItemStyle: CSSProperties = {
  border: "1px solid rgba(201,168,76,0.3)",
  background: "rgba(0,0,0,0.22)",
  color: "#e8c96a",
  borderRadius: 999,
  padding: "9px 12px",
  fontSize: 13,
  fontWeight: 950,
}

const missionPlaybookStyle: CSSProperties = {
  display: "grid",
  gap: 18,
  border: "1px solid rgba(61,165,99,0.3)",
  background: "linear-gradient(135deg,rgba(61,165,99,0.1),rgba(255,255,255,0.026))",
  borderRadius: 14,
  padding: "20px",
  marginBottom: 18,
}

const missionPlaybookGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: 10,
}

const missionPlaybookCardStyle: CSSProperties = {
  display: "grid",
  alignContent: "start",
  gap: 8,
  minHeight: 144,
  border: "1px solid rgba(255,255,255,0.09)",
  background: "rgba(0,0,0,0.2)",
  borderRadius: 12,
  padding: "15px 16px",
}

const missionPlaybookCardTitleStyle: CSSProperties = {
  color: "#fff",
  fontSize: 15,
  fontWeight: 950,
  lineHeight: 1.4,
}

const missionPlaybookTextStyle: CSSProperties = {
  color: "#cfcfcf",
  fontSize: 14,
  lineHeight: 1.75,
  margin: 0,
}

const missionPlaybookListStyle: CSSProperties = {
  display: "grid",
  gap: 7,
  color: "#cfcfcf",
  fontSize: 14,
  lineHeight: 1.75,
  margin: 0,
  paddingLeft: 18,
}

const learningBlockStyle: CSSProperties = {
  border: "1px solid rgba(201,168,76,0.18)",
  background: "rgba(201,168,76,0.045)",
  borderRadius: 12,
  padding: "18px 20px",
  marginBottom: 14,
}

const guideShellStyle: CSSProperties = {
  border: "1px solid rgba(255,255,255,0.09)",
  background: "rgba(255,255,255,0.035)",
  borderRadius: 12,
  padding: "18px 20px",
  marginBottom: 16,
}

const quietTipStyle: CSSProperties = {
  border: "1px solid rgba(255,255,255,0.09)",
  borderRadius: 10,
  padding: "14px 16px",
  background: "rgba(255,255,255,0.035)",
}

const detailsStyle: CSSProperties = {
  border: "1px solid rgba(255,255,255,0.09)",
  background: "rgba(255,255,255,0.03)",
  borderRadius: 12,
  padding: "15px 17px",
  marginBottom: 12,
}

const summaryStyle: CSSProperties = {
  color: "#cdbb80",
  fontSize: 15,
  fontWeight: 950,
  cursor: "pointer",
  listStyle: "none",
}

const blockTitleStyle: CSSProperties = {
  color: "#fff",
  fontSize: 16,
  fontWeight: 950,
  marginBottom: 10,
}

const toolChipButtonStyle: CSSProperties = {
  border: "1px solid #7a6230",
  background: "rgba(201,168,76,0.16)",
  color: "#f2dc91",
  borderRadius: 999,
  padding: "10px 13px",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  textDecoration: "none",
  fontSize: 14,
  fontWeight: 950,
}

const toolChipLinkStyle: CSSProperties = {
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(0,0,0,0.28)",
  color: "#ddd",
  borderRadius: 999,
  padding: "10px 13px",
  display: "inline-flex",
  alignItems: "center",
  textDecoration: "none",
  fontSize: 14,
  fontWeight: 900,
}

const toolChipTextStyle: CSSProperties = {
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(0,0,0,0.28)",
  color: "#ddd",
  borderRadius: 999,
  padding: "10px 13px",
  display: "inline-flex",
  alignItems: "center",
  fontSize: 14,
  fontWeight: 900,
}

const miniButtonStyle: CSSProperties = {
  border: "1px solid rgba(201,168,76,0.46)",
  background: "rgba(201,168,76,0.12)",
  color: "#e8c96a",
  borderRadius: 8,
  padding: "9px 12px",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  cursor: "pointer",
  fontSize: 14,
  fontWeight: 950,
}

const missionPrimaryButtonStyle: CSSProperties = {
  border: "1px solid #8f7635",
  background: "rgba(201,168,76,0.16)",
  color: "#f4dc8a",
  borderRadius: 10,
  padding: "13px 18px",
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  cursor: "pointer",
  fontFamily: "'Noto Sans SC', sans-serif",
  fontSize: 15,
  fontWeight: 950,
  letterSpacing: 0,
  lineHeight: 1.2,
}

const missionSecondaryButtonStyle: CSSProperties = {
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.035)",
  color: "#d7d7d7",
  borderRadius: 10,
  padding: "13px 18px",
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  cursor: "pointer",
  fontFamily: "'Noto Sans SC', sans-serif",
  fontSize: 15,
  fontWeight: 900,
  letterSpacing: 0,
  lineHeight: 1.2,
}

function CheckLine({ children }: { children: ReactNode }) {
  return (
    <p style={{ display: "grid", gridTemplateColumns: "20px 1fr", gap: 9, alignItems: "start", color: "#d5d5d5", fontSize: 14, lineHeight: 1.75 }}>
      <span style={{ width: 18, height: 18, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", background: "rgba(201,168,76,0.1)", color: "#e8c96a", marginTop: 1 }}>
        <Check size={11} />
      </span>
      <span>{children}</span>
    </p>
  )
}
