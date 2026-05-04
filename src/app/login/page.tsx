"use client"

import { useState, useEffect } from "react"
import { getCurrentUser, getUserLevel, getNextLevel, XP_RULES, logout, User } from "@/data/user"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function LoginPage() {
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<User|null>(null)
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState<"phone"|"code"|"setName">("phone")
  const [phone, setPhone] = useState("")
  const [code, setCode] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [countdown, setCountdown] = useState(0)
  const [sending, setSending] = useState(false)

  useEffect(() => { setMounted(true); getCurrentUser().then(u => { setUser(u); setLoading(false) }).catch(()=>setLoading(false)) }, [])
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

  // 发送验证码
  const sendCode = async () => {
    if (!/^1[3-9]\d{9}$/.test(phone)) { setError("请输入正确的11位手机号"); return }
    setError(""); setSending(true)
    try {
      const res = await fetch("/api/sms", { method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      setCountdown(60); setStep("code")
    } catch { setError("网络错误，请重试") }
    finally { setSending(false) }
  }

  // 验证
  const verifyCode = async () => {
    if (code.length < 6) { setError("请输入6位验证码"); return }
    setError("")
    const res = await fetch("/api/sms", { method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, code })
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); return }
    setStep("setName")
  }

  // 注册/登录
  const completeLogin = async () => {
    if (!name.trim()) { setError("请输入昵称"); return }
    setError("")
    const email = `p_${phone}@xiaobaiai.cn`
    const password = `xiaobai_${phone}_2026`

    try {
      // 先试登录
      let { error } = await supabase.auth.signInWithPassword({ email, password })
      // 不存在就创建
      if (error) {
        const { error: signUpError } = await supabase.auth.signUp({ email, password,
          options: { data: { name } }
        })
        if (signUpError) { setError("注册失败"); return }
        // 等一秒确保用户创建
        await new Promise(r => setTimeout(r, 500))
        await supabase.auth.signInWithPassword({ email, password })
      }
      // 创建/更新 profile
      const { data: session } = await supabase.auth.getSession()
      if (session.session) {
        await supabase.from("profiles").upsert({
          id: session.session.user.id, name, email, xp: 0,
          joined_at: new Date().toISOString().slice(0, 10)
        }, { onConflict: "id" })
      }
      refresh()
    } catch { setError("登录失败，请重试") }
  }

  return (
    <div style={{background:'#000',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Noto Sans SC', sans-serif"}}>
      <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid #1a1a1a',padding:48,maxWidth:380,width:'100%'}}>
        <Link href="/" style={{display:'inline-flex',alignItems:'center',gap:6,fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700,color:'#aaa',textDecoration:'none',marginBottom:24}}>← 返回首页</Link>
        <div style={{textAlign:'center',marginBottom:32}}>
          <p style={{fontSize:32,marginBottom:12}}>🐣</p>
          <h2 style={{fontSize:20,fontWeight:700,color:'#fff',marginBottom:4}}>登录 / 注册</h2>
          <p style={{fontSize:12,color:'#555'}}>手机号验证，注册即登录</p>
        </div>

        <div style={{display:'flex',justifyContent:'center',gap:0,marginBottom:32}}>
          {["phone","code","setName"].map((s,i)=>(
            <div key={s} style={{display:'flex',alignItems:'center',gap:0}}>
              <div style={{width:28,height:28,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700,
                background:step===s?'rgba(201,168,76,0.15)':i<["phone","code","setName"].indexOf(step)?'rgba(201,168,76,0.05)':'transparent',
                color:step===s?'#c9a84c':i<["phone","code","setName"].indexOf(step)?'#7a6230':'#333',
                border:`1px solid ${step===s?'#7a6230':'#1a1a1a'}`}}>{i+1}</div>
              {i<2&&<div style={{width:24,height:1,background:'#1a1a1a'}} />}
            </div>
          ))}
        </div>

        {step==="phone"&&<div style={{display:'flex',flexDirection:'column',gap:16}}>
          <input type="tel" maxLength={11} value={phone} onChange={e=>{setPhone(e.target.value);setError("")}} placeholder="输入11位手机号" className="form-input" />
          {error&&<p style={{fontSize:11,color:'#D94841'}}>{error}</p>}
          <button onClick={sendCode} disabled={sending} className="btn-primary" style={{justifyContent:'center'}}>
            {sending ? "发送中..." : "获取验证码"}
          </button>
          <p style={{fontSize:9,color:'#444',textAlign:'center'}}>验证码有效5分钟 · 同一手机号1分钟限1条</p>
        </div>}

        {step==="code"&&<div style={{display:'flex',flexDirection:'column',gap:16}}>
          <p style={{fontSize:12,color:'#555',textAlign:'center'}}>验证码已发送至 {phone}</p>
          <input maxLength={6} value={code} onChange={e=>{setCode(e.target.value);setError("")}} placeholder="6位验证码" className="form-input" style={{textAlign:'center',letterSpacing:'4px',fontSize:18,fontWeight:700}} />
          {error&&<p style={{fontSize:11,color:'#D94841'}}>{error}</p>}
          <button onClick={verifyCode} className="btn-primary" style={{justifyContent:'center'}}>验证</button>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:11}}>
            <button onClick={()=>setStep("phone")} style={{background:'none',border:'none',color:'#555',cursor:'pointer'}}>← 换手机号</button>
            {countdown>0?<span style={{color:'#444'}}>{countdown}s</span>:<button onClick={sendCode} style={{background:'none',border:'none',color:'#c9a84c',cursor:'pointer'}}>重发</button>}
          </div>
        </div>}

        {step==="setName"&&<div style={{display:'flex',flexDirection:'column',gap:16}}>
          <p style={{fontSize:12,color:'#555',textAlign:'center'}}>✓ 验证通过！设置昵称</p>
          <input maxLength={12} value={name} onChange={e=>{setName(e.target.value);setError("")}} placeholder="你的昵称" className="form-input" />
          {error&&<p style={{fontSize:11,color:'#D94841'}}>{error}</p>}
          <button onClick={completeLogin} className="btn-primary" style={{justifyContent:'center'}}>开始探索</button>
        </div>}

        <p style={{fontSize:9,color:'#333',textAlign:'center',marginTop:20,fontFamily:"'JetBrains Mono',monospace"}}>限流：每IP每小时最多5条验证码</p>
      </div>
    </div>
  )
}
