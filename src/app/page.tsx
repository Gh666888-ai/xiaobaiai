// @ts-nocheck
"use client"

import { useRef, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { NavBar } from "@/components/NavBar"
import { MessageCircle, Search, Route, Sparkles, Workflow, Wrench } from "lucide-react"
import { useAuth } from "@/lib/AuthContext"

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
  const { user } = useAuth()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [registeredUsers, setRegisteredUsers] = useState<number | null>(null)

  function handleSearch(q: string) {
    setSearchQuery(q)
  }
  function goSearch(e?: React.KeyboardEvent) {
    if (e && e.key !== "Enter") return
    if (!searchQuery.trim()) return
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
  }

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.registeredUsers === "number") setRegisteredUsers(data.registeredUsers)
      })
      .catch(() => undefined)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current; if(!canvas)return
    const ctx = canvas.getContext('2d'); if(!ctx)return
    let cols = Math.floor(window.innerWidth / 13)
    const drops:number[] = Array(cols).fill(0).map(()=>Math.random()*-100)
    let paused = false
    function resize(){canvas.width=window.innerWidth;canvas.height=window.innerHeight;cols=Math.floor(canvas.width/13);if(drops.length<cols){drops.length=cols;for(let i=0;i<cols;i++)if(drops[i]===undefined)drops[i]=Math.random()*-100}}
    resize();window.addEventListener('resize',resize)
    // 页面隐藏时暂停动画，节省CPU
    document.addEventListener('visibilitychange',()=>{paused=document.hidden})
    // Canvas滚出视口时暂停
    const observer = new IntersectionObserver(([e])=>{paused=!e.isIntersecting},{threshold:0})
    observer.observe(canvas)
    function draw(){
      if(paused) return
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
    return()=>{clearInterval(interval);window.removeEventListener('resize',resize);observer.disconnect()}
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
          <div style={{maxWidth:520,margin:'24px auto 0',opacity:0,animation:'fadeUp 0.8s ease forwards 1.3s',position:'relative',zIndex:80,isolation:'isolate'}}>
            <div style={{display:'flex',alignItems:'center',background:'rgba(8,8,8,0.96)',border:'1px solid #2a2a2a',borderRadius:10}}>
              <Search size={14} style={{marginLeft:14,color:'#777',flexShrink:0}} />
              <input type="text" placeholder="搜工具、模型、技能、教程..."
                value={searchQuery} onChange={e=>handleSearch(e.target.value)} onKeyDown={goSearch}
                style={{flex:1,background:'transparent',border:'none',outline:'none',padding:'12px 14px',fontSize:14,fontWeight:500,color:'#fff',fontFamily:"'Noto Sans SC', sans-serif"}} />
              <button onClick={()=>goSearch()} disabled={!searchQuery.trim()} style={{marginRight:6,height:34,padding:'0 14px',borderRadius:8,border:'1px solid #7a6230',background:'rgba(201,168,76,0.12)',color:'#e8c96a',fontSize:12,fontWeight:900,cursor:searchQuery.trim()?'pointer':'default',opacity:searchQuery.trim()?1:.45}}>搜索</button>
            </div>
          </div>

          <div style={{maxWidth:680,margin:'18px auto 0',display:'grid',gridTemplateColumns:'1fr auto',gap:12,alignItems:'center',border:'1px solid rgba(201,168,76,0.34)',background:'rgba(6,6,6,0.9)',borderRadius:12,padding:'13px 15px',opacity:0,animation:'fadeUp 0.8s ease forwards 1.45s',position:'relative',zIndex:20}} className="home-growth-cta">
            <div style={{textAlign:'left'}}>
              <p style={{fontSize:13,fontWeight:950,color:'#fff',marginBottom:4}}>
                {user ? `欢迎回来，${user.name} · ${user.xp} XP` : registeredUsers === null ? '登录后开始累计 XP 和等级身份' : `已有 ${registeredUsers} 位用户加入成长系统`}
              </p>
              <p style={{fontSize:12,color:'#cdbb80',lineHeight:1.65}}>
                在线每 5 分钟 +2XP，每天任务、发帖和评论都会升级；LV5 后社区优先展示，LV7 有共创者标志。
              </p>
            </div>
            <Link href={user ? "/growth" : "/login?redirect=/growth"} style={{display:'inline-flex',alignItems:'center',justifyContent:'center',minHeight:38,padding:'8px 14px',borderRadius:9,border:'1px solid #e8c96a',background:'#e8c96a',color:'#111',fontSize:12,fontWeight:950,textDecoration:'none',whiteSpace:'nowrap'}}>
              {user ? '去做任务' : '登录领 XP'}
            </Link>
          </div>

          {/* 计数条 */}
          <div style={{display:'flex',justifyContent:'center',gap:32,marginTop:32,flexWrap:'wrap',opacity:0,animation:'fadeUp 0.8s ease forwards 1.5s',position:'relative',zIndex:1}}>
            <div style={{textAlign:'center'}}><p style={{fontSize:24,fontWeight:900,color:'#e8c96a',fontFamily:"'JetBrains Mono',monospace"}}>1000+</p><p style={{fontSize:10,color:'#888'}}>AI工具</p></div>
            <div style={{textAlign:'center'}}><p style={{fontSize:24,fontWeight:900,color:'#e8c96a',fontFamily:"'JetBrains Mono',monospace"}}>100+</p><p style={{fontSize:10,color:'#888'}}>AI资讯</p></div>
            <div style={{textAlign:'center'}}><p style={{fontSize:24,fontWeight:900,color:'#e8c96a',fontFamily:"'JetBrains Mono',monospace"}}>5</p><p style={{fontSize:10,color:'#888'}}>学习阶段</p></div>
            <div style={{textAlign:'center'}}><p style={{fontSize:24,fontWeight:900,color:'#e8c96a',fontFamily:"'JetBrains Mono',monospace"}}>5000+</p><p style={{fontSize:10,color:'#888'}}>Agent技能</p></div>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'repeat(5, minmax(0, 1fr))',gap:10,maxWidth:980,margin:'28px auto 0',opacity:0,animation:'fadeUp 0.8s ease forwards 1.7s'}} className="max-sm:grid-cols-1">
            {[
              {icon:<Route size={17}/>,label:'我完全不会 AI，从这里开始',href:'/learn/0'},
              {icon:<Wrench size={17}/>,label:'帮我选一个 AI 工具',href:'/choose-tool'},
              {icon:<Sparkles size={17}/>,label:'生成我的学习路线',href:'/search?q=生成我的学习路线'},
              {icon:<MessageCircle size={17}/>,label:'直接问小白AI',action:'chat'},
              {icon:<Workflow size={17}/>,label:'搭建 AI 工作流',href:'/workflows'},
            ].map(cta=> cta.action === 'chat' ? (
              <button key={cta.label} type="button" onClick={()=>window.dispatchEvent(new Event('xiaobai:open-chat'))} style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,minHeight:48,padding:'10px 14px',border:'1px solid #1f1f1f',background:'rgba(255,255,255,0.035)',borderRadius:10,color:'#ddd',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:"'Noto Sans SC', sans-serif"}}>
                <span style={{color:'#e8c96a',display:'inline-flex'}}>{cta.icon}</span>
                <span>{cta.label}</span>
              </button>
            ) : (
              <Link key={cta.label} href={cta.href} style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,minHeight:48,padding:'10px 14px',border:'1px solid #1f1f1f',background:'rgba(255,255,255,0.035)',borderRadius:10,color:'#ddd',fontSize:13,fontWeight:700,textDecoration:'none'}}>
                <span style={{color:'#e8c96a',display:'inline-flex'}}>{cta.icon}</span>
                <span>{cta.label}</span>
              </Link>
            ))}
          </div>

          <div style={{display:'flex',justifyContent:'center',gap:8,flexWrap:'wrap',marginTop:18,opacity:0,animation:'fadeUp 0.8s ease forwards 1.85s'}}>
            {[
              {label:'AI工具大全',href:'/ai-tools'},
              {label:'AI教程大全',href:'/tutorials'},
              {label:'免费AI工具',href:'/free-ai-tools'},
              {label:'ChatGPT怎么用',href:'/chatgpt'},
              {label:'DeepSeek怎么用',href:'/deepseek'},
              {label:'Codex国内使用',href:'/codex'},
              {label:'Dify教程',href:'/dify'},
              {label:'Cursor怎么用',href:'/cursor'},
              {label:'Agent教程',href:'/agent'},
              {label:'AI编程工具推荐',href:'/ai-coding'},
              {label:'AI绘图工具',href:'/ai-image-tools'},
              {label:'AI写作工具',href:'/ai-writing-tools'},
              {label:'AI视频工具',href:'/ai-video-tools'},
              {label:'AI办公工具',href:'/ai-office-tools'},
              {label:'AI PPT工具',href:'/ai-ppt-tools'},
              {label:'DeepSeek API Key',href:'/deepseek-api-key'},
              {label:'Dify知识库',href:'/dify-knowledge-base'},
              {label:'Gamma做PPT',href:'/gamma-ppt'},
              {label:'即梦提示词',href:'/jimeng-prompts'},
            ].map(item=>(
              <Link key={item.href} href={item.href} style={{fontSize:12,color:'#aaa',textDecoration:'none',border:'1px solid #202020',background:'rgba(255,255,255,0.025)',borderRadius:999,padding:'7px 12px'}}>
                {item.label}
              </Link>
            ))}
          </div>

        </div>
      </section>

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes expandWidth { to { width: 120px; } }
        @media (max-width: 640px) {
          .home-growth-cta {
            grid-template-columns: 1fr !important;
            text-align: left !important;
          }
          .home-growth-cta a {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}
