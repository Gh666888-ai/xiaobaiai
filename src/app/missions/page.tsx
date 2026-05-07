import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, CheckCircle2, Trophy } from "lucide-react"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"
import { missions } from "@/data/missions"

export const metadata: Metadata = {
  title: "AI实战任务 - 小白AI从0到1任务库",
  description: "小白AI实战任务库，把 Claude Code、DeepSeek V4、Kimi K2.6、Dify、n8n 和内容创作整理成可交付的从0到1任务。",
  keywords: ["AI实战任务", "AI从0到1", "Claude Code DeepSeek", "Kimi K2.6", "Dify知识库", "n8n自动化"],
  alternates: { canonical: "/missions" },
}

export default function MissionsPage() {
  return (
    <div style={{ background: "#000", minHeight: "100vh", fontFamily: "'Noto Sans SC', sans-serif", position: "relative", overflow: "hidden" }}>
      <MathRain />
      <NavBar />
      <main style={{ maxWidth: 1120, margin: "0 auto", padding: "64px clamp(16px,5vw,60px) 104px", position: "relative", zIndex: 10, background: "rgba(0,0,0,0.9)" }}>
        <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.34em", color: "#7a6230", textTransform: "uppercase", marginBottom: 12, fontWeight: 900 }}>Mission Library</p>
        <h1 style={{ fontSize: 42, color: "#fff", fontWeight: 950, lineHeight: 1.22, marginBottom: 14 }}>小白AI实战任务库</h1>
        <p style={{ fontSize: 16, color: "#ccc", lineHeight: 1.9, maxWidth: 860, marginBottom: 24 }}>
          每个任务都不是“看一篇教程”，而是围绕一个真实目标，拆成能交付、能检查、能复盘的小步骤。你做过的进度会被小白记住，下次回来继续。
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 38 }}>
          <Link href="/start" className="btn-primary" style={{ textDecoration: "none" }}>让小白推荐今天任务</Link>
          <Link href="/community/new" className="btn-outline" style={{ textDecoration: "none" }}>发任务复盘</Link>
          <Link href="/learn" className="btn-outline" style={{ textDecoration: "none" }}>学习主线</Link>
        </div>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))", gap: 14 }}>
          {missions.map((mission) => (
            <Link key={mission.id} href={`/missions/${mission.id}`} style={{ textDecoration: "none", border: "1px solid #1a1a1a", background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "22px 24px", display: "flex", flexDirection: "column", minHeight: 330 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
                <span className="tag tag-gold" style={{ fontSize: 10 }}>{mission.difficulty}</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#e8c96a", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 950 }}>
                  <Trophy size={14} /> +{mission.xp}XP
                </span>
              </div>
              <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 950, lineHeight: 1.4, marginBottom: 10 }}>{mission.title}</h2>
              <p style={{ color: "#bbb", fontSize: 13, lineHeight: 1.8, marginBottom: 14 }}>{mission.tagline}</p>
              <p style={{ color: "#888", fontSize: 12, lineHeight: 1.75, marginBottom: 14 }}>{mission.outcome}</p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
                {mission.tags.slice(0, 4).map((tag) => <span key={tag} className="tag tag-gray" style={{ fontSize: 10 }}>{tag}</span>)}
              </div>
              <div style={{ marginTop: "auto", display: "grid", gap: 9 }}>
                <p style={{ color: "#cdbb80", fontSize: 12, fontWeight: 900 }}>{mission.stage} · {mission.minutes}</p>
                <p style={{ color: "#ddd", fontSize: 12, display: "flex", alignItems: "center", gap: 7 }}>
                  <CheckCircle2 size={14} style={{ color: "#3DA563" }} /> {mission.steps.length} 步交付闭环
                </p>
                <span style={{ color: "#e8c96a", fontSize: 13, fontWeight: 950, display: "inline-flex", alignItems: "center", gap: 8 }}>
                  开始任务 <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </section>
      </main>
    </div>
  )
}
