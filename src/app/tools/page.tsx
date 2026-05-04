"use client"

import { Suspense, useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { tools, categories, stageLabels, ToolCategory } from "@/data/tools"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"
import Link from "next/link"
import { Search } from "lucide-react"

function letter(n:string){return /^[a-zA-Z]/.test(n)?n[0].toUpperCase():n[0]}
function avColor(n:string){const c=["#c9a84c","#e8c96a","#7a6230","#5a8a5a"];let h=0;for(let i=0;i<n.length;i++)h=n.charCodeAt(i)+((h<<5)-h);return c[Math.abs(h)%c.length]}
const cnKw=["国产","中文","腾讯","阿里","百度","字节","快手","智谱","月之暗面","MiniMax","Kimi","DeepSeek","通义","文心","豆包","即梦","可灵","Coze","QClaw","ArkClaw","CowAgent","NocoBase","AionUi","万兴"]
function isCN(t:typeof tools[0]){return cnKw.some(k=>t.name.includes(k)||t.tags.some(tg=>tg.includes(k))||t.description.includes(k))}

function ToolCard2({tool:t,rank,letter,avColor}:{tool:typeof tools[0];rank:number;letter:(n:string)=>string;avColor:(n:string)=>string}){
  return <a href={t.url} target="_blank" rel="noopener noreferrer"
    style={{background:'rgba(255,255,255,0.03)',border:'1px solid #1a1a1a',borderRadius:14,padding:'20px 24px',textDecoration:'none',transition:'all 0.3s',display:'flex',alignItems:'center',gap:14}}
    onMouseEnter={e=>{e.currentTarget.style.background='rgba(201,168,76,0.06)';e.currentTarget.style.borderColor='#7a6230'}}
    onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.03)';e.currentTarget.style.borderColor='#1a1a1a'}}>
    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:900,color:rank<=3?'#c9a84c':'#555',width:24}}>#{rank}</span>
    <span style={{width:36,height:36,borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:900,color:'#fff',background:avColor(t.name),fontFamily:"'JetBrains Mono',monospace",flexShrink:0}}>{letter(t.name)}</span>
    <div style={{flex:1,minWidth:0}}>
      <h3 style={{fontSize:14,fontWeight:700,color:'#fff',marginBottom:2}}>{t.name}</h3>
      <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
        <span style={{fontSize:11,color:'#aaa'}}>{t.pricing}</span>
        {t.featured&&<span style={{fontSize:11,color:'#c9a84c'}}>✦</span>}
      </div>
    </div>
  </a>
}

const btnBase:React.CSSProperties = {fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700,padding:'5px 14px',border:'1px solid #1a1a1a',color:'#888',background:'transparent',cursor:'pointer',transition:'0.2s',borderRadius:6}
const btnSel:React.CSSProperties = {...btnBase,borderColor:'#7a6230',color:'#e8c96a',background:'rgba(201,168,76,0.08)'}

function ToolsContent() {
  const sp = useSearchParams()
  const [search, setSearch] = useState("")
  const [cat, setCat] = useState<ToolCategory|null>(null)
  const [stage, setStage] = useState<number|null>(null)
  const [region, setRegion] = useState<"全部"|"国内"|"国外">("全部")
  useEffect(()=>{const c=sp.get("category")as ToolCategory|null;if(c)setCat(c)},[sp])

  const filtered = useMemo(()=>{
    let r=tools
    if(search.trim()){const q=search.toLowerCase();r=r.filter(t=>t.name.toLowerCase().includes(q)||t.description.toLowerCase().includes(q)||t.tags.some(t=>t.toLowerCase().includes(q)))}
    if(cat)r=r.filter(t=>t.category===cat);if(stage!==null)r=r.filter(t=>t.stage===stage)
    // 国内外判断：国内=包含国产/中文/国内等标签
    const cnKeywords = ["国产","中文","腾讯","阿里","百度","字节","快手","智谱","月之暗面","MiniMax","Kimi","DeepSeek","通义","文心","豆包","即梦","可灵","Coze","QClaw","ArkClaw"]
    if(region==="国内") r=r.filter(t=>cnKeywords.some(kw=>t.name.includes(kw)||t.tags.some(tg=>tg.includes(kw))||t.description.includes(kw)))
    if(region==="国外") r=r.filter(t=>!cnKeywords.some(kw=>t.name.includes(kw)||t.tags.some(tg=>tg.includes(kw))))
    return r.sort((a,b)=>b.rank-a.rank)
  },[search,cat,stage,region])

  return (
    <div style={{background:'#000',minHeight:'100vh',fontFamily:"'Noto Sans SC', sans-serif",position:'relative',overflow:'hidden'}}>
      <MathRain />
      <NavBar />

      <div style={{maxWidth:1100,margin:'0 auto',padding:'60px 60px',position:'relative',zIndex:10,background:'rgba(0,0,0,0.85)',textAlign:'left'}} className="max-sm:px-4">
        <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:'0.4em',color:'#7a6230',textTransform:'uppercase',marginBottom:10,fontWeight:700}}>Directory</p>
        <h1 style={{fontSize:36,fontWeight:900,color:'#fff',letterSpacing:'0.02em',marginBottom:8}}>工具导航</h1>
        <p style={{fontSize:14,fontWeight:400,color:'#ccc',marginBottom:32,textAlign:'left'}}>{tools.length} tools indexed</p>

        {/* 搜索 + 筛选居中 */}
        <div style={{display:'flex',alignItems:'center',background:'rgba(255,255,255,0.04)',border:'1px solid #222',borderRadius:10,maxWidth:400,margin:'0 auto',marginBottom:24}}>
          <Search size={14} style={{marginLeft:14,color:'#777'}} />
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="搜索工具..."
            style={{flex:1,background:'transparent',border:'none',outline:'none',padding:'11px 14px',fontSize:13,color:'#fff',fontFamily:"'Noto Sans SC', sans-serif"}} />
        </div>

        {/* Region + Category 筛选居中 */}
        <div style={{display:'flex',justifyContent:'center',gap:28,marginBottom:40,flexWrap:'wrap'}}>
          <div style={{textAlign:'center'}}>
            <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'0.15em',color:'#ccc',fontWeight:700,marginBottom:8}}>REGION</p>
            <div style={{display:'flex',gap:6}}>
              {["全部","国内","国外"].map(r=>(<button key={r} onClick={()=>setRegion(r as any)} style={region===r?btnSel:btnBase}>{r}</button>))}
            </div>
          </div>
        </div>

        {/* 各分类排行 */}
        <div style={{marginBottom:40}}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:'0.2em',color:'#e8c96a',fontWeight:700,marginBottom:16}}>🏆 分类排行（点击进入筛选）</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))',gap:10}}>
            {categories.map(cat=>{
              const top5 = tools.filter(t=>t.category===cat.key).sort((a,b)=>b.rank-a.rank).slice(0,5)
              if(top5.length===0) return null
              return (
                <div key={cat.key} onClick={()=>{setCat(cat.key);window.scrollTo({top:0,behavior:'smooth'})}}
                  style={{background:'rgba(255,255,255,0.03)',border:'1px solid #1a1a1a',borderRadius:12,padding:'16px 20px',cursor:'pointer',transition:'all 0.3s'}}
                  onMouseEnter={e=>{e.currentTarget.style.background='rgba(201,168,76,0.06)';e.currentTarget.style.borderColor='#7a6230'}}
                  onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.03)';e.currentTarget.style.borderColor='#1a1a1a'}}>
                  <h3 style={{fontSize:13,fontWeight:700,color:'#ccc',marginBottom:10,display:'flex',alignItems:'center',gap:6}}>
                    <span>{cat.icon}</span> {cat.label}
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'#555',marginLeft:'auto'}}>{tools.filter(t=>t.category===cat.key).length}个</span>
                  </h3>
                  {top5.map((t,i)=>{
                    const avColors=["#c9a84c","silver","#CD7F32","#555","#555"]
                    return (
                      <a key={t.id} href={t.url} target="_blank" rel="noopener noreferrer"
                        style={{display:'flex',alignItems:'center',gap:8,padding:'6px 0',textDecoration:'none',borderBottom:i<4?'1px solid #111':'none'}}>
                        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,color:avColors[i],width:20}}>#{i+1}</span>
                        <span style={{width:22,height:22,borderRadius:4,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:800,color:'#fff',background:avColors[i],flexShrink:0,fontFamily:"'JetBrains Mono',monospace"}}>{t.name[0].toUpperCase()}</span>
                        <span style={{fontSize:12,fontWeight:600,color:'#ccc',flex:1,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{t.name}</span>
                        <span style={{fontSize:10,color:'#555'}}>{t.pricing}</span>
                      </a>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>

        <div style={{display:'flex',flexWrap:'wrap',gap:28,marginBottom:40,justifyContent:'flex-start'}}>
              <button onClick={()=>setStage(null)} style={stage===null?btnSel:btnBase}>ALL</button>
              {Object.entries(stageLabels).map(([k,v])=><button key={k} onClick={()=>setStage(stage===Number(k)?null:Number(k))} style={stage===Number(k)?btnSel:btnBase}>{v}</button>)}
            </div>
          </div>
        </div>

        <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700,color:'#ccc',marginBottom:24}}>{filtered.length} results</p>

        {filtered.length===0?(
          <div style={{textAlign:'center',padding:80,fontSize:14,fontWeight:500,color:'#aaa'}}>No results</div>
        ):(
          <div style={{display:'flex',gap:16}} className="max-sm:flex-col">
            <div style={{flex:1}}>
              <h3 style={{fontSize:14,fontWeight:700,color:'#e8c96a',marginBottom:12,fontFamily:"'JetBrains Mono',monospace"}}>🇨🇳 国内</h3>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {filtered.filter(t=>isCN(t)).map((t,i)=><ToolCard2 key={t.id} tool={t} rank={filtered.indexOf(t)+1} letter={letter} avColor={avColor} />)}
              </div>
            </div>
            <div style={{flex:1}}>
              <h3 style={{fontSize:14,fontWeight:700,color:'#c9a84c',marginBottom:12,fontFamily:"'JetBrains Mono',monospace"}}>🌍 国外</h3>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {filtered.filter(t=>!isCN(t)).map((t,i)=><ToolCard2 key={t.id} tool={t} rank={filtered.indexOf(t)+1} letter={letter} avColor={avColor} />)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ToolsPage() {
  return <Suspense><ToolsContent /></Suspense>
}
