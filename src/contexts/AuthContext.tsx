import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { analyticsService, EventName } from '../lib/analytics'
import { userProfileService } from '../lib/userProfileService'

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
        
        // Initialize user tokens in background without blocking auth
        if (session?.user) {
          initializeUserTokens(session.user.id).catch(err => {
            console.warn('Token initialization failed (non-blocking):', err)
          })
        }
      } catch (error) {
        console.error('Error getting session:', error)
        // Set user to null on error to allow app to continue
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      
      if (currentUser && _event === 'SIGNED_IN') {
        initializeUserServices(currentUser.id, currentUser.email).catch(err => {
          console.warn('Service initialization failed (non-blocking):', err)
        })
      }
      
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Background initialization functions that don't block auth
  const initializeUserTokens = async (userId: string) => {
    try {
      const { data: tokenData } = await supabase
        .from('user_tokens')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()
        
      if (!tokenData) {
        await supabase
          .from('user_tokens')
          .insert([{ 
            user_id: userId, 
            balance: 15 
          }])
      }
    } catch (error) {
      console.warn('Token initialization failed:', error)
      throw error
    }
  }

  const initializeUserServices = async (userId: string, email?: string) => {
    try {
      await initializeUserTokens(userId)

      await userProfileService.getOrCreateProfile(userId)

      await analyticsService.identify(userId, {
        email: email,
        $email: email,
      })

      await analyticsService.trackAuth(EventName.AUTH_LOGGED_IN)

      const { stripeService } = await import('../lib/stripe')
      await stripeService.getUserSubscription()
    } catch (error) {
      console.warn('Service initialization failed:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await analyticsService.trackAuth(EventName.AUTH_LOGGED_OUT)
      analyticsService.reset()
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  const value = {
    user,
    loading,
    signOut,
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading your account..." />
      </div>
    )
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}