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
    default: "小白AI - AI工具导航大全、Agent教程与零基础AI学习平台",
    template: "%s | 小白AI",
  },
  description:
    "小白AI是面向零基础用户的 AI 工具导航大全、AI学习路径、Agent教程、AI资讯、社区案例和站内AI助手平台，帮助普通人从会问问题开始，一步步选工具、学AI、用好Agent。",
  applicationName: "小白AI",
  keywords: [
    "小白AI",
    "AI工具导航",
    "AI工具大全",
    "AI工具推荐",
    "AI学习路径",
    "AI工具选择器",
    "AI助手",
    "Agent教程",
    "AI教程",
    "小白学AI",
    "AI模型排行",
    "DeepSeek",
    "ChatGPT",
    "Claude Code",
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
    title: "小白AI - AI工具导航大全、Agent教程与零基础AI学习平台",
    description:
      "面向 AI 新手的一站式入口：AI工具导航大全、工具选择器、站内AI助手、学习路径、Agent教程、模型排行和社区案例。",
    url: "https://www.xiaobaiai.cn",
    images: [{ url: "/xiaobai-mascot-cutout.png", width: 1071, height: 1468, alt: "小白AI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "小白AI - AI工具导航大全、Agent教程与零基础AI学习平台",
    description: "AI工具导航大全、AI学习路径、Agent教程、站内AI助手、模型排行和社区案例。",
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
  inLanguage: "zh-CN",
  description: "面向 AI 新手的工具导航大全、学习路径、AI 资讯、社区案例和站内 AI 助手平台。",
  about: ["AI工具导航", "AI工具大全", "Agent教程", "AI学习路径", "AI资讯"],
  hasPart: [
    { "@type": "WebPage", name: "AI工具大全", url: "https://www.xiaobaiai.cn/ai-tools" },
    { "@type": "WebPage", name: "免费AI工具推荐", url: "https://www.xiaobaiai.cn/free-ai-tools" },
    { "@type": "WebPage", name: "ChatGPT怎么用", url: "https://www.xiaobaiai.cn/chatgpt" },
    { "@type": "WebPage", name: "DeepSeek怎么用", url: "https://www.xiaobaiai.cn/deepseek" },
    { "@type": "WebPage", name: "Codex国内使用指南", url: "https://www.xiaobaiai.cn/codex" },
    { "@type": "WebPage", name: "Dify教程", url: "https://www.xiaobaiai.cn/dify" },
    { "@type": "WebPage", name: "Cursor怎么用", url: "https://www.xiaobaiai.cn/cursor" },
    { "@type": "WebPage", name: "Agent教程", url: "https://www.xiaobaiai.cn/agent" },
    { "@type": "WebPage", name: "AI编程工具推荐", url: "https://www.xiaobaiai.cn/ai-coding" },
    { "@type": "WebPage", name: "AI绘图工具推荐", url: "https://www.xiaobaiai.cn/ai-image-tools" },
    { "@type": "WebPage", name: "AI写作工具推荐", url: "https://www.xiaobaiai.cn/ai-writing-tools" },
    { "@type": "WebPage", name: "AI视频工具推荐", url: "https://www.xiaobaiai.cn/ai-video-tools" },
    { "@type": "WebPage", name: "AI办公工具推荐", url: "https://www.xiaobaiai.cn/ai-office-tools" },
    { "@type": "WebPage", name: "AI PPT工具推荐", url: "https://www.xiaobaiai.cn/ai-ppt-tools" },
    { "@type": "WebPage", name: "DeepSeek API Key申请教程", url: "https://www.xiaobaiai.cn/deepseek-api-key" },
    { "@type": "WebPage", name: "Dify知识库搭建教程", url: "https://www.xiaobaiai.cn/dify-knowledge-base" },
    { "@type": "WebPage", name: "Gamma做PPT教程", url: "https://www.xiaobaiai.cn/gamma-ppt" },
    { "@type": "WebPage", name: "即梦AI绘图提示词教程", url: "https://www.xiaobaiai.cn/jimeng-prompts" },
  ],
  audience: {
    "@type": "Audience",
    audienceType: "AI新手、普通办公用户、内容创作者、开发者、Agent自动化学习者",
  },
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
        <meta name="baidu-site-verification" content="codeva-EkbNCVrcx6" />
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
