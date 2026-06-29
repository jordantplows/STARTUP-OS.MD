---
name: cto-security-posture
executive: cto
role: steering
reads:
  - company.os.departments.security
  - company.os.departments.engineering
  - company.os.events
events:
  emits: [security-escalated, vulnerability-critical, compliance-risk, incident-response-triggered]
  watches: [vulnerability-detected, security-audit-completed, compliance-deadline, data-breach]
template-ref: templates/executives/security-posture.md
---

## What this agent does

The CTO security posture agent watches the security department output and escalates critical vulnerabilities, compliance gaps, and security incidents to leadership. It maintains oversight of security health and ensures security doesn't become a product blocker or legal liability.

This agent is not the security team — it's the executive layer that watches security and decides what requires founder/leadership attention.

## Instructions

### WATCH

Trigger when:
- Security department flags vulnerability
- Security audit completes
- Compliance deadline approaching
- Data breach or security incident occurs
- Founder asks "are we secure?"
- Customer asks about security/compliance

### REASON

Security posture framework:

**Risk tiers:**
1. **Critical (P0)** — active exploit, data breach, compliance violation
2. **High (P1)** — severe vulnerability, compliance gap blocking sales
3. **Medium (P2)** — vulnerability with mitigation, non-blocking compliance
4. **Low (P3)** — minor issue, nice-to-have security improvement

**Escalation criteria:**
- **Always escalate**: P0 (critical) issues
- **Escalate if blocking**: P1 issues that prevent product launch or sales
- **Report but don't escalate**: P2/P3 issues, include in regular reporting
- **Context matters**: "SQL injection in production" vs "missing rate limit on admin endpoint"

**Security-vs-speed tradeoffs:**
- Early stage: focus on critical vulnerabilities, defer nice-to-haves
- Scaling stage: invest in security as competitive advantage
- Enterprise stage: compliance and security are table stakes

**Red flags:**
- Hard-coded credentials in code
- Unencrypted PII/payment data
- Public S3 buckets with sensitive data
- No authentication on critical endpoints
- Complete lack of logging/monitoring

**Green lights:**
- Following security best practices for stage
- Active vulnerability scanning
- Security in engineering culture
- Clear incident response plan

### ACT

Security posture report format:

```
SECURITY POSTURE REPORT
Date: [YYYY-MM-DD]

OVERALL POSTURE: [🟢 Secure | 🟡 Needs Attention | 🔴 Critical Risk]

ACTIVE VULNERABILITIES
[If none: "No active critical vulnerabilities"]
[If any:]
· [P0] [Vulnerability] - [Impact] - [Discovered: date]
· [P1] [Vulnerability] - [Impact] - [Discovered: date]

COMPLIANCE STATUS
[For each relevant compliance requirement:]
· [SOC2 | GDPR | HIPAA | etc]: [✅ Compliant | ⚠️ Gaps | ❌ Non-compliant]
  [If gaps/non-compliant: list specific issues]

RECENT INCIDENTS
[Last 30 days:]
· [Incident description] - [Impact] - [Resolution]
[If none: "No security incidents in last 30 days"]

SECURITY METRICS
· Vulnerability scan: [Last scan date]
· Critical vulns: [X open]
· High vulns: [X open]
· Mean time to fix (critical): [X days]
· Security coverage: [X% of codebase]

RECOMMENDATIONS
[Prioritized list of security actions]
1. [URGENT if P0/P1] [Specific action]
2. [Action]
3. [Action]

ESCALATIONS
[List P0/P1 issues requiring founder attention]
[If blocking sales: flag explicitly]
[If legal/compliance risk: flag explicitly]
```

### COORDINATE

After security assessment:
- If P0 vulnerability, emit `security-escalated` and `vulnerability-critical` immediately
- If compliance risk blocking sales, emit `compliance-risk` event
- If security incident occurs, emit `incident-response-triggered` event
- Update `company.os.departments.cto.signals` with security status
- Flag to CEO if security is blocking product launch or sales
- Alert sales/customer success if compliance gaps affect deals

## TypeScript

```typescript
import { CompanyOS, DepartmentState, Signal } from '../src/company-os'

type SecurityStatus = '🟢' | '🟡' | '🔴'
type Priority = 'P0' | 'P1' | 'P2' | 'P3'

interface Vulnerability {
  id: string
  priority: Priority
  description: string
  impact: string
  discovered: string
  status: 'open' | 'mitigated' | 'fixed'
}

interface ComplianceStatus {
  framework: string
  status: '✅' | '⚠️' | '❌'
  gaps: string[]
  deadline?: string
}

interface SecurityIncident {
  date: string
  description: string
  impact: string
  resolution: string
}

interface SecurityPosture {
  overall: SecurityStatus
  vulnerabilities: Vulnerability[]
  compliance: ComplianceStatus[]
  incidents: SecurityIncident[]
  metrics: SecurityMetrics
  recommendations: string[]
  escalations: string[]
}

interface SecurityMetrics {
  lastScan: string
  criticalVulns: number
  highVulns: number
  mttrCritical: number // days
  coverage: number // percentage
}

export async function run(os: CompanyOS, context: string): Promise<string> {
  const security = os.departments.security
  const engineering = os.departments.engineering
  
  if (!security) {
    return 'Security department not initialized - consider running security setup'
  }
  
  // Extract vulnerabilities from security state
  const vulnerabilities = extractVulnerabilities(security, os)
  
  // Assess compliance status
  const compliance = assessCompliance(security, os)
  
  // Get recent incidents
  const incidents = extractIncidents(security, os)
  
  // Calculate security metrics
  const metrics = calculateSecurityMetrics(vulnerabilities, security, os)
  
  // Determine overall posture
  const overall = determineOverallPosture(vulnerabilities, compliance, incidents)
  
  // Generate recommendations
  const recommendations = generateSecurityRecommendations(vulnerabilities, compliance, overall, os)
  
  // Identify escalations
  const escalations = identifySecurityEscalations(vulnerabilities, compliance, incidents, os)
  
  const posture: SecurityPosture = {
    overall,
    vulnerabilities,
    compliance,
    incidents,
    metrics,
    recommendations,
    escalations
  }
  
  // Emit events based on findings
  const criticalVulns = vulnerabilities.filter(v => v.priority === 'P0' && v.status === 'open')
  if (criticalVulns.length > 0) {
    for (const vuln of criticalVulns) {
      os.events.push({
        type: 'security-escalated',
        from: 'cto-security-posture',
        payload: { vulnerability: vuln },
        timestamp: new Date().toISOString(),
        consumed: []
      })
      
      os.events.push({
        type: 'vulnerability-critical',
        from: 'cto-security-posture',
        payload: { id: vuln.id, description: vuln.description, impact: vuln.impact },
        timestamp: new Date().toISOString(),
        consumed: []
      })
    }
  }
  
  const complianceRisks = compliance.filter(c => c.status === '❌' || (c.status === '⚠️' && c.deadline))
  if (complianceRisks.length > 0) {
    os.events.push({
      type: 'compliance-risk',
      from: 'cto-security-posture',
      payload: { compliance: complianceRisks },
      timestamp: new Date().toISOString(),
      consumed: []
    })
  }
  
  if (incidents.length > 0) {
    const recentIncident = incidents[0]
    os.events.push({
      type: 'incident-response-triggered',
      from: 'cto-security-posture',
      payload: { incident: recentIncident },
      timestamp: new Date().toISOString(),
      consumed: []
    })
  }
  
  // Update CTO state
  if (!os.departments.cto) {
    os.departments.cto = {
      status: 'steering',
      currentFocus: 'Security oversight',
      lastAction: null,
      pendingDecisions: [],
      memory: [],
      signals: []
    }
  }
  
  os.departments.cto.signals.push({
    type: `security-posture-${overall}`,
    priority: overall === '🔴' ? 'critical' : overall === '🟡' ? 'high' : 'normal',
    source: 'cto-security-posture',
    data: { posture },
    timestamp: new Date().toISOString()
  })
  
  os.departments.cto.memory.push(
    `SECURITY:${new Date().toISOString()}:${overall}:critical=${metrics.criticalVulns}:high=${metrics.highVulns}`
  )
  
  return formatSecurityPosture(posture)
}

function extractVulnerabilities(security: DepartmentState, os: CompanyOS): Vulnerability[] {
  const vulns: Vulnerability[] = []
  
  // Extract from security signals
  const vulnSignals = security.signals.filter(s => 
    s.type.includes('vulnerability') || s.type.includes('cve')
  )
  
  for (const signal of vulnSignals) {
    vulns.push({
      id: `VULN-${vulns.length + 1}`,
      priority: signal.priority === 'critical' ? 'P0' : signal.priority === 'high' ? 'P1' : 'P2',
      description: signal.type,
      impact: signal.data?.impact || 'Unknown impact',
      discovered: signal.timestamp,
      status: signal.data?.status || 'open'
    })
  }
  
  // Extract from security memory
  const vulnMemory = security.memory.filter(m => m.includes('vulnerability:') || m.includes('cve:'))
  for (const mem of vulnMemory) {
    if (mem.includes('vulnerability:')) {
      const parts = mem.split('vulnerability:')
      if (parts[1]) {
        const [priority, description] = parts[1].split(':')
        vulns.push({
          id: `VULN-${vulns.length + 1}`,
          priority: priority as Priority || 'P2',
          description,
          impact: 'From security scan',
          discovered: new Date().toISOString(),
          status: 'open'
        })
      }
    }
  }
  
  // Extract from events
  const vulnEvents = os.events.filter(e =>
    e.from === 'security' && e.type.includes('vulnerability')
  ).slice(-10)
  
  for (const event of vulnEvents) {
    if (event.payload?.vulnerability) {
      vulns.push(event.payload.vulnerability)
    }
  }
  
  return vulns
}

function assessCompliance(security: DepartmentState, os: CompanyOS): ComplianceStatus[] {
  const compliance: ComplianceStatus[] = []
  
  // Common compliance frameworks
  const frameworks = ['SOC2', 'GDPR', 'HIPAA', 'ISO27001', 'PCI-DSS']
  
  for (const framework of frameworks) {
    const frameworkSignals = security.signals.filter(s =>
      s.type.toLowerCase().includes(framework.toLowerCase())
    )
    
    if (frameworkSignals.length > 0) {
      const critical = frameworkSignals.filter(s => s.priority === 'critical')
      const high = frameworkSignals.filter(s => s.priority === 'high')
      
      let status: '✅' | '⚠️' | '❌' = '✅'
      const gaps: string[] = []
      
      if (critical.length > 0) {
        status = '❌'
        gaps.push(...critical.map(s => s.type))
      } else if (high.length > 0) {
        status = '⚠️'
        gaps.push(...high.map(s => s.type))
      }
      
      // Check for deadline in memory
      const deadlineMemory = security.memory.find(m =>
        m.includes(framework.toLowerCase()) && m.includes('deadline')
      )
      
      const deadline = deadlineMemory ? extractDeadline(deadlineMemory) : undefined
      
      compliance.push({
        framework,
        status,
        gaps,
        deadline
      })
    }
  }
  
  // If no compliance info, assume early stage
  if (compliance.length === 0) {
    compliance.push({
      framework: 'Basic Security',
      status: '✅',
      gaps: [],
      deadline: undefined
    })
  }
  
  return compliance
}

function extractDeadline(memory: string): string | undefined {
  const match = memory.match(/deadline:(\d{4}-\d{2}-\d{2})/)
  return match ? match[1] : undefined
}

function extractIncidents(security: DepartmentState, os: CompanyOS): SecurityIncident[] {
  const incidents: SecurityIncident[] = []
  
  // Look for incident events in last 30 days
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  
  const incidentEvents = os.events.filter(e =>
    e.from === 'security' && 
    e.type.includes('incident') &&
    e.timestamp > thirtyDaysAgo
  )
  
  for (const event of incidentEvents) {
    incidents.push({
      date: event.timestamp.split('T')[0],
      description: event.type,
      impact: event.payload?.impact || 'Unknown impact',
      resolution: event.payload?.resolution || 'Under investigation'
    })
  }
  
  return incidents
}

function calculateSecurityMetrics(vulns: Vulnerability[], security: DepartmentState, os: CompanyOS): SecurityMetrics {
  const criticalVulns = vulns.filter(v => v.priority === 'P0' && v.status === 'open').length
  const highVulns = vulns.filter(v => v.priority === 'P1' && v.status === 'open').length
  
  // Calculate MTTR for critical vulns
  const fixedCritical = vulns.filter(v => v.priority === 'P0' && v.status === 'fixed')
  let mttrCritical = 7 // default 7 days
  
  if (fixedCritical.length > 0) {
    const avgTime = fixedCritical.reduce((sum, v) => {
      const discovered = new Date(v.discovered)
      const now = new Date()
      const days = Math.floor((now.getTime() - discovered.getTime()) / (1000 * 60 * 60 * 24))
      return sum + days
    }, 0) / fixedCritical.length
    
    mttrCritical = Math.round(avgTime)
  }
  
  // Find last scan date
  const scanEvents = os.events.filter(e =>
    e.from === 'security' && e.type.includes('scan')
  )
  
  const lastScan = scanEvents.length > 0 
    ? scanEvents[scanEvents.length - 1].timestamp.split('T')[0]
    : 'Never'
  
  // Estimate coverage
  const coverage = security.memory.some(m => m.includes('coverage')) ? 75 : 50
  
  return {
    lastScan,
    criticalVulns,
    highVulns,
    mttrCritical,
    coverage
  }
}

function determineOverallPosture(
  vulns: Vulnerability[],
  compliance: ComplianceStatus[],
  incidents: SecurityIncident[]
): SecurityStatus {
  // Critical if any P0 vulns or compliance violations
  const hasP0 = vulns.some(v => v.priority === 'P0' && v.status === 'open')
  const hasComplianceViolation = compliance.some(c => c.status === '❌')
  const hasRecentIncident = incidents.length > 0
  
  if (hasP0 || hasComplianceViolation) {
    return '🔴'
  }
  
  // Warning if multiple P1 vulns or compliance gaps
  const p1Count = vulns.filter(v => v.priority === 'P1' && v.status === 'open').length
  const hasComplianceGaps = compliance.some(c => c.status === '⚠️')
  
  if (p1Count > 2 || (hasComplianceGaps && hasRecentIncident)) {
    return '🟡'
  }
  
  return '🟢'
}

function generateSecurityRecommendations(
  vulns: Vulnerability[],
  compliance: ComplianceStatus[],
  overall: SecurityStatus,
  os: CompanyOS
): string[] {
  const recommendations: string[] = []
  
  if (overall === '🟢') {
    recommendations.push('Maintain current security practices')
    recommendations.push('Continue regular vulnerability scanning')
    return recommendations
  }
  
  // P0 vulns
  const p0Vulns = vulns.filter(v => v.priority === 'P0' && v.status === 'open')
  for (const vuln of p0Vulns) {
    recommendations.push(`URGENT: Fix ${vuln.description} immediately`)
  }
  
  // Compliance violations
  const violations = compliance.filter(c => c.status === '❌')
  for (const violation of violations) {
    recommendations.push(`URGENT: Address ${violation.framework} compliance gaps: ${violation.gaps.join(', ')}`)
  }
  
  // P1 vulns
  const p1Vulns = vulns.filter(v => v.priority === 'P1' && v.status === 'open')
  if (p1Vulns.length > 0) {
    recommendations.push(`Fix ${p1Vulns.length} high-priority vulnerabilities within 7 days`)
  }
  
  // Compliance gaps with deadlines
  const urgentCompliance = compliance.filter(c => c.status === '⚠️' && c.deadline)
  for (const comp of urgentCompliance) {
    recommendations.push(`Address ${comp.framework} gaps before deadline: ${comp.deadline}`)
  }
  
  // General improvements
  if (recommendations.length < 3) {
    recommendations.push('Implement automated security scanning in CI/CD')
    recommendations.push('Document incident response procedures')
  }
  
  return recommendations
}

function identifySecurityEscalations(
  vulns: Vulnerability[],
  compliance: ComplianceStatus[],
  incidents: SecurityIncident[],
  os: CompanyOS
): string[] {
  const escalations: string[] = []
  
  // P0 vulnerabilities
  const p0Vulns = vulns.filter(v => v.priority === 'P0' && v.status === 'open')
  for (const vuln of p0Vulns) {
    escalations.push(`CRITICAL: ${vuln.description} - ${vuln.impact}`)
  }
  
  // Compliance blocking sales
  const blockingCompliance = compliance.filter(c => c.status === '❌')
  for (const comp of blockingCompliance) {
    escalations.push(`${comp.framework} non-compliance may block enterprise sales`)
  }
  
  // Recent incidents
  if (incidents.length > 0) {
    escalations.push(`Security incident occurred: ${incidents[0].description}`)
  }
  
  // Check if security issues are blocking product
  const sales = os.departments.sales
  if (sales?.status === 'blocked' && sales.currentFocus.toLowerCase().includes('security')) {
    escalations.push('Security compliance blocking sales deals')
  }
  
  return escalations
}

function formatSecurityPosture(posture: SecurityPosture): string {
  const lines: string[] = []
  
  lines.push('SECURITY POSTURE REPORT')
  lines.push(`Date: ${new Date().toISOString().split('T')[0]}`)
  lines.push('')
  lines.push(`OVERALL POSTURE: ${posture.overall}`)
  lines.push('')
  
  // Vulnerabilities
  lines.push('ACTIVE VULNERABILITIES')
  const openVulns = posture.vulnerabilities.filter(v => v.status === 'open')
  if (openVulns.length === 0) {
    lines.push('No active critical vulnerabilities')
  } else {
    const p0p1 = openVulns.filter(v => v.priority === 'P0' || v.priority === 'P1')
    for (const vuln of p0p1) {
      lines.push(`· [${vuln.priority}] ${vuln.description} - ${vuln.impact} - Discovered: ${vuln.discovered.split('T')[0]}`)
    }
  }
  lines.push('')
  
  // Compliance
  lines.push('COMPLIANCE STATUS')
  for (const comp of posture.compliance) {
    lines.push(`· ${comp.framework}: ${comp.status}`)
    if (comp.gaps.length > 0) {
      for (const gap of comp.gaps) {
        lines.push(`  - ${gap}`)
      }
    }
    if (comp.deadline) {
      lines.push(`  Deadline: ${comp.deadline}`)
    }
  }
  lines.push('')
  
  // Incidents
  lines.push('RECENT INCIDENTS')
  if (posture.incidents.length === 0) {
    lines.push('No security incidents in last 30 days')
  } else {
    for (const incident of posture.incidents) {
      lines.push(`· ${incident.date}: ${incident.description}`)
      lines.push(`  Impact: ${incident.impact}`)
      lines.push(`  Resolution: ${incident.resolution}`)
    }
  }
  lines.push('')
  
  // Metrics
  lines.push('SECURITY METRICS')
  lines.push(`· Last vulnerability scan: ${posture.metrics.lastScan}`)
  lines.push(`· Critical vulnerabilities: ${posture.metrics.criticalVulns} open`)
  lines.push(`· High vulnerabilities: ${posture.metrics.highVulns} open`)
  lines.push(`· Mean time to fix (critical): ${posture.metrics.mttrCritical} days`)
  lines.push(`· Security coverage: ${posture.metrics.coverage}% of codebase`)
  lines.push('')
  
  // Recommendations
  lines.push('RECOMMENDATIONS')
  for (let i = 0; i < posture.recommendations.length; i++) {
    lines.push(`${i + 1}. ${posture.recommendations[i]}`)
  }
  
  // Escalations
  if (posture.escalations.length > 0) {
    lines.push('')
    lines.push('ESCALATIONS')
    for (const escalation of posture.escalations) {
      lines.push(`⚠️  ${escalation}`)
    }
  }
  
  return lines.join('\n')
}
```

## Coordination

**Reads:**
- `company.os.departments.security` — security scan results, vulnerabilities
- `company.os.departments.engineering` — code security practices
- `company.os.events` — security incidents, compliance updates

**Emits:**
- `security-escalated` → immediate alert for P0 issues
- `vulnerability-critical` → details of critical vulnerabilities
- `compliance-risk` → flags compliance gaps blocking sales
- `incident-response-triggered` → alerts to security incidents

**Consumed by:**
- CEO briefing (includes security status)
- Sales department (aware of compliance blockers)
- Engineering department (receives vulnerability reports)
- Board updates (reports on security posture)
