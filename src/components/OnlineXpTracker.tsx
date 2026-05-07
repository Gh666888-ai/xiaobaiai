"use client"

import { useEffect, useRef } from "react"
import { useAuth } from "@/lib/AuthContext"
import { readAppAuth } from "@/lib/app-auth"

const ONLINE_XP_KEY = "xiaobaiai:online-xp:v1"
const HEARTBEAT_MS = 5 * 60 * 1000
const XP_PER_HEARTBEAT = 2
const DAILY_CAP = 60

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

function readDailyOnlineXP(userId: string) {
  if (typeof window === "undefined") return 0
  try {
    const raw = window.localStorage.getItem(`${ONLINE_XP_KEY}:${userId}:${todayKey()}`)
    return Number(raw || 0)
  } catch {
    return 0
  }
}

function writeDailyOnlineXP(userId: string, value: number) {
  window.localStorage.setItem(`${ONLINE_XP_KEY}:${userId}:${todayKey()}`, String(value))
}

export function OnlineXpTracker() {
  const { user, refresh } = useAuth()
  const busyRef = useRef(false)

  useEffect(() => {
    if (!user?.userId) return

    async function awardOnlineXP() {
      if (!user?.userId || busyRef.current || document.hidden) return
      const current = readDailyOnlineXP(user.userId)
      if (current >= DAILY_CAP) return
      const amount = Math.min(XP_PER_HEARTBEAT, DAILY_CAP - current)
      const token = readAppAuth()?.session?.access_token
      if (!token) return

      busyRef.current = true
      try {
        const res = await fetch("/api/growth/xp", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ amount, reason: "online", dailyCap: DAILY_CAP }),
        })
        if (res.ok) {
          writeDailyOnlineXP(user.userId, current + amount)
          await refresh().catch(() => undefined)
        }
      } finally {
        busyRef.current = false
      }
    }

    const timer = window.setInterval(awardOnlineXP, HEARTBEAT_MS)
    return () => window.clearInterval(timer)
  }, [user?.userId, refresh])

  return null
}
