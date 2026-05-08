type XiaobaiMascotProps = {
  size?: number
  mood?: "idle" | "thinking" | "happy" | "talking" | "welcome" | "recommend" | "complete" | "sleeping" | "peeking"
}

export function XiaobaiMascot({ size = 44, mood = "idle" }: XiaobaiMascotProps) {
  const isThinking = mood === "thinking"
  const isRecommend = mood === "recommend"
  const isComplete = mood === "complete"
  const isSleeping = mood === "sleeping"

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
          ? "drop-shadow(0 10px 18px rgba(0,0,0,0.36)) saturate(0.82) brightness(0.88)"
          : isThinking
            ? "drop-shadow(0 0 18px rgba(67,210,232,0.5)) drop-shadow(0 14px 22px rgba(0,0,0,0.36))"
            : isRecommend
              ? "drop-shadow(0 0 18px rgba(25,194,216,0.42)) drop-shadow(0 14px 22px rgba(0,0,0,0.34))"
              : "drop-shadow(0 0 14px rgba(25,194,216,0.28)) drop-shadow(0 12px 20px rgba(0,0,0,0.32))",
      }}
    >
      <svg className="xb-svg" viewBox="0 0 120 120" role="img" aria-hidden="true">
        <defs>
          <radialGradient id="xbFur" cx="45%" cy="25%" r="76%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="58%" stopColor="#effcff" />
            <stop offset="100%" stopColor="#bdeaf4" />
          </radialGradient>
          <linearGradient id="xbCyan" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#8df2ff" />
            <stop offset="100%" stopColor="#24c7db" />
          </linearGradient>
          <linearGradient id="xbGold" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#f4df92" />
            <stop offset="100%" stopColor="#c9a84c" />
          </linearGradient>
        </defs>

        <ellipse className="xb-ground" cx="60" cy="104" rx="31" ry="7" fill="rgba(126,231,255,0.18)" />

        <g className="xb-tail">
          <path d="M86 75c15 0 18 16 8 22-6 4-15 1-16-6 7 3 13 0 12-5-1-5-7-7-12-5z" fill="#d9f8ff" stroke="#7ee7ff" strokeWidth="2" strokeLinecap="round" />
        </g>

        <g className="xb-legs">
          <path className="xb-leg xb-leg-left" d="M45 89c-7 9-6 15 3 16h10c4-1 5-5 2-8l-6-9z" fill="#eefcff" stroke="#7edfee" strokeWidth="2" />
          <path className="xb-leg xb-leg-right" d="M66 89c7 9 6 15-3 16H53c-4-1-5-5-2-8l6-9z" fill="#eefcff" stroke="#7edfee" strokeWidth="2" />
        </g>

        <g className="xb-body">
          <path d="M33 54c-8 11-9 34 7 43 11 7 30 7 41 0 16-9 15-32 7-43-8-11-47-11-55 0z" fill="url(#xbFur)" stroke="#92e8f5" strokeWidth="2" />
          <path d="M50 75l12 8-12 8" fill="none" stroke="url(#xbCyan)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="46" cy="58" r="3" fill="#e8c96a" />
          <circle cx="74" cy="58" r="3" fill="#e8c96a" />
        </g>

        <g className="xb-arms">
          <path className="xb-arm xb-arm-left" d="M35 65c-12 2-18 11-15 19 2 5 8 5 11 0 2-4 5-8 10-10z" fill="#eefcff" stroke="#7edfee" strokeWidth="2" strokeLinecap="round" />
          <path className="xb-arm xb-arm-right" d="M85 65c12 2 18 11 15 19-2 5-8 5-11 0-2-4-5-8-10-10z" fill="#eefcff" stroke="#7edfee" strokeWidth="2" strokeLinecap="round" />
        </g>

        <g className="xb-head">
          <path className="xb-ear xb-ear-left" d="M31 36 24 15c-1-4 3-7 6-4l18 14z" fill="#effcff" stroke="#92e8f5" strokeWidth="2" strokeLinejoin="round" />
          <path className="xb-ear xb-ear-right" d="M89 36 96 15c1-4-3-7-6-4L72 25z" fill="#effcff" stroke="#92e8f5" strokeWidth="2" strokeLinejoin="round" />
          <path className="xb-ear-inner-left" d="M32 29 29 18l10 8z" fill="#ffd5dd" opacity="0.78" />
          <path className="xb-ear-inner-right" d="M88 29 91 18l-10 8z" fill="#ffd5dd" opacity="0.78" />

          <path d="M27 39c0-18 15-28 33-28s33 10 33 28c0 20-13 34-33 34S27 59 27 39z" fill="url(#xbFur)" stroke="#92e8f5" strokeWidth="2" />

          <g className="xb-brows">
            <path className="xb-brow xb-brow-left" d="M39 35c5-3 10-3 14 0" fill="none" stroke="#1b7f94" strokeWidth="3" strokeLinecap="round" />
            <path className="xb-brow xb-brow-right" d="M67 35c5-3 10-3 14 0" fill="none" stroke="#1b7f94" strokeWidth="3" strokeLinecap="round" />
          </g>

          <g className="xb-eyes">
            <g className="xb-eye xb-eye-left">
              <ellipse cx="46" cy="43" rx="7" ry="8" fill="#113846" />
              <circle className="xb-pupil" cx="48" cy="41" r="3" fill="#7ee7ff" />
              <circle cx="50" cy="38" r="1.6" fill="#fff" />
            </g>
            <g className="xb-eye xb-eye-right">
              <ellipse cx="74" cy="43" rx="7" ry="8" fill="#113846" />
              <circle className="xb-pupil" cx="76" cy="41" r="3" fill="#7ee7ff" />
              <circle cx="78" cy="38" r="1.6" fill="#fff" />
            </g>
          </g>

          <path className="xb-nose" d="M58 52c1.3-2 2.7-2 4 0-1 2-3 2-4 0z" fill="#2dbfd3" />
          <path className="xb-mouth" d="M54 58c4 5 8 5 12 0" fill="none" stroke="#246676" strokeWidth="3" strokeLinecap="round" />

          <g className="xb-whiskers" stroke="#9feef8" strokeWidth="2" strokeLinecap="round" opacity="0.75">
            <path d="M36 53H22" />
            <path d="M36 59l-12 4" />
            <path d="M84 53h14" />
            <path d="M84 59l12 4" />
          </g>
        </g>

        <g className="xb-sparkles" fill="url(#xbGold)">
          <circle cx="30" cy="102" r="3" />
          <circle cx="45" cy="108" r="3" />
          <circle cx="60" cy="109" r="3" />
          <circle cx="75" cy="108" r="3" />
          <circle cx="90" cy="102" r="3" />
        </g>
      </svg>

      {isSleeping && (
        <div className="xb-snore" aria-hidden="true">
          {["Z", "z", "z"].map((letter, index) => (
            <span key={`${letter}-${index}`} style={{ animationDelay: `${index * 0.28}s` }}>
              {letter}
            </span>
          ))}
        </div>
      )}

      {isRecommend && (
        <div className="xb-ai-badge" aria-hidden="true">
          AI
        </div>
      )}

      {isComplete && (
        <div className="xb-complete-badge" aria-hidden="true">
          ✓
        </div>
      )}

      <style>{`
        .xiaobai-mascot {
          --xb-talk-speed: 0.46s;
        }
        .xb-svg {
          width: 146%;
          height: 146%;
          display: block;
          overflow: visible;
        }
        .xb-head {
          transform-origin: 60px 58px;
          animation: xbHeadLook 4.8s ease-in-out infinite;
        }
        .xb-body {
          transform-origin: 60px 85px;
          animation: xbBodyBreath 2.9s ease-in-out infinite;
        }
        .xb-tail {
          transform-origin: 82px 84px;
          animation: xbTailSway 2.6s ease-in-out infinite;
        }
        .xb-ear-left {
          transform-origin: 37px 35px;
          animation: xbEarLeft 4.4s ease-in-out infinite;
        }
        .xb-ear-right {
          transform-origin: 83px 35px;
          animation: xbEarRight 4.8s ease-in-out infinite;
        }
        .xb-eye {
          transform-origin: center;
          animation: xbBlink 5.2s ease-in-out infinite;
        }
        .xb-eye-right {
          animation-delay: 0.08s;
        }
        .xb-pupil {
          animation: xbPupilLook 3.8s ease-in-out infinite;
        }
        .xb-arm {
          transform-origin: 60px 66px;
        }
        .xb-arm-left {
          animation: xbArmIdleLeft 3.4s ease-in-out infinite;
        }
        .xb-arm-right {
          animation: xbArmIdleRight 3.2s ease-in-out infinite;
        }
        .xb-leg {
          transform-origin: 60px 93px;
          animation: xbFootTap 3.8s ease-in-out infinite;
        }
        .xb-leg-right {
          animation-delay: 0.3s;
        }
        .xb-sparkles circle {
          animation: xbSparklePop 2.4s ease-in-out infinite;
        }
        .xb-sparkles circle:nth-child(2) { animation-delay: 0.15s; }
        .xb-sparkles circle:nth-child(3) { animation-delay: 0.3s; }
        .xb-sparkles circle:nth-child(4) { animation-delay: 0.45s; }
        .xb-sparkles circle:nth-child(5) { animation-delay: 0.6s; }

        .xiaobai-mascot-talking .xb-mouth {
          animation: xbTalkMouth var(--xb-talk-speed) ease-in-out infinite;
        }
        .xiaobai-mascot-talking .xb-arm-left {
          animation: xbTalkArmLeft 0.62s ease-in-out infinite;
        }
        .xiaobai-mascot-talking .xb-arm-right {
          animation: xbTalkArmRight 0.62s ease-in-out infinite;
        }
        .xiaobai-mascot-talking .xb-head {
          animation: xbTalkHead 0.7s ease-in-out infinite;
        }

        .xiaobai-mascot-thinking .xb-brow-left,
        .xiaobai-mascot-thinking .xb-brow-right {
          animation: xbThinkBrows 1.2s ease-in-out infinite;
        }
        .xiaobai-mascot-thinking .xb-pupil {
          animation: xbThinkEyes 1.35s ease-in-out infinite;
        }
        .xiaobai-mascot-thinking .xb-arm-right {
          animation: xbThinkHand 1.4s ease-in-out infinite;
        }

        .xiaobai-mascot-sleeping .xb-head {
          animation: xbSleepHead 2.8s ease-in-out infinite;
        }
        .xiaobai-mascot-sleeping .xb-eye {
          transform: scaleY(0.12);
          animation: none;
        }
        .xiaobai-mascot-sleeping .xb-mouth {
          d: path("M55 59c4 2 7 2 10 0");
        }
        .xiaobai-mascot-sleeping .xb-arm-left,
        .xiaobai-mascot-sleeping .xb-arm-right {
          animation: xbSleepArms 2.8s ease-in-out infinite;
        }

        .xiaobai-mascot-peeking .xb-head {
          animation: xbPeekHead 1.9s ease-in-out infinite;
        }
        .xiaobai-mascot-peeking .xb-pupil {
          animation: xbPeekEyes 1.9s ease-in-out infinite;
        }
        .xiaobai-mascot-happy .xb-arm-right,
        .xiaobai-mascot-welcome .xb-arm-right,
        .xiaobai-mascot-recommend .xb-arm-right {
          animation: xbWaveRight 1.25s ease-in-out infinite;
        }
        .xiaobai-mascot-complete .xb-arm-left,
        .xiaobai-mascot-complete .xb-arm-right {
          animation: xbCheerArm 0.74s ease-in-out infinite;
        }

        .xiaobai-launcher.is-walking .xb-body {
          animation: xbWalkBody 0.45s ease-in-out infinite;
        }
        .xiaobai-launcher.is-walking .xb-head {
          animation: xbWalkHead 0.45s ease-in-out infinite;
        }
        .xiaobai-launcher.is-walking .xb-leg-left {
          animation: xbWalkLegLeft 0.45s ease-in-out infinite;
        }
        .xiaobai-launcher.is-walking .xb-leg-right {
          animation: xbWalkLegRight 0.45s ease-in-out infinite;
        }
        .xiaobai-launcher.is-walking .xb-arm-left {
          animation: xbWalkArmLeft 0.45s ease-in-out infinite;
        }
        .xiaobai-launcher.is-walking .xb-arm-right {
          animation: xbWalkArmRight 0.45s ease-in-out infinite;
        }

        .xiaobai-launcher.is-burrowing .xb-brow-left {
          animation: xbSeriousBrowLeft 0.32s ease-in-out infinite;
        }
        .xiaobai-launcher.is-burrowing .xb-brow-right {
          animation: xbSeriousBrowRight 0.32s ease-in-out infinite;
        }
        .xiaobai-launcher.is-burrowing .xb-eye {
          animation: xbSeriousEyes 0.42s ease-in-out infinite;
        }
        .xiaobai-launcher.is-burrowing .xb-arm-left {
          animation: xbSealArmLeft 0.16s steps(2, end) infinite;
        }
        .xiaobai-launcher.is-burrowing .xb-arm-right {
          animation: xbSealArmRight 0.16s steps(2, end) infinite;
        }
        .xiaobai-launcher.is-burrowing .xb-body {
          animation: xbSealBody 0.32s ease-in-out infinite;
        }

        .xb-snore {
          position: absolute;
          right: -12px;
          top: -22px;
          width: max(30px, 58%);
          height: max(28px, 54%);
          pointer-events: none;
        }
        .xb-snore span {
          position: absolute;
          right: 0;
          top: 0;
          color: #e8c96a;
          font-family: 'JetBrains Mono', monospace;
          font-size: max(9px, 18%);
          font-weight: 950;
          text-shadow: 0 0 12px rgba(232,201,106,0.42);
          animation: xbSnore 2.4s ease-in-out infinite;
        }
        .xb-snore span:nth-child(2) { right: 8px; top: 6px; opacity: 0.78; }
        .xb-snore span:nth-child(3) { right: 16px; top: 12px; opacity: 0.62; }
        .xb-ai-badge,
        .xb-complete-badge {
          position: absolute;
          right: -8px;
          bottom: -2px;
          min-width: max(18px, 34%);
          height: max(16px, 28%);
          border-radius: 8px;
          background: rgba(36,199,219,0.94);
          border: 1px solid rgba(255,255,255,0.65);
          color: #fff;
          font-size: max(8px, 12%);
          font-weight: 950;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 20px rgba(0,0,0,0.32);
        }
        .xb-complete-badge {
          top: -6px;
          bottom: auto;
          width: max(16px, 28%);
          border-radius: 50%;
          background: #18b878;
        }

        @keyframes xbBodyBreath {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-1.8px) scale(1.025); }
        }
        @keyframes xbHeadLook {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          24% { transform: translate(-1.5px, -1px) rotate(-2deg); }
          52% { transform: translate(1.6px, 0) rotate(2deg); }
          76% { transform: translate(0, -1.4px) rotate(-1deg); }
        }
        @keyframes xbTailSway {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(13deg); }
        }
        @keyframes xbEarLeft {
          0%, 72%, 100% { transform: rotate(0deg); }
          76% { transform: rotate(-8deg); }
          82% { transform: rotate(5deg); }
        }
        @keyframes xbEarRight {
          0%, 70%, 100% { transform: rotate(0deg); }
          75% { transform: rotate(8deg); }
          82% { transform: rotate(-4deg); }
        }
        @keyframes xbBlink {
          0%, 88%, 100% { transform: scaleY(1); }
          91%, 93% { transform: scaleY(0.1); }
        }
        @keyframes xbPupilLook {
          0%, 100% { transform: translate(0,0); }
          28% { transform: translate(-2px,-1px); }
          55% { transform: translate(2px,1px); }
          78% { transform: translate(0,-1.5px); }
        }
        @keyframes xbArmIdleLeft {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(4deg); }
        }
        @keyframes xbArmIdleRight {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-5deg); }
        }
        @keyframes xbFootTap {
          0%, 74%, 100% { transform: translateY(0); }
          82% { transform: translateY(-2px); }
        }
        @keyframes xbSparklePop {
          0%, 100% { transform: translateY(0) scale(0.82); opacity: 0.6; }
          50% { transform: translateY(-3px) scale(1.1); opacity: 1; }
        }
        @keyframes xbTalkMouth {
          0%, 100% { d: path("M54 58c4 5 8 5 12 0"); }
          50% { d: path("M55 57c3 7 7 7 10 0"); }
        }
        @keyframes xbTalkArmLeft {
          0%, 100% { transform: rotate(7deg) translateY(0); }
          50% { transform: rotate(-10deg) translateY(-2px); }
        }
        @keyframes xbTalkArmRight {
          0%, 100% { transform: rotate(-7deg) translateY(0); }
          50% { transform: rotate(12deg) translateY(-2px); }
        }
        @keyframes xbTalkHead {
          0%, 100% { transform: translateY(0) rotate(-1deg); }
          50% { transform: translateY(-1.8px) rotate(1deg); }
        }
        @keyframes xbThinkBrows {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-2px) rotate(-6deg); }
        }
        @keyframes xbThinkEyes {
          0%, 100% { transform: translate(-2px,-1px); }
          50% { transform: translate(2px,1px); }
        }
        @keyframes xbThinkHand {
          0%, 100% { transform: rotate(-8deg) translate(0,0); }
          50% { transform: rotate(-20deg) translate(-2px,-5px); }
        }
        @keyframes xbSleepHead {
          0%, 100% { transform: translate(2px, 2px) rotate(-5deg); }
          50% { transform: translate(3px, 4px) rotate(-8deg); }
        }
        @keyframes xbSleepArms {
          0%, 100% { transform: rotate(9deg) translateY(2px); }
          50% { transform: rotate(13deg) translateY(4px); }
        }
        @keyframes xbPeekHead {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          35% { transform: translateX(-5px) rotate(-5deg); }
          68% { transform: translateX(5px) rotate(4deg); }
        }
        @keyframes xbPeekEyes {
          0%, 100% { transform: translate(-3px,0); }
          50% { transform: translate(4px,0); }
        }
        @keyframes xbWaveRight {
          0%, 100% { transform: rotate(-12deg) translateY(0); }
          50% { transform: rotate(-32deg) translate(-4px,-8px); }
        }
        @keyframes xbCheerArm {
          0%, 100% { transform: translateY(-4px) rotate(-18deg); }
          50% { transform: translateY(-10px) rotate(18deg); }
        }
        @keyframes xbWalkBody {
          0%, 100% { transform: translateY(1px) scaleX(1); }
          50% { transform: translateY(-4px) scaleX(1.03); }
        }
        @keyframes xbWalkHead {
          0%, 100% { transform: translate(-2px,0) rotate(-4deg); }
          50% { transform: translate(2px,-2px) rotate(4deg); }
        }
        @keyframes xbWalkLegLeft {
          0%, 100% { transform: translate(4px,0) rotate(9deg); }
          50% { transform: translate(-5px,-3px) rotate(-12deg); }
        }
        @keyframes xbWalkLegRight {
          0%, 100% { transform: translate(-5px,-3px) rotate(-12deg); }
          50% { transform: translate(4px,0) rotate(9deg); }
        }
        @keyframes xbWalkArmLeft {
          0%, 100% { transform: rotate(-12deg) translateY(-2px); }
          50% { transform: rotate(15deg) translateY(2px); }
        }
        @keyframes xbWalkArmRight {
          0%, 100% { transform: rotate(15deg) translateY(2px); }
          50% { transform: rotate(-12deg) translateY(-2px); }
        }
        @keyframes xbSeriousBrowLeft {
          0%, 100% { transform: rotate(12deg) translateY(1px); }
          50% { transform: rotate(18deg) translateY(2px); }
        }
        @keyframes xbSeriousBrowRight {
          0%, 100% { transform: rotate(-12deg) translateY(1px); }
          50% { transform: rotate(-18deg) translateY(2px); }
        }
        @keyframes xbSeriousEyes {
          0%, 100% { transform: scaleY(0.78); }
          50% { transform: scaleY(0.55); }
        }
        @keyframes xbSealArmLeft {
          0% { transform: rotate(28deg) translate(12px,-8px); }
          50% { transform: rotate(-26deg) translate(22px,0); }
          100% { transform: rotate(34deg) translate(10px,7px); }
        }
        @keyframes xbSealArmRight {
          0% { transform: rotate(-28deg) translate(-12px,-8px); }
          50% { transform: rotate(26deg) translate(-22px,0); }
          100% { transform: rotate(-34deg) translate(-10px,7px); }
        }
        @keyframes xbSealBody {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(3px) scale(0.96); }
        }
        @keyframes xbSnore {
          0% { transform: translate(0, 4px) scale(0.72); opacity: 0; }
          25% { opacity: 0.92; }
          100% { transform: translate(-10px, -14px) scale(1.08); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
