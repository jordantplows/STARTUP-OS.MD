---
name: generate-csv
description: Generates structured CSV files from financial and data models
syscall: true
returns: filepath array (string[])
---

## What this syscall does

Converts structured data into properly formatted CSV files. Handles
multiple sheets, escaping, and pre-built financial schemas. Used by
finance, metrics, data, and operations departments.

## TypeScript

```typescript
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

export interface CSVSheet {
  name: string
  headers: string[]
  rows: (string | number | null)[][]
}

export function generateCSV(
  sheets: CSVSheet[],
  outputDir: string,
  filename: string
): string[] {
  mkdirSync(outputDir, { recursive: true })
  const paths: string[] = []

  for (const sheet of sheets) {
    const lines: string[] = [
      sheet.headers.map(h => `"${h}"`).join(','),
      ...sheet.rows.map(row =>
        row.map(cell => {
          if (cell === null) return ''
          if (typeof cell === 'number') return cell.toString()
          return `"${String(cell).replace(/"/g, '""')}"`
        }).join(',')
      )
    ]

    const sheetSlug = sheet.name.toLowerCase().replace(/\s+/g, '-')
    const filePath = join(outputDir, `${filename}-${sheetSlug}.csv`)
    writeFileSync(filePath, lines.join('\n'), 'utf-8')
    paths.push(filePath)
  }

  return paths
}

// Pre-built schemas for common finance outputs
export const FINANCIAL_MODEL_SCHEMA = {
  pnl: {
    name: 'P&L',
    headers: ['Month', 'Revenue', 'COGS', 'Gross Profit', 'Gross Margin %',
              'S&M', 'R&D', 'G&A', 'Total OpEx', 'EBITDA', 'EBITDA Margin %']
  },
  mrr: {
    name: 'MRR Bridge',
    headers: ['Month', 'Starting MRR', 'New MRR', 'Expansion MRR',
              'Churned MRR', 'Ending MRR', 'Net New MRR', 'MoM Growth %']
  },
  cashflow: {
    name: 'Cash Flow',
    headers: ['Month', 'Starting Cash', 'Cash In', 'Cash Out',
              'Net Burn', 'Ending Cash', 'Runway (months)']
  },
  headcount: {
    name: 'Headcount Plan',
    headers: ['Role', 'Department', 'Start Month', 'Annual Salary',
              'Loaded Cost', 'Equity %', 'Notes']
  },
  unitEconomics: {
    name: 'Unit Economics',
    headers: ['Metric', 'Value', 'Formula', 'Benchmark', 'Status']
  },
  capTable: {
    name: 'Cap Table',
    headers: ['Holder', 'Type', 'Shares', 'Ownership %',
              'Post-Seed %', 'Post-Series-A %', 'Notes']
  }
}
```

## Usage Example

```typescript
const csvPaths = generateCSV(
  [
    {
      name: 'P&L',
      headers: ['Month', 'Revenue', 'Expenses', 'Profit'],
      rows: [
        ['Jan 2026', 10000, 8000, 2000],
        ['Feb 2026', 12000, 8500, 3500],
        ['Mar 2026', 15000, 9000, 6000]
      ]
    }
  ],
  'stdlib/finance/output',
  'financial-model'
)
// Returns: ['stdlib/finance/output/financial-model-p-l.csv']
```
