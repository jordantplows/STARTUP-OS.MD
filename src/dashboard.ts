import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'
import { CompanyOSManager } from './company-os.js'
import { getOutboundActions, stats } from './audit-log.js'
import { execSync } from 'child_process'

const WORKSPACE_DIR = join(process.cwd(), 'workspace')
const DASHBOARD_PATH = join(WORKSPACE_DIR, 'dashboard.html')

/**
 * Generates the founder dashboard HTML
 */
export function generateDashboard(os: CompanyOSManager): string {
  const state = os.getState()
  const auditStats = stats()
  const outbound = getOutboundActions({})

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${state.profile.companyName} — Founder Dashboard</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: #0a0a0a;
      color: #e0e0e0;
      padding: 20px;
      line-height: 1.6;
    }
    .container { max-width: 1400px; margin: 0 auto; }
    h1 { font-size: 24px; font-weight: 600; margin-bottom: 8px; color: #fff; }
    h2 { font-size: 18px; font-weight: 600; margin-bottom: 16px; color: #fff; border-bottom: 2px solid #333; padding-bottom: 8px; }
    .subtitle { color: #888; font-size: 14px; margin-bottom: 32px; }

    /* PMF Tracker */
    .pmf-tracker {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      border: 2px solid #0f3460;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 32px;
    }
    .pmf-hypothesis {
      font-size: 18px;
      font-weight: 500;
      margin-bottom: 16px;
      color: #4ecca3;
    }
    .confidence-bar {
      height: 32px;
      background: #1a1a2e;
      border-radius: 16px;
      overflow: hidden;
      margin-bottom: 20px;
      position: relative;
    }
    .confidence-fill {
      height: 100%;
      background: linear-gradient(90deg, #4ecca3 0%, #00d4ff 100%);
      transition: width 0.3s ease;
      display: flex;
      align-items: center;
      padding-left: 16px;
      font-weight: 600;
      font-size: 14px;
    }
    .evidence-list {
      display: grid;
      gap: 12px;
    }
    .evidence-item {
      padding: 12px;
      border-radius: 8px;
      background: rgba(255,255,255,0.05);
      border-left: 4px solid;
    }
    .evidence-item.supports { border-left-color: #4ecca3; }
    .evidence-item.contradicts { border-left-color: #ff6b6b; }
    .evidence-meta {
      font-size: 12px;
      color: #888;
      margin-bottom: 4px;
    }
    .evidence-signal {
      font-size: 14px;
      color: #e0e0e0;
    }
    .next-step {
      margin-top: 16px;
      padding: 16px;
      background: rgba(78, 204, 163, 0.1);
      border-radius: 8px;
      border: 1px solid #4ecca3;
    }
    .next-step-label {
      font-size: 12px;
      text-transform: uppercase;
      color: #4ecca3;
      font-weight: 600;
      margin-bottom: 4px;
    }

    /* Executive Row */
    .executive-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }
    .exec-card {
      background: #1a1a1a;
      border: 1px solid #333;
      border-radius: 8px;
      padding: 16px;
      transition: border-color 0.2s;
    }
    .exec-card:hover {
      border-color: #4ecca3;
    }
    .exec-name {
      font-size: 16px;
      font-weight: 600;
      text-transform: uppercase;
      color: #4ecca3;
      margin-bottom: 8px;
    }
    .exec-status {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 600;
      margin-bottom: 8px;
    }
    .exec-status.watching { background: #0f3460; color: #4ecca3; }
    .exec-status.deciding { background: #533483; color: #a594f9; }
    .exec-status.steering { background: #00d4ff; color: #0a0a0a; }
    .exec-status.blocked { background: #ff6b6b; color: #fff; }
    .exec-focus {
      font-size: 13px;
      color: #bbb;
      margin-bottom: 4px;
    }
    .exec-action {
      font-size: 12px;
      color: #888;
    }

    /* Outbound Activity */
    .outbound-section {
      background: #1a1a1a;
      border: 1px solid #333;
      border-radius: 8px;
      padding: 24px;
      margin-bottom: 32px;
    }
    .outbound-filters {
      display: flex;
      gap: 12px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }
    .filter-btn {
      padding: 8px 16px;
      background: #0a0a0a;
      border: 1px solid #333;
      border-radius: 6px;
      color: #e0e0e0;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .filter-btn:hover {
      border-color: #4ecca3;
      background: rgba(78, 204, 163, 0.1);
    }
    .filter-btn.active {
      background: #4ecca3;
      color: #0a0a0a;
      border-color: #4ecca3;
    }
    .outbound-list {
      display: grid;
      gap: 12px;
    }
    .outbound-item {
      padding: 16px;
      background: rgba(255,255,255,0.03);
      border-radius: 8px;
      border-left: 4px solid;
    }
    .outbound-item.email { border-left-color: #00d4ff; }
    .outbound-item.slack { border-left-color: #4ecca3; }
    .outbound-item.social { border-left-color: #a594f9; }
    .outbound-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .outbound-meta {
      font-size: 12px;
      color: #888;
    }
    .outbound-status {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
    }
    .outbound-status.sent { background: #4ecca3; color: #0a0a0a; }
    .outbound-status.pending-approval { background: #ff6b6b; color: #fff; }
    .outbound-status.failed { background: #333; color: #888; }
    .outbound-preview {
      font-size: 13px;
      color: #bbb;
      margin-top: 8px;
      font-style: italic;
    }

    /* Department Grid */
    .department-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }
    .dept-card {
      background: #1a1a1a;
      border: 1px solid #333;
      border-radius: 8px;
      padding: 16px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .dept-card:hover {
      border-color: #4ecca3;
      transform: translateY(-2px);
    }
    .dept-name {
      font-size: 14px;
      font-weight: 600;
      color: #e0e0e0;
      margin-bottom: 8px;
    }

    /* Pending Decisions */
    .decisions-section {
      background: #1a1a1a;
      border: 1px solid #333;
      border-radius: 8px;
      padding: 24px;
      margin-bottom: 32px;
    }
    .decision-item {
      padding: 16px;
      background: rgba(255, 107, 107, 0.1);
      border-left: 4px solid #ff6b6b;
      border-radius: 8px;
      margin-bottom: 12px;
    }
    .decision-question {
      font-size: 15px;
      font-weight: 500;
      color: #e0e0e0;
      margin-bottom: 8px;
    }
    .decision-from {
      font-size: 12px;
      color: #888;
      margin-bottom: 4px;
    }
    .decision-blocking {
      font-size: 12px;
      color: #ff6b6b;
    }

    /* Executive Sync */
    .exec-sync {
      background: #1a1a1a;
      border: 1px solid #333;
      border-radius: 8px;
      padding: 24px;
      margin-bottom: 32px;
    }
    .conflict-item {
      padding: 16px;
      background: rgba(255, 107, 107, 0.1);
      border-left: 4px solid #ff6b6b;
      border-radius: 8px;
      margin-bottom: 12px;
    }
    .synergy-item {
      padding: 16px;
      background: rgba(78, 204, 163, 0.1);
      border-left: 4px solid #4ecca3;
      border-radius: 8px;
      margin-bottom: 12px;
    }

    .empty-state {
      text-align: center;
      color: #666;
      padding: 40px;
      font-size: 14px;
    }

    .refresh-indicator {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #4ecca3;
      color: #0a0a0a;
      padding: 12px 20px;
      border-radius: 24px;
      font-size: 13px;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(78, 204, 163, 0.3);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>${state.profile.companyName}</h1>
    <p class="subtitle">Founder Dashboard · Last updated: ${new Date().toLocaleString()}</p>

    <!-- PMF Tracker -->
    <div class="pmf-tracker">
      <h2>Product-Market Fit Tracker</h2>
      <div class="pmf-hypothesis">${state.pmf.hypothesis}</div>
      <div class="confidence-bar">
        <div class="confidence-fill" style="width: ${state.pmf.confidence}%">
          ${state.pmf.confidence}% confidence
        </div>
      </div>
      <div class="evidence-list">
        ${state.pmf.evidence.slice(-5).reverse().map(e => `
          <div class="evidence-item ${e.direction}">
            <div class="evidence-meta">${e.source} · ${new Date(e.timestamp).toLocaleDateString()}</div>
            <div class="evidence-signal">${e.signal}</div>
          </div>
        `).join('')}
        ${state.pmf.evidence.length === 0 ? '<div class="empty-state">No PMF evidence yet</div>' : ''}
      </div>
      <div class="next-step">
        <div class="next-step-label">Next Validation Step</div>
        <div>${state.pmf.nextValidationStep}</div>
      </div>
    </div>

    <!-- Executive Row -->
    <h2>Executive Team</h2>
    <div class="executive-row">
      ${['ceo', 'cfo', 'cto', 'cmo', 'cpo', 'coo'].map(exec => {
        const execState = state.executives[exec]
        if (!execState) return `
          <div class="exec-card">
            <div class="exec-name">${exec.toUpperCase()}</div>
            <div class="exec-status watching">Initializing</div>
            <div class="exec-focus">Not yet active</div>
          </div>
        `
        return `
          <div class="exec-card">
            <div class="exec-name">${exec.toUpperCase()}</div>
            <div class="exec-status ${execState.status}">${execState.status}</div>
            <div class="exec-focus">${execState.currentFocus}</div>
            ${execState.lastAction ? `
              <div class="exec-action">Last: ${execState.lastAction.description}</div>
            ` : ''}
          </div>
        `
      }).join('')}
    </div>

    <!-- Executive Sync -->
    ${state.executiveSync ? `
      <div class="exec-sync">
        <h2>Executive Coordination</h2>
        ${state.executiveSync.conflicts.length > 0 ? `
          <h3 style="font-size: 14px; color: #ff6b6b; margin-bottom: 12px;">Conflicts</h3>
          ${state.executiveSync.conflicts.map(c => `
            <div class="conflict-item">
              <strong>${c.between.join(' vs ')}</strong>
              <div style="margin-top: 4px; font-size: 13px;">${c.issue}</div>
              <div style="margin-top: 4px; font-size: 12px; color: #888;">Resolution: ${c.resolution}</div>
            </div>
          `).join('')}
        ` : ''}
        ${state.executiveSync.synergies.length > 0 ? `
          <h3 style="font-size: 14px; color: #4ecca3; margin-bottom: 12px; margin-top: 20px;">Synergies</h3>
          ${state.executiveSync.synergies.map(s => `
            <div class="synergy-item">
              <strong>${s.between.join(' + ')}</strong>
              <div style="margin-top: 4px; font-size: 13px;">${s.insight}</div>
            </div>
          `).join('')}
        ` : ''}
        <div style="margin-top: 20px; padding: 12px; background: rgba(78, 204, 163, 0.1); border-radius: 6px;">
          <strong style="font-size: 13px; color: #4ecca3;">PMF Signal:</strong>
          <span style="font-size: 13px; color: #e0e0e0; margin-left: 8px;">${state.executiveSync.pmfSignal}</span>
        </div>
      </div>
    ` : ''}

    <!-- Outbound Activity -->
    <div class="outbound-section">
      <h2>Outbound Activity</h2>
      <div class="outbound-filters">
        <button class="filter-btn active" onclick="filterOutbound('all')">All</button>
        <button class="filter-btn" onclick="filterOutbound('email')">Email</button>
        <button class="filter-btn" onclick="filterOutbound('slack')">Slack</button>
        <button class="filter-btn" onclick="filterOutbound('social')">Social</button>
      </div>
      <div class="outbound-list">
        ${outbound.slice(-20).reverse().map(entry => {
          if (!entry.outbound) return ''
          const ob = entry.outbound
          return `
            <div class="outbound-item ${ob.channel}" data-channel="${ob.channel}">
              <div class="outbound-header">
                <div class="outbound-meta">
                  <strong>${entry.agent}</strong> · ${ob.channel}
                  ${ob.recipient ? ` → ${ob.recipient}` : ''}
                  · ${new Date(entry.timestamp).toLocaleString()}
                </div>
                <span class="outbound-status ${ob.status}">${ob.status.replace('-', ' ')}</span>
              </div>
              <div class="outbound-preview">"${ob.contentPreview}"</div>
            </div>
          `
        }).join('')}
        ${outbound.length === 0 ? '<div class="empty-state">No outbound activity yet</div>' : ''}
      </div>
    </div>

    <!-- Pending Decisions -->
    <div class="decisions-section">
      <h2>Pending Decisions</h2>
      ${state.decisions.filter(d => !d.answer).map(d => `
        <div class="decision-item">
          <div class="decision-question">${d.question}</div>
          <div class="decision-from">From: ${d.from}</div>
          ${d.blocking.length > 0 ? `
            <div class="decision-blocking">Blocking: ${d.blocking.join(', ')}</div>
          ` : ''}
        </div>
      `).join('')}
      ${state.decisions.filter(d => !d.answer).length === 0 ? '<div class="empty-state">No pending decisions</div>' : ''}
    </div>

    <!-- Department Grid -->
    <h2>All Departments</h2>
    <div class="department-grid">
      ${Object.entries(state.departments).map(([name, dept]) => `
        <div class="dept-card">
          <div class="dept-name">${name}</div>
          <div class="exec-status ${dept.status}">${dept.status}</div>
          <div class="exec-focus">${dept.currentFocus}</div>
        </div>
      `).join('')}
    </div>

    <div class="refresh-indicator">
      ⚡ Auto-refreshes on state changes
    </div>
  </div>

  <script>
    function filterOutbound(channel) {
      const items = document.querySelectorAll('.outbound-item');
      const buttons = document.querySelectorAll('.filter-btn');

      buttons.forEach(btn => btn.classList.remove('active'));
      event.target.classList.add('active');

      items.forEach(item => {
        if (channel === 'all' || item.dataset.channel === channel) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    }

    // Auto-refresh every 30 seconds
    setTimeout(() => {
      window.location.reload();
    }, 30000);
  </script>
</body>
</html>`

  return html
}

/**
 * Writes the dashboard to disk
 */
export function writeDashboard(os: CompanyOSManager): void {
  if (!existsSync(WORKSPACE_DIR)) {
    mkdirSync(WORKSPACE_DIR, { recursive: true })
  }

  const html = generateDashboard(os)
  writeFileSync(DASHBOARD_PATH, html, 'utf-8')
}

/**
 * Opens the dashboard in the default browser
 */
export function openDashboard(): void {
  const platform = process.platform
  try {
    if (platform === 'darwin') {
      execSync(`open "${DASHBOARD_PATH}"`)
    } else if (platform === 'linux') {
      execSync(`xdg-open "${DASHBOARD_PATH}"`)
    } else if (platform === 'win32') {
      execSync(`start "${DASHBOARD_PATH}"`)
    }
  } catch (error) {
    console.log(`\nDashboard generated at: ${DASHBOARD_PATH}`)
    console.log('Open it manually in your browser.')
  }
}
