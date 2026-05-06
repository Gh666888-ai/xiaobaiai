"use client"

import { Crown, Diamond, Gem, Hexagon, Sparkle, Star, Zap } from "lucide-react"
import { getNextLevel, getUserLevel } from "@/data/user"

type LevelBadgeProps = {
  name: string
  xp: number
  compact?: boolean
}

const badgeStyles: Record<number, { icon: any; shape: string; bg: string; glow: string; label: string }> = {
  0: { icon: Hexagon, shape: "22% 78% 78% 22% / 50% 50% 50% 50%", bg: "linear-gradient(145deg,#f1f1f1,#8f8f8f)", glow: "rgba(190,190,190,0.35)", label: "新" },
  1: { icon: Sparkle, shape: "50%", bg: "radial-gradient(circle at 35% 20%,#fff3c4,#d08a42 62%,#6d3d16)", glow: "rgba(255,170,80,0.48)", label: "星" },
  2: { icon: Star, shape: "30% 70% 70% 30% / 30% 30% 70% 70%", bg: "linear-gradient(145deg,#ffffff,#9fb2c8 58%,#43556a)", glow: "rgba(210,232,255,0.5)", label: "翼" },
  3: { icon: Zap, shape: "12px", bg: "radial-gradient(circle at 32% 24%,#fff6bd,#c9a84c 58%,#6d541d)", glow: "rgba(255,216,96,0.58)", label: "核" },
  4: { icon: Gem, shape: "18% 82% 50% 50% / 24% 24% 76% 76%", bg: "linear-gradient(145deg,#dffff9,#26d7c6 52%,#11756d)", glow: "rgba(38,215,198,0.62)", label: "曜" },
  5: { icon: Diamond, shape: "26% 74% 50% 50% / 28% 28% 72% 72%", bg: "linear-gradient(145deg,#ffffff,#b692ff 52%,#5932a6)", glow: "rgba(182,146,255,0.72)", label: "钻" },
  6: { icon: Crown, shape: "14px", bg: "linear-gradient(145deg,#ffffff 0%,#ffe28a 36%,#ffb52e 70%,#7a4a05 100%)", glow: "rgba(255,216,107,0.9)", label: "冠" },
}

export function LevelBadge({ name, xp, compact = false }: LevelBadgeProps) {
  const level = getUserLevel(xp)
  const next = getNextLevel(xp)
  const progress = next ? Math.min(100, Math.round(((xp - level.minXP) / (next.level.minXP - level.minXP)) * 100)) : 100
  const isHigh = level.level >= 4
  const isMax = !next
  const visual = badgeStyles[level.level] || badgeStyles[0]
  const Icon = visual.icon
  const isCrown = level.level === 6

  return (
    <span
      title={`${level.name} · ${xp} XP · ${level.desc}${next ? ` · 距离 ${next.level.name} 还差 ${next.need} XP` : " · 已达最高等级"}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: compact ? 7 : 9,
        minWidth: compact ? 0 : 174,
        padding: compact ? "5px 9px 5px 6px" : "6px 12px 6px 7px",
        borderRadius: 999,
        border: `1px solid ${level.color}`,
        background: isMax
          ? "linear-gradient(135deg, rgba(255,216,107,0.18), rgba(255,255,255,0.08) 42%, rgba(0,0,0,0.72)), linear-gradient(90deg, rgba(255,255,255,0.14), transparent)"
          : `linear-gradient(135deg, rgba(255,255,255,0.055), rgba(0,0,0,0.58)), linear-gradient(135deg, ${level.color}22, transparent 62%)`,
        boxShadow: isHigh ? `0 0 24px ${visual.glow}, inset 0 0 0 1px rgba(255,255,255,0.1)` : "inset 0 0 0 1px rgba(255,255,255,0.05)",
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
        {isCrown ? (
          <>
            <span style={{ position: "absolute", inset: compact ? 5 : 6, borderRadius: 8, background: "linear-gradient(145deg,#ffffff,#8cefff 48%,#008fa3)", transform: "rotate(45deg)", boxShadow: "0 0 12px rgba(126,231,215,0.45), inset 0 1px 4px rgba(255,255,255,0.85)" }} />
            <Crown size={compact ? 17 : 21} strokeWidth={2.7} fill="#ffd66b" color="#5c3500" style={{ position: "relative", zIndex: 1, filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.3))" }} />
          </>
        ) : (
          <Icon size={compact ? 14 : 16} strokeWidth={2.1} style={{ transform: level.level >= 4 ? "rotate(-45deg)" : "none" }} />
        )}
      </span>
      <span style={{ display: "flex", flexDirection: "column", minWidth: 0, lineHeight: 1.1 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ maxWidth: compact ? 70 : 88, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 12, fontWeight: 950, color: "#fff" }}>
            {name}
          </span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 900, color: level.accent, letterSpacing: "0.04em" }}>
            LV.{level.level}
          </span>
        </span>
        {!compact && (
          <span style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 5 }}>
            <span style={{ color: level.accent, fontSize: 10, fontWeight: 950, whiteSpace: "nowrap" }}>{isMax ? "皇冠共创" : level.name}</span>
            <span style={{ flex: 1, height: 3, minWidth: 38, borderRadius: 999, background: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
              <span style={{ display: "block", width: `${progress}%`, height: "100%", borderRadius: 999, background: `linear-gradient(90deg, ${level.color}, ${level.accent})` }} />
            </span>
          </span>
        )}
      </span>
      {(isHigh || isMax) && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(110deg, transparent 0%, transparent 36%, ${level.accent}2e 48%, transparent 60%, transparent 100%)`,
            transform: "translateX(-35%)",
            pointerEvents: "none",
            animation: isMax ? "levelShine 2.6s ease-in-out infinite" : "none",
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
