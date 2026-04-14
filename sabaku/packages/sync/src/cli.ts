#!/usr/bin/env node

import { Command } from 'commander'
import chalk from 'chalk'
import { watch } from 'chokidar'
import { join } from 'node:path'
import { writeFileSync, existsSync } from 'node:fs'
import { loadConfig, getDefaultConfig } from './lib/config.js'
import { runSync, getSyncStatus } from './lib/sync.js'

const program = new Command()

program
  .name('sabaku')
  .description('Obsidian Vault → SABAKU strip sync')
  .version('0.1.0')

// ── sabaku init ──────────────────────────────────────────
program
  .command('init')
  .description('Create sabaku-sync.config.json')
  .option('--vault <path>', 'Path to Obsidian Vault')
  .action((opts) => {
    const configPath = join(process.cwd(), 'sabaku-sync.config.json')
    if (existsSync(configPath)) {
      console.log(chalk.yellow('Config already exists: sabaku-sync.config.json'))
      return
    }

    const config = getDefaultConfig()
    if (opts.vault) config.vaultPath = opts.vault

    writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n')
    console.log(chalk.green('Created sabaku-sync.config.json'))
    if (!opts.vault) {
      console.log(chalk.dim('Edit the file to set your vaultPath'))
    }
  })

// ── sabaku sync ──────────────────────────────────────────
program
  .command('sync')
  .description('Sync Obsidian Vault to SABAKU strips')
  .option('--once', 'Run once and exit')
  .option('--dry-run', 'Preview changes without syncing')
  .option('--status', 'Show current sync status')
  .option('--config <path>', 'Path to config file')
  .action(async (opts) => {
    // Status mode
    if (opts.status) {
      const status = getSyncStatus()
      console.log(chalk.bold('Sync Status'))
      console.log(`  Tracked files: ${status.trackedFiles}`)
      if (status.entries.length > 0) {
        for (const e of status.entries) {
          console.log(chalk.dim(`  ${e.filePath} [${e.hash}]`))
        }
      } else {
        console.log(chalk.dim('  No files synced yet'))
      }
      return
    }

    const config = loadConfig(opts.config)
    console.log(chalk.bold(`SABAKU Sync${opts.dryRun ? ' (dry run)' : ''}`))
    console.log(chalk.dim(`Vault: ${config.vaultPath}`))
    console.log(chalk.dim(`Watch: ${config.watchPaths.join(', ')}`))
    console.log()

    // Run sync
    const { results, stats } = runSync(config, { dryRun: opts.dryRun })

    // Display results
    for (const result of results) {
      console.log(chalk.cyan(`📄 ${result.filePath}`))
      for (const strip of result.strips) {
        const priorityColor = strip.priority === 'urg' ? chalk.red : strip.priority === 'nrm' ? chalk.green : chalk.gray
        const statusIcon = strip.status === 'cleared' ? chalk.dim('✓') : ' '
        console.log(`  ${statusIcon} ${priorityColor(`[${strip.priority.toUpperCase()}]`)} ${strip.title} ${chalk.dim(`(${strip.category})`)}`)
      }
    }

    console.log()
    console.log(chalk.bold('Summary'))
    console.log(`  Files scanned: ${stats.filesScanned}`)
    console.log(`  Strips found:  ${stats.stripsCreated}`)
    console.log(`  Skipped:       ${stats.skipped}`)

    if (opts.dryRun) {
      console.log(chalk.yellow('\n  Dry run — no changes applied'))
      return
    }

    // If --once, exit
    if (opts.once) return

    // Watch mode
    console.log(chalk.dim('\nWatching for changes... (Ctrl+C to stop)'))

    const watchDirs = config.watchPaths.map(p => join(config.vaultPath, p))
    const watcher = watch(watchDirs, {
      ignored: /(^|[/\\])\./,
      persistent: true,
      ignoreInitial: true,
    })

    watcher.on('change', (filePath) => {
      console.log(chalk.dim(`\n[${new Date().toLocaleTimeString()}] Change detected: ${filePath}`))
      const { results: newResults, stats: newStats } = runSync(config)

      for (const result of newResults) {
        console.log(chalk.cyan(`  📄 ${result.filePath}`))
        for (const strip of result.strips) {
          const priorityColor = strip.priority === 'urg' ? chalk.red : chalk.green
          console.log(`    ${priorityColor(`[${strip.priority.toUpperCase()}]`)} ${strip.title}`)
        }
      }

      if (newResults.length === 0) {
        console.log(chalk.dim('  No changes'))
      } else {
        console.log(chalk.dim(`  +${newStats.stripsCreated} strips`))
      }
    })

    watcher.on('add', (filePath) => {
      console.log(chalk.dim(`\n[${new Date().toLocaleTimeString()}] New file: ${filePath}`))
      const { results: newResults } = runSync(config)
      for (const result of newResults) {
        console.log(chalk.cyan(`  📄 ${result.filePath} — ${result.strips.length} strips`))
      }
    })

    // Keep process alive
    process.on('SIGINT', () => {
      console.log(chalk.dim('\nSync stopped.'))
      watcher.close()
      process.exit(0)
    })
  })

program.parse()
