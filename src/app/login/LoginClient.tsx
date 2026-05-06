"use client"

import { useState } from "react"
import { useAuth } from "@/lib/AuthContext"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function LoginPage() {
  const { user, refresh } = useAuth()
  const router = useRouter()
  const [mode, setMode] = useState<"login" | "register">("login")
  const [email, setEmail] = useState("")
  const [pwd, setPwd] = useState("")
  const [name, setName] = useState("")
  const [err, setErr] = useState("")
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr("")
    setBusy(true)
    try {
      if (mode === "register") {
        if (!name.trim()) {
          setErr("注册时请填写昵称，方便社区展示。")
          setBusy(false)
          return
        }
        const { error } = await supabase.auth.signUp({ email, password: pwd, options: { data: { name } } })
        if (error) {
          setErr(error.message.includes("already") ? "该邮箱已注册，请切换到登录。" : error.message)
          setBusy(false)
          return
        }
        await supabase.auth.signInWithPassword({ email, password: pwd })
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password: pwd })
        if (error) {
          setErr("邮箱或密码错误。第一次使用请切换到注册。")
          setBusy(false)
          return
        }
      }
      await refresh()
      router.push("/")
    } catch {
      setErr("网络错误，请稍后再试。")
    }
    setBusy(false)
  }

  const logout = async () => {
    await supabase.auth.signOut()
    await refresh()
    router.push("/")
  }

  if (user) return (
    <div style={{ background: "#000", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Noto Sans SC',sans-serif", padding: 20 }}>
      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1a1a1a", borderRadius: 14, padding: 42, maxWidth: 420, width: "100%", textAlign: "center" }}>
        <p style={{ fontSize: 36, marginBottom: 16 }}>小白AI</p>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 4 }}>{user.name}</h2>
        <p style={{ fontSize: 13, color: "#c9a84c", marginTop: 8 }}>已登录</p>
        <p style={{ fontSize: 12, color: "#777", marginTop: 8 }}>{user.email}</p>
        <div style={{ textAlign: "left", marginTop: 24, fontSize: 12, color: "#999", lineHeight: 2, background: "rgba(255,255,255,0.02)", border: "1px solid #1a1a1a", borderRadius: 10, padding: 18 }}>
          <p style={{ color: "#e8c96a", fontWeight: 800, marginBottom: 8, fontSize: 13 }}>账号可以做什么</p>
          <p>提交 AI 工具、资讯和社区案例</p>
          <p>后续同步收藏、学习进度和评论互动</p>
          <p>浏览文章、投稿和每日登录会用于成长等级</p>
        </div>
        <button onClick={logout} className="btn-outline" style={{ width: "100%", justifyContent: "center", marginTop: 28 }}>退出登录</button>
        <Link href="/" style={{ display: "block", marginTop: 16, fontSize: 12, color: "#777", textDecoration: "none" }}>返回首页</Link>
      </div>
    </div>
  )

  return (
    <div style={{ background: "#000", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Noto Sans SC',sans-serif", padding: 20 }}>
      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1a1a1a", borderRadius: 14, padding: 42, maxWidth: 440, width: "100%" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#aaa", textDecoration: "none", marginBottom: 28 }}>← 返回首页</Link>
        <div style={{ textAlign: "center", marginBottom: 26 }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: "#fff" }}>{mode === "login" ? "登录小白AI" : "注册小白AI"}</h2>
          <p style={{ fontSize: 13, color: "#aaa", marginTop: 8, lineHeight: 1.7 }}>
            {mode === "login" ? "已有账号请登录。第一次使用请先切换到注册。" : "注册后可以投稿、发帖，并在后续保存收藏和学习进度。"}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 22 }}>
          <button type="button" onClick={() => setMode("login")} className={mode === "login" ? "btn-primary" : "btn-outline"} style={{ justifyContent: "center" }}>登录</button>
          <button type="button" onClick={() => setMode("register")} className={mode === "register" ? "btn-primary" : "btn-outline"} style={{ justifyContent: "center" }}>注册</button>
        </div>

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {mode === "register" && (
            <label style={{ display: "block" }}>
              <span style={{ display: "block", fontSize: 12, color: "#aaa", marginBottom: 6 }}>昵称</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="用于社区展示，例如：AI小白" required className="form-input" />
            </label>
          )}
          <label style={{ display: "block" }}>
            <span style={{ display: "block", fontSize: 12, color: "#aaa", marginBottom: 6 }}>邮箱</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="用于登录和找回账号" required className="form-input" autoFocus />
          </label>
          <label style={{ display: "block" }}>
            <span style={{ display: "block", fontSize: 12, color: "#aaa", marginBottom: 6 }}>密码</span>
            <input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="至少 6 位，请不要使用常用弱密码" required minLength={6} className="form-input" />
          </label>

          <div style={{ background: "rgba(201,168,76,0.04)", border: "1px solid #2a1f10", borderRadius: 10, padding: "12px 14px" }}>
            <p style={{ fontSize: 12, color: "#d6c28a", lineHeight: 1.7 }}>
              当前使用邮箱 + 密码登录。手机号/验证码登录后续可以接入，届时会明确标注验证码用途和有效时间。
            </p>
          </div>

          {err && <p style={{ fontSize: 12, color: "#D94841", textAlign: "center" }}>{err}</p>}
          <button type="submit" disabled={busy} className="btn-primary" style={{ justifyContent: "center", opacity: busy ? 0.6 : 1 }}>
            {busy ? "请稍后..." : mode === "login" ? "登录" : "创建账号并登录"}
          </button>
        </form>
      </div>
    </div>
  )
}
