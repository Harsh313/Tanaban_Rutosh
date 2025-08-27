import React, { createContext, useContext, useEffect, useState } from "react"
import { User, Session } from "@supabase/supabase-js"
import { supabase } from "../lib/supabase"

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<any>
  signUp: (email: string, password: string, fullName: string) => Promise<any>
  signInWithGoogle: () => Promise<any>
  signOut: () => Promise<any>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // ✅ Just get current session (AuthCallback already exchanges the code)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)

      // Profile creation logic (kept as is)
      if (event === "SIGNED_IN" && session?.user) {
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", session.user.id)
          .single()

        if (!existingProfile) {
          const fullName =
            session.user.user_metadata?.full_name ||
            session.user.user_metadata?.name ||
            session.user.email?.split("@")[0] ||
            "User"

          const profileData = {
            id: session.user.id,
            email: session.user.email!,
            full_name: fullName,
            username: fullName.toLowerCase().replace(/\s+/g, ""),
            phone: "",
            date_of_birth: "",
            bio: "",
            address: null,
            preferences: {
              newsletter: true,
              sms_notifications: false,
              email_notifications: true,
            },
            avatar_url: session.user.user_metadata?.avatar_url || "",
          }

          const { error: profileError } = await supabase
            .from("profiles")
            .insert(profileData)

          if (profileError) {
            console.error("Profile creation error:", profileError)
          }
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password })
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })

    if (!error && data.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        email: data.user.email!,
        full_name: fullName,
        username: fullName.toLowerCase().replace(/\s+/g, ""),
        phone: "",
        date_of_birth: "",
        bio: "",
        address: null,
        preferences: {
          newsletter: true,
          sms_notifications: false,
          email_notifications: true,
        },
        avatar_url: "",
      })
    }

    return { data, error }
  }

  const signInWithGoogle = async () => {
    const redirectUrl = import.meta.env.DEV
      ? "http://localhost:5173/auth/callback"
      : `${window.location.origin}/auth/callback`

    return await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirectUrl },
    })
  }

  const signOut = async () => await supabase.auth.signOut()

  return (
    <AuthContext.Provider
      value={{ user, session, loading, signIn, signUp, signInWithGoogle, signOut }}
    >
      {children}
    </AuthContext.Provider>
  )
}
