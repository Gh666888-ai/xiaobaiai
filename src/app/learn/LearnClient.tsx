"use client"

import { useEffect, useState } from "react"
import { stages } from "@/data/learning-path"
import { tools } from "@/data/tools"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"
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
    <div className="xb-workbench" style={{background:'#000',minHeight:'100vh',fontFamily:"'Noto Sans SC', sans-serif",position:'relative',overflow:'hidden'}}>
      <MathRain />
      <NavBar />

      <main style={{maxWidth:980,margin:'0 auto',padding:'50px 28px 72px',position:'relative',zIndex:10}} className="xb-workbench-main learn-shell">
        <section style={{border:'1px solid #2a1f10',background:'rgba(0,0,0,0.9)',borderRadius:12,padding:'30px 30px 26px',marginBottom:14}}>
          <div style={{display:'flex',justifyContent:'space-between',gap:18,alignItems:'flex-start',flexWrap:'wrap',marginBottom:18}}>
            <div style={{maxWidth:680}}>
              <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:'0.22em',color:'#7a6230',textTransform:'uppercase',fontWeight:950,marginBottom:10}}>XIAOBAI LEARNING</p>
              <h1 style={{fontSize:'clamp(30px,5vw,52px)',fontWeight:950,color:'#fff',letterSpacing:0,lineHeight:1.12,marginBottom:12}}>先做一件事，再学需要的 AI 工具</h1>
              <p style={{fontSize:15,color:'#b8b8b8',lineHeight:1.9,maxWidth:640}}>学习页不应该像课程超市。你只要告诉小白你的行业和想做成什么事，小白会直接跳到对应的任务模板，一步一步带你做完。真正跨工具、跨系统、自动运行的公司流程，才放进工作流。</p>
            </div>
            <div style={{minWidth:150,border:'1px solid #242424',background:'rgba(255,255,255,0.025)',borderRadius:10,padding:'14px 15px'}}>
              <p style={{fontSize:12,fontWeight:950,color:'#fff',marginBottom:8}}>我的进度</p>
              <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:18,fontWeight:950,color:'#e8c96a',marginBottom:8}}>{doneSections}/{totalSections}</p>
              <div style={{height:6,background:'#111',borderRadius:999,overflow:'hidden'}}>
                <div style={{height:'100%',width:`${totalSections ? Math.round(doneSections / totalSections * 100) : 0}%`,background:'linear-gradient(90deg,#7a6230,#e8c96a)'}} />
              </div>
              <p style={{fontSize:11,color:'#8f8f8f',lineHeight:1.6,marginTop:9}}>已完成真实任务：{missionDoneCount} 个</p>
            </div>
          </div>

          <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
            <Link href={nextMainAction} className="btn-primary" style={{textDecoration:'none'}}>{nextMainText}</Link>
            <Link href="/agent-install" className="btn-outline" style={{textDecoration:'none'}}>先装 Agent 工具</Link>
            <Link href="/missions" className="btn-outline" style={{textDecoration:'none'}}>查看任务库</Link>
          </div>
        </section>

        <section style={{display:'grid',gridTemplateColumns:'0.9fr 1.1fr',gap:14,marginBottom:14}} className="learn-first-grid">
          <div style={{border:'1px solid #2a1f10',background:'rgba(201,168,76,0.045)',borderRadius:12,padding:'20px 20px'}}>
            <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:950,color:'#7a6230',letterSpacing:'0.12em',marginBottom:8}}>START</p>
            <h2 style={{fontSize:22,fontWeight:950,color:'#fff',lineHeight:1.35,marginBottom:10}}>第一次来，只做这一个动作</h2>
            <p style={{fontSize:14,color:'#bbb',lineHeight:1.85,marginBottom:16}}>点击开始，把你的行业和目标告诉右下角小白。页面不要你自己选一堆课，小白会帮你进入固定任务模板。</p>
            <Link href="/start" className="btn-primary" style={{textDecoration:'none'}}>让小白给我定计划</Link>
          </div>

          <div style={{border:'1px solid #1f1f1f',background:'rgba(255,255,255,0.024)',borderRadius:12,padding:'20px'}}>
            <h2 style={{fontSize:20,fontWeight:950,color:'#fff',lineHeight:1.35,marginBottom:14}}>小白会这样带你走</h2>
            <div style={{display:'grid',gap:10}}>
              {firstRunSteps.map((item,index)=>(
                <div key={item.title} style={{display:'grid',gridTemplateColumns:'30px 1fr',gap:10,alignItems:'start'}}>
                  <span style={{width:30,height:30,borderRadius:999,display:'inline-flex',alignItems:'center',justifyContent:'center',background:index===0?'#e8c96a':'rgba(201,168,76,0.1)',color:index===0?'#111':'#e8c96a',fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:950}}>{index+1}</span>
                  <span>
                    <span style={{display:'block',color:'#fff',fontSize:14,fontWeight:950,marginBottom:3}}>{item.title}</span>
                    <span style={{display:'block',color:'#999',fontSize:12,lineHeight:1.7}}>{item.desc}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{border:'1px solid #1f1f1f',background:'rgba(0,0,0,0.72)',borderRadius:12,padding:'18px 18px',marginBottom:14}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,flexWrap:'wrap',marginBottom:12}}>
            <div>
              <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:950,color:'#7a6230',letterSpacing:'0.12em',marginBottom:6}}>QUICK CHOOSE</p>
              <h2 style={{fontSize:20,fontWeight:950,color:'#fff',lineHeight:1.35}}>如果你不想打字，也可以直接选一个方向</h2>
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,minmax(0,1fr))',gap:10}} className="learn-choice-grid">
            {beginnerChoices.map((item) => (
              <Link key={item.title} href={item.href} style={{textDecoration:'none',border:item.highlight?'1px solid #8c7333':'1px solid #242424',background:item.highlight?'rgba(201,168,76,0.075)':'rgba(255,255,255,0.022)',borderRadius:10,padding:'15px 14px',minHeight:150,display:'flex',flexDirection:'column'}}>
                <span style={{color:item.highlight?'#e8c96a':'#888',fontSize:11,fontWeight:950,marginBottom:8}}>{item.label}</span>
                <h3 style={{color:'#fff',fontSize:15,fontWeight:950,lineHeight:1.35,marginBottom:8}}>{item.title}</h3>
                <p style={{color:'#999',fontSize:12,lineHeight:1.65,flex:1}}>{item.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        <details style={{border:'1px solid #2a1f10',background:'rgba(201,168,76,0.035)',borderRadius:12,padding:'16px 18px',marginBottom:12}}>
          <summary style={{color:'#e8c96a',fontSize:15,fontWeight:950,cursor:'pointer'}}>做完第一个任务以后，下一步学什么</summary>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,minmax(0,1fr))',gap:10,marginTop:16}} className="learn-choice-grid">
            {nextAfterFirstTask.map((item,index)=>(
              <Link key={item.title} href={item.href} style={{textDecoration:'none',border:'1px solid #242424',background:'rgba(0,0,0,0.24)',borderRadius:10,padding:'15px 14px',minHeight:126}}>
                <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:950,color:'#e8c96a',marginBottom:8}}>STEP {index+1}</p>
                <h3 style={{fontSize:15,fontWeight:950,color:'#fff',lineHeight:1.4,marginBottom:7}}>{item.title}</h3>
                <p style={{fontSize:12,color:'#aaa',lineHeight:1.7,marginBottom:10}}>{item.desc}</p>
                <span style={{fontSize:12,color:'#cdbb80',fontWeight:950}}>{item.cta}</span>
              </Link>
            ))}
          </div>
        </details>

        <details style={{border:'1px solid #1f1f1f',background:'rgba(255,255,255,0.022)',borderRadius:12,padding:'16px 18px',marginBottom:12}}>
          <summary style={{color:'#e8c96a',fontSize:15,fontWeight:950,cursor:'pointer'}}>完整学习目录</summary>
          <div style={{display:'flex',flexDirection:'column',gap:9,marginTop:16}}>
            {stages.map((stage,i)=>{
              const st=tools.filter(t=>t.stage===stage.id)
              const completed = stage.sections.filter((_, index) => progress[progressId(stage.id, index)]).length
              const percent = stage.sections.length ? Math.round(completed / stage.sections.length * 100) : 0
              return (
                <Link key={stage.id} href={`/learn/${stage.id}`} style={{background:'rgba(255,255,255,0.026)',border:'1px solid #1a1a1a',borderRadius:10,padding:'15px 16px',textDecoration:'none',display:'grid',gridTemplateColumns:'46px 1fr auto',alignItems:'center',gap:14}} className="stage-row">
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:950,color:'#e8c96a'}}>{String(i).padStart(2,"0")}</span>
                  <span style={{minWidth:0}}>
                    <span style={{display:'block',fontSize:16,fontWeight:950,color:'#fff',marginBottom:4}}>{stage.title}</span>
                    <span style={{display:'block',fontSize:12,color:'#aaa',lineHeight:1.6}}>{stage.subtitle}</span>
                    <span style={{display:'flex',gap:14,flexWrap:'wrap',fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,color:'#777',marginTop:8}}>
                      <span>{stage.sections.length} 章</span>
                      <span>{stage.timeEstimate}</span>
                      {st.length>0&&<span>{st.length} 个工具</span>}
                      <span style={{color:completed>0?'#e8c96a':'#666'}}>{completed}/{stage.sections.length} 完成</span>
                    </span>
                  </span>
                  <span style={{width:70,height:6,background:'#111',borderRadius:999,overflow:'hidden'}}>
                    <span style={{display:'block',height:'100%',width:`${percent}%`,background:'linear-gradient(90deg,#7a6230,#e8c96a)'}} />
                  </span>
                </Link>
              )
            })}
          </div>
        </details>

        <details style={{border:'1px solid #1f1f1f',background:'rgba(255,255,255,0.022)',borderRadius:12,padding:'16px 18px'}}>
          <summary style={{color:'#e8c96a',fontSize:15,fontWeight:950,cursor:'pointer'}}>更深的 3 周路线</summary>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))',gap:10,marginTop:16}}>
            {deepTrack.map((item,index)=>(
              <Link key={item.phase} href={item.href} style={{textDecoration:'none',border:'1px solid #242424',background:index===0?'rgba(201,168,76,0.055)':'rgba(0,0,0,0.24)',borderRadius:10,padding:'15px 14px',minHeight:168}}>
                <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:950,color:'#e8c96a',marginBottom:7}}>{item.phase}</p>
                <h3 style={{fontSize:15,fontWeight:950,color:'#fff',lineHeight:1.45,marginBottom:8}}>{item.title}</h3>
                <p style={{fontSize:12,color:'#bbb',lineHeight:1.7,marginBottom:10}}>{item.goal}</p>
                <p style={{fontSize:11,color:'#8fd6a0',lineHeight:1.6,borderTop:'1px solid #202020',paddingTop:9}}>解锁：{item.unlock}</p>
              </Link>
            ))}
          </div>
        </details>

        <style>{`
          @media (max-width: 920px) {
            .learn-shell {
              padding: 32px 16px 56px !important;
            }
            .learn-first-grid,
            .learn-choice-grid {
              grid-template-columns: 1fr !important;
            }
            .stage-row {
              grid-template-columns: 34px 1fr !important;
            }
            .stage-row > span:last-child {
              grid-column: 1 / -1;
              width: 100% !important;
            }
          }
        `}</style>
      </main>
    </div>
  )
}
