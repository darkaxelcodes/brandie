import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { stripeService } from '../lib/stripe'
import { useToast } from './ToastContext'
import { useNavigate } from 'react-router-dom'

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
  // Remove showToast dependency to prevent circular issues

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        setLoading(true)
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
        
        // If we have a new user, ensure they have tokens
        if (session?.user) {
          try {
            // Check if user has tokens
            const { data: tokenData } = await supabase
              .from('user_tokens')
              .select('*')
              .eq('user_id', session.user.id)
              .maybeSingle();
              
            // If no tokens exist, create a record with default balance
            if (!tokenData) {
              await supabase
                .from('user_tokens')
                .insert([{ 
                  user_id: session.user.id, 
                  balance: 15 
                }]);
            }
          } catch (tokenError) {
            console.error('Error setting up user tokens:', tokenError);
            // Don't let token errors block authentication
          }
        }
      } catch (error) {
        console.error('Error getting session:', error)
        // Don't show error toast on initial load, just log it
        console.warn('Authentication check failed, user will need to sign in')
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
      
      // If we have a new user, ensure they have tokens
      if (currentUser && _event === 'SIGNED_IN') {
        try {
          // Check if user has tokens
          const { data: tokenData } = await supabase
            .from('user_tokens')
            .select('*')
            .eq('user_id', currentUser.id)
            .maybeSingle();
            
          // If no tokens exist, create a record with default balance
          if (!tokenData) {
            await supabase
              .from('user_tokens')
              .insert([{ 
                user_id: currentUser.id, 
                balance: 15 
              }]);
          }
        } catch (tokenError) {
          console.error('Error setting up user tokens:', tokenError);
          // Don't let token errors block authentication
        }
        
        // Initialize Stripe customer if needed
        try {
          await stripeService.getUserSubscription();
        } catch (stripeError) {
          console.error('Error initializing Stripe customer:', stripeError);
          // Don't let Stripe errors block authentication
        }
      }
      
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, []) // Remove showToast dependency

  const signOut = async () => {
    try {
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