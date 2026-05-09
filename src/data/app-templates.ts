export type AppTemplateId = "site-hero" | "lead-form" | "quote-calculator" | "product-page" | "click-game"

export type AppTemplate = {
  id: AppTemplateId
  title: string
  shortTitle: string
  description: string
  bestFor: string
  defaultGoal: string
  accent: string
}

export type GeneratedAppInput = {
  templateId: AppTemplateId
  industry: string
  goal: string
  audience: string
  style: string
  contact: string
}

export type SavedGeneratedApp = GeneratedAppInput & {
  id: string
  title: string
  html: string
  createdAt: string
}

export type BusinessBlueprint = {
  sector: string
  coreOffer: string
  hook: string
  userPain: string
  trustProof: string[]
  serviceSteps: string[]
  captureFields: string[]
  packages: { name: string; price: number; desc: string }[]
  appGoal: string
  nextWorkflow: string
}

type Palette = {
  bg: string
  text: string
  sub: string
  panel: string
  border: string
  accent: string
  accent2: string
  ink: string
  glow: string
}

type AppMode = {
  id: AppTemplateId
  name: string
  activePage: string
  heroTitle: string
  heroDesc: string
  systemName: string
  visual: "radar" | "pipeline" | "calculator" | "commerce" | "arcade"
}

export const APP_FACTORY_STORAGE_KEY = "xiaobaiai:generated-apps:v1"

export const appTemplates: AppTemplate[] = [
  {
    id: "site-hero",
    title: "获客成交应用",
    shortTitle: "获客应用",
    description: "跨行业都能用：先把业务讲清楚，再承接咨询、预约、报价和成交。",
    bestFor: "门店、服务、课程、个人业务、公司官网",
    defaultGoal: "让用户看懂我能解决什么问题，并愿意留下线索",
    accent: "#76b39d",
  },
  {
    id: "lead-form",
    title: "预约报名应用",
    shortTitle: "预约应用",
    description: "跨行业收集关键需求：预约、报名、测评、咨询、到店都能走这个应用。",
    bestFor: "培训、门店、医疗美容、本地服务、活动报名",
    defaultGoal: "让用户完成预约或报名，并自动进入后续跟进",
    accent: "#d8bf76",
  },
  {
    id: "quote-calculator",
    title: "智能报价应用",
    shortTitle: "报价应用",
    description: "跨行业给预算感：把套餐、数量、服务深度拆开，先让客户知道大概多少钱。",
    bestFor: "装修、摄影、家政、企业服务、定制项目",
    defaultGoal: "让客户先算出预算范围，再愿意咨询确认",
    accent: "#86a8e7",
  },
  {
    id: "product-page",
    title: "产品成交应用",
    shortTitle: "成交应用",
    description: "跨行业卖产品或服务：卖点、套餐、购买理由、信任证明和行动按钮一套闭环。",
    bestFor: "商品、课程、服务套餐、会员、数字产品",
    defaultGoal: "让用户看懂卖点、选择套餐并点击咨询或下单",
    accent: "#e89f71",
  },
  {
    id: "click-game",
    title: "活动裂变应用",
    shortTitle: "裂变应用",
    description: "跨行业做活动：小游戏、福利、抽奖、打卡、分享和私域引流都能承接。",
    bestFor: "门店活动、社群裂变、直播预热、节日福利",
    defaultGoal: "让用户参与活动、领取福利，并愿意分享或加微信",
    accent: "#c7a8ff",
  },
]

const appModes: Record<AppTemplateId, AppMode> = {
  "site-hero": {
    id: "site-hero",
    name: "获客成交应用",
    activePage: "home",
    heroTitle: "把陌生访客变成可跟进线索",
    heroDesc: "这不是单页官网，而是一套从看懂业务、建立信任、提交需求到后续跟进的获客应用。",
    systemName: "增长雷达",
    visual: "radar",
  },
  "lead-form": {
    id: "lead-form",
    name: "预约报名应用",
    activePage: "lead",
    heroTitle: "让用户按步骤完成预约或报名",
    heroDesc: "核心不是表单，而是用最少字段问出关键需求，让后续人工或 AI 能继续跟进。",
    systemName: "预约漏斗",
    visual: "pipeline",
  },
  "quote-calculator": {
    id: "quote-calculator",
    name: "智能报价应用",
    activePage: "quote",
    heroTitle: "先给客户一个可信的预算范围",
    heroDesc: "把价格从一句“私聊报价”变成可交互的预算器，用户更容易继续咨询。",
    systemName: "报价引擎",
    visual: "calculator",
  },
  "product-page": {
    id: "product-page",
    name: "产品成交应用",
    activePage: "deal",
    heroTitle: "让用户知道该买什么、为什么买",
    heroDesc: "用套餐、信任证明和购买理由承接成交，而不是把商品资料堆在页面上。",
    systemName: "成交货架",
    visual: "commerce",
  },
  "click-game": {
    id: "click-game",
    name: "活动裂变应用",
    activePage: "event",
    heroTitle: "先让用户参与，再把热度变成线索",
    heroDesc: "用小游戏、倒计时和福利门槛把用户拉进来，结束后引导领券、预约或分享。",
    systemName: "活动引擎",
    visual: "arcade",
  },
}

function escapeHtml(value: string) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function clean(value: string, fallback: string) {
  const text = String(value || "").trim()
  return text || fallback
}

function safe(value: string) {
  return escapeHtml(value)
}

function includesAny(text: string, words: string[]) {
  return words.some((word) => text.includes(word))
}

function hasAny(text: string, words: string[]) {
  return words.some((word) => text.includes(word))
}

export function buildBusinessBlueprint(input: GeneratedAppInput): BusinessBlueprint {
  const raw = `${input.industry} ${input.goal} ${input.audience}`.toLowerCase()
  const industry = clean(input.industry, "本地服务")
  const goal = clean(input.goal, "让用户了解服务并愿意咨询")
  const audience = clean(input.audience, "目标用户")

  if (includesAny(raw, ["餐饮", "饭店", "火锅", "烧烤", "咖啡", "奶茶", "门店"])) {
    return {
      sector: "本地餐饮门店",
      coreOffer: `${industry}到店/外卖转化`,
      hook: "今天不知道吃什么？先看招牌菜和到店福利。",
      userPain: `${audience}最怕踩雷：不知道特色、价格、位置和是否适合聚餐。`,
      trustProof: ["招牌菜/套餐展示", "真实到店评价", "营业时间与位置清楚", "支持预约或加微信确认"],
      serviceSteps: ["看招牌菜", "选人数和预算", "领取到店福利", "加微信/电话预约"],
      captureFields: ["用餐人数", "预计到店时间", "预算区间", "是否需要包间", "联系方式"],
      packages: [
        { name: "双人尝鲜", price: 99, desc: "适合第一次到店，先体验招牌组合。" },
        { name: "四人聚餐", price: 268, desc: "适合同事、朋友小聚，菜品更完整。" },
        { name: "多人包间", price: 588, desc: "适合生日、团建和家庭聚餐。" },
      ],
      appGoal: goal,
      nextWorkflow: "把预约表单接到企业微信，自动提醒店员跟进。",
    }
  }

  if (includesAny(raw, ["教育", "培训", "课程", "老师", "家长", "学生", "考研", "英语"])) {
    return {
      sector: "教育培训",
      coreOffer: `${industry}试听/报名转化`,
      hook: "先测孩子/学员当前水平，再推荐合适课程。",
      userPain: `${audience}最担心课程不适合、效果不明确、老师不靠谱。`,
      trustProof: ["课程目标清楚", "适合人群明确", "试听/测评入口", "老师经验和案例展示"],
      serviceSteps: ["选择学习目标", "填写当前基础", "领取试听/测评", "老师给出学习建议"],
      captureFields: ["学习目标", "当前基础", "年级/水平", "可上课时间", "联系方式"],
      packages: [
        { name: "体验测评", price: 0, desc: "先判断当前水平和适合路线。" },
        { name: "入门班", price: 699, desc: "适合基础薄弱，先建立学习节奏。" },
        { name: "冲刺班", price: 1999, desc: "适合目标明确，需要集中提分。" },
      ],
      appGoal: goal,
      nextWorkflow: "表单提交后自动生成学员画像和跟进话术。",
    }
  }

  if (includesAny(raw, ["电商", "商品", "淘宝", "抖店", "小红书", "带货", "直播", "私域"])) {
    return {
      sector: "电商/私域销售",
      coreOffer: `${industry}商品转化`,
      hook: "3 秒看懂卖点，30 秒判断适不适合自己。",
      userPain: `${audience}最怕买错：不知道适合谁、真实效果、价格值不值。`,
      trustProof: ["适合人群明确", "使用场景展示", "对比普通方案", "售后和发货说明"],
      serviceSteps: ["看核心卖点", "选择使用场景", "对比套餐", "点击咨询/下单"],
      captureFields: ["想解决的问题", "预算区间", "使用场景", "购买数量", "联系方式"],
      packages: [
        { name: "基础款", price: 99, desc: "适合先试用，降低决策成本。" },
        { name: "热销款", price: 199, desc: "适合大多数用户，性价比最高。" },
        { name: "组合装", price: 399, desc: "适合家庭/团队，多件更划算。" },
      ],
      appGoal: goal,
      nextWorkflow: "把咨询问题沉淀成客服知识库，自动生成回复草稿。",
    }
  }

  if (includesAny(raw, ["装修", "设计", "摄影", "婚礼", "家政", "维修", "美容", "美甲", "健身"])) {
    return {
      sector: "本地服务/项目制报价",
      coreOffer: `${industry}咨询与报价`,
      hook: "先填需求，马上得到大概预算和服务建议。",
      userPain: `${audience}最怕价格不透明、效果没保障、沟通成本高。`,
      trustProof: ["服务流程透明", "报价项拆开", "案例/前后对比", "可先预约沟通"],
      serviceSteps: ["选择服务类型", "填写面积/数量/时间", "生成预算范围", "预约顾问确认"],
      captureFields: ["服务类型", "面积/数量", "期望时间", "预算范围", "联系方式"],
      packages: [
        { name: "基础服务", price: 399, desc: "适合需求明确，只需要基础交付。" },
        { name: "标准服务", price: 899, desc: "适合需要方案、执行和调整。" },
        { name: "深度服务", price: 1599, desc: "适合预算更高、希望省心托管。" },
      ],
      appGoal: goal,
      nextWorkflow: "提交需求后自动生成报价单，并提醒人工确认。",
    }
  }

  return {
    sector: "通用业务获客",
    coreOffer: `${industry}线索转化`,
    hook: "先让用户明白你能解决什么问题，再给一个低门槛行动。",
    userPain: `${audience}还不了解你，不知道是否值得咨询。`,
    trustProof: ["适合人群明确", "交付结果清楚", "服务流程透明", "下一步动作简单"],
    serviceSteps: ["看懂服务", "判断适不适合", "留下需求", "获得建议/报价"],
    captureFields: ["需求类型", "当前情况", "预算/时间", "最关心的问题", "联系方式"],
    packages: [
      { name: "体验版", price: 0, desc: "先了解需求，给出方向建议。" },
      { name: "标准版", price: 499, desc: "适合完成一个明确的小结果。" },
      { name: "进阶版", price: 1299, desc: "适合需要完整方案和持续调整。" },
    ],
    appGoal: goal,
    nextWorkflow: "把用户提交的信息整理成线索表，并提醒你跟进。",
  }
}

function baseStyle(accent: string, styleName: string, appId: AppTemplateId): Palette {
  const appSecond: Record<AppTemplateId, string> = {
    "site-hero": "#d8bf76",
    "lead-form": "#5ee0c2",
    "quote-calculator": "#f2c66d",
    "product-page": "#ff8d6b",
    "click-game": "#78f0ff",
  }
  const accent2 = appSecond[appId]
  if (/温暖|亲切|自然/.test(styleName)) {
    return {
      bg: `radial-gradient(circle at 18% 12%,${accent}30,transparent 32%),linear-gradient(135deg,#fff7ea 0%,#f5ead8 48%,#e9f4eb 100%)`,
      text: "#24180d",
      sub: "#695844",
      panel: "rgba(255,255,255,.76)",
      border: "rgba(86,63,32,.16)",
      accent,
      accent2,
      ink: "#17110b",
      glow: `${accent}30`,
    }
  }
  if (/商务|高端|正式/.test(styleName)) {
    return {
      bg: `radial-gradient(circle at 18% 8%,${accent}30,transparent 34%),linear-gradient(135deg,#070b13 0%,#111827 52%,#182033 100%)`,
      text: "#f8f3e6",
      sub: "#bfc6d4",
      panel: "rgba(255,255,255,.08)",
      border: "rgba(255,255,255,.16)",
      accent,
      accent2,
      ink: "#070b13",
      glow: `${accent}28`,
    }
  }
  if (/活泼|活动/.test(styleName)) {
    return {
      bg: `radial-gradient(circle at 80% 12%,${accent}38,transparent 30%),linear-gradient(135deg,#130f20 0%,#211936 58%,#102c33 100%)`,
      text: "#fff7f0",
      sub: "#d6cfe4",
      panel: "rgba(255,255,255,.09)",
      border: "rgba(255,255,255,.16)",
      accent,
      accent2,
      ink: "#100d18",
      glow: `${accent}30`,
    }
  }
  return {
    bg: `radial-gradient(circle at 82% 12%,${accent}30,transparent 32%),linear-gradient(135deg,#061211 0%,#101716 54%,#15211e 100%)`,
    text: "#f8f3e6",
    sub: "#c8c8bd",
    panel: "rgba(255,255,255,.08)",
    border: "rgba(255,255,255,.15)",
    accent,
    accent2,
    ink: "#07100f",
    glow: `${accent}28`,
  }
}

function css(colors: Palette, mode: AppMode) {
  const pageBg =
    mode.visual === "pipeline"
      ? `linear-gradient(135deg,${colors.accent}22,transparent),repeating-linear-gradient(90deg,rgba(255,255,255,.055) 0 1px,transparent 1px 72px)`
      : mode.visual === "calculator"
        ? `radial-gradient(circle at 20% 18%,${colors.accent}28,transparent 26%),linear-gradient(145deg,rgba(255,255,255,.08),transparent)`
        : mode.visual === "commerce"
          ? `linear-gradient(135deg,rgba(255,255,255,.12),transparent 36%),radial-gradient(circle at 80% 16%,${colors.accent}24,transparent 28%)`
          : mode.visual === "arcade"
            ? `radial-gradient(circle at 50% 0,${colors.accent}30,transparent 30%),repeating-radial-gradient(circle at 50% 50%,rgba(255,255,255,.045) 0 2px,transparent 2px 18px)`
            : `radial-gradient(circle at 30% 20%,${colors.accent}24,transparent 30%),linear-gradient(115deg,rgba(255,255,255,.06),transparent 42%)`
  return `
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans SC",sans-serif;background:${colors.bg};color:${colors.text}}button,input,select,textarea{font-family:inherit}.page{min-height:100vh;position:relative;overflow:hidden}.page:before{content:"";position:fixed;inset:0;background:${pageBg};pointer-events:none;opacity:.86}.orb{position:absolute;border-radius:999px;filter:blur(18px);opacity:.45;pointer-events:none}.orb.a{width:270px;height:270px;background:${colors.glow};right:7%;top:8%}.orb.b{width:230px;height:230px;background:rgba(216,191,118,.16);left:-70px;bottom:12%}.shell{width:min(100%,1120px);margin:0 auto;padding:26px 22px 58px;position:relative;z-index:1}.nav{height:58px;display:flex;align-items:center;justify-content:space-between;gap:16px;border-bottom:1px solid ${colors.border}}.brand{display:flex;align-items:center;gap:10px;font-weight:950}.logo{width:34px;height:34px;border-radius:12px;background:linear-gradient(135deg,${colors.accent},${colors.accent2});box-shadow:0 14px 36px ${colors.glow}}.nav a{color:${colors.sub};text-decoration:none;font-size:14px;font-weight:850}.hero{display:grid;grid-template-columns:1.02fr .98fr;gap:26px;align-items:center;min-height:calc(100vh - 112px)}@media(max-width:820px){.hero{grid-template-columns:1fr;min-height:auto;padding-top:34px}.shell{padding:18px 16px 48px}}.eyebrow{display:inline-flex;align-items:center;gap:8px;color:${colors.accent2};font-weight:950;font-size:13px;letter-spacing:.04em;border:1px solid ${colors.border};background:${colors.panel};border-radius:999px;padding:8px 11px}.title{font-size:clamp(38px,7.4vw,76px);line-height:1.02;font-weight:950;margin:16px 0 14px;letter-spacing:0}.desc{font-size:18px;line-height:1.85;color:${colors.sub};max-width:720px}.panel{background:${colors.panel};border:1px solid ${colors.border};border-radius:26px;padding:24px;box-shadow:0 24px 80px rgba(0,0,0,.25);backdrop-filter:blur(18px)}.visual{min-height:465px;display:grid;align-content:center;gap:16px;position:relative;overflow:hidden}.visual:before{content:"";position:absolute;inset:-1px;background:radial-gradient(circle at 34% 18%,${colors.glow},transparent 32%);pointer-events:none}.device{position:relative;border-radius:30px;background:linear-gradient(145deg,rgba(255,255,255,.17),rgba(255,255,255,.04));border:1px solid ${colors.border};padding:18px;box-shadow:0 34px 90px rgba(0,0,0,.34)}.meter{height:12px;border-radius:999px;background:rgba(255,255,255,.1);overflow:hidden}.meter span{display:block;height:100%;border-radius:999px;background:linear-gradient(90deg,${colors.accent},${colors.accent2})}.metric-row{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin:22px 0}.metric{border:1px solid ${colors.border};background:${colors.panel};border-radius:18px;padding:14px}.metric b{display:block;font-size:22px;color:${colors.text};margin-bottom:2px}.metric span,.muted{color:${colors.sub};line-height:1.7}.tabs{display:flex;gap:8px;flex-wrap:wrap;margin:28px 0 18px}.tab{border:1px solid ${colors.border};background:${colors.panel};color:${colors.sub};border-radius:999px;padding:10px 12px;font-weight:950;cursor:pointer}.tab.active{background:linear-gradient(135deg,${colors.accent},${colors.accent2});color:${colors.ink};box-shadow:0 16px 36px ${colors.glow}}.view{display:none}.view.active{display:block}.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:13px;margin-top:18px}@media(max-width:680px){.grid{grid-template-columns:1fr}.metric-row{grid-template-columns:1fr}}.card{border:1px solid ${colors.border};background:${colors.panel};border-radius:20px;padding:17px;position:relative;overflow:hidden}.card:after{content:"";position:absolute;inset:auto 0 0;height:2px;background:linear-gradient(90deg,${colors.accent},transparent);opacity:.78}.card b{display:block;margin-bottom:7px;color:${colors.text}}.btn{display:inline-flex;align-items:center;justify-content:center;border:0;border-radius:16px;padding:14px 18px;background:linear-gradient(135deg,${colors.accent},${colors.accent2});color:${colors.ink};font-weight:950;text-decoration:none;cursor:pointer;box-shadow:0 18px 40px ${colors.glow}}.ghost{background:${colors.panel};color:${colors.text};border:1px solid ${colors.border};box-shadow:none}.actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:22px}.steps{counter-reset:step;display:grid;gap:11px}.step{display:grid;grid-template-columns:34px 1fr;gap:11px;align-items:start}.step:before{counter-increment:step;content:counter(step);display:grid;place-items:center;width:32px;height:32px;border-radius:12px;background:linear-gradient(135deg,${colors.accent},${colors.accent2});color:${colors.ink};font-weight:950}.step b{display:block;margin-bottom:4px}.section{padding:46px 0}.section-title{font-size:clamp(26px,4vw,42px);line-height:1.16;margin:0 0 12px;font-weight:950}.two{display:grid;grid-template-columns:1fr 1fr;gap:18px}@media(max-width:820px){.two{grid-template-columns:1fr}}label{display:block;font-weight:900;margin:13px 0 7px}.hint{display:block;margin-top:5px;font-size:13px;color:${colors.sub};line-height:1.55}input,select,textarea{width:100%;border:1px solid rgba(128,128,128,.24);border-radius:14px;padding:13px 14px;background:rgba(255,255,255,.88);font-size:15px;color:#111}.row{display:grid;grid-template-columns:1fr 1fr;gap:12px}@media(max-width:560px){.row{grid-template-columns:1fr}}.price{font-size:50px;font-weight:950;color:${colors.accent2};margin:6px 0}.score{font-size:84px;font-weight:950;color:${colors.accent2};line-height:1;margin:20px 0}.float{animation:floaty 4.6s ease-in-out infinite}@keyframes floaty{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`
}

function explainTrust(item: string, blueprint: BusinessBlueprint) {
  if (hasAny(item, ["招牌菜", "套餐"])) return "把 3-5 个主推菜、适合人数和价格范围放前面，用户不用翻半天就能判断今天要不要到店。"
  if (hasAny(item, ["评价"])) return "放真实评价、复购理由或顾客照片，解决用户最怕的“会不会踩雷”。"
  if (hasAny(item, ["营业时间", "位置"])) return "营业时间、停车/地铁/导航入口要明确，减少用户临门一脚放弃。"
  if (hasAny(item, ["预约", "微信"])) return "给一个明确动作：预约包间、确认排队、领取到店福利，而不是只写欢迎光临。"
  if (hasAny(item, ["课程目标"])) return "直接写学完能达到什么结果，比如提分、会做题、能开口，而不是只写课程很好。"
  if (hasAny(item, ["适合人群"])) return "告诉用户什么基础、什么年龄、什么目标适合报名，也顺便过滤不合适的人。"
  if (hasAny(item, ["试听", "测评"])) return "先让用户用低门槛动作开始：测水平、领试听，再由老师跟进建议。"
  if (hasAny(item, ["老师", "案例"])) return "放老师经历、学员前后变化和真实案例，让家长或学员知道不是空口承诺。"
  if (hasAny(item, ["使用场景"])) return "用真实场景解释怎么用、什么时候用，用户会更快判断是不是自己需要。"
  if (hasAny(item, ["普通方案", "对比"])) return "把普通做法和你的方案并排说清楚，用户才知道贵在哪里、值在哪里。"
  if (hasAny(item, ["售后", "发货"])) return "把发货时间、退换规则、售后入口写清楚，降低下单前的不安。"
  if (hasAny(item, ["流程透明"])) return "把咨询、确认、执行、交付、售后的顺序讲明白，用户知道下一步会发生什么。"
  if (hasAny(item, ["报价项"])) return "把基础费、材料费、加急费、增项拆开，避免用户感觉价格不透明。"
  if (hasAny(item, ["案例/前后", "前后对比"])) return "用前后对比图或真实交付结果证明效果，比一句“专业可靠”更能成交。"
  if (hasAny(item, ["预约沟通"])) return "先预约一次沟通，把复杂需求讲清楚，再给正式方案和报价。"
  if (hasAny(item, ["交付结果"])) return "直接展示最终能拿到什么：页面、表格、方案、图片、视频或可运行链接。"
  if (hasAny(item, ["下一步动作"])) return `按钮只保留一个主动作，比如“${blueprint.appGoal}”，让用户知道点完会发生什么。`
  if (hasAny(item, ["30 秒"])) return "时间短一点，用户愿意马上试；结束后再给奖励或咨询入口。"
  if (hasAny(item, ["点击得分"])) return "让用户通过点击立刻获得反馈，适合门店活动、抽奖和福利领取。"
  if (hasAny(item, ["结束后"])) return "游戏结束不要停在分数页，要立刻引导用户领券、加微信、预约或分享。"
  return `围绕“${blueprint.coreOffer}”补充真实材料，不放空话，只放能帮助用户做决定的信息。`
}

function explainStep(step: string, blueprint: BusinessBlueprint) {
  if (hasAny(step, ["招牌菜", "核心卖点", "看懂服务"])) return "先让用户看懂你到底解决什么问题，不要一上来就让他填资料。"
  if (hasAny(step, ["人数", "预算", "使用场景", "学习目标", "服务类型"])) return "第二步只问影响推荐结果的关键选择，让页面能给出更像样的下一步。"
  if (hasAny(step, ["福利", "试听", "测评", "预算范围", "套餐", "留下需求"])) return "给一个马上能得到的结果，用户才愿意继续往下走。"
  if (hasAny(step, ["预约", "老师", "顾问", "咨询", "报价"])) return "最后交给人工或自动化流程跟进，把线索变成可处理的客户。"
  return `这一步服务于“${blueprint.appGoal}”，不要做成装饰步骤。`
}

function explainField(field: string, blueprint: BusinessBlueprint) {
  if (hasAny(field, ["用餐人数"])) return "决定桌型、套餐和是否适合包间。"
  if (hasAny(field, ["到店时间", "可上课时间", "期望时间"])) return "决定是否能安排档期，也方便提前提醒。"
  if (hasAny(field, ["预算"])) return "让系统优先推荐合适套餐，避免来回问价。"
  if (hasAny(field, ["包间"])) return "提前判断是否需要预留空间，减少到店后临时调整。"
  if (hasAny(field, ["联系方式"])) return "用于发送确认信息、预约结果或后续方案。"
  if (hasAny(field, ["学习目标"])) return "先确定是提分、考试、兴趣还是就业，后面课程才不会乱推。"
  if (hasAny(field, ["当前基础", "年级", "水平"])) return "判断用户现在卡在哪一层，方便给试听或测评。"
  if (hasAny(field, ["想解决的问题", "最关心的问题"])) return "收集用户的真实顾虑，后续客服或 AI 回复才有重点。"
  if (hasAny(field, ["使用场景"])) return "判断用户是在自用、送礼、团队采购还是内容变现。"
  if (hasAny(field, ["购买数量", "面积", "数量"])) return "数量会影响价格、周期和交付方式。"
  if (hasAny(field, ["服务类型", "需求类型"])) return "先分类，后面报价、案例和流程才能匹配。"
  if (hasAny(field, ["当前情况"])) return "让用户用自己的话描述现状，避免只靠固定选项误判。"
  return `这个字段要服务于“${blueprint.nextWorkflow}”，能不用就删，能自动判断就别让用户多填。`
}

function metrics(blueprint: BusinessBlueprint) {
  if (blueprint.sector.includes("餐饮")) return [{ n: "3km", t: "重点覆盖周边客群" }, { n: "4步", t: "从看菜到预约" }, { n: "20s", t: "看懂是否适合聚餐" }]
  if (blueprint.sector.includes("教育")) return [{ n: "1次", t: "先测评再推荐" }, { n: "4项", t: "收集关键学习信息" }, { n: "24h", t: "老师跟进建议" }]
  if (blueprint.sector.includes("电商")) return [{ n: "3秒", t: "抓住核心卖点" }, { n: "3档", t: "套餐降低选择成本" }, { n: "1键", t: "咨询或下单" }]
  if (blueprint.sector.includes("本地服务")) return [{ n: "4步", t: "需求到报价闭环" }, { n: "3档", t: "预算区间清楚" }, { n: "1次", t: "预约顾问确认" }]
  return [{ n: "1屏", t: "讲清核心价值" }, { n: "4步", t: "承接用户行动" }, { n: "1条", t: "线索进入跟进表" }]
}

function proofCards(items: string[], blueprint: BusinessBlueprint) {
  return `<div class="grid">${items.map((item) => `<div class="card"><b>${safe(item)}</b><span class="muted">${safe(explainTrust(item, blueprint))}</span></div>`).join("")}</div>`
}

function metricCards(blueprint: BusinessBlueprint) {
  return `<div class="metric-row">${metrics(blueprint).map((item) => `<div class="metric"><b>${safe(item.n)}</b><span>${safe(item.t)}</span></div>`).join("")}</div>`
}

function stepList(items: string[], blueprint: BusinessBlueprint) {
  return `<div class="steps">${items.map((step) => `<div class="step"><div><b>${safe(step)}</b><span class="muted">${safe(explainStep(step, blueprint))}</span></div></div>`).join("")}</div>`
}

function fieldControl(field: string, blueprint: BusinessBlueprint) {
  const escapedField = safe(field)
  return `<label>${escapedField}<span class="hint">${safe(explainField(field, blueprint))}</span></label><input placeholder="请填写${escapedField}"/>`
}

function nav(industry: string, contact: string) {
  return `<header class="nav"><div class="brand"><span class="logo"></span><span>${industry}</span></div><nav><a href="#pages">应用页</a> · <a href="#action">${contact}</a></nav></header>`
}

function packageCards(blueprint: BusinessBlueprint) {
  return blueprint.packages
    .map((pkg) => `<div class="card"><b>${safe(pkg.name)} · ¥${pkg.price}</b><span class="muted">${safe(pkg.desc)}</span></div>`)
    .join("")
}

function visualPanel(mode: AppMode, blueprint: BusinessBlueprint, industry: string, contact: string) {
  if (mode.visual === "pipeline") {
    return `<aside class="panel visual float"><div class="device"><p class="eyebrow">${safe(mode.systemName)}</p><h2 style="font-size:32px;line-height:1.08;margin:0">预约进度</h2>${["浏览", "填写", "确认", "跟进"].map((item, index) => `<div class="card"><b>${index + 1}. ${item}</b><div class="meter"><span style="width:${35 + index * 18}%"></span></div></div>`).join("")}<a class="btn" href="#action">${contact}</a></div></aside>`
  }
  if (mode.visual === "calculator") {
    return `<aside class="panel visual float"><div class="device"><p class="eyebrow">${safe(mode.systemName)}</p><h2 style="font-size:32px;line-height:1.08;margin:0">¥${blueprint.packages[1]?.price || 499} 起</h2><p class="muted">套餐 + 数量 + 服务深度自动估算</p><div class="row"><div class="card"><b>套餐</b><span class="muted">${safe(blueprint.packages[1]?.name || "标准版")}</span></div><div class="card"><b>深度</b><span class="muted">标准执行</span></div></div><a class="btn" href="#action">打开报价器</a></div></aside>`
  }
  if (mode.visual === "commerce") {
    return `<aside class="panel visual float"><div class="device"><p class="eyebrow">${safe(mode.systemName)}</p><h2 style="font-size:32px;line-height:1.08;margin:0">推荐套餐</h2>${packageCards(blueprint)}<a class="btn" href="#action">${contact}</a></div></aside>`
  }
  if (mode.visual === "arcade") {
    return `<aside class="panel visual float" style="text-align:center"><div class="device"><p class="eyebrow">${safe(mode.systemName)}</p><div class="score">20</div><p class="muted">30 秒挑战 · 达标领取福利</p><button class="btn" type="button">点击得分</button><div class="card" style="margin-top:16px;text-align:left"><b>结束后动作</b><span class="muted">${contact}，并引导分享或预约。</span></div></div></aside>`
  }
  return `<aside class="panel visual float"><div class="device"><p class="eyebrow">${safe(mode.systemName)}</p><h2 style="font-size:32px;line-height:1.08;margin:0">${industry}增长中控</h2><p class="muted">${safe(blueprint.coreOffer)} · ${safe(blueprint.appGoal)}</p>${metricCards(blueprint)}<div class="card"><b>下一步自动化</b><span class="muted">${safe(blueprint.nextWorkflow)}</span></div><a class="btn" href="#action">${contact}</a></div></aside>`
}

function appPages(blueprint: BusinessBlueprint, mode: AppMode, industry: string, audience: string, contact: string, styleName: string) {
  const pages = [
    {
      id: "home",
      tab: "首页",
      html: `<section class="view" data-view="home"><div class="two"><div><h2 class="section-title">${safe(blueprint.hook)}</h2><p class="desc">${safe(blueprint.userPain)} 当前目标：${safe(blueprint.appGoal)}。</p>${metricCards(blueprint)}<div class="actions" id="action"><button class="btn" type="button" data-open="lead">${contact}</button><button class="btn ghost" type="button" data-open="lead">去预约页</button></div></div>${visualPanel({ ...mode, visual: "radar" }, blueprint, industry, contact)}</div></section>`,
    },
    {
      id: "lead",
      tab: "预约",
      html: `<section class="view" data-view="lead"><div class="two"><div><h2 class="section-title">把普通表单升级成客户筛选器</h2><p class="desc">${safe(blueprint.userPain)} 这页只问影响成交的信息，提交后进入跟进。</p>${proofCards(blueprint.trustProof, blueprint)}</div><form class="panel" id="action"><p class="eyebrow">小白设计的字段</p>${blueprint.captureFields.map((field) => fieldControl(field, blueprint)).join("")}<label>补充说明<span class="hint">写用户没法用选项表达的特殊情况，方便后面人工确认。</span></label><textarea rows="4" placeholder="还有什么需要我们提前知道？"></textarea><button class="btn" type="button">${contact}</button><p class="muted">提交后：${safe(blueprint.nextWorkflow)}</p></form></div></section>`,
    },
    {
      id: "quote",
      tab: "报价",
      html: `<section class="view" data-view="quote"><div class="two"><div><h2 class="section-title">先给${audience}一个预算感</h2><p class="desc">报价器把套餐、数量和服务深度拆开，让用户先知道大概范围。</p>${stepList(blueprint.serviceSteps, blueprint)}</div><section class="panel"><p class="eyebrow">智能估算</p><label>选择套餐<span class="hint">套餐不是摆价格，是让用户先选一个心理预算档位。</span></label><select id="pkg">${blueprint.packages.map((pkg) => `<option value="${pkg.price}" data-desc="${safe(pkg.desc)}">${safe(pkg.name)} · ¥${pkg.price}</option>`).join("")}</select><div class="row"><div><label>数量/周期<span class="hint">数量越大，报价越接近真实执行成本。</span></label><input id="count" type="number" min="1" value="1"/></div><div><label>服务深度<span class="hint">基础、标准、深度代表不同交付复杂度。</span></label><select id="level"><option value="1">基础</option><option value="1.4">标准</option><option value="1.9">深度</option></select></div></div><button class="btn" onclick="calc()" type="button">重新估算</button><div class="card" style="margin-top:16px"><p class="muted">预估价格</p><div class="price" id="price">¥0</div><p class="muted" id="desc"></p><a class="btn" href="#">${contact}</a></div></section></div></section>`,
    },
    {
      id: "deal",
      tab: "成交",
      html: `<section class="view" data-view="deal"><div class="two"><div><h2 class="section-title">用户下单前必须看懂的 4 件事</h2><p class="desc">${safe(blueprint.userPain)} 所以成交页先回答“适合谁、解决什么、为什么可信、下一步怎么做”。</p>${proofCards(blueprint.trustProof, blueprint)}</div><aside class="panel"><p class="eyebrow">推荐套餐 · ${styleName}</p>${packageCards(blueprint)}<p class="muted">下一步：${safe(blueprint.nextWorkflow)}</p></aside></div></section>`,
    },
    {
      id: "event",
      tab: "活动",
      html: `<section class="view" data-view="event"><div class="two"><div><h2 class="section-title">先让用户参与，再把热度变成线索</h2><p class="desc">${safe(blueprint.appGoal)}。用户玩完后给一个明确动作：领福利、预约、咨询或分享。</p>${proofCards(["30 秒倒计时", "点击得分", "结束后引导咨询"], blueprint)}</div><section class="panel" style="text-align:center"><p class="eyebrow">${industry}挑战</p><div class="score" id="score">0</div><p class="muted">剩余 <b id="time">30</b> 秒 · 达到 20 分可领取福利</p><button class="btn" onclick="hit()" type="button">点击得分</button><button class="btn ghost" onclick="restart()" type="button">重新开始</button></section></div></section>`,
    },
  ]
  return `<div id="pages" class="tabs">${pages.map((page) => `<button class="tab${page.id === mode.activePage ? " active" : ""}" type="button" data-open="${page.id}">${page.tab}</button>`).join("")}</div>${pages.map((page) => page.html.replace('class="view"', `class="view${page.id === mode.activePage ? " active" : ""}"`)).join("")}`
}

export function generateAppHtml(input: GeneratedAppInput) {
  const template = appTemplates.find((item) => item.id === input.templateId) || appTemplates[0]
  const mode = appModes[template.id]
  const blueprint = buildBusinessBlueprint(input)
  const rawIndustry = clean(input.industry, "你的行业")
  const industry = safe(rawIndustry)
  const audience = safe(clean(input.audience, "目标用户"))
  const contact = safe(clean(input.contact, "立即咨询"))
  const styleName = safe(clean(input.style, "简洁科技"))
  const colors = baseStyle(template.accent, input.style, template.id)
  const sheet = css(colors, mode)

  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${industry}${safe(template.shortTitle)}</title><style>${sheet}</style></head><body><main class="page"><span class="orb a"></span><span class="orb b"></span><div class="shell">${nav(industry, contact)}<section class="hero"><div><p class="eyebrow">${safe(mode.name)} · ${safe(blueprint.sector)} · ${styleName}</p><h1 class="title">${safe(mode.heroTitle)}</h1><p class="desc">${safe(mode.heroDesc)} ${safe(blueprint.userPain)}</p>${metricCards(blueprint)}<div class="actions"><a class="btn" href="#pages">进入应用页</a><a class="btn ghost" href="#action">${contact}</a></div></div>${visualPanel(mode, blueprint, industry, contact)}</section><section class="section"><h2 class="section-title">这个应用里面包含 5 个页面</h2><p class="desc">左边选的是跨行业应用类型；这里的首页、预约、报价、成交、活动，才是实时预览里可以翻的页面。</p>${appPages(blueprint, mode, industry, audience, contact, styleName)}</section></div></main><script>function openPage(id){document.querySelectorAll('.tab').forEach(function(tab){tab.classList.toggle('active',tab.dataset.open===id)});document.querySelectorAll('.view').forEach(function(view){view.classList.toggle('active',view.dataset.view===id)})}document.querySelectorAll('[data-open]').forEach(function(btn){btn.addEventListener('click',function(){openPage(btn.dataset.open)})});function calc(){var p=document.getElementById('pkg');if(!p)return;var base=Number(p.value);var count=Math.max(1,Number(document.getElementById('count').value)||1);var level=Number(document.getElementById('level').value);document.getElementById('price').textContent='¥'+Math.round(base*count*level).toLocaleString('zh-CN');document.getElementById('desc').textContent=p.options[p.selectedIndex].dataset.desc}let score=0,time=30,timer=null;function start(){clearInterval(timer);timer=setInterval(function(){var el=document.getElementById('time');if(!el)return;time--;el.textContent=time;if(time<=0){clearInterval(timer);if(score>=20){alert('恭喜，达到福利门槛！')}}},1000)}function hit(){if(time<=0)return;score++;var el=document.getElementById('score');if(el)el.textContent=score}function restart(){score=0;time=30;var scoreEl=document.getElementById('score');var timeEl=document.getElementById('time');if(scoreEl)scoreEl.textContent=score;if(timeEl)timeEl.textContent=time;start()}calc();start()</script></body></html>`
}
