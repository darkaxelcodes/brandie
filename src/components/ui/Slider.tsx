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
  luxury?: boolean
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  leftLabel,
  rightLabel,
  className = '',
  luxury = false
}) => {
  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex justify-between items-center">
        <span className={`text-sm font-semibold ${luxury ? 'text-secondary-700 dark:text-secondary-300 tracking-wide' : 'text-secondary-600 dark:text-secondary-400'}`}>
          {leftLabel}
        </span>
        <span className={`text-sm font-semibold ${luxury ? 'text-secondary-700 dark:text-secondary-300 tracking-wide' : 'text-secondary-600 dark:text-secondary-400'}`}>
          {rightLabel}
        </span>
      </div>
      
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={`
            w-full h-3 appearance-none cursor-pointer rounded-full outline-none
            ${luxury 
              ? 'bg-gradient-to-r from-secondary-200 to-secondary-300 dark:from-secondary-700 dark:to-secondary-600' 
              : 'bg-secondary-200 dark:bg-secondary-700'
            }
            slider
          `}
        />
        
        {/* Custom track fill */}
        <div 
          className={`
            absolute top-0 left-0 h-3 rounded-full pointer-events-none
            ${luxury 
              ? 'bg-gradient-to-r from-primary-600 to-accent-gold-500 shadow-glow' 
              : 'bg-primary-600'
            }
          `}
          style={{ width: `${percentage}%` }}
        />
        
        {/* Custom thumb */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          className={`
            absolute top-1/2 transform -translate-y-1/2 pointer-events-none
            ${luxury 
              ? 'w-6 h-6 bg-gradient-to-r from-primary-600 to-accent-gold-500 rounded-full shadow-luxury border-2 border-white dark:border-secondary-800' 
              : 'w-5 h-5 bg-primary-600 rounded-full shadow-lg border-2 border-white dark:border-secondary-800'
            }
          `}
          style={{ left: `calc(${percentage}% - ${luxury ? '12px' : '10px'})` }}
        />
      </div>
      
      <div className="text-center">
        <motion.span 
          className={`${luxury ? 'text-lg' : 'text-sm'} font-bold ${luxury ? 'text-gradient' : 'text-secondary-700 dark:text-secondary-300'}`}
          key={value}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {value}%
        </motion.span>
      </div>
      
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: ${luxury ? '24px' : '20px'};
          height: ${luxury ? '24px' : '20px'};
          background: ${luxury 
            ? 'linear-gradient(135deg, #7c6df2 0%, #f59e0b 100%)' 
            : '#7c6df2'
          };
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: ${luxury 
            ? '0 4px 12px rgba(124, 109, 242, 0.4)' 
            : '0 2px 4px rgba(0, 0, 0, 0.1)'
          };
          transition: all 0.3s ease;
        }
        
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: ${luxury 
            ? '0 6px 20px rgba(124, 109, 242, 0.6)' 
            : '0 4px 8px rgba(0, 0, 0, 0.2)'
          };
        }
        
        .slider::-moz-range-thumb {
          width: ${luxury ? '24px' : '20px'};
          height: ${luxury ? '24px' : '20px'};
          background: ${luxury 
            ? 'linear-gradient(135deg, #7c6df2 0%, #f59e0b 100%)' 
            : '#7c6df2'
          };
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: ${luxury 
            ? '0 4px 12px rgba(124, 109, 242, 0.4)' 
            : '0 2px 4px rgba(0, 0, 0, 0.1)'
          };
          transition: all 0.3s ease;
        }
        
        .slider::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: ${luxury 
            ? '0 6px 20px rgba(124, 109, 242, 0.6)' 
            : '0 4px 8px rgba(0, 0, 0, 0.2)'
          };
        }
      `}</style>
    </div>
  )
}