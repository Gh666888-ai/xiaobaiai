type XiaobaiMascotProps = {
  size?: number
  mood?: "idle" | "thinking" | "happy" | "talking" | "welcome" | "recommend" | "complete"
}

export function XiaobaiMascot({ size = 44, mood = "idle" }: XiaobaiMascotProps) {
  const isThinking = mood === "thinking"
  const isRecommend = mood === "recommend"
  const isComplete = mood === "complete"
  const isHappy = mood === "happy" || mood === "welcome" || isComplete
  const isTalking = mood === "talking"
  const scale = (value: number) => Math.max(1, Math.round(size * value))

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
        filter: isThinking ? "drop-shadow(0 0 18px rgba(232,201,106,0.5))" : isRecommend ? "drop-shadow(0 0 18px rgba(61,165,99,0.42))" : "drop-shadow(0 0 14px rgba(201,168,76,0.32))",
        animation: mood === "welcome" ? "xiaobaiWave 2.4s ease-in-out infinite" : isThinking ? "xiaobaiThink 1.6s ease-in-out infinite" : "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: scale(0.05),
          borderRadius: "34% 34% 38% 38%",
          background: "linear-gradient(145deg, #fffaf0 0%, #f6df93 42%, #c9a84c 100%)",
          border: "1px solid rgba(255,238,172,0.9)",
          boxShadow: "inset 0 2px 8px rgba(255,255,255,0.75), inset 0 -7px 12px rgba(90,64,12,0.18), 0 10px 26px rgba(0,0,0,0.34)",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: scale(0.1), left: scale(0.12), width: scale(0.32), height: scale(0.18), borderRadius: "50%", background: "rgba(255,255,255,0.65)", transform: "rotate(-20deg)" }} />
        <div style={{ position: "absolute", left: "50%", bottom: scale(0.08), transform: "translateX(-50%)", width: scale(0.34), height: scale(0.17), borderRadius: 999, background: "linear-gradient(180deg, rgba(13,13,13,0.92), rgba(36,29,16,0.92))", border: "1px solid rgba(255,255,255,0.12)" }}>
          <div style={{ position: "absolute", left: "50%", top: scale(0.04), transform: "translateX(-50%)", width: scale(isTalking ? 0.14 : 0.08), height: scale(isTalking ? 0.07 : 0.025), borderRadius: 999, background: "#f7d66f", transition: "0.2s", animation: isTalking ? "xiaobaiTalk 0.55s ease-in-out infinite" : "none" }} />
        </div>
      </div>

      <div style={{ position: "absolute", top: -scale(0.15), left: "50%", width: scale(0.045), height: scale(0.2), transform: "translateX(-50%)", borderRadius: 999, background: "linear-gradient(180deg,#fff1a8,#c9a84c)" }} />
      <div style={{ position: "absolute", top: -scale(0.25), left: "50%", width: scale(0.22), height: scale(0.22), transform: "translateX(-50%)", borderRadius: "50%", background: isThinking || isRecommend ? "#3DA563" : "#e8c96a", border: "1px solid rgba(255,255,255,0.8)", boxShadow: `0 0 ${scale(isThinking ? 0.34 : 0.24)}px ${isThinking || isRecommend ? "rgba(61,165,99,0.85)" : "rgba(232,201,106,0.8)"}` }} />

      <div style={{ position: "absolute", top: scale(0.02), left: -scale(0.02), width: scale(0.13), height: scale(0.28), borderRadius: 999, background: "linear-gradient(180deg,#f7e7aa,#9e7b2a)", border: "1px solid rgba(255,238,172,0.55)", transform: mood === "welcome" ? "rotate(-32deg)" : "rotate(-10deg)" }} />
      <div style={{ position: "absolute", top: scale(0.02), right: -scale(0.02), width: scale(0.13), height: scale(0.28), borderRadius: 999, background: "linear-gradient(180deg,#f7e7aa,#9e7b2a)", border: "1px solid rgba(255,238,172,0.55)", transform: isComplete ? "rotate(36deg)" : "rotate(10deg)" }} />

      <div style={{ position: "absolute", top: scale(0.28), left: scale(0.2), width: scale(0.18), height: scale(isHappy ? 0.09 : 0.17), borderRadius: isHappy ? "0 0 999px 999px" : "50%", borderBottom: isHappy ? `${scale(0.045)}px solid #171717` : "none", background: isHappy ? "transparent" : "#151515", boxShadow: isHappy ? "none" : `0 0 0 ${scale(0.035)}px rgba(255,255,255,0.9) inset` }} />
      <div style={{ position: "absolute", top: scale(0.28), right: scale(0.2), width: scale(0.18), height: scale(isHappy ? 0.09 : 0.17), borderRadius: isHappy ? "0 0 999px 999px" : "50%", borderBottom: isHappy ? `${scale(0.045)}px solid #171717` : "none", background: isHappy ? "transparent" : "#151515", boxShadow: isHappy ? "none" : `0 0 0 ${scale(0.035)}px rgba(255,255,255,0.9) inset` }} />

      {!isHappy && (
        <>
          <div style={{ position: "absolute", top: scale(0.32), left: scale(0.27), width: scale(0.05), height: scale(0.05), borderRadius: "50%", background: "#fff" }} />
          <div style={{ position: "absolute", top: scale(0.32), right: scale(0.27), width: scale(0.05), height: scale(0.05), borderRadius: "50%", background: "#fff" }} />
        </>
      )}

      <div style={{ position: "absolute", left: scale(0.14), bottom: -scale(0.02), width: scale(0.2), height: scale(0.1), borderRadius: "0 0 999px 999px", background: "#8b6a23", opacity: 0.9 }} />
      <div style={{ position: "absolute", right: scale(0.14), bottom: -scale(0.02), width: scale(0.2), height: scale(0.1), borderRadius: "0 0 999px 999px", background: "#8b6a23", opacity: 0.9 }} />

      {isThinking && (
        <div style={{ position: "absolute", right: -scale(0.08), top: -scale(0.08), display: "flex", gap: scale(0.03) }}>
          {[0, 1, 2].map((dot) => (
            <span key={dot} style={{ width: scale(0.07), height: scale(0.07), borderRadius: "50%", background: dot === 1 ? "#e8c96a" : "rgba(232,201,106,0.45)" }} />
          ))}
        </div>
      )}

      {isRecommend && (
        <div style={{ position: "absolute", right: -scale(0.08), bottom: scale(0.04), width: scale(0.28), height: scale(0.2), borderRadius: scale(0.05), background: "rgba(61,165,99,0.95)", border: "1px solid rgba(255,255,255,0.5)", color: "#fff", fontSize: scale(0.13), fontWeight: 950, display: "flex", alignItems: "center", justifyContent: "center" }}>
          AI
        </div>
      )}

      {isComplete && (
        <div style={{ position: "absolute", right: -scale(0.02), top: -scale(0.02), width: scale(0.22), height: scale(0.22), borderRadius: "50%", background: "#3DA563", color: "#fff", fontSize: scale(0.14), fontWeight: 950, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.7)" }}>
          ✓
        </div>
      )}

      <style>{`
        @keyframes xiaobaiTalk {
          0%, 100% { transform: translateX(-50%) scaleX(0.7) scaleY(0.45); }
          50% { transform: translateX(-50%) scaleX(1.15) scaleY(1.1); }
        }
        @keyframes xiaobaiThink {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes xiaobaiWave {
          0%, 100% { transform: rotate(0deg); }
          45% { transform: rotate(-4deg); }
          65% { transform: rotate(3deg); }
        }
      `}</style>
    </div>
  )
}
