import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, CheckCircle2, Trophy } from "lucide-react"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"
import { MissionContinuePanel } from "@/components/MissionContinuePanel"
import { industrySeries } from "@/data/industry-series"
import { missions } from "@/data/missions"
import { posts } from "@/data/community"

export const metadata: Metadata = {
  title: "AI实战任务 - 小白AI从0到1任务库",
  description: "小白AI实战任务库，把 Claude Code、DeepSeek V4、Kimi K2.6、Dify、n8n 和内容创作整理成可交付的从0到1任务。",
  keywords: ["AI实战任务", "AI从0到1", "Claude Code DeepSeek", "Kimi K2.6", "Dify知识库", "n8n自动化"],
  alternates: { canonical: "/missions" },
}

export default function MissionsPage() {
  const firstMissions = missions.slice(0, 4)

  return (
    <div className="xb-workbench" style={{ background: "#000", minHeight: "100vh", fontFamily: "'Noto Sans SC', sans-serif", position: "relative", overflow: "hidden" }}>
      <MathRain />
      <NavBar />
      <main className="xb-workbench-main" style={{ maxWidth: 1120, margin: "0 auto", padding: "64px clamp(16px,5vw,60px) 104px", position: "relative", zIndex: 10, background: "rgba(0,0,0,0.9)" }}>
        <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.34em", color: "#7a6230", textTransform: "uppercase", marginBottom: 12, fontWeight: 900 }}>Mission Library</p>
        <h1 style={{ fontSize: 42, color: "#fff", fontWeight: 950, lineHeight: 1.22, marginBottom: 14 }}>小白AI实战任务库</h1>
        <p style={{ fontSize: 16, color: "#ccc", lineHeight: 1.9, maxWidth: 860, marginBottom: 24 }}>
          每个任务都不是“下载工具 + 复制提示词”。小白会带你跑通结果、验收好坏、二次修改、沉淀复盘。你做过的进度会被记住，下次回来继续。
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 38 }}>
          <Link href="/learn#learn-start" className="btn-primary" style={{ textDecoration: "none" }}>让小白推荐今天任务</Link>
          <Link href="/community/new" className="btn-outline" style={{ textDecoration: "none" }}>发任务复盘</Link>
          <Link href="/learn" className="btn-outline" style={{ textDecoration: "none" }}>学习主线</Link>
        </div>

        <MissionContinuePanel title="回来先接着上次做" casePosts={posts} />

        <section style={{ border: "1px solid #2a1f10", background: "rgba(201,168,76,0.045)", borderRadius: 12, padding: "22px 24px", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 14, flexWrap: "wrap", marginBottom: 14 }}>
            <div>
              <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.22em", color: "#7a6230", textTransform: "uppercase", fontWeight: 950, marginBottom: 8 }}>Start Today</p>
              <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 950, lineHeight: 1.35, marginBottom: 8 }}>今天只选一个任务</h2>
              <p style={{ color: "#bbb", fontSize: 13, lineHeight: 1.85 }}>不用先看完整任务库。先做一个能交付的小结果，再学会验收、改稿和复盘。</p>
            </div>
            <Link href="/learn#learn-start" className="btn-primary" style={{ textDecoration: "none" }}>让小白带我选</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,240px),1fr))", gap: 10 }}>
            {firstMissions.map((mission) => (
              <Link key={mission.id} href={`/missions/${mission.id}`} style={{ textDecoration: "none", border: "1px solid #2b2618", background: "rgba(0,0,0,0.25)", borderRadius: 10, padding: "17px 18px", minHeight: 188, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
                  <span className="tag tag-gold" style={{ fontSize: 11, color: "#e8c96a", fontWeight: 950 }}>{mission.difficulty}</span>
                  <span style={{ color: "#e8c96a", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 950 }}>+{mission.xp}XP</span>
                </div>
                <h3 style={{ color: "#fff", fontSize: 17, fontWeight: 950, lineHeight: 1.38, marginBottom: 8 }}>{mission.title}</h3>
                <p style={{ color: "#aaa", fontSize: 12, lineHeight: 1.7, flex: 1 }}>{mission.tagline}</p>
                <span style={{ color: "#e8c96a", fontSize: 12, fontWeight: 950, marginTop: 12, display: "inline-flex", alignItems: "center", gap: 7 }}>
                  开始 <ArrowRight size={13} />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <details style={{ border: "1px solid #2a1f10", background: "rgba(201,168,76,0.035)", borderRadius: 12, padding: "16px 18px", marginBottom: 18 }}>
          <summary style={{ color: "#e8c96a", fontSize: 14, fontWeight: 950, cursor: "pointer" }}>展开行业任务路线</summary>
        <section style={{ paddingTop: 18 }}>
          <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.22em", color: "#7a6230", textTransform: "uppercase", fontWeight: 950, marginBottom: 8 }}>Industry Tracks</p>
          <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 950, lineHeight: 1.35, marginBottom: 9 }}>按行业从前到后做</h2>
          <p style={{ color: "#bbb", fontSize: 13, lineHeight: 1.85, marginBottom: 16 }}>
            不同人不该走同一条学习路线。电商先做商品资料和客服，老师先做课件和答疑，自媒体先做选题和样片；每条线都从第一个可交付结果开始，再往知识库、自动化和复盘延伸。
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,260px),1fr))", gap: 10 }}>
            {industrySeries.map((series) => (
              <Link key={series.id} href="/learn#learn-start" style={{ textDecoration: "none", border: "1px solid #2b2618", background: "rgba(0,0,0,0.24)", borderRadius: 10, padding: "15px 16px", minHeight: 176, display: "flex", flexDirection: "column" }}>
                <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 950, lineHeight: 1.4, marginBottom: 7 }}>{series.shortTitle}</h3>
                <p style={{ color: "#aaa", fontSize: 12, lineHeight: 1.7, marginBottom: 12 }}>{series.promise}</p>
                <div style={{ marginTop: "auto", display: "grid", gap: 6 }}>
                  {series.steps.slice(0, 3).map((step, index) => (
                    <p key={`${series.id}-${step.title}`} style={{ color: "#cfcfcf", fontSize: 11, lineHeight: 1.45, display: "grid", gridTemplateColumns: "18px 1fr", gap: 6 }}>
                      <span style={{ color: "#e8c96a", fontFamily: "'JetBrains Mono',monospace", fontWeight: 950 }}>{index + 1}</span>
                      <span>{step.title}</span>
                    </p>
                  ))}
                  <span style={{ color: "#e8c96a", fontSize: 12, fontWeight: 950, display: "inline-flex", alignItems: "center", gap: 7, marginTop: 5 }}>
                    让小白按这个行业带路 <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
        </details>

        <details style={{ border: "1px solid #1f1f1f", background: "rgba(255,255,255,0.022)", borderRadius: 12, padding: "16px 18px" }}>
          <summary style={{ color: "#e8c96a", fontSize: 14, fontWeight: 950, cursor: "pointer" }}>展开全部任务库</summary>
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))", gap: 14, paddingTop: 18 }}>
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
                  <CheckCircle2 size={14} style={{ color: "#3DA563" }} /> 跑通 · 验收 · 迭代 · 复盘
                </p>
                <span style={{ color: "#e8c96a", fontSize: 13, fontWeight: 950, display: "inline-flex", alignItems: "center", gap: 8 }}>
                  开始任务 <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </section>
        </details>
      </main>
    </div>
  )
}
