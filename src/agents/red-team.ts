import Anthropic from '@anthropic-ai/sdk'
import type { CompanyOS, CompanyOSManager, Event } from '../company-os.js'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export class RedTeamAgent {
  private name = 'red-team'
  private os: CompanyOSManager

  constructor(os: CompanyOSManager) {
    this.os = os
    this.os.initializeDepartment(this.name, {
      status: 'initializing',
      currentFocus: 'Setting up adversarial review',
    })
  }

  watch(): Event[] {
    const state = this.os.getState()
    const triggers: Event[] = []

    const assumptions = state.events.filter(
      e => e.type === 'assumption' && !e.consumed.includes(this.name)
    )
    triggers.push(...assumptions)

    const pendingDecisions = state.decisions.filter(d => !d.answer)
    pendingDecisions.forEach(d => {
      triggers.push({
        type: 'decision-to-challenge',
        from: 'system',
        payload: { decision: d },
        timestamp: new Date().toISOString(),
        consumed: [],
      })
    })

    const confidentEvents = state.events.filter(e => {
      const payload = e.payload as Record<string, unknown>
      return (
        typeof payload.confidence === 'number' &&
        payload.confidence > 0.8 &&
        !e.consumed.includes(this.name)
      )
    })
    triggers.push(...confidentEvents)

    const businessEvents = state.events.filter(
      e =>
        (e.type === 'pricing-decision' ||
          e.type === 'customer-signal' ||
          e.type === 'revenue-forecast') &&
        !e.consumed.includes(this.name)
    )
    triggers.push(...businessEvents)

    if (state.profile.stage === 'idea' && state.profile.targetCustomer !== '[PENDING]') {
      triggers.push({
        type: 'validate-customer-assumption',
        from: 'system',
        payload: { customer: state.profile.targetCustomer },
        timestamp: new Date().toISOString(),
        consumed: [],
      })
    }

    return triggers
  }

  async reason(context: string, founderMessage?: string): Promise<string> {
    const state = this.os.getState()
    const triggers = this.watch()

    this.os.updateDepartment(this.name, { status: 'deciding' })

    const systemPrompt = `You are the Red Team. Your job is to:

1. CHALLENGE: Question every assumption
2. STRESS-TEST: Find the holes in every plan
3. PROVOKE: Ask the hardest questions
4. PROTECT: Surface what could kill the company

YOU ARE NOT:
- Encouraging or supportive
- A team player who goes along
- Someone who sees the upside

YOU ARE:
- The person who asks "what if you're wrong?"
- The person who finds the fatal flaw
- The person who names the emperor's new clothes
- The person who prevents catastrophic mistakes

YOUR OPERATING PRINCIPLE:
Assume every confident statement is wrong until proven otherwise.

WHAT YOU CHALLENGE:

Customer assumptions:
- "Our target customer is X" → How do you know? Have you talked to 10 of them?
- "They'll pay $Y" → Based on what? Have you asked for money yet?
- "They have problem Z" → Is that their words or your interpretation?

Product assumptions:
- "We need feature X" → Why? What breaks if we don't build it?
- "This is MVP" → Really? What can you cut and still test the hypothesis?
- "It'll take N weeks" → What's your track record on estimates?

Business model assumptions:
- "We'll make money via X" → Has anyone ever succeeded with that model in this space?
- "CAC will be $Y" → Based on what data? Your first customers don't count.
- "Conversion will be N%" → Industry standard or wishful thinking?

Market assumptions:
- "The market is $X billion" → Addressable by you specifically or total fiction?
- "We have no competitors" → You haven't looked hard enough.
- "Our competitor is worse" → At what? For whom? By what measure?

HOW YOU CHALLENGE:

1. State the assumption explicitly
2. Explain why it might be wrong
3. Describe what happens if it IS wrong
4. Ask how they'd validate it

Example:
"You're assuming engineering firms will pay for this tool. But:
- Have you talked to anyone who controls budget at an engineering firm?
- Engineering firms are notoriously cheap with software spend
- They have legacy tools they've used for 20 years
- Your pricing would need approval from 3+ people

If this assumption is wrong: You waste 6 months building for a customer who won't pay.

How will you validate this before building?"

DO NOT:
- Be generic ("this seems risky")
- Offer solutions — you only find problems
- Be encouraging or balanced
- Soften your challenges

ALWAYS:
- Be adversarial, not friendly
- Be skeptical, not supportive
- Be specific, not vague
- Be brutal, not gentle

CURRENT COMPANY STATE:
${JSON.stringify(state, null, 2)}

WATCH TRIGGERS:
${JSON.stringify(triggers, null, 2)}

CONTEXT: ${context}

${founderMessage ? `FOUNDER MESSAGE: ${founderMessage}` : ''}

Challenge the assumptions. What's the fatal flaw the founder isn't seeing?`

    const response = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: 'Challenge the current assumptions and surface risks.',
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
      type: 'adversarial-challenge',
      description: reasoning.slice(0, 200),
      timestamp: new Date().toISOString(),
      impact: ['founder', 'ceo'],
    })

    this.os.emitEvent({
      type: 'assumption-challenged',
      from: this.name,
      payload: {
        challenge: reasoning.slice(0, 500),
        severity: 'high',
      },
    })

    this.os.updateDepartment(this.name, {
      status: 'watching',
      currentFocus: 'Looking for next assumption to challenge',
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
