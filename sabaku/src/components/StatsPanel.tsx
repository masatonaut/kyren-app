'use client'

import { useMemo } from 'react'
import type { Strip } from '@/types'
import { formatTimer } from '@/lib/utils'
import { X } from 'lucide-react'

interface StatsPanelProps {
  isOpen: boolean
  onClose: () => void
  strips: Strip[]
}

function startOfDay(d: Date): number {
  const copy = new Date(d)
  copy.setHours(0, 0, 0, 0)
  return copy.getTime()
}

function startOfWeek(d: Date): number {
  const copy = new Date(d)
  const day = copy.getDay()
  copy.setDate(copy.getDate() - day)
  copy.setHours(0, 0, 0, 0)
  return copy.getTime()
}

export default function StatsPanel({ isOpen, onClose, strips }: StatsPanelProps) {
  const stats = useMemo(() => {
    const now = Date.now()
    const todayStart = startOfDay(new Date())
    const weekStart = startOfWeek(new Date())

    const inRange = (strip: Strip, from: number) => {
      if (!strip.cleared_at) return false
      return new Date(strip.cleared_at).getTime() >= from
    }

    const today = strips.filter(s => inRange(s, todayStart))
    const week = strips.filter(s => inRange(s, weekStart))
    const all = strips.filter(s => s.status === 'cleared')

    const sumTime = (arr: Strip[]) => arr.reduce((acc, s) => acc + s.timer_seconds, 0)

    // By project
    const byProject = strips
      .filter(s => s.status === 'cleared' && s.project)
      .reduce<Record<string, { count: number; seconds: number }>>((acc, s) => {
        const key = s.project!
        if (!acc[key]) acc[key] = { count: 0, seconds: 0 }
        acc[key].count++
        acc[key].seconds += s.timer_seconds
        return acc
      }, {})

    const topProjects = Object.entries(byProject)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, 5)

    return {
      today: { count: today.length, seconds: sumTime(today) },
      week: { count: week.length, seconds: sumTime(week) },
      all: { count: all.length, seconds: sumTime(all) },
      topProjects,
    }
  }, [strips])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-40" role="dialog" aria-modal="true" aria-labelledby="stats-title">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <aside className="absolute right-0 top-0 bottom-0 w-full max-w-xs bg-bg-secondary border-l border-border shadow-2xl p-5 overflow-y-auto animate-fade-in">
        <div className="flex items-center justify-between mb-5">
          <h2 id="stats-title" className="text-[15px] font-medium">Stats</h2>
          <button onClick={onClose} className="text-text-tertiary hover:text-text-primary transition-colors" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <Metric label="Today" count={stats.today.count} seconds={stats.today.seconds} />
        <Metric label="This week" count={stats.week.count} seconds={stats.week.seconds} />
        <Metric label="All time" count={stats.all.count} seconds={stats.all.seconds} />

        {stats.topProjects.length > 0 && (
          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-[11px] text-text-tertiary uppercase tracking-wider mb-3">By Project</p>
            <div className="space-y-2">
              {stats.topProjects.map(([name, p]) => (
                <div key={name} className="flex items-center justify-between">
                  <span className="text-[13px] text-accent font-medium">{name}</span>
                  <span className="text-[12px] text-text-tertiary font-mono tabular-nums">
                    {p.count} · {formatTimer(p.seconds)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="mt-8 text-[11px] text-text-tertiary leading-relaxed">
          Completed strips and tracked time, aggregated from your local data. Cloud sync with cross-device stats is coming in Pro.
        </p>
      </aside>
    </div>
  )
}

function Metric({ label, count, seconds }: { label: string; count: number; seconds: number }) {
  return (
    <div className="mb-4">
      <p className="text-[11px] text-text-tertiary uppercase tracking-wider mb-1">{label}</p>
      <div className="flex items-baseline gap-3">
        <span className="text-2xl font-medium font-mono tabular-nums">{count}</span>
        <span className="text-[11px] text-text-tertiary">cleared</span>
        <span className="text-[13px] text-timer-active font-mono tabular-nums ml-auto">
          {formatTimer(seconds)}
        </span>
      </div>
    </div>
  )
}
