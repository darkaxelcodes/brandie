import { useEffect, useCallback } from 'react'

type KeyboardShortcutOptions = {
  altKey?: boolean
  ctrlKey?: boolean
  shiftKey?: boolean
  metaKey?: boolean
  enabled?: boolean
}

export const useKeyboardShortcut = (
  key: string,
  callback: () => void,
  options: KeyboardShortcutOptions = {}
) => {
  const {
    altKey = false,
    ctrlKey = false,
    shiftKey = false,
    metaKey = false,
    enabled = true
  } = options

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return
      
      // Check if event.key exists before calling toLowerCase
      if (!event.key) return
      
      // Check if the event matches all conditions
      if (
        event.key.toLowerCase() === key.toLowerCase() &&
        event.altKey === altKey &&
        event.ctrlKey === ctrlKey &&
        event.shiftKey === shiftKey &&
        event.metaKey === metaKey
      ) {
        // Prevent default behavior (like browser shortcuts)
        event.preventDefault()
        callback()
      }
    },
    [key, callback, altKey, ctrlKey, shiftKey, metaKey, enabled]
  )

  useEffect(() => {
    // Only attach the event listener if the shortcut is enabled
    if (enabled) {
      window.addEventListener('keydown', handleKeyDown)
    }

    // Clean up
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown, enabled])
}