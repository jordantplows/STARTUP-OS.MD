import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

// ============================================================================
// SCHEMA
// ============================================================================

export interface StartupProfile {
  companyName: string
  oneline: string
  industry: string
  businessModel: string
  targetCustomer: string
  problem: string
  stage: 'idea' | 'validating' | 'building' | 'revenue'
  location: string
  founders: string[]
  revenue: number
  fundraisingGoal: string
  launchTarget: string
}

export interface Action {
  type: string
  description: string
  timestamp: string
  impact: string[]
}

export interface Signal {
  type: string
  source: string
  payload: Record<string, unknown>
  priority: 'low' | 'medium' | 'high' | 'critical'
  timestamp: string
}

export interface Decision {
  id: string
  from: string
  question: string
  context: string
  blocking: string[]
  raisedAt: string
  answeredAt?: string
  answer?: string
}

export interface DepartmentState {
  status: 'initializing' | 'watching' | 'deciding' | 'steering' | 'blocked'
  currentFocus: string
  lastAction: Action | null
  pendingDecisions: Decision[]
  memory: string[]
  signals: Signal[]
}

export interface Event {
  type: string
  from: string
  payload: Record<string, unknown>
  timestamp: string
  consumed: string[]
}

export interface MCPConnection {
  connected: boolean
  activates: string[]
  lastUsed?: string
  legalReviewed?: boolean
}

export interface FounderInput {
  timestamp: string
  message: string
  respondedTo: string[]
}

export interface ExecutiveState {
  status: 'initializing' | 'watching' | 'deciding' | 'steering' | 'blocked'
  currentFocus: string
  lastAction: Action | null
  pendingDecisions: Decision[]
  memory: string[]
  signals: Signal[]
}

export interface CompanyOS {
  profile: StartupProfile
  executives: Record<string, ExecutiveState>
  departments: Record<string, DepartmentState>
  decisions: Decision[]
  events: Event[]
  mcps: Record<string, MCPConnection>
  founderInput: FounderInput[]
}

// ============================================================================
// STATE MANAGER
// ============================================================================

const STATE_DIR = join(process.cwd(), '.startup-os')
const STATE_FILE = join(STATE_DIR, 'company.os.json')

export class CompanyOSManager {
  private state: CompanyOS

  constructor(initialProfile?: Partial<StartupProfile>) {
    if (!existsSync(STATE_DIR)) {
      mkdirSync(STATE_DIR, { recursive: true })
    }

    if (existsSync(STATE_FILE)) {
      this.state = this.load()
    } else {
      this.state = this.initialize(initialProfile)
      this.save()
    }
  }

  private initialize(profile?: Partial<StartupProfile>): CompanyOS {
    return {
      profile: {
        companyName: profile?.companyName || '[PENDING]',
        oneline: profile?.oneline || '[PENDING]',
        industry: profile?.industry || '[PENDING]',
        businessModel: profile?.businessModel || '[PENDING]',
        targetCustomer: profile?.targetCustomer || '[PENDING]',
        problem: profile?.problem || '[PENDING]',
        stage: profile?.stage || 'idea',
        location: profile?.location || '[PENDING]',
        founders: profile?.founders || [],
        revenue: profile?.revenue || 0,
        fundraisingGoal: profile?.fundraisingGoal || '[PENDING]',
        launchTarget: profile?.launchTarget || '[PENDING]',
      },
      executives: {},
      departments: {},
      decisions: [],
      events: [],
      mcps: {},
      founderInput: [],
    }
  }

  private load(): CompanyOS {
    const raw = readFileSync(STATE_FILE, 'utf-8')
    return JSON.parse(raw)
  }

  save(): void {
    writeFileSync(STATE_FILE, JSON.stringify(this.state, null, 2))
  }

  getState(): CompanyOS {
    return this.state
  }

  updateProfile(updates: Partial<StartupProfile>): void {
    this.state.profile = { ...this.state.profile, ...updates }
    this.save()
  }

  initializeExecutive(name: string, initialState: Partial<ExecutiveState>): void {
    this.state.executives[name] = {
      status: 'initializing',
      currentFocus: initialState.currentFocus || 'Setting up',
      lastAction: null,
      pendingDecisions: [],
      memory: [],
      signals: [],
      ...initialState,
    }
    this.save()
  }

  updateExecutive(name: string, updates: Partial<ExecutiveState>): void {
    if (!this.state.executives[name]) {
      throw new Error(`Executive ${name} not initialized`)
    }
    this.state.executives[name] = {
      ...this.state.executives[name],
      ...updates,
    }
    this.save()
  }

  initializeDepartment(name: string, initialState: Partial<DepartmentState>): void {
    this.state.departments[name] = {
      status: 'initializing',
      currentFocus: initialState.currentFocus || 'Setting up',
      lastAction: null,
      pendingDecisions: [],
      memory: [],
      signals: [],
      ...initialState,
    }
    this.save()
  }

  updateDepartment(name: string, updates: Partial<DepartmentState>): void {
    if (!this.state.departments[name]) {
      throw new Error(`Department ${name} not initialized`)
    }
    this.state.departments[name] = {
      ...this.state.departments[name],
      ...updates,
    }
    this.save()
  }

  addDecision(decision: Omit<Decision, 'id' | 'raisedAt'>): Decision {
    const newDecision: Decision = {
      ...decision,
      id: `decision-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      raisedAt: new Date().toISOString(),
    }
    this.state.decisions.push(newDecision)
    this.save()
    return newDecision
  }

  answerDecision(decisionId: string, answer: string): void {
    const decision = this.state.decisions.find(d => d.id === decisionId)
    if (!decision) {
      throw new Error(`Decision ${decisionId} not found`)
    }
    decision.answer = answer
    decision.answeredAt = new Date().toISOString()
    this.save()

    this.emitEvent({
      type: 'decision-answered',
      from: 'founder',
      payload: { decisionId, answer },
    })
  }

  emitEvent(event: Omit<Event, 'timestamp' | 'consumed'>): void {
    this.state.events.push({
      ...event,
      timestamp: new Date().toISOString(),
      consumed: [],
    })
    this.save()
  }

  markEventConsumed(eventIndex: number, agentName: string): void {
    if (this.state.events[eventIndex]) {
      this.state.events[eventIndex].consumed.push(agentName)
      this.save()
    }
  }

  addFounderInput(message: string, respondedTo: string[] = []): void {
    this.state.founderInput.push({
      timestamp: new Date().toISOString(),
      message,
      respondedTo,
    })
    this.save()
  }

  getPendingDecisions(): Decision[] {
    return this.state.decisions.filter(d => !d.answer)
  }

  getUnconsumedEvents(agentName: string): Event[] {
    return this.state.events.filter(e => !e.consumed.includes(agentName))
  }

  addMemory(department: string, memory: string): void {
    if (!this.state.departments[department]) {
      throw new Error(`Department ${department} not initialized`)
    }
    this.state.departments[department].memory.push(memory)
    this.save()
  }

  recordAction(department: string, action: Action): void {
    if (!this.state.departments[department]) {
      throw new Error(`Department ${department} not initialized`)
    }
    this.state.departments[department].lastAction = action
    this.save()

    this.emitEvent({
      type: 'action-taken',
      from: department,
      payload: { action },
    })
  }

  connectMCP(name: string, activates: string[]): void {
    this.state.mcps[name] = {
      connected: true,
      activates,
      lastUsed: new Date().toISOString(),
      legalReviewed: false,
    }
    this.save()

    this.emitEvent({
      type: 'mcp-connected',
      from: 'system',
      payload: { name, activates },
    })
  }
}
