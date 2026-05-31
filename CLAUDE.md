# Startup OS — Project Instructions

This is the startup-os repository. This file contains the startup profile and build tracking for the complete company operating system.

---

## Startup Profile
<!-- Auto-populated by /startup-os build -->

- Company Name:        [PENDING]
- One-line:            [PENDING]
- Industry:            [PENDING]
- Business Model:      [PENDING]
- Target Customer:     [PENDING]
- Problem:             [PENDING]
- Stage:               idea
- Location:            [PENDING]
- Founders:            [PENDING]
- Revenue:             $0
- Fundraising Goal:    [PENDING]
- Launch Target:       [PENDING]

---

## Build Log
<!-- Auto-updated as each department completes -->

| Department   | Agent                      | MD | PDF | CSV | HTML | SVG | Status      |
|--------------|----------------------------|----|-----|-----|------|-----|-------------|
| strategy     | -                          | -  | -   | -   | -    | -   | ⬜ pending  |
| brand        | -                          | -  | -   | -   | -    | -   | ⬜ pending  |
| product      | -                          | -  | -   | -   | -    | -   | ⬜ pending  |
| finance      | model                      | -  | -   | -   | -    | -   | ⬜ pending  |
| finance      | fpa                        | -  | -   | -   | -    | -   | ⬜ pending  |
| finance      | controller                 | -  | -   | -   | -    | -   | ⬜ pending  |
| marketing    | -                          | -  | -   | -   | -    | -   | ⬜ pending  |
| sales        | -                          | -  | -   | -   | -    | -   | ⬜ pending  |
| legal        | -                          | -  | -   | -   | -    | -   | ⬜ pending  |
| people       | -                          | -  | -   | -   | -    | -   | ⬜ pending  |
| operations   | -                          | -  | -   | -   | -    | -   | ⬜ pending  |
| metrics      | -                          | -  | -   | -   | -    | -   | ⬜ pending  |
| security     | -                          | -  | -   | -   | -    | -   | ⬜ pending  |
| engineering  | -                          | -  | -   | -   | -    | -   | ⬜ pending  |
| design       | ui-designer                | -  | -   | -   | -    | -   | ⬜ pending  |
| design       | ux-designer                | -  | -   | -   | -    | -   | ⬜ pending  |
| design       | canvas-designer            | -  | -   | -   | -    | -   | ⬜ pending  |
| design       | brand-designer             | -  | -   | -   | -    | -   | ⬜ pending  |
| design       | design-systems-engineer    | -  | -   | -   | -    | -   | ⬜ pending  |
| design       | motion-designer            | -  | -   | -   | -    | -   | ⬜ pending  |
| design       | ux-researcher              | -  | -   | -   | -    | -   | ⬜ pending  |
| executive    | ceo                        | -  | -   | -   | -    | -   | ⬜ pending  |
| executive    | cto                        | -  | -   | -   | -    | -   | ⬜ pending  |
| executive    | cfo                        | -  | -   | -   | -    | -   | ⬜ pending  |
| executive    | cmo                        | -  | -   | -   | -    | -   | ⬜ pending  |
| executive    | cpo                        | -  | -   | -   | -    | -   | ⬜ pending  |
| executive    | coo                        | -  | -   | -   | -    | -   | ⬜ pending  |
| growth       | growth-hacker              | -  | -   | -   | -    | -   | ⬜ pending  |
| growth       | demand-gen                 | -  | -   | -   | -    | -   | ⬜ pending  |
| growth       | seo-specialist             | -  | -   | -   | -    | -   | ⬜ pending  |
| growth       | content-strategist         | -  | -   | -   | -    | -   | ⬜ pending  |
| data         | data-analyst               | -  | -   | -   | -    | -   | ⬜ pending  |
| data         | ml-engineer                | -  | -   | -   | -    | -   | ⬜ pending  |
| data         | bi-analyst                 | -  | -   | -   | -    | -   | ⬜ pending  |
| customer     | customer-success           | -  | -   | -   | -    | -   | ⬜ pending  |
| customer     | customer-support           | -  | -   | -   | -    | -   | ⬜ pending  |
| customer     | cx-designer                | -  | -   | -   | -    | -   | ⬜ pending  |

---

## Usage

Run the complete build:
```
/startup-os build "Your startup idea here"
```

Check status:
```
/startup-os status
```

Re-run a department or agent:
```
/startup-os run finance
/startup-os run product roadmap
```

Reset everything:
```
/startup-os reset
```

---

## Notes

- The build runs 12 departments sequentially with dependency chains
- Each department writes to its `output/` folder
- Security and engineering write to `_reports/`
- The Build Log above tracks completion status in real-time
- Cross-department consistency is validated automatically
