"use client"

import { useState, useEffect } from "react"
import { getCurrentUser, getUserLevel, getNextLevel, XP_RULES, logout, User } from "@/data/user"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function LoginPage() {
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<User|null>(null)
  const [loading, setLoading] = useState(true)
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")

  useEffect(() => { setMounted(true); getCurrentUser().then(u => { setUser(u); setLoading(false) }) }, [])
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError("")
    if (password.length < 6) { setError("密码至少6位"); return }

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setError(error.message.includes("Invalid") ? "邮箱或密码错误" : error.message); return }
    } else {
      if (!name.trim()) { setError("请输入昵称"); return }
      const { data, error } = await supabase.auth.signUp({ email, password,
        options: { data: { name } }
      })
      if (error) { setError(error.message.includes("already") ? "该邮箱已注册，请直接登录" : error.message); return }
      if (data.user) {
        await supabase.from("profiles").upsert({
          id: data.user.id, name, email, xp: 0, joined_at: new Date().toISOString().slice(0, 10)
        }, { onConflict: "id" })
      }
    }
    refresh()
  }

  return (
    <div style={{background:'#000',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Noto Sans SC', sans-serif"}}>
      <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid #1a1a1a',padding:48,maxWidth:380,width:'100%'}}>
        <Link href="/" style={{display:'inline-flex',alignItems:'center',gap:6,fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700,color:'#aaa',textDecoration:'none',marginBottom:24}}>← 返回首页</Link>
        <div style={{textAlign:'center',marginBottom:32}}>
          <p style={{fontSize:32,marginBottom:12}}>🐣</p>
          <h2 style={{fontSize:20,fontWeight:700,color:'#fff',marginBottom:4}}>{isLogin ? "登录" : "注册"}</h2>
          <p style={{fontSize:12,color:'#555'}}>{isLogin ? "登录后浏览文章赚经验" : "注册账号开始AI之旅"}</p>
        </div>

        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:16}}>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="邮箱地址" required className="form-input" />
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="密码（至少6位）" required minLength={6} className="form-input" />
          {!isLogin && <input value={name} onChange={e=>setName(e.target.value)} placeholder="你的昵称" required maxLength={12} className="form-input" />}
          {error && <p style={{fontSize:11,color:'#D94841'}}>{error}</p>}
          <button type="submit" className="btn-primary" style={{justifyContent:'center'}}>{isLogin ? "登录" : "注册"}</button>
        </form>

        <p style={{textAlign:'center',marginTop:16,fontSize:11}}>
          {isLogin ? "还没有账号？" : "已有账号？"}
          <button onClick={()=>{setIsLogin(!isLogin);setError("")}} style={{background:'none',border:'none',color:'#c9a84c',cursor:'pointer',fontSize:11}}>
            {isLogin ? "去注册" : "去登录"}
          </button>
        </p>
      </div>
    </div>
  )
}
