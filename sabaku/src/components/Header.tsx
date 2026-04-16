'use client'

import { useState, useRef, useEffect } from 'react'
import type { ViewMode } from '@/types'
import { Plus, Keyboard, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HeaderProps {
  viewMode: ViewMode
  onViewChange: (mode: ViewMode) => void
  onNewStrip: () => void
  onShowHelp: () => void
  projects: string[]
  selectedProject: string | null
  onProjectChange: (project: string | null) => void
}

export default function Header({ viewMode, onViewChange, onNewStrip, onShowHelp, projects, selectedProject, onProjectChange }: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [dropdownOpen])

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg-primary">
      {/* Logo */}
      <h1 className="text-[18px] font-bold tracking-tight font-sans">
        SABAKU
      </h1>

      {/* Center: View Tabs + Project Filter */}
      <div className="flex items-center gap-3">
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

        {/* Project Filter */}
        {projects.length > 0 && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={cn(
                'flex items-center gap-1 px-2.5 py-1 text-[12px] rounded border transition-colors',
                selectedProject
                  ? 'bg-accent/10 text-accent border-accent/30'
                  : 'bg-bg-secondary text-text-tertiary border-border hover:text-text-secondary',
              )}
            >
              {selectedProject ?? 'All'}
              <ChevronDown size={12} />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full mt-1 left-0 bg-bg-secondary border border-border rounded shadow-lg z-40 min-w-[120px] py-1 animate-fade-in">
                <button
                  onClick={() => { onProjectChange(null); setDropdownOpen(false) }}
                  className={cn(
                    'w-full text-left px-3 py-1.5 text-[12px] hover:bg-bg-tertiary transition-colors',
                    !selectedProject ? 'text-accent' : 'text-text-secondary',
                  )}
                >
                  All
                </button>
                {projects.map(p => (
                  <button
                    key={p}
                    onClick={() => { onProjectChange(p); setDropdownOpen(false) }}
                    className={cn(
                      'w-full text-left px-3 py-1.5 text-[12px] hover:bg-bg-tertiary transition-colors',
                      selectedProject === p ? 'text-accent' : 'text-text-secondary',
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onShowHelp}
          className="p-2 text-text-tertiary hover:text-text-secondary transition-colors"
          title="Keyboard shortcuts (?)"
          aria-label="Keyboard shortcuts"
        >
          <Keyboard size={16} />
        </button>
        <button
          onClick={onNewStrip}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] bg-accent text-white rounded hover:bg-accent-hover transition-colors"
          aria-label="Create new strip"
        >
          <Plus size={14} />
          New
        </button>
      </div>
    </header>
  )
}
