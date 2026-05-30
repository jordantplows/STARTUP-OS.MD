---
name: interview-kit
description: >
  Accepts role name input, generates interview kit: 12 values questions, 10 problem-solving
  questions, 8 culture questions, scorecard template, debrief structure, reference check
  script (10 questions). Writes to people/output/interview-kit-{role-slug}.md
allowed-tools: Read, Write, Edit, Bash
---

# Interview Kit Agent

## Context to load before writing

1. Read `CLAUDE.md` → extract Startup Profile (company values, mission, culture priorities).
2. Read `people/output/culture-doc.md` if it exists → align interview questions with operating principles.
3. Read `people/output/jd-{role-slug}.md` if it exists → ensure questions test required skills and outcomes.

## Input Parameters

When invoking this agent, accept:
- **Role name**: (e.g., "Senior Backend Engineer", "Product Marketing Manager")

## Interview Kit Structure

### 1. Values Questions (12 questions)

Generate 12 behavioral questions testing company values:

**Format for each question**:
- **Question**: Open-ended behavioral question ("Tell me about a time...")
- **What we're testing**: Which value/principle this assesses
- **Good answer signals**: 2-3 bullet points of what strong candidates say
- **Red flags**: 2-3 bullet points of concerning responses

**Example question structure**:

**Q: Tell me about a time you shipped something you weren't fully proud of. What happened next?**

**Testing**: Bias to action, ownership, learning from mistakes

**Good signals**:
- Explains tradeoffs (why shipping imperfect was right call)
- Takes ownership (doesn't blame team/manager)
- Describes what they learned and how they improved it

**Red flags**:
- Blames others ("My manager forced me...")
- No learning ("It was fine, no big deal")
- Perfectionism ("I would never ship something I wasn't proud of")

**12 values question themes**:
1. Bias to action (shipping fast vs. over-planning)
2. Ownership (taking responsibility vs. blaming)
3. Handling ambiguity (thriving in uncertainty)
4. Giving/receiving feedback (radical candor)
5. Disagreement (disagree and commit)
6. Failure/learning (growth mindset)
7. Prioritization (high-leverage work)
8. Collaboration (ego vs. team success)
9. First principles thinking (questioning assumptions)
10. Customer obsession (building for users, not ego)
11. Scrappiness (doing more with less)
12. Long-term thinking (short-term pain for long-term gain)

### 2. Problem-Solving Questions (10 questions, role-specific)

Generate 10 role-specific problem-solving questions:

**For Engineering**:
- System design (e.g., "Design a URL shortener with 10M requests/day")
- Debugging (e.g., "API latency spiked from 100ms to 2s — how do you investigate?")
- Tradeoffs (e.g., "SQL vs. NoSQL for user profiles — which and why?")
- Code review (provide code snippet, ask for feedback)
- Architecture (e.g., "How would you design real-time notifications for 1M users?")

**For Product**:
- Feature prioritization (e.g., "We have 10 feature requests and 1 engineer-month. What do you build?")
- User research (e.g., "How would you validate if users want Feature X?")
- Metrics (e.g., "Activation rate dropped 20% — how do you diagnose?")
- Roadmap (e.g., "You have 3 quarters to hit $1M ARR. What's your product strategy?")
- Stakeholder management (e.g., "CEO wants Feature Y, but users want Feature Z. How do you decide?")

**For Sales**:
- Objection handling (e.g., "Prospect says 'too expensive' — how do you respond?")
- Discovery (e.g., "Walk me through your discovery call process")
- Closing (e.g., "Deal has stalled for 3 weeks — how do you unblock?")
- Competitive (e.g., "Prospect is evaluating us vs. Competitor X — how do you position?")
- Demo (e.g., "Mock demo: I'm [persona], show me why I should buy")

**For Marketing**:
- Campaign strategy (e.g., "We have $10K budget and 3 months to get 100 SQLs. What do you do?")
- Messaging (e.g., "Write 3 subject lines for launch email")
- Channel mix (e.g., "SEO vs. paid ads vs. content — where would you invest?")
- Experimentation (e.g., "Landing page converts at 2% — how do you improve it?")
- Attribution (e.g., "How do you measure content marketing ROI?")

**Format for each question**:
- **Question**: The problem or scenario
- **What we're testing**: Technical depth, product thinking, sales IQ, etc.
- **Strong answer**: What good candidates do (framework, questions they ask, approach)
- **Weak answer**: What weak candidates do (jump to solution, miss context, no structure)

### 3. Culture Fit Questions (8 questions)

Generate 8 questions testing cultural alignment:

**Themes**:
1. Work style (individual vs. team, structured vs. chaotic)
2. Motivation (money, impact, learning, autonomy)
3. Feedback (how they give/receive it)
4. Disagreement (conflict style)
5. Startup fit (why leave [big tech / stable job] for startup chaos)
6. Long-term goals (what they want in 3-5 years)
7. Failure tolerance (how they handle setbacks)
8. Remote work (if applicable — how they stay productive async)

**Example**:

**Q: Why are you leaving your current job / last role?**

**Testing**: Motivation, red flags (running from problems vs. running toward opportunity)

**Good signals**:
- Specific about what they want (learning, ownership, impact)
- Balanced (acknowledges what was good about last role, what they're looking for next)
- Forward-looking ("I want to..." vs. "I hated...")

**Red flags**:
- Only negative ("My manager was terrible, company was toxic")
- Vague ("Looking for a change")
- Money-only ("They weren't paying enough")

### 4. Scorecard Template

Create a structured scorecard for interviewers to fill out:

**Format**:
- **Candidate name**:
- **Role**:
- **Interviewer**:
- **Interview type**: (Values / Technical / Culture Fit / Founder Call)
- **Date**:

**Scores** (1-4 scale):
1. **Strong No**: Would not hire
2. **No**: Concerns outweigh strengths
3. **Yes**: Would hire (meets bar)
4. **Strong Yes**: Exceptional, top 10% of candidates

**Evaluation criteria** (score each 1-4):
- [ ] **Role skills**: Can they do the job? (technical, product, sales, etc.)
- [ ] **Culture fit**: Do they align with our values?
- [ ] **Communication**: Can they explain complex ideas clearly?
- [ ] **Ownership**: Do they take responsibility vs. blame others?
- [ ] **Learning**: Do they grow from mistakes?
- [ ] **Collaboration**: Will they work well with team?

**Overall recommendation**: [ ] Strong No / [ ] No / [ ] Yes / [ ] Strong Yes

**Detailed feedback**:
- What stood out (positive)?
- What concerns you?
- Anything to probe in next round?

**Decision rule**: 
- Hire if: 3+ interviewers give "Yes" or "Strong Yes", AND no "Strong No"
- No hire if: Any "Strong No", OR <3 "Yes"

### 5. Debrief Structure

Outline how the hiring team should run the debrief meeting:

**Debrief Process** (30 min meeting after final interview):

1. **Round-robin scores** (5 min): Each interviewer shares score first (Strong No / No / Yes / Strong Yes) without explanation
   - Why score first: Avoids groupthink (senior person speaking first sways others)

2. **Concerns first** (10 min): Start with "No" or "Strong No" voters — what are the red flags?
   - Address concerns before getting excited about strengths

3. **Strengths** (10 min): "Yes" or "Strong Yes" voters — what stood out?

4. **Decide** (5 min): Hiring manager makes final call (not a vote — they own the decision)
   - If split decision: Hiring manager can request one more interview (e.g., "Let's have them do a working session")

**Who's in the debrief**:
- Hiring manager (decision-maker)
- All interviewers (values, technical, culture, founder)
- Recruiter (takes notes, schedules next steps)

**No-hire default**: If team is split 50/50 → default to "No" (we're optimizing for false negatives, not false positives)

### 6. Reference Check Script (10 questions)

Generate a reference check script:

**When to do references**: After verbal offer, before formal offer (not before — wastes candidate's time)

**Who to call**: Ask candidate for 3 references:
- 1 manager (ideally most recent)
- 1 peer (someone they worked closely with)
- 1 direct report (if they've managed people)

**Script**:

**Intro**: "Hi [Reference Name], I'm [Your Name] from [Company]. [Candidate] has applied for [Role], and they listed you as a reference. Do you have 15 minutes to chat?"

**Questions** (10 questions):

1. **How do you know [Candidate]? What was your working relationship?**
   - (Verify they actually worked together; skip rest if they didn't)

2. **What were [Candidate]'s responsibilities?**
   - (Verify resume accuracy)

3. **What are [Candidate]'s greatest strengths?**
   - (Listen for alignment with role needs)

4. **If you had to name one area for growth or development, what would it be?**
   - (Everyone has weaknesses — vague answer is a red flag)

5. **Can you give an example of a project [Candidate] led? What was the outcome?**
   - (Test for ownership and impact)

6. **How does [Candidate] handle feedback or criticism?**
   - (Test for growth mindset)

7. **How does [Candidate] work under pressure or tight deadlines?**
   - (Startup life is chaotic — do they thrive or crumble?)

8. **Would you hire [Candidate] again if you had the chance?**
   - (The only question that matters — listen for hesitation)

9. **On a scale of 1-10, how would you rate [Candidate]'s performance at your company?**
   - (8+ is good; <7 is concerning)

10. **Is there anything else I should know, or anyone else I should talk to?**
    - (Open-ended — sometimes surfaces surprises)

**Red flags**:
- ❌ Reference hesitates on "Would you hire them again?" (even if they say yes, hesitation = no)
- ❌ Can't name a specific project or impact (they were forgettable)
- ❌ Overemphasis on "nice" or "team player" (code for mediocre performer)
- ❌ Vague answers to "area for growth" (hiding something)

## Output Format

Write to: `people/output/interview-kit-{role-slug}.md`

Structure:
```markdown
# Interview Kit: [Role Name]

**Role**: [Role Name]  
**Hiring Manager**: [Name]  
**Target Start Date**: [Date]

---

## Interview Process Overview

1. **Recruiter screen** (30 min) → Values + logistics
2. **Hiring manager** (45 min) → Experience + role expectations
3. **[Role-specific interview]** (90 min) → Technical/product/sales assessment
4. **Team fit** (45 min) → Culture + collaboration
5. **Founder call** (30 min) → Vision + strategy
6. **Debrief** (30 min) → Hiring team decision
7. **References** (3 calls, 15 min each) → Verify past performance

---

## Part 1: Values Questions (12 Questions)

### Question 1: [Question text]

**Testing**: [Value or principle]

**Good signals**:
- [Signal 1]
- [Signal 2]
- [Signal 3]

**Red flags**:
- [Red flag 1]
- [Red flag 2]

---

[Repeat for all 12 values questions]

---

## Part 2: Problem-Solving Questions (10 Questions)

### Question 1: [Question text]

**Testing**: [Skill or competency]

**Strong answer**:
- [What good candidates do]
- [Framework they use]
- [Questions they ask]

**Weak answer**:
- [What weak candidates do]
- [Mistakes they make]

---

[Repeat for all 10 problem-solving questions]

---

## Part 3: Culture Fit Questions (8 Questions)

### Question 1: [Question text]

**Testing**: [Cultural attribute]

**Good signals**:
- [Signal 1]
- [Signal 2]

**Red flags**:
- [Red flag 1]
- [Red flag 2]

---

[Repeat for all 8 culture questions]

---

## Part 4: Interview Scorecard

**Candidate Name**:  
**Role**:  
**Interviewer**:  
**Interview Type**: [ ] Values / [ ] Technical / [ ] Culture Fit / [ ] Founder  
**Date**:

### Scores (1-4 scale)

1 = Strong No | 2 = No | 3 = Yes | 4 = Strong Yes

- [ ] **Role skills**: Can they do the job? [1 / 2 / 3 / 4]
- [ ] **Culture fit**: Align with our values? [1 / 2 / 3 / 4]
- [ ] **Communication**: Explain ideas clearly? [1 / 2 / 3 / 4]
- [ ] **Ownership**: Take responsibility vs. blame? [1 / 2 / 3 / 4]
- [ ] **Learning**: Grow from mistakes? [1 / 2 / 3 / 4]
- [ ] **Collaboration**: Work well with team? [1 / 2 / 3 / 4]

### Overall Recommendation

[ ] **Strong No** — Would not hire  
[ ] **No** — Concerns outweigh strengths  
[ ] **Yes** — Would hire (meets bar)  
[ ] **Strong Yes** — Exceptional, top 10%

### Detailed Feedback

**What stood out (positive)?**

**What concerns you?**

**Anything to probe in next round?**

---

## Part 5: Debrief Structure

**When**: After final interview (founder call), before offer

**Who attends**:
- Hiring manager (decision-maker)
- All interviewers (values, technical, culture, founder)
- Recruiter (note-taker)

**Agenda** (30 min):

### 1. Round-robin scores (5 min)

Each interviewer shares score FIRST (without explanation):
- [Interviewer 1]: Strong No / No / Yes / Strong Yes
- [Interviewer 2]: Strong No / No / Yes / Strong Yes
- [Interviewer 3]: Strong No / No / Yes / Strong Yes
- [Interviewer 4]: Strong No / No / Yes / Strong Yes

**Why score first?** Avoids groupthink (senior person speaking first sways others).

### 2. Concerns first (10 min)

Start with "No" or "Strong No" voters:
- What are the red flags?
- What would need to change to flip your vote?

### 3. Strengths (10 min)

"Yes" or "Strong Yes" voters:
- What stood out?
- Why are you excited about this person?

### 4. Decision (5 min)

Hiring manager makes final call:
- **Hire if**: 3+ interviewers give "Yes" or "Strong Yes", AND no "Strong No"
- **No hire if**: Any "Strong No", OR <3 "Yes"
- **If split 50/50**: Default to "No" (optimizing for false negatives, not false positives)

**Next steps**:
- If hire: Recruiter schedules references, prepares offer
- If no hire: Recruiter sends rejection email within 24 hours

---

## Part 6: Reference Check Script

**When**: After verbal offer, before formal offer

**Who to call**: Ask candidate for 3 references:
- 1 manager (ideally most recent)
- 1 peer (worked closely with)
- 1 direct report (if they've managed)

**Script**:

**Intro**: "Hi [Reference Name], I'm [Your Name] from [Company]. [Candidate] has applied for [Role], and they listed you as a reference. Do you have 15 minutes?"

### Questions (10 total)

1. **How do you know [Candidate]? What was your working relationship?**
   - (Verify they worked together)

2. **What were [Candidate]'s responsibilities?**
   - (Verify resume accuracy)

3. **What are [Candidate]'s greatest strengths?**
   - (Alignment with role needs?)

4. **If you had to name one area for growth, what would it be?**
   - (Everyone has weaknesses — vague = red flag)

5. **Can you give an example of a project [Candidate] led? What was the outcome?**
   - (Ownership + impact?)

6. **How does [Candidate] handle feedback or criticism?**
   - (Growth mindset?)

7. **How does [Candidate] work under pressure or tight deadlines?**
   - (Startup chaos — do they thrive?)

8. **Would you hire [Candidate] again if you had the chance?**
   - (The only question that matters — listen for hesitation)

9. **On a scale of 1-10, how would you rate [Candidate]'s performance?**
   - (8+ = good; <7 = concerning)

10. **Is there anything else I should know?**
    - (Open-ended — surfaces surprises)

### Red Flags

- ❌ Hesitation on "Would you hire them again?" (even if yes, hesitation = no)
- ❌ Can't name specific project/impact (forgettable)
- ❌ Overemphasis on "nice" or "team player" (code for mediocre)
- ❌ Vague on "area for growth" (hiding something)

---

## Decision Rules

**Hire if**:
- 3+ interviewers give "Yes" or "Strong Yes"
- No "Strong No" votes
- References confirm performance (8+/10 rating)

**No hire if**:
- Any interviewer gives "Strong No"
- <3 "Yes" votes
- References hesitate or rate <7/10
- Gut feeling is "meh" (if you're not excited, it's a no)

**Default to "No"**: When in doubt, don't hire. Bad hires cost 6-12 months of productivity + morale damage.
```

## Writing Rules

1. **12 values questions** — Each with "Testing," "Good signals," "Red flags."
2. **10 problem-solving questions** — Role-specific (eng = system design, product = prioritization, sales = objection handling).
3. **8 culture questions** — Test work style, motivation, feedback, disagreement, startup fit.
4. **Scorecard** — 1-4 scale (Strong No / No / Yes / Strong Yes), 6 evaluation criteria.
5. **Debrief structure** — Score first (avoid groupthink), concerns first, decide (hiring manager owns decision).
6. **Reference check script** — 10 questions, with red flags clearly listed.

## Cross-References

- Link to `culture-doc.md` for values and operating principles (align interview questions)
- Link to `jd-{role-slug}.md` for role requirements (ensure questions test required skills)
- Link to `onboarding-playbook.md` for what happens after hire (set expectations)

## After completion

1. Verify 12 values questions, 10 problem-solving questions, 8 culture questions.
2. Ensure scorecard has 1-4 scale and 6 evaluation criteria.
3. Confirm debrief structure includes "score first" and "concerns first."
4. Write output to `people/output/interview-kit-{role-slug}.md`.
