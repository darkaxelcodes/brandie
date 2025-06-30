// Responsive design utility functions

// Breakpoint values (matching Tailwind defaults)
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
}

// Check if the current viewport matches a breakpoint
export const isBreakpoint = (breakpoint: keyof typeof breakpoints): boolean => {
  if (typeof window === 'undefined') return false
  return window.innerWidth >= breakpoints[breakpoint]
}

// Get the current breakpoint
export const getCurrentBreakpoint = (): string => {
  if (typeof window === 'undefined') return 'sm'
  
  const width = window.innerWidth
  
  if (width >= breakpoints['2xl']) return '2xl'
  if (width >= breakpoints.xl) return 'xl'
  if (width >= breakpoints.lg) return 'lg'
  if (width >= breakpoints.md) return 'md'
  if (width >= breakpoints.sm) return 'sm'
  
  return 'xs'
}

// Get appropriate element size based on breakpoint
export const getResponsiveSize = (
  sizes: Record<string, number | string>
): number | string => {
  const currentBreakpoint = getCurrentBreakpoint()
  
  // Find the closest matching breakpoint
  const breakpointKeys = Object.keys(breakpoints)
  const currentIndex = breakpointKeys.indexOf(currentBreakpoint)
  
  // Look for exact match first
  if (sizes[currentBreakpoint] !== undefined) {
    return sizes[currentBreakpoint]
  }
  
  // Look for the closest smaller breakpoint
  for (let i = currentIndex - 1; i >= 0; i--) {
    const breakpoint = breakpointKeys[i]
    if (sizes[breakpoint] !== undefined) {
      return sizes[breakpoint]
    }
  }
  
  // Default to the smallest size or a reasonable default
  return sizes.xs || sizes.sm || sizes.default || 'auto'
}

// Generate responsive styles for an element
export const getResponsiveStyles = (
  property: string,
  values: Record<string, number | string>
): Record<string, string> => {
  const styles: Record<string, string> = {}
  
  Object.entries(values).forEach(([breakpoint, value]) => {
    if (breakpoint === 'default' || breakpoint === 'xs') {
      styles[property] = `${value}`
    } else {
      styles[`@media (min-width: ${breakpoints[breakpoint as keyof typeof breakpoints]}px)`] = {
        [property]: `${value}`
      } as any
    }
  })
  
  return styles
}

// Check if the device is touch-enabled
export const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined') return false
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

// Check if the device is a mobile device
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}