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

const btnBase:React.CSSProperties = {fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700,padding:'5px 14px',border:'1px solid #1a1a1a',color:'#888',background:'transparent',cursor:'pointer',transition:'0.2s',borderRadius:6}
const btnSel:React.CSSProperties = {...btnBase,borderColor:'#7a6230',color:'#e8c96a',background:'rgba(201,168,76,0.08)'}

function ToolsContent() {
  const sp = useSearchParams()
  const [search, setSearch] = useState("")
  const [cat, setCat] = useState<ToolCategory|null>(null)
  const [stage, setStage] = useState<number|null>(null)
  useEffect(()=>{const c=sp.get("category")as ToolCategory|null;if(c)setCat(c)},[sp])

  const filtered = useMemo(()=>{
    let r=tools
    if(search.trim()){const q=search.toLowerCase();r=r.filter(t=>t.name.toLowerCase().includes(q)||t.description.toLowerCase().includes(q)||t.tags.some(t=>t.toLowerCase().includes(q)))}
    if(cat)r=r.filter(t=>t.category===cat);if(stage!==null)r=r.filter(t=>t.stage===stage)
    return r
  },[search,cat,stage])

  return (
    <div style={{background:'#000',minHeight:'100vh',fontFamily:"'Noto Sans SC', sans-serif",position:'relative',overflow:'hidden'}}>
      <MathRain />
      <NavBar />

      <div style={{maxWidth:1100,margin:'0 auto',padding:'60px 60px',position:'relative',zIndex:10,background:'rgba(0,0,0,0.85)'}} className="max-sm:px-4">
        <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:'0.4em',color:'#7a6230',textTransform:'uppercase',marginBottom:10,fontWeight:700}}>Directory</p>
        <h1 style={{fontSize:36,fontWeight:900,color:'#fff',letterSpacing:'0.02em',marginBottom:8}}>工具导航</h1>
        <p style={{fontSize:14,fontWeight:400,color:'#ccc',marginBottom:40}}>{tools.length} tools indexed</p>

        <div style={{display:'flex',alignItems:'center',background:'rgba(255,255,255,0.04)',border:'1px solid #222',borderRadius:10,maxWidth:420,marginBottom:32,transition:'border-color 0.3s'}}
          onFocus={e=>e.currentTarget.style.borderColor='#7a6230'} onBlur={e=>e.currentTarget.style.borderColor='#222'}>
          <Search size={14} style={{marginLeft:16,color:'#777',flexShrink:0}} />
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="搜索工具..."
            style={{flex:1,background:'transparent',border:'none',outline:'none',padding:'12px 14px',fontSize:13,fontWeight:500,color:'#fff',fontFamily:"'Noto Sans SC', sans-serif"}} />
        </div>

        <div style={{display:'flex',flexWrap:'wrap',gap:28,marginBottom:40}}>
          <div>
            <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:'0.2em',color:'#ccc',fontWeight:700,marginBottom:10}}>CATEGORY</p>
            <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
              <button onClick={()=>setCat(null)} style={cat===null?btnSel:btnBase}>ALL</button>
              {categories.map(c=><button key={c.key} onClick={()=>setCat(cat===c.key?null:c.key)} style={cat===c.key?btnSel:btnBase}>{c.label}</button>)}
            </div>
          </div>
          <div>
            <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:'0.2em',color:'#ccc',fontWeight:700,marginBottom:10}}>STAGE</p>
            <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
              <button onClick={()=>setStage(null)} style={stage===null?btnSel:btnBase}>ALL</button>
              {Object.entries(stageLabels).map(([k,v])=><button key={k} onClick={()=>setStage(stage===Number(k)?null:Number(k))} style={stage===Number(k)?btnSel:btnBase}>{v}</button>)}
            </div>
          </div>
        </div>

        <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700,color:'#ccc',marginBottom:24}}>{filtered.length} results</p>

        {filtered.length===0?(
          <div style={{textAlign:'center',padding:80,fontSize:14,fontWeight:500,color:'#aaa'}}>No results</div>
        ):(
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(310px, 1fr))',gap:10}}>
            {filtered.map(t=>(
              <a key={t.id} href={t.url} target="_blank" rel="noopener noreferrer"
                style={{background:'rgba(255,255,255,0.03)',border:'1px solid #1a1a1a',borderRadius:16,padding:'28px',textDecoration:'none',transition:'all 0.3s',display:'flex',flexDirection:'column',justifyContent:'space-between',backdropFilter:'blur(8px)'}}
                onMouseEnter={e=>{e.currentTarget.style.background='rgba(201,168,76,0.06)';e.currentTarget.style.borderColor='#7a6230';e.currentTarget.style.transform='translateY(-2px)'}}
                onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.03)';e.currentTarget.style.borderColor='#1a1a1a';e.currentTarget.style.transform='translateY(0)'}}>
                <div>
                  <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:16}}>
                    <span style={{width:40,height:40,borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,fontWeight:900,color:'#fff',background:avColor(t.name),fontFamily:"'JetBrains Mono',monospace",flexShrink:0}}>{letter(t.name)}</span>
                    <div style={{flex:1,minWidth:0}}>
                      <h3 style={{fontSize:17,fontWeight:800,color:'#fff',marginBottom:2,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{t.name}</h3>
                      <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:600,color:'#ddd',letterSpacing:'0.05em'}}>{t.pricing}</p>
                    </div>
                    {t.featured && <span style={{color:'#e8c96a',fontSize:13,fontWeight:700}}>✦</span>}
                  </div>
                  <p style={{fontSize:13,fontWeight:400,color:'#ccc',lineHeight:1.8,marginBottom:18}}>{t.description}</p>
                </div>
                <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                  <span className="tag tag-green" style={{fontWeight:700,fontSize:12,color:'#fff',borderColor:'rgba(61,165,99,0.4)'}}>{stageLabels[t.stage]}</span>
                  {t.tags.slice(0,3).map(tag=><span key={tag} className="tag tag-gray" style={{fontWeight:700,fontSize:12,color:'#ccc',borderColor:'#333'}}>{tag}</span>)}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ToolsPage() {
  return <Suspense><ToolsContent /></Suspense>
}
