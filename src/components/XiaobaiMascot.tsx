type XiaobaiMascotProps = {
  size?: number
  mood?: "idle" | "thinking" | "happy" | "talking" | "welcome" | "recommend" | "complete" | "sleeping" | "peeking"
}

type Layer = {
  src: string
  x: number
  y: number
  width: number
  height: number
  className: string
  z: number
}

const DESIGN_WIDTH = 1071
const DESIGN_HEIGHT = 1469
const LAYER_BASE = "/xiaobai-clean-layers"

const layers: Layer[] = [
  { src: `${LAYER_BASE}/xiaobai-tail.png`, x: 680, y: 803, width: 265, height: 402, className: "tail", z: 1 },
  { src: `${LAYER_BASE}/xiaobai-leg-left.png`, x: 349, y: 1090, width: 216, height: 186, className: "leg left-leg", z: 2 },
  { src: `${LAYER_BASE}/xiaobai-leg-right.png`, x: 509, y: 1090, width: 216, height: 186, className: "leg right-leg", z: 2 },
  { src: `${LAYER_BASE}/xiaobai-arm-right.png`, x: 659, y: 674, width: 202, height: 377, className: "arm right-arm", z: 3 },
  { src: `${LAYER_BASE}/xiaobai-body.png`, x: 359, y: 653, width: 342, height: 520, className: "body", z: 4 },
  { src: `${LAYER_BASE}/xiaobai-arm-left.png`, x: 216, y: 674, width: 195, height: 377, className: "arm left-arm", z: 5 },
  { src: `${LAYER_BASE}/xiaobai-head.png`, x: 307, y: 222, width: 457, height: 473, className: "head", z: 6 },
]

function layerStyle(layer: Layer) {
  return {
    left: `${(layer.x / DESIGN_WIDTH) * 100}%`,
    top: `${(layer.y / DESIGN_HEIGHT) * 100}%`,
    width: `${(layer.width / DESIGN_WIDTH) * 100}%`,
    height: `${(layer.height / DESIGN_HEIGHT) * 100}%`,
    zIndex: layer.z,
  }
}

export function XiaobaiMascot({ size = 44, mood = "idle" }: XiaobaiMascotProps) {
  const isThinking = mood === "thinking"
  const isRecommend = mood === "recommend"
  const isComplete = mood === "complete"
  const isSleeping = mood === "sleeping"
  const stageHeight = Math.round(size * 1.46)
  const stageWidth = Math.round(stageHeight * (DESIGN_WIDTH / DESIGN_HEIGHT))

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
          ? "drop-shadow(0 10px 18px rgba(0,0,0,0.36)) saturate(0.82) brightness(0.9)"
          : isThinking
            ? "drop-shadow(0 0 18px rgba(67,210,232,0.5)) drop-shadow(0 14px 22px rgba(0,0,0,0.36))"
            : isRecommend
              ? "drop-shadow(0 0 18px rgba(25,194,216,0.42)) drop-shadow(0 14px 22px rgba(0,0,0,0.34))"
              : "drop-shadow(0 0 14px rgba(25,194,216,0.28)) drop-shadow(0 12px 20px rgba(0,0,0,0.32))",
      }}
    >
      <div
        className={`xiaobai-layer-stage mood-${mood}`}
        style={{
          width: stageWidth,
          height: stageHeight,
        }}
      >
        {layers.map((layer) => (
          <img
            key={layer.src}
            className={`xiaobai-layer ${layer.className}`}
            src={layer.src}
            alt=""
            style={layerStyle(layer)}
            draggable={false}
          />
        ))}
      </div>

      {isSleeping && (
        <div className="xiaobai-snore" style={{ width: Math.max(30, size * 0.58), height: Math.max(28, size * 0.54) }}>
          {["Z", "z", "z"].map((letter, index) => (
            <span key={`${letter}-${index}`} style={{ right: index * 8, top: index * 6, fontSize: Math.max(9, size * (0.18 - index * 0.02)), animationDelay: `${index * 0.28}s` }}>
              {letter}
            </span>
          ))}
        </div>
      )}

      {isThinking && (
        <div className="xiaobai-thinking-dots">
          {[0, 1, 2].map((dot) => (
            <span key={dot} />
          ))}
        </div>
      )}

      {isRecommend && (
        <div className="xiaobai-ai-tag" style={{ width: Math.max(18, size * 0.34), height: Math.max(14, size * 0.24), fontSize: Math.max(8, size * 0.12) }}>
          AI
        </div>
      )}

      {isComplete && (
        <div className="xiaobai-complete-tag" style={{ width: Math.max(16, size * 0.28), height: Math.max(16, size * 0.28), fontSize: Math.max(9, size * 0.14) }}>
          ✓
        </div>
      )}

      <style>{`
        .xiaobai-layer-stage {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -55%);
          transform-origin: 50% 72%;
          animation: xiaobaiStageBreathe 3.2s ease-in-out infinite;
          pointer-events: none;
          user-select: none;
        }
        .xiaobai-layer {
          position: absolute;
          object-fit: contain;
          pointer-events: none;
          user-select: none;
          transform-origin: 50% 50%;
          will-change: transform, opacity;
        }
        .xiaobai-layer-stage .head {
          transform-origin: 50% 82%;
          animation: xiaobaiHeadIdle 3.2s ease-in-out infinite;
        }
        .xiaobai-layer-stage .body {
          transform-origin: 50% 38%;
          animation: xiaobaiBodySoft 3.2s ease-in-out infinite;
        }
        .xiaobai-layer-stage .eye {
          transform-origin: 50% 54%;
          animation: xiaobaiBlink 4.2s ease-in-out infinite;
        }
        .xiaobai-layer-stage .mouth {
          transform-origin: 50% 50%;
        }
        .xiaobai-layer-stage .arm {
          transform-origin: 50% 10%;
        }
        .xiaobai-layer-stage .leg {
          transform-origin: 50% 0%;
        }
        .xiaobai-layer-stage.mood-talking .head,
        .xiaobai-layer-stage.mood-welcome .head,
        .xiaobai-layer-stage.mood-happy .head {
          animation: xiaobaiHeadTalk 0.78s ease-in-out infinite;
        }
        .xiaobai-layer-stage.mood-talking .mouth {
          animation: xiaobaiMouthTalk 0.34s ease-in-out infinite;
        }
        .xiaobai-layer-stage.mood-talking .left-arm,
        .xiaobai-layer-stage.mood-happy .left-arm,
        .xiaobai-layer-stage.mood-welcome .left-arm {
          animation: xiaobaiLeftArmWave 1.05s ease-in-out infinite;
        }
        .xiaobai-layer-stage.mood-talking .right-arm,
        .xiaobai-layer-stage.mood-happy .right-arm,
        .xiaobai-layer-stage.mood-welcome .right-arm {
          animation: xiaobaiRightArmWave 1.15s ease-in-out infinite;
        }
        .xiaobai-layer-stage.mood-thinking .head {
          animation: xiaobaiThinkHead 1.45s ease-in-out infinite;
        }
        .xiaobai-layer-stage.mood-thinking .eye {
          animation: xiaobaiLookAround 1.55s ease-in-out infinite;
        }
        .xiaobai-layer-stage.mood-thinking .left-arm {
          animation: xiaobaiThinkLeftArm 1.45s ease-in-out infinite;
        }
        .xiaobai-layer-stage.mood-thinking .right-arm {
          animation: xiaobaiThinkRightArm 1.45s ease-in-out infinite;
        }
        .xiaobai-layer-stage.mood-sleeping {
          animation: xiaobaiSleepStage 3.2s ease-in-out infinite;
        }
        .xiaobai-layer-stage.mood-sleeping .head {
          animation: xiaobaiSleepHead 3.2s ease-in-out infinite;
        }
        .xiaobai-layer-stage.mood-sleeping .eye {
          transform: scaleY(0.08) translateY(8%);
          opacity: 0.48;
          animation: none;
        }
        .xiaobai-layer-stage.mood-sleeping .mouth {
          animation: xiaobaiSleepMouth 2.8s ease-in-out infinite;
        }
        .xiaobai-layer-stage.mood-peeking {
          animation: xiaobaiPeekStage 2.65s ease-in-out infinite;
        }
        .xiaobai-layer-stage.mood-peeking .head {
          animation: xiaobaiPeekHead 2.65s ease-in-out infinite;
        }
        .xiaobai-layer-stage.mood-peeking .eye {
          animation: xiaobaiPeekEyes 1.35s ease-in-out infinite;
        }
        .xiaobai-layer-stage.mood-peeking .left-arm {
          animation: xiaobaiPeekArm 2.65s ease-in-out infinite;
        }
        .xiaobai-layer-stage.mood-complete .head,
        .xiaobai-layer-stage.mood-recommend .head {
          animation: xiaobaiNod 1.6s ease-in-out infinite;
        }
        .xiaobai-layer-stage.mood-complete .left-arm,
        .xiaobai-layer-stage.mood-recommend .left-arm {
          animation: xiaobaiLeftArmWave 1.2s ease-in-out infinite;
        }
        .xiaobai-mascot .xiaobai-snore {
          position: absolute;
          right: -12px;
          top: -22px;
          pointer-events: none;
        }
        .xiaobai-snore span {
          position: absolute;
          color: #e8c96a;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 950;
          text-shadow: 0 0 12px rgba(232,201,106,0.42);
          animation: xiaobaiSnore 2.4s ease-in-out infinite;
        }
        .xiaobai-thinking-dots {
          position: absolute;
          right: -6px;
          top: -10px;
          display: flex;
          gap: 3px;
        }
        .xiaobai-thinking-dots span {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(36,199,219,0.45);
          animation: xiaobaiDotPulse 0.9s ease-in-out infinite;
        }
        .xiaobai-thinking-dots span:nth-child(2) {
          background: #24c7db;
          animation-delay: 0.14s;
        }
        .xiaobai-thinking-dots span:nth-child(3) {
          animation-delay: 0.28s;
        }
        .xiaobai-ai-tag,
        .xiaobai-complete-tag {
          position: absolute;
          right: -8px;
          bottom: -2px;
          border: 1px solid rgba(255,255,255,0.65);
          color: #fff;
          font-weight: 950;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 20px rgba(0,0,0,0.32);
        }
        .xiaobai-ai-tag {
          border-radius: 6px;
          background: rgba(36,199,219,0.94);
        }
        .xiaobai-complete-tag {
          right: -6px;
          top: -6px;
          bottom: auto;
          border-radius: 50%;
          background: #18b878;
        }
        @keyframes xiaobaiStageBreathe {
          0%, 100% { transform: translate(-50%, -55%) translateY(0) scale(1); }
          48% { transform: translate(-50%, -55%) translateY(-2%) scale(1.018); }
        }
        @keyframes xiaobaiBodySoft {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.012, 1.02); }
        }
        @keyframes xiaobaiHeadIdle {
          0%, 100% { transform: translateY(0) rotate(-0.8deg); }
          50% { transform: translateY(-1.6%) rotate(1deg); }
        }
        @keyframes xiaobaiHeadTalk {
          0%, 100% { transform: translateY(0) rotate(-1deg); }
          50% { transform: translateY(-2.2%) rotate(1.4deg); }
        }
        @keyframes xiaobaiMouthTalk {
          0%, 100% { transform: scaleY(0.82) translateY(0); }
          50% { transform: scaleY(1.55) translateY(5%); }
        }
        @keyframes xiaobaiBlink {
          0%, 88%, 100% { transform: scaleY(1); }
          92%, 95% { transform: scaleY(0.08); }
        }
        @keyframes xiaobaiLookAround {
          0%, 100% { transform: translateX(0) scaleY(1); }
          34% { transform: translateX(-4%) scaleY(0.95); }
          68% { transform: translateX(4%) scaleY(1); }
        }
        @keyframes xiaobaiLeftArmWave {
          0%, 100% { transform: rotate(-3deg) translateY(0); }
          50% { transform: rotate(10deg) translateY(-2%); }
        }
        @keyframes xiaobaiRightArmWave {
          0%, 100% { transform: rotate(3deg) translateY(0); }
          50% { transform: rotate(-8deg) translateY(-1.5%); }
        }
        @keyframes xiaobaiThinkHead {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          50% { transform: translateX(-2.5%) rotate(-3deg); }
        }
        @keyframes xiaobaiThinkLeftArm {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(7deg) translateY(-1%); }
        }
        @keyframes xiaobaiThinkRightArm {
          0%, 100% { transform: rotate(2deg); }
          50% { transform: rotate(-7deg) translateY(-1%); }
        }
        @keyframes xiaobaiSleepStage {
          0%, 100% { transform: translate(-50%, -55%) translate(2%, 2%) rotate(-5deg) scale(0.98); }
          50% { transform: translate(-50%, -55%) translate(3%, 4%) rotate(-7deg) scale(0.955); }
        }
        @keyframes xiaobaiSleepHead {
          0%, 100% { transform: translateY(1%) rotate(-2deg); }
          50% { transform: translateY(3%) rotate(-3deg); }
        }
        @keyframes xiaobaiSleepMouth {
          0%, 100% { transform: scale(1); opacity: 0.88; }
          50% { transform: scale(0.92); opacity: 0.7; }
        }
        @keyframes xiaobaiPeekStage {
          0%, 100% { transform: translate(-50%, -55%) translateX(0) rotate(-1deg); }
          34% { transform: translate(-50%, -55%) translateX(-5%) rotate(-4deg); }
          62% { transform: translate(-50%, -55%) translateX(4%) rotate(3deg); }
        }
        @keyframes xiaobaiPeekHead {
          0%, 100% { transform: translateX(0) rotate(-1deg); }
          40% { transform: translateX(-4%) rotate(-5deg); }
          66% { transform: translateX(3%) rotate(4deg); }
        }
        @keyframes xiaobaiPeekEyes {
          0%, 100% { transform: translateX(0) scaleY(1); }
          45% { transform: translateX(8%) scaleY(0.9); }
          70% { transform: translateX(-3%) scaleY(1.05); }
        }
        @keyframes xiaobaiPeekArm {
          0%, 100% { transform: rotate(-3deg); }
          48% { transform: rotate(14deg) translateY(-2%); }
        }
        @keyframes xiaobaiNod {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-2%) rotate(2deg); }
        }
        @keyframes xiaobaiSnore {
          0% { transform: translate(0, 4px) scale(0.72); opacity: 0; }
          25% { opacity: 0.92; }
          100% { transform: translate(-10px, -14px) scale(1.08); opacity: 0; }
        }
        @keyframes xiaobaiDotPulse {
          0%, 100% { transform: translateY(0); opacity: 0.48; }
          50% { transform: translateY(-3px); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
