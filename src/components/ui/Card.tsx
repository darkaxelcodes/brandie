import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  hover?: boolean
  luxury?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ 
  children, 
  className = '', 
  hover = false,
  luxury = true,
  ...props
}, ref) => {
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      whileHover={hover ? { 
        y: -4, 
        scale: 1.02,
        transition: { type: "spring", stiffness: 400, damping: 17 }
      } : {}}
      className={`
        ${luxury ? 'card-luxury' : 'bg-white border border-neutral-200 shadow-lg'} 
        rounded-3xl overflow-hidden
        ${hover ? 'hover-lift cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  )
})

Card.displayName = 'Card'