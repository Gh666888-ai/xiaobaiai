import { XiaobaiMascot } from "@/components/XiaobaiMascot"

type XiaobaiLogoProps = {
  compact?: boolean
}

export function XiaobaiLogo({ compact = false }: XiaobaiLogoProps) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: compact ? 7 : 9, color: "#fff" }}>
      <XiaobaiMascot size={compact ? 32 : 38} mood="welcome" />
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
