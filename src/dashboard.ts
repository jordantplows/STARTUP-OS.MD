import { CompanyOSManager, DepartmentState, ExecutiveState, Decision, Event } from './company-os.js'
import { stats as getAuditStats } from './audit-log.js'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

// ============================================================================
// DASHBOARD GENERATOR
// ============================================================================

/**
 * Generates the founder's company cockpit as HTML
 */
export function generate(os: CompanyOSManager): string {
  const state = os.getState()
  const auditStats = getAuditStats()

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${state.profile.companyName} — Dashboard</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
      background: #0a0a0a;
      color: #e5e5e5;
      padding: 20px;
    }
    .container { max-width: 1400px; margin: 0 auto; }
    header {
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 1px solid #333;
    }
    h1 { font-size: 32px; margin-bottom: 8px; }
    .subtitle { color: #888; font-size: 14px; }

    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 40px; }

    .card {
      background: #111;
      border: 1px solid #222;
      border-radius: 8px;
      padding: 24px;
    }
    .card h2 {
      font-size: 18px;
      margin-bottom: 16px;
      color: #fff;
    }
    .metric {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid #1a1a1a;
    }
    .metric:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
    .metric-label { color: #888; font-size: 14px; }
    .metric-value { color: #fff; font-size: 20px; font-weight: 600; }

    .status {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }
    .status.watching { background: #1a3a5a; color: #6eb4ff; }
    .status.deciding { background: #5a4a1a; color: #ffc966; }
    .status.steering { background: #3a5a1a; color: #9fff66; }
    .status.blocked { background: #5a1a1a; color: #ff6666; }

    .agent-list { list-style: none; }
    .agent-list li {
      padding: 12px 0;
      border-bottom: 1px solid #1a1a1a;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .agent-list li:last-child { border-bottom: none; }

    .activity-feed { list-style: none; }
    .activity-item {
      padding: 12px;
      margin-bottom: 8px;
      background: #0a0a0a;
      border-left: 3px solid #333;
      border-radius: 4px;
    }
    .activity-item .time { color: #666; font-size: 12px; }
    .activity-item .action { color: #fff; margin-top: 4px; }

    .decision-card {
      background: #1a1a0a;
      border-left: 3px solid #ffc966;
      padding: 16px;
      margin-bottom: 12px;
      border-radius: 4px;
    }
    .decision-card .question { color: #fff; font-weight: 600; margin-bottom: 8px; }
    .decision-card .from { color: #888; font-size: 12px; }

    .quick-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    .btn {
      padding: 12px 24px;
      background: #1a1a1a;
      border: 1px solid #333;
      border-radius: 6px;
      color: #fff;
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.2s;
    }
    .btn:hover {
      background: #222;
      border-color: #444;
    }
    .btn-primary {
      background: #0ea5e9;
      border-color: #0ea5e9;
    }
    .btn-primary:hover {
      background: #0284c7;
      border-color: #0284c7;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>${state.profile.companyName}</h1>
      <div class="subtitle">Company Operating System Dashboard</div>
    </header>

    <div class="grid">
      <!-- Company Vitals -->
      <div class="card">
        <h2>Company Vitals</h2>
        <div class="metric">
          <span class="metric-label">Stage</span>
          <span class="metric-value">${state.profile.stage}</span>
        </div>
        <div class="metric">
          <span class="metric-label">Revenue</span>
          <span class="metric-value">$${state.profile.revenue.toLocaleString()}</span>
        </div>
        <div class="metric">
          <span class="metric-label">Fundraising Goal</span>
          <span class="metric-value">${state.profile.fundraisingGoal}</span>
        </div>
        <div class="metric">
          <span class="metric-label">Founders</span>
          <span class="metric-value">${state.profile.founders.length || 0}</span>
        </div>
      </div>

      <!-- System Activity -->
      <div class="card">
        <h2>System Activity</h2>
        <div class="metric">
          <span class="metric-label">Total Actions</span>
          <span class="metric-value">${auditStats.totalActions}</span>
        </div>
        <div class="metric">
          <span class="metric-label">Tripwired Actions</span>
          <span class="metric-value">${auditStats.tripwiredActions}</span>
        </div>
        <div class="metric">
          <span class="metric-label">Founder Approved</span>
          <span class="metric-value">${auditStats.founderApprovedActions}</span>
        </div>
        <div class="metric">
          <span class="metric-label">Active Events</span>
          <span class="metric-value">${state.events.length}</span>
        </div>
      </div>

      <!-- Pending Decisions -->
      <div class="card">
        <h2>Pending Decisions</h2>
        ${state.decisions.filter((d: Decision) => !d.answer).length === 0
          ? '<p style="color: #666;">No pending decisions</p>'
          : state.decisions.filter((d: Decision) => !d.answer).slice(0, 3).map((d: Decision) => `
              <div class="decision-card">
                <div class="question">${d.question}</div>
                <div class="from">From: ${d.from}</div>
              </div>
            `).join('')
        }
      </div>
    </div>

    <!-- Agent Status -->
    <div class="card" style="margin-bottom: 40px;">
      <h2>Active Agents</h2>
      <ul class="agent-list">
        ${Object.entries(state.departments).map(([name, dept]: [string, DepartmentState]) => `
          <li>
            <div>
              <strong>${name}</strong>
              <div style="color: #666; font-size: 12px; margin-top: 4px;">${dept.currentFocus}</div>
            </div>
            <span class="status ${dept.status}">${dept.status}</span>
          </li>
        `).join('')}
        ${Object.entries(state.executives).map(([name, exec]: [string, ExecutiveState]) => `
          <li>
            <div>
              <strong>${name}</strong>
              <div style="color: #666; font-size: 12px; margin-top: 4px;">${exec.currentFocus}</div>
            </div>
            <span class="status ${exec.status}">${exec.status}</span>
          </li>
        `).join('')}
      </ul>
    </div>

    <!-- Recent Activity -->
    <div class="card" style="margin-bottom: 40px;">
      <h2>Recent Activity</h2>
      <ul class="activity-feed">
        ${state.events.slice(-10).reverse().map((event: Event) => `
          <li class="activity-item">
            <div class="time">${new Date(event.timestamp).toLocaleString()}</div>
            <div class="action"><strong>${event.from}</strong> → ${event.type}</div>
          </li>
        `).join('')}
      </ul>
    </div>

    <!-- Quick Actions -->
    <div class="card">
      <h2>Quick Actions</h2>
      <div class="quick-actions">
        <a href="#" class="btn btn-primary">Talk to CEO</a>
        <a href="#" class="btn">Run Doctor</a>
        <a href="#" class="btn">View Status</a>
        <a href="#" class="btn">Morning Brief</a>
        <a href="#" class="btn">Investor Dashboard</a>
      </div>
    </div>
  </div>
</body>
</html>`

  // Write to workspace
  const workspaceDir = join(process.cwd(), 'workspace')
  if (!existsSync(workspaceDir)) {
    mkdirSync(workspaceDir, { recursive: true })
  }

  const dashboardPath = join(workspaceDir, 'dashboard.html')
  writeFileSync(dashboardPath, html)

  console.log(`[dashboard] Generated dashboard at ${dashboardPath}`)

  return dashboardPath
}

/**
 * Opens the dashboard in the default browser
 */
export function open(os: CompanyOSManager): void {
  const dashboardPath = generate(os)

  const { exec } = require('child_process')
  const command = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open'

  exec(`${command} ${dashboardPath}`, (error: Error | null) => {
    if (error) {
      console.error('[dashboard] Error opening dashboard:', error)
    } else {
      console.log('[dashboard] Opened in browser')
    }
  })
}
