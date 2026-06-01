#!/usr/bin/env node

import { CompanyOSManager } from './company-os.js'
import { MDLoader } from './md-loader.js'
import { MDExecutor } from './md-executor.js'
import { routeFounderInput } from './router.js'

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
  console.log(' Company initialized. Loading agents...')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  const loader = new MDLoader()
  const agents = loader.loadAllAgents()

  console.log(`Loaded ${agents.length} agents:\n`)

  for (const agent of agents.slice(0, 10)) {
    os.initializeDepartment(agent.metadata.name, {
      currentFocus: 'Initializing',
      status: 'initializing',
    })
    console.log(`● ${agent.metadata.name.padEnd(25)} ${agent.metadata.department}`)
  }

  if (agents.length > 10) {
    console.log(`... and ${agents.length - 10} more\n`)
  }

  console.log('\nBooting CEO for first briefing...\n')

  const ceoAgent = agents.find(a => a.metadata.name === 'ceo')
  if (ceoAgent) {
    const executor = new MDExecutor(os)
    const result = await executor.execute(ceoAgent, 'Company initialization')

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(` ${os.getState().profile.companyName || 'Your Company'} · CEO`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

    if (result.success && result.output) {
      console.log(result.output)
    } else {
      console.log('CEO briefing not available yet.')
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
  }

  console.log('Your company is running.')
  console.log('Talk to it with: startup-os ask "<your message>"\n')
  console.log('Commands:')
  console.log('  startup-os ask "what should I work on today"')
  console.log('  startup-os status')
  console.log('  startup-os agents\n')
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
      console.log(`━━ ${result.agentName} ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
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
      console.log(`${symbol} ${agent.metadata.name.padEnd(30)} ${agent.metadata.department.padEnd(15)} ${status}`)
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
      console.log(`${symbol} ${agent.metadata.name.padEnd(30)} ${agent.metadata.description.slice(0, 50)}`)
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

function showHelp(): void {
  console.log('startup-os · company runtime\n')
  console.log('Commands:')
  console.log('  build "<idea>"        Instantiate a new company from idea')
  console.log('  init <answers>        Initialize with clarifying answers')
  console.log('  ask <message>         Talk to your company')
  console.log('  status                Get CEO briefing')
  console.log('  agents                List all loaded agents')
  console.log('  reset                 Clear company state\n')
  console.log('Example:')
  console.log('  startup-os build "AI code review for security teams"')
  console.log('  startup-os init idea "Security engineers at B2B SaaS" "Teams want automation"')
  console.log('  startup-os ask "what should I work on today"')
  console.log('  startup-os status\n')
  console.log('The .md files in ceo/, cfo/, strategy/, engineering/, etc.')
  console.log('are the agents. This runtime loads and executes them.\n')
}

if (require.main === module) {
  main()
}

export { buildCompany, initCompany, askCompany, statusBriefing, listAgents, resetCompany }
