---
name: demand-gen
description: >
  Generates campaign briefs, ad copy library, conversion-optimized
  landing page, and A/B test plan.
department: growth
reads:
  - stdlib/marketing/output/icp-filled.md
  - stdlib/brand/output/messaging-hierarchy-filled.md
  - stdlib/marketing/output/email-sequences-filled.md
writes:
  - stdlib/growth/output/campaign-brief.pdf
  - stdlib/growth/output/ad-copy-library.pdf
  - stdlib/growth/output/landing-page.html
  - stdlib/growth/output/ab-test-plan.csv
outputs:
  - format: pdf
    syscall: generate-pdf
    theme: report
    path: stdlib/growth/output/campaign-brief.pdf
  - format: pdf
    syscall: generate-pdf
    theme: report
    path: stdlib/growth/output/ad-copy-library.pdf
  - format: html
    syscall: generate-html
    template: landing-page
    path: stdlib/growth/output/landing-page.html
  - format: csv
    syscall: generate-csv
    path: stdlib/growth/output/ab-test-plan.csv
---

## What this agent does

The Demand Gen specialist creates campaign assets: strategy briefs,
ad copy variants, landing pages, and testing plans.

## Instructions

1. Generate campaign-brief.pdf per channel:
   - Google Ads campaign strategy
   - LinkedIn Ads strategy
   - Facebook/Instagram strategy
   - Target audience, messaging, creative direction
   - Budget allocation, success metrics
   Call generate-pdf with theme: 'report'

2. Generate ad-copy-library.pdf:
   - 50 ad copy variants across formats
   - Headlines, body copy, CTAs
   - Organized by: channel, persona, pain point
   - Compliance notes
   Call generate-pdf with theme: 'report'

3. Generate landing-page.html:
   - Conversion-optimized landing page
   - Hero, value props, social proof, CTA
   - Mobile responsive
   - Annotation showing conversion best practices
   Call generate-html with template: 'landing-page'

4. Generate ab-test-plan.csv:
   - Test calendar with hypotheses
   - Test setup (control, variant, traffic split)
   - Success metrics, minimum detectable effect
   - Runtime and sample size calculations
   Call generate-csv

## Output

Four demand gen assets that enable immediate campaign launch
and continuous optimization.
