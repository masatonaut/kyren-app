import type { ParsedStrip } from '../types.js'
import { parseTop3 } from './top3.js'
import { parseCheckboxes } from './checkbox.js'
import { parseTodoSection } from './todo-section.js'

export { parseTop3, parseCheckboxes, parseTodoSection }

export interface ParseOptions {
  top3?: boolean
  checkboxUnchecked?: boolean
  checkboxChecked?: boolean
  todoSection?: boolean
}

/**
 * Parse a markdown file and extract all strips based on enabled rules.
 * Default: all rules enabled.
 */
export function parseMarkdown(markdown: string, options: ParseOptions = {}): ParsedStrip[] {
  const {
    top3 = true,
    checkboxUnchecked = true,
    checkboxChecked = true,
    todoSection = true,
  } = options

  const strips: ParsedStrip[] = []
  const seenTitles = new Set<string>()

  function addUnique(items: ParsedStrip[]) {
    for (const item of items) {
      if (!seenTitles.has(item.title)) {
        seenTitles.add(item.title)
        strips.push(item)
      }
    }
  }

  // Top3 first (highest priority)
  if (top3) {
    addUnique(parseTop3(markdown))
  }

  // TODO section (carryover)
  if (todoSection) {
    const todo = parseTodoSection(markdown)
    if (checkboxUnchecked) addUnique(todo.unchecked)
    if (checkboxChecked) addUnique(todo.checked)
  }

  return strips
}
