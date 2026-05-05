"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [ready,setReady]=useState(false)
  const [email,setEmail]=useState("");const [pwd,setPwd]=useState("");const [name,setName]=useState("")
  const [err,setErr]=useState("");const [busy,setBusy]=useState(false)

  useEffect(()=>{setReady(true)},[])

  // 检查是否已登录
  const [loggedIn,setLoggedIn]=useState(false)
  useEffect(()=>{
    if(!ready)return
    supabase.auth.getSession().then(({data})=>{
      if(data.session){setLoggedIn(true);setEmail(data.session.user.email||"")}
    })
  },[ready])

  const submit = async (e:React.FormEvent)=>{
    e.preventDefault();setErr("");setBusy(true)
    try{
      if(name.trim()){
        // 注册
        const{error}=await supabase.auth.signUp({email,password:pwd,options:{data:{name}}})
        if(error){setErr(error.message.includes("already")?"已注册，填昵称登录":error.message);setBusy(false);return}
        await supabase.auth.signInWithPassword({email,password:pwd})
      }else{
        // 登录
        const{error}=await supabase.auth.signInWithPassword({email,password:pwd})
        if(error){setErr("邮箱或密码错误");setBusy(false);return}
      }
      setLoggedIn(true)
      // 创建/更新 profile
      const {data:{session}} = await supabase.auth.getSession()
      if(session){
        await supabase.from("profiles").upsert({
          id:session.user.id, name:name||email.split("@")[0], email,
          xp:0, joined_at:new Date().toISOString().slice(0,10)
        },{onConflict:"id"}).select()
      }
    }catch{setErr("网络错误")}
    setBusy(false)
    setTimeout(()=>router.push("/"),500)
  }

  const doLogout=async()=>{await supabase.auth.signOut();setLoggedIn(false);setName("");setPwd("");router.push("/")}

  if(!ready)return<div style={{background:'#000',minHeight:'100vh'}}/>

  if(loggedIn)return(
    <div style={{background:'#000',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Noto Sans SC',sans-serif"}}>
      <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid #1a1a1a',padding:48,maxWidth:380,width:'100%',textAlign:'center'}}>
        <p style={{fontSize:40,marginBottom:16}}>🐣</p>
        <h2 style={{fontSize:18,fontWeight:700,color:'#fff'}}>{name||email}</h2>
        <p style={{fontSize:13,color:'#c9a84c',marginTop:8}}>已登录</p>
        <p style={{fontSize:11,color:'#555',marginTop:8}}>{email}</p>
        <div style={{textAlign:'left',marginTop:20,fontSize:11,color:'#888',lineHeight:2}}>
          <p style={{color:'#e8c96a',fontWeight:700,marginBottom:8,fontSize:12}}>🏆 等级规则</p>
          <p>🆕 游客 — 0 XP</p>
          <p>⭐ 铜星 — 100 XP</p>
          <p>🌟 银星 — 300 XP</p>
          <p>✨ 金星 — 1000 XP</p>
          <p>☀️ 太阳 — 3000 XP</p>
          <p>👑 皇冠 — 10000 XP</p>
          <p>🌈 至尊皇冠 — 30000 XP</p>
          <p style={{color:'#555',marginTop:8}}>浏览文章+5 · 提交内容+10 · 投稿通过+50 · 每日登录+3</p>
        </div>
        <button onClick={doLogout} className="btn-outline" style={{width:'100%',justifyContent:'center',marginTop:32}}>退出登录</button>
        <Link href="/" style={{display:'block',marginTop:16,fontSize:11,color:'#555',textDecoration:'none'}}>← 返回首页</Link>
      </div></div>
  )

  return (
    <div style={{background:'#000',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Noto Sans SC',sans-serif"}}>
      <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid #1a1a1a',padding:48,maxWidth:380,width:'100%'}}>
        <Link href="/" style={{display:'inline-flex',alignItems:'center',gap:6,fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700,color:'#aaa',textDecoration:'none',marginBottom:32}}>← 返回首页</Link>
        <div style={{textAlign:'center',marginBottom:28}}>
          <p style={{fontSize:36,marginBottom:8}}>🐣</p>
          <h2 style={{fontSize:20,fontWeight:700,color:'#fff'}}>登录 / 注册</h2>
          <p style={{fontSize:12,color:'#555',marginTop:4}}>填昵称=注册，不填=登录</p>
        </div>
        <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:14}}>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="邮箱地址" required className="form-input" autoFocus/>
          <input type="password" value={pwd} onChange={e=>setPwd(e.target.value)} placeholder="密码（至少6位）" required minLength={6} className="form-input"/>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="昵称（注册时填写）" maxLength={12} className="form-input"/>
          {err&&<p style={{fontSize:11,color:'#D94841',textAlign:'center'}}>{err}</p>}
          <button type="submit" disabled={busy} className="btn-primary" style={{justifyContent:'center'}}>
            {busy?"请稍后...":name?"注册并登录":"登录"}
          </button>
        </form>
      </div>
    </div>
  )
}
