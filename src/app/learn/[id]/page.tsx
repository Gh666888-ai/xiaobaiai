"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { stages } from "@/data/learning-path"
import { tools } from "@/data/tools"
import { toolPath } from "@/data/tool-meta"
import { MathRain } from "@/components/MathRain"
import { ContentVisual } from "@/components/ContentVisual"
import { SeoKeywordLinks } from "@/components/SeoKeywordLinks"
import { SeoRelatedLinks } from "@/components/SeoRelatedLinks"
import Link from "next/link"
import { CheckCircle2, ChevronLeft, ChevronRight, Circle } from "lucide-react"
import { LearningProgress, progressId, readLearningProgress, writeLearningProgress } from "@/lib/learning-progress"

function letter(n:string){return /^[a-zA-Z]/.test(n)?n[0].toUpperCase():n[0]}
function avColor(n:string){const c=["#c9a84c","#e8c96a","#7a6230","#5a8a5a"];let h=0;for(let i=0;i<n.length;i++)h=n.charCodeAt(i)+((h<<5)-h);return c[Math.abs(h)%c.length]}

export default function StageDetailPage() {
  const params = useParams()
  const router = useRouter()
  const stageId = Number(params.id)
  const stage = stages.find(s=>s.id===stageId)
  const stageTools = tools.filter(t=>t.stage===stageId).slice(0,3)
  const [progress, setProgress] = useState<LearningProgress>({})
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    setProgress(readLearningProgress())
    setActiveIndex(0)
  }, [stageId])

  const toggleSection = (sectionIndex: number) => {
    const id = progressId(stageId, sectionIndex)
    const next = { ...progress, [id]: !progress[id] }
    if (!next[id]) delete next[id]
    setProgress(next)
    writeLearningProgress(next)
  }

  if(!stage) return (
    <div style={{background:'#000',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',color:'#aaa'}}>
      <div style={{textAlign:'center'}}>
        <p style={{fontSize:48,marginBottom:16}}>404</p>
        <button onClick={()=>router.push('/learn')} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:'#c9a84c',border:'1px solid #7a6230',padding:'8px 20px',background:'transparent',cursor:'pointer'}}>← 返回学习路径</button>
      </div>
    </div>
  )

  const completedCount = stage.sections.filter((_, index) => progress[progressId(stageId, index)]).length
  const progressPercent = stage.sections.length ? Math.round(completedCount / stage.sections.length * 100) : 0
  const activeSection = stage.sections[Math.min(activeIndex, stage.sections.length - 1)]
  const activeDone = !!progress[progressId(stageId, activeIndex)]

  return (
    <div style={{background:'#000',minHeight:'100vh',fontFamily:"'Noto Sans SC', sans-serif",position:'relative',overflow:'hidden'}}>
      <MathRain />
      <nav style={{position:'sticky',top:0,zIndex:50,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 60px',background:'rgba(0,0,0,0.9)',backdropFilter:'blur(12px)',borderBottom:'1px solid #1a1a1a'}} className="max-sm:px-6">
        <button onClick={()=>router.push('/learn')} style={{fontSize:13,fontWeight:700,letterSpacing:'0.2em',color:'#c9a84c',fontFamily:"'JetBrains Mono', monospace",background:'none',border:'none',cursor:'pointer'}}>← 学习路径</button>
        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'#aaa',letterSpacing:'0.15em'}}>STAGE {String(stageId).padStart(2,"0")}</span>
      </nav>

      <div style={{maxWidth:980,margin:'0 auto',padding:'60px 60px',position:'relative',zIndex:10,background:'rgba(0,0,0,0.88)'}} className="max-sm:px-6">
        {/* 头部 */}
        <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:40}}>
          <div style={{width:56,height:56,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,background:'rgba(201,168,76,0.12)',flexShrink:0}}>{stage.icon}</div>
          <div>
            <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'0.2em',color:'#7a6230',marginBottom:4}}>STAGE {String(stageId).padStart(2,"0")}</p>
            <h1 style={{fontSize:28,fontWeight:900,color:'#fff'}}>{stage.title}</h1>
            <p style={{fontSize:14,color:'#c9a84c',marginTop:4}}>{stage.subtitle}</p>
          </div>
        </div>

        <div style={{display:'flex',gap:32,marginBottom:48,fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'#aaa',letterSpacing:'0.1em',flexWrap:'wrap'}}>
          <span>{stage.whoIsThisFor}</span>
          <span>{stage.timeEstimate}</span>
        </div>

        <div style={{border:'1px solid #2a1f10',background:'rgba(201,168,76,0.05)',borderRadius:12,padding:'16px 18px',marginBottom:28}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,marginBottom:10}}>
            <p style={{fontSize:13,fontWeight:900,color:'#fff'}}>本阶段进度</p>
            <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:900,color:'#e8c96a'}}>{completedCount}/{stage.sections.length} · {progressPercent}%</p>
          </div>
          <div style={{height:8,background:'#111',border:'1px solid #242424',borderRadius:999,overflow:'hidden'}}>
            <div style={{height:'100%',width:`${progressPercent}%`,background:'linear-gradient(90deg,#7a6230,#e8c96a)',transition:'width 0.3s'}} />
          </div>
        </div>

        {/* 章节播放器 */}
        <div style={{display:'grid',gridTemplateColumns:'240px minmax(0,1fr)',gap:16,marginBottom:48}} className="max-sm:grid-cols-1">
          <div style={{border:'1px solid #1a1a1a',background:'rgba(255,255,255,0.02)',borderRadius:8,padding:12,alignSelf:'start'}}>
            <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:900,color:'#777',letterSpacing:'0.14em',marginBottom:10}}>CHAPTERS</p>
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              {stage.sections.map((section,i)=>{
                const done = !!progress[progressId(stageId, i)]
                const isActive = i === activeIndex
                return (
                  <button key={section.title} onClick={()=>setActiveIndex(i)}
                    style={{display:'flex',alignItems:'center',gap:8,width:'100%',textAlign:'left',border:`1px solid ${isActive?'#7a6230':'#202020'}`,background:isActive?'rgba(201,168,76,0.08)':'rgba(255,255,255,0.02)',borderRadius:6,padding:'9px 10px',cursor:'pointer',color:isActive?'#fff':'#aaa',fontFamily:"'Noto Sans SC', sans-serif"}}>
                    <span style={{width:22,height:22,borderRadius:'50%',display:'inline-flex',alignItems:'center',justifyContent:'center',fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:900,color:done?'#111':'#c9a84c',border:'1px solid #7a6230',background:done?'#e8c96a':'transparent',flexShrink:0}}>{done ? "✓" : i+1}</span>
                    <span style={{fontSize:12,fontWeight:800,lineHeight:1.35,overflow:'hidden',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical'}}>{section.title}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div style={{border:'1px solid #1a1a1a',background:activeDone?'rgba(201,168,76,0.035)':'rgba(255,255,255,0.02)',borderRadius:8,overflow:'hidden'}}>
            <ContentVisual title={activeSection.title} label={`CHAPTER ${activeIndex+1}`} meta={`${activeIndex+1}/${stage.sections.length} · ${stage.timeEstimate}`} kind={stage.id===4?"agent":stage.id>=2?"code":"learn"} />
            <div style={{padding:'28px 30px'}} className="max-sm:px-4">
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,marginBottom:16,flexWrap:'wrap'}}>
                <div>
                  <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:900,color:'#7a6230',letterSpacing:'0.14em',marginBottom:6}}>CHAPTER {activeIndex+1}</p>
                  <h3 style={{fontSize:22,fontWeight:900,color:'#fff',lineHeight:1.35}}>{activeSection.title}</h3>
                </div>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:900,color:activeDone?'#e8c96a':'#777'}}>{activeDone ? "DONE" : "LEARNING"}</span>
              </div>
              <p style={{fontSize:16,color:'#eee',lineHeight:1.95,whiteSpace:'pre-line'}}><SeoKeywordLinks text={activeSection.content} maxLinks={10} /></p>
              {activeSection.tips && (
                <div style={{marginTop:18,padding:'16px',background:'rgba(201,168,76,0.04)',border:'1px solid #2a1f10',borderRadius:6}}>
                  <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:'#e8c96a',letterSpacing:'0.1em',marginBottom:6}}>TIP</p>
                  <p style={{fontSize:15,color:'#eee',lineHeight:1.75}}><SeoKeywordLinks text={activeSection.tips} maxLinks={4} /></p>
                </div>
              )}
              <SeoRelatedLinks text={`${stage.title}\n${activeSection.title}\n${activeSection.content}\n${activeSection.tips || ""}`} title="相关教程" limit={5} />
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:10,marginTop:24,flexWrap:'wrap'}}>
                <button onClick={()=>setActiveIndex(Math.max(0, activeIndex-1))} disabled={activeIndex===0}
                  style={{display:'inline-flex',alignItems:'center',gap:6,border:'1px solid #333',background:'rgba(255,255,255,0.03)',color:activeIndex===0?'#444':'#bbb',borderRadius:8,padding:'10px 12px',fontSize:12,fontWeight:900,cursor:activeIndex===0?'not-allowed':'pointer'}}>
                  <ChevronLeft size={15}/> 上一章
                </button>
                <button onClick={()=>toggleSection(activeIndex)} style={{display:'inline-flex',alignItems:'center',gap:7,whiteSpace:'nowrap',border:`1px solid ${activeDone?'#7a6230':'#333'}`,background:activeDone?'rgba(201,168,76,0.12)':'rgba(255,255,255,0.03)',color:activeDone?'#e8c96a':'#aaa',borderRadius:8,padding:'10px 12px',fontSize:12,fontWeight:900,cursor:'pointer'}}>
                  {activeDone ? <CheckCircle2 size={15}/> : <Circle size={15}/>}
                  {activeDone ? "已学完" : "读完了，标记已学完"}
                </button>
                <button onClick={()=>setActiveIndex(Math.min(stage.sections.length-1, activeIndex+1))} disabled={activeIndex===stage.sections.length-1}
                  style={{display:'inline-flex',alignItems:'center',gap:6,border:'1px solid #333',background:'rgba(255,255,255,0.03)',color:activeIndex===stage.sections.length-1?'#444':'#bbb',borderRadius:8,padding:'10px 12px',fontSize:12,fontWeight:900,cursor:activeIndex===stage.sections.length-1?'not-allowed':'pointer'}}>
                  下一章 <ChevronRight size={15}/>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 推荐工具 */}
        {stageTools.length>0 && (
          <div style={{marginBottom:48}}>
            <h3 style={{fontSize:14,fontWeight:700,color:'#fff',marginBottom:16}}>本阶段推荐工具</h3>
            <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
              {stageTools.map(t=>(
                <Link key={t.id} href={toolPath(t)}
                  style={{display:'flex',alignItems:'center',gap:8,padding:'10px 16px',background:'rgba(255,255,255,0.02)',border:'1px solid #1a1a1a',textDecoration:'none',transition:'all 0.3s'}}
                  onMouseEnter={e=>{e.currentTarget.style.background='rgba(201,168,76,0.04)';e.currentTarget.style.borderColor='#7a6230'}}
                  onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.02)';e.currentTarget.style.borderColor='#1a1a1a'}}>
                  <span style={{width:24,height:24,borderRadius:4,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:800,color:'#fff',background:avColor(t.name),fontFamily:"'JetBrains Mono',monospace"}}>{letter(t.name)}</span>
                  <span style={{fontSize:12,fontWeight:700,color:'#ccc'}}>{t.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div style={{marginBottom:48,background:'rgba(201,168,76,0.04)',border:'1px solid #2a1f10',borderRadius:10,padding:'24px 28px'}}>
          <h3 style={{fontSize:16,fontWeight:900,color:'#fff',marginBottom:14}}>学完这一阶段，你应该能做到</h3>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {[
              `用自己的话解释「${stage.title}」解决什么问题。`,
              "独立完成本页至少 1 个工具或流程的第一次使用。",
              "把一次 AI 输出结果人工检查并改成可交付版本。",
            ].map((item,i)=>(
              <p key={item} style={{fontSize:14,color:'#ddd',lineHeight:1.8}}>
                <span style={{fontFamily:"'JetBrains Mono',monospace",color:'#e8c96a',fontWeight:900,marginRight:8}}>CHECK {i+1}</span>{item}
              </p>
            ))}
          </div>
          <div style={{display:'flex',gap:10,flexWrap:'wrap',marginTop:20}}>
            <Link href="/search?q=生成我的学习路线" className="btn-primary" style={{textDecoration:'none'}}>生成我的学习路线</Link>
            <Link href="/search?q=帮我选一个 AI 工具" className="btn-outline" style={{textDecoration:'none'}}>帮我选工具</Link>
          </div>
        </div>

        {/* 阶段5（工作流自动化）→ 连接教程资源 */}
        {stageId===4 && (
          <Link href="/news?category=教程资源"
            style={{width:'100%',padding:'24px',background:'rgba(201,168,76,0.04)',border:'1px solid #7a6230',cursor:'pointer',textAlign:'left',transition:'all 0.3s',display:'block',textDecoration:'none'}}
            onMouseEnter={e=>{e.currentTarget.style.background='rgba(201,168,76,0.08)';e.currentTarget.style.borderColor='#c9a84c'}}
            onMouseLeave={e=>{e.currentTarget.style.background='rgba(201,168,76,0.04)';e.currentTarget.style.borderColor='#7a6230'}}>
            <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'#aaa',letterSpacing:'0.15em',marginBottom:4}}>NEXT STEP</p>
            <p style={{fontSize:16,fontWeight:700,color:'#c9a84c'}}>📖 教程资源 → 手把手实战指南</p>
            <p style={{fontSize:13,color:'#ccc',marginTop:8}}>从零代码搭建AI客服、Prompt万能模板、Claude Code上手……大量教程等你探索</p>
          </Link>
        )}
        {/* 下一步 */}
        {stageId < 4 && (
          <button onClick={()=>router.push(`/learn/${stageId+1}`)}
            style={{width:'100%',padding:'24px',background:'rgba(255,255,255,0.02)',border:'1px solid #1a1a1a',cursor:'pointer',textAlign:'left',transition:'all 0.3s',display:'block'}}
            onMouseEnter={e=>{e.currentTarget.style.background='rgba(201,168,76,0.04)';e.currentTarget.style.borderColor='#7a6230'}}
            onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.02)';e.currentTarget.style.borderColor='#1a1a1a'}}>
            <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'#aaa',letterSpacing:'0.15em',marginBottom:4}}>NEXT STAGE</p>
            <p style={{fontSize:16,fontWeight:700,color:'#c9a84c'}}>阶段 {stageId+1}：{stages.find(s=>s.id===stageId+1)?.title} →</p>
          </button>
        )}
        {stageId===7 && (
          <div style={{padding:'32px',background:'rgba(201,168,76,0.04)',border:'1px solid #7a6230',textAlign:'center'}}>
            <p style={{fontSize:18,fontWeight:700,color:'#c9a84c',marginBottom:8}}>🎉 恭喜走完学习路径！</p>
            <p style={{fontSize:13,color:'#ccc',marginBottom:20}}>你已经掌握了从 AI 小白到 Agent 实战的全部技能</p>
            <div style={{display:'flex',gap:12,justifyContent:'center'}}>
              <Link href="/tools" className="btn-outline">探索更多工具</Link>
              <Link href="/contribute" className="btn-primary">贡献内容</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
