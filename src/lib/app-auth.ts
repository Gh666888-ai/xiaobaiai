export const APP_AUTH_KEY = "xiaobaiai:auth:v1"

export type AppAuthSession = {
  access_token: string
  refresh_token?: string
  expires_at?: number
  token_type?: string
}

export type AppAuthStored = {
  user?: {
    id: string
    email: string
    name: string
    xp?: number
    contributionPoints?: number
    coCreatorApproved?: boolean
    coCreatorTrack?: "personal" | "team"
  }
  session: AppAuthSession
}

export function readAppAuth(): AppAuthStored | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(APP_AUTH_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.session?.access_token) return null
    return parsed
  } catch {
    return null
  }
}

export function writeAppAuth(auth: AppAuthStored) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(APP_AUTH_KEY, JSON.stringify(auth))
}

export function clearAppAuth() {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(APP_AUTH_KEY)
}
