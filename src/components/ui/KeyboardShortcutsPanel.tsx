import React from 'react'
import { motion } from 'framer-motion'
import { Keyboard, X } from 'lucide-react'
import { Card } from './Card'
import { formatKeyboardShortcut } from '../../utils/keyboard'

interface KeyboardShortcutsPanelProps {
  isOpen: boolean
  onClose: () => void
}

export const KeyboardShortcutsPanel: React.FC<KeyboardShortcutsPanelProps> = ({
  isOpen,
  onClose
}) => {
  const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform)
  
  const shortcuts = [
    { 
      category: 'Navigation',
      items: [
        { action: 'Go to Dashboard', keys: formatKeyboardShortcut('d', { meta: isMac, ctrl: !isMac }) },
        { action: 'Go to Brand Strategy', keys: formatKeyboardShortcut('s', { meta: isMac, ctrl: !isMac, shift: true }) },
        { action: 'Go to Visual Identity', keys: formatKeyboardShortcut('v', { meta: isMac, ctrl: !isMac, shift: true }) },
        { action: 'Go to Brand Voice', keys: formatKeyboardShortcut('b', { meta: isMac, ctrl: !isMac, shift: true }) },
        { action: 'Go to Guidelines', keys: formatKeyboardShortcut('g', { meta: isMac, ctrl: !isMac, shift: true }) }
      ]
    },
    {
      category: 'Actions',
      items: [
        { action: 'Save Progress', keys: formatKeyboardShortcut('s', { meta: isMac, ctrl: !isMac }) },
        { action: 'Create New Brand', keys: formatKeyboardShortcut('n', { meta: isMac, ctrl: !isMac }) },
        { action: 'Generate with AI', keys: formatKeyboardShortcut('g', { meta: isMac, ctrl: !isMac }) },
        { action: 'Export', keys: formatKeyboardShortcut('e', { meta: isMac, ctrl: !isMac }) }
      ]
    },
    {
      category: 'UI',
      items: [
        { action: 'Toggle Keyboard Shortcuts', keys: formatKeyboardShortcut('/', { shift: true }) },
        { action: 'Toggle Dark Mode', keys: formatKeyboardShortcut('d', { meta: isMac, ctrl: !isMac, alt: true }) },
        { action: 'Close Modal/Panel', keys: 'Escape' },
        { action: 'Search', keys: formatKeyboardShortcut('k', { meta: isMac, ctrl: !isMac }) }
      ]
    }
  ]

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-x-0 bottom-0 z-50 p-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:p-0 sm:max-w-lg w-full"
      >
        <Card className="p-6 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                <Keyboard className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Keyboard Shortcuts</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <div className="space-y-6">
            {shortcuts.map((category) => (
              <div key={category.category}>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                  {category.category}
                </h3>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  {category.items.map((shortcut, index) => (
                    <div 
                      key={shortcut.action}
                      className={`flex items-center justify-between p-3 ${
                        index !== category.items.length - 1 ? 'border-b border-gray-200' : ''
                      }`}
                    >
                      <span className="text-gray-700">{shortcut.action}</span>
                      <kbd className="px-3 py-1 bg-gray-100 border border-gray-300 rounded text-sm font-mono">
                        {shortcut.keys}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
            Press <kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs font-mono">Shift + /</kbd> anytime to show this panel
          </div>
        </Card>
      </motion.div>
    </>
  )
}