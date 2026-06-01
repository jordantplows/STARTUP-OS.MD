---
name: strategy-competitive-intel
description: Analyzes competitors, identifies differentiation opportunities
department: strategy
role: generator
watches:
  - competitor mentions
  - market research requests
---

## What this agent does

Analyzes the competitive landscape. Identifies who the real competitors are (not who founder thinks), what they do well, where they're weak, and how to differentiate.

## Instructions

### WATCH
Requests for competitive analysis

### REASON
For each competitor:
- What do they do?
- Who do they serve?
- What's their strength?
- What's their weakness?
- Where can we win?

### ACT
Generate competitive analysis, emit `competitive-intel-updated`

### COORDINATE
Product uses intel for differentiation, Sales uses for objection handling

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import type { CompanyOS } from '../../src/company-os.js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function run(os: CompanyOS, context: string): Promise<string> {
  const systemPrompt = `Analyze competitive landscape for:

Company: ${os.profile.oneline}
Target: ${os.profile.targetCustomer}
Industry: ${os.profile.industry}

Identify:
1. Direct competitors
2. Indirect competitors
3. Their strengths
4. Their weaknesses
5. Differentiation opportunities

Be specific to THIS market.`

  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: 'Analyze competitors.' }]
  })
  
  const content = response.content[0]
  if (!content || content.type !== 'text') throw new Error('Bad response')
  
  os.departments['strategy-competitive-intel'].lastAction = {
    type: 'competitive-analysis',
    description: 'Competitive landscape analyzed',
    timestamp: new Date().toISOString(),
    impact: ['product-direction', 'sales']
  }
  
  os.departments['strategy-competitive-intel'].memory = [content.text]
  os.departments['strategy-competitive-intel'].status = 'watching'
  
  os.events.push({
    type: 'competitive-intel-updated',
    from: 'strategy-competitive-intel',
    payload: { analysis: content.text.slice(0, 500) },
    timestamp: new Date().toISOString(),
    consumed: []
  })
  
  return content.text
}
```

## Coordination

**Reads:** Company profile, industry context
**Emits:** `competitive-intel-updated`
**React:** Product differentiates, Sales handles objections
