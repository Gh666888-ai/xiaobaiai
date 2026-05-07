"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, BadgeCheck, Check, ChevronRight, Cpu, Route, Search, SlidersHorizontal, Sparkles, Wand2 } from "lucide-react"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"
import { Tool, tools } from "@/data/tools"
import { getToolMeta, toolPath } from "@/data/tool-meta"
import { stages } from "@/data/learning-path"
import { getMissionsForGoal } from "@/data/product-loop"

type Goal = "写作" | "编程" | "做图" | "客服" | "自动化" | "办公" | "学习" | "视频"
type Level = "完全小白" | "会用一点" | "进阶使用"
type Budget = "免费优先" | "可以付费" | "企业采购"
type Network = "国内友好" | "都可以" | "本地优先"

type AnswerState = {
  goal: Goal
  level: Level
  budget: Budget
  network: Network
}

const goalMap: Record<Goal, { toolIds: string[]; stage: number; reason: string; keywords: string[]; labels: string[] }> = {
  写作: {
    toolIds: ["kimi", "deepseek", "chatgpt", "xiezuocat", "notion-ai", "huoshan", "grammarly", "quillbot"],
    stage: 1,
    reason: "写作场景最重要的是中文理解、改写质量和长文处理，先用低门槛对话工具，再补专业写作工具。",
    keywords: ["写作", "文案", "内容", "长文", "中文"],
    labels: ["对话助手", "中文写作", "文档办公"],
  },
  编程: {
    toolIds: ["claude-code", "codex", "cursor", "lingma", "mars-ide", "github-copilot", "deepseek", "qwen-coder-local"],
    stage: 2,
    reason: "编程需要代码理解、项目上下文和调试能力，优先推荐可读写代码或对开发者友好的工具。",
    keywords: ["代码", "编程", "CLI", "开发", "Git"],
    labels: ["代码助手", "命令行 Agent", "本地模型"],
  },
  做图: {
    toolIds: ["jimeng", "dalle", "midjourney", "stable-diffusion", "wanxiang", "seaart", "recraft-ai", "clipdrop"],
    stage: 1,
    reason: "做图先看上手难度、中文提示词理解和免费额度，先产出可用图，再学习风格控制。",
    keywords: ["绘图", "设计", "图片", "海报", "中文"],
    labels: ["中文生图", "设计素材", "本地绘图"],
  },
  客服: {
    toolIds: ["dify", "coze", "n8n-ai-agent", "fastgpt", "deepseek", "qclaw", "openclaw"],
    stage: 3,
    reason: "客服要知识库、流程控制和人工兜底，适合从 Agent/工作流平台开始搭建。",
    keywords: ["客服", "知识库", "自动回复", "工作流", "RAG"],
    labels: ["知识库", "工作流", "人工兜底"],
  },
  自动化: {
    toolIds: ["n8n-ai-agent", "make-ai", "zapier-ai", "dify", "openclaw", "qclaw", "langflow", "crewai"],
    stage: 4,
    reason: "自动化的核心是触发器、工具连接和异常提醒，优先选择工作流和 Agent 平台。",
    keywords: ["自动化", "Agent", "工作流", "n8n", "Dify"],
    labels: ["触发器", "工具连接", "定时任务"],
  },
  办公: {
    toolIds: ["kimi", "deepseek", "gamma", "notion-ai", "julius-data", "formula-bot", "rows-ai", "powerbi-copilot"],
    stage: 1,
    reason: "办公场景优先解决文档、表格、PPT、会议纪要这些高频任务，越简单越容易坚持用。",
    keywords: ["办公", "PPT", "文档", "Excel", "会议"],
    labels: ["PPT", "文档分析", "表格处理"],
  },
  学习: {
    toolIds: ["kimi", "deepseek", "waytoagi", "coursera-ai", "deeplearning-ai", "perplexity", "brilliant-ai"],
    stage: 0,
    reason: "学习场景先建立 AI 基础认知，再用搜索、问答和教程平台形成稳定学习节奏。",
    keywords: ["学习", "教程", "课程", "搜索", "入门"],
    labels: ["入门课程", "问答辅导", "资料搜索"],
  },
  视频: {
    toolIds: ["jianying-ai", "kling", "runway", "sora", "pika", "heygen", "suno", "elevenlabs"],
    stage: 2,
    reason: "视频制作需要脚本、画面、配音和剪辑组合，适合从一两个易用工具开始搭流程。",
    keywords: ["视频", "剪辑", "配音", "脚本", "短视频"],
    labels: ["短视频", "配音", "脚本生成"],
  },
}

const levelBoost: Record<Level, number> = {
  完全小白: 0,
  会用一点: 2,
  进阶使用: 4,
}

const questions = [
  {
    key: "goal",
    title: "你主要想用 AI 做什么？",
    options: ["写作", "编程", "做图", "客服", "自动化", "办公", "学习", "视频"],
  },
  {
    key: "level",
    title: "你现在的 AI 使用水平？",
    options: ["完全小白", "会用一点", "进阶使用"],
  },
  {
    key: "budget",
    title: "预算更接近哪一种？",
    options: ["免费优先", "可以付费", "企业采购"],
  },
  {
    key: "network",
    title: "网络和部署偏好？",
    options: ["国内友好", "都可以", "本地优先"],
  },
] as const

function uniqueById(items: Tool[]) {
  const map = new Map<string, Tool>()
  for (const item of items) if (!map.has(item.id)) map.set(item.id, item)
  return Array.from(map.values())
}

function scoreTool(tool: Tool, answers: AnswerState) {
  const meta = getToolMeta(tool)
  const goal = goalMap[answers.goal]
  let score = 0
  if (goal.toolIds.includes(tool.id)) score += 70
  if (tool.stage <= levelBoost[answers.level] + 1) score += 16
  if (tool.featured) score += 12
  if (tool.rank > 0) score += 8
  if (answers.budget === "免费优先" && (tool.pricing === "免费" || tool.pricing === "有免费额度")) score += 16
  if (answers.budget === "可以付费" && tool.pricing !== "付费") score += 8
  if (answers.budget === "企业采购" && tool.stage >= 2) score += 8
  if (answers.network === "国内友好" && meta.magicNetwork === "不需要") score += 18
  if (answers.network === "本地优先" && (tool.category === "模型平台" || tool.tags.some((tag) => tag.includes("本地") || tag.includes("开源")))) score += 20
  if (goal.keywords.some((kw) => tool.name.includes(kw) || tool.description.includes(kw) || tool.tags.some((tag) => tag.includes(kw)))) score += 10
  score += Math.min(10, Math.floor(meta.newbieScore / 10))
  return score
}

function buildReason(tool: Tool, answers: AnswerState) {
  const meta = getToolMeta(tool)
  const bits = [
    goalMap[answers.goal].toolIds.includes(tool.id) ? `匹配「${answers.goal}」场景` : "可作为补充工具",
    `新手推荐指数 ${meta.newbieScore}`,
    meta.magicNetwork === "不需要" ? "国内使用更省心" : meta.magicNetwork,
    meta.difficulty,
  ]
  return bits.join(" · ")
}

export default function ChooseToolClient() {
  const [answers, setAnswers] = useState<AnswerState>({
    goal: "写作",
    level: "完全小白",
    budget: "免费优先",
    network: "国内友好",
  })

  const result = useMemo(() => {
    const goal = goalMap[answers.goal]
    const ranked = uniqueById(tools)
      .filter((tool) => goal.toolIds.includes(tool.id) || goal.keywords.some((kw) => tool.name.includes(kw) || tool.description.includes(kw) || tool.tags.some((tag) => tag.includes(kw))))
      .map((tool) => ({ tool, score: scoreTool(tool, answers), meta: getToolMeta(tool), reason: buildReason(tool, answers) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)

    const stageId = answers.level === "完全小白" ? Math.min(goal.stage, 1) : goal.stage
    const stage = stages.find((item) => item.id === stageId) || stages[0]
    const missions = getMissionsForGoal(answers.goal).slice(0, 2)
    return { goal, ranked, stage, missions }
  }, [answers])

  return (
    <div style={{ background: "#000", minHeight: "100vh", fontFamily: "'Noto Sans SC', sans-serif", position: "relative", overflow: "hidden" }}>
      <MathRain />
      <NavBar />

      <main style={{ maxWidth: 1120, margin: "0 auto", padding: "58px 60px 100px", position: "relative", zIndex: 10, background: "rgba(0,0,0,0.86)" }} className="max-sm:px-4">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 28, alignItems: "flex-end", marginBottom: 28, flexWrap: "wrap" }}>
          <div>
            <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.36em", color: "#7a6230", textTransform: "uppercase", marginBottom: 10, fontWeight: 800 }}>AI Tool Selector</p>
            <h1 style={{ fontSize: 38, fontWeight: 950, color: "#fff", letterSpacing: "0.02em", marginBottom: 10 }}>AI 工具选择器</h1>
            <p style={{ fontSize: 15, color: "#cfcfcf", lineHeight: 1.9, maxWidth: 660 }}>回答 4 个问题，系统会自动给你推荐工具、学习阶段和第一步行动。适合完全不知道该选哪个 AI 工具的新手。</p>
          </div>
          <Link href="/search" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#c9a84c", textDecoration: "none", border: "1px solid #2a1f10", borderRadius: 8, padding: "10px 14px", background: "rgba(201,168,76,0.04)", fontSize: 13, fontWeight: 800 }}>
            <Search size={15} /> 全站搜索
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: 16 }} className="max-sm:grid-cols-1">
          <section style={{ border: "1px solid #1a1a1a", borderRadius: 12, background: "rgba(255,255,255,0.03)", padding: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
              <SlidersHorizontal size={16} style={{ color: "#e8c96a" }} />
              <h2 style={{ fontSize: 16, color: "#fff", fontWeight: 900 }}>选择你的情况</h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              {questions.map((question) => (
                <div key={question.key}>
                  <p style={{ fontSize: 13, color: "#ddd", fontWeight: 800, marginBottom: 10 }}>{question.title}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {question.options.map((option) => {
                      const selected = answers[question.key as keyof AnswerState] === option
                      return (
                        <button
                          key={option}
                          onClick={() => setAnswers((prev) => ({ ...prev, [question.key]: option } as AnswerState))}
                          style={{
                            minHeight: 38,
                            padding: "8px 12px",
                            borderRadius: 8,
                            border: `1px solid ${selected ? "#7a6230" : "#242424"}`,
                            background: selected ? "rgba(201,168,76,0.11)" : "rgba(0,0,0,0.25)",
                            color: selected ? "#e8c96a" : "#bbb",
                            fontSize: 12,
                            fontWeight: 800,
                            cursor: "pointer",
                          }}
                        >
                          {selected && <Check size={13} style={{ marginRight: 5, verticalAlign: -2 }} />}
                          {option}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section style={{ border: "1px solid #2a1f10", borderRadius: 12, background: "linear-gradient(135deg, rgba(201,168,76,0.08), rgba(255,255,255,0.025))", padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <Wand2 size={18} style={{ color: "#e8c96a" }} />
              <h2 style={{ fontSize: 18, color: "#fff", fontWeight: 950 }}>推荐结论</h2>
            </div>
            <p style={{ color: "#d8d8d8", fontSize: 14, lineHeight: 1.9, marginBottom: 18 }}>{result.goal.reason}</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 8, marginBottom: 18 }} className="max-sm:grid-cols-1">
              {result.goal.labels.map((label, index) => (
                <div key={label} style={{ border: "1px solid #242424", borderRadius: 10, padding: "14px 12px", background: "rgba(0,0,0,0.3)", minHeight: 72 }}>
                  <p style={{ fontSize: 20, marginBottom: 6 }}>{["●", "◆", "◇"][index]}</p>
                  <p style={{ color: "#fff", fontSize: 13, fontWeight: 900 }}>{label}</p>
                </div>
              ))}
            </div>

            <Link href={`/learn/${result.stage.id}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, border: "1px solid #3a2a12", borderRadius: 10, padding: "15px 16px", background: "rgba(0,0,0,0.35)", textDecoration: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Route size={17} style={{ color: "#e8c96a" }} />
                <div>
                  <p style={{ color: "#fff", fontSize: 14, fontWeight: 900 }}>建议学习路径：{result.stage.title}</p>
                  <p style={{ color: "#999", fontSize: 12, marginTop: 3 }}>{result.stage.timeEstimate} · {result.stage.sections.length} 个章节</p>
                </div>
              </div>
              <ChevronRight size={18} style={{ color: "#c9a84c" }} />
            </Link>
          </section>
        </div>

        <section style={{ marginTop: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Route size={17} style={{ color: "#e8c96a" }} />
            <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 950 }}>接下来先做一个任务</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 10, marginBottom: 20 }} className="max-sm:grid-cols-1">
            {result.missions.map((mission) => (
              <Link key={mission.id} href={`/missions/${mission.id}`} style={{ border: "1px solid #2a1f10", borderRadius: 12, background: "rgba(201,168,76,0.045)", padding: 18, textDecoration: "none", minHeight: 164, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
                  <h3 style={{ color: "#fff", fontSize: 17, fontWeight: 950, lineHeight: 1.45 }}>{mission.shortTitle}</h3>
                  <span className="tag tag-gold" style={{ fontSize: 9 }}>+{mission.xp}XP</span>
                </div>
                <p style={{ color: "#bbb", fontSize: 13, lineHeight: 1.75, flex: 1 }}>{mission.tagline}</p>
                <span style={{ color: "#c9a84c", fontSize: 12, fontWeight: 900, display: "inline-flex", alignItems: "center", gap: 5 }}>
                  从 0-1 开始 <ArrowRight size={13} />
                </span>
              </Link>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Sparkles size={17} style={{ color: "#e8c96a" }} />
            <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 950 }}>优先推荐工具</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 10 }} className="max-sm:grid-cols-1">
            {result.ranked.map(({ tool, meta, reason }, index) => (
              <Link key={`${tool.id}-${index}`} href={toolPath(tool)} style={{ border: "1px solid #1a1a1a", borderRadius: 12, background: "rgba(255,255,255,0.025)", padding: 18, textDecoration: "none", minHeight: 250, display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                  <div>
                    <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#c9a84c", fontWeight: 900 }}>#{index + 1}</p>
                    <h3 style={{ color: "#fff", fontSize: 17, fontWeight: 950, marginTop: 5 }}>{tool.name}</h3>
                  </div>
                  <span className="tag tag-gold" style={{ fontSize: 9 }}>{tool.category}</span>
                </div>
                <p style={{ color: "#cfcfcf", fontSize: 13, lineHeight: 1.75, flex: 1 }}>{tool.description.slice(0, 118)}...</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  <span className="tag tag-green">{tool.pricing}</span>
                  <span className="tag tag-gray">{meta.difficulty}</span>
                  <span className="tag tag-blue">推荐 {meta.newbieScore}</span>
                </div>
                <p style={{ color: "#888", fontSize: 11, lineHeight: 1.7 }}>{reason}</p>
                <span style={{ color: "#c9a84c", fontSize: 12, fontWeight: 900, display: "inline-flex", alignItems: "center", gap: 5 }}>
                  查看详情 <ArrowRight size={13} />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 10, marginTop: 18 }} className="max-sm:grid-cols-1">
          {[
            { icon: <BadgeCheck size={17} />, title: "第一步", text: "先选第 1 个工具完成一个 10 分钟小任务，不要一开始就追求复杂流程。" },
            { icon: <Cpu size={17} />, title: "第二步", text: "把结果人工检查一遍，确认质量、隐私和版权都可接受，再用于正式工作。" },
            { icon: <Sparkles size={17} />, title: "第三步", text: "连续用 3 天后，再决定是否升级付费版或进入对应学习路径。" },
          ].map((item) => (
            <div key={item.title} style={{ border: "1px solid #1a1a1a", borderRadius: 10, background: "rgba(255,255,255,0.02)", padding: 16 }}>
              <div style={{ color: "#e8c96a", display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
                {item.icon}
                <p style={{ color: "#fff", fontSize: 13, fontWeight: 900 }}>{item.title}</p>
              </div>
              <p style={{ color: "#aaa", fontSize: 12, lineHeight: 1.8 }}>{item.text}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  )
}
