"use client"

import { useEffect, useMemo, useState } from "react"
import { Check, Clipboard, Code2, Eye, FileText, Monitor, Save, Sparkles } from "lucide-react"
import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"
import {
  APP_FACTORY_STORAGE_KEY,
  generateAppHtml,
  type AppTemplateId,
  type SavedGeneratedApp,
} from "@/data/app-templates"

type AppRequirement = {
  appName: string
  userRole: string
  problem: string
  coreFeatures: string
  pages: string
  dataFields: string
  mainFlow: string
  visualStyle: string
}

const defaultRequirement: AppRequirement = {
  appName: "门店扫码点餐桌面管理端",
  userRole: "门店老板、店员、收银员",
  problem: "顾客点餐慢、店员容易漏单，老板想看今天卖了什么",
  coreFeatures: "菜单管理、桌号点餐、购物车、下单、订单状态、今日营业统计",
  pages: "工作台、菜单、订单、桌台、统计、设置",
  dataFields: "菜品名称、价格、分类、库存、桌号、订单金额、订单状态、下单时间",
  mainFlow: "店员打开应用，选择桌号，帮顾客加菜，确认订单，厨房看到新订单，收银员完成结账",
  visualStyle: "清爽、高级、像真正的桌面软件，字号要大，布局要清楚",
}

const requirementExamples: Array<{ name: string; value: AppRequirement }> = [
  {
    name: "微信聊天软件",
    value: {
      appName: "企业微信式聊天桌面端",
      userRole: "公司员工、客服、客户",
      problem: "员工需要在一个软件里看会话、找联系人、给客户发消息",
      coreFeatures: "会话列表、聊天窗口、发送消息、通讯录、群聊、客户资料、我的设置",
      pages: "消息、通讯录、群聊、客户、文件、我的",
      dataFields: "联系人昵称、头像、最近消息、未读数、发送时间、客户标签、群名称",
      mainFlow: "用户打开应用，选择左侧会话，在中间聊天窗口输入消息并发送，再切到通讯录查看联系人",
      visualStyle: "像成熟桌面聊天软件，左侧导航，中间会话，右侧资料栏，干净高级",
    },
  },
  {
    name: "公司排班系统",
    value: {
      appName: "员工排班考勤桌面系统",
      userRole: "店长、人事、员工",
      problem: "排班靠表格很乱，请假、调班、缺勤不好追踪",
      coreFeatures: "员工列表、周排班表、班次设置、请假审批、考勤异常、统计汇总",
      pages: "排班表、员工、请假、考勤、班次、统计",
      dataFields: "员工姓名、岗位、班次、日期、请假状态、出勤状态、工时",
      mainFlow: "店长选择本周日期，把员工拖入早班/晚班，处理请假申请，查看本周工时统计",
      visualStyle: "像专业企业管理软件，表格清楚，颜色区分班次，操作按钮明显",
    },
  },
  {
    name: "记账应用",
    value: {
      appName: "个人记账桌面 APP",
      userRole: "想控制开销的普通用户",
      problem: "不知道钱花到哪里了，也看不懂每个月支出结构",
      coreFeatures: "新增收入支出、分类账单、月度统计、预算进度、搜索筛选",
      pages: "首页、账单、统计、预算、分类、设置",
      dataFields: "金额、分类、备注、日期、支付方式、收入/支出、预算额度",
      mainFlow: "用户打开应用，点击新增记录，填写金额和分类，保存后在首页看到月度支出和分类占比",
      visualStyle: "现代财务工具，图表清晰，重点数字醒目，不要花哨",
    },
  },
]

function inferTemplateId(text: string): AppTemplateId {
  const raw = text.toLowerCase()
  if (/微信|聊天|im|私信|消息|会话|好友|通讯录|群聊|客服/.test(raw)) return "chat-app"
  if (/报价|预算|估价|多少钱|价格|费用|装修|设计|摄影/.test(raw)) return "quote-calculator"
  if (/活动|抽奖|小游戏|裂变|分享|福利|打卡|领券/.test(raw)) return "click-game"
  if (/商品|课程|套餐|下单|购买|成交|会员|商城|点餐|菜单|购物车/.test(raw)) return "product-page"
  if (/报名|预约|试听|测评|留电话|咨询|到店|排队/.test(raw)) return "lead-form"
  return "site-hero"
}

function inferAppKind(text: string) {
  const raw = text.toLowerCase()
  const rules: Array<[RegExp, string]> = [
    [/微信|聊天|im|私信|消息|会话|好友|通讯录|群聊|客服/, "聊天社交桌面 APP"],
    [/点餐|扫码点餐|菜单|购物车|桌号|外卖|堂食|餐桌|加菜/, "餐饮点餐桌面 APP"],
    [/排班|班次|考勤|请假|调休|员工|值班|工时/, "排班考勤桌面 APP"],
    [/记账|账单|收入|支出|预算|流水|报销|发票/, "记账财务桌面 APP"],
    [/库存|仓库|进销存|采购|入库|出库|盘点|供应商/, "库存进销存桌面 APP"],
    [/crm|客户管理|客户跟进|销售线索|商机|成交记录|回访/, "客户管理 CRM 桌面 APP"],
    [/招聘|简历|候选人|面试|岗位|offer|入职/, "招聘面试桌面 APP"],
    [/学习|课程表|刷题|考试|作业|训练营|打卡学习/, "学习训练桌面 APP"],
    [/工单|报修|售后|派单|维修|客服处理|进度跟踪/, "工单售后桌面 APP"],
    [/社区|帖子|评论|问答|点赞|置顶|发帖/, "社区问答桌面 APP"],
    [/ai助手|智能体|agent|知识库|机器人|客服机器人/, "AI 助手桌面 APP"],
    [/项目|任务|协作|待办|看板|进度/, "项目任务管理桌面 APP"],
  ]
  return rules.find(([pattern]) => pattern.test(raw))?.[1] || "按需求定制的桌面 APP"
}

function requirementToDemand(requirement: AppRequirement) {
  return [
    `应用名称：${requirement.appName}`,
    `给谁使用：${requirement.userRole}`,
    `要解决的问题：${requirement.problem}`,
    `核心功能：${requirement.coreFeatures}`,
    `需要的页面：${requirement.pages}`,
    `数据字段：${requirement.dataFields}`,
    `主要使用流程：${requirement.mainFlow}`,
    `视觉风格：${requirement.visualStyle}`,
    "请生成一个真实桌面 APP 界面，不要做落地页，不要做宣传页。",
  ].join("\n")
}

function requirementPatch(requirement: AppRequirement, patch: Partial<AppRequirement>) {
  return { ...requirement, ...patch }
}

export function AppsClient() {
  const [requirement, setRequirement] = useState<AppRequirement>(defaultRequirement)
  const [generatedHtml, setGeneratedHtml] = useState("")
  const [previewUrl, setPreviewUrl] = useState("")
  const [savedApps, setSavedApps] = useState<SavedGeneratedApp[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [mode, setMode] = useState<"empty" | "ai" | "fallback" | "saved">("empty")
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)

  const demand = useMemo(() => requirementToDemand(requirement), [requirement])
  const appKind = useMemo(() => inferAppKind(demand), [demand])
  const templateId = useMemo(() => inferTemplateId(demand), [demand])

  const fallbackHtml = useMemo(
    () =>
      generateAppHtml({
        templateId,
        industry: requirement.appName || "桌面应用",
        goal: `${requirement.problem}。核心功能：${requirement.coreFeatures}`,
        audience: requirement.userRole,
        style: requirement.visualStyle,
        contact: "开始使用",
      }),
    [requirement, templateId],
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
    const html = generatedHtml || fallbackHtml
    const blob = new Blob([html], { type: "text/html;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [fallbackHtml, generatedHtml])

  function updateRequirement(patch: Partial<AppRequirement>) {
    setRequirement((current) => requirementPatch(current, patch))
    setGeneratedHtml("")
    setMode("empty")
  }

  async function generateApp() {
    setIsGenerating(true)
    setGeneratedHtml("")
    setMode("empty")
    try {
      const response = await fetch("/api/apps/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId,
          appKind,
          demand,
          industry: requirement.appName,
          goal: `${requirement.problem}。核心功能：${requirement.coreFeatures}`,
          audience: requirement.userRole,
          style: requirement.visualStyle,
          contact: "开始使用",
        }),
      })
      const data = await response.json()
      if (response.ok && data?.html) {
        setGeneratedHtml(String(data.html))
        setMode(data.mode === "ai" ? "ai" : "fallback")
      } else {
        setGeneratedHtml(fallbackHtml)
        setMode("fallback")
      }
    } catch {
      setGeneratedHtml(fallbackHtml)
      setMode("fallback")
    } finally {
      setIsGenerating(false)
    }
  }

  function persist(next: SavedGeneratedApp[]) {
    setSavedApps(next)
    window.localStorage.setItem(APP_FACTORY_STORAGE_KEY, JSON.stringify(next))
  }

  function saveApp() {
    const html = generatedHtml || fallbackHtml
    const nextApp: SavedGeneratedApp = {
      id: `${Date.now()}`,
      title: requirement.appName || "我的桌面 APP",
      templateId,
      industry: requirement.appName,
      goal: requirement.problem,
      audience: requirement.userRole,
      style: requirement.visualStyle,
      contact: "开始使用",
      html,
      createdAt: new Date().toISOString(),
    }
    persist([nextApp, ...savedApps].slice(0, 10))
    setSaved(true)
    window.setTimeout(() => setSaved(false), 1400)
  }

  async function copyHtml() {
    try {
      await navigator.clipboard.writeText(generatedHtml || fallbackHtml)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1400)
    } catch {
      setCopied(false)
    }
  }

  function loadSaved(app: SavedGeneratedApp) {
    setRequirement({
      appName: app.industry,
      userRole: app.audience,
      problem: app.goal,
      coreFeatures: "已保存应用，可继续修改需求后重新生成",
      pages: "按已保存版本为准",
      dataFields: "按已保存版本为准",
      mainFlow: "按已保存版本为准",
      visualStyle: app.style,
    })
    setGeneratedHtml(app.html)
    setMode("saved")
  }

  return (
    <div className="xb-workbench" style={{ minHeight: "100vh", fontFamily: "'Noto Sans SC', sans-serif", position: "relative", overflow: "hidden" }}>
      <MathRain />
      <NavBar />
      <main style={{ maxWidth: 1320, margin: "0 auto", padding: "44px clamp(16px,5vw,54px) 90px", position: "relative", zIndex: 10 }}>
        <section style={{ display: "grid", gridTemplateColumns: "minmax(340px,440px) 1fr", gap: 18, alignItems: "start" }} className="apps-layout">
          <aside style={formPanelStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <span style={iconBoxStyle}><FileText size={18} /></span>
              <div>
                <p style={eyebrowStyle}>XIAOBAI APP FACTORY</p>
                <h1 style={{ color: "#f8f3e6", fontSize: 28, lineHeight: 1.16, fontWeight: 950 }}>填写应用需求模板</h1>
              </div>
            </div>

            <p style={{ color: "#c8c3b4", fontSize: 15, lineHeight: 1.8, marginBottom: 18 }}>
              你不用选一堆类型。把客户想做成的应用按下面填清楚，小白直接生成一个桌面 APP 界面。
            </p>

            <Field label="应用名称" value={requirement.appName} onChange={(value) => updateRequirement({ appName: value })} placeholder="例如：企业微信式聊天桌面端" />
            <Field label="给谁使用" value={requirement.userRole} onChange={(value) => updateRequirement({ userRole: value })} placeholder="例如：老板、员工、客户、老师、学生" />
            <Field label="要解决什么问题" value={requirement.problem} onChange={(value) => updateRequirement({ problem: value })} placeholder="一句话说清楚客户为什么需要这个应用" textarea />
            <Field label="核心功能" value={requirement.coreFeatures} onChange={(value) => updateRequirement({ coreFeatures: value })} placeholder="例如：聊天、订单、统计、审核、搜索" textarea />
            <Field label="需要哪些页面" value={requirement.pages} onChange={(value) => updateRequirement({ pages: value })} placeholder="例如：首页、列表、详情、统计、设置" />
            <Field label="需要记录哪些数据" value={requirement.dataFields} onChange={(value) => updateRequirement({ dataFields: value })} placeholder="例如：姓名、金额、状态、时间、分类" textarea />
            <Field label="用户怎么操作" value={requirement.mainFlow} onChange={(value) => updateRequirement({ mainFlow: value })} placeholder="按第一步、第二步说清楚真实使用流程" textarea />
            <Field label="界面风格" value={requirement.visualStyle} onChange={(value) => updateRequirement({ visualStyle: value })} placeholder="例如：像专业桌面软件，清爽，高级，字号大" />

            <button type="button" onClick={generateApp} disabled={isGenerating} style={{ ...primaryButtonStyle, width: "100%", justifyContent: "center", opacity: isGenerating ? 0.72 : 1, marginTop: 18 }}>
              <Sparkles size={17} /> {isGenerating ? "小白正在生成桌面 APP..." : "生成真实桌面 APP 界面"}
            </button>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginTop: 10 }}>
              <button type="button" onClick={saveApp} style={secondaryButtonStyle}>
                {saved ? <Check size={15} /> : <Save size={15} />} {saved ? "已保存" : "保存"}
              </button>
              <button type="button" onClick={copyHtml} style={secondaryButtonStyle}>
                {copied ? <Check size={15} /> : <Clipboard size={15} />} {copied ? "已复制" : "复制代码"}
              </button>
            </div>

            <div style={{ marginTop: 18 }}>
              <p style={smallTitleStyle}>一键套用示例</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {requirementExamples.map((example) => (
                  <button key={example.name} type="button" onClick={() => updateRequirement(example.value)} style={chipButtonStyle}>
                    {example.name}
                  </button>
                ))}
              </div>
            </div>

            {savedApps.length > 0 && (
              <div style={{ marginTop: 18 }}>
                <p style={smallTitleStyle}>已保存</p>
                <div style={{ display: "grid", gap: 8 }}>
                  {savedApps.slice(0, 4).map((app) => (
                    <button key={app.id} type="button" onClick={() => loadSaved(app)} style={savedButtonStyle}>
                      <span style={{ color: "#f8f3e6", fontWeight: 950 }}>{app.title}</span>
                      <span style={{ color: "#9f9f96", fontSize: 12 }}>{new Date(app.createdAt).toLocaleString("zh-CN")}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>

          <section style={previewPanelStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "center", flexWrap: "wrap", marginBottom: 14 }}>
              <div>
                <p style={eyebrowStyle}>DESKTOP APP PREVIEW</p>
                <h2 style={{ color: "#f8f3e6", fontSize: 24, lineHeight: 1.2, fontWeight: 950 }}>{requirement.appName || "桌面 APP 预览"}</h2>
                <p style={{ color: "#aaa69b", fontSize: 14, lineHeight: 1.7, marginTop: 5 }}>小白判断：{appKind}</p>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span style={miniPillStyle}><Monitor size={13} /> 桌面界面</span>
                <span style={miniPillStyle}><Eye size={13} /> 站内预览</span>
                <span style={{ ...miniPillStyle, color: mode === "ai" ? "#b8ffd0" : "#fff4c9" }}>
                  {mode === "ai" ? "AI 生成" : mode === "fallback" ? "兜底预览" : mode === "saved" ? "已保存版本" : "填写后生成"}
                </span>
                <span style={miniPillStyle}><Code2 size={13} /> HTML</span>
              </div>
            </div>

            <div style={desktopFrameStyle}>
              <div style={titlebarStyle}>
                <span style={{ background: "#ff6464" }} />
                <span style={{ background: "#ffca5f" }} />
                <span style={{ background: "#61d17c" }} />
                <strong>{requirement.appName || "Xiaobai Desktop App"}</strong>
              </div>
              <div style={{ background: "#fff", minHeight: 690 }}>
                {previewUrl ? (
                  <iframe title="小白桌面 APP 预览" sandbox="allow-scripts" src={previewUrl} style={{ width: "100%", height: 690, border: 0, display: "block" }} />
                ) : (
                  <div style={{ height: 690, display: "grid", placeItems: "center", color: "#111", fontSize: 17, fontWeight: 950 }}>填写需求后生成预览</div>
                )}
              </div>
            </div>
          </section>
        </section>

        <style>{`
          @media (max-width: 1040px) {
            .apps-layout { grid-template-columns: 1fr !important; }
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
      <span style={{ color: "#f8f3e6", fontSize: 15, fontWeight: 950, display: "block", marginBottom: 7 }}>{label}</span>
      {textarea ? (
        <textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} rows={3} style={inputStyle} />
      ) : (
        <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} style={inputStyle} />
      )}
    </label>
  )
}

const formPanelStyle = {
  border: "1px solid rgba(233,215,165,0.14)",
  background: "rgba(13,14,16,0.78)",
  borderRadius: 18,
  padding: "22px",
  boxShadow: "0 28px 90px rgba(0,0,0,0.32)",
  backdropFilter: "blur(18px)",
} as const

const previewPanelStyle = {
  border: "1px solid rgba(233,215,165,0.14)",
  background: "rgba(13,14,16,0.58)",
  borderRadius: 18,
  padding: "18px",
  boxShadow: "0 28px 90px rgba(0,0,0,0.26)",
  backdropFilter: "blur(18px)",
} as const

const iconBoxStyle = {
  width: 42,
  height: 42,
  borderRadius: 13,
  display: "grid",
  placeItems: "center",
  border: "1px solid rgba(216,191,118,0.35)",
  background: "rgba(216,191,118,0.14)",
  color: "#f8e3a1",
} as const

const eyebrowStyle = {
  fontFamily: "'JetBrains Mono',monospace",
  fontSize: 10,
  letterSpacing: "0.22em",
  color: "#d8bf76",
  textTransform: "uppercase",
  fontWeight: 950,
  marginBottom: 5,
} as const

const inputStyle = {
  width: "100%",
  border: "1px solid rgba(255,255,255,0.13)",
  background: "rgba(255,255,255,0.06)",
  borderRadius: 12,
  padding: "12px 13px",
  color: "#f8f3e6",
  fontSize: 15,
  fontWeight: 800,
  lineHeight: 1.55,
  outline: "none",
  fontFamily: "'Noto Sans SC', sans-serif",
  resize: "vertical",
} as const

const primaryButtonStyle = {
  border: "1px solid rgba(216,191,118,0.44)",
  background: "linear-gradient(180deg,rgba(216,191,118,0.24),rgba(151,126,58,0.17))",
  color: "#fff4c9",
  borderRadius: 12,
  padding: "13px 15px",
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
  padding: "12px 13px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  fontSize: 14,
  fontWeight: 950,
  cursor: "pointer",
} as const

const smallTitleStyle = {
  color: "#d8bf76",
  fontSize: 14,
  fontWeight: 950,
  marginBottom: 9,
} as const

const chipButtonStyle = {
  border: "1px solid rgba(216,191,118,0.22)",
  background: "rgba(216,191,118,0.08)",
  color: "#e9dba8",
  borderRadius: 999,
  padding: "8px 10px",
  fontSize: 13,
  fontWeight: 950,
  cursor: "pointer",
} as const

const savedButtonStyle = {
  border: "1px solid rgba(255,255,255,0.11)",
  background: "rgba(255,255,255,0.035)",
  borderRadius: 12,
  padding: "10px 11px",
  display: "grid",
  gap: 3,
  textAlign: "left",
  cursor: "pointer",
} as const

const miniPillStyle = {
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.045)",
  color: "#d7d7d7",
  borderRadius: 999,
  padding: "8px 11px",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  fontSize: 13,
  fontWeight: 950,
} as const

const desktopFrameStyle = {
  border: "1px solid rgba(255,255,255,0.14)",
  borderRadius: 18,
  overflow: "hidden",
  background: "#0f1117",
  boxShadow: "0 34px 120px rgba(0,0,0,0.38)",
} as const

const titlebarStyle = {
  height: 42,
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "0 14px",
  borderBottom: "1px solid rgba(255,255,255,0.1)",
  background: "linear-gradient(180deg,#222631,#141821)",
  color: "#d7dbe8",
  fontSize: 13,
  fontWeight: 900,
} as const
