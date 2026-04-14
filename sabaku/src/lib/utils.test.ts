import { describe, it, expect } from 'vitest'
import { formatTimer, generateStripId, cn } from './utils'

describe('formatTimer', () => {
  it('formats 0 seconds', () => {
    expect(formatTimer(0)).toBe('00:00:00')
  })

  it('formats seconds only', () => {
    expect(formatTimer(59)).toBe('00:00:59')
  })

  it('formats minutes and seconds', () => {
    expect(formatTimer(125)).toBe('00:02:05')
  })

  it('formats hours, minutes, seconds', () => {
    expect(formatTimer(3661)).toBe('01:01:01')
  })

  it('formats large values', () => {
    expect(formatTimer(86399)).toBe('23:59:59')
  })
})

describe('generateStripId', () => {
  it('pads to 4 digits', () => {
    expect(generateStripId(1)).toBe('FS-0001')
    expect(generateStripId(42)).toBe('FS-0042')
    expect(generateStripId(9999)).toBe('FS-9999')
  })

  it('handles 0', () => {
    expect(generateStripId(0)).toBe('FS-0000')
  })
})

describe('cn', () => {
  it('joins strings', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c')
  })

  it('filters falsy values', () => {
    expect(cn('a', false, 'b', null, undefined, 'c')).toBe('a b c')
  })

  it('returns empty for no truthy values', () => {
    expect(cn(false, null, undefined)).toBe('')
  })
})
