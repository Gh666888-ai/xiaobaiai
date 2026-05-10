"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { FileText, Lightbulb, Send, Sparkles } from "lucide-react"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"
import { getUserLevel } from "@/data/user"
import { COMMUNITY_REWARDS } from "@/data/growth"
import { useAuth } from "@/lib/AuthContext"
import { readAppAuth } from "@/lib/app-auth"

type TemplateKey = "实战复盘" | "踩坑记录" | "任务成果" | "AI 分析" | "问题求助"

const templates: Record<TemplateKey, { title: string; tags: string; content: string; hint: string }> = {
  实战复盘: {
    title: "我用 AI 完成了一个真实任务：",
    tags: "实战复盘,工具组合,新手友好",
    hint: "适合沉淀行业、目标、工具、步骤、提示词、成本、效果和坑点。",
    content:
      "我是谁/行业是什么：例如：做电商客服 / 老师 / 设计师 / 门店老板\n\n我要解决什么问题：例如：把客户常问问题整理成可复用话术\n\n我用了哪些工具：\n1. 工具名称：用来做什么\n2. 工具名称：用来检查什么\n\n具体步骤：\n第一步：我先准备了……\n第二步：我把这些内容发给 AI，让它……\n第三步：我人工检查了……\n\n可复制提示词：\n把你用过的提示词贴在这里，别人可以直接复制。\n\n花了多少钱/多久：例如：0 元，20 分钟\n\n最后效果：例如：生成了 20 条客服回复，已经能直接复制改用\n\n踩坑和建议：例如：不要一次丢太多材料，先让 AI 输出提纲再补充\n\n适合谁照着做：例如：和我一样刚开始用 AI 做日常工作的人\n",
  },
  踩坑记录: {
    title: "我在使用 AI 时踩过的坑：",
    tags: "踩坑记录,排错,避坑",
    hint: "适合记录报错、失败经验、绕弯路后的正确做法。",
    content:
      "问题现象：\n我当时看到的报错/异常是……\n\n错误原因：\n后来发现是因为……\n\n解决步骤：\n1. \n2. \n3. \n\n最终结果：\n\n提醒大家：\n",
  },
  任务成果: {
    title: "我完成了小白 AI 的一个 0-1 任务：",
    tags: "任务成果,0-1,成长任务",
    hint: "适合把学习首页或 /missions 里的任务结果发出来，形成可复制案例。",
    content:
      "选择的任务：例如：用 AI 做一页工作汇报 / 做一张海报 / 整理一份客户资料\n\n为什么选它：例如：这是我今天工作里真的需要完成的一件事\n\n准备材料：例如：原始文档、截图、产品介绍、客户问题\n\n我做到的环节：例如：已经生成初稿，并人工改完第一版\n\n用到的工具：例如：Kimi / DeepSeek / Claude Code / Dify\n\n最终交付物：例如：一份文档、一张图、一段可复制话术、一个网页\n\n完成后获得的收获：例如：知道了怎么给 AI 提供材料和检查结果\n\n下一步想挑战：例如：把这个流程做成模板，下次更快复用\n",
  },
  "AI 分析": {
    title: "AI 能不能做这件事？我的可行性分析：",
    tags: "AI分析,可行性,场景拆解",
    hint: "适合分析一个需求是否能被 AI 做到，以及需要什么条件。",
    content:
      "需求描述：\n我想让 AI 做……例如：帮我把门店活动做成海报、文案和朋友圈发布计划。\n\n可行结论：\n能做 / 部分能做 / 暂时不建议做。我的判断是：……\n\n为什么：\n1. AI 可以帮我完成……\n2. 还需要我自己提供……\n3. 最后必须人工检查……\n\n推荐方案：\n1. 先准备材料：把目标、客户、产品、限制条件写清楚。\n2. 再让 AI 输出第一版：先要提纲或方案，不要直接要最终稿。\n3. 最后人工确认：检查事实、价格、联系方式、版权和隐私。\n\n风险和限制：\n1. AI 可能编造信息，需要人工核对。\n2. 涉及客户隐私、账号密码、合同数据时不要直接上传。\n3. 重要决策不能只靠 AI，一定要有人负责最后判断。\n\n适合谁：例如：想先判断一件事能不能用 AI 做的新手\n",
  },
  问题求助: {
    title: "我想让 AI 帮我解决这个需求：",
    tags: "问题求助,需求分析,新手提问",
    hint: "适合把你的真实需求发出来，让社区帮你拆解。",
    content:
      "我的目标：例如：我想用 AI 做一份产品介绍 PPT\n\n当前材料：例如：有产品图片、价格表、卖点文档，没有设计稿\n\n我试过的工具：例如：DeepSeek / Kimi / Canva / WPS AI\n\n卡住点：例如：不知道第一步该让 AI 输出什么，也不知道怎么检查好坏\n\n预算/网络限制：例如：只想用免费工具 / 可以接受每月 50 元 / 只能用国内可访问工具\n\n希望社区帮我判断：\n1. 该用什么工具？\n2. 第一环节怎么开始？\n3. 有没有更简单的方案？\n",
  },
}

function polishDraft(title: string, content: string, cat: TemplateKey) {
  const source = content.trim()
  if (!source) return templates[cat].content
  const lines = source.split(/\n+/).map((line) => line.trim()).filter(Boolean)
  const body = lines.map((line) => (line.match(/^[0-9一二三四五六七八九十]+[.、]/) ? line : `- ${line}`)).join("\n")
  return `这是一篇关于「${title || templates[cat].title}」的社区投稿草稿。\n\n背景\n${templates[cat].hint}\n\n核心内容\n${body}\n\n可复用步骤\n1. 先明确目标和输入材料。\n2. 再选择最少数量的 AI 工具跑通流程。\n3. 最后保留人工检查环节，避免错误结果直接进入正式业务。\n\n给新手的提醒\n如果你也想照着做，建议先用一个小任务测试，不要一开始就把重要数据、账号权限或客户沟通完全交给 AI。`
}

export default function NewPostPage() {
  const router = useRouter()
  const { user, refresh } = useAuth()
  const [title, setTitle] = useState(templates["实战复盘"].title)
  const [content, setContent] = useState(templates["实战复盘"].content)
  const [cat, setCat] = useState<TemplateKey>("实战复盘")
  const [tags, setTags] = useState(templates["实战复盘"].tags)
  const [author, setAuthor] = useState("")
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState("")
  const [done, setDone] = useState(false)
  const [polished, setPolished] = useState("")
  const [awarded, setAwarded] = useState(0)

  const selectedTemplate = useMemo(() => templates[cat], [cat])
  const userLevel = getUserLevel(Number(user?.xp || 0))

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
      <div style={{ background: "#000", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ textAlign: "center", maxWidth: 460, border: "1px solid #1a1a1a", borderRadius: 14, padding: 34, background: "rgba(255,255,255,0.03)" }}>
          <FileText size={42} style={{ color: "#e8c96a", marginBottom: 16 }} />
          <h2 style={{ fontSize: 22, color: "#fff", marginBottom: 10 }}>投稿已提交，等待审核</h2>
          <p style={{ fontSize: 14, color: "#aaa", lineHeight: 1.8, marginBottom: 18 }}>
            {user ? `帖子通过审核后会自动发放奖励：实战复盘/任务成果 +${COMMUNITY_REWARDS.practicalCaseApprovedXP}XP，验证可行后再 +${COMMUNITY_REWARDS.practicalCaseVerifiedXP}XP；问题求助帖 +${COMMUNITY_REWARDS.questionPostApprovedXP}XP，普通经验帖 +${COMMUNITY_REWARDS.normalPostApprovedXP}XP。` : "帖子已提交；登录用户的帖子通过审核后才会领取奖励。"}
            达到共创后不再靠 XP 升级，改为累计贡献值。
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }} className="max-sm:grid-cols-1">
            <button onClick={() => router.push("/growth")} className="btn-primary">看今日排名</button>
            <button onClick={() => router.push("/community")} className="btn-outline">返回社区</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: "#000", minHeight: "100vh", fontFamily: "'Noto Sans SC', sans-serif", position: "relative", overflow: "hidden" }}>
      <MathRain />
      <NavBar />
      <main style={{ maxWidth: 980, margin: "0 auto", padding: "60px 60px 100px", position: "relative", zIndex: 10, background: "rgba(0,0,0,0.86)" }} className="max-sm:px-4">
        <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.35em", color: "#7a6230", textTransform: "uppercase", marginBottom: 10, fontWeight: 800 }}>Community Draft</p>
        <h1 style={{ fontSize: 34, fontWeight: 950, color: "#fff", marginBottom: 10 }}>发布 AI 实战复盘</h1>
        <p style={{ fontSize: 14, color: "#bbb", lineHeight: 1.9, marginBottom: 16 }}>这里不是普通灌水区。请把“行业、目标、工具、步骤、提示词、成本、效果、坑点”写清楚，让后来的人能照着完成第一步。不要发布 API Key、账号密码、客户隐私和未授权内容。</p>
        <div style={{ border: "1px solid rgba(201,168,76,0.36)", borderRadius: 12, background: "rgba(201,168,76,0.055)", padding: "14px 16px", marginBottom: 18 }}>
          <p style={{ color: "#fff", fontSize: 14, fontWeight: 950, marginBottom: 5 }}>实战案例审核通过 +{COMMUNITY_REWARDS.practicalCaseApprovedXP}XP，验证可行后再 +{COMMUNITY_REWARDS.practicalCaseVerifiedXP}XP</p>
          <p style={{ color: "#d6c28a", fontSize: 12, lineHeight: 1.75 }}>越像真实复盘越容易通过：写清楚你是谁、想做什么、怎么做、花了多久、最后效果如何、别人照着做要注意什么。共创用户不再刷 XP，改记贡献值。</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "center", border: "1px solid rgba(201,168,76,0.35)", borderRadius: 12, background: "rgba(201,168,76,0.055)", padding: "14px 16px", marginBottom: 18 }} className="max-sm:grid-cols-1">
          <p style={{ color: "#ddd", fontSize: 13, lineHeight: 1.75 }}>
            当前身份：<b style={{ color: "#e8c96a" }}>{userLevel.name}</b>。继续完成任务后，帖子会逐步带上高阶身份高亮；更高阶用户的评论和帖子会优先展示，共创身份会单独露出。
          </p>
          <button type="button" onClick={() => router.push("/growth")} className="btn-outline" style={{ whiteSpace: "nowrap" }}>去升级</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "0.85fr 1.15fr", gap: 16 }} className="max-sm:grid-cols-1">
          <aside style={{ border: "1px solid #1a1a1a", borderRadius: 12, background: "rgba(255,255,255,0.03)", padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <Lightbulb size={16} style={{ color: "#e8c96a" }} />
              <h2 style={{ fontSize: 15, color: "#fff", fontWeight: 900 }}>复盘模板</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {(Object.keys(templates) as TemplateKey[]).map((key) => (
                <button key={key} onClick={() => applyTemplate(key)} style={{ textAlign: "left", border: `1px solid ${cat === key ? "#7a6230" : "#242424"}`, background: cat === key ? "rgba(201,168,76,0.1)" : "rgba(0,0,0,0.22)", color: cat === key ? "#e8c96a" : "#ccc", borderRadius: 8, padding: "11px 12px", cursor: "pointer" }}>
                  <p style={{ fontSize: 13, fontWeight: 900 }}>{key}</p>
                  <p style={{ fontSize: 11, color: "#888", lineHeight: 1.6, marginTop: 3 }}>{templates[key].hint}</p>
                </button>
              ))}
            </div>
          </aside>

          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="帖子标题" className="form-input" autoFocus />
            <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 12 }} className="max-sm:grid-cols-1">
              <select value={cat} onChange={(e) => applyTemplate(e.target.value as TemplateKey)} className="form-input" style={{ color: "#ccc" }}>
                {(Object.keys(templates) as TemplateKey[]).map((key) => <option key={key} value={key}>{key}</option>)}
              </select>
              <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="标签，用英文逗号分隔" className="form-input" />
            </div>
            <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="昵称或邮箱，不填则匿名" className="form-input" />
            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder={selectedTemplate.content} rows={15} className="form-input" />

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button type="button" onClick={() => setPolished(polishDraft(title, content, cat))} className="btn-outline" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <Sparkles size={15} /> AI 润色草稿
              </button>
              {polished && (
                <button type="button" onClick={() => { setContent(polished); setPolished("") }} className="btn-outline">使用润色版本</button>
              )}
              <button type="submit" disabled={busy} className="btn-primary" style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 8 }}>
                <Send size={15} /> {busy ? "提交中..." : "提交审核"}
              </button>
            </div>

            {polished && (
              <div style={{ border: "1px solid #2a1f10", borderRadius: 10, padding: 16, background: "rgba(201,168,76,0.04)" }}>
                <p style={{ color: "#e8c96a", fontSize: 12, fontWeight: 900, marginBottom: 8 }}>润色预览</p>
                <p style={{ color: "#ddd", fontSize: 13, lineHeight: 1.8, whiteSpace: "pre-line" }}>{polished}</p>
              </div>
            )}
            {err && <p style={{ fontSize: 12, color: "#D94841" }}>{err}</p>}
          </form>
        </div>
      </main>
    </div>
  )
}
