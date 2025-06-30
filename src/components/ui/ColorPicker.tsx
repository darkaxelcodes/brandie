import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Palette } from 'lucide-react'

interface ColorPickerProps {
  colors: string[]
  selectedColor?: string
  onColorSelect: (color: string) => void
  label?: string
  className?: string
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  colors,
  selectedColor,
  onColorSelect,
  label,
  className = ''
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {label}
        </label>
      )}
      
      <div className="grid grid-cols-6 gap-3">
        {colors.map((color, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onColorSelect(color)}
            className={`
              relative w-12 h-12 rounded-xl border-2 transition-all
              ${selectedColor === color 
                ? 'border-gray-900 shadow-lg' 
                : 'border-gray-200 hover:border-gray-300'
              }
            `}
            style={{ backgroundColor: color }}
          >
            {selectedColor === color && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Check className="w-5 h-5 text-white drop-shadow-lg" />
              </div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  )
}