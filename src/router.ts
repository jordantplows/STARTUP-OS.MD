import Anthropic from '@anthropic-ai/sdk'
import type { CompanyOS } from './company-os.js'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export interface RoutingDecision {
  agents: string[]
  sequential: boolean
  reasoning: string
}

export async function routeFounderInput(
  message: string,
  state: CompanyOS
): Promise<RoutingDecision> {
  const routingPrompt = `You are the startup-os routing layer.
The founder has said something. Determine which agents should respond and in what order.

FOUNDER MESSAGE: "${message}"

ACTIVE AGENTS: ceo, legal, product, red-team

CURRENT COMPANY STATE:
- Stage: ${state.profile.stage}
- Target Customer: ${state.profile.targetCustomer}
- Problem: ${state.profile.problem}

PENDING DECISIONS:
${state.decisions
  .filter(d => !d.answer)
  .map(d => `- ${d.question} (from ${d.from})`)
  .join('\n') || 'None'}

RECENT EVENTS (last 10):
${state.events
  .slice(-10)
  .map(e => `- ${e.type} from ${e.from}`)
  .join('\n') || 'None'}

DEPARTMENT STATUS:
${Object.entries(state.departments)
  .map(([name, dept]) => `- ${name}: ${dept.status} (${dept.currentFocus})`)
  .join('\n') || 'No departments initialized'}

ROUTING RULES:
1. CEO handles: coordination, status requests, "what should I do", general questions
2. Legal handles: anything with "legal", compliance, risk, terms, contracts
3. Product handles: features, MVP, roadmap, specs, "what to build"
4. Red Team handles: anything with "challenge", "risk", "assumption", or when founder needs hard truth

Return ONLY a JSON object with this exact structure:
{
  "agents": ["agent1", "agent2"],
  "sequential": true,
  "reasoning": "brief explanation"
}

The agents array should list which agents need to respond.
Set sequential to true if they should respond in order, false for parallel.
Keep reasoning under 50 words.`

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

    const content = response.content[0]
    if (!content || content.type !== 'text') {
      return defaultRouting('CEO fallback: unexpected response format')
    }

    const routing = JSON.parse(content.text) as RoutingDecision

    if (!routing.agents || !Array.isArray(routing.agents) || routing.agents.length === 0) {
      return defaultRouting('CEO fallback: no agents specified')
    }

    return routing
  } catch (error) {
    console.error('Routing error:', error)
    return defaultRouting('CEO fallback: routing error')
  }
}

function defaultRouting(reasoning: string): RoutingDecision {
  return {
    agents: ['ceo'],
    sequential: false,
    reasoning,
  }
}

export function shouldAgentRespond(
  agentName: string,
  message: string,
  state: CompanyOS
): boolean {
  const lowerMessage = message.toLowerCase()

  switch (agentName) {
    case 'ceo':
      return (
        lowerMessage.includes('status') ||
        lowerMessage.includes('what should i') ||
        lowerMessage.includes('coordinate') ||
        lowerMessage.includes('brief') ||
        state.decisions.filter(d => !d.answer && d.blocking.length > 2).length > 0
      )

    case 'legal':
      return (
        lowerMessage.includes('legal') ||
        lowerMessage.includes('compliance') ||
        lowerMessage.includes('risk') ||
        lowerMessage.includes('contract') ||
        lowerMessage.includes('terms') ||
        state.events.some(e => e.type === 'pricing-decision' && !e.consumed.includes('legal'))
      )

    case 'product':
      return (
        lowerMessage.includes('product') ||
        lowerMessage.includes('feature') ||
        lowerMessage.includes('build') ||
        lowerMessage.includes('mvp') ||
        lowerMessage.includes('roadmap') ||
        lowerMessage.includes('spec') ||
        state.events.some(e => e.type === 'spec-needed' && !e.consumed.includes('product'))
      )

    case 'red-team':
      return (
        lowerMessage.includes('red team') ||
        lowerMessage.includes('challenge') ||
        lowerMessage.includes('assumption') ||
        lowerMessage.includes('risk') ||
        lowerMessage.includes('wrong') ||
        lowerMessage.includes('devil') ||
        state.events.some(e => e.type === 'assumption' && !e.consumed.includes('red-team'))
      )

    default:
      return false
  }
}
