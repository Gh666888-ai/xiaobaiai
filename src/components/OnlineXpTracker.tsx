"use client"

import { useEffect, useRef } from "react"
import { useAuth } from "@/lib/AuthContext"
import { readAppAuth } from "@/lib/app-auth"
import { DAILY_ONLINE_XP_CAP } from "@/data/growth"

const ONLINE_XP_KEY = "xiaobaiai:online-xp:v1"
const HEARTBEAT_MS = 5 * 60 * 1000

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
      if (current >= DAILY_ONLINE_XP_CAP) return
      const token = readAppAuth()?.session?.access_token
      if (!token) return

      busyRef.current = true
      try {
        const res = await fetch("/api/growth/xp", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ reason: "online" }),
        })
        if (res.ok) {
          const data = await res.json().catch(() => ({}))
          const awarded = Number(data.awarded || 0)
          if (awarded > 0) {
            writeDailyOnlineXP(user.userId, Math.min(DAILY_ONLINE_XP_CAP, current + awarded))
            await refresh().catch(() => undefined)
          } else if (data.capped) {
            writeDailyOnlineXP(user.userId, DAILY_ONLINE_XP_CAP)
          }
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
