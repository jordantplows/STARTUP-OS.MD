# Outreach Department

Manages customer and investor acquisition through personalized outreach campaigns.

## Agents

- **cold-email** — Personalized cold email sequences specific to company's ICP
- **linkedin** — LinkedIn outreach strategy and DM sequences
- **investor-outreach** — Investor targeting and warm intro mapping
- **community** — Community engagement in target customer spaces

## Purpose

Automates the discovery and engagement of potential customers and investors based on company.os profile and signals. All outreach is personalized, tracked, and coordinated with other departments.

## Coordination

- Reads ICP from `company.os.profile.targetCustomer`
- Writes outreach activity to `company.os.outreach`
- Emits `outreach-sent`, `reply-received` events
- Tripwired for investor outreach (founder approval required)
