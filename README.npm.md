# startup-os

> Build an entire company operating system from a single idea.

## Install

```bash
npm install -g startup-os
```

Or use directly with npx — no install needed:

```bash
npx startup-os build "AI contract review for small law firms"
```

## Requirements

- Node.js 20+
- An Anthropic API key: `export ANTHROPIC_API_KEY=sk-ant-...`

## What it builds

One command runs 12 department agents in sequence:

| Department  | What it produces                              |
|-------------|-----------------------------------------------|
| strategy    | Idea canvas, market research, lean canvas     |
| brand       | Brand brief, voice/tone, pitch deck           |
| product     | Roadmap, personas, MVP definition, sprint 1   |
| finance     | Financial model, pricing, unit economics      |
| marketing   | GTM strategy, email sequences, launch plan    |
| sales       | Playbook, objection handling, CRM setup       |
| legal       | Entity guidance, IP checklist, compliance     |
| people      | Culture doc, job descriptions, interview kits |
| operations  | Tech stack, SOPs, meeting system              |
| metrics     | KPI framework, north star, investor updates   |
| security    | Threat model, vuln scan, dependency audit     |
| engineering | Code review, type safety, CI validation       |

All output is written to your current directory as Markdown files.

## Commands

```bash
startup-os build "<idea>"        # full build from scratch
startup-os run <dept>            # re-run one department
startup-os run <dept> <agent>    # re-run one agent
startup-os status                # show build progress
startup-os reset                 # clear output and restart
```

## Example session

```bash
# Set your API key
export ANTHROPIC_API_KEY=sk-ant-...

# Build a complete startup
npx startup-os build "AI contract review for small law firms"

# Check progress
npx startup-os status

# Re-run finance with better pricing assumptions
npx startup-os run finance

# View outputs
ls -R strategy/output/
ls -R finance/output/
```

## Using with Claude Code

startup-os is also a Claude Code plugin. In any project:

```
/startup-os build "your idea"
/startup-os run finance
/startup-os status
```

## Programmatic usage

```typescript
import { runBuild, runDepartment, type StartupProfile } from 'startup-os'

// Build entire OS
await runBuild('AI contract review for small law firms')

// Run single department
await runDepartment('finance')

// Run single agent
await runDepartment('product', 'roadmap')
```

## License

MIT
