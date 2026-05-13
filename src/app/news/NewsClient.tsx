"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, Search } from "lucide-react"
import { news, newsCategories, NewsCategory } from "@/data/news"
import { NavBar } from "@/components/NavBar"
import { inferContentVisualKind } from "@/components/ContentVisual"
import { SmartImage } from "@/components/SmartImage"
import { newsImageSources } from "@/lib/news-images"
import styles from "@/components/learning/SupportPage.module.css"

function fmt(date: string) {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 86400000)
  if (diff === 0) return "今天"
  if (diff === 1) return "昨天"
  if (diff < 7) return `${diff}天前`
  return date
}

const INITIAL_VISIBLE_NEWS = 8
const NEWS_LOAD_STEP = 16
const helpfulEvolutions = [
  {
    title: "更自然的语音 AI",
    text: "实时语音、低延迟对话和更强的情绪/语气理解，让老人、孩子、视障用户和普通人更容易直接开口使用 AI。",
    source: "OpenAI 实时语音模型",
    href: "https://openai.com/index/introducing-our-next-generation-audio-models/",
    action: "/learn/subjects/personal-growth",
  },
  {
    title: "医学和生命科学 AI",
    text: "AI 开始帮助医生做信息整理、诊断辅助和生命科学研究，真正价值不是替代医生，而是减少漏看和提高研究效率。",
    source: "OpenAI / Google Health",
    href: "https://openai.com/index/healthbench/",
    action: "/learn/subjects/industry-playbooks",
  },
  {
    title: "工作 Agent 和代码助手",
    text: "Agent 能读项目、改文件、跑检查、整理知识库，最直接帮助个人和团队把重复工作变成可复用流程。",
    source: "Anthropic Claude / OpenAI Codex",
    href: "https://www.anthropic.com/news",
    action: "/learn/subjects/agent-coding",
  },
  {
    title: "低成本开源和本地模型",
    text: "开源模型、本地模型和更便宜的 API 让个人、一人公司、小团队也能用 AI 做客服、内容、数据和自动化。",
    source: "DeepSeek / Qwen / Ollama",
    href: "https://ollama.com",
    action: "/models",
  },
  {
    title: "多模态内容生产",
    text: "图片、视频、音频、PPT 和网页生成能力继续进化，个人可以更快做出可展示作品，企业能更快完成素材和培训内容。",
    source: "Google / OpenAI 多模态进展",
    href: "https://blog.google/technology/ai/",
    action: "/learn/subjects/content-creation",
  },
  {
    title: "AI 教育和个性化学习",
    text: "AI 能按个人水平解释概念、生成练习、检查作业和规划路线，最适合帮助普通人从不会到能做出结果。",
    source: "Google Education AI",
    href: "https://blog.google/outreach-initiatives/education/",
    action: "/learn",
  },
]

export default function NewsPage() {
  const [cat, setCat] = useState<NewsCategory | null>(null)
  const [query, setQuery] = useState("")
  const [fetched, setFetched] = useState<any[]>([])
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_NEWS)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const c = params.get("category")
    if (c && newsCategories.some((x) => x.key === c)) setCat(c as NewsCategory)
    const loadFetched = () => fetch("/fetched-news.json").then((r) => r.json()).then((data) => { if (Array.isArray(data)) setFetched(data) }).catch(() => {})
    if ("requestIdleCallback" in window) {
      ;(window as any).requestIdleCallback(loadFetched, { timeout: 2600 })
    } else {
      setTimeout(loadFetched, 1200)
    }
  }, [])

  useEffect(() => { setVisibleCount(INITIAL_VISIBLE_NEWS) }, [cat, query])

  const sorted = useMemo(() => {
    let result = [...news, ...fetched]
    if (cat) result = result.filter((item: any) => item.category === cat)
    const q = query.trim().toLowerCase()
    if (q) {
      result = result.filter((item: any) => `${item.title || ""} ${item.summary || ""} ${item.category || ""} ${item.source || ""}`.toLowerCase().includes(q))
    }
    return result.sort((a: any, b: any) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime() || b.importance - a.importance)
  }, [cat, fetched, query])
  const latestNews = sorted.slice(0, 5)
  const leadNews = latestNews[0]
  const secondaryNews = latestNews.slice(1)
  const categoryCounts = useMemo(() => {
    const all = [...news, ...fetched]
    return newsCategories.map((item) => ({
      ...item,
      count: all.filter((newsItem: any) => newsItem.category === item.key).length,
      latest: all
        .filter((newsItem: any) => newsItem.category === item.key)
        .sort((a: any, b: any) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())[0],
    }))
  }, [fetched])

  return (
    <div className={styles.page}>
      <NavBar />
      <main className={styles.main}>
        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>News Feed</p>
            <h1 className={styles.title}>AI资讯，一眼看到最近发生了什么</h1>
            <p className={styles.subtitle}>先看最新 AI 新闻，再按产品发布、教程资源、开源项目、深度解读等方向选择自己想看的内容。</p>
            <div className={styles.actions}>
              <Link href="/member-cases" className={styles.primaryButton}>看实战展示</Link>
              <Link href="/news/human-benefit" className={styles.secondaryButton}>看 AI 进化专题</Link>
              <Link href="/learn" className={styles.secondaryButton}>回学习地图</Link>
            </div>
            <form className={styles.searchForm} onSubmit={(event) => event.preventDefault()}>
              <Search size={16} style={{ marginLeft: 14, color: "#256d85", flexShrink: 0 }} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="搜索资讯：Claude Code、DeepSeek、Sora、Dify、AI PPT" />
              <button type="submit">搜索</button>
            </form>
          </div>
          <aside className={styles.heroAside}>
            <h2 className={styles.asideTitle}>怎么看资讯</h2>
            <ol className={styles.steps}>
              <li><b>1</b><span>先看它能不能改变你的工具选择。</span></li>
              <li><b>2</b><span>能落地的教程继续整理进学习系统。</span></li>
              <li><b>3</b><span>真实过程和结果放进实战展示。</span></li>
            </ol>
          </aside>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <p className={styles.eyebrow}>Latest AI News</p>
              <h2 className={styles.panelTitle}>最近 AI 新闻</h2>
              <p className={styles.panelDesc}>按重要性和发布时间排序。第一眼先知道最近有什么，再决定要不要继续看某一类。</p>
            </div>
            <Link href="#news-list" className={styles.ghostButton}>看全部资讯</Link>
          </div>

          {leadNews ? (
            <div className={styles.newsPortalGrid}>
              <Link href={`/news/${leadNews.id}`} className={`${styles.card} ${styles.newsLeadCard}`}>
                <SmartImage sources={newsImageSources(leadNews)} title={leadNews.title} label={leadNews.category} meta={leadNews.source} kind={inferContentVisualKind(`${leadNews.category} ${leadNews.title}`)} imageStyle={{ objectFit: "cover", background: "#f1f7f9", padding: 0 }} style={{ height: 268, aspectRatio: "16 / 9", flex: "0 0 auto" }} />
                <div className={styles.pillRow} style={{ marginTop: 16 }}>
                  <span className={styles.tag}>{leadNews.category}</span>
                  <span className={styles.tag}>{fmt(leadNews.publishedAt)}</span>
                  <span className={styles.tag}>{leadNews.source}</span>
                  {leadNews.importance >= 8 ? <span className={styles.tag}>重磅</span> : null}
                </div>
                <h3 className={styles.cardTitle} style={{ fontSize: 26, marginTop: 12 }}>{leadNews.title}</h3>
                <p className={styles.cardText}>{leadNews.summary}</p>
                <span className={styles.cardLink}>查看这条新闻 <ArrowRight size={14} /></span>
              </Link>

              <div className={styles.newsSideList}>
                {secondaryNews.map((item: any) => (
                  <Link key={item.id} href={`/news/${item.id}`} className={`${styles.card} ${styles.newsSideCard}`}>
                    <div className={styles.pillRow} style={{ marginBottom: 8 }}>
                      <span className={styles.tag}>{item.category}</span>
                      <span className={styles.tag}>{fmt(item.publishedAt)}</span>
                    </div>
                    <h3 className={styles.newsSideTitle}>{item.title}</h3>
                    <p className={styles.newsSideText}>{item.summary}</p>
                  </Link>
                ))}
              </div>
            </div>
          ) : <div className={styles.card}>暂无资讯</div>}
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <p className={styles.eyebrow}>Human Benefit</p>
              <h2 className={styles.panelTitle}>最近 AI 进化里，最能帮助普通人的方向</h2>
              <p className={styles.panelDesc}>这里不追热点名词，只看它能不能让人更省时间、更安全、更容易学习、更快做出结果。</p>
            </div>
            <Link href="/news/human-benefit" className={styles.ghostButton}>进入专题页</Link>
          </div>
          <div className={styles.evolutionGrid}>
            {helpfulEvolutions.map((item) => (
              <div key={item.title} className={`${styles.card} ${styles.evolutionCard}`}>
                <span className={styles.tag}>{item.source}</span>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardText}>{item.text}</p>
                <div className={styles.actions} style={{ marginTop: 14 }}>
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className={styles.secondaryButton}>来源</a>
                  <Link href={item.action} className={styles.primaryButton}>去学习</Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <p className={styles.eyebrow}>Choose Topic</p>
              <h2 className={styles.panelTitle}>选择你想看的方向</h2>
              <p className={styles.panelDesc}>不想看全部，就按自己的目的选：看新产品、找教程、追开源项目、读深度解读或关注监管。</p>
            </div>
            {cat ? <button type="button" onClick={() => setCat(null)} className={styles.ghostButton} style={{ cursor: "pointer" }}>清除筛选</button> : null}
          </div>
          <div className={styles.pathGrid}>
            {categoryCounts.map((item, index) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setCat(cat === item.key ? null : item.key)}
                className={styles.pathCard}
                style={{ cursor: "pointer", textAlign: "left", borderColor: cat === item.key ? "#256d85" : undefined, background: cat === item.key ? "#f1fbfd" : undefined }}
              >
                <span className={styles.pathNumber}>{index + 1}</span>
                <strong className={styles.pathTitle}>{item.label}</strong>
                <p className={styles.pathText}>{item.latest ? `最近：${item.latest.title}` : "这一类内容正在补充。"}</p>
                <span className={styles.pathAction}>{item.count} 条资讯</span>
              </button>
            ))}
          </div>
        </section>

        <section id="news-list" className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <p className={styles.eyebrow}>Filtered Feed</p>
              <h2 className={styles.panelTitle}>{cat ? `${cat}资讯` : "全部 AI 资讯"}</h2>
              <p className={styles.panelDesc}>优先显示安装、配置、教程和对新手有用的内容。你也可以继续搜索具体工具、模型或公司。</p>
            </div>
          </div>

          <div className={styles.pillRow} style={{ marginBottom: 20 }}>
            <button onClick={() => setCat(null)} className={styles.tag} style={{ border: !cat ? "1px solid #256d85" : "1px solid #dfe7ee", background: !cat ? "#dff0f4" : "#fff", cursor: "pointer" }}>全部</button>
            {newsCategories.map((item) => (
              <button key={item.key} onClick={() => setCat(cat === item.key ? null : item.key)} className={styles.tag} style={{ border: cat === item.key ? "1px solid #256d85" : "1px solid #dfe7ee", background: cat === item.key ? "#dff0f4" : "#fff", cursor: "pointer" }}>{item.label}</button>
            ))}
          </div>

          <p className={styles.panelDesc} style={{ marginBottom: 18 }}>{sorted.length} 条资讯</p>

          {sorted.length === 0 ? (
            <div className={styles.card}>没有资讯</div>
          ) : (
            <div className={styles.sectionDivider}>
              {sorted.slice(0, visibleCount).map((item: any) => (
                <Link key={item.id} href={`/news/${item.id}`} className={styles.card} style={{ minHeight: 0 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "210px minmax(0, 1fr)", gap: 18, alignItems: "stretch" }} className="news-row">
                    <SmartImage compact sources={newsImageSources(item)} title={item.title} label={item.category} meta={item.source} kind={inferContentVisualKind(`${item.category} ${item.title}`)} imageStyle={{ objectFit: "cover", background: "#f1f7f9", padding: 0 }} />
                    <div>
                      <div className={styles.pillRow} style={{ marginBottom: 8 }}>
                        <span className={styles.tag}>{item.category}</span>
                        <span className={styles.tag}>{fmt(item.publishedAt)}</span>
                        <span className={styles.tag}>{item.source}</span>
                        {item.importance >= 8 ? <span className={styles.tag}>重磅</span> : null}
                      </div>
                      <h3 className={styles.cardTitle}>{item.title}</h3>
                      <p className={styles.cardText}>{item.summary}</p>
                      <span className={styles.cardLink}>查看详情 <ArrowRight size={14} /></span>
                    </div>
                  </div>
                </Link>
              ))}
              {visibleCount < sorted.length ? (
                <div style={{ display: "flex", justifyContent: "center", paddingTop: 16 }}>
                  <button onClick={() => setVisibleCount((count) => Math.min(count + NEWS_LOAD_STEP, sorted.length))} className={styles.secondaryButton} style={{ cursor: "pointer" }}>加载更多资讯</button>
                </div>
              ) : null}
            </div>
          )}
        </section>
      </main>
      <style jsx>{`
        @media (max-width: 720px) {
          .news-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
