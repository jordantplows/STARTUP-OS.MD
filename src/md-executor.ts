import { CompanyOSManager, type CompanyOS } from './company-os.js'
import type { LoadedAgent } from './md-loader.js'
import { AsyncFunction } from './async-function.js'

export interface ExecutionContext {
  os: CompanyOS
  context: string
  founderMessage?: string
}

export interface ExecutionResult {
  success: boolean
  output?: string
  error?: string
  agentName: string
}

export class MDExecutor {
  private os: CompanyOSManager

  constructor(os: CompanyOSManager) {
    this.os = os
  }

  async execute(
    agent: LoadedAgent,
    context: string,
    founderMessage?: string
  ): Promise<ExecutionResult> {
    try {
      const state = this.os.getState()

      const compiledFunction = this.compileTypeScript(agent.typescript)

      const output = await compiledFunction(state, context, founderMessage)

      return {
        success: true,
        output,
        agentName: agent.metadata.name,
      }
    } catch (error) {
      console.error(`Error executing agent ${agent.metadata.name}:`, error)
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        agentName: agent.metadata.name,
      }
    }
  }

  private compileTypeScript(typescript: string): Function {
    try {
      const wrappedCode = this.wrapTypeScriptForExecution(typescript)

      const func = AsyncFunction(
        'os',
        'context',
        'founderMessage',
        'require',
        'console',
        'process',
        wrappedCode
      ) as Function

      return func
    } catch (error) {
      console.error('TypeScript compilation error:', error)
      throw new Error(`Failed to compile TypeScript: ${error}`)
    }
  }

  private wrapTypeScriptForExecution(typescript: string): string {
    let code = typescript

    if (code.includes('import Anthropic')) {
      code = code.replace(
        /import Anthropic from ['"]@anthropic-ai\/sdk['"]/g,
        "const Anthropic = require('@anthropic-ai/sdk').default"
      )
    }

    if (code.includes("import type { CompanyOS }") || code.includes("import type {")) {
      code = code.replace(/import type \{[^}]+\} from ['"'][^'"]+['"]/g, '')
    }

    if (code.includes('export async function run')) {
      code = code.replace('export async function run', 'return async function run')
      code = `
        ${code}
        const runFunc = ${code.includes('return async function') ? '' : 'run'}
        return await runFunc(os, context, founderMessage)
      `
    } else {
      code = `
        ${code}
        return result
      `
    }

    return code
  }

  async executeMultiple(
    agents: LoadedAgent[],
    context: string,
    founderMessage?: string,
    sequential: boolean = false
  ): Promise<ExecutionResult[]> {
    if (sequential) {
      const results: ExecutionResult[] = []
      for (const agent of agents) {
        const result = await this.execute(agent, context, founderMessage)
        results.push(result)
      }
      return results
    } else {
      return Promise.all(
        agents.map(agent => this.execute(agent, context, founderMessage))
      )
    }
  }

  shouldAgentExecute(agent: LoadedAgent, state: CompanyOS): boolean {
    if (agent.metadata.watches.length === 0) {
      return false
    }

    for (const watch of agent.metadata.watches) {
      const watchLower = watch.toLowerCase()

      if (watchLower.includes('decision') && state.decisions.some(d => !d.answer)) {
        return true
      }

      if (watchLower.includes('event')) {
        const unconsumed = state.events.filter(
          e => !e.consumed.includes(agent.metadata.name)
        )
        if (unconsumed.length > 0) return true
      }

      if (watchLower.includes('founder') && state.founderInput.length > 0) {
        const lastInput = state.founderInput[state.founderInput.length - 1]
        if (lastInput && !lastInput.respondedTo.includes(agent.metadata.name)) {
          return true
        }
      }

      if (watchLower.includes('blocked')) {
        const blocked = Object.values(state.departments).some(d => d.status === 'blocked')
        if (blocked) return true
      }
    }

    return false
  }

  getTriggeredAgents(agents: LoadedAgent[], state: CompanyOS): LoadedAgent[] {
    return agents.filter(agent => this.shouldAgentExecute(agent, state))
  }
}
