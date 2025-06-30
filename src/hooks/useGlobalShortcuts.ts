import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useKeyboardShortcut } from './useKeyboardShortcut'
import { usePreferences } from '../contexts/PreferencesContext'

export const useGlobalShortcuts = () => {
  const navigate = useNavigate()
  const { preferences } = usePreferences()
  const enabled = preferences.keyboard_shortcuts_enabled
  
  // Navigation shortcuts
  useKeyboardShortcut('d', () => {
    navigate('/dashboard')
  }, { 
    ctrlKey: !navigator.platform.includes('Mac'), 
    metaKey: navigator.platform.includes('Mac'),
    enabled
  })
  
  useKeyboardShortcut('p', () => {
    navigate('/preferences')
  }, { 
    ctrlKey: !navigator.platform.includes('Mac'), 
    metaKey: navigator.platform.includes('Mac'),
    enabled
  })
  
  // Create new brand shortcut
  useKeyboardShortcut('n', () => {
    // This would need to trigger the new brand modal
    // For now, we'll just navigate to dashboard
    navigate('/dashboard')
  }, { 
    ctrlKey: !navigator.platform.includes('Mac'), 
    metaKey: navigator.platform.includes('Mac'),
    enabled
  })
  
  // Add more global shortcuts here
  
  // Handle Escape key for closing modals/panels
  useEffect(() => {
    if (!enabled) return
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Close any open modals or panels
        // This is handled in the individual components
      }
    }
    
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [enabled])
  
  return null
}