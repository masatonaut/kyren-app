import type { SyncConfig, SyncResult, SyncStats } from '../types.js'
import { scanVault } from './scanner.js'

/** In-memory sync history for local mode (no Supabase) */
const syncHistory = new Map<string, string>() // filePath → hash

/**
 * Check if a file needs syncing by comparing hashes.
 */
export function shouldSync(filePath: string, newHash: string): boolean {
  const existingHash = syncHistory.get(filePath)
  return existingHash !== newHash
}

/**
 * Record a sync operation.
 */
export function recordSync(filePath: string, hash: string): void {
  syncHistory.set(filePath, hash)
}

/**
 * Run a full sync scan. Returns results and stats.
 * In dry-run mode, does not update sync history.
 */
export function runSync(config: SyncConfig, options: { dryRun?: boolean } = {}): {
  results: SyncResult[]
  stats: SyncStats
} {
  const allResults = scanVault(config)
  const stats: SyncStats = {
    filesScanned: allResults.length,
    stripsCreated: 0,
    stripsUpdated: 0,
    skipped: 0,
  }

  const changedResults: SyncResult[] = []

  for (const result of allResults) {
    if (shouldSync(result.filePath, result.hash)) {
      changedResults.push(result)
      stats.stripsCreated += result.strips.length

      if (!options.dryRun) {
        recordSync(result.filePath, result.hash)
      }
    } else {
      stats.skipped++
    }
  }

  return { results: changedResults, stats }
}

/**
 * Get current sync status.
 */
export function getSyncStatus(): { trackedFiles: number; entries: Array<{ filePath: string; hash: string }> } {
  const entries = Array.from(syncHistory.entries()).map(([filePath, hash]) => ({
    filePath,
    hash: hash.slice(0, 12) + '...',
  }))
  return { trackedFiles: syncHistory.size, entries }
}
