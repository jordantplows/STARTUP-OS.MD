---
name: customer-support
description: Handles customer support tickets and escalations
department: customer
role: watcher
watches:
  - support tickets
  - bug reports
  - feature requests
---

## What this agent does

Triages support tickets. Escalates bugs to engineering. Routes feature requests to product. Tracks response times.

## Instructions

### WATCH
Support tickets coming in

### REASON
Triage by:
- Bug: escalate to engineering
- Feature request: route to product
- How-to question: answer or document
- Urgent: escalate immediately

### ACT
Respond or escalate

### COORDINATE
Engineering fixes bugs, Product evaluates requests

## TypeScript

```typescript
import type { CompanyOS } from '../../src/company-os.js'

export async function run(os: CompanyOS, ticket: string): Promise<string> {
  const triage = `Support Ticket Triage:

Ticket: ${ticket}

Type: (bug / feature / question / urgent)
Action: (respond / escalate / document)
Assigned to: (engineering / product / support)

Response time: <2 hours for urgent, <24h others

Support handling.`

  os.departments['customer-support'].lastAction = {
    type: 'ticket-triaged',
    description: ticket.slice(0, 100),
    timestamp: new Date().toISOString(),
    impact: ['customer']
  }
  
  os.departments['customer-support'].status = 'watching'
  
  // Emit event if bug or urgent
  if (ticket.toLowerCase().includes('bug') || ticket.toLowerCase().includes('urgent')) {
    os.events.push({
      type: 'support-escalation',
      from: 'customer-support',
      payload: { ticket },
      timestamp: new Date().toISOString(),
      consumed: []
    })
  }
  
  return triage
}
```

## Coordination

**Reads:** Support tickets
**Emits:** `support-escalation` for bugs/urgent
**React:** Engineering fixes, Product evaluates
