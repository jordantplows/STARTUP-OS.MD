import Anthropic from '@anthropic-ai/sdk'
import type { CompanyOS, CompanyOSManager, Event } from '../company-os.js'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export class LegalAgent {
  private name = 'legal'
  private os: CompanyOSManager

  constructor(os: CompanyOSManager) {
    this.os = os
    this.os.initializeDepartment(this.name, {
      status: 'initializing',
      currentFocus: 'Setting up legal watch',
    })
  }

  watch(): Event[] {
    const state = this.os.getState()
    const triggers: Event[] = []

    const pendingDecisions = state.decisions.filter(d => !d.answer)
    pendingDecisions.forEach(d => {
      triggers.push({
        type: 'decision-needs-review',
        from: 'system',
        payload: { decision: d },
        timestamp: new Date().toISOString(),
        consumed: [],
      })
    })

    const mcpConnections = Object.entries(state.mcps).filter(
      ([_, mcp]) => mcp.connected && !mcp.legalReviewed
    )
    mcpConnections.forEach(([name, mcp]) => {
      triggers.push({
        type: 'mcp-needs-review',
        from: 'system',
        payload: { mcp: name, activates: mcp.activates },
        timestamp: new Date().toISOString(),
        consumed: [],
      })
    })

    const pricingEvents = state.events.filter(
      e => e.type === 'pricing-decision' && !e.consumed.includes(this.name)
    )
    triggers.push(...pricingEvents)

    const dataEvents = state.events.filter(
      e => e.type === 'data-handling' && !e.consumed.includes(this.name)
    )
    triggers.push(...dataEvents)

    const customerEvents = state.events.filter(
      e => e.type === 'customer-outreach' && !e.consumed.includes(this.name)
    )
    triggers.push(...customerEvents)

    if (state.profile.stage === 'revenue' || state.profile.revenue > 0) {
      const revenueEvents = state.events.filter(
        e => e.type === 'revenue-model-change' && !e.consumed.includes(this.name)
      )
      triggers.push(...revenueEvents)
    }

    return triggers
  }

  async reason(context: string, founderMessage?: string): Promise<string> {
    const state = this.os.getState()
    const triggers = this.watch()

    this.os.updateDepartment(this.name, { status: 'deciding' })

    const systemPrompt = `You are the General Counsel for this startup. Your job is to:

1. WATCH: Monitor every decision for legal/compliance risk
2. FLAG: Surface risks before they become problems
3. ADVISE: Explain the actual legal consequences, not just "be careful"
4. NEVER BLOCK: You flag risks but never block decisions — that's the founder's call

YOU ARE NOT:
- A blocker by default
- Someone who says "get a lawyer" for everything
- Risk-averse to the point of paralysis

YOU ARE:
- Practical about startup risk tolerance
- Specific about which risks matter and why
- Clear about the difference between "illegal" and "risky"
- Aware that early-stage startups can't afford to be perfect

WHAT YOU WATCH FOR:

CRITICAL (flag immediately, recommend blocking):
- Securities law violations (promising returns, unlicensed fundraising)
- Clear GDPR/CCPA violations with user data
- IP theft or copyright infringement
- Fraud or misrepresentation to customers
- Employment law violations (misclassifying contractors, discrimination)

HIGH RISK (flag strongly, explain consequences):
- Contracts without proper terms
- Data collection without privacy policy
- Customer outreach that looks like spam
- Pricing that might violate regulations
- Using third-party tools without reviewing their terms

MEDIUM RISK (flag, suggest mitigation):
- Industry-specific compliance requirements
- Intellectual property not properly documented
- Terms of service that create unnecessary liability
- Marketing claims that could be seen as deceptive

LOW RISK (note but don't escalate):
- Generic startup risks everyone takes
- Things that can be fixed later without major consequences

WHEN YOU FLAG A RISK:
1. State the specific risk, not "this might be a problem"
2. Explain the actual consequence if it goes wrong
3. Suggest a concrete mitigation if there is one
4. Say whether you recommend blocking or proceeding with caution
5. NEVER actually block — always defer to founder

DO NOT:
- Be vague about risk ("this could be concerning")
- Recommend "talk to a lawyer" without explaining what's actually at stake
- Block things that are standard startup practice
- Ignore stage-appropriate risk tolerance

TONE:
- Direct about actual legal issues
- Practical about startup realities
- Specific about consequences
- Clear about your recommendations

CURRENT COMPANY STATE:
${JSON.stringify(state, null, 2)}

WATCH TRIGGERS:
${JSON.stringify(triggers, null, 2)}

CONTEXT: ${context}

${founderMessage ? `FOUNDER MESSAGE: ${founderMessage}` : ''}

Flag any legal risks and provide specific guidance. What should the founder know?`

    const response = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: 'Review for legal risks and respond.',
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
    const riskLevel = this.assessRiskLevel(reasoning)

    this.os.recordAction(this.name, {
      type: 'legal-review',
      description: reasoning.slice(0, 200),
      timestamp: new Date().toISOString(),
      impact: riskLevel === 'critical' ? ['all-departments', 'founder'] : ['founder'],
    })

    if (riskLevel === 'critical') {
      this.os.emitEvent({
        type: 'legal-flag',
        from: this.name,
        payload: {
          severity: 'critical',
          summary: reasoning.slice(0, 200),
        },
      })
    }

    this.os.updateDepartment(this.name, {
      status: 'watching',
      currentFocus: `Watching ${riskLevel} risk items`,
    })
  }

  private assessRiskLevel(reasoning: string): 'low' | 'medium' | 'high' | 'critical' {
    const lower = reasoning.toLowerCase()

    if (
      lower.includes('securities') ||
      lower.includes('fraud') ||
      lower.includes('illegal')
    ) {
      return 'critical'
    }

    if (
      lower.includes('gdpr') ||
      lower.includes('ccpa') ||
      lower.includes('privacy') ||
      lower.includes('contract')
    ) {
      return 'high'
    }

    if (
      lower.includes('terms') ||
      lower.includes('compliance') ||
      lower.includes('ip')
    ) {
      return 'medium'
    }

    return 'low'
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
