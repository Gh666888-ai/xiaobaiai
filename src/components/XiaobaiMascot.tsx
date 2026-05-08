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

      <span className="xiaobai-ear left" />
      <span className="xiaobai-ear right" />
      <span className="xiaobai-face-layer" aria-hidden="true">
        <span className="xiaobai-brow left" />
        <span className="xiaobai-brow right" />
        <span className="xiaobai-eye left"><i /></span>
        <span className="xiaobai-eye right"><i /></span>
        <span className="xiaobai-mouth" />
      </span>

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
        .xiaobai-face-layer {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 58%;
          height: 44%;
          transform: translate(-50%, -48%);
          pointer-events: none;
          animation: xiaobaiFaceLook 5.4s ease-in-out infinite;
        }
        .xiaobai-eye {
          position: absolute;
          top: 36%;
          width: 14%;
          height: 16%;
          border-radius: 999px;
          background: rgba(5, 35, 48, 0.72);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.22), 0 0 10px rgba(126,231,255,0.22);
          overflow: hidden;
          animation: xiaobaiBlinkEyes 4.8s ease-in-out infinite;
        }
        .xiaobai-brow {
          position: absolute;
          top: 29%;
          width: 18%;
          height: 3px;
          border-radius: 999px;
          background: rgba(5,35,48,0.52);
          opacity: 0.32;
          transform-origin: 50% 50%;
        }
        .xiaobai-brow.left {
          left: 20%;
          transform: rotate(-8deg);
        }
        .xiaobai-brow.right {
          right: 20%;
          transform: rotate(8deg);
        }
        .xiaobai-eye.left {
          left: 24%;
        }
        .xiaobai-eye.right {
          right: 24%;
          animation-delay: 0.06s;
        }
        .xiaobai-eye i {
          position: absolute;
          left: 44%;
          top: 38%;
          width: 38%;
          height: 42%;
          border-radius: 50%;
          background: #7ee7ff;
          box-shadow: 0 0 8px rgba(126,231,255,0.95);
          animation: xiaobaiPupilPatrol 3.9s ease-in-out infinite;
        }
        .xiaobai-eye i::after {
          content: "";
          position: absolute;
          right: 16%;
          top: 12%;
          width: 38%;
          height: 38%;
          border-radius: 50%;
          background: rgba(255,255,255,0.9);
        }
        .xiaobai-mouth {
          position: absolute;
          left: 50%;
          top: 61%;
          width: 16%;
          height: 7%;
          border-radius: 0 0 999px 999px;
          border-bottom: 2px solid rgba(5,35,48,0.72);
          transform: translateX(-50%);
          opacity: 0.78;
        }
        .xiaobai-ear {
          position: absolute;
          top: 11%;
          width: 10%;
          height: 14%;
          border-radius: 70% 70% 50% 50%;
          background: rgba(126,231,255,0.12);
          border: 1px solid rgba(126,231,255,0.22);
          pointer-events: none;
          opacity: 0.55;
          transform-origin: 50% 90%;
          animation: xiaobaiEarTwitch 6s ease-in-out infinite;
        }
        .xiaobai-ear.left {
          left: 26%;
          transform: rotate(-18deg);
        }
        .xiaobai-ear.right {
          right: 26%;
          transform: rotate(18deg);
          animation-delay: 0.18s;
        }
        .xiaobai-mascot-talking .xiaobai-face-layer {
          animation: xiaobaiTalkFace 0.55s ease-in-out infinite;
        }
        .xiaobai-mascot-talking .xiaobai-mouth {
          height: 13%;
          width: 13%;
          border: 0;
          border-radius: 999px;
          background: rgba(5,35,48,0.72);
          animation: xiaobaiTalkMouth 0.28s ease-in-out infinite;
        }
        .xiaobai-mascot-thinking .xiaobai-eye i {
          animation: xiaobaiPupilThink 1.45s ease-in-out infinite;
        }
        .xiaobai-mascot-thinking .xiaobai-brow {
          opacity: 0.76;
        }
        .xiaobai-mascot-sleeping .xiaobai-eye {
          height: 2px;
          top: 43%;
          background: rgba(5,35,48,0.64);
          animation: none;
        }
        .xiaobai-mascot-sleeping .xiaobai-eye i,
        .xiaobai-mascot-sleeping .xiaobai-mouth {
          opacity: 0;
        }
        .xiaobai-mascot-peeking .xiaobai-eye i {
          animation: xiaobaiPupilPeekAround 1.8s ease-in-out infinite;
        }
        .xiaobai-mascot-happy .xiaobai-mouth,
        .xiaobai-mascot-complete .xiaobai-mouth {
          width: 20%;
          height: 10%;
          border-radius: 0 0 999px 999px;
          border-bottom-width: 3px;
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
        @keyframes xiaobaiFaceLook {
          0%, 100% { transform: translate(-50%, -48%) rotate(0deg); }
          28% { transform: translate(-52%, -49%) rotate(-1.4deg); }
          54% { transform: translate(-48%, -47%) rotate(1.2deg); }
          76% { transform: translate(-50%, -50%) rotate(-0.8deg); }
        }
        @keyframes xiaobaiBlinkEyes {
          0%, 88%, 100% { transform: scaleY(1); }
          91%, 93% { transform: scaleY(0.12); }
          95% { transform: scaleY(1); }
        }
        @keyframes xiaobaiPupilPatrol {
          0%, 100% { transform: translate(0, 0); }
          24% { transform: translate(-36%, -8%); }
          48% { transform: translate(22%, 10%); }
          68% { transform: translate(34%, -12%); }
          82% { transform: translate(-12%, 8%); }
        }
        @keyframes xiaobaiPupilThink {
          0%, 100% { transform: translate(-30%, -8%) scale(0.94); }
          50% { transform: translate(34%, 8%) scale(1.05); }
        }
        @keyframes xiaobaiPupilPeekAround {
          0%, 100% { transform: translate(-42%, -4%) scale(0.95); }
          45% { transform: translate(42%, 4%) scale(1.04); }
          72% { transform: translate(10%, -12%) scale(1); }
        }
        @keyframes xiaobaiTalkFace {
          0%, 100% { transform: translate(-50%, -48%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.035); }
        }
        @keyframes xiaobaiTalkMouth {
          0%, 100% { transform: translateX(-50%) scaleY(0.55); }
          50% { transform: translateX(-50%) scaleY(1.18); }
        }
        @keyframes xiaobaiEarTwitch {
          0%, 74%, 100% { translate: 0 0; }
          78% { translate: 0 -2px; }
          82% { translate: 0 0; }
          86% { translate: 0 -1px; }
        }
      `}</style>
    </div>
  )
}
