import React from 'react'
import { HelpCircle } from 'lucide-react'
import { Button } from './Button'
import { useTour } from '../../contexts/TourContext'

interface TourButtonProps {
  tourId: string
  className?: string
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export const TourButton: React.FC<TourButtonProps> = ({
  tourId,
  className = '',
  variant = 'outline',
  size = 'sm'
}) => {
  const { showTour, hasCompletedTour } = useTour()

  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => showTour(tourId)}
      className={`flex items-center space-x-2 ${className}`}
    >
      <HelpCircle className="w-4 h-4" />
      <span>{hasCompletedTour(tourId) ? 'Show Tour' : 'Take Tour'}</span>
    </Button>
  )
}