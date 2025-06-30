import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, X, ArrowRight, ArrowLeft, Check } from 'lucide-react'
import { Button } from './Button'

export interface TourStep {
  target: string
  title: string
  content: string
  placement?: 'top' | 'right' | 'bottom' | 'left'
}

interface TourProps {
  steps: TourStep[]
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
  currentStep?: number
  onStepChange?: (step: number) => void
}

export const Tour: React.FC<TourProps> = ({
  steps,
  isOpen,
  onClose,
  onComplete,
  currentStep = 0,
  onStepChange
}) => {
  const [activeStep, setActiveStep] = useState(currentStep)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const tooltipRef = useRef<HTMLDivElement>(null)
  const positioningTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const highlightedElementRef = useRef<Element | null>(null)
  const isInitialMount = useRef(true)
  const [targetElement, setTargetElement] = useState<Element | null>(null)

  // Update internal state when prop changes
  useEffect(() => {
    if (!isInitialMount.current) {
      setActiveStep(currentStep)
    }
    isInitialMount.current = false
  }, [currentStep])

  // Position tooltip when step changes or tour opens
  useEffect(() => {
    if (isOpen && steps.length > 0 && steps[activeStep]) {
      // Use a small delay to ensure DOM is ready
      positioningTimeoutRef.current = setTimeout(() => {
        positionTooltip()
      }, 100)
      
      window.addEventListener('resize', positionTooltip)
      window.addEventListener('scroll', positionTooltip, true)
    }

    return () => {
      if (positioningTimeoutRef.current) {
        clearTimeout(positioningTimeoutRef.current)
      }
      window.removeEventListener('resize', positionTooltip)
      window.removeEventListener('scroll', positionTooltip, true)
      
      // Clean up highlight when component unmounts
      if (highlightedElementRef.current) {
        highlightedElementRef.current.classList.remove('tour-highlight')
        highlightedElementRef.current = null
      }
    }
  }, [isOpen, activeStep, steps])

  const positionTooltip = () => {
    if (!isOpen || steps.length === 0 || !steps[activeStep]) return

    const currentTarget = steps[activeStep].target
    const targetElement = document.querySelector(currentTarget)
    
    if (!targetElement || !tooltipRef.current) return

    setTargetElement(targetElement)
    const targetRect = targetElement.getBoundingClientRect()
    const tooltipRect = tooltipRef.current.getBoundingClientRect()
    const placement = steps[activeStep].placement || 'bottom'

    let top = 0
    let left = 0

    switch (placement) {
      case 'top':
        top = targetRect.top - tooltipRect.height - 10
        left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2)
        break
      case 'right':
        top = targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2)
        left = targetRect.right + 10
        break
      case 'bottom':
        top = targetRect.bottom + 10
        left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2)
        break
      case 'left':
        top = targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2)
        left = targetRect.left - tooltipRect.width - 10
        break
    }

    // Ensure tooltip stays within viewport
    const padding = 10
    if (left < padding) left = padding
    if (top < padding) top = padding
    if (left + tooltipRect.width > window.innerWidth - padding) {
      left = window.innerWidth - tooltipRect.width - padding
    }
    if (top + tooltipRect.height > window.innerHeight - padding) {
      top = window.innerHeight - tooltipRect.height - padding
    }

    setTooltipPosition({ top, left })

    // Highlight the target element
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    
    // Remove previous highlight
    if (highlightedElementRef.current && highlightedElementRef.current !== targetElement) {
      highlightedElementRef.current.classList.remove('tour-highlight')
    }
    
    // Add highlight effect to target element
    targetElement.classList.add('tour-highlight')
    highlightedElementRef.current = targetElement
  }

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      const nextStep = activeStep + 1
      setActiveStep(nextStep)
      if (onStepChange) onStepChange(nextStep)
    } else {
      handleComplete()
    }
  }

  const handlePrev = () => {
    if (activeStep > 0) {
      const prevStep = activeStep - 1
      setActiveStep(prevStep)
      if (onStepChange) onStepChange(prevStep)
    }
  }

  const handleComplete = () => {
    cleanupHighlight()
    onComplete()
  }

  const handleClose = () => {
    cleanupHighlight()
    onClose()
  }

  const cleanupHighlight = () => {
    if (highlightedElementRef.current) {
      highlightedElementRef.current.classList.remove('tour-highlight')
      highlightedElementRef.current = null
    }
  }

  // Early return if tour is not open, no steps, or current step is invalid
  if (!isOpen || steps.length === 0 || !steps[activeStep]) return null

  const currentStepData = steps[activeStep]

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 z-40 pointer-events-none" />
      
      {/* Tooltip */}
      <AnimatePresence>
        <motion.div
          ref={tooltipRef}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          style={{
            position: 'fixed',
            top: tooltipPosition.top,
            left: tooltipPosition.left,
            zIndex: 50
          }}
          className="bg-white rounded-lg shadow-xl border border-gray-200 w-80"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">{currentStepData.title}</h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-4">
            <p className="text-gray-600 mb-4">{currentStepData.content}</p>
            
            {/* Progress indicator */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex space-x-1">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === activeStep ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-500">
                {activeStep + 1} of {steps.length}
              </div>
            </div>
            
            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrev}
                disabled={activeStep === 0}
                className="flex items-center space-x-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </Button>
              
              {activeStep < steps.length - 1 ? (
                <Button
                  size="sm"
                  onClick={handleNext}
                  className="flex items-center space-x-1"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={handleComplete}
                  className="flex items-center space-x-1"
                >
                  <Check className="w-4 h-4" />
                  <span>Finish</span>
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Add global styles for highlighted elements */}
      <style jsx global>{`
        .tour-highlight {
          position: relative;
          z-index: 45;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5);
          border-radius: 4px;
        }
      `}</style>
    </>
  )
}