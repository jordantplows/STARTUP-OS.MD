---
name: prd
description: Generate complete Product Requirements Document for a feature
department: product
triggers: ["/startup-os product"]
allowed-tools: [Read, Write, Bash]
reads:
  - CLAUDE.md
  - product/output/personas-filled.md
  - product/output/mvp-definition.md
  - product/output/roadmap-filled.md
writes:
  - product/output/prd-{feature-slug}.md
---

## What this agent does

Accepts a feature name as input, reads personas and MVP definition, generates a complete Product Requirements Document (PRD) with problem statement, goals and success metrics, 10+ detailed user stories, functional requirements, non-functional requirements, out-of-scope items, and open questions. Writes to product/output/prd-{feature-slug}.md.

## Instructions

1. Accept feature name as command line argument
2. Read CLAUDE.md, personas-filled.md, mvp-definition.md, and roadmap-filled.md
3. Call Claude API to generate comprehensive PRD for the feature
4. Include problem statement, goals, metrics, user stories (10+), requirements, constraints
5. Document out-of-scope items and open questions
6. Create feature slug from name (lowercase, hyphenated)
7. Write to product/output/prd-{feature-slug}.md

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

async function generatePRD() {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  })

  const projectRoot = process.cwd()
  
  // Get feature name from command line args
  const featureName = process.argv.slice(2).join(' ')
  
  if (!featureName) {
    throw new Error('Feature name required. Usage: node prd.js "Feature Name"')
  }

  // Create slug from feature name
  const slug = featureName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  // Read input files
  let claudeMd = ''
  let personas = ''
  let mvpDef = ''
  let roadmap = ''

  try {
    claudeMd = readFileSync(join(projectRoot, 'CLAUDE.md'), 'utf-8')
  } catch (err) {
    claudeMd = 'No startup profile found.'
  }

  const productOutput = join(projectRoot, 'product', 'output')
  
  try {
    personas = readFileSync(join(productOutput, 'personas-filled.md'), 'utf-8')
  } catch (err) {
    throw new Error('Personas not found. Run personas agent first.')
  }

  try {
    mvpDef = readFileSync(join(productOutput, 'mvp-definition.md'), 'utf-8')
  } catch (err) {
    mvpDef = 'No MVP definition found.'
  }

  try {
    roadmap = readFileSync(join(productOutput, 'roadmap-filled.md'), 'utf-8')
  } catch (err) {
    roadmap = 'No roadmap found.'
  }

  // Generate PRD via Claude API
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 12000,
    messages: [
      {
        role: 'user',
        content: `You are a senior product manager. Create a comprehensive PRD for the feature: "${featureName}"

**Startup Profile:**
${claudeMd}

**User Personas:**
${personas}

**MVP Definition:**
${mvpDef}

**Product Roadmap:**
${roadmap}

Generate a complete PRODUCT REQUIREMENTS DOCUMENT:

# PRD: ${featureName}

**Status:** [Draft / In Review / Approved]
**Owner:** [Product Manager name/role]
**Created:** [Date]
**Last Updated:** [Date]
**Target Release:** [Sprint/Quarter]

---

## Executive Summary

[2-3 paragraph overview: What is this feature? Why are we building it? What's the expected impact?]

---

## Problem Statement

### The Problem
[Detailed description of the user problem this feature solves. Make it specific and grounded in persona pain points.]

### Current Experience
[How users currently deal with this problem - their workflow, workarounds, and pain points.]

### Proposed Experience
[How this feature will change the user experience and solve the problem.]

### Why Now?
[Why is this the right time to build this feature? Market conditions, competitive pressure, customer demand, strategic importance.]

---

## Goals & Success Metrics

### Business Goals
1. [Primary business objective]
2. [Secondary business objective]
3. [Additional objective]

### User Goals
1. [What users will accomplish with this feature]
2. [Secondary user benefit]
3. [Additional user benefit]

---

### Success Metrics

#### Primary Metrics
| Metric | Current Baseline | Target | Measurement Method |
|--------|------------------|--------|-------------------|
| [Metric 1] | [Value] | [Target] | [How measured] |
| [Metric 2] | [Value] | [Target] | [How measured] |

#### Secondary Metrics
| Metric | Current Baseline | Target | Measurement Method |
|--------|------------------|--------|-------------------|
| [Metric 3] | [Value] | [Target] | [How measured] |
| [Metric 4] | [Value] | [Target] | [How measured] |

#### Leading Indicators
- [Early signal 1]
- [Early signal 2]

---

## Target Users

**Primary Persona:** [Persona name and brief description]

**Secondary Persona:** [Persona name if applicable]

**User Segment Characteristics:**
- [Characteristic 1]
- [Characteristic 2]
- [Characteristic 3]

---

## User Stories

### Epic: [Feature Name]

#### Story 1: [Title]
**Priority:** Must Have

**As a** [persona]
**I want to** [action]
**So that** [benefit]

**Acceptance Criteria:**
- [ ] [Specific, testable criterion]
- [ ] [Specific, testable criterion]
- [ ] [Specific, testable criterion]

**Story Points:** [1/2/3/5/8/13]

---

#### Story 2: [Title]
**Priority:** Must Have

[Repeat structure above]

---

#### Story 3: [Title]
**Priority:** Should Have

[Continue for at least 10 user stories total, covering all aspects of the feature]

---

#### Story 4-10+: [Continue...]

[Include at least 10 comprehensive user stories covering:]
- Happy path scenarios
- Edge cases
- Error handling
- Admin/configuration needs
- Analytics/tracking needs

---

## Functional Requirements

### Core Functionality

#### 1. [Major Function 1]
**Description:** [What it does]

**Requirements:**
- REQ-1.1: [Specific requirement]
- REQ-1.2: [Specific requirement]
- REQ-1.3: [Specific requirement]

**User Flow:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

---

#### 2. [Major Function 2]
[Repeat structure above]

---

#### 3. [Major Function 3]
[Continue...]

---

### Data & Integrations

**Data Requirements:**
- [What data needs to be captured/stored/processed]
- [Data sources and formats]
- [Data retention and privacy requirements]

**API/Integration Requirements:**
- [External systems to integrate with]
- [API endpoints needed]
- [Third-party services required]

---

### User Interface Requirements

**Key Screens/Views:**
1. [Screen 1]: [Purpose and key elements]
2. [Screen 2]: [Purpose and key elements]
3. [Screen 3]: [Purpose and key elements]

**Interaction Patterns:**
- [Pattern 1 - e.g., how users navigate]
- [Pattern 2 - e.g., how data is displayed]
- [Pattern 3 - e.g., error handling]

**Responsive Design:**
- [Desktop requirements]
- [Mobile requirements]
- [Tablet requirements if applicable]

---

## Non-Functional Requirements

### Performance
- **Response Time:** [e.g., <200ms for API calls]
- **Page Load:** [e.g., <2s initial load]
- **Throughput:** [e.g., handle 1000 concurrent users]

### Scalability
- [How system should scale with growth]
- [Expected load and capacity planning]

### Security
- **Authentication:** [Requirements]
- **Authorization:** [Role-based access control requirements]
- **Data Protection:** [Encryption, PII handling, etc.]

### Reliability & Availability
- **Uptime:** [e.g., 99.9% uptime SLA]
- **Backup:** [Data backup requirements]
- **Disaster Recovery:** [Recovery time objectives]

### Accessibility
- [WCAG compliance level]
- [Specific accessibility requirements]

### Localization
- [Internationalization requirements if applicable]
- [Language support needed]

---

## Out of Scope

**Explicitly NOT included in this version:**
1. [Feature/capability] - [Rationale for exclusion]
2. [Feature/capability] - [Why deferred]
3. [Feature/capability] - [Why not relevant]
4. [Feature/capability] - [Complexity vs value tradeoff]
5. [Feature/capability] - [Future consideration]

**Future Considerations:**
- [Enhancement planned for later]
- [Extension to consider post-launch]

---

## Technical Considerations

### Architecture
[High-level technical approach, major components, technology choices]

### Dependencies
**Internal:**
- [Dependency on other features/systems]

**External:**
- [Third-party services or libraries required]

### Data Model
[Key entities and relationships needed for this feature]

### APIs
[Endpoints to create, modify, or consume]

---

## Design & UX

### Design Principles
1. [Principle 1 - e.g., simplicity over features]
2. [Principle 2 - e.g., progressive disclosure]
3. [Principle 3 - e.g., feedback on every action]

### UX Requirements
- [Key UX consideration 1]
- [Key UX consideration 2]
- [Key UX consideration 3]

### Design Assets Needed
- [ ] Wireframes
- [ ] High-fidelity mockups
- [ ] Prototype
- [ ] Design system components
- [ ] User flow diagrams

---

## Analytics & Instrumentation

### Events to Track
| Event Name | Trigger | Properties | Purpose |
|------------|---------|------------|---------|
| [event_1] | [When fired] | [Data captured] | [Why tracking] |
| [event_2] | [When fired] | [Data captured] | [Why tracking] |
| [event_3] | [When fired] | [Data captured] | [Why tracking] |

### Dashboards
[What dashboards or reports are needed to monitor this feature]

---

## Release Strategy

### Launch Plan
**Phase 1: Internal Alpha**
- [Timeline and goals]

**Phase 2: Beta Testing**
- [Timeline, user selection, success criteria]

**Phase 3: General Availability**
- [Full rollout plan]

### Rollout Strategy
- [Percentage rollout plan if applicable]
- [Feature flags needed]
- [Kill switch requirements]

### Marketing & Communications
- [User communication plan]
- [Marketing materials needed]
- [Training/onboarding requirements]

---

## Risks & Mitigations

| Risk | Impact | Probability | Mitigation | Owner |
|------|--------|-------------|------------|-------|
| [Risk 1] | High/Med/Low | High/Med/Low | [Plan] | [Person] |
| [Risk 2] | High/Med/Low | High/Med/Low | [Plan] | [Person] |
| [Risk 3] | High/Med/Low | High/Med/Low | [Plan] | [Person] |

---

## Open Questions

1. **[Question 1]**
   - **Decision Needed By:** [Date]
   - **Owner:** [Person responsible for answering]
   - **Options:** [Potential answers/approaches]

2. **[Question 2]**
   [Same structure]

3. **[Question 3]**
   [Continue...]

---

## Dependencies & Timeline

### Prerequisite Work
- [ ] [What needs to be done first]
- [ ] [Dependency on other teams]

### Estimated Timeline
- **Design:** [Weeks]
- **Development:** [Weeks]
- **QA/Testing:** [Weeks]
- **Total:** [Weeks from kickoff to launch]

### Key Milestones
| Milestone | Target Date | Status |
|-----------|-------------|--------|
| PRD Approval | [Date] | [Status] |
| Design Complete | [Date] | [Status] |
| Dev Complete | [Date] | [Status] |
| QA Complete | [Date] | [Status] |
| Launch | [Date] | [Status] |

---

## Stakeholders & Approvals

| Role | Name | Responsibility | Approval Date |
|------|------|----------------|---------------|
| Product Manager | [Name] | PRD Owner | |
| Engineering Lead | [Name] | Technical Review | |
| Design Lead | [Name] | UX/Design Review | |
| Executive Sponsor | [Name] | Final Approval | |

---

## Appendix

### References
- [Link to user research]
- [Link to competitive analysis]
- [Link to design mocks]

### Related Documents
- [Link to technical design doc]
- [Link to API specifications]
- [Link to test plan]

### Revision History
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | [Date] | [Name] | Initial draft |

Make this comprehensive, specific, and ready for engineering handoff.`
      }
    ]
  })

  const prd = response.content[0].type === 'text' 
    ? response.content[0].text 
    : 'Failed to generate PRD'

  // Write output
  const outputDir = join(projectRoot, 'product', 'output')
  mkdirSync(outputDir, { recursive: true })
  
  const outputPath = join(outputDir, `prd-${slug}.md`)
  writeFileSync(outputPath, prd, 'utf-8')

  console.log(`PRD generated successfully: ${outputPath}`)
  console.log(`\nFeature: ${featureName}`)
  console.log(`Includes problem statement, goals/metrics, 10+ user stories, functional/non-functional requirements, and open questions`)
}

generatePRD().catch(console.error)
```

## Output

Creates product/output/prd-{feature-slug}.md with a comprehensive Product Requirements Document including executive summary, problem statement, goals and success metrics (with baselines and targets), 10+ detailed user stories with acceptance criteria, functional requirements with user flows, non-functional requirements (performance, security, accessibility), UI requirements, out-of-scope items, technical considerations, analytics events, release strategy, risk mitigation, open questions with owners, dependencies, timeline, and stakeholder approval table. Requires personas-filled.md and mvp-definition.md to exist. Accepts feature name as command line argument. Fails if prerequisite product files are missing or Claude API is unavailable.
