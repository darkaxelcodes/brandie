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
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sapphire-500/50 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-neutral-950 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-gradient-to-r from-sapphire-600 to-sapphire-700 hover:from-sapphire-700 hover:to-sapphire-800 text-white shadow-luxury hover:shadow-luxury-lg transform hover:scale-[1.02] active:scale-[0.98]',
    secondary: 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-luxury hover:shadow-luxury-lg transform hover:scale-[1.02] active:scale-[0.98]',
    outline: 'border-2 border-neutral-300 dark:border-neutral-600 hover:border-sapphire-500 dark:hover:border-sapphire-400 text-neutral-700 dark:text-neutral-300 hover:text-sapphire-600 dark:hover:text-sapphire-400 hover:bg-sapphire-50 dark:hover:bg-sapphire-900/20 transform hover:scale-[1.02] active:scale-[0.98]',
    ghost: 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transform hover:scale-[1.02] active:scale-[0.98]',
    luxury: 'bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white shadow-luxury-lg hover:shadow-luxury-xl transform hover:scale-[1.02] active:scale-[0.98]',
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