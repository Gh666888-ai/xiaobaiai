"use client"

import { useState } from "react"
import { skills, skillCategories, SkillCategory } from "@/data/skills"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"
import { Search, Download, Zap } from "lucide-react"

export default function SkillsPage() {
  const [cat, setCat] = useState<SkillCategory|null>(null)
  const [platform, setPlatform] = useState<string>("全部")
  const [search, setSearch] = useState("")

  const filtered = skills.filter(s => {
    if (cat && s.category !== cat) return false
    if (platform !== "全部" && s.platform !== platform) return false
    if (search.trim() && !s.name.includes(search) && !s.description.includes(search) && !s.tags.some(t=>t.includes(search))) return false
    return true
  }).sort((a,b)=>{
    const parse = (s:string)=>s.endsWith("K")?parseFloat(s)*1000:parseInt(s)
    return parse(b.downloads)-parse(a.downloads)
  })

  return (
    <div style={{background:'#000',minHeight:'100vh',fontFamily:"'Noto Sans SC', sans-serif",position:'relative',overflow:'hidden'}}>
      <MathRain />
      <NavBar />
      <div style={{maxWidth:1100,margin:'0 auto',padding:'60px 60px 100px',position:'relative',zIndex:10,background:'rgba(0,0,0,0.85)'}} className="max-sm:px-4">
        <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:'0.4em',color:'#7a6230',textTransform:'uppercase',marginBottom:10,fontWeight:700}}>Skill Hub</p>
        <h1 style={{fontSize:36,fontWeight:900,color:'#fff',letterSpacing:'0.02em',marginBottom:8}}>Agent 技能库</h1>
        <p style={{fontSize:15,fontWeight:500,color:'#ccc',marginBottom:32}}>48 个开箱即用的 Agent 技能，按分类和平台筛选</p>

        {/* 搜索 */}
        <div style={{display:'flex',alignItems:'center',background:'rgba(255,255,255,0.04)',border:'1px solid #222',borderRadius:10,maxWidth:400,marginBottom:24}}>
          <Search size={14} style={{marginLeft:14,color:'#777'}} />
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="搜索技能..."
            style={{flex:1,background:'transparent',border:'none',outline:'none',padding:'11px 14px',fontSize:13,color:'#fff',fontFamily:"'Noto Sans SC', sans-serif"}} />
        </div>

        {/* 分类 */}
        <div style={{marginBottom:16}}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'0.15em',color:'#ccc',fontWeight:700,marginBottom:8}}>CATEGORY</p>
          <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
            <Btn sel={cat===null} onClick={()=>setCat(null)}>全部</Btn>
            {skillCategories.map(c=><Btn key={c.key} sel={cat===c.key} onClick={()=>setCat(cat===c.key?null:c.key)}>{c.icon} {c.label}</Btn>)}
          </div>
        </div>

        {/* 平台 */}
        <div style={{marginBottom:32}}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'0.15em',color:'#ccc',fontWeight:700,marginBottom:8}}>PLATFORM</p>
          <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
            {["全部","QClaw","OpenClaw","Dify","Coze","n8n","通用"].map(p=><Btn key={p} sel={platform===p} onClick={()=>setPlatform(p)}>{p}</Btn>)}
          </div>
        </div>

        <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700,color:'#ccc',marginBottom:24}}>{filtered.length} skills</p>

        {filtered.length===0?(
          <div style={{textAlign:'center',padding:80,color:'#aaa'}}>No results</div>
        ):(
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))',gap:10}}>
            {filtered.map((s,i)=>{
              const isEasy = s.difficulty==="简单"
              const isAdv = s.difficulty==="进阶"
              return (
                <div key={s.id} style={{background:'rgba(255,255,255,0.03)',border:'1px solid #1a1a1a',borderRadius:14,padding:'24px',transition:'all 0.3s',display:'flex',flexDirection:'column',justifyContent:'space-between',position:'relative'}}
                  onMouseEnter={e=>{e.currentTarget.style.background='rgba(201,168,76,0.04)';e.currentTarget.style.borderColor='#7a6230'}}
                  onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.03)';e.currentTarget.style.borderColor='#1a1a1a'}}>
                  <span style={{position:'absolute',top:12,right:16,fontFamily:"'JetBrains Mono',monospace",fontSize:20,fontWeight:900,color:i<3?'#c9a84c':'#222'}}>#{i+1}</span>
                  <div>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10,flexWrap:'wrap'}}>
                      <span className={`tag ${isEasy?"tag-green":isAdv?"tag-red":"tag-gold"}`} style={{fontWeight:700,fontSize:10}}>{s.difficulty}</span>
                      <span className="tag tag-gray" style={{fontWeight:600,fontSize:10}}>{s.platform}</span>
                      <span className="tag tag-blue" style={{fontWeight:600,fontSize:10}}>{skillCategories.find(c=>c.key===s.category)?.icon} {s.category}</span>
                    </div>
                    <h3 style={{fontSize:16,fontWeight:700,color:'#fff',marginBottom:8}}>{s.name}</h3>
                    <p style={{fontSize:13,color:'#ccc',lineHeight:1.7,marginBottom:12}}>{s.description}</p>
                    <div style={{display:'flex',flexWrap:'wrap',gap:4,marginBottom:12}}>
                      {s.tags.map(t=><span key={t} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'#888',border:'1px solid #222',padding:'2px 8px',borderRadius:4,fontWeight:500}}>{t}</span>)}
                    </div>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:8,fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'#aaa',marginTop:8,paddingTop:8,borderTop:'1px solid #1a1a1a'}}>
                    <Download size={12} /> {s.downloads} 安装
                    <span style={{marginLeft:'auto',fontSize:10,color:'#888'}}>{s.platform==="QClaw"?"技能市场搜•一键安装":s.platform==="OpenClaw"?"openclaw skill install":"自带/Dify工作流添加"}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function Btn({sel,onClick,children}:{sel:boolean;onClick:()=>void;children:React.ReactNode}){
  return <button onClick={onClick} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700,padding:'5px 14px',border:`1px solid ${sel?'#7a6230':'#1a1a1a'}`,color:sel?'#e8c96a':'#888',background:sel?'rgba(201,168,76,0.08)':'transparent',cursor:'pointer',transition:'0.2s',borderRadius:6}}>{children}</button>
}
