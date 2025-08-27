import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

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
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const result = await supabase.auth.signInWithPassword({ email, password })
      if (result.error) console.error('Sign in error:', result.error)
      return result
    } catch (error) {
      console.error('Sign in exception:', error)
      throw error
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName }
        }
      })

      if (error) return { data, error }

      if (data.user) {
        const profileData = {
          id: data.user.id,
          email: data.user.email!,
          full_name: fullName,
          username: fullName.toLowerCase().replace(/\s+/g, ''),
          phone: '',
          date_of_birth: '',
          bio: '',
          address: null,
          preferences: {
            newsletter: true,
            sms_notifications: false,
            email_notifications: true
          },
          avatar_url: ''
        }

        const { error: profileError } = await supabase.from('profiles').insert(profileData)
        if (profileError) {
          console.error('Profile creation error:', profileError)
          return { data, error: profileError }
        }
      }

      return { data, error }
    } catch (error) {
      console.error('Sign up exception:', error)
      throw error
    }
  }

  const signInWithGoogle = async () => {
  try {
    const redirectUrl =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : window.location.origin

    return await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirectUrl }
    })
  } catch (error) {
    console.error("Google sign in error:", error)
    throw error
  }
}

  const signOut = async () => {
    try {
      return await supabase.auth.signOut()
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
