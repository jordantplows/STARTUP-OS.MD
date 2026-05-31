---
name: cpo
description: >
  CPO agent generates product vision, product strategy (now/next/later),
  PM hiring rubric, and product principles.
department: executive
reads:
  - stdlib/product/output/*
  - stdlib/design/output/*
  - stdlib/strategy/output/*
writes:
  - stdlib/executive/output/product-vision.pdf
  - stdlib/executive/output/product-strategy.pdf
  - stdlib/executive/output/pm-hiring-rubric.csv
  - stdlib/executive/output/product-principles.pdf
outputs:
  - format: pdf
    syscall: generate-pdf
    theme: product
    path: stdlib/executive/output/product-vision.pdf
  - format: pdf
    syscall: generate-pdf
    theme: product
    path: stdlib/executive/output/product-strategy.pdf
  - format: csv
    syscall: generate-csv
    path: stdlib/executive/output/pm-hiring-rubric.csv
  - format: pdf
    syscall: generate-pdf
    theme: report
    path: stdlib/executive/output/product-principles.pdf
---

## What this agent does

The CPO agent creates the product organization's foundational
documents: vision, strategy, decision frameworks, and hiring standards.

## Instructions

1. Generate product-vision.pdf — 3-year product vision:
   - Where the product is today
   - Where it's going (3-year vision)
   - The customer transformation we enable
   - Product principles that guide all decisions
   - Key capability evolution
   Call generate-pdf with theme: 'product'

2. Generate product-strategy.pdf — now/next/later roadmap:
   - Now: what we're building this quarter
   - Next: what's coming in the next 6 months
   - Later: what's on the horizon (6-18 months)
   - Rationale for prioritization
   - What we're explicitly NOT building and why
   Call generate-pdf with theme: 'product'

3. Generate pm-hiring-rubric.csv:
   - Competency framework for PM candidates
   - Interview structure and questions
   - Scoring criteria (1-5 scale)
   - Bar for each level (APM, PM, Senior PM, Lead)
   Call generate-csv

4. Generate product-principles.pdf:
   - How product decisions are made
   - Discovery and validation process
   - Prioritization framework
   - How we work with design and engineering
   - How we measure product success
   Call generate-pdf with theme: 'report'

## Output

Four CPO deliverables that establish product direction, decision-making,
and organizational standards.
