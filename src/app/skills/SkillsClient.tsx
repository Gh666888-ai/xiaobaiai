"use client"

import { useEffect, useState } from "react"
import { skills, skillCategories, SkillCategory } from "@/data/skills"
import { professionSkillTracks, recommendSkillsForGoal } from "@/data/skill-recommendations"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"
import { Search, Download, Sparkles } from "lucide-react"

const PAGE_SIZE = 48

type FetchedSkillItem = {
  id: string
  name: string
  source: string
  url: string
  platform: string
  category: string
  description: string
  score: number
  recommendedFor: string[]
  reason: string
  safetyNote: string
}

export default function SkillsPage() {
  const [cat, setCat] = useState<SkillCategory|null>(null)
  const [platform, setPlatform] = useState<string>("全部")
  const [search, setSearch] = useState("")
  const [goal, setGoal] = useState("我做电商，想用 AI 做商品资料、种草内容和客服")
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [fetchedSkills, setFetchedSkills] = useState<FetchedSkillItem[]>([])
  const recommendationPlan = recommendSkillsForGoal(goal, 4)
  const discoveredSkills = fetchedSkills
    .filter(item => item.score >= 65 && (item.recommendedFor.includes(recommendationPlan.track.shortTitle) || item.recommendedFor.some(label => recommendationPlan.track.title.includes(label))))
    .slice(0, 3)

  useEffect(() => {
    let mounted = true
    fetch("/fetched-skills.json", { cache: "no-store" })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (!mounted || !Array.isArray(data?.items)) return
        setFetchedSkills(data.items)
      })
      .catch(() => undefined)
    return () => {
      mounted = false
    }
  }, [])

  const filtered = skills.filter(s => {
    if (cat && s.category !== cat) return false
    if (platform !== "全部" && s.platform !== platform) return false
    if (search.trim() && !s.name.includes(search) && !s.description.includes(search) && !s.tags.some(t=>t.includes(search))) return false
    return true
  }).sort((a,b)=>{
    const parse = (s:string)=>s.endsWith("K")?parseFloat(s)*1000:parseInt(s)
    return parse(b.downloads)-parse(a.downloads)
  })
  const visibleSkills = filtered.slice(0, visibleCount)

  function updateFilter(fn: () => void) {
    fn()
    setVisibleCount(PAGE_SIZE)
  }

  return (
    <div style={{background:'#000',minHeight:'100vh',fontFamily:"'Noto Sans SC', sans-serif",position:'relative',overflow:'hidden'}}>
      <MathRain />
      <NavBar />
      <div style={{maxWidth:1100,margin:'0 auto',padding:'60px 60px 100px',position:'relative',zIndex:10,background:'rgba(0,0,0,0.85)'}} className="max-sm:px-4">
        <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:'0.4em',color:'#7a6230',textTransform:'uppercase',marginBottom:10,fontWeight:700}}>Skill Hub</p>
        <h1 style={{fontSize:36,fontWeight:900,color:'#fff',letterSpacing:'0.02em',marginBottom:8}}>Agent Skill 推荐</h1>
        <p style={{fontSize:17,fontWeight:700,color:'#ddd',marginBottom:24,lineHeight:1.7}}>先说你的行业和想交给 AI 的工作，小白会按工作流给 Skill 打分，不让新手自己乱翻。</p>

        <section style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(232,201,106,0.22)',borderRadius:12,padding:20,marginBottom:28}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
            <Sparkles size={18} color="#e8c96a" />
            <h2 style={{fontSize:22,fontWeight:900,color:'#fff',margin:0}}>按职业推荐 Skill</h2>
          </div>
          <div style={{display:'flex',alignItems:'center',background:'rgba(0,0,0,0.32)',border:'1px solid #2b2b2b',borderRadius:10,marginBottom:14}}>
            <Search size={16} style={{marginLeft:14,color:'#aaa'}} />
            <input value={goal} onChange={e=>setGoal(e.target.value)} placeholder="例如：我做教育培训，想用 AI 做课件和答疑知识库"
              style={{flex:1,background:'transparent',border:'none',outline:'none',padding:'13px 14px',fontSize:16,color:'#fff',fontWeight:700,fontFamily:"'Noto Sans SC', sans-serif"}} />
          </div>
          <div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:16}}>
            {professionSkillTracks.map(track=>(
              <button key={track.id} onClick={()=>setGoal(`我做${track.shortTitle}，想用 AI 做${track.workflow.slice(0,3).join("、")}`)}
                style={{border:'1px solid rgba(232,201,106,0.28)',background:recommendationPlan.track.id===track.id?'rgba(232,201,106,0.16)':'rgba(255,255,255,0.04)',color:recommendationPlan.track.id===track.id?'#f5d873':'#ddd',borderRadius:8,padding:'7px 12px',fontSize:14,fontWeight:800,cursor:'pointer'}}>
                {track.shortTitle}
              </button>
            ))}
          </div>
          <p style={{fontSize:15,fontWeight:800,color:'#e8c96a',marginBottom:12}}>小白判断：{recommendationPlan.track.shortTitle}，先做 {recommendationPlan.workflow.slice(0,4).join(" → ")}</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(210px, 1fr))',gap:10}}>
            {recommendationPlan.recommendations.map(item=>(
              <a key={item.skill.id} href={item.skill.url&&item.skill.url!=="#"?"https://"+item.skill.url.replace(/^https?:\/\//,""):"#"} target={item.skill.url&&item.skill.url!=="#"?"_blank":undefined} style={{textDecoration:'none'}}>
                <div style={{height:'100%',background:'rgba(0,0,0,0.28)',border:'1px solid #262626',borderRadius:10,padding:14}}>
                  <div style={{display:'flex',justifyContent:'space-between',gap:10,alignItems:'flex-start',marginBottom:8}}>
                    <h3 style={{fontSize:17,fontWeight:900,color:'#fff',margin:0,lineHeight:1.3}}>{item.skill.name}</h3>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:18,fontWeight:900,color:'#e8c96a'}}>{item.score}</span>
                  </div>
                  <p style={{fontSize:14,fontWeight:700,color:'#cfcfcf',lineHeight:1.65,marginBottom:8}}>{item.reason}</p>
                  <p style={{fontSize:13,fontWeight:800,color:'#9fc7ff',lineHeight:1.6,margin:0}}>验收：{item.firstCheck}</p>
                </div>
              </a>
            ))}
          </div>
          {discoveredSkills.length > 0 && (
            <div style={{marginTop:18,paddingTop:16,borderTop:'1px solid rgba(255,255,255,0.1)'}}>
              <p style={{fontSize:15,fontWeight:900,color:'#fff',marginBottom:10}}>今天新发现的候选 Skill</p>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))',gap:10}}>
                {discoveredSkills.map(item=>(
                  <a key={item.id} href={item.url} target="_blank" style={{textDecoration:'none'}}>
                    <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid #262626',borderRadius:10,padding:14}}>
                      <div style={{display:'flex',justifyContent:'space-between',gap:10,marginBottom:8}}>
                        <h3 style={{fontSize:16,fontWeight:900,color:'#fff',margin:0,lineHeight:1.35}}>{item.name}</h3>
                        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:17,fontWeight:900,color:'#9fc7ff'}}>{item.score}</span>
                      </div>
                      <p style={{fontSize:13,fontWeight:700,color:'#cfcfcf',lineHeight:1.6,marginBottom:8}}>{item.reason}</p>
                      <p style={{fontSize:12,fontWeight:800,color:'#999',lineHeight:1.6,margin:0}}>{item.safetyNote}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 搜索 */}
        <div style={{display:'flex',alignItems:'center',background:'rgba(255,255,255,0.04)',border:'1px solid #222',borderRadius:10,maxWidth:480,marginBottom:24}}>
          <Search size={16} style={{marginLeft:14,color:'#aaa'}} />
          <input value={search} onChange={e=>{setSearch(e.target.value); setVisibleCount(PAGE_SIZE)}} placeholder="搜索技能..."
            style={{flex:1,background:'transparent',border:'none',outline:'none',padding:'13px 14px',fontSize:16,color:'#fff',fontWeight:700,fontFamily:"'Noto Sans SC', sans-serif"}} />
        </div>

        {/* 分类 */}
        <div style={{marginBottom:16}}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'0.15em',color:'#ccc',fontWeight:700,marginBottom:8}}>CATEGORY</p>
          <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
            <Btn sel={cat===null} onClick={()=>updateFilter(()=>setCat(null))}>全部</Btn>
            {skillCategories.map(c=><Btn key={c.key} sel={cat===c.key} onClick={()=>updateFilter(()=>setCat(cat===c.key?null:c.key))}>{c.icon} {c.label}</Btn>)}
          </div>
        </div>

        {/* 平台 */}
        <div style={{marginBottom:32}}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'0.15em',color:'#ccc',fontWeight:700,marginBottom:8}}>PLATFORM</p>
          <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
            {["全部","QClaw","OpenClaw","Dify","Coze","n8n","通用"].map(p=><Btn key={p} sel={platform===p} onClick={()=>updateFilter(()=>setPlatform(p))}>{p}</Btn>)}
          </div>
        </div>

        <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700,color:'#ccc',marginBottom:24}}>{filtered.length} skills</p>

        {filtered.length===0?(
          <div style={{textAlign:'center',padding:80,color:'#aaa'}}>No results</div>
        ):(
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))',gap:10}}>
            {visibleSkills.map((s,i)=>{
              const isEasy = s.difficulty==="简单"
              const isAdv = s.difficulty==="进阶"
              return (
                <a key={s.id} href={s.url&&s.url!=="#"?"https://"+s.url.replace(/^https?:\/\//,""):"#"} target={s.url&&s.url!=="#"?"_blank":undefined} style={{textDecoration:'none'}}
                  onClick={s.url==="#"||!s.url?(e=>e.preventDefault()):undefined}>
                <div
                  style={{background:'rgba(255,255,255,0.03)',border:'1px solid #1a1a1a',borderRadius:14,padding:'24px',transition:'all 0.3s',display:'flex',flexDirection:'column',justifyContent:'space-between',position:'relative'}}
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
                    <p style={{fontSize:15,color:'#d4d4d4',fontWeight:600,lineHeight:1.7,marginBottom:12}}>{s.description}</p>
                    <div style={{display:'flex',flexWrap:'wrap',gap:4,marginBottom:12}}>
                      {s.tags.map(t=><span key={t} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'#888',border:'1px solid #222',padding:'2px 8px',borderRadius:4,fontWeight:500}}>{t}</span>)}
                    </div>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:8,fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'#aaa',marginTop:8,paddingTop:8,borderTop:'1px solid #1a1a1a'}}>
                    <Download size={12} /> {s.downloads} 安装
                    <span style={{marginLeft:'auto',fontSize:10,color:'#888'}}>{s.platform==="QClaw"?"技能市场搜•一键安装":s.platform==="OpenClaw"?"openclaw skill install":"自带/Dify工作流添加"}</span>
                  </div>
                </div>
                </a>
              )
            })}
          </div>
        )}
        {visibleCount < filtered.length && (
          <div style={{display:'flex',justifyContent:'center',marginTop:28}}>
            <button onClick={()=>setVisibleCount(v=>v+PAGE_SIZE)}
              style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:800,padding:'10px 22px',border:'1px solid #7a6230',color:'#e8c96a',background:'rgba(201,168,76,0.08)',cursor:'pointer',borderRadius:8}}>
              Load more · {Math.min(PAGE_SIZE, filtered.length - visibleCount)} / {filtered.length - visibleCount}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function Btn({sel,onClick,children}:{sel:boolean;onClick:()=>void;children:React.ReactNode}){
  return <button onClick={onClick} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700,padding:'5px 14px',border:`1px solid ${sel?'#7a6230':'#1a1a1a'}`,color:sel?'#e8c96a':'#888',background:sel?'rgba(201,168,76,0.08)':'transparent',cursor:'pointer',transition:'0.2s',borderRadius:6}}>{children}</button>
}
