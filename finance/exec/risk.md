---
name: cfo-risk
executive: cfo
role: steering
reads:
  - company.os.departments.cfo
  - company.os.departments
  - company.os.events
events:
  emits: [risk-identified, scenario-modeled, mitigation-recommended]
  watches: [runway-changed, burn-rate-changed, revenue-dropped]
template-ref: templates/executives/risk.md
---

## What this agent does

The CFO risk agent monitors financial health, models scenarios, identifies emerging risks, and recommends mitigation strategies to ensure the company doesn't run out of money.

## Instructions

### WATCH

Trigger when:
- Runway drops below critical thresholds (12, 6, 3 months)
- Burn rate increases significantly (>20%)
- Revenue declines or growth stalls
- Major expense events occur
- Founder requests scenario analysis
- Monthly risk review is due

### REASON

Financial risk management follows this framework:

**Risk categories:**
1. **Runway risk** — Will we run out of cash before next milestone?
2. **Burn risk** — Are expenses growing faster than planned?
3. **Revenue risk** — Is revenue growth slowing or reversing?
4. **Concentration risk** — Too dependent on single customer/channel?
5. **Market risk** — External factors threatening the business?

**Scenario modeling:**
- **Best case** — Revenue grows faster, burn stays controlled
- **Base case** — Current trajectory continues
- **Worst case** — Revenue stalls, churn increases, burn rises

**Mitigation strategies:**
1. **Reduce burn** — Cut non-essential costs, defer hires
2. **Accelerate fundraising** — Start raising earlier, increase target
3. **Increase revenue** — Focus on sales, raise prices
4. **Extend runway** — Combination of cost cuts and revenue growth
5. **Strategic options** — Acquisition, merger, pivot

### ACT

Output format for risk dashboard:

```
FINANCIAL RISK DASHBOARD

━━━ CURRENT RISK LEVEL ━━━
Overall risk:     [🟢 Low | 🟡 Medium | 🔴 High]
Runway:           [N] months  [status]
Burn rate:        $[amount]/mo  [trend]

━━━ ACTIVE RISKS ━━━
· [Risk 1]: [Description] - [Severity: High/Medium/Low]
  Impact: [What happens if this materializes]
  Mitigation: [What we're doing about it]

· [Risk 2]: [Description] - [Severity: High/Medium/Low]
  Impact: [What happens if this materializes]
  Mitigation: [What we're doing about it]

━━━ SCENARIO MODELING ━━━

BEST CASE (30% probability)
  Revenue growth:   +40% MoM
  Burn reduction:   -10%
  Runway impact:    +6 months
  → Runway extends to [N] months

BASE CASE (50% probability)
  Revenue growth:   +15% MoM
  Burn stays flat
  Runway impact:    No change
  → Runway stays at [N] months

WORST CASE (20% probability)
  Revenue growth:   +5% MoM
  Burn increase:    +20%
  Runway impact:    -3 months
  → Runway drops to [N] months
  ⚠ Action required: [Specific mitigation]

━━━ RECOMMENDED ACTIONS ━━━
1. [Action] - [Timeline] - [Impact]
2. [Action] - [Timeline] - [Impact]
3. [Action] - [Timeline] - [Impact]
```

### COORDINATE

After risk assessment:
- Emit `risk-identified` when new financial risk detected
- Emit `scenario-modeled` with best/base/worst projections
- Emit `mitigation-recommended` with specific actions
- Update CFO memory with risk state
- Alert CEO if critical risk emerges
- Alert all departments if cost-cutting required

## TypeScript

```typescript
import { CompanyOS } from '../src/company-os'

type RiskSeverity = 'low' | 'medium' | 'high' | 'critical'
type RiskLevel = 'low' | 'medium' | 'high'

interface Risk {
  id: string
  category: string
  description: string
  severity: RiskSeverity
  impact: string
  mitigation: string
  identifiedAt: string
}

interface Scenario {
  name: string
  probability: number
  revenueGrowth: number
  burnChange: number
  runwayImpact: number
  resultingRunway: number
  actions?: string
}

interface RiskState {
  overallRiskLevel: RiskLevel
  currentRunway: number
  currentBurn: number
  activeRisks: Risk[]
  scenarios: Scenario[]
  recommendedActions: Array<{
    action: string
    timeline: string
    impact: string
  }>
}

export async function run(os: CompanyOS, context: string): Promise<string> {
  // Get current financial model
  const model = getFinancialModel(os)
  
  if (!model) {
    return 'No financial model available. Run CFO model agent first.'
  }
  
  // Assess overall risk level
  const riskLevel = assessOverallRisk(model)
  
  // Identify active risks
  const risks = identifyActiveRisks(os, model)
  
  // Model scenarios
  const scenarios = modelScenarios(model)
  
  // Generate recommendations
  const recommendations = generateRecommendations(riskLevel, risks, scenarios, model)
  
  // Build risk state
  const riskState: RiskState = {
    overallRiskLevel: riskLevel,
    currentRunway: model.cash.runwayMonths,
    currentBurn: model.cash.netBurn,
    activeRisks: risks,
    scenarios,
    recommendedActions: recommendations
  }
  
  // Emit events for critical risks
  emitRiskEvents(os, riskState)
  
  // Save risk state to CFO memory
  saveRiskState(os, riskState)
  
  // Format output
  return formatRiskDashboard(riskState)
}

function getFinancialModel(os: CompanyOS): any {
  const modelMemory = os.departments.cfo?.memory.find(m => m.startsWith('MODEL:'))
  if (!modelMemory) return null
  
  try {
    return JSON.parse(modelMemory.replace('MODEL:', ''))
  } catch {
    return null
  }
}

function assessOverallRisk(model: any): RiskLevel {
  const runway = model.cash.runwayMonths
  const burn = model.cash.netBurn
  const revenue = model.revenue.mrr
  
  // Critical risk if runway < 3 months
  if (runway < 3) return 'high'
  
  // High risk if runway < 6 months or burn >> revenue
  if (runway < 6 || (revenue > 0 && burn > revenue * 5)) return 'high'
  
  // Medium risk if runway < 12 months
  if (runway < 12) return 'medium'
  
  // Low risk otherwise
  return 'low'
}

function identifyActiveRisks(os: CompanyOS, model: any): Risk[] {
  const risks: Risk[] = []
  const runway = model.cash.runwayMonths
  const burn = model.cash.netBurn
  const revenue = model.revenue.mrr
  const growth = model.revenue.mrrGrowthRate
  
  // Runway risk
  if (runway < 6) {
    risks.push({
      id: 'runway-critical',
      category: 'Runway',
      description: `Only ${runway} months of runway remaining`,
      severity: runway < 3 ? 'critical' : 'high',
      impact: 'Company runs out of cash before reaching next milestone',
      mitigation: runway < 6 ? 'Emergency fundraising or cost cuts required immediately' : 'Start fundraising conversations now',
      identifiedAt: new Date().toISOString()
    })
  } else if (runway < 12) {
    risks.push({
      id: 'runway-warning',
      category: 'Runway',
      description: `${runway} months of runway`,
      severity: 'medium',
      impact: 'Limited time to execute before needing to raise',
      mitigation: 'Begin preparing fundraising materials and investor pipeline',
      identifiedAt: new Date().toISOString()
    })
  }
  
  // Burn risk
  if (burn > 0 && revenue > 0 && burn > revenue * 5) {
    risks.push({
      id: 'burn-high',
      category: 'Burn Rate',
      description: 'Burn rate significantly exceeds revenue',
      severity: 'high',
      impact: 'Unsustainable burn will deplete runway quickly',
      mitigation: 'Review all expenses, defer non-critical hires, focus on revenue growth',
      identifiedAt: new Date().toISOString()
    })
  }
  
  // Revenue risk
  if (growth < 0) {
    risks.push({
      id: 'revenue-declining',
      category: 'Revenue',
      description: 'MRR growth is negative',
      severity: 'high',
      impact: 'Declining revenue extends path to profitability and fundraising difficulty',
      mitigation: 'Investigate churn causes, focus on customer retention and new sales',
      identifiedAt: new Date().toISOString()
    })
  } else if (growth < 5 && revenue > 0) {
    risks.push({
      id: 'revenue-stagnant',
      category: 'Revenue',
      description: 'MRR growth is stagnant',
      severity: 'medium',
      impact: 'Slow growth signals weak product-market fit',
      mitigation: 'Double down on sales and marketing, test pricing changes',
      identifiedAt: new Date().toISOString()
    })
  }
  
  // Customer concentration risk (simplified)
  if (model.revenue.activeCustomers > 0 && model.revenue.activeCustomers < 5) {
    risks.push({
      id: 'concentration-risk',
      category: 'Concentration',
      description: `Only ${model.revenue.activeCustomers} active customers`,
      severity: 'high',
      impact: 'Loss of one customer could significantly impact revenue',
      mitigation: 'Accelerate customer acquisition, diversify customer base',
      identifiedAt: new Date().toISOString()
    })
  }
  
  return risks
}

function modelScenarios(model: any): Scenario[] {
  const currentRunway = model.cash.runwayMonths
  const currentBurn = model.cash.netBurn
  
  // Best case: strong growth, controlled burn
  const bestCase: Scenario = {
    name: 'Best Case',
    probability: 30,
    revenueGrowth: 40,
    burnChange: -10,
    runwayImpact: 6,
    resultingRunway: currentRunway + 6
  }
  
  // Base case: moderate growth, steady burn
  const baseCase: Scenario = {
    name: 'Base Case',
    probability: 50,
    revenueGrowth: 15,
    burnChange: 0,
    runwayImpact: 0,
    resultingRunway: currentRunway
  }
  
  // Worst case: slow growth, increased burn
  const worstCase: Scenario = {
    name: 'Worst Case',
    probability: 20,
    revenueGrowth: 5,
    burnChange: 20,
    runwayImpact: -3,
    resultingRunway: Math.max(0, currentRunway - 3),
    actions: worstCase.resultingRunway < 6 
      ? 'Emergency cost cuts and accelerated fundraising required'
      : 'Monitor closely and prepare contingency plans'
  }
  
  return [bestCase, baseCase, worstCase]
}

function generateRecommendations(
  riskLevel: RiskLevel,
  risks: Risk[],
  scenarios: Scenario[],
  model: any
): Array<{ action: string; timeline: string; impact: string }> {
  const recommendations: Array<{ action: string; timeline: string; impact: string }> = []
  
  // Critical runway recommendations
  if (model.cash.runwayMonths < 3) {
    recommendations.push({
      action: 'Emergency fundraising: contact all potential investors immediately',
      timeline: 'This week',
      impact: 'Extends runway if successful'
    })
    recommendations.push({
      action: 'Cut all non-essential expenses (reduce burn by 30-40%)',
      timeline: 'Immediate',
      impact: 'Extends runway by 1-2 months'
    })
  } else if (model.cash.runwayMonths < 6) {
    recommendations.push({
      action: 'Accelerate fundraising timeline, complete deck and data room',
      timeline: 'This month',
      impact: 'Improves chances of closing before cash-out'
    })
    recommendations.push({
      action: 'Review and optimize burn rate, defer non-critical hires',
      timeline: 'This month',
      impact: 'Extends runway by 1+ month'
    })
  } else if (model.cash.runwayMonths < 12) {
    recommendations.push({
      action: 'Begin fundraising preparation: update deck, build investor list',
      timeline: 'Next 2 months',
      impact: 'Ensures adequate time for fundraising process'
    })
  }
  
  // Revenue recommendations
  const revenueRisk = risks.find(r => r.category === 'Revenue')
  if (revenueRisk) {
    recommendations.push({
      action: 'Focus on revenue growth: increase sales activity, test pricing',
      timeline: 'Ongoing',
      impact: 'Improves unit economics and fundraising story'
    })
  }
  
  // Burn recommendations
  const burnRisk = risks.find(r => r.category === 'Burn Rate')
  if (burnRisk) {
    recommendations.push({
      action: 'Audit all expenses, eliminate low-ROI spend',
      timeline: 'This month',
      impact: 'Reduces burn by 10-20%'
    })
  }
  
  return recommendations.slice(0, 3)
}

function emitRiskEvents(os: CompanyOS, state: RiskState): void {
  // Emit critical risk events
  for (const risk of state.activeRisks) {
    if (risk.severity === 'critical' || risk.severity === 'high') {
      const alreadyEmitted = os.events.some(e =>
        e.type === 'risk-identified' &&
        e.payload.riskId === risk.id
      )
      
      if (!alreadyEmitted) {
        os.events.push({
          type: 'risk-identified',
          from: 'cfo-risk',
          payload: { 
            riskId: risk.id,
            severity: risk.severity,
            description: risk.description
          },
          timestamp: new Date().toISOString(),
          consumed: []
        })
      }
    }
  }
  
  // Emit scenario modeling results
  os.events.push({
    type: 'scenario-modeled',
    from: 'cfo-risk',
    payload: { scenarios: state.scenarios },
    timestamp: new Date().toISOString(),
    consumed: []
  })
  
  // Emit mitigation recommendations
  if (state.recommendedActions.length > 0) {
    os.events.push({
      type: 'mitigation-recommended',
      from: 'cfo-risk',
      payload: { actions: state.recommendedActions },
      timestamp: new Date().toISOString(),
      consumed: []
    })
  }
}

function saveRiskState(os: CompanyOS, state: RiskState): void {
  if (!os.departments.cfo) {
    os.departments.cfo = {
      status: 'steering',
      currentFocus: 'Monitoring financial risk',
      lastAction: null,
      pendingDecisions: [],
      memory: [],
      signals: []
    }
  }
  
  // Remove old risk state
  os.departments.cfo.memory = os.departments.cfo.memory.filter(m =>
    !m.startsWith('RISK:')
  )
  
  // Add current risk state
  os.departments.cfo.memory.push(`RISK:${JSON.stringify(state)}`)
  
  // Update last action
  os.departments.cfo.lastAction = {
    type: 'risk-assessed',
    description: `Risk assessment: ${state.overallRiskLevel} risk level`,
    timestamp: new Date().toISOString(),
    impact: state.activeRisks.length > 0 ? ['ceo', 'all'] : ['ceo']
  }
}

function formatRiskDashboard(state: RiskState): string {
  const lines: string[] = []
  
  lines.push('FINANCIAL RISK DASHBOARD')
  lines.push('')
  
  lines.push('━━━ CURRENT RISK LEVEL ━━━')
  const riskIcon = state.overallRiskLevel === 'low' ? '🟢 Low'
    : state.overallRiskLevel === 'medium' ? '🟡 Medium'
    : '🔴 High'
  lines.push(`Overall risk:     ${riskIcon}`)
  lines.push(`Runway:           ${state.currentRunway} months`)
  lines.push(`Burn rate:        $${state.currentBurn.toLocaleString()}/mo`)
  lines.push('')
  
  if (state.activeRisks.length > 0) {
    lines.push('━━━ ACTIVE RISKS ━━━')
    for (const risk of state.activeRisks) {
      lines.push(`· ${risk.description} - Severity: ${risk.severity}`)
      lines.push(`  Impact: ${risk.impact}`)
      lines.push(`  Mitigation: ${risk.mitigation}`)
      lines.push('')
    }
  }
  
  lines.push('━━━ SCENARIO MODELING ━━━')
  lines.push('')
  for (const scenario of state.scenarios) {
    lines.push(`${scenario.name.toUpperCase()} (${scenario.probability}% probability)`)
    lines.push(`  Revenue growth:   ${scenario.revenueGrowth >= 0 ? '+' : ''}${scenario.revenueGrowth}% MoM`)
    lines.push(`  Burn change:      ${scenario.burnChange >= 0 ? '+' : ''}${scenario.burnChange}%`)
    lines.push(`  Runway impact:    ${scenario.runwayImpact >= 0 ? '+' : ''}${scenario.runwayImpact} months`)
    lines.push(`  → Runway ${scenario.runwayImpact >= 0 ? 'extends' : 'drops'} to ${scenario.resultingRunway} months`)
    if (scenario.actions) {
      lines.push(`  ⚠ ${scenario.actions}`)
    }
    lines.push('')
  }
  
  if (state.recommendedActions.length > 0) {
    lines.push('━━━ RECOMMENDED ACTIONS ━━━')
    for (let i = 0; i < state.recommendedActions.length; i++) {
      const action = state.recommendedActions[i]
      lines.push(`${i + 1}. ${action.action}`)
      lines.push(`   Timeline: ${action.timeline}`)
      lines.push(`   Impact: ${action.impact}`)
      if (i < state.recommendedActions.length - 1) lines.push('')
    }
  }
  
  return lines.join('\n')
}
```

## Coordination

**Reads:**
- `company.os.departments.cfo` — financial model for runway/burn
- `company.os.departments.*` — department activity that impacts burn
- `company.os.events` — financial events and changes

**Emits:**
- `risk-identified` → alerts to new financial risks
- `scenario-modeled` → shares best/base/worst projections
- `mitigation-recommended` → suggests specific actions

**Consumed by:**
- CEO (coordinates response to financial risks)
- CFO fundraising agent (uses risk level for urgency)
- All departments (may need to cut costs if risk high)
