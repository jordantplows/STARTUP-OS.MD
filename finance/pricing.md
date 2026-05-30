---
name: pricing
description: >
  Analyzes market research and competitors, runs Van Westendorp pricing analysis,
  evaluates 5 pricing models, and generates a 3-tier pricing recommendation with
  full rationale. Outputs pricing-strategy.md with comparison tables.
allowed-tools: Read, Write, Edit, Bash
---

# Pricing Strategy Agent

## Context to load before writing

1. Read `CLAUDE.md` → extract Startup Profile (product, target customer, value proposition, competitive landscape).
2. Read `01-foundation/competitive-analysis.md` if it exists → extract competitor pricing.
3. Read `01-foundation/market-sizing.md` if it exists → understand customer segments and willingness to pay.
4. Read `03-product/feature-roadmap.md` if it exists → understand which features are core vs. premium.

## Van Westendorp Price Sensitivity Meter

Run a **Van Westendorp analysis** by defining 4 price points based on the target market:

1. **Too Cheap**: At what price would you question the quality?
2. **Bargain**: At what price would you consider it a great deal?
3. **Getting Expensive**: At what price does it start to feel expensive but you'd still consider it?
4. **Too Expensive**: At what price is it completely out of reach?

**Derive the Acceptable Price Range**:
- Optimal Price Point (OPP) = intersection of "Too Cheap" and "Too Expensive"
- Indifference Price Point (IPP) = intersection of "Bargain" and "Getting Expensive"
- Acceptable range = between OPP and IPP

## Pricing Models to Evaluate

Compare these 5 models for the startup's context:

1. **Flat-rate pricing**: Single price for all features (e.g., $99/month)
2. **Tiered pricing**: 3-4 tiers with increasing features/limits (e.g., Basic/Pro/Enterprise)
3. **Usage-based pricing**: Pay per API call, user, transaction, etc.
4. **Freemium**: Free tier + paid upgrades
5. **Per-seat pricing**: Price per user per month

For each model, analyze:
- **Pros**: Revenue predictability, sales cycle speed, market fit
- **Cons**: Revenue ceiling, churn risk, competitive positioning
- **Best for**: Company stage, product type, customer segment

## Recommended Pricing Structure

Select the best model and generate a **3-tier pricing table**:

| Feature/Limit | Basic | Pro | Enterprise |
|---------------|-------|-----|------------|
| Price | $X/mo | $Y/mo | Custom |
| Core Feature 1 | ✓ | ✓ | ✓ |
| Core Feature 2 | Limited | ✓ | ✓ |
| Advanced Feature 1 | ✗ | ✓ | ✓ |
| Premium Feature 1 | ✗ | ✗ | ✓ |
| Support | Email | Priority | Dedicated |
| Users/Seats | 1-5 | Unlimited | Unlimited |
| API Calls | 1K/mo | 10K/mo | Custom |

**Rationale**:
- Basic: Anchor tier to attract indie users, $X based on Van Westendorp "Bargain" price
- Pro: Target mid-market, priced at $Y (3-5x Basic) to capture most revenue
- Enterprise: Custom pricing with 2-3x Pro as starting point, includes onboarding + SLA

## Output Format

Write to: `finance/output/pricing-strategy.md`

Structure:
```markdown
# Pricing Strategy: [Company Name]

**Generated**: 2026-05-29  
**Target Market**: [SMB / Mid-Market / Enterprise]  
**Pricing Model**: Tiered subscription

---

## Van Westendorp Price Sensitivity Analysis

Based on market research and competitor analysis:

| Price Point | Amount | Rationale |
|-------------|--------|-----------|
| Too Cheap | $X/mo | Below this, customers question quality; competitor Y charges $A |
| Bargain | $Y/mo | Sweet spot for early adopters; Z% below market average |
| Getting Expensive | $Z/mo | Approaching enterprise tools; requires clear ROI |
| Too Expensive | $W/mo | Exceeds budget for target SMB segment |

**Acceptable Price Range**: $Y - $Z per month  
**Optimal Price Point**: $[OPP] (intersection of Too Cheap & Too Expensive curves)

---

## Pricing Model Comparison

### 1. Flat-Rate Pricing
**Example**: $99/month for all features

✅ **Pros**:
- Simple to communicate
- Predictable revenue
- Fast sales cycle

❌ **Cons**:
- Leaves money on table from high-value customers
- Hard to upsell
- No free entry point

**Best for**: Early MVP testing, single-segment products

---

### 2. Tiered Pricing ⭐ RECOMMENDED
**Example**: Basic $X / Pro $Y / Enterprise Custom

✅ **Pros**:
- Captures value across segments (indie, SMB, enterprise)
- Clear upgrade path
- Price discrimination maximizes revenue
- Industry standard for B2B SaaS

❌ **Cons**:
- Requires careful feature segmentation
- Can confuse buyers if tiers are too similar

**Best for**: B2B SaaS with multiple customer segments (✅ matches our profile)

---

### 3. Usage-Based Pricing
**Example**: $0.01 per API call

✅ **Pros**:
- Aligns cost with value
- No barrier to entry
- Scales naturally with customer growth

❌ **Cons**:
- Unpredictable revenue
- Hard to forecast
- Customers fear runaway bills

**Best for**: Infrastructure/API products (Twilio, Stripe)

---

### 4. Freemium
**Example**: Free for 1 user, $X/mo for teams

✅ **Pros**:
- Viral growth potential
- Low CAC
- Try-before-buy reduces friction

❌ **Cons**:
- 95%+ stay on free tier
- High support costs for non-paying users
- Long time to revenue

**Best for**: Consumer products, PLG companies with low marginal cost

---

### 5. Per-Seat Pricing
**Example**: $15/user/month

✅ **Pros**:
- Revenue grows with customer team size
- Standard for collaboration tools
- Easy to understand

❌ **Cons**:
- Incentivizes customers to limit seats
- Penalizes growth
- Not aligned with value if product isn't per-user

**Best for**: Collaboration tools (Slack, Notion)

---

## Recommended Pricing: 3-Tier Model

| | **Starter** | **Professional** | **Enterprise** |
|----------------------|-------------|------------------|----------------|
| **Price** | **$X/month** | **$Y/month** | **Custom** |
| **Target Customer** | Solo founders, indie hackers | Small teams, startups | Companies 50+ employees |
| **Annual Discount** | 10% off | 15% off | 20%+ off |
| | | | |
| **Core Features** | | | |
| Feature A | ✓ | ✓ | ✓ |
| Feature B | ✓ | ✓ | ✓ |
| Feature C | 100/mo | Unlimited | Unlimited |
| | | | |
| **Advanced Features** | | | |
| Feature D | ✗ | ✓ | ✓ |
| Feature E | ✗ | ✓ | ✓ |
| Feature F | ✗ | Limited | ✓ |
| | | | |
| **Premium Features** | | | |
| Feature G | ✗ | ✗ | ✓ |
| Custom integrations | ✗ | ✗ | ✓ |
| SSO / SAML | ✗ | ✗ | ✓ |
| | | | |
| **Support & SLA** | | | |
| Email support | ✓ | ✓ | ✓ |
| Priority support | ✗ | ✓ | ✓ |
| Dedicated CSM | ✗ | ✗ | ✓ |
| 99.9% uptime SLA | ✗ | ✗ | ✓ |
| | | | |
| **Limits** | | | |
| Users/Seats | 1-3 | Unlimited | Unlimited |
| Projects | 5 | Unlimited | Unlimited |
| API calls | 1,000/mo | 10,000/mo | Custom |
| Storage | 5 GB | 50 GB | 1 TB+ |

---

## Pricing Rationale

### Starter ($X/month)
- **Positioned at**: Van Westendorp "Bargain" price ($Y)
- **Anchor purpose**: Attract early adopters, build case studies
- **Expected mix**: 30% of customers (low revenue, high volume)
- **Competitive context**: $Z below Competitor A's entry tier

### Professional ($Y/month)
- **Positioned at**: 3-5x Starter, just below Van Westendorp "Getting Expensive" threshold
- **Target**: This is the revenue driver — 60% of customers should land here
- **Value prop**: Removes key limits (users, API calls) that Starter hits quickly
- **Competitive context**: Priced between Competitor B ($W) and Competitor C ($V)

### Enterprise (Custom, starting $Z/month)
- **Positioned at**: 5-10x Professional base price
- **Target**: 10% of customers, 40-50% of revenue
- **Value prop**: Security (SSO), support (CSM), compliance, custom limits
- **Sales process**: Requires demo + custom contract
- **Competitive context**: On par with Competitor D enterprise tier

---

## Pricing Psychology & Tactics

### Anchoring
- Display Enterprise tier first in comparisons (makes Pro look affordable)
- Show annual pricing with "Save 15%" badge (anchors to higher monthly price)

### Decoy Pricing
- Professional tier is the "obvious" choice (Goldilocks effect)
- Starter is intentionally limited to push users to Pro

### Upgrade Triggers
- Starter → Pro: Hit API limit, need more users, want advanced Feature D
- Pro → Enterprise: Need SSO, compliance, dedicated support

### Annual Discounts
- Starter: 10% off ($X×12×0.9 = $Y/year)
- Professional: 15% off ($Z×12×0.85 = $W/year)
- Enterprise: 20%+ off (negotiated, improves cash flow)

---

## Competitive Positioning

| Competitor | Entry Tier | Mid Tier | Enterprise | Our Position |
|------------|------------|----------|------------|--------------|
| Competitor A | $X | $Y | $Z | 20% cheaper at mid-tier, better feature set |
| Competitor B | Free | $W | $V | No free tier (reduces support burden), premium positioning |
| Competitor C | $M | $N | Custom | Similar pricing, differentiated on [Feature X] |

**Key differentiators**:
- We include [Feature Y] in Pro; competitors charge extra
- Unlimited [Z] in all paid tiers vs. competitors' hard limits
- More transparent pricing (no hidden fees)

---

## Implementation Roadmap

### Phase 1: Launch (Month 1-3)
- Start with 2 tiers only: Starter ($X) + Professional ($Y)
- Offer early-adopter discount: 25% off for first 100 customers (locked in for 12 months)
- Test messaging: "Pricing that grows with you"

### Phase 2: Expansion (Month 4-6)
- Introduce annual plans (10-15% discount)
- Add usage-based overages: $X per 1,000 API calls above plan limit
- A/B test Pro tier price: $Y vs. $Y+10

### Phase 3: Enterprise (Month 7-12)
- Launch Enterprise tier after closing 5+ custom contracts
- Set floor at $Z/month based on average custom deal size
- Build self-serve upgrade flow (Starter → Pro via Stripe)

---

## Pricing Experiments to Run

1. **Test price elasticity**: Increase Pro tier by 10% for new signups, measure conversion impact
2. **Freemium variant**: Offer 14-day free trial vs. free tier with limits (measure activation + conversion)
3. **Feature bundling**: Test moving Feature D from Pro to Starter to increase entry conversions
4. **Annual upfront**: Offer $X rebate for paying annually upfront (improve cash flow)

---

## Next Steps

1. **Validate with 10 target customers** — Run Van Westendorp survey by [DATE+7 days]
2. **Build pricing page** — Design and ship /pricing page with tier comparison by [DATE+14 days]
3. **Implement in Stripe** — Configure products, prices, and upgrade flows by [DATE+21 days]
```

## Writing Rules

1. **Use real competitor pricing** — Research at least 3 direct competitors and cite their pricing.
2. **Show Van Westendorp calculations** — Don't just state the price points; explain how they were derived.
3. **Justify every tier** — Each tier must have a clear target customer and upgrade trigger.
4. **Include pricing psychology** — Reference anchoring, decoy effect, price discrimination.
5. **Be specific with features** — Don't use "Feature A/B/C"; use actual product features from the roadmap.
6. **Link to financial model** — These prices will be used in `financial-model.md` revenue projections.

## Cross-References

- Link to `competitive-analysis.md` for competitor pricing
- Link to `feature-roadmap.md` for feature tiering decisions
- Reference `financial-model.md` for revenue impact of pricing changes

## After completion

1. Ensure pricing is competitive but defensible (not the cheapest, not the most expensive).
2. Verify upgrade path is clear (what makes a customer move from Starter → Pro → Enterprise).
3. Update `_progress/tracker.md` with completion status.
