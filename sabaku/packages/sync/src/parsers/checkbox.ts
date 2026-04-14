import type { ParsedStrip } from '../types.js'

type CheckboxFilter = 'unchecked' | 'checked' | 'all'

/**
 * Parse checkbox items from markdown.
 * - [ ] → unchecked (queue strip)
 * - [x] → checked (cleared strip)
 *
 * Only top-level checkboxes are extracted (no nested/indented).
 */
export function parseCheckboxes(markdown: string, filter: CheckboxFilter = 'all'): ParsedStrip[] {
  const strips: ParsedStrip[] = []
  const lines = markdown.split('\n')

  for (const line of lines) {
    // Match top-level checkboxes only (no leading whitespace beyond standard list indent)
    const uncheckedMatch = line.match(/^[-*+]\s+\[ \]\s+(.+)$/)
    const checkedMatch = line.match(/^[-*+]\s+\[x\]\s+(.+)$/i)

    if (uncheckedMatch && (filter === 'unchecked' || filter === 'all')) {
      const title = cleanTitle(uncheckedMatch[1])
      if (title) {
        strips.push({
          title,
          priority: 'nrm',
          category: 'handoff',
          source: 'vault',
          status: 'queue',
        })
      }
    }

    if (checkedMatch && (filter === 'checked' || filter === 'all')) {
      const title = cleanTitle(checkedMatch[1])
      if (title) {
        strips.push({
          title,
          priority: 'nrm',
          category: 'handoff',
          source: 'vault',
          status: 'cleared',
        })
      }
    }
  }

  return strips
}

/** Remove metadata tags from title */
function cleanTitle(raw: string): string {
  return raw
    .replace(/#[a-zA-Z]\w*/g, '')   // hashtags (must start with letter)
    .replace(/📅\s*\d{4}-\d{2}-\d{2}/g, '')
    .replace(/⏳[SML]/g, '')
    .replace(/\[WM:[高中低]\]/g, '')
    .replace(/⏫/g, '')
    .replace(/\*\*/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}
