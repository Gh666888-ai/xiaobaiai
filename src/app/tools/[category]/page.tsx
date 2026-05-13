import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { categories, tools } from "@/data/tools"
import { getToolMeta, toolPath } from "@/data/tool-meta"
import { ToolLogo } from "@/components/ToolLogo"
import { NavBar } from "@/components/NavBar"
import { CategoryIcon } from "@/components/CategoryIcon"
import { BottomActionPanel } from "@/components/BottomActionPanel"
import styles from "@/components/learning/SupportPage.module.css"

export async function generateStaticParams() {
  return categories.map((cat) => ({ category: cat.key }))
}

export function generateMetadata({ params }: { params: { category: string } }): Metadata {
  const category = decodeURIComponent(params.category)
  const cat = categories.find((item) => item.key === category)
  if (!cat) return {}
  const title = `${cat.label}工具推荐 - 小白AI`
  const description = `小白AI整理${cat.label}分类下的 AI 工具、免费情况、中文支持、上手难度和新手推荐指数。`
  return {
    title,
    description,
    keywords: [cat.label, `${cat.label}工具`, `${cat.label}工具推荐`, "AI工具导航", "AI工具大全", "免费AI工具"],
    alternates: { canonical: `/tools/${encodeURIComponent(category)}` },
    openGraph: {
      title,
      description,
      url: `/tools/${encodeURIComponent(category)}`,
      type: "website",
      siteName: "小白AI",
      images: [{ url: "/xiaobai-mascot-cutout.png", alt: "小白AI" }],
    },
  }
}

export default function ToolCategoryPage({ params }: { params: { category: string } }) {
  const category = decodeURIComponent(params.category)
  const cat = categories.find((item) => item.key === category)
  if (!cat) notFound()

  const items = tools
    .filter((tool) => tool.category === category)
    .sort((a, b) => Number(b.featured) - Number(a.featured) || b.rank - a.rank || a.stage - b.stage)

  const featured = items.filter((tool) => tool.featured).slice(0, 3)
  const firstFeatured = featured[0] || items[0]
  const categoryFlow = [
    { title: "先选一个工具", text: firstFeatured ? `从 ${firstFeatured.name} 或同类推荐开始，不要同时注册太多。` : "先从推荐工具里选一个最贴近当前任务的。", href: firstFeatured ? toolPath(firstFeatured) : "/tools" },
    { title: "看详情判断", text: "确认价格、网络要求、中文支持、上手难度和替代方案。", href: firstFeatured ? toolPath(firstFeatured) : "/tools" },
    { title: "回学习项目", text: "工具只是准备，真正成果在小科目、教程和任务里完成。", href: "/learn" },
    { title: "做一个 MVP", text: "用选好的工具交付一个最小结果，再去社区复盘。", href: "/learn/tutorials" },
  ]
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${cat.label}工具推荐`,
    description: `小白AI整理的${cat.label}工具、免费情况、中文支持和新手推荐。`,
    itemListElement: items.slice(0, 50).map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.name,
      url: `https://www.xiaobaiai.cn${toolPath(tool)}`,
      description: tool.description,
    })),
  }

  return (
    <div className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <NavBar />
      <main className={styles.main}>
        <Link href="/tools" className={styles.ghostButton} style={{ marginBottom: 16 }}>
          <ArrowLeft size={14} /> 返回工具分类
        </Link>

        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>Tool Category</p>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
              <CategoryIcon category={cat.key} size={30} />
              <h1 className={styles.title}>{cat.label}</h1>
            </div>
            <p className={styles.subtitle}>
              这一类共收录 {items.length} 个工具。先看推荐工具，再看完整清单；每个工具详情页都会说明适合谁、怎么开始、免费情况和替代方案。
            </p>
          </div>
          <aside className={styles.heroAside}>
            <h2 className={styles.asideTitle}>这一页怎么用</h2>
            <ol className={styles.steps}>
              <li><b>1</b><span>先选一个能完成当前任务的工具，不要同时试一堆。</span></li>
              <li><b>2</b><span>点进详情页看免费情况、网络要求、中文体验和新手指数。</span></li>
              <li><b>3</b><span>工具跑通后，回到学习路线或项目任务里产出结果。</span></li>
            </ol>
          </aside>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <h2 className={styles.panelTitle}>这一类工具怎么用到项目里</h2>
              <p className={styles.panelDesc}>分类页不只负责列工具，还要把用户带回能落地的学习项目。</p>
            </div>
          </div>
          <div className={styles.pathGrid}>
            {categoryFlow.map((item, index) => (
              <Link key={item.title} href={item.href} className={styles.pathCard}>
                <span className={styles.pathNumber}>{index + 1}</span>
                <strong className={styles.pathTitle}>{item.title}</strong>
                <p className={styles.pathText}>{item.text}</p>
                <span className={styles.pathAction}>进入 <ArrowRight size={13} /></span>
              </Link>
            ))}
          </div>
        </section>

        {featured.length > 0 && (
          <section className={styles.panel}>
            <div className={styles.panelHead}>
              <div>
                <h2 className={styles.panelTitle}>优先看这几个</h2>
                <p className={styles.panelDesc}>推荐工具放在前面，降低新手选择成本。</p>
              </div>
              <Link href="/learn" className={styles.ghostButton}>回到学习路线</Link>
            </div>
            <div className={styles.grid}>
              {featured.map((tool) => {
                const meta = getToolMeta(tool)
                return (
                  <Link key={tool.id} href={toolPath(tool)} className={styles.card}>
                    <div className={styles.cardTop}>
                      <ToolLogo name={tool.name} url={tool.url} logo={tool.logo} size={36} radius={10} />
                      <span className={styles.tag}>推荐 {meta.newbieScore}</span>
                    </div>
                    <h3 className={styles.cardTitle}>{tool.name}</h3>
                    <p className={styles.cardText}>{tool.description}</p>
                    <span className={styles.cardLink}>看详情 <ArrowRight size={13} /></span>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <h2 className={styles.panelTitle}>完整清单</h2>
              <p className={styles.panelDesc}>按推荐、排名和学习阶段排序。详情页保留更细的判断信息。</p>
            </div>
          </div>
          <div className={styles.grid}>
            {items.map((tool, index) => {
              const meta = getToolMeta(tool)
              return (
                <Link key={tool.id} href={toolPath(tool)} className={styles.card}>
                  <div className={styles.cardTop}>
                    <span className={styles.tag}>#{index + 1}</span>
                    {tool.featured && <span className={styles.tag}>推荐</span>}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                    <ToolLogo name={tool.name} url={tool.url} logo={tool.logo} size={34} radius={9} />
                    <h3 className={styles.cardTitle}>{tool.name}</h3>
                  </div>
                  <p className={styles.cardText}>{tool.description}</p>
                  <div className={styles.pillRow} style={{ marginTop: 14 }}>
                    <span className={styles.tag}>阶段 {tool.stage}</span>
                    <span className={styles.tag}>{tool.pricing}</span>
                    <span className={styles.tag}>{meta.difficulty}</span>
                    <span className={styles.tag}>新手 {meta.newbieScore}</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        <BottomActionPanel
          title={`${cat.label}工具选完以后，继续做一个能验收的结果`}
          text="工具分类页只负责帮你少走弯路，真正的进步发生在教程、任务和复盘里。先选一个工具，再做一个最小交付。"
          actions={[
            { href: firstFeatured ? toolPath(firstFeatured) : "/tools", label: "看推荐工具", tone: "primary" },
            { href: "/learn/tutorials", label: "找对应教程" },
            { href: "/community/new", label: "做完写复盘" },
          ]}
        />
      </main>
    </div>
  )
}
