import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, BrainCircuit, BriefcaseBusiness, HeartPulse, Mic2, SearchCheck, Sparkles } from "lucide-react"
import { NavBar } from "@/components/NavBar"
import { BottomActionPanel } from "@/components/BottomActionPanel"
import styles from "@/components/learning/SupportPage.module.css"

export const metadata: Metadata = {
  title: "最近 AI 进化最能帮助人类的方向",
  description: "小白AI整理近期 AI 进化里对普通人、个人项目、一人公司和企业团队最有用的方向：语音、多模态、医疗、Agent、AI搜索、低成本模型和个性化学习。",
  alternates: { canonical: "/news/human-benefit" },
}

const evolutionDirections = [
  {
    icon: Mic2,
    title: "实时语音和听说能力",
    value: "不用会写提示词，也能把会议、客户沟通、学习问题和生活安排直接说给 AI。",
    scenes: ["老人和孩子用口语问问题", "销售现场自动整理客户需求", "会议结束生成纪要和待办"],
    next: "/learn/subjects/personal-growth",
  },
  {
    icon: SearchCheck,
    title: "带来源的 AI 搜索",
    value: "AI 不只给答案，还把来源、对照材料和不同观点摆出来，降低被错误信息带偏的风险。",
    scenes: ["查行业资料时保留来源", "做选品和竞品研究", "整理政策、法规和公开信息"],
    next: "/tools/AI搜索",
  },
  {
    icon: BrainCircuit,
    title: "工作 Agent 和编程 Agent",
    value: "AI 从聊天走向执行：读项目、改文件、跑检查、整理文档，把重复工作沉淀成流程。",
    scenes: ["个人做一个网页或小程序 MVP", "团队自动处理代码审查和文档", "把客服、运营、报表任务自动化"],
    next: "/agent-install",
  },
  {
    icon: HeartPulse,
    title: "医疗、照护和安全辅助",
    value: "AI 最有价值的方向不是替代专业人员，而是提醒遗漏、整理信息、辅助判断和提高服务覆盖率。",
    scenes: ["就医前整理症状和问题清单", "家庭健康记录归档", "机构用 AI 做初筛和随访提醒"],
    next: "/learn/subjects/industry-playbooks",
  },
  {
    icon: BriefcaseBusiness,
    title: "企业流程工程化",
    value: "企业 AI 进入落地阶段，重点从买账号变成梳理流程、接入数据、设定验收和保留人工复核。",
    scenes: ["客服知识库 Bot", "销售线索跟进", "财务、采购、人事资料问答"],
    next: "/learn/subjects/industry-playbooks",
  },
  {
    icon: Sparkles,
    title: "多模态内容生产",
    value: "文字、图片、视频、声音和 PPT 可以放进同一条生产线，个人也能更快做出可展示作品。",
    scenes: ["一人公司做产品介绍页", "本地商家做短视频素材", "老师和培训机构做课程包"],
    next: "/learn/subjects/content-creation",
  },
]

export default function HumanBenefitNewsPage() {
  return (
    <div className={styles.page}>
      <NavBar />
      <main className={styles.main}>
        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>Human Benefit</p>
            <h1 className={styles.title}>最近 AI 进化里，最能帮助普通人的是什么</h1>
            <p className={styles.subtitle}>
              这一页不追发布会名词，只看真实价值：能不能让个人更会学习、更快做出结果，让一人公司更轻，让团队更省时间、更稳地服务客户。
            </p>
            <div className={styles.actions}>
              <Link href="/learn" className={styles.primaryButton}>按路线学习 <ArrowRight size={14} /></Link>
              <Link href="/news" className={styles.secondaryButton}>回 AI 资讯</Link>
            </div>
          </div>
          <aside className={styles.heroAside}>
            <h2 className={styles.asideTitle}>判断标准</h2>
            <ol className={styles.steps}>
              <li><b>1</b><span>是否降低普通人使用 AI 的门槛。</span></li>
              <li><b>2</b><span>是否能落到学习、工作、生活、企业流程里。</span></li>
              <li><b>3</b><span>是否能做成可验证的小任务，而不是只停在概念。</span></li>
            </ol>
          </aside>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <p className={styles.eyebrow}>Six Directions</p>
              <h2 className={styles.panelTitle}>六个最值得普通人关注的方向</h2>
              <p className={styles.panelDesc}>每个方向都给出可以落地的场景，用户看完以后能知道下一步去哪学、去哪试。</p>
            </div>
          </div>
          <div className={styles.workflowGrid}>
            {evolutionDirections.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.title} href={item.next} className={`${styles.card} ${styles.workflowCard}`}>
                  <div className={styles.cardTop}>
                    <Icon size={24} color="#256d85" />
                    <span className={styles.tag}>可落地</span>
                  </div>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardText}>{item.value}</p>
                  <div className={styles.workflowSteps}>
                    {item.scenes.map((scene, index) => (
                      <span key={scene} className={styles.workflowStep}><b>{index + 1}</b>{scene}</span>
                    ))}
                  </div>
                  <span className={styles.cardLink}>进入对应学习 <ArrowRight size={14} /></span>
                </Link>
              )
            })}
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <p className={styles.eyebrow}>How To Use</p>
              <h2 className={styles.panelTitle}>普通人应该怎么把这些进化变成结果</h2>
              <p className={styles.panelDesc}>最稳的方式不是追最强模型，而是选一个身边真实问题，用模型、工具和任务把它做成 MVP。</p>
            </div>
          </div>
          <div className={styles.pathGrid}>
            {[
              { title: "个人在家", text: "先做知识整理、简历优化、家庭计划、内容账号或一个可展示作品。", href: "/learn/subjects/personal-growth" },
              { title: "一人公司", text: "先做产品页、获客文案、客服 FAQ、报价模板和交付复盘。", href: "/learn/subjects/business-mvp" },
              { title: "团队公司", text: "先选客服、销售、财务、人事、运营其中一个流程做 2 周试点。", href: "/learn/subjects/industry-playbooks" },
              { title: "做完复盘", text: "把工具、过程、结果、失败点沉淀到社区复盘库。", href: "/community" },
            ].map((item, index) => (
              <Link key={item.title} href={item.href} className={styles.pathCard}>
                <span className={styles.pathNumber}>{index + 1}</span>
                <strong className={styles.pathTitle}>{item.title}</strong>
                <p className={styles.pathText}>{item.text}</p>
                <span className={styles.pathAction}>进入 <ArrowRight size={13} /></span>
              </Link>
            ))}
          </div>
        </section>

        <BottomActionPanel
          title="看完趋势，下一步直接做一个小结果"
          text="不要只收藏资讯。选一个方向，进入学习路线，做出一份文档、一个客服 Bot、一个页面、一个视频样片或一个自动化流程。"
          actions={[
            { href: "/learn", label: "进入学习路线", tone: "primary" },
            { href: "/tools", label: "按任务找工具" },
            { href: "/member-cases", label: "看实战展示" },
          ]}
        />
      </main>
    </div>
  )
}
