"use client"

import { type CSSProperties } from "react"
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

function plateSrc(level: number) {
  if (level >= 12) return "/level-plates/auto-yingzhao.png"
  if (level >= 6) return "/level-plates/auto-bifang.png"
  return "/level-plates/auto-lushu.png"
}

function normalizeName(name: string) {
  return (name || "个人").replace(/\s+/g, " ").trim() || "个人"
}

function nameSize(name: string, compact: boolean) {
  const length = Array.from(name).length
  if (compact) {
    if (length <= 4) return 19
    if (length <= 8) return 16
    if (length <= 12) return 13
    return 11
  }
  if (length <= 4) return 28
  if (length <= 8) return 23
  if (length <= 12) return 19
  return 15
}

function textFit(name: string, compact: boolean) {
  const length = Array.from(name).length
  if (length <= 8) return undefined
  return compact ? 118 : 206
}

function toneForLevel(level: number) {
  if (level >= 19) return "mythic"
  if (level >= 15) return "aurora"
  if (level >= 12) return "jade"
  if (level >= 8) return "gold"
  if (level >= 4) return "steel"
  return "ember"
}

function effectForLevel(level: number) {
  if (level >= 19) return { halo: 0.72, aura: 0.34, flare: 0.9 }
  if (level >= 15) return { halo: 0.58, aura: 0.26, flare: 0.7 }
  if (level >= 12) return { halo: 0.42, aura: 0.18, flare: 0.52 }
  if (level >= 8) return { halo: 0.34, aura: 0.14, flare: 0.42 }
  if (level >= 4) return { halo: 0.24, aura: 0.1, flare: 0.28 }
  return { halo: 0.2, aura: 0.08, flare: 0.2 }
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
  const effect = effectForLevel(level.level)
  const titleText = `${displayName} · ${level.name} · ${level.desc}${next ? next.requiresReview ? ` · 达到共创门槛，审核后解锁 ${next.level.name}` : next.requiresContribution ? ` · 距离 ${next.level.name} 还差 ${next.need} 贡献值` : ` · 距离 ${next.level.name} 还差 ${next.need} XP` : " · 已达当前最高档"}`
  const width = compact ? 246 : 372
  const height = compact ? 90 : 136
  const centerX = compact ? 142 : 215
  const centerY = compact ? 48 : 73
  const fontSize = nameSize(displayName, compact)
  const fittedTextLength = textFit(displayName, compact)
  const style = {
    "--plate-accent": level.accent,
    "--plate-main": level.color,
    "--plate-image": `url(${plateSrc(level.level)})`,
  } as CSSProperties

  return (
    <span
      className={`xiaobaiLevelNameplateSvg tone-${tone} ${compact ? "isCompact" : "isFull"} ${locked ? "isLocked" : ""}`}
      style={style}
      title={titleText}
      aria-label={titleText}
    >
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-hidden="true" className="levelPlateImageSvg">
        <defs>
          <linearGradient id="levelPlateTextGold" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fffbd1" />
            <stop offset="32%" stopColor="#ffe178" />
            <stop offset="60%" stopColor="#c48018" />
            <stop offset="82%" stopColor="#fff1a7" />
            <stop offset="100%" stopColor="#8d5511" />
          </linearGradient>
          <filter id="levelPlateGoldText" x="-20%" y="-60%" width="140%" height="220%">
            <feDropShadow dx="0" dy="1" stdDeviation="0.45" floodColor="#2a1200" floodOpacity="1" />
            <feDropShadow dx="0" dy="-1" stdDeviation="0.35" floodColor="#fff7c8" floodOpacity="0.78" />
            <feDropShadow dx="0" dy="0" stdDeviation="2.2" floodColor="var(--plate-main)" floodOpacity={effect.flare} />
          </filter>
        </defs>
        <foreignObject x="0" y="0" width={width} height={height}>
          <span className="levelPlateImageFill" />
        </foreignObject>
        <ellipse cx={centerX} cy={centerY + 2} rx={compact ? 58 : 88} ry={compact ? 16 : 24} fill="rgba(0,0,0,0.28)" />
        <g>
          <text
            x={centerX}
            y={centerY + (compact ? 1 : 2)}
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily={`"Noto Serif SC", "Songti SC", "SimSun", serif`}
            fontSize={fontSize}
            fontWeight="950"
            letterSpacing="0"
            paintOrder="stroke fill"
            stroke="#3a1b03"
            strokeWidth={compact ? 2.2 : 3}
            fill="url(#levelPlateTextGold)"
            filter="url(#levelPlateGoldText)"
            {...(fittedTextLength ? { textLength: fittedTextLength, lengthAdjust: "spacingAndGlyphs" as const } : {})}
          >
            {displayName}
          </text>
        </g>
      </svg>
      <style>{`
        .xiaobaiLevelNameplateSvg {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: ${width}px;
          height: ${height}px;
          vertical-align: middle;
          line-height: 0;
          transform: translateZ(0);
          filter:
            drop-shadow(0 10px 16px rgba(0,0,0,0.54))
            drop-shadow(0 0 14px color-mix(in srgb, var(--plate-main) ${Math.round(effect.halo * 44)}%, transparent));
        }
        .xiaobaiLevelNameplateSvg svg {
          display: block;
          width: 100%;
          height: 100%;
          overflow: visible;
          pointer-events: none;
          user-select: none;
        }
        .levelPlateImageFill {
          display: block;
          width: 100%;
          height: 100%;
          background-image: var(--plate-image);
          background-repeat: no-repeat;
          background-position: center;
          background-size: contain;
        }
        .xiaobaiLevelNameplateSvg.isLocked {
          opacity: 0.45;
          filter: grayscale(0.85);
        }
        @media (max-width: 860px) {
          .xiaobaiLevelNameplateSvg.isFull {
            width: 330px;
            height: 99px;
          }
          .xiaobaiLevelNameplateSvg.isCompact {
            width: 226px;
            height: 68px;
          }
        }
        @media (max-width: 420px) {
          .xiaobaiLevelNameplateSvg.isCompact {
            width: 210px;
            height: 63px;
          }
        }
      `}</style>
    </span>
  )
}
