import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  hover?: boolean
  luxury?: boolean
  glass?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ 
  children, 
  className = '', 
  hover = true,
  luxury = true,
  glass = false,
  ...props
}, ref) => {
  const baseClasses = 'rounded-2xl border overflow-hidden transition-all duration-300'
  
  const variantClasses = glass 
    ? 'glass border-white/20' 
    : luxury 
    ? 'luxury-card' 
    : 'bg-white border-gray-200 shadow-lg'

  const hoverClasses = hover 
    ? 'hover:shadow-xl hover:-translate-y-1 hover:scale-[1.01]' 
    : ''

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className={`${baseClasses} ${variantClasses} ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
})

Card.displayName = 'Card'