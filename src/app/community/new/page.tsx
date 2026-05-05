"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"
import { useRouter } from "next/navigation"

export default function NewPostPage() {
  const router = useRouter()
  const [title,setTitle]=useState("");const [content,setContent]=useState("");const [cat,setCat]=useState("经验分享");const [tags,setTags]=useState("")
  const [author,setAuthor]=useState("");const [busy,setBusy]=useState(false);const [err,setErr]=useState("");const [done,setDone]=useState(false)

  useEffect(()=>{supabase.auth.getSession().then(({data})=>{if(data.session)setAuthor(data.session.user.email||"")})},[])

  const submit=async(e:React.FormEvent)=>{
    e.preventDefault();setErr("");setBusy(true)
    if(!title.trim()){setErr("请输入标题");setBusy(false);return}
    if(!content.trim()){setErr("请输入内容");setBusy(false);return}
    try{
      const name = author || "匿名"
      const {error} = await supabase.from("community_posts").insert({
        title,content,category:cat,
        tags:tags.split(",").map(t=>t.trim()).filter(Boolean),
        author_name:name,published_at:new Date().toISOString().slice(0,10),
        status:"pending"
      })
      if(error)throw error
      setDone(true)
    }catch(e:any){setErr(e.message||"发布失败")}
    setBusy(false)
  }

  if(done)return <div style={{background:'#000',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
    <div style={{textAlign:'center',maxWidth:400}}><p style={{fontSize:40,marginBottom:16}}>📝</p><h2 style={{fontSize:20,color:'#fff',marginBottom:8}}>发布成功，审核中</h2>
      <p style={{fontSize:13,color:'#888',marginBottom:24}}>你的帖子已提交，审核通过后将公开展示。</p>
      <button onClick={()=>router.push("/community")} className="btn-primary">返回社区</button></div></div>

  return <div style={{background:'#000',minHeight:'100vh',fontFamily:"'Noto Sans SC', sans-serif",position:'relative',overflow:'hidden'}}>
    <MathRain /><NavBar />
    <div style={{maxWidth:700,margin:'0 auto',padding:'60px 60px 100px',position:'relative',zIndex:10,background:'rgba(0,0,0,0.85)'}}>
      <h1 style={{fontSize:28,fontWeight:900,color:'#fff',marginBottom:32}}>发布帖子</h1>
      <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:16}}>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="帖子标题" className="form-input" autoFocus/>
        <div style={{display:'flex',gap:12}}>
          <select value={cat} onChange={e=>setCat(e.target.value)} className="form-input" style={{width:160,color:'#ccc'}}>
            {["经验分享","踩坑记录","全自动实战","AI分析","问题求助"].map(c=><option key={c} value={c}>{c}</option>)}
          </select>
          <input value={tags} onChange={e=>setTags(e.target.value)} placeholder="标签,逗号分隔" className="form-input" style={{flex:1}}/>
        </div>
        <textarea value={content} onChange={e=>setContent(e.target.value)} placeholder="帖子内容（支持换行）" rows={12} className="form-input"/>
        {err&&<p style={{fontSize:12,color:'#D94841'}}>{err}</p>}
        <button type="submit" disabled={busy} className="btn-primary" style={{justifyContent:'center'}}>{busy?"发布中...":"发布帖子"}</button>
      </form>
      <p style={{fontSize:11,color:'#555',textAlign:'center',marginTop:16}}>需先登录才能发布 · 审核后展示</p>
    </div></div>
}
