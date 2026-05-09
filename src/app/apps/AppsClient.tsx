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
    mode: "获客成交应用",
    output: "适合任何行业先获客：自动生成首页、预约、报价、成交、活动 5 个页面。",
    when: "用户只说“我想让客户了解我并留下线索”，就先用这个。",
    preview: "预览里默认打开首页，也能翻到预约、报价、成交和活动页。",
    userFeels: "像一个完整获客系统，不是官网首屏。",
    accent: "#76b39d",
    chips: ["首页", "线索", "跟进"],
  },
  "lead-form": {
    icon: "02",
    mode: "预约报名应用",
    output: "适合培训、门店、服务业：重点生成预约漏斗、关键字段和跟进说明。",
    when: "用户想让别人报名、预约、测评、到店、留电话，就选这个。",
    preview: "预览里默认打开预约页，但仍然带首页、报价、成交、活动页。",
    userFeels: "像一个预约报名系统，不是普通表单。",
    accent: "#d8bf76",
    chips: ["预约", "报名", "测评"],
  },
  "quote-calculator": {
    icon: "03",
    mode: "智能报价应用",
    output: "适合定制服务：重点生成预算器、套餐分层、数量和服务深度计算。",
    when: "用户总被问多少钱，需要先给大概预算再人工确认。",
    preview: "预览里默认打开报价页，价格能随套餐、数量和深度变化。",
    userFeels: "像一个报价引擎，不是价格表。",
    accent: "#86a8e7",
    chips: ["自动估价", "套餐分层", "预算感"],
  },
  "product-page": {
    icon: "04",
    mode: "产品成交应用",
    output: "适合卖商品、课程、服务套餐：重点生成购买理由、套餐和成交按钮。",
    when: "用户想让客户看完就知道买哪档、为什么买。",
    preview: "预览里默认打开成交页，并带购买理由和推荐套餐。",
    userFeels: "像一个成交货架，不是产品介绍。",
    accent: "#e89f71",
    chips: ["套餐推荐", "购买理由", "行动按钮"],
  },
  "click-game": {
    icon: "05",
    mode: "活动裂变应用",
    output: "适合做活动和引流：重点生成小游戏、倒计时、福利门槛和分享动作。",
    when: "用户想做节日活动、门店福利、社群裂变、直播预热。",
    preview: "预览里默认打开活动页，能看到倒计时、得分和福利引导。",
    userFeels: "像一个活动引擎，不是静态宣传页。",
    accent: "#c7a8ff",
    chips: ["能点击", "有倒计时", "领福利"],
  },
}

const demandExamples = [
  "我开了一家火锅店，想让附近的人看到套餐后加微信预约。",
  "我做少儿英语培训，想让家长先测评再报名试听。",
  "我做装修设计，客户老问多少钱，我想先让他自己估预算。",
  "我卖小红书课程，想让用户看懂适合谁并咨询购买。",
]

function guessTemplateFromDemand(text: string): AppTemplateId {
  const raw = text.toLowerCase()
  if (/报价|预算|估价|多少钱|价格|费用|装修|设计|摄影|家政|维修/.test(raw)) return "quote-calculator"
  if (/活动|抽奖|小游戏|裂变|分享|福利|打卡|直播预热|领券/.test(raw)) return "click-game"
  if (/卖|商品|课程|套餐|下单|购买|成交|会员|带货|小红书/.test(raw)) return "product-page"
  if (/报名|预约|试听|测评|留电话|咨询|到店|排队/.test(raw)) return "lead-form"
  return "site-hero"
}

function guessIndustryFromDemand(text: string) {
  const raw = text.trim()
  if (!raw) return "餐饮门店"
  if (/火锅|餐饮|饭店|烧烤|咖啡|奶茶|门店/.test(raw)) return "餐饮门店"
  if (/英语|培训|课程|老师|家长|学生|考研|教育/.test(raw)) return "教育培训"
  if (/装修|设计|摄影|婚礼|家政|维修|美容|美甲|健身/.test(raw)) return "本地服务"
  if (/电商|商品|淘宝|抖店|小红书|带货|直播|私域|卖/.test(raw)) return "电商/私域销售"
  const match = raw.match(/(?:我做|我开了?一家|我是做|做)([^，。,.]{2,12})/)
  return match?.[1]?.trim() || "通用业务"
}

function guessAudienceFromDemand(text: string) {
  if (/附近|周边|到店|门店/.test(text)) return "附近 3 公里内可能到店的用户"
  if (/家长|孩子|学生/.test(text)) return "正在帮孩子选择课程的家长"
  if (/老板|企业|公司|客户/.test(text)) return "正在比较方案和预算的客户"
  if (/粉丝|私域|社群|直播/.test(text)) return "社群和私域里的潜在用户"
  return "第一次了解你的潜在客户"
}

export function AppsClient() {
  const [templateId, setTemplateId] = useState<AppTemplateId>("site-hero")
  const [demand, setDemand] = useState("我开了一家火锅店，想让附近的人看到套餐后加微信预约")
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
      title: `${industry || "我的"} · ${currentTemplate.title}`,
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
    setDemand(`${app.industry}：${app.goal}`)
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

  function generateFromDemand(nextDemand = demand) {
    const text = nextDemand.trim()
    if (!text) return
    const nextTemplateId = guessTemplateFromDemand(text)
    setTemplateId(nextTemplateId)
    setIndustry(guessIndustryFromDemand(text))
    setAudience(guessAudienceFromDemand(text))
    setGoal(text)
    if (/微信/.test(text)) setContact("加微信咨询")
    else if (/报名|试听|测评/.test(text)) setContact("立即预约")
    else if (/下单|购买|套餐/.test(text)) setContact("咨询套餐")
    else if (/报价|预算|多少钱/.test(text)) setContact("获取正式报价")
    else setContact("立即咨询")
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
              你输入一句真实需求，小白先判断要做哪种跨行业应用，再生成一个能翻页、能交互、看起来像产品的 H5 应用。
            </p>
          </div>
          <div style={{ border: "1px solid rgba(216,191,118,0.24)", background: "rgba(216,191,118,0.08)", borderRadius: 14, padding: "14px 16px", minWidth: 176 }}>
            <p style={{ color: "#d8bf76", fontSize: 14, fontWeight: 950, marginBottom: 5 }}>当前阶段</p>
            <p style={{ color: "#f8f3e6", fontSize: 18, fontWeight: 950 }}>需求生成应用</p>
            <p style={{ color: "#c8c8bd", fontSize: 13, lineHeight: 1.65, marginTop: 5 }}>不是选页面，是生成一套应用。</p>
          </div>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "390px 1fr", gap: 16, alignItems: "start" }} className="apps-shell">
          <aside style={{ display: "grid", gap: 14 }}>
            <section style={panelStyle}>
              <p style={labelStyle}>先输入客户真实需求</p>
              <textarea
                value={demand}
                onChange={(event) => setDemand(event.target.value)}
                placeholder="例如：我做装修设计，客户老问多少钱，我想先让他自己估预算再预约顾问。"
                rows={5}
                style={{ ...inputStyle, minHeight: 118 }}
              />
              <button type="button" onClick={() => generateFromDemand()} style={{ ...primaryButtonStyle, width: "100%", justifyContent: "center", marginTop: 12 }}>
                <Sparkles size={16} /> 生成一个完整应用
              </button>
              <div style={{ display: "grid", gap: 7, marginTop: 12 }}>
                {demandExamples.map((example) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => {
                      setDemand(example)
                      generateFromDemand(example)
                    }}
                    style={exampleButtonStyle}
                  >
                    {example}
                  </button>
                ))}
              </div>
            </section>

            <section style={panelStyle}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
                <p style={{ ...labelStyle, marginBottom: 0 }}>小白判断的应用类型</p>
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
                            <span style={{ color: active ? "#fff4c9" : "#f8f3e6", fontSize: 16, fontWeight: 950, display: "block", marginBottom: 2 }}>{template.title}</span>
                            <span style={{ color: "#9f9785", fontSize: 12, fontWeight: 900 }}>{template.bestFor}</span>
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
              <p style={labelStyle}>小白拆出的关键信息</p>
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

const exampleButtonStyle = {
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.035)",
  color: "#cfc8b7",
  borderRadius: 12,
  padding: "10px 11px",
  textAlign: "left",
  fontSize: 13,
  lineHeight: 1.55,
  fontWeight: 850,
  cursor: "pointer",
} as const
