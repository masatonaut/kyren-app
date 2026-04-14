import { describe, it, expect } from 'vitest'
import { shouldSync, recordSync } from '../src/lib/sync.js'

describe('sync history', () => {
  it('new file always needs sync', () => {
    expect(shouldSync('new-file.md', 'abc123')).toBe(true)
  })

  it('unchanged file is skipped', () => {
    recordSync('test.md', 'hash1')
    expect(shouldSync('test.md', 'hash1')).toBe(false)
  })

  it('changed file needs sync', () => {
    recordSync('test2.md', 'hash-old')
    expect(shouldSync('test2.md', 'hash-new')).toBe(true)
  })
})
