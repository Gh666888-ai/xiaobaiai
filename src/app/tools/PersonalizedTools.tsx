"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, Search, Sparkles } from "lucide-react"
import { recommendToolsForGoal } from "@/data/tool-recommendations"
import { toolPath } from "@/data/tool-meta"

const ONBOARDING_PROFILE_KEY = "xiaobaiai:onboarding-profile:v1"

export function PersonalizedTools() {
  const [goal, setGoal] = useState("")

  useEffect(() => {
    setGoal(window.localStorage.getItem(ONBOARDING_PROFILE_KEY) || "")
  }, [])

  const plan = recommendToolsForGoal(goal || "企业办公，想用 AI 做文档、PPT、知识库和周报", 6)
  const hasGoal = Boolean(goal.trim())

  return (
    <section style={{ border: "1px solid rgba(232,201,106,0.24)", background: "rgba(255,255,255,0.055)", borderRadius: 12, padding: "22px", marginBottom: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start", flexWrap: "wrap", marginBottom: 14 }}>
        <div style={{ flex: "1 1 460px" }}>
          <p style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#e8c96a", fontWeight: 950, marginBottom: 8 }}>
            <Sparkles size={16} />
            {hasGoal ? "按你告诉小白的方向推荐" : "还没告诉小白行业，先给你看通用办公路线"}
          </p>
          <h2 style={{ fontSize: 25, color: "#fff", fontWeight: 950, lineHeight: 1.35, marginBottom: 8 }}>{plan.shortTitle}先用这些工具</h2>
          <p style={{ fontSize: 16, color: "#d8d8d8", fontWeight: 750, lineHeight: 1.75, margin: 0 }}>
            {hasGoal ? `你上次说：${goal.slice(0, 90)}` : "登录后点击右下角小白，说你的行业和想完成的工作，这里会自动换成你的工具组合。"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event("xiaobai:open-goal-router"))}
          style={{ border: "1px solid #7a6230", borderRadius: 9, background: "rgba(201,168,76,0.14)", color: "#f0d77a", padding: "10px 14px", fontSize: 14, fontWeight: 950, cursor: "pointer" }}
        >
          让小白重新推荐
        </button>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        {plan.workflow.map((item, index) => (
          <span key={item} style={{ border: "1px solid rgba(255,255,255,0.12)", background: index === 0 ? "rgba(232,201,106,0.14)" : "rgba(0,0,0,0.22)", color: index === 0 ? "#f5d873" : "#ccc", borderRadius: 999, padding: "6px 10px", fontSize: 13, fontWeight: 900 }}>
            {index + 1}. {item}
          </span>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,250px),1fr))", gap: 10, marginBottom: 16 }}>
        {plan.tools.map((item, index) => (
          <Link key={item.tool.id} href={toolPath(item.tool)} style={{ textDecoration: "none" }}>
            <article style={{ height: "100%", border: "1px solid #242424", background: "rgba(0,0,0,0.28)", borderRadius: 10, padding: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <p style={{ fontSize: 12, color: "#9fc7ff", fontWeight: 950, marginBottom: 4 }}>{index + 1}. {item.role}</p>
                  <h3 style={{ fontSize: 18, color: "#fff", fontWeight: 950, lineHeight: 1.3, margin: 0 }}>{item.tool.name}</h3>
                </div>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 18, color: "#e8c96a", fontWeight: 950 }}>{item.score}</span>
              </div>
              <p style={{ fontSize: 14, color: "#d2d2d2", fontWeight: 700, lineHeight: 1.65, marginBottom: 12 }}>{item.reason}</p>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#e8c96a", fontSize: 13, fontWeight: 950 }}>
                看怎么用 <ArrowRight size={14} />
              </span>
            </article>
          </Link>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 10, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 14 }}>
        <p style={{ fontSize: 15, color: "#fff", fontWeight: 950, margin: 0 }}>配套 Skill</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {plan.skills.map((item) => (
            <Link key={item.skill.id} href="/skills" style={{ textDecoration: "none" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 7, border: "1px solid rgba(159,199,255,0.24)", background: "rgba(159,199,255,0.08)", color: "#cfe4ff", borderRadius: 8, padding: "7px 10px", fontSize: 13, fontWeight: 900 }}>
                {item.skill.name} {item.score}分
              </span>
            </Link>
          ))}
          <Link href="/skills" style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "#e8c96a", fontSize: 13, fontWeight: 950, textDecoration: "none", padding: "7px 4px" }}>
            去 Skill 推荐页 <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <form action="/search" style={{ display: "flex", alignItems: "center", height: 44, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.24)", borderRadius: 10, marginTop: 16 }}>
        <Search size={16} style={{ marginLeft: 14, color: "#aaa", flexShrink: 0 }} />
        <input
          name="q"
          type="search"
          placeholder="没看到想要的，再搜索工具或任务"
          style={{ flex: 1, minWidth: 0, border: "none", outline: "none", background: "transparent", color: "#fff", padding: "0 12px", fontSize: 15, fontWeight: 800, fontFamily: "'Noto Sans SC', sans-serif" }}
        />
        <button type="submit" style={{ height: 34, marginRight: 5, padding: "0 14px", border: "1px solid #333", borderRadius: 8, background: "rgba(255,255,255,0.06)", color: "#fff", fontSize: 12, fontWeight: 950, cursor: "pointer" }}>搜索</button>
      </form>
    </section>
  )
}
