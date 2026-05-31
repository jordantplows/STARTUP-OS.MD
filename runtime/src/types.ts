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
  payload: unknown
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
  payload: unknown
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

export interface CompanyOS {
  profile: StartupProfile
  departments: Record<string, DepartmentState>
  decisions: Decision[]
  events: Event[]
  mcps: Record<string, MCPConnection>
  founderInput: FounderInput[]
}

export interface AgentDefinition {
  name: string
  department: string
  role: string
  watches: WatchCondition[]
  systemPrompt: string
}

export type WatchCondition = (state: CompanyOS) => boolean | unknown[]

export interface AgentResponse {
  action?: Action
  events?: Event[]
  decisions?: Decision[]
  stateUpdates?: Partial<DepartmentState>
  founderMessage?: string
}
