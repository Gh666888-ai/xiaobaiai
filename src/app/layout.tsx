import type { Metadata } from "next"
import "./globals.css"
import { AuthProvider } from "@/lib/AuthContext"
import { Noto_Sans_SC, JetBrains_Mono } from "next/font/google"

const noto = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["300","400","700","900"],
  variable: "--font-noto",
  display: "swap",
  preload: true,
})

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300","400","700"],
  variable: "--font-jetbrains",
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  metadataBase: new URL("https://www.xiaobaiai.cn"),
  title: { default: "小白AI — 从零到Agent · AI工具导航", template: "%s | 小白AI" },
  description: "AI工具导航、从零到Agent的学习路径、AI最新资讯。Agent自动维护 + 社区用户共建。",
  applicationName: "小白AI",
  keywords: ["AI工具导航", "AI学习路径", "Agent", "AI资讯", "AI模型排行", "AI技能库"],
  authors: [{ name: "小白AI" }],
  creator: "小白AI",
  publisher: "小白AI",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.svg",
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "小白AI",
    title: "小白AI — 从零到Agent · AI工具导航",
    description: "收录 AI 工具、Agent 技能、模型排行、学习路径和 AI 资讯，帮助零基础用户开始使用 AI。",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "小白AI — 从零到Agent · AI工具导航",
    description: "AI工具导航、从零到Agent的学习路径、AI最新资讯。",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={`${noto.variable} ${jetbrains.variable}`}>
      <head>
        <meta name="baidu-site-verification" content="codeva-RTXCqCLk3P" />
        <meta name="baidu-site-verification" content="codeva-ZUKoSdLniD" />
        <script dangerouslySetInnerHTML={{__html:`var _hmt=_hmt||[];(function(){var hm=document.createElement("script");hm.src="https://hm.baidu.com/hm.js?25dc9f7854f8b827d57b6451814fae7a";var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(hm,s)})()`}} />
      </head>
      <body style={{ background: '#000', color: '#f0f0f0', fontFamily: "'Noto Sans SC', sans-serif" }}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
