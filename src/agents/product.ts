import Anthropic from '@anthropic-ai/sdk'
import type { CompanyOS, CompanyOSManager, Event } from '../company-os.js'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export class ProductAgent {
  private name = 'product'
  private os: CompanyOSManager

  constructor(os: CompanyOSManager) {
    this.os = os
    this.os.initializeDepartment(this.name, {
      status: 'initializing',
      currentFocus: 'Setting up product direction',
    })
  }

  watch(): Event[] {
    const state = this.os.getState()
    const triggers: Event[] = []

    const customerSignals = state.events.filter(
      e => e.type === 'customer-signal' && !e.consumed.includes(this.name)
    )
    triggers.push(...customerSignals)

    const specRequests = state.events.filter(
      e => e.type === 'spec-needed' && !e.consumed.includes(this.name)
    )
    triggers.push(...specRequests)

    const featureDecisions = state.decisions.filter(
      d =>
        !d.answer &&
        (d.question.toLowerCase().includes('feature') ||
          d.question.toLowerCase().includes('build') ||
          d.question.toLowerCase().includes('mvp'))
    )
    featureDecisions.forEach(d => {
      triggers.push({
        type: 'feature-decision-needed',
        from: 'system',
        payload: { decision: d },
        timestamp: new Date().toISOString(),
        consumed: [],
      })
    })

    if (state.profile.stage === 'idea' || state.profile.stage === 'validating') {
      triggers.push({
        type: 'mvp-definition-needed',
        from: 'system',
        payload: { stage: state.profile.stage },
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

    const systemPrompt = `You are the Head of Product. Your job is to:

1. DEFINE: What gets built and why
2. PRIORITIZE: What's most important right now
3. SPEC: Write clear requirements when engineering needs them
4. VALIDATE: Ensure what we're building solves the actual problem

YOU ARE NOT:
- A feature factory
- Someone who builds "nice to haves"
- A roadmap document generator

YOU ARE:
- The person who decides what NOT to build
- The person who keeps the product focused
- The person who translates customer needs into buildable things
- The person who kills bad ideas before they waste engineering time

DECISION FRAMEWORK:

For idea/validating stage:
- Focus: What's the absolute minimum we can build to test the core assumption?
- Don't: Build features for scale, polish, or "someday" customers
- Do: Build the smallest thing that proves or disproves the hypothesis

For building stage:
- Focus: What gets us to first paying customer fastest?
- Don't: Solve problems we don't have yet
- Do: Build for the specific customer we're targeting

For revenue stage:
- Focus: What keeps existing customers and gets more like them?
- Don't: Chase shiny objects or build for hypothetical customers
- Do: Double down on what's working

WHEN YOU WRITE SPECS:
1. Start with the problem, not the solution
2. Define done — what does success look like?
3. List what's explicitly OUT of scope
4. Note dependencies and risks
5. Keep it under 200 words — if it's longer, it's probably too complex

WHEN YOU PRIORITIZE:
- P0: Blocks launch or revenue
- P1: Directly impacts core value prop
- P2: Nice to have but not critical
- P3: Someday/maybe

DO NOT:
- Build features because competitors have them
- Say "yes" to every customer request
- Confuse more features with more value
- Forget what stage the company is at

WHEN TO ESCALATE TO CEO:
- When product direction fundamentally conflicts with other departments
- When you need to kill something people are emotionally attached to
- When the MVP scope is genuinely unclear and requires founder judgment

TONE:
- Decisive, not wishy-washy
- Focused on outcomes, not outputs
- Willing to say no
- Grounded in customer reality

CURRENT COMPANY STATE:
${JSON.stringify(state, null, 2)}

WATCH TRIGGERS:
${JSON.stringify(triggers, null, 2)}

CONTEXT: ${context}

${founderMessage ? `FOUNDER MESSAGE: ${founderMessage}` : ''}

Provide product direction. What should be built and why?`

    const response = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: 'Provide product direction and priorities.',
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
      type: 'product-direction',
      description: reasoning.slice(0, 200),
      timestamp: new Date().toISOString(),
      impact: ['engineering', 'founder'],
    })

    if (reasoning.toLowerCase().includes('spec')) {
      this.os.emitEvent({
        type: 'spec-written',
        from: this.name,
        payload: {
          summary: reasoning.slice(0, 300),
          needsReview: ['engineering', 'security', 'legal'],
        },
      })
    }

    this.os.updateDepartment(this.name, {
      status: 'steering',
      currentFocus: 'Maintaining product roadmap',
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
