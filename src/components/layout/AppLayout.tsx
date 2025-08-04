import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'
import { Sidebar } from './Sidebar'
import { KeyboardShortcutsPanel } from '../ui/KeyboardShortcutsPanel'
import { useKeyboardShortcut } from '../../hooks/useKeyboardShortcut'
import { TokenUsageModal } from '../tokens/TokenUsageModal'
import { useTokenAction } from '../../hooks/useTokenAction'

export const AppLayout: React.FC = () => {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { showToast } = useToast()
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [collapsed, setCollapsed] = useState(true)
  const { 
    isModalOpen, 
    setIsModalOpen, 
    currentAction, 
    confirmTokenAction 
  } = useTokenAction()

  // Toggle keyboard shortcuts panel with Shift+/
  useKeyboardShortcut('/', () => {
    setShowShortcuts(!showShortcuts)
  }, { shiftKey: true })

  // Redirect to home if accessing root
  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/home')
    }
  }, [location.pathname, navigate])

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

  return (
    <div className="flex h-screen bg-secondary-50 dark:bg-secondary-950">
      <Sidebar 
        onSignOut={handleSignOut} 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
      />
      
      <div className="flex-1 overflow-auto">
        <main className="h-full">
          <Outlet />
        </main>
      </div>

      {/* Keyboard Shortcuts Panel */}
      <KeyboardShortcutsPanel 
        isOpen={showShortcuts} 
        onClose={() => setShowShortcuts(false)} 
      />

      {/* Token Usage Modal */}
      {currentAction && (
        <TokenUsageModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          actionType={currentAction.type}
          description={currentAction.description}
          onConfirm={confirmTokenAction}
        />
      )}
    </div>
  )
}