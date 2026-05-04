"use client"

import { useState, useEffect } from "react"
import { login, getCurrentUser, getUserLevel, getNextLevel, XP_RULES, logout, User } from "@/data/user"
import Link from "next/link"

export default function LoginPage() {
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<User|null>(null)
  const [step, setStep] = useState<"phone"|"code"|"nickname">("phone")
  const [phone, setPhone] = useState("");const [code, setCode] = useState("");const [name, setName] = useState("")
  const [mockCode, setMockCode] = useState("");const [countdown, setCountdown] = useState(0)
  const [error, setError] = useState("")

  useEffect(()=>{setMounted(true);setUser(getCurrentUser())},[])
  useEffect(()=>{if(countdown<=0)return;const t=setTimeout(()=>setCountdown(countdown-1),1000);return()=>clearTimeout(t)},[countdown])
  const refresh=()=>setUser(getCurrentUser())

  if(!mounted) return <div style={{background:'#000',minHeight:'100vh'}} />

  if(user){
    const lvl = getUserLevel(user.xp);const next=getNextLevel(user.xp)
    return (
      <div style={{background:'#000',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Noto Sans SC', sans-serif"}}>
        <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid #1a1a1a',padding:48,maxWidth:380,width:'100%',textAlign:'center'}}>
          <p style={{fontSize:40,marginBottom:16}}>{lvl.badge}</p>
          <h2 style={{fontSize:18,fontWeight:700,color:'#fff',marginBottom:4}}>{user.name}</h2>
          <p style={{fontSize:11,color:'#555',marginBottom:8}}>{user.phone?user.phone.replace(/(\d{3})\d{4}(\d{4})/,"$1****$2"):""}</p>
          <p style={{fontSize:14,color:'#c9a84c'}}>{lvl.name} · {lvl.desc}</p>
          <div style={{background:'rgba(255,255,255,0.02)',padding:20,marginTop:24,textAlign:'left'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:8,fontSize:12}}>
              <span style={{color:'#555'}}>经验值</span><span style={{color:'#c9a84c',fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{user.xp} XP</span>
            </div>
            <div style={{height:3,background:'#1a1a1a',borderRadius:2}}>
              <div style={{height:'100%',background:'#c9a84c',borderRadius:2,width:`${Math.min(100,(user.xp/(next?.level.minXP||1))*100)}%`,transition:'width 0.5s'}} />
            </div>
            {next&&<p style={{fontSize:10,color:'#555',marginTop:8}}>距离 {next.level.badge} 还需 {next.need} XP</p>}
          </div>
          <div style={{textAlign:'left',marginTop:20}}>
            <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'#555',marginBottom:12,letterSpacing:'0.1em'}}>XP RULES</p>
            {Object.entries(XP_RULES).map(([k,v])=>{
              const lb:Record<string,string>={read_article:"浏览文章",submit_content:"提交内容",submission_approved:"投稿通过",daily_login:"每日登录"}
              return <div key={k} style={{display:'flex',justifyContent:'space-between',fontSize:11,marginBottom:6}}><span style={{color:'#555'}}>{lb[k]||k}</span><span style={{fontFamily:"'JetBrains Mono',monospace",color:'#c9a84c'}}>+{v}</span></div>
            })}
          </div>
          <button onClick={()=>{logout();refresh()}} className="btn-outline" style={{width:'100%',justifyContent:'center',marginTop:24}}>退出登录</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{background:'#000',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Noto Sans SC', sans-serif"}}>
      <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid #1a1a1a',padding:48,maxWidth:380,width:'100%'}}>
        <Link href="/" style={{display:'inline-flex',alignItems:'center',gap:6,fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700,color:'#aaa',textDecoration:'none',marginBottom:24,transition:'color 0.2s'}}>← 返回首页</Link>
        <div style={{textAlign:'center',marginBottom:32}}>
          <p style={{fontSize:32,marginBottom:12}}>🐣</p>
          <h2 style={{fontSize:20,fontWeight:700,color:'#fff',marginBottom:4}}>登录 小白AI</h2>
          <p style={{fontSize:12,color:'#555'}}>手机号登录，赚经验升等级</p>
        </div>

        {/* 步骤条 */}
        <div style={{display:'flex',justifyContent:'center',gap:0,marginBottom:32}}>
          {["phone","code","nickname"].map((s,i)=>(
            <div key={s} style={{display:'flex',alignItems:'center',gap:0}}>
              <div style={{width:28,height:28,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700,
                background:step===s?'rgba(201,168,76,0.15)':i<["phone","code","nickname"].indexOf(step)?'rgba(201,168,76,0.05)':'transparent',
                color:step===s?'#c9a84c':i<["phone","code","nickname"].indexOf(step)?'#7a6230':'#333',
                border:`1px solid ${step===s?'#7a6230':'#1a1a1a'}`
              }}>{i+1}</div>
              {i<2&&<div style={{width:24,height:1,background:'#1a1a1a'}} />}
            </div>
          ))}
        </div>

        {step==="phone"&&<div style={{display:'flex',flexDirection:'column',gap:16}}>
          <input type="tel" maxLength={11} value={phone} onChange={e=>{setPhone(e.target.value);setError("")}} placeholder="输入11位手机号" className="form-input" />
          {error&&<p style={{fontSize:11,color:'#D94841'}}>{error}</p>}
          <button onClick={()=>{if(!/^1[3-9]\d{9}$/.test(phone)){setError("请输入正确手机号");return}setError("");const c=String(Math.floor(100000+Math.random()*900000));setMockCode(c);setCountdown(60);setStep("code");alert(`验证码：${c}`)}}
            className="btn-primary" style={{justifyContent:'center'}}>获取验证码</button>
        </div>}

        {step==="code"&&<div style={{display:'flex',flexDirection:'column',gap:16}}>
          <p style={{fontSize:12,color:'#555',textAlign:'center'}}>验证码已发送至 {phone}</p>
          <input maxLength={6} value={code} onChange={e=>{setCode(e.target.value);setError("")}} placeholder="6位验证码" className="form-input" style={{textAlign:'center',letterSpacing:'4px',fontSize:18,fontWeight:700}} />
          {error&&<p style={{fontSize:11,color:'#D94841'}}>{error}</p>}
          <button onClick={()=>{if(code!==mockCode){setError("验证码错误");return}setError("");setStep("nickname")}}
            className="btn-primary" style={{justifyContent:'center'}}>验证</button>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:11}}>
            <button onClick={()=>setStep("phone")} style={{background:'none',border:'none',color:'#555',cursor:'pointer'}}>← 换手机号</button>
            {countdown>0?<span style={{color:'#444'}}>{countdown}s</span>:<button onClick={()=>{const c=String(Math.floor(100000+Math.random()*900000));setMockCode(c);setCountdown(60);alert(`验证码：${c}`)}} style={{background:'none',border:'none',color:'#c9a84c',cursor:'pointer'}}>重发</button>}
          </div>
        </div>}

        {step==="nickname"&&<div style={{display:'flex',flexDirection:'column',gap:16}}>
          <p style={{fontSize:12,color:'#555',textAlign:'center'}}>✓ 验证通过！取个昵称</p>
          <input maxLength={12} value={name} onChange={e=>{setName(e.target.value);setError("")}} placeholder="起一个昵称" className="form-input" />
          {error&&<p style={{fontSize:11,color:'#D94841'}}>{error}</p>}
          <button onClick={()=>{try{login(phone,name);refresh()}catch(e:any){setError(e.message)}}}
            className="btn-primary" style={{justifyContent:'center'}}>开始探索</button>
        </div>}
        <p style={{fontSize:9,color:'#333',textAlign:'center',marginTop:16,fontFamily:"'JetBrains Mono',monospace"}}>演示模式 · 验证码弹窗显示</p>
      </div>
    </div>
  )
}
