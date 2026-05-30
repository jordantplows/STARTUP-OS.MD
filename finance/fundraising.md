---
name: fundraising
description: >
  Generates comprehensive fundraising playbook by reading all finance outputs.
  Creates funding ask with use-of-funds breakdown, target investor list template
  (20 rows), outreach email sequence (5 emails), due diligence checklist (40 items),
  data room structure, and top 30 investor Q&A. Outputs fundraising-playbook.md.
allowed-tools: Read, Write, Edit, Bash
---

# Fundraising Playbook Agent

## Context to load before writing

1. Read `CLAUDE.md` → extract Startup Profile (company, product, team, traction).
2. Read `finance/output/financial-model.md` → extract runway, burn rate, break-even timeline, growth projections.
3. Read `finance/output/pricing-strategy.md` → understand business model and revenue strategy.
4. Read `finance/output/unit-economics.md` → extract LTV:CAC, payback period, gross margin.
5. Read `finance/output/cap-table-scenarios.md` if it exists → understand current ownership and dilution.
6. Read `01-foundation/vision-mission.md` if it exists → extract mission and long-term vision.
7. Read `05-gtm/go-to-market-strategy.md` if it exists → understand customer acquisition strategy.

## Components to Generate

### 1. Funding Ask & Use of Funds
- **Round Type**: Pre-seed / Seed / Series A
- **Target Amount**: $X (with $Y minimum, $Z stretch)
- **Valuation**: Pre-money valuation or SAFE terms (cap + discount)
- **Use of Funds Breakdown**: Allocate across categories (engineering, sales, marketing, ops)
- **Milestones**: What will be achieved with this capital?
- **Runway**: How many months of runway does this provide?

### 2. Target Investor List (20+ rows)
Template with columns:
- Investor Name (Firm)
- Stage Focus (Pre-seed, Seed, A)
- Check Size ($X-$Y)
- Geography
- Thesis/Sweet Spot
- Portfolio Companies (relevant)
- Warm Intro Path
- Priority (High/Med/Low)
- Status (Not Contacted / Reached Out / Meeting Scheduled / Passed)

### 3. Outreach Email Sequence (5 emails)
1. **Initial outreach** (cold or warm intro)
2. **Follow-up #1** (if no response after 5 days)
3. **Follow-up #2** (with traction update after 7 days)
4. **Investor update** (monthly, for those who passed but showed interest)
5. **Closing signal** (when raising is progressing, create FOMO)

### 4. Due Diligence Checklist (40+ items)
Organized by category:
- **Financial**: Financials, cap table, revenue, unit economics
- **Legal**: Incorporation docs, IP assignments, contracts
- **Product**: Demo, roadmap, tech stack
- **Team**: Bios, equity agreements, references
- **Market**: TAM/SAM/SOM, competitive analysis
- **Customers**: Customer list, case studies, NPS

### 5. Data Room Structure
Folder organization with key documents:
- 01-Company Overview
- 02-Financials
- 03-Legal
- 04-Product
- 05-Team
- 06-Market & Customers
- 07-Miscellaneous

### 6. Top 30 Investor Q&A
Most common questions asked during fundraising, with suggested answers:
- Why now?
- How big is the market?
- What's your unfair advantage?
- How do you acquire customers?
- What are your unit economics?
- What's the path to profitability?
- etc.

## Output Format

Write to: `finance/output/fundraising-playbook.md`

Structure:
```markdown
# Fundraising Playbook: [Company Name]

**Generated**: 2026-05-29  
**Fundraising Stage**: [Pre-seed / Seed / Series A]  
**Target Close Date**: [DATE + 3-6 months]

---

## Table of Contents

1. [Funding Ask & Use of Funds](#1-funding-ask--use-of-funds)
2. [Target Investor List](#2-target-investor-list)
3. [Outreach Email Sequence](#3-outreach-email-sequence)
4. [Due Diligence Checklist](#4-due-diligence-checklist)
5. [Data Room Structure](#5-data-room-structure)
6. [Top 30 Investor Q&A](#6-top-30-investor-qa)
7. [Fundraising Timeline](#7-fundraising-timeline)
8. [Terms & Deal Structure](#8-terms--deal-structure)

---

## 1. Funding Ask & Use of Funds

### The Ask

**Round Type**: [Pre-seed / Seed / Series A]  
**Target Raise**: $X,XXX,XXX  
**Minimum**: $XXX,XXX (to hit [milestone])  
**Stretch**: $X,XXX,XXX (to hit [additional milestone])

**Instrument**: SAFE (Simple Agreement for Future Equity) / Priced Round  
**Valuation Cap** (if SAFE): $X,XXX,XXX pre-money  
**Discount** (if SAFE): 20%  
**Dilution** (if priced): XX% at $X,XXX,XXX pre-money valuation

**Current Traction**:
- MRR: $X,XXX (growing X% MoM)
- Customers: XX (X% churn)
- Team: X people (X engineers, X sales, X ops)
- Runway: X months at current burn ($XX,XXX/mo)

---

### Use of Funds

**Total Raise**: $X,XXX,XXX over 18-24 months

| Category | Amount | % | Headcount | Rationale |
|----------|--------|---|-----------|-----------|
| **Engineering & Product** | $XXX,XXX | XX% | +X engineers | Build [Feature A, Feature B] to support [customer segment] |
| **Sales & Customer Success** | $XXX,XXX | XX% | +X AEs, +X CSMs | Scale from $X to $Y ARR; support enterprise customers |
| **Marketing** | $XXX,XXX | XX% | +X marketers | Reduce CAC from $X to $Y; increase inbound pipeline |
| **Operations & Finance** | $XXX,XXX | XX% | +X ops | Hire CFO, implement [systems]; support compliance |
| **Overhead & Contingency** | $XXX,XXX | XX% | — | Office, legal, insurance, buffer |
| **Total** | **$X,XXX,XXX** | **100%** | **+X total** | — |

**Monthly Burn Projection**:
- Current burn: $XX,XXX/month
- Post-raise burn: $XX,XXX/month (ramping over 6 months)
- Runway with $X,XXX,XXX raise: XX months

---

### Milestones to Hit with This Capital

**6 Months (Series Seed)**:
- [ ] Reach $XX,XXX MRR (X% growth)
- [ ] Launch [Feature Y] → expand ICP to [new segment]
- [ ] Hire [X engineers + X sales reps]

**12 Months**:
- [ ] Reach $XXX,XXX MRR ($X,XXX,XXX ARR)
- [ ] XXX customers with < X% churn
- [ ] Break even on contribution margin

**18 Months (Series A Ready)**:
- [ ] $X,XXX,XXX ARR
- [ ] LTV:CAC > 4:1, CAC payback < 10 months
- [ ] Team of XX (X eng, X sales, X marketing)
- [ ] Positioned to raise Series A ($X-$Y,XXX,XXX at $XX-$XX,XXX,XXX valuation)

---

## 2. Target Investor List

### Ideal Investor Profile

**Stage**: [Pre-seed / Seed / Series A]  
**Check Size**: $XXX,XXX - $X,XXX,XXX  
**Geography**: [Bay Area / NYC / Remote-friendly]  
**Thesis**: [B2B SaaS / Vertical SaaS / Developer Tools / etc.]  
**Value-Add**: Intros to customers, help with next round, hands-on operational support

---

### Tier 1: Top Priority (Warm Intros Available)

| Investor Firm | Partner | Stage | Check Size | Thesis | Warm Intro Path | Status |
|---------------|---------|-------|------------|--------|-----------------|--------|
| Acme Ventures | Jane Doe | Seed | $500K-$2M | B2B SaaS, PLG | Via [Advisor X] | Not contacted |
| Beta Capital | John Smith | Pre-seed/Seed | $250K-$1M | Developer tools | Via [Customer Y] | Reached out |
| Gamma Partners | Alice Lee | Seed | $1M-$3M | Vertical SaaS | Via [Investor Z in pre-seed] | Meeting scheduled |
| Delta Fund | Bob Chen | Seed/A | $2M-$5M | Enterprise SaaS | Via [Founder of Portfolio Co W] | Not contacted |
| Epsilon Ventures | Sara Kim | Pre-seed | $100K-$500K | Early B2B | Direct (cold outreach) | Follow-up sent |

---

### Tier 2: Strong Fit (Cold Outreach)

| Investor Firm | Partner | Stage | Check Size | Thesis | Portfolio Relevance | Status |
|---------------|---------|-------|------------|--------|---------------------|--------|
| Zeta Capital | Mike Johnson | Seed | $500K-$2M | SaaS, 0→1 | Invested in [similar co] | Not contacted |
| Eta Ventures | Laura Brown | Seed | $1M-$2M | SMB SaaS | [Portfolio co] in adjacent space | Not contacted |
| Theta Partners | Kevin Wu | Seed/A | $2M-$5M | Infrastructure | Strong ops support | Not contacted |
| Iota Fund | Rachel Green | Seed | $500K-$1.5M | B2B marketplaces | Thesis overlap | Not contacted |
| Kappa Ventures | Tom White | Pre-seed/Seed | $250K-$1M | Remote-first | Geographic fit | Not contacted |

---

### Tier 3: Stretch / Follow-On Potential

| Investor Firm | Partner | Stage | Check Size | Thesis | Notes | Status |
|---------------|---------|-------|------------|--------|-------|--------|
| Lambda Capital | Emma Davis | A | $5M-$15M | Growth-stage SaaS | Too early now, but good for Series A | Monitor |
| Mu Partners | Chris Taylor | Seed | $1M-$3M | International expansion | Geographic mismatch (EMEA-focused) | Low priority |
| Nu Ventures | Sofia Martinez | Pre-seed | $50K-$250K | Checked in earlier; check too small now | Keep warm | Investor update only |
| Xi Fund | David Lee | Seed | $500K-$2M | Passed on pre-seed due to market size concerns | Circling back with traction | Reach out next quarter |

**Total Target List**: 20+ firms  
**Outreach Goal**: 5-10 meetings/week  
**Close Rate Assumption**: 10-20% (2-4 will invest from 20 conversations)

---

## 3. Outreach Email Sequence

### Email 1: Initial Outreach (Warm Intro)

**Subject**: Intro to [Company Name] — [1-sentence value prop]

```
Hi [Investor Name],

[Mutual Contact] suggested I reach out. We're building [Company Name], 
[one-sentence description of what you do and for whom].

We've got early traction: $X,XXX MRR, XX customers, X% MoM growth. We're 
raising a $X,XXX,XXX [round type] to [specific milestone].

Given [Investor Firm]'s focus on [thesis area] and your portfolio companies 
like [Company A] and [Company B], I'd love to share more.

Would you have 15 minutes this week or next for a quick call?

Best,
[Your Name]
[Title]
[Company Name]
[Email] | [Phone] | [Calendar Link]
```

---

### Email 2: Initial Outreach (Cold)

**Subject**: [Company Name] → [Value prop in 4 words]

```
Hi [Investor Name],

I'm [Your Name], founder of [Company Name]. We're [one-sentence description].

Early traction:
• $X,XXX MRR, growing X% MoM
• XX customers (including [Notable Customer])
• Raised $XXX,XXX pre-seed from [Notable Angel/Firm]

We're raising a $X,XXX,XXX [round] to [milestone]. I noticed [Investor Firm] 
invested in [Portfolio Co]—we're solving a similar problem for [adjacent segment].

Could we grab 15 minutes to discuss? [Calendar Link]

Best,
[Your Name]

---
[Company Name] | [URL]
[One-sentence tagline]
```

---

### Email 3: Follow-Up #1 (5 days, no response)

**Subject**: Re: [Previous Subject]

```
Hi [Investor Name],

Following up on my note below. I know you're busy, so I'll keep this short.

Quick update: We just closed [Notable Customer] ($X,XXX/year contract) and hit 
$XX,XXX MRR this month (+X% from last month).

Still raising our $X,XXX,XXX [round]—would love to share the deck if you have 
10 minutes. [Calendar Link]

Best,
[Your Name]
```

---

### Email 4: Follow-Up #2 (10 days, with traction update)

**Subject**: [Company Name] Update: Hit $XX,XXX MRR

```
Hi [Investor Name],

Wanted to share a quick update on [Company Name] (raised $XXX,XXX pre-seed, 
now raising $X,XXX,XXX [round]):

This month:
✓ Hit $XX,XXX MRR (+X% MoM)
✓ Signed [Notable Customer X] and [Notable Customer Y]
✓ Reduced CAC from $X to $Y (improved landing page conversion)

We're [XX]% through the round with commitments from [Investor A] and [Investor B]. 
Closing in [X weeks].

If this is interesting, let's connect this week: [Calendar Link]

Best,
[Your Name]
```

---

### Email 5: Monthly Investor Update (for "passed but interested")

**Subject**: [Company Name] Update — [Month Year]

```
Hi [Investor Name],

Quick monthly update on [Company Name]:

**Metrics** (vs. last month):
• MRR: $XX,XXX (+X%)
• Customers: XX (+X)
• Churn: X% (down from X%)

**Milestones**:
✓ Launched [Feature Y]
✓ Closed [Notable Customer]
✓ Hired [Key Hire, e.g., Head of Sales]

**Next Month**:
• Targeting $XX,XXX MRR
• Launching [Feature Z]
• [Event/Announcement]

Let me know if you'd like to reconnect as we approach [next milestone].

Best,
[Your Name]

---
Full metrics dashboard: [Link to investor update page]
```

---

### Email 6: Closing Signal (FOMO)

**Subject**: [Company Name] — Round closing [DATE]

```
Hi [Investor Name],

Wanted to give you a heads-up: we're closing our $X,XXX,XXX [round] on [DATE] 
and are oversubscribed.

We have $XXX,XXX remaining if you'd like to join. Given [Investor Firm]'s 
expertise in [area], we'd love to have you in the round.

Let me know by [DATE - 3 days] if you'd like to move forward—happy to jump 
on a quick call to answer any questions.

Best,
[Your Name]
```

---

## 4. Due Diligence Checklist

### Financial Due Diligence

- [ ] **Financial Model** (3-year projections: revenue, costs, burn, runway)
- [ ] **Unit Economics** (CAC, LTV, LTV:CAC ratio, payback period, gross margin)
- [ ] **Monthly P&L** (actual vs. budget for past 6-12 months)
- [ ] **Cash Flow Statement** (sources and uses of cash)
- [ ] **Cap Table** (current ownership, option pool, SAFE/convertible notes)
- [ ] **Bank Statements** (last 3 months to verify cash on hand)
- [ ] **Revenue by Customer** (top 10 customers, concentration risk)
- [ ] **Bookings vs. Collections** (show ARR and cash collected)

---

### Legal Due Diligence

- [ ] **Certificate of Incorporation** (Delaware C-Corp preferred)
- [ ] **Bylaws** (current version)
- [ ] **Board Consents** (all board resolutions, especially funding rounds)
- [ ] **Cap Table & Equity Ledger** (Carta export or equivalent)
- [ ] **Stock Purchase Agreements** (for all equity issuances)
- [ ] **IP Assignment Agreements** (all team members signed)
- [ ] **Founder Vesting Agreements** (4-year vest, 1-year cliff)
- [ ] **Employee Offer Letters** (with IP assignment clauses)
- [ ] **Option Grant Agreements** (83(b) elections filed)
- [ ] **Customer Contracts** (template + top 5 customers)
- [ ] **Vendor Contracts** (AWS, Google Workspace, key SaaS tools)
- [ ] **Privacy Policy & Terms of Service** (on website and in-app)
- [ ] **GDPR/CCPA Compliance** (if applicable)
- [ ] **Open Source Licenses** (list of all OSS dependencies)
- [ ] **Patents/Trademarks** (if any)

---

### Product & Technical Due Diligence

- [ ] **Product Demo** (live walkthrough or Loom video)
- [ ] **Product Roadmap** (6-12 month plan)
- [ ] **Tech Stack Overview** (languages, frameworks, infra)
- [ ] **Architecture Diagram** (high-level system design)
- [ ] **Security & Compliance** (SOC 2, GDPR, data encryption)
- [ ] **Code Quality Metrics** (test coverage, deployment frequency)
- [ ] **Uptime & Performance** (SLA, incident history)
- [ ] **Third-Party Dependencies** (APIs, services, risks)
- [ ] **Technical Debt Assessment** (known issues, refactor plans)

---

### Team Due Diligence

- [ ] **Founder Bios** (LinkedIn, resume, why this problem)
- [ ] **Team Org Chart** (current + planned hires)
- [ ] **Equity Ownership** (who owns what, vesting schedules)
- [ ] **Advisor Agreements** (equity grants, roles)
- [ ] **Key Person Insurance** (if applicable)
- [ ] **References** (3-5 professional references for founders)
- [ ] **Background Checks** (if requested)

---

### Market & Customer Due Diligence

- [ ] **TAM/SAM/SOM Analysis** (market sizing from bottom-up)
- [ ] **Competitive Analysis** (top 5 competitors, positioning)
- [ ] **Customer List** (anonymized if needed)
- [ ] **Customer Case Studies** (3-5 detailed success stories)
- [ ] **Customer References** (3-5 customers willing to speak with investors)
- [ ] **NPS or CSAT Scores** (customer satisfaction metrics)
- [ ] **Churn Analysis** (why customers churn, retention cohorts)
- [ ] **Sales Pipeline** (current pipeline value, close rates)

---

### Miscellaneous

- [ ] **Press & Media Coverage** (articles, podcasts, awards)
- [ ] **Pitch Deck** (investor version, 10-15 slides)
- [ ] **One-Pager** (summary: problem, solution, traction, ask)
- [ ] **Investor Updates** (past 3-6 months, if any)
- [ ] **Board Meeting Materials** (past 2-3 meetings, if applicable)

**Total Items**: 40+

---

## 5. Data Room Structure

Set up a **Google Drive or Notion folder** with the following structure:

```
📁 [Company Name] Data Room
│
├── 📁 01-Company Overview
│   ├── One-Pager.pdf
│   ├── Pitch Deck.pdf
│   ├── Vision & Mission.md
│   └── Team Bios.pdf
│
├── 📁 02-Financials
│   ├── Financial Model (3-Year).xlsx
│   ├── Unit Economics.pdf
│   ├── Monthly P&L (Actual).xlsx
│   ├── Cap Table.xlsx (Carta export)
│   └── Bank Statements (Last 3 Months).pdf
│
├── 📁 03-Legal
│   ├── Certificate of Incorporation.pdf
│   ├── Bylaws.pdf
│   ├── Board Resolutions.pdf
│   ├── Stock Purchase Agreements.pdf
│   ├── IP Assignment Agreements (All Team).pdf
│   ├── Founder Vesting Agreements.pdf
│   ├── Employee Offer Letters (Sample).pdf
│   ├── Customer Contract Template.pdf
│   └── Privacy Policy & ToS.pdf
│
├── 📁 04-Product
│   ├── Product Demo (Loom Link).txt
│   ├── Product Roadmap.pdf
│   ├── Tech Stack Overview.pdf
│   ├── Architecture Diagram.png
│   └── Security & Compliance Summary.pdf
│
├── 📁 05-Team
│   ├── Founder Resumes.pdf
│   ├── Org Chart (Current + Planned).pdf
│   ├── Equity Breakdown.xlsx
│   └── References (Contact Info).pdf
│
├── 📁 06-Market & Customers
│   ├── Market Sizing (TAM-SAM-SOM).pdf
│   ├── Competitive Analysis.pdf
│   ├── Customer List (Anonymized).xlsx
│   ├── Case Studies (3-5).pdf
│   ├── Customer References.pdf
│   └── NPS Scores.pdf
│
└── 📁 07-Miscellaneous
    ├── Press Coverage.pdf
    ├── Investor Updates (Last 6 Months).pdf
    └── FAQ.pdf
```

**Access Control**:
- Share with "View" permissions initially
- Upgrade to "Edit" for term sheet stage
- Use a tool like DocSend to track engagement (which docs investors actually open)

---

## 6. Top 30 Investor Q&A

### Category: Vision & Market

**Q1: Why now? What's changed to make this possible today?**  
A: [Answer with macro trend, technology shift, or regulatory change. Example: "Remote work has made [problem] 10x worse; Zoom calls went from 10M → 300M daily users."]

**Q2: How big is the market? (TAM/SAM/SOM)**  
A: TAM: $X,XXX,XXX (top-down from [source])  
SAM: $XXX,XXX (serviceable, based on [segment])  
SOM: $XX,XXX (3-year realistic capture, X% of SAM)

**Q3: Who are your competitors, and why will you win?**  
A: [List 3-5 competitors, then explain unfair advantage: tech, distribution, team, focus]

**Q4: What's your long-term vision (10-year)?**  
A: [Paint a picture: "In 10 years, every [persona] will use [product] to [outcome]. We'll be a $X,XXX,XXX ARR company with X,XXX customers."]

**Q5: What's the biggest risk to the business?**  
A: [Be honest: execution risk, market adoption, competitive threat, regulatory. Then explain mitigation.]

---

### Category: Product & Technology

**Q6: What's your unfair advantage / moat?**  
A: [Network effects / Proprietary data / Deep integrations / Brand / Team expertise]

**Q7: What's on the product roadmap?**  
A: Next 6 months: [Feature A, Feature B]  
Next 12 months: [Feature C, expand to segment Y]

**Q8: How technical is the founding team?**  
A: [Describe: CTOs, engineers, prior experience building X at Company Y]

**Q9: Is your tech defensible, or could [big tech co] build this?**  
A: [Explain why incumbents won't: focus, speed, customer intimacy, existing revenue streams, etc.]

**Q10: What's your tech stack, and why?**  
A: [Backend: X, Frontend: Y, Infrastructure: Z. Rationale: speed, cost, talent availability.]

---

### Category: Business Model & Unit Economics

**Q11: How do you make money?**  
A: B2B SaaS subscription: [3-tier pricing at $X, $Y, $Z/month]

**Q12: What are your unit economics? (LTV:CAC, payback)**  
A: LTV: $X,XXX | CAC: $XXX | LTV:CAC: X.X:1 | Payback: X months

**Q13: What's your gross margin?**  
A: XX% (COGS = cloud + support + payment processing)

**Q14: When will you break even?**  
A: Month XX (QX 202X) at $XXX,XXX MRR

**Q15: What's your pricing strategy?**  
A: Tiered pricing: [Starter $X, Pro $Y, Enterprise custom]. Rationale: [captures value across segments]

---

### Category: Go-to-Market & Customer Acquisition

**Q16: How do you acquire customers today?**  
A: Channel mix: [X% inbound/SEO, Y% paid ads, Z% outbound sales]

**Q17: What's your CAC by channel?**  
A: SEO: $X | Paid: $Y | Outbound: $Z | Blended: $W

**Q18: What's your sales cycle?**  
A: [X days for Starter, Y days for Pro, Z days for Enterprise]

**Q19: Who is your ICP (ideal customer profile)?**  
A: [Company size: X-Y employees, industry: Z, use case: W, budget: $X-$Y]

**Q20: What's your go-to-market motion? (PLG, sales-led, hybrid)**  
A: [Product-Led Growth: free trial → self-serve upgrade] OR [Sales-led: demo → contract]

---

### Category: Traction & Metrics

**Q21: What's your MRR/ARR?**  
A: $XX,XXX MRR ($XXX,XXX ARR), growing X% MoM

**Q22: How many customers do you have?**  
A: XX customers (X on Starter, Y on Pro, Z on Enterprise)

**Q23: What's your churn rate?**  
A: X.X% monthly churn (XX% annual)

**Q24: What's your NRR (net revenue retention)?**  
A: XXX% (expansion offsets churn)

**Q25: Who are your top 5 customers?**  
A: [Company A ($X,XXX/year), Company B ($Y,XXX/year), ...]

**Q26: What's your NPS or CSAT score?**  
A: NPS: XX (based on survey of XX customers)

---

### Category: Team & Hiring

**Q27: Why are you the right team to build this?**  
A: [Founder 1: X years at Company Y building Z; Founder 2: Domain expert in W; hired VP Eng from Company V]

**Q28: What are your biggest hiring needs?**  
A: Next 6 months: [X engineers, X AEs, X marketer]

**Q29: Where is the team located?**  
A: [SF Bay Area / NYC / Remote-first with [X] hubs]

**Q30: How much equity is reserved for the team? (option pool)**  
A: XX% option pool (XX% unallocated)

---

### Category: Fundraising & Use of Funds

**Q31: How much are you raising, and what are the terms?**  
A: $X,XXX,XXX [round] on a [SAFE at $Y,XXX,XXX cap, 20% discount] OR [priced round at $Y,XXX,XXX pre-money]

**Q32: What will you use the funds for?**  
A: [XX% engineering, XX% sales, XX% marketing → milestones: $X ARR, XX customers in 18 months]

**Q33: How much runway does this give you?**  
A: XX months at $XX,XXX/month burn rate

**Q34: What happens if you raise less than the target amount?**  
A: Minimum viable raise is $XXX,XXX to hit [milestone X]. Stretch to $X,XXX,XXX lets us [milestone Y].

**Q35: Who else is investing in this round?**  
A: [Investor A ($XXX,XXX), Investor B ($XXX,XXX), plus angels: [Name C, Name D]]

**Q36: What was your last valuation / last round?**  
A: Raised $XXX,XXX pre-seed at $X,XXX,XXX post-money valuation [date]

---

### Category: Risks & Challenges

**Q37: What keeps you up at night?**  
A: [Be honest: scaling team, product complexity, competitive pressure, market timing]

**Q38: What if [Big Tech Company] launches a competitor?**  
A: [They won't: not strategic priority / We move faster / Customer relationship advantages]

**Q39: What's your biggest weakness as a team?**  
A: [Example: "We need to hire a VP Sales; neither founder has sold before."]

**Q40: What regulatory or compliance issues do you face?**  
A: [GDPR, SOC 2, HIPAA — and how you're addressing them]

---

## 7. Fundraising Timeline

**Typical fundraising process**: 3-6 months from first meeting to closed round

| Week | Activity | Goal |
|------|----------|------|
| 1-2 | **Prep** | Finalize deck, data room, target list (20+ investors) |
| 3-4 | **Outreach Wave 1** | Send 30+ emails, book 10+ meetings |
| 5-6 | **First Meetings** | Pitch, gauge interest, collect feedback |
| 7-8 | **Refine & Follow-Up** | Update deck based on feedback, send to next 20 investors |
| 9-10 | **Partner Meetings** | Second meetings, meet other partners at firm |
| 11-12 | **Term Sheets** | Receive 1-3 term sheets, negotiate terms |
| 13-14 | **Due Diligence** | Share data room, answer questions, customer references |
| 15-16 | **Closing** | Sign term sheet, legal docs, wire funds |

**Key Milestones**:
- **Week 6**: First term sheet or indication of serious interest
- **Week 10**: Final term sheet received
- **Week 16**: Funds in bank

**Pro Tips**:
- Compress timeline by running a "tight process" (create urgency, set closing date)
- Avoid "rolling closes" early-stage (confuses valuation and creates misaligned investors)
- Update all investors weekly during active fundraising (builds FOMO)

---

## 8. Terms & Deal Structure

### Key Terms to Negotiate

**1. Valuation**
- **Pre-money valuation**: $X,XXX,XXX
- **Post-money valuation**: Pre-money + investment amount
- **Dilution**: X% for this round

**2. Liquidation Preference**
- Standard: 1x non-participating (investor gets $X back first, then shares remaining proceeds pro rata)
- Avoid: 2x or participating preferred (investor "double dips")

**3. Board Composition**
- Typical Seed: 3 seats (1 founder, 1 investor, 1 independent)
- Typical Series A: 5 seats (2 founders, 2 investors, 1 independent)

**4. Option Pool**
- Pre-money option pool: XX% (comes out of founder equity)
- Post-money option pool: XX% (comes out of everyone's equity)

**5. Pro Rata Rights**
- Investors get right to invest in future rounds to maintain ownership %

**6. Anti-Dilution Protection**
- Weighted average (standard)
- Avoid: Full ratchet (punitive to founders if down round)

**7. Drag-Along Rights**
- If majority of investors approve a sale, minority must follow

**8. No-Shop Clause**
- Typically 30-45 days: you agree not to solicit other investors while this one does DD

**9. Information Rights**
- Monthly financials, annual audited statements, annual budget

---

### Sample Term Sheet Summary

```
Company: [Company Name]
Investor: [Investor Firm]
Investment Amount: $X,XXX,XXX
Security: Series Seed Preferred Stock
Pre-Money Valuation: $X,XXX,XXX
Post-Money Valuation: $X,XXX,XXX
Price Per Share: $X.XX
Shares Issued: X,XXX,XXX
Founder Dilution: XX%

Liquidation Preference: 1x non-participating
Board Seats: 1 (out of 3 total)
Option Pool: XX% (pre-money)
Pro Rata Rights: Yes
Anti-Dilution: Weighted average
No-Shop Period: 45 days
```

---

## Next Steps

1. **Finalize pitch deck** — Incorporate feedback from advisors by [DATE]
2. **Build data room** — Upload all 40 items to Google Drive by [DATE+7]
3. **Launch outreach** — Send first 30 emails to Tier 1 investors by [DATE+14]
4. **Track pipeline** — Update investor list weekly with meeting status
5. **Close round** — Target close date: [DATE+90 days]
```

## Writing Rules

1. **Customize for stage** — Pre-seed vs. Seed vs. Series A have very different asks, metrics, and investor profiles.
2. **Use real numbers** — Pull MRR, churn, burn from `financial-model.md` and `unit-economics.md`.
3. **Be specific with investors** — Research 20+ actual firms and list them (or provide template for founder to fill in).
4. **Email templates should be copy-pasteable** — Founder should be able to use these verbatim with minor edits.
5. **Due diligence checklist must be comprehensive** — 40+ items covering financial, legal, product, team, market.
6. **Top 30 Q&A should have real answers** — Not "TODO" placeholders; derive from Startup Profile and finance outputs.

## Cross-References

- Link to `financial-model.md` for burn rate, runway, and projections
- Link to `unit-economics.md` for LTV:CAC, payback, gross margin
- Link to `cap-table-scenarios.md` for current ownership and dilution math
- Link to `pricing-strategy.md` for business model and pricing

## After completion

1. Ensure use-of-funds adds up to 100% and ties to headcount plan in financial model.
2. Verify target investor list has 20+ rows with real firm names and stage/check size.
3. Test email templates by sending to advisors for feedback.
4. Update `_progress/tracker.md` with completion status.
