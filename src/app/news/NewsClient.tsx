"use client"

import { useState, useMemo, useEffect } from "react"
import { news, newsCategories, NewsCategory } from "@/data/news"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"
import { inferContentVisualKind } from "@/components/ContentVisual"
import { SmartImage } from "@/components/SmartImage"
import { screenshotImageSources, sourceLogoSources } from "@/lib/visual-assets"
import Link from "next/link"
import { Search } from "lucide-react"

function fmt(d:string){const diff=Math.floor((Date.now()-new Date(d).getTime())/86400000);if(diff===0)return"今天";if(diff===1)return"昨天";if(diff<7)return`${diff}天前`;return d}
const INITIAL_VISIBLE_NEWS = 5
const NEWS_LOAD_STEP = 16
const installTutorialPattern = /安装|下载|配置|终端|PowerShell|Node\.?js|npm|Ollama|Claude Code|Codex|中转站/i

function installTutorialRank(item: any) {
  const text = `${item.title || ""} ${item.summary || ""} ${item.category || ""}`
  if (item.category === "教程资源" && installTutorialPattern.test(text)) return 4
  if (installTutorialPattern.test(text)) return 1
  return 0
}

export default function NewsPage() {
  const [cat,setCat]=useState<NewsCategory|null>(null)
  const [query,setQuery]=useState("")
  const [fetched,setFetched]=useState<any[]>([])
  const [visibleCount,setVisibleCount]=useState(INITIAL_VISIBLE_NEWS)

  useEffect(()=>{
    const params = new URLSearchParams(window.location.search)
    const c = params.get("category")
    if(c && newsCategories.some(x=>x.key===c)) setCat(c as NewsCategory)
    const loadFetched = () => fetch("/fetched-news.json").then(r=>r.json()).then(d=>{if(Array.isArray(d))setFetched(d)}).catch(()=>{})
    if ("requestIdleCallback" in window) {
      ;(window as any).requestIdleCallback(loadFetched, { timeout: 2600 })
    } else {
      setTimeout(loadFetched, 1200)
    }
  },[])

  useEffect(()=>{setVisibleCount(INITIAL_VISIBLE_NEWS)},[cat,query])

  const sorted = useMemo(()=>{
    let r = [...news, ...fetched];if(cat)r=r.filter((n:any)=>n.category===cat)
    const q = query.trim().toLowerCase()
    if(q) {
      r = r.filter((n:any) => `${n.title || ""} ${n.summary || ""} ${n.category || ""} ${n.source || ""}`.toLowerCase().includes(q))
    }
    return r.sort((a:any,b:any)=>installTutorialRank(b)-installTutorialRank(a)||b.importance-a.importance||new Date(b.publishedAt).getTime()-new Date(a.publishedAt).getTime())
  },[cat,fetched,query])

  return (
    <div style={{background:'#000',minHeight:'100vh',fontFamily:"'Noto Sans SC', sans-serif",position:'relative',overflow:'hidden'}}>
      <MathRain /><NavBar />
      <div style={{maxWidth:1080,margin:'0 auto',padding:'60px 60px',position:'relative',zIndex:10,background:'rgba(0,0,0,0.88)'}} className="max-sm:px-4">
        <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:'0.4em',color:'#7a6230',marginBottom:10,fontWeight:700}}>News Feed</p>
        <h1 style={{fontSize:36,fontWeight:900,color:'#fff',marginBottom:8}}>AI 资讯</h1>
        <p style={{fontSize:14,color:'#ccc',lineHeight:1.8,marginBottom:18}}>资讯先看“对新手有什么用”，不用一上来钻太深。想找工具、模型、教程或关键词，直接搜。</p>

        <div style={{display:'flex',alignItems:'center',background:'rgba(8,8,8,0.94)',border:'1px solid #2a2a2a',borderRadius:10,maxWidth:620,marginBottom:18}}>
          <Search size={15} style={{marginLeft:14,color:'#777',flexShrink:0}} />
          <input
            value={query}
            onChange={(event)=>setQuery(event.target.value)}
            type="search"
            placeholder="搜索资讯：Claude Code、DeepSeek、Sora、Dify、AI PPT"
            style={{flex:1,background:'transparent',border:'none',outline:'none',padding:'13px 14px',fontSize:13,fontWeight:600,color:'#fff',fontFamily:"'Noto Sans SC', sans-serif",minWidth:0}}
          />
          {query && <button type="button" onClick={()=>setQuery("")} style={{marginRight:6,height:34,padding:'0 12px',borderRadius:8,border:'1px solid #2a2a2a',background:'rgba(255,255,255,0.035)',color:'#aaa',fontSize:12,fontWeight:900,cursor:'pointer'}}>清空</button>}
        </div>

        <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:32}}>
          <button onClick={()=>setCat(null)} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700,padding:'5px 14px',border:`1px solid ${!cat?'#7a6230':'#1a1a1a'}`,color:!cat?'#e8c96a':'#888',background:!cat?'rgba(201,168,76,0.08)':'transparent',cursor:'pointer',borderRadius:6}}>全部</button>
          {newsCategories.map(c=><button key={c.key} onClick={()=>setCat(cat===c.key?null:c.key)} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700,padding:'5px 14px',border:`1px solid ${cat===c.key?'#7a6230':'#1a1a1a'}`,color:cat===c.key?'#e8c96a':'#888',background:cat===c.key?'rgba(201,168,76,0.08)':'transparent',cursor:'pointer',borderRadius:6}}>{c.label}</button>)}
        </div>

        <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700,color:'#ccc',marginBottom:24}}>{sorted.length} 条资讯</p>

        {sorted.length===0?<div style={{textAlign:'center',padding:80,color:'#aaa'}}>没有资讯</div>:(
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {sorted.slice(0,visibleCount).map((n,i)=>(
              <Link key={n.id} href={`/news/${n.id}`} style={{textDecoration:'none'}}>
                <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid #1a1a1a',borderRadius:16,padding:'24px',transition:'all 0.3s'}}
                  onMouseEnter={e=>{e.currentTarget.style.background='rgba(201,168,76,0.04)';e.currentTarget.style.borderColor='#7a6230'}}
                  onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.03)';e.currentTarget.style.borderColor='#1a1a1a'}}>
                  <div style={{display:'flex',gap:18,alignItems:'stretch'}} className="max-sm:flex-col">
                    <div style={{width:210,flexShrink:0}} className="max-sm:w-full">
                      <SmartImage compact sources={newsImageSources(n)} title={n.title} label={n.category} meta={n.source} kind={inferContentVisualKind(`${n.category} ${n.title}`)} imageStyle={{objectFit:'cover',background:'#111',padding:0}}/>
                    </div>
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
            {visibleCount < sorted.length && (
              <div style={{display:'flex',justifyContent:'center',paddingTop:16}}>
                <button onClick={()=>setVisibleCount(c=>Math.min(c+NEWS_LOAD_STEP,sorted.length))} className="btn-outline" style={{minWidth:180,justifyContent:'center'}}>
                  加载更多资讯
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function newsImageSources(item: any) {
  return [
    item.image,
    ...(item.importance >= 8 ? screenshotImageSources(item.url || "") : []),
    ...sourceLogoSources(item.source || ""),
  ].filter(Boolean)
}
