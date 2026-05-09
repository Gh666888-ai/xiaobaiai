"use client"

import { Crown, Diamond, Gem, Hexagon, LucideIcon, Shield, Sparkle, Star, Zap } from "lucide-react"
import type { CSSProperties } from "react"
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

type LevelPlateStyle = {
  main: string
  accent: string
  deep: string
  glow: string
  frame: string
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

const levelPlateStyles: Record<number, LevelPlateStyle> = {
  0: { main: "#b9b9b9", accent: "#f4f4f4", deep: "#262626", glow: "rgba(210,210,210,0.28)", frame: "seed" },
  1: { main: "#d88738", accent: "#ffd5a3", deep: "#3b1b05", glow: "rgba(255,145,61,0.42)", frame: "ember" },
  2: { main: "#83b9ff", accent: "#f2f8ff", deep: "#0e284d", glow: "rgba(131,185,255,0.45)", frame: "iceWing" },
  3: { main: "#ffcf5a", accent: "#fff4bf", deep: "#4d3100", glow: "rgba(255,207,90,0.52)", frame: "bolt" },
  4: { main: "#cfd9e8", accent: "#ffffff", deep: "#243244", glow: "rgba(207,217,232,0.5)", frame: "silverWing" },
  5: { main: "#b692ff", accent: "#f3eaff", deep: "#2d135d", glow: "rgba(182,146,255,0.58)", frame: "purpleBlade" },
  6: { main: "#ffd86b", accent: "#fff6c7", deep: "#604005", glow: "rgba(255,216,107,0.62)", frame: "goldCrown" },
  7: { main: "#7ee7ff", accent: "#f2fdff", deep: "#08394b", glow: "rgba(126,231,255,0.62)", frame: "skyBlade" },
  8: { main: "#d7a850", accent: "#fff0b8", deep: "#4a2f04", glow: "rgba(215,168,80,0.58)", frame: "bronzeLaurel" },
  9: { main: "#ff7a45", accent: "#ffe0cf", deep: "#4a1203", glow: "rgba(255,122,69,0.62)", frame: "fireWing" },
  10: { main: "#72e6a5", accent: "#e9fff2", deep: "#073b20", glow: "rgba(114,230,165,0.55)", frame: "jade" },
  11: { main: "#ff78c9", accent: "#fff0fa", deep: "#4a0d35", glow: "rgba(255,120,201,0.58)", frame: "roseFlame" },
  12: { main: "#26d7c6", accent: "#d8fff7", deep: "#063934", glow: "rgba(38,215,198,0.62)", frame: "crystal" },
  13: { main: "#ffb347", accent: "#fff0b8", deep: "#4f1a03", glow: "rgba(255,179,71,0.7)", frame: "dragonSpark" },
  14: { main: "#ffe58a", accent: "#ffffff", deep: "#3c2304", glow: "rgba(255,229,138,0.78)", frame: "preLegend" },
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

function LevelTitlePlate({
  name,
  level,
  next,
  xpLabel,
  progress,
  compact,
}: {
  name: string
  level: ReturnType<typeof getUserLevel>
  next: ReturnType<typeof getNextLevel>
  xpLabel: string
  progress: number
  compact: boolean
}) {
  const visual = badgeStyles[level.level] || badgeStyles[0]
  const plate = levelPlateStyles[level.level] || levelPlateStyles[0]
  const Icon = visual.icon
  const cssVars = {
    "--plate-main": plate.main,
    "--plate-accent": plate.accent,
    "--plate-deep": plate.deep,
    "--plate-glow": plate.glow,
    "--plate-progress": `${progress}%`,
  } as CSSProperties

  return (
    <span
      className={`levelTitlePlate levelFrame-${plate.frame} ${compact ? "isCompact" : ""}`}
      title={`${level.name} · ${xpLabel} · ${level.desc}${next ? next.requiresReview ? ` · 达到共创门槛，需要人工审核后解锁 ${next.level.name}` : ` · 距离 ${next.level.name} 还差 ${next.need} XP` : " · 已达最高档。"}`}
      style={cssVars}
    >
      <span className="levelWing left" aria-hidden="true" />
      <span className="levelWing right" aria-hidden="true" />
      <span className="levelFlame left" aria-hidden="true" />
      <span className="levelFlame right" aria-hidden="true" />
      <span className="levelPlateCore" aria-hidden="true" />
      <span className="levelGemWrap" aria-hidden="true">
        <span className="levelGem">
          <Icon size={compact ? 14 : 17} strokeWidth={2.6} />
        </span>
      </span>
      <span className="levelPlateText">
        <span className="levelTopline">
          <span className="levelUserName">{name}</span>
          {level.level < 19 && <span className="levelNumber">LV.{level.level}</span>}
        </span>
        {!compact && (
          <span className="levelRankLine">
            <span className="levelRankName">{level.name}</span>
            <span className="levelProgress"><span /></span>
          </span>
        )}
      </span>
      <style>{`
        .levelTitlePlate {
          display: inline-grid;
          grid-template-columns: auto minmax(0, 1fr);
          align-items: center;
          gap: 9px;
          min-width: 194px;
          min-height: 50px;
          padding: 6px 14px 7px 8px;
          position: relative;
          isolation: isolate;
          overflow: visible;
          color: #fff;
          text-decoration: none;
          vertical-align: middle;
          filter: drop-shadow(0 0 14px var(--plate-glow));
        }
        .levelTitlePlate.isCompact {
          min-width: 158px;
          min-height: 43px;
          gap: 7px;
          padding: 5px 10px 5px 6px;
        }
        .levelPlateCore {
          position: absolute;
          inset: 5px 12px;
          z-index: -1;
          border: 1px solid color-mix(in srgb, var(--plate-main) 72%, #fff 14%);
          border-radius: 999px 12px 999px 12px;
          background:
            radial-gradient(ellipse at 14% 42%, rgba(255,255,255,0.32), transparent 22%),
            linear-gradient(90deg, rgba(255,255,255,0.2), transparent 13%, transparent 84%, rgba(255,255,255,0.16)),
            linear-gradient(180deg, color-mix(in srgb, var(--plate-main) 44%, #fff 10%), color-mix(in srgb, var(--plate-main) 20%, var(--plate-deep) 48%) 48%, var(--plate-deep));
          box-shadow: inset 0 2px 0 rgba(255,255,255,0.26), inset 0 -2px 0 rgba(0,0,0,0.3), 0 0 18px var(--plate-glow);
        }
        .levelWing {
          position: absolute;
          top: 12px;
          width: 42px;
          height: 26px;
          z-index: -2;
          background: linear-gradient(135deg, var(--plate-accent), var(--plate-main) 45%, transparent 72%);
          clip-path: polygon(0 50%, 100% 0, 76% 38%, 100% 50%, 76% 62%, 100% 100%);
          opacity: 0.82;
          filter: drop-shadow(0 0 8px var(--plate-glow));
        }
        .levelWing.left {
          left: -24px;
        }
        .levelWing.right {
          right: -24px;
          transform: scaleX(-1);
        }
        .levelFlame {
          position: absolute;
          top: 0;
          width: 26px;
          height: 22px;
          z-index: -1;
          background: radial-gradient(circle at 55% 70%, var(--plate-accent), transparent 34%), linear-gradient(135deg, #ff5a20, var(--plate-main));
          clip-path: polygon(50% 0, 70% 36%, 100% 16%, 82% 66%, 55% 100%, 18% 74%, 0 26%, 32% 40%);
          opacity: 0;
          filter: drop-shadow(0 0 8px rgba(255,91,32,0.72));
        }
        .levelFlame.left {
          left: 12px;
        }
        .levelFlame.right {
          right: 12px;
          transform: scaleX(-1);
        }
        .levelFrame-fireWing .levelFlame,
        .levelFrame-roseFlame .levelFlame,
        .levelFrame-dragonSpark .levelFlame,
        .levelFrame-preLegend .levelFlame,
        .levelFrame-goldCrown .levelFlame {
          opacity: 0.82;
        }
        .levelFrame-seed .levelWing { opacity: 0.28; width: 28px; }
        .levelFrame-ember .levelWing { opacity: 0.46; }
        .levelFrame-iceWing .levelWing,
        .levelFrame-silverWing .levelWing { clip-path: polygon(0 50%, 88% 4%, 72% 38%, 100% 50%, 72% 62%, 88% 96%); }
        .levelFrame-purpleBlade .levelWing,
        .levelFrame-skyBlade .levelWing { clip-path: polygon(0 50%, 100% 8%, 72% 50%, 100% 92%); }
        .levelFrame-bronzeLaurel .levelWing,
        .levelFrame-jade .levelWing { clip-path: polygon(0 50%, 24% 16%, 52% 32%, 78% 6%, 100% 50%, 78% 94%, 52% 68%, 24% 84%); }
        .levelFrame-crystal .levelWing,
        .levelFrame-preLegend .levelWing { width: 52px; height: 31px; top: 9px; opacity: 0.95; }
        .levelFrame-preLegend .levelPlateCore {
          border-radius: 999px 16px 999px 16px;
          border-color: rgba(255,246,199,0.9);
          box-shadow: inset 0 2px 0 rgba(255,255,255,0.36), inset 0 -2px 0 rgba(0,0,0,0.28), 0 0 26px var(--plate-glow);
        }
        .levelGemWrap {
          width: 36px;
          height: 36px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 2;
          flex-shrink: 0;
        }
        .isCompact .levelGemWrap {
          width: 31px;
          height: 31px;
        }
        .levelGem {
          width: 31px;
          height: 31px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #120a00;
          background: radial-gradient(circle at 35% 22%, #fff, var(--plate-accent) 26%, var(--plate-main) 62%, var(--plate-deep));
          border: 1px solid rgba(255,255,255,0.68);
          box-shadow: 0 0 16px var(--plate-glow), inset 0 2px 7px rgba(255,255,255,0.78), inset 0 -8px 12px rgba(0,0,0,0.24);
        }
        .isCompact .levelGem {
          width: 27px;
          height: 27px;
        }
        .levelFrame-purpleBlade .levelGem,
        .levelFrame-crystal .levelGem,
        .levelFrame-preLegend .levelGem {
          border-radius: 28% 72% 50% 50% / 28% 28% 72% 72%;
          transform: rotate(45deg);
        }
        .levelFrame-purpleBlade .levelGem svg,
        .levelFrame-crystal .levelGem svg,
        .levelFrame-preLegend .levelGem svg {
          transform: rotate(-45deg);
        }
        .levelPlateText {
          min-width: 0;
          display: flex;
          flex-direction: column;
          line-height: 1.08;
          position: relative;
          z-index: 2;
        }
        .levelTopline {
          display: flex;
          align-items: center;
          gap: 6px;
          min-width: 0;
        }
        .levelUserName {
          max-width: 76px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #fff;
          font-size: 12px;
          font-weight: 950;
          text-shadow: 0 0 8px rgba(0,0,0,0.8);
        }
        .levelNumber {
          color: #160d00;
          background: linear-gradient(180deg, var(--plate-accent), var(--plate-main));
          border-radius: 5px;
          padding: 2px 5px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          font-weight: 950;
          box-shadow: 0 0 10px var(--plate-glow);
          white-space: nowrap;
        }
        .levelRankLine {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-top: 5px;
        }
        .levelRankName {
          color: var(--plate-accent);
          font-size: 10px;
          font-weight: 950;
          white-space: nowrap;
          text-shadow: 0 0 9px var(--plate-glow);
        }
        .levelProgress {
          flex: 1;
          height: 3px;
          min-width: 36px;
          border-radius: 999px;
          background: rgba(255,255,255,0.14);
          overflow: hidden;
        }
        .levelProgress span {
          display: block;
          width: var(--plate-progress);
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, var(--plate-main), var(--plate-accent));
          box-shadow: 0 0 8px var(--plate-glow);
        }
        .levelTitlePlate::after {
          content: "";
          position: absolute;
          inset: 4px 14px;
          z-index: 3;
          border-radius: 999px 12px 999px 12px;
          background: linear-gradient(110deg, transparent 0%, transparent 35%, rgba(255,255,255,0.32) 48%, transparent 60%, transparent 100%);
          transform: translateX(-70%);
          animation: levelPlateShine 3.2s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes levelPlateShine {
          0% { transform: translateX(-78%); }
          70%, 100% { transform: translateX(78%); }
        }
        @media (max-width: 860px) {
          .levelTitlePlate.isCompact {
            min-width: 140px;
          }
          .levelTitlePlate.isCompact .levelWing {
            width: 28px;
            height: 20px;
            top: 12px;
          }
          .levelTitlePlate.isCompact .levelWing.left { left: -15px; }
          .levelTitlePlate.isCompact .levelWing.right { right: -15px; }
          .levelTitlePlate.isCompact .levelUserName {
            max-width: 56px;
            font-size: 11px;
          }
          .levelTitlePlate.isCompact .levelNumber {
            font-size: 8px;
            padding: 1px 4px;
          }
        }
      `}</style>
    </span>
  )
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
      title={`${level.level < 19 ? `LV.${level.level} ` : ""}${stage.fullName}${level.level < 19 ? ` · ${contributionPoints} 贡献值` : ""} · ${level.desc}`}
    >
      <span className="coCreatorAura" aria-hidden="true" />
      <span className="coCreatorPlate" aria-hidden="true" />
      <span className="coCreatorColumnCap isLeft" aria-hidden="true" />
      <span className="coCreatorColumnCap isRight" aria-hidden="true" />
      <span className="coCreatorBeastMark" aria-hidden="true">{stage.beast}</span>
      {level.level >= 19 && <svg className="coCreatorDragonArt" viewBox="0 0 250 62" aria-hidden="true" focusable="false">
        <path className="dragonShadow" d="M48 38 C76 8, 121 8, 151 30 S205 49, 231 24" />
        <path className="dragonBody back" d="M44 41 C76 11, 118 11, 151 31 S201 47, 231 23" />
        <path className="dragonBody front" d="M54 43 C83 58, 123 53, 153 33 S202 16, 224 28" />
        <g className="dragonHead" transform="translate(41 37) rotate(-22)">
          <path className="dragonFace" d="M0 0 C7 -12, 22 -15, 31 -6 C36 -1, 34 8, 25 12 C15 17, 2 12, 0 0Z" />
          <path className="dragonJaw" d="M17 7 C27 8, 34 13, 37 19 C25 20, 17 17, 11 11Z" />
          <path className="dragonHorn" d="M9 -9 L15 -24 L18 -10" />
          <path className="dragonHorn second" d="M22 -8 L31 -20 L30 -6" />
          <path className="dragonWhisker" d="M29 0 C41 -5, 50 -5, 58 0" />
          <path className="dragonWhisker lower" d="M27 8 C41 13, 50 18, 61 16" />
          <circle className="dragonEye" cx="22" cy="-2" r="2.2" />
        </g>
        <g className="dragonClaw clawOne" transform="translate(103 20) rotate(18)">
          <path d="M0 0 L7 10 M7 10 L3 16 M7 10 L12 16 M7 10 L15 12" />
        </g>
        <g className="dragonClaw clawTwo" transform="translate(167 40) rotate(-18)">
          <path d="M0 0 L8 10 M8 10 L4 16 M8 10 L13 16 M8 10 L16 12" />
        </g>
        <g className="dragonFire" transform="translate(220 21)">
          <path className="fireOuter" d="M0 4 C15 -8, 24 -5, 34 3 C22 4, 22 14, 8 15 C14 9, 8 5, 0 4Z" />
          <path className="fireInner" d="M8 5 C18 -1, 24 2, 29 6 C20 7, 19 12, 11 12 C15 9, 13 6, 8 5Z" />
        </g>
      </svg>}
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
          {level.level < 19 && <span className="coCreatorContribution">{targetText} 贡献</span>}
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
          border-radius: 999px;
          background:
            radial-gradient(ellipse at 16% 48%, rgba(255,255,255,0.28), transparent 22%),
            radial-gradient(ellipse at 84% 42%, var(--stage-soft), transparent 26%),
            linear-gradient(90deg, rgba(255,255,255,0.22), transparent 10%, transparent 88%, rgba(255,255,255,0.16)),
            linear-gradient(180deg, color-mix(in srgb, var(--stage-main) 44%, #fff 10%), color-mix(in srgb, var(--stage-main) 18%, #6d4b12 42%) 47%, var(--stage-deep));
          box-shadow: 0 0 18px var(--stage-glow), inset 15px 0 20px rgba(255,255,255,0.18), inset -18px 0 23px rgba(0,0,0,0.24), inset 0 2px 0 rgba(255,255,255,0.28), inset 0 -2px 0 rgba(0,0,0,0.2);
          clip-path: none;
          text-decoration: none;
          vertical-align: middle;
        }
        .coCreatorBadge.isCompact {
          width: 226px;
          min-height: 56px;
          gap: 8px;
          padding: 6px 12px 6px 8px;
          border-radius: 999px;
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
            radial-gradient(ellipse at 15% 48%, rgba(255,255,255,0.36), transparent 23%),
            radial-gradient(circle at 73% 20%, rgba(255,246,199,0.38), transparent 22%),
            radial-gradient(circle at 65% 80%, rgba(255,109,45,0.24), transparent 26%),
            radial-gradient(circle at 86% 30%, rgba(255,83,23,0.34), transparent 27%),
            linear-gradient(90deg, rgba(255,255,255,0.22), transparent 11%, transparent 89%, rgba(255,255,255,0.18)),
            linear-gradient(180deg, #f7d273, #9b6b17 47%, #2a1703);
          box-shadow:
            0 0 28px rgba(255,207,76,0.78),
            0 0 72px rgba(255,106,0,0.32),
            inset 15px 0 20px rgba(255,255,255,0.2),
            inset -18px 0 24px rgba(0,0,0,0.25),
            inset 0 0 0 1px rgba(255,255,255,0.2);
        }
        .coCreatorPlate {
          position: absolute;
          inset: 2px;
          z-index: -2;
          opacity: 0.76;
          background:
            linear-gradient(90deg, rgba(255,255,255,0.2), transparent 16%, transparent 78%, rgba(255,255,255,0.1)),
            repeating-linear-gradient(90deg, transparent 0 15px, rgba(255,255,255,0.09) 15px 16px, transparent 16px 30px),
            radial-gradient(ellipse at 50% 8%, rgba(255,255,255,0.24), transparent 44%),
            radial-gradient(ellipse at 50% 96%, rgba(0,0,0,0.24), transparent 44%);
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
          z-index: 0;
          width: 38px;
          border-radius: 999px;
          background: radial-gradient(ellipse at 46% 50%, rgba(255,255,255,0.32), var(--stage-soft) 48%, rgba(0,0,0,0.16) 78%);
          box-shadow: inset 0 0 13px rgba(255,255,255,0.18), inset 0 -8px 14px rgba(0,0,0,0.18);
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
        .coCreatorBeastMark {
          position: absolute;
          left: 9px;
          top: 50%;
          z-index: 1;
          transform: translateY(-50%);
          color: var(--stage-main);
          font-family: 'Noto Serif SC', 'Noto Sans SC', serif;
          font-size: 28px;
          font-weight: 950;
          line-height: 1;
          opacity: 0.2;
          text-shadow: 0 0 16px var(--stage-glow);
          pointer-events: none;
          white-space: nowrap;
        }
        .coCreatorDragonArt {
          position: absolute;
          inset: -3px -5px -2px 30px;
          z-index: 1;
          width: calc(100% - 24px);
          height: calc(100% + 5px);
          pointer-events: none;
          filter: drop-shadow(0 0 7px rgba(255,236,156,0.58));
        }
        .dragonShadow,
        .dragonBody {
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .dragonShadow {
          stroke: rgba(40,18,0,0.55);
          stroke-width: 13;
          opacity: 0.45;
        }
        .dragonBody.back {
          stroke: rgba(121,71,8,0.78);
          stroke-width: 11;
        }
        .dragonBody.front {
          stroke: #ffe18a;
          stroke-width: 7;
          stroke-dasharray: 18 10;
        }
        .dragonFace {
          fill: #fff1b3;
          stroke: #7b4808;
          stroke-width: 2;
        }
        .dragonJaw {
          fill: #f69a2d;
          stroke: #7b4808;
          stroke-width: 1.5;
        }
        .dragonHorn,
        .dragonWhisker,
        .dragonClaw path {
          fill: none;
          stroke: #fff3bd;
          stroke-width: 2.2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .dragonHorn.second {
          stroke: #ffcf63;
        }
        .dragonWhisker.lower {
          stroke: #ffb84c;
        }
        .dragonEye {
          fill: #120800;
          stroke: #fff;
          stroke-width: 0.6;
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
        .dragonClaw path {
          stroke: #ffeeb6;
          stroke-width: 2;
        }
        .fireOuter {
          fill: #ff6b18;
          filter: drop-shadow(0 0 8px rgba(255,93,20,0.75));
        }
        .fireInner {
          fill: #fff2a3;
        }
        .coCreatorBadge-legend .coCreatorDragonArt {
          filter: drop-shadow(0 0 9px rgba(255,236,156,0.75)) drop-shadow(0 0 11px rgba(255,102,32,0.32));
        }
        .coCreatorBadge-legend .coCreatorBeastMark {
          left: 14px;
          color: #dff7ff;
          font-size: 33px;
          opacity: 0.32;
          text-shadow: 0 0 18px rgba(126,231,255,0.72);
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
          .coCreatorBadge.isCompact .coCreatorBeastMark {
            font-size: 22px;
            left: 8px;
          }
          .coCreatorBadge.isCompact .coCreatorBeastLine {
            display: none;
          }
          .coCreatorBadge.isCompact .coCreatorWrapRibbon {
            left: 40px;
            right: 8px;
            height: 12px;
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
  if (!isCoCreator) {
    return (
      <LevelTitlePlate
        name={name}
        level={level}
        next={next}
        xpLabel={xpLabel}
        progress={progress}
        compact={compact}
      />
    )
  }
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
