"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AlertCircle, ClipboardCheck, Heart, MessageCircle, Pin, Search, Trophy } from "lucide-react"
import { posts as seedPosts } from "@/data/community"
import { NavBar } from "@/components/NavBar"
import { ContentVisual, inferContentVisualKind } from "@/components/ContentVisual"
import { SmartImage } from "@/components/SmartImage"
import { communityImage } from "@/lib/visual-assets"
import styles from "@/components/learning/SupportPage.module.css"

const cats = ["全部", "项目复盘", "问题求助", "踩坑修复", "案例沉淀", "工具流程"] as const
const PAGE_SIZE = 8

const reviewTypes = [
  { title: "项目复盘", icon: ClipboardCheck, text: "记录目标、工具、过程、交付物和验收结果，方便别人照着做。" },
  { title: "问题求助", icon: AlertCircle, text: "说清报错、截图、环境、已经试过的修法，便于获得可执行答案。" },
  { title: "案例沉淀", icon: Trophy, text: "把真实项目、行业做法、客户反馈和二次改进沉淀成可复用案例。" },
]

const communityStats = [
  { value: "复盘", label: "优先展示做过、跑通、有结果的内容" },
  { value: "问题", label: "保留具体问题和被认可的解决方案" },
  { value: "案例", label: "沉淀个人、一人公司、团队公司落地经验" },
  { value: "教程", label: "有价值内容会回流到学习路线和任务" },
]

function matchReviewCategory(selected: string, postCategory: string, text: string) {
  if (selected === "全部") return true
  if (selected === postCategory) return true
  if (selected === "项目复盘") return /经验分享|全自动实战|项目|复盘|实战/.test(`${postCategory} ${text}`)
  if (selected === "问题求助") return /问题求助|求助|报错|不会|失败|卡住/.test(`${postCategory} ${text}`)
  if (selected === "踩坑修复") return /踩坑记录|踩坑|修复|解决|错误|失败/.test(`${postCategory} ${text}`)
  if (selected === "案例沉淀") return /案例|结果|上线|客户|行业|展示/.test(`${postCategory} ${text}`)
  if (selected === "工具流程") return /工具|流程|自动化|Agent|Dify|n8n|Codex|Claude/.test(`${postCategory} ${text}`)
  return false
}

export default function CommunityPage() {
  const [cat, setCat] = useState<string>("全部")
  const [search, setSearch] = useState("")
  const [posts, setPosts] = useState<any[]>(seedPosts)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  useEffect(() => {
    const loadRemotePosts = () => Promise.all([
      window.location.hostname === "localhost" ? Promise.resolve([]) : fetch("/api/posts?status=approved").then((r) => r.json()).catch(() => []),
      fetch("/community-posts.json").then((r) => r.json()).catch(() => []),
    ]).then(([apiPosts, staticPosts]) => {
      const api = Array.isArray(apiPosts) ? apiPosts : []
      const st = Array.isArray(staticPosts) ? staticPosts : []
      const ids = new Set(api.map((p: any) => p.id))
      const seeded = [...api, ...st.filter((p: any) => !ids.has(p.id))]
      const seededIds = new Set(seeded.map((p: any) => p.id))
      setPosts([...seeded, ...seedPosts.filter((p: any) => !seededIds.has(p.id))])
    }).catch(() => {})

    if ("requestIdleCallback" in window) {
      ;(window as any).requestIdleCallback(loadRemotePosts, { timeout: 1800 })
    } else {
      setTimeout(loadRemotePosts, 500)
    }
  }, [])

  useEffect(() => { setVisibleCount(PAGE_SIZE) }, [cat, search])

  const authorName = (p: any) => p.author_name || p.author || "匿名用户"

  const filtered = posts.filter((p: any) => {
    const text = `${p.title} ${p.content} ${(p.tags || []).join(" ")}`
    if (!matchReviewCategory(cat, p.category || "", text)) return false
    if (search.trim() && !text.includes(search.trim())) return false
    return true
  }).sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  })

  return (
    <div className={styles.page}>
      <NavBar />
      <main className={styles.main}>
        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>Review Library</p>
            <h1 className={styles.title}>社区改成复盘库：只沉淀问题、过程和案例</h1>
            <p className={styles.subtitle}>这里不是普通聊天广场。它承接学习和项目后的结果：做过什么、卡在哪里、用了什么工具、最后怎么修、别人能不能复用。</p>
            <form className={styles.searchForm} onSubmit={(event) => event.preventDefault()}>
              <Search size={16} style={{ marginLeft: 14, color: "#256d85", flexShrink: 0 }} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜索帖子、工具、问题或行业" />
              <button type="submit">搜索</button>
            </form>
          </div>
          <aside className={styles.heroAside}>
            <h2 className={styles.asideTitle}>沉淀标准</h2>
            <ol className={styles.steps}>
              <li><b>1</b><span>先说明任务、行业或项目背景。</span></li>
              <li><b>2</b><span>必须写工具、过程、结果和失败点。</span></li>
              <li><b>3</b><span>能复用的经验会进入案例和教程资料。</span></li>
            </ol>
            <Link href="/community/new" className={styles.primaryButton}>发我的复盘</Link>
          </aside>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <p className={styles.eyebrow}>What Belongs Here</p>
              <h2 className={styles.panelTitle}>这里收什么内容</h2>
              <p className={styles.panelDesc}>用户一眼要知道：这里不是发动态，而是把学习和实战留下来的东西整理成可搜索、可复用的资料。</p>
            </div>
            <Link href="/member-cases" className={styles.ghostButton}>看实战展示</Link>
          </div>
          <div className={styles.communityStats}>
            {communityStats.map((item) => (
              <div key={item.value} className={styles.statCard}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
          <div className={styles.grid} style={{ marginTop: 14 }}>
            {reviewTypes.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className={styles.card} style={{ minHeight: 150 }}>
                  <div className={styles.cardTop}>
                    <Icon size={22} color="#256d85" />
                    <span className={styles.tag}>沉淀类型</span>
                  </div>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardText}>{item.text}</p>
                </div>
              )
            })}
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <p className={styles.eyebrow}>Knowledge Base</p>
              <h2 className={styles.panelTitle}>复盘、问题和案例</h2>
              <p className={styles.panelDesc}>真实经验、提示词、失败记录、结果截图和解决方案会优先展示；泛泛闲聊不作为主内容。</p>
            </div>
            <Link href="/community/new" className={styles.secondaryButton}><Trophy size={15} /> 提交复盘</Link>
          </div>

          <div className={styles.pillRow} style={{ marginBottom: 18 }}>
            {cats.map((item) => {
              const selected = cat === item
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCat(item)}
                  className={styles.tag}
                  style={{
                    border: selected ? "1px solid #256d85" : "1px solid #dfe7ee",
                    background: selected ? "#dff0f4" : "#fff",
                    cursor: "pointer",
                  }}
                >
                  {item}
                </button>
              )
            })}
          </div>

          <p className={styles.panelDesc} style={{ marginBottom: 18 }}>{filtered.length} 条沉淀内容</p>

          {filtered.length === 0 ? (
            <div className={styles.panel} style={{ textAlign: "center", boxShadow: "none" }}>没有找到相关帖子</div>
          ) : (
            <div className={styles.sectionDivider}>
              {filtered.slice(0, visibleCount).map((p: any) => {
                const image = p.image || p.cover || communityImage(`${p.category} ${p.title} ${(p.tags || []).join(" ")}`)
                return (
                  <article key={p.id} className={styles.card} style={{ minHeight: 0 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "230px minmax(0,1fr)", gap: 20, alignItems: "stretch" }} className="max-sm:grid-cols-1">
                      {image ? (
                        <SmartImage compact src={image} title={p.title} label={p.category} meta={`${p.likes || 0} likes`} kind={inferContentVisualKind(`${p.category} ${p.title} ${(p.tags || []).join(" ")}`, "community")} />
                      ) : (
                        <ContentVisual compact title={p.title} label={p.category} meta={`${p.likes || 0} likes`} kind={inferContentVisualKind(`${p.category} ${p.title} ${(p.tags || []).join(" ")}`, "community")} />
                      )}
                      <div style={{ minWidth: 0 }}>
                        <div className={styles.pillRow} style={{ marginBottom: 12 }}>
                          {p.pinned ? <span className={styles.tag}><Pin size={11} /> 置顶</span> : null}
                          <span className={styles.tag}>{p.category}</span>
                          <span className={styles.tag}>作者：{authorName(p)}</span>
                          <span className={styles.muted} style={{ fontSize: 12 }}>{p.publishedAt}</span>
                        </div>

                        <Link href={`/community/${p.id}`} style={{ textDecoration: "none" }}>
                          <h2 className={styles.cardTitle}>{p.title}</h2>
                        </Link>
                        <p className={styles.cardText} style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", whiteSpace: "pre-line" }}>{p.content}</p>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16, flexWrap: "wrap", gap: 10 }}>
                          <div className={styles.pillRow}>
                            {(Array.isArray(p.tags) ? p.tags : []).map((tag: any) => <span key={tag} className={styles.tag}>{tag}</span>)}
                          </div>
                          <div style={{ display: "flex", gap: 16, color: "#667586", fontSize: 13, fontWeight: 800 }}>
                            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Heart size={13} /> {p.likes || 0}</span>
                            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MessageCircle size={13} /> {p.comments_count || p.comments || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
              {visibleCount < filtered.length ? (
                <div style={{ display: "flex", justifyContent: "center", paddingTop: 14 }}>
                  <button onClick={() => setVisibleCount((v) => Math.min(v + PAGE_SIZE, filtered.length))} className={styles.secondaryButton} style={{ cursor: "pointer" }}>
                    加载更多沉淀 · {Math.min(PAGE_SIZE, filtered.length - visibleCount)}
                  </button>
                </div>
              ) : null}
            </div>
          )}
        </section>

        <section className={styles.panel}>
          <h2 className={styles.panelTitle}>做完以后内容去哪</h2>
          <p className={styles.panelDesc}>问题解决后进入复盘库；有结果的进入实战展示；能复用的步骤会整理进学习教程和任务。</p>
          <div className={styles.actions}>
            <Link href="/learn" className={styles.primaryButton}>回到学习路线</Link>
            <Link href="/member-cases" className={styles.secondaryButton}>看实战展示</Link>
            <Link href="/tools" className={styles.secondaryButton}>补工具组合</Link>
          </div>
        </section>
      </main>
      <style jsx>{`
        @media (max-width: 760px) {
          article :global(.max-sm\\:grid-cols-1) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
