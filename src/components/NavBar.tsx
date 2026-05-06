"use client"

import Link from "next/link"
import { Bot, Compass, GraduationCap, Home, MessageCircle, Newspaper, Search, Trophy, Users } from "lucide-react"
import { useAuth } from "@/lib/AuthContext"
import { getUserLevel } from "@/data/user"

const links = [
  { label: "小白爱学习", href: "/learn", icon: GraduationCap },
  { label: "工具", href: "/tools", icon: Compass },
  { label: "问AI", href: "/chat", icon: MessageCircle },
  { label: "选择器", href: "/choose-tool", icon: Search },
  { label: "成长舱", href: "/growth", icon: Trophy },
  { label: "资讯", href: "/news", icon: Newspaper },
  { label: "模型", href: "/models", icon: Bot },
  { label: "社区", href: "/community", icon: Users },
]

export function NavBar() {
  const { user } = useAuth()
  const level = user ? getUserLevel(user.xp) : null

  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, padding: "10px 24px", background: "rgba(0,0,0,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid #1a1a1a", overflowX: "auto", whiteSpace: "nowrap" }}>
      <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 900, letterSpacing: "0.08em", color: "#c9a84c", fontFamily: "'JetBrains Mono', monospace", textDecoration: "none", flexShrink: 0 }}>
        <Home size={15} />
        小白AI
      </Link>
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexShrink: 0 }}>
        {links.map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: "'Noto Sans SC', sans-serif", fontSize: 13, fontWeight: 800, color: "#ccc", textDecoration: "none", transition: "color 0.2s", whiteSpace: "nowrap" }}>
              <Icon size={14} style={{ color: "#7a6230" }} />
              {item.label}
            </Link>
          )
        })}
        {user ? (
          <Link href="/login" style={{ display: "flex", alignItems: "center", gap: 6, textDecoration: "none", padding: "4px 12px", border: "1px solid #333", borderRadius: 8, transition: "0.2s", flexShrink: 0 }}>
            <span style={{ fontSize: 16 }}>{level?.badge}</span>
            <span style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: 12, fontWeight: 800, color: "#ccc" }}>{user.name}</span>
          </Link>
        ) : (
          <Link href="/login" style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: 13, fontWeight: 800, color: "#e8c96a", border: "1px solid #7a6230", padding: "6px 14px", borderRadius: 6, textDecoration: "none", transition: "0.2s", flexShrink: 0 }}>
            登录
          </Link>
        )}
      </div>
    </nav>
  )
}
