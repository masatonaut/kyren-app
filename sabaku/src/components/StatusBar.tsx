'use client'

interface StatusBarProps {
  activeCount: number
  queueCount: number
  clearedCount: number
  selectedProject: string | null
}

export default function StatusBar({ activeCount, queueCount, clearedCount, selectedProject }: StatusBarProps) {
  return (
    <footer className="flex items-center justify-between px-4 py-2 border-t border-border text-[11px] text-text-tertiary bg-bg-primary">
      <div className="flex items-center gap-4">
        {selectedProject && (
          <span className="text-accent font-medium">{selectedProject}</span>
        )}
        <span>
          <span className="text-accent">{activeCount}</span> active
        </span>
        <span>
          <span className="text-text-secondary">{queueCount}</span> queue
        </span>
        <span>
          <span className="text-text-tertiary">{clearedCount}</span> cleared
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1">
          <kbd className="px-1 py-0.5 bg-bg-secondary border border-border rounded text-[10px] font-mono">p</kbd>
          project
        </span>
        <span className="flex items-center gap-1">
          <kbd className="px-1 py-0.5 bg-bg-secondary border border-border rounded text-[10px] font-mono">?</kbd>
          shortcuts
        </span>
      </div>
    </footer>
  )
}
