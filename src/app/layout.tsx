import type { Metadata } from "next"
import "./globals.css"
import { AuthProvider } from "@/lib/AuthContext"
import { FloatingChat } from "@/components/FloatingChat"
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
    icon: [
      { url: "/xiaobai-icon-32.png?v=3", sizes: "32x32", type: "image/png" },
      { url: "/xiaobai-icon-192.png?v=3", sizes: "192x192", type: "image/png" },
      { url: "/favicon.ico?v=3" },
    ],
    shortcut: "/xiaobai-icon-32.png?v=3",
    apple: "/xiaobai-icon-180.png?v=3",
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
    images: [{ url: "/xiaobai-mascot-cutout.png", width: 1071, height: 1468, alt: "小白AI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "小白AI - 从零开始学 AI、选工具、用 Agent",
    description: "AI工具导航、学习路径、站内AI助手、模型排行和社区案例。",
    images: ["/xiaobai-mascot-cutout.png"],
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

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "小白AI",
  alternateName: ["小白AI导航", "AI第一站"],
  url: "https://www.xiaobaiai.cn",
  description: "面向 AI 新手的工具导航、学习路径、AI 资讯、社区案例和站内 AI 助手平台。",
  publisher: {
    "@type": "Organization",
    name: "小白AI",
    url: "https://www.xiaobaiai.cn",
    logo: {
      "@type": "ImageObject",
      url: "https://www.xiaobaiai.cn/xiaobai-icon-192.png?v=3",
    },
  },
  potentialAction: {
    "@type": "SearchAction",
    target: "https://www.xiaobaiai.cn/search?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={`${noto.variable} ${jetbrains.variable}`}>
      <head>
        <meta name="baidu-site-verification" content="codeva-RTXCqCLk3P" />
        <meta name="baidu-site-verification" content="codeva-ZUKoSdLniD" />
        <link rel="icon" type="image/png" sizes="32x32" href="/xiaobai-icon-32.png?v=3" />
        <link rel="icon" type="image/png" sizes="192x192" href="/xiaobai-icon-192.png?v=3" />
        <link rel="apple-touch-icon" sizes="180x180" href="/xiaobai-icon-180.png?v=3" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html:
              'var _hmt=_hmt||[];(function(){var hm=document.createElement("script");hm.src="https://hm.baidu.com/hm.js?25dc9f7854f8b827d57b6451814fae7a";var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(hm,s)})()',
          }}
        />
      </head>
      <body style={{ background: "#000", color: "#f0f0f0", fontFamily: "'Noto Sans SC', sans-serif" }}>
        <AuthProvider>
          {children}
          <FloatingChat />
        </AuthProvider>
      </body>
    </html>
  )
}
