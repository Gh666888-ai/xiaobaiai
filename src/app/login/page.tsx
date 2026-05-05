"use client"

import { useState, useEffect, useRef } from "react"
import { getCurrentUser, getUserLevel, getNextLevel, logout, User } from "@/data/user"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function LoginPage() {
  const [m,setM]=useState(false);const [u,setU]=useState<User|null>(null);const [l,setL]=useState(true)
  const [tab,setTab]=useState<"phone"|"email">("phone")
  const [step,setStep]=useState<"input"|"code"|"setPwd">("input")
  const [phone,setPhone]=useState("");const [email,setEmail]=useState("");const [pwd,setPwd]=useState("");const [name,setName]=useState("")
  const [code,setCode]=useState("");const [sentCode,setSentCode]=useState("");const [cd,setCd]=useState(0)
  const [err,setErr]=useState("");const [busy,setBusy]=useState(false)
  const codeRefs=useRef<(HTMLInputElement|null)[]>([])

  useEffect(()=>{setM(true);getCurrentUser().then(x=>{setU(x);setL(false)}).catch(()=>setL(false))},[])
  useEffect(()=>{if(cd<=0)return;const t=setTimeout(()=>setCd(cd-1),1000);return()=>clearTimeout(t)},[cd])
  const rf=async()=>{const x=await getCurrentUser();setU(x)}

  if(!m||l)return<div style={{background:'#000',minHeight:'100vh'}}/>

  if(u){const lv=getUserLevel(u.xp);const nx=getNextLevel(u.xp)
    return <div style={{background:'#000',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Noto Sans SC',sans-serif"}}>
      <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid #1a1a1a',padding:48,maxWidth:380,width:'100%',textAlign:'center'}}>
        <p style={{fontSize:40,marginBottom:16}}>{lv.badge}</p><h2 style={{fontSize:18,fontWeight:700,color:'#fff'}}>{u.name}</h2>
        <p style={{fontSize:13,color:'#c9a84c',marginTop:8}}>{lv.name} · {u.xp} XP</p>
        <p style={{fontSize:11,color:'#555',marginTop:4}}>{u.email}</p>
        <button onClick={async()=>{await logout();rf()}} className="btn-outline" style={{width:'100%',justifyContent:'center',marginTop:32}}>退出登录</button>
        <Link href="/" style={{display:'block',marginTop:16,fontSize:11,color:'#555',textDecoration:'none'}}>← 返回首页</Link>
      </div></div>
  }

  const sendSMS=async()=>{
    if(!/^1[3-9]\d{9}$/.test(phone)){setErr("请输入正确的11位手机号");return}
    setErr("");setBusy(true)
    try{const r=await fetch("/api/sms",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({phone})})
      const d=await r.json();if(!r.ok){setErr(d.error);return}
      setSentCode(d.code);setCd(60);setStep("code")
      setTimeout(()=>codeRefs.current[0]?.focus(),100)
    }catch{setErr("网络错误")}finally{setBusy(false)}
  }

  const verifySMS=async()=>{
    if(code.length!==6){setErr("请输入6位验证码");return};setErr("");setBusy(true)
    const r=await fetch("/api/sms",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({phone,code})})
    const d=await r.json();if(!r.ok){setErr(d.error);setBusy(false);return}
    setStep("setPwd");setBusy(false)
  }

  const completePhone=async()=>{
    if(!name.trim()){setErr("请输入昵称");return}
    if(pwd.length<6){setErr("密码至少6位");return}
    setErr("");setBusy(true)
    const em=`p_${phone}@xiaobaiai.cn`
    try{
      let{error}=await supabase.auth.signInWithPassword({email:em,password:pwd})
      if(error){
        const{error:e2}=await supabase.auth.signUp({email:em,password:pwd,options:{data:{name}}})
        if(e2){setErr(e2.message.includes("already")?"该手机号已注册":e2.message);setBusy(false);return}
        await new Promise(r=>setTimeout(r,800))
        await supabase.auth.signInWithPassword({email:em,password:pwd})
      }
      const{data:s}=await supabase.auth.getSession()
      if(s.session)await supabase.from("profiles").upsert({id:s.session.user.id,name,email:em,xp:0,joined_at:new Date().toISOString().slice(0,10)},{onConflict:"id"})
      rf()
    }catch{setErr("网络错误")}
    setBusy(false)
  }

  const handleEmail=async(e:React.FormEvent)=>{
    e.preventDefault();setErr("");setBusy(true)
    try{
      const isReg=tab==="email"&&name.length>0
      if(isReg){
        if(!name.trim()){setErr("请输入昵称");setBusy(false);return}
        if(!email.includes("@")){setErr("请输入正确邮箱");setBusy(false);return}
        if(pwd.length<6){setErr("密码至少6位");setBusy(false);return}
        const{error}=await supabase.auth.signUp({email,password:pwd,options:{data:{name}}})
        if(error){setErr(error.message.includes("already")?"已注册，请直接登录":error.message);setBusy(false);return}
        await supabase.auth.signInWithPassword({email,password:pwd})
      }else{
        const{error}=await supabase.auth.signInWithPassword({email,password:pwd})
        if(error){setErr("邮箱或密码错误");setBusy(false);return}
      }
      const{data:s}=await supabase.auth.getSession()
      if(s.session)await supabase.from("profiles").upsert({id:s.session.user.id,name:name||email.split("@")[0],email,xp:0,joined_at:new Date().toISOString().slice(0,10)},{onConflict:"id"})
      rf()
    }catch{setErr("网络错误")}
    setBusy(false)
  }

  return <div style={{background:'#000',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Noto Sans SC',sans-serif"}}>
    <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid #1a1a1a',padding:'40px 48px',maxWidth:400,width:'100%'}}>
      <Link href="/" style={{display:'inline-flex',alignItems:'center',gap:6,fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700,color:'#aaa',textDecoration:'none',marginBottom:28}}>← 返回</Link>

      {/* Tab切换 */}
      <div style={{display:'flex',border:'1px solid #1a1a1a',borderRadius:8,overflow:'hidden',marginBottom:24}}>
        <button onClick={()=>{setTab("phone");setStep("input");setErr("")}} style={{flex:1,padding:'10px',fontSize:13,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",border:'none',cursor:'pointer',background:tab==="phone"?'rgba(201,168,76,0.08)':'transparent',color:tab==="phone"?'#e8c96a':'#555'}}>📱 手机号</button>
        <button onClick={()=>{setTab("email");setErr("")}} style={{flex:1,padding:'10px',fontSize:13,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",border:'none',borderLeft:'1px solid #1a1a1a',cursor:'pointer',background:tab==="email"?'rgba(201,168,76,0.08)':'transparent',color:tab==="email"?'#e8c96a':'#555'}}>📧 邮箱</button>
      </div>

      {/* 手机号登录 */}
      {tab==="phone"&&<>
        {/* 步骤条 */}
        <div style={{display:'flex',justifyContent:'center',gap:0,marginBottom:24}}>
          {["phone","code","setPwd"].map((s,i)=>(<div key={s} style={{display:'flex',alignItems:'center'}}>
            <div style={{width:26,height:26,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,
              background:step===s?'rgba(201,168,76,0.15)':i<["phone","code","setPwd"].indexOf(step)?'rgba(201,168,76,0.05)':'transparent',
              color:step===s?'#c9a84c':i<["phone","code","setPwd"].indexOf(step)?'#7a6230':'#333',
              border:`1px solid ${step===s?'#7a6230':'#1a1a1a'}`}}>{i+1}</div>
            {i<2&&<div style={{width:20,height:1,background:'#1a1a1a'}}/>}
          </div>))}
        </div>

        {step==="input"&&<div style={{display:'flex',flexDirection:'column',gap:14}}>
          <input type="tel" maxLength={11} value={phone} onChange={e=>{setPhone(e.target.value);setErr("")}} placeholder="输入手机号" className="form-input" autoFocus/>
          {err&&<p style={{fontSize:11,color:'#D94841',textAlign:'center'}}>{err}</p>}
          <button onClick={sendSMS} disabled={busy} className="btn-primary" style={{justifyContent:'center',opacity:busy?0.6:1}}>{busy?"发送中...":"获取验证码"}</button>
        </div>}

        {step==="code"&&<div style={{display:'flex',flexDirection:'column',gap:14}}>
          <p style={{fontSize:12,color:'#555',textAlign:'center'}}>验证码已发送至 {phone}</p>
          {sentCode&&<div style={{textAlign:'center',padding:'10px',background:'rgba(201,168,76,0.06)',border:'1px dashed #7a6230',borderRadius:8}}>
            <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:20,fontWeight:900,color:'#e8c96a',letterSpacing:'6px'}}>{sentCode}</p>
            <p style={{fontSize:9,color:'#7a6230',marginTop:4}}>演示模式 · 上线后替换为短信</p>
          </div>}
          <input ref={el=>codeRefs.current[0]=el} maxLength={6} value={code} onChange={e=>{if(e.target.value.length<=6){setCode(e.target.value);setErr("")}}} placeholder="输入6位验证码" className="form-input" style={{textAlign:'center',letterSpacing:'4px',fontSize:18,fontWeight:700}}/>
          {err&&<p style={{fontSize:11,color:'#D94841',textAlign:'center'}}>{err}</p>}
          <button onClick={verifySMS} disabled={busy} className="btn-primary" style={{justifyContent:'center',opacity:busy?0.6:1}}>{busy?"验证中...":"验证"}</button>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:11}}>
            <button onClick={()=>setStep("input")} style={{background:'none',border:'none',color:'#555',cursor:'pointer'}}>← 换号</button>
            {cd>0?<span style={{color:'#444'}}>{cd}s后重发</span>:<button onClick={sendSMS} style={{background:'none',border:'none',color:'#c9a84c',cursor:'pointer'}}>重发</button>}
          </div>
        </div>}

        {step==="setPwd"&&<div style={{display:'flex',flexDirection:'column',gap:14}}>
          <p style={{fontSize:12,color:'#555',textAlign:'center'}}>✓ 验证成功！设置密码和昵称</p>
          <input maxLength={12} value={name} onChange={e=>setName(e.target.value)} placeholder="你的昵称" className="form-input" autoFocus/>
          <input type="password" value={pwd} onChange={e=>setPwd(e.target.value)} placeholder="设置密码（至少6位）" className="form-input"/>
          {err&&<p style={{fontSize:11,color:'#D94841',textAlign:'center'}}>{err}</p>}
          <button onClick={completePhone} disabled={busy} className="btn-primary" style={{justifyContent:'center',opacity:busy?0.6:1}}>{busy?"注册中...":"完成注册"}</button>
          <p style={{fontSize:10,color:'#444',textAlign:'center'}}>以后直接验证码登录或密码登录皆可</p>
        </div>}
      </>}

      {/* 邮箱登录 */}
      {tab==="email"&&
        <form onSubmit={handleEmail} style={{display:'flex',flexDirection:'column',gap:14}}>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="邮箱地址" required className="form-input" autoFocus/>
          <input type="password" value={pwd} onChange={e=>setPwd(e.target.value)} placeholder="密码" required minLength={6} className="form-input"/>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="昵称（注册时填写，登录可跳过）" className="form-input"/>
          {err&&<p style={{fontSize:11,color:'#D94841',textAlign:'center'}}>{err}</p>}
          <button type="submit" disabled={busy} className="btn-primary" style={{justifyContent:'center',opacity:busy?0.6:1}}>{busy?"处理中...":name?"注册/登录":"登录"}</button>
          <p style={{fontSize:10,color:'#444',textAlign:'center'}}>填昵称=注册，不填=登录</p>
        </form>
      }
      <p style={{fontSize:9,color:'#333',textAlign:'center',marginTop:20}}>没有密码也能收个验证码</p>
    </div></div>
}
