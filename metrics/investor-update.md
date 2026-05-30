---
name: investor-update
description: >
  Drafts monthly investor update by reading KPIs, financial model, and weekly
  reviews. Generates subject line (3 variants), TL;DR (3 bullets), metrics
  table with MoM change, progress vs goals, what's working/not, hiring plans,
  upcoming milestones, and specific asks.
department: metrics
triggers: ["/startup-os metrics"]
allowed-tools: [Read, Write, Bash]
reads:
  - CLAUDE.md
  - metrics/output/kpi-framework.md
  - metrics/output/north-star.md
  - finance/output/financial-model.md
  - metrics/output/weekly-review-*.md
writes:
  - metrics/output/investor-update-{month}.md
---

## What this agent does

Generates monthly investor update email by synthesizing KPI framework, financial model, and recent weekly reviews. Creates compelling subject line (3 variants), executive TL;DR with 3 key bullets, metrics table with month-over-month changes, narrative on progress vs goals, what's working and what's not, hiring updates, upcoming milestones, and specific asks. Writes to metrics/output/investor-update-{month}.md formatted ready to send.

## Instructions

1. Read CLAUDE.md for company context and fundraising status
2. Read metrics/output/kpi-framework.md for tracked metrics
3. Read metrics/output/north-star.md for NSM focus
4. Read finance/output/financial-model.md for financial targets
5. Read all weekly-review files from current month for context
6. Prompt for month or use current month
7. Generate 3 subject line variants (compelling, specific)
8. Create TL;DR with 3 key bullets
9. Build metrics table with MoM % change
10. Write progress narrative with honesty and context
11. Add what's working / what's not sections
12. Include hiring updates and pipeline
13. List upcoming milestones with dates
14. Add specific asks (intros, advice, etc.)
15. Write to metrics/output/investor-update-{month}.md

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs'
import { join } from 'path'
import * as readline from 'readline'

async function promptUser(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close()
      resolve(answer)
    })
  })
}

async function generateInvestorUpdate() {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  })

  const projectRoot = process.cwd()
  
  // Read context files
  let claudeMd = ''
  let kpiFramework = ''
  let northStar = ''
  let financialModel = ''

  try {
    claudeMd = readFileSync(join(projectRoot, 'CLAUDE.md'), 'utf-8')
  } catch (err) {
    console.warn('Warning: CLAUDE.md not found')
  }

  try {
    kpiFramework = readFileSync(join(projectRoot, 'metrics', 'output', 'kpi-framework.md'), 'utf-8')
  } catch (err) {
    console.warn('Warning: kpi-framework.md not found')
  }

  try {
    northStar = readFileSync(join(projectRoot, 'metrics', 'output', 'north-star.md'), 'utf-8')
  } catch (err) {
    console.warn('Warning: north-star.md not found')
  }

  try {
    financialModel = readFileSync(join(projectRoot, 'finance', 'output', 'financial-model.md'), 'utf-8')
  } catch (err) {
    console.warn('Warning: financial-model.md not found')
  }

  // Read weekly reviews from current month
  const metricsOutputDir = join(projectRoot, 'metrics', 'output')
  let weeklyReviews = ''
  try {
    const files = readdirSync(metricsOutputDir)
    const reviewFiles = files.filter(f => f.startsWith('weekly-review-'))
    
    // Read up to last 4 weekly reviews
    const recentReviews = reviewFiles.slice(-4)
    for (const file of recentReviews) {
      try {
        const content = readFileSync(join(metricsOutputDir, file), 'utf-8')
        weeklyReviews += `\n\n## ${file}\n${content}`
      } catch (err) {
        // Skip if can't read
      }
    }
  } catch (err) {
    console.warn('Warning: No weekly reviews found')
  }

  // Prompt for month
  console.log('\n=== Investor Update Generator ===\n')
  
  const updateMonth = await promptUser('Month for update (YYYY-MM) [default: current month]: ') || 
    new Date().toISOString().slice(0, 7)

  const fullContext = `
# Startup Context

## Startup Profile
${claudeMd}

## KPI Framework
${kpiFramework}

## North Star
${northStar}

## Financial Model
${financialModel}

## Recent Weekly Reviews
${weeklyReviews}

# Update Details

## Month
${updateMonth}
  `.trim()

  // Generate investor update via Claude API
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 16000,
    messages: [
      {
        role: 'user',
        content: `You are an investor update expert for startups. Based on this context:

${fullContext}

Create a monthly investor update email with the following structure:

# Investor Update: ${updateMonth}

**Company**: [Company Name]
**Generated**: ${new Date().toISOString().split('T')[0]}
**From**: [CEO Name from context]
**To**: Investors & Advisors

---

## Subject Line Options

Pick the most compelling based on this month's highlights:

**Option 1**: [Metric-driven - e.g., "Hit $50K MRR in May (+47% MoM)"]

**Option 2**: [Milestone-driven - e.g., "We just shipped [feature] and customers love it"]

**Option 3**: [Narrative-driven - e.g., "How we're solving [problem] for [customer segment]"]

[Then pick one as the recommended subject line]

**Recommended**: Option X

---

## Email Body

Hi everyone,

### TL;DR

[3 concise bullets capturing the most important points - metrics, milestones, or learnings. Each should be one sentence. Make them specific and compelling.]

- [Bullet 1: Key metric or achievement]
- [Bullet 2: Important milestone or learning]
- [Bullet 3: What's next or ask]

---

### 📊 Metrics

| Metric | This Month | Last Month | MoM Change | Target | Status |
|--------|------------|------------|------------|--------|--------|
| [North Star Metric] | [value] | [value] | [+X%] | [target] | ✅/⚠️/❌ |
| MRR / ARR | [value] | [value] | [+X%] | [target] | ✅/⚠️/❌ |
| New Customers | [value] | [value] | [+X%] | [target] | ✅/⚠️/❌ |
| Active Users | [value] | [value] | [+X%] | [target] | ✅/⚠️/❌ |
| Revenue Churn | [value] | [value] | [+X%] | [target] | ✅/⚠️/❌ |
| Gross Margin | [value] | [value] | [+X%] | [target] | ✅/⚠️/❌ |
| Cash Burn | [value] | [value] | [+X%] | [target] | ✅/⚠️/❌ |
| Runway (months) | [value] | [value] | [+X%] | [target] | ✅/⚠️/❌ |

**Overall**: [Green/Yellow/Red] — [One sentence summary of metrics health]

Use the financial model and weekly reviews to populate with realistic values or [TBD] placeholders. Show month-over-month percentage changes. Be honest about what's on/off track.

---

### 🎯 Progress vs. Goals

**This month's goals were**:
1. [Goal 1 from last update or financial model]
2. [Goal 2]
3. [Goal 3]

**Results**:
1. ✅/⚠️/❌ [Goal 1] — [What happened, why it succeeded or missed]
2. ✅/⚠️/❌ [Goal 2] — [What happened]
3. ✅/⚠️/❌ [Goal 3] — [What happened]

**Key takeaway**: [One sentence on overall execution - honest assessment]

---

### 💡 What's Working

1. **[Area 1]** — [2-3 sentences on what's going well, with specific evidence. Could be a channel, a feature, a process, etc.]

2. **[Area 2]** — [2-3 sentences on what's working]

3. **[Area 3]** — [2-3 sentences on what's working]

---

### 🚧 What's Not Working (and what we're doing about it)

1. **[Challenge 1]** — [2-3 sentences on the problem, root cause, and action plan. Be transparent but constructive.]

2. **[Challenge 2]** — [Problem, root cause, action plan]

3. **[Challenge 3]** — [Problem, root cause, action plan]

[Investors appreciate honesty here - don't sugarcoat, but always pair problems with plans]

---

### 👥 Team & Hiring

**Current team**: [X] people ([breakdown by function])

**This month's hires**:
- [Name, Role] — [Brief background and why they're great]
- [Name, Role] — [Background]

**Open roles** (actively hiring):
- [Role 1] — [Why this role is critical now]
- [Role 2] — [Why this role is critical]

**Help wanted**: [If you need intros to specific profiles or talent channels]

---

### 🎬 Product & Customer Highlights

**Shipped this month**:
- [Feature/improvement 1] — [Customer impact]
- [Feature/improvement 2] — [Customer impact]
- [Feature/improvement 3] — [Customer impact]

**Customer spotlight**:
[2-3 sentences on a notable customer win, testimonial, or use case. Make it tangible - who they are, what problem they solved, what result they got.]

**Feature requests we're hearing**:
- [Request 1] — [How common, whether we're building it]
- [Request 2] — [How common, whether we're building it]

---

### 📅 Upcoming Milestones

**Next 30 days**:
- [Milestone 1] — [Target date, why it matters]
- [Milestone 2] — [Target date, why it matters]
- [Milestone 3] — [Target date, why it matters]

**Next 90 days**:
- [Milestone 1] — [Target timeframe, impact]
- [Milestone 2] — [Target timeframe, impact]

[Milestones should be specific and measurable - product launches, revenue targets, key hires, etc.]

---

### 🙏 How You Can Help

[Be specific - investors want to help but need clear asks]

1. **[Ask 1]** — [Specific request: intro, advice, etc. Include context on why this helps.]
   - Example: "Intro to Head of Sales at [Company X] - we're expanding into [segment] and they've done this well"

2. **[Ask 2]** — [Specific request with context]

3. **[Ask 3]** — [Specific request with context]

---

### 💬 Closing Thought

[2-3 sentences reflecting on the month - a learning, a shift in thinking, or a moment of clarity. Make it personal and authentic. This is where founders can show how they're growing as leaders.]

---

As always, thank you for your support. Reply with any questions or feedback - I read every response.

Best,
[Founder Name]

---

**Attachments** (if relevant):
- [Link to detailed dashboard or deck]
- [Link to product demo or new feature]
- [Link to press coverage or case study]

---

## Formatting Notes for Email

When sending this as an email:
- Use the recommended subject line
- Send as HTML (format tables properly)
- Include inline charts if you have them (MRR growth, user growth)
- Send on a consistent day each month (e.g., first Monday)
- BCC all investors or use a service like BCC to Substack
- Consider posting to a private investor portal as well

---

## Tone Guidelines

- **Be honest**: Investors smell BS. Share challenges openly with plans.
- **Be specific**: "Grew 47%" > "Grew significantly"
- **Be forward-looking**: Always end with what's next
- **Be appreciative**: Acknowledge help you've received
- **Be brief**: Investors are busy - keep it under 1000 words if possible

Make the update based on the weekly reviews and financial model specific to this startup. Use actual progress and metrics where available. Fill placeholders with [TBD] if metrics aren't in the source files. Make asks specific and actionable. Keep tone transparent, optimistic but realistic, and professional but personal.`
      }
    ]
  })

  // Extract content from response
  let investorUpdate = ''
  for (const block of response.content) {
    if (block.type === 'text') {
      investorUpdate += block.text + '\n'
    }
  }

  if (!investorUpdate.trim()) {
    investorUpdate = 'Failed to generate investor update'
  }

  // Write output
  const outputDir = join(projectRoot, 'metrics', 'output')
  mkdirSync(outputDir, { recursive: true })
  
  const outputPath = join(outputDir, `investor-update-${updateMonth}.md`)
  writeFileSync(outputPath, investorUpdate, 'utf-8')

  console.log(`\nInvestor update generated successfully: ${outputPath}`)
  console.log(`Month: ${updateMonth}`)
  console.log(`Ready to send to investors`)
}

generateInvestorUpdate().catch(console.error)
```

## Output

Creates metrics/output/investor-update-{month}.md with complete monthly investor update email. Includes 3 subject line variants with recommendation, TL;DR with 3 key bullets, comprehensive metrics table with MoM changes and status indicators, progress vs goals assessment, what's working section with evidence, what's not working with action plans, team and hiring updates, product and customer highlights with use cases, upcoming 30/90-day milestones, specific asks for investors with context, closing reflection, formatting notes for email delivery, and tone guidelines for authenticity.
