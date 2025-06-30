import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from './AuthContext'
import { userPreferencesService, UserPreferences } from '../lib/userPreferencesService'
import { useToast } from './ToastContext'

interface PreferencesContextType {
  preferences: UserPreferences
  updatePreferences: (newPreferences: Partial<UserPreferences>) => Promise<void>
  loading: boolean
}

const defaultPreferences: UserPreferences = {
  theme: 'light',
  keyboard_shortcuts_enabled: true,
  reduced_motion: false
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined)

export const usePreferences = () => {
  const context = useContext(PreferencesContext)
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider')
  }
  return context
}

interface PreferencesProviderProps {
  children: ReactNode
}

export const PreferencesProvider: React.FC<PreferencesProviderProps> = ({ children }) => {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load preferences from localStorage first for immediate UI update
    const storedPrefs = localStorage.getItem('userPreferences')
    if (storedPrefs) {
      try {
        const parsedPrefs = JSON.parse(storedPrefs)
        setPreferences(parsedPrefs)
        userPreferencesService.applyPreferences(parsedPrefs)
      } catch (error) {
        console.error('Error parsing stored preferences:', error)
      }
    }

    // Then load from database if user is logged in
    if (user) {
      loadPreferences()
    } else {
      setLoading(false)
    }
  }, [user])

  const loadPreferences = async () => {
    if (!user) return

    try {
      setLoading(true)
      const prefs = await userPreferencesService.getOrCreatePreferences(user.id)
      setPreferences(prefs)
      userPreferencesService.applyPreferences(prefs)
    } catch (error) {
      console.error('Error loading preferences:', error)
      showToast('error', 'Failed to load preferences')
    } finally {
      setLoading(false)
    }
  }

  const updatePreferences = async (newPreferences: Partial<UserPreferences>) => {
    if (!user) return

    try {
      const updatedPrefs = { ...preferences, ...newPreferences }
      setPreferences(updatedPrefs)
      userPreferencesService.applyPreferences(updatedPrefs)
      
      await userPreferencesService.updateUserPreferences(user.id, newPreferences)
      showToast('success', 'Preferences updated successfully')
    } catch (error) {
      console.error('Error updating preferences:', error)
      showToast('error', 'Failed to update preferences')
      
      // Revert to previous preferences on error
      await loadPreferences()
    }
  }

  return (
    <PreferencesContext.Provider value={{ preferences, updatePreferences, loading }}>
      {children}
    </PreferencesContext.Provider>
  )
}