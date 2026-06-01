import { appendFileSync, readFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

// ============================================================================
// AUDIT LOG SYSTEM
// ============================================================================

const AUDIT_DIR = join(process.cwd(), '.audit')
const AUDIT_LOG_PATH = join(AUDIT_DIR, 'log.jsonl')

export interface AuditEntry {
  timestamp: string
  agent: string
  action: string
  input: Record<string, unknown>
  output: Record<string, unknown>
  founderApproved: boolean
  confidence: 'low' | 'medium' | 'high'
  tripwired?: boolean
}

/**
 * Ensures the audit directory exists
 */
function ensureAuditDir(): void {
  if (!existsSync(AUDIT_DIR)) {
    mkdirSync(AUDIT_DIR, { recursive: true })
  }
}

/**
 * Appends an entry to the audit log
 * Immutable record of every decision and action
 */
export function log(entry: Omit<AuditEntry, 'timestamp'>): void {
  ensureAuditDir()

  const fullEntry: AuditEntry = {
    ...entry,
    timestamp: new Date().toISOString()
  }

  // Append to JSONL file (one JSON object per line)
  appendFileSync(AUDIT_LOG_PATH, JSON.stringify(fullEntry) + '\n')

  // Log to console for visibility
  const icon = entry.tripwired ? '🔒' : entry.founderApproved ? '✅' : '⚪'
  console.log(`[audit] ${icon} ${entry.agent} → ${entry.action}`)
}

/**
 * Query the audit log with optional filters
 */
export function query(filter?: {
  agent?: string
  action?: string
  founderApproved?: boolean
  tripwired?: boolean
  since?: string
  until?: string
}): AuditEntry[] {
  ensureAuditDir()

  if (!existsSync(AUDIT_LOG_PATH)) {
    return []
  }

  const lines = readFileSync(AUDIT_LOG_PATH, 'utf-8').trim().split('\n')
  let entries: AuditEntry[] = lines
    .filter(line => line.trim())
    .map(line => JSON.parse(line))

  // Apply filters
  if (filter) {
    if (filter.agent) {
      entries = entries.filter(e => e.agent === filter.agent)
    }
    if (filter.action) {
      entries = entries.filter(e => e.action === filter.action)
    }
    if (filter.founderApproved !== undefined) {
      entries = entries.filter(e => e.founderApproved === filter.founderApproved)
    }
    if (filter.tripwired !== undefined) {
      entries = entries.filter(e => e.tripwired === filter.tripwired)
    }
    if (filter.since) {
      entries = entries.filter(e => e.timestamp >= filter.since!)
    }
    if (filter.until) {
      entries = entries.filter(e => e.timestamp <= filter.until!)
    }
  }

  return entries
}

/**
 * Exports the full audit log
 */
export function exportAuditLog(): AuditEntry[] {
  return query()
}

/**
 * Returns audit log statistics
 */
export function stats(): {
  totalActions: number
  tripwiredActions: number
  founderApprovedActions: number
  agentBreakdown: Record<string, number>
  recentActions: AuditEntry[]
} {
  const allEntries = exportAuditLog()

  const agentBreakdown: Record<string, number> = {}
  allEntries.forEach(entry => {
    agentBreakdown[entry.agent] = (agentBreakdown[entry.agent] || 0) + 1
  })

  return {
    totalActions: allEntries.length,
    tripwiredActions: allEntries.filter(e => e.tripwired).length,
    founderApprovedActions: allEntries.filter(e => e.founderApproved).length,
    agentBreakdown,
    recentActions: allEntries.slice(-10) // Last 10 actions
  }
}

/**
 * Returns recent activity for a specific agent
 */
export function getAgentActivity(agent: string, limit: number = 10): AuditEntry[] {
  const entries = query({ agent })
  return entries.slice(-limit)
}

/**
 * Logs a tripwired action that requires founder approval
 */
export function logTripwired(
  agent: string,
  action: string,
  input: Record<string, unknown>,
  output: Record<string, unknown>
): void {
  log({
    agent,
    action,
    input,
    output,
    founderApproved: false,
    confidence: 'high',
    tripwired: true
  })
}

/**
 * Marks a tripwired action as approved by founder
 */
export function approveTripwired(agent: string, action: string, timestamp: string): void {
  log({
    agent,
    action: `${action}-approved`,
    input: { originalTimestamp: timestamp },
    output: { approved: true },
    founderApproved: true,
    confidence: 'high',
    tripwired: true
  })
}

/**
 * Returns all tripwired actions awaiting approval
 */
export function getPendingTripwired(): AuditEntry[] {
  const tripwired = query({ tripwired: true })

  // Find tripwired actions that don't have a corresponding approval
  return tripwired.filter(entry => {
    const approvalExists = tripwired.some(e =>
      e.action === `${entry.action}-approved` &&
      (e.input as any).originalTimestamp === entry.timestamp
    )
    return !approvalExists
  })
}
