import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastProps {
  type: ToastType
  message: string
  duration?: number
  onClose: () => void
  isVisible: boolean
  luxury?: boolean
}

export const Toast: React.FC<ToastProps> = ({
  type,
  message,
  duration = 5000,
  onClose,
  isVisible,
  luxury = false
}) => {
  const [progress, setProgress] = useState(100)
  
  useEffect(() => {
    if (!isVisible) return
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(interval)
          onClose()
          return 0
        }
        return prev - (100 / (duration / 100))
      })
    }, 100)
    
    return () => clearInterval(interval)
  }, [isVisible, duration, onClose])
  
  const getIcon = () => {
    const iconClasses = luxury ? 'w-6 h-6' : 'w-5 h-5'
    
    switch (type) {
      case 'success': return <CheckCircle className={`${iconClasses} text-green-500`} />
      case 'error': return <AlertCircle className={`${iconClasses} text-red-500`} />
      case 'info': return <Info className={`${iconClasses} text-blue-500`} />
      case 'warning': return <AlertTriangle className={`${iconClasses} text-amber-500`} />
    }
  }
  
  const getColors = () => {
    if (luxury) {
      switch (type) {
        case 'success': return 'bg-gradient-to-r from-green-50/90 to-emerald-50/90 dark:from-green-900/90 dark:to-emerald-900/90 border-green-200/50 dark:border-green-700/50'
        case 'error': return 'bg-gradient-to-r from-red-50/90 to-rose-50/90 dark:from-red-900/90 dark:to-rose-900/90 border-red-200/50 dark:border-red-700/50'
        case 'info': return 'bg-gradient-to-r from-blue-50/90 to-indigo-50/90 dark:from-blue-900/90 dark:to-indigo-900/90 border-blue-200/50 dark:border-blue-700/50'
        case 'warning': return 'bg-gradient-to-r from-amber-50/90 to-yellow-50/90 dark:from-amber-900/90 dark:to-yellow-900/90 border-amber-200/50 dark:border-amber-700/50'
      }
    }
    
    switch (type) {
      case 'success': return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
      case 'error': return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'
      case 'info': return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
      case 'warning': return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700'
    }
  }
  
  const getProgressColor = () => {
    switch (type) {
      case 'success': return 'bg-green-500'
      case 'error': return 'bg-red-500'
      case 'info': return 'bg-blue-500'
      case 'warning': return 'bg-amber-500'
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={`
            fixed bottom-6 right-6 max-w-sm w-full border overflow-hidden z-50
            ${luxury 
              ? 'rounded-3xl backdrop-blur-xl shadow-luxury-2xl' 
              : 'rounded-2xl shadow-luxury-lg'
            }
            ${getColors()}
          `}
        >
          <div className={luxury ? 'p-6' : 'p-4'}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {getIcon()}
              </div>
              <div className="ml-4 w-0 flex-1 pt-0.5">
                <motion.p 
                  className={`${luxury ? 'text-base' : 'text-sm'} font-semibold text-secondary-900 dark:text-secondary-100`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {message}
                </motion.p>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <motion.button
                  className="inline-flex text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50 rounded-xl p-1 transition-colors"
                  onClick={onClose}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="sr-only">Close</span>
                  <X className="h-5 w-5" />
                </motion.button>
              </div>
            </div>
          </div>
          
          {/* Luxury progress bar */}
          <div className={`h-1 w-full ${luxury ? 'bg-secondary-200/30 dark:bg-secondary-700/30' : 'bg-secondary-200 dark:bg-secondary-700'}`}>
            <motion.div 
              initial={{ width: '100%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1, ease: "linear" }}
              className={`h-full ${getProgressColor()} ${luxury ? 'shadow-glow' : ''}`}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}