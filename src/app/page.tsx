// @ts-nocheck
"use client"

import { useRef, useEffect } from "react"
import { tools } from "@/data/tools"
import { news } from "@/data/news"
import Link from "next/link"

const SYMBOLS = [
  '0','1','2','3','4','5','6','7','8','9',
  'Σ','Δ','Ω','Ψ','δ','α','β','γ','φ','λ',
  'π','∞','±','∂','∫','√','≈','≡','∈','⊕',
  'Θ','Λ','Φ','Ξ','Π','Υ','Ψ','Ω',
  '+','-','×','÷','=','≠','<','>','≤','≥',
  '∑','∏','∫','∮','∴','∵','⊥','∥'
]

function letter(n:string){return /^[a-zA-Z]/.test(n)?n[0].toUpperCase():n[0]}
function avatarColor(n:string){const c=["#c9a84c","#7a6230","#e8c96a","#5a8a5a"];let h=0;for(let i=0;i<n.length;i++)h=n.charCodeAt(i)+((h<<5)-h);return c[Math.abs(h)%c.length]}

export default function HomePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const newsData = news.slice(0, 6)

  useEffect(() => {
    const canvas = canvasRef.current; if(!canvas)return
    const ctx = canvas.getContext('2d'); if(!ctx)return
    let cols = Math.floor(window.innerWidth / 13)
    const drops:number[] = Array(cols).fill(0).map(()=>Math.random()*-100)
    function resize(){canvas.width=window.innerWidth;canvas.height=window.innerHeight;cols=Math.floor(canvas.width/13);if(drops.length<cols){drops.length=cols;for(let i=0;i<cols;i++)if(drops[i]===undefined)drops[i]=Math.random()*-100}}
    resize();window.addEventListener('resize',resize)
    function draw(){
      ctx.fillStyle='rgba(0,0,0,0.06)';ctx.fillRect(0,0,canvas.width,canvas.height)
      for(let i=0;i<drops.length;i++){
        const char=SYMBOLS[Math.floor(Math.random()*SYMBOLS.length)]
        const x=i*13;const y=drops[i]*13;const depth=y/canvas.height
        const alpha=0.12+depth*0.5;const bright=Math.floor(depth*160+60)
        ctx.fillStyle=`rgba(${bright},${bright*0.75},${bright*0.3},${alpha})`
        ctx.font=`13px JetBrains Mono, monospace`;ctx.fillText(char,x,y)
        if(y>canvas.height&&Math.random()>0.975)drops[i]=0;drops[i]++
      }
    }
    const interval=setInterval(draw,50);draw()
    return()=>{clearInterval(interval);window.removeEventListener('resize',resize)}
  },[])

  return (
    <div style={{background:'#000',minHeight:'100vh',color:'#f0f0f0',fontFamily:"'Noto Sans SC', sans-serif",overflowX:'hidden'}}>
      {/* 顶部导航 */}
      <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:100,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'20px 60px',background:'linear-gradient(180deg, rgba(0,0,0,0.9) 0%, transparent 100%)'}} className="max-sm:px-6">
        <span style={{fontSize:13,fontWeight:700,letterSpacing:'0.2em',color:'#c9a84c',textTransform:'uppercase',fontFamily:"'JetBrains Mono', monospace"}}>小白AI</span>
        <div style={{display:'flex',gap:40}} className="max-sm:hidden">
          {[
            {l:'工具导航',h:'/tools'},{l:'学习路径',h:'/learn'},{l:'AI资讯',h:'/news'},{l:'社区',h:'/community'},{l:'登录',h:'/login'}
          ].map(x=>(
            <Link key={x.l} href={x.h} style={{fontFamily:"'JetBrains Mono', monospace",fontSize:11,letterSpacing:'0.12em',color:'rgba(255,255,255,0.45)',textDecoration:'none',transition:'color 0.2s'}}>{x.l}</Link>
          ))}
        </div>
        <Link href="/login" style={{fontFamily:"'JetBrains Mono', monospace",fontSize:11,letterSpacing:'0.15em',color:'#c9a84c',textTransform:'uppercase',border:'1px solid #7a6230',padding:'8px 20px',background:'transparent',cursor:'pointer',transition:'all 0.3s',textDecoration:'none'}}>登录</Link>
      </nav>

      {/* 全屏 Hero + Canvas雨 */}
      <section style={{position:'relative',height:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
        <canvas ref={canvasRef} style={{position:'absolute',inset:0,width:'100%',height:'100%',zIndex:0}} />
        <div style={{position:'absolute',bottom:0,left:0,right:0,height:120,background:'radial-gradient(ellipse 80% 100% at 50% 100%, rgba(201,168,76,0.12) 0%, transparent 70%)',zIndex:1}} />
        <div style={{position:'absolute',bottom:0,left:0,right:0,height:2,background:'linear-gradient(90deg, transparent 0%, #7a6230 20%, #c9a84c 50%, #7a6230 80%, transparent 100%)',opacity:0.4,zIndex:1}} />

        <div style={{position:'relative',zIndex:10,textAlign:'center',padding:'0 40px'}}>
          <p style={{fontFamily:"'JetBrains Mono', monospace",fontSize:10,letterSpacing:'0.5em',color:'#7a6230',textTransform:'uppercase',marginBottom:32,opacity:0,animation:'fadeUp 0.8s ease forwards 0.3s'}}>AI Navigation · Learning · News</p>
          <h1 style={{fontSize:'clamp(56px, 10vw, 120px)',fontWeight:900,lineHeight:1,letterSpacing:'0.05em',color:'#fff',textShadow:'0 0 80px rgba(201,168,76,0.15), 0 0 160px rgba(201,168,76,0.05)',marginBottom:32,opacity:0,animation:'fadeUp 0.8s ease forwards 0.5s'}}>小白AI</h1>
          <div style={{width:0,height:1,background:'linear-gradient(90deg, transparent, #c9a84c, transparent)',margin:'0 auto 32px',animation:'expandWidth 1s ease forwards 0.8s'}} />
          <p style={{fontSize:'clamp(15px, 2vw, 18px)',fontWeight:300,lineHeight:2,color:'rgba(255,255,255,0.5)',letterSpacing:'0.05em',maxWidth:560,margin:'0 auto 16px',opacity:0,animation:'fadeUp 0.8s ease forwards 1s'}}>从零到 Agent，每一步都算数</p>
          <p style={{fontSize:'clamp(13px, 1.5vw, 15px)',fontWeight:300,lineHeight:2,color:'rgba(255,255,255,0.3)',letterSpacing:'0.05em',maxWidth:560,margin:'0 auto 48px',opacity:0,animation:'fadeUp 0.8s ease forwards 1.1s'}}>工具导航 + 学习平台 + 新闻聚合 · Agent 维护 + 社区共建</p>
          <div style={{display:'flex',gap:12,flexWrap:'wrap',opacity:0,animation:'fadeUp 0.8s ease forwards 1.3s'}}>
            <Link href="/learn" style={{display:'inline-flex',alignItems:'center',gap:12,padding:'14px 36px',border:'1px solid #7a6230',color:'#e8c96a',fontFamily:"'JetBrains Mono', monospace",fontSize:12,letterSpacing:'0.15em',textDecoration:'none',background:'rgba(201,168,76,0.06)',transition:'all 0.3s'}}>
              🐣 小白入门
            </Link>
            <Link href="/tools" style={{display:'inline-flex',alignItems:'center',gap:12,padding:'14px 36px',border:'1px solid #333',color:'#888',fontFamily:"'JetBrains Mono', monospace",fontSize:12,letterSpacing:'0.15em',textDecoration:'none',transition:'all 0.3s'}}>
              ⚡ 找工具
            </Link>
          </div>
        </div>
      </section>

      {/* 核心能力 = 三个板块 */}
      <div style={{position:'relative',zIndex:10,padding:'120px 60px',background:'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.95) 20%)'}} className="max-sm:px-6">
        <p style={{fontFamily:"'JetBrains Mono', monospace",fontSize:10,letterSpacing:'0.4em',color:'#7a6230',textTransform:'uppercase',textAlign:'center',marginBottom:80}}>核心板块</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3, 1fr)',gap:2,maxWidth:1100,margin:'0 auto'}} className="max-sm:grid-cols-1">
          {[
            {icon:'◈',name:'工具导航',desc:`收录 ${tools.length}+ 款 AI 工具，覆盖 15 个分类。每款工具标注学习阶段，新手也能快速找到适合自己的 AI 产品。`,href:'/tools'},
            {icon:'◉',name:'学习路径',desc:'7 个阶段，从认识 AI 到搭建 Agent 工作流。每步有配套工具和详细教程，零基础友好。',href:'/learn'},
            {icon:'◎',name:'AI 资讯',desc:'Agent 自动聚合最新 AI 动态 + 社区用户投稿。双内容源保障资讯广度与质量。',href:'/news'},
          ].map(card=>(
            <Link key={card.name} href={card.href}
              style={{background:'rgba(255,255,255,0.02)',border:'1px solid #1a1a1a',padding:'48px 36px',position:'relative',overflow:'hidden',transition:'all 0.4s',cursor:'pointer',textDecoration:'none',display:'block'}}
              onMouseEnter={e=>{e.currentTarget.style.background='rgba(201,168,76,0.04)';e.currentTarget.style.borderColor='#7a6230'}}
              onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.02)';e.currentTarget.style.borderColor='#1a1a1a'}}>
              <span style={{fontSize:28,marginBottom:24,display:'block',color:'#c9a84c'}}>{card.icon}</span>
              <h3 style={{fontSize:20,fontWeight:700,color:'#fff',marginBottom:16,letterSpacing:'0.05em'}}>{card.name}</h3>
              <p style={{fontSize:13,fontWeight:300,lineHeight:1.8,color:'rgba(255,255,255,0.4)',letterSpacing:'0.02em'}}>{card.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* 底部 */}
      <footer style={{position:'fixed',bottom:0,left:0,right:0,zIndex:100,display:'flex',justifyContent:'space-between',alignItems:'center',padding:'16px 60px',background:'linear-gradient(0deg, rgba(0,0,0,0.8) 0%, transparent 100%)',borderTop:'1px solid #111'}} className="max-sm:px-6 max-sm:flex-col max-sm:gap-2">
        <div style={{display:'flex',gap:32}}>
          {[{l:'工具导航',h:'/tools'},{l:'学习路径',h:'/learn'},{l:'AI 资讯',h:'/news'},{l:'登录',h:'/login'}].map(x=>(
            <Link key={x.l} href={x.h} style={{fontFamily:"'JetBrains Mono', monospace",fontSize:10,letterSpacing:'0.1em',color:'rgba(255,255,255,0.3)',textDecoration:'none',transition:'color 0.2s'}}>{x.l}</Link>
          ))}
        </div>
        <span style={{fontFamily:"'JetBrains Mono', monospace",fontSize:10,color:'rgba(255,255,255,0.2)',letterSpacing:'0.05em'}}>© 2026 小白AI. Agent + Community.</span>
      </footer>

      {/* 页面底部留白防止fixed footer遮挡 */}
      <div style={{height:60}} />

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes expandWidth { to { width: 120px; } }
      `}</style>
    </div>
  )
}
