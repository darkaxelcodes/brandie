import React from 'react'
import { motion } from 'framer-motion'

interface SliderProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  leftLabel: string
  rightLabel: string
  className?: string
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  leftLabel,
  rightLabel,
  className = ''
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex justify-between text-sm text-gray-600">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
      
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-1/2 transform -translate-y-1/2 w-5 h-5 bg-blue-600 rounded-full shadow-lg pointer-events-none"
          style={{ left: `calc(${(value / max) * 100}% - 10px)` }}
        />
      </div>
      
      <div className="text-center">
        <span className="text-sm font-medium text-gray-700">{value}%</span>
      </div>
      
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: #2563EB;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #2563EB;
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  )
}