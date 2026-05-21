import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Download, FileCheck2, Settings2, Sparkles } from "lucide-react"
import { NavBar } from "@/components/NavBar"
import { xiaobaiAgentRelease } from "@/data/xiaobai-agent-release"
import { xiaobaiMobileRelease } from "@/data/xiaobai-mobile-release"

const {
  displayName,
  version,
  installerName,
  installerUrl,
  installerSize,
  installerSha256,
  manifestUrl,
  latestUrl,
} = xiaobaiAgentRelease

const {
  version: mobileVersion,
  downloadVersion: mobileDownloadVersion,
  downloadName: mobileDownloadName,
  downloadUrl: mobileDownloadUrl,
  downloadSize: mobileDownloadSize,
  downloadSha256: mobileDownloadSha256,
  packageName: mobilePackageName,
  manifestUrl: mobileManifestUrl,
  webAppUrl: mobileWebAppUrl,
  platformLabel: mobilePlatformLabel,
  compatibilityLabel: mobileCompatibilityLabel,
  iosWebLabel: mobileIosWebLabel,
} = xiaobaiMobileRelease

const cardStyle = {
  border: "1px solid #e4edf4",
  borderRadius: 16,
  background: "#ffffff",
  boxShadow: "0 18px 45px rgba(25, 54, 82, 0.08)",
} as const

export const metadata: Metadata = {
  title: "下载小白天枢 Windows 桌面版 - 小白AI",
  description: "下载小白天枢 Windows 桌面版安装包，照着小白AI复制粘贴，几分钟跑通登录、模型和自然语音。",
  alternates: { canonical: "/download" },
  openGraph: {
    title: "下载小白天枢 Windows 桌面版",
    description: "下载小白天枢，按小白AI教程复制粘贴，把语音、模型和桌面 Agent 跑起来。",
    url: "/download",
    images: [{ url: "/xiaobai-mascot-cutout.png", alt: "小白天枢下载" }],
  },
}

export default function DownloadPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#f6f9fc", color: "#17202a", fontFamily: "'Noto Sans SC', sans-serif" }}>
      <NavBar />
      <main style={{ width: "min(1120px, calc(100% - 32px))", margin: "0 auto", padding: "44px 0 76px" }}>
        <section style={{ ...cardStyle, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: 30, alignItems: "center", padding: "clamp(24px, 4vw, 42px)", overflow: "hidden" }}>
          <div>
            <p style={{ margin: "0 0 12px", color: "#256d85", fontSize: 13, fontWeight: 950 }}>小白AI 官方桌面版</p>
            <h1 style={{ margin: "0 0 16px", color: "#102131", fontSize: "clamp(34px, 5vw, 58px)", lineHeight: 1.08, fontWeight: 950, letterSpacing: 0 }}>把小白装进你的电脑</h1>
            <p style={{ margin: "0 0 24px", maxWidth: 680, color: "#4c6172", fontSize: 17, lineHeight: 1.85, fontWeight: 650 }}>
              下载{displayName}，打开小白AI安装页，照着复制粘贴：登录、模型、语音识别、TTS 一次跑通。成功后，你就可以直接开口让小白检查电脑、整理任务、调用本地 Agent。
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
              <a href={installerUrl} download aria-label="下载小白 Agent Windows 安装包" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10, minHeight: 50, borderRadius: 12, background: "#256d85", color: "#fff", padding: "0 22px", textDecoration: "none", fontSize: 16, fontWeight: 950, boxShadow: "0 12px 24px rgba(37,109,133,0.22)" }}>
                <Download size={19} />
                立即下载 Windows 安装包
              </a>
              <a href={mobileDownloadUrl} download aria-label={`下载小白天枢手机版 ${mobileDownloadVersion}`} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10, minHeight: 50, borderRadius: 12, background: "#101820", color: "#fff", padding: "7px 20px", textDecoration: "none", fontSize: 16, fontWeight: 950, boxShadow: "0 12px 24px rgba(16,24,32,0.18)" }}>
                <Download size={19} />
                <span style={{ display: "grid", gap: 2, lineHeight: 1.1 }}>
                  <span>下载手机版 {mobileDownloadVersion}</span>
                  <span style={{ fontSize: 11, fontWeight: 850, opacity: 0.78 }}>天枢中心更新包</span>
                </span>
              </a>
              <Link href="/agent-install/xiaobai-nexus" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, minHeight: 50, borderRadius: 12, border: "1px solid #bfd4df", color: "#256d85", background: "#fff", padding: "0 18px", textDecoration: "none", fontSize: 15, fontWeight: 900 }}>
                跟着小白安装
                <ArrowRight size={16} />
              </Link>
            </div>
            <div style={{ marginTop: 18, display: "flex", flexWrap: "wrap", gap: 8 }}>
              {["复制粘贴就能装", "自然语音回复", "语音操作电脑", "会员登录使用", "Windows 10/11"].map((item) => (
                <span key={item} style={{ borderRadius: 999, background: "#eaf4f7", color: "#256d85", padding: "7px 10px", fontSize: 12, fontWeight: 900 }}>{item}</span>
              ))}
            </div>
          </div>

          <div style={{ borderRadius: 18, background: "linear-gradient(145deg, #e9f4f8, #ffffff)", border: "1px solid #d8e8ef", padding: 18 }}>
            <img src="/xiaobai-nexus-interface-annotated.svg" alt="小白天枢界面功能标注图" style={{ display: "block", width: "100%", height: "auto", borderRadius: 12, border: "1px solid #d6e4ec", background: "#fff" }} />
          </div>
        </section>

        <section style={{ marginTop: 20, border: "1px solid #cfe1e9", borderRadius: 16, background: "#ffffff", boxShadow: "0 18px 45px rgba(25, 54, 82, 0.08)", padding: "clamp(20px, 3vw, 30px)" }}>
          <p style={{ margin: "0 0 10px", color: "#256d85", fontSize: 13, fontWeight: 950 }}>装好以后能做什么</p>
          <h2 style={{ margin: "0 0 12px", color: "#102131", fontSize: "clamp(26px, 4vw, 40px)", lineHeight: 1.15, fontWeight: 950, letterSpacing: 0 }}>装完，不只是多一个聊天框。</h2>
          <p style={{ margin: "0 0 18px", maxWidth: 880, color: "#506577", fontSize: 16, lineHeight: 1.85, fontWeight: 650 }}>
            小白AI把安装包、Key、配置项和测试句都拆成可复制步骤。你不用先懂 Agent、ASR、TTS，先让它听懂你、说回来、给下一步。
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 210px), 1fr))", gap: 12 }}>
            <div style={{ border: "1px solid #e0edf3", borderRadius: 12, background: "#f8fbfd", padding: 15 }}>
              <b style={{ display: "block", marginBottom: 7, color: "#102131", fontSize: 15 }}>复制就能走</b>
              <span style={{ color: "#5b6f7f", fontSize: 13, lineHeight: 1.7 }}>下载、登录、Key 填哪里、怎么测试，都按页面顺序来。</span>
            </div>
            <div style={{ border: "1px solid #e0edf3", borderRadius: 12, background: "#f8fbfd", padding: 15 }}>
              <b style={{ display: "block", marginBottom: 7, color: "#102131", fontSize: 15 }}>声音像人在带</b>
              <span style={{ color: "#5b6f7f", fontSize: 13, lineHeight: 1.7 }}>选自然口语音色，不要播报腔。听起来要像有人陪你操作。</span>
            </div>
            <div style={{ border: "1px solid #e0edf3", borderRadius: 12, background: "#f8fbfd", padding: 15 }}>
              <b style={{ display: "block", marginBottom: 7, color: "#102131", fontSize: 15 }}>一次配置复用</b>
              <span style={{ color: "#5b6f7f", fontSize: 13, lineHeight: 1.7 }}>模型和语音跑通后，下次直接继续训练你的个人 Agent。</span>
            </div>
            <div style={{ border: "1px solid #e0edf3", borderRadius: 12, background: "#f8fbfd", padding: 15 }}>
              <b style={{ display: "block", marginBottom: 7, color: "#102131", fontSize: 15 }}>装完马上做</b>
              <span style={{ color: "#5b6f7f", fontSize: 13, lineHeight: 1.7 }}>先做检查、语音回复和一次桌面 Agent 调度，不空聊。</span>
            </div>
          </div>
          <div style={{ marginTop: 16, borderRadius: 12, background: "#eef7fa", border: "1px solid #d4e7ee", padding: 14, color: "#21495a", fontSize: 14, lineHeight: 1.75, fontWeight: 750 }}>
            装好后别空聊，直接说：“小白，检查一下我的电脑和语音配置。”如果它能回答下一步，你已经有了电脑里的小白入口。
          </div>
        </section>

        <section style={{ marginTop: 20, border: "1px solid #d8e8ef", borderRadius: 16, background: "#ffffff", boxShadow: "0 18px 45px rgba(25, 54, 82, 0.08)", padding: "clamp(20px, 3vw, 30px)" }}>
          <p style={{ margin: "0 0 10px", color: "#256d85", fontSize: 13, fontWeight: 950 }}>手机端 App</p>
          <h2 style={{ margin: "0 0 12px", color: "#102131", fontSize: "clamp(26px, 4vw, 40px)", lineHeight: 1.15, fontWeight: 950, letterSpacing: 0 }}>离开电脑，也能指挥家里的小白 Agent</h2>
          <p style={{ margin: "0 0 18px", maxWidth: 900, color: "#506577", fontSize: 16, lineHeight: 1.85, fontWeight: 650 }}>
            下载最新手机版更新包，手机上直接登录小白网站会员账号，就能连接同账号登录的电脑端小白。iPhone、安卓、鸿蒙、折叠屏和平板都可以先用网页版随身控制台。你在外面发任务，电脑端小白负责执行、调用本机 Agent、同步任务进度和结果。
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: 16, alignItems: "stretch" }}>
            <div style={{ border: "1px solid #e0edf3", borderRadius: 12, background: "#f8fbfd", padding: 16 }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", marginBottom: 14 }}>
                <a href={mobileDownloadUrl} download aria-label={`下载小白天枢手机版 ${mobileDownloadVersion}`} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10, minHeight: 48, borderRadius: 12, background: "#101820", color: "#fff", padding: "7px 18px", textDecoration: "none", fontSize: 15, fontWeight: 950 }}>
                  <Download size={18} />
                  <span style={{ display: "grid", gap: 2, lineHeight: 1.1 }}>
                    <span>下载手机版 {mobileDownloadVersion}</span>
                    <span style={{ fontSize: 11, fontWeight: 850, opacity: 0.78 }}>天枢中心更新包</span>
                  </span>
                </a>
                <a href={mobileWebAppUrl} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, minHeight: 48, borderRadius: 12, border: "1px solid #bfd4df", color: "#256d85", background: "#fff", padding: "0 16px", textDecoration: "none", fontSize: 14, fontWeight: 900 }}>
                  iOS 打开网页版
                  <ArrowRight size={15} />
                </a>
              </div>
              <div style={{ marginBottom: 14, display: "grid", gap: 8 }}>
                <span style={{ display: "inline-flex", width: "fit-content", borderRadius: 999, background: "#eaf4f7", color: "#256d85", padding: "7px 10px", fontSize: 12, fontWeight: 950 }}>{mobilePlatformLabel}</span>
                <p style={{ margin: 0, color: "#526879", fontSize: 13, lineHeight: 1.75, fontWeight: 700 }}>{mobileCompatibilityLabel}。{mobileIosWebLabel}。</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))", gap: 10 }}>
                {[
                  ["账号直连", "不用填电脑 IP，不用复制本机 Token，登录网站会员账号即可绑定同账号电脑端。"],
                  ["远程发任务", "手机发出的任务进入网站云端中继，电脑端小白在线时自动拉取执行。"],
                  ["同步资产", "会话、记忆、技能和委托状态会同步到手机工作室，方便离开电脑后继续看。"],
                ].map(([title, body]) => (
                  <div key={title} style={{ border: "1px solid #e0edf3", borderRadius: 12, background: "#fff", padding: 13 }}>
                    <b style={{ display: "block", marginBottom: 6, color: "#102131", fontSize: 14 }}>{title}</b>
                    <span style={{ color: "#5b6f7f", fontSize: 13, lineHeight: 1.7 }}>{body}</span>
                  </div>
                ))}
              </div>
            </div>
            <aside style={{ border: "1px solid #e0edf3", borderRadius: 12, background: "#f8fbfd", padding: 16 }}>
              <h3 style={{ margin: "0 0 12px", color: "#102131", fontSize: 17, fontWeight: 950 }}>手机端版本</h3>
              <div style={{ display: "grid", gap: 9, color: "#536879", fontSize: 13, lineHeight: 1.65 }}>
                <div><b style={{ color: "#17202a" }}>版本：</b>{mobileVersion}</div>
                <div><b style={{ color: "#17202a" }}>系统：</b>{mobilePlatformLabel}</div>
                <div><b style={{ color: "#17202a" }}>文件：</b>{mobileDownloadName}</div>
                <div><b style={{ color: "#17202a" }}>包名：</b>{mobilePackageName}</div>
                <div><b style={{ color: "#17202a" }}>大小：</b>{mobileDownloadSize}</div>
                <div style={{ wordBreak: "break-all" }}><b style={{ color: "#17202a" }}>SHA256：</b>{mobileDownloadSha256}</div>
              </div>
              <a href={mobileManifestUrl} style={{ marginTop: 13, display: "inline-flex", color: "#256d85", fontSize: 13, fontWeight: 900, textDecoration: "none" }}>手机端发布清单</a>
            </aside>
          </div>
        </section>

        <section style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))", gap: 14 }}>
          {[
            { icon: Download, title: "下载后直接安装", body: "打开安装包，按提示安装。安装完成后从桌面快捷方式或开始菜单启动小白天枢。" },
            { icon: Settings2, title: "照着教程复制粘贴", body: "小白AI已经把模型、ASR、TTS 分开写清楚。你按页面填，不用自己猜哪个 Key 填哪里。" },
            { icon: Sparkles, title: "让它开口带你做", body: "语音设置完成后，先让小白检查配置，再让它用自然语气说出下一步。" },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} style={{ ...cardStyle, padding: 18 }}>
              <Icon size={20} style={{ color: "#256d85", marginBottom: 12 }} />
              <h2 style={{ margin: "0 0 8px", color: "#102131", fontSize: 17, fontWeight: 950 }}>{title}</h2>
              <p style={{ margin: 0, color: "#5b6f7f", fontSize: 14, lineHeight: 1.75 }}>{body}</p>
            </div>
          ))}
        </section>

        <section style={{ marginTop: 20, border: "1px solid #d8e8ef", borderRadius: 16, background: "#ffffff", boxShadow: "0 18px 45px rgba(25, 54, 82, 0.08)", padding: 20 }}>
          <h2 style={{ margin: "0 0 12px", color: "#102131", fontSize: 20, fontWeight: 950 }}>更新后，你的聊天、技能和任务记录还在</h2>
          <p style={{ margin: "0 0 14px", color: "#526879", fontSize: 14, lineHeight: 1.85, fontWeight: 650 }}>
            小白天枢的更新是覆盖升级程序本身，不会把你的本机个人资产当成临时缓存清掉。重新打开小白后，原来的聊天记录、技能库、任务记录、长期记忆、API 配置和 Agent 检测结果会继续从本机数据目录读取。
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))", gap: 12 }}>
            {[
              ["覆盖安装不等于重置", "点击新版本安装包或自动更新，只替换应用程序文件，不会主动删除你的个人数据。"],
              ["资产跟着账号和本机走", "技能、任务、记忆和历史会继续服务同一台电脑上的小白，不需要每次升级后重新训练。"],
              ["只有主动清理才会删除", "除非你手动清空小白数据、卸载时选择删除数据，或删除系统用户数据目录，否则记录会保留。"],
            ].map(([title, body]) => (
              <div key={title} style={{ border: "1px solid #e0edf3", borderRadius: 12, background: "#f8fbfd", padding: 14 }}>
                <b style={{ display: "block", marginBottom: 6, color: "#102131", fontSize: 14 }}>{title}</b>
                <span style={{ color: "#5b6f7f", fontSize: 13, lineHeight: 1.7 }}>{body}</span>
              </div>
            ))}
          </div>
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
              小白至少需要一套模型 API；要语音操作电脑，再准备 ASR 语音识别和 TTS 语音合成。安装教程会告诉你每个 Key 去哪里申请、复制到哪里、怎么测试有没有成功。
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
              "安装后能看到小白天枢桌面快捷方式。",
              "按教程复制粘贴配置后，小白能听懂你说话，也能用更自然的声音回复。",
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
