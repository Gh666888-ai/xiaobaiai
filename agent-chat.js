// ========================================
// Agent 群聊室 v2 — 手机+电脑同步
// 启动: node agent-chat.js
// 电脑: http://localhost:9744
// 手机: https://xiaobaiai.cn/chat
// ========================================

const http = require("http")
const https = require("https")
const fs = require("fs")
const path = require("path")
const { exec } = require("child_process")

const PORT = 9744
const SERVER = "https://xiaobaiai.cn/api/chat-room"
const LOCAL_CHAT = path.join(__dirname, "chat-local.json")

const PARTICIPANTS = {
  claude: { name: "Claude", color: "#c9a84c", emoji: "🧠", capability: "写代码/改网站/分析/搜索/规划/内容" },
  clawx:  { name: "ClawX",  color: "#4ade80", emoji: "🤖", capability: "操控桌面/SSH/截图/浏览器/文件/部署" },
  user:   { name: "我",     color: "#60a5fa", emoji: "👤", capability: "决策/提问/确认/发任务" }
}

// ===== 工具函数 =====
function readJSON(p) { try { return JSON.parse(fs.readFileSync(p,"utf8")) } catch { return {messages:[]} } }
function writeJSON(p, d) { fs.writeFileSync(p, JSON.stringify(d,null,2)) }

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let d = ""; res.on("data", c => d += c)
      res.on("end", () => { try { resolve(JSON.parse(d)) } catch { resolve([]) } })
    }).on("error", reject)
  })
}

function httpsPost(url, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body)
    const req = https.request(url, { method: "POST", headers: { "Content-Type": "application/json" } }, res => {
      let d = ""; res.on("data", c => d += c)
      res.on("end", () => { try { resolve(JSON.parse(d)) } catch { resolve({}) } })
    })
    req.on("error", reject)
    req.end(data)
  })
}

function cmdExec(cmd) {
  return new Promise(resolve => {
    exec(cmd, { cwd: __dirname, timeout: 60000 }, (err, stdout, stderr) => {
      resolve({ ok: !err, output: (stdout || stderr).trim() })
    })
  })
}

// ===== ClawX 自动判断是否回复 =====
function clawxShouldReply(msg) {
  const kw = ["部署","ssh","服务器","截图","打开","桌面","git","构建","重启","pm2","nginx","端口","终端","文件","安装"]
  return kw.some(k => msg.toLowerCase().includes(k))
}

// ===== 同步服务器消息到本地 =====
let lastServerTime = Date.now()
async function syncFromServer() {
  try {
    const msgs = await httpsGet(`${SERVER}?after=${lastServerTime}`)
    if (!Array.isArray(msgs) || msgs.length === 0) return

    const local = readJSON(LOCAL_CHAT)
    for (const m of msgs) {
      if (m.time > lastServerTime) lastServerTime = m.time
      // 判断 ClawX 是否该回复
      if (m.role === "user" && clawxShouldReply(m.message)) {
        console.log(`[SYNC] ClawX 应回复: ${m.message}`)
        // 执行命令式回复
        const reply = { role: "clawx", message: "收到，让我来处理...", time: Date.now() }
        local.messages.push(reply)
        await httpsPost(SERVER, reply)
        // 尝试执行
        const commands = parseCommands(m.message)
        for (const cmd of commands) {
          const r = await cmdExec(cmd)
          const result = { role: "clawx", message: r.ok ? `✅ ${cmd}\n${r.output}` : `❌ ${cmd}\n${r.output}`, time: Date.now() }
          local.messages.push(result)
          await httpsPost(SERVER, result)
        }
      }
      if (!local.messages.find(lm => lm.time === m.time)) {
        local.messages.push(m)
      }
    }
    writeJSON(LOCAL_CHAT, local)
  } catch(e) { console.error("[SYNC]", e.message) }
}

function parseCommands(msg) {
  const cmds = []
  const lines = msg.split("\n").filter(l => l.trim())
  for (const line of lines) {
    const trimmed = line.replace(/^\d+\.\s*/, "").trim()
    if (/^(cd |git |ssh |npm |node |whoami|dir |type |echo |pm2 |curl |wget |python )/.test(trimmed)) {
      cmds.push(trimmed)
    }
  }
  return cmds
}

// ===== HTTP Server =====
const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")
  if (req.method === "OPTIONS") { res.writeHead(200); res.end(); return }

  // ===== 本地聊天 UI =====
  if (req.method === "GET" && (req.url === "/" || req.url === "/chat")) {
    const html = `<!DOCTYPE html><html lang="zh"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Agent 群聊室</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0a0a0a;color:#ccc;font-family:'Noto Sans SC','Consolas',monospace;height:100vh;display:flex}
.side{width:190px;background:#0d0d0d;border-right:1px solid #1a1a1a;padding:16px 12px;flex-shrink:0}
.side h2{font-size:10px;color:#555;letter-spacing:.2em;margin-bottom:12px}
.mem{padding:8px;border-radius:6px;font-size:10px;margin-bottom:4px}
.mem .dot{width:6px;height:6px;border-radius:50%;display:inline-block;margin-right:6px}
.mem .nm{font-weight:700;color:#ddd}
.mem .cp{font-size:8px;color:#444;margin-top:2px}
.main{flex:1;display:flex;flex-direction:column}
.hdr{padding:12px 20px;border-bottom:1px solid #1a1a1a;font-size:12px;font-weight:700;color:#fff;display:flex;align-items:center;gap:8px}
.hdr .live{width:6px;height:6px;background:#4ade80;border-radius:50%;animation:pulse 1.5s infinite}
.msgs{flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:10px}
.msg{display:flex;gap:8px;animation:fadeIn .25s ease}
.msg .av{width:28px;height:28px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0}
.msg .bb{flex:1;min-width:0}
.msg .bb .mt{font-size:8px;margin-bottom:2px;display:flex;justify-content:space-between;color:#555}
.msg .bb .bd{font-size:12px;line-height:1.6;color:#ddd;white-space:pre-wrap;word-break:break-word}
.inp{padding:12px 20px;border-top:1px solid #1a1a1a;display:flex;gap:8px}
.inp input{flex:1;background:rgba(255,255,255,0.03);border:1px solid #222;border-radius:8px;padding:10px 14px;font-size:12px;color:#fff;outline:none;font-family:inherit}
.inp button{padding:10px 18px;background:rgba(201,168,76,0.12);border:1px solid #7a6230;border-radius:8px;color:#c9a84c;font-size:11px;font-weight:700;cursor:pointer}
@keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.2}}
</style></head><body>
<div class="side"><h2>群成员</h2>
${Object.values(PARTICIPANTS).map(p=>\`<div class="mem"><span class="dot" style="background:\${p.color};box-shadow:0 0 4px \${p.color}"></span><span class="nm">\${p.emoji} \${p.name}</span><div class="cp">\${p.capability}</div></div>\`).join("")}
<div style="margin-top:auto;font-size:8px;color:#2a2a2a;text-align:center">手机: xiaobaiai.cn/chat</div></div>
<div class="main"><div class="hdr"><div class="live"></div>Agent 群聊室</div>
<div class="msgs" id="ms"><div style="text-align:center;color:#333;margin-top:40px;font-size:11px">发送消息，Agent 自动回复</div></div>
<div class="inp"><input id="in" placeholder="输入消息...（ClawX 自动识别命令）" autofocus onkeydown="if(event.key==='Enter')send()"><button onclick="send()">发送</button></div></div>
<script>
let lt=0;const ms=document.getElementById("ms")
async function poll(){try{const r=await fetch("/api/local?after="+lt);const list=await r.json();list.forEach(m=>{if(m.time>lt)lt=m.time;const p=['claude','clawx','user'].includes(m.role)?PARTICIPANTS_DATA[m.role]:{color:"#888",name:m.from||m.role};ms.innerHTML+= \`<div class="msg"><div class="av" style="background:\${p.color}20;color:\${p.color};font-size:14px">\${(m.role||"?").toUpperCase()[0]}</div><div class="bb"><div class="mt"><span style="color:\${p.color};font-weight:700">\${p.name||m.from}</span><span>\${new Date(m.time).toLocaleTimeString("zh-CN")}</span></div><div class="bd">\${m.message}</div></div></div>\`;ms.scrollTop=ms.scrollHeight})}catch(e){}}
const PARTICIPANTS_DATA=${JSON.stringify(PARTICIPANTS)}
async function send(){const i=document.getElementById("in");const msg=i.value.trim();if(!msg)return;i.value="";const p=PARTICIPANTS_DATA.user;ms.innerHTML+=\`<div class="msg"><div class="av" style="background:\${p.color}20;color:\${p.color}">U</div><div class="bb"><div class="mt"><span style="color:\${p.color}">\${p.name}</span><span>现在</span></div><div class="bd">\${msg}</div></div></div>\`;ms.scrollTop=ms.scrollHeight;await fetch("/api/local",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({role:"user",message:msg})})}
poll();setInterval(poll,2000)
</script></body></html>`
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" })
    res.end(html)
    return
  }

  // ===== 本地消息 API =====
  if (req.method === "GET" && req.url.startsWith("/api/local")) {
    const u = new URL(req.url, `http://localhost:${PORT}`)
    const after = parseInt(u.searchParams.get("after") || "0")
    const local = readJSON(LOCAL_CHAT)
    res.writeHead(200, { "Content-Type": "application/json" })
    res.end(JSON.stringify(local.messages.filter(m => m.time > after).slice(-50)))
    return
  }

  if (req.method === "POST" && req.url === "/api/local") {
    let body = ""
    req.on("data", c => body += c)
    req.on("end", async () => {
      try {
        const { role, message } = JSON.parse(body)
        const time = Date.now()
        const local = readJSON(LOCAL_CHAT)
        local.messages.push({ role, message, time })
        writeJSON(LOCAL_CHAT, local)
        // 同步到服务器
        httpsPost(SERVER, { role, message, time }).catch(() => {})
        res.writeHead(200, { "Content-Type": "application/json" })
        res.end(JSON.stringify({ ok: true }))
      } catch(e) { res.writeHead(400); res.end(JSON.stringify({ error: e.message })) }
    })
    return
  }

  res.writeHead(404); res.end("not found")
})

// 初始化
if (!fs.existsSync(LOCAL_CHAT)) writeJSON(LOCAL_CHAT, { messages: [] })

server.listen(PORT, () => {
  console.log(`🤖 Agent 群聊室 — http://localhost:${PORT}`)
  console.log(`📱 手机访问: https://xiaobaiai.cn/chat`)
  console.log(`👥 ${Object.keys(PARTICIPANTS).length} 人在线\n`)
  syncFromServer()
  setInterval(syncFromServer, 5000)
})
