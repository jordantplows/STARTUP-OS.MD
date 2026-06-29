import { readFileSync, readdirSync, statSync } from 'fs'
import { join, extname } from 'path'

export interface AgentMetadata {
  name: string
  description?: string
  executive?: string
  department?: string
  role: 'steering' | 'watching' | 'generating' | 'watcher' | 'generator'
  reads?: string[]
  writes?: string[]
  events?: {
    emits?: string[]
    watches?: string[]
  }
  watches?: string[]
  templateRef?: string
}

export interface LoadedAgent {
  metadata: AgentMetadata
  filepath: string
  instructions: string
  typescript: string
  coordination: string
}

export class MDLoader {
  private agentCache: Map<string, LoadedAgent> = new Map()

  loadAllAgents(): LoadedAgent[] {
    const agents: LoadedAgent[] = []
    const rootDir = process.cwd()

    const excludedDirs = new Set([
      'node_modules', 'dist', '.git', '.github', '.claude',
      '.claude-plugin', 'src', 'templates', 'mcp', '.memory',
      '.audit', 'workspace', '.startup-os', 'debug'
    ])

    const entries = readdirSync(rootDir)
    const directories: string[] = []

    for (const entry of entries) {
      if (excludedDirs.has(entry)) continue

      const fullPath = join(rootDir, entry)
      try {
        const stat = statSync(fullPath)
        if (stat.isDirectory()) {
          directories.push(fullPath)
        }
      } catch (error) {
        continue
      }
    }

    for (const dir of directories) {
      try {
        this.scanDirectory(dir, agents)
      } catch (error) {
        console.warn(`Warning: Could not scan directory ${dir}`)
      }
    }

    agents.forEach(agent => {
      this.agentCache.set(agent.metadata.name, agent)
    })

    return agents
  }

  private scanDirectory(dir: string, agents: LoadedAgent[]): void {
    try {
      const entries = readdirSync(dir)

      for (const entry of entries) {
        const fullPath = join(dir, entry)
        const stat = statSync(fullPath)

        if (stat.isDirectory()) {
          this.scanDirectory(fullPath, agents)
        } else if (stat.isFile() && extname(entry) === '.md') {
          try {
            const agent = this.loadAgent(fullPath)
            if (agent) {
              agents.push(agent)
            }
          } catch (error) {
            console.warn(`Warning: Could not load agent from ${fullPath}:`, error)
          }
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not read directory ${dir}`)
    }
  }

  loadAgent(filepath: string): LoadedAgent | null {
    const content = readFileSync(filepath, 'utf-8')

    const frontmatter = this.parseFrontmatter(content)
    if (!frontmatter) {
      console.warn(`No frontmatter in ${filepath}`)
      return null
    }

    const typescript = this.extractTypeScript(content)
    if (!typescript) {
      console.warn(`No TypeScript block in ${filepath}`)
      return null
    }

    const sections = this.extractSections(content)

    return {
      metadata: frontmatter,
      filepath,
      instructions: sections.instructions || '',
      typescript,
      coordination: sections.coordination || '',
    }
  }

  private parseFrontmatter(content: string): AgentMetadata | null {
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
    if (!frontmatterMatch || !frontmatterMatch[1]) return null

    const frontmatterText = frontmatterMatch[1]
    const lines = frontmatterText.split('\n')

    const metadata: Partial<AgentMetadata> = {
      watches: [],
      reads: [],
      writes: [],
      events: { emits: [], watches: [] }
    }

    let currentArrayField: 'watches' | 'reads' | 'writes' | null = null
    let inEventsEmits = false
    let inEventsWatches = false

    for (const line of lines) {
      const trimmed = line.trim()

      if (trimmed.startsWith('name:')) {
        metadata.name = trimmed.replace('name:', '').trim()
        currentArrayField = null
        inEventsEmits = false
        inEventsWatches = false
      } else if (trimmed.startsWith('description:')) {
        metadata.description = trimmed.replace('description:', '').trim()
        currentArrayField = null
        inEventsEmits = false
        inEventsWatches = false
      } else if (trimmed.startsWith('executive:')) {
        metadata.executive = trimmed.replace('executive:', '').trim()
        currentArrayField = null
        inEventsEmits = false
        inEventsWatches = false
      } else if (trimmed.startsWith('department:')) {
        metadata.department = trimmed.replace('department:', '').trim()
        currentArrayField = null
        inEventsEmits = false
        inEventsWatches = false
      } else if (trimmed.startsWith('role:')) {
        metadata.role = trimmed.replace('role:', '').trim() as AgentMetadata['role']
        currentArrayField = null
        inEventsEmits = false
        inEventsWatches = false
      } else if (trimmed.startsWith('template-ref:')) {
        metadata.templateRef = trimmed.replace('template-ref:', '').trim()
        currentArrayField = null
        inEventsEmits = false
        inEventsWatches = false
      } else if (trimmed.startsWith('watches:')) {
        currentArrayField = 'watches'
        inEventsEmits = false
        inEventsWatches = false
        // Handle inline array: watches: [item1, item2]
        const inlineMatch = trimmed.match(/watches:\s*\[(.*)\]/)
        if (inlineMatch && inlineMatch[1] && metadata.watches) {
          const items = inlineMatch[1].split(',').map(s => s.trim()).filter(s => s)
          metadata.watches.push(...items)
          currentArrayField = null
        }
      } else if (trimmed.startsWith('reads:')) {
        currentArrayField = 'reads'
        inEventsEmits = false
        inEventsWatches = false
        // Handle inline array: reads: [item1, item2]
        const inlineMatch = trimmed.match(/reads:\s*\[(.*)\]/)
        if (inlineMatch && inlineMatch[1] && metadata.reads) {
          const items = inlineMatch[1].split(',').map(s => s.trim()).filter(s => s)
          metadata.reads.push(...items)
          currentArrayField = null
        }
      } else if (trimmed.startsWith('writes:')) {
        currentArrayField = 'writes'
        inEventsEmits = false
        inEventsWatches = false
        // Handle inline array: writes: [item1, item2]
        const inlineMatch = trimmed.match(/writes:\s*\[(.*)\]/)
        if (inlineMatch && inlineMatch[1] && metadata.writes) {
          const items = inlineMatch[1].split(',').map(s => s.trim()).filter(s => s)
          metadata.writes.push(...items)
          currentArrayField = null
        }
      } else if (trimmed === 'events:') {
        currentArrayField = null
        inEventsEmits = false
        inEventsWatches = false
      } else if (trimmed.startsWith('emits:') && line.startsWith('  ')) {
        inEventsEmits = true
        inEventsWatches = false
        currentArrayField = null
        // Handle inline array: emits: [item1, item2]
        const inlineMatch = trimmed.match(/emits:\s*\[(.*)\]/)
        if (inlineMatch && inlineMatch[1] && metadata.events?.emits) {
          const items = inlineMatch[1].split(',').map(s => s.trim()).filter(s => s)
          metadata.events.emits.push(...items)
          inEventsEmits = false
        }
      } else if (trimmed.startsWith('watches:') && line.startsWith('  ')) {
        inEventsWatches = true
        inEventsEmits = false
        currentArrayField = null
        // Handle inline array: watches: [item1, item2]
        const inlineMatch = trimmed.match(/watches:\s*\[(.*)\]/)
        if (inlineMatch && inlineMatch[1] && metadata.events?.watches) {
          const items = inlineMatch[1].split(',').map(s => s.trim()).filter(s => s)
          metadata.events.watches.push(...items)
          inEventsWatches = false
        }
      } else if (trimmed.startsWith('- ')) {
        const value = trimmed.replace(/^-\s*/, '').trim()
        if (inEventsEmits && metadata.events?.emits) {
          metadata.events.emits.push(value)
        } else if (inEventsWatches && metadata.events?.watches) {
          metadata.events.watches.push(value)
        } else if (currentArrayField === 'watches' && metadata.watches) {
          metadata.watches.push(value)
        } else if (currentArrayField === 'reads' && metadata.reads) {
          metadata.reads.push(value)
        } else if (currentArrayField === 'writes' && metadata.writes) {
          metadata.writes.push(value)
        }
      } else if (trimmed && !trimmed.startsWith(' ') && !line.startsWith('  ')) {
        currentArrayField = null
        inEventsEmits = false
        inEventsWatches = false
      }
    }

    if (!metadata.name || !metadata.role) {
      return null
    }

    return metadata as AgentMetadata
  }

  private extractTypeScript(content: string): string | null {
    const codeBlockMatch = content.match(/```typescript\n([\s\S]*?)```/)
    if (!codeBlockMatch || !codeBlockMatch[1]) return null

    return codeBlockMatch[1].trim()
  }

  private extractSections(content: string): { instructions: string; coordination: string } {
    const sections = { instructions: '', coordination: '' }

    const instructionsMatch = content.match(/## Instructions\n([\s\S]*?)(?=\n## |\n```|$)/)
    if (instructionsMatch && instructionsMatch[1]) {
      sections.instructions = instructionsMatch[1].trim()
    }

    const coordinationMatch = content.match(/## Coordination\n([\s\S]*?)(?=\n## |$)/)
    if (coordinationMatch && coordinationMatch[1]) {
      sections.coordination = coordinationMatch[1].trim()
    }

    return sections
  }

  getAgent(name: string): LoadedAgent | undefined {
    return this.agentCache.get(name)
  }

  getAllAgentNames(): string[] {
    return Array.from(this.agentCache.keys())
  }

  getAgentsByDepartment(department: string): LoadedAgent[] {
    return Array.from(this.agentCache.values()).filter(
      agent => agent.metadata.department === department
    )
  }

  getAgentsByRole(role: AgentMetadata['role']): LoadedAgent[] {
    return Array.from(this.agentCache.values()).filter(
      agent => agent.metadata.role === role
    )
  }
}
