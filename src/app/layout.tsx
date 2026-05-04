import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "小白AI — 从零到Agent · AI工具导航",
  description: "AI工具导航、从零到Agent的学习路径、AI最新资讯。Agent自动维护 + 社区用户共建。",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <meta name="baidu-site-verification" content="codeva-RTXCqCLk3P" />
        <meta name="baidu-site-verification" content="codeva-ZUKoSdLniD" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;700;900&family=JetBrains+Mono:wght@300;400;700&display=swap" rel="stylesheet" />
        <script src="https://cdn.tailwindcss.com"></script>
        <script dangerouslySetInnerHTML={{ __html: `
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  primary: { 500:'#3DA563',700:'#1B5E3B' },
                  gold: { 400:'#D4A84B',500:'#C8944A',600:'#B07D3A' },
                }
              }
            }
          }
        `}} />
      </head>
      <body style={{ background: '#000', color: '#f0f0f0', fontFamily: "'Noto Sans SC', sans-serif" }}>
        {children}
      </body>
    </html>
  )
}
