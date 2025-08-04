import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  className?: string
  luxury?: boolean
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
  luxury = false
}) => (
  <AnimatePresence>
    {isOpen && (
      <>
        {/* Backdrop with luxury blur effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-secondary-900/80 backdrop-blur-md z-40"
        />

        {/* Centering wrapper */}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          {/* Modal panel with luxury styling */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className={`
              ${luxury 
                ? 'bg-gradient-to-br from-white/95 to-white/85 dark:from-secondary-900/95 dark:to-secondary-800/85 backdrop-blur-xl border border-secondary-200/50 dark:border-secondary-700/50 shadow-luxury-2xl' 
                : 'bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-700 shadow-luxury-xl'
              }
              rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden
              ${className}
            `}
          >
            {/* Header with luxury styling */}
            <div className={`
              flex items-center justify-between p-8 border-b 
              ${luxury 
                ? 'border-secondary-200/50 dark:border-secondary-700/50 bg-gradient-to-r from-primary-50/50 to-primary-100/50 dark:from-primary-900/20 dark:to-primary-800/20' 
                : 'border-secondary-200 dark:border-secondary-700'
              }
            `}>
              <motion.h2 
                className="text-2xl font-bold text-secondary-900 dark:text-white"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                {title}
              </motion.h2>
              <motion.button
                onClick={onClose}
                className="p-3 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-xl transition-colors duration-300 group"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <X className="h-6 w-6 text-secondary-500 group-hover:text-secondary-700 dark:group-hover:text-secondary-300 transition-colors" />
              </motion.button>
            </div>

            {/* Body with luxury padding and styling */}
            <motion.div 
              className="p-8 overflow-y-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {children}
            </motion.div>
          </motion.div>
        </div>
      </>
    )}
  </AnimatePresence>
)