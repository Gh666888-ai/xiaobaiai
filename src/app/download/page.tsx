import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Download, FileCheck2, Settings2, Sparkles } from "lucide-react"
import { NavBar } from "@/components/NavBar"

const version = "2.1.119"
const installerName = `Xiaobai-Setup-${version}.exe`
const installerUrl = `/downloads/xiaobai-agent/${installerName}`
const manifestUrl = "/downloads/xiaobai-agent/release-manifest.json"
const latestUrl = "/downloads/xiaobai-agent/latest.yml"
const installerSize = "85.8 MB"
const installerSha256 = "0b951de1f0f87a27b28d538de2710e9b3894ed6f44df6e45bbc509b896d785f5"

const cardStyle = {
  border: "1px solid #e4edf4",
  borderRadius: 16,
  background: "#ffffff",
  boxShadow: "0 18px 45px rgba(25, 54, 82, 0.08)",
} as const

export const metadata: Metadata = {
  title: "下载小白 Agent Windows 桌面版 - 小白AI",
  description: "下载小白 Agent Windows 桌面版安装包，查看安装步骤、API 准备入口和版本信息。",
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
    <div style={{ minHeight: "100vh", background: "#f6f9fc", color: "#17202a", fontFamily: "'Noto Sans SC', sans-serif" }}>
      <NavBar />
      <main style={{ width: "min(1120px, calc(100% - 32px))", margin: "0 auto", padding: "44px 0 76px" }}>
        <section style={{ ...cardStyle, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: 30, alignItems: "center", padding: "clamp(24px, 4vw, 42px)", overflow: "hidden" }}>
          <div>
            <p style={{ margin: "0 0 12px", color: "#256d85", fontSize: 13, fontWeight: 950 }}>小白 Agent 官方桌面版</p>
            <h1 style={{ margin: "0 0 16px", color: "#102131", fontSize: "clamp(34px, 5vw, 58px)", lineHeight: 1.08, fontWeight: 950, letterSpacing: 0 }}>下载 Xiaobai Nexus</h1>
            <p style={{ margin: "0 0 24px", maxWidth: 680, color: "#4c6172", fontSize: 17, lineHeight: 1.85, fontWeight: 650 }}>
              Windows 电脑点击下面按钮就会开始下载安装包。安装后用小白AI网站会员账号登录，再按引导配置模型、语音识别和语音合成 API。
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
              <a href={installerUrl} download aria-label="下载小白 Agent Windows 安装包" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10, minHeight: 50, borderRadius: 12, background: "#256d85", color: "#fff", padding: "0 22px", textDecoration: "none", fontSize: 16, fontWeight: 950, boxShadow: "0 12px 24px rgba(37,109,133,0.22)" }}>
                <Download size={19} />
                立即下载 Windows 安装包
              </a>
              <Link href="/agent-install/xiaobai-nexus" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, minHeight: 50, borderRadius: 12, border: "1px solid #bfd4df", color: "#256d85", background: "#fff", padding: "0 18px", textDecoration: "none", fontSize: 15, fontWeight: 900 }}>
                查看安装教程
                <ArrowRight size={16} />
              </Link>
            </div>
            <div style={{ marginTop: 18, display: "flex", flexWrap: "wrap", gap: 8 }}>
              {["会员登录使用", "可换银河/照片背景", "已预留自动更新", "Windows 10/11"].map((item) => (
                <span key={item} style={{ borderRadius: 999, background: "#eaf4f7", color: "#256d85", padding: "7px 10px", fontSize: 12, fontWeight: 900 }}>{item}</span>
              ))}
            </div>
          </div>

          <div style={{ borderRadius: 18, background: "linear-gradient(145deg, #e9f4f8, #ffffff)", border: "1px solid #d8e8ef", padding: 18 }}>
            <img src="/xiaobai-nexus-interface-annotated.svg" alt="Xiaobai Nexus 界面功能标注图" style={{ display: "block", width: "100%", height: "auto", borderRadius: 12, border: "1px solid #d6e4ec", background: "#fff" }} />
          </div>
        </section>

        <section style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))", gap: 14 }}>
          {[
            { icon: Download, title: "下载后直接安装", body: "打开安装包，按提示安装。安装完成后从桌面快捷方式或开始菜单启动 Xiaobai Nexus。" },
            { icon: Settings2, title: "登录并配置 API", body: "桌面端需要小白AI会员账号。语音对话还需要配置 ASR 和 TTS，教程页写清楚了申请位置。" },
            { icon: Sparkles, title: "开始使用小白", body: "这一版包含自定义背景、语音闭环、Agent 调度、自我进化入口和桌面能力中心。" },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} style={{ ...cardStyle, padding: 18 }}>
              <Icon size={20} style={{ color: "#256d85", marginBottom: 12 }} />
              <h2 style={{ margin: "0 0 8px", color: "#102131", fontSize: 17, fontWeight: 950 }}>{title}</h2>
              <p style={{ margin: 0, color: "#5b6f7f", fontSize: 14, lineHeight: 1.75 }}>{body}</p>
            </div>
          ))}
        </section>

        <section style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: 16 }}>
          <aside style={{ ...cardStyle, padding: 20 }}>
            <h2 style={{ margin: "0 0 14px", color: "#102131", fontSize: 20, fontWeight: 950 }}>版本信息</h2>
            <div style={{ display: "grid", gap: 11, color: "#536879", fontSize: 14, lineHeight: 1.65 }}>
              <div><b style={{ color: "#17202a" }}>版本：</b>{version}</div>
              <div><b style={{ color: "#17202a" }}>文件：</b>{installerName}</div>
              <div><b style={{ color: "#17202a" }}>大小：</b>{installerSize}</div>
              <div style={{ wordBreak: "break-all" }}><b style={{ color: "#17202a" }}>SHA256：</b>{installerSha256}</div>
            </div>
            <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 10 }}>
              <a href={manifestUrl} style={{ color: "#256d85", fontSize: 13, fontWeight: 900, textDecoration: "none" }}>发布清单</a>
              <a href={latestUrl} style={{ color: "#256d85", fontSize: 13, fontWeight: 900, textDecoration: "none" }}>自动更新文件</a>
            </div>
          </aside>

          <section style={{ ...cardStyle, padding: 20 }}>
            <h2 style={{ margin: "0 0 12px", color: "#102131", fontSize: 20, fontWeight: 950 }}>API 去哪里准备</h2>
            <p style={{ margin: "0 0 14px", color: "#5b6f7f", fontSize: 14, lineHeight: 1.8 }}>
              小白至少需要一套模型 API；要语音对话，再准备 ASR 语音识别和 TTS 语音合成。完整申请位置在 Xiaobai Nexus 安装教程里。
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 190px), 1fr))", gap: 10 }}>
              {[
                ["豆包 TTS", "火山方舟 / 豆包语音合成 2.0"],
                ["阿里云 ASR", "阿里云百炼 / DashScope API Key"],
                ["MiniMax", "MiniMax 开放平台 / API Keys"],
                ["OpenAI", "OpenAI Platform / API keys"],
              ].map(([name, desc]) => (
                <div key={name} style={{ border: "1px solid #e2edf3", borderRadius: 12, padding: 12, background: "#f8fbfd" }}>
                  <b style={{ display: "block", color: "#102131", fontSize: 14, marginBottom: 5 }}>{name}</b>
                  <span style={{ color: "#5f7282", fontSize: 13, lineHeight: 1.55 }}>{desc}</span>
                </div>
              ))}
            </div>
            <Link href="/agent-install/xiaobai-nexus#api" style={{ marginTop: 14, display: "inline-flex", alignItems: "center", gap: 8, minHeight: 40, borderRadius: 10, color: "#256d85", textDecoration: "none", fontSize: 14, fontWeight: 950 }}>
              查看完整 API 准备清单 <ArrowRight size={15} />
            </Link>
          </section>
        </section>

        <section style={{ marginTop: 20, ...cardStyle, padding: 20 }}>
          <h2 style={{ margin: "0 0 12px", color: "#102131", fontSize: 20, fontWeight: 950 }}>确认下载成功</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))", gap: 12 }}>
            {[
              `浏览器开始下载 ${installerName}。`,
              "安装后能看到 Xiaobai Nexus 桌面快捷方式。",
              "登录会员账号后进入小白主界面。",
            ].map((item) => (
              <p key={item} style={{ display: "grid", gridTemplateColumns: "22px 1fr", gap: 8, margin: 0, color: "#536879", fontSize: 14, lineHeight: 1.7 }}>
                <FileCheck2 size={17} color="#2f7d4d" style={{ marginTop: 4 }} />
                <span>{item}</span>
              </p>
            ))}
          </div>
        </section>

        <section style={{ marginTop: 20, border: "1px solid #d8e8ef", borderRadius: 16, background: "#eef7fa", padding: 20 }}>
          <h2 style={{ margin: "0 0 12px", color: "#102131", fontSize: 20, fontWeight: 950 }}>Windows 提示未知发布者怎么办</h2>
          <p style={{ margin: "0 0 14px", color: "#526879", fontSize: 14, lineHeight: 1.8 }}>
            小白安装包正在准备正式代码签名证书。证书完成前，Windows 或浏览器可能会提示“未知发布者”或“此文件不常下载”。如果你是从本页下载，可以按下面方式继续安装。
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))", gap: 12 }}>
            {[
              ["浏览器拦截下载", "打开下载列表，点“保留”或“显示更多”，再点“仍要保留”。"],
              ["SmartScreen 蓝色窗口", "点“更多信息”，再点“仍要运行”。"],
              ["文件被系统锁定", "右键安装包，打开“属性”，在“常规”里勾选“解除锁定”，再点“应用”。"],
            ].map(([title, body]) => (
              <div key={title} style={{ border: "1px solid #d7e8ef", borderRadius: 12, background: "#fff", padding: 14 }}>
                <b style={{ display: "block", marginBottom: 6, color: "#102131", fontSize: 14 }}>{title}</b>
                <span style={{ color: "#5b6f7f", fontSize: 13, lineHeight: 1.7 }}>{body}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
