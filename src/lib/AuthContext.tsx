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

export function AuthProvider({children}:{children:ReactNode}){
  const [user,setUser] = useState<AuthUser|null>(null)
  const [loading,setLoading] = useState(true)

  const refresh = async () => {
    try{
      const {data:{session}} = await supabase.auth.getSession()
      if(session?.user){
        setUser({
          userId: session.user.id,
          email: session.user.email || "",
          name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || "用户",
          xp: 0
        })
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
    const {data:{subscription}} = supabase.auth.onAuthStateChange((_event,session)=>{
      if(session?.user){
        setUser({
          userId: session.user.id,
          email: session.user.email||"",
          name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || "用户",
          xp:0
        })
      }else{
        setUser(null)
      }
    })
    return ()=>{subscription.unsubscribe()}
  },[])

  return <AuthContext.Provider value={{user,loading,refresh}}>{children}</AuthContext.Provider>
}

export function useAuth(){return useContext(AuthContext)}
