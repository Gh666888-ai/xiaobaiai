"use client"

import { useEffect, useRef, type ReactNode } from "react"
import styles from "./LearningSystem.module.css"

export function RoadmapScrollFrame({ children }: { children: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    const resetToStart = () => {
      wrap.scrollLeft = 0
    }
    resetToStart()
    const timer = window.setTimeout(resetToStart, 100)
    return () => window.clearTimeout(timer)
  }, [])

  function nudge(direction: "left" | "right") {
    const wrap = wrapRef.current
    if (!wrap) return
    wrap.scrollBy({ left: direction === "left" ? -280 : 280, behavior: "smooth" })
  }

  return (
    <div className={styles.verticalMapShell}>
      <div className={styles.verticalMapMobileHint}>
        <span>左右滑动看完整路线图</span>
        <div>
          <button type="button" onClick={() => nudge("left")} aria-label="向左看路线图">‹</button>
          <button type="button" onClick={() => nudge("right")} aria-label="向右看路线图">›</button>
        </div>
      </div>
      <div className={styles.verticalMapWrap} ref={wrapRef}>
        {children}
      </div>
    </div>
  )
}
