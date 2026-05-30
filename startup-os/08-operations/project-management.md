# Project Management

**Version:** 1.0  
**Last Updated:** [PLACEHOLDER - Date]  
**Owner:** [PLACEHOLDER - Head of Engineering / Head of Product]  
**Status:** Active

## Overview

This document defines the project management methodology, sprint cadence, agile rituals, tools, and processes used by [PLACEHOLDER - Company Name] to plan, execute, and deliver product features and initiatives. Our approach balances structure with flexibility, enabling teams to ship fast while maintaining quality and alignment.

### Purpose

- Establish consistent project management practices across all teams
- Define sprint cadence, ceremonies, and rituals
- Clarify roles, responsibilities, and decision-making authority
- Enable predictable delivery and transparent progress tracking
- Support cross-functional collaboration and alignment

### Management Philosophy

**[PRINCIPLE]** We operate with **1-week sprints** for engineering and product teams, with **quarterly OKRs** for strategic planning. This creates a fast feedback loop while maintaining long-term vision.

**[PRINCIPLE]** We favor **asynchronous communication** (written updates, recorded videos) over meetings wherever possible to respect maker time and enable remote collaboration.

**[PRINCIPLE]** We practice **lightweight agile** - not strict Scrum or Kanban, but principles adapted to our startup context. Documentation is helpful, but shipping working software is the primary measure of progress.

---

## Project Management Tools

### Primary Tools

#### Linear

**Purpose:** Issue tracking, sprint planning, backlog management, and roadmap visualization

**Why Linear:**
- Fast, keyboard-driven interface (reduces friction)
- Excellent GitHub integration (auto-links PRs to issues)
- Built-in sprint cycles and roadmap views
- Custom workflows per team
- Slack notifications and updates

**Access:** All team members (read), Engineering + Product (write), Leads (admin)

**Structure:**
- **Teams:** Engineering, Product, Design, Data, Customer Success
- **Projects:** Major initiatives that span multiple sprints (e.g., "Enterprise SSO", "Mobile App v1")
- **Issues:** Individual tasks, bugs, features
- **Labels:** Priority (P0-P3), Type (feature, bug, tech-debt, ops), Status (backlog, todo, in-progress, in-review, done)

#### GitHub

**Purpose:** Version control, code review, CI/CD, and release management

**Integration with Linear:**
- Branch names include Linear issue ID: `feature/ENG-123-add-user-auth`
- PRs automatically link to Linear issues
- Linear status updates when PRs are merged

#### Notion

**Purpose:** Long-form documentation, PRDs, RFCs, meeting notes, team wiki

**Structure:**
- **Product:** PRDs, user research, feature specs
- **Engineering:** RFCs, architecture docs, runbooks, postmortems
- **Company:** Team handbook, meeting notes, all-hands decks

**Why Notion:**
- Flexible databases and templates
- Embeds (Figma, Linear, Loom)
- Collaborative editing
- Centralized knowledge base

#### Slack

**Purpose:** Real-time communication, notifications, and integrations

**Key Channels:**
- `#engineering` - Engineering team updates and discussions
- `#product` - Product announcements and feedback
- `#deploys` - Automated deployment notifications from CI/CD
- `#linear-updates` - Linear issue updates (auto-posted by bot)
- `#standups` - Async daily standups (via Geekbot)
- `#wins` - Celebrate shipped features and milestones

---

## Sprint Cadence

### Sprint Duration: 1 Week

**[DECISION]** We run **1-week sprints** (Monday - Friday) for the following reasons:
- Faster feedback loops and course correction
- Reduced planning overhead (30 min/week vs. 2 hours every 2 weeks)
- Easier to commit to small, shippable increments
- Better for early-stage startups where priorities shift frequently

**[ALTERNATIVE CONSIDERED]** 2-week sprints are common in larger organizations, but we found them too slow for our current stage. We may revisit at 50+ employees.

### Sprint Schedule

**Monday:**
- 9:00 AM: Sprint Planning (30 minutes, synchronous)
- 10:00 AM: Sprint starts
- Async: Team reviews last sprint retro action items

**Tuesday - Thursday:**
- Daily async standups posted in Slack by 10:00 AM
- Ad-hoc pairing, code reviews, design reviews as needed

**Friday:**
- 2:00 PM: Sprint Demo (30 minutes, synchronous)
- 3:00 PM: Sprint Retrospective (30 minutes, synchronous)
- 4:00 PM: Sprint closes automatically in Linear
- Async: Engineers wrap up documentation, deploy to production

**Weekend:**
- No work expected (respect work-life balance)
- On-call rotation handles production incidents only

---

## Agile Ceremonies & Rituals

### 1. Sprint Planning (Monday, 30 min)

**Purpose:** Commit to work for the upcoming sprint, clarify requirements, identify blockers

**Participants:** Engineering team, Product Manager, Design (as needed)

**Facilitator:** Engineering Manager or Product Manager (rotates)

**Agenda:**
1. **Review Sprint Goal (5 min):** What is the one-sentence outcome for this sprint?
2. **Review Backlog (10 min):** Walk through prioritized issues in Linear
3. **Estimate & Commit (10 min):** Team estimates issues (t-shirt sizes: S/M/L) and commits to realistic scope
4. **Identify Dependencies (3 min):** Call out blockers, dependencies on other teams, or open questions
5. **Assign Issues (2 min):** Engineers self-assign issues based on expertise and interest

**Output:**
- Sprint goal documented in Linear
- Issues assigned and moved to "Todo" status
- Sprint capacity commitment (e.g., "We're committing to 5 Medium issues and 3 Small issues this sprint")

**Best Practices:**
- Don't over-commit - aim for 70-80% capacity to allow for bugs and unplanned work
- If unclear on requirements, add a "Spike" task to investigate first
- Product Manager should have backlog refined and prioritized before planning

**[ASSUMPTION]** Sprint capacity per engineer: ~2-3 Medium issues or 4-5 Small issues per week, accounting for meetings, code review, and unplanned work.

### 2. Daily Standup (Async, posted by 10:00 AM)

**Purpose:** Share progress, surface blockers, maintain team visibility

**Format:** Asynchronous written updates posted in Slack `#standups` channel using Geekbot bot

**Template:**
```
Yesterday: [What did you ship or make progress on?]
Today: [What are you working on today?]
Blockers: [Anything blocking your progress?]
```

**Example:**
```
Yesterday: 
- Merged PR for user authentication (ENG-123)
- Code review for API rate limiting (ENG-124)

Today:
- Starting work on email verification flow (ENG-125)
- Pairing with @jane on database migration

Blockers:
- Waiting on design mocks for password reset flow (ENG-126)
```

**Best Practices:**
- Keep it concise (3-5 bullets max)
- Link to Linear issues or PRs where relevant
- Call out blockers clearly so team can help
- If no blockers, write "None"

**[POLICY]** Standups are asynchronous by default. If more than 2 people have related blockers, schedule a 15-minute sync to resolve.

### 3. Sprint Demo (Friday, 30 min)

**Purpose:** Show what was shipped this sprint, gather feedback, celebrate progress

**Participants:** Engineering, Product, Design, and invited stakeholders (Sales, Customer Success, Exec team)

**Facilitator:** Product Manager

**Agenda:**
1. **Review Sprint Goal (2 min):** Remind everyone what we set out to accomplish
2. **Live Demos (20 min):** Engineers demo features in production or staging
   - Show, don't tell (screen share, click through flows)
   - Explain user value, not technical implementation
   - Invite feedback and questions
3. **Bugs Fixed & Tech Debt (5 min):** Quick summary of bugs fixed and infrastructure improvements
4. **Sprint Metrics (3 min):** Share sprint velocity, completion rate, and team health

**Output:**
- Demo recording posted to Slack `#wins` and Notion
- Feedback captured in Linear issues or product backlog

**Best Practices:**
- Only demo what's fully merged and deployed (no "it's almost done" demos)
- Keep demos short (2-3 min per feature)
- If nothing was shipped, be transparent and discuss why (retro will address it)

**[PRINCIPLE]** Demos are about showing value delivered to customers, not reporting on tasks completed.

### 4. Sprint Retrospective (Friday, 30 min)

**Purpose:** Reflect on what went well, what didn't, and commit to improvements

**Participants:** Engineering team, Product Manager, Design (optional)

**Facilitator:** Rotates weekly (spreads ownership, develops facilitation skills)

**Format:** Use a Retro Board (Notion template or Retrium tool)

**Agenda:**
1. **Set the Stage (3 min):** Remind everyone of retro rules (blameless, constructive, actionable)
2. **Gather Data (10 min):** Everyone adds sticky notes to three columns:
   - 😊 **What went well?** (celebrate wins, recognize teammates)
   - 😕 **What didn't go well?** (frustrations, bottlenecks, process issues)
   - 💡 **Ideas for improvement** (concrete suggestions)
3. **Vote on Themes (5 min):** Team votes on which topics to discuss (dot voting)
4. **Discussion (10 min):** Discuss top 2-3 themes, identify root causes
5. **Action Items (2 min):** Commit to 1-2 specific, actionable improvements for next sprint
   - Assign owner and due date
   - Track in Linear with label `retro-action`

**Output:**
- Retro notes saved to Notion
- Action items created in Linear
- Action items reviewed at start of next sprint planning

**Example Action Items:**
- "Add PR template checklist to reduce back-and-forth in code review" (Owner: @john, Due: Next Monday)
- "Document API authentication flow in Notion to reduce onboarding questions" (Owner: @sarah, Due: Next Wednesday)
- "Reduce Slack notifications from Linear to only P0/P1 issues" (Owner: @mike, Due: Next Monday)

**Best Practices:**
- Keep it blameless - focus on systems and processes, not individuals
- Make action items specific and measurable ("Improve documentation" is too vague)
- Don't commit to more than 2 action items per sprint (focus on impact)

**[POLICY]** Retro action items are reviewed at the start of sprint planning. If not completed, discuss why and decide whether to carry forward or drop.

### 5. Backlog Refinement (Ongoing, Async)

**Purpose:** Keep backlog organized, prioritized, and ready for sprint planning

**Owner:** Product Manager

**Cadence:** Continuous (Product Manager refines daily, team reviews as needed)

**Activities:**
- **Triage new issues:** Assign priority (P0-P3), add to backlog or icebox
- **Write acceptance criteria:** Ensure issues are clear and actionable
- **Break down large issues:** Split epics into smaller, sprint-sized tasks
- **Prioritize backlog:** Top 10-15 issues should be ready to pull into next sprint
- **Spike unclear work:** Add research/spike tasks for ambiguous features

**Best Practices:**
- Backlog should have at least 2 sprints' worth of work ready at all times
- Issues without acceptance criteria shouldn't be pulled into sprint
- Use Linear's "Estimate" field (S/M/L) to help with sprint planning

**[ASSUMPTION]** Product Manager spends 3-5 hours/week on backlog refinement to keep pipeline healthy.

---

## Sprint Workflow & Issue Lifecycle

### Issue Statuses (Linear)

**Backlog:** Issue is identified but not yet prioritized or scheduled  
**Todo:** Issue is committed to current sprint, ready to be worked on  
**In Progress:** Engineer is actively working on this issue  
**In Review:** PR is open and awaiting code review  
**Done:** PR is merged, code is deployed to production  
**Canceled:** Issue is no longer needed (document why in comments)

### Issue Priority Levels

**P0 (Critical):** Production outage, security vulnerability, blocker for customer  
- SLA: Fix within 4 hours  
- Example: "Database is down", "Payment processing broken"

**P1 (High):** Important feature or bug affecting multiple users  
- SLA: Fix within 1 sprint  
- Example: "Login sometimes fails", "Export feature not working"

**P2 (Medium):** Standard feature work or minor bugs  
- SLA: Fix within 2-4 sprints  
- Example: "Add password strength indicator", "UI polish"

**P3 (Low):** Nice-to-have improvements, tech debt, non-urgent work  
- SLA: No commitment (pulled in when capacity allows)  
- Example: "Refactor user service", "Add dark mode"

### Definition of Done

An issue is "Done" when:
- ✅ Code is merged to `main` branch
- ✅ Automated tests pass (unit tests, integration tests)
- ✅ Code review approved by at least one other engineer
- ✅ Feature is deployed to production (or staging if behind feature flag)
- ✅ Documentation updated (if user-facing or API change)
- ✅ Product Manager has verified functionality
- ✅ Linear issue is updated with relevant links (PR, Notion doc, etc.)

**[PRINCIPLE]** If it's not in production, it's not done. No credit for "90% complete" work.

---

## Product Development Process

### Feature Development Lifecycle

**1. Discovery & Ideation**
- **Input:** Customer feedback, data analysis, competitive research, team ideas
- **Output:** Problem statement, user stories, rough scope
- **Owner:** Product Manager
- **Tool:** Notion (Product Ideas board)

**2. Prioritization**
- **Input:** Product ideas, OKRs, business goals
- **Framework:** RICE scoring (Reach, Impact, Confidence, Effort)
- **Output:** Prioritized roadmap
- **Owner:** Product Manager + Engineering Manager
- **Tool:** Linear (Roadmap view)

**3. Requirements & Design**
- **Input:** Prioritized feature
- **Output:** PRD (Product Requirements Document) in Notion, Figma mockups
- **Owner:** Product Manager + Designer
- **Process:**
  - Product writes PRD with user stories, acceptance criteria, success metrics
  - Designer creates wireframes and high-fidelity mocks
  - Engineering reviews for feasibility and flags technical concerns
  - PRD reviewed in async (Notion comments) or sync (30 min PRD review meeting)

**4. Technical Design (for complex features)**
- **Input:** PRD and Figma mocks
- **Output:** RFC (Request for Comments) document in Notion
- **Owner:** Tech Lead or Senior Engineer
- **Process:**
  - Engineer writes RFC with architecture, data models, API contracts, edge cases
  - Team reviews RFC async (Notion comments)
  - If needed, schedule 30-min RFC review meeting
  - RFC approved → create Linear issues

**5. Implementation**
- **Input:** PRD, Figma, RFC (if applicable)
- **Output:** Working feature in production
- **Owner:** Engineering team
- **Process:**
  - Break feature into sprint-sized Linear issues
  - Engineers self-assign issues during sprint planning
  - Write code, write tests, open PR
  - Code review → merge → deploy

**6. Validation & Rollout**
- **Input:** Feature deployed to production
- **Output:** Feature is live to all users (or % rollout via feature flag)
- **Owner:** Product Manager
- **Process:**
  - QA testing in staging
  - Soft launch to internal team or beta users
  - Monitor metrics (Mixpanel, Sentry, Datadog)
  - Gradual rollout: 10% → 50% → 100% of users
  - Announce in changelog, update docs, notify customers

**7. Measure & Iterate**
- **Input:** Feature usage data, customer feedback
- **Output:** Iterate or move on to next feature
- **Owner:** Product Manager
- **Process:**
  - Track success metrics defined in PRD (e.g., "30% of users adopt feature within 2 weeks")
  - Gather qualitative feedback (Intercom, customer calls)
  - If successful, move on; if not, iterate or deprecate

---

## Roles & Responsibilities

### Product Manager

**Responsibilities:**
- Define product vision, strategy, and roadmap
- Write PRDs and user stories with clear acceptance criteria
- Prioritize backlog based on business value and OKRs
- Lead sprint planning and demos
- Collaborate with design, engineering, sales, and customer success
- Measure product success metrics and iterate

**Decision Authority:**
- ✅ What features to build (prioritization)
- ✅ User experience and product trade-offs
- ❌ Technical implementation details (engineering owns this)
- ❌ Resource allocation / hiring (engineering manager owns this)

**Time Allocation:**
- 30% - Discovery and research (customer interviews, data analysis)
- 30% - Requirements and design (writing PRDs, working with designer)
- 20% - Sprint ceremonies (planning, demo, retro)
- 10% - Stakeholder management (sales, exec, customer success)
- 10% - Measurement and iteration (analyzing metrics, feedback)

### Engineering Manager

**Responsibilities:**
- Lead engineering team and sprint execution
- Facilitate sprint planning, retros, and technical discussions
- Code review, mentorship, and technical leadership
- Manage engineering velocity and capacity planning
- Unblock engineers and remove process friction
- Hiring, onboarding, and performance management

**Decision Authority:**
- ✅ Technical architecture and implementation approach
- ✅ Engineering processes and tools
- ✅ Sprint capacity and team allocation
- ❌ Product prioritization (product manager owns this)
- ❌ Designs and user experience (designer + PM own this)

**Time Allocation:**
- 40% - Hands-on coding and technical leadership
- 20% - Sprint ceremonies and planning
- 20% - Code review and technical mentorship
- 10% - 1-on-1s and people management
- 10% - Process improvement and tooling

### Tech Lead / Senior Engineer

**Responsibilities:**
- Write RFCs for complex features
- Review PRs and mentor junior engineers
- Own critical system components
- Drive technical strategy and best practices
- Participate in architecture decisions
- On-call rotation for production incidents

**Decision Authority:**
- ✅ Technical design and implementation details
- ✅ Code quality standards and best practices
- ❌ Product prioritization (PM owns this)
- ❌ Team processes (EM owns this)

### Designer

**Responsibilities:**
- Create wireframes, mockups, and prototypes
- Maintain design system and component library
- Collaborate with PM on user research and testing
- Participate in sprint planning and demos
- Review implemented features for design quality

**Decision Authority:**
- ✅ Visual design and interaction patterns
- ✅ Design system standards
- ❌ Feature prioritization (PM owns this)
- ❌ Technical feasibility (engineering owns this)

### Individual Contributor Engineer

**Responsibilities:**
- Implement features and fix bugs according to sprint commitments
- Write tests and documentation
- Review teammates' code
- Participate in sprint ceremonies
- Estimate work and flag blockers proactively

**Decision Authority:**
- ✅ Implementation details within assigned issues
- ✅ Technical trade-offs in their domain
- ❌ Architectural decisions (discuss with tech lead first)

---

## Communication Guidelines

### Synchronous vs. Asynchronous

**[PRINCIPLE]** Default to async. Meetings are expensive and interrupt maker time. Use meetings only when:
- Real-time collaboration is necessary (e.g., design review, RFC discussion)
- Decision needs input from multiple people simultaneously
- Sensitive topic requires nuance (e.g., performance feedback, conflict resolution)

**Async-First Communication:**
- ✅ Standups (Slack updates)
- ✅ Code reviews (GitHub)
- ✅ PRD reviews (Notion comments)
- ✅ Status updates (Linear comments, Slack threads)
- ✅ Non-urgent questions (Slack, document comments)

**Sync Meetings:**
- ✅ Sprint planning (30 min, weekly)
- ✅ Sprint demo (30 min, weekly)
- ✅ Sprint retro (30 min, weekly)
- ✅ 1-on-1s (30 min, bi-weekly)
- ✅ Design reviews (30 min, as needed)
- ✅ Incident postmortems (30 min, as needed)

### Meeting Best Practices

**[POLICY]** All meetings must have:
- Clear agenda (posted in advance)
- Designated facilitator
- Notes doc (Notion, linked in calendar invite)
- Recording (Zoom, uploaded to Notion)
- Action items with owners and due dates

**[POLICY]** Meeting-free time blocks:
- Tuesdays and Thursdays: No meetings 9 AM - 12 PM (maker time)
- Fridays after 4 PM: No meetings (focus time, wrap-up)

### Decision-Making Framework

**Type 1 Decisions (Reversible, Low-Risk):**
- Examples: Code implementation, tool choice, process tweak
- **Process:** Individual or small group decides, documents in PR or Slack, ships it
- **Speed:** Same day

**Type 2 Decisions (Hard to Reverse, High-Risk):**
- Examples: Architecture changes, vendor lock-in, pricing strategy
- **Process:** RFC or proposal doc, async review (3 days), sync discussion if needed, decision documented
- **Speed:** 1 week

**[PRINCIPLE]** Bias toward action. When in doubt, treat as Type 1 decision and move fast. You can always reverse it later.

---

## Metrics & Tracking

### Sprint Metrics (Tracked in Linear)

**Sprint Velocity:**
- Number of issues completed per sprint (by size: S/M/L)
- Trend over time (are we getting faster or slower?)

**Sprint Completion Rate:**
- % of committed issues completed by end of sprint
- Target: 80%+ (if consistently lower, we're over-committing)

**Cycle Time:**
- Time from "In Progress" → "Done"
- Target: < 3 days for Medium issues

**Bug Rate:**
- Number of bugs created per sprint
- Number of bugs fixed per sprint
- Target: Fix bugs faster than they're created

**Engineering Happiness (from Retro):**
- Team rates sprint on 1-5 scale
- Track trends and correlate with process changes

### Product Metrics (Tracked in Mixpanel + Notion)

**Feature Adoption:**
- % of users who use a feature within 7 days of launch
- Target: 20-30% for new features

**Deployment Frequency:**
- Number of production deploys per week
- Target: 5-10 deploys/week (daily or more)

**Lead Time (Commit to Production):**
- Time from first commit to deployed in production
- Target: < 1 day

**MTTR (Mean Time to Recovery):**
- Average time to resolve production incidents
- Target: < 2 hours

---

## Quarterly Planning & OKRs

### OKR Overview

**[CROSS-REFERENCE]** See `/08-operations/okrs.md` for full OKR framework.

**Process:**
- Company OKRs set by leadership every quarter
- Team OKRs derived from company OKRs
- OKRs reviewed in first sprint planning of each quarter
- OKRs inform backlog prioritization and roadmap

**Example Engineering OKR (Q1):**
- **Objective:** Improve product reliability and performance
- **Key Result 1:** Reduce P0/P1 incidents from 4/month to 1/month
- **Key Result 2:** Improve API response time p95 from 800ms to 400ms
- **Key Result 3:** Achieve 95% uptime SLA (currently 92%)

**Sprints roll up to OKRs:** Each sprint should make measurable progress toward at least one OKR.

### Roadmap Planning

**Horizon 1 (Now): Current Quarter**
- Detailed sprint-by-sprint plan
- Committed features with dates
- Tracked in Linear (Issues + Projects)

**Horizon 2 (Next): Next Quarter**
- High-level themes and epics
- Not committed, subject to change
- Tracked in Linear (Projects)

**Horizon 3 (Later): 6-12 months**
- Strategic bets and vision
- No commitments, directional only
- Tracked in Notion (Roadmap page)

**[PRINCIPLE]** We commit to current quarter, plan next quarter, and dream about the future. Don't over-plan beyond 3 months - priorities will change.

---

## Issue Types & Templates

### Feature Issue Template

```
## User Story
As a [type of user], I want [goal] so that [benefit].

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Design
[Link to Figma]

## Technical Notes
[Any technical context, edge cases, or implementation guidance]

## Success Metrics
[How will we measure success? e.g., "30% of users adopt within 2 weeks"]
```

### Bug Issue Template

```
## Description
[Brief description of the bug]

## Steps to Reproduce
1. Go to...
2. Click on...
3. See error

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Environment
- Browser: [e.g., Chrome 120]
- OS: [e.g., macOS 14]
- User: [e.g., user@example.com or user ID]

## Severity
[P0 / P1 / P2 / P3]

## Screenshots / Logs
[Attach screenshots, Sentry link, or error logs]
```

### RFC Template (in Notion)

```
# RFC: [Title]

**Author:** [Name]  
**Status:** Draft / In Review / Approved / Rejected  
**Created:** [Date]  
**Last Updated:** [Date]

## Problem Statement
[What problem are we solving? Why is it important?]

## Proposal
[High-level description of the solution]

## Design
[Detailed technical design: architecture, data models, API contracts, etc.]

## Alternatives Considered
[What other approaches did we consider? Why did we reject them?]

## Risks & Mitigations
[What could go wrong? How do we mitigate these risks?]

## Testing Plan
[How will we validate this works?]

## Rollout Plan
[How will we deploy this safely?]

## Open Questions
[What needs to be resolved before we move forward?]

## Decision
[Final decision and rationale - filled out after review]
```

---

## Incident Management

### Incident Severity Levels

**SEV-1 (Critical):** Product is down or critically impaired for all users  
- Response time: 15 minutes  
- Example: Database outage, payment processing down

**SEV-2 (High):** Major feature is broken, affecting many users  
- Response time: 1 hour  
- Example: Login issues, data sync failures

**SEV-3 (Medium):** Minor feature broken, affecting some users  
- Response time: 4 hours  
- Example: UI bug, export feature broken

**SEV-4 (Low):** Cosmetic issue or minor bug  
- Response time: Next business day  
- Example: Typo, styling glitch

### Incident Response Process

**1. Detection:** Monitoring alert (Datadog, Sentry) or user report (Intercom)  
**2. Triage:** On-call engineer assesses severity and escalates if needed  
**3. Incident Declared:** Post in `#incidents` Slack channel, update status page  
**4. Mitigation:** Fix or rollback to restore service  
**5. Resolution:** Verify fix, close incident, post update  
**6. Postmortem:** Write blameless postmortem within 48 hours (Notion template)

**[CROSS-REFERENCE]** See `/docs/runbooks/incident-response.md` for detailed playbook.

---

## Onboarding & Documentation

### New Engineer Onboarding

**Week 1: Setup & Context**
- Day 1: Laptop setup, access provisioning (GitHub, Linear, Slack, AWS)
- Day 2: Read team docs (Notion), watch onboarding videos
- Day 3-5: Pair with team members, fix small bugs to learn codebase

**Week 2: First Feature**
- Pick up a Small issue from sprint backlog
- Open first PR, get code review feedback
- Deploy to production

**Week 3-4: Ramp Up**
- Take on Medium-sized issues
- Participate in sprint ceremonies
- Conduct first code review

**[GOAL]** New engineers should ship to production by end of Week 2.

### Documentation Standards

**Where to Document:**
- **Code:** Inline comments for complex logic, README for setup
- **Architecture:** RFCs in Notion
- **Processes:** Team handbook in Notion
- **Runbooks:** `/docs/runbooks/` for incident response
- **API Docs:** OpenAPI spec + generated docs

**[POLICY]** If you touch a system and the docs are outdated, update them. Documentation is everyone's responsibility.

---

## Next Steps

### Immediate Actions (Month 0-1)

1. **Set Up Tools**
   - Provision Linear workspace with teams and workflows
   - Configure GitHub + Linear integration
   - Set up Geekbot for async standups
   - Create Notion templates (PRD, RFC, Retro)
   - Owner: [PLACEHOLDER - Engineering Manager]
   - Due: [PLACEHOLDER - Date]

2. **Run First Sprint**
   - Schedule sprint planning, demo, retro meetings
   - Create initial backlog of issues (at least 2 sprints' worth)
   - Assign first sprint issues and kick off
   - Owner: [PLACEHOLDER - Product Manager + Engineering Manager]
   - Due: [PLACEHOLDER - Date]

3. **Document Processes**
   - Create team handbook in Notion with this doc as foundation
   - Record onboarding videos (Loom)
   - Write runbooks for critical systems
   - Owner: [PLACEHOLDER - Tech Lead]
   - Due: [PLACEHOLDER - Date]

### Ongoing (Weekly/Monthly)

4. **Review Metrics**
   - Track sprint velocity and completion rate
   - Review cycle time and bug trends
   - Adjust processes based on retro feedback
   - Owner: [PLACEHOLDER - Engineering Manager]
   - Cadence: Weekly

5. **Refine Backlog**
   - Keep 2 sprints' worth of work ready
   - Write acceptance criteria for top issues
   - Break down large epics into sprint-sized tasks
   - Owner: [PLACEHOLDER - Product Manager]
   - Cadence: Daily

### Quarterly

6. **Process Retrospective**
   - Every quarter, do a meta-retro on project management process itself
   - What's working? What's not? What should we change?
   - Update this document with process improvements
   - Owner: [PLACEHOLDER - Engineering Manager + Product Manager]
   - Cadence: Quarterly

---

## Appendix

### Glossary

**Sprint:** Time-boxed period (1 week) for completing committed work  
**Backlog:** Prioritized list of issues waiting to be worked on  
**Velocity:** Measure of how much work a team completes per sprint  
**Cycle Time:** Time from start to finish for a single issue  
**PRD:** Product Requirements Document  
**RFC:** Request for Comments (technical design doc)  
**Definition of Done:** Criteria that must be met for issue to be considered complete

### Recommended Reading

- *The Lean Startup* by Eric Ries (build-measure-learn loop)
- *Inspired* by Marty Cagan (product management best practices)
- *Accelerate* by Nicole Forsgren (metrics for high-performing teams)
- *Shape Up* by Basecamp (alternative to sprints - worth understanding)

### Document Control

**Review Cycle:** Quarterly (process improvements)  
**Approvers:** Engineering Manager, Product Manager  
**Distribution:** All team members  
**Classification:** Internal

### Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | [PLACEHOLDER] | [PLACEHOLDER] | Initial project management framework |

---

*This project management framework is a living document. As we grow and learn, we'll iterate on these processes. Feedback welcome in `#engineering` or in retros.*
