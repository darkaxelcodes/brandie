import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { useToast } from '../contexts/ToastContext'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create a single instance of the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Add error handling and retry logic
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // ms

// Utility function to add retry logic - now exported
export const withRetry = async <T>(
  fn: () => Promise<T>,
  retries = MAX_RETRIES,
  delay = RETRY_DELAY
): Promise<T> => {
  try {
    return await fn()
  } catch (error) {
    if (retries <= 0) throw error
    
    console.warn(`Operation failed, retrying... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`)
    await new Promise(resolve => setTimeout(resolve, delay))
    return withRetry(fn, retries - 1, delay * 1.5) // Exponential backoff
  }
}

// Auth helper functions with retry logic
export const signUp = async (email: string, password: string) => {
  return withRetry(async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  })
}

export const signIn = async (email: string, password: string) => {
  return withRetry(async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  })
}

export const signInWithGoogle = async () => {
  return withRetry(async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    })
    return { data, error }
  })
}

export const signOut = async () => {
  return withRetry(async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  })
}

export const getCurrentUser = async () => {
  return withRetry(async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  })
}

// Try to parse a JSON string safely
export const safeJsonParse = <T>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json) as T
  } catch (error) {
    console.warn('JSON parse failed:', error)
    return fallback
  }
}

// Safely access nested object properties
export const safeGet = <T>(
  obj: any,
  path: string,
  fallback: T
): T => {
  try {
    const keys = path.split('.')
    let result = obj
    
    for (const key of keys) {
      if (result === undefined || result === null) {
        return fallback
      }
      result = result[key]
    }
    
    return (result === undefined || result === null) ? fallback : result as T
  } catch (error) {
    console.warn('Safe get failed:', error)
    return fallback
  }
}

// Create a hook to get a Supabase client with error handling
export const useSupabase = () => {
  const { showToast } = useToast()
  
  const handleError = (error: any) => {
    console.error('Supabase error:', error)
    showToast('error', error.message || 'An error occurred')
  }
  
  return {
    supabase,
    handleError
  }
}