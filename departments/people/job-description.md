---
name: people-job-description
description: Creates job descriptions for open roles
department: people
role: generator
watches:
  - hiring needs
  - role definition requests
---

## What this agent does

Creates job descriptions: responsibilities, requirements, compensation. Not generic JDs - specific to what this role will actually do.

## Instructions

### WATCH
Hiring need signals

### REASON
JD should include:
- What you'll actually do (not generic)
- What success looks like
- Required skills
- Nice-to-have skills
- Compensation range

### ACT
Generate job description

### COORDINATE
Hiring manager approves, recruiting posts

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import type { CompanyOS } from '../../src/company-os.js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function run(os: CompanyOS, role: string): Promise<string> {
  const systemPrompt = `Create job description for: ${role}

Company: ${os.profile.oneline}
Stage: ${os.profile.stage}
Culture: (from people-culture memory)

Include:
1. What you'll actually do (specific projects)
2. What success looks like in first 90 days
3. Required skills
4. Nice-to-have skills
5. Compensation range (market rate for stage)

Be SPECIFIC, not generic template.`

  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 3072,
    system: systemPrompt,
    messages: [{ role: 'user', content: 'Create JD.' }]
  })
  
  const content = response.content[0]
  if (!content || content.type !== 'text') throw new Error('Bad response')
  
  os.departments['people-job-description'].memory.push(content.text)
  os.departments['people-job-description'].status = 'watching'
  
  return content.text
}
```

## Coordination

**Reads:** Hiring needs, culture
**Emits:** `jd-ready`
**React:** Recruiting posts
