---
name: customer-success
description: Ensures customers achieve outcomes and renew
department: customer
role: watcher
watches:
  - customer health scores
  - usage drops
  - renewal dates approaching
---

## What this agent does

Monitors customer health. Intervenes when usage drops. Ensures customers achieve outcomes. Drives renewals.

## Instructions

### WATCH
Usage patterns, health scores, renewal dates

### REASON
Health score based on:
- Usage frequency
- Feature adoption
- Support ticket volume
- NPS score

Intervene when health drops

### ACT
Reach out to at-risk customers

### COORDINATE
Sales handles renewals, Product fixes product issues

## TypeScript

```typescript
import type { CompanyOS } from '../../src/company-os.js'

export async function run(os: CompanyOS): Promise<string> {
  const triggers = os.events.filter(e =>
    ['usage-drop', 'support-ticket', 'renewal-approaching'].includes(e.type) &&
    !e.consumed.includes('customer-success')
  )
  
  const healthCheck = `Customer Health Check:

Healthy: (count)
At Risk: (count)
Churned: (count)

Actions needed:
- Reach out to at-risk customers
- Check in on renewals
- Follow up on support tickets

Customer success status: monitoring`

  os.departments['customer-success'].lastAction = {
    type: 'health-check',
    description: 'Customer health monitored',
    timestamp: new Date().toISOString(),
    impact: ['sales', 'product-direction']
  }
  
  os.departments['customer-success'].status = 'watching'
  
  os.events.filter(e => !e.consumed.includes('customer-success')).forEach(e => {
    e.consumed.push('customer-success')
  })
  
  return healthCheck
}
```

## Coordination

**Reads:** Usage data, support tickets
**Emits:** `customer-at-risk`
**React:** Sales reaches out
