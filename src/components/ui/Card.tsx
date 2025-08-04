import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glass?: boolean
  luxury?: boolean
  glow?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ 
  children, 
  className = '', 
  hover = false,
  glass = false,
  luxury = false,
  glow = false,
  ...props
}, ref) => {
  const baseClasses = 'rounded-3xl overflow-hidden transition-all duration-500'
  
  const getVariantClasses = () => {
    if (glass) {
      return 'bg-white/10 backdrop-blur-md border border-white/20 shadow-luxury'
    }
    
    if (luxury) {
      return 'bg-gradient-to-br from-white/90 to-white/70 dark:from-secondary-900/90 dark:to-secondary-800/70 backdrop-blur-xl border border-secondary-200/50 dark:border-secondary-700/50 shadow-luxury-lg'
    }
    
    return 'bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-700 shadow-luxury'
  }
  
  const hoverEffect = hover ? 'hover:shadow-luxury-xl hover:scale-[1.01] hover:-translate-y-1' : ''
  const glowEffect = glow ? 'shadow-glow hover:shadow-glow-lg' : ''

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={hover ? { 
        y: -4, 
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        scale: 1.01
      } : {}}
      className={`
        ${baseClasses}
        ${getVariantClasses()}
        ${hoverEffect}
        ${glowEffect}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  )
})

Card.displayName = 'Card'