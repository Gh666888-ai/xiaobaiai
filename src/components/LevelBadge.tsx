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
  mark: string
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
  plateImage: string
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
  0: { main: "#b9b9b9", accent: "#f4f4f4", deep: "#262626", glow: "rgba(210,210,210,0.28)", frame: "seed", mark: "初" },
  1: { main: "#d88738", accent: "#ffd5a3", deep: "#3b1b05", glow: "rgba(255,145,61,0.42)", frame: "ember", mark: "习" },
  2: { main: "#83b9ff", accent: "#f2f8ff", deep: "#0e284d", glow: "rgba(131,185,255,0.45)", frame: "iceWing", mark: "行" },
  3: { main: "#ffcf5a", accent: "#fff4bf", deep: "#4d3100", glow: "rgba(255,207,90,0.52)", frame: "bolt", mark: "醒" },
  4: { main: "#cfd9e8", accent: "#ffffff", deep: "#243244", glow: "rgba(207,217,232,0.5)", frame: "silverWing", mark: "炼" },
  5: { main: "#b692ff", accent: "#f3eaff", deep: "#2d135d", glow: "rgba(182,146,255,0.58)", frame: "purpleBlade", mark: "术" },
  6: { main: "#ffd86b", accent: "#fff6c7", deep: "#604005", glow: "rgba(255,216,107,0.62)", frame: "goldCrown", mark: "冠" },
  7: { main: "#7ee7ff", accent: "#f2fdff", deep: "#08394b", glow: "rgba(126,231,255,0.62)", frame: "skyBlade", mark: "翼" },
  8: { main: "#d7a850", accent: "#fff0b8", deep: "#4a2f04", glow: "rgba(215,168,80,0.58)", frame: "bronzeLaurel", mark: "策" },
  9: { main: "#ff7a45", accent: "#ffe0cf", deep: "#4a1203", glow: "rgba(255,122,69,0.62)", frame: "fireWing", mark: "焰" },
  10: { main: "#72e6a5", accent: "#e9fff2", deep: "#073b20", glow: "rgba(114,230,165,0.55)", frame: "jade", mark: "玉" },
  11: { main: "#ff78c9", accent: "#fff0fa", deep: "#4a0d35", glow: "rgba(255,120,201,0.58)", frame: "roseFlame", mark: "华" },
  12: { main: "#26d7c6", accent: "#d8fff7", deep: "#063934", glow: "rgba(38,215,198,0.62)", frame: "crystal", mark: "晶" },
  13: { main: "#ffb347", accent: "#fff0b8", deep: "#4f1a03", glow: "rgba(255,179,71,0.7)", frame: "dragonSpark", mark: "曜" },
  14: { main: "#ffe58a", accent: "#ffffff", deep: "#3c2304", glow: "rgba(255,229,138,0.78)", frame: "preLegend", mark: "尊" },
}

const coCreatorStages: Record<number, CoCreatorStage> = {
  15: { shortName: "共创伙伴", fullName: "小白AI共创伙伴", className: "partner", icon: Shield, seal: "共", motif: "玄武镇印", beast: "玄武", beastLine: "龟蛇护阵", nextLabel: "升级看贡献", plateImage: "/level-plates/co-creator-partner.png" },
  16: { shortName: "共创顾问", fullName: "小白AI共创顾问", className: "advisor", icon: Crown, seal: "顾", motif: "朱雀焰羽", beast: "朱雀", beastLine: "赤羽流火", nextLabel: "解锁顾问名牌", plateImage: "/level-plates/co-creator-advisor.png" },
  17: { shortName: "共创导师", fullName: "小白AI共创导师", className: "mentor", icon: Zap, seal: "导", motif: "白虎风刃", beast: "白虎", beastLine: "金风破阵", nextLabel: "解锁导师名牌", plateImage: "/level-plates/co-creator-mentor.png" },
  18: { shortName: "共创合伙人", fullName: "小白AI共创合伙人", className: "partnerPlus", icon: Star, seal: "合", motif: "青龙云雷", beast: "青龙", beastLine: "云雷绕身", nextLabel: "解锁合伙人名牌", plateImage: "/level-plates/co-creator-partner-plus.png" },
  19: { shortName: "共创神", fullName: "小白AI共创神", className: "legend", icon: Diamond, seal: "神", motif: "麒麟龙凤", beast: "麒麟", beastLine: "龙凤天纹", nextLabel: "最高共创名牌", plateImage: "/level-plates/co-creator-god.png" },
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
  const isPeakBeforeCoCreator = level.level >= 12

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
      <span className="levelBackPlate" aria-hidden="true" />
      <span className="levelPlateCore" aria-hidden="true" />
      <span className="levelGemWrap" aria-hidden="true">
        <span className="levelGem">
          <Icon size={compact ? 14 : 17} strokeWidth={2.6} />
        </span>
        <span className="levelGemMark">{plate.mark}</span>
      </span>
      <span className="levelPlateText">
        <span className="levelTopline">
          <span className="levelUserName">{name}</span>
          {level.level < 19 && <span className="levelNumber">LV.{level.level}</span>}
        </span>
        {!compact && (
          <span className="levelRankLine">
            <span className="levelRankName">{level.name}</span>
            {isPeakBeforeCoCreator && <span className="levelNearCoCreator">准共创</span>}
            <span className="levelProgress"><span /></span>
          </span>
        )}
      </span>
      <style>{`
        .levelTitlePlate {
          display: inline-grid;
          grid-template-columns: auto minmax(0, 1fr);
          align-items: center;
          gap: 10px;
          min-width: 218px;
          min-height: 56px;
          padding: 8px 20px 8px 10px;
          position: relative;
          isolation: isolate;
          overflow: visible;
          color: #fff;
          text-decoration: none;
          vertical-align: middle;
          filter: drop-shadow(0 0 16px var(--plate-glow));
        }
        .levelTitlePlate.isCompact {
          min-width: 176px;
          min-height: 46px;
          gap: 7px;
          padding: 6px 13px 6px 8px;
        }
        .levelBackPlate {
          position: absolute;
          inset: 0 3px;
          z-index: -3;
          border-radius: 999px 18px 999px 18px;
          background:
            radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--plate-main) 34%, transparent), transparent 60%),
            linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--plate-main) 26%, transparent) 18%, rgba(255,255,255,0.08) 50%, color-mix(in srgb, var(--plate-main) 22%, transparent) 82%, transparent 100%);
          opacity: 0.88;
          filter: blur(0.2px);
        }
        .levelPlateCore {
          position: absolute;
          inset: 4px 12px;
          z-index: -1;
          border: 1px solid color-mix(in srgb, var(--plate-main) 82%, #fff 18%);
          border-radius: 999px 18px 999px 18px;
          background:
            radial-gradient(ellipse at 15% 42%, rgba(255,255,255,0.42), transparent 24%),
            radial-gradient(ellipse at 88% 36%, color-mix(in srgb, var(--plate-main) 28%, transparent), transparent 28%),
            repeating-linear-gradient(115deg, transparent 0 9px, rgba(255,255,255,0.045) 9px 10px),
            linear-gradient(90deg, rgba(255,255,255,0.24), transparent 14%, transparent 83%, rgba(255,255,255,0.18)),
            linear-gradient(180deg, color-mix(in srgb, var(--plate-main) 44%, #fff 10%), color-mix(in srgb, var(--plate-main) 20%, var(--plate-deep) 48%) 48%, var(--plate-deep));
          box-shadow:
            inset 0 2px 0 rgba(255,255,255,0.32),
            inset 0 -2px 0 rgba(0,0,0,0.34),
            inset 13px 0 16px rgba(255,255,255,0.12),
            inset -16px 0 18px rgba(0,0,0,0.22),
            0 0 20px var(--plate-glow);
        }
        .levelPlateCore::before,
        .levelPlateCore::after {
          content: "";
          position: absolute;
          top: 50%;
          width: 15px;
          height: 15px;
          border-radius: 5px;
          background:
            linear-gradient(135deg, rgba(255,255,255,0.42), transparent 48%),
            radial-gradient(circle at 35% 26%, #fff, var(--plate-accent) 32%, var(--plate-main) 68%, var(--plate-deep));
          border: 1px solid rgba(255,255,255,0.65);
          box-shadow: 0 0 10px var(--plate-glow);
          transform: translateY(-50%) rotate(45deg);
        }
        .levelPlateCore::before {
          left: 8px;
        }
        .levelPlateCore::after {
          right: 8px;
        }
        .levelWing {
          position: absolute;
          top: 9px;
          width: 50px;
          height: 33px;
          z-index: -2;
          background:
            linear-gradient(135deg, rgba(255,255,255,0.48), transparent 24%),
            linear-gradient(135deg, var(--plate-accent), var(--plate-main) 45%, transparent 74%);
          clip-path: polygon(0 50%, 82% 4%, 70% 36%, 100% 50%, 70% 64%, 82% 96%);
          opacity: 0.78;
          filter: drop-shadow(0 0 8px var(--plate-glow));
        }
        .levelWing.left {
          left: -28px;
        }
        .levelWing.right {
          right: -28px;
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
        .levelFrame-ember .levelWing { opacity: 0.48; }
        .levelFrame-goldCrown .levelPlateCore,
        .levelFrame-crystal .levelPlateCore,
        .levelFrame-preLegend .levelPlateCore {
          border-width: 2px;
        }
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
          width: 40px;
          height: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 2;
          flex-shrink: 0;
        }
        .isCompact .levelGemWrap {
          width: 32px;
          height: 32px;
        }
        .levelGem {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #120a00;
          background: radial-gradient(circle at 35% 22%, #fff, var(--plate-accent) 26%, var(--plate-main) 62%, var(--plate-deep));
          border: 1px solid rgba(255,255,255,0.68);
          box-shadow: 0 0 18px var(--plate-glow), inset 0 2px 7px rgba(255,255,255,0.82), inset 0 -9px 13px rgba(0,0,0,0.26);
        }
        .isCompact .levelGem {
          width: 28px;
          height: 28px;
        }
        .levelGemMark {
          position: absolute;
          right: -1px;
          bottom: -3px;
          z-index: 3;
          min-width: 17px;
          height: 17px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #170d02;
          background: linear-gradient(180deg, #fff, var(--plate-accent) 46%, var(--plate-main));
          border: 1px solid rgba(255,255,255,0.74);
          box-shadow: 0 0 10px var(--plate-glow), inset 0 -4px 7px rgba(0,0,0,0.16);
          font-size: 9px;
          font-weight: 950;
          line-height: 1;
        }
        .isCompact .levelGemMark {
          min-width: 14px;
          height: 14px;
          font-size: 8px;
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
          padding-right: 4px;
        }
        .levelTopline {
          display: flex;
          align-items: center;
          gap: 6px;
          min-width: 0;
        }
        .levelUserName {
          max-width: 92px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #fff;
          font-size: 14px;
          font-weight: 950;
          text-shadow: 0 1px 0 rgba(0,0,0,0.78), 0 0 10px rgba(0,0,0,0.82), 0 0 12px var(--plate-glow);
        }
        .levelNumber {
          color: #120b00;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.6), transparent 46%),
            linear-gradient(180deg, var(--plate-accent), var(--plate-main));
          border: 1px solid rgba(255,255,255,0.58);
          border-radius: 7px;
          padding: 2px 7px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          font-weight: 950;
          box-shadow: 0 0 12px var(--plate-glow), inset 0 -4px 8px rgba(0,0,0,0.14);
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
          font-size: 11px;
          font-weight: 950;
          white-space: nowrap;
          text-shadow: 0 0 9px var(--plate-glow);
        }
        .levelNearCoCreator {
          color: #160d00;
          border-radius: 999px;
          padding: 1px 5px;
          background: linear-gradient(180deg, #fff, var(--plate-accent));
          box-shadow: 0 0 10px var(--plate-glow);
          font-size: 9px;
          font-weight: 950;
          white-space: nowrap;
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
            min-width: 148px;
          }
          .levelTitlePlate.isCompact .levelWing {
            width: 28px;
            height: 20px;
            top: 12px;
          }
          .levelTitlePlate.isCompact .levelWing.left { left: -15px; }
          .levelTitlePlate.isCompact .levelWing.right { right: -15px; }
          .levelTitlePlate.isCompact .levelUserName {
            max-width: 60px;
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
      <img className="coCreatorPlateImage" src={stage.plateImage} alt="" aria-hidden="true" />
      <span className="coCreatorNamePanel" aria-hidden="true" />
      <span className="coCreatorIconWrap" aria-hidden="true">
        <span className="coCreatorSeal">{stage.seal}</span>
        <span className="coCreatorMascotFrame">
          <img src="/xiaobai-mascot-cutout.png" alt="" className="coCreatorMascot" />
        </span>
        <span className="coCreatorRankIcon">
          <StageIcon size={compact ? 11 : 13} strokeWidth={2.5} />
        </span>
      </span>
      <span className="coCreatorContent">
        <span className="coCreatorTopline">
          <span className="coCreatorRankLabel">{stage.shortName}</span>
          {level.level < 19 && <span className="coCreatorLevel">LV.{level.level}</span>}
        </span>
        <span className="coCreatorTitle">{name}</span>
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
          grid-template-columns: 34px minmax(0, 1fr);
          align-items: center;
          gap: 7px;
          width: 270px;
          height: 56px;
          padding: 7px 43px 7px 36px;
          color: #fff;
          position: relative;
          isolation: isolate;
          overflow: visible;
          border: 0;
          border-radius: 0;
          background: transparent;
          box-shadow: none;
          text-decoration: none;
          vertical-align: middle;
          filter: drop-shadow(0 0 14px var(--stage-glow));
        }
        .coCreatorBadge.isCompact {
          width: 230px;
          height: 48px;
          grid-template-columns: 30px minmax(0, 1fr);
          gap: 6px;
          padding: 6px 36px 6px 30px;
        }
        .coCreatorBadge-partner {
          --stage-main: #73d6c7;
          --stage-soft: rgba(115,214,199,0.22);
          --stage-deep: #071b18;
          --stage-glow: rgba(115,214,199,0.42);
        }
        .coCreatorBadge-advisor {
          --stage-main: #ff7a45;
          --stage-soft: rgba(255,122,69,0.26);
          --stage-deep: #260904;
          --stage-glow: rgba(255,122,69,0.5);
        }
        .coCreatorBadge-mentor {
          --stage-main: #f3e9d0;
          --stage-soft: rgba(243,233,208,0.22);
          --stage-deep: #10141b;
          --stage-glow: rgba(243,233,208,0.46);
        }
        .coCreatorBadge-partnerPlus {
          --stage-main: #37dbc7;
          --stage-soft: rgba(55,219,199,0.26);
          --stage-deep: #051f1d;
          --stage-glow: rgba(55,219,199,0.54);
        }
        .coCreatorBadge-legend {
          --stage-main: #7ee7ff;
          --stage-soft: rgba(126,231,255,0.28);
          --stage-deep: #03142c;
          --stage-glow: rgba(126,231,255,0.84);
          width: 330px;
          height: 74px;
          grid-template-columns: 42px minmax(0, 1fr);
          gap: 10px;
          padding: 10px 64px 10px 52px;
        }
        .coCreatorPlateImage {
          position: absolute;
          left: 50%;
          top: 50%;
          z-index: -2;
          width: 133%;
          height: auto;
          transform: translate(-50%, -50%);
          pointer-events: none;
          user-select: none;
        }
        .coCreatorBadge-legend .coCreatorPlateImage {
          width: 145%;
        }
        .coCreatorNamePanel {
          position: absolute;
          left: 50%;
          top: 51%;
          z-index: 0;
          width: 46%;
          height: 54%;
          transform: translate(-50%, -50%);
          border-radius: 999px;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.2), transparent 42%),
            linear-gradient(180deg, color-mix(in srgb, var(--stage-main) 16%, #06110f 84%), rgba(1,6,8,0.94));
          border: 1px solid color-mix(in srgb, var(--stage-main) 58%, #fff 18%);
          box-shadow:
            0 0 14px color-mix(in srgb, var(--stage-main) 48%, transparent),
            inset 0 1px 0 rgba(255,255,255,0.32),
            inset 0 -8px 15px rgba(0,0,0,0.44);
          opacity: 0.96;
          pointer-events: none;
        }
        .coCreatorBadge-legend .coCreatorNamePanel {
          width: 43%;
          height: 48%;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.28), transparent 42%),
            linear-gradient(180deg, rgba(7,38,77,0.96), rgba(1,12,31,0.96));
          border-color: rgba(215,242,255,0.86);
        }
        .coCreatorIconWrap {
          width: 32px;
          height: 32px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 2;
          flex-shrink: 0;
        }
        .isCompact .coCreatorIconWrap {
          width: 29px;
          height: 29px;
        }
        .coCreatorMascotFrame {
          width: 29px;
          height: 29px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: linear-gradient(145deg, #fff, var(--stage-main) 42%, var(--stage-deep));
          border: 1px solid rgba(255,255,255,0.76);
          border-radius: 50%;
          box-shadow: 0 0 16px var(--stage-glow), inset 0 2px 8px rgba(255,255,255,0.75), inset 0 -8px 12px rgba(0,0,0,0.24);
        }
        .coCreatorBadge-legend .coCreatorMascotFrame {
          width: 37px;
          height: 37px;
          border-radius: 14px;
          background:
            radial-gradient(circle at 36% 20%, #f8fdff 0%, #7ee7ff 34%, #0c4a82 72%, #03142c 100%);
          border-color: rgba(220,248,255,0.94);
          box-shadow:
            0 0 22px rgba(126,231,255,0.8),
            0 0 34px rgba(60,156,255,0.28),
            inset 0 2px 9px rgba(255,255,255,0.78),
            inset 0 -12px 18px rgba(0,0,0,0.34);
          transform: rotate(45deg);
        }
        .coCreatorMascot {
          width: 36px;
          height: 36px;
          object-fit: contain;
          transform: translateY(2px);
          filter: drop-shadow(0 2px 3px rgba(0,0,0,0.34));
        }
        .coCreatorBadge-legend .coCreatorMascot {
          width: 39px;
          height: 39px;
          transform: translateY(2px) rotate(-45deg);
        }
        .coCreatorSeal {
          position: absolute;
          left: -3px;
          top: -5px;
          z-index: 3;
          min-width: 17px;
          height: 17px;
          border-radius: 6px 2px 6px 2px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #0b0b0b;
          background: var(--stage-main);
          border: 1px solid rgba(255,255,255,0.7);
          font-size: 10px;
          font-weight: 950;
          box-shadow: 0 3px 12px var(--stage-glow);
        }
        .coCreatorRankIcon {
          position: absolute;
          right: -2px;
          bottom: -2px;
          z-index: 3;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #0b0b0b;
          background: linear-gradient(145deg, #fff, var(--stage-main));
          border: 1px solid rgba(255,255,255,0.74);
          box-shadow: 0 3px 12px var(--stage-glow);
        }
        .coCreatorContent {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-width: 0;
          line-height: 1.05;
          position: relative;
          z-index: 2;
          text-align: center;
        }
        .coCreatorTopline {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          min-width: 0;
        }
        .coCreatorRankLabel {
          color: #fff4c9;
          font-size: 10px;
          font-weight: 950;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 88px;
          text-shadow: 0 0 8px rgba(0,0,0,0.8), 0 0 10px var(--stage-glow);
        }
        .coCreatorLevel {
          color: #090909;
          background: var(--stage-main);
          border-radius: 5px;
          padding: 1px 4px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          font-weight: 950;
          box-shadow: 0 0 12px var(--stage-glow);
        }
        .coCreatorTitle {
          color: #fff;
          max-width: 112px;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 18px;
          font-weight: 950;
          margin-top: 4px;
          white-space: nowrap;
          text-shadow: 0 0 10px rgba(0,0,0,0.92), 0 0 14px var(--stage-glow);
        }
        .coCreatorBadge-legend .coCreatorRankLabel {
          max-width: 96px;
          color: #dff7ff;
          font-size: 10px;
        }
        .coCreatorBadge-legend .coCreatorTitle {
          max-width: 142px;
          color: #f4fbff;
          font-family: 'Noto Serif SC', 'Noto Sans SC', serif;
          font-size: 24px;
          text-shadow:
            0 2px 0 rgba(5,20,42,0.95),
            0 0 12px rgba(126,231,255,0.8),
            0 0 22px rgba(60,156,255,0.62);
        }
        .coCreatorMeta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 3px;
          color: color-mix(in srgb, var(--stage-main) 82%, #fff 18%);
          font-size: 10px;
          font-weight: 900;
          white-space: nowrap;
          text-shadow: 0 0 8px rgba(0,0,0,0.75);
        }
        .coCreatorContribution {
          display: inline-flex;
          align-items: center;
          border: 1px solid color-mix(in srgb, var(--stage-main) 44%, transparent);
          border-radius: 999px;
          background: rgba(0,0,0,0.35);
          padding: 1px 5px;
          color: #fff4c9;
        }
        .coCreatorBadge::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 4;
          background: linear-gradient(110deg, transparent 0%, transparent 36%, rgba(255,255,255,0.22) 48%, transparent 60%, transparent 100%);
          transform: translateX(-78%);
          animation: coCreatorBadgeShine 2.9s ease-in-out infinite;
          pointer-events: none;
        }
        .coCreatorBadge-legend::after {
          animation-duration: 2.15s;
          background: linear-gradient(110deg, transparent 0%, transparent 30%, rgba(215,242,255,0.54) 44%, rgba(60,156,255,0.28) 52%, transparent 66%, transparent 100%);
        }
        @keyframes coCreatorBadgeShine {
          0% { transform: translateX(-82%); }
          68%, 100% { transform: translateX(82%); }
        }
        @media (max-width: 860px) {
          .coCreatorBadge-legend {
            width: 258px;
            height: 60px;
            grid-template-columns: 34px minmax(0, 1fr);
            gap: 7px;
            padding: 8px 48px 8px 42px;
          }
          .coCreatorBadge-legend .coCreatorTitle {
            max-width: 106px;
            font-size: 18px;
          }
          .coCreatorBadge-legend .coCreatorMascotFrame {
            width: 31px;
            height: 31px;
            border-radius: 11px;
          }
          .coCreatorBadge-legend .coCreatorMascot {
            width: 34px;
            height: 34px;
          }
          .coCreatorBadge.isCompact {
            width: 180px;
            height: 42px;
            grid-template-columns: 27px minmax(0, 1fr);
            gap: 5px;
            padding: 5px 28px 5px 24px;
          }
          .coCreatorBadge.isCompact .coCreatorIconWrap {
            width: 27px;
            height: 27px;
          }
          .coCreatorBadge.isCompact .coCreatorMascotFrame {
            width: 25px;
            height: 25px;
          }
          .coCreatorBadge.isCompact .coCreatorMascot {
            width: 31px;
            height: 31px;
          }
          .coCreatorBadge.isCompact .coCreatorRankLabel {
            max-width: 62px;
            font-size: 9px;
          }
          .coCreatorBadge.isCompact .coCreatorLevel {
            font-size: 8px;
            padding: 1px 3px;
          }
          .coCreatorBadge.isCompact .coCreatorTitle {
            max-width: 76px;
            font-size: 13px;
            margin-top: 2px;
          }
          .coCreatorBadge.isCompact .coCreatorMeta {
            display: none;
          }
          .coCreatorBadge.isCompact .coCreatorSeal {
            min-width: 15px;
            height: 15px;
            font-size: 9px;
          }
          .coCreatorBadge.isCompact .coCreatorRankIcon {
            width: 16px;
            height: 16px;
          }
        }
        @media (max-width: 420px) {
          .coCreatorBadge-legend.isCompact {
            width: 190px;
            height: 48px;
            padding: 6px 34px 6px 30px;
          }
          .coCreatorBadge-legend.isCompact .coCreatorTitle {
            max-width: 80px;
            font-size: 15px;
          }
          .coCreatorBadge.isCompact {
            width: 152px;
          }
          .coCreatorBadge.isCompact .coCreatorRankLabel {
            max-width: 46px;
          }
          .coCreatorBadge.isCompact .coCreatorTitle {
            max-width: 58px;
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
