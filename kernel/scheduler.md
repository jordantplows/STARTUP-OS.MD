---
name: scheduler
description: >
  Determines the correct execution order for stdlib agents based
  on their dependency graph. Like a process scheduler in an OS —
  nothing runs until the scheduler approves it.
---

## What the scheduler does

Reads the `reads:` frontmatter of every agent in stdlib/ and builds
a directed acyclic graph (DAG) of dependencies. Agents whose `reads:`
are all satisfied run first. Blocked agents wait.

This is how startup-os guarantees that `finance/model.md` never runs
before `finance/pricing.md`, and `marketing/gtm-strategy.md` never
runs before `product/personas.md`.

## TypeScript

```typescript
import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'

export interface AgentNode {
  path: string
  dept: string
  name: string
  reads: string[]
  writes: string[]
}

export function buildDependencyGraph(stdlibRoot: string): AgentNode[] {
  const nodes: AgentNode[] = []
  const depts = readdirSync(stdlibRoot, { withFileTypes: true })
    .filter(d => d.isDirectory() && d.name !== 'output')
    .map(d => d.name)

  for (const dept of depts) {
    const deptPath = join(stdlibRoot, dept)
    const files = readdirSync(deptPath)
      .filter(f => f.endsWith('.md') && f !== 'README.md')

    for (const file of files) {
      const content = readFileSync(join(deptPath, file), 'utf-8')
      const readsMatch = content.match(/reads:\n((?:\s+- .+\n)+)/)
      const writesMatch = content.match(/writes:\n((?:\s+- .+\n)+)/)

      const reads = readsMatch?.[1]
        .split('\n').filter(l => l.trim().startsWith('- '))
        .map(l => l.trim().replace('- ', '')) ?? []

      const writes = writesMatch?.[1]
        .split('\n').filter(l => l.trim().startsWith('- '))
        .map(l => l.trim().replace('- ', '')) ?? []

      nodes.push({
        path: join(deptPath, file),
        dept,
        name: file.replace('.md', ''),
        reads,
        writes
      })
    }
  }

  return topologicalSort(nodes)
}

function topologicalSort(nodes: AgentNode[]): AgentNode[] {
  const writeMap = new Map<string, AgentNode>()
  for (const node of nodes) {
    for (const w of node.writes) writeMap.set(w, node)
  }

  const visited = new Set<string>()
  const result: AgentNode[] = []

  const visit = (node: AgentNode) => {
    if (visited.has(node.path)) return
    for (const dep of node.reads) {
      const depNode = writeMap.get(dep)
      if (depNode) visit(depNode)
    }
    visited.add(node.path)
    result.push(node)
  }

  for (const node of nodes) visit(node)
  return result
}
```
