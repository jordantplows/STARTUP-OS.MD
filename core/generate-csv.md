---
name: core-generate-csv
description: Generates CSV files from structured data
department: core
role: generator
watches:
  - csv generation requests
---

## What this agent does

Converts structured data to CSV format. Used for financial models, metrics, etc.

## Instructions

### WATCH
CSV generation requests

### REASON
Format data as CSV with:
- Headers
- Proper escaping
- Clean formatting

### ACT
Generate CSV, return file path

### COORDINATE
Requesting agent gets CSV output

## TypeScript

```typescript
import type { CompanyOS } from '../src/company-os.js'

export async function run(os: CompanyOS, data: any[], filename: string): Promise<string> {
  // Convert data to CSV format
  const headers = Object.keys(data[0] || {}).join(',')
  const rows = data.map(row => Object.values(row).join(','))
  const csv = [headers, ...rows].join('\n')
  
  os.departments['core-generate-csv'].lastAction = {
    type: 'csv-generated',
    description: `Generated CSV: ${filename}`,
    timestamp: new Date().toISOString(),
    impact: ['founder']
  }
  
  os.departments['core-generate-csv'].status = 'watching'
  
  return csv
}
```

## Coordination

**Reads:** Structured data
**Emits:** `csv-ready`
**React:** Founder downloads
