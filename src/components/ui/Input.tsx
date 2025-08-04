import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: React.ReactNode
  luxury?: boolean
  sharp?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  className = '',
  icon,
  luxury = false,
  sharp = false,
  ...props
}, ref) => {
  const id = props.id || `input-${Math.random().toString(36).substring(2, 9)}`
  
  const baseClasses = luxury 
    ? `w-full px-6 py-4 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm border border-neutral-300/50 dark:border-neutral-600/50 ${sharp ? 'rounded-sm' : 'rounded-lg'} text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 focus:border-sapphire-500 focus:bg-white dark:focus:bg-neutral-800 focus:shadow-glow transition-all duration-300`
    : `w-full px-4 py-3 border ${sharp ? 'rounded-sm' : 'rounded-lg'} shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sapphire-500/50 focus:border-sapphire-500`
  
  const errorClasses = error 
    ? 'border-red-300 focus:ring-red-500/50 focus:border-red-500' 
    : 'border-neutral-300 dark:border-neutral-600'
    
  const iconClasses = icon ? (luxury ? 'pl-14' : 'pl-12') : ''
  
  return (
    <div className="space-y-3">
      {label && (
        <motion.label 
          htmlFor={id} 
          className={`block text-sm font-semibold ${luxury ? 'text-neutral-700 dark:text-neutral-300 tracking-wide' : 'text-neutral-700 dark:text-neutral-300'}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {label}
        </motion.label>
      )}
      <div className="relative">
        {icon && (
          <div className={`absolute inset-y-0 left-0 ${luxury ? 'pl-6' : 'pl-4'} flex items-center pointer-events-none`}>
            <div className="text-neutral-400 dark:text-neutral-500">
              {icon}
            </div>
          </div>
        )}
        <motion.input
          id={id}
          ref={ref}
          className={`
            ${baseClasses}
            ${errorClasses}
            ${iconClasses}
            ${className}
            bg-white dark:bg-neutral-900
            text-neutral-900 dark:text-neutral-100
            placeholder-neutral-500 dark:placeholder-neutral-400
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          whileFocus={{ scale: 1.01 }}
          {...props}
        />
      </div>
      {error && (
        <motion.p 
          id={`${id}-error`} 
          className="text-sm text-red-600 dark:text-red-400 font-medium" 
          role="alert"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {error}
        </motion.p>
      )}
      {helperText && !error && (
        <motion.p 
          id={`${id}-helper`} 
          className="text-sm text-neutral-500 dark:text-neutral-400"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {helperText}
        </motion.p>
      )}
    </div>
  )
})

Input.displayName = 'Input'