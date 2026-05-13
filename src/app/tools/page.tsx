import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Bot, Boxes, ListTree, Puzzle, Search, TerminalSquare } from "lucide-react"
import { tools, categories } from "@/data/tools"
import { categoryPath } from "@/data/tool-meta"
import { NavBar } from "@/components/NavBar"
import { CategoryIcon } from "@/components/CategoryIcon"
import styles from "@/components/learning/SupportPage.module.css"

export const metadata: Metadata = {
  title: "AI工具导航大全 - ChatGPT、DeepSeek、AI绘图、AI编程工具分类推荐",
  description: "小白AI工具导航大全精选数百个真实主流 AI 工具，按对话AI、AI绘图、AI视频、AI写作、AI编程、AI办公、AI搜索、Agent平台和模型平台分类推荐，适合新手快速找到能用的 AI 工具。",
  keywords: ["AI工具导航", "AI工具大全", "AI工具推荐", "ChatGPT", "DeepSeek", "AI绘图工具", "AI编程工具", "Agent平台"],
  alternates: { canonical: "/tools" },
  openGraph: {
    title: "AI工具导航大全 | 小白AI",
    description: "按场景浏览真实主流 AI 工具，先选分类，再看详情、免费情况、中文支持和新手推荐。",
    url: "/tools",
    images: [{ url: "/xiaobai-mascot-cutout.png", width: 1071, height: 1468, alt: "小白AI 工具导航" }],
  },
}

const categoryIntro: Record<string, string> = {
  对话AI: "日常问答、写作、翻译、文件分析和个人助手，新手最该先试。",
  AI绘图: "生成海报、头像、插画、电商图和概念设计，适合创意内容生产。",
  AI视频: "文生视频、图生视频、数字人、口播和短视频自动化。",
  AI写作: "文章、营销文案、论文辅助、SEO 内容和社媒笔记。",
  AI编程: "代码补全、项目生成、Bug 修复、代码审查和编程 Agent。",
  AI办公: "文档、PPT、表格、会议纪要、合同审查和知识库问答。",
  AI搜索: "联网搜索、研究报告、学术检索和带来源的答案整理。",
  Agent平台: "编程执行 Agent、模型后端、开源 Agent、自动客服、工作流和多 Agent 协作。",
  模型平台: "API 接入、本地模型、模型托管、推理服务和模型社区。",
  AI音频: "配音、语音识别、音乐生成、音频增强和声音克隆。",
  AI设计: "Logo、UI、图片增强、矢量图、商品图和设计辅助。",
  AI营销: "广告文案、投放素材、私域运营、销售自动化和增长分析。",
  AI数据: "表格分析、BI 报告、SQL、数据清洗和趋势解释。",
  AI学习: "语言学习、考试训练、论文辅助、课程总结和个人教练。",
  AI效率: "任务管理、自动化、日程、邮件、个人知识库和效率插件。",
  AI数字人: "数字人口播、课程讲解、多语言视频和品牌 IP 出镜。",
  AI电商: "商品图、主图、广告视频、商品描述、竞品和店铺经营。",
  AI客服: "客服 Agent、工单、知识库回复、质检、转人工和售后流程。",
  AI知识库: "企业搜索、文档问答、SOP、开发者文档和团队知识沉淀。",
  AI会议: "会议转写、纪要、行动项、CRM 同步和会议质量复盘。",
  AI财务: "发票、报销、预算、预测、审计和财务流程自动化。",
  AI法律: "合同审阅、法律研究、尽调、法务知识库和风险提示。",
  AI安全: "代码安全、威胁分析、事件响应、模型安全和 AI 治理。",
  AI低代码: "无代码应用、内部工具、业务后台、表单和移动端 MVP。",
  AI浏览器: "页面理解、网页总结、浏览器 Agent 和跨网页研究。",
  MCP工具: "给 Agent 连接浏览器、文件、数据库、设计和业务系统。",
  向量数据库: "RAG、语义搜索、Embedding 存储和企业知识库底座。",
  AI翻译: "网页双语、本地化、文档翻译、出海网站和多语言 SEO。",
  AI求职: "简历优化、岗位匹配、求职信、投递管理和面试准备。",
  AI科研: "论文阅读、引用判断、文献图谱、综述和研究资料整理。",
}

const focusCategoryKeys = ["对话AI", "AI编程", "Agent平台", "模型平台", "AI电商", "AI客服", "AI知识库", "AI数字人", "AI视频", "AI办公", "AI搜索", "MCP工具", "向量数据库", "AI营销", "AI学习", "AI安全"]

const modelWorkflowKits = [
  {
    title: "DeepSeek 低成本工作流",
    model: "DeepSeek V4 API",
    goal: "适合一人公司、客服知识库、日常代码修改和批量内容处理。",
    tools: ["Chatbox", "Dify", "n8n AI", "OpenAI Codex"],
    steps: ["用 Chatbox 跑通模型", "接 Dify 做知识库 Bot", "用 n8n 串通知和表格", "用 Codex 或 Cline 做代码任务"],
    href: "/models",
  },
  {
    title: "Claude / Codex 工程工作流",
    model: "Claude Code + Codex",
    goal: "适合网站、小程序、脚本、自动化和团队工程协作。",
    tools: ["Claude Code", "OpenAI Codex", "GitHub Copilot", "Composio"],
    steps: ["先读项目不改文件", "拆一个小功能", "跑 typecheck / build", "把经验写成复盘"],
    href: "/agent-install",
  },
  {
    title: "Gemini / Google 研究工作流",
    model: "Gemini + AI Search",
    goal: "适合长资料、表格、视频、网页资料研究和带来源的信息判断。",
    tools: ["Gemini", "NotebookLM", "Google AI", "Perplexity"],
    steps: ["先搜来源", "把资料放进 NotebookLM", "让模型提炼行动清单", "回项目页做交付物"],
    href: "/tools/AI搜索",
  },
  {
    title: "Kimi / Qwen 中文长文工作流",
    model: "Kimi K2.6 / Qwen",
    goal: "适合中文资料、长文、合同、课程、行业方案和 Agent 接入。",
    tools: ["Kimi K2.6 / 月之暗面", "通义千问", "Kimi Code / K2.6 Agent", "ModelScope"],
    steps: ["上传长文或资料", "生成结构化大纲", "拆成教程或 SOP", "接入 Agent 做长期任务"],
    href: "/models",
  },
  {
    title: "内容生产工作流",
    model: "多模态模型 + 设计工具",
    goal: "适合短视频、海报、PPT、课程素材、产品图和账号内容。",
    tools: ["ChatGPT Image", "即梦", "Veo", "Canva AI"],
    steps: ["先写脚本和分镜", "生成图片或视频素材", "用设计/PPT工具排版", "发布后写复盘"],
    href: "/learn/subjects/content-creation",
  },
  {
    title: "本地隐私工作流",
    model: "Ollama + 本地模型",
    goal: "适合私有资料、离线学习、低成本试验和企业内网原型。",
    tools: ["Ollama", "Open WebUI", "LocalAI", "RAGFlow"],
    steps: ["先跑小模型验证电脑性能", "接 Open WebUI 对话", "接 RAGFlow 做文档问答", "再决定是否上云"],
    href: "/models",
  },
]

const trendingToolTopics = [
  { title: "API 中转站", text: "多模型接入、成本控制、Key 安全和一人公司工作台。", href: "/learn/subjects/personal-growth/api-proxy-side-business" },
  { title: "MCP 工具连接", text: "Agent 要做事，必须安全连接文件、浏览器、数据库和业务系统。", href: "/learn/subjects/agent-coding/mcp-agent-tools" },
  { title: "Managed Agents 架构", text: "主 Agent 拆任务，子 Agent 隔离执行，SessionStore 记录状态，适合研究、代码库分析和企业长任务。", href: "/learn/subjects/agent-coding/managed-agents-sessionstore" },
  { title: "AI 网关", text: "统一管理模型路由、工具调用、限额、日志和人工确认。", href: "/learn/subjects/automation/agent-gateway-routing" },
  { title: "AI 视频工作流", text: "脚本、分镜、图像、视频、配音、字幕和发布复盘。", href: "/learn/subjects/content-creation/hot-ai-video-workflow" },
  { title: "企业 Agent 试点", text: "客服、销售、财务、运营里选一个两周能验收的流程。", href: "/learn/subjects/business-ai/enterprise-agent-pilot" },
]

const resourceEntrances = [
  {
    title: "模型选择",
    href: "/models",
    icon: Bot,
    tag: "选大脑",
    text: "先判断用 GPT、Claude、DeepSeek、Kimi、Qwen 还是本地模型，再看价格、上下文、API 和适合任务。",
  },
  {
    title: "Agent 安装",
    href: "/agent-install",
    icon: TerminalSquare,
    tag: "装工具",
    text: "装好 Codex、Claude Code、OpenClaw 或 Cline，接上模型后回到学习项目里做 MVP。",
  },
  {
    title: "工具分类",
    href: "#tool-categories",
    icon: Boxes,
    tag: "找工具",
    text: "按写作、办公、绘图、视频、编程、自动化等场景找工具，不按名字乱逛。",
  },
  {
    title: "Agent 技能库",
    href: "/skills",
    icon: Puzzle,
    tag: "装技能",
    text: "按 MCP、浏览器、知识库、电商、增长、客服等真实工作流找 Skill，让 Agent 真的能做事。",
  },
  {
    title: "学习路线",
    href: "/learn",
    icon: ListTree,
    tag: "回项目",
    text: "工具和模型选完以后，回到小科目、教程和任务里做出能落地的结果。",
  },
]

function CategoryCard({ categoryKey }: { categoryKey: string }) {
  const cat = categories.find((item) => item.key === categoryKey)
  if (!cat) return null
  const items = tools.filter((tool) => tool.category === cat.key)
  const featured = items.filter((tool) => tool.featured).slice(0, 3)
  return (
    <Link href={categoryPath(cat.key)} className={styles.card}>
      <div className={styles.cardTop}>
        <CategoryIcon category={cat.key} size={24} />
        <span className={styles.tag}>{items.length} 个工具</span>
      </div>
      <h3 className={styles.cardTitle}>{cat.label}</h3>
      <p className={styles.cardText}>{categoryIntro[cat.key] || "精选 AI 工具分类，适合按场景逐步探索。"}</p>
      <div className={styles.pillRow} style={{ marginTop: 14 }}>
        {featured.length ? featured.map((tool) => <span key={tool.id} className={styles.tag}>{tool.name}</span>) : <span className={styles.tag}>进入查看</span>}
      </div>
    </Link>
  )
}

function ResourceEntranceCard({ item }: { item: (typeof resourceEntrances)[number] }) {
  const Icon = item.icon
  return (
    <Link href={item.href} className={styles.resourceCard}>
      <div className={styles.resourceIcon}><Icon size={22} /></div>
      <div>
        <div className={styles.cardTop}>
          <h3 className={styles.cardTitle}>{item.title}</h3>
          <span className={styles.tag}>{item.tag}</span>
        </div>
        <p className={styles.cardText}>{item.text}</p>
      </div>
      <span className={styles.cardLink}>进入 <ArrowRight size={14} /></span>
    </Link>
  )
}

export default function ToolsPage() {
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "AI工具导航大全",
    description: "按场景分类整理 ChatGPT、DeepSeek、AI绘图、AI编程、AI办公、Agent平台和模型平台等 AI 工具。",
    url: "https://www.xiaobaiai.cn/tools",
    inLanguage: "zh-CN",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: categories.map((cat, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: cat.label,
        url: `https://www.xiaobaiai.cn${categoryPath(cat.key)}`,
      })),
    },
  }

  return (
    <div className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <NavBar />
      <main className={styles.main}>
        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>Tool Library</p>
            <h1 className={styles.title}>按任务找工具，不按名字逛目录</h1>
            <p className={styles.subtitle}>工具页保留为独立入口，但它服务学习路线：你要写作、做 PPT、做图、写代码、搭 Agent，先从对应场景进入。</p>
            <form action="/search" className={styles.searchForm}>
              <Search size={16} style={{ marginLeft: 14, color: "#256d85", flexShrink: 0 }} />
              <input name="q" type="search" placeholder="直接搜索工具：Claude Code、AI PPT、绘图、Dify" />
              <button type="submit">搜索</button>
            </form>
          </div>
          <aside className={styles.heroAside}>
            <h2 className={styles.asideTitle}>怎么用这页</h2>
            <ol className={styles.steps}>
              <li><b>1</b><span>先选你正在做的任务场景。</span></li>
              <li><b>2</b><span>只试 1 到 2 个工具，别同时切太多。</span></li>
              <li><b>3</b><span>回到教程或项目，把工具用于具体交付。</span></li>
            </ol>
          </aside>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <h2 className={styles.panelTitle}>工具资源入口</h2>
              <p className={styles.panelDesc}>模型、Agent 安装、工具分类都放在这里。它们是做项目之前的准备区，不再分散成导航里的多个平级页面。</p>
            </div>
            <Link className={styles.ghostButton} href="/learn">回到学习地图</Link>
          </div>
          <div className={styles.resourceGrid}>
            {resourceEntrances.map((item) => <ResourceEntranceCard key={item.href} item={item} />)}
          </div>
        </section>

        <section id="tool-categories" className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <h2 className={styles.panelTitle}>高频工具分类</h2>
              <p className={styles.panelDesc}>先放最常用的任务方向，完整分类在下面展开。用户先选场景，再进入工具详情。</p>
            </div>
            <Link className={styles.ghostButton} href="/learn/tutorials">只看教程</Link>
          </div>
          <div className={styles.grid}>
            {focusCategoryKeys.map((key) => <CategoryCard key={key} categoryKey={key} />)}
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <h2 className={styles.panelTitle}>按模型配一套能跑完整工作的工具</h2>
              <p className={styles.panelDesc}>用户选了模型以后，还需要客户端、Agent、知识库、搜索、自动化和复盘入口。这里直接按完整工作流收集，不让用户只停在模型名。</p>
            </div>
            <Link className={styles.ghostButton} href="/models">看模型选择</Link>
          </div>
          <div className={styles.workflowGrid}>
            {modelWorkflowKits.map((kit) => (
              <Link key={kit.title} href={kit.href} className={`${styles.card} ${styles.workflowCard}`}>
                <div className={styles.cardTop}>
                  <span className={styles.tag}>{kit.model}</span>
                  <ArrowRight size={15} color="#256d85" />
                </div>
                <h3 className={styles.cardTitle}>{kit.title}</h3>
                <p className={styles.cardText}>{kit.goal}</p>
                <div className={styles.pillRow} style={{ marginTop: 12 }}>
                  {kit.tools.map((tool) => <span key={tool} className={styles.tag}>{tool}</span>)}
                </div>
                <div className={styles.workflowSteps}>
                  {kit.steps.map((step, index) => (
                    <span key={step} className={styles.workflowStep}><b>{index + 1}</b>{step}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <h2 className={styles.panelTitle}>最近热门 AI 话题应该去哪里学</h2>
              <p className={styles.panelDesc}>热点不只放资讯页。能做成教程的，直接放进精确小科目，让用户知道看完以后该做什么。</p>
            </div>
            <Link className={styles.ghostButton} href="/news">看 AI 资讯</Link>
          </div>
          <div className={styles.pathGrid}>
            {trendingToolTopics.map((topic, index) => (
              <Link key={topic.title} href={topic.href} className={styles.pathCard}>
                <span className={styles.pathNumber}>{index + 1}</span>
                <strong className={styles.pathTitle}>{topic.title}</strong>
                <p className={styles.pathText}>{topic.text}</p>
                <span className={styles.pathAction}>去对应教程 <ArrowRight size={13} /></span>
              </Link>
            ))}
          </div>
        </section>

        <details className={styles.details}>
          <summary>展开全部工具分类</summary>
          <div className={styles.grid} style={{ paddingTop: 18 }}>
            {categories.map((cat) => <CategoryCard key={cat.key} categoryKey={cat.key} />)}
          </div>
        </details>

        <section className={styles.panel}>
          <h2 className={styles.panelTitle}>工具不是终点</h2>
          <p className={styles.panelDesc}>工具选完以后，最好回到一个小科目或行业项目里继续。这样用户不是“收藏工具”，而是能做出 PPT、表格、知识库、海报、视频、客服 Bot 或自动化流程。</p>
          <div className={styles.actions}>
            <Link href="/learn" className={styles.primaryButton}>进入学习地图</Link>
            <Link href="/learn/tutorials" className={styles.secondaryButton}>只看教程</Link>
            <Link href="/member-cases" className={styles.secondaryButton}>看实战展示 <ArrowRight size={14} /></Link>
          </div>
        </section>
      </main>
    </div>
  )
}
