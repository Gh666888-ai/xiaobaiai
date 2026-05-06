type XiaobaiLogoProps = {
  compact?: boolean
}

export function XiaobaiLogo({ compact = false }: XiaobaiLogoProps) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: compact ? 7 : 9, color: "#fff" }}>
      <span
        aria-hidden="true"
        style={{
          width: compact ? 30 : 34,
          height: compact ? 30 : 34,
          borderRadius: 10,
          position: "relative",
          flexShrink: 0,
          background: "linear-gradient(145deg, #fff7db 0%, #e8c96a 46%, #8b6a23 100%)",
          border: "1px solid rgba(255,238,172,0.85)",
          boxShadow: "0 0 22px rgba(201,168,76,0.28), inset 0 2px 8px rgba(255,255,255,0.65), inset 0 -8px 12px rgba(68,45,8,0.26)",
          overflow: "hidden",
        }}
      >
        <span style={{ position: "absolute", top: 5, left: 7, width: 8, height: 8, borderRadius: "50%", background: "#111", boxShadow: "0 0 0 2px rgba(255,255,255,0.86) inset" }} />
        <span style={{ position: "absolute", top: 5, right: 7, width: 8, height: 8, borderRadius: "50%", background: "#111", boxShadow: "0 0 0 2px rgba(255,255,255,0.86) inset" }} />
        <span style={{ position: "absolute", left: "50%", bottom: 7, transform: "translateX(-50%)", width: 15, height: 6, borderRadius: 999, background: "#171717" }}>
          <span style={{ position: "absolute", left: "50%", top: 2, transform: "translateX(-50%)", width: 6, height: 2, borderRadius: 999, background: "#e8c96a" }} />
        </span>
        <span style={{ position: "absolute", left: "50%", top: -7, transform: "translateX(-50%)", width: 2, height: 9, borderRadius: 999, background: "#e8c96a" }} />
        <span style={{ position: "absolute", left: "50%", top: -13, transform: "translateX(-50%)", width: 9, height: 9, borderRadius: "50%", background: "#3DA563", border: "1px solid rgba(255,255,255,0.85)", boxShadow: "0 0 12px rgba(61,165,99,0.8)" }} />
        <span style={{ position: "absolute", left: 4, top: 2, width: 13, height: 7, borderRadius: "50%", transform: "rotate(-24deg)", background: "rgba(255,255,255,0.45)" }} />
      </span>
      <span style={{ display: "inline-flex", flexDirection: "column", lineHeight: 1 }}>
        <span style={{ fontSize: compact ? 12 : 13, fontWeight: 950, letterSpacing: "0.04em", color: "#fff", fontFamily: "'Noto Sans SC', sans-serif" }}>小白AI</span>
        {!compact && (
          <span style={{ marginTop: 4, fontFamily: "'JetBrains Mono', monospace", fontSize: 8, fontWeight: 900, letterSpacing: "0.18em", color: "#c9a84c" }}>XIAOBAI</span>
        )}
      </span>
      {!compact && (
        <span style={{ height: 18, display: "inline-flex", alignItems: "center", padding: "0 6px", borderRadius: 999, border: "1px solid rgba(61,165,99,0.4)", background: "rgba(61,165,99,0.08)", color: "#7ee7a8", fontFamily: "'JetBrains Mono', monospace", fontSize: 8, fontWeight: 900, letterSpacing: "0.08em" }}>
          AI
        </span>
      )}
    </span>
  )
}
