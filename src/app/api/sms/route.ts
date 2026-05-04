import { NextRequest, NextResponse } from "next/server"

// IP 限流存储
const rateLimit = new Map<string, { count: number; resetAt: number }>()
const codes = new Map<string, { code: string; expiresAt: number }>()

// 限制：每 IP 每分钟最多 1 条，每小时最多 5 条
function checkRateLimit(ip: string): string | null {
  const now = Date.now()
  const entry = rateLimit.get(ip)

  if (!entry || now > entry.resetAt + 3600000) {
    rateLimit.set(ip, { count: 1, resetAt: now })
    return null
  }

  // 1 分钟内限制
  if (now - entry.resetAt < 60000 && entry.count >= 1) {
    return "发送太频繁，请 1 分钟后再试"
  }

  // 每小时限制
  if (entry.count >= 5) {
    return "超过每小时发送上限，请稍后再试"
  }

  entry.count++
  return null
}

function getIP(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || req.headers.get("x-real-ip")
    || "127.0.0.1"
}

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json()
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      return NextResponse.json({ error: "请输入正确的手机号" }, { status: 400 })
    }

    const ip = getIP(req)
    const limitError = checkRateLimit(ip)
    if (limitError) {
      return NextResponse.json({ error: limitError }, { status: 429 })
    }

    // 生成验证码
    const code = String(Math.floor(100000 + Math.random() * 900000))
    codes.set(phone, { code, expiresAt: Date.now() + 300000 }) // 5 分钟过期

    // TODO: 阿里云短信审核通过后替换这里
    // await sendAliyunSMS(phone, code)
    console.log(`📱 SMS to ${phone}: ${code}`)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "发送失败" }, { status: 500 })
  }
}

// 验证验证码
export async function PUT(req: NextRequest) {
  const { phone, code } = await req.json()
  if (!phone || !code) {
    return NextResponse.json({ error: "参数缺失" }, { status: 400 })
  }

  const entry = codes.get(phone)
  if (!entry || Date.now() > entry.expiresAt) {
    return NextResponse.json({ error: "验证码已过期" }, { status: 400 })
  }

  if (entry.code !== code) {
    return NextResponse.json({ error: "验证码错误" }, { status: 400 })
  }

  codes.delete(phone)
  return NextResponse.json({ success: true })
}
