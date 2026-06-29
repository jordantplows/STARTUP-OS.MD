import { CompanyOSManager, ExecutiveConflict, ExecutiveSynergy, ExecutiveSync } from './company-os.js'

/**
 * Executive Coordinator
 *
 * Runs after all six executives complete their watch/reason/act cycle.
 * Detects conflicts, synergies, and PMF signals across executive outputs.
 */

export async function coordinateExecutives(os: CompanyOSManager): Promise<ExecutiveSync> {
  const state = os.getState()
  const conflicts: ExecutiveConflict[] = []
  const synergies: ExecutiveSynergy[] = []

  // Check for budget vs roadmap conflicts (CFO vs CPO)
  const cfoState = state.executives['cfo']
  const cpoState = state.executives['cpo']

  if (cfoState && cpoState) {
    // Look for CFO flagging cost concerns
    const cfoSignals = cfoState.signals.filter(s =>
      s.type.includes('cost') || s.type.includes('runway') || s.type.includes('budget')
    )

    // Look for CPO roadmap changes
    const cpoSignals = cpoState.signals.filter(s =>
      s.type.includes('roadmap') || s.type.includes('feature')
    )

    if (cfoSignals.length > 0 && cpoSignals.length > 0) {
      conflicts.push({
        between: ['cfo', 'cpo'],
        issue: 'CFO flagged budget concern while CPO proposed new roadmap item',
        resolution: 'escalated-to-founder'
      })
    }
  }

  // Check for positioning vs product alignment (CMO vs CPO)
  const cmoState = state.executives['cmo']

  if (cmoState && cpoState) {
    const cmoPositioning = cmoState.memory.find(m => m.includes('positioning'))
    const cpoVision = cpoState.memory.find(m => m.includes('vision') || m.includes('roadmap'))

    if (cmoPositioning && cpoVision) {
      // If both updated recently, flag as potential synergy
      synergies.push({
        between: ['cmo', 'cpo'],
        insight: 'Marketing positioning and product vision aligned on customer segment'
      })
    }
  }

  // Check for technical feasibility vs product ambition (CTO vs CPO)
  const ctoState = state.executives['cto']

  if (ctoState && cpoState) {
    const ctoRisks = ctoState.signals.filter(s =>
      s.priority === 'high' || s.priority === 'critical'
    )

    if (ctoRisks.length > 0) {
      conflicts.push({
        between: ['cto', 'cpo'],
        issue: 'CTO flagged technical feasibility concern on roadmap item',
        resolution: 'ceo-decided'
      })
    }
  }

  // Check for operational bottlenecks (COO signals)
  const cooState = state.executives['coo']

  if (cooState) {
    const operationalBlockers = cooState.signals.filter(s =>
      s.type.includes('blocked') || s.type.includes('bottleneck')
    )

    if (operationalBlockers.length >= 2) {
      conflicts.push({
        between: ['coo', 'ceo'],
        issue: 'Multiple departments reporting same operational blocker',
        resolution: 'escalated-to-founder'
      })
    }
  }

  // Analyze PMF evidence for signal strength
  const pmfSignal = analyzePMFSignal(state.pmf.evidence.slice(-5))

  const sync: ExecutiveSync = {
    timestamp: new Date().toISOString(),
    conflicts,
    synergies,
    pmfSignal
  }

  // Write sync to company.os
  state.executiveSync = sync
  os.save()

  return sync
}

function analyzePMFSignal(recentEvidence: any[]): string {
  if (recentEvidence.length === 0) {
    return 'No recent PMF evidence'
  }

  const supports = recentEvidence.filter(e => e.direction === 'supports').length
  const contradicts = recentEvidence.filter(e => e.direction === 'contradicts').length

  if (supports >= 3 && contradicts === 0) {
    return 'PMF signal strengthening — hypothesis gaining support'
  }

  if (contradicts >= 3) {
    return 'PMF signal weakening — hypothesis may need pivot'
  }

  if (supports > contradicts) {
    return 'PMF signal mixed but positive'
  }

  if (contradicts > supports) {
    return 'PMF signal mixed but concerning'
  }

  return 'PMF signal unclear — need more evidence'
}

/**
 * Helper to detect if two executives have conflicting signals
 */
export function detectConflict(
  exec1Name: string,
  exec1Signals: any[],
  exec2Name: string,
  exec2Signals: any[]
): ExecutiveConflict | null {
  // Example: CFO signals cost concern while CPO signals feature expansion
  const exec1CostConcern = exec1Signals.some(s =>
    s.type.includes('cost') || s.type.includes('budget')
  )
  const exec2Expansion = exec2Signals.some(s =>
    s.type.includes('expand') || s.type.includes('new-feature')
  )

  if (exec1CostConcern && exec2Expansion) {
    return {
      between: [exec1Name, exec2Name],
      issue: `${exec1Name} flagged cost concern while ${exec2Name} proposed expansion`,
      resolution: 'escalated-to-founder'
    }
  }

  return null
}

/**
 * Helper to detect synergies between executives
 */
export function detectSynergy(
  exec1Name: string,
  exec1Memory: string[],
  exec2Name: string,
  exec2Memory: string[]
): ExecutiveSynergy | null {
  // Example: CMO and CPO both focusing on same customer segment
  const exec1CustomerFocus = exec1Memory.find(m => m.includes('customer'))
  const exec2CustomerFocus = exec2Memory.find(m => m.includes('customer'))

  if (exec1CustomerFocus && exec2CustomerFocus) {
    return {
      between: [exec1Name, exec2Name],
      insight: 'Both executives aligned on customer segment strategy'
    }
  }

  return null
}
