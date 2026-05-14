import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Boxes, Building2, GraduationCap, Home, Route, ShieldCheck, Sparkles, Users } from "lucide-react"
import { NavBar } from "@/components/NavBar"
import styles from "@/components/learning/SupportPage.module.css"

export const metadata: Metadata = {
  title: "小白AI发展路线 - 从AI入门到个人、团队和行业实战",
  description: "小白AI发展路线：帮助普通人从AI入门开始，逐步完成个人创作、电商提效、团队知识库、Agent工作流和家庭生活AI实战。",
  keywords: ["小白AI发展路线", "AI学习路线", "AI实战教程", "AI行业应用", "Agent学习", "AI电商提效"],
  alternates: { canonical: "/strategy" },
  openGraph: {
    title: "小白AI发展路线",
    description: "从不会AI，到跟着小白AI做出作品、流程、知识库、Agent和行业实战结果。",
    url: "/strategy",
    images: [{ url: "/xiaobai-mascot-cutout.png", alt: "小白AI发展路线" }],
  },
}

const promises = [
  { title: "先看懂方向", text: "不让新手一进来就被工具名淹没，先知道自己该从哪条路开始。", icon: Route },
  { title: "再做出结果", text: "每个方向都尽量落到作品、表格、视频、知识库、流程或案例，而不是只收藏教程。", icon: Sparkles },
  { title: "最后能复用", text: "做完以后把提示词、材料、步骤、检查表和复盘留下来，下次可以继续升级。", icon: Boxes },
]

const directions = [
  { title: "AI入门基础", stage: "新手起点", text: "学会提问、给材料、要格式、查错误、改结果，把AI用到每天的小事里。", result: "第一份可检查的AI成果", href: "/learn/subjects/ai-basics" },
  { title: "个人创作与副业", stage: "个人方向", text: "做AI动漫、数字人、口播、短视频、小红书、公众号、简历求职和一人公司起步。", result: "可发布内容或个人服务包", href: "/learn/subjects/personal-growth" },
  { title: "电商与本地商家", stage: "经营场景", text: "把商品标题、主图、详情页、评价分析、客服话术、直播切片和店铺SOP做成任务。", result: "店铺提效清单和内容素材", href: "/learn/subjects/industry-playbooks/ecommerce-ai-store-growth" },
  { title: "团队AI提效", stage: "团队方向", text: "从知识库、客服、销售话术、会议纪要、SOP问答和运营日报开始做小试点。", result: "一个能被团队验收的流程", href: "/learn/subjects/business-ai" },
  { title: "Agent / MCP / Skill", stage: "进阶方向", text: "学习安装Agent、连接工具、使用Skill、搭建RAG，并理解多Agent协作。", result: "一个能执行任务的Agent工作流", href: "/learn/subjects/agent-coding" },
  { title: "家庭与生活AI", stage: "生活方向", text: "把家庭提醒、亲子学习、旅行计划、健康习惯、家庭日程和生活资料整理成小系统。", result: "7天家庭或生活行动卡", href: "/learn/subjects/personal-growth/family-ai-household" },
]

const roadmap = [
  { time: "第一阶段", title: "把AI用起来", text: "从一个小任务开始：写一段文字、读一份资料、整理一个表格、做一页PPT或生成一张图。" },
  { time: "第二阶段", title: "把结果做稳定", text: "学会检查AI输出，保存模板，知道哪里必须人工确认，避免每次都重新摸索。" },
  { time: "第三阶段", title: "把场景做成路线", text: "按个人、团队或行业进入对应小科目，把一个真实场景拆成材料、步骤、工具和交付物。" },
  { time: "第四阶段", title: "把经验沉淀下来", text: "把完成过程发到复盘或案例里，留下截图、提示词、踩坑和下一版改法。" },
]

const industryExamples = ["电商", "自媒体/短视频", "本地生活商家", "教育培训", "企业客服", "销售与私域", "办公行政", "软件与网站建设"]

const boundaries = [
  "AI可以帮你提效，但重要决定仍然要由人确认。",
  "涉及客户、财务、隐私、合同和公开发布的内容，要先检查再使用。",
  "行业方案必须从真实材料开始，不做只有标题和口号的空页面。",
  "Agent和自动化先从半自动开始，确认稳定后再扩大使用范围。",
]

function PromiseCard({ item }: { item: (typeof promises)[number] }) {
  const Icon = item.icon
  return (
    <article className={styles.card}>
      <div className={styles.cardTop}>
        <span className={styles.tag}><Icon size={14} /> 小白路线</span>
      </div>
      <h3 className={styles.cardTitle}>{item.title}</h3>
      <p className={styles.cardText}>{item.text}</p>
    </article>
  )
}

export default function StrategyPage() {
  return (
    <div className={styles.page}>
      <NavBar />
      <main className={styles.main}>
        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>XiaobaiAI Roadmap</p>
            <h1 className={styles.title}>小白AI发展路线</h1>
            <p className={styles.subtitle}>
              小白AI会持续把AI工具、模型、Agent和行业案例整理成普通人能跟着做的路线。你不用先研究所有工具，只要选一个最贴近自己的方向，先做出一个能看见的结果。
            </p>
            <div className={styles.actions}>
              <Link className={styles.primaryButton} href="/learn">进入学习地图</Link>
              <Link className={styles.secondaryButton} href="/tools">查看工具资源</Link>
              <Link className={styles.secondaryButton} href="/skills">查看技能库</Link>
            </div>
          </div>
          <aside className={styles.heroAside}>
            <h2 className={styles.asideTitle}>这页适合谁看</h2>
            <p className={styles.asideText}>如果你不知道小白AI后面会覆盖哪些方向，可以先看这页。它会告诉你：新手、个人创作者、小商家、团队和进阶Agent用户分别该走哪条路。</p>
            <ol className={styles.steps}>
              <li><b>1</b><span>先选自己最像的场景。</span></li>
              <li><b>2</b><span>进入对应学习路线或工具页。</span></li>
              <li><b>3</b><span>做完后把结果沉淀成案例。</span></li>
            </ol>
          </aside>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <p className={styles.eyebrow}>Promise</p>
              <h2 className={styles.panelTitle}>小白AI会坚持做什么</h2>
              <p className={styles.panelDesc}>我们不希望用户只是逛工具，而是一步一步把AI用到真实生活、工作、学习和项目里。</p>
            </div>
          </div>
          <div className={styles.grid}>
            {promises.map((item) => <PromiseCard key={item.title} item={item} />)}
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <p className={styles.eyebrow}>Directions</p>
              <h2 className={styles.panelTitle}>后续重点学习方向</h2>
              <p className={styles.panelDesc}>每个方向都不是单独页面，而是会逐步补齐教程、工具、任务、案例和复盘入口。</p>
            </div>
          </div>
          <div className={styles.resourceGrid}>
            {directions.map((direction) => (
              <Link className={styles.resourceCard} href={direction.href} key={direction.title}>
                <span className={styles.tag}>{direction.stage}</span>
                <div>
                  <h3 className={styles.cardTitle}>{direction.title}</h3>
                  <p className={styles.cardText}>{direction.text}</p>
                </div>
                <span className={styles.cardLink}>{direction.result} <ArrowRight size={14} /></span>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <p className={styles.eyebrow}>How To Grow</p>
              <h2 className={styles.panelTitle}>从学习到实战的四步</h2>
              <p className={styles.panelDesc}>不管你是普通用户、创作者、小商家还是团队成员，都按这四步走：先做小结果，再升级复杂场景。</p>
            </div>
          </div>
          <div className={styles.workflowGrid}>
            {roadmap.map((item, index) => (
              <article className={styles.card} key={item.time}>
                <span className={styles.tag}>步骤 {index + 1}</span>
                <h3 className={styles.cardTitle}>{item.time}：{item.title}</h3>
                <p className={styles.cardText}>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <p className={styles.eyebrow}>Industry Examples</p>
              <h2 className={styles.panelTitle}>会继续补深的行业例子</h2>
              <p className={styles.panelDesc}>行业内容会尽量用真实材料和任务来写，不只写概念。用户要能知道自己该准备什么、点哪里、做出什么。</p>
            </div>
            <Link className={styles.ghostButton} href="/learn/subjects/industry-playbooks">查看行业学习</Link>
          </div>
          <div className={styles.pillRow}>
            {industryExamples.map((industry) => <span className={styles.tag} key={industry}>{industry}</span>)}
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <p className={styles.eyebrow}>Safety</p>
              <h2 className={styles.panelTitle}>使用AI时要保留边界</h2>
              <p className={styles.panelDesc}>小白AI会鼓励大家使用AI，但不会把AI包装成万能替代。越是重要场景，越要保留人工确认。</p>
            </div>
          </div>
          <div className={styles.grid}>
            {boundaries.map((boundary) => (
              <article className={styles.card} key={boundary}>
                <span className={styles.tag}><ShieldCheck size={14} /> 提醒</span>
                <p className={styles.cardText}>{boundary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={`${styles.panel} ${styles.bottomActionPanel}`}>
          <div>
            <p className={styles.eyebrow}>Start Now</p>
            <h2 className={styles.panelTitle}>先从一个最小结果开始</h2>
            <p className={styles.panelDesc}>不用一次学完所有方向。先选一条路，做出第一个结果，然后再决定继续学工具、Agent、行业应用还是团队流程。</p>
          </div>
          <Link className={styles.primaryButton} href="/learn">回到开始学习</Link>
        </section>
      </main>
    </div>
  )
}
