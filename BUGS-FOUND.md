# Logical Bugs Found in Brandie Codebase

## Critical Bugs (Must Fix Immediately)

### 1. **Race Condition in Token Usage** 🔴 CRITICAL
**File:** `src/lib/tokenService.ts:45-82`
**Severity:** High - Data Integrity Issue

**Problem:**
```typescript
// Lines 47-62
const currentBalance = await this.getTokenBalance(userId);
if (currentBalance < 1) {
  throw new Error('User has insufficient tokens');
}
const { data: updateData, error: updateError } = await supabase
  .from('user_tokens')
  .update({ balance: currentBalance - 1 })
```

**Issue:** Two concurrent calls to `useToken()` can both read the same balance (e.g., 1 token), both pass the check, and both successfully decrement, resulting in negative balances or double-charging.

**Impact:** Users could be charged multiple tokens for a single action or end up with negative balances.

**Fix:** Use database-level atomic operations or row-level locking:
```sql
UPDATE user_tokens
SET balance = balance - 1
WHERE user_id = ? AND balance >= 1
RETURNING balance;
```

---

### 2. **Token Consumed Even When Action Fails** 🔴 CRITICAL
**File:** `src/hooks/useTokenAction.ts:29-52`
**Severity:** High - User Experience & Billing

**Problem:**
```typescript
// Lines 34-40
const success = await useToken(currentAction.type, currentAction.description);
if (success) {
  await currentAction.callback();
  showToast('success', 'Action completed successfully');
}
```

**Issue:** Token is consumed first, then the action is executed. If the action (callback) fails, the token is already gone.

**Impact:** Users lose tokens even when the AI action fails, leading to unfair charges.

**Fix:** Execute callback first, only consume token if successful, or implement refunds.

---

### 3. **Incorrect Use of `.single()` Instead of `.maybeSingle()`** 🟠 HIGH
**Files:** Multiple files
- `src/contexts/TokenContext.tsx:54`
- `src/lib/tokenService.ts:20`
- `src/lib/brandService.ts:24, 67, 85, 100, 115, 130`
- `src/lib/visualService.ts:94, 112`

**Problem:**
`.single()` throws an error if 0 rows or >1 rows are returned. The code expects to handle "no rows" case with error code checking, but `.single()` throws before that.

**Example:**
```typescript
// Line 54 in TokenContext.tsx
const { data: tokenData, error: tokenError } = await supabase
  .from('user_tokens')
  .select('balance')
  .eq('user_id', user.id)
  .single(); // ❌ Will throw if no rows

if (tokenError.code === 'PGRST116') { // This won't work as expected
```

**Fix:** Use `.maybeSingle()` which returns `null` for 0 rows:
```typescript
const { data: tokenData, error: tokenError } = await supabase
  .from('user_tokens')
  .select('balance')
  .eq('user_id', user.id)
  .maybeSingle(); // ✅ Returns null if no rows

if (!tokenData) {
  // Handle no record case
}
```

---

### 4. **Stripe Webhook: Missing Return After No Subscriptions** 🔴 CRITICAL
**File:** `supabase/functions/stripe-webhook/index.ts:139-158`
**Severity:** Critical - Runtime Error

**Problem:**
```typescript
// Line 139-155
if (subscriptions.data.length === 0) {
  console.info(`No active subscriptions found for customer: ${customerId}`);
  const { error: noSubError } = await supabase.from('stripe_subscriptions').upsert(
    {
      customer_id: customerId,
      subscription_status: 'not_started',
    },
    {
      onConflict: 'customer_id',
    },
  );
  // ❌ MISSING RETURN STATEMENT!
}

// Line 158 - This will crash if subscriptions.data.length === 0
const subscription = subscriptions.data[0]; // undefined!
```

**Issue:** When there are no subscriptions (line 139), the code handles it but doesn't return. Execution continues to line 158 where it tries to access `subscriptions.data[0]`, which is `undefined`, causing a runtime error.

**Impact:**
- Webhook processing fails for customers with no subscriptions
- Stripe webhooks will receive 500 errors
- Could lead to Stripe disabling webhook endpoint

**Fix:** Add return statement after handling no subscriptions:
```typescript
if (subscriptions.data.length === 0) {
  // ... upsert code ...
  return; // ✅ Add this
}
```

---

## High Priority Bugs

### 5. **AI Analysis Result Ignored** 🟠 HIGH
**File:** `src/components/strategy/AIPilotPurpose.tsx:68-121`
**Severity:** Medium - Misleading Feature

**Problem:**
```typescript
// Line 81
const analysis = await generateStrategySuggestions('purpose', context)

// Lines 84-112 - analysis is never used, instead hardcoded templates:
const options = [
  {
    type: 'mission',
    title: 'Mission Statement',
    options: [
      `We exist to ${extractKeyPhrase(allResponses[0], 'help')}...`
```

**Issue:** The component claims to use AI but actually just uses string templates. The AI response is fetched but completely ignored.

**Impact:**
- Misleading users about AI capabilities
- Wasting API calls and tokens
- Setting `aiGenerated: true` when it's not AI-generated (line 142)

**Fix:** Actually use the AI analysis results or remove the AI call.

---

### 6. **Auth Redirect Logic Split Across Components** 🟡 MEDIUM
**Files:**
- `src/components/ProtectedRoute.tsx:14-19`
- `src/pages/Auth.tsx:21-28, 48-53`

**Problem:**
```typescript
// ProtectedRoute.tsx - saves redirect path
useEffect(() => {
  if (!user && !loading) {
    sessionStorage.setItem('redirectAfterLogin', location.pathname);
  }
}, [user, loading, location]);

// Auth.tsx - checks redirect on mount only
useEffect(() => {
  const redirectPath = sessionStorage.getItem('redirectAfterLogin')
  if (redirectPath) {
    sessionStorage.removeItem('redirectAfterLogin')
    navigate(redirectPath)
  }
}, [navigate])

// Auth.tsx - after signin, doesn't check sessionStorage
const { error } = await signIn(email, password)
if (error) throw error
navigate('/home') // ❌ Always goes to /home, ignores saved redirect
```

**Issues:**
1. ProtectedRoute continuously updates sessionStorage on every render when user is null
2. Auth.tsx checks redirect only on mount, not after successful login
3. After successful signin, always navigates to `/home` instead of checking redirect

**Impact:** Users aren't redirected to their intended destination after login.

**Fix:** Consolidate redirect logic and check sessionStorage after successful login.

---

### 7. **sessionStorage Never Cleaned Up** 🟡 MEDIUM
**File:** `src/components/ProtectedRoute.tsx:17`

**Problem:**
```typescript
sessionStorage.setItem('redirectAfterLogin', location.pathname);
```

**Issue:** The redirect path is saved but never cleaned up after successful redirect. If a user:
1. Tries to access `/brand/123/strategy` (saved to sessionStorage)
2. Logs in successfully (should redirect there)
3. Logs out and logs back in
4. Will be redirected to `/brand/123/strategy` even though they just wanted to log in normally

**Fix:** Remove from sessionStorage after successful redirect.

---

### 8. **Inefficient Sequential Brand Progress Loading** 🟡 MEDIUM
**File:** `src/pages/Dashboard.tsx:82-86`

**Problem:**
```typescript
const progressData: Record<string, any> = {}
for (const brand of [...userBrands, ...archived]) {
  const progress = await brandService.getBrandProgress(brand.id)
  progressData[brand.id] = progress
}
```

**Issue:** Loading progress for each brand sequentially. With 10 brands, this could take 5-10 seconds.

**Impact:** Slow dashboard load times for users with multiple brands.

**Fix:** Use `Promise.all()` to load in parallel:
```typescript
const progressPromises = [...userBrands, ...archived].map(brand =>
  brandService.getBrandProgress(brand.id)
);
const progressResults = await Promise.all(progressPromises);
```

---

### 9. **Brand Voice Query Could Return Multiple Rows** 🟡 MEDIUM
**File:** `src/lib/visualService.ts:152-167`

**Problem:**
```typescript
const { data, error } = await supabase
  .from('brand_voice')
  .select('*')
  .eq('brand_id', brandId) // No .single() or .maybeSingle()

return data && data.length > 0 ? data[0] : null
```

**Issue:** If there are duplicate brand_voice rows (database integrity issue), this silently returns the first one instead of failing or deduplicating.

**Impact:** Could mask data integrity issues.

**Fix:** Use `.maybeSingle()` to enforce single row expectation:
```typescript
const { data, error } = await supabase
  .from('brand_voice')
  .select('*')
  .eq('brand_id', brandId)
  .maybeSingle()
```

---

## Medium Priority Bugs

### 10. **useSupabase Hook Cannot Be Used** 🟡 MEDIUM
**File:** `src/lib/supabase.ts:117-129`

**Problem:**
```typescript
export const useSupabase = () => {
  const { showToast } = useToast() // ❌ Calling a hook in a non-component

  return {
    supabase,
    handleError
  }
}
```

**Issue:** This is exported as a utility function but calls `useToast()` hook, meaning it can only be used in React components. The naming suggests it's a hook but it's exported from a non-component file.

**Impact:**
- Confusing API
- Likely not used anywhere (should verify)
- Would break if used in a non-component context

**Fix:** Either:
1. Remove this unused hook
2. Move to a proper hooks file
3. Make it a regular function that accepts toast as parameter

---

### 11. **Modal Backdrop Click Handling Fragile** 🟢 LOW
**File:** `src/components/ui/Modal.tsx:93-105`

**Problem:**
```typescript
<motion.div
  onClick={onClose} // Close on backdrop click
  className="fixed inset-0 bg-black/50 z-40"
/>

<motion.div
  onClick={(e) => e.stopPropagation()} // Prevent close on modal click
  className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl"
>
```

**Issue:** Relies on event propagation stopping. If any child element doesn't call `stopPropagation`, clicking it will close the modal.

**Impact:** Potential UX issue where clicking certain elements unexpectedly closes modal.

**Fix:** Check `e.target === e.currentTarget` in backdrop click handler:
```typescript
<motion.div
  onClick={(e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }}
```

---

### 12. **Keyboard Shortcut in Auth Creates Synthetic Event** 🟢 LOW
**File:** `src/pages/Auth.tsx:30-35`

**Problem:**
```typescript
useKeyboardShortcut('Enter', () => {
  if (email && password) {
    handleSubmit(new Event('submit') as any) // ❌ Creates fake event
  }
}, { enabled: !loading })
```

**Issue:** Creating a synthetic `Event` and casting to `any` to bypass type checking.

**Impact:** Not a functional bug, but indicates poor architecture.

**Fix:** Extract logic from `handleSubmit` into a separate function:
```typescript
const submitForm = async () => {
  // Logic here
}

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  await submitForm()
}

useKeyboardShortcut('Enter', () => {
  if (email && password) {
    submitForm()
  }
})
```

---

## Low Priority / Code Quality Issues

### 13. **Commented Out Code in Modal.tsx** 🟢 LOW
**File:** `src/components/ui/Modal.tsx:1-64`

**Issue:** Entire old implementation is commented out instead of deleted.

**Impact:** Code clutter, confusing for developers.

**Fix:** Remove commented code.

---

### 14. **Unused Import in supabase.ts** 🟢 LOW
**File:** `src/lib/supabase.ts:2`

```typescript
import { useToast } from '../contexts/ToastContext' // Only used in unused hook
```

**Fix:** Remove if `useSupabase` hook is removed.

---

## Summary Statistics

- **Critical Bugs:** 4
- **High Priority:** 5
- **Medium Priority:** 3
- **Low Priority:** 3

**Total Issues Found:** 15

---

## Recommended Fix Order

1. ✅ Fix token race condition (Bug #1)
2. ✅ Fix Stripe webhook missing return (Bug #4)
3. ✅ Fix token consumption before action (Bug #2)
4. ✅ Replace all `.single()` with `.maybeSingle()` where appropriate (Bug #3)
5. ✅ Fix auth redirect logic (Bug #6, #7)
6. ✅ Remove or fix AI analysis in AIPilotPurpose (Bug #5)
7. ✅ Optimize dashboard loading (Bug #8)
8. ✅ Fix brand voice query (Bug #9)
9. ✅ Remove or fix useSupabase hook (Bug #10)
10. ✅ Improve modal click handling (Bug #11)
11. ✅ Refactor auth keyboard shortcut (Bug #12)
12. ✅ Clean up commented code (Bug #13, #14)

---

## Testing Recommendations

### For Bug #1 (Token Race Condition):
```javascript
// Test: Try to use 2 tokens simultaneously when user has only 1
const promises = [
  tokenService.useToken(userId, 'test1'),
  tokenService.useToken(userId, 'test2')
];
await Promise.all(promises);
// Should: One succeeds, one fails
// Currently: Both might succeed
```

### For Bug #2 (Token Consumed on Failure):
```javascript
// Test: Use token with a callback that throws
await useTokenAction('test', 'description', async () => {
  throw new Error('Callback failed');
});
// Should: Token not consumed
// Currently: Token is consumed
```

### For Bug #4 (Stripe Webhook):
```javascript
// Test: Simulate Stripe webhook for customer with no subscriptions
// 1. Create a test customer in Stripe with no subscriptions
// 2. Trigger checkout.session.completed event
// 3. Observe webhook processing
// Currently: Crashes with "Cannot read property '0' of undefined"
// Should: Successfully process and mark subscription as 'not_started'
```

### For Bug #6 (Auth Redirect):
```
1. Log out
2. Try to access /brand/123/strategy
3. Get redirected to /auth
4. Log in
5. Expected: Redirect to /brand/123/strategy
6. Actual: Redirect to /home
```
