"use client"

import { useState } from "react"
import { brandGradient, brandInitial, brandLogoFromName, domainIcon } from "@/lib/visual-assets"

type ToolLogoProps = {
  name: string
  url: string
  logo?: string
  size?: number
  radius?: number
}

export function ToolLogo({ name, url, logo, size = 36, radius = 10 }: ToolLogoProps) {
  const [failed, setFailed] = useState(false)
  const src = !failed ? (logo || brandLogoFromName(name) || domainIcon(url)) : ""

  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        overflow: "hidden",
        background: src ? "#fff" : brandGradient(name),
        border: "1px solid rgba(255,255,255,0.22)",
        boxShadow: "inset 0 1px 6px rgba(255,255,255,0.35), 0 10px 18px rgba(0,0,0,0.22)",
      }}
    >
      {src ? (
        <img
          src={src}
          alt={`${name} logo`}
          onError={() => setFailed(true)}
          style={{ width: Math.round(size * 0.62), height: Math.round(size * 0.62), objectFit: "contain", display: "block" }}
        />
      ) : (
        <span style={{ color: "#fff", fontSize: Math.max(12, Math.round(size * 0.34)), fontWeight: 950, fontFamily: "'JetBrains Mono', monospace", textShadow: "0 2px 8px rgba(0,0,0,0.32)" }}>
          {brandInitial(name)}
        </span>
      )}
    </span>
  )
}
