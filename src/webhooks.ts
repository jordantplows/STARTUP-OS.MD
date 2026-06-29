import { CompanyOSManager } from './company-os.js'
import express, { Express, Request, Response } from 'express'

// ============================================================================
// WEBHOOK SYSTEM
// ============================================================================

interface WebhookRegistration {
  source: string
  eventType: string
  agentName: string
}

interface WebhookPayload {
  source: string
  eventType: string
  payload: Record<string, unknown>
  timestamp: string
}

/**
 * Inbound event handler
 * External services post events here and agents wake up to handle them
 */
export class WebhookManager {
  private os: CompanyOSManager
  private app: Express
  private registrations: Map<string, WebhookRegistration[]> = new Map()
  private agentHandlers: Map<string, (payload: any) => Promise<void>> = new Map()

  constructor(os: CompanyOSManager) {
    this.os = os
    this.app = express()
    this.app.use(express.json())

    this.setupRoutes()
    this.loadRegistrations()
  }

  /**
   * Registers a webhook mapping: source + eventType → agent
   */
  registerWebhook(source: string, eventType: string, agentName: string): void {
    const key = `${source}:${eventType}`

    if (!this.registrations.has(key)) {
      this.registrations.set(key, [])
    }

    this.registrations.get(key)!.push({
      source,
      eventType,
      agentName
    })

    console.log(`[webhooks] Registered: ${source}/${eventType} → ${agentName}`)

    // Save to company.os
    this.saveRegistrations()
  }

  /**
   * Registers an agent handler function
   */
  registerAgentHandler(agentName: string, handler: (payload: any) => Promise<void>): void {
    this.agentHandlers.set(agentName, handler)
    console.log(`[webhooks] Registered handler for ${agentName}`)
  }

  /**
   * Handles an incoming webhook
   */
  async handleIncoming(source: string, payload: Record<string, unknown>): Promise<void> {
    const eventType = (payload.type || payload.event || 'unknown') as string

    console.log(`[webhooks] Received: ${source}/${eventType}`)

    // Write event to company.os
    this.os.emitEvent({
      type: `webhook-${source}-${eventType}`,
      from: source,
      payload
    })

    // Find matching registrations
    const key = `${source}:${eventType}`
    const registrations = this.registrations.get(key) || []

    if (registrations.length === 0) {
      console.log(`[webhooks] No handlers registered for ${key}`)
      return
    }

    // Wake up registered agents
    for (const reg of registrations) {
      const handler = this.agentHandlers.get(reg.agentName)

      if (handler) {
        console.log(`[webhooks] Waking ${reg.agentName}...`)
        try {
          await handler(payload)
        } catch (error) {
          console.error(`[webhooks] Error in ${reg.agentName}:`, error)
        }
      } else {
        console.log(`[webhooks] No handler found for ${reg.agentName}`)
      }
    }
  }

  /**
   * Starts the webhook server
   */
  listen(port: number = 3000): void {
    this.app.listen(port, () => {
      console.log(`[webhooks] Server listening on port ${port}`)
      console.log(`[webhooks] Webhook URL: http://localhost:${port}/webhook/:source`)
    })
  }

  /**
   * Returns all registered webhooks
   */
  getRegistrations(): WebhookRegistration[] {
    const all: WebhookRegistration[] = []
    this.registrations.forEach(regs => all.push(...regs))
    return all
  }

  private setupRoutes(): void {
    // Generic webhook endpoint
    this.app.post('/webhook/:source', async (req: Request, res: Response) => {
      const source = req.params.source || 'unknown'
      const payload = req.body

      try {
        await this.handleIncoming(source, payload)
        res.status(200).json({ success: true })
      } catch (error) {
        console.error('[webhooks] Error handling webhook:', error)
        res.status(500).json({ success: false, error: String(error) })
      }
    })

    // Health check
    this.app.get('/health', (req: Request, res: Response) => {
      res.status(200).json({ status: 'ok', registrations: this.getRegistrations().length })
    })
  }

  private saveRegistrations(): void {
    const state = this.os.getState()

    if (!(state as any).webhooks) {
      (state as any).webhooks = {
        registrations: []
      }
    }

    (state as any).webhooks.registrations = this.getRegistrations()
    this.os.save()
  }

  private loadRegistrations(): void {
    const state = this.os.getState()

    const saved = (state as any).webhooks?.registrations || []

    saved.forEach((reg: WebhookRegistration) => {
      this.registerWebhook(reg.source, reg.eventType, reg.agentName)
    })

    if (saved.length > 0) {
      console.log(`[webhooks] Loaded ${saved.length} saved registrations`)
    }
  }
}

/**
 * Registers default webhook mappings
 */
export function registerDefaultWebhooks(webhookManager: WebhookManager): void {
  // Stripe payment → finance/exec/model wakes up
  webhookManager.registerWebhook('stripe', 'payment_succeeded', 'finance-exec-model')

  // GitHub PR opened → engineering/code-review
  webhookManager.registerWebhook('github', 'pull_request', 'engineering-code-review')

  // Form submission → research/interview-agent
  webhookManager.registerWebhook('typeform', 'form_response', 'research-interview-agent')

  // Email reply → outreach tracking
  webhookManager.registerWebhook('sendgrid', 'email_reply', 'outreach-tracking')

  console.log('[webhooks] Default webhook mappings registered')
}
