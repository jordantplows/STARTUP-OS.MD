---
name: snapshot-state
description: Creates a timestamped snapshot of all current output files
syscall: true
---

## What this syscall does

Creates a timestamped snapshot of all current output files in
`_reports/snapshots/`. Allows rollback to a previous build state.

## TypeScript

```typescript
import { cpSync, mkdirSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

export function snapshotState(workspaceRoot: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const snapshotDir = join(workspaceRoot, '_reports', 'snapshots', timestamp)
  
  mkdirSync(snapshotDir, { recursive: true })

  const stdlibRoot = join(workspaceRoot, 'stdlib')
  const depts = readdirSync(stdlibRoot, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)

  for (const dept of depts) {
    const outputDir = join(stdlibRoot, dept, 'output')
    try {
      if (statSync(outputDir).isDirectory()) {
        const destDir = join(snapshotDir, dept)
        mkdirSync(destDir, { recursive: true })
        cpSync(outputDir, destDir, { recursive: true })
      }
    } catch {
      // Skip if output dir doesn't exist
    }
  }

  return snapshotDir
}

export function listSnapshots(workspaceRoot: string): string[] {
  const snapshotsRoot = join(workspaceRoot, '_reports', 'snapshots')
  try {
    return readdirSync(snapshotsRoot, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name)
      .sort()
      .reverse()
  } catch {
    return []
  }
}
```
