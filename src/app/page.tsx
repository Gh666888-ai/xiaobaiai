// @ts-nocheck
"use client"

import { useRef, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { tools } from "@/data/tools"
import { news } from "@/data/news"
import Link from "next/link"
import { NavBar } from "@/components/NavBar"
import { Search } from "lucide-react"

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
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<typeof tools>([])
  const [showResults, setShowResults] = useState(false)
  const newsData = news.slice(0, 6)

  function handleSearch(q: string) {
    setSearchQuery(q)
    if (!q.trim()) { setSearchResults([]); setShowResults(false); return }
    const kw = q.toLowerCase()
    const results = tools.filter(t => t.name.toLowerCase().includes(kw) || t.description.toLowerCase().includes(kw) || t.tags.some(tg => tg.toLowerCase().includes(kw))).slice(0, 6)
    setSearchResults(results)
    setShowResults(true)
  }
  function goSearch(e?: React.KeyboardEvent) {
    if (e && e.key !== "Enter") return
    if (!searchQuery.trim()) return
    setShowResults(false)
    router.push(`/tools?search=${encodeURIComponent(searchQuery.trim())}`)
  }

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
      <NavBar />

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
          {/* 全局搜索 */}
          <div style={{maxWidth:480,margin:'24px auto 0',opacity:0,animation:'fadeUp 0.8s ease forwards 1.3s',position:'relative'}}>
            <div style={{display:'flex',alignItems:'center',background:'rgba(255,255,255,0.04)',border:'1px solid #222',borderRadius:10}}>
              <Search size={14} style={{marginLeft:14,color:'#777',flexShrink:0}} />
              <input type="text" placeholder="搜工具、模型、技能、教程..."
                value={searchQuery} onChange={e=>handleSearch(e.target.value)} onKeyDown={goSearch}
                onFocus={()=>searchResults.length>0&&setShowResults(true)}
                onBlur={()=>setTimeout(()=>setShowResults(false),300)}
                style={{flex:1,background:'transparent',border:'none',outline:'none',padding:'12px 14px',fontSize:14,fontWeight:500,color:'#fff',fontFamily:"'Noto Sans SC', sans-serif"}} />
            </div>
            {showResults && searchResults.length > 0 && (
              <div style={{position:'absolute',top:'100%',left:0,right:0,background:'#111',border:'1px solid #222',borderRadius:10,marginTop:4,zIndex:100,overflow:'hidden'}}
                onMouseDown={e=>e.preventDefault()}>
                {searchResults.map(t=>(
                  <a key={t.id} href={t.url} target="_blank" rel="noopener noreferrer"
                    style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',textDecoration:'none',borderBottom:'1px solid #1a1a1a',transition:'background 0.2s'}}
                    onMouseEnter={e=>{e.currentTarget.style.background='rgba(201,168,76,0.08)'}}
                    onMouseLeave={e=>{e.currentTarget.style.background='transparent'}}>
                    <span style={{fontSize:16}}>{letter(t.name)}</span>
                    <div style={{flex:1}}>
                      <p style={{fontSize:13,fontWeight:600,color:'#fff'}}>{t.name}</p>
                      <p style={{fontSize:11,color:'#888',lineHeight:1.3}}>{t.description.slice(0,50)}...</p>
                    </div>
                    <span style={{fontSize:10,color:'#666',border:'1px solid #333',padding:'1px 6px',borderRadius:3}}>{t.pricing}</span>
                  </a>
                ))}
                <div style={{textAlign:'center',padding:'8px'}}>
                  <span style={{fontSize:11,color:'#c9a84c',cursor:'pointer'}} onClick={()=>goSearch()}>
                    查看全部结果 → 按 Enter
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 计数条 */}
          <div style={{display:'flex',justifyContent:'center',gap:32,marginTop:32,flexWrap:'wrap',opacity:0,animation:'fadeUp 0.8s ease forwards 1.5s'}}>
            <div style={{textAlign:'center'}}><p style={{fontSize:24,fontWeight:900,color:'#e8c96a',fontFamily:"'JetBrains Mono',monospace"}}>{tools.length}</p><p style={{fontSize:10,color:'#888'}}>AI工具</p></div>
            <div style={{textAlign:'center'}}><p style={{fontSize:24,fontWeight:900,color:'#e8c96a',fontFamily:"'JetBrains Mono',monospace"}}>{news.length}</p><p style={{fontSize:10,color:'#888'}}>AI资讯</p></div>
            <div style={{textAlign:'center'}}><p style={{fontSize:24,fontWeight:900,color:'#e8c96a',fontFamily:"'JetBrains Mono',monospace"}}>5</p><p style={{fontSize:10,color:'#888'}}>学习阶段</p></div>
            <div style={{textAlign:'center'}}><p style={{fontSize:24,fontWeight:900,color:'#e8c96a',fontFamily:"'JetBrains Mono',monospace"}}>5000+</p><p style={{fontSize:10,color:'#888'}}>Agent技能</p></div>
          </div>

          <div style={{textAlign:'center',marginTop:28,opacity:0,animation:'fadeUp 0.8s ease forwards 1.7s'}}>
            <Link href="/learn" style={{textDecoration:'none',display:'inline-block',padding:'24px 48px',border:'1px solid #7a6230',borderRadius:12,background:'rgba(201,168,76,0.06)',transition:'all 0.3s',cursor:'pointer'}}>
              <p style={{fontSize:'clamp(24px,4vw,36px)',fontWeight:900,color:'#e8c96a',fontFamily:"'JetBrains Mono',monospace",letterSpacing:'0.1em',marginBottom:8}}>小白入门</p>
              <p style={{fontSize:14,fontWeight:400,color:'#aaa',fontFamily:"'Noto Sans SC',sans-serif",margin:0}}>手把手教你从下载到应用</p>
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
