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
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Error getting session:', error)
      }
      
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email)
      
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)

      // Handle profile creation for new users
      if (event === "SIGNED_IN" && session?.user) {
        await createUserProfile(session.user)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const createUserProfile = async (user: User) => {
    try {
      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single()

      if (!existingProfile) {
        const fullName =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split("@")[0] ||
          "User"

        const profileData = {
          id: user.id,
          email: user.email!,
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
          avatar_url: user.user_metadata?.avatar_url || "",
        }

        const { error: profileError } = await supabase
          .from("profiles")
          .insert(profileData)

        if (profileError) {
          console.error("Profile creation error:", profileError)
        } else {
          console.log("Profile created successfully")
        }
      }
    } catch (error) {
      console.error("Error in createUserProfile:", error)
    }
  }

  const signIn = async (email: string, password: string) => {
    const result = await supabase.auth.signInWithPassword({ email, password })
    return result
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { 
        data: { full_name: fullName },
        // Add email confirmation redirect if needed
        emailRedirectTo: `${window.location.origin}/auth/callback`
      },
    })

    // Note: Profile creation will be handled by the auth state change listener
    // when the user confirms their email and signs in

    return { data, error }
  }

  const signInWithGoogle = async () => {
    const redirectUrl = import.meta.env.DEV
      ? "http://localhost:5173/auth/callback"
      : `${window.location.origin}/auth/callback`

    console.log('OAuth redirect URL:', redirectUrl)

    const result = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { 
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      },
    })

    return result
  }

  const signOut = async () => {
    const result = await supabase.auth.signOut()
    return result
  }

  return (
    <AuthContext.Provider
      value={{ user, session, loading, signIn, signUp, signInWithGoogle, signOut }}
    >
      {children}
    </AuthContext.Provider>
  )
}
