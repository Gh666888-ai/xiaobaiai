"use client"

import { useEffect, useState } from "react"
import { models, Model } from "@/data/models"
import { modelRankingMeta } from "@/data/model-meta"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"
import { LiveEvaluationNotice } from "@/components/LiveEvaluationNotice"
import { Search, Zap, Cpu, Trophy } from "lucide-react"

type PriceSnapshot = {
  updatedAt: string
  priceBasis: string
  sources: { name: string; url: string; reachable?: boolean; status?: string }[]
  prices: { id: string; input: string; output: string; note: string }[]
}

const btnBase={fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700,padding:'5px 14px',border:'1px solid #1a1a1a',color:'#888',background:'transparent',cursor:'pointer',transition:'0.2s',borderRadius:6}
const btnSel={...btnBase,borderColor:'#7a6230',color:'#e8c96a',background:'rgba(201,168,76,0.08)'}

export default function ModelsPage() {
  const [type, setType] = useState<"全部"|"API"|"本地">("全部")
  const [cat, setCat] = useState<string>("全部")
  const [search, setSearch] = useState("")
  const [priceSnapshot, setPriceSnapshot] = useState<PriceSnapshot | null>(null)

  useEffect(() => {
    fetch("/model-prices.json")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data && setPriceSnapshot(data))
      .catch(() => setPriceSnapshot(null))
  }, [])

  const cats = ["全部","对话","编程","绘图","视频","音频","嵌入"]

  const filtered = models.filter(m=>{
    if(type!=="全部"&&m.type!==type) return false
    if(cat!=="全部"&&m.category!==cat) return false
    if(search.trim()&&!m.name.includes(search)&&!m.provider.includes(search)&&!m.description.includes(search)) return false
    return true
  }).sort((a,b)=>a.rank-b.rank)

  const apiModels = models.filter(m=>m.type==="API").slice(0,3)
  const localModels = models.filter(m=>m.type==="本地").slice(0,3)
  const beginnerPicks = [
    models.find((m) => m.name.toLowerCase().includes("deepseek")) || apiModels[0],
    models.find((m) => m.name.toLowerCase().includes("kimi")) || apiModels[1],
    models.find((m) => m.type === "本地") || localModels[0],
  ].filter(Boolean) as Model[]

  return (
    <div style={{background:'#000',minHeight:'100vh',fontFamily:"'Noto Sans SC', sans-serif",position:'relative',overflow:'hidden'}}>
      <MathRain />
      <NavBar />
      <div style={{maxWidth:1100,margin:'0 auto',padding:'60px 60px 100px',position:'relative',zIndex:10,background:'rgba(0,0,0,0.85)'}} className="max-sm:px-4">
        <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:'0.4em',color:'#7a6230',textTransform:'uppercase',marginBottom:10,fontWeight:700}}>Model Rankings</p>
        <h1 style={{fontSize:36,fontWeight:900,color:'#fff',letterSpacing:'0.02em',marginBottom:8}}>AI 模型排行</h1>
        <p style={{fontSize:15,fontWeight:500,color:'#ccc',marginBottom:24}}>不用先看完整榜单。先按你的任务选一个模型，跑通以后再比较价格和排名。</p>

        <LiveEvaluationNotice scope="models" />

        <section style={{border:'1px solid #2a1f10',background:'rgba(201,168,76,0.045)',borderRadius:12,padding:'20px 22px',marginBottom:18}}>
          <h2 style={{fontSize:23,fontWeight:950,color:'#fff',lineHeight:1.35,marginBottom:8}}>小白先这样选</h2>
          <p style={{fontSize:13,color:'#aaa',lineHeight:1.8,marginBottom:14}}>日常先用便宜快的，长文档再换长上下文，本地模型等你明确需要隐私或离线再装。</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,250px),1fr))',gap:10}}>
            {beginnerPicks.map((m)=>(
              <a key={m.id} href={m.url} target="_blank" rel="noopener noreferrer" style={{textDecoration:'none',border:'1px solid #2b2618',background:'rgba(0,0,0,0.24)',borderRadius:10,padding:'16px 17px',minHeight:154,display:'flex',flexDirection:'column'}}>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:950,color:m.type==="本地"?'#3DA563':'#e8c96a',marginBottom:8}}>{m.type} · {m.category}</span>
                <h3 style={{fontSize:18,fontWeight:950,color:'#fff',lineHeight:1.35,marginBottom:7}}>{m.name}</h3>
                <p style={{fontSize:12,color:'#aaa',lineHeight:1.65,flex:1}}>{m.description}</p>
                <span style={{fontSize:12,color:'#e8c96a',fontWeight:950,marginTop:10}}>下载/访问 →</span>
              </a>
            ))}
          </div>
        </section>

        <details style={{border:'1px solid #1f1f1f',background:'rgba(255,255,255,0.022)',borderRadius:12,padding:'16px 18px',marginBottom:18}}>
          <summary style={{color:'#e8c96a',fontSize:14,fontWeight:950,cursor:'pointer'}}>展开价格来源和榜单说明</summary>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4, 1fr)',gap:8,margin:'16px 0 18px'}} className="max-sm:grid-cols-1">
          <div style={{border:'1px solid #1a1a1a',background:'rgba(255,255,255,0.03)',borderRadius:10,padding:'14px 16px'}}>
            <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'#777',marginBottom:5}}>UPDATED</p>
            <p style={{fontSize:13,color:'#fff',fontWeight:800}}>{modelRankingMeta.updatedAt}</p>
          </div>
          <div style={{border:'1px solid #1a1a1a',background:'rgba(255,255,255,0.03)',borderRadius:10,padding:'14px 16px'}}>
            <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'#777',marginBottom:5}}>PRICE BASIS</p>
            <p style={{fontSize:13,color:'#fff',fontWeight:800}}>公开 API 标价</p>
          </div>
          <div style={{border:'1px solid #1a1a1a',background:'rgba(255,255,255,0.03)',borderRadius:10,padding:'14px 16px'}}>
            <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'#777',marginBottom:5}}>SCORE</p>
            <p style={{fontSize:13,color:'#fff',fontWeight:800}}>本站主观评分</p>
          </div>
          <div style={{border:'1px solid #1a1a1a',background:'rgba(255,255,255,0.03)',borderRadius:10,padding:'14px 16px'}}>
            <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'#777',marginBottom:5}}>SOURCES</p>
            <p style={{fontSize:13,color:'#fff',fontWeight:800}}>{modelRankingMeta.sources.length} 个来源</p>
          </div>
        </div>

        <div style={{border:'1px solid #2a1f10',background:'rgba(201,168,76,0.04)',borderRadius:12,padding:'16px 18px'}}>
          <p style={{fontSize:12,color:'#d6c28a',lineHeight:1.8}}>{modelRankingMeta.priceBasis}</p>
          {priceSnapshot && (
            <div style={{marginTop:12,padding:'12px 14px',border:'1px solid #2a1f10',borderRadius:8,background:'rgba(0,0,0,0.28)'}}>
              <p style={{fontSize:12,color:'#fff',fontWeight:900}}>自动价格快照：{new Date(priceSnapshot.updatedAt).toLocaleString("zh-CN", { hour12: false })}</p>
              <p style={{fontSize:11,color:'#aaa',lineHeight:1.8,marginTop:4}}>{priceSnapshot.priceBasis}</p>
              <p style={{fontSize:11,color:'#777',lineHeight:1.8,marginTop:4}}>服务器可用 <code style={{color:'#c9a84c'}}>npm run update:model-prices</code> 定期刷新，结果写入 <code style={{color:'#c9a84c'}}>public/model-prices.json</code>。</p>
            </div>
          )}
          <p style={{fontSize:12,color:'#aaa',lineHeight:1.8,marginTop:6}}>{modelRankingMeta.subjectiveNote}</p>
          <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:10}}>
            {modelRankingMeta.sources.map(source=>(
              <a key={source.name} href={source.url} target="_blank" rel="noopener noreferrer" className="tag tag-gray" style={{textDecoration:'none',fontSize:9}}>{source.name}</a>
            ))}
          </div>
        </div>
        </details>

        {/* Top 3 */}
        <section style={{border:'1px solid #1f1f1f',background:'rgba(255,255,255,0.022)',borderRadius:12,padding:'18px 20px',marginBottom:18}}>
          <h2 style={{fontSize:21,fontWeight:950,color:'#fff',lineHeight:1.35,marginBottom:12}}>快速对比</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))',gap:10}}>
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
            <p style={{fontSize:12,color:'#aaa',lineHeight:1.8}}>日常模型：DeepSeek V4 Flash<br/>工程 Agent：Codex / Claude Code<br/>国产模型后端：DeepSeek V4 / Kimi K2.6</p>
          </div>
        </div>
        </section>

        <details style={{border:'1px solid #1f1f1f',background:'rgba(255,255,255,0.022)',borderRadius:12,padding:'16px 18px'}}>
          <summary style={{color:'#e8c96a',fontSize:14,fontWeight:950,cursor:'pointer'}}>展开完整模型榜单</summary>
        <div style={{paddingTop:18}}>
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
                <p style={{fontSize:13,color:'#ccc',lineHeight:1.7}}>{m.description}</p>
                {m.pros&&<div style={{marginTop:6}}><span style={{fontSize:11,color:'#3DA563',fontWeight:700}}>✅ {m.pros}</span></div>}
                {m.cons?<div style={{marginTop:2}}><span style={{fontSize:11,color:'#D94841',fontWeight:700}}>⚠️ {m.cons}</span></div>:null}
                {m.useCase&&<div style={{marginTop:2}}><span style={{fontSize:11,color:'#c9a84c',fontWeight:700}}>🎯 {m.useCase}</span></div>}
                <div style={{display:'flex',gap:16,marginTop:6,fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'#666',alignItems:'center'}}>
                  <span>价格: {priceSnapshot?.prices.find(p=>p.id===m.id)?.input || m.pricing}</span>
                  <span>上下文: {m.contextWindow}</span>
                  <span>场景: {m.useCase}</span>
                  <a href={m.url} target="_blank" rel="noopener noreferrer" style={{color:'#c9a84c',textDecoration:'none',fontWeight:700,marginLeft:'auto'}}>下载/访问 →</a>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
        </details>
      </div>
    </div>
  )
}
