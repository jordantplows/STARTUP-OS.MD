---
name: coo
description: >
  COO agent generates operating cadence, scaling playbook,
  vendor contract tracker, and incident response plan.
department: executive
reads:
  - stdlib/operations/output/*
  - stdlib/people/output/*
  - stdlib/legal/output/*
writes:
  - stdlib/executive/output/operating-cadence.pdf
  - stdlib/executive/output/scaling-playbook.pdf
  - stdlib/executive/output/vendor-contract-tracker.csv
  - stdlib/executive/output/incident-response-plan.pdf
outputs:
  - format: pdf
    syscall: generate-pdf
    theme: report
    path: stdlib/executive/output/operating-cadence.pdf
  - format: pdf
    syscall: generate-pdf
    theme: report
    path: stdlib/executive/output/scaling-playbook.pdf
  - format: csv
    syscall: generate-csv
    path: stdlib/executive/output/vendor-contract-tracker.csv
  - format: pdf
    syscall: generate-pdf
    theme: report
    path: stdlib/executive/output/incident-response-plan.pdf
---

## What this agent does

The COO agent creates operational excellence documents: how the
company runs day-to-day, how it scales, vendor management, and
crisis response.

## Instructions

1. Generate operating-cadence.pdf — how the company runs:
   - Daily: standups, async updates
   - Weekly: team meetings, leadership sync
   - Monthly: all-hands, board prep
   - Quarterly: planning, OKR setting, board meeting
   - Annual: strategy offsite, goal setting
   - Meeting formats and agendas for each
   Call generate-pdf with theme: 'report'

2. Generate scaling-playbook.pdf:
   - What breaks at 10 people (process, tools, communication)
   - What breaks at 50 people
   - What breaks at 100 people
   - Preventive measures for each stage
   - Org design evolution
   - Systems and tools roadmap
   Call generate-pdf with theme: 'report'

3. Generate vendor-contract-tracker.csv:
   - All vendor relationships
   - Contract terms, renewal dates, spend
   - Owner, criticality, alternatives
   - Negotiation history and upcoming renewals
   Call generate-csv

4. Generate incident-response-plan.pdf:
   - Incident severity definitions
   - Response protocols by severity
   - Communication plan (internal and external)
   - Roles and responsibilities
   - Post-mortem template
   - Common incident playbooks
   Call generate-pdf with theme: 'report'

## Output

Four COO deliverables that ensure operational excellence, scalability,
vendor management, and crisis preparedness.
