"use client"

import { Crown, Diamond, Gem, Hexagon, LucideIcon, Shield, Sparkle, Star, Zap } from "lucide-react"
import { getNextLevel, getUserLevel, LevelTrack } from "@/data/user"

type LevelBadgeProps = {
  name: string
  xp: number
  contributionPoints?: number
  compact?: boolean
  track?: LevelTrack
  coCreatorApproved?: boolean
}

type BadgeStyle = {
  icon: LucideIcon
  shape: string
  bg: string
  glow: string
}

type CoCreatorStage = {
  shortName: string
  fullName: string
  className: string
  icon: LucideIcon
  seal: string
  motif: string
  nextLabel: string
}

const badgeStyles: Record<number, BadgeStyle> = {
  0: { icon: Hexagon, shape: "22% 78% 78% 22% / 50% 50% 50% 50%", bg: "linear-gradient(145deg,#f5f5f5,#8f8f8f)", glow: "rgba(190,190,190,0.35)" },
  1: { icon: Sparkle, shape: "50%", bg: "radial-gradient(circle at 35% 20%,#fff3c4,#d08a42 62%,#6d3d16)", glow: "rgba(255,170,80,0.48)" },
  2: { icon: Star, shape: "30% 70% 70% 30% / 30% 30% 70% 70%", bg: "linear-gradient(145deg,#ffffff,#9fb2c8 58%,#43556a)", glow: "rgba(210,232,255,0.5)" },
  3: { icon: Zap, shape: "12px", bg: "radial-gradient(circle at 32% 24%,#fff6bd,#c9a84c 58%,#6d541d)", glow: "rgba(255,216,96,0.58)" },
  4: { icon: Gem, shape: "18% 82% 50% 50% / 24% 24% 76% 76%", bg: "linear-gradient(145deg,#dffff9,#26d7c6 52%,#11756d)", glow: "rgba(38,215,198,0.62)" },
  5: { icon: Diamond, shape: "26% 74% 50% 50% / 28% 28% 72% 72%", bg: "linear-gradient(145deg,#ffffff,#b692ff 52%,#5932a6)", glow: "rgba(182,146,255,0.72)" },
  6: { icon: Crown, shape: "14px", bg: "linear-gradient(145deg,#fff8c8 0%,#ffd86b 38%,#ffad2f 72%,#714205 100%)", glow: "rgba(255,216,107,0.86)" },
  7: { icon: Diamond, shape: "22% 78% 50% 50% / 26% 26% 74% 74%", bg: "linear-gradient(145deg,#ffffff 0%,#bff8ff 28%,#47d9ff 58%,#7f66ff 100%)", glow: "rgba(126,231,255,0.95)" },
}

const coCreatorStages: Record<number, CoCreatorStage> = {
  15: { shortName: "共创伙伴", fullName: "小白AI共创伙伴", className: "partner", icon: Shield, seal: "共", motif: "金纹", nextLabel: "升级看贡献" },
  16: { shortName: "共创顾问", fullName: "小白AI共创顾问", className: "advisor", icon: Crown, seal: "顾", motif: "焰纹", nextLabel: "解锁顾问名牌" },
  17: { shortName: "共创导师", fullName: "小白AI共创导师", className: "mentor", icon: Zap, seal: "导", motif: "风纹", nextLabel: "解锁导师名牌" },
  18: { shortName: "共创合伙人", fullName: "小白AI共创合伙人", className: "partnerPlus", icon: Star, seal: "合", motif: "星环", nextLabel: "解锁合伙人名牌" },
  19: { shortName: "共创神", fullName: "小白AI共创神", className: "legend", icon: Diamond, seal: "神", motif: "天穹", nextLabel: "最高共创名牌" },
}

function getCoCreatorStage(level: number) {
  if (level >= 19) return coCreatorStages[19]
  if (level >= 18) return coCreatorStages[18]
  if (level >= 17) return coCreatorStages[17]
  if (level >= 16) return coCreatorStages[16]
  return coCreatorStages[15]
}

function CoCreatorBadge({
  name,
  level,
  next,
  contributionPoints,
  progress,
  compact,
}: {
  name: string
  level: ReturnType<typeof getUserLevel>
  next: ReturnType<typeof getNextLevel>
  contributionPoints: number
  progress: number
  compact: boolean
}) {
  const stage = getCoCreatorStage(level.level)
  const StageIcon = stage.icon
  const nextText = next?.requiresContribution ? `还差 ${next.need} 贡献` : "最高共创"
  const targetText = next?.requiresContribution ? `${contributionPoints}/${contributionPoints + next.need}` : `${contributionPoints}`

  return (
    <span
      className={`coCreatorBadge coCreatorBadge-${stage.className} ${compact ? "isCompact" : ""}`}
      title={`LV.${level.level} ${stage.fullName} · ${contributionPoints} 贡献值 · ${level.desc}`}
    >
      <span className="coCreatorAura" aria-hidden="true" />
      <span className="coCreatorPlate" aria-hidden="true" />
      <span className="coCreatorIconWrap" aria-hidden="true">
        <span className="coCreatorSeal">{stage.seal}</span>
        <span className="coCreatorMascotFrame">
          <img src="/xiaobai-mascot-cutout.png" alt="" className="coCreatorMascot" />
        </span>
        <span className="coCreatorRankIcon">
          <StageIcon size={compact ? 12 : 14} strokeWidth={2.5} />
        </span>
      </span>
      <span className="coCreatorContent">
        <span className="coCreatorTopline">
          <span className="coCreatorName">{name}</span>
          <span className="coCreatorLevel">LV.{level.level}</span>
        </span>
        <span className="coCreatorTitle">{stage.shortName}</span>
        <span className="coCreatorMeta">
          <span>{stage.motif}</span>
          <span>{targetText} 贡献</span>
        </span>
        {!compact && (
          <span className="coCreatorProgress" aria-hidden="true">
            <span style={{ width: `${progress}%` }} />
          </span>
        )}
      </span>
      <span className="coCreatorNext">{compact ? nextText : stage.nextLabel}</span>
      <style>{`
        .coCreatorBadge {
          --stage-main: #ffd86b;
          --stage-soft: rgba(255,216,107,0.2);
          --stage-deep: #251805;
          --stage-glow: rgba(255,216,107,0.42);
          display: inline-grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          align-items: center;
          gap: 11px;
          width: 330px;
          min-height: 74px;
          padding: 10px 14px 10px 10px;
          color: #fff;
          position: relative;
          isolation: isolate;
          overflow: hidden;
          border: 1px solid color-mix(in srgb, var(--stage-main) 76%, #fff 8%);
          border-radius: 14px;
          background:
            radial-gradient(circle at 18% 38%, rgba(255,255,255,0.2), transparent 18%),
            linear-gradient(135deg, color-mix(in srgb, var(--stage-main) 22%, transparent), rgba(255,255,255,0.055) 38%, var(--stage-deep));
          box-shadow: 0 0 26px var(--stage-glow), inset 0 0 0 1px rgba(255,255,255,0.1);
          clip-path: polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px));
          text-decoration: none;
          vertical-align: middle;
        }
        .coCreatorBadge.isCompact {
          width: 238px;
          min-height: 62px;
          gap: 9px;
          padding: 8px 11px 8px 8px;
          border-radius: 12px;
        }
        .coCreatorBadge-advisor {
          --stage-main: #ffcf5a;
          --stage-soft: rgba(255,207,90,0.24);
          --stage-deep: #2d1505;
          --stage-glow: rgba(255,164,46,0.48);
          clip-path: polygon(12px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 12px);
        }
        .coCreatorBadge-mentor {
          --stage-main: #32dccd;
          --stage-soft: rgba(50,220,205,0.24);
          --stage-deep: #041d22;
          --stage-glow: rgba(50,220,205,0.46);
          clip-path: polygon(0 0, 100% 0, calc(100% - 12px) 100%, 0 100%);
        }
        .coCreatorBadge-partnerPlus {
          --stage-main: #b692ff;
          --stage-soft: rgba(182,146,255,0.24);
          --stage-deep: #160b2d;
          --stage-glow: rgba(182,146,255,0.52);
          clip-path: polygon(0 16px, 16px 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%);
        }
        .coCreatorBadge-legend {
          --stage-main: #7ee7ff;
          --stage-soft: rgba(126,231,255,0.28);
          --stage-deep: #08061f;
          --stage-glow: rgba(126,231,255,0.72);
          border-color: rgba(255,246,199,0.9);
          background:
            radial-gradient(circle at 22% 38%, rgba(255,255,255,0.26), transparent 18%),
            radial-gradient(circle at 78% 24%, rgba(255,216,107,0.28), transparent 22%),
            linear-gradient(135deg, rgba(126,231,255,0.26), rgba(255,216,107,0.14) 30%, rgba(182,146,255,0.22) 58%, #08061f);
          box-shadow: 0 0 34px rgba(126,231,255,0.76), 0 0 68px rgba(182,146,255,0.42), inset 0 0 0 1px rgba(255,255,255,0.18);
          clip-path: polygon(0 0, calc(100% - 22px) 0, 100% 50%, calc(100% - 22px) 100%, 0 100%, 12px 50%);
        }
        .coCreatorPlate {
          position: absolute;
          inset: 3px;
          z-index: -2;
          opacity: 0.68;
          background:
            repeating-linear-gradient(130deg, transparent 0 13px, var(--stage-soft) 13px 14px, transparent 14px 26px),
            linear-gradient(90deg, rgba(255,255,255,0.09), transparent 62%);
          border-radius: 12px;
          pointer-events: none;
        }
        .coCreatorAura {
          position: absolute;
          right: -24px;
          top: -34px;
          width: 118px;
          height: 118px;
          border-radius: 50%;
          background: radial-gradient(circle, var(--stage-soft), transparent 62%);
          z-index: -1;
          pointer-events: none;
        }
        .coCreatorIconWrap {
          width: 52px;
          height: 52px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          position: relative;
          flex-shrink: 0;
        }
        .isCompact .coCreatorIconWrap {
          width: 44px;
          height: 44px;
        }
        .coCreatorMascotFrame {
          width: 46px;
          height: 46px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: linear-gradient(145deg, #fff, var(--stage-main) 42%, var(--stage-deep));
          border: 1px solid rgba(255,255,255,0.76);
          border-radius: 16px 8px 16px 8px;
          box-shadow: 0 0 20px var(--stage-glow), inset 0 2px 9px rgba(255,255,255,0.78), inset 0 -10px 16px rgba(0,0,0,0.24);
          transform: rotate(45deg);
        }
        .coCreatorBadge-mentor .coCreatorMascotFrame {
          border-radius: 10px 20px 10px 20px;
          transform: skewX(-8deg);
        }
        .coCreatorBadge-partnerPlus .coCreatorMascotFrame {
          border-radius: 50%;
          transform: none;
        }
        .coCreatorBadge-legend .coCreatorMascotFrame {
          border-radius: 30% 70% 50% 50% / 28% 28% 72% 72%;
          transform: rotate(45deg);
        }
        .isCompact .coCreatorMascotFrame {
          width: 39px;
          height: 39px;
        }
        .coCreatorMascot {
          width: 54px;
          height: 54px;
          object-fit: contain;
          transform: rotate(-45deg) translateY(2px);
          filter: drop-shadow(0 2px 3px rgba(0,0,0,0.34));
        }
        .coCreatorBadge-mentor .coCreatorMascot {
          transform: skewX(8deg) translateY(2px);
        }
        .coCreatorBadge-partnerPlus .coCreatorMascot {
          transform: translateY(2px);
        }
        .isCompact .coCreatorMascot {
          width: 46px;
          height: 46px;
        }
        .coCreatorSeal {
          position: absolute;
          left: -3px;
          top: -5px;
          z-index: 3;
          min-width: 19px;
          height: 19px;
          border-radius: 6px 2px 6px 2px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #0b0b0b;
          background: var(--stage-main);
          border: 1px solid rgba(255,255,255,0.7);
          font-size: 11px;
          font-weight: 950;
          box-shadow: 0 3px 12px var(--stage-glow);
        }
        .coCreatorRankIcon {
          position: absolute;
          right: -2px;
          bottom: -2px;
          z-index: 3;
          width: 23px;
          height: 23px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #0b0b0b;
          background: linear-gradient(145deg, #fff, var(--stage-main));
          border: 1px solid rgba(255,255,255,0.74);
          box-shadow: 0 3px 12px var(--stage-glow);
        }
        .isCompact .coCreatorRankIcon {
          width: 20px;
          height: 20px;
        }
        .coCreatorContent {
          display: flex;
          flex-direction: column;
          min-width: 0;
          line-height: 1.05;
          position: relative;
          z-index: 2;
        }
        .coCreatorTopline {
          display: flex;
          align-items: center;
          gap: 7px;
          min-width: 0;
        }
        .coCreatorName {
          color: #fff;
          font-size: 13px;
          font-weight: 950;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 88px;
        }
        .coCreatorLevel {
          color: #090909;
          background: var(--stage-main);
          border-radius: 5px;
          padding: 2px 5px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          font-weight: 950;
          box-shadow: 0 0 12px var(--stage-glow);
        }
        .coCreatorTitle {
          color: #fff;
          font-size: 18px;
          font-weight: 950;
          margin-top: 5px;
          white-space: nowrap;
          text-shadow: 0 0 14px var(--stage-glow);
        }
        .isCompact .coCreatorTitle {
          font-size: 14px;
          margin-top: 4px;
        }
        .coCreatorMeta {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 6px;
          color: color-mix(in srgb, var(--stage-main) 82%, #fff 18%);
          font-size: 11px;
          font-weight: 900;
          white-space: nowrap;
        }
        .isCompact .coCreatorMeta {
          display: none;
        }
        .coCreatorProgress {
          height: 4px;
          margin-top: 8px;
          border-radius: 999px;
          background: rgba(255,255,255,0.14);
          overflow: hidden;
        }
        .coCreatorProgress span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, var(--stage-main), #fff);
          box-shadow: 0 0 12px var(--stage-glow);
        }
        .coCreatorNext {
          align-self: stretch;
          min-width: 48px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding-left: 9px;
          border-left: 1px solid rgba(255,255,255,0.16);
          color: color-mix(in srgb, var(--stage-main) 78%, #fff 22%);
          font-size: 11px;
          font-weight: 950;
          writing-mode: vertical-rl;
          letter-spacing: 0;
          white-space: nowrap;
        }
        .isCompact .coCreatorNext {
          display: none;
        }
        .coCreatorBadge::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 4;
          background: linear-gradient(110deg, transparent 0%, transparent 36%, rgba(255,255,255,0.25) 48%, transparent 60%, transparent 100%);
          transform: translateX(-78%);
          animation: coCreatorBadgeShine 2.9s ease-in-out infinite;
          pointer-events: none;
        }
        .coCreatorBadge-legend::after {
          animation-duration: 2.15s;
          background: linear-gradient(110deg, transparent 0%, transparent 34%, rgba(255,246,199,0.42) 48%, transparent 62%, transparent 100%);
        }
        @keyframes coCreatorBadgeShine {
          0% { transform: translateX(-82%); }
          68%, 100% { transform: translateX(82%); }
        }
        @media (max-width: 860px) {
          .coCreatorBadge.isCompact {
            width: 174px;
            min-height: 50px;
            gap: 7px;
            padding: 6px 9px 6px 6px;
          }
          .coCreatorBadge.isCompact .coCreatorIconWrap {
            width: 36px;
            height: 36px;
          }
          .coCreatorBadge.isCompact .coCreatorMascotFrame {
            width: 33px;
            height: 33px;
            border-radius: 12px 6px 12px 6px;
          }
          .coCreatorBadge.isCompact .coCreatorMascot {
            width: 40px;
            height: 40px;
          }
          .coCreatorBadge.isCompact .coCreatorName {
            max-width: 58px;
            font-size: 11px;
          }
          .coCreatorBadge.isCompact .coCreatorLevel {
            font-size: 9px;
            padding: 1px 4px;
          }
          .coCreatorBadge.isCompact .coCreatorTitle {
            font-size: 13px;
          }
          .coCreatorBadge.isCompact .coCreatorSeal {
            min-width: 17px;
            height: 17px;
            font-size: 10px;
          }
          .coCreatorBadge.isCompact .coCreatorRankIcon {
            width: 18px;
            height: 18px;
          }
        }
        @media (max-width: 420px) {
          .coCreatorBadge.isCompact {
            width: 148px;
          }
          .coCreatorBadge.isCompact .coCreatorName {
            max-width: 42px;
          }
          .coCreatorBadge.isCompact .coCreatorTitle {
            font-size: 12px;
          }
        }
      `}</style>
    </span>
  )
}

export function LevelBadge({ name, xp, contributionPoints = 0, compact = false, track = "personal", coCreatorApproved = false }: LevelBadgeProps) {
  const levelAccess = { coCreatorApproved, contributionPoints }
  const level = getUserLevel(xp, track, levelAccess)
  const next = getNextLevel(xp, track, levelAccess)
  const isCoCreator = coCreatorApproved && level.level >= 15
  const progress = next?.requiresReview
    ? 100
    : next?.requiresContribution
      ? Math.min(100, Math.max(8, Math.round((contributionPoints / Math.max(1, contributionPoints + next.need)) * 100)))
      : next
        ? Math.min(100, Math.round(((xp - level.minXP) / (next.level.minXP - level.minXP)) * 100))
        : 100

  if (isCoCreator) {
    return (
      <CoCreatorBadge
        name={name}
        level={level}
        next={next}
        contributionPoints={contributionPoints}
        progress={progress}
        compact={compact}
      />
    )
  }

  const xpLabel = next?.requiresReview
    ? `${xp} XP · 共创待审核`
    : next
      ? `${xp} XP`
      : "已达最高档"
  const visual = badgeStyles[level.level] || badgeStyles[0]
  const Icon = visual.icon
  const isHigh = level.level >= 4
  const isCrown = level.level === 6

  return (
    <span
      title={`${level.name} · ${xpLabel} · ${level.desc}${next ? next.requiresReview ? ` · 达到共创门槛，需人工审核后解锁 ${next.level.name}` : ` · 距离 ${next.level.name} 还差 ${next.need} XP` : " · 已达最高档"}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: compact ? 7 : 10,
        minWidth: compact ? 0 : 174,
        padding: compact ? "5px 9px 5px 6px" : "6px 13px 6px 7px",
        borderRadius: 999,
        border: `1px solid ${level.color}`,
        background: isCrown
          ? "linear-gradient(135deg, rgba(255,216,107,0.18), rgba(255,255,255,0.08) 42%, rgba(0,0,0,0.72)), linear-gradient(90deg, rgba(255,255,255,0.14), transparent)"
          : `linear-gradient(135deg, rgba(255,255,255,0.055), rgba(0,0,0,0.58)), linear-gradient(135deg, ${level.color}22, transparent 62%)`,
        boxShadow: isHigh
          ? `0 0 24px ${visual.glow}, inset 0 0 0 1px rgba(255,255,255,0.1)`
          : "inset 0 0 0 1px rgba(255,255,255,0.05)",
        color: "#fff",
        textDecoration: "none",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: compact ? 26 : 34,
          height: compact ? 26 : 34,
          borderRadius: visual.shape,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          color: level.level <= 1 ? "#211405" : "#071416",
          background: visual.bg,
          boxShadow: `0 0 18px ${visual.glow}, inset 0 1px 7px rgba(255,255,255,0.78), inset 0 -8px 12px rgba(0,0,0,0.2)`,
          transform: level.level >= 4 && !isCrown ? "rotate(45deg)" : "none",
          border: "1px solid rgba(255,255,255,0.55)",
          position: "relative",
        }}
      >
        <Icon
          size={compact ? 15 : 18}
          strokeWidth={2.5}
          fill={isCrown ? "#ffe28a" : "none"}
          color={isCrown ? "#5c3500" : undefined}
          style={{ transform: level.level >= 4 && !isCrown ? "rotate(-45deg)" : "none", filter: isCrown ? "drop-shadow(0 2px 2px rgba(0,0,0,0.3))" : undefined }}
        />
      </span>
      <span style={{ display: "flex", flexDirection: "column", minWidth: 0, lineHeight: 1.1, position: "relative", zIndex: 2 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ maxWidth: compact ? 70 : 92, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 12, fontWeight: 950, color: "#fff" }}>
            {name}
          </span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 900, color: level.accent, letterSpacing: 0 }}>
            LV.{level.level}
          </span>
        </span>
        {!compact && (
          <span style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 5 }}>
            <span style={{ color: level.accent, fontSize: 10, fontWeight: 950, whiteSpace: "nowrap" }}>
              {isCrown ? "皇冠领航" : level.name}
            </span>
            <span style={{ flex: 1, height: 3, minWidth: 38, borderRadius: 999, background: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
              <span style={{ display: "block", width: `${progress}%`, height: "100%", borderRadius: 999, background: `linear-gradient(90deg, ${level.color}, ${level.accent})` }} />
            </span>
          </span>
        )}
      </span>
      {isHigh && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(110deg, transparent 0%, transparent 34%, ${level.accent}2e 48%, transparent 62%, transparent 100%)`,
            transform: "translateX(-35%)",
            pointerEvents: "none",
            animation: level.level >= 6 ? "levelShine 2.6s ease-in-out infinite" : "none",
          }}
        />
      )}
      <style>{`
        @keyframes levelShine {
          0% { transform: translateX(-80%); }
          70%, 100% { transform: translateX(80%); }
        }
      `}</style>
    </span>
  )
}
