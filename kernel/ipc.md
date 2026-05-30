---
name: ipc
description: Inter-process communication — how agents pass data to each other
---

## What IPC does

Inter-process communication for startup-os. Manages named channels
where agents can publish and subscribe to data streams.

Reads output files from `stdlib/*/output/` and makes them available
as named channels. Any agent can subscribe to any channel.
The equivalent of Unix pipes but for agent context.

## TypeScript

```typescript
import { readFileSync, existsSync, watchFile } from 'fs'
import { join } from 'path'
import { EventEmitter } from 'events'

export class IPCBus extends EventEmitter {
  private workspaceRoot: string
  private channels: Map<string, string> = new Map()

  constructor(workspaceRoot: string) {
    super()
    this.workspaceRoot = workspaceRoot
  }

  // Publish data to a named channel
  publish(channel: string, data: string): void {
    this.channels.set(channel, data)
    this.emit('channel:update', { channel, data })
  }

  // Subscribe to a named channel
  subscribe(channel: string, callback: (data: string) => void): void {
    this.on('channel:update', (event) => {
      if (event.channel === channel) {
        callback(event.data)
      }
    })

    // Send current data immediately if available
    const current = this.channels.get(channel)
    if (current) callback(current)
  }

  // Read from an output file and publish to a channel
  readAndPublish(relativePath: string): void {
    const fullPath = join(this.workspaceRoot, relativePath)
    if (existsSync(fullPath)) {
      const content = readFileSync(fullPath, 'utf-8')
      const channel = relativePath.replace(/\//g, ':')
      this.publish(channel, content)
    }
  }

  // Watch an output file and auto-publish on changes
  watch(relativePath: string): void {
    const fullPath = join(this.workspaceRoot, relativePath)
    watchFile(fullPath, () => {
      this.readAndPublish(relativePath)
    })
  }

  // Get all available channels
  listChannels(): string[] {
    return Array.from(this.channels.keys())
  }
}
```
