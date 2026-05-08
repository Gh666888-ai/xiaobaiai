"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { BookOpen, Bot, Building2, Compass, Flag, GraduationCap, LogOut, Menu, MessageCircle, Newspaper, Search, Trophy, Users, Workflow, X } from "lucide-react"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/AuthContext"
import { LevelBadge } from "@/components/LevelBadge"
import { XiaobaiLogo } from "@/components/XiaobaiLogo"
import { LEVELS, getNextLevel, getUserLevel } from "@/data/user"

const links = [
  { label: "开始", href: "/start", icon: Compass },
  { label: "任务", href: "/missions", icon: Flag },
  { label: "工具", href: "/tools", icon: Compass },
  { label: "学习", href: "/learn", icon: GraduationCap },
  { label: "案例", href: "/cases", icon: BookOpen },
  { label: "社区", href: "/community", icon: Users },
]

const moreLinks = [
  { label: "选择器", href: "/choose-tool", icon: Search },
  { label: "工作流", href: "/workflows", icon: Workflow },
  { label: "资讯", href: "/news", icon: Newspaper },
  { label: "模型", href: "/models", icon: Bot },
  { label: "成长舱", href: "/growth", icon: Trophy },
  { label: "关于我们", href: "/about", icon: Building2 },
]

const levelBenefits = [
  "解锁成长档案，记录每日任务和在线经验",
  "社区昵称显示星火等级，评论更有识别度",
  "学习路径进度展示更完整，推荐更贴近新手",
  "社区身份升级，发帖/评论显示金核徽章",
  "Agent和工作流内容优先推荐，适合进阶用户",
  "星环身份展示，后续优先开放高级模板",
  "皇冠身份展示，社区高阶玩家标识",
  "小白AI共创者身份，参与内测和共创展示",
]

export function NavBar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const level = useMemo(() => getUserLevel(user?.xp || 0), [user?.xp])
  const next = useMemo(() => getNextLevel(user?.xp || 0), [user?.xp])
  const progress = next ? Math.min(100, Math.round((((user?.xp || 0) - level.minXP) / (next.level.minXP - level.minXP)) * 100)) : 100
  const xpNeed = next?.need || 0
  const idleMinutesNeed = xpNeed ? Math.ceil((xpNeed / 2) * 5) : 0
  const missionDaysNeed = xpNeed ? Math.ceil(xpNeed / 110) : 0

  useEffect(() => {
    setMenuOpen(false)
    setProfileOpen(false)
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
          <button type="button" className="site-nav-link site-nav-button" onClick={() => window.dispatchEvent(new Event("xiaobai:open-chat"))}>
            <MessageCircle size={14} />
            问小白
          </button>
        </div>

        <div className="site-nav-auth">
          {user ? (
            <div className="site-profile-wrap">
              <button type="button" className="site-auth-link site-profile-button" aria-label={`${user.name} 的等级`} onClick={() => setProfileOpen((open) => !open)}>
                <span className="desktop-level"><LevelBadge name={user.name} xp={user.xp} /></span>
                <span className="mobile-level"><LevelBadge compact name={user.name} xp={user.xp} /></span>
              </button>
              {profileOpen && (
                <div className="site-profile-popover">
                  <div className="profile-head">
                    <LevelBadge compact name={user.name} xp={user.xp} />
                    <div className="profile-title">
                      <p>{user.name}</p>
                      <span>{user.email}</span>
                    </div>
                  </div>
                  <div className="profile-xp-row">
                    <span>{level.name}</span>
                    <strong>{user.xp} XP</strong>
                  </div>
                  <div className="profile-progress">
                    <span style={{ width: `${progress}%` }} />
                  </div>
                  <p className="profile-next">{next ? `距离 ${next.level.name} 还差 ${next.need} XP` : "已达最高身份，小白共创者"}</p>
                  {next && (
                    <div className="profile-upgrade-hint">
                      <span>约挂机 {idleMinutesNeed} 分钟</span>
                      <span>或做 {missionDaysNeed} 天任务</span>
                    </div>
                  )}
                  <p className="profile-benefit">当前权益：{levelBenefits[level.level] || levelBenefits[0]}</p>
                  <div className="profile-levels" aria-label="等级图标">
                    {LEVELS.map((item) => (
                      <div key={item.level} className={`profile-level-item ${user.xp >= item.minXP ? "is-unlocked" : ""}`}>
                        <LevelBadge compact name={`L${item.level}`} xp={item.minXP} />
                        <span>{item.name}</span>
                      </div>
                    ))}
                  </div>
                  <div className="profile-actions">
                    <Link href="/growth" className="profile-action-primary">做任务升级</Link>
                    <button type="button" className="profile-action-ghost" onClick={() => logout()}>
                      <LogOut size={13} /> 退出
                    </button>
                  </div>
                  <p className="profile-tip">在线保持页面打开每 5 分钟 +2 XP，每天最多 60 XP；完成任务、阅读和发帖也会涨经验。</p>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login?redirect=/growth" className="site-login-link">
              登录领 50XP
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
          <button type="button" className="site-mobile-link site-mobile-button" onClick={() => window.dispatchEvent(new Event("xiaobai:open-chat"))}>
            <MessageCircle size={15} />
            <span>问小白</span>
          </button>
          <div className="site-mobile-more">
            <p>更多入口</p>
            <div>
              {moreLinks.map((item) => {
                const Icon = item.icon
                const active = pathname === item.href || pathname?.startsWith(`${item.href}/`)
                return (
                  <Link key={item.href} href={item.href} className={`site-mobile-link site-mobile-link-secondary ${active ? "is-active" : ""}`}>
                    <Icon size={14} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
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
        .site-profile-wrap {
          position: relative;
          display: inline-flex;
          align-items: center;
        }
        .site-profile-button {
          border: 0;
          background: transparent;
          padding: 0;
          cursor: pointer;
          font-family: inherit;
        }
        .site-profile-popover {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          width: min(368px, calc(100vw - 24px));
          border: 1px solid #2a1f10;
          border-radius: 14px;
          background: rgba(5,5,5,0.98);
          box-shadow: 0 22px 70px rgba(0,0,0,0.62), 0 0 28px rgba(201,168,76,0.13);
          padding: 16px;
          white-space: normal;
          z-index: 120;
        }
        .profile-head {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
        }
        .profile-title {
          min-width: 0;
        }
        .profile-title p {
          color: #fff;
          font-size: 15px;
          font-weight: 950;
          margin: 0 0 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .profile-title span {
          display: block;
          color: #888;
          font-size: 11px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .profile-xp-row {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          color: #fff;
          font-size: 13px;
          font-weight: 900;
          margin-bottom: 8px;
        }
        .profile-xp-row strong {
          color: #e8c96a;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
        }
        .profile-progress {
          height: 8px;
          border: 1px solid #242424;
          background: #111;
          border-radius: 999px;
          overflow: hidden;
          margin-bottom: 8px;
        }
        .profile-progress span {
          display: block;
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg,#7a6230,#e8c96a);
        }
        .profile-next,
        .profile-benefit,
        .profile-tip {
          color: #aaa;
          font-size: 12px;
          line-height: 1.7;
          margin: 0;
        }
        .profile-benefit {
          color: #e8c96a;
          margin-top: 6px;
        }
        .profile-upgrade-hint {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 8px;
        }
        .profile-upgrade-hint span {
          display: inline-flex;
          border: 1px solid #2a1f10;
          background: rgba(201,168,76,0.055);
          color: #d6c28a;
          border-radius: 999px;
          padding: 3px 8px;
          font-size: 11px;
          font-weight: 850;
        }
        .profile-levels {
          display: grid;
          grid-template-columns: repeat(2, minmax(0,1fr));
          gap: 8px;
          margin: 14px 0;
        }
        .profile-level-item {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
          border: 1px solid #1f1f1f;
          border-radius: 10px;
          background: rgba(255,255,255,0.025);
          padding: 8px;
          opacity: 0.48;
        }
        .profile-level-item.is-unlocked {
          opacity: 1;
          border-color: rgba(122,98,48,0.72);
          background: rgba(201,168,76,0.045);
        }
        .profile-level-item span {
          color: #ddd;
          font-size: 11px;
          font-weight: 850;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .profile-actions {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }
        .profile-action-primary,
        .profile-action-ghost {
          min-height: 34px;
          border-radius: 9px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 7px 12px;
          font-size: 12px;
          font-weight: 950;
          text-decoration: none;
          cursor: pointer;
        }
        .profile-action-primary {
          color: #111;
          background: #e8c96a;
          border: 1px solid #e8c96a;
        }
        .profile-action-ghost {
          color: #bbb;
          background: rgba(255,255,255,0.03);
          border: 1px solid #2a2a2a;
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
        .site-nav-button,
        .site-mobile-button {
          border: 0;
          background: transparent;
          cursor: pointer;
          font-family: inherit;
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
          display: inline-flex;
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
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(148px, 1fr));
          gap: 8px;
          padding: 10px 24px 14px;
          border-top: 1px solid #141414;
          background: rgba(0,0,0,0.96);
        }
        .site-mobile-more {
          grid-column: 1 / -1;
          border-top: 1px solid #151515;
          margin-top: 4px;
          padding-top: 10px;
        }
        .site-mobile-more p {
          color: #777;
          font-size: 11px;
          font-weight: 900;
          margin: 0 0 8px;
        }
        .site-mobile-more div {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .site-mobile-link {
          min-height: 40px;
          border: 1px solid #202020;
          border-radius: 10px;
          background: rgba(255,255,255,0.03);
          padding: 9px 11px;
          color: #ddd;
          justify-content: flex-start;
        }
        .site-mobile-link-secondary {
          min-height: 34px;
          border-radius: 999px;
          padding: 7px 10px;
          color: #aaa;
          background: rgba(255,255,255,0.018);
        }
        .site-mobile-link.is-active {
          border-color: #7a6230;
          background: rgba(201,168,76,0.07);
        }
        @media (max-width: 860px) {
          .site-nav-row {
            padding: 9px 12px;
            gap: 10px;
          }
          .site-nav-links {
            display: none;
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
            grid-template-columns: repeat(2, minmax(0, 1fr));
            padding: 10px 12px 12px;
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
