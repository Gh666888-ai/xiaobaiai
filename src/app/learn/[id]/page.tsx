"use client"

import { useParams, useRouter } from "next/navigation"
import { stages } from "@/data/learning-path"
import { tools } from "@/data/tools"
import { MathRain } from "@/components/MathRain"
import Link from "next/link"

function letter(n:string){return /^[a-zA-Z]/.test(n)?n[0].toUpperCase():n[0]}
function avColor(n:string){const c=["#c9a84c","#e8c96a","#7a6230","#5a8a5a"];let h=0;for(let i=0;i<n.length;i++)h=n.charCodeAt(i)+((h<<5)-h);return c[Math.abs(h)%c.length]}

export default function StageDetailPage() {
  const params = useParams()
  const router = useRouter()
  const stageId = Number(params.id)
  const stage = stages.find(s=>s.id===stageId)
  const stageTools = tools.filter(t=>t.stage===stageId).slice(0,3)

  if(!stage) return (
    <div style={{background:'#000',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',color:'#aaa'}}>
      <div style={{textAlign:'center'}}>
        <p style={{fontSize:48,marginBottom:16}}>404</p>
        <button onClick={()=>router.push('/learn')} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:'#c9a84c',border:'1px solid #7a6230',padding:'8px 20px',background:'transparent',cursor:'pointer'}}>← 返回学习路径</button>
      </div>
    </div>
  )

  return (
    <div style={{background:'#000',minHeight:'100vh',fontFamily:"'Noto Sans SC', sans-serif",position:'relative',overflow:'hidden'}}>
      <MathRain />
      <nav style={{position:'sticky',top:0,zIndex:50,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 60px',background:'rgba(0,0,0,0.9)',backdropFilter:'blur(12px)',borderBottom:'1px solid #1a1a1a'}} className="max-sm:px-6">
        <button onClick={()=>router.push('/learn')} style={{fontSize:13,fontWeight:700,letterSpacing:'0.2em',color:'#c9a84c',fontFamily:"'JetBrains Mono', monospace",background:'none',border:'none',cursor:'pointer'}}>← 学习路径</button>
        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'#aaa',letterSpacing:'0.15em'}}>STAGE {String(stageId).padStart(2,"0")}</span>
      </nav>

      <div style={{maxWidth:800,margin:'0 auto',padding:'60px 60px',position:'relative',zIndex:10,background:'rgba(0,0,0,0.85)'}} className="max-sm:px-6">
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

        {/* 章节 */}
        <div style={{display:'flex',flexDirection:'column',gap:2,background:'#1a1a1a',border:'1px solid #1a1a1a',marginBottom:48}}>
          {stage.sections.map((section,i)=>(
            <div key={i} style={{background:'rgba(255,255,255,0.02)',padding:'32px'}}>
              <div style={{display:'flex',alignItems:'flex-start',gap:14}}>
                <span style={{width:28,height:28,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:700,color:'#c9a84c',border:'1px solid #7a6230',flexShrink:0}}>{i+1}</span>
                <div>
                  <h3 style={{fontSize:18,fontWeight:700,color:'#fff',marginBottom:12}}>{section.title}</h3>
                  <p style={{fontSize:16,color:'#eee',lineHeight:1.9,whiteSpace:'pre-line'}}>{section.content}</p>
                  {section.tips && (
                    <div style={{marginTop:16,padding:'16px',background:'rgba(201,168,76,0.04)',border:'1px solid #2a1f10',borderRadius:4}}>
                      <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,color:'#e8c96a',letterSpacing:'0.1em',marginBottom:4}}>💡 TIP</p>
                      <p style={{fontSize:15,color:'#eee',lineHeight:1.7}}>{section.tips}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 推荐工具 */}
        {stageTools.length>0 && (
          <div style={{marginBottom:48}}>
            <h3 style={{fontSize:14,fontWeight:700,color:'#fff',marginBottom:16}}>本阶段推荐工具</h3>
            <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
              {stageTools.map(t=>(
                <a key={t.id} href={t.url} target="_blank" rel="noopener noreferrer"
                  style={{display:'flex',alignItems:'center',gap:8,padding:'10px 16px',background:'rgba(255,255,255,0.02)',border:'1px solid #1a1a1a',textDecoration:'none',transition:'all 0.3s'}}
                  onMouseEnter={e=>{e.currentTarget.style.background='rgba(201,168,76,0.04)';e.currentTarget.style.borderColor='#7a6230'}}
                  onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.02)';e.currentTarget.style.borderColor='#1a1a1a'}}>
                  <span style={{width:24,height:24,borderRadius:4,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:800,color:'#fff',background:avColor(t.name),fontFamily:"'JetBrains Mono',monospace"}}>{letter(t.name)}</span>
                  <span style={{fontSize:12,fontWeight:700,color:'#ccc'}}>{t.name}</span>
                </a>
              ))}
            </div>
          </div>
        )}

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
