"use client"

import { useState } from "react"
import { ToolCategory, categories } from "@/data/tools"
import { NewsCategory, newsCategories } from "@/data/news"
import { addSubmission, Submission } from "@/data/submissions"
import Link from "next/link"

export default function ContributePage() {
  const [type, setType] = useState<"tool"|"news">("tool")
  const [done, setDone] = useState(false)
  const [result, setResult] = useState<Submission|null>(null)
  const [nick, setNick] = useState("")
  const [tName,setTName]=useState("");const [tUrl,setTUrl]=useState("");const [tDesc,setTDesc]=useState("")
  const [tCat,setTCat]=useState<ToolCategory>("对话AI")
  const [nTitle,setNTitle]=useState("");const [nUrl,setNUrl]=useState("");const [nSum,setNSum]=useState("")
  const [nCat,setNCat]=useState<NewsCategory>("教程资源")

  const submit = (e:React.FormEvent) => {
    e.preventDefault()
    const r = addSubmission(type==="tool"?{
      id:`${nick||"anon"}-${Date.now()}`,type:"tool",name:tName,url:tUrl,description:tDesc,category:tCat,submittedAt:new Date().toISOString().slice(0,10),status:"pending"
    }:{
      id:`${nick||"anon"}-${Date.now()}`,type:"news",title:nTitle,url:nUrl,summary:nSum,category:nCat,submittedAt:new Date().toISOString().slice(0,10),status:"pending"
    })
    setResult(r);setDone(true)
  }

  const reset = () => { setDone(false);setResult(null);setNick("");setTName("");setTUrl("");setTDesc("");setNTitle("");setNUrl("");setNSum("") }

  if(done && result) return (
    <div style={{background:'#000',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{textAlign:'center',padding:48,background:'rgba(255,255,255,0.02)',border:'1px solid #1a1a1a',maxWidth:400}}>
        <p style={{fontSize:32,marginBottom:16}}>{result.status==="pending"?"✓":"✗"}</p>
        <h2 style={{fontSize:18,fontWeight:700,color:'#fff',marginBottom:8}}>{result.status==="pending"?"初审通过" : "初审未通过"}</h2>
        <p style={{fontSize:13,color:'rgba(255,255,255,0.4)',marginBottom:24}}>{result.status==="pending"?"已进入审核队列":result.autoRejectReason}</p>
        <button onClick={reset} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:'#c9a84c',border:'1px solid #7a6230',padding:'8px 20px',background:'transparent',cursor:'pointer'}}>继续提交</button>
      </div>
    </div>
  )

  return (
    <div style={{background:'#000',minHeight:'100vh',fontFamily:"'Noto Sans SC', sans-serif",paddingBottom:100}}>
      <nav style={{position:'sticky',top:0,zIndex:50,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 60px',background:'rgba(0,0,0,0.9)',backdropFilter:'blur(12px)',borderBottom:'1px solid #1a1a1a'}} className="max-sm:px-6">
        <Link href="/" style={{fontSize:13,fontWeight:700,letterSpacing:'0.2em',color:'#c9a84c',fontFamily:"'JetBrains Mono', monospace",textDecoration:'none'}}>← 小白AI</Link>
        <div style={{display:'flex',gap:32}} className="max-sm:hidden">
          {[{l:'工具导航',h:'/tools'},{l:'学习路径',h:'/learn'},{l:'AI资讯',h:'/news'},{l:'登录',h:'/login'}].map(x=>(
            <Link key={x.l} href={x.h} style={{fontFamily:"'JetBrains Mono', monospace",fontSize:11,letterSpacing:'0.1em',color:'rgba(255,255,255,0.4)',textDecoration:'none',transition:'color 0.2s'}}>{x.l}</Link>
          ))}
        </div>
      </nav>

      <div style={{maxWidth:500,margin:'0 auto',padding:'60px 60px'}} className="max-sm:px-6">
        <p style={{fontFamily:"'JetBrains Mono', monospace",fontSize:10,letterSpacing:'0.4em',color:'#7a6230',textTransform:'uppercase',marginBottom:12}}>Contribute</p>
        <h1 style={{fontSize:32,fontWeight:900,color:'#fff',letterSpacing:'0.03em',marginBottom:8}}>贡献内容</h1>
        <p style={{fontSize:13,color:'rgba(255,255,255,0.4)',marginBottom:40}}>提交工具或资讯，通过审核后计入贡献等级</p>

        <div style={{display:'flex',marginBottom:32,border:'1px solid #1a1a1a'}}>
          <button onClick={()=>setType("tool")} style={{flex:1,padding:'12px',fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:'0.15em',cursor:'pointer',border:'none',background:type==="tool"?'rgba(201,168,76,0.08)':'transparent',color:type==="tool"?'#c9a84c':'#555',transition:'0.2s'}}>TOOL</button>
          <button onClick={()=>setType("news")} style={{flex:1,padding:'12px',fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:'0.15em',cursor:'pointer',border:'none',borderLeft:'1px solid #1a1a1a',background:type==="news"?'rgba(201,168,76,0.08)':'transparent',color:type==="news"?'#c9a84c':'#555',transition:'0.2s'}}>ARTICLE</button>
        </div>

        <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:20}}>
          <label><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'0.15em',color:'#555',display:'block',marginBottom:6}}>昵称 *</span>
            <input value={nick} onChange={e=>setNick(e.target.value)} placeholder="你的昵称" required className="form-input" /></label>

          {type==="tool"?<>
            <label><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'0.15em',color:'#555',display:'block',marginBottom:6}}>工具名称 *</span>
              <input value={tName} onChange={e=>setTName(e.target.value)} placeholder="工具名称" required className="form-input" /></label>
            <label><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'0.15em',color:'#555',display:'block',marginBottom:6}}>官网地址 *</span>
              <input value={tUrl} onChange={e=>setTUrl(e.target.value)} placeholder="https://" required className="form-input" /></label>
            <label><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'0.15em',color:'#555',display:'block',marginBottom:6}}>描述 *</span>
              <textarea value={tDesc} onChange={e=>setTDesc(e.target.value)} placeholder="这个工具能做什么..." rows={3} required className="form-input" /></label>
            <label><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'0.15em',color:'#555',display:'block',marginBottom:6}}>分类</span>
              <select value={tCat} onChange={e=>setTCat(e.target.value as ToolCategory)} className="form-input" style={{color:'#ccc'}}>
                {categories.map(c=><option key={c.key} value={c.key} style={{background:'#111'}}>{c.label}</option>)}</select></label>
          </>:<>
            <label><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'0.15em',color:'#555',display:'block',marginBottom:6}}>标题 *</span>
              <input value={nTitle} onChange={e=>setNTitle(e.target.value)} placeholder="文章标题" required className="form-input" /></label>
            <label><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'0.15em',color:'#555',display:'block',marginBottom:6}}>链接</span>
              <input value={nUrl} onChange={e=>setNUrl(e.target.value)} placeholder="https://" className="form-input" /></label>
            <label><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'0.15em',color:'#555',display:'block',marginBottom:6}}>摘要 *</span>
              <textarea value={nSum} onChange={e=>setNSum(e.target.value)} placeholder="内容摘要..." rows={4} required className="form-input" /></label>
            <label><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'0.15em',color:'#555',display:'block',marginBottom:6}}>类别</span>
              <select value={nCat} onChange={e=>setNCat(e.target.value as NewsCategory)} className="form-input" style={{color:'#ccc'}}>
                {newsCategories.map(c=><option key={c.key} value={c.key} style={{background:'#111'}}>{c.label}</option>)}</select></label>
          </>}

          <button type="submit" className="btn-primary" style={{justifyContent:'center'}}>提交</button>
        </form>
        <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'#444',textAlign:'center',marginTop:24,letterSpacing:'0.1em'}}>提交后经初审+管理员审核</p>
      </div>
    </div>
  )
}
