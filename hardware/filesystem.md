---
name: filesystem
description: Filesystem hardware interface specification
layer: hardware
---

## What this hardware layer does

Documents the filesystem interface — where and how startup-os
reads and writes files. This is the equivalent of disk I/O
specifications for a real operating system.

## Directory Structure

```
/workspace-root/
├── CLAUDE.md              ← system memory (startup profile + build log)
├── stdlib/                ← standard library (12 departments)
│   ├── strategy/
│   │   ├── *.md           ← agent programs
│   │   └── output/        ← agent outputs
│   ├── brand/
│   ├── product/
│   └── .../
├── _reports/              ← system reports (not committed)
│   ├── errors.md
│   ├── consistency.md
│   ├── api-log.jsonl
│   └── snapshots/
├── syscalls/              ← OS primitives
├── kernel/                ← core OS logic
├── runtime/               ← boot process
├── hardware/              ← interface specs (this file)
└── apps/                  ← user-land applications
```

## Path Conventions

### Input Paths

All agent `.md` files read from:
```
stdlib/<dept>/<agent>.md
```

### Output Paths

All agent outputs write to:
```
stdlib/<dept>/output/<agent>-filled.md
```

### Report Paths

All system reports write to:
```
_reports/<report-name>.md
_reports/snapshots/<timestamp>/
```

### Temporary Files

Temporary files during execution:
```
/tmp/startup-os-<session-id>/
```

## File Permissions

- **Agent programs** (`stdlib/*/*.md`): Read-only during execution
- **Agent outputs** (`stdlib/*/output/*`): Write by syscalls only
- **CLAUDE.md**: Read by all, write by kernel/state only
- **Reports**: Write by kernel/syscalls only
- **Snapshots**: Write by syscalls/snapshot-state only

## Gitignore Rules

The following MUST be in `.gitignore`:

```
# Agent outputs (generated)
stdlib/*/output/

# System reports (generated)
_reports/

# Build artifacts
dist/
node_modules/
.turbo/

# Environment
.env
.env.local

# Temporary files
/tmp/
*.log
```

## File Watching

The kernel should watch these files for changes:
- `CLAUDE.md` — reload startup profile if edited
- `stdlib/*/*.md` — reload agent if edited during development

Do NOT watch:
- `output/` directories — infinite loop risk
- `node_modules/`
- `.git/`

## Atomic Writes

All syscalls that write files MUST:
1. Write to temporary file first
2. Verify write succeeded
3. Atomically rename to final path

This prevents partial writes if process is killed.

```typescript
import { writeFileSync, renameSync } from 'fs'
import { join } from 'path'

function atomicWrite(path: string, content: string): void {
  const tmpPath = `${path}.tmp`
  writeFileSync(tmpPath, content, 'utf-8')
  renameSync(tmpPath, path)
}
```

## Symlinks

Agents should NOT follow symlinks outside the workspace root.
This prevents accidentally reading/writing files outside the project.

## File Size Limits

- **Agent programs**: Max 100 KB per .md file
- **Agent outputs**: Max 500 KB per output file
- **Total workspace**: No hard limit (but monitor growth)

If an agent produces output > 500 KB, the syscall should:
1. Warn user
2. Truncate to 500 KB
3. Write full output to `_reports/oversized/<agent>.md`

## Performance Notes

- Use streaming reads for large files
- Batch file operations where possible
- Cache file stats to reduce syscalls
- Use `fs.promises` for concurrent I/O
