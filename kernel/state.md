---
name: state
description: System state management — the process table of startup-os
---

## What state management does

System state management for startup-os. Reads and writes the Build Log
in CLAUDE.md. Tracks which agents have run, which failed, which are pending.
The equivalent of the process table in a real OS.

## TypeScript

```typescript
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

export type AgentStatus = 'pending' | 'running' | 'complete' | 'failed'

export interface DepartmentState {
  name: string
  status: '⬜ pending' | '🔵 in-progress' | '✅ complete' | '❌ failed'
  filesWritten: number
  completed: string
  agents: Map<string, AgentStatus>
}

export class StateManager {
  private workspaceRoot: string
  private departments: Map<string, DepartmentState> = new Map()

  constructor(workspaceRoot: string) {
    this.workspaceRoot = workspaceRoot
    this.loadState()
  }

  // Load current state from CLAUDE.md
  private loadState(): void {
    const claudePath = join(this.workspaceRoot, 'CLAUDE.md')
    const content = readFileSync(claudePath, 'utf-8')

    const buildLogMatch = content.match(/## Build Log\n\| Department.+\n\|[-|\s]+\n((?:\|.+\n)+)/)
    if (!buildLogMatch) return

    const rows = buildLogMatch[1].split('\n').filter(l => l.startsWith('|'))
    
    for (const row of rows) {
      const cells = row.split('|').map(c => c.trim()).filter(c => c)
      if (cells.length >= 4) {
        const [name, status, filesWritten, completed] = cells
        this.departments.set(name, {
          name,
          status: status as DepartmentState['status'],
          filesWritten: parseInt(filesWritten) || 0,
          completed,
          agents: new Map()
        })
      }
    }
  }

  // Update department state
  updateDepartment(
    dept: string,
    status: DepartmentState['status'],
    filesWritten?: number,
    completed?: string
  ): void {
    const current = this.departments.get(dept) || {
      name: dept,
      status: '⬜ pending',
      filesWritten: 0,
      completed: '-',
      agents: new Map()
    }

    if (filesWritten !== undefined) current.filesWritten = filesWritten
    if (completed) current.completed = completed
    current.status = status

    this.departments.set(dept, current)
    this.persist()
  }

  // Update agent state within a department
  updateAgent(dept: string, agent: string, status: AgentStatus): void {
    const deptState = this.departments.get(dept)
    if (deptState) {
      deptState.agents.set(agent, status)
      this.departments.set(dept, deptState)
    }
  }

  // Persist state back to CLAUDE.md
  private persist(): void {
    const claudePath = join(this.workspaceRoot, 'CLAUDE.md')
    let content = readFileSync(claudePath, 'utf-8')

    for (const [dept, state] of this.departments) {
      const statusStr = state.status.padEnd(12)
      const filesStr = state.filesWritten > 0 ? state.filesWritten.toString() : '-'
      const completedStr = state.completed
      
      const row = `| ${dept.padEnd(12)} | ${statusStr} | ${filesStr.padEnd(13)} | ${completedStr.padEnd(13)} |`
      
      const regex = new RegExp(`\\| ${dept}\\s+\\|[^\\n]+`, 'g')
      content = content.replace(regex, row)
    }

    writeFileSync(claudePath, content, 'utf-8')
  }

  // Get state for a department
  getDepartment(dept: string): DepartmentState | undefined {
    return this.departments.get(dept)
  }

  // Get all departments
  getAllDepartments(): DepartmentState[] {
    return Array.from(this.departments.values())
  }
}
```
