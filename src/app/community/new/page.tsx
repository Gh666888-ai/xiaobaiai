"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { BookOpenCheck, CheckCircle2, ClipboardList, FileText, Handshake, Lightbulb, Send, ShieldCheck, Sparkles, Wrench } from "lucide-react"
import { NavBar } from "@/components/NavBar"
import { COMMUNITY_REWARDS } from "@/data/growth"
import { useAuth } from "@/lib/AuthContext"
import { readAppAuth } from "@/lib/app-auth"

type TemplateKey = "案例共创" | "工具验证" | "教程修正" | "行业资源" | "合作需求"

const templates: Record<TemplateKey, { title: string; tags: string; content: string; hint: string }> = {
  案例共创: {
    title: "我想共创一个可复用 AI 案例：",
    tags: "案例共创,实战复盘,可复用流程",
    hint: "适合提交真实任务、交付结果、流程截图、提示词和踩坑记录。",
    content:
      "共创方向：例如：电商客服话术 / 门店活动海报 / 产品介绍 PPT / 企业知识库\n\n真实背景：我是谁、行业是什么、为什么需要这个案例\n\n最终交付物：例如：一份文档、一张图、一个网页、一个 Bot、一个自动化流程\n\n我用了哪些工具：\n1. 工具名称：用来做什么\n2. 工具名称：用来检查什么\n\n具体步骤：\n第一步：我先准备了……\n第二步：我把这些内容发给 AI，让它……\n第三步：我人工检查了……\n\n可公开的提示词/模板：\n把可以给别人复用的部分贴在这里。\n\n花了多少钱/多久：例如：0 元，20 分钟\n\n最后效果：例如：已经能直接给客户/同事/自己使用\n\n踩坑和建议：例如：不要一次丢太多材料，先让 AI 输出提纲再补充\n\n我希望小白AI怎么共建：例如：整理成教程、放进任务库、补工具清单、做成行业案例\n",
  },
  工具验证: {
    title: "我验证了一个 AI 工具/模型/平台：",
    tags: "工具验证,工具资源,真实体验",
    hint: "适合提交工具、模型、平台、插件、Skill 的真实可用性和使用边界。",
    content:
      "工具/资源名称：\n\n官网或来源链接：\n\n它属于哪一类：例如：模型 / Agent / 应用平台 / 工作流 / 设计工具 / 办公工具\n\n我实际用它做了什么：\n\n验证结果：能用 / 部分能用 / 不建议新手直接用\n\n国内访问、价格或账号限制：\n\n适合什么人：\n\n不适合什么人：\n\n小白AI可以怎么收录：例如：工具资源页、教程、任务步骤、避坑说明\n",
  },
  教程修正: {
    title: "我想补充或修正一篇小白AI教程：",
    tags: "教程修正,学习路线,内容共建",
    hint: "适合指出教程缺口、步骤不清、工具变化、失败修复和下一步任务。",
    content:
      "相关页面或教程链接：\n\n我看到的问题：例如：步骤不完整 / 工具入口变了 / 新手不知道怎么检查结果 / 缺少失败修复\n\n建议补充的内容：\n1. \n2. \n3. \n\n我自己的验证过程：\n\n更适合新手的写法：\n\n可以加入的任务或交付物：\n\n是否有截图/示例/链接可以公开：\n",
  },
  行业资源: {
    title: "我有一个行业场景/资源可以共建：",
    tags: "行业资源,场景共建,落地方案",
    hint: "适合提交行业流程、客户问题、岗位需求、企业场景和可公开素材。",
    content:
      "行业/岗位：例如：电商、教育、门店、本地服务、销售、客服、内容团队\n\n真实任务：这个行业里最常见、最想省时间的一件事是什么\n\n现在怎么做：人工流程、耗时、容易出错的地方\n\nAI 可以介入的环节：\n1. \n2. \n3. \n\n需要的材料：例如：产品资料、FAQ、报价表、聊天记录、SOP\n\n验收标准：怎样算做成了\n\n风险边界：隐私、版权、价格、合同、医疗/法律/财务等不能乱用的地方\n\n我可以提供什么：公开素材 / 行业经验 / 测试场景 / 客户需求 / 合作资源\n",
  },
  合作需求: {
    title: "我想和小白AI一起做一件事：",
    tags: "合作需求,共创合作,资源对接",
    hint: "适合提交内容渠道、企业客户、产品能力、社群活动和联合共建想法。",
    content:
      "我能提供什么：例如：内容渠道 / 行业案例 / 企业客户 / 工具资源 / 开发能力 / 社群活动\n\n想一起做什么：\n\n面向谁：个人用户 / 小团队 / 企业 / 某个行业\n\n希望小白AI参与什么：教程共建 / 案例展示 / 工具收录 / 任务设计 / 联合活动 / 企业方案\n\n已有材料：链接、文档、截图、案例、联系方式等可公开内容\n\n不能公开的信息：请在这里说明，不要直接粘贴隐私或机密内容\n\n下一步建议怎么联系或验证：\n",
  },
}

const publishSteps = [
  "选共创类型：案例、工具、教程、行业或合作",
  "补齐可公开材料、验证过程和希望共建的去向",
  "提交审核，进入案例库、工具库、教程或任务池",
]

const coCreationTypes = [
  { title: "案例", text: "真实 AI 任务和交付结果", icon: FileText },
  { title: "工具", text: "工具、模型、平台的可用性验证", icon: Wrench },
  { title: "教程", text: "教程缺口、修正和下一步任务", icon: BookOpenCheck },
  { title: "合作", text: "渠道、客户、资源和联合共建", icon: Handshake },
]

function polishDraft(title: string, content: string, cat: TemplateKey) {
  const source = content.trim()
  if (!source) return templates[cat].content
  const lines = source.split(/\n+/).map((line) => line.trim()).filter(Boolean)
  const body = lines.map((line) => (line.match(/^[0-9一二三四五六七八九十]+[.、]/) ? line : `- ${line}`)).join("\n")
  return `这是一份关于「${title || templates[cat].title}」的小白AI共创提交稿。\n\n共创方向\n${templates[cat].hint}\n\n核心材料\n${body}\n\n建议进入小白AI的位置\n1. 如果已经跑通，可以整理成实战案例或任务复盘。\n2. 如果是工具验证，可以进入工具资源页或教程的工具步骤。\n3. 如果是教程修正，可以补进学习路线、教程详情或任务检查项。\n\n公开边界\n请只保留可以公开复用的材料。涉及 API Key、账号、客户隐私、合同、未授权截图和敏感业务数据的内容，需要先脱敏再提交。`
}

export default function NewPostPage() {
  const router = useRouter()
  const { user, refresh } = useAuth()
  const [title, setTitle] = useState(templates["案例共创"].title)
  const [content, setContent] = useState(templates["案例共创"].content)
  const [cat, setCat] = useState<TemplateKey>("案例共创")
  const [tags, setTags] = useState(templates["案例共创"].tags)
  const [author, setAuthor] = useState("")
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState("")
  const [done, setDone] = useState(false)
  const [polished, setPolished] = useState("")
  const [awarded, setAwarded] = useState(0)

  const selectedTemplate = useMemo(() => templates[cat], [cat])

  useEffect(() => {
    const auth = readAppAuth()
    if (auth?.user) setAuthor(auth.user.name || auth.user.email || "")
  }, [])

  const applyTemplate = (nextCat: TemplateKey) => {
    const titleLooksUntouched = Object.values(templates).some((template) => template.title === title)
    const contentLooksUntouched = Object.values(templates).some((template) => template.content === content)
    setCat(nextCat)
    setTags(templates[nextCat].tags)
    if (!title.trim() || titleLooksUntouched) setTitle(templates[nextCat].title)
    if (!content.trim() || contentLooksUntouched) setContent(templates[nextCat].content)
    setPolished("")
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr("")
    setBusy(true)
    if (!title.trim()) {
      setErr("请输入标题")
      setBusy(false)
      return
    }
    if (!content.trim()) {
      setErr("请输入内容")
      setBusy(false)
      return
    }
    try {
      const accessToken = readAppAuth()?.session?.access_token
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({
          title,
          content,
          category: cat,
          tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
          author_name: author || "匿名用户",
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setErr(data.error || "发布失败")
        setBusy(false)
        return
      }
      setAwarded(Number(data.awarded || 0))
      await refresh().catch(() => undefined)
      setDone(true)
    } catch {
      setErr("发布失败，请稍后再试")
    }
    setBusy(false)
  }

  if (done) {
    return (
      <div style={{ background: "linear-gradient(180deg,#f6f9fc 0%,#eef4f8 100%)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ textAlign: "center", maxWidth: 520, border: "1px solid #dfe7ee", borderRadius: 20, padding: 38, background: "rgba(255,255,255,0.94)", boxShadow: "0 20px 60px rgba(15,23,42,0.08)" }}>
          <FileText size={42} style={{ color: "#256d85", marginBottom: 16 }} />
          <h2 style={{ fontSize: 24, color: "#17202a", marginBottom: 10, fontWeight: 950 }}>共创内容已提交，等待审核</h2>
          <p style={{ fontSize: 15, color: "#536170", lineHeight: 1.8, marginBottom: 18 }}>
            {user ? `如果内容能整理成可复用案例、教程、工具验证或任务素材，审核后会计入贡献；实战案例通过 +${COMMUNITY_REWARDS.practicalCaseApprovedXP}XP，验证可行后再 +${COMMUNITY_REWARDS.practicalCaseVerifiedXP}XP。` : "内容已提交；登录用户的共创内容通过审核后才会领取奖励和贡献记录。"}
            {awarded > 0 ? ` 本次预估奖励 ${awarded}XP。` : " 达到共创后不再靠 XP 升级，改为累计贡献值。"}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }} className="max-sm:grid-cols-1">
            <button onClick={() => router.push("/growth")} className="btn-primary">看贡献进度</button>
            <button onClick={() => router.push("/community")} className="btn-outline">返回共创库</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: "linear-gradient(180deg,#f6f9fc 0%,#eef4f8 100%)", minHeight: "100vh", fontFamily: "'Noto Sans SC', sans-serif", color: "#17202a" }}>
      <NavBar />
      <main className="community-new-main" style={{ width: "min(1120px, calc(100% - 32px))", margin: "0 auto", padding: "54px 0 92px" }}>
        <section className="community-new-hero" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 340px", gap: 28, alignItems: "stretch", marginBottom: 20, padding: "clamp(24px,4vw,36px)", border: "1px solid #dfe7ee", borderRadius: 24, background: "rgba(255,255,255,0.92)", boxShadow: "0 20px 60px rgba(15,23,42,0.08)" }}>
          <div>
            <p style={{ margin: "0 0 12px", color: "#256d85", fontSize: 12, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase" }}>Co-create Desk</p>
            <h1 style={{ margin: 0, maxWidth: 740, fontSize: "clamp(32px,5vw,52px)", lineHeight: 1.12, fontWeight: 950, color: "#17202a" }}>提交小白AI共创内容</h1>
            <p style={{ margin: "18px 0 0", maxWidth: 780, fontSize: 17, fontWeight: 650, color: "#536170", lineHeight: 1.75 }}>
              这里收集能让网站变得更有用的材料：真实案例、工具验证、教程修正、行业场景和合作资源。不是单纯发帖，而是把内容送进小白AI的案例库、工具库、学习路线和任务系统。
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 24 }}>
              <button type="button" onClick={() => document.getElementById("community-post-form")?.scrollIntoView({ behavior: "smooth", block: "start" })} className="community-primary">开始共创提交</button>
              <button type="button" onClick={() => router.push("/community")} className="community-secondary">看共创库</button>
            </div>
          </div>
          <aside style={{ display: "grid", alignContent: "start", gap: 14, padding: 22, borderRadius: 18, background: "#f7fbfd", border: "1px solid #dfe7ee" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <ClipboardList size={18} style={{ color: "#256d85" }} />
              <h2 style={{ margin: 0, color: "#17202a", fontSize: 18, fontWeight: 950 }}>共创提交三步</h2>
            </div>
            <ol style={{ display: "grid", gap: 10, listStyle: "none" }}>
              {publishSteps.map((step, index) => (
                <li key={step} style={{ display: "grid", gridTemplateColumns: "28px 1fr", gap: 10, alignItems: "start", color: "#536170", fontSize: 14, lineHeight: 1.7 }}>
                  <b style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 999, background: "#dff0f4", color: "#256d85", fontSize: 12 }}>{index + 1}</b>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </aside>
        </section>

        <div className="community-new-rules" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 22 }}>
          <section style={{ border: "1px solid #dfe7ee", borderRadius: 18, background: "rgba(255,255,255,0.92)", padding: "18px 20px", boxShadow: "0 12px 34px rgba(15,23,42,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <CheckCircle2 size={18} style={{ color: "#256d85" }} />
              <p style={{ color: "#17202a", fontSize: 15, fontWeight: 950 }}>可共建内容会进入产品素材池</p>
            </div>
            <p style={{ color: "#667586", fontSize: 14, lineHeight: 1.75 }}>审核会看它能否变成案例、教程、工具说明、任务步骤或行业方案。真实验证比口号更重要。</p>
          </section>
          <section style={{ border: "1px solid #dfe7ee", borderRadius: 18, background: "rgba(255,255,255,0.92)", padding: "18px 20px", boxShadow: "0 12px 34px rgba(15,23,42,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <ShieldCheck size={18} style={{ color: "#256d85" }} />
              <p style={{ color: "#17202a", fontSize: 15, fontWeight: 950 }}>公开边界先检查</p>
            </div>
            <p style={{ color: "#667586", fontSize: 14, lineHeight: 1.75 }}>不要发布 API Key、账号密码、客户隐私、合同数据和未授权截图。可以描述问题，但要先脱敏。</p>
          </section>
        </div>

        <section style={{ marginBottom: 20, padding: 24, border: "1px solid #dfe7ee", borderRadius: 20, background: "rgba(255,255,255,0.92)", boxShadow: "0 16px 46px rgba(15,23,42,0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 18, marginBottom: 18 }}>
            <div>
              <p style={{ margin: "0 0 10px", color: "#256d85", fontSize: 12, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase" }}>What Can Be Co-created</p>
              <h2 style={{ margin: 0, color: "#17202a", fontSize: 28, lineHeight: 1.25, fontWeight: 950 }}>你可以共创什么</h2>
            </div>
          </div>
          <div className="community-type-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 14 }}>
            {coCreationTypes.map((item) => {
              const Icon = item.icon
              return (
                <article key={item.title} style={{ minHeight: 136, padding: 18, border: "1px solid #d9e5ed", borderRadius: 16, background: "linear-gradient(180deg,#fff 0%,#f7fbfd 100%)" }}>
                  <Icon size={24} style={{ color: "#256d85", marginBottom: 14 }} />
                  <h3 style={{ margin: "0 0 8px", color: "#17202a", fontSize: 17, fontWeight: 950 }}>{item.title}</h3>
                  <p style={{ margin: 0, color: "#667586", fontSize: 14, lineHeight: 1.65 }}>{item.text}</p>
                </article>
              )
            })}
          </div>
        </section>

        <div className="community-new-grid" style={{ display: "grid", gridTemplateColumns: "minmax(270px,0.82fr) minmax(0,1.18fr)", gap: 18, alignItems: "start" }}>
          <aside style={{ border: "1px solid #dfe7ee", borderRadius: 18, background: "rgba(255,255,255,0.92)", padding: 18, position: "sticky", top: 86, boxShadow: "0 16px 46px rgba(15,23,42,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <Lightbulb size={17} style={{ color: "#256d85" }} />
              <h2 style={{ fontSize: 17, color: "#17202a", fontWeight: 950 }}>共创模板</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {(Object.keys(templates) as TemplateKey[]).map((key) => (
                <button key={key} type="button" onClick={() => applyTemplate(key)} style={{ textAlign: "left", border: `1px solid ${cat === key ? "#91c0ce" : "#dfe7ee"}`, background: cat === key ? "#dff0f4" : "#fff", color: "#17202a", borderRadius: 12, padding: "12px 14px", cursor: "pointer" }}>
                  <p style={{ fontSize: 14, fontWeight: 950 }}>{key}</p>
                  <p style={{ fontSize: 13, color: "#667586", lineHeight: 1.6, marginTop: 3 }}>{templates[key].hint}</p>
                </button>
              ))}
            </div>
          </aside>

          <form id="community-post-form" onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14, scrollMarginTop: 90, padding: 22, border: "1px solid #dfe7ee", borderRadius: 18, background: "rgba(255,255,255,0.94)", boxShadow: "0 16px 46px rgba(15,23,42,0.06)" }}>
            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ color: "#17202a", fontSize: 14, fontWeight: 950 }}>标题</span>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="共创标题" className="community-input" autoFocus />
            </label>
            <div className="community-new-fields" style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 12 }}>
              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ color: "#17202a", fontSize: 14, fontWeight: 950 }}>类型</span>
                <select value={cat} onChange={(e) => applyTemplate(e.target.value as TemplateKey)} className="community-input">
                {(Object.keys(templates) as TemplateKey[]).map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
              </label>
              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ color: "#17202a", fontSize: 14, fontWeight: 950 }}>标签</span>
                <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="标签，用英文逗号分隔" className="community-input" />
              </label>
            </div>
            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ color: "#17202a", fontSize: 14, fontWeight: 950 }}>署名</span>
              <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="昵称或邮箱，不填则匿名" className="community-input" />
            </label>
            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ color: "#17202a", fontSize: 14, fontWeight: 950 }}>共创内容</span>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder={selectedTemplate.content} rows={17} className="community-input" style={{ lineHeight: 1.75, resize: "vertical" }} />
            </label>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button type="button" onClick={() => setPolished(polishDraft(title, content, cat))} className="community-secondary" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <Sparkles size={15} /> 整理成共创稿
              </button>
              {polished && (
                <button type="button" onClick={() => { setContent(polished); setPolished("") }} className="community-secondary">使用整理版本</button>
              )}
              <button type="submit" disabled={busy} className="community-primary" style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 8 }}>
                <Send size={15} /> {busy ? "提交中..." : "提交共创审核"}
              </button>
            </div>

            {polished && (
              <div style={{ border: "1px solid #d9e5ed", borderRadius: 14, padding: 16, background: "#f7fbfd" }}>
                <p style={{ color: "#256d85", fontSize: 13, fontWeight: 950, marginBottom: 8 }}>整理预览</p>
                <p style={{ color: "#536170", fontSize: 14, lineHeight: 1.8, whiteSpace: "pre-line" }}>{polished}</p>
              </div>
            )}
            {err && <p style={{ fontSize: 12, color: "#D94841" }}>{err}</p>}
          </form>
        </div>
        <style jsx>{`
          @media (max-width: 860px) {
            .community-new-main {
              width: min(100% - 24px, 1120px) !important;
              padding: 28px 0 72px !important;
            }
            .community-new-hero,
            .community-new-rules,
            .community-new-grid,
            .community-new-fields,
            .community-type-grid {
              grid-template-columns: 1fr !important;
            }
            .community-new-grid aside {
              position: static !important;
              order: 2;
            }
            .community-new-grid form {
              order: 1;
            }
          }
          .community-primary,
          .community-secondary {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 44px;
            padding: 10px 16px;
            border-radius: 12px;
            border: 1px solid transparent;
            font-size: 14px;
            font-weight: 900;
            text-decoration: none;
            cursor: pointer;
          }
          .community-primary {
            background: #17202a;
            color: #fff;
            box-shadow: 0 14px 28px rgba(15, 23, 42, 0.18);
          }
          .community-secondary {
            background: #fff;
            color: #17202a;
            border-color: #cfd9e3;
          }
          .community-input {
            width: 100%;
            min-height: 46px;
            padding: 11px 13px;
            border: 1px solid #cfd9e3;
            border-radius: 12px;
            background: #fff;
            color: #17202a;
            font: inherit;
            font-size: 15px;
            outline: none;
          }
          .community-input:focus {
            border-color: #256d85;
            box-shadow: 0 0 0 3px rgba(37,109,133,0.12);
          }
          .community-input::placeholder {
            color: #8a98a8;
          }
        `}</style>
      </main>
    </div>
  )
}
