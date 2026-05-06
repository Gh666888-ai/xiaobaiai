type XiaobaiMascotProps = {
  size?: number
  mood?: "idle" | "thinking" | "happy" | "talking" | "welcome" | "recommend" | "complete"
}

export function XiaobaiMascot({ size = 44, mood = "idle" }: XiaobaiMascotProps) {
  const isThinking = mood === "thinking"
  const isRecommend = mood === "recommend"
  const isComplete = mood === "complete"
  const isTalking = mood === "talking"

  return (
    <div
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
        borderRadius: "50%",
        background: "rgba(255,255,255,0.92)",
        boxShadow: isThinking
          ? "0 0 22px rgba(67,210,232,0.45), 0 10px 30px rgba(0,0,0,0.28)"
          : isRecommend
            ? "0 0 22px rgba(25,194,216,0.38), 0 10px 30px rgba(0,0,0,0.28)"
            : "0 0 18px rgba(25,194,216,0.3), 0 10px 30px rgba(0,0,0,0.24)",
        animation: isTalking ? "xiaobaiSpeak 0.55s ease-in-out infinite" : isThinking ? "xiaobaiThink 1.6s ease-in-out infinite" : "xiaobaiBreathe 3s ease-in-out infinite",
        overflow: "visible",
      }}
    >
      <img
        src="/xiaobai-mascot.png"
        alt=""
        style={{
          width: size,
          height: size,
          objectFit: "cover",
          borderRadius: "50%",
          display: "block",
        }}
      />

      {isThinking && (
        <div style={{ position: "absolute", right: -2, top: -4, display: "flex", gap: 3 }}>
          {[0, 1, 2].map((dot) => (
            <span key={dot} style={{ width: 5, height: 5, borderRadius: "50%", background: dot === 1 ? "#24c7db" : "rgba(36,199,219,0.42)" }} />
          ))}
        </div>
      )}

      {isRecommend && (
        <div style={{ position: "absolute", right: -4, bottom: 3, width: Math.max(18, size * 0.34), height: Math.max(14, size * 0.24), borderRadius: 6, background: "rgba(36,199,219,0.94)", border: "1px solid rgba(255,255,255,0.65)", color: "#fff", fontSize: Math.max(8, size * 0.12), fontWeight: 950, display: "flex", alignItems: "center", justifyContent: "center" }}>
          AI
        </div>
      )}

      {isComplete && (
        <div style={{ position: "absolute", right: -2, top: -2, width: Math.max(16, size * 0.28), height: Math.max(16, size * 0.28), borderRadius: "50%", background: "#18b878", color: "#fff", fontSize: Math.max(9, size * 0.14), fontWeight: 950, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.8)" }}>
          ✓
        </div>
      )}

      <style>{`
        @keyframes xiaobaiSpeak {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-2px) scale(1.045); }
        }
        @keyframes xiaobaiThink {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-3px) rotate(-2deg); }
        }
        @keyframes xiaobaiBreathe {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-2px) scale(1.02); }
        }
      `}</style>
    </div>
  )
}
