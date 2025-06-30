import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Toast, ToastType } from '../components/ui/Toast'

interface ToastContextType {
  showToast: (type: ToastType, message: string, duration?: number) => void
  hideToast: () => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

interface ToastProviderProps {
  children: ReactNode
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toast, setToast] = useState<{
    type: ToastType
    message: string
    duration: number
    isVisible: boolean
  }>({
    type: 'info',
    message: '',
    duration: 5000,
    isVisible: false
  })

  const showToast = (type: ToastType, message: string, duration = 5000) => {
    setToast({
      type,
      message,
      duration,
      isVisible: true
    })
  }

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }))
  }

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <Toast
        type={toast.type}
        message={toast.message}
        duration={toast.duration}
        onClose={hideToast}
        isVisible={toast.isVisible}
      />
    </ToastContext.Provider>
  )
}