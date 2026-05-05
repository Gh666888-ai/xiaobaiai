"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { posts } from "@/data/community"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"
import Link from "next/link"
import { Heart, MessageCircle, Pin, ArrowLeft } from "lucide-react"

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [staticPosts,setStaticPosts]=useState<any[]>([])
  const [apiPosts,setApiPosts]=useState<any[]>([])
  useEffect(()=>{
    fetch("/community-posts.json").then(r=>r.json()).then(d=>{if(Array.isArray(d))setStaticPosts(d)}).catch(()=>{})
    fetch("/api/posts?status=approved").then(r=>r.json()).then(d=>{if(Array.isArray(d))setApiPosts(d)}).catch(()=>{})
  },[])
  const allPosts=[...posts,...staticPosts,...apiPosts]
  const post = allPosts.find(p => p.id === params.id)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post ? (post.likes || 0) : 0)
  const [showCommentBox, setShowCommentBox] = useState(false)

  if (!post) return (
    <div style={{background:'#000',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{textAlign:'center'}}>
        <p style={{fontSize:48,color:'#555',marginBottom:16}}>404</p>
        <button onClick={()=>router.push('/community')} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:'#c9a84c',border:'1px solid #7a6230',padding:'8px 20px',background:'transparent',cursor:'pointer'}}>← 返回社区</button>
      </div>
    </div>
  )

  return (
    <div style={{background:'#000',minHeight:'100vh',fontFamily:"'Noto Sans SC', sans-serif",position:'relative',overflow:'hidden'}}>
      <MathRain />
      <NavBar />

      <div style={{maxWidth:800,margin:'0 auto',padding:'60px 60px 100px',position:'relative',zIndex:10,background:'rgba(0,0,0,0.85)'}} className="max-sm:px-4">
        {/* 标签 */}
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16,flexWrap:'wrap'}}>
          {post.pinned && <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'#e8c96a',border:'1px solid #7a6230',padding:'3px 10px',borderRadius:4,display:'flex',alignItems:'center',gap:4}}><Pin size={10} />置顶</span>}
          <span className="tag tag-gold" style={{fontWeight:700,fontSize:12}}>{post.category}</span>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:'#aaa'}}>{post.author}</span>
          <span style={{color:'#444'}}>·</span>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:'#888'}}>{post.publishedAt}</span>
        </div>

        <h1 style={{fontSize:32,fontWeight:900,color:'#fff',marginBottom:12,lineHeight:1.3}}>{post.title}</h1>

        {/* 标签行 */}
        <div style={{display:'flex',gap:8,marginBottom:28,flexWrap:'wrap'}}>
          {post.tags.map(t=><span key={t} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:600,color:'#ccc',border:'1px solid #333',padding:'3px 10px',borderRadius:4}}>{t}</span>)}
        </div>

        {/* 正文 */}
        <div style={{fontSize:16,color:'#eee',lineHeight:2.2,whiteSpace:'pre-line',marginBottom:40}}>
          {post.content}
        </div>

        {/* 互动行 */}
        <div style={{display:'flex',alignItems:'center',gap:10,padding:'20px 0',borderTop:'1px solid #1a1a1a',borderBottom:'1px solid #1a1a1a'}}>
          <button onClick={()=>{if(!liked){setLiked(true);setLikeCount(likeCount+1)}}} className="btn-outline" style={{display:'inline-flex',alignItems:'center',gap:6,color:liked?'#e8c96a':'#ccc',fontSize:13,cursor:'pointer'}}>
            <Heart size={14} fill={liked?'#e8c96a':'none'} /> {likeCount} 赞
          </button>
          <button onClick={()=>setShowCommentBox(!showCommentBox)} className="btn-outline" style={{display:'inline-flex',alignItems:'center',gap:6,color:showCommentBox?'#e8c96a':'#ccc',fontSize:13,cursor:'pointer'}}>
            <MessageCircle size={14} /> {post.comments} 评论
          </button>
        </div>

        {/* 评论框 */}
        {showCommentBox && (
          <div style={{marginTop:20,background:'rgba(255,255,255,0.02)',border:'1px solid #1a1a1a',borderRadius:12,padding:'20px 24px'}}>
            <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700,color:'#ccc',marginBottom:12}}>评论 ({post.comments})</p>
            <div style={{display:'flex',gap:10,marginBottom:12}}>
              <input placeholder="写评论..." className="form-input" style={{flex:1}} />
              <button className="btn-primary" style={{whiteSpace:'nowrap'}}>发送</button>
            </div>
            <p style={{fontSize:12,color:'#666',textAlign:'center'}}>评论功能即将上线，敬请期待</p>
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
