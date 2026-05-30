---
name: cross-check
description: Validates consistency between two output files
syscall: true
---

## What this syscall does

Reads two output files and validates consistency between them.
For example, pricing in finance/pricing-filled.md must match
pricing referenced in sales/pricing-strategy-filled.md.

Returns a list of inconsistencies written to `_reports/consistency.md`.

## TypeScript

```typescript
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

export interface Inconsistency {
  file1: string
  file2: string
  field: string
  value1: string
  value2: string
  severity: 'error' | 'warning'
}

export function crossCheck(
  workspaceRoot: string,
  file1Path: string,
  file2Path: string,
  checks: Array<{field: string, extract: (content: string) => string}>
): Inconsistency[] {
  const content1 = readFileSync(join(workspaceRoot, file1Path), 'utf-8')
  const content2 = readFileSync(join(workspaceRoot, file2Path), 'utf-8')

  const inconsistencies: Inconsistency[] = []

  for (const check of checks) {
    const value1 = check.extract(content1)
    const value2 = check.extract(content2)

    if (value1 && value2 && value1 !== value2) {
      inconsistencies.push({
        file1: file1Path,
        file2: file2Path,
        field: check.field,
        value1,
        value2,
        severity: 'error'
      })
    }
  }

  return inconsistencies
}

export function writeCrossCheckReport(
  workspaceRoot: string,
  inconsistencies: Inconsistency[]
): void {
  const reportDir = join(workspaceRoot, '_reports')
  mkdirSync(reportDir, { recursive: true })
  
  const content = `# Consistency Report

Generated: ${new Date().toISOString()}

${inconsistencies.length === 0 ? '✅ No inconsistencies found.' : 
  inconsistencies.map(i => 
    `## ${i.severity.toUpperCase()}: ${i.field}\n\n` +
    `- **${i.file1}**: ${i.value1}\n` +
    `- **${i.file2}**: ${i.value2}\n`
  ).join('\n')}
`

  writeFileSync(join(reportDir, 'consistency.md'), content, 'utf-8')
}
```
