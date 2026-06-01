import { CompanyOSManager } from './company-os.js'
import { CronJob } from 'cron'

// ============================================================================
// AGENT SCHEDULER SYSTEM
// ============================================================================

interface Schedule {
  agentName: string
  cronExpression: string
  enabled: boolean
  lastRun?: string
  nextRun?: string
}

interface SchedulerState {
  schedules: Schedule[]
}

/**
 * Agent scheduling system
 * Runs agents on cadence without founder triggering them
 */
export class Scheduler {
  private os: CompanyOSManager
  private jobs: Map<string, CronJob> = new Map()
  private agentRunners: Map<string, () => Promise<void>> = new Map()

  constructor(os: CompanyOSManager) {
    this.os = os
  }

  /**
   * Registers an agent to run on a schedule
   */
  schedule(agentName: string, cronExpression: string, fn: () => Promise<void>): void {
    // Store the runner function
    this.agentRunners.set(agentName, fn)

    // Create cron job
    const job = new CronJob(
      cronExpression,
      async () => {
        console.log(`[scheduler] Running ${agentName}...`)
        try {
          await fn()
          this.updateLastRun(agentName)
        } catch (error) {
          console.error(`[scheduler] Error running ${agentName}:`, error)
        }
      },
      null,
      false, // Don't start automatically
      'America/Los_Angeles' // Default timezone
    )

    this.jobs.set(agentName, job)

    // Update company.os with schedule
    this.updateScheduleInOS(agentName, cronExpression, true)

    console.log(`[scheduler] Registered ${agentName} with schedule: ${cronExpression}`)
  }

  /**
   * Boots all registered schedules
   */
  start(): void {
    console.log(`[scheduler] Starting ${this.jobs.size} scheduled agents...`)

    this.jobs.forEach((job, agentName) => {
      job.start()
      console.log(`[scheduler] Started ${agentName}`)
    })

    console.log('[scheduler] All schedules started')
  }

  /**
   * Stops a specific schedule
   */
  stop(agentName: string): void {
    const job = this.jobs.get(agentName)
    if (job) {
      job.stop()
      const cronSource = String(job.cronTime.source)
      this.updateScheduleInOS(agentName, cronSource, false)
      console.log(`[scheduler] Stopped ${agentName}`)
    }
  }

  /**
   * Stops all schedules
   */
  stopAll(): void {
    this.jobs.forEach((job, agentName) => {
      job.stop()
      console.log(`[scheduler] Stopped ${agentName}`)
    })
    console.log('[scheduler] All schedules stopped')
  }

  /**
   * Returns status of all schedules
   */
  status(): SchedulerState {
    const state = this.os.getState()
    const schedulerState = (state as any).scheduler || { schedules: [], lastRun: {}, nextRun: {} }

    // Update next run times
    this.jobs.forEach((job, agentName) => {
      const schedule = schedulerState.schedules.find((s: Schedule) => s.agentName === agentName)
      if (schedule) {
        const nextDate = job.nextDate()
        schedule.nextRun = nextDate instanceof Date ? nextDate.toISOString() : String(nextDate)
      }
    })

    return schedulerState
  }

  /**
   * Manually runs a scheduled agent immediately
   */
  async runNow(agentName: string): Promise<void> {
    const runner = this.agentRunners.get(agentName)
    if (!runner) {
      throw new Error(`Agent ${agentName} not registered in scheduler`)
    }

    console.log(`[scheduler] Running ${agentName} manually...`)
    await runner()
    this.updateLastRun(agentName)
    console.log(`[scheduler] ${agentName} completed`)
  }

  private updateScheduleInOS(agentName: string, cronExpression: string, enabled: boolean): void {
    const state = this.os.getState()

    if (!(state as any).scheduler) {
      (state as any).scheduler = {
        schedules: [],
        lastRun: {},
        nextRun: {}
      }
    }

    const schedulerState = (state as any).scheduler
    const existingIndex = schedulerState.schedules.findIndex((s: Schedule) => s.agentName === agentName)

    const nextDate = this.jobs.get(agentName)?.nextDate()
    let nextRunStr: string | undefined
    if (nextDate) {
      nextRunStr = nextDate instanceof Date ? nextDate.toISOString() : String(nextDate)
    }

    const lastRunStr = schedulerState.lastRun[agentName]

    const schedule: Schedule = {
      agentName,
      cronExpression,
      enabled,
      ...(lastRunStr && { lastRun: lastRunStr }),
      ...(nextRunStr && { nextRun: nextRunStr })
    }

    if (existingIndex >= 0) {
      schedulerState.schedules[existingIndex] = schedule
    } else {
      schedulerState.schedules.push(schedule)
    }

    this.os.save()
  }

  private updateLastRun(agentName: string): void {
    const state = this.os.getState()

    if (!(state as any).scheduler) {
      (state as any).scheduler = {
        schedules: [],
        lastRun: {},
        nextRun: {}
      }
    }

    const now = new Date().toISOString()
    ;(state as any).scheduler.lastRun[agentName] = now

    const schedule = (state as any).scheduler.schedules.find((s: Schedule) => s.agentName === agentName)
    if (schedule) {
      schedule.lastRun = now
    }

    this.os.save()
  }
}

/**
 * Registers default schedules for startup-os agents
 * Note: This requires the md-executor runtime to load .md agent files
 * In full implementation, this would use the md-executor to run agents
 */
export function registerDefaultSchedules(
  scheduler: Scheduler,
  os: CompanyOSManager,
  mdExecutor?: any
): void {
  // Default schedules are defined in each agent's frontmatter with schedule: key
  // The CLI runtime reads these and registers them automatically

  // For now, this is a placeholder that will be implemented by the CLI
  console.log('[scheduler] Scheduler initialized - schedules will be registered by CLI runtime')
}
