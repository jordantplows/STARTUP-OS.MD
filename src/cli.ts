#!/usr/bin/env node
import { parseArgs } from 'util'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import Anthropic from '@anthropic-ai/sdk'

const __dirname = dirname(fileURLToPath(import.meta.url))

// The root of the package installation (where .md agent files live)
const PACKAGE_ROOT = join(__dirname, '..')

// The user's current working directory (where output gets written)
const USER_CWD = process.cwd()

const { values, positionals } = parseArgs({
  args: process.argv.slice(2),
  options: {
    'dry-run':  { type: 'boolean', default: false },
    verbose:    { type: 'boolean', short: 'v', default: false },
    role:       { type: 'string' },
    scenario:   { type: 'string' },
    feature:    { type: 'string' },
    sprint:     { type: 'string' },
  },
  allowPositionals: true,
  strict: false,
})

const command    = positionals[0] ?? 'help'
const subcommand = positionals[1]
const argument   = positionals[2]

async function main() {
  switch (command) {
    case 'build':
      await runBuild(positionals.slice(1).join(' '))
      break
    case 'run':
      await runDepartment(subcommand, argument)
      break
    case 'status':
      await printStatus()
      break
    case 'reset':
      await reset()
      break
    case 'init':
      await init()
      break
    case 'help':
    default:
      printHelp()
  }
}

function printHelp() {
  console.log(`
startup-os — AI-powered company operating system

Usage:
  startup-os build "<idea>"         Build entire company OS from an idea
  startup-os run <dept>             Re-run all agents in a department
  startup-os run <dept> <agent>     Re-run a single agent
  startup-os status                 Show build progress
  startup-os reset                  Clear all output and start fresh
  startup-os init                   Set up startup-os in current directory

Options:
  --dry-run       Preview without writing files
  --verbose, -v   Show detailed output
  --role          Role name (for people/job-description)
  --feature       Feature name (for product/prd)
  --sprint        Sprint number (for product/sprint)
  --scenario      Scenario (for finance/model: base|bull|bear)

Examples:
  startup-os build "AI contract review for small law firms"
  startup-os run finance
  startup-os run product prd --feature "User notifications"
  startup-os run people job-description --role "Head of Sales"
  `)
}

async function init() {
  console.log('\n🚀 Initializing startup-os in', USER_CWD)

  // Create output folders for each department
  const depts = [
    'strategy', 'brand', 'product', 'finance', 'marketing',
    'sales', 'legal', 'people', 'operations', 'metrics'
  ]
  for (const dept of depts) {
    mkdirSync(join(USER_CWD, dept, 'output'), { recursive: true })
  }
  mkdirSync(join(USER_CWD, '_reports', 'security'), { recursive: true })
  mkdirSync(join(USER_CWD, '_reports', 'engineering'), { recursive: true })

  // Copy CLAUDE.md template to cwd if not already there
  const claudeDest = join(USER_CWD, 'CLAUDE.md')
  if (!existsSync(claudeDest)) {
    const claudeSrc = join(PACKAGE_ROOT, 'CLAUDE.md')
    writeFileSync(claudeDest, readFileSync(claudeSrc, 'utf-8'))
    console.log('✓ CLAUDE.md created — fill in your startup profile')
  } else {
    console.log('· CLAUDE.md already exists — skipping')
  }

  console.log('\n✅ Ready. Run:\n')
  console.log('  startup-os build "your startup idea"\n')
}

export async function runBuild(idea: string) {
  if (!idea.trim()) {
    console.error('❌ Please provide a startup idea.')
    console.error('   Example: startup-os build "AI contract review for small law firms"')
    process.exit(1)
  }

  // Ensure init has been run
  await init()

  console.log(`\n⚡ Building startup OS for:\n   "${idea}"\n`)

  const client = getClient()

  // Step 0: parse idea into startup profile
  await populateProfile(client, idea)

  // Steps 1–12: run all departments in order
  const departments = [
    'strategy', 'brand', 'product', 'finance', 'marketing',
    'sales', 'legal', 'people', 'operations', 'metrics',
    'security', 'engineering'
  ]

  for (const dept of departments) {
    await runDepartment(dept)
  }

  printFinalSummary()
}

export async function runDepartment(dept: string | undefined, agent?: string) {
  if (!dept) {
    console.error('❌ Department name required. Example: startup-os run finance')
    process.exit(1)
  }

  const deptPath = join(PACKAGE_ROOT, dept)
  if (!existsSync(deptPath)) {
    console.error(`❌ Department not found: ${dept}`)
    process.exit(1)
  }

  const client = getClient()
  const profile = loadProfile()

  if (agent) {
    // Run a single agent
    const agentPath = join(deptPath, `${agent}.md`)
    if (!existsSync(agentPath)) {
      console.error(`❌ Agent not found: ${dept}/${agent}.md`)
      process.exit(1)
    }
    await executeAgent(client, profile, agentPath, dept)
  } else {
    // Run all agents in the department
    const { readdirSync } = await import('fs')
    const agents = readdirSync(deptPath)
      .filter(f => f.endsWith('.md') && f !== 'README.md')
      .sort()

    console.log(`\n▶ Running ${dept}/ (${agents.length} agents)\n`)
    for (const agentFile of agents) {
      await executeAgent(client, profile, join(deptPath, agentFile), dept)
    }

    console.log(`\n━━ ${dept} complete ${'━'.repeat(Math.max(0, 50 - dept.length))}\n`)
  }
}

async function executeAgent(
  client: Anthropic,
  profile: Record<string, string>,
  agentPath: string,
  dept: string
) {
  const agentName = agentPath.split('/').pop()?.replace('.md', '') ?? 'unknown'
  const agentContent = readFileSync(agentPath, 'utf-8')

  // Extract the TypeScript block and instructions from the .md file
  const tsMatch = agentContent.match(/```typescript\n([\s\S]*?)```/)
  const ts = tsMatch?.[1] ?? ''

  // Read any upstream outputs this agent depends on
  const context = gatherContext(agentContent, dept)

  process.stdout.write(`  · ${agentName}...`)

  try {
    const response = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 8096,
      system: `You are an expert business agent executing startup-os instructions.
You have been given:
1. An agent .md file with instructions and TypeScript logic
2. The startup profile
3. Relevant context from other department outputs

Execute the agent instructions exactly. Return only the markdown content
that should be written to the output file. No preamble, no explanation.`,
      messages: [{
        role: 'user',
        content: `STARTUP PROFILE:
${JSON.stringify(profile, null, 2)}

AGENT FILE (${agentName}.md):
${agentContent}

CONTEXT FROM OTHER DEPARTMENTS:
${context}

Execute this agent for the startup described in the profile.
Return the complete output file content.`
      }]
    })

    const output = response.content[0]?.type === 'text'
      ? response.content[0].text
      : ''

    // Write output to the user's cwd
    const outputDir = join(USER_CWD, dept, 'output')
    mkdirSync(outputDir, { recursive: true })
    const outputPath = join(outputDir, `${agentName}-filled.md`)
    writeFileSync(outputPath, output, 'utf-8')

    // Update build log
    updateBuildLog(dept, agentName)

    console.log(` ✓  →  ${dept}/output/${agentName}-filled.md`)
  } catch (err) {
    console.log(` ❌ failed`)
    if (values.verbose) console.error(err)
    updateBuildLog(dept, agentName, true)
  }
}

async function populateProfile(client: Anthropic, idea: string) {
  console.log('· Analyzing idea and building startup profile...\n')

  const response = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 1024,
    system: `Extract startup details from an idea description.
Return ONLY valid JSON, no other text.`,
    messages: [{
      role: 'user',
      content: `Extract these fields from this startup idea: "${idea}"

Return JSON:
{
  "companyName": "inferred working name",
  "oneLine": "one sentence description",
  "industry": "primary industry vertical",
  "businessModel": "B2B SaaS | B2C | Marketplace | etc",
  "targetCustomer": "specific customer description",
  "problem": "core pain being solved",
  "stage": "idea",
  "fundraisingGoal": "inferred raise amount e.g. $500k",
  "launchTarget": "6 months from today"
}`
    }]
  })

  try {
    const text = response.content[0]?.type === 'text' ? response.content[0].text : '{}'
    const profile = JSON.parse(text.replace(/```json|```/g, '').trim())

    // Write to CLAUDE.md in user's cwd
    const claudePath = join(USER_CWD, 'CLAUDE.md')
    let claudeContent = existsSync(claudePath)
      ? readFileSync(claudePath, 'utf-8')
      : readFileSync(join(PACKAGE_ROOT, 'CLAUDE.md'), 'utf-8')

    for (const [key, value] of Object.entries(profile)) {
      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())
      claudeContent = claudeContent.replace(
        new RegExp(`(- ${label}:\\s*)\\[.*?\\]`),
        `$1${value}`
      )
    }

    writeFileSync(claudePath, claudeContent, 'utf-8')

    console.log('  Company:     ', profile.companyName)
    console.log('  Industry:    ', profile.industry)
    console.log('  Model:       ', profile.businessModel)
    console.log('  Customer:    ', profile.targetCustomer)
    console.log()
  } catch {
    console.log('  ⚠ Could not parse profile — continuing with raw idea')
  }
}

function loadProfile(): Record<string, string> {
  const claudePath = join(USER_CWD, 'CLAUDE.md')
  if (!existsSync(claudePath)) return {}

  const content = readFileSync(claudePath, 'utf-8')
  const profile: Record<string, string> = {}
  const matches = content.matchAll(/- ([^:]+):\s*(.+)/g)
  for (const [, key, value] of matches) {
    if (key && value) profile[key.trim()] = value.trim()
  }
  return profile
}

function gatherContext(agentContent: string, currentDept: string): string {
  // Parse the `reads:` frontmatter block to find upstream dependencies
  const readsMatch = agentContent.match(/reads:\n((?:\s+- .+\n)+)/)
  if (!readsMatch) return '(no upstream context)'

  const paths = (readsMatch[1] ?? '')
    .split('\n')
    .filter(l => l.trim().startsWith('- '))
    .map(l => l.trim().replace('- ', ''))

  const contexts: string[] = []
  for (const p of paths) {
    const full = join(USER_CWD, p)
    if (existsSync(full)) {
      contexts.push(`--- ${p} ---\n${readFileSync(full, 'utf-8').slice(0, 2000)}`)
    }
  }

  return contexts.length ? contexts.join('\n\n') : '(upstream files not yet generated)'
}

function updateBuildLog(dept: string, agent: string, failed = false) {
  const claudePath = join(USER_CWD, 'CLAUDE.md')
  if (!existsSync(claudePath)) return

  let content = readFileSync(claudePath, 'utf-8')
  const status = failed ? '❌ failed' : '✅ done'
  const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ')

  content = content.replace(
    new RegExp(`(\\| ${dept}\\s+\\|).*?\\|.*?\\|.*?\\|`),
    `$1 ${status.padEnd(11)} | ${agent.padEnd(13)} | ${timestamp} |`
  )

  writeFileSync(claudePath, content, 'utf-8')
}

function getClient(): Anthropic {
  const apiKey = process.env['ANTHROPIC_API_KEY']
  if (!apiKey) {
    console.error('\n❌ ANTHROPIC_API_KEY not found.')
    console.error('   Export it in your shell:')
    console.error('   export ANTHROPIC_API_KEY=sk-ant-...')
    process.exit(1)
  }
  return new Anthropic({ apiKey })
}

async function printStatus() {
  const claudePath = join(USER_CWD, 'CLAUDE.md')
  if (!existsSync(claudePath)) {
    console.log('\n⚠ No CLAUDE.md found. Run: startup-os init\n')
    return
  }
  const content = readFileSync(claudePath, 'utf-8')
  const logMatch = content.match(/## Build Log\n([\s\S]*?)(?=\n##|$)/)
  if (logMatch) {
    console.log('\n' + logMatch[0] + '\n')
  }
}

async function reset() {
  const { createInterface } = await import('readline')
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  rl.question("\nType 'confirm reset' to clear all output: ", async (answer) => {
    rl.close()
    if (answer.trim() === 'confirm reset') {
      const { rmSync } = await import('fs')
      const depts = [
        'strategy', 'brand', 'product', 'finance', 'marketing',
        'sales', 'legal', 'people', 'operations', 'metrics'
      ]
      for (const dept of depts) {
        const outputDir = join(USER_CWD, dept, 'output')
        if (existsSync(outputDir)) rmSync(outputDir, { recursive: true })
      }
      console.log('✅ All output cleared. Run startup-os build "<idea>" to start fresh.\n')
    } else {
      console.log('Reset cancelled.\n')
    }
  })
}

function printFinalSummary() {
  const profile = loadProfile()
  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  startup-os build complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Company:     ${profile['Company Name'] ?? 'your startup'}
  Departments: 12 complete

  Key outputs:
  → strategy/output/lean-canvas-filled.md
  → brand/output/pitch-deck-filled.md
  → product/output/roadmap-filled.md
  → finance/output/financial-model-filled.md
  → marketing/output/gtm-strategy-filled.md
  → _reports/security/threat-model-filled.md
  → _reports/engineering/code-review-filled.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`)
}

main().catch(err => {
  console.error('\n❌ Fatal error:', err.message)
  if (values.verbose) console.error(err)
  process.exit(1)
})
