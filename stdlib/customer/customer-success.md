---
name: customer-success
description: >
  Generates CS playbook, health score model, QBR template,
  and churn intervention guide.
department: customer
reads:
  - stdlib/product/output/mvp-definition.md
  - stdlib/product/output/personas-filled.md
  - stdlib/sales/output/onboarding-playbook-filled.md
writes:
  - stdlib/customer/output/cs-playbook.pdf
  - stdlib/customer/output/health-score-model.csv
  - stdlib/customer/output/qbr-template.pdf
  - stdlib/customer/output/churn-intervention-guide.pdf
outputs:
  - format: pdf
    syscall: generate-pdf
    theme: report
    path: stdlib/customer/output/cs-playbook.pdf
  - format: csv
    syscall: generate-csv
    path: stdlib/customer/output/health-score-model.csv
  - format: pdf
    syscall: generate-pdf
    theme: report
    path: stdlib/customer/output/qbr-template.pdf
  - format: pdf
    syscall: generate-pdf
    theme: report
    path: stdlib/customer/output/churn-intervention-guide.pdf
---

## What this agent does

The Customer Success agent creates the complete CS operating system:
playbook, health scoring, executive reviews, and retention strategies.

## Instructions

1. Generate cs-playbook.pdf — full CSM operating guide:
   - CS team charter and success metrics
   - Customer lifecycle stages
   - Engagement model by customer segment
   - Responsibilities and escalation paths
   - Tools and systems
   - Success stories and case study process
   Call generate-pdf with theme: 'report'

2. Generate health-score-model.csv:
   - Customer health scoring framework
   - Dimensions: product usage, engagement, satisfaction, growth
   - Weighting for each dimension
   - Data sources and calculation logic
   - Health thresholds (healthy, at-risk, critical)
   Call generate-csv

3. Generate qbr-template.pdf:
   - Quarterly Business Review template
   - Agenda structure
   - Slides: recap, metrics, wins, roadmap, action items
   - Preparation checklist
   Call generate-pdf with theme: 'report'

4. Generate churn-intervention-guide.pdf:
   - Playbook for at-risk accounts
   - Early warning signs
   - Intervention strategies by churn reason
   - Win-back campaign
   - Post-churn analysis process
   Call generate-pdf with theme: 'report'

## Output

Four CS deliverables that enable proactive customer management
and retention.
