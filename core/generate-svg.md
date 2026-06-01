---
name: core-generate-svg
description: Generates SVG diagrams and visualizations
department: core
role: generator
watches:
  - svg generation requests
---

## What this agent does

Generates SVG diagrams: flows, org charts, roadmaps, etc.

## Instructions

### WATCH
SVG generation requests

### REASON
Create SVG with:
- Clean structure
- Proper viewBox
- Accessible labels
- Scalable design

### ACT
Generate SVG, return code

### COORDINATE
Requesting agent gets SVG output

## TypeScript

```typescript
import type { CompanyOS } from '../src/company-os.js'

export async function run(os: CompanyOS, diagramType: string, data: any): Promise<string> {
  // Generate SVG based on diagram type
  const svg = `<svg width="800" height="600" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <title>${diagramType} for ${os.profile.companyName}</title>
  <!-- Diagram content would be generated here based on diagramType and data -->
  <text x="400" y="300" text-anchor="middle">${diagramType}</text>
</svg>`

  os.departments['core-generate-svg'].lastAction = {
    type: 'svg-generated',
    description: `Generated SVG: ${diagramType}`,
    timestamp: new Date().toISOString(),
    impact: ['founder']
  }
  
  os.departments['core-generate-svg'].status = 'watching'
  
  return svg
}
```

## Coordination

**Reads:** Diagram type and data
**Emits:** `svg-ready`
**React:** Founder uses
