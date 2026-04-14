'use client'

import { useEffect, useCallback } from 'react'

interface ShortcutHandlers {
  onNew: () => void
  onToggleTimer: () => void
  onDone: () => void
  onQueueBack: () => void
  onNavigateUp: () => void
  onNavigateDown: () => void
  onActivate: () => void
  onClose: () => void
  onViewFocus: () => void
  onViewKanban: () => void
  onHelp: () => void
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in inputs
    const target = e.target as HTMLElement
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return

    switch (e.key) {
      case 'n':
        e.preventDefault()
        handlers.onNew()
        break
      case 's':
        e.preventDefault()
        handlers.onToggleTimer()
        break
      case 'd':
        e.preventDefault()
        handlers.onDone()
        break
      case 'q':
        e.preventDefault()
        handlers.onQueueBack()
        break
      case 'ArrowUp':
        e.preventDefault()
        handlers.onNavigateUp()
        break
      case 'ArrowDown':
        e.preventDefault()
        handlers.onNavigateDown()
        break
      case 'Enter':
        e.preventDefault()
        handlers.onActivate()
        break
      case 'Escape':
        e.preventDefault()
        handlers.onClose()
        break
      case '1':
        e.preventDefault()
        handlers.onViewFocus()
        break
      case '2':
        e.preventDefault()
        handlers.onViewKanban()
        break
      case '?':
        e.preventDefault()
        handlers.onHelp()
        break
    }
  }, [handlers])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}
