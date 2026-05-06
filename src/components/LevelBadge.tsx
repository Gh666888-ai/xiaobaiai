"use client"

import { getNextLevel, getUserLevel } from "@/data/user"

type LevelBadgeProps = {
  name: string
  xp: number
  compact?: boolean
}

export function LevelBadge({ name, xp, compact = false }: LevelBadgeProps) {
  const level = getUserLevel(xp)
  const next = getNextLevel(xp)
  const progress = next ? Math.min(100, Math.round(((xp - level.minXP) / (next.level.minXP - level.minXP)) * 100)) : 100
  const isHigh = level.level >= 4
  const isMax = !next

  return (
    <span
      title={`${level.name} · ${xp} XP · ${level.desc}${next ? ` · 距离 ${next.level.name} 还差 ${next.need} XP` : " · 已达最高等级"}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: compact ? 7 : 9,
        minWidth: compact ? 0 : 164,
        padding: compact ? "5px 9px 5px 6px" : "6px 12px 6px 7px",
        borderRadius: 999,
        border: `1px solid ${level.color}`,
        background: `linear-gradient(135deg, rgba(255,255,255,0.05), rgba(0,0,0,0.55)), linear-gradient(135deg, ${level.color}24, transparent 62%)`,
        boxShadow: isHigh ? `0 0 22px ${level.color}42, inset 0 0 0 1px rgba(255,255,255,0.08)` : "inset 0 0 0 1px rgba(255,255,255,0.05)",
        color: "#fff",
        textDecoration: "none",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: compact ? 24 : 28,
          height: compact ? 24 : 28,
          borderRadius: "50%",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          color: "#111",
          fontSize: compact ? 13 : 15,
          fontWeight: 950,
          background: `radial-gradient(circle at 35% 25%, ${level.accent}, ${level.color} 58%, #4a3512)`,
          boxShadow: `0 0 16px ${level.color}55, inset 0 1px 5px rgba(255,255,255,0.72)`,
        }}
      >
        {level.badge}
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
            <span style={{ color: level.accent, fontSize: 10, fontWeight: 950, whiteSpace: "nowrap" }}>{level.name}</span>
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
            background: `linear-gradient(110deg, transparent 0%, transparent 38%, ${level.accent}22 48%, transparent 58%, transparent 100%)`,
            transform: "translateX(-35%)",
            pointerEvents: "none",
          }}
        />
      )}
    </span>
  )
}
