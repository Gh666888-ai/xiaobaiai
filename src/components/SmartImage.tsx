"use client"

import type { CSSProperties } from "react"
import { useMemo, useState } from "react"
import { ContentVisual, inferContentVisualKind } from "@/components/ContentVisual"

type SmartImageProps = {
  src?: string
  title: string
  label?: string
  meta?: string
  kind?: "news" | "community" | "learn" | "code" | "data" | "agent" | "creative"
  compact?: boolean
  style?: CSSProperties
  imageStyle?: CSSProperties
}

export function SmartImage({ src, title, label, meta, kind = "news", compact, style, imageStyle }: SmartImageProps) {
  const [failed, setFailed] = useState(false)
  const finalKind = useMemo(() => inferContentVisualKind(`${label || ""} ${title}`, kind), [kind, label, title])

  if (!src || failed) {
    return (
      <div style={style}>
        <ContentVisual compact={compact} title={title} label={label} meta={meta} kind={finalKind} />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
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
