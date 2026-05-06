import type { Metadata } from "next"
import { Suspense } from "react"
import { tools, categories } from "@/data/tools"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"
import ToolsClient from "./ToolsClient"
import Link from "next/link"

const cnKw=["国产","中文","腾讯","阿里","百度","字节","快手","智谱","月之暗面","MiniMax","Kimi","DeepSeek","通义","文心","豆包","即梦","可灵","Coze","QClaw","ArkClaw","CowAgent","NocoBase","AionUi","万兴"]
function isCN(t:typeof tools[0]){return cnKw.some(k=>t.name.includes(k)||t.tags.some(tg=>tg.includes(k))||t.description.includes(k))}

export const metadata: Metadata = {
  title: "AI工具导航 — 600+款AI工具分类排行",
  description: "收录600+款AI工具，覆盖对话AI/绘图/视频/写作/编程/办公等15个分类。每款工具标注学习阶段，新手也能快速找到适合的AI产品。",
}

export default function ToolsPage() {
  return (
    <div style={{background:'#000',minHeight:'100vh',fontFamily:"'Noto Sans SC', sans-serif",position:'relative',overflow:'hidden'}}>
      <MathRain />
      <NavBar />
      <div style={{maxWidth:1100,margin:'0 auto',padding:'60px 60px',position:'relative',zIndex:10,background:'rgba(0,0,0,0.85)',textAlign:'left'}} className="max-sm:px-4">
        <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:'0.4em',color:'#7a6230',textTransform:'uppercase',marginBottom:10,fontWeight:700}}>Directory</p>
        <h1 style={{fontSize:36,fontWeight:900,color:'#fff',letterSpacing:'0.02em',marginBottom:8}}>工具导航</h1>
        <p style={{fontSize:14,fontWeight:400,color:'#ccc',marginBottom:32,textAlign:'left'}}>{tools.length} tools indexed</p>

        {/* 搜索——客户端组件 */}
        <Suspense fallback={<div style={{textAlign:'center',padding:40,color:'#888'}}>加载搜索...</div>}>
          <ToolsClient />
        </Suspense>

        {/* 分类排行——服务端渲染，SEO友好 */}
        <div style={{marginTop:40}}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:'0.2em',color:'#e8c96a',fontWeight:700,marginBottom:16}}>🏆 分类排行（点击进入分类）</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))',gap:10}}>
            {categories.map(cat=>{
              const top5 = tools.filter(t=>t.category===cat.key).sort((a,b)=>b.rank-a.rank).slice(0,5)
              if(top5.length===0) return null
              return (
                <Link key={cat.key} href={`/tools?category=${encodeURIComponent(cat.key)}`}
                  className="card-cat"
                  style={{background:'rgba(255,255,255,0.03)',border:'1px solid #1a1a1a',borderRadius:12,padding:'16px 20px',display:'block',textDecoration:'none',transition:'all 0.3s'}}>
                  <h3 style={{fontSize:16,fontWeight:700,color:'#ddd',marginBottom:12,display:'flex',alignItems:'center',gap:8}}>
                    <span>{cat.icon}</span> {cat.label}
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:700,color:'#888',marginLeft:'auto'}}>{tools.filter(t=>t.category===cat.key).length}个</span>
                  </h3>
                  {top5.map((t,i)=>{
                    const avColors=["#c9a84c","silver","#CD7F32","#555","#555"]
                    return (
                      <Link key={t.id} href={t.url} target="_blank" rel="noopener noreferrer"
                        style={{display:'flex',alignItems:'center',gap:8,padding:'6px 0',textDecoration:'none',borderBottom:i<4?'1px solid #111':'none'}}>
                        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:700,color:avColors[i],width:24}}>#{i+1}</span>
                        <span style={{width:26,height:26,borderRadius:4,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:800,color:'#fff',background:avColors[i],flexShrink:0,fontFamily:"'JetBrains Mono',monospace"}}>{t.name[0].toUpperCase()}</span>
                        <span style={{fontSize:14,fontWeight:600,color:'#ddd',flex:1,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{t.name}</span>
                        <span style={{fontSize:12,fontWeight:700,color:isCN(t)?'#e8c96a':'#c9a84c',marginLeft:'auto'}}>{isCN(t)?'🇨🇳':'🌍'}</span>
                        <span style={{fontSize:12,color:'#aaa'}}>{t.pricing}</span>
                      </Link>
                    )
                  })}
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      <style>{`.card-cat:hover{background:rgba(201,168,76,0.06)!important;border-color:#7a6230!important}`}</style>
    </div>
  )
}
