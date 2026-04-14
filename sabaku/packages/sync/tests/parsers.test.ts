import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { parseTop3 } from '../src/parsers/top3.js'
import { parseCheckboxes } from '../src/parsers/checkbox.js'
import { parseTodoSection } from '../src/parsers/todo-section.js'
import { parseMarkdown } from '../src/parsers/index.js'

const fixturesDir = join(import.meta.dirname, 'fixtures')
const readFixture = (name: string) => readFileSync(join(fixturesDir, name), 'utf-8')

// ── Top3 Parser ─────────────────────────────────────────

describe('parseTop3', () => {
  it('extracts 3 items from standard format', () => {
    const md = readFixture('daily-sample.md')
    const result = parseTop3(md)
    expect(result).toHaveLength(3)
    expect(result[0]).toEqual({
      title: 'KASHITE Resend API 設定',
      priority: 'urg',
      category: 'daily-top3',
      source: 'vault',
      status: 'queue',
      project: null,
    })
    expect(result[1].title).toBe('Upwork proposal 送信')
    expect(result[2].title).toBe('NeetCode DP問題 1問')
  })

  it('returns only 1 item when Top3 has 1 entry', () => {
    const md = readFixture('top3-partial.md')
    const result = parseTop3(md)
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('タスクA')
  })

  it('returns empty for no Top3 section', () => {
    const md = readFixture('empty.md')
    expect(parseTop3(md)).toHaveLength(0)
  })

  it('works without emoji in heading', () => {
    const md = readFixture('no-emoji-heading.md')
    const result = parseTop3(md)
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('タスクWithoutEmoji')
  })

  it('strips metadata tags from titles', () => {
    const md = `### 🎯 Today's Top 3
1. タスク名 #health 📅 2026-04-12 ⏳S [WM:低]`
    const result = parseTop3(md)
    expect(result[0].title).toBe('タスク名')
  })
})

// ── Checkbox Parser ─────────────────────────────────────

describe('parseCheckboxes', () => {
  it('extracts unchecked checkboxes', () => {
    const md = `- [ ] Phrasely Vercel deploy
- [ ] Eagle Eye DIFF 適用
- [x] note投稿 #7 完了`
    const result = parseCheckboxes(md, 'unchecked')
    expect(result).toHaveLength(2)
    expect(result[0].title).toBe('Phrasely Vercel deploy')
    expect(result[0].status).toBe('queue')
  })

  it('extracts checked checkboxes', () => {
    const md = `- [x] note投稿 #7 完了`
    const result = parseCheckboxes(md, 'checked')
    expect(result).toHaveLength(1)
    expect(result[0].status).toBe('cleared')
  })

  it('strips metadata from titles', () => {
    const md = `- [ ] タスク名 #health 📅 2026-04-12 ⏳S [WM:低]`
    const result = parseCheckboxes(md, 'unchecked')
    expect(result[0].title).toBe('タスク名')
  })

  it('ignores regular text lines', () => {
    const md = `テキスト

- [ ] タスク

もっとテキスト`
    expect(parseCheckboxes(md, 'unchecked')).toHaveLength(1)
  })

  it('handles * and + list markers', () => {
    const md = `* [ ] asterisk task
+ [ ] plus task`
    expect(parseCheckboxes(md, 'unchecked')).toHaveLength(2)
  })

  it('extracts from handoff sample', () => {
    const md = readFixture('handoff-sample.md')
    const unchecked = parseCheckboxes(md, 'unchecked')
    const checked = parseCheckboxes(md, 'checked')
    expect(unchecked).toHaveLength(3)
    expect(checked).toHaveLength(1)
    expect(checked[0].title).toBe('OG 画像生成')
  })
})

// ── TODO Section Parser ─────────────────────────────────

describe('parseTodoSection', () => {
  it('extracts items from 📝 TODO section', () => {
    const md = readFixture('daily-sample.md')
    const result = parseTodoSection(md)
    expect(result.unchecked).toHaveLength(2)
    expect(result.checked).toHaveLength(1)
    expect(result.unchecked[0].title).toBe('Phrasely Vercel deploy')
    expect(result.unchecked[0].category).toBe('carryover')
    expect(result.checked[0].title).toBe('note投稿 #7 完了')
    expect(result.checked[0].status).toBe('cleared')
  })

  it('returns empty for no TODO section', () => {
    const md = readFixture('empty.md')
    const result = parseTodoSection(md)
    expect(result.unchecked).toHaveLength(0)
    expect(result.checked).toHaveLength(0)
  })

  it('stops at next ## heading', () => {
    const md = `## 📝 TODO
- [ ] タスクA
- [ ] タスクB

## 次のセクション
- [ ] これは含まれない`
    const result = parseTodoSection(md)
    expect(result.unchecked).toHaveLength(2)
  })
})

// ── Full Parser (parseMarkdown) ─────────────────────────

describe('parseMarkdown', () => {
  it('extracts all strips from daily note', () => {
    const md = readFixture('daily-sample.md')
    const strips = parseMarkdown(md)
    expect(strips.length).toBe(6)
  })

  it('deduplicates by title', () => {
    const md = `### 🎯 Today's Top 3
1. Same Task

## 📝 TODO
- [ ] Same Task`
    const strips = parseMarkdown(md)
    expect(strips).toHaveLength(1)
    expect(strips[0].priority).toBe('urg')
  })

  it('returns empty for note without tasks', () => {
    const md = readFixture('empty.md')
    expect(parseMarkdown(md)).toHaveLength(0)
  })

  it('respects disabled parse rules', () => {
    const md = readFixture('daily-sample.md')
    const strips = parseMarkdown(md, { top3: false, todoSection: true })
    expect(strips).toHaveLength(3)
    expect(strips.every(s => s.category === 'carryover')).toBe(true)
  })
})

// ── Project Detection ───────────────────────────────────

describe('project detection', () => {
  it('extracts project from hashtag', () => {
    const md = `### 🎯 Today's Top 3
1. API設定 #kashite`
    const result = parseTop3(md)
    expect(result[0].project).toBe('KASHITE')
    expect(result[0].title).toBe('API設定')
  })

  it('skips generic category tags', () => {
    const md = `- [ ] タスク #health`
    const result = parseCheckboxes(md, 'unchecked')
    expect(result[0].project).toBeNull()
  })

  it('infers project from handoff file path', () => {
    const md = `- [ ] Gumroad ページ確認`
    const result = parseCheckboxes(md, 'unchecked', '010-journal/handoff/2026/04/2026-04-13/kashite-distribution.md')
    expect(result[0].project).toBe('KASHITE')
  })

  it('hashtag takes priority over file path', () => {
    const md = `- [ ] タスク #sabaku`
    const result = parseCheckboxes(md, 'unchecked', '010-journal/handoff/2026/04/kashite-doc.md')
    expect(result[0].project).toBe('SABAKU')
  })

  it('returns null when no project hint', () => {
    const md = `### 🎯 Today's Top 3
1. 普通のタスク`
    const result = parseTop3(md)
    expect(result[0].project).toBeNull()
  })

  it('passes filePath through parseMarkdown', () => {
    const md = `### 🎯 Today's Top 3
1. Deploy確認 #phrasely`
    const strips = parseMarkdown(md, {}, 'some/path.md')
    expect(strips[0].project).toBe('PHRASELY')
  })
})
