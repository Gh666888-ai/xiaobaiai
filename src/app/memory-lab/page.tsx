// @ts-nocheck
"use client"

import { useRef, useEffect } from "react"

const SYMBOLS = [
  '0','1','2','3','4','5','6','7','8','9',
  'Σ','Δ','Ω','Ψ','δ','α','β','γ','φ','λ',
  'π','∞','±','∂','∫','√','≈','≡','∈','⊕',
  'Θ','Λ','Φ','Ξ','Π','Υ','Ψ','Ω',
  '+','-','×','÷','=','≠','<','>','≤','≥',
  '∑','∏','∫','∮','∴','∵','⊥','∥'
]

const FONT_SIZE = 13

export default function MemoryLabPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let columns = Math.floor(window.innerWidth / FONT_SIZE)
    const drops: number[] = Array(columns).fill(0).map(() => Math.random() * -100)

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      columns = Math.floor(canvas.width / FONT_SIZE)
      if (drops.length < columns) {
        drops.length = columns
        for (let i = 0; i < columns; i++) if (drops[i] === undefined) drops[i] = Math.random() * -100
      }
    }
    resize()
    window.addEventListener('resize', resize)

    function draw() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.06)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < drops.length; i++) {
        const char = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
        const x = i * FONT_SIZE
        const y = drops[i] * FONT_SIZE
        const depth = y / canvas.height
        const alpha = 0.15 + depth * 0.6
        const brightness = Math.floor(depth * 180 + 60)
        ctx.fillStyle = `rgba(${brightness}, ${brightness * 0.75}, ${brightness * 0.3}, ${alpha})`
        ctx.font = `${FONT_SIZE}px JetBrains Mono, monospace`
        ctx.fillText(char, x, y)
        if (y > canvas.height && Math.random() > 0.975) drops[i] = 0
        drops[i]++
      }
    }

    const interval = setInterval(draw, 50)
    draw()
    return () => { clearInterval(interval); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <div style={{ background: '#000', minHeight: '100vh', color: '#f0f0f0', fontFamily: "'Noto Sans SC', sans-serif", overflowX: 'hidden' }}>

      {/* 顶部导航 */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 60px', background: 'linear-gradient(180deg, rgba(0,0,0,0.9) 0%, transparent 100%)' }}>
        <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.2em', color: '#c9a84c', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" }}>Memory Lab</span>
        <div style={{ display: 'flex', gap: 40, listStyle: 'none' }}>
          {['核心能力', '架构愿景', '研究项目', '联系我们'].map(link => (
            <a key={link} href="#" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.45)', textDecoration: 'none', textTransform: 'uppercase', transition: 'color 0.2s' }}>{link}</a>
          ))}
        </div>
        <button style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.15em', color: '#c9a84c', textTransform: 'uppercase', border: '1px solid #7a6230', padding: '8px 20px', background: 'transparent', cursor: 'pointer', transition: 'all 0.3s' }}>立即体验</button>
      </nav>

      {/* 全屏主区 */}
      <section style={{ position: 'relative', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, background: 'radial-gradient(ellipse 80% 100% at 50% 100%, rgba(201,168,76,0.12) 0%, transparent 70%)', zIndex: 1 }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent 0%, #7a6230 20%, #c9a84c 50%, #7a6230 80%, transparent 100%)', opacity: 0.4, zIndex: 1 }} />

        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 40px' }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.5em', color: '#7a6230', textTransform: 'uppercase', marginBottom: 32, opacity: 0, animation: 'fadeUp 0.8s ease forwards 0.3s' }}>Memory Lab · 记忆实验室</p>
          <h1 style={{ fontSize: 'clamp(56px, 10vw, 120px)', fontWeight: 900, lineHeight: 1, letterSpacing: '0.05em', color: '#fff', textShadow: '0 0 80px rgba(201,168,76,0.15), 0 0 160px rgba(201,168,76,0.05)', marginBottom: 32, opacity: 0, animation: 'fadeUp 0.8s ease forwards 0.5s' }}>记忆实验室</h1>
          <div style={{ width: 0, height: 1, background: 'linear-gradient(90deg, transparent, #c9a84c, transparent)', margin: '0 auto 32px', animation: 'expandWidth 1s ease forwards 0.8s' }} />
          <p style={{ fontSize: 'clamp(15px, 2vw, 18px)', fontWeight: 300, lineHeight: 2, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em', maxWidth: 560, margin: '0 auto 16px', opacity: 0, animation: 'fadeUp 0.8s ease forwards 1s' }}>构建人类认知与数字记忆的桥梁</p>
          <p style={{ fontSize: 'clamp(13px, 1.5vw, 15px)', fontWeight: 300, lineHeight: 2, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em', maxWidth: 560, margin: '0 auto 48px', opacity: 0, animation: 'fadeUp 0.8s ease forwards 1.1s' }}>重新定义记忆存储与回忆的边界</p>
          <a href="#capabilities" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '14px 36px', border: '1px solid #7a6230', color: '#e8c96a', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none', background: 'rgba(201,168,76,0.06)', transition: 'all 0.3s', opacity: 0, animation: 'fadeUp 0.8s ease forwards 1.3s' }}>
            探索核心能力 <span style={{ transition: 'transform 0.3s' }}>→</span>
          </a>
        </div>
      </section>

      {/* 核心能力 */}
      <div id="capabilities" style={{ position: 'relative', zIndex: 10, padding: '120px 60px', background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.95) 20%)' }}>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.4em', color: '#7a6230', textTransform: 'uppercase', textAlign: 'center', marginBottom: 80 }}>核心能力</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, maxWidth: 1100, margin: '0 auto' }}>
          {[
            { icon: '◈', name: '全息记忆存储', desc: '将片段化的记忆转化为高维数据向量，在数字空间中实现近乎完整的记忆保存与无损还原。' },
            { icon: '◉', name: '神经模式识别', desc: '基于深度神经网络的时间序列重构，让模糊的记忆碎片自动关联、补全，形成可随时检索的完整档案。' },
            { icon: '◎', name: '时间线重构', desc: '打破线性时间束缚，将记忆以多维度因果网络重新组织，发现被忽略的关联与隐藏规律。' }
          ].map(card => (
            <div key={card.name} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #1a1a1a', padding: '48px 36px', position: 'relative', overflow: 'hidden', transition: 'all 0.4s', cursor: 'default' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(201,168,76,0.04)'; (e.currentTarget as HTMLDivElement).style.borderColor = '#7a6230' }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)'; (e.currentTarget as HTMLDivElement).style.borderColor = '#1a1a1a' }}>
              <span style={{ fontSize: 28, marginBottom: 24, display: 'block', color: '#c9a84c' }}>{card.icon}</span>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 16, letterSpacing: '0.05em' }}>{card.name}</h3>
              <p style={{ fontSize: 13, fontWeight: 300, lineHeight: 1.8, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.02em' }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 底部 */}
      <footer style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 60px', background: 'linear-gradient(0deg, rgba(0,0,0,0.8) 0%, transparent 100%)', borderTop: '1px solid #111' }}>
        <div style={{ display: 'flex', gap: 32, listStyle: 'none' }}>
          {['产品服务', '关于我们', '加入我们', '隐私政策'].map(link => (
            <a key={link} href="#" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', textDecoration: 'none', textTransform: 'uppercase', transition: 'color 0.2s' }}>{link}</a>
          ))}
        </div>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.05em' }}>© 2028 记忆实验室. 保留所有权利.</span>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;700;900&family=JetBrains+Mono:wght@300;400&display=swap');
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes expandWidth { to { width: 120px; } }
        @media (max-width: 768px) {
          nav { padding: 16px 24px !important; }
          nav div:nth-child(2) { display: none !important; }
          #capabilities { padding: 80px 24px !important; }
          #capabilities div:last-child { grid-template-columns: 1fr !important; }
          footer { padding: 12px 24px !important; flex-direction: column; gap: 8px; }
        }
      `}</style>
    </div>
  )
}
