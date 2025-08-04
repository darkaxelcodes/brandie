import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glass?: boolean
  luxury?: boolean
  glow?: boolean
  sharp?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ 
  children, 
  className = '', 
  hover = false,
  glass = false,
  luxury = false,
  glow = false,
  sharp = false,
  ...props
}, ref) => {
  const baseClasses = `${sharp ? 'rounded-sm' : 'rounded-lg'} overflow-hidden transition-all duration-500`
  
  const getVariantClasses = () => {
    if (glass) {
      return 'bg-white/10 backdrop-blur-md border border-white/20 shadow-luxury'
    }
    
    if (luxury) {
      return 'bg-gradient-to-br from-white/95 to-white/85 dark:from-neutral-900/95 dark:to-neutral-800/85 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-700/50 shadow-luxury-lg'
    }
    
    return 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 shadow-luxury'
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