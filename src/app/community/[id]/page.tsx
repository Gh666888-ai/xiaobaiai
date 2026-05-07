"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { posts } from "@/data/community"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"
import { ContentVisual, inferContentVisualKind } from "@/components/ContentVisual"
import { SmartImage } from "@/components/SmartImage"
import { LevelBadge } from "@/components/LevelBadge"
import { useAuth } from "@/lib/AuthContext"
import { readAppAuth } from "@/lib/app-auth"
import { communityImage } from "@/lib/visual-assets"
import { Heart, MessageCircle, Pin } from "lucide-react"

type CommunityComment = {
  id: string
  post_id: string
  author_name: string
  author_xp?: number
  content: string
  status?: string
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
  const { user } = useAuth()
  const postId = Array.isArray(params.id) ? params.id[0] : String(params.id || "")
  const [staticPosts,setStaticPosts]=useState<any[]>([])
  const [apiPosts,setApiPosts]=useState<any[]>([])
  const [comments, setComments] = useState<CommunityComment[]>([])
  const [commentText, setCommentText] = useState("")
  const [commentLoading, setCommentLoading] = useState(false)
  const [commentError, setCommentError] = useState("")
  useEffect(()=>{
    fetch("/community-posts.json").then(r=>r.json()).then(d=>{if(Array.isArray(d))setStaticPosts(d)}).catch(()=>{})
    fetch("/api/posts?status=approved").then(r=>r.json()).then(d=>{if(Array.isArray(d))setApiPosts(d)}).catch(()=>{})
  },[])
  const allPosts=[...posts,...staticPosts,...apiPosts]
  const post = allPosts.find(p => String(p.id) === postId)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post ? (post.likes || 0) : 0)
  const [showCommentBox, setShowCommentBox] = useState(false)
  useEffect(()=>{ if(post) setLikeCount(post.likes || 0) }, [post?.id])
  useEffect(() => {
    if (!postId) return
    let cancelled = false
    fetch(`/api/comments?postId=${encodeURIComponent(postId)}`)
      .then(r => r.json())
      .then(d => {
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
      setCommentError("先写点内容，小白才知道你想说啥。")
      return
    }
    if (content.length < 2) {
      setCommentError("再多说一点点，别让小白猜谜。")
      return
    }
    if (content.length > 800) {
      setCommentError("评论先控制在 800 字以内，长文可以单独发帖。")
      return
    }
    const token = readAppAuth()?.session?.access_token
    if (!token) {
      setCommentError("登录后才能评论，小白先带你去登录。")
      router.push(`/login?next=${encodeURIComponent(`/community/${postId}`)}`)
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
      } else {
        setComments(prev => [...prev, data])
      }
      setCommentText("")
    } catch (error: any) {
      setCommentError(error?.message || "评论发送失败，稍后再试。")
    } finally {
      setCommentLoading(false)
    }
  }

  const displayCommentCount = Math.max(Number(post?.comments_count ?? post?.comments ?? 0), comments.length)

  if (!post) return (
    <div style={{background:'#000',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{textAlign:'center'}}>
        <p style={{fontSize:48,color:'#555',marginBottom:16}}>404</p>
        <button onClick={()=>router.push('/community')} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:'#c9a84c',border:'1px solid #7a6230',padding:'8px 20px',background:'transparent',cursor:'pointer'}}>← 返回社区</button>
      </div>
    </div>
  )

  const authorName = post.author_name || post.author || "匿名用户"
  const authorXP = Number(post.author_xp ?? post.authorXp ?? (authorName === "小白站长" ? 100000 : 0))

  return (
    <div style={{background:'#000',minHeight:'100vh',fontFamily:"'Noto Sans SC', sans-serif",position:'relative',overflow:'hidden'}}>
      <MathRain />
      <NavBar />

      <div style={{maxWidth:900,margin:'0 auto',padding:'60px 60px 100px',position:'relative',zIndex:10,background:'rgba(0,0,0,0.88)'}} className="max-sm:px-4">
        {/* 标签 */}
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16,flexWrap:'wrap'}}>
          {post.pinned && <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'#e8c96a',border:'1px solid #7a6230',padding:'3px 10px',borderRadius:4,display:'flex',alignItems:'center',gap:4}}><Pin size={10} />置顶</span>}
          <span className="tag tag-gold" style={{fontWeight:700,fontSize:12}}>{post.category}</span>
          <LevelBadge compact name={authorName} xp={authorXP} />
          <span style={{color:'#444'}}>·</span>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:'#888'}}>{post.publishedAt}</span>
        </div>

        <h1 style={{fontSize:32,fontWeight:900,color:'#fff',marginBottom:12,lineHeight:1.3}}>{post.title}</h1>

        {/* 标签行 */}
        <div style={{display:'flex',gap:8,marginBottom:28,flexWrap:'wrap'}}>
          {(post.tags as string[]).map((t:string)=><span key={t} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:600,color:'#ccc',border:'1px solid #333',padding:'3px 10px',borderRadius:4}}>{t}</span>)}
        </div>

        <div style={{marginBottom:32}}>
          {post.image || post.cover || communityImage(`${post.category} ${post.title} ${(post.tags || []).join(" ")}`) ? (
            <SmartImage src={post.image || post.cover || communityImage(`${post.category} ${post.title} ${(post.tags || []).join(" ")}`)} title={post.title} label={post.category} meta={`${authorName} · ${post.publishedAt || post.published_at || ""}`} kind={inferContentVisualKind(`${post.category} ${post.title} ${(post.tags || []).join(" ")}`,"community")} style={{ maxHeight: 420, marginBottom: 28 }} />
          ) : (
            <ContentVisual title={post.title} label={post.category} meta={`${authorName} · ${post.publishedAt || post.published_at || ""}`} kind={inferContentVisualKind(`${post.category} ${post.title} ${(post.tags || []).join(" ")}`,"community")} />
          )}
        </div>

        {/* 正文 */}
        <div style={{fontSize:16,color:'#eee',lineHeight:2.15,whiteSpace:'pre-line',marginBottom:40,border:'1px solid #181818',background:'rgba(255,255,255,0.018)',borderRadius:8,padding:'24px 26px'}}>
          {post.content}
        </div>

        {/* 互动行 */}
        <div style={{display:'flex',alignItems:'center',gap:10,padding:'20px 0',borderTop:'1px solid #1a1a1a',borderBottom:'1px solid #1a1a1a'}}>
          <button onClick={()=>{if(!liked){setLiked(true);setLikeCount(likeCount+1)}}} className="btn-outline" style={{display:'inline-flex',alignItems:'center',gap:6,color:liked?'#e8c96a':'#ccc',fontSize:13,cursor:'pointer'}}>
            <Heart size={14} fill={liked?'#e8c96a':'none'} /> {likeCount} 赞
          </button>
          <button onClick={()=>setShowCommentBox(!showCommentBox)} className="btn-outline" style={{display:'inline-flex',alignItems:'center',gap:6,color:showCommentBox?'#e8c96a':'#ccc',fontSize:13,cursor:'pointer'}}>
            <MessageCircle size={14} /> {displayCommentCount} 评论
          </button>
        </div>

        {/* 评论框 */}
        {showCommentBox && (
          <div style={{marginTop:20,background:'rgba(255,255,255,0.02)',border:'1px solid #1a1a1a',borderRadius:12,padding:'20px 24px'}}>
            <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700,color:'#ccc',marginBottom:12}}>评论 ({displayCommentCount})</p>
            <div style={{display:'flex',gap:10,marginBottom:12,alignItems:'flex-start'}} className="max-sm:flex-col">
              <textarea
                value={commentText}
                onChange={e=>setCommentText(e.target.value)}
                placeholder={user ? "写评论..." : "登录后参与讨论..."}
                className="form-input"
                rows={3}
                style={{flex:1,minHeight:78,resize:'vertical'}}
              />
              <button onClick={submitComment} disabled={commentLoading} className="btn-primary" style={{whiteSpace:'nowrap',opacity:commentLoading?0.65:1}}>
                {commentLoading ? "发送中" : user ? "发送" : "去登录"}
              </button>
            </div>
            {commentError && <p style={{fontSize:12,color:'#ffb86b',marginBottom:12}}>{commentError}</p>}
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              {comments.length === 0 ? (
                <p style={{fontSize:12,color:'#666',textAlign:'center',padding:'14px 0'}}>还没有评论，第一条神评席位空着呢。</p>
              ) : comments.map(comment => (
                <div key={comment.id} style={{border:'1px solid #202020',background:'rgba(0,0,0,0.28)',borderRadius:10,padding:'14px 16px'}}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:10,marginBottom:10,flexWrap:'wrap'}}>
                    <LevelBadge compact name={comment.author_name || "匿名用户"} xp={Number(comment.author_xp || 0)} />
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'#666'}}>{formatCommentTime(comment.created_at)}</span>
                  </div>
                  <p style={{fontSize:14,color:'#ddd',lineHeight:1.8,whiteSpace:'pre-line',margin:0}}>{comment.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 返回 */}
        <div style={{marginTop:32,textAlign:'center'}}>
          <button onClick={()=>router.push('/community')} className="btn-primary" style={{justifyContent:'center'}}>← 返回社区</button>
        </div>
      </div>
    </div>
  )
}
