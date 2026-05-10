import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, BookOpen, CheckCircle2, Layers, MessageCircle } from "lucide-react"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"
import { posts } from "@/data/community"
import { getMissionsForScenario } from "@/data/product-loop"
import { primaryScenario, scenarioFilters, scenarioLabel, type ContentScenario } from "@/lib/content-taxonomy"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata: Metadata = {
  title: "AI实战案例库 - 办公提效、Dify知识库、AI编程和内容创作案例",
  description: "小白AI实战案例库整理普通人能照着做的 AI 使用案例，覆盖办公提效、内容创作、AI绘图、Dify知识库、AI编程、Agent工作流和数据分析。",
  keywords: ["AI实战案例", "AI办公案例", "Dify案例", "AI编程案例", "AI工作流案例", "AI内容创作案例"],
  alternates: { canonical: "/cases" },
  openGraph: {
    title: "AI实战案例库 | 小白AI",
    description: "从真实场景出发，整理普通人能照着做的 AI 使用案例。",
    url: "/cases",
    images: [{ url: "/xiaobai-mascot-cutout.png", alt: "小白AI 实战案例库" }],
  },
}

const casePosts = posts
  .filter((post) => post.category !== "问题求助")
  .map((post) => ({ ...post, scenario: primaryScenario(post) }))

const featured = casePosts
  .filter((post) => ["office", "dify", "coding", "creator", "security", "newbie"].includes(post.scenario))
  .sort((a, b) => Number(b.likes || 0) - Number(a.likes || 0))
  .slice(0, 6)

const caseQualityRules = [
  "必须有做成的结果：文件、页面、Bot、流程、脚本、账号内容或上线记录。",
  "必须写清工具和步骤：用了什么、先做哪一步、哪里需要人工确认。",
  "必须保留失败点：卡在哪里、怎么修、下次怎么避免。",
  "只是观点、预测、榜单或求助帖，只能进社区，不直接包装成成功案例。",
]

const groups = scenarioFilters
  .filter((item): item is { key: ContentScenario; label: string; desc: string } => item.key !== "all")
  .map((scenario) => ({
    ...scenario,
    missions: getMissionsForScenario(scenario.key).slice(0, 2),
    posts: casePosts
      .filter((post) => post.scenario === scenario.key)
      .sort((a, b) => Number(b.pinned || false) - Number(a.pinned || false) || Number(b.likes || 0) - Number(a.likes || 0))
      .slice(0, 6),
  }))
  .filter((group) => group.posts.length > 0)

function excerpt(text: string) {
  return text.replace(/\s+/g, " ").slice(0, 118)
}

function postCaseSignals(post: any) {
  const text = `${post.title} ${post.content} ${post.tags?.join(" ") || ""}`
  return [
    /完成|做出|跑通|上线|上传|生成|节省|稳定|已/.test(text) ? "有结果" : "",
    /工具|方案|步骤|流程|提示词|配置/.test(text) ? "有过程" : "",
    /坑|失败|报错|风险|审核|修|排查|不要/.test(text) ? "有踩坑" : "",
  ].filter(Boolean)
}

function CaseCard({ post }: { post: any }) {
  const signals = postCaseSignals(post)
  return (
    <Link href={`/community/${post.id}`} style={{ display: "block", textDecoration: "none", border: "1px solid #1a1a1a", background: "rgba(255,255,255,0.026)", borderRadius: 10, padding: "18px 20px", minHeight: 206 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 10 }}>
        <span style={{ border: "1px solid #7a6230", color: "#e8c96a", borderRadius: 999, padding: "2px 8px", fontSize: 10, fontWeight: 900 }}>{scenarioLabel(post.scenario)}</span>
        <span style={{ color: "#777", fontSize: 11 }}>{post.category}</span>
      </div>
      <h3 style={{ color: "#fff", fontSize: 17, fontWeight: 950, lineHeight: 1.45, marginBottom: 9 }}>{post.title}</h3>
      <p style={{ color: "#bdbdbd", fontSize: 13, lineHeight: 1.8, marginBottom: 14 }}>{excerpt(post.content)}...</p>
      {signals.length > 0 && (
        <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:12}}>
          {signals.map((signal)=>(
            <span key={signal} style={{display:'inline-flex',alignItems:'center',gap:4,border:'1px solid rgba(159,214,174,0.24)',color:'#9fd6ae',borderRadius:999,padding:'2px 8px',fontSize:10,fontWeight:900}}>
              <CheckCircle2 size={11} /> {signal}
            </span>
          ))}
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", color: "#888", fontSize: 11 }}>
        <span>{post.author}</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
          <MessageCircle size={12} /> {post.comments || 0}
        </span>
      </div>
    </Link>
  )
}

export default function CasesPage() {
  return (
    <div style={{ background: "#000", minHeight: "100vh", fontFamily: "'Noto Sans SC', sans-serif", position: "relative", overflow: "hidden" }}>
      <MathRain />
      <NavBar />
      <main style={{ maxWidth: 1120, margin: "0 auto", padding: "64px 60px 104px", position: "relative", zIndex: 10, background: "rgba(0,0,0,0.9)" }} className="max-sm:px-4">
        <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.35em", color: "#7a6230", textTransform: "uppercase", marginBottom: 12, fontWeight: 900 }}>AI Case Library</p>
        <h1 style={{ fontSize: 42, color: "#fff", fontWeight: 950, lineHeight: 1.22, marginBottom: 14 }}>AI实战案例库</h1>
        <p style={{ fontSize: 16, color: "#ccc", lineHeight: 1.9, maxWidth: 860, marginBottom: 24 }}>
          这里不收“想法”和“榜单”，只沉淀已经跑通过的实战复盘：做出了什么、用了什么工具、过程怎么走、哪里失败过、别人能不能照着再做一次。
        </p>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 12, marginBottom: 36 }} className="max-sm:grid-cols-1">
          {[
            { icon: <BookOpen size={18} />, title: "先看案例", desc: "从真实场景理解 AI 能帮你做什么。" },
            { icon: <Layers size={18} />, title: "再看教程", desc: "遇到不懂的工具，再回到教程补基础。" },
            { icon: <MessageCircle size={18} />, title: "最后去社区", desc: "照着做时卡住了，发帖求助或补充经验。" },
          ].map((item) => (
            <div key={item.title} style={{ border: "1px solid #2a1f10", background: "rgba(201,168,76,0.045)", borderRadius: 10, padding: "18px 20px" }}>
              <div style={{ color: "#e8c96a", marginBottom: 10 }}>{item.icon}</div>
              <h2 style={{ color: "#fff", fontSize: 16, fontWeight: 950, marginBottom: 7 }}>{item.title}</h2>
              <p style={{ color: "#bbb", fontSize: 13, lineHeight: 1.75 }}>{item.desc}</p>
            </div>
          ))}
        </section>

        <section style={{ border: "1px solid rgba(159,214,174,0.2)", background: "rgba(159,214,174,0.055)", borderRadius: 12, padding: "20px 22px", marginBottom: 34 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "flex-start", flexWrap: "wrap", marginBottom: 12 }}>
            <div>
              <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.18em", color: "#9fd6ae", fontWeight: 900, marginBottom: 8 }}>CASE STANDARD</p>
              <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 950, lineHeight: 1.35, margin: 0 }}>小白AI里的“实战案例”要过这 4 条</h2>
            </div>
            <Link href="/community/new" className="btn-outline" style={{ textDecoration: "none" }}>提交跑通复盘</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
            {caseQualityRules.map((rule, index) => (
              <div key={rule} style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.22)", borderRadius: 10, padding: "14px 14px", minHeight: 112 }}>
                <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 950, color: "#9fd6ae", marginBottom: 8 }}>0{index + 1}</p>
                <p style={{ color: "#d6d6d6", fontSize: 13, fontWeight: 850, lineHeight: 1.75, margin: 0 }}>{rule}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 44 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "flex-end", flexWrap: "wrap", marginBottom: 16 }}>
            <div>
              <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 950, marginBottom: 7 }}>精选实战</h2>
              <p style={{ color: "#aaa", fontSize: 14, lineHeight: 1.8 }}>优先展示适合新手照着跑的内容，不追求大而全。</p>
            </div>
            <Link href="/community/new" className="btn-outline" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
              分享你的案例 <ArrowRight size={14} />
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: 12 }}>
            {featured.map((post) => <CaseCard key={post.id} post={post} />)}
          </div>
        </section>

        {groups.map((group) => (
          <section key={group.key} style={{ marginBottom: 44 }}>
            <div style={{ marginBottom: 16 }}>
              <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 950, marginBottom: 7 }}>{group.label}</h2>
              <p style={{ color: "#aaa", fontSize: 14, lineHeight: 1.8 }}>{group.desc}</p>
            </div>
            {group.missions.length > 0 && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
                {group.missions.map((mission) => (
                  <Link key={mission.id} href={`/missions/${mission.id}`} className="btn-outline" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 7 }}>
                    从任务开始：{mission.shortTitle} <ArrowRight size={13} />
                  </Link>
                ))}
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: 12 }}>
              {group.posts.map((post) => <CaseCard key={post.id} post={post} />)}
            </div>
          </section>
        ))}

        <section style={{ border: "1px solid #2a1f10", background: "rgba(201,168,76,0.04)", borderRadius: 12, padding: "24px 26px" }}>
          <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 950, marginBottom: 10 }}>案例库和社区有什么区别？</h2>
          <p style={{ color: "#ccc", fontSize: 14, lineHeight: 1.9, marginBottom: 16 }}>
            案例库负责整理精选内容，社区负责讨论、求助和发帖。以后新发的高质量帖子，会继续沉淀到案例库和专题页里。
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href="/tutorials" className="btn-primary" style={{ textDecoration: "none" }}>看教程大全</Link>
            <Link href="/community" className="btn-outline" style={{ textDecoration: "none" }}>去社区讨论</Link>
            <Link href="/topics/claude-code-deepseek" className="btn-outline" style={{ textDecoration: "none" }}>看 Claude Code 专题</Link>
            <Link href="/topics/dify" className="btn-outline" style={{ textDecoration: "none" }}>看 Dify 专题</Link>
          </div>
        </section>
      </main>
    </div>
  )
}
