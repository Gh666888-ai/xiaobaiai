import type { Metadata } from "next"
import type { ReactNode } from "react"
import { news } from "@/data/news"

const siteUrl = "https://www.xiaobaiai.cn"

function findNews(id: string) {
  return news.find((item) => item.id === id)
}

function text(value: string, length = 155) {
  return value.replace(/\s+/g, " ").trim().slice(0, length)
}

export async function generateStaticParams() {
  return news.map((item) => ({ id: item.id }))
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const item = findNews(params.id)
  if (!item) {
    return {
      title: "AI资讯详情",
      alternates: { canonical: `/news/${params.id}` },
    }
  }

  const title = `${item.title} - AI资讯`
  const description = text(item.summary || item.content || item.title)
  const url = `/news/${encodeURIComponent(item.id)}`

  return {
    title,
    description,
    keywords: [item.title, item.category, item.source, "AI资讯", "AI新闻", "小白AI"],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      siteName: "小白AI",
      publishedTime: item.publishedAt,
      images: item.image ? [{ url: item.image, alt: item.title }] : [{ url: "/xiaobai-mascot-cutout.png", alt: "小白AI" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: item.image ? [item.image] : ["/xiaobai-mascot-cutout.png"],
    },
  }
}

export default function NewsDetailLayout({ children, params }: { children: ReactNode; params: { id: string } }) {
  const item = findNews(params.id)
  const articleJsonLd = item
    ? {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        headline: item.title,
        description: text(item.summary || item.content || item.title, 300),
        image: item.image ? [item.image] : ["https://www.xiaobaiai.cn/xiaobai-mascot-cutout.png"],
        datePublished: item.publishedAt,
        dateModified: item.publishedAt,
        mainEntityOfPage: `https://www.xiaobaiai.cn/news/${encodeURIComponent(item.id)}`,
        articleSection: item.category,
        author: {
          "@type": "Organization",
          name: item.source || "小白AI",
        },
        publisher: {
          "@type": "Organization",
          name: "小白AI",
          logo: {
            "@type": "ImageObject",
            url: "https://www.xiaobaiai.cn/xiaobai-icon-192.png?v=3",
          },
        },
      }
    : null

  return (
    <>
      {articleJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
      )}
      {children}
    </>
  )
}
