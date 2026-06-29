#!/usr/bin/env node

import { CompanyOSManager } from './company-os.js'
import { MDLoader } from './md-loader.js'
import { MDExecutor } from './md-executor.js'
import { routeFounderInput } from './router.js'
import { setupSupabaseFlow, connectExistingSupabase } from './supabase-setup.js'
import { writeDashboard, openDashboard } from './dashboard.js'

const args = process.argv.slice(2)
const command = args[0]
const rest = args.slice(1).join(' ')

async function main(): Promise<void> {
  try {
    switch (command) {
      case 'build': {
        if (!rest) {
          console.error('Usage: startup-os build "<your startup idea>"')
          process.exit(1)
        }

        await buildCompany(rest)
        break
      }

      case 'init': {
        await initCompany(rest)
        break
      }

      case 'ask': {
        if (!rest) {
          console.error('Usage: startup-os ask <your message>')
          process.exit(1)
        }

        await askCompany(rest)
        break
      }

      case 'status': {
        await statusBriefing()
        break
      }

      case 'agents': {
        await listAgents()
        break
      }

      case 'reset': {
        await resetCompany()
        break
      }

      case 'connect': {
        if (!rest) {
          console.error('Usage: startup-os connect <service>')
          console.error('Available: supabase')
          process.exit(1)
        }

        await connectService(rest)
        break
      }

      case 'dashboard': {
        await showDashboard()
        break
      }

      default: {
        showHelp()
      }
    }
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

async function buildCompany(idea: string): Promise<void> {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(' Instantiating your company...')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  const os = new CompanyOSManager({ oneline: idea })

  console.log(`I understand you're building: ${idea}\n`)
  console.log('Before I instantiate your company, three quick questions:\n')

  console.log('1. What stage are you at?')
  console.log('   → just an idea / validating / building / revenue\n')

  console.log('2. Who is your first customer? Be specific.')
  console.log('   → (e.g., "Security engineers at Series B+ SaaS companies")\n')

  console.log("3. What's the one thing that has to be true for this to work?")
  console.log('   → (Your key assumption)\n')

  console.log('Once you answer, run:')
  console.log('  startup-os init <stage> "<customer>" "<assumption>"\n')

  console.log('Example:')
  console.log('  startup-os init idea "Security engineers at Series B+ SaaS" "Teams want automated pre-screening"\n')
}

async function initCompany(answers: string): Promise<void> {
  const parts = answers.match(/"[^"]+"|[^\s]+/g) || []
  if (parts.length < 3) {
    console.error('Usage: startup-os init <stage> "<customer>" "<assumption>"')
    process.exit(1)
  }

  const [stageRaw, customerRaw, assumptionRaw] = parts
  const stage = (stageRaw || '').replace(/"/g, '')
  const customer = (customerRaw || '').replace(/"/g, '')
  const assumption = (assumptionRaw || '').replace(/"/g, '')

  const os = new CompanyOSManager()

  let stageValue: 'idea' | 'validating' | 'building' | 'revenue' = 'idea'
  if (stage.includes('validat')) stageValue = 'validating'
  else if (stage.includes('build')) stageValue = 'building'
  else if (stage.includes('revenue')) stageValue = 'revenue'

  os.updateProfile({
    stage: stageValue,
    targetCustomer: customer,
  })

  if (assumption) {
    os.emitEvent({
      type: 'assumption',
      from: 'founder',
      payload: { assumption },
    })
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(' Company initialized.')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  // PHASE 1: Show immediate feedback
  const loader = new MDLoader()
  const allAgents = loader.loadAllAgents()

  // Initialize all departments first
  for (const agent of allAgents) {
    os.initializeDepartment(agent.metadata.name, {
      currentFocus: 'Compiling...',
      status: 'initializing',
    })
  }

  // PHASE 2: Run executive agents FIRST (parallel) for fast first look
  console.log('Compiling... [executives running]')

  const executiveAgents = allAgents.filter(a =>
    a.metadata.name === 'ceo' ||
    a.metadata.name === 'finance-exec' ||
    a.metadata.name === 'engineering-exec' ||
    a.metadata.name === 'marketing-exec' ||
    a.metadata.name === 'product-exec'
  )

  const executor = new MDExecutor(os)

  // Run executives in parallel with smaller token budgets
  const executiveResults = await Promise.all(
    executiveAgents.map(agent =>
      executor.execute(agent, 'Company initialization', undefined, { maxTokens: 2048 })
    )
  )

  // Show CEO briefing immediately
  const ceoResult = executiveResults.find(r => r.agentName === 'ceo')

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(` ${os.getState().profile.companyName || 'Your Company'} · CEO`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  if (ceoResult?.success && ceoResult.output) {
    console.log(ceoResult.output)
  } else {
    console.log('Company compiled. Departments are initializing in the background.')
  }

  // PHASE 3: Run all other department agents in parallel (background)
  const departmentAgents = allAgents.filter(a =>
    !executiveAgents.find(e => e.metadata.name === a.metadata.name)
  )

  let completed = executiveAgents.length
  const total = allAgents.length

  // Show progress and run departments in parallel
  console.log(`\nCompiling... [${completed}/${total} departments ready]`)

  const departmentPromises = departmentAgents.map(async (agent) => {
    const result = await executor.execute(agent, 'Company initialization', undefined, { maxTokens: 2048 })
    completed++
    // Update progress in place
    process.stdout.write(`\rCompiling... [${completed}/${total} departments ready]`)
    return result
  })

  await Promise.all(departmentPromises)

  console.log(`\rCompiling... [${total}/${total} departments ready] ✓\n`)

  // PHASE 4: Surface MCP needs
  const mcpNeeds = detectMCPNeeds(os.getState(), allAgents)

  if (mcpNeeds.length > 0) {
    const databaseNeed = mcpNeeds.find(n => n.databaseRequired)

    if (databaseNeed) {
      // Special handling for database needs
      console.log('\n━━ YOUR PRODUCT NEEDS A DATABASE ━━━━━━━━━━━━━━━━')
      console.log(`${databaseNeed.unlocks[0]} needs persistent storage for ${databaseNeed.databaseReason?.toLowerCase()}.`)
      console.log('')
      console.log('I recommend Supabase — Postgres, auth, and storage')
      console.log('in one place, free to start.')
      console.log('')
      console.log('[1] Set up Supabase now (takes about 3 minutes)')
      console.log('[2] I already have a Supabase project')
      console.log('[3] Skip for now — I\'ll set it up later')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

      // Store database need for later handling
      os.getState().pendingDatabaseSetup = {
        reason: databaseNeed.databaseReason || 'persistent data storage',
        department: databaseNeed.unlocks[0] || 'product'
      }
      os.save()
    } else {
      console.log('\n━━ CONNECT TOOLS TO ACTIVATE YOUR COMPANY ━━━━━━')
      console.log('Your company is compiled but not yet running.')
      console.log('Connect these to bring it to life:\n')

      mcpNeeds.forEach((need, idx) => {
        const blocked = need.blockedWithout ? ' [REQUIRED]' : ''
        console.log(`[${idx + 1}] ${need.tools.join(', ')}${blocked}`)
        console.log(`    → unlocks ${need.unlocks.join(', ')}`)
        console.log(`    ${need.reason}\n`)
      })

      console.log('Type a number to connect, or "later" to explore on your own.')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    }

    // Store MCP prompt state
    os.getState().mcpPromptDeferred = true
    os.save()
  }

  console.log('Your company is running.')
  console.log('Talk to it with: startup-os ask "<your message>"\n')
  console.log('Commands:')
  console.log('  startup-os ask "what should I work on today"')
  console.log('  startup-os status')
  console.log('  startup-os agents\n')
}

interface MCPNeed {
  tools: string[]
  unlocks: string[]
  reason: string
  blockedWithout: boolean
  databaseRequired?: boolean
  databaseReason?: string
}

function detectMCPNeeds(state: any, agents: any[]): MCPNeed[] {
  const needs: MCPNeed[] = []

  // Check if any department needs a database
  const productAgent = agents.find(a => a.metadata.name === 'mvp' || a.metadata.department === 'product')
  const engineeringAgent = agents.find(a => a.metadata.department === 'engineering')
  const customerAgent = agents.find(a => a.metadata.department === 'customer')

  let databaseReason = ''
  let databaseDept = ''

  // Product needs database if building CRUD features
  if (productAgent && (
    state.profile.oneline?.toLowerCase().includes('account') ||
    state.profile.oneline?.toLowerCase().includes('user') ||
    state.profile.oneline?.toLowerCase().includes('dashboard') ||
    state.profile.oneline?.toLowerCase().includes('platform') ||
    state.profile.oneline?.toLowerCase().includes('saas') ||
    state.profile.businessModel?.toLowerCase().includes('saas')
  )) {
    databaseReason = 'User accounts, saved data, and persistent state'
    databaseDept = 'product'
  }

  // Engineering needs database if tech stack implies backend
  if (!databaseReason && engineeringAgent) {
    databaseReason = 'Backend data storage and API persistence'
    databaseDept = 'engineering'
  }

  // Customer department needs database for customer records
  if (!databaseReason && customerAgent) {
    databaseReason = 'Customer records and support history'
    databaseDept = 'customer'
  }

  if (databaseReason) {
    needs.push({
      tools: ['Supabase'],
      unlocks: [databaseDept, 'backend', 'auth'],
      reason: databaseReason,
      blockedWithout: true,
      databaseRequired: true,
      databaseReason
    })
  }

  // Analyze which departments need which MCPs
  const hasOutreach = agents.some(a => a.metadata.department === 'outreach')
  const hasInvestor = agents.some(a => a.metadata.department === 'investor')
  const hasResearch = agents.some(a => a.metadata.department === 'research')

  if (hasOutreach || hasInvestor) {
    needs.push({
      tools: ['Gmail', 'LinkedIn'],
      unlocks: ['outreach', 'investor', 'network'],
      reason: 'Send investor outreach, customer emails, and partnership intros',
      blockedWithout: false
    })
  }

  if (hasResearch) {
    needs.push({
      tools: ['Brave Search', 'WebFetch'],
      unlocks: ['research', 'competitor-watch', 'customer-intel'],
      reason: 'Monitor competitors, track customer signals, and research trends',
      blockedWithout: false
    })
  }

  // Check if product/engineering agents need dev tools
  const hasEngineering = agents.some(a => a.metadata.department === 'engineering')
  if (hasEngineering) {
    needs.push({
      tools: ['GitHub', 'Linear'],
      unlocks: ['engineering', 'product', 'metrics'],
      reason: 'Track issues, pull requests, and engineering velocity',
      blockedWithout: false
    })
  }

  return needs
}

async function askCompany(message: string): Promise<void> {
  const os = new CompanyOSManager()
  const state = os.getState()

  os.addFounderInput(message)

  console.log('\nRouting your message...\n')

  const routing = await routeFounderInput(message, state)

  console.log(`→ Routing to: ${routing.agents.join(', ')}`)
  console.log(`→ Reason: ${routing.reasoning}\n`)

  const loader = new MDLoader()
  loader.loadAllAgents()

  const executor = new MDExecutor(os)
  const agentsToRun = routing.agents
    .map(name => loader.getAgent(name))
    .filter((a): a is NonNullable<typeof a> => a !== undefined)

  if (agentsToRun.length === 0) {
    console.log('No agents available to respond.\n')
    return
  }

  const results = await executor.executeMultiple(
    agentsToRun,
    'Founder message',
    message,
    routing.sequential
  )

  for (const result of results) {
    if (result.success && result.output) {
      console.log(`━━ ${result.agentName} ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
      console.log(result.output)
      console.log()
    } else if (!result.success) {
      console.log(`━━ ${result.agentName} (error) ━━━━━━━━━━━━━━━━━━━━━━━━`)
      console.log(`Error: ${result.error}`)
      console.log()
    }
  }
}

async function statusBriefing(): Promise<void> {
  const os = new CompanyOSManager()
  const loader = new MDLoader()
  loader.loadAllAgents()

  const ceoAgent = loader.getAgent('ceo')
  if (!ceoAgent) {
    console.error('CEO agent not found')
    return
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(' Status Briefing')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  const executor = new MDExecutor(os)
  const result = await executor.execute(ceoAgent, 'Status briefing request')

  if (result.success && result.output) {
    console.log(result.output)
  } else {
    console.log('Status briefing not available.')
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
}

async function listAgents(): Promise<void> {
  const os = new CompanyOSManager()
  const state = os.getState()
  const loader = new MDLoader()
  const agents = loader.loadAllAgents()

  console.log(`\nACTIVE AGENTS (${agents.length} loaded)\n`)

  const executives = agents.filter(a => a.metadata.department === 'executive')
  const departments = agents.filter(a =>
    a.metadata.department !== 'executive' &&
    a.metadata.department !== 'red-team' &&
    a.metadata.department !== 'core'
  )
  const redTeam = agents.filter(a => a.metadata.department === 'red-team')
  const core = agents.filter(a => a.metadata.department === 'core')

  if (executives.length > 0) {
    console.log('EXECUTIVES:')
    executives.forEach(agent => {
      const dept = state.departments[agent.metadata.name]
      const symbol = dept?.status === 'blocked' ? '○' : '●'
      const status = dept?.status || 'not-init'
      const focus = dept?.currentFocus || 'Not initialized'
      console.log(`${symbol} ${agent.metadata.name.padEnd(20)} ${status.padEnd(12)} ${focus}`)
    })
    console.log()
  }

  if (departments.length > 0) {
    console.log('DEPARTMENTS:')
    departments.slice(0, 15).forEach(agent => {
      const dept = state.departments[agent.metadata.name]
      const symbol = dept?.status === 'blocked' ? '○' : '●'
      const status = dept?.status || 'not-init'
      console.log(`${symbol} ${agent.metadata.name.padEnd(30)} ${(agent.metadata.department || 'unknown').padEnd(15)} ${status}`)
    })
    if (departments.length > 15) {
      console.log(`... and ${departments.length - 15} more`)
    }
    console.log()
  }

  if (redTeam.length > 0) {
    console.log('RED TEAM:')
    redTeam.forEach(agent => {
      const dept = state.departments[agent.metadata.name]
      const symbol = dept?.status === 'blocked' ? '○' : '●'
      console.log(`${symbol} ${agent.metadata.name.padEnd(30)} ${(agent.metadata.description || '').slice(0, 50)}`)
    })
    console.log()
  }

  console.log('Talk to any agent:')
  console.log('→ startup-os ask "ceo, give me status"')
  console.log('→ startup-os ask "legal, what are you watching"')
  console.log('→ startup-os ask "red team, challenge my assumptions"\n')
}

async function resetCompany(): Promise<void> {
  const { existsSync, rmSync } = await import('fs')
  const { join } = await import('path')

  const stateDir = join(process.cwd(), '.startup-os')

  if (existsSync(stateDir)) {
    rmSync(stateDir, { recursive: true, force: true })
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(' Company state cleared.')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
  console.log('Run: startup-os build "<idea>" to start over.\n')
}

async function connectService(service: string): Promise<void> {
  const os = new CompanyOSManager()

  if (service === 'supabase' || service === '1') {
    await setupSupabaseFlow(os)
  } else if (service === 'supabase-existing' || service === '2') {
    await connectExistingSupabase(os)
  } else {
    console.error(`Unknown service: ${service}`)
    console.error('Available: supabase')
  }
}

async function showDashboard(): Promise<void> {
  const os = new CompanyOSManager()

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(' Generating founder dashboard...')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  writeDashboard(os)

  console.log('✓ Dashboard generated')
  console.log('✓ Opening in browser...\n')

  openDashboard()
}

function showHelp(): void {
  console.log('startup-os · company runtime\n')
  console.log('Commands:')
  console.log('  build "<idea>"        Instantiate a new company from idea')
  console.log('  init <answers>        Initialize with clarifying answers')
  console.log('  ask <message>         Talk to your company')
  console.log('  status                Get CEO briefing')
  console.log('  agents                List all loaded agents')
  console.log('  dashboard             Open founder dashboard')
  console.log('  connect <service>     Connect external service (supabase)')
  console.log('  reset                 Clear company state\n')
  console.log('Example:')
  console.log('  startup-os build "AI code review for security teams"')
  console.log('  startup-os init idea "Security engineers at B2B SaaS" "Teams want automation"')
  console.log('  startup-os ask "what should I work on today"')
  console.log('  startup-os dashboard')
  console.log('  startup-os connect supabase\n')
  console.log('The .md files in ceo/, finance/exec/, marketing/exec/, engineering/exec/, etc.')
  console.log('are the agents. This runtime loads and executes them.\n')
}

// ES module: check if this file is being run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { buildCompany, initCompany, askCompany, statusBriefing, listAgents, resetCompany }
