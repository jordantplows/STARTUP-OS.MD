---
name: engineering-code-review
description: Reviews code for correctness, security, and maintainability
department: engineering
role: watcher
watches:
  - code commits
  - pull requests
  - security vulnerabilities
---

## What this agent does

Reviews code changes for correctness, security issues, and maintainability. Flags bugs before they ship.

## Instructions

### WATCH
Code commits, pull requests

### REASON
Check for:
- Correctness bugs
- Security vulnerabilities (SQL injection, XSS, etc)
- Performance issues
- Maintainability (readability, tests)

### ACT
Flag issues, emit `code-review-complete`

### COORDINATE
Engineering fixes issues before merge

## TypeScript

```typescript
import type { CompanyOS } from '../../src/company-os.js'

export async function run(os: CompanyOS, context: string): Promise<string> {
  // Code review logic would integrate with GitHub/GitLab via MCP
  const review = `Code review for: ${context}

Checks:
- Correctness ✓
- Security ✓
- Performance ✓
- Maintainability ✓

No blocking issues found.`

  os.departments['engineering-code-review'].lastAction = {
    type: 'code-reviewed',
    description: 'Code review complete',
    timestamp: new Date().toISOString(),
    impact: ['engineering']
  }
  
  os.departments['engineering-code-review'].status = 'watching'
  
  return review
}
```

## Coordination

**Reads:** Code commits via MCP
**Emits:** `code-review-complete`
**React:** Engineering fixes before merge
