import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Coins } from 'lucide-react'
import { Button } from './Button'
import { useTokens } from '../../contexts/TokenContext'
import { TokenUsageModal } from '../tokens/TokenUsageModal'

interface AIButtonProps {
  onClick: () => Promise<void>
  disabled?: boolean
  className?: string
  children?: React.ReactNode
  actionType?: string
  actionDescription?: string
}

export const AIButton: React.FC<AIButtonProps> = ({ 
  onClick, 
  disabled = false, 
  className = '',
  children = 'Get AI Suggestions',
  actionType = 'ai_suggestion',
  actionDescription = 'AI Suggestion Generation'
}) => {
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const { tokenBalance } = useTokens()

  const handleClick = () => {
    if (loading || disabled) return
    setShowModal(true)
  }

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await onClick()
      setShowModal(false)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setShowModal(false)
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={handleClick}
        disabled={disabled || loading || tokenBalance <= 0}
        className={`
          relative overflow-hidden border-blue-200 text-blue-700 hover:bg-blue-50
          ${className}
        `}
      >
        <motion.div
          animate={loading ? { rotate: 360 } : {}}
          transition={{ duration: 1, repeat: loading ? Infinity : 0, ease: "linear" }}
          className="mr-2"
        >
          {loading ? (
            <Loader2 className="w-4 h-4" />
          ) : (
            <span className="w-4 h-4">✨</span>
          )}
        </motion.div>
        {children}
        
        {/* Token indicator */}
        <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          1
        </div>
        
        {/* Shimmer effect */}
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            repeatDelay: 3,
            ease: "easeInOut" 
          }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100 to-transparent opacity-30"
        />
      </Button>

      <TokenUsageModal
        isOpen={showModal}
        onClose={handleClose}
        actionType={actionType}
        description={actionDescription}
        onConfirm={handleConfirm}
      />
    </>
  )
}