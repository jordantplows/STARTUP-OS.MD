---
name: emit-event
description: Fires lifecycle events that hooks can listen to
syscall: true
---

## What this syscall does

Emits structured events during OS execution:
- agent:start
- agent:complete
- agent:fail
- dept:complete
- build:complete

External hooks in `.claude/` can subscribe to these events
for notifications, logging, CI/CD triggers, etc.

## TypeScript

```typescript
import { EventEmitter } from 'events'

export interface OSEvent {
  type: 'agent:start' | 'agent:complete' | 'agent:fail' | 'dept:complete' | 'build:complete'
  timestamp: string
  dept?: string
  agent?: string
  error?: string
  duration?: number
}

export const osEvents = new EventEmitter()

export function emitEvent(event: OSEvent): void {
  osEvents.emit(event.type, event)
  osEvents.emit('*', event)
  
  // Log to console for now
  const prefix = event.type === 'agent:complete' ? '✓' :
                 event.type === 'agent:fail' ? '✗' : '·'
  
  if (event.dept && event.agent) {
    console.log(`${prefix} ${event.dept}/${event.agent}`)
  }
}
```
