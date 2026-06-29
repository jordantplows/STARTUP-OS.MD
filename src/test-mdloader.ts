import { MDLoader } from './md-loader.js'
import { readdirSync, statSync } from 'fs'
import { join, extname } from 'path'

function findAllMdFiles(dir: string): string[] {
  const excludedDirs = new Set([
    'node_modules', 'dist', '.git', '.github', '.claude',
    '.claude-plugin', 'mcp', '.memory', '.audit', 'workspace',
    '.startup-os', 'debug', 'templates'
  ])

  const files: string[] = []

  try {
    const entries = readdirSync(dir)

    for (const entry of entries) {
      if (excludedDirs.has(entry)) continue

      const fullPath = join(dir, entry)
      try {
        const stat = statSync(fullPath)

        if (stat.isDirectory()) {
          files.push(...findAllMdFiles(fullPath))
        } else if (stat.isFile() && extname(entry) === '.md') {
          if (!entry.includes('README') && !entry.includes('CLAUDE')) {
            files.push(fullPath)
          }
        }
      } catch (error) {
        continue
      }
    }
  } catch (error) {
    console.error(`Error scanning ${dir}:`, error)
  }

  return files
}

function main() {
  const loader = new MDLoader()
  const rootDir = process.cwd()
  const allMdFiles = findAllMdFiles(rootDir)

  console.log(`\nFound ${allMdFiles.length} .md files to test\n`)

  let passed = 0
  let failed = 0
  const failures: Array<{ file: string; error: string }> = []

  for (const file of allMdFiles) {
    try {
      const agent = loader.loadAgent(file)

      if (!agent) {
        failed++
        failures.push({ file, error: 'Failed to load agent (returned null)' })
        continue
      }

      if (!agent.metadata.name) {
        failed++
        failures.push({ file, error: 'Missing required field: name' })
        continue
      }

      if (!agent.metadata.role) {
        failed++
        failures.push({ file, error: 'Missing required field: role' })
        continue
      }

      if (!['steering', 'watching', 'generating', 'watcher', 'generator'].includes(agent.metadata.role)) {
        failed++
        failures.push({
          file,
          error: `Invalid role: ${agent.metadata.role} (must be steering, watching, generating, watcher, or generator)`
        })
        continue
      }

      if (agent.metadata.reads && !Array.isArray(agent.metadata.reads)) {
        failed++
        failures.push({ file, error: 'reads field is not an array' })
        continue
      }

      if (agent.metadata.writes && !Array.isArray(agent.metadata.writes)) {
        failed++
        failures.push({ file, error: 'writes field is not an array' })
        continue
      }

      if (agent.metadata.watches && !Array.isArray(agent.metadata.watches)) {
        failed++
        failures.push({ file, error: 'watches field is not an array' })
        continue
      }

      if (agent.metadata.events) {
        if (agent.metadata.events.emits && !Array.isArray(agent.metadata.events.emits)) {
          failed++
          failures.push({ file, error: 'events.emits is not an array' })
          continue
        }
        if (agent.metadata.events.watches && !Array.isArray(agent.metadata.events.watches)) {
          failed++
          failures.push({ file, error: 'events.watches is not an array' })
          continue
        }
      }

      if (!agent.typescript) {
        failed++
        failures.push({ file, error: 'Missing TypeScript code block' })
        continue
      }

      passed++
      console.log(`✓ ${file.replace(rootDir + '/', '')}`)
    } catch (error) {
      failed++
      failures.push({
        file,
        error: error instanceof Error ? error.message : String(error)
      })
    }
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`Test Results: ${passed} passed, ${failed} failed`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`)

  if (failures.length > 0) {
    console.log('Failures:\n')
    for (const { file, error } of failures) {
      console.log(`✗ ${file.replace(rootDir + '/', '')}`)
      console.log(`  ${error}\n`)
    }
    process.exit(1)
  }

  console.log('All .md files parsed successfully!\n')
}

main()
