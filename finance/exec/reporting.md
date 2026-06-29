---
name: cfo-reporting
executive: cfo
role: steering
reads:
  - company.os.profile
  - company.os.departments.cfo
  - company.os.events
events:
  emits: [board-pack-ready, investor-update-sent, cap-table-updated]
  watches: [quarter-end, board-meeting-scheduled, investor-requested-update]
template-ref: templates/executives/reporting.md
---

## What this agent does

The CFO reporting agent produces financial reports for stakeholders: monthly board packs, quarterly investor updates, cap table maintenance, and ad-hoc financial analysis for strategic decisions.

## Instructions

### WATCH

Trigger when:
- Quarter ends (produce quarterly board pack)
- Board meeting scheduled (prepare board materials)
- Investor requests update
- Cap table changes (new hire with equity, fundraising close)
- Founder requests financial snapshot for decision-making

### REASON

Financial reporting serves different audiences with specific needs and formats.

**Principles for good reporting:**
1. **Transparency** — Share both good and bad news
2. **Brevity** — Respect stakeholder time
3. **Trends** — Show change over time, not just snapshots
4. **Insights** — Explain why metrics moved
5. **Forward-looking** — What's coming next

### ACT

Produce board packs, investor updates, and cap table snapshots based on current financial model and company state.

## TypeScript

```typescript
import { CompanyOS } from '../../src/company-os'

export async function run(os: CompanyOS, context: string): Promise<string> {
  const triggers = os.events.filter(e =>
    ['quarter-end', 'board-meeting-scheduled', 'investor-requested-update', 'cap-table-change'].includes(e.type) &&
    !e.consumed.includes('cfo-reporting')
  )

  if (triggers.length === 0) {
    return 'No reporting triggers at this time'
  }

  const report = {
    type: triggers[0].type,
    timestamp: new Date().toISOString(),
    summary: `Generated ${triggers[0].type} report`
  }

  os.events.push({
    type: triggers[0].type === 'board-meeting-scheduled' ? 'board-pack-ready' : 'investor-update-sent',
    from: 'cfo-reporting',
    payload: report,
    timestamp: new Date().toISOString(),
    consumed: []
  })

  triggers.forEach(e => e.consumed.push('cfo-reporting'))

  return JSON.stringify(report, null, 2)
}
```

## Coordination

**Reads:**
- `company.os.profile` — company stage and metrics
- `company.os.departments.cfo` — financial model
- `company.os.events` — achievements, milestones

**Emits:**
- `board-pack-ready` → notifies CEO
- `investor-update-sent` → logs communication
- `cap-table-updated` → alerts to ownership changes
