"use client"

import { useState } from "react"
import { brandGradient, brandInitial, toolLogoSources } from "@/lib/visual-assets"

type ToolLogoProps = {
  name: string
  url: string
  logo?: string
  size?: number
  radius?: number
}

export function ToolLogo({ name, url, logo, size = 36, radius = 10 }: ToolLogoProps) {
  const [sourceIndex, setSourceIndex] = useState(0)
  const sources = toolLogoSources(name, url, logo)
  const src = sources[sourceIndex] || ""

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
        background: src ? "linear-gradient(145deg,#ffffff,#eef3f8)" : brandGradient(name),
        border: "1px solid rgba(255,255,255,0.22)",
        boxShadow: "inset 0 1px 6px rgba(255,255,255,0.35), 0 10px 18px rgba(0,0,0,0.22)",
      }}
    >
      {src ? (
        <img
          src={src}
          alt={`${name} logo`}
          referrerPolicy="no-referrer"
          onError={() => setSourceIndex((index) => index + 1)}
          style={{ width: Math.round(size * 0.56), height: Math.round(size * 0.56), objectFit: "contain", display: "block" }}
        />
      ) : (
        <span style={{ color: "#fff", fontSize: Math.max(12, Math.round(size * 0.34)), fontWeight: 950, fontFamily: "'JetBrains Mono', monospace", textShadow: "0 2px 8px rgba(0,0,0,0.32)" }}>
          {brandInitial(name)}
        </span>
      )}
    </span>
  )
}
