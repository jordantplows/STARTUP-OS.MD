---
name: cap-table
description: >
  Generates cap table scenarios from startup profile. Shows founding equity split,
  dilution waterfall through pre-seed/seed/series A, option pool sizing (pre vs post-money),
  and SAFE note conversion examples with caps and discounts. Outputs cap-table-scenarios.md.
allowed-tools: Read, Write, Edit, Bash
---

# Cap Table Scenarios Agent

## Context to load before writing

1. Read `CLAUDE.md` → extract Startup Profile (founders, team size, company stage, funding raised).
2. Read `finance/output/financial-model.md` → extract hiring plan and team size projections.
3. Read `finance/output/fundraising-playbook.md` if it exists → extract funding amounts and target valuations.
4. Read any existing cap table data if available.

## Scenarios to Generate

### 1. Founding Cap Table
- **Day 1**: Founder equity split (example: 50/50 for co-founders, 60/30/10 for 3 founders)
- **Vesting schedule**: 4-year vest, 1-year cliff
- **Initial option pool**: 10-15% for early employees

### 2. Pre-Seed Round
- **Investment amount**: $250K-$750K
- **Instrument**: SAFE notes with cap and discount
- **Example**: $500K at $5M cap, 20% discount
- **Dilution**: Show how founders and option pool are diluted

### 3. Seed Round
- **Investment amount**: $1M-$3M
- **Instrument**: Priced equity (Series Seed Preferred)
- **Valuation**: $8M-$15M pre-money
- **SAFE conversion**: How pre-seed SAFEs convert
- **Option pool refresh**: Increase pool to 15-20% (pre or post-money)
- **Dilution**: Show cumulative dilution from pre-seed + seed

### 4. Series A
- **Investment amount**: $5M-$15M
- **Valuation**: $25M-$50M pre-money
- **Option pool refresh**: Increase to 20% if needed
- **Dilution**: Full waterfall from founding → Series A

### 5. SAFE Note Conversion Examples
- **Scenario A**: SAFE with cap only (e.g., $5M cap, no discount)
- **Scenario B**: SAFE with discount only (e.g., 20% discount, no cap)
- **Scenario C**: SAFE with cap AND discount (investor gets best outcome)
- **Scenario D**: Multiple SAFEs with different terms (show conversion order and dilution)

### 6. Option Pool Sizing
- **Pre-money pool**: Dilutes founders before new round
- **Post-money pool**: Dilutes everyone (founders + investors) after new round
- **Example**: 15% pre-money pool at $10M pre = $1.5M pool comes out of founders

### 7. Exit Scenarios
- **Scenario**: Company sells for $50M / $100M / $200M
- **Waterfall**: Show who gets what (liquidation preferences, pro rata, common)

## Output Format

Write to: `finance/output/cap-table-scenarios.md`

Structure:
```markdown
# Cap Table Scenarios: [Company Name]

**Generated**: 2026-05-29  
**Company Stage**: [Pre-seed / Seed / Series A]  
**Incorporation**: Delaware C-Corp, [Date]

---

## Table of Contents

1. [Founding Cap Table](#1-founding-cap-table)
2. [Pre-Seed Round (SAFE Notes)](#2-pre-seed-round-safe-notes)
3. [Seed Round (Priced Equity)](#3-seed-round-priced-equity)
4. [Series A](#4-series-a)
5. [SAFE Note Conversion Examples](#5-safe-note-conversion-examples)
6. [Option Pool Sizing (Pre vs. Post-Money)](#6-option-pool-sizing-pre-vs-post-money)
7. [Exit Waterfall Scenarios](#7-exit-waterfall-scenarios)
8. [Key Takeaways & Recommendations](#8-key-takeaways--recommendations)

---

## 1. Founding Cap Table

### Day 1 Equity Split

| Shareholder | Shares | % Ownership | Vesting Schedule | Notes |
|-------------|--------|-------------|------------------|-------|
| **Founder 1** (CEO) | X,XXX,XXX | XX% | 4yr vest, 1yr cliff | [Name] |
| **Founder 2** (CTO) | X,XXX,XXX | XX% | 4yr vest, 1yr cliff | [Name] |
| **Founder 3** (if applicable) | X,XXX,XXX | XX% | 4yr vest, 1yr cliff | [Name] |
| **Option Pool** | X,XXX,XXX | 10-15% | — | For early employees |
| **Total Shares Outstanding** | XX,XXX,XXX | 100% | — | — |

**Assumptions**:
- **Total authorized shares**: XX,XXX,XXX (typically 10M-20M at founding)
- **Common stock price**: $0.001/share (nominal)
- **Board composition**: 2 founders (or all founders if 3+)
- **Voting**: 1 share = 1 vote

**Founder Vesting**:
- **4-year vesting, 1-year cliff**: No shares vest in Year 1. At 12 months, 25% vest. Remaining vest monthly over 36 months.
- **Why vesting matters**: If a founder leaves before 1 year, they forfeit all shares. Protects remaining founders and investors.

**83(b) Election**:
- ✅ **File within 30 days of grant** to pay taxes on $0.001/share (pennies) instead of future fair market value.
- Example: 5M shares at $0.001 = $5,000 taxable. If you wait 2 years and shares are worth $1.00, you owe taxes on $5M.

---

## 2. Pre-Seed Round (SAFE Notes)

### Overview

**Round Size**: $XXX,XXX (e.g., $500,000)  
**Instrument**: SAFE (Simple Agreement for Future Equity)  
**Valuation Cap**: $X,XXX,XXX (e.g., $5M)  
**Discount**: 20%  
**Investors**: Angels, micro-VCs, accelerators

**Why SAFE?**
- No valuation negotiation (deferred to next priced round)
- No board seat, no voting rights (until conversion)
- Fast to close (1-2 weeks vs. 6-8 weeks for priced equity)

---

### Pre-Seed Investment: $500K at $5M Cap, 20% Discount

| Investor | Investment | SAFE Terms | Notes |
|----------|------------|------------|-------|
| Angel 1 | $100,000 | $5M cap, 20% discount | Early supporter, intro to VCs |
| Angel 2 | $75,000 | $5M cap, 20% discount | Domain expert in [industry] |
| Accelerator (YC, etc.) | $125,000 | $5M cap, 20% discount | Standard terms |
| Angel 3 | $50,000 | $5M cap, 20% discount | University connection |
| Micro-VC | $150,000 | $5M cap, 20% discount | Lead investor |
| **Total** | **$500,000** | — | — |

**Cap Table Impact**:
- SAFE notes do NOT show up on cap table until they convert (at next priced round)
- Fully diluted ownership (post-conversion) is modeled below in Seed Round

---

## 3. Seed Round (Priced Equity)

### Overview

**Round Size**: $X,XXX,XXX (e.g., $2M)  
**Instrument**: Series Seed Preferred Stock  
**Pre-Money Valuation**: $X,XXX,XXX (e.g., $10M)  
**Post-Money Valuation**: $X,XXX,XXX (e.g., $12M)  
**Price Per Share**: $X.XX (e.g., $1.20)  
**Lead Investor**: [VC Firm Name]

---

### Step 1: Convert SAFEs

**Pre-seed SAFEs convert at Seed round**.

**Conversion math**:
- **With cap**: SAFE holders get shares as if the company was valued at the cap ($5M), not the Seed pre-money ($10M)
- **With discount**: SAFE holders get shares at 80% of the Seed price per share

**Best outcome for SAFE holder**: Lower of (cap conversion) OR (discount conversion)

**Example**:
- Seed price per share: $1.20
- SAFE cap: $5M → effective price per share = $1.20 × ($5M / $10M) = $0.60/share
- SAFE discount: 20% → effective price per share = $1.20 × 0.80 = $0.96/share
- **SAFE converts at $0.60/share** (cap is better for investor)

**SAFE Conversion Table**:

| Investor | SAFE Amount | Conversion Price | Shares Received | % Ownership (Post-Seed) |
|----------|-------------|------------------|-----------------|------------------------|
| Angel 1 | $100,000 | $0.60 | 166,667 | X.X% |
| Angel 2 | $75,000 | $0.60 | 125,000 | X.X% |
| Accelerator | $125,000 | $0.60 | 208,333 | X.X% |
| Angel 3 | $50,000 | $0.60 | 83,333 | X.X% |
| Micro-VC | $150,000 | $0.60 | 250,000 | X.X% |
| **Total SAFEs** | **$500,000** | — | **833,333** | **X.X%** |

---

### Step 2: Issue Seed Preferred Shares

**Seed investment**: $2M at $1.20/share = 1,666,667 shares

| Investor | Investment | Shares Issued | % Ownership (Post-Seed) |
|----------|------------|---------------|------------------------|
| Lead VC | $1,500,000 | 1,250,000 | XX.X% |
| Co-Investor 1 | $300,000 | 250,000 | X.X% |
| Co-Investor 2 | $200,000 | 166,667 | X.X% |
| **Total Seed** | **$2,000,000** | **1,666,667** | **XX.X%** |

---

### Step 3: Refresh Option Pool (Pre-Money)

**Current option pool**: 10% (from founding)  
**Target option pool**: 15% (to hire 10-15 employees over next 18 months)  
**Pool refresh**: Add 5% **pre-money** (dilutes founders before Seed investors come in)

**Why pre-money?**
- Investors want a certain % pool **after** they invest
- If you add pool post-money, it dilutes them too
- Example: Investors want 15% pool post-money. You currently have 10%. You add 5% pre-money so post-money pool = 15%.

---

### Post-Seed Cap Table

| Shareholder | Shares | % Ownership | Fully Diluted | Notes |
|-------------|--------|-------------|---------------|-------|
| **Founder 1** | X,XXX,XXX | XX.X% | XX.X% | Diluted from XX% → XX.X% |
| **Founder 2** | X,XXX,XXX | XX.X% | XX.X% | Diluted from XX% → XX.X% |
| **Founder 3** (if applicable) | X,XXX,XXX | X.X% | X.X% | Diluted from XX% → X.X% |
| **Option Pool** (pre-money refresh) | X,XXX,XXX | 15.0% | 15.0% | Increased from 10% → 15% |
| | | | | |
| **Pre-Seed Investors (SAFE conversion)** | 833,333 | X.X% | X.X% | $500K at $0.60/share |
| **Seed Lead VC** | 1,250,000 | XX.X% | XX.X% | $1.5M |
| **Seed Co-Investor 1** | 250,000 | X.X% | X.X% | $300K |
| **Seed Co-Investor 2** | 166,667 | X.X% | X.X% | $200K |
| | | | | |
| **Total Outstanding** | XX,XXX,XXX | 100.0% | 100.0% | — |

**Key Metrics**:
- **Total raised to date**: $2.5M ($500K pre-seed + $2M seed)
- **Post-money valuation**: $12M
- **Founder dilution**: Founders went from 85-90% (post-founding) → ~50-60% (post-seed)
- **Investor ownership**: ~25-30% (pre-seed + seed)
- **Option pool**: 15% (room for 10-15 hires)

---

## 4. Series A

### Overview

**Round Size**: $X,XXX,XXX (e.g., $8M)  
**Instrument**: Series A Preferred Stock  
**Pre-Money Valuation**: $XX,XXX,XXX (e.g., $32M)  
**Post-Money Valuation**: $XX,XXX,XXX (e.g., $40M)  
**Price Per Share**: $X.XX (e.g., $4.00)  
**Lead Investor**: [Tier 1 VC Firm]

---

### Step 1: Option Pool Refresh (if needed)

**Current pool**: 15% (8% allocated, 7% unallocated)  
**Target pool post-A**: 18% (to support team growth to 50+ employees)  
**Pool refresh**: Add 3% **pre-money**

---

### Step 2: Issue Series A Preferred Shares

**Series A investment**: $8M at $4.00/share = 2,000,000 shares

| Investor | Investment | Shares Issued | % Ownership (Post-A) |
|----------|------------|---------------|----------------------|
| Series A Lead | $6,000,000 | 1,500,000 | XX.X% |
| Series A Co-Investor | $2,000,000 | 500,000 | X.X% |
| **Total Series A** | **$8,000,000** | **2,000,000** | **XX.X%** |

---

### Post-Series A Cap Table (Full Waterfall)

| Shareholder | Shares | % Ownership | Fully Diluted | Notes |
|-------------|--------|-------------|---------------|-------|
| **Founder 1** | X,XXX,XXX | XX.X% | XX.X% | Diluted from XX% → XX.X% → XX.X% |
| **Founder 2** | X,XXX,XXX | XX.X% | XX.X% | Diluted from XX% → XX.X% → XX.X% |
| **Founder 3** (if applicable) | X,XXX,XXX | X.X% | X.X% | — |
| **Employee Options (allocated)** | X,XXX,XXX | X.X% | X.X% | Vested + unvested |
| **Option Pool (unallocated)** | X,XXX,XXX | X.X% | X.X% | 18% total pool |
| | | | | |
| **Pre-Seed Investors (SAFE)** | 833,333 | X.X% | X.X% | $500K (now heavily diluted) |
| **Seed Lead VC** | 1,250,000 | X.X% | X.X% | $1.5M |
| **Seed Co-Investors** | 416,667 | X.X% | X.X% | $500K combined |
| **Series A Lead** | 1,500,000 | XX.X% | XX.X% | $6M |
| **Series A Co-Investor** | 500,000 | X.X% | X.X% | $2M |
| | | | | |
| **Total Outstanding** | XX,XXX,XXX | 100.0% | 100.0% | — |

**Key Metrics**:
- **Total raised to date**: $10.5M ($500K pre-seed + $2M seed + $8M A)
- **Post-money valuation**: $40M
- **Founder dilution**: Founders went from 85% → 55% → 35-40%
- **Investor ownership**: ~45-50%
- **Option pool**: 18% (10% allocated, 8% unallocated)

**Dilution Summary** (Founder 1 as example):

| Stage | % Ownership | Dilution Event |
|-------|-------------|----------------|
| Founding | 50.0% | — |
| Pre-Seed (SAFE, not dilutive yet) | 50.0% | — |
| Seed + Pool Refresh | 32.5% | -17.5% (SAFE conversion + new investment + pool) |
| Series A + Pool Refresh | 25.0% | -7.5% (new investment + pool) |

---

## 5. SAFE Note Conversion Examples

### Scenario A: SAFE with Cap Only (No Discount)

**SAFE Terms**: $100K investment, $5M cap, no discount  
**Seed Round**: $2M at $10M pre-money, $1.20/share

**Conversion**:
- Effective valuation for SAFE holder = $5M cap
- Effective price per share = $1.20 × ($5M / $10M) = $0.60/share
- Shares received = $100K / $0.60 = 166,667 shares

---

### Scenario B: SAFE with Discount Only (No Cap)

**SAFE Terms**: $100K investment, 20% discount, no cap  
**Seed Round**: $2M at $10M pre-money, $1.20/share

**Conversion**:
- Discounted price per share = $1.20 × 0.80 = $0.96/share
- Shares received = $100K / $0.96 = 104,167 shares

---

### Scenario C: SAFE with Cap AND Discount (Most Common)

**SAFE Terms**: $100K investment, $5M cap, 20% discount  
**Seed Round**: $2M at $10M pre-money, $1.20/share

**Conversion** (investor gets BEST outcome):
1. Cap conversion: $0.60/share → 166,667 shares
2. Discount conversion: $0.96/share → 104,167 shares
3. **Investor takes cap** → 166,667 shares (better deal)

**Rule**: Investor always chooses the conversion method that gives them more shares (lower price per share).

---

### Scenario D: Multiple SAFEs with Different Terms

**Pre-Seed SAFEs**:
- SAFE 1: $100K at $4M cap, 20% discount
- SAFE 2: $150K at $6M cap, 15% discount
- SAFE 3: $50K at $5M cap, no discount

**Seed Round**: $2M at $10M pre-money, $1.20/share

**Conversion**:

| SAFE | Amount | Cap | Discount | Cap Price | Discount Price | Conversion Price | Shares |
|------|--------|-----|----------|-----------|----------------|------------------|--------|
| SAFE 1 | $100K | $4M | 20% | $0.48 | $0.96 | $0.48 | 208,333 |
| SAFE 2 | $150K | $6M | 15% | $0.72 | $1.02 | $0.72 | 208,333 |
| SAFE 3 | $50K | $5M | None | $0.60 | $1.20 | $0.60 | 83,333 |
| **Total** | **$300K** | — | — | — | — | — | **500,000** |

**Key Insight**: Lower cap = better for investor (more shares). Discount matters less if cap is significantly below next round valuation.

---

## 6. Option Pool Sizing (Pre vs. Post-Money)

### The Option Pool Dilemma

Investors typically require a **15-20% option pool** post-funding to ensure you can hire key employees.

**Question**: Do you add the pool **pre-money** or **post-money**?

- **Pre-money pool**: Dilutes founders before new money comes in
- **Post-money pool**: Dilutes everyone (founders + new investors)

**Investor preference**: Pre-money (so they don't get diluted)  
**Founder preference**: Post-money (so they don't get diluted)  
**Reality**: Almost always **pre-money** (investors have leverage)

---

### Example: 15% Option Pool at $10M Pre-Money

**Scenario 1: Pre-Money Option Pool** (Standard)

| Before Pool Refresh | Shares | % |
|---------------------|--------|---|
| Founders | 9,000,000 | 90% |
| Existing Pool | 1,000,000 | 10% |
| **Total** | 10,000,000 | 100% |

**Add 5% pool pre-money** (to get to 15% post-investment):
- Issue 526,316 new shares to pool
- Total shares pre-investment: 10,526,316
- Founders now own: 9,000,000 / 10,526,316 = 85.5% (diluted from 90%)

**Then raise $2M at $10M pre**:
- Price per share = $10M / 10,526,316 = $0.95/share
- New shares issued = $2M / $0.95 = 2,105,263 shares
- Total shares post-investment: 12,631,579

**Post-Money Cap Table**:
- Founders: 9,000,000 / 12,631,579 = 71.2%
- Option Pool: 1,526,316 / 12,631,579 = 12.1% (wait, not 15%?)

**Oops! This is wrong. Correct calculation**:

To have 15% pool **post-money**, work backwards:
- Post-money shares = X
- Pool = 0.15 × X
- Investors = $2M / price per share
- Founders = (starting shares)

**Correct Math** (Pre-Money Pool):
1. Target: 15% pool post-money
2. Post-money valuation = $12M
3. Post-money shares = 12M / price per share
4. Pool shares = 0.15 × post-money shares
5. Work backwards to find pool size

**Simpler Approach** (common practice):
- Investors want 15% pool post-money
- Current pool is 10%
- Add 5% pre-money, **which dilutes founders**

---

### Example: 15% Option Pool at $10M Post-Money

**Scenario 2: Post-Money Option Pool** (Rare, Founder-Friendly)

**Raise $2M at $10M post-money** (= $8M pre-money):
- Price per share = $8M / 10,000,000 = $0.80/share
- New shares issued = $2M / $0.80 = 2,500,000 shares
- Total shares post-investment: 12,500,000

**Add 15% pool post-money**:
- Pool = 0.15 × 12,500,000 = 1,875,000 shares
- These dilute everyone (founders + investors)

**Post-Money Cap Table**:
- Founders: 9,000,000 / 14,375,000 = 62.6%
- Investors: 2,500,000 / 14,375,000 = 17.4%
- Option Pool: 1,875,000 / 14,375,000 = 13.0%

**Comparison**:

| | Pre-Money Pool | Post-Money Pool |
|---|----------------|-----------------|
| Founder % | 71.2% | 62.6% |
| Investor % | 16.7% | 17.4% |
| Pool % | 12.1% | 13.0% |

**Key Insight**: Pre-money pool is more founder-dilutive. Post-money is more investor-dilutive (hence rare).

---

## 7. Exit Waterfall Scenarios

### Liquidation Preferences

**Standard Term**: 1x non-participating liquidation preference

**What this means**:
- Preferred investors (Seed, Series A) get their money back **first**
- Then, remaining proceeds are distributed **pro rata** to all shareholders (common + preferred)
- "Non-participating" = investor chooses (1x preference) OR (pro rata share), whichever is higher

---

### Scenario A: $50M Exit

**Assumptions**:
- Raised $10.5M total ($500K pre-seed + $2M seed + $8M A)
- Post-A cap table: Founders 40%, Employees 10%, Investors 50%
- Series A has 1x liquidation preference

**Waterfall**:

| Step | Description | Amount | Cumulative |
|------|-------------|--------|------------|
| 1 | **Series A Liquidation Preference** | $8M | $8M |
| 2 | **Seed Liquidation Preference** | $2M | $10M |
| 3 | **Pre-Seed Liquidation Preference** | $500K | $10.5M |
| 4 | **Remaining Proceeds** | $39.5M | $50M |
| 5 | **Distribute $39.5M Pro Rata** | — | — |

**Pro Rata Distribution of $39.5M**:
- Founders (40%): $15.8M
- Employees (10%): $3.95M
- Investors (50%): $19.75M

**Total Payout**:
- **Founders**: $15.8M (31.6% of exit)
- **Employees**: $3.95M (7.9% of exit)
- **Investors**: $10.5M (liquidation prefs) + $19.75M (pro rata) = **$30.25M** (60.5% of exit)

**Investor Returns**:
- Invested $10.5M, returned $30.25M = **2.9x multiple**

---

### Scenario B: $100M Exit

**Waterfall**:

| Step | Amount | Cumulative |
|------|--------|------------|
| 1 | Series A Liquidation Preference | $8M | $8M |
| 2 | Seed Liquidation Preference | $2M | $10M |
| 3 | Pre-Seed Liquidation Preference | $500K | $10.5M |
| 4 | Remaining Proceeds | $89.5M | $100M |
| 5 | Distribute $89.5M Pro Rata | — | — |

**Pro Rata Distribution**:
- Founders (40%): $35.8M
- Employees (10%): $8.95M
- Investors (50%): $44.75M

**Total Payout**:
- **Founders**: $35.8M (35.8% of exit)
- **Employees**: $8.95M (8.95% of exit)
- **Investors**: $10.5M + $44.75M = **$55.25M** (55.25% of exit)

**Investor Returns**:
- Invested $10.5M, returned $55.25M = **5.3x multiple**

---

### Scenario C: $200M Exit

At this size, liquidation preferences are less relevant (they're a small % of total exit value).

**Simplified Waterfall** (liquidation prefs + pro rata):

**Total Payout**:
- **Founders (40%)**: $80M
- **Employees (10%)**: $20M
- **Investors (50%)**: $100M

**Investor Returns**:
- Invested $10.5M, returned $100M = **9.5x multiple**

---

### Key Insight: When Do Liquidation Prefs Matter?

**"Down exit" or "Flat exit"**:
- If exit value < total invested, liquidation preferences kick in
- Example: Raised $10.5M, sell for $15M → Investors take $10.5M first, leaving $4.5M for common (founders + employees)
- Founders get ~$1.8M, employees get ~$450K (rough math)

**"Home run exit"**:
- If exit value >> total invested, liquidation prefs are noise
- Example: Raised $10.5M, sell for $500M → Investors get $10.5M pref + $244.75M pro rata = $255.25M (51% of exit)
- Founders get ~$200M (40%), employees get ~$50M (10%)

---

## 8. Key Takeaways & Recommendations

### For Founders

1. **Vest your shares** (4-year, 1-year cliff) and file 83(b) elections within 30 days.
2. **Minimize pre-seed dilution** by raising on SAFEs (no valuation negotiation, fast close).
3. **Negotiate cap, not discount** on SAFEs (cap protects you more in an up-round).
4. **Understand pre-money vs. post-money option pools** (almost always pre-money, which dilutes founders).
5. **Model dilution through Series A** before taking any money (aim to retain 30-50% at Series A).
6. **Track cap table in Carta or similar** (spreadsheets break as complexity grows).

---

### Dilution Benchmarks

| Stage | Typical Founder Ownership | Cumulative Dilution |
|-------|---------------------------|---------------------|
| **Founding** | 85-90% (after 10-15% option pool) | — |
| **Pre-Seed** ($500K SAFE) | 85-90% (SAFE doesn't dilute until conversion) | 0% |
| **Seed** ($2M at $10M pre) | 50-60% (SAFE conversion + new equity + pool refresh) | 30-40% |
| **Series A** ($8M at $30M pre) | 35-45% (new equity + pool refresh) | 45-55% |
| **Series B** ($20M at $80M pre) | 25-35% | 60-70% |

**Rule of Thumb**: Founders should retain **30-50% ownership at Series A** to stay motivated through later rounds.

---

### Option Pool Sizing Guidelines

| Stage | Option Pool Size | Purpose |
|-------|------------------|---------|
| **Founding** | 10-15% | First 5-10 employees |
| **Seed** | 15-18% | Next 10-20 employees (eng, sales, marketing) |
| **Series A** | 18-20% | Scale to 50+ employees (VPs, managers, ICs) |
| **Series B+** | 15-20% (refresh) | Continued growth to 100+ employees |

**Pro Tip**: Don't over-allocate options early. A senior engineer at a 10-person startup might get 0.5-1.0%. The same role at a 100-person company might get 0.05-0.1%.

---

### SAFE Note Best Practices

1. **Use post-money SAFEs** (not pre-money) → clearer dilution math for founders.
2. **Set a reasonable cap** → 2-3x current ARR or 50-70% of expected next round valuation.
3. **Avoid high discounts** → 15-20% is standard; 25%+ signals desperation.
4. **Cap participation** → Don't let SAFEs convert to preferred with full liquidation preferences (keep them as common or junior preferred).
5. **Avoid stacking too many SAFEs** → If you raise $500K on SAFEs, don't raise another $1M on SAFEs. Close a priced round.

---

### Red Flags to Avoid

❌ **Uncapped SAFEs** → Investor gets diluted pro rata at next round (no upside for early risk)  
❌ **Pre-money SAFEs** (old YC standard) → Dilution math is confusing; use post-money SAFEs  
❌ **No founder vesting** → Investors will require it; do it proactively to avoid drama  
❌ **Forgetting 83(b) elections** → Miss the 30-day window = massive tax bill later  
❌ **Raising too much on SAFEs** → $1M+ in SAFEs can cause messy cap table at Series A  
❌ **2x or participating liquidation preferences** → Only in down rounds; very founder-unfriendly  

---

## Next Steps

1. **Create founder vesting agreements** — Work with lawyer to draft 4-year vest, 1-year cliff by [DATE]
2. **File 83(b) elections** — Within 30 days of any stock grants (founders + early employees)
3. **Set up cap table in Carta** — Input all current shareholders, SAFEs, options by [DATE+7]
4. **Model next round dilution** — Use this doc to project Seed or Series A scenarios before fundraising by [DATE+14]
5. **Review with lawyer** — Have startup attorney review cap table structure and SAFE terms by [DATE+30]
```

## Writing Rules

1. **Use realistic numbers** — Pre-seed $500K, Seed $2M, Series A $8M are typical for B2B SaaS in 2026.
2. **Show all math** — Don't just say "founders own 40% after Series A"; show the dilution waterfall step-by-step.
3. **Explain SAFE conversion** — Many founders don't understand cap vs. discount; show examples with actual calculations.
4. **Highlight pre vs. post-money option pool** — This is the #1 misunderstood dilution issue for first-time founders.
5. **Include exit scenarios** — Founders need to see what they take home in a $50M vs. $200M exit.
6. **Flag red flags** — Call out uncapped SAFEs, participating liquidation preferences, no founder vesting, etc.

## Cross-References

- Link to `financial-model.md` for hiring plan (option pool sizing is based on expected headcount)
- Link to `fundraising-playbook.md` for target raise amounts and valuations
- Link to `unit-economics.md` to justify valuation (strong LTV:CAC supports higher valuation)

## After completion

1. Verify dilution math is correct (total ownership always sums to 100%).
2. Ensure SAFE conversion examples show both cap and discount scenarios.
3. Confirm exit waterfalls account for liquidation preferences correctly.
4. Update `_progress/tracker.md` with completion status.
