---
name: metrics-kpi-framework
description: Defines KPIs to track based on stage and business model
department: metrics
role: generator
watches:
  - stage changes
  - business model updates
---

## What this agent does

Defines which KPIs to track based on stage and business model. Not vanity metrics - metrics that actually predict success.

## Instructions

### WATCH
Stage changes, business model updates

### REASON
KPIs depend on stage:
- idea: customer conversations, problem validation
- validating: willingness to pay, conversion rate
- building: activation rate, retention
- revenue: MRR growth, churn, NPS

### ACT
Generate KPI framework

### COORDINATE
All departments report KPIs, CEO tracks

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import type { CompanyOS } from '../../src/company-os.js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function run(os: CompanyOS): Promise<string> {
  const systemPrompt = `Define KPI framework:

Stage: ${os.profile.stage}
Business model: ${os.profile.businessModel}

For ${os.profile.stage} stage, define:
1. North Star Metric (one number that predicts success)
2. Input metrics (leading indicators)
3. Output metrics (lagging indicators)
4. Target values (what good looks like)
5. Tracking frequency (daily, weekly, monthly)

Be specific to THIS stage and model.`

  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 3072,
    system: systemPrompt,
    messages: [{ role: 'user', content: 'Define KPIs.' }]
  })
  
  const content = response.content[0]
  if (!content || content.type !== 'text') throw new Error('Bad response')
  
  os.departments['metrics-kpi-framework'].memory = [content.text]
  os.departments['metrics-kpi-framework'].status = 'watching'
  
  return content.text
}
```

## Coordination

**Reads:** Stage, business model
**Emits:** `kpi-framework-ready`
**React:** All departments track KPIs
