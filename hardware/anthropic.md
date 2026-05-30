---
name: anthropic
description: Anthropic API hardware interface specification
layer: hardware
---

## What this hardware layer does

Documents the Anthropic API interface — the physical hardware
that startup-os runs on. This is equivalent to CPU/RAM specs
for a real operating system.

## Specifications

### Model

- **Primary model**: `claude-opus-4-5`
- **Fallback model**: `claude-sonnet-4-5`
- **Min model for agents**: `claude-sonnet-4-5`

### Token Limits

- **Max tokens per agent call**: 8,096 output tokens
- **Max context window**: 200,000 tokens
- **Recommended input per agent**: < 20,000 tokens

### Rate Limiting

- **Tier 1**: 50 requests/min (default free tier)
- **Tier 2**: 1,000 requests/min (paid tier)
- **Tier 3**: 2,000 requests/min (enterprise)

The kernel's scheduler must respect rate limits by:
- Tracking requests per minute
- Queuing agents when limit approached
- Implementing exponential backoff on 429 errors

### Retry Policy

- **Transient errors**: Retry up to 3 times
- **Backoff strategy**: Exponential (2^attempt seconds)
- **Non-retryable errors**: 401, 403, 404, invalid schema

### Cost Estimation

Per full build (12 departments, ~40 agents):

```
Input tokens:  ~400,000 @ $15/1M  = $6.00
Output tokens: ~320,000 @ $75/1M  = $24.00
Total:                             $30.00
```

Actual cost varies based on:
- Startup complexity (idea stage vs series-a)
- Output verbosity per agent
- Number of retry attempts

### API Key Management

API key must be provided via:
1. `ANTHROPIC_API_KEY` environment variable, or
2. `.env` file in workspace root, or
3. Interactive prompt on first run

Never commit API keys to version control.

### Prompt Caching

Enable prompt caching for:
- Startup profile (changes rarely)
- Agent instructions (static)
- Upstream context (per-agent cache)

Expected cache hit rate: 60-80% after first build.

### Error Codes

| Code | Meaning | Recovery |
|------|---------|----------|
| 429  | Rate limit | Retry with backoff |
| 500  | Server error | Retry up to 3x |
| 503  | Overloaded | Retry with backoff |
| 401  | Invalid API key | Halt, prompt user |
| 400  | Invalid request | Halt, log error |

## Implementation Notes

The runtime should:
- Initialize Anthropic client once at boot
- Reuse client across all agent calls
- Implement connection pooling
- Handle streaming responses (future)
- Log all API calls to `_reports/api-log.jsonl`
