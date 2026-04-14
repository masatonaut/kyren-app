/**
 * Extract project from hashtags or file path.
 * Priority: hashtags > file path > null
 */

/** Extract hashtags from raw text, returning cleaned title and hashtags */
export function extractHashtags(raw: string): { title: string; hashtags: string[] } {
  const hashtags: string[] = []
  const title = raw
    .replace(/#([a-zA-Z]\w*)/g, (_match, tag: string) => {
      hashtags.push(tag.toLowerCase())
      return ''
    })
    .replace(/📅\s*\d{4}-\d{2}-\d{2}/g, '')
    .replace(/⏳[SML]/g, '')
    .replace(/\[WM:[高中低]\]/g, '')
    .replace(/⏫/g, '')
    .replace(/\*\*/g, '')
    .replace(/→.*$/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  return { title, hashtags }
}

/** Infer project name from the first hashtag */
export function projectFromHashtags(hashtags: string[]): string | null {
  if (hashtags.length === 0) return null
  // Known project-type tags (not generic category tags)
  const skipTags = new Set(['health', 'marketing', 'academic', 'daily', 'journal', 'handoff'])
  const projectTag = hashtags.find(t => !skipTags.has(t))
  return projectTag ? projectTag.toUpperCase() : null
}

/** Infer project from vault file path */
export function inferProjectFromPath(relativePath: string): string | null {
  // handoff files: extract project from filename
  // e.g. "010-journal/handoff/2026/04/2026-04-13/kashite-distribution-strategy.md"
  if (relativePath.includes('handoff')) {
    const filename = relativePath.split('/').pop()?.replace('.md', '') ?? ''
    // Take first segment before hyphen if it looks like a project name
    const parts = filename.split('-')
    if (parts.length > 1) {
      const candidate = parts[0]
      // Filter out date-like segments and very short names
      if (candidate.length >= 3 && !/^\d{4}$/.test(candidate)) {
        return candidate.toUpperCase()
      }
    }
  }
  return null
}

/** Determine project for a parsed strip given hashtags and file path */
export function resolveProject(hashtags: string[], filePath: string): string | null {
  return projectFromHashtags(hashtags) ?? inferProjectFromPath(filePath)
}
