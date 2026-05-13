"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { news } from "@/data/news"
import { buildNewsArticle } from "@/lib/content"
import { NavBar } from "@/components/NavBar"
import { inferContentVisualKind } from "@/components/ContentVisual"
import { SmartImage } from "@/components/SmartImage"
import { SeoKeywordLinks } from "@/components/SeoKeywordLinks"
import { SeoRelatedLinks } from "@/components/SeoRelatedLinks"
import { BottomActionPanel } from "@/components/BottomActionPanel"
import { newsImageSources } from "@/lib/news-images"
import styles from "@/components/learning/SupportPage.module.css"

type ArticleBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "code"; text: string }

function parseArticle(text: string): ArticleBlock[] {
  const blocks: ArticleBlock[] = []
  const lines = text.replace(/\r\n/g, "\n").split("\n")
  let paragraph: string[] = []
  let list: string[] = []
  let code: string[] = []
  let inCode = false

  const flushParagraph = () => {
    if (!paragraph.length) return
    blocks.push({ type: "paragraph", text: paragraph.join(" ") })
    paragraph = []
  }
  const flushList = () => {
    if (!list.length) return
    blocks.push({ type: "list", items: list })
    list = []
  }

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (line.startsWith("```")) {
      if (inCode) {
        blocks.push({ type: "code", text: code.join("\n").trim() })
        code = []
        inCode = false
      } else {
        flushParagraph()
        flushList()
        inCode = true
      }
      continue
    }
    if (inCode) {
      code.push(rawLine)
      continue
    }
    if (!line) {
      flushParagraph()
      flushList()
      continue
    }
    const heading = line.match(/^#{1,3}\s+(.+)$/)
    if (heading) {
      flushParagraph()
      flushList()
      blocks.push({ type: "heading", text: heading[1] })
      continue
    }
    const bullet = line.match(/^[-*]\s+(.+)$/) || line.match(/^\d+\.\s+(.+)$/)
    if (bullet) {
      flushParagraph()
      list.push(bullet[1])
      continue
    }
    flushList()
    paragraph.push(line)
  }

  flushParagraph()
  flushList()
  if (code.length) blocks.push({ type: "code", text: code.join("\n").trim() })
  return blocks
}

function cleanInlineMarkdown(text: string) {
  return text.replace(/`([^`]+)`/g, "$1")
}

function ArticleBody({ text }: { text: string }) {
  return (
    <>
      {parseArticle(text).map((block, index) => {
        if (block.type === "heading") {
          return <h2 key={index} className={styles.panelTitle} style={{ fontSize: 24, marginTop: 28 }}>{cleanInlineMarkdown(block.text)}</h2>
        }
        if (block.type === "code") {
          return (
            <pre key={index} style={{ margin: "14px 0 22px", whiteSpace: "pre-wrap", wordBreak: "break-word", border: "1px solid #dfe7ee", background: "#f7fbfd", borderRadius: 12, padding: 16, color: "#17202a", fontSize: 13, lineHeight: 1.8, fontFamily: "'JetBrains Mono', monospace" }}>
              {block.text}
            </pre>
          )
        }
        if (block.type === "list") {
          return (
            <div key={index} style={{ display: "grid", gap: 8, margin: "10px 0 20px" }}>
              {block.items.map((item, itemIndex) => (
                <p key={itemIndex} style={{ display: "flex", gap: 10, color: "#536170", fontSize: 16, lineHeight: 1.9, margin: 0 }}>
                  <span style={{ color: "#256d85", fontWeight: 950, flexShrink: 0 }}>{itemIndex + 1}.</span>
                  <span><SeoKeywordLinks text={cleanInlineMarkdown(item)} maxLinks={3} /></span>
                </p>
              ))}
            </div>
          )
        }
        return (
          <p key={index} style={{ color: "#536170", fontSize: 16, lineHeight: 2.05, margin: "0 0 16px" }}>
            <SeoKeywordLinks text={cleanInlineMarkdown(block.text)} maxLinks={6} />
          </p>
        )
      })}
    </>
  )
}

export default function NewsDetailPage() {
  const params = useParams()
  const [fetched, setFetched] = useState<any[]>([])

  useEffect(() => {
    fetch("/fetched-news.json")
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setFetched(data) })
      .catch(() => undefined)
  }, [])

  const item = [...news, ...fetched].find((entry: any) => entry.id === params.id)

  if (!item) {
    return (
      <div className={styles.page}>
        <NavBar />
        <main className={styles.main}>
          <section className={styles.panel}>
            <h1 className={styles.panelTitle}>这篇资讯不存在</h1>
            <Link href="/news" className={styles.primaryButton}>返回资讯</Link>
          </section>
        </main>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <NavBar />
      <main className={styles.main} style={{ maxWidth: 920 }}>
        <Link href="/news" className={styles.ghostButton} style={{ marginBottom: 16 }}>
          <ArrowLeft size={14} /> 返回资讯
        </Link>

        <section className={styles.panel}>
          <SmartImage
            sources={newsImageSources(item)}
            title={item.title}
            label={item.category}
            meta={`${item.source} · ${item.publishedAt}`}
            kind={inferContentVisualKind(`${item.category} ${item.title}`)}
            style={{ maxHeight: 400, marginBottom: 24 }}
            imageStyle={{ objectFit: "cover", background: "#f7fbfd", padding: 0 }}
          />
          <div className={styles.pillRow} style={{ marginBottom: 12 }}>
            <span className={styles.tag}>{item.category}</span>
            <span className={styles.tag}>{item.publishedAt}</span>
            <span className={styles.tag}>{item.source}</span>
            {item.importance >= 8 && <span className={styles.tag}>重要</span>}
          </div>
          <h1 className={styles.title} style={{ fontSize: 38 }}>{item.title}</h1>
        </section>

        <section className={styles.panel}>
          <div className={styles.details} style={{ background: "#f7fbfd" }}>
            <h2 className={styles.asideTitle}>小白先看这个</h2>
            <p className={styles.panelDesc}><SeoKeywordLinks text={item.summary} maxLinks={5} /></p>
          </div>
          <ArticleBody text={buildNewsArticle(item)} />
          <SeoRelatedLinks text={`${item.title}\n${item.summary}\n${buildNewsArticle(item)}`} title="相关教程" limit={6} />
          {item.url && item.url !== "#" && (
            <div className={styles.actions}>
              <a href={item.url} target="_blank" rel="noopener noreferrer" className={styles.secondaryButton}>
                参考来源 <ExternalLink size={14} />
              </a>
            </div>
          )}
        </section>

        <BottomActionPanel
          title="看完这篇资讯，下一步不要停在收藏"
          text="如果它是新工具或新趋势，先回到学习路线找对应小科目；如果已经有想法，就去工具页补齐工作流，再到实战展示看别人怎么落地。"
          actions={[
            { href: "/learn", label: "回学习路线", tone: "primary" },
            { href: "/tools", label: "找工具组合" },
            { href: "/member-cases", label: "看实战展示" },
          ]}
        />
      </main>
    </div>
  )
}

