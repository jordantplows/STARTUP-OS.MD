#!/usr/bin/env node

import { CompanyOSManager } from './company-os.js'
import { routeFounderInput } from './router.js'
import { CEOAgent } from './agents/ceo.js'
import { LegalAgent } from './agents/legal.js'
import { ProductAgent } from './agents/product.js'
import { RedTeamAgent } from './agents/red-team.js'

interface Agent {
  name: string
  run: (context: string, founderMessage?: string) => Promise<string>
}

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

  console.log('What stage are you at?')
  console.log('→ just an idea / validating / building / revenue\n')

  console.log('Who is your first customer? Be specific.')
  console.log('→ (Type your answer)\n')

  console.log("What's the one thing that has to be true for this to work?")
  console.log('→ (Type your answer)\n')

  console.log('\nOnce you answer, run:')
  console.log('startup-os init <stage> "<customer>" "<key-assumption>"')
}

async function initCompany(
  stage: string,
  customer: string,
  assumption: string
): Promise<void> {
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
  console.log(' Company initialized. Agents starting...')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  const agents = await bootAllAgents(os)

  console.log('● CEO          → coordinating')
  console.log('● Legal        → watching')
  console.log('● Product      → defining MVP')
  console.log('● Red Team     → challenging assumptions\n')

  const ceo = agents.find(a => a.name === 'ceo')
  if (ceo) {
    const briefing = await ceo.run('Company initialization')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(` ${os.getState().profile.companyName || 'Your Company'} · CEO`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    console.log(briefing)
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
  }

  console.log('Your company is running.')
  console.log('Talk to it with: startup-os ask "<your message>"')
}

async function askCompany(message: string): Promise<void> {
  const os = new CompanyOSManager()
  const agents = await bootAllAgents(os)

  os.addFounderInput(message)

  const routing = await routeFounderInput(message, os.getState())

  console.log(`\nRouting to: ${routing.agents.join(', ')}`)
  console.log(`Reason: ${routing.reasoning}\n`)

  const responses: Array<{ agent: string; message: string }> = []

  if (routing.sequential) {
    for (const agentName of routing.agents) {
      const agent = agents.find(a => a.name === agentName)
      if (agent) {
        const response = await agent.run('Founder message', message)
        responses.push({ agent: agentName, message: response })
      }
    }
  } else {
    const promises = routing.agents.map(async agentName => {
      const agent = agents.find(a => a.name === agentName)
      if (agent) {
        const response = await agent.run('Founder message', message)
        return { agent: agentName, message: response }
      }
      return null
    })

    const results = await Promise.all(promises)
    responses.push(...results.filter((r): r is { agent: string; message: string } => r !== null))
  }

  for (const { agent, message: msg } of responses) {
    console.log(`━━ ${agent} ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
    console.log(msg)
    console.log()
  }
}

async function statusBriefing(): Promise<void> {
  const os = new CompanyOSManager()
  const agents = await bootAllAgents(os)

  const ceo = agents.find(a => a.name === 'ceo')
  if (!ceo) {
    console.error('CEO agent not available')
    return
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(' Status Briefing')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  const status = await ceo.run('Status briefing request')

  console.log(status)
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
}

async function listAgents(): Promise<void> {
  const os = new CompanyOSManager()
  const state = os.getState()

  console.log(`\nACTIVE AGENTS (${Object.keys(state.departments).length} running)\n`)

  for (const [name, dept] of Object.entries(state.departments)) {
    const symbol = dept.status === 'blocked' ? '○' : '●'
    console.log(`${symbol} ${name.padEnd(15)} ${dept.status.padEnd(12)} ${dept.currentFocus}`)
  }

  console.log('\nTalk to any agent:')
  console.log('→ startup-os ask "legal, explain the risk you flagged"')
  console.log('→ startup-os ask "red team, what are you challenging"')
  console.log('→ startup-os ask "product, show me the roadmap"\n')
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
  console.log('  build "<idea>"        Instantiate a new company')
  console.log('  ask <message>         Talk to your company')
  console.log('  status                Get CEO briefing')
  console.log('  agents                List all active agents')
  console.log('  reset                 Clear company state\n')
  console.log('Example:')
  console.log('  startup-os build "AI-powered code review for security teams"')
  console.log('  startup-os ask "what should I work on today"')
  console.log('  startup-os status\n')
}

async function bootAllAgents(os: CompanyOSManager): Promise<Agent[]> {
  const ceo = new CEOAgent(os)
  const legal = new LegalAgent(os)
  const product = new ProductAgent(os)
  const redTeam = new RedTeamAgent(os)

  return [
    { name: 'ceo', run: ceo.run.bind(ceo) },
    { name: 'legal', run: legal.run.bind(legal) },
    { name: 'product', run: product.run.bind(product) },
    { name: 'red-team', run: redTeam.run.bind(redTeam) },
  ]
}

if (require.main === module) {
  main()
}

export { buildCompany, askCompany, statusBriefing, listAgents, resetCompany }
