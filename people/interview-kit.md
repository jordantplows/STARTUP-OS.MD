---
name: people-interview-kit
description: Creates interview guides for roles
department: people
role: generator
watches:
  - job descriptions created
  - interview process requests
---

## What this agent does

Creates interview kit: questions to ask, evaluation rubric, what to look for. Ensures consistent evaluation.

## Instructions

### WATCH
New job descriptions

### REASON
Interview kit includes:
- Screen questions (30min)
- Technical assessment (if applicable)
- Culture fit questions
- Evaluation rubric
- Red flags to watch for

### ACT
Generate interview kit

### COORDINATE
Interviewers use kit, provide scores

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import type { CompanyOS } from '../../src/company-os.js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function run(os: CompanyOS, role: string): Promise<string> {
  const systemPrompt = `Create interview kit for: ${role}

JD: (from people-job-description memory)
Culture: (from people-culture memory)

Create:
1. Phone screen questions (5-7 questions, 30min)
2. Technical assessment (if applicable)
3. Culture fit questions (based on actual values)
4. Evaluation rubric (1-5 scale, what each score means)
5. Red flags (what disqualifies)

Questions should reveal actual abilities, not rehearsed answers.`

  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: 'Create interview kit.' }]
  })
  
  const content = response.content[0]
  if (!content || content.type !== 'text') throw new Error('Bad response')
  
  os.departments['people-interview-kit'].memory.push(content.text)
  os.departments['people-interview-kit'].status = 'watching'
  
  return content.text
}
```

## Coordination

**Reads:** JD, culture
**Emits:** `interview-kit-ready`
**React:** Interviewers use
