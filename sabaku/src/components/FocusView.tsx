'use client'

import type { Strip } from '@/types'
import { formatTimer, generateStripId, cn } from '@/lib/utils'
import { Pause, Play, CheckCircle2, ArrowLeft } from 'lucide-react'
import StripCard from './StripCard'

interface FocusViewProps {
  activeStrip: Strip | null
  queueStrips: Strip[]
  timerSeconds: number
  isTimerRunning: boolean
  onToggleTimer: () => void
  onDone: () => void
  onQueueBack: () => void
  onActivate: (stripId: string) => void
  onStripClick: (strip: Strip) => void
}

export default function FocusView({
  activeStrip,
  queueStrips,
  timerSeconds,
  isTimerRunning,
  onToggleTimer,
  onDone,
  onQueueBack,
  onActivate,
  onStripClick,
}: FocusViewProps) {
  if (!activeStrip) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-text-tertiary text-lg">Ready for takeoff</p>
        <p className="text-text-tertiary text-[13px]">
          Use <kbd className="px-1 py-0.5 bg-bg-secondary border border-border rounded text-[10px] font-mono">↑↓</kbd> to navigate ·{' '}
          <kbd className="px-1 py-0.5 bg-bg-secondary border border-border rounded text-[10px] font-mono">⏎</kbd> to focus
        </p>
        {queueStrips.length > 0 && (
          <div className="mt-6 w-full max-w-md space-y-1">
            <p className="text-[11px] text-text-tertiary px-1 mb-2">QUEUE</p>
            {queueStrips.slice(0, 5).map((strip) => (
              <QueuePreviewRow
                key={strip.id}
                strip={strip}
                onFocus={() => onActivate(strip.id)}
                onOpen={() => onStripClick(strip)}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 max-w-lg mx-auto px-4">
      {/* Strip ID + Priority */}
      <div className="flex items-center gap-3">
        <span className="font-mono text-text-tertiary text-[13px]">
          {generateStripId(activeStrip.position)}
        </span>
        <span className={cn(
          'text-[11px] px-2 py-0.5 font-mono',
          activeStrip.priority === 'urg' && 'bg-priority-urg/20 text-red-400 border border-red-500/30',
          activeStrip.priority === 'nrm' && 'bg-priority-nrm/20 text-green-400 border border-green-500/30',
          activeStrip.priority === 'low' && 'bg-priority-low/20 text-neutral-400 border border-neutral-500/30',
        )}>
          {activeStrip.priority.toUpperCase()}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-medium text-center leading-snug max-w-full break-words">
        {activeStrip.title}
      </h1>

      {/* Category + Source + Project */}
      <p className="text-[13px] text-text-secondary">
        {activeStrip.category}
        {activeStrip.project && <> · <span className="text-accent font-medium">{activeStrip.project}</span></>}
        {' · '}{activeStrip.source === 'vault' ? '🔗 Vault' : '✏️ Manual'}
      </p>

      {/* Timer */}
      <div className={cn(
        'font-mono text-5xl tabular-nums tracking-wider py-4',
        isTimerRunning ? 'text-timer-active animate-timer-pulse' : 'text-text-secondary',
      )}>
        {formatTimer(timerSeconds)}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleTimer}
          className={cn(
            'flex items-center gap-2 px-5 py-2.5 text-[14px] font-medium transition-colors rounded',
            isTimerRunning
              ? 'bg-timer-active/20 text-timer-active hover:bg-timer-active/30'
              : 'bg-accent/20 text-accent hover:bg-accent/30',
          )}
        >
          {isTimerRunning ? <Pause size={16} /> : <Play size={16} />}
          {isTimerRunning ? 'Pause' : 'Start'}
          <kbd className="text-[10px] opacity-70 font-mono ml-1">s</kbd>
        </button>

        <button
          onClick={onDone}
          className="flex items-center gap-2 px-5 py-2.5 text-[14px] font-medium bg-priority-nrm/20 text-green-400 hover:bg-priority-nrm/30 transition-colors rounded"
        >
          <CheckCircle2 size={16} />
          Done
          <kbd className="text-[10px] opacity-70 font-mono ml-1">d</kbd>
        </button>

        <button
          onClick={onQueueBack}
          className="flex items-center gap-2 px-5 py-2.5 text-[14px] font-medium bg-bg-tertiary text-text-secondary hover:text-text-primary transition-colors rounded"
        >
          <ArrowLeft size={16} />
          Queue
          <kbd className="text-[10px] opacity-70 font-mono ml-1">q</kbd>
        </button>
      </div>

      {/* Next in Queue */}
      {queueStrips.length > 0 && (
        <div className="w-full mt-8 border-t border-border pt-4">
          <p className="text-[11px] text-text-tertiary mb-2 px-1">Next in Queue</p>
          <p className="text-[10px] text-text-tertiary mb-2 px-1">Click to open · Hover and click Focus to start</p>
          <div className="space-y-1">
            {queueStrips.slice(0, 3).map((strip) => (
              <QueuePreviewRow
                key={strip.id}
                strip={strip}
                onFocus={() => onActivate(strip.id)}
                onOpen={() => onStripClick(strip)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function QueuePreviewRow({ strip, onFocus, onOpen }: { strip: Strip; onFocus: () => void; onOpen: () => void }) {
  return (
    <div className="group relative flex items-center gap-1 hover:bg-bg-tertiary rounded transition-colors">
      <button
        onClick={onOpen}
        className="flex-1 text-left min-w-0"
        aria-label={`Open details for ${strip.title}`}
      >
        <StripCard strip={strip} displayIndex={strip.position} compact />
      </button>
      <button
        onClick={onFocus}
        className="shrink-0 px-2 py-1 mr-2 text-[11px] font-mono text-accent opacity-0 group-hover:opacity-100 transition-opacity border border-accent/30 rounded hover:bg-accent/10 flex items-center gap-1"
        aria-label={`Focus ${strip.title}`}
        title="Focus this strip"
      >
        <Play size={10} />
        Focus
      </button>
    </div>
  )
}
