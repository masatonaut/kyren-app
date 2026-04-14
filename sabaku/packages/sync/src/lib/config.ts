import { readFileSync, existsSync } from 'node:fs'
import { resolve, join } from 'node:path'
import type { SyncConfig } from '../types.js'

const CONFIG_FILENAME = 'sabaku-sync.config.json'

const defaultConfig: SyncConfig = {
  vaultPath: '',
  watchPaths: [
    '010-journal/daily',
    '010-journal/handoff',
  ],
  supabaseUrl: '',
  supabaseKey: '',
  parseRules: {
    top3: true,
    checkboxUnchecked: true,
    checkboxChecked: true,
    todoSection: true,
  },
}

export function loadConfig(configPath?: string): SyncConfig {
  const resolvedPath = configPath
    ? resolve(configPath)
    : resolve(process.cwd(), CONFIG_FILENAME)

  if (!existsSync(resolvedPath)) {
    throw new Error(
      `Config not found: ${resolvedPath}\nRun \`sabaku init\` or create ${CONFIG_FILENAME}`
    )
  }

  const raw = readFileSync(resolvedPath, 'utf-8')
  const parsed = JSON.parse(raw) as Partial<SyncConfig>

  const config: SyncConfig = {
    ...defaultConfig,
    ...parsed,
    parseRules: { ...defaultConfig.parseRules, ...parsed.parseRules },
  }

  if (!config.vaultPath) {
    throw new Error('vaultPath is required in config')
  }

  return config
}

export function getDefaultConfig(): SyncConfig {
  return { ...defaultConfig }
}
