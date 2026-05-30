# Startup-OS Plugin Structure

This document describes the complete file structure and architecture of the startup-os Claude Code plugin.

## Directory Structure

```
startup-os/
├── .claude-plugin/
│   └── plugin.json                    # Plugin manifest
├── .claude/
│   └── skills/
│       └── startup-os/
│           ├── SKILL.md                # Main skill definition (routes all commands)
│           ├── agents/                 # 10 specialized builder agents
│           │   ├── foundation-builder.md
│           │   ├── brand-builder.md
│           │   ├── product-builder.md
│           │   ├── finance-builder.md
│           │   ├── gtm-builder.md
│           │   ├── legal-builder.md
│           │   ├── hiring-builder.md
│           │   ├── ops-builder.md
│           │   ├── sales-builder.md
│           │   └── metrics-builder.md
│           └── hooks/
│               └── post-init.md        # Guided profile setup
├── startup-os/                         # Template directory (copied during init)
│   ├── CLAUDE.md                       # Startup Profile template
│   ├── CONTRIBUTING.md                 # Template contribution guide
│   ├── _progress/
│   │   └── tracker.md                  # Progress tracking template
│   ├── 01-foundation/
│   ├── 02-brand/
│   ├── 03-product/
│   ├── 04-finance/
│   ├── 05-go-to-market/
│   ├── 06-legal/
│   ├── 07-hiring/
│   ├── 08-operations/
│   ├── 09-sales/
│   └── 10-metrics/
├── README.md                           # Main documentation
├── INSTALLATION.md                     # Installation guide
└── PLUGIN_STRUCTURE.md                 # This file
```

---

## Core Components

### 1. Plugin Manifest (`.claude-plugin/plugin.json`)

Defines the plugin metadata and entry points:
- Plugin name, version, description
- Links to skill files and hooks
- Minimum Claude Code version requirement

### 2. Main Skill (`.claude/skills/startup-os/SKILL.md`)

The routing layer for all `/startup-os` commands:

| Command | Function |
|---------|----------|
| `init` | Scaffold repo structure + guided profile setup |
| `fill <module>` | Fill one module or file |
| `fill-all` | Fill all 50 templates sequentially |
| `review <file>` | Get investor-grade feedback |
| `stress-test` | Generate 10 hardest investor questions |
| `pitch-me` | Synthesize full pitch + critique |
| `investor-update` | Draft monthly investor email |
| `weekly-review` | Generate weekly company review |
| `hiring <role>` | Complete hiring package |
| `status` | Progress summary + next actions |

### 3. Builder Agents (`.claude/skills/startup-os/agents/`)

Ten specialized agents, one per module. Each agent:
- Reads `CLAUDE.md` for the Startup Profile
- Cross-references previously filled modules
- Fills all 5 files in its module
- Enforces module-specific validation rules
- Updates `_progress/tracker.md`

**Agent-specific validation rules:**

| Agent | Validation Rule |
|-------|----------------|
| **foundation-builder** | TAM/SAM/SOM math must be internally consistent |
| **brand-builder** | Voice/tone must be consistent across all 5 files |
| **product-builder** | User stories map to personas; MVP features have metrics |
| **finance-builder** | All formulas shown; numbers labeled as assumption/derived |
| **gtm-builder** | ICP matches primary persona; emails use brand voice |
| **legal-builder** | All files prepended with legal disclaimer |
| **hiring-builder** | Job descriptions include salary ranges |
| **ops-builder** | Tech stack costs reconcile with burn rate |
| **sales-builder** | Pricing matches finance docs exactly |
| **metrics-builder** | Every KPI has owner, data source, baseline |

### 4. Post-Init Hook (`.claude/skills/startup-os/hooks/post-init.md`)

Runs automatically after `/startup-os init`:
1. Guides user through 12 profile questions
2. Writes answers to `CLAUDE.md` incrementally
3. Prints success message with next steps

### 5. Template Directory (`startup-os/`)

The source structure copied during initialization:
- 10 module folders (50 template files total)
- `CLAUDE.md` with blank profile
- `_progress/tracker.md` with all files listed
- GitHub templates (PR, issues, contributing)

---

## Command Flow

### Example: `/startup-os fill-all`

1. User runs `/startup-os fill-all`
2. Main skill (`SKILL.md`) handles the command
3. Reads `CLAUDE.md` to load Startup Profile
4. Dispatches agents sequentially:
   - `foundation-builder` → fills 01-foundation (5 files)
   - `brand-builder` → fills 02-brand (5 files)
   - ... continues through all 10 modules
5. Each agent:
   - Reads profile + all prior filled files
   - Fills its 5 templates
   - Validates cross-references
   - Updates `_progress/tracker.md`
6. Prints completion summary

### Example: `/startup-os review lean-canvas.md`

1. User runs `/startup-os review lean-canvas.md`
2. Main skill locates the file (`01-foundation/lean-canvas.md`)
3. Reads file content + related files (profile, value prop, market research)
4. Generates structured feedback:
   - **Strengths** (2-3 specific positives)
   - **Critical gaps** (what investors would question)
   - **Inconsistencies** (conflicts with other docs)
   - **Rewrite suggestions** (specific sentence improvements)

---

## Data Flow

```
User Input (via /startup-os command)
    ↓
Main Skill (SKILL.md) — routes to handler
    ↓
Reads CLAUDE.md (Startup Profile)
    ↓
Dispatches Builder Agent(s)
    ↓
Agent reads profile + related files
    ↓
Agent fills templates (Write/Edit tools)
    ↓
Agent updates _progress/tracker.md
    ↓
Returns summary to user
```

---

## Cross-File Validation

Every agent enforces consistency across files:

| Source File | Must Match In | What's Validated |
|-------------|---------------|------------------|
| `CLAUDE.md` | All modules | Company name, problem, target customer |
| `01-foundation/value-proposition.md` | `02-brand/messaging-framework.md` | Core value prop messaging |
| `03-product/user-personas.md` | `05-go-to-market/go-to-market-strategy.md` | ICP definition |
| `04-finance/pricing-strategy.md` | `09-sales/proposal-template.md` | Exact pricing |
| `04-finance/financial-model.md` | `08-operations/vendor-list.md` | Burn rate costs |
| `02-brand/voice-and-tone.md` | `05-go-to-market/email-sequences.md` | Brand voice |
| `07-hiring/culture-doc.md` | `07-hiring/job-description-template.md` | Culture values |

---

## Extension Points

### Adding a New Module

1. Create agent file: `.claude/skills/startup-os/agents/new-module-builder.md`
2. Add module folder: `startup-os/11-new-module/`
3. Add 5 template files to the folder
4. Update `SKILL.md` to route `fill new-module` to new agent
5. Update `_progress/tracker.md` template with new files

### Adding a New Command

1. Add command section to `SKILL.md`
2. Define routing logic and agent dispatch
3. Update `README.md` command table
4. Test with `/startup-os <new-command>`

### Custom Validation Rules

Add validation rules to specific agent files in the "Writing rules" section:

```markdown
## Writing rules for this module

- **[Your validation rule here]**
- Write in first person as the founder.
- ...
```

---

## Testing the Plugin

### Local Testing (Without Installing as Plugin)

1. Copy `.claude/` directory to your test project
2. Run commands directly: `/startup-os init`
3. Claude Code loads skills from local `.claude/skills/` directory

### Testing as Installed Plugin

```bash
# Install from local directory
claude plugin install file:///Users/jordan/Dev/startup-os

# Or install from GitHub
claude plugin install github:your-org/startup-os

# Test commands
cd ~/test-startup
/startup-os init
/startup-os fill 01-foundation
/startup-os status
```

---

## Plugin Lifecycle

1. **Install**: User runs `claude plugin install`
2. **Scaffold**: User runs `/startup-os init` in project dir
3. **Profile**: Post-init hook guides profile setup
4. **Fill**: User runs fill commands (single module or all)
5. **Review**: User runs review/stress-test commands
6. **Iterate**: User updates profile and re-fills modules

---

## File Conventions

### Agent Files (`agents/*.md`)

All agent files follow this structure:

```markdown
---
name: module-builder
description: >
  Fills all template files in XX-module/...
allowed-tools: Read, Write, Edit, Bash
---

# Module Builder Agent

## Context to load before writing
[What to read first]

## Files to fill, in order
[List of 5 files]

## Writing rules for this module
[Domain-specific validation rules]

## After completing all files
[Update progress tracker]
```

### Template Files (`startup-os/**/*.md`)

All template files should include:
- Clear section headers with `[PLACEHOLDER]` markers
- Cross-links to related files (relative paths)
- `## Next Steps` section at the end (3 items)

---

## Version History

- **v1.0.0** (2026-05-29): Initial plugin structure
  - 10 modules, 50 templates
  - 10 specialized builder agents
  - Main skill with 10 commands
  - Post-init guided profile setup

---

## Maintenance Notes

- Template files are in `startup-os/` directory
- Agent files must stay in sync with template structure
- When adding/removing templates, update:
  1. Agent file list
  2. `_progress/tracker.md` template
  3. README.md file count
- All dates in agents are hardcoded to avoid `Date.now()` (breaks workflow resume)

---

Built for Claude Code 2.1.101+
