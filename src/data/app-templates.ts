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

function baseStyle(accent: string, styleName: string) {
  const isWarm = /温暖|亲切|自然/.test(styleName)
  const isBusiness = /商务|高端|正式/.test(styleName)
  const isPlayful = /活泼|活动/.test(styleName)
  const bg = isWarm
    ? "linear-gradient(135deg,#fff8ed 0%,#f6efe4 100%)"
    : isBusiness
      ? "linear-gradient(135deg,#111827 0%,#1f2937 100%)"
      : isPlayful
        ? "linear-gradient(135deg,#14101f 0%,#242038 100%)"
        : "linear-gradient(135deg,#07100f 0%,#101716 100%)"
  const text = isWarm ? "#221a12" : "#f8f3e6"
  const sub = isWarm ? "#675646" : "#c8c8bd"
  const panel = isWarm ? "rgba(255,255,255,0.72)" : "rgba(255,255,255,0.08)"
  return { bg, text, sub, panel, accent }
}

function css(colors: ReturnType<typeof baseStyle>) {
  return `
*{box-sizing:border-box}body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans SC",sans-serif;background:${colors.bg};color:${colors.text}}button,input,select,textarea{font-family:inherit}.page{min-height:100vh;padding:34px 24px}.shell{width:min(100%,1040px);margin:0 auto}.tag{color:${colors.accent};font-weight:950}.hero{display:grid;grid-template-columns:1.05fr .95fr;gap:24px;align-items:center;min-height:calc(100vh - 68px)}@media(max-width:760px){.hero{grid-template-columns:1fr}.page{padding:24px 16px}}.title{font-size:clamp(38px,8vw,78px);line-height:1.04;font-weight:950;margin:12px 0}.desc{font-size:18px;line-height:1.85;color:${colors.sub}}.panel{background:${colors.panel};border:1px solid rgba(255,255,255,.16);border-radius:24px;padding:24px;box-shadow:0 24px 80px rgba(0,0,0,.24)}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:24px}@media(max-width:760px){.grid{grid-template-columns:1fr}}.card{border:1px solid rgba(255,255,255,.13);background:rgba(255,255,255,.07);border-radius:18px;padding:17px}.card b{display:block;margin-bottom:6px}.muted{color:${colors.sub};line-height:1.7}.btn{display:inline-flex;align-items:center;justify-content:center;border:0;border-radius:15px;padding:14px 18px;background:${colors.accent};color:#111;font-weight:950;text-decoration:none;cursor:pointer}.ghost{background:rgba(255,255,255,.1);color:${colors.text};border:1px solid rgba(255,255,255,.18)}label{display:block;font-weight:850;margin:13px 0 7px}input,select,textarea{width:100%;border:1px solid rgba(128,128,128,.24);border-radius:13px;padding:12px 13px;background:rgba(255,255,255,.86);font-size:15px;color:#111}.row{display:grid;grid-template-columns:1fr 1fr;gap:12px}@media(max-width:560px){.row{grid-template-columns:1fr}}.price{font-size:44px;font-weight:950;color:${colors.accent};margin:6px 0}.steps{counter-reset:step;display:grid;gap:10px}.step{display:grid;grid-template-columns:32px 1fr;gap:10px;align-items:start}.step:before{counter-increment:step;content:counter(step);display:grid;place-items:center;width:30px;height:30px;border-radius:999px;background:${colors.accent};color:#111;font-weight:950}.score{font-size:78px;font-weight:950;color:${colors.accent};line-height:1;margin:20px 0}.actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:22px}`
}

function list(items: string[], className = "grid") {
  return `<div class="${className}">${items.map((item) => `<div class="card"><b>${safe(item)}</b><span class="muted">这是用户决策前需要看到的信息。</span></div>`).join("")}</div>`
}

export function generateAppHtml(input: GeneratedAppInput) {
  const template = appTemplates.find((item) => item.id === input.templateId) || appTemplates[0]
  const blueprint = buildBusinessBlueprint(input)
  const industry = safe(clean(input.industry, "你的行业"))
  const audience = safe(clean(input.audience, "目标用户"))
  const contact = safe(clean(input.contact, "立即咨询"))
  const styleName = safe(clean(input.style, "简洁科技"))
  const colors = baseStyle(template.accent, input.style)
  const sheet = css(colors)

  if (template.id === "lead-form") {
    return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${industry}需求收集表</title><style>${sheet}</style></head><body><main class="page"><section class="shell hero"><div><p class="tag">${safe(blueprint.sector)} · ${styleName}</p><h1 class="title">先收集关键需求，再跟进客户</h1><p class="desc">${safe(blueprint.userPain)} 这个表单会优先收集影响成交的信息，而不是只留姓名电话。</p>${list(blueprint.trustProof)}</div><form class="panel"><p class="tag">小白设计的字段</p>${blueprint.captureFields.map((field) => `<label>${safe(field)}</label><input placeholder="请填写${safe(field)}"/>`).join("")}<label>补充说明</label><textarea rows="4" placeholder="还有什么需要我们提前知道？"></textarea><button class="btn" type="button">${contact}</button><p class="muted">下一步：${safe(blueprint.nextWorkflow)}</p></form></section></main></body></html>`
  }

  if (template.id === "quote-calculator") {
    return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${industry}报价计算器</title><style>${sheet}</style></head><body><main class="page"><section class="shell hero"><div><p class="tag">${safe(blueprint.sector)} · 报价器</p><h1 class="title">先给${audience}一个预算感</h1><p class="desc">${safe(blueprint.userPain)} 所以报价器要把套餐、数量和服务深度拆开，让用户先知道大概范围。</p><div class="steps">${blueprint.serviceSteps.map((step) => `<div class="step"><p class="muted">${safe(step)}</p></div>`).join("")}</div></div><section class="panel"><label>选择套餐</label><select id="pkg">${blueprint.packages.map((pkg, index) => `<option value="${pkg.price}" data-desc="${safe(pkg.desc)}">${safe(pkg.name)} · ¥${pkg.price}</option>`).join("")}</select><div class="row"><div><label>数量/周期</label><input id="count" type="number" min="1" value="1"/></div><div><label>服务深度</label><select id="level"><option value="1">基础</option><option value="1.4">标准</option><option value="1.9">深度</option></select></div></div><button class="btn" onclick="calc()">重新估算</button><div class="card"><p class="muted">预估价格</p><div class="price" id="price">¥0</div><p class="muted" id="desc"></p><a class="btn" href="#">${contact}</a></div></section></section></main><script>function calc(){var p=document.getElementById('pkg');var base=Number(p.value);var count=Math.max(1,Number(document.getElementById('count').value)||1);var level=Number(document.getElementById('level').value);document.getElementById('price').textContent='¥'+Math.round(base*count*level).toLocaleString('zh-CN');document.getElementById('desc').textContent=p.options[p.selectedIndex].dataset.desc}calc()</script></body></html>`
  }

  if (template.id === "click-game") {
    return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${industry}互动小游戏</title><style>${sheet}</style></head><body><main class="page"><section class="shell hero"><div><p class="tag">${safe(blueprint.sector)} · 活动互动</p><h1 class="title">${safe(blueprint.hook)}</h1><p class="desc">${safe(blueprint.appGoal)}。用户玩完后给一个明确动作：领福利、预约、咨询或分享。</p>${list(["30 秒倒计时", "点击得分", "结束后引导咨询"])}</div><section class="panel" style="text-align:center"><p class="tag">${industry}挑战</p><div class="score" id="score">0</div><p class="muted">剩余 <b id="time">30</b> 秒 · 达到 20 分可领取福利</p><button class="btn" onclick="hit()">点击得分</button><button class="btn ghost" onclick="restart()">重新开始</button><p class="muted">${contact}</p></section></section></main><script>let score=0,time=30,timer=null;function start(){clearInterval(timer);timer=setInterval(()=>{time--;document.getElementById('time').textContent=time;if(time<=0){clearInterval(timer);if(score>=20){alert('恭喜，达到福利门槛！')}}},1000)}function hit(){if(time<=0)return;score++;document.getElementById('score').textContent=score}function restart(){score=0;time=30;document.getElementById('score').textContent=score;document.getElementById('time').textContent=time;start()}start()</script></body></html>`
  }

  if (template.id === "product-page") {
    return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${industry}商品页</title><style>${sheet}</style></head><body><main class="page"><section class="shell hero"><div><p class="tag">${safe(blueprint.sector)} · ${styleName}</p><h1 class="title">${safe(blueprint.hook)}</h1><p class="desc">${safe(blueprint.userPain)} 所以这个页面先回答“适合谁、解决什么、为什么可信、下一步怎么做”。</p><div class="actions"><a class="btn" href="#">${contact}</a><a class="btn ghost" href="#">查看套餐</a></div>${list(blueprint.trustProof)}</div><aside class="panel"><p class="tag">推荐套餐</p>${blueprint.packages.map((pkg) => `<div class="card" style="margin-top:10px"><b>${safe(pkg.name)} · ¥${pkg.price}</b><span class="muted">${safe(pkg.desc)}</span></div>`).join("")}<p class="muted">下一步：${safe(blueprint.nextWorkflow)}</p></aside></section></main></body></html>`
  }

  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${industry}网站首屏</title><style>${sheet}</style></head><body><main class="page"><section class="shell hero"><div><p class="tag">${safe(blueprint.sector)} · ${styleName}</p><h1 class="title">${safe(blueprint.hook)}</h1><p class="desc">${safe(blueprint.userPain)} 当前目标：${safe(blueprint.appGoal)}。</p><div class="actions"><a class="btn" href="#">${contact}</a><a class="btn ghost" href="#">先看流程</a></div>${list(blueprint.trustProof)}</div><aside class="panel"><p class="tag">小白拆出的转化路径</p><div class="steps">${blueprint.serviceSteps.map((step) => `<div class="step"><p class="muted">${safe(step)}</p></div>`).join("")}</div><div class="card" style="margin-top:16px"><b>上线后下一步</b><span class="muted">${safe(blueprint.nextWorkflow)}</span></div></aside></section></main></body></html>`
}
