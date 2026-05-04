"use client"

import { useState, useEffect } from "react"
import { loadSubmissions, updateSubmission, Submission } from "@/data/submissions"
import { addApprovedContribution, getContributor, getLevel } from "@/data/contributors"
import Link from "next/link"

export default function ModeratePage() {
  const [subs, setSubs] = useState<Submission[]>([])
  const [filter, setFilter] = useState<"all"|"pending"|"auto_rejected"|"approved"|"rejected">("pending")
  const refresh=()=>setSubs(loadSubmissions())
  useEffect(()=>{refresh()},[])

  const filtered = subs.filter(s=>filter==="all"||s.status===filter)
  const counts = {pending:subs.filter(s=>s.status==="pending").length,auto_rejected:subs.filter(s=>s.status==="auto_rejected").length,approved:subs.filter(s=>s.status==="approved").length}

  const handleApprove=(id:string)=>{
    const name=prompt("贡献者昵称：")?.trim();if(!name)return
    updateSubmission(id,{status:"approved"});addApprovedContribution(name);refresh()
    const c=getContributor(name);const l=getLevel(c?.approvedCount||1)
    alert(`✓ ${name} | ${l.badge} ${l.name} | ${c?.approvedCount}个通过`)
  }

  return (
    <div style={{background:'#000',minHeight:'100vh',fontFamily:"'Noto Sans SC', sans-serif",paddingBottom:100}}>
      <nav style={{position:'sticky',top:0,zIndex:50,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 60px',background:'rgba(0,0,0,0.9)',backdropFilter:'blur(12px)',borderBottom:'1px solid #1a1a1a'}} className="max-sm:px-6">
        <Link href="/" style={{fontSize:13,fontWeight:700,letterSpacing:'0.2em',color:'#c9a84c',fontFamily:"'JetBrains Mono', monospace",textDecoration:'none'}}>← 小白AI</Link>
        <button onClick={refresh} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'#555',background:'none',border:'1px solid #1a1a1a',padding:'6px 14px',cursor:'pointer'}}>REFRESH</button>
      </nav>

      <div style={{maxWidth:900,margin:'0 auto',padding:'60px 60px'}} className="max-sm:px-6">
        <p style={{fontFamily:"'JetBrains Mono', monospace",fontSize:10,letterSpacing:'0.4em',color:'#7a6230',textTransform:'uppercase',marginBottom:12}}>Moderation</p>
        <h1 style={{fontSize:32,fontWeight:900,color:'#fff',letterSpacing:'0.03em',marginBottom:8}}>审核后台</h1>
        <p style={{fontSize:13,color:'rgba(255,255,255,0.4)',marginBottom:40}}>初审自动过滤 · 管理员审核 · AI 打分</p>

        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:2,background:'#1a1a1a',border:'1px solid #1a1a1a',marginBottom:32}}>
          <div style={{background:'rgba(255,255,255,0.02)',padding:'20px',textAlign:'center'}}><p style={{fontSize:24,fontWeight:900,color:'#c9a84c',fontFamily:"'JetBrains Mono',monospace"}}>{subs.length}</p><p style={{fontSize:9,color:'#555',marginTop:4,fontFamily:"'JetBrains Mono',monospace",letterSpacing:'0.1em'}}>TOTAL</p></div>
          <div style={{background:'rgba(255,255,255,0.02)',padding:'20px',textAlign:'center'}}><p style={{fontSize:24,fontWeight:900,color:'#e8c96a',fontFamily:"'JetBrains Mono',monospace"}}>{counts.pending}</p><p style={{fontSize:9,color:'#555',marginTop:4,fontFamily:"'JetBrains Mono',monospace",letterSpacing:'0.1em'}}>PENDING</p></div>
          <div style={{background:'rgba(255,255,255,0.02)',padding:'20px',textAlign:'center'}}><p style={{fontSize:24,fontWeight:900,color:'#D94841',fontFamily:"'JetBrains Mono',monospace"}}>{counts.auto_rejected}</p><p style={{fontSize:9,color:'#555',marginTop:4,fontFamily:"'JetBrains Mono',monospace",letterSpacing:'0.1em'}}>REJECTED</p></div>
          <div style={{background:'rgba(255,255,255,0.02)',padding:'20px',textAlign:'center'}}><p style={{fontSize:24,fontWeight:900,color:'#3DA563',fontFamily:"'JetBrains Mono',monospace"}}>{counts.approved}</p><p style={{fontSize:9,color:'#555',marginTop:4,fontFamily:"'JetBrains Mono',monospace",letterSpacing:'0.1em'}}>APPROVED</p></div>
        </div>

        <div style={{display:'flex',gap:4,marginBottom:24,flexWrap:'wrap'}}>
          {(["all","pending","auto_rejected","approved","rejected"]as const).map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,padding:'4px 12px',border:`1px solid ${filter===f?'#7a6230':'#1a1a1a'}`,color:filter===f?'#c9a84c':'#555',background:'transparent',cursor:'pointer',transition:'0.2s'}}>{f==="all"?"ALL":f.toUpperCase()}</button>
          ))}
        </div>

        {filtered.length===0?(
          <div style={{textAlign:'center',padding:80,color:'#555'}}>No submissions</div>
        ):(
          <div style={{display:'flex',flexDirection:'column',gap:2,background:'#1a1a1a',border:'1px solid #1a1a1a'}}>
            {filtered.map(s=>(
              <div key={s.id} style={{background:'rgba(255,255,255,0.02)',padding:'24px',border:s.status==="auto_rejected"?'1px solid #2a1a1a':'undefined'}}>
                <div style={{display:'flex',gap:8,marginBottom:8,flexWrap:'wrap'}}>
                  <span className={`tag ${s.status==="pending"?"tag-gold":s.status==="auto_rejected"?"tag-red":s.status==="approved"?"tag-green":"tag-gray"}`}>{s.status==="pending"?"PENDING":s.status==="auto_rejected"?"REJECTED":s.status==="approved"?"APPROVED":"REJECTED"}</span>
                  <span className="tag tag-gray">{s.type==="tool"?"TOOL":"ARTICLE"}</span>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'#444'}}>{s.submittedAt}</span>
                </div>
                {s.type==="tool"?<>
                  <p style={{fontSize:14,fontWeight:700,color:'#fff'}}>{s.name} <span style={{fontSize:11,color:'#555',fontWeight:400}}>{s.url}</span></p>
                  <p style={{fontSize:12,color:'rgba(255,255,255,0.4)',marginTop:4}}>{s.description}</p>
                </>:<>
                  <p style={{fontSize:14,fontWeight:700,color:'#fff'}}>{s.title}</p>
                  <p style={{fontSize:12,color:'rgba(255,255,255,0.4)',marginTop:4}}>{s.summary}</p>
                </>}
                {s.autoRejectReason&&<p style={{fontSize:11,color:'#D94841',marginTop:8,padding:'8px 12px',background:'rgba(217,72,65,0.06)',border:'1px solid #2a1a1a'}}>{s.autoRejectReason}</p>}
                {s.status==="pending"&&<div style={{display:'flex',gap:8,marginTop:16}}>
                  <button onClick={()=>handleApprove(s.id)} className="btn-primary">✓ 通过</button>
                  <button onClick={()=>{const n=prompt("拒绝原因：");updateSubmission(s.id,{status:"rejected_by_admin",adminNote:n||undefined});refresh()}} className="btn-outline" style={{color:'#D94841',borderColor:'#3a1a1a'}}>✗ 拒绝</button>
                </div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
