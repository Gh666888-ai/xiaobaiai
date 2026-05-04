"use client"

import { useState, useEffect } from "react"
import { getCurrentUser, getUserLevel, getNextLevel, XP_RULES, logout, User } from "@/data/user"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function LoginPage() {
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<User|null>(null)
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState<"email"|"code"|"setPassword">("email")
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [countdown, setCountdown] = useState(0)

  useEffect(() => { setMounted(true); getCurrentUser().then(u => { setUser(u); setLoading(false) }) }, [])
  useEffect(() => { if(countdown<=0)return; const t=setTimeout(()=>setCountdown(countdown-1),1000); return ()=>clearTimeout(t) }, [countdown])
  const refresh = async () => { const u = await getCurrentUser(); setUser(u) }

  if (!mounted || loading) return <div style={{background:'#000',minHeight:'100vh'}} />

  if (user) {
    const lvl = getUserLevel(user.xp); const next = getNextLevel(user.xp)
    return (
      <div style={{background:'#000',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Noto Sans SC', sans-serif"}}>
        <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid #1a1a1a',padding:48,maxWidth:380,width:'100%',textAlign:'center'}}>
          <p style={{fontSize:40,marginBottom:16}}>{lvl.badge}</p>
          <h2 style={{fontSize:18,fontWeight:700,color:'#fff',marginBottom:4}}>{user.name}</h2>
          <p style={{fontSize:11,color:'#555',marginBottom:8}}>{user.email}</p>
          <p style={{fontSize:14,color:'#c9a84c'}}>{lvl.name} · {lvl.desc}</p>
          <div style={{background:'rgba(255,255,255,0.02)',padding:20,marginTop:24,textAlign:'left'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:8,fontSize:12}}>
              <span style={{color:'#555'}}>经验值</span><span style={{color:'#c9a84c',fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{user.xp} XP</span>
            </div>
            <div style={{height:3,background:'#1a1a1a',borderRadius:2}}><div style={{height:'100%',background:'#c9a84c',borderRadius:2,width:`${Math.min(100,(user.xp/(next?.level.minXP||1))*100)}%`}} /></div>
            {next&&<p style={{fontSize:10,color:'#555',marginTop:8}}>距离 {next.level.badge} 还需 {next.need} XP</p>}
          </div>
          <button onClick={async()=>{await logout();refresh()}} className="btn-outline" style={{width:'100%',justifyContent:'center',marginTop:24}}>退出登录</button>
        </div>
      </div>
    )
  }

  // 发送验证码到邮箱
  const sendCode = async () => {
    if (!email.includes("@") || !email.includes(".")) { setError("请输入正确邮箱"); return }
    setError(""); setCountdown(60)
    const { error } = await supabase.auth.signInWithOtp({ email,
      options: { shouldCreateUser: true }
    })
    if (error) { setError(error.message); return }
    setStep("code")
  }

  // 验证码验证
  const verifyCode = async () => {
    if (code.length < 6) { setError("请输入6位验证码"); return }
    setError("")
    const { error } = await supabase.auth.verifyOtp({ email, token: code, type: "email" })
    if (error) { setError("验证码错误或已过期"); return }
    setStep("setPassword")
  }

  // 设置密码和昵称
  const setupAccount = async () => {
    if (password.length < 6) { setError("密码至少6位"); return }
    if (!name.trim()) { setError("请输入昵称"); return }
    setError("")
    const { error } = await supabase.auth.updateUser({ password,
      data: { name }
    })
    if (error) { setError(error.message); return }
    // 创建 profile
    const { data: session } = await supabase.auth.getSession()
    const userId = session.session?.user.id
    if (userId) {
      await supabase.from("profiles").upsert({
        id: userId, name, email, xp: 0, joined_at: new Date().toISOString().slice(0, 10)
      }, { onConflict: "id" })
    }
    refresh()
  }

  return (
    <div style={{background:'#000',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Noto Sans SC', sans-serif"}}>
      <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid #1a1a1a',padding:48,maxWidth:380,width:'100%'}}>
        <Link href="/" style={{display:'inline-flex',alignItems:'center',gap:6,fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700,color:'#aaa',textDecoration:'none',marginBottom:24}}>← 返回首页</Link>
        <div style={{textAlign:'center',marginBottom:32}}>
          <p style={{fontSize:32,marginBottom:12}}>🐣</p>
          <h2 style={{fontSize:20,fontWeight:700,color:'#fff',marginBottom:4}}>登录 / 注册</h2>
          <p style={{fontSize:12,color:'#555'}}>输入邮箱，验证后设置密码</p>
        </div>

        {/* 步骤条 */}
        <div style={{display:'flex',justifyContent:'center',gap:0,marginBottom:32}}>
          {["email","code","setPassword"].map((s,i)=>(
            <div key={s} style={{display:'flex',alignItems:'center',gap:0}}>
              <div style={{width:28,height:28,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700,
                background:step===s?'rgba(201,168,76,0.15)':i<["email","code","setPassword"].indexOf(step)?'rgba(201,168,76,0.05)':'transparent',
                color:step===s?'#c9a84c':i<["email","code","setPassword"].indexOf(step)?'#7a6230':'#333',
                border:`1px solid ${step===s?'#7a6230':'#1a1a1a'}`}}>{i+1}</div>
              {i<2&&<div style={{width:24,height:1,background:'#1a1a1a'}} />}
            </div>
          ))}
        </div>

        {/* 步骤1: 输入邮箱 */}
        {step==="email"&&<div style={{display:'flex',flexDirection:'column',gap:16}}>
          <input type="email" value={email} onChange={e=>{setEmail(e.target.value);setError("")}} placeholder="输入邮箱地址" className="form-input" />
          {error&&<p style={{fontSize:11,color:'#D94841'}}>{error}</p>}
          <button onClick={sendCode} className="btn-primary" style={{justifyContent:'center'}}>发送验证码</button>
        </div>}

        {/* 步骤2: 输入验证码 */}
        {step==="code"&&<div style={{display:'flex',flexDirection:'column',gap:16}}>
          <p style={{fontSize:12,color:'#555',textAlign:'center'}}>验证码已发送至 {email}</p>
          <input maxLength={6} value={code} onChange={e=>{setCode(e.target.value);setError("")}} placeholder="6位验证码" className="form-input" style={{textAlign:'center',letterSpacing:'4px',fontSize:18,fontWeight:700}} />
          {error&&<p style={{fontSize:11,color:'#D94841'}}>{error}</p>}
          <button onClick={verifyCode} className="btn-primary" style={{justifyContent:'center'}}>验证</button>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:11}}>
            <button onClick={()=>setStep("email")} style={{background:'none',border:'none',color:'#555',cursor:'pointer'}}>← 换邮箱</button>
            {countdown>0?<span style={{color:'#444'}}>{countdown}s</span>:<button onClick={sendCode} style={{background:'none',border:'none',color:'#c9a84c',cursor:'pointer'}}>重发</button>}
          </div>
        </div>}

        {/* 步骤3: 设置密码和昵称 */}
        {step==="setPassword"&&<div style={{display:'flex',flexDirection:'column',gap:16}}>
          <p style={{fontSize:12,color:'#555',textAlign:'center'}}>✓ 邮箱验证通过！设置密码和昵称</p>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="设置密码（至少6位）" className="form-input" />
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="你的昵称" maxLength={12} className="form-input" />
          {error&&<p style={{fontSize:11,color:'#D94841'}}>{error}</p>}
          <button onClick={setupAccount} className="btn-primary" style={{justifyContent:'center'}}>完成注册</button>
        </div>}

        <p style={{fontSize:9,color:'#333',textAlign:'center',marginTop:20,fontFamily:"'JetBrains Mono',monospace"}}>验证码会发到你的邮箱，请查收收件箱</p>
      </div>
    </div>
  )
}
