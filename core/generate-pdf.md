---
name: core-generate-pdf
description: Generates PDF documents from markdown content
department: core
role: generator
watches:
  - pdf generation requests
---

## What this agent does

Converts markdown content to professional PDF documents. Used for investor decks, reports, etc.

## Instructions

### WATCH
PDF generation requests with content

### REASON
Format content for PDF:
- Add cover page
- Format sections
- Include page numbers
- Add branding

### ACT
Generate PDF, return file path

### COORDINATE
Requesting agent gets PDF output

## TypeScript

```typescript
import type { CompanyOS } from '../src/company-os.js'

export async function run(os: CompanyOS, content: string, title: string): Promise<string> {
  // In production, this would use a PDF library (puppeteer, pdfkit, etc)
  // For now, return formatted content
  
  const pdfContent = `PDF: ${title}

${content}

Generated: ${new Date().toISOString()}
Company: ${os.profile.companyName}`

  os.departments['core-generate-pdf'].lastAction = {
    type: 'pdf-generated',
    description: `Generated PDF: ${title}`,
    timestamp: new Date().toISOString(),
    impact: ['founder']
  }
  
  os.departments['core-generate-pdf'].status = 'watching'
  
  return pdfContent
}
```

## Coordination

**Reads:** Content to convert
**Emits:** `pdf-ready`
**React:** Founder downloads
