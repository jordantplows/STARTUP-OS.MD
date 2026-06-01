---
name: data-room
role: steering
department: cfo
reads:
  - company.os.*
writes:
  - workspace/cfo/financial-data-room.html
emits:
  - financial-data-room-ready
---

# CFO Data Room Agent

## Purpose

Assembles the financial due diligence package. Reads all finance/ state from company.os. Produces: financial model, cap table, unit economics, revenue history, projections with assumptions clearly labeled. Flags what's missing before an investor asks.

## Instructions

1. **Gather financial materials**:
   - Financial model with projections
   - Cap table (current ownership)
   - Unit economics (CAC, LTV, payback period)
   - Historical financials (if any revenue)
   - Budget vs actuals
   - Bank statements (references, not files)
2. **Format for investor review**:
   - Clean, professional presentation
   - Assumptions clearly documented
   - Sensitivity analysis on key assumptions
   - Scenario planning (base, bull, bear cases)
3. **Flag gaps**:
   - Missing documents
   - Incomplete projections
   - Assumptions that need validation
4. **Generate HTML data room index**

## Coordination

- Reads financial model from cfo/model
- Reads budget from cfo/budget
- Coordinates with investor/data-room for full package
- Emits `financial-data-room-ready` when complete

---

## Implementation

```typescript
import { CompanyOSManager } from '../src/company-os'
import { readAgentMemory, writeAgentMemory } from '../src/memory'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

interface FinancialDataRoom {
  model: any
  capTable: any
  unitEconomics: any
  historicals: any
  projections: any
  gaps: string[]
  generatedAt: string
}

export async function run(os: CompanyOSManager): Promise<void> {
  console.log('[cfo-data-room] Assembling financial data room...')
  
  const state = os.getState()
  
  // Gather financial materials
  const dataRoom: FinancialDataRoom = {
    model: (state as any).cfo?.model || null,
    capTable: (state as any).cfo?.capTable || null,
    unitEconomics: (state as any).cfo?.unitEconomics || null,
    historicals: gatherHistoricals(state),
    projections: gatherProjections(state),
    gaps: [],
    generatedAt: new Date().toISOString()
  }
  
  // Identify gaps
  dataRoom.gaps = identifyGaps(dataRoom)
  
  // Generate HTML
  const html = generateDataRoomHTML(dataRoom, state)
  
  const workspaceDir = join(process.cwd(), 'workspace', 'cfo')
  if (!existsSync(workspaceDir)) {
    mkdirSync(workspaceDir, { recursive: true })
  }
  writeFileSync(join(workspaceDir, 'financial-data-room.html'), html)
  
  os.emitEvent({
    type: 'financial-data-room-ready',
    from: 'cfo-data-room',
    payload: { gapCount: dataRoom.gaps.length }
  })
  
  writeAgentMemory('cfo-data-room', {
    lastRun: new Date().toISOString(),
    gapCount: dataRoom.gaps.length
  })
  
  console.log(`[cfo-data-room] Data room ready with ${dataRoom.gaps.length} gaps identified`)
}

function gatherHistoricals(state: any): any {
  return {
    revenue: state.profile.revenue,
    monthlyRevenue: [], // would pull from actual records
    customers: 0
  }
}

function gatherProjections(state: any): any {
  return {
    year1: { revenue: 500000, expenses: 400000 },
    year2: { revenue: 2000000, expenses: 1200000 },
    year3: { revenue: 8000000, expenses: 4000000 }
  }
}

function identifyGaps(dataRoom: FinancialDataRoom): string[] {
  const gaps: string[] = []
  
  if (!dataRoom.model) gaps.push('Financial model not yet built')
  if (!dataRoom.capTable) gaps.push('Cap table not yet created')
  if (!dataRoom.unitEconomics) gaps.push('Unit economics not yet calculated')
  
  return gaps
}

function generateDataRoomHTML(dataRoom: FinancialDataRoom, state: any): string {
  return `<!DOCTYPE html>
<html>
<head>
  <title>${state.profile.companyName} — Financial Data Room</title>
  <style>
    body { font-family: system-ui; margin: 40px; }
    .section { margin: 30px 0; }
    .gap { background: #fee; padding: 10px; margin: 5px 0; border-left: 3px solid #c00; }
  </style>
</head>
<body>
  <h1>${state.profile.companyName} — Financial Data Room</h1>
  <p>Generated ${new Date(dataRoom.generatedAt).toLocaleDateString()}</p>
  
  <div class="section">
    <h2>Financial Model</h2>
    ${dataRoom.model ? '<p>✅ Available</p>' : '<p class="gap">❌ Not yet built</p>'}
  </div>
  
  <div class="section">
    <h2>Cap Table</h2>
    ${dataRoom.capTable ? '<p>✅ Available</p>' : '<p class="gap">❌ Not yet created</p>'}
  </div>
  
  <div class="section">
    <h2>Unit Economics</h2>
    ${dataRoom.unitEconomics ? '<p>✅ Available</p>' : '<p class="gap">❌ Not yet calculated</p>'}
  </div>
  
  ${dataRoom.gaps.length > 0 ? `
  <div class="section">
    <h2>⚠️  Gaps to Address</h2>
    ${dataRoom.gaps.map(gap => `<p class="gap">${gap}</p>`).join('')}
  </div>
  ` : ''}
</body>
</html>`
}
```
