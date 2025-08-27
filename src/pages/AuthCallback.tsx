// src/pages/AuthCallback.jsx or similar
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const AuthCallback = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the hash fragment from the URL
        const hashFragment = window.location.hash

        if (hashFragment) {
          // Supabase will automatically handle the session from the hash
          const { data, error } = await supabase.auth.getSession()
          
          if (error) {
            console.error('Auth callback error:', error)
            navigate('/login?error=auth_error')
            return
          }

          if (data.session) {
            // Success - redirect to dashboard or home
            navigate('/dashboard') // or wherever you want to redirect
          } else {
            navigate('/login')
          }
        } else {
          // No hash fragment, redirect to login
          navigate('/login')
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        navigate('/login?error=callback_error')
      }
    }

    handleAuthCallback()
  }, [navigate])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing sign in...</p>
      </div>
    </div>
  )
}

export default AuthCallback