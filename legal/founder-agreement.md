---
name: founder-agreement
description: >
  Generates founder agreement guidance: equity split framework, vesting schedules,
  acceleration provisions, agreement outline, hard conversation checklist (15 questions).
  MUST prepend legal warning to every output section. Writes to legal/output/founder-agreement-guide.md
allowed-tools: Read, Write, Edit, Bash
---

# Founder Agreement Agent

## Context to load before writing

1. Read `CLAUDE.md` → extract Startup Profile (founder count, roles, prior relationships, funding plans).
2. Read `legal/output/entity-formation.md` if it exists → understand entity structure (C-Corp requires stock purchase agreements).
3. Read `people/output/culture-doc.md` if it exists → align equity philosophy with company values.

## Equity Split Framework

Generate guidance for determining founder equity splits using multiple frameworks:

### 1. Equal Split (50/50 or 33/33/33)
**When to use**: Co-founders with similar skills, equal time commitment, equal risk

✅ **Pros**:
- Simple, avoids resentment
- Shows unity to investors
- Easy to agree on quickly

❌ **Cons**:
- Ignores differences in contribution (idea, capital, network, time)
- Can cause deadlock (50/50) or drama if one founder leaves
- Investors may question if founders have thought it through

**Recommendation**: Only if founders are truly equal in every dimension (rare)

### 2. Contribution-Based Split
**When to use**: Founders have different roles, skills, or time commitments

**Scoring model** (score each founder 0-10 on each factor):
- **Idea origination** (0-10): Who conceived the product?
- **Domain expertise** (0-10): Who has the most relevant industry knowledge?
- **Technical execution** (0-10): Who builds the product?
- **Business execution** (0-10): Who runs sales, fundraising, ops?
- **Capital contributed** (0-10): Who put in the most cash?
- **Network/distribution** (0-10): Who brings customers/investors?
- **Time commitment** (0-10): Full-time (10) vs. part-time (5) vs. advisor (2)
- **Opportunity cost** (0-10): Who gave up the most (high salary, equity at last company)?

**Calculation**:
1. Sum scores for each founder
2. Calculate percentage: (Founder A Score / Total Score) × 100%
3. Round to nearest 1% (e.g., 52%, 48%)

**Example**:
- Founder A (Technical CEO): 8+7+10+6+2+5+10+9 = 57 points → 57%
- Founder B (Biz COO): 6+8+2+10+8+10+10+6 = 60 points → 43%

### 3. Dynamic Equity Split (Slicing Pie Model)
**When to use**: Early stage, uncertain time commitments, or co-founders joining at different times

**How it works**:
- Track hours/contributions in real-time (use Slicing Pie calculator)
- Assign hourly rates based on market value (engineer = $X/hr, exec = $Y/hr)
- Equity adjusts dynamically until funding event (then freezes)

**Pros**: Fair for part-time/uncertain commitments
**Cons**: Complex, requires tracking, can feel transactional

### 4. Vesting-Based Approach
**When to use**: Always (vesting is mandatory, not optional)

**Standard terms**:
- **4-year vesting period**: Earn 1/48th of shares per month
- **1-year cliff**: No vesting until Month 12, then 25% vests at once
- **Monthly vesting thereafter**: 1/48th per month from Month 13-48

**Why vesting matters**:
- Protects remaining founders if someone leaves early (unvested shares return to pool)
- Investors require vesting (won't fund without it)
- Aligns incentives (you earn equity by sticking around)

**Acceleration provisions** (see below for details):
- **Single-trigger**: Vesting accelerates on acquisition (dangerous, avoid)
- **Double-trigger**: Vesting accelerates on acquisition + termination (recommended: 50-100%)

## Vesting Schedules

### Standard 4-Year Vest with 1-Year Cliff

**How it works**:
- Founder receives stock on Day 0 (but subject to vesting)
- No shares vest until Month 12 (the "cliff")
- At Month 12: 25% of shares vest immediately
- Months 13-48: 1/48th of total shares vest each month

**Example** (Founder A owns 1,000,000 shares):
- Month 0: 0 shares vested (but owns 1M subject to vesting)
- Month 12: 250,000 shares vest (25%)
- Month 13: 270,833 shares vested (25% + 1/48)
- Month 24: 500,000 shares vested (50%)
- Month 48: 1,000,000 shares fully vested

**If founder leaves at Month 18**:
- Vested: 375,000 shares (keep these)
- Unvested: 625,000 shares (return to company)

### Why the 1-Year Cliff?

**Purpose**: Ensures commitment for at least 12 months before earning any equity

**Scenario without cliff**:
- Founder leaves at Month 3 → walks away with 62,500 shares (6.25% of 1M)
- Remaining founders now have diluted cap table with no value gained

**Scenario with cliff**:
- Founder leaves at Month 3 → walks away with 0 shares
- Remaining founders avoid dilution

**Investor requirement**: 95% of VCs won't fund without 4-year vesting + 1-year cliff

### Acceleration Provisions

**Single-Trigger Acceleration**:
- **Trigger**: Company is acquired
- **Effect**: 100% of unvested shares vest immediately
- **Danger**: Founders get fully vested at acquisition, then quit next day (acquirer gets no value)
- **Recommendation**: ❌ AVOID — Most acquirers won't accept this

**Double-Trigger Acceleration**:
- **Trigger 1**: Company is acquired
- **Trigger 2**: Founder is terminated without cause OR resigns for good reason within 12 months
- **Effect**: 50-100% of unvested shares vest immediately
- **Recommendation**: ✅ STANDARD — Protects founders from bad acquirers, doesn't scare off buyers

**Standard double-trigger terms**:
- **50% acceleration**: If terminated without cause within 12 months of acquisition
- **100% acceleration**: If terminated without cause + role significantly downgraded

**Example**:
- Founder A has 600,000 unvested shares
- Company acquired at Month 24
- Founder A terminated 6 months later
- Result: 300,000 shares (50% of unvested) accelerate immediately

## Founder Agreement Outline

A complete founder agreement should include:

### 1. Equity Allocation
- Founder A: X% (Y shares of common stock)
- Founder B: Z% (W shares of common stock)
- Total issued: X+Z% (leaves room for option pool + future hires)

### 2. Vesting Terms
- 4-year vesting, 1-year cliff, monthly thereafter
- Vesting start date: [DATE] (usually incorporation date)
- Acceleration: Double-trigger (50% on acquisition + termination)

### 3. Roles & Responsibilities
- Founder A: CEO — fundraising, strategy, product vision
- Founder B: CTO — engineering, hiring, technical architecture
- Board seats: Founders each get 1 seat initially

### 4. Time Commitment
- Full-time (40+ hours/week) vs. part-time
- Expectation: Full-time founders stop consulting/side projects
- Revisit if commitment changes (may adjust equity)

### 5. IP Assignment
- All work product belongs to the company (sign PIIA — see `ip.md`)
- Pre-existing IP: Document what each founder brings (e.g., open-source code, patents)
- Non-compete: Standard 1-2 year non-compete if terminated for cause

### 6. Decision-Making
- Day-to-day: CEO has final say
- Major decisions (fundraising, acquisition, hiring execs): Board approval required
- Deadlock resolution: If 50/50 split, define tiebreaker (investor seat, CEO vote, mediation)

### 7. Co-Founder Departure
- **Termination for cause**: Forfeit all unvested shares, keep vested shares
- **Resignation**: Forfeit unvested shares, keep vested shares, must sell vested shares to company (ROFR)
- **Death/disability**: Accelerate 12 months of vesting, remaining shares forfeit

### 8. Right of First Refusal (ROFR)
- Founder can't sell shares without offering to company/other founders first
- Prevents outsiders from buying in
- Standard in all VC-backed startups

### 9. Drag-Along Rights
- If 75%+ shareholders approve acquisition, all shareholders must vote yes
- Prevents holdout founders from blocking exit

### 10. Non-Compete & Non-Solicit
- Non-compete: 1-2 years (can't start competing company)
- Non-solicit: 2 years (can't recruit employees or customers)
- Enforceability varies by state (CA won't enforce non-competes)

## Hard Conversation Checklist (15 Questions)

Before signing founder agreements, discuss these 15 questions:

### Commitment & Motivation (5 questions)

1. **Are you full-time or part-time?**
   - Full-time = 40+ hours/week, no consulting, no side projects
   - Part-time = may need equity adjustment or advisor role

2. **What happens if you get a job offer from Google for 2x your salary?**
   - Tests commitment — are you in this to build wealth over 10 years, or looking for fast cash?

3. **What's your financial runway?**
   - Can you afford 18-24 months without salary?
   - If not, can you contribute savings/loans, or do we need to fundraise immediately?

4. **What happens if your spouse/family asks you to quit?**
   - Tests resolve — are you mentally prepared for the stress?

5. **What happens if we pivot away from your original idea?**
   - Tests ego — can you let go of the original vision if data says pivot?

### Equity & Ownership (5 questions)

6. **How did we arrive at this equity split?**
   - If answer is "we just did 50/50 to avoid conflict," revisit with contribution framework

7. **What happens if one of us works 60 hours/week and the other works 20?**
   - Dynamic equity? Adjust split? Buy out part-time founder?

8. **What if one of us wants to leave in 6 months?**
   - Vesting protects this, but emotional agreement matters

9. **Should we have acceleration provisions?**
   - Double-trigger = yes (protects you if acquired + fired)
   - Single-trigger = no (acquirers won't accept it)

10. **What if we bring on a CEO later (after raising Series A)?**
    - Are you OK diluting your equity for experienced exec?
    - Would you report to them?

### Roles & Decision-Making (5 questions)

11. **Who has final say on product decisions? Business decisions? Hiring?**
    - Define now to avoid deadlock (CEO usually has product/biz, CTO has eng)

12. **What if we deadlock on a major decision (e.g., acquisition offer)?**
    - 50/50 splits need tiebreaker: Investor board seat? Mediation? CEO vote?

13. **What if one of us is underperforming?**
    - Can we fire a co-founder? (Yes, but requires board approval + vesting stops)

14. **What if we want to hire a friend/family member?**
    - Define hiring standards now (avoid nepotism fights later)

15. **What if one of us wants to sell the company and the other wants to keep building?**
    - Drag-along rights solve this (75%+ shareholders can force sale)
    - But emotional agreement matters — discuss exit goals now (5-year horizon? 10-year?)

## Output Format

Write to: `legal/output/founder-agreement-guide.md`

Structure:
```markdown
# Founder Agreement Guide: [Company Name]

> [!WARNING]
> Not legal advice. Consult a qualified startup attorney before signing founder agreements.

**Generated**: 2026-05-29  
**Founders**: [Founder A], [Founder B], [Founder C]  
**Recommended Split**: [X%] / [Y%] / [Z%]  
**Vesting**: 4-year vest, 1-year cliff, double-trigger acceleration

---

## Equity Split Analysis

> [!WARNING]
> Not legal advice. Consult a qualified startup attorney before finalizing equity splits.

### Recommended Split: [X%] / [Y%] / [Z%]

**Methodology**: Contribution-based scoring (see framework below)

| Factor | Founder A | Founder B | Founder C | Weight |
|--------|-----------|-----------|-----------|--------|
| Idea origination | X | Y | Z | 10% |
| Domain expertise | X | Y | Z | 15% |
| Technical execution | X | Y | Z | 20% |
| Business execution | X | Y | Z | 20% |
| Capital contributed | X | Y | Z | 10% |
| Network/distribution | X | Y | Z | 10% |
| Time commitment | X | Y | Z | 10% |
| Opportunity cost | X | Y | Z | 5% |
| **TOTAL SCORE** | **XX** | **YY** | **ZZ** | **100%** |

**Resulting equity**:
- Founder A: X% ([SCORE_A / TOTAL] × 100)
- Founder B: Y% ([SCORE_B / TOTAL] × 100)
- Founder C: Z% ([SCORE_C / TOTAL] × 100)

**Rationale**:
- Founder A is [CEO/CTO/etc.] with [X years experience in Y domain]
- Founder B brings [technical skills / network / capital]
- Founder C is [full-time / part-time] and contributes [specific value]

**Alternative considered**: 50/50 split (rejected because [reason])

---

## Equity Split Frameworks

> [!WARNING]
> Not legal advice. Consult a qualified startup attorney before finalizing equity splits.

### Framework 1: Equal Split

**When to use**: Co-founders are truly equal in skills, time, risk, and contribution

✅ **Pros**:
- Simple, avoids resentment in the moment
- Shows unity to investors
- Fast to agree on

❌ **Cons**:
- Ignores reality: founders are rarely equal
- 50/50 can cause deadlock (need tiebreaker)
- Leaves money on table (one founder may be worth more)

**Verdict**: ❌ Not recommended unless founders have identical backgrounds and commit equally

---

### Framework 2: Contribution-Based Split ⭐ RECOMMENDED

**When to use**: Founders have different backgrounds, skills, or time commitments

**How to score** (0-10 on each factor):
1. **Idea origination**: Who came up with the product concept?
2. **Domain expertise**: Who knows the industry/customer best?
3. **Technical execution**: Who builds the product?
4. **Business execution**: Who runs sales, fundraising, operations?
5. **Capital contributed**: Who invested cash?
6. **Network/distribution**: Who brings customers/investors?
7. **Time commitment**: Full-time (10), part-time (5), advisor (2)
8. **Opportunity cost**: What salary/equity did they give up?

**Example calculation**:
- Founder A (CEO, fundraising, product vision): 8+7+3+10+5+8+10+9 = 60 points → 60%
- Founder B (CTO, eng execution): 4+6+10+5+0+4+10+5 = 44 points → 40%

**Verdict**: ✅ Best for most startups (aligns equity with actual contribution)

---

### Framework 3: Dynamic Equity (Slicing Pie)

**When to use**: Uncertain time commitments, or co-founders joining at different times

**How it works**:
- Track hours worked × market hourly rate (engineer = $X/hr, exec = $Y/hr)
- Equity adjusts monthly until a funding event (then freezes)
- Example: Founder A works 200 hours at $150/hr = 30,000 "slices"; Founder B works 150 hours at $100/hr = 15,000 slices → A gets 66.7%, B gets 33.3%

**Pros**: Fair for part-time founders, self-corrects for imbalances  
**Cons**: Complex, feels transactional, requires tracking

**Verdict**: ⚠️ Use only if founders can't commit full-time initially

---

## Vesting Terms

> [!WARNING]
> Not legal advice. Consult a qualified startup attorney before signing stock purchase agreements.

### Standard Vesting: 4 Years with 1-Year Cliff

**Structure**:
- **Total vesting period**: 4 years (48 months)
- **Cliff**: 1 year (no shares vest until Month 12)
- **Monthly vesting**: 1/48th of total shares vest each month from Month 13-48
- **Vesting start date**: [INCORPORATION_DATE or FUNDING_DATE]

**Example** (Founder owns 1,000,000 shares):
- Month 0: 0 shares vested (but owns 1M subject to repurchase)
- Month 12: 250,000 shares vest (25%)
- Month 24: 500,000 shares vest (50%)
- Month 36: 750,000 shares vest (75%)
- Month 48: 1,000,000 shares fully vested (100%)

**If founder leaves at Month 18**:
- Vested shares: 375,000 (keep these)
- Unvested shares: 625,000 (forfeit back to company)

---

### Why Vesting Matters

**Without vesting**:
- Founder quits at Month 3 → walks away with 100% equity → remaining founders screwed
- Investors refuse to fund (no protection against early departures)

**With vesting**:
- Founder quits at Month 3 → forfeits 100% of unvested equity → company can re-grant to new hire
- Investors happy (founders are incentivized to stay)

**Key principle**: You don't "earn" equity by founding the company — you earn it by sticking around.

---

### Acceleration Provisions

#### Single-Trigger Acceleration ❌ AVOID

**How it works**:
- Company is acquired → 100% of unvested shares vest immediately
- Founder can then quit next day, fully vested

**Why it's bad**:
- Acquirer pays for your company, then all founders quit immediately (no retention)
- Most acquirers won't close deal if you have single-trigger (deal-breaker)

**Verdict**: ❌ Never include single-trigger acceleration

---

#### Double-Trigger Acceleration ✅ RECOMMENDED

**How it works**:
- **Trigger 1**: Company is acquired
- **Trigger 2**: Founder is terminated without cause OR resigns for good reason within 12 months of acquisition
- **Effect**: 50-100% of unvested shares vest immediately

**Why it's good**:
- Protects founders from bad acquirers (you get paid if fired)
- Acquirer is OK with it (only triggers if they fire you, so you're not blocking retention)

**Standard terms**:
- **50% acceleration**: If terminated without cause within 12 months of acquisition
- **100% acceleration**: If terminated + role materially downgraded

**Example**:
- Founder has 600,000 unvested shares at time of acquisition
- Acquirer fires founder 6 months later
- 300,000 shares (50% of unvested) vest immediately

**Verdict**: ✅ Include 50% double-trigger in all founder agreements

---

## Founder Agreement Outline

> [!WARNING]
> Not legal advice. Consult a qualified startup attorney before drafting founder agreements.

### Section 1: Equity Allocation

**Stock issuance**:
- Founder A: [X]% ([Y] shares of common stock)
- Founder B: [Z]% ([W] shares of common stock)
- **Total issued**: [X+Z]%
- **Reserved for option pool**: 10-15% (to be created after seed funding)
- **Authorized shares**: 10,000,000 common shares

**Purchase price**: $0.0001 per share (nominal amount to establish cost basis)

**83(b) election**: Each founder must file IRS Form 83(b) within 30 days of stock issuance (critical for tax treatment)

---

### Section 2: Vesting Terms

- **Vesting schedule**: 4 years, 1-year cliff, monthly vesting thereafter
- **Vesting start date**: [INCORPORATION_DATE]
- **Acceleration**: 50% double-trigger (acquisition + termination without cause)

---

### Section 3: Roles & Responsibilities

**Founder A** (CEO):
- Fundraising, investor relations
- Strategy, vision, roadmap
- Sales, partnerships
- Final decision on business matters

**Founder B** (CTO):
- Engineering, technical architecture
- Hiring technical team
- Product execution
- Final decision on technical matters

**Board composition**:
- Initially: Founder A + Founder B (2 seats)
- Post-seed: Add 1 investor seat (3 total)
- Post-Series A: 5 total (2 founders, 2 investors, 1 independent)

---

### Section 4: Time Commitment

- **Full-time requirement**: 40+ hours/week, no consulting, no side projects
- **Exceptions**: Board seats at non-competing companies (must disclose)
- **Revisit if commitment changes**: If founder goes part-time, equity may adjust or convert to advisor role

---

### Section 5: IP Assignment

- **All work belongs to the company**: Founders sign PIIA (Proprietary Information and Invention Assignment) — see `ip.md`
- **Pre-existing IP**: Document anything brought into the company (e.g., open-source code, prior patents)
- **Non-compete**: 1-2 years if terminated for cause (enforceability varies by state)

---

### Section 6: Decision-Making

**Day-to-day decisions**: CEO has final say (product, hiring, spending <$X)

**Major decisions** (require board approval):
- Raising funding (SAFEs, convertible notes, equity rounds)
- Acquisition or sale of company
- Hiring C-level executives
- Approving annual budget
- Creating/amending option pool

**Deadlock resolution** (for 50/50 splits):
- Investor board seat breaks tie, OR
- CEO vote counts 1.5x, OR
- Mediation within 30 days

---

### Section 7: Co-Founder Departure

**Voluntary resignation**:
- Vesting stops immediately
- Keep all vested shares
- Forfeit all unvested shares (return to company)
- Company has right of first refusal (ROFR) on vested shares

**Termination for cause** (fraud, breach, gross negligence):
- Vesting stops immediately
- Forfeit all unvested shares
- Company can repurchase vested shares at fair market value (or cost, depending on agreement)

**Death or permanent disability**:
- Accelerate 12 months of vesting (compassion provision)
- Remaining unvested shares forfeit
- Estate keeps vested shares (subject to ROFR)

---

### Section 8: Right of First Refusal (ROFR)

**Purpose**: Prevent founders from selling shares to outsiders without approval

**How it works**:
1. Founder wants to sell shares → must offer to company first
2. Company has 30 days to purchase at same price
3. If company declines → offer to remaining founders
4. If all decline → founder can sell to third party (subject to board approval)

**Standard in**: 100% of VC-backed startups

---

### Section 9: Drag-Along Rights

**Purpose**: Prevent holdout founders from blocking acquisition

**How it works**:
- If 75%+ of shareholders vote to sell company → all shareholders must vote yes
- Prevents 1 founder with 10% equity from blocking $100M exit

**Example**:
- Founders own 60%, investors own 40%
- Acquirer offers $50M
- If founders + investors (100%) approve → deal closes
- If 1 founder opposes but holds <25% → drag-along forces them to sell

---

### Section 10: Non-Compete & Non-Solicit

**Non-compete** (1-2 years):
- Can't start or join a directly competing company
- Enforceability: Strong in most states, unenforceable in California

**Non-solicit** (2 years):
- Can't recruit employees or contractors
- Can't solicit customers or partners
- Enforceable in all states (including CA)

**"Good leaver" exception**: If company terminates founder without cause, non-compete may be waived (negotiable)

---

## Hard Conversation Checklist

> [!WARNING]
> Not legal advice. Consult a qualified startup attorney before signing founder agreements.

Before signing anything, have these 15 conversations:

### Commitment & Motivation

- [ ] **1. Are you full-time or part-time?**
  - Full-time = 40+ hours/week, no consulting, no side projects
  - Part-time = equity should reflect reduced commitment (or advisor role)

- [ ] **2. What happens if you get a 2x salary offer from [FAANG]?**
  - Tests: Are you committed to building long-term wealth, or will you bail for short-term cash?

- [ ] **3. What's your financial runway?**
  - Can you afford 18-24 months without salary?
  - If not: Can you contribute savings, or do we need to fundraise immediately?

- [ ] **4. What if your spouse/family asks you to quit?**
  - Tests: Are you mentally prepared for startup stress, or will family pressure derail you?

- [ ] **5. What if we pivot away from your original idea?**
  - Tests: Can you let go of ego, or will you fight pivots?

### Equity & Ownership

- [ ] **6. How did we arrive at this equity split?**
  - If answer is "we just did 50/50 to be fair," revisit with contribution framework

- [ ] **7. What if one of us works 60 hours/week and the other works 20?**
  - Dynamic equity? Performance review? Equity adjustment? Buy-out?

- [ ] **8. What if one of us wants to leave in 6 months?**
  - Vesting protects company, but discuss emotional impact

- [ ] **9. Should we have acceleration on acquisition?**
  - Double-trigger = yes (protects you if acquired + fired)
  - Single-trigger = no (acquirers won't accept)

- [ ] **10. What if we bring on an outside CEO after Series A?**
  - Are you OK diluting equity for experienced exec? Would you report to them?

### Roles & Decision-Making

- [ ] **11. Who has final say on product vs. business vs. hiring decisions?**
  - Define now: CEO usually owns product/biz, CTO owns eng

- [ ] **12. What if we deadlock on a major decision (e.g., acquisition offer)?**
  - 50/50 splits need tiebreaker: Investor vote? CEO vote? Mediation?

- [ ] **13. What if one of us is underperforming?**
  - Can we fire a co-founder? (Yes, but requires board approval + forfeits unvested equity)

- [ ] **14. Can we hire friends or family?**
  - Define hiring bar now to avoid nepotism fights later

- [ ] **15. What if one founder wants to sell and the other wants to keep building?**
  - Drag-along rights solve this legally, but discuss exit timeline now (5-year? 10-year?)

---

## Next Steps

1. **Score equity split using contribution framework** → Complete by [DATE+3 days]
2. **Draft founder stock purchase agreements** → Use Clerky or attorney by [DATE+7 days]
3. **File 83(b) elections within 30 days** → ⚠️ CRITICAL DEADLINE
4. **Hold "hard conversations" meeting** → Discuss all 15 questions by [DATE+7 days]
5. **Sign agreements before first customer/funding** → Must be done before raising capital
```

## Writing Rules

1. **MUST prepend warning** — Every section begins with `> [!WARNING] Not legal advice. Consult a qualified startup attorney.`
2. **15 hard questions** — Must include exactly 15 uncomfortable questions founders should discuss.
3. **Show scoring math** — Contribution framework must show actual calculation (e.g., 60/100 points = 60% equity).
4. **Explain vesting with examples** — Use month-by-month table showing vested vs. unvested shares.
5. **Warn about 83(b) deadline** — Emphasize 30-day deadline with ⚠️ icon.
6. **No single-trigger acceleration** — Explicitly call out why it's bad for acquisitions.
7. **Include drag-along rights** — Prevents holdout founders from blocking exits.

## Cross-References

- Link to `entity.md` for incorporation requirements (must incorporate before issuing stock)
- Link to `ip.md` for PIIA (Proprietary Information and Invention Assignment) details
- Link to `culture.md` for equity philosophy alignment

## After completion

1. Verify checklist has exactly 15 hard questions.
2. Ensure contribution framework includes scoring table with math.
3. Confirm vesting example shows month-by-month breakdown.
4. Write output to `legal/output/founder-agreement-guide.md`.
