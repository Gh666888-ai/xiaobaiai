"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { supabase } from "@/lib/supabase"

export interface AuthUser {
  userId: string
  email: string
  name: string
  xp: number
}

const AuthContext = createContext<{
  user: AuthUser|null
  loading: boolean
  refresh: ()=>Promise<void>
}>({user:null,loading:true,refresh:async()=>{}})

async function buildAuthUser(sessionUser: any): Promise<AuthUser> {
  let profile: any = null
  try {
    const { data } = await supabase.from("profiles").select("name,xp").eq("id", sessionUser.id).single()
    profile = data
  } catch {
    profile = null
  }
  return {
    userId: sessionUser.id,
    email: sessionUser.email || "",
    name: profile?.name || sessionUser.user_metadata?.name || sessionUser.email?.split("@")[0] || "用户",
    xp: Number(profile?.xp || 0),
  }
}

export function AuthProvider({children}:{children:ReactNode}){
  const [user,setUser] = useState<AuthUser|null>(null)
  const [loading,setLoading] = useState(true)

  const refresh = async () => {
    try{
      const {data:{session}} = await supabase.auth.getSession()
      if(session?.user){
        setUser(await buildAuthUser(session.user))
      }else{
        setUser(null)
      }
    }catch{
      setUser(null)
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    refresh()
    const {data:{subscription}} = supabase.auth.onAuthStateChange(async (_event,session)=>{
      if(session?.user){
        setUser(await buildAuthUser(session.user))
      }else{
        setUser(null)
      }
    })
    return ()=>{subscription.unsubscribe()}
  },[])

  return <AuthContext.Provider value={{user,loading,refresh}}>{children}</AuthContext.Provider>
}

export function useAuth(){return useContext(AuthContext)}
