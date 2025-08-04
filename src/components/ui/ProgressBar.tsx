import React from 'react'
import { motion } from 'framer-motion'

interface ProgressBarProps {
  progress: number
  className?: string
  showLabel?: boolean
  luxury?: boolean
  size?: 'sm' | 'md' | 'lg'
  gradient?: boolean
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  className = '', 
  showLabel = true,
  luxury = false,
  size = 'md',
  gradient = false
}) => {
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  }
  
  const getBackgroundClasses = () => {
    if (luxury) {
      return 'bg-secondary-200/50 dark:bg-secondary-700/50 backdrop-blur-sm'
    }
    return 'bg-secondary-200 dark:bg-secondary-700'
  }
  
  const getProgressClasses = () => {
    if (gradient) {
      return 'bg-gradient-to-r from-primary-600 to-accent-gold-500'
    }
    if (luxury) {
      return 'bg-gradient-to-r from-primary-600 to-primary-700 shadow-glow'
    }
    return 'bg-primary-600'
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-secondary-700 dark:text-secondary-300">
            Progress
          </span>
          <motion.span 
            className="text-sm font-bold text-primary-600 dark:text-primary-400"
            key={progress}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {progress}%
          </motion.span>
        </div>
      )}
      <div className={`w-full ${getBackgroundClasses()} rounded-full ${sizeClasses[size]} overflow-hidden ${luxury ? 'border border-secondary-300/50 dark:border-secondary-600/50' : ''}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ 
            duration: 1.2, 
            ease: "easeOut",
            type: "spring",
            damping: 20
          }}
          className={`${sizeClasses[size]} ${getProgressClasses()} rounded-full relative overflow-hidden`}
        >
          {luxury && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "linear",
                repeatDelay: 1
              }}
            />
          )}
        </motion.div>
      </div>
    </div>
  )
}