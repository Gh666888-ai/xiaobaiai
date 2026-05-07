import type { Metadata } from "next"
import type { ReactNode } from "react"
import { posts } from "@/data/community"

function findPost(id: string) {
  return posts.find((post) => post.id === id)
}

function text(value: string, length = 155) {
  return value.replace(/\s+/g, " ").trim().slice(0, length)
}

export async function generateStaticParams() {
  return posts.map((post) => ({ id: post.id }))
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const post = findPost(params.id)
  if (!post) {
    return {
      title: "AI社区帖子",
      alternates: { canonical: `/community/${params.id}` },
    }
  }

  const title = `${post.title} - AI社区`
  const description = text(post.content)
  const url = `/community/${encodeURIComponent(post.id)}`

  return {
    title,
    description,
    keywords: [post.title, post.category, ...post.tags, "AI社区", "Agent实战", "小白AI"],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      siteName: "小白AI",
      publishedTime: post.publishedAt,
      images: [{ url: "/xiaobai-mascot-cutout.png", alt: "小白AI" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/xiaobai-mascot-cutout.png"],
    },
  }
}

export default function CommunityPostLayout({ children, params }: { children: ReactNode; params: { id: string } }) {
  const post = findPost(params.id)
  const postJsonLd = post
    ? {
        "@context": "https://schema.org",
        "@type": "DiscussionForumPosting",
        headline: post.title,
        articleBody: text(post.content, 5000),
        keywords: post.tags.join(", "),
        datePublished: post.publishedAt,
        mainEntityOfPage: `https://www.xiaobaiai.cn/community/${encodeURIComponent(post.id)}`,
        url: `https://www.xiaobaiai.cn/community/${encodeURIComponent(post.id)}`,
        author: {
          "@type": "Person",
          name: post.author,
        },
        interactionStatistic: [
          {
            "@type": "InteractionCounter",
            interactionType: "https://schema.org/LikeAction",
            userInteractionCount: post.likes,
          },
          {
            "@type": "InteractionCounter",
            interactionType: "https://schema.org/CommentAction",
            userInteractionCount: post.comments,
          },
        ],
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
      {postJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(postJsonLd) }}
        />
      )}
      {children}
    </>
  )
}
