"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Bot, Compass, GraduationCap, Menu, Newspaper, Search, Trophy, Users, Workflow, X } from "lucide-react"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/AuthContext"
import { LevelBadge } from "@/components/LevelBadge"
import { XiaobaiLogo } from "@/components/XiaobaiLogo"

const links = [
  { label: "小白爱学习", href: "/learn", icon: GraduationCap },
  { label: "工具", href: "/tools", icon: Compass },
  { label: "选择器", href: "/choose-tool", icon: Search },
  { label: "工作流", href: "/workflows", icon: Workflow },
  { label: "成长舱", href: "/growth", icon: Trophy },
  { label: "资讯", href: "/news", icon: Newspaper },
  { label: "模型", href: "/models", icon: Bot },
  { label: "社区", href: "/community", icon: Users },
]

export function NavBar() {
  const { user } = useAuth()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <nav className="site-nav">
      <div className="site-nav-row">
        <Link href="/" aria-label="小白AI 首页" className="site-brand">
          <XiaobaiLogo />
        </Link>

        <div className="site-nav-links">
          {links.map((item) => {
            const Icon = item.icon
            const active = pathname === item.href || pathname?.startsWith(`${item.href}/`)
            return (
              <Link key={item.href} href={item.href} className={`site-nav-link ${active ? "is-active" : ""}`}>
                <Icon size={14} />
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="site-nav-auth">
          {user ? (
            <Link href="/login" className="site-auth-link" aria-label={`${user.name} 的等级`}>
              <span className="desktop-level"><LevelBadge name={user.name} xp={user.xp} /></span>
              <span className="mobile-level"><LevelBadge compact name={user.name} xp={user.xp} /></span>
            </Link>
          ) : (
            <Link href="/login" className="site-login-link">
              登录
            </Link>
          )}
          <button type="button" className="site-menu-button" aria-label={menuOpen ? "关闭导航菜单" : "打开导航菜单"} onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="site-mobile-menu">
          {links.map((item) => {
            const Icon = item.icon
            const active = pathname === item.href || pathname?.startsWith(`${item.href}/`)
            return (
              <Link key={item.href} href={item.href} className={`site-mobile-link ${active ? "is-active" : ""}`}>
                <Icon size={15} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      )}

      <style>{`
        .site-nav {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(0,0,0,0.92);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid #1a1a1a;
          white-space: nowrap;
          overflow: visible;
        }
        .site-nav-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding: 10px 24px;
          min-height: 56px;
        }
        .site-brand,
        .site-auth-link {
          display: inline-flex;
          align-items: center;
          text-decoration: none;
          flex-shrink: 0;
        }
        .site-nav-links {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          flex: 1;
          min-width: 0;
        }
        .site-nav-link,
        .site-mobile-link {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-family: 'Noto Sans SC', sans-serif;
          font-size: 13px;
          font-weight: 850;
          color: #ccc;
          text-decoration: none;
          transition: color 0.2s, border-color 0.2s, background 0.2s;
        }
        .site-nav-link svg,
        .site-mobile-link svg {
          color: #7a6230;
          flex-shrink: 0;
        }
        .site-nav-link.is-active,
        .site-mobile-link.is-active {
          color: #e8c96a;
        }
        .site-nav-auth {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }
        .site-login-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 34px;
          font-family: 'Noto Sans SC', sans-serif;
          font-size: 13px;
          font-weight: 900;
          color: #e8c96a;
          border: 1px solid #7a6230;
          padding: 6px 14px;
          border-radius: 8px;
          text-decoration: none;
          background: rgba(201,168,76,0.05);
        }
        .site-menu-button {
          display: none;
          width: 38px;
          height: 38px;
          border-radius: 10px;
          border: 1px solid #2a2a2a;
          background: rgba(255,255,255,0.04);
          color: #e8c96a;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .mobile-level {
          display: none;
        }
        .site-mobile-menu {
          display: none;
        }
        @media (max-width: 860px) {
          .site-nav-row {
            padding: 9px 12px;
            gap: 10px;
          }
          .site-nav-links {
            display: none;
          }
          .site-menu-button {
            display: inline-flex;
          }
          .desktop-level {
            display: none;
          }
          .mobile-level {
            display: inline-flex;
          }
          .site-login-link {
            min-height: 38px;
            padding: 7px 12px;
            font-size: 12px;
          }
          .site-mobile-menu {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 8px;
            padding: 10px 12px 12px;
            border-top: 1px solid #141414;
            background: rgba(0,0,0,0.96);
          }
          .site-mobile-link {
            min-height: 42px;
            border: 1px solid #202020;
            border-radius: 10px;
            background: rgba(255,255,255,0.03);
            padding: 9px 11px;
            color: #ddd;
            justify-content: flex-start;
          }
          .site-mobile-link.is-active {
            border-color: #7a6230;
            background: rgba(201,168,76,0.07);
          }
        }
        @media (max-width: 420px) {
          .site-nav-row {
            gap: 7px;
          }
          .site-brand {
            min-width: 104px;
          }
          .site-nav-auth {
            gap: 7px;
          }
          .site-mobile-menu {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </nav>
  )
}
