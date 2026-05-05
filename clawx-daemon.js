// ClawX 守护进程 — 自动执行 Claude 发来的命令
// ClawX 只需启动这个脚本，它会自动监听 inbox 并执行命令

const http = require("http")
const { exec } = require("child_process")

const BRIDGE = "http://localhost:9724"
let lastId = ""

function run(cmd) {
  return new Promise((resolve) => {
    exec(cmd, { cwd: "E:\\ai导航网站", timeout: 120000 }, (err, stdout, stderr) => {
      resolve({ ok: !err, output: stdout.trim() || stderr.trim() || "(no output)", error: err?.message })
    })
  })
}

async function doTask(msg) {
  console.log(`[DAEMON] 收到任务: ${msg.id} — ${msg.task}`)

  // 把 message 里的指令拆成逐行命令
  const lines = msg.message.split("\n").filter(l => l.trim())

  // 找到所有需要执行的命令（以数字序号或直接是命令开头）
  const cmds = []
  for (const line of lines) {
    const cmd = line.replace(/^\d+\.\s*/, "").trim()  // 去掉序号
    if (cmd && !cmd.startsWith("POST结果") && !cmd.startsWith("完成后")) {
      if (cmd.startsWith("cd ") || cmd.startsWith("git ") || cmd.startsWith("ssh ") ||
          cmd.startsWith("npm ") || cmd.startsWith("node ") || cmd.startsWith("whoami") ||
          cmd.startsWith("dir ") || cmd.startsWith("type ") || cmd.startsWith("echo ") ||
          cmd.startsWith("pm2 ") || cmd.startsWith("mkdir ") || cmd.startsWith("copy ") ||
          cmd.startsWith("move ") || cmd.startsWith("del ") || cmd.startsWith("python ") ||
          cmd.startsWith("pip ") || cmd.startsWith("curl ") || cmd.startsWith("wget ")) {
        cmds.push(cmd)
      }
    }
  }

  let result = "OK"
  for (const cmd of cmds) {
    console.log(`[DAEMON] 执行: ${cmd}`)
    const r = await run(cmd)
    if (!r.ok) {
      result = `失败: ${cmd}\n${r.error}`
      break
    }
    result = r.output
  }

  // 回复
  const body = JSON.stringify({
    id: msg.id,
    acked: msg.id,
    status: result.startsWith("失败") ? "error" : "done",
    result: { task: msg.task, output: result }
  })

  http.request(`${BRIDGE}/reply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" }
  }, res => {
    res.on("data", () => {})
    res.on("end", () => console.log("[DAEMON] 已回复"))
  }).end(body)
}

// 轮询
async function poll() {
  try {
    http.get(`${BRIDGE}/inbox`, res => {
      let data = ""
      res.on("data", c => data += c)
      res.on("end", async () => {
        try {
          const inbox = JSON.parse(data)
          const msgs = inbox.messages || []
          // 只处理 id 不同的新消息
          for (const msg of msgs) {
            if (msg.id !== lastId) {
              await doTask(msg)
              lastId = msg.id
            }
          }
        } catch (e) { console.error("[DAEMON] 解析失败:", e.message) }
        setTimeout(poll, 5000)
      })
    }).on("error", e => {
      console.error("[DAEMON] 连接失败:", e.message)
      setTimeout(poll, 5000)
    })
  } catch (e) { setTimeout(poll, 5000) }
}

console.log("[DAEMON] Claude-ClawX 守护进程已启动")
console.log("[DAEMON] 监听 " + BRIDGE + "/inbox")
poll()
