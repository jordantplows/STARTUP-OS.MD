---
name: red-team-investor
description: Asks hard questions investors will ask
department: red-team
role: watcher
watches:
  - fundraising prep
  - investor meetings
---

## What this agent does

Simulates tough investor questions. Prepares founder for hardest questions they'll face.

## Instructions

### WATCH
Fundraising prep, investor meeting requests

### REASON
Hard questions:
- Why will THIS win in a crowded market?
- What if competitor X does this?
- Why hasn't anyone solved this before?
- What's your unfair advantage?
- Why you?

### ACT
Generate investor questions, emit `investor-questions-ready`

### COORDINATE
CEO prepares answers

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import type { CompanyOS } from '../src/company-os.js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function run(os: CompanyOS): Promise<string> {
  const systemPrompt = `Generate hard investor questions:

Company: ${os.profile.oneline}
Market: ${os.profile.industry}
Stage: ${os.profile.stage}

Ask the HARDEST questions:
1. Why will THIS win in crowded market?
2. What if [competitor] does this?
3. Why hasn't anyone solved this before?
4. What's your unfair advantage?
5. Why you?
6. What's your biggest risk?
7. What assumption needs to be true?

Be brutally skeptical like a VC.`

  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 3072,
    system: systemPrompt,
    messages: [{ role: 'user', content: 'Generate hard investor questions.' }]
  })
  
  const content = response.content[0]
  if (!content || content.type !== 'text') throw new Error('Bad response')
  
  os.departments['red-team-investor'].lastAction = {
    type: 'investor-questions-generated',
    description: 'Hard questions prepared',
    timestamp: new Date().toISOString(),
    impact: ['ceo', 'founder']
  }
  
  os.departments['red-team-investor'].memory = [content.text]
  os.departments['red-team-investor'].status = 'watching'
  
  return content.text
}
```

## Coordination

**Reads:** Company profile, market
**Emits:** `investor-questions-ready`
**React:** CEO prepares answers
