#!/usr/bin/env node

import { startupOS } from '../dist/index.js'

const args = process.argv.slice(2)
const command = args[0]
const rest = args.slice(1).join(' ')

async function main() {
  try {
    switch (command) {
      case 'build': {
        if (!rest) {
          console.error('Usage: startup-os build "<your startup idea>"')
          process.exit(1)
        }

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log(' Instantiating your company...')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

        const { company, clarifyingQuestions } = await startupOS.build(rest)

        console.log(`I understand you're building: ${rest}\n`)
        console.log('Before I instantiate your company, three quick questions:\n')

        for (const question of clarifyingQuestions) {
          console.log(question)
          console.log()
        }

        console.log('\nType your answers and then run:')
        console.log('/startup-os init <stage> "<customer>" "<assumption>"')

        break
      }

      case 'init': {
        const [stage, customer, assumption] = rest.match(/"[^"]+"|[^\s]+/g) || []

        const company = await startupOS.load()
        await company.applyClarifications({
          stage: stage?.replace(/"/g, ''),
          customer: customer?.replace(/"/g, ''),
          keyAssumption: assumption?.replace(/"/g, ''),
        })

        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log(' Company initialized. Agents starting...')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

        const statusMessage = await company.status()
        console.log(statusMessage)

        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log(` ${company.getState().profile.companyName || 'Your Company'} is running.`)
        console.log(' Agents active · all watching · all coordinating')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

        console.log('Your company runs here, in Claude Code.')
        console.log('Agents will surface decisions as they arise.')
        console.log('You respond. They steer.\n')

        console.log('Talk to your company:')
        console.log('→ /startup-os ask what should I work on today')
        console.log('→ /startup-os ask legal, what are you watching')
        console.log('→ /startup-os status')
        console.log('→ /startup-os agents')

        break
      }

      case 'ask': {
        if (!rest) {
          console.error('Usage: startup-os ask <your message>')
          process.exit(1)
        }

        const company = await startupOS.load()
        const responses = await company.ask(rest)

        console.log()
        for (const [agent, message] of responses) {
          console.log(`━━ ${agent} ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
          console.log(message)
          console.log()
        }

        break
      }

      case 'status': {
        const company = await startupOS.load()
        const status = await company.status()

        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log(' Status Briefing')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
        console.log(status)
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

        break
      }

      case 'agents': {
        const company = await startupOS.load()
        const agents = await company.listAgents()

        console.log(`\nACTIVE AGENTS (${agents.length} running)\n`)

        for (const agent of agents) {
          const symbol = agent.status === 'blocked' ? '○' : '●'
          console.log(`${symbol} ${agent.name.padEnd(15)} ${agent.status.padEnd(12)} ${agent.currentFocus}`)
        }

        console.log('\nTalk to any agent directly:')
        console.log('→ /startup-os ask legal, explain the risk you flagged')
        console.log('→ /startup-os ask red team, what are you challenging')
        console.log('→ /startup-os ask product, show me the roadmap\n')

        break
      }

      case 'reset': {
        const company = await startupOS.load()
        await company.reset()

        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log(' Company state cleared.')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
        console.log('Run /startup-os build "<idea>" to start over.\n')

        break
      }

      default: {
        console.log('startup-os · company runtime\n')
        console.log('Commands:')
        console.log('  build "<idea>"        Instantiate a new company')
        console.log('  ask <message>         Talk to your company')
        console.log('  status                Get CEO briefing')
        console.log('  agents                List all active agents')
        console.log('  reset                 Clear company state\n')
        console.log('Example:')
        console.log('  /startup-os build "AI-powered code review for security teams"')
        console.log('  /startup-os ask what should I work on today')
        console.log('  /startup-os status\n')
      }
    }
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

main()
