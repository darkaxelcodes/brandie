import React from 'react'
import { motion } from 'framer-motion'
import { Brain, Edit3 } from 'lucide-react'

interface ModeToggleProps {
  mode: 'manual' | 'ai-pilot'
  onModeChange: (mode: 'manual' | 'ai-pilot') => void
  className?: string
}

export const ModeToggle: React.FC<ModeToggleProps> = ({
  mode,
  onModeChange,
  className = ''
}) => {
  return (
    <div className={`flex items-center space-x-1 bg-gray-100 rounded-xl p-1 ${className}`}>
      <button
        onClick={() => onModeChange('manual')}
        className={`
          flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all text-sm
          ${mode === 'manual'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
          }
        `}
      >
        <Edit3 className="w-4 h-4" />
        <span>Manual</span>
      </button>
      
      <button
        onClick={() => onModeChange('ai-pilot')}
        className={`
          flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all text-sm
          ${mode === 'ai-pilot'
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
          }
        `}
      >
        <Brain className="w-4 h-4" />
        <span>AI Pilot</span>
        {mode === 'ai-pilot' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-2 h-2 bg-white rounded-full"
          />
        )}
      </button>
    </div>
  )
}