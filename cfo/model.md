---
name: cfo-model
executive: cfo
role: steering
reads:
  - company.os.profile
  - company.os.departments
  - company.os.events
events:
  emits: [model-updated, runway-changed, burn-rate-changed, milestone-achieved]
  watches: [revenue-received, expense-incurred, hire-made, customer-churned]
template-ref: templates/executives/model.md
---

## What this agent does

The CFO model agent maintains the live financial model for the company. It tracks P&L, MRR, burn rate, runway, unit economics, and cash position. This is the single source of truth for company financial health.

## Instructions

### WATCH

Trigger when:
- Revenue is received (`revenue-received` event)
- An expense is incurred (`expense-incurred` event)
- A hire is made (`hire-made` event)
- Monthly close is due (1st of each month)
- Founder requests financial snapshot

### REASON

Financial model follows this structure:

**Revenue tracking:**
1. **MRR** — Monthly recurring revenue from active subscriptions
2. **One-time revenue** — Non-recurring sales, setup fees, consulting
3. **Revenue growth rate** — Month-over-month MRR growth
4. **ARR** — Annual recurring revenue (MRR × 12)

**Expense tracking:**
1. **Personnel costs** — Salaries, benefits, contractors (typically 60-70% of burn)
2. **Infrastructure** — AWS, hosting, SaaS tools
3. **Marketing & Sales** — Ads, tools, events
4. **Operations** — Legal, accounting, insurance, office
5. **R&D** — Software, hardware, research costs

**Unit economics:**
1. **CAC** — Customer acquisition cost
2. **LTV** — Lifetime value per customer
3. **LTV:CAC ratio** — Target 3:1 or higher
4. **Payback period** — Months to recover CAC

**Cash metrics:**
1. **Burn rate** — Monthly cash outflow (expenses - revenue)
2. **Runway** — Months until cash reaches zero at current burn
3. **Cash position** — Current bank balance

### ACT

Output format for financial model:

```
FINANCIAL MODEL · [Month Year]

━━━ REVENUE ━━━
MRR:              $[amount]  ([+/-]% MoM)
One-time:         $[amount]
ARR:              $[amount]
Active customers: [count]

━━━ EXPENSES ━━━
Personnel:        $[amount]  ([%] of total)
Infrastructure:   $[amount]  ([%] of total)
Marketing/Sales:  $[amount]  ([%] of total)
Operations:       $[amount]  ([%] of total)
R&D:              $[amount]  ([%] of total)
───────────────────────────
Total expenses:   $[amount]

━━━ UNIT ECONOMICS ━━━
CAC:              $[amount]
LTV:              $[amount]
LTV:CAC ratio:    [ratio]:1  [✓ Healthy | ⚠ Concerning | ✗ Unhealthy]
Payback period:   [months] months

━━━ CASH POSITION ━━━
Revenue:          $[amount]
Expenses:         $[amount]
Net burn:         $[amount]/month
Cash on hand:     $[amount]
Runway:           [months] months  [✓ Safe | ⚠ Warning | ✗ Critical]

━━━ THRESHOLDS ━━━
· Runway < 12 months: ⚠ Start fundraising conversations
· Runway < 6 months:  🚨 Emergency mode
· Runway < 3 months:  ⛔ Critical - immediate action required
```

### COORDINATE

After model update:
- Emit `model-updated` event with current financials
- If runway changed by >1 month, emit `runway-changed` event
- If burn rate changed by >20%, emit `burn-rate-changed` event
- If milestone hit (e.g., $10k MRR, profitability), emit `milestone-achieved` event
- Update `company.os.profile.revenue` with current MRR
- Store model snapshot in CFO memory

## TypeScript

```typescript
import { CompanyOS } from '../src/company-os'

interface RevenueMetrics {
  mrr: number
  oneTimeRevenue: number
  arr: number
  activeCustomers: number
  mrrGrowthRate: number
}

interface ExpenseBreakdown {
  personnel: number
  infrastructure: number
  marketingSales: number
  operations: number
  rnd: number
  total: number
}

interface UnitEconomics {
  cac: number
  ltv: number
  ltvCacRatio: number
  paybackPeriodMonths: number
  health: 'healthy' | 'concerning' | 'unhealthy'
}

interface CashMetrics {
  revenue: number
  expenses: number
  netBurn: number
  cashOnHand: number
  runwayMonths: number
  runwayStatus: 'safe' | 'warning' | 'critical'
}

interface FinancialModel {
  month: string
  revenue: RevenueMetrics
  expenses: ExpenseBreakdown
  unitEconomics: UnitEconomics
  cash: CashMetrics
}

export async function run(os: CompanyOS, context: string): Promise<string> {
  // Load previous model from memory
  const previousModel = loadPreviousModel(os)
  
  // Build current model from events and department states
  const currentModel = buildFinancialModel(os)
  
  // Compare and detect significant changes
  const changes = detectChanges(previousModel, currentModel)
  
  // Emit events for significant changes
  emitChangeEvents(os, changes, currentModel)
  
  // Save model to CFO memory
  saveModel(os, currentModel)
  
  // Update profile with current revenue
  os.profile.revenue = currentModel.revenue.mrr
  
  // Format output
  return formatFinancialModel(currentModel, changes)
}

function loadPreviousModel(os: CompanyOS): FinancialModel | null {
  if (!os.departments.cfo) return null
  
  const modelMemory = os.departments.cfo.memory.find(m => m.startsWith('MODEL:'))
  if (!modelMemory) return null
  
  try {
    return JSON.parse(modelMemory.replace('MODEL:', ''))
  } catch {
    return null
  }
}

function buildFinancialModel(os: CompanyOS): FinancialModel {
  const stage = os.profile.stage
  const recentEvents = os.events.slice(-100)
  
  // Calculate revenue metrics
  const revenue = calculateRevenue(os, recentEvents)
  
  // Calculate expenses
  const expenses = calculateExpenses(os, recentEvents)
  
  // Calculate unit economics
  const unitEconomics = calculateUnitEconomics(revenue, expenses, recentEvents)
  
  // Calculate cash position
  const cash = calculateCashPosition(revenue, expenses, os)
  
  return {
    month: new Date().toISOString().substring(0, 7),
    revenue,
    expenses,
    unitEconomics,
    cash
  }
}

function calculateRevenue(os: CompanyOS, events: any[]): RevenueMetrics {
  let mrr = 0
  let oneTimeRevenue = 0
  let activeCustomers = 0
  
  // Sum up revenue events from the last 30 days
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const revenueEvents = events.filter(e => 
    e.type.includes('revenue') && e.timestamp > thirtyDaysAgo
  )
  
  for (const event of revenueEvents) {
    if (event.type === 'revenue-received-recurring') {
      mrr += event.payload.amount || 0
    } else if (event.type === 'revenue-received-onetime') {
      oneTimeRevenue += event.payload.amount || 0
    }
  }
  
  // Count active customers from sales/customer-success department
  if (os.departments.sales) {
    const customerCount = os.departments.sales.memory.filter(m => 
      m.includes('CUSTOMER_ACTIVE')
    ).length
    activeCustomers = customerCount
  }
  
  const arr = mrr * 12
  
  // Calculate growth rate (simplified - would compare to previous month)
  const mrrGrowthRate = 0 // TODO: Calculate from historical data
  
  return {
    mrr,
    oneTimeRevenue,
    arr,
    activeCustomers,
    mrrGrowthRate
  }
}

function calculateExpenses(os: CompanyOS, events: any[]): ExpenseBreakdown {
  let personnel = 0
  let infrastructure = 0
  let marketingSales = 0
  let operations = 0
  let rnd = 0
  
  // Sum up expense events from the last 30 days
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const expenseEvents = events.filter(e => 
    e.type.includes('expense') && e.timestamp > thirtyDaysAgo
  )
  
  for (const event of expenseEvents) {
    const category = event.payload.category as string
    const amount = event.payload.amount as number || 0
    
    if (category === 'personnel') personnel += amount
    else if (category === 'infrastructure') infrastructure += amount
    else if (category === 'marketing' || category === 'sales') marketingSales += amount
    else if (category === 'operations') operations += amount
    else if (category === 'rnd') rnd += amount
  }
  
  // Add personnel costs from hiring
  const hireEvents = events.filter(e => e.type === 'hire-made')
  for (const hire of hireEvents) {
    const salary = hire.payload.salary as number || 0
    personnel += salary / 12 // Monthly cost
  }
  
  const total = personnel + infrastructure + marketingSales + operations + rnd
  
  return {
    personnel,
    infrastructure,
    marketingSales,
    operations,
    rnd,
    total
  }
}

function calculateUnitEconomics(
  revenue: RevenueMetrics, 
  expenses: ExpenseBreakdown,
  events: any[]
): UnitEconomics {
  // Calculate CAC (simplified)
  const cac = revenue.activeCustomers > 0 
    ? expenses.marketingSales / revenue.activeCustomers 
    : 0
  
  // Calculate LTV (simplified - assumes 2 year lifetime and current MRR)
  const avgRevenuePerCustomer = revenue.activeCustomers > 0
    ? revenue.mrr / revenue.activeCustomers
    : 0
  const ltv = avgRevenuePerCustomer * 24 // 2 years
  
  // Calculate ratio
  const ltvCacRatio = cac > 0 ? ltv / cac : 0
  
  // Calculate payback period
  const paybackPeriodMonths = cac > 0 && avgRevenuePerCustomer > 0
    ? cac / avgRevenuePerCustomer
    : 0
  
  // Determine health
  let health: 'healthy' | 'concerning' | 'unhealthy' = 'unhealthy'
  if (ltvCacRatio >= 3) health = 'healthy'
  else if (ltvCacRatio >= 1.5) health = 'concerning'
  
  return {
    cac,
    ltv,
    ltvCacRatio,
    paybackPeriodMonths,
    health
  }
}

function calculateCashPosition(
  revenue: RevenueMetrics,
  expenses: ExpenseBreakdown,
  os: CompanyOS
): CashMetrics {
  const monthlyRevenue = revenue.mrr + (revenue.oneTimeRevenue / 12)
  const monthlyExpenses = expenses.total
  const netBurn = monthlyExpenses - monthlyRevenue
  
  // Get cash on hand from finance department or default
  let cashOnHand = 0
  if (os.departments.finance) {
    const cashMemory = os.departments.finance.memory.find(m => m.includes('CASH:'))
    if (cashMemory) {
      const match = cashMemory.match(/CASH:(\d+)/)
      cashOnHand = match ? parseInt(match[1]) : 0
    }
  }
  
  // If no cash recorded, assume seed funding or bootstrap
  if (cashOnHand === 0) {
    cashOnHand = 500000 // Default assumption for pre-seed/seed stage
  }
  
  // Calculate runway
  const runwayMonths = netBurn > 0 ? cashOnHand / netBurn : 999
  
  // Determine runway status
  let runwayStatus: 'safe' | 'warning' | 'critical' = 'safe'
  if (runwayMonths < 3) runwayStatus = 'critical'
  else if (runwayMonths < 6) runwayStatus = 'warning'
  
  return {
    revenue: monthlyRevenue,
    expenses: monthlyExpenses,
    netBurn,
    cashOnHand,
    runwayMonths: Math.round(runwayMonths * 10) / 10,
    runwayStatus
  }
}

function detectChanges(prev: FinancialModel | null, current: FinancialModel): any {
  if (!prev) return { isFirstRun: true }
  
  const changes: any = {}
  
  // Detect runway change
  const runwayDelta = Math.abs(current.cash.runwayMonths - prev.cash.runwayMonths)
  if (runwayDelta > 1) {
    changes.runwayChanged = {
      from: prev.cash.runwayMonths,
      to: current.cash.runwayMonths,
      delta: current.cash.runwayMonths - prev.cash.runwayMonths
    }
  }
  
  // Detect burn rate change
  const burnDelta = Math.abs(current.cash.netBurn - prev.cash.netBurn)
  const burnPctChange = prev.cash.netBurn > 0 
    ? (burnDelta / prev.cash.netBurn) * 100 
    : 0
  if (burnPctChange > 20) {
    changes.burnRateChanged = {
      from: prev.cash.netBurn,
      to: current.cash.netBurn,
      pctChange: Math.round(burnPctChange)
    }
  }
  
  // Detect milestones
  if (current.revenue.mrr >= 10000 && prev.revenue.mrr < 10000) {
    changes.milestone = '10k_mrr'
  } else if (current.cash.netBurn <= 0 && prev.cash.netBurn > 0) {
    changes.milestone = 'profitable'
  }
  
  return changes
}

function emitChangeEvents(os: CompanyOS, changes: any, model: FinancialModel): void {
  // Always emit model-updated
  os.events.push({
    type: 'model-updated',
    from: 'cfo-model',
    payload: { 
      mrr: model.revenue.mrr,
      burn: model.cash.netBurn,
      runway: model.cash.runwayMonths
    },
    timestamp: new Date().toISOString(),
    consumed: []
  })
  
  // Emit runway change event
  if (changes.runwayChanged) {
    os.events.push({
      type: 'runway-changed',
      from: 'cfo-model',
      payload: changes.runwayChanged,
      timestamp: new Date().toISOString(),
      consumed: []
    })
    
    // Emit critical runway alert if needed
    if (model.cash.runwayStatus === 'critical') {
      os.events.push({
        type: 'cfo-runway-critical',
        from: 'cfo-model',
        payload: { 
          runway: model.cash.runwayMonths,
          message: 'CRITICAL: Less than 3 months runway remaining'
        },
        timestamp: new Date().toISOString(),
        consumed: []
      })
    }
  }
  
  // Emit burn rate change
  if (changes.burnRateChanged) {
    os.events.push({
      type: 'burn-rate-changed',
      from: 'cfo-model',
      payload: changes.burnRateChanged,
      timestamp: new Date().toISOString(),
      consumed: []
    })
  }
  
  // Emit milestone achievement
  if (changes.milestone) {
    os.events.push({
      type: 'milestone-achieved',
      from: 'cfo-model',
      payload: { milestone: changes.milestone },
      timestamp: new Date().toISOString(),
      consumed: []
    })
  }
}

function saveModel(os: CompanyOS, model: FinancialModel): void {
  if (!os.departments.cfo) {
    os.departments.cfo = {
      status: 'steering',
      currentFocus: 'Maintaining financial model',
      lastAction: null,
      pendingDecisions: [],
      memory: [],
      signals: []
    }
  }
  
  // Remove old model from memory
  os.departments.cfo.memory = os.departments.cfo.memory.filter(m => 
    !m.startsWith('MODEL:')
  )
  
  // Add current model
  os.departments.cfo.memory.push(`MODEL:${JSON.stringify(model)}`)
  
  // Update last action
  os.departments.cfo.lastAction = {
    type: 'model-updated',
    description: `Updated financial model for ${model.month}`,
    timestamp: new Date().toISOString(),
    impact: ['all']
  }
}

function formatFinancialModel(model: FinancialModel, changes: any): string {
  const lines: string[] = []
  
  lines.push(`FINANCIAL MODEL · ${model.month}`)
  lines.push('')
  lines.push('━━━ REVENUE ━━━')
  lines.push(`MRR:              $${model.revenue.mrr.toLocaleString()}  (${model.revenue.mrrGrowthRate >= 0 ? '+' : ''}${model.revenue.mrrGrowthRate}% MoM)`)
  lines.push(`One-time:         $${model.revenue.oneTimeRevenue.toLocaleString()}`)
  lines.push(`ARR:              $${model.revenue.arr.toLocaleString()}`)
  lines.push(`Active customers: ${model.revenue.activeCustomers}`)
  lines.push('')
  
  lines.push('━━━ EXPENSES ━━━')
  const total = model.expenses.total || 1
  lines.push(`Personnel:        $${model.expenses.personnel.toLocaleString()}  (${Math.round(model.expenses.personnel/total*100)}% of total)`)
  lines.push(`Infrastructure:   $${model.expenses.infrastructure.toLocaleString()}  (${Math.round(model.expenses.infrastructure/total*100)}% of total)`)
  lines.push(`Marketing/Sales:  $${model.expenses.marketingSales.toLocaleString()}  (${Math.round(model.expenses.marketingSales/total*100)}% of total)`)
  lines.push(`Operations:       $${model.expenses.operations.toLocaleString()}  (${Math.round(model.expenses.operations/total*100)}% of total)`)
  lines.push(`R&D:              $${model.expenses.rnd.toLocaleString()}  (${Math.round(model.expenses.rnd/total*100)}% of total)`)
  lines.push('───────────────────────────')
  lines.push(`Total expenses:   $${model.expenses.total.toLocaleString()}`)
  lines.push('')
  
  lines.push('━━━ UNIT ECONOMICS ━━━')
  lines.push(`CAC:              $${Math.round(model.unitEconomics.cac).toLocaleString()}`)
  lines.push(`LTV:              $${Math.round(model.unitEconomics.ltv).toLocaleString()}`)
  const healthIcon = model.unitEconomics.health === 'healthy' ? '✓ Healthy' 
    : model.unitEconomics.health === 'concerning' ? '⚠ Concerning' 
    : '✗ Unhealthy'
  lines.push(`LTV:CAC ratio:    ${model.unitEconomics.ltvCacRatio.toFixed(1)}:1  ${healthIcon}`)
  lines.push(`Payback period:   ${Math.round(model.unitEconomics.paybackPeriodMonths)} months`)
  lines.push('')
  
  lines.push('━━━ CASH POSITION ━━━')
  lines.push(`Revenue:          $${Math.round(model.cash.revenue).toLocaleString()}/month`)
  lines.push(`Expenses:         $${Math.round(model.cash.expenses).toLocaleString()}/month`)
  lines.push(`Net burn:         $${Math.round(model.cash.netBurn).toLocaleString()}/month`)
  lines.push(`Cash on hand:     $${model.cash.cashOnHand.toLocaleString()}`)
  const runwayIcon = model.cash.runwayStatus === 'safe' ? '✓ Safe'
    : model.cash.runwayStatus === 'warning' ? '⚠ Warning'
    : '✗ Critical'
  lines.push(`Runway:           ${model.cash.runwayMonths} months  ${runwayIcon}`)
  lines.push('')
  
  lines.push('━━━ THRESHOLDS ━━━')
  lines.push('· Runway < 12 months: ⚠ Start fundraising conversations')
  lines.push('· Runway < 6 months:  🚨 Emergency mode')
  lines.push('· Runway < 3 months:  ⛔ Critical - immediate action required')
  
  if (changes.milestone) {
    lines.push('')
    lines.push(`🎉 MILESTONE ACHIEVED: ${changes.milestone.replace('_', ' ').toUpperCase()}`)
  }
  
  return lines.join('\n')
}
```

## Coordination

**Reads:**
- `company.os.profile` — company stage and current revenue
- `company.os.departments.*` — all department activity for financial impact
- `company.os.events` — revenue, expense, hiring events

**Emits:**
- `model-updated` → notifies all departments of updated financials
- `runway-changed` → alerts when runway shifts significantly
- `burn-rate-changed` → alerts when burn rate increases/decreases
- `milestone-achieved` → celebrates financial milestones
- `cfo-runway-critical` → emergency alert when runway < 3 months

**Consumed by:**
- All departments (awareness of financial constraints)
- CFO fundraising agent (uses runway for urgency)
- CFO budget agent (uses expenses for variance tracking)
- CFO risk agent (uses metrics for scenario modeling)
- CEO briefing (includes financial snapshot)
