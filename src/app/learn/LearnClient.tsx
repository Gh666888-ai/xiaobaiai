"use client"

import { useEffect, useState } from "react"
import { stages } from "@/data/learning-path"
import { tools } from "@/data/tools"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"
import { ContentVisual } from "@/components/ContentVisual"
import Link from "next/link"
import { progressId, readLearningProgress, LearningProgress } from "@/lib/learning-progress"

export default function LearnPage() {
  const [progress, setProgress] = useState<LearningProgress>({})

  useEffect(() => {
    setProgress(readLearningProgress())
    const onStorage = () => setProgress(readLearningProgress())
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const totalSections = stages.reduce((sum, stage) => sum + stage.sections.length, 0)
  const doneSections = stages.reduce((sum, stage) => sum + stage.sections.filter((_, index) => progress[progressId(stage.id, index)]).length, 0)

  return (
    <div style={{background:'#000',minHeight:'100vh',fontFamily:"'Noto Sans SC', sans-serif",position:'relative',overflow:'hidden'}}>
      <MathRain />
      <NavBar />

      <div style={{maxWidth:1080,margin:'0 auto',padding:'60px 60px',position:'relative',zIndex:10,background:'rgba(0,0,0,0.88)'}} className="max-sm:px-4">
        <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:'0.4em',color:'#7a6230',textTransform:'uppercase',marginBottom:10,fontWeight:700}}>Curriculum</p>
        <h1 style={{fontSize:36,fontWeight:900,color:'#fff',letterSpacing:'0.02em',marginBottom:8}}>小白爱学习</h1>
        <p style={{fontSize:14,fontWeight:400,color:'#ccc',marginBottom:24}}>{stages.length} 个阶段 · 每次只推进一个章节 · 适合零基础慢慢学</p>

        <div style={{border:'1px solid #2a1f10',background:'rgba(201,168,76,0.05)',borderRadius:12,padding:'16px 18px',marginBottom:28}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,marginBottom:10}}>
            <p style={{fontSize:13,fontWeight:900,color:'#fff'}}>我的学习进度</p>
            <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:900,color:'#e8c96a'}}>{doneSections}/{totalSections}</p>
          </div>
          <div style={{height:8,background:'#111',border:'1px solid #242424',borderRadius:999,overflow:'hidden'}}>
            <div style={{height:'100%',width:`${totalSections ? Math.round(doneSections / totalSections * 100) : 0}%`,background:'linear-gradient(90deg,#7a6230,#e8c96a)',transition:'width 0.3s'}} />
          </div>
          <p style={{fontSize:12,color:'#aaa',lineHeight:1.8,marginTop:10}}>进度保存在当前浏览器里。换电脑或清理浏览器数据后，需要重新标记。</p>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:48}}>
          {[
            {v:stages.length,l:'STAGES'},{v:stages.reduce((s,st)=>s+st.sections.length,0),l:'CHAPTERS'},{v:tools.length,l:'TOOLS'}
          ].map(x=>(
            <div key={x.l} style={{background:'rgba(255,255,255,0.03)',border:'1px solid #1a1a1a',borderRadius:16,padding:'36px 24px',textAlign:'center'}}>
              <p style={{fontSize:42,fontWeight:900,color:'#e8c96a',fontFamily:"'JetBrains Mono',monospace"}}>{x.v}</p>
              <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,color:'#ccc',marginTop:6,letterSpacing:'0.15em'}}>{x.l}</p>
            </div>
          ))}
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {stages.map((stage,i)=>{
            const st=tools.filter(t=>t.stage===stage.id)
            const completed = stage.sections.filter((_, index) => progress[progressId(stage.id, index)]).length
            const percent = stage.sections.length ? Math.round(completed / stage.sections.length * 100) : 0
            return (
              <Link key={stage.id} href={`/learn/${stage.id}`}
                style={{background:'rgba(255,255,255,0.03)',border:'1px solid #1a1a1a',borderRadius:12,padding:'22px',textDecoration:'none',transition:'all 0.3s',display:'grid',gridTemplateColumns:'230px minmax(0,1fr)',alignItems:'stretch',gap:20}}
                className="max-sm:grid-cols-1"
                onMouseEnter={e=>{e.currentTarget.style.background='rgba(201,168,76,0.06)';e.currentTarget.style.borderColor='#7a6230';e.currentTarget.style.transform='translateX(4px)'}}
                onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.03)';e.currentTarget.style.borderColor='#1a1a1a';e.currentTarget.style.transform='translateX(0)'}}>
                <ContentVisual compact title={stage.title} label={`STAGE ${String(stage.id).padStart(2,"0")}`} meta={stage.timeEstimate} kind={stage.id===4?"agent":stage.id>=2?"code":"learn"} />
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:'flex',alignItems:'baseline',gap:10,marginBottom:6}}>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:700,color:'#e8c96a'}}>{String(i).padStart(2,"0")}</span>
                    <h3 style={{fontSize:20,fontWeight:700,color:'#fff'}}>{stage.title}</h3>
                  </div>
                  <p style={{fontSize:14,fontWeight:400,color:'#ccc',marginBottom:10}}>{stage.subtitle}</p>
                  <div style={{display:'flex',gap:20,fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:600,color:'#aaa'}}>
                    <span>{stage.sections.length} chapters</span><span>{stage.timeEstimate}</span>{st.length>0&&<span>{st.length} tools</span>}<span style={{color:completed>0?'#e8c96a':'#666'}}>{completed}/{stage.sections.length} done</span>
                  </div>
                  <div style={{height:5,background:'#111',borderRadius:999,overflow:'hidden',marginTop:14}}>
                    <div style={{height:'100%',width:`${percent}%`,background:'linear-gradient(90deg,#7a6230,#e8c96a)'}} />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
