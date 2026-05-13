"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { CheckCircle2, Heart, MessageCircle, Pin } from "lucide-react"
import { posts } from "@/data/community"
import { NavBar } from "@/components/NavBar"
import { ContentVisual, inferContentVisualKind } from "@/components/ContentVisual"
import { SmartImage } from "@/components/SmartImage"
import { SeoKeywordLinks } from "@/components/SeoKeywordLinks"
import { SeoRelatedLinks } from "@/components/SeoRelatedLinks"
import { COMMUNITY_REWARDS } from "@/data/growth"
import { useAuth } from "@/lib/AuthContext"
import { readAppAuth } from "@/lib/app-auth"
import { communityImage } from "@/lib/visual-assets"
import styles from "@/components/learning/SupportPage.module.css"

type CommunityComment = {
  id: string
  post_id: string
  author_id?: string
  author_name: string
  author_xp?: number
  content: string
  status?: string
  is_accepted?: boolean
  accepted_at?: string
  created_at?: string
}

function formatCommentTime(value?: string) {
  if (!value) return "刚刚"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "刚刚"
  const diff = Date.now() - date.getTime()
  if (diff < 60_000) return "刚刚"
  if (diff < 3_600_000) return `${Math.max(1, Math.floor(diff / 60_000))} 分钟前`
  if (diff < 86_400_000) return `${Math.max(1, Math.floor(diff / 3_600_000))} 小时前`
  return date.toISOString().slice(0, 10)
}

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, refresh } = useAuth()
  const postId = Array.isArray(params.id) ? params.id[0] : String(params.id || "")
  const [staticPosts, setStaticPosts] = useState<any[]>([])
  const [apiPosts, setApiPosts] = useState<any[]>([])
  const [comments, setComments] = useState<CommunityComment[]>([])
  const [commentText, setCommentText] = useState("")
  const [commentLoading, setCommentLoading] = useState(false)
  const [commentError, setCommentError] = useState("")
  const [acceptingCommentId, setAcceptingCommentId] = useState("")

  useEffect(() => {
    fetch("/community-posts.json").then((r) => r.json()).then((d) => { if (Array.isArray(d)) setStaticPosts(d) }).catch(() => {})
    fetch("/api/posts?status=approved").then((r) => r.json()).then((d) => { if (Array.isArray(d)) setApiPosts(d) }).catch(() => {})
  }, [])

  const allPosts = [...posts, ...staticPosts, ...apiPosts]
  const post = allPosts.find((p) => String(p.id) === postId)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post ? (post.likes || 0) : 0)
  const [showCommentBox, setShowCommentBox] = useState(false)

  useEffect(() => { if (post) setLikeCount(post.likes || 0) }, [post])

  useEffect(() => {
    if (!postId) return
    let cancelled = false
    fetch(`/api/comments?postId=${encodeURIComponent(postId)}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && Array.isArray(d)) setComments(d)
      })
      .catch(() => {
        if (!cancelled) setComments([])
      })
    return () => { cancelled = true }
  }, [postId])

  async function submitComment() {
    setCommentError("")
    const content = commentText.trim()
    if (!content) {
      setCommentError("先写一点内容，小白才知道你想补充什么。")
      return
    }
    if (content.length < 2) {
      setCommentError("再多说一点点，别让别人猜。")
      return
    }
    if (content.length > 800) {
      setCommentError("评论先控制在 800 字以内，长文可以单独发复盘。")
      return
    }
    const token = readAppAuth()?.session?.access_token
    if (!token) {
      setCommentError(`登录后评论 +${COMMUNITY_REWARDS.commentXP}XP。`)
      router.push(`/login?redirect=${encodeURIComponent(`/community/${postId}`)}`)
      return
    }
    setCommentLoading(true)
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ postId, content }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error(data?.error || "评论发送失败")
      if (data?.status === "pending") {
        setCommentError("评论已提交，包含链接或敏感信息，小白审核后再展示。")
      } else if (data?.status === "hidden") {
        setCommentError("评论已提交，但命中风险词，暂不公开展示。")
      } else {
        setComments((prev) => [...prev, data])
        setCommentError(data?.reward_mode === "contribution"
          ? `评论已发布，+${Number(data?.contribution || 0)} 贡献值。`
          : `评论已发布，+${Number(data?.awarded || COMMUNITY_REWARDS.commentXP)}XP。`)
        await refresh().catch(() => undefined)
      }
      setCommentText("")
    } catch (error: any) {
      setCommentError(error?.message || "评论发送失败，请稍后再试。")
    } finally {
      setCommentLoading(false)
    }
  }

  async function acceptComment(comment: CommunityComment) {
    setCommentError("")
    const token = readAppAuth()?.session?.access_token
    if (!token) {
      router.push(`/login?redirect=${encodeURIComponent(`/community/${postId}`)}`)
      return
    }
    setAcceptingCommentId(comment.id)
    try {
      const res = await fetch("/api/comments", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: "accept", postId, commentId: comment.id }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error(data?.error || "认可失败，请稍后再试。")
      setComments((prev) => prev.map((item) => (
        item.id === comment.id
          ? { ...item, ...data, is_accepted: true }
          : { ...item, is_accepted: false }
      )))
      setCommentError(data?.reward_mode === "contribution"
        ? `已认可这条解决方案，答主 +${Number(data?.contribution || 0)} 贡献值。`
        : `已认可这条解决方案，答主 +${Number(data?.awarded || 0)}XP。`)
      await refresh().catch(() => undefined)
    } catch (error: any) {
      setCommentError(error?.message || "认可失败，请稍后再试。")
    } finally {
      setAcceptingCommentId("")
    }
  }

  const sortedComments = [...comments].sort((a, b) => {
    if (a.is_accepted && !b.is_accepted) return -1
    if (!a.is_accepted && b.is_accepted) return 1
    return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
  })

  const displayCommentCount = Math.max(Number(post?.comments_count ?? post?.comments ?? 0), comments.length)

  if (!post) return (
    <div className={styles.page}>
      <NavBar />
      <main className={styles.main}>
        <section className={styles.panel} style={{ textAlign: "center" }}>
          <p className={styles.eyebrow}>404</p>
          <h1 className={styles.panelTitle}>这条复盘暂时找不到</h1>
          <div className={styles.actions} style={{ justifyContent: "center" }}>
            <button onClick={() => router.push("/community")} className={styles.primaryButton} style={{ cursor: "pointer" }}>返回复盘库</button>
          </div>
        </section>
      </main>
    </div>
  )

  const authorName = post.author_name || post.author || "匿名用户"
  const isPostAuthor = Boolean(user?.userId && post.author_id && user.userId === post.author_id)
  const isQuestionPost = String(post.category || "").includes("问题") || String(post.title || "").includes("？") || String(post.title || "").includes("?")
  const visualSource = post.image || post.cover || communityImage(`${post.category} ${post.title} ${(post.tags || []).join(" ")}`)

  return (
    <div className={styles.page}>
      <NavBar />
      <main className={styles.main}>
        <button onClick={() => router.push("/community")} className={styles.ghostButton} style={{ marginBottom: 16, cursor: "pointer" }}>返回复盘库</button>

        <section className={styles.hero}>
          <div>
            <div className={styles.pillRow} style={{ marginBottom: 14 }}>
              {post.pinned && <span className={styles.tag}><Pin size={11} /> 置顶</span>}
              <span className={styles.tag}>{post.category}</span>
              <span className={styles.tag}>作者：{authorName}</span>
              <span className={styles.muted} style={{ fontSize: 12 }}>{post.publishedAt}</span>
            </div>
            <p className={styles.eyebrow}>Review Detail</p>
            <h1 className={styles.title}>{post.title}</h1>
            <p className={styles.subtitle}>这是一条社区沉淀内容。先看它解决了什么问题、用到了哪些工具、最后留下了哪些可复用经验。</p>
            <div className={styles.pillRow} style={{ marginTop: 16 }}>
              {(post.tags as string[]).map((tag: string) => <span key={tag} className={styles.tag}>{tag}</span>)}
            </div>
          </div>
          <aside className={styles.heroAside}>
            <h2 className={styles.asideTitle}>看这篇时先抓三件事</h2>
            <ol className={styles.steps}>
              <li><b>1</b><span>它适合哪个人群、行业或项目。</span></li>
              <li><b>2</b><span>哪些步骤可以直接复用，哪些需要人工检查。</span></li>
              <li><b>3</b><span>看完后要回路线图实操，还是写自己的复盘。</span></li>
            </ol>
          </aside>
        </section>

        <section className={styles.panel}>
          <div style={{ marginBottom: 22 }}>
            {visualSource ? (
              <SmartImage src={visualSource} title={post.title} label={post.category} meta={`${authorName} · ${post.publishedAt || post.published_at || ""}`} kind={inferContentVisualKind(`${post.category} ${post.title} ${(post.tags || []).join(" ")}`, "community")} style={{ maxHeight: 420 }} />
            ) : (
              <ContentVisual title={post.title} label={post.category} meta={`${authorName} · ${post.publishedAt || post.published_at || ""}`} kind={inferContentVisualKind(`${post.category} ${post.title} ${(post.tags || []).join(" ")}`, "community")} />
            )}
          </div>

          <div style={{ fontSize: 16, color: "#24303d", lineHeight: 2, whiteSpace: "pre-line", border: "1px solid #dfe7ee", background: "#fff", borderRadius: 14, padding: "22px 24px" }}>
            <SeoKeywordLinks text={post.content} maxLinks={12} />
          </div>
        </section>

        <SeoRelatedLinks text={`${post.title}\n${post.content}\n${(post.tags || []).join(" ")}`} title="相关教程" limit={6} />

        <section className={styles.panel} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: 12, alignItems: "center" }} id="comments">
          <div>
            <h2 className={styles.panelTitle} style={{ fontSize: 22 }}>{isQuestionPost ? `帮楼主解决问题 +${COMMUNITY_REWARDS.commentXP}XP` : `写一条有效评论 +${COMMUNITY_REWARDS.commentXP}XP`}</h2>
            <p className={styles.panelDesc}>补充你的用法、坑点、替代工具或可执行步骤。社区现在按内容价值沉淀，不按铭牌展示。</p>
          </div>
          <button onClick={() => setShowCommentBox(true)} className={styles.primaryButton} style={{ whiteSpace: "nowrap", cursor: "pointer" }}>去评论</button>
        </section>

        <section className={styles.panel}>
          <div className={styles.actions} style={{ marginTop: 0 }}>
            <button onClick={() => { if (!liked) { setLiked(true); setLikeCount(likeCount + 1) } }} className={styles.secondaryButton} style={{ cursor: "pointer" }}>
              <Heart size={14} fill={liked ? "#17202a" : "none"} /> {likeCount} 赞
            </button>
            <button onClick={() => setShowCommentBox(!showCommentBox)} className={styles.secondaryButton} style={{ cursor: "pointer" }}>
              <MessageCircle size={14} /> {displayCommentCount} 评论
            </button>
          </div>
        </section>

        {showCommentBox && (
          <section className={styles.panel}>
            <h2 className={styles.panelTitle} style={{ fontSize: 24 }}>评论 ({displayCommentCount})</h2>
            <div className="communityCommentForm">
              <textarea
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                placeholder={user ? "写评论..." : `登录后评论 +${COMMUNITY_REWARDS.commentXP}XP`}
                className="form-input"
                rows={3}
                style={{ minHeight: 78, resize: "vertical", color: "#17202a", background: "#fff", border: "1px solid #cfd9e3" }}
              />
              <button onClick={submitComment} disabled={commentLoading} className={styles.primaryButton} style={{ whiteSpace: "nowrap", opacity: commentLoading ? 0.65 : 1, cursor: "pointer" }}>
                {commentLoading ? "发送中" : user ? "发送" : "登录评论"}
              </button>
            </div>
            {commentError && <p style={{ fontSize: 12, color: "#c46a1f", marginBottom: 12 }}>{commentError}</p>}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {sortedComments.length === 0 ? (
                <p className={styles.panelDesc} style={{ textAlign: "center", padding: "14px 0" }}>还没有评论，第一条有效补充还空着。</p>
              ) : sortedComments.map((comment) => (
                <div key={comment.id} className={styles.card} style={{ minHeight: 0, borderColor: comment.is_accepted ? "rgba(61,165,99,0.55)" : undefined, background: comment.is_accepted ? "rgba(61,165,99,0.06)" : undefined }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      {comment.is_accepted && <span className={styles.tag}><CheckCircle2 size={11} /> 已被楼主认可</span>}
                      <span className={styles.tag}>作者：{comment.author_name || "匿名用户"}</span>
                    </div>
                    <span className={styles.muted} style={{ fontSize: 12 }}>{formatCommentTime(comment.created_at)}</span>
                  </div>
                  <p className={styles.cardText} style={{ whiteSpace: "pre-line", margin: 0 }}><SeoKeywordLinks text={comment.content} maxLinks={4} /></p>
                  {isPostAuthor && !comment.is_accepted && comment.author_id !== user?.userId && (
                    <button type="button" onClick={() => acceptComment(comment)} disabled={acceptingCommentId === comment.id} className={styles.secondaryButton} style={{ marginTop: 12, cursor: acceptingCommentId === comment.id ? "default" : "pointer", opacity: acceptingCommentId === comment.id ? 0.65 : 1 }}>
                      <CheckCircle2 size={13} /> {acceptingCommentId === comment.id ? "认可中" : "认可为解决方案"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <section className={`${styles.panel} ${styles.bottomActionPanel}`}>
          <div>
            <p className={styles.eyebrow}>Next Step</p>
            <h2 className={styles.panelTitle}>看完这条沉淀，下一步不要停在收藏</h2>
            <p className={styles.panelDesc}>能复用就回学习路线做一个小成果；有结果就写复盘；缺工具就先把工具链补齐。</p>
          </div>
          <div className={styles.actions}>
            <button onClick={() => router.push("/learn")} className={styles.primaryButton} style={{ cursor: "pointer" }}>回学习路线</button>
            <button onClick={() => router.push("/community/new")} className={styles.secondaryButton} style={{ cursor: "pointer" }}>写我的复盘</button>
            <button onClick={() => router.push("/tools")} className={styles.secondaryButton} style={{ cursor: "pointer" }}>补工具链</button>
            <button onClick={() => router.push("/community")} className={styles.secondaryButton} style={{ cursor: "pointer" }}>返回复盘库</button>
          </div>
        </section>
      </main>
      <style jsx>{`
        .communityCommentForm {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 10px;
          align-items: start;
          margin: 14px 0 12px;
        }
        @media (max-width: 620px) {
          .communityCommentForm {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
