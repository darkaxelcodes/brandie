import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'luxury' | 'glass'
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
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-secondary-950 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-luxury hover:shadow-luxury-lg transform hover:scale-[1.02] active:scale-[0.98]',
    secondary: 'bg-secondary-100 hover:bg-secondary-200 dark:bg-secondary-800 dark:hover:bg-secondary-700 text-secondary-900 dark:text-secondary-100 shadow-luxury hover:shadow-luxury-lg transform hover:scale-[1.02] active:scale-[0.98]',
    outline: 'border-2 border-secondary-300 dark:border-secondary-600 hover:border-primary-500 dark:hover:border-primary-400 text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transform hover:scale-[1.02] active:scale-[0.98]',
    ghost: 'text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-100 hover:bg-secondary-100 dark:hover:bg-secondary-800 transform hover:scale-[1.02] active:scale-[0.98]',
    luxury: 'bg-gradient-to-r from-accent-gold-500 to-accent-gold-600 hover:from-accent-gold-600 hover:to-accent-gold-700 text-white shadow-luxury-lg hover:shadow-luxury-xl transform hover:scale-[1.02] active:scale-[0.98]',
    glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 shadow-luxury transform hover:scale-[1.02] active:scale-[0.98]'
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  }

  const glowEffect = glow ? 'shadow-glow hover:shadow-glow-lg' : ''
  const isDisabled = disabled || loading

  return (
    <motion.button
      ref={ref}
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${glowEffect} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      {...props}
    >
      {loading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mr-3"
        >
          <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
        </motion.div>
      )}
      {children}
    </motion.button>
  )
})

Button.displayName = 'Button'