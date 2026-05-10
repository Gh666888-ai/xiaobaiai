"use client"

import { useId, type CSSProperties } from "react"
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

type PlateConfig = {
  src: string
  aspect: number
  textX: number
  textY: number
  textWidth: number
  textScale: number
  shadowRx: number
  shadowRy: number
  panel?: {
    x: number
    y: number
    width: number
    height: number
    rx: number
    fill: string
    stroke: string
    glow: string
  }
}

function plateConfig(level: number): PlateConfig {
  if (level >= 19) return { src: "/level-plates/co-creator-god.png", aspect: 1475 / 325, textX: 0.5, textY: 0.515, textWidth: 0.38, textScale: 0.37, shadowRx: 0.2, shadowRy: 0.12, panel: { x: 0.29, y: 0.235, width: 0.42, height: 0.55, rx: 0.08, fill: "#08284c", stroke: "#b8d8ff", glow: "#23a9ff" } }
  if (level >= 18) return { src: "/level-plates/co-creator-partner-plus.png", aspect: 1118 / 187, textX: 0.5, textY: 0.47, textWidth: 0.41, textScale: 0.45, shadowRx: 0.22, shadowRy: 0.12, panel: { x: 0.285, y: 0.17, width: 0.43, height: 0.61, rx: 0.1, fill: "#063b36", stroke: "#d8b45f", glow: "#1ed7bd" } }
  if (level >= 17) return { src: "/level-plates/co-creator-partner.png", aspect: 1046 / 160, textX: 0.5, textY: 0.49, textWidth: 0.41, textScale: 0.45, shadowRx: 0.22, shadowRy: 0.12, panel: { x: 0.285, y: 0.18, width: 0.43, height: 0.62, rx: 0.1, fill: "#10211c", stroke: "#d8b45f", glow: "#18c9b7" } }
  if (level >= 16) return { src: "/level-plates/co-creator-mentor.png", aspect: 1085 / 147, textX: 0.5, textY: 0.49, textWidth: 0.41, textScale: 0.45, shadowRx: 0.22, shadowRy: 0.12, panel: { x: 0.285, y: 0.17, width: 0.43, height: 0.63, rx: 0.1, fill: "#eee7dc", stroke: "#c99b38", glow: "#fff1bd" } }
  if (level >= 15) return { src: "/level-plates/co-creator-advisor.png", aspect: 1068 / 157, textX: 0.5, textY: 0.49, textWidth: 0.41, textScale: 0.45, shadowRx: 0.22, shadowRy: 0.12, panel: { x: 0.285, y: 0.17, width: 0.43, height: 0.63, rx: 0.1, fill: "#5a1609", stroke: "#f0b94d", glow: "#ff6b22" } }
  if (level >= 10) return { src: "/level-plates/auto-yingzhao.png", aspect: 1833 / 592, textX: 0.62, textY: 0.5, textWidth: 0.5, textScale: 0.22, shadowRx: 0.25, shadowRy: 0.17 }
  if (level >= 5) return { src: "/level-plates/auto-bifang.png", aspect: 1738 / 638, textX: 0.59, textY: 0.575, textWidth: 0.48, textScale: 0.22, shadowRx: 0.25, shadowRy: 0.17 }
  return { src: "/level-plates/auto-lushu.png", aspect: 1647 / 592, textX: 0.58, textY: 0.565, textWidth: 0.45, textScale: 0.22, shadowRx: 0.24, shadowRy: 0.16 }
}

function normalizeName(name: string) {
  return (name || "个人").replace(/\s+/g, " ").trim() || "个人"
}

function nameSize(name: string, compact: boolean) {
  const length = Array.from(name).length
  if (compact) {
    if (length <= 4) return 17
    if (length <= 8) return 15
    if (length <= 12) return 13
    return 11
  }
  if (length <= 4) return 25
  if (length <= 8) return 21
  if (length <= 12) return 19
  return 15
}

function textFit(name: string, maxWidth: number) {
  const length = Array.from(name).length
  if (length <= 7) return undefined
  return maxWidth
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
  const plate = plateConfig(level.level)
  const rawId = useId().replace(/[^a-zA-Z0-9_-]/g, "")
  const titleText = `${displayName} · ${level.name} · ${level.desc}${next ? next.requiresReview ? ` · 达到共创门槛，审核后解锁 ${next.level.name}` : next.requiresContribution ? ` · 距离 ${next.level.name} 还差 ${next.need} 贡献值` : ` · 距离 ${next.level.name} 还差 ${next.need} XP` : " · 已达当前最高档"}`
  const width = compact ? 246 : 372
  const height = Math.round(width / plate.aspect)
  const centerX = Math.round(width * plate.textX)
  const centerY = Math.round(height * plate.textY)
  const maxTextWidth = Math.round(width * plate.textWidth)
  const fontSize = Math.min(nameSize(displayName, compact), Math.round(height * plate.textScale))
  const fittedTextLength = textFit(displayName, maxTextWidth)
  const panelX = plate.panel ? Math.round(width * plate.panel.x) : 0
  const panelY = plate.panel ? Math.round(height * plate.panel.y) : 0
  const panelWidth = plate.panel ? Math.round(width * plate.panel.width) : 0
  const panelHeight = plate.panel ? Math.round(height * plate.panel.height) : 0
  const panelRx = plate.panel ? Math.round(Math.min(width, height) * plate.panel.rx) : 0
  const style = {
    "--plate-accent": level.accent,
    "--plate-main": level.color,
    "--plate-image": `url(${plate.src})`,
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
          <linearGradient id={`${rawId}-levelPlateTextGold`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fffbd1" />
            <stop offset="32%" stopColor="#ffe178" />
            <stop offset="60%" stopColor="#c48018" />
            <stop offset="82%" stopColor="#fff1a7" />
            <stop offset="100%" stopColor="#8d5511" />
          </linearGradient>
          <filter id={`${rawId}-levelPlateGoldText`} x="-20%" y="-60%" width="140%" height="220%">
            <feDropShadow dx="0" dy="1" stdDeviation="0.45" floodColor="#2a1200" floodOpacity="1" />
            <feDropShadow dx="0" dy="-1" stdDeviation="0.35" floodColor="#fff7c8" floodOpacity="0.78" />
            <feDropShadow dx="0" dy="0" stdDeviation="2.2" floodColor="var(--plate-main)" floodOpacity={effect.flare} />
          </filter>
          {plate.panel && (
            <>
              <linearGradient id={`${rawId}-levelPlatePanel`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={plate.panel.glow} stopOpacity="0.22" />
                <stop offset="16%" stopColor={plate.panel.fill} stopOpacity="1" />
                <stop offset="68%" stopColor={plate.panel.fill} stopOpacity="1" />
                <stop offset="100%" stopColor="#050505" stopOpacity="0.92" />
              </linearGradient>
              <linearGradient id={`${rawId}-levelPlatePanelShine`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fff8cf" stopOpacity="0.45" />
                <stop offset="42%" stopColor="#ffffff" stopOpacity="0.06" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.28" />
              </linearGradient>
              <filter id={`${rawId}-levelPlatePanelDepth`} x="-12%" y="-45%" width="124%" height="190%">
                <feDropShadow dx="0" dy="1" stdDeviation="0.55" floodColor="#000000" floodOpacity="0.7" />
                <feDropShadow dx="0" dy="0" stdDeviation="1.8" floodColor={plate.panel.glow} floodOpacity="0.34" />
              </filter>
            </>
          )}
        </defs>
        <foreignObject x="0" y="0" width={width} height={height}>
          <span className="levelPlateImageFill" />
        </foreignObject>
        {plate.panel && (
          <g filter={`url(#${rawId}-levelPlatePanelDepth)`}>
            <rect
              x={panelX}
              y={panelY}
              width={panelWidth}
              height={panelHeight}
              rx={panelRx}
              fill={`url(#${rawId}-levelPlatePanel)`}
              stroke="#2d1703"
              strokeWidth={compact ? 0.8 : 1.2}
            />
            <rect
              x={panelX + 2}
              y={panelY + 1}
              width={Math.max(0, panelWidth - 4)}
              height={Math.max(0, Math.round(panelHeight * 0.42))}
              rx={Math.max(0, panelRx - 1)}
              fill={`url(#${rawId}-levelPlatePanelShine)`}
              opacity="0.62"
            />
            <rect
              x={panelX + 1}
              y={panelY + 1}
              width={Math.max(0, panelWidth - 2)}
              height={Math.max(0, panelHeight - 2)}
              rx={Math.max(0, panelRx - 1)}
              fill="none"
              stroke={plate.panel.stroke}
              strokeWidth={compact ? 0.9 : 1.4}
              opacity="0.88"
            />
          </g>
        )}
        <ellipse cx={centerX} cy={centerY + 1} rx={Math.round(width * plate.shadowRx)} ry={Math.round(height * plate.shadowRy)} fill="rgba(0,0,0,0.3)" />
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
            stroke="#f6d36f"
            strokeWidth={compact ? 2.7 : 3.4}
            strokeOpacity="0.72"
            fill="transparent"
            {...(fittedTextLength ? { textLength: fittedTextLength, lengthAdjust: "spacingAndGlyphs" as const } : {})}
          >
            {displayName}
          </text>
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
            strokeWidth={compact ? 1.7 : 2.4}
            fill={`url(#${rawId}-levelPlateTextGold)`}
            filter={`url(#${rawId}-levelPlateGoldText)`}
            {...(fittedTextLength ? { textLength: fittedTextLength, lengthAdjust: "spacingAndGlyphs" as const } : {})}
          >
            {displayName}
          </text>
          <text
            x={centerX}
            y={centerY + (compact ? 0 : 1)}
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily={`"Noto Serif SC", "Songti SC", "SimSun", serif`}
            fontSize={fontSize}
            fontWeight="950"
            letterSpacing="0"
            fill="#fff7c8"
            opacity="0.22"
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
            height: auto;
          }
          .xiaobaiLevelNameplateSvg.isCompact {
            width: 226px;
            height: auto;
          }
        }
        @media (max-width: 420px) {
          .xiaobaiLevelNameplateSvg.isCompact {
            width: 210px;
            height: auto;
          }
        }
      `}</style>
    </span>
  )
}
