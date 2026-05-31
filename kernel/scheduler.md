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

## Multi-format output generation

After an agent completes its main execution, the scheduler reads the
`outputs:` frontmatter block and invokes the appropriate generation
syscalls to produce PDFs, CSVs, HTML, SVG, and other formats.

The scheduler:
1. Runs the agent → gets markdown content
2. Writes markdown via `write-output` syscall (always)
3. Reads the `outputs:` frontmatter block
4. For each non-md output, calls the appropriate generation syscall:
   - `generate-pdf` for PDFs (with theme, orientation options)
   - `generate-csv` for CSVs
   - `generate-html` for HTML (with template option)
   - `generate-svg` for SVGs (with type option)
5. Reports all generated file paths in the build log

Example `outputs:` frontmatter:
```yaml
outputs:
  - format: pdf
    syscall: generate-pdf
    theme: pitch
    orientation: landscape
    path: stdlib/brand/output/pitch-deck.pdf
  - format: csv
    syscall: generate-csv
    path: stdlib/finance/output/financial-model.csv
  - format: html
    syscall: generate-html
    template: dashboard
    path: stdlib/data/output/metrics-dashboard.html
```

## TypeScript

```typescript
import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'

export interface OutputSpec {
  format: 'md' | 'pdf' | 'csv' | 'html' | 'svg' | 'json' | 'css'
  syscall?: string
  type?: string
  template?: string
  theme?: string
  orientation?: 'portrait' | 'landscape'
  path: string
}

export interface AgentNode {
  path: string
  dept: string
  name: string
  reads: string[]
  writes: string[]
  outputs: OutputSpec[]
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
      const outputsMatch = content.match(/outputs:\n((?:\s+- .+\n|\s+[a-z]+:.+\n)+)/)

      const reads = readsMatch?.[1]
        .split('\n').filter(l => l.trim().startsWith('- '))
        .map(l => l.trim().replace('- ', '')) ?? []

      const writes = writesMatch?.[1]
        .split('\n').filter(l => l.trim().startsWith('- '))
        .map(l => l.trim().replace('- ', '')) ?? []

      // Parse outputs: frontmatter for multi-format generation
      const outputs: OutputSpec[] = []
      if (outputsMatch) {
        const outputsYaml = outputsMatch[1]
        const outputBlocks = outputsYaml.split(/\n\s+- format:/).filter(Boolean)
        for (const block of outputBlocks) {
          const lines = block.split('\n').map(l => l.trim())
          const spec: any = {}
          for (const line of lines) {
            if (line.includes(':')) {
              const [key, ...valParts] = line.split(':')
              spec[key.trim()] = valParts.join(':').trim()
            }
          }
          outputs.push(spec as OutputSpec)
        }
      }

      nodes.push({
        path: join(deptPath, file),
        dept,
        name: file.replace('.md', ''),
        reads,
        writes,
        outputs
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
