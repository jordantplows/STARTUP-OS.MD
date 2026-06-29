---
name: data-room
role: steering
department: investor
reads:
  - company.os.*
writes:
  - company.os.investor.dataRoom
  - workspace/investor/data-room-index.html
emits:
  - data-room-generated
  - data-room-gap-found
---

# Data Room Agent

## Purpose

Assembles investor due diligence on demand. Reads from every department's state in company.os. Knows the 40 things every VC asks for. Flags what's missing. Produces a complete data room index with all available materials. Tells founder exactly what needs to be created before a process starts.

## Instructions

1. **Standard VC due diligence checklist**:
   - Company formation docs
   - Cap table
   - Financial model and projections
   - Historical financials
   - Customer contracts (if any)
   - Product demo and technical architecture
   - Team resumes
   - Board meeting decks
   - Metrics and KPIs
   - Competitive analysis
   - IP and legal docs
2. **Scan company.os** for available materials
3. **Flag gaps** with specific instructions on what to create
4. **Generate data room index** as HTML with links to all materials
5. **Update on demand** — runs when founder triggers or investor process starts

## Coordination

- Reads from all departments
- Coordinates with legal/ for legal docs
- Coordinates with cfo/ for financials
- Emits `data-room-gap-found` for missing critical items

---

## Implementation

```typescript
import { CompanyOSManager } from '../src/company-os'
import { readAgentMemory, writeAgentMemory } from '../src/memory'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

interface DataRoomItem {
  category: string
  name: string
  status: 'available' | 'missing' | 'in-progress'
  location?: string
  instructions?: string
}

export async function run(os: CompanyOSManager): Promise<void> {
  console.log('[data-room] Assembling investor data room...')
  
  const state = os.getState()
  const items: DataRoomItem[] = []
  
  // Company & Legal
  items.push(
    { category: 'Company', name: 'Formation documents', status: 'missing', instructions: 'Obtain from legal/ or incorporation service' },
    { category: 'Company', name: 'Cap table', status: (state as any).cfo?.capTable ? 'available' : 'missing', location: 'cfo/cap-table' },
    { category: 'Legal', name: 'Employee agreements', status: 'missing', instructions: 'Create via legal/ agent' }
  )
  
  // Financials
  items.push(
    { category: 'Financials', name: 'Financial model', status: (state as any).cfo?.model ? 'available' : 'missing', location: 'cfo/model' },
    { category: 'Financials', name: 'Unit economics', status: (state as any).cfo?.model ? 'available' : 'missing', location: 'cfo/model' },
    { category: 'Financials', name: 'Revenue history', status: state.profile.revenue > 0 ? 'available' : 'missing' }
  )
  
  // Product
  items.push(
    { category: 'Product', name: 'Product demo', status: 'missing', instructions: 'Record product demo video' },
    { category: 'Product', name: 'Technical architecture', status: 'missing', instructions: 'Create architecture diagram' },
    { category: 'Product', name: 'Product roadmap', status: (state as any).product?.roadmap ? 'available' : 'missing', location: 'product/roadmap' }
  )
  
  // Team
  items.push(
    { category: 'Team', name: 'Founder resumes', status: state.profile.founders.length > 0 ? 'available' : 'missing' },
    { category: 'Team', name: 'Org chart', status: 'missing', instructions: 'Create current org structure' }
  )
  
  // Traction
  items.push(
    { category: 'Traction', name: 'Customer list', status: 'missing', instructions: 'List current customers (anonymized if needed)' },
    { category: 'Traction', name: 'Customer testimonials', status: 'missing', instructions: 'Collect customer references' },
    { category: 'Traction', name: 'Metrics dashboard', status: (state as any).metrics ? 'available' : 'missing', location: 'metrics/' }
  )
  
  // Generate HTML index
  const html = generateDataRoomHTML(items, state)
  const workspaceDir = join(process.cwd(), 'workspace', 'investor')
  if (!existsSync(workspaceDir)) {
    mkdirSync(workspaceDir, { recursive: true })
  }
  writeFileSync(join(process.cwd(), 'workspace/investor/data-room-index.html'), html)
  
  // Update company.os
  if (!(state as any).investor) {
    (state as any).investor = { targets: [], dataRoom: [], narrative: '', processStatus: 'not-started', pipeline: [] }
  }
  (state as any).investor.dataRoom = items
  os.save()
  
  const missingCount = items.filter(i => i.status === 'missing').length
  console.log(`[data-room] Data room: ${items.length} items, ${missingCount} missing`)
  
  if (missingCount > 0) {
    os.emitEvent({
      type: 'data-room-gap-found',
      from: 'data-room',
      payload: { missingCount, missingItems: items.filter(i => i.status === 'missing') }
    })
  }
  
  writeAgentMemory('data-room', {
    lastRun: new Date().toISOString(),
    totalItems: items.length,
    missingCount
  })
}

function generateDataRoomHTML(items: DataRoomItem[], state: any): string {
  const byCategory = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, DataRoomItem[]>)
  
  return `<!DOCTYPE html>
<html>
<head>
  <title>${state.profile.companyName} — Investor Data Room</title>
  <style>
    body { font-family: system-ui; margin: 40px; background: #fafafa; }
    h1 { color: #111; }
    .category { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid #ddd; }
    .item { padding: 10px 0; border-bottom: 1px solid #eee; }
    .item:last-child { border-bottom: none; }
    .status { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; }
    .available { background: #d1fae5; color: #065f46; }
    .missing { background: #fee2e2; color: #991b1b; }
    .instructions { color: #666; font-size: 14px; margin-top: 4px; }
  </style>
</head>
<body>
  <h1>${state.profile.companyName} — Investor Data Room</h1>
  <p>Generated ${new Date().toLocaleDateString()}</p>
  
  ${Object.entries(byCategory).map(([category, catItems]) => `
    <div class="category">
      <h2>${category}</h2>
      ${catItems.map(item => `
        <div class="item">
          <strong>${item.name}</strong>
          <span class="status ${item.status}">${item.status}</span>
          ${item.location ? `<div class="instructions">Location: ${item.location}</div>` : ''}
          ${item.instructions ? `<div class="instructions">${item.instructions}</div>` : ''}
        </div>
      `).join('')}
    </div>
  `).join('')}
</body>
</html>`
}
```
