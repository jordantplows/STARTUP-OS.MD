# Example: Company Runtime in Action

This shows what actually happens when you instantiate a company with startup-os.

## /startup-os build "AI code review for security teams"

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Instantiating your company...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

I understand you're building: AI code review for security teams

Before I instantiate your company, three quick questions:

What stage are you at?
→ just an idea / validating / building / revenue

Who is your first customer? Be specific.
→ (you type: Security engineers at Series B+ SaaS companies)

What's the one thing that has to be true for this to work?
→ (you type: Security teams must prefer automated pre-screening
   over doing all reviews manually)
```

## After You Answer

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Company initialized. Agents starting...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

● CEO          → coordinating
● Legal        → watching
● Product      → defining MVP
● Red Team     → challenging assumptions

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 SecureCode · CEO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

 WHAT WE'RE BUILDING
 AI-powered code review that pre-screens security issues
 before they reach manual review. For security engineers at
 Series B+ SaaS companies who are drowning in review volume.

 WHAT I'M FOCUSED ON
 Validating the core assumption: security teams actually want
 automated pre-screening. Red Team is right to flag this —
 security engineers are notoriously skeptical of AI tools.

 WHAT YOUR DEPARTMENTS ARE DOING
 Product    → Defining minimum testable feature set
 Legal      → Flagged: review AI liability for false negatives
 Red Team   → Challenging: "security teams are cheap with tools"

 WHAT I NEED FROM YOU
 We have a decision fork:

 Option A: Build prototype integration (2 weeks)
 - GitHub PR comments only
 - Basic XSS + SQL injection detection
 - Test with 3-5 security teams
 - Pro: Fast validation
 - Con: Too narrow to show real value

 Option B: Build full MVP (8 weeks)
 - Multiple integrations (GitHub, GitLab, Bitbucket)
 - 20+ security issue types
 - Dashboard + metrics
 - Pro: Shows real value
 - Con: Expensive if assumption is wrong

 Red Team says neither will validate willingness to PAY.
 They're right — free tools don't prove business viability.

 My recommendation: Prototype + paid pilot agreement.
 Build A, but get 3 teams to commit to $500/month if it works.
 If they won't commit, the assumption is wrong and we pivot.

 Do you want to proceed with that approach, or do you see
 this differently?

 → [You type your answer]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## You Respond

```
You: "Agree with CEO. Let's do prototype + paid pilot. But I want
     to talk to 5 security engineers first before building anything.
     What should I ask them?"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Product · responding
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

 Good call. Here's what to ask:

 VALIDATE THE PROBLEM (not the solution)
 1. Walk me through your last security code review.
    - How long did it take?
    - What percentage was obvious issues vs. subtle bugs?
    - What percentage could a tool have caught?

 2. What's your biggest bottleneck in code review?
    - Not "we need faster reviews" (that's generic)
    - Specific: "We can't review before deploy" vs.
      "We miss context without seeing the full PR"

 3. Have you tried automated security tools?
    - What did you try? (SonarQube, Snyk, Semgrep?)
    - Why did you stop using it / keep using it?
    - What would make an AI tool different?

 VALIDATE WILLINGNESS TO PAY
 4. If I built a tool that cut your review time by 50%,
    what would you pay for it?
    - Not "would you pay" — force a number
    - If they say "we'd need to see it first," that's a no

 5. Who controls the budget for security tools at your company?
    - If it's not them: talk to that person instead
    - If it needs 3 approvals: this isn't an MVP customer

 VALIDATE URGENCY
 6. When's your next code freeze / release cycle?
    - If they're not releasing in the next 2 weeks: not urgent
    - If they're mid-incident: talk to them AFTER it's resolved

 7. If I gave you this tool tomorrow for free, would you
    use it on your next release?
    - "Maybe" = no
    - "We'd need to evaluate it" = no
    - "Yes, on this specific PR" = real interest

 DO NOT:
 - Pitch your solution
 - Talk about AI features
 - Ask "would this be useful?" (everyone says yes)
 - Accept vague answers

 STOP THE CONVERSATION IF:
 - They haven't done a code review in the last week
 - They say "we mostly use automated tools already"
 - They can't name a specific painful review from this month

 These questions will validate the problem and willingness
 to pay. Come back with what you learn and we'll refine
 the prototype scope.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Red Team · responding
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

 One more thing Product won't tell you:

 If 4 out of 5 people say "we'd pay $500" but 0 out of 5
 actually sign a pilot agreement for $500, your assumption
 is still wrong.

 Willingness to say they'd pay ≠ willingness to actually pay.

 Get signatures on pilot agreements BEFORE you build.
 Not "we'll try it when it's ready."
 Not "we're interested in testing."
 Actual "we'll pay $500/month if it does X, Y, Z."

 If you can't get 3 signatures, the problem isn't painful
 enough or your price is wrong.

 Don't waste 8 weeks finding that out.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Later That Day

```
You: "talked to 3 security engineers, all said they'd pay but
     none would sign pilot agreements. what now?"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 CEO · responding
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

 Red Team called it.

 This means one of three things:

 1. The problem isn't painful enough to pay for
 2. Your price is wrong for this segment
 3. You're talking to the wrong customer

 WHAT I NEED FROM YOU:

 Go back to one of those three and ask:
 "You said you'd pay $500. What would need to be true for
  you to sign a pilot agreement right now for when we launch?"

 Their answer tells you what's actually blocking this:

 - "We'd need to see it working first" = not painful enough
 - "That price is too high for our budget" = wrong segment
 - "I'd need approval from [person]" = wrong buyer

 DO NOT BUILD until you know which one it is.

 Product and I can pivot based on what you learn, but we
 need the actual objection, not "interested but not ready."

 What do you want to do?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## What Just Happened

1. **You gave an idea** → CEO, Product, Legal, Red Team initialized
2. **CEO briefed you** → Synthesized all department inputs
3. **CEO surfaced a decision** → With recommendation and tradeoff
4. **You answered** → All agents heard it and reacted
5. **Product gave research questions** → Specific to your customer
6. **Red Team challenged** → Surfaced the validation trap
7. **You reported back** → CEO synthesized and redirected
8. **CEO stayed on you** → Won't let you build until validated

This is not a document generator. This is a company running in Claude Code.

The agents:
- **Watch** everything happening
- **Decide** when to speak up
- **Act** in their domain
- **Coordinate** through events

You're the only human. Your job is to answer questions and execute.
Everything else — prioritization, risk assessment, coordination — runs itself.

## Compare to Traditional Startup

**Traditional:**
- You write a business plan (alone)
- You guess at MVP scope (alone)
- You talk to customers (alone)
- You try to remember what legal said 2 weeks ago (alone)
- You forget to validate pricing before building (alone)

**With startup-os:**
- CEO coordinates across all departments
- Product defines MVP based on actual validation
- Red Team prevents you from building without validation
- Legal flags risks in real-time
- You never forget a decision — it's in company.os.json

You're not alone. You have a company.
