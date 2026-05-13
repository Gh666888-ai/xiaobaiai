import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react"
import { categories, stageLabels, tools } from "@/data/tools"
import { categoryPath, getToolAlternatives, getToolMeta, getToolTrustTags, toolPath } from "@/data/tool-meta"
import { ToolLogo } from "@/components/ToolLogo"
import { NavBar } from "@/components/NavBar"
import { BottomActionPanel } from "@/components/BottomActionPanel"
import styles from "@/components/learning/SupportPage.module.css"

export async function generateStaticParams() {
  return tools.map((tool) => ({ category: tool.category, id: tool.id }))
}

function findTool(categoryParam: string, id: string) {
  const category = decodeURIComponent(categoryParam)
  return tools.find((tool) => tool.category === category && tool.id === id)
}

function getRelatedLinks(tool: NonNullable<ReturnType<typeof findTool>>) {
  return [
    { href: "/choose-tool", label: "用工具选择器再判断一次" },
    { href: `/search?q=${encodeURIComponent(`${tool.name} 怎么用`)}`, label: `搜索 ${tool.name} 教程` },
    { href: "/learn", label: "回到学习路线" },
    { href: categoryPath(tool.category), label: "看同类工具" },
  ]
}

function getToolMvpMission(tool: NonNullable<ReturnType<typeof findTool>>) {
  if (tool.category.includes("编程") || tool.name.toLowerCase().includes("codex") || tool.name.toLowerCase().includes("claude code")) {
    return { href: "/missions/codex-small-feature", label: "用它改一个网页小功能" }
  }
  if (tool.category.includes("办公") || tool.tags.some((tag) => /ppt|文档|表格|会议/i.test(tag))) {
    return { href: "/missions/ai-ppt-first-deck", label: "做一个可展示 PPT" }
  }
  if (tool.category.includes("Agent") || tool.category.includes("平台") || tool.name.toLowerCase().includes("dify")) {
    return { href: "/missions/dify-knowledge-base-bot", label: "搭一个客服知识库 Bot" }
  }
  if (tool.category.includes("视频") || tool.category.includes("绘图") || tool.category.includes("写作") || tool.category.includes("营销")) {
    return { href: "/missions/xiaohongshu-ai-content-loop", label: "做一条内容生产流水线" }
  }
  if (tool.category.includes("搜索") || tool.category.includes("数据")) {
    return { href: "/missions/kimi-k26-long-doc", label: "整理一份行动清单" }
  }
  return { href: "/learn/tutorials", label: "找一个教程做最小成果" }
}

export function generateMetadata({ params }: { params: { category: string; id: string } }): Metadata {
  const tool = findTool(params.category, params.id)
  if (!tool) return {}
  const meta = getToolMeta(tool)
  const title = `${tool.name} 怎么用？${tool.category}工具教程、免费情况和替代品`
  const description = `${tool.name}：${tool.description} 小白AI整理它适合谁、怎么开始、免费情况、中文支持、上手难度和替代工具。`
  return {
    title,
    description,
    keywords: [tool.name, `${tool.name}怎么用`, `${tool.name}教程`, `${tool.name}替代品`, tool.category, ...tool.tags, "AI工具", "AI工具导航", meta.difficulty],
    alternates: { canonical: toolPath(tool) },
    openGraph: {
      title,
      description,
      url: toolPath(tool),
      type: "article",
      siteName: "小白AI",
      images: tool.logo ? [{ url: tool.logo, alt: tool.name }] : [{ url: "/xiaobai-mascot-cutout.png", alt: "小白AI" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: tool.logo ? [tool.logo] : ["/xiaobai-mascot-cutout.png"],
    },
  }
}

export default function ToolDetailPage({ params }: { params: { category: string; id: string } }) {
  const tool = findTool(params.category, params.id)
  if (!tool) notFound()
  const category = categories.find((item) => item.key === tool.category)
  const meta = getToolMeta(tool)
  const trustTags = getToolTrustTags(tool)
  const alternatives = getToolAlternatives(tool)
  const relatedLinks = getRelatedLinks(tool)
  const mvpMission = getToolMvpMission(tool)
  const toolActionFlow = [
    { title: "先打开工具", text: "只做一次 10 分钟试用，确认能注册、能输入、能得到结果。", href: tool.url, external: true },
    { title: "按教程做", text: "不要停在收藏工具，回到学习教程里按步骤产出交付物。", href: "/learn/tutorials" },
    { title: "做 MVP 任务", text: `下一步直接${mvpMission.label}，用结果验证工具是否真的适合你。`, href: mvpMission.href },
    { title: "看案例复盘", text: "做完后看别人怎么落地，再把自己的问题和结果沉淀下来。", href: "/member-cases" },
  ]

  const compare = [
    ["适合阶段", stageLabels[tool.stage] || `阶段 ${tool.stage}`],
    ["价格", tool.pricing],
    ["网络要求", meta.magicNetwork],
    ["中文支持", meta.chineseSupport],
    ["上手难度", meta.difficulty],
    ["新手指数", `${meta.newbieScore}/100`],
  ]

  const faqs = [
    {
      question: `${tool.name} 第一次怎么用？`,
      answer: `先用 ${tool.name} 完成一个 10 分钟小任务，不要一上来处理复杂项目。确认输出质量后，再把它纳入日常工作流。`,
    },
    {
      question: `${tool.name} 免费吗？`,
      answer: `当前标注为“${tool.pricing}”。实际价格、额度和地区限制可能变化，正式使用前以官网为准。`,
    },
    {
      question: `${tool.name} 适合新手吗？`,
      answer: `小白AI给出的难度判断是“${meta.difficulty}”，新手推荐指数为 ${meta.newbieScore}/100。建议先跟教程完成一次标准流程。`,
    },
  ]

  const toolJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    applicationCategory: tool.category,
    operatingSystem: "Web",
    description: tool.description,
    url: `https://www.xiaobaiai.cn${toolPath(tool)}`,
    sameAs: tool.url,
    image: tool.logo || "https://www.xiaobaiai.cn/xiaobai-mascot-cutout.png",
    offers: {
      "@type": "Offer",
      price: tool.pricing === "免费" ? "0" : undefined,
      priceCurrency: "CNY",
      availability: "https://schema.org/InStock",
    },
    isPartOf: {
      "@type": "WebSite",
      name: "小白AI",
      url: "https://www.xiaobaiai.cn",
    },
  }

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }

  return (
    <div className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <NavBar />
      <main className={styles.main}>
        <div className={styles.actions} style={{ marginTop: 0, marginBottom: 16 }}>
          <Link href="/tools" className={styles.ghostButton}><ArrowLeft size={14} /> 工具分类</Link>
          <Link href={categoryPath(tool.category)} className={styles.ghostButton}>{category?.label || tool.category}</Link>
        </div>

        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>{tool.category}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
              <ToolLogo name={tool.name} url={tool.url} logo={tool.logo} size={54} radius={14} />
              <h1 className={styles.title}>{tool.name}</h1>
            </div>
            <p className={styles.subtitle}>{tool.description}</p>
            <div className={styles.actions}>
              <a href={tool.url} target="_blank" rel="noopener noreferrer" className={styles.primaryButton}>
                访问官网 <ExternalLink size={14} />
              </a>
              <Link href="/learn" className={styles.secondaryButton}>回到学习路线</Link>
            </div>
          </div>
          <aside className={styles.heroAside}>
            <h2 className={styles.asideTitle}>小白判断卡</h2>
            <ol className={styles.steps}>
              <li><b>1</b><span>先确认它能不能解决你今天的具体任务。</span></li>
              <li><b>2</b><span>再看价格、网络、中文支持和上手难度。</span></li>
              <li><b>3</b><span>跑通后再进入教程或项目任务，不要停在收藏工具。</span></li>
            </ol>
          </aside>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <h2 className={styles.panelTitle}>先看能不能用</h2>
              <p className={styles.panelDesc}>这一块给新手做快速判断，避免只看工具名就注册、充值或折腾配置。</p>
            </div>
            <span className={styles.tag}>新手 {meta.newbieScore}/100</span>
          </div>
          <div className={styles.grid}>
            {trustTags.map((tag) => (
              <div key={tag.label} className={styles.card} style={{ minHeight: 132 }}>
                <span className={styles.tag}>{tag.label}</span>
                <p className={styles.cardText}>{tag.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.panel}>
          <h2 className={styles.panelTitle}>基础信息</h2>
          <div className={styles.grid} style={{ marginTop: 16 }}>
            {compare.map(([label, value]) => (
              <div key={label} className={styles.card} style={{ minHeight: 112 }}>
                <span className={styles.tag}>{label}</span>
                <h3 className={styles.cardTitle}>{value}</h3>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <h2 className={styles.panelTitle}>{tool.name} 怎么开始</h2>
              <p className={styles.panelDesc}>只保留第一次上手最关键的 3 步，后续深入练习回到学习路线和项目任务。</p>
            </div>
          </div>
          <div className={styles.grid}>
            {meta.quickStart.map((item, index) => (
              <div key={item} className={styles.card}>
                <span className={styles.tag}>STEP {index + 1}</span>
                <p className={styles.cardText}>{item}</p>
              </div>
            ))}
          </div>
          <p className={styles.panelDesc} style={{ marginTop: 14 }}>{meta.caution}</p>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <h2 className={styles.panelTitle}>看完详情后怎么落地</h2>
              <p className={styles.panelDesc}>工具详情页只解决“能不能用”。真正的判断标准是能不能做出一个 MVP。</p>
            </div>
          </div>
          <div className={styles.pathGrid}>
            {toolActionFlow.map((item, index) => (
              item.external ? (
                <a key={item.title} href={item.href} target="_blank" rel="noopener noreferrer" className={styles.pathCard}>
                  <span className={styles.pathNumber}>{index + 1}</span>
                  <strong className={styles.pathTitle}>{item.title}</strong>
                  <p className={styles.pathText}>{item.text}</p>
                  <span className={styles.pathAction}>进入 <ExternalLink size={13} /></span>
                </a>
              ) : (
                <Link key={item.title} href={item.href} className={styles.pathCard}>
                  <span className={styles.pathNumber}>{index + 1}</span>
                  <strong className={styles.pathTitle}>{item.title}</strong>
                  <p className={styles.pathText}>{item.text}</p>
                  <span className={styles.pathAction}>进入 <ArrowRight size={13} /></span>
                </Link>
              )
            ))}
          </div>
        </section>

        <section className={styles.panel}>
          <h2 className={styles.panelTitle}>适合谁</h2>
          <div className={styles.grid} style={{ marginTop: 16 }}>
            {meta.bestFor.map((item) => (
              <div key={item} className={styles.card}>
                <p className={styles.cardText}>{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.panel}>
          <h2 className={styles.panelTitle}>常见问题</h2>
          <div className={styles.sectionDivider} style={{ marginTop: 16 }}>
            {faqs.map((item) => (
              <details key={item.question} className={styles.details}>
                <summary>{item.question}</summary>
                <p className={styles.panelDesc}>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className={styles.panel}>
          <h2 className={styles.panelTitle}>继续学习</h2>
          <div className={styles.actions}>
            {relatedLinks.map((item) => (
              <Link key={item.href} href={item.href} className={styles.secondaryButton}>{item.label}</Link>
            ))}
          </div>
        </section>

        {alternatives.length > 0 && (
          <section className={styles.panel}>
            <h2 className={styles.panelTitle}>同类替代工具</h2>
            <div className={styles.grid} style={{ marginTop: 16 }}>
              {alternatives.map((item) => (
                <Link key={item.id} href={toolPath(item)} className={styles.card}>
                  <h3 className={styles.cardTitle}>{item.name}</h3>
                  <p className={styles.cardText}>{item.description}</p>
                  <span className={styles.cardLink}>查看替代方案 <ArrowRight size={13} /></span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <BottomActionPanel
          title="工具看完以后，必须进入一个具体任务"
          text={`${tool.name} 只是工作流里的一个环节。下一步用它做一个 MVP，再把过程沉淀成复盘，后面才能判断它是不是真的适合你。`}
          actions={[
            { href: mvpMission.href, label: mvpMission.label, tone: "primary" },
            { href: "/learn", label: "回学习路线" },
            { href: "/community", label: "写复盘或提问题" },
          ]}
        />
      </main>
    </div>
  )
}
