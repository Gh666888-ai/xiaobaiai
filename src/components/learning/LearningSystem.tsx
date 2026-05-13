import Link from "next/link"
import type { ReactNode } from "react"
import {
  countTutorials,
  getAllTutorials,
  learningCatalog,
  levelLabels,
  MajorSubject,
  MinorSubject,
  TutorialItem,
  tutorialKindLabels,
} from "@/data/learning-catalog"
import { missions } from "@/data/missions"
import { NavBar } from "@/components/NavBar"
import { BackButton } from "@/components/learning/BackButton"
import styles from "./LearningSystem.module.css"

function cn(...names: Array<string | false | undefined>) {
  return names.filter(Boolean).join(" ")
}

function subjectHref(majorId: string) {
  return `/learn/subjects/${majorId}`
}

function minorHref(majorId: string, minorId: string) {
  return `/learn/subjects/${majorId}/${minorId}`
}

function tutorialHref(majorId: string, minorId: string, tutorialId: string) {
  return `/learn/tutorials/${majorId}/${minorId}/${tutorialId}`
}

function missionById(id: string) {
  return missions.find((mission) => mission.id === id)
}

function MissionPracticeCard({ id }: { id: string }) {
  const mission = missionById(id)
  if (!mission) {
    return (
      <Link className={styles.missionCard} href={`/missions/${id}`}>
        <span className={styles.missionTitle}>{id}</span>
        <span className={styles.missionText}>进入任务，按步骤完成实操。</span>
      </Link>
    )
  }

  return (
    <Link className={styles.missionCard} href={`/missions/${mission.id}`}>
      <span className={styles.tutorialMeta}>
        <span className={styles.pill}>{mission.difficulty}</span>
        <span className={styles.pill}>{mission.minutes}</span>
        <span className={styles.pill}>+{mission.xp} XP</span>
      </span>
      <span className={styles.missionTitle}>{mission.shortTitle}</span>
      <span className={styles.missionText}>{mission.outcome}</span>
      <span className={styles.missionAction}>开始实操</span>
    </Link>
  )
}

function orderedCatalog() {
  return [...learningCatalog].sort((a, b) => a.order - b.order)
}

function Hero({
  eyebrow = "XIAOBAI LEARNING SYSTEM",
  title,
  subtitle,
  children,
  id,
}: {
  eyebrow?: string
  title: string
  subtitle: string
  children?: ReactNode
  id?: string
}) {
  return (
    <section className={styles.hero} id={id}>
      <div className={styles.heroPanel}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
        {children ? <div className={styles.heroActions}>{children}</div> : null}
      </div>
      <aside className={styles.sidePanel}>
        <h2 className={styles.sideTitle}>学完能做什么</h2>
        <p className={styles.sideText}>选一个最贴近你现在生活或工作的方向，先做出能看见的结果，再继续深入。</p>
        <ol className={styles.nextList}>
          <li>
            <span className={styles.stepNumber}>1</span>
            <span>
              <span className={styles.stepTitle}>找到适合你的路</span>
              <span className={styles.stepText}>个人副业、职场提效、一人公司、团队赋能、行业变现都能直接进入。</span>
            </span>
          </li>
          <li>
            <span className={styles.stepNumber}>2</span>
            <span>
              <span className={styles.stepTitle}>做出一个结果</span>
              <span className={styles.stepText}>每个方向都会落到作品、流程、模板、知识库、自动化或业务方案。</span>
            </span>
          </li>
          <li>
            <span className={styles.stepNumber}>3</span>
            <span>
              <span className={styles.stepTitle}>让生活有变化</span>
              <span className={styles.stepText}>目标是省时间、提效率、提高收入机会，或者让团队交付更稳定。</span>
            </span>
          </li>
        </ol>
      </aside>
    </section>
  )
}

function PageFrame({ children }: { children: ReactNode }) {
  return (
    <div className={styles.page}>
      <NavBar />
      <main className={styles.main}>{children}</main>
    </div>
  )
}

function BackRow({ fallbackHref, label = "返回上一页" }: { fallbackHref: string; label?: string }) {
  return (
    <div className={styles.backRow}>
      <BackButton fallbackHref={fallbackHref} label={label} />
    </div>
  )
}

function MinorCard({ major, subject }: { major: MajorSubject; subject: MinorSubject }) {
  return (
    <Link className={styles.minorCard} href={minorHref(major.id, subject.id)}>
      <div className={styles.majorTop}>
        <span className={cn(styles.pill, styles.pillStrong)}>{levelLabels[subject.level]}</span>
        <span className={styles.pill}>约 {subject.minutes} 分钟</span>
      </div>
      <div>
        <h3 className={styles.minorTitle}>{subject.title}</h3>
        <p className={styles.minorDesc}>{subject.description}</p>
      </div>
      <p className={styles.minorGoal}>目标：{subject.goal}</p>
      <div className={styles.majorMeta}>
        <span className={styles.pill}>{subject.tutorials.length} 个教程</span>
        <span className={styles.pill}>{subject.missions.length} 个任务</span>
      </div>
    </Link>
  )
}

function LearningDiagram({ subject }: { subject?: MinorSubject }) {
  const firstTutorial = subject?.tutorials[0]
  const lastTutorial = subject?.tutorials[subject.tutorials.length - 1]
  const missionCount = subject?.missions.length || 0
  const input = subject ? subject.title : "选择方向"
  const action = firstTutorial?.title || "完成第一步"
  const output = lastTutorial?.deliverable || subject?.goal || "得到可复用结果"

  return (
    <div className={styles.diagram} aria-label="学习图示">
      <div className={styles.diagramNode}>
        <span className={styles.diagramLabel}>输入</span>
        <strong>{input}</strong>
        <p>你的目标、资料、问题或当前卡点</p>
      </div>
      <div className={styles.diagramArrow} aria-hidden="true">→</div>
      <div className={styles.diagramNode}>
        <span className={styles.diagramLabel}>学习</span>
        <strong>{action}</strong>
        <p>照着步骤做，不只看概念</p>
      </div>
      <div className={styles.diagramArrow} aria-hidden="true">→</div>
      <div className={styles.diagramNode}>
        <span className={styles.diagramLabel}>结果</span>
        <strong>{output}</strong>
        <p>{missionCount ? `${missionCount} 个任务可以继续练` : "写下复盘，进入下一步"}</p>
      </div>
    </div>
  )
}

function Breadcrumb({ items }: { items: Array<{ label: string; href?: string }> }) {
  return (
    <nav className={styles.breadcrumb} aria-label="学习路径位置">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`}>
          {item.href ? <Link href={item.href}>{item.label}</Link> : item.label}
          {index < items.length - 1 ? " / " : ""}
        </span>
      ))}
    </nav>
  )
}

export function LearningHome() {
  const catalog = orderedCatalog()
  return (
    <PageFrame>
      <Hero
        id="learn-start"
        title="小白AI 学习地图"
        subtitle="从你现在最想改变的地方开始：省时间、做作品、接单、做一人公司、让团队提效，或者把 AI 落到具体行业。"
      >
        <Link className={styles.primaryButton} href={subjectHref("ai-basics")}>我是新手，从这里开始</Link>
        <Link className={styles.secondaryButton} href="/learn/tutorials">只看教程</Link>
      </Hero>

      <section className={styles.sectionPanel}>
        <div className={styles.mapHeader}>
          <div>
            <p className={styles.eyebrow}>LEARNING TREE</p>
            <h2 className={styles.sectionTitle}>从上往下学</h2>
            <p className={styles.sectionDesc}>这张图就是开始学习的主结构。先走共同基础，再按个人在家、一人公司、团队公司和行业 AI 项目分开。</p>
          </div>
          <div className={styles.mapLegend} aria-label="路线图图例">
            <span><i className={styles.legendMain} />起点</span>
            <span><i className={styles.legendBranch} />方向</span>
            <span><i className={styles.legendNext} />项目</span>
            <span><i className={styles.legendResource} />展示入口</span>
          </div>
        </div>
        <VerticalRoadmapVisual catalog={catalog} />
      </section>

      <section className={styles.sectionPanel}>
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.eyebrow}>HOW IT WORKS</p>
            <h2 className={styles.sectionTitle}>怎么学</h2>
            <p className={styles.sectionDesc}>不用先记一堆名词。每个小科目都按“输入、学习、结果”走，普通人也能知道自己做到了哪一步。</p>
          </div>
        </div>
        <LearningDiagram />
      </section>
    </PageFrame>
  )
}

export function LearningMap() {
  const catalog = orderedCatalog()
  const majorById = new Map(catalog.map((major) => [major.id, major]))
  const start = majorById.get("ai-basics")
  const firstBranches = ["office-productivity", "content-creation", "personal-growth"]
    .map((id) => majorById.get(id))
    .filter((major): major is MajorSubject => Boolean(major))
  const skillBranches = ["agent-coding", "automation"]
    .map((id) => majorById.get(id))
    .filter((major): major is MajorSubject => Boolean(major))
  const resultBranches = ["business-ai", "industry-playbooks"]
    .map((id) => majorById.get(id))
    .filter((major): major is MajorSubject => Boolean(major))

  return (
    <PageFrame>
      <BackRow fallbackHref="/learn" label="返回学习首页" />
      <Breadcrumb items={[{ label: "学习首页", href: "/learn" }, { label: "完整路线图" }]} />
      <Hero
        eyebrow="LEARNING ROADMAP"
        title="完整路线图"
        subtitle="从第一个 AI 成果开始，逐步进入个人成长、行业落地、团队提效、自动化和 Agent 工作方式。"
      >
        <Link className={styles.primaryButton} href={subjectHref("ai-basics")}>从 AI 入门基础开始</Link>
        <Link className={styles.secondaryButton} href="/learn/tutorials">只看教程</Link>
        <Link className={styles.secondaryButton} href="/learn">返回大科目</Link>
      </Hero>

      <section className={styles.sectionPanel}>
        <div className={styles.mapHeader}>
          <div>
            <p className={styles.eyebrow}>ROADMAP WITH BRANCHES</p>
            <h2 className={styles.sectionTitle}>从起点到分支</h2>
            <p className={styles.sectionDesc}>先沿主线做出第一个结果，再按个人、内容、办公三个方向分流；后面继续进入 Agent、自动化、团队和行业落地。</p>
          </div>
          <div className={styles.mapLegend} aria-label="路线图图例">
            <span><i className={styles.legendMain} />主线</span>
            <span><i className={styles.legendBranch} />分支</span>
            <span><i className={styles.legendNext} />下一步</span>
          </div>
        </div>

        <VerticalRoadmapVisual catalog={catalog} />
      </section>
    </PageFrame>
  )
}

function RoadmapVisual({
  start,
  firstBranches,
  skillBranches,
  resultBranches,
}: {
  start?: MajorSubject
  firstBranches: MajorSubject[]
  skillBranches: MajorSubject[]
  resultBranches: MajorSubject[]
}) {
  const nodes = [
    ...(start ? [{ major: start, x: 80, y: 220, w: 190, h: 104, label: "起点" }] : []),
    ...firstBranches.map((major, index) => ({ major, x: 365, y: 64 + index * 150, w: 206, h: 118, label: index === 0 ? "办公" : index === 1 ? "内容" : "个人" })),
    ...skillBranches.map((major, index) => ({ major, x: 665, y: 144 + index * 170, w: 206, h: 118, label: index === 0 ? "Agent" : "自动化" })),
    ...resultBranches.map((major, index) => ({ major, x: 955, y: 144 + index * 170, w: 214, h: 118, label: index === 0 ? "团队" : "行业" })),
  ]
  const branchGroups = [...(start ? [start] : []), ...firstBranches, ...skillBranches, ...resultBranches]

  return (
    <div className={styles.visualMapWrap}>
      <div className={styles.visualMapCanvas} aria-label="小白AI学习路线可视图">
        <svg className={styles.visualMapLines} viewBox="0 0 1240 560" role="img" aria-label="从 AI 入门到个人、办公、内容、Agent、自动化、团队和行业落地的学习路线">
          <defs>
            <marker id="roadmap-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#256d85" />
            </marker>
          </defs>
          <path className={styles.mainLine} d="M270 272 C320 272 325 272 365 272" markerEnd="url(#roadmap-arrow)" />
          <path className={styles.branchLine} d="M318 272 C338 124 338 124 365 124" markerEnd="url(#roadmap-arrow)" />
          <path className={styles.branchLine} d="M318 272 C338 424 338 424 365 424" markerEnd="url(#roadmap-arrow)" />
          <path className={styles.mainLine} d="M571 272 C612 272 625 204 665 204" markerEnd="url(#roadmap-arrow)" />
          <path className={styles.branchLine} d="M571 272 C612 272 625 374 665 374" markerEnd="url(#roadmap-arrow)" />
          <path className={styles.mainLine} d="M871 204 C914 204 914 204 955 204" markerEnd="url(#roadmap-arrow)" />
          <path className={styles.branchLine} d="M871 374 C914 374 914 374 955 374" markerEnd="url(#roadmap-arrow)" />
          <path className={styles.branchLineSoft} d="M780 204 C850 262 885 312 955 374" markerEnd="url(#roadmap-arrow)" />
          <text x="292" y="248">学完后选分支</text>
          <text x="594" y="252">升级能力</text>
          <text x="886" y="252">进入落地</text>
        </svg>
        {nodes.map((node) => (
          <Link
            key={node.major.id}
            className={styles.visualMapNode}
            href={subjectHref(node.major.id)}
            style={{ left: node.x, top: node.y, width: node.w, minHeight: node.h, borderTopColor: node.major.color }}
          >
            <span className={styles.visualMapLabel}>{node.label}</span>
            <strong>{node.major.title}</strong>
            <span>{node.major.goal}</span>
          </Link>
        ))}
      </div>
      <div className={styles.visualMapBranchList}>
        {branchGroups.map((major) => (
          <div className={styles.visualMapBranch} key={major.id}>
            <Link href={subjectHref(major.id)}>{major.title}</Link>
            <div>
              {major.subjects.slice(0, 5).map((subject) => (
                <Link href={minorHref(major.id, subject.id)} key={subject.id}>{subject.title}</Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function VerticalRoadmapVisual({ catalog }: { catalog: MajorSubject[] }) {
  const major = (id: string) => catalog.find((item) => item.id === id)
  const routeNodes = [
    { id: "start", title: "共同起点", text: "先做出第一个 AI 成果，知道模型、工具、Agent 和工作流的区别。", href: subjectHref("ai-basics"), x: 390, y: 36, w: 220, tone: "main" },
    { id: "office", title: "办公提效", text: "PPT、文档、会议、表格，先把每天重复工作变快。", href: subjectHref("office-productivity"), x: 132, y: 190, w: 210, tone: "branch" },
    { id: "content", title: "内容创作", text: "图文、短视频、脚本、分镜，先做可发布作品。", href: subjectHref("content-creation"), x: 395, y: 190, w: 210, tone: "branch" },
    { id: "agent", title: "Agent 与自动化", text: "让 AI 帮你读项目、改文件、跑流程、发提醒。", href: subjectHref("agent-coding"), x: 660, y: 190, w: 210, tone: "branch" },
    { id: "personal", title: "个人方向", text: "适合个人在家、生活管理、职场成长和自由职业。", href: subjectHref("personal-growth"), x: 115, y: 374, w: 240, tone: "personal" },
    { id: "oneperson", title: "一人公司", text: "定位、产品、内容、销售、交付、客服、复盘，一个人跑闭环。", href: minorHref("personal-growth", "one-person-company"), x: 380, y: 374, w: 240, tone: "personal" },
    { id: "team", title: "团队公司", text: "知识库、客服、SOP、销售支持、会议纪要和自动化交付。", href: subjectHref("business-ai"), x: 645, y: 374, w: 240, tone: "team" },
    { id: "home", title: "个人在家能做", text: "居家副业、家庭管理、亲子教育、财务整理、旅行规划。", href: minorHref("personal-growth", "home-side-business"), x: 42, y: 560, w: 210, tone: "leaf" },
    { id: "solo", title: "一人公司项目", text: "接单服务、创作者工作室、个人 Agent、课程和小产品。", href: minorHref("personal-growth", "freelance-service"), x: 282, y: 560, w: 210, tone: "leaf" },
    { id: "company", title: "团队公司项目", text: "客服知识库、部门 SOP、自动日报、销售话术、培训系统。", href: subjectHref("business-ai"), x: 522, y: 560, w: 210, tone: "leaf" },
    { id: "industry", title: "行业 AI 项目", text: "餐饮、电商、教育、工厂、财税、法律、医美等行业落地。", href: subjectHref("industry-playbooks"), x: 762, y: 560, w: 210, tone: "leaf" },
    { id: "models", title: "模型选择", text: "选大脑：看场景、价格、上下文、API 和本地模型。", href: "/models", x: 30, y: 738, w: 180, tone: "resource" },
    { id: "agent-install", title: "Agent 安装", text: "装好执行工具，接上模型，再回项目里实操。", href: "/agent-install", x: 220, y: 738, w: 180, tone: "resource" },
    { id: "tools", title: "工具资源", text: "按场景找工具，服务学习、行业项目和团队提效。", href: "/tools", x: 410, y: 738, w: 180, tone: "resource" },
    { id: "cases", title: "实战展示", text: "看别人完整跑通的项目、结果、工具和踩坑。", href: "/member-cases", x: 600, y: 738, w: 180, tone: "resource" },
    { id: "community", title: "社区复盘", text: "教程和任务做完后，把问题、结果和复盘发出来。", href: "/community", x: 790, y: 738, w: 180, tone: "resource" },
  ]

  return (
    <div className={styles.verticalMapWrap}>
      <div className={styles.verticalMapCanvas} aria-label="从上往下的小白AI学习路线图">
        <svg className={styles.verticalMapLines} viewBox="0 0 1020 900" role="img" aria-label="小白AI从共同基础到个人、一人公司、团队公司和行业项目的路线图">
          <defs>
            <marker id="vertical-roadmap-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#256d85" />
            </marker>
          </defs>
          <path className={styles.verticalMainLine} d="M500 140 V168 M500 168 H236 M500 168 H500 M500 168 H765" />
          <path className={styles.verticalBranchLine} d="M236 300 C236 338 235 338 235 374" markerEnd="url(#vertical-roadmap-arrow)" />
          <path className={styles.verticalBranchLine} d="M500 300 C500 338 500 338 500 374" markerEnd="url(#vertical-roadmap-arrow)" />
          <path className={styles.verticalBranchLine} d="M765 300 C765 338 765 338 765 374" markerEnd="url(#vertical-roadmap-arrow)" />
          <path className={styles.verticalMainLine} d="M235 500 V532 M500 500 V532 M765 500 V532" />
          <path className={styles.verticalBranchLine} d="M235 532 H147 V560 M235 532 H387 V560 M500 532 H387 M500 532 H627 V560 M765 532 H627 M765 532 H867 V560" markerEnd="url(#vertical-roadmap-arrow)" />
          <path className={styles.verticalSupportLine} d="M147 686 V710 M387 686 V710 M627 686 V710 M867 686 V710 M120 710 H880 M120 710 V738 M310 710 V738 M500 710 V738 M690 710 V738 M880 710 V738" markerEnd="url(#vertical-roadmap-arrow)" />
        </svg>
        {routeNodes.map((node) => (
          <Link
            key={node.id}
            className={cn(styles.verticalMapNode, styles[`verticalMapNode_${node.tone}` as keyof typeof styles])}
            href={node.href}
            style={{ left: node.x, top: node.y, width: node.w }}
          >
            <strong>{node.title}</strong>
            <span>{node.text}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

function SubjectRouteMap({ major }: { major: MajorSubject }) {
  return (
    <div className={styles.subjectRouteMap} aria-label={`${major.title}小项目路线图`}>
      <div className={styles.subjectRouteHead}>
        <span>这个大科目怎么走</span>
        <strong>{major.subjects.length} 个小项目</strong>
      </div>
      <div className={styles.subjectRouteTrack}>
        {major.subjects.map((subject, index) => (
          <Link className={styles.subjectRouteNode} href={minorHref(major.id, subject.id)} key={subject.id}>
            <span className={styles.subjectRouteIndex}>{index + 1}</span>
            <strong>{subject.title}</strong>
            <em>{subject.goal}</em>
          </Link>
        ))}
      </div>
    </div>
  )
}

export function MajorSubjectView({ major }: { major: MajorSubject }) {
  return (
    <PageFrame>
      <BackRow fallbackHref="/learn" />
      <Breadcrumb items={[{ label: "学习首页", href: "/learn" }, { label: major.title }]} />
      <Hero eyebrow="MAJOR SUBJECT" title={major.title} subtitle={`${major.subtitle} 目标：${major.goal}`}>
        <Link className={styles.primaryButton} href={minorHref(major.id, major.subjects[0]?.id || "")}>进入第一个小科目</Link>
        <Link className={styles.secondaryButton} href="/learn/map">看完整路线图</Link>
      </Hero>

      <section className={styles.sectionPanel}>
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.eyebrow}>MINOR SUBJECTS</p>
            <h2 className={styles.sectionTitle}>小科目</h2>
            <p className={styles.sectionDesc}>选择最贴近当前目标的一步，先完成一个能检查、能复用的结果。</p>
          </div>
        </div>
        <SubjectRouteMap major={major} />
        <div className={styles.minorGrid}>
          {major.subjects.map((subject) => <MinorCard key={subject.id} major={major} subject={subject} />)}
        </div>
      </section>
    </PageFrame>
  )
}

export function MinorSubjectView({ major, subject }: { major: MajorSubject; subject: MinorSubject }) {
  return (
    <PageFrame>
      <BackRow fallbackHref={subjectHref(major.id)} />
      <Breadcrumb items={[{ label: "学习首页", href: "/learn" }, { label: major.title, href: subjectHref(major.id) }, { label: subject.title }]} />
      <Hero eyebrow="MINOR SUBJECT" title={subject.title} subtitle={`${subject.description} 目标：${subject.goal}`}>
        {subject.tutorials[0] ? <Link className={styles.primaryButton} href={tutorialHref(major.id, subject.id, subject.tutorials[0].id)}>开始第一个教程</Link> : null}
        {subject.missions[0] ? <Link className={styles.secondaryButton} href={`/missions/${subject.missions[0]}`}>直接做任务</Link> : null}
        <Link className={styles.ghostButton} href={subjectHref(major.id)}>返回大科目</Link>
      </Hero>

      <section className={styles.split}>
        <div className={styles.sectionPanel}>
          <LearningDiagram subject={subject} />
          <div className={styles.sectionHead}>
            <div>
              <p className={styles.eyebrow}>TUTORIALS</p>
              <h2 className={styles.sectionTitle}>按顺序学习这些教程</h2>
              <p className={styles.sectionDesc}>教程只解决这个小科目的核心问题。学完以后，用右侧任务验收。</p>
            </div>
          </div>
          <ol className={styles.list}>
            {subject.tutorials.map((tutorial, index) => (
              <li key={tutorial.id}>
                <Link className={styles.tutorialCard} href={tutorialHref(major.id, subject.id, tutorial.id)}>
                  <span className={styles.tutorialMeta}>
                    <span className={styles.pill}>第 {index + 1} 课</span>
                    <span className={styles.pill}>{tutorialKindLabels[tutorial.kind]}</span>
                    <span className={styles.pill}>{tutorial.minutes} 分钟</span>
                  </span>
                  <span className={styles.tutorialTitle}>{tutorial.title}</span>
                  <span className={styles.tutorialDeliverable}>交付物：{tutorial.deliverable}</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>

        <aside className={styles.sectionPanel}>
          <p className={styles.eyebrow}>PRACTICE</p>
          <h2 className={styles.sectionTitle}>学完后做任务</h2>
          <p className={styles.sectionDesc}>小白AI的学习必须落到可检查结果。这里是这个小科目的任务入口。</p>
          <div className={styles.list}>
            {subject.missions.length ? subject.missions.map((id) => (
              <MissionPracticeCard id={id} key={id} />
            )) : <div className={styles.empty}>这个小科目的任务还在补充，先完成教程并写一条复盘。</div>}
          </div>
        </aside>
      </section>
    </PageFrame>
  )
}

export function TutorialLibrary() {
  const catalog = orderedCatalog()
  const tutorialTotal = getAllTutorials().length

  return (
    <PageFrame>
      <BackRow fallbackHref="/learn" label="返回学习首页" />
      <Breadcrumb items={[{ label: "学习首页", href: "/learn" }, { label: "全部教程" }]} />
      <Hero
        eyebrow="TUTORIALS ONLY"
        title="只看教程"
        subtitle="这里不混任务，只按大科目和小科目整理教程。你可以先学习，学完再决定要不要去做实战任务。"
      >
        <Link className={styles.primaryButton} href={tutorialHref("ai-basics", "first-ai-result", "what-ai-can-do")}>从第一课开始</Link>
        <Link className={styles.secondaryButton} href="/learn/map">看路线图</Link>
      </Hero>

      <section className={styles.sectionPanel}>
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.eyebrow}>COURSE INDEX</p>
            <h2 className={styles.sectionTitle}>教程目录</h2>
            <p className={styles.sectionDesc}>共 {tutorialTotal} 个教程。教程负责讲清楚方法、步骤和交付物；任务入口单独放在小科目页里。</p>
          </div>
        </div>
        <div className={styles.tutorialLibrary}>
          {catalog.map((major) => (
            <section className={styles.tutorialMajorBlock} key={major.id}>
              <div className={styles.tutorialMajorHead} style={{ borderLeftColor: major.color }}>
                <Link href={subjectHref(major.id)}>{major.title}</Link>
                <span>{countTutorials(major)} 个教程</span>
              </div>
              <div className={styles.tutorialSubjectGrid}>
                {major.subjects.map((subject) => (
                  <div className={styles.tutorialSubjectBlock} key={subject.id}>
                    <Link className={styles.tutorialSubjectTitle} href={minorHref(major.id, subject.id)}>{subject.title}</Link>
                    <div className={styles.tutorialOnlyList}>
                      {subject.tutorials.map((tutorial, index) => (
                        <Link href={tutorialHref(major.id, subject.id, tutorial.id)} key={tutorial.id}>
                          <span>第 {index + 1} 课</span>
                          <strong>{tutorial.title}</strong>
                          <em>{tutorial.deliverable}</em>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </PageFrame>
  )
}

function lessonScenario(major: MajorSubject, subject: MinorSubject, tutorial: TutorialItem) {
  const map: Record<string, string> = {
    "agent-coding": "想让 Agent 真正读项目、改文件、跑验证的人",
    automation: "想把重复工作做成可运行流程的人",
    "business-ai": "想把 AI 落到客服、销售、SOP 和团队交付的人",
    "industry-playbooks": "想把 AI 落到具体行业、能提效或变现的人",
    "personal-growth": "想让 AI 改善收入、时间、生活和个人工作流的人",
    "office-productivity": "每天要写汇报、看文档、做表格和开会的人",
    "content-creation": "想稳定产出图文、短视频、脚本或作品的人",
  }
  return map[major.id] || `正在学习「${subject.title}」的人`
}

function buildLessonSteps(major: MajorSubject, subject: MinorSubject, tutorial: TutorialItem) {
  const base = [
    `先写清楚你现在要解决的问题：${subject.goal}`,
    `准备一个真实材料，不要用空题目练习。材料可以是文件、链接、截图、业务问题或项目目录。`,
    `按「${tutorial.title}」做一遍，只追求得到第一个可见结果。`,
    `把结果整理成「${tutorial.deliverable}」，不要只停留在聊天记录里。`,
  ]

  if (major.id === "agent-coding") {
    return [
      "先进入一个 Git 项目，确认可以看到文件树和终端。",
      "第一句话要求 Agent 只读项目、列计划、不要改文件。",
      `围绕「${tutorial.title}」只做一个小动作，改动范围越小越好。`,
      "改完先看 diff，再运行项目已有的 typecheck、test 或 build。",
      `最后把结果写成「${tutorial.deliverable}」。`,
    ]
  }

  if (major.id === "automation") {
    return [
      "先写清触发条件：什么时候开始跑，谁来确认，失败通知谁。",
      "准备一条样例数据，不要一开始接真实客户或真实付款流程。",
      `按「${tutorial.title}」搭一个三步以内的小流程。`,
      "手动运行一次，看输入、AI 处理、输出和日志是不是完整。",
      `把流程图、字段和失败处理写成「${tutorial.deliverable}」。`,
    ]
  }

  if (major.id === "business-ai" || major.id === "industry-playbooks") {
    return [
      "先选一个业务场景，不要同时改客服、销售、运营和财务。",
      "准备 10 条真实问题、3 份资料和 1 个必须人工确认的风险点。",
      `按「${tutorial.title}」做一个可测试版本。`,
      "用刁钻问题测试，记录答错、漏答和需要转人工的地方。",
      `把测试结果整理成「${tutorial.deliverable}」。`,
    ]
  }

  if (major.id === "content-creation") {
    return [
      "先定一个发布场景：小红书、短视频、公众号、课程、小说或案例页。",
      "准备受众、主题、参考风格和不想要的内容。",
      `按「${tutorial.title}」做一版样稿。`,
      "检查标题、结构、画面、事实、版权和转化目标。",
      `把可复用模板沉淀成「${tutorial.deliverable}」。`,
    ]
  }

  return base
}

function buildLessonChecks(major: MajorSubject, tutorial: TutorialItem) {
  const checks = [
    `你是否真的得到「${tutorial.deliverable}」。`,
    "结果是否能被别人看懂，而不是只有你自己知道在说什么。",
    "是否留下了下次可以复用的模板、清单或步骤。",
  ]

  if (major.id === "agent-coding") {
    return [
      "Agent 有没有先列计划再行动。",
      "文件改动是否限制在本次任务范围内。",
      "是否看过 diff，并运行了至少一个验证命令。",
      "是否说明哪些地方没有验证。",
    ]
  }

  if (major.id === "automation") {
    return [
      "触发、处理、输出、日志四块是否完整。",
      "失败时是否有提示或人工处理方式。",
      "是否先用样例数据测试，没有直接动真实业务。",
      "成本、权限和误发风险是否写清楚。",
    ]
  }

  if (major.id === "business-ai" || major.id === "industry-playbooks") {
    return [
      "是否能回答真实业务里的 10 个问题。",
      "是否标出不能回答、需要人工确认的内容。",
      "是否能带来省时间、提效率、提转化或减少错误中的至少一个结果。",
      "是否有上线前人工验收标准。",
    ]
  }

  return checks
}

function buildLessonFailures(major: MajorSubject, tutorial: TutorialItem) {
  const generic = [
    { title: "结果太空", fix: "补充真实背景、目标用户、材料来源和输出格式，再让 AI 重做一版。" },
    { title: "看起来对但不能用", fix: "要求 AI 按验收标准自检，并标出需要人工确认的事实。" },
    { title: "学完不知道下一步", fix: `先完成「${tutorial.deliverable}」，再进入右侧任务或下一课。` },
  ]

  if (major.id === "agent-coding") {
    return [
      { title: "Agent 直接改太多文件", fix: "停止继续扩展，让它只保留本轮目标相关 diff，并说明每个文件为什么要改。" },
      { title: "命令报错看不懂", fix: "把完整报错发给 Agent，让它先解释原因，再给一个最小修复动作。" },
      { title: "API Key 写进代码", fix: "立刻改成环境变量，检查 git diff，不要提交密钥。" },
    ]
  }

  if (major.id === "automation") {
    return [
      { title: "流程跑一次就断", fix: "补日志、失败重试和人工提醒，先别接生产数据。" },
      { title: "AI 输出格式乱", fix: "固定 JSON、表格或字段模板，并增加格式校验节点。" },
      { title: "自动发送风险太高", fix: "把发送动作改成人工确认，先输出草稿和预览。" },
    ]
  }

  if (major.id === "business-ai" || major.id === "industry-playbooks") {
    return [
      { title: "AI 编造业务规则", fix: "把资料来源、禁止承诺和转人工条件写进提示词或知识库说明。" },
      { title: "团队不知道怎么验收", fix: "用省时、准确率、处理量、人工接管次数四个指标做测试表。" },
      { title: "行业内容太泛", fix: "改成具体岗位、具体流程、具体输入材料和具体交付物。" },
    ]
  }

  return generic
}

function buildLessonTemplate(major: MajorSubject, subject: MinorSubject, tutorial: TutorialItem) {
  if (major.id === "agent-coding") {
    return `我要完成「${tutorial.title}」。

当前项目：
本次目标：
允许修改的范围：
不要修改的内容：
验收标准：

请先只读项目并列计划，等我确认后再行动。
完成后请告诉我：改了哪些文件、diff 风险、验证命令、还有哪些没验证。`
  }

  if (major.id === "automation") {
    return `我要把「${subject.title}」做成一个小自动化流程。

触发条件：
输入材料：
AI 要处理什么：
输出给谁：
失败时怎么提醒：
哪些步骤必须人工确认：

请先画出三步以内的流程，再给我第一版字段表。`
  }

  if (major.id === "business-ai" || major.id === "industry-playbooks") {
    return `我要把「${tutorial.title}」落到真实业务里。

行业/团队：
当前流程：
最耗时间的环节：
已有资料：
不能让 AI 自己决定的风险点：
希望得到的交付物：${tutorial.deliverable}

请先给我一个可测试 MVP，不要直接写成大方案。`
  }

  return `我要学习「${tutorial.title}」。

我的场景：
我已有的材料：
我想得到的结果：${tutorial.deliverable}
我不懂或担心的地方：

请按新手能照做的方式，先给我第一步，再给验收标准和常见错误修复。`
}

type LandingPlaybook = {
  title: string
  scenario: string
  mvp: string
  materials: string[]
  validation: string[]
  next: string
}

function buildLandingPlaybook(major: MajorSubject, subject: MinorSubject, tutorial: TutorialItem): LandingPlaybook | null {
  if (major.id === "industry-playbooks") {
    const suffix = tutorial.id.split("-").pop()
    const defaults: Record<string, Omit<LandingPlaybook, "title">> = {
      diagnosis: {
        scenario: `以「${subject.title}」的一条真实业务链路为样板，只选获客、咨询、交付、复购、管理中的一环，不要一口气改全店。`,
        mvp: "一张业务链路诊断表：当前做法、最耗时动作、AI 可接手动作、必须人工确认动作、本周先测什么。",
        materials: ["最近 10 条客户问题或订单记录", "一份现有话术/SOP/菜单/商品资料", "一个你最想减少的重复动作"],
        validation: ["能说清省下哪一步时间", "能指出哪里不能让 AI 自动决定", "能选出 1 个本周就能试的小动作"],
        next: "诊断完不要马上买工具，先进入资料整理或流程设计，把样例数据准备好。",
      },
      data: {
        scenario: `把「${subject.title}」里最常被员工、客户或自己反复问到的问题整理成资料库。`,
        mvp: "一份可导入知识库的资料包：问题、标准答案、来源、禁答边界、转人工条件。",
        materials: ["10-20 条高频问答", "产品/服务/价格/售后资料", "3 条容易答错或不能承诺的问题"],
        validation: ["资料都有来源", "不能承诺的内容标了红线", "能用 5 个真实问题测出能不能答"],
        next: "资料包做好后，进入 Dify/Coze/FastGPT 小知识库任务，先用内部测试问题验收。",
      },
      workflow: {
        scenario: `给「${subject.title}」设计一个半自动流程，先让 AI 生成草稿，人来确认后再发出。`,
        mvp: "一张流程图：触发条件、输入材料、AI 处理、人工复核、输出位置、失败提醒。",
        materials: ["一条真实样例数据", "最终要发给谁的结果格式", "失败时谁来处理的规则"],
        validation: ["流程不超过 5 步", "有人工确认点", "失败时有提示", "能用样例跑完一次"],
        next: "流程图通过后，再进 n8n/Make/Zapier 任务，不要直接接真实客户数据。",
      },
      customer: {
        scenario: `把「${subject.title}」里的客户沟通变成可复用模板，先覆盖咨询、报价、交付说明和异常处理。`,
        mvp: "一套客户沟通包：获客文案、咨询话术、交付说明、复购提醒、差评/异常处理。",
        materials: ["3 条真实客户咨询", "现有报价或服务说明", "一次售后/差评/延期案例"],
        validation: ["话术能直接发给客户", "没有夸大承诺", "能区分新客、老客和异常客户"],
        next: "沟通包完成后，选一条内容去做发布任务，或把问答沉淀进知识库。",
      },
      growth: {
        scenario: `从「${subject.title}」里选一个能带来收入、复购、省时或减少错误的动作，本周只做一版。`,
        mvp: "一张本周增长动作卡：目标、对象、动作、渠道、成本、验收数字、复盘时间。",
        materials: ["一个目标客户群", "一个可发布渠道", "一个可观察数字：咨询数/复购数/处理时长/错误数"],
        validation: ["动作能在 7 天内执行", "有一个数字能看变化", "失败后知道下次改哪里"],
        next: "执行后去复盘库写结果，下一版再考虑自动化或 Agent。",
      },
    }
    const playbook = defaults[suffix || "diagnosis"] || defaults.diagnosis
    return { title: `${subject.title}落地样板`, ...playbook }
  }

  if (major.id === "personal-growth") {
    if (subject.id === "api-proxy-side-business") {
      return {
        title: "个人多模型工作台样板",
        scenario: "适合一个人在家做小工具、自动化、知识库或一人公司服务。先跑通自己用的工作台，不要一开始卖中转服务。",
        mvp: "一个可控成本的多模型工作台：模型入口、用途分工、月预算、密钥存放方式、禁用清单。",
        materials: ["一个 API Key 或可用模型入口", "3 个常用任务：写作/资料分析/代码/客服任选", "一个月成本上限"],
        validation: ["每个模型知道用来干什么", "密钥没有写进网页或公开文档", "能查到用量", "失败时知道换模型还是换提示词"],
        next: "工作台稳定后，再进入自动化或一人公司服务，不要把客户密钥和自己的密钥混在一起。",
      }
    }

    if (subject.id === "one-person-company") {
      return {
        title: "一人公司运营台样板",
        scenario: "适合想一个人完成定位、内容、销售、交付、客服和复盘的人。先做能卖的小服务，不要先做大平台。",
        mvp: "一张 7 天执行表：卖什么、卖给谁、每天发什么、客户怎么咨询、怎么交付、怎么复盘。",
        materials: ["个人技能和资源清单", "一个目标客户群", "一个可交付的小服务", "一个发布渠道"],
        validation: ["别人一眼知道你卖什么", "有报价和交付边界", "有 1 条可发布内容", "有客户咨询后的下一步话术"],
        next: "先跑 7 天拿真实反馈，再决定补内容流水线、客服知识库还是自动化提醒。",
      }
    }

    return {
      title: `${subject.title}个人改变样板`,
      scenario: `把「${subject.title}」落到生活或工作的一件小事上，先追求省 30 分钟、少犯一次错、产出一个作品或多一个收入机会。`,
      mvp: "一个 7 天个人行动卡：目标、材料、每日动作、AI 帮忙部分、人工确认部分、复盘指标。",
      materials: ["当前最烦的一件重复事", "一份真实材料或记录", "每天能投入的时间", "一个可观察结果"],
      validation: ["7 天内能执行", "能看到生活或工作变化", "有复盘指标", "不是只收藏工具"],
      next: "完成后把做法沉淀成模板，再决定是否升级为个人 Agent 或自动化。",
    }
  }

  if (major.id === "business-ai") {
    return {
      title: "团队试点样板",
      scenario: `把「${subject.title}」放进一个团队流程里，先让 1 个岗位、1 类问题、1 个交付物跑通。`,
      mvp: "一个两周试点方案：岗位、流程、资料、工具、人工确认点、验收指标。",
      materials: ["10 条真实业务问题", "现有 SOP 或资料", "一个负责人", "一个验收数字"],
      validation: ["能减少重复沟通", "能保持人工验收", "能记录错误", "能决定继续/停止"],
      next: "试点通过后再扩大到更多岗位，不要一开始全员铺开。",
    }
  }

  if (major.id === "ai-basics") {
    return {
      title: "新手第一成果样板",
      scenario: `把「${subject.title}」变成一次能看见的结果。先不要研究模型参数，先让 AI 帮你完成一件小事。`,
      mvp: `一份可检查的小成果：${tutorial.deliverable}，并写下哪里能用、哪里还要人工修改。`,
      materials: ["一个真实问题", "一段可复制材料", "你希望最终得到的格式", "3 条验收标准"],
      validation: ["结果不是空话", "能被别人看懂", "知道事实需要自己确认", "留下下一次可复用的问法"],
      next: "完成后进入一个小任务，用真实材料再跑一遍，不要停在看懂概念。",
    }
  }

  if (major.id === "office-productivity") {
    return {
      title: "办公交付样板",
      scenario: `把「${subject.title}」落到一份真实办公材料里，目标是能交给同事、老板或客户继续修改。`,
      mvp: `一份办公交付物：${tutorial.deliverable}，附带修改清单、缺失数据和下一步行动。`,
      materials: ["原始资料或会议记录", "听众/使用者是谁", "交付格式", "必须保留的事实边界"],
      validation: ["结构清楚", "事实和猜测分开", "缺失数据已标注", "下一步行动能直接执行"],
      next: "把这一版交付物拿去做复盘，再沉淀成自己的办公模板。",
    }
  }

  if (major.id === "content-creation") {
    return {
      title: "内容发布样板",
      scenario: `把「${subject.title}」做成一条能发布、能检查、能复用的内容，不追求第一版爆款。`,
      mvp: `一份内容样稿：${tutorial.deliverable}，包含目标用户、发布渠道、素材提示和发布前检查。`,
      materials: ["目标受众", "一个真实经历/产品/观点", "参考风格", "不能夸大的边界"],
      validation: ["标题和开头能说明价值", "内容有真实细节", "配图/分镜/素材有提示", "发布前检查了版权和事实"],
      next: "发布或模拟发布后记录数据，再用复盘决定下一条内容改哪里。",
    }
  }

  if (major.id === "agent-coding") {
    return {
      title: "Agent 小改动样板",
      scenario: `把「${subject.title}」放进一个真实项目里，先让 Agent 做一件很小但能验证的事。`,
      mvp: `一个可检查的小 diff：${tutorial.deliverable}，并附上改动范围、验证命令和未验证风险。`,
      materials: ["一个 Git 项目", "一个很小的需求", "允许修改的文件范围", "typecheck/test/build 命令"],
      validation: ["Agent 先读项目再行动", "diff 没有跑偏", "至少跑过一个验证命令", "说明了没验证的部分"],
      next: "小 diff 通过后再让 Agent 做第二个任务，逐步扩大权限。",
    }
  }

  if (major.id === "automation") {
    return {
      title: "自动化小流程样板",
      scenario: `把「${subject.title}」做成一个半自动流程。第一次必须保留人工确认，不直接全自动。`,
      mvp: `一个能跑一次的小流程：${tutorial.deliverable}，包含触发、输入、AI 处理、人工确认、输出和失败提醒。`,
      materials: ["一条样例数据", "触发条件", "输出给谁", "失败时谁处理", "哪些步骤不能自动执行"],
      validation: ["能用样例跑通", "有日志或记录", "有人工确认点", "失败不会误发给客户或团队"],
      next: "样例通过后再接真实数据，并先跑一周观察稳定性。",
    }
  }

  return {
    title: `${subject.title}MVP 样板`,
    scenario: `把「${tutorial.title}」落到一个真实材料里，先做出小结果，再判断能不能继续深入。`,
    mvp: `一个可检查结果：${tutorial.deliverable}，并写清楚验收标准和下一步。`,
    materials: ["真实材料", "目标用户或使用场景", "输出格式", "验收标准"],
    validation: ["结果能看见", "标准能检查", "问题能修复", "下次能复用"],
    next: "完成后进入任务或复盘，不停在收藏教程。",
  }
}

function missionScore(id: string, major: MajorSubject, subject: MinorSubject, tutorial: TutorialItem) {
  const text = `${major.id} ${subject.id} ${tutorial.id} ${tutorial.title} ${tutorial.deliverable}`.toLowerCase()
  let score = 0

  if (subject.missions.includes(id)) score += 10
  if (id === "industry-skill-stack-plan" && /(industry|diagnosis|scope|skill|one-person|freelance|home|growth|api-proxy|cost|safety)/.test(text)) score += 14
  if (id === "industry-skill-stack-plan" && major.id === "industry-playbooks" && tutorial.id.endsWith("-diagnosis")) score += 18
  if (id === "dify-knowledge-base-bot" && /(data|knowledge|faq|source|customer|service|bot|资料|知识|客服|问答)/.test(text)) score += 14
  if (id === "dify-knowledge-base-bot" && major.id === "industry-playbooks" && tutorial.id.endsWith("-data")) score += 18
  if (id === "n8n-ai-news-automation" && /(workflow|automation|report|reminder|gateway|routing|流程|自动|提醒|日报)/.test(text)) score += 14
  if (id === "n8n-ai-news-automation" && major.id === "industry-playbooks" && tutorial.id.endsWith("-workflow")) score += 18
  if (id === "xiaohongshu-ai-content-loop" && /(content|customer|growth|menu|store|creator|publish|内容|文案|获客|发布)/.test(text)) score += 12
  if (id === "kimi-k26-long-doc" && /(doc|data|analysis|finance|legal|资料|文档|分析)/.test(text)) score += 12
  if (id === "ai-ppt-first-deck" && /(ppt|report|education|career|汇报|课程|展示)/.test(text)) score += 12
  if (id === "agent-skill-first-install" && /(agent|mcp|install|api-proxy|gateway|tool|安装|工具)/.test(text)) score += 13
  if (id === "agent-skill-first-install" && subject.id === "api-proxy-side-business" && tutorial.id === "api-proxy-first-workbench") score += 20
  if (id === "codex-small-feature" && /(codex|claude|code|mvp|diff|build|代码|项目)/.test(text)) score += 13
  if (id === "claude-code-deepseek-project" && /(claude|deepseek|code|mvp|project|项目)/.test(text)) score += 15
  if (id === "ai-comic-video-first-episode" && /(video|comic|shot|视觉|视频|分镜)/.test(text)) score += 12

  return score
}

function recommendedMissionIds(major: MajorSubject, subject: MinorSubject, tutorial: TutorialItem) {
  const globalCandidates = [
    "industry-skill-stack-plan",
    "dify-knowledge-base-bot",
    "n8n-ai-news-automation",
    "xiaohongshu-ai-content-loop",
    "kimi-k26-long-doc",
    "ai-ppt-first-deck",
    "agent-skill-first-install",
    "codex-small-feature",
    "claude-code-deepseek-project",
    "ai-comic-video-first-episode",
  ]
  const ids = Array.from(new Set([
    ...subject.missions,
    ...globalCandidates.filter((id) => missionScore(id, major, subject, tutorial) >= 12),
  ]))

  return ids.sort((a, b) => {
    const scoreDiff = missionScore(b, major, subject, tutorial) - missionScore(a, major, subject, tutorial)
    return scoreDiff || ids.indexOf(a) - ids.indexOf(b)
  }).slice(0, 4)
}

function TutorialDepthBlocks({ major, subject, tutorial }: { major: MajorSubject; subject: MinorSubject; tutorial: TutorialItem }) {
  const steps = buildLessonSteps(major, subject, tutorial)
  const checks = buildLessonChecks(major, tutorial)
  const failures = buildLessonFailures(major, tutorial)
  const template = buildLessonTemplate(major, subject, tutorial)
  const nextTutorial = subject.tutorials[subject.tutorials.findIndex((item) => item.id === tutorial.id) + 1]
  const playbook = buildLandingPlaybook(major, subject, tutorial)

  return (
    <div className={styles.deepLesson}>
      <div className={styles.visualLessonMap} aria-label="本节教程可视化流程">
        {[
          ["准备", "材料、账号、文件或业务问题"],
          ["行动", tutorial.title],
          ["验收", tutorial.deliverable],
          ["复用", nextTutorial ? `下一课：${nextTutorial.title}` : "进入任务或复盘"],
        ].map(([label, text], index) => (
          <div className={styles.visualLessonStage} key={label}>
            <span>{index + 1}</span>
            <strong>{label}</strong>
            <p>{text}</p>
          </div>
        ))}
      </div>

      <div className={styles.deepLessonGrid}>
        <section className={styles.deepLessonBlock}>
          <h3>这节课适合谁</h3>
          <p>{lessonScenario(major, subject, tutorial)}</p>
        </section>
        <section className={styles.deepLessonBlock}>
          <h3>开始前准备</h3>
          <ul>
            <li>一个真实目标：{subject.goal}</li>
            <li>一份真实材料：文件、截图、链接、业务资料或项目目录。</li>
            <li>10 到 30 分钟连续时间，先做小结果，不追求一次完美。</li>
          </ul>
        </section>
        <section className={styles.deepLessonBlock}>
          <h3>照着做</h3>
          <ol>
            {steps.map((step) => <li key={step}>{step}</li>)}
          </ol>
        </section>
        <section className={styles.deepLessonBlock}>
          <h3>怎么验收</h3>
          <ul>
            {checks.map((check) => <li key={check}>{check}</li>)}
          </ul>
        </section>
        <section className={styles.deepLessonBlock}>
          <h3>常见卡点和修法</h3>
          <div className={styles.failureList}>
            {failures.map((failure) => (
              <p key={failure.title}>
                <strong>{failure.title}</strong>
                <span>{failure.fix}</span>
              </p>
            ))}
          </div>
        </section>
        <section className={styles.deepLessonBlock}>
          <h3>二次迭代</h3>
          <p>第一版完成后，不要马上换工具。先让 AI 按验收标准找 3 个问题，再改一版。能稳定复用以后，再考虑自动化、Agent、模板库或团队交接。</p>
        </section>
      </div>

      {playbook ? (
        <section className={styles.lessonPlaybook}>
          <div>
            <p className={styles.eyebrow}>MVP PLAYBOOK</p>
            <h3>{playbook.title}</h3>
            <p>{playbook.scenario}</p>
          </div>
          <div className={styles.lessonPlaybookGrid}>
            <div>
              <strong>先做出的 MVP</strong>
              <p>{playbook.mvp}</p>
            </div>
            <div>
              <strong>需要准备</strong>
              <ul>
                {playbook.materials.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <div>
              <strong>验收标准</strong>
              <ul>
                {playbook.validation.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <div>
              <strong>下一步</strong>
              <p>{playbook.next}</p>
            </div>
          </div>
        </section>
      ) : null}

      <section className={styles.lessonPromptBox}>
        <h3>可复制模板</h3>
        <pre>{template}</pre>
      </section>
    </div>
  )
}

export function TutorialDetailView({
  major,
  subject,
  tutorial,
}: {
  major: MajorSubject
  subject: MinorSubject
  tutorial: TutorialItem
}) {
  const tutorialIndex = subject.tutorials.findIndex((item) => item.id === tutorial.id)
  const prevTutorial = subject.tutorials[tutorialIndex - 1]
  const nextTutorial = subject.tutorials[tutorialIndex + 1]
  const recommendedMissions = recommendedMissionIds(major, subject, tutorial)
  const primaryMission = recommendedMissions[0]

  return (
    <PageFrame>
      <BackRow fallbackHref={minorHref(major.id, subject.id)} label="返回小科目" />
      <Breadcrumb items={[
        { label: "学习首页", href: "/learn" },
        { label: major.title, href: subjectHref(major.id) },
        { label: subject.title, href: minorHref(major.id, subject.id) },
        { label: tutorial.title },
      ]} />
      <Hero
        eyebrow={`LESSON ${tutorialIndex + 1}`}
        title={tutorial.title}
        subtitle={`${subject.title}里的教程。预计 ${tutorial.minutes} 分钟，学完要得到：${tutorial.deliverable}`}
      >
        <Link className={styles.primaryButton} href="#tutorial-steps">开始学习</Link>
        <Link className={styles.secondaryButton} href="/learn/tutorials">只看教程目录</Link>
        <Link className={styles.ghostButton} href={minorHref(major.id, subject.id)}>返回小科目</Link>
      </Hero>

      <section className={styles.split}>
        <article className={styles.sectionPanel} id="tutorial-steps">
          <p className={styles.eyebrow}>LESSON FLOW</p>
          <h2 className={styles.sectionTitle}>这节课怎么学</h2>
          <div className={styles.lessonFlow}>
            <div>
              <span>1</span>
              <strong>先看目标</strong>
              <p>{subject.goal}</p>
            </div>
            <div>
              <span>2</span>
              <strong>照着做一次</strong>
              <p>围绕“{tutorial.title}”完成一个小结果，不追求完美，先让结果出现。</p>
            </div>
            <div>
              <span>3</span>
              <strong>检查 MVP 交付物</strong>
              <p>{tutorial.deliverable}</p>
            </div>
            <div>
              <span>4</span>
              <strong>修一遍再去实操</strong>
              <p>保存能复用的提示词、模板、清单或流程，再进入任务做一个可验证 MVP。</p>
            </div>
          </div>
          <TutorialDepthBlocks major={major} subject={subject} tutorial={tutorial} />
        </article>

        <aside className={styles.sectionPanel}>
          <p className={styles.eyebrow}>NEXT</p>
          <h2 className={styles.sectionTitle}>学完下一步</h2>
          <div className={styles.list}>
            {primaryMission ? <MissionPracticeCard id={primaryMission} /> : null}
            {prevTutorial ? <Link className={styles.missionCard} href={tutorialHref(major.id, subject.id, prevTutorial.id)}>
              <span className={styles.missionTitle}>上一课：{prevTutorial.title}</span>
              <span className={styles.missionText}>回去补前置内容。</span>
            </Link> : null}
            {nextTutorial ? <Link className={styles.missionCard} href={tutorialHref(major.id, subject.id, nextTutorial.id)}>
              <span className={styles.missionTitle}>下一课：{nextTutorial.title}</span>
              <span className={styles.missionText}>继续按顺序学，但不要忘了上面的 MVP 任务。</span>
            </Link> : recommendedMissions.length ? recommendedMissions.filter((id) => id !== primaryMission).map((id) => (
              <MissionPracticeCard id={id} key={id} />
            )) : <Link className={styles.missionCard} href={minorHref(major.id, subject.id)}>
              <span className={styles.missionTitle}>本小科目教程已学完</span>
              <span className={styles.missionText}>回到小科目页，补一个可检查任务或复盘。</span>
            </Link>}
            <Link className={styles.missionCard} href="/community">
              <span className={styles.missionTitle}>做完后发复盘</span>
              <span className={styles.missionText}>写清楚你做出了什么、哪里卡住、下一版怎么改。</span>
            </Link>
          </div>
        </aside>
      </section>
    </PageFrame>
  )
}

export function NotFoundLearningSubject() {
  return (
    <PageFrame>
      <BackRow fallbackHref="/learn" label="返回学习首页" />
      <section className={styles.sectionPanel}>
        <p className={styles.eyebrow}>NOT FOUND</p>
        <h1 className={styles.sectionTitle}>没有找到这个学习节点</h1>
        <p className={styles.sectionDesc}>可能是链接已经调整。回到学习首页重新选择大科目。</p>
        <div className={styles.heroActions}>
          <Link className={styles.primaryButton} href="/learn">返回学习首页</Link>
          <Link className={styles.secondaryButton} href="/learn/map">查看路线图</Link>
        </div>
      </section>
    </PageFrame>
  )
}
