'use client'

interface StatusBarProps {
  activeCount: number
  queueCount: number
  clearedCount: number
}

export default function StatusBar({ activeCount, queueCount, clearedCount }: StatusBarProps) {
  return (
    <footer className="flex items-center justify-between px-4 py-2 border-t border-border text-[11px] text-text-tertiary bg-bg-primary">
      <div className="flex items-center gap-4">
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
      <div className="flex items-center gap-2">
        <kbd className="px-1 py-0.5 bg-bg-secondary border border-border rounded text-[10px] font-mono">?</kbd>
        <span>shortcuts</span>
      </div>
    </footer>
  )
}
