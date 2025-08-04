import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'terminal' | 'ai-primary'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  children: React.ReactNode
  glow?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  glow = false,
  ...props
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neon-green focus:ring-offset-void disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group'
  
  const variants = {
    primary: 'bg-neon-green text-void hover:bg-neon-green/90 shadow-neon hover:shadow-neon-lg hover:scale-[1.02] active:scale-[0.98]',
    secondary: 'bg-dark-800 text-light border border-dark-500 hover:border-dark-400 hover:bg-dark-700 shadow-cyber hover:shadow-neon hover:scale-[1.02] active:scale-[0.98]',
    outline: 'border border-neon-green text-neon-green hover:bg-neon-green hover:text-void hover:scale-[1.02] active:scale-[0.98]',
    ghost: 'text-dark-100 hover:text-light hover:bg-dark-800 hover:scale-[1.02] active:scale-[0.98]',
    terminal: 'bg-dark-800 text-neon-green font-mono border border-dark-500 hover:border-neon-green hover:bg-dark-700 hover:shadow-neon hover:scale-[1.02] active:scale-[0.98]',
    'ai-primary': 'text-void font-semibold bg-gradient-ai hover:shadow-neon-lg hover:scale-[1.02] active:scale-[0.98] neon-glow'
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  }

  const isDisabled = disabled || loading

  return (
    <motion.button
      ref={ref}
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      className={`
        ${baseClasses} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${glow ? 'neon-glow' : ''} 
        ${className}
      `}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      {...props}
    >
      {/* Holographic effect for AI buttons */}
      {variant === 'ai-primary' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ 
            duration: 0.6, 
            ease: 'easeInOut' 
          }}
        />
      )}
      
      {/* Data flow effect for terminal buttons */}
      {variant === 'terminal' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-green/10 to-transparent"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ 
            duration: 1, 
            ease: 'easeInOut' 
          }}
        />
      )}
      
      {/* Loading spinner */}
      {loading && (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
      )}
      
      {/* Button content */}
      <span className="relative z-10 flex items-center">
        {children}
      </span>
    </motion.button>
  )
})

Button.displayName = 'Button'