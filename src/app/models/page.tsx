"use client"

import { useState } from "react"
import { models, Model } from "@/data/models"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"
import { Search, Zap, Cpu, Trophy } from "lucide-react"

const btnBase={fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700,padding:'5px 14px',border:'1px solid #1a1a1a',color:'#888',background:'transparent',cursor:'pointer',transition:'0.2s',borderRadius:6}
const btnSel={...btnBase,borderColor:'#7a6230',color:'#e8c96a',background:'rgba(201,168,76,0.08)'}

export default function ModelsPage() {
  const [type, setType] = useState<"全部"|"API"|"本地">("全部")
  const [cat, setCat] = useState<string>("全部")
  const [search, setSearch] = useState("")

  const cats = ["全部","对话","编程","绘图","视频","音频","嵌入"]

  const filtered = models.filter(m=>{
    if(type!=="全部"&&m.type!==type) return false
    if(cat!=="全部"&&m.category!==cat) return false
    if(search.trim()&&!m.name.includes(search)&&!m.provider.includes(search)&&!m.description.includes(search)) return false
    return true
  }).sort((a,b)=>a.rank-b.rank)

  const apiModels = models.filter(m=>m.type==="API").slice(0,3)
  const localModels = models.filter(m=>m.type==="本地").slice(0,3)

  return (
    <div style={{background:'#000',minHeight:'100vh',fontFamily:"'Noto Sans SC', sans-serif",position:'relative',overflow:'hidden'}}>
      <MathRain />
      <NavBar />
      <div style={{maxWidth:1100,margin:'0 auto',padding:'60px 60px 100px',position:'relative',zIndex:10,background:'rgba(0,0,0,0.85)'}} className="max-sm:px-4">
        <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:'0.4em',color:'#7a6230',textTransform:'uppercase',marginBottom:10,fontWeight:700}}>Model Rankings</p>
        <h1 style={{fontSize:36,fontWeight:900,color:'#fff',letterSpacing:'0.02em',marginBottom:8}}>AI 模型排行</h1>
        <p style={{fontSize:15,fontWeight:500,color:'#ccc',marginBottom:40}}>API 云模型 + 本地部署模型 · 排名和推荐</p>

        {/* Top 3 */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))',gap:10,marginBottom:40}}>
          <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid #7a6230',borderRadius:14,padding:'24px'}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
              <Cpu size={16} style={{color:'#e8c96a'}} />
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'#c9a84c',fontWeight:700}}>TOP 3 API</span>
            </div>
            {apiModels.map((m,i)=><div key={m.id} style={{padding:'8px 0',borderBottom:i<2?'1px solid #1a1a1a':'none',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:'#c9a84c'}}>#{i+1}</span> <span style={{fontSize:14,fontWeight:700,color:'#fff'}}>{m.name}</span> <span style={{fontSize:11,color:'#888'}}>{m.provider}</span></div>
              <span style={{fontSize:11,color:'#aaa'}}>{m.pricing}</span>
            </div>)}
          </div>
          <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid #7a6230',borderRadius:14,padding:'24px'}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
              <Zap size={16} style={{color:'#3DA563'}} />
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'#3DA563',fontWeight:700}}>TOP 3 本地</span>
            </div>
            {localModels.map((m,i)=><div key={m.id} style={{padding:'8px 0',borderBottom:i<2?'1px solid #1a1a1a':'none',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:'#3DA563'}}>#{i+1}</span> <span style={{fontSize:14,fontWeight:700,color:'#fff'}}>{m.name}</span> <span style={{fontSize:11,color:'#888'}}>{m.provider}</span></div>
              <span style={{fontSize:11,color:'#aaa'}}>免费</span>
            </div>)}
          </div>
          <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid #1a1a1a',borderRadius:14,padding:'24px',textAlign:'center',display:'flex',flexDirection:'column',justifyContent:'center',gap:12}}>
            <Trophy size={24} style={{color:'#e8c96a',margin:'0 auto'}} />
            <p style={{fontSize:13,color:'#ccc'}}>新手推荐组合</p>
            <p style={{fontSize:12,color:'#aaa',lineHeight:1.8}}>日常：DeepSeek V3（便宜）<br/>编程：Qwen Coder（快）<br/>本地：Qwen3 32B（均衡）</p>
          </div>
        </div>

        {/* 筛选 */}
        <div style={{display:'flex',gap:8,marginBottom:16,flexWrap:'wrap',alignItems:'center'}}>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'#aaa'}}>TYPE</span>
          {["全部","API","本地"].map(t=><button key={t} onClick={()=>setType(t as any)} style={type===t?btnSel:btnBase}>{t}</button>)}
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'#aaa',marginLeft:8}}>CATEGORY</span>
          {cats.map(t=><button key={t} onClick={()=>setCat(t)} style={cat===t?btnSel:btnBase}>{t}</button>)}
        </div>

        <div style={{display:'flex',alignItems:'center',background:'rgba(255,255,255,0.04)',border:'1px solid #222',borderRadius:10,maxWidth:300,marginBottom:24}}>
          <Search size={14} style={{marginLeft:14,color:'#777'}} />
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="搜索模型..." style={{flex:1,background:'transparent',border:'none',outline:'none',padding:'10px 14px',fontSize:13,color:'#fff'}} />
        </div>

        <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700,color:'#ccc',marginBottom:24}}>{filtered.length} models</p>

        <div style={{display:'flex',flexDirection:'column',gap:2,border:'1px solid #1a1a1a',background:'#1a1a1a'}}>
          {filtered.map(m=>(
            <div key={m.id} style={{background:'rgba(255,255,255,0.02)',padding:'20px 24px',display:'flex',alignItems:'center',gap:16,transition:'0.3s'}}
              onMouseEnter={e=>e.currentTarget.style.background='rgba(201,168,76,0.04)'}
              onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.02)'}>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:14,fontWeight:900,color:m.rank<=3?'#c9a84c':'#555',width:28}}>#{m.rank}</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:'flex',alignItems:'baseline',gap:8,marginBottom:4,flexWrap:'wrap'}}>
                  <h3 style={{fontSize:15,fontWeight:700,color:'#fff'}}>{m.name}</h3>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'#888'}}>{m.provider}</span>
                  <span className="tag tag-blue" style={{fontWeight:600,fontSize:9}}>{m.type}</span>
                  <span className="tag tag-gray" style={{fontWeight:600,fontSize:9}}>{m.category}</span>
                  <span className="tag tag-green" style={{fontWeight:600,fontSize:9}}>{m.speed}</span>
                </div>
                <p style={{fontSize:12,color:'#aaa',lineHeight:1.6}}>{m.description}</p>
                <div style={{display:'flex',gap:16,marginTop:6,fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'#666'}}>
                  <span>{m.pricing}</span>
                  <span>上下文: {m.contextWindow}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
