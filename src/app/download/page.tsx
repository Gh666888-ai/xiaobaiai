import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, CheckCircle2, Download } from "lucide-react"
import { NavBar } from "@/components/NavBar"

const version = "2.1.118"
const installerName = `Xiaobai-Setup-${version}.exe`
const installerUrl = `/downloads/xiaobai-agent/${installerName}`
const manifestUrl = "/downloads/xiaobai-agent/release-manifest.json"
const latestUrl = "/downloads/xiaobai-agent/latest.yml"
const installerSize = "85.8 MB"
const installerSha256 = "44fbf9cb174141de071be7266e711487c20f2c1e87e81fddf031c7677c1c1dfe"

export const metadata: Metadata = {
  title: "下载小白 Agent Windows 桌面版 - 小白AI",
  description: "下载小白 Agent Windows 桌面版安装包，包含版本号、文件大小、SHA256 校验和和自动更新文件。",
  alternates: { canonical: "/download" },
  openGraph: {
    title: "下载小白 Agent Windows 桌面版",
    description: "小白 Agent 桌面端安装包下载入口。",
    url: "/download",
    images: [{ url: "/xiaobai-mascot-cutout.png", alt: "小白 Agent 下载" }],
  },
}

export default function DownloadPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#050505", color: "#f7f0dc", fontFamily: "'Noto Sans SC', sans-serif" }}>
      <NavBar />
      <main style={{ width: "min(1120px, calc(100% - 32px))", margin: "0 auto", padding: "54px 0 80px" }}>
        <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.2fr) minmax(280px, 0.8fr)", gap: 28, alignItems: "stretch" }}>
          <div style={{ border: "1px solid rgba(201,168,76,0.22)", borderRadius: 14, background: "linear-gradient(145deg, rgba(20,17,10,0.92), rgba(8,8,8,0.96))", padding: 28 }}>
            <p style={{ margin: "0 0 14px", color: "#c9a84c", fontSize: 12, fontWeight: 950, letterSpacing: "0.18em", textTransform: "uppercase" }}>Xiaobai Agent Desktop</p>
            <h1 style={{ margin: "0 0 16px", color: "#fff", fontSize: "clamp(34px, 5vw, 62px)", lineHeight: 1.08, fontWeight: 950, letterSpacing: 0 }}>下载小白 Agent Windows 版</h1>
            <p style={{ margin: "0 0 24px", maxWidth: 680, color: "#d3c397", fontSize: 16, lineHeight: 1.9, fontWeight: 750 }}>
              这是小白 Agent 的桌面端安装包。另一台 Windows 电脑打开这个页面，点击下载后安装即可。当前版本已经包含 Agent 调度、自我进化提案、语音闭环和桌面控制能力的最新构建。
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
              <a href={installerUrl} download style={{ display: "inline-flex", alignItems: "center", gap: 9, minHeight: 46, borderRadius: 10, background: "#e8c96a", color: "#111", padding: "0 18px", textDecoration: "none", fontSize: 15, fontWeight: 950 }}>
                <Download size={18} />
                下载 Windows 安装包
              </a>
              <Link href="/agent-install" style={{ display: "inline-flex", alignItems: "center", gap: 8, minHeight: 46, borderRadius: 10, border: "1px solid rgba(201,168,76,0.38)", color: "#e8c96a", padding: "0 16px", textDecoration: "none", fontSize: 14, fontWeight: 900 }}>
                安装教程
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <aside style={{ border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, background: "rgba(255,255,255,0.035)", padding: 22 }}>
            <h2 style={{ margin: "0 0 16px", color: "#fff", fontSize: 20, fontWeight: 950 }}>发布信息</h2>
            <div style={{ display: "grid", gap: 12, color: "#d5caa7", fontSize: 13, lineHeight: 1.65 }}>
              <div><b style={{ color: "#fff" }}>版本：</b>{version}</div>
              <div><b style={{ color: "#fff" }}>文件：</b>{installerName}</div>
              <div><b style={{ color: "#fff" }}>大小：</b>{installerSize}</div>
              <div style={{ wordBreak: "break-all" }}><b style={{ color: "#fff" }}>SHA256：</b>{installerSha256}</div>
            </div>
            <div style={{ marginTop: 18, display: "grid", gap: 9 }}>
              <a href={manifestUrl} style={{ color: "#e8c96a", fontSize: 13, fontWeight: 850, textDecoration: "none" }}>查看 release-manifest.json</a>
              <a href={latestUrl} style={{ color: "#e8c96a", fontSize: 13, fontWeight: 850, textDecoration: "none" }}>查看 latest.yml 自动更新文件</a>
            </div>
          </aside>
        </section>

        <section style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 14 }}>
          {[
            ["下载后直接安装", "打开安装包，按提示完成安装，然后从桌面或开始菜单启动小白 Agent。"],
            ["首次启动配置模型", "安装后打开小白 Agent，在设置里填入你的 LLM、语音识别和 TTS 服务配置。"],
            ["自动更新已预留", "网站同时提供 latest.yml 和 blockmap，后续可作为桌面端更新通道。"],
          ].map(([title, body]) => (
            <div key={title} style={{ border: "1px solid rgba(201,168,76,0.16)", borderRadius: 12, background: "rgba(201,168,76,0.045)", padding: 16 }}>
              <CheckCircle2 size={18} style={{ color: "#e8c96a", marginBottom: 10 }} />
              <h3 style={{ margin: "0 0 8px", color: "#fff", fontSize: 15, fontWeight: 950 }}>{title}</h3>
              <p style={{ margin: 0, color: "#b9ae8f", fontSize: 13, lineHeight: 1.75 }}>{body}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  )
}
