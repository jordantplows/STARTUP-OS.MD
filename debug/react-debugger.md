---
name: react-debugger
role: debugger
language: react
triggers: [/debug react, /debug all]
reads:
  - user's codebase (passed via context)
  - .tsx, .ts, .jsx, .js files with React imports
writes:
  - diagnosis report to debug-reports/react-diagnosis.md
  - inline fix suggestions with exact code
---

# React Debugger

## What This Debugger Diagnoses

### 1. Missing Keys in Lists
- Lists rendered without unique `key` props
- Non-unique or index-based keys
- Keys that change between renders

### 2. Invalid Hooks Usage
- Hooks called conditionally
- Hooks called in loops
- Hooks called in nested functions
- Hooks called after early returns
- Custom hooks that don't follow `use*` naming

### 3. Prop Type Mismatches
- Props passed with wrong types
- Required props not provided
- Unknown props passed to components
- Spreading props that conflict with explicit props

### 4. useEffect Dependencies
- Missing dependencies in dependency array
- Unnecessary dependencies causing excess renders
- Missing cleanup functions for subscriptions/timers
- Empty dependency array when dependencies exist

### 5. Stale Closures
- Event handlers referencing stale state
- Callbacks not wrapped in useCallback when needed
- Values not memoized with useMemo when needed

### 6. Component Re-render Issues
- Components re-rendering unnecessarily
- Missing React.memo on expensive components
- Inline function/object creation in render
- Context value objects not memoized

### 7. Accessibility Violations
- Missing alt text on images
- Buttons without accessible names
- Form inputs without labels
- Missing ARIA attributes where needed
- Non-semantic HTML where semantic elements exist

## Diagnostic Process

1. **Scan Phase**
   - Parse all .tsx, .ts, .jsx, .js files
   - Build component tree and dependency graph
   - Identify React patterns and anti-patterns

2. **Analysis Phase**
   - Check each component for hooks violations
   - Validate prop usage against TypeScript types
   - Analyze useEffect dependency arrays
   - Detect closure scope issues
   - Profile re-render triggers

3. **Severity Ranking**
   - **Critical**: Will cause runtime errors or crashes
   - **Warning**: May cause bugs or poor UX
   - **Info**: Best practice violations or optimization opportunities

4. **Fix Generation**
   - Generate exact code fixes for each issue
   - Preserve formatting and style
   - Include explanation of why fix is needed

## Diagnostic Output Structure

```typescript
interface ReactDiagnosis {
  file: string;
  line: number;
  column: number;
  severity: 'critical' | 'warning' | 'info';
  category: 'hooks' | 'keys' | 'props' | 'effects' | 'closures' | 'performance' | 'accessibility';
  issue: string;
  currentCode: string;
  suggestedFix: string;
  explanation: string;
}
```

## Example Diagnosis

### Missing Key
```typescript
// ❌ CRITICAL: Missing key prop
// File: src/components/UserList.tsx:15:7

<ul>
  {users.map(user => (
    <li>{user.name}</li>
  ))}
</ul>

// ✅ Fix:
<ul>
  {users.map(user => (
    <li key={user.id}>{user.name}</li>
  ))}
</ul>

// Why: Without keys, React cannot efficiently update the list.
// When users are reordered, React will recreate all elements.
```

### Invalid Hook Usage
```typescript
// ❌ CRITICAL: Hook called conditionally
// File: src/hooks/useAuth.ts:23:5

function useAuth() {
  if (isLoggedIn) {
    const [user, setUser] = useState(null);  // ← Conditional hook
  }
  return user;
}

// ✅ Fix:
function useAuth() {
  const [user, setUser] = useState(null);
  
  if (!isLoggedIn) {
    return null;
  }
  
  return user;
}

// Why: Hooks must be called in the same order every render.
// Conditional hooks break this invariant and cause crashes.
```

### Missing useEffect Dependencies
```typescript
// ⚠️  WARNING: Missing dependency in useEffect
// File: src/components/DataFetcher.tsx:45:3

useEffect(() => {
  fetchData(userId);
}, []); // ← userId not in dependency array

// ✅ Fix:
useEffect(() => {
  fetchData(userId);
}, [userId, fetchData]);

// Why: Effect will not re-run when userId changes.
// If fetchData is not memoized, include it too.
```

### Stale Closure
```typescript
// ⚠️  WARNING: Stale closure in event handler
// File: src/components/Counter.tsx:12:9

function Counter() {
  const [count, setCount] = useState(0);
  
  const handleClick = () => {
    setTimeout(() => {
      console.log(count); // ← References stale count
    }, 1000);
  };
  
  return <button onClick={handleClick}>Click</button>;
}

// ✅ Fix:
function Counter() {
  const [count, setCount] = useState(0);
  
  const handleClick = useCallback(() => {
    setTimeout(() => {
      console.log(count); // Now references current count
    }, 1000);
  }, [count]);
  
  return <button onClick={handleClick}>Click</button>;
}

// Why: The setTimeout callback captures count at creation time.
// useCallback ensures handler is recreated when count changes.
```

### Unnecessary Re-renders
```typescript
// ℹ️  INFO: Component re-renders on every parent render
// File: src/components/ExpensiveChild.tsx:8:1

function ExpensiveChild({ data }: Props) {
  // Expensive computation or large render tree
  return <div>{/* ... */}</div>;
}

// ✅ Fix:
const ExpensiveChild = React.memo(({ data }: Props) => {
  // Expensive computation or large render tree
  return <div>{/* ... */}</div>;
});

// Why: Without memo, component re-renders even when props unchanged.
// This wastes CPU and can cause jank on slower devices.
```

### Missing Accessibility
```typescript
// ⚠️  WARNING: Image without alt text
// File: src/components/UserAvatar.tsx:10:5

<img src={user.avatarUrl} />

// ✅ Fix:
<img src={user.avatarUrl} alt={`${user.name}'s profile picture`} />

// Why: Screen readers cannot describe images without alt text.
// This excludes visually impaired users from understanding content.
```

## Output Format

The debugger writes a structured diagnosis report to `debug-reports/react-diagnosis.md`:

```markdown
# React Diagnosis Report
Generated: 2026-05-31 14:23:45

## Summary
- Critical issues: 3
- Warnings: 12
- Info: 7
- Files scanned: 45

## Critical Issues (3)

### 1. Missing key prop in list
**File**: src/components/UserList.tsx:15:7  
**Severity**: Critical  
**Category**: keys

[Current code block]
[Suggested fix block]
[Explanation]

---

[Additional issues...]

## Warnings (12)
[Similar format...]

## Info (7)
[Similar format...]

## Next Steps
1. Fix all critical issues immediately
2. Address warnings before next deployment
3. Consider info suggestions for code health
```

## Integration

The React Debugger can be invoked:
- Via CLI: `/debug react`
- Pre-commit hook: Automatically on staged React files
- CI/CD: As part of build validation
- IDE: On-demand from editor

All diagnosis reports are written to `debug-reports/` and can be reviewed, committed, or ignored as needed.
