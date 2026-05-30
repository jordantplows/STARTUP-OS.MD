# Standard Operating Procedures (SOPs)

**Department:** Operations  
**Agent:** sops  
**Output:** operations/output/sops-filled.md

---

## Instructions

Document core standard operating procedures for the startup:

1. **Onboarding**
   - New hire setup process
   - Account provisioning
   - First week checklist

2. **Development Workflow**
   - Git branching strategy
   - Code review process
   - Deployment procedure
   - Incident response

3. **Support & Customer Success**
   - Ticket triage
   - Escalation process
   - Customer communication guidelines

4. **Finance & Admin**
   - Expense reimbursement
   - Vendor payment process
   - Contract approval workflow

5. **Security Procedures**
   - Access control
   - Incident reporting
   - Data handling guidelines

---

## Output Template

```markdown
# Standard Operating Procedures — [Company Name]

## 1. Employee Onboarding

### Day 1
- [ ] Equipment setup
- [ ] Account creation (email, Slack, GitHub, etc.)
- [ ] Security training
- [ ] Team introductions

### Week 1
- [ ] Codebase orientation
- [ ] Assign onboarding buddy
- [ ] Review company handbook
- [ ] Complete compliance training

## 2. Development Workflow

### Git Strategy
- Branch naming: `feature/`, `bugfix/`, `hotfix/`
- Main branch: `main` (production)
- Staging branch: `staging`

### Code Review
1. Create pull request with description
2. Request review from 1+ team member
3. Pass CI checks
4. Squash and merge

### Deployment
- Staging: auto-deploy on merge to `staging`
- Production: manual approval required
- Rollback procedure: [steps]

## 3. Incident Response

### Severity Levels
- **P0:** Production down
- **P1:** Major feature broken
- **P2:** Minor issue
- **P3:** Enhancement request

### Response Process
1. Acknowledge in #incidents
2. Create incident doc
3. Assign incident commander
4. Fix and verify
5. Post-mortem within 48h

## 4. Support Workflow

### Ticket Triage
- Response SLA: 24 hours
- Resolution SLA: varies by plan
- Escalation: CS → Eng → Founder

### Communication
- Use empathetic, clear language
- Provide regular updates
- Close with satisfaction check

## 5. Finance & Admin

### Expense Reimbursement
1. Submit receipt via [tool]
2. Manager approval
3. Finance review
4. Payment within 2 weeks

### Vendor Payments
- Net 30 terms standard
- CFO approval for >$5k
- Track in [accounting software]

## 6. Security Procedures

### Access Control
- Principle of least privilege
- 2FA required for all tools
- Quarterly access reviews

### Incident Reporting
- Report security concerns to #security
- Escalate to CTO/Founder
- Document in incident log

### Data Handling
- Encrypt sensitive data
- No customer data in Slack
- Follow data retention policy
```
