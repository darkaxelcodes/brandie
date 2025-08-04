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
}

export const Toast: React.FC<ToastProps> = ({
  type,
  message,
  duration = 5000,
  onClose,
  isVisible
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
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'info': return <Info className="w-5 h-5 text-blue-500" />
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />
    }
  }
  
  const getColors = () => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200'
      case 'error': return 'bg-red-50 border-red-200'
      case 'info': return 'bg-blue-50 border-blue-200'
      case 'warning': return 'bg-amber-50 border-amber-200'
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
          className={`fixed bottom-4 right-4 max-w-sm w-full shadow-lg rounded-lg border ${getColors()} overflow-hidden z-50`}
        >
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {getIcon()}
              </div>
              <div className="ml-3 w-0 flex-1 pt-0.5">
                <p className="text-sm font-medium text-gray-900">{message}</p>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  className="bg-transparent rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={onClose}
                >
                  <span className="sr-only">Close</span>
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          <div className="h-1 w-full bg-gray-200">
            <div 
              className={`h-full ${getProgressColor()} transition-all duration-100 ease-linear`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}