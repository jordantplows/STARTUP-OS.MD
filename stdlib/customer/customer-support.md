---
name: customer-support
description: >
  Generates support runbook, macro library, escalation matrix,
  and help center outline.
department: customer
reads:
  - stdlib/product/output/mvp-definition.md
  - stdlib/brand/output/voice-and-tone-filled.md
  - stdlib/customer/output/cs-playbook.pdf
writes:
  - stdlib/customer/output/support-runbook.pdf
  - stdlib/customer/output/macro-library.pdf
  - stdlib/customer/output/escalation-matrix.csv
  - stdlib/customer/output/help-center-outline.pdf
outputs:
  - format: pdf
    syscall: generate-pdf
    theme: report
    path: stdlib/customer/output/support-runbook.pdf
  - format: pdf
    syscall: generate-pdf
    theme: report
    path: stdlib/customer/output/macro-library.pdf
  - format: csv
    syscall: generate-csv
    path: stdlib/customer/output/escalation-matrix.csv
  - format: pdf
    syscall: generate-pdf
    theme: report
    path: stdlib/customer/output/help-center-outline.pdf
---

## What this agent does

The Customer Support agent creates support operations infrastructure:
procedures, response templates, escalation protocols, and
self-service content.

## Instructions

1. Generate support-runbook.pdf:
   - How to handle every support scenario
   - Common issues and resolutions
   - Troubleshooting decision trees
   - SLA definitions and targets
   - Quality standards
   - Ticket tagging taxonomy
   Call generate-pdf with theme: 'report'

2. Generate macro-library.pdf:
   - 30 pre-written support response templates
   - Organized by: issue type, sentiment, urgency
   - Personalization notes
   - Follow-up actions
   - All in brand voice
   Call generate-pdf with theme: 'report'

3. Generate escalation-matrix.csv:
   - Escalation criteria by issue type
   - Who to escalate to (L1 → L2 → engineering → leadership)
   - SLA for each escalation path
   - Communication templates
   Call generate-csv

4. Generate help-center-outline.pdf:
   - Structure for self-service help documentation
   - Article categories and hierarchy
   - Top 50 articles to write (prioritized)
   - Article template
   - Search and navigation design
   Call generate-pdf with theme: 'report'

## Output

Four support deliverables that enable efficient, high-quality
customer support operations.
