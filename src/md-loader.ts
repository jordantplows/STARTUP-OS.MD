import { readFileSync, readdirSync, statSync } from 'fs'
import { join, extname } from 'path'

export interface AgentMetadata {
  name: string
  description: string
  department: string
  role: 'steering' | 'watcher' | 'generator'
  watches: string[]
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

    const directories = [
      join(rootDir, 'executives'),
      join(rootDir, 'departments'),
      join(rootDir, 'red-team'),
      join(rootDir, 'core'),
    ]

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
    if (!frontmatterMatch) return null

    const frontmatterText = frontmatterMatch[1]
    const lines = frontmatterText.split('\n')

    const metadata: Partial<AgentMetadata> = {
      watches: [],
    }

    let inWatches = false

    for (const line of lines) {
      if (line.trim().startsWith('watches:')) {
        inWatches = true
        continue
      }

      if (inWatches) {
        if (line.startsWith('  - ')) {
          metadata.watches!.push(line.replace('  - ', '').trim())
        } else if (line.trim() && !line.startsWith(' ')) {
          inWatches = false
        }
      }

      if (line.startsWith('name:')) {
        metadata.name = line.replace('name:', '').trim()
      } else if (line.startsWith('description:')) {
        metadata.description = line.replace('description:', '').trim()
      } else if (line.startsWith('department:')) {
        metadata.department = line.replace('department:', '').trim()
      } else if (line.startsWith('role:')) {
        metadata.role = line.replace('role:', '').trim() as AgentMetadata['role']
      }
    }

    if (!metadata.name || !metadata.description || !metadata.department || !metadata.role) {
      return null
    }

    return metadata as AgentMetadata
  }

  private extractTypeScript(content: string): string | null {
    const codeBlockMatch = content.match(/```typescript\n([\s\S]*?)```/)
    if (!codeBlockMatch) return null

    return codeBlockMatch[1].trim()
  }

  private extractSections(content: string): { instructions: string; coordination: string } {
    const sections = { instructions: '', coordination: '' }

    const instructionsMatch = content.match(/## Instructions\n([\s\S]*?)(?=\n## |\n```|$)/)
    if (instructionsMatch) {
      sections.instructions = instructionsMatch[1].trim()
    }

    const coordinationMatch = content.match(/## Coordination\n([\s\S]*?)(?=\n## |$)/)
    if (coordinationMatch) {
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
