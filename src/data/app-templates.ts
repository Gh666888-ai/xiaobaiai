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
  soft: string
  panel: string
  border: string
  accent: string
  accent2: string
  ink: string
  glow: string
}

export const APP_FACTORY_STORAGE_KEY = "xiaobaiai:generated-apps:v1"

export const appTemplates: AppTemplate[] = [
  {
    id: "site-hero",
    title: "做一个网站首屏",
    shortTitle: "网站首屏",
    description: "适合先把业务讲清楚：你做什么、适合谁、为什么可信、下一步怎么联系。",
    bestFor: "官网、门店页、个人主页、课程页",
    defaultGoal: "让用户看懂我是谁、提供什么、怎么联系我",
    accent: "#76b39d",
  },
  {
    id: "lead-form",
    title: "做一个报名/预约表",
    shortTitle: "报名表",
    description: "不是普通表单，而是按行业收集关键需求，方便后续报价、跟进和转化。",
    bestFor: "获客、预约、咨询、活动报名",
    defaultGoal: "让用户留下姓名、联系方式和需求",
    accent: "#d8bf76",
  },
  {
    id: "quote-calculator",
    title: "做一个报价计算器",
    shortTitle: "报价器",
    description: "用套餐、数量、服务深度生成初步价格，让客户先有预算感。",
    bestFor: "报价、预算、套餐选择",
    defaultGoal: "让客户快速估算大概费用并愿意咨询",
    accent: "#86a8e7",
  },
  {
    id: "product-page",
    title: "做一个商品介绍页",
    shortTitle: "商品页",
    description: "把卖点、适合人群、购买理由、信任证明和行动按钮放到一个页面。",
    bestFor: "商品、服务、套餐、课程",
    defaultGoal: "让用户快速理解卖点并点击咨询",
    accent: "#e89f71",
  },
  {
    id: "click-game",
    title: "做一个点击得分小游戏",
    shortTitle: "小游戏",
    description: "把活动目标放进游戏里：得分、倒计时、奖励和引导动作都能跑。",
    bestFor: "互动、活动、引流、小游戏",
    defaultGoal: "让用户点击按钮得分并愿意分享结果",
    accent: "#c7a8ff",
  },
]

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

function baseStyle(accent: string, styleName: string): Palette {
  if (/温暖|亲切|自然/.test(styleName)) {
    return {
      bg: "linear-gradient(135deg,#fff7ea 0%,#f5ead8 46%,#e9f4eb 100%)",
      text: "#24180d",
      sub: "#695844",
      soft: "#fffaf2",
      panel: "rgba(255,255,255,.74)",
      border: "rgba(86,63,32,.16)",
      accent,
      accent2: "#e8995f",
      ink: "#17110b",
      glow: "rgba(216,191,118,.26)",
    }
  }
  if (/商务|高端|正式/.test(styleName)) {
    return {
      bg: "radial-gradient(circle at 18% 8%,rgba(107,139,255,.25),transparent 34%),linear-gradient(135deg,#070b13 0%,#111827 52%,#182033 100%)",
      text: "#f8f3e6",
      sub: "#bfc6d4",
      soft: "#121a2a",
      panel: "rgba(255,255,255,.08)",
      border: "rgba(255,255,255,.16)",
      accent,
      accent2: "#d8bf76",
      ink: "#070b13",
      glow: "rgba(134,168,231,.24)",
    }
  }
  if (/活泼|活动/.test(styleName)) {
    return {
      bg: "radial-gradient(circle at 80% 12%,rgba(199,168,255,.28),transparent 30%),linear-gradient(135deg,#130f20 0%,#211936 58%,#102c33 100%)",
      text: "#fff7f0",
      sub: "#d6cfe4",
      soft: "#1f1730",
      panel: "rgba(255,255,255,.09)",
      border: "rgba(255,255,255,.16)",
      accent,
      accent2: "#76d3c5",
      ink: "#100d18",
      glow: "rgba(199,168,255,.24)",
    }
  }
  return {
    bg: "radial-gradient(circle at 82% 12%,rgba(118,179,157,.25),transparent 32%),linear-gradient(135deg,#061211 0%,#101716 54%,#15211e 100%)",
    text: "#f8f3e6",
    sub: "#c8c8bd",
    soft: "#101b18",
    panel: "rgba(255,255,255,.08)",
    border: "rgba(255,255,255,.15)",
    accent,
    accent2: "#d8bf76",
    ink: "#07100f",
    glow: "rgba(118,179,157,.26)",
  }
}

function css(colors: Palette) {
  return `
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans SC",sans-serif;background:${colors.bg};color:${colors.text}}button,input,select,textarea{font-family:inherit}.page{min-height:100vh;position:relative;overflow:hidden}.page:before{content:"";position:fixed;inset:-20%;background:linear-gradient(115deg,transparent 0 38%,rgba(255,255,255,.06) 39%,transparent 40% 100%);pointer-events:none;animation:sheen 8s linear infinite}@keyframes sheen{from{transform:translateX(-18%)}to{transform:translateX(18%)}}.orb{position:absolute;border-radius:999px;filter:blur(18px);opacity:.45;pointer-events:none}.orb.a{width:260px;height:260px;background:${colors.glow};right:8%;top:8%}.orb.b{width:220px;height:220px;background:rgba(216,191,118,.18);left:-60px;bottom:12%}.shell{width:min(100%,1120px);margin:0 auto;padding:26px 22px 58px}.nav{height:58px;display:flex;align-items:center;justify-content:space-between;gap:16px;border-bottom:1px solid ${colors.border};position:relative;z-index:2}.brand{display:flex;align-items:center;gap:10px;font-weight:950}.logo{width:34px;height:34px;border-radius:12px;background:linear-gradient(135deg,${colors.accent},${colors.accent2});box-shadow:0 14px 36px ${colors.glow}}.nav a{color:${colors.sub};text-decoration:none;font-size:14px;font-weight:850}.hero{display:grid;grid-template-columns:1.05fr .95fr;gap:26px;align-items:center;min-height:calc(100vh - 112px);position:relative;z-index:1}@media(max-width:820px){.hero{grid-template-columns:1fr;min-height:auto;padding-top:34px}.shell{padding:18px 16px 48px}}.eyebrow{display:inline-flex;align-items:center;gap:8px;color:${colors.accent2};font-weight:950;font-size:13px;letter-spacing:.04em;border:1px solid ${colors.border};background:${colors.panel};border-radius:999px;padding:8px 11px}.title{font-size:clamp(38px,7.4vw,76px);line-height:1.02;font-weight:950;margin:16px 0 14px;letter-spacing:0}.desc{font-size:18px;line-height:1.85;color:${colors.sub};max-width:720px}.panel{background:${colors.panel};border:1px solid ${colors.border};border-radius:26px;padding:24px;box-shadow:0 24px 80px rgba(0,0,0,.25);backdrop-filter:blur(18px)}.showcase{position:relative;min-height:420px;overflow:hidden}.showcase:before{content:"";position:absolute;inset:-1px;background:radial-gradient(circle at 30% 18%,${colors.glow},transparent 30%);pointer-events:none}.phone{position:relative;margin:0 auto;width:min(100%,370px);min-height:520px;border-radius:34px;background:linear-gradient(145deg,rgba(255,255,255,.18),rgba(255,255,255,.045));border:1px solid ${colors.border};padding:16px;box-shadow:0 34px 90px rgba(0,0,0,.34)}.screen{height:100%;border-radius:25px;background:rgba(0,0,0,.18);border:1px solid ${colors.border};padding:18px;display:grid;gap:13px}.metric-row{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin:22px 0}.metric{border:1px solid ${colors.border};background:${colors.panel};border-radius:18px;padding:14px}.metric b{display:block;font-size:22px;color:${colors.text};margin-bottom:2px}.metric span,.muted{color:${colors.sub};line-height:1.7}.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:13px;margin-top:24px}@media(max-width:680px){.grid{grid-template-columns:1fr}.metric-row{grid-template-columns:1fr}}.card{border:1px solid ${colors.border};background:${colors.panel};border-radius:20px;padding:17px;position:relative;overflow:hidden}.card:after{content:"";position:absolute;inset:auto 0 0;height:2px;background:linear-gradient(90deg,${colors.accent},transparent);opacity:.78}.card b{display:block;margin-bottom:7px;color:${colors.text}}.btn{display:inline-flex;align-items:center;justify-content:center;border:0;border-radius:16px;padding:14px 18px;background:linear-gradient(135deg,${colors.accent},${colors.accent2});color:${colors.ink};font-weight:950;text-decoration:none;cursor:pointer;box-shadow:0 18px 40px ${colors.glow}}.ghost{background:${colors.panel};color:${colors.text};border:1px solid ${colors.border};box-shadow:none}.actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:22px}.steps{counter-reset:step;display:grid;gap:11px}.step{display:grid;grid-template-columns:34px 1fr;gap:11px;align-items:start}.step:before{counter-increment:step;content:counter(step);display:grid;place-items:center;width:32px;height:32px;border-radius:12px;background:linear-gradient(135deg,${colors.accent},${colors.accent2});color:${colors.ink};font-weight:950}.step b{display:block;margin-bottom:4px}.section{padding:54px 0;position:relative;z-index:1}.section-title{font-size:clamp(26px,4vw,42px);line-height:1.16;margin:0 0 12px;font-weight:950}.two{display:grid;grid-template-columns:1fr 1fr;gap:18px}@media(max-width:820px){.two{grid-template-columns:1fr}}label{display:block;font-weight:900;margin:13px 0 7px}.hint{display:block;margin-top:5px;font-size:13px;color:${colors.sub};line-height:1.55}input,select,textarea{width:100%;border:1px solid rgba(128,128,128,.24);border-radius:14px;padding:13px 14px;background:rgba(255,255,255,.88);font-size:15px;color:#111}.row{display:grid;grid-template-columns:1fr 1fr;gap:12px}@media(max-width:560px){.row{grid-template-columns:1fr}}.price{font-size:50px;font-weight:950;color:${colors.accent2};margin:6px 0}.score{font-size:84px;font-weight:950;color:${colors.accent2};line-height:1;margin:20px 0}.floating{animation:floaty 4.6s ease-in-out infinite}@keyframes floaty{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`
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
  return `<header class="nav"><div class="brand"><span class="logo"></span><span>${industry}</span></div><nav><a href="#proof">信任证明</a> · <a href="#action">${contact}</a></nav></header>`
}

function floatingPreview(blueprint: BusinessBlueprint, industry: string, contact: string) {
  return `<aside class="panel showcase floating"><div class="phone"><div class="screen"><p class="eyebrow">${safe(blueprint.sector)}</p><h2 style="font-size:32px;line-height:1.08;margin:0">${safe(industry)}增长中控</h2><p class="muted">${safe(blueprint.coreOffer)} · ${safe(blueprint.appGoal)}</p>${metricCards(blueprint)}<div class="card"><b>下一步自动化</b><span class="muted">${safe(blueprint.nextWorkflow)}</span></div><a class="btn" href="#action">${safe(contact)}</a></div></div></aside>`
}

function packageCards(blueprint: BusinessBlueprint) {
  return blueprint.packages
    .map((pkg) => `<div class="card"><b>${safe(pkg.name)} · ¥${pkg.price}</b><span class="muted">${safe(pkg.desc)}</span></div>`)
    .join("")
}

export function generateAppHtml(input: GeneratedAppInput) {
  const template = appTemplates.find((item) => item.id === input.templateId) || appTemplates[0]
  const blueprint = buildBusinessBlueprint(input)
  const rawIndustry = clean(input.industry, "你的行业")
  const industry = safe(rawIndustry)
  const audience = safe(clean(input.audience, "目标用户"))
  const contact = safe(clean(input.contact, "立即咨询"))
  const styleName = safe(clean(input.style, "简洁科技"))
  const colors = baseStyle(template.accent, input.style)
  const sheet = css(colors)

  if (template.id === "lead-form") {
    return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${industry}需求收集表</title><style>${sheet}</style></head><body><main class="page"><span class="orb a"></span><span class="orb b"></span><div class="shell">${nav(industry, contact)}<section class="hero"><div><p class="eyebrow">${safe(blueprint.sector)} · ${styleName}</p><h1 class="title">把普通表单升级成客户筛选器</h1><p class="desc">${safe(blueprint.userPain)} 这版会先问影响成交的问题，再把线索交给后续跟进。</p>${metricCards(blueprint)}<div class="actions"><a class="btn" href="#action">${contact}</a><a class="btn ghost" href="#proof">看为什么这样问</a></div></div><form class="panel" id="action"><p class="eyebrow">小白设计的字段</p>${blueprint.captureFields.map((field) => fieldControl(field, blueprint)).join("")}<label>补充说明<span class="hint">写用户没法用选项表达的特殊情况，方便后面人工确认。</span></label><textarea rows="4" placeholder="还有什么需要我们提前知道？"></textarea><button class="btn" type="button">${contact}</button><p class="muted">提交后：${safe(blueprint.nextWorkflow)}</p></form></section><section class="section" id="proof"><h2 class="section-title">这不是收集信息，是为了后面能成交</h2>${proofCards(blueprint.trustProof, blueprint)}</section></div></main></body></html>`
  }

  if (template.id === "quote-calculator") {
    return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${industry}报价计算器</title><style>${sheet}</style></head><body><main class="page"><span class="orb a"></span><span class="orb b"></span><div class="shell">${nav(industry, contact)}<section class="hero"><div><p class="eyebrow">${safe(blueprint.sector)} · 报价器</p><h1 class="title">先给${audience}一个预算感</h1><p class="desc">${safe(blueprint.userPain)} 所以报价器要把套餐、数量和服务深度拆开，让用户先知道大概范围。</p>${stepList(blueprint.serviceSteps, blueprint)}</div><section class="panel" id="action"><p class="eyebrow">智能估算</p><label>选择套餐<span class="hint">套餐不是摆价格，是让用户先选一个心理预算档位。</span></label><select id="pkg">${blueprint.packages.map((pkg) => `<option value="${pkg.price}" data-desc="${safe(pkg.desc)}">${safe(pkg.name)} · ¥${pkg.price}</option>`).join("")}</select><div class="row"><div><label>数量/周期<span class="hint">数量越大，报价越接近真实执行成本。</span></label><input id="count" type="number" min="1" value="1"/></div><div><label>服务深度<span class="hint">基础、标准、深度代表不同交付复杂度。</span></label><select id="level"><option value="1">基础</option><option value="1.4">标准</option><option value="1.9">深度</option></select></div></div><button class="btn" onclick="calc()" type="button">重新估算</button><div class="card" style="margin-top:16px"><p class="muted">预估价格</p><div class="price" id="price">¥0</div><p class="muted" id="desc"></p><a class="btn" href="#">${contact}</a></div></section></section><section class="section" id="proof"><h2 class="section-title">报价背后的信任点</h2>${proofCards(blueprint.trustProof, blueprint)}</section></div></main><script>function calc(){var p=document.getElementById('pkg');var base=Number(p.value);var count=Math.max(1,Number(document.getElementById('count').value)||1);var level=Number(document.getElementById('level').value);document.getElementById('price').textContent='¥'+Math.round(base*count*level).toLocaleString('zh-CN');document.getElementById('desc').textContent=p.options[p.selectedIndex].dataset.desc}calc()</script></body></html>`
  }

  if (template.id === "click-game") {
    return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${industry}互动小游戏</title><style>${sheet}</style></head><body><main class="page"><span class="orb a"></span><span class="orb b"></span><div class="shell">${nav(industry, contact)}<section class="hero"><div><p class="eyebrow">${safe(blueprint.sector)} · 活动互动</p><h1 class="title">${safe(blueprint.hook)}</h1><p class="desc">${safe(blueprint.appGoal)}。用户玩完后给一个明确动作：领福利、预约、咨询或分享。</p>${proofCards(["30 秒倒计时", "点击得分", "结束后引导咨询"], blueprint)}</div><section class="panel" id="action" style="text-align:center"><p class="eyebrow">${industry}挑战</p><div class="score" id="score">0</div><p class="muted">剩余 <b id="time">30</b> 秒 · 达到 20 分可领取福利</p><button class="btn" onclick="hit()" type="button">点击得分</button><button class="btn ghost" onclick="restart()" type="button">重新开始</button><div class="card" style="margin-top:16px;text-align:left"><b>结束后动作</b><span class="muted">${contact}，并把结果同步给后续跟进。</span></div></section></section></div></main><script>let score=0,time=30,timer=null;function start(){clearInterval(timer);timer=setInterval(()=>{time--;document.getElementById('time').textContent=time;if(time<=0){clearInterval(timer);if(score>=20){alert('恭喜，达到福利门槛！')}}},1000)}function hit(){if(time<=0)return;score++;document.getElementById('score').textContent=score}function restart(){score=0;time=30;document.getElementById('score').textContent=score;document.getElementById('time').textContent=time;start()}start()</script></body></html>`
  }

  if (template.id === "product-page") {
    return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${industry}商品页</title><style>${sheet}</style></head><body><main class="page"><span class="orb a"></span><span class="orb b"></span><div class="shell">${nav(industry, contact)}<section class="hero"><div><p class="eyebrow">${safe(blueprint.sector)} · ${styleName}</p><h1 class="title">${safe(blueprint.hook)}</h1><p class="desc">${safe(blueprint.userPain)} 所以这个页面先回答“适合谁、解决什么、为什么可信、下一步怎么做”。</p>${metricCards(blueprint)}<div class="actions"><a class="btn" href="#action">${contact}</a><a class="btn ghost" href="#proof">查看购买理由</a></div></div><aside class="panel" id="action"><p class="eyebrow">推荐套餐</p>${packageCards(blueprint)}<p class="muted">下一步：${safe(blueprint.nextWorkflow)}</p></aside></section><section class="section" id="proof"><h2 class="section-title">用户下单前必须看懂的 4 件事</h2>${proofCards(blueprint.trustProof, blueprint)}</section></div></main></body></html>`
  }

  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${industry}网站首屏</title><style>${sheet}</style></head><body><main class="page"><span class="orb a"></span><span class="orb b"></span><div class="shell">${nav(industry, contact)}<section class="hero"><div><p class="eyebrow">${safe(blueprint.sector)} · ${styleName}</p><h1 class="title">${safe(blueprint.hook)}</h1><p class="desc">${safe(blueprint.userPain)} 当前目标：${safe(blueprint.appGoal)}。</p>${metricCards(blueprint)}<div class="actions"><a class="btn" href="#action">${contact}</a><a class="btn ghost" href="#proof">先看流程</a></div></div>${floatingPreview(blueprint, industry, contact)}</section><section class="section two" id="proof"><div><h2 class="section-title">小白拆出的转化路径</h2>${stepList(blueprint.serviceSteps, blueprint)}</div><div>${proofCards(blueprint.trustProof, blueprint)}<div class="card" id="action" style="margin-top:16px"><b>上线后下一步</b><span class="muted">${safe(blueprint.nextWorkflow)}</span></div></div></section></div></main></body></html>`
}
