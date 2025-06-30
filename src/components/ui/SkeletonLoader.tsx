import React from 'react'

interface SkeletonLoaderProps {
  variant?: 'text' | 'circle' | 'rect' | 'card' | 'list'
  width?: string | number
  height?: string | number
  className?: string
  count?: number
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'text',
  width,
  height,
  className = '',
  count = 1
}) => {
  const getBaseClasses = () => {
    return 'animate-pulse bg-gray-200 rounded'
  }

  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'h-4 w-full'
      case 'circle':
        return 'rounded-full'
      case 'rect':
        return ''
      case 'card':
        return 'h-48 w-full rounded-xl'
      case 'list':
        return 'h-16 w-full rounded-lg'
      default:
        return ''
    }
  }

  const getStyles = () => {
    const styles: React.CSSProperties = {}
    if (width) styles.width = width
    if (height) styles.height = height
    return styles
  }

  const renderSkeleton = () => {
    return (
      <div 
        className={`${getBaseClasses()} ${getVariantClasses()} ${className}`}
        style={getStyles()}
        aria-hidden="true"
      />
    )
  }

  if (count === 1) {
    return renderSkeleton()
  }

  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </div>
  )
}