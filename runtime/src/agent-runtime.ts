import Anthropic from '@anthropic-ai/sdk'
import type {
  CompanyOS,
  AgentDefinition,
  AgentResponse,
  WatchCondition,
} from './types.js'
import { CompanyOSManager } from './company-os.js'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export class AgentRuntime {
  private os: CompanyOSManager
  private agents: Map<string, AgentDefinition>

  constructor(os: CompanyOSManager) {
    this.os = os
    this.agents = new Map()
  }

  registerAgent(agent: AgentDefinition): void {
    this.agents.set(agent.name, agent)
    this.os.initializeDepartment(agent.name, {
      currentFocus: 'Initializing',
      status: 'initializing',
    })
  }

  async checkWatches(agentName: string): Promise<unknown[]> {
    const agent = this.agents.get(agentName)
    if (!agent) return []

    const state = this.os.getState()
    const triggers: unknown[] = []

    for (const watch of agent.watches) {
      const result = watch(state)
      if (Array.isArray(result) && result.length > 0) {
        triggers.push(...result)
      } else if (result === true) {
        triggers.push(true)
      }
    }

    return triggers
  }

  async runAgent(
    agentName: string,
    context: string,
    founderMessage?: string
  ): Promise<AgentResponse> {
    const agent = this.agents.get(agentName)
    if (!agent) {
      throw new Error(`Agent ${agentName} not registered`)
    }

    const state = this.os.getState()
    const triggers = await this.checkWatches(agentName)

    this.os.updateDepartment(agentName, { status: 'deciding' })

    const systemPrompt = `${agent.systemPrompt}

CURRENT COMPANY STATE:
${JSON.stringify(state, null, 2)}

YOUR DEPARTMENT STATE:
${JSON.stringify(state.departments[agentName], null, 2)}

WATCH TRIGGERS:
${JSON.stringify(triggers, null, 2)}

CONTEXT:
${context}

${founderMessage ? `FOUNDER MESSAGE:\n${founderMessage}\n` : ''}

Your response should be structured JSON with these optional fields:
{
  "action": {
    "type": "string",
    "description": "what you're doing",
    "timestamp": "ISO string",
    "impact": ["dept1", "dept2"]
  },
  "events": [{
    "type": "event-type",
    "from": "${agentName}",
    "payload": {}
  }],
  "decisions": [{
    "from": "${agentName}",
    "question": "What do you need to decide?",
    "context": "Why it matters",
    "blocking": ["dept-name"]
  }],
  "stateUpdates": {
    "status": "watching" | "deciding" | "steering" | "blocked",
    "currentFocus": "what you're focusing on now"
  },
  "founderMessage": "Direct message to the founder — brief, specific, actionable"
}

Be specific. Never generic. Always grounded in the actual company state.`

    try {
      const response = await client.messages.create({
        model: 'claude-opus-4-8',
        max_tokens: 8192,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: 'Assess current state and respond.',
          },
        ],
      })

      const content = response.content?.[0]
      if (!content || content.type !== 'text') {
        throw new Error('Unexpected response type from Claude')
      }

      const agentResponse: AgentResponse = JSON.parse(content.text)

      if (agentResponse.action) {
        this.os.recordAction(agentName, {
          ...agentResponse.action,
          timestamp: new Date().toISOString(),
        })
      }

      if (agentResponse.events) {
        agentResponse.events.forEach(event => {
          this.os.emitEvent(event)
        })
      }

      if (agentResponse.decisions) {
        agentResponse.decisions.forEach(decision => {
          this.os.addDecision(decision)
        })
      }

      if (agentResponse.stateUpdates) {
        this.os.updateDepartment(agentName, agentResponse.stateUpdates)
      }

      const unconsumedEvents = this.os.getUnconsumedEvents(agentName)
      unconsumedEvents.forEach((_, idx) => {
        this.os.markEventConsumed(idx, agentName)
      })

      return agentResponse
    } catch (error) {
      console.error(`Error running agent ${agentName}:`, error)
      this.os.updateDepartment(agentName, { status: 'blocked' })
      throw error
    }
  }

  async runAllAgentsParallel(context: string): Promise<Map<string, AgentResponse>> {
    const results = new Map<string, AgentResponse>()
    const promises = Array.from(this.agents.keys()).map(async agentName => {
      try {
        const response = await this.runAgent(agentName, context)
        results.set(agentName, response)
      } catch (error) {
        console.error(`Agent ${agentName} failed:`, error)
      }
    })

    await Promise.all(promises)
    return results
  }

  async routeFounderInput(message: string): Promise<string[]> {
    const state = this.os.getState()

    const routingPrompt = `You are the startup-os routing layer.
The founder has said something. Determine which agents should respond and in what order.

FOUNDER MESSAGE: "${message}"

ACTIVE AGENTS: ${Array.from(this.agents.keys()).join(', ')}

CURRENT DECISIONS PENDING:
${state.decisions.map(d => `- ${d.question} (from ${d.from})`).join('\n')}

RECENT EVENTS:
${state.events.slice(-10).map(e => `- ${e.type} from ${e.from}`).join('\n')}

Return ONLY a JSON object with this structure:
{
  "agents": ["agent1", "agent2"],
  "sequential": true
}

The agents array should list which agents need to respond to this message.
Set sequential to true if they should respond in order, false for parallel.`

    try {
      const response = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: routingPrompt,
        messages: [
          {
            role: 'user',
            content: 'Route this message.',
          },
        ],
      })

      const content = response.content?.[0]
      if (!content || content.type !== 'text') {
        return ['ceo']
      }

      const routing = JSON.parse(content.text)
      return routing.agents || ['ceo']
    } catch (error) {
      console.error('Routing error:', error)
      return ['ceo']
    }
  }

  getAgent(name: string): AgentDefinition | undefined {
    return this.agents.get(name)
  }

  listAgents(): AgentDefinition[] {
    return Array.from(this.agents.values())
  }
}
