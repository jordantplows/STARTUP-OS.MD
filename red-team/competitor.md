---
name: red-team-competitor
description: Simulates what competitors will do in response
department: red-team
role: watcher
watches:
  - product launches
  - pricing changes
  - GTM strategy
---

## What this agent does

Simulates competitor response. What will they do when you launch? How will they counter your moves?

## Instructions

### WATCH
Product launches, pricing changes, GTM

### REASON
If we launch X, competitor will:
- Copy it?
- Undercut on price?
- Lock customers in?
- Launch something better?

Plan for their response

### ACT
Generate competitor response scenarios

### COORDINATE
Product/CEO plan counter-moves

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import type { CompanyOS } from '../src/company-os.js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function run(os: CompanyOS, move: string): Promise<string> {
  const systemPrompt = `Simulate competitor response:

Our move: ${move}
Our product: ${os.profile.oneline}
Competitors: (from strategy-competitive-intel)

If we do this, what will competitors do?
1. Copy our feature?
2. Undercut on price?
3. Lock customers in with contracts?
4. Launch something better?
5. Acquire us or a competitor?

Be specific about their likely response and timeline.`

  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 3072,
    system: systemPrompt,
    messages: [{ role: 'user', content: 'Simulate competitor response.' }]
  })
  
  const content = response.content[0]
  if (!content || content.type !== 'text') throw new Error('Bad response')
  
  os.departments['red-team-competitor'].lastAction = {
    type: 'competitor-response-simulated',
    description: content.text.slice(0, 200),
    timestamp: new Date().toISOString(),
    impact: ['product-direction', 'ceo']
  }
  
  os.departments['red-team-competitor'].memory.push(content.text)
  os.departments['red-team-competitor'].status = 'watching'
  
  return content.text
}
```

## Coordination

**Reads:** Product plans, competitive intel
**Emits:** `competitor-response-simulated`
**React:** Product/CEO plan counter-moves
