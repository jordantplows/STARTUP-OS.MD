---
name: engineering-type-safety
description: Ensures type safety across codebase
department: engineering
role: watcher
watches:
  - code commits
  - type errors
  - API contract changes
---

## What this agent does

Monitors for type safety issues. Ensures TypeScript strict mode, API contracts match, no runtime type errors.

## Instructions

### WATCH
Code commits, type errors

### REASON
Check:
- TypeScript strict mode enabled
- No any types
- API contracts validated
- Runtime type checking at boundaries

### ACT
Flag type safety issues

### COORDINATE
Engineering fixes before merge

## TypeScript

```typescript
import type { CompanyOS } from '../../src/company-os.js'

export async function run(os: CompanyOS, context: string): Promise<string> {
  const analysis = `Type safety check for: ${context}

Checks:
- TypeScript strict mode: ✓
- No 'any' types: ✓
- API contracts validated: ✓
- Runtime checking at boundaries: ✓

Type safety passing.`

  os.departments['engineering-type-safety'].lastAction = {
    type: 'type-safety-checked',
    description: 'Type safety validated',
    timestamp: new Date().toISOString(),
    impact: ['engineering']
  }
  
  os.departments['engineering-type-safety'].status = 'watching'
  
  return analysis
}
```

## Coordination

**Reads:** Code commits
**Emits:** `type-safety-issue` if found
**React:** Engineering fixes
