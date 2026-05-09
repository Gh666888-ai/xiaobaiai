"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { clearAppAuth, readAppAuth, writeAppAuth } from "@/lib/app-auth"

export interface AuthUser {
  userId: string
  email: string
  name: string
  xp: number
  contributionPoints?: number
  coCreatorApproved?: boolean
  coCreatorTrack?: "personal" | "team"
}

type CoCreatorTrack = "personal" | "team"

const AuthContext = createContext<{
  user: AuthUser|null
  loading: boolean
  refresh: ()=>Promise<void>
  setSession: (auth: any)=>Promise<void>
  logout: ()=>Promise<void>
}>({user:null,loading:true,refresh:async()=>{},setSession:async()=>{},logout:async()=>{}})

export function AuthProvider({children}:{children:ReactNode}){
  const [user,setUser] = useState<AuthUser|null>(null)
  const [loading,setLoading] = useState(true)

  const refresh = async () => {
    try{
      const auth = readAppAuth()
      if (!auth?.session?.access_token) {
        setUser(null)
        return
      }
      const res = await fetch("/api/auth", {
        headers: { Authorization: `Bearer ${auth.session.access_token}` },
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data?.user) {
        clearAppAuth()
        setUser(null)
        return
      }
      const coCreatorTrack: CoCreatorTrack = data.user.coCreatorTrack === "team" || auth.user?.coCreatorTrack === "team" ? "team" : "personal"
      const nextUser: AuthUser = {
        userId: data.user.id,
        email: data.user.email || auth.user?.email || "",
        name: data.user.name || auth.user?.name || "用户",
        xp: Number(data.user.xp || auth.user?.xp || 0),
        contributionPoints: Number(data.user.contributionPoints || auth.user?.contributionPoints || 0),
        coCreatorApproved: Boolean(data.user.coCreatorApproved || auth.user?.coCreatorApproved),
        coCreatorTrack,
      }
      setUser(nextUser)
      writeAppAuth({ ...auth, user: { id: nextUser.userId, email: nextUser.email, name: nextUser.name, xp: nextUser.xp, contributionPoints: nextUser.contributionPoints, coCreatorApproved: nextUser.coCreatorApproved, coCreatorTrack: nextUser.coCreatorTrack } })
    }catch{
      setUser(null)
    }finally{
      setLoading(false)
    }
  }

  const setSession = async (auth: any) => {
    writeAppAuth(auth)
    setUser({
      userId: auth.user?.id || "",
      email: auth.user?.email || "",
      name: auth.user?.name || auth.user?.email?.split("@")[0] || "用户",
      xp: Number(auth.user?.xp || 0),
      contributionPoints: Number(auth.user?.contributionPoints || 0),
      coCreatorApproved: Boolean(auth.user?.coCreatorApproved),
      coCreatorTrack: auth.user?.coCreatorTrack === "team" ? "team" : "personal",
    })
    await refresh().catch(() => undefined)
  }

  const logout = async () => {
    clearAppAuth()
    setUser(null)
  }

  useEffect(()=>{
    refresh()
  },[])

  return <AuthContext.Provider value={{user,loading,refresh,setSession,logout}}>{children}</AuthContext.Provider>
}

export function useAuth(){return useContext(AuthContext)}
