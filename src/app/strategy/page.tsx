import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, BarChart3, Boxes, BriefcaseBusiness, Building2, GraduationCap, Route, ShieldCheck, Sparkles, Users } from "lucide-react"
import { NavBar } from "@/components/NavBar"
import styles from "@/components/learning/SupportPage.module.css"

export const metadata: Metadata = {
  title: "小白AI后期领域规划与商业报告",
  description: "小白AI后期领域规划、商业化路径、行业优先级和阶段路线：从AI实战学习、个人副业、电商、本地商家到企业知识库、客服和Agent工作流。",
  keywords: ["小白AI商业规划", "AI学习平台商业模式", "AI工具站变现", "AI行业落地", "Agent工作流", "AI电商提效"],
  alternates: { canonical: "/strategy" },
  openGraph: {
    title: "小白AI后期领域规划与商业报告",
    description: "把小白AI从工具导航升级为AI实战学习、任务交付、行业落地和企业服务平台。",
    url: "/strategy",
    images: [{ url: "/xiaobai-mascot-cutout.png", alt: "小白AI领域规划与商业报告" }],
  },
}

const positioning = [
  { title: "不是工具目录", text: "工具目录容易被复制。小白AI真正要沉淀的是路线、任务、模板、复盘和行业案例。", icon: Boxes },
  { title: "不是普通课程站", text: "课程只解决“看懂”。小白AI要解决“跟着做出一个结果，并知道下一步怎么升级”。", icon: GraduationCap },
  { title: "不是企业PPT", text: "企业AI落地不从大词开始，而是从一个岗位、一个流程、一个交付物和一组验收指标开始。", icon: Building2 },
]

const domains = [
  { title: "普通人AI基础", stage: "流量根基", text: "AI入门、提示词、资料阅读、写作改稿、PPT、表格、搜索、学习陪练和生活管理。", revenue: "免费流量、低价模板、会员转化", href: "/learn/subjects/ai-basics" },
  { title: "个人创作与副业", stage: "低价付费", text: "AI动漫、数字人、口播、短视频、小红书、公众号、简历求职、个人IP和一人公司。", revenue: "训练营、模板包、素材包、案例拆解", href: "/learn/subjects/personal-growth" },
  { title: "电商与本地商家", stage: "强变现", text: "商品标题、主图、详情页、评价分析、客服话术、直播切片、店铺SOP和私域内容。", revenue: "行业包、店铺诊断、AI客服代搭", href: "/learn/subjects/industry-playbooks/ecommerce-ai-store-growth" },
  { title: "中小企业AI提效", stage: "高客单", text: "企业知识库、客服Bot、销售话术库、会议纪要、SOP问答、运营日报和财务法务初筛。", revenue: "企业培训、咨询、代搭、年费维护", href: "/learn/subjects/business-ai" },
  { title: "Agent / MCP / Skill", stage: "技术护城河", text: "Codex、Claude Code、OpenClaw、MCP、RAG、SessionStore、Managed Agents和技能库。", revenue: "进阶会员、Agent搭建、团队工作流改造", href: "/learn/subjects/agent-coding" },
  { title: "家庭与生活AI", stage: "品牌温度", text: "家庭提醒、老人用药、亲子学习、家庭日程、旅行计划、健康习惯和小白守护家案例。", revenue: "小程序引流、家庭模板、长期信任", href: "/learn/subjects/personal-growth/family-ai-household" },
]

const revenueLayers = [
  { title: "免费流量层", text: "SEO、资讯解读、工具页、教程页、飞书知识库、知乎、小红书、短视频切片，先建立信任和收录。", icon: BarChart3 },
  { title: "低价数字产品", text: "19-99元模板包、提示词包、电商标题包、短视频脚本包、AI办公模板和行业检查清单。", icon: Sparkles },
  { title: "会员订阅", text: "完整学习路线、任务记录、模板库、案例库、Skill教程、复盘权益和进阶训练。", icon: Users },
  { title: "高客单服务", text: "企业知识库、客服Bot、Dify/FastGPT/Coze/n8n工作流、Agent/MCP接入和团队内训。", icon: BriefcaseBusiness },
]

const roadmap = [
  { time: "0-3个月", title: "打牢学习与搜索入口", text: "优化开始学习、工具资源、Skills、资讯、任务库和SEO页面。目标是收录、点击、停留和任务开始率。" },
  { time: "3-6个月", title: "跑通个人与电商强场景", text: "重点做AI创作、AI口播、AI动漫、小红书、一人公司、电商商品图、客服和评价分析。" },
  { time: "6-12个月", title: "进入企业轻交付", text: "做企业知识库、客服Bot、销售话术库、会议纪要、SOP问答和Agent工作流试点。" },
  { time: "12个月后", title: "形成Skill和Agent生态", text: "让用户从看教程升级为选择Skill、安装到Agent、完成行业工作流，形成长期护城河。" },
]

const priorityIndustries = ["电商", "自媒体/短视频", "本地生活商家", "教育培训", "企业客服", "销售与私域", "办公行政", "软件与网站建设"]

const risks = [
  "不要把小白AI做成只会堆工具的目录站。",
  "不要过早做复杂SaaS，先用任务、模板、案例和交付验证付费。",
  "行业页面不能只有行业名，必须有场景、材料、步骤、交付物、验收标准和下一步。",
  "企业AI必须保留权限、日志、人工确认、数据边界和失败回滚，不要承诺全自动。",
]

function IconCard({ item }: { item: (typeof positioning)[number] }) {
  const Icon = item.icon
  return (
    <article className={styles.card}>
      <div className={styles.cardTop}>
        <span className={styles.tag}><Icon size={14} /> 定位</span>
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
            <p className={styles.eyebrow}>Strategy Report</p>
            <h1 className={styles.title}>小白AI后期领域规划与商业报告</h1>
            <p className={styles.subtitle}>
              小白AI后期不做单纯工具导航，而是做普通人、个体创业者、小商家和中小团队的AI实战入口：先教会，再带做，再沉淀案例，最后卖模板、会员、训练营和企业交付。
            </p>
            <div className={styles.actions}>
              <Link className={styles.primaryButton} href="/learn">进入学习路线</Link>
              <Link className={styles.secondaryButton} href="/tools">查看工具资源</Link>
              <Link className={styles.secondaryButton} href="/skills">查看技能库</Link>
            </div>
          </div>
          <aside className={styles.heroAside}>
            <h2 className={styles.asideTitle}>一句话战略</h2>
            <p className={styles.asideText}>从“AI工具大全”升级为“AI实战学习与任务交付平台”。用户不是来逛工具，而是来完成一个能看见、能复盘、能升级的结果。</p>
            <ol className={styles.steps}>
              <li><b>1</b><span>免费内容拿流量和信任。</span></li>
              <li><b>2</b><span>任务、模板和案例提高留存。</span></li>
              <li><b>3</b><span>个人付费与企业交付形成收入。</span></li>
            </ol>
          </aside>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <p className={styles.eyebrow}>Position</p>
              <h2 className={styles.panelTitle}>商业定位</h2>
              <p className={styles.panelDesc}>小白AI的护城河不是工具数量，而是把工具、教程、任务、案例、复盘和行业方案连成一条能落地的路径。</p>
            </div>
          </div>
          <div className={styles.grid}>
            {positioning.map((item) => <IconCard key={item.title} item={item} />)}
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <p className={styles.eyebrow}>Domains</p>
              <h2 className={styles.panelTitle}>后期重点领域</h2>
              <p className={styles.panelDesc}>领域不是越多越好，先围绕流量、付费、企业交付和技术护城河分层推进。</p>
            </div>
          </div>
          <div className={styles.resourceGrid}>
            {domains.map((domain) => (
              <Link className={styles.resourceCard} href={domain.href} key={domain.title}>
                <span className={styles.tag}>{domain.stage}</span>
                <div>
                  <h3 className={styles.cardTitle}>{domain.title}</h3>
                  <p className={styles.cardText}>{domain.text}</p>
                </div>
                <span className={styles.cardLink}>{domain.revenue} <ArrowRight size={14} /></span>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <p className={styles.eyebrow}>Business Model</p>
              <h2 className={styles.panelTitle}>四层收入结构</h2>
              <p className={styles.panelDesc}>前期不要急着硬卖大课。先靠免费资产获取用户，再用小产品验证付费，最后进入高客单交付。</p>
            </div>
          </div>
          <div className={styles.grid}>
            {revenueLayers.map((layer) => {
              const Icon = layer.icon
              return (
                <article className={styles.card} key={layer.title}>
                  <span className={styles.tag}><Icon size={14} /> 收入层</span>
                  <h3 className={styles.cardTitle}>{layer.title}</h3>
                  <p className={styles.cardText}>{layer.text}</p>
                </article>
              )
            })}
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <p className={styles.eyebrow}>Roadmap</p>
              <h2 className={styles.panelTitle}>阶段路线</h2>
              <p className={styles.panelDesc}>先做轻、做准、做出真实案例，再逐步升级企业交付和Agent生态。</p>
            </div>
          </div>
          <div className={styles.workflowGrid}>
            {roadmap.map((item, index) => (
              <article className={styles.card} key={item.time}>
                <span className={styles.tag}>阶段 {index + 1}</span>
                <h3 className={styles.cardTitle}>{item.time}：{item.title}</h3>
                <p className={styles.cardText}>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <p className={styles.eyebrow}>Industry Focus</p>
              <h2 className={styles.panelTitle}>优先切入行业</h2>
              <p className={styles.panelDesc}>先做有真实需求、容易看到结果、愿意付费的行业。每个行业都必须落到任务和交付物。</p>
            </div>
            <Link className={styles.ghostButton} href="/learn/subjects/industry-playbooks">查看行业学习</Link>
          </div>
          <div className={styles.pillRow}>
            {priorityIndustries.map((industry) => <span className={styles.tag} key={industry}>{industry}</span>)}
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <p className={styles.eyebrow}>Risk Boundary</p>
              <h2 className={styles.panelTitle}>风险边界</h2>
              <p className={styles.panelDesc}>小白AI要敢做商业化，但不能为了变现牺牲可信度。越是企业和Agent场景，越要讲清边界。</p>
            </div>
          </div>
          <div className={styles.grid}>
            {risks.map((risk) => (
              <article className={styles.card} key={risk}>
                <span className={styles.tag}><ShieldCheck size={14} /> 边界</span>
                <p className={styles.cardText}>{risk}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={`${styles.panel} ${styles.bottomActionPanel}`}>
          <div>
            <p className={styles.eyebrow}>Next Asset</p>
            <h2 className={styles.panelTitle}>把规划变成页面、任务和案例</h2>
            <p className={styles.panelDesc}>这份报告不是摆设。后续每次新增领域，都要同步补学习路线、工具入口、Skill、任务模板、案例复盘和商业化动作。</p>
          </div>
          <Link className={styles.primaryButton} href="/learn">回到开始学习</Link>
        </section>
      </main>
    </div>
  )
}
