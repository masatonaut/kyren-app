export type StripPriority = 'urg' | 'nrm' | 'low'
export type StripCategory = 'daily-top3' | 'handoff' | 'carryover' | 'manual'
export type StripSource = 'vault' | 'manual'

export interface ParsedStrip {
  title: string
  priority: StripPriority
  category: StripCategory
  source: 'vault'
  status: 'queue' | 'cleared'
  project: string | null
}

export interface SyncConfig {
  vaultPath: string
  watchPaths: string[]
  supabaseUrl: string
  supabaseKey: string
  parseRules: {
    top3: boolean
    checkboxUnchecked: boolean
    checkboxChecked: boolean
    todoSection: boolean
  }
}

export interface SyncResult {
  filePath: string
  strips: ParsedStrip[]
  hash: string
}

export interface SyncStats {
  filesScanned: number
  stripsCreated: number
  stripsUpdated: number
  skipped: number
}
