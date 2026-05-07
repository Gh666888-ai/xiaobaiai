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

const immersionSystem = [
  {
    name: "今日 15 分钟",
    borrowedFrom: "Duolingo / Brilliant",
    desc: "每天只推一个小动作，降低开始成本，让用户觉得“现在就能做”。",
    xiaobai: "今天不要求学完一门课，只要求完成一个 AI 环节。",
  },
  {
    name: "掌握度回路",
    borrowedFrom: "Khan Academy",
    desc: "不只记录看过，还要记录能不能复用、能不能迁移。",
    xiaobai: "章节完成只是进度，阶段通关要交付一个可检查产物。",
  },
  {
    name: "路径 + 项目",
    borrowedFrom: "Codecademy / freeCodeCamp",
    desc: "学习路径告诉顺序，项目让学习变成作品。",
    xiaobai: "每个 L 级别都绑定一个 0-1 交付物，而不是空泛知识点。",
  },
  {
    name: "徽章 + 作品架",
    borrowedFrom: "Trailhead / DataCamp",
    desc: "奖励不是装饰，而是把用户做过的东西沉淀出来。",
    xiaobai: "阶段 XP、社区复盘和案例库一起形成个人成长痕迹。",
  },
]

const todayActions = [
  { title: "选一个目标", desc: "不是选工具，而是说清楚你想做成什么事。", href: "/start" },
  { title: "做一个环节", desc: "只交付表格、脚本、提示词、流程图或一个小 diff。", href: "/start" },
  { title: "发一条复盘", desc: "写下你做到了什么、卡在哪里、下一步是什么。", href: "/community/new" },
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
        <p style={{fontSize:14,fontWeight:400,color:'#ccc',marginBottom:24}}>{stages.length} 个阶段 · 每次只推进一个章节 · 阶段通关可领取 XP 奖励</p>

        <section style={{border:'1px solid #2a1f10',background:'rgba(201,168,76,0.045)',borderRadius:12,padding:'22px 24px',marginBottom:28}}>
          <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:16,flexWrap:'wrap',marginBottom:18}}>
            <div>
              <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:'0.2em',color:'#7a6230',fontWeight:900,marginBottom:6}}>FROM BASIC TO ADVANCED</p>
              <h2 style={{fontSize:24,fontWeight:950,color:'#fff',lineHeight:1.35}}>从低级到高级的完整学习主线</h2>
            </div>
            <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
              <Link href="/start" className="btn-primary" style={{textDecoration:'none'}}>我想先做成一件事</Link>
              <Link href="/tutorials" className="btn-outline" style={{textDecoration:'none'}}>查看全部教程</Link>
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(128px,1fr))',gap:10,marginBottom:18}}>
            {curriculumFlow.map((item, index)=>(
              <Link key={item.level} href={item.href} style={{position:'relative',display:'block',textDecoration:'none',border:'1px solid #242424',background:'rgba(0,0,0,0.28)',borderRadius:10,padding:'15px 14px',minHeight:190}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:8,marginBottom:10}}>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:950,color:'#e8c96a'}}>{item.level}</span>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'#555'}}>{String(index+1).padStart(2,'0')}</span>
                </div>
                <h3 style={{fontSize:15,fontWeight:950,color:'#fff',lineHeight:1.4,marginBottom:8}}>{item.title}</h3>
                <p style={{fontSize:12,color:'#bbb',lineHeight:1.65,marginBottom:10}}>{item.desc}</p>
                <p style={{fontSize:11,color:'#cdbb80',lineHeight:1.6,borderTop:'1px solid #1d1d1d',paddingTop:9}}>交付物：{item.output}</p>
                <p style={{fontSize:11,color:'#777',lineHeight:1.5,marginTop:7}}>通关奖励：阶段页领取 XP</p>
              </Link>
            ))}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:8}}>
            {learningLoop.map((item,index)=>(
              <div key={item.title} style={{border:'1px solid #1a1a1a',background:'rgba(255,255,255,0.025)',borderRadius:8,padding:'12px 13px'}}>
                <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:950,color:'#7a6230',marginBottom:5}}>LOOP {index+1}</p>
                <p style={{fontSize:13,fontWeight:950,color:'#fff',marginBottom:4}}>{item.title}</p>
                <p style={{fontSize:12,color:'#aaa',lineHeight:1.6}}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{border:'1px solid #1f1f1f',background:'rgba(255,255,255,0.025)',borderRadius:12,padding:'22px 24px',marginBottom:28}}>
          <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:16,flexWrap:'wrap',marginBottom:18}}>
            <div>
              <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:'0.2em',color:'#7a6230',fontWeight:900,marginBottom:6}}>XIAOBAI IMMERSION LOOP</p>
              <h2 style={{fontSize:24,fontWeight:950,color:'#fff',lineHeight:1.35}}>小白AI专属沉浸飞轮</h2>
              <p style={{fontSize:14,color:'#aaa',lineHeight:1.8,marginTop:8,maxWidth:760}}>借鉴成熟教学网站，但不照搬：我们的目标不是让用户刷课，而是让用户每天把 AI 用进一个真实目标，哪怕只完成其中一个环节。</p>
            </div>
            <Link href="/start" className="btn-primary" style={{textDecoration:'none'}}>今天开始一个环节</Link>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:14}}>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:10}}>
              {immersionSystem.map((item)=>(
                <div key={item.name} style={{border:'1px solid #1a1a1a',background:'rgba(0,0,0,0.22)',borderRadius:10,padding:'16px 17px'}}>
                  <p style={{fontSize:15,fontWeight:950,color:'#fff',marginBottom:6}}>{item.name}</p>
                  <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'#7a6230',fontWeight:900,marginBottom:8}}>参考：{item.borrowedFrom}</p>
                  <p style={{fontSize:12,color:'#aaa',lineHeight:1.7,marginBottom:9}}>{item.desc}</p>
                  <p style={{fontSize:12,color:'#cdbb80',lineHeight:1.7,borderTop:'1px solid #242424',paddingTop:9}}>小白AI做法：{item.xiaobai}</p>
                </div>
              ))}
            </div>
            <div style={{border:'1px solid #2a1f10',background:'rgba(201,168,76,0.045)',borderRadius:10,padding:'18px 19px'}}>
              <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:950,color:'#7a6230',letterSpacing:'0.14em',marginBottom:8}}>TODAY QUEST</p>
              <h3 style={{fontSize:19,fontWeight:950,color:'#fff',lineHeight:1.35,marginBottom:12}}>今天只做三件小事</h3>
              <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:16}}>
                {todayActions.map((item,index)=>(
                  <Link key={item.title} href={item.href} style={{display:'grid',gridTemplateColumns:'28px 1fr',gap:10,textDecoration:'none',border:'1px solid #242424',background:'rgba(0,0,0,0.24)',borderRadius:8,padding:'11px 12px'}}>
                    <span style={{width:28,height:28,borderRadius:'50%',display:'inline-flex',alignItems:'center',justifyContent:'center',background:'rgba(201,168,76,0.12)',color:'#e8c96a',fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:950}}>{index+1}</span>
                    <span>
                      <span style={{display:'block',fontSize:13,fontWeight:950,color:'#fff',marginBottom:3}}>{item.title}</span>
                      <span style={{display:'block',fontSize:12,color:'#aaa',lineHeight:1.6}}>{item.desc}</span>
                    </span>
                  </Link>
                ))}
              </div>
              <p style={{fontSize:12,color:'#bbb',lineHeight:1.8}}>做完以后，回到阶段页标记章节、领取阶段 XP。真正的沉浸感来自“今天我推进了我的事”，而不是“今天我又看了很多内容”。</p>
            </div>
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

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:10,marginBottom:48}}>
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
                style={{background:'rgba(255,255,255,0.03)',border:'1px solid #1a1a1a',borderRadius:12,padding:'22px',textDecoration:'none',transition:'all 0.3s',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))',alignItems:'stretch',gap:20}}
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
