---
name: coo-vendors
executive: coo
role: steering
reads:
  - company.os.profile
  - company.os.departments
  - company.os.decisions
events:
  emits: [vendor-renewal-due, vendor-performance-issue, vendor-consolidated]
  watches: [contract-expiring, vendor-outage, cost-threshold-exceeded]
template-ref: templates/executives/vendors.md
---

## What this agent does

The COO vendor management agent tracks contracts, renewals, vendor relationships, and performance. It ensures the company isn't surprised by renewals, consolidates redundant tools, and flags vendor issues before they impact operations.

## Instructions

### WATCH

Trigger when:
- Contract renewal coming up in next 60 days
- Vendor has outage or performance issue
- Monthly spend crosses budget threshold
- Multiple departments use competing tools for same function
- Department requests new vendor
- Quarterly vendor review is due

### REASON

Vendor management framework:

**Vendor lifecycle:**
1. **Evaluation** — department proposes vendor, COO reviews for duplication
2. **Procurement** — negotiate contract, ensure legal/security review
3. **Onboarding** — setup, access management, documentation
4. **Monitoring** — track usage, performance, spend
5. **Renewal** — assess value 60 days before renewal, renegotiate or churn
6. **Offboarding** — data export, access revocation, handoff to replacement

**When to consolidate:**
- Multiple tools doing same job
- Low utilization across org
- Overlapping features with other vendors
- Can move to higher tier of existing vendor instead

**When to churn:**
- Poor performance or frequent outages
- Better alternative exists at lower cost
- No longer aligned with company needs
- Vendor acquired/changed terms unfavorably

**When to renew:**
- High utilization and satisfaction
- Core to operations
- Switching cost > annual cost
- Good vendor relationship

### ACT

Vendor dashboard format:

```
VENDOR MANAGEMENT · [Date]

ACTIVE VENDORS: [N]
Monthly Spend: $[X]
Budget: $[Y]
Utilization: [X]% under budget

RENEWALS DUE (Next 90 Days)
🔴 [Vendor] - [Due Date] - $[Annual]
   Status: [under-review | renewing | churning]
   Decision: [What to do]
   Owner: [Who decides]

🟡 [Vendor] - [Due Date] - $[Annual]
   Status: [under-review | renewing | churning]

PERFORMANCE ISSUES
· [Vendor]: [Issue description] - [Impact]
  Escalated: [Yes/No]
  Backup plan: [What to do if continues]

CONSOLIDATION OPPORTUNITIES
· [Function]: Currently using [Vendor A] and [Vendor B]
  Proposal: [Move to X or consolidate to Y]
  Savings: $[Amount]/year
  Migration effort: [Low/Medium/High]

NEW REQUESTS
· [Department] requested [Vendor] for [Use case]
  Assessment: [Approve/Deny/Alternative]
  Reason: [Why]

TOP SPEND
1. [Vendor] - $[X]/month - [Category]
2. [Vendor] - $[X]/month - [Category]
3. [Vendor] - $[X]/month - [Category]
```

### COORDINATE

After vendor assessment:
- Emit `vendor-renewal-due` event 60 days before expiration
- Emit `vendor-performance-issue` event if SLA breached
- Emit `vendor-consolidated` event when redundant tools merged
- Update `company.os.decisions` with renewal/churn decisions
- Flag to finance department for budget impact

## TypeScript

```typescript
import { CompanyOS } from '../src/company-os'

interface Vendor {
  name: string
  category: string
  monthlySpend: number
  annualContract: number
  renewalDate: string
  status: 'active' | 'under-review' | 'renewing' | 'churning'
  owner: string
  utilization: 'high' | 'medium' | 'low'
  performance: 'good' | 'degraded' | 'poor'
  issueCount: number
}

interface ConsolidationOpportunity {
  function: string
  currentVendors: string[]
  proposal: string
  savings: number
  effort: 'low' | 'medium' | 'high'
}

interface VendorRequest {
  department: string
  vendor: string
  useCase: string
  assessment: 'approve' | 'deny' | 'alternative'
  reason: string
}

export async function run(os: CompanyOS, context: string): Promise<string> {
  // Load vendor registry
  const vendors = loadVendors(os)
  
  // Calculate total spend
  const totalSpend = vendors.reduce((sum, v) => sum + v.monthlySpend, 0)
  const budget = extractVendorBudget(os)
  
  // Identify renewals due in next 90 days
  const upcomingRenewals = identifyRenewals(vendors, 90)
  
  // Check for performance issues
  const performanceIssues = checkVendorPerformance(vendors, os)
  
  // Find consolidation opportunities
  const consolidations = findConsolidationOpportunities(vendors)
  
  // Review new vendor requests
  const newRequests = reviewVendorRequests(os, vendors)
  
  // Emit events for renewals
  for (const vendor of upcomingRenewals) {
    const daysUntil = daysUntilDate(vendor.renewalDate)
    if (daysUntil <= 60) {
      const alreadyEmitted = os.events.some(e => 
        e.type === 'vendor-renewal-due' &&
        e.payload.vendorName === vendor.name &&
        e.timestamp > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      )
      if (!alreadyEmitted) {
        os.events.push({
          type: 'vendor-renewal-due',
          from: 'coo-vendors',
          payload: { vendor },
          timestamp: new Date().toISOString(),
          consumed: []
        })
      }
    }
  }
  
  // Emit events for performance issues
  for (const issue of performanceIssues) {
    os.events.push({
      type: 'vendor-performance-issue',
      from: 'coo-vendors',
      payload: { issue },
      timestamp: new Date().toISOString(),
      consumed: []
    })
  }
  
  // Emit events for consolidations
  for (const consolidation of consolidations) {
    if (consolidation.savings > 1000) { // Only emit if meaningful savings
      os.events.push({
        type: 'vendor-consolidated',
        from: 'coo-vendors',
        payload: { consolidation },
        timestamp: new Date().toISOString(),
        consumed: []
      })
    }
  }
  
  // Update COO state
  if (!os.departments.coo) {
    os.departments.coo = {
      status: 'steering',
      currentFocus: 'Vendor management',
      lastAction: null,
      pendingDecisions: [],
      memory: [],
      signals: []
    }
  }
  
  os.departments.coo.memory.push(
    `VENDOR_REGISTRY:${new Date().toISOString()}:${JSON.stringify(vendors)}`
  )
  
  os.departments.coo.lastAction = {
    type: 'vendor-review',
    description: `Reviewed ${vendors.length} vendors, ${upcomingRenewals.length} renewals due`,
    timestamp: new Date().toISOString(),
    impact: ['finance', 'operations']
  }
  
  // Create decisions for renewals
  for (const vendor of upcomingRenewals) {
    const existingDecision = os.decisions.find(d => 
      d.question.includes(vendor.name) && d.question.includes('renew')
    )
    if (!existingDecision && daysUntilDate(vendor.renewalDate) <= 60) {
      os.decisions.push({
        id: `vendor-renewal-${vendor.name}`,
        question: `Renew ${vendor.name} contract at $${vendor.annualContract}/year?`,
        context: `Contract expires ${vendor.renewalDate}. Current utilization: ${vendor.utilization}.`,
        askedBy: 'coo-vendors',
        askedAt: new Date().toISOString(),
        blocking: ['operations'],
        answer: null
      })
    }
  }
  
  return formatVendorDashboard(vendors, totalSpend, budget, upcomingRenewals, performanceIssues, consolidations, newRequests)
}

function loadVendors(os: CompanyOS): Vendor[] {
  // In real impl, would load from vendor registry file or database
  // For now, extract from COO memory
  if (!os.departments.coo) return getDefaultVendors(os)
  
  const vendorMemory = os.departments.coo.memory.find(m => m.startsWith('VENDOR_REGISTRY:'))
  if (!vendorMemory) return getDefaultVendors(os)
  
  try {
    const json = vendorMemory.split('VENDOR_REGISTRY:')[1].split(':').slice(1).join(':')
    return JSON.parse(json)
  } catch {
    return getDefaultVendors(os)
  }
}

function getDefaultVendors(os: CompanyOS): Vendor[] {
  // Bootstrap with common startup vendors
  const stage = os.profile.stage
  const vendors: Vendor[] = []
  
  // Infrastructure (everyone needs)
  vendors.push({
    name: 'AWS',
    category: 'Infrastructure',
    monthlySpend: 500,
    annualContract: 6000,
    renewalDate: addMonths(new Date(), 6).toISOString(),
    status: 'active',
    owner: 'engineering',
    utilization: 'high',
    performance: 'good',
    issueCount: 0
  })
  
  if (stage !== 'idea') {
    vendors.push({
      name: 'GitHub',
      category: 'Development',
      monthlySpend: 50,
      annualContract: 600,
      renewalDate: addMonths(new Date(), 8).toISOString(),
      status: 'active',
      owner: 'engineering',
      utilization: 'high',
      performance: 'good',
      issueCount: 0
    })
  }
  
  if (stage === 'revenue' || stage === 'growth') {
    vendors.push({
      name: 'Stripe',
      category: 'Payments',
      monthlySpend: 100,
      annualContract: 1200,
      renewalDate: addMonths(new Date(), 4).toISOString(),
      status: 'active',
      owner: 'finance',
      utilization: 'high',
      performance: 'good',
      issueCount: 0
    })
  }
  
  return vendors
}

function extractVendorBudget(os: CompanyOS): number {
  // Extract budget from finance department
  const finance = os.departments.finance
  if (!finance) return 10000 // default budget
  
  const budgetMemory = finance.memory.find(m => m.includes('VENDOR_BUDGET:'))
  if (!budgetMemory) return 10000
  
  const match = budgetMemory.match(/VENDOR_BUDGET:(\d+)/)
  return match ? parseInt(match[1]) : 10000
}

function identifyRenewals(vendors: Vendor[], daysAhead: number): Vendor[] {
  const cutoffDate = addDays(new Date(), daysAhead)
  
  return vendors.filter(v => {
    const renewalDate = new Date(v.renewalDate)
    return renewalDate <= cutoffDate && renewalDate > new Date()
  }).sort((a, b) => 
    new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime()
  )
}

function checkVendorPerformance(vendors: Vendor[], os: CompanyOS): Array<{ vendor: string; issue: string; impact: string }> {
  const issues: Array<{ vendor: string; issue: string; impact: string }> = []
  
  // Check for vendors with poor performance
  for (const vendor of vendors) {
    if (vendor.performance === 'poor') {
      issues.push({
        vendor: vendor.name,
        issue: `${vendor.issueCount} incidents in recent period`,
        impact: `Affecting ${vendor.owner} department operations`
      })
    }
  }
  
  // Check events for vendor-related issues
  const recentEvents = os.events.slice(-100)
  for (const event of recentEvents) {
    if (event.type.includes('outage') || event.type.includes('degraded')) {
      const vendorMatch = vendors.find(v => event.payload?.vendor === v.name)
      if (vendorMatch && !issues.some(i => i.vendor === vendorMatch.name)) {
        issues.push({
          vendor: vendorMatch.name,
          issue: 'Recent outage detected',
          impact: 'Service disruption'
        })
      }
    }
  }
  
  return issues
}

function findConsolidationOpportunities(vendors: Vendor[]): ConsolidationOpportunity[] {
  const opportunities: ConsolidationOpportunity[] = []
  
  // Group vendors by category
  const byCategory = new Map<string, Vendor[]>()
  for (const vendor of vendors) {
    if (!byCategory.has(vendor.category)) {
      byCategory.set(vendor.category, [])
    }
    byCategory.get(vendor.category)!.push(vendor)
  }
  
  // Find categories with multiple vendors
  for (const [category, vendorList] of byCategory) {
    if (vendorList.length > 1) {
      // Check if any are low utilization
      const lowUtil = vendorList.filter(v => v.utilization === 'low')
      if (lowUtil.length > 0) {
        const totalSpend = lowUtil.reduce((sum, v) => sum + v.monthlySpend, 0)
        opportunities.push({
          function: category,
          currentVendors: lowUtil.map(v => v.name),
          proposal: `Consolidate to ${vendorList.find(v => v.utilization === 'high')?.name || vendorList[0].name}`,
          savings: totalSpend * 12,
          effort: 'medium'
        })
      }
    }
  }
  
  return opportunities
}

function reviewVendorRequests(os: CompanyOS, currentVendors: Vendor[]): VendorRequest[] {
  const requests: VendorRequest[] = []
  
  // Look for vendor requests in events
  const recentEvents = os.events.slice(-50)
  for (const event of recentEvents) {
    if (event.type === 'vendor-requested' && !event.consumed.includes('coo-vendors')) {
      event.consumed.push('coo-vendors')
      
      const requestedVendor = event.payload.vendor
      const useCase = event.payload.useCase
      
      // Check for duplication
      const duplicate = currentVendors.find(v => 
        v.category === event.payload.category || v.name === requestedVendor
      )
      
      if (duplicate) {
        requests.push({
          department: event.from,
          vendor: requestedVendor,
          useCase,
          assessment: 'alternative',
          reason: `Use existing ${duplicate.name} instead`
        })
      } else {
        requests.push({
          department: event.from,
          vendor: requestedVendor,
          useCase,
          assessment: 'approve',
          reason: 'No duplication, legitimate need'
        })
      }
    }
  }
  
  return requests
}

function daysUntilDate(dateString: string): number {
  const date = new Date(dateString)
  const now = new Date()
  const diff = date.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

function addMonths(date: Date, months: number): Date {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months)
  return result
}

function formatVendorDashboard(
  vendors: Vendor[],
  totalSpend: number,
  budget: number,
  renewals: Vendor[],
  issues: Array<{ vendor: string; issue: string; impact: string }>,
  consolidations: ConsolidationOpportunity[],
  requests: VendorRequest[]
): string {
  const lines: string[] = []
  
  lines.push(`VENDOR MANAGEMENT · ${new Date().toISOString().split('T')[0]}`)
  lines.push('')
  lines.push(`ACTIVE VENDORS: ${vendors.length}`)
  lines.push(`Monthly Spend: $${totalSpend.toLocaleString()}`)
  lines.push(`Budget: $${budget.toLocaleString()}`)
  const utilization = Math.round((totalSpend / budget) * 100)
  lines.push(`Utilization: ${utilization}% ${utilization < 100 ? 'under' : 'over'} budget`)
  
  if (renewals.length > 0) {
    lines.push('')
    lines.push('RENEWALS DUE (Next 90 Days)')
    for (const vendor of renewals) {
      const daysUntil = daysUntilDate(vendor.renewalDate)
      const urgency = daysUntil <= 30 ? '🔴' : '🟡'
      lines.push(`${urgency} ${vendor.name} - ${vendor.renewalDate.split('T')[0]} - $${vendor.annualContract.toLocaleString()}/year`)
      lines.push(`   Status: ${vendor.status}`)
      lines.push(`   Utilization: ${vendor.utilization}`)
      lines.push(`   Owner: ${vendor.owner}`)
    }
  }
  
  if (issues.length > 0) {
    lines.push('')
    lines.push('PERFORMANCE ISSUES')
    for (const issue of issues) {
      lines.push(`· ${issue.vendor}: ${issue.issue}`)
      lines.push(`  Impact: ${issue.impact}`)
    }
  }
  
  if (consolidations.length > 0) {
    lines.push('')
    lines.push('CONSOLIDATION OPPORTUNITIES')
    for (const opp of consolidations) {
      lines.push(`· ${opp.function}: Currently using ${opp.currentVendors.join(' and ')}`)
      lines.push(`  Proposal: ${opp.proposal}`)
      lines.push(`  Savings: $${opp.savings.toLocaleString()}/year`)
      lines.push(`  Migration effort: ${opp.effort}`)
    }
  }
  
  if (requests.length > 0) {
    lines.push('')
    lines.push('NEW REQUESTS')
    for (const req of requests) {
      lines.push(`· ${req.department} requested ${req.vendor} for ${req.useCase}`)
      lines.push(`  Assessment: ${req.assessment}`)
      lines.push(`  Reason: ${req.reason}`)
    }
  }
  
  // Top spend
  const topSpenders = vendors
    .sort((a, b) => b.monthlySpend - a.monthlySpend)
    .slice(0, 5)
  
  if (topSpenders.length > 0) {
    lines.push('')
    lines.push('TOP SPEND')
    for (let i = 0; i < topSpenders.length; i++) {
      const v = topSpenders[i]
      lines.push(`${i + 1}. ${v.name} - $${v.monthlySpend.toLocaleString()}/month - ${v.category}`)
    }
  }
  
  return lines.join('\n')
}
```

## Coordination

**Reads:**
- `company.os.profile` — stage and budget constraints
- `company.os.departments.*` — department vendor needs
- `company.os.decisions` — renewal decisions
- `company.os.events` — vendor performance incidents

**Emits:**
- `vendor-renewal-due` → alerts 60 days before renewal
- `vendor-performance-issue` → flags reliability problems
- `vendor-consolidated` → announces cost savings

**Consumed by:**
- Finance (budget impact of renewals)
- Operations (vendor performance affects execution)
- Security (vendor access and compliance)
