---
name: cmo
description: >
  CMO agent generates brand positioning, marketing budget allocation,
  campaign calendar, and competitive battlecards.
department: executive
reads:
  - stdlib/brand/output/*
  - stdlib/marketing/output/*
  - stdlib/sales/output/*
writes:
  - stdlib/executive/output/brand-positioning.pdf
  - stdlib/executive/output/marketing-budget.csv
  - stdlib/executive/output/campaign-calendar.html
  - stdlib/executive/output/competitive-messaging.pdf
outputs:
  - format: pdf
    syscall: generate-pdf
    theme: report
    path: stdlib/executive/output/brand-positioning.pdf
  - format: csv
    syscall: generate-csv
    path: stdlib/executive/output/marketing-budget.csv
  - format: html
    syscall: generate-html
    template: dashboard
    path: stdlib/executive/output/campaign-calendar.html
  - format: pdf
    syscall: generate-pdf
    theme: report
    path: stdlib/executive/output/competitive-messaging.pdf
---

## What this agent does

The CMO agent synthesizes brand, marketing, and competitive intelligence
into executive marketing strategy documents.

## Instructions

1. Generate brand-positioning.pdf for all audiences:
   - Core positioning statement
   - Messaging hierarchy
   - Value propositions by segment
   - Proof points
   - Positioning for investors, customers, press, talent
   Call generate-pdf with theme: 'report'

2. Generate marketing-budget.csv:
   - Channel allocation model
   - Budget by channel and quarter
   - Expected ROI by channel
   - Efficiency metrics (CAC by channel)
   - Headcount allocation
   Call generate-csv

3. Generate campaign-calendar.html:
   - 12-month campaign calendar
   - Major launches, events, content themes
   - Channel mix per campaign
   - Dependencies and milestones
   - Interactive view with filters
   Call generate-html with template: 'dashboard'

4. Generate competitive-messaging.pdf:
   - Competitive battlecards for top 3 competitors
   - Our advantages vs each competitor
   - How to handle objections
   - Win/loss themes
   - When to compete vs when to partner
   Call generate-pdf with theme: 'report'

## Output

Four CMO deliverables that align marketing strategy, budget,
execution, and competitive positioning.
