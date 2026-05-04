"use client"

import { useState, useEffect } from "react"
import { getCurrentUser, getUserLevel, getNextLevel, XP_RULES, logout, User } from "@/data/user"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function LoginPage() {
  const [m,setM]=useState(false);const [u,setU]=useState<User|null>(null);const [l,setL]=useState(true)
  const [mode,setMode]=useState<"sms"|"password">("sms") // sms验证码 or 直接密码
  const [step,setStep]=useState<"phone"|"code"|"setPwd">("phone")
  const [phone,setPhone]=useState("");const [code,setCode]=useState("");const [pwd,setPwd]=useState("");const [name,setName]=useState("")
  const [err,setErr]=useState("");const [cd,setCd]=useState(0);const [sending,setSending]=useState(false)

  useEffect(()=>{setM(true);getCurrentUser().then(x=>{setU(x);setL(false)}).catch(()=>setL(false))},[])
  useEffect(()=>{if(cd<=0)return;const t=setTimeout(()=>setCd(cd-1),1000);return()=>clearTimeout(t)},[cd])
  const rf=async()=>{const x=await getCurrentUser();setU(x)}

  if(!m||l)return<div style={{background:'#000',minHeight:'100vh'}}/>

  if(u){const lv=getUserLevel(u.xp);const nx=getNextLevel(u.xp)
    return <div style={{background:'#000',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Noto Sans SC',sans-serif"}}>
      <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid #1a1a1a',padding:48,maxWidth:380,width:'100%',textAlign:'center'}}>
        <p style={{fontSize:40,marginBottom:16}}>{lv.badge}</p><h2 style={{fontSize:18,fontWeight:700,color:'#fff',marginBottom:4}}>{u.name}</h2>
        <p style={{fontSize:11,color:'#555',marginBottom:8}}>{u.email}</p><p style={{fontSize:14,color:'#c9a84c'}}>{lv.name}·{lv.desc}</p>
        <div style={{background:'rgba(255,255,255,0.02)',padding:20,marginTop:24,textAlign:'left'}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:8,fontSize:12}}><span style={{color:'#555'}}>经验值</span><span style={{color:'#c9a84c',fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{u.xp}XP</span></div>
          <div style={{height:3,background:'#1a1a1a',borderRadius:2}}><div style={{height:'100%',background:'#c9a84c',borderRadius:2,width:`${Math.min(100,(u.xp/(nx?.level.minXP||1))*100)}%`}}/></div>
          {nx&&<p style={{fontSize:10,color:'#555',marginTop:8}}>距离{nx.level.badge}还需{nx.need}XP</p>}
        </div>
        <button onClick={async()=>{await logout();rf()}} className="btn-outline" style={{width:'100%',justifyContent:'center',marginTop:24}}>退出登录</button>
      </div></div>
  }

  const sendCode=async()=>{if(!/^1[3-9]\d{9}$/.test(phone)){setErr("请输入正确手机号");return};setErr("");setSending(true)
    try{const r=await fetch("/api/sms",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({phone})})
      const d=await r.json();if(!r.ok){setErr(d.error);return};alert(`📱验证码：${d.code}`);setCd(60);setStep("code")}
    catch{setErr("网络错误")}finally{setSending(false)}}

  const verifyCode=async()=>{if(code.length<6){setErr("请输入验证码");return};setErr("")
    const r=await fetch("/api/sms",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({phone,code})})
    const d=await r.json();if(!r.ok){setErr(d.error);return};setStep("setPwd")}

  const complete=async()=>{
    if(!name.trim()){setErr("请输入昵称");return};if(pwd.length<6){setErr("密码至少6位");return};setErr("")
    const email=`p_${phone}@xiaobaiai.cn`
    try{let{error}=await supabase.auth.signInWithPassword({email,password:pwd})
      if(error){const{error:e2}=await supabase.auth.signUp({email,password:pwd,options:{data:{name}}})
        if(e2){setErr(e2.message.includes("already")?"该手机号已注册":e2.message);return}
        await new Promise(r=>setTimeout(r,500))
        await supabase.auth.signInWithPassword({email,password:pwd})}
      const{data:s}=await supabase.auth.getSession()
      if(s.session)await supabase.from("profiles").upsert({id:s.session.user.id,name,email,xp:0,joined_at:new Date().toISOString().slice(0,10)},{onConflict:"id"})
      rf()}catch{setErr("操作失败")}}

  const loginPwd=async()=>{
    if(!/^1[3-9]\d{9}$/.test(phone)){setErr("请输入正确手机号");return};if(pwd.length<6){setErr("密码至少6位");return};setErr("")
    const email=`p_${phone}@xiaobaiai.cn`
    const{error}=await supabase.auth.signInWithPassword({email,password:pwd})
    if(error){setErr("手机号或密码错误");return};rf()}

  return <div style={{background:'#000',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Noto Sans SC',sans-serif"}}>
    <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid #1a1a1a',padding:48,maxWidth:380,width:'100%'}}>
      <Link href="/" style={{display:'inline-flex',alignItems:'center',gap:6,fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700,color:'#aaa',textDecoration:'none',marginBottom:24}}>← 返回首页</Link>
      <div style={{textAlign:'center',marginBottom:32}}><p style={{fontSize:32,marginBottom:12}}>🐣</p><h2 style={{fontSize:20,fontWeight:700,color:'#fff'}}>登录/注册</h2></div>

      {/* 切换登录方式 */}
      <div style={{display:'flex',border:'1px solid #1a1a1a',marginBottom:24,borderRadius:8,overflow:'hidden'}}>
        <button onClick={()=>{setMode("sms");setStep("phone");setErr("")}} style={{flex:1,textAlign:'center',padding:'10px',fontSize:12,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",border:'none',cursor:'pointer',background:mode==="sms"?'rgba(201,168,76,0.08)':'transparent',color:mode==="sms"?'#e8c96a':'#555'}}>验证码</button>
        <button onClick={()=>{setMode("password");setStep("phone");setErr("")}} style={{flex:1,textAlign:'center',padding:'10px',fontSize:12,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",border:'none',borderLeft:'1px solid #1a1a1a',cursor:'pointer',background:mode==="password"?'rgba(201,168,76,0.08)':'transparent',color:mode==="password"?'#e8c96a':'#555'}}>密码</button>
      </div>

      {mode==="password"&&<div style={{display:'flex',flexDirection:'column',gap:16}}>
        <input type="tel" maxLength={11} value={phone} onChange={e=>setPhone(e.target.value)} placeholder="手机号" className="form-input"/>
        <input type="password" value={pwd} onChange={e=>setPwd(e.target.value)} placeholder="密码" className="form-input"/>
        {err&&<p style={{fontSize:11,color:'#D94841'}}>{err}</p>}
        <button onClick={loginPwd} className="btn-primary" style={{justifyContent:'center'}}>登录</button>
        <p style={{fontSize:11,color:'#555',textAlign:'center'}}>新用户？切换到验证码模式注册</p>
      </div>}

      {mode==="sms"&&<>
        <div style={{display:'flex',justifyContent:'center',gap:0,marginBottom:24}}>
          {["phone","code","setPwd"].map((s,i)=>(
            <div key={s} style={{display:'flex',alignItems:'center'}}>
              <div style={{width:26,height:26,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,background:step===s?'rgba(201,168,76,0.15)':i<["phone","code","setPwd"].indexOf(step)?'rgba(201,168,76,0.05)':'transparent',color:step===s?'#c9a84c':i<["phone","code","setPwd"].indexOf(step)?'#7a6230':'#333',border:`1px solid ${step===s?'#7a6230':'#1a1a1a'}`}}>{i+1}</div>
              {i<2&&<div style={{width:20,height:1,background:'#1a1a1a'}}/>}
            </div>))}
        </div>
        {step==="phone"&&<div style={{display:'flex',flexDirection:'column',gap:16}}>
          <input type="tel" maxLength={11} value={phone} onChange={e=>{setPhone(e.target.value);setErr("")}} placeholder="手机号" className="form-input"/>
          {err&&<p style={{fontSize:11,color:'#D94841'}}>{err}</p>}
          <button onClick={sendCode} disabled={sending} className="btn-primary" style={{justifyContent:'center'}}>{sending?"发送中...":"获取验证码"}</button>
        </div>}
        {step==="code"&&<div style={{display:'flex',flexDirection:'column',gap:16}}>
          <p style={{fontSize:12,color:'#555',textAlign:'center'}}>已发送至{phone}</p>
          <input maxLength={6} value={code} onChange={e=>{setCode(e.target.value);setErr("")}} placeholder="6位验证码" className="form-input" style={{textAlign:'center',letterSpacing:'4px',fontSize:18,fontWeight:700}}/>
          {err&&<p style={{fontSize:11,color:'#D94841'}}>{err}</p>}
          <button onClick={verifyCode} className="btn-primary" style={{justifyContent:'center'}}>验证</button>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:11}}>
            <button onClick={()=>setStep("phone")} style={{background:'none',border:'none',color:'#555',cursor:'pointer'}}>←换号</button>
            {cd>0?<span style={{color:'#444'}}>{cd}s</span>:<button onClick={sendCode} style={{background:'none',border:'none',color:'#c9a84c',cursor:'pointer'}}>重发</button>}
          </div>
        </div>}
        {step==="setPwd"&&<div style={{display:'flex',flexDirection:'column',gap:16}}>
          <p style={{fontSize:12,color:'#555',textAlign:'center'}}>✓设置密码和昵称</p>
          <input maxLength={12} value={name} onChange={e=>setName(e.target.value)} placeholder="昵称" className="form-input"/>
          <input type="password" value={pwd} onChange={e=>setPwd(e.target.value)} placeholder="设置密码(至少6位)" className="form-input"/>
          {err&&<p style={{fontSize:11,color:'#D94841'}}>{err}</p>}
          <button onClick={complete} className="btn-primary" style={{justifyContent:'center'}}>完成注册</button>
        </div>}
      </>}
      <p style={{fontSize:9,color:'#333',textAlign:'center',marginTop:16}}>先用验证码注册设置密码，以后直接密码登录</p>
    </div></div>
}
