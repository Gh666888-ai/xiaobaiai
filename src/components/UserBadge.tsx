"use client"

import { useState, useEffect } from "react"
import { getCurrentUser, getNextLevel, getUserLevel, User } from "@/data/user"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export function UserBadge() {
  const [user, setUser] = useState<User|null>(null)

  useEffect(() => {
    getCurrentUser().then(setUser)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async () => {
      const u = await getCurrentUser()
      setUser(u)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (!user) {
    return (
      <Link href="/login" className="btn-outline h-8 text-xs px-3 no-underline whitespace-nowrap">
        登录
      </Link>
    )
  }

  const level = getUserLevel(user.xp)
  const next = getNextLevel(user.xp)
  const xpLabel = next ? `${user.xp} XP` : "已达最高档"

  return (
    <Link href="/login" className="flex items-center gap-1.5 no-underline px-2 py-1 rounded-lg hover:bg-gray-50 transition-colors">
      <span title={`${level.name} · ${xpLabel}`}>{level.badge}</span>
      <span className="text-xs font-medium text-gray-700 hidden sm:inline">{user.name}</span>
    </Link>
  )
}
