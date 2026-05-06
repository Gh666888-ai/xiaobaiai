"use client"

import Link from "next/link"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"

export default function AboutPage() {
  return (
    <div style={{ background: "#000", minHeight: "100vh", fontFamily: "'Noto Sans SC', sans-serif", position: "relative", overflow: "hidden" }}>
      <MathRain />
      <NavBar />
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "80px 60px 100px", position: "relative", zIndex: 10, background: "rgba(0,0,0,0.86)" }} className="max-sm:px-4">
        <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.4em", color: "#7a6230", textTransform: "uppercase", marginBottom: 10, fontWeight: 700 }}>About</p>
        <h1 style={{ fontSize: 36, fontWeight: 950, color: "#fff", letterSpacing: "0.02em", marginBottom: 28 }}>关于小白AI</h1>

        <div style={{ fontSize: 16, color: "#ccc", lineHeight: 2.1 }}>
          <p style={{ marginBottom: 24 }}>
            小白AI 是一个专门为 <strong style={{ color: "#e8c96a" }}>零基础 AI 新手</strong> 打造的一站式学习与导航平台。
          </p>

          <p style={{ marginBottom: 24 }}>
            现在 AI 工具、模型、Agent 平台更新太快，很多普通用户不是不想学，而是不知道从哪里开始。小白AI 想做的事很简单：把复杂技术翻译成人话，把可用工具整理成路线，让每个人都能迈出第一步。
          </p>

          <p style={{ marginBottom: 24 }}>
            你可以在这里完成一条完整路径：先用 <Link href="/chat" style={{ color: "#e8c96a" }}>小白AI助手</Link> 提问，再用 <Link href="/choose-tool" style={{ color: "#e8c96a" }}>AI工具选择器</Link> 找到适合自己的工具，然后按 <Link href="/learn" style={{ color: "#e8c96a" }}>学习路径</Link> 逐章练习，最后在 <Link href="/community" style={{ color: "#e8c96a" }}>社区</Link> 看真实案例、分享自己的经验。
          </p>

          <p style={{ marginBottom: 24 }}>
            我们相信：<strong style={{ color: "#e8c96a" }}>AI 不是程序员的专利，它是每个普通人都能掌握的新技能。</strong> 小白AI 会继续围绕“更好懂、更好用、更能落地”来更新。
          </p>

          <div style={{ marginTop: 44, padding: "24px", background: "rgba(255,255,255,0.03)", border: "1px solid #1a1a1a", borderRadius: 12 }}>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: "#e8c96a", marginBottom: 16 }}>联系方式</h2>
            <p style={{ marginBottom: 8 }}>邮箱：admin@xiaobaiai.cn</p>
            <p style={{ marginBottom: 8 }}>微信：Ghnnnnnn</p>
            <p style={{ marginBottom: 8 }}>网址：xiaobaiai.cn</p>
            <p style={{ marginTop: 16, fontSize: 13, color: "#888", lineHeight: 1.8 }}>
              如果你有好工具、好教程、真实 AI 案例或踩坑记录，欢迎通过社区投稿。
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
