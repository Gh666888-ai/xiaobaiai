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
  beast: string
  beastLine: string
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
  15: { shortName: "共创伙伴", fullName: "小白AI共创伙伴", className: "partner", icon: Shield, seal: "共", motif: "玄武镇印", beast: "玄武", beastLine: "龟蛇护阵", nextLabel: "升级看贡献" },
  16: { shortName: "共创顾问", fullName: "小白AI共创顾问", className: "advisor", icon: Crown, seal: "顾", motif: "朱雀焰羽", beast: "朱雀", beastLine: "赤羽流火", nextLabel: "解锁顾问名牌" },
  17: { shortName: "共创导师", fullName: "小白AI共创导师", className: "mentor", icon: Zap, seal: "导", motif: "白虎风刃", beast: "白虎", beastLine: "金风破阵", nextLabel: "解锁导师名牌" },
  18: { shortName: "共创合伙人", fullName: "小白AI共创合伙人", className: "partnerPlus", icon: Star, seal: "合", motif: "青龙云雷", beast: "青龙", beastLine: "云雷绕身", nextLabel: "解锁合伙人名牌" },
  19: { shortName: "共创神", fullName: "小白AI共创神", className: "legend", icon: Diamond, seal: "神", motif: "麒麟龙凤", beast: "麒麟", beastLine: "龙凤天纹", nextLabel: "最高共创名牌" },
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
  compact,
}: {
  name: string
  level: ReturnType<typeof getUserLevel>
  next: ReturnType<typeof getNextLevel>
  contributionPoints: number
  compact: boolean
}) {
  const stage = getCoCreatorStage(level.level)
  const StageIcon = stage.icon
  const targetText = next?.requiresContribution ? `${contributionPoints}/${contributionPoints + next.need}` : `${contributionPoints}`

  return (
    <span
      className={`coCreatorBadge coCreatorBadge-${stage.className} ${compact ? "isCompact" : ""}`}
      title={`LV.${level.level} ${stage.fullName} · ${contributionPoints} 贡献值 · ${level.desc}`}
    >
      <span className="coCreatorAura" aria-hidden="true" />
      <span className="coCreatorPlate" aria-hidden="true" />
      <span className="coCreatorColumnCap isLeft" aria-hidden="true" />
      <span className="coCreatorColumnCap isRight" aria-hidden="true" />
      <span className="coCreatorWrapRibbon ribbonOne" aria-hidden="true" />
      <span className="coCreatorWrapRibbon ribbonTwo" aria-hidden="true" />
      <span className="coCreatorBeastWrap beastDragon" aria-hidden="true">龍</span>
      <span className="coCreatorBeastWrap beastPhoenix" aria-hidden="true">鳳</span>
      <span className="coCreatorDragon" aria-hidden="true">龍</span>
      <span className="coCreatorPhoenix" aria-hidden="true">鳳</span>
      <span className="coCreatorBeastLine" aria-hidden="true">{stage.beast} · {stage.beastLine}</span>
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
          {level.level < 19 && <span className="coCreatorLevel">LV.{level.level}</span>}
        </span>
        <span className="coCreatorTitle">{stage.shortName}</span>
        <span className="coCreatorMeta">
          <span>{stage.motif}</span>
          <span className="coCreatorContribution">{targetText} 贡献</span>
        </span>
      </span>
      <style>{`
        .coCreatorBadge {
          --stage-main: #ffd86b;
          --stage-soft: rgba(255,216,107,0.2);
          --stage-deep: #251805;
          --stage-glow: rgba(255,216,107,0.42);
          display: inline-grid;
          grid-template-columns: auto minmax(0, 1fr);
          align-items: center;
          gap: 9px;
          width: 246px;
          min-height: 58px;
          padding: 6px 13px 6px 8px;
          color: #fff;
          position: relative;
          isolation: isolate;
          overflow: hidden;
          border: 1px solid color-mix(in srgb, var(--stage-main) 76%, #fff 8%);
          border-radius: 999px 18px 18px 999px;
          background:
            radial-gradient(circle at 18% 38%, rgba(255,255,255,0.18), transparent 17%),
            radial-gradient(circle at 82% 20%, var(--stage-soft), transparent 24%),
            linear-gradient(135deg, color-mix(in srgb, var(--stage-main) 20%, transparent), rgba(255,255,255,0.045) 36%, var(--stage-deep));
          box-shadow: 0 0 18px var(--stage-glow), inset 12px 0 20px rgba(255,255,255,0.12), inset -18px 0 22px rgba(0,0,0,0.24), inset 0 0 0 1px rgba(255,255,255,0.1);
          clip-path: none;
          text-decoration: none;
          vertical-align: middle;
        }
        .coCreatorBadge.isCompact {
          width: 226px;
          min-height: 56px;
          gap: 8px;
          padding: 6px 12px 6px 8px;
          border-radius: 999px 16px 16px 999px;
        }
        .coCreatorBadge-partner {
          --stage-main: #73d6c7;
          --stage-soft: rgba(115,214,199,0.22);
          --stage-deep: #071b18;
          --stage-glow: rgba(115,214,199,0.36);
        }
        .coCreatorBadge-advisor {
          --stage-main: #ff7a45;
          --stage-soft: rgba(255,122,69,0.26);
          --stage-deep: #260904;
          --stage-glow: rgba(255,122,69,0.46);
        }
        .coCreatorBadge-mentor {
          --stage-main: #f3e9d0;
          --stage-soft: rgba(243,233,208,0.22);
          --stage-deep: #10141b;
          --stage-glow: rgba(243,233,208,0.42);
        }
        .coCreatorBadge-partnerPlus {
          --stage-main: #56e4ff;
          --stage-soft: rgba(86,228,255,0.26);
          --stage-deep: #05142d;
          --stage-glow: rgba(86,228,255,0.52);
        }
        .coCreatorBadge-legend {
          --stage-main: #ffe58a;
          --stage-soft: rgba(255,189,59,0.34);
          --stage-deep: #110801;
          --stage-glow: rgba(255,204,76,0.82);
          width: 318px;
          min-height: 74px;
          grid-template-columns: 54px minmax(0, 1fr);
          gap: 12px;
          padding: 8px 24px 8px 13px;
          border: 1px solid rgba(255,236,160,0.96);
          border-radius: 18px;
          background:
            radial-gradient(circle at 19% 44%, rgba(255,252,214,0.32), transparent 16%),
            radial-gradient(circle at 52% -20%, rgba(255,222,104,0.54), transparent 34%),
            radial-gradient(circle at 86% 30%, rgba(255,83,23,0.34), transparent 27%),
            radial-gradient(circle at 65% 105%, rgba(255,179,42,0.36), transparent 30%),
            linear-gradient(180deg, #3b2105 0%, #130903 43%, #070403 100%);
          box-shadow:
            0 0 28px rgba(255,207,76,0.78),
            0 0 72px rgba(255,106,0,0.32),
            inset 0 0 0 1px rgba(255,255,255,0.2),
            inset 0 10px 20px rgba(255,232,142,0.16),
            inset 0 -18px 24px rgba(0,0,0,0.64);
          clip-path: polygon(0 50%, 7% 0, 93% 0, 100% 50%, 93% 100%, 7% 100%);
        }
        .coCreatorPlate {
          position: absolute;
          inset: 2px;
          z-index: -2;
          opacity: 0.76;
          background:
            linear-gradient(90deg, rgba(255,255,255,0.16), transparent 18%, transparent 72%, rgba(255,255,255,0.08)),
            radial-gradient(ellipse at 84% 48%, var(--stage-soft), transparent 35%),
            radial-gradient(ellipse at 9% 46%, rgba(255,255,255,0.16), transparent 30%),
            repeating-linear-gradient(155deg, transparent 0 12px, var(--stage-soft) 12px 13px, transparent 13px 24px);
          border-radius: inherit;
          pointer-events: none;
        }
        .coCreatorAura {
          position: absolute;
          right: -18px;
          top: -24px;
          width: 92px;
          height: 92px;
          border-radius: 50%;
          background: radial-gradient(circle, var(--stage-soft), transparent 62%);
          z-index: -1;
          pointer-events: none;
        }
        .coCreatorColumnCap {
          position: absolute;
          top: 5px;
          bottom: 5px;
          z-index: -1;
          width: 34px;
          border-radius: 999px;
          background: linear-gradient(90deg, rgba(255,255,255,0.18), var(--stage-soft), transparent);
          box-shadow: inset 0 0 14px rgba(255,255,255,0.12);
          pointer-events: none;
        }
        .coCreatorColumnCap.isLeft {
          left: 5px;
        }
        .coCreatorColumnCap.isRight {
          right: 6px;
          transform: scaleX(-1);
          opacity: 0.72;
        }
        .coCreatorWrapRibbon {
          position: absolute;
          left: 46px;
          right: 12px;
          height: 16px;
          z-index: -1;
          border-radius: 999px;
          border-top: 1px solid color-mix(in srgb, var(--stage-main) 66%, transparent);
          border-bottom: 1px solid rgba(255,255,255,0.08);
          background: linear-gradient(90deg, transparent, var(--stage-soft), transparent);
          filter: drop-shadow(0 0 8px var(--stage-glow));
          pointer-events: none;
        }
        .coCreatorWrapRibbon.ribbonOne {
          top: 13px;
          transform: skewX(-18deg) rotate(-4deg);
        }
        .coCreatorWrapRibbon.ribbonTwo {
          bottom: 12px;
          transform: skewX(18deg) rotate(4deg);
          opacity: 0.78;
        }
        .coCreatorBeastWrap {
          position: absolute;
          z-index: 0;
          color: var(--stage-main);
          font-family: 'Noto Serif SC', 'Noto Sans SC', serif;
          font-size: 22px;
          font-weight: 950;
          line-height: 1;
          opacity: 0.8;
          text-shadow: 0 0 12px var(--stage-glow);
          pointer-events: none;
        }
        .coCreatorBeastWrap::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          width: 58px;
          height: 20px;
          border: 2px solid color-mix(in srgb, var(--stage-main) 58%, transparent);
          border-left-color: transparent;
          border-bottom-color: transparent;
          border-radius: 50%;
          filter: drop-shadow(0 0 7px var(--stage-glow));
          transform: translate(-50%, -50%) rotate(-18deg);
        }
        .coCreatorBeastWrap.beastDragon {
          left: 56px;
          top: 7px;
          transform: rotate(-14deg);
        }
        .coCreatorBeastWrap.beastPhoenix {
          right: 20px;
          bottom: 8px;
          transform: rotate(12deg);
        }
        .coCreatorBeastWrap.beastPhoenix::after {
          transform: translate(-50%, -50%) rotate(164deg);
        }
        .coCreatorDragon,
        .coCreatorPhoenix {
          position: absolute;
          top: 50%;
          z-index: -1;
          color: var(--stage-main);
          font-family: 'Noto Serif SC', 'Noto Sans SC', serif;
          font-size: 48px;
          font-weight: 950;
          letter-spacing: 0;
          line-height: 1;
          opacity: 0.16;
          text-shadow: 0 0 18px var(--stage-glow);
          white-space: nowrap;
        }
        .coCreatorDragon {
          left: 66px;
          transform: translateY(-52%) skewX(-14deg) rotate(-8deg);
        }
        .coCreatorPhoenix {
          right: 18px;
          transform: translateY(-48%) skewX(12deg) rotate(8deg);
        }
        .coCreatorBadge-legend .coCreatorDragon,
        .coCreatorBadge-legend .coCreatorPhoenix {
          top: 50%;
          z-index: -1;
          font-size: 70px;
          opacity: 0.34;
          color: #ffe9a6;
          text-shadow: 0 0 10px #ffefb0, 0 0 28px rgba(255,139,31,0.92);
        }
        .coCreatorBadge-legend .coCreatorDragon {
          left: 62px;
          transform: translateY(-58%) skewX(-18deg) rotate(-13deg) scaleX(1.14);
        }
        .coCreatorBadge-legend .coCreatorPhoenix {
          right: 26px;
          transform: translateY(-43%) skewX(16deg) rotate(12deg) scaleX(1.08);
        }
        .coCreatorBadge-legend .coCreatorPlate {
          inset: 5px 9px;
          opacity: 1;
          border: 1px solid rgba(255,231,142,0.36);
          border-radius: 12px;
          background:
            linear-gradient(90deg, transparent 0%, rgba(255,232,139,0.22) 12%, transparent 23%, transparent 77%, rgba(255,232,139,0.18) 88%, transparent 100%),
            radial-gradient(ellipse at 50% 50%, rgba(255,203,68,0.2), transparent 60%),
            repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0 1px, transparent 1px 12px);
          clip-path: polygon(0 50%, 6% 0, 94% 0, 100% 50%, 94% 100%, 6% 100%);
        }
        .coCreatorBadge-legend .coCreatorAura {
          right: -28px;
          top: -38px;
          width: 142px;
          height: 142px;
          background:
            radial-gradient(circle, rgba(255,226,128,0.58) 0%, rgba(255,128,22,0.2) 42%, transparent 68%);
        }
        .coCreatorBadge-legend .coCreatorColumnCap {
          top: 10px;
          bottom: 10px;
          width: 42px;
          opacity: 0.9;
          background: linear-gradient(90deg, rgba(255,246,190,0.32), rgba(255,190,50,0.22), transparent);
        }
        .coCreatorBadge-legend .coCreatorColumnCap.isLeft {
          left: 12px;
        }
        .coCreatorBadge-legend .coCreatorColumnCap.isRight {
          right: 12px;
        }
        .coCreatorBadge-legend .coCreatorWrapRibbon {
          left: 55px;
          right: 22px;
          height: 20px;
          border-top-color: rgba(255,232,142,0.64);
          border-bottom-color: rgba(255,125,25,0.22);
          background: linear-gradient(90deg, transparent, rgba(255,203,67,0.3), rgba(255,84,24,0.16), transparent);
          filter: drop-shadow(0 0 11px rgba(255,191,54,0.72));
        }
        .coCreatorBadge-legend .coCreatorWrapRibbon.ribbonOne {
          top: 16px;
          transform: skewX(-21deg) rotate(-5deg);
        }
        .coCreatorBadge-legend .coCreatorWrapRibbon.ribbonTwo {
          bottom: 16px;
          transform: skewX(21deg) rotate(5deg);
        }
        .coCreatorBadge-legend .coCreatorBeastWrap {
          z-index: 1;
          font-size: 29px;
          opacity: 0.92;
          color: #fff0a8;
          text-shadow: 0 0 8px #fff6c7, 0 0 22px rgba(255,124,24,0.82);
        }
        .coCreatorBadge-legend .coCreatorBeastWrap::before {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          width: 92px;
          height: 34px;
          border: 3px solid rgba(255,226,134,0.72);
          border-left-color: transparent;
          border-bottom-color: transparent;
          border-radius: 50%;
          filter: drop-shadow(0 0 9px rgba(255,177,46,0.86));
          transform: translate(-50%, -50%) rotate(-18deg);
        }
        .coCreatorBadge-legend .coCreatorBeastWrap::after {
          width: 122px;
          height: 42px;
          border-width: 3px;
          border-color: rgba(255,126,24,0.54);
          border-left-color: transparent;
          border-bottom-color: transparent;
          filter: drop-shadow(0 0 12px rgba(255,100,20,0.82));
        }
        .coCreatorBadge-legend .coCreatorBeastWrap.beastDragon {
          left: 68px;
          top: 10px;
          transform: rotate(-13deg);
        }
        .coCreatorBadge-legend .coCreatorBeastWrap.beastPhoenix {
          right: 29px;
          bottom: 10px;
          transform: rotate(12deg);
        }
        .coCreatorBadge-legend .coCreatorBeastWrap.beastPhoenix::before {
          transform: translate(-50%, -50%) rotate(160deg);
        }
        .coCreatorBadge-legend .coCreatorBeastWrap.beastPhoenix::after {
          transform: translate(-50%, -50%) rotate(184deg);
        }
        .coCreatorBeastLine {
          position: absolute;
          right: 18px;
          bottom: 5px;
          z-index: 1;
          color: color-mix(in srgb, var(--stage-main) 78%, #fff 22%);
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 0;
          opacity: 0.72;
          text-shadow: 0 0 10px var(--stage-glow);
          white-space: nowrap;
        }
        .coCreatorIconWrap {
          width: 42px;
          height: 42px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          position: relative;
          flex-shrink: 0;
        }
        .isCompact .coCreatorIconWrap {
          width: 39px;
          height: 39px;
        }
        .coCreatorMascotFrame {
          width: 37px;
          height: 37px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: linear-gradient(145deg, #fff, var(--stage-main) 42%, var(--stage-deep));
          border: 1px solid rgba(255,255,255,0.76);
          border-radius: 50%;
          box-shadow: 0 0 20px var(--stage-glow), inset 0 2px 9px rgba(255,255,255,0.78), inset 0 -10px 16px rgba(0,0,0,0.24);
          transform: none;
        }
        .coCreatorBadge-mentor .coCreatorMascotFrame {
          border-radius: 50%;
          transform: none;
        }
        .coCreatorBadge-partnerPlus .coCreatorMascotFrame {
          border-radius: 50%;
          transform: none;
        }
        .coCreatorBadge-legend .coCreatorMascotFrame {
          width: 46px;
          height: 46px;
          border-radius: 14px;
          background:
            radial-gradient(circle at 36% 20%, #fff7d6 0%, #ffd56a 33%, #9f5609 72%, #261004 100%);
          border-color: rgba(255,248,200,0.94);
          box-shadow:
            0 0 22px rgba(255,212,91,0.8),
            0 0 34px rgba(255,106,0,0.28),
            inset 0 2px 9px rgba(255,255,255,0.78),
            inset 0 -12px 18px rgba(0,0,0,0.34);
          transform: rotate(45deg);
        }
        .coCreatorBadge-legend .coCreatorMascot {
          width: 48px;
          height: 48px;
          transform: translateY(2px) rotate(-45deg);
        }
        .isCompact .coCreatorMascotFrame {
          width: 34px;
          height: 34px;
        }
        .coCreatorMascot {
          width: 45px;
          height: 45px;
          object-fit: contain;
          transform: translateY(2px);
          filter: drop-shadow(0 2px 3px rgba(0,0,0,0.34));
        }
        .coCreatorBadge-mentor .coCreatorMascot {
          transform: translateY(2px);
        }
        .coCreatorBadge-partnerPlus .coCreatorMascot {
          transform: translateY(2px);
        }
        .isCompact .coCreatorMascot {
          width: 41px;
          height: 41px;
        }
        .coCreatorSeal {
          position: absolute;
          left: -3px;
          top: -5px;
          z-index: 3;
          min-width: 18px;
          height: 18px;
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
          width: 20px;
          height: 20px;
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
          width: 18px;
          height: 18px;
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
          font-size: 12px;
          font-weight: 950;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 66px;
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
          font-size: 16px;
          font-weight: 950;
          margin-top: 5px;
          white-space: nowrap;
          text-shadow: 0 0 14px var(--stage-glow);
        }
        .coCreatorBadge-legend .coCreatorTopline {
          justify-content: center;
        }
        .coCreatorBadge-legend .coCreatorName {
          max-width: 82px;
          color: #fff6d0;
          font-size: 11px;
          text-shadow: 0 0 10px rgba(255,214,94,0.6);
        }
        .coCreatorBadge-legend .coCreatorTitle {
          align-self: center;
          margin-top: 2px;
          color: #120802;
          border: 1px solid rgba(255,248,205,0.9);
          border-radius: 9px;
          background:
            linear-gradient(180deg, #fff8cf 0%, #ffde74 36%, #d88b20 72%, #6e3508 100%);
          box-shadow:
            0 0 18px rgba(255,214,87,0.86),
            0 4px 16px rgba(0,0,0,0.46),
            inset 0 1px 0 rgba(255,255,255,0.72),
            inset 0 -7px 12px rgba(91,38,5,0.38);
          padding: 5px 20px 6px;
          font-family: 'Noto Serif SC', 'Noto Sans SC', serif;
          font-size: 22px;
          font-weight: 950;
          line-height: 1;
          text-shadow: 0 1px 0 rgba(255,250,210,0.62);
        }
        .coCreatorBadge-legend .coCreatorMeta {
          justify-content: center;
          color: #ffe9a6;
          text-shadow: 0 0 10px rgba(255,184,49,0.66);
        }
        .coCreatorBadge-legend .coCreatorContribution {
          background: rgba(24,9,0,0.58);
          border-color: rgba(255,225,132,0.54);
        }
        .isCompact .coCreatorTitle {
          font-size: 14px;
          margin-top: 4px;
        }
        .coCreatorMeta {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 4px;
          color: color-mix(in srgb, var(--stage-main) 82%, #fff 18%);
          font-size: 10px;
          font-weight: 900;
          white-space: nowrap;
        }
        .isCompact .coCreatorMeta {
          display: flex;
          font-size: 10px;
          gap: 6px;
        }
        .coCreatorContribution {
          display: inline-flex;
          align-items: center;
          border: 1px solid color-mix(in srgb, var(--stage-main) 44%, transparent);
          border-radius: 999px;
          background: rgba(0,0,0,0.22);
          padding: 1px 5px;
          color: #fff4c9;
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
          background: linear-gradient(110deg, transparent 0%, transparent 30%, rgba(255,246,199,0.62) 44%, rgba(255,151,34,0.3) 52%, transparent 66%, transparent 100%);
        }
        @keyframes coCreatorBadgeShine {
          0% { transform: translateX(-82%); }
          68%, 100% { transform: translateX(82%); }
        }
        @media (max-width: 860px) {
          .coCreatorBadge-legend {
            width: 246px;
            min-height: 64px;
            grid-template-columns: 44px minmax(0, 1fr);
            gap: 8px;
            padding: 7px 17px 7px 9px;
            border-radius: 15px;
          }
          .coCreatorBadge-legend .coCreatorTitle {
            font-size: 17px;
            padding: 4px 14px 5px;
          }
          .coCreatorBadge-legend .coCreatorMascotFrame {
            width: 38px;
            height: 38px;
            border-radius: 12px;
          }
          .coCreatorBadge-legend .coCreatorMascot {
            width: 42px;
            height: 42px;
          }
          .coCreatorBadge-legend .coCreatorDragon,
          .coCreatorBadge-legend .coCreatorPhoenix {
            font-size: 50px;
          }
          .coCreatorBadge.isCompact {
            width: 178px;
            min-height: 50px;
            gap: 7px;
            padding: 6px 9px 6px 6px;
            border-radius: 999px 14px 14px 999px;
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
          .coCreatorBadge.isCompact .coCreatorDragon {
            left: 54px;
            font-size: 34px;
            opacity: 0.18;
          }
          .coCreatorBadge.isCompact .coCreatorPhoenix {
            right: 8px;
            font-size: 34px;
            opacity: 0.18;
          }
          .coCreatorBadge.isCompact .coCreatorBeastLine {
            display: none;
          }
          .coCreatorBadge.isCompact .coCreatorWrapRibbon {
            left: 40px;
            right: 8px;
            height: 12px;
          }
          .coCreatorBadge.isCompact .coCreatorBeastWrap {
            display: none;
          }
          .coCreatorBadge-legend.isCompact .coCreatorBeastWrap {
            display: block;
            font-size: 20px;
            opacity: 0.78;
          }
          .coCreatorBadge-legend.isCompact .coCreatorBeastWrap::before,
          .coCreatorBadge-legend.isCompact .coCreatorBeastWrap::after {
            width: 64px;
            height: 24px;
            border-width: 2px;
          }
          .coCreatorBadge-legend.isCompact .coCreatorBeastWrap.beastDragon {
            left: 50px;
            top: 8px;
          }
          .coCreatorBadge-legend.isCompact .coCreatorBeastWrap.beastPhoenix {
            right: 18px;
            bottom: 8px;
          }
          .coCreatorBadge.isCompact .coCreatorMeta {
            display: none;
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
          .coCreatorBadge-legend.isCompact {
            width: 188px;
            min-height: 58px;
            padding-right: 14px;
          }
          .coCreatorBadge-legend.isCompact .coCreatorTitle {
            font-size: 15px;
            padding-inline: 10px;
          }
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
