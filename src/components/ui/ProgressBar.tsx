import React from 'react'
import { motion } from 'framer-motion'

interface ProgressBarProps {
  progress: number
  className?: string
  showLabel?: boolean
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  className = '', 
  showLabel = true 
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-sm text-gray-600">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-3">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-blue-600 h-3 rounded-full"
        />
      </div>
    </div>
  )
}