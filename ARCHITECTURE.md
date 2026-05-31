# startup-os Architecture

startup-os is a programming language and runtime for building companies.
It is structured as a real operating system with six layers.

## Layer model

```
apps/        user-land applications built on top of startup-os
stdlib/      standard library — 12 department agent .md files
syscalls/    primitive operations — read, write, exec, pipe
kernel/      scheduler, state management, error handling
runtime/     the boot process — cli.ts
hardware/    Anthropic API, Node.js, filesystem, CLAUDE.md
```

## The .md file as the execution unit

Every file in stdlib/ is a self-contained program in the
startup-os language. It contains:
- Frontmatter: metadata, dependencies (reads:), outputs (writes:)
- Instructions: what the program does in prose
- TypeScript: the implementation
- Output schema: what a successful execution produces

## How a build works

1. runtime/ boots — cli.ts parses the command
2. kernel/scheduler builds the dependency DAG from all stdlib agents
3. Agents execute in topological order via syscalls/run-agent
4. Each agent receives upstream context via syscalls/pipe-context
5. Output is written via syscalls/write-output
6. kernel/consistency validates cross-department coherence
7. apps/ can consume outputs via the syscall interface

## Layer Details

### Hardware Layer

The lowest layer — actual infrastructure the OS runs on:
- **anthropic.md**: Anthropic API specs (model, tokens, rate limits, costs)
- **filesystem.md**: File I/O conventions (paths, permissions, atomic writes)
- **claude-md-spec.md**: CLAUDE.md format specification (the BIOS)

### Runtime Layer

The boot process:
- **cli.ts**: Entry point, command parsing, OS initialization
- Connects hardware to kernel
- Manages API client lifecycle
- Handles user commands (build, run, status, init, reset)

### Kernel Layer

Core OS services:
- **scheduler.md**: Dependency graph, topological sort, execution order
- **ipc.md**: Inter-process communication, named channels
- **state.md**: Build log management, process table
- **consistency.md**: Cross-department validation rules
- **error-handler.md**: Error capture, retry logic, halt decisions

### Syscalls Layer

Primitive operations every agent calls:
- **read-profile.md**: Parse CLAUDE.md startup profile
- **write-output.md**: Write agent output to stdlib/*/output/
- **pipe-context.md**: Read upstream agent outputs as context
- **run-agent.md**: Execute a .md agent via Anthropic API
- **update-buildlog.md**: Update CLAUDE.md build log table
- **emit-event.md**: Fire lifecycle events for hooks
- **cross-check.md**: Validate consistency between two outputs
- **snapshot-state.md**: Create timestamped backup of all outputs
- **generate-pdf.md**: Convert markdown/HTML to styled PDF (5 themes)
- **generate-csv.md**: Generate structured CSV files from data models
- **generate-html.md**: Generate standalone HTML (6 templates)
- **generate-svg.md**: Generate SVG files via AI (6 types)

### Stdlib Layer

Standard library — 17 departments with 25+ specialized agents:

**Core Operations (12 departments):**
- **strategy/**: Vision, mission, positioning, competitive analysis
- **brand/**: Voice, visual identity, messaging
- **product/**: Roadmap, features, PRDs, personas
- **finance/**: Pricing, model, fundraising, cap table, FP&A, controller
- **marketing/**: GTM strategy, content, campaigns
- **sales/**: Playbooks, pricing strategy, training
- **legal/**: Entity structure, terms, privacy policy
- **people/**: Org chart, job descriptions, compensation
- **operations/**: Processes, vendor management, IT
- **metrics/**: KPIs, dashboards, OKRs
- **security/**: Threat model, audit, compliance
- **engineering/**: Architecture, infrastructure, deployment

**Enterprise Extensions (5 departments, 23 agents):**
- **design/** (7 agents): UI designer, UX designer, canvas designer, brand designer, design systems engineer, motion designer, UX researcher
- **executive/** (6 agents): CEO, CTO, CFO, CMO, CPO, COO
- **growth/** (4 agents): Growth hacker, demand gen, SEO specialist, content strategist
- **data/** (3 agents): Data analyst, ML engineer, BI analyst
- **customer/** (3 agents): Customer success, customer support, CX designer

Each department contains:
- Agent .md files (programs)
- output/ directory (MD + PDF + CSV + HTML + SVG files)

### Apps Layer

User-land applications built on startup-os:
- Git submodules (separate repos)
- Consume stdlib outputs
- Use syscall interfaces
- Examples: Web UI, API server, documentation site

## Data Flow

```
User Command
    ↓
runtime/cli.ts
    ↓
kernel/scheduler → builds dependency graph
    ↓
For each agent:
    kernel/state → mark as running
    syscalls/read-profile → get startup profile
    syscalls/pipe-context → get upstream outputs
    syscalls/run-agent → execute via Anthropic API
    syscalls/write-output → save result
    kernel/consistency → validate if needed
    kernel/state → mark as complete
    ↓
kernel/consistency → final cross-checks
    ↓
syscalls/snapshot-state → backup outputs
```

## Dependency Graph

Agents declare dependencies in frontmatter:

```yaml
---
name: gtm-strategy
reads:
  - stdlib/product/output/personas-filled.md
  - stdlib/brand/output/voice-filled.md
writes:
  - stdlib/marketing/output/gtm-strategy-filled.md
---
```

The scheduler ensures:
- `product/personas` runs before `marketing/gtm-strategy`
- `brand/voice` runs before `marketing/gtm-strategy`
- No agent runs before its dependencies are satisfied

## Consistency Validation

After departments complete, kernel/consistency runs cross-checks:

- **ICP alignment**: product personas ↔ marketing GTM
- **Pricing**: finance model ↔ sales pricing strategy
- **Brand**: strategy voice ↔ marketing content
- **Metrics**: finance model ↔ metrics KPIs

Inconsistencies are written to `_reports/consistency.md`.

## Error Handling

The kernel/error-handler:
1. Catches agent failures
2. Logs to `_reports/errors.md`
3. Determines if error is recoverable (rate limit, timeout, etc.)
4. Retries up to 3 times with exponential backoff
5. Marks department as failed if non-recoverable
6. Decides whether to halt build or continue

## State Management

The kernel/state manager:
- Reads Build Log from CLAUDE.md on boot
- Tracks which agents are pending/running/complete/failed
- Updates CLAUDE.md after each agent
- Maintains in-memory process table
- Provides state queries for CLI commands

## Apps

apps/ contains git submodules — external repos that run ON startup-os.

They can:
- Read outputs from `stdlib/*/output/`
- Subscribe to IPC channels for real-time updates
- Call syscalls for consistency checks
- Trigger builds via CLI commands

They cannot:
- Modify kernel or syscalls
- Write to stdlib/ directly
- Change OS behavior

## Contributing

- **stdlib/**: Add or improve agents (most contributions)
- **syscalls/**: Add new OS primitives
- **kernel/**: Improve scheduling, IPC, or consistency checking
- **hardware/**: Update specs as APIs evolve
- **runtime/**: Improve CLI, add commands
- **apps/**: Build a new app on top (separate repo)

## File Naming Conventions

- **Agent programs**: `stdlib/<dept>/<name>.md`
- **Agent outputs**: `stdlib/<dept>/output/<name>-filled.md`
- **Reports**: `_reports/<name>.md`
- **Snapshots**: `_reports/snapshots/<timestamp>/<dept>/<name>-filled.md`

## Future Architecture

Planned enhancements:
- **Parallel execution**: Run independent agents concurrently
- **Streaming output**: Real-time agent output display
- **Plugin system**: Third-party syscalls and kernel modules
- **Distributed mode**: Multi-machine execution for large builds
- **Checkpoint/resume**: Pause and resume builds
- **Agent hot-reload**: Edit agents during build
- **IPC pub/sub**: Real-time event streams for apps
