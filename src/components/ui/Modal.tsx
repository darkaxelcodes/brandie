// import React from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { X } from 'lucide-react'

// interface ModalProps {
//   isOpen: boolean
//   onClose: () => void
//   title: string
//   children: React.ReactNode
//   className?: string
// }

// export const Modal: React.FC<ModalProps> = ({
//   isOpen,
//   onClose,
//   title,
//   children,
//   className = ''
// }) => {
//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <>
//           {/* Backdrop */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={onClose}
//             className="fixed inset-0 bg-black bg-opacity-50 z-40"
//           />
          
//           {/* Modal */}
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95, y: 20 }}
//             animate={{ opacity: 1, scale: 1, y: 0 }}
//             exit={{ opacity: 0, scale: 0.95, y: 20 }}
//             className={`
//               fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
//               bg-white rounded-2xl shadow-2xl z-50 w-full max-w-md mx-auto
//               ${className}
//             `}
//           >
//             {/* Header */}
//             <div className="flex items-center justify-between p-6 border-b border-gray-200">
//               <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
//               <button
//                 onClick={onClose}
//                 className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>
            
//             {/* Content */}
//             <div className="p-6">
//               {children}
//             </div>
//           </motion.div>
//         </>
//       )}
//     </AnimatePresence>
//   )
// }

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  className?: string
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = ''
}) => (
  <AnimatePresence>
    {isOpen && (
      <>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40"
        />

        {/* Centering wrapper */}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Modal panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            // stop clicks inside the panel from closing the modal
            onClick={(e) => e.stopPropagation()}
            className={`
              bg-white rounded-2xl shadow-2xl w-full max-w-2xl
              ${className}
            `}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      </>
    )}
  </AnimatePresence>
)
