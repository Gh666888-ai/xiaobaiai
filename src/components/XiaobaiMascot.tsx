type XiaobaiMascotProps = {
  size?: number
  mood?: "idle" | "thinking" | "happy" | "talking" | "welcome" | "recommend" | "complete" | "sleeping" | "peeking"
}

export function XiaobaiMascot({ size = 44, mood = "idle" }: XiaobaiMascotProps) {
  const isThinking = mood === "thinking"
  const isRecommend = mood === "recommend"
  const isComplete = mood === "complete"
  const isTalking = mood === "talking"
  const isSleeping = mood === "sleeping"
  const isPeeking = mood === "peeking"
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
        filter: isSleeping
          ? "drop-shadow(0 10px 18px rgba(0,0,0,0.36)) saturate(0.82) brightness(0.86)"
          : isThinking
          ? "drop-shadow(0 0 18px rgba(67,210,232,0.5)) drop-shadow(0 14px 22px rgba(0,0,0,0.36))"
          : isRecommend
            ? "drop-shadow(0 0 18px rgba(25,194,216,0.42)) drop-shadow(0 14px 22px rgba(0,0,0,0.34))"
            : "drop-shadow(0 0 14px rgba(25,194,216,0.28)) drop-shadow(0 12px 20px rgba(0,0,0,0.32))",
        animation: isSleeping
          ? "xiaobaiSleep 2.9s ease-in-out infinite"
          : isPeeking
            ? "xiaobaiPeek 2.35s ease-in-out infinite"
            : isTalking
              ? "xiaobaiSpeak 0.55s ease-in-out infinite"
              : isThinking
                ? "xiaobaiThink 1.6s ease-in-out infinite"
                : "xiaobaiBreathe 3s ease-in-out infinite",
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

      {isSleeping && (
        <div style={{ position: "absolute", right: -12, top: -22, width: Math.max(30, size * 0.58), height: Math.max(28, size * 0.54), pointerEvents: "none" }}>
          {["Z", "z", "z"].map((letter, index) => (
            <span
              key={`${letter}-${index}`}
              style={{
                position: "absolute",
                right: index * 8,
                top: index * 6,
                color: index === 0 ? "#e8c96a" : "rgba(232,201,106,0.72)",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: Math.max(9, size * (0.18 - index * 0.02)),
                fontWeight: 950,
                textShadow: "0 0 12px rgba(232,201,106,0.42)",
                animation: `xiaobaiSnore 2.4s ease-in-out ${index * 0.28}s infinite`,
              }}
            >
              {letter}
            </span>
          ))}
        </div>
      )}

      {isPeeking && (
        <div style={{ position: "absolute", left: -9, top: Math.max(6, size * 0.14), width: Math.max(24, size * 0.42), height: Math.max(15, size * 0.25), borderRadius: 999, background: "rgba(5,5,5,0.72)", border: "1px solid rgba(126,231,255,0.42)", boxShadow: "0 0 16px rgba(126,231,255,0.22)", pointerEvents: "none", overflow: "hidden" }}>
          <span style={{ position: "absolute", left: 7, top: "50%", width: 7, height: 7, borderRadius: "50%", background: "#7ee7ff", transform: "translateY(-50%)", boxShadow: "0 0 12px rgba(126,231,255,0.95)", animation: "xiaobaiEyePeek 1.35s ease-in-out infinite" }} />
          <span style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", background: "linear-gradient(90deg, transparent, rgba(126,231,255,0.16), transparent)", animation: "xiaobaiPeekGlint 1.9s ease-in-out infinite" }} />
        </div>
      )}

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

      <style>{`
        .xiaobai-mascot-img {
          animation: xiaobaiFurBreath 3.8s ease-in-out infinite;
          transform-origin: 50% 70%;
        }
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
        @keyframes xiaobaiSleep {
          0%, 100% { transform: translateY(1px) rotate(-6deg) scale(0.98); }
          50% { transform: translateY(3px) rotate(-8deg) scale(0.955); }
        }
        @keyframes xiaobaiSnore {
          0% { transform: translate(0, 4px) scale(0.72); opacity: 0; }
          25% { opacity: 0.92; }
          100% { transform: translate(-10px, -14px) scale(1.08); opacity: 0; }
        }
        @keyframes xiaobaiPeek {
          0%, 100% { transform: translateX(0) rotate(-1deg) scale(1); }
          38% { transform: translateX(-5px) rotate(-5deg) scale(1.015); }
          66% { transform: translateX(4px) rotate(4deg) scale(1); }
        }
        @keyframes xiaobaiEyePeek {
          0%, 100% { transform: translate(0, -50%) scale(1); }
          45% { transform: translate(8px, -50%) scale(0.86); }
          70% { transform: translate(2px, -50%) scale(1.06); }
        }
        @keyframes xiaobaiPeekGlint {
          0% { transform: translateX(-100%); opacity: 0; }
          35% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
        @keyframes xiaobaiFurBreath {
          0%, 100% { transform: translateY(0) scale(1); }
          48% { transform: translateY(-1px) scale(1.018); }
        }
      `}</style>
    </div>
  )
}
