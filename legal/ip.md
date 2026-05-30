---
name: ip
description: >
  Generates IP protection guidance: IP audit checklist (20 items), PIIA requirements,
  trademark strategy (classes, timeline, cost), open source policy, pre-fundraise IP checklist.
  MUST prepend legal warning to every output section. Writes to legal/output/ip-guide.md
allowed-tools: Read, Write, Edit, Bash
---

# IP Protection Agent

## Context to load before writing

1. Read `CLAUDE.md` → extract Startup Profile (product name, domain, technology stack, open source usage).
2. Read `legal/output/entity-formation.md` if it exists → ensure founders have assigned IP to the company.
3. Read `product/output/feature-roadmap.md` if it exists → identify patentable features or innovations.
4. Read `engineering/tech-stack.md` if it exists → understand open source dependencies and licensing.

## IP Audit Checklist (20 Items)

Generate a comprehensive IP audit checklist covering:

### Founder IP Assignment (5 items)
1. All founders have signed PIIA (Proprietary Information and Invention Assignment Agreement)
2. Pre-existing IP documented (code, patents, trademarks brought into company)
3. Side projects disclosed and excluded from company IP
4. Non-compete agreements signed (1-2 years, if enforceable in state)
5. 83(b) elections filed within 30 days of stock issuance

### Employee/Contractor IP (5 items)
6. All employees sign PIIA before Day 1 (not after)
7. All contractors sign work-for-hire agreements (IP transfers on payment)
8. Offshore contractors have explicit IP assignment clauses (check local law)
9. Former employer IP is NOT used in company codebase (audit for copied code)
10. Consultants/advisors have IP assignment clauses in advisory agreements

### Trademarks (5 items)
11. Company name trademark search completed (USPTO + Google)
12. Product name trademark search completed
13. Logo trademark filed (if custom design)
14. Domain name secured (.com + relevant TLDs)
15. Social media handles secured (Twitter, LinkedIn, Instagram)

### Patents (5 items)
16. Provisional patent applications filed for core innovations (if applicable)
17. Patent search completed to avoid infringement
18. Patent strategy defined (file patents vs. trade secret)
19. Inventor assignment agreements signed (if patenting)
20. Patent budget allocated ($10K-$30K per patent)

## PIIA Requirements

### What is a PIIA?

**Proprietary Information and Invention Assignment Agreement** (also called CIIAA or CIIA)

**Purpose**: Ensures that:
- All work created by founders/employees belongs to the company (not individuals)
- Confidential information stays confidential
- Company owns all IP (code, designs, patents, trademarks)

**Required for**: All founders, employees, contractors, advisors (before they start work)

### Key Clauses in PIIA

1. **Work-for-Hire**: All inventions, code, designs created during employment belong to company
2. **Pre-existing IP Exclusion**: Employee lists IP they already own (e.g., side projects, open source)
3. **Assignment of Inventions**: Any IP created using company resources → company owns it
4. **Confidentiality**: Can't disclose company secrets to third parties
5. **Non-compete** (1-2 years, if enforceable): Can't join competing company or start competing business
6. **Non-solicit** (2 years): Can't recruit employees or customers
7. **Return of Materials**: Must return all company property (laptop, code, documents) on departure

### Common Mistakes to Avoid

❌ **Having employee start before signing PIIA**
- If they build IP on Day 1-7, then refuse to sign PIIA → company doesn't own that IP
- ✅ Fix: Require PIIA signature in offer letter, before Day 1

❌ **Not excluding pre-existing IP**
- Employee brings open-source library they built at last job → company claims ownership → legal fight
- ✅ Fix: PIIA includes "Schedule A" for pre-existing IP exclusions

❌ **Using non-compete in California**
- CA law: Non-competes are unenforceable (except for sale of business)
- ✅ Fix: Use non-solicit instead (enforceable in CA)

❌ **Not having offshore contractors sign IP assignment**
- Contractor in India builds feature → refuses to assign IP → company can't use their code
- ✅ Fix: Work-for-hire clause in contractor agreement (check local law for enforceability)

### PIIA Template Sections

A complete PIIA should include:

1. **Employment Relationship**: Employee is at-will, can be terminated anytime
2. **Confidential Information**: Definition, exclusions (public knowledge), obligations
3. **Ownership of Inventions**: All work product belongs to company
4. **Pre-existing Inventions**: Schedule A lists excluded IP
5. **Assignment of Rights**: Employee assigns all IP rights to company (including future patents)
6. **Moral Rights Waiver**: Employee waives moral rights (important for copyright)
7. **No Conflicts**: Employee has no conflicting obligations (e.g., non-compete from prior employer)
8. **Returning Materials**: Must return company property on departure
9. **Non-compete / Non-solicit**: If enforceable in state
10. **Governing Law**: Usually Delaware or company's operating state

## Trademark Strategy

### What to Trademark

1. **Company name** (e.g., "Acme Corp")
2. **Product name** (e.g., "Acme Pro Dashboard")
3. **Logo** (if custom design)
4. **Tagline** (if unique and used in marketing)

### Trademark Classes

US trademarks are registered by "class" (industry category). Common classes for tech startups:

| Class | Description | Examples |
|-------|-------------|----------|
| **Class 9** | Software, apps, downloadable products | "Acme Pro" (SaaS app) |
| **Class 35** | Business services, advertising, data analysis | "Acme Analytics" (B2B service) |
| **Class 42** | Technology services, SaaS, hosting | "Acme Platform" (cloud hosting) |
| **Class 36** | Financial services, payment processing | "Acme Pay" (fintech) |

**Cost per class**: $350-$400 (USPTO filing fee) + $500-$1,500 (attorney fee)

**Strategy**:
- **Minimum**: Class 9 (software) + Class 42 (SaaS)
- **If B2B SaaS**: Add Class 35 (business services)
- **If fintech**: Add Class 36 (financial services)

### Trademark Timeline

| Step | Timeline | Cost | Notes |
|------|----------|------|-------|
| **1. Trademark search** | 1-2 days | $300-$500 | Check USPTO, Google, domain names |
| **2. File application** | 1 day | $350-$400 per class | File with USPTO online |
| **3. USPTO review** | 3-6 months | $0 | Office action if issues (respond within 6 months) |
| **4. Publication** | 30 days | $0 | Public opposition period |
| **5. Registration** | 1-2 months | $0 | Certificate issued |
| **Total time** | **6-12 months** | **$650-$2,000 per class** | |

### Trademark Strategy by Stage

**Pre-seed (no funding)**:
- ✅ Do: Secure .com domain, social handles, Google company name
- ❌ Skip: Filing trademark (wait until you have $2K+ to spend)

**Post-seed ($500K+ raised)**:
- ✅ Do: File trademark for company name (Class 9 + Class 42)
- ❌ Skip: Logo trademark (unless it's iconic and you have budget)

**Post-Series A ($2M+ raised)**:
- ✅ Do: File trademarks for all product names, logo, tagline
- ✅ Do: File international trademarks (EU, UK, Canada, Australia) if selling there

### Common Trademark Mistakes

❌ **Choosing a generic name**
- "Fast CRM" or "Cloud Analytics" → hard to trademark (descriptive)
- ✅ Use invented words ("Salesforce") or suggestive names ("Slack")

❌ **Not checking domain availability**
- File trademark for "Acme Pro" but AcmePro.com is taken → customers confused
- ✅ Secure .com before filing trademark

❌ **Waiting too long to file**
- Build brand for 2 years → discover competitor filed trademark 6 months ago → must rebrand
- ✅ File trademark within 6 months of launch

## Open Source Policy

### Why You Need an Open Source Policy

**Risks of using open source without policy**:
- Accidentally use GPL-licensed code → must open-source your entire codebase (viral license)
- Contractor includes MIT code without attribution → copyright violation → lawsuit
- Use AGPL library in SaaS → must release source code to customers

**Benefits of policy**:
- Developers know which licenses are OK (MIT, Apache 2.0) vs. banned (GPL, AGPL)
- Reduces legal risk before fundraising or acquisition (investors audit open source usage)
- Speeds up due diligence (can provide license report in minutes)

### Open Source License Categories

#### ✅ Permissive Licenses (APPROVED)
- **MIT License**: Can use, modify, sell, no restrictions (just include license text)
- **Apache 2.0**: Like MIT, plus patent grant (protects against patent lawsuits)
- **BSD (2-clause, 3-clause)**: Like MIT, minimal restrictions

**Use case**: 95% of dependencies should be MIT/Apache 2.0

#### ⚠️ Weak Copyleft Licenses (REQUIRES REVIEW)
- **LGPL (Lesser GPL)**: If you link to LGPL library, your code stays proprietary (but must allow library replacement)
- **MPL (Mozilla Public License)**: Changes to MPL files must be open-sourced, but your code stays proprietary

**Use case**: Avoid unless necessary (e.g., Qt is LGPL, requires commercial license for proprietary apps)

#### ❌ Strong Copyleft Licenses (BANNED)
- **GPL (v2, v3)**: Any code that uses/links to GPL code must be open-sourced (viral)
- **AGPL (Affero GPL)**: Like GPL, but triggers over network (SaaS must release source to users)

**Use case**: NEVER use in proprietary SaaS (forces you to open-source your entire codebase)

### Open Source Policy Template

**Policy goals**:
1. Encourage open source usage (speeds up development, reduces cost)
2. Avoid copyleft licenses (GPL, AGPL) that force open-sourcing company code
3. Track dependencies for due diligence (investors/acquirers will audit)

**Approved licenses** (no review needed):
- MIT
- Apache 2.0
- BSD (2-clause, 3-clause)
- ISC
- Unlicense

**Requires legal review**:
- LGPL
- MPL
- EPL (Eclipse Public License)
- CC BY (Creative Commons Attribution)

**Banned licenses** (do not use):
- GPL (v2, v3)
- AGPL
- CC BY-SA (Creative Commons ShareAlike)

**Audit process**:
1. Run license checker (e.g., `npm install -g license-checker && license-checker`)
2. Flag any non-approved licenses
3. Replace with MIT/Apache alternative, or get legal review

**Quarterly review**: Run license audit every quarter, update policy if new licenses appear

### Contributing to Open Source

**Policy for employees contributing to open source**:
- ✅ Can contribute to MIT/Apache projects during personal time (not company time)
- ✅ Can open-source internal tools (with CTO approval)
- ❌ Can't open-source core product code (trade secret)
- ❌ Can't contribute to projects using company resources without approval

**Process for open-sourcing company code**:
1. Developer proposes open-sourcing a library (e.g., internal logging tool)
2. CTO reviews: Does this reveal trade secrets? Competitive advantage?
3. If approved: Release under MIT or Apache 2.0 (not GPL)
4. Add copyright notice: `Copyright 2026 [Company Name]`

## Pre-Fundraise IP Checklist

**Why this matters**: Investors will audit your IP before funding. Missing items = deal delays or lower valuation.

### Before raising seed/Series A, verify:

- [ ] **1. All founders have signed PIIA**
  - Verify: Check signatures, dates (must be before any code was written)

- [ ] **2. All employees have signed PIIA**
  - Verify: HR records, signed on or before Day 1

- [ ] **3. All contractors have IP assignment clauses**
  - Verify: Check contractor agreements for work-for-hire language

- [ ] **4. No code copied from prior employers**
  - Audit: Run code similarity check, review commit history for suspicious files

- [ ] **5. Open source dependencies audited**
  - Run: `license-checker` or equivalent, verify no GPL/AGPL

- [ ] **6. Trademark filed or pending**
  - Check: USPTO.gov for company name, product name

- [ ] **7. Domain name owned by company**
  - Transfer: Move from personal account to company registrar

- [ ] **8. No outstanding IP disputes**
  - Check: Any cease-and-desist letters, patent infringement claims

- [ ] **9. Pre-existing IP documented**
  - List: Any code/patents founders brought in (excluded from PIIA Schedule A)

- [ ] **10. Patents filed (if applicable)**
  - Verify: Provisional patent applications for core innovations

**Output for investors**: Create "IP Summary" doc with:
- List of all trademarks (filed, pending, registered)
- Open source license report (run `license-checker` and export CSV)
- Confirmation that PIIAs are signed (don't share actual PIIAs unless requested)

## Output Format

Write to: `legal/output/ip-guide.md`

Structure:
```markdown
# IP Protection Guide: [Company Name]

> [!WARNING]
> Not legal advice. Consult a qualified IP attorney before filing trademarks or patents.

**Generated**: 2026-05-29  
**Trademark status**: [Filed / Pending / Registered]  
**PIIA compliance**: [X/Y founders + employees signed]  
**Open source audit**: [Date of last audit]

---

## IP Audit Checklist

> [!WARNING]
> Not legal advice. Consult a qualified IP attorney before making IP decisions.

### Founder IP Assignment

- [ ] **1. All founders signed PIIA** (Proprietary Information and Invention Assignment Agreement)
  - Status: [✅ Complete / ❌ Missing: Founder X]
  - Date signed: [DATE]

- [ ] **2. Pre-existing IP documented**
  - Founder A: [List IP brought into company, or "None"]
  - Founder B: [List IP brought into company, or "None"]

- [ ] **3. Side projects disclosed**
  - Founder A: [Side project names, or "None"]
  - Founder B: [Side project names, or "None"]

- [ ] **4. Non-compete agreements signed**
  - Duration: 1-2 years (if enforceable in state)
  - Note: Non-competes are unenforceable in California; use non-solicit instead

- [ ] **5. 83(b) elections filed**
  - Deadline: 30 days after stock issuance
  - Status: [✅ Filed / ⚠️ Due by DATE]

### Employee/Contractor IP

- [ ] **6. All employees signed PIIA before Day 1**
  - Total employees: [X]
  - Signed: [X/X]
  - Missing: [None / Employee Y]

- [ ] **7. All contractors have work-for-hire agreements**
  - Total contractors: [X]
  - Agreements in place: [X/X]
  - Missing: [None / Contractor Z]

- [ ] **8. Offshore contractors have IP assignment clauses**
  - Note: Check local law (e.g., India requires explicit IP transfer language)

- [ ] **9. No code copied from prior employers**
  - Audit: Run code similarity check (e.g., GitHub commit history review)
  - Status: [✅ Clean / ⚠️ Found suspicious files]

- [ ] **10. Consultants/advisors have IP clauses in advisory agreements**
  - Total advisors: [X]
  - IP clauses: [X/X]

### Trademarks

- [ ] **11. Company name trademark search completed**
  - Search: USPTO.gov + Google
  - Result: [✅ Available / ❌ Conflict found]

- [ ] **12. Product name trademark search completed**
  - Product name: [PRODUCT_NAME]
  - Result: [✅ Available / ❌ Conflict found]

- [ ] **13. Logo trademark filed**
  - Status: [Not filed / Pending / Registered]

- [ ] **14. Domain name secured**
  - Primary: [company.com] (✅ Owned / ❌ Taken)
  - Alternates: [company.io, company.app]

- [ ] **15. Social media handles secured**
  - Twitter: @[handle] (✅ Secured / ❌ Taken)
  - LinkedIn: /company/[handle] (✅ Secured / ❌ Taken)
  - Instagram: @[handle] (✅ Secured / ❌ Taken)

### Patents

- [ ] **16. Provisional patent applications filed** (if applicable)
  - Core innovation: [Description]
  - Status: [Not filed / Provisional filed / Utility pending]

- [ ] **17. Patent search completed**
  - Search: Google Patents, USPTO
  - Result: [✅ No conflicts / ⚠️ Similar patents found]

- [ ] **18. Patent strategy defined**
  - Strategy: [File patents / Keep as trade secret / Defensive publication]

- [ ] **19. Inventor assignment agreements signed**
  - If patenting: All inventors must assign rights to company

- [ ] **20. Patent budget allocated**
  - Cost: $10K-$30K per patent (provisional → utility → maintenance)

---

## PIIA (Proprietary Information and Invention Assignment Agreement)

> [!WARNING]
> Not legal advice. Consult a qualified employment attorney before drafting PIIAs.

### What is a PIIA?

**Purpose**: Legal agreement that ensures:
- All work created by founders/employees belongs to the company (not individuals)
- Confidential information stays confidential
- Company owns all IP (code, designs, patents, trademarks)

**Alternative names**: CIIAA (Confidential Information and Invention Assignment Agreement), CIIA, IP Assignment Agreement

**Required for**: ✅ All founders, ✅ All employees, ✅ All contractors, ✅ All advisors (before they start work)

---

### Key Clauses in PIIA

#### 1. Work-for-Hire
All inventions, code, designs, documents created during employment belong to the company (not the individual).

**Example language**: *"Employee agrees that all work product created during employment is a 'work made for hire' under US copyright law and is the exclusive property of the Company."*

#### 2. Pre-existing IP Exclusion (Schedule A)
Employee lists IP they already own (side projects, open source libraries, patents) so company doesn't claim ownership.

**Example**:
- Schedule A: "Employee owns open-source library 'FastLogger' (MIT license), created before employment."
- Company can't claim ownership of FastLogger, but any improvements made during employment belong to company.

#### 3. Assignment of Inventions
Any IP created using company time, resources, or relating to company business → company owns it.

**Trigger**: If you build a side project at home but it competes with company → company may claim ownership (depends on state law).

#### 4. Confidentiality (NDA)
Can't disclose company secrets (code, financials, customer data) to third parties.

**Exceptions**: Public knowledge, required by law (e.g., subpoena).

#### 5. Non-Compete (1-2 years, if enforceable)
Can't join competing company or start competing business for 1-2 years after departure.

**Enforceability**:
- ✅ Strong: Texas, New York, Delaware
- ⚠️ Limited: Massachusetts (can't block low-wage workers)
- ❌ Unenforceable: California (except for sale of business)

**Alternative for CA**: Use non-solicit instead (enforceable).

#### 6. Non-Solicit (2 years)
Can't recruit employees or customers for 2 years after departure.

**Enforceable**: ✅ All states (including California).

#### 7. Return of Materials
Must return all company property (laptop, code, documents, keys, credit card) on last day.

---

### Common PIIA Mistakes

#### ❌ Mistake 1: Employee starts before signing PIIA

**Scenario**:
- Employee starts Monday, builds feature Week 1
- Friday: HR sends PIIA, employee refuses to sign
- Result: Company doesn't own Week 1 work (employee created it before assignment)

**Fix**: ✅ Require PIIA signature before Day 1 (in offer letter acceptance).

---

#### ❌ Mistake 2: Not excluding pre-existing IP

**Scenario**:
- Employee brings open-source library from prior job
- PIIA has no Schedule A (pre-existing IP list)
- Company claims ownership of library → legal fight with employee's prior employer

**Fix**: ✅ Include Schedule A in PIIA for employee to list pre-existing IP.

---

#### ❌ Mistake 3: Using non-compete in California

**Scenario**:
- CA-based employee signs PIIA with 2-year non-compete
- Employee quits, joins competitor
- Company sues → court throws out non-compete (CA law: unenforceable)

**Fix**: ✅ Use non-solicit instead (enforceable in CA).

---

#### ❌ Mistake 4: Offshore contractor refuses to assign IP

**Scenario**:
- Company hires contractor in India to build feature
- No work-for-hire clause in contract
- Contractor finishes, demands extra payment to assign IP
- Result: Company can't use the code

**Fix**: ✅ Include explicit IP assignment clause (check local law for enforceability).

---

### PIIA Template Sections

A complete PIIA includes:

1. **Employment Relationship**: At-will employment (can be terminated anytime)
2. **Confidential Information**: Definition, exclusions, obligations
3. **Ownership of Inventions**: All work product → company
4. **Pre-existing Inventions**: Schedule A for excluded IP
5. **Assignment of Rights**: Employee assigns IP + future patent rights
6. **Moral Rights Waiver**: Employee waives moral rights (important for copyright in EU/Canada)
7. **No Conflicts**: Employee has no conflicting obligations (e.g., prior employer non-compete)
8. **Returning Materials**: Must return company property on last day
9. **Non-compete / Non-solicit**: If enforceable in state
10. **Governing Law**: Delaware or operating state

**Where to get template**: Clerky ($50), Cooley GO (free), startup attorney ($500-$1,500)

---

## Trademark Strategy

> [!WARNING]
> Not legal advice. Consult a qualified trademark attorney before filing applications.

### What to Trademark

1. ✅ **Company name** (e.g., "Acme Corp")
2. ✅ **Product name** (e.g., "Acme Dashboard Pro")
3. ⚠️ **Logo** (if custom design and iconic)
4. ⚠️ **Tagline** (if unique and heavily marketed)

**Priority**: Company name > Product name > Logo > Tagline

---

### Trademark Classes for Tech Startups

US trademarks are registered by **class** (Nice Classification system). Common classes:

| Class | Description | Examples | Cost per Class |
|-------|-------------|----------|----------------|
| **Class 9** | Software, apps, downloadable products | "Acme Pro" (desktop app, mobile app) | $350 + $500 atty |
| **Class 35** | Business services, advertising, analytics | "Acme Analytics" (B2B SaaS) | $350 + $500 atty |
| **Class 42** | Technology services, SaaS, cloud hosting | "Acme Platform" (cloud service) | $350 + $500 atty |
| **Class 36** | Financial services, payment processing | "Acme Pay" (fintech) | $350 + $500 atty |

**Recommended for most startups**: Class 9 (software) + Class 42 (SaaS) = $1,700-$2,000 total

---

### Trademark Timeline

| Step | Timeline | Cost | Notes |
|------|----------|------|-------|
| **1. Trademark search** | 1-2 days | $300-$500 | Search USPTO, Google, domain registrars |
| **2. File application** | 1 day | $350-$400 per class | File with USPTO (online) |
| **3. USPTO review** | 3-6 months | $0 | Examiner reviews for conflicts; may issue "office action" |
| **4. Office action response** (if needed) | 6 months to respond | $500-$1,500 atty | Fix issues raised by examiner |
| **5. Publication for opposition** | 30 days | $0 | Public can oppose; rare unless obvious conflict |
| **6. Registration** | 1-2 months | $0 | Certificate of registration issued |
| **Total time** | **6-12 months** | **$650-$2,000 per class** | |

**Expedited option**: Pay $800 extra for TEAS Plus (faster review, but stricter requirements).

---

### Trademark Strategy by Startup Stage

#### Pre-seed (no funding, bootstrapped)

**Do**:
- ✅ Trademark search (free via USPTO TESS)
- ✅ Secure .com domain
- ✅ Secure social handles (@company on Twitter, LinkedIn, Instagram)

**Skip**:
- ❌ Filing trademark (wait until you have $2K budget)
- ❌ Logo trademark (unnecessary until brand is established)

---

#### Seed ($500K-$2M raised)

**Do**:
- ✅ File trademark for **company name** (Class 9 + Class 42)
- ✅ File trademark for **main product name** (Class 9 + Class 42)
- ✅ Monitor trademark status (respond to office actions within 6 months)

**Skip**:
- ❌ Logo trademark (unless iconic and heavily marketed)
- ❌ International trademarks (wait until revenue from that region)

---

#### Series A+ ($2M-$10M+ raised)

**Do**:
- ✅ File trademarks for **all product names**
- ✅ File **logo trademark** (if brand is established)
- ✅ File **international trademarks** (EU, UK, Canada, Australia) if selling internationally
- ✅ Trademark tagline (if unique and on all marketing materials)

**Budget**: $5K-$15K for full trademark portfolio

---

### Common Trademark Mistakes

#### ❌ Mistake 1: Choosing a generic or descriptive name

**Examples**:
- "Fast CRM" → Can't trademark (describes what it does)
- "Cloud Analytics Platform" → Too generic

**Fix**: ✅ Use invented words ("Salesforce") or suggestive names ("Slack").

---

#### ❌ Mistake 2: Not checking domain availability

**Scenario**:
- File trademark for "Acme Pro"
- Discover AcmePro.com is taken by cybersquatter asking $50K
- Now stuck with trademark but no matching domain

**Fix**: ✅ Secure .com domain BEFORE filing trademark.

---

#### ❌ Mistake 3: Waiting too long to file

**Scenario**:
- Build brand for 2 years, gain traction
- Discover competitor filed trademark for similar name 6 months ago
- USPTO rejects your application → must rebrand

**Fix**: ✅ File trademark within 6 months of launch (or as soon as you raise seed funding).

---

## Open Source Policy

> [!WARNING]
> Not legal advice. Consult a qualified IP attorney before adopting an open source policy.

### Why You Need an Open Source Policy

**Risks without policy**:
- ❌ Use GPL code → forced to open-source entire codebase (viral license)
- ❌ Use AGPL library in SaaS → must release source code to all customers
- ❌ Contractor includes MIT code without attribution → copyright violation

**Benefits of policy**:
- ✅ Developers know which licenses are safe (MIT, Apache) vs. banned (GPL, AGPL)
- ✅ Reduces legal risk during fundraising/acquisition (investors audit open source usage)
- ✅ Speeds up due diligence (can generate license report in 5 minutes)

---

### Open Source License Types

#### ✅ Permissive Licenses (APPROVED — No Review Needed)

| License | Restrictions | Use in SaaS? | Notes |
|---------|--------------|--------------|-------|
| **MIT** | Must include license text | ✅ Yes | Most common, safest |
| **Apache 2.0** | Must include license + copyright notice | ✅ Yes | Includes patent grant (extra protection) |
| **BSD (2-clause, 3-clause)** | Must include license text | ✅ Yes | Similar to MIT |
| **ISC** | Must include license text | ✅ Yes | Simplified BSD |
| **Unlicense** | Public domain, no restrictions | ✅ Yes | Rarest, but safe |

**Verdict**: ✅ Use these for 95% of dependencies.

---

#### ⚠️ Weak Copyleft Licenses (REQUIRES LEGAL REVIEW)

| License | Restrictions | Use in SaaS? | Notes |
|---------|--------------|--------------|-------|
| **LGPL** (Lesser GPL) | If you modify LGPL library → must release changes; but your code stays proprietary | ⚠️ Maybe | Avoid unless necessary (e.g., Qt framework) |
| **MPL** (Mozilla Public License) | If you modify MPL file → must open-source that file; rest of code stays proprietary | ⚠️ Maybe | Safer than GPL, but still requires review |

**Verdict**: ⚠️ Avoid unless dependency is critical and has no MIT/Apache alternative.

---

#### ❌ Strong Copyleft Licenses (BANNED)

| License | Restrictions | Use in SaaS? | Notes |
|---------|--------------|--------------|-------|
| **GPL (v2, v3)** | Any code that uses GPL → must be open-sourced (viral) | ❌ NO | Forces you to release your entire codebase |
| **AGPL** (Affero GPL) | Like GPL, but triggers over network (SaaS counts as distribution) | ❌ NO | If you use AGPL library in SaaS → must give source code to users |
| **CC BY-SA** (Creative Commons ShareAlike) | Derivative works must use same license | ❌ NO | Not for software, but watch out in docs/images |

**Verdict**: ❌ NEVER use in proprietary SaaS (legal landmine).

---

### Open Source Policy Template

**Approved licenses** (no review needed):
- MIT
- Apache 2.0
- BSD (2-clause, 3-clause)
- ISC
- Unlicense

**Requires legal review** (get CTO + attorney approval):
- LGPL
- MPL
- EPL (Eclipse Public License)
- CC BY (Creative Commons Attribution)

**Banned licenses** (do not use under any circumstances):
- GPL (v2, v3)
- AGPL
- CC BY-SA

**Audit process**:
1. Run license checker quarterly (e.g., `npm install license-checker && npx license-checker --json > licenses.json`)
2. Flag any non-approved licenses
3. Replace with MIT/Apache alternative, OR get legal review

**Quarterly review**: CTO runs audit, updates policy if new licenses appear.

---

### How to Audit Open Source Dependencies

**For Node.js projects**:
```bash
npm install -g license-checker
license-checker --json > licenses.json
```

**For Python projects**:
```bash
pip install pip-licenses
pip-licenses --format=json > licenses.json
```

**For Go projects**:
```bash
go install github.com/google/go-licenses@latest
go-licenses csv ./... > licenses.csv
```

**Review output**:
- ✅ MIT, Apache 2.0, BSD → Safe, no action needed
- ⚠️ LGPL, MPL → Flag for legal review
- ❌ GPL, AGPL → REMOVE IMMEDIATELY (find alternative)

---

### Contributing to Open Source

**Policy for employees**:
- ✅ Can contribute to MIT/Apache projects during personal time (not company time)
- ✅ Can open-source internal tools (with CTO approval)
- ❌ Can't open-source core product code (trade secret)
- ❌ Can't contribute using company email without approval

**Process for open-sourcing company code**:
1. Developer proposes open-sourcing a library (e.g., internal logging tool)
2. CTO reviews: Does this reveal trade secrets? Competitive advantage?
3. If approved: Release under MIT or Apache 2.0 (NOT GPL)
4. Add copyright: `Copyright 2026 [Company Name]`
5. Add license file: Include full MIT/Apache 2.0 text

---

## Pre-Fundraise IP Checklist

> [!WARNING]
> Not legal advice. Consult a qualified IP attorney before fundraising.

**Why this matters**: VCs will audit your IP before funding. Missing items = deal delays, lower valuation, or no funding.

### IP Due Diligence Checklist

- [ ] **1. All founders signed PIIA**
  - Verify: Check signatures, dates (must be BEFORE any code was written)
  - Missing: ❌ BLOCKER (VCs won't fund without founder IP assignment)

- [ ] **2. All employees signed PIIA on or before Day 1**
  - Verify: HR records, employee files
  - Missing: ⚠️ Get signatures immediately (retroactive is risky but better than nothing)

- [ ] **3. All contractors have work-for-hire clauses**
  - Verify: Contractor agreements include IP assignment
  - Missing: ⚠️ Get IP assignment agreements signed (may need to pay retroactively)

- [ ] **4. No code copied from prior employers**
  - Audit: Run code similarity check (e.g., GitHub commit history, file timestamps)
  - Red flag: Code committed on Day 1 (suggests copied from prior job)

- [ ] **5. Open source dependencies audited (no GPL/AGPL)**
  - Run: `license-checker` or equivalent, export CSV
  - Red flag: Any GPL/AGPL libraries (must replace before fundraising)

- [ ] **6. Trademark filed or pending**
  - Check: USPTO.gov for company name, product name
  - Status: [Filed / Pending / Registered / Not filed]

- [ ] **7. Domain name owned by company (not personal account)**
  - Transfer: Move from personal Namecheap/GoDaddy to company account

- [ ] **8. No outstanding IP disputes**
  - Check: Any cease-and-desist letters, patent infringement claims, trademark disputes
  - Red flag: Unresolved dispute = deal blocker

- [ ] **9. Pre-existing IP documented (Schedule A in PIIAs)**
  - List: Any code/patents/trademarks founders brought in (excluded from company IP)

- [ ] **10. Patents filed (if applicable)**
  - Verify: Provisional or utility patents for core innovations
  - Note: Most software startups don't patent (expensive, slow, not required for funding)

---

### Deliverables for Investor Due Diligence

Prepare these documents before fundraising:

1. **IP Summary** (1-page PDF):
   - Trademark status (filed, pending, registered)
   - Patent status (if applicable)
   - Confirmation that all PIIAs are signed

2. **Open Source License Report** (CSV export):
   - Run `license-checker --csv > licenses.csv`
   - Highlight: 100% MIT/Apache 2.0, no GPL/AGPL

3. **PIIA Signature Log** (spreadsheet):
   - List all founders, employees, contractors with signature dates
   - Don't share actual PIIAs unless investor specifically requests

4. **Pre-existing IP Schedule** (if applicable):
   - List any IP founders brought into company (excluded from PIIA Schedule A)

**Timeline**: Prepare these 2 weeks BEFORE first investor meeting (due diligence starts fast).

---

## Next Steps

1. **Run IP audit** → Complete 20-item checklist by [DATE+7 days]
2. **Get missing PIIAs signed** → All founders/employees by [DATE+14 days]
3. **File trademark** → Company name (Class 9 + Class 42) by [DATE+30 days]
4. **Audit open source licenses** → Run `license-checker`, remove GPL/AGPL by [DATE+21 days]
5. **Prepare IP summary for investors** → 1-page doc by [DATE+30 days]
```

## Writing Rules

1. **MUST prepend warning** — Every section begins with `> [!WARNING] Not legal advice. Consult a qualified IP attorney.`
2. **20-item IP audit checklist** — Must include exactly 20 items, grouped by category.
3. **PIIA mistakes section** — Show real scenarios where lack of PIIA causes problems.
4. **Trademark classes table** — Include Class 9, 35, 42, 36 with costs.
5. **Open source license table** — Color-code: ✅ Approved, ⚠️ Review, ❌ Banned.
6. **Pre-fundraise checklist** — Emphasize what VCs will audit (founders must be prepared).

## Cross-References

- Link to `entity.md` for incorporation requirements (PIIA must be signed after incorporation)
- Link to `founder-agreement.md` for equity and vesting context
- Link to `compliance.md` for GDPR/CCPA considerations (data ownership)

## After completion

1. Verify checklist has exactly 20 items.
2. Ensure open source license policy includes audit command (e.g., `license-checker`).
3. Confirm trademark strategy covers Classes 9, 35, 42 with timeline and costs.
4. Write output to `legal/output/ip-guide.md`.
