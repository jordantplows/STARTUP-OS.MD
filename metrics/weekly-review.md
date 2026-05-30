---
name: weekly-review
description: >
  Generates weekly company review by accepting/prompting for 3 wins and 3
  challenges, then creates formatted review with headline, metrics snapshot
  table with WoW delta, wins, challenges with root cause, customer pulse,
  decisions made, next week priorities, and help needed section.
department: metrics
triggers: ["/startup-os metrics"]
allowed-tools: [Read, Write, Bash]
reads:
  - CLAUDE.md
  - metrics/output/kpi-framework.md
  - metrics/output/north-star.md
writes:
  - metrics/output/weekly-review-{date}.md
---

## What this agent does

Generates weekly company review document by prompting for or accepting 3 wins and 3 challenges from the week. Pulls key metrics from KPI framework and North Star tracking. Creates structured weekly review with: week headline, metrics snapshot table with week-over-week delta, wins (with impact), challenges (with root cause analysis), customer pulse, decisions made, next week priorities, and help needed section. Writes to metrics/output/weekly-review-{date}.md.

## Instructions

1. Read CLAUDE.md for company context
2. Read metrics/output/kpi-framework.md for tracked metrics
3. Read metrics/output/north-star.md for NSM and input metrics
4. Prompt user for this week's date, 3 wins, 3 challenges (if not provided)
5. Prompt for key metric values or use placeholders
6. Generate week headline (1 sentence capturing the theme)
7. Create metrics snapshot table with WoW % change
8. Write wins section with impact statements
9. Write challenges section with root cause analysis
10. Add customer pulse (feedback/trends)
11. List decisions made this week
12. Define next week priorities (3-5 items)
13. Add help needed section
14. Write to metrics/output/weekly-review-{date}.md

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
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

async function generateWeeklyReview() {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  })

  const projectRoot = process.cwd()
  
  // Read context files
  let claudeMd = ''
  let kpiFramework = ''
  let northStar = ''

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

  // Prompt for inputs
  console.log('\n=== Weekly Review Generator ===\n')
  
  const weekEndingDate = await promptUser('Week ending date (YYYY-MM-DD) [default: today]: ') || 
    new Date().toISOString().split('T')[0]
  
  console.log('\nEnter 3 wins from this week (one per line):')
  const win1 = await promptUser('Win 1: ')
  const win2 = await promptUser('Win 2: ')
  const win3 = await promptUser('Win 3: ')
  
  console.log('\nEnter 3 challenges from this week (one per line):')
  const challenge1 = await promptUser('Challenge 1: ')
  const challenge2 = await promptUser('Challenge 2: ')
  const challenge3 = await promptUser('Challenge 3: ')
  
  console.log('\nOptional: Enter key metric values (or press Enter to use placeholders)')
  const metricsInput = await promptUser('Paste metric values or press Enter: ')

  const fullContext = `
# Startup Context

## Startup Profile
${claudeMd}

## KPI Framework
${kpiFramework}

## North Star
${northStar}

# This Week's Inputs

## Week Ending
${weekEndingDate}

## Wins
1. ${win1}
2. ${win2}
3. ${win3}

## Challenges
1. ${challenge1}
2. ${challenge2}
3. ${challenge3}

## Metrics
${metricsInput || '[To be filled from metrics dashboard]'}
  `.trim()

  // Generate weekly review via Claude API
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 16000,
    messages: [
      {
        role: 'user',
        content: `You are a weekly review expert for startups. Based on this context:

${fullContext}

Create a weekly review document with the following structure:

# Weekly Review: Week of ${weekEndingDate}

**Company**: [Company Name from context]
**Generated**: ${new Date().toISOString().split('T')[0]}
**Reported by**: [CEO/Team]

---

## Week in a Headline

[One compelling sentence that captures the essence of this week - the theme, the big milestone, or the key learning. Make it memorable.]

---

## Metrics Snapshot

| Metric | This Week | Last Week | WoW Change | Target | On Track? |
|--------|-----------|-----------|------------|--------|-----------|
| North Star: [NSM] | [value] | [value] | [+X%] | [target] | ✅/⚠️/❌ |
| [Input Metric 1] | [value] | [value] | [+X%] | [target] | ✅/⚠️/❌ |
| [Input Metric 2] | [value] | [value] | [+X%] | [target] | ✅/⚠️/❌ |
| [Input Metric 3] | [value] | [value] | [+X%] | [target] | ✅/⚠️/❌ |
| [Key Finance Metric] | [value] | [value] | [+X%] | [target] | ✅/⚠️/❌ |
| [Key Product Metric] | [value] | [value] | [+X%] | [target] | ✅/⚠️/❌ |
| [Key Sales Metric] | [value] | [value] | [+X%] | [target] | ✅/⚠️/❌ |

**Legend**: ✅ On track or ahead | ⚠️ Slightly behind | ❌ Significantly behind

**Overall Health**: [Green/Yellow/Red] — [One sentence summary]

Use the provided metrics input or create realistic placeholders based on the KPI framework. Show WoW (week-over-week) percentage change.

---

## 🎉 Wins

### 1. [Win 1 - transformed into clear headline]

**What happened**: [Expand on the win with context and details]

**Impact**: [Why this matters - revenue impact, product improvement, team growth, etc.]

**Who made it happen**: [Team/person credit]

---

### 2. [Win 2 - transformed into clear headline]

**What happened**: [Expand on the win with context and details]

**Impact**: [Why this matters]

**Who made it happen**: [Team/person credit]

---

### 3. [Win 3 - transformed into clear headline]

**What happened**: [Expand on the win with context and details]

**Impact**: [Why this matters]

**Who made it happen**: [Team/person credit]

---

## 🚧 Challenges

### 1. [Challenge 1 - transformed into clear headline]

**What happened**: [Expand on the challenge with context]

**Root cause**: [Honest analysis of why this is happening - don't just restate the problem]

**Action plan**: [Specific next steps to address it]

**Owner**: [Who's accountable]

**Timeline**: [When we'll know if it's resolved]

---

### 2. [Challenge 2 - transformed into clear headline]

**What happened**: [Expand on the challenge]

**Root cause**: [Why is this happening]

**Action plan**: [Specific next steps]

**Owner**: [Who's accountable]

**Timeline**: [Resolution timeline]

---

### 3. [Challenge 3 - transformed into clear headline]

**What happened**: [Expand on the challenge]

**Root cause**: [Why is this happening]

**Action plan**: [Specific next steps]

**Owner**: [Who's accountable]

**Timeline**: [Resolution timeline]

---

## 💬 Customer Pulse

### This Week's Feedback
- [Notable customer feedback, feature request, or complaint - with customer context]
- [Another piece of feedback]
- [Another piece of feedback]

### Trends
[2-3 sentences on patterns in customer conversations, support tickets, or usage - what are customers telling us?]

### NPS/CSAT
[If measured this week, include score and sample comments]

---

## ✅ Decisions Made

1. **[Decision 1]** — [Brief rationale and who decided]
2. **[Decision 2]** — [Brief rationale and who decided]
3. **[Decision 3]** — [Brief rationale and who decided]

[Include strategic decisions, hiring decisions, product decisions, etc. - things that change direction or commit resources]

---

## 🎯 Next Week Priorities

### Must-Do (Critical Path)
1. **[Priority 1]** — [Why it's critical, owner, success criteria]
2. **[Priority 2]** — [Why it's critical, owner, success criteria]
3. **[Priority 3]** — [Why it's critical, owner, success criteria]

### Should-Do (Important but flexible)
- [Priority 4] — [Owner]
- [Priority 5] — [Owner]

### Success looks like...
[One sentence on what good looks like at next week's review]

---

## 🆘 Help Needed

1. **[Area 1]** — [What specific help is needed and from whom - investors, advisors, network, etc.]
2. **[Area 2]** — [What specific help is needed]
3. **[Area 3]** — [What specific help is needed]

[Be specific - "intro to Head of Sales at Company X" not "help with sales"]

---

## Team Shoutouts

- **[Name]** — [Why they deserve recognition this week]
- **[Name]** — [Why they deserve recognition this week]
- **[Name]** — [Why they deserve recognition this week]

---

## Looking Ahead

### Next 2-4 weeks
[2-3 sentences on what's coming up - big launches, hires, milestones, deadlines]

### Potential Blockers
[1-2 things that could derail progress if not addressed]

---

## Reflection

### What went well this week?
[1-2 sentences on process, teamwork, or execution that worked]

### What could we improve next week?
[1-2 sentences on lessons learned - be honest and actionable]

---

**Previous Review**: [Link to last week's review if it exists]
**Next Review**: Week of [DATE+7 days]

Transform the provided wins and challenges into detailed, impactful sections. Use the company context to make metrics and priorities specific. Be honest and constructive in challenges section. Make help needed specific and actionable. Keep tone transparent and authentic - this is for internal team and investors.`
      }
    ]
  })

  // Extract content from response
  let weeklyReview = ''
  for (const block of response.content) {
    if (block.type === 'text') {
      weeklyReview += block.text + '\n'
    }
  }

  if (!weeklyReview.trim()) {
    weeklyReview = 'Failed to generate weekly review'
  }

  // Write output
  const outputDir = join(projectRoot, 'metrics', 'output')
  mkdirSync(outputDir, { recursive: true })
  
  const dateForFilename = weekEndingDate.replace(/\//g, '-')
  const outputPath = join(outputDir, `weekly-review-${dateForFilename}.md`)
  writeFileSync(outputPath, weeklyReview, 'utf-8')

  console.log(`\nWeekly review generated successfully: ${outputPath}`)
  console.log(`Week ending: ${weekEndingDate}`)
  console.log(`Wins captured: 3`)
  console.log(`Challenges analyzed: 3`)
}

generateWeeklyReview().catch(console.error)
```

## Output

Creates metrics/output/weekly-review-{date}.md with complete weekly review. Includes week-in-a-headline summary, metrics snapshot table with WoW percentage changes and on-track indicators, expanded wins with impact statements and credit, challenges with root cause analysis and action plans, customer pulse with feedback trends, decisions made with rationale, next week priorities with owners and success criteria, specific help needed requests, team shoutouts, and forward-looking reflection on process improvements.
