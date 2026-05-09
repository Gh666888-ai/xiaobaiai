"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowRight, Check, Clipboard, Code2, Eye, RefreshCcw, Save, Sparkles } from "lucide-react"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"
import {
  APP_FACTORY_STORAGE_KEY,
  appTemplates,
  buildBusinessBlueprint,
  generateAppHtml,
  type AppTemplateId,
  type SavedGeneratedApp,
} from "@/data/app-templates"

const styleOptions = ["简洁科技", "高端商务", "温暖亲切", "活泼活动"]

const templatePlaybooks: Record<
  AppTemplateId,
  {
    icon: string
    mode: string
    output: string
    when: string
    preview: string
    userFeels: string
    accent: string
    chips: string[]
  }
> = {
  "site-hero": {
    icon: "01",
    mode: "官网首屏",
    output: "生成一页能讲清业务的门面：主张、指标、信任证明、下一步动作。",
    when: "客户还不知道你是谁，先让他 10 秒内判断值不值得继续看。",
    preview: "会看到大标题、业务指标、转化路径和一个像增长中控的展示区。",
    userFeels: "像一个正式官网的第一屏，不是普通介绍卡片。",
    accent: "#76b39d",
    chips: ["品牌门面", "信任证明", "转化路径"],
  },
  "lead-form": {
    icon: "02",
    mode: "预约漏斗",
    output: "生成一个会筛选客户的表单：字段、填写原因、提交后的跟进动作。",
    when: "你需要收集报名、预约、咨询线索，不能只让用户填姓名电话。",
    preview: "会看到完整表单，每个字段都解释为什么要问，提交后进入跟进。",
    userFeels: "像一个小型获客系统，不是问卷。",
    accent: "#d8bf76",
    chips: ["关键字段", "线索筛选", "跟进提醒"],
  },
  "quote-calculator": {
    icon: "03",
    mode: "报价系统",
    output: "生成能互动估价的报价器：套餐、数量、服务深度、自动计算价格。",
    when: "客户总问多少钱，你要先给预算范围，再引导咨询确认。",
    preview: "会看到可选择套餐、输入数量、点击重新估算的交互面板。",
    userFeels: "像一个可用的报价工具，不是价格表。",
    accent: "#86a8e7",
    chips: ["自动估价", "套餐分层", "预算感"],
  },
  "product-page": {
    icon: "04",
    mode: "成交页",
    output: "生成一个产品/服务成交页：卖点、套餐、购买理由、信任解释。",
    when: "你要卖一个商品、课程、服务套餐，让用户看完就知道买哪档。",
    preview: "会看到推荐套餐、购买理由、适合人群和行动按钮。",
    userFeels: "像一张能卖货的详情页，不是产品简介。",
    accent: "#e89f71",
    chips: ["套餐推荐", "购买理由", "行动按钮"],
  },
  "click-game": {
    icon: "05",
    mode: "活动游戏",
    output: "生成一个能玩的互动活动：倒计时、点击得分、奖励门槛、结束引导。",
    when: "你要做门店福利、引流活动、社群小游戏，让用户先参与。",
    preview: "会看到分数、倒计时、点击按钮和结束后的领取动作。",
    userFeels: "像一个轻量活动页，不是静态宣传页。",
    accent: "#c7a8ff",
    chips: ["能点击", "有倒计时", "领福利"],
  },
}

export function AppsClient() {
  const [templateId, setTemplateId] = useState<AppTemplateId>("site-hero")
  const [industry, setIndustry] = useState("餐饮门店")
  const [goal, setGoal] = useState("让附近用户看懂特色菜品并愿意加微信预约")
  const [audience, setAudience] = useState("附近 3 公里内想找聚餐位置的用户")
  const [style, setStyle] = useState(styleOptions[0])
  const [contact, setContact] = useState("立即咨询")
  const [savedApps, setSavedApps] = useState<SavedGeneratedApp[]>([])
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [previewUrl, setPreviewUrl] = useState("")

  const currentTemplate = appTemplates.find((item) => item.id === templateId) || appTemplates[0]
  const currentPlaybook = templatePlaybooks[templateId]
  const blueprint = useMemo(
    () => buildBusinessBlueprint({ templateId, industry, goal, audience, style, contact }),
    [audience, contact, goal, industry, style, templateId],
  )
  const generatedHtml = useMemo(
    () => generateAppHtml({ templateId, industry, goal, audience, style, contact }),
    [audience, contact, goal, industry, style, templateId],
  )

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(APP_FACTORY_STORAGE_KEY)
      setSavedApps(raw ? JSON.parse(raw) : [])
    } catch {
      setSavedApps([])
    }
  }, [])

  useEffect(() => {
    const blob = new Blob([generatedHtml], { type: "text/html;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [generatedHtml])

  function persist(next: SavedGeneratedApp[]) {
    setSavedApps(next)
    window.localStorage.setItem(APP_FACTORY_STORAGE_KEY, JSON.stringify(next))
  }

  function saveApp() {
    const nextApp: SavedGeneratedApp = {
      id: `${Date.now()}`,
      title: `${industry || "我的"}${currentTemplate.shortTitle}`,
      templateId,
      industry,
      goal,
      audience,
      style,
      contact,
      html: generatedHtml,
      createdAt: new Date().toISOString(),
    }
    persist([nextApp, ...savedApps].slice(0, 12))
    setSaved(true)
    window.setTimeout(() => setSaved(false), 1500)
  }

  async function copyHtml() {
    try {
      await navigator.clipboard.writeText(generatedHtml)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  function loadSaved(app: SavedGeneratedApp) {
    setTemplateId(app.templateId)
    setIndustry(app.industry)
    setGoal(app.goal)
    setAudience(app.audience)
    setStyle(app.style)
    setContact(app.contact)
  }

  function selectTemplate(nextTemplateId: AppTemplateId) {
    const nextTemplate = appTemplates.find((item) => item.id === nextTemplateId)
    const shouldUseTemplateGoal =
      !goal.trim() || appTemplates.some((template) => template.id === templateId && template.defaultGoal === goal)
    setTemplateId(nextTemplateId)
    if (shouldUseTemplateGoal && nextTemplate) {
      setGoal(nextTemplate.defaultGoal)
    }
  }

  return (
    <div className="xb-workbench" style={{ minHeight: "100vh", fontFamily: "'Noto Sans SC', sans-serif", position: "relative", overflow: "hidden" }}>
      <MathRain />
      <NavBar />
      <main className="xb-workbench-main" style={{ maxWidth: 1240, margin: "0 auto", padding: "54px clamp(16px,5vw,54px) 90px", position: "relative", zIndex: 10 }}>
        <section style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 18, alignItems: "end", marginBottom: 22 }} className="apps-head">
          <div>
            <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.26em", color: "#7a6230", textTransform: "uppercase", fontWeight: 950, marginBottom: 10 }}>XIAOBAI APP FACTORY</p>
            <h1 style={{ color: "#f8f3e6", fontSize: "clamp(34px,5vw,58px)", lineHeight: 1.08, fontWeight: 950, marginBottom: 12 }}>小白应用工坊</h1>
            <p style={{ color: "#c8c8bd", fontSize: 16, lineHeight: 1.9, maxWidth: 820 }}>
              这里不是讲教程。你说行业和目标，小白先在站内做出一个能打开的小应用：网站首屏、报名表、报价器、商品页或小游戏。
            </p>
          </div>
          <div style={{ border: "1px solid rgba(216,191,118,0.24)", background: "rgba(216,191,118,0.08)", borderRadius: 14, padding: "14px 16px", minWidth: 176 }}>
            <p style={{ color: "#d8bf76", fontSize: 14, fontWeight: 950, marginBottom: 5 }}>当前阶段</p>
            <p style={{ color: "#f8f3e6", fontSize: 18, fontWeight: 950 }}>H5 小应用</p>
            <p style={{ color: "#c8c8bd", fontSize: 13, lineHeight: 1.65, marginTop: 5 }}>先跑通预览和保存，再升级完整 App。</p>
          </div>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "390px 1fr", gap: 16, alignItems: "start" }} className="apps-shell">
          <aside style={{ display: "grid", gap: 14 }}>
            <section style={panelStyle}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
                <p style={{ ...labelStyle, marginBottom: 0 }}>选择小应用类型</p>
                <span style={{ color: "#a99a70", fontSize: 12, fontWeight: 950, display: "inline-flex", alignItems: "center", gap: 5 }}>
                  <RefreshCcw size={13} /> 切换即重生成
                </span>
              </div>
              <div style={{ display: "grid", gap: 9 }}>
                {appTemplates.map((template) => {
                  const active = template.id === templateId
                  const playbook = templatePlaybooks[template.id]
                  return (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => selectTemplate(template.id)}
                      style={{
                        textAlign: "left",
                        border: active ? `1px solid ${playbook.accent}` : "1px solid rgba(255,255,255,0.11)",
                        background: active ? `linear-gradient(135deg,${playbook.accent}24,rgba(255,255,255,0.045))` : "rgba(255,255,255,0.035)",
                        boxShadow: active ? `0 16px 42px ${playbook.accent}18` : "none",
                        borderRadius: 14,
                        padding: "14px",
                        cursor: "pointer",
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 9 }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ width: 34, height: 34, borderRadius: 12, display: "grid", placeItems: "center", background: `${playbook.accent}22`, color: playbook.accent, fontSize: 13, fontWeight: 950 }}>
                            {playbook.icon}
                          </span>
                          <span>
                            <span style={{ color: active ? "#fff4c9" : "#f8f3e6", fontSize: 16, fontWeight: 950, display: "block", marginBottom: 2 }}>{playbook.mode}</span>
                            <span style={{ color: "#9f9785", fontSize: 12, fontWeight: 900 }}>{template.shortTitle} · {template.bestFor}</span>
                          </span>
                        </span>
                        <ArrowRight size={15} color={active ? playbook.accent : "#6d6a61"} />
                      </span>
                      <span style={{ color: "#f1ead8", fontSize: 13, lineHeight: 1.65, fontWeight: 850, display: "block" }}>{playbook.output}</span>
                      <span style={{ color: "#b9b4a8", fontSize: 12, lineHeight: 1.65, display: "block", marginTop: 6 }}>适合：{playbook.when}</span>
                      <span style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
                        {playbook.chips.map((chip) => (
                          <span key={chip} style={{ border: `1px solid ${playbook.accent}33`, background: `${playbook.accent}14`, color: active ? "#fff4c9" : "#d8d2c5", borderRadius: 999, padding: "5px 8px", fontSize: 12, fontWeight: 950 }}>
                            {chip}
                          </span>
                        ))}
                      </span>
                    </button>
                  )
                })}
              </div>
            </section>

            <section style={panelStyle}>
              <p style={labelStyle}>先把真实业务说清楚</p>
              <Field label="行业/业务" value={industry} onChange={setIndustry} placeholder="例如：餐饮门店、教育培训、电商、装修" />
              <Field label="目标用户" value={audience} onChange={setAudience} placeholder="例如：附近客户、家长、企业老板" />
              <Field label="想达成什么" value={goal} onChange={setGoal} placeholder={currentTemplate.defaultGoal} textarea />
              <Field label="按钮/联系方式" value={contact} onChange={setContact} placeholder="例如：立即咨询、加微信、预约体验" />
              <div style={{ marginTop: 12 }}>
                <p style={{ color: "#f8f3e6", fontSize: 14, fontWeight: 950, marginBottom: 8 }}>风格</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {styleOptions.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setStyle(item)}
                      style={{
                        border: style === item ? "1px solid rgba(216,191,118,0.55)" : "1px solid rgba(255,255,255,0.12)",
                        background: style === item ? "rgba(216,191,118,0.14)" : "rgba(255,255,255,0.04)",
                        color: style === item ? "#f8e3a1" : "#d7d7d7",
                        borderRadius: 999,
                        padding: "9px 12px",
                        fontSize: 14,
                        fontWeight: 950,
                        cursor: "pointer",
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
                <button type="button" onClick={saveApp} style={primaryButtonStyle}>
                  {saved ? <Check size={15} /> : <Save size={15} />} {saved ? "已保存" : "保存应用"}
                </button>
                <button type="button" onClick={copyHtml} style={secondaryButtonStyle}>
                  {copied ? <Check size={15} /> : <Clipboard size={15} />} {copied ? "已复制" : "复制代码"}
                </button>
              </div>
            </section>

            <section style={panelStyle}>
              <p style={labelStyle}>小白拆出的业务方案</p>
              <div style={{ display: "grid", gap: 10 }}>
                <BlueprintRow title="行业判断" value={blueprint.sector} />
                <BlueprintRow title="核心钩子" value={blueprint.hook} />
                <BlueprintRow title="用户顾虑" value={blueprint.userPain} />
                <BlueprintRow title="应用目标" value={blueprint.appGoal} />
              </div>
              <div style={{ marginTop: 13 }}>
                <p style={{ color: "#f8f3e6", fontSize: 14, fontWeight: 950, marginBottom: 8 }}>这版会放进去的内容</p>
                <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                  {[...blueprint.trustProof, ...blueprint.captureFields.slice(0, 3)].map((item) => (
                    <span key={item} style={{ border: "1px solid rgba(216,191,118,0.22)", background: "rgba(216,191,118,0.07)", color: "#e6d59d", borderRadius: 999, padding: "7px 10px", fontSize: 13, fontWeight: 900 }}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.035)", borderRadius: 12, padding: "12px 13px", marginTop: 13 }}>
                <p style={{ color: "#d8bf76", fontSize: 13, fontWeight: 950, marginBottom: 5 }}>上线后下一步</p>
                <p style={{ color: "#c8c8bd", fontSize: 14, lineHeight: 1.7 }}>{blueprint.nextWorkflow}</p>
              </div>
            </section>

            {savedApps.length > 0 && (
              <section style={panelStyle}>
                <p style={labelStyle}>本机保存</p>
                <div style={{ display: "grid", gap: 8 }}>
                  {savedApps.slice(0, 5).map((app) => (
                    <button key={app.id} type="button" onClick={() => loadSaved(app)} style={savedButtonStyle}>
                      <span style={{ color: "#f8f3e6", fontWeight: 950 }}>{app.title}</span>
                      <span style={{ color: "#9f9f96", fontSize: 13 }}>{new Date(app.createdAt).toLocaleString("zh-CN")}</span>
                    </button>
                  ))}
                </div>
              </section>
            )}
          </aside>

          <section style={{ display: "grid", gap: 14 }}>
            <div style={{ ...panelStyle, padding: "16px 16px 18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 12 }}>
                <div>
                  <p style={{ color: "#d8bf76", fontSize: 14, fontWeight: 950, marginBottom: 4 }}>实时预览</p>
                  <h2 style={{ color: "#f8f3e6", fontSize: 22, fontWeight: 950 }}>{industry || "我的"} · {currentPlaybook.mode}</h2>
                  <p style={{ color: "#aaa69b", fontSize: 13, lineHeight: 1.6, marginTop: 4 }}>{currentPlaybook.preview}</p>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span style={miniPillStyle}><Eye size={13} /> 站内预览</span>
                  <span style={{ ...miniPillStyle, borderColor: `${currentPlaybook.accent}40`, color: "#fff4c9" }}>{currentPlaybook.userFeels}</span>
                  <span style={miniPillStyle}><Code2 size={13} /> 可复制 HTML</span>
                </div>
              </div>
              <div style={{ border: "1px solid rgba(255,255,255,0.12)", borderRadius: 18, overflow: "hidden", background: "#fff", minHeight: 560 }}>
                {previewUrl ? (
                  <iframe title="小白应用预览" sandbox="allow-scripts" src={previewUrl} style={{ width: "100%", height: 620, border: 0, display: "block" }} />
                ) : (
                  <div style={{ height: 620, display: "grid", placeItems: "center", color: "#111", fontSize: 16, fontWeight: 900 }}>正在生成预览...</div>
                )}
              </div>
            </div>

            <section style={{ ...panelStyle, display: "grid", gridTemplateColumns: "1fr auto", gap: 14, alignItems: "center" }} className="apps-next">
              <div>
                <p style={{ color: "#f8f3e6", fontSize: 18, fontWeight: 950, marginBottom: 6 }}>下一步可以怎么升级？</p>
                <p style={{ color: "#c8c8bd", fontSize: 14, lineHeight: 1.75 }}>
                  第一版先生成静态 H5。后面可以接账号保存、公开分享链接、接真实表单，再升级到公司工作流。
                </p>
              </div>
              <button type="button" onClick={() => window.dispatchEvent(new CustomEvent("xiaobai:open-goal-router"))} style={primaryButtonStyle}>
                让小白继续改 <Sparkles size={15} />
              </button>
            </section>
          </section>
        </section>

        <style>{`
          @media (max-width: 980px) {
            .apps-shell, .apps-head, .apps-next { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </main>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  textarea,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  textarea?: boolean
}) {
  return (
    <label style={{ display: "block", marginTop: 12 }}>
      <span style={{ color: "#f8f3e6", fontSize: 14, fontWeight: 950, display: "block", marginBottom: 7 }}>{label}</span>
      {textarea ? (
        <textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} rows={4} style={inputStyle} />
      ) : (
        <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} style={inputStyle} />
      )}
    </label>
  )
}

function BlueprintRow({ title, value }: { title: string; value: string }) {
  return (
    <div style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.035)", borderRadius: 12, padding: "11px 12px" }}>
      <p style={{ color: "#d8bf76", fontSize: 13, fontWeight: 950, marginBottom: 4 }}>{title}</p>
      <p style={{ color: "#f8f3e6", fontSize: 14, fontWeight: 850, lineHeight: 1.65 }}>{value}</p>
    </div>
  )
}

const panelStyle = {
  border: "1px solid rgba(233,215,165,0.14)",
  background: "rgba(244,240,226,0.045)",
  borderRadius: 16,
  padding: "18px 20px",
} as const

const labelStyle = {
  color: "#d8bf76",
  fontSize: 14,
  fontWeight: 950,
  marginBottom: 12,
} as const

const inputStyle = {
  width: "100%",
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.055)",
  borderRadius: 12,
  padding: "12px 13px",
  color: "#f8f3e6",
  fontSize: 15,
  fontWeight: 800,
  outline: "none",
  fontFamily: "'Noto Sans SC', sans-serif",
  resize: "vertical",
} as const

const primaryButtonStyle = {
  border: "1px solid rgba(216,191,118,0.44)",
  background: "linear-gradient(180deg,rgba(216,191,118,0.22),rgba(151,126,58,0.16))",
  color: "#fff4c9",
  borderRadius: 12,
  padding: "12px 15px",
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  fontSize: 15,
  fontWeight: 950,
  cursor: "pointer",
} as const

const secondaryButtonStyle = {
  border: "1px solid rgba(255,255,255,0.13)",
  background: "rgba(255,255,255,0.045)",
  color: "#e6e2d8",
  borderRadius: 12,
  padding: "12px 15px",
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  fontSize: 15,
  fontWeight: 950,
  cursor: "pointer",
} as const

const miniPillStyle = {
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.04)",
  color: "#d7d7d7",
  borderRadius: 999,
  padding: "8px 11px",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  fontSize: 13,
  fontWeight: 950,
} as const

const savedButtonStyle = {
  border: "1px solid rgba(255,255,255,0.11)",
  background: "rgba(255,255,255,0.035)",
  borderRadius: 12,
  padding: "11px 12px",
  display: "grid",
  gap: 3,
  textAlign: "left",
  cursor: "pointer",
} as const
