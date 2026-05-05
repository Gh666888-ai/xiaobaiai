// Claude ↔ ClawX 桥接服务 v2 + 可视化聊天窗口
// 启动：node agent-bridge.js
// 聊天窗口：http://localhost:9724

const http = require("http")
const fs = require("fs")
const path = require("path")

const BRIDGE_DIR = __dirname
const INBOX  = path.join(BRIDGE_DIR, "clawx-inbox.json")
const OUTBOX = path.join(BRIDGE_DIR, "clawx-outbox.json")
const CHATLOG = path.join(BRIDGE_DIR, "clawx-chatlog.json")

// 初始化
if (!fs.existsSync(INBOX))  fs.writeFileSync(INBOX,  JSON.stringify({ messages: [] }, null, 2))
if (!fs.existsSync(OUTBOX)) fs.writeFileSync(OUTBOX, JSON.stringify({ messages: [] }, null, 2))
if (!fs.existsSync(CHATLOG)) fs.writeFileSync(CHATLOG, JSON.stringify([], null, 2))

function appendChat(entry) {
  const log = JSON.parse(fs.readFileSync(CHATLOG, "utf8"))
  log.push({ ...entry, time: new Date().toISOString() })
  fs.writeFileSync(CHATLOG, JSON.stringify(log, null, 2))
}

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  if (req.method === "OPTIONS") { res.writeHead(200); res.end(); return }

  // ========== 聊天窗口（你在浏览器里看的） ==========
  if (req.method === "GET" && (req.url === "/" || req.url === "/chat")) {
    const chatHtml = `<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Claude ↔ ClawX 协作台</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0a0a0a;color:#ccc;font-family:'JetBrains Mono','Consolas',monospace;height:100vh;display:flex;flex-direction:column}
.header{background:#111;border-bottom:1px solid #222;padding:16px 24px;display:flex;align-items:center;gap:12px}
.dot{width:8px;height:8px;border-radius:50%}
.dot.green{background:#4ade80;box-shadow:0 0 8px #4ade80}
.header h1{font-size:14px;font-weight:700;color:#fff}
.header span{font-size:10px;color:#666}
.msgs{flex:1;overflow-y:auto;padding:24px;display:flex;flex-direction:column;gap:16px}
.msg{display:flex;gap:12px;animation:fadeIn .3s ease}
.msg.claude .bubble{background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.2)}
.msg.clawx  .bubble{background:rgba(74,222,128,0.06);border:1px solid rgba(74,222,128,0.15)}
.msg.system .bubble{background:rgba(100,100,255,0.06);border:1px solid rgba(100,100,255,0.15);text-align:center;font-size:10px;color:#666}
.avatar{width:32px;height:32px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:900;flex-shrink:0}
.msg.claude .avatar{background:rgba(201,168,76,0.2);color:#e8c96a}
.msg.clawx  .avatar{background:rgba(74,222,128,0.2);color:#4ade80}
.msg.system .avatar{background:rgba(100,100,255,0.2);color:#88a}
.bubble{flex:1;padding:12px 16px;border-radius:8px;font-size:12px;line-height:1.7;word-break:break-word}
.bubble .meta{font-size:9px;margin-bottom:6px;display:flex;justify-content:space-between;color:#555}
.bubble .meta .who{font-weight:700}
.msg.claude .who{color:#c9a84c}
.msg.clawx  .who{color:#4ade80}
.msg.system .who{color:#88a}
.bubble .body{color:#ddd;white-space:pre-wrap}
.bubble .task-tag{display:inline-block;font-size:9px;padding:2px 8px;border-radius:3px;background:rgba(255,255,255,0.05);color:#888;margin-bottom:4px}
.status{position:fixed;bottom:16px;right:24px;font-size:9px;color:#444;display:flex;align-items:center;gap:6px}
.status .live{width:6px;height:6px;border-radius:50%;background:#4ade80;animation:pulse 1.5s infinite}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
</style>
</head>
<body>
<div class="header">
  <div class="dot green"></div>
  <div><h1>Claude ↔ ClawX 协作台</h1><span>bridge://localhost:9724</span></div>
</div>
<div class="msgs" id="msgs"></div>
<div class="status"><div class="live"></div> 实时</div>
<script>
const msgs = document.getElementById("msgs")
let lastLen = 0
async function poll(){
  try{
    const r = await fetch("/chatlog")
    const log = await r.json()
    if(log.length === lastLen) return
    lastLen = log.length
    msgs.innerHTML = ""
    log.forEach(m=>{
      const who = m.from === "Claude" ? "claude" : m.from === "ClawX" ? "clawx" : "system"
      const avatar = who==="claude"?"C":who==="clawx"?"X":"⚡"
      const task = m.task ? \`<div class="task-tag">📋 \${m.task}</div>\` : ""
      msgs.innerHTML += \`
        <div class="msg \${who}">
          <div class="avatar">\${avatar}</div>
          <div class="bubble">
            <div class="meta"><span class="who">\${m.from}</span><span>\${new Date(m.time).toLocaleTimeString("zh-CN")}</span></div>
            \${task}<div class="body">\${m.message||m.result||""}</div>
          </div>
        </div>\`
    })
    msgs.scrollTop = msgs.scrollHeight
  }catch(e){}
}
poll()
setInterval(poll, 1000)
</script>
</body></html>`
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" })
    res.end(chatHtml)
    return
  }

  // ========== 聊天日志 API ==========
  if (req.method === "GET" && req.url === "/chatlog") {
    const log = JSON.parse(fs.readFileSync(CHATLOG, "utf8"))
    res.writeHead(200, { "Content-Type": "application/json" })
    res.end(JSON.stringify(log))
    return
  }

  // Claude 发消息给 ClawX
  if (req.method === "POST" && req.url === "/send") {
    let body = ""
    req.on("data", chunk => { body += chunk })
    req.on("end", () => {
      try {
        const msg = JSON.parse(body)
        const inbox = JSON.parse(fs.readFileSync(INBOX, "utf8"))
        inbox.messages.push({ ...msg, time: new Date().toISOString() })
        fs.writeFileSync(INBOX, JSON.stringify(inbox, null, 2))
        appendChat({ from: "Claude", task: msg.task, message: msg.message })
        res.writeHead(200, { "Content-Type": "application/json" })
        res.end(JSON.stringify({ ok: true }))
      } catch (e) { res.writeHead(400); res.end(JSON.stringify({ error: e.message })) }
    })
    return
  }

  // ClawX 回复
  if (req.method === "POST" && req.url === "/reply") {
    let body = ""
    req.on("data", chunk => { body += chunk })
    req.on("end", () => {
      try {
        const msg = JSON.parse(body)
        const outbox = JSON.parse(fs.readFileSync(OUTBOX, "utf8"))
        outbox.messages.push({ ...msg, time: new Date().toISOString() })
        fs.writeFileSync(OUTBOX, JSON.stringify(outbox, null, 2))
        appendChat({ from: "ClawX", task: msg.task || msg.id, message: msg.result?.message || JSON.stringify(msg.result || msg.status || "done") })
        if (msg.acked) {
          const inbox = JSON.parse(fs.readFileSync(INBOX, "utf8"))
          inbox.messages = inbox.messages.filter(m => m.id !== msg.acked)
          fs.writeFileSync(INBOX, JSON.stringify(inbox, null, 2))
        }
        res.writeHead(200, { "Content-Type": "application/json" })
        res.end(JSON.stringify({ ok: true }))
      } catch (e) { res.writeHead(400); res.end(JSON.stringify({ error: e.message })) }
    })
    return
  }

  // Claude 读取 ClawX 回复
  if (req.method === "GET" && req.url === "/read") {
    const outbox = JSON.parse(fs.readFileSync(OUTBOX, "utf8"))
    res.writeHead(200, { "Content-Type": "application/json" })
    res.end(JSON.stringify(outbox))
    return
  }

  // ClawX 读取 Claude 消息
  if (req.method === "GET" && req.url === "/inbox") {
    const inbox = JSON.parse(fs.readFileSync(INBOX, "utf8"))
    res.writeHead(200, { "Content-Type": "application/json" })
    res.end(JSON.stringify(inbox))
    return
  }

  res.writeHead(404)
  res.end("not found")
})

const PORT = 9724
server.listen(PORT, () => {
  console.log(`Bridge v2 — http://localhost:${PORT}`)
  console.log(`聊天窗口 → http://localhost:${PORT}/chat`)
  console.log(`Claude → POST /send  |  ClawX → GET /inbox`)
  console.log(`ClawX  → POST /reply |  Claude → GET /read`)
})
