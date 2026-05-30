---
name: consistency
description: Cross-department validation engine
---

## What consistency validation does

Cross-department validation engine. After each department completes,
runs consistency checks against all previously completed departments.
Catches contradictions before they propagate (e.g. ICP mismatch
between product personas and marketing GTM).

## TypeScript

```typescript
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { crossCheck, writeCrossCheckReport, Inconsistency } from '../syscalls/cross-check.js'

export interface ConsistencyRule {
  name: string
  file1: string
  file2: string
  checks: Array<{
    field: string
    extract: (content: string) => string
  }>
}

// Core consistency rules between departments
export const CONSISTENCY_RULES: ConsistencyRule[] = [
  {
    name: 'ICP alignment: product personas vs marketing GTM',
    file1: 'stdlib/product/output/personas-filled.md',
    file2: 'stdlib/marketing/output/gtm-strategy-filled.md',
    checks: [
      {
        field: 'primary_persona',
        extract: (content) => {
          const match = content.match(/## Primary Persona[:\s]+([^\n]+)/)
          return match?.[1]?.trim() ?? ''
        }
      }
    ]
  },
  {
    name: 'Pricing: finance model vs sales pricing strategy',
    file1: 'stdlib/finance/output/pricing-filled.md',
    file2: 'stdlib/sales/output/pricing-strategy-filled.md',
    checks: [
      {
        field: 'base_price',
        extract: (content) => {
          const match = content.match(/\$(\d+(?:,\d{3})*(?:\.\d{2})?)/)
          return match?.[1] ?? ''
        }
      }
    ]
  },
  {
    name: 'Brand: strategy brand voice vs marketing content',
    file1: 'stdlib/brand/output/voice-filled.md',
    file2: 'stdlib/marketing/output/content-strategy-filled.md',
    checks: [
      {
        field: 'brand_tone',
        extract: (content) => {
          const match = content.match(/(?:tone|voice):\s*([^\n]+)/i)
          return match?.[1]?.trim() ?? ''
        }
      }
    ]
  }
]

export class ConsistencyEngine {
  private workspaceRoot: string
  private allInconsistencies: Inconsistency[] = []

  constructor(workspaceRoot: string) {
    this.workspaceRoot = workspaceRoot
  }

  // Run all applicable consistency checks
  runChecks(completedDepartments: string[]): Inconsistency[] {
    const inconsistencies: Inconsistency[] = []

    for (const rule of CONSISTENCY_RULES) {
      // Only run checks where both files exist
      const file1Exists = existsSync(join(this.workspaceRoot, rule.file1))
      const file2Exists = existsSync(join(this.workspaceRoot, rule.file2))

      if (file1Exists && file2Exists) {
        const results = crossCheck(
          this.workspaceRoot,
          rule.file1,
          rule.file2,
          rule.checks
        )
        inconsistencies.push(...results)
      }
    }

    this.allInconsistencies.push(...inconsistencies)
    return inconsistencies
  }

  // Write final consistency report
  writeReport(): void {
    writeCrossCheckReport(this.workspaceRoot, this.allInconsistencies)
  }

  // Get all inconsistencies found so far
  getAll(): Inconsistency[] {
    return this.allInconsistencies
  }

  // Check if there are any blocking errors
  hasErrors(): boolean {
    return this.allInconsistencies.some(i => i.severity === 'error')
  }
}
```
