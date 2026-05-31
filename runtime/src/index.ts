/**
 * startup-os — AI company operating system
 *
 * This is the runtime entry point for programmatic usage.
 * For CLI usage, use dist/cli.js directly.
 */

export const version = '0.1.3'

export const layers = {
  apps: 'User-land applications (git submodules)',
  stdlib: 'Standard library (12 department agents)',
  syscalls: 'OS primitives (read, write, exec, pipe)',
  kernel: 'Scheduler, state, consistency, errors',
  runtime: 'Boot process (CLI)',
  hardware: 'Anthropic API, filesystem, CLAUDE.md'
}

/**
 * Programmatic API (not yet implemented)
 *
 * Future usage:
 * ```typescript
 * import { build, run, status } from 'startup-os'
 *
 * await build({ idea: 'AI contract review for law firms' })
 * await run({ dept: 'finance', agent: 'model' })
 * const state = await status()
 * ```
 */

export async function build(options: { idea: string }) {
  throw new Error('Programmatic API not yet implemented. Use CLI: startup-os build "<idea>"')
}

export async function run(options: { dept: string, agent?: string }) {
  throw new Error('Programmatic API not yet implemented. Use CLI: startup-os run <dept> [agent]')
}

export async function status() {
  throw new Error('Programmatic API not yet implemented. Use CLI: startup-os status')
}
