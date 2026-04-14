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
}

const priorityBorderColor = {
  urg: 'border-priority-urg',
  nrm: 'border-priority-nrm',
  low: 'border-priority-low',
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
}: FocusViewProps) {
  if (!activeStrip) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-text-tertiary text-lg">管制塔スタンバイ</p>
        <p className="text-text-tertiary text-[13px]">
          ↑↓ で QUEUE から選んで Enter で開始
        </p>
        {queueStrips.length > 0 && (
          <div className="mt-6 w-full max-w-md space-y-1">
            <p className="text-[11px] text-text-tertiary px-1 mb-2">QUEUE</p>
            {queueStrips.slice(0, 5).map((strip, i) => (
              <button
                key={strip.id}
                onClick={() => onActivate(strip.id)}
                className="w-full text-left hover:bg-bg-tertiary rounded transition-colors"
              >
                <StripCard strip={strip} displayIndex={strip.position} compact />
              </button>
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
      <h1 className="text-2xl font-medium text-center leading-snug">
        {activeStrip.title}
      </h1>

      {/* Category + Source */}
      <p className="text-[13px] text-text-secondary">
        {activeStrip.category} · {activeStrip.source === 'vault' ? '🔗 Vault' : '✏️ Manual'}
      </p>

      {/* Timer */}
      <div className={cn(
        'font-mono text-5xl tabular-nums tracking-wider py-4',
        isTimerRunning ? 'text-timer-active animate-timer-pulse' : 'text-text-secondary',
      )}>
        {formatTimer(timerSeconds)}
      </div>

      {/* Action Buttons */}
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
        </button>

        <button
          onClick={onDone}
          className="flex items-center gap-2 px-5 py-2.5 text-[14px] font-medium bg-priority-nrm/20 text-green-400 hover:bg-priority-nrm/30 transition-colors rounded"
        >
          <CheckCircle2 size={16} />
          Done
        </button>

        <button
          onClick={onQueueBack}
          className="flex items-center gap-2 px-5 py-2.5 text-[14px] font-medium bg-bg-tertiary text-text-secondary hover:text-text-primary transition-colors rounded"
        >
          <ArrowLeft size={16} />
          Queue
        </button>
      </div>

      {/* Next in Queue */}
      {queueStrips.length > 0 && (
        <div className="w-full mt-8 border-t border-border pt-4">
          <p className="text-[11px] text-text-tertiary mb-2 px-1">Next in Queue</p>
          <div className="space-y-1">
            {queueStrips.slice(0, 3).map((strip) => (
              <button
                key={strip.id}
                onClick={() => onActivate(strip.id)}
                className="w-full text-left hover:bg-bg-tertiary rounded transition-colors"
              >
                <StripCard strip={strip} displayIndex={strip.position} compact />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
