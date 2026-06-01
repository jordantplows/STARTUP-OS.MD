---
name: core-generate-html
description: Generates HTML pages from content
department: core
role: generator
watches:
  - html generation requests
---

## What this agent does

Converts content to HTML pages. Used for landing pages, email templates, etc.

## Instructions

### WATCH
HTML generation requests

### REASON
Generate semantic HTML with:
- Proper structure
- Accessibility
- Responsive design
- Brand styling

### ACT
Generate HTML, return code

### COORDINATE
Requesting agent gets HTML output

## TypeScript

```typescript
import type { CompanyOS } from '../src/company-os.js'

export async function run(os: CompanyOS, content: string, title: string): Promise<string> {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - ${os.profile.companyName}</title>
</head>
<body>
  <main>
    ${content}
  </main>
</body>
</html>`

  os.departments['core-generate-html'].lastAction = {
    type: 'html-generated',
    description: `Generated HTML: ${title}`,
    timestamp: new Date().toISOString(),
    impact: ['founder']
  }
  
  os.departments['core-generate-html'].status = 'watching'
  
  return html
}
```

## Coordination

**Reads:** Content
**Emits:** `html-ready`
**React:** Founder uses
