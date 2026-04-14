import type { ParsedStrip } from '../types.js'
import { extractHashtags, resolveProject } from '../lib/project.js'

/**
 * Parse "### 🎯 Today's Top 3" section from daily notes.
 * Extracts numbered list items (1. 2. 3.) as URG priority strips.
 */
export function parseTop3(markdown: string, filePath: string = ''): ParsedStrip[] {
  const strips: ParsedStrip[] = []

  // Find the Top 3 heading — support both with and without emoji
  const headingPattern = /^###\s+(?:🎯\s+)?Today's Top 3/m
  const match = markdown.match(headingPattern)
  if (!match || match.index === undefined) return strips

  // Get content after heading until next heading or end
  const afterHeading = markdown.slice(match.index + match[0].length)
  const nextHeadingMatch = afterHeading.match(/^##/m)
  const sectionContent = nextHeadingMatch?.index !== undefined
    ? afterHeading.slice(0, nextHeadingMatch.index)
    : afterHeading

  // Extract numbered items: "1. ...", "2. ...", "3. ..."
  const itemPattern = /^\d+\.\s+(.+)$/gm
  let itemMatch: RegExpExecArray | null
  while ((itemMatch = itemPattern.exec(sectionContent)) !== null) {
    const raw = itemMatch[1].trim()
    const { title, hashtags } = extractHashtags(raw)
    if (title) {
      strips.push({
        title,
        priority: 'urg',
        category: 'daily-top3',
        source: 'vault',
        status: 'queue',
        project: resolveProject(hashtags, filePath),
      })
    }
  }

  return strips
}
