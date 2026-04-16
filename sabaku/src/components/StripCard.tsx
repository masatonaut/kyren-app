'use client'

import { memo } from 'react'
import type { Strip } from '@/types'
import { formatTimer, generateStripId, cn } from '@/lib/utils'
import { Timer, Link2, Pencil } from 'lucide-react'

interface StripCardProps {
  strip: Strip
  displayIndex: number
  isSelected?: boolean
  showTimer?: boolean
  compact?: boolean
}

const priorityStyles = {
  urg: {
    border: 'border-l-priority-urg',
    badge: 'bg-priority-urg/20 text-red-400 border border-red-500/30',
    label: 'URG',
  },
  nrm: {
    border: 'border-l-priority-nrm',
    badge: 'bg-priority-nrm/20 text-green-400 border border-green-500/30',
    label: 'NRM',
  },
  low: {
    border: 'border-l-priority-low',
    badge: 'bg-priority-low/20 text-neutral-400 border border-neutral-500/30',
    label: 'LOW',
  },
}

const categoryLabels: Record<string, string> = {
  'daily-top3': 'daily-top3',
  'handoff': 'handoff',
  'carryover': 'carryover',
  'manual': 'manual',
}

function StripCard({ strip, displayIndex, isSelected, showTimer, compact }: StripCardProps) {
  const priority = priorityStyles[strip.priority]
  const isCleared = strip.status === 'cleared'
  const isActive = strip.status === 'active'

  return (
    <div
      className={cn(
        'border-l-3 px-4 py-3 transition-all duration-150 animate-strip-enter',
        'border border-border select-none',
        isActive && `${priority.border} bg-bg-tertiary`,
        !isActive && !isCleared && 'border-l-transparent bg-bg-secondary hover:bg-bg-tertiary',
        isCleared && 'border-l-transparent bg-bg-secondary opacity-50',
        isSelected && 'ring-1 ring-accent/50',
        compact && 'py-2 px-3',
      )}
    >
      {/* Row 1: ID + Priority + Title + Timer */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="font-mono text-[11px] text-text-tertiary shrink-0">
          {generateStripId(displayIndex)}
        </span>

        <span className={cn('text-[10px] px-1.5 py-0.5 font-mono shrink-0', priority.badge)}>
          {priority.label}
        </span>

        <span className={cn(
          'text-[15px] truncate flex-1 min-w-0',
          isCleared && 'line-through text-text-tertiary',
        )} title={strip.title}>
          {strip.title}
        </span>

        {(showTimer || isActive) && strip.timer_seconds > 0 && (
          <span className={cn(
            'font-mono text-[13px] shrink-0 tabular-nums',
            isActive ? 'text-timer-active' : 'text-text-tertiary',
          )}>
            {formatTimer(strip.timer_seconds)}
          </span>
        )}

        {isActive && strip.timer_seconds === 0 && (
          <span className="font-mono text-[13px] text-text-tertiary shrink-0 tabular-nums">
            00:00:00
          </span>
        )}
      </div>

      {/* Row 2: Metadata */}
      {!compact && (
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[11px] text-text-tertiary">
            {categoryLabels[strip.category] ?? strip.category}
          </span>
          <span className="text-[11px] text-text-tertiary">·</span>
          {strip.project && (
            <>
              <span className="text-[11px] text-accent font-medium">
                {strip.project}
              </span>
              <span className="text-[11px] text-text-tertiary">·</span>
            </>
          )}
          {strip.source === 'vault' ? (
            <span className="flex items-center gap-0.5 text-[11px] text-source-vault">
              <Link2 size={10} />
              Vault
            </span>
          ) : (
            <span className="flex items-center gap-0.5 text-[11px] text-source-manual">
              <Pencil size={10} />
              Manual
            </span>
          )}
          {isCleared && strip.cleared_at && (
            <>
              <span className="text-[11px] text-text-tertiary">·</span>
              <span className="text-[11px] text-text-tertiary flex items-center gap-0.5">
                <Timer size={10} />
                {formatTimer(strip.timer_seconds)}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default memo(StripCard)
