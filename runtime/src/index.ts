export type StartupProfile = Record<string, string>

export interface AgentResult {
  department: string
  agent: string
  output: string
  success: boolean
}

export interface BuildLog {
  department: string
  status: 'pending' | 'done' | 'failed'
  filesWritten: number
  completed: string
}

// Re-export main functions for programmatic use
export { runBuild, runDepartment } from './cli.js'
