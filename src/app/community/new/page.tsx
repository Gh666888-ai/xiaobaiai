"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { FileText, Lightbulb, Send, Sparkles } from "lucide-react"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"
import { getUserLevel } from "@/data/user"
import { useAuth } from "@/lib/AuthContext"
import { readAppAuth } from "@/lib/app-auth"

type TemplateKey = "经验分享" | "踩坑记录" | "自动化实战" | "AI 分析" | "问题求助"

const templates: Record<TemplateKey, { title: string; tags: string; content: string; hint: string }> = {
  经验分享: {
    title: "我用 AI 解决了一个真实问题：",
    tags: "经验分享,工具推荐,新手友好",
    hint: "适合分享你已经跑通的方法、工具组合和效果。",
    content:
      "背景：\n我遇到的问题是……\n\n使用的工具：\n1. \n2. \n\n具体做法：\n第一步：\n第二步：\n第三步：\n\n结果：\n节省了多少时间、成本或精力？\n\n给新手的建议：\n",
  },
  踩坑记录: {
    title: "我在使用 AI 时踩过的坑：",
    tags: "踩坑记录,排错,避坑",
    hint: "适合记录报错、失败经验、绕弯路后的正确做法。",
    content:
      "问题现象：\n我当时看到的报错/异常是……\n\n错误原因：\n后来发现是因为……\n\n解决步骤：\n1. \n2. \n3. \n\n最终结果：\n\n提醒大家：\n",
  },
  自动化实战: {
    title: "我搭了一个 AI 自动化流程：",
    tags: "自动化实战,Agent,工作流",
    hint: "适合分享 Agent、Dify、n8n、QClaw、OpenClaw 等流程。",
    content:
      "自动化目标：\n我想让 AI 自动完成……\n\n流程设计：\n触发条件：\n处理步骤：\n输出结果：\n人工审核点：\n\n使用工具：\n\n实际效果：\n\n还能优化的地方：\n",
  },
  "AI 分析": {
    title: "AI 能不能做这件事？我的可行性分析：",
    tags: "AI分析,可行性,场景拆解",
    hint: "适合分析一个需求是否能被 AI 做到，以及需要什么条件。",
    content:
      "需求描述：\n我想让 AI 做……\n\n可行结论：\n能做 / 部分能做 / 暂时不建议做\n\n为什么：\n1. \n2. \n3. \n\n推荐方案：\n\n风险和限制：\n\n适合谁：\n",
  },
  问题求助: {
    title: "我想让 AI 帮我解决这个需求：",
    tags: "问题求助,需求分析,新手提问",
    hint: "适合把你的真实需求发出来，让社区帮你拆解。",
    content:
      "我的目标：\n\n现在的情况：\n\n我已经试过：\n\n卡住的地方：\n\n希望大家帮我判断：\n1. 该用什么工具？\n2. 大概怎么搭？\n3. 有没有更简单的方案？\n",
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
  const { user } = useAuth()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [cat, setCat] = useState<TemplateKey>("经验分享")
  const [tags, setTags] = useState(templates["经验分享"].tags)
  const [author, setAuthor] = useState("")
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState("")
  const [done, setDone] = useState(false)
  const [polished, setPolished] = useState("")

  const selectedTemplate = useMemo(() => templates[cat], [cat])
  const userLevel = getUserLevel(Number(user?.xp || 0))

  useEffect(() => {
    const auth = readAppAuth()
    if (auth?.user) setAuthor(auth.user.name || auth.user.email || "")
  }, [])

  const applyTemplate = (nextCat: TemplateKey) => {
    setCat(nextCat)
    setTags(templates[nextCat].tags)
    if (!title.trim()) setTitle(templates[nextCat].title)
    if (!content.trim()) setContent(templates[nextCat].content)
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
      if (!res.ok) {
        const data = await res.json()
        setErr(data.error || "发布失败")
        setBusy(false)
        return
      }
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
          <p style={{ fontSize: 14, color: "#aaa", lineHeight: 1.8, marginBottom: 24 }}>通过后会展示在社区。审核前你可以继续整理下一篇案例，越真实、越可复用，越容易被设为精华。</p>
          <button onClick={() => router.push("/community")} className="btn-primary">返回社区</button>
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
        <h1 style={{ fontSize: 34, fontWeight: 950, color: "#fff", marginBottom: 10 }}>发布社区帖子</h1>
        <p style={{ fontSize: 14, color: "#bbb", lineHeight: 1.9, marginBottom: 28 }}>选择模板、填入你的真实经历，再用本地 AI 润色器整理结构。不要发布 API Key、账号密码、客户隐私和未授权内容。</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "center", border: "1px solid rgba(201,168,76,0.35)", borderRadius: 12, background: "rgba(201,168,76,0.055)", padding: "14px 16px", marginBottom: 18 }} className="max-sm:grid-cols-1">
          <p style={{ color: "#ddd", fontSize: 13, lineHeight: 1.75 }}>
            当前等级：<b style={{ color: "#e8c96a" }}>LV{userLevel.level} {userLevel.name}</b>。升到 LV3 后帖子会带高阶身份高亮，LV5 评论和帖子优先展示，LV7 显示共创者身份。
          </p>
          <button type="button" onClick={() => router.push("/growth")} className="btn-outline" style={{ whiteSpace: "nowrap" }}>去升级</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "0.85fr 1.15fr", gap: 16 }} className="max-sm:grid-cols-1">
          <aside style={{ border: "1px solid #1a1a1a", borderRadius: 12, background: "rgba(255,255,255,0.03)", padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <Lightbulb size={16} style={{ color: "#e8c96a" }} />
              <h2 style={{ fontSize: 15, color: "#fff", fontWeight: 900 }}>帖子模板</h2>
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
