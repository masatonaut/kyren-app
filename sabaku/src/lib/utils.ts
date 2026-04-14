import type { StripPriority } from '@/types'

export function formatTimer(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function generateStripId(index: number): string {
  return `FS-${String(index).padStart(4, '0')}`
}

export function priorityColor(priority: StripPriority): string {
  switch (priority) {
    case 'urg': return 'var(--priority-urg)'
    case 'nrm': return 'var(--priority-nrm)'
    case 'low': return 'var(--priority-low)'
  }
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}
