# Feature Prioritization Framework

> A systematic approach to deciding what to build, when to build it, and why.

---

## Overview

This document provides frameworks and guidelines for prioritizing features, balancing customer needs with business goals and technical constraints. Use it to:

- Make objective prioritization decisions based on data, not opinions
- Communicate trade-offs clearly to stakeholders
- Ensure scarce engineering resources focus on highest-impact work
- Say "no" with conviction to good ideas that aren't the right priority

**Related documents:**
- `product-spec.md` - Features under consideration for prioritization
- `mvp-roadmap.md` - Timeline for prioritized features
- `user-personas.md` - Customer needs that inform prioritization
- `success-metrics.md` - Metrics to evaluate feature impact

---

## Prioritization Philosophy

### Core Principles

1. **Customer pain, not feature requests** - Build what solves the biggest problems, not what customers ask for
2. **Outcomes over outputs** - Measure success by impact (usage, retention, revenue), not features shipped
3. **Learn fast, iterate faster** - Ship small, measure, learn, adjust
4. **Focus beats breadth** - Better to solve one problem excellently than three problems poorly
5. **Data > Opinions** - Use frameworks and data to overcome HiPPO (Highest Paid Person's Opinion)

### What Good Prioritization Looks Like

**Good prioritization:**
- Aligned with company strategy and stage
- Based on evidence (customer research, usage data, market insights)
- Balances short-term wins with long-term bets
- Says "no" to 90% of ideas to say "yes" to the right 10%
- Transparent - stakeholders understand why decisions were made

**Bad prioritization:**
- Feature-driven ("Let's build X") without understanding problem
- Reactive to loudest voice (squeaky wheel gets oil)
- FOMO-driven (competitor has it, so we need it)
- Ego-driven (founder's pet project)
- Spreadsheet-driven (blindly following a framework without context)

---

## Primary Framework: RICE

**What it is:**  
RICE is a scoring model that balances impact, confidence, and effort to produce a single priority score.

**When to use:**  
- Comparing features within the same epic or theme
- Quarterly roadmap planning
- When you have 10-50 features to prioritize

**RICE = (Reach × Impact × Confidence) / Effort**

---

### Reach: How many users will this impact?

**Scale:** Number of users per time period (e.g., users per quarter)

**How to estimate:**

- **For existing features:** Use analytics data (how many users use similar feature)
- **For new features:** Estimate based on target persona size and adoption rate

**Examples:**

| Feature | Reach | Explanation |
|---------|-------|-------------|
| [PLACEHOLDER: E.g., "Real-time forecast dashboard"] | [PLACEHOLDER: E.g., "1,000 users/quarter"] | [PLACEHOLDER: E.g., "All Sales Directors and CROs (our primary personas) will use this daily"] |
| [PLACEHOLDER: E.g., "Slack integration for notifications"] | [PLACEHOLDER: E.g., "300 users/quarter"] | [PLACEHOLDER: E.g., "Only ~30% of customers use Slack, and only ~50% of those will enable notifications"] |
| [PLACEHOLDER: E.g., "Advanced custom reporting"] | [PLACEHOLDER: E.g., "100 users/quarter"] | [PLACEHOLDER: E.g., "Power user feature - only RevOps/analysts will use, not typical Sales Directors"] |

---

### Impact: How much will this improve the user experience?

**Scale:** 0.25 (minimal) → 0.5 (low) → 1.0 (medium) → 2.0 (high) → 3.0 (massive)

**How to estimate:**

- **3.0 (Massive):** Solves a top-3 pain point, creates "must have" experience
- **2.0 (High):** Solves an important problem, significant value add
- **1.0 (Medium):** Noticeable improvement, nice to have
- **0.5 (Low):** Minor improvement, removes small friction
- **0.25 (Minimal):** Barely noticeable, edge case

**Examples:**

| Feature | Impact | Explanation |
|---------|--------|-------------|
| [PLACEHOLDER: E.g., "Real-time forecast dashboard"] | [PLACEHOLDER: E.g., "3.0 (Massive)"] | [PLACEHOLDER: E.g., "Solves #1 pain point for Sales Directors - saves 10 hours/week, improves forecast accuracy 30%"] |
| [PLACEHOLDER: E.g., "Dark mode UI"] | [PLACEHOLDER: E.g., "0.5 (Low)"] | [PLACEHOLDER: E.g., "Nice to have for aesthetics, doesn't solve a real pain point"] |
| [PLACEHOLDER: E.g., "Deal health scoring"] | [PLACEHOLDER: E.g., "2.0 (High)"] | [PLACEHOLDER: E.g., "Solves #2 pain point - helps Sales Directors identify at-risk deals proactively"] |

---

### Confidence: How confident are we in these estimates?

**Scale:** 50% (low) → 80% (medium) → 100% (high)

**How to estimate:**

- **100% (High):** Validated by customer research, similar features have proven impact
- **80% (Medium):** Some validation, reasonable assumptions
- **50% (Low):** Speculative, based on intuition, needs more research

**Examples:**

| Feature | Confidence | Explanation |
|---------|------------|-------------|
| [PLACEHOLDER: E.g., "Real-time forecast dashboard"] | [PLACEHOLDER: E.g., "100%"] | [PLACEHOLDER: E.g., "Validated in 20+ customer interviews, top request from every Sales Director we spoke to"] |
| [PLACEHOLDER: E.g., "AI-powered deal scoring"] | [PLACEHOLDER: E.g., "50%"] | [PLACEHOLDER: E.g., "Hypothesis that ML will outperform heuristics, but unproven with our data"] |
| [PLACEHOLDER: E.g., "Mobile app"] | [PLACEHOLDER: E.g., "80%"] | [PLACEHOLDER: E.g., "Some customers asked for it, mobile web may be sufficient, needs validation"] |

---

### Effort: How much work will this take?

**Scale:** Person-months (0.5 for small, 2 for medium, 5 for large, 10+ for massive)

**How to estimate:**

- Include full scope: design, eng, QA, documentation, support
- Account for unknowns and technical debt
- Get engineering input - don't guess

**Examples:**

| Feature | Effort | Explanation |
|---------|--------|-------------|
| [PLACEHOLDER: E.g., "Real-time forecast dashboard"] | [PLACEHOLDER: E.g., "2 person-months"] | [PLACEHOLDER: E.g., "Design (1 week), Frontend (2 weeks), Backend (2 weeks), QA (1 week)"] |
| [PLACEHOLDER: E.g., "Salesforce integration"] | [PLACEHOLDER: E.g., "3 person-months"] | [PLACEHOLDER: E.g., "OAuth, data sync, webhooks, error handling, testing across Salesforce editions"] |
| [PLACEHOLDER: E.g., "Slack notifications"] | [PLACEHOLDER: E.g., "0.5 person-months"] | [PLACEHOLDER: E.g., "Slack API is well-documented, simple integration"] |

---

### Calculate RICE Score

**Formula:** (Reach × Impact × Confidence) / Effort

**Example:**

| Feature | Reach | Impact | Confidence | Effort | RICE Score |
|---------|-------|--------|------------|--------|------------|
| [PLACEHOLDER: E.g., "Forecast dashboard"] | 1,000 | 3.0 | 100% | 2 | 1,500 |
| [PLACEHOLDER: E.g., "Deal health scoring"] | 1,000 | 2.0 | 100% | 1.5 | 1,333 |
| [PLACEHOLDER: E.g., "Slack integration"] | 300 | 1.0 | 80% | 0.5 | 480 |
| [PLACEHOLDER: E.g., "Mobile app"] | 500 | 1.0 | 50% | 5 | 50 |
| [PLACEHOLDER: E.g., "Dark mode"] | 1,000 | 0.5 | 100% | 0.5 | 1,000 |

**Interpretation:**  
Higher RICE score = higher priority. In this example, Forecast dashboard (1,500) and Deal health scoring (1,333) are clear priorities.

---

### RICE Scoring Template

Use this template to score your features:

| Feature Name | Reach (users/qtr) | Impact (0.25-3.0) | Confidence (%) | Effort (person-months) | RICE Score | Priority |
|--------------|-------------------|-------------------|----------------|------------------------|------------|----------|
| [PLACEHOLDER] | [PLACEHOLDER] | [PLACEHOLDER] | [PLACEHOLDER] | [PLACEHOLDER] | [PLACEHOLDER] | [PLACEHOLDER] |
| [PLACEHOLDER] | [PLACEHOLDER] | [PLACEHOLDER] | [PLACEHOLDER] | [PLACEHOLDER] | [PLACEHOLDER] | [PLACEHOLDER] |
| [PLACEHOLDER] | [PLACEHOLDER] | [PLACEHOLDER] | [PLACEHOLDER] | [PLACEHOLDER] | [PLACEHOLDER] | [PLACEHOLDER] |

---

## Secondary Framework: MoSCoW

**What it is:**  
A simple categorization framework that buckets features into Must Have, Should Have, Could Have, Won't Have.

**When to use:**
- Sprint planning (deciding what goes in this sprint)
- MVP scoping (what's in vs. out)
- Stakeholder communication (setting expectations)

---

### Categories

**Must Have:**
- Critical for launch or core value prop
- Without it, product is incomplete or unusable
- Solves a top-3 pain point for primary persona

**Should Have:**
- Important but not critical
- Workaround exists, but not ideal
- Solves a secondary pain point or serves secondary persona

**Could Have:**
- Nice to have, improves experience
- Doesn't solve a core problem
- Low risk if we skip it

**Won't Have (this time):**
- Not a priority for this release
- Parking lot for future consideration
- Good idea, wrong timing

---

### MoSCoW Examples

#### For MVP Launch

**Must Have:**
- [PLACEHOLDER: E.g., "Real-time forecast dashboard"]
- [PLACEHOLDER: E.g., "Salesforce integration"]
- [PLACEHOLDER: E.g., "Deal health scoring"]
- [PLACEHOLDER: E.g., "User authentication and management"]
- [PLACEHOLDER: E.g., "Basic reporting (forecast accuracy over time)"]

**Should Have:**
- [PLACEHOLDER: E.g., "Email notifications (forecast changes, at-risk deals)"]
- [PLACEHOLDER: E.g., "Onboarding tutorial"]
- [PLACEHOLDER: E.g., "Drill-down into forecast numbers"]

**Could Have:**
- [PLACEHOLDER: E.g., "Dark mode"]
- [PLACEHOLDER: E.g., "Export to PDF"]
- [PLACEHOLDER: E.g., "Slack integration"]

**Won't Have:**
- [PLACEHOLDER: E.g., "Mobile native apps"]
- [PLACEHOLDER: E.g., "AI-powered insights"]
- [PLACEHOLDER: E.g., "Custom integrations"]
- [PLACEHOLDER: E.g., "Multi-currency support"]

---

## Tertiary Framework: Value vs. Effort Matrix

**What it is:**  
A 2×2 matrix plotting features by Value (to customer) and Effort (to build).

**When to use:**
- Visualizing trade-offs in roadmap planning
- Communicating priorities to non-technical stakeholders
- Quick prioritization when you don't have time for RICE

---

### The Matrix

```
High Value
    |
    |  QUICK WINS          STRATEGIC BETS
    |  (do first)          (plan carefully)
    |
    |--------------------------------
    |
    |  LOW PRIORITY        MONEY PITS
    |  (do if time)        (avoid/defer)
    |
    +--------------------------------> High Effort
```

---

### Quadrants

**1. Quick Wins (High Value, Low Effort)**
- Do these first
- Low-hanging fruit that delivers immediate impact
- Builds momentum and credibility

**Examples:**
- [PLACEHOLDER: E.g., "Email notifications for at-risk deals"]
- [PLACEHOLDER: E.g., "Forecast accuracy trending chart"]
- [PLACEHOLDER: E.g., "Export forecast to CSV"]

**2. Strategic Bets (High Value, High Effort)**
- Plan carefully, allocate sufficient resources
- Core features that define your product
- High risk, high reward

**Examples:**
- [PLACEHOLDER: E.g., "Real-time forecast engine"]
- [PLACEHOLDER: E.g., "ML-powered deal scoring"]
- [PLACEHOLDER: E.g., "Salesforce integration"]

**3. Low Priority (Low Value, Low Effort)**
- Do if you have extra capacity
- Doesn't hurt, but doesn't move needle

**Examples:**
- [PLACEHOLDER: E.g., "Dark mode"]
- [PLACEHOLDER: E.g., "Custom dashboard colors"]
- [PLACEHOLDER: E.g., "Fun Easter eggs"]

**4. Money Pits (Low Value, High Effort)**
- Avoid or defer
- Looks impressive but doesn't solve real problem
- Often driven by ego or FOMO

**Examples:**
- [PLACEHOLDER: E.g., "Native mobile apps (when mobile web suffices)"]
- [PLACEHOLDER: E.g., "Custom CRM (when integrations work)"]
- [PLACEHOLDER: E.g., "Complex workflow automation (before validating need)"]

---

### Value vs. Effort Template

Plot your features on this matrix:

| Feature | Value (1-10) | Effort (1-10) | Quadrant |
|---------|--------------|---------------|----------|
| [PLACEHOLDER: E.g., "Forecast dashboard"] | 10 | 5 | Strategic Bet |
| [PLACEHOLDER: E.g., "Email notifications"] | 7 | 2 | Quick Win |
| [PLACEHOLDER: E.g., "Dark mode"] | 3 | 2 | Low Priority |
| [PLACEHOLDER: E.g., "Mobile app"] | 4 | 9 | Money Pit |

---

## Decision-Making Process

### Step 1: Gather Input

**Sources of feature ideas:**
- Customer interviews and feedback
- Usage data and analytics
- Competitive analysis
- Team brainstorms
- Sales/CS requests
- Strategic company goals

**Capture ideas in a backlog:**
- Use a tool (Jira, Linear, Productboard, Notion)
- Include: feature name, problem it solves, persona it serves, rough scope
- Don't prioritize yet - just capture

---

### Step 2: Filter & Validate

**Filter criteria:**

- [ ] **Does it solve a real customer problem?** (Not just a feature request)
- [ ] **Does it align with product vision?** (See `product-spec.md`)
- [ ] **Is it the right problem for our stage?** (PMF first, growth later)
- [ ] **Do we have evidence of demand?** (Customer interviews, usage data, win/loss reasons)

**Validation questions:**

- What problem does this solve? For whom?
- How do customers solve this today? (Understand current workaround)
- What happens if we don't build this? (Test urgency)
- How will we know if it works? (Define success metrics)
- What's the simplest version we can build? (Avoid gold-plating)

**Kill criteria:**

- Fewer than 3 customers asking for it (unless strategic bet)
- Solves edge case, not core use case
- Requires major technical debt or rearchitecture
- Distracts from core value prop

---

### Step 3: Score & Prioritize

**Choose your framework:**

- **RICE:** For quarterly roadmap planning with 10-50 features
- **MoSCoW:** For sprint planning or MVP scoping
- **Value/Effort:** For quick visual prioritization

**Score features:**

- Assign scores based on data, not gut feel
- Get input from cross-functional team (PM, Eng, Design, Sales, CS)
- Document assumptions and confidence levels

**Rank by score:**

- Sort by RICE score (highest first)
- Adjust for dependencies (must build A before B)
- Adjust for strategy (balance quick wins with long-term bets)

---

### Step 4: Communicate & Commit

**Create roadmap:**

- Prioritized list or timeline (see `mvp-roadmap.md`)
- Include rationale for each decision
- Be transparent about trade-offs

**Share with stakeholders:**

- Team: Weekly sprint planning, quarterly roadmap reviews
- Customers: Public roadmap (high-level), beta program updates
- Investors: Monthly/quarterly updates on progress

**Commit to decisions:**

- Say "yes" to top priorities, "no" or "not now" to everything else
- Revisit quarterly based on new data
- Don't let squeaky wheel override framework

---

## Common Prioritization Challenges

### Challenge 1: Everything is High Priority

**Problem:** Stakeholders say everything is "urgent" or "must have"

**Solution:**

- Use forced ranking: "If you could only ship 3 things this quarter, which 3?"
- Show trade-offs: "If we build X, we can't build Y. Which is more important?"
- Tie to metrics: "Which feature will most impact our goal of [revenue/retention/activation]?"
- Get executive alignment: CRO/CEO makes final call when tie-breakers are needed

---

### Challenge 2: Customer Requests Overwhelm Roadmap

**Problem:** Sales/CS bring endless list of "customer needs this to close/renew"

**Solution:**

- Separate feature requests from problems: "What problem is the customer trying to solve?"
- Look for patterns: Is this a one-off or do 10 customers need it?
- Validate urgency: "Will customer churn without this? When?"
- Offer workarounds: Can CS or Sales solve this without product?
- Create customer advisory board: Get input from top customers quarterly, not ad-hoc

---

### Challenge 3: Founder's Pet Project

**Problem:** Founder/CEO wants to build something that doesn't score well in frameworks

**Solution:**

- Show the data: "Here's how it scores on RICE. Here are alternatives that score higher."
- Understand the why: Is there strategic insight you're missing?
- Propose pilot: "Let's validate with 5 customers before we commit 3 months of eng time"
- Allocate innovation budget: "20% of eng capacity can go to bets/experiments, 80% stays on roadmap"

---

### Challenge 4: Analysis Paralysis

**Problem:** Spend too much time prioritizing, not enough building

**Solution:**

- Timebox prioritization: 1 day per quarter for roadmap planning, not 1 week
- Good enough > perfect: You'll learn more by shipping than by planning
- Use data when available, intuition when not
- Default to action: When in doubt, ship small and learn

---

### Challenge 5: Short-term vs. Long-term Balance

**Problem:** Urgent customer requests crowd out strategic long-term bets

**Solution:**

- 70/20/10 rule: 70% core roadmap, 20% customer requests, 10% experiments/tech debt
- Protect strategic time: Reserve eng capacity for long-term bets, don't let urgent eat it all
- Quarterly planning: Force evaluation of long-term strategy every quarter
- Track technical debt: Make sure you're investing in foundation, not just features

---

## Saying No

### Why "No" is Critical

- You can't do everything
- Focus creates better outcomes than breadth
- Every "yes" is a "no" to something else
- Saying "no" now doesn't mean "no" forever

### How to Say No Gracefully

**To customers:**

- "That's a great idea. We're prioritizing [X] right now because [reason]. We'll revisit this in [timeframe]."
- "Help me understand the problem you're solving. Maybe there's a workaround or alternative approach?"
- "We've heard similar feedback from [N] customers. When we hit [N+X], we'll prioritize it."

**To internal stakeholders:**

- "I love this idea. Here's where it ranks on RICE vs. our current roadmap. Are you suggesting we swap it for [X]?"
- "Let's put it in the parking lot and revisit in Q[N] planning."
- "This is a great v2.0 feature. Let's validate PMF with v1.0 first."

**To founders/executives:**

- "I want to make sure I understand the strategic rationale. Can you help me see what I'm missing?"
- "What would you recommend we deprioritize to make room for this?"
- "Would you be open to running a small pilot to validate before we commit full eng resources?"

---

## Prioritization Anti-Patterns

### Things to Avoid

**1. HiPPO-driven prioritization**
- Highest Paid Person's Opinion overrides data
- Fix: Use frameworks, make decisions transparent

**2. Squeaky wheel prioritization**
- Whoever complains loudest gets their feature built
- Fix: Look for patterns, not anecdotes

**3. Feature factory**
- Measure success by features shipped, not outcomes
- Fix: Track impact metrics (usage, retention, revenue), not output metrics (features shipped)

**4. Roadmap bingo**
- Build whatever competitors have
- Fix: Focus on differentiation, not parity

**5. Shiny object syndrome**
- Get distracted by new ideas, never finish what you started
- Fix: Commit to quarterly roadmap, limit mid-quarter changes

**6. Analysis paralysis**
- Spend all your time prioritizing, never shipping
- Fix: Timebox prioritization, default to action

---

## Prioritization Checklist

Use this checklist when evaluating a new feature:

### Problem & Opportunity

- [ ] What customer problem does this solve?
- [ ] Which persona(s) does this serve?
- [ ] How do they solve this today?
- [ ] How many customers have this problem?
- [ ] How acute is the pain? (top-3 pain point or nice-to-have?)

### Strategic Fit

- [ ] Does this align with product vision?
- [ ] Is this the right problem for our stage?
- [ ] Does this differentiate us or create parity?
- [ ] Will this impact our north star metric?

### Evidence & Confidence

- [ ] What evidence do we have that this is important?
- [ ] Customer interviews? Usage data? Win/loss reasons?
- [ ] How confident are we in our estimates?
- [ ] What assumptions are we making?

### Effort & Feasibility

- [ ] How much effort to design, build, test, document, support?
- [ ] What are the technical risks or unknowns?
- [ ] Do we have the right skills on the team?
- [ ] What dependencies exist?

### Impact & Success

- [ ] What's the expected impact? (reach × value)
- [ ] How will we measure success?
- [ ] What's the best case outcome? Worst case?
- [ ] What happens if we don't build this?

### Trade-offs & Alternatives

- [ ] What are we NOT building if we build this?
- [ ] Is there a simpler version we can ship first?
- [ ] Can we solve this without product? (CS workaround, documentation)
- [ ] Should we buy vs. build? (integration vs. custom feature)

---

## Example: Prioritization in Action

### Scenario

You have 3 features proposed for next quarter. You have 1 engineering team (2 engineers) with ~6 person-months of capacity. What do you build?

### Option A: AI-Powered Deal Insights

- **Problem:** Sales Directors struggle to identify why deals stall
- **Reach:** 1,000 users/quarter (all Sales Directors)
- **Impact:** 2.0 (high - helps identify issues earlier)
- **Confidence:** 50% (unproven if AI will be accurate)
- **Effort:** 4 person-months (train models, build UI, test accuracy)
- **RICE Score:** (1,000 × 2.0 × 50%) / 4 = 250

### Option B: HubSpot Integration

- **Problem:** Non-Salesforce customers can't use product
- **Reach:** 300 users/quarter (30% of market uses HubSpot)
- **Impact:** 3.0 (massive - unlocks new customer segment)
- **Confidence:** 100% (validated demand, HubSpot API well-documented)
- **Effort:** 2 person-months (similar to Salesforce integration)
- **RICE Score:** (300 × 3.0 × 100%) / 2 = 450

### Option C: Email Digest & Notifications

- **Problem:** Users don't check app daily, miss important changes
- **Reach:** 800 users/quarter (80% will enable notifications)
- **Impact:** 1.0 (medium - improves engagement, doesn't solve new problem)
- **Confidence:** 80% (similar features proven effective)
- **Effort:** 1 person-month (email system, templates, preferences)
- **RICE Score:** (800 × 1.0 × 80%) / 1 = 640

### Decision

**Rank by RICE:**

1. Email Notifications (640) - Quick win, high ROI
2. HubSpot Integration (450) - Strategic bet, unlocks new market
3. AI Insights (250) - Interesting but low confidence, high effort

**Recommendation:**

- **Build:** Email Notifications (1 month) + HubSpot Integration (2 months) = 3 months
- **Defer:** AI Insights to next quarter after we have more data and ML infrastructure

**Rationale:**

- Email Notifications is a quick win that improves engagement across all users
- HubSpot Integration is high-confidence strategic bet that opens new market segment
- AI Insights is too speculative and resource-intensive for current stage - revisit when we have more usage data

---

## Next Steps

1. **2026-06-03**: Run RICE scoring session with product and engineering teams for all features in backlog
2. **2026-06-10**: Present prioritized roadmap to leadership team and get buy-in on top priorities
3. **2026-06-17**: Set up quarterly roadmap review process to revisit prioritization based on new data and customer feedback
