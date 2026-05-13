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

function buildMinorActionPath(subject: MinorSubject) {
  const firstTutorial = subject.tutorials[0]
  const secondTutorial = subject.tutorials[1]
  const finalTutorial = subject.tutorials[subject.tutorials.length - 1]
  const firstMission = subject.missions[0] ? missionById(subject.missions[0]) : undefined

  return [
    {
      label: "先学",
      title: firstTutorial?.title || "看第一节教程",
      text: firstTutorial ? `先拿到：${firstTutorial.deliverable}` : "先理解这个小科目的目标和交付物。",
      href: firstTutorial ? "" : "",
      kind: "tutorial",
    },
    {
      label: "再练",
      title: secondTutorial?.title || finalTutorial?.title || "补齐关键步骤",
      text: secondTutorial ? `继续做出：${secondTutorial.deliverable}` : "把第一步结果按验收标准检查一遍。",
      href: secondTutorial ? "" : "",
      kind: "tutorial",
    },
    {
      label: "验收",
      title: firstMission?.shortTitle || "做一个可检查任务",
      text: firstMission ? firstMission.outcome : "用真实材料做一次小交付，不只收藏教程。",
      href: firstMission ? `/missions/${firstMission.id}` : "",
      kind: "mission",
    },
    {
      label: "复盘",
      title: "写下能复用的方法",
      text: "记录材料、提示词、验收标准、哪里失败、下一版怎么改。",
      href: "/community",
      kind: "recap",
    },
  ]
}

function MinorActionPath({ major, subject }: { major: MajorSubject; subject: MinorSubject }) {
  const path = buildMinorActionPath(subject)
  return (
    <section className={styles.minorActionPath}>
      <div className={styles.minorActionHead}>
        <div>
          <p className={styles.eyebrow}>WHAT TO DO NEXT</p>
          <h2>这个小科目怎么走</h2>
          <p>先学方法，再做任务验收。教程负责教会，任务负责证明你真的做出来了。</p>
        </div>
        <Link className={styles.minorActionPrimary} href={subject.missions[0] ? `/missions/${subject.missions[0]}` : "#tutorial-list"}>
          直接进入实操
        </Link>
      </div>
      <div className={styles.minorActionTrack}>
        {path.map((item, index) => {
          const tutorial = item.kind === "tutorial" ? subject.tutorials[index] || subject.tutorials[subject.tutorials.length - 1] : undefined
          const href = tutorial ? tutorialHref(major.id, subject.id, tutorial.id) : item.href || "#tutorial-list"
          return (
            <Link className={styles.minorActionNode} href={href} key={`${item.label}-${index}`}>
              <span>{index + 1}</span>
              <strong>{item.label}</strong>
              <em>{item.title}</em>
              <p>{item.text}</p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

function TutorialNextActionBand({
  major,
  subject,
  tutorial,
  nextTutorial,
  primaryMission,
}: {
  major: MajorSubject
  subject: MinorSubject
  tutorial: TutorialItem
  nextTutorial?: TutorialItem
  primaryMission?: string
}) {
  const mission = primaryMission ? missionById(primaryMission) : undefined
  return (
    <section className={styles.tutorialNextBand}>
      <div>
        <p className={styles.eyebrow}>NEXT ACTION</p>
        <h2>这节课看完以后，别停在收藏</h2>
        <p>先保存这节课的交付物，再选一个下一步。小白AI的学习目标不是看懂，而是做出一个能复用的小成果。</p>
      </div>
      <div className={styles.tutorialNextGrid}>
        {mission ? (
          <Link className={styles.tutorialNextCardPrimary} href={`/missions/${mission.id}`}>
            <span>实操验收</span>
            <strong>{mission.shortTitle}</strong>
            <p>{mission.outcome}</p>
          </Link>
        ) : null}
        {nextTutorial ? (
          <Link className={styles.tutorialNextCard} href={tutorialHref(major.id, subject.id, nextTutorial.id)}>
            <span>继续学习</span>
            <strong>{nextTutorial.title}</strong>
            <p>继续同一个小科目的下一课，但学完后仍要回到任务里验收。</p>
          </Link>
        ) : (
          <Link className={styles.tutorialNextCard} href={minorHref(major.id, subject.id)}>
            <span>回到小科目</span>
            <strong>{subject.title}</strong>
            <p>这个小科目的教程已经到尾部，回去补任务或查看其他教程。</p>
          </Link>
        )}
        <Link className={styles.tutorialNextCard} href="/community">
          <span>复盘沉淀</span>
          <strong>发布一次学习复盘</strong>
          <p>写清楚：我做出了什么、哪里卡住、下一版准备用什么方法修。</p>
        </Link>
        <Link className={styles.tutorialNextCard} href={minorHref(major.id, subject.id)}>
          <span>当前交付物</span>
          <strong>{tutorial.deliverable}</strong>
          <p>如果还没有这个结果，先回到本页步骤补完，不急着跳下一页。</p>
        </Link>
      </div>
    </section>
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

const sceneEntries = [
  {
    id: "workday-ai-boost",
    title: "我是职场人",
    subtitle: "明天上班就想省时间",
    desc: "把阅读资料、写消息、整理表格和下班复盘串成一天提效卡。",
    href: minorHref("personal-growth", "workday-ai-boost"),
    missionHref: "/missions/workday-ai-boost-plan",
    result: "职场一天 AI 提效卡",
  },
  {
    id: "student-ai-study-upgrade",
    title: "我是学生/自学者",
    subtitle: "想把一个知识点学会",
    desc: "让 AI 讲懂、出题、批改错题，再安排 3 天复习。",
    href: minorHref("personal-growth", "student-ai-study-upgrade"),
    missionHref: "/missions/student-ai-study-upgrade-plan",
    result: "3 天学习提升计划",
  },
  {
    id: "family-ai-household",
    title: "我要管家庭生活",
    subtitle: "日程、孩子、旅行、开支太乱",
    desc: "整理家人需求、时间、预算和每天动作，做 7 天家庭协作卡。",
    href: minorHref("personal-growth", "family-ai-household"),
    missionHref: "/missions/family-ai-household-plan",
    result: "家庭 7 天协作卡",
  },
  {
    id: "side-income-content-sprint",
    title: "我想做副业内容",
    subtitle: "先做一条能发布的内容",
    desc: "从目标人群、真实经历、选题、草稿到发布检查，跑一轮内容输出。",
    href: minorHref("personal-growth", "side-income-content-sprint"),
    missionHref: "/missions/side-income-content-sprint",
    result: "7 天副业内容计划",
  },
  {
    id: "one-person-company-starter",
    title: "我想做一人公司",
    subtitle: "定位、服务包、报价先成型",
    desc: "把服务定位、报价、信任内容、咨询话术和交付验收压成起步包。",
    href: minorHref("personal-growth", "one-person-company-starter"),
    missionHref: "/missions/one-person-company-starter-plan",
    result: "一人公司 7 天起步包",
  },
]

function SceneEntryGrid({ compact = false }: { compact?: boolean }) {
  return (
    <div className={cn(styles.sceneEntryGrid, compact && styles.sceneEntryGridCompact)}>
      {sceneEntries.map((entry) => (
        <article className={styles.sceneEntryCard} key={entry.id}>
          <div>
            <span className={styles.sceneEntryLabel}>{entry.subtitle}</span>
            <h3>{entry.title}</h3>
            <p>{entry.desc}</p>
          </div>
          <div className={styles.sceneEntryFooter}>
            <span>交付物：{entry.result}</span>
            <div>
              <Link href={entry.href}>看路径</Link>
              <Link href={entry.missionHref}>做任务</Link>
            </div>
          </div>
        </article>
      ))}
    </div>
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
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.eyebrow}>START BY SCENE</p>
            <h2 className={styles.sectionTitle}>按你的身份开始</h2>
            <p className={styles.sectionDesc}>如果不想先研究路线图，直接选最像自己的入口。每个入口都能落到一个可完成任务。</p>
          </div>
        </div>
        <SceneEntryGrid />
      </section>

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
    { id: "start", title: "共同起点", text: "先学会每天用 AI 做真实小事，再学提示词、上下文、搜索研究、模型和 Agent。", href: subjectHref("ai-basics"), x: 390, y: 36, w: 220, tone: "main" },
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
    { id: "opc", title: "OPC 变现试验", text: "定位、服务包、信任内容、报价、交付和复盘，先跑 7 天闭环。", href: minorHref("personal-growth", "opc-super-individual"), x: 132, y: 724, w: 230, tone: "personal" },
    { id: "visual", title: "视觉资产 MVP", text: "ComfyUI、角色场景、短剧分镜、图文配图，先做可展示素材包。", href: minorHref("content-creation", "comfyui-visual-asset-mvp"), x: 395, y: 724, w: 230, tone: "branch" },
    { id: "pipeline", title: "管道收入复购", text: "获客入口、信任内容、体验、交付、复购和转介绍。", href: minorHref("personal-growth", "pipeline-income-system"), x: 660, y: 724, w: 230, tone: "team" },
    { id: "frontier", title: "正文拆解与前沿雷达", text: "读正文，拆知识点，再判断资讯、论文、产品数据和硬件趋势该学该试还是观察。", href: minorHref("ai-basics", "ai-source-digestion"), x: 42, y: 884, w: 210, tone: "leaf" },
    { id: "knowledge-qa", title: "知识库问答", text: "把文档、教程、案例和 FAQ 变成可搜索、可追溯、可更新的问答系统。", href: minorHref("business-ai", "searchable-knowledge-qa"), x: 282, y: 884, w: 210, tone: "team" },
    { id: "multimodal", title: "音乐 3D 世界模型", text: "声音、3D、空间内容和世界模型，先做一个 30 秒概念 Demo。", href: minorHref("content-creation", "ai-music-3d-world-model"), x: 522, y: 884, w: 210, tone: "branch" },
    { id: "embodied", title: "具身与空间计算", text: "机器人、AI 硬件、VR 和空间计算，先做机会图和低成本体验计划。", href: minorHref("ai-basics", "embodied-spatial-ai-primer"), x: 762, y: 884, w: 210, tone: "leaf" },
    { id: "write", title: "会写会改", text: "消息、邮件、通知、文案和汇报段落，先写清读者、目的、材料和语气。", href: minorHref("ai-basics", "ai-writing-rewrite-training"), x: 162, y: 1084, w: 220, tone: "leaf" },
    { id: "read", title: "会读资料", text: "文章、截图、聊天记录和说明书，拆成事实、风险、问题和行动。", href: minorHref("ai-basics", "ai-reading-material-training"), x: 402, y: 1084, w: 220, tone: "leaf" },
    { id: "decide", title: "会辅助决策", text: "把纠结变成选项、标准、风险和低成本验证动作，人来拍板。", href: minorHref("ai-basics", "ai-decision-helper-training"), x: 642, y: 1084, w: 220, tone: "leaf" },
    { id: "data", title: "会整理数据", text: "账单、名单、订单和打卡记录，整理成表格、异常和待确认清单。", href: minorHref("ai-basics", "ai-table-data-cleanup"), x: 162, y: 1260, w: 220, tone: "leaf" },
    { id: "life", title: "会管理生活", text: "家庭、旅行、亲子、健康、财务和日程，拆成 7 天可执行动作。", href: minorHref("ai-basics", "ai-life-management"), x: 402, y: 1260, w: 220, tone: "leaf" },
    { id: "coach", title: "会学习陪练", text: "让 AI 讲懂、出题、讲错题、做复习表，把一个知识点学会。", href: minorHref("ai-basics", "ai-learning-coach"), x: 642, y: 1260, w: 220, tone: "leaf" },
    { id: "workday", title: "职场一天提效", text: "阅读、沟通、表格、会议和复盘，先省出 1 小时。", href: minorHref("personal-growth", "workday-ai-boost"), x: 30, y: 1440, w: 180, tone: "personal" },
    { id: "student", title: "学生学习提升", text: "讲解、出题、错题和复习表，学会一个知识点。", href: minorHref("personal-growth", "student-ai-study-upgrade"), x: 220, y: 1440, w: 180, tone: "personal" },
    { id: "family", title: "家庭管理", text: "家人需求、预算、日程和 7 天协作卡。", href: minorHref("personal-growth", "family-ai-household"), x: 410, y: 1440, w: 180, tone: "personal" },
    { id: "side-income", title: "副业内容", text: "选题、素材、草稿、发布检查和复盘。", href: minorHref("personal-growth", "side-income-content-sprint"), x: 600, y: 1440, w: 180, tone: "personal" },
    { id: "one-company-start", title: "一人公司起步", text: "定位、服务包、报价、内容和交付验收。", href: minorHref("personal-growth", "one-person-company-starter"), x: 790, y: 1440, w: 180, tone: "personal" },
    { id: "models", title: "模型选择", text: "选大脑：看场景、价格、上下文、API 和本地模型。", href: "/models", x: 30, y: 1620, w: 180, tone: "resource" },
    { id: "agent-install", title: "Agent 安装", text: "装好执行工具，接上模型，再回项目里实操。", href: "/agent-install", x: 220, y: 1620, w: 180, tone: "resource" },
    { id: "tools", title: "工具资源", text: "按场景找工具，服务学习、行业项目和团队提效。", href: "/tools", x: 410, y: 1620, w: 180, tone: "resource" },
    { id: "cases", title: "实战展示", text: "看别人完整跑通的项目、结果、工具和踩坑。", href: "/member-cases", x: 600, y: 1620, w: 180, tone: "resource" },
    { id: "community", title: "社区复盘", text: "教程和任务做完后，把问题、结果和复盘发出来。", href: "/community", x: 790, y: 1620, w: 180, tone: "resource" },
  ]

  return (
    <div className={styles.verticalMapWrap}>
      <div className={styles.verticalMapCanvas} aria-label="从上往下的小白AI学习路线图">
        <svg className={styles.verticalMapLines} viewBox="0 0 1020 1800" role="img" aria-label="小白AI从共同基础到个人、一人公司、团队公司、AI写作、AI读资料、AI辅助决策、表格整理、生活管理、学习陪练和场景套用的路线图">
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
          <path className={styles.verticalBranchLine} d="M147 686 V704 M387 686 V704 M627 686 V704 M867 686 V704 M147 704 H775 M247 704 V724 M510 704 V724 M775 704 V724" markerEnd="url(#vertical-roadmap-arrow)" />
          <path className={styles.verticalSupportLine} d="M247 850 V866 M510 850 V866 M775 850 V866 M147 866 H867 M147 866 V884 M387 866 V884 M627 866 V884 M867 866 V884" markerEnd="url(#vertical-roadmap-arrow)" />
          <path className={styles.verticalSupportLine} d="M147 1010 V1048 M387 1010 V1048 M627 1010 V1048 M867 1010 V1048 M272 1048 V1084 M512 1048 V1084 M752 1048 V1084" markerEnd="url(#vertical-roadmap-arrow)" />
          <path className={styles.verticalSupportLine} d="M272 1210 V1228 M512 1210 V1228 M752 1210 V1228 M272 1228 V1260 M512 1228 V1260 M752 1228 V1260" markerEnd="url(#vertical-roadmap-arrow)" />
          <path className={styles.verticalSupportLine} d="M272 1386 V1408 M512 1386 V1408 M752 1386 V1408 M120 1408 H880 M120 1408 V1440 M310 1408 V1440 M500 1408 V1440 M690 1408 V1440 M880 1408 V1440" markerEnd="url(#vertical-roadmap-arrow)" />
          <path className={styles.verticalSupportLine} d="M120 1566 V1588 M310 1566 V1588 M500 1566 V1588 M690 1566 V1588 M880 1566 V1588 M120 1588 H880 M120 1588 V1620 M310 1588 V1620 M500 1588 V1620 M690 1588 V1620 M880 1588 V1620" markerEnd="url(#vertical-roadmap-arrow)" />
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

      {major.id === "personal-growth" ? (
        <section className={styles.sectionPanel}>
          <div className={styles.sectionHead}>
            <div>
              <p className={styles.eyebrow}>SCENE ENTRIES</p>
              <h2 className={styles.sectionTitle}>先按场景进</h2>
              <p className={styles.sectionDesc}>个人成长不是先看一堆课程名。先选当前最想改善的场景，再进入对应小科目和实战任务。</p>
            </div>
          </div>
          <SceneEntryGrid compact />
        </section>
      ) : null}

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

      <MinorActionPath major={major} subject={subject} />

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
          <ol className={styles.list} id="tutorial-list">
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

type KnowledgeDepth = {
  concept: string
  principles: string[]
  judgment: string[]
  boundaries: string[]
  transfer: string
}

function buildKnowledgeDepth(major: MajorSubject, subject: MinorSubject, tutorial: TutorialItem): KnowledgeDepth {
  const title = tutorial.title
  const generic: KnowledgeDepth = {
    concept: `这节课真正要学的不是“让 AI 回答一次”，而是把「${title}」变成一个可判断、可复用、可迁移的方法。`,
    principles: [
      "先定义场景和目标，再选择工具。工具只是执行层，真正决定结果的是问题是否清楚、材料是否足够、验收标准是否具体。",
      "AI 的输出默认只是草稿，不是事实结论。重要内容要拆成事实、推断、建议和待确认问题。",
      "一次好结果不代表掌握。能把坏结果修好，才说明你真的理解了这个知识点。",
    ],
    judgment: [
      `如果你能说清「${tutorial.deliverable}」给谁用、解决什么问题、哪里必须人工确认，这节课才算学到位。`,
      "如果结果换一个场景就完全不会用了，说明你记住的是提示词，不是方法。",
      "如果你不知道哪里可能错，就先不要把结果交给客户、老板、家人或团队。",
    ],
    boundaries: [
      "不要把隐私、合同原文、客户手机号、API Key、付款信息直接丢给不确定的工具。",
      "不要让 AI 替你做价值判断、法律判断、医疗判断或财务承诺；它可以辅助整理，最后由人负责。",
      "不要把“说得像真的”当成正确。越流畅的答案，越要检查来源和边界。",
    ],
    transfer: "迁移方法：以后遇到任何新工具、新模型或新课程，都先问四件事：我给了什么材料、我要什么格式、用什么标准验收、失败后怎么修。",
  }

  if (subject.id === "ai-writing-rewrite-training") {
    return {
      concept: "AI 写作不是让机器替你表达，而是把读者、目的、事实、语气和行动拆清楚，再让 AI 帮你组织语言。",
      principles: [
        "写作质量首先由“读者是谁”决定。同一句话写给客户、同事、老板、家人，语气和信息顺序都不同。",
        "好提示词要包含四个块：必须说的事实、不能说的禁区、希望读者做的动作、输出长度和语气。",
        "改稿比写稿更重要。第一版负责铺开，第二版负责删废话、补事实、调语气、让读者愿意行动。",
        "AI 最容易犯的错是替你夸大、替你承诺、替你编细节，所以写作任务必须保留事实边界。",
      ],
      judgment: [
        "读者看完是否知道下一步该做什么。",
        "有没有一句话可以直接删掉而不影响意思；如果有，说明还不够精炼。",
        "事实、观点、承诺是否分开；尤其价格、效果、时间、责任不能让 AI 自己补。",
        "换成正式、温和、简洁三种语气后，核心事实是否仍然一致。",
      ],
      boundaries: [
        "涉及道歉、投诉、合同、报价、医疗、法律和财务承诺时，AI 只能打草稿，不能替你定最终说法。",
        "不要让 AI 编客户案例、用户评价、数据结果，这类内容必须来自真实材料。",
        "不要把“高级感”当目标。小白用户最需要的是清楚、可信、能行动。",
      ],
      transfer: "迁移方法：任何写作都按“读者 -> 目的 -> 事实 -> 禁区 -> 语气 -> 行动”六格卡来做。以后写邮件、通知、朋友圈、小红书、销售话术都用同一个底层框架。",
    }
  }

  if (subject.id === "ai-reading-material-training") {
    return {
      concept: "AI 读资料的核心不是压缩文字，而是把资料拆成事实、风险、问题和行动，让人能继续判断。",
      principles: [
        "先告诉 AI 你为什么读。为了写摘要、做决策、找风险、做行动清单，读法完全不同。",
        "资料分析要分层：原文事实、AI 推断、可能风险、待确认问题、下一步动作，不能混在一段话里。",
        "长文档最怕漏重点，所以要让 AI 先输出结构目录，再按你的目标提取信息。",
        "越重要的资料，越要让 AI 标注“来自哪里”和“不确定在哪里”。",
      ],
      judgment: [
        "输出里是否能看出哪些是原文事实，哪些是 AI 总结。",
        "是否列出了待确认问题，而不是假装全部都知道。",
        "行动清单是否具体到人、时间、材料和下一步。",
        "你是否能用这份结果向另一个人解释资料重点。",
      ],
      boundaries: [
        "合同、政策、医疗、投资、财务资料不能只看 AI 摘要，必须回到原文核对。",
        "资料来源不明时，不要让 AI 输出确定结论，只能输出假设和待查问题。",
        "敏感资料先脱敏，尤其姓名、手机号、身份证、客户信息、内部价格。",
      ],
      transfer: "迁移方法：以后读任何资料，都用“四张表”：事实表、风险表、问题表、行动表。这个方法能迁移到课程、会议记录、合同、说明书和聊天记录。",
    }
  }

  if (subject.id === "ai-decision-helper-training") {
    return {
      concept: "AI 辅助决策不是让 AI 替你选，而是帮你把选项、标准、风险和低成本验证动作摆清楚。",
      principles: [
        "好决策先定义标准，再比较选项。不要先问 AI 哪个好。",
        "每个选项都要看收益、成本、风险、不可逆程度和最小验证方式。",
        "AI 很擅长补盲区，但不承担后果；人必须保留最终拍板权。",
        "当信息不足时，下一步不是做决定，而是设计一个低成本验证动作。",
      ],
      judgment: [
        "你是否知道自己最看重哪 3 个标准。",
        "每个选项是否都写出了最坏情况和可撤退方式。",
        "AI 是否提出了你原来没想到的风险。",
        "最后结论是否包含“先验证什么”，而不是直接梭哈。",
      ],
      boundaries: [
        "医疗、投资、法律、重大借贷、婚姻家庭等高风险决定，AI 只能帮你整理问题和资料。",
        "AI 不知道你的全部现实处境，不要把它的排序当成命令。",
        "当你情绪很强时，先让 AI 帮你拆情绪和事实，不要马上做不可逆决定。",
      ],
      transfer: "迁移方法：以后任何纠结都先写成“我要在 A/B/C 中选择，标准是 1/2/3，限制是 X，最怕 Y”。这样 AI 才能帮你比较，而不是哄你。",
    }
  }

  if (subject.id === "ai-table-data-cleanup") {
    return {
      concept: "AI 整理数据不是让它随便排个表，而是把混乱信息变成字段、规则、异常和待确认项。",
      principles: [
        "表格的第一步是定义字段。字段不清楚，AI 会把不同类型的信息混在一起。",
        "整理数据必须保留原始信息和异常标记，不能为了整齐把不确定内容删掉。",
        "AI 适合做初步清洗、归类、格式转换和异常提示，不适合无监督地改关键数据。",
        "每次整理都要有校验样本，比如抽 5 行人工核对。",
      ],
      judgment: [
        "字段是否能被另一个人理解。",
        "异常值、缺失值、重复值是否单独标出。",
        "原始数据是否还能追溯，没有被 AI 悄悄改没。",
        "表格是否能支持下一步动作，比如统计、跟进、提醒、复盘。",
      ],
      boundaries: [
        "财务、订单、库存、工资、客户名单等关键数据不能让 AI 自动覆盖原表。",
        "不要把私人信息直接上传到不可信工具。",
        "AI 生成的分类规则要先小样本测试，再批量使用。",
      ],
      transfer: "迁移方法：以后遇到乱资料，先问四个问题：我要哪些字段、哪些算异常、哪些不能改、整理后要做什么动作。",
    }
  }

  if (subject.id === "ai-life-management") {
    return {
      concept: "AI 管理生活不是替你安排完美人生，而是把混乱的家庭、时间、预算和习惯拆成可执行的小动作。",
      principles: [
        "生活管理先选一个最乱的场景，不要一次管理全部人生。",
        "计划必须符合时间、预算、家人需求和现实约束，否则只是好看的表。",
        "AI 可以帮你拆步骤、做清单、提醒风险，但不能替家人沟通和承担责任。",
        "生活类任务要以 7 天为单位复盘，太长容易失真，太短看不出变化。",
      ],
      judgment: [
        "计划是否能在今天或明天开始执行。",
        "每个动作是否有时间、地点、材料或负责人。",
        "家人或同伴的需求是否被写进去，而不是只按你一个人的想法排。",
        "是否有复盘指标，比如少忘一件事、省多少钱、少吵一次、每天多出多少时间。",
      ],
      boundaries: [
        "健康、医疗、保险、理财等生活决策需要专业人士确认。",
        "不要把家庭隐私、孩子信息、身份证件和财务细节随便交给外部工具。",
        "AI 不能替你处理情感冲突，只能帮你准备沟通结构。",
      ],
      transfer: "迁移方法：任何生活问题都按“当前混乱点 -> 7 天目标 -> 每天动作 -> 风险提醒 -> 复盘指标”来拆。",
    }
  }

  if (subject.id === "ai-learning-coach") {
    return {
      concept: "AI 学习陪练不是让它讲一大段课，而是让它根据你的水平讲懂、出题、批改、复习。",
      principles: [
        "先告诉 AI 你的当前水平和学习目的，否则它会默认你已经懂很多。",
        "讲解必须配例子，例子必须贴近你的生活或工作场景。",
        "真正学会要能复述、能做题、能解释错题，而不是觉得答案看起来懂了。",
        "复习要间隔，不要一次性让 AI 塞满一整门课。",
      ],
      judgment: [
        "你能不能用自己的话讲出这个知识点。",
        "AI 出的题是否刚好比你当前水平难一点，而不是太简单或太难。",
        "错题是否被拆成原因，而不只是给正确答案。",
        "是否生成了 1 天、3 天、7 天的复习动作。",
      ],
      boundaries: [
        "考试、证书、专业学科不能只靠 AI，要结合教材、真题和老师/专业资料。",
        "不要让 AI 一次教完整章，先拆成一个小知识点。",
        "AI 可能讲错概念，关键定义要回到教材或权威资料核对。",
      ],
      transfer: "迁移方法：以后学任何东西，都让 AI 按“我现在会什么 -> 用例子讲 -> 出 3 道题 -> 批改错因 -> 安排复习”来陪练。",
    }
  }

  if (subject.id === "api-proxy-side-business") {
    return {
      concept: "API 中转和多模型接入的核心不是“找便宜接口”，而是管理模型入口、密钥、成本、限额、日志和风险边界。",
      principles: [
        "API Key 是账号能力的钥匙，不是普通密码。泄露以后别人可以消耗你的额度，也可能访问你绑定的模型服务。",
        "中转站负责统一入口和路由，但它不是模型本身。要分清模型提供方、中转服务、客户端工具和自己的业务数据。",
        "多模型路由的价值不是每次都用最强模型，而是按任务分配：便宜模型做初筛，强模型做关键判断，长上下文模型读资料。",
        "成本控制要先设预算和限额，再谈自动化。没有限额的自动化就是一台可能失控的扣费机器。",
      ],
      judgment: [
        "你是否知道每个模型适合什么任务，而不是只看排行榜。",
        "你是否能查到本月用了多少 token、大概花了多少钱。",
        "密钥是否只存在本地安全位置或环境变量，没有写进网页、截图、教程和公开仓库。",
        "当模型输出变差时，你能判断是模型问题、提示词问题、上下文问题，还是中转服务问题。",
      ],
      boundaries: [
        "不要把客户密钥、公司密钥和个人测试密钥混在一起。",
        "不清楚来源的中转站不要接入敏感业务、客户资料或长期自动化任务。",
        "不要把“能调通 API”包装成企业级服务，企业级还需要日志、权限、限额、审计、故障处理和数据边界。",
      ],
      transfer: "迁移方法：以后所有 API 类工具都按“五张表”判断：模型用途表、密钥存放表、成本预算表、禁用数据表、故障排查表。",
    }
  }

  if (subject.id === "agent-gateway-routing") {
    return {
      concept: "AI 网关和 MCP 网关的知识重点是“谁能调用什么、花多少钱、留下什么记录、失败谁负责”。",
      principles: [
        "API 网关管模型调用，MCP 网关管工具调用，业务网关管权限和数据边界。三者不能混成一个万能入口。",
        "Agent 能调用工具以后，风险从“回答错”升级成“做错动作”。所以工具权限要比聊天权限更严格。",
        "路由不是越自动越好。关键动作要有人工确认，尤其发送消息、改数据、付款、删除、发布和调用外部系统。",
        "日志不是给工程师看的摆设，而是出问题后能知道谁触发、调用了什么、花了多少、改了什么。",
      ],
      judgment: [
        "你是否能画出模型调用和工具调用分别走哪条链路。",
        "每个工具是否有只读/可写/危险动作分级。",
        "是否能在日志里还原一次 Agent 的完整行动。",
        "是否设置了预算、频率、失败提醒和人工接管点。",
      ],
      boundaries: [
        "不要让 Agent 默认拥有删除、付款、群发、改库、改权限等高危能力。",
        "不要把 MCP 工具当插件随便装。每个工具都等于给 Agent 开了一扇门。",
        "没有审计日志的网关，不适合企业团队或客户交付场景。",
      ],
      transfer: "迁移方法：以后设计任何 Agent 系统，都先画“模型层、工具层、权限层、日志层、人工确认层”五层图，再决定接什么工具。",
    }
  }

  if (major.id === "office-productivity") {
    return {
      concept: "办公提效的知识核心不是让 AI 多写几段话，而是把资料、对象、结论、行动和责任拆清楚，让交付物能被同事直接使用。",
      principles: [
        "办公输出先看使用对象。给老板、客户、同事、自己看的材料，结构和细节完全不同。",
        "文档、PPT、表格、会议纪要都要区分事实、判断、建议和待确认项，不能把 AI 推断写成确定结论。",
        "AI 适合先做草稿、提炼、改写、归类和检查遗漏，人负责确认事实、取舍重点和承担最终表达。",
        "办公提效要看节省了哪一步时间：找资料、整理结构、改表达、做汇总、追行动，不能只看页面好不好看。",
      ],
      judgment: [
        "交付物是否能让接收者在 30 秒内看懂重点和下一步。",
        "是否标出了资料来源、待确认问题和需要人工决定的部分。",
        "PPT 或文档是否围绕一个结论展开，而不是把所有信息平均堆上去。",
        "表格、纪要、汇报是否能继续触发行动：谁做、什么时候做、做到什么程度。",
      ],
      boundaries: [
        "涉及合同、报价、人事、财务、客户承诺和公司内部敏感资料时，AI 只能辅助草拟，不能直接定稿。",
        "不要把未经核对的数据、业绩、客户案例和政策条款写进正式材料。",
        "不要为了显得专业让 AI 堆术语。办公材料最重要的是准确、简洁、可执行。",
      ],
      transfer: "迁移方法：以后任何办公任务都按“读者是谁 -> 要做什么决定 -> 已有事实 -> AI 可帮哪一步 -> 哪些要人工确认 -> 最终行动”来拆。",
    }
  }

  if (major.id === "content-creation") {
    return {
      concept: "内容创作的知识深度不是多生成几篇稿，而是理解受众、场景、真实素材、分发渠道、版权边界和复盘指标。",
      principles: [
        "内容先有目标读者，再有选题。没有读者画像，AI 只能写出泛泛而谈的安全话。",
        "好内容来自真实素材：经历、案例、截图、数据、对话、问题和反差。AI 负责组织，不负责凭空制造可信细节。",
        "不同渠道要不同结构。小红书看开头和收藏价值，短视频看前 3 秒和画面节奏，公众号看逻辑和信任，课程看学习路径。",
        "创作不是一次生成，而是选题 -> 草稿 -> 钩子 -> 结构 -> 事实核对 -> 发布检查 -> 数据复盘的循环。",
      ],
      judgment: [
        "内容是否能让目标读者觉得“这说的就是我”。",
        "标题、开头、案例和结尾是否服务同一个核心承诺。",
        "有没有具体素材支撑，而不是只有观点和形容词。",
        "发布后能不能用点击、完播、收藏、评论、咨询、转化之一判断下一版怎么改。",
      ],
      boundaries: [
        "不要让 AI 编造亲身经历、客户反馈、收益数据、产品效果和专家背书。",
        "图片、音乐、视频素材要考虑版权和平台规则，不要默认网上能看到就能商用。",
        "热点内容要先核实来源，尤其 AI 新闻、政策、医疗、金融、法律相关内容。",
      ],
      transfer: "迁移方法：以后任何内容都用“人群 -> 痛点 -> 真实素材 -> 一个承诺 -> 渠道结构 -> 发布指标 -> 下次迭代”七格卡来做。",
    }
  }

  if (major.id === "personal-growth") {
    return {
      concept: "个人成长类 AI 学习的核心不是多收藏工具，而是把生活、工作、学习和副业里的一个真实问题变成可执行、可复盘的小系统。",
      principles: [
        "个人场景先从一天、一周、一个成果开始，不要一上来规划整个人生。",
        "AI 能帮你拆目标、做清单、改表达、设计练习和复盘，但不能替你坚持、沟通和承担选择后果。",
        "一人公司和副业要先验证需求和交付，再谈自动化、品牌和规模。",
        "个人提效必须有可感知变化：省下时间、少犯错、多产出、学得更稳、获得更多机会或收入线索。",
      ],
      judgment: [
        "这次学习是否对应一个真实生活或工作问题。",
        "是否有 7 天内能完成的小交付物，而不是一个模糊愿望。",
        "是否知道 AI 帮的是哪一步，人必须亲自做哪一步。",
        "复盘时是否能说出变化：省了多久、产出了什么、少了什么错误、下一版改哪里。",
      ],
      boundaries: [
        "不要把个人隐私、家庭信息、财务细节和身份证件直接交给不可信工具。",
        "不要把 AI 的建议当成人生决定，重大选择要结合现实资源和可信的人。",
        "副业和一人公司不要承诺 AI 自动赚钱，先做真实交付和真实反馈。",
      ],
      transfer: "迁移方法：以后任何个人 AI 应用都按“真实问题 -> 7 天目标 -> AI 可帮步骤 -> 人工确认点 -> 可见成果 -> 复盘指标”来做。",
    }
  }

  if (major.id === "agent-coding") {
    return {
      concept: "Agent 的知识深度不在于它能不能自动写代码，而在于你能不能控制它的目标、权限、上下文、改动范围和验证方式。",
      principles: [
        "模型负责思考和生成，Agent 负责读文件、改文件、跑命令、调用工具。模型不是 Agent，Agent 也不是万能员工。",
        "Agent 最怕目标太大、上下文太乱、权限太宽。好用法是小目标、窄范围、先读后改、每步验证。",
        "工程 Agent 的核心循环是：读项目 -> 列计划 -> 小改动 -> 看 diff -> 跑验证 -> 说明风险。",
        "CLAUDE.md、AGENTS.md、项目规则和权限白名单，本质上是给 Agent 的公司制度。",
      ],
      judgment: [
        "Agent 是否先理解项目结构，而不是一上来改文件。",
        "本次改动是否能用 diff 解释清楚，是否只触碰必要文件。",
        "是否跑过 typecheck、lint、test、build 或至少一个可信验证。",
        "它是否说清楚未验证风险，而不是只说完成了。",
      ],
      boundaries: [
        "不要让 Agent 处理密钥、付款、生产数据、用户隐私和高危系统权限。",
        "不要同时让多个 Agent 改同一批文件，容易互相覆盖。",
        "不要把大需求一次性丢给 Agent。先拆成可验证的小改动。",
      ],
      transfer: "迁移方法：任何工程 Agent 都按“小范围授权 + 明确验收 + diff 复核 + 验证命令 + 风险说明”来用，不管它叫 Codex、Claude Code、Cursor 还是别的名字。",
    }
  }

  if (major.id === "automation") {
    return {
      concept: "自动化的知识核心不是把按钮串起来，而是把触发、输入、处理、人工确认、输出、失败处理和日志设计清楚。",
      principles: [
        "流程先半自动，再自动。第一次必须保留人工确认，尤其涉及客户、金钱、公开发布和团队通知。",
        "每个节点都要知道输入是什么、输出是什么、失败时怎么办。",
        "AI 节点最需要固定输出格式，否则后面的节点会因为格式不稳定而断掉。",
        "真正可用的自动化一定有日志、重试、提醒和停止开关。",
      ],
      judgment: [
        "流程能否用一条样例数据完整跑通。",
        "失败时谁知道、谁处理、怎么恢复。",
        "AI 输出是否固定成 JSON、表格、字段或模板。",
        "有没有误发、重复发、无限循环、成本失控的风险。",
      ],
      boundaries: [
        "不要一上来接真实客户群发、付款、删数据、改数据库。",
        "不要让 AI 自动决定高风险动作，它只能生成草稿或建议。",
        "没有日志的流程不要上线，因为出错后无法复盘。",
      ],
      transfer: "迁移方法：以后任何自动化都用“触发 -> 处理 -> 人工确认 -> 输出 -> 失败提醒 -> 日志”六段式来设计。",
    }
  }

  if (major.id === "business-ai" || major.id === "industry-playbooks") {
    return {
      concept: "企业和行业 AI 落地不是把工具装进公司，而是把一个岗位、一个流程、一个交付物先跑通，再用指标判断是否值得扩大。",
      principles: [
        "行业 AI 必须从具体岗位和具体流程开始。餐饮、教育、电商、法律、财税、医美都不是一个提示词能解决的。",
        "企业 AI 的第一目标通常不是炫技，而是省时间、减少错误、提高响应速度、提高转化或沉淀知识。",
        "知识库、客服 Bot、销售助手、SOP Agent 都必须有资料来源、禁答边界和人工转接条件。",
        "试点要小，指标要清楚。先用 10 到 50 条真实样本测试，再决定是否扩到团队。",
      ],
      judgment: [
        "是否明确了哪个岗位、哪类问题、哪份材料、哪个交付物。",
        "是否能用省时、准确率、处理量、转化率、人工接管次数之一验收。",
        "AI 不知道或不能回答时，是否会明确转人工。",
        "是否记录了失败案例，并把失败案例反哺到资料、提示词或流程里。",
      ],
      boundaries: [
        "不要承诺 AI 替代员工，先承诺减少重复劳动和提高交付稳定性。",
        "不要让 AI 独自处理法律、财务、医疗、投诉赔付和重大客户承诺。",
        "不要用演示数据证明上线可行，必须用脱敏真实样本测试。",
      ],
      transfer: "迁移方法：任何行业都按“岗位 -> 重复问题 -> 资料来源 -> AI 可接手动作 -> 人工确认点 -> 验收指标 -> 复盘更新”七步拆。",
    }
  }

  if (major.id === "ai-basics") {
    return {
      ...generic,
      concept: "AI 入门真正要建立的是判断力：知道什么时候给材料、什么时候要格式、什么时候验收、什么时候必须人工确认。",
      principles: [
        "模型负责生成可能答案，工具负责承载功能，Agent 负责连续执行任务，工作流负责把步骤串起来。不要把它们混成一个词。",
        "提示词不是咒语，而是任务说明书。说明书越清楚，输出越稳定。",
        "AI 能提高起步速度，但不能自动保证正确；验收标准永远要由人设定。",
      ],
      judgment: [
        "你能不能说清这次用的是模型、工具、Agent 还是工作流。",
        "你有没有给 AI 足够材料，而不是只问一句空问题。",
        "你有没有让 AI 输出成可检查格式，比如表格、清单、步骤、对比。",
      ],
      boundaries: [
        "不确定来源的工具先不要上传隐私材料。",
        "不知道结果对不对时，不要直接转发给别人当结论。",
        "不要为了追热点频繁换工具，先把一个方法练熟。",
      ],
      transfer: "迁移方法：任何 AI 新玩法都先放进四类里看：模型、工具、Agent、工作流。分清它是哪类，再决定学不学、怎么用。",
    }
  }

  return generic
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
  const knowledge = buildKnowledgeDepth(major, subject, tutorial)

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

      <section className={styles.knowledgeDepth}>
        <div className={styles.knowledgeDepthIntro}>
          <p className={styles.eyebrow}>KNOWLEDGE DEPTH</p>
          <h3>这节课真正要懂什么</h3>
          <p>{knowledge.concept}</p>
        </div>
        <div className={styles.knowledgeDepthGrid}>
          <div>
            <strong>底层原理</strong>
            <ul>
              {knowledge.principles.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div>
            <strong>判断标准</strong>
            <ul>
              {knowledge.judgment.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div>
            <strong>边界和误区</strong>
            <ul>
              {knowledge.boundaries.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div className={styles.knowledgeTransfer}>
            <strong>迁移方法</strong>
            <p>{knowledge.transfer}</p>
          </div>
        </div>
      </section>

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

      <TutorialNextActionBand
        major={major}
        subject={subject}
        tutorial={tutorial}
        nextTutorial={nextTutorial}
        primaryMission={primaryMission}
      />
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
