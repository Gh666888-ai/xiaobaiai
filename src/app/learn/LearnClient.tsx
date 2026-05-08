"use client"

import { useEffect, useState } from "react"
import { stages } from "@/data/learning-path"
import { tools } from "@/data/tools"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"
import { ContentVisual } from "@/components/ContentVisual"
import Link from "next/link"
import { progressId, readLearningProgress, LearningProgress } from "@/lib/learning-progress"
import { readMissionProgress } from "@/lib/mission-progress"

const curriculumFlow = [
  {
    level: "新手村 1",
    title: "打开 AI，问出第一句话",
    difficulty: "简单",
    desc: "只要求打开一个 AI 工具，问一个真实问题。先消除害怕，不讲复杂术语。",
    output: "留下一个真实问题和 AI 的第一版回答。",
    proof: "勾选打开工具，粘贴一句 AI 回答。",
    href: "/learn/0",
  },
  {
    level: "新手村 2",
    title: "复制提示词，得到第一个小结果",
    difficulty: "简单",
    desc: "照着模板复制，不要求会写提示词，只要求知道资料要放在哪里。",
    output: "得到一段可复制的文案、摘要或需求单。",
    proof: "粘贴 10 字以上结果。",
    href: "/learn/1",
  },
  {
    level: "入门 1",
    title: "做出第一份 AI PPT",
    difficulty: "简单",
    desc: "从下载/打开工具、整理资料、生成初稿到导出复盘，完整跑通一件办公任务。",
    output: "一份 6 页 PPT 初稿和一条复盘。",
    proof: "任务页保存每一步证明后领取 XP。",
    href: "/missions/ai-ppt-first-deck",
  },
  {
    level: "入门 2",
    title: "分析一份长资料",
    difficulty: "一般",
    desc: "学会上传资料、限定目标、抽取事实、生成行动清单，开始有真实工作价值。",
    output: "结构化摘要、风险点和行动清单。",
    proof: "保存问题、摘要表和行动清单。",
    href: "/missions/kimi-k26-long-doc",
  },
  {
    level: "进阶 1",
    title: "做一条内容流水线",
    difficulty: "一般",
    desc: "把选题、正文、配图、发布前检查串起来，避免 AI 只会写空话。",
    output: "一条可发布内容和配图提示词。",
    proof: "保存选题、正文草稿、配图 Prompt 和检查结果。",
    href: "/missions/xiaohongshu-ai-content-loop",
  },
  {
    level: "进阶 2",
    title: "搭一个知识库 Bot",
    difficulty: "进阶",
    desc: "开始理解知识库、测试问题、边界提示词，让 AI 按资料回答而不是乱编。",
    output: "一个 Dify/Coze/FastGPT 知识库 Bot。",
    proof: "保存 10 条问答资料、5 条测试记录和上线边界。",
    href: "/missions/dify-knowledge-base-bot",
  },
  {
    level: "高手 1",
    title: "跑通自动化流程",
    difficulty: "困难",
    desc: "把触发、抓取、AI 摘要、人工审核、发送串成流程，进入半自动生产。",
    output: "一个 n8n/Agent 自动化流程和测试记录。",
    proof: "保存流程节点、试运行结果和失败处理。",
    href: "/missions/n8n-ai-news-automation",
  },
  {
    level: "高手 2",
    title: "让 AI 改真实项目",
    difficulty: "困难",
    desc: "限定文件范围、让工程 Agent 修改小功能，并用类型检查或构建验证。",
    output: "一个真实项目小 diff 和验证结果。",
    proof: "保存改动说明、测试命令和结果。",
    href: "/missions/codex-small-feature",
  },
  {
    level: "共创段",
    title: "沉淀案例，反哺小白AI",
    difficulty: "高阶",
    desc: "把你的任务流程、踩坑和复盘发到社区，形成别人也能照着做的案例资产。",
    output: "一篇可审核、可展示、可复用的真实复盘。",
    proof: "社区帖子、任务证明和后续审核状态。",
    href: "/community/new",
  },
]

const todayActions = [
  { title: "选一个目标", desc: "不是选工具，而是说清楚你想做成什么事。", href: "/start" },
  { title: "做一个环节", desc: "只交付表格、脚本、提示词、流程图或一个小 diff。", href: "/missions" },
  { title: "发一条复盘", desc: "写下你做到了什么、卡在哪里、下一步是什么。", href: "/community/new" },
]

export default function LearnPage() {
  const [progress, setProgress] = useState<LearningProgress>({})
  const [missionDoneCount, setMissionDoneCount] = useState(0)

  useEffect(() => {
    setProgress(readLearningProgress())
    setMissionDoneCount(Object.values(readMissionProgress().missions).filter((mission) => mission.completed).length)
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
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))',gap:10,marginBottom:18}}>
            {curriculumFlow.map((item, index)=>(
              <Link key={item.level} href={item.href} style={{position:'relative',display:'block',textDecoration:'none',border:'1px solid #242424',background:'rgba(0,0,0,0.28)',borderRadius:10,padding:'15px 14px',minHeight:240}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:8,marginBottom:10}}>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:950,color:'#e8c96a'}}>{item.level}</span>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:item.difficulty==="简单"?"#3DA563":item.difficulty==="一般"?"#e8c96a":"#d08a42",fontWeight:950}}>{item.difficulty}</span>
                </div>
                <h3 style={{fontSize:15,fontWeight:950,color:'#fff',lineHeight:1.4,marginBottom:8}}>{item.title}</h3>
                <p style={{fontSize:12,color:'#bbb',lineHeight:1.65,marginBottom:10}}>{item.desc}</p>
                <p style={{fontSize:11,color:'#cdbb80',lineHeight:1.6,borderTop:'1px solid #1d1d1d',paddingTop:9}}>交付物：{item.output}</p>
                <p style={{fontSize:11,color:'#8fd6a0',lineHeight:1.6,marginTop:7}}>判定：{item.proof}</p>
                <p style={{position:'absolute',right:14,bottom:12,fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'#555'}}>{String(index+1).padStart(2,'0')}</p>
              </Link>
            ))}
          </div>
          <p style={{fontSize:13,color:'#cdbb80',lineHeight:1.8,borderTop:'1px solid #242424',paddingTop:14}}>学习顺序很简单：先看懂概念，照着做一次，再换成自己的场景，最后把结果发成复盘。</p>
        </section>

        <section style={{border:'1px solid #2a1f10',background:'rgba(201,168,76,0.045)',borderRadius:12,padding:'20px 22px',marginBottom:28}}>
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
        </section>

        <div style={{border:'1px solid #2a1f10',background:'rgba(201,168,76,0.05)',borderRadius:12,padding:'16px 18px',marginBottom:28}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,marginBottom:10}}>
            <p style={{fontSize:13,fontWeight:900,color:'#fff'}}>我的学习进度</p>
            <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:900,color:'#e8c96a'}}>{doneSections}/{totalSections}</p>
          </div>
          <div style={{height:8,background:'#111',border:'1px solid #242424',borderRadius:999,overflow:'hidden'}}>
            <div style={{height:'100%',width:`${totalSections ? Math.round(doneSections / totalSections * 100) : 0}%`,background:'linear-gradient(90deg,#7a6230,#e8c96a)',transition:'width 0.3s'}} />
          </div>
          <p style={{fontSize:12,color:'#aaa',lineHeight:1.8,marginTop:10}}>
            章节阅读先保存在当前浏览器；任务通关证明会在领取 XP 时写入服务器。后续作品墙、等级名牌、共创身份都应该以服务端任务证明为准。
          </p>
          <p style={{fontSize:12,color:'#cdbb80',lineHeight:1.8,marginTop:4}}>已通关真实任务：{missionDoneCount} 个。真正的等级增长，优先来自可检查的任务交付。</p>
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
