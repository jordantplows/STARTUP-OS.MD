---
name: performance-doctor
role: doctor
language: both
triggers: [/doctor performance, /doctor perf, /doctor all]
reads:
  - user's codebase (passed via context)
  - React components (.tsx, .jsx files)
  - Bundle configuration (webpack, vite, etc.)
  - Image assets
writes:
  - diagnosis report to doctor-reports/performance-diagnosis.md
  - before/after code examples
---

# Performance Doctor

## What This Doctor Diagnoses

### 1. Unnecessary Re-renders
- Components re-rendering when props haven't changed
- Missing React.memo on expensive components
- Missing useMemo for expensive computations
- Missing useCallback for event handlers passed as props
- Context updates triggering too many re-renders

### 2. Bundle Size Issues
- Large imports when only small part is needed
- Moment.js or other non-tree-shakeable libraries
- Entire icon sets imported instead of individual icons
- CSS frameworks imported entirely instead of modularly
- Multiple versions of same library bundled

### 3. Unoptimized Images
- Images not compressed
- Images not using modern formats (WebP, AVIF)
- Missing responsive image sizes
- No lazy loading on below-fold images
- SVGs not optimized

### 4. Blocking Operations
- Synchronous API calls blocking render
- Heavy computations on main thread
- Long-running synchronous loops
- Blocking I/O operations
- setTimeout/setInterval instead of requestAnimationFrame for animations

### 5. Memory Leaks
- Event listeners not cleaned up
- Timers not cleared in cleanup
- Subscriptions not unsubscribed
- DOM references held after unmount
- Closure references preventing garbage collection

### 6. Network Performance
- No caching headers
- API calls not batched
- Missing request deduplication
- No optimistic updates
- GraphQL queries over-fetching

### 7. Render Performance
- Large lists without virtualization
- Complex CSS selectors
- Layout thrashing (read-write-read-write pattern)
- Forced synchronous layouts
- Too many DOM nodes

## Diagnostic Process

1. **Static Analysis Phase**
   - Scan components for missing memoization
   - Analyze bundle configuration
   - Find large imports
   - Detect synchronous operations

2. **Bundle Analysis Phase**
   - Run webpack-bundle-analyzer or equivalent
   - Identify largest chunks
   - Find duplicate dependencies
   - Calculate tree-shaking opportunities

3. **Image Audit Phase**
   - Scan for image assets
   - Check file sizes and formats
   - Validate responsive image usage
   - Find missing lazy loading

4. **Memory Profiling Phase**
   - Detect missing cleanup functions
   - Find unclosed subscriptions
   - Identify closure retention issues
   - Check for DOM reference leaks

5. **Render Profiling Phase**
   - Identify expensive component renders
   - Find components that re-render too often
   - Detect layout thrashing patterns
   - Measure component render times

## Diagnostic Output Structure

```typescript
interface PerformanceDiagnosis {
  file: string;
  line: number;
  severity: 'critical' | 'warning' | 'info';
  category: 're-renders' | 'bundle-size' | 'images' | 'blocking-ops' | 'memory-leaks' | 'network' | 'render-perf';
  issue: string;
  impact: string; // e.g., "+200ms render time", "+50KB bundle"
  currentCode: string;
  suggestedFix: string;
  explanation: string;
  measurement?: {
    before: string; // e.g., "320ms", "1.2MB"
    after: string;  // e.g., "45ms", "400KB"
  };
}
```

## Example Diagnosis

### Unnecessary Re-renders
```typescript
// ⚠️  WARNING: Component re-renders on every parent render
// File: src/components/ExpensiveList.tsx:15:1
// Impact: +200ms render time per parent update

function ExpensiveList({ items }: Props) {
  // Complex rendering logic
  return (
    <ul>
      {items.map(item => (
        <ComplexItem key={item.id} data={item} />
      ))}
    </ul>
  );
}

// ✅ Fix:
const ExpensiveList = React.memo(({ items }: Props) => {
  // Complex rendering logic
  return (
    <ul>
      {items.map(item => (
        <ComplexItem key={item.id} data={item} />
      ))}
    </ul>
  );
}, (prev, next) => {
  // Custom comparison if needed
  return prev.items === next.items;
});

// Measurement:
// Before: 320ms render time, 60 re-renders per session
// After: 45ms render time, 3 re-renders per session
// Improvement: 86% reduction in render time

// Why: Without memo, component re-renders even when items unchanged.
// On slow devices, this causes visible jank and delays user input.
```

### Large Import
```typescript
// ⚠️  WARNING: Entire library imported, tree-shaking impossible
// File: src/utils/format.ts:1:1
// Impact: +124 KB to bundle

import moment from 'moment';

export function formatDate(date: Date): string {
  return moment(date).format('MMM DD, YYYY');
}

// ✅ Fix:
import { format } from 'date-fns';

export function formatDate(date: Date): string {
  return format(date, 'MMM dd, yyyy');
}

// Bundle size:
// Before: moment = 232 KB (minified)
// After: date-fns = 15 KB (tree-shakeable, only format imported)
// Savings: 217 KB (93% reduction)

// Why: moment.js is not tree-shakeable and includes all locales.
// date-fns is modular and webpack only bundles functions you import.
```

### Unoptimized Image
```typescript
// ⚠️  WARNING: Large uncompressed image
// File: src/components/Hero.tsx:12:7
// Impact: +2.3 MB initial load, +4s LCP

<img 
  src="/images/hero-banner.png" 
  alt="Hero banner"
/>

// ✅ Fix:
<picture>
  <source
    srcSet="/images/hero-banner-640.webp 640w,
            /images/hero-banner-1280.webp 1280w,
            /images/hero-banner-1920.webp 1920w"
    type="image/webp"
  />
  <source
    srcSet="/images/hero-banner-640.jpg 640w,
            /images/hero-banner-1280.jpg 1280w,
            /images/hero-banner-1920.jpg 1920w"
    type="image/jpeg"
  />
  <img
    src="/images/hero-banner-1280.jpg"
    alt="Hero banner"
    loading="lazy"
    decoding="async"
  />
</picture>

// File sizes:
// Before: hero-banner.png = 2.3 MB
// After: hero-banner-1280.webp = 180 KB (for typical viewport)
// Savings: 2.12 MB (92% reduction)
// LCP improvement: 4.2s → 0.8s

// Why: PNG is lossless but huge. WebP provides better compression.
// Responsive images serve appropriate size per viewport.
// Lazy loading defers load until image enters viewport.
```

### Blocking Operation
```typescript
// ❌ CRITICAL: Synchronous CPU-intensive operation blocking UI
// File: src/utils/processor.ts:23:1
// Impact: +800ms main thread block, janky UI

function processLargeDataset(data: DataPoint[]): Result {
  // Synchronous processing of 50,000 items
  return data.map(item => {
    return expensiveComputation(item);
  });
}

// ✅ Fix (Option 1: Web Worker):
// processor.worker.ts
self.onmessage = (e) => {
  const result = e.data.map(item => expensiveComputation(item));
  self.postMessage(result);
};

// processor.ts
function processLargeDataset(data: DataPoint[]): Promise<Result> {
  return new Promise((resolve) => {
    const worker = new Worker('./processor.worker.ts');
    worker.onmessage = (e) => {
      resolve(e.data);
      worker.terminate();
    };
    worker.postMessage(data);
  });
}

// ✅ Fix (Option 2: Chunked Processing):
async function processLargeDataset(
  data: DataPoint[],
  onProgress?: (percent: number) => void
): Promise<Result> {
  const CHUNK_SIZE = 100;
  const result: Result = [];
  
  for (let i = 0; i < data.length; i += CHUNK_SIZE) {
    const chunk = data.slice(i, i + CHUNK_SIZE);
    
    // Process chunk
    result.push(...chunk.map(item => expensiveComputation(item)));
    
    // Yield to main thread
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // Report progress
    onProgress?.(((i + CHUNK_SIZE) / data.length) * 100);
  }
  
  return result;
}

// Performance:
// Before: 800ms main thread block (UI frozen)
// After (Worker): 0ms main thread block (UI responsive)
// After (Chunked): 5-10ms per chunk (UI responsive, progress visible)

// Why: Long synchronous operations freeze the UI and make app feel broken.
// Web Workers run on separate thread. Chunking yields periodically.
```

### Memory Leak
```typescript
// ❌ CRITICAL: Event listener not cleaned up
// File: src/hooks/useWindowSize.ts:8:3
// Impact: Memory leak grows by ~1KB per mount/unmount cycle

function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call
    
    // ❌ Missing cleanup!
  }, []);
  
  return size;
}

// ✅ Fix:
function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    // ✅ Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return size;
}

// Memory impact:
// Before: +1 KB per component mount, never freed
//         After 100 navigations: +100 KB leaked memory
// After: 0 KB leaked, listeners properly removed

// Why: Without cleanup, event listeners accumulate forever.
// Each unmount leaves a listener pointing to old component instance.
// This prevents garbage collection and causes memory to grow.
```

### No Request Deduplication
```typescript
// ⚠️  WARNING: Duplicate API requests not deduplicated
// File: src/hooks/useUser.ts:15:3
// Impact: 3x redundant API calls on initial load

function useUser(userId: string) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(r => r.json())
      .then(setUser);
  }, [userId]);
  
  return user;
}

// Problem: If 3 components call useUser('123'), 3 identical requests fire

// ✅ Fix (SWR):
import useSWR from 'swr';

function useUser(userId: string) {
  const { data: user } = useSWR(
    `/api/users/${userId}`,
    (url) => fetch(url).then(r => r.json()),
    { dedupingInterval: 2000 } // Dedupe requests within 2s
  );
  
  return user;
}

// ✅ Fix (Custom Cache):
const requestCache = new Map<string, Promise<any>>();

function useUser(userId: string) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const cacheKey = `/api/users/${userId}`;
    
    if (!requestCache.has(cacheKey)) {
      const promise = fetch(cacheKey)
        .then(r => r.json())
        .finally(() => {
          // Clear from cache after 2s
          setTimeout(() => requestCache.delete(cacheKey), 2000);
        });
      requestCache.set(cacheKey, promise);
    }
    
    requestCache.get(cacheKey)!.then(setUser);
  }, [userId]);
  
  return user;
}

// Network impact:
// Before: 3 identical requests = 3x server load, 3x bandwidth
// After: 1 request shared by all 3 components = 67% reduction

// Why: Multiple components mounting simultaneously make identical requests.
// Deduplication serves cached response to subsequent requests.
```

### Large List Without Virtualization
```typescript
// ⚠️  WARNING: Rendering 10,000 DOM nodes at once
// File: src/components/MessageList.tsx:18:1
// Impact: +2s initial render, 8,000+ DOM nodes

function MessageList({ messages }: { messages: Message[] }) {
  return (
    <div className="message-list">
      {messages.map(msg => (
        <MessageItem key={msg.id} message={msg} />
      ))}
    </div>
  );
}

// ✅ Fix (React Virtual):
import { useVirtualizer } from '@tanstack/react-virtual';

function MessageList({ messages }: { messages: Message[] }) {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60, // Estimated row height
    overscan: 5, // Render 5 extra items outside viewport
  });
  
  return (
    <div ref={parentRef} className="message-list">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map(virtualRow => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <MessageItem message={messages[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}

// Performance:
// Before: 10,000 DOM nodes, 2.1s initial render, janky scrolling
// After: ~20 DOM nodes (visible + overscan), 120ms render, smooth 60fps scroll
// Improvement: 500x fewer nodes, 94% faster initial render

// Why: Rendering thousands of nodes overwhelms the browser.
// Virtualization only renders what's visible in the viewport.
// As user scrolls, rows are recycled efficiently.
```

## Output Format

The doctor writes a structured diagnosis report to `doctor-reports/performance-diagnosis.md`:

```markdown
# Performance Diagnosis Report
Generated: 2026-05-31 14:23:45

## Summary
- Critical issues: 3
- Warnings: 12
- Info: 5
- Files scanned: 87
- Total potential improvement: -3.2MB bundle, -1.8s load time

## Performance Score: C (68/100)
- Bundle size: 2.1 MB (target: <500 KB) — D
- Initial load: 4.2s (target: <1s) — F
- Time to Interactive: 5.8s (target: <2s) — D
- Re-render efficiency: 73% (target: >90%) — C

## Critical Issues (3)

### 1. Synchronous operation blocking main thread
**File**: src/utils/processor.ts:23:1  
**Severity**: Critical  
**Impact**: +800ms UI freeze

[Current code]
[Suggested fix]
[Measurement]

---

[Additional issues...]

## Bundle Size Opportunities (-1.2 MB)
1. Replace moment with date-fns: -217 KB
2. Tree-shake @mui/icons: -180 KB
3. Remove unused dependencies: -95 KB
4. Optimize images: -720 KB

## Render Performance Opportunities (-1.2s)
1. Add virtualization to MessageList: -800ms initial render
2. Memo ExpensiveList component: -180ms
3. Move processing to Web Worker: -150ms UI block
4. Optimize image loading: -120ms LCP

## Memory Leak Fixes
1. Clean up event listeners in useWindowSize
2. Clear timers in usePolling hook
3. Unsubscribe from WebSocket in useRealtimeData

## Next Steps
1. Fix 3 critical issues immediately (memory leaks, blocking ops)
2. Implement bundle size improvements (target: <500 KB)
3. Add virtualization to large lists
4. Optimize images and lazy-load below-fold content
```

## Integration

The Performance Doctor can be invoked:
- Via CLI: `/doctor performance` or `/doctor perf`
- Before release: Check performance impact of changes
- Profiling mode: With actual runtime measurements
- CI/CD: Fail builds that regress bundle size or metrics

Reports include before/after measurements and exact code to paste.
