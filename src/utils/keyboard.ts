// Keyboard utility functions

// Key codes for common keys
export const KeyCodes = {
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  SPACE: ' ',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
  PAGE_UP: 'PageUp',
  PAGE_DOWN: 'PageDown'
}

// Check if a key event is a navigation key
export const isNavigationKey = (event: KeyboardEvent): boolean => {
  return [
    KeyCodes.ARROW_UP,
    KeyCodes.ARROW_DOWN,
    KeyCodes.ARROW_LEFT,
    KeyCodes.ARROW_RIGHT,
    KeyCodes.HOME,
    KeyCodes.END,
    KeyCodes.PAGE_UP,
    KeyCodes.PAGE_DOWN
  ].includes(event.key)
}

// Check if a key event is an action key
export const isActionKey = (event: KeyboardEvent): boolean => {
  return [
    KeyCodes.ENTER,
    KeyCodes.SPACE
  ].includes(event.key)
}

// Check if a key event is a modifier key
export const isModifierKey = (event: KeyboardEvent): boolean => {
  return event.altKey || event.ctrlKey || event.metaKey || event.shiftKey
}

// Format keyboard shortcut for display
export const formatKeyboardShortcut = (
  key: string,
  options: { 
    alt?: boolean; 
    ctrl?: boolean; 
    shift?: boolean; 
    meta?: boolean 
  } = {}
): string => {
  const { alt = false, ctrl = false, shift = false, meta = false } = options
  
  const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform)
  
  const parts: string[] = []
  
  if (ctrl) parts.push(isMac ? '⌃' : 'Ctrl')
  if (alt) parts.push(isMac ? '⌥' : 'Alt')
  if (shift) parts.push(isMac ? '⇧' : 'Shift')
  if (meta) parts.push(isMac ? '⌘' : 'Win')
  
  // Format the key
  let formattedKey = key
  if (key === ' ') formattedKey = 'Space'
  else if (key.length === 1) formattedKey = key.toUpperCase()
  
  parts.push(formattedKey)
  
  return parts.join(isMac ? '' : '+')
}

// Get keyboard shortcuts help text
export const getKeyboardShortcuts = (): Record<string, string> => {
  const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform)
  
  return {
    'Save': formatKeyboardShortcut('s', { meta: isMac, ctrl: !isMac }),
    'New Brand': formatKeyboardShortcut('n', { meta: isMac, ctrl: !isMac }),
    'Dashboard': formatKeyboardShortcut('d', { meta: isMac, ctrl: !isMac }),
    'Help': formatKeyboardShortcut('?'),
    'Search': formatKeyboardShortcut('k', { meta: isMac, ctrl: !isMac }),
    'Close Modal': KeyCodes.ESCAPE
  }
}