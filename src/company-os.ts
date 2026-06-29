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
  projectRef?: string
  projectUrl?: string
  setupFlow?: 'guided-cli' | 'oauth' | 'api-key' | 'credentials' | 'cli-token'
  activatedDepartments: string[]
  connectedAt?: string
  tripwire: boolean
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

export interface OutreachSequence {
  id: string
  targetSegment: string
  subjectLines: string[]
  emailBodies: string[]
  cadence: number[]
  status: 'draft' | 'active' | 'paused'
  stats: {
    sent: number
    opened: number
    replied: number
    booked: number
  }
}

export interface Reply {
  sequenceId: string
  recipientEmail: string
  repliedAt: string
  content: string
}

export interface OutreachRecord {
  sequenceId: string
  recipientEmail: string
  sentAt: string
  openedAt?: string
  repliedAt?: string
  bookedAt?: string
  status: 'sent' | 'opened' | 'replied' | 'booked' | 'stopped'
}

export interface Investor {
  id: string
  name: string
  firm: string
  type: 'vc' | 'angel' | 'syndicate'
  stage: string[]
  checkSize: { min: number; max: number }
  thesisFocus: string[]
  portfolioCompanies: string[]
  location: string
  scores: {
    thesisFit: number
    checkSizeMatch: number
    portfolioSynergy: number
    warmIntroLikelihood: number
    total: number
  }
}

export interface DataRoomItem {
  category: string
  name: string
  status: 'available' | 'missing' | 'in-progress'
  location?: string
  instructions?: string
}

export interface CustomerSignal {
  id: string
  source: string
  sourceUrl?: string
  content: string
  painPoint: string
  language: string[]
  painIntensity: 'low' | 'medium' | 'high'
  relevanceScore: number
  detectedAt: string
}

export interface CompetitorEvent {
  id: string
  competitor: string
  moveType: 'pricing' | 'feature' | 'hire' | 'funding' | 'customer' | 'positioning'
  description: string
  impact: 'low' | 'medium' | 'high'
  source: string
  sourceUrl?: string
  detectedAt: string
}

export interface Trend {
  id: string
  category: 'regulatory' | 'technology' | 'economic' | 'industry' | 'ecosystem'
  description: string
  relevance: 'tailwind' | 'headwind' | 'neutral'
  impact: 'low' | 'medium' | 'high'
  timeline: 'immediate' | 'near-term' | 'long-term'
  source: string
  sourceUrl?: string
  detectedAt: string
  analysis: string
}

export interface InterviewSynthesis {
  id: string
  interviewedAt: string
  interviewee: {
    role: string
    company: string
    segment: string
  }
  insights: {
    jobsToBeDone: string[]
    painIntensity: number
    currentAlternatives: string[]
    switchingCosts: string[]
    willingnessToPay: string
    exactLanguage: string[]
    objections: string[]
  }
  synthesizedAt: string
}

export interface AdvisorRecord {
  id: string
  name: string
  expertise: string[]
  relevantExperience: string
  warmIntroPath?: string
  outreachDraft: string
  status: 'identified' | 'outreach-sent' | 'conversation' | 'committed' | 'declined'
  suggestedEquity: string
  timeCommitment: string
  addedAt: string
}

export interface PartnershipRecord {
  id: string
  companyName: string
  partnershipType: 'distribution' | 'integration' | 'co-marketing' | 'reseller'
  mutualBenefit: string
  proposedStructure: string
  proposalDraft: string
  status: 'identified' | 'outreach-sent' | 'conversation' | 'agreed' | 'declined'
  addedAt: string
}

export interface PressRecord {
  id: string
  outletName: string
  outletType: 'publication' | 'podcast' | 'newsletter'
  journalistName?: string
  coverage: string[]
  audience: string
  pitchDraft: string
  status: 'identified' | 'pitched' | 'responded' | 'covered' | 'declined'
  addedAt: string
}

export interface ProgramRecord {
  id: string
  programName: string
  type: 'accelerator' | 'incubator' | 'fellowship'
  equity: string
  funding: string
  duration: string
  fitScore: number
  nextDeadline: string
  applicationDraft: string
  recommendation: string
  status: 'identified' | 'applied' | 'accepted' | 'declined' | 'not-pursuing'
  addedAt: string
}

export interface Schedule {
  agentName: string
  cronExpression: string
  enabled: boolean
  lastRun?: string | undefined
  nextRun?: string | undefined
}

export interface PMFEvidence {
  source: string
  signal: string
  direction: 'supports' | 'contradicts'
  timestamp: string
}

export interface PMFTracking {
  hypothesis: string
  confidence: number
  evidence: PMFEvidence[]
  lastUpdated: string
  nextValidationStep: string
}

export interface ExecutiveConflict {
  between: string[]
  issue: string
  resolution: 'ceo-decided' | 'escalated-to-founder'
  decidedBy?: string
  outcome?: string
}

export interface ExecutiveSynergy {
  between: string[]
  insight: string
}

export interface ExecutiveSync {
  timestamp: string
  conflicts: ExecutiveConflict[]
  synergies: ExecutiveSynergy[]
  pmfSignal: string
}

export interface CompanyOS {
  profile: StartupProfile
  executives: Record<string, ExecutiveState>
  departments: Record<string, DepartmentState>
  decisions: Decision[]
  events: Event[]
  mcps: Record<string, MCPConnection>
  mcpPromptDeferred?: boolean
  pendingDatabaseSetup?: {
    reason: string
    department: string
  }
  pmf: PMFTracking
  executiveSync?: ExecutiveSync
  founderInput: FounderInput[]
  outreach: {
    sequences: OutreachSequence[]
    replies: Reply[]
    pipeline: OutreachRecord[]
  }
  investor: {
    targets: Investor[]
    dataRoom: DataRoomItem[]
    narrative: string
    processStatus: 'not-started' | 'preparing' | 'outreaching' | 'in-process' | 'closed'
    pipeline: any[]
  }
  research: {
    customerSignals: CustomerSignal[]
    competitorMoves: CompetitorEvent[]
    trends: Trend[]
    interviews: InterviewSynthesis[]
  }
  network: {
    advisors: AdvisorRecord[]
    partnerships: PartnershipRecord[]
    press: PressRecord[]
    programs: ProgramRecord[]
  }
  scheduler: {
    schedules: Schedule[]
    lastRun: Record<string, string>
    nextRun: Record<string, string>
  }
  audit: {
    totalActions: number
    lastEntry: string
  }
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
      pmf: {
        hypothesis: 'Customers need a solution for [problem]',
        confidence: 0,
        evidence: [],
        lastUpdated: new Date().toISOString(),
        nextValidationStep: 'Conduct first customer interviews to validate problem'
      },
      founderInput: [],
      outreach: {
        sequences: [],
        replies: [],
        pipeline: []
      },
      investor: {
        targets: [],
        dataRoom: [],
        narrative: '',
        processStatus: 'not-started',
        pipeline: []
      },
      research: {
        customerSignals: [],
        competitorMoves: [],
        trends: [],
        interviews: []
      },
      network: {
        advisors: [],
        partnerships: [],
        press: [],
        programs: []
      },
      scheduler: {
        schedules: [],
        lastRun: {},
        nextRun: {}
      },
      audit: {
        totalActions: 0,
        lastEntry: ''
      }
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
      activatedDepartments: activates,
      connectedAt: new Date().toISOString(),
      tripwire: false,
    }
    this.save()

    this.emitEvent({
      type: 'mcp-connected',
      from: 'system',
      payload: { name, activates },
    })
  }
}
