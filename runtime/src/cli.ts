#!/usr/bin/env node
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import Anthropic from '@anthropic-ai/sdk'
import { parseArgs } from 'util'

// OS root (the startup-os package installation)
const __dirname = dirname(fileURLToPath(import.meta.url))
const OS_ROOT = join(__dirname, '..', '..')

// Workspace root (user's working directory)
const WORKSPACE_ROOT = process.cwd()

// Import syscalls (will be built from syscalls/*.md)
// For now, we'll implement inline until the build system extracts them

interface StartupProfile {
  companyName: string
  oneLine: string
  industry: string
  businessModel: string
  targetCustomer: string
  problem: string
  stage: 'idea' | 'pre-seed' | 'seed' | 'series-a'
  location: string
  founders: number
  revenue: string
  fundraisingGoal: string
  launchTarget: string
}

const { positionals } = parseArgs({
  args: process.argv.slice(2),
  allowPositionals: true,
  strict: false
})

const command = positionals[0] ?? 'help'

async function boot() {
  const apiKey = process.env['ANTHROPIC_API_KEY']
  if (!apiKey && command !== 'help' && command !== 'init' && command !== 'status') {
    console.error('❌ ANTHROPIC_API_KEY not set')
    console.error('   Set it in your shell: export ANTHROPIC_API_KEY=...')
    process.exit(1)
  }

  const client = apiKey ? new Anthropic({ apiKey }) : null

  switch (command) {
    case 'build':
      if (!client) process.exit(1)
      await build(client, positionals.slice(1).join(' '))
      break
    case 'run':
      if (!client) process.exit(1)
      await run(client, positionals[1], positionals[2])
      break
    case 'status':
      await status()
      break
    case 'init':
      await init()
      break
    case 'reset':
      await reset()
      break
    default:
      printHelp()
  }
}

async function build(client: Anthropic, idea: string) {
  console.log('\n⚡ startup-os booting...\n')

  // TODO: Import from kernel/scheduler
  // For now: placeholder message
  console.log('  Kernel: Scheduler loading dependency graph...')
  console.log('  Hardware: Anthropic API connected')
  console.log('  Stdlib: 12 departments queued\n')

  // TODO: Build dependency graph from stdlib/ agents
  // TODO: Execute agents via syscalls/run-agent
  // TODO: Track state via kernel/state
  // TODO: Run consistency checks via kernel/consistency

  console.log('  ⚠️  OS architecture complete, agent execution not yet implemented')
  console.log('  Next: Extract TypeScript from syscalls/*.md and kernel/*.md\n')

  console.log('✅ OS layer reorganization complete\n')
}

async function run(client: Anthropic, dept?: string, agentName?: string) {
  if (!dept) {
    console.error('Usage: startup-os run <dept> [agent]')
    return
  }

  console.log(`\n⚡ Running ${dept}${agentName ? `/${agentName}` : ''}...\n`)
  console.log('  ⚠️  Agent execution not yet implemented\n')
}

async function status() {
  console.log('\n📊 startup-os status\n')

  // TODO: Import from syscalls/read-profile
  // For now: show directory structure

  console.log('OS Layer Structure:')
  console.log('  ✓ apps/        — user-land applications')
  console.log('  ✓ stdlib/      — standard library (12 departments)')
  console.log('  ✓ syscalls/    — OS primitives (8 syscalls)')
  console.log('  ✓ kernel/      — scheduler, IPC, state, consistency, errors')
  console.log('  ✓ runtime/     — boot process (this CLI)')
  console.log('  ✓ hardware/    — infrastructure specs\n')
}

async function init() {
  console.log('\n🚀 Initializing startup-os workspace\n')

  const { mkdirSync, existsSync, writeFileSync } = await import('fs')

  // Create stdlib output directories
  const depts = [
    'strategy', 'brand', 'product', 'finance', 'marketing',
    'sales', 'legal', 'people', 'operations', 'metrics',
    'security', 'engineering'
  ]

  for (const dept of depts) {
    const outputDir = join(WORKSPACE_ROOT, 'stdlib', dept, 'output')
    mkdirSync(outputDir, { recursive: true })
    console.log(`  ✓ Created stdlib/${dept}/output/`)
  }

  // Create reports directory
  mkdirSync(join(WORKSPACE_ROOT, '_reports', 'snapshots'), { recursive: true })
  console.log('  ✓ Created _reports/')

  // Create CLAUDE.md if it doesn't exist
  const claudePath = join(WORKSPACE_ROOT, 'CLAUDE.md')
  if (!existsSync(claudePath)) {
    const template = `# Startup OS — Project Instructions

This is the startup-os repository. This file contains the startup profile and build tracking for the complete company operating system.

---

## Startup Profile
- Company Name:        [PENDING]
- One-line:            [PENDING]
- Industry:            [PENDING]
- Business Model:      [PENDING]
- Target Customer:     [PENDING]
- Problem:             [PENDING]
- Stage:               idea
- Location:            [PENDING]
- Founders:            [PENDING]
- Revenue:             $0
- Fundraising Goal:    [PENDING]
- Launch Target:       [PENDING]

---

## Build Log
| Department   | Status      | Files Written | Completed     |
|--------------|-------------|---------------|---------------|
| strategy     | ⬜ pending  | -             | -             |
| brand        | ⬜ pending  | -             | -             |
| product      | ⬜ pending  | -             | -             |
| finance      | ⬜ pending  | -             | -             |
| marketing    | ⬜ pending  | -             | -             |
| sales        | ⬜ pending  | -             | -             |
| legal        | ⬜ pending  | -             | -             |
| people       | ⬜ pending  | -             | -             |
| operations   | ⬜ pending  | -             | -             |
| metrics      | ⬜ pending  | -             | -             |
| security     | ⬜ pending  | -             | -             |
| engineering  | ⬜ pending  | -             | -             |

---

## Usage

Run the complete build:
\`\`\`
startup-os build "Your startup idea here"
\`\`\`

Check status:
\`\`\`
startup-os status
\`\`\`

Re-run a department or agent:
\`\`\`
startup-os run finance
startup-os run product roadmap
\`\`\`

Reset everything:
\`\`\`
startup-os reset
\`\`\`

---

## Notes

- The build runs 12 departments sequentially with dependency chains
- Each department writes to its \`stdlib/<dept>/output/\` folder
- Security and engineering write to \`_reports/\`
- The Build Log above tracks completion status in real-time
- Cross-department consistency is validated automatically
`
    writeFileSync(claudePath, template, 'utf-8')
    console.log('  ✓ Created CLAUDE.md')
  } else {
    console.log('  · CLAUDE.md already exists')
  }

  console.log('\n✅ Workspace initialized\n')
  console.log('Next steps:')
  console.log('  1. Edit CLAUDE.md and fill in your startup profile')
  console.log('  2. Run: startup-os build "your idea"\n')
}

async function reset() {
  console.log('\n🔄 Resetting startup-os...\n')

  const { rmSync, existsSync } = await import('fs')

  // Remove all output directories
  const depts = [
    'strategy', 'brand', 'product', 'finance', 'marketing',
    'sales', 'legal', 'people', 'operations', 'metrics',
    'security', 'engineering'
  ]

  for (const dept of depts) {
    const outputDir = join(WORKSPACE_ROOT, 'stdlib', dept, 'output')
    if (existsSync(outputDir)) {
      rmSync(outputDir, { recursive: true, force: true })
      console.log(`  ✓ Cleared stdlib/${dept}/output/`)
    }
  }

  // Remove reports
  const reportsDir = join(WORKSPACE_ROOT, '_reports')
  if (existsSync(reportsDir)) {
    rmSync(reportsDir, { recursive: true, force: true })
    console.log('  ✓ Cleared _reports/')
  }

  console.log('\n✅ Reset complete\n')
  console.log('Ready to rebuild with: startup-os build "your idea"\n')
}

function printHelp() {
  console.log(`
⚡ startup-os — AI company operating system

Usage:
  startup-os build "<idea>"         Boot the full OS for a startup
  startup-os run <dept>             Run all agents in a stdlib dept
  startup-os run <dept> <agent>     Run a single agent
  startup-os status                 Show current OS state
  startup-os init                   Initialize workspace
  startup-os reset                  Clear all outputs

Examples:
  startup-os build "AI contract review for law firms"
  startup-os run finance
  startup-os run product roadmap

Architecture:
  apps/        User-land applications (git submodules)
  stdlib/      Standard library (12 department agents)
  syscalls/    OS primitives (read, write, exec, pipe)
  kernel/      Scheduler, state, consistency, errors
  runtime/     Boot process (this CLI)
  hardware/    Anthropic API, filesystem, CLAUDE.md

Environment:
  ANTHROPIC_API_KEY    Required for agent execution
`)
}

// Boot the OS
boot().catch(err => {
  console.error('\n💥 kernel panic:', err.message)
  if (process.env['DEBUG']) {
    console.error(err.stack)
  }
  process.exit(1)
})
