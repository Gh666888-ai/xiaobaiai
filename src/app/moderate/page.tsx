"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Check, RefreshCw, Sparkles, Star, X } from "lucide-react"
import { loadSubmissions, updateSubmission, Submission } from "@/data/submissions"
import { addApprovedContribution, getContributor, getLevel } from "@/data/contributors"
import { readAppAuth } from "@/lib/app-auth"

type PostStatus = "pending" | "approved" | "rejected"

function reviewAdvice(post: any) {
  const content = post.content || ""
  const tags = Array.isArray(post.tags) ? post.tags : []
  const score = Math.min(100, Math.round(content.length / 18) + tags.length * 8 + (post.title?.length > 8 ? 12 : 0))
  if (score >= 80) return { label: "建议设为精华", color: "#3DA563", score }
  if (score >= 55) return { label: "可通过，建议补充细节", color: "#e8c96a", score }
  return { label: "内容偏短，建议退回修改", color: "#D94841", score }
}

function polishPreview(post: any) {
  return `标题：${post.title}\n\n审核建议：\n这篇帖子属于「${post.category || "未分类"}」，可以优先检查是否包含真实背景、具体步骤、工具名称、结果反馈和风险提醒。\n\n可优化点：\n1. 标题尽量说明结果或收益。\n2. 正文最好有步骤，方便新手照着做。\n3. 如果涉及自动化、账号权限、客户数据，需要补充安全提醒。`
}

export default function ModeratePage() {
  const [subs, setSubs] = useState<Submission[]>([])
  const [posts, setPosts] = useState<any[]>([])
  const [postStatus, setPostStatus] = useState<PostStatus>("pending")
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [filter, setFilter] = useState<"all" | "pending" | "auto_rejected" | "approved" | "rejected">("pending")
  const [preview, setPreview] = useState("")

  const refresh = () => setSubs(loadSubmissions())
  const loadPosts = (status = postStatus) => {
    const token = readAppAuth()?.session?.access_token
    setLoadingPosts(true)
    fetch(`/api/posts?status=${status}`, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined)
      .then((res) => res.json())
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .finally(() => setLoadingPosts(false))
  }

  useEffect(() => {
    refresh()
    loadPosts("pending")
  }, [])

  const filtered = subs.filter((item) => filter === "all" || item.status === filter)
  const counts = useMemo(() => ({
    pending: subs.filter((item) => item.status === "pending").length,
    auto_rejected: subs.filter((item) => item.status === "auto_rejected").length,
    approved: subs.filter((item) => item.status === "approved").length,
  }), [subs])

  const handleApprove = (id: string) => {
    const name = prompt("贡献者昵称：")?.trim()
    if (!name) return
    updateSubmission(id, { status: "approved" })
    addApprovedContribution(name)
    refresh()
    const contributor = getContributor(name)
    const level = getLevel(contributor?.approvedCount || 1)
    alert(`已通过：${name} | ${level.badge} ${level.name} | ${contributor?.approvedCount} 个通过`)
  }

  const patchPost = async (body: Record<string, unknown>) => {
    const token = readAppAuth()?.session?.access_token
    await fetch("/api/posts", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    })
    loadPosts()
  }

  return (
    <div style={{ background: "#000", minHeight: "100vh", fontFamily: "'Noto Sans SC', sans-serif", paddingBottom: 100 }}>
      <nav style={{ position: "sticky", top: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 60px", background: "rgba(0,0,0,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid #1a1a1a" }} className="max-sm:px-6">
        <Link href="/" style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.2em", color: "#c9a84c", fontFamily: "'JetBrains Mono', monospace", textDecoration: "none" }}>← 小白AI</Link>
        <button onClick={() => { refresh(); loadPosts() }} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#aaa", background: "none", border: "1px solid #1a1a1a", padding: "6px 14px", cursor: "pointer" }}><RefreshCw size={13} /> REFRESH</button>
      </nav>

      <main style={{ maxWidth: 1080, margin: "0 auto", padding: "60px 60px" }} className="max-sm:px-6">
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.4em", color: "#7a6230", textTransform: "uppercase", marginBottom: 12 }}>Moderation</p>
        <h1 style={{ fontSize: 34, fontWeight: 950, color: "#fff", letterSpacing: "0.03em", marginBottom: 8 }}>审核后台</h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.48)", marginBottom: 34 }}>投稿审核 · 社区帖子审核 · 精华/置顶管理 · AI 审核建议</p>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 2, background: "#1a1a1a", border: "1px solid #1a1a1a", marginBottom: 32 }} className="max-sm:grid-cols-2">
          {[
            { value: subs.length, label: "TOTAL", color: "#c9a84c" },
            { value: counts.pending, label: "PENDING", color: "#e8c96a" },
            { value: counts.auto_rejected, label: "REJECTED", color: "#D94841" },
            { value: counts.approved, label: "APPROVED", color: "#3DA563" },
          ].map((item) => (
            <div key={item.label} style={{ background: "rgba(255,255,255,0.02)", padding: "20px", textAlign: "center" }}>
              <p style={{ fontSize: 24, fontWeight: 900, color: item.color, fontFamily: "'JetBrains Mono',monospace" }}>{item.value}</p>
              <p style={{ fontSize: 9, color: "#555", marginTop: 4, fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.1em" }}>{item.label}</p>
            </div>
          ))}
        </section>

        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 19, fontWeight: 950, color: "#fff", marginBottom: 14 }}>工具/文章投稿审核</h2>
          <div style={{ display: "flex", gap: 4, marginBottom: 20, flexWrap: "wrap" }}>
            {(["all", "pending", "auto_rejected", "approved", "rejected"] as const).map((item) => (
              <button key={item} onClick={() => setFilter(item)} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, padding: "5px 12px", border: `1px solid ${filter === item ? "#7a6230" : "#1a1a1a"}`, color: filter === item ? "#c9a84c" : "#666", background: "transparent", cursor: "pointer", borderRadius: 6 }}>{item === "all" ? "ALL" : item.toUpperCase()}</button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: 48, color: "#555", border: "1px solid #1a1a1a" }}>No submissions</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 2, background: "#1a1a1a", border: "1px solid #1a1a1a" }}>
              {filtered.map((item) => (
                <div key={item.id} style={{ background: "rgba(255,255,255,0.02)", padding: 22 }}>
                  <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                    <span className={`tag ${item.status === "pending" ? "tag-gold" : item.status === "auto_rejected" ? "tag-red" : item.status === "approved" ? "tag-green" : "tag-gray"}`}>{item.status}</span>
                    <span className="tag tag-gray">{item.type === "tool" ? "TOOL" : "ARTICLE"}</span>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#555" }}>{item.submittedAt}</span>
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>{item.type === "tool" ? item.name : item.title}</p>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.46)", marginTop: 4 }}>{item.type === "tool" ? item.description : item.summary}</p>
                  {item.status === "pending" && (
                    <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                      <button onClick={() => handleApprove(item.id)} className="btn-primary"><Check size={14} /> 通过</button>
                      <button onClick={() => { const note = prompt("拒绝原因："); updateSubmission(item.id, { status: "rejected_by_admin", adminNote: note || undefined }); refresh() }} className="btn-outline" style={{ color: "#D94841", borderColor: "#3a1a1a" }}><X size={14} /> 拒绝</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
            <h2 style={{ fontSize: 19, fontWeight: 950, color: "#fff" }}>社区帖子审核</h2>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {(["pending", "approved", "rejected"] as PostStatus[]).map((status) => (
                <button key={status} onClick={() => { setPostStatus(status); loadPosts(status) }} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, padding: "6px 12px", border: `1px solid ${postStatus === status ? "#7a6230" : "#1a1a1a"}`, color: postStatus === status ? "#c9a84c" : "#666", background: "transparent", cursor: "pointer", borderRadius: 6 }}>{status.toUpperCase()}</button>
              ))}
              <button onClick={() => loadPosts()} className="btn-outline" style={{ fontSize: 11, padding: "6px 14px" }}>{loadingPosts ? "加载中..." : "刷新"}</button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: preview ? "1fr 0.75fr" : "1fr", gap: 14 }} className="max-sm:grid-cols-1">
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {posts.length === 0 && <p style={{ color: "#555", border: "1px solid #1a1a1a", padding: 36, textAlign: "center" }}>暂无帖子</p>}
              {posts.map((post) => {
                const advice = reviewAdvice(post)
                return (
                  <article key={post.id} style={{ background: "rgba(255,255,255,0.025)", border: "1px solid #1a1a1a", borderRadius: 12, padding: 18 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                      <span className="tag tag-gold">{post.category || "未分类"}</span>
                      {post.pinned && <span className="tag tag-blue">置顶</span>}
                      {post.featured && <span className="tag tag-green">精华</span>}
                      <span style={{ fontSize: 11, color: advice.color, fontWeight: 900 }}>AI 审核分 {advice.score} · {advice.label}</span>
                    </div>
                    <h3 style={{ color: "#fff", fontSize: 17, fontWeight: 900, lineHeight: 1.5 }}>{post.title}</h3>
                    <p style={{ color: "#888", fontSize: 12, marginTop: 6 }}>{post.author_name || post.author || "匿名"} · {post.published_at || post.publishedAt || post.created_at}</p>
                    <p style={{ color: "#ccc", fontSize: 13, lineHeight: 1.75, marginTop: 10, whiteSpace: "pre-wrap" }}>{(post.content || "").slice(0, 420)}{(post.content || "").length > 420 ? "..." : ""}</p>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 13 }}>
                      <button onClick={() => patchPost({ id: post.id, status: "approved" })} className="btn-primary" style={{ fontSize: 11, padding: "6px 13px" }}><Check size={13} /> 通过</button>
                      <button onClick={() => patchPost({ id: post.id, status: "rejected" })} className="btn-outline" style={{ fontSize: 11, padding: "6px 13px", color: "#D94841", borderColor: "#3a1a1a" }}><X size={13} /> 拒绝</button>
                      <button onClick={() => patchPost({ id: post.id, status: "approved", featured: true })} className="btn-outline" style={{ fontSize: 11, padding: "6px 13px" }}><Star size={13} /> 设精华</button>
                      <button onClick={() => patchPost({ id: post.id, status: "approved", pinned: true })} className="btn-outline" style={{ fontSize: 11, padding: "6px 13px" }}>置顶</button>
                      <button onClick={() => setPreview(polishPreview(post))} className="btn-outline" style={{ fontSize: 11, padding: "6px 13px" }}><Sparkles size={13} /> 审核建议</button>
                    </div>
                  </article>
                )
              })}
            </div>
            {preview && (
              <aside style={{ border: "1px solid #2a1f10", background: "rgba(201,168,76,0.04)", borderRadius: 12, padding: 18, height: "fit-content", position: "sticky", top: 84 }}>
                <p style={{ color: "#e8c96a", fontSize: 13, fontWeight: 900, marginBottom: 10 }}>AI 审核建议</p>
                <p style={{ color: "#ddd", fontSize: 13, lineHeight: 1.85, whiteSpace: "pre-line" }}>{preview}</p>
                <button onClick={() => setPreview("")} className="btn-outline" style={{ marginTop: 14 }}>关闭</button>
              </aside>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
