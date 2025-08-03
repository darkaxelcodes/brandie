import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, User, LogOut, Menu, X, Home, Settings, Keyboard, HelpCircle } from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../ui/Button'
import { useToast } from '../../contexts/ToastContext'
import { SubscriptionBadge } from '../ui/SubscriptionBadge'
import { KeyboardShortcutsPanel } from '../ui/KeyboardShortcutsPanel'
import { useKeyboardShortcut } from '../../hooks/useKeyboardShortcut'
import { useTour } from '../../contexts/TourContext'

export const Header: React.FC = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { showToast } = useToast()
  const { showTour } = useTour()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  // Toggle keyboard shortcuts panel with Shift+/
  useKeyboardShortcut('/', () => {
    setShowShortcuts(!showShortcuts)
  }, { shiftKey: true })

  // Dashboard shortcut
  useKeyboardShortcut('d', () => {
    navigate('/dashboard')
  }, { ctrlKey: !navigator.platform.includes('Mac'), metaKey: navigator.platform.includes('Mac') })

  // Close panels with Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowShortcuts(false)
        setUserMenuOpen(false)
      }
    }
    
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut()
      showToast('success', 'Successfully signed out')
      navigate('/')
    } catch (error) {
      console.error('Error signing out:', error)
      showToast('error', 'Failed to sign out')
    }
  }

  // Determine which tour to show based on current path
  const handleShowTour = () => {
    const path = location.pathname
    
    if (path.includes('/strategy')) {
      showTour('strategy')
    } else if (path.includes('/visual')) {
      showTour('visual')
    } else {
      showTour('dashboard')
    }
    
    setUserMenuOpen(false)
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link to="/dashboard" className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Brandie</h1>
              <p className="text-sm text-gray-500">Build every brand overnight</p>
              <SubscriptionBadge className="mt-1" />
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {user && (
            <>
              <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                >
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="text-sm">{user.email?.split('@')[0]}</span>
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                    <Link 
                      to="/preferences" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Preferences
                    </Link>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false)
                        setShowShortcuts(true)
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                    >
                      <Keyboard className="w-4 h-4 mr-2" />
                      Keyboard Shortcuts
                    </button>
                    <button
                      onClick={handleShowTour}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                    >
                      <HelpCircle className="w-4 h-4 mr-2" />
                      Show Tour
                    </button>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false)
                        handleSignOut()
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowShortcuts(true)}
                className="flex items-center space-x-2"
              >
                <Keyboard className="w-4 h-4" />
                <span>Shortcuts</span>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white border-t border-gray-200 mt-4"
        >
          <div className="py-4 px-6 space-y-4">
            <Link 
              to="/dashboard" 
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link 
              to="/preferences" 
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Settings className="w-5 h-5" />
              <span>Preferences</span>
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false)
                setShowShortcuts(true)
              }}
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 py-2 w-full text-left"
            >
              <Keyboard className="w-5 h-5" />
              <span>Keyboard Shortcuts</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false)
                handleShowTour()
              }}
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 py-2 w-full text-left"
            >
              <HelpCircle className="w-5 h-5" />
              <span>Show Tour</span>
            </button>
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                <User className="w-4 h-4" />
                <span>{user?.email}</span>
              </div>
              <Button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Keyboard Shortcuts Panel */}
      <KeyboardShortcutsPanel 
        isOpen={showShortcuts} 
        onClose={() => setShowShortcuts(false)} 
      />
    </motion.header>
  )
}