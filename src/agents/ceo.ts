import Anthropic from '@anthropic-ai/sdk'
import type { CompanyOS, CompanyOSManager, Event } from '../company-os.js'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export class CEOAgent {
  private name = 'ceo'
  private os: CompanyOSManager

  constructor(os: CompanyOSManager) {
    this.os = os
    this.os.initializeDepartment(this.name, {
      status: 'initializing',
      currentFocus: 'Setting up company coordination',
    })
  }

  watch(): Event[] {
    const state = this.os.getState()
    const triggers: Event[] = []

    const blockedDepartments = Object.entries(state.departments).filter(
      ([_, dept]) => dept.status === 'blocked'
    )
    if (blockedDepartments.length > 0) {
      triggers.push({
        type: 'departments-blocked',
        from: 'system',
        payload: { blocked: blockedDepartments.map(([name]) => name) },
        timestamp: new Date().toISOString(),
        consumed: [],
      })
    }

    const criticalDecisions = state.decisions.filter(
      d => !d.answer && d.blocking.length > 2
    )
    if (criticalDecisions.length > 0) {
      triggers.push({
        type: 'critical-decisions-pending',
        from: 'system',
        payload: { decisions: criticalDecisions },
        timestamp: new Date().toISOString(),
        consumed: [],
      })
    }

    const conflicts = state.events.filter(
      e => (e.type === 'conflict' || e.type === 'escalation') && !e.consumed.includes(this.name)
    )
    triggers.push(...conflicts)

    const lastInput = state.founderInput[state.founderInput.length - 1]
    if (lastInput && lastInput.respondedTo.length === 0) {
      triggers.push({
        type: 'founder-input',
        from: 'founder',
        payload: { message: lastInput.message },
        timestamp: lastInput.timestamp,
        consumed: [],
      })
    }

    return triggers
  }

  async reason(context: string, founderMessage?: string): Promise<string> {
    const state = this.os.getState()
    const triggers = this.watch()

    this.os.updateDepartment(this.name, { status: 'deciding' })

    const systemPrompt = `You are the CEO of this startup. Your job is to:

1. COORDINATE: Read all department states and ensure they're aligned
2. DECIDE: When multiple departments conflict or are blocked, make the call
3. BRIEF: Give the founder clear, specific updates on company state
4. STEER: Set direction when the company is drifting

YOU ARE NOT:
- A document writer
- A cheerleader
- A generic advisor

YOU ARE:
- The person who makes the hard calls
- The person who knows everything happening across all departments
- The person who surfaces the most important decisions to the founder
- The person who keeps departments from duplicating work or fighting

WHEN TO SURFACE DECISIONS TO THE FOUNDER:
- When there's genuine uncertainty that requires the founder's judgment
- When departments are blocked on something only the founder can answer
- When you see a critical risk the founder needs to know about immediately
- When the company is about to spend significant time/money on the wrong thing

DO NOT:
- Ask the founder to decide minor implementation details
- Surface questions other departments should resolve themselves
- Be vague or generic — always specific to THIS company's actual state
- Write in platitudes — say what's actually happening

YOUR RESPONSES SHOULD:
- Lead with what's most important right now
- Be grounded in actual department states, not generic startup advice
- Make clear recommendations when you have them
- Admit when you need founder input to proceed

TONE:
- Direct, not wordy
- Confident but not overconfident
- Specific, never generic
- Action-oriented

CURRENT COMPANY STATE:
${JSON.stringify(state, null, 2)}

WATCH TRIGGERS:
${JSON.stringify(triggers, null, 2)}

CONTEXT: ${context}

${founderMessage ? `FOUNDER MESSAGE: ${founderMessage}` : ''}

Respond with specific guidance for this company. What should the founder know and do right now?`

    const response = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: 'Assess the company state and respond to the founder.',
        },
      ],
    })

    const content = response.content[0]
    if (!content || content.type !== 'text') {
      throw new Error('Unexpected response from Claude')
    }

    return content.text
  }

  async act(reasoning: string): Promise<void> {
    this.os.recordAction(this.name, {
      type: 'briefing',
      description: reasoning.slice(0, 200),
      timestamp: new Date().toISOString(),
      impact: ['founder'],
    })

    this.os.updateDepartment(this.name, {
      status: 'watching',
      currentFocus: 'Monitoring all departments',
    })
  }

  async coordinate(): Promise<void> {
    const unconsumed = this.os.getUnconsumedEvents(this.name)
    unconsumed.forEach((_, idx) => {
      this.os.markEventConsumed(idx, this.name)
    })
  }

  async run(context: string, founderMessage?: string): Promise<string> {
    this.watch()
    const response = await this.reason(context, founderMessage)
    await this.act(response)
    await this.coordinate()
    return response
  }
}
