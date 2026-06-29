---
name: commit-writer
description: >
  Writes a complete conventional commit message from currently staged 
  changes. Analyzes the diff, determines the correct type (feat/fix/
  refactor/chore/docs/test), writes a concise summary line, and a full 
  body explaining what changed and why.
allowed-tools: Bash, Read
---

# commit-writer

Generates proper conventional commit messages from staged changes.

## Instructions

1. **Check what's staged**
   ```bash
   git diff --staged --stat
   ```
   If nothing is staged, inform the user and exit.

2. **Read the actual changes**
   ```bash
   git diff --staged
   ```
   If the diff is very large (>500 lines), sample key files instead:
   ```bash
   git diff --staged --stat
   git diff --staged path/to/key/file.ts
   ```

3. **Read recent commit history for style**
   ```bash
   git log --oneline -10
   git log -1 --format="%B"
   ```
   This shows the repository's commit message conventions.

4. **Determine the commit type**
   - **feat**: new functionality added
   - **fix**: bug fix
   - **refactor**: restructuring without behavior change
   - **chore**: tooling, config, dependencies, build setup
   - **docs**: documentation only
   - **test**: test additions or changes
   - **perf**: performance improvement
   - **style**: formatting only, no logic change

   If changes span multiple types, pick the dominant one and mention 
   others in the body.

5. **Write the subject line**
   Format: `type: short imperative summary`
   - Under 72 characters
   - No period at the end
   - Imperative mood ("add", "fix", "merge" — not "added", "fixed", "merged")
   - Be specific but concise

6. **Decide if body is needed**
   
   **Skip the body** for:
   - Typo fixes
   - Single small bug fixes
   - Dependency bumps
   - Self-explanatory one-liners
   
   **Write a full body** for:
   - Structural changes
   - Multi-file refactors
   - New features
   - Anything that changes behavior
   - Anything where "why" isn't obvious from "what"

7. **When writing a body**
   
   Structure:
   ```
   First paragraph: what changed and why, in plain English.

   Changes:
   - Group related changes logically
   - Use bullet points for clarity
   - Include file paths or component names

   Updated:
   - List modified existing features
   - Explain impact on behavior

   Renamed:
   - Old → new mappings
   - Explain why renamed
   ```

   **Breaking changes**: Call out explicitly with "BREAKING CHANGE:" on 
   its own line, followed by what breaks and how to migrate.

   **User context**: If the user provided extra context as an argument 
   to this skill, weave it naturally into the body rather than appending.

8. **Check for unrelated changes**
   
   If staged changes span genuinely unrelated concerns (e.g., a feature 
   plus an unrelated dependency bump), flag this:
   
   > "These look like two unrelated changes:
   > 1. [feature description]
   > 2. [dependency/fix description]
   >
   > Want me to write one message covering both, or should we split 
   > into separate commits?"
   
   Wait for their answer before proceeding.

9. **Show the message and confirm**
   
   Display the complete commit message in a code block, then ask:
   
   ```
   Use this commit message?
   [Y] yes  [E] edit  [N] cancel
   ```

10. **On [Y] — commit**
    
    For short messages:
    ```bash
    git commit -m "type: subject" -m "body paragraph"
    ```
    
    For complex multi-paragraph bodies, write to a temp file:
    ```bash
    cat > /tmp/commit-msg.txt <<'COMMIT_EOF'
    type: subject

    First paragraph explaining what and why.

    Changes:
    - item one
    - item two

    Co-Authored-By: Claude Sonnet 4.5 (1M context) <noreply@anthropic.com>
    COMMIT_EOF
    git commit -F /tmp/commit-msg.txt
    rm /tmp/commit-msg.txt
    ```

11. **On [E] — edit**
    
    Ask: "What should I change?"
    Wait for feedback, regenerate, show again.

12. **On [N] — cancel**
    
    Confirm cancellation and exit without committing.

## Co-Author tag

Always append this line to the commit body:

```
Co-Authored-By: Claude Sonnet 4.5 (1M context) <noreply@anthropic.com>
```

## Examples

### Example 1: Feature addition

**Staged changes**: New authentication flow with JWT tokens

**Message**:
```
feat: add JWT-based authentication system

Replaces session cookies with JWT tokens for better scalability
and easier mobile client support. Tokens expire after 7 days
and include refresh token rotation.

Changes:
- src/auth/jwt.ts — token generation and verification
- src/middleware/auth.ts — JWT validation middleware
- src/routes/auth.ts — login/logout/refresh endpoints
- package.json — added jsonwebtoken dependency

Updated:
- User model to store refreshTokenVersion for invalidation
- API clients to include Authorization header

BREAKING CHANGE: clients must now send 'Authorization: Bearer <token>'
header instead of relying on cookies. See migration guide in docs/auth.md.

Co-Authored-By: Claude Sonnet 4.5 (1M context) <noreply@anthropic.com>
```

### Example 2: Bug fix (no body needed)

**Staged changes**: One-line fix for null pointer

**Message**:
```
fix: prevent null pointer in user profile loader
```

### Example 3: Refactor

**Staged changes**: Reorganized directory structure

**Message**:
```
refactor: move executive agents into department directories

Executives now live inside the department they steer instead of
as separate top-level folders. This reflects that an executive
is the steering layer of its org, not a standalone entity.

Changes:
- cfo/ → finance/exec/
- cmo/ → marketing/exec/
- cto/ → engineering/exec/
- All department agents updated with reportsTo field

Updated:
- company-os.ts schema — exec state nests under department
- router.ts — agent discovery updated for new structure
- All .md agents — corrected read/write paths

Renamed for clarity:
- product/exec/roadmap.md → roadmap-oversight.md

No functional behavior change — this is structural only. All
agent logic, watch/reason/act cycles, and company.os coordination
remain the same.

Co-Authored-By: Claude Sonnet 4.5 (1M context) <noreply@anthropic.com>
```

## Usage

In any conversation with staged changes:

```
/commit-writer
```

Or with context:

```
/commit-writer This fixes the bug reported in issue #42 where users 
couldn't log in after password reset.
```

The skill will analyze the diff, generate the message, and walk you
through confirmation before committing.
