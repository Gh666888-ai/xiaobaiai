"use client"

import { useEffect, useState } from "react"
import { stages } from "@/data/learning-path"
import { tools } from "@/data/tools"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"
import { ContentVisual } from "@/components/ContentVisual"
import Link from "next/link"
import { progressId, readLearningProgress, LearningProgress } from "@/lib/learning-progress"

const curriculumFlow = [
  {
    level: "L0",
    title: "认识 AI",
    desc: "先知道 AI 能做什么、不能做什么，理解幻觉、验证和提示词边界。",
    output: "能用自己的话解释 AI / Agent / 模型 / 工具的区别。",
    href: "/learn/0",
  },
  {
    level: "L1",
    title: "会用工具",
    desc: "从 Kimi、DeepSeek、Gamma、即梦这类现成工具开始，完成真实小任务。",
    output: "能让 AI 写一段文案、总结一份文档、做一页 PPT 或生成一张图。",
    href: "/learn/1",
  },
  {
    level: "L2",
    title: "完成任务",
    desc: "不再只聊天，而是按办公、创作、数据、学习等场景形成固定流程。",
    output: "能把一个任务拆成输入、处理、检查、交付四步。",
    href: "/cases",
  },
  {
    level: "L3",
    title: "搭建 Agent",
    desc: "学习 Dify、Coze、QClaw、OpenClaw 这类 Agent，让 AI 能按流程办事。",
    output: "能搭一个知识库问答、客服 Bot 或定时提醒流程。",
    href: "/learn/2",
  },
  {
    level: "L4",
    title: "连接模型和 API",
    desc: "理解 API Key、模型名、base_url、费用和安全，能把 DeepSeek 接到工具里。",
    output: "能排查 401、余额、模型名、接口兼容这类常见问题。",
    href: "/deepseek-api-key",
  },
  {
    level: "L5",
    title: "AI 编程与自动化",
    desc: "进入 Claude Code、Codex、Cursor、工作流自动化，把 AI 用进真实项目。",
    output: "能限定文件范围，让 AI 改一个小功能，并用 build/test 验证。",
    href: "/claude-code-deepseek",
  },
  {
    level: "L6",
    title: "行业实战与复盘",
    desc: "把前面的能力放进业务：内容、客服、数据、工具站、自动化和社区反馈。",
    output: "能沉淀一篇案例，知道下次怎么复用和优化。",
    href: "/community/new",
  },
]

const learningLoop = [
  { title: "学概念", desc: "先知道这个东西解决什么问题。" },
  { title: "照着做", desc: "用教程跑通一次，不追求完美。" },
  { title: "换场景", desc: "把同一方法迁移到自己的任务。" },
  { title: "看案例", desc: "从别人踩坑里补边界和经验。" },
  { title: "发复盘", desc: "把自己的流程沉淀成社区内容。" },
]

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

        <section style={{border:'1px solid #2a1f10',background:'rgba(201,168,76,0.045)',borderRadius:12,padding:'22px 24px',marginBottom:28}}>
          <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:16,flexWrap:'wrap',marginBottom:18}}>
            <div>
              <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:'0.2em',color:'#7a6230',fontWeight:900,marginBottom:6}}>FROM BASIC TO ADVANCED</p>
              <h2 style={{fontSize:24,fontWeight:950,color:'#fff',lineHeight:1.35}}>从低级到高级的完整学习主线</h2>
            </div>
            <Link href="/tutorials" className="btn-outline" style={{textDecoration:'none'}}>查看全部教程</Link>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(7,minmax(0,1fr))',gap:10,marginBottom:18}} className="max-sm:grid-cols-1">
            {curriculumFlow.map((item, index)=>(
              <Link key={item.level} href={item.href} style={{position:'relative',display:'block',textDecoration:'none',border:'1px solid #242424',background:'rgba(0,0,0,0.28)',borderRadius:10,padding:'15px 14px',minHeight:190}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:8,marginBottom:10}}>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:950,color:'#e8c96a'}}>{item.level}</span>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'#555'}}>{String(index+1).padStart(2,'0')}</span>
                </div>
                <h3 style={{fontSize:15,fontWeight:950,color:'#fff',lineHeight:1.4,marginBottom:8}}>{item.title}</h3>
                <p style={{fontSize:12,color:'#bbb',lineHeight:1.65,marginBottom:10}}>{item.desc}</p>
                <p style={{fontSize:11,color:'#cdbb80',lineHeight:1.6,borderTop:'1px solid #1d1d1d',paddingTop:9}}>交付物：{item.output}</p>
              </Link>
            ))}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(5,minmax(0,1fr))',gap:8}} className="max-sm:grid-cols-1">
            {learningLoop.map((item,index)=>(
              <div key={item.title} style={{border:'1px solid #1a1a1a',background:'rgba(255,255,255,0.025)',borderRadius:8,padding:'12px 13px'}}>
                <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:950,color:'#7a6230',marginBottom:5}}>LOOP {index+1}</p>
                <p style={{fontSize:13,fontWeight:950,color:'#fff',marginBottom:4}}>{item.title}</p>
                <p style={{fontSize:12,color:'#aaa',lineHeight:1.6}}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

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
