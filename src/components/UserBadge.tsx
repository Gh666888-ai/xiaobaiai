"use client"

import { useState, useEffect } from "react"
import { getCurrentUser, getUserLevel } from "@/data/user"

export function UserBadge() {
  const [user, setUser] = useState<ReturnType<typeof getCurrentUser>>(null)

  useEffect(() => {
    setUser(getCurrentUser())
    const handler = () => setUser(getCurrentUser())
    window.addEventListener("storage", handler)
    window.addEventListener("focus", handler)
    return () => {
      window.removeEventListener("storage", handler)
      window.removeEventListener("focus", handler)
    }
  }, [])

  if (!user) {
    return (
      <a href="/login" className="btn-outline h-8 text-xs px-3 no-underline whitespace-nowrap">
        登录
      </a>
    )
  }

  const level = getUserLevel(user.xp)

  return (
    <a href="/login" className="flex items-center gap-1.5 no-underline px-2 py-1 rounded-lg hover:bg-gray-50 transition-colors">
      <span title={`${level.name} · ${user.xp} XP`}>{level.badge}</span>
      <span className="text-xs font-medium text-gray-700 hidden sm:inline">{user.name}</span>
    </a>
  )
}
