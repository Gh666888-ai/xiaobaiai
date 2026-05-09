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

export const APP_FACTORY_STORAGE_KEY = "xiaobaiai:generated-apps:v1"

export const appTemplates: AppTemplate[] = [
  {
    id: "site-hero",
    title: "做一个网站首屏",
    shortTitle: "网站首屏",
    description: "适合个人、门店、产品、课程、活动先做一个能打开的页面。",
    bestFor: "官网、门店页、个人主页、课程页",
    defaultGoal: "让用户看懂我是谁、提供什么、怎么联系我",
    accent: "#76b39d",
  },
  {
    id: "lead-form",
    title: "做一个报名/预约表",
    shortTitle: "报名表",
    description: "适合收集客户需求、课程报名、到店预约和活动登记。",
    bestFor: "获客、预约、咨询、活动报名",
    defaultGoal: "让用户留下姓名、联系方式和需求",
    accent: "#d8bf76",
  },
  {
    id: "quote-calculator",
    title: "做一个报价计算器",
    shortTitle: "报价器",
    description: "适合装修、设计、课程、服务套餐先做一个粗略估价工具。",
    bestFor: "报价、预算、套餐选择",
    defaultGoal: "让客户快速估算大概费用并愿意咨询",
    accent: "#86a8e7",
  },
  {
    id: "product-page",
    title: "做一个商品介绍页",
    shortTitle: "商品页",
    description: "适合电商、实体产品、服务套餐做卖点、价格和咨询入口。",
    bestFor: "商品、服务、套餐、课程",
    defaultGoal: "让用户快速理解卖点并点击咨询",
    accent: "#e89f71",
  },
  {
    id: "click-game",
    title: "做一个点击得分小游戏",
    shortTitle: "小游戏",
    description: "适合活动页、直播间、社群互动先做一个能点能计分的小游戏。",
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

function normalize(value: string, fallback: string) {
  const clean = String(value || "").trim()
  return escapeHtml(clean || fallback)
}

function baseStyle(accent: string, styleName: string) {
  const isWarm = /温暖|亲切|自然/.test(styleName)
  const isBusiness = /商务|高端|正式/.test(styleName)
  const bg = isWarm
    ? "linear-gradient(135deg,#fff8ed 0%,#f6efe4 100%)"
    : isBusiness
      ? "linear-gradient(135deg,#111827 0%,#1f2937 100%)"
      : "linear-gradient(135deg,#07100f 0%,#101716 100%)"
  const text = isWarm ? "#221a12" : "#f8f3e6"
  const sub = isWarm ? "#675646" : "#c8c8bd"
  const panel = isWarm ? "rgba(255,255,255,0.66)" : "rgba(255,255,255,0.08)"
  return { bg, text, sub, panel, accent }
}

export function generateAppHtml(input: GeneratedAppInput) {
  const template = appTemplates.find((item) => item.id === input.templateId) || appTemplates[0]
  const industry = normalize(input.industry, "你的行业")
  const goal = normalize(input.goal, template.defaultGoal)
  const audience = normalize(input.audience, "目标用户")
  const contact = normalize(input.contact, "点击咨询")
  const styleName = normalize(input.style, "简洁科技")
  const colors = baseStyle(template.accent, input.style)

  if (template.id === "lead-form") {
    return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${industry}预约表</title>
<style>
body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans SC",sans-serif;background:${colors.bg};color:${colors.text}}
.wrap{min-height:100vh;display:grid;place-items:center;padding:28px}
.panel{width:min(100%,560px);background:${colors.panel};border:1px solid rgba(255,255,255,.16);border-radius:22px;padding:28px;box-shadow:0 24px 80px rgba(0,0,0,.22)}
.tag{color:${colors.accent};font-weight:900;font-size:14px;margin-bottom:10px}.title{font-size:34px;line-height:1.15;font-weight:950;margin:0 0 12px}.desc{color:${colors.sub};line-height:1.8;margin:0 0 22px}
label{display:block;font-weight:800;margin:14px 0 7px}input,textarea,select{width:100%;box-sizing:border-box;border:1px solid rgba(128,128,128,.22);border-radius:13px;padding:13px 14px;background:rgba(255,255,255,.78);font-size:15px;color:#111}
button{width:100%;margin-top:18px;border:0;border-radius:14px;padding:14px 18px;background:${colors.accent};color:#111;font-weight:950;font-size:16px}.hint{margin-top:14px;color:${colors.sub};font-size:13px}
</style>
</head>
<body><main class="wrap"><section class="panel"><p class="tag">${industry} · ${styleName}</p><h1 class="title">预约一次${industry}咨询</h1><p class="desc">面向${audience}，目标是：${goal}。留下需求后，我们会尽快联系你。</p><label>姓名</label><input placeholder="请输入姓名" /><label>联系方式</label><input placeholder="${contact}" /><label>需求类型</label><select><option>先了解一下</option><option>需要报价</option><option>想预约体验</option></select><label>补充说明</label><textarea rows="4" placeholder="简单写下你的需求"></textarea><button>提交预约</button><p class="hint">小白提醒：正式上线前，需要接入真实表单或客服微信。</p></section></main></body></html>`
  }

  if (template.id === "quote-calculator") {
    return `<!doctype html>
<html lang="zh-CN">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /><title>${industry}报价器</title>
<style>
body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans SC",sans-serif;background:${colors.bg};color:${colors.text}}.wrap{min-height:100vh;display:grid;place-items:center;padding:28px}.panel{width:min(100%,620px);background:${colors.panel};border:1px solid rgba(255,255,255,.16);border-radius:22px;padding:28px;box-shadow:0 24px 80px rgba(0,0,0,.22)}.tag{color:${colors.accent};font-weight:900}.title{font-size:34px;line-height:1.15;font-weight:950;margin:8px 0 12px}.desc{color:${colors.sub};line-height:1.8}.row{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:20px 0}@media(max-width:560px){.row{grid-template-columns:1fr}}label{display:block;font-weight:850;margin-bottom:7px}input,select{width:100%;box-sizing:border-box;border:1px solid rgba(128,128,128,.22);border-radius:13px;padding:13px;background:rgba(255,255,255,.82);font-size:15px}.result{border-radius:18px;background:rgba(0,0,0,.22);padding:20px;margin-top:16px}.num{font-size:42px;font-weight:950;color:${colors.accent}}button{border:0;border-radius:14px;padding:13px 18px;background:${colors.accent};color:#111;font-weight:950}
</style></head>
<body><main class="wrap"><section class="panel"><p class="tag">${industry} · 快速估价</p><h1 class="title">先算一个大概预算</h1><p class="desc">给${audience}使用，目标是：${goal}。这个报价只做初步参考。</p><div class="row"><div><label>基础套餐</label><select id="base"><option value="399">入门 ¥399</option><option value="899">标准 ¥899</option><option value="1599">进阶 ¥1599</option></select></div><div><label>数量/周期</label><input id="count" type="number" min="1" value="1" /></div></div><button onclick="calc()">立即估算</button><div class="result"><p>预估价格</p><div class="num" id="price">¥399</div><p>${contact}</p></div></section></main><script>function calc(){var base=Number(document.getElementById('base').value);var count=Math.max(1,Number(document.getElementById('count').value)||1);document.getElementById('price').textContent='¥'+(base*count).toLocaleString('zh-CN')}calc()</script></body></html>`
  }

  if (template.id === "click-game") {
    return `<!doctype html>
<html lang="zh-CN">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /><title>小白点击挑战</title>
<style>
body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans SC",sans-serif;background:${colors.bg};color:${colors.text}}.game{min-height:100vh;display:grid;place-items:center;padding:24px;text-align:center}.panel{width:min(100%,520px);background:${colors.panel};border:1px solid rgba(255,255,255,.16);border-radius:26px;padding:34px;box-shadow:0 24px 80px rgba(0,0,0,.26)}.tag{color:${colors.accent};font-weight:900}.title{font-size:40px;font-weight:950;margin:8px 0}.desc{color:${colors.sub};line-height:1.8}.score{font-size:70px;font-weight:950;color:${colors.accent};line-height:1;margin:24px 0}.meta{display:flex;justify-content:center;gap:12px;flex-wrap:wrap;color:${colors.sub}}button{border:0;border-radius:18px;padding:16px 24px;margin:16px 6px 0;background:${colors.accent};color:#111;font-size:17px;font-weight:950}.ghost{background:rgba(255,255,255,.12);color:${colors.text};border:1px solid rgba(255,255,255,.18)}
</style></head>
<body><main class="game"><section class="panel"><p class="tag">${industry}互动小游戏</p><h1 class="title">小白点击挑战</h1><p class="desc">面向${audience}：${goal}</p><div class="score" id="score">0</div><div class="meta"><span>剩余 <b id="time">30</b> 秒</span><span>${contact}</span></div><button onclick="hit()">点击得分</button><button class="ghost" onclick="restart()">重新开始</button></section></main><script>let score=0,time=30,timer=null;function start(){clearInterval(timer);timer=setInterval(()=>{time--;document.getElementById('time').textContent=time;if(time<=0){clearInterval(timer)}},1000)}function hit(){if(time<=0)return;score++;document.getElementById('score').textContent=score}function restart(){score=0;time=30;document.getElementById('score').textContent=score;document.getElementById('time').textContent=time;start()}start()</script></body></html>`
  }

  if (template.id === "product-page") {
    return `<!doctype html>
<html lang="zh-CN">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /><title>${industry}商品页</title>
<style>
body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans SC",sans-serif;background:${colors.bg};color:${colors.text}}.wrap{min-height:100vh;padding:44px 24px;display:grid;place-items:center}.page{width:min(100%,980px);display:grid;grid-template-columns:1fr .86fr;gap:24px;align-items:center}@media(max-width:760px){.page{grid-template-columns:1fr}}.tag{color:${colors.accent};font-weight:900}.title{font-size:48px;line-height:1.08;font-weight:950;margin:12px 0}.desc{font-size:18px;line-height:1.8;color:${colors.sub}}.actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:22px}.btn{border-radius:14px;padding:14px 18px;text-decoration:none;font-weight:950}.primary{background:${colors.accent};color:#111}.ghost{border:1px solid rgba(255,255,255,.18);color:${colors.text}}.box{background:${colors.panel};border:1px solid rgba(255,255,255,.16);border-radius:24px;padding:24px}.item{padding:16px 0;border-bottom:1px solid rgba(255,255,255,.12)}.item:last-child{border-bottom:0}.item b{display:block;margin-bottom:5px}
</style></head>
<body><main class="wrap"><section class="page"><div><p class="tag">${industry} · ${styleName}</p><h1 class="title">让${audience}一眼看懂你的产品</h1><p class="desc">${goal}。这个页面先放核心卖点、价格入口和咨询按钮，后面再补真实图片与案例。</p><div class="actions"><a class="btn primary" href="#">${contact}</a><a class="btn ghost" href="#">查看案例</a></div></div><aside class="box"><div class="item"><b>卖点 1：清楚</b><span>用户不用猜，打开就知道你能解决什么问题。</span></div><div class="item"><b>卖点 2：可信</b><span>补上真实案例、参数、服务流程和售后边界。</span></div><div class="item"><b>卖点 3：能行动</b><span>按钮、联系方式、下一步动作都放在显眼位置。</span></div></aside></section></main></body></html>`
  }

  return `<!doctype html>
<html lang="zh-CN">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /><title>${industry}网站首屏</title>
<style>
body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans SC",sans-serif;background:${colors.bg};color:${colors.text}}.hero{min-height:100vh;display:grid;place-items:center;padding:36px 24px}.inner{width:min(100%,980px)}.tag{color:${colors.accent};font-weight:900}.title{font-size:clamp(42px,9vw,86px);line-height:1.02;font-weight:950;max-width:850px;margin:14px 0}.desc{font-size:19px;line-height:1.85;color:${colors.sub};max-width:680px}.actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:26px}.btn{border-radius:14px;padding:14px 18px;text-decoration:none;font-weight:950}.primary{background:${colors.accent};color:#111}.ghost{border:1px solid rgba(255,255,255,.18);color:${colors.text}}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:38px}@media(max-width:720px){.grid{grid-template-columns:1fr}.title{font-size:44px}}.card{background:${colors.panel};border:1px solid rgba(255,255,255,.14);border-radius:18px;padding:18px}.card b{display:block;margin-bottom:7px}.card span{color:${colors.sub};line-height:1.7}
</style></head>
<body><main class="hero"><section class="inner"><p class="tag">${industry} · ${styleName}</p><h1 class="title">为${audience}做一个更容易行动的页面</h1><p class="desc">${goal}。先用这一版把核心信息说清楚，后面再补真实图片、案例和表单。</p><div class="actions"><a class="btn primary" href="#">${contact}</a><a class="btn ghost" href="#">了解服务</a></div><div class="grid"><div class="card"><b>清楚说明</b><span>一句话讲明你提供什么，适合谁。</span></div><div class="card"><b>降低犹豫</b><span>把流程、价格范围和案例放到下一屏。</span></div><div class="card"><b>马上联系</b><span>按钮和联系方式放在用户看得到的位置。</span></div></div></section></main></body></html>`
}
