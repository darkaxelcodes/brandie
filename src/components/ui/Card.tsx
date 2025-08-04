import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ 
  children, 
  className = '', 
  hover = false,
  ...props
}, ref) => {
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { y: -2, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' } : {}}
      className={`
        bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden
        ${hover ? 'transition-all duration-200' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  )
})

Card.displayName = 'Card'