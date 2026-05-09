"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { tools, categories, ToolCategory } from "@/data/tools"
import { Search } from "lucide-react"
import { LiveEvaluationNotice } from "@/components/LiveEvaluationNotice"

function letter(n:string){return /^[a-zA-Z]/.test(n)?n[0].toUpperCase():n[0]}
function avColor(n:string){const c=["#c9a84c","#e8c96a","#7a6230","#5a8a5a"];let h=0;for(let i=0;i<n.length;i++)h=n.charCodeAt(i)+((h<<5)-h);return c[Math.abs(h)%c.length]}
const cnKw=["国产","中文","腾讯","阿里","百度","字节","快手","智谱","月之暗面","MiniMax","Kimi","DeepSeek","通义","文心","豆包","即梦","可灵","Coze","QClaw","ArkClaw","CowAgent","NocoBase","AionUi","万兴"]
function isCN(t:typeof tools[0]){return cnKw.some(k=>t.name.includes(k)||t.tags.some(tg=>tg.includes(k))||t.description.includes(k))}

function ToolCard2({tool:t,rank}:{tool:typeof tools[0];rank:number}){
  return <a href={t.url} target="_blank" rel="noopener noreferrer"
    style={{background:'rgba(255,255,255,0.03)',border:'1px solid #1a1a1a',borderRadius:14,padding:'20px 24px',textDecoration:'none',transition:'all 0.3s',display:'flex',alignItems:'center',gap:14}}
    onMouseEnter={e=>{e.currentTarget.style.background='rgba(201,168,76,0.06)';e.currentTarget.style.borderColor='#7a6230'}}
    onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.03)';e.currentTarget.style.borderColor='#1a1a1a'}}>
    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:900,color:rank<=3?'#c9a84c':'#555',width:24}}>#{rank}</span>
    <span style={{width:36,height:36,borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:900,color:'#fff',background:avColor(t.name),fontFamily:"'JetBrains Mono',monospace",flexShrink:0}}>{letter(t.name)}</span>
    <div style={{flex:1,minWidth:0}}>
      <h3 style={{fontSize:15,fontWeight:700,color:'#fff',marginBottom:2}}>{t.name}</h3>
      <p style={{fontSize:12,color:'#ccc',lineHeight:1.5,marginBottom:4}}><span style={{color:'#c9a84c',fontWeight:600}}>能做什么：</span>{t.description}</p>
      <div style={{display:'flex',gap:4,flexWrap:'wrap',alignItems:'center'}}>
        <span style={{fontSize:11,color:'#888'}}>{t.pricing}</span>
        {t.featured&&<span style={{fontSize:11,color:'#c9a84c'}}>✦</span>}
        {t.tags.slice(0,2).map(tg=><span key={tg} style={{fontSize:10,color:'#666',border:'1px solid #222',padding:'1px 6px',borderRadius:3}}>{tg}</span>)}
      </div>
    </div>
  </a>
}

export default function ToolsClient() {
  const sp = useSearchParams()
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [cat, setCat] = useState<ToolCategory|null>(null)
  const [stage, setStage] = useState<number|null>(null)
  const [region, setRegion] = useState<"全部"|"中国"|"海外">("全部")
  useEffect(()=>{const c=sp.get("category")as ToolCategory|null;if(c)setCat(c);const s=sp.get("search");if(s)setSearch(s)},[sp])

  const filtered = useMemo(()=>{
    let r=tools
    if(search.trim()){const q=search.toLowerCase();r=r.filter(t=>t.name.toLowerCase().includes(q)||t.description.toLowerCase().includes(q)||t.tags.some(t=>t.toLowerCase().includes(q)))}
    if(cat)r=r.filter(t=>t.category===cat);if(stage!==null)r=r.filter(t=>t.stage===stage)
    const cnKeywords = ["国产","中文","腾讯","阿里","百度","字节","快手","智谱","月之暗面","MiniMax","Kimi","DeepSeek","通义","文心","豆包","即梦","可灵","Coze","QClaw","ArkClaw"]
    if(region==="中国") r=r.filter(t=>cnKeywords.some(kw=>t.name.includes(kw)||t.tags.some(tg=>tg.includes(kw))||t.description.includes(kw)))
    if(region==="海外") r=r.filter(t=>!cnKeywords.some(kw=>t.name.includes(kw)||t.tags.some(tg=>tg.includes(kw))))
    return r.sort((a,b)=>b.rank-a.rank)
  },[search,cat,stage,region])

  return (
    <>
      {/* 搜索 */}
      <div style={{display:'flex',alignItems:'center',background:'rgba(255,255,255,0.04)',border:'1px solid #222',borderRadius:10,maxWidth:400,margin:'0 auto',marginBottom:24}}>
        <Search size={14} style={{marginLeft:14,color:'#777'}} />
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="搜索工具..."
          style={{flex:1,background:'transparent',border:'none',outline:'none',padding:'11px 14px',fontSize:13,color:'#fff',fontFamily:"'Noto Sans SC', sans-serif"}} />
      </div>

      <LiveEvaluationNotice scope="tools" />

      {/* 选中分类后的专属页面 */}
      {cat && <div style={{marginBottom:32}}>
        <button onClick={()=>{setCat(null);window.history.pushState({},"","/tools")}} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:14,fontWeight:700,color:'#e8c96a',background:'none',border:'1px solid #7a6230',padding:'8px 20px',borderRadius:6,cursor:'pointer',marginBottom:16}}>← 返回全部</button>
        <h2 style={{fontSize:30,fontWeight:900,color:'#fff'}}>{categories.find(c=>c.key===cat)?.icon} {cat}</h2>
        <p style={{fontSize:16,color:'#ccc',marginTop:6}}>{tools.filter(t=>t.category===cat).length} 个工具</p>
      </div>}

      <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700,color:'#ccc',marginBottom:24}}>{filtered.length} results</p>

      {filtered.length===0?(
        <div style={{textAlign:'center',padding:80,fontSize:14,fontWeight:500,color:'#aaa'}}>No results</div>
      ):(
        <div style={{display:'flex',gap:16}} className="max-sm:flex-col">
          <div style={{flex:1}}>
            <h3 style={{fontSize:14,fontWeight:700,color:'#e8c96a',marginBottom:12,fontFamily:"'JetBrains Mono',monospace"}}>🇨🇳 中国</h3>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {filtered.filter(t=>isCN(t)).map((t,i)=><ToolCard2 key={t.id} tool={t} rank={filtered.indexOf(t)+1} />)}
            </div>
          </div>
          <div style={{flex:1}}>
            <h3 style={{fontSize:14,fontWeight:700,color:'#c9a84c',marginBottom:12,fontFamily:"'JetBrains Mono',monospace"}}>🌍 海外</h3>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {filtered.filter(t=>!isCN(t)).map((t,i)=><ToolCard2 key={t.id} tool={t} rank={filtered.indexOf(t)+1} />)}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
