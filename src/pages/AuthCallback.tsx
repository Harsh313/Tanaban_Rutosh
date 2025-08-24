import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const AuthCallback: React.FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the OAuth callback
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          navigate('/login?error=auth_failed')
          return
        }

        if (data.session) {
          // Check if user has a profile, create one if not (for Google sign-in)
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.session.user.id)
            .single()

          if (!profile) {
            // Create profile for Google sign-in users
            const profileData = {
              id: data.session.user.id,
              email: data.session.user.email!,
              full_name: data.session.user.user_metadata?.full_name || data.session.user.email?.split('@')[0] || '',
              username: (data.session.user.user_metadata?.full_name || data.session.user.email?.split('@')[0] || '').toLowerCase().replace(/\s+/g, ''),
              phone: '',
              date_of_birth: '',
              bio: '',
              address: null,
              preferences: {
                newsletter: true,
                sms_notifications: false,
                email_notifications: true
              },
              avatar_url: data.session.user.user_metadata?.avatar_url || ''
            }

            const { error: profileError } = await supabase.from('profiles').insert(profileData)
            if (profileError) {
              console.error('Profile creation error:', profileError)
            }
          }

          // Redirect to dashboard or home page
          navigate('/') // or wherever you want to redirect after successful login
        } else {
          navigate('/login')
        }
      } catch (error) {
        console.error('Callback handling error:', error)
        navigate('/login?error=callback_failed')
      }
    }

    handleAuthCallback()
  }, [navigate])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing sign in...</p>
      </div>
    </div>
  )
}

export default AuthCallback