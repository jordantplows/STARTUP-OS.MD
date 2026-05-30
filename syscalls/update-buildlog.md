---
name: update-buildlog
description: Updates the Build Log table in CLAUDE.md after each agent completes
syscall: true
---

## What this syscall does

Modifies the Build Log table in CLAUDE.md to reflect the current
state of a department (pending, in-progress, complete, failed).
This is how the OS tracks execution state across builds.

## TypeScript

```typescript
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

export type BuildStatus = '⬜ pending' | '🔵 in-progress' | '✅ complete' | '❌ failed'

export function updateBuildLog(
  workspaceRoot: string,
  dept: string,
  status: BuildStatus,
  filesWritten?: number,
  completed?: string
): void {
  const claudePath = join(workspaceRoot, 'CLAUDE.md')
  let content = readFileSync(claudePath, 'utf-8')

  const statusStr = status.padEnd(12)
  const filesStr = filesWritten !== undefined ? filesWritten.toString() : '-'
  const completedStr = completed || '-'

  const row = `| ${dept.padEnd(12)} | ${statusStr} | ${filesStr.padEnd(13)} | ${completedStr.padEnd(13)} |`
  
  const regex = new RegExp(`\\| ${dept}\\s+\\|[^\\n]+`, 'g')
  content = content.replace(regex, row)

  writeFileSync(claudePath, content, 'utf-8')
}
```
