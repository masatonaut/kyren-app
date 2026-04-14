import { describe, it, expect } from 'vitest'
import { computeHash } from '../src/lib/hash.js'

describe('computeHash', () => {
  it('returns consistent hash for same content', () => {
    const h1 = computeHash('hello world')
    const h2 = computeHash('hello world')
    expect(h1).toBe(h2)
  })

  it('returns different hash for different content', () => {
    const h1 = computeHash('content A')
    const h2 = computeHash('content B')
    expect(h1).not.toBe(h2)
  })

  it('returns 64 char hex string (SHA-256)', () => {
    const h = computeHash('test')
    expect(h).toMatch(/^[a-f0-9]{64}$/)
  })
})
