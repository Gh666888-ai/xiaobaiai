"use client"

import { Crown, Diamond, Gem, Hexagon, Sparkle, Star, Zap } from "lucide-react"
import { getNextLevel, getUserLevel, LevelTrack } from "@/data/user"

type LevelBadgeProps = {
  name: string
  xp: number
  compact?: boolean
  track?: LevelTrack
  coCreatorApproved?: boolean
}

const badgeStyles: Record<number, { icon: any; shape: string; bg: string; glow: string; label: string }> = {
  0: { icon: Hexagon, shape: "22% 78% 78% 22% / 50% 50% 50% 50%", bg: "linear-gradient(145deg,#f5f5f5,#8f8f8f)", glow: "rgba(190,190,190,0.35)", label: "新芽" },
  1: { icon: Sparkle, shape: "50%", bg: "radial-gradient(circle at 35% 20%,#fff3c4,#d08a42 62%,#6d3d16)", glow: "rgba(255,170,80,0.48)", label: "星火" },
  2: { icon: Star, shape: "30% 70% 70% 30% / 30% 30% 70% 70%", bg: "linear-gradient(145deg,#ffffff,#9fb2c8 58%,#43556a)", glow: "rgba(210,232,255,0.5)", label: "银翼" },
  3: { icon: Zap, shape: "12px", bg: "radial-gradient(circle at 32% 24%,#fff6bd,#c9a84c 58%,#6d541d)", glow: "rgba(255,216,96,0.58)", label: "金核" },
  4: { icon: Gem, shape: "18% 82% 50% 50% / 24% 24% 76% 76%", bg: "linear-gradient(145deg,#dffff9,#26d7c6 52%,#11756d)", glow: "rgba(38,215,198,0.62)", label: "曜石" },
  5: { icon: Diamond, shape: "26% 74% 50% 50% / 28% 28% 72% 72%", bg: "linear-gradient(145deg,#ffffff,#b692ff 52%,#5932a6)", glow: "rgba(182,146,255,0.72)", label: "星环" },
  6: { icon: Crown, shape: "14px", bg: "linear-gradient(145deg,#fff8c8 0%,#ffd86b 38%,#ffad2f 72%,#714205 100%)", glow: "rgba(255,216,107,0.86)", label: "皇冠" },
  7: { icon: Diamond, shape: "22% 78% 50% 50% / 26% 26% 74% 74%", bg: "linear-gradient(145deg,#ffffff 0%,#bff8ff 28%,#47d9ff 58%,#7f66ff 100%)", glow: "rgba(126,231,255,0.95)", label: "共创" },
}

function CoCreatorAvatar({ compact, level }: { compact: boolean; level: number }) {
  const size = compact ? 32 : 42
  const ringOpacity = level >= 19 ? 0.98 : level >= 18 ? 0.78 : level >= 17 ? 0.58 : level >= 16 ? 0.42 : 0.28
  const aura = level >= 19
    ? "0 0 24px rgba(126,231,255,0.95), 0 0 48px rgba(182,146,255,0.72), 0 0 72px rgba(255,216,107,0.32)"
    : level >= 18
      ? "0 0 22px rgba(182,146,255,0.82), 0 0 42px rgba(126,231,255,0.46)"
      : level >= 17
        ? "0 0 20px rgba(38,215,198,0.72), 0 0 34px rgba(126,231,255,0.28)"
        : level >= 16
          ? "0 0 18px rgba(255,216,107,0.62), 0 0 28px rgba(182,146,255,0.20)"
          : "0 0 16px rgba(201,168,76,0.52)"
  return (
    <span
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        borderRadius: "26% 74% 50% 50% / 28% 28% 72% 72%",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        position: "relative",
        transform: "rotate(45deg)",
        overflow: "hidden",
        background: "linear-gradient(145deg,#ffffff,#9df3ff 36%,#5d7dff 68%,#28155f)",
        border: "1px solid rgba(255,255,255,0.78)",
        boxShadow: `${aura}, inset 0 2px 8px rgba(255,255,255,0.9), inset 0 -10px 16px rgba(0,0,0,0.25)`,
      }}
    >
      <span
        style={{
          position: "absolute",
          inset: level >= 19 ? 1 : 3,
          borderRadius: "inherit",
          border: `1px solid rgba(255,255,255,${ringOpacity})`,
          boxShadow: level >= 18 ? "inset 0 0 12px rgba(255,255,255,0.42)" : "none",
          pointerEvents: "none",
        }}
      />
      {level >= 17 && (
        <span
          style={{
            position: "absolute",
            inset: level >= 19 ? -9 : -6,
            borderRadius: "inherit",
            border: `1px solid ${level >= 19 ? "rgba(255,216,107,0.72)" : "rgba(126,231,255,0.42)"}`,
            transform: "rotate(8deg)",
            opacity: compact ? 0.45 : 0.72,
            pointerEvents: "none",
          }}
        />
      )}
      <span
        style={{
          position: "absolute",
          inset: 4,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.82)",
          transform: "rotate(-45deg)",
          boxShadow: "inset 0 0 0 1px rgba(126,231,255,0.42)",
        }}
      />
      <img
        src="/xiaobai-mascot-cutout.png"
        alt=""
        style={{
          width: compact ? 37 : 50,
          height: compact ? 37 : 50,
          objectFit: "contain",
          position: "relative",
          zIndex: 2,
          transform: "rotate(-45deg) translateY(1px)",
          filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.28))",
        }}
      />
      <span
        style={{
          position: "absolute",
          width: "150%",
          height: 8,
          background: level >= 19 ? "linear-gradient(90deg, transparent, rgba(255,255,255,1), rgba(255,216,107,0.96), transparent)" : "linear-gradient(90deg, transparent, rgba(255,255,255,0.95), transparent)",
          transform: "rotate(-18deg) translateX(-32%)",
          animation: `coCreatorGemShine ${level >= 19 ? "2.05s" : level >= 18 ? "2.35s" : "2.8s"} ease-in-out infinite`,
          zIndex: 3,
        }}
      />
    </span>
  )
}

function coCreatorTone(level: number) {
  if (level >= 19) return {
    border: "rgba(126,231,255,0.92)",
    bg: "radial-gradient(circle at 20% 35%, rgba(255,255,255,0.24), transparent 18%), radial-gradient(circle at 72% 44%, rgba(255,216,107,0.28), transparent 22%), linear-gradient(135deg, rgba(126,231,255,0.28), rgba(255,216,107,0.15) 27%, rgba(182,146,255,0.18) 50%, rgba(11,8,32,0.92)), linear-gradient(90deg, rgba(255,255,255,0.22), transparent)",
    glow: "0 0 34px rgba(126,231,255,0.72), 0 0 62px rgba(182,146,255,0.44), 0 0 86px rgba(255,216,107,0.18), inset 0 0 0 1px rgba(255,255,255,0.18)",
    tag: "MAX",
    shine: "rgba(255,216,107,0.36)",
    pattern: "divine",
  }
  if (level >= 18) return {
    border: "rgba(182,146,255,0.84)",
    bg: "radial-gradient(circle at 84% 28%, rgba(126,231,255,0.22), transparent 24%), linear-gradient(135deg, rgba(182,146,255,0.22), rgba(126,231,255,0.10) 42%, rgba(16,10,36,0.86)), linear-gradient(90deg, rgba(255,255,255,0.14), transparent)",
    glow: "0 0 26px rgba(182,146,255,0.48), 0 0 42px rgba(126,231,255,0.18), inset 0 0 0 1px rgba(255,255,255,0.12)",
    tag: `LV.${level}`,
    shine: "rgba(182,146,255,0.30)",
    pattern: "star-ring",
  }
  if (level >= 17) return {
    border: "rgba(38,215,198,0.78)",
    bg: "radial-gradient(circle at 24% 72%, rgba(126,231,255,0.18), transparent 22%), linear-gradient(135deg, rgba(38,215,198,0.20), rgba(255,255,255,0.07) 40%, rgba(4,31,36,0.86)), linear-gradient(90deg, rgba(255,255,255,0.12), transparent)",
    glow: "0 0 24px rgba(38,215,198,0.42), inset 0 0 0 1px rgba(255,255,255,0.10)",
    tag: `LV.${level}`,
    shine: "rgba(126,231,255,0.24)",
    pattern: "wind",
  }
  if (level >= 16) return {
    border: "rgba(255,216,107,0.76)",
    bg: "radial-gradient(circle at 78% 64%, rgba(255,216,107,0.22), transparent 22%), linear-gradient(135deg, rgba(255,216,107,0.20), rgba(182,146,255,0.07) 40%, rgba(40,26,8,0.86)), linear-gradient(90deg, rgba(255,255,255,0.12), transparent)",
    glow: "0 0 22px rgba(255,216,107,0.38), inset 0 0 0 1px rgba(255,255,255,0.10)",
    tag: `LV.${level}`,
    shine: "rgba(255,216,107,0.22)",
    pattern: "gold-flame",
  }
  return {
    border: "rgba(201,168,76,0.72)",
    bg: "linear-gradient(135deg, rgba(201,168,76,0.17), rgba(255,255,255,0.06) 40%, rgba(28,20,8,0.84)), linear-gradient(90deg, rgba(255,255,255,0.10), transparent)",
    glow: "0 0 18px rgba(201,168,76,0.34), inset 0 0 0 1px rgba(255,255,255,0.09)",
    tag: `LV.${level}`,
    shine: "rgba(201,168,76,0.18)",
    pattern: "scale",
  }
}

export function LevelBadge({ name, xp, compact = false, track = "personal", coCreatorApproved = false }: LevelBadgeProps) {
  const level = getUserLevel(xp, track, { coCreatorApproved })
  const next = getNextLevel(xp, track, { coCreatorApproved })
  const progress = next?.requiresReview ? 100 : next ? Math.min(100, Math.round(((xp - level.minXP) / (next.level.minXP - level.minXP)) * 100)) : 100
  const xpLabel = next?.requiresReview ? `${xp} XP · 共创待审核` : next ? `${xp} XP` : "已达最高档"
  const visual = badgeStyles[level.level] || badgeStyles[0]
  const Icon = visual.icon
  const isHigh = level.level >= 4
  const isCrown = level.level === 6
  const isCoCreator = coCreatorApproved && level.level >= 15
  const coTone = coCreatorTone(level.level)

  return (
    <span
      title={`${level.name} · ${xpLabel} · ${level.desc}${next ? next.requiresReview ? ` · 达到共创门槛，需人工审核后解锁 ${next.level.name}` : ` · 距离 ${next.level.name} 还差 ${next.need} XP` : " · 已达最高档"}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: compact ? 7 : 10,
        minWidth: compact ? 0 : isCoCreator ? 208 : 174,
        padding: compact ? "5px 9px 5px 6px" : "6px 13px 6px 7px",
        borderRadius: 999,
        border: `1px solid ${isCoCreator ? coTone.border : level.color}`,
        background: isCoCreator
          ? coTone.bg
          : isCrown
            ? "linear-gradient(135deg, rgba(255,216,107,0.18), rgba(255,255,255,0.08) 42%, rgba(0,0,0,0.72)), linear-gradient(90deg, rgba(255,255,255,0.14), transparent)"
            : `linear-gradient(135deg, rgba(255,255,255,0.055), rgba(0,0,0,0.58)), linear-gradient(135deg, ${level.color}22, transparent 62%)`,
        boxShadow: isCoCreator
          ? coTone.glow
          : isHigh
            ? `0 0 24px ${visual.glow}, inset 0 0 0 1px rgba(255,255,255,0.1)`
            : "inset 0 0 0 1px rgba(255,255,255,0.05)",
        color: "#fff",
        textDecoration: "none",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {isCoCreator ? (
        <CoCreatorAvatar compact={compact} level={level.level} />
      ) : (
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
      )}
      {isCoCreator && (
        <>
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: compact ? 2 : 3,
              borderRadius: 999,
              background:
                coTone.pattern === "divine"
                  ? "repeating-linear-gradient(118deg, transparent 0 13px, rgba(255,216,107,0.16) 13px 14px, transparent 14px 25px), radial-gradient(circle at 82% 50%, rgba(126,231,255,0.22), transparent 28%)"
                  : coTone.pattern === "star-ring"
                    ? "repeating-radial-gradient(circle at 78% 42%, transparent 0 10px, rgba(182,146,255,0.20) 10px 11px, transparent 11px 20px)"
                    : coTone.pattern === "wind"
                      ? "repeating-linear-gradient(150deg, transparent 0 16px, rgba(126,231,255,0.16) 16px 18px, transparent 18px 30px)"
                      : coTone.pattern === "gold-flame"
                        ? "radial-gradient(ellipse at 76% 68%, rgba(255,216,107,0.22), transparent 34%), repeating-linear-gradient(42deg, transparent 0 18px, rgba(255,216,107,0.14) 18px 19px, transparent 19px 32px)"
                        : "repeating-linear-gradient(135deg, rgba(255,255,255,0.05) 0 4px, transparent 4px 12px)",
              opacity: compact ? 0.42 : 0.68,
              mixBlendMode: "screen",
              pointerEvents: "none",
            }}
          />
          {level.level >= 18 && (
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                right: compact ? 8 : 14,
                top: compact ? 6 : 8,
                width: compact ? 38 : 58,
                height: compact ? 18 : 24,
                borderRadius: "50%",
                borderTop: `2px solid ${level.level >= 19 ? "rgba(255,216,107,0.72)" : "rgba(126,231,255,0.54)"}`,
                borderRight: `1px solid ${level.level >= 19 ? "rgba(255,255,255,0.46)" : "rgba(182,146,255,0.38)"}`,
                transform: "rotate(-12deg)",
                filter: "blur(0.1px)",
                opacity: compact ? 0.48 : 0.76,
                pointerEvents: "none",
              }}
            />
          )}
        </>
      )}
      <span style={{ display: "flex", flexDirection: "column", minWidth: 0, lineHeight: 1.1 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ maxWidth: compact ? 70 : 92, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 12, fontWeight: 950, color: "#fff" }}>
            {name}
          </span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 900, color: level.accent, letterSpacing: "0.04em" }}>
            {isCoCreator ? coTone.tag : `LV.${level.level}`}
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
      {(isHigh || isCoCreator) && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(110deg, transparent 0%, transparent 34%, ${isCoCreator ? coTone.shine : `${level.accent}2e`} 48%, transparent 62%, transparent 100%)`,
            transform: "translateX(-35%)",
            pointerEvents: "none",
            animation: level.level >= 6 ? `levelShine ${isCoCreator && level.level >= 19 ? "2.05s" : isCoCreator ? "2.35s" : "2.6s"} ease-in-out infinite` : "none",
          }}
        />
      )}
      <style>{`
        @keyframes levelShine {
          0% { transform: translateX(-80%); }
          70%, 100% { transform: translateX(80%); }
        }
        @keyframes coCreatorGemShine {
          0% { transform: rotate(-18deg) translateX(-95%); opacity: 0; }
          18% { opacity: 0.95; }
          48%, 100% { transform: rotate(-18deg) translateX(95%); opacity: 0; }
        }
      `}</style>
    </span>
  )
}
