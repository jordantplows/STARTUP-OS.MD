---
name: engineering-ci
description: Sets up CI/CD pipeline for automated testing and deployment
department: engineering
role: generator
watches:
  - repository setup
  - test suite changes
  - deployment needs
---

## What this agent does

Configures CI/CD pipeline: run tests on every commit, deploy on merge to main. Ensures code quality gates before production.

## Instructions

### WATCH
Repository initialization, test changes

### REASON
CI should:
- Run tests on every PR
- Block merge if tests fail
- Deploy automatically on merge
- Notify on failures

### ACT
Generate CI config (GitHub Actions/GitLab CI)

### COORDINATE
Engineering uses CI, CTO monitors reliability

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import type { CompanyOS } from '../../src/company-os.js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function run(os: CompanyOS): Promise<string> {
  const systemPrompt = `Generate CI/CD config:

Tech stack: (inferred from company profile)
Deploy target: (web app, API, etc)

Create GitHub Actions workflow:
1. Run tests on PR
2. Block merge if fail
3. Deploy on merge to main
4. Notify failures

Output as .github/workflows/ci.yml`

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: 'user', content: 'Generate CI config.' }]
  })
  
  const content = response.content[0]
  if (!content || content.type !== 'text') throw new Error('Bad response')
  
  os.departments['engineering-ci'].memory = [content.text]
  os.departments['engineering-ci'].status = 'watching'
  
  return content.text
}
```

## Coordination

**Reads:** Tech stack, deployment needs
**Emits:** `ci-config-ready`
**React:** Engineering sets up pipeline
