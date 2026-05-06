import type { Metadata } from "next"
import "./globals.css"
import { AuthProvider } from "@/lib/AuthContext"

export const metadata: Metadata = {
  metadataBase: new URL("https://xiaobaiai.cn"),
  title: { default: "小白AI — 从零到Agent · AI工具导航", template: "%s | 小白AI" },
  description: "AI工具导航、从零到Agent的学习路径、AI最新资讯。Agent自动维护 + 社区用户共建。",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "小白AI",
    title: "小白AI — 从零到Agent · AI工具导航",
    description: "收录50+款AI工具，7阶段渐进式学习路径，Agent自动维护的最新AI资讯。",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "小白AI — 从零到Agent · AI工具导航",
    description: "AI工具导航、从零到Agent的学习路径、AI最新资讯。",
  },
  robots: { index: true, follow: true },
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
        <script dangerouslySetInnerHTML={{__html:`tailwind.config={theme:{extend:{colors:{primary:{500:'#3DA563',700:'#1B5E3B'},gold:{400:'#D4A84B',500:'#C8944A',600:'#B07D3A'}}}}}`}} />
        <script dangerouslySetInnerHTML={{__html:`var _hmt=_hmt||[];(function(){var hm=document.createElement("script");hm.src="https://hm.baidu.com/hm.js?25dc9f7854f8b827d57b6451814fae7a";var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(hm,s)})()`}} />
      </head>
      <body style={{ background: '#000', color: '#f0f0f0', fontFamily: "'Noto Sans SC', sans-serif" }}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
