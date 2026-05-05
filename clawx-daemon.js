// ClawX 守护进程 — 自动执行 Claude 发来的命令
// ClawX 只需启动这个脚本，它会自动监听 inbox 并执行命令

const http = require("http")
const { exec } = require("child_process")
const crypto = require("crypto")
const fs = require("fs")
const path = require("path")

const BRIDGE = "http://localhost:9724"
let lastId = ""

function genKeyPair() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("ed25519", {
    publicKeyEncoding: { type: "spki", format: "der" },
    privateKeyEncoding: { type: "pkcs8", format: "der" }
  })
  // Encode to base64 (raw key for SSH)
  const pubDer = crypto.createPublicKey({ key: publicKey, format: "der", type: "spki" })
  const pubRaw = pubDer.export({ type: "spki", format: "der" })
  // Extract the raw 32-byte key from SPKI
  const rawPub = pubRaw.slice(pubRaw.length - 32)
  const pubB64 = rawPub.toString("base64")

  const privDer = crypto.createPrivateKey({ key: privateKey, format: "der", type: "pkcs8" })
  const privRaw = privDer.export({ type: "pkcs8", format: "der" })
  const privB64 = privRaw.toString("base64")

  const pubOpenSSH = `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAA${pubB64} xiaobaiai`
  const privOpenSSH = `-----BEGIN OPENSSH PRIVATE KEY-----\n${privB64.match(/.{1,70}/g).join("\n")}\n-----END OPENSSH PRIVATE KEY-----`

  return { pub: pubOpenSSH, priv: privOpenSSH }
}

function run(cmd) {
  return new Promise((resolve) => {
    exec(cmd, { cwd: "E:\\ai导航网站", timeout: 120000 }, (err, stdout, stderr) => {
      resolve({ ok: !err, output: stdout.trim() || stderr.trim() || "(no output)", error: err?.message })
    })
  })
}

async function doTask(msg) {
  console.log(`[DAEMON] 收到任务: ${msg.id} — ${msg.task}`)

  let result = "OK"

  // 特殊任务：生成SSH密钥
  if (msg.task === "keygen") {
    const keys = genKeyPair()
    const outDir = path.join("E:\\", "ai导航网站", ".ssh")
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })
    fs.writeFileSync(path.join(outDir, "xiaobaiai.pub"), keys.pub)
    fs.writeFileSync(path.join(outDir, "xiaobaiai"), keys.priv)
    result = "公钥:\n" + keys.pub + "\n\n私钥已保存到 E:\\ai导航网站\\.ssh\\xiaobaiai"
  } else {
    // 把 message 里的指令拆成逐行命令
    const lines = msg.message.split("\n").filter(l => l.trim())
    const cmds = []
    for (const line of lines) {
      const cmd = line.replace(/^\d+\.\s*/, "").trim()
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
    for (const cmd of cmds) {
      console.log(`[DAEMON] 执行: ${cmd}`)
      const r = await run(cmd)
      if (!r.ok) {
        result = `失败: ${cmd}\n${r.error}`
        break
      }
      result = r.output
    }
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
