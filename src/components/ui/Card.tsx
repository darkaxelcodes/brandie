import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  hover?: boolean
  cyber?: boolean
  glass?: boolean
  glow?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ 
  children, 
  className = '', 
  hover = true,
  cyber = true,
  glass = false,
  glow = false,
  ...props
}, ref) => {
  const baseClasses = 'rounded-lg border overflow-hidden transition-all duration-300'
  
  const variantClasses = glass 
    ? 'glass-dark border-dark-500' 
    : cyber 
    ? 'cyber-card' 
    : 'bg-dark-900 border-dark-500 shadow-cyber'

  const hoverClasses = hover 
    ? 'hover:shadow-neon hover:-translate-y-1 hover:scale-[1.01] hover:border-neon-green/50' 
    : ''

  const glowClasses = glow ? 'neon-glow' : ''

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className={`${baseClasses} ${variantClasses} ${hoverClasses} ${glowClasses} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
})

Card.displayName = 'Card'