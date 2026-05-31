import { CompanyOSManager } from './company-os.js'
import { AgentRuntime } from './agent-runtime.js'
import { ceoAgent } from './agents/ceo.js'
import { legalAgent } from './agents/legal.js'
import { productAgent } from './agents/product.js'
import { redTeamAgent } from './agents/red-team.js'
import type { StartupProfile } from './types.js'
import { existsSync, mkdirSync } from 'fs'
import { join } from 'path'

export class StartupOS {
  private os: CompanyOSManager
  private runtime: AgentRuntime

  private constructor(os: CompanyOSManager, runtime: AgentRuntime) {
    this.os = os
    this.runtime = runtime
  }

  static async load(): Promise<StartupOS> {
    const stateDir = join(process.cwd(), '.startup-os')
    if (!existsSync(stateDir)) {
      mkdirSync(stateDir, { recursive: true })
    }

    const os = new CompanyOSManager()
    const runtime = new AgentRuntime(os)

    runtime.registerAgent(ceoAgent)
    runtime.registerAgent(legalAgent)
    runtime.registerAgent(productAgent)
    runtime.registerAgent(redTeamAgent)

    return new StartupOS(os, runtime)
  }

  static async build(ideaString: string): Promise<{
    company: StartupOS
    clarifyingQuestions: string[]
  }> {
    const profile = await this.parseIdea(ideaString)

    const stateDir = join(process.cwd(), '.startup-os')
    if (!existsSync(stateDir)) {
      mkdirSync(stateDir, { recursive: true })
    }

    const os = new CompanyOSManager(profile)
    const runtime = new AgentRuntime(os)

    runtime.registerAgent(ceoAgent)
    runtime.registerAgent(legalAgent)
    runtime.registerAgent(productAgent)
    runtime.registerAgent(redTeamAgent)

    const company = new StartupOS(os, runtime)

    const questions = await company.generateClarifyingQuestions(ideaString)

    return { company, clarifyingQuestions: questions }
  }

  private static async parseIdea(idea: string): Promise<Partial<StartupProfile>> {
    return {
      companyName: '[PENDING]',
      oneline: idea,
      stage: 'idea',
    }
  }

  private async generateClarifyingQuestions(idea: string): Promise<string[]> {
    return [
      'What stage are you at?\n→ just an idea / validating / building / revenue',
      'Who is your first customer? Be specific.',
      "What's the one thing that has to be true for this to work?",
    ]
  }

  async applyClarifications(answers: {
    stage?: string
    customer?: string
    keyAssumption?: string
  }): Promise<void> {
    const updates: Partial<StartupProfile> = {}

    if (answers.stage) {
      if (answers.stage.includes('idea')) updates.stage = 'idea'
      else if (answers.stage.includes('validat')) updates.stage = 'validating'
      else if (answers.stage.includes('build')) updates.stage = 'building'
      else if (answers.stage.includes('revenue')) updates.stage = 'revenue'
    }

    if (answers.customer) {
      updates.targetCustomer = answers.customer
    }

    this.os.updateProfile(updates)

    if (answers.keyAssumption) {
      this.os.emitEvent({
        type: 'assumption',
        from: 'founder',
        payload: { assumption: answers.keyAssumption },
        timestamp: new Date().toISOString(),
      })
    }

    await this.initializeAllAgents()
  }

  private async initializeAllAgents(): Promise<void> {
    await this.runtime.runAllAgentsParallel('Company initialization')
  }

  async ask(message: string): Promise<Map<string, string>> {
    this.os.addFounderInput(message)

    const agents = await this.runtime.routeFounderInput(message)

    const responses = new Map<string, string>()

    for (const agentName of agents) {
      try {
        const response = await this.runtime.runAgent(
          agentName,
          'Founder message',
          message
        )

        if (response.founderMessage) {
          responses.set(agentName, response.founderMessage)
        }
      } catch (error) {
        console.error(`Error from ${agentName}:`, error)
      }
    }

    return responses
  }

  async status(): Promise<string> {
    const response = await this.runtime.runAgent(
      'ceo',
      'Provide status briefing to founder'
    )

    return response.founderMessage || 'No status available'
  }

  async listAgents(): Promise<
    Array<{
      name: string
      department: string
      role: string
      status: string
      currentFocus: string
    }>
  > {
    const state = this.os.getState()
    const agents = this.runtime.listAgents()

    return agents.map(agent => {
      const deptState = state.departments[agent.name]
      return {
        name: agent.name,
        department: agent.department,
        role: agent.role,
        status: deptState?.status || 'unknown',
        currentFocus: deptState?.currentFocus || 'Not initialized',
      }
    })
  }

  async reset(): Promise<void> {
    const stateFile = join(process.cwd(), '.startup-os', 'company.os.json')
    if (existsSync(stateFile)) {
      const fs = await import('fs/promises')
      await fs.unlink(stateFile)
    }
  }

  getState() {
    return this.os.getState()
  }
}

export const startupOS = {
  load: () => StartupOS.load(),
  build: (idea: string) => StartupOS.build(idea),
}

export * from './types.js'
export { CompanyOSManager } from './company-os.js'
export { AgentRuntime } from './agent-runtime.js'
