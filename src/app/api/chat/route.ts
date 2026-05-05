// 手机聊天 API — 用户发消息、Claude回复都走这里
import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const CHAT_FILE = path.join(DATA_DIR, "chat-messages.json")
const REPLY_FILE = path.join(DATA_DIR, "chat-replies.json")

function readJSON(p: string) {
  try {
    if (!fs.existsSync(p)) return []
    return JSON.parse(fs.readFileSync(p, "utf8"))
  } catch { return [] }
}

function writeJSON(p: string, data: any) {
  if (!fs.existsSync(path.dirname(p))) fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, JSON.stringify(data, null, 2))
}

export async function GET(req: NextRequest) {
  const role = req.nextUrl.searchParams.get("role")
  const after = parseInt(req.nextUrl.searchParams.get("after") || "0")
  const msgs = role === "claude" ? readJSON(REPLY_FILE) : readJSON(CHAT_FILE)
  const filtered = after ? msgs.filter((m: any) => m.time > after) : msgs
  return NextResponse.json(filtered.length > 20 ? filtered.slice(-20) : filtered)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { role, message, name } = body
  if (!message) return NextResponse.json({ error: "empty message" }, { status: 400 })

  if (role === "user") {
    const msgs = readJSON(CHAT_FILE)
    msgs.push({ role: "user", name: name || "我", message, time: Date.now() })
    writeJSON(CHAT_FILE, msgs)
    return NextResponse.json({ ok: true })
  }

  if (role === "claude") {
    const msgs = readJSON(REPLY_FILE)
    msgs.push({ role: "claude", name: "Claude", message, time: Date.now() })
    writeJSON(REPLY_FILE, msgs)
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: "bad role" }, { status: 400 })
}
