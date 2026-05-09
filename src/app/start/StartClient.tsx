"use client"

import type { CSSProperties } from "react"
import { NavBar } from "@/components/NavBar"

const goalOptions = [
  {
    label: "在家创业接单",
    desc: "不先谈赚钱，先做一个能展示的作品。",
    prompt: "我想在家创业接单，不想出门。请给我推荐一个最容易开始的任务入口。我的情况先按：每天有一点时间、电脑基础一般、还不确定是否露脸。",
  },
  {
    label: "提高工作效率",
    desc: "把日报、PPT、表格、资料整理交给 AI。",
    prompt: "我想用 AI 提高现在工作的效率。请给我推荐一个最容易开始的任务入口，先从办公、资料、PPT 或表格里选。",
  },
  {
    label: "做内容账号",
    desc: "图文、短视频、AI漫剧先做一个样片。",
    prompt: "我想用 AI 做内容账号。请给我推荐一个最容易开始的任务入口，先从图文、短视频或 AI 漫剧里选。",
  },
  {
    label: "训练个人Agent",
    desc: "安装工具后设人设、记忆和验收标准。",
    prompt: "我想训练一个个人 Agent 帮我做固定工作。请给我推荐一个最容易开始的任务入口，先从安装 Agent、配置模型、人设记忆开始。",
  },
]

export function StartClient() {
  function openGoalOption(prompt: string) {
    window.dispatchEvent(new CustomEvent("xiaobai:open-goal-router", { detail: { goal: prompt } }))
  }

  return (
    <div style={{ background: "linear-gradient(180deg,#07100f 0%,#0b0d0c 46%,#070707 100%)", minHeight: "100vh", fontFamily: "'Noto Sans SC', sans-serif", position: "relative" }}>
      <NavBar />
      <main style={mainStyle}>
        <section style={goalPanelStyle}>
          <p style={eyebrowStyle}>开始</p>
          <h1 style={goalTitleStyle}>你想用 AI 做什么？</h1>
          <p style={goalDescStyle}>
            先点一个方向。小白会在右下角给你一个任务入口，你自己点进去开始，不会突然跳转。
          </p>
          <div style={goalGridStyle}>
            {goalOptions.map((option) => (
              <button key={option.label} type="button" onClick={() => openGoalOption(option.prompt)} style={goalOptionStyle}>
                <span style={goalOptionTitleStyle}>{option.label}</span>
                <span style={goalOptionDescStyle}>{option.desc}</span>
              </button>
            ))}
          </div>
        </section>
      </main>
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

const goalGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,190px),1fr))",
  gap: 10,
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
