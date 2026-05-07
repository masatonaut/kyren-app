'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import type { ViewMode } from '@/types'
import { Plus, Keyboard, ChevronDown, BarChart3, Download, Settings, User as UserIcon, LogOut, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { useSubscription } from '@/hooks/useSubscription'

interface HeaderProps {
  viewMode: ViewMode
  onViewChange: (mode: ViewMode) => void
  onNewStrip: () => void
  onShowHelp: () => void
  onExport: () => void
  onShowStats: () => void
  projects: string[]
  selectedProject: string | null
  onProjectChange: (project: string | null) => void
}

export default function Header({
  viewMode,
  onViewChange,
  onNewStrip,
  onShowHelp,
  onExport,
  onShowStats,
  projects,
  selectedProject,
  onProjectChange,
}: HeaderProps) {
  const [projectDropdown, setProjectDropdown] = useState(false)
  const [settingsDropdown, setSettingsDropdown] = useState(false)
  const [userDropdown, setUserDropdown] = useState(false)
  const projectRef = useRef<HTMLDivElement>(null)
  const settingsRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)

  const { user, isConfigured: authConfigured, signOut } = useAuth()
  const { isPro } = useSubscription(user)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (projectRef.current && !projectRef.current.contains(e.target as Node)) setProjectDropdown(false)
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) setSettingsDropdown(false)
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserDropdown(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg-primary">
      <div className="flex items-center gap-2">
        <h1 className="text-[18px] font-bold tracking-tight font-sans">SABAKU</h1>
        {isPro && (
          <span className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-accent/10 text-accent border border-accent/30 rounded">
            <Sparkles size={10} />
            Pro
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 bg-bg-secondary rounded p-0.5">
          <button
            onClick={() => onViewChange('focus')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1 text-[13px] rounded transition-colors',
              viewMode === 'focus' ? 'bg-bg-tertiary text-text-primary' : 'text-text-tertiary hover:text-text-secondary',
            )}
          >
            Focus
            <kbd className="text-[10px] text-text-tertiary font-mono">1</kbd>
          </button>
          <button
            onClick={() => onViewChange('kanban')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1 text-[13px] rounded transition-colors',
              viewMode === 'kanban' ? 'bg-bg-tertiary text-text-primary' : 'text-text-tertiary hover:text-text-secondary',
            )}
          >
            Kanban
            <kbd className="text-[10px] text-text-tertiary font-mono">2</kbd>
          </button>
        </div>

        {projects.length > 0 && (
          <div className="relative" ref={projectRef}>
            <button
              onClick={() => setProjectDropdown(!projectDropdown)}
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

            {projectDropdown && (
              <div className="absolute top-full mt-1 left-0 bg-bg-secondary border border-border rounded shadow-lg z-40 min-w-[120px] py-1 animate-fade-in">
                <button
                  onClick={() => { onProjectChange(null); setProjectDropdown(false) }}
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
                    onClick={() => { onProjectChange(p); setProjectDropdown(false) }}
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

      <div className="flex items-center gap-1">
        <button
          onClick={onShowStats}
          className="p-2 text-text-tertiary hover:text-text-secondary transition-colors"
          title="Stats"
          aria-label="Show stats"
        >
          <BarChart3 size={16} />
        </button>
        <button
          onClick={onShowHelp}
          className="p-2 text-text-tertiary hover:text-text-secondary transition-colors"
          title="Keyboard shortcuts (?)"
          aria-label="Keyboard shortcuts"
        >
          <Keyboard size={16} />
        </button>

        <div className="relative" ref={settingsRef}>
          <button
            onClick={() => setSettingsDropdown(!settingsDropdown)}
            className="p-2 text-text-tertiary hover:text-text-secondary transition-colors"
            title="Settings"
            aria-label="Settings menu"
          >
            <Settings size={16} />
          </button>
          {settingsDropdown && (
            <div className="absolute top-full right-0 mt-1 bg-bg-secondary border border-border rounded shadow-lg z-40 min-w-[180px] py-1 animate-fade-in">
              <button
                onClick={() => { onExport(); setSettingsDropdown(false) }}
                className="w-full text-left px-3 py-2 text-[12px] text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors flex items-center gap-2"
              >
                <Download size={12} />
                Export to JSON
              </button>
              <Link
                href="/pricing"
                onClick={() => setSettingsDropdown(false)}
                className="w-full text-left px-3 py-2 text-[12px] text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors block"
              >
                Pricing
              </Link>
              <a
                href="https://github.com/masatonaut/kyren-app/tree/main/sabaku"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setSettingsDropdown(false)}
                className="w-full text-left px-3 py-2 text-[12px] text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors block"
              >
                GitHub
              </a>
            </div>
          )}
        </div>

        {/* User menu */}
        {authConfigured && (
          <div className="relative" ref={userRef}>
            {user ? (
              <>
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="p-2 text-text-tertiary hover:text-text-secondary transition-colors"
                  title={user.email ?? 'Account'}
                  aria-label="Account menu"
                >
                  <UserIcon size={16} />
                </button>
                {userDropdown && (
                  <div className="absolute top-full right-0 mt-1 bg-bg-secondary border border-border rounded shadow-lg z-40 min-w-[200px] py-1 animate-fade-in">
                    <div className="px-3 py-2 border-b border-border">
                      <p className="text-[11px] text-text-tertiary truncate">Signed in as</p>
                      <p className="text-[12px] text-text-primary truncate">{user.email}</p>
                    </div>
                    {!isPro && (
                      <Link
                        href="/pricing"
                        onClick={() => setUserDropdown(false)}
                        className="w-full text-left px-3 py-2 text-[12px] text-accent hover:bg-bg-tertiary transition-colors flex items-center gap-2"
                      >
                        <Sparkles size={12} />
                        Upgrade to Pro
                      </Link>
                    )}
                    <Link
                      href="/activate"
                      onClick={() => setUserDropdown(false)}
                      className="w-full text-left px-3 py-2 text-[12px] text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors block"
                    >
                      Activate license
                    </Link>
                    <button
                      onClick={() => { void signOut(); setUserDropdown(false) }}
                      className="w-full text-left px-3 py-2 text-[12px] text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors flex items-center gap-2"
                    >
                      <LogOut size={12} />
                      Sign out
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link
                href="/login"
                className="px-2.5 py-1 text-[12px] text-text-secondary hover:text-text-primary border border-border rounded transition-colors"
              >
                Sign in
              </Link>
            )}
          </div>
        )}

        <button
          onClick={onNewStrip}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] bg-accent text-white rounded hover:bg-accent-hover transition-colors ml-1"
          aria-label="Create new strip"
        >
          <Plus size={14} />
          New
          <kbd className="text-[10px] opacity-70 font-mono">n</kbd>
        </button>
      </div>
    </header>
  )
}
