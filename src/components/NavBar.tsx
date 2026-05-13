"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Building2, Compass, Crown, GraduationCap, LogOut, Menu, Newspaper, Trophy, Users, X } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/AuthContext"
import { LevelBadge, LevelIcon } from "@/components/LevelBadge"
import { XiaobaiLogo } from "@/components/XiaobaiLogo"
import { LEVEL_TRACKS, getNextLevel, getUserLevel } from "@/data/user"

const links = [
  { label: "开始学习", href: "/learn", icon: GraduationCap },
  { label: "工具资源", href: "/tools", icon: Compass },
  { label: "实战展示", href: "/member-cases", icon: Crown },
  { label: "AI资讯", href: "/news", icon: Newspaper },
  { label: "社区", href: "/community", icon: Users },
  { label: "成长舱", href: "/growth", icon: Trophy },
  { label: "关于我们", href: "/about", icon: Building2 },
]

const coCreatorPreviewContribution: Record<number, number> = {
  15: 0,
  16: 20,
  17: 60,
  18: 160,
  19: 360,
}

export function NavBar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const userXP = user?.xp || 0
  const levelTrack = user?.coCreatorTrack === "team" ? "team" : "personal"
  const contributionPoints = Number(user?.contributionPoints || 0)
  const levelAccess = useMemo(() => ({ coCreatorApproved: Boolean(user?.coCreatorApproved), contributionPoints }), [contributionPoints, user?.coCreatorApproved])
  const level = useMemo(() => getUserLevel(userXP, levelTrack, levelAccess), [levelAccess, levelTrack, userXP])
  const next = useMemo(() => getNextLevel(userXP, levelTrack, levelAccess), [levelAccess, levelTrack, userXP])
  const progress = next?.requiresReview
    ? 100
    : next?.requiresContribution
      ? Math.min(100, Math.max(8, Math.round((contributionPoints / Math.max(1, contributionPoints + next.need)) * 100)))
      : next
        ? Math.min(100, Math.round(((userXP - level.minXP) / (next.level.minXP - level.minXP)) * 100))
        : 100
  const xpNeed = next?.need || 0
  const idleMinutesNeed = xpNeed ? Math.ceil((xpNeed / 2) * 5) : 0
  const missionDaysNeed = xpNeed ? Math.ceil(xpNeed / 110) : 0
  const xpLabel = next?.requiresContribution ? `${contributionPoints} 贡献值` : next?.requiresReview ? `${userXP} XP · 共创待审核` : next ? `${userXP} XP` : "已达最高档"
  const levelCatalog = LEVEL_TRACKS[levelTrack] || LEVEL_TRACKS.personal
  const isCoCreatorGod = Boolean(user?.coCreatorApproved) && level.level >= 19
  const prefetchRoute = (href: string) => {
    router.prefetch(href)
  }

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
              <Link key={item.href} href={item.href} prefetch className={`site-nav-link ${active ? "is-active" : ""}`} onMouseEnter={() => prefetchRoute(item.href)} onFocus={() => prefetchRoute(item.href)}>
                <Icon size={14} />
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="site-nav-auth">
          {user ? (
            <div className="site-profile-wrap">
              <button type="button" className="site-auth-link site-profile-button" aria-label={`${user.name} 的等级`} onClick={() => setProfileOpen((open) => !open)}>
              <span className="desktop-level"><LevelBadge compact name={user.name} xp={userXP} track={levelTrack} contributionPoints={contributionPoints} coCreatorApproved={user.coCreatorApproved} /></span>
              <span className="mobile-level"><LevelBadge compact name={user.name} xp={userXP} track={levelTrack} contributionPoints={contributionPoints} coCreatorApproved={user.coCreatorApproved} /></span>
              </button>
              {profileOpen && (
                <div className="site-profile-popover">
                  <div className="profile-head">
                    <LevelIcon level={level.level} name={level.name} compact />
                    <div className="profile-title">
                      <p>{user.name}</p>
                      <span>{user.email}</span>
                    </div>
                  </div>
                  <div className="profile-current-plate">
                    <LevelBadge compact name={user.name} xp={userXP} track={levelTrack} contributionPoints={contributionPoints} coCreatorApproved={user.coCreatorApproved} />
                  </div>
                  <div className="profile-xp-row">
                    <span>{level.name}</span>
                    <strong>{xpLabel}</strong>
                  </div>
                  <div className="profile-progress">
                    <span style={{ width: `${progress}%` }} />
                  </div>
                  <p className="profile-next">{next ? next.requiresReview ? `已达到共创门槛，提交真实案例和复盘后，由小白AI人工审核解锁 ${next.level.name}。` : next.requiresContribution ? `距离 ${next.level.name} 还差 ${next.need} 贡献值，实战案例被验证后涨得最快。` : `距离 ${next.level.name} 还差 ${next.need} XP` : "已达最高档，继续完成任务和复盘，保持共创身份。"}</p>
                  {next && !next.requiresReview && !next.requiresContribution && (
                    <div className="profile-upgrade-hint">
                      <span>约挂机 {idleMinutesNeed} 分钟</span>
                      <span>或做 {missionDaysNeed} 天任务</span>
                    </div>
                  )}
                  {isCoCreatorGod ? (
                    <>
                      <p className="profile-god-note">共创神已解锁完整等级图鉴，可查看全部等级铭牌。</p>
                      <div className="profile-levels is-god-view" aria-label="共创神完整等级图鉴">
                        {levelCatalog.map((item) => (
                          <div key={item.level} className="profile-level-item is-unlocked" title={`${item.name} · ${item.minXP} XP`}>
                            <LevelIcon level={item.level} name={item.name} compact />
                            <span className="profile-level-caption">{item.name}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="profile-level-snapshot" aria-label="当前等级和下一级">
                      <div className="profile-level-card is-current">
                        <div className="profile-level-card-visual">
                          <LevelBadge compact name={user.name} xp={userXP} track={levelTrack} contributionPoints={contributionPoints} coCreatorApproved={user.coCreatorApproved} />
                        </div>
                        <span>当前等级</span>
                        <strong>{level.name}</strong>
                        <p>{level.reward.title}</p>
                      </div>
                      {next ? (
                        <div className="profile-level-card">
                          <div className="profile-level-card-visual">
                            <LevelBadge compact name={user.name} xp={next.level.minXP} track={levelTrack} contributionPoints={coCreatorPreviewContribution[next.level.level] || contributionPoints} coCreatorApproved={next.level.level >= 15} previewLevel={next.level.level} />
                          </div>
                          <span>{next.requiresReview ? "共创审核" : "下一级预览"}</span>
                          <strong>{next.level.name}</strong>
                          <p>{next.requiresReview ? "需要人工审核真实案例、复盘质量和共建贡献" : next.level.reward.title}</p>
                        </div>
                      ) : (
                        <div className="profile-level-card">
                          <span>下一步</span>
                          <strong>保持最高档</strong>
                          <p>继续完成任务、发布复盘和参与共建。</p>
                        </div>
                      )}
                    </div>
                  )}
                  <p className="profile-benefit">当前权益：{level.reward.vanity}</p>
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
              <Link key={item.href} href={item.href} prefetch className={`site-mobile-link ${active ? "is-active" : ""}`} onTouchStart={() => prefetchRoute(item.href)} onMouseEnter={() => prefetchRoute(item.href)} onFocus={() => prefetchRoute(item.href)}>
                <Icon size={15} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      )}

      <style suppressHydrationWarning>{`
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
          max-width: 236px;
          overflow: visible;
        }
        .site-profile-popover {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          width: min(560px, calc(100vw - 24px));
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
        .profile-head .levelIconBadge {
          flex: 0 0 auto;
          width: 78px;
          height: 92px;
          margin: -10px 0 -8px;
        }
        .profile-current-plate {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 56px;
          margin: -2px 0 12px;
          overflow: visible;
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
        .profile-god-note {
          border: 1px solid rgba(126,231,255,0.42);
          border-radius: 10px;
          background: linear-gradient(135deg, rgba(126,231,255,0.1), rgba(182,146,255,0.06));
          color: #dffbff;
          font-size: 12px;
          font-weight: 900;
          line-height: 1.6;
          margin: 10px 0 0;
          padding: 8px 10px;
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
        .profile-level-snapshot {
          display: grid;
          grid-template-columns: repeat(2, minmax(0,1fr));
          gap: 8px;
          margin: 14px 0;
        }
        .profile-level-card {
          min-width: 0;
          border: 1px solid #1f1f1f;
          border-radius: 10px;
          background: rgba(255,255,255,0.025);
          padding: 10px;
        }
        .profile-level-card-visual {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 58px;
          margin: -2px 0 6px;
          overflow: visible;
        }
        .profile-level-card-visual .xiaobaiLevelNameplate {
          transform: scale(0.82);
          transform-origin: center;
        }
        .profile-level-card.is-current {
          border-color: rgba(122,98,48,0.72);
          background: rgba(201,168,76,0.045);
        }
        .profile-level-card span {
          display: block;
          color: #777;
          font-size: 10px;
          font-weight: 900;
          margin-bottom: 5px;
        }
        .profile-level-card strong {
          display: block;
          color: #fff;
          font-size: 12px;
          font-weight: 950;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .profile-level-card p {
          color: #aaa;
          font-size: 11px;
          line-height: 1.55;
          margin: 6px 0 0;
        }
        .profile-levels.is-god-view {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
          max-height: 420px;
          overflow-y: auto;
          padding-right: 4px;
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
          padding: 10px;
          opacity: 0.48;
        }
        .profile-levels.is-god-view .profile-level-item {
          display: grid;
          grid-template-columns: 92px minmax(0,1fr);
          align-items: center;
          gap: 12px;
          min-height: 104px;
          text-align: left;
          padding: 8px 10px;
        }
        .profile-level-item.is-unlocked {
          opacity: 1;
          border-color: rgba(122,98,48,0.72);
          background: rgba(201,168,76,0.045);
        }
        .profile-levels.is-god-view .profile-level-item.is-unlocked {
          border-color: rgba(126,231,255,0.34);
          background: rgba(126,231,255,0.045);
        }
        .profile-level-token {
          width: 34px;
          height: 34px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.58);
          box-shadow: 0 0 16px rgba(255,255,255,0.08), inset 0 1px 7px rgba(255,255,255,0.5), inset 0 -8px 12px rgba(0,0,0,0.22);
        }
        .profile-level-token span {
          color: #071416;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          font-weight: 950;
          line-height: 1;
        }
        .profile-level-token.badge-seed {
          border-radius: 22% 78% 78% 22% / 50% 50% 50% 50%;
          background: linear-gradient(145deg,#f5f5f5,#8f8f8f);
        }
        .profile-level-token.badge-spark {
          border-radius: 50%;
          background: radial-gradient(circle at 35% 20%,#fff3c4,#d08a42 62%,#6d3d16);
        }
        .profile-level-token.badge-wing {
          border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
          background: linear-gradient(145deg,#ffffff,#9fb2c8 58%,#43556a);
        }
        .profile-level-token.badge-core {
          border-radius: 12px;
          background: radial-gradient(circle at 32% 24%,#fff6bd,#c9a84c 58%,#6d541d);
        }
        .profile-level-token.badge-gem {
          border-radius: 18% 82% 50% 50% / 24% 24% 76% 76%;
          background: linear-gradient(145deg,#dffff9,#26d7c6 52%,#11756d);
          transform: rotate(45deg);
        }
        .profile-level-token.badge-gem span,
        .profile-level-token.badge-diamond span,
        .profile-level-token.badge-xiaobai-diamond span {
          transform: rotate(-45deg);
        }
        .profile-level-token.badge-diamond {
          border-radius: 26% 74% 50% 50% / 28% 28% 72% 72%;
          background: linear-gradient(145deg,#ffffff,#b692ff 52%,#5932a6);
          transform: rotate(45deg);
        }
        .profile-level-token.badge-crown {
          border-radius: 14px;
          background: linear-gradient(145deg,#fff8c8 0%,#ffd86b 38%,#ffad2f 72%,#714205 100%);
        }
        .profile-level-token.badge-xiaobai-diamond {
          border-radius: 22% 78% 50% 50% / 26% 26% 74% 74%;
          background: linear-gradient(145deg,#ffffff 0%,#bff8ff 28%,#47d9ff 58%,#7f66ff 100%);
          box-shadow: 0 0 18px rgba(126,231,255,0.72), inset 0 1px 8px rgba(255,255,255,0.72), inset 0 -8px 12px rgba(0,0,0,0.22);
          transform: rotate(45deg);
        }
        .profile-level-item span {
          color: #ddd;
          font-size: 11px;
          font-weight: 850;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .profile-levels.is-god-view .profile-level-item > span:last-child {
          width: 100%;
          color: #f3ead2;
          font-size: 12px;
          font-weight: 950;
          white-space: normal;
          line-height: 1.45;
        }
        .profile-level-caption {
          min-width: 0;
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
          gap: 10px;
          flex: 1;
          min-width: 0;
        }
        .site-nav-link,
        .site-mobile-link {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-family: 'Noto Sans SC', sans-serif;
          font-size: 12px;
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
          .site-menu-button {
            display: inline-flex;
          }
          .desktop-level {
            display: none;
          }
          .mobile-level {
            display: inline-flex;
          }
          .site-profile-button {
            max-width: 196px;
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
          .profile-levels.is-god-view .profile-level-item {
            grid-template-columns: 1fr;
            justify-items: start;
            gap: 7px;
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
