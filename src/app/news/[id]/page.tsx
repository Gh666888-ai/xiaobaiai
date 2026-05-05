"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { news } from "@/data/news"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"
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
      <div style={{maxWidth:800,margin:'0 auto',padding:'60px 60px 100px',position:'relative',zIndex:10,background:'rgba(0,0,0,0.85)'}}>
        <Link href="/news" style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:'#aaa',textDecoration:'none',marginBottom:24,display:'inline-block'}}>← 返回资讯</Link>
        {item.image&&<img src={item.image} alt="" style={{width:'100%',maxHeight:400,objectFit:'cover',borderRadius:12,marginBottom:24}}/>}
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12,flexWrap:'wrap'}}>
          <span className="tag tag-gold" style={{fontWeight:700,fontSize:12}}>{item.category}</span>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:'#888'}}>{item.publishedAt}</span>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:'#666'}}>{item.source}</span>
          {item.importance>=8&&<span style={{fontSize:11,color:'#e8c96a',fontWeight:700}}>🔥 重磅</span>}
        </div>
        <h1 style={{fontSize:30,fontWeight:900,color:'#fff',lineHeight:1.4,marginBottom:24}}>{item.title}</h1>
        <div style={{fontSize:16,color:'#ccc',lineHeight:2.2,whiteSpace:'pre-wrap'}}>
          <p style={{marginBottom:16}}>{item.summary}</p>
          {item.content && item.content !== item.summary && <p>{item.content}</p>}
          {item.url && item.url !== "#" && <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{marginTop:24}}>查看原文 →</a>}
        </div>
        {item.url&&item.url!=="#"&&<a href={item.url} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{marginTop:32}}>查看原文 →</a>}
      </div>
    </div>
  )
}
