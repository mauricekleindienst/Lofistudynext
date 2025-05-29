import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getSupabaseBrowserClient } from '../../lib/supabase'

export default function AuthCallback() {
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()
  const [error, setError] = useState(null)
  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check if there's a code in the URL
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get('code')
        
        if (!code) {
          console.log('No auth code found, redirecting to signin...')
          router.replace('/auth/signin')
          return
        }

        console.log('Processing auth callback with code:', code)

        // Get the session after OAuth redirect
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          setError(error.message)
          setTimeout(() => {
            router.replace('/auth/signin?error=auth-callback-error')
          }, 2000)
          return
        }

        if (data.session) {
          console.log('Auth successful, session found:', data.session.user.email)
          // Small delay to ensure AuthContext picks up the session
          setTimeout(() => {
            router.replace('/app')
          }, 500)
        } else {
          console.log('No session found after callback, redirecting to signin...')
          router.replace('/auth/signin')
        }
      } catch (error) {
        console.error('Error in auth callback:', error)
        setError('Authentication failed')
        setTimeout(() => {
          router.replace('/auth/signin?error=callback-error')
        }, 2000)
      }
    }
    
    // Add a small delay to ensure the URL is fully loaded
    const timer = setTimeout(handleAuthCallback, 100)
    return () => clearTimeout(timer)
  }, [router, supabase])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">⚠️ Authentication Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Redirecting to sign in...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing sign in...</p>
      </div>
    </div>
  )
}
