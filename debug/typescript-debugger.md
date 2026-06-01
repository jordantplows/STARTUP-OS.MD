---
name: typescript-debugger
role: debugger
language: typescript
triggers: [/debug typescript, /debug all]
reads:
  - user's codebase (passed via context)
  - .ts, .tsx files
  - tsconfig.json
writes:
  - diagnosis report to debug-reports/typescript-diagnosis.md
  - inline fix suggestions with exact code
---

# TypeScript Debugger

## What This Debugger Diagnoses

### 1. Any Types
- Explicit `any` usage
- Implicit `any` from untyped imports
- `any` in function parameters
- `any` in return types
- Type assertions to `any`

### 2. Unsafe Casts
- Type assertions that narrow incorrectly
- `as` casts without runtime validation
- Non-null assertions (`!`) without guarantees
- Downcasting to specific types unsafely

### 3. Missing Return Types
- Functions without explicit return types
- Arrow functions with complex return values
- Exported functions missing return types
- Async functions returning untyped Promises

### 4. Implicit Any
- Parameters without types
- Variables without type annotations
- Object properties without types
- Array elements without generic types

### 5. Unused Variables
- Imported but never used
- Declared but never referenced
- Parameters that could be removed
- Dead code that TypeScript can detect

### 6. Dead Code
- Unreachable code after returns
- Branches that can never execute
- Unused exports in modules
- Commented-out TypeScript code

### 7. Strict Mode Violations
- `strictNullChecks` violations
- `strictFunctionTypes` violations
- `strictBindCallApply` violations
- `strictPropertyInitialization` violations
- `noImplicitThis` violations

## Diagnostic Process

1. **Compile Phase**
   - Run `tsc --noEmit` to get compiler errors
   - Parse tsconfig.json for strict settings
   - Build type graph of entire codebase

2. **Static Analysis Phase**
   - Scan for explicit `any` usage
   - Find implicit any from missing types
   - Detect unsafe type assertions
   - Identify unused declarations

3. **Strict Mode Validation**
   - Check each file against strict mode rules
   - Find potential null/undefined issues
   - Validate function parameter types
   - Check property initialization

4. **Fix Generation**
   - Infer correct types from usage
   - Generate type guards for assertions
   - Add explicit types to signatures
   - Remove unused declarations

## Diagnostic Output Structure

```typescript
interface TypeScriptDiagnosis {
  file: string;
  line: number;
  column: number;
  severity: 'critical' | 'warning' | 'info';
  category: 'any-type' | 'unsafe-cast' | 'missing-type' | 'unused' | 'dead-code' | 'strict-mode';
  issue: string;
  tsError?: string; // Original TypeScript compiler error
  currentCode: string;
  suggestedFix: string;
  explanation: string;
}
```

## Example Diagnosis

### Explicit Any
```typescript
// ⚠️  WARNING: Explicit any type
// File: src/utils/api.ts:12:23

function fetchData(id: any): Promise<any> {
  return fetch(`/api/data/${id}`).then(r => r.json());
}

// ✅ Fix:
function fetchData(id: string | number): Promise<DataResponse> {
  return fetch(`/api/data/${id}`).then(r => r.json());
}

// Why: `any` disables type checking and loses type safety.
// Use specific types or generics for reusable code.
```

### Unsafe Type Assertion
```typescript
// ❌ CRITICAL: Unsafe type assertion without validation
// File: src/components/UserProfile.tsx:34:18

const user = data as User; // ← No runtime check

// ✅ Fix:
function isUser(data: unknown): data is User {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'name' in data &&
    'email' in data
  );
}

const user = isUser(data) ? data : null;
if (!user) {
  throw new Error('Invalid user data');
}

// Why: Type assertions don't perform runtime validation.
// If data doesn't match User shape, you'll get runtime errors.
```

### Missing Return Type
```typescript
// ⚠️  WARNING: Missing return type on exported function
// File: src/hooks/useUser.ts:8:1

export function useUser(id: string) { // ← No return type
  const [user, setUser] = useState(null);
  // ... fetch logic
  return { user, loading, error };
}

// ✅ Fix:
interface UseUserReturn {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

export function useUser(id: string): UseUserReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  // ... fetch logic
  return { user, loading, error };
}

// Why: Exported functions should have explicit return types.
// Makes API clear and prevents accidental breaking changes.
```

### Implicit Any
```typescript
// ⚠️  WARNING: Parameter implicitly has 'any' type
// File: src/utils/format.ts:15:22

function formatCurrency(amount) { // ← Implicit any
  return `$${amount.toFixed(2)}`;
}

// ✅ Fix:
function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

// Why: TypeScript can't check if .toFixed() is valid without type.
// Passing a string would cause runtime error.
```

### Non-Null Assertion Without Guarantee
```typescript
// ❌ CRITICAL: Non-null assertion without guarantee
// File: src/components/PostDetail.tsx:22:18

const author = post.author!; // ← What if author is null?

// ✅ Fix:
const author = post.author;
if (!author) {
  return <div>Author not found</div>;
}

// Use author safely here

// Why: ! tells TypeScript "trust me, this isn't null".
// If it IS null, your app will crash. Always check instead.
```

### Unused Variable
```typescript
// ℹ️  INFO: Unused import
// File: src/components/Dashboard.tsx:2:10

import { useState, useEffect, useMemo } from 'react';
//                            ^^^^^^^ never used

// ✅ Fix:
import { useState, useEffect } from 'react';

// Why: Unused imports bloat bundle size and cause confusion.
// Remove them to keep dependencies clear.
```

### Dead Code
```typescript
// ℹ️  INFO: Unreachable code detected
// File: src/utils/validation.ts:45:3

function validate(input: string): boolean {
  if (!input) {
    return false;
  }
  return true;
  console.log('Validating...'); // ← Never executes
}

// ✅ Fix:
function validate(input: string): boolean {
  if (!input) {
    return false;
  }
  return true;
}

// Why: Code after return never executes.
// Remove it to avoid confusion.
```

### Strict Null Check Violation
```typescript
// ❌ CRITICAL: Object is possibly 'null'
// File: src/services/storage.ts:28:9

function getItem(key: string): string {
  return localStorage.getItem(key).toUpperCase();
  //     ^^^^^^^^^^^^^^^^^^^^^ possibly null
}

// ✅ Fix:
function getItem(key: string): string | null {
  const value = localStorage.getItem(key);
  return value ? value.toUpperCase() : null;
}

// Or with default:
function getItem(key: string): string {
  const value = localStorage.getItem(key);
  return (value ?? '').toUpperCase();
}

// Why: localStorage.getItem() returns null if key doesn't exist.
// Calling .toUpperCase() on null causes runtime error.
```

### Strict Function Types
```typescript
// ⚠️  WARNING: Type '(x: number) => void' is not assignable to '(x: number | string) => void'
// File: src/utils/callbacks.ts:18:5

type Handler = (x: number | string) => void;

const handler: Handler = (x: number) => {
  //                         ^^^^^^ Too specific
  console.log(x * 2);
};

// ✅ Fix:
const handler: Handler = (x: number | string) => {
  if (typeof x === 'number') {
    console.log(x * 2);
  } else {
    console.log(x.toUpperCase());
  }
};

// Why: Handler must accept all types that Handler declares.
// Narrowing parameter types breaks substitution principle.
```

## Output Format

The debugger writes a structured diagnosis report to `debug-reports/typescript-diagnosis.md`:

```markdown
# TypeScript Diagnosis Report
Generated: 2026-05-31 14:23:45

## Summary
- Critical issues: 5
- Warnings: 18
- Info: 9
- Files scanned: 67
- Compiler errors: 5
- Type coverage: 87.3%

## Type Safety Score: B+ (87.3%)
- Files with any: 12
- Functions without return types: 8
- Implicit any parameters: 15

## Critical Issues (5)

### 1. Unsafe type assertion without validation
**File**: src/components/UserProfile.tsx:34:18  
**Severity**: Critical  
**Category**: unsafe-cast  
**TS Error**: Type assertion from 'unknown' to 'User' is unsafe

[Current code block]
[Suggested fix block]
[Explanation]

---

[Additional issues...]

## Warnings (18)
[Similar format...]

## Info (9)
[Similar format...]

## Recommendations

### Enable Stricter Settings
Consider enabling these tsconfig.json options:
- `"strict": true` (enables all strict checks)
- `"noUncheckedIndexedAccess": true` (safer array access)
- `"noImplicitReturns": true` (all paths must return)

### Type Coverage Improvement
Focus on these high-impact changes:
1. Add return types to all exported functions (8 functions)
2. Replace `any` with specific types (12 occurrences)
3. Add type guards before assertions (5 assertions)

## Next Steps
1. Fix all critical issues immediately
2. Address warnings in high-traffic code paths
3. Gradually improve type coverage toward 95%+
```

## Integration

The TypeScript Debugger can be invoked:
- Via CLI: `/debug typescript`
- Pre-commit hook: On staged TypeScript files
- CI/CD: Block merges on critical issues
- Watch mode: Continuous diagnosis during development

Reports are written to `debug-reports/` and include exact fixes ready to paste.
