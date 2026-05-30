---
name: compliance
description: >
  Checks compliance posture by reading legal outputs and tech stack, then
  evaluates GDPR 20-item checklist, CCPA requirements, SOC 2 basic readiness,
  and generates priority-ordered remediation plan with specific action items.
department: security
triggers: ["/startup-os security"]
allowed-tools: [Read, Write, Bash]
reads:
  - CLAUDE.md
  - legal/output/privacy-policy.md
  - legal/output/terms-of-service.md
  - product/output/prd-filled.md
  - engineering/output/tech-stack.md
writes:
  - _reports/security/compliance-gaps.md
---

## What this agent does

Performs compliance readiness assessment by reading product specification, legal documents, and technical architecture. Evaluates against GDPR 20-item checklist (consent, data minimization, right to deletion, breach notification, DPO requirements, etc.), CCPA requirements (disclosure, opt-out, data deletion), SOC 2 Type I basic readiness (security controls, access management, monitoring). Identifies gaps, assigns priority (P0 blocker/P1 high/P2 medium), estimates effort, and generates actionable remediation roadmap. Writes to _reports/security/compliance-gaps.md.

## Instructions

1. Read CLAUDE.md for business model and data processing details
2. Read legal outputs for current privacy policy and terms
3. Read product spec for data collection and user flows
4. Read tech stack for infrastructure and security controls
5. Evaluate GDPR checklist (20 items covering all articles)
6. Evaluate CCPA requirements (6 key requirements)
7. Evaluate SOC 2 Type I readiness (5 trust service categories)
8. Identify gaps with priority (P0/P1/P2) and effort estimates
9. Generate remediation roadmap with specific actions and timelines
10. Include compliance certification timeline if pursuing formal compliance
11. Write to _reports/security/compliance-gaps.md

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

async function assessCompliance() {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  })

  const projectRoot = process.cwd()
  
  console.log('\n=== Compliance Assessment ===\n')
  console.log('Evaluating GDPR, CCPA, and SOC 2 readiness...\n')

  // Read context files
  let claudeMd = ''
  let privacyPolicy = ''
  let termsOfService = ''
  let prd = ''
  let techStack = ''

  try {
    claudeMd = readFileSync(join(projectRoot, 'CLAUDE.md'), 'utf-8')
  } catch (err) {
    console.warn('Warning: CLAUDE.md not found')
  }

  try {
    privacyPolicy = readFileSync(join(projectRoot, 'legal', 'output', 'privacy-policy.md'), 'utf-8')
  } catch (err) {
    console.warn('Warning: privacy-policy.md not found')
  }

  try {
    termsOfService = readFileSync(join(projectRoot, 'legal', 'output', 'terms-of-service.md'), 'utf-8')
  } catch (err) {
    console.warn('Warning: terms-of-service.md not found')
  }

  try {
    prd = readFileSync(join(projectRoot, 'product', 'output', 'prd-filled.md'), 'utf-8')
  } catch (err) {
    console.warn('Warning: prd-filled.md not found')
  }

  try {
    techStack = readFileSync(join(projectRoot, 'engineering', 'output', 'tech-stack.md'), 'utf-8')
  } catch (err) {
    console.warn('Warning: tech-stack.md not found')
  }

  const fullContext = `
# Compliance Context

## Startup Profile
${claudeMd}

## Privacy Policy
${privacyPolicy}

## Terms of Service
${termsOfService}

## Product Specification
${prd}

## Tech Stack
${techStack}
  `.trim()

  // Generate compliance assessment via Claude API
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 16000,
    messages: [
      {
        role: 'user',
        content: `You are a compliance expert specializing in GDPR, CCPA, and SOC 2. Based on this context:

${fullContext}

Create a comprehensive compliance assessment with this structure:

# Compliance Gap Assessment

**Company**: [Company Name]
**Generated**: ${new Date().toISOString().split('T')[0]}
**Assessment Scope**: GDPR, CCPA, SOC 2 Type I
**Reviewer**: [Security/Legal Lead]

---

## Executive Summary

[3-4 paragraphs covering:
- Which regulations apply based on business model and customers
- Overall compliance readiness (Red/Yellow/Green)
- Top 3-5 critical gaps that are blockers
- Estimated effort to reach basic compliance
- Recommended next steps]

**Compliance Status Summary**:
- **GDPR**: [Compliant / Partially Compliant / Non-Compliant] — [X]% requirements met
- **CCPA**: [Compliant / Partially Compliant / Non-Compliant / Not Applicable] — [X]% requirements met
- **SOC 2**: [Ready / Partially Ready / Not Ready] — [X]% controls in place

---

## Applicability Assessment

### Does GDPR Apply?

GDPR applies if you:
- Offer goods/services to EU residents, OR
- Monitor behavior of EU residents

**Assessment**: [Yes/No/Partial]

**Reasoning**: [Based on product description, do you target EU customers? Do you process EU resident data?]

**Implications**: 
- If Yes: Full GDPR compliance required (fines up to €20M or 4% revenue)
- If Partial: Implement GDPR best practices to prepare
- If No: Still recommended for best practices and future-proofing

---

### Does CCPA Apply?

CCPA applies if you:
- Do business in California, AND
- Meet one of: 
  - $25M+ annual revenue, OR
  - 50,000+ consumers/households/devices, OR
  - 50%+ revenue from selling consumer data

**Assessment**: [Yes/No/Likely Future]

**Reasoning**: [Based on business model and scale]

**Implications**:
- If Yes: Full CCPA compliance required (fines up to $7,500 per violation)
- If Likely Future: Start implementing now
- If No: Consider CCPA best practices anyway

---

### Should You Pursue SOC 2?

SOC 2 Type I is valuable if you:
- Sell B2B SaaS to enterprises
- Handle sensitive customer data
- Need to pass customer security reviews

**Assessment**: [Yes/No/Future]

**Reasoning**: [Based on customer segment and data sensitivity]

**Implications**:
- If Yes: 6-12 month process, $20-50K cost, but unlocks enterprise deals
- If Future: Start implementing controls now, certify when needed
- If No: Implement security best practices without formal certification

---

## GDPR Compliance Checklist

### Data Protection Principles (Articles 5-6)

| Requirement | Status | Gap | Priority | Effort |
|-------------|--------|-----|----------|--------|
| **Lawful basis for processing** — Consent, contract, or legitimate interest documented | [✅/⚠️/❌] | [Description of gap] | P0/P1/P2 | [1-5 days] |
| **Purpose limitation** — Data only used for stated purposes | [✅/⚠️/❌] | [Description] | P1/P2 | [1-3 days] |
| **Data minimization** — Only collect necessary data | [✅/⚠️/❌] | [Description] | P1 | [2-5 days] |
| **Accuracy** — Mechanism to correct inaccurate data | [✅/⚠️/❌] | [Description] | P1 | [3-5 days] |
| **Storage limitation** — Data retention policy defined | [✅/⚠️/❌] | [Description] | P1 | [1-2 days] |

---

### Transparency & User Rights (Articles 12-22)

| Requirement | Status | Gap | Priority | Effort |
|-------------|--------|-----|----------|--------|
| **Privacy Policy** — Clear, accessible, GDPR-compliant | [✅/⚠️/❌] | [Description] | P0 | [2-3 days] |
| **Cookie consent** — Banner with granular choices | [✅/⚠️/❌] | [Description] | P0 | [1-2 days] |
| **Right to access** — Users can export their data | [✅/⚠️/❌] | [Description] | P0 | [5-10 days] |
| **Right to rectification** — Users can update their data | [✅/⚠️/❌] | [Description] | P1 | [2-3 days] |
| **Right to erasure** — Users can delete their account and data | [✅/⚠️/❌] | [Description] | P0 | [5-10 days] |
| **Right to data portability** — Export in machine-readable format | [✅/⚠️/❌] | [Description] | P1 | [3-5 days] |
| **Right to object** — Users can opt out of processing | [✅/⚠️/❌] | [Description] | P1 | [2-3 days] |
| **Automated decision-making notice** — If using AI/ML | [✅/⚠️/❌] | [Description] | P1 | [1 day] |

---

### Security & Breach (Articles 32-34)

| Requirement | Status | Gap | Priority | Effort |
|-------------|--------|-----|----------|--------|
| **Encryption at rest** — Database and backups encrypted | [✅/⚠️/❌] | [Description] | P0 | [1-3 days] |
| **Encryption in transit** — HTTPS everywhere | [✅/⚠️/❌] | [Description] | P0 | [1 day] |
| **Access controls** — RBAC and least privilege | [✅/⚠️/❌] | [Description] | P0 | [3-5 days] |
| **Audit logging** — Track data access and changes | [✅/⚠️/❌] | [Description] | P1 | [5-7 days] |
| **Breach notification process** — 72-hour notification plan | [✅/⚠️/❌] | [Description] | P0 | [1-2 days] |

---

### Accountability (Articles 24-36, 37-39)

| Requirement | Status | Gap | Priority | Effort |
|-------------|--------|-----|----------|--------|
| **Data Protection Officer (DPO)** — Required if large-scale processing | [✅/⚠️/❌/N/A] | [Description] | P1/N/A | [N/A] |
| **Data Processing Agreement (DPA)** — With all vendors | [✅/⚠️/❌] | [Description] | P0 | [2-3 days] |
| **Data Protection Impact Assessment (DPIA)** — If high-risk processing | [✅/⚠️/❌/N/A] | [Description] | P1/N/A | [3-5 days] |
| **Records of processing activities** — Documentation of data flows | [✅/⚠️/❌] | [Description] | P1 | [2-5 days] |
| **Privacy by design** — Security built into product development | [✅/⚠️/❌] | [Description] | P1 | [Ongoing] |

**GDPR Summary**: [X/20] requirements fully met, [Y/20] partial, [Z/20] gaps

---

## CCPA Compliance Checklist

| Requirement | Status | Gap | Priority | Effort |
|-------------|--------|-----|----------|--------|
| **Privacy Policy disclosure** — What data collected, why, and who it's shared with | [✅/⚠️/❌] | [Description] | P0 | [1-2 days] |
| **"Do Not Sell My Personal Information" link** — If selling data | [✅/⚠️/❌/N/A] | [Description] | P0/N/A | [1 day] |
| **Right to know** — Users can request data disclosure | [✅/⚠️/❌] | [Description] | P0 | [3-5 days] |
| **Right to delete** — Users can request deletion | [✅/⚠️/❌] | [Description] | P0 | [5-10 days] |
| **Right to opt-out** — Of data sales (if applicable) | [✅/⚠️/❌/N/A] | [Description] | P0/N/A | [2-3 days] |
| **Non-discrimination** — No penalties for exercising rights | [✅/⚠️/❌] | [Description] | P1 | [1 day] |

**CCPA Summary**: [X/6] requirements met (or N/A)

---

## SOC 2 Readiness Assessment

SOC 2 evaluates 5 Trust Service Categories. Type I assesses controls at a point in time.

### CC1: Control Environment

| Control | Status | Gap | Priority | Effort |
|---------|--------|-----|----------|--------|
| Security policies documented | [✅/⚠️/❌] | [Description] | P1 | [3-5 days] |
| Code of conduct | [✅/⚠️/❌] | [Description] | P2 | [1-2 days] |
| Organizational structure defined | [✅/⚠️/❌] | [Description] | P2 | [1 day] |
| HR policies (background checks) | [✅/⚠️/❌] | [Description] | P1 | [2-3 days] |

---

### CC2: Communication & Information

| Control | Status | Gap | Priority | Effort |
|---------|--------|-----|----------|--------|
| Internal communication channels | [✅/⚠️/❌] | [Description] | P2 | [1 day] |
| External communication (status page) | [✅/⚠️/❌] | [Description] | P1 | [1-2 days] |
| Reporting mechanisms (security@) | [✅/⚠️/❌] | [Description] | P1 | [1 day] |

---

### CC3: Risk Assessment

| Control | Status | Gap | Priority | Effort |
|---------|--------|-----|----------|--------|
| Threat model documented | [✅/⚠️/❌] | [Description] | P1 | [5-7 days] |
| Risk register maintained | [✅/⚠️/❌] | [Description] | P1 | [2-3 days] |
| Quarterly risk reviews | [✅/⚠️/❌] | [Description] | P2 | [Ongoing] |

---

### CC4: Monitoring Activities

| Control | Status | Gap | Priority | Effort |
|---------|--------|-----|----------|--------|
| Logging & monitoring | [✅/⚠️/❌] | [Description] | P0 | [3-5 days] |
| Security alerts | [✅/⚠️/❌] | [Description] | P1 | [2-3 days] |
| Incident response plan | [✅/⚠️/❌] | [Description] | P0 | [3-5 days] |

---

### CC5: Control Activities

| Control | Status | Gap | Priority | Effort |
|---------|--------|-----|----------|--------|
| Access control (RBAC) | [✅/⚠️/❌] | [Description] | P0 | [5-7 days] |
| Change management process | [✅/⚠️/❌] | [Description] | P1 | [2-3 days] |
| Vulnerability management | [✅/⚠️/❌] | [Description] | P1 | [3-5 days] |
| Data backup & recovery | [✅/⚠️/❌] | [Description] | P0 | [2-3 days] |
| Vendor management | [✅/⚠️/❌] | [Description] | P1 | [2-3 days] |

**SOC 2 Summary**: [X/20] controls in place, [Y/20] partial, [Z/20] missing

---

## Critical Gaps (P0) — Blockers for Compliance

${/* Generate based on context — prioritize gaps marked P0 above */}

### Gap 1: [Title]

**Regulation**: GDPR / CCPA / SOC 2

**Requirement**: [Specific article or control]

**Current State**: [What exists today]

**Gap**: [What's missing]

**Risk**: [What could go wrong — fines, reputational damage, customer churn]

**Remediation**:
1. [Specific action step 1]
2. [Specific action step 2]
3. [Specific action step 3]

**Owner**: [Engineering / Legal / Ops]

**Effort**: [X] days

**Deadline**: [DATE+7 days] (critical)

---

[Repeat for all P0 gaps]

---

## High Priority Gaps (P1)

[Same structure, but P1 gaps with longer timelines]

---

## Medium Priority Gaps (P2)

[Same structure, P2 gaps for later]

---

## Remediation Roadmap

### Phase 1: Critical Compliance (Weeks 1-2)

**Goal**: Address all P0 gaps — blockers for basic compliance

**Tasks**:
1. [Task from P0 Gap 1]
2. [Task from P0 Gap 2]
3. [Task from P0 Gap 3]

**Deliverables**:
- Privacy policy updated and published
- User data export/deletion flows implemented
- DPAs signed with all vendors
- Breach notification process documented

**Success Criteria**: Can legally operate in EU/CA, pass basic customer security reviews

---

### Phase 2: High Priority (Weeks 3-6)

**Goal**: Address P1 gaps — strengthen compliance posture

**Tasks**:
1. [Task from P1 Gap 1]
2. [Task from P1 Gap 2]
3. [Task from P1 Gap 3]

**Deliverables**:
- Audit logging implemented
- Data retention policy automated
- Security monitoring in place
- Risk assessment completed

**Success Criteria**: Can confidently claim GDPR/CCPA compliance, ready for SOC 2 audit

---

### Phase 3: SOC 2 Certification (Months 3-6)

**Goal**: Achieve SOC 2 Type I certification (if pursuing)

**Tasks**:
1. Complete all SOC 2 control implementations
2. Hire external auditor (Deloitte, PwC, Vanta, Drata)
3. Run controls for 3 months (Type II) or point-in-time (Type I)
4. Complete audit and remediate findings
5. Receive SOC 2 report

**Cost**: $20-50K for audit

**Deliverables**: SOC 2 Type I report

**Success Criteria**: Can share SOC 2 report with enterprise customers

---

## Vendor Compliance

Ensure all third-party vendors are compliant:

| Vendor | Service | GDPR DPA | SOC 2 | CCPA | Status |
|--------|---------|----------|-------|------|--------|
| [AWS / GCP / Azure] | Cloud hosting | [Yes/No] | [Yes/No] | [Yes/No] | [✅/⚠️/❌] |
| [Stripe / Payment processor] | Payments | [Yes/No] | [Yes/No] | [Yes/No] | [✅/⚠️/❌] |
| [Analytics provider] | Analytics | [Yes/No] | [Yes/No] | [Yes/No] | [✅/⚠️/❌] |
| [Email provider] | Email | [Yes/No] | [Yes/No] | [Yes/No] | [✅/⚠️/❌] |

[Add all vendors from tech stack]

**Action Items**:
- [ ] Request DPAs from all vendors
- [ ] Review vendor security documentation
- [ ] Add vendor compliance to procurement process
- [ ] Document data flows to/from vendors

---

## Ongoing Compliance Activities

### Quarterly

- Review data processing activities
- Update privacy policy if needed
- Audit vendor compliance
- Run security risk assessment

### Annually

- Review and update all policies
- Conduct DPIA for new high-risk processing
- Train team on GDPR/CCPA requirements
- Renew SOC 2 certification (if applicable)

### As Needed

- Respond to user data requests within 30 days
- Report breaches within 72 hours
- Update privacy policy for product changes
- Sign DPAs with new vendors

---

## Tools & Resources

### Compliance Platforms (automate much of this)

- **Vanta**: SOC 2 automation + monitoring ($3-10K/year)
- **Drata**: Similar to Vanta
- **OneTrust**: Enterprise GDPR/CCPA compliance (expensive)
- **TrustArc**: Privacy management platform

### Legal Templates

- **Termly**: Privacy policy generator
- **iubenda**: Cookie consent + privacy docs
- **TermsFeed**: Terms & privacy templates

### Audit Firms (for SOC 2)

- **Big 4**: Deloitte, PwC, EY, KPMG ($50K+)
- **Mid-tier**: A-LIGN, Schellman ($20-40K)
- **Platform + Auditor**: Vanta, Drata (includes audit, $10-30K total)

---

## Next Steps

1. **Fix P0 gaps immediately** — Address all critical blockers by [DATE+14 days]
2. **Hire compliance expert** — If needed, engage privacy lawyer or consultant by [DATE+7 days]
3. **Assign owners** — Each gap needs an owner and deadline by [DATE+3 days]
4. **Implement privacy controls** — Data export/deletion flows by [DATE+14 days]
5. **Document everything** — Policies, processes, data flows by [DATE+21 days]
6. **Consider Vanta/Drata** — If pursuing SOC 2, evaluate platforms by [DATE+14 days]

---

## Appendix: Compliance Costs

**DIY Approach** (if doing internally):
- Engineering time: 40-80 hours (data export/deletion, logging, security)
- Legal review: $2-5K (privacy policy, DPAs)
- Total: $10-20K equivalent

**Platform-Assisted** (Vanta/Drata):
- Platform: $3-10K/year
- Audit (SOC 2): $10-30K
- Total: $15-40K first year

**Full Service**:
- Privacy consultant: $5-10K
- Legal: $5-10K
- Platform + Audit: $15-40K
- Total: $25-60K

---

## Revision History

| Date | GDPR Status | CCPA Status | SOC 2 Status | Notes |
|------|-------------|-------------|--------------|-------|
| ${new Date().toISOString().split('T')[0]} | [%] | [%] | [%] | Initial assessment |

Use the context to make assessments realistic. Be honest about gaps. Provide specific, actionable remediation steps. Prioritize ruthlessly. Make timelines achievable for a startup.`
      }
    ]
  })

  // Extract content from response
  let report = ''
  for (const block of response.content) {
    if (block.type === 'text') {
      report += block.text + '\n'
    }
  }

  if (!report.trim()) {
    report = 'Failed to generate compliance assessment'
  }

  // Write output
  const outputDir = join(projectRoot, '_reports', 'security')
  mkdirSync(outputDir, { recursive: true })
  
  const outputPath = join(outputDir, 'compliance-gaps.md')
  writeFileSync(outputPath, report, 'utf-8')

  console.log(`\nCompliance assessment generated: ${outputPath}`)
  console.log(`\nEvaluated: GDPR, CCPA, SOC 2 Type I`)
  console.log(`Review critical gaps and start remediation immediately`)
}

assessCompliance().catch(console.error)
```

## Output

Creates _reports/security/compliance-gaps.md with comprehensive compliance gap assessment. Includes executive summary with overall readiness status, applicability assessment for GDPR/CCPA/SOC 2, complete GDPR checklist (20 items across data protection principles, user rights, security, accountability), CCPA checklist (6 requirements), SOC 2 readiness assessment (5 trust service categories with 20 controls), critical gaps section with P0 blockers, high/medium priority gaps, phased remediation roadmap with timelines and deliverables, vendor compliance matrix, ongoing compliance activities schedule, tools and resources recommendations, cost estimates for DIY vs platform-assisted compliance, and specific next steps with deadlines.
