"use client"

import { useState, useEffect } from "react"
import { getCurrentUser, getUserLevel } from "@/data/user"
import Link from "next/link"

const links = [
  { l: "工具导航", h: "/tools" },
  { l: "学习路径", h: "/learn" },
  { l: "AI 资讯", h: "/news" },
  { l: "社区", h: "/community" },
]

export function NavBar() {
  const [user, setUser] = useState<ReturnType<typeof getCurrentUser>>(null)

  useEffect(() => {
    setUser(getCurrentUser())
    const h = () => setUser(getCurrentUser())
    window.addEventListener("focus", h)
    window.addEventListener("storage", h)
    return () => { window.removeEventListener("focus", h); window.removeEventListener("storage", h) }
  }, [])

  const level = user ? getUserLevel(user.xp) : null

  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 60px", background: "rgba(0,0,0,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid #1a1a1a" }}
      className="max-sm:px-4">
      <Link href="/" style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.2em", color: "#c9a84c", fontFamily: "'JetBrains Mono', monospace", textDecoration: "none" }}>
        ← 小白AI
      </Link>
      <div style={{ display: "flex", gap: 28, alignItems: "center" }} className="max-sm:hidden">
        {links.map(x => (
          <Link key={x.l} href={x.h} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, color: "#aaa", textDecoration: "none", transition: "color 0.2s" }}>
            {x.l}
          </Link>
        ))}
        {user ? (
          <Link href="/login" style={{ display: "flex", alignItems: "center", gap: 6, textDecoration: "none", padding: "4px 12px", border: "1px solid #333", borderRadius: 8, transition: "0.2s" }}>
            <span style={{ fontSize: 16 }}>{level?.badge}</span>
            <span style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: 12, fontWeight: 700, color: "#ccc" }}>{user.name}</span>
          </Link>
        ) : (
          <Link href="/login" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: "#e8c96a", border: "1px solid #7a6230", padding: "6px 16px", borderRadius: 6, textDecoration: "none", transition: "0.2s" }}>
            登录
          </Link>
        )}
      </div>
    </nav>
  )
}
