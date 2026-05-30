---
name: pipe-context
description: Reads upstream agent outputs and pipes them as context
syscall: true
---

## What this syscall does

Given a list of upstream file paths from an agent's `reads:` frontmatter,
reads each file and returns them as a combined context string.
This is how agents receive output from previous agents —
like stdin in Unix piping.

## TypeScript

```typescript
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

export function pipeContext(
  workspaceRoot: string,
  reads: string[]
): string {
  const chunks: string[] = []

  for (const relativePath of reads) {
    const fullPath = join(workspaceRoot, relativePath)
    if (existsSync(fullPath)) {
      const content = readFileSync(fullPath, 'utf-8')
      chunks.push(`--- ${relativePath} ---\n${content.slice(0, 3000)}`)
    } else {
      chunks.push(`--- ${relativePath} --- (not yet generated)`)
    }
  }

  return chunks.join('\n\n')
}
```
