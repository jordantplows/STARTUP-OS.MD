---
name: entity
description: >
  Generates entity formation guidance: entity type comparison, Delaware C-Corp checklist (25 items),
  EIN/bank/accounting setup, cost comparison. MUST prepend legal warning to every output section.
  Writes to legal/output/entity-formation.md
allowed-tools: Read, Write, Edit, Bash
---

# Entity Formation Agent

## Context to load before writing

1. Read `CLAUDE.md` → extract Startup Profile (company name, founder count, funding plans, target market).
2. Read `finance/output/fundraising.md` if it exists → understand investor requirements for entity structure.
3. Read `strategy/output/roadmap.md` if it exists → understand if international expansion is planned (impacts entity choice).

## Entity Type Comparison

Compare the following entity types for a startup:

1. **Sole Proprietorship / Partnership**
2. **Limited Liability Company (LLC)**
3. **Delaware C-Corporation**
4. **Delaware Public Benefit Corporation (PBC)**
5. **S-Corporation**

For each entity type, analyze:

- **Liability Protection**: Personal asset protection for founders
- **Tax Treatment**: Pass-through vs. double taxation
- **Fundraising Compatibility**: Can accept VC funding? Stock options? SAFEs?
- **Equity Flexibility**: Multiple share classes, convertible notes, option pool
- **Administrative Burden**: Annual fees, compliance requirements, board structure
- **International Expansion**: Ease of opening foreign subsidiaries
- **Exit/Acquisition**: How attractive to acquirers?

**Recommendation Logic**:
- If planning to raise VC funding → Delaware C-Corp
- If bootstrapped + profitable → LLC or S-Corp
- If mission-driven + fundraising → Delaware PBC
- If solo/small partnership → Sole Prop or LLC

## Delaware C-Corp Formation Checklist (25 Items)

Generate a complete checklist for forming a Delaware C-Corp:

### Pre-Formation (5 items)
1. Choose company name and verify availability via Delaware Division of Corporations
2. Confirm all founders agree on equity split and vesting terms
3. Identify registered agent in Delaware (required by law)
4. Draft founder agreements (see `founder-agreement.md`)
5. Determine authorized shares (typically 10,000,000 common shares)

### Formation Documents (5 items)
6. File Certificate of Incorporation with Delaware
7. Draft and adopt Bylaws
8. Issue founder stock certificates
9. File 83(b) elections within 30 days of stock issuance
10. Create stock ledger and capitalization table

### Corporate Structure (5 items)
11. Hold first board meeting and document in minutes
12. Appoint officers (CEO, CFO, Secretary)
13. Establish board composition (founder seats, investor seats, independent seats)
14. Adopt equity incentive plan (stock option pool, typically 10-15% of fully diluted)
15. Set up document storage (Google Drive + DocSend for investor access)

### Compliance & Filings (5 items)
16. Obtain Employer Identification Number (EIN) from IRS
17. Register for state and local taxes (if operating outside Delaware)
18. File Statement of Information in operating state (if applicable)
19. Set up Delaware Franchise Tax payment (due March 1 annually)
20. Register for unemployment insurance (state-specific)

### Banking & Accounting (5 items)
21. Open business bank account (requires EIN, Certificate of Incorporation)
22. Apply for business credit card (Brex, Ramp, or Amex)
23. Set up accounting software (QuickBooks, Xero, or custom ledger)
24. Engage accountant/bookkeeper for monthly reconciliation
25. Set up payroll provider (Gusto, Rippling, or ADP)

## EIN/Bank/Accounting Setup

### EIN (Employer Identification Number)
- **How to apply**: IRS.gov online form (free, instant)
- **Required for**: Opening bank accounts, hiring employees, issuing stock
- **Timeline**: Same-day issuance online

### Business Bank Account
- **Recommended banks**: Mercury, Brex Cash, SVB (for funded startups), Chase Business
- **Required documents**: EIN letter, Certificate of Incorporation, Bylaws, board resolution
- **Timeline**: 1-2 weeks for approval
- **Pro tip**: Open with at least $10K to avoid monthly fees

### Accounting Setup
- **Software options**:
  - QuickBooks Online: $30-$200/month (most common for startups)
  - Xero: $15-$70/month (better international support)
  - Pilot.com: $500+/month (full-service bookkeeping)
- **Chart of accounts**: Standard startup CoA (revenue, COGS, opex categories)
- **Monthly close process**: Reconcile bank, categorize expenses, generate P&L by 10th of next month
- **Annual audit**: Required once you raise Series A+ or reach $10M+ revenue

## Cost Comparison

| Item | Cost | Frequency | Notes |
|------|------|-----------|-------|
| Delaware Certificate of Incorporation filing | $89 | One-time | State fee |
| Registered agent (Delaware) | $100-$300 | Annual | Required by law |
| Delaware Franchise Tax | $450 | Annual | Minimum tax for early-stage |
| Attorney fees (formation) | $2,000-$5,000 | One-time | Can DIY with Stripe Atlas ($500) or Clerky ($1,000) |
| Accounting software | $30-$200 | Monthly | QuickBooks or Xero |
| Bookkeeper | $500-$2,000 | Monthly | Optional in first 6 months |
| Business bank account | $0-$50 | Monthly | Mercury/Brex = $0, Chase = $15-50/mo |
| Business credit card | $0-$500 | Annual | Amex $0, premium cards $500 |
| Payroll provider | $40-$150 | Monthly | Gusto, Rippling |
| State registration fees (if not in DE) | $50-$800 | One-time | Varies by state |
| Annual tax filing (federal + state) | $1,000-$3,000 | Annual | CPA fees |

**Total First Year Cost (DIY formation)**:
- Formation: ~$600-$1,500 (Stripe Atlas or Clerky + state fees)
- Ongoing: ~$200-$500/month (accounting + registered agent + software)
- **Total Year 1**: ~$3,000-$7,500

**Total First Year Cost (Attorney formation)**:
- Formation: ~$5,000-$10,000
- Ongoing: ~$500-$2,000/month (adding bookkeeper)
- **Total Year 1**: ~$15,000-$30,000

## Output Format

Write to: `legal/output/entity-formation.md`

Structure:
```markdown
# Entity Formation Guide: [Company Name]

> [!WARNING]
> Not legal advice. Consult a qualified startup attorney before making entity formation decisions.

**Generated**: 2026-05-29  
**Recommended Entity**: Delaware C-Corporation  
**Reason**: [Based on fundraising plans, equity complexity, and investor expectations]

---

## Entity Type Comparison

> [!WARNING]
> Not legal advice. Consult a qualified startup attorney before making entity formation decisions.

### Delaware C-Corporation ⭐ RECOMMENDED

**Best for**: Startups planning to raise venture capital or issue stock options

✅ **Pros**:
- Gold standard for VC fundraising (investors expect C-Corps)
- Can issue multiple share classes (common, preferred, options)
- Easy to grant stock options with favorable tax treatment (ISOs)
- Well-established legal framework (Delaware Court of Chancery)
- Can accept SAFEs and convertible notes
- Attractive to acquirers (95% of tech exits are C-Corps)

❌ **Cons**:
- Double taxation (corporate income tax + dividend tax)
- Higher compliance costs (~$5K-$10K annually)
- Must hold board meetings and maintain corporate formalities
- Franchise tax in Delaware (minimum $450/year)

**Use case**: ✅ Matches our profile (planning to raise $X from investors)

---

### Limited Liability Company (LLC)

**Best for**: Bootstrapped, profitable businesses with no plans to raise VC

✅ **Pros**:
- Pass-through taxation (no double taxation)
- Flexible ownership structure (membership interests)
- Lower compliance burden (no board meetings required)
- Less expensive to maintain (~$500-$2K annually)

❌ **Cons**:
- VCs typically won't invest in LLCs (no stock/shares)
- Hard to issue employee equity (profit interests vs. stock options)
- Ownership changes require complex K-1 tax forms
- Can't issue SAFEs or convertible notes
- Less attractive to acquirers

**Use case**: ❌ Not recommended if raising VC funding

---

### S-Corporation

**Best for**: Small businesses with <100 shareholders, no international owners

✅ **Pros**:
- Pass-through taxation (like LLC)
- Can issue stock (better for equity grants than LLC)
- Lower self-employment taxes for founders

❌ **Cons**:
- Can't have >100 shareholders (blocks VC rounds)
- Can't have non-US shareholders (blocks international investors)
- Only one class of stock (no preferred shares → no VC funding)
- Loses S-Corp status if venture-backed

**Use case**: ❌ Not compatible with VC fundraising

---

### Delaware Public Benefit Corporation (PBC)

**Best for**: Mission-driven startups (ESG, climate, social impact) that want to balance profit + purpose

✅ **Pros**:
- Same legal structure as C-Corp (can raise VC, issue stock options)
- Legal protection for pursuing social/environmental mission (not just profit maximization)
- Attractive to impact investors
- B-Corp certification easier to obtain

❌ **Cons**:
- Must publish annual benefit report (transparency requirement)
- Board has fiduciary duty to mission + shareholders (can complicate exit decisions)
- Some investors avoid PBCs (perception of "mission over returns")

**Use case**: ✅ Consider if mission-driven, otherwise stick with standard C-Corp

---

## Delaware C-Corp Formation Checklist

> [!WARNING]
> Not legal advice. Consult a qualified startup attorney before filing incorporation documents.

### Pre-Formation

- [ ] **1. Choose company name**
  - Check availability: Delaware Division of Corporations name search
  - Reserve name if needed ($75 fee, holds for 120 days)
  - Secure matching .com domain

- [ ] **2. Founder equity agreement**
  - Document equity split (see `founder-agreement.md`)
  - Agree on vesting schedule (standard: 4-year vest, 1-year cliff)
  - Sign founder stock purchase agreements

- [ ] **3. Identify registered agent**
  - Required: Physical Delaware address for legal service of process
  - Options: Harvard Business Services ($50/yr), Incfile ($119/yr), or attorney

- [ ] **4. Draft founder agreements**
  - Founder stock purchase agreements (with vesting)
  - 83(b) election forms (must file within 30 days of stock issuance)
  - Proprietary Information and Invention Assignment (PIIA) agreements

- [ ] **5. Determine authorized shares**
  - Standard: 10,000,000 common shares authorized
  - Initially issue ~8,000,000 to founders (leaves room for option pool + fundraising)
  - Example split: 2 founders, 3,500,000 each (7M total), reserve 3M for future

### Formation Documents

- [ ] **6. File Certificate of Incorporation**
  - File with Delaware Division of Corporations ($89 fee)
  - Include: Company name, registered agent address, authorized shares, incorporator name
  - Expedited filing: +$100 for same-day, +$50 for 24-hour

- [ ] **7. Draft and adopt Bylaws**
  - Governs internal operations: board meetings, voting, officer roles
  - Use template from Clerky or have attorney draft (~$500-$1,500)

- [ ] **8. Issue founder stock certificates**
  - Create stock certificates for each founder
  - Record in stock ledger with issue date, price per share ($0.0001 typical), vesting schedule
  - Each founder signs stock purchase agreement

- [ ] **9. File 83(b) elections**
  - ⚠️ CRITICAL: Must file within 30 days of stock issuance or face huge tax bill
  - File with IRS via certified mail (keep receipt)
  - Send copy to California FTB if founder is in CA

- [ ] **10. Create stock ledger and cap table**
  - Use Carta, Pulley, or Spreadsheet to track all equity
  - Record: Founder stock, option pool, SAFEs, convertible notes
  - Update after every equity event

### Corporate Structure

- [ ] **11. Hold first board meeting**
  - Document in written consent or meeting minutes
  - Adopt bylaws, approve stock issuances, appoint officers

- [ ] **12. Appoint officers**
  - Required: CEO (or President), CFO (or Treasurer), Secretary
  - Founders can hold multiple roles (common: CEO/Secretary for solo founder)

- [ ] **13. Establish board composition**
  - Pre-seed: Founder(s) only (1-2 seats)
  - Seed: Founders + 1 investor seat (3 total)
  - Series A+: Founders + 2 investor seats + 1 independent (5 total)

- [ ] **14. Adopt equity incentive plan**
  - Create stock option pool (10-15% of fully diluted shares)
  - Board approves plan and individual option grants
  - File with IRS (409A valuation required for option pricing)

- [ ] **15. Set up document storage**
  - Create secure shared folder: Certificate of Incorporation, Bylaws, board minutes, cap table
  - Use Google Drive + DocSend for investor access (watermarked PDFs)

### Compliance & Filings

- [ ] **16. Obtain EIN**
  - Apply online at IRS.gov (Form SS-4, free, instant)
  - Required for: Bank accounts, hiring, tax filings

- [ ] **17. Register for state/local taxes**
  - If operating outside Delaware: Register as foreign corporation in operating state
  - Examples: California ($800 annual franchise tax), New York ($25 filing)

- [ ] **18. File Statement of Information**
  - California: Due within 90 days of incorporation ($25 fee)
  - Other states: Check local requirements

- [ ] **19. Set up Delaware Franchise Tax**
  - Due: March 1 annually
  - Minimum: $450 (authorized shares method)
  - Pay online at corp.delaware.gov

- [ ] **20. Register for unemployment insurance**
  - Required if you have employees
  - Register with state labor department (varies by state)

### Banking & Accounting

- [ ] **21. Open business bank account**
  - Recommended: Mercury (tech startups), Brex Cash (funded startups), SVB (post-Series A)
  - Required docs: EIN letter, Certificate of Incorporation, Bylaws, board resolution
  - Deposit initial capital from founders (if any)

- [ ] **22. Apply for business credit card**
  - Brex (no personal guarantee, requires $50K+ in bank or revenue)
  - Ramp (expense management + credit card)
  - Amex Business Gold (requires personal guarantee)

- [ ] **23. Set up accounting software**
  - QuickBooks Online ($30-$200/mo): Most common, integrates with banks
  - Xero ($15-$70/mo): Better for international
  - Pilot.com ($500+/mo): Full-service bookkeeping (recommended after Series A)

- [ ] **24. Engage accountant/bookkeeper**
  - Month 0-6: Founders can DIY with QuickBooks
  - Month 6+: Hire part-time bookkeeper ($500-$1K/mo)
  - Annual tax filing: Engage CPA ($1K-$3K)

- [ ] **25. Set up payroll provider**
  - Gusto ($40-$150/mo): Best UX, automates tax filings
  - Rippling ($8/employee/mo): Includes HR + IT management
  - ADP/Paychex: Enterprise option (overkill for <10 employees)

---

## EIN, Banking & Accounting Setup

> [!WARNING]
> Not legal advice. Consult a qualified startup attorney and CPA before setting up business finances.

### Employer Identification Number (EIN)

**What it is**: Federal tax ID for your business (like a Social Security Number for companies)

**How to apply**:
1. Go to IRS.gov → "Apply for an EIN Online"
2. Complete Form SS-4 (takes 10 minutes)
3. Receive EIN instantly (save PDF confirmation)

**Required for**:
- Opening business bank accounts
- Hiring employees or contractors (1099 reporting)
- Filing business tax returns
- Issuing stock (for cap table)

**Cost**: Free  
**Timeline**: Instant (online application)

**Pro tip**: Apply as soon as you file Certificate of Incorporation (you'll need EIN within 2 weeks for banking)

---

### Business Bank Account

**Recommended banks for startups**:

| Bank | Best For | Monthly Fee | Notes |
|------|----------|-------------|-------|
| **Mercury** | Pre-seed to Series A | $0 | Best UX, FDIC insured via multiple partners, 4%+ savings APY |
| **Brex Cash** | Funded startups ($50K+) | $0 | Requires $50K in account or revenue, earns points on deposits |
| **Silicon Valley Bank** | Series A+ | $0 (with $25K+ balance) | Gold standard for VC-backed startups, banking + venture debt |
| **Chase Business** | Traditional option | $15/mo (waived with $2K balance) | Easiest for in-person banking |

**Required documents**:
- EIN confirmation letter
- Certificate of Incorporation
- Bylaws
- Board resolution authorizing account opening (template provided by bank)
- Photo ID of signing officers

**Timeline**: 1-2 weeks for approval (Mercury is fastest at 2-3 days)

**Initial deposit recommendation**: $10,000-$50,000 (shows seriousness to vendors, avoids fees)

---

### Accounting Software

**Options**:

#### QuickBooks Online (Recommended for most startups)
- **Cost**: $30-$200/month depending on tier
- **Best for**: Startups with straightforward revenue (SaaS subscriptions, consulting)
- **Pros**: Most CPAs know it, integrates with all banks/payroll, mobile app
- **Cons**: UI is dated, can be slow

#### Xero
- **Cost**: $15-$70/month
- **Best for**: International businesses, multi-currency transactions
- **Pros**: Better UX than QuickBooks, strong non-US tax support
- **Cons**: Fewer US CPA integrations, smaller partner ecosystem

#### Pilot.com (Full-Service Bookkeeping)
- **Cost**: $500-$2,000+/month
- **Best for**: Series A+ startups that want to outsource bookkeeping
- **Pros**: Dedicated bookkeeper, monthly P&L by 10th, handles all reconciliation
- **Cons**: Expensive for pre-revenue startups

**Setup steps**:
1. Connect business bank account and credit card
2. Import chart of accounts (use standard startup CoA template)
3. Categorize expenses (COGS, R&D, S&M, G&A)
4. Set up invoice templates (if you bill customers)
5. Reconcile monthly (by 10th of following month)

**Monthly close process**:
1. Reconcile bank and credit card transactions
2. Categorize all expenses (payroll, software, contractors, office)
3. Record revenue (subscriptions, invoices)
4. Generate P&L and balance sheet
5. Review with founder(s) by 10th of next month

**Annual tax filing**:
- Engage CPA by January for prior year filing (due March 15 for C-Corps)
- Cost: $1,000-$3,000 for federal + state returns
- Audit required: Once you raise Series A+ or exceed $10M revenue

---

## Cost Breakdown

> [!WARNING]
> Not legal advice. Consult a qualified startup attorney and CPA before budgeting for entity formation.

### One-Time Formation Costs

| Item | DIY (Stripe Atlas/Clerky) | Attorney | Notes |
|------|---------------------------|----------|-------|
| Certificate of Incorporation filing (Delaware) | $89 | $89 | State fee (same regardless) |
| Registered agent setup | $50-$120 | Included | Harvard Business Services ($50/yr) |
| Legal document templates (Bylaws, stock docs) | $500-$1,000 | $3,000-$8,000 | Stripe Atlas ($500), Clerky ($1,000), or attorney |
| Attorney consultation | $0-$500 | $2,000-$5,000 | Optional 1-hour consult if DIY |
| EIN filing | $0 | $0 | Free via IRS.gov |
| **TOTAL ONE-TIME** | **$640-$1,700** | **$5,100-$13,100** | |

### Recurring Annual Costs

| Item | Cost | Frequency | Notes |
|------|------|-----------|-------|
| Delaware Franchise Tax | $450 | Annual | Minimum for early-stage (due March 1) |
| Registered agent (Delaware) | $50-$300 | Annual | Harvard Business Services = $50, CT Corp = $300 |
| State registration (if operating outside DE) | $0-$800 | Annual | CA = $800, NY = $25, TX = $0 |
| Business bank account | $0-$50 | Monthly | Mercury/Brex = $0, Chase = $15/mo |
| Accounting software | $30-$200 | Monthly | QuickBooks = $30-200/mo |
| Bookkeeper (optional Year 1) | $500-$2,000 | Monthly | Recommended after Month 6 |
| Payroll provider | $40-$150 | Monthly | Gusto = $40 base + $6/employee |
| Annual tax filing (CPA) | $1,000-$3,000 | Annual | Federal + state return |
| Business insurance (D&O, General Liability) | $500-$2,000 | Annual | Required after fundraising |
| **TOTAL RECURRING (Year 1, no bookkeeper)** | **~$4,000-$8,000** | | |
| **TOTAL RECURRING (Year 1, with bookkeeper)** | **~$10,000-$30,000** | | |

### Total First-Year Cost

**DIY Formation (Recommended for pre-revenue)**:
- Formation: $640-$1,700
- Year 1 recurring: $4,000-$8,000
- **Total: $4,700-$9,700**

**Attorney Formation (Recommended post-funding)**:
- Formation: $5,100-$13,100
- Year 1 recurring (with bookkeeper): $10,000-$30,000
- **Total: $15,000-$43,000**

**Recommendation**: Use Stripe Atlas ($500) or Clerky ($1,000) for formation, upgrade to attorney after seed round.

---

## Formation Service Comparison

| Service | Cost | What's Included | Best For |
|---------|------|----------------|----------|
| **Stripe Atlas** | $500 | DE incorporation, Bylaws, stock docs, 83(b), 2 years AWS credits, Stripe account | Tech startups using Stripe for payments |
| **Clerky** | $1,000 | DE incorporation, Bylaws, founder stock docs, ongoing template access | Most flexible, best document quality |
| **LegalZoom** | $149-$350 + state fees | Basic filing, registered agent | Not recommended (generic docs, no startup-specific terms) |
| **Startup Attorney** | $3,000-$10,000 | Custom docs, 83(b) filing, ongoing advice | Post-funding or complex situations (multiple founders, IP transfers) |

**Recommendation**: 
- **Pre-seed (no funding)**: Stripe Atlas ($500) or Clerky ($1,000)
- **Seed+ (after fundraising)**: Startup attorney (Cooley, Goodwin, Gunderson, Fenwick) — $5K-$10K

---

## Next Steps

1. **File Certificate of Incorporation** — Use Stripe Atlas or Clerky by [DATE+7 days]
2. **Obtain EIN** — Apply at IRS.gov immediately after receiving Certificate of Incorporation
3. **File 83(b) elections** — ⚠️ Must file within 30 days of founder stock issuance (certified mail to IRS)
4. **Open business bank account** — Mercury or Brex by [DATE+14 days]
5. **Set up accounting software** — QuickBooks Online by [DATE+21 days]
```

## Writing Rules

1. **MUST prepend warning** — Every output section begins with `> [!WARNING] Not legal advice. Consult a qualified startup attorney.`
2. **Real costs only** — Use 2026 pricing from Delaware.gov, Stripe Atlas, Clerky, Mercury, QuickBooks.
3. **25-item checklist** — Must have exactly 25 items in the Delaware C-Corp checklist, grouped by phase.
4. **Include 83(b) warning** — Emphasize the 30-day deadline for 83(b) elections (critical tax issue).
5. **Recommend specific services** — Name actual vendors (Mercury, Clerky, Gusto) with pros/cons.
6. **Compare DIY vs. attorney** — Show cost difference clearly (DIY saves $5K-$10K but attorney provides ongoing advice).

## Cross-References

- Link to `founder-agreement.md` for equity split and vesting guidance
- Link to `ip.md` for PIIA (Proprietary Information and Invention Assignment) requirements
- Link to `fundraising.md` for understanding investor entity requirements

## After completion

1. Verify all costs are current (check Delaware.gov, IRS.gov, bank websites).
2. Ensure 83(b) election deadline is prominently called out.
3. Confirm checklist has exactly 25 items.
4. Write output to `legal/output/entity-formation.md`.
