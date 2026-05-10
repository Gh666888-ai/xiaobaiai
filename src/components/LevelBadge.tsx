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
}

type AutoPlate = {
  image: string
  title: string
  beast: string
  group: "starter" | "riser" | "adept" | "master" | "legendary"
}

type CoCreatorStage = {
  shortName: string
  fullName: string
  className: string
  beast: string
  beastLine: string
  nextLabel: string
  plateImage: string
}

const autoPlates: Record<number, AutoPlate> = {
  0: { image: "/level-plates/title-level-01.png", title: "灵光初启", beast: "鹿蜀", group: "starter" },
  1: { image: "/level-plates/title-level-01.png", title: "灵光初启", beast: "鹿蜀", group: "starter" },
  2: { image: "/level-plates/title-level-02.png", title: "玄甲见习", beast: "玄龟", group: "starter" },
  3: { image: "/level-plates/title-level-03.png", title: "文鳐入海", beast: "文鳐", group: "starter" },
  4: { image: "/level-plates/title-level-04.png", title: "风翼试炼", beast: "耳鼠", group: "riser" },
  5: { image: "/level-plates/title-level-05.png", title: "毕方燃羽", beast: "毕方", group: "riser" },
  6: { image: "/level-plates/title-level-06.png", title: "乘黄逐光", beast: "乘黄", group: "riser" },
  7: { image: "/level-plates/title-level-07.png", title: "鸾鸟衔辉", beast: "鸾鸟", group: "adept" },
  8: { image: "/level-plates/title-level-08.png", title: "当康聚业", beast: "当康", group: "adept" },
  9: { image: "/level-plates/title-level-09.png", title: "天狗破夜", beast: "天狗", group: "adept" },
  10: { image: "/level-plates/title-level-10.png", title: "英招镇山", beast: "英招", group: "master" },
  11: { image: "/level-plates/title-level-11.png", title: "陆吾守境", beast: "陆吾", group: "master" },
  12: { image: "/level-plates/title-level-12.png", title: "白泽知命", beast: "白泽", group: "master" },
  13: { image: "/level-plates/title-level-13.png", title: "麒麟开运", beast: "麒麟", group: "legendary" },
  14: { image: "/level-plates/title-level-14.png", title: "鲲鹏凌霄", beast: "鲲鹏", group: "legendary" },
}

const coCreatorStages: Record<number, CoCreatorStage> = {
  15: {
    shortName: "玄武共创使",
    fullName: "小白AI玄武共创使",
    className: "partner",
    beast: "玄武",
    beastLine: "镇守方法库",
    nextLabel: "升级看贡献",
    plateImage: "/level-plates/co-creator-partner.png",
  },
  16: {
    shortName: "朱雀策源官",
    fullName: "小白AI朱雀策源官",
    className: "advisor",
    beast: "朱雀",
    beastLine: "点燃案例场",
    nextLabel: "解锁策源名牌",
    plateImage: "/level-plates/co-creator-advisor.png",
  },
  17: {
    shortName: "白虎实战导师",
    fullName: "小白AI白虎实战导师",
    className: "mentor",
    beast: "白虎",
    beastLine: "破局带新人",
    nextLabel: "解锁导师名牌",
    plateImage: "/level-plates/co-creator-mentor.png",
  },
  18: {
    shortName: "青龙共创合伙人",
    fullName: "小白AI青龙共创合伙人",
    className: "partnerPlus",
    beast: "青龙",
    beastLine: "共建工作流",
    nextLabel: "解锁合伙名牌",
    plateImage: "/level-plates/co-creator-partner-plus.png",
  },
  19: {
    shortName: "龙凤共创神",
    fullName: "小白AI龙凤共创神",
    className: "legend",
    beast: "龙凤",
    beastLine: "最高共创身份",
    nextLabel: "最高共创名牌",
    plateImage: "/level-plates/co-creator-god.png",
  },
}

function getCoCreatorStage(level: number) {
  if (level >= 19) return coCreatorStages[19]
  if (level >= 18) return coCreatorStages[18]
  if (level >= 17) return coCreatorStages[17]
  if (level >= 16) return coCreatorStages[16]
  return coCreatorStages[15]
}

function getAutoPlate(level: number) {
  if (level >= 14) return autoPlates[14]
  if (level <= 0) return autoPlates[0]
  return autoPlates[level] || autoPlates[1]
}

function getPlateNameStyle(name: string): CSSProperties {
  const length = Array.from(name.trim()).length
  const scale = length <= 3 ? 1.1 : length <= 4 ? 1 : length <= 6 ? 0.9 : length <= 8 ? 0.78 : 0.68
  return { "--plate-name-scale": scale } as CSSProperties
}

function LevelTitlePlate({
  name,
  level,
  next,
  xpLabel,
  compact,
}: {
  name: string
  level: ReturnType<typeof getUserLevel>
  next: ReturnType<typeof getNextLevel>
  xpLabel: string
  compact: boolean
}) {
  const plate = getAutoPlate(level.level)
  const power = Math.min(5, Math.max(1, Math.ceil(Math.max(1, level.level) / 3)))
  const titleText = `${plate.title} · ${plate.beast}铭牌 · ${xpLabel} · ${level.desc}${next ? next.requiresReview ? ` · 达到共创门槛，需要人工审核后解锁 ${next.level.name}` : ` · 距离 ${next.level.name} 还差 ${next.need} XP` : " · 已达当前最高普通档。"}`

  const nameStyle = getPlateNameStyle(name)

  return (
    <span
      className={`levelTitlePlate levelPlate-${plate.group} levelSize-${power} ${compact ? "isCompact" : ""}`}
      title={titleText}
      aria-label={titleText}
    >
      <img className="levelTitlePlateImage" src={plate.image} alt={plate.title} />
      <span className="levelNamePanel" aria-hidden="true" style={nameStyle}>
        <span className="levelNameText">{name}</span>
      </span>
      <style>{`
        .levelTitlePlate {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 236px;
          height: 82px;
          position: relative;
          isolation: isolate;
          overflow: visible;
          vertical-align: middle;
          filter:
            drop-shadow(0 5px 9px rgba(0,0,0,0.38))
            drop-shadow(0 0 7px rgba(210,174,96,0.22));
        }
        .levelTitlePlate.isCompact {
          width: 152px;
          height: 46px;
        }
        .levelSize-2 { width: 256px; height: 88px; }
        .levelSize-3 { width: 282px; height: 98px; }
        .levelSize-4 { width: 310px; height: 108px; }
        .levelSize-5 { width: 346px; height: 120px; }
        .levelSize-2.isCompact { width: 158px; height: 48px; }
        .levelSize-3.isCompact { width: 168px; height: 51px; }
        .levelSize-4.isCompact { width: 178px; height: 54px; }
        .levelSize-5.isCompact { width: 192px; height: 58px; }
        .levelPlate-starter {
          filter:
            drop-shadow(0 4px 8px rgba(0,0,0,0.36))
            drop-shadow(0 0 5px rgba(198,176,118,0.18));
        }
        .levelPlate-riser {
          filter:
            drop-shadow(0 5px 9px rgba(0,0,0,0.38))
            drop-shadow(0 0 8px rgba(231,152,72,0.25));
        }
        .levelPlate-adept {
          filter:
            drop-shadow(0 6px 10px rgba(0,0,0,0.4))
            drop-shadow(0 0 14px rgba(236,178,74,0.38));
        }
        .levelPlate-master {
          filter:
            drop-shadow(0 6px 12px rgba(0,0,0,0.44))
            drop-shadow(0 0 19px rgba(98,224,194,0.48));
        }
        .levelPlate-legendary {
          filter:
            drop-shadow(0 7px 13px rgba(0,0,0,0.46))
            drop-shadow(0 0 28px rgba(255,215,116,0.62));
        }
        .levelTitlePlateImage {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
          pointer-events: none;
          user-select: none;
        }
        .levelNamePanel {
          position: absolute;
          left: 58.5%;
          top: 49.5%;
          z-index: 2;
          width: 54%;
          height: 58%;
          transform: translate(-50%, -50%);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 24px;
          background:
            radial-gradient(ellipse at 50% 50%, rgba(15,16,16,0.98) 0 40%, rgba(13,14,14,0.9) 56%, rgba(12,13,13,0.34) 70%, rgba(12,13,13,0) 84%),
            linear-gradient(92deg, rgba(8,9,9,0), rgba(11,12,12,0.5) 23%, rgba(17,18,18,0.9) 50%, rgba(11,12,12,0.5) 77%, rgba(8,9,9,0)),
            repeating-linear-gradient(155deg, rgba(255,255,255,0.035) 0 1px, rgba(255,255,255,0) 1px 8px);
          border: 0;
          box-shadow: none;
          padding: 0 14px;
          pointer-events: none;
          overflow: hidden;
        }
        .levelNamePanel::before {
          content: "";
          position: absolute;
          inset: 7% 8% 14%;
          border-radius: inherit;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0) 34%, rgba(0,0,0,0.22) 78%, rgba(255,255,255,0.035)),
            radial-gradient(ellipse at 50% 34%, rgba(255,238,181,0.08), rgba(255,238,181,0) 58%);
          mix-blend-mode: screen;
          opacity: 0.78;
          pointer-events: none;
        }
        .levelNamePanel::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 0 48%, rgba(0,0,0,0.22) 72%, rgba(0,0,0,0) 86%);
          pointer-events: none;
        }
        .levelPlate-master .levelNamePanel {
          background:
            radial-gradient(ellipse at 50% 50%, rgba(10,17,17,0.98) 0 40%, rgba(9,15,15,0.9) 56%, rgba(8,13,13,0.34) 70%, rgba(8,13,13,0) 84%),
            linear-gradient(92deg, rgba(6,10,10,0), rgba(8,14,14,0.5) 23%, rgba(11,20,20,0.9) 50%, rgba(8,14,14,0.5) 77%, rgba(6,10,10,0)),
            repeating-linear-gradient(155deg, rgba(211,255,247,0.035) 0 1px, rgba(211,255,247,0) 1px 8px);
        }
        .levelPlate-legendary .levelNamePanel {
          background:
            radial-gradient(ellipse at 50% 50%, rgba(17,15,10,0.98) 0 40%, rgba(15,14,10,0.9) 56%, rgba(12,11,8,0.34) 70%, rgba(12,11,8,0) 84%),
            linear-gradient(92deg, rgba(10,8,4,0), rgba(13,11,6,0.5) 23%, rgba(20,17,10,0.9) 50%, rgba(13,11,6,0.5) 77%, rgba(10,8,4,0)),
            repeating-linear-gradient(155deg, rgba(255,232,168,0.04) 0 1px, rgba(255,232,168,0) 1px 8px);
        }
        .levelNameText {
          min-width: 0;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #f8edd1;
          font-family: 'Noto Serif SC', 'Source Han Serif SC', 'Songti SC', 'SimSun', serif;
          font-size: calc(26px * var(--plate-name-scale, 1));
          font-weight: 950;
          line-height: 1;
          text-align: center;
          letter-spacing: 0;
          position: relative;
          z-index: 2;
          -webkit-text-stroke: 0.8px rgba(42,24,10,0.9);
          paint-order: stroke fill;
          text-shadow:
            0 2px 0 rgba(255,255,255,0.2),
            0 -2px 0 rgba(0,0,0,0.98),
            2px 2px 0 rgba(0,0,0,0.88),
            -2px 2px 0 rgba(0,0,0,0.82),
            0 5px 8px rgba(0,0,0,0.78),
            0 0 9px rgba(255,232,168,0.22);
        }
        .levelPlate-riser .levelNameText { color: #ffe4bd; }
        .levelPlate-adept .levelNameText { color: #fff0c1; }
        .levelPlate-master .levelNameText { color: #dffcff; -webkit-text-stroke-color: rgba(5,30,34,0.92); text-shadow: 0 2px 0 rgba(255,255,255,0.22), 0 -2px 0 rgba(0,0,0,0.98), 2px 2px 0 rgba(0,0,0,0.88), -2px 2px 0 rgba(0,0,0,0.82), 0 5px 8px rgba(0,0,0,0.74), 0 0 9px rgba(126,231,255,0.3); }
        .levelPlate-legendary .levelNameText { color: #fff7d8; -webkit-text-stroke-color: rgba(58,35,7,0.95); text-shadow: 0 2px 0 rgba(255,255,255,0.26), 0 -2px 0 rgba(0,0,0,0.98), 2px 2px 0 rgba(0,0,0,0.92), -2px 2px 0 rgba(0,0,0,0.84), 0 5px 9px rgba(0,0,0,0.82), 0 0 12px rgba(255,216,107,0.36); }
        .levelSize-3 .levelNameText { font-size: calc(28px * var(--plate-name-scale, 1)); }
        .levelSize-4 .levelNameText { font-size: calc(31px * var(--plate-name-scale, 1)); }
        .levelSize-5 .levelNameText { font-size: calc(35px * var(--plate-name-scale, 1)); }
        .levelTitlePlate.isCompact .levelNamePanel {
          left: 58.5%;
          top: 49.5%;
          width: 57%;
          height: 62%;
          padding: 0 8px;
        }
        .levelTitlePlate.isCompact .levelNameText {
          font-size: calc(15px * var(--plate-name-scale, 1));
        }
        .levelSize-3.isCompact .levelNameText { font-size: calc(16px * var(--plate-name-scale, 1)); }
        .levelSize-4.isCompact .levelNameText { font-size: calc(17px * var(--plate-name-scale, 1)); }
        .levelSize-5.isCompact .levelNameText { font-size: calc(19px * var(--plate-name-scale, 1)); }
        @media (max-width: 860px) {
          .levelTitlePlate {
            width: 212px;
            height: 74px;
          }
          .levelSize-2 { width: 224px; height: 78px; }
          .levelSize-3 { width: 238px; height: 82px; }
          .levelSize-4 { width: 252px; height: 88px; }
          .levelSize-5 { width: 268px; height: 94px; }
          .levelTitlePlate.isCompact {
            width: 136px;
            height: 42px;
          }
          .levelSize-2.isCompact { width: 142px; height: 43px; }
          .levelSize-3.isCompact { width: 148px; height: 45px; }
          .levelSize-4.isCompact { width: 154px; height: 47px; }
          .levelSize-5.isCompact { width: 160px; height: 49px; }
          .levelNameText {
            font-size: calc(22px * var(--plate-name-scale, 1));
          }
          .levelSize-4 .levelNameText,
          .levelSize-5 .levelNameText {
            font-size: calc(24px * var(--plate-name-scale, 1));
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
  const targetText = next?.requiresContribution ? `${contributionPoints}/${contributionPoints + next.need}` : `${contributionPoints}`
  const titleText = `${level.level < 19 ? `LV.${level.level} ` : ""}${stage.fullName}${level.level < 19 ? ` · ${contributionPoints} 贡献值` : ""} · ${stage.beastLine} · ${level.desc}`

  const nameStyle = getPlateNameStyle(name)

  if (compact) {
    return (
      <span
        className={`coCreatorImageBadge coCreatorImageBadge-${stage.className}`}
        title={titleText}
        aria-label={titleText}
      >
        <img src={stage.plateImage} alt={stage.shortName} />
        <span className="coCreatorCompactName" aria-hidden="true" style={nameStyle}>{name}</span>
        <style>{`
          .coCreatorImageBadge {
            --stage-glow: rgba(255,216,107,0.42);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 178px;
            height: 42px;
            position: relative;
            overflow: visible;
            vertical-align: middle;
            filter: drop-shadow(0 0 12px var(--stage-glow));
          }
          .coCreatorImageBadge-partner { --stage-glow: rgba(115,214,199,0.42); }
          .coCreatorImageBadge-advisor { --stage-glow: rgba(255,122,69,0.48); }
          .coCreatorImageBadge-mentor { --stage-glow: rgba(243,233,208,0.45); }
          .coCreatorImageBadge-partnerPlus { --stage-glow: rgba(55,219,199,0.54); }
          .coCreatorImageBadge-legend {
            --stage-glow: rgba(235,248,255,0.9);
            width: 204px;
            height: 48px;
            filter:
              drop-shadow(0 0 10px rgba(245,252,255,0.72))
              drop-shadow(0 0 22px rgba(126,215,255,0.62));
          }
          .coCreatorImageBadge img {
            display: block;
            width: 100%;
            height: auto;
            max-height: 100%;
            object-fit: contain;
            pointer-events: none;
            user-select: none;
          }
          .coCreatorCompactName {
            position: absolute;
            left: 50.5%;
            top: 51%;
            z-index: 2;
            width: 58%;
            height: 62%;
            transform: translate(-50%, -50%);
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 22px;
            background:
              radial-gradient(ellipse at 50% 48%, rgba(6,12,16,0.96) 0 40%, rgba(5,10,14,0.9) 56%, rgba(4,8,12,0.3) 70%, rgba(4,8,12,0) 82%),
              repeating-linear-gradient(155deg, rgba(255,255,255,0.035) 0 1px, rgba(255,255,255,0) 1px 8px);
            border: 0;
            box-shadow: none;
            padding: 0 8px;
            pointer-events: none;
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #f8f3df;
            font-family: 'Noto Serif SC', 'Source Han Serif SC', 'Songti SC', 'SimSun', serif;
            font-size: calc(17px * var(--plate-name-scale, 1));
            font-weight: 950;
            line-height: 1;
            -webkit-text-stroke: 0.65px rgba(7,17,24,0.9);
            paint-order: stroke fill;
            text-shadow:
              0 2px 0 rgba(255,255,255,0.18),
              0 -2px 0 rgba(0,0,0,0.98),
              2px 2px 0 rgba(0,0,0,0.88),
              -2px 2px 0 rgba(0,0,0,0.76),
              0 4px 8px rgba(0,0,0,0.82),
              0 0 8px var(--stage-glow);
          }
          .coCreatorImageBadge-legend img {
            filter: saturate(0.38) brightness(1.24) contrast(1.18);
          }
          .coCreatorImageBadge-legend .coCreatorCompactName {
            left: 50.5%;
            width: 60%;
            height: 60%;
            background:
              radial-gradient(ellipse at 50% 48%, rgba(5,14,22,0.95) 0 40%, rgba(5,14,22,0.88) 56%, rgba(5,14,22,0.3) 70%, rgba(5,14,22,0) 82%),
              repeating-linear-gradient(155deg, rgba(235,248,255,0.05) 0 1px, rgba(235,248,255,0) 1px 8px);
            font-size: calc(18px * var(--plate-name-scale, 1));
            color: #f7fcff;
            text-shadow:
              0 2px 0 rgba(255,255,255,0.14),
              0 -2px 0 rgba(0,0,0,0.98),
              2px 2px 0 rgba(0,0,0,0.88),
              -2px 2px 0 rgba(0,0,0,0.74),
              0 0 10px rgba(0,0,0,0.82),
              0 0 8px rgba(126,215,255,0.2);
          }
          @media (max-width: 860px) {
            .coCreatorImageBadge {
              width: 148px;
              height: 36px;
            }
            .coCreatorImageBadge-legend {
              width: 170px;
              height: 40px;
            }
            .coCreatorCompactName {
              font-size: calc(12px * var(--plate-name-scale, 1));
            }
          }
          @media (max-width: 420px) {
            .coCreatorImageBadge {
              width: 132px;
              height: 32px;
            }
            .coCreatorImageBadge-legend {
              width: 150px;
              height: 36px;
            }
            .coCreatorCompactName {
              font-size: calc(11px * var(--plate-name-scale, 1));
            }
          }
        `}</style>
      </span>
    )
  }

  return (
    <span
      className={`coCreatorBadge coCreatorBadge-${stage.className}`}
      title={titleText}
    >
      <img className="coCreatorPlateImage" src={stage.plateImage} alt="" aria-hidden="true" />
      <span className="coCreatorNamePanel" aria-hidden="true" />
      <span className="coCreatorContent" style={nameStyle}>
        <span className="coCreatorTopline">
          <span className="coCreatorRankLabel">{stage.shortName}</span>
          {level.level < 19 && <span className="coCreatorLevel">LV.{level.level}</span>}
        </span>
        <span className="coCreatorTitle">{name}</span>
        {level.level < 19 && <span className="coCreatorContribution">{targetText} 贡献</span>}
      </span>
      <style>{`
        .coCreatorBadge {
          --stage-main: #ffd86b;
          --stage-soft: rgba(255,216,107,0.2);
          --stage-deep: #251805;
          --stage-glow: rgba(255,216,107,0.42);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 270px;
          height: 56px;
          padding: 7px 58px;
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
          --stage-main: #edf8ff;
          --stage-soft: rgba(235,248,255,0.3);
          --stage-deep: #061521;
          --stage-glow: rgba(235,248,255,0.9);
          width: 330px;
          height: 74px;
          padding: 10px 74px;
          filter:
            drop-shadow(0 0 12px rgba(245,252,255,0.7))
            drop-shadow(0 0 28px rgba(126,215,255,0.6));
        }
        .coCreatorPlateImage {
          position: absolute;
          left: 50%;
          top: 50%;
          z-index: -2;
          width: 122%;
          height: auto;
          transform: translate(-50%, -50%);
          pointer-events: none;
          user-select: none;
        }
        .coCreatorBadge-legend .coCreatorPlateImage {
          width: 128%;
          filter: saturate(0.38) brightness(1.24) contrast(1.18);
        }
        .coCreatorNamePanel {
          position: absolute;
          left: 50%;
          top: 51%;
          z-index: 0;
          width: 63%;
          height: 62%;
          transform: translate(-50%, -50%);
          border-radius: 28px;
          background:
            radial-gradient(ellipse at 50% 48%, color-mix(in srgb, var(--stage-main) 8%, #05090b 92%) 0 40%, rgba(4,8,10,0.9) 57%, rgba(4,8,10,0.28) 72%, rgba(4,8,10,0) 84%),
            repeating-linear-gradient(155deg, rgba(255,255,255,0.035) 0 1px, rgba(255,255,255,0) 1px 8px);
          border: 0;
          box-shadow: none;
          opacity: 1;
          pointer-events: none;
        }
        .coCreatorBadge-legend .coCreatorNamePanel {
          width: 62%;
          height: 54%;
          background:
            radial-gradient(ellipse at 50% 48%, rgba(7,19,31,0.95) 0 40%, rgba(5,15,25,0.88) 57%, rgba(5,15,25,0.28) 72%, rgba(5,15,25,0) 84%),
            repeating-linear-gradient(155deg, rgba(235,248,255,0.05) 0 1px, rgba(235,248,255,0) 1px 8px);
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
          font-family: 'Noto Serif SC', 'Noto Sans SC', serif;
          font-size: 11px;
          font-weight: 950;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 118px;
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
          max-width: 126px;
          overflow: hidden;
          text-overflow: ellipsis;
          font-family: 'Noto Serif SC', 'Noto Sans SC', serif;
          font-size: calc(22px * var(--plate-name-scale, 1));
          font-weight: 950;
          margin-top: 2px;
          white-space: nowrap;
          -webkit-text-stroke: 0.7px color-mix(in srgb, var(--stage-main) 20%, #071018 80%);
          paint-order: stroke fill;
          text-shadow:
            0 2px 0 rgba(255,255,255,0.18),
            0 -2px 0 rgba(0,0,0,0.98),
            2px 2px 0 rgba(0,0,0,0.86),
            -2px 2px 0 rgba(0,0,0,0.76),
            0 4px 9px rgba(0,0,0,0.82),
            0 0 12px var(--stage-glow);
        }
        .coCreatorBadge-legend .coCreatorRankLabel {
          max-width: 132px;
          color: #f5fcff;
          font-size: 11px;
        }
        .coCreatorBadge-legend .coCreatorTitle {
          max-width: 142px;
          color: #ffffff;
          font-size: calc(28px * var(--plate-name-scale, 1));
          -webkit-text-stroke-color: rgba(7,27,45,0.92);
          text-shadow:
            0 2px 0 rgba(255,255,255,0.22),
            0 -2px 0 rgba(5,20,42,0.95),
            2px 2px 0 rgba(0,0,0,0.78),
            -2px 2px 0 rgba(0,0,0,0.72),
            0 0 10px rgba(245,252,255,0.62),
            0 0 18px rgba(126,215,255,0.5);
        }
        .coCreatorContribution {
          display: inline-flex;
          align-items: center;
          margin-top: 3px;
          border: 1px solid color-mix(in srgb, var(--stage-main) 44%, transparent);
          border-radius: 999px;
          background: rgba(0,0,0,0.35);
          padding: 1px 5px;
          color: #fff4c9;
          font-size: 10px;
          font-weight: 900;
          white-space: nowrap;
        }
        @media (max-width: 860px) {
          .coCreatorBadge {
            width: 234px;
            height: 52px;
            padding: 7px 50px;
          }
          .coCreatorBadge-legend {
            width: 256px;
            height: 58px;
            padding: 7px 52px;
          }
          .coCreatorTitle {
            max-width: 104px;
            font-size: calc(18px * var(--plate-name-scale, 1));
          }
          .coCreatorBadge-legend .coCreatorTitle {
            max-width: 112px;
            font-size: calc(21px * var(--plate-name-scale, 1));
          }
        }
      `}</style>
    </span>
  )
}

export function LevelBadge({ name, xp, contributionPoints = 0, compact = false, track = "personal", coCreatorApproved = false, previewLevel }: LevelBadgeProps) {
  const levelAccess = { coCreatorApproved, contributionPoints }
  const level = typeof previewLevel === "number"
    ? (LEVEL_TRACKS[track] || LEVEL_TRACKS.personal)[previewLevel] || getUserLevel(xp, track, levelAccess)
    : getUserLevel(xp, track, levelAccess)
  const next = getNextLevel(xp, track, levelAccess)
  const isCoCreator = coCreatorApproved && level.level >= 15

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
      : "已达最高普通档"

  return (
    <LevelTitlePlate
      name={name}
      level={level}
      next={next}
      xpLabel={xpLabel}
      compact={compact}
    />
  )
}
