import { useState, useEffect } from 'react'

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    
    // Update the state with the current value
    const updateMatches = () => {
      setMatches(media.matches)
    }
    
    // Set the initial value
    updateMatches()
    
    // Add the listener
    media.addEventListener('change', updateMatches)
    
    // Remove the listener on cleanup
    return () => {
      media.removeEventListener('change', updateMatches)
    }
  }, [query])

  return matches
}