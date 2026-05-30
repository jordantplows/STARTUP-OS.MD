# Meeting Cadence

**Version:** 1.0  
**Last Updated:** [PLACEHOLDER - Date]  
**Owner:** [PLACEHOLDER - COO / Head of Operations]  
**Status:** Active

## Overview

This document defines the meeting rhythms, cadences, and recurring events for [PLACEHOLDER - Company Name] across daily, weekly, monthly, and quarterly time horizons. It balances the need for alignment and collaboration with protecting maker time and avoiding meeting overload.

### Purpose

- Establish predictable rhythms for communication and decision-making
- Ensure cross-functional alignment without excessive meetings
- Protect deep work time for individual contributors
- Create forums for strategic discussion, tactical execution, and team building
- Set clear expectations for attendance, preparation, and outcomes

### Meeting Philosophy

**[PRINCIPLE]** Default to asynchronous. Meetings are for real-time collaboration, decision-making, and relationship-building - not status updates.

**[PRINCIPLE]** Every meeting must have an agenda, facilitator, notes doc, and clear outcomes. If it doesn't, cancel it.

**[PRINCIPLE]** Respect maker time. Engineers, designers, and writers need 4-hour blocks for deep work. Schedule meetings in clusters (e.g., afternoons) to preserve mornings.

**[POLICY]** Meeting-free time blocks:
- **No-Meeting Tuesdays & Thursdays:** 9 AM - 12 PM (maker time)
- **No-Meeting Fridays:** After 4 PM (wrap-up and focus time)
- **No-Meeting Weekends:** Respect work-life balance

**[POLICY]** Meeting defaults:
- 25-minute meetings (not 30) and 50-minute meetings (not 60) to allow for breaks
- Record all meetings and post recordings + notes to Notion
- Optional attendance unless explicitly required
- Start on time, end on time (no "let's wait for everyone")

---

## Meeting Rhythms Overview

| Cadence | Meeting Type | Duration | Participants | Purpose |
|---------|--------------|----------|--------------|---------|
| **Daily** | Async Standup | 5 min (async) | Engineering, Product | Progress updates, blockers |
| **Weekly** | Sprint Planning | 30 min | Eng, Product, Design | Commit to week's work |
| **Weekly** | Sprint Demo | 30 min | All teams + stakeholders | Show what shipped |
| **Weekly** | Sprint Retro | 30 min | Eng, Product, Design | Continuous improvement |
| **Weekly** | Leadership Team Sync | 50 min | CEO, CTO, CPO, CFO, etc. | Strategic alignment |
| **Bi-Weekly** | 1-on-1s | 30 min | Manager + Direct Report | Career, feedback, support |
| **Bi-Weekly** | Product Design Review | 50 min | Product, Design, Eng Leads | Review designs for upcoming work |
| **Monthly** | All-Hands | 50 min | Entire company | Company updates, wins, AMA |
| **Monthly** | Department All-Hands | 30 min | Department teams | Department-specific updates |
| **Monthly** | Customer Advisory Board | 50 min | Exec team + select customers | Product feedback, roadmap input |
| **Quarterly** | OKR Planning | 2 hours | Leadership team | Set OKRs for next quarter |
| **Quarterly** | Board Meeting | 2 hours | CEO, CFO + Board | Financial review, strategic updates |
| **Quarterly** | Quarterly Business Review | 3 hours | Leadership + Department Heads | Deep dive on metrics, planning |
| **Annual** | Offsite / Retreat | 2 days | Entire company | Strategic planning, team building |

---

## Daily Rhythms

### Async Standup (Daily, Posted by 10:00 AM)

**Purpose:** Share progress, surface blockers, maintain team visibility

**Cadence:** Monday - Friday, posted in Slack `#standups` channel by 10:00 AM

**Participants:** Engineering, Product, Design (async written updates)

**Format:** Automated via Geekbot Slack bot

**Template:**
```
Yesterday: [What did you ship or make progress on?]
Today: [What are you working on today?]
Blockers: [Anything blocking your progress?]
```

**Best Practices:**
- Keep it concise (3-5 bullets)
- Link to Linear issues or PRs
- If blocked, tag relevant person who can help
- Read teammates' updates (stay informed)

**No meeting required.** All async.

**[CROSS-REFERENCE]** See `/08-operations/project-management.md` for full standup details.

---

## Weekly Rhythms

### Sprint Planning (Monday, 9:00 AM, 30 min)

**Purpose:** Commit to work for the upcoming sprint, clarify requirements, identify blockers

**Cadence:** Every Monday, 9:00 AM

**Participants:**
- **Required:** Engineering team, Product Manager, Engineering Manager
- **Optional:** Designer (if design-heavy sprint)

**Facilitator:** Rotates between Product Manager and Engineering Manager

**Agenda:**
1. Review sprint goal (5 min)
2. Walk through prioritized backlog (10 min)
3. Estimate & commit to issues (10 min)
4. Identify dependencies and blockers (3 min)
5. Assign issues (2 min)

**Pre-Work:**
- Product Manager refines backlog and writes acceptance criteria
- Team reviews top issues before meeting

**Outcomes:**
- Sprint goal set in Linear
- Issues assigned and moved to "Todo"
- Team aligned on priorities

**Notes:** Saved to Notion, linked from Linear sprint

**[CROSS-REFERENCE]** See `/08-operations/project-management.md` for full sprint planning details.

### Sprint Demo (Friday, 2:00 PM, 30 min)

**Purpose:** Show what was shipped this sprint, gather feedback, celebrate wins

**Cadence:** Every Friday, 2:00 PM

**Participants:**
- **Required:** Engineering, Product, Design
- **Invited:** Sales, Customer Success, Marketing, Exec team (optional attendance)

**Facilitator:** Product Manager

**Agenda:**
1. Review sprint goal (2 min)
2. Live demos of shipped features (20 min)
3. Bugs fixed & tech debt (5 min)
4. Sprint metrics (completion rate, velocity) (3 min)

**Best Practices:**
- Demo in production (not staging, not localhost)
- Show user value, not code
- Keep demos short (2-3 min each)

**Outcomes:**
- Recording posted to Slack `#wins`
- Feedback captured in Linear or product backlog

**Notes:** Demo recording + summary in Notion

### Sprint Retrospective (Friday, 3:00 PM, 30 min)

**Purpose:** Reflect on what went well, what didn't, and commit to improvements

**Cadence:** Every Friday, 3:00 PM (immediately after demo)

**Participants:**
- **Required:** Engineering team, Product Manager
- **Optional:** Designer

**Facilitator:** Rotates weekly among team members

**Format:** Retro board (Notion template or Retrium)

**Agenda:**
1. Set the stage (3 min)
2. Gather data: What went well / What didn't / Ideas (10 min)
3. Vote on themes (5 min)
4. Discuss top 2-3 themes (10 min)
5. Commit to 1-2 action items (2 min)

**Outcomes:**
- Retro notes in Notion
- Action items created in Linear (label: `retro-action`)
- Action items reviewed at next sprint planning

**Best Practices:**
- Keep it blameless
- Make action items specific and measurable
- Don't commit to more than 2 action items

**[CROSS-REFERENCE]** See `/08-operations/project-management.md` for full retro format.

### Leadership Team Sync (Monday, 1:00 PM, 50 min)

**Purpose:** Strategic alignment, cross-functional coordination, decision-making

**Cadence:** Every Monday, 1:00 PM

**Participants:**
- **Required:** CEO, CTO, CPO (or Head of Product), CFO (or Head of Finance), Head of Sales, Head of Customer Success
- **Optional:** COO, Head of Marketing (as needed)

**Facilitator:** CEO

**Agenda:**
1. **Wins & Updates (10 min):** Each leader shares 1-2 key wins from last week
2. **Metrics Review (10 min):** 
   - Revenue (MRR, ARR, pipeline)
   - Product (usage, activation, retention)
   - Operations (burn rate, runway, hiring)
3. **Discussion Topics (25 min):** 
   - Strategic decisions (pricing, product direction, go-to-market)
   - Cross-functional coordination (e.g., product launch, new customer onboarding)
   - Blockers and escalations
4. **Action Items & Commitments (5 min):** Assign owners and due dates

**Pre-Work:**
- Each leader submits 1-2 discussion topics by Sunday evening
- CEO prioritizes agenda and shares by Monday morning

**Outcomes:**
- Decisions documented in Notion
- Action items tracked in Linear (with label `leadership-action`)
- Key updates shared in `#general` Slack

**Notes:** Saved to Notion `/leadership/weekly-syncs/`

**Best Practices:**
- No status updates - those go in Slack or Notion async
- Focus on decisions and alignment
- Timebox discussions (use "parking lot" for deeper dives)

---

## Bi-Weekly Rhythms

### 1-on-1s (Bi-Weekly, 30 min)

**Purpose:** Career development, feedback, coaching, support, relationship-building

**Cadence:** Every 2 weeks (managers schedule with each direct report)

**Participants:** Manager + Direct Report

**Facilitator:** Manager (but direct report drives agenda)

**Format:** Private, confidential conversation

**Agenda (Flexible):**
1. **Check-in (5 min):** How are you feeling? What's on your mind?
2. **Progress & Priorities (10 min):** 
   - What are you working on? Any blockers?
   - How is sprint going?
3. **Growth & Development (10 min):**
   - What are you learning?
   - What skills do you want to develop?
   - Career goals and trajectory
4. **Feedback (5 min):**
   - What feedback do you have for me (manager)?
   - What feedback do I have for you?

**Best Practices:**
- Direct report owns agenda (add topics to shared Notion doc before meeting)
- Don't use for status updates (use standups for that)
- Build trust over time - this is a safe space
- Take notes in shared Notion doc (visible to both)

**Outcomes:**
- Action items for manager and/or direct report
- Clearer understanding of priorities and challenges
- Stronger manager-report relationship

**Notes:** Saved to private Notion doc (shared only between manager and report)

**[POLICY]** 1-on-1s are sacred - don't cancel unless absolutely necessary. If you must reschedule, do so immediately with a new time.

### Product Design Review (Bi-Weekly, Wednesday, 2:00 PM, 50 min)

**Purpose:** Review designs for upcoming features, gather feedback, align on user experience

**Cadence:** Every 2 weeks, Wednesday, 2:00 PM

**Participants:**
- **Required:** Designer, Product Manager, Engineering Lead(s)
- **Optional:** CEO, Head of Customer Success (for major features)

**Facilitator:** Designer

**Agenda:**
1. **Context (5 min):** Recap problem statement and user needs (from PRD)
2. **Design Walkthrough (20 min):** Designer presents wireframes and high-fidelity mocks
3. **Feedback & Discussion (20 min):** 
   - User experience and flow
   - Edge cases and error states
   - Technical feasibility
4. **Next Steps (5 min):** What needs to be revised? When is design final?

**Pre-Work:**
- Designer shares Figma link 24 hours before meeting
- Participants review async and add comments in Figma

**Outcomes:**
- Design feedback captured in Figma comments
- Design approved or revision plan set
- Engineering has clarity to start implementation

**Notes:** Summary in Notion, linked from PRD

**Best Practices:**
- Critique the design, not the designer (blameless, constructive)
- Focus on user needs, not personal preferences
- Engineering should flag technical concerns early

---

## Monthly Rhythms

### All-Hands (First Friday of Month, 11:00 AM, 50 min)

**Purpose:** Company-wide updates, celebrate wins, foster transparency and culture

**Cadence:** First Friday of each month, 11:00 AM

**Participants:**
- **Required:** Entire company (all employees)
- **Invited:** Board members, advisors (optional)

**Facilitator:** CEO

**Agenda:**
1. **Wins & Milestones (10 min):**
   - Product launches, customer wins, revenue milestones
   - Team spotlights (recognize individuals/teams for great work)
2. **Metrics & Business Update (10 min):**
   - MRR/ARR, customer count, runway
   - Key product metrics (usage, retention)
   - Hiring and team growth
3. **Roadmap & Priorities (10 min):**
   - What are we building this month/quarter?
   - Why does it matter?
4. **Department Updates (10 min):**
   - Quick updates from Sales, Product, Engineering, Customer Success
5. **AMA (Ask Me Anything) (10 min):**
   - Open Q&A with CEO
   - Submit questions via Slido (anonymous option)

**Pre-Work:**
- Department heads submit slides by Thursday evening
- CEO reviews and compiles deck

**Outcomes:**
- Entire company aligned on priorities and progress
- Transparent view of business health
- Culture of celebration and recognition

**Notes & Recording:**
- Deck saved to Notion `/company/all-hands/`
- Recording posted to Notion (for remote team and future hires)

**Best Practices:**
- Keep it upbeat and positive (celebrate wins)
- Be transparent about challenges (build trust)
- Encourage questions (psychological safety)

**[POLICY]** All-Hands is mandatory attendance. If you must miss, watch the recording and post questions in Slack.

### Department All-Hands (Monthly, 30 min)

**Purpose:** Department-specific updates, deep dives, team alignment

**Cadence:** Monthly (scheduled by each department head)

**Participants:** Department team members

**Examples:**

**Engineering All-Hands:**
- Architecture updates and tech debt roadmap
- Security and infrastructure priorities
- Engineering metrics (deployment frequency, MTTR, cycle time)
- Shoutouts and technical wins

**Sales All-Hands:**
- Pipeline review and forecast
- Win/loss analysis
- Sales process and playbook updates
- Quota attainment and leaderboard

**Customer Success All-Hands:**
- Customer health scores and churn analysis
- Product feedback themes
- Success stories and renewals
- Support metrics (response time, CSAT)

**Facilitator:** Department Head

**Outcomes:**
- Team aligned on department-specific priorities
- Forum for department-specific discussions

**Notes:** Saved to Notion in department workspace

### Customer Advisory Board (CAB) (Monthly, Last Thursday, 3:00 PM, 50 min)

**Purpose:** Gather product feedback from customers, share roadmap, build relationships

**Cadence:** Last Thursday of each month, 3:00 PM

**Participants:**
- **Internal (Required):** CEO, CPO, Product Manager, Head of Customer Success
- **Internal (Optional):** Engineering Lead, Designer
- **External:** 5-8 select customers (rotates quarterly)

**Facilitator:** Head of Product

**Agenda:**
1. **Welcome & Intros (5 min)**
2. **Product Update (10 min):** What shipped this month
3. **Roadmap Preview (10 min):** What's coming in next 3 months
4. **Discussion Topic (20 min):** Deep dive on one area (e.g., "How do you think about integrations?")
5. **Open Feedback (5 min):** What else is on your mind?

**Pre-Work:**
- Product Manager prepares deck with roadmap
- Customer Success reaches out to CAB members to gather topics

**Outcomes:**
- Product feedback captured in Notion
- Customer insights inform roadmap prioritization
- Stronger customer relationships

**Notes:** Summary in Notion `/product/customer-advisory-board/`

**Best Practices:**
- Rotate CAB members quarterly (mix of segments, personas)
- Send NDA if discussing pre-release features
- Follow up on feedback (close the loop)

---

## Quarterly Rhythms

### OKR Planning (First Week of Quarter, 2 hours)

**Purpose:** Set company and team OKRs for the upcoming quarter

**Cadence:** First week of each quarter (Q1 = January, Q2 = April, Q3 = July, Q4 = October)

**Participants:**
- **Required:** CEO, CTO, CPO, CFO, Department Heads
- **Optional:** Senior ICs (for input)

**Facilitator:** CEO

**Agenda:**
1. **Review Last Quarter (30 min):**
   - Score previous quarter's OKRs (0-1.0 scale)
   - What did we learn? What surprised us?
2. **Set Company OKRs (60 min):**
   - 3-5 company-level Objectives
   - 2-4 Key Results per Objective
   - Draft and iterate live
3. **Set Team OKRs (30 min):**
   - Each department drafts 1-2 OKRs aligned to company OKRs
   - Review for alignment and feasibility

**Pre-Work:**
- CEO drafts proposed company OKRs
- Department Heads review and provide feedback async

**Outcomes:**
- Company OKRs finalized and documented in Notion
- Team OKRs aligned to company OKRs
- Shared in All-Hands and Slack

**Notes:** OKRs saved to Notion `/company/okrs/`

**[CROSS-REFERENCE]** See `/08-operations/okrs.md` for full OKR framework.

**Best Practices:**
- OKRs are ambitious (60-70% success is good)
- Key Results are measurable (numbers, not feelings)
- OKRs cascade: company → team → individual

### Board Meeting (Quarterly, 2 hours)

**Purpose:** Update board on financial performance, strategy, and key decisions

**Cadence:** Quarterly (typically 4-6 weeks after quarter end)

**Participants:**
- **Required:** CEO, CFO, Board Members
- **Optional:** CTO, CPO (for deep dives on product/tech)

**Facilitator:** CEO

**Agenda:**
1. **Business Update (30 min):**
   - Revenue, ARR, pipeline, burn rate, runway
   - Customer metrics (new logos, churn, NRR)
   - Product highlights
2. **Strategic Discussion (60 min):**
   - Key decisions requiring board input (e.g., fundraising, M&A, pricing)
   - Market landscape and competitive analysis
   - Long-term strategy and vision
3. **Functional Deep Dive (20 min):**
   - Rotates quarterly (e.g., Q1 = Product, Q2 = Sales, Q3 = Engineering)
4. **Executive Session (10 min):** Board only (CEO steps out)

**Pre-Work:**
- CFO prepares board deck (sent 48 hours before meeting)
- CEO and CFO conduct pre-read call with board members

**Outcomes:**
- Board approval on key decisions
- Strategic guidance and feedback
- Updated cap table and financial projections (if applicable)

**Notes:** Board deck and minutes saved to secure shared drive (e.g., Google Drive with restricted access)

**Best Practices:**
- Be transparent about challenges (board is there to help)
- Ask for specific input (not just updates)
- Keep deck concise (15-20 slides max)

### Quarterly Business Review (QBR) (Last Week of Quarter, 3 hours)

**Purpose:** Deep dive on business metrics, strategic planning, and cross-functional alignment

**Cadence:** Last week of each quarter

**Participants:**
- **Required:** Leadership team (CEO, CTO, CPO, CFO, Department Heads)
- **Optional:** Senior ICs (managers, leads)

**Facilitator:** CEO + CFO

**Agenda:**
1. **Quarter in Review (45 min):**
   - Metrics deep dive (revenue, product, operations)
   - OKR scoring and retrospective
   - Wins and lessons learned
2. **Strategic Initiatives (60 min):**
   - Review progress on annual strategic priorities
   - What's working? What's not?
   - Adjust strategy if needed
3. **Department Deep Dives (60 min):**
   - Each department presents: accomplishments, challenges, priorities for next quarter
4. **Planning for Next Quarter (15 min):**
   - High-level priorities and focus areas
   - Resource allocation and hiring plan

**Pre-Work:**
- Each department prepares slides (metrics, wins, challenges, asks)
- CFO compiles financial dashboard

**Outcomes:**
- Shared understanding of business health
- Strategic alignment for next quarter
- Cross-functional commitments and dependencies

**Notes:** QBR deck saved to Notion `/company/qbr/`

**Best Practices:**
- Focus on insights, not just data (so what?)
- Surface challenges early (ask for help)
- Celebrate wins as a team

---

## Annual Rhythms

### Annual Offsite / Retreat (1-2 days)

**Purpose:** Strategic planning, vision-setting, team building, and culture strengthening

**Cadence:** Once per year (typically January or early Q1)

**Participants:** Entire company

**Facilitator:** CEO + Leadership Team

**Agenda (Example for 2-Day Offsite):**

**Day 1: Strategy & Vision**
1. **Year in Review (60 min):** Accomplishments, metrics, lessons learned
2. **Vision & Strategy (90 min):** Where are we going? How will we get there?
3. **Annual Planning (90 min):** Set annual goals and OKRs (company-level)
4. **Team Building Activity (2 hours):** Escape room, cooking class, volunteer project
5. **Team Dinner (evening)**

**Day 2: Execution & Culture**
1. **Department Breakouts (90 min):** Teams plan their roadmaps for the year
2. **Cross-Functional Collaboration (60 min):** How do we work better together?
3. **Culture & Values (60 min):** Reflect on company values, what's working, what's not
4. **Lightning Talks (60 min):** Team members share learnings, hobbies, or ideas
5. **Closing & Commitments (30 min):** Recap takeaways, commit to actions

**Outcomes:**
- Annual strategic plan and OKRs
- Stronger team relationships and trust
- Renewed energy and alignment

**Notes:** Offsite summary and photos in Notion `/company/offsite/`

**Best Practices:**
- Choose a location off-site (not office) for fresh perspective
- Balance work and play (don't make it all business)
- Include social time (dinners, activities)
- Invite remote team members in-person (cover travel costs)

---

## Meeting Best Practices

### Before the Meeting

**[CHECKLIST] Every Meeting Must Have:**
- ✅ Clear purpose and desired outcome
- ✅ Agenda (posted in calendar invite or Notion doc)
- ✅ Designated facilitator
- ✅ List of required vs. optional attendees
- ✅ Pre-work or pre-reads (if applicable)

**[POLICY]** If a meeting doesn't have an agenda 24 hours before, attendees may decline or request cancellation.

### During the Meeting

**[BEST PRACTICES]**
- ✅ Start on time (don't wait for latecomers)
- ✅ Record the meeting (Zoom auto-record for all meetings)
- ✅ Take notes in shared Notion doc (designate note-taker)
- ✅ Timebox discussions (use timer if needed)
- ✅ Capture action items with owners and due dates
- ✅ Use "parking lot" for off-topic discussions
- ✅ End on time (respect everyone's calendar)

**[POLICY]** Laptops closed unless you're the note-taker or need to reference something. Be present.

### After the Meeting

**[CHECKLIST] After Every Meeting:**
- ✅ Post recording to Notion (link from notes doc)
- ✅ Clean up notes and share with attendees (within 24 hours)
- ✅ Create action items in Linear (with owners and due dates)
- ✅ Share key decisions or updates in Slack (if relevant to broader team)

**[POLICY]** If action items aren't documented, they won't get done. Notes without action items are just history.

---

## Meeting Roles & Responsibilities

### Facilitator

**Responsibilities:**
- Prepare agenda and share in advance
- Start and end meeting on time
- Guide discussion and keep on track
- Ensure all voices are heard
- Capture action items and decisions
- Summarize outcomes at end

### Note-Taker

**Responsibilities:**
- Take notes in shared Notion doc during meeting
- Capture key decisions and action items (with owners and due dates)
- Clean up notes and share within 24 hours
- Post recording link in notes doc

**[TIP]** Rotate note-taker role weekly so it doesn't always fall on same person.

### Participants

**Responsibilities:**
- Review agenda and pre-work before meeting
- Come prepared with questions or input
- Be on time (or notify facilitator if you'll be late)
- Participate actively and respectfully
- Follow up on action items assigned to you

---

## Meeting Metrics & Optimization

### Meeting Audit (Quarterly)

**[INITIATIVE]** Every quarter, audit meeting load and effectiveness:

**Questions to Ask:**
1. What % of time does each role spend in meetings?
   - Target: ICs < 20%, Managers < 40%, Execs < 60%
2. Which meetings could be async (Slack, Loom, Notion)?
3. Which meetings could be shorter?
4. Which meetings could be less frequent?
5. Which meetings are no longer needed?

**[TOOL]** Use Clockwise or Reclaim.ai to analyze meeting load across team.

**[ACTION]** Cancel or modify meetings that don't meet effectiveness criteria.

### Meeting Effectiveness Survey (Quarterly)

**[SURVEY]** Send anonymous survey to team:
1. Which meetings do you find most valuable? (top 3)
2. Which meetings are least valuable? (bottom 3)
3. What meetings should we add, remove, or change?
4. How would you rate our overall meeting culture? (1-5 scale)

**[ACTION]** Review results in Leadership Team Sync and make adjustments.

---

## Special Meetings & Ad-Hoc Events

### Incident Postmortem (As Needed, 30 min)

**Purpose:** Blameless retrospective after production incident

**Timing:** Within 48 hours of incident resolution

**Participants:** Engineering team, Product Manager, anyone involved in incident response

**Facilitator:** Engineering Manager or on-call lead

**Agenda:**
1. Timeline of events
2. Root cause analysis
3. What went well? What didn't?
4. Action items to prevent recurrence

**Outcomes:** Postmortem doc in Notion, action items in Linear

**[CROSS-REFERENCE]** See `/docs/runbooks/incident-response.md` for postmortem template.

### Design Critique (As Needed, 30 min)

**Purpose:** Get feedback on early-stage designs or explorations

**Timing:** Ad-hoc (designer schedules when ready for feedback)

**Participants:** Designer, Product Manager, 2-3 engineers or stakeholders

**Facilitator:** Designer

**Format:** Informal, collaborative, exploratory

**Best Practices:**
- Critique is not review (this is earlier in process)
- Focus on big picture (not pixel-pushing)
- Encourage wild ideas and alternatives

### Customer Interviews / User Research (As Needed, 30-60 min)

**Purpose:** Understand user needs, gather feedback, validate assumptions

**Timing:** Ongoing (as part of product discovery)

**Participants:** Product Manager, Designer, optionally Engineer

**Facilitator:** Product Manager or Designer

**Format:** Semi-structured interview with customer

**Outcomes:** Research notes in Notion, insights inform roadmap

**[BEST PRACTICE]** Record interviews (with permission) and share clips with team to build empathy.

---

## Meeting Calendar Template

### Weekly View (Example)

**Monday:**
- 9:00 AM: Sprint Planning (30 min)
- 1:00 PM: Leadership Team Sync (50 min)

**Tuesday:**
- No meetings before 12 PM (maker time)
- 2:00 PM: 1-on-1s (rotating schedule)

**Wednesday:**
- 10:00 AM: Product Design Review (bi-weekly, 50 min)
- 2:00 PM: Available for ad-hoc meetings

**Thursday:**
- No meetings before 12 PM (maker time)
- 1:00 PM: Available for ad-hoc meetings

**Friday:**
- 2:00 PM: Sprint Demo (30 min)
- 3:00 PM: Sprint Retro (30 min)
- After 4 PM: No meetings (wrap-up time)

---

## Next Steps

### Immediate Actions (Month 0-1)

1. **Set Up Recurring Meetings**
   - Schedule all weekly, monthly, and quarterly meetings in team calendar
   - Create Zoom links and Notion docs for each recurring meeting
   - Assign facilitators and note-takers (rotating schedules)
   - Owner: [PLACEHOLDER - Head of Operations]
   - Due: [PLACEHOLDER - Date]

2. **Create Meeting Templates**
   - Sprint planning, demo, retro templates in Notion
   - 1-on-1 template (shared doc per manager-report pair)
   - All-Hands deck template
   - Board meeting deck template
   - Owner: [PLACEHOLDER - Head of Operations]
   - Due: [PLACEHOLDER - Date]

3. **Educate Team on Meeting Culture**
   - Share this document with all team members
   - Host 15-min "How We Meet" onboarding session
   - Add meeting best practices to employee handbook
   - Owner: [PLACEHOLDER - CEO / Head of Operations]
   - Due: [PLACEHOLDER - Date]

### Ongoing (Quarterly)

4. **Meeting Audit**
   - Analyze meeting load per role
   - Survey team on meeting effectiveness
   - Cancel or modify ineffective meetings
   - Owner: [PLACEHOLDER - Head of Operations]
   - Cadence: Quarterly

5. **Iterate on Cadences**
   - As company grows, meeting needs will change
   - Re-evaluate cadences (e.g., move from 1-week to 2-week sprints at scale)
   - Update this document with changes
   - Owner: [PLACEHOLDER - Leadership Team]
   - Cadence: Quarterly

---

## Appendix

### Glossary

**Cadence:** The regular rhythm or frequency of a recurring meeting  
**Maker Time:** Uninterrupted blocks of time for deep, focused work (4+ hours)  
**Async:** Asynchronous communication (not real-time, e.g., Slack, Notion, Loom)  
**Sync:** Synchronous communication (real-time, e.g., meetings, calls)  
**Facilitator:** Person responsible for running the meeting and keeping it on track  
**Parking Lot:** List of off-topic items to discuss later (don't derail current meeting)

### Tools for Meeting Management

**Scheduling:** Google Calendar, Calendly (for external meetings)  
**Video Conferencing:** Zoom (record all meetings, auto-upload to cloud)  
**Notes & Documentation:** Notion (single source of truth for all meeting notes)  
**Action Item Tracking:** Linear (all action items become Linear issues)  
**Async Standups:** Geekbot (Slack bot for daily updates)  
**Meeting Analytics:** Clockwise, Reclaim.ai (optimize calendar, protect focus time)

### Recommended Reading

- *It Doesn't Have to Be Crazy at Work* by Jason Fried & DHH (meeting culture)
- *Deep Work* by Cal Newport (importance of uninterrupted focus time)
- *The Surprising Science of Meetings* by Steven Rogelberg (meeting effectiveness research)

### Document Control

**Review Cycle:** Quarterly (adjust cadences as company grows)  
**Approvers:** CEO, COO, Head of Operations  
**Distribution:** All employees  
**Classification:** Internal

### Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | [PLACEHOLDER] | [PLACEHOLDER] | Initial meeting cadence framework |

---

*This meeting cadence is designed for our current stage (seed to Series A, 10-50 employees). As we scale, we'll iterate on these rhythms to match our needs. Feedback welcome - share in Leadership Team Sync or Slack `#operations`.*
