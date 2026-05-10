"use client"

import type { CSSProperties } from "react"
import { getNextLevel, getUserLevel, LEVEL_TRACKS, LevelTrack } from "@/data/user"

type LevelBadgeProps = {
  name: string
  xp: number
  contributionPoints?: number
  compact?: boolean
  track?: LevelTrack
  coCreatorApproved?: boolean
  previewLevel?: number
  locked?: boolean
}

type LevelIconProps = {
  level: number
  name: string
  compact?: boolean
  locked?: boolean
}

function clampLevel(level: number) {
  return Math.max(1, Math.min(19, level))
}

function iconSrc(level: number) {
  return `/level-icons/level-${String(clampLevel(level)).padStart(2, "0")}.png`
}

function normalizeName(name: string) {
  return (name || "个人").replace(/\s+/g, " ").trim() || "个人"
}

function nameSize(name: string, compact: boolean) {
  const length = Array.from(name).length
  if (compact) {
    if (length <= 4) return 18
    if (length <= 8) return 16
    if (length <= 12) return 13
    return 11
  }
  if (length <= 4) return 25
  if (length <= 8) return 21
  if (length <= 12) return 17
  return 14
}

function toneForLevel(level: number) {
  if (level >= 15) return "aurora"
  if (level >= 12) return "jade"
  if (level >= 8) return "gold"
  if (level >= 4) return "steel"
  return "ember"
}

export function LevelIcon({ level, name, compact = false, locked = false }: LevelIconProps) {
  return (
    <span className={`levelIconBadge ${compact ? "isCompact" : ""} ${locked ? "isLocked" : ""}`} title={name} aria-label={name}>
      <img src={iconSrc(level)} alt={name} />
      <style>{`
        .levelIconBadge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 156px;
          height: 184px;
          position: relative;
          overflow: visible;
          vertical-align: middle;
          filter: drop-shadow(0 10px 20px rgba(0,0,0,0.46));
        }
        .levelIconBadge.isCompact {
          width: 72px;
          height: 86px;
        }
        .levelIconBadge.isLocked {
          opacity: 0.42;
          filter: grayscale(0.85) drop-shadow(0 6px 12px rgba(0,0,0,0.38));
        }
        .levelIconBadge img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
          pointer-events: none;
          user-select: none;
        }
        @media (max-width: 860px) {
          .levelIconBadge {
            width: 132px;
            height: 156px;
          }
          .levelIconBadge.isCompact {
            width: 62px;
            height: 74px;
          }
        }
      `}</style>
    </span>
  )
}

export function LevelBadge({
  name,
  xp,
  contributionPoints = 0,
  compact = false,
  track = "personal",
  coCreatorApproved = false,
  previewLevel,
  locked = false,
}: LevelBadgeProps) {
  const levelAccess = { coCreatorApproved, contributionPoints }
  const trackLevels = LEVEL_TRACKS[track] || LEVEL_TRACKS.personal
  const level = typeof previewLevel === "number"
    ? trackLevels[previewLevel] || getUserLevel(xp, track, levelAccess)
    : getUserLevel(xp, track, levelAccess)
  const next = getNextLevel(xp, track, levelAccess)
  const displayName = normalizeName(name)
  const tone = toneForLevel(level.level)
  const titleText = `${displayName} · ${level.name} · ${level.desc}${next ? next.requiresReview ? ` · 达到共创门槛，审核后解锁 ${next.level.name}` : next.requiresContribution ? ` · 距离 ${next.level.name} 还差 ${next.need} 贡献值` : ` · 距离 ${next.level.name} 还差 ${next.need} XP` : " · 已达当前最高档"}`
  const style = {
    "--plate-accent": level.accent,
    "--plate-main": level.color,
    "--plate-name-size": `${nameSize(displayName, compact)}px`,
  } as CSSProperties

  return (
    <span
      className={`xiaobaiLevelNameplate tone-${tone} ${compact ? "isCompact" : "isFull"} ${locked ? "isLocked" : ""}`}
      style={style}
      title={titleText}
      aria-label={titleText}
    >
      <span className="levelPlateFrame" aria-hidden="true" />
      <span className="levelPlateSeal" aria-hidden="true">
        <img src={iconSrc(level.level)} alt="" />
      </span>
      <span className="levelPlateText">
        <span className="levelPlateName">{displayName}</span>
      </span>
      <span className="levelPlateEdge" aria-hidden="true">
        <span />
      </span>
      <style>{`
        .xiaobaiLevelNameplate {
          --plate-main: #c9a84c;
          --plate-accent: #fff0a8;
          --plate-deep: #090909;
          --plate-mid: rgba(201,168,76,0.24);
          --plate-line: rgba(255,240,168,0.64);
          display: inline-grid;
          grid-template-columns: 78px minmax(0, 1fr) 48px;
          align-items: center;
          width: 336px;
          height: 92px;
          position: relative;
          isolation: isolate;
          overflow: visible;
          vertical-align: middle;
          line-height: 0;
          color: #fff;
          filter:
            drop-shadow(0 12px 20px rgba(0,0,0,0.5))
            drop-shadow(0 0 14px color-mix(in srgb, var(--plate-main) 32%, transparent));
        }
        .xiaobaiLevelNameplate.isCompact {
          grid-template-columns: 54px minmax(0, 1fr) 34px;
          width: 226px;
          height: 58px;
          filter:
            drop-shadow(0 7px 12px rgba(0,0,0,0.42))
            drop-shadow(0 0 10px color-mix(in srgb, var(--plate-main) 26%, transparent));
        }
        .xiaobaiLevelNameplate.isLocked {
          opacity: 0.46;
          filter: grayscale(0.9) drop-shadow(0 7px 12px rgba(0,0,0,0.42));
        }
        .xiaobaiLevelNameplate.tone-ember {
          --plate-deep: #180f08;
          --plate-mid: rgba(208,138,66,0.28);
          --plate-line: rgba(255,209,154,0.7);
        }
        .xiaobaiLevelNameplate.tone-steel {
          --plate-deep: #0b1119;
          --plate-mid: rgba(159,178,200,0.24);
          --plate-line: rgba(230,242,255,0.66);
        }
        .xiaobaiLevelNameplate.tone-gold {
          --plate-deep: #171104;
          --plate-mid: rgba(232,201,106,0.27);
          --plate-line: rgba(255,240,168,0.78);
        }
        .xiaobaiLevelNameplate.tone-jade {
          --plate-deep: #061815;
          --plate-mid: rgba(38,215,198,0.22);
          --plate-line: rgba(216,255,247,0.72);
        }
        .xiaobaiLevelNameplate.tone-aurora {
          --plate-deep: #0b0820;
          --plate-mid: rgba(182,146,255,0.23);
          --plate-line: rgba(235,248,255,0.82);
        }
        .levelPlateFrame {
          position: absolute;
          inset: 8px 4px 9px 18px;
          z-index: -3;
          clip-path: polygon(7% 0, 93% 0, 100% 50%, 93% 100%, 7% 100%, 0 50%);
          border: 1px solid var(--plate-line);
          background:
            radial-gradient(circle at 20% 18%, rgba(255,255,255,0.26), transparent 26%),
            linear-gradient(135deg, rgba(255,255,255,0.18), transparent 24% 72%, rgba(255,255,255,0.1)),
            linear-gradient(90deg, color-mix(in srgb, var(--plate-main) 18%, #050505), var(--plate-deep) 34%, rgba(5,5,5,0.92) 66%, color-mix(in srgb, var(--plate-main) 20%, #050505));
          box-shadow:
            inset 0 0 0 1px rgba(255,255,255,0.08),
            inset 0 8px 18px rgba(255,255,255,0.08),
            inset 0 -16px 24px rgba(0,0,0,0.46),
            0 0 0 1px rgba(0,0,0,0.72),
            0 0 22px color-mix(in srgb, var(--plate-main) 20%, transparent);
        }
        .xiaobaiLevelNameplate.isCompact .levelPlateFrame {
          inset: 6px 3px 7px 13px;
        }
        .levelPlateFrame::before,
        .levelPlateFrame::after {
          content: "";
          position: absolute;
          left: 18%;
          right: 12%;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--plate-line), transparent);
          opacity: 0.72;
        }
        .levelPlateFrame::before { top: 8px; }
        .levelPlateFrame::after { bottom: 8px; opacity: 0.45; }
        .levelPlateSeal {
          width: 82px;
          height: 82px;
          margin-left: -2px;
          display: inline-flex;
          align-items: flex-start;
          justify-content: center;
          position: relative;
          overflow: hidden;
          border-radius: 999px;
          border: 1px solid color-mix(in srgb, var(--plate-accent) 62%, rgba(255,255,255,0.24));
          background:
            radial-gradient(circle at 50% 34%, rgba(255,255,255,0.18), transparent 58%),
            rgba(0,0,0,0.6);
          box-shadow:
            inset 0 0 16px rgba(255,255,255,0.11),
            0 0 18px color-mix(in srgb, var(--plate-main) 26%, transparent);
        }
        .xiaobaiLevelNameplate.isCompact .levelPlateSeal {
          width: 56px;
          height: 56px;
          margin-left: -1px;
        }
        .levelPlateSeal img {
          display: block;
          width: 104%;
          height: 124%;
          object-fit: cover;
          object-position: 50% 0%;
          transform: translateY(-2px) scale(1.02);
          pointer-events: none;
          user-select: none;
          filter: saturate(1.04) contrast(1.04);
        }
        .xiaobaiLevelNameplate.isCompact .levelPlateSeal img {
          width: 108%;
          height: 128%;
          transform: translateY(-1px) scale(1.02);
        }
        .levelPlateText {
          min-width: 0;
          min-height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 12px 0 0;
          position: relative;
          z-index: 1;
        }
        .xiaobaiLevelNameplate.isCompact .levelPlateText {
          min-height: 30px;
          padding: 0 8px 0 0;
        }
        .levelPlateName {
          min-width: 0;
          width: 100%;
          min-height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: #f9d86a;
          background: linear-gradient(180deg, #fff8c6 0%, #ffe37c 32%, #c88b25 68%, #fff0a3 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          font-size: var(--plate-name-size);
          font-weight: 950;
          line-height: 1.05;
          letter-spacing: 0;
          overflow-wrap: anywhere;
          font-family: "Noto Serif SC", "Songti SC", "SimSun", serif;
          text-shadow:
            0 1px 0 rgba(71,38,4,0.95),
            0 2px 0 rgba(20,8,0,0.9),
            0 -1px 0 rgba(255,255,255,0.72),
            0 0 10px color-mix(in srgb, var(--plate-accent) 30%, transparent),
            0 0 2px rgba(255,255,255,0.42);
          filter:
            drop-shadow(0 1px 0 rgba(45,22,0,0.98))
            drop-shadow(0 0 8px color-mix(in srgb, var(--plate-main) 26%, transparent));
        }
        .xiaobaiLevelNameplate.isCompact .levelPlateName {
          min-height: 24px;
          max-height: 34px;
        }
        .levelPlateEdge {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          position: relative;
          z-index: 1;
        }
        .levelPlateEdge span {
          width: 16px;
          height: 38px;
          border-radius: 999px;
          border: 1px solid color-mix(in srgb, var(--plate-line) 72%, transparent);
          background:
            radial-gradient(circle at 50% 28%, #fff, var(--plate-accent) 18%, transparent 36%),
            linear-gradient(180deg, rgba(255,255,255,0.18), rgba(0,0,0,0.4));
          box-shadow:
            0 0 15px color-mix(in srgb, var(--plate-main) 34%, transparent),
            inset 0 0 10px rgba(255,255,255,0.14);
        }
        .xiaobaiLevelNameplate.isCompact .levelPlateEdge span {
          width: 11px;
          height: 27px;
        }
        @media (max-width: 860px) {
          .xiaobaiLevelNameplate {
            width: 300px;
            height: 84px;
            grid-template-columns: 70px minmax(0,1fr) 42px;
          }
          .xiaobaiLevelNameplate:not(.isCompact) .levelPlateSeal {
            width: 74px;
            height: 74px;
          }
          .xiaobaiLevelNameplate.isCompact {
            width: 204px;
            height: 54px;
            grid-template-columns: 50px minmax(0,1fr) 30px;
          }
          .xiaobaiLevelNameplate.isCompact .levelPlateSeal {
            width: 52px;
            height: 52px;
          }
        }
        @media (max-width: 420px) {
          .xiaobaiLevelNameplate.isCompact {
            width: 188px;
            grid-template-columns: 46px minmax(0,1fr) 26px;
          }
          .xiaobaiLevelNameplate.isCompact .levelPlateSeal {
            width: 48px;
            height: 48px;
          }
        }
      `}</style>
    </span>
  )
}
