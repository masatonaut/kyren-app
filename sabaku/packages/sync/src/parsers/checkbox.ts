import type { ParsedStrip } from '../types.js'
import { extractHashtags, resolveProject } from '../lib/project.js'

type CheckboxFilter = 'unchecked' | 'checked' | 'all'

/**
 * Parse checkbox items from markdown.
 * - [ ] → unchecked (queue strip)
 * - [x] → checked (cleared strip)
 *
 * Only top-level checkboxes are extracted (no nested/indented).
 */
export function parseCheckboxes(markdown: string, filter: CheckboxFilter = 'all', filePath: string = ''): ParsedStrip[] {
  const strips: ParsedStrip[] = []
  const lines = markdown.split('\n')

  for (const line of lines) {
    const uncheckedMatch = line.match(/^[-*+]\s+\[ \]\s+(.+)$/)
    const checkedMatch = line.match(/^[-*+]\s+\[x\]\s+(.+)$/i)

    if (uncheckedMatch && (filter === 'unchecked' || filter === 'all')) {
      const { title, hashtags } = extractHashtags(uncheckedMatch[1])
      if (title) {
        strips.push({
          title,
          priority: 'nrm',
          category: 'handoff',
          source: 'vault',
          status: 'queue',
          project: resolveProject(hashtags, filePath),
        })
      }
    }

    if (checkedMatch && (filter === 'checked' || filter === 'all')) {
      const { title, hashtags } = extractHashtags(checkedMatch[1])
      if (title) {
        strips.push({
          title,
          priority: 'nrm',
          category: 'handoff',
          source: 'vault',
          status: 'cleared',
          project: resolveProject(hashtags, filePath),
        })
      }
    }
  }

  return strips
}
