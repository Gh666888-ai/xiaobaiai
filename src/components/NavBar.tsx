"use client"

import { useAuth } from "@/lib/AuthContext"
import { getUserLevel } from "@/data/user"
import Link from "next/link"

const links = [
  { l: "工具导航", h: "/tools" },
  { l: "模型排行", h: "/models" },
  { l: "技能库", h: "/skills" },
  { l: "学习路径", h: "/learn" },
  { l: "AI 资讯", h: "/news" },
  { l: "社区", h: "/community" },
  { l: "关于", h: "/about" },
]

export function NavBar() {
  const { user } = useAuth()
  const level = user ? getUserLevel(user.xp) : null

  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 24px", background: "rgba(0,0,0,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid #1a1a1a", overflowX:"auto",whiteSpace:"nowrap" }}>
      <Link href="/" style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.15em", color: "#c9a84c", fontFamily: "'JetBrains Mono', monospace", textDecoration: "none", flexShrink:0 }}>
        小白AI
      </Link>
      <div style={{ display: "flex", gap: 16, alignItems: "center", flexShrink:0 }}>
        {links.map(x => (
          <Link key={x.l} href={x.h} style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: 13, fontWeight: 700, color: "#ccc", textDecoration: "none", transition: "color 0.2s", whiteSpace:"nowrap" }}>
            {x.l}
          </Link>
        ))}
        {user ? (
          <Link href="/login" style={{ display: "flex", alignItems: "center", gap: 6, textDecoration: "none", padding: "4px 12px", border: "1px solid #333", borderRadius: 8, transition: "0.2s", flexShrink:0 }}>
            <span style={{ fontSize: 16 }}>{level?.badge}</span>
            <span style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: 12, fontWeight: 700, color: "#ccc" }}>{user.name}</span>
          </Link>
        ) : (
          <Link href="/login" style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: 13, fontWeight: 700, color: "#e8c96a", border: "1px solid #7a6230", padding: "6px 16px", borderRadius: 6, textDecoration: "none", transition: "0.2s", flexShrink:0 }}>
            登录
          </Link>
        )}
      </div>
    </nav>
  )
}
