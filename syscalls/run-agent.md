---
name: run-agent
description: Executes a single .md agent file via the Anthropic API
syscall: true
---

## What this syscall does

The core execution primitive. Takes a .md agent file path,
reads its content, gathers context via pipe-context, calls the
Anthropic API, and returns the output string.
This is the `exec()` of startup-os.

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import { readFileSync } from 'fs'
import { join } from 'path'
import { readProfile } from './read-profile.js'
import { pipeContext } from './pipe-context.js'

export async function runAgent(
  client: Anthropic,
  workspaceRoot: string,
  agentPath: string
): Promise<string> {
  const content = readFileSync(agentPath, 'utf-8')
  const profile = readProfile(workspaceRoot)

  // Extract reads: from frontmatter
  const readsMatch = content.match(/reads:\n((?:\s+- .+\n)+)/)
  const reads = readsMatch?.[1]
    .split('\n')
    .filter(l => l.trim().startsWith('- '))
    .map(l => l.trim().replace('- ', '')) ?? []

  const context = pipeContext(workspaceRoot, reads)

  const response = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 8096,
    system: `You are executing a startup-os agent.
Read the agent file, follow its instructions exactly,
and return only the markdown content for the output file.`,
    messages: [{
      role: 'user',
      content: `STARTUP PROFILE:\n${JSON.stringify(profile, null, 2)}

AGENT:\n${content}

UPSTREAM CONTEXT:\n${context}

Execute this agent. Return only the output file content.`
    }]
  })

  const block = response.content[0]
  if (block?.type !== 'text') throw new Error('Unexpected response type')
  return block.text
}
```
