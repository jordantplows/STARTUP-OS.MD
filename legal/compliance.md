---
name: compliance
description: >
  Checks compliance: GDPR 20-item checklist, CCPA requirements, SOC 2 readiness gaps,
  ToS/Privacy requirements, annual compliance calendar. MUST prepend legal warning to every
  output section. Writes to legal/output/compliance-checklist.md
allowed-tools: Read, Write, Edit, Bash
---

# Compliance Agent

## Context to load before writing

1. Read `CLAUDE.md` → extract Startup Profile (product type, target customers, geographic markets).
2. Read `product/output/feature-roadmap.md` if it exists → identify data collection practices (user analytics, PII storage).
3. Read `security/security-policy.md` if it exists → understand data encryption, access controls, retention policies.
4. Read `operations/output/tech-stack.md` if it exists → identify third-party data processors (Stripe, AWS, analytics tools).

## GDPR 20-Item Checklist

Generate a comprehensive GDPR (General Data Protection Regulation) compliance checklist:

### Lawful Basis & Consent (5 items)

1. **Identify lawful basis for processing**
   - Options: Consent, contract performance, legal obligation, legitimate interest
   - Document which basis applies to each data processing activity

2. **Obtain explicit consent where required**
   - Cookie banners must have "Accept" + "Reject" (no pre-ticked boxes)
   - Consent must be specific, informed, and freely given (can't bundle with ToS)

3. **Allow users to withdraw consent**
   - Provide "Delete My Data" or "Revoke Consent" button in account settings
   - Process requests within 30 days

4. **Maintain consent records**
   - Log: Who consented, when, what they consented to, how (checkbox, button click)
   - Retain for 3+ years (proof of compliance)

5. **Provide clear, plain-language privacy notice**
   - What data you collect, why, how long you store it, who you share it with
   - Written at 8th-grade reading level (no legal jargon)

### Data Subject Rights (5 items)

6. **Right to access** (Subject Access Request)
   - Users can request copy of their data (all PII you hold about them)
   - Respond within 30 days (or 1 month under GDPR)
   - Provide in machine-readable format (CSV, JSON)

7. **Right to rectification**
   - Users can correct inaccurate data (e.g., wrong email, name)
   - Implement edit profile feature, or manual process

8. **Right to erasure** ("Right to be forgotten")
   - Users can request deletion of their data (with exceptions: legal holds, fraud prevention)
   - Delete from production + backups within 30 days

9. **Right to data portability**
   - Users can export their data in machine-readable format (CSV, JSON)
   - Include all user-generated content (posts, files, messages)

10. **Right to object**
    - Users can object to marketing emails (unsubscribe)
    - Users can object to automated decision-making (e.g., credit scoring)

### Data Protection & Security (5 items)

11. **Encrypt data in transit and at rest**
    - In transit: TLS 1.2+ for all connections (HTTPS, API calls)
    - At rest: AES-256 encryption for databases, backups, file storage

12. **Implement access controls**
    - Role-based access (RBAC): Engineers can't access production customer data unless needed
    - Audit logs: Track who accessed what data, when

13. **Conduct Data Protection Impact Assessment (DPIA)**
    - Required for high-risk processing (e.g., profiling, large-scale sensitive data)
    - Document risks, mitigation measures, necessity of processing

14. **Appoint Data Protection Officer (DPO) if required**
    - Required if: >250 employees, OR core activity is large-scale monitoring, OR process sensitive data at scale
    - Most early-stage startups can skip DPO

15. **Have data breach notification process**
    - If breach affects >500 users → notify supervisory authority within 72 hours
    - Notify affected users "without undue delay" (within 72 hours)

### Vendor & Data Processing (5 items)

16. **Sign Data Processing Agreements (DPAs) with vendors**
    - Required for any vendor that processes EU user data (AWS, Stripe, Segment, etc.)
    - DPA specifies: Vendor's responsibilities, data security, sub-processors

17. **Maintain register of data processors**
    - List all third parties with access to user data (cloud providers, analytics, support tools)
    - Document: What data they access, why, DPA status

18. **Conduct vendor security assessments**
    - Review vendor's SOC 2 report, security questionnaire
    - For critical vendors: Annual review

19. **Implement data retention policy**
    - Define how long you keep user data (e.g., "30 days after account deletion")
    - Automate deletion where possible (cron job to purge old records)

20. **Restrict international data transfers**
    - EU data can't be transferred to US/other countries without safeguards
    - Solutions: EU-based cloud (AWS eu-west-1), Standard Contractual Clauses (SCCs), or adequacy decision

## CCPA Requirements

### What is CCPA?

**California Consumer Privacy Act** (2018) + **CPRA** (California Privacy Rights Act, 2023)

**Applies if**:
- Your business collects California residents' data AND
- Annual revenue >$25M, OR >50,000 CA consumers/households, OR >50% revenue from selling data

**Key difference from GDPR**: CCPA is opt-out (vs. GDPR's opt-in)

### CCPA Compliance Requirements

#### 1. Privacy Policy Disclosures

Must disclose:
- Categories of personal information collected (12 categories under CCPA)
- Sources of data (direct from user, third-party data brokers, cookies)
- Business purpose for collection
- Third parties with whom data is shared
- Retention period (how long you keep data)

**Example categories**: Identifiers (name, email), financial info, browsing history, geolocation, biometric data

#### 2. Consumer Rights

**Right to know**: Users can request details about data collection (what, why, who)
**Right to delete**: Users can request deletion of their data (with exceptions)
**Right to opt-out of sale**: "Do Not Sell My Personal Information" link in footer
**Right to non-discrimination**: Can't charge more or provide worse service if user exercises rights

#### 3. "Do Not Sell My Personal Information" Link

- Must appear in website footer (exact wording required)
- Clicking triggers opt-out (can't require account creation)
- If you DON'T sell data → can say "We do not sell personal information" in privacy policy

**What counts as "sale"**: Sharing data with third parties for monetary value (e.g., selling email lists to advertisers)
**What doesn't count**: Sharing with service providers (AWS, Stripe) under DPA

#### 4. Service Provider Agreements

Like GDPR's DPAs, CCPA requires contracts with vendors stating:
- Vendor can only use data for agreed purposes
- Vendor won't sell data to third parties
- Vendor must notify you if they can't meet obligations

#### 5. Data Inventory & Mapping

Document:
- What personal information you collect
- Where it's stored (databases, backups, analytics)
- Who has access (employees, vendors)
- Data flows (e.g., "Email → Mailchimp → Analytics")

#### 6. Response Process for Consumer Requests

Must respond within 45 days (can extend 45 more days if complex)

**Free**: First 2 requests per year (can charge for excessive requests)

**Verification**: Must verify user identity before disclosing data (e.g., email confirmation, account login)

## SOC 2 Readiness

### What is SOC 2?

**System and Organization Controls (SOC) 2** — Audit framework for service providers (SaaS companies)

**Purpose**: Proves to customers/investors that you have strong security, availability, and privacy controls

**Required for**: B2B SaaS selling to enterprises (they'll ask for SOC 2 report during sales process)

**Cost**: $15K-$50K for first audit, $10K-$30K annually thereafter

### SOC 2 Trust Service Criteria (TSCs)

#### 1. Security (Required for all SOC 2 audits)

Controls:
- Multi-factor authentication (MFA) for all employees
- Role-based access control (RBAC)
- Encryption in transit (TLS 1.2+) and at rest (AES-256)
- Vulnerability scanning (quarterly)
- Penetration testing (annually)
- Security awareness training (annually for all employees)

#### 2. Availability (Optional)

Controls:
- Uptime monitoring (e.g., 99.9% SLA)
- Incident response plan (documented, tested quarterly)
- Disaster recovery plan (RTO: 4 hours, RPO: 1 hour)
- Redundant infrastructure (multi-AZ deployment)

#### 3. Processing Integrity (Optional)

Controls:
- Data validation (input validation, output verification)
- Error handling and logging
- Automated testing (CI/CD pipeline)

#### 4. Confidentiality (Optional)

Controls:
- Data classification (public, internal, confidential, restricted)
- Access controls based on data classification
- NDAs for employees and contractors

#### 5. Privacy (Optional)

Controls:
- Privacy policy published and up-to-date
- Consent management (GDPR, CCPA)
- Data retention and deletion policy
- Data subject rights process (access, deletion, portability)

### SOC 2 Readiness Gaps (Common Issues)

**Gap 1: No MFA for all employees**
- ❌ Current state: Some employees use passwords only
- ✅ Required: MFA (Google Authenticator, Yubikey) for all accounts (email, AWS, GitHub, Slack)

**Gap 2: No formal incident response plan**
- ❌ Current state: Ad-hoc response to security incidents
- ✅ Required: Written IR plan, tested quarterly, roles assigned (incident commander, comms lead)

**Gap 3: No vendor security reviews**
- ❌ Current state: Sign up for SaaS tools without security review
- ✅ Required: Vendor risk assessment (SOC 2 report, security questionnaire) for all vendors with data access

**Gap 4: No background checks for employees**
- ❌ Current state: Hire without background checks
- ✅ Required: Criminal background check + employment verification for all hires (especially those with data access)

**Gap 5: No security awareness training**
- ❌ Current state: No formal training
- ✅ Required: Annual training on phishing, password security, data handling (use KnowBe4, SANS)

**Gap 6: No data retention policy**
- ❌ Current state: Keep data indefinitely
- ✅ Required: Written policy (e.g., "Delete user data 30 days after account deletion"), automated enforcement

**Gap 7: No change management process**
- ❌ Current state: Engineers deploy to prod without review
- ✅ Required: Code review (2+ approvals), automated tests, deployment log

**Gap 8: No penetration testing**
- ❌ Current state: Never tested for vulnerabilities
- ✅ Required: Annual pentest by third party ($5K-$15K)

### SOC 2 Timeline

| Milestone | Timeline | Cost | Notes |
|-----------|----------|------|-------|
| **Readiness assessment** | Month 1 | $5K-$10K | Audit firm identifies gaps |
| **Close gaps** | Months 2-6 | $10K-$30K | Implement controls (MFA, policies, pentests) |
| **Observation period** | 3-12 months | $0 | Auditor observes controls in action (can't rush this) |
| **Audit & report** | 2-4 weeks | $15K-$50K | Auditor tests controls, issues report |
| **Total time** | **6-18 months** | **$30K-$90K** | |

**Pro tip**: Start SOC 2 prep 12 months before you need it (enterprise sales cycles require report).

## ToS & Privacy Policy Requirements

### Terms of Service (ToS)

**Required clauses**:
1. **Acceptance of terms**: By using service, user agrees to ToS
2. **Eligibility**: Must be 18+ (or 13+ with parental consent)
3. **Account registration**: User responsibilities (password security, accurate info)
4. **Acceptable use policy**: Prohibited activities (spam, hacking, illegal content)
5. **Intellectual property**: Company owns platform, user owns their content (but grants license to company)
6. **Payment terms**: Billing cycle, refunds, late payments (if paid product)
7. **Termination**: Company can terminate accounts for ToS violations
8. **Disclaimers**: Service provided "as is" (no warranties)
9. **Limitation of liability**: Company not liable for damages (capped at subscription fees)
10. **Governing law**: Which state/country law applies (usually Delaware or CA)
11. **Dispute resolution**: Arbitration clause (avoids class-action lawsuits)

### Privacy Policy

**Required disclosures** (GDPR, CCPA, CalOPPA):
1. **What data you collect**: Email, name, payment info, usage data, cookies
2. **Why you collect it**: Account creation, billing, analytics, support
3. **How you use it**: Provide service, improve product, marketing
4. **Who you share it with**: Third-party vendors (AWS, Stripe, analytics), legal requests
5. **How long you keep it**: Retention period (e.g., "until account deletion + 30 days")
6. **User rights**: Access, delete, export, opt-out
7. **How to exercise rights**: Email privacy@company.com or click "Delete My Data"
8. **Cookies**: What cookies you use (analytics, advertising), how to opt-out
9. **Children's privacy**: COPPA compliance (if service is for children <13)
10. **International transfers**: If EU data is stored in US (Standard Contractual Clauses)
11. **Contact info**: Email or mailing address for privacy questions

### Common Mistakes

❌ **Using outdated template from 2015**
- Fix: Use 2026-compliant template (Termly, iubenda, or attorney)

❌ **No "Do Not Sell" link (CCPA requirement)**
- Fix: Add to footer if you have CA users + meet CCPA thresholds

❌ **Privacy policy doesn't match actual practices**
- Fix: Audit your product → update policy (e.g., if you added Google Analytics, disclose it)

❌ **No cookie consent banner for EU users**
- Fix: Use cookie banner tool (OneTrust, Cookiebot, Iubenda)

## Annual Compliance Calendar

Generate a calendar of recurring compliance tasks:

### Monthly

- Run vulnerability scan (Snyk, Dependabot, or manual)
- Review access logs (who accessed what data)
- Monitor for data breaches (HaveIBeenPwned, dark web monitoring)

### Quarterly

- Review and update vendor list (new SaaS tools added?)
- Test incident response plan (tabletop exercise)
- Review privacy policy (any new data collection practices?)
- Backup and disaster recovery test (restore from backup, measure RTO/RPO)

### Annually

- Security awareness training (all employees)
- Penetration testing (third-party audit)
- SOC 2 audit (if applicable)
- Review and update ToS, Privacy Policy, Cookie Policy
- Background checks for new hires
- Vendor security reviews (re-assess critical vendors)
- Data retention policy audit (delete old data per policy)
- GDPR/CCPA compliance review (any new regulations?)

### As Needed

- Data breach notification (within 72 hours if breach affects >500 users)
- Subject access requests (respond within 30 days)
- Data deletion requests (respond within 30 days)
- Update privacy policy when new vendors added (Mailchimp, analytics tools)

## Output Format

Write to: `legal/output/compliance-checklist.md`

Structure:
```markdown
# Compliance Checklist: [Company Name]

> [!WARNING]
> Not legal advice. Consult a qualified privacy attorney before implementing compliance measures.

**Generated**: 2026-05-29  
**Applicable regulations**: GDPR, CCPA, SOC 2 (if applicable)  
**Last compliance review**: [DATE]  
**Next review due**: [DATE+90 days]

---

## GDPR Compliance Checklist (20 Items)

> [!WARNING]
> Not legal advice. Consult a qualified GDPR attorney before processing EU user data.

### Lawful Basis & Consent

- [ ] **1. Identify lawful basis for each data processing activity**
  - Status: [✅ Documented / ❌ Not documented]
  - Lawful basis: [Consent / Contract / Legitimate interest / Legal obligation]

- [ ] **2. Obtain explicit consent where required**
  - Cookie banner: [✅ Implemented / ❌ Missing]
  - Banner has "Accept" + "Reject" (no pre-ticked boxes)

- [ ] **3. Allow users to withdraw consent**
  - "Delete My Data" button: [✅ Implemented / ❌ Missing]
  - Location: [Account settings / Privacy page]

- [ ] **4. Maintain consent records**
  - Logs: [✅ Implemented / ❌ Missing]
  - Retention: [X years]

- [ ] **5. Provide clear privacy notice**
  - Privacy policy: [✅ Published / ❌ Missing]
  - Last updated: [DATE]
  - Plain language: [✅ Yes / ❌ Too technical]

### Data Subject Rights

- [ ] **6. Right to access (Subject Access Request)**
  - Process: [✅ Documented / ❌ Ad-hoc]
  - Response time: [X days] (target: 30 days)

- [ ] **7. Right to rectification**
  - Edit profile feature: [✅ Implemented / ❌ Manual process only]

- [ ] **8. Right to erasure ("Right to be forgotten")**
  - Delete account feature: [✅ Implemented / ❌ Manual process]
  - Deletes from backups: [✅ Yes / ⚠️ No (soft delete only)]

- [ ] **9. Right to data portability**
  - Export data feature: [✅ Implemented / ❌ Missing]
  - Format: [CSV / JSON / PDF]

- [ ] **10. Right to object**
  - Unsubscribe link: [✅ In all emails / ❌ Missing]
  - Opt-out of marketing: [✅ Implemented / ❌ Missing]

### Data Protection & Security

- [ ] **11. Encrypt data in transit and at rest**
  - In transit: [✅ TLS 1.2+ / ⚠️ TLS 1.0 / ❌ No encryption]
  - At rest: [✅ AES-256 / ⚠️ AES-128 / ❌ No encryption]

- [ ] **12. Implement access controls**
  - RBAC: [✅ Implemented / ❌ All engineers have prod access]
  - Audit logs: [✅ Enabled / ❌ Not tracking access]

- [ ] **13. Conduct Data Protection Impact Assessment (DPIA)**
  - Required: [✅ Yes (high-risk processing) / ❌ No]
  - Status: [✅ Completed / ⚠️ In progress / ❌ Not started]

- [ ] **14. Appoint Data Protection Officer (DPO)**
  - Required: [✅ Yes (>250 employees or large-scale monitoring) / ❌ No]
  - DPO: [Name] / [Not appointed]

- [ ] **15. Have data breach notification process**
  - Process documented: [✅ Yes / ❌ No]
  - 72-hour notification: [✅ Process in place / ❌ No process]

### Vendor & Data Processing

- [ ] **16. Sign Data Processing Agreements (DPAs) with vendors**
  - Total vendors: [X]
  - DPAs signed: [X/X]
  - Missing DPAs: [Vendor Y, Vendor Z]

- [ ] **17. Maintain register of data processors**
  - Register: [✅ Up-to-date / ⚠️ Outdated / ❌ Doesn't exist]
  - Last updated: [DATE]

- [ ] **18. Conduct vendor security assessments**
  - Process: [✅ Documented / ❌ Ad-hoc]
  - Frequency: [Annually / Before onboarding]

- [ ] **19. Implement data retention policy**
  - Policy: [✅ Documented / ❌ Missing]
  - Retention period: [X days after account deletion]
  - Automated deletion: [✅ Implemented / ❌ Manual]

- [ ] **20. Restrict international data transfers**
  - EU data stored in: [EU / US with SCCs / US without safeguards]
  - Safeguards: [✅ SCCs signed / ✅ Adequacy decision / ❌ None]

---

## CCPA Compliance

> [!WARNING]
> Not legal advice. Consult a qualified privacy attorney before processing California resident data.

### Does CCPA Apply to You?

Check if ALL of the following are true:
- [ ] You collect personal information from California residents
- [ ] AND one of:
  - [ ] Annual revenue >$25M
  - [ ] Process data of >50,000 CA consumers/households/devices
  - [ ] >50% of revenue from selling consumer data

**Result**: [✅ CCPA applies / ❌ CCPA doesn't apply (but still good practice)]

---

### CCPA Requirements

- [ ] **1. Privacy policy disclosures**
  - Categories of data collected: [✅ Listed / ❌ Missing]
  - Sources of data: [✅ Listed / ❌ Missing]
  - Business purpose: [✅ Listed / ❌ Missing]
  - Third parties: [✅ Listed / ❌ Missing]
  - Retention period: [✅ Listed / ❌ Missing]

- [ ] **2. Consumer rights process**
  - Right to know: [✅ Process documented / ❌ No process]
  - Right to delete: [✅ Process documented / ❌ No process]
  - Response time: [X days] (target: 45 days)

- [ ] **3. "Do Not Sell My Personal Information" link**
  - Status: [✅ In footer / ❌ Missing / N/A (we don't sell data)]
  - If N/A: Privacy policy says "We do not sell personal information"

- [ ] **4. Service provider agreements**
  - Total vendors: [X]
  - CCPA-compliant agreements: [X/X]
  - Missing: [Vendor Y]

- [ ] **5. Data inventory & mapping**
  - Inventory: [✅ Documented / ❌ Missing]
  - Data flows mapped: [✅ Yes / ❌ No]

- [ ] **6. Identity verification for requests**
  - Verification method: [Email confirmation / Account login / Other]

---

## SOC 2 Readiness

> [!WARNING]
> Not legal advice. Consult a qualified SOC 2 auditor before starting audit process.

### Do You Need SOC 2?

Check if ANY of the following are true:
- [ ] Selling B2B SaaS to enterprises (they'll request SOC 2 report)
- [ ] Handling sensitive customer data (financial, health, PII at scale)
- [ ] Investors require SOC 2 (common for Series A+)

**Result**: [✅ SOC 2 required / ⚠️ Nice to have / ❌ Not needed yet]

---

### SOC 2 Readiness Gaps

**Security (Required)**:

- [ ] **MFA for all employees**
  - Status: [✅ Enforced / ⚠️ Optional / ❌ Not implemented]
  - Coverage: [X%] of employees

- [ ] **Role-based access control (RBAC)**
  - Status: [✅ Implemented / ❌ All engineers have admin access]

- [ ] **Encryption in transit (TLS 1.2+) and at rest (AES-256)**
  - In transit: [✅ Yes / ❌ No]
  - At rest: [✅ Yes / ❌ No]

- [ ] **Vulnerability scanning (quarterly)**
  - Last scan: [DATE]
  - Tool: [Snyk / Dependabot / Other]

- [ ] **Penetration testing (annually)**
  - Last test: [DATE / Never]
  - Next test: [DATE]

- [ ] **Security awareness training (annually)**
  - Last training: [DATE / Never]
  - Coverage: [X%] of employees

**Additional gaps**:

- [ ] **Incident response plan**
  - Status: [✅ Documented & tested / ⚠️ Documented but not tested / ❌ No plan]

- [ ] **Vendor security reviews**
  - Process: [✅ Documented / ❌ Ad-hoc]
  - Last review: [DATE]

- [ ] **Background checks for employees**
  - Policy: [✅ All hires / ⚠️ Only those with data access / ❌ No checks]

- [ ] **Data retention policy**
  - Policy: [✅ Documented & enforced / ⚠️ Documented but not enforced / ❌ No policy]

- [ ] **Change management process**
  - Code review: [✅ Required (2+ approvals) / ❌ Not required]
  - Automated tests: [✅ CI/CD pipeline / ❌ Manual testing]

**Timeline to SOC 2**:
- Readiness assessment: [DATE] (Month 1)
- Close gaps: [DATE] (Months 2-6)
- Observation period: [3-12 months]
- Audit: [DATE] (target)

**Estimated cost**: $30K-$90K (readiness + audit)

---

## Terms of Service & Privacy Policy

> [!WARNING]
> Not legal advice. Consult a qualified attorney before publishing ToS or Privacy Policy.

### Terms of Service (ToS)

- [ ] **ToS published**
  - URL: [company.com/terms]
  - Last updated: [DATE]

- [ ] **Required clauses included**:
  - [ ] Acceptance of terms
  - [ ] Eligibility (age 18+ or 13+ with parental consent)
  - [ ] Account registration
  - [ ] Acceptable use policy
  - [ ] Intellectual property (company owns platform, user owns content)
  - [ ] Payment terms (if paid product)
  - [ ] Termination clause
  - [ ] Disclaimers ("as is" service)
  - [ ] Limitation of liability
  - [ ] Governing law (Delaware / California / Other)
  - [ ] Dispute resolution (arbitration clause)

### Privacy Policy

- [ ] **Privacy policy published**
  - URL: [company.com/privacy]
  - Last updated: [DATE]

- [ ] **Required disclosures included**:
  - [ ] What data you collect
  - [ ] Why you collect it
  - [ ] How you use it
  - [ ] Who you share it with (vendors)
  - [ ] How long you keep it (retention period)
  - [ ] User rights (access, delete, export, opt-out)
  - [ ] How to exercise rights (email privacy@company.com)
  - [ ] Cookies disclosure
  - [ ] Children's privacy (COPPA, if applicable)
  - [ ] International transfers (if EU data in US)
  - [ ] Contact info (email or mailing address)

### Cookie Policy & Banner

- [ ] **Cookie banner implemented**
  - Status: [✅ Yes / ❌ No]
  - Has "Accept" + "Reject": [✅ Yes / ❌ Only "Accept"]

- [ ] **Cookie policy published**
  - URL: [company.com/cookies]
  - Lists all cookies (analytics, advertising, functional)

### Common Issues

- [ ] **ToS/Privacy Policy matches actual practices**
  - Last audit: [DATE]
  - Discrepancies: [None / List issues]

- [ ] **"Do Not Sell" link in footer** (CCPA)
  - Status: [✅ Yes / ❌ No / N/A (don't sell data)]

---

## Annual Compliance Calendar

> [!WARNING]
> Not legal advice. Consult a qualified compliance professional for your specific requirements.

### Monthly Tasks

- [ ] **Run vulnerability scan**
  - Tool: [Snyk / Dependabot / Other]
  - Last run: [DATE]

- [ ] **Review access logs**
  - Check: Who accessed customer data, when
  - Last review: [DATE]

- [ ] **Monitor for data breaches**
  - Tool: [HaveIBeenPwned / Dark web monitoring]

### Quarterly Tasks (Every 3 Months)

- [ ] **Review vendor list**
  - Last review: [DATE]
  - New vendors added: [X]
  - DPAs signed: [✅ Yes / ❌ Missing]

- [ ] **Test incident response plan**
  - Last test: [DATE]
  - Type: [Tabletop exercise / Full simulation]

- [ ] **Review privacy policy**
  - Last review: [DATE]
  - Updates needed: [Yes / No]

- [ ] **Backup & disaster recovery test**
  - Last test: [DATE]
  - RTO: [X hours]
  - RPO: [X hours]

### Annual Tasks

- [ ] **Security awareness training**
  - Last training: [DATE]
  - Next training: [DATE+365 days]
  - Coverage: [X%] of employees

- [ ] **Penetration testing**
  - Last test: [DATE]
  - Next test: [DATE+365 days]
  - Cost: $5K-$15K

- [ ] **SOC 2 audit** (if applicable)
  - Last audit: [DATE]
  - Next audit: [DATE+365 days]

- [ ] **Review ToS, Privacy Policy, Cookie Policy**
  - Last review: [DATE]
  - Next review: [DATE+365 days]

- [ ] **Background checks for new hires**
  - Total hires this year: [X]
  - Background checks completed: [X/X]

- [ ] **Vendor security reviews**
  - Critical vendors: [X]
  - Reviews completed: [X/X]

- [ ] **Data retention policy audit**
  - Last audit: [DATE]
  - Data deleted per policy: [X GB / X records]

- [ ] **Regulatory review** (GDPR, CCPA, new laws)
  - Last review: [DATE]
  - New regulations: [List any]

### As Needed

- [ ] **Data breach notification**
  - Trigger: Breach affects >500 users
  - Timeline: Within 72 hours to supervisory authority + users

- [ ] **Subject access requests (SARs)**
  - Open requests: [X]
  - Response timeline: 30 days

- [ ] **Data deletion requests**
  - Open requests: [X]
  - Response timeline: 30 days

- [ ] **Update privacy policy**
  - Trigger: New vendor added, new data collection practice
  - Last update: [DATE]

---

## Next Steps

1. **Complete GDPR checklist** → Identify gaps by [DATE+7 days]
2. **Publish privacy policy** → Use template (Termly, iubenda, or attorney) by [DATE+14 days]
3. **Implement cookie banner** → Use OneTrust, Cookiebot, or Iubenda by [DATE+14 days]
4. **Sign DPAs with vendors** → AWS, Stripe, analytics tools by [DATE+30 days]
5. **Assess SOC 2 readiness** → If selling to enterprises, start process by [DATE+60 days]
```

## Writing Rules

1. **MUST prepend warning** — Every section begins with `> [!WARNING] Not legal advice. Consult a qualified attorney.`
2. **20-item GDPR checklist** — Must include exactly 20 items, grouped by category.
3. **CCPA threshold check** — Include self-assessment (does CCPA apply to your startup?).
4. **SOC 2 gaps** — List 8-10 common readiness gaps with current state vs. required state.
5. **Annual calendar** — Include monthly, quarterly, annual, and as-needed tasks.
6. **Cookie banner warning** — Emphasize "Accept + Reject" buttons (not just "Accept").
7. **DPA/SCC requirements** — Explain when you need Data Processing Agreements and Standard Contractual Clauses.

## Cross-References

- Link to `ip.md` for data ownership and processing context
- Link to `security-policy.md` (if exists) for encryption and access control details
- Link to `operations/tech-stack.md` for vendor list (who processes data)

## After completion

1. Verify GDPR checklist has exactly 20 items.
2. Ensure SOC 2 timeline shows 6-18 months with cost breakdown.
3. Confirm annual calendar includes monthly, quarterly, and annual tasks.
4. Write output to `legal/output/compliance-checklist.md`.
