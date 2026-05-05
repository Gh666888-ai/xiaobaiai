"use client"

import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"

export default function AboutPage() {
  return (
    <div style={{background:'#000',minHeight:'100vh',fontFamily:"'Noto Sans SC', sans-serif",position:'relative',overflow:'hidden'}}>
      <MathRain />
      <NavBar />
      <div style={{maxWidth:700,margin:'0 auto',padding:'80px 60px 100px',position:'relative',zIndex:10,background:'rgba(0,0,0,0.85)'}}>
        <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:'0.4em',color:'#7a6230',textTransform:'uppercase',marginBottom:10,fontWeight:700}}>About</p>
        <h1 style={{fontSize:36,fontWeight:900,color:'#fff',letterSpacing:'0.02em',marginBottom:32}}>关于小白AI</h1>

        <div style={{fontSize:16,color:'#ccc',lineHeight:2.2}}>
          <p style={{marginBottom:24}}>
            小白AI 是一个专为<strong style={{color:'#e8c96a'}}>零基础AI新手</strong>打造的一站式学习与导航平台。
          </p>

          <p style={{marginBottom:24}}>
            2026年，AI技术正在以前所未有的速度改变世界。我们看到太多人因为"不懂技术"、"不知道从哪开始"而被挡在AI门外。
            这不是他们的问题，而是这个行业缺少一个真正为零基础用户设计的入口。
          </p>

          <p style={{marginBottom:24}}>
            <strong style={{color:'#e8c96a'}}>小白AI的使命：</strong>让每一个普通人都能找到属于自己的AI学习路径。
            从认识AI是什么，到用AI工具提升效率，再到搭建自己的Agent工作流——
            每一阶段都有详细的教程、配套的工具推荐，以及真实的案例参考。
          </p>

          <p style={{marginBottom:24}}>
            我们相信：<strong style={{color:'#e8c96a'}}>AI不是程序员的专利，它是每个人都能掌握的技能。</strong>
            在这个时代，不会用AI不是缺陷，但没有机会学习AI是不公平的。
            小白AI就是为你搭建的那座桥。
          </p>

          <div style={{marginTop:48,padding:'24px',background:'rgba(255,255,255,0.02)',border:'1px solid #1a1a1a',borderRadius:12}}>
            <h2 style={{fontSize:18,fontWeight:700,color:'#e8c96a',marginBottom:16}}>联系方式</h2>
            <p style={{marginBottom:8}}>📧 邮箱：admin@xiaobaiai.cn</p>
            <p style={{marginBottom:8}}>💬 微信：Ghnnnnnn</p>
            <p style={{marginBottom:8}}>🌐 网址：xiaobaiai.cn</p>
            <p style={{marginTop:16,fontSize:13,color:'#888'}}>
              工具导航、技能收集、教程编写由 Agent 自动维护 + 社区贡献。<br/>
              如果你有好工具、好教程、好想法，欢迎联系投稿。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
