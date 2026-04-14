import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, relative, extname } from 'node:path'
import { parseMarkdown, type ParseOptions } from '../parsers/index.js'
import { computeHash } from './hash.js'
import type { SyncConfig, SyncResult } from '../types.js'

/**
 * Scan vault paths for markdown files and parse strips from them.
 */
export function scanVault(config: SyncConfig): SyncResult[] {
  const results: SyncResult[] = []
  const parseOptions: ParseOptions = {
    top3: config.parseRules.top3,
    checkboxUnchecked: config.parseRules.checkboxUnchecked,
    checkboxChecked: config.parseRules.checkboxChecked,
    todoSection: config.parseRules.todoSection,
  }

  for (const watchPath of config.watchPaths) {
    const fullPath = join(config.vaultPath, watchPath)
    if (!existsSync(fullPath)) continue

    const files = findMarkdownFiles(fullPath)
    for (const filePath of files) {
      const content = readFileSync(filePath, 'utf-8')
      const hash = computeHash(content)
      const relPath = relative(config.vaultPath, filePath)
      const strips = parseMarkdown(content, parseOptions, relPath)

      if (strips.length > 0) {
        results.push({
          filePath: relative(config.vaultPath, filePath),
          strips,
          hash,
        })
      }
    }
  }

  return results
}

/** Recursively find all .md files in a directory */
function findMarkdownFiles(dirPath: string): string[] {
  const files: string[] = []

  function walk(dir: string) {
    if (!existsSync(dir)) return
    const entries = readdirSync(dir)
    for (const entry of entries) {
      if (entry.startsWith('.')) continue
      const fullPath = join(dir, entry)
      const stat = statSync(fullPath)
      if (stat.isDirectory()) {
        walk(fullPath)
      } else if (extname(entry) === '.md') {
        files.push(fullPath)
      }
    }
  }

  walk(dirPath)
  return files
}
