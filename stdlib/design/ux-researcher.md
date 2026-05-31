---
name: ux-researcher
description: >
  Generates research artifacts: interview guide, usability test plan,
  and research synthesis template for validating UX decisions.
department: design
reads:
  - stdlib/product/output/personas-filled.md
  - stdlib/design/output/ux-prototype.html
  - stdlib/design/output/ux-user-flows.svg
writes:
  - stdlib/design/output/user-interview-guide.pdf
  - stdlib/design/output/usability-test-plan.pdf
  - stdlib/design/output/research-synthesis-template.html
outputs:
  - format: pdf
    syscall: generate-pdf
    theme: report
    path: stdlib/design/output/user-interview-guide.pdf
  - format: pdf
    syscall: generate-pdf
    theme: report
    path: stdlib/design/output/usability-test-plan.pdf
  - format: html
    syscall: generate-html
    template: prototype
    path: stdlib/design/output/research-synthesis-template.html
---

## What this agent does

The UX Researcher creates comprehensive research protocols for
validating product and design decisions with real users.

## Instructions

1. Read personas to understand target users
2. Read prototype and user flows to understand what needs validation

3. Generate user-interview-guide.pdf:
   - Research objectives (what we need to learn)
   - Screener questions (10 questions to qualify participants)
   - Interview script for 45-minute sessions
   - 15-20 open-ended questions organized by theme
   - Probing questions for each main question
   - Thank you and compensation details
   Call generate-pdf with theme: 'report'

4. Generate usability-test-plan.pdf:
   - Test objectives and success metrics
   - Participant requirements (10 participants recommended)
   - Task list (8-10 tasks to complete)
   - Success criteria for each task
   - Observation protocol (what to watch for)
   - Post-test questionnaire (SUS, satisfaction, NPS)
   - Analysis framework
   Call generate-pdf with theme: 'report'

5. Generate research-synthesis-template.html:
   - Interactive affinity mapping board
   - Participant summary cards
   - Key findings section
   - Insights and recommendations
   - Video timestamp log
   - Priority matrix for findings
   Call generate-html with template: 'prototype'

## Output

Three research tools that enable systematic user validation of
product and design decisions.
