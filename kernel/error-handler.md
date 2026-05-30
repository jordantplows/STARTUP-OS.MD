---
name: error-handler
description: Catches agent failures and decides halt or continue
---

## What the error handler does

Catches agent failures, logs them to `_reports/errors.md`, marks
the build log appropriately, and decides whether to halt or continue.
Retries transient API failures up to 3 times with exponential backoff.

## TypeScript

```typescript
import { writeFileSync, appendFileSync, mkdirSync } from 'fs'
import { join } from 'path'

export interface AgentError {
  timestamp: string
  dept: string
  agent: string
  error: string
  stack?: string
  attempt: number
  recoverable: boolean
}

export class ErrorHandler {
  private workspaceRoot: string
  private errors: AgentError[] = []
  private maxRetries = 3

  constructor(workspaceRoot: string) {
    this.workspaceRoot = workspaceRoot
    this.initErrorLog()
  }

  private initErrorLog(): void {
    const reportsDir = join(this.workspaceRoot, '_reports')
    mkdirSync(reportsDir, { recursive: true })
    
    const errorLogPath = join(reportsDir, 'errors.md')
    const header = `# Error Log\n\nGenerated: ${new Date().toISOString()}\n\n`
    writeFileSync(errorLogPath, header, 'utf-8')
  }

  // Handle an agent error with retry logic
  async handleError(
    error: Error,
    dept: string,
    agent: string,
    attempt: number,
    retryFn?: () => Promise<string>
  ): Promise<string | null> {
    const agentError: AgentError = {
      timestamp: new Date().toISOString(),
      dept,
      agent,
      error: error.message,
      stack: error.stack,
      attempt,
      recoverable: this.isRecoverable(error)
    }

    this.errors.push(agentError)
    this.logError(agentError)

    // Retry transient errors
    if (agentError.recoverable && attempt < this.maxRetries && retryFn) {
      const backoffMs = Math.pow(2, attempt) * 1000
      console.log(`  ⟳ retrying in ${backoffMs/1000}s... (attempt ${attempt + 1}/${this.maxRetries})`)
      
      await new Promise(resolve => setTimeout(resolve, backoffMs))
      
      try {
        return await retryFn()
      } catch (retryError) {
        return this.handleError(retryError as Error, dept, agent, attempt + 1, retryFn)
      }
    }

    return null
  }

  // Determine if an error is recoverable (transient)
  private isRecoverable(error: Error): boolean {
    const message = error.message.toLowerCase()
    
    // Transient API errors
    if (message.includes('rate limit')) return true
    if (message.includes('timeout')) return true
    if (message.includes('network')) return true
    if (message.includes('503')) return true
    if (message.includes('429')) return true
    
    // Non-recoverable errors
    if (message.includes('authentication')) return false
    if (message.includes('invalid')) return false
    if (message.includes('not found')) return false
    
    return false
  }

  // Log error to _reports/errors.md
  private logError(error: AgentError): void {
    const errorLogPath = join(this.workspaceRoot, '_reports', 'errors.md')
    
    const entry = `## ${error.dept}/${error.agent} (attempt ${error.attempt})\n\n` +
      `**Time**: ${error.timestamp}\n` +
      `**Recoverable**: ${error.recoverable ? 'Yes' : 'No'}\n\n` +
      `\`\`\`\n${error.error}\n\`\`\`\n\n` +
      (error.stack ? `<details>\n<summary>Stack trace</summary>\n\n\`\`\`\n${error.stack}\n\`\`\`\n</details>\n\n` : '') +
      '---\n\n'
    
    appendFileSync(errorLogPath, entry, 'utf-8')
  }

  // Decide whether to halt the build
  shouldHalt(dept: string): boolean {
    const deptErrors = this.errors.filter(e => e.dept === dept)
    
    // Halt if any non-recoverable error
    if (deptErrors.some(e => !e.recoverable)) return true
    
    // Halt if too many errors in this department
    if (deptErrors.length >= 5) return true
    
    return false
  }

  // Get all errors
  getAll(): AgentError[] {
    return this.errors
  }

  // Get errors for a specific department
  getDepartmentErrors(dept: string): AgentError[] {
    return this.errors.filter(e => e.dept === dept)
  }
}
```
