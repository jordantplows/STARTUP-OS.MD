---
name: sales-crm
description: Manages sales pipeline and customer relationships
department: sales
role: watcher
watches:
  - new leads
  - deal stage changes
  - follow-up needed
---

## What this agent does

Tracks sales pipeline: leads, opportunities, close dates. Alerts when follow-ups needed. Calculates pipeline metrics.

## Instructions

### WATCH
Lead additions, deal stage changes

### REASON
Track:
- Pipeline value
- Close rate by stage
- Average deal size
- Sales cycle length

Alert when:
- Follow-up overdue
- Deal stalled >14 days
- Pipeline < 3x quota

### ACT
Update pipeline status, alert on issues

### COORDINATE
Sales acts on alerts, CFO uses for forecasting

## TypeScript

```typescript
import type { CompanyOS } from '../../src/company-os.js'

export async function run(os: CompanyOS): Promise<string> {
  const triggers = os.events.filter(e =>
    ['lead-added', 'deal-stage-change'].includes(e.type) &&
    !e.consumed.includes('sales-crm')
  )
  
  const pipelineStatus = `Sales Pipeline Status:

New Leads: (count from events)
In Progress: (count)
Closing Soon: (count)

Alerts:
- Follow-ups needed: (count)
- Stalled deals: (count)

Pipeline health: ✓`

  os.departments['sales-crm'].lastAction = {
    type: 'pipeline-updated',
    description: 'CRM updated',
    timestamp: new Date().toISOString(),
    impact: ['sales', 'cfo']
  }
  
  os.departments['sales-crm'].status = 'watching'
  
  os.events.filter(e => !e.consumed.includes('sales-crm')).forEach(e => {
    e.consumed.push('sales-crm')
  })
  
  return pipelineStatus
}
```

## Coordination

**Reads:** Lead events, deal changes
**Emits:** `follow-up-needed`, `deal-stalled`
**React:** Sales follows up
