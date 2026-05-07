"use client"

import type { CSSProperties } from "react"
import { useMemo, useState } from "react"
import { ContentVisual, inferContentVisualKind } from "@/components/ContentVisual"

type SmartImageProps = {
  src?: string
  sources?: string[]
  title: string
  label?: string
  meta?: string
  kind?: "news" | "community" | "learn" | "code" | "data" | "agent" | "creative"
  compact?: boolean
  style?: CSSProperties
  imageStyle?: CSSProperties
}

export function SmartImage({ src, sources = [], title, label, meta, kind = "news", compact, style, imageStyle }: SmartImageProps) {
  const [sourceIndex, setSourceIndex] = useState(0)
  const finalKind = useMemo(() => inferContentVisualKind(`${label || ""} ${title}`, kind), [kind, label, title])
  const candidates = useMemo(() => [src, ...sources].filter(Boolean) as string[], [src, sources])
  const currentSrc = candidates[sourceIndex] || ""

  if (!currentSrc) {
    return (
      <div style={style}>
        <ContentVisual compact={compact} title={title} label={label} meta={meta} kind={finalKind} />
      </div>
    )
  }

  return (
    <img
      src={currentSrc}
      alt=""
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setSourceIndex((index) => index + 1)}
      style={{
        width: "100%",
        height: compact ? 126 : 240,
        objectFit: "cover",
        borderRadius: 8,
        border: "1px solid #1f1f1f",
        display: "block",
        background: "#111",
        ...style,
        ...imageStyle,
      }}
    />
  )
}
