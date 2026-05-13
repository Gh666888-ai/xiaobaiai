"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { skills, skillCategories, type Skill, type SkillCategory } from "@/data/skills"
import { professionSkillTracks, recommendSkillsForGoal } from "@/data/skill-recommendations"
import { NavBar } from "@/components/NavBar"
import { ArrowRight, Bot, CheckCircle2, Download, FileText, Filter, GitBranch, Search, ShieldCheck, Workflow } from "lucide-react"

const PAGE_SIZE = 48

const coreWorkflowSkillIds = [
  "skill-managed-agents-orchestrator",
  "skill-sessionstore-agent-memory",
  "skill-agent-worker-contract",
  "skill-agent-shared-filesystem",
  "skill-mcp-browserbase",
  "skill-rag-dify-kb",
  "skill-ecom-customer-reply",
  "skill-local-ollama",
]

const orchestrationSteps = [
  { title: "主 Agent 拆任务", desc: "把目标拆成研究、资料、执行、验收几个互不重复的小任务。", icon: GitBranch },
  { title: "子 Agent 隔离执行", desc: "每个子 Agent 只拿自己的材料和权限，避免上下文混乱。", icon: Bot },
  { title: "Skill 连接工具", desc: "用 MCP、浏览器、RAG、客服、文件等 Skill 连接真实工作流。", icon: Workflow },
  { title: "SessionStore 记状态", desc: "记录目标、输入、输出、文件、失败原因和下一步，长任务能继续。", icon: FileText },
  { title: "人工验收再放行", desc: "发送、删除、付款、改库、群发等高风险动作必须人来确认。", icon: ShieldCheck },
]

const safetyChecks = [
  "先用公开样例跑通，不直接放客户资料、公司代码或真实订单。",
  "会读文件、发消息、操作网页、调用 API 的 Skill 必须写清权限边界。",
  "没有来源、说明、更新时间和验收方式的候选 Skill 不放进新手首装。",
  "能完成一个明确动作并留下结果，再进入长期使用或团队流程。",
]

type FetchedSkillItem = {
  id: string
  name: string
  source: string
  url: string
  score: number
  recommendedFor: string[]
  reason: string
  safetyNote: string
}

export default function SkillsPage() {
  const [cat, setCat] = useState<SkillCategory | null>(null)
  const [platform, setPlatform] = useState("全部")
  const [search, setSearch] = useState("")
  const [goal, setGoal] = useState("我做电商，想用 AI 做商品资料、种草内容和客服")
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [fetchedSkills, setFetchedSkills] = useState<FetchedSkillItem[]>([])

  const recommendationPlan = recommendSkillsForGoal(goal, 4)
  const platforms = useMemo(() => ["全部", ...Array.from(new Set(skills.map((skill) => skill.platform)))], [])
  const coreWorkflowSkills = coreWorkflowSkillIds
    .map((id) => skills.find((skill) => skill.id === id))
    .filter((skill): skill is Skill => Boolean(skill))
  const discoveredSkills = fetchedSkills
    .filter(
      (item) =>
        item.score >= 65 &&
        (item.recommendedFor.includes(recommendationPlan.track.shortTitle) ||
          item.recommendedFor.some((label) => recommendationPlan.track.title.includes(label))),
    )
    .slice(0, 3)

  useEffect(() => {
    let mounted = true
    fetch("/fetched-skills.json", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (mounted && Array.isArray(data?.items)) setFetchedSkills(data.items)
      })
      .catch(() => undefined)
    return () => {
      mounted = false
    }
  }, [])

  const filtered = skills
    .filter((skill) => {
      if (cat && skill.category !== cat) return false
      if (platform !== "全部" && skill.platform !== platform) return false
      const keyword = search.trim()
      if (!keyword) return true
      return skill.name.includes(keyword) || skill.description.includes(keyword) || skill.tags.some((tag) => tag.includes(keyword))
    })
    .sort((a, b) => parseHeat(b.downloads) - parseHeat(a.downloads))

  const visibleSkills = filtered.slice(0, visibleCount)

  function updateFilter(fn: () => void) {
    fn()
    setVisibleCount(PAGE_SIZE)
  }

  function focusSkill(skill: Skill) {
    setSearch(skill.name)
    setCat(skill.category)
    setVisibleCount(PAGE_SIZE)
    document.getElementById("skill-list")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <main className="skillsPage">
      <NavBar />
      <section className="hero">
        <div className="heroCopy">
          <p className="eyebrow">Agent Skill Hub</p>
          <h1>技能库不是装插件，是给 Agent 设计工作流</h1>
          <p className="lead">
            先明确目标，再选 Skill。小白AI把 MCP、浏览器操作、RAG、客服、电商、增长、本地模型和多 Agent 编排放在同一张工作台里，让新手知道先装什么、怎么验收、哪里必须人工确认。
          </p>
          <div className="actions">
            <a className="primaryButton" href="#workflow">
              看编排方式 <ArrowRight size={16} />
            </a>
            <a className="secondaryButton" href="#skill-list">
              搜索 Skill
            </a>
          </div>
        </div>
        <aside className="heroAside" aria-label="Agent 技能编排摘要">
          <div className="asideTop">
            <span>当前推荐路线</span>
            <strong>{recommendationPlan.track.shortTitle}</strong>
          </div>
          <div className="flowStack">
            {recommendationPlan.workflow.slice(0, 4).map((item, index) => (
              <div key={item} className="flowRow">
                <b>{index + 1}</b>
                <span>{item}</span>
              </div>
            ))}
          </div>
          <p className="asideBottom">
            <CheckCircle2 size={17} /> 先小样例验收，再接真实业务
          </p>
        </aside>
      </section>

      <section id="workflow" className="panel">
        <div className="panelHead">
          <div>
            <p className="eyebrow">Orchestration</p>
            <h2>多 Agent 编排应该长这样</h2>
            <p>不要把一堆 Skill 随便塞给 Agent。真正可用的编排要有主控、子任务、工具权限、状态记录和人工验收。</p>
          </div>
        </div>
        <div className="orchestrationGrid">
          {orchestrationSteps.map((step, index) => {
            const Icon = step.icon
            return (
              <article key={step.title} className="orchestrationCard">
                <div className="iconBox"><Icon size={20} /></div>
                <span className="stepNumber">0{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
                {index < orchestrationSteps.length - 1 ? <ArrowRight className="stepArrow" size={18} /> : null}
              </article>
            )
          })}
        </div>
      </section>

      <section className="panel">
        <div className="panelHead">
          <div>
            <p className="eyebrow">Core Workflows</p>
            <h2>先看这些能让 Agent 真做事的 Skill</h2>
          </div>
          <Link href="/learn/subjects/agent-coding/managed-agents-sessionstore" className="ghostButton">
            学 Managed Agents 与 SessionStore
          </Link>
        </div>
        <div className="coreGrid">
          {coreWorkflowSkills.map((skill) => (
            <button key={skill.id} type="button" className="coreCard" onClick={() => focusSkill(skill)}>
              <div className="cardMeta"><span>{skill.category}</span><em>{skill.difficulty}</em></div>
              <h3>{skill.name}</h3>
              <p>{skill.description}</p>
              <strong>{skill.platform}</strong>
            </button>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panelHead">
          <div>
            <p className="eyebrow">Safety Check</p>
            <h2>装 Skill 前先过四个检查</h2>
          </div>
        </div>
        <div className="checkGrid">
          {safetyChecks.map((item, index) => (
            <div key={item} className="checkItem"><b>{index + 1}</b><span>{item}</span></div>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panelHead">
          <div>
            <p className="eyebrow">Scene Router</p>
            <h2>按你的工作场景推荐 Skill</h2>
          </div>
          <span className="resultPill">推荐：{recommendationPlan.track.shortTitle}</span>
        </div>
        <div className="goalBox">
          <Search size={18} />
          <input value={goal} onChange={(event) => setGoal(event.target.value)} placeholder="例如：我做教育培训，想用 AI 做课件和答疑知识库" />
        </div>
        <div className="trackButtons">
          {professionSkillTracks.map((track) => (
            <button
              key={track.id}
              type="button"
              className={recommendationPlan.track.id === track.id ? "trackButton active" : "trackButton"}
              onClick={() => setGoal(`我做${track.shortTitle}，想用 AI 做${track.workflow.slice(0, 3).join("、")}`)}
            >
              {track.shortTitle}
            </button>
          ))}
        </div>
        <div className="recommendGrid">
          {recommendationPlan.recommendations.map((item) => (
            <a key={item.skill.id} className="recommendCard" href={normalizeUrl(item.skill.url)} target={item.skill.url && item.skill.url !== "#" ? "_blank" : undefined}>
              <span>{item.score}</span>
              <h3>{item.skill.name}</h3>
              <p>{item.reason}</p>
              <strong>验收：{item.firstCheck}</strong>
            </a>
          ))}
        </div>
        {discoveredSkills.length > 0 ? (
          <div className="candidateBox">
            <h3>社区候选 Skill</h3>
            <div className="candidateGrid">
              {discoveredSkills.map((item) => (
                <a key={item.id} href={item.url} target="_blank" className="candidateCard">
                  <strong>{item.name}</strong>
                  <p>{item.reason}</p>
                  <span>{item.safetyNote}</span>
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      <section id="skill-list" className="panel">
        <div className="panelHead">
          <div>
            <p className="eyebrow">Skill Library</p>
            <h2>全部 Skill</h2>
          </div>
          <span className="resultPill">{filtered.length} skills</span>
        </div>
        <div className="filterBar">
          <div className="searchBox">
            <Search size={17} />
            <input value={search} onChange={(event) => { setSearch(event.target.value); setVisibleCount(PAGE_SIZE) }} placeholder="搜索技能、场景或标签" />
          </div>
          <div className="platformBox">
            <Filter size={16} />
            <select value={platform} onChange={(event) => updateFilter(() => setPlatform(event.target.value))}>
              {platforms.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
        </div>
        <div className="categoryButtons">
          <button type="button" className={cat === null ? "categoryButton active" : "categoryButton"} onClick={() => updateFilter(() => setCat(null))}>全部</button>
          {skillCategories.map((item) => (
            <button key={item.key} type="button" className={cat === item.key ? "categoryButton active" : "categoryButton"} onClick={() => updateFilter(() => setCat(cat === item.key ? null : item.key))}>
              {item.icon} {item.label}
            </button>
          ))}
        </div>
        {filtered.length === 0 ? (
          <div className="emptyState">没有找到匹配的 Skill，换一个场景或关键词再试。</div>
        ) : (
          <div className="skillGrid">
            {visibleSkills.map((skill) => (
              <a key={skill.id} href={normalizeUrl(skill.url)} target={skill.url && skill.url !== "#" ? "_blank" : undefined} className="skillCard">
                <div className="skillTags">
                  <span>{skill.difficulty}</span>
                  <span>{skill.platform}</span>
                  <span>{skillCategories.find((item) => item.key === skill.category)?.icon} {skill.category}</span>
                </div>
                <h3>{skill.name}</h3>
                <p>{skill.description}</p>
                <div className="tagList">{skill.tags.slice(0, 5).map((tag) => <em key={tag}>{tag}</em>)}</div>
                <div className="skillFooter"><span><Download size={13} /> {skill.downloads} 热度</span><strong>查看来源</strong></div>
              </a>
            ))}
          </div>
        )}
        {visibleCount < filtered.length ? (
          <div className="loadMoreWrap"><button type="button" onClick={() => setVisibleCount((value) => value + PAGE_SIZE)}>加载更多 {Math.min(PAGE_SIZE, filtered.length - visibleCount)} / {filtered.length - visibleCount}</button></div>
        ) : null}
      </section>

      <style jsx>{`
        .skillsPage {
          min-height: 100vh;
          padding-bottom: 72px;
          background: radial-gradient(circle at top left, rgba(37, 109, 133, 0.08), transparent 34%), linear-gradient(180deg, #f6f9fc 0%, #eef4f8 100%);
          color: #17202a;
          font-family: 'Noto Sans SC', sans-serif;
        }
        .hero, .panel {
          width: min(1120px, calc(100% - 32px));
          margin: 0 auto;
        }
        .hero {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 320px;
          gap: 28px;
          align-items: stretch;
          padding: 54px 0 24px;
        }
        .heroCopy, .heroAside, .panel {
          border: 1px solid #dfe7ee;
          background: rgba(255, 255, 255, 0.92);
          box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08);
        }
        .heroCopy {
          border-radius: 24px;
          padding: clamp(24px, 4vw, 36px);
        }
        .heroAside {
          display: grid;
          align-content: start;
          gap: 14px;
          border-radius: 18px;
          padding: 22px;
          background: #f7fbfd;
        }
        .panel {
          margin-top: 20px;
          padding: 24px;
          border-radius: 20px;
        }
        .eyebrow {
          margin: 0 0 12px;
          color: #256d85;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        h1, h2, h3, p { letter-spacing: 0; }
        h1 {
          margin: 0;
          max-width: 760px;
          font-size: clamp(32px, 5vw, 52px);
          font-weight: 900;
          line-height: 1.12;
        }
        h2 {
          margin: 0;
          font-size: clamp(24px, 3vw, 34px);
          font-weight: 900;
          line-height: 1.25;
        }
        .lead, .panelHead p {
          max-width: 780px;
          color: #536170;
          font-size: 17px;
          font-weight: 650;
          line-height: 1.75;
        }
        .panelHead p { margin: 8px 0 0; font-size: 15px; color: #667586; }
        .actions, .trackButtons, .categoryButtons {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .actions { margin-top: 24px; }
        .primaryButton, .secondaryButton, .ghostButton, .loadMoreWrap button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 44px;
          padding: 10px 16px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 850;
          text-decoration: none;
          border: 1px solid transparent;
          cursor: pointer;
        }
        .primaryButton { background: #17202a; color: #fff; box-shadow: 0 14px 28px rgba(15, 23, 42, 0.18); }
        .secondaryButton, .loadMoreWrap button { background: #fff; color: #17202a; border-color: #cfd9e3; }
        .ghostButton { background: #edf5f7; color: #256d85; border-color: #cde0e6; }
        .asideTop, .panelHead, .cardMeta, .skillFooter {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          align-items: flex-start;
        }
        .asideTop { color: #667586; font-size: 13px; font-weight: 850; }
        .flowStack { display: grid; gap: 10px; }
        .flowRow, .checkItem {
          display: grid;
          grid-template-columns: 34px minmax(0, 1fr);
          gap: 10px;
          align-items: center;
          padding: 12px;
          border: 1px solid #dfe7ee;
          border-radius: 14px;
          background: #fff;
          color: #536170;
          font-size: 14px;
          font-weight: 800;
        }
        .flowRow b, .checkItem b {
          display: grid;
          place-items: center;
          width: 30px;
          height: 30px;
          border-radius: 999px;
          background: #dff0f4;
          color: #256d85;
        }
        .asideBottom { display: flex; gap: 8px; align-items: center; margin: 0; color: #256d85; font-weight: 900; }
        .orchestrationGrid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
          gap: 12px;
        }
        .orchestrationCard, .coreCard, .recommendCard, .candidateCard, .skillCard {
          position: relative;
          border: 1px solid #dfe7ee;
          border-radius: 16px;
          background: #fff;
          color: inherit;
          text-decoration: none;
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.05);
        }
        .orchestrationCard { min-height: 190px; padding: 16px; }
        .iconBox {
          display: grid;
          place-items: center;
          width: 38px;
          height: 38px;
          border-radius: 14px;
          margin-bottom: 14px;
          background: #e5f3f6;
          color: #256d85;
        }
        .stepNumber { position: absolute; top: 14px; right: 14px; color: #93a3b3; font-size: 12px; font-weight: 950; }
        .stepArrow { position: absolute; right: -15px; top: 48%; color: #91c0ce; background: #eef4f8; border-radius: 999px; z-index: 2; }
        .coreGrid, .recommendGrid, .candidateGrid, .skillGrid, .checkGrid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
          gap: 14px;
        }
        .coreCard {
          min-height: 210px;
          padding: 18px;
          text-align: left;
          cursor: pointer;
        }
        .coreCard h3, .recommendCard h3, .skillCard h3, .orchestrationCard h3 { margin: 0 0 8px; font-size: 18px; font-weight: 900; }
        .coreCard p, .recommendCard p, .skillCard p, .orchestrationCard p, .candidateCard p { color: #667586; line-height: 1.7; font-weight: 650; }
        .cardMeta, .skillTags { color: #256d85; font-size: 12px; font-weight: 900; }
        .cardMeta em { font-style: normal; }
        .checkItem { align-items: start; padding: 16px; }
        .goalBox, .filterBar, .searchBox, .platformBox {
          display: grid;
          gap: 10px;
          align-items: center;
        }
        .goalBox, .searchBox, .platformBox {
          border: 1px solid #dfe7ee;
          border-radius: 16px;
          background: #fff;
        }
        .goalBox { grid-template-columns: 18px minmax(0, 1fr); padding: 0 14px; margin-bottom: 12px; }
        .goalBox input, .searchBox input, .platformBox select {
          width: 100%;
          min-width: 0;
          border: none;
          outline: none;
          background: transparent;
          color: #17202a;
          font: inherit;
          font-size: 15px;
          font-weight: 750;
          padding: 14px 0;
        }
        .trackButton, .categoryButton {
          border: 1px solid #dfe7ee;
          border-radius: 12px;
          background: #fff;
          color: #536170;
          padding: 8px 12px;
          font-size: 14px;
          font-weight: 850;
          cursor: pointer;
        }
        .trackButton.active { background: #dff0f4; border-color: #91c0ce; color: #256d85; }
        .categoryButton.active { background: #17202a; border-color: #17202a; color: #fff; }
        .resultPill {
          border: 1px solid #cde0e6;
          background: #edf5f7;
          color: #256d85;
          border-radius: 999px;
          padding: 8px 12px;
          font-size: 13px;
          font-weight: 900;
          white-space: nowrap;
        }
        .recommendCard, .candidateCard, .skillCard { padding: 18px; }
        .recommendCard span { color: #256d85; font-size: 22px; font-weight: 950; }
        .recommendCard strong, .candidateCard span { color: #256d85; font-size: 13px; line-height: 1.6; }
        .candidateBox { margin-top: 14px; padding: 16px; border: 1px solid #dfe7ee; border-radius: 16px; background: #f7fbfd; }
        .filterBar { grid-template-columns: minmax(0, 1fr) 220px; margin-bottom: 12px; }
        .searchBox { grid-template-columns: 17px minmax(0, 1fr); padding: 0 13px; }
        .platformBox { grid-template-columns: 16px minmax(0, 1fr); padding: 0 12px; }
        .categoryButtons { margin-bottom: 16px; gap: 7px; }
        .skillGrid { grid-template-columns: repeat(auto-fill, minmax(min(100%, 285px), 1fr)); }
        .skillCard { display: flex; flex-direction: column; min-height: 255px; }
        .skillTags, .tagList { display: flex; flex-wrap: wrap; gap: 6px; }
        .skillTags span, .tagList em {
          border: 1px solid #dfe7ee;
          border-radius: 999px;
          padding: 4px 8px;
          background: #f7fbfd;
          font-style: normal;
          font-size: 12px;
        }
        .tagList { margin-top: auto; }
        .skillFooter {
          align-items: center;
          margin-top: 14px;
          padding-top: 12px;
          border-top: 1px solid #e8eef4;
          color: #667586;
          font-size: 12px;
          font-weight: 850;
        }
        .skillFooter span { display: inline-flex; align-items: center; gap: 6px; }
        .skillFooter strong { color: #256d85; }
        .emptyState { border: 1px solid #dfe7ee; border-radius: 16px; background: #fff; padding: 40px; text-align: center; color: #667586; font-weight: 800; }
        .loadMoreWrap { display: flex; justify-content: center; margin-top: 24px; }
        @media (max-width: 760px) {
          .hero { grid-template-columns: 1fr; padding-top: 72px; }
          .panel { padding: 20px; }
          .panelHead { display: grid; }
          .filterBar { grid-template-columns: 1fr; }
          .stepArrow { display: none; }
        }
      `}</style>
    </main>
  )
}

function parseHeat(value: string) {
  return value.endsWith("K") ? parseFloat(value) * 1000 : parseInt(value, 10) || 0
}

function normalizeUrl(url: string) {
  if (!url || url === "#") return "#"
  return `https://${url.replace(/^https?:\/\//, "")}`
}
