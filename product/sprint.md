---
name: sprint
description: Generate sprint plan with story points and goals from roadmap
department: product
triggers: ["/startup-os product"]
allowed-tools: [Read, Write, Bash]
reads:
  - CLAUDE.md
  - product/output/roadmap-filled.md
  - product/output/mvp-definition.md
writes:
  - product/output/sprint-{N}.md
---

## What this agent does

Accepts sprint number as input, reads the product roadmap, pulls items from the "Now" phase, assigns Fibonacci story points (totaling approximately 40 points per 2-week sprint), flags blockers and dependencies, generates sprint goal, standup schedule, and retro template. Writes to product/output/sprint-{N}.md.

## Instructions

1. Accept sprint number as command line argument (default: 1)
2. Read CLAUDE.md, roadmap-filled.md, and mvp-definition.md
3. Call Claude API to create sprint plan from "Now" roadmap items
4. Assign Fibonacci story points (1, 2, 3, 5, 8, 13) totaling ~40 points
5. Break down features into user stories with acceptance criteria
6. Flag blockers, dependencies, and risks
7. Generate sprint goal, standup schedule, and retro template
8. Write to product/output/sprint-{N}.md

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

async function generateSprint() {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  })

  const projectRoot = process.cwd()
  
  // Get sprint number from command line args or default to 1
  const sprintNum = process.argv[2] ? parseInt(process.argv[2]) : 1
  
  if (isNaN(sprintNum) || sprintNum < 1) {
    throw new Error('Sprint number must be a positive integer. Usage: node sprint.js [sprint-number]')
  }

  // Read input files
  let claudeMd = ''
  let roadmap = ''
  let mvpDef = ''

  try {
    claudeMd = readFileSync(join(projectRoot, 'CLAUDE.md'), 'utf-8')
  } catch (err) {
    claudeMd = 'No startup profile found.'
  }

  const productOutput = join(projectRoot, 'product', 'output')
  
  try {
    roadmap = readFileSync(join(productOutput, 'roadmap-filled.md'), 'utf-8')
  } catch (err) {
    throw new Error('Roadmap not found. Run roadmap agent first.')
  }

  try {
    mvpDef = readFileSync(join(productOutput, 'mvp-definition.md'), 'utf-8')
  } catch (err) {
    mvpDef = 'No MVP definition found.'
  }

  // Generate sprint plan via Claude API
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8000,
    messages: [
      {
        role: 'user',
        content: `You are an agile product manager. Create Sprint ${sprintNum} plan from the roadmap's "Now" items.

**Startup Profile:**
${claudeMd}

**Product Roadmap:**
${roadmap}

**MVP Definition:**
${mvpDef}

Generate a complete SPRINT ${sprintNum} PLAN (2-week sprint):

# Sprint ${sprintNum} Plan

**Sprint Duration:** [Start date] - [End date] (2 weeks)

**Sprint Goal:**
[One compelling sentence describing what the team will accomplish this sprint and why it matters]

---

## Sprint Backlog

**Total Points:** [Sum should be ~40 points]

### User Story 1: [Title]
**Story Points:** [1/2/3/5/8/13]

**As a** [persona]
**I want to** [action]
**So that** [benefit]

**Acceptance Criteria:**
- [ ] [Specific, testable criterion]
- [ ] [Specific, testable criterion]
- [ ] [Specific, testable criterion]

**Technical Notes:**
[Any technical considerations, API requirements, etc.]

**Dependencies:**
[Any blockers or dependencies on other stories/teams]

**Priority:** [Must Have / Should Have / Nice to Have]

---

### User Story 2: [Title]
**Story Points:** [1/2/3/5/8/13]

[Repeat structure above]

---

### User Story 3: [Title]
[Continue until ~40 story points total]

---

### User Story 4: [Title]
[Continue...]

---

### User Story 5: [Title]
[Continue...]

---

## Sprint Breakdown by Day

**Week 1:**
- **Mon-Tue:** [Stories targeted]
- **Wed-Thu:** [Stories targeted]
- **Fri:** [Stories targeted + sprint health check]

**Week 2:**
- **Mon-Tue:** [Stories targeted]
- **Wed-Thu:** [Stories targeted + testing]
- **Fri:** [Demo prep, retro, planning for next sprint]

---

## Blockers & Risks

### Known Blockers
1. **[Blocker 1]:** [Description and mitigation plan]
2. **[Blocker 2]:** [Description and mitigation plan]

### Identified Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| [Risk 1] | High/Med/Low | [Plan to address] |
| [Risk 2] | High/Med/Low | [Plan to address] |

### Dependencies
- **External:** [Dependencies on other teams, vendors, etc.]
- **Internal:** [Dependencies between stories in this sprint]

---

## Sprint Ceremonies

### Daily Standup
**Time:** [Time, e.g., 9:30 AM daily]
**Duration:** 15 minutes
**Format:**
- What did you complete yesterday?
- What will you work on today?
- Any blockers?

**Schedule:**
- Day 1 (Mon): [Date]
- Day 2 (Tue): [Date]
- Day 3 (Wed): [Date]
- Day 4 (Thu): [Date]
- Day 5 (Fri): [Date]
- Day 6 (Mon): [Date]
- Day 7 (Tue): [Date]
- Day 8 (Wed): [Date]
- Day 9 (Thu): [Date]
- Day 10 (Fri): [Date]

---

### Sprint Demo
**Time:** [Date/Time - last day of sprint]
**Duration:** 30-60 minutes
**Attendees:** Team + stakeholders
**Agenda:** Demo completed stories to stakeholders

---

### Sprint Retrospective
**Time:** [Date/Time - after demo]
**Duration:** 60 minutes
**Format:** Start/Stop/Continue

---

## Definition of Done

A story is "Done" when:
- [ ] Code is written and peer-reviewed
- [ ] Unit tests written and passing
- [ ] Integration tests passing
- [ ] Acceptance criteria met and verified
- [ ] Documentation updated
- [ ] Deployed to staging environment
- [ ] Product owner has accepted the story

---

## Sprint Metrics to Track

- **Velocity:** [Completed story points]
- **Burndown:** [Daily tracking of remaining points]
- **Cycle Time:** [Average time from start to done]
- **Blocked Time:** [Days spent blocked]

---

## Retrospective Template

### What went well (Start)
1. 
2. 
3. 

### What didn't go well (Stop)
1. 
2. 
3. 

### What should we change (Continue)
1. 
2. 
3. 

### Action Items for Next Sprint
- [ ] [Actionable item]
- [ ] [Actionable item]
- [ ] [Actionable item]

---

## Notes
[Any additional context, assumptions, or decisions made during sprint planning]

Make this realistic and executable with properly scoped stories.`
      }
    ]
  })

  const sprint = response.content[0].type === 'text' 
    ? response.content[0].text 
    : 'Failed to generate sprint plan'

  // Write output
  const outputDir = join(projectRoot, 'product', 'output')
  mkdirSync(outputDir, { recursive: true })
  
  const outputPath = join(outputDir, `sprint-${sprintNum}.md`)
  writeFileSync(outputPath, sprint, 'utf-8')

  console.log(`Sprint ${sprintNum} plan generated successfully: ${outputPath}`)
  console.log(`\nIncludes sprint goal, user stories with Fibonacci points (~40 total), blockers, ceremonies, and retro template`)
}

generateSprint().catch(console.error)
```

## Output

Creates product/output/sprint-{N}.md with a 2-week sprint plan including sprint goal, user stories with Fibonacci story points totaling ~40 points, acceptance criteria, day-by-day breakdown, blockers and risks, sprint ceremony schedule (daily standups, demo, retro), definition of done checklist, metrics to track, and retrospective template. Requires roadmap-filled.md to exist. Accepts sprint number as command line argument (default: 1). Fails if prerequisite product files are missing or Claude API is unavailable.
