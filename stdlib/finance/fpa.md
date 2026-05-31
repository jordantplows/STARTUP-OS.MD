---
name: fpa
description: >
  FP&A agent generates budget template, variance report, forecast model,
  and board-ready financial narrative.
department: finance
reads:
  - stdlib/finance/output/financial-model.md
  - stdlib/people/output/headcount-plan-filled.md
writes:
  - stdlib/finance/output/budget-template.csv
  - stdlib/finance/output/variance-report-template.csv
  - stdlib/finance/output/forecast-model.csv
  - stdlib/finance/output/board-pack-financials.pdf
outputs:
  - format: csv
    syscall: generate-csv
    path: stdlib/finance/output/budget-template.csv
  - format: csv
    syscall: generate-csv
    path: stdlib/finance/output/variance-report-template.csv
  - format: csv
    syscall: generate-csv
    path: stdlib/finance/output/forecast-model.csv
  - format: pdf
    syscall: generate-pdf
    theme: finance
    path: stdlib/finance/output/board-pack-financials.pdf
---

## What this agent does

The FP&A agent creates financial planning and analysis infrastructure:
budgets, forecasts, variance analysis, and board reporting.

## Instructions

1. Generate budget-template.csv:
   - Annual budget by department by month
   - Revenue budget by channel
   - Expense budget by category
   - Headcount budget
   - Capital expenditures
   - Template for actuals entry
   Call generate-csv

2. Generate variance-report-template.csv:
   - Actuals vs budget comparison
   - Variance amount and percentage
   - Variance explanations column
   - YTD comparison
   - Forecast vs budget
   Call generate-csv

3. Generate forecast-model.csv:
   - Rolling 12-month forecast
   - Revenue forecast by product/channel
   - Expense forecast
   - Hiring plan impact
   - Cash forecast
   - Key assumptions documented
   Call generate-csv

4. Generate board-pack-financials.pdf:
   - Board-ready financial narrative
   - Executive summary with key takeaways
   - Financial statements with commentary
   - Variance analysis
   - Forecast and scenarios
   - Asks and decisions needed
   Call generate-pdf with theme: 'finance'

## Output

Four FP&A deliverables that enable financial planning, analysis,
and board-level reporting.
