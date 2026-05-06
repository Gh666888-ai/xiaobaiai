import { Bot, Sparkles } from "lucide-react"

type XiaobaiMascotProps = {
  size?: number
  mood?: "idle" | "thinking" | "happy"
}

export function XiaobaiMascot({ size = 44, mood = "idle" }: XiaobaiMascotProps) {
  const eye = mood === "happy" ? "⌒" : "•"
  const glow = mood === "thinking" ? "0 0 24px rgba(232,201,106,0.55)" : "0 0 18px rgba(201,168,76,0.32)"

  return (
    <div
      aria-label="小白AI助手"
      title="小白AI助手"
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.3),
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(232,201,106,0.82))",
        border: "1px solid rgba(232,201,106,0.9)",
        boxShadow: glow,
        color: "#111",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -Math.max(5, Math.round(size * 0.12)),
          left: "50%",
          width: 2,
          height: Math.round(size * 0.22),
          background: "#e8c96a",
          transform: "translateX(-50%)",
          borderRadius: 999,
        }}
      />
      <Sparkles
        size={Math.round(size * 0.22)}
        style={{
          position: "absolute",
          top: -Math.round(size * 0.24),
          left: "50%",
          transform: "translateX(-50%)",
          color: "#e8c96a",
        }}
      />
      <Bot size={Math.round(size * 0.4)} style={{ opacity: 0.12, position: "absolute" }} />
      <div style={{ display: "flex", gap: Math.round(size * 0.12), alignItems: "center", fontSize: Math.round(size * 0.22), fontWeight: 900, marginTop: -Math.round(size * 0.04) }}>
        <span>{eye}</span>
        <span>{eye}</span>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: Math.round(size * 0.24),
          width: Math.round(size * 0.18),
          height: 2,
          borderRadius: 999,
          background: "#111",
          opacity: 0.5,
        }}
      />
    </div>
  )
}
