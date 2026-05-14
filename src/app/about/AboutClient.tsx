"use client"

import Link from "next/link"
import { ArrowRight, BarChart3, Mail, MessageCircle, Route, Users } from "lucide-react"
import { NavBar } from "@/components/NavBar"
import styles from "@/components/learning/SupportPage.module.css"

const principles = [
  { title: "普通人能看懂", text: "不把 AI 讲成技术炫耀，先让用户知道自己下一步该做什么。", icon: Route },
  { title: "必须落到结果", text: "学习内容要能产出 PPT、表格、海报、视频、知识库、Agent 或行业流程。", icon: ArrowRight },
  { title: "真实复盘优先", text: "社区和案例优先展示做过的过程、结果、截图、踩坑和修法。", icon: Users },
]

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <NavBar />
      <main className={styles.main}>
        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>About XiaobaiAI</p>
            <h1 className={styles.title}>小白AI 做的是普通人的 AI 学习地图</h1>
            <p className={styles.subtitle}>
              AI 工具、模型、Agent 和自动化更新太快。小白AI 把它们整理成能执行的路线、教程、任务和案例，让个人、团队和行业用户知道从哪里开始，怎么做到结果。
            </p>
            <div className={styles.actions}>
              <Link href="/learn" className={styles.primaryButton}>进入学习地图</Link>
              <Link href="/member-cases" className={styles.secondaryButton}>看实战展示</Link>
              <Link href="/strategy" className={styles.secondaryButton}>看发展路线</Link>
              <Link href="/community" className={styles.secondaryButton}>去社区复盘</Link>
            </div>
          </div>
          <aside className={styles.heroAside}>
            <h2 className={styles.asideTitle}>我们坚持的顺序</h2>
            <ol className={styles.steps}>
              <li><b>1</b><span>先让用户看懂方向。</span></li>
              <li><b>2</b><span>再给教程和可操作任务。</span></li>
              <li><b>3</b><span>最后沉淀真实案例和复盘。</span></li>
            </ol>
          </aside>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <p className={styles.eyebrow}>Position</p>
              <h2 className={styles.panelTitle}>不是工具目录，是学习和落地系统</h2>
              <p className={styles.panelDesc}>用户不需要先背概念。用户需要知道：我现在适合学哪一块，学完能做什么，卡住了怎么修，做完后怎么复盘。</p>
            </div>
          </div>
          <div className={styles.grid}>
            {principles.map((item) => {
              const Icon = item.icon
              return (
                <article key={item.title} className={styles.card}>
                  <div className={styles.cardTop}>
                    <span className={styles.tag}><Icon size={14} /> 小白标准</span>
                  </div>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardText}>{item.text}</p>
                </article>
              )
            })}
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <p className={styles.eyebrow}>Roadmap</p>
              <h2 className={styles.panelTitle}>小白AI会继续补深哪些方向</h2>
              <p className={styles.panelDesc}>小白AI会围绕普通人AI基础、个人创作、电商与本地商家、团队提效、Agent / MCP / Skill、家庭生活AI六条线继续补深。每条线都会尽量配上教程、工具、任务、案例和复盘入口。</p>
            </div>
            <Link href="/strategy" className={styles.primaryButton}>查看发展路线</Link>
          </div>
          <div className={styles.grid}>
            <article className={styles.card}>
              <span className={styles.tag}><BarChart3 size={14} /> 近期重点</span>
              <h3 className={styles.cardTitle}>先跑个人、电商和内容场景</h3>
              <p className={styles.cardText}>这些场景需求具体、容易看到结果，适合先沉淀模板、任务和真实案例。</p>
            </article>
            <article className={styles.card}>
              <span className={styles.tag}><Users size={14} /> 中期重点</span>
              <h3 className={styles.cardTitle}>再进入企业知识库和客服</h3>
              <p className={styles.cardText}>团队场景从一个岗位、一个流程、一个交付物开始，用省时、准确率和人工接管次数验收。</p>
            </article>
            <article className={styles.card}>
              <span className={styles.tag}><Route size={14} /> 长期重点</span>
              <h3 className={styles.cardTitle}>形成Skill和Agent生态</h3>
              <p className={styles.cardText}>用户不只是看教程，而是能选择技能、装到Agent、完成行业工作流。</p>
            </article>
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <p className={styles.eyebrow}>Co-create</p>
              <h2 className={styles.panelTitle}>开放共创</h2>
              <p className={styles.panelDesc}>如果你有工具、教程、真实 AI 案例、行业资源、企业客户、内容渠道或产品能力，可以一起把 AI 学习和落地做得更清楚。</p>
            </div>
            <Link href="/community/new" className={styles.primaryButton}>提交内容</Link>
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <p className={styles.eyebrow}>Contact</p>
              <h2 className={styles.panelTitle}>联系方式</h2>
              <p className={styles.panelDesc}>好工具、好教程、真实案例、合作资源，都可以从这里联系。</p>
            </div>
          </div>
          <div className={styles.grid}>
            <article className={styles.card}>
              <span className={styles.tag}><Mail size={14} /> 邮箱</span>
              <h3 className={styles.cardTitle}>admin@xiaobaiai.cn</h3>
              <p className={styles.cardText}>适合合作、资料、授权、企业需求。</p>
            </article>
            <article className={styles.card}>
              <span className={styles.tag}><MessageCircle size={14} /> 微信</span>
              <h3 className={styles.cardTitle}>Ghnnnnnn</h3>
              <p className={styles.cardText}>适合直接沟通合作和资源对接。</p>
            </article>
            <article className={styles.card}>
              <span className={styles.tag}>网址</span>
              <h3 className={styles.cardTitle}>xiaobaiai.cn</h3>
              <p className={styles.cardText}>小白AI 会继续围绕更好懂、更好用、更能落地更新。</p>
            </article>
          </div>
        </section>
      </main>
    </div>
  )
}
