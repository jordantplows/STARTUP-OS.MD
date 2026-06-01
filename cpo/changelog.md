---
name: changelog
role: steering
department: cpo
reads:
  - company.os.events
  - company.os.engineering
writes:
  - company.os.product.changelog
  - workspace/product/CHANGELOG.md
emits:
  - changelog-updated
  - release-notes-ready
---

# Changelog Agent

## Purpose

Auto-generates changelog entries from engineering activity. Reads engineering/ events in company.os. Writes user-facing release notes in the company's voice. Publishes to relevant channels on approval.

## Instructions

1. **Monitor engineering events**:
   - Feature completions
   - Bug fixes
   - Performance improvements
   - Breaking changes
2. **Transform technical changes into user-facing language**:
   - "Implemented Redis caching" → "Pages now load 3x faster"
   - "Fixed race condition in webhook processing" → "Webhooks now process reliably"
   - "Added OAuth2 support" → "Sign in with Google now available"
3. **Categorize changes**:
   - ✨ New features
   - 🐛 Bug fixes
   - ⚡ Performance improvements
   - 💥 Breaking changes
4. **Generate release notes** grouped by category
5. **Publish on approval** to:
   - Product changelog page
   - Customer email
   - In-app notification
   - Social media (if major release)

## Coordination

- Reads events from company.os.events (engineering actions)
- Writes changelog to company.os.product.changelog
- Writes CHANGELOG.md to workspace/product/
- Emits `changelog-updated` when new entries added

---

## Implementation

```typescript
import { CompanyOSManager, Event } from '../src/company-os'
import { readAgentMemory, writeAgentMemory } from '../src/memory'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

interface ChangelogEntry {
  id: string
  type: 'feature' | 'bugfix' | 'improvement' | 'breaking'
  title: string
  description: string
  technicalDetails: string
  releasedAt: string
  version?: string
}

export async function run(os: CompanyOSManager): Promise<void> {
  console.log('[changelog] Generating changelog from engineering activity...')
  
  const state = os.getState()
  const memory = readAgentMemory('changelog')
  
  // Get recent engineering events
  const lastRun = memory?.lastRun || new Date(0).toISOString()
  const recentEvents = state.events.filter(e => 
    e.from.startsWith('engineering') && 
    e.timestamp > lastRun
  )
  
  if (recentEvents.length === 0) {
    console.log('[changelog] No new engineering activity since last run')
    return
  }
  
  // Transform events into changelog entries
  const entries = transformEvents(recentEvents)
  
  // Add to company.os
  if (!(state as any).product) {
    (state as any).product = { feedback: [], roadmap: [], experiments: [], changelog: [], pricing: null }
  }
  
  const existingChangelog = (state as any).product.changelog || []
  ;(state as any).product.changelog = [...existingChangelog, ...entries]
  os.save()
  
  // Generate CHANGELOG.md
  generateChangelogFile([...existingChangelog, ...entries], state)
  
  // Emit event
  os.emitEvent({
    type: 'changelog-updated',
    from: 'changelog',
    payload: { newEntries: entries.length }
  })
  
  writeAgentMemory('changelog', {
    lastRun: new Date().toISOString(),
    entriesAdded: entries.length
  })
  
  console.log(`[changelog] Added ${entries.length} changelog entries`)
}

function transformEvents(events: Event[]): ChangelogEntry[] {
  const entries: ChangelogEntry[] = []
  
  events.forEach(event => {
    const entry = transformEvent(event)
    if (entry) {
      entries.push(entry)
    }
  })
  
  return entries
}

function transformEvent(event: Event): ChangelogEntry | null {
  // Transform technical event into user-facing changelog entry
  
  const payload = event.payload as any
  
  if (event.type === 'feature-completed') {
    return {
      id: `entry-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type: 'feature',
      title: makeUserFacing(payload.featureName || 'New feature'),
      description: makeUserFacing(payload.description || 'A new feature has been added'),
      technicalDetails: JSON.stringify(payload),
      releasedAt: event.timestamp,
      version: payload.version
    }
  }
  
  if (event.type === 'bug-fixed') {
    return {
      id: `entry-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type: 'bugfix',
      title: makeUserFacing(payload.bugDescription || 'Bug fix'),
      description: makeUserFacing(payload.resolution || 'A bug has been fixed'),
      technicalDetails: JSON.stringify(payload),
      releasedAt: event.timestamp
    }
  }
  
  if (event.type === 'performance-improvement') {
    return {
      id: `entry-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type: 'improvement',
      title: makeUserFacing(payload.improvement || 'Performance improvement'),
      description: makeUserFacing(payload.impact || 'Performance has been improved'),
      technicalDetails: JSON.stringify(payload),
      releasedAt: event.timestamp
    }
  }
  
  return null
}

function makeUserFacing(technical: string): string {
  // Transform technical language to user-facing language
  
  const transforms: Record<string, string> = {
    'redis caching': 'faster page loads',
    'implemented': 'added',
    'refactored': 'improved',
    'optimized': 'faster',
    'fixed race condition': 'improved reliability',
    'added oauth2': 'sign in with Google/GitHub',
    'migrated database': 'improved performance and reliability',
    'implemented webhook retry': 'webhooks are now more reliable',
    'added pagination': 'better performance when viewing large lists'
  }
  
  let result = technical.toLowerCase()
  
  Object.entries(transforms).forEach(([tech, user]) => {
    result = result.replace(tech, user)
  })
  
  // Capitalize first letter
  return result.charAt(0).toUpperCase() + result.slice(1)
}

function generateChangelogFile(allEntries: ChangelogEntry[], state: any): void {
  // Group by date
  const byDate: Record<string, ChangelogEntry[]> = {}
  
  allEntries.forEach(entry => {
    const date = entry.releasedAt.split('T')[0]
    if (!byDate[date]) {
      byDate[date] = []
    }
    byDate[date].push(entry)
  })
  
  // Sort dates descending
  const dates = Object.keys(byDate).sort().reverse()
  
  // Build markdown
  let markdown = `# Changelog\n\nAll notable changes to ${state.profile.companyName} will be documented in this file.\n\n`
  
  dates.forEach(date => {
    markdown += `## ${date}\n\n`
    
    const entries = byDate[date]
    
    // Group by type
    const features = entries.filter(e => e.type === 'feature')
    const bugfixes = entries.filter(e => e.type === 'bugfix')
    const improvements = entries.filter(e => e.type === 'improvement')
    const breaking = entries.filter(e => e.type === 'breaking')
    
    if (breaking.length > 0) {
      markdown += `### 💥 Breaking Changes\n\n`
      breaking.forEach(e => {
        markdown += `- ${e.title}\n`
        if (e.description) markdown += `  ${e.description}\n`
      })
      markdown += '\n'
    }
    
    if (features.length > 0) {
      markdown += `### ✨ New Features\n\n`
      features.forEach(e => {
        markdown += `- ${e.title}\n`
      })
      markdown += '\n'
    }
    
    if (improvements.length > 0) {
      markdown += `### ⚡ Improvements\n\n`
      improvements.forEach(e => {
        markdown += `- ${e.title}\n`
      })
      markdown += '\n'
    }
    
    if (bugfixes.length > 0) {
      markdown += `### 🐛 Bug Fixes\n\n`
      bugfixes.forEach(e => {
        markdown += `- ${e.title}\n`
      })
      markdown += '\n'
    }
  })
  
  // Write to workspace
  const workspaceDir = join(process.cwd(), 'workspace', 'product')
  if (!existsSync(workspaceDir)) {
    mkdirSync(workspaceDir, { recursive: true })
  }
  
  writeFileSync(join(workspaceDir, 'CHANGELOG.md'), markdown)
}
```
