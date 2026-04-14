'use client'

import type { ViewMode } from '@/types'
import { Plus, Settings, Keyboard } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HeaderProps {
  viewMode: ViewMode
  onViewChange: (mode: ViewMode) => void
  onNewStrip: () => void
  onShowHelp: () => void
}

export default function Header({ viewMode, onViewChange, onNewStrip, onShowHelp }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg-primary">
      {/* Logo */}
      <h1 className="text-[18px] font-bold tracking-tight font-sans">
        SABAKU
      </h1>

      {/* Center: View Tabs */}
      <div className="flex items-center gap-1 bg-bg-secondary rounded p-0.5">
        <button
          onClick={() => onViewChange('focus')}
          className={cn(
            'px-3 py-1 text-[13px] rounded transition-colors',
            viewMode === 'focus' ? 'bg-bg-tertiary text-text-primary' : 'text-text-tertiary hover:text-text-secondary',
          )}
        >
          Focus
        </button>
        <button
          onClick={() => onViewChange('kanban')}
          className={cn(
            'px-3 py-1 text-[13px] rounded transition-colors',
            viewMode === 'kanban' ? 'bg-bg-tertiary text-text-primary' : 'text-text-tertiary hover:text-text-secondary',
          )}
        >
          Kanban
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onShowHelp}
          className="p-2 text-text-tertiary hover:text-text-secondary transition-colors"
          title="Keyboard shortcuts (?)"
        >
          <Keyboard size={16} />
        </button>
        <button
          onClick={onNewStrip}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] bg-accent text-white rounded hover:bg-accent-hover transition-colors"
        >
          <Plus size={14} />
          New
        </button>
      </div>
    </header>
  )
}
