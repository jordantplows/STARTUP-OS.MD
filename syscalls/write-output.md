---
name: write-output
description: Writes agent output to the correct stdlib output path
syscall: true
---

## What this syscall does

Writes a string to `stdlib/<dept>/output/<agent>-filled.md`.
Creates the output directory if it doesn't exist.
All agents use this instead of writing files directly.

## TypeScript

```typescript
import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'

export function writeOutput(
  workspaceRoot: string,
  dept: string,
  agentName: string,
  content: string
): string {
  const outputDir = join(workspaceRoot, 'stdlib', dept, 'output')
  mkdirSync(outputDir, { recursive: true })
  const outputPath = join(outputDir, `${agentName}-filled.md`)
  writeFileSync(outputPath, content, 'utf-8')
  return outputPath
}
```
