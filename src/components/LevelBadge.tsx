"use client"

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
  name: string
  shortName: string
  group: "starter" | "adept" | "master"
}

type LevelIconProps = {
  level: number
  name: string
  compact?: boolean
  locked?: boolean
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
  0: { image: "/level-plates/title-level-01.png", name: "AI???", shortName: "???", group: "starter" },
  1: { image: "/level-plates/title-level-01.png", name: "AI???", shortName: "???", group: "starter" },
  2: { image: "/level-plates/title-level-02.png", name: "????", shortName: "??", group: "starter" },
  3: { image: "/level-plates/title-level-03.png", name: "????", shortName: "??", group: "starter" },
  4: { image: "/level-plates/title-level-04.png", name: "????", shortName: "??", group: "starter" },
  5: { image: "/level-plates/title-level-05.png", name: "????", shortName: "??", group: "adept" },
  6: { image: "/level-plates/title-level-06.png", name: "????", shortName: "??", group: "adept" },
  7: { image: "/level-plates/title-level-07.png", name: "????", shortName: "??", group: "adept" },
  8: { image: "/level-plates/title-level-08.png", name: "????", shortName: "??", group: "adept" },
  9: { image: "/level-plates/title-level-09.png", name: "????", shortName: "??", group: "adept" },
  10: { image: "/level-plates/title-level-10.png", name: "????", shortName: "??", group: "master" },
  11: { image: "/level-plates/title-level-11.png", name: "????", shortName: "??", group: "master" },
  12: { image: "/level-plates/title-level-12.png", name: "????", shortName: "??", group: "master" },
  13: { image: "/level-plates/title-level-13.png", name: "????", shortName: "??", group: "master" },
  14: { image: "/level-plates/title-level-14.png", name: "????", shortName: "??", group: "master" },
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
  if (level <= 0) return autoPlates[0]
  if (level >= 14) return autoPlates[14]
  return autoPlates[level] || autoPlates[1]
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
  const titleText = `${level.name} · ${plate.name} · ${xpLabel} · ${level.desc}${next ? next.requiresReview ? ` · 达到共创门槛，需要人工审核后解锁 ${next.level.name}` : ` · 距离 ${next.level.name} 还差 ${next.need} XP` : " · 已达当前最高普通档。"}`

  return (
    <span
      className={`levelTitlePlate levelPlate-${plate.group} ${compact ? "isCompact" : ""}`}
      title={`${name} · ${titleText}`}
      aria-label={`${name} · ${titleText}`}
    >
      <img className="levelTitlePlateImage" src={plate.image} alt="" aria-hidden="true" />
      <style>{`
        .levelTitlePlate {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 248px;
          height: 72px;
          position: relative;
          isolation: isolate;
          overflow: visible;
          vertical-align: middle;
          filter:
            drop-shadow(0 5px 9px rgba(0,0,0,0.38))
            drop-shadow(0 0 7px rgba(210,174,96,0.22));
        }
        .levelTitlePlate.isCompact {
          width: 172px;
          height: 38px;
          overflow: hidden;
        }
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
            drop-shadow(0 0 10px rgba(236,178,74,0.3));
        }
        .levelPlate-master {
          filter:
            drop-shadow(0 6px 12px rgba(0,0,0,0.44))
            drop-shadow(0 0 13px rgba(98,224,194,0.34));
        }
        .levelTitlePlateImage {
          position: absolute;
          left: 50%;
          top: 50%;
          z-index: -1;
          width: 118%;
          height: auto;
          max-height: 184%;
          transform: translate(-50%, -50%);
          object-fit: contain;
          pointer-events: none;
          user-select: none;
        }
        .levelPlate-starter .levelTitlePlateImage {
          width: 116%;
          filter: saturate(0.88) brightness(0.9) contrast(1.02);
        }
        .levelPlate-adept .levelTitlePlateImage {
          width: 120%;
          filter: saturate(0.96) brightness(0.92) contrast(1.04);
        }
        .levelPlate-master .levelTitlePlateImage {
          width: 124%;
          filter: saturate(0.92) brightness(0.88) contrast(1.03);
        }
        .levelTitlePlate.isCompact .levelTitlePlateImage {
          width: 218px;
          max-height: none;
        }
        @media (max-width: 860px) {
          .levelTitlePlate {
            width: 218px;
            height: 64px;
          }
          .levelTitlePlate.isCompact {
            width: 152px;
            height: 34px;
          }
          .levelTitlePlate.isCompact .levelTitlePlateImage {
            width: 196px;
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
  const titleText = `${level.level < 19 ? `LV.${level.level} ` : ""}${stage.fullName}${level.level < 19 ? ` · ${contributionPoints} 贡献值` : ""} · ${stage.beastLine} · ${level.desc}`

  if (compact) {
    return (
      <span
        className={`coCreatorImageBadge coCreatorImageBadge-${stage.className}`}
        title={titleText}
        aria-label={titleText}
      >
        <img src={stage.plateImage} alt={stage.shortName} />
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
          .coCreatorImageBadge-legend img {
            filter: saturate(0.38) brightness(1.24) contrast(1.18);
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
          }
        `}</style>
      </span>
    )
  }

  return (
    <span
      className={`coCreatorBadge coCreatorBadge-${stage.className}`}
      title={titleText}
      aria-label={`${name} · ${titleText}`}
    >
      <img className="coCreatorPlateImage" src={stage.plateImage} alt="" aria-hidden="true" />
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
        }
      `}</style>
    </span>
  )
}

export function LevelIcon({ level, name, compact = false, locked = false }: LevelIconProps) {
  const clampedLevel = Math.max(1, Math.min(19, level))
  const src = `/level-icons/level-${String(clampedLevel).padStart(2, "0")}.png`

  return (
    <span className={`levelIconBadge ${compact ? "isCompact" : ""} ${locked ? "isLocked" : ""}`} title={name} aria-label={name}>
      <img src={src} alt={name} />
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
          width: 86px;
          height: 102px;
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
            width: 76px;
            height: 90px;
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
