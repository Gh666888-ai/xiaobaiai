"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"
import Link from "next/link"
import { Heart, MessageCircle, Pin, Search } from "lucide-react"

const cats = ["全部","经验分享","踩坑记录","全自动实战","AI分析","问题求助"] as const

export default function CommunityPage() {
  const [cat, setCat] = useState<string>("全部")
  const [search, setSearch] = useState("")
  const [posts, setPosts] = useState<any[]>([])
  useEffect(()=>{
    supabase.from("community_posts").select("*").eq("status","approved").order("created_at",{ascending:false})
    .then(({data})=>{if(data && data.length>0)setPosts(data)}).catch(()=>{})
  },[])

  const filtered = posts.filter((p:any) => {
    if (cat !== "全部" && p.category !== cat) return false
    if (search.trim() && !p.title.includes(search) && !p.content.includes(search) && !(p.tags||[]).some((t:any)=>t.includes(search))) return false
    return true
  }).sort((a,b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  })

  return (
    <div style={{background:'#000',minHeight:'100vh',fontFamily:"'Noto Sans SC', sans-serif",position:'relative',overflow:'hidden'}}>
      <MathRain />
      <NavBar />

      <div style={{maxWidth:800,margin:'0 auto',padding:'60px 60px',position:'relative',zIndex:10,background:'rgba(0,0,0,0.85)'}} className="max-sm:px-4">
        <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:'0.4em',color:'#7a6230',textTransform:'uppercase',marginBottom:10,fontWeight:700}}>Community</p>
        <h1 style={{fontSize:36,fontWeight:900,color:'#fff',letterSpacing:'0.02em',marginBottom:8}}>社区</h1>
        <p style={{fontSize:15,fontWeight:500,color:'#ccc',marginBottom:40}}>Agent 实战经验 · 踩坑记录 · AI 可行性分析</p>

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
            {filtered.map(p=>(
              <div key={p.id} style={{background:'rgba(255,255,255,0.03)',border:'1px solid #1a1a1a',borderRadius:16,padding:'28px 32px',transition:'all 0.3s'}}
                onMouseEnter={e=>{e.currentTarget.style.background='rgba(201,168,76,0.04)';e.currentTarget.style.borderColor='#7a6230'}}
                onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.03)';e.currentTarget.style.borderColor='#1a1a1a'}}>
                <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10,flexWrap:'wrap'}}>
                  {p.pinned && <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'#e8c96a',border:'1px solid #7a6230',padding:'2px 8px',borderRadius:4,display:'flex',alignItems:'center',gap:4}}><Pin size={10} />置顶</span>}
                  <span className="tag tag-gold" style={{fontWeight:700,fontSize:11}}>{p.category}</span>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'#aaa'}}>{p.author}</span>
                  <span style={{color:'#444'}}>·</span>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'#666'}}>{p.publishedAt}</span>
                </div>

                <Link href={`/community/${p.id}`} style={{textDecoration:'none'}}>
                  <h2 style={{fontSize:20,fontWeight:800,color:'#fff',marginBottom:10,lineHeight:1.4,cursor:'pointer'}}>{p.title}</h2>
                </Link>
                <p style={{fontSize:14,color:'#ccc',lineHeight:1.8,display:'-webkit-box',WebkitLineClamp:4,WebkitBoxOrient:'vertical',overflow:'hidden',whiteSpace:'pre-line'}}>{p.content}</p>

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
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
