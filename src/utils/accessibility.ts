// Accessibility utility functions

// Check color contrast ratio for WCAG compliance
export const getContrastRatio = (foreground: string, background: string): number => {
  // Convert hex to RGB
  const hexToRgb = (hex: string): number[] => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return [r, g, b]
  }

  // Calculate relative luminance
  const getLuminance = (rgb: number[]): number => {
    const [r, g, b] = rgb.map(c => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }

  const rgb1 = hexToRgb(foreground)
  const rgb2 = hexToRgb(background)
  const l1 = getLuminance(rgb1)
  const l2 = getLuminance(rgb2)

  // Calculate contrast ratio
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
  return parseFloat(ratio.toFixed(2))
}

// Check if a contrast ratio meets WCAG standards
export const meetsWCAGStandards = (ratio: number, level: 'AA' | 'AAA' = 'AA', isLargeText: boolean = false): boolean => {
  if (level === 'AA') {
    return isLargeText ? ratio >= 3 : ratio >= 4.5
  } else {
    return isLargeText ? ratio >= 4.5 : ratio >= 7
  }
}

// Format a string for screen readers (e.g., abbreviations, special characters)
export const formatForScreenReader = (text: string): string => {
  // Replace common abbreviations
  const abbreviations: Record<string, string> = {
    'e.g.': 'for example',
    'i.e.': 'that is',
    'etc.': 'etcetera',
    'vs.': 'versus',
    'FAQ': 'frequently asked questions',
    'UI': 'user interface',
    'UX': 'user experience'
  }

  let formattedText = text
  
  // Replace abbreviations
  Object.entries(abbreviations).forEach(([abbr, full]) => {
    const regex = new RegExp(`\\b${abbr}\\b`, 'g')
    formattedText = formattedText.replace(regex, full)
  })
  
  return formattedText
}

// Generate an aria-label for an icon button
export const iconButtonLabel = (action: string, target?: string): string => {
  return target ? `${action} ${target}` : action
}

// Check if reduced motion is preferred
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Get appropriate motion settings based on user preference
export const getMotionProps = () => {
  const reducedMotion = prefersReducedMotion()
  
  return {
    transition: {
      duration: reducedMotion ? 0 : 0.3
    },
    // Disable animations for users who prefer reduced motion
    animate: reducedMotion ? {} : undefined
  }
}