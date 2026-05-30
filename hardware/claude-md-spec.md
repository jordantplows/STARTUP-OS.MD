---
name: claude-md-spec
description: CLAUDE.md format specification — the BIOS of startup-os
layer: hardware
---

## What this hardware layer does

The formal specification of `CLAUDE.md` — the system's main memory.
This is the BIOS of startup-os. Every boot reads this file.
Every syscall references it. Changes to this file require system restart.

## File Location

```
/workspace-root/CLAUDE.md
```

This file MUST exist at workspace root. If missing, the OS cannot boot.

## File Format

CLAUDE.md is a structured markdown file with three sections:

1. **Startup Profile** — the input parameters for the OS
2. **Build Log** — the process table (managed by kernel)
3. **Usage** — CLI reference (static)

## Section 1: Startup Profile

```markdown
## Startup Profile
- Company Name:        [value or PENDING]
- One-line:            [value or PENDING]
- Industry:            [value or PENDING]
- Business Model:      [value or PENDING]
- Target Customer:     [value or PENDING]
- Problem:             [value or PENDING]
- Stage:               [idea | pre-seed | seed | series-a]
- Location:            [value or PENDING]
- Founders:            [number or PENDING]
- Revenue:             [currency value]
- Fundraising Goal:    [value or PENDING]
- Launch Target:       [date or PENDING]
```

### Field Specifications

| Field | Type | Required | Default |
|-------|------|----------|---------|
| Company Name | string | Yes | PENDING |
| One-line | string | Yes | PENDING |
| Industry | string | Yes | PENDING |
| Business Model | enum | Yes | PENDING |
| Target Customer | string | Yes | PENDING |
| Problem | string | Yes | PENDING |
| Stage | enum | Yes | idea |
| Location | string | No | PENDING |
| Founders | integer | No | 1 |
| Revenue | currency | No | $0 |
| Fundraising Goal | string | No | PENDING |
| Launch Target | date | No | PENDING |

### Enums

**Stage**:
- `idea` — concept stage, no code
- `pre-seed` — MVP built, pre-revenue
- `seed` — revenue, seeking growth capital
- `series-a` — scaling, proven model

**Business Model** (common values):
- SaaS
- Marketplace
- E-commerce
- Consumer subscription
- B2B services
- Open source + enterprise
- Advertising
- Transaction fees

## Section 2: Build Log

```markdown
## Build Log
| Department   | Status      | Files Written | Completed     |
|--------------|-------------|---------------|---------------|
| strategy     | ⬜ pending  | -             | -             |
| brand        | ⬜ pending  | -             | -             |
| product      | ⬜ pending  | -             | -             |
| finance      | ⬜ pending  | -             | -             |
| marketing    | ⬜ pending  | -             | -             |
| sales        | ⬜ pending  | -             | -             |
| legal        | ⬜ pending  | -             | -             |
| people       | ⬜ pending  | -             | -             |
| operations   | ⬜ pending  | -             | -             |
| metrics      | ⬜ pending  | -             | -             |
| security     | ⬜ pending  | -             | -             |
| engineering  | ⬜ pending  | -             | -             |
```

### Status Icons

- `⬜ pending` — not started
- `🔵 in-progress` — currently running
- `✅ complete` — successfully completed
- `❌ failed` — error occurred

### Columns

1. **Department**: Fixed list of 12 departments (see above)
2. **Status**: Current execution status
3. **Files Written**: Number of output files generated
4. **Completed**: ISO timestamp of completion (or `-`)

### Kernel Responsibilities

The kernel's state manager MUST:
- Parse this table on boot
- Update status during execution
- Write back atomically after each agent
- Never corrupt the table structure

## Section 3: Usage

Static CLI reference. Not parsed by the OS.

```markdown
## Usage

Run the complete build:
\`\`\`
/startup-os build "Your startup idea here"
\`\`\`

Check status:
\`\`\`
/startup-os status
\`\`\`

Re-run a department or agent:
\`\`\`
/startup-os run finance
/startup-os run product roadmap
\`\`\`

Reset everything:
\`\`\`
/startup-os reset
\`\`\`
```

## Parsing Rules

### For syscalls/read-profile

1. Read entire file as UTF-8
2. Find "## Startup Profile" section
3. Extract each line matching `- Key: value`
4. Trim whitespace from values
5. Convert PENDING to empty string
6. Parse Stage enum strictly
7. Validate required fields present

### For kernel/state

1. Read entire file as UTF-8
2. Find "## Build Log" section
3. Find table rows (lines starting with `|`)
4. Split cells by `|`, trim whitespace
5. Parse status icon to enum
6. Parse filesWritten to integer (or 0)
7. Parse completed as ISO timestamp (or null)

## Validation

On every write to CLAUDE.md, validate:
- File is valid UTF-8
- All three sections exist
- Startup Profile has all required fields
- Build Log table is well-formed (12 rows, 4 columns)
- No duplicate department names

Invalid CLAUDE.md halts the OS with kernel panic.

## Example Valid File

```markdown
# Startup OS — Project Instructions

This is the startup-os repository.

---

## Startup Profile
- Company Name:        Acme Corp
- One-line:            AI-powered customer support for SMBs
- Industry:            SaaS / Customer Support
- Business Model:      Subscription SaaS
- Target Customer:     Small businesses (10-50 employees)
- Problem:             Customer support is too expensive for SMBs
- Stage:               idea
- Location:            San Francisco, CA
- Founders:            2
- Revenue:             $0
- Fundraising Goal:    $500K seed
- Launch Target:       2026-Q4

---

## Build Log
| Department   | Status      | Files Written | Completed     |
|--------------|-------------|---------------|---------------|
| strategy     | ✅ complete | 3             | 2026-05-30T10:00:00Z |
| brand        | 🔵 in-progress | -          | -             |
| product      | ⬜ pending  | -             | -             |
...
```

## Notes

- CLAUDE.md is the single source of truth
- Never hand-edit the Build Log (kernel owns it)
- Safe to edit Startup Profile anytime
- Changes to profile require `startup-os reset` to rebuild
