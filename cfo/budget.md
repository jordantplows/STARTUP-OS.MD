---
name: cfo-budget
executive: cfo
role: steering
reads:
  - company.os.departments
  - company.os.events
events:
  emits: [budget-allocated, budget-exceeded, budget-warning, spend-approved]
  watches: [expense-incurred, hire-made, department-budget-request]
template-ref: templates/executives/budget.md
---

## What this agent does

The CFO budget agent tracks departmental spending against allocated budgets, flags overruns, approves or denies budget requests, and ensures the company stays within overall burn rate targets.

## Instructions

### WATCH

Trigger when:
- Department incurs an expense (`expense-incurred` event)
- Department requests budget allocation (`department-budget-request` event)
- Monthly budget review is due (1st of month)
- A department exceeds budget threshold (80% or 100%)
- Founder requests budget status

### REASON

Budget management follows this framework:

**Budget allocation:**
1. Start with target monthly burn rate
2. Allocate by department based on priorities
3. Typical allocation (early stage):
   - Engineering: 40% (salaries, infrastructure)
   - Product: 20% (design, research, tools)
   - Marketing/Sales: 20% (ads, tools, events)
   - Operations: 10% (legal, accounting, admin)
   - Reserve: 10% (unexpected costs)

**Spend tracking:**
1. Every expense event updates department spend
2. Calculate % of budget used
3. Flag when department hits 80% (warning) or 100% (exceeded)
4. Compare actual burn vs target burn

**Budget requests:**
1. **Approve if:**
   - Request is within department's allocated budget
   - Critical infrastructure or hiring need
   - Clear ROI or business case
   - Overall burn stays within target

2. **Deny if:**
   - Department already over budget
   - Not aligned with current priorities
   - Poor ROI or weak justification
   - Would push burn over runway limit

3. **Escalate to founder if:**
   - Large request (>$10k)
   - Strategic decision (e.g., hire, major tool)
   - Cross-department impact

### ACT

Output format for budget dashboard:

```
BUDGET DASHBOARD · [Month]

━━━ OVERALL ━━━
Target burn:      $[amount]/month
Actual burn:      $[amount]/month  ([over/under] by $[amount])
Burn variance:    [+/-]% [✓ On track | ⚠ Warning | ✗ Over budget]

━━━ DEPARTMENT BUDGETS ━━━
Engineering
  Allocated:      $[amount]
  Spent:          $[amount]  ([%]%)  [Progress bar]
  Status:         [✓ On track | ⚠ Warning | ✗ Exceeded]

Product
  Allocated:      $[amount]
  Spent:          $[amount]  ([%]%)  [Progress bar]
  Status:         [✓ On track | ⚠ Warning | ✗ Exceeded]

Marketing/Sales
  Allocated:      $[amount]
  Spent:          $[amount]  ([%]%)  [Progress bar]
  Status:         [✓ On track | ⚠ Warning | ✗ Exceeded]

Operations
  Allocated:      $[amount]
  Spent:          $[amount]  ([%]%)  [Progress bar]
  Status:         [✓ On track | ⚠ Warning | ✗ Exceeded]

━━━ PENDING REQUESTS ━━━
· [Department] - $[amount] for [purpose]
· [Department] - $[amount] for [purpose]

━━━ ALERTS ━━━
· [Department] at [%]% of budget
· [Department] exceeded budget by $[amount]
```

### COORDINATE

After budget updates:
- Emit `budget-allocated` when new budgets set
- Emit `budget-warning` when department hits 80%
- Emit `budget-exceeded` when department hits 100%
- Emit `spend-approved` or `spend-denied` for requests
- Update CFO memory with budget state
- Flag to founder if multiple departments over budget

## TypeScript

```typescript
import { CompanyOS } from '../src/company-os'

interface DepartmentBudget {
  department: string
  allocated: number
  spent: number
  percentUsed: number
  status: 'on-track' | 'warning' | 'exceeded'
}

interface BudgetRequest {
  id: string
  from: string
  amount: number
  purpose: string
  justification: string
  status: 'pending' | 'approved' | 'denied'
  decidedAt?: string
}

interface BudgetState {
  month: string
  targetBurn: number
  actualBurn: number
  departmentBudgets: DepartmentBudget[]
  pendingRequests: BudgetRequest[]
  alerts: string[]
}

export async function run(os: CompanyOS, context: string): Promise<string> {
  // Load budget state from CFO memory
  let budgetState = loadBudgetState(os)
  
  if (!budgetState) {
    // Initialize budgets based on financial model
    budgetState = initializeBudgets(os)
  }
  
  // Check if we're in a new month
  const currentMonth = new Date().toISOString().substring(0, 7)
  if (currentMonth !== budgetState.month) {
    budgetState = rolloverMonth(os, budgetState)
  }
  
  // Process new expense events
  processExpenseEvents(os, budgetState)
  
  // Check for budget requests
  processBudgetRequests(os, budgetState)
  
  // Calculate actual burn from recent expenses
  budgetState.actualBurn = calculateActualBurn(budgetState)
  
  // Update department budget statuses
  updateBudgetStatuses(budgetState)
  
  // Generate alerts
  budgetState.alerts = generateAlerts(budgetState)
  
  // Emit warning/exceeded events
  emitBudgetEvents(os, budgetState)
  
  // Save updated state
  saveBudgetState(os, budgetState)
  
  // Format output
  return formatBudgetDashboard(budgetState)
}

function loadBudgetState(os: CompanyOS): BudgetState | null {
  if (!os.departments.cfo) return null
  
  const memory = os.departments.cfo.memory.find(m => m.startsWith('BUDGET:'))
  if (!memory) return null
  
  try {
    return JSON.parse(memory.replace('BUDGET:', ''))
  } catch {
    return null
  }
}

function saveBudgetState(os: CompanyOS, state: BudgetState): void {
  if (!os.departments.cfo) {
    os.departments.cfo = {
      status: 'steering',
      currentFocus: 'Managing departmental budgets',
      lastAction: null,
      pendingDecisions: [],
      memory: [],
      signals: []
    }
  }
  
  // Remove old budget state
  os.departments.cfo.memory = os.departments.cfo.memory.filter(m => 
    !m.startsWith('BUDGET:')
  )
  
  // Add updated state
  os.departments.cfo.memory.push(`BUDGET:${JSON.stringify(state)}`)
}

function initializeBudgets(os: CompanyOS): BudgetState {
  // Get target burn from financial model
  let targetBurn = 50000 // Default $50k/month
  
  const modelMemory = os.departments.cfo?.memory.find(m => m.startsWith('MODEL:'))
  if (modelMemory) {
    try {
      const model = JSON.parse(modelMemory.replace('MODEL:', ''))
      targetBurn = model.cash.netBurn || targetBurn
    } catch {
      // Use default
    }
  }
  
  // Allocate budget by department (typical early-stage split)
  const departments = [
    { name: 'engineering', percent: 40 },
    { name: 'product', percent: 20 },
    { name: 'marketing', percent: 15 },
    { name: 'sales', percent: 10 },
    { name: 'operations', percent: 10 },
    { name: 'reserve', percent: 5 }
  ]
  
  const budgets: DepartmentBudget[] = departments.map(d => ({
    department: d.name,
    allocated: targetBurn * (d.percent / 100),
    spent: 0,
    percentUsed: 0,
    status: 'on-track'
  }))
  
  const state: BudgetState = {
    month: new Date().toISOString().substring(0, 7),
    targetBurn,
    actualBurn: 0,
    departmentBudgets: budgets,
    pendingRequests: [],
    alerts: []
  }
  
  // Emit budget-allocated event
  os.events.push({
    type: 'budget-allocated',
    from: 'cfo-budget',
    payload: { targetBurn, budgets },
    timestamp: new Date().toISOString(),
    consumed: []
  })
  
  return state
}

function rolloverMonth(os: CompanyOS, oldState: BudgetState): BudgetState {
  // Reset spent amounts for new month
  const newBudgets = oldState.departmentBudgets.map(b => ({
    ...b,
    spent: 0,
    percentUsed: 0,
    status: 'on-track' as const
  }))
  
  return {
    month: new Date().toISOString().substring(0, 7),
    targetBurn: oldState.targetBurn,
    actualBurn: 0,
    departmentBudgets: newBudgets,
    pendingRequests: [],
    alerts: []
  }
}

function processExpenseEvents(os: CompanyOS, state: BudgetState): void {
  // Find unprocessed expense events from current month
  const monthStart = new Date(state.month + '-01').toISOString()
  const expenseEvents = os.events.filter(e =>
    e.type === 'expense-incurred' &&
    e.timestamp >= monthStart &&
    !e.consumed.includes('cfo-budget')
  )
  
  for (const event of expenseEvents) {
    event.consumed.push('cfo-budget')
    
    const department = event.from
    const amount = event.payload.amount as number || 0
    
    // Find department budget and add spend
    const deptBudget = state.departmentBudgets.find(b => b.department === department)
    if (deptBudget) {
      deptBudget.spent += amount
    }
  }
}

function processBudgetRequests(os: CompanyOS, state: BudgetState): void {
  // Find budget request events
  const requests = os.events.filter(e =>
    e.type === 'department-budget-request' &&
    !e.consumed.includes('cfo-budget')
  )
  
  for (const event of requests) {
    event.consumed.push('cfo-budget')
    
    const request: BudgetRequest = {
      id: `req-${Date.now()}`,
      from: event.from,
      amount: event.payload.amount as number,
      purpose: event.payload.purpose as string,
      justification: event.payload.justification as string || '',
      status: 'pending'
    }
    
    // Evaluate request
    const decision = evaluateBudgetRequest(request, state, os)
    
    if (decision === 'approve') {
      request.status = 'approved'
      request.decidedAt = new Date().toISOString()
      
      // Add to department budget
      const deptBudget = state.departmentBudgets.find(b => b.department === request.from)
      if (deptBudget) {
        deptBudget.allocated += request.amount
      }
      
      os.events.push({
        type: 'spend-approved',
        from: 'cfo-budget',
        payload: { requestId: request.id, amount: request.amount, department: request.from },
        timestamp: new Date().toISOString(),
        consumed: []
      })
    } else if (decision === 'deny') {
      request.status = 'denied'
      request.decidedAt = new Date().toISOString()
      
      os.events.push({
        type: 'spend-denied',
        from: 'cfo-budget',
        payload: { requestId: request.id, reason: 'Over budget or insufficient justification' },
        timestamp: new Date().toISOString(),
        consumed: []
      })
    } else {
      // Escalate to founder
      state.pendingRequests.push(request)
    }
  }
}

function evaluateBudgetRequest(
  request: BudgetRequest,
  state: BudgetState,
  os: CompanyOS
): 'approve' | 'deny' | 'escalate' {
  const deptBudget = state.departmentBudgets.find(b => b.department === request.from)
  
  // Large requests need founder approval
  if (request.amount > 10000) {
    return 'escalate'
  }
  
  // If department is over budget, deny
  if (deptBudget && deptBudget.status === 'exceeded') {
    return 'deny'
  }
  
  // If request would push department over budget, escalate
  if (deptBudget && (deptBudget.spent + request.amount) > deptBudget.allocated) {
    return 'escalate'
  }
  
  // If overall burn would exceed target significantly, escalate
  if (state.actualBurn + request.amount > state.targetBurn * 1.2) {
    return 'escalate'
  }
  
  // Otherwise approve
  return 'approve'
}

function calculateActualBurn(state: BudgetState): number {
  return state.departmentBudgets.reduce((sum, b) => sum + b.spent, 0)
}

function updateBudgetStatuses(state: BudgetState): void {
  for (const budget of state.departmentBudgets) {
    budget.percentUsed = budget.allocated > 0 
      ? Math.round((budget.spent / budget.allocated) * 100)
      : 0
    
    if (budget.percentUsed >= 100) {
      budget.status = 'exceeded'
    } else if (budget.percentUsed >= 80) {
      budget.status = 'warning'
    } else {
      budget.status = 'on-track'
    }
  }
}

function generateAlerts(state: BudgetState): string[] {
  const alerts: string[] = []
  
  // Alert for departments at warning or exceeded
  for (const budget of state.departmentBudgets) {
    if (budget.status === 'exceeded') {
      const overage = budget.spent - budget.allocated
      alerts.push(`${budget.department} exceeded budget by $${overage.toLocaleString()}`)
    } else if (budget.status === 'warning') {
      alerts.push(`${budget.department} at ${budget.percentUsed}% of budget`)
    }
  }
  
  // Alert if overall burn is significantly over target
  const burnVariance = ((state.actualBurn - state.targetBurn) / state.targetBurn) * 100
  if (burnVariance > 20) {
    alerts.push(`Overall burn ${Math.round(burnVariance)}% over target`)
  }
  
  return alerts
}

function emitBudgetEvents(os: CompanyOS, state: BudgetState): void {
  for (const budget of state.departmentBudgets) {
    // Check if we just crossed a threshold
    if (budget.status === 'warning') {
      // Check if we already emitted warning for this department this month
      const alreadyWarned = os.events.some(e =>
        e.type === 'budget-warning' &&
        e.payload.department === budget.department &&
        e.timestamp >= new Date(state.month + '-01').toISOString()
      )
      
      if (!alreadyWarned) {
        os.events.push({
          type: 'budget-warning',
          from: 'cfo-budget',
          payload: { 
            department: budget.department, 
            percentUsed: budget.percentUsed 
          },
          timestamp: new Date().toISOString(),
          consumed: []
        })
      }
    } else if (budget.status === 'exceeded') {
      const alreadyAlerted = os.events.some(e =>
        e.type === 'budget-exceeded' &&
        e.payload.department === budget.department &&
        e.timestamp >= new Date(state.month + '-01').toISOString()
      )
      
      if (!alreadyAlerted) {
        os.events.push({
          type: 'budget-exceeded',
          from: 'cfo-budget',
          payload: { 
            department: budget.department,
            overage: budget.spent - budget.allocated
          },
          timestamp: new Date().toISOString(),
          consumed: []
        })
      }
    }
  }
}

function formatBudgetDashboard(state: BudgetState): string {
  const lines: string[] = []
  
  lines.push(`BUDGET DASHBOARD · ${state.month}`)
  lines.push('')
  
  lines.push('━━━ OVERALL ━━━')
  lines.push(`Target burn:      $${state.targetBurn.toLocaleString()}/month`)
  lines.push(`Actual burn:      $${state.actualBurn.toLocaleString()}/month`, '')
  
  const variance = state.actualBurn - state.targetBurn
  const variancePct = state.targetBurn > 0 
    ? Math.round((variance / state.targetBurn) * 100)
    : 0
  
  let statusIcon = '✓ On track'
  if (variancePct > 20) statusIcon = '✗ Over budget'
  else if (variancePct > 10) statusIcon = '⚠ Warning'
  
  if (variance !== 0) {
    const direction = variance > 0 ? 'over' : 'under'
    lines.push(`                  (${direction} by $${Math.abs(variance).toLocaleString()})`)
  }
  
  lines.push(`Burn variance:    ${variancePct >= 0 ? '+' : ''}${variancePct}%  ${statusIcon}`)
  lines.push('')
  
  lines.push('━━━ DEPARTMENT BUDGETS ━━━')
  for (const budget of state.departmentBudgets) {
    if (budget.department === 'reserve') continue // Skip reserve in display
    
    lines.push(budget.department.charAt(0).toUpperCase() + budget.department.slice(1))
    lines.push(`  Allocated:      $${budget.allocated.toLocaleString()}`)
    
    const progressBar = '█'.repeat(Math.min(10, Math.floor(budget.percentUsed / 10))) +
                       '░'.repeat(Math.max(0, 10 - Math.floor(budget.percentUsed / 10)))
    
    lines.push(`  Spent:          $${budget.spent.toLocaleString()}  (${budget.percentUsed}%)  ${progressBar}`)
    
    const statusDisplay = budget.status === 'on-track' ? '✓ On track'
      : budget.status === 'warning' ? '⚠ Warning'
      : '✗ Exceeded'
    lines.push(`  Status:         ${statusDisplay}`)
    lines.push('')
  }
  
  if (state.pendingRequests.length > 0) {
    lines.push('━━━ PENDING REQUESTS ━━━')
    for (const req of state.pendingRequests) {
      lines.push(`· ${req.from} - $${req.amount.toLocaleString()} for ${req.purpose}`)
    }
    lines.push('')
  }
  
  if (state.alerts.length > 0) {
    lines.push('━━━ ALERTS ━━━')
    for (const alert of state.alerts) {
      lines.push(`· ${alert}`)
    }
  }
  
  return lines.join('\n')
}
```

## Coordination

**Reads:**
- `company.os.departments.*` — all department spending activity
- `company.os.events` — expense events, budget requests

**Emits:**
- `budget-allocated` → announces new monthly budgets
- `budget-warning` → alerts when department hits 80% spend
- `budget-exceeded` → alerts when department over budget
- `spend-approved` / `spend-denied` → responds to budget requests

**Consumed by:**
- All departments (need budget approval for spending)
- CFO model agent (uses spend data for expense tracking)
- CEO briefing (includes budget status)
