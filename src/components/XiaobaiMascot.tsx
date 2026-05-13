type XiaobaiMascotProps = {
  size?: number
  mood?: "idle" | "thinking" | "happy" | "talking" | "welcome" | "recommend" | "complete" | "sleeping" | "peeking"
}

export function XiaobaiMascot({ size = 44, mood = "idle" }: XiaobaiMascotProps) {
  const isThinking = mood === "thinking"
  const isRecommend = mood === "recommend"
  const isComplete = mood === "complete"
  const imageSize = Math.round(size * 1.46)

  return (
    <div
      className={`xiaobai-mascot xiaobai-mascot-${mood}`}
      aria-label="小白AI助手"
      title="小白AI助手"
      style={{
        width: size,
        height: size,
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        overflow: "visible",
        filter: isThinking
          ? "drop-shadow(0 0 18px rgba(67,210,232,0.5)) drop-shadow(0 14px 22px rgba(0,0,0,0.36))"
          : isRecommend
            ? "drop-shadow(0 0 18px rgba(25,194,216,0.42)) drop-shadow(0 14px 22px rgba(0,0,0,0.34))"
            : "drop-shadow(0 0 14px rgba(25,194,216,0.28)) drop-shadow(0 12px 20px rgba(0,0,0,0.32))",
      }}
    >
      <img
        className="xiaobai-mascot-img"
        src="/xiaobai-mascot-cutout.png"
        alt=""
        style={{
          width: imageSize,
          height: imageSize,
          objectFit: "contain",
          display: "block",
          pointerEvents: "none",
          userSelect: "none",
        }}
      />

      {isThinking && (
        <div style={{ position: "absolute", right: -6, top: -10, display: "flex", gap: 3 }}>
          {[0, 1, 2].map((dot) => (
            <span key={dot} style={{ width: 5, height: 5, borderRadius: "50%", background: dot === 1 ? "#24c7db" : "rgba(36,199,219,0.42)" }} />
          ))}
        </div>
      )}

      {isRecommend && (
        <div style={{ position: "absolute", right: -8, bottom: -2, width: Math.max(18, size * 0.34), height: Math.max(14, size * 0.24), borderRadius: 6, background: "rgba(36,199,219,0.94)", border: "1px solid rgba(255,255,255,0.65)", color: "#fff", fontSize: Math.max(8, size * 0.12), fontWeight: 950, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 20px rgba(0,0,0,0.32)" }}>
          AI
        </div>
      )}

      {isComplete && (
        <div style={{ position: "absolute", right: -6, top: -6, width: Math.max(16, size * 0.28), height: Math.max(16, size * 0.28), borderRadius: "50%", background: "#18b878", color: "#fff", fontSize: Math.max(9, size * 0.14), fontWeight: 950, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.8)", boxShadow: "0 8px 20px rgba(0,0,0,0.3)" }}>
          ✓
        </div>
      )}

    </div>
  )
}
