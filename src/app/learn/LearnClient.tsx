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

const beginnerChoices = [
  {
    label: "我完全不知道从哪开始",
    title: "先做一份 6 页 PPT 初稿",
    desc: "不用先选工具，跟着复制一句提示词，先做出一个能看的文件。",
    href: "/start?goal=做PPT",
    cta: "从这里开始",
    highlight: true,
  },
  {
    label: "我手里有资料",
    title: "让 AI 读资料并列行动清单",
    desc: "上传或粘贴一份文档，得到摘要、风险点和下一步。",
    href: "/start?goal=办公",
    cta: "处理资料",
  },
  {
    label: "我想做内容",
    title: "做一条小红书内容草稿",
    desc: "从选题、正文、配图提示词到发布前检查，一次跑通。",
    href: "/start?goal=写文章",
    cta: "做内容",
  },
  {
    label: "我想做动漫/故事",
    title: "先做 60 秒漫剧或一章样章",
    desc: "不追求一键大片，先把分镜、角色、台词或样章审稿跑通。",
    href: "/start?goal=动漫漫剧",
    cta: "做创作",
  },
]

const firstRunSteps = [
  { title: "不用选课", desc: "默认从第一个可交付任务开始。" },
  { title: "只做一步", desc: "复制提示词，打开工具，留下一个结果。" },
  { title: "能判断完成", desc: "页面会要求你勾选或粘贴证明，不是自己猜。" },
  { title: "再给下一步", desc: "做完以后才出现更深的任务路线。" },
]

const nextAfterFirstTask = [
  { title: "第 1 个结果", desc: "先完成一个 PPT、资料摘要或内容草稿。", href: "/start", cta: "继续做第一步" },
  { title: "第 2 个结果", desc: "换一种场景再做一次，确认不是只会复制模板。", href: "/missions", cta: "看任务库" },
  { title: "教程变任务", desc: "动漫、网文、本地模型、行业 Skill 都有可交付任务，不想做可以换。", href: "/start?goal=动漫漫剧", cta: "换个方向" },
  { title: "给 AI 加能力", desc: "找到一个 Skill，先做安全检查，再用小样例验证。", href: "/missions/agent-skill-first-install", cta: "找第一个 Skill" },
  { title: "第 3 个结果", desc: "把提示词、失败点和修改方法发成复盘。", href: "/community/new", cta: "写复盘" },
]

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
    level: "进阶 1B",
    title: "把教程变成创作样片",
    difficulty: "一般",
    desc: "从 AI 漫剧和网文教程里抽出真实交付物：分镜、角色提示词、配音清单或样章审稿。",
    output: "一集 60 秒漫剧样片方案，或一章故事样章。",
    proof: "保存剧情、分镜/大纲、初稿、审稿和复盘。",
    href: "/start?goal=动漫漫剧",
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
    level: "进阶 3",
    title: "给行业场景配 Skill 或本地模型",
    difficulty: "进阶",
    desc: "把行业技能清单和本地部署教程变成自己的验证任务，知道该装什么、怎么测、哪些数据不能给。",
    output: "3 个行业 Skill 配置方案，或一次本地模型首跑记录。",
    proof: "保存权限边界、验证任务、模型首跑结果和适用场景。",
    href: "/missions/industry-skill-stack-plan",
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

const deepTrack = [
  {
    phase: "第一天",
    title: "只跑通一个最小交付",
    goal: "打开工具，完成一个步骤，留下证明。",
    unlock: "完成任意任务第 1 步",
    href: "/start",
  },
  {
    phase: "第 2-3 天",
    title: "把第一个任务完整做完",
    goal: "从资料、生成、检查、导出到复盘，不只停在打开工具。",
    unlock: "完成 AI PPT / 长文档 / 内容流水线任一任务",
    href: "/missions",
  },
  {
    phase: "第 1 周",
    title: "做三个不同类型产物",
    goal: "办公产物、内容产物、知识库或自动化产物至少各碰一次。",
    unlock: "任务证明里出现 3 个可检查成果",
    href: "/missions",
  },
  {
    phase: "第 2 周",
    title: "从使用者变成流程搭建者",
    goal: "搭一个知识库 Bot 或半自动日报，开始理解边界、测试和人工确认。",
    unlock: "完成 Dify 或 n8n 任务",
    href: "/missions/dify-knowledge-base-bot",
  },
  {
    phase: "第 3 周+",
    title: "让 Agent 进入真实项目",
    goal: "限定范围、看 diff、跑验证，把 AI 放进真实生产流程。",
    unlock: "完成 Codex / Claude Code 工程任务",
    href: "/missions/codex-small-feature",
  },
]

const masteryChecks = [
  { name: "会问", desc: "能把目标、材料、限制和输出格式说清楚。" },
  { name: "会查", desc: "能区分 AI 的事实、推断和编造内容。" },
  { name: "会交付", desc: "能导出文件、表格、脚本、流程图或可发布草稿。" },
  { name: "会复用", desc: "能保存提示词、模板和失败修复方法。" },
  { name: "会升级", desc: "能把一次任务迁移到另一个场景或更长流程。" },
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
  const nextMainAction = missionDoneCount > 0 ? "/missions" : "/start?goal=做PPT"
  const nextMainText = missionDoneCount > 0 ? "继续下一个实战任务" : "我不知道，从第一个任务开始"

  return (
    <div style={{background:'#000',minHeight:'100vh',fontFamily:"'Noto Sans SC', sans-serif",position:'relative',overflow:'hidden'}}>
      <MathRain />
      <NavBar />

      <div style={{maxWidth:1080,margin:'0 auto',padding:'54px 60px',position:'relative',zIndex:10,background:'rgba(0,0,0,0.88)'}} className="max-sm:px-4">
        <section style={{border:'1px solid #2a1f10',background:'linear-gradient(180deg,rgba(201,168,76,0.085),rgba(255,255,255,0.025))',borderRadius:12,padding:'28px 30px',marginBottom:18}}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:'0.28em',color:'#7a6230',textTransform:'uppercase',marginBottom:10,fontWeight:900}}>Start Here</p>
          <h1 style={{fontSize:38,fontWeight:950,color:'#fff',letterSpacing:'0.02em',lineHeight:1.22,marginBottom:10}}>不知道从哪开始，就先做出一个小结果</h1>
          <p style={{fontSize:15,fontWeight:400,color:'#ccc',lineHeight:1.9,maxWidth:760,marginBottom:20}}>这里不是让你先看懂一整套课程。第一次来，只需要选一个真实目标，照着做一步，页面会告诉你怎么判断完成。</p>
          <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
            <Link href={nextMainAction} className="btn-primary" style={{textDecoration:'none'}}>{nextMainText}</Link>
            <Link href="/community" className="btn-outline" style={{textDecoration:'none'}}>先看别人怎么做</Link>
          </div>
        </section>

        <section style={{display:'grid',gridTemplateColumns:'1.15fr 0.85fr',gap:14,alignItems:'stretch',marginBottom:18}} className="learn-first-grid">
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))',gap:10}} className="learn-choice-grid">
            {beginnerChoices.map((item) => (
              <Link key={item.title} href={item.href} style={{textDecoration:'none',border:item.highlight?'1px solid #8c7333':'1px solid #1f1f1f',background:item.highlight?'rgba(201,168,76,0.075)':'rgba(255,255,255,0.026)',borderRadius:10,padding:'18px 16px',minHeight:178,display:'flex',flexDirection:'column'}}>
                <span style={{color:item.highlight?'#e8c96a':'#888',fontSize:11,fontWeight:950,marginBottom:9}}>{item.label}</span>
                <h2 style={{color:'#fff',fontSize:17,fontWeight:950,lineHeight:1.35,marginBottom:8}}>{item.title}</h2>
                <p style={{color:'#aaa',fontSize:12,lineHeight:1.75,flex:1}}>{item.desc}</p>
                <span style={{color:item.highlight?'#111':'#e8c96a',background:item.highlight?'#e8c96a':'rgba(201,168,76,0.06)',border:'1px solid #7a6230',borderRadius:8,padding:'8px 10px',fontSize:12,fontWeight:950,width:'fit-content',marginTop:14}}>{item.cta}</span>
              </Link>
            ))}
          </div>

          <aside style={{border:'1px solid #1f1f1f',background:'rgba(255,255,255,0.026)',borderRadius:10,padding:'18px 18px'}}>
            <h2 style={{color:'#fff',fontSize:17,fontWeight:950,marginBottom:12}}>今天只需要这样走</h2>
            <div style={{display:'grid',gap:9}}>
              {firstRunSteps.map((item,index)=>(
                <div key={item.title} style={{display:'grid',gridTemplateColumns:'26px 1fr',gap:9,alignItems:'start'}}>
                  <span style={{width:26,height:26,borderRadius:999,display:'inline-flex',alignItems:'center',justifyContent:'center',background:'rgba(201,168,76,0.1)',color:'#e8c96a',fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:950}}>{index+1}</span>
                  <span>
                    <span style={{display:'block',color:'#fff',fontSize:13,fontWeight:950,marginBottom:3}}>{item.title}</span>
                    <span style={{display:'block',color:'#999',fontSize:12,lineHeight:1.6}}>{item.desc}</span>
                  </span>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section style={{border:'1px solid #2a1f10',background:'rgba(201,168,76,0.04)',borderRadius:12,padding:'20px 22px',marginBottom:18}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:14,flexWrap:'wrap',marginBottom:14}}>
            <div>
              <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:950,color:'#7a6230',letterSpacing:'0.14em',marginBottom:6}}>AFTER FIRST RESULT</p>
              <h2 style={{fontSize:21,fontWeight:950,color:'#fff',lineHeight:1.35}}>做完第一个任务后，不会让你停在原地</h2>
            </div>
            <Link href="/start" className="btn-outline" style={{textDecoration:'none'}}>回到我的下一步</Link>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,minmax(0,1fr))',gap:10}} className="learn-choice-grid">
            {nextAfterFirstTask.map((item,index)=>(
              <Link key={item.title} href={item.href} style={{textDecoration:'none',border:'1px solid #242424',background:'rgba(0,0,0,0.24)',borderRadius:10,padding:'15px 14px',minHeight:138}}>
                <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:950,color:'#e8c96a',marginBottom:8}}>STEP {index+1}</p>
                <h3 style={{fontSize:15,fontWeight:950,color:'#fff',lineHeight:1.4,marginBottom:7}}>{item.title}</h3>
                <p style={{fontSize:12,color:'#aaa',lineHeight:1.7,marginBottom:10}}>{item.desc}</p>
                <span style={{fontSize:12,color:'#cdbb80',fontWeight:950}}>{item.cta}</span>
              </Link>
            ))}
          </div>
        </section>

        <details style={{border:'1px solid #2a1f10',background:'rgba(201,168,76,0.035)',borderRadius:12,padding:'16px 18px',marginBottom:18}}>
          <summary style={{color:'#e8c96a',fontSize:14,fontWeight:950,cursor:'pointer'}}>已经做过第一步？展开完整学习主线</summary>
          <section style={{paddingTop:18}}>
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
        </details>

        <details style={{border:'1px solid #1f1f1f',background:'rgba(255,255,255,0.022)',borderRadius:12,padding:'16px 18px',marginBottom:18}}>
          <summary style={{color:'#e8c96a',fontSize:14,fontWeight:950,cursor:'pointer'}}>想继续往深处走？展开进阶路线</summary>
          <section style={{paddingTop:18}}>
          <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:16,flexWrap:'wrap',marginBottom:18}}>
            <div>
              <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:'0.2em',color:'#7a6230',fontWeight:900,marginBottom:6}}>DEEP LEARNING TRACK</p>
              <h2 style={{fontSize:24,fontWeight:950,color:'#fff',lineHeight:1.35}}>第一个任务之后，继续往深处走</h2>
              <p style={{fontSize:14,color:'#aaa',lineHeight:1.8,marginTop:8,maxWidth:760}}>小白AI 不把“完成第一步”当终点。真正的学习系统会把用户从一次小交付，推进到多产物、流程搭建、自动化和真实项目。</p>
            </div>
            <Link href="/start" className="btn-primary" style={{textDecoration:'none'}}>继续我的下一步</Link>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:10,marginBottom:14}}>
            {deepTrack.map((item,index)=>(
              <Link key={item.phase} href={item.href} style={{position:'relative',display:'block',textDecoration:'none',border:'1px solid #242424',background:index===0?'rgba(201,168,76,0.055)':'rgba(0,0,0,0.24)',borderRadius:10,padding:'16px 15px',minHeight:190}}>
                <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:950,color:'#e8c96a',marginBottom:7}}>{item.phase}</p>
                <h3 style={{fontSize:15,fontWeight:950,color:'#fff',lineHeight:1.45,marginBottom:8}}>{item.title}</h3>
                <p style={{fontSize:12,color:'#bbb',lineHeight:1.7,marginBottom:10}}>{item.goal}</p>
                <p style={{fontSize:11,color:'#8fd6a0',lineHeight:1.6,borderTop:'1px solid #202020',paddingTop:9}}>解锁判定：{item.unlock}</p>
              </Link>
            ))}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:8}}>
            {masteryChecks.map((item,index)=>(
              <div key={item.name} style={{border:'1px solid #1a1a1a',background:'rgba(0,0,0,0.22)',borderRadius:8,padding:'12px 13px'}}>
                <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:950,color:'#7a6230',marginBottom:5}}>MASTERY {index+1}</p>
                <p style={{fontSize:13,fontWeight:950,color:'#fff',marginBottom:4}}>{item.name}</p>
                <p style={{fontSize:12,color:'#aaa',lineHeight:1.6}}>{item.desc}</p>
              </div>
            ))}
          </div>
          </section>
        </details>

        <section style={{border:'1px solid #2a1f10',background:'rgba(201,168,76,0.045)',borderRadius:12,padding:'20px 22px',marginBottom:18}}>
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

        <div style={{border:'1px solid #2a1f10',background:'rgba(201,168,76,0.05)',borderRadius:12,padding:'16px 18px',marginBottom:18}}>
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

        <details style={{border:'1px solid #1a1a1a',background:'rgba(255,255,255,0.022)',borderRadius:12,padding:'16px 18px'}}>
          <summary style={{color:'#e8c96a',fontSize:14,fontWeight:950,cursor:'pointer'}}>按章节学习目录</summary>
          <div style={{display:'flex',flexDirection:'column',gap:10,marginTop:16}}>
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
        </details>
        <style>{`
          @media (max-width: 920px) {
            .learn-first-grid,
            .learn-choice-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>
    </div>
  )
}
