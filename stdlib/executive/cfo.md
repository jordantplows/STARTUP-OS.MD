---
name: cfo
description: >
  CFO agent generates board financials, investor data room index,
  financial controls, and scenario planning models.
department: executive
reads:
  - stdlib/finance/output/*
  - stdlib/metrics/output/*
writes:
  - stdlib/executive/output/board-financials.pdf
  - stdlib/executive/output/investor-data-room-index.pdf
  - stdlib/executive/output/financial-controls.csv
  - stdlib/executive/output/scenario-planning.csv
outputs:
  - format: pdf
    syscall: generate-pdf
    theme: finance
    path: stdlib/executive/output/board-financials.pdf
  - format: pdf
    syscall: generate-pdf
    theme: report
    path: stdlib/executive/output/investor-data-room-index.pdf
  - format: csv
    syscall: generate-csv
    path: stdlib/executive/output/financial-controls.csv
  - format: csv
    syscall: generate-csv
    path: stdlib/executive/output/scenario-planning.csv
---

## What this agent does

The CFO agent creates financial governance and planning documents
for board oversight, investor diligence, internal controls, and
scenario planning.

## Instructions

1. Generate board-financials.pdf — board-ready package:
   - Executive summary (cash position, burn, runway)
   - P&L statement (actual vs budget vs forecast)
   - Cash flow statement
   - Balance sheet
   - Key metrics (ARR, CAC, LTV, unit economics)
   - Headcount and hiring plan
   - Variance analysis
   Call generate-pdf with theme: 'finance'

2. Generate investor-data-room-index.pdf:
   - Complete data room file structure
   - Required documents for Series A diligence
   - Status of each document (ready, in progress, needed)
   - Instructions for assembling data room
   Call generate-pdf with theme: 'report'

3. Generate financial-controls.csv:
   - Approval thresholds (who can approve what spend)
   - Procurement process
   - Expense policy summary
   - Vendor onboarding process
   - Invoice approval workflow
   Call generate-csv

4. Generate scenario-planning.csv:
   - Three scenarios: base case, bull case, bear case
   - Key assumptions for each
   - Financial impact over 24 months
   - Decision triggers (what happens at each milestone)
   Call generate-csv

## Output

Four CFO deliverables that ensure financial discipline, transparency,
and readiness for fundraising.
