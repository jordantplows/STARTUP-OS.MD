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

| Department   | Status      | Files Written | Completed     |
|--------------|-------------|---------------|---------------|
| strategy     | ⬜ pending  | -             | -             |
| brand        | ⬜ pending  | -             | -             |
| product      | ⬜ pending  | -             | -             |
| finance      | ⬜ pending  | -             | -             |
| marketing    | ⬜ pending  | -             | -             |
| sales        | ⬜ pending  | -             | -             |
| legal        | ⬜ pending  | -             | -             |
| people       | ⬜ pending  | -             | -             |
| operations   | ⬜ pending  | -             | -             |
| metrics      | ⬜ pending  | -             | -             |
| security     | ⬜ pending  | -             | -             |
| engineering  | ⬜ pending  | -             | -             |

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
