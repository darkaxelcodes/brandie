import React from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

interface Step {
  id: string
  title: string
  completed: boolean
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
  className?: string
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ 
  steps, 
  currentStep, 
  className = '' 
}) => {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                ${index <= currentStep 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-500'
                }
                ${step.completed ? 'bg-green-600' : ''}
              `}
            >
              {step.completed ? (
                <Check className="w-5 h-5" />
              ) : (
                <span>{index + 1}</span>
              )}
            </motion.div>
            <span className={`
              mt-2 text-xs font-medium text-center max-w-20
              ${index <= currentStep ? 'text-gray-900' : 'text-gray-500'}
            `}>
              {step.title}
            </span>
          </div>
          
          {index < steps.length - 1 && (
            <div className={`
              flex-1 h-0.5 mx-4 
              ${index < currentStep ? 'bg-blue-600' : 'bg-gray-200'}
            `} />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}