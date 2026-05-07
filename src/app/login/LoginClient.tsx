"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/AuthContext"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Gift, MessageCircle, Timer, Trophy, Zap } from "lucide-react"

function timeoutMessage(stage: string) {
  return `${stage}响应超时，请检查网络后再试。`
}

async function withTimeout<T>(promise: Promise<T>, ms: number, stage: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout>
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(timeoutMessage(stage))), ms)
  })
  try {
    return await Promise.race([promise, timeout])
  } finally {
    clearTimeout(timer!)
  }
}

async function postAuth(payload: Record<string, string>) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 12000)
  try {
    return await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
  } catch (error: any) {
    if (error?.name === "AbortError") throw new Error(timeoutMessage("登录服务"))
    throw error
  } finally {
    clearTimeout(timer)
  }
}

export default function LoginPage() {
  const { user, setSession, logout: logoutSession } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/"
  const safeRedirect = redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : "/"
  const shouldRegisterFirst = searchParams.get("mode") === "register" || safeRedirect === "/growth" || safeRedirect === "/community/new"
  const [mode, setMode] = useState<"login" | "register">(() => shouldRegisterFirst ? "register" : "login")
  const [email, setEmail] = useState("")
  const [pwd, setPwd] = useState("")
  const [name, setName] = useState("")
  const [err, setErr] = useState("")
  const [notice, setNotice] = useState("")
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    setErr("")
    setNotice("")
  }, [mode])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr("")
    setNotice("")
    setBusy(true)
    try {
      if (mode === "register") {
        if (!name.trim()) {
          setErr("注册时请填写昵称，方便社区展示。")
          setBusy(false)
          return
        }
      }
      const res = await postAuth({ mode, email: email.trim(), password: pwd, name: name.trim() })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setErr(data.error || "登录服务暂时不可用，请稍后再试。")
        setBusy(false)
        return
      }
      if (!data?.session?.access_token || !data?.session?.refresh_token) {
        if (mode === "register") {
          setMode("login")
          setNotice("账号已经创建成功。请用刚才的邮箱和密码登录。")
          setBusy(false)
          return
        }
        setErr("登录服务没有返回完整会话，请稍后再试。")
        setBusy(false)
        return
      }
      await setSession({ user: data.user, session: data.session })
      router.push(safeRedirect)
    } catch (error: any) {
      setErr(error?.message || "网络连接不稳定，请稍后再试。")
    }
    setBusy(false)
  }

  const logout = async () => {
    await logoutSession()
    router.push("/")
  }

  if (user) return (
    <div style={{ background: "#000", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Noto Sans SC',sans-serif", padding: 20 }}>
      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1a1a1a", borderRadius: 14, padding: 42, maxWidth: 420, width: "100%", textAlign: "center" }}>
        <p style={{ fontSize: 36, marginBottom: 16 }}>小白AI</p>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 4 }}>{user.name}</h2>
        <p style={{ fontSize: 13, color: "#c9a84c", marginTop: 8 }}>已登录 · {user.xp} XP</p>
        <p style={{ fontSize: 12, color: "#777", marginTop: 8 }}>{user.email}</p>
        <div style={{ textAlign: "left", marginTop: 24, fontSize: 12, color: "#999", lineHeight: 2, background: "rgba(255,255,255,0.02)", border: "1px solid #1a1a1a", borderRadius: 10, padding: 18 }}>
          <p style={{ color: "#e8c96a", fontWeight: 800, marginBottom: 8, fontSize: 13 }}>账号可以做什么</p>
          <p>领取新手礼包、每日任务和在线经验</p>
          <p>发帖 +10XP，评论 +3XP，进入今日经验榜</p>
          <p>等级越高，社区身份越醒目，LV5 后优先展示</p>
        </div>
        <Link href={safeRedirect} className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 28, textDecoration: "none" }}>{safeRedirect === "/chat" ? "继续使用小白AI助手" : "继续访问"}</Link>
        <button onClick={logout} className="btn-outline" style={{ width: "100%", justifyContent: "center", marginTop: 10 }}>退出登录</button>
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
            {mode === "login" ? "已有账号请登录。第一次使用请先切换到注册，领 50XP 新手礼包。" : "注册后立即领取 50XP，新用户也能靠今日任务、发帖和评论冲榜。"}
          </p>
          {safeRedirect === "/chat" && (
            <p style={{ fontSize: 12, color: "#d6c28a", lineHeight: 1.7, marginTop: 10, border: "1px solid #2a1f10", background: "rgba(201,168,76,0.04)", borderRadius: 10, padding: "10px 12px" }}>
              登录后会自动回到小白AI助手页面。
            </p>
          )}
        </div>

        <div style={{ border: "1px solid #2a1f10", background: "rgba(201,168,76,0.045)", borderRadius: 12, padding: "14px 16px", marginBottom: 18 }}>
          <p style={{ color: "#fff", fontSize: 13, fontWeight: 950, marginBottom: 8 }}>注册后会解锁</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { icon: <Gift size={13} />, text: "新手礼包 50XP" },
              { icon: <Timer size={13} />, text: "挂机每天 60XP" },
              { icon: <MessageCircle size={13} />, text: "发帖评论涨经验" },
              { icon: <Trophy size={13} />, text: "今日榜每天清零" },
            ].map((item) => (
              <span key={item.text} style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#d6c28a", fontSize: 12, lineHeight: 1.5, border: "1px solid rgba(122,98,48,0.45)", borderRadius: 8, padding: "7px 9px", background: "rgba(0,0,0,0.22)" }}>
                <span style={{ color: "#e8c96a", display: "inline-flex", flexShrink: 0 }}>{item.icon}</span>{item.text}
              </span>
            ))}
          </div>
          <p style={{ color: "#9f8f62", fontSize: 11, lineHeight: 1.7, marginTop: 9 }}>
            LV5 后社区内容优先展示，等级徽章会出现在发帖和评论旁边。
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 22 }}>
          <button type="button" disabled={busy} onClick={() => setMode("login")} className={mode === "login" ? "btn-primary" : "btn-outline"} style={{ justifyContent: "center", opacity: busy ? 0.62 : 1 }}>登录</button>
          <button type="button" disabled={busy} onClick={() => setMode("register")} className={mode === "register" ? "btn-primary" : "btn-outline"} style={{ justifyContent: "center", opacity: busy ? 0.62 : 1 }}>注册领 50XP</button>
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
              <Zap size={13} style={{ display: "inline", verticalAlign: "-2px", marginRight: 4 }} />
              登录后会回到原页面。注册用户可以领礼包、做任务、发帖评论冲今日经验榜。
            </p>
          </div>

          {notice && <p style={{ fontSize: 12, color: "#8eeaf2", textAlign: "center", lineHeight: 1.7 }}>{notice}</p>}
          {err && <p style={{ fontSize: 12, color: "#D94841", textAlign: "center", lineHeight: 1.7 }}>{err}</p>}
          <button type="submit" disabled={busy} className="btn-primary" style={{ justifyContent: "center", opacity: busy ? 0.6 : 1 }}>
            {busy ? "请稍后..." : mode === "login" ? "登录" : "创建账号去领 50XP"}
          </button>
        </form>
      </div>
    </div>
  )
}
