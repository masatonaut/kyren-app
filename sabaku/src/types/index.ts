export type StripStatus = 'active' | 'queue' | 'cleared'
export type StripPriority = 'urg' | 'nrm' | 'low'
export type StripCategory = 'daily-top3' | 'handoff' | 'carryover' | 'manual'
export type StripSource = 'vault' | 'manual'

export interface Strip {
  id: string
  user_id: string
  title: string
  status: StripStatus
  priority: StripPriority
  category: StripCategory
  source: StripSource
  vault_ref: string | null
  timer_seconds: number
  position: number
  created_at: string
  cleared_at: string | null
  updated_at: string
}

export interface TimeLog {
  id: string
  strip_id: string
  started_at: string
  ended_at: string | null
  duration_seconds: number
  created_at: string
}

export interface SyncHistory {
  id: string
  user_id: string
  file_path: string
  file_hash: string
  synced_at: string
  strips_created: number
  strips_updated: number
}

export type ViewMode = 'kanban' | 'focus'
