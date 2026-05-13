import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

const palettes = [
  { bg: "#eff6ff", line: "#2563eb", soft: "#dbeafe", text: "#0f172a", glow: "#93c5fd" },
  { bg: "#f0fdf4", line: "#16a34a", soft: "#dcfce7", text: "#052e16", glow: "#86efac" },
  { bg: "#faf5ff", line: "#7c3aed", soft: "#ede9fe", text: "#2e1065", glow: "#c4b5fd" },
  { bg: "#fff7ed", line: "#ea580c", soft: "#ffedd5", text: "#431407", glow: "#fdba74" },
  { bg: "#ecfeff", line: "#0891b2", soft: "#cffafe", text: "#083344", glow: "#67e8f9" },
]

function hashText(text: string) {
  let hash = 0
  for (let i = 0; i < text.length; i += 1) hash = (hash * 31 + text.charCodeAt(i)) >>> 0
  return hash
}

function escapeXml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function displayWidth(text: string) {
  return Array.from(text).reduce((sum, char) => sum + (/[A-Za-z0-9]/.test(char) ? 0.58 : 1), 0)
}

function wrapText(text: string, max = 18, lines = 3) {
  const clean = text.replace(/\s+/g, " ").trim()
  const result: string[] = []
  let current = ""
  for (const char of Array.from(clean)) {
    const charWidth = /[A-Za-z0-9]/.test(char) ? 0.58 : 1
    if (current && displayWidth(current) + charWidth > max) {
      result.push(current)
      current = char
      if (result.length === lines) break
    } else {
      current += char
    }
  }
  if (current && result.length < lines) result.push(current)
  if (result.length && result.join("").length < clean.length) {
    result[result.length - 1] = `${result[result.length - 1].replace(/[.。…]+$/, "")}…`
  }
  return result
}

export function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const title = searchParams.get("title") || "AI 资讯"
  const category = searchParams.get("category") || "AI News"
  const source = searchParams.get("source") || "小白AI生成封面"
  const palette = palettes[hashText(`${title}-${category}`) % palettes.length]
  const titleLines = wrapText(title, 18, 3)

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675" role="img" aria-label="${escapeXml(title)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${palette.bg}"/>
      <stop offset="58%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="${palette.soft}"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="20" flood-color="#0f172a" flood-opacity="0.14"/>
    </filter>
  </defs>
  <rect width="1200" height="675" fill="url(#bg)"/>
  <g opacity="0.34">
    <path d="M78 532 C230 372 350 552 496 382 S762 248 1126 134" fill="none" stroke="${palette.line}" stroke-width="3"/>
    <path d="M94 178 C248 248 342 118 494 212 S792 362 1098 278" fill="none" stroke="${palette.glow}" stroke-width="2"/>
    ${Array.from({ length: 18 }).map((_, index) => {
      const x = 90 + ((index * 143) % 1040)
      const y = 90 + ((index * 89) % 500)
      return `<circle cx="${x}" cy="${y}" r="${index % 3 === 0 ? 6 : 4}" fill="${index % 2 ? palette.line : palette.glow}"/>`
    }).join("")}
  </g>
  <g filter="url(#shadow)">
    <rect x="92" y="92" width="1016" height="491" rx="34" fill="#ffffff" stroke="${palette.soft}" stroke-width="2"/>
    <rect x="128" y="128" width="944" height="419" rx="26" fill="${palette.bg}" stroke="${palette.soft}" stroke-width="2"/>
  </g>
  <g transform="translate(164 166)">
    <rect x="0" y="0" width="190" height="42" rx="21" fill="#ffffff" stroke="${palette.line}" stroke-width="2"/>
    <text x="24" y="28" font-family="Arial, 'Microsoft YaHei', sans-serif" font-size="18" font-weight="800" fill="${palette.line}">${escapeXml(category)}</text>
    <text x="0" y="98" font-family="Arial, 'Microsoft YaHei', sans-serif" font-size="54" font-weight="900" fill="${palette.text}">
      ${titleLines.map((line, index) => `<tspan x="0" dy="${index === 0 ? 0 : 66}">${escapeXml(line)}</tspan>`).join("")}
    </text>
    <g transform="translate(0 308)">
      <rect x="0" y="0" width="248" height="44" rx="22" fill="#ffffff" stroke="${palette.soft}" stroke-width="2"/>
      <text x="22" y="29" font-family="Arial, 'Microsoft YaHei', sans-serif" font-size="18" font-weight="800" fill="${palette.text}">${escapeXml(source)}</text>
      <text x="280" y="29" font-family="Arial, 'Microsoft YaHei', sans-serif" font-size="18" font-weight="800" fill="${palette.line}">小白AI生成主题封面</text>
    </g>
  </g>
  <g transform="translate(824 182)">
    <rect x="0" y="0" width="210" height="210" rx="38" fill="#ffffff" stroke="${palette.soft}" stroke-width="2"/>
    <path d="M54 130 L92 92 L126 118 L158 76" fill="none" stroke="${palette.line}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="76" cy="72" r="16" fill="${palette.glow}"/>
    <rect x="52" y="156" width="106" height="12" rx="6" fill="${palette.soft}"/>
    <rect x="52" y="178" width="76" height="12" rx="6" fill="${palette.soft}"/>
  </g>
</svg>`

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=604800",
    },
  })
}
