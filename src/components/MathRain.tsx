// @ts-nocheck
"use client"

import { useRef, useEffect } from "react"

const SYMBOLS = [
  '0','1','2','3','4','5','6','7','8','9',
  'Σ','Δ','Ω','Ψ','δ','α','β','γ','φ','λ',
  'π','∞','±','∂','∫','√','≈','≡','∈','⊕',
  'Θ','Λ','Φ','Ξ','Π','Υ','Ψ','Ω',
  '+','-','×','÷','=','≠','<','>','≤','≥',
  '∑','∏','∫','∮','∴','∵','⊥','∥',
]

export function MathRain() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const c = ref.current; if(!c) return
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return
    const ctx = c.getContext('2d'); if(!ctx) return
    let cols = Math.min(96, Math.floor(window.innerWidth / 18))
    const drops: number[] = []
    let paused = document.hidden

    function resize() {
      c.width = window.innerWidth; c.height = window.innerHeight
      cols = Math.min(96, Math.floor(c.width / 18))
      drops.length = cols
      for(let i=0;i<cols;i++) {
        if(drops[i]===undefined) drops[i]=Math.random()*(c.height/18)
      }
    }
    resize(); window.addEventListener('resize', resize)
    const onVisibility = () => { paused = document.hidden }
    document.addEventListener("visibilitychange", onVisibility)
    const observer = new IntersectionObserver(([entry]) => { paused = document.hidden || !entry.isIntersecting }, { threshold: 0 })
    observer.observe(c)

    function draw() {
      if (paused) return
      ctx.fillStyle = 'rgba(0,0,0,0.05)'; ctx.fillRect(0,0,c.width,c.height)
      for(let i=0;i<drops.length;i++){
        const char = SYMBOLS[Math.floor(Math.random()*SYMBOLS.length)]
        const x = i*18; const y = drops[i]*18; const depth = y/c.height
        const alpha = 0.17 + depth*0.45; const bright = Math.floor(depth*150+74)
        ctx.fillStyle = `rgba(${bright},${bright*0.75},${bright*0.3},${alpha})`
        ctx.font = '13px JetBrains Mono, monospace'; ctx.fillText(char, x, y)
        if(y > c.height && Math.random()>0.975) drops[i] = Math.random() * -30; drops[i]++
      }
    }
    const interval = setInterval(draw, 80); draw()
    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', resize)
      document.removeEventListener("visibilitychange", onVisibility)
      observer.disconnect()
    }
  }, [])

  return <canvas ref={ref} style={{ position:'fixed', inset:0, width:'100%', height:'100%', zIndex:0, pointerEvents:'none' }} />
}
