"use client"

import { useRef, useEffect } from "react"

const SYMBOLS = [
  '0','1','2','3','4','5','6','7','8','9',
  'Σ','Δ','Ω','Ψ','δ','α','β','γ','φ','λ',
  'π','∞','±','∂','∫','√','≈','≡','∈','⊕',
  'Θ','Λ','Φ','Ξ','Π','Υ','Ψ','Ω',
]

export function MathRain() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const c = ref.current; if(!c) return
    const ctx = c.getContext('2d'); if(!ctx) return
    let cols = Math.floor(window.innerWidth / 13)
    const drops: number[] = Array(cols).fill(0).map(() => Math.random() * -100)

    function resize() {
      c.width = window.innerWidth; c.height = window.innerHeight
      cols = Math.floor(c.width / 13)
      if(drops.length < cols){ drops.length = cols; for(let i=0;i<cols;i++)if(drops[i]===undefined)drops[i]=Math.random()*-100 }
    }
    resize(); window.addEventListener('resize', resize)

    function draw() {
      ctx.fillStyle = 'rgba(0,0,0,0.06)'; ctx.fillRect(0,0,c.width,c.height)
      for(let i=0;i<drops.length;i++){
        const char = SYMBOLS[Math.floor(Math.random()*SYMBOLS.length)]
        const x = i*13; const y = drops[i]*13; const depth = y/c.height
        const alpha = 0.12 + depth*0.5; const bright = Math.floor(depth*160+60)
        ctx.fillStyle = `rgba(${bright},${bright*0.75},${bright*0.3},${alpha})`
        ctx.font = '13px JetBrains Mono, monospace'; ctx.fillText(char, x, y)
        if(y > c.height && Math.random()>0.975) drops[i] = 0; drops[i]++
      }
    }
    const interval = setInterval(draw, 50); draw()
    return () => { clearInterval(interval); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={ref} style={{ position:'fixed', inset:0, width:'100%', height:'100%', zIndex:0, pointerEvents:'none' }} />
}
