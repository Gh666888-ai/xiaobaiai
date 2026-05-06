"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { news } from "@/data/news"
import { buildNewsArticle } from "@/lib/content"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"
import { ContentVisual, inferContentVisualKind } from "@/components/ContentVisual"
import { SmartImage } from "@/components/SmartImage"
import { screenshotImage, sourceLogo } from "@/lib/visual-assets"
import Link from "next/link"

export default function NewsDetailPage() {
  const params = useParams()
  const [fetched,setFetched]=useState<any[]>([])
  useEffect(()=>{fetch("/fetched-news.json").then(r=>r.json()).then(d=>{if(Array.isArray(d))setFetched(d)}).catch(()=>{})},[])
  const item = [...news,...fetched].find((n:any)=>n.id===params.id)

  if(!item)return <div style={{background:'#000',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}><div style={{textAlign:'center'}}><p style={{fontSize:48,color:'#555'}}>404</p><Link href="/news" style={{color:'#c9a84c'}}>返回资讯</Link></div></div>

  return (
    <div style={{background:'#000',minHeight:'100vh',fontFamily:"'Noto Sans SC', sans-serif",position:'relative',overflow:'hidden'}}>
      <MathRain /><NavBar />
      <div style={{maxWidth:900,margin:'0 auto',padding:'60px 60px 100px',position:'relative',zIndex:10,background:'rgba(0,0,0,0.88)'}} className="max-sm:px-4">
        <Link href="/news" style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:'#aaa',textDecoration:'none',marginBottom:24,display:'inline-block'}}>← 返回资讯</Link>
        {item.image || sourceLogo(item.source) || screenshotImage(item.url) ? <SmartImage src={item.image || sourceLogo(item.source) || screenshotImage(item.url)} title={item.title} label={item.category} meta={`${item.source} · ${item.publishedAt}`} kind={inferContentVisualKind(`${item.category} ${item.title}`)} style={{maxHeight:400,marginBottom:24}} imageStyle={{objectFit:item.image?'cover':'contain',background:item.image?'#111':'#fff',padding:item.image?0:28}}/> :
          <div style={{marginBottom:28}}><ContentVisual title={item.title} label={item.category} meta={`${item.source} · ${item.publishedAt}`} kind={inferContentVisualKind(`${item.category} ${item.title}`)} /></div>}
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12,flexWrap:'wrap'}}>
          <span className="tag tag-gold" style={{fontWeight:700,fontSize:12}}>{item.category}</span>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:'#888'}}>{item.publishedAt}</span>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:'#666'}}>{item.source}</span>
          {item.importance>=8&&<span style={{fontSize:11,color:'#e8c96a',fontWeight:700}}>🔥 重磅</span>}
        </div>
        <h1 style={{fontSize:30,fontWeight:900,color:'#fff',lineHeight:1.4,marginBottom:24}}>{item.title}</h1>
        <div style={{fontSize:16,color:'#ccc',lineHeight:2.1,whiteSpace:'pre-wrap'}}>
          <div style={{border:'1px solid #2a1f10',background:'rgba(201,168,76,0.045)',borderRadius:8,padding:'18px 20px',marginBottom:24}}>
            <p style={{fontSize:13,fontWeight:900,color:'#e8c96a',marginBottom:8,fontFamily:"'JetBrains Mono',monospace",letterSpacing:'0.08em'}}>QUICK VIEW</p>
            <p style={{color:'#f2e4b8',lineHeight:1.9}}>{item.summary}</p>
          </div>
          <p>{buildNewsArticle(item)}</p>
          {item.url && item.url !== "#" && <p style={{fontSize:13,color:'#777',marginTop:24}}>本文已整理为站内可读版本，外部来源仅用于继续核对背景信息。</p>}
        </div>
        {item.url&&item.url!=="#"&&<a href={item.url} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{marginTop:32}}>参考来源 →</a>}
      </div>
    </div>
  )
}
