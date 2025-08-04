import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Palette, Sparkles } from 'lucide-react'

interface ColorPickerProps {
  colors: string[]
  selectedColor?: string
  onColorSelect: (color: string) => void
  label?: string
  className?: string
  luxury?: boolean
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  colors,
  selectedColor,
  onColorSelect,
  label,
  className = '',
  luxury = false
}) => {
  const [hoveredColor, setHoveredColor] = useState<string | null>(null)

  return (
    <div className={className}>
      {label && (
        <motion.label 
          className={`block text-sm font-semibold mb-4 ${luxury ? 'text-secondary-700 dark:text-secondary-300 tracking-wide uppercase' : 'text-secondary-700 dark:text-secondary-300'}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center space-x-2">
            <Palette className="w-4 h-4" />
            <span>{label}</span>
          </div>
        </motion.label>
      )}
      
      <div className={`grid ${luxury ? 'grid-cols-5 gap-4' : 'grid-cols-6 gap-3'}`}>
        {colors.map((color, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onColorSelect(color)}
            onHoverStart={() => setHoveredColor(color)}
            onHoverEnd={() => setHoveredColor(null)}
            className={`
              relative rounded-2xl transition-all duration-300 group
              ${luxury 
                ? 'w-16 h-16 border-2 shadow-luxury hover:shadow-luxury-lg' 
                : 'w-12 h-12 border-2 shadow-lg hover:shadow-xl'
              }
              ${selectedColor === color 
                ? 'border-secondary-900 dark:border-white shadow-luxury-lg' 
                : 'border-secondary-200 dark:border-secondary-600 hover:border-secondary-300 dark:hover:border-secondary-500'
              }
            `}
            style={{ backgroundColor: color }}
          >
            {selectedColor === color && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="bg-white/90 dark:bg-secondary-900/90 rounded-full p-1 backdrop-blur-sm">
                  <Check className="w-4 h-4 text-secondary-900 dark:text-white" />
                </div>
              </motion.div>
            )}
            
            {/* Luxury glow effect on hover */}
            {luxury && hoveredColor === color && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 rounded-2xl"
                style={{ 
                  boxShadow: `0 0 20px ${color}40, 0 0 40px ${color}20`,
                }}
              />
            )}
            
            {/* Color value tooltip */}
            {hoveredColor === color && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-secondary-900 dark:bg-white text-white dark:text-secondary-900 text-xs font-mono px-2 py-1 rounded-lg whitespace-nowrap z-10"
              >
                {color}
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
      
      {luxury && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 p-4 bg-gradient-to-r from-primary-50/50 to-accent-gold-50/50 dark:from-primary-900/20 dark:to-accent-gold-900/20 rounded-2xl border border-primary-200/50 dark:border-primary-700/50"
        >
          <div className="flex items-center space-x-2 text-sm text-secondary-600 dark:text-secondary-400">
            <Sparkles className="w-4 h-4 text-primary-500" />
            <span>Click any color to select it for your brand palette</span>
          </div>
        </motion.div>
      )}
    </div>
  )
}