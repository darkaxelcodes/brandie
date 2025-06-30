import { supabase, withRetry } from './supabase'

export interface UserPreferences {
  id?: string
  user_id?: string
  theme: 'light' | 'dark' | 'system'
  keyboard_shortcuts_enabled: boolean
  reduced_motion: boolean
  created_at?: string
  updated_at?: string
}

export const userPreferencesService = {
  // Get user preferences
  async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    return withRetry(async () => {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()

      if (error) throw error
      return data
    })
  },

  // Create default preferences
  async createDefaultPreferences(userId: string): Promise<UserPreferences> {
    return withRetry(async () => {
      const defaultPreferences = {
        user_id: userId,
        theme: 'light',
        keyboard_shortcuts_enabled: true,
        reduced_motion: false
      }

      const { data, error } = await supabase
        .from('user_preferences')
        .insert([defaultPreferences])
        .select()
        .single()

      if (error) throw error
      return data
    })
  },

  // Update user preferences
  async updateUserPreferences(userId: string, preferences: Partial<UserPreferences>): Promise<UserPreferences> {
    return withRetry(async () => {
      const { data, error } = await supabase
        .from('user_preferences')
        .update(preferences)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error
      return data
    })
  },

  // Get or create user preferences
  async getOrCreatePreferences(userId: string): Promise<UserPreferences> {
    const existing = await this.getUserPreferences(userId)
    
    if (existing) {
      return existing
    }
    
    return this.createDefaultPreferences(userId)
  },

  // Apply preferences to the UI
  applyPreferences(preferences: UserPreferences): void {
    // Apply theme
    if (preferences.theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else if (preferences.theme === 'light') {
      document.documentElement.classList.remove('dark')
    } else {
      // System preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (prefersDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
    
    // Apply reduced motion
    if (preferences.reduced_motion) {
      document.documentElement.classList.add('reduce-motion')
    } else {
      document.documentElement.classList.remove('reduce-motion')
    }
    
    // Store in localStorage for persistence
    localStorage.setItem('userPreferences', JSON.stringify(preferences))
  }
}