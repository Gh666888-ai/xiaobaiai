"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { posts as seedPosts } from "@/data/community"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"
import { ContentVisual, inferContentVisualKind } from "@/components/ContentVisual"
import { SmartImage } from "@/components/SmartImage"
import { LevelBadge } from "@/components/LevelBadge"
import { getUserLevel } from "@/data/user"
import { communityImage } from "@/lib/visual-assets"
import Link from "next/link"
import { Heart, MessageCircle, Pin, Search, Trophy, Zap } from "lucide-react"

const cats = ["全部","经验分享","踩坑记录","全自动实战","AI分析","问题求助"] as const
const PAGE_SIZE = 60

function levelPerkLabel(xp: number) {
  const level = getUserLevel(xp).level
  if (level >= 7) return "共创者"
  if (level >= 5) return "优先展示"
  if (level >= 3) return "高阶玩家"
  return ""
}

function levelSortPriority(xp: number) {
  const level = getUserLevel(xp).level
  if (level >= 7) return 3
  if (level >= 5) return 2
  if (level >= 3) return 1
  return 0
}

export default function CommunityPage() {
  const [cat, setCat] = useState<string>("全部")
  const [search, setSearch] = useState("")
  const [posts, setPosts] = useState<any[]>(seedPosts)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  useEffect(()=>{
    const loadRemotePosts = () => Promise.all([
      fetch("/api/posts?status=approved").then(r=>r.json()).catch(()=>[]),
      fetch("/community-posts.json").then(r=>r.json()).catch(()=>[])
    ]).then(([apiPosts,staticPosts])=>{
      const api=Array.isArray(apiPosts)?apiPosts:[]
      const st=Array.isArray(staticPosts)?staticPosts:[]
      const ids=new Set(api.map((p:any)=>p.id))
      const seeded=[...api,...st.filter((p:any)=>!ids.has(p.id))]
      const seededIds=new Set(seeded.map((p:any)=>p.id))
      setPosts([...seeded,...seedPosts.filter((p:any)=>!seededIds.has(p.id))])
    }).catch(()=>{})
    if ("requestIdleCallback" in window) {
      ;(window as any).requestIdleCallback(loadRemotePosts, { timeout: 1800 })
    } else {
      setTimeout(loadRemotePosts, 500)
    }
  },[])

  useEffect(()=>{setVisibleCount(PAGE_SIZE)},[cat,search])

  const authorName = (p:any) => p.author_name || p.author || "匿名用户"
  const authorXP = (p:any) => Number(p.author_xp ?? p.authorXp ?? (authorName(p) === "小白站长" ? 100000 : 0))

  const filtered = posts.filter((p:any) => {
    if (cat !== "全部" && p.category !== cat) return false
    if (search.trim() && !p.title.includes(search) && !p.content.includes(search) && !(p.tags||[]).some((t:any)=>t.includes(search))) return false
    return true
  }).sort((a,b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    const levelDelta = levelSortPriority(authorXP(b)) - levelSortPriority(authorXP(a))
    if (levelDelta) return levelDelta
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  })

  return (
    <div style={{background:'#000',minHeight:'100vh',fontFamily:"'Noto Sans SC', sans-serif",position:'relative',overflow:'hidden'}}>
      <MathRain />
      <NavBar />

      <div style={{maxWidth:1080,margin:'0 auto',padding:'60px 60px',position:'relative',zIndex:10,background:'rgba(0,0,0,0.88)'}} className="max-sm:px-4">
        <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:'0.4em',color:'#7a6230',textTransform:'uppercase',marginBottom:10,fontWeight:700}}>Community</p>
        <h1 style={{fontSize:36,fontWeight:900,color:'#fff',letterSpacing:'0.02em',marginBottom:8}}>社区</h1>
        <p style={{fontSize:15,fontWeight:500,color:'#ccc',marginBottom:18}}>Agent 实战经验 · 踩坑记录 · AI 可行性分析 · 真实案例看板</p>

        <section style={{display:'grid',gridTemplateColumns:'1fr auto',gap:14,alignItems:'center',border:'1px solid rgba(201,168,76,0.36)',background:'rgba(201,168,76,0.055)',borderRadius:12,padding:'15px 16px',marginBottom:18}} className="max-sm:grid-cols-1">
          <div style={{display:'flex',alignItems:'flex-start',gap:11}}>
            <Trophy size={18} style={{color:'#e8c96a',marginTop:2,flexShrink:0}} />
            <div>
              <p style={{color:'#fff',fontSize:14,fontWeight:950,marginBottom:4}}>今日发帖 +10XP，评论 +3XP，冲今日经验榜</p>
              <p style={{color:'#d6c28a',fontSize:12,lineHeight:1.7}}>真实使用经验、提示词案例、避坑记录和工作流过程更容易被审核通过，也更容易被推荐。</p>
            </div>
          </div>
          <Link href="/growth" style={{display:'inline-flex',alignItems:'center',justifyContent:'center',gap:7,minHeight:36,padding:'8px 13px',borderRadius:9,border:'1px solid #7a6230',color:'#e8c96a',textDecoration:'none',fontSize:12,fontWeight:950,whiteSpace:'nowrap'}}>
            <Zap size={14} /> 看今日榜
          </Link>
        </section>

        <div style={{display:'grid',gridTemplateColumns:'repeat(3, 1fr)',gap:8,marginBottom:28}} className="max-sm:grid-cols-1">
          {[
            {t:'提交你的 AI 使用案例',h:'/community/new'},
            {t:'分享踩坑记录',h:'/community/new'},
            {t:'我想让 AI 帮我分析一个需求',h:'/search?q=我想让 AI 帮我分析一个需求'},
          ].map(item=>(
            <Link key={item.t} href={item.h} style={{textDecoration:'none',border:'1px solid #1a1a1a',background:'rgba(255,255,255,0.03)',borderRadius:10,padding:'14px 16px',fontSize:13,fontWeight:700,color:'#ddd',textAlign:'center'}}>{item.t}</Link>
          ))}
        </div>

        {/* 搜索 */}
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:32}}>
          <div style={{display:'flex',alignItems:'center',background:'rgba(255,255,255,0.04)',border:'1px solid #222',borderRadius:10,maxWidth:400,flex:1}}>
            <Search size={14} style={{marginLeft:14,color:'#777'}} />
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="搜索帖子..."
              style={{flex:1,background:'transparent',border:'none',outline:'none',padding:'11px 14px',fontSize:13,color:'#fff',fontFamily:"'Noto Sans SC', sans-serif"}} />
          </div>
          <Link href="/community/new" className="btn-primary" style={{whiteSpace:'nowrap',textDecoration:'none'}}>+ 发帖子</Link>
        </div>

        {/* 分类 */}
        <div style={{display:'flex',gap:6,marginBottom:32,flexWrap:'wrap'}}>
          {cats.map(c=>{
            const isSel = cat===c
            return <button key={c} onClick={()=>setCat(c)}
              style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700,padding:'5px 14px',border:`1px solid ${isSel?'#7a6230':'#1a1a1a'}`,color:isSel?'#e8c96a':'#888',background:isSel?'rgba(201,168,76,0.08)':'transparent',cursor:'pointer',transition:'0.2s',borderRadius:6}}>{c}</button>
          })}
        </div>

        <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700,color:'#ccc',marginBottom:24}}>{filtered.length} 篇帖子</p>

        {filtered.length===0?(
          <div style={{textAlign:'center',padding:80,color:'#aaa'}}>没有找到相关帖子</div>
        ):(
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            {filtered.slice(0, visibleCount).map(p=>(
              <div key={p.id} style={{background:getUserLevel(authorXP(p)).level>=3?'rgba(201,168,76,0.045)':'rgba(255,255,255,0.03)',border:`1px solid ${getUserLevel(authorXP(p)).level>=3?'rgba(201,168,76,0.48)':'#1a1a1a'}`,borderRadius:12,padding:'22px',transition:'all 0.3s',boxShadow:getUserLevel(authorXP(p)).level>=5?'0 0 0 1px rgba(126,231,255,0.08), 0 12px 34px rgba(0,0,0,0.28)':'none'}}
                onMouseEnter={e=>{e.currentTarget.style.background='rgba(201,168,76,0.07)';e.currentTarget.style.borderColor='#7a6230'}}
                onMouseLeave={e=>{e.currentTarget.style.background=getUserLevel(authorXP(p)).level>=3?'rgba(201,168,76,0.045)':'rgba(255,255,255,0.03)';e.currentTarget.style.borderColor=getUserLevel(authorXP(p)).level>=3?'rgba(201,168,76,0.48)':'#1a1a1a'}}>
                <div style={{display:'grid',gridTemplateColumns:'230px minmax(0,1fr)',gap:20,alignItems:'stretch'}} className="max-sm:grid-cols-1">
                  {p.image || p.cover || communityImage(`${p.category} ${p.title} ${(p.tags||[]).join(" ")}`) ? (
                    <SmartImage compact src={p.image || p.cover || communityImage(`${p.category} ${p.title} ${(p.tags||[]).join(" ")}`)} title={p.title} label={p.category} meta={`${p.likes||0} likes`} kind={inferContentVisualKind(`${p.category} ${p.title} ${(p.tags||[]).join(" ")}`,"community")} />
                  ) : (
                    <ContentVisual compact title={p.title} label={p.category} meta={`${p.likes||0} likes`} kind={inferContentVisualKind(`${p.category} ${p.title} ${(p.tags||[]).join(" ")}`,"community")} />
                  )}
                  <div style={{minWidth:0}}>
                    <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10,flexWrap:'wrap'}}>
                      {p.pinned && <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'#e8c96a',border:'1px solid #7a6230',padding:'2px 8px',borderRadius:4,display:'flex',alignItems:'center',gap:4}}><Pin size={10} />置顶</span>}
                      <span className="tag tag-gold" style={{fontWeight:700,fontSize:11}}>{p.category}</span>
                      <LevelBadge compact name={authorName(p)} xp={authorXP(p)} />
                      {levelPerkLabel(authorXP(p)) && <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:getUserLevel(authorXP(p)).level>=7?'#7ee7ff':'#e8c96a',border:`1px solid ${getUserLevel(authorXP(p)).level>=7?'rgba(126,231,255,0.55)':'rgba(201,168,76,0.45)'}`,background:getUserLevel(authorXP(p)).level>=7?'rgba(126,231,255,0.08)':'rgba(201,168,76,0.08)',padding:'2px 8px',borderRadius:999,fontWeight:900}}>{levelPerkLabel(authorXP(p))}</span>}
                      <span style={{color:'#444'}}>·</span>
                      <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'#666'}}>{p.publishedAt}</span>
                    </div>

                    <Link href={`/community/${p.id}`} style={{textDecoration:'none'}}>
                      <h2 style={{fontSize:20,fontWeight:800,color:'#fff',marginBottom:10,lineHeight:1.4,cursor:'pointer'}}>{p.title}</h2>
                    </Link>
                    <p style={{fontSize:14,color:'#ccc',lineHeight:1.8,display:'-webkit-box',WebkitLineClamp:3,WebkitBoxOrient:'vertical',overflow:'hidden',whiteSpace:'pre-line'}}>{p.content}</p>

                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:16,flexWrap:'wrap',gap:10}}>
                      <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                        {(Array.isArray(p.tags)?p.tags:[]).map((t:any)=><span key={t} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'#888',border:'1px solid #222',padding:'2px 8px',borderRadius:4,fontWeight:500}}>{t}</span>)}
                      </div>
                      <div style={{display:'flex',gap:16,fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:'#aaa'}}>
                        <span style={{display:'flex',alignItems:'center',gap:4}}><Heart size={13} /> {p.likes||0}</span>
                        <span style={{display:'flex',alignItems:'center',gap:4}}><MessageCircle size={13} /> {p.comments_count||p.comments||0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {visibleCount < filtered.length && (
              <div style={{display:'flex',justifyContent:'center',paddingTop:14}}>
                <button onClick={()=>setVisibleCount(v=>Math.min(v+PAGE_SIZE, filtered.length))} className="btn-outline" style={{minWidth:180,justifyContent:'center'}}>
                  加载更多帖子 · {Math.min(PAGE_SIZE, filtered.length - visibleCount)}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
