"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, Check, CheckCircle2, Clipboard, Flag, MessageCircle, Route, Sparkles, Trophy } from "lucide-react"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"

const goals = [
  {
    id: "knowledge-base",
    title: "我想做一个能回答问题的知识库",
    shortTitle: "知识库问答",
    wholeThing: "最终可能是一个客服 Bot、课程问答助手、售后政策助手或公司内部资料助手。",
    firstStep: "先不搭完整 Bot，只整理 10 条真实问题和对应资料来源。",
    output: "一张“问题 -> 答案来源 -> 不能回答时转人工”的小表。",
    href: "/topics/dify",
    learnHref: "/learn/2",
    action: "从知识库环节开始",
    stage: "L2 完成任务 / L3 搭建 Agent",
    xp: 40,
    minutes: "25 分钟",
    materials: ["一份产品说明或售后政策", "3-5 个真实用户问题", "一个表格或文档"],
    steps: ["把资料拆成 10 条问答", "每条答案标注资料来源", "写清楚哪些问题必须转人工"],
    prompt:
      "你是知识库整理助手。请根据我提供的资料，整理 10 条真实用户可能会问的问题。输出表格：问题、标准回答、资料来源、不能确定时的转人工话术。要求不要编造资料里没有的信息。",
    recap: "我今天把一份资料整理成了 10 条知识库问答，下一步准备用 Dify/Coze 导入测试召回效果。",
  },
  {
    id: "content-account",
    title: "我想用 AI 做内容账号",
    shortTitle: "内容账号",
    wholeThing: "最终可能是小红书、公众号、短视频、教程站或行业资讯号。",
    firstStep: "先不追求日更，先让 AI 采访你 6 个问题，写出一篇真实经验稿。",
    output: "一篇 600-1000 字的真实经历文章，能发到社区或社媒。",
    href: "/community/post-43",
    learnHref: "/learn/1",
    action: "先写第一篇",
    stage: "L1 会用工具 / L2 完成任务",
    xp: 35,
    minutes: "30 分钟",
    materials: ["一个你熟悉的经历", "目标读者", "你想表达的观点"],
    steps: ["让 AI 先采访你 6 个问题", "把回答改成一篇经验稿", "保留真实细节，删掉空话"],
    prompt:
      "你是内容采访编辑。请先围绕我的经历连续问我 6 个问题，目标是写出一篇 600-1000 字的真实经验文章。不要先写正文，先帮我把故事、痛点、转折、方法和结果问清楚。",
    recap: "我今天没有直接让 AI 编文章，而是先用采访法整理出了第一篇真实经验稿。",
  },
  {
    id: "code-site",
    title: "我想让 AI 帮我改网站或代码",
    shortTitle: "网站/代码",
    wholeThing: "最终可能是一个工具站、导航站、工作台、自动化系统或个人产品。",
    firstStep: "先不让 AI 重构项目，只让它读一个页面并列出改动计划。",
    output: "一个小范围 diff：只改 1-2 个文件，并能通过 build。",
    href: "/claude-code-deepseek",
    learnHref: "/learn/4",
    action: "从一个小改动开始",
    stage: "L5 AI 编程与自动化",
    xp: 45,
    minutes: "35 分钟",
    materials: ["一个具体页面", "你想改善的 1 个体验问题", "build 或测试命令"],
    steps: ["限定 AI 只读相关文件", "先让 AI 给改动计划", "只落地 1 个小 diff 并验证"],
    prompt:
      "你是谨慎的产品工程师。请先阅读这个页面相关文件，只提出一个最小可落地的改动计划。范围限制在 1-2 个文件内，完成后必须告诉我如何用 build/test 验证。不要做无关重构。",
    recap: "我今天让 AI 只改了一个小功能，并用 build/test 验证，没有一上来重构整个项目。",
  },
  {
    id: "workflow",
    title: "我想做自动化工作流",
    shortTitle: "自动化工作流",
    wholeThing: "最终可能是自动日报、新闻抓取、价格监控、邮件草稿或飞书通知。",
    firstStep: "先不做全自动，只把人工流程写成 5 个步骤。",
    output: "一张“触发 -> 获取信息 -> AI处理 -> 人工确认 -> 发送”的流程表。",
    href: "/workflows",
    learnHref: "/learn/2",
    action: "先拆一个流程",
    stage: "L3 搭建 Agent / L5 自动化",
    xp: 40,
    minutes: "25 分钟",
    materials: ["一个重复任务", "任务触发时间", "最终要发给谁"],
    steps: ["写出人工流程 5 步", "标出哪一步能交给 AI", "保留人工确认节点"],
    prompt:
      "你是自动化流程设计师。请把我这个重复任务拆成 5 步流程：触发、获取信息、AI 处理、人工确认、发送。请指出每一步需要什么输入、输出，以及最容易出错的地方。",
    recap: "我今天先把自动化任务拆成了 5 步流程，下一步再决定用脚本、Dify、Coze 还是定时任务实现。",
  },
  {
    id: "office",
    title: "我想用 AI 提高办公效率",
    shortTitle: "办公效率",
    wholeThing: "最终可能是周报、会议纪要、合同摘要、Excel 分析或 PPT 初稿。",
    firstStep: "先选一个今天真的要交付的文件，让 AI 只做整理，不让它乱编。",
    output: "一份可检查的周报/纪要/表格分析初稿。",
    href: "/community/post-39",
    learnHref: "/learn/1",
    action: "先做一个办公环节",
    stage: "L1 会用工具 / L2 完成任务",
    xp: 30,
    minutes: "20 分钟",
    materials: ["一份原始材料", "交付对象", "格式要求"],
    steps: ["先让 AI 提取事实", "再整理成指定格式", "最后人工核对数字和结论"],
    prompt:
      "你是办公材料整理助手。请只基于我提供的材料，先提取事实、数字、待办和风险，再整理成一份可检查的初稿。资料里没有的内容请标注“未提供”，不要自行编造。",
    recap: "我今天让 AI 帮我整理了一个真实办公材料，并保留人工核对，避免直接复制不可靠结论。",
  },
  {
    id: "visual-video",
    title: "我想做 AI 绘图或短视频作品",
    shortTitle: "绘图/短视频",
    wholeThing: "最终可能是头像、海报、壁纸、分镜、漫剧或短视频账号。",
    firstStep: "先不做完整视频，只写一个角色设定或 5 个镜头。",
    output: "一组稳定的角色提示词，或一个 5 镜头短视频脚本。",
    href: "/community/post-36",
    learnHref: "/learn/1",
    action: "先做一个镜头",
    stage: "L1 会用工具 / L2 完成任务",
    xp: 35,
    minutes: "30 分钟",
    materials: ["角色或主题", "画面风格", "发布平台"],
    steps: ["写清楚角色外观和情绪", "拆成 5 个镜头", "每个镜头只表达一个动作"],
    prompt:
      "你是短视频分镜策划。请根据我的主题，生成一个 5 镜头脚本。每个镜头包含：画面、人物动作、镜头景别、旁白、适合生成图像/视频的提示词。风格要统一，不要一次塞太多动作。",
    recap: "我今天没有直接做完整视频，而是先完成了角色设定和 5 镜头分镜。",
  },
]

const principles = [
  "先问想做成什么事，再找工具。",
  "完整项目太大，就先做其中一个环节。",
  "第一个环节必须能交付、能检查、能复用。",
  "做完再回到学习路径补基础，而不是一直停在学习。",
]

const recapTemplate = `我今天想做：
我完成了：
我用到的工具：
交付物链接/内容：
卡住的地方：
下一步准备：`

export function StartClient() {
  const [selectedId, setSelectedId] = useState(goals[0].id)
  const [copied, setCopied] = useState<"prompt" | "recap" | null>(null)
  const selected = useMemo(() => goals.find((goal) => goal.id === selectedId) ?? goals[0], [selectedId])

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
              <p style={{ color: "#aaa", fontSize: 14, lineHeight: 1.8 }}>点一个方向，右侧会变成今天能交付的 0-1 任务单。</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,240px),1fr))", gap: 10 }}>
              {goals.map((goal) => {
                const active = goal.id === selected.id
                return (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => setSelectedId(goal.id)}
                    style={{
                      textAlign: "left",
                      border: active ? "1px solid #8c7333" : "1px solid #1a1a1a",
                      background: active ? "rgba(201,168,76,0.08)" : "rgba(255,255,255,0.026)",
                      borderRadius: 10,
                      padding: "17px 18px",
                      minHeight: 196,
                      cursor: "pointer",
                    }}
                  >
                    <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 950, lineHeight: 1.45, marginBottom: 9 }}>{goal.title}</h3>
                    <p style={{ color: "#888", fontSize: 11, fontWeight: 900, marginBottom: 5 }}>完整目标</p>
                    <p style={{ color: "#bbb", fontSize: 12, lineHeight: 1.7, marginBottom: 10 }}>{goal.wholeThing}</p>
                    <p style={{ color: "#cdbb80", fontSize: 12, lineHeight: 1.65, borderTop: "1px solid #242424", paddingTop: 9 }}>先做：{goal.output}</p>
                  </button>
                )
              })}
            </div>
          </div>

          <aside style={{ border: "1px solid #2a1f10", background: "linear-gradient(180deg,rgba(201,168,76,0.08),rgba(255,255,255,0.025))", borderRadius: 12, padding: "22px 24px", position: "sticky", top: 18 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
              <div>
                <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.18em", color: "#7a6230", fontWeight: 950, marginBottom: 6 }}>TODAY 0-1 QUEST</p>
                <h2 style={{ color: "#fff", fontSize: 23, fontWeight: 950, lineHeight: 1.35 }}>{selected.shortTitle}任务单</h2>
              </div>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#e8c96a", fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 950 }}>
                <Trophy size={15} /> +{selected.xp}XP
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 8, marginBottom: 16 }}>
              <div style={{ border: "1px solid #242424", borderRadius: 8, padding: "10px 12px", background: "rgba(0,0,0,0.22)" }}>
                <p style={{ color: "#777", fontSize: 11, fontWeight: 900, marginBottom: 4 }}>预计用时</p>
                <p style={{ color: "#ddd", fontSize: 13, fontWeight: 900 }}>{selected.minutes}</p>
              </div>
              <div style={{ border: "1px solid #242424", borderRadius: 8, padding: "10px 12px", background: "rgba(0,0,0,0.22)" }}>
                <p style={{ color: "#777", fontSize: 11, fontWeight: 900, marginBottom: 4 }}>对应阶段</p>
                <p style={{ color: "#ddd", fontSize: 13, fontWeight: 900 }}>{selected.stage}</p>
              </div>
            </div>

            <div style={{ display: "grid", gap: 14, marginBottom: 18 }}>
              <TaskBlock title="今天只做这一步" items={[selected.firstStep]} />
              <TaskBlock title="准备材料" items={selected.materials} />
              <TaskBlock title="执行三步" items={selected.steps} />
            </div>

            <div style={{ border: "1px solid #242424", borderRadius: 10, padding: "14px 15px", background: "rgba(0,0,0,0.28)", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 9 }}>
                <p style={{ color: "#fff", fontSize: 13, fontWeight: 950 }}>复制给小白AI的提示词</p>
                <button type="button" onClick={() => copyText("prompt", selected.prompt)} style={{ border: "1px solid #3a321d", background: "rgba(201,168,76,0.08)", color: "#e8c96a", borderRadius: 8, padding: "7px 10px", display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 12, fontWeight: 900 }}>
                  {copied === "prompt" ? <Check size={13} /> : <Clipboard size={13} />} {copied === "prompt" ? "已复制" : "复制"}
                </button>
              </div>
              <p style={{ color: "#bbb", fontSize: 12, lineHeight: 1.8 }}>{selected.prompt}</p>
            </div>

            <div style={{ border: "1px solid #242424", borderRadius: 10, padding: "14px 15px", background: "rgba(0,0,0,0.2)", marginBottom: 16 }}>
              <p style={{ color: "#fff", fontSize: 13, fontWeight: 950, marginBottom: 8 }}>复盘开头</p>
              <p style={{ color: "#cdbb80", fontSize: 12, lineHeight: 1.8, marginBottom: 10 }}>{selected.recap}</p>
              <button type="button" onClick={() => copyText("recap", recapTemplate)} style={{ border: "1px solid #242424", background: "rgba(255,255,255,0.04)", color: "#ddd", borderRadius: 8, padding: "8px 10px", display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 12, fontWeight: 900 }}>
                {copied === "recap" ? <Check size={13} /> : <Clipboard size={13} />} {copied === "recap" ? "已复制模板" : "复制复盘模板"}
              </button>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link href={selected.href} className="btn-primary" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
                {selected.action} <ArrowRight size={14} />
              </Link>
              <Link href={selected.learnHref} className="btn-outline" style={{ textDecoration: "none" }}>补对应阶段</Link>
              <Link href="/community/new" className="btn-outline" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
                发复盘 <MessageCircle size={14} />
              </Link>
            </div>
          </aside>
        </section>

        <section style={{ border: "1px solid #2a1f10", background: "rgba(201,168,76,0.04)", borderRadius: 12, padding: "24px 26px" }}>
          <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 950, marginBottom: 10 }}>做完第一个环节以后</h2>
          <p style={{ color: "#ccc", fontSize: 14, lineHeight: 1.9, marginBottom: 16 }}>
            回到学习路径补对应能力：不会提问就补 L1，不会搭流程就补 L3，不懂 API 和模型名就补 L4，想让 AI 改代码就补 L5。学习不是目的，推进你想做成的事才是目的。
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href="/learn" className="btn-primary" style={{ textDecoration: "none" }}>回到学习主线</Link>
            <Link href="/cases" className="btn-outline" style={{ textDecoration: "none" }}>看别人怎么从0到1</Link>
            <Link href="/community/new" className="btn-outline" style={{ textDecoration: "none" }}>发我的0-1复盘</Link>
          </div>
        </section>
      </main>
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
