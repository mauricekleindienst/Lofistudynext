import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getSupabaseBrowserClient } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()
  useEffect(() => {
    let isMounted = true

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting initial session:', error)
        }
        
        if (isMounted) {
          setSession(session)
          setUser(session?.user ?? null)
          setLoading(false)
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error)
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session)
        
        if (isMounted) {
          setSession(session)
          setUser(session?.user ?? null)
          setLoading(false)

          if (event === 'SIGNED_IN' && session?.user) {
            // Ensure user profile exists in database
            await ensureUserProfile(session.user)
          } else if (event === 'SIGNED_OUT') {
            // Clear local state when signed out
            setUser(null)
            setSession(null)
            console.log('User signed out, clearing state')
          }
        }
      }
    )

    return () => {
      isMounted = false
      subscription?.unsubscribe()
    }
  }, [supabase])

  const ensureUserProfile = async (user) => {
    try {
      // Check if user_pomodoros record exists
      const { data: existingProfile } = await supabase
        .from('user_pomodoros')
        .select('email')
        .eq('email', user.email)
        .single()

      if (!existingProfile) {
        // Create user_pomodoros record
        await supabase
          .from('user_pomodoros')
          .insert({
            email: user.email,
            firstname: user.user_metadata?.full_name || user.email.split('@')[0],
            user_id: user.id
          })
      }
    } catch (error) {
      console.error('Error ensuring user profile:', error)
    }
  }

  const signIn = async (email, password) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email, password, options = {}) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options
      })
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }
  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Google sign-in error:', error)
      return { data: null, error }
    }
  }
  const signInWithDiscord = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Discord sign-in error:', error)
      return { data: null, error }
    }
  }

  const signOut = async () => {
    try {
      console.log('Starting sign out process...')
      setLoading(true)
      
      // Call Supabase signOut
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Supabase signOut error:', error)
      }
      
      // Clear local state
      setUser(null)
      setSession(null)
      
      console.log('Sign out successful, redirecting to home page...')
      
      // Force redirect to home page and prevent any other redirects
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
    } catch (error) {
      console.error('Error signing out:', error)
      // Even if there's an error, clear state and redirect
      setUser(null)
      setSession(null)
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const updatePassword = async (password) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password
      })
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const updateProfile = async (updates) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: updates.data
      })
      if (error) throw error
      
      // Update the local user state
      setUser(data.user)
      
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    signInWithDiscord,
    resetPassword,
    updatePassword,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
