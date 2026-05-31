---
name: controller
description: >
  Controller agent generates chart of accounts, expense policy,
  month-end close checklist, and audit readiness checklist.
department: finance
reads:
  - stdlib/finance/output/financial-model.md
  - stdlib/operations/output/vendor-management-filled.md
writes:
  - stdlib/finance/output/chart-of-accounts.csv
  - stdlib/finance/output/expense-policy.pdf
  - stdlib/finance/output/month-end-close-checklist.pdf
  - stdlib/finance/output/audit-readiness-checklist.pdf
outputs:
  - format: csv
    syscall: generate-csv
    path: stdlib/finance/output/chart-of-accounts.csv
  - format: pdf
    syscall: generate-pdf
    theme: legal
    path: stdlib/finance/output/expense-policy.pdf
  - format: pdf
    syscall: generate-pdf
    theme: report
    path: stdlib/finance/output/month-end-close-checklist.pdf
  - format: pdf
    syscall: generate-pdf
    theme: report
    path: stdlib/finance/output/audit-readiness-checklist.pdf
---

## What this agent does

The Controller agent establishes financial operations and controls:
accounting structure, policies, procedures, and audit readiness.

## Instructions

1. Generate chart-of-accounts.csv:
   - Standard startup chart of accounts
   - Account number, name, type, category
   - Normal balance (debit/credit)
   - Description and usage notes
   - Mapping to financial statements
   Call generate-csv

2. Generate expense-policy.pdf:
   - What can be expensed
   - Approval limits by role
   - Receipt requirements
   - Reimbursement process
   - Credit card policy
   - Vendor payment terms
   - Examples and edge cases
   Call generate-pdf with theme: 'legal'

3. Generate month-end-close-checklist.pdf:
   - 30-item month-end close checklist
   - Task, owner, due date, dependencies
   - Journal entry requirements
   - Reconciliation procedures
   - Reporting deliverables
   - Timeline from close to reporting
   Call generate-pdf with theme: 'report'

4. Generate audit-readiness-checklist.pdf:
   - Series A due diligence financial prep
   - Required documents and their location
   - Process documentation needed
   - System access and controls
   - Common diligence questions with answers
   - Timeline to achieve audit-ready state
   Call generate-pdf with theme: 'report'

## Output

Four controller deliverables that establish financial controls,
procedures, and audit readiness.
