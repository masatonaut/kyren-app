import type { ParsedStrip } from '../types.js'
import { parseCheckboxes } from './checkbox.js'

/**
 * Parse the "## 📝 TODO" section from daily notes.
 * Extracts checkboxes within this section only.
 * Unchecked → carryover strips, Checked → cleared strips.
 */
export function parseTodoSection(markdown: string): {
  unchecked: ParsedStrip[]
  checked: ParsedStrip[]
} {
  // Find the TODO section heading
  const headingPattern = /^##\s+(?:📝\s+)?TODO/m
  const match = markdown.match(headingPattern)
  if (!match || match.index === undefined) {
    return { unchecked: [], checked: [] }
  }

  // Get content after heading until next ## heading or end
  const afterHeading = markdown.slice(match.index + match[0].length)
  const nextH2 = afterHeading.match(/^##\s/m)
  const sectionContent = nextH2?.index !== undefined
    ? afterHeading.slice(0, nextH2.index)
    : afterHeading

  const unchecked = parseCheckboxes(sectionContent, 'unchecked').map(s => ({
    ...s,
    category: 'carryover' as const,
  }))

  const checked = parseCheckboxes(sectionContent, 'checked').map(s => ({
    ...s,
    category: 'carryover' as const,
    status: 'cleared' as const,
  }))

  return { unchecked, checked }
}
