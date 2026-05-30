---
name: read-profile
description: Reads and parses the startup profile from CLAUDE.md
syscall: true
returns: StartupProfile
---

## What this syscall does

Reads CLAUDE.md from the workspace root and extracts the structured
startup profile block into a typed object. Every agent calls this
before doing anything else.

## TypeScript

```typescript
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

export interface StartupProfile {
  companyName: string
  oneLine: string
  industry: string
  businessModel: string
  targetCustomer: string
  problem: string
  stage: 'idea' | 'pre-seed' | 'seed' | 'series-a'
  location: string
  founders: number
  revenue: string
  fundraisingGoal: string
  launchTarget: string
}

export function readProfile(workspaceRoot: string): StartupProfile {
  const claudePath = join(workspaceRoot, 'CLAUDE.md')
  if (!existsSync(claudePath)) {
    throw new Error('CLAUDE.md not found. Run: startup-os init')
  }

  const content = readFileSync(claudePath, 'utf-8')

  const extract = (key: string): string => {
    const match = content.match(new RegExp(`- ${key}:\\s*(.+)`))
    return match?.[1]?.trim() ?? ''
  }

  const stageRaw = extract('Stage').toLowerCase()
  const stage = (['idea', 'pre-seed', 'seed', 'series-a'] as const)
    .find(s => stageRaw.includes(s.replace('-', ' '))) ?? 'idea'

  return {
    companyName:    extract('Company Name'),
    oneLine:        extract('One-line'),
    industry:       extract('Industry'),
    businessModel:  extract('Business Model'),
    targetCustomer: extract('Target Customer'),
    problem:        extract('Problem'),
    stage,
    location:       extract('Location'),
    founders:       parseInt(extract('Founders')) || 1,
    revenue:        extract('Revenue'),
    fundraisingGoal: extract('Fundraising Goal'),
    launchTarget:   extract('Launch Target'),
  }
}
```
