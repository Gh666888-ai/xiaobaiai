"use client"

import { useState } from "react"
import type { CSSProperties } from "react"
import Link from "next/link"
import { NavBar } from "@/components/NavBar"

const goalOptions = [
  {
    group: "个人在家",
    label: "在家创业接单",
    desc: "不先谈赚钱，先做一个能展示的作品。",
    missionId: "xiaohongshu-ai-content-loop",
    prompt: "我想在家创业接单，不想出门。请给我推荐一个最容易开始的任务入口。我的情况先按：每天有一点时间、电脑基础一般、还不确定是否露脸。",
  },
  {
    group: "个人在家",
    label: "做内容账号",
    desc: "图文、短视频、AI漫剧先做一个样片。",
    missionId: "ai-comic-video-first-episode",
    prompt: "我想用 AI 做内容账号。请给我推荐一个最容易开始的任务入口，先从图文、短视频或 AI 漫剧里选。",
  },
  {
    group: "个人在家",
    label: "办公接单",
    desc: "PPT、简历、会议纪要先做一个样稿。",
    missionId: "ai-ppt-first-deck",
    prompt: "我想在家做办公接单。请给我推荐一个最容易开始的任务入口，先从 PPT、简历、会议纪要或资料整理里选。",
  },
  {
    group: "个人在家",
    label: "训练个人Agent",
    desc: "安装工具后设人设、记忆和验收标准。",
    missionId: "agent-skill-first-install",
    prompt: "我想训练一个个人 Agent 帮我做固定工作。请给我推荐一个最容易开始的任务入口，先从安装 Agent、配置模型、人设记忆开始。",
  },
  {
    group: "企业团队",
    label: "企业知识库客服",
    desc: "先整理 FAQ，再搭可测试客服助手。",
    missionId: "dify-knowledge-base-bot",
    prompt: "我们是企业团队，想用 AI 做知识库客服。请给我推荐一个最容易开始的任务入口，先从 FAQ、产品资料和人工接管边界开始。",
  },
  {
    group: "企业团队",
    label: "企业办公提效",
    desc: "会议纪要、SOP、周报日报、资料整理。",
    missionId: "kimi-k26-long-doc",
    prompt: "我们是企业团队，想用 AI 做办公提效。请给我推荐一个最容易开始的任务入口，先从资料读取、会议纪要、SOP 或周报日报开始。",
  },
  {
    group: "企业团队",
    label: "企业营销内容",
    desc: "产品资料、活动文案、销售话术、案例复盘。",
    missionId: "industry-skill-stack-plan",
    prompt: "我们是企业团队，想用 AI 做营销内容和销售支持。请给我推荐一个最容易开始的任务入口，先从产品资料、活动文案和销售话术开始。",
  },
  {
    group: "企业团队",
    label: "企业自动化流程",
    desc: "定时日报、通知、数据同步和流程提醒。",
    missionId: "n8n-ai-news-automation",
    prompt: "我们是企业团队，想用 AI 做自动化流程。请给我推荐一个最容易开始的任务入口，先从定时日报、通知、数据同步或流程提醒开始。",
  },
]

export function StartClient() {
  const [pickedOption, setPickedOption] = useState<(typeof goalOptions)[number] | null>(null)
  const personalOptions = goalOptions.filter((option) => option.group === "个人在家")
  const enterpriseOptions = goalOptions.filter((option) => option.group === "企业团队")

  function openGoalOption(option: (typeof goalOptions)[number]) {
    setPickedOption(option)
    window.dispatchEvent(new CustomEvent("xiaobai:open-goal-router", {
      detail: { goal: option.prompt, missionId: option.missionId, audience: option.group, label: option.label },
    }))
  }

  return (
    <div style={{ background: "linear-gradient(180deg,#07100f 0%,#0b0d0c 46%,#070707 100%)", minHeight: "100vh", fontFamily: "'Noto Sans SC', sans-serif", position: "relative" }}>
      <NavBar />
      <main style={mainStyle}>
        <section style={goalPanelStyle}>
          <p style={eyebrowStyle}>开始</p>
          <h1 style={goalTitleStyle}>你想用 AI 做什么？</h1>
          <p style={goalDescStyle}>
            个人和企业不要混在一起。先选你是哪一种，小白会给你一条能直接开始的任务路线；不想聊天，也可以直接点任务入口。
          </p>
          {pickedOption ? (
            <section style={pickedMissionStyle}>
              <div style={{minWidth:0}}>
                <p style={pickedEyebrowStyle}>推荐起步任务</p>
                <h2 style={pickedTitleStyle}>{pickedOption.label}</h2>
                <p style={pickedDescStyle}>{pickedOption.desc} 先用 30-90 分钟做出一个可检查结果，再让小白帮你复盘下一步。</p>
              </div>
              <Link href={`/missions/${pickedOption.missionId}`} style={pickedButtonStyle}>直接开始任务</Link>
            </section>
          ) : null}
          <GoalGroup title="个人在家" note="适合自己一个人在家先做作品、练接单、做内容。" options={personalOptions} onPick={openGoalOption} />
          <GoalGroup title="企业团队" note="适合公司、门店、团队先做流程提效和知识沉淀。" options={enterpriseOptions} onPick={openGoalOption} />
        </section>
      </main>
    </div>
  )
}

function GoalGroup({ title, note, options, onPick }: { title: string; note: string; options: typeof goalOptions; onPick: (option: (typeof goalOptions)[number]) => void }) {
  return (
    <div style={goalGroupStyle}>
      <div style={goalGroupHeadStyle}>
        <h2 style={goalGroupTitleStyle}>{title}</h2>
        <p style={goalGroupNoteStyle}>{note}</p>
      </div>
      <div style={goalGridStyle}>
        {options.map((option) => (
          <button key={option.label} type="button" onClick={() => onPick(option)} style={goalOptionStyle}>
            <span style={goalOptionTitleStyle}>{option.label}</span>
            <span style={goalOptionDescStyle}>{option.desc}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

const mainStyle: CSSProperties = {
  maxWidth: 860,
  margin: "0 auto",
  minHeight: "calc(100vh - 76px)",
  padding: "38px clamp(16px,5vw,42px) 76px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
}

const goalPanelStyle: CSSProperties = {
  border: "1px solid rgba(233,215,165,0.13)",
  background: "rgba(244,240,226,0.04)",
  borderRadius: 18,
  padding: "28px clamp(20px,4vw,34px)",
  boxShadow: "0 24px 70px rgba(0,0,0,0.28)",
}

const eyebrowStyle: CSSProperties = {
  color: "#d8bf76",
  fontSize: 15,
  fontWeight: 950,
  marginBottom: 10,
}

const goalTitleStyle: CSSProperties = {
  color: "#f8f3e6",
  fontSize: "clamp(34px,6vw,58px)",
  fontWeight: 950,
  lineHeight: 1.12,
  margin: 0,
}

const goalDescStyle: CSSProperties = {
  color: "#c8c8bd",
  fontSize: 17,
  fontWeight: 850,
  lineHeight: 1.8,
  margin: "12px 0 20px",
}

const pickedMissionStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr auto",
  alignItems: "center",
  gap: 14,
  border: "1px solid rgba(159,214,174,0.24)",
  background: "rgba(159,214,174,0.075)",
  borderRadius: 14,
  padding: "16px 16px",
  margin: "0 0 20px",
}

const pickedEyebrowStyle: CSSProperties = {
  color: "#9fd6ae",
  fontSize: 12,
  fontWeight: 950,
  margin: "0 0 6px",
}

const pickedTitleStyle: CSSProperties = {
  color: "#fff",
  fontSize: 20,
  fontWeight: 950,
  lineHeight: 1.32,
  margin: 0,
}

const pickedDescStyle: CSSProperties = {
  color: "#c8c8bd",
  fontSize: 14,
  fontWeight: 850,
  lineHeight: 1.7,
  margin: "7px 0 0",
}

const pickedButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 42,
  padding: "0 16px",
  borderRadius: 10,
  border: "1px solid rgba(159,214,174,0.42)",
  background: "rgba(159,214,174,0.12)",
  color: "#dcffe4",
  fontSize: 14,
  fontWeight: 950,
  textDecoration: "none",
  whiteSpace: "nowrap",
}

const goalGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,190px),1fr))",
  gap: 10,
}

const goalGroupStyle: CSSProperties = {
  borderTop: "1px solid rgba(255,255,255,0.08)",
  paddingTop: 18,
  marginTop: 18,
}

const goalGroupHeadStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 14,
  alignItems: "end",
  flexWrap: "wrap",
  marginBottom: 10,
}

const goalGroupTitleStyle: CSSProperties = {
  color: "#fff4c9",
  fontSize: 21,
  fontWeight: 950,
  lineHeight: 1.35,
  margin: 0,
}

const goalGroupNoteStyle: CSSProperties = {
  color: "#aaa59a",
  fontSize: 14,
  fontWeight: 850,
  lineHeight: 1.65,
  margin: 0,
}

const goalOptionStyle: CSSProperties = {
  minHeight: 112,
  border: "1px solid rgba(216,191,118,0.18)",
  background: "rgba(0,0,0,0.22)",
  borderRadius: 13,
  padding: "17px 18px",
  textAlign: "left",
  fontFamily: "'Noto Sans SC', sans-serif",
  cursor: "pointer",
}

const goalOptionTitleStyle: CSSProperties = {
  display: "block",
  color: "#fff4c9",
  fontSize: 19,
  fontWeight: 950,
  lineHeight: 1.35,
  marginBottom: 9,
}

const goalOptionDescStyle: CSSProperties = {
  display: "block",
  color: "#aaa59a",
  fontSize: 14,
  fontWeight: 850,
  lineHeight: 1.65,
}
