import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

// ============================================================================
// AGENT MEMORY SYSTEM
// ============================================================================

const MEMORY_DIR = join(process.cwd(), '.memory')

/**
 * Ensures the memory directory exists
 */
function ensureMemoryDir(): void {
  if (!existsSync(MEMORY_DIR)) {
    mkdirSync(MEMORY_DIR, { recursive: true })
  }
}

/**
 * Writes a value to an agent's memory
 */
export function writeAgentMemory(agent: string, data: Record<string, any>): void {
  ensureMemoryDir()

  const memoryPath = join(MEMORY_DIR, `${agent}.json`)

  let existing: Record<string, any> = {}
  if (existsSync(memoryPath)) {
    existing = JSON.parse(readFileSync(memoryPath, 'utf-8'))
  }

  const updated = { ...existing, ...data }
  writeFileSync(memoryPath, JSON.stringify(updated, null, 2))
}

/**
 * Reads a specific key from an agent's memory
 */
export function recallForAgent(agent: string, key: string): any {
  const memory = recallAll(agent)
  return memory?.[key]
}

/**
 * Reads all memory for an agent
 */
export function recallAll(agent: string): Record<string, any> | null {
  ensureMemoryDir()

  const memoryPath = join(MEMORY_DIR, `${agent}.json`)

  if (!existsSync(memoryPath)) {
    return null
  }

  return JSON.parse(readFileSync(memoryPath, 'utf-8'))
}

/**
 * Reads an agent's memory as the default import for backwards compatibility
 */
export function readAgentMemory(agent: string): Record<string, any> | null {
  return recallAll(agent)
}

/**
 * Removes a specific key from an agent's memory
 */
export function forgetForAgent(agent: string, key: string): void {
  ensureMemoryDir()

  const memoryPath = join(MEMORY_DIR, `${agent}.json`)

  if (!existsSync(memoryPath)) {
    return
  }

  const memory = JSON.parse(readFileSync(memoryPath, 'utf-8'))
  delete memory[key]

  writeFileSync(memoryPath, JSON.stringify(memory, null, 2))
}

/**
 * Summarizes an agent's memory by compressing old entries
 * Called automatically when memory file exceeds 10KB
 */
export function summarizeMemory(agent: string): void {
  ensureMemoryDir()

  const memoryPath = join(MEMORY_DIR, `${agent}.json`)

  if (!existsSync(memoryPath)) {
    return
  }

  const stats = require('fs').statSync(memoryPath)

  if (stats.size < 10 * 1024) {
    return // Under 10KB, no need to summarize
  }

  const memory = JSON.parse(readFileSync(memoryPath, 'utf-8'))

  // Keep only recent entries
  const recentKeys = ['lastRun', 'lastVersion', 'currentState']
  const summarized: Record<string, any> = {}

  // Keep recent keys
  recentKeys.forEach(key => {
    if (memory[key]) {
      summarized[key] = memory[key]
    }
  })

  // Add summary note
  summarized._summarized = new Date().toISOString()
  summarized._originalSize = stats.size

  writeFileSync(memoryPath, JSON.stringify(summarized, null, 2))

  console.log(`[memory] Summarized ${agent} memory: ${stats.size} → ${JSON.stringify(summarized).length} bytes`)
}

/**
 * Removes all memory for an agent
 */
export function clearAgentMemory(agent: string): void {
  ensureMemoryDir()

  const memoryPath = join(MEMORY_DIR, `${agent}.json`)

  if (existsSync(memoryPath)) {
    writeFileSync(memoryPath, '{}')
  }
}
