---
name: objection-handling
description: >
  Generates a comprehensive objection handling guide with 15 common objections,
  each including exact wording, underlying concern, ideal response, follow-up
  question, and resolution signal. Reads from sales playbook and pricing strategy.
allowed-tools: Read, Write, Edit, Bash
---

# Objection Handling Generator

## Purpose

Generate a battle-tested objection handling guide covering the 15 most common objections
in early-stage B2B sales. Each objection includes the exact wording you'll hear, the underlying
concern, a proven response framework, a follow-up question to advance the conversation, and
a signal that tells you when the objection is truly resolved.

## Context to load before writing

1. Read `CLAUDE.md` → extract Startup Profile for product context
2. Read `sales/output/sales-playbook.md` → understand MEDDIC framework, value props, positioning
3. Read `04-finance/pricing-strategy.md` → extract pricing tiers, ROI justification, payment terms
4. Read `03-product/user-personas.md` → understand buyer pain points and motivations
5. Read `02-brand/voice-and-tone.md` → ensure responses match brand voice (consultative, not defensive)

## Output structure

Write to `sales/output/objection-handling.md` with these sections:

### Introduction (2 paragraphs)
- Philosophy on objections: They're buying signals, not rejections
- How to use this guide: Internalize the underlying concern, don't script-read the response

### Objection Categories
Group the 15 objections into 5 categories:
1. **Price Objections** (3 objections)
2. **Timing Objections** (3 objections)
3. **Authority Objections** (2 objections)
4. **Competition Objections** (3 objections)
5. **Fit Objections** (4 objections)

### For each objection, provide:

**Objection**: The exact phrase you'll hear (e.g., "You're too expensive")

**Underlying Concern**: What they're really worried about (e.g., "I don't see the ROI" or "I'll get blamed if this fails")

**Ideal Response** (3-4 sentences):
- Validate the concern (don't dismiss it)
- Reframe with a question or insight
- Tie back to discovery findings (MEDDIC)
- Provide proof or alternative framing

**Follow-Up Question**: A question that advances the sale, uncovers the real objection, or tests if it's resolved

**Resolution Signal**: How you know the objection is truly handled (not just temporarily deflected)

**Trap to Avoid**: One common mistake salespeople make when handling this objection

### The 15 Objections (customize based on product, but here are defaults):

#### Price Objections
1. "You're too expensive"
2. "We don't have budget for this"
3. "Your competitor is cheaper"

#### Timing Objections
4. "We're not ready yet"
5. "Let's revisit this next quarter"
6. "We need to finish [other initiative] first"

#### Authority Objections
7. "I need to run this by my boss"
8. "I need buy-in from [other department]"

#### Competition Objections
9. "We're already using [competitor]"
10. "We're evaluating [competitor] too"
11. "Can't we just build this ourselves?"

#### Fit Objections
12. "I'm not sure this will work for us"
13. "We're too small for this"
14. "We're too complex for this"
15. "We need [feature you don't have]"

### Bonus Section: Handling False Objections
- How to identify smoke screens vs. real concerns
- The "peel the onion" technique: Ask "Help me understand..." 3 times
- When to walk away from a deal

### Next Steps
Three specific actions to train the team on objection handling.

## Writing rules

- Write responses in first person ("I hear you..." "Let me ask you...")
- Responses should be 3-4 sentences max — concise and conversational
- Avoid jargon or defensive language
- Every response must tie back to discovery (MEDDIC) or value delivered
- Include specific proof points from the product/pricing where applicable
- Mark assumptions with `[assumption: ...]` if pricing or product details are missing

## Execution

1. Load all context files listed above
2. Generate all 15 objections with full framework
3. Write to `sales/output/objection-handling.md`
4. Confirm completion with a count of objections covered

## Example output snippet (for tone and structure reference)

```markdown
## Price Objections

### 1. "You're too expensive"

**Underlying Concern**: They don't see the ROI clearly, or they're anchored to a lower price from a competitor or internal budget.

**Ideal Response**:
"I hear you — this is an important investment. Help me understand: when you say 'too expensive,' are you comparing to a specific alternative, or does this exceed your budget? From our discovery, you mentioned [specific pain point] is costing you [quantified impact]. If we can solve that and deliver [ROI metric], how does that change the value equation?"

**Follow-Up Question**:
"What ROI would make this a no-brainer for you?"

**Resolution Signal**:
They start talking about ROI or budget reallocation instead of absolute price. Or they say, "If you can show me the numbers, I'm open to it."

**Trap to Avoid**:
Don't immediately offer a discount. It signals you were overpriced to begin with and trains them to negotiate harder.

---

### 2. "We don't have budget for this"

**Underlying Concern**: Either they truly don't have budget (timing issue), or they don't see this as a priority worth reallocating budget for (value issue).

**Ideal Response**:
"I totally understand — budget is always tight. A couple of questions: Is this a timing issue where budget opens up in Q[X], or is it that this isn't a high enough priority to reallocate budget from something else? And when you say no budget, does that mean zero, or just not the full [price]?"

**Follow-Up Question**:
"If we could show a way to fund this from savings it generates in 90 days, would that change things?"

**Resolution Signal**:
They reveal either a specific budget cycle ("We can allocate in Q3") or a funding source ("If we cut [X], we could do this").

**Trap to Avoid**:
Don't assume "no budget" means no deal. Often it means "not convinced yet." Dig deeper.

---

### 3. "Your competitor is cheaper"

**Underlying Concern**: They're using price as a wedge to negotiate, or they genuinely don't understand the difference in value between you and the competitor.

**Ideal Response**:
"That's helpful context — I'm glad you're doing your homework. A few questions: What are you comparing? Are the scopes similar, or is their offering different? And more importantly, based on what you told me about [key pain point], does their solution actually solve that, or just check a box?"

**Follow-Up Question**:
"If they're cheaper but don't solve [pain point], what's the cost of not solving it?"

**Resolution Signal**:
They acknowledge a gap in the competitor's offering, or they agree the comparison isn't apples-to-apples.

**Trap to Avoid**:
Don't badmouth the competitor. Instead, ask questions that help them see the gap themselves.
```
