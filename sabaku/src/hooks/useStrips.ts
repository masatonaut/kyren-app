'use client'

import { useState, useCallback } from 'react'
import type { Strip, StripStatus, StripPriority, StripCategory } from '@/types'

let stripCounter = 0

function createStrip(
  title: string,
  priority: StripPriority = 'nrm',
  category: StripCategory = 'manual',
  source: 'vault' | 'manual' = 'manual',
  vaultRef: string | null = null
): Strip {
  stripCounter++
  return {
    id: crypto.randomUUID(),
    user_id: 'local',
    title,
    status: 'queue',
    priority,
    category,
    source,
    vault_ref: vaultRef,
    timer_seconds: 0,
    position: stripCounter,
    created_at: new Date().toISOString(),
    cleared_at: null,
    updated_at: new Date().toISOString(),
  }
}

// Demo strips for development
function getDemoStrips(): Strip[] {
  const demos: Array<{ title: string; priority: StripPriority; category: StripCategory; source: 'vault' | 'manual' }> = [
    { title: 'KASHITE Resend API 設定', priority: 'urg', category: 'daily-top3', source: 'vault' },
    { title: 'Upwork proposal 送信', priority: 'urg', category: 'daily-top3', source: 'vault' },
    { title: 'NeetCode DP問題 1問', priority: 'urg', category: 'daily-top3', source: 'vault' },
    { title: 'Phrasely Vercel deploy', priority: 'nrm', category: 'handoff', source: 'vault' },
    { title: 'Eagle Eye DIFF 適用', priority: 'nrm', category: 'handoff', source: 'vault' },
    { title: 'X 告知文ドラフト', priority: 'low', category: 'manual', source: 'manual' },
  ]
  return demos.map(d => createStrip(d.title, d.priority, d.category, d.source))
}

export function useStrips() {
  const [strips, setStrips] = useState<Strip[]>(getDemoStrips)

  const activeStrip = strips.find(s => s.status === 'active') ?? null
  const queueStrips = strips
    .filter(s => s.status === 'queue')
    .sort((a, b) => a.position - b.position)
  const clearedStrips = strips
    .filter(s => s.status === 'cleared')
    .sort((a, b) => {
      const aTime = a.cleared_at ?? a.updated_at
      const bTime = b.cleared_at ?? b.updated_at
      return new Date(bTime).getTime() - new Date(aTime).getTime()
    })

  const addStrip = useCallback((title: string, priority: StripPriority, category: StripCategory) => {
    setStrips(prev => [...prev, createStrip(title, priority, category)])
  }, [])

  const moveStrip = useCallback((stripId: string, newStatus: StripStatus) => {
    setStrips(prev => {
      // If moving to active, deactivate current active first
      let updated = prev
      if (newStatus === 'active') {
        updated = updated.map(s =>
          s.status === 'active' ? { ...s, status: 'queue' as StripStatus, updated_at: new Date().toISOString() } : s
        )
      }
      return updated.map(s => {
        if (s.id !== stripId) return s
        return {
          ...s,
          status: newStatus,
          cleared_at: newStatus === 'cleared' ? new Date().toISOString() : s.cleared_at,
          updated_at: new Date().toISOString(),
        }
      })
    })
  }, [])

  const updateTimer = useCallback((stripId: string, seconds: number) => {
    setStrips(prev =>
      prev.map(s =>
        s.id === stripId ? { ...s, timer_seconds: seconds, updated_at: new Date().toISOString() } : s
      )
    )
  }, [])

  const reorderQueue = useCallback((startIndex: number, endIndex: number) => {
    setStrips(prev => {
      const queue = prev.filter(s => s.status === 'queue').sort((a, b) => a.position - b.position)
      const [moved] = queue.splice(startIndex, 1)
      queue.splice(endIndex, 0, moved)
      const reordered = queue.map((s, i) => ({ ...s, position: i }))
      const queueIds = new Set(reordered.map(s => s.id))
      return prev.map(s => queueIds.has(s.id) ? reordered.find(r => r.id === s.id)! : s)
    })
  }, [])

  return {
    strips,
    activeStrip,
    queueStrips,
    clearedStrips,
    addStrip,
    moveStrip,
    updateTimer,
    reorderQueue,
  }
}
