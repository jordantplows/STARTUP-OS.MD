import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import type {
  CompanyOS,
  StartupProfile,
  DepartmentState,
  Decision,
  Event,
  FounderInput,
  Action,
} from './types.js'

const COMPANY_OS_PATH = join(process.cwd(), '.startup-os', 'company.os.json')

export class CompanyOSManager {
  private state: CompanyOS

  constructor(initialProfile?: Partial<StartupProfile>) {
    if (existsSync(COMPANY_OS_PATH)) {
      this.state = this.load()
    } else {
      this.state = this.initialize(initialProfile)
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
      departments: {},
      decisions: [],
      events: [],
      mcps: {},
      founderInput: [],
    }
  }

  private load(): CompanyOS {
    const raw = readFileSync(COMPANY_OS_PATH, 'utf-8')
    return JSON.parse(raw)
  }

  save(): void {
    writeFileSync(COMPANY_OS_PATH, JSON.stringify(this.state, null, 2))
  }

  getState(): CompanyOS {
    return this.state
  }

  updateProfile(updates: Partial<StartupProfile>): void {
    this.state.profile = { ...this.state.profile, ...updates }
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
      timestamp: new Date().toISOString(),
    })
  }

  emitEvent(event: Omit<Event, 'consumed'>): void {
    this.state.events.push({
      ...event,
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
      payload: action,
      timestamp: new Date().toISOString(),
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
      timestamp: new Date().toISOString(),
    })
  }
}
