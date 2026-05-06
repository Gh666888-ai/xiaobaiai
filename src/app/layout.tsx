import type { Metadata } from "next"
import "./globals.css"
import { AuthProvider } from "@/lib/AuthContext"
import { Noto_Sans_SC, JetBrains_Mono } from "next/font/google"

const noto = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-noto",
  display: "swap",
  preload: true,
})

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-jetbrains",
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  metadataBase: new URL("https://www.xiaobaiai.cn"),
  title: {
    default: "小白AI - 从零开始学 AI、选工具、用 Agent",
    template: "%s | 小白AI",
  },
  description:
    "小白AI是面向零基础用户的 AI 工具导航、学习路径、模型排行、AI资讯、社区案例和站内AI助手平台，帮助普通人从会问问题开始，一步步用好 AI。",
  applicationName: "小白AI",
  keywords: [
    "小白AI",
    "AI工具导航",
    "AI学习路径",
    "AI工具选择器",
    "AI助手",
    "Agent教程",
    "AI模型排行",
    "DeepSeek",
    "AI资讯",
  ],
  authors: [{ name: "小白AI" }],
  creator: "小白AI",
  publisher: "小白AI",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.svg",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "小白AI",
    title: "小白AI - 从零开始学 AI、选工具、用 Agent",
    description:
      "面向 AI 新手的一站式入口：工具选择器、站内AI助手、学习路径、模型排行、社区案例和每日成长任务。",
    url: "https://www.xiaobaiai.cn",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "小白AI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "小白AI - 从零开始学 AI、选工具、用 Agent",
    description: "AI工具导航、学习路径、站内AI助手、模型排行和社区案例。",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={`${noto.variable} ${jetbrains.variable}`}>
      <head>
        <meta name="baidu-site-verification" content="codeva-RTXCqCLk3P" />
        <meta name="baidu-site-verification" content="codeva-ZUKoSdLniD" />
        <script
          dangerouslySetInnerHTML={{
            __html:
              'var _hmt=_hmt||[];(function(){var hm=document.createElement("script");hm.src="https://hm.baidu.com/hm.js?25dc9f7854f8b827d57b6451814fae7a";var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(hm,s)})()',
          }}
        />
      </head>
      <body style={{ background: "#000", color: "#f0f0f0", fontFamily: "'Noto Sans SC', sans-serif" }}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
