import { createHash } from 'node:crypto'

/** Compute SHA-256 hash of file content */
export function computeHash(content: string): string {
  return createHash('sha256').update(content, 'utf-8').digest('hex')
}
