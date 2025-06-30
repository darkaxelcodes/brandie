import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, Settings, Moon, Sun, Keyboard, Eye, 
  Save, Check, AlertCircle, RefreshCw, Coins, Plus, Minus
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { supabase } from '../lib/supabase'
import { TourButton } from '../components/ui/TourButton'
import { useTokens } from '../contexts/TokenContext'
import { tokenService, TokenTransaction } from '../lib/tokenService'

interface UserPreference {
  id?: string
  user_id?: string
  theme: 'light' | 'dark' | 'system'
  keyboard_shortcuts_enabled: boolean
  reduced_motion: boolean
  created_at?: string
  updated_at?: string
}

export const UserPreferences: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { tokenBalance, refreshTokenBalance } = useTokens()
  const [preferences, setPreferences] = useState<UserPreference>({
    theme: 'light',
    keyboard_shortcuts_enabled: true,
    reduced_motion: false
  })
  const [transactions, setTransactions] = useState<TokenTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadPreferences()
      loadTransactions()
    }
  }, [user])

  const loadPreferences = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle()
      
      if (error) throw error
      
      if (data) {
        setPreferences(data)
      } else {
        // Create default preferences if none exist
        const { data: newPrefs, error: createError } = await supabase
          .from('user_preferences')
          .insert([{
            user_id: user?.id,
            theme: 'light',
            keyboard_shortcuts_enabled: true,
            reduced_motion: false
          }])
          .select()
          .single()
        
        if (createError) throw createError
        if (newPrefs) setPreferences(newPrefs)
      }
    } catch (err: any) {
      console.error('Error loading preferences:', err)
      setError('Failed to load preferences. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const loadTransactions = async () => {
    if (!user) return;
    
    try {
      const history = await tokenService.getTransactionHistory(user.id);
      setTransactions(history.slice(0, 5)); // Just get the 5 most recent
    } catch (error) {
      console.error('Error loading token transactions:', error);
    }
  };

  const savePreferences = async () => {
    try {
      setSaving(true)
      setError(null)
      
      const { error } = await supabase
        .from('user_preferences')
        .update({
          theme: preferences.theme,
          keyboard_shortcuts_enabled: preferences.keyboard_shortcuts_enabled,
          reduced_motion: preferences.reduced_motion
        })
        .eq('user_id', user?.id)
      
      if (error) throw error
      
      showToast('success', 'Preferences saved successfully')
      
      // Apply preferences
      applyPreferences()
    } catch (err: any) {
      console.error('Error saving preferences:', err)
      setError('Failed to save preferences. Please try again.')
      showToast('error', 'Failed to save preferences')
    } finally {
      setSaving(false)
    }
  }

  const applyPreferences = () => {
    // Apply theme
    if (preferences.theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading preferences...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 preferences-header"
      >
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-4 flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Settings className="w-8 h-8 text-blue-600" />
              User Preferences
            </h1>
            <p className="text-gray-600 mt-1">
              Customize your Brandie experience
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <TourButton tourId="preferences" />
            <Button
              onClick={savePreferences}
              loading={saving}
              className="flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Preferences</span>
            </Button>
          </div>
        </div>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200 flex items-start space-x-3"
        >
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
          <div>
            <p className="text-red-800">{error}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={loadPreferences}
              className="mt-2 text-red-700"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Retry
            </Button>
          </div>
        </motion.div>
      )}

      {/* AI Tokens */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 bg-amber-100 rounded-lg">
              <Coins className="w-5 h-5 text-amber-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">AI Tokens</h2>
          </div>

          <div className="bg-amber-50 rounded-lg p-6 mb-6 border border-amber-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <div className="flex items-center justify-center w-12 h-12 bg-amber-100 rounded-xl">
                  <Coins className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-amber-800">Current Balance</p>
                  <h3 className="text-2xl font-bold text-gray-900">{tokenBalance} Tokens</h3>
                </div>
              </div>
              <Button
                className="bg-gradient-to-r from-amber-500 to-amber-600 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Buy More Tokens</span>
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900">Recent Token Activity</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/tokens')}
                className="text-blue-600"
              >
                View All
              </Button>
            </div>
            
            {transactions.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No recent token activity</p>
            ) : (
              <div className="space-y-2">
                {transactions.map((transaction) => (
                  <div 
                    key={transaction.id} 
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        transaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {transaction.amount > 0 ? (
                          <Plus className={`w-4 h-4 text-green-600`} />
                        ) : (
                          <Minus className={`w-4 h-4 text-red-600`} />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {transaction.action_type === 'purchase' ? 'Token Purchase' : transaction.action_type}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(transaction.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <span className={`font-medium ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                    </span>
                  </div>
                ))}
              </div>
            )}
            
            <Button
              variant="outline"
              onClick={() => navigate('/tokens')}
              className="w-full mt-2"
            >
              View Complete History
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Theme Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6 theme-settings"
      >
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
              {preferences.theme === 'dark' ? (
                <Moon className="w-5 h-5 text-blue-600" />
              ) : (
                <Sun className="w-5 h-5 text-blue-600" />
              )}
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Theme</h2>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => setPreferences({ ...preferences, theme: 'light' })}
              className={`
                p-4 rounded-lg border-2 transition-all flex flex-col items-center
                ${preferences.theme === 'light' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <Sun className="w-6 h-6 mb-2" />
              <span className="font-medium">Light</span>
            </button>
            
            <button
              onClick={() => setPreferences({ ...preferences, theme: 'dark' })}
              className={`
                p-4 rounded-lg border-2 transition-all flex flex-col items-center
                ${preferences.theme === 'dark' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <Moon className="w-6 h-6 mb-2" />
              <span className="font-medium">Dark</span>
            </button>
            
            <button
              onClick={() => setPreferences({ ...preferences, theme: 'system' })}
              className={`
                p-4 rounded-lg border-2 transition-all flex flex-col items-center
                ${preferences.theme === 'system' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <div className="flex space-x-1 mb-2">
                <Sun className="w-6 h-6" />
                <Moon className="w-6 h-6" />
              </div>
              <span className="font-medium">System</span>
            </button>
          </div>
        </Card>
      </motion.div>

      {/* Keyboard Shortcuts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg">
                <Keyboard className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Keyboard Shortcuts</h2>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Enabled</span>
              <button
                onClick={() => setPreferences({ 
                  ...preferences, 
                  keyboard_shortcuts_enabled: !preferences.keyboard_shortcuts_enabled 
                })}
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                  ${preferences.keyboard_shortcuts_enabled ? 'bg-blue-600' : 'bg-gray-200'}
                `}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                    ${preferences.keyboard_shortcuts_enabled ? 'translate-x-6' : 'translate-x-1'}
                  `}
                />
              </button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-4">
              Keyboard shortcuts allow you to navigate and perform actions quickly without using your mouse.
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Go to Dashboard</span>
                <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-sm font-mono">
                  {navigator.platform.includes('Mac') ? '⌘D' : 'Ctrl+D'}
                </kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Save Progress</span>
                <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-sm font-mono">
                  {navigator.platform.includes('Mac') ? '⌘S' : 'Ctrl+S'}
                </kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Create New Brand</span>
                <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-sm font-mono">
                  {navigator.platform.includes('Mac') ? '⌘N' : 'Ctrl+N'}
                </kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Show All Shortcuts</span>
                <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-sm font-mono">
                  Shift+/
                </kbd>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Accessibility */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-6 accessibility-settings"
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                <Eye className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Accessibility</h2>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Reduced Motion</h3>
                <p className="text-sm text-gray-500">
                  Minimize animations throughout the interface
                </p>
              </div>
              <button
                onClick={() => setPreferences({ 
                  ...preferences, 
                  reduced_motion: !preferences.reduced_motion 
                })}
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                  ${preferences.reduced_motion ? 'bg-green-600' : 'bg-gray-200'}
                `}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                    ${preferences.reduced_motion ? 'translate-x-6' : 'translate-x-1'}
                  `}
                />
              </button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Account Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg">
              <Settings className="w-5 h-5 text-gray-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Account Information</h2>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="text-gray-900">{user?.email}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Account Created</h3>
              <p className="text-gray-900">
                {user?.created_at 
                  ? new Date(user.created_at).toLocaleDateString() 
                  : 'Not available'}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}