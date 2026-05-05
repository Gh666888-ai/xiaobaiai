"use client"

import { useState, useMemo, useEffect } from "react"
import { news, newsCategories, NewsCategory } from "@/data/news"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"
import Link from "next/link"

function fmt(d:string){const diff=Math.floor((Date.now()-new Date(d).getTime())/86400000);if(diff===0)return"今天";if(diff===1)return"昨天";if(diff<7)return`${diff}天前`;return d}

export default function NewsPage() {
  const [cat,setCat]=useState<NewsCategory|null>(null)

  const [fetched,setFetched]=useState<any[]>([])

  const sorted = useMemo(()=>{
    let r = [...news, ...fetched];if(cat)r=r.filter((n:any)=>n.category===cat)
    return r.sort((a:any,b:any)=>b.importance-a.importance||new Date(b.publishedAt).getTime()-new Date(a.publishedAt).getTime())
  },[cat,fetched])

  useEffect(()=>{fetch("/fetched-news.json").then(r=>r.json()).then(d=>{if(Array.isArray(d))setFetched(d)}).catch(()=>{})},[])

  return (
    <div style={{background:'#000',minHeight:'100vh',fontFamily:"'Noto Sans SC', sans-serif",position:'relative',overflow:'hidden'}}>
      <MathRain /><NavBar />
      <div style={{maxWidth:900,margin:'0 auto',padding:'60px 60px',position:'relative',zIndex:10,background:'rgba(0,0,0,0.85)'}} className="max-sm:px-4">
        <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:'0.4em',color:'#7a6230',marginBottom:10,fontWeight:700}}>News Feed</p>
        <h1 style={{fontSize:36,fontWeight:900,color:'#fff',marginBottom:8}}>AI 资讯</h1>
        <p style={{fontSize:14,color:'#ccc',marginBottom:32}}>Agent自动聚合 + 用户投稿 · 按重要性排列</p>

        <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:32}}>
          <button onClick={()=>setCat(null)} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700,padding:'5px 14px',border:`1px solid ${!cat?'#7a6230':'#1a1a1a'}`,color:!cat?'#e8c96a':'#888',background:!cat?'rgba(201,168,76,0.08)':'transparent',cursor:'pointer',borderRadius:6}}>全部</button>
          {newsCategories.map(c=><button key={c.key} onClick={()=>setCat(cat===c.key?null:c.key)} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700,padding:'5px 14px',border:`1px solid ${cat===c.key?'#7a6230':'#1a1a1a'}`,color:cat===c.key?'#e8c96a':'#888',background:cat===c.key?'rgba(201,168,76,0.08)':'transparent',cursor:'pointer',borderRadius:6}}>{c.label}</button>)}
        </div>

        <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700,color:'#ccc',marginBottom:24}}>{sorted.length} 条资讯</p>

        {sorted.length===0?<div style={{textAlign:'center',padding:80,color:'#aaa'}}>没有资讯</div>:(
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {sorted.map((n,i)=>(
              <Link key={n.id} href={`/news/${n.id}`} style={{textDecoration:'none'}}>
                <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid #1a1a1a',borderRadius:16,padding:'24px',transition:'all 0.3s'}}
                  onMouseEnter={e=>{e.currentTarget.style.background='rgba(201,168,76,0.04)';e.currentTarget.style.borderColor='#7a6230'}}
                  onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.03)';e.currentTarget.style.borderColor='#1a1a1a'}}>
                  <div style={{display:'flex',gap:16}} className="max-sm:flex-col">
                    {n.image&&<img src={n.image} alt="" style={{width:120,height:80,objectFit:'cover',borderRadius:8,flexShrink:0}}/>}
                    <div style={{flex:1}}>
                      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8,flexWrap:'wrap'}}>
                        <span className="tag tag-gold" style={{fontWeight:700,fontSize:11}}>{n.category}</span>
                        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'#888'}}>{fmt(n.publishedAt)}</span>
                        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'#666'}}>{n.source}</span>
                        {n.importance>=8&&<span style={{fontSize:9,color:'#e8c96a',fontWeight:700}}>🔥重磅</span>}
                      </div>
                      <h3 style={{fontSize:17,fontWeight:700,color:'#fff',lineHeight:1.4,marginBottom:8}}>{n.title}</h3>
                      <p style={{fontSize:14,color:'#ccc',lineHeight:1.7}}>{n.summary}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
