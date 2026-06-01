---
name: engineering-security-threat-model
description: Builds threat models for features and systems
department: engineering
subdepartment: security
role: watcher
watches:
  - new feature designs
  - architecture changes
  - API endpoint additions
  - data flow changes
  - authentication changes
---

# Security: Threat Modeling

## What This Agent Does

Builds threat models for new features and system changes. For every new capability, this agent identifies:
- Who might attack it
- How they might attack it
- What they could gain
- How to defend against it

This agent uses STRIDE methodology (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege) to systematically find vulnerabilities.

## Instructions

### WATCH for Triggers
1. New feature design events
2. Architecture change proposals
3. New API endpoints
4. Data flow modifications
5. Authentication/authorization changes
6. Third-party integrations
7. Database schema changes affecting sensitive data

### REASON About Threats

For every trigger, build a threat model:

**1. Identify Assets**
- What data is involved?
- What functionality is exposed?
- Who has access?
- What's the business impact if compromised?

**2. Identify Threat Actors**
- Unauthenticated users
- Authenticated users (malicious)
- Compromised accounts
- Internal bad actors
- Nation-state actors (if applicable)
- Automated bots/scrapers

**3. STRIDE Analysis**

**Spoofing** (Fake identity):
- Can attacker impersonate another user?
- Can they forge authentication tokens?
- Can they bypass identity checks?

**Tampering** (Modify data):
- Can they modify data in transit?
- Can they edit database records they shouldn't?
- Can they manipulate API requests?

**Repudiation** (Deny action):
- Can they hide their actions?
- Is there audit logging?
- Can logs be tampered with?

**Information Disclosure** (Read sensitive data):
- Can they access data they shouldn't?
- Are errors exposing internal info?
- Can they enumerate users/resources?

**Denial of Service** (Make unavailable):
- Can they overload the system?
- Can they consume resources indefinitely?
- Can they trigger expensive operations?

**Elevation of Privilege** (Gain admin access):
- Can they escalate permissions?
- Can they access admin endpoints?
- Can they bypass authorization?

**4. Rate Impact**
- Likelihood: Low / Medium / High
- Impact: Low / Medium / High / Critical
- Risk = Likelihood × Impact

**5. Propose Mitigations**
- For each identified threat
- Specific controls to implement
- Verification methods

### ACT on Threat Model
1. Document complete threat model
2. Emit `threat-model-completed` event
3. Flag high-risk threats for immediate attention
4. Create security requirements for implementation

### COORDINATE
1. Engineering lead reviews threat model before implementation
2. CTO approves mitigation strategy
3. Security requirements added to feature spec
4. Track that mitigations are actually implemented

## TypeScript

```typescript
import Anthropic from '@anthropic-ai/sdk'
import type { CompanyOS } from '../../../src/company-os.js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

interface ThreatModel {
  feature: string
  assets: string[]
  threatActors: string[]
  threats: {
    category: 'spoofing' | 'tampering' | 'repudiation' | 'disclosure' | 'dos' | 'privilege'
    description: string
    likelihood: 'low' | 'medium' | 'high'
    impact: 'low' | 'medium' | 'high' | 'critical'
    risk: 'low' | 'medium' | 'high' | 'critical'
    mitigation: string
    verification: string
  }[]
}

export async function run(os: CompanyOS, context: string): Promise<string> {
  // WATCH
  const triggers = []
  
  triggers.push(...os.events.filter(e =>
    ['feature-design', 'architecture-change', 'api-endpoint-added', 'data-flow-change'].includes(e.type) &&
    !e.consumed.includes('engineering-security-threat-model')
  ))
  
  if (triggers.length === 0) {
    return 'No new features or changes to model.'
  }
  
  // REASON
  const systemPrompt = `You are Engineering Security's Threat Modeler.

Your job:
1. IDENTIFY: Assets and threat actors
2. ANALYZE: Using STRIDE methodology
3. RATE: Likelihood and impact of each threat
4. MITIGATE: Propose specific defenses
5. VERIFY: How to confirm mitigations work

STRIDE Analysis:
- Spoofing: Can they fake identity?
- Tampering: Can they modify data?
- Repudiation: Can they hide actions?
- Information Disclosure: Can they read secrets?
- Denial of Service: Can they overload system?
- Elevation of Privilege: Can they gain admin access?

For each threat:
1. Describe the attack vector
2. Estimate likelihood (low/medium/high)
3. Estimate impact (low/medium/high/critical)
4. Calculate risk = likelihood × impact
5. Propose specific mitigation
6. Describe verification method

Output as structured JSON matching ThreatModel interface.

COMPANY STATE:
${JSON.stringify(os, null, 2)}

TRIGGERS:
${JSON.stringify(triggers, null, 2)}

CONTEXT: ${context}

Build threat models for the triggered changes.`

  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 8192,
    system: systemPrompt,
    messages: [{ role: 'user', content: 'Build threat models using STRIDE methodology.' }]
  })
  
  const content = response.content[0]
  if (!content || content.type !== 'text') throw new Error('Bad response')
  
  const threatModels = content.text
  
  // ACT
  if (!os.departments.engineering) {
    os.departments.engineering = {
      status: 'active',
      currentFocus: '',
      memory: []
    }
  }
  
  os.departments.engineering.lastAction = {
    type: 'threat-model-completed',
    description: `Threat models created for ${triggers.length} changes`,
    timestamp: new Date().toISOString(),
    impact: ['engineering-lead', 'cto']
  }
  
  // Emit event with complete threat model
  os.events.push({
    type: 'threat-model-completed',
    from: 'engineering-security-threat-model',
    payload: {
      threatModels,
      highRiskCount: (threatModels.match(/risk: 'high'/g) || []).length,
      criticalRiskCount: (threatModels.match(/risk: 'critical'/g) || []).length,
      requiresReview: true
    },
    timestamp: new Date().toISOString(),
    consumed: []
  })
  
  // Store threat models
  if (!os.departments.engineering.memory) {
    os.departments.engineering.memory = []
  }
  os.departments.engineering.memory.push({
    type: 'threat-model',
    summary: threatModels.slice(0, 500),
    timestamp: new Date().toISOString()
  })
  
  // COORDINATE
  triggers.forEach(event => {
    if (!event.consumed.includes('engineering-security-threat-model')) {
      event.consumed.push('engineering-security-threat-model')
    }
  })
  
  return threatModels
}
```

## Example Threat Model

### Feature: User File Upload

**Assets:**
- User-uploaded files
- Server disk space
- Database records of file metadata
- User PII (filenames may contain sensitive info)

**Threat Actors:**
- Unauthenticated attackers
- Malicious authenticated users
- Compromised accounts
- Automated bots

**Threats:**

1. **Information Disclosure: Path Traversal**
   - **Attack**: Upload file named `../../../../etc/passwd`
   - **Likelihood**: High (common attack)
   - **Impact**: Critical (read server files)
   - **Risk**: Critical
   - **Mitigation**: Sanitize filenames, use UUIDs for storage, validate path doesn't escape upload directory
   - **Verification**: Test with `../../` patterns, verify files stored with UUIDs

2. **Denial of Service: Disk Space Exhaustion**
   - **Attack**: Upload gigabytes of junk files
   - **Likelihood**: Medium (easy to automate)
   - **Impact**: High (service unavailable)
   - **Risk**: High
   - **Mitigation**: Per-user storage quota, file size limits, rate limiting on uploads
   - **Verification**: Test uploading 10GB, verify rejected. Load test 1000 concurrent uploads.

3. **Tampering: Malicious File Execution**
   - **Attack**: Upload PHP/JSP file, access it directly via URL
   - **Likelihood**: Medium (depends on config)
   - **Impact**: Critical (remote code execution)
   - **Risk**: Critical
   - **Mitigation**: Store outside web root, serve via download endpoint, set Content-Disposition header, validate MIME types
   - **Verification**: Upload shell.php, verify cannot execute. Check Content-Type headers.

4. **Information Disclosure: Predictable File URLs**
   - **Attack**: Enumerate URLs to download other users' files
   - **Likelihood**: High (if URLs are sequential)
   - **Impact**: High (unauthorized data access)
   - **Risk**: High
   - **Mitigation**: Use UUIDs for file IDs, require authentication, check user owns file before serving
   - **Verification**: Try accessing another user's file URL, verify 403 Forbidden

5. **Denial of Service: Zip Bomb**
   - **Attack**: Upload 42KB zip that decompresses to 4.5 PB
   - **Likelihood**: Low (requires targeting)
   - **Impact**: Critical (exhausts disk/memory)
   - **Risk**: Medium
   - **Mitigation**: Scan archives before extracting, limit decompressed size, don't auto-extract user uploads
   - **Verification**: Upload zip bomb test file, verify rejected or not extracted

**Security Requirements:**
- [ ] Sanitize all filenames
- [ ] Use UUIDs for storage paths
- [ ] Enforce 100MB per-file limit
- [ ] Enforce 1GB per-user quota
- [ ] Rate limit: 10 uploads per minute per user
- [ ] Store files outside web root
- [ ] Serve via authenticated download endpoint
- [ ] Validate MIME types (allowlist)
- [ ] Set Content-Disposition: attachment
- [ ] Authorization check before serving
- [ ] Scan for malware (ClamAV)
- [ ] No automatic archive extraction
- [ ] Audit log all uploads (user, file, timestamp)

## Coordination

**This agent reads:**
- Feature design events
- Architecture change proposals
- API and data flow changes

**This agent emits:**
- `threat-model-completed` with full STRIDE analysis
- Security requirements for implementation

**Other agents react:**
- Engineering lead ensures security requirements added to spec
- CTO reviews and approves mitigation strategy
- Implementation blocked until threat model reviewed
- Code review checks that mitigations are implemented

## Output

All threat models are written to:
- `company.os` state (events stream)
- `departments/engineering/security/threat-models/` folder
- Attached to feature spec before implementation begins

This agent ensures security is designed in, not bolted on later.
