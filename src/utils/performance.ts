// Performance utility functions

// Debounce function to limit how often a function can be called
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: number | null = null
  
  return (...args: Parameters<T>) => {
    const later = () => {
      timeout = null
      func(...args)
    }
    
    if (timeout !== null) {
      clearTimeout(timeout)
    }
    
    timeout = window.setTimeout(later, wait)
  }
}

// Throttle function to limit the rate at which a function is executed
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean = false
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

// Memoize function results for performance
export const memoize = <T extends (...args: any[]) => any>(
  func: T
): ((...args: Parameters<T>) => ReturnType<T>) => {
  const cache = new Map()
  
  return (...args: Parameters<T>) => {
    const key = JSON.stringify(args)
    
    if (cache.has(key)) {
      return cache.get(key)
    }
    
    const result = func(...args)
    cache.set(key, result)
    return result
  }
}

// Measure function execution time
export const measureExecutionTime = <T extends (...args: any[]) => any>(
  func: T,
  label: string = 'Function execution time'
): ((...args: Parameters<T>) => ReturnType<T>) => {
  return (...args: Parameters<T>): ReturnType<T> => {
    const start = performance.now()
    const result = func(...args)
    const end = performance.now()
    
    console.log(`${label}: ${end - start}ms`)
    
    return result
  }
}

// Lazy load an image
export const lazyLoadImage = (
  src: string,
  onLoad?: () => void,
  onError?: (error: Error) => void
): HTMLImageElement => {
  const img = new Image()
  
  if (onLoad) {
    img.onload = onLoad
  }
  
  if (onError) {
    img.onerror = (e) => onError(new Error('Failed to load image'))
  }
  
  img.src = src
  return img
}

// Check if an element is in viewport
export const isInViewport = (element: HTMLElement, offset: number = 0): boolean => {
  const rect = element.getBoundingClientRect()
  
  return (
    rect.top >= 0 - offset &&
    rect.left >= 0 - offset &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth) + offset
  )
}