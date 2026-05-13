"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, Cpu, ExternalLink, Search, ShieldCheck, SlidersHorizontal, Trophy, Zap } from "lucide-react"
import { models, Model } from "@/data/models"
import { modelRankingMeta } from "@/data/model-meta"
import { NavBar } from "@/components/NavBar"
import { LiveEvaluationNotice } from "@/components/LiveEvaluationNotice"
import { BottomActionPanel } from "@/components/BottomActionPanel"
import styles from "@/components/learning/SupportPage.module.css"

type PriceSnapshot = {
  updatedAt: string
  priceBasis: string
  sources: { name: string; url: string; reachable?: boolean; status?: string }[]
  prices: { id: string; input: string; output: string; note: string }[]
}

const categoryLabels = ["对话", "编程", "绘图", "视频", "音频", "嵌入"]

function unique<T>(items: T[]) {
  return Array.from(new Set(items))
}

function typeLabel(type: string) {
  return type === "API" ? "API 模型" : "本地模型"
}

function categoryLabel(category: string, categories: string[]) {
  const index = categories.indexOf(category)
  return categoryLabels[index] || category
}

function priceOf(model: Model, snapshot: PriceSnapshot | null) {
  return snapshot?.prices.find((item) => item.id === model.id)?.input || model.pricing
}

function FilterButton({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        minHeight: 36,
        borderRadius: 999,
        border: active ? "1px solid #256d85" : "1px solid #cfd9e3",
        background: active ? "#dff0f4" : "#fff",
        color: active ? "#1d5f76" : "#536170",
        padding: "7px 12px",
        fontSize: 13,
        fontWeight: 900,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  )
}

function ModelCard({ model, price, categories }: { model: Model; price: string; categories: string[] }) {
  return (
    <a href={model.url} target="_blank" rel="noopener noreferrer" className={styles.card} style={{ minHeight: 210 }}>
      <div className={styles.cardTop}>
        <span className={styles.tag}>#{model.rank}</span>
        <span className={styles.tag}>{typeLabel(model.type)}</span>
      </div>
      <h3 className={styles.cardTitle}>{model.name}</h3>
      <p className={styles.cardText}>{model.description}</p>
      <div className={styles.pillRow} style={{ marginTop: 14 }}>
        <span className={styles.tag}>{model.provider}</span>
        <span className={styles.tag}>{categoryLabel(model.category, categories)}</span>
        <span className={styles.tag}>{price}</span>
      </div>
      <span className={styles.cardLink}>访问模型 <ExternalLink size={13} /></span>
    </a>
  )
}

export default function ModelsPage() {
  const [type, setType] = useState("全部")
  const [category, setCategory] = useState("全部")
  const [search, setSearch] = useState("")
  const [priceSnapshot, setPriceSnapshot] = useState<PriceSnapshot | null>(null)

  useEffect(() => {
    fetch("/model-prices.json")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data && setPriceSnapshot(data))
      .catch(() => setPriceSnapshot(null))
  }, [])

  const types = useMemo(() => unique(models.map((model) => model.type)), [])
  const categories = useMemo(() => unique(models.map((model) => model.category)), [])

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    return models
      .filter((model) => {
        if (type !== "全部" && model.type !== type) return false
        if (category !== "全部" && model.category !== category) return false
        if (!keyword) return true
        return [model.name, model.provider, model.description, model.useCase, model.tags.join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(keyword)
      })
      .sort((a, b) => a.rank - b.rank)
  }, [category, search, type])

  const apiModels = models.filter((model) => model.type === "API").sort((a, b) => a.rank - b.rank).slice(0, 3)
  const localModels = models.filter((model) => model.type !== "API").sort((a, b) => a.rank - b.rank).slice(0, 3)
  const beginnerPicks = [
    models.find((model) => model.name.toLowerCase().includes("deepseek")),
    models.find((model) => model.name.toLowerCase().includes("kimi")),
    localModels[0],
  ].filter((model): model is Model => Boolean(model))

  return (
    <div className={styles.page}>
      <NavBar />
      <main className={styles.main}>
        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>Model Library</p>
            <h1 className={styles.title}>先按任务选模型，再比较价格和场景</h1>
            <p className={styles.subtitle}>
              模型页保留独立入口，但不再做名次墙。新手先看推荐组合，进阶用户再展开完整模型清单、类型筛选和价格来源。
            </p>
            <form className={styles.searchForm} onSubmit={(event) => event.preventDefault()}>
              <Search size={16} style={{ marginLeft: 14, color: "#256d85", flexShrink: 0 }} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} type="search" placeholder="搜索模型、厂商、用途：DeepSeek、Kimi、编程、绘图" />
              <button type="submit">筛选</button>
            </form>
          </div>
          <aside className={styles.heroAside}>
            <h2 className={styles.asideTitle}>小白选模型顺序</h2>
            <ol className={styles.steps}>
              <li><b>1</b><span>日常写作、问答、办公，先选便宜稳定的 API 模型。</span></li>
              <li><b>2</b><span>写代码或接 Agent，再看上下文、工具调用和价格。</span></li>
              <li><b>3</b><span>涉及隐私、离线或内网资料，再考虑本地模型。</span></li>
            </ol>
          </aside>
        </section>

        <LiveEvaluationNotice scope="models" />

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <h2 className={styles.panelTitle}>选完模型之后去哪里</h2>
              <p className={styles.panelDesc}>模型只是大脑，不能停在对比表。选完以后要接工具、跑教程、做一个可验证 MVP。</p>
            </div>
          </div>
          <div className={styles.pathGrid}>
            {[
              { title: "选模型", text: "先确定云端 API、本地模型、价格和上下文是否适合当前任务。", href: "#model-list" },
              { title: "接 Agent", text: "把模型接进 Codex、Claude Code、OpenClaw、Cline 或桌面客户端。", href: "/agent-install" },
              { title: "做安装验证", text: "跑通一次模型回复和工具调用，确认不是只会聊天。", href: "/missions/agent-skill-first-install" },
              { title: "进入项目", text: "回到学习路线，用模型完成一个文档、Bot、页面或自动化流程。", href: "/learn" },
            ].map((item, index) => (
              <Link key={item.title} href={item.href} className={styles.pathCard}>
                <span className={styles.pathNumber}>{index + 1}</span>
                <strong className={styles.pathTitle}>{item.title}</strong>
                <p className={styles.pathText}>{item.text}</p>
                <span className={styles.pathAction}>进入 <ArrowRight size={13} /></span>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <h2 className={styles.panelTitle}>不知道选哪个，先从这 3 个方向开始</h2>
              <p className={styles.panelDesc}>这里不是强行推荐唯一答案，而是让不同目标的人先少走弯路：低成本、中文长文、离线私有化。</p>
            </div>
            <Link href="/learn" className={styles.ghostButton}>回到学习路线</Link>
          </div>
          <div className={styles.grid}>
            {beginnerPicks.map((model) => (
              <ModelCard key={model.id} model={model} price={priceOf(model, priceSnapshot)} categories={categories} />
            ))}
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <h2 className={styles.panelTitle}>快速对比</h2>
              <p className={styles.panelDesc}>只展示前几项，避免新手第一次进来就被完整清单淹没。</p>
            </div>
            <span className={styles.tag}><ShieldCheck size={14} /> 模型不是 Agent</span>
          </div>
          <div className={styles.grid}>
            <div className={styles.card}>
              <div className={styles.cardTop}>
                <Cpu size={22} color="#256d85" />
                <span className={styles.tag}>TOP API</span>
              </div>
              <h3 className={styles.cardTitle}>适合接入工具和 Agent</h3>
              <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
                {apiModels.map((model, index) => (
                  <a key={model.id} href={model.url} target="_blank" rel="noopener noreferrer" style={{ display: "grid", gridTemplateColumns: "32px minmax(0,1fr) auto", gap: 10, alignItems: "center", color: "inherit", textDecoration: "none" }}>
                    <b style={{ color: "#256d85" }}>#{index + 1}</b>
                    <span style={{ minWidth: 0, fontSize: 14, fontWeight: 900, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{model.name}</span>
                    <span className={styles.tag}>{priceOf(model, priceSnapshot)}</span>
                  </a>
                ))}
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardTop}>
                <Zap size={22} color="#2f7d4d" />
                <span className={styles.tag}>TOP 本地</span>
              </div>
              <h3 className={styles.cardTitle}>适合隐私、离线和低成本试验</h3>
              <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
                {localModels.map((model, index) => (
                  <a key={model.id} href={model.url} target="_blank" rel="noopener noreferrer" style={{ display: "grid", gridTemplateColumns: "32px minmax(0,1fr) auto", gap: 10, alignItems: "center", color: "inherit", textDecoration: "none" }}>
                    <b style={{ color: "#2f7d4d" }}>#{index + 1}</b>
                    <span style={{ minWidth: 0, fontSize: 14, fontWeight: 900, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{model.name}</span>
                    <span className={styles.tag}>本地运行</span>
                  </a>
                ))}
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardTop}>
                <Trophy size={22} color="#256d85" />
                <span className={styles.tag}>新手组合</span>
              </div>
              <h3 className={styles.cardTitle}>一个日常模型，一个工程模型，一个本地备选</h3>
              <p className={styles.cardText}>先跑通任务，再追求最强。真正要比较时，看价格、上下文、稳定性、中文体验和能不能接进你的工具链。</p>
              <div className={styles.actions}>
                <Link href="/agent-install" className={styles.secondaryButton}>接入 Agent</Link>
              </div>
            </div>
          </div>
        </section>

        <details id="model-list" className={styles.details} open>
          <summary>展开完整模型清单和筛选</summary>
          <div style={{ display: "grid", gap: 16, paddingTop: 18 }}>
            <div className={styles.pillRow}>
              <span className={styles.tag}><SlidersHorizontal size={13} /> 类型</span>
              <FilterButton active={type === "全部"} onClick={() => setType("全部")}>全部</FilterButton>
              {types.map((item) => (
                <FilterButton key={item} active={type === item} onClick={() => setType(item)}>{typeLabel(item)}</FilterButton>
              ))}
            </div>
            <div className={styles.pillRow}>
              <span className={styles.tag}>场景</span>
              <FilterButton active={category === "全部"} onClick={() => setCategory("全部")}>全部</FilterButton>
              {categories.map((item) => (
                <FilterButton key={item} active={category === item} onClick={() => setCategory(item)}>{categoryLabel(item, categories)}</FilterButton>
              ))}
            </div>
            <p className={styles.muted} style={{ margin: 0, fontSize: 14, fontWeight: 800 }}>当前显示 {filtered.length} 个模型</p>
            <div className={styles.grid}>
              {filtered.map((model) => (
                <ModelCard key={model.id} model={model} price={priceOf(model, priceSnapshot)} categories={categories} />
              ))}
            </div>
          </div>
        </details>

        <details className={styles.details}>
          <summary>价格来源和选择说明</summary>
          <div style={{ display: "grid", gap: 14, paddingTop: 16 }}>
            <div className={styles.grid}>
              <div className={styles.card} style={{ minHeight: 120 }}>
                <span className={styles.tag}>更新时间</span>
                <h3 className={styles.cardTitle}>{modelRankingMeta.updatedAt}</h3>
              </div>
              <div className={styles.card} style={{ minHeight: 120 }}>
                <span className={styles.tag}>价格口径</span>
                <h3 className={styles.cardTitle}>公开 API 标价</h3>
              </div>
              <div className={styles.card} style={{ minHeight: 120 }}>
                <span className={styles.tag}>来源数量</span>
                <h3 className={styles.cardTitle}>{modelRankingMeta.sources.length} 个来源</h3>
              </div>
            </div>
            <p className={styles.panelDesc} style={{ margin: 0 }}>
              价格会随官方策略、地区、促销、缓存、批量折扣和中转站变化。这里用于帮助新手形成选择判断，正式接入前仍应以官方控制台为准。
            </p>
            {priceSnapshot && (
              <p className={styles.panelDesc} style={{ margin: 0 }}>
                自动价格快照：{new Date(priceSnapshot.updatedAt).toLocaleString("zh-CN", { hour12: false })}。{priceSnapshot.priceBasis}
              </p>
            )}
            <div className={styles.pillRow}>
              {modelRankingMeta.sources.map((source) => (
                <a key={source.name} href={source.url} target="_blank" rel="noopener noreferrer" className={styles.tag} style={{ textDecoration: "none" }}>{source.name}</a>
              ))}
            </div>
          </div>
        </details>

        <BottomActionPanel
          title="模型选完以后，继续接到真实工作流"
          text="不要停在模型对比。下一步要么安装 Agent，要么回学习路线做一个小成果，再把结果放进实战复盘里。"
          actions={[
            { href: "/agent-install", label: "安装 Agent", tone: "primary" },
            { href: "/learn", label: "回学习路线" },
            { href: "/tools", label: "配工具链" },
          ]}
        />
      </main>
    </div>
  )
}
